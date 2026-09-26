# NB Classic Scents

A full-stack, production-quality e-commerce website for **NB Classic Scents** — a cinematic, luxury fragrance house. Built with React + TypeScript + Vite + Tailwind CSS + Framer Motion on the frontend, and Node.js + Express + MongoDB (Mongoose) on the backend.

> This repository was empty when this build started (no prior commits, no product photography). Since no product photography existed and external image hosts are blocked by this environment's network policy, all product/hero imagery was generated as original, hand-authored SVG artwork in the brand's midnight-navy / champagne-gold / rose-champagne palette (see **Product & Hero Imagery** below). Everything else — auth, cart, wishlist, checkout, orders, reviews, scent-finder quiz, admin panel — is fully wired to a real MongoDB database, not mocked.

## 1. Design System

- **Palette**: Midnight Navy `#07111F`, Deep Navy `#0D1B2E`, Ivory `#F8F4EC`, Warm Cream `#F2E8DA`, Champagne `#D6B77C`, Soft Gold `#C9A96E`, Rose Champagne `#D8B09A`, Warm Beige `#E4D5C3`, Cocoa `#3A2C25`, Espresso `#2A211D`. The cinematic dark navy treatment is reserved for the hero, campaign sections, and the product gallery backdrop; everything else sits on ivory/cream with champagne-gold used only as a restrained accent (borders, buttons, dividers).
- **Typography**: Playfair Display (serif display headings) + Inter (UI/body text), with an italic serif accent for campaign taglines.
- **Motion**: Framer Motion + native CSS 3D transforms — no Three.js/WebGL, so it stays fast and lightweight. Mouse-parallax on the hero bottle, scroll-reveal sections, a slow choreographed hero load-in, and a brief branded loading screen (`NB` → `CLASSIC SCENTS`) on first load.
- **Hero**: a 4-slide cinematic carousel (Eclipse / Signature / Midnight / Essence collections), each with its own bottle illustration, metallic liquid-splash silhouette, floating glow particles, and rim lighting — auto-advancing with elegant pagination dots, pausable on hover, fully responsive down to mobile.

## 2. Project Structure

```
NB-fragrance-/
├── client/                      # React + TypeScript + Vite + Tailwind frontend
│   ├── public/images/           # Hand-authored SVG hero bottles, liquid splashes, campaign art, logo
│   └── src/
│       ├── components/          # Navbar, Footer, Hero, ProductCard, CartDrawer, NotesDiagram, etc.
│       ├── context/              # AuthContext, CartContext, WishlistContext
│       ├── layouts/              # MainLayout (storefront), AdminLayout (dashboard)
│       ├── pages/                 # Home, Shop, ProductDetails, ScentFinder, Checkout, ...
│       │   └── admin/            # AdminDashboard, AdminProducts, AdminOrders, ...
│       ├── services/             # axios API clients (auth, products, orders, users, uploads, admin)
│       ├── types/                # Shared TypeScript interfaces matching the backend contract
│       └── utils/                # formatCurrency, formatDate, usePageMeta
│
├── server/                      # Node.js + Express + MongoDB backend
│   ├── config/db.js              # Mongoose connection
│   ├── models/                   # User, Product, Order (Mongoose schemas)
│   ├── controllers/              # Business logic per resource
│   ├── routes/                   # Express routers
│   ├── middleware/                # JWT auth, admin guard, multer upload, error handler
│   ├── seed/                     # svgGenerator.js + seedProducts.js — seeds 20 fragrances + admin
│   └── uploads/products/         # Generated SVG product images + admin-uploaded images
│
└── README.md
```

## 3. What Was Built

**Backend (`server/`)**
- `models/User.js` — name, email, hashed password (bcrypt), role (`customer`/`admin`), phone, address, wishlist, password-reset token.
- `models/Product.js` — name, slug, description, price, images, gender, `collectionName` (Eclipse/Signature/Midnight/Essence), `category` (Men/Women/Unisex/Premium/Gift Sets), fragrance family, top/heart/base notes, longevity, sillage, occasion, season, size, stock, featured/bestseller/newArrival flags, embedded reviews with recomputed rating, text search index.
- `models/Order.js` — order items, customer info, shipping address, notes, payment method, status (`Pending → Confirmed → Processing → Shipped → Delivered`, or `Cancelled`), computed totals. Guest checkout supported.
- `middleware/authMiddleware.js` — `protect` (JWT), `admin` (role guard), `optionalAuth` (attaches a user if present, never blocks — used for guest checkout and guest order lookup).
- `middleware/uploadMiddleware.js` / `errorMiddleware.js` — Multer image upload validation; centralized error handling (validation, cast, duplicate-key, JWT, Multer errors).
- Full REST API for auth, products (search/filter/sort/pagination, the "Find Your Signature Scent" discovery endpoint, reviews, related fragrances), orders (server-side price/stock re-validation — the client is never trusted), users (profile, wishlist), uploads, and admin dashboard stats.
- `seed/seedProducts.js` — generates 20 real products across all 4 collections, all genders, and all 8 fragrance families, each with real note pyramids and 2-4 seeded reviews, plus 26 original SVG bottle illustrations, and upserts the first admin account from `.env`.

**Frontend (`client/`)**
- Luxury design system in `tailwind.config.js`; `AuthContext`, `CartContext`, `WishlistContext` (JWT + localStorage, syncing to the backend once logged in, with guest-wishlist merge-on-login).
- Storefront: `Home` (cinematic hero, featured/bestseller/new-arrival rails, shop-by-collection, notes diagram, brand story, testimonials, newsletter), `Shop` (debounced search, gender/fragrance-family/price/highlight filters, sort, pagination — all reflected in the URL), `ProductDetails` (gallery + zoom, top/heart/base notes visual, reviews, related fragrances, Buy Now), `ScentFinder` (interactive quiz → discovery API), `Cart`/`CartDrawer`, `Checkout` (validated Cash-on-Delivery form with the fixed Rs. 200 delivery charge), `OrderConfirmation` (real order + success animation), `Login`/`Signup`/`ForgotPassword`/`ResetPassword`, `Profile` (edit + order history), `Wishlist`, `About`, `Contact`.
- Admin (`/admin`, protected + role-gated, code-split so storefront customers never download it): `AdminDashboard` (stats + hand-rolled SVG sales chart), `AdminProducts` (search/filter/delete), `AdminProductForm` (full create/edit incl. image upload + note tag-inputs), `AdminOrders` (filter/search), `AdminOrderDetails` (live status updates).

## 4. How the Frontend Works

- **Vite + React + TypeScript**, routed with `react-router-dom` (`src/App.tsx`). `MainLayout` wraps storefront pages with `Navbar`/`Footer`/`CartDrawer`/toast host; `AdminLayout` wraps the admin panel and is gated by `ProtectedRoute adminOnly`.
- **Dev proxy**: `vite.config.ts` proxies `/api` and `/uploads` to the backend (`http://localhost:5000`), so the frontend never hardcodes a backend URL.
- API calls go through `src/services/*.ts`, which use a shared axios instance (`src/services/api.ts`) that attaches the JWT automatically and clears auth on a 401.

## 5. How the Backend Works

- **Express** app in `server/server.js`: CORS locked to `CLIENT_URL`, JSON body parsing, dev-only request logging, static `/uploads`, `/api/health`, centralized error handling. The server connects to MongoDB **before** it starts accepting requests, and exits with a clear message if the database is unreachable.
- **Auth**: `POST /api/auth/register` / `/login` issue JWTs; passwords are bcrypt-hashed and never returned in any response. `PUT /api/auth/forgot-password` returns the reset token/URL directly in the response body (there is no email service wired up, so this keeps the flow testable end-to-end — clearly labeled "development mode" in the UI).
- **Products**: `GET /api/products` supports `search`, `gender`, `fragranceFamily`, `category`, `collectionName`, `minPrice`/`maxPrice`, `featured`/`bestseller`/`newArrival`, `sort`, and pagination.
- **Orders**: `POST /api/orders` works for guests and logged-in customers, re-validates every item's price and stock against MongoDB, decrements stock, and always adds a flat **Rs. 200 delivery charge** — delivery is never free and never conditional on subtotal, quantity, location, customer, or promotions; the charge is a fixed server-side constant (`DELIVERY_CHARGE` in `orderController.js`) that the client cannot override. `GET /api/orders/:id` is viewable by its owner, an admin, **or** anyone with the link if it was a guest order (so the order-confirmation page works immediately after a guest checkout) — a logged-in customer's order still requires that customer or an admin.
- **Admin stats**: `GET /api/admin/stats` aggregates total orders/sales/products, low-stock products, pending orders, recent orders, a 14-day sales trend, and an order-status breakdown.

## 6. How MongoDB Is Connected

1. Copy `server/.env.example` to `server/.env` and set `MONGO_URI` to either a local MongoDB instance (`mongodb://127.0.0.1:27017/nb-classic-scents`) or a free [MongoDB Atlas](https://www.mongodb.com/atlas) cluster connection string.
2. `server/config/db.js` connects via Mongoose when the server starts and exits with a clear error if `MONGO_URI` is missing or unreachable.
3. All models live in `server/models/` and are used exclusively by the backend — the frontend never talks to MongoDB directly, only through the REST API.

> Note: this sandboxed build environment has no local `mongod` and no network access to download one (MongoDB's own download hosts are blocked by the environment's egress policy), so the database layer couldn't be exercised end-to-end here. The Express server itself was verified to boot correctly, connect-fail gracefully against an unreachable URI, and serve static assets/health checks; the React frontend was verified with a production build and a Playwright smoke test (desktop + mobile viewports, all storefront routes, no console errors) against a live Vite dev server. Connect a real MongoDB instance as described above to exercise the full app.

## 7. Running the Project

**Backend**
```bash
cd server
cp .env.example .env      # then edit MONGO_URI, JWT_SECRET, ADMIN_EMAIL/PASSWORD
npm install
npm run seed               # seeds 20 fragrances + creates the first admin account
npm run dev                 # starts the API on http://localhost:5000
```

**Frontend** (in a separate terminal)
```bash
cd client
npm install
npm run dev                 # starts the app on http://localhost:5173
```

Open `http://localhost:5173` — the Vite dev server proxies `/api` and `/uploads` to the backend automatically.

**Production build**
```bash
cd client && npm run build   # outputs static files to client/dist
cd server && npm start       # serve the API (front it with your own static host/CDN or reverse proxy for client/dist)
```

## 8. Creating/Logging In as Admin

Running `npm run seed` in `server/` creates an admin account from `ADMIN_NAME`, `ADMIN_EMAIL`, and `ADMIN_PASSWORD` in your `.env` (defaults: `admin@nbclassicscents.com` / `ChangeMe123!` — **change these before deploying**). Sign in at `/login`, then visit `/admin` — access is gated by `ProtectedRoute adminOnly`, which checks `user.role === 'admin'`.

## 9. Product & Hero Imagery

No product photography existed in this repository, and this build environment's network policy blocks all external image hosts — so every image in the project is original, hand-authored SVG artwork:

- `server/uploads/products/p1.svg` … `p20.svg` (plus gallery variants for featured products) — perfume bottle illustrations generated by `server/seed/svgGenerator.js`, varying silhouette and liquid color by fragrance family, all in the brand's midnight-navy/champagne-gold/rose-champagne palette.
- `client/public/images/hero-bottle-*.svg`, `liquid-splash-*.svg`, `about-campaign.svg`, `brand-story.svg`, `social-*.svg`, `logo-mark.svg` — the cinematic hero, About-page, and social-showcase artwork.

To swap in real photography later: drop your own images into `server/uploads/products/` (or upload them through the admin panel), then either re-run `npm run seed` with updated filenames, or update each product's images via **Admin → Products → Edit**.
