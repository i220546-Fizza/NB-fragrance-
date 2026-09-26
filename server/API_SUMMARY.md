# NB CLASSIC SCENTS — Backend API Summary

Backend lives entirely in `server/`. Node.js + Express + Mongoose (MongoDB). No mocked data —
every endpoint below reads/writes real MongoDB documents.

## Setup

```bash
cd server
npm install
cp .env.example .env   # then edit MONGO_URI / JWT_SECRET / etc.
npm run seed            # wipes Products, inserts 20 products + generates SVG images, upserts admin user
npm run dev              # nodemon server.js
# or
npm start                # node server.js
```

## Files created

```
server/
├── package.json
├── .env.example
├── .gitignore
├── server.js
├── config/db.js
├── models/User.js
├── models/Product.js
├── models/Order.js
├── middleware/authMiddleware.js      (protect, admin, optionalAuth)
├── middleware/uploadMiddleware.js
├── middleware/errorMiddleware.js     (notFound, errorHandler)
├── controllers/authController.js
├── controllers/productController.js
├── controllers/orderController.js
├── controllers/userController.js
├── controllers/uploadController.js
├── controllers/adminController.js
├── routes/authRoutes.js
├── routes/productRoutes.js
├── routes/orderRoutes.js
├── routes/userRoutes.js
├── routes/uploadRoutes.js
├── routes/adminRoutes.js
├── utils/generateToken.js
├── seed/svgGenerator.js              (programmatic bottle-illustration SVG builder)
├── seed/seedProducts.js
└── uploads/products/                 (26 generated SVGs: p1.svg … p20.svg + galleries
                                        p1-b/-c, p11-b, p17-b, p20-b/-c for the 4 featured products)
```

## Routes

All JSON. Base URL: `/api`.

### Health
| Method | Path | Auth |
|---|---|---|
| GET | `/api/health` | Public |

### Auth — `/api/auth`
| Method | Path | Auth | Notes |
|---|---|---|---|
| POST | `/register` | Public | `{name,email,password}` → `{user, token}` |
| POST | `/login` | Public | `{email,password}` → `{user, token}` |
| GET | `/me` | Private | current user |
| PUT | `/forgot-password` | Public | `{email}` → returns `resetToken` + `resetUrl` directly in the response body (no email service configured; in production this would be emailed instead) |
| PUT | `/reset-password/:token` | Public | `{password}` → new JWT |

### Products — `/api/products`
| Method | Path | Auth | Notes |
|---|---|---|---|
| GET | `/` | Public | filters: `search, gender, fragranceFamily (CSV), category, minPrice, maxPrice, featured, bestseller, newArrival, sort (newest\|price-asc\|price-desc\|featured\|rating), page, limit`. Returns `{products, page, pages, total}` |
| GET | `/discovery` | Public | `?families=Woody,Oud` — "Find Your Signature Scent" quiz result |
| GET | `/:idOrSlug` | Public | looks up by ObjectId or slug |
| POST | `/` | Private/Admin | create product |
| PUT | `/:id` | Private/Admin | update product |
| DELETE | `/:id` | Private/Admin | delete product |
| POST | `/:id/reviews` | Private | add review (1 per user), recomputes `rating`/`numReviews` |
| GET | `/:id/related` | Public | same `fragranceFamily` or `category`, limit 4 |

### Orders — `/api/orders`
| Method | Path | Auth | Notes |
|---|---|---|---|
| POST | `/` | Public (optional auth) | guest or logged-in checkout. Server re-validates price/stock from DB, computes `itemsPrice`, a flat `deliveryCharge` (always Rs. 200 — never free, never conditional), `totalPrice`, decrements stock |
| GET | `/my-orders` | Private | orders for `req.user` |
| GET | `/:id` | Private | owner or admin only |
| GET | `/` | Private/Admin | all orders; filters `status`, `search` |
| PUT | `/:id/status` | Private/Admin | update order status |

### Users — `/api/users`
| Method | Path | Auth |
|---|---|---|
| GET | `/profile` | Private |
| PUT | `/profile` | Private |
| GET | `/wishlist` | Private |
| POST | `/wishlist/:productId` | Private |
| DELETE | `/wishlist/:productId` | Private |

### Uploads — `/api/uploads`
| Method | Path | Auth | Notes |
|---|---|---|---|
| POST | `/` | Private/Admin | multipart `images` field, up to 6 files, 5MB each, jpg/png/webp/svg → `{paths:[...]}` |

### Admin — `/api/admin`
| Method | Path | Auth | Notes |
|---|---|---|---|
| GET | `/stats` | Private/Admin | `{totalOrders, totalSales, totalProducts, lowStockCount, pendingOrders, recentOrders, salesTrend (14 days), statusBreakdown}` |

## Data model highlights

- **User**: bcrypt-hashed password (`select:false`), `role` (customer/admin), wishlist, password-reset token flow.
- **Product**: auto-slug (unique, collision-safe), `gender`, `collectionName` (Eclipse/Signature/Midnight/Essence),
  `category`, `fragranceFamily` (8 families), note pyramid (top/heart/base), `longevity`, `sillage`, `occasion`,
  `season`, embedded `reviews[]` with recomputed `rating`/`numReviews`, text index on name+description+fragranceFamily.
- **Order**: guest-friendly (`user` optional), embedded `orderItems`, `customerInfo`, `shippingAddress`, computed
  pricing fields, `status` enum lifecycle.

## Seed data

`npm run seed` generates 20 original hand-authored (programmatically templated) SVG perfume-bottle
illustrations — 4 bottle silhouettes (tall-rectangular, rounded-flacon, faceted, tapered) × 8
fragrance-family liquid colors, on a cohesive midnight-navy / champagne-gold / rose-champagne /
ivory / cocoa palette — and inserts 20 products (5 per collection, all genders, all 8 fragrance
families, realistic PKR pricing 4500–18500, 3 products with stock < 5 for the low-stock admin
stat, 4 featured / 4 bestseller / 4 new-arrival, 2–4 seeded reviews each with recomputed
rating/numReviews). It also upserts the admin account from `ADMIN_NAME`/`ADMIN_EMAIL`/`ADMIN_PASSWORD`.

## Verification performed in this sandbox (no reachable MongoDB available here)

- `npm install` in `server/` completed cleanly (156 packages, 0 vulnerabilities).
- `node --check` passed on every `.js` file in the project.
- `node server.js` with an unreachable `MONGO_URI` prints a clear connection-failure message and
  exits with code 1 **before** binding the HTTP port (no hung process, nothing left running).
- The 20-product seed dataset was validated offline (schema enums, price/stock ranges, family/
  gender/collection distribution, featured/bestseller/new-arrival counts, low-stock count) — all
  match spec exactly.
- The SVG generator was exercised for all 4 silhouettes and all 20 products; output is well-formed
  XML (tag-balance checked) and the 26 expected files were written to `uploads/products/`.
