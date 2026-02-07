# Website Deployment Guide

## 🚀 Deploying to Vercel (Recommended - 100% Free)

Vercel is the **best choice** for Next.js websites. Created by the makers of Next.js with excellent integration and generous free tier.

---

## Step 1: Initialize Git Repository

Your project isn't a git repository yet. Let's set it up:

```bash
# Navigate to your project directory
cd /Users/swetha/Documents/unni-codes/website

# Initialize git
git init

# Create .gitignore (if not exists)
# This prevents committing sensitive files and dependencies
```

Create `.gitignore` file with this content (or verify it exists):

```
# dependencies
/node_modules
/.pnp
.pnp.js

# testing
/coverage

# next.js
/.next/
/out/

# production
/build

# misc
.DS_Store
*.pem

# debug
npm-debug.log*
yarn-debug.log*
yarn-error.log*

# local env files
.env*.local
.env.local

# vercel
.vercel

# typescript
*.tsbuildinfo
next-env.d.ts
```

**Important:** Make sure `.env.local` is in `.gitignore` - **NEVER commit your API keys!**

```bash
# Stage all files
git add .

# Create first commit
git commit -m "Initial commit: Changaramkulam UP School website"
```

---

## Step 2: Create GitHub Repository

1. Go to https://github.com
2. Click **"New"** (or the **+** icon → New repository)
3. Repository settings:
   - **Name:** `changaramkulam-school-website` (or any name you prefer)
   - **Description:** "Modern website for Changaramkulam U P School"
   - **Visibility:** Public or Private (your choice)
   - **DO NOT** initialize with README, .gitignore, or license (we already have code)
4. Click **"Create repository"**

---

## Step 3: Push Code to GitHub

GitHub will show you commands. Use these:

```bash
# Add GitHub as remote
git remote add origin https://github.com/YOUR_USERNAME/changaramkulam-school-website.git

# Push code to GitHub
git branch -M main
git push -u origin main
```

Replace `YOUR_USERNAME` with your GitHub username.

---

## Step 4: Deploy to Vercel

### Option A: Via Vercel Dashboard (Easiest)

1. **Sign Up/Login to Vercel**
   - Go to https://vercel.com
   - Click **"Sign Up"** (or Login if you have an account)
   - **Use "Continue with GitHub"** (easiest for deployment)

2. **Import Your Repository**
   - Click **"Add New..."** → **"Project"**
   - Vercel will show your GitHub repositories
   - Find and click **"Import"** next to your repository

3. **Configure Project**
   - **Framework Preset:** Next.js (auto-detected)
   - **Root Directory:** `./` (leave as default)
   - **Build Command:** `npm run build` (auto-filled)
   - **Output Directory:** `.next` (auto-filled)

4. **Add Environment Variables** (CRITICAL!)
   Click **"Environment Variables"** and add these:

   ```
   NEXT_PUBLIC_SUPABASE_URL=https://gzbpwddnxbqcljwtunog.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
   OPENAI_API_KEY=your_openai_api_key
   RESEND_API_KEY=your_resend_api_key
   CONTACT_EMAIL=admin@changaramkulamupschool.in
   NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=your_google_maps_api_key
   NEXT_PUBLIC_SITE_URL=https://YOUR_DOMAIN.vercel.app
   ```

   **Copy these from your `.env.local` file!**
   - Make sure to use your actual keys
   - Set for: **Production, Preview, and Development**

5. **Deploy!**
   - Click **"Deploy"**
   - Wait 2-3 minutes for build to complete
   - You'll get a URL like: `changaramkulam-school.vercel.app`

### Option B: Via Vercel CLI

```bash
# Install Vercel CLI
npm i -g vercel

# Login to Vercel
vercel login

# Deploy
vercel

# Follow the prompts:
# - Set up and deploy? Yes
# - Which scope? (select your account)
# - Link to existing project? No
# - Project name? changaramkulam-school
# - Directory? ./
# - Override settings? No

# Add environment variables via dashboard after first deploy
```

---

## Step 5: Configure Custom Domain (Optional)

If you want to use `changaramkulamupschool.in` instead of `*.vercel.app`:

1. **In Vercel Dashboard:**
   - Go to your project → **Settings** → **Domains**
   - Click **"Add"**
   - Enter: `changaramkulamupschool.in`
   - Also add: `www.changaramkulamupschool.in`

2. **Update DNS Settings** (at your domain registrar):

   Add these DNS records:

   **For Root Domain (changaramkulamupschool.in):**
   ```
   Type: A
   Name: @
   Value: 76.76.21.21
   TTL: 3600
   ```

   **For WWW:**
   ```
   Type: CNAME
   Name: www
   Value: cname.vercel-dns.com
   TTL: 3600
   ```

3. **Wait for DNS Propagation** (5 minutes to 48 hours, usually ~1 hour)

4. **Update Environment Variable:**
   In Vercel → Settings → Environment Variables:
   ```
   NEXT_PUBLIC_SITE_URL=https://changaramkulamupschool.in
   ```

---

## Step 6: Enable Automatic Deployments

Already set up! Every time you push to GitHub:
- **Main branch** → Automatic production deployment
- **Other branches** → Preview deployments

To update your website in the future:
```bash
# Make changes to your code
# Then commit and push
git add .
git commit -m "Update content"
git push

# Vercel automatically deploys! 🎉
```

---

## 🎯 Post-Deployment Checklist

After deployment, verify:

- [ ] Home page loads correctly
- [ ] All pages work (About, Events, Gallery, Contact)
- [ ] Admin login works
- [ ] Admin can edit content
- [ ] Images upload successfully
- [ ] Contact form sends emails
- [ ] Chatbot responds correctly
- [ ] Custom domain works (if configured)
- [ ] HTTPS is enabled (automatic with Vercel)

---

## 🆓 Alternative Free Hosting Options

### **2. Netlify**
- **Free Tier:** 100GB bandwidth, 300 build minutes/month
- **Pros:** Similar to Vercel, good alternative
- **Cons:** Slightly less optimized for Next.js
- **How:** https://netlify.com → Import from GitHub

### **3. Cloudflare Pages**
- **Free Tier:** Unlimited bandwidth, 500 builds/month
- **Pros:** Free, Cloudflare's fast CDN
- **Cons:** Less Next.js-specific features than Vercel
- **How:** https://pages.cloudflare.com → Connect GitHub

### **4. Railway** (formerly free, now paid only)
- ❌ No longer has a free tier (requires payment)

### **Why Vercel is Best for This Project:**
1. ✅ Made by Next.js creators - perfect compatibility
2. ✅ Automatic ISR (Incremental Static Regeneration) - your pages revalidate correctly
3. ✅ Edge functions work perfectly for API routes
4. ✅ Image optimization built-in
5. ✅ Best developer experience
6. ✅ Most generous free tier for Next.js

---

## 🔧 Troubleshooting

### Build Fails

**Error:** "Module not found"
- **Fix:** Make sure all dependencies are in `package.json`
- Run locally: `npm run build` to test

**Error:** "Environment variable missing"
- **Fix:** Add all required variables in Vercel dashboard

### Runtime Errors

**Error:** "Failed to fetch data from Supabase"
- **Fix:** Check environment variables are set correctly
- Verify Supabase RLS policies allow public read access

**Error:** Chatbot not working
- **Fix:** Verify `OPENAI_API_KEY` is set in Vercel
- Check OpenAI API credits haven't expired

### Performance Issues

**Slow image loading:**
- Ensure you're using `next/image` component
- Images are automatically optimized by Vercel

**Pages not updating:**
- Check ISR revalidation times in page files
- Can manually clear cache: Vercel Dashboard → Deployments → "Redeploy"

---

## 📊 Monitoring & Analytics

### Free Analytics Options:

1. **Vercel Analytics** (Built-in)
   - Go to your project → **Analytics**
   - Shows page views, top pages, performance
   - **Free tier:** 100k events/month

2. **Google Analytics** (Free)
   - Create account: https://analytics.google.com
   - Add tracking code to your website
   - Full visitor analytics

3. **Vercel Speed Insights** (Free)
   - Real-user performance monitoring
   - Core Web Vitals tracking

---

## 🔐 Security Checklist

- [x] `.env.local` is in `.gitignore` (API keys not in GitHub)
- [x] Supabase RLS policies are enabled on all tables
- [x] Only authenticated users can modify content
- [x] HTTPS is enabled (automatic with Vercel)
- [x] Environment variables stored securely in Vercel
- [x] Service role key only used server-side

---

## 📝 Maintenance

### Regular Tasks:

1. **Update Dependencies** (monthly)
   ```bash
   npm outdated
   npm update
   git commit -am "Update dependencies"
   git push
   ```

2. **Monitor Usage** (monthly)
   - Vercel Dashboard → Usage
   - Ensure within free tier limits
   - OpenAI API usage
   - Supabase storage/bandwidth

3. **Backup Database** (weekly)
   - Supabase Dashboard → Database → Backups
   - Download SQL dump
   - Store securely

4. **Review Analytics** (weekly)
   - Check visitor statistics
   - Monitor popular pages
   - Identify any errors

---

## 🎉 You're Done!

Your website will be live at:
- **Vercel URL:** `https://YOUR_PROJECT.vercel.app`
- **Custom Domain:** `https://changaramkulamupschool.in` (if configured)

**Total Monthly Cost:** ₹0 (FREE!) for moderate traffic

**Free Tier Limits:**
- **Vercel:** 100GB bandwidth (enough for ~50k page views/month)
- **Supabase:** 500MB database, 1GB storage (plenty for a school website)
- **OpenAI:** $5 free credits (expires in 3 months, then ~$0.002 per chatbot message)

---

## 🆘 Need Help?

If you encounter issues:
1. Check Vercel deployment logs: Dashboard → Deployments → Click on deployment → Logs
2. Check browser console for errors (F12 → Console)
3. Verify all environment variables are set correctly
4. Test locally first: `npm run build && npm start`

Common issue: If build succeeds but runtime fails, it's usually environment variables or Supabase RLS policies.
