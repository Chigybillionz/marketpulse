import { useState, useRef } from "react";
import { uploadProfilePicture } from "../services/authService";
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
  businessName,
  setBusinessName,
  email,
  profilePicture,
  setProfilePicture
}) {
  const [formData, setFormData] = useState({
    businessName: businessName || "My Store",
    location: "Onyingbo Market, Lagos",
    businessType: "Wholesale & Retail",
  });

  const [isSaving, setIsSaving] = useState(false);
  const [showNotification, setShowNotification] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef(null);

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
        // In a real app, you would compress the image using a canvas here
        await uploadProfilePicture(email, base64Image);
        if (setProfilePicture) setProfilePicture(base64Image);
        localStorage.setItem("profilePicture", base64Image);
      } catch (error) {
        console.error("Failed to upload image:", error);
        alert("Failed to upload image.");
      } finally {
        setIsUploading(false);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleSaveChanges = () => {
    setIsSaving(true);
    setTimeout(() => {
      setIsSaving(false);
      if (setBusinessName) {
        setBusinessName(formData.businessName);
      }
      setShowNotification(true);
      setTimeout(() => {
        setShowNotification(false);
        if (onNavigate) {
          onNavigate("home");
        }
      }, 2000);
    }, 1500);
  };

  return (
    <div className="store-profile-page">
      <div className="store-profile-shell">
        <header className="store-profile-topbar">
          <button
            type="button"
            className="store-profile-back"
            onClick={() => onNavigate && onNavigate("home")}
            aria-label="Go back"
          >
            <ChevronLeft size={30} />
          </button>

          <h1>Store Profile</h1>

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
              <span className="store-profile-kicker">Store identity</span>
              <h2>{formData.businessName}</h2>
              <p>
                Public profile details for customers, delivery partners, and
                market admins.
              </p>
              <div className="store-profile-hero-tags">
                <span>Wholesale & Retail</span>
                <span>Onyingbo Market</span>
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
              <span>Merchant tier</span>
              <strong>Tier 1</strong>
              <small>Verified for high-volume sales</small>
            </article>
            <article className="store-profile-fact">
              <span>Location</span>
              <strong>Onyingbo</strong>
              <small>Lagos, Nigeria</small>
            </article>
            <article className="store-profile-fact">
              <span>Status</span>
              <strong>Active</strong>
              <small>Visible to your market network</small>
            </article>
          </section>

          <section className="store-profile-card">
            <div className="store-profile-card-header">
              <h2>Business Identity</h2>
              <p>Manage your store&apos;s public facing details</p>
            </div>

            <div className="store-profile-fields">
              <label className="store-profile-field">
                <span>Business Name</span>
                <div className="store-profile-input-row">
                  <input
                    type="text"
                    value={formData.businessName}
                    onChange={handleFieldChange("businessName")}
                    aria-label="Business name"
                  />
                  <Edit3 size={19} />
                </div>
              </label>

              <label className="store-profile-field">
                <span>Store Location</span>
                <div className="store-profile-input-row">
                  <input
                    type="text"
                    value={formData.location}
                    onChange={handleFieldChange("location")}
                    aria-label="Store location"
                  />
                  <MapPin size={19} />
                </div>
              </label>

              <label className="store-profile-field">
                <span>Business Type</span>
                <div className="store-profile-input-row store-profile-select-row">
                  <select
                    value={formData.businessType}
                    onChange={handleFieldChange("businessType")}
                    aria-label="Business type"
                  >
                    <option>Wholesale & Retail</option>
                    <option>Wholesale Only</option>
                    <option>Retail Only</option>
                    <option>Manufacturing</option>
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
                Profile changes are updated across the market network instantly.
              </p>
            </section>

            <button
              type="button"
              className="store-profile-save"
              onClick={handleSaveChanges}
              disabled={isSaving}
            >
              <Save size={22} />
              <span>{isSaving ? "Saving..." : "Save Changes"}</span>
            </button>
          </section>
        </main>
      </div>

      <div className={`store-profile-notification ${showNotification ? 'show' : ''}`}>
        <CheckCircle2 size={24} />
        <span>Changes saved successfully!</span>
      </div>
    </div>
  );
}
