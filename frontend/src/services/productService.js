import apiClient from './api';

// Initial realistic Nigerian market inventory items
const INITIAL_PRODUCTS = [
  {
    _id: 'prod_1',
    name: 'Garri (50g packs)',
    category: 'Dry Goods',
    price: 500,
    quantityInStock: 2,
    lowStockThreshold: 10,
    unit: 'packs',
  },
  {
    _id: 'prod_2',
    name: 'Peak Evaporated Milk (Tin)',
    category: 'Dairy & Beverages',
    price: 750,
    quantityInStock: 0,
    lowStockThreshold: 12,
    unit: 'tins',
  },
  {
    _id: 'prod_3',
    name: 'Gino Tomato Paste (70g sachet)',
    category: 'Provisions',
    price: 350,
    quantityInStock: 4,
    lowStockThreshold: 15,
    unit: 'sachets',
  },
  {
    _id: 'prod_4',
    name: 'Dangote Sugar (50kg bag)',
    category: 'Dry Goods',
    price: 82000,
    quantityInStock: 24,
    lowStockThreshold: 5,
    unit: 'bags',
  },
  {
    _id: 'prod_5',
    name: 'Golden Penny Spaghetti (Carton)',
    category: 'Packaged Food',
    price: 14500,
    quantityInStock: 45,
    lowStockThreshold: 8,
    unit: 'cartons',
  },
  {
    _id: 'prod_6',
    name: 'Indomie Hungryman (Carton)',
    category: 'Packaged Food',
    price: 12800,
    quantityInStock: 60,
    lowStockThreshold: 10,
    unit: 'cartons',
  },
  {
    _id: 'prod_7',
    name: 'Kings Vegetable Oil (5L Keg)',
    category: 'Oils & Fats',
    price: 11000,
    quantityInStock: 32,
    lowStockThreshold: 6,
    unit: 'kegs',
  },
];

const STORAGE_KEY = 'stockpile_products';
const GOODS_VALUATION_KEY = 'stockpile_total_goods_val';

/**
 * Get all products.
 * Tries the API first; falls back to localStorage or initial seed data.
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
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    } catch (e) {
      // Ignore parse error
    }
  }

  // Seed default items
  localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_PRODUCTS));
  return INITIAL_PRODUCTS;
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

  // If cost was provided, increase total goods valuation
  if (unitCost > 0) {
    const totalAdded = unitCost * Number(unitsToAdd);
    adjustTotalGoodsValuation(totalAdded);
  }

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

  // Calculate from seed products
  const defaultTotal = INITIAL_PRODUCTS.reduce(
    (acc, p) => acc + (p.quantityInStock || 0) * (p.price || 0),
    0
  );
  // Give a solid realistic default of ₦2,150,000 if calculated sum is lower
  const initial = Math.max(defaultTotal, 2150000);
  localStorage.setItem(GOODS_VALUATION_KEY, initial.toString());
  return initial;
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
