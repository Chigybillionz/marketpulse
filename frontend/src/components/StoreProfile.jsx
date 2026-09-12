import { useState, useRef, useEffect } from "react";
import { uploadProfilePicture } from "../services/authService";
import { useLanguage } from "../i18n/LanguageContext";
import {
  ChevronLeft,
  MapPin,
  Edit3,
  ChevronDown,
  Info,
  Save,
  CheckCircle2,
} from "lucide-react";

export default function StoreProfile({
  onNavigate,
  onBack,
  businessName,
  setBusinessName,
  email,
  profilePicture,
  setProfilePicture,
  locationStr,
  setLocationStr,
  businessType,
  setBusinessType
}) {
  const { t } = useLanguage();
  const [formData, setFormData] = useState({
    businessName: businessName || "My Store",
    location: locationStr || "",
    businessType: businessType || "Retail",
  });

  const [isSaving, setIsSaving] = useState(false);
  const [showNotification, setShowNotification] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef(null);

  // Sync form data if props change after async fetch
  useEffect(() => {
    setFormData({
      businessName: businessName || "My Store",
      location: locationStr || "",
      businessType: businessType || "Retail",
    });
  }, [businessName, locationStr, businessType]);

  // Load fresh profile data directly from database on mount as single source of truth
  useEffect(() => {
    const userEmail = email || localStorage.getItem('email');
    if (userEmail) {
      import("../services/authService").then(({ getUserProfile }) => {
        getUserProfile(userEmail).then((res) => {
          if (res?.user) {
            const u = res.user;
            setFormData(prev => ({
              businessName: u.businessName || prev.businessName || "My Store",
              location: u.location || prev.location || "",
              businessType: u.businessType || prev.businessType || "Retail",
            }));
            if (u.location !== undefined) {
              localStorage.setItem("location", u.location || "");
              if (setLocationStr) setLocationStr(u.location || "");
            }
          }
        }).catch((err) => console.error("Failed to fetch fresh profile in StoreProfile.jsx:", err));
      });
    }
  }, [email, setLocationStr]);

  const handleFieldChange = (field) => (event) => {
    setFormData((current) => ({ ...current, [field]: event.target.value }));
  };

  const handleImageUpload = async (event) => {
    const file = event.target.files[0];
    if (!file || !email) return;

    setIsUploading(true);
    const reader = new FileReader();
    reader.onload = async (e) => {
      try {
        const base64Image = e.target.result;
        await uploadProfilePicture(email, base64Image);
        if (setProfilePicture) setProfilePicture(base64Image);
        localStorage.setItem("profilePicture", base64Image);
      } catch (error) {
        console.error("Failed to upload image:", error);
        alert(t("store_save_error", "Failed to upload image."));
      } finally {
        setIsUploading(false);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleSaveChanges = async () => {
    if (!formData.businessName.trim() || !formData.location.trim()) {
      alert(t("store_validation_empty", "Business Name and Location cannot be empty."));
      return;
    }

    setIsSaving(true);
    try {
      // Call backend API
      const userEmail = email || localStorage.getItem('email');
      if (!userEmail) {
        throw new Error("No user email found. Please log in again.");
      }
      
      const { updateProfile } = await import("../services/authService");
      const result = await updateProfile(userEmail, {
        businessName: formData.businessName,
        location: formData.location,
        businessType: formData.businessType
      });

      // Update parent component state
      if (setBusinessName) setBusinessName(formData.businessName);
      if (setLocationStr) setLocationStr(formData.location);
      if (setBusinessType) setBusinessType(formData.businessType);
      
      // Persist to localStorage for session persistence
      localStorage.setItem("businessName", formData.businessName);
      localStorage.setItem("location", formData.location);
      localStorage.setItem("businessType", formData.businessType);

      // Dispatch event to synchronize location across all pages immediately
      window.dispatchEvent(new CustomEvent('storeLocationChanged', { detail: formData.location }));

      console.log("Profile saved successfully:", result);
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
      console.error("Failed to update profile:", error);
      alert(t("store_save_error", `Failed to update profile: ${error.message || "Please try again."}`));
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="store-profile-page">
      <div className="store-profile-shell">
        <header className="store-profile-topbar">
          <button
            type="button"
            className="store-profile-back"
            onClick={() => (onBack ? onBack() : onNavigate ? onNavigate("profile") : window.history.back())}
            aria-label={t("common_back", "Go back")}
          >
            <ChevronLeft size={30} />
          </button>

          <h1>{t("store_page_title", "Store Profile")}</h1>

          <button
            type="button"
            className="store-profile-avatar"
            aria-label="Profile avatar"
            onClick={() => fileInputRef.current?.click()}
            style={{ opacity: isUploading ? 0.5 : 1, cursor: "pointer", width: "40px", height: "40px", overflow: "hidden", borderRadius: "50%", padding: 0, border: "none" }}
          >
            <img
              src={profilePicture || "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120&h=120&fit=crop"}
              alt="Profile"
              style={{ width: "100%", height: "100%", objectFit: "cover" }}
            />
          </button>
          <input
            type="file"
            accept="image/*"
            ref={fileInputRef}
            onChange={handleImageUpload}
            style={{ display: "none" }}
          />
        </header>

        <main className="store-profile-content">
          <section className="store-profile-hero">
            <div className="store-profile-hero-image" aria-hidden="true">
              <img
                src="https://images.unsplash.com/photo-1488459716781-6f3ee3991e52?w=1200&h=720&fit=crop"
                alt=""
              />
              <div className="store-profile-hero-overlay" />
            </div>

            <div className="store-profile-hero-copy">
              <span className="store-profile-kicker">{t("store_kicker", "Store identity")}</span>
              <h2>{formData.businessName}</h2>
              <p>
                {t("store_hero_desc", "Public profile details for customers, delivery partners, and market admins.")}
              </p>
              <div className="store-profile-hero-tags">
                <span>{formData.businessType === "Wholesale" ? t("store_type_wholesale", "Wholesale") : formData.businessType === "Wholesale & Retail" ? t("store_type_both", "Wholesale & Retail") : t("store_type_retail", "Retail")}</span>
                <span>{formData.location || t("store_location_not_set", "Location not set")}</span>
              </div>
            </div>

            <div className="store-profile-logo-card">
              <div className="store-profile-logo-mark">
                <svg viewBox="0 0 24 24" aria-hidden="true">
                  <path
                    d="M3 9h18l-1.3 10H4.3L3 9Z"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.9"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M5 9V7a7 7 0 0 1 14 0v2"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.9"
                    strokeLinecap="round"
                  />
                  <path
                    d="M8 13h8"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.9"
                    strokeLinecap="round"
                  />
                </svg>
              </div>
            </div>
          </section>

          <section
            className="store-profile-quickfacts"
            aria-label="Store overview"
          >
            <article className="store-profile-fact">
              <span>{t("store_kicker", "Merchant tier")}</span>
              <strong>Tier 1</strong>
              <small>{t("store_hero_title", "Verified for high-volume sales")}</small>
            </article>
            <article className="store-profile-fact">
              <span>{t("store_location_label", "Location")}</span>
              <strong>{formData.location ? formData.location.split(',')[0] : t("store_location_not_set", "Location not set")}</strong>
              <small>{formData.location ? formData.location.split(',').slice(1).join(',').trim() || formData.location : t("store_location_placeholder", "Please set your location")}</small>
            </article>
            <article className="store-profile-fact">
              <span>{t("common_status", "Status")}</span>
              <strong>{t("cat_active", "Active")}</strong>
              <small>{t("store_page_subtitle", "Visible to your market network")}</small>
            </article>
          </section>

          <section className="store-profile-card">
            <div className="store-profile-card-header">
              <h2>{t("store_kicker", "Business Identity")}</h2>
              <p>{t("store_page_subtitle", "Manage your store's public facing details")}</p>
            </div>

            <div className="store-profile-fields">
              <label className="store-profile-field">
                <span>{t("store_name_label", "Business Name")}</span>
                <div className="store-profile-input-row">
                  <input
                    type="text"
                    value={formData.businessName}
                    onChange={handleFieldChange("businessName")}
                    aria-label={t("store_name_label", "Business name")}
                  />
                  <Edit3 size={19} />
                </div>
              </label>

              <label className="store-profile-field">
                <span>{t("store_location_label", "Store Location")}</span>
                <div className="store-profile-input-row">
                  <input
                    type="text"
                    value={formData.location}
                    onChange={handleFieldChange("location")}
                    aria-label={t("store_location_label", "Store location")}
                    placeholder={t("store_location_placeholder", "Type your location")}
                  />
                  <MapPin size={19} />
                </div>
              </label>

              <label className="store-profile-field">
                <span>{t("store_type_label", "Business Type")}</span>
                <div className="store-profile-input-row store-profile-select-row">
                  <select
                    value={formData.businessType}
                    onChange={handleFieldChange("businessType")}
                    aria-label={t("store_type_label", "Business type")}
                  >
                    <option value="Retail">{t("store_type_retail", "Retail")}</option>
                    <option value="Wholesale">{t("store_type_wholesale", "Wholesale")}</option>
                    <option value="Wholesale & Retail">{t("store_type_both", "Wholesale & Retail")}</option>
                  </select>
                  <ChevronDown size={19} />
                </div>
              </label>
            </div>

            <div className="store-profile-badges">
              <span className="tier-badge">Tier 1 Merchant</span>
              <span className="location-badge">Verified Location</span>
            </div>

            <section className="store-profile-note">
              <Info size={18} />
              <p>
                {t("store_hero_desc", "Profile changes are updated across the market network instantly.")}
              </p>
            </section>

            <button
              type="button"
              className="store-profile-save"
              onClick={handleSaveChanges}
              disabled={isSaving}
            >
              <Save size={22} />
              <span>{isSaving ? t("store_saving", "Saving...") : t("store_save_btn", "Save Changes")}</span>
            </button>
          </section>
        </main>
      </div>

      <div className={`store-profile-notification ${showNotification ? 'show' : ''}`}>
        <CheckCircle2 size={24} />
        <span>{t("store_saved_success", "Changes saved successfully!")}</span>
      </div>
    </div>
  );
}
