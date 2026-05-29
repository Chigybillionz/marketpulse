# Quick Start Guide - MarketPulse AI

## 5-Minute Setup

### 1. Clone & Install

```bash
git clone https://github.com/Chigybillionz/marketpulse.git
cd marketPulse/frontend
npm install
```

### 2. Setup Environment

```bash
# Create environment file
cp .env.example .env.local

# Edit .env.local and add your Gemini API key
VITE_GEMINI_API_KEY=your_api_key_here
```

**Get API Key:**

1. Go to https://makersuite.google.com/app/apikey
2. Create a new API key
3. Copy and paste into .env.local

### 3. Start Development

```bash
npm run dev
```

Visit `http://localhost:3000`

## Testing the App

### Test New User Flow

1. **WelcomePage:** Enter "Ngozi Bread Store" and any phone number
2. **OTP:** Click "Verify & Continue"
3. **PIN Setup:** Set a secure PIN
4. **Dashboard:** You're in!

### Test Returning User Flow

1. **WelcomePage:** Enter "Mama Ngozi Provisions" and any phone number
2. **OTP:** Click "Verify & Continue"
3. **Dashboard:** Skip PIN, go straight to home

### Test Voice Feature

1. **Homepage:** Click floating microphone
2. **Recording:** Say "Sold 2 bags of garri for 15 thousand naira"
3. **Analyze:** Click "Stop & Analyze"
4. **Confirm:** Review and confirm transaction
5. **PIN:** Enter PIN (any 4 digits)
6. **Balance:** Check updated balance on homepage

## Project Structure

```
marketPulse/
├── frontend/
│   ├── src/
│   │   ├── components/     # All screens
│   │   ├── services/       # API & voice services
│   │   └── App.jsx         # Main app with state
│   ├── vite.config.js      # Build config
│   ├── package.json        # Dependencies
│   └── .env.local          # Your API keys (don't commit)
├── README.md               # Full documentation
├── IMPLEMENTATION_PLAN.md  # Development roadmap
├── GEMINI_SETUP.md         # AI setup guide
└── VERCEL_DEPLOYMENT.md    # Deploy to production
```

## Common Issues & Solutions

### "Microphone not working"

- Allow microphone access in browser
- Use HTTPS (automatic in production)
- Check browser console for errors

### "Gemini API error"

- Verify API key in .env.local
- Check API key is valid
- Ensure Generative Language API is enabled

### "Navigation not working"

- Check browser console for errors
- Verify component exports properly
- Ensure prop passing is correct

## Key Files

| File                         | Purpose                |
| ---------------------------- | ---------------------- |
| `App.jsx`                    | Global state & routing |
| `services/geminiService.js`  | AI integration         |
| `services/voiceRecorder.js`  | Voice recording        |
| `components/WelcomePage.jsx` | Onboarding             |
| `components/homepage.jsx`    | Main dashboard         |

## NPM Commands

```bash
npm run dev        # Start development
npm run build      # Build for production
npm run lint       # Check code quality
npm run preview    # Preview production build
```

## Deployment to Vercel

See [VERCEL_DEPLOYMENT.md](./VERCEL_DEPLOYMENT.md) for full instructions.

**Quick deploy:**

```bash
git add .
git commit -m "Your message"
git push origin main
# Vercel auto-deploys!
```

## Need Help?

1. **Setup issues?** Check [GEMINI_SETUP.md](./GEMINI_SETUP.md)
2. **Deployment?** Read [VERCEL_DEPLOYMENT.md](./VERCEL_DEPLOYMENT.md)
3. **Development?** See [IMPLEMENTATION_PLAN.md](./IMPLEMENTATION_PLAN.md)
4. **General?** Check [README.md](./README.md)

## Features Implemented

✅ Beautiful UI with TailwindCSS
✅ Global state management
✅ User authentication flow
✅ Store profile management
✅ Inventory alerts
✅ Phone number settings
✅ AI-powered voice transcription
✅ Transaction confirmation
✅ Balance tracking
✅ Transaction history
✅ Multi-screen navigation

## What's Next?

- Deploy to Vercel (production)
- Setup error tracking
- Add backend API
- Mobile app (React Native)
- Real-time notifications

---

**Happy coding! 🚀**
