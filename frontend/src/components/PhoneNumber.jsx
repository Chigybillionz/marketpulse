import React, { useState } from "react";
import {
  ChevronLeft,
  Edit3,
  CheckCircle,
  Shield,
  Bell,
  Package,
  Store,
  Truck,
} from "lucide-react";

export default function PhoneNumber() {
  const [isChanging, setIsChanging] = useState(false);

  const handleChangeNumber = () => {
    setIsChanging(true);
    setTimeout(() => {
      alert("Redirecting to phone number change flow...");
      setIsChanging(false);
    }, 1000);
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
            Phone Number
          </h1>

          {/* User Profile Photo */}
          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-gray-600 to-gray-800 shadow-md flex items-center justify-center">
            <img
              src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=50&h=50&fit=crop"
              alt="Profile"
              className="w-full h-full rounded-full object-cover"
            />
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="pt-24 pb-32 px-6">
        {/* Introduction Text */}
        <div className="mb-8">
          <p
            className="text-lg text-gray-700 leading-relaxed"
            style={{ fontFamily: "Lexend", lineHeight: "1.8" }}
          >
            Your phone number is used for account security, trade notifications,
            and identity verification.
          </p>
        </div>

        {/* Current Number Card */}
        <div className="bg-white rounded-2xl shadow-md overflow-hidden border-l-4 border-[#052e16] p-8 mb-8 relative">
          {/* Verified Badge */}
          <div className="absolute top-6 right-6 bg-[#dcfce7] rounded-full px-4 py-2 flex items-center gap-2">
            <CheckCircle size={18} className="text-[#166534]" />
            <span
              className="text-sm font-bold text-[#166534]"
              style={{ fontFamily: "Lexend" }}
            >
              Verified
            </span>
          </div>

          {/* Card Header */}
          <div className="mb-4">
            <h2
              className="text-xs font-bold text-gray-500 uppercase tracking-widest"
              style={{ fontFamily: "Lexend" }}
            >
              Current Verified Number
            </h2>
          </div>

          {/* Phone Number */}
          <div className="mt-8">
            <p
              className="text-3xl font-bold text-[#052e16]"
              style={{ fontFamily: "Lexend" }}
            >
              +234 803 123 4567
            </p>
          </div>
        </div>

        {/* Change Phone Number Button */}
        <button
          onClick={handleChangeNumber}
          disabled={isChanging}
          className="w-full border-2 border-[#052e16] rounded-2xl py-4 px-6 flex items-center justify-center gap-3 bg-white hover:bg-gray-50 transition mb-8 disabled:opacity-75"
          style={{ fontFamily: "Lexend" }}
        >
          <Edit3 size={24} className="text-[#052e16]" />
          <span className="text-lg font-bold text-[#052e16]">
            {isChanging ? "Processing..." : "Change Phone Number"}
          </span>
        </button>

        {/* Security & Info Cards */}
        <div className="space-y-6">
          {/* Secure Trading Card */}
          <div className="bg-[#eff6ff] rounded-2xl p-6 flex gap-6">
            <div className="flex-shrink-0">
              <div className="w-12 h-12 rounded-lg bg-white flex items-center justify-center">
                <Shield size={28} className="text-[#052e16]" />
              </div>
            </div>
            <div>
              <h3
                className="text-lg font-bold text-[#052e16] mb-2"
                style={{ fontFamily: "Lexend" }}
              >
                Secure Trading
              </h3>
              <p
                className="text-gray-700 text-sm"
                style={{ fontFamily: "Lexend" }}
              >
                Phone numbers are encrypted and never shared with third parties.
              </p>
            </div>
          </div>

          {/* Instant Alerts Card */}
          <div className="bg-[#eff6ff] rounded-2xl p-6 flex gap-6">
            <div className="flex-shrink-0">
              <div className="w-12 h-12 rounded-lg bg-white flex items-center justify-center">
                <Bell size={28} className="text-[#052e16]" />
              </div>
            </div>
            <div>
              <h3
                className="text-lg font-bold text-[#052e16] mb-2"
                style={{ fontFamily: "Lexend" }}
              >
                Instant Alerts
              </h3>
              <p
                className="text-gray-700 text-sm"
                style={{ fontFamily: "Lexend" }}
              >
                Get SMS alerts for successful provision deliveries and credit
                updates.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Footer Icons */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 py-6 px-6 flex justify-center gap-12">
        <div className="text-gray-300">
          <Package size={40} strokeWidth={1.5} />
        </div>
        <div className="text-gray-300">
          <Store size={40} strokeWidth={1.5} />
        </div>
        <div className="text-gray-300">
          <Truck size={40} strokeWidth={1.5} />
        </div>
      </div>
    </div>
  );
}
