# Retro Diner Redesign

A full visual overhaul of the home page (and supporting chrome) to feel like a hand-printed mid-century diner menu from a home kitchen — chunky, warm, a little goofy, very not-corporate.

## Look & feel

- **Palette**: cream `#fff8e7` background, tomato red `#d4232a` primary, deep navy `#1a3c5a` ink, mustard `#f4c430` accent. Subtle paper-grain texture overlay.
- **Type**: chunky slab/condensed display for headlines (Alfa Slab One or Ultra), a friendly script for accents ("today's menu", "fresh!"), and a clean readable body (Bitter or DM Sans). Loaded via `@fontsource`.
- **Details**: ticket/coupon borders (dashed + scalloped edges), starburst badges ("HOT!", "FRESH!"), rotated sticker prices, hand-drawn underlines, slight paper-tilt on cards. No gradients, no glassy stuff.

## Page structure (home)

```text
┌────────────────────────────────────────────────┐
│ PINNED STRIP: ★ Pickup Sat 11–2 · SF ★         │  ← always visible, navy on mustard
├────────────────────────────────────────────────┤
│ [logo "Dev's Kitchen"]            [🛒 cart]    │  ← small header only
├────────────────────────────────────────────────┤
│  TODAY'S MENU  (script accent)                 │
│  ┌──────────────────────┐ ┌──────────────────┐ │
│  │ [img] NAME      $24  │ │ [img] NAME  $26  │ │  ← 2 horizontal "ticket" cards
│  │       desc...        │ │       desc...    │ │     side-by-side desktop,
│  │       [ADD TO BAG]   │ │   [ADD TO BAG]   │ │     stacked short on mobile
│  └──────────────────────┘ └──────────────────┘ │
├────────────────────────────────────────────────┤
│  (below the fold) story, how it works, etc.    │
└────────────────────────────────────────────────┘
```

- **Pinned strip** (top): mustard band, navy text, tiny star dividers. Replaces the old StatusStrip styling.
- **Header**: small wordmark left, cart icon right. No nav links (hamburger on mobile/desktop). Removes the floating "Pre-order" button entirely.
- **Two meal cards**: horizontal layout on BOTH mobile and desktop (image left ~40%, content right). Sized so both fit above the fold at 752×780 and on a 375×667 mobile viewport. Sticker price rotated, red "ADD TO BAG" button, dashed ticket border. No "see more →" link clutter — tap the card image/name to go to detail.
- **Below the fold**: keep owner story, "how it works" 1-2-3, CTA — restyled in the diner aesthetic (cream + navy with red/mustard accents, no more dark sections).

## Sizing math for above-the-fold

Target mobile: 375×667 minus ~60px pinned strip minus ~52px header = ~555px for two cards + section heading. Each card ≈ 240px tall (140px image area + name/price row + 2-line desc + button). Section heading ≈ 50px. Total ≈ 530px ✓.

## Changes by file

- `src/styles.css` — replace color tokens with diner palette; remove `section-dark` usage; add `ticket-border`, `sticker-price`, `paper-grain`, `starburst` utilities; register new fonts.
- `package.json` — add `@fontsource/alfa-slab-one`, `@fontsource/caveat` (script), `@fontsource/bitter`.
- `src/main.tsx` (or root) — import font CSS.
- `src/components/SiteChrome.tsx` — rewrite StatusStrip as mustard pinned bar; shrink header to logo + cart only; restyle footer to match cream theme.
- `src/routes/index.tsx` — full rewrite: drop floating pre-order CTA, drop "see more" link, switch to horizontal ticket cards sized for above-the-fold, restyle remaining sections in diner aesthetic.
- Other route pages (menu, cart, about, etc.) — light token-driven restyle so they inherit the new palette/fonts without per-page rewrites this round.

## Out of scope

- Backend, data model, cart logic, routing — untouched.
- Admin pages — inherit token changes only.
- Adding new content/copy beyond what already exists in the store.
