# MarketPulse AI - Implementation Plan & Status

## Overview

This document outlines the complete implementation plan for connecting all React screens into a coherent, interactive mobile experience with global state management, onboarding flow, and AI voice integration.

## 🎯 Implementation Status

### Phase 1: Global State Management ✅ COMPLETED

- [x] App.jsx global state setup
  - businessName, phoneNumber, isNewUser
  - balance, moneyIn, moneyOut, transactionsList
  - Transaction history with sample data
- [x] State passed to all relevant components
- [x] Props properly configured

### Phase 2: Onboarding Flow 🔄 IN PROGRESS

#### 2.1 WelcomePage.jsx

- [ ] Connect businessName input to global state
- [ ] Connect phoneNumber input to global state
- [ ] "Send OTP" button logic:
  - Check if businessName === "Mama Ngozi Provisions"
  - Set isNewUser = false (returning user) or true (new user)
  - Navigate to 'otp'
- [ ] Terms of Service overlay (full-screen)
- [ ] Privacy Policy overlay (full-screen)
- [ ] Back navigation

#### 2.2 otp.jsx

- [ ] Display actual phoneNumber from global state
- [ ] "Verify & Continue" button logic:
  - If isNewUser === true: navigate to 'ledger'
  - If isNewUser === false: navigate to 'home'
- [ ] Terms of Service full-screen overlay
- [ ] Privacy Policy full-screen overlay
- [ ] Back arrow to WelcomePage

#### 2.3 ledger.jsx

- [ ] Accept onNavigate prop
- [ ] "Set Secure PIN" button → navigate to 'home'
- [ ] Back arrow → navigate to 'otp'
- [ ] PIN input validation

### Phase 3: Main Dashboard & Navigation 🔄 IN PROGRESS

#### 3.1 homepage.jsx

- [ ] Display global balance
- [ ] Central floating microphone button → navigate to 'listeng'
- [ ] Top-right profile button → navigate to 'profile'
- [ ] Bottom navigation fully operational:
  - Home → 'home'
  - Pulse → 'weekly_pulse'
  - History → 'history'
  - Credit → 'credit'

#### 3.2 listeng.jsx

- [ ] Accept onNavigate prop
- [ ] "Stop & Analyze" button → navigate to 'analysing'
- [ ] "Cancel" button → navigate to 'home'
- [ ] Voice recording integration
- [ ] Bottom nav and profile button setup

#### 3.3 analysing.jsx

- [ ] Accept onNavigate prop
- [ ] Auto-redirect after 3 seconds to 'ai_confirmation'
- [ ] Loading animation
- [ ] Business name display

#### 3.4 ai_confirmation.jsx (NEW)

- [ ] Create beautiful confirmation page with:
  - Type: "Income"
  - Amount: "₦15,000"
  - Description: "Sold 2 bags of garri"
  - Category: "Dry Goods"
  - Mint green background with grid pattern watermark
- [ ] "Confirm & Save" button → navigate to 'otpVerification'
- [ ] "Cancel/Edit" button → navigate to 'home'

#### 3.5 otpVerification.jsx

- [ ] Accept onNavigate prop
- [ ] Accept balance-updater props
- [ ] "Confirm" button logic:
  - Add transaction to transactionsList
  - Update balance (+₦15,000)
  - Navigate to 'home'
- [ ] Back button → 'ai_confirmation'
- [ ] Close button → 'home'

### Phase 4: Settings Navigation 🔄 IN PROGRESS

#### 4.1 profile.jsx

- [ ] Back arrow → navigate to 'home'
- [ ] Settings list items:
  - Store Profile → 'storeProfile'
  - Market Category → 'market_category'
  - Inventory Alerts → 'inventoryAlert'
  - Phone Number → 'phoneNumber'
  - Language → 'language_setting'

#### 4.2 StoreProfile.jsx

- [ ] Accept onNavigate prop
- [ ] Accept businessName props
- [ ] Save button updates state and navigates to 'profile'
- [ ] Back arrow → 'profile'

#### 4.3 InventoryAlert.jsx

- [ ] Accept onNavigate prop
- [ ] Save button → navigate to 'profile'
- [ ] Back arrow → 'profile'

#### 4.4 PhoneNumber.jsx

- [ ] Accept onNavigate prop
- [ ] Back arrow → 'profile'
- [ ] Change button → PIN verification

#### 4.5 market_category.jsx & language_setting.jsx

- [ ] Back arrow → 'profile'
- [ ] Accept onNavigate prop

### Phase 5: Voice & AI Integration 🔄 IN PROGRESS

#### 5.1 Gemini API Setup

- [x] Service file created (geminiService.js)
- [x] Voice recorder service created (voiceRecorder.js)
- [ ] API key configuration in Vercel
- [ ] Voice transcription in listeng.jsx

#### 5.2 Voice Recording Flow

- [ ] Microphone permission request
- [ ] Audio recording in listeng.jsx
- [ ] Stop & Analyze button triggers:
  - Audio to base64 conversion
  - Send to Gemini API
  - Navigate to analysing.jsx

#### 5.3 AI Confirmation

- [ ] Display parsed transaction details
- [ ] Confirm & Save → PIN entry
- [ ] Cancel/Edit → back to home

### Phase 6: Vercel Deployment 📋 PENDING

#### 6.1 Preparation

- [ ] npm run build (verify no errors)
- [ ] npm run lint (fix all warnings)
- [ ] Create .env.example
- [ ] Update .gitignore

#### 6.2 Vercel Setup

- [ ] Create Vercel account
- [ ] Connect GitHub repository
- [ ] Configure environment variables
- [ ] Set root directory to 'frontend'
- [ ] Configure build settings

#### 6.3 Domain & SSL

- [ ] Add custom domain (optional)
- [ ] Verify HTTPS enabled
- [ ] Update Gemini API whitelist

#### 6.4 Post-Deployment

- [ ] Test all flows in production
- [ ] Monitor error logs
- [ ] Setup analytics

## 📋 Component Navigation Map

```
WelcomePage
  ↓
  └─→ "Send OTP" → otp

otp
  ├─→ "Verify" (New User) → ledger
  └─→ "Verify" (Returning) → homepage

ledger
  └─→ "Set PIN" → homepage

homepage
  ├─→ Bottom Nav:
  │   ├─ Home → homepage
  │   ├─ Pulse → weekly_pulse
  │   ├─ History → history
  │   └─ Credit → credit
  ├─→ Profile Icon → profile
  └─→ Microphone → listeng

listeng
  ├─→ "Stop & Analyze" → analysing
  └─→ "Cancel" → homepage

analysing
  └─→ Auto-redirect (3s) → ai_confirmation

ai_confirmation
  ├─→ "Confirm & Save" → otpVerification
  └─→ "Cancel/Edit" → homepage

otpVerification
  ├─→ "Confirm" (PIN) → homepage (with balance update)
  └─→ Back/Close → ai_confirmation

profile
  ├─→ "Store Profile" → StoreProfile
  ├─→ "Market Category" → market_category
  ├─→ "Inventory Alerts" → inventoryAlert
  ├─→ "Phone Number" → PhoneNumber
  ├─→ "Language" → language_setting
  └─→ Back Arrow → homepage

StoreProfile, InventoryAlert, PhoneNumber, etc.
  └─→ Back Arrow / Save → profile
```

## 🧪 Testing Plan

### Manual Testing Flows

#### Flow 1: New User Onboarding

1. Enter "Ngozi Bread Store" in WelcomePage
2. Enter phone number
3. Click "Send OTP"
4. Verify OTP
5. Should navigate to ledger (PIN setup)
6. Click "Set PIN"
7. Should navigate to homepage

**Expected Result:** ✓ Navigate straight to PIN setup, not dashboard

#### Flow 2: Returning User Onboarding

1. Enter "Mama Ngozi Provisions" in WelcomePage
2. Enter phone number
3. Click "Send OTP"
4. Verify OTP
5. Should navigate directly to homepage

**Expected Result:** ✓ Skip PIN setup, go to dashboard

#### Flow 3: Complete Voice Flow

1. On homepage, tap floating microphone
2. Allow microphone access
3. Record transaction: "Sold 2 bags of garri for 15 thousand naira"
4. Tap "Stop & Analyze"
5. Wait for AI analysis screen
6. Confirm transaction
7. Enter PIN
8. Should return to homepage with updated balance

**Expected Result:** ✓ Balance increased by ₦15,000, transaction in history

#### Flow 4: Settings Navigation

1. On homepage, tap profile icon
2. Tap "Store Profile"
3. Edit business name
4. Click "Save"
5. Should return to profile screen

**Expected Result:** ✓ Business name updated globally

#### Flow 5: Bottom Navigation

1. On homepage, tap each bottom nav button
2. Should navigate to respective screens
3. Back arrow should return to previous screen

**Expected Result:** ✓ All navigation working smoothly

## 🔧 Development Commands

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Run linter
npm run lint

# Build for production
npm run build

# Preview production build
npm run preview
```

## 📝 Environment Setup

### .env.local (Development)

```env
VITE_GEMINI_API_KEY=your_api_key_here
VITE_APP_NAME=MarketPulse AI
VITE_API_URL=http://localhost:3000
VITE_ENABLE_VOICE=true
```

### Vercel Environment Variables (Production)

Same as above, configured in Vercel Dashboard

## 📚 Documentation Files

- [VERCEL_DEPLOYMENT.md](./VERCEL_DEPLOYMENT.md) - Complete Vercel deployment guide
- [GEMINI_SETUP.md](./GEMINI_SETUP.md) - Gemini API integration guide
- [.env.example](./frontend/.env.example) - Environment variables template

## 🎯 Next Steps

1. **Immediate (This Week):**

   - [ ] Implement onboarding flow in WelcomePage.jsx and otp.jsx
   - [ ] Connect bottom navigation in all screens
   - [ ] Create ai_confirmation.jsx component
   - [ ] Test all navigation flows

2. **Short-term (Next 2 Weeks):**

   - [ ] Integrate voice recording in listeng.jsx
   - [ ] Connect to Gemini API
   - [ ] Test voice-to-transaction flow end-to-end
   - [ ] Deploy to Vercel staging

3. **Medium-term (Week 3-4):**
   - [ ] Setup error tracking (Sentry)
   - [ ] Performance optimization
   - [ ] Mobile responsiveness testing
   - [ ] Production Vercel deployment

## 📞 Support & Questions

For implementation questions or issues:

1. Check the relevant documentation file
2. Review component comments in source code
3. Open a GitHub issue with details
4. Contact the development team

---

**Last Updated:** May 29, 2026
**Status:** Active Development
**Version:** 1.0.0-dev
