# Sub-Skill: Design Quality Gate

> Anti-template quality gate. Run BEFORE writing any component code.
> Sources: frontend-design, ui-ux-pro-max, marketing-psychology, ux-researcher-designer

This sub-skill ensures every build looks like the output of a professional web designer — not a template with swapped colors. A prospect should look at the site and think "this was made FOR me" not "this looks like every other website."

---

## Step 1 — Design Personality Commit (BEFORE coding)

Before writing a single line of code, answer these questions using the brand bible:

### 1.1 — What makes this business VISUALLY unique?

Look at their current website, Instagram, and Google Maps photos. Identify:
- **Signature visual element**: What's the ONE thing that makes this business look different? (exposed brick, neon signs, murals, vintage decor, industrial pipes, live plants, dramatic lighting)
- **Texture and material vocabulary**: Wood? Metal? Concrete? Glass? Fabric? The website should FEEL like the physical space.
- **Photography style**: Moody and dark? Bright and airy? Warm and golden? The site's color temperature should match their photos.

### 1.2 — Choose a BOLD aesthetic direction

Do NOT default to "clean and modern" — that's what templates do. Pick ONE:

| Direction | When to use | CSS characteristics |
|-----------|------------|---------------------|
| **Editorial/Magazine** | Heritage brands, craft businesses, stories to tell | Extreme type scale (8rem+ headlines), asymmetric layouts, pull quotes, generous whitespace, art-directed sections |
| **Gallery-Forward** | Portfolio businesses (tattoo, photo, design) | Edge-to-edge images, masonry/asymmetric grids, minimal text, images ARE the content, hover reveals |
| **Atmospheric/Immersive** | Restaurants, bars, nightlife, experiences | Full-bleed background images, dark overlays, parallax, ambient motion, mood-first design |
| **Brutalist/Raw** | Streetwear, tattoo, music, counter-culture | Mono fonts, hard borders, stark contrast, unconventional layouts, anti-pretty on purpose |
| **Luxury/Refined** | High-end services, spas, fine dining | Thin fonts, extreme letter-spacing, muted palettes, micro-animations, restrained elegance |
| **Neighborhood/Warm** | Family restaurants, local shops, community | Warm tones, rounded corners, handwritten accents, photo-heavy, conversational tone |

### 1.3 — Define the "One Thing"

Every memorable website has ONE design element that makes it stand out:
- A hero section with a full-screen video loop of the kitchen
- An artist page where hovering reveals the tattoo style transforming
- A parallax scroll that tells the business's origin story
- A menu section with photos that scale on hover like a magazine spread
- A gallery with asymmetric masonry that breaks the grid unexpectedly

**Write this down before coding.** If you can't name the "one thing," the site will look generic.

---

## Step 2 — Layout Composition Rules (Anti-Template)

### 2.1 — NEVER do these (template signals)

| Template Signal | Why it looks cheap | Professional alternative |
|-----------------|-------------------|------------------------|
| Equal-height card grid | Every Wix template has this | Asymmetric grid, magazine layout, staggered heights |
| Centered everything | Default alignment = lazy | Mix alignments — left-aligned text next to right-aligned images |
| Same section padding everywhere | Mechanical spacing | Vary rhythm — tight sections after spacious ones |
| Icon + heading + paragraph cards | The holy trinity of templates | Use real photos, pull quotes, statistics, or just bold text |
| Horizontal rule separators | Screams "divider" | Use color shifts, overlapping sections, diagonal cuts |
| Stock icon libraries (Heroicons everywhere) | Generic | Custom SVG accents, brand-specific decorative elements |
| Perfectly symmetrical layouts | Predictable | Break the grid intentionally — one column wider, offset elements |

### 2.2 — ALWAYS do these (professional signals)

| Professional Signal | Implementation |
|--------------------|---------------|
| **Typographic hierarchy with drama** | H1 should be AT LEAST 5x body size. Use extreme scale: 6rem, 8rem headlines. Mix weights dramatically (100 + 800). |
| **Intentional white space** | Sections should "breathe." Don't fill every pixel. Use `py-32` not `py-8`. Let the content sit in space. |
| **Asymmetric layouts** | 60/40 splits, offset grids, overlapping elements. CSS Grid with `grid-template-columns: 2fr 1fr` or `3fr 2fr`. |
| **Full-bleed moments** | At least ONE section that breaks the max-width container and goes edge-to-edge. |
| **Hover states that delight** | Not just `opacity-80`. Use scale + shadow + color shift simultaneously. Image reveals, clip-path animations. |
| **Scroll-triggered reveals** | Sections that fade/slide in as you scroll. Use CSS `animation-timeline: scroll()` or IntersectionObserver. |
| **Micro-typography details** | Uppercase overlines with wide tracking (`tracking-[0.2em]`), styled first-letters, hanging punctuation, optical margin alignment. |
| **Color blocking** | Alternate between light and dark sections with purpose. Dark sections for impact, light for readability. |

### 2.3 — Section-level design recipes

**Hero Section** — NOT just a background image with centered text:
```
Option A: Split hero — image left (60%), text right (40%) with staggered animation
Option B: Full-bleed image with gradient overlay + text pinned bottom-left (not centered)
Option C: Video/animated background with frosted glass text panel
Option D: Minimal — giant typography (10rem) with no image, just brand color
```

**About/Story Section** — NOT a paragraph with an image:
```
Option A: Editorial — photo bleeds into text column, pull quote in larger type
Option B: Timeline — horizontal scroll with milestones and photos
Option C: Full-bleed photo with overlaid text card (glassmorphism or solid)
Option D: Two-column — narrative left, stacked photos right with parallax offset
```

**Gallery/Portfolio** — NOT a uniform grid:
```
Option A: Masonry layout with varied aspect ratios
Option B: Horizontal scroll carousel with peek at next item
Option C: Bento grid — mix of 1x1, 2x1, 1x2 tiles
Option D: One large featured + three small, rotating on scroll
```

**Testimonials** — NOT cards in a row:
```
Option A: Large quote typography (3rem+) with author below, one at a time
Option B: Marquee/ticker strip with continuous scroll
Option C: Overlapping cards with slight rotation (transform: rotate)
Option D: Full-section background color change for each quote
```

---

## Step 3 — Psychology-Driven Conversion Elements

Every section should serve a psychological purpose. Don't just arrange information — design for behavior.

### 3.1 — Above the fold (first 3 seconds)

The prospect must understand THREE things instantly:
1. **What this business IS** (not "Welcome to our website")
2. **Why they should care** (social proof, unique value)
3. **What to do next** (ONE clear CTA, not three)

**Cognitive load rule**: Maximum 7 words in the hero headline. The subheading does the explaining.

### 3.2 — Social proof hierarchy

| Strongest (use first) | Implementation |
|----------------------|----------------|
| Specific numbers | "4.9 stars from 287 reviews" NOT "Highly rated" |
| Named testimonials | Real name + photo + specific detail |
| Platform badges | Google/Yelp star ratings with logo |
| Before/after | Portfolio with context |

| Weakest (avoid) | Why |
|-----------------|-----|
| "Trusted by 1000+ customers" | Fabricated, unverifiable |
| Anonymous testimonials | No trust signal |
| Stock photo + quote | Obviously fake |

### 3.3 — CTA design rules

- **One primary CTA per viewport** — never two competing buttons
- **Button text should complete "I want to..."** — "Book My Session" not "Submit"
- **Urgency without fakeness** — "3 spots left this week" is fine if real. "Limited time offer!!" is not.
- **Color contrast**: CTA button should be the HIGHEST contrast element on screen
- **Sticky CTA on mobile**: Fixed bottom bar with primary action after scrolling past hero

### 3.4 — Trust signals (non-fake)

Only use trust signals that are REAL and verifiable:
- Actual Google/Yelp star rating with review count
- Real customer quotes with first name
- Years in business (if mentioned on their site)
- Specific neighborhood/location ("Serving St. Clair West since 2018")
- Professional affiliations (if real)

---

## Step 4 — Visual Polish Checklist (MANDATORY before build is complete)

### Typography
- [ ] H1 is at least 5x body font size (not 2x — that's template energy)
- [ ] At least 2 font weights in use (not just 400 and 700 — use 300, 500, 800)
- [ ] Uppercase overlines/labels with tracking >= 0.15em somewhere on the page
- [ ] Line-height for body text is 1.6-1.8 (not 1.2 or 2.0)
- [ ] Line length is 65-75 characters max (`max-w-prose` or `max-w-2xl`)

### Color & Contrast
- [ ] Visual contrast check passed (`node visual_contrast_check.mjs {slug}`)
- [ ] At least ONE dark section and ONE light section (color blocking)
- [ ] Accent color appears in exactly 3 places (CTA, hover states, one decorative element — not everywhere)
- [ ] Background images have gradient overlay or scrim for text readability

### Layout
- [ ] NO equal-height uniform card grids (use asymmetric or varied sizes)
- [ ] At least ONE section breaks the max-width (full-bleed)
- [ ] Hero text is NOT centered on desktop (left-aligned or split layout)
- [ ] Sections have VARIED vertical padding (not all `py-20`)

### Motion & Interaction
- [ ] Hover states on all interactive elements use transition (200-300ms)
- [ ] At least 3 sections have scroll-triggered entrance animations
- [ ] Images have hover effect (scale + shadow, or reveal overlay)
- [ ] Touch targets are minimum 44x44px on mobile
- [ ] `prefers-reduced-motion` is respected (wrap animations in media query)

### Photography & Content
- [ ] ALL images are from the business (never Unsplash/stock)
- [ ] Images have appropriate aspect ratios (not stretched or squished)
- [ ] Alt text on all images is descriptive (not "image1.jpg")
- [ ] Real business data: address, phone, hours, social links

### Mobile
- [ ] Tested at 375px width — nothing breaks or overflows
- [ ] Navigation collapses to hamburger menu
- [ ] Images are responsive (srcset or CSS object-fit)
- [ ] Sticky CTA bar on mobile for primary action
- [ ] Body font is minimum 16px on mobile

### The "Would a Designer Approve?" Test
- [ ] Can you name the ONE design element that makes this site memorable?
- [ ] Would you put this in a portfolio? If not, it's not done.
- [ ] Does this look DIFFERENT from the last 3 builds? If not, vary the approach.
- [ ] Show it to someone — do they say "that's a real website" or "that looks like a template"?

---

## Step 5 — Run ui-ux-pro-max Design System Generator

Before coding, run the design system generator to get tailored recommendations:

```bash
python3 ~/.claude/skills/ui-ux-pro-max/scripts/search.py "{industry} {style_keywords}" --design-system -p "{Business Name}"
```

Example for a tattoo studio:
```bash
python3 ~/.claude/skills/ui-ux-pro-max/scripts/search.py "tattoo studio portfolio dark artistic" --design-system -p "905 INK"
```

Use the output to inform:
- Style direction (glassmorphism, brutalist, editorial, etc.)
- Color palette refinement
- Typography pairing alternatives
- Landing page structure
- Animation approach
- Anti-patterns to avoid

This SUPPLEMENTS the brand bible — the brand bible defines WHAT the brand looks like, the design system defines HOW to make it look professional.
