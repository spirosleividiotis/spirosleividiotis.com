# Portfolio CMS (admin-cms.html)

Use **admin-cms.html** to edit all site content. The live site and project modals are driven by **content.json**.

## Modules (on/off)

- Turn sections on or off: Header, Hero, About Me, Experience, Reel, Projects, Footer, Music, Analytics.
- When a module is off, that section is hidden on the site.

## What you can edit

- **Header** – Nav links (add/remove), location text & link, CV file.
- **Hero** – Name, subtitle, photo, tools, skills.
- **About Me** – Photo, bio paragraphs (add/remove).
- **Experience** – Companies and roles (add/remove), titles, dates, descriptions.
- **Reel** – Video URL.
- **Projects** – For each project: name, company, card preview, password, custom URL, media hero, **Body HTML**, grid media.
- **Footer** – Email, logo, year, social links (add/remove).
- **Music** – Title, audio file URL.
- **Analytics** – Script (e.g. Google Analytics).

## Project body HTML

- Each project can have **Body HTML**: the full HTML content that loads inside the project modal (same structure as the current project-*.html pages).
- To move a project into the CMS: open the existing project HTML file (e.g. `motion-system-content.html`), copy the full content (from the first `<style>` or `<div>` to the end), and paste into the project’s “Body HTML” field in the CMS.
- If **Body HTML** is set, the site uses it and does not load the **Custom URL** file. You can leave Custom URL as fallback or clear it.

## Save

- **Download JSON** – Saves `content.json` to your computer (replace the repo file to publish manually).
- **Save & Publish** – Sends content to `/api/publish` to update `content.json` on GitHub (requires Vercel + `GITHUB_TOKEN`).

## Locked site

- Layout and behaviour are locked (see **LOCKED-SITE.md**). Only content is edited via this CMS.
