import React, { useState } from "react";
import {
  ChevronLeft,
  MapPin,
  Edit3,
  ChevronDown,
  Info,
  Save,
} from "lucide-react";

export default function StoreProfile() {
  const [formData, setFormData] = useState({
    businessName: "Mama Ngozi Provisions",
    location: "Onyingbo Market, Lagos",
    businessType: "Wholesale & Retail",
  });

  const [isSaving, setIsSaving] = useState(false);

  const handleSaveChanges = () => {
    setIsSaving(true);
    setTimeout(() => {
      setIsSaving(false);
      alert("Changes saved successfully!");
    }, 1500);
  };

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
            Store Profile
          </h1>

          {/* User Profile Photo */}
          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 shadow-md flex items-center justify-center">
            <img
              src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=50&h=50&fit=crop"
              alt="Profile"
              className="w-full h-full rounded-full object-cover"
            />
          </div>
        </div>
      </div>

      {/* Main Content - with top padding for fixed navbar */}
      <div className="pt-20 pb-32 px-6">
        {/* Hero/Cover Image Section */}
        <div className="relative mb-6 rounded-3xl overflow-hidden shadow-lg">
          <div className="w-full h-64 bg-gradient-to-br from-green-700 to-green-900">
            <img
              src="https://images.unsplash.com/photo-1488459716781-6f3ee3991e52?w=800&h=400&fit=crop"
              alt="Store banner"
              className="w-full h-full object-cover"
            />
          </div>

          {/* Floating Store Icon */}
          <div className="absolute bottom-4 left-6 bg-white rounded-2xl p-4 shadow-lg">
            <div className="w-12 h-12 bg-white rounded-lg flex items-center justify-center border-2 border-[#052e16]">
              <svg
                className="w-8 h-8 text-[#052e16]"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M20 4H4v2h1.23l.84 14h12.92l.84-14H20V4m-1 14H5L4.23 6h15.54L19 18M7 11h2v5H7zm4 0h2v5h-2zm4 0h2v5h-2z" />
              </svg>
            </div>
          </div>
        </div>

        {/* Business Identity Card */}
        <div
          className="bg-white rounded-2xl shadow-md overflow-hidden border-l-4 border-[#052e16]"
          style={{ fontFamily: "Lexend" }}
        >
          {/* Card Header */}
          <div className="p-8 border-b border-gray-100">
            <h2 className="text-2xl font-bold text-[#052e16] mb-2">
              Business Identity
            </h2>
            <p className="text-gray-600 text-sm font-medium">
              Manage your store's public facing details
            </p>
          </div>

          {/* Form Fields */}
          <div className="p-8 space-y-6">
            {/* Business Name Field */}
            <div className="space-y-3">
              <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
                Business Name
              </label>
              <div className="bg-[#fffbeb] rounded-xl p-4 flex items-center justify-between hover:bg-yellow-50 transition cursor-pointer group">
                <input
                  type="text"
                  value={formData.businessName}
                  onChange={(e) =>
                    setFormData({ ...formData, businessName: e.target.value })
                  }
                  className="bg-transparent text-lg font-bold text-[#052e16] outline-none flex-1"
                  style={{ fontFamily: "Lexend" }}
                />
                <Edit3
                  size={20}
                  className="text-gray-400 group-hover:text-[#052e16] transition"
                />
              </div>
            </div>

            {/* Store Location Field */}
            <div className="space-y-3">
              <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
                Store Location
              </label>
              <div className="bg-[#fffbeb] rounded-xl p-4 flex items-center justify-between hover:bg-yellow-50 transition cursor-pointer group">
                <input
                  type="text"
                  value={formData.location}
                  onChange={(e) =>
                    setFormData({ ...formData, location: e.target.value })
                  }
                  className="bg-transparent text-lg font-bold text-[#052e16] outline-none flex-1"
                  style={{ fontFamily: "Lexend" }}
                />
                <MapPin
                  size={20}
                  className="text-gray-400 group-hover:text-[#052e16] transition"
                />
              </div>
            </div>

            {/* Business Type Field */}
            <div className="space-y-3">
              <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
                Business Type
              </label>
              <div className="bg-[#fffbeb] rounded-xl p-4 flex items-center justify-between hover:bg-yellow-50 transition cursor-pointer group">
                <select
                  value={formData.businessType}
                  onChange={(e) =>
                    setFormData({ ...formData, businessType: e.target.value })
                  }
                  className="bg-transparent text-lg font-bold text-[#052e16] outline-none flex-1 appearance-none"
                  style={{ fontFamily: "Lexend" }}
                >
                  <option>Wholesale & Retail</option>
                  <option>Wholesale Only</option>
                  <option>Retail Only</option>
                  <option>Manufacturing</option>
                </select>
                <ChevronDown
                  size={20}
                  className="text-gray-400 group-hover:text-[#052e16] transition pointer-events-none"
                />
              </div>
            </div>
          </div>

          {/* Verification Badges */}
          <div className="px-8 pb-8 flex gap-4 flex-wrap">
            <div className="bg-green-100 rounded-full px-6 py-2 flex items-center gap-2">
              <span
                className="text-xs font-bold text-green-800"
                style={{ fontFamily: "Lexend" }}
              >
                ✓ TIER 1 MERCHANT
              </span>
            </div>
            <div className="bg-blue-100 rounded-full px-6 py-2 flex items-center gap-2">
              <span
                className="text-xs font-bold text-blue-800"
                style={{ fontFamily: "Lexend" }}
              >
                ✓ VERIFIED LOCATION
              </span>
            </div>
          </div>
        </div>

        {/* Information Footer */}
        <div className="mt-8 flex items-start gap-3 px-4">
          <Info size={20} className="text-gray-400 flex-shrink-0 mt-0.5" />
          <p className="text-sm text-gray-600" style={{ fontFamily: "Lexend" }}>
            Profile changes are updated across the market network instantly.
          </p>
        </div>
      </div>

      {/* Fixed Save Button */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-2xl">
        <button
          onClick={handleSaveChanges}
          disabled={isSaving}
          className="w-full bg-[#052e16] text-white font-bold py-4 px-6 flex items-center justify-center gap-3 hover:bg-[#041f0f] transition disabled:opacity-75"
          style={{ fontFamily: "Lexend" }}
        >
          <Save size={24} />
          <span className="text-lg">
            {isSaving ? "Saving..." : "Save Changes"}
          </span>
        </button>
      </div>
    </div>
  );
}
