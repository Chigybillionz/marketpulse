# MarketPulse AI - Implementation Todo List

## Phase 6: Vercel Deployment
- [ ] **Vercel Setup**: Connect GitHub, config env vars, set root directory, configure build settings.
- [ ] **Domain & SSL**: Add domain, verify HTTPS, update whitelist.
- [ ] **Post-Deployment**: Test flows, monitor logs, setup analytics.

## Phase 7: Marketing Pages Finalization
- [ ] **Watch Demo Button**: Connect the "Watch Demo" button on the Landing Page to a video modal or a specific demo page.
- [ ] **Footer Links**: Connect the Privacy Policy, Terms of Service, and Help Center footer links to actual pages or external URLs (currently `href="#"`).
- [ ] **Onboarding Flow Integration**: Verify and appropriately route the "Login" and "Get Started" buttons to their correct authentication flows (currently all point to `/login` which loads `WelcomePage`).

## Phase 8: Backend Core Features ✅
- [x] **JWT Auth Setup**: JWT generation on OTP verify + auth middleware.
- [x] **Products API**: Model, controller, and routes for Inventory (CRUD + stock update).
- [x] **Transactions API**: Model, controller, and routes for Sales/Expenses (CRUD).
- [x] **Express Wiring**: Routes connected in `index.js`.
- [x] **PIN Setup**: Ledger PIN setup wired to backend.
- [x] **Auth Middleware Fix**: Fixed double-response bug in `authMiddleware.js`.

## Bugs Fixed
- [x] **`.env.local` double path**: `VITE_BACKEND_URL` had `/welcome-auth` baked in, causing doubled path segments.
- [x] **OTP phone number mismatch**: Phone number sent to verify didn't include country code like the request did.
- [x] **Logout token cleanup**: "Yes, Log Out" now clears the JWT token from localStorage.
- [x] **Transaction data refresh**: Transactions re-fetched on page navigation (not just on initial load).
