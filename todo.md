# MarketPulse AI - Implementation Todo List

## Phase 6: Vercel Deployment
- [ ] **Vercel Setup**: Connect GitHub, config env vars, set root directory, configure build settings.
- [ ] **Domain & SSL**: Add domain, verify HTTPS, update whitelist.
- [ ] **Post-Deployment**: Test flows, monitor logs, setup analytics.

## Phase 7: Marketing Pages Finalization
- [ ] **Watch Demo Button**: Connect the "Watch Demo" button on the Landing Page to a video modal or a specific demo page.
- [ ] **Footer Links**: Connect the Privacy Policy, Terms of Service, and Help Center footer links to actual pages or external URLs (currently `href="#"`).
- [ ] **Onboarding Flow Integration**: Verify and appropriately route the "Login" and "Get Started" buttons to their correct authentication flows (currently all point to `/login` which loads `WelcomePage`).

## Phase 8: Backend Core Features
- [ ] **JWT Auth Setup**: Add JWT generation to login and create auth middleware.
- [ ] **Products API**: Build models, controllers, and routes for Inventory.
- [ ] **Transactions API**: Build models, controllers, and routes for Sales/Expenses.
- [ ] **Express Wiring**: Connect new routes in `index.js`.
