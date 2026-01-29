# 📐 Media Dimensions Guide

## 🎨 Project Cards (Homepage)

**Location:** Homepage project grid (`.work-visual`)

**Actual Rendered Dimensions:**
- **Width:** ~712px (responsive - in 2-column grid)
- **Height:** 502px (fixed)
- **Aspect Ratio:** 1.42:1 (closer to 3:2, almost square!)

**Recommended Export:**
- **Desktop:** 1400×1000px (3:2 ratio)
- **Alternative:** 1200×850px (1.4:1)
- **Square also works:** 1000×1000px
- **Mobile:** 800×800px (square)
- **Format:** JPG, PNG, GIF, MP4, WEBM
- **File Size:** Keep under 5MB for fast loading

**Notes:**
- Images/videos use `object-fit: cover` (crops to fill)
- Project name/company overlay on top right
- Supports animated GIFs and video loops
- Think "tall-ish portrait" or "nearly square", NOT widescreen

---

## 🏢 Experience Company Images/GIFs/Videos

**Location:** Experience section right visual (`.visual-placeholder`)

**Actual Rendered Dimensions:**
- **Width:** ~572px (responsive - in 3-column grid)
- **Height:** 502px (fixed)
- **Aspect Ratio:** 1.14:1 (BASICALLY SQUARE!)

**Recommended Export:**
- **Best:** 1000×880px (1.14:1)
- **Square works great:** 1000×1000px
- **Alternative:** 800×700px
- **Mobile:** 800×800px (square)
- **Format:** JPG, PNG, GIF, MP4, WEBM
- **File Size:** Keep under 5MB

**Notes:**
- Uses `background-size: cover` (crops to fill)
- Has grayscale filter applied (100%)
- Dark overlay (rgba(0,0,0,0.5)) on top
- Videos autoplay, loop, muted
- **Use square or near-square images!**

---

## 🎬 Project Hero (Inside Modal)

**Location:** Top of project modal (`.project-hero`)

**Dimensions:**
- **Aspect Ratio:** 16:9 (responsive)
- **Width:** 100% of modal content (max-width: 1400px)
- **Height:** Auto (calculated from aspect ratio)

**Recommended Export:**
- **Desktop:** 1920px × 1080px (16:9)
- **Mobile:** 1200px × 675px (16:9)
- **Format:** JPG, PNG, GIF, MP4, WEBM
- **File Size:** Keep under 10MB

**Notes:**
- Uses `object-fit: cover` (crops to fill)
- Full width of modal content area
- Perfect for wide hero images/videos

---

## 📸 Project Grid (Inside Modal)

**Location:** Grid below hero in project modal (`.project-grid-item`)

**Dimensions:**
- **Aspect Ratio:** 1:1 (square)
- **Grid:** 2 columns on desktop, 1 column on mobile
- **Gap:** 30px between items
- **Width:** 100% (responsive)

**Recommended Export:**
- **Desktop:** 1200px × 1200px (square)
- **Mobile:** 800px × 800px (square)
- **Format:** JPG, PNG, GIF, MP4, WEBM
- **File Size:** Keep under 5MB per item

**Notes:**
- Uses `object-fit: cover` (crops to fill)
- Perfect square format
- Videos autoplay on hover (desktop)
- Click to play fullscreen

---

## 📊 Summary Table

| Location | Aspect Ratio | Desktop Size | Mobile Size | Format |
|----------|--------------|--------------|-------------|--------|
| **Project Cards** | 1.42:1 (3:2-ish) | 1400×1000px | 800×800px | JPG/PNG/GIF/MP4 |
| **Experience** | 1.14:1 (square!) | 1000×880px | 800×800px | JPG/PNG/GIF/MP4 |
| **Project Hero** | 16:9 | 1920×1080px | 1200×675px | JPG/PNG/GIF/MP4 |
| **Project Grid** | 1:1 | 1200×1200px | 800×800px | JPG/PNG/GIF/MP4 |

---

## 💡 Tips

1. **For Project Cards:** Use NEAR-SQUARE or 3:2 portrait orientation (NOT widescreen!)
2. **For Experience:** SQUARE or near-square (1:1 or 1.14:1) works perfectly
3. **For Project Hero:** Wide cinematic format (16:9) showcases work best
4. **For Project Grid:** Square format (1:1) is perfect for detail shots
5. **File Optimization:** Compress images/videos before uploading to Cloudinary
6. **Video Loops:** Keep loops short (2-5 seconds) for better UX
7. **GIFs:** Use optimized GIFs or consider MP4 for better file sizes

---

## 🎯 Quick Reference

**Project Card Preview:** 1400×1000px (3:2 portrait, almost square)
**Experience Logo:** 1000×880px or 1000×1000px (square!)  
**Project Hero:** 1920×1080px (16:9 wide)
**Project Grid Item:** 1200×1200px (1:1 square)
