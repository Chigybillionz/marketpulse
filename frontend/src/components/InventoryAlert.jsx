import { useState, useEffect } from "react";
import { AlertTriangle, Calendar, TrendingUp, Save, CheckCircle2, AlertCircle } from "lucide-react";
import { useLanguage } from "../i18n/LanguageContext";
import { getNotificationSettings, updateNotificationSettings } from "../services/notificationService";

const ToggleSwitch = ({ isActive, onToggle }) => (
  <button
    onClick={onToggle}
    style={{
      position: 'relative',
      display: 'inline-flex',
      height: 30,
      width: 54,
      alignItems: 'center',
      borderRadius: 999,
      border: 'none',
      padding: 0,
      cursor: 'pointer',
      background: isActive ? '#052e16' : '#d1d5db',
      transition: 'background 0.2s ease',
      flexShrink: 0,
    }}
  >
    <span
      style={{
        display: 'inline-block',
        height: 24,
        width: 24,
        borderRadius: '50%',
        background: '#ffffff',
        boxShadow: '0 2px 6px rgba(0,0,0,0.15)',
        transition: 'transform 0.2s ease',
        transform: isActive ? 'translateX(26px)' : 'translateX(3px)',
      }}
    />
  </button>
);

export default function InventoryAlert({ onNavigate, onBack }) {
  const { t } = useLanguage();
  const [settings, setSettings] = useState(() => {
    try {
      const cached = localStorage.getItem('inventoryAlertSettings');
      if (cached) {
        const parsed = JSON.parse(cached);
        return {
          lowStockNotifications: parsed.lowStockNotifications !== undefined ? parsed.lowStockNotifications : true,
          dailySummary: parsed.dailySummary !== undefined ? parsed.dailySummary : false,
          dailySummaryTime: parsed.dailySummaryTime || "18:00",
          priceChangeAlerts: parsed.priceChangeAlerts !== undefined ? parsed.priceChangeAlerts : true,
          threshold: typeof parsed.threshold === 'number' ? parsed.threshold : 10,
        };
      }
    } catch (e) {
      console.warn("Failed to parse cached inventory settings", e);
    }
    return {
      lowStockNotifications: true,
      dailySummary: false,
      dailySummaryTime: "18:00",
      priceChangeAlerts: true,
      threshold: 10,
    };
  });

  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [showNotification, setShowNotification] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  // Load saved settings from backend database on mount
  useEffect(() => {
    let isMounted = true;

    const fetchSettings = async () => {
      try {
        const res = await getNotificationSettings();
        if (isMounted && res?.settings) {
          const fetched = res.settings;
          const merged = {
            lowStockNotifications: fetched.lowStockNotifications !== undefined ? fetched.lowStockNotifications : true,
            dailySummary: fetched.dailySummary !== undefined ? fetched.dailySummary : false,
            dailySummaryTime: fetched.dailySummaryTime || "18:00",
            priceChangeAlerts: fetched.priceChangeAlerts !== undefined ? fetched.priceChangeAlerts : true,
            threshold: typeof fetched.threshold === 'number' ? fetched.threshold : 10,
          };
          setSettings(merged);
          localStorage.setItem('inventoryAlertSettings', JSON.stringify(merged));
        }
      } catch (err) {
        console.warn("Failed to load settings from server, using local preferences:", err);
      } finally {
        if (isMounted) setIsLoading(false);
      }
    };

    fetchSettings();

    return () => {
      isMounted = false;
    };
  }, []);

  const toggleSwitch = (key) => {
    setSettings((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  const handleThresholdChange = (e) => {
    setSettings((prev) => ({
      ...prev,
      threshold: parseInt(e.target.value, 10),
    }));
  };

  const handleTimeChange = (e) => {
    const timeValue = e.target.value;
    const timeRegex = /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/;
    if (timeRegex.test(timeValue) || timeValue === '') {
      setSettings((prev) => ({
        ...prev,
        dailySummaryTime: timeValue || "18:00",
      }));
    }
  };

  const handleSaveSettings = async () => {
    // Validate daily summary time format
    if (settings.dailySummary) {
      const timeRegex = /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/;
      if (!timeRegex.test(settings.dailySummaryTime)) {
        setErrorMessage(t("alert_invalid_time", "Please select a valid daily summary time (HH:MM)."));
        return;
      }
    }

    // Validate threshold percentage
    if (isNaN(settings.threshold) || settings.threshold < 1 || settings.threshold > 100) {
      setErrorMessage(t("alert_invalid_threshold", "Low stock threshold must be between 1% and 100%."));
      return;
    }

    setIsSaving(true);
    setErrorMessage("");

    try {
      // Save notification settings to the database
      const res = await updateNotificationSettings(settings);

      // Save to local storage for instant access across reloads
      const saved = res?.settings || settings;
      localStorage.setItem('inventoryAlertSettings', JSON.stringify(saved));
      setSettings(saved);

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
      console.error("Failed to save settings:", error);
      const msg = error.message || t("alert_save_error", "Failed to save settings. Please try again.");
      setErrorMessage(msg);
      alert(msg);
    } finally {
      setIsSaving(false);
    }
  };

  const activeRulesCount = [
    settings.lowStockNotifications,
    settings.dailySummary,
    settings.priceChangeAlerts,
  ].filter(Boolean).length;

  return (
    <div className="inventory-alert-page">
      <div className="inventory-alert-shell">
        <header className="inventory-alert-topbar">
          <button
            type="button"
            className="inventory-alert-back"
            onClick={() => (onBack ? onBack() : onNavigate ? onNavigate("profile") : window.history.back())}
            aria-label={t("common_back")}
          >
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <path d="M19 12H5M12 5l-7 7 7 7" />
            </svg>
          </button>

          <div className="inventory-alert-titleblock">
            <p>{t("alert_subtitle")}</p>
            <h1>{t("alert_title")}</h1>
          </div>

          <div style={{ width: 40 }} />
        </header>

        <main className="inventory-alert-content">
          <aside className="inventory-alert-preview">
            <div className="inventory-alert-hero">
              <span className="inventory-alert-kicker">
                {t("alert_kicker")}
              </span>
              <h2>{t("alert_hero_title")}</h2>
              <p>
                {t("alert_hero_desc")}
              </p>

              <div className="inventory-alert-metrics">
                <article>
                  <span>{t("alert_rules_active")}</span>
                  <strong>{t("alert_rules_ratio", { active: activeRulesCount, total: 3 })}</strong>
                </article>
                <article>
                  <span>{t("alert_threshold_badge")}</span>
                  <strong>{settings.threshold}%</strong>
                </article>
              </div>
            </div>

            <div className="inventory-alert-note">
              <AlertTriangle size={18} />
              <p>
                {t("alert_note")}
              </p>
            </div>
          </aside>

          <section className="inventory-alert-panel">
            <div className="inventory-alert-section-head">
              <h2>{t("alert_section_title")}</h2>
              <p>{t("alert_section_desc")}</p>
            </div>

            {errorMessage && (
              <div
                style={{
                  background: '#fef2f2',
                  color: '#991b1b',
                  border: '1px solid #f87171',
                  borderRadius: 12,
                  padding: '12px 16px',
                  marginBottom: 16,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 10,
                  fontSize: 14,
                  fontWeight: 500,
                }}
                role="alert"
              >
                <AlertCircle size={18} />
                <span>{errorMessage}</span>
              </div>
            )}

            <div className="inventory-alert-card inventory-alert-list">
              <div className="inventory-alert-row">
                <div className="inventory-alert-icon low-stock">
                  <AlertTriangle size={24} />
                </div>
                <div className="inventory-alert-copy">
                  <h3>{t("alert_low_stock_title")}</h3>
                  <p>{t("alert_low_stock_desc")}</p>
                </div>
                <ToggleSwitch
                  isActive={settings.lowStockNotifications}
                  onToggle={() => toggleSwitch("lowStockNotifications")}
                />
              </div>

              <div className="inventory-alert-row">
                <div className="inventory-alert-icon summary">
                  <Calendar size={24} />
                </div>
                <div className="inventory-alert-copy">
                  <h3>{t("alert_daily_summary_title")}</h3>
                  <p>{t("alert_daily_summary_desc")}</p>
                </div>
                <div className="inventory-alert-time-picker">
                  <input
                    type="time"
                    value={settings.dailySummaryTime}
                    onChange={handleTimeChange}
                    disabled={!settings.dailySummary}
                    className="inventory-alert-time-input"
                    aria-label={t("alert_daily_summary_title")}
                  />
                </div>
                <ToggleSwitch
                  isActive={settings.dailySummary}
                  onToggle={() => toggleSwitch("dailySummary")}
                />
              </div>

              <div className="inventory-alert-row">
                <div className="inventory-alert-icon trend">
                  <TrendingUp size={24} />
                </div>
                <div className="inventory-alert-copy">
                  <h3>{t("alert_price_change_title")}</h3>
                  <p>{t("alert_price_change_desc")}</p>
                </div>
                <ToggleSwitch
                  isActive={settings.priceChangeAlerts}
                  onToggle={() => toggleSwitch("priceChangeAlerts")}
                />
              </div>
            </div>

            <div className="inventory-alert-card inventory-alert-threshold">
              <div className="inventory-alert-threshold-head">
                <div>
                  <h3>{t("alert_threshold_title")}</h3>
                  <p>{t("alert_threshold_desc")}</p>
                </div>
                <strong>{settings.threshold}%</strong>
              </div>

              <div className="inventory-alert-slider-wrap">
                <input
                  type="range"
                  min="1"
                  max="50"
                  value={settings.threshold}
                  onChange={handleThresholdChange}
                  className="inventory-alert-slider"
                  style={{
                    background: `linear-gradient(to right, #e8f0fe 0%, #e8f0fe ${
                      (settings.threshold / 50) * 100
                    }%, #e4e8ef ${
                      (settings.threshold / 50) * 100
                    }%, #e4e8ef 100%)`,
                  }}
                />
                <div className="inventory-alert-scale">
                  <span>1%</span>
                  <span>25%</span>
                  <span>50%</span>
                </div>
              </div>
            </div>
          </section>
        </main>

        <footer className="inventory-alert-footer">
          <button
            type="button"
            onClick={handleSaveSettings}
            disabled={isSaving}
          >
            <Save size={22} />
            <span>{isSaving ? t("alert_saving") : t("alert_save_btn")}</span>
          </button>
        </footer>
      </div>

      <div className={`store-profile-notification ${showNotification ? 'show' : ''}`}>
        <CheckCircle2 size={24} />
        <span>{t("alert_saved_success")}</span>
      </div>
    </div>
  );
}
