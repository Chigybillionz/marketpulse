# Summary of Changes Made

## 15. Gemini Quota Protection (backend/src/controllers/AIGeminiController.js)
**Problem**: Gemini free tier allows only 20 requests/day; the app fired duplicate analyze-voice calls (React StrictMode double effects), spamming the quota and flooding the console with raw 429 stack traces.
**Fixes**:
- In-flight request de-duplication: identical concurrent audio payloads collapse into ONE Gemini call
- Result cache: identical audio within 10 min served from memory (zero quota cost)
- Sliding-window rate limiter (`GEMINI_MAX_RPM`, default 10/min) rejects early with clean 429 instead of burning quota
- Retry-After aware 429 handling: parses Google's `RetryInfo.retryDelay`, enters server cooldown, returns structured `{ error, retryAfterSec }` with proper status codes
- Fallback model support: set `GEMINI_FALLBACK_MODEL` env var to auto-switch when primary model quota is exhausted

## 16. Frontend Duplicate Call Fix (frontend/src/components/pulse/analysing.jsx)
**Fix**: Ref guard so each recording is analyzed exactly once (StrictMode double-mount no longer fires two API calls); surfaces `retryAfterSec` to the user.

## 17. API Client Status Handling (frontend/src/services/api.js)
**Fix**: No longer swallows HTTP status; passes `error.status` and `error.retryAfterSec` through so the UI can distinguish quota errors from other failures.

## 18. Full App Localization - 5 Languages (frontend/src/i18n/*)
**Languages**: English, Pidgin English, Yoruba, Igbo, Hausa (all 5 with 149 matching keys each).
**Changes**:
- `translations.js`: Expanded from 4 languages (login/signup/landing only) to 5 languages with app-wide keys (home dashboard, navigation, profile, language settings, trade PIN, AI confirmation, analysing, common strings)
- `LanguageContext.jsx`: Added Pidgin mapping, localStorage persistence (`appLanguage`), and `{placeholder}` interpolation support in `t(key, params)`
- `language_setting.jsx`: Now wired to the LanguageContext — "Set Language" switches the ENTIRE app live and persists across reloads
- Translated screens: Login, Signup, Sidebar, NavigationBar, BalanceCard, TransactionList, Profile, AI Confirmation, Analysing, Trade PIN
- Login/Signup language dropdowns now include Pidgin English (5 options)
- Landing page intentionally left as-is (has its own language toggle)

## 19. Trade PIN Change Mode (frontend/src/components/pulse/trade_pin.jsx)
**Problem**: Profile → "Change Trade PIN" opened the transaction-confirmation UI showing "Enter your 4-digit PIN to confirm this sale of ₦15,000" — an amount that was never recorded.
**Fix**:
- Added `pinMode: "change"` (passed from Profile → Change Trade PIN)
- In change mode: NO transaction data, NO amount card, NO amount inline text
- Flow: verify current PIN → create new PIN → confirm new PIN → back to profile
- Back button returns to Profile instead of AI confirmation
- All PIN strings localized in all 5 languages

## 1. Voice Recorder Fix (frontend/src/services/voiceRecorder.js)
**Problem**: Audio was not being detected during recording.
**Fixes**:
- Added `startTime` tracking to properly calculate recording duration
- Added audio track verification to ensure microphone has audio tracks
- Added mime type fallback chain (tries multiple formats: opus, webm, ogg, mp4)
- Changed MediaRecorder to start with timeslice (100ms) for frequent data events
- Fixed `getDuration()` method to properly calculate elapsed time
- Fixed `stopRecording()` to properly handle blob creation and cleanup

## 2. Environment Configuration (frontend/.env.example)
**Problem**: API URL configuration was unclear.
**Fixes**:
- Updated `.env.example` to use `VITE_BACKEND_URL` instead of `VITE_API_URL`
- Added clear documentation about setting the backend URL
- Default value in api.js updated to check both env vars

## 3. API Service Fix (frontend/src/services/api.js)
**Fix**: Updated to check both `VITE_API_URL` and `VITE_BACKEND_URL` for backend URL.

## 4. Gemini Service Fix (frontend/src/services/geminiService.js)
**Fix**: Changed `transcribeAndAnalyze` to use centralized `apiClient` instead of direct fetch, ensuring consistent API URL and auth token handling.

## 5. Backend Schema Update (backend/src/models/WelcomeUser.js)
**Added fields**:
- `category`: String field to store user's market category (default: "Dry Goods")
- `emailChangeCount`: Number to track email changes (default: 0)
- `emailChangeResetDate`: Date for rate limiting reset (7-day cooldown)

## 6. Backend Service Updates (backend/src/services/WelcomeAuthService.js)
**Added functions**:
- `updateCategory(email, category)`: Updates user's category
- `updateEmail(email, newEmail)`: Updates email with rate limiting (3 changes/week)

## 7. Backend Controller Updates (backend/src/controllers/WelcomeAuthController.js)
**Added handlers**:
- `handleUpdateCategory`: PUT /welcome-auth/category
- `handleUpdateEmail`: PUT /welcome-auth/email

## 8. Backend Routes Update (backend/src/routes/WelcomeAuthRoutes.js)
**Added routes**:
- `router.put('/category', updateCategory)`
- `router.put('/email', updateEmail)`

## 9. StoreProfile Enhancement (frontend/src/components/StoreProfile.jsx)
**Improvements**:
- Added console logging for successful saves
- Verified backend API call for updateProfile is properly wired
- Already saves location and businessType to both backend and localStorage

## 10. MarketCategory Persistence (frontend/src/components/market_category.jsx)
**Fix**: 
- Added `updateProfile` import from authService
- Added `isSaving` state for loading feedback
- `handleUpdate` now actually calls backend API to save category
- Saves category to localStorage after successful update
- Shows error alert if save fails

## 11. InventoryAlert Time Picker (frontend/src/components/InventoryAlert.jsx)
**Fixes**:
- `dailySummary` now defaults to `false` (off by default)
- Added `dailySummaryTime` state (default: "18:00" / 6:00 PM)
- Added time picker input for daily summary notification timing
- Added `handleTimeChange` to validate and save time
- Time picker is disabled when daily summary is off
- Save settings now persists to localStorage

## 12. Email Page Redesign (frontend/src/components/Email.jsx)
**Complete rewrite with**:
- Professional UI with proper email-page CSS classes (not phone-number)
- Mobile responsive design
- Email change rate limiting UI (shows remaining changes)
- Modal dialog for changing email
- Email validation
- Copy to clipboard functionality
- Cooldown notice when rate limit is reached
- Proper error handling
- Calls backend API to update email with rate limiting

## 13. Email Page CSS (frontend/src/styles/responsive.css)
**Added**:
- Complete `.email-page` styles (replacing old phone-number styles)
- Professional card design with proper spacing and typography
- Email modal styles with overlay, form, validation states
- Rate limit information display
- Cooldown notice styling
- Responsive breakpoints for tablet (521px) and desktop (1024px)
- Animations for modal (fadeIn, slideUp)

## 14. InventoryAlert Time Picker CSS (frontend/src/styles/responsive.css)
**Added**:
- `.inventory-alert-time-picker` styles
- `.inventory-alert-time-input` styles with disabled state
- Responsive adjustments for larger screens

## Files Modified
### Frontend
1. `frontend/src/services/voiceRecorder.js` - Fixed recording issues
2. `frontend/src/services/api.js` - Updated API URL handling
3. `frontend/src/services/geminiService.js` - Use centralized API client
4. `frontend/src/components/StoreProfile.jsx` - Enhanced save logic
5. `frontend/src/components/market_category.jsx` - Added backend save
6. `frontend/src/components/InventoryAlert.jsx` - Added time picker
7. `frontend/src/components/Email.jsx` - Complete redesign with rate limiting
8. `frontend/src/styles/responsive.css` - New email and time picker styles
9. `frontend/.env.example` - Updated documentation

### Backend
1. `backend/src/models/WelcomeUser.js` - Added category and email tracking fields
2. `backend/src/services/WelcomeAuthService.js` - Added updateCategory, updateEmail
3. `backend/src/controllers/WelcomeAuthController.js` - Added handlers
4. `backend/src/routes/WelcomeAuthRoutes.js` - Added new routes

## Important Notes for Deployment

1. **Environment Variables**: Make sure to set `VITE_BACKEND_URL` in your `.env.local` file to point to your running backend (e.g., `http://localhost:5000/api` for local dev or your Render URL for production).

2. **Backend URL**: The backend must be running for the email change, category update, and profile update features to work.

3. **Database**: The new fields (`category`, `emailChangeCount`, `emailChangeResetDate`) will be added automatically to existing users when they first interact with those features (Mongoose handles this).

4. **Voice Recording**: Test on a real device/browser that supports `getUserMedia`. Some browsers (especially on HTTP) may block microphone access - HTTPS is recommended.

5. **Email Rate Limiting**: The rate limiting is enforced on the backend. The frontend shows the UI for it, but the actual limits are enforced server-side.
