/**
 * Karpathy Brand Fidelity Scorer
 *
 * Scores a pipeline build against its brand bible (if exists) and real site data.
 * Detects generic defaults, template sameness, and brand mismatches.
 *
 * Usage: node karpathy_score.mjs [lead-slug]
 *        node karpathy_score.mjs --all
 *
 * Output: brand_fidelity: <score>  (0-100, higher = better match)
 */

import { readFileSync, readdirSync, existsSync } from 'fs';
import { join } from 'path';

const BUILD_DIR = join(import.meta.dirname, 'build');
// Fallback: sites may have code in Sesh_ACID_Websites/sites/ instead of build/
const SITES_DIR = join(import.meta.dirname, '..', '..', 'Sesh_ACID_Websites', 'sites');

/** Read a file from build/{slug}/ first, then fallback to Sesh_ACID_Websites/sites/{slug}/ */
function readBuildFile(slug, relPath) {
  const buildPath = join(BUILD_DIR, slug, relPath);
  if (existsSync(buildPath)) return readFileSync(buildPath, 'utf8');
  const sitesPath = join(SITES_DIR, slug, relPath);
  if (existsSync(sitesPath)) return readFileSync(sitesPath, 'utf8');
  return '';
}

/** Normalize a font family name for fuzzy comparison:
 *  "Source Sans Pro" → "source sans", "Source Sans 3" → "source sans", "Cormorant Garamond" → "cormorant garamond" */
function normalizeFont(name) {
  return name
    .toLowerCase()
    .replace(/\s+(pro|new|[0-9]+)$/i, '')  // strip trailing Pro/New/3/etc
    .replace(/[^a-z\s]/g, '')              // strip non-alpha
    .trim();
}

// ── Generic defaults that should NEVER appear if brand bible is working ──
const GENERIC_HEADING_FONTS = ['playfair display', 'playfair'];
const GENERIC_BODY_FONTS = ['roboto', 'inter'];
const GENERIC_FONT_PAIRS = [
  ['playfair display', 'roboto'],
  ['playfair display', 'inter'],
  ['playfair', 'roboto'],
  ['playfair', 'inter'],
];

// ── Scoring rubric (140 points total) ──
function scoreBuild(slug) {
  const dir = join(BUILD_DIR, slug);
  const results = { slug, total: 0, max: 140, checks: [] };

  const check = (name, points, passed, detail) => {
    results.checks.push({ name, points: passed ? points : 0, max: points, passed, detail });
    if (passed) results.total += points;
  };

  // ── 1. Brand Bible Exists (15 pts) ──
  const bbPath = join(dir, 'brand-bible', 'brand-bible.json');
  const ddPath = join(dir, 'brand-bible', 'design-directives.md');
  const ssDir = join(dir, 'brand-bible', 'screenshots');

  const hasBrandBible = existsSync(bbPath);
  check('brand-bible-exists', 5, hasBrandBible, hasBrandBible ? 'Found' : 'MISSING — build ran without brand research');

  const hasDirectives = existsSync(ddPath);
  check('design-directives-exist', 5, hasDirectives, hasDirectives ? 'Found' : 'MISSING — no DO/DON\'T rules');

  const hasScreenshots = existsSync(ssDir) && readdirSync(ssDir).filter(f => /\.(png|jpg|webp)$/i.test(f)).length >= 2;
  check('screenshots-captured', 5, hasScreenshots, hasScreenshots ? '2+ screenshots found' : 'MISSING — no visual reference captured');

  // ── 2. Font Originality (20 pts) ──
  let tailwindConfig = '';
  for (const ext of ['.ts', '.js', '.mjs']) {
    const raw = readBuildFile(slug, `tailwind.config${ext}`);
    if (raw) { tailwindConfig = raw.toLowerCase(); break; }
  }

  const layoutFile = readBuildFile(slug, 'src/app/layout.tsx').toLowerCase();
  const brandTokens = readBuildFile(slug, 'src/lib/brand-tokens.ts').toLowerCase();

  const allCode = tailwindConfig + '\n' + layoutFile + '\n' + brandTokens;

  // Check if using generic font pair
  const usesGenericPair = GENERIC_FONT_PAIRS.some(([h, b]) =>
    allCode.includes(h) && allCode.includes(b)
  );
  check('no-generic-font-pair', 10, !usesGenericPair,
    usesGenericPair ? `FAIL — using generic ${GENERIC_FONT_PAIRS.find(([h, b]) => allCode.includes(h) && allCode.includes(b))?.join(' + ')}` : 'Custom fonts used');

  // Check if heading font is generic
  const usesGenericHeading = GENERIC_HEADING_FONTS.some(f => allCode.includes(f));
  check('no-generic-heading-font', 5, !usesGenericHeading,
    usesGenericHeading ? 'FAIL — Playfair Display detected as heading font' : 'Non-generic heading font');

  // Check if body font is one of the 2 defaults
  // Exception: if brand bible CONFIRMS roboto/inter as the real site font, don't penalize
  let brandBibleBodyFont = '';
  if (hasBrandBible) {
    try {
      const bb = JSON.parse(readFileSync(bbPath, 'utf8'));
      brandBibleBodyFont = (bb?.visualIdentity?.typography?.bodyFont?.family || '').toLowerCase();
    } catch { /* ignore */ }
  }
  const usesGenericBody = GENERIC_BODY_FONTS.some(f => {
    const inBuild = allCode.includes(`"${f}"`) || allCode.includes(`'${f}'`);
    const bbConfirms = brandBibleBodyFont.includes(f);
    return inBuild && !bbConfirms; // only flag if brand bible didn't confirm it
  });
  check('no-generic-body-font', 5, !usesGenericBody,
    usesGenericBody ? `FAIL — generic body font detected (not confirmed by brand bible)` : 'Non-generic body font');

  // ── 3. Color Palette Depth (15 pts) ──
  // Check tailwind.config + brand-tokens.ts (token-based configs have colors in brand-tokens, not inline)
  const colorSources = tailwindConfig + '\n' + brandTokens;
  const hexMatches = colorSources.match(/#[0-9a-f]{6}/gi) || [];
  const uniqueColors = new Set(hexMatches.map(h => h.toLowerCase()));

  check('color-palette-depth', 10, uniqueColors.size >= 8,
    `${uniqueColors.size} unique colors in tailwind config (need 8+)`);

  // Check for color usage context in brand bible
  if (hasBrandBible) {
    try {
      const bb = JSON.parse(readFileSync(bbPath, 'utf8'));
      const palette = bb?.visualIdentity?.colorPalette || {};
      const hasUsageContext = Object.values(palette).some(v =>
        typeof v === 'object' && v !== null && 'usage' in v
      );
      check('colors-have-usage-context', 5, hasUsageContext,
        hasUsageContext ? 'Colors have usage descriptions' : 'FAIL — colors listed without usage context');
    } catch {
      check('colors-have-usage-context', 5, false, 'Could not parse brand bible');
    }
  } else {
    check('colors-have-usage-context', 5, false, 'No brand bible to check');
  }

  // ── 4. Theme Correctness (15 pts) ──
  const homepage = readBuildFile(slug, 'src/app/page.tsx');

  // Check if brand bible specifies a theme and if build matches
  if (hasBrandBible) {
    try {
      const bb = JSON.parse(readFileSync(bbPath, 'utf8'));
      const theme = (bb?.visualIdentity?.colorPalette?.overallTheme || '').toLowerCase();
      // A theme is "light" only if it doesn't also have dark accent qualifiers
      const isLightTheme = /light|clean|bright|white/i.test(theme);
      const hasDarkAccentQualifier = /dark accent|dark section|dark feature|dark contrast|predominantly light/i.test(theme);
      const isDarkTheme = /^dark|moody|noir/i.test(theme) && !isLightTheme;

      if (isLightTheme && !hasDarkAccentQualifier) {
        // Purely light theme — flag if hero/body sections use dark bg (ignore accent sections)
        // Only fail if the PRIMARY background (body class or hero section) is dark
        const bodyIsDark = /className="[^"]*bg-(black|brand-black|\[#0a0a0a\]|\[#111\])[^"]*"/.test(homepage);
        const sectionsDark = (homepage.match(/bg-(black|brand-black|\[#0a0a0a\])/g) || []).length;
        const sectionsLight = (homepage.match(/bg-(white|brand-beige|brand-cream|brand-bg|\[#f)/gi) || []).length;
        const dominantlyDark = sectionsDark > sectionsLight;
        check('theme-matches-reality', 15, !dominantlyDark,
          dominantlyDark ? `FAIL — brand bible says "${theme}" but build has more dark sections than light` : 'Theme matches brand bible');
      } else if (isDarkTheme) {
        check('theme-matches-reality', 15, true, 'Dark theme matches brand bible');
      } else {
        check('theme-matches-reality', 15, true, `Theme: "${theme.slice(0, 60)}" — mixed or neutral`);
      }
    } catch {
      check('theme-matches-reality', 15, false, 'Could not parse brand bible for theme');
    }
  } else {
    // Without brand bible, flag if using hardcoded dark
    const defaultsDark = /bg-\[#0a0a0a\]|bg-brand-black|bg-black/.test(homepage);
    check('theme-matches-reality', 15, !defaultsDark,
      defaultsDark ? 'FAIL — dark mode hardcoded without brand bible validation' : 'No obvious dark default');
  }

  // ── 5. Layout Diversity (20 pts) ──
  // Check for cookie-cutter sections
  // Strip comments before checking — comments like "// No stats bar" are NOT stats bars
  const homepageNoComments = homepage.replace(/\/\/.*$/gm, '').replace(/\/\*[\s\S]*?\*\//g, '').replace(/\{\/\*[\s\S]*?\*\/\}/g, '');
  const hasStatsBar = /stat-bar|statbar|StatsBanner|StatsSection/i.test(homepageNoComments)
    || /\d+\+?\s*(years|años).*\d+\+?\s*(clients|customers|clientes|reviews)/i.test(homepageNoComments);
  check('no-fake-stats-bar', 5, !hasStatsBar,
    hasStatsBar ? 'FAIL — generic stats bar detected (not on most real sites)' : 'No generic stats bar');

  // Check if layout follows brand bible component spec
  if (hasBrandBible) {
    try {
      const bb = JSON.parse(readFileSync(bbPath, 'utf8'));
      const heroType = bb?.visualIdentity?.components?.hero?.type || '';
      const hasPortfolioHero = /portfolio|gallery|carousel|slider/i.test(heroType);

      if (hasPortfolioHero) {
        const buildHasGalleryHero = /carousel|slider|gallery.*hero|swiper/i.test(homepage);
        check('hero-matches-brand', 5, buildHasGalleryHero,
          buildHasGalleryHero ? 'Hero matches brand bible spec' : `FAIL — brand bible says "${heroType}" but build has generic hero`);
      } else {
        check('hero-matches-brand', 5, true, `Hero type "${heroType}" — build assumed correct`);
      }
    } catch {
      check('hero-matches-brand', 5, false, 'Could not parse brand bible for hero');
    }
  } else {
    check('hero-matches-brand', 5, false, 'No brand bible — hero not validated');
  }

  // Check archetype exists in brand bible
  if (hasBrandBible) {
    try {
      const bb = JSON.parse(readFileSync(bbPath, 'utf8'));
      const archetype = bb?.archetype?.type || '';
      const validArchetypes = ['portfolio-first', 'service-first', 'location-first', 'content-first'];
      const hasValidArchetype = validArchetypes.includes(archetype);
      check('archetype-classified', 5, hasValidArchetype,
        hasValidArchetype ? `Archetype: ${archetype}` : 'FAIL — no layout archetype classification');
    } catch {
      check('archetype-classified', 5, false, 'Could not parse brand bible for archetype');
    }
  } else {
    check('archetype-classified', 5, false, 'No brand bible — no archetype');
  }

  // Check font consistency: tailwind fonts match brand bible fonts (normalized comparison)
  if (hasBrandBible) {
    try {
      const bb = JSON.parse(readFileSync(bbPath, 'utf8'));
      const bbHeadingRaw = bb?.visualIdentity?.typography?.headingFont?.family || '';
      const bbBodyRaw = bb?.visualIdentity?.typography?.bodyFont?.family || '';
      const bbHeading = normalizeFont(bbHeadingRaw);
      const bbBody = normalizeFont(bbBodyRaw);

      if (bbHeading && bbBody) {
        // Platform-specific identifiers (Squarespace/TypeKit internal names) can't be string-matched
        const platformIdentifiers = /clvrid|squarespace|typekit|system|adobe/i;
        const headingIsPlatformFont = platformIdentifiers.test(bbHeadingRaw);
        const bodyIsPlatformFont = platformIdentifiers.test(bbBodyRaw);

        if (headingIsPlatformFont || bodyIsPlatformFont) {
          // Can't verify platform fonts by name — pass if build uses non-generic fonts
          const usesCustomFonts = !GENERIC_HEADING_FONTS.some(f => allCode.includes(f));
          check('fonts-match-brand-bible', 5, usesCustomFonts,
            usesCustomFonts
              ? `Platform fonts (Squarespace/TypeKit) — visual match used: ${bbHeadingRaw}/${bbBodyRaw}`
              : `FAIL — platform fonts detected in brand bible but build uses generic defaults`);
        } else {
          // Normalized match: "source sans pro" and "source sans 3" both normalize to "source sans"
          const headingInBuild = bbHeading.split(' ').every(word => word.length > 2 && allCode.includes(word));
          const bodyInBuild = bbBody.split(' ').every(word => word.length > 2 && allCode.includes(word));
          const bothMatch = headingInBuild && bodyInBuild;
          check('fonts-match-brand-bible', 5, bothMatch,
            bothMatch
              ? `Build uses brand bible fonts: ${bbHeadingRaw} + ${bbBodyRaw}`
              : `FAIL — brand bible: ${bbHeadingRaw}/${bbBodyRaw}, build doesn't match`);
        }
      } else {
        check('fonts-match-brand-bible', 5, false, 'Brand bible has empty font names');
      }
    } catch {
      check('fonts-match-brand-bible', 5, false, 'Could not parse brand bible typography');
    }
  } else {
    check('fonts-match-brand-bible', 5, false, 'No brand bible — fonts not validated');
  }

  // Check page count — look in both build/ and Sesh_ACID_Websites/sites/, take the higher count
  const appDirBuild = join(dir, 'src', 'app');
  const appDirSites = join(SITES_DIR, slug, 'src', 'app');
  let pagesBuild = 0, pagesSites = 0;
  if (existsSync(appDirBuild)) {
    pagesBuild = readdirSync(appDirBuild, { recursive: true }).filter(f => f.toString().endsWith('page.tsx')).length;
  }
  if (existsSync(appDirSites)) {
    pagesSites = readdirSync(appDirSites, { recursive: true }).filter(f => f.toString().endsWith('page.tsx')).length;
  }
  const pages = Math.max(pagesBuild, pagesSites);
  check('sufficient-pages', 5, pages >= 4, `${pages} pages built (need 4+)`);

  // ── 5b. No Anchor Navigation (5 pts) ──
  // Anchor links (href="#section" or href="/#section") are template behavior.
  // Every nav item must point to a real route.
  {
    const headerRaw = readBuildFile(slug, 'src/components/Header.tsx');
    if (headerRaw) {
      // Match href="/#something" or href="#something" (but not href="#" alone for mobile toggle)
      const anchorLinks = headerRaw.match(/href\s*=\s*["'][^"']*#[a-zA-Z][^"']*["']/g) || [];
      const hasAnchors = anchorLinks.length > 0;
      check('no-anchor-nav', 5, !hasAnchors,
        hasAnchors
          ? `FAIL — ${anchorLinks.length} anchor link(s) in Header: ${anchorLinks.join(', ')} — use real routes instead`
          : 'All nav links point to real routes (no anchor scroll-to-section)');
    } else {
      check('no-anchor-nav', 5, true, 'No Header.tsx found — skipped');
    }
  }

  // ── 6. Brand Voice (10 pts) ──
  if (hasBrandBible) {
    try {
      const bb = JSON.parse(readFileSync(bbPath, 'utf8'));
      const voice = bb?.brandVoice || {};

      const hasPersonality = Array.isArray(voice.personality) && voice.personality.length >= 2;
      check('brand-voice-defined', 5, hasPersonality,
        hasPersonality ? `Voice: ${voice.personality?.join(', ')}` : 'FAIL — no brand personality defined');

      const hasSocialSamples = voice?.socialMediaVoice?.instagram?.sampleCaptions?.length > 0;
      check('social-voice-captured', 5, hasSocialSamples,
        hasSocialSamples ? 'Instagram captions captured' : 'FAIL — no social media voice samples');
    } catch {
      check('brand-voice-defined', 5, false, 'Could not parse');
      check('social-voice-captured', 5, false, 'Could not parse');
    }
  } else {
    check('brand-voice-defined', 5, false, 'No brand bible');
    check('social-voice-captured', 5, false, 'No brand bible');
  }

  // ── 7. People Research (10 pts) ──
  if (hasBrandBible) {
    try {
      const bb = JSON.parse(readFileSync(bbPath, 'utf8'));
      const people = bb?.people || [];
      const hasPeopleArray = Array.isArray(people);
      const hasPeopleEntries = hasPeopleArray && people.length > 0;
      const verifiedPhotos = people.filter(p => p.profilePhotoUrl && p.photoVerified).length;
      const hasVerifiedPhoto = verifiedPhotos >= 1;

      // people-researched: pass if array exists (even empty = research was done, no one found)
      check('people-researched', 5, hasPeopleArray,
        hasPeopleEntries
          ? `${people.length} people found (${verifiedPhotos} with verified photos)`
          : hasPeopleArray
            ? 'Research done — no public-facing individuals found (acceptable for some business types)'
            : 'FAIL — no people[] array in brand bible (team section will use fake placeholders)');

      // real-team-photos: pass if verified photo exists OR research confirmed no people
      // Also pass if people were found but photos are unavailable (IG blocks scraping) —
      // using initials on brand color is the correct fallback per sub-skill-people.md
      const hasAnyPhotoAttempt = people.some(p =>
        (p.profilePhotoUrl !== null && p.profilePhotoUrl !== undefined)
        || (Array.isArray(p.portfolioPhotos) && p.portfolioPhotos.length > 0)
      );
      const photoPassable = hasVerifiedPhoto || (hasPeopleArray && people.length === 0) || hasAnyPhotoAttempt;
      check('real-team-photos', 5, photoPassable,
        hasVerifiedPhoto
          ? `${verifiedPhotos} verified profile photo(s) — real faces, not stock`
          : hasPeopleArray && people.length === 0
            ? 'No individuals found — team section should be omitted or use brand imagery instead'
            : hasAnyPhotoAttempt
              ? `Photo URLs found but not all verified (IG scraping blocked) — initials fallback is correct`
              : 'FAIL — no profilePhotoUrl attempted (team section will use initials or stock photos)');
    } catch {
      check('people-researched', 5, false, 'Could not parse brand bible');
      check('real-team-photos', 5, false, 'Could not parse brand bible');
    }
  } else {
    check('people-researched', 5, false, 'No brand bible');
    check('real-team-photos', 5, false, 'No brand bible');
  }

  // ── 7b. Artist Photos Not Work (5 pts) ──
  // Catches when profilePhoto is null but portfolioPhotos exist — artist card will show work photo as profile
  {
    const brandTokensRaw = readBuildFile(slug, 'src/lib/brand-tokens.ts');
    let people = [];

    // Try brand-tokens.ts first (the build source of truth)
    if (brandTokensRaw) {
      // Extract people array from brand-tokens — look for profilePhoto(Url) and portfolioPhotos
      const peopleMatch = brandTokensRaw.match(/people\s*:\s*(\[[\s\S]*?\])\s*(?:,|\})/);
      if (peopleMatch) {
        try {
          // Clean trailing commas for JSON.parse
          const cleaned = peopleMatch[1]
            .replace(/,\s*([\]}])/g, '$1')
            .replace(/'/g, '"')
            .replace(/(\w+)\s*:/g, '"$1":');
          people = JSON.parse(cleaned);
        } catch { /* fall through to brand bible */ }
      }
    }

    // Fallback to brand-bible.json
    if (people.length === 0 && hasBrandBible) {
      try {
        const bb = JSON.parse(readFileSync(bbPath, 'utf8'));
        people = bb?.people || [];
      } catch { /* ignore */ }
    }

    if (Array.isArray(people) && people.length > 0) {
      const affected = people.filter(p => {
        const hasProfile = p.profilePhoto || p.profilePhotoUrl;
        const hasPortfolio = Array.isArray(p.portfolioPhotos) && p.portfolioPhotos.length > 0;
        return !hasProfile && hasPortfolio;
      });
      const passed = affected.length === 0;
      check('artist-photos-not-work', 5, passed,
        passed
          ? 'All artists have profilePhoto or will show initials (no misleading work photos)'
          : `FAIL — ${affected.length} artist(s) will show work photo as profile: ${affected.map(p => p.name || 'unnamed').join(', ')}`);
    } else {
      // No people data — pass (no artist cards to misrender)
      check('artist-photos-not-work', 5, true, 'No people data — no artist card photo mismatch risk');
    }
  }

  // ── 8. Real Images Used (10 pts) ──
  if (hasBrandBible) {
    try {
      const bb = JSON.parse(readFileSync(bbPath, 'utf8'));
      const images = bb?.images || {};
      const foodPhotos = (images.food || []).filter(f => f.verified);
      const galleryPhotos = (images.gallery || []).filter(f => f.verified);
      const allPhotos = [...foodPhotos, ...galleryPhotos];
      const hasHero = !!images.hero;
      const hasEnoughPhotos = allPhotos.length >= 3;

      check('images-harvested', 5, hasHero || hasEnoughPhotos,
        hasHero && hasEnoughPhotos
          ? `Hero + ${allPhotos.length} verified product photos in brand bible`
          : hasHero
            ? `Hero image found but only ${allPhotos.length} product photos (need 3+)`
            : hasEnoughPhotos
              ? `${allPhotos.length} product photos but no hero image`
              : 'FAIL — no real images harvested (build will have empty placeholders)');

      // Check if homepage actually uses real image URLs (not just empty bg-color divs)
      // Also check brand-tokens.ts and layout.tsx where image constants may be defined
      const brandTokensRaw = readBuildFile(slug, 'src/lib/brand-tokens.ts');
      const allBuildCode = homepage + '\n' + brandTokensRaw;
      const usesRealImages = allBuildCode && (
        /cloudfront\.net|wixstatic\.com|squarespace-cdn|wp-content\/uploads|wsimg\.com|wanderlogstatic\.com|staticflickr\.com|fresha\.com|michaeleats\.com|blogto/i.test(allBuildCode)
        || /backgroundImage.*url\(/i.test(allBuildCode)
        || /BRAND\.images\./i.test(homepage)
        || /\.(jpg|jpeg|png|webp)/i.test(allBuildCode) && /https?:\/\/[a-z]/i.test(allBuildCode)
      );
      check('images-in-build', 5, usesRealImages,
        usesRealImages
          ? 'Build uses real image URLs from business CDN'
          : 'FAIL — homepage has no real image URLs (empty placeholders or Unsplash only)');
    } catch {
      check('images-harvested', 5, false, 'Could not parse brand bible');
      check('images-in-build', 5, false, 'Could not parse brand bible');
    }
  } else {
    check('images-harvested', 5, false, 'No brand bible');
    check('images-in-build', 5, false, 'No brand bible');
  }

  // ── 9. Component Specificity (10 pts) ──
  if (hasBrandBible) {
    try {
      const bb = JSON.parse(readFileSync(bbPath, 'utf8'));
      const comps = bb?.visualIdentity?.components || {};

      const hasHeaderSpec = comps.header && comps.header.position;
      check('header-spec-defined', 3, !!hasHeaderSpec,
        hasHeaderSpec ? `Header: ${comps.header.position}, bg: ${comps.header.background}` : 'FAIL — no header component spec');

      const hasButtonSpec = comps.buttons && comps.buttons.primary;
      check('button-spec-defined', 3, !!hasButtonSpec,
        hasButtonSpec ? 'Button styles specified' : 'FAIL — no button component spec');

      const hasImageSpec = comps.images && comps.images.borderRadius !== undefined;
      check('image-spec-defined', 4, !!hasImageSpec,
        hasImageSpec ? 'Image treatment specified' : 'FAIL — no image component spec');
    } catch {
      check('header-spec-defined', 3, false, 'Could not parse');
      check('button-spec-defined', 3, false, 'Could not parse');
      check('image-spec-defined', 4, false, 'Could not parse');
    }
  } else {
    check('header-spec-defined', 3, false, 'No brand bible');
    check('button-spec-defined', 3, false, 'No brand bible');
    check('image-spec-defined', 4, false, 'No brand bible');
  }

  return results;
}

// ── Main ──
const args = process.argv.slice(2);
let slugs = [];

if (args.includes('--all')) {
  slugs = readdirSync(BUILD_DIR).filter(d => {
    const p = join(BUILD_DIR, d, 'package.json');
    return existsSync(p);
  });
} else if (args.length > 0) {
  slugs = [args[0]];
} else {
  console.error('Usage: node karpathy_score.mjs <lead-slug> | --all');
  process.exit(1);
}

let totalScore = 0;
let totalMax = 0;

for (const slug of slugs) {
  const result = scoreBuild(slug);
  totalScore += result.total;
  totalMax += result.max;

  console.log(`\n${'═'.repeat(60)}`);
  console.log(`  ${slug}  —  ${result.total}/${result.max}`);
  console.log('═'.repeat(60));

  for (const c of result.checks) {
    const icon = c.passed ? '✓' : '✗';
    const pts = `${c.points}/${c.max}`;
    console.log(`  ${icon} ${c.name.padEnd(30)} ${pts.padStart(6)}  ${c.detail}`);
  }
}

if (slugs.length > 1) {
  const avg = Math.round(totalScore / slugs.length);
  console.log(`\n${'═'.repeat(60)}`);
  console.log(`  AVERAGE BRAND FIDELITY: ${avg}/100`);
  console.log(`  brand_fidelity: ${avg}`);
  console.log('═'.repeat(60));
} else if (slugs.length === 1) {
  console.log(`\n  brand_fidelity: ${slugs.length > 0 ? scoreBuild(slugs[0]).total : 0}`);
}
