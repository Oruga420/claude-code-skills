# Sub-Skill: Designer Review

Run this BEFORE writing any component code. Answer every question. Fix issues before proceeding.

## Purpose
Catch visual design failures before they ship. This covers color, typography, layout personality, and brand fidelity at a macro level.

---

## Checklist — run through every item

### Color
- [ ] **Logo vs header background contrast**: What color is the logo? What color is the header bg? If logo is white/light and header is white/light → FAIL. Must fix header bg or invert logo.
- [ ] **Body bg vs hero text**: Is the hero text readable over the background/image? Overlay needed?
- [ ] **CTA button contrast**: Does the primary CTA button have ≥4.5:1 contrast ratio with its background?
- [ ] **Section differentiation**: Do adjacent sections look different? At least 2 distinct bg colors in use.
- [ ] **Dark sections don't bleed into light**: Sections have clear visual boundaries.

### Typography
- [ ] **H1 is at minimum 3x body size**: If body is 16px, H1 should be ≥48px.
- [ ] **At least 2 font weights in use**: Never single-weight throughout.
- [ ] **Overlines/labels exist**: Every section has a small uppercase label above the heading — creates 3-tier hierarchy (label → H2 → body).
- [ ] **Heading is never the same size as subheading**: Clear size differentiation between H1, H2, H3.

### Layout personality
- [ ] **Hero is NOT centered text on colored background**: Must be either split layout, full-bleed image, or extreme type scale.
- [ ] **Services are NOT 4 equal cards**: Use editorial list, pricing table, or creative grid.
- [ ] **At least 1 full-bleed section**: Either hero image or full-width color block.
- [ ] **Section padding varies**: Not every section has identical py-24. Some sections should be tighter (py-12), some more spacious (py-32).

### Brand fidelity
- [ ] **Colors trace to brand bible**: Every hex value is in brand-tokens.ts, not hardcoded.
- [ ] **Fonts match brand bible**: No Playfair, Roboto, or Inter unless CSS forensics confirmed.
- [ ] **overallTheme respected**: Light theme = light backgrounds throughout. Dark theme = dark throughout. No random inversions.

### Visual content (CRITICAL — no empty placeholders)
- [ ] **Real food/product photos used**: Check `brand-bible.json images.food[]` — every card/grid item with visual space MUST use a real photo URL, not an empty div with a background color.
- [ ] **Hero has a real image**: Not a solid color gradient. Use `images.hero` from brand bible.
- [ ] **Zero Unsplash URLs**: Search the code for `unsplash.com` — if found, replace with brand bible images.
- [ ] **Count visual sections vs photos used**: If the page has 4+ visual areas (hero, menu cards, about image, gallery) but uses fewer than 3 real photos → FAIL. Go back to brand bible images.

---

## Output
Write a brief "Designer Review" comment at the top of page.tsx:
```
// DESIGNER REVIEW
// ✓ Logo: white on black header — OK
// ✓ H1: 80px vs 16px body — OK
// ✗ Services: using 4 equal cards — FIXED to editorial list
// ✓ Section differentiation: beige / black / cream / black — OK
```
