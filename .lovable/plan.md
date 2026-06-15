# Plan: Casual restructure + Olive & Paprika palette

## 1. New palette — Olive & Paprika

Update `src/styles.css` design tokens:
- `--bg` → warm cream `#f6f1e6`
- `--paper` → near-white `#fbf7ed`
- `--ink` → deep coffee `#2a2620`
- `--ink-soft` → warm grey `#6e6358`
- `--brand` → deep paprika `#a8351a` (bold accent for buttons, prices, callouts)
- `--accent` → olive green `#7a8a3a` (secondary pop — tags, "popular", icons)
- `--rule` → ink @ 14%

Bold + casual cues, not just palette:
- Slightly looser headings (less tight tracking)
- Friendlier copy tone in section labels (e.g. "What's cooking" instead of "On the menu")
- Add small playful touches: a hand-drawn-feel underline under one headline word, rotated price tag on meal cards, oversized eyebrow numbers

## 2. New home page structure

Replace the current home with this order:

```text
┌─────────────────────────────────────────┐
│ Tiny header strip:                      │
│   "Week of Jun 15 · Pickup Sat"         │
│   "Orders close Thu 8pm"                │
├─────────────────────────────────────────┤
│ TWO MEAL CARDS — side by side (stack on mobile) │
│ ┌──────────────┐  ┌──────────────┐      │
│ │  big image   │  │  big image   │      │
│ │  Meal name   │  │  Meal name   │      │
│ │  $price tag  │  │  $price tag  │      │
│ │  description │  │  description │      │
│ │  [Add to bag]│  │  [Add to bag]│      │
│ └──────────────┘  └──────────────┘      │
├─────────────────────────────────────────┤
│ Quick info strip: pickup day · window · │
│ address (paprika icons, olive labels)   │
├─────────────────────────────────────────┤
│ Owner note (kept, slightly warmer copy) │
├─────────────────────────────────────────┤
│ How it works — 1·2·3 (kept, restyled)   │
└─────────────────────────────────────────┘

Floating pre-order CTA: kept as-is (mobile sticky).
```

The two meals come from the existing `items` store — show the first two non-sold-out items as the "this week" meals. Each card links to the existing `/menu/$itemId` detail page for full ordering.

## 3. Remove the standalone menu

- Delete `src/routes/menu.tsx` (the list page)
- Keep `src/routes/menu.$itemId.tsx` (item detail still needed for add-to-cart flow)
- Remove the "Menu" link from `SiteChrome` nav
- Update any `<Link to="/menu">` on the home page to point to the first meal's detail, or just remove (the meals are right there)

## 4. Casual/fun visual moves

- Meal card: image fills top, name in display font, **price as a rotated paprika-red sticker** in the corner (–4°), description in body, big olive-outlined "Add to bag" button
- Eyebrow numbers in How-It-Works rendered huge in olive
- One headline word ("kitchen" or "cooking") gets a hand-drawn paprika underline (inline SVG squiggle)
- Replace ALL-CAPS headlines with sentence case in a couple spots to feel less editorial / more personal

## 5. Files touched

- `src/styles.css` — palette tokens + add `--color-accent` mapping for olive utility
- `src/routes/index.tsx` — full rewrite around new structure
- `src/components/SiteChrome.tsx` — drop Menu link, lightly retone
- `rm src/routes/menu.tsx`
- (No image regeneration this round — existing meal photos work. If they clash after the palette swap we can revisit.)

## Out of scope

- Admin pages (palette inherits automatically)
- Cart / checkout layout changes
- New food photography
