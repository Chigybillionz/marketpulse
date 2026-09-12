import { useState, useEffect } from "react";
import { CheckCircle2 } from "lucide-react";
import { updateProfile, updateCategory } from "../services/authService";
import { useLanguage } from "../i18n/LanguageContext";

const CATEGORIES = [
  {
    id: "dry-goods",
    label: "Dry Goods",
    labelKey: "cat_dry_goods_name",
    descKey: "cat_dry_goods_desc",
    description: "Grains, spices, and packaged food",
    image: "/marketcateoryimages/drygoods.png",
    bgColor: "linear-gradient(135deg, rgba(255, 237, 213, 0.7) 0%, rgba(254, 215, 170, 0.4) 100%)",
    buttonColor: "linear-gradient(135deg, #ea580c 0%, #c2410c 100%)",
    iconColor: "#c2410c",
    textColor: "#0f172a",
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
        className="absolute right-4 bottom-4 w-20 h-20 text-[#fdba74] opacity-20 pointer-events-none"
        viewBox="0 0 100 100"
        fill="currentColor"
      >
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
    labelKey: "cat_produce_name",
    descKey: "cat_produce_desc",
    description: "Fresh fruits, vegetables, and tubers",
    image: "/marketcateoryimages/produce.png",
    bgColor: "linear-gradient(135deg, rgba(220, 252, 231, 0.7) 0%, rgba(187, 247, 208, 0.4) 100%)",
    buttonColor: "linear-gradient(135deg, #16a34a 0%, #15803d 100%)",
    iconColor: "#15803d",
    textColor: "#0f172a",
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
        className="absolute right-0 bottom-0 w-28 h-28 text-[#86efac] opacity-20 pointer-events-none translate-x-4 translate-y-4"
        viewBox="0 0 100 100"
        fill="none"
        stroke="currentColor"
        strokeWidth="5"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
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
    labelKey: "cat_electronics_name",
    descKey: "cat_electronics_desc",
    description: "Phones, accessories, and power tools",
    image: "/marketcateoryimages/electronics.png",
    bgColor: "linear-gradient(135deg, rgba(30, 27, 75, 0.95) 0%, rgba(49, 46, 129, 0.9) 100%)",
    buttonColor: "linear-gradient(135deg, #3730a3 0%, #312e81 100%)",
    iconColor: "#c7d2fe",
    textColor: "#ffffff",
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
        className="absolute right-0 bottom-0 w-24 h-32 text-[#818cf8] opacity-10 pointer-events-none translate-x-2"
        viewBox="0 0 100 100"
        fill="none"
        stroke="currentColor"
        strokeWidth="5"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M60 10 L25 55 L55 55 L40 90 L80 40 L50 40 Z" />
      </svg>
    ),
  },
  {
    id: "textiles",
    label: "Textiles",
    labelKey: "cat_fashion_name",
    descKey: "cat_fashion_desc",
    description: "Fabrics, garments, and traditional attire",
    image: "/marketcateoryimages/textiles.png",
    bgColor: "linear-gradient(135deg, rgba(241, 245, 249, 0.8) 0%, rgba(226, 232, 240, 0.5) 100%)",
    buttonColor: "linear-gradient(135deg, #475569 0%, #334155 100%)",
    iconColor: "#475569",
    textColor: "#0f172a",
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
        className="absolute right-0 bottom-0 w-24 h-24 text-[#94a3b8] opacity-10 pointer-events-none"
        viewBox="0 0 100 100"
      >
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

export default function MarketCategory({ onNavigate, onBack, profilePicture }) {
  const { t } = useLanguage();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedId, setSelectedId] = useState("electronics");
  const [showNotification, setShowNotification] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const pic = profilePicture || localStorage.getItem('profilePicture');
  
  // Load saved category from localStorage on mount
  useEffect(() => {
    const savedCategory = localStorage.getItem('category');
    if (savedCategory) {
      const match = CATEGORIES.find(c => c.label === savedCategory);
      if (match) {
        setSelectedId(match.id);
      }
    }
  }, []);

  const handleUpdate = async () => {
    setIsSaving(true);
    try {
      const userEmail = localStorage.getItem('email');
      if (!userEmail) {
        throw new Error('No user logged in');
      }
      
      const selectedCategory = CATEGORIES.find(c => c.id === selectedId);
      if (!selectedCategory) {
        throw new Error('Invalid category selected');
      }
      
      // Save to backend using correct API
      await updateCategory(userEmail, selectedCategory.label);
      
      // Save to localStorage for immediate UI updates
      localStorage.setItem('category', selectedCategory.label);
      window.dispatchEvent(new CustomEvent('categoryChanged', { detail: selectedCategory.label }));
      
      setShowNotification(true);
      setTimeout(() => {
        setShowNotification(false);
        if (onBack) {
          onBack();
        } else if (onNavigate) {
          onNavigate("profile");
        }
      }, 2000);
    } catch (error) {
      console.error("Failed to update category:", error);
      alert(t("cat_update_error", "Failed to update category. Please try again."));
    } finally {
      setIsSaving(false);
    }
  };

  const selectedCategory =
    CATEGORIES.find((category) => category.id === selectedId) || CATEGORIES[0];

  const filteredCategories = CATEGORIES.filter(
    (cat) =>
      t(cat.labelKey, cat.label).toLowerCase().includes(searchQuery.toLowerCase()) ||
      t(cat.descKey, cat.description).toLowerCase().includes(searchQuery.toLowerCase()) ||
      cat.label.toLowerCase().includes(searchQuery.toLowerCase()) ||
      cat.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="market-category-page">
      <div className="hero-background-layer">
        {CATEGORIES.map((category) => (
          <img
            key={category.id}
            src={category.image}
            alt={`${t(category.labelKey, category.label)} hero`}
            className={`hero-bg-image ${selectedId === category.id ? "active" : ""}`}
            loading="lazy"
          />
        ))}
        <div className="hero-bg-overlay" />
      </div>
      <div className="market-category-shell">
        <header className="market-category-topbar">
          <button
            type="button"
            className="market-category-back"
            onClick={() => (onBack ? onBack() : onNavigate ? onNavigate("profile") : window.history.back())}
            aria-label={t("common_back", "Go back")}
          >
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path d="M19 12H5M12 5l-7 7 7 7" />
            </svg>
          </button>

          <div className="market-category-titleblock">
            <p>{t("cat_page_subtitle", "Select the niche that best describes your store")}</p>
            <h1>{t("cat_page_title", "Market Category")}</h1>
          </div>

          {pic ? (
            <button
              type="button"
              className="market-category-avatar"
              aria-label={t("menu_account", "User profile")}
              onClick={() => onNavigate && onNavigate("profile")}
            >
              <img
                src={pic}
                alt="User profile"
                style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '50%' }}
              />
            </button>
          ) : (
            <div style={{ width: 40, height: 40 }} />
          )}
        </header>

        <main className="market-category-content">
          <aside className="market-category-preview">
            <div
              className="market-category-preview-hero"
              style={{ 
                backgroundImage: `linear-gradient(rgba(255, 255, 255, 0.4), rgba(255, 255, 255, 0.6)), url("${selectedCategory.image}")`, 
                backgroundSize: "cover",
                backgroundPosition: "center",
                backgroundRepeat: "no-repeat",
                backdropFilter: "blur(4px)", 
                border: "1px solid rgba(255,255,255,0.4)" 
              }}
            >
              <div
                className="market-category-preview-icon"
                style={{ color: selectedCategory.iconColor }}
              >
                {selectedCategory.icon}
              </div>
              <div className="market-category-preview-copy">
                <span>{t("cat_kicker", "Primary niche")}</span>
                <h2>{t(selectedCategory.labelKey, selectedCategory.label)}</h2>
                <p>{t(selectedCategory.descKey, selectedCategory.description)}</p>
              </div>
              <div className="market-category-preview-watermark">
                {selectedCategory.watermark}
              </div>
            </div>

            <div className="market-category-preview-details">
              <div>
                <span>{t("cat_section_title", "Available Categories")}</span>
                <strong>{filteredCategories.length} {t("notif_items", "categories")}</strong>
              </div>
              <div>
                <span>{t("cat_kicker", "Focus")}</span>
                <strong>{t("cat_active", "Active Category")}</strong>
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
                placeholder={t("common_search", "Search for your niche...")}
                aria-label={t("common_search", "Search for your niche")}
              />
            </div>

            <div className="market-category-heading">
              <h2>{t("cat_section_title", "Select Primary Niche")}</h2>
              <p>
                {t("cat_hero_desc", "Choose one category that best matches the goods you sell most often.")}
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
                      style={{
                        background: category.bgColor,
                        color: category.textColor
                      }}
                    >
                      <div
                        className="market-category-card-icon"
                        style={{
                          background: isSelected ? "rgba(255,255,255,0.2)" : category.bgColor,
                          color: isSelected ? category.textColor : category.iconColor,
                        }}
                      >
                        {category.icon}
                      </div>

                      <div className="market-category-card-copy">
                        <h3 style={{ color: category.textColor }}>{t(category.labelKey, category.label)}</h3>
                        <p style={{ color: category.textColor, opacity: 0.8 }}>{t(category.descKey, category.description)}</p>
                      </div>

                      <div className="market-category-card-action" style={{ color: category.textColor, opacity: isSelected ? 1 : 0.7 }}>
                        <span>{isSelected ? t("cat_selected", "SELECTED") : t("cat_active", "TAP TO CHOOSE")}</span>
                        <svg
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <path d="M9 18l6-6-6-6" />
                        </svg>
                      </div>

                      {category.watermark}
                    </button>
                  );
                })
              ) : (
                <div className="market-category-empty">
                  <strong>{t("hist_no_tx", "No matching niches found")}</strong>
                  <p>{t("hist_empty_desc", "Try a different keyword to see more categories.")}</p>
                </div>
              )}
            </div>
          </section>
        </main>

        <footer className="market-category-footer">
          <button type="button" onClick={handleUpdate} disabled={isSaving} style={{ background: selectedCategory.buttonColor, color: "#ffffff" }}>
            {isSaving ? t("cat_updating", "Saving...") : t("cat_update_btn", "Update Category")}
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              style={{ marginLeft: 8 }}
            >
              <polyline points="20 6 9 17 4 12" />
              <polyline points="16 6 9 13.5 9 13.5" />
            </svg>
          </button>
        </footer>
      </div>

      <div className={`store-profile-notification ${showNotification ? 'show' : ''}`}>
        <CheckCircle2 size={24} />
        <span>{t("cat_updated_success", "Changes saved successfully!")}</span>
      </div>
    </div>
  );
}
