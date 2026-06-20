## Plan

1. **Simplify the header bar** in `src/components/SiteChrome.tsx`
   - Remove the centered pickup info block (clock icon + "Pickup Sat 11AM – 2PM / Orders close Thu 8PM").
   - Remove the desktop "Order Now" button and the mobile cart icon button from the header.
   - Keep the logo far left and the Home / About / Connect nav links on the right.

2. **Add a floating cart bar** in `src/components/SiteChrome.tsx`
   - Fixed to the bottom of the viewport, sitting above page content.
   - Appears only when the cart has at least one item and the page has hydrated.
   - Left side shows a compact summary: item count + subtotal (e.g., "2 items · $42").
   - Right side shows a primary CTA: "Order Now" / "Review bag".
   - Tapping the bar navigates to `/cart`.
   - On mobile: thumb-friendly height and safe-area padding; on desktop: anchored, narrow, and unobtrusive.

3. **Move pickup information** in `src/routes/index.tsx`
   - Remove the pickup block from the header.
   - Place the same pickup details directly underneath the "This Week's Menu" heading.
   - Style it to sit well on the dark gradient background: light text, cobalt accent icon, and the "Orders close" line included.
   - Keep the existing white pickup-info strip and owner/story section below unchanged.

## Technical details

- The cart bar will read from `useCartCount` and `useCartTotal` in `src/lib/store.ts` and use `<Link to="/cart">` from TanStack Router.
- The header will lose its `Clock` icon import if it is no longer used elsewhere there.
- The floating bar will be rendered inside `SiteChrome` so it persists across routes.
- No backend or cart logic changes are needed; this is a presentation/navigation-only update.