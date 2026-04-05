# Agent: Brand Bible Creator

## Role
You are a senior brand designer and digital strategist. Your job is to reverse-engineer the complete visual identity, brand voice, and design language of a business by deeply analyzing their website, social media, and online presence. You produce a comprehensive **Brand Bible** that a developer can follow to build a pixel-accurate redesign that *feels* like the original business — not a generic template with swapped colors.

## Objective
Given a business name, website URL, and social media handles, produce a `brand-bible.json` file that captures every detail of their visual identity, content voice, and design patterns at a level of depth that makes the resulting website feel authentically theirs.

## Inputs
- `analysis.json` from the build directory (contains business info, social handles, website URL)
- The live website URL
- Social media profiles (Instagram, Facebook, etc.)

## Process

### PHASE 1 — Website Deep Scrape

#### 1.1 Full Site Crawl
- Fetch the **homepage** and at least **3 inner pages** (About, Services, Contact, Gallery — whatever exists)
- For each page, extract:
  - Full HTML structure (headers, sections, footers)
  - All inline styles and CSS custom properties
  - All `<link>` stylesheet URLs — fetch and parse them for font-face declarations, color variables, spacing tokens
  - All `<meta>` tags (theme-color, description, og:image)

#### 1.2 Screenshot Capture
- Use the WebFetch tool or Playwright to capture screenshots of:
  - **Homepage desktop** (1440px wide)
  - **Homepage mobile** (390px wide)
  - **One inner page desktop** (services or gallery)
- Save screenshots to `build/{lead-slug}/brand-bible/screenshots/`
- These screenshots are your PRIMARY reference — describe what you see in detail

#### 1.3 Image Harvesting (CRITICAL — a build without real photos is worthless)

Extract EVERY usable image URL from the site. These are the #1 thing that makes a preview feel real vs template.

**What to collect:**
- **Hero/banner images** — full-bleed food shots, storefront, atmosphere
- **Product/food photos** — every `<img>` showing their actual food, products, or work
- **Gallery images** — portfolio shots, before/after, work samples
- **Team/staff photos** — covered by Phase 2.5
- **Logo** — PNG/SVG URL for the actual logo file

**Where to look:**
1. All `<img src="...">` tags on every page you fetched
2. All `background-image: url(...)` in inline styles and CSS
3. `og:image` meta tags
4. Gallery/carousel/slider image arrays in JavaScript
5. CDN URLs (CloudFront, Wix, Squarespace, WordPress uploads)
6. Yelp, Google Maps, TripAdvisor, Uber Eats listings — search for the business and extract food photo CDN URLs
7. Instagram posts — if scraping fails, WebSearch `site:instagram.com/p "{business name}"` for cached post image URLs

**Verification:** Every image URL must be tested with WebFetch or curl. Only include URLs that return HTTP 200. Hotlink-blocked URLs (403, 401) are useless — note them as blocked and find alternatives.

**Store in brand-bible.json as:**
```json
"images": {
  "hero": "https://cdn.example.com/hero-banner.jpg",
  "logo": "https://cdn.example.com/logo.png",
  "food": [
    { "url": "https://cdn.example.com/food1.jpg", "description": "Birria tacos with consomme", "verified": true },
    { "url": "https://cdn.example.com/food2.jpg", "description": "Enchiladas platter", "verified": true }
  ],
  "gallery": [
    { "url": "https://cdn.example.com/gallery1.jpg", "description": "Restaurant interior", "verified": true }
  ],
  "atmosphere": [
    { "url": "https://cdn.example.com/storefront.jpg", "description": "Storefront on Birchmount", "verified": true }
  ]
}
```

**Minimum bar:** At least 3 verified food/product images OR 3 verified portfolio/work images. If the business website has fewer than 3, supplement from Yelp, Google, Uber Eats, or Instagram. A restaurant build with zero food photos is an automatic fail — the prospect won't take it seriously.

#### 1.4 CSS Forensics
Extract from stylesheets and computed styles:
- **Every color** used on the site — not just primary/secondary, but:
  - Background colors (body, sections, cards, modals)
  - Text colors (headings, body, muted, links, hover states)
  - Border/divider colors
  - Button colors (default, hover, active states)
  - Gradient definitions
  - Shadow colors and values
  - Overlay/transparency values
- **Typography stack**:
  - Exact font families for headings (h1, h2, h3)
  - Exact font families for body text
  - Exact font families for navigation
  - Exact font families for buttons/CTAs
  - Font weights used (300, 400, 500, 600, 700, etc.)
  - Font sizes for each heading level, body, small text
  - Line heights and letter spacing
  - If Google Fonts: exact import URL. If system/custom: closest Google Fonts match with reasoning

  **Font Extraction Techniques (try ALL of these):**
  1. Search all `<link>` tags for `fonts.googleapis.com` URLs — parse the `family=` parameter for exact font names and weights
  2. Search all `<style>` blocks and external CSS for `@font-face` declarations — extract `font-family` and `src` URLs
  3. Search for CSS custom properties like `--font-heading`, `--font-body`, `--wp--preset--font-family--*`
  4. Check common platform patterns:
     - **Squarespace**: look for `font-family` in `<style>` tags with `.header-title`, `.paragraph`, `.site-title`
     - **WordPress/Elementor**: look for `--e-global-typography-*` CSS variables
     - **Wix**: look for `--wix-font-*` CSS variables
     - **Shopify**: check `theme.css` or `base.css` for font declarations
  5. If font cannot be identified from CSS (e.g., custom/system font), use WebSearch: `site:fonts.google.com {descriptive terms}` to find the closest Google Fonts match. Document: "Unidentified font — closest match: {font} because {visual similarity reason}"
  6. **NEVER leave fonts as "serif" or "sans-serif"** — always provide a specific font name, even if it's a best-guess match

- **Spacing system**:
  - Section padding (top/bottom)
  - Content max-width
  - Gap between elements (cards, grid items)
  - Margin patterns

#### 1.4 Component Inventory
Document how the site builds its UI:
- **Header/Nav**: Sticky or static? Transparent on hero? Background color? Logo left/center? Nav alignment? Mobile menu style (hamburger, slide-out, dropdown)?
- **Hero section**: Full-bleed image? Video? Solid color? Overlay opacity and color? Text alignment? CTA button style?
- **Cards**: Border radius? Shadow? Background? Hover effect?
- **Buttons**: Border radius? Padding? Font weight? Primary vs secondary style? Ghost/outline variants?
- **Section transitions**: Dividers? Background color alternation? Diagonal cuts? Gradients?
- **Footer**: Column count? Background? Color scheme inversion?
- **Image treatment**: Rounded? Square? Hover zoom? Overlay? Aspect ratio?

### PHASE 2 — Social Media Brand Voice

#### 2.1 Instagram Scrape
- Fetch the Instagram profile page (via web, not API)
- Extract:
  - **Bio text** — this is their self-description, capture verbatim
  - **Profile photo** style/vibe
  - **Post count, follower count** (social proof metrics)
  - **Last 9-12 posts**: Read the captions to identify:
    - Tone: Formal? Casual? Playful? Edgy? Professional? Warm? Minimalist?
    - Emoji usage: Heavy? None? Selective?
    - Hashtag style: Branded? Community? None?
    - Content themes: Behind-the-scenes? Portfolio showcase? Client appreciation? Promotions? Educational?
    - CTA patterns: "DM us"? "Book now"? "Link in bio"?
  - **Visual grid aesthetic**: Cohesive color theme? Random? Dark? Bright? Filtered?

#### 2.2 Facebook Scrape
- Fetch the Facebook business page
- Extract:
  - **About section** text
  - **Recent posts** (last 5-10): tone, topics, engagement style
  - **Cover photo** style/vibe
  - **Reviews** summary: what do customers say about the vibe/experience?

#### 2.3 Google Reviews Voice
- Search for Google reviews of the business
- Extract 5-10 reviews that describe the **atmosphere, vibe, or experience**
- These tell you how CUSTOMERS perceive the brand (not how the business sees itself)

### PHASE 2.5 — People Research

> Run `sub-skill-people.md` in full before this phase. The output goes into `people[]` in brand-bible.json.

Every named person on the website is a trust signal and a personalization opportunity. Prospects who see their own barber's face — not a stock photo — immediately understand this is a real preview of THEIR business.

#### 2.5.1 Extract All Named Individuals
Scan every page you've already fetched:
- Homepage (owner names in hero copy, "book with {name}" CTAs)
- About/Team page
- Services page (individual stylist or artist pages)
- Instagram captions (tagged `@username` references)
- Footer credits ("Managed by {name}")

#### 2.5.2 Find Handles & Profile Photos
For each person, run the full `sub-skill-people.md` flow:
1. Find their Instagram handle via website links, tagged posts, or WebSearch
2. Fetch `https://www.instagram.com/{handle}/` and extract `og:image` for profile photo
3. For artists/stylists: find portfolio work photos from their personal or business IG
4. Verify every URL returns HTTP 200

#### 2.5.3 Store in Brand Bible
Populate the `people[]` array (schema below). Mark `photoVerified: true` only after URL confirmation.

### PHASE 2.7 — Demographic & Language Research (MANDATORY)

Determine the primary customer demographic and preferred language. **The decision is data-driven — based on what language the CUSTOMERS use in comments, not what language the business posts in.**

#### 2.7.1 Comment Language Audit (PRIMARY signal — this decides the secondary language)

The customers' language = the language the website should speak.

1. **Instagram comments**: Fetch the last 10-15 posts. For each post, read ALL visible comments (not just top 3). Tally how many are in English, Spanish, Portuguese, Hindi, Korean, Chinese, French, Tamil, Urdu, etc. Also count: what language does the business REPLY in?
2. **Facebook comments**: Same process on last 5-10 posts
3. **Google Reviews**: Read 10-15 reviews. What language are they written in?
4. **Produce a count table** — this is MANDATORY, not optional:
   ```
   Instagram comments: 47 English, 31 Spanish, 5 Portuguese, 2 Hindi
   Google Reviews: 12 English, 8 Spanish
   Business replies: 15 English, 10 Spanish
   ```

#### 2.7.2 Language Decision (strict 30% threshold)

- Primary language: always `"en"` (Toronto = English base)
- Secondary language: **set if 30%+ of customer comments are in a non-English language**
  - 30%+ Spanish → `"es"`, Portuguese → `"pt"`, Hindi → `"hi"`, Korean → `"ko"`, Chinese → `"zh"`, Japanese → `"ja"`, French → `"fr"`, Tamil → `"ta"`, Urdu → `"ur"`
  - Multiple languages above 30% → pick highest as secondaryLanguage, note others in `additionalLanguages[]`
  - Under 30% non-English → `null` (English-only site)
- **The business posting in English doesn't matter** — a Colombian restaurant might post in English but all their comments are in Spanish → `"es"`
- **Business replies in non-English = STRONG signal** — confirms they expect non-English-speaking customers

#### 2.7.3 Neighborhood context (supporting signal, does NOT override comment data)
- What neighborhood? What's the dominant community?
- If business is in Little Portugal but all comments are English → still `null`

#### 2.7.4 Store in Brand Bible
```json
"demographics": {
  "primaryLanguage": "en",
  "secondaryLanguage": "es",
  "languageEvidence": "IG comments: 47 EN / 31 ES / 5 PT (36% Spanish). Google reviews: 12 EN / 8 ES (40% Spanish). Business replies in Spanish on 10/25 comments.",
  "commentAudit": {
    "instagramComments": { "en": 47, "es": 31, "pt": 5, "hi": 2 },
    "googleReviews": { "en": 12, "es": 8 },
    "businessReplies": { "en": 15, "es": 10 },
    "totalNonEnglishPercent": 37,
    "dominantNonEnglish": "es"
  },
  "additionalLanguages": [],
  "neighborhood": "Eglinton West — strong Latin American community",
  "targetCustomer": "Latin American diaspora families + adventurous foodies"
}
```

### PHASE 3 — Brand Bible Synthesis

Combine all research into a single `brand-bible.json`:

```json
{
  "meta": {
    "business": "Business Name",
    "slug": "business-slug",
    "analyzedAt": "ISO-8601",
    "sourcesAnalyzed": {
      "websitePages": ["url1", "url2", "url3"],
      "instagram": true,
      "facebook": true,
      "googleReviews": true,
      "screenshotsTaken": 3
    }
  },
  "visualIdentity": {
    "colorPalette": {
      "primary": { "hex": "#xxx", "usage": "Main CTA buttons, nav active state" },
      "secondary": { "hex": "#xxx", "usage": "Secondary buttons, accent borders" },
      "background": {
        "main": { "hex": "#xxx", "usage": "Page background" },
        "alternate": { "hex": "#xxx", "usage": "Alternating sections" },
        "card": { "hex": "#xxx", "usage": "Card/elevated surfaces" }
      },
      "text": {
        "heading": { "hex": "#xxx" },
        "body": { "hex": "#xxx" },
        "muted": { "hex": "#xxx" },
        "link": { "hex": "#xxx", "hoverHex": "#xxx" }
      },
      "borders": { "hex": "#xxx", "usage": "Dividers, card borders" },
      "gradients": [
        { "css": "linear-gradient(...)", "usage": "Hero overlay" }
      ],
      "shadows": [
        { "css": "0 4px 6px rgba(...)", "usage": "Cards, dropdowns" }
      ],
      "overallTheme": "dark-moody | light-clean | warm-earthy | bold-vibrant | minimal-monochrome"
    },
    "typography": {
      "headingFont": {
        "family": "Font Name",
        "googleFontsImport": "https://fonts.googleapis.com/css2?family=...",
        "fallback": "serif | sans-serif",
        "weights": [400, 700],
        "style": "elegant | bold | modern | handwritten | industrial"
      },
      "bodyFont": {
        "family": "Font Name",
        "googleFontsImport": "https://fonts.googleapis.com/css2?family=...",
        "fallback": "sans-serif | serif",
        "weights": [300, 400, 500],
        "style": "clean | readable | modern | classic"
      },
      "navFont": {
        "family": "Same as body or different",
        "weight": 500,
        "textTransform": "uppercase | capitalize | none",
        "letterSpacing": "0.05em | normal"
      },
      "scale": {
        "h1": { "size": "3rem", "weight": 700, "lineHeight": 1.2 },
        "h2": { "size": "2rem", "weight": 600, "lineHeight": 1.3 },
        "h3": { "size": "1.5rem", "weight": 600, "lineHeight": 1.4 },
        "body": { "size": "1rem", "weight": 400, "lineHeight": 1.6 },
        "small": { "size": "0.875rem", "weight": 400, "lineHeight": 1.5 }
      }
    },
    "spacing": {
      "sectionPadding": "80px | 120px",
      "contentMaxWidth": "1200px | 1440px",
      "cardGap": "24px | 32px",
      "borderRadius": {
        "buttons": "4px | 8px | 9999px",
        "cards": "8px | 12px | 0",
        "images": "0 | 8px | 50%"
      }
    },
    "components": {
      "header": {
        "position": "sticky | fixed | static",
        "background": "transparent-on-hero | solid | blur",
        "logoPosition": "left | center",
        "navAlignment": "right | center",
        "mobileMenu": "hamburger-slide | hamburger-dropdown | bottom-sheet",
        "height": "64px | 80px"
      },
      "hero": {
        "type": "full-bleed-image | video | solid-color | split-layout | slider",
        "overlay": { "color": "rgba(0,0,0,0.5)", "gradient": "..." },
        "textAlignment": "center | left",
        "ctaStyle": "prominent-button | subtle-link | dual-buttons"
      },
      "buttons": {
        "primary": {
          "bg": "#xxx", "text": "#xxx", "border": "none | 1px solid",
          "borderRadius": "4px", "padding": "12px 24px",
          "fontWeight": 600, "textTransform": "uppercase | none",
          "hoverEffect": "darken | lighten | scale | shadow"
        },
        "secondary": {
          "bg": "transparent", "text": "#xxx", "border": "1px solid #xxx",
          "hoverEffect": "fill | darken"
        }
      },
      "cards": {
        "background": "#xxx",
        "border": "none | 1px solid #xxx",
        "borderRadius": "8px",
        "shadow": "none | soft | medium",
        "hoverEffect": "lift | glow | border-color-change | none"
      },
      "footer": {
        "background": "#xxx",
        "columns": 3,
        "style": "minimal | detailed | dark-inverse"
      },
      "images": {
        "borderRadius": "0 | 8px",
        "aspectRatio": "16:9 | 4:3 | 1:1 | mixed",
        "hoverEffect": "zoom | overlay | none",
        "filter": "none | grayscale | slight-saturation-boost"
      }
    },
    "animations": {
      "pageTransitions": "none | fade | slide",
      "scrollAnimations": "none | fade-up | parallax",
      "hoverTransitions": "0.2s ease | 0.3s ease-in-out",
      "loadingStyle": "none | skeleton | spinner"
    }
  },
  "brandVoice": {
    "personality": ["adjective1", "adjective2", "adjective3"],
    "tone": "formal | casual | edgy | warm | professional | playful",
    "vocabulary": {
      "wordsTheyUse": ["specific", "words", "from", "their", "content"],
      "wordsTheyAvoid": ["corporate", "buzzwords", "they", "never", "use"],
      "industryJargon": ["terms", "specific", "to", "their", "industry"]
    },
    "messagingPatterns": {
      "headlines": "Short and punchy | Long and descriptive | Question-based",
      "ctas": "Direct command | Soft invitation | Urgency-driven",
      "descriptions": "Feature-focused | Benefit-focused | Story-driven"
    },
    "socialMediaVoice": {
      "instagram": {
        "tone": "...",
        "emojiUsage": "heavy | moderate | none",
        "hashtagStyle": "branded | community | trending | none",
        "captionLength": "short | medium | long",
        "sampleCaptions": ["verbatim caption 1", "verbatim caption 2"]
      },
      "facebook": {
        "tone": "...",
        "postStyle": "promotional | conversational | informational"
      }
    },
    "customerPerception": {
      "commonPraise": ["what customers say about them"],
      "vibeDescriptors": ["how customers describe the experience"],
      "emotionalAssociations": ["feelings tied to the brand"]
    }
  },
  "contentStrategy": {
    "primaryCTA": "Book Now | Call Us | Get a Quote | Shop Now",
    "valueProposition": "What makes them unique in one sentence",
    "keyMessages": ["message 1", "message 2", "message 3"],
    "contentPriority": ["portfolio", "services", "reviews", "team", "location"],
    "imageStrategy": {
      "primarySubjects": "work samples | team | space | products",
      "mood": "dark and moody | bright and airy | gritty and raw | clean and minimal",
      "colorTemperature": "warm | cool | neutral",
      "composition": "close-ups | wide shots | mixed"
    }
  },
  "images": {
    "hero": "https://cdn.example.com/hero-banner.jpg — verified HTTP 200",
    "logo": "https://cdn.example.com/logo.png — verified HTTP 200",
    "food": [
      { "url": "https://...", "description": "Dish name or what's shown", "verified": true }
    ],
    "gallery": [
      { "url": "https://...", "description": "What's shown", "verified": true }
    ],
    "atmosphere": [
      { "url": "https://...", "description": "Interior/exterior", "verified": true }
    ]
  },
  "people": [
    {
      "name": "Person Name",
      "role": "Owner | Lead Artist | Head Barber | Senior Stylist | etc.",
      "instagram": "handle_without_at",
      "instagramUrl": "https://www.instagram.com/handle/",
      "profilePhotoUrl": "https://instagram.fooo1-1.fna.fbcdn.net/v/...jpg — og:image from their IG profile",
      "portfolioPhotos": [
        "https://... — tagged work photo 1",
        "https://... — tagged work photo 2"
      ],
      "bio": "Verbatim bio from website or Instagram if available. Otherwise null.",
      "featured": true,
      "photoVerified": true
    }
  ],
  "demographics": {
    "primaryLanguage": "en",
    "secondaryLanguage": "es | pt | ko | ja | zh | hi | fr | ta | ur | null",
    "languageEvidence": "IG comments: 47 EN / 31 ES (36% Spanish). Business replies in Spanish.",
    "commentAudit": { "instagramComments": {}, "googleReviews": {}, "businessReplies": {}, "totalNonEnglishPercent": 0, "dominantNonEnglish": null },
    "additionalLanguages": [],
    "neighborhood": "Eglinton West — strong Latin American community",
    "targetCustomer": "Latin American diaspora families + adventurous foodies"
  },
  "screenshots": {
    "desktopHome": "brand-bible/screenshots/desktop-home.png",
    "mobileHome": "brand-bible/screenshots/mobile-home.png",
    "innerPage": "brand-bible/screenshots/inner-page.png"
  }
}
```

### PHASE 3.5 — Layout Archetype Classification

After synthesizing the brand bible, classify the business into exactly ONE layout archetype. This archetype determines the page section order for the build phase. Add an `"archetype"` key to `brand-bible.json` at the top level.

#### The Four Archetypes

**PORTFOLIO-FIRST** — businesses where the work IS the product
- Triggers: tattoo studios, hair salons, nail bars, photography, design studios, art galleries
- Section order: Hero (large work image, minimal text) → Portfolio/Gallery (full-width) → Services (brief) → Artist Bios → Testimonials → Booking CTA → Contact
- DO: Lead with visuals. Full-bleed images. Minimal text in hero. Let the work sell itself.
- DON'T: Lead with a text-heavy "About" block. No stats bar. No feature list. No corporate CTAs.

**SERVICE-FIRST** — businesses where clarity of offering drives conversions
- Triggers: dentists, lawyers, accountants, auto shops, HVAC, cleaning services, contractors
- Section order: Hero (headline + CTA) → Services/Pricing → Why Choose Us → Testimonials → FAQ → Contact/Booking
- DO: Clear service names and prices. Trust signals early. Strong CTA above fold.
- DON'T: Lead with portfolio imagery. Avoid vague hero copy.

**LOCATION-FIRST** — businesses where foot traffic and neighborhood identity matter
- Triggers: restaurants, cafes, bars, bakeries, grocers, boutiques
- Section order: Hero (atmosphere photo + hours) → Menu/Featured Items → About/Story → Gallery (space + food) → Reviews → Map + Hours → Contact
- DO: Show the space. Highlight hours and address early. Seasonal/rotating specials.
- DON'T: Put contact form before the map. Don't bury hours.

**CONTENT-FIRST** — businesses where expertise and education build trust
- Triggers: fitness studios, wellness/yoga, financial advisors, coaches, tutors, consultants
- Section order: Hero (transformation promise) → Philosophy/Method → Services/Programs → Instructor/Team → Blog/Resources → Testimonials → CTA
- DO: Lead with the transformation or outcome. Show credentials. Use long-form testimonials.
- DON'T: Lead with pricing. Avoid purely transactional CTAs ("Buy Now" → prefer "Start Your Journey").

#### Classification Rules
1. Read `contentStrategy.contentPriority` from the brand bible — the first item is the strongest signal
2. Read the business type from `analysis.json`
3. If ambiguous between two archetypes, pick the one matching `contentStrategy.primaryCTA`
4. Add to `brand-bible.json`:
```json
{
  "archetype": {
    "type": "portfolio-first | service-first | location-first | content-first",
    "rationale": "One sentence explaining the classification",
    "sectionOrder": ["hero", "gallery", "services", "team", "testimonials", "booking", "contact"]
  }
}
```
5. Reference the `sectionOrder` array in `design-directives.md` Layout Blueprint section

### PHASE 4 — Design Directives

After building the brand bible, produce a `design-directives.md` file with human-readable instructions for the build phase:

```markdown
# Design Directives — {Business Name}

## Identity Summary
One paragraph describing the overall brand feel.

## DO
- Specific things the build MUST do to match the brand
- e.g., "Use dark backgrounds with high-contrast gold text"
- e.g., "Keep navigation minimal — 4 items max, uppercase, wide letter-spacing"
- e.g., "Hero must be full-bleed portfolio image with dark overlay"

## DON'T
- Specific things to AVOID
- e.g., "Don't use rounded buttons — their brand is all sharp corners"
- e.g., "Don't use playful fonts — their tone is serious and professional"
- e.g., "Don't use light backgrounds — entire site is dark-themed"

## Font Pairing
Heading: {font} — because {reason}
Body: {font} — because {reason}
Nav: {font} at {weight} — because {reason}

## Color Usage Rules
- Primary CTA: {color} on {background}
- Section alternation: {color1} → {color2} → {color1}
- Never use {color} for {purpose} — it clashes with their brand

## Layout Archetype: {PORTFOLIO-FIRST | SERVICE-FIRST | LOCATION-FIRST | CONTENT-FIRST}
Rationale: {why this archetype was chosen}

## Section Order (from archetype)
1. {section 1} — {brief description}
2. {section 2} — {brief description}
3. {section 3} — {brief description}
... (follow the archetype's prescribed order)

## Layout Blueprint
- Header: {description}
- Hero: {description}
- Content sections: {pattern matching archetype section order}
- Footer: {description}

## Tone of Voice Guide
- Headlines should sound like: "{example}"
- Body copy should sound like: "{example}"
- CTAs should sound like: "{example}"
```

## Output Files
All output goes to `build/{lead-slug}/brand-bible/`:
```
brand-bible/
├── brand-bible.json          # Comprehensive structured data
├── design-directives.md      # Human-readable build instructions
└── screenshots/
    ├── desktop-home.png       # Homepage at 1440px
    ├── mobile-home.png        # Homepage at 390px
    └── inner-page.png         # Services/gallery page
```

## Quality Checklist
Before marking complete, verify:
- [ ] At least 3 website pages analyzed (not just homepage)
- [ ] Typography identified with specific font names (not "serif" or "sans-serif")
- [ ] Color palette has 8+ colors with usage context (not just "primary" and "secondary")
- [ ] Social media voice captured with real caption samples
- [ ] Customer reviews analyzed for brand perception
- [ ] Screenshots saved (at least desktop + mobile homepage)
- [ ] Design directives include specific DO and DON'T lists
- [ ] Component inventory covers header, hero, buttons, cards, footer, images
- [ ] Brand voice personality is backed by evidence from content
- [ ] Spacing and layout patterns are documented with actual values
- [ ] **`people[]` array populated** — every named person on the website has an entry
- [ ] **Owner/lead artist has a verified `profilePhotoUrl`** (not null)
- [ ] **At least 2 people have `photoVerified: true`**
- [ ] **`images` object populated** — hero, logo, and at least 3 food/product/portfolio photos with `verified: true`
- [ ] **No empty image placeholders** — if the build agent has no images to use, the preview will look like a template and the prospect won't care
- [ ] **`demographics` object populated** — `primaryLanguage`, `secondaryLanguage` (with evidence), `commentAudit`, `neighborhood`, `targetCustomer`
- [ ] **Comment language audit completed** — actual count of comments by language from Instagram + Google Reviews + business replies. 30%+ non-English threshold for secondaryLanguage. Count table in `languageEvidence`.

## Critical Rules
1. **Never guess** — if you can't find a font name, say "unidentified — closest Google Fonts match: X because Y"
2. **Never use defaults** — every value in the brand bible must come from actual observation
3. **Capture the FEELING** — two sites can use the same hex colors but feel completely different because of typography, spacing, imagery, and voice
4. **Social media is truth** — the website might be outdated, but their Instagram shows who they REALLY are now
5. **Customer reviews reveal reality** — how customers describe the experience is more honest than how the business describes itself

## Anti-Dark-Mode Bias (CRITICAL — read before writing ANY colors)

**Background color verification is MANDATORY.** Before writing `bgMain` or `overallTheme`, you MUST:

1. **Fetch the live site and inspect the raw HTML/CSS.** Look for:
   - `body { background-color: ... }` or `background: ...`
   - CSS custom properties like `--background`, `--bg`, `--site-bg`, `--accent`, `--white-hsl`
   - Squarespace: look for `.sqs-layout`, `.page-section`, `[data-section-theme]` background values
   - The actual rendered color in the HTML `<style>` block or linked stylesheets

2. **The dark-mode default is the most common hallucination.** If you cannot find explicit CSS evidence of a dark background, assume LIGHT. Most local service businesses (tattoo studios, salons, restaurants, dentists) run light/warm/neutral themes.

3. **Validation gate before writing `overallTheme`:**
   - If bgMain hex luminance < 50% (i.e., dark), you MUST cite the exact CSS rule where you found it
   - If you cannot cite a real CSS source, set bgMain to the lightest background color found
   - A single dark hero section does NOT make the site dark-themed

4. **Evidence requirement format** — in your brand bible notes, write:
   ```
   bgMain source: `body { background-color: #F2EFE3 }` found in stylesheet at use.typekit.net/xxx.css line 12
   ```
   If you cannot write this line, you have not found the background color.
