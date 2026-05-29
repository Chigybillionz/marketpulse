import React, { useState } from "react";
import {
  ChevronLeft,
  AlertTriangle,
  Calendar,
  TrendingUp,
  Save,
} from "lucide-react";

export default function InventoryAlert() {
  const [settings, setSettings] = useState({
    lowStockNotifications: true,
    dailySummary: false,
    priceChangeAlerts: true,
    threshold: 10,
  });

  const [isSaving, setIsSaving] = useState(false);

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

  const handleSaveSettings = () => {
    setIsSaving(true);
    setTimeout(() => {
      setIsSaving(false);
      alert("Settings saved successfully!");
    }, 1500);
  };

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

  return (
    <div className="min-h-screen bg-[#f8f9ff]">
      {/* Top Navigation Bar */}
      <div className="fixed top-0 left-0 right-0 bg-white shadow-sm z-50">
        <div className="flex items-center justify-between px-6 py-4">
          {/* Back Button */}
          <button className="text-gray-700 hover:text-gray-900 transition">
            <ChevronLeft size={28} className="text-[#052e16]" />
          </button>

          {/* Title */}
          <h1
            className="text-2xl font-bold text-[#052e16]"
            style={{ fontFamily: "Lexend" }}
          >
            Inventory Alerts
          </h1>

          {/* User Profile Photo */}
          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-amber-400 to-amber-600 shadow-md flex items-center justify-center">
            <img
              src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=50&h=50&fit=crop"
              alt="Profile"
              className="w-full h-full rounded-full object-cover"
            />
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="pt-20 pb-32 px-6">
        {/* Section Header */}
        <div className="mb-8">
          <h2
            className="text-4xl font-bold text-[#052e16] mb-3"
            style={{ fontFamily: "Lexend" }}
          >
            Notification Rules
          </h2>
          <p className="text-gray-600 text-lg" style={{ fontFamily: "Lexend" }}>
            Manage how you receive updates about your stock levels and price
            movements.
          </p>
        </div>

        {/* Alert Controls Card */}
        <div className="bg-white rounded-2xl shadow-md overflow-hidden mb-8">
          {/* Low Stock Notifications */}
          <div className="p-6 border-b border-gray-200 flex items-center justify-between hover:bg-gray-50 transition">
            <div className="flex items-center gap-4 flex-1">
              <div className="w-14 h-14 rounded-lg bg-[#e8f0fe] flex items-center justify-center flex-shrink-0">
                <AlertTriangle size={28} className="text-[#052e16]" />
              </div>
              <div>
                <h3
                  className="text-lg font-bold text-[#052e16]"
                  style={{ fontFamily: "Lexend" }}
                >
                  Low Stock Notifications
                </h3>
                <p
                  className="text-gray-600 text-sm"
                  style={{ fontFamily: "Lexend" }}
                >
                  Alert when stock falls below threshold
                </p>
              </div>
            </div>
            <ToggleSwitch
              isActive={settings.lowStockNotifications}
              onToggle={() => toggleSwitch("lowStockNotifications")}
            />
          </div>

          {/* Daily Summary */}
          <div className="p-6 border-b border-gray-200 flex items-center justify-between hover:bg-gray-50 transition">
            <div className="flex items-center gap-4 flex-1">
              <div className="w-14 h-14 rounded-lg bg-[#e8f0fe] flex items-center justify-center flex-shrink-0">
                <Calendar size={28} className="text-[#052e16]" />
              </div>
              <div>
                <h3
                  className="text-lg font-bold text-[#052e16]"
                  style={{ fontFamily: "Lexend" }}
                >
                  Daily Summary
                </h3>
                <p
                  className="text-gray-600 text-sm"
                  style={{ fontFamily: "Lexend" }}
                >
                  End-of-day stock report at 6:00 PM
                </p>
              </div>
            </div>
            <ToggleSwitch
              isActive={settings.dailySummary}
              onToggle={() => toggleSwitch("dailySummary")}
            />
          </div>

          {/* Price Change Alerts */}
          <div className="p-6 flex items-center justify-between hover:bg-gray-50 transition">
            <div className="flex items-center gap-4 flex-1">
              <div className="w-14 h-14 rounded-lg bg-[#e8f0fe] flex items-center justify-center flex-shrink-0">
                <TrendingUp size={28} className="text-[#052e16]" />
              </div>
              <div>
                <h3
                  className="text-lg font-bold text-[#052e16]"
                  style={{ fontFamily: "Lexend" }}
                >
                  Price Change Alerts
                </h3>
                <p
                  className="text-gray-600 text-sm"
                  style={{ fontFamily: "Lexend" }}
                >
                  Notify on market price fluctuations
                </p>
              </div>
            </div>
            <ToggleSwitch
              isActive={settings.priceChangeAlerts}
              onToggle={() => toggleSwitch("priceChangeAlerts")}
            />
          </div>
        </div>

        {/* Threshold Control Card */}
        <div className="bg-white rounded-2xl shadow-md p-8 mb-8">
          <div className="flex items-end justify-between mb-6">
            <h3
              className="text-2xl font-bold text-[#052e16]"
              style={{ fontFamily: "Lexend" }}
            >
              Low Stock Threshold
            </h3>
            <p
              className="text-4xl font-bold text-[#052e16]"
              style={{ fontFamily: "Lexend" }}
            >
              {settings.threshold}%
            </p>
          </div>

          <p
            className="text-gray-600 text-sm mb-6"
            style={{ fontFamily: "Lexend" }}
          >
            Set the percentage for alerts
          </p>

          {/* Slider */}
          <div className="mb-6">
            <input
              type="range"
              min="1"
              max="50"
              value={settings.threshold}
              onChange={handleThresholdChange}
              className="w-full h-3 bg-[#e8f0fe] rounded-lg appearance-none cursor-pointer slider"
              style={{
                background: `linear-gradient(to right, #e8f0fe 0%, #e8f0fe ${
                  (settings.threshold / 50) * 100
                }%, #e8f0fe ${(settings.threshold / 50) * 100}%, #e8f0fe 100%)`,
              }}
            />
            <style>{`
              .slider::-webkit-slider-thumb {
                appearance: none;
                width: 24px;
                height: 24px;
                border-radius: 50%;
                background: #052e16;
                cursor: pointer;
                box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
              }
              .slider::-moz-range-thumb {
                width: 24px;
                height: 24px;
                border-radius: 50%;
                background: #052e16;
                cursor: pointer;
                border: none;
                box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
              }
              .slider::-webkit-slider-runnable-track {
                background: transparent;
                height: 12px;
                border-radius: 5px;
              }
              .slider::-moz-range-track {
                background: transparent;
                border: none;
              }
            `}</style>
          </div>

          {/* Value Labels */}
          <div
            className="flex justify-between text-xs text-gray-500"
            style={{ fontFamily: "Lexend" }}
          >
            <span>1%</span>
            <span>25%</span>
            <span>50%</span>
          </div>
        </div>

        {/* Proactive Monitoring Card */}
        <div className="bg-[#052e16] rounded-2xl p-8 mb-8 relative overflow-hidden">
          <div className="absolute right-0 top-0 bottom-0 w-40 opacity-20 flex items-center justify-center">
            <svg
              width="200"
              height="200"
              viewBox="0 0 200 200"
              className="text-gray-400"
            >
              <rect
                x="40"
                y="40"
                width="120"
                height="120"
                fill="currentColor"
                rx="8"
              />
              <rect
                x="60"
                y="80"
                width="80"
                height="60"
                fill="#052e16"
                rx="4"
              />
            </svg>
          </div>

          <div className="relative z-10">
            <h3
              className="text-3xl font-bold text-white mb-3"
              style={{ fontFamily: "Lexend" }}
            >
              Proactive
              <br />
              Monitoring
            </h3>
            <p
              className="text-green-200 text-lg"
              style={{ fontFamily: "Lexend" }}
            >
              Stay ahead of supply chain delays with automated stock
              intelligence.
            </p>
          </div>
        </div>
      </div>

      {/* Fixed Save Button */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-2xl">
        <button
          onClick={handleSaveSettings}
          disabled={isSaving}
          className="w-full bg-[#052e16] text-white font-bold py-4 px-6 flex items-center justify-center gap-3 hover:bg-[#041f0f] transition disabled:opacity-75"
          style={{ fontFamily: "Lexend" }}
        >
          <Save size={24} />
          <span className="text-lg">
            {isSaving ? "Saving..." : "Save Settings"}
          </span>
        </button>
      </div>
    </div>
  );
}
