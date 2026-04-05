# Sub-Skill: UI Component Review

Run this BEFORE writing component code. Check every UI element against the brand.

## Purpose
Ensure every interactive and visual component is on-brand, functional, and consistent. Catch component-level failures before they're coded.

---

## Checklist

### Header / Navigation
- [ ] **Logo background**: Header bg must contrast with logo color.
  - White logo → header must be dark (≥ #555 or use dark brand color)
  - Dark logo → header can be light, but must have sufficient contrast
  - If logo color unknown: fetch the actual logo URL and describe what you see
- [ ] **Header height**: At least 64px — not too thin, not too tall
- [ ] **Sticky behavior**: Header should be `position: sticky top-0` — not fixed (avoids layout shift)
- [ ] **Nav links readable**: Link color must contrast with header bg
- [ ] **CTA in header**: Primary CTA should be distinct from nav links (button, not just link)
- [ ] **Mobile menu**: Hamburger exists and works. Mobile menu bg matches header bg.

### Buttons
- [ ] **Primary button**: Has solid bg, high contrast text. Matches brand primary color.
- [ ] **Hover state**: Color shift or scale on hover — never invisible
- [ ] **Button text**: Uppercase + tracking for tattoo/salon brands. Sentence case for professional services.
- [ ] **Border radius**: Must match brand-tokens `radiusButtons`. Sharp corners ≠ pill buttons.
- [ ] **Minimum tap target**: ≥44px height on mobile

### Team / Artist / Staff Section (CRITICAL — read before writing any team component)
- [ ] **Read `brand-bible.json people[]` FIRST**: Never build a team section without checking if real photos exist in the brand bible
- [ ] **Use `profilePhotoUrl` from brand bible**: If `photoVerified: true`, use it as `<img src>`. Do NOT substitute Unsplash or generic avatars.
- [ ] **Fallback for null photo**: Solid color block + person's initials in brand font. NOT a stock photo of a random person. Random person photos are worse than initials.
- [ ] **Use real portfolio photos**: If `portfolioPhotos[]` has entries, use them in the artist's work samples grid (not Unsplash pizza/tattoo/hair photos)
- [ ] **Use real bio text**: If `bio` is not null, use verbatim. Do not invent bios.
- [ ] **Use real Instagram handle**: If `instagram` is not null, link to `instagramUrl`. Real social links = real proof.
- [ ] **Image aspect ratio**: `aspect-square` for barber/stylist headshots. `aspect-[3/4]` for full body. `aspect-[4/3]` for portfolio/work photos.

### Gallery / Images (CRITICAL — read brand-bible.json images{} before writing ANY section)
- [ ] **Read `brand-bible.json images` FIRST**: The brand bible has verified URLs for hero, logo, food/product photos, gallery, and atmosphere shots. USE THEM.
- [ ] **Every menu/service card has a real photo**: If `images.food[]` has entries, map them to menu highlight cards. A card with `backgroundColor` only and no image is an automatic fail — the prospect sees a blank box.
- [ ] **Hero uses real hero image**: `images.hero` URL goes in the hero `backgroundImage`. Not a generic gradient.
- [ ] **About section has a real photo**: Use `images.food[0]` or `images.atmosphere[0]` next to the story text. Text-only about sections feel hollow.
- [ ] **Images have fallback**: If src 404s, background color fills the space (not broken img icon)
- [ ] **Aspect ratio locked**: Images don't reflow on load — aspect-ratio CSS or fixed height
- [ ] **No img with onError in Server Components**: Use CSS bg fallback instead
- [ ] **No external CDN that blocks hotlinking**: All image URLs in brand bible are pre-verified HTTP 200. If adding new ones, test first.

### Cards (if used)
- [ ] **Cards have visible boundary**: Either border, shadow, or bg different from page
- [ ] **Hover state**: Subtle lift, border color change, or text color change
- [ ] **No orphaned cards**: Grid should never leave a single card on a row alone (use `justify-center` or adjust column count)

### Footer
- [ ] **Footer bg contrasts with body**: If body is light, footer can be dark (visual anchor)
- [ ] **Footer has contact info**: Phone, email, address — not just social links
- [ ] **Footer links are readable**: Not same color as footer bg

### Watermark Banner
- [ ] **Banner exists on every page**: `WatermarkBanner` component imported in layout.tsx
- [ ] **Body has `pt-8`**: Body must have top padding matching banner height or banner overlaps content
- [ ] **Banner is dismissable**: X button present

---

## Output
Write a "UI Review" comment in globals.css:
```css
/* UI REVIEW
 * ✓ Header: black bg, white logo — OK
 * ✓ Buttons: sharp corners, gold bg matching brand-tokens — OK
 * ✗ Images: onError in server component — FIXED to CSS bg fallback
 * ✓ Footer: dark bg contrasts with beige body — OK
 * ✓ Body pt-8: watermark banner offset present — OK
 */
```
