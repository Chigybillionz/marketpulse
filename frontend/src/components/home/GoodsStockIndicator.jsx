import { useState, useEffect } from 'react';
import {
  Package,
  AlertTriangle,
  CheckCircle,
  Plus,
  RotateCw,
  Search,
  ArrowUpRight,
  TrendingUp,
  Tag,
  PlusCircle,
  X,
  Check
} from 'lucide-react';
import {
  getProducts,
  updateProductStock,
  createProduct,
  restockProduct,
} from '../../services/productService';
import { useLanguage } from '../../i18n/LanguageContext';

export default function GoodsStockIndicator({ onNavigate }) {
  const { t } = useLanguage();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all'); // 'all', 'low', 'healthy'
  const [searchQuery, setSearchQuery] = useState('');

  // Quick Restock modal
  const [restockItem, setRestockItem] = useState(null);
  const [restockUnits, setRestockUnits] = useState('10');
  const [restockCost, setRestockCost] = useState('');

  // Add new product modal
  const [showAddModal, setShowAddModal] = useState(false);
  const [newProdName, setNewProdName] = useState('');
  const [newProdCategory, setNewProdCategory] = useState('Dry Goods');
  const [newProdPrice, setNewProdPrice] = useState('');
  const [newProdQty, setNewProdQty] = useState('');
  const [newProdThreshold, setNewProdThreshold] = useState('10');

  // Load products
  const loadGoods = async () => {
    setLoading(true);
    try {
      const data = await getProducts();
      setProducts(data);
    } catch (err) {
      console.error('Failed to load goods:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadGoods();
    const handleUpdate = () => loadGoods();
    window.addEventListener('inventoryUpdated', handleUpdate);
    return () => window.removeEventListener('inventoryUpdated', handleUpdate);
  }, []);

  // Split into Needs Restock vs Plenty
  const needsRestockList = products.filter(
    (p) => (p.quantityInStock || 0) <= (p.lowStockThreshold || 10)
  );
  const plentyList = products.filter(
    (p) => (p.quantityInStock || 0) > (p.lowStockThreshold || 10)
  );

  // Filtered displayed list
  const filteredProducts = products.filter((p) => {
    const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (p.category && p.category.toLowerCase().includes(searchQuery.toLowerCase()));
    if (!matchesSearch) return false;

    const isLow = (p.quantityInStock || 0) <= (p.lowStockThreshold || 10);
    if (filter === 'low') return isLow;
    if (filter === 'healthy') return !isLow;
    return true;
  });

  // Handle Quick Restock Submission
  const handleQuickRestockSubmit = async (e) => {
    e.preventDefault();
    if (!restockItem) return;
    const units = Number(restockUnits);
    if (!units || units <= 0) return;

    await restockProduct(restockItem._id, units, Number(restockCost) || 0);
    setRestockItem(null);
    setRestockUnits('10');
    setRestockCost('');
    await loadGoods();
  };

  // Handle Create Product Submission
  const handleCreateProductSubmit = async (e) => {
    e.preventDefault();
    if (!newProdName.trim() || !newProdPrice) return;

    await createProduct({
      name: newProdName.trim(),
      category: newProdCategory,
      price: Number(newProdPrice),
      quantityInStock: Number(newProdQty) || 0,
      lowStockThreshold: Number(newProdThreshold) || 10,
    });

    setShowAddModal(false);
    setNewProdName('');
    setNewProdPrice('');
    setNewProdQty('');
    await loadGoods();
  };

  return (
    <section style={{ padding: '0 20px 16px 20px' }}>
      <div
        style={{
          background: '#ffffff',
          borderRadius: 20,
          border: '1px solid #e2e8f0',
          padding: '18px 20px',
          boxShadow: '0 2px 8px rgba(0, 0, 0, 0.04)',
        }}
      >
        {/* Section Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <div
                style={{
                  width: 28,
                  height: 28,
                  borderRadius: 8,
                  backgroundColor: '#fef3c7',
                  color: '#b45309',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Package size={16} />
              </div>
              <h3 style={{ fontSize: 16, fontWeight: 800, color: '#1e293b', margin: 0 }}>
                Physical Goods & Shelf Check
              </h3>
            </div>
            <p style={{ fontSize: 12, color: '#64748b', margin: '4px 0 0 0', fontWeight: 500 }}>
              Look at your shop shelves: see wetin dey finish and wetin plenty
            </p>
          </div>

          <button
            onClick={() => setShowAddModal(true)}
            style={{
              background: '#064e3b',
              color: '#ffffff',
              border: 'none',
              borderRadius: 8,
              padding: '6px 10px',
              fontSize: 11,
              fontWeight: 700,
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              gap: 4,
            }}
          >
            <Plus size={13} /> + Add Item
          </button>
        </div>

        {/* Traffic-Light Status Bar */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: 10,
            marginBottom: 14,
          }}
        >
          {/* Needs Restock Pill */}
          <div
            onClick={() => setFilter(filter === 'low' ? 'all' : 'low')}
            style={{
              background: filter === 'low' ? '#fef2f2' : '#fff5f5',
              border: filter === 'low' ? '2px solid #ef4444' : '1px solid #fecaca',
              borderRadius: 12,
              padding: '10px 12px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              transition: 'all 0.15s ease',
            }}
          >
            <div
              style={{
                width: 28,
                height: 28,
                borderRadius: '50%',
                backgroundColor: '#fee2e2',
                color: '#dc2626',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: 900,
                fontSize: 12,
              }}
            >
              {needsRestockList.length}
            </div>
            <div>
              <div style={{ fontSize: 12, fontWeight: 800, color: '#991b1b' }}>
                🔴 {t('home_needs_restock', 'Needs Restock')}
              </div>
              <div style={{ fontSize: 10, color: '#b91c1c', fontWeight: 600 }}>
                Finishing fast or empty
              </div>
            </div>
          </div>

          {/* Plenty in Shop Pill */}
          <div
            onClick={() => setFilter(filter === 'healthy' ? 'all' : 'healthy')}
            style={{
              background: filter === 'healthy' ? '#f0fdf4' : '#f0fdf4',
              border: filter === 'healthy' ? '2px solid #16a34a' : '1px solid #bbf7d0',
              borderRadius: 12,
              padding: '10px 12px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              transition: 'all 0.15s ease',
            }}
          >
            <div
              style={{
                width: 28,
                height: 28,
                borderRadius: '50%',
                backgroundColor: '#dcfce7',
                color: '#15803d',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: 900,
                fontSize: 12,
              }}
            >
              {plentyList.length}
            </div>
            <div>
              <div style={{ fontSize: 12, fontWeight: 800, color: '#166534' }}>
                🟢 {t('home_plenty_in_shop', 'Plenty in Shop')}
              </div>
              <div style={{ fontSize: 10, color: '#15803d', fontWeight: 600 }}>
                Safe & full stock
              </div>
            </div>
          </div>
        </div>

        {/* Search input if multiple products */}
        {products.length > 3 && (
          <div style={{ position: 'relative', marginBottom: 12 }}>
            <input
              type="text"
              placeholder="Search shelf items (e.g. Garri, Sugar, Milk)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{
                width: '100%',
                padding: '8px 12px 8px 32px',
                borderRadius: 10,
                border: '1px solid #e2e8f0',
                fontSize: 12,
                boxSizing: 'border-box',
                background: '#f8fafc',
              }}
            />
            <Search
              size={14}
              color="#94a3b8"
              style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)' }}
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                style={{
                  position: 'absolute',
                  right: 8,
                  top: '50%',
                  transform: 'translateY(-50%)',
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  color: '#94a3b8',
                }}
              >
                ✕
              </button>
            )}
          </div>
        )}

        {/* ── GOODS LIST ── */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8, maxHeight: 360, overflowY: 'auto' }}>
          {filteredProducts.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '24px 12px', color: '#94a3b8', fontSize: 13 }}>
              No items match this filter.
            </div>
          ) : (
            filteredProducts.map((p) => {
              const qty = p.quantityInStock || 0;
              const threshold = p.lowStockThreshold || 10;
              const isLow = qty <= threshold;
              const isZero = qty === 0;

              return (
                <div
                  key={p._id}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '10px 12px',
                    borderRadius: 12,
                    background: isZero
                      ? '#fff1f2'
                      : isLow
                      ? '#fffbeb'
                      : '#f8fafc',
                    border: isZero
                      ? '1px solid #fecdd3'
                      : isLow
                      ? '1px solid #fde68a'
                      : '1px solid #f1f5f9',
                  }}
                >
                  {/* Left: Indicator dot + Item info */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10, flex: 1, minWidth: 0 }}>
                    <div
                      style={{
                        width: 10,
                        height: 10,
                        borderRadius: '50%',
                        backgroundColor: isZero ? '#e11d48' : isLow ? '#f59e0b' : '#22c55e',
                        flexShrink: 0,
                      }}
                    />
                    <div style={{ minWidth: 0 }}>
                      <div
                        style={{
                          fontSize: 13,
                          fontWeight: 700,
                          color: '#1e293b',
                          whiteSpace: 'nowrap',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                        }}
                      >
                        {p.name}
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 2 }}>
                        <span style={{ fontSize: 11, color: '#64748b' }}>
                          ₦{(p.price || 0).toLocaleString()} / {p.unit || 'unit'}
                        </span>
                        <span style={{ fontSize: 10, color: '#94a3b8' }}>•</span>
                        <span style={{ fontSize: 10, color: '#94a3b8' }}>{p.category}</span>
                      </div>
                    </div>
                  </div>

                  {/* Right: Quantity Badge + Restock Action */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexShrink: 0 }}>
                    <div style={{ textAlign: 'right' }}>
                      <div
                        style={{
                          fontSize: 12,
                          fontWeight: 800,
                          color: isZero ? '#e11d48' : isLow ? '#d97706' : '#15803d',
                        }}
                      >
                        {isZero ? '0 (EMPTY!)' : `${qty} in shop`}
                      </div>
                      <div
                        style={{
                          fontSize: 9,
                          fontWeight: 700,
                          color: isLow ? '#b91c1c' : '#166534',
                          textTransform: 'uppercase',
                        }}
                      >
                        {isZero ? 'RESTOCK NOW' : isLow ? 'FINISHING FAST' : 'PLENTY'}
                      </div>
                    </div>

                    {/* Quick Restock Button */}
                    <button
                      onClick={() => setRestockItem(p)}
                      title={`Restock ${p.name}`}
                      style={{
                        backgroundColor: isLow ? '#064e3b' : '#e2e8f0',
                        color: isLow ? '#ffffff' : '#334155',
                        border: 'none',
                        borderRadius: 8,
                        padding: '6px 10px',
                        fontSize: 11,
                        fontWeight: 700,
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: 3,
                      }}
                    >
                      <Plus size={12} /> Restock
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* ── QUICK RESTOCK MODAL ── */}
      {restockItem && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 100,
            background: 'rgba(0, 0, 0, 0.6)',
            backdropFilter: 'blur(4px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: 16,
          }}
        >
          <div
            style={{
              background: '#fff',
              borderRadius: 20,
              maxWidth: 400,
              width: '100%',
              padding: '24px',
              boxShadow: '0 20px 40px rgba(0, 0, 0, 0.2)',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
              <h3 style={{ margin: 0, fontSize: 17, fontWeight: 800, color: '#1e293b' }}>
                Restock: {restockItem.name}
              </h3>
              <button
                onClick={() => setRestockItem(null)}
                style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#94a3b8' }}
              >
                <X size={20} />
              </button>
            </div>

            <p style={{ margin: '0 0 16px', fontSize: 12, color: '#64748b' }}>
              Currently <strong>{restockItem.quantityInStock || 0}</strong> in shop. How many new units arrived?
            </p>

            <form onSubmit={handleQuickRestockSubmit}>
              <div style={{ marginBottom: 14 }}>
                <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: '#334155', marginBottom: 4 }}>
                  Units to Add *
                </label>
                <input
                  type="number"
                  value={restockUnits}
                  onChange={(e) => setRestockUnits(e.target.value)}
                  min="1"
                  required
                  autoFocus
                  style={{
                    width: '100%',
                    padding: '10px 12px',
                    borderRadius: 10,
                    border: '1px solid #cbd5e1',
                    fontSize: 16,
                    fontWeight: 700,
                    boxSizing: 'border-box',
                  }}
                />
              </div>

              {/* Quick unit chips */}
              <div style={{ display: 'flex', gap: 6, marginBottom: 14 }}>
                {[5, 10, 20, 50].map((n) => (
                  <button
                    key={n}
                    type="button"
                    onClick={() => setRestockUnits(n.toString())}
                    style={{
                      flex: 1,
                      background: restockUnits === n.toString() ? '#064e3b' : '#f1f5f9',
                      color: restockUnits === n.toString() ? '#fff' : '#334155',
                      border: 'none',
                      borderRadius: 8,
                      padding: '6px',
                      fontSize: 11,
                      fontWeight: 700,
                      cursor: 'pointer',
                    }}
                  >
                    +{n}
                  </button>
                ))}
              </div>

              <div style={{ marginBottom: 18 }}>
                <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: '#334155', marginBottom: 4 }}>
                  Unit Cost Price (₦) (Optional — for goods valuation)
                </label>
                <input
                  type="number"
                  placeholder={`e.g. ${restockItem.price}`}
                  value={restockCost}
                  onChange={(e) => setRestockCost(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '10px 12px',
                    borderRadius: 10,
                    border: '1px solid #cbd5e1',
                    fontSize: 14,
                    boxSizing: 'border-box',
                  }}
                />
              </div>

              <div style={{ display: 'flex', gap: 10 }}>
                <button
                  type="button"
                  onClick={() => setRestockItem(null)}
                  style={{
                    flex: 1,
                    background: '#f1f5f9',
                    border: 'none',
                    borderRadius: 10,
                    padding: '12px',
                    fontSize: 13,
                    fontWeight: 700,
                    color: '#64748b',
                    cursor: 'pointer',
                  }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  style={{
                    flex: 1,
                    background: '#064e3b',
                    border: 'none',
                    borderRadius: 10,
                    padding: '12px',
                    fontSize: 13,
                    fontWeight: 700,
                    color: '#fff',
                    cursor: 'pointer',
                  }}
                >
                  Save Stock
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ── ADD NEW PRODUCT MODAL ── */}
      {showAddModal && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 100,
            background: 'rgba(0, 0, 0, 0.6)',
            backdropFilter: 'blur(4px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: 16,
          }}
        >
          <div
            style={{
              background: '#fff',
              borderRadius: 20,
              maxWidth: 420,
              width: '100%',
              padding: '24px',
              boxShadow: '0 20px 40px rgba(0, 0, 0, 0.2)',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
              <h3 style={{ margin: 0, fontSize: 18, fontWeight: 800, color: '#1e293b' }}>
                Add Item to Shop
              </h3>
              <button
                onClick={() => setShowAddModal(false)}
                style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#94a3b8' }}
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleCreateProductSubmit}>
              <div style={{ marginBottom: 12 }}>
                <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: '#334155', marginBottom: 4 }}>
                  Product Name *
                </label>
                <input
                  type="text"
                  placeholder="e.g. Milo (500g tin), Milo sachet, Rice 50kg"
                  value={newProdName}
                  onChange={(e) => setNewProdName(e.target.value)}
                  required
                  autoFocus
                  style={{
                    width: '100%',
                    padding: '10px 12px',
                    borderRadius: 10,
                    border: '1px solid #cbd5e1',
                    fontSize: 14,
                    boxSizing: 'border-box',
                  }}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 12 }}>
                <div>
                  <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: '#334155', marginBottom: 4 }}>
                    Category
                  </label>
                  <select
                    value={newProdCategory}
                    onChange={(e) => setNewProdCategory(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '10px 8px',
                      borderRadius: 10,
                      border: '1px solid #cbd5e1',
                      fontSize: 13,
                      boxSizing: 'border-box',
                      background: '#fff',
                    }}
                  >
                    <option value="Dry Goods">Dry Goods</option>
                    <option value="Provisions">Provisions</option>
                    <option value="Packaged Food">Packaged Food</option>
                    <option value="Dairy & Beverages">Dairy & Beverages</option>
                    <option value="Oils & Fats">Oils & Fats</option>
                    <option value="Toiletries">Toiletries</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: '#334155', marginBottom: 4 }}>
                    Selling Price (₦) *
                  </label>
                  <input
                    type="number"
                    placeholder="e.g. 1500"
                    value={newProdPrice}
                    onChange={(e) => setNewProdPrice(e.target.value)}
                    required
                    style={{
                      width: '100%',
                      padding: '10px 12px',
                      borderRadius: 10,
                      border: '1px solid #cbd5e1',
                      fontSize: 14,
                      boxSizing: 'border-box',
                    }}
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 18 }}>
                <div>
                  <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: '#334155', marginBottom: 4 }}>
                    Starting Quantity
                  </label>
                  <input
                    type="number"
                    placeholder="e.g. 20"
                    value={newProdQty}
                    onChange={(e) => setNewProdQty(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '10px 12px',
                      borderRadius: 10,
                      border: '1px solid #cbd5e1',
                      fontSize: 14,
                      boxSizing: 'border-box',
                    }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: '#334155', marginBottom: 4 }}>
                    Low Stock Alert at
                  </label>
                  <input
                    type="number"
                    value={newProdThreshold}
                    onChange={(e) => setNewProdThreshold(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '10px 12px',
                      borderRadius: 10,
                      border: '1px solid #cbd5e1',
                      fontSize: 14,
                      boxSizing: 'border-box',
                    }}
                  />
                </div>
              </div>

              <div style={{ display: 'flex', gap: 10 }}>
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  style={{
                    flex: 1,
                    background: '#f1f5f9',
                    border: 'none',
                    borderRadius: 10,
                    padding: '12px',
                    fontSize: 13,
                    fontWeight: 700,
                    color: '#64748b',
                    cursor: 'pointer',
                  }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  style={{
                    flex: 1,
                    background: '#064e3b',
                    border: 'none',
                    borderRadius: 10,
                    padding: '12px',
                    fontSize: 13,
                    fontWeight: 700,
                    color: '#fff',
                    cursor: 'pointer',
                  }}
                >
                  Add Product
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </section>
  );
}
