# MarketPulse AI

A modern, high-fidelity mobile platform designed for traders and merchants to manage their business operations, inventory, and market presence with intelligent insights and real-time notifications.

## 📱 Overview

MarketPulse AI is a React-based frontend application that provides traders with a comprehensive suite of tools to manage their store profiles, monitor inventory levels, receive price alerts, and access market intelligence. Built with modern web technologies and designed with a focus on user experience, accessibility, and security.

## ✨ Key Features

- **Store Profile Management** - Manage public-facing business identity and details
- **Inventory Alerts** - Real-time notifications for stock levels and price changes
- **Phone Number Security** - Secure phone number management with verification
- **Market Intelligence** - Access to market trends and trading insights
- **User Authentication** - Secure OTP-based login and verification
- **Profile Management** - Complete user profile settings and customization
- **Trade History** - Track all market transactions and history
- **Credit System** - Manage and track credit balances
- **Weekly Pulse Reports** - Comprehensive market analysis and insights

## 🏗️ Project Structure

```
marketPulse/
├── frontend/                           # React + TailwindCSS frontend application
│   ├── src/
│   │   ├── components/                # Reusable React components
│   │   │   ├── StoreProfile.jsx       # Store profile management screen
│   │   │   ├── InventoryAlert.jsx     # Inventory alert settings
│   │   │   ├── PhoneNumber.jsx        # Phone number settings
│   │   │   ├── WelcomePage.jsx        # Welcome/onboarding screen
│   │   │   ├── otp.jsx                # OTP entry screen
│   │   │   ├── otpVerification.jsx    # OTP verification
│   │   │   ├── homepage.jsx           # Main dashboard
│   │   │   ├── profile.jsx            # User profile
│   │   │   ├── analysing.jsx          # Market analysis
│   │   │   ├── history.jsx            # Trade history
│   │   │   ├── credit.jsx             # Credit management
│   │   │   ├── weekly_pulse.jsx       # Weekly reports
│   │   │   ├── listeng.jsx            # Listing/marketplace
│   │   │   ├── market_category.jsx    # Market categories
│   │   │   └── language_setting.jsx   # Language settings
│   │   ├── assets/                    # Images and static assets
│   │   ├── App.jsx                    # Main application component
│   │   ├── App.css                    # Application styles
│   │   ├── index.css                  # Global styles with TailwindCSS
│   │   └── main.jsx                   # React entry point
│   ├── public/                        # Static files
│   ├── index.html                     # HTML template
│   ├── vite.config.js                 # Vite configuration
│   ├── tailwind.config.js             # TailwindCSS configuration
│   ├── postcss.config.js              # PostCSS configuration
│   ├── package.json                   # Project dependencies
│   └── eslint.config.js               # ESLint configuration
├── README.md                          # This file
└── .gitignore                         # Git ignore rules

```

## 🛠️ Tech Stack

### Frontend

- **React** `^19.2.6` - UI library
- **Vite** `^8.0.12` - Build tool and dev server
- **TailwindCSS** `^4.3.0` - Utility-first CSS framework
- **@tailwindcss/postcss** - PostCSS plugin for TailwindCSS
- **Lucide React** - Icon library
- **PostCSS** `^8.5.15` - CSS transformation
- **Autoprefixer** `^10.5.0` - CSS vendor prefixes

### Development Tools

- **ESLint** `^10.3.0` - Code linting
- **@vitejs/plugin-react** `^6.0.1` - Vite React plugin

## 📋 Requirements

- **Node.js** `>=14.0.0`
- **npm** `>=6.0.0` or **yarn** `>=1.22.0`

## 🚀 Getting Started

### Installation

1. **Clone the repository**

```bash
git clone https://github.com/Chigybillionz/marketpulse.git
cd marketPulse
```

2. **Navigate to frontend directory**

```bash
cd frontend
```

3. **Install dependencies**

```bash
npm install
```

### Development Server

Start the development server on `http://localhost:3000/`

```bash
npm run dev
```

The application will automatically reload when you make changes to the code.

### Build for Production

Create an optimized production build:

```bash
npm run build
```

### Preview Production Build

Preview the production build locally:

```bash
npm run preview
```

### Linting

Run ESLint to check code quality:

```bash
npm run lint
```

## 🎨 Design System

### Color Palette

| Color              | Hex Code  | Usage                          |
| ------------------ | --------- | ------------------------------ |
| Soft Off-White     | `#f8f9ff` | Main background                |
| Deep Forest Green  | `#052e16` | Primary text, buttons, borders |
| Light Cream/Beige  | `#fffbeb` | Input field backgrounds        |
| Light Blue-Grey    | `#e8f0fe` | Info cards, icon backgrounds   |
| Success Green      | `#dcfce7` | Verification badges background |
| Success Green Text | `#166534` | Verification badge text        |

### Typography

- **Font Family:** Lexend (throughout the application)
- **Header Weight:** Bold (700)
- **Body Weight:** Regular/Medium (400-500)
- **Line Height:** 1.4 - 1.8 (generous spacing)

### Component Styles

- **Border Radius:** 16px (cards), 8px (inputs)
- **Shadows:** Subtle "Elevation 1" shadows
- **Accent Borders:** 4px left borders on cards
- **Transitions:** Smooth 200-300ms transitions on hover states

## 📦 Component Documentation

### StoreProfile

Allows traders to manage their public-facing business identity including business name, location, and business type with verification badges.

**Route:** `storeProfile`

### InventoryAlert

Manages notification rules for stock level alerts and price changes with threshold controls and proactive monitoring features.

**Route:** `inventoryAlert`

### PhoneNumber

Secure phone number management interface with verification status and security information cards.

**Route:** `phoneNumber`

### WelcomePage

Onboarding screen for new users with account creation flow.

**Route:** `welcome`

### Homepage

Main dashboard displaying user's market overview and quick actions.

**Route:** `home`

## 🔐 Security Features

- **Phone Number Encryption:** All phone numbers are encrypted and never shared with third parties
- **OTP Verification:** Two-factor authentication using One-Time Passwords
- **Account Security:** Secure trading with trade notifications and identity verification
- **Data Privacy:** All sensitive data is protected with industry-standard encryption

## 📱 Responsive Design

The application is optimized for mobile-first responsive design:

- Mobile: 320px - 480px
- Tablet: 481px - 768px
- Desktop: 769px+

All components are fully responsive using TailwindCSS utility classes.

## 🚀 Deployment

### Vercel Deployment (Recommended)

For detailed Vercel deployment instructions, see [VERCEL_DEPLOYMENT.md](./VERCEL_DEPLOYMENT.md)

**Quick Start:**

1. Sign up at https://vercel.com with GitHub
2. Import the repository
3. Set environment variables in Vercel Dashboard
4. Deploy automatically on git push

### Build and Deploy

1. Build the application:

```bash
npm run build
```

2. The `dist` folder contains the production-ready files

3. Deploy the `dist` folder to your hosting provider (Vercel, Netlify, AWS S3, etc.)

### Environment Variables

Create a `.env.local` file in the `frontend` directory for environment-specific variables:

```
VITE_GEMINI_API_KEY=your_api_key_here
VITE_APP_NAME=MarketPulse AI
VITE_API_URL=http://localhost:3000
```

**Important:** Do NOT commit `.env.local` to Git

## 🤖 Gemini AI Integration

MarketPulse includes AI-powered voice-to-text analysis using Google's Gemini API.

### Quick Setup

For complete Gemini API setup instructions, see [GEMINI_SETUP.md](./GEMINI_SETUP.md)

**Requirements:**

- Google Cloud Account
- Gemini API enabled
- API key configured in environment variables

**Features:**

- 🎙️ Voice recording for transactions
- 🤖 AI analysis of transactions
- 💬 Transaction confirmation with AI insights
- 📊 Real-time market data processing

**Setup Steps:**

1. Create Google Cloud project
2. Enable Generative Language API
3. Generate API key
4. Add to `.env.local`
5. Install: `npm install @google/generative-ai`

## 📈 Project Roadmap

### Completed ✅

- [x] Core project setup with React and TailwindCSS
- [x] Store Profile component
- [x] Inventory Alert Settings component
- [x] Phone Number Settings component
- [x] Multiple authentication and dashboard screens
- [x] Global state management (App.jsx)
- [x] Gemini API integration setup
- [x] Voice recording service
- [x] Vercel deployment configuration

### In Progress 🔄

- [ ] Connect all screens with navigation flows
- [ ] Test voice loop and AI confirmation
- [ ] Backend API integration
- [ ] Real-time notifications

### Planned 📋

- [ ] Mobile app (React Native)
- [ ] Advanced market analytics
- [ ] Advanced trading tools
- [ ] Merchant network features
- [ ] SMS notifications
- [ ] Push notifications

## 🤝 Contributing

Contributions are welcome! Please follow these guidelines:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Code Style

- Use ESLint for code linting
- Follow the existing code structure and naming conventions
- Write meaningful commit messages
- Ensure all components are properly styled with TailwindCSS

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙋 Support

For questions, issues, or suggestions, please:

- Open an issue on GitHub
- Contact the development team

## 🔗 Links

- **GitHub Repository:** [https://github.com/Chigybillionz/marketpulse.git](https://github.com/Chigybillionz/marketpulse.git)
- **Documentation:** (Coming soon)

## 👥 Team

**MarketPulse AI** is developed and maintained by the development team.

---

**Last Updated:** May 29, 2026

**Version:** 1.0.0
