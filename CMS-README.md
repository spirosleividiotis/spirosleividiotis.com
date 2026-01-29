# Portfolio CMS - Quick Guide

## ⚠️ FIRST TIME SETUP: Enable File Uploads
**Before you can upload photos/videos, follow the setup guide:**
📄 See **`CLOUDINARY-SETUP.md`** for step-by-step instructions (takes 5 minutes)

Once set up, you can upload files directly from the CMS! 🎉

---

## How to Update Your Site Content

### Step 1: Access the CMS
1. Go to **yoursite.com/admin.html** (or `spirosleividiotis-com.vercel.app/admin.html`)
2. Login with password: `310890`

### Step 2: Edit Content
The CMS has 7 tabs for editing different sections:

#### 1. **Hero** - Homepage header
- Your name and subtitle
- Profile photo
- Tools and skills tags

#### 2. **About Me** - About me modal
- Photo
- Biography text (3 paragraphs)

#### 3. **Music & Reel** - Media files
- Music player song and file (with Remove button)
- Reel video file (with Remove button)
- Amsterdam Spotify link
- CV file (with Remove button)
- **📁 Pro tip:** Add your files to the root folder first, then enter the filename

#### 4. **Projects** - Portfolio projects
- Project name and company
- Background colors
- Password protection (for specific projects)
- **NEW:** Body text field - add descriptions between hero and grid
- **NEW:** Hero image - wide banner at the top
- **NEW:** Grid assets - 2-column layout for images/videos
- Click "Edit" on any project to modify
- Remove buttons for clearing hero/grid assets

#### 5. **Experience** - Work history
- Company names and images
- Job titles and periods
- Role descriptions
- Edit multiple roles per company

#### 6. **Grid Images** - Grid modal gallery
- Add image/GIF filenames for the grid view
- Supports: JPG, PNG, GIF, MP4

#### 7. **Footer** - Contact section
- Email address
- Social links (Dribbble, LinkedIn)
- Logo and year

### Step 3: Save & Publish
1. Click **"Save Changes & Download"** at the bottom
2. A `content.json` file will download
3. Replace the file in your project folder:
   ```
   /Users/spiros.leividiotis/Desktop/portfolio-deploy/content.json
   ```
4. Push to GitHub:
   ```bash
   cd /Users/spiros.leividiotis/Desktop/portfolio-deploy
   git add content.json
   git commit -m "Update site content"
   git push
   ```
5. Vercel will automatically rebuild (takes ~1 minute)
6. Your site is live with the new content! 🎉

## 📤 Uploading Files (After Cloudinary Setup)

### Easy File Upload Workflow:
1. **Click** the "Upload" button next to any file field
2. **Drag & drop** or browse for your file
3. **Wait** for upload (progress bar shows status)
4. **Done!** File automatically saves with preview

### For Each Section:

#### CV / Music / Reel:
- Click **"Upload PDF"** / **"Upload Audio"** / **"Upload Video"**
- Select file (max 100MB)
- See preview after upload
- Click "Remove" to clear

#### Profile Photos:
- Click **"Upload Photo"** 
- Select image (JPG, PNG, GIF)
- Preview shows immediately
- Click "Remove" to clear

#### Project Assets:
1. **Hero Image:**
   - Click "Upload" next to hero field
   - Select one wide banner image/video
2. **Grid Assets:**
   - Click "Upload Grid Images (Multiple Files)"
   - Select multiple images/videos at once
   - They'll appear in the 2-column grid
3. **Body Text:**
   - Just type directly in the textarea
   - Use Enter for line breaks

### Supported Formats:
- **Images:** JPG, PNG, GIF, WebP
- **Videos:** MP4, WebM
- **Audio:** MP3, WAV
- **Documents:** PDF

### Tips:
- Use descriptive filenames: `qonto-project-1.jpg` instead of `image1.jpg`
- Keep file sizes reasonable for web (compress images/videos)
- Supported formats:
  - Images: JPG, PNG, GIF, WebP
  - Video: MP4, WebM
  - Audio: MP3, WAV

## Quick Commands

### Update content only:
```bash
git add content.json
git commit -m "Update content"
git push
```

### After uploading files via CMS:
```bash
# Files are already in the cloud, just save content.json
git add content.json
git commit -m "Update content with new media URLs"
git push
```

### Check deployment status:
Go to: https://vercel.com/spiros-leividiotis-projects/spirosleividiotis-com

---

**Need help?** Just message me! But now you can update most things yourself without me 😊
