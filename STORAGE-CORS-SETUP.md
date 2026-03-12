# Fix Firebase Storage CORS Error

If you see **CORS error** when uploading images or videos in the admin panel, you need to configure CORS on your Firebase Storage bucket.

## Quick Fix (One-time setup)

### 1. Install Google Cloud SDK (includes gsutil)

**Windows (PowerShell):**
```powershell
# Download and run the installer from:
# https://cloud.google.com/sdk/docs/install
# Or use Chocolatey:
choco install gcloudsdk
```

**Mac/Linux:**
```bash
curl https://sdk.cloud.google.com | bash
exec -l $SHELL
```

### 2. Log in and set your project

```bash
gcloud auth login
gcloud config set project gym-website-226e8
```

### 3. Apply CORS configuration

From your project root (where `cors.json` is located):

```bash
gsutil cors set cors.json gs://gym-website-226e8.appspot.com
```

Or with the newer gcloud command:

```bash
gcloud storage buckets update gs://gym-website-226e8.appspot.com --cors-file=cors.json
```

### 4. Add your production domain (Vercel, custom domain)

Edit `cors.json` and add your live site URL to the `origin` array, for example:

```json
"origin": [
  "http://localhost",
  "http://localhost:5173",
  ...
  "https://your-site.vercel.app",
  "https://yourdomain.com"
]
```

Then run the `gsutil cors set` or `gcloud storage buckets update` command again.

---

## Verify

After applying CORS:

1. Restart your dev server (`npm run dev`)
2. Try uploading an image in Admin → Images
3. Try saving the About section with a gym image

CORS errors should be resolved.
