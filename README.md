# FIT N FEAT — Gym Website

A fully responsive, animated gym website for **FIT N FEAT** (Adityapur, Jamshedpur). Built with **React + Vite**, **Firebase**, **Tailwind CSS**, and **Framer Motion**. Deployable on **Vercel** with a custom GoDaddy domain.

**Tagline:** Keep Fit & Gain Skills

---

## 🚀 Getting Started

### 1. Clone & Install
```bash
npm install
```

### 2. Configure Firebase

**Create a Firebase project at [console.firebase.google.com](https://console.firebase.google.com)**

Enable these services:
- **Authentication** → Email/Password
- **Firestore Database** → Start in production mode
- **Storage** → Start in production mode

**Copy your Firebase config into `.env`:**
```env
VITE_FIREBASE_API_KEY=your_api_key_here
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id

VITE_ADMIN_EMAIL=admin@yourgym.com
```

### 3. Create Admin User in Firebase

Go to **Firebase Console → Authentication → Users → Add User**
- Email: `admin@yourgym.com` (must match `VITE_ADMIN_EMAIL`)
- Password: choose a strong password

### 4. Set Firestore Rules

In Firebase Console → Firestore → Rules:
```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /images/{doc} {
      allow read: if true;
      allow write: if request.auth != null;
    }
    match /videos/{doc} {
      allow read: if true;
      allow write: if request.auth != null;
    }
    match /trainers/{doc} {
      allow read: if true;
      allow write: if request.auth != null;
    }
    match /settings/{doc} {
      allow read: if true;
      allow write: if request.auth != null;
    }
  }
}
```

### 5. Fix Storage CORS (for image/video uploads)

If you get **CORS errors** when uploading images or videos, run:

```bash
gsutil cors set cors.json gs://gym-website-226e8.appspot.com
```

See **[STORAGE-CORS-SETUP.md](./STORAGE-CORS-SETUP.md)** for full instructions (install gsutil, add your production domain, etc.).

### 6. Set Storage Rules

In Firebase Console → Storage → Rules:
```
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    match /{allPaths=**} {
      allow read: if true;
      allow write: if request.auth != null;
    }
  }
}
```

### 7. Configure EmailJS (Contact form emails)

1. Sign up at [dashboard.emailjs.com](https://dashboard.emailjs.com).
2. Add an **Email Service** (e.g. Gmail) and connect your account.
3. Create an **Email Template**. Use these variables so messages reach your inbox:
   - `{{from_name}}` – sender name  
   - `{{from_email}}` – sender email (reply-to)  
   - `{{from_phone}}` – sender phone  
   - `{{message}}` – message body  
4. In **Account → API Keys** copy your **Public Key**.
5. In `.env` set:
   - `VITE_EMAILJS_SERVICE_ID` = your service ID  
   - `VITE_EMAILJS_TEMPLATE_ID` = your template ID  
   - `VITE_EMAILJS_PUBLIC_KEY` = your public key  

Submissions from the contact form will be sent to your email via EmailJS.

### 8. Run Development Server
```bash
npm run dev
```

---

## 🌐 Deploy to Vercel

### Option A: Vercel CLI
```bash
npm install -g vercel
vercel
```

### Option B: GitHub + Vercel Dashboard
1. Push to GitHub
2. Import project at [vercel.com](https://vercel.com)
3. Add all environment variables from `.env`
4. Deploy!

### Connect Custom GoDaddy Domain
1. In Vercel dashboard → **Settings → Domains**
2. Add your domain: `yourgym.com`
3. Vercel gives you DNS records (A record + CNAME)
4. Go to **GoDaddy DNS Manager** → Update records
5. Wait 24-48h for propagation ✅

---

## 📁 Project Structure

```
src/
├── admin/
│   ├── AdminLogin.jsx       # Login page
│   ├── AdminLayout.jsx      # Sidebar layout
│   ├── AdminDashboard.jsx   # Stats & overview
│   └── MediaManager.jsx     # Upload/edit/delete media
├── components/
│   ├── Navbar.jsx
│   ├── Hero.jsx
│   ├── About.jsx
│   ├── Gallery.jsx          # Auto-loads from Firestore
│   ├── Videos.jsx           # Auto-loads from Firestore
│   ├── Contact.jsx
│   ├── Footer.jsx
│   └── ProtectedRoute.jsx
├── context/
│   └── AuthContext.jsx      # Firebase auth state
├── firebase/
│   └── config.js            # Firebase initialization
├── hooks/
│   └── useMedia.js          # Firestore + Storage CRUD
└── pages/
    └── Home.jsx
```

---

## ✨ Features

### Public Website
- **Hero** — animated particles, gradient background, stats bar
- **About** — animated counters, trainer cards, facility highlights
- **Gallery** — real-time Firebase images, lightbox, lazy loading
- **Videos** — real-time Firebase videos, modal player
- **Contact** — contact form, info cards, footer

### Admin Panel (`/admin/login`)
- Secure Firebase Authentication
- **Image Manager** — drag & drop upload, caption editing, delete
- **Video Manager** — drag & drop upload, caption editing, delete
- Real-time updates (changes instantly appear on public site)
- Progress bars during upload

### Tech Highlights
- Framer Motion animations throughout
- Mobile-first responsive design
- SEO meta tags
- Code splitting for fast loading
- Vercel SPA routing (`vercel.json`)

---

## 💰 Cost

| Service | Cost |
|---------|------|
| Vercel Hosting | Free |
| Firebase Auth | Free (50K/month) |
| Firestore | Free (1GB, 50K reads/day) |
| Firebase Storage | Free (5GB) |
| Domain (GoDaddy) | ~$12/year |

**Total: ~$12/year (domain only)**

---

## 🎨 Logo

Place your FIT N FEAT logo image at **`public/logo.png`**. The site uses this for the navbar, footer, and admin panel. If the file is missing, a fallback "FNF" badge is shown.
"# gym-website" 
"# gym-website" 
