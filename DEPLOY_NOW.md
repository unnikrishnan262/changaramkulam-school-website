# 🚀 Deploy Your Website NOW - Quick Commands

Follow these steps in order. Copy and paste each command.

## Step 1: Initialize Git (2 minutes)

```bash
# Navigate to your project
cd /Users/swetha/Documents/unni-codes/website

# Initialize git repository
git init

# Add all files
git add .

# Create first commit
git commit -m "Initial commit: Changaramkulam UP School website"
```

✅ **Your code is now ready for GitHub!**

---

## Step 2: Push to GitHub (3 minutes)

### A. Create GitHub Repository

1. Go to https://github.com/new
2. **Repository name:** `changaramkulam-school-website`
3. **Description:** "Modern website for Changaramkulam U P School"
4. **Visibility:** Public (or Private - your choice)
5. **DO NOT check any boxes** (no README, no .gitignore, no license)
6. Click **"Create repository"**

### B. Push Your Code

GitHub will show you commands. Use these (replace YOUR_USERNAME):

```bash
# Add GitHub as remote (replace YOUR_USERNAME with your GitHub username)
git remote add origin https://github.com/YOUR_USERNAME/changaramkulam-school-website.git

# Rename branch to main
git branch -M main

# Push to GitHub
git push -u origin main
```

✅ **Your code is now on GitHub!**

---

## Step 3: Deploy to Vercel (5 minutes)

### A. Sign Up to Vercel

1. Go to https://vercel.com/signup
2. Click **"Continue with GitHub"** (easiest option)
3. Authorize Vercel to access your GitHub

### B. Import Your Project

1. Click **"Add New..."** → **"Project"**
2. Find `changaramkulam-school-website` in the list
3. Click **"Import"**

### C. Configure & Deploy

**Framework Preset:** Next.js ✅ (auto-detected, don't change)

**CRITICAL: Add Environment Variables**

Click **"Environment Variables"** and add each of these:

```
NEXT_PUBLIC_SUPABASE_URL
https://gzbpwddnxbqcljwtunog.supabase.co

NEXT_PUBLIC_SUPABASE_ANON_KEY
sb_publishable_t-qfRtPoZ4GNe5kKWdltBQ_GAFHUWmC

SUPABASE_SERVICE_ROLE_KEY
sb_secret_oqetPKNmtIrpXPMoEdKhlg_43pduz8H

OPENAI_API_KEY
(your OpenAI API key from .env.local)

RESEND_API_KEY
re_5BNA68Bf_JzfaRdLGB9qea7Eaw9P255PV

CONTACT_EMAIL
admin@changaramkulamupschool.in

NEXT_PUBLIC_SITE_URL
https://changaramkulam-school-website.vercel.app
```

**Important:** For each variable:
- Paste the NAME in the left field
- Paste the VALUE in the right field
- Make sure to select: **Production, Preview, Development** (all three)
- Click **"Add"**

### D. Deploy!

1. Click **"Deploy"** button
2. Wait 2-3 minutes (you'll see build logs)
3. 🎉 **Success!** You'll get a URL like:
   `https://changaramkulam-school-website.vercel.app`

---

## Step 4: Test Your Live Website

Visit your Vercel URL and check:

- ✅ Home page loads
- ✅ All pages work (About, Events, Gallery, Contact)
- ✅ Admin login works at `/login`
- ✅ Chatbot appears and responds
- ✅ Images load correctly

---

## Step 5: Update SITE_URL (Important!)

After deployment, update the environment variable:

1. Copy your actual Vercel URL (e.g., `https://changaramkulam-school-website.vercel.app`)
2. In Vercel Dashboard → Your Project → **Settings** → **Environment Variables**
3. Find `NEXT_PUBLIC_SITE_URL`
4. Click **"Edit"**
5. Update the value to your actual Vercel URL
6. Click **"Save"**
7. Go to **Deployments** tab → Click **"Redeploy"** (to apply the change)

---

## 🎊 YOU'RE LIVE!

Your website is now:
- ✅ **Live** on the internet at your Vercel URL
- ✅ **Free** (no cost!)
- ✅ **Fast** (Vercel's global CDN)
- ✅ **Secure** (automatic HTTPS)
- ✅ **Auto-deploying** (every git push updates your site!)

---

## 📱 Share Your Website

Your website URL:
```
https://changaramkulam-school-website.vercel.app
```

(Vercel will give you the exact URL after deployment)

---

## 🔄 How to Update Website in Future

Whenever you want to update content or code:

```bash
# Make your changes in the code or via admin panel

# If you changed code files, commit and push:
git add .
git commit -m "Description of changes"
git push

# Vercel automatically deploys the changes!
# Wait 2-3 minutes and your website is updated
```

**For content changes** (Home, About, Events, etc.):
- Just use the Admin Panel - changes are instant!
- No need to redeploy

---

## 🌐 Optional: Add Custom Domain

If you want `changaramkulamupschool.in` instead of Vercel URL:

1. **In Vercel:**
   - Go to your project → Settings → Domains
   - Click "Add" → Enter `changaramkulamupschool.in`
   - Also add `www.changaramkulamupschool.in`

2. **Update DNS** (at your domain registrar):
   ```
   Type: A
   Name: @
   Value: 76.76.21.21

   Type: CNAME
   Name: www
   Value: cname.vercel-dns.com
   ```

3. Wait for DNS to propagate (usually 1 hour)

---

## 🆘 Troubleshooting

### Build Failed?
- Check the error in deployment logs
- Most common: Missing environment variables
- Solution: Add all variables listed in Step 3C

### Website loads but looks broken?
- Check environment variables are correct
- Verify Supabase URL and keys are accurate

### Admin login doesn't work?
- Check `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- Verify they match your Supabase project

### Chatbot doesn't respond?
- Check `OPENAI_API_KEY` is set correctly
- Verify you have API credits: https://platform.openai.com/usage

---

## 📊 Free Tier Limits

**Vercel Free:**
- 100GB bandwidth/month
- Unlimited sites
- ✅ Perfect for school website (handles thousands of visitors)

**Supabase Free:**
- 500MB database
- 1GB file storage
- ✅ Plenty for a school website

**OpenAI Free Credits:**
- $5 free (expires in 3 months)
- Then ~$0.002 per chatbot message
- ✅ Very affordable

**Total Monthly Cost After Free Credits:** ~₹50-200 depending on chatbot usage

---

## 🎯 What You Get

✅ Professional school website
✅ Full content management system
✅ AI chatbot for visitors
✅ Fast, secure, and modern
✅ Mobile-friendly
✅ SEO optimized
✅ Admin portal for easy updates
✅ Automatic deployments

**All for FREE!** 🎉
