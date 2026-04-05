# Sub-Skill: UX Review

Run this BEFORE finalizing any page. Check user experience, flow, and accessibility.

## Purpose
Ensure the page is usable, the most important actions are obvious, and common UX failures are absent.

---

## Checklist

### Above-the-Fold Clarity
- [ ] **What business is this?** — Can a user identify the business type in <3 seconds from the hero alone?
- [ ] **What's the primary action?** — Is the main CTA (Book, Call, Order) visible without scrolling?
- [ ] **Is the logo visible?** — Logo must be readable. Check logo color against header bg. If white logo on light bg → fail.
- [ ] **Is the headline meaningful?** — "Your Story. Your Skin." tells me something. "Welcome to Our Studio" tells me nothing. Generic = fail.

### Navigation UX
- [ ] **Fewer than 6 nav items**: More = decision paralysis
- [ ] **Active page is indicated**: Current route has visual distinction
- [ ] **Mobile menu works**: All nav items accessible on mobile
- [ ] **External booking links open in new tab**: `target="_blank" rel="noopener noreferrer"`

### CTA Hierarchy
- [ ] **Single primary CTA per section**: Multiple equally-styled CTAs = confusion
- [ ] **CTA labels are specific**: "Book a Free Consultation" > "Learn More" > "Click Here"
- [ ] **CTA appears at least twice**: Once above fold, once at page bottom
- [ ] **CTA is reachable without scrolling forever**: No CTA buried after 5+ sections

### Content Quality
- [ ] **No placeholder content**: No "Lorem ipsum", no "[Business Name]", no "123 Main St"
- [ ] **Real hours shown**: If hours exist in analysis.json, they appear on the page
- [ ] **Real address shown**: Address in contact section or footer
- [ ] **Real phone number**: Linked with `tel:` protocol so mobile users can tap to call
- [ ] **Social links point to real accounts**: Not just `https://instagram.com` — must include their actual handle

### Accessibility Basics
- [ ] **Images have alt text**: Every `<img>` has descriptive alt (not just "image" or empty)
- [ ] **Color is not the only differentiator**: Don't rely solely on color to convey info
- [ ] **Interactive elements have sufficient size**: Buttons/links ≥44px tap target
- [ ] **Font size ≥14px on body text**: Nothing smaller for body copy

### Mobile
- [ ] **Hero is readable on 390px wide**: Text doesn't overflow. CTA is fully visible.
- [ ] **Images don't overflow horizontally**: No horizontal scroll on mobile
- [ ] **Nav collapses to hamburger**: Desktop nav is hidden on mobile

### Team / People Authenticity
- [ ] **Real names used**: Every person in the team section matches `brand-bible.json people[]`. No invented names.
- [ ] **Real photos used**: If `profilePhotoUrl` exists and `photoVerified: true`, the `<img src>` MUST use that URL. Stock photos of random people are WORSE than no photo.
- [ ] **No Unsplash people**: Never use `unsplash.com` URLs for team member portraits. Initials on a brand-color square are more honest.
- [ ] **Real roles/specialties**: Use roles from the website, not invented ones.
- [ ] **Portfolio photos from real work**: If `portfolioPhotos[]` exist, use them in gallery/portfolio sections instead of generic Unsplash images.

### Trust Signals
- [ ] **Reviews visible above the fold or within first 2 sections**: Social proof near the top
- [ ] **Business age/establishment shows when ≥10 years**: Heritage = trust
- [ ] **Address/location is findable**: Especially for walk-in businesses

---

## Output
Write a "UX Review" comment at the top of the relevant layout or page file:
```
// UX REVIEW
// ✓ Logo visible: dark header, white logo — OK
// ✗ Primary CTA: buried in section 4 — FIXED to appear in hero
// ✓ Mobile: hero readable at 390px — OK
// ✗ Social links: generic instagram.com URL — FIXED to @torontotattoohaus
// ✓ Real phone: +1 647-345-3549 with tel: link — OK
// ✓ Address: visible in footer and contact section — OK
```
