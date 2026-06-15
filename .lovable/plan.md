## What I'm building

A polished v1 **frontend prototype** (no backend, no real auth, no real payments) of a home-based food business pre-order site. All data lives in-memory / localStorage so the screens feel live and the admin can actually edit the menu during a demo.

**Locked design direction:**
- Palette: blue + white + light grey, one strong blue accent
- Type: Archivo Black (display) + Hind (body)
- Layout: editorial **magazine** — featured dish hero, asymmetric grid, generous spacing
- Mobile-first; desktop is a thoughtful upscale

**Anti-slop guardrails:** no purple gradients, no 3-up "feature" grids with circle icons, no abstract blobs, no "empowering your journey" copy. Restrained palette, intentional spacing, strong type, real-feeling placeholder copy for a home cook.

## Flow before I build

1. After plan approval, generate **3 rendered design directions** (all locked to the palette/type/layout above; varying composition, density, hierarchy) and ask you to pick one.
2. Build the chosen direction across all screens below.

## Customer-facing screens

```text
/                 Home — hero, this week's pickup window, featured dishes, about teaser, testimonials, contact
/menu             This week's pre-order menu (categories, tags, sold out states, add-to-cart)
/menu/$itemId     Item detail (image, description, qty, notes)
/cart             Cart + order summary, edit qty, pickup reminder banner
/checkout         Multi-step: contact → pickup day/time → payment method → review
/checkout/success Confirmation with pickup details + "create account to save info" prompt
/account          (Optional) Order history, reorder, saved contact, profile
/auth             Mock sign-in / sign-up (localStorage)
```

**Pre-order model in the UI:**
- Persistent banner: "Pre-ordering for pickup Sat Jun 20 · Orders close Thu 8pm"
- Menu item cards show status pills: Featured · Popular · Sold out
- Checkout step 2 = pickup day + time-slot picker (only available slots shown)
- Payment options: Card, Apple Pay, **Pay with Cash** (with clear "due at pickup" copy)
- Success page restates pickup day/time + "we'll text you a reminder the day before"

## Admin portal

```text
/admin            Dashboard — next pickup day volume, top items, quick actions
/admin/menu       Menu manager — categories, drag-to-reorder, quick toggles
/admin/menu/new   Item editor (name, desc, price, category, image, toggles)
/admin/menu/$id   Edit item
/admin/schedule   Preorder window + pickup days + time slots
/admin/orders     Upcoming orders grouped by pickup day/slot
/admin/reminders  Text reminder timing + message template preview
/admin/business   Business info (name, hours, contact, about, social)
```

Admin is plain-language, large tap targets, thumbnails everywhere, mobile-usable. Item editor uses toggles for Available / Sold out / Featured. Image upload uses local file → object URL (prototype only).

## Tech notes (for the technical reader)

- Stack stays on the existing TanStack Start + Tailwind v4 + shadcn template.
- State: a `useMenuStore` / `useCartStore` / `useScheduleStore` (Zustand or plain React context + `useSyncExternalStore`) persisted to `localStorage`, seeded with realistic placeholder data on first load. Lets the admin edit menu → customer site reflects it live in the same browser session.
- Routing: file-based under `src/routes/`. Admin lives under `src/routes/admin.*.tsx` (no real auth gate in v1 — just an unlinked URL; a fake "admin mode" toggle is fine for the demo).
- Design tokens (blue/white/grey scale, accent blue, radii, shadows, type) defined in `src/styles.css` under `@theme` — no hardcoded color classes in components. Fonts loaded via `<link>` in `__root.tsx` head.
- Images: realistic food placeholders generated with `imagegen` and stored under `src/assets/`.
- Forms: shadcn + react-hook-form + zod, already in the template.
- SMS reminders: UI-only — admin can preview the text template; no provider wired.
- Payments: UI-only — selecting card/Apple Pay/Cash creates a mock order in localStorage and routes to `/checkout/success`.
- SEO: per-route `head()` with distinct title + description on every customer page.

## Explicitly out of scope for v1

- Lovable Cloud / database / real auth / real payments / real SMS
- Multi-tenant admin or roles
- Real email/SMS sending
- Order status workflow beyond "received"

## After you approve

I'll switch to build mode, generate 3 design directions for the locked palette/type/layout, and wait for your pick before implementing.