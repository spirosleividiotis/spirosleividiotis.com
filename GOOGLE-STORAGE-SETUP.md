## Goal

Stop using Cloudinary and host portfolio media on **Google Cloud Storage (GCS)**, while keeping your site code simple (static HTML/CSS/JS) and your CMS uploader working.

This repo supports:

- **`content.json.mediaBaseUrl`**: a single base URL that gets prefixed to any media value that’s a filename / relative path.
- **CMS uploads to GCS** from `admin.html` via a signed URL endpoint: `POST /api/gcs-sign`.

---

## Option A (fastest): No Google needed

If you’re happy hosting media directly on your Vercel site, you can simply **stop paying Cloudinary** and you’re done.

---

## Option B: Move media to Google Cloud Storage

### 1) Create a bucket

In Google Cloud Console:

- Create a bucket (e.g. `spirosleividiotis-media`)
- Turn on **Uniform bucket-level access**
- Set the bucket location to what you prefer (EU is common if you’re based in Amsterdam)

### 2) Make objects readable (public)

If you want totally public media URLs (typical for a portfolio):

- Grant **Storage Object Viewer** to **allUsers** at the bucket level

If you don’t want fully public, you’ll need a different approach (signed read URLs / auth).

### 3) (Recommended) Set CORS for browser playback

For videos/audio loaded by the site, CORS is usually fine by default, but if you hit issues, set CORS on the bucket to allow GET/HEAD from your domain.

### 4) Create a Service Account for uploads

- Create a service account
- Give it permissions to write objects in your bucket (e.g. **Storage Object Admin** or a narrower role)
- Create a **JSON key**

Do **not** commit this key to the repo.

### 5) Add Vercel environment variables

In Vercel project settings → Environment Variables:

- **`GCS_BUCKET`**: your bucket name (e.g. `spirosleividiotis-media`)
- **`GCS_SERVICE_ACCOUNT_JSON`**: paste the full JSON key contents
- **`GCS_PUBLIC_BASE_URL`** (optional): if you want a custom public base URL
  - Default is `https://storage.googleapis.com/<bucket>`

### 6) Set `mediaBaseUrl` in the CMS

Open `admin.html` → Modules panel:

- Set **Media base URL** to:
  - `https://storage.googleapis.com/<YOUR_BUCKET>`

Now any media value like `portfolio/uploads/images/.../file.png` will load from that bucket.

### 7) Upload via the CMS

In `admin.html`, use the **Upload** buttons.

The CMS will:

- Ask `POST /api/gcs-sign` for a signed PUT URL
- Upload the file directly to GCS
- Save a **relative path** into your `content.json` field (so it works with `mediaBaseUrl`)

---

## Notes / gotchas

- **Cache**: GCS caching depends on object metadata. If you need aggressive caching, set `Cache-Control` on objects (can be done during upload via other tooling).
- **File names**: the uploader writes into `portfolio/uploads/...` with a timestamp prefix to avoid collisions.
- **Security**: keep `GCS_SERVICE_ACCOUNT_JSON` in Vercel env vars only.

