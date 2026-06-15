## Warm Sand palette swap

Replace the blue accent palette with the **Warm Sand** palette the user selected (`#faf8f5`, `#f0ebe3`, `#c9b99a`, `#8b7355`). Keep **Archivo Black + Hind** typography. Maintain all functionality — this is a pure design-system change.

### Step 1: Update design tokens in `src/styles.css`
Swap the `:root` token values:
- `--bg`: warm white `#faf8f5` (was cool grey-blue)
- `--paper`: keep near-white or slightly warm `#ffffff`
- `--ink`: warm near-black `#2d2a26` (was cool blue-black)
- `--ink-soft`: warm grey `#6b6560` (was cool grey)
- `--rule`: warm black at 12% opacity
- `--brand`: deep warm brown `#8b7355` (was electric blue) — the primary accent
- `--brand-ink`: warm white/cream for text on brand backgrounds
- `--secondary`: light sand `#f0ebe3`
- `--muted`: light sand `#f0ebe3`
- `--input`: warm ink at 15% opacity
- `--ring`: the new brand brown

Update the comment that still says "blue/white/light grey".

### Step 2: Audit all `.tsx` files for hardcoded blue values
Search for any hardcoded hex/OKLCH/RGB blue values or references to the old blue outside the token system. If any exist, replace with semantic tokens. Also check for any `selection:bg-brand`, `focus:border-brand`, `decoration-brand` — these resolve through tokens and should be fine, but verify visually.

Files to audit (known usages from context):
- `src/components/SiteChrome.tsx`
- `src/routes/index.tsx`
- `src/routes/menu.tsx`
- `src/routes/menu.$itemId.tsx`
- `src/routes/cart.tsx`
- `src/routes/checkout.tsx`
- `src/routes/checkout.success.tsx`
- `src/routes/about.tsx`
- `src/routes/contact.tsx`
- `src/routes/account.tsx`
- `src/routes/auth.tsx`
- `src/routes/admin.*.tsx` (all admin routes)
- `src/routes/__root.tsx`

### Step 3: Regenerate hero/food images with warmer tone
Regenerate the 7 food/portrait images to match the warm sand palette — less cool blue lighting, more warm natural kitchen light. This prevents visual clash between the warm UI and cool-tinted photos. Target paths:
- `src/assets/hero-pappardelle.jpg`
- `src/assets/dish-focaccia.jpg`
- `src/assets/dish-burrata.jpg`
- `src/assets/dish-ragu.jpg`
- `src/assets/dish-veg.jpg`
- `src/assets/dish-cake.jpg`
- `src/assets/owner.jpg`

### Step 4: Verify no visual regressions
Run a quick visual check (build + preview) to confirm:
- Buttons on dark backgrounds still have enough contrast
- The "Sold out" / "Popular" / "Featured" pills read clearly
- Admin slot capacity bars are visible
- Focus states on form inputs are visible
- Mobile sticky CTA is readable
- No lingering cool blue anywhere in the UI

### Out of scope
- No layout changes
- No copy/content changes beyond image prompts
- No functionality changes
- No new routes or components