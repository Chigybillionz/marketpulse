# MarketPulse AI - Implementation Todo List

## Phase 2: Onboarding Flow
- [x] **WelcomePage.jsx**: Connect inputs to global state, add "Send OTP" logic, full-screen overlays (Terms/Privacy), and back navigation.
- [x] **otp.jsx**: Display phone number from state, implement "Verify & Continue" logic for new/returning users, full-screen overlays, and back navigation.
- [ ] **ledger.jsx**: Add onNavigate prop, "Set Secure PIN" logic, back navigation, and PIN validation.

## Phase 3: Main Dashboard & Navigation
- [ ] **homepage.jsx**: Display global balance, floating mic button logic, profile button logic, and complete bottom navigation.
- [ ] **listeng.jsx**: Connect voice transcription/API logic.
- [ ] **analysing.jsx**: Auto-redirect after 3 seconds, add loading animation, and display business name.
- [ ] **otpVerification.jsx**: Accept props, implement "Confirm" button (updates balance & transaction list), back/close navigation.

## Phase 4: Settings Navigation
- [ ] **profile.jsx**: Settings list items navigation (Store Profile, Market Category, Inventory Alerts, Phone Number, Language).
- [ ] **StoreProfile.jsx**: Save button updates state & navigates back.
- [ ] **InventoryAlert.jsx**: Save and back navigation.
- [ ] **PhoneNumber.jsx**: Change button triggers PIN verification.
- [ ] **market_category.jsx** & **language_setting.jsx**: Back navigation and props.

## Phase 5: Voice & AI Integration
- [ ] **Gemini API Setup**: Configure API key in Vercel.
- [ ] **Voice Recording Flow**: Request mic permission, Audio to base64, Send to Gemini API, Navigate properly.
- [ ] **AI Confirmation**: Connect real parsed data to the confirmation UI.

## Phase 6: Vercel Deployment
- [ ] **Preparation**: Run `npm run build`, `npm run lint`, create `.env.example`, update `.gitignore`.
- [ ] **Vercel Setup**: Connect GitHub, config env vars, set root directory, configure build settings.
- [ ] **Domain & SSL**: Add domain, verify HTTPS, update whitelist.
- [ ] **Post-Deployment**: Test flows, monitor logs, setup analytics.
