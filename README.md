# Nova Fashion 👗

**Nova Fashion** is a full-stack e-commerce platform for selling clothing, built with a modern **React/TypeScript** frontend and a **Node.js/Express** REST API backend. It includes a complete customer-facing storefront and a fully featured **admin dashboard** for managing products, orders, categories, testimonials, users, and real-time notifications.

---

## Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Architecture Overview](#architecture-overview)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Backend Setup](#backend-setup)
  - [Frontend Setup](#frontend-setup)
  - [Environment Variables](#environment-variables)
- [API Overview](#api-overview)
- [Real-Time Notifications (Socket.IO)](#real-time-notifications-socketio)
- [Security](#security)
- [Admin Panel](#admin-panel)
- [Branding](#branding)
- [Available Scripts](#available-scripts)
- [License](#license)

---

## Features

### Storefront (Client Side)
- Browse the full clothing catalog (`Boutique` page) with category filters.
- Product detail pages with color/size variants and stock awareness.
- Shopping cart and checkout flow (`Cart`, `Order`).
- Favorites/wishlist system.
- Customer testimonials.
- Animated Hero section on the homepage with an auto-playing slider (3 slides: *Élégance*, *Confection*, *Qualité*), call-to-action buttons, and hover-to-pause behavior.
- Legal pages: Privacy Policy and Mentions Légales.
- Fully responsive UI built with Tailwind CSS and animated with Framer Motion.

### Admin Panel
- Secure authentication (JWT-based) restricted to admin users.
- **Dashboard** with key business metrics (KPIs).
- **Clothing management**: create, update, delete garments, manage image galleries via Cloudinary, and manage color/size variants and stock levels.
- **Category management**: create, update, delete categories (with image upload).
- **Order management**: search, filter (by date range, status), sort, and paginate orders; update order status (`EN_PREPARATION`, `EXPEDIEE`, `LIVREE`, `ANNULEE`); view computed KPIs (total orders, revenue, products sold, etc.); delete cancelled orders.
- **Testimonials management**.
- **Hero section management** (homepage slider content).
- **General settings**: shop name, shipping fees (Algiers vs. outside Algiers), contact info, social links.
- **User/profile management**: update admin profile info and password.
- **Real-time notifications** panel (new orders, cancelled/delivered orders, new categories, new clothing items) powered by Socket.IO, with read/unread filters, stats, and pagination.

---

## Tech Stack

### Frontend
| Category | Technology |
|---|---|
| Framework | React 19 (Vite 8) |
| Language | TypeScript / JavaScript (JSX) |
| Routing | React Router DOM v7 |
| Styling | Tailwind CSS v4 (`@tailwindcss/vite`) |
| Animations | Framer Motion |
| Icons | Lucide React |
| Charts | Recharts (used in the admin dashboard) |
| Real-time | Socket.IO Client |
| State Management | React Context API (multiple domain-specific providers) |
| Linting | ESLint 10 + typescript-eslint |

### Backend
| Category | Technology |
|---|---|
| Runtime | Node.js (ESM — `"type": "module"`) |
| Framework | Express 5 |
| Database | MongoDB with Mongoose 9 |
| Authentication | JWT (`jsonwebtoken`) + `bcrypt` for password hashing |
| File Uploads | Multer + Cloudinary (image storage/CDN) |
| Real-time | Socket.IO (JWT-authenticated, admin-only room) |
| Security | Helmet, CORS, `express-rate-limit` |
| Dev Tooling | Nodemon |

---

## Project Structure

```
nova-fashion/
├── backend/
│   ├── app.js                      # App entry point (Express + HTTP + Socket.IO)
│   ├── config/
│   │   └── env.js                  # Centralized environment variable access
│   ├── database/
│   │   ├── mongodb.js              # Mongoose connection logic
│   │   └── insertData.js           # Seed scripts (e.g. seedSettings)
│   ├── middlewares/
│   │   ├── auth.middleware.js      # JWT verification / route protection
│   │   ├── error.middleware.js     # Centralized error handler
│   │   └── rateLimiter.js          # Global & auth-specific rate limiters
│   ├── models/                     # Mongoose schemas (User, Clothing, Variant,
│   │                                  Category, Order, Settings, Notification, ...)
│   ├── controllers/                # Route handlers (business logic)
│   ├── routes/                     # Express routers per resource
│   ├── services/
│   │   ├── cloudinary.service.js   # Image upload/delete helpers
│   │   └── notifications.service.js# Admin notification creation/broadcast
│   └── socket/
│       ├── socket.js                # Socket.IO server initialization
│       └── socketAuth.js            # JWT middleware for socket handshakes
│
└── frontend/
    ├── src/
    │   ├── App.jsx                  # Route declarations & provider tree
    │   ├── Pages/                   # Public-facing pages (Home, Boutique, Cart...)
    │   ├── AdminPages/               # Admin dashboard pages
    │   ├── Layouts/                  # PublicLayout, AdminLayout, route guards
    │   ├── Contexts/                 # Public-side React contexts
    │   ├── AdminContexts/             # Admin-side React contexts
    │   └── ScrollToTop.jsx
    └── vite.config.js
```

---

## Architecture Overview

- **Monorepo-style split**: the `backend` and `frontend` are independent Node projects, each with their own `package.json`, deployed separately (the CORS configuration in `app.js` and `socket.js` explicitly whitelists a local dev origin and a deployed Vercel frontend URL).
- **Layered backend**: routes → controllers → models/services, with a single centralized `errorMiddleware` that normalizes Mongoose errors (`CastError`, duplicate keys, `ValidationError`) and Multer upload errors into consistent JSON responses.
- **Context-driven frontend**: the app wraps its routes in a deep tree of React Context providers (one per domain: clothing, categories, favorites, cart, orders, auth, admin clothing, admin orders, notifications, hero, settings, dashboard, etc.), keeping data-fetching logic decoupled from individual pages.
- **Route protection**: `PublicRoute`/`PublicLayout` wrap customer-facing routes, while `AdminRoute`/`AdminLayout` guard the `/admin/*` routes and require a valid authenticated admin session.
- **Real-time layer**: a single Socket.IO server authenticates incoming connections via JWT and only allows verified users to join the `admins` room, ensuring only admins receive live notification events.

---

## Getting Started

### Prerequisites
- Node.js **v18+** (backend) / **v20.19+ or v22.12+** (frontend, per Vite 8 requirements)
- npm
- A MongoDB instance (local or Atlas)
- A Cloudinary account (for image uploads)

### Backend Setup

```bash
cd backend
npm install
```

Create the appropriate environment file (see [Environment Variables](#environment-variables)), then run:

```bash
npm run dev     # development, with nodemon auto-reload
# or
npm start       # production
```

The server exposes a health check endpoint at:

```
GET /health → { "status": "ok" }
```

> **Note:** `app.js` includes a commented-out call to `seedSettings()`, a seed script (`database/insertData.js`) that populates default shop settings (name, shipping prices, contact info, social links). Uncomment it once (or run it separately) to seed your database, then comment it back out.

### Frontend Setup

```bash
cd frontend
npm install
npm run dev       # starts the Vite dev server (default: http://localhost:5173)
```

Other available commands:

```bash
npm run build      # production build
npm run preview    # preview the production build locally
npm run lint        # run ESLint
```

### Environment Variables

The backend reads its configuration from `config/env.js`, which expects an environment file per `NODE_ENV` (e.g. `.env.development.local`, `.env.production.local`). Typical variables required by the codebase:

```env
PORT=5000
NODE_ENV=development

# Database
DB_URI=mongodb+srv://<user>:<password>@cluster.mongodb.net/nova-fashion

# Auth
JWT_SECRET=your_jwt_secret
JWT_EXPIRES_IN=7d

# Cloudinary (used by services/cloudinary.service.js)
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

> ⚠️ Adjust the exact variable names to match `config/env.js` and `cloudinary.service.js` in your codebase if they differ.

The frontend connects to the backend's Socket.IO server using a JWT token passed via `socket.handshake.auth.token`; make sure the frontend's API base URL and socket URL point to your running backend instance (typically configured via a `.env` file consumed by Vite, e.g. `VITE_API_URL`).

---

## API Overview

All backend routes are namespaced under `/api/v1` and protected by a **global rate limiter** (300 requests / 15 min per IP). Authentication endpoints have a stricter limiter (10 attempts / 15 min, skipping successful requests) to mitigate brute-force attacks.

| Base Path | Purpose |
|---|---|
| `/api/v1/auth` | Sign in / sign out (JWT issuance) |
| `/api/v1/user` | Admin profile: fetch, update info, update password |
| `/api/v1/clothing` | CRUD for clothing items (with variants, images) |
| `/api/v1/categories` | CRUD for categories (with image upload) |
| `/api/v1/variants` | Manage color/size/stock variants of a clothing item |
| `/api/v1/favorites` | Fetch clothing items by a list of favorite IDs |
| `/api/v1/orders` | List (with pagination/filtering/KPIs), update status, delete cancelled orders |
| `/api/v1/testimonials` | CRUD for customer testimonials |
| `/api/v1/settings` | Shop settings: shipping prices, contact, social links |
| `/api/v1/notifications` | List, paginate, mark as read (single/all), stats |
| `/api/v1/hero` | Manage homepage hero slider content |
| `/api/v1/dashboard` | Aggregated admin dashboard statistics |

### Example — Orders Endpoint

`GET /api/v1/orders` supports:
- **Pagination**: `page`, `limit`
- **Search**: matches first name, last name, phone, wilaya, or item name (case-insensitive)
- **Status filter**: `EN_PREPARATION`, `EXPEDIEE`, `LIVREE`, `ANNULEE`
- **Date filters** (`tri`): `today`, `yesterday`, `last_7_days`, `last_30_days`, `this_month`, `last_month`, `custom` (with `startDate` / `endDate`)
- **Sorting**: `newest` (default) or `oldest`
- Returns paginated data **plus** aggregated KPIs (total orders, per-status counts, revenue excluding cancelled orders, total products sold) computed independently of the search/status filters (date-filter only), so dashboard stats stay stable while browsing/filtering the list.

Every response follows a consistent JSON envelope:

```json
{
  "success": true,
  "message": "Optional message",
  "data": { /* ... */ }
}
```

Errors are normalized by `errorMiddleware` into:

```json
{
  "success": false,
  "error": "Human-readable error message"
}
```

---

## Real-Time Notifications (Socket.IO)

- The Socket.IO server (`socket/socket.js`) is initialized alongside the HTTP server and shares the same CORS whitelist as the Express app.
- Every socket connection passes through `socketAuth.js`, which verifies a JWT sent in `socket.handshake.auth.token` and attaches the corresponding `User` document to the socket.
- Authenticated users are placed into an `admins` room; unauthenticated sockets are immediately disconnected.
- The backend's `notifications.service.js` creates notification records and emits events (`NEW_ORDER`, `ORDER_CANCELLED`, `ORDER_DELIVERED`, `NEW_CATEGORY`, `NEW_CLOTHING`) to the `admins` room whenever the corresponding action happens (e.g. a category or clothing item is created, or an order transitions to `LIVREE`/`ANNULEE`).
- On the frontend, `NotificationsContext` (used by the admin `Notifications` page) listens for these events and keeps the notification list, unread counts, and stats in sync in real time — mirroring the structure previously built for a related real-estate agency admin project.

---

## Security

- **Helmet** sets secure HTTP headers by default.
- **CORS** is locked to an explicit allow-list of origins (local dev + the deployed frontend URL) with `credentials: true`.
- **`trust proxy`** is enabled (`app.set("trust proxy", 1)`) for correct client IP detection behind a reverse proxy/load balancer (important for rate limiting).
- **Rate limiting**:
  - `globalLimiter`: 300 requests / 15 minutes across all `/api/v1` routes.
  - `authLimiter`: 10 attempts / 15 minutes on authentication routes, skipping successful requests, to slow down brute-force login attempts.
- **Passwords** are hashed with `bcrypt` before storage; updating a password requires verifying the old password and enforces a strong-password regex (min 8 characters, upper+lowercase, digit, symbol).
- **JWT authentication** protects both REST endpoints (`auth.middleware.js`) and Socket.IO connections (`socketAuth.js`).
- **Centralized error handling** avoids leaking raw stack traces and normalizes Mongoose/Multer errors into safe, user-friendly messages.

---

## Admin Panel

The admin panel lives under the `/admin/*` route prefix and is guarded by `AdminRoute` + `AdminLayout`. Key pages include:

- `dashboard` — overview KPIs and charts (Recharts)
- `clothes` / `cloth/:id` / `addCloth` — catalog management
- `orders` — order management and fulfillment workflow
- `categories` — category management
- `testimonials` — testimonial moderation
- `general` — shop-wide settings (shipping fees, contact, socials)
- `profile` — admin account settings
- `notifications` — real-time notification center
- `hero` — homepage hero slider content editor

Each admin page is backed by a dedicated context provider (e.g. `AdminClothingContext`, `OrdersAdminContext`, `OrdersActionsAdminContext`, `AdminCategoriesContext`, `AdminTestimonialsContext`, `AdminSettingsContext`, `AdminUsersContext`, `NotificationsContext`, `HeroContext`, `AdminDashboardContext`), all composed together in `App.jsx`.

---

## Branding

The visual identity uses a warm, minimalist palette suited to a fashion e-commerce brand:

| Role | Color |
|---|---|
| Background | `#F7F4EE` |
| Primary text | `#171717` |
| Accent | `#B89B72` |

Imagery follows a beige / black / cream / brown tonal palette to match this palette across the storefront and hero section.

---

## Available Scripts

### Backend (`backend/package.json`)
| Script | Description |
|---|---|
| `npm run dev` | Start the server with Nodemon (auto-restart on changes) |
| `npm start` | Start the server in production mode |

### Frontend (`frontend/package.json`)
| Script | Description |
|---|---|
| `npm run dev` | Start the Vite development server |
| `npm run build` | Build the app for production |
| `npm run preview` | Preview the production build locally |
| `npm run lint` | Run ESLint across the codebase |

---

## License

This project is currently unlicensed / proprietary. Add a license of your choice (MIT, Apache 2.0, etc.) here if you plan to open-source it.

---

*Built with ❤️ for Nova Fashion.*