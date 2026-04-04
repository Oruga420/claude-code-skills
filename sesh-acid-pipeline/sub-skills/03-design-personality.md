# Skill 03 — Design Personality (Anti-Template)

## Purpose

This skill is applied DURING the build phase (Step 3 of 02-build-deploy.md) to ensure every site has a **distinct visual personality** that reflects the real business — not a generic template.

The #1 failure mode of automated builds is producing the same layout with swapped colors. This skill prevents that.

---

## The Core Rule

> A site should feel like it BELONGS to that business before you read a single word.
> If swapping the logo and colors would make it look like a different business, the design has no personality.

---

## Step 1 — Read the Brand Personality Before Writing Any Code

Before writing a single component, answer these 5 questions from the brand bible:

1. **What is the dominant emotion?** (warmth? power? precision? playfulness? authority? grit?)
2. **Is the work the product, or is trust/expertise the product?** (tattoo studios, salons = work; dentists, lawyers = trust)
3. **How established are they?** (newcomer = clean/modern; 10+ years = heritage weight)
4. **What do their customers feel when they're there?** (from Google reviews)
5. **What would NEVER fit this brand?** (rounded buttons on a gritty studio? Serif headings on a fast-service barber?)

Write your answers as a comment at the top of page.tsx before coding anything.

---

## Step 2 — Choose a Layout Personality (not a layout template)

Pick ONE of these layout personalities based on the brand. This defines the visual grammar of the entire page.

### A) EDITORIAL — For heritage/art/craft brands
- **When to use:** 10+ year studios, fine dining, bespoke services, artist-driven businesses
- **Signature moves:**
  - Split hero: big typography LEFT, full-bleed image RIGHT (or vice versa)
  - Sections as editorials: label + oversized heading + text in a 2-col grid
  - List-based service sections (editorial line items with dividers, not card grids)
  - One section with extreme type scale (80px+ heading with minimal body copy)
  - Dark footer as a "back page" of a magazine
- **Avoid:** card grids, centered everything, stats bars, feature bullet lists

### B) GALLERY-FORWARD — For portfolio businesses where work = product
- **When to use:** Tattoo studios, salons, photographers, nail bars, restaurants
- **Signature moves:**
  - Gallery is above the fold or immediately after a minimal hero
  - Images bleed edge-to-edge, no white padding around photos
  - Asymmetric image grids (one large + several small, not 3x2 equal)
  - Text is minimal — captions, not paragraphs
  - Gallery section uses dark background to make images pop (even on light-themed sites)
- **Avoid:** equal card grids, image thumbnails with rounded corners, stock-photo vibes

### C) AUTHORITY — For trust-driven service businesses
- **When to use:** Dentists, lawyers, accountants, medical
- **Signature moves:**
  - Hero headline answers "Why trust us?" directly (e.g., "20 Years. 5,000 Patients. Your Smile.")
  - Social proof is structural, not decorative (reviews integrated into the layout, not a testimonial card)
  - Services as a clean pricing/feature comparison, not a 4-icon card grid
  - Professional photography (if unavailable, use high-contrast solid color sections instead)
  - One bold accent color max; rest is black/white/gray
- **Avoid:** playful fonts, colorful hero sections, too many sections

### D) NEIGHBORHOOD — For foot-traffic/local businesses
- **When to use:** Restaurants, cafes, barbershops, boutiques, nail salons
- **Signature moves:**
  - Address and hours prominent in hero or immediately below
  - "The space" section — show the interior, not just the menu
  - Local language ("Scarborough's spot for...") not corporate ("We serve clients in...")
  - Warm/textured backgrounds (not flat #fff), tactile feel
  - Map is a featured section, not an afterthought
- **Avoid:** corporate CTAs ("Request a consultation"), generic hero images, missing hours

---

## Step 3 — Typography Contrast Rules

Typography is where personality lives. Enforce these:

### Size Contrast
- H1 should be at least **4x** the size of body text
- If the brand is bold/industrial: push to 6x (80px+ heading, 14px body)
- If the brand is refined/editorial: use tight line-height (0.9) on large headings for elegance

### Weight Contrast
- Never use a single weight throughout. Pair:
  - Heavy heading (700-800) + Light body (300)
  - OR Light heading (300) + Medium body (400-500) for refined brands

### Case and Spacing
- Labels/overlines: UPPERCASE, `tracking-[0.3em]` minimum, small size (11-13px)
- This creates a three-tier hierarchy: LABEL → BIG HEADING → body text
- Never skip the label tier — it's what prevents the "wall of centered headings" look

---

## Step 4 — Section Differentiation (not just bg alternation)

Instead of `bg-white → bg-gray-50 → bg-white`, use these section personalities:

| Section | Differentiation technique |
|---------|--------------------------|
| Hero | Full-bleed image OR extreme type scale, never just colored background |
| Portfolio/Gallery | Dark background to make images pop, edge-to-edge images |
| Services | Editorial list OR feature table (NOT 4-card grid unless truly needed) |
| Testimonials | Contrast inversion (dark bg on light site, or vice versa) |
| Team | Personal — show real photos if available, not icon placeholders |
| Location | Map as a FEATURED element (half-page), not a small embed |
| CTA | Full-bleed brand color — the most saturated/bold section on the page |

---

## Step 5 — Anti-Template Checklist

Before finalizing the page, scan for these generic template signals and FIX them:

- [ ] **Centered hero with centered button?** → Make it left-aligned OR split layout
- [ ] **Four equal-sized cards for services?** → Convert to editorial list with dividers
- [ ] **"We are [Business Name]" hero headline?** → Replace with a VALUE STATEMENT or EVOCATIVE line
- [ ] **Generic CTA "Learn More"?** → Replace with specific action ("Book Your Flash Appointment", "See Our Artists")
- [ ] **Stats bar with "X+ years | Y+ clients | 5 stars"?** → REMOVE. It's fabricated filler that screams template.
- [ ] **Heading + divider line + body paragraph as section intro (3x in a row)?** → Break the pattern — not every section needs the same structure
- [ ] **All sections same padding?** → Vary section heights. Some sections should breathe (120px padding), some should be compact (40px).
- [ ] **Font used at one weight only?** → Use at least 2 weights in visible contrast

---

## Step 6 — The Uniqueness Test

After building, ask: **What is the ONE visual element on this page that you'd only see on this specific business's site?**

It should be something like:
- "The hero splits to show the 25-year-old logo on a warm background next to full-bleed tattoo work"
- "The gallery section is dark with edge-to-edge photos, immediately after the hero"
- "Services are shown as editorial line items — title, one-line description, no icons"

If you can't name one unique thing, go back to Step 2.

---

## Common Personality Examples by Business Type

### Tattoo Studio (traditional/established)
- Layout: EDITORIAL + GALLERY-FORWARD hybrid
- Hero: Split — big studio name typographically left, full-bleed tattoo image right
- Gallery: Immediately below hero, dark bg, asymmetric grid (one large image + smaller)
- Services: Editorial list, not cards
- No: stats bar, rounded corners, soft drop shadows, cheerful CTAs

### Tattoo Studio (modern/fine line)
- Layout: GALLERY-FORWARD
- Hero: Minimal — just a clean headline, muted background, immediate gallery below
- Gallery: White background, square images with micro-gap between them
- Typography: Light weights, generous spacing, quiet confidence
- No: loud colors, heavy fonts, dark moody backgrounds

### Hair Salon / Nail Bar
- Layout: GALLERY-FORWARD + NEIGHBORHOOD
- Focus on transformation — before/after or portfolio work
- Warm, tactile backgrounds
- Booking CTA should be above the fold

### Barbershop
- Layout: NEIGHBORHOOD + editorial elements
- Local pride language
- Hours visible immediately
- Dark or high-contrast if brand is gritty/masculine; warm beige if vintage/classic

### Dentist / Medical
- Layout: AUTHORITY
- No portfolio — use testimonials and credentials instead
- Clean, clinical, trustworthy
- Blue/white or neutral palette (unless brand is explicitly different)

### Restaurant / Cafe
- Layout: NEIGHBORHOOD
- Food photography or interior photography immediately visible
- Menu teaser above fold
- Hours and location in first two sections
