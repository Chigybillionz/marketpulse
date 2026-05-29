# Vercel Deployment Guide - MarketPulse AI

## Prerequisites

- GitHub account with MarketPulse repository
- Vercel account (free at https://vercel.com)
- Domain name (optional, Vercel provides free \*.vercel.app domain)

## Step 1: Prepare Your Project for Production

### 1.1 Install Dependencies

```bash
cd frontend
npm install
```

### 1.2 Build Locally to Test

```bash
npm run build
npm run preview
```

Visit `http://localhost:4173` to verify the build works

### 1.3 Run ESLint Check

```bash
npm run lint
```

Fix any linting errors before deploying

### 1.4 Create .env.local (Not committed to Git)

```env
VITE_GEMINI_API_KEY=your_api_key_here
VITE_APP_NAME=MarketPulse AI
VITE_API_URL=https://your-domain.vercel.app
```

**Do NOT commit .env.local to GitHub** - Add to .gitignore

## Step 2: Setup Vercel

### 2.1 Create Vercel Account

1. Go to https://vercel.com
2. Sign up with GitHub (recommended for easier integration)
3. Authorize Vercel to access your GitHub account

### 2.2 Import Project to Vercel

**Method 1: Dashboard Import (Recommended)**

1. Log in to Vercel Dashboard
2. Click "Add New..." → "Project"
3. Select your GitHub repository: `Chigybillionz/marketpulse`
4. Click "Import"

**Method 2: Vercel CLI**

```bash
npm i -g vercel
vercel
```

### 2.3 Configure Build Settings

In Vercel Dashboard → Project Settings:

**Build & Development Settings:**

- Framework Preset: `Vite`
- Build Command: `npm run build`
- Output Directory: `dist`
- Install Command: `npm install`
- Development Command: `npm run dev`

**Root Directory:** `frontend` (Important!)

## Step 3: Set Environment Variables in Vercel

1. Go to Vercel Dashboard → Your Project
2. Go to **Settings** → **Environment Variables**
3. Add the following variables for **Production**:

```
VITE_GEMINI_API_KEY: your_api_key
VITE_APP_NAME: MarketPulse AI
VITE_API_URL: https://your-project.vercel.app
```

4. Save variables

## Step 4: Configure CORS & Security

### 4.1 Update Gemini API Restrictions

1. Go to Google Cloud Console
2. Navigate to APIs & Services → Credentials
3. Edit your API Key
4. Under "Application restrictions" → "HTTP referrers (web)"
5. Add your Vercel domain:
   - `https://your-project.vercel.app/*`
   - `https://*.vercel.app/*` (for preview deployments)

### 4.2 Update vite.config.js for Production

```javascript
export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    host: "localhost",
  },
  build: {
    outDir: "dist",
    sourcemap: false, // Set to true for debugging
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ["react", "react-dom"],
        },
      },
    },
  },
});
```

## Step 5: Deploy

### 5.1 Deploy from Git Push (Automatic)

```bash
# In your local repo
git add .
git commit -m "Prepare for Vercel deployment"
git push origin main
```

Vercel will automatically:

- Detect the push
- Install dependencies
- Build the project
- Deploy to production

### 5.2 Deploy from CLI (Manual)

```bash
vercel --prod
```

## Step 6: Configure Custom Domain (Optional)

1. Go to Vercel Dashboard → Project Settings
2. Click "Domains"
3. Add your custom domain
4. Follow DNS configuration instructions from your domain provider
5. Add DNS records as shown in Vercel dashboard

## Step 7: Monitor Deployment

### View Deployment Logs

1. Vercel Dashboard → Deployments tab
2. Click on latest deployment
3. View build and runtime logs

### Set Up Alerts

1. Settings → Notifications
2. Enable email notifications for failures

## Production Checklist

- [ ] Environment variables set in Vercel
- [ ] Build successful (npm run build passes)
- [ ] No ESLint errors (npm run lint passes)
- [ ] Gemini API key set and configured
- [ ] API key restricted to production domain
- [ ] .env.local NOT committed to git
- [ ] README updated with deployment instructions
- [ ] Custom domain configured (if applicable)
- [ ] HTTPS enabled (automatic with Vercel)

## Performance Optimization

### Optimize for Production

```javascript
// vite.config.js
export default defineConfig({
  build: {
    minify: "terser",
    terserOptions: {
      compress: {
        drop_console: true, // Remove console logs in production
      },
    },
  },
});
```

### Image Optimization

Use next-gen image formats:

```bash
npm install --save-dev @vitejs/plugin-basic-ssl
```

### Bundle Analysis

```bash
npm install -D rollup-plugin-visualizer
```

## Troubleshooting Deployment

### Issue: "Build failed - dependency not found"

**Solution:**

```bash
rm -rf node_modules package-lock.json
npm install
npm run build
git add package-lock.json
git commit -m "Update dependencies"
git push origin main
```

### Issue: "Environment variable not defined"

**Check:**

- Variables set in Vercel Dashboard (not local .env)
- Variable names match VITE\_ prefix for Vite
- Case-sensitive variable names

### Issue: "Gemini API 401 Unauthorized"

**Solution:**

- Verify API key in Vercel environment variables
- Check API key is valid in Google Cloud Console
- Verify API is enabled in Google Cloud Project

### Issue: "Microphone permission error in production"

**Ensure:**

- HTTPS is enabled (automatic with Vercel)
- Domain is whitelisted in Gemini API settings
- Browser allows microphone access

## Rollback Deployment

If something breaks:

1. Go to Vercel Dashboard → Deployments
2. Find previous working deployment
3. Click the "..." menu → "Promote to Production"

## Post-Deployment Monitoring

### Setup Error Tracking (Optional)

```bash
npm install @sentry/react @sentry/tracing
```

### Monitor Performance

- Vercel Analytics (automatic)
- Web Vitals monitoring
- Real-time error tracking

## CI/CD Pipeline

Vercel automatically creates a CI/CD pipeline:

- Every push to `main` → production deployment
- Pull requests → preview deployments
- Automatic rollbacks on build failure

## Next Steps

1. Test all flows in production environment
2. Monitor performance metrics
3. Set up error tracking
4. Configure email notifications for failures
5. Regular backups (GitHub is your backup)

---

**Deployment Documentation:**

- Vercel: https://vercel.com/docs
- Vite: https://vitejs.dev/guide/deploy.html
- React: https://react.dev/learn/deployment

**Support:**

- Vercel Support: support@vercel.com
- Documentation: https://vercel.com/docs
