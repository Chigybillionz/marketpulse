/**
 * InventorySection — operational, product-led rhythm (Phase 2).
 *
 * Stock cards enter in an operational cadence, the stock-level bars
 * fill horizontally via scaleX (no width animation), and the alert
 * banner enters last. All timing hangs off one in-view flag and runs
 * exactly once.
 */

import { Package, AlertTriangle, CheckCircle, ArrowRight } from 'lucide-react';
import useInView from './useInView';

const MP_EASE = 'cubic-bezier(0.22, 1, 0.36, 1)';

const staged = (visible, delay) => ({
  opacity: visible ? 1 : 0,
  transform: visible ? 'none' : 'translateY(18px)',
  transition: visible ? `opacity 600ms ${MP_EASE} ${delay}ms, transform 600ms ${MP_EASE} ${delay}ms` : 'none',
});

export default function InventorySection() {
  const [sectionRef, sectionInView] = useInView({ threshold: 0.15 });

  const inventoryItems = [
    {
      name: 'Garri (50kg bags)',
      category: 'Dry Goods',
      stock: 45,
      threshold: 20,
      value: 4500000,
      status: 'healthy',
    },
    {
      name: 'Indomie Cartons',
      category: 'Packaged Goods',
      stock: 12,
      threshold: 15,
      value: 1800000,
      status: 'low',
    },
    {
      name: 'Rice (50kg bags)',
      category: 'Grains',
      stock: 38,
      threshold: 25,
      value: 5700000,
      status: 'healthy',
    },
    {
      name: 'Palm Oil (25L jerrycans)',
      category: 'Cooking Essentials',
      stock: 22,
      threshold: 10,
      value: 2200000,
      status: 'healthy',
    },
  ];

  const urgentItems = inventoryItems.filter((item) => item.status === 'low');

  return (
    <section
      ref={sectionRef}
      data-reveal="fade-up"
      className="bg-white py-16 md:py-24"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-12">
        {/* Section header */}
        <div className="mx-auto mb-16 max-w-3xl text-center md:mb-20">
          <div
            data-reveal="data-entrance"
            className="mb-6 inline-flex items-center gap-2 rounded-full bg-orange-100 px-3 py-1 text-xs font-bold uppercase tracking-wider text-orange-700"
          >
            <Package size={14} />
            Inventory
          </div>
          <h2
            data-reveal="data-entrance"
            data-reveal-delay="80"
            className="mb-6 text-3xl font-extrabold leading-tight text-gray-900 md:text-4xl lg:text-5xl"
          >
            Never Run Out of
            <br />
            <span className="text-[#064E3B]">Best-Selling Stock</span>
          </h2>
          <p
            data-reveal="data-entrance"
            data-reveal-delay="160"
            className="text-base font-medium text-gray-600 md:text-lg"
          >
            Track your inventory levels, set smart reorder points, and get alerts
            before you run out of your top-selling products.
          </p>
        </div>

        {/* Inventory Grid */}
        <div className="mb-12 grid gap-4 md:grid-cols-2 md:gap-6 lg:grid-cols-4">
          {inventoryItems.map((item, index) => (
            <div
              key={item.name}
              className={`rounded-2xl border border-gray-100 bg-[#F9FAFB] p-5 transition-shadow duration-300 hover:shadow-md ${
                item.status === 'low' ? 'border-orange-200 bg-orange-50/30' : ''
              }`}
              style={staged(sectionInView, 100 + index * 110)}
            >
              <div className="mb-3 flex items-start justify-between">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white shadow-sm">
                  <Package size={20} className={item.status === 'low' ? 'text-orange-500' : 'text-green-600'} />
                </div>
                {item.status === 'low' && (
                  <div className="flex items-center gap-1 rounded-full bg-orange-100 px-2 py-1 text-xs font-bold text-orange-700">
                    <AlertTriangle size={12} />
                    Reorder Now
                  </div>
                )}
              </div>

              <h3 className="mb-1 text-sm font-bold text-gray-900 md:text-base">{item.name}</h3>
              <p className="mb-4 text-xs text-gray-500">{item.category}</p>

              {/* Stock bar — fills horizontally, once, in view */}
              <div className="mb-3">
                <div className="mb-1 flex items-center justify-between text-sm">
                  <span className="font-semibold text-gray-700">{item.stock} units</span>
                  <span className="text-xs text-gray-500">Min: {item.threshold}</span>
                </div>
                <div className="h-2 overflow-hidden rounded-full bg-gray-200">
                  <div
                    className={`h-full rounded-full ${
                      item.status === 'low' ? 'bg-orange-400' : 'bg-green-400'
                    }`}
                    style={{
                      width: `${Math.min((item.stock / item.threshold) * 100, 100)}%`,
                      transform: sectionInView ? 'scaleX(1)' : 'scaleX(0)',
                      transformOrigin: 'left',
                      transition: `transform 800ms ${MP_EASE} ${300 + index * 110}ms`,
                    }}
                  />
                </div>
              </div>

              <div className="flex items-center justify-between text-xs text-gray-500">
                <span>Est. Value: ₦{(item.value / 1000).toFixed(0)}k</span>
                <span className={item.status === 'low' ? 'font-semibold text-orange-600' : 'text-green-600'}>
                  {item.status === 'low' ? 'Below threshold' : 'Well stocked'}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Urgent alert */}
        {urgentItems.length > 0 && (
          <div
            className="mb-12 flex flex-col gap-4 rounded-2xl border border-orange-200 bg-orange-50 p-5 sm:flex-row sm:items-center sm:justify-between md:p-6"
            style={staged(sectionInView, 580)}
          >
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-orange-100">
                <AlertTriangle size={20} className="text-orange-600" />
              </div>
              <div>
                <h3 className="font-bold text-orange-900">Inventory Alert</h3>
                <p className="mt-0.5 text-sm text-orange-700">
                  {urgentItems.length} product{urgentItems.length > 1 ? 's' : ''} below minimum stock level
                </p>
              </div>
            </div>
            <button className="flex items-center justify-center gap-2 rounded-xl bg-orange-500 px-4 py-2 text-sm font-bold text-white transition-colors hover:bg-orange-600">
              <ArrowRight size={16} />
              View Alerts
            </button>
          </div>
        )}

        {/* Features */}
        <div className="grid gap-6 md:grid-cols-3">
          <div
            className="flex items-start gap-4 rounded-2xl border border-gray-100 bg-[#F9FAFB] p-6"
            style={staged(sectionInView, 700)}
          >
            <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl bg-green-100">
              <Package size={24} className="text-green-600" />
            </div>
            <div>
              <h3 className="mb-2 font-bold text-gray-900">Smart Reorder Points</h3>
              <p className="text-sm leading-relaxed text-gray-600">
                Set minimum stock levels for each product. MarketPulse tracks usage
                patterns and suggests optimal reorder quantities.
              </p>
            </div>
          </div>

          <div
            className="flex items-start gap-4 rounded-2xl border border-gray-100 bg-[#F9FAFB] p-6"
            style={staged(sectionInView, 820)}
          >
            <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl bg-blue-100">
              <CheckCircle size={24} className="text-blue-600" />
            </div>
            <div>
              <h3 className="mb-2 font-bold text-gray-900">Low Stock Alerts</h3>
              <p className="text-sm leading-relaxed text-gray-600">
                Get notified when inventory drops below threshold. Never miss a
                sales opportunity because you're out of stock.
              </p>
            </div>
          </div>

          <div
            className="flex items-start gap-4 rounded-2xl border border-gray-100 bg-[#F9FAFB] p-6 md:col-span-2 md:col-end-4 lg:col-span-1 lg:col-end-auto"
            style={staged(sectionInView, 940)}
          >
            <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl bg-purple-100">
              <svg className="h-6 w-6 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
            <div>
              <h3 className="mb-2 font-bold text-gray-900">Inventory Value Tracking</h3>
              <p className="max-w-2xl text-sm leading-relaxed text-gray-600">
                See the total value of your inventory at a glance. Track cost vs.
                market value, and identify slow-moving products that tie up your capital.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
