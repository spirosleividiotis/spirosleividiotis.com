# Cloudinary Setup Guide

## What is Cloudinary?
Cloudinary is a free cloud service that hosts your images, videos, and PDFs. It lets you upload files directly from the CMS without touching any code.

## Step-by-Step Setup (5 minutes)

### 1. Create Free Cloudinary Account
1. Go to: **https://cloudinary.com/users/register/free**
2. Sign up with your email
3. Verify your email

### 2. Get Your Credentials
After signing in:
1. Go to **Dashboard** (you'll see it immediately after login)
2. Copy these 2 values:
   - **Cloud Name** (e.g., `dxyz123abc`)
   - Scroll down to **Upload Presets** section

### 3. Create Upload Preset
1. In Dashboard, scroll to **Upload Presets**
2. Click **Add upload preset**
3. Settings:
   - **Preset name:** `portfolio_unsigned`
   - **Signing Mode:** Select **"Unsigned"**
   - **Folder:** `portfolio` (optional but recommended)
   - Click **Save**
4. Copy the **Upload Preset Name** (e.g., `portfolio_unsigned`)

### 4. Update admin.html
1. Open `/Users/spiros.leividiotis/Desktop/portfolio-deploy/admin.html`
2. Find these lines (around line 640):
   ```javascript
   const CLOUDINARY_CLOUD_NAME = 'YOUR_CLOUD_NAME';
   const CLOUDINARY_UPLOAD_PRESET = 'YOUR_UPLOAD_PRESET';
   ```
3. Replace with your actual values:
   ```javascript
   const CLOUDINARY_CLOUD_NAME = 'dxyz123abc'; // Your cloud name
   const CLOUDINARY_UPLOAD_PRESET = 'portfolio_unsigned'; // Your upload preset
   ```
4. Save the file

### 5. Push to GitHub
```bash
cd /Users/spiros.leividiotis/Desktop/portfolio-deploy
git add admin.html
git commit -m "Configure Cloudinary for file uploads"
git push
```

### 6. Wait ~1 minute for Vercel to deploy

### 7. Test It! 🎉
1. Go to **yoursite.com/admin.html**
2. Login
3. Go to **Music & Reel** tab
4. Click **"Upload Audio"** button
5. Select a file
6. It should upload and show a preview!

---

## How to Use After Setup

### Upload Files:
1. Click any **"Upload"** button
2. Drag & drop or browse for file
3. Wait for upload (you'll see a progress bar)
4. File URL automatically saves to the field
5. Preview appears below

### Remove Files:
1. Click **"Remove"** button
2. File URL is cleared (file stays in Cloudinary though)

### Project Assets:
- **Hero Image:** Upload one wide banner image/video
- **Grid Assets:** Click "Upload Grid Images" and select multiple files at once

---

## Free Tier Limits
- **Storage:** 25 GB
- **Bandwidth:** 25 GB/month
- **Transformations:** 25,000/month

This is more than enough for a portfolio! 🎉

---

## Troubleshooting

### "Cloudinary not configured" error
- Make sure you replaced `YOUR_CLOUD_NAME` and `YOUR_UPLOAD_PRESET` with your actual values
- Push the changes to GitHub
- Wait for Vercel to redeploy

### Upload fails
- Check if file is too large (max 100MB)
- Make sure upload preset is set to **"Unsigned"**
- Check file format is supported

### Preview doesn't show
- Hard refresh browser: `Cmd+Shift+R` (Mac) or `Ctrl+Shift+R` (Windows)

---

## Need Help?
Message me with:
- Screenshot of your Cloudinary dashboard
- Error message you're seeing
- What step you're stuck on

I'll help you get it working! 😊
