import React from 'react';
import { Package, AlertTriangle, CheckCircle, ArrowRight } from 'lucide-react';

export default function InventorySection() {
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
      data-reveal="fade-up"
      className="bg-white py-16 md:py-24"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12">
        {/* Section header */}
        <div className="text-center max-w-3xl mx-auto mb-16 md:mb-20">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-100 text-orange-700 text-xs font-bold uppercase tracking-wider mb-6">
            <Package size={14} />
            Inventory
          </div>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-extrabold text-gray-900 mb-6 leading-tight">
            Never Run Out of
            <br />
            <span className="text-[#064E3B]">Best-Selling Stock</span>
          </h2>
          <p className="text-base md:text-lg text-gray-600 font-medium">
            Track your inventory levels, set smart reorder points, and get alerts
            before you run out of your top-selling products.
          </p>
        </div>

        {/* Inventory Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-12">
          {inventoryItems.map((item, index) => (
            <div
              key={item.name}
              className={`bg-[#F9FAFB] rounded-2xl p-5 border border-gray-100 hover:shadow-md transition-all duration-300 ${
                item.status === 'low' ? 'border-orange-200 bg-orange-50/30' : ''
              }`}
              style={{
                animation: 'fadeInUp 0.5s ease-out forwards',
                animationDelay: `${index * 100}ms`,
                opacity: 0,
              }}
            >
              <div className="flex items-start justify-between mb-3">
                <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center shadow-sm">
                  <Package size={20} className={item.status === 'low' ? 'text-orange-500' : 'text-green-600'} />
                </div>
                {item.status === 'low' && (
                  <div className="flex items-center gap-1 px-2 py-1 bg-orange-100 text-orange-700 rounded-full text-xs font-bold">
                    <AlertTriangle size={12} />
                    Reorder Now
                  </div>
                )}
              </div>

              <h3 className="font-bold text-gray-900 text-sm md:text-base mb-1">{item.name}</h3>
              <p className="text-xs text-gray-500 mb-4">{item.category}</p>

              {/* Stock bar */}
              <div className="mb-3">
                <div className="flex items-center justify-between text-sm mb-1">
                  <span className="font-semibold text-gray-700">{item.stock} units</span>
                  <span className="text-xs text-gray-500">Min: {item.threshold}</span>
                </div>
                <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${
                      item.status === 'low' ? 'bg-orange-400' : 'bg-green-400'
                    }`}
                    style={{
                      width: `${Math.min((item.stock / item.threshold) * 100, 100)}%`,
                      animation: 'growBar 0.8s ease-out forwards',
                      animationDelay: `${index * 100 + 200}ms`,
                      opacity: 0,
                    }}
                  />
                </div>
              </div>

              <div className="flex items-center justify-between text-xs text-gray-500">
                <span>Est. Value: ₦{(item.value / 1000).toFixed(0)}k</span>
                <span className={item.status === 'low' ? 'text-orange-600 font-semibold' : 'text-green-600'}>
                  {item.status === 'low' ? 'Below threshold' : 'Well stocked'}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Urgent alert */}
        {urgentItems.length > 0 && (
          <div
            className="bg-orange-50 border border-orange-200 rounded-2xl p-5 md:p-6 mb-12 flex items-center justify-between"
            style={{
              animation: 'fadeInUp 0.5s ease-out 0.6s forwards',
              opacity: 0,
            }}
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-orange-100 flex items-center justify-center">
                <AlertTriangle size={20} className="text-orange-600" />
              </div>
              <div>
                <h3 className="font-bold text-orange-900">Inventory Alert</h3>
                <p className="text-sm text-orange-700 mt-0.5">
                  {urgentItems.length} product{urgentItems.length > 1 ? 's' : ''} below minimum stock level
                </p>
              </div>
            </div>
            <button className="px-4 py-2 bg-orange-500 text-white rounded-xl text-sm font-bold hover:bg-orange-600 transition-colors flex items-center gap-2">
              <ArrowRight size={16} />
              View Alerts
            </button>
          </div>
        )}

        {/* Features */}
        <div className="grid md:grid-cols-3 gap-6">
          <div
            className="bg-[#F9FAFB] rounded-2xl p-6 border border-gray-100 flex items-start gap-4"
            style={{
              animation: 'fadeInUp 0.5s ease-out 0.8s forwards',
              opacity: 0,
              transition: 'all 0.5s ease-out',
            }}
          >
            <div className="w-12 h-12 rounded-xl bg-green-100 flex items-center justify-center flex-shrink-0">
              <Package size={24} className="text-green-600" />
            </div>
            <div>
              <h3 className="font-bold text-gray-900 mb-2">Smart Reorder Points</h3>
              <p className="text-sm text-gray-600 leading-relaxed">
                Set minimum stock levels for each product. MarketPulse tracks usage
                patterns and suggests optimal reorder quantities.
              </p>
            </div>
          </div>

          <div
            className="bg-[#F9FAFB] rounded-2xl p-6 border border-gray-100 flex items-start gap-4"
            style={{
              animation: 'fadeInUp 0.5s ease-out 1s forwards',
              opacity: 0,
              transition: 'all 0.5s ease-out',
            }}
          >
            <div className="w-12 h-12 rounded-xl bg-blue-100 flex items-center justify-center flex-shrink-0">
              <CheckCircle size={24} className="text-blue-600" />
            </div>
            <div>
              <h3 className="font-bold text-gray-900 mb-2">Low Stock Alerts</h3>
              <p className="text-sm text-gray-600 leading-relaxed">
                Get notified when inventory drops below threshold. Never miss a
                sales opportunity because you're out of stock.
              </p>
            </div>
          </div>

          <div
            className="bg-[#F9FAFB] rounded-2xl p-6 border border-gray-100 flex items-start gap-4 md:col-span-2"
            style={{
              animation: 'fadeInUp 0.5s ease-out 1.2s forwards',
              opacity: 0,
              transition: 'all 0.5s ease-out',
            }}
          >
            <div className="w-12 h-12 rounded-xl bg-purple-100 flex items-center justify-center flex-shrink-0">
              <svg className="w-6 h-6 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
            <div>
              <h3 className="font-bold text-gray-900 mb-2">Inventory Value Tracking</h3>
              <p className="text-sm text-gray-600 leading-relaxed max-w-2xl">
                See the total value of your inventory at a glance. Track cost vs.
                market value, and identify slow-moving products that tie up your capital.
              </p>
            </div>
          </div>
        </div>

        {/* Add animation styles */}
        <style>{`
          @keyframes fadeInUp {
            from {
              opacity: 0;
              transform: translateY(20px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }
          @keyframes growBar {
            0% {
              width: 0;
              opacity: 0;
            }
            100% {
              opacity: 1;
            }
          }
        `}</style>
      </div>
    </section>
  );
}
