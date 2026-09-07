# Abhinav A M — Creative Portfolio

> A full-stack, CMS-powered developer portfolio built with React, Express, MongoDB, and Cloudinary. Features a custom GSAP animation engine, 3D WebGL shards, horizontal scroll, depth carousel, and a self-hosted admin dashboard.

---

## ✨ Features

- **Premium UI** — Dark editorial design (`#080808` + `#c8ff00` accent), glassmorphism navbar, smooth Lenis scrolling
- **GSAP Animations** — Blur entrance transition, horizontal scroll project showcase, staggered reveals, scroll-triggered effects
- **3D WebGL Shards** — Three.js hero scene with interactive AeroShards
- **CMS Admin Dashboard** — Full CRUD at `/admin` for projects, skills, experience, services, about & social links
- **Cloudinary Image Upload** — Drag-and-drop image management per project
- **DepthCarousel** — 3D depth-stacked card carousel on mobile project view
- **Custom Cursor** — Spotlight glow cursor (desktop only)
- **WhatsApp Float Button** — One-tap contact via WhatsApp
- **Fully Responsive** — Dedicated mobile layouts for every section
- **MongoDB + Express API** — RESTful backend with JWT-style admin auth and rate limiting

---

## 🗂 Project Structure

```
portfolio/
├── src/                        # React frontend (Vite)
│   ├── components/             # UI components
│   │   ├── Navbar.jsx
│   │   ├── Hero.jsx
│   │   ├── About.jsx
│   │   ├── Projects.jsx        # Horizontal scroll (desktop) + DepthCarousel (mobile)
│   │   ├── Skills.jsx
│   │   ├── Experience.jsx      # Alternating timeline
│   │   ├── Services.jsx        # What I Offer section
│   │   ├── Contact.jsx
│   │   ├── Footer.jsx
│   │   ├── Loader.jsx          # Animated page loader
│   │   ├── CustomCursor.jsx    # Spotlight glow cursor
│   │   ├── BlurText.jsx        # Blur entrance animation
│   │   ├── DepthCarousel.jsx   # Mobile 3D carousel (React Bits)
│   │   ├── WhatsAppButton.jsx  # Floating WhatsApp CTA
│   │   └── 3d/                 # Three.js scene components
│   ├── pages/
│   │   ├── Home.jsx
│   │   ├── ProjectDetail.jsx
│   │   └── Admin.jsx           # CMS dashboard
│   ├── data/                   # Static fallback data
│   ├── lib/
│   │   └── api.js              # Centralized API client
│   └── App.jsx
│
├── backend/                    # Express API
│   ├── models/                 # Mongoose schemas
│   │   ├── Project.js
│   │   ├── SkillCategory.js
│   │   ├── Experience.js
│   │   ├── About.js
│   │   └── SocialLink.js
│   ├── routes/                 # REST endpoints
│   │   ├── projects.js
│   │   ├── skills.js
│   │   ├── journey.js          # Experience + Services
│   │   ├── about.js
│   │   ├── socialLinks.js
│   │   └── upload.js           # Cloudinary upload
│   ├── middleware/
│   │   └── auth.js             # Admin token verification
│   ├── scripts/
│   │   └── seed.js             # DB seeder
│   ├── server.js               # Express app (works locally + as Vercel function)
│   └── .env.example
│
├── public/
│   └── favicon.svg
├── vercel.json                 # Vercel deployment config
└── vite.config.js
```

---

## 🚀 Getting Started

### Prerequisites

- Node.js ≥ 18
- MongoDB Atlas account
- Cloudinary account

### 1. Clone & install

```bash
git clone https://github.com/YOUR_USERNAME/portfolio.git
cd portfolio

# Frontend dependencies
npm install

# Backend dependencies
cd backend && npm install && cd ..
```

### 2. Configure environment variables

```bash
# Backend
cp backend/.env.example backend/.env
```

Edit `backend/.env`:

```env
MONGODB_URI=mongodb://user:pass@host1:27017,host2:27017,host3:27017/portfolio?replicaSet=...&authSource=admin
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
ADMIN_PASSWORD=your_secure_password
PORT=4000
CLIENT_ORIGIN=http://localhost:5173
```

> ⚠️ **MongoDB Note**: On Windows/Node, `mongodb+srv://` SRV resolution can fail. Use a direct connection string with shard hosts (`cluster0-shard-00-0X.xxxxx.mongodb.net:27017`) and `?replicaSet=atlas-XXXXX`.

### 3. Seed the database

```bash
cd backend/scripts
node seed
```

### 4. Run locally

```bash
# Terminal 1 — Backend API
cd backend && node server.js

# Terminal 2 — Frontend dev server
npm run dev
```

Open **http://localhost:5173** — Admin panel at **/admin**.

---

## 🔑 Admin Panel

Navigate to `/admin` and enter the `ADMIN_PASSWORD` from your `.env`.

The dashboard lets you manage:

| Section | Operations |
|---|---|
| **Projects** | Create, Edit, Delete, Upload images via Cloudinary |
| **Skills** | Add/remove skill categories and individual skills |
| **Experience** | Timeline entries with type (milestone, current, etc.) |
| **Services** | What I Offer items with tags |
| **About** | Bio text, stats, availability status |
| **Social Links** | GitHub, LinkedIn, Twitter, Dribbble, etc. |

---

## 🌐 Deployment (Vercel)

Both frontend and backend are deployed to a **single Vercel project**. The `vercel.json` routes all `/api/*` requests to the Express serverless function.

### Steps

1. **Push to GitHub**
   ```bash
   git add . && git commit -m "deploy" && git push
   ```

2. **Import on Vercel** — [vercel.com/new](https://vercel.com/new), pick your repo, framework = **Vite**

3. **Add Environment Variables** in Vercel project → Settings → Environment Variables:

   | Key | Value |
   |-----|-------|
   | `MONGODB_URI` | Your direct MongoDB connection string |
   | `CLOUDINARY_CLOUD_NAME` | From Cloudinary dashboard |
   | `CLOUDINARY_API_KEY` | From Cloudinary dashboard |
   | `CLOUDINARY_API_SECRET` | From Cloudinary dashboard |
   | `ADMIN_PASSWORD` | Your chosen admin password |
   | `CLIENT_ORIGIN` | `https://your-app.vercel.app` |

4. **MongoDB Atlas** → Network Access → Allow `0.0.0.0/0` (required for serverless)

5. **Deploy** — Vercel builds `dist/` and exposes `backend/server.js` as a function

---

## 🛠 Tech Stack

| Layer | Technology |
|---|---|
| **Frontend** | React 18, Vite, React Router |
| **Animations** | GSAP 3, ScrollTrigger, Lenis |
| **3D** | Three.js |
| **Styling** | Vanilla CSS, inline styles |
| **Backend** | Node.js, Express |
| **Database** | MongoDB Atlas + Mongoose |
| **Media** | Cloudinary |
| **Deployment** | Vercel (monorepo — frontend + serverless API) |

---

## 📡 API Reference

All endpoints are prefixed with `/api`.

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/projects` | — | List all projects |
| GET | `/projects/:slug` | — | Single project |
| POST | `/projects` | ✅ | Create project |
| PUT | `/projects/:id` | ✅ | Update project |
| DELETE | `/projects/:id` | ✅ | Delete project |
| GET | `/skills` | — | All skill categories |
| GET | `/journey/experience` | — | Experience entries |
| GET | `/journey/services` | — | Services list |
| GET | `/about` | — | About content |
| GET | `/social-links` | — | Social links |
| POST | `/upload` | ✅ | Upload image to Cloudinary |
| DELETE | `/upload/:publicId` | ✅ | Delete image from Cloudinary |
| GET | `/health` | — | Server health check |

**Admin auth**: `Authorization: Bearer <ADMIN_PASSWORD>` header.

---

## 📝 License

MIT — feel free to use this as a template for your own portfolio.

---

<div align="center">
  Made with ⚡ by <strong>Abhinav A M</strong>
</div>
