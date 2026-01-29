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

## Adding Media Files (Images, Videos, Audio)

### File Upload Workflow (IMPORTANT):
1. **First:** Add your file to the `portfolio-deploy` folder on your computer
2. **Then:** Go to the CMS and enter just the filename (e.g., `my-photo.jpg`)
3. **Save:** Click "Save Changes & Download"
4. **Push:** Commit and push BOTH the file AND `content.json` to GitHub

### For CV / Music / Reel:
1. Add your file to `portfolio-deploy` folder
2. In CMS, enter the filename in the field
3. Use the "Remove" button to clear the field if needed
4. Files should be in the root folder (same level as `index.html`)

### For Project Assets:
1. Add your images/videos to `portfolio-deploy` folder
2. In the project edit form:
   - **Body Text:** Add description/context (optional)
   - **Hero Image:** Enter filename for wide banner (optional)
   - **Grid Assets:** Enter comma-separated filenames for 2-column grid
3. Example grid: `image1.jpg, video1.mp4, animation.gif`
4. Use "Remove" buttons to clear fields

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
