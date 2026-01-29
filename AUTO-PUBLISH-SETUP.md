# 🚀 Auto-Publish Setup Guide

This guide shows you how to enable the **"Save & Publish Live"** button in your CMS, which automatically pushes changes to GitHub without needing to download/upload files manually.

---

## **How It Works**

1. You click **"Save & Publish Live"** in the CMS
2. A serverless function (`/api/publish.js`) commits your `content.json` to GitHub
3. Vercel detects the change and redeploys your site automatically
4. Your site is live in ~60 seconds! 🎉

---

## **Setup Steps**

### **Step 1: Create a GitHub Personal Access Token**

You need a token that allows the serverless function to commit to your repo.

1. Go to: https://github.com/settings/tokens
2. Click **"Generate new token"** → **"Generate new token (classic)"**
3. Give it a name: `Portfolio CMS Auto-Publish`
4. Set expiration: **No expiration** (or 1 year if you prefer)
5. Check these permissions:
   - ✅ **`repo`** (all repo permissions)
   - That's it! Just the `repo` scope.
6. Click **"Generate token"** at the bottom
7. **COPY THE TOKEN IMMEDIATELY** (you won't see it again)
   - It looks like: `ghp_xxxxxxxxxxxxxxxxxxxxxxxxxxxx`

---

### **Step 2: Add Token to Vercel**

1. Go to your Vercel dashboard: https://vercel.com/dashboard
2. Click on your project: **`spirosleividiotis-com`**
3. Go to **Settings** tab
4. Click **"Environment Variables"** in the left sidebar
5. Click **"Add New"** button
6. Fill in:
   - **Name**: `GITHUB_TOKEN`
   - **Value**: Paste your token from Step 1 (e.g., `ghp_xxxxxxxxxxxx`)
   - **Environment**: Select **ALL** (Production, Preview, Development)
7. Click **"Save"**

---

### **Step 3: Redeploy**

After adding the environment variable, you need to trigger a redeploy so Vercel picks it up:

1. Go to **Deployments** tab in Vercel
2. Find your latest deployment
3. Click the **"..."** menu (3 dots)
4. Click **"Redeploy"**
5. Confirm the redeploy

**OR** just push any change to GitHub (even this README file).

---

### **Step 4: Test**

1. Wait ~60 seconds for the redeploy to finish
2. Go to your CMS: https://spirosleividiotis.com/admin.html
3. Make a small change (e.g., change footer year)
4. Click **"🚀 Save & Publish Live"**
5. You should see:
   - ⏳ "Publishing..." (button disabled)
   - ✅ "Published successfully!" with a link to the GitHub commit
6. Wait ~60 seconds and refresh your site to see the change!

---

## **Troubleshooting**

### **❌ "GitHub token not configured"**

- Make sure you added `GITHUB_TOKEN` to Vercel environment variables
- Make sure you redeployed after adding it
- Check the variable name is exactly `GITHUB_TOKEN` (case-sensitive)

### **❌ "Failed to publish"**

- Check your token has `repo` permissions
- Make sure the token hasn't expired
- Try regenerating the token and updating it in Vercel

### **❌ "403 Forbidden" or "Permission denied"**

- Your token doesn't have enough permissions
- Regenerate with `repo` scope checked

---

## **Security Notes**

- ✅ The token is stored as an **environment variable** in Vercel (secure)
- ✅ It's never exposed to the client (browser)
- ✅ Only the serverless function can access it
- ✅ The function only allows updating `content.json`, nothing else
- ⚠️ **Never commit your token to Git** (it's only in Vercel environment variables)

---

## **Fallback**

If auto-publish doesn't work for any reason, you can always use:

1. Click **"💾 Save & Download JSON"**
2. Manually push the file to GitHub via Git:
   ```bash
   git add content.json
   git commit -m "Update content"
   git push
   ```

---

## **Questions?**

- Check Vercel deployment logs if publish fails
- Check browser console for errors
- Make sure your GitHub token is valid and has correct permissions

---

**That's it!** Once set up, you can update your site with a single click. 🚀
