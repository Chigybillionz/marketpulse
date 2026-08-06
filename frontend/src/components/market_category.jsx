import { useState } from "react";
import { CheckCircle2 } from "lucide-react";

const CATEGORIES = [
  {
    id: "dry-goods",
    label: "Dry Goods",
    description: "Grains, spices, and packaged food",
    bgColor: "#e8f3e8",
    iconColor: "#305c36",
    icon: (
      <svg
        className="w-6 h-6"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M21 8v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8" />
        <path d="M21 8l-2-4H5L3 8" />
        <path d="M10 12h4" />
      </svg>
    ),
    watermark: (
      <svg
        className="absolute right-4 bottom-4 w-20 h-20 text-[#f1f5f9] pointer-events-none"
        viewBox="0 0 100 100"
        fill="currentColor"
      >
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
    ),
  },
  {
    id: "produce",
    label: "Produce",
    description: "Fresh fruits, vegetables, and tubers",
    bgColor: "#d9e6da",
    iconColor: "#305c36",
    icon: (
      <svg
        className="w-6 h-6"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <circle cx="12" cy="13" r="7" />
        <path d="M12 6c0-2 2-3 4-3s2 1.5 2 1.5-1 3.5-3 4.5" />
        <path d="M12 6a4 4 0 0 0-4 4" />
      </svg>
    ),
    watermark: (
      <svg
        className="absolute right-0 bottom-0 w-28 h-28 text-[#f1f5f9] pointer-events-none translate-x-4 translate-y-4"
        viewBox="0 0 100 100"
        fill="none"
        stroke="currentColor"
        strokeWidth="5"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        {/* Large leaf watermark */}
        <path d="M10 90 C 20 40, 60 20, 90 10" />
        <path d="M90 10 C 70 50, 40 70, 10 90" />
        <path d="M35 55 C 45 45, 55 45, 60 30" />
        <path d="M55 35 C 65 25, 75 25, 80 15" />
      </svg>
    ),
  },
  {
    id: "electronics",
    label: "Electronics",
    description: "Phones, accessories, and power tools",
    bgColor: "#e3ebf7",
    iconColor: "#35527b",
    icon: (
      <svg
        className="w-6 h-6"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <rect x="2" y="3" width="14" height="11" rx="2" />
        <line x1="6" y1="14" x2="6" y2="18" />
        <line x1="12" y1="14" x2="12" y2="18" />
        <line x1="4" y1="18" x2="14" y2="18" />
        <rect x="17" y="9" width="5" height="9" rx="1" />
      </svg>
    ),
    watermark: (
      <svg
        className="absolute right-0 bottom-0 w-24 h-32 text-[#f1f5f9] pointer-events-none translate-x-2"
        viewBox="0 0 100 100"
        fill="none"
        stroke="currentColor"
        strokeWidth="5"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        {/* Lightning bolt watermark */}
        <path d="M60 10 L25 55 L55 55 L40 90 L80 40 L50 40 Z" />
      </svg>
    ),
  },
  {
    id: "textiles",
    label: "Textiles",
    description: "Fabrics, garments, and traditional attire",
    bgColor: "#f2e4bd",
    iconColor: "#6c5414",
    icon: (
      <svg
        className="w-6 h-6"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M12 2a3 3 0 0 0-3 3c0 .8.3 1.5.8 2.1l-6.3 5.4C3.2 12.8 3 13.4 3 14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2c0-.6-.2-1.2-.5-1.5l-6.3-5.4c.5-.6.8-1.3.8-2.1a3 3 0 0 0-3-3z" />
      </svg>
    ),
    watermark: (
      <svg
        className="absolute right-0 bottom-0 w-24 h-24 text-[#f1f5f9] pointer-events-none"
        viewBox="0 0 100 100"
      >
        {/* Diagonal stripes watermark */}
        <line
          x1="0"
          y1="100"
          x2="100"
          y2="0"
          stroke="currentColor"
          strokeWidth="8"
        />
        <line
          x1="25"
          y1="100"
          x2="100"
          y2="25"
          stroke="currentColor"
          strokeWidth="8"
        />
        <line
          x1="50"
          y1="100"
          x2="100"
          y2="50"
          stroke="currentColor"
          strokeWidth="8"
        />
        <line
          x1="75"
          y1="100"
          x2="100"
          y2="75"
          stroke="currentColor"
          strokeWidth="8"
        />
        <line
          x1="0"
          y1="75"
          x2="75"
          y2="0"
          stroke="currentColor"
          strokeWidth="8"
        />
        <line
          x1="0"
          y1="50"
          x2="50"
          y2="0"
          stroke="currentColor"
          strokeWidth="8"
        />
        <line
          x1="0"
          y1="25"
          x2="25"
          y2="0"
          stroke="currentColor"
          strokeWidth="8"
        />
      </svg>
    ),
  },
];

export default function MarketCategory({ onNavigate }) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedId, setSelectedId] = useState("dry-goods");
  const [showNotification, setShowNotification] = useState(false);

  const handleUpdate = () => {
    setShowNotification(true);
    setTimeout(() => {
      setShowNotification(false);
      if (onNavigate) {
        onNavigate("profile");
      }
    }, 2000);
  };

  const selectedCategory =
    CATEGORIES.find((category) => category.id === selectedId) || CATEGORIES[0];

  const filteredCategories = CATEGORIES.filter(
    (cat) =>
      cat.label.toLowerCase().includes(searchQuery.toLowerCase()) ||
      cat.description.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  return (
    <div className="market-category-page">
      <div className="market-category-shell">
        <header className="market-category-topbar">
          <button
            type="button"
            className="market-category-back"
            onClick={() => onNavigate && onNavigate("profile")}
            aria-label="Go back"
          >
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path d="M19 12H5M12 5l-7 7 7 7" />
            </svg>
          </button>

          <div className="market-category-titleblock">
            <p>Select the niche that best describes your store</p>
            <h1>Market Category</h1>
          </div>

          <button
            type="button"
            className="market-category-avatar"
            aria-label="User profile"
          >
            <img
              src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=120"
              alt="User profile"
            />
          </button>
        </header>

        <main className="market-category-content">
          <aside className="market-category-preview">
            <div
              className="market-category-preview-hero"
              style={{ background: selectedCategory.bgColor }}
            >
              <div
                className="market-category-preview-icon"
                style={{ color: selectedCategory.iconColor }}
              >
                {selectedCategory.icon}
              </div>
              <div className="market-category-preview-copy">
                <span>Primary niche</span>
                <h2>{selectedCategory.label}</h2>
                <p>{selectedCategory.description}</p>
              </div>
              <div className="market-category-preview-watermark">
                {selectedCategory.watermark}
              </div>
            </div>

            <div className="market-category-preview-details">
              <div>
                <span>Selection</span>
                <strong>{filteredCategories.length} niches found</strong>
              </div>
              <div>
                <span>Status</span>
                <strong>Ready to update</strong>
              </div>
            </div>
          </aside>

          <section className="market-category-panel">
            <div className="market-category-search">
              <span>
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <circle cx="11" cy="11" r="8" />
                  <line x1="21" y1="21" x2="16.65" y2="16.65" />
                </svg>
              </span>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search for your niche..."
                aria-label="Search for your niche"
              />
            </div>

            <div className="market-category-heading">
              <h2>Select Primary Niche</h2>
              <p>
                Choose one category that best matches the goods you sell most
                often.
              </p>
            </div>

            <div className="market-category-list">
              {filteredCategories.length > 0 ? (
                filteredCategories.map((category) => {
                  const isSelected = selectedId === category.id;
                  return (
                    <button
                      key={category.id}
                      type="button"
                      onClick={() => setSelectedId(category.id)}
                      className={`market-category-card ${
                        isSelected ? "is-selected" : ""
                      }`}
                    >
                      <div
                        className="market-category-card-icon"
                        style={{
                          backgroundColor: category.bgColor,
                          color: category.iconColor,
                        }}
                      >
                        {category.icon}
                      </div>

                      <div className="market-category-card-copy">
                        <h3>{category.label}</h3>
                        <p>{category.description}</p>
                      </div>

                      <div className="market-category-card-action">
                        <span>{isSelected ? "Selected" : "Tap to choose"}</span>
                        <svg
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <path d="M8 5l8 7-8 7" />
                        </svg>
                      </div>

                      {category.watermark}
                    </button>
                  );
                })
              ) : (
                <div className="market-category-empty">
                  <strong>No matching niches found</strong>
                  <p>Try a different keyword to see more categories.</p>
                </div>
              )}
            </div>
          </section>
        </main>

        <footer className="market-category-footer">
          <button
            type="button"
            onClick={handleUpdate}
          >
            <span>Update Category</span>
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <polyline points="20 6 9 17 4 12" />
              <polyline points="16 6 9 13.5 9 13.5" />
            </svg>
          </button>
        </footer>
      </div>

      <div className={`store-profile-notification ${showNotification ? 'show' : ''}`}>
        <CheckCircle2 size={24} />
        <span>Changes saved successfully!</span>
      </div>
    </div>
  );
}
