import apiClient from './api';

// Brand new users start with an empty shelf and clean dashboard
export const INITIAL_PRODUCTS = [];

const STORAGE_KEY = 'stockpile_products';
const GOODS_VALUATION_KEY = 'stockpile_total_goods_val';
const RESTOCK_LOG_KEY = 'stockpile_restock_log';

// Automatic migration: strip out old hardcoded demo seed items so dashboards are clean
try {
  const restocks = localStorage.getItem(RESTOCK_LOG_KEY);
  if (restocks) {
    const parsed = JSON.parse(restocks);
    if (Array.isArray(parsed) && parsed.length > 0) {
      const userOnly = parsed.filter(
        (r) => !['rst_1', 'rst_2', 'rst_3', 'rst_4', 'rst_5', 'rst_6'].includes(r?.id)
      );
      if (userOnly.length !== parsed.length) {
        localStorage.setItem(RESTOCK_LOG_KEY, JSON.stringify(userOnly));
      }
    }
  }

  const products = localStorage.getItem(STORAGE_KEY);
  if (products) {
    const parsed = JSON.parse(products);
    if (Array.isArray(parsed) && parsed.length > 0) {
      const userOnly = parsed.filter(
        (p) => !(typeof p?._id === 'string' && /^prod_[1-7]$/.test(p._id))
      );
      if (userOnly.length !== parsed.length) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(userOnly));
      }
    }
  }

  // Clear demo valuation defaults (2150000, 4742900, 4772900) so merchants start at 0 or real items
  const val = localStorage.getItem(GOODS_VALUATION_KEY);
  if (val === '2150000' || val === '4742900' || val === '4772900') {
    const storedProducts = localStorage.getItem(STORAGE_KEY);
    let realSum = 0;
    if (storedProducts) {
      try {
        const pList = JSON.parse(storedProducts);
        if (Array.isArray(pList)) {
          realSum = pList.reduce((acc, p) => acc + (p.quantityInStock || 0) * (p.price || 0), 0);
        }
      } catch (e) {}
    }
    localStorage.setItem(GOODS_VALUATION_KEY, realSum.toString());
  }
} catch (e) {
  // Ignore migration errors
}

/**
 * Get all products.
 * Tries the API first; falls back to localStorage.
 */
export async function getProducts() {
  try {
    const res = await apiClient('/products');
    if (Array.isArray(res) && res.length > 0) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(res));
      return res;
    }
  } catch (err) {
    // API unavailable or unauthenticated, use local storage
  }

  const cached = localStorage.getItem(STORAGE_KEY);
  if (cached) {
    try {
      const parsed = JSON.parse(cached);
      if (Array.isArray(parsed)) {
        return parsed;
      }
    } catch (e) {
      // Ignore parse error
    }
  }

  // Brand new starter shelf is clean and empty
  localStorage.setItem(STORAGE_KEY, JSON.stringify([]));
  return [];
}

/**
 * Add a new product
 */
export async function createProduct(productData) {
  let created = null;
  try {
    created = await apiClient('/products', {
      method: 'POST',
      body: JSON.stringify(productData),
    });
  } catch (err) {
    // Local fallback
    created = {
      ...productData,
      _id: 'prod_' + Date.now(),
      createdAt: new Date().toISOString(),
    };
  }

  const existing = await getProducts();
  const updated = [created, ...existing.filter((p) => p._id !== created._id)];
  localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  window.dispatchEvent(new CustomEvent('inventoryUpdated'));
  return created;
}

/**
 * Update product stock quantity
 */
export async function updateProductStock(id, newQuantity) {
  const quantity = Math.max(0, Number(newQuantity) || 0);

  try {
    await apiClient(`/products/${id}`, {
      method: 'PUT',
      body: JSON.stringify({ quantityInStock: quantity }),
    });
  } catch (err) {
    // Handled locally
  }

  const products = await getProducts();
  const updated = products.map((p) =>
    p._id === id ? { ...p, quantityInStock: quantity } : p
  );
  localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  window.dispatchEvent(new CustomEvent('inventoryUpdated'));
  return updated.find((p) => p._id === id);
}

/**
 * Quick restock an existing product by adding units
 */
export async function restockProduct(id, unitsToAdd, unitCost = 0) {
  const products = await getProducts();
  const product = products.find((p) => p._id === id);
  if (!product) return null;

  const newQty = (product.quantityInStock || 0) + Number(unitsToAdd);
  const updated = await updateProductStock(id, newQty);

  const totalAdded = unitCost > 0 ? Number(unitCost) * Number(unitsToAdd) : (product.price || 0) * Number(unitsToAdd);

  // If cost was provided or calculated, increase total goods valuation
  if (totalAdded > 0) {
    adjustTotalGoodsValuation(totalAdded);
  }

  // Record this restock in the restock log
  addRestockRecord({
    name: product.name,
    quantity: Number(unitsToAdd),
    unit: product.unit || 'units',
    amount: totalAdded,
    source: 'manual',
  });

  return updated;
}

/**
 * Get the Shop's Total Goods Valuation
 */
export function getTotalGoodsValuation() {
  const val = localStorage.getItem(GOODS_VALUATION_KEY);
  if (val !== null && !isNaN(Number(val))) {
    return Number(val);
  }

  // Starter value for brand new accounts is 0
  return 0;
}

/**
 * Set the Shop's Total Goods Valuation manually
 */
export function setTotalGoodsValuation(amount) {
  const cleanAmount = Math.max(0, Number(amount) || 0);
  localStorage.setItem(GOODS_VALUATION_KEY, cleanAmount.toString());
  window.dispatchEvent(new CustomEvent('goodsValuationUpdated', { detail: cleanAmount }));
  return cleanAmount;
}

/**
 * Adjust the Total Goods Valuation by adding or subtracting
 */
export function adjustTotalGoodsValuation(delta) {
  const current = getTotalGoodsValuation();
  const updated = Math.max(0, current + Number(delta));
  localStorage.setItem(GOODS_VALUATION_KEY, updated.toString());
  window.dispatchEvent(new CustomEvent('goodsValuationUpdated', { detail: updated }));
  return updated;
}

/**
 * ── RESTOCK HISTORY / LOG SERVICE ──
 */
const INITIAL_RESTOCKS = [];

/**
 * Retrieve the array of all restocked records
 */
export function getRestockHistory() {
  const stored = localStorage.getItem(RESTOCK_LOG_KEY);
  if (stored) {
    try {
      const parsed = JSON.parse(stored);
      if (Array.isArray(parsed)) return parsed;
    } catch (e) {
      // fallback
    }
  }
  localStorage.setItem(RESTOCK_LOG_KEY, JSON.stringify(INITIAL_RESTOCKS));
  return INITIAL_RESTOCKS;
}

/**
 * Append a new restock item to the history log
 */
export function addRestockRecord(record) {
  const current = getRestockHistory();
  const now = new Date();
  const timeStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  const newEntry = {
    id: 'rst_' + Date.now() + '_' + Math.random().toString(36).substring(2, 6),
    name: record.name || 'Restocked Merchandise',
    quantity: Number(record.quantity) || 1,
    unit: record.unit || 'units',
    amount: Math.max(0, Number(record.amount) || 0),
    source: record.source || 'voice', // 'voice' | 'manual'
    timestamp: `Today, ${timeStr}`,
    rawDate: now.toISOString(),
    ...record,
  };

  const updated = [newEntry, ...current];
  localStorage.setItem(RESTOCK_LOG_KEY, JSON.stringify(updated));
  window.dispatchEvent(new CustomEvent('restockHistoryUpdated', { detail: updated }));
  return newEntry;
}
