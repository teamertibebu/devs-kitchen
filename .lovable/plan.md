## Goal
Make the two weekly meals the first thing visible above the fold. Remove redundant branding and the "This Week's Batch" section.

## Changes to `src/routes/index.tsx`

1. **Remove the split-screen hero entirely.** Delete the left column (big "DEV'S KITCHEN" stacked headline, tagline, Pre-Order/Contact buttons) and the right column (single signature image with brand sticker).

2. **Remove the "This Week's Batch" section** (the `02 / Menu` block listing 6 items + "View Full Menu" button).

3. **New top of page (above the fold):**
   - Thin top strip (small, single line): `Week of {label} · Pickup {sat.label}` on the left, `Orders close Thu 8pm` on the right. No big wordmark here — the site header already shows "Dev's Kitchen", so the hero wordmark is removed to kill the redundancy.
   - Immediately below: **two big side-by-side meal cards** (stack on mobile) filling the viewport. Each card shows:
     - Large image (tall aspect on mobile, ~4:5 on desktop)
     - Meal name (display font, prominent but not viewport-eating)
     - Price (paprika sticker, rotated −4°)
     - 2–3 line description
     - "Add to bag" (olive outline) + "See more →" buttons
   - Sized so both cards' images + names + descriptions are visible without scrolling on a standard laptop and mostly visible on mobile (image + name + price above fold, description just below).

4. **Keep below the fold:** owner/story section, How-It-Works 1·2·3, contact/pickup CTA, floating pre-order button. Drop the standalone testimonial-only section to keep the page tight (owner story already carries voice).

5. **Meal selection:** use `items.filter(i => i.featured && !i.soldOut).slice(0, 2)` so the two weekly meals are data-driven. Fall back gracefully if fewer than 2.

## Files
- `src/routes/index.tsx` — restructure as above. No other files change.

## Out of scope
- Header/SiteChrome (already shows the single brand name — leaving it as the only instance).
- Palette, fonts, admin, cart/checkout, new imagery.
