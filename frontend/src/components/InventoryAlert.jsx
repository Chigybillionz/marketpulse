import { useState } from "react";
import { AlertTriangle, Calendar, TrendingUp, Save, CheckCircle2 } from "lucide-react";

const ToggleSwitch = ({ isActive, onToggle }) => (
  <button
    onClick={onToggle}
    className={`relative inline-flex h-8 w-16 items-center rounded-full transition-colors ${
      isActive ? "bg-[#052e16]" : "bg-gray-300"
    }`}
  >
    <span
      className={`inline-block h-7 w-7 transform rounded-full bg-white shadow-md transition-transform ${
        isActive ? "translate-x-8" : "translate-x-0.5"
      }`}
    />
  </button>
);

export default function InventoryAlert({ onNavigate }) {
  const [settings, setSettings] = useState({
    lowStockNotifications: true,
    dailySummary: false,
    dailySummaryTime: "18:00", // Default to 6:00 PM
    priceChangeAlerts: true,
    threshold: 10,
  });

  const [isSaving, setIsSaving] = useState(false);
  const [showNotification, setShowNotification] = useState(false);

  const toggleSwitch = (key) => {
    setSettings((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  const handleThresholdChange = (e) => {
    setSettings((prev) => ({
      ...prev,
      threshold: parseInt(e.target.value),
    }));
  };

  const handleTimeChange = (e) => {
    const timeValue = e.target.value;
    // Validate time format (HH:MM)
    const timeRegex = /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/;
    if (timeRegex.test(timeValue) || timeValue === '') {
      setSettings((prev) => ({
        ...prev,
        dailySummaryTime: timeValue || "18:00",
      }));
    }
  };

  const handleSaveSettings = async () => {
    setIsSaving(true);
    try {
      // Save settings to backend (in production, implement this)
      const userEmail = localStorage.getItem('email');
      if (userEmail) {
        // In production: await apiClient('/inventory-alerts/settings', { ... })
        console.log('Saving inventory alert settings:', settings);
        // Save to localStorage for now
        localStorage.setItem('inventoryAlertSettings', JSON.stringify(settings));
      }
      
      setShowNotification(true);
      setTimeout(() => {
        setShowNotification(false);
        if (onNavigate) {
          onNavigate("home");
        }
      }, 2000);
    } catch (error) {
      console.error("Failed to save settings:", error);
      alert(`Failed to save settings: ${error.message || "Please try again."}`);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="inventory-alert-page">
      <div className="inventory-alert-shell">
        <header className="inventory-alert-topbar">
          <button
            type="button"
            className="inventory-alert-back"
            onClick={() => onNavigate && onNavigate("home")}
            aria-label="Go back"
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
            <p>Stock and pricing rules</p>
            <h1>Inventory Alerts</h1>
          </div>

          <div style={{ width: 40 }} />
        </header>

        <main className="inventory-alert-content">
          <aside className="inventory-alert-preview">
            <div className="inventory-alert-hero">
              <span className="inventory-alert-kicker">
                Proactive monitoring
              </span>
              <h2>Stay ahead of stockouts before they affect sales.</h2>
              <p>
                Automated notifications keep you informed about low stock, daily
                reports, and market price changes.
              </p>

              <div className="inventory-alert-metrics">
                <article>
                  <span>Rules active</span>
                  <strong>2 of 3</strong>
                </article>
                <article>
                  <span>Threshold</span>
                  <strong>{settings.threshold}%</strong>
                </article>
              </div>
            </div>

            <div className="inventory-alert-note">
              <AlertTriangle size={18} />
              <p>
                Low stock alerts are the fastest way to prevent missed sales.
              </p>
            </div>
          </aside>

          <section className="inventory-alert-panel">
            <div className="inventory-alert-section-head">
              <h2>Notification Rules</h2>
              <p>Manage how you receive updates about your stock and prices.</p>
            </div>

            <div className="inventory-alert-card inventory-alert-list">
              <div className="inventory-alert-row">
                <div className="inventory-alert-icon low-stock">
                  <AlertTriangle size={24} />
                </div>
                <div className="inventory-alert-copy">
                  <h3>Low Stock Notifications</h3>
                  <p>Alert when stock falls below threshold</p>
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
                  <h3>Daily Summary</h3>
                  <p>End-of-day stock report</p>
                </div>
                <div className="inventory-alert-time-picker">
                  <input
                    type="time"
                    value={settings.dailySummaryTime}
                    onChange={handleTimeChange}
                    disabled={!settings.dailySummary}
                    className="inventory-alert-time-input"
                    aria-label="Daily summary notification time"
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
                  <h3>Price Change Alerts</h3>
                  <p>Notify on market price fluctuations</p>
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
                  <h3>Low Stock Threshold</h3>
                  <p>Set the percentage for alerts</p>
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
            <span>{isSaving ? "Saving..." : "Save Settings"}</span>
          </button>
        </footer>
      </div>

      <div className={`store-profile-notification ${showNotification ? 'show' : ''}`}>
        <CheckCircle2 size={24} />
        <span>Settings saved successfully!</span>
      </div>
    </div>
  );
}
