# Portfolio CMS - Quick Guide

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
- Music player song and file
- Reel video file
- Amsterdam Spotify link
- CV file

#### 4. **Projects** - Portfolio projects
- Project name and company
- Background colors
- Password protection (for specific projects)
- Click "Edit" on any project to modify

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

## Adding Media Files (Images, Videos, Audio)

### For Images/Photos:
1. Add your image to the `portfolio-deploy` folder
2. In the CMS, use just the filename (e.g., `my-photo.jpg`)
3. Save and push

### For Videos/Audio:
1. Add your media file to the `portfolio-deploy` folder
2. In the CMS, update the filename (e.g., `reel.mp4` or `music.mp3`)
3. Save and push

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

### Add new media files:
```bash
git add *.jpg *.png *.mp4 *.mp3
git add content.json
git commit -m "Add new media and update content"
git push
```

### Check deployment status:
Go to: https://vercel.com/spiros-leividiotis-projects/spirosleividiotis-com

---

**Need help?** Just message me! But now you can update most things yourself without me 😊
