# NB Classic Scents — Frontend Summary

React 18 + TypeScript + Vite 6 + Tailwind CSS 3 + Framer Motion. Builds cleanly with
`npm install && npm run build` (verified — see report). All API calls go through the
relative `/api` path (proxied to `http://localhost:5000` in dev via `vite.config.ts`);
no production URL is hardcoded anywhere.

## File tree

```
client/
├── index.html, vite.config.ts, tailwind.config.js, postcss.config.js, tsconfig*.json
├── public/images/            # 15 hand-authored SVGs (bottles, splashes, logo, social, etc.)
├── src/
│   ├── main.tsx, App.tsx, index.css
│   ├── context/        AuthContext, CartContext, WishlistContext
│   ├── services/        api, authService, productService, orderService, userService,
│   │                     uploadService, adminService
│   ├── types/index.ts    Product/User/Order/Review/OrderItem/AdminStats, matching the
│   │                     backend contract field-for-field
│   ├── utils/            formatCurrency, formatDate (+ estimatedDeliveryRange), usePageMeta
│   ├── layouts/          MainLayout, AdminLayout
│   ├── components/       Navbar, Footer, Hero, LoadingScreen, ProductCard, ProductGrid,
│   │                     CartDrawer, QuickViewModal, QuantitySelector, StarRating, Reveal,
│   │                     NotesDiagram, ScentFamilyPicker, ToastHost, LoadingSpinner,
│   │                     EmptyState, ErrorNotice, ProtectedRoute, StatCard,
│   │                     SalesTrendChart, OrderTable, OrderSummaryDetail, FilterSidebar,
│   │                     TagInput, Testimonials, Newsletter, SocialShowcase,
│   │                     FeaturedCollection, WhyNBSection, BrandStory, CollectionGrid
│   └── pages/            Home, Shop, Collection, ProductDetails, ScentFinder, Cart,
│                          Checkout, OrderConfirmation, Login, Signup, ForgotPassword,
│                          ResetPassword, Profile, Wishlist, About, Contact, NotFound
│       └── admin/        AdminDashboard, AdminProducts, AdminProductForm, AdminOrders,
│                          AdminOrderDetails   (all code-split via React.lazy)
```

## Original artwork (public/images)

All imagery is hand-authored inline-gradient SVG (no external image hosts, per the
network constraint): `hero-bottle-{eclipse,signature,midnight,essence}.svg` (four
distinct bottle silhouettes — rounded-shoulder flacon, classic rectangular flacon,
faceted hexagonal bottle, teardrop bottle — each with glass gradients, a metallic cap,
and a collection-tinted liquid fill), `liquid-splash-{1,2}.svg`, `logo-mark.svg`,
`favicon.svg`, `brand-story.svg`, `about-campaign.svg`, `product-placeholder.svg`, and
`social-{1..4}.svg` for the social showcase grid. Particles in the Hero are generated
procedurally (blurred, glowing `<span>`s with randomized position/timing) rather than
as a static SVG sheet.

## Key functional wiring (all real, against the documented API contract)

- **Auth**: JWT in `localStorage['nb_token']`, axios request interceptor attaches
  `Authorization`, response interceptor clears auth on 401. Forgot/reset password
  surfaces the dev-mode `resetUrl`/`resetToken` returned by the backend directly on
  screen, clearly labeled "Development Mode".
- **Cart**: localStorage-persisted `CartContext` (add/increment/decrement/remove/clear,
  subtotal + shipping-estimate + total), slide-in `CartDrawer` with the exact toast
  copy "Added to your collection.", plus a full `/cart` page.
- **Wishlist**: guest fallback in `localStorage`, synced to `/api/users/wishlist` once
  authenticated, with a one-time merge of any guest wishlist into the account right
  after login.
- **Shop**: debounced search, gender + fragrance-family + price + featured/bestseller/
  new-arrival filters, sort, and pagination — all mirrored into the URL querystring.
- **Product details**: gallery with thumbnail switching + hover-zoom, quantity/size,
  Add to Cart + Buy Now (adds then routes to `/checkout`), wishlist toggle, a
  concentric Top/Heart/Base notes diagram, occasion/season/longevity/sillage chips,
  reviews list + auth-gated review form, and a related-fragrances row from `/related`.
- **Scent Finder**: multi-select fragrance-family chip quiz → `/api/products/discovery`.
- **Checkout**: full client-side validation (required fields, email/phone format),
  order summary mirroring the backend's free-shipping-over-Rs.15,000 rule, Cash on
  Delivery only, submits to `POST /api/orders`, clears cart, routes to
  `/order-confirmation/:id`, which fetches the real order and shows a checkmark-reveal
  success animation plus an estimated 5–7 business day delivery window.
- **Account**: profile view/edit (name/phone/address/optional password) + real order
  history via `/api/orders/my-orders`.
- **Admin**: dashboard stat cards + hand-rolled SVG sales-trend chart (with a
  table-view toggle) from `/api/admin/stats`; full product CRUD table with
  search/delete-with-confirm and a create/edit form covering every product field
  (tag-input notes, occasion/season chip multi-select, image uploader that posts to
  `/api/uploads` first); orders list with status/search filters and a detail view
  whose status buttons call `PUT /api/orders/:id/status` and update instantly. Admin
  routes are `React.lazy`-split so storefront visitors never fetch that bundle.
- Loading skeletons, inline error states with retry, and empty states are present on
  every data-fetching view (Shop grid, cart, wishlist, orders, admin tables, etc.).

## Deviations / pragmatic decisions

1. **Collection-name filtering on Shop.** The product-list API contract exposes
   `category` (Men/Women/Unisex/Premium/Gift Sets) but no `collectionName` filter
   param. `CollectionGrid` on the homepage links to `/shop?collection=Eclipse` etc.,
   and `Shop.tsx` applies that as a **client-side** filter on the fetched page of
   results (not sent to the backend, since it isn't part of the contract). This means
   it filters within the current page rather than across all pages server-side —
   flagged here rather than silently guessed at. `/collection/:category` (the spec's
   documented route) instead calls the real `category` param and paginates correctly.
2. **Hero slide copy.** The brief gives two slightly different scripts for the
   "Signature" slide (a literal headline/support-line pair, and a separate
   headline/tagline entry in the 4-slide list). I merged them: the Signature slide
   uses the literal headline ("A Signature Scent. A Lasting Impression.") with the
   list's tagline ("Your scent. Your identity."), and a shared support line
   ("Discover fragrances created to define your presence.") renders under the tagline
   on every slide so both pieces of provided copy are used.
3. **Longevity/sillage/occasion/season** are free-text strings in the API contract
   (no enum given), so the admin form offers a curated select/chip list
   (Weak/Moderate/Long Lasting/Very Long Lasting, etc.) rather than a raw text field,
   for a better editing experience; the values submitted are still plain strings.
4. Toast host, quick-view modal, and mouse-parallax tilt on the Hero bottle are
   additive niceties beyond the literal spec text but within its stated intent
   ("cinematic", "3D feel via CSS transforms").

## Build verification

```
$ npm install && npm run build
✓ 511 modules transformed.
dist/index.html                              1.00 kB
dist/assets/index-*.css                      39.51 kB
dist/assets/AdminOrders-*.js                  1.42 kB
dist/assets/AdminOrderDetails-*.js            1.76 kB
dist/assets/AdminLayout-*.js                  2.35 kB
dist/assets/AdminProducts-*.js                4.16 kB
dist/assets/AdminDashboard-*.js               5.92 kB
dist/assets/AdminProductForm-*.js            10.71 kB
dist/assets/index-*.js                      447.68 kB
✓ built in ~2.6s
```

No `npm run dev` server was left running. `server/` was not touched. No git commands
were run.
