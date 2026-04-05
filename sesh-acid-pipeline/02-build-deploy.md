# Skill 02 — Build & Deploy

## Objective
Take the first unprocessed lead from the qualified CSV, deeply analyze their current website's look & feel and tone of voice, then build a modern Next.js redesign that respects their brand identity. Push to GitHub monorepo and deploy to Vercel.

## Inputs
- `leads/qualified-leads-{latest-date}.csv` — the qualified leads
- `leads/processed.json` — list of already-processed lead slugs (create if doesn't exist)

## Step 1 — Select Lead
1. Read the most recent CSV in `leads/`
2. Read `leads/processed.json` (or create `[]` if missing)
3. Pick the first lead whose slug is NOT in processed.json
4. If all leads are processed, write status `"all_processed"` and STOP

Generate slug: lowercase business name, spaces→hyphens, remove special chars.
Example: "Mario's Pizza & Pasta" → `marios-pizza-pasta`

## Step 2 — Deep Website Analysis + Business Data
Visit the lead's current website and extract business data:
- Business info (hours, address, phone, established date)
- Services and pricing
- Artists/team members with roles and specialties
- Ratings from Yelp, Google, Facebook, etc.
- Testimonials (verbatim quotes with attribution)
- Social media handles (Instagram, Facebook, YouTube, etc.)
- Email validation (confirm CSV email matches website)

Write this to `build/{lead-slug}/analysis.json`

## Step 2.5 — Brand Bible (MANDATORY — do NOT skip)

**Spawn a sub-agent** that reads the agent definition at `agents/brand-bible-creator.md` and executes it fully. Pass it the `analysis.json` from Step 2.

The Brand Bible agent will:
1. **Deep-scrape the website** — homepage + 3 inner pages, extract ALL CSS (colors, fonts, spacing, shadows, gradients, component patterns)
2. **Take screenshots** — desktop homepage (1440px), mobile homepage (390px), one inner page
3. **Scrape social media** — Instagram bio + last 9-12 captions for brand voice, Facebook posts, visual grid aesthetic
4. **Analyze Google reviews** — how customers describe the vibe/experience
5. **Produce a comprehensive Brand Bible** at `build/{lead-slug}/brand-bible/brand-bible.json` with:
   - Full color palette (8+ colors with usage context, not just "primary/secondary")
   - Exact typography (font families, weights, sizes for every heading level)
   - Component inventory (header, hero, buttons, cards, footer, images — with exact styles)
   - Spacing system (section padding, max-width, border-radius, gaps)
   - Brand voice (personality adjectives, tone, vocabulary, sample captions)
   - Customer perception (how reviews describe the experience)
6. **Produce design directives** at `build/{lead-slug}/brand-bible/design-directives.md` with DO/DON'T rules, font pairing rationale, color usage rules, layout blueprint, and tone of voice guide

### Validation Gate
Before proceeding to Step 3, verify:
- [ ] `brand-bible/brand-bible.json` exists and has `visualIdentity.colorPalette` with 8+ entries
- [ ] `brand-bible/brand-bible.json` has `visualIdentity.typography` with actual font names (not "serif")
- [ ] `brand-bible/design-directives.md` exists with DO and DON'T sections
- [ ] At least 2 screenshots saved in `brand-bible/screenshots/`
- [ ] `brandVoice` section has social media samples
- [ ] **`people[]` array exists** — every named person from the website has an entry (even if `photoVerified: false`)
- [ ] **Owner/primary person has a `profilePhotoUrl`** that is not null
- [ ] **`images` object exists** with `hero`, `logo`, and at least 3 entries in `food[]` or `gallery[]` with `verified: true`

If any check fails, re-run the brand bible agent (including `sub-skill-people.md`). Do NOT proceed to build without a complete brand bible.

## Step 3 — Design & Build (Brand Bible-Driven)

**READ the Brand Bible AND all design skills FIRST.** Before writing a single line of code:
1. Read `build/{lead-slug}/brand-bible/brand-bible.json` cover to cover
2. Read `build/{lead-slug}/brand-bible/design-directives.md` cover to cover
3. Read `skills/03-design-personality.md` — answer the 5 personality questions, choose Layout Personality (A/B/C/D)
4. Run the 4 sub-skill reviews (mandatory, in order):
   - **`skills/sub-skill-design-quality.md`** — FIRST. Anti-template gate. Choose bold aesthetic direction, define the "one thing," apply layout composition rules, psychology-driven conversion elements. Run `ui-ux-pro-max` design system generator.
   - **`skills/sub-skill-designer.md`** — color, typography, layout personality check
   - **`skills/sub-skill-ui.md`** — header/logo contrast, buttons, images, footer, watermark
   - **`skills/sub-skill-ux.md`** — above-fold clarity, CTA hierarchy, real content, mobile
5. Write the combined review output as comments at the top of page.tsx before any component code

**Critical from sub-skill-ui.md:** Logo color vs header background MUST be checked before writing Header.tsx:
- White/light logo → header MUST be dark (≥ #333)
- Dark logo → header can be light, but verify contrast
- Never use `invert` on a logo that is already the correct color — verify the PNG's actual colors first

**The goal is a site that feels like it BELONGS to that specific business — not a template with swapped colors.**

### Step 3.0 — Generate brand-tokens.ts (MANDATORY before any component code)

Before writing any component, generate a `src/lib/brand-tokens.ts` file directly from the brand bible. This file is the **single source of truth** for all design tokens in the build. If this file does not exist, the build is not allowed to proceed.

1. Read `build/{lead-slug}/brand-bible/brand-bible.json`
2. Create `build/{lead-slug}/src/lib/brand-tokens.ts` with this structure, populated from brand bible values:

```typescript
// AUTO-GENERATED from brand-bible.json — DO NOT EDIT BY HAND
// Regenerate by re-running Step 3.0

export const BRAND = {
  slug: '<meta.slug>',

  colors: {
    primary: '<colorPalette.primary.hex>',
    secondary: '<colorPalette.secondary.hex>',
    bgMain: '<colorPalette.background.main.hex>',
    bgAlt: '<colorPalette.background.alternate.hex>',
    bgCard: '<colorPalette.background.card.hex>',
    textHeading: '<colorPalette.text.heading.hex>',
    textBody: '<colorPalette.text.body.hex>',
    textMuted: '<colorPalette.text.muted.hex>',
    overallTheme: '<colorPalette.overallTheme>',
  },

  fonts: {
    heading: '<typography.headingFont.family>',
    headingFallback: '<typography.headingFont.fallback>',
    headingWeights: <typography.headingFont.weights>,
    body: '<typography.bodyFont.family>',
    bodyFallback: '<typography.bodyFont.fallback>',
    bodyWeights: <typography.bodyFont.weights>,
    navWeight: <typography.navFont.weight>,
    navTextTransform: '<typography.navFont.textTransform>',
    navLetterSpacing: '<typography.navFont.letterSpacing>',
  },

  spacing: {
    sectionPadding: '<spacing.sectionPadding>',
    contentMaxWidth: '<spacing.contentMaxWidth>',
    cardGap: '<spacing.cardGap>',
    radiusButtons: '<spacing.borderRadius.buttons>',
    radiusCards: '<spacing.borderRadius.cards>',
    radiusImages: '<spacing.borderRadius.images>',
  },

  archetype: '<archetype.type>',
  sectionOrder: <archetype.sectionOrder>,

  voice: {
    tone: '<brandVoice.tone>',
    personality: <brandVoice.personality>,
    primaryCTA: '<contentStrategy.primaryCTA>',
  },

  // Generated from brand-bible.json people[] — real photos from public Instagram profiles
  // Use these in team/artist sections instead of Unsplash or placeholder initials
  people: <people[]>,  // array of { name, role, profilePhotoUrl, portfolioPhotos, bio, instagram, featured }

  // Generated from brand-bible.json images — real photos from the business website/CDN
  // Use these EVERYWHERE: hero backgrounds, menu item cards, gallery grids, about sections
  // A build with empty placeholder divs instead of real photos is an automatic fail
  images: <images>,  // { hero, logo, food: [{url, description}], gallery: [...], atmosphere: [...] }

  // Demographic & language data from brand bible Phase 2.7
  demographics: {
    primaryLanguage: 'en',
    secondaryLanguage: '<demographics.secondaryLanguage or null>',  // 'es', 'pt', 'ko', 'ja', 'zh', or null
    neighborhood: '<demographics.neighborhood>',
    targetCustomer: '<demographics.targetCustomer>',
  },
} as const;
```

3. Update `tailwind.config.ts` to import from `brand-tokens.ts` instead of hardcoding values:
```typescript
import { BRAND } from './src/lib/brand-tokens';

// In theme.extend:
colors: {
  brand: {
    primary: BRAND.colors.primary,
    secondary: BRAND.colors.secondary,
    bgMain: BRAND.colors.bgMain,
    bgAlt: BRAND.colors.bgAlt,
    bgCard: BRAND.colors.bgCard,
    textHeading: BRAND.colors.textHeading,
    textBody: BRAND.colors.textBody,
    textMuted: BRAND.colors.textMuted,
  }
},
fontFamily: {
  heading: [BRAND.fonts.heading, BRAND.fonts.headingFallback],
  body: [BRAND.fonts.body, BRAND.fonts.bodyFallback],
}
```

4. Every component that uses design tokens MUST import from `src/lib/brand-tokens` — never hardcode hex values or font names directly.

**Enforcement**: The score gate at Step 5.5 catches generic fonts in tailwind.config. This step makes it structurally impossible to write generic fonts by hand — the config imports from a file that only exists if the brand bible was read.

### CRITICAL: The Brand Bible is your spec, not a suggestion
Every design decision must trace back to the brand bible. If you're about to use a color, font, border-radius, or layout pattern — check the brand bible first. If the brand bible says sharp corners, you use sharp corners. If it says uppercase nav with wide letter-spacing, that's what you build.

### BANNED DEFAULTS — Never use these without explicit brand bible evidence

The following are the most common generic defaults that destroy brand fidelity. They are PROHIBITED unless the brand bible explicitly names them:

#### Fonts (NEVER default to these)
- **Playfair Display** — detected in 4/7 builds; not found on any real business site analyzed
- **Roboto** — generic Android default; only acceptable if CSS forensics found it on their actual site
- **Inter** — UI framework default; not a brand font choice
- If the brand bible has no font data (empty or "unidentified"), re-run the brand bible agent. Do NOT fall back to these three.

#### Theme (NEVER assume without brand bible confirmation)
- **Dark mode** — 3 of 4 dark-mode builds were wrong; real sites were light-themed. Check `visualIdentity.colorPalette.overallTheme` before writing a single dark bg class.
- Rule: if `overallTheme` contains "light", "clean", "bright", or "white" → the page background MUST be light.

#### Images (NEVER use empty placeholders or wrong-business photos)
- **Empty bg-color divs** — a restaurant menu card with `backgroundColor: '#e8e0d4'` and no food photo is WORTHLESS. The prospect sees a blank box and closes the tab.
- **Unsplash food photos** — generic stock tacos are obvious fakes. Use `brand-bible.json images.food[]` URLs from their actual website/CDN.
- **Unsplash people** — see sub-skill-people.md. Initials on brand color > stock portrait of a random person.
- Read `images` from brand-tokens.ts and use them in: hero `backgroundImage`, menu card images, about section photos, gallery grids. Every visual section MUST have a real image or be omitted entirely.

#### Sections (NEVER add these unless they exist on the real site)
- **Stats/metrics bar** — "10+ years experience | 500+ clients | 4.9 stars" — added in 3/7 builds; fabricated filler that makes the site feel fake
- **Team grid with headshots** — only include if the real site has team members listed
- **"As Seen In" media logos** — only include if the real site has press mentions

#### Artist/Team Photos (CRITICAL)
- When rendering artist cards, ONLY use `profilePhoto` (or `profilePhotoUrl`) for the main artist image
- If `profilePhoto` is null, render initials on brand-color background — NEVER fall back to `portfolioPhotos[0]`
- `portfolioPhotos` should ONLY appear in a "Recent Work" grid below the artist card, never as the profile image
- A tattoo/work photo where you expect a face = worse than no photo at all

### Typography (from brand bible)
- **DO NOT default to Playfair Display + Roboto** — use the exact fonts identified in `visualIdentity.typography`
- Import from Google Fonts using the URL in `headingFont.googleFontsImport` and `bodyFont.googleFontsImport`
- Match the exact weight, size, and line-height values from `typography.scale`
- Match the nav font style (textTransform, letterSpacing) from `typography.navFont`

### Colors (from brand bible)
- Map every color from `visualIdentity.colorPalette` into `tailwind.config.ts` as brand tokens
- Use the correct color for each purpose (the `usage` field tells you where each color goes)
- Implement gradients from `colorPalette.gradients` exactly
- Implement shadows from `colorPalette.shadows` exactly
- Follow the `overallTheme` — a "dark-moody" site should feel dark throughout, not have random light sections

### Components (from brand bible)
- Build the header exactly as described in `components.header` (sticky vs fixed, transparent on hero, etc.)
- Build the hero exactly as described in `components.hero` (full-bleed vs split, overlay style, text alignment)
- Style buttons exactly as described in `components.buttons` (border-radius, padding, text-transform, hover)
- Style cards exactly as described in `components.cards` (shadow, border, hover effect)
- Build the footer as described in `components.footer`
- Treat images as described in `components.images` (border-radius, hover, aspect-ratio)

### Spacing (from brand bible)
- Use `spacing.sectionPadding` for vertical section rhythm
- Use `spacing.contentMaxWidth` for content containers
- Use `spacing.cardGap` for grid gaps
- Use `spacing.borderRadius` values for buttons, cards, and images

### Voice & Content (from brand bible)
- Write headlines that match `brandVoice.messagingPatterns.headlines`
- Write CTAs that match `brandVoice.messagingPatterns.ctas`
- Use vocabulary from `brandVoice.vocabulary.wordsTheyUse`
- Avoid words from `brandVoice.vocabulary.wordsTheyAvoid`
- Match the overall tone from `brandVoice.tone`

### Layout (from design directives)
- Follow the Layout Blueprint in `design-directives.md`
- Respect every item in the DO list
- Avoid every item in the DON'T list

### Must Modernize (while staying on-brand)
- Responsive mobile-first layout
- Proper whitespace and visual breathing room (but matching THEIR spacing rhythm, not generic)
- Smooth scroll, subtle animations matching `animations` section
- Fast loading — optimize all assets
- Accessible — proper contrast, alt texts, semantic HTML

### Must Include — AI Chatbot Demo (MANDATORY on every build)

Every site MUST include a floating chatbot widget in the bottom-right corner. This is a **demo** — it shows the prospect what an AI-powered customer assistant would look like on their site.

**Chatbot Component Requirements:**
1. **Floating button**: Circular, uses brand `primary` color, bottom-right corner, 60px diameter, chat bubble icon (SVG)
2. **Chat window**: Opens on click, 380px wide × 500px tall, slides up from button
3. **Header**: Brand primary color background, white text: "AI Assistant — {Business Name}"
4. **Initial message** (auto-shown when opened):
   - For English-only sites: "Hi! I'm {Business Name}'s AI assistant. I can help you with orders, reservations, and questions about our menu. How can I help? 🤖"
   - For bilingual sites (e.g., Spanish): Show BOTH languages:
     - "Hi! I'm {Business Name}'s AI assistant. I can help with orders and questions!"
     - "¡Hola! Soy el asistente de IA de {Business Name}. Puedo ayudarte con pedidos y consultas."
5. **Demo behavior**: The chat input field should be styled but when the user types and sends, show a response: "This is a demo preview. Once activated, I'll be powered by AI to handle real orders, answer FAQs, and assist your customers 24/7 in {primary language} and {secondary language}."
6. **"Powered by AI" badge**: Small text below the chat: "Powered by AI · Sesh"
7. **Dismissable**: X button to close the chat window (button stays visible)

**Implementation**: Create a `ChatbotDemo.tsx` client component (`'use client'` directive). Use brand colors from `brand-tokens.ts`. Keep it self-contained — no external dependencies.

**Language logic**: Read `demographics.secondaryLanguage` from brand-bible.json:
- If `secondaryLanguage` is not null → bilingual greeting
- If null → English only

### Must Include — Multilingual Support

If `demographics.secondaryLanguage` is set in the brand bible:
1. **Language toggle**: Small button in the header/nav (e.g., "EN | ES") that switches UI labels
2. **Section labels bilingual**: Key section headings should have both languages. E.g.:
   - "Our Menu / Nuestro Menú"
   - "About Us / Sobre Nosotros"
   - "Contact / Contacto"
3. **Content stays in English by default** — the secondary language is for labels, headings, and the chatbot greeting only (not full page translation)
4. **Footer note**: "We serve our community in English and {language name}"

### Must Include — Social Media Icons (NOT text links)

All social media links MUST use SVG icons, never text names. Create inline SVGs for each platform:

```tsx
// Instagram icon (SVG inline)
<a href="{instagram_url}" aria-label="Instagram">
  <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/>
  </svg>
</a>

// Facebook icon
<svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
</svg>

// TikTok, YouTube, Twitter/X, Google Maps — same pattern
```

Use these SVG icons in:
- **Header/nav** social links
- **Footer** social links
- **Contact page** social links
- **Outreach emails** (footer social row)

NEVER write "Instagram" or "Facebook" as text links. Always the icon.

### Must Include
- **Watermark banner** at the top of every page:
  ```
  UNOFFICIAL PREVIEW — This site was built by Sesh ACID as a complimentary redesign preview for {Business Name}. Not affiliated with {Business Name}.
  ```
  Style: Fixed top banner, semi-transparent dark background, white text, small font, dismissable with X button but reappears on page change.

### Page Architecture (CRITICAL — no template behavior)

**EVERY nav link MUST point to a dedicated route (`/artists`, `/gallery`, `/services`, `/contact`). NEVER use anchor links (`/#section`, `#gallery`, `#artists`).** Anchor-link scroll-to-section is the #1 signal of a cheap Wix/Squarespace template. We are selling custom-built sites — they must FEEL custom.

#### BANNED: Anchor Navigation
- `href="/#gallery"` → BANNED. Create `/gallery/page.tsx`
- `href="/#artists"` → BANNED. Create `/artists/page.tsx`
- `href="/#services"` → BANNED. Create `/services/page.tsx`
- `href="#anything"` → BANNED. Every nav item = its own page with its own URL
- **The scorer checks for this** — any `href="#` in Header.tsx = automatic point deduction

#### BANNED: Homepage Section Dump
The homepage is NOT a dump of every section. A homepage that scrolls through Artists → Gallery → Services → Testimonials → Contact is a single-page template, not a multi-page custom website.

**Homepage should be:** Hero + 1-2 brief teasers/previews (e.g., 3-4 gallery images linking to `/gallery`) + primary CTA. That's it. Keep it tight — make people CLICK to explore.

#### Required Pages (minimum 5 for portfolio businesses, 4 for others)

**Portfolio businesses** (tattoo, salon, photography, design):
| Page | Route | Content |
|------|-------|---------|
| Home | `/` | Hero + gallery teaser (3-4 images) + CTA. NOT all sections dumped. |
| Artists/Team | `/artists` | Full profiles: photo, name, role, bio, specialties, Instagram, portfolio samples. Each artist gets real space. |
| Gallery | `/gallery` | Full portfolio grid. Filterable if possible. This is where you show off. |
| Services | `/services` | Detailed service descriptions, pricing if available, process explanation. |
| Contact | `/contact` | Map, hours, booking CTA, all contact methods. |

**Service businesses** (restaurant, clinic, law, fitness):
| Page | Route | Content |
|------|-------|---------|
| Home | `/` | Hero + featured items teaser + CTA. Tight. |
| About | `/about` | Story, team, values, neighborhood connection. |
| Menu/Services | `/menu` or `/services` | Full menu or service list with descriptions. |
| Contact | `/contact` | Map, hours, booking/reservation CTA. |

**Each page must have SUBSTANTIAL unique content** — not just a relocated section component. If a page would only be 200px tall, it doesn't deserve to be a page. Combine it or expand it.

### Tech Stack
- **Framework**: Next.js 14+ with App Router
- **Styling**: Tailwind CSS (config driven by brand bible colors/fonts/spacing)
- **Fonts**: Google Fonts — **exact fonts from brand bible** (not default Playfair/Roboto)
- **Images**: Use real business images from `brand-bible.json images{}`. NEVER use Unsplash stock. NEVER use empty bg-color placeholder divs.
- **Content**: Rewrite their content in a modernized tone matching `brandVoice`. Do NOT copy their text verbatim — paraphrase and improve using their vocabulary and tone.
- **Pages**: See Page Architecture above. Minimum 4-5 pages, all with dedicated routes.

### Project Structure
```
build/{lead-slug}/
├── analysis.json
├── brand-bible/
│   ├── brand-bible.json
│   ├── design-directives.md
│   └── screenshots/
├── package.json
├── next.config.mjs
├── tailwind.config.ts
├── src/
│   ├── lib/
│   │   └── brand-tokens.ts          # Single source of truth — generated from brand-bible.json
│   ├── app/
│   │   ├── layout.tsx                # Header, Footer, WatermarkBanner, ChatbotDemo
│   │   ├── page.tsx                  # Homepage: Hero + teaser + CTA (NOT section dump)
│   │   ├── artists/page.tsx          # Full artist/team profiles (portfolio businesses)
│   │   ├── gallery/page.tsx          # Full portfolio grid (portfolio businesses)
│   │   ├── about/page.tsx            # Story, team, values (service businesses)
│   │   ├── services/page.tsx         # OR menu/page.tsx — full service/menu listing
│   │   └── contact/page.tsx          # Map, hours, booking CTA
│   └── components/
│       ├── Header.tsx                # Nav with REAL routes only — zero anchor links
│       ├── Footer.tsx
│       ├── WatermarkBanner.tsx
│       ├── ChatbotDemo.tsx
│       └── ...
└── tsconfig.json
```

## Step 4 — Push to GitHub
1. Ensure the monorepo `Sesh_ACID_Websites` exists on GitHub (create if not)
2. Copy the built project to the monorepo: `sites/{lead-slug}/`
3. Git add, commit with message: `feat: add redesign preview for {Business Name}`
4. Push to main

```bash
cd ~/Sesh_ACID_Websites
mkdir -p sites/{lead-slug}
cp -r /path/to/build/{lead-slug}/* sites/{lead-slug}/
git add sites/{lead-slug}
git commit -m "feat: add redesign preview for {Business Name}"
git push origin main
```

## Step 5 — Deploy to Vercel
1. Navigate to the project directory within the monorepo
2. Deploy using Vercel CLI:
```bash
cd sites/{lead-slug}
vercel --yes --name sesh-acid-{lead-slug}
```
3. Capture the deployment URL from output
4. Verify URL responds HTTP 200
5. If 200: proceed. If not: wait 30 seconds and retry (max 3 retries)

## Step 5.4 — Visual Contrast Check (MANDATORY — runs BEFORE brand fidelity gate)

Run the visual contrast checker:
```bash
node visual_contrast_check.mjs {lead-slug}
```
Run this from the pipeline root directory.

This tool:
1. Starts the build's dev server
2. Screenshots every page with Playwright (1440px viewport)
3. Samples dominant colors from hero and mid-page regions using sharp
4. Compares text colors from brand-tokens against actual background colors
5. Calculates WCAG contrast ratios (3:1 minimum for headings, 4.5:1 for body text)
6. Detects text-on-image without overlay

**Fallback — if script cannot run (no browser / no Playwright):**
- Write `"contrast_check": "score_gate_skipped"` into `status/phase2.json`
- Do NOT fabricate a score or invent pass/fail results
- Proceed to Step 5.5 but note in status that contrast was not validated

**If CRITICAL issues found: STOP. Do NOT proceed to Step 5.5 until fixed.**
- Dark text on dark backgrounds → fix by:
  - Adding `textLight` / `textHeadingLight` colors to brand-tokens.ts for dark sections
  - Using light text classes on hero sections and any section with `backgroundImage`
  - Adding semi-transparent overlays (`bg-black/50`) on background images
- Light text on light backgrounds → use dark text variants
- Text on image without overlay → add `bg-gradient-to-b from-black/60` or similar
- After fixing: run `npm run build` again, then re-run `visual_contrast_check.mjs`
- Maximum 3 fix cycles before escalating as error

**If only WARNINGS:** proceed but note them for polish.

Screenshots are saved to `brand-bible/contrast-check/` for manual review.

## Step 5.5 — Brand Fidelity Gate (MANDATORY — do NOT skip)

Run the brand fidelity scorer against the build:
```bash
node karpathy_score.mjs {lead-slug}
```
Run this from the pipeline root directory (same directory as this file).

Capture the `brand_fidelity: N` line from output.

**If score < 130: STOP. Do NOT proceed to Step 6.**
- Write failure details to `status/phase2.json` with `"status": "score_gate_failed"` and `"brand_fidelity_score": N`
- The build is considered incomplete until the score reaches 130+/135
- Common fixes:
  - Missing brand bible → re-run brand bible agent (Step 2.5)
  - Generic fonts detected → update tailwind.config to use brand bible fonts
  - Fake stats bar → remove the stats section from homepage
  - Dark mode without validation → check brand bible `overallTheme` and fix
- After applying fixes, run `npm run build` again, then re-run this scorer
- Maximum 3 fix-and-rescore cycles before escalating as error

**If score >= 130: proceed to Step 6.**
- Write `"brand_fidelity_score": N` into `status/phase2.json` alongside the existing fields

## Step 6 — Update Tracking
Add lead slug to `leads/processed.json`:
```json
["marios-pizza-pasta", "bright-smile-dental"]
```

## Step 7 — Write Status
Write to `status/phase2.json`:
```json
{
  "status": "complete",
  "timestamp": "ISO-8601",
  "lead": {
    "business_name": "Mario's Pizza & Pasta",
    "slug": "marios-pizza-pasta",
    "website_url": "https://mariospizza.ca",
    "contact_email": "mario@mariospizza.ca"
  },
  "github_repo": "Sesh_ACID_Websites",
  "github_path": "sites/marios-pizza-pasta",
  "vercel_url": "https://sesh-acid-marios-pizza-pasta.vercel.app",
  "vercel_status": 200,
  "pages_built": ["home", "about", "menu", "contact"],
  "design_tokens": {
    "primary_color": "#2D5A3D",
    "secondary_color": "#F4E7D1",
    "font_heading": "Playfair Display",
    "font_body": "Inter"
  }
}
```

## Important
- Do NOT copy images from the lead's website — use Unsplash placeholders or CSS patterns
- Do NOT copy their text verbatim — paraphrase and modernize
- The watermark banner is NON-NEGOTIABLE — it must be on every page
- Run `npm run build` before deploying to catch build errors
- If build fails, fix errors and retry (max 3 attempts)
