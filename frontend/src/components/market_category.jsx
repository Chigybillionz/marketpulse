import { useState } from 'react';

const CATEGORIES = [
  {
    id: 'dry-goods',
    label: 'Dry Goods',
    description: 'Grains, spices, and packaged food',
    bgColor: '#dcfce7', // Mint Green / Light Green
    iconColor: '#166534',
    icon: (
      <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 8v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8" />
        <path d="M21 8l-2-4H5L3 8" />
        <path d="M10 12h4" />
      </svg>
    ),
    watermark: (
      <svg className="absolute right-4 bottom-4 w-20 h-20 text-[#f1f5f9] pointer-events-none" viewBox="0 0 100 100" fill="currentColor">
        {/* Diamond dot pattern watermark */}
        <circle cx="50" cy="20" r="6" />
        <circle cx="35" cy="35" r="6" />
        <circle cx="65" cy="35" r="6" />
        <circle cx="20" cy="50" r="6" />
        <circle cx="50" cy="50" r="6" />
        <circle cx="80" cy="50" r="6" />
        <circle cx="35" cy="65" r="6" />
        <circle cx="65" cy="65" r="6" />
        <circle cx="50" cy="80" r="6" />
      </svg>
    )
  },
  {
    id: 'produce',
    label: 'Produce',
    description: 'Fresh fruits, vegetables, and tubers',
    bgColor: '#608c66', // Sage Green solid
    iconColor: '#ffffff', // White icon
    icon: (
      <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="13" r="7" />
        <path d="M12 6c0-2 2-3 4-3s2 1.5 2 1.5-1 3.5-3 4.5" />
        <path d="M12 6a4 4 0 0 0-4 4" />
      </svg>
    ),
    watermark: (
      <svg className="absolute right-0 bottom-0 w-28 h-28 text-[#f1f5f9] pointer-events-none translate-x-4 translate-y-4" viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round">
        {/* Large leaf watermark */}
        <path d="M10 90 C 20 40, 60 20, 90 10" />
        <path d="M90 10 C 70 50, 40 70, 10 90" />
        <path d="M35 55 C 45 45, 55 45, 60 30" />
        <path d="M55 35 C 65 25, 75 25, 80 15" />
      </svg>
    )
  },
  {
    id: 'electronics',
    label: 'Electronics',
    description: 'Phones, accessories, and power tools',
    bgColor: '#dbeafe', // Light blue
    iconColor: '#1e40af', // Dark Slate Blue
    icon: (
      <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="3" width="14" height="11" rx="2" />
        <line x1="6" y1="14" x2="6" y2="18" />
        <line x1="12" y1="14" x2="12" y2="18" />
        <line x1="4" y1="18" x2="14" y2="18" />
        <rect x="17" y="9" width="5" height="9" rx="1" />
      </svg>
    ),
    watermark: (
      <svg className="absolute right-0 bottom-0 w-24 h-32 text-[#f1f5f9] pointer-events-none translate-x-2" viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round">
        {/* Lightning bolt watermark */}
        <path d="M60 10 L25 55 L55 55 L40 90 L80 40 L50 40 Z" />
      </svg>
    )
  },
  {
    id: 'textiles',
    label: 'Textiles',
    description: 'Fabrics, garments, and traditional attire',
    bgColor: '#f59e0b', // Amber / Orange solid
    iconColor: '#000000', // Black icon
    icon: (
      <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 2a3 3 0 0 0-3 3c0 .8.3 1.5.8 2.1l-6.3 5.4C3.2 12.8 3 13.4 3 14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2c0-.6-.2-1.2-.5-1.5l-6.3-5.4c.5-.6.8-1.3.8-2.1a3 3 0 0 0-3-3z" />
      </svg>
    ),
    watermark: (
      <svg className="absolute right-0 bottom-0 w-24 h-24 text-[#f1f5f9] pointer-events-none" viewBox="0 0 100 100">
        {/* Diagonal stripes watermark */}
        <line x1="0" y1="100" x2="100" y2="0" stroke="currentColor" strokeWidth="8" />
        <line x1="25" y1="100" x2="100" y2="25" stroke="currentColor" strokeWidth="8" />
        <line x1="50" y1="100" x2="100" y2="50" stroke="currentColor" strokeWidth="8" />
        <line x1="75" y1="100" x2="100" y2="75" stroke="currentColor" strokeWidth="8" />
        <line x1="0" y1="75" x2="75" y2="0" stroke="currentColor" strokeWidth="8" />
        <line x1="0" y1="50" x2="50" y2="0" stroke="currentColor" strokeWidth="8" />
        <line x1="0" y1="25" x2="25" y2="0" stroke="currentColor" strokeWidth="8" />
      </svg>
    )
  }
];

export default function MarketCategory({ onNavigate }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedId, setSelectedId] = useState('dry-goods');

  // Filter categories based on search input
  const filteredCategories = CATEGORIES.filter(
    (cat) =>
      cat.label.toLowerCase().includes(searchQuery.toLowerCase()) ||
      cat.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-[#eef1f7] flex justify-center items-center p-0 sm:p-4 font-sans text-gray-800 antialiased selection:bg-[#052e16] selection:text-white">
      {/* Mobile Screen Container Mockup */}
      <div className="w-full max-w-[430px] min-h-[850px] bg-[#f8f9ff] sm:rounded-[40px] sm:shadow-2xl overflow-hidden border border-gray-100 flex flex-col relative sm:my-4 pb-28">
        
        {/* 1. Top Navigation Bar */}
        <header className="flex justify-between items-center px-5 py-4 bg-[#f8f9ff]/95 backdrop-blur-md sticky top-0 z-30">
          <button 
            onClick={() => onNavigate('profile')}
            className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors text-gray-900 cursor-pointer"
            aria-label="Go back"
          >
            {/* Simple Back Arrow */}
            <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="19" y1="12" x2="5" y2="12" />
              <polyline points="12 19 5 12 12 5" />
            </svg>
          </button>
          
          <h1 className="font-extrabold text-gray-950 text-xl tracking-tight font-sans">
            Market Category
          </h1>
          
          {/* User Profile Avatar */}
          <div className="w-10 h-10 rounded-full overflow-hidden border border-gray-200">
            <img 
              src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=120" 
              alt="User profile" 
              className="w-full h-full object-cover"
            />
          </div>
        </header>

        {/* Scrollable Content Container */}
        <div className="flex-1 overflow-y-auto px-5">
          
          {/* 2. Search & Filter Bar */}
          <div className="mt-2 relative">
            <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
              {/* Search Magnifying Glass Icon */}
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="11" cy="11" r="8" />
                <line x1="21" y1="21" x2="16.65" y2="16.65" />
              </svg>
            </span>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search for your niche..."
              className="w-full bg-white text-[15px] font-medium text-gray-800 placeholder-gray-400 rounded-lg pl-11 pr-4 py-3 border border-gray-200 focus:border-[#052e16] focus:outline-none transition-all duration-200"
            />
          </div>

          {/* 3. Section Header */}
          <div className="pt-8 pb-3">
            <h2 className="text-xs font-extrabold text-gray-400 tracking-wider uppercase font-sans">
              SELECT PRIMARY NICHE
            </h2>
          </div>

          {/* 4. Category Selection List (Scrollable Cards) */}
          <div className="flex flex-col gap-4 pb-6">
            {filteredCategories.length > 0 ? (
              filteredCategories.map((category) => {
                const isSelected = selectedId === category.id;
                return (
                  <button
                    key={category.id}
                    onClick={() => setSelectedId(category.id)}
                    className={`w-full text-left bg-white rounded-2xl p-5 border transition-all duration-200 relative overflow-hidden flex flex-col justify-between min-h-[160px] cursor-pointer ${
                      isSelected 
                        ? 'border-[#052e16] border-[2px] shadow-[0_4px_20px_rgba(5,46,22,0.06)]' 
                        : 'border-[#e2e8f0] shadow-[0_2px_8px_rgba(0,0,0,0.02)] hover:border-gray-300'
                    }`}
                  >
                    {/* Top row: Icon Box */}
                    <div 
                      className="w-12 h-12 rounded-xl flex items-center justify-center mb-6"
                      style={{ backgroundColor: category.bgColor, color: category.iconColor }}
                    >
                      {category.icon}
                    </div>

                    {/* Bottom row: Text Info */}
                    <div className="z-10 relative pr-20">
                      <h3 className="font-extrabold text-gray-950 text-lg leading-snug">
                        {category.label}
                      </h3>
                      <p className="text-xs font-medium text-gray-500 mt-1 leading-relaxed">
                        {category.description}
                      </p>
                    </div>

                    {/* Right Section Watermark Pattern */}
                    {category.watermark}
                  </button>
                );
              })
            ) : (
              <div className="text-center py-12 text-gray-400 font-medium">
                No matching niches found
              </div>
            )}
          </div>

        </div>

        {/* 5. Fixed Primary Action Button at Bottom */}
        <div className="absolute bottom-0 left-0 right-0 px-5 py-6 bg-gradient-to-t from-[#f8f9ff] via-[#f8f9ff] to-transparent sticky-bottom z-30">
          <button
            onClick={() => onNavigate('profile')}
            className="w-full bg-[#052e16] hover:bg-[#084221] active:scale-[0.98] text-white font-extrabold py-4 px-6 rounded-xl flex items-center justify-center gap-2 cursor-pointer shadow-md hover:shadow-lg transition-all duration-200 text-sm tracking-wide"
          >
            <span>Update Category</span>
            {/* Double Checkmark Icon */}
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="20 6 9 17 4 12" />
              <polyline points="16 6 9 13.5 9 13.5" />
            </svg>
          </button>
        </div>

      </div>
    </div>
  );
}
