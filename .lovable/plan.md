## Goal
Restyle Dev's Kitchen to feel like a sibling of atlwonder.com — bold, image-forward, confident — while keeping the two-meal pre-order flow intact.

## Visual direction (inspired by ATL Wonder)
- **Mixed theme gradient:** page starts on warm cream (current `--bg`) at the top so the two weekly meal cards pop with food photography, then transitions to a deep near-black (`oklch(0.18 0.012 60)`) background from the owner-story section onward. Footer/contact stays dark.
- **Bold accent block:** ATL Wonder leans on a single saturated color flooded behind hero content. Use paprika as that flood color on accent strips (top thin bar, CTA bands, section dividers) — feels casual + fun without going rainbow.
- **Typography:** keep Archivo Black display, but use it ATL-Wonder-style — bigger, tighter, all-caps section labels with generous letter-spacing for eyebrows. No size change for hero (we want meals first).
- **Imagery treatment:** ATL Wonder uses square, gallery-style portraits. Adopt square/4:5 meal images with subtle hover zoom (already there), add a thin paprika frame on hover.

## Page structure
1. **Header** (unchanged structurally) — small "Dev's Kitchen" wordmark only, per user choice.
2. **Thin paprika top strip** — week label + "Orders close Thu 8pm" in cream on paprika. More confident than current bordered strip.
3. **Two meal cards (above fold)** — keep current side-by-side layout. Refinements:
   - Square (1:1) images on desktop instead of 5:4, ATL-gallery feel.
   - Bigger meal name (font-display, ~3xl→4xl), price sticker stays rotated paprika.
   - "Add to bag" button becomes solid paprika (not olive outline) to match ATL Wonder's solid pill CTAs.
4. **Quick info strip** (pickup/window/where) — restyle as three big stat blocks with paprika numerals/icons, on cream.
5. **Section break → dark.** A diagonal or solid paprika band transitions cream → near-black.
6. **Owner story** (on dark) — ATL Wonder-style: large square portrait left, big display quote right in cream, paprika underline accent. This is where the brand personality lives.
7. **How it works 1·2·3** (on dark) — oversized olive numerals on dark cream-text, cards with paprika hover.
8. **Contact/pickup CTA band** (dark, paprika button) — mirrors ATL Wonder's "Book Now" emphasis with a "Pre-order this week →" primary CTA.
9. **Floating pre-order button** — keep, restyle to match new CTA (solid paprika pill, slight shadow).

## Token changes (`src/styles.css`)
- Add `--bg-dark: oklch(0.18 0.012 60)` and `--ink-on-dark: oklch(0.97 0.015 85)`.
- Add `@utility section-dark` to apply dark bg + light text in one class.
- Keep palette: cream / paprika / olive / coffee-ink.

## Files
- `src/styles.css` — add dark token + utility, keyframe for section reveal.
- `src/routes/index.tsx` — restructure sections per above; swap olive outline CTA → solid paprika; add dark sections.
- `src/components/SiteChrome.tsx` — minor: ensure header wordmark stays small/single instance; adjust footer to dark theme to match new bottom.

## Also fixes
- Hydration mismatch (`Week of Saturday, Jun 20` vs `Jun 27`): the week label is computed at module load with `new Date()`, so SSR and client render different weeks across the midnight/Saturday boundary. Move the week computation into a `useState` initialized from a stable source, or compute once on the client after mount with a placeholder for SSR. Fix while touching `src/lib/store.ts` / `index.tsx`.

## Out of scope
- Cart, checkout, admin, menu detail page styling (will inherit token changes only).
- New food photography — reuse existing images.
- Logo/wordmark design.
