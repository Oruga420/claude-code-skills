/**
 * Visual Contrast Check
 *
 * Launches a local Next.js dev server, screenshots every page with Playwright,
 * samples dominant colors from hero/background regions, and compares against
 * brand-tokens text colors using WCAG 2.1 contrast ratio.
 *
 * Usage: node visual_contrast_check.mjs <slug>
 *
 * Requires: playwright, sharp (in build/{slug}/node_modules/)
 */

import { readFileSync, existsSync, readdirSync, mkdirSync } from 'fs';
import { join } from 'path';
import { execSync, spawn } from 'child_process';

const BUILD_DIR = join(import.meta.dirname, 'build');

// ── WCAG Contrast Ratio ──

function hexToRgb(hex) {
  const h = hex.replace('#', '');
  return {
    r: parseInt(h.substring(0, 2), 16),
    g: parseInt(h.substring(2, 4), 16),
    b: parseInt(h.substring(4, 6), 16),
  };
}

function relativeLuminance({ r, g, b }) {
  const [rs, gs, bs] = [r, g, b].map((c) => {
    const s = c / 255;
    return s <= 0.03928 ? s / 12.92 : Math.pow((s + 0.055) / 1.055, 2.4);
  });
  return 0.2126 * rs + 0.7152 * gs + 0.0722 * bs;
}

function contrastRatio(hex1, hex2) {
  const l1 = relativeLuminance(hexToRgb(hex1));
  const l2 = relativeLuminance(hexToRgb(hex2));
  const lighter = Math.max(l1, l2);
  const darker = Math.min(l1, l2);
  return (lighter + 0.05) / (darker + 0.05);
}

// WCAG AA: 4.5:1 for normal text, 3:1 for large text (18px+ or 14px+ bold)
// We use 3:1 as minimum since hero text is usually large
const MIN_CONTRAST_LARGE = 3.0;
const MIN_CONTRAST_NORMAL = 4.5;

// ── Extract colors from brand-tokens.ts ──

function extractBrandColors(slug) {
  const tokensPath = join(BUILD_DIR, slug, 'src', 'lib', 'brand-tokens.ts');
  if (!existsSync(tokensPath)) return null;

  const raw = readFileSync(tokensPath, 'utf8');
  const colors = {};

  // Extract all hex colors with their keys
  const colorRegex = /(\w+)\s*:\s*['"](#[0-9a-fA-F]{6})['"]/g;
  let match;
  while ((match = colorRegex.exec(raw)) !== null) {
    colors[match[1]] = match[2];
  }

  return colors;
}

// ── Extract dominant colors from a screenshot region using sharp ──

async function getDominantColors(imagePath, region, sharpModule) {
  const { left, top, width, height } = region;

  try {
    const { data, info } = await sharpModule(imagePath)
      .extract({ left, top, width, height })
      .resize(50, 50, { fit: 'fill' }) // downsample for speed
      .raw()
      .toBuffer({ resolveWithObject: true });

    // Simple color bucketing — find the most common color ranges
    const buckets = {};
    for (let i = 0; i < data.length; i += 3) {
      // Quantize to 16-step buckets
      const r = Math.round(data[i] / 16) * 16;
      const g = Math.round(data[i + 1] / 16) * 16;
      const b = Math.round(data[i + 2] / 16) * 16;
      const key = `${r},${g},${b}`;
      buckets[key] = (buckets[key] || 0) + 1;
    }

    // Sort by frequency, return top 5
    const sorted = Object.entries(buckets)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([key, count]) => {
        const [r, g, b] = key.split(',').map(Number);
        const hex =
          '#' +
          [r, g, b]
            .map((c) =>
              Math.min(255, c).toString(16).padStart(2, '0')
            )
            .join('');
        return { hex, count, percent: Math.round((count / (data.length / 3)) * 100) };
      });

    return sorted;
  } catch (e) {
    return [];
  }
}

// ── Find pages in the build ──

function findPages(slug) {
  const appDir = join(BUILD_DIR, slug, 'src', 'app');
  if (!existsSync(appDir)) return ['/'];

  const pages = ['/'];
  const entries = readdirSync(appDir, { withFileTypes: true });
  for (const entry of entries) {
    if (entry.isDirectory() && entry.name !== '_not-found') {
      const pagePath = join(appDir, entry.name, 'page.tsx');
      if (existsSync(pagePath)) {
        pages.push(`/${entry.name}`);
      }
    }
  }
  return pages;
}

// ── Main ──

async function main() {
  const slug = process.argv[2];
  if (!slug) {
    console.error('Usage: node visual_contrast_check.mjs <slug>');
    process.exit(1);
  }

  const buildDir = join(BUILD_DIR, slug);
  if (!existsSync(buildDir)) {
    console.error(`Build directory not found: ${buildDir}`);
    process.exit(1);
  }

  // Load sharp — try pipeline root first, then build's node_modules
  let sharp;
  const sharpLocations = [
    join(import.meta.dirname, 'node_modules', 'sharp'),
    join(buildDir, 'node_modules', 'sharp'),
  ];
  for (const loc of sharpLocations) {
    if (!existsSync(loc)) continue;
    try {
      sharp = (await import(`file://${loc.replace(/\\/g, '/')}/lib/index.js`)).default;
      break;
    } catch { /* try next */ }
  }
  if (!sharp) {
    console.error('sharp not found. Run: npm install sharp');
    process.exit(1);
  }

  const colors = extractBrandColors(slug);
  if (!colors) {
    console.error('No brand-tokens.ts found');
    process.exit(1);
  }

  console.log(`\n  ╔════════════════════════════════════════════════╗`);
  console.log(`  ║  VISUAL CONTRAST CHECK — ${slug.padEnd(22)}║`);
  console.log(`  ╚════════════════════════════════════════════════╝\n`);

  // Extract text colors and background colors
  const textColors = {};
  const bgColors = {};
  for (const [key, hex] of Object.entries(colors)) {
    if (key.startsWith('text') || key === 'primary' || key === 'secondary') {
      textColors[key] = hex;
    }
    if (key.startsWith('bg') || key === 'primary' || key === 'secondary') {
      bgColors[key] = hex;
    }
  }

  console.log('  Brand text colors:');
  for (const [key, hex] of Object.entries(textColors)) {
    const lum = relativeLuminance(hexToRgb(hex));
    console.log(`    ${key.padEnd(20)} ${hex}  (luminance: ${lum.toFixed(3)})`);
  }
  console.log();

  // ── Start dev server ──
  const pages = findPages(slug);
  console.log(`  Pages to check: ${pages.join(', ')}\n`);

  // Build first if .next doesn't exist
  const nextDir = join(buildDir, '.next');
  if (!existsSync(nextDir)) {
    console.log('  Building...');
    execSync('npm run build', { cwd: buildDir, stdio: 'pipe' });
  }

  // Start next server
  console.log('  Starting dev server...');
  const server = spawn('npx', ['next', 'start', '-p', '3847'], {
    cwd: buildDir,
    stdio: 'pipe',
    shell: true,
  });

  // Wait for server to be ready
  await new Promise((resolve) => {
    let output = '';
    server.stdout.on('data', (data) => {
      output += data.toString();
      if (output.includes('Ready') || output.includes('3847')) {
        resolve();
      }
    });
    server.stderr.on('data', (data) => {
      output += data.toString();
      if (output.includes('Ready') || output.includes('3847')) {
        resolve();
      }
    });
    // Fallback timeout
    setTimeout(resolve, 8000);
  });

  // Small extra wait for server stability
  await new Promise((r) => setTimeout(r, 2000));

  const screenshotDir = join(buildDir, 'brand-bible', 'contrast-check');
  mkdirSync(screenshotDir, { recursive: true });

  // ── Screenshot with Playwright ──
  const { chromium } = await import('playwright');
  const browser = await chromium.launch({ headless: true });

  const issues = [];
  let totalChecks = 0;
  let passedChecks = 0;

  for (const page of pages) {
    const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
    const tab = await ctx.newPage();

    try {
      await tab.goto(`http://localhost:3847${page}`, {
        waitUntil: 'networkidle',
        timeout: 15000,
      });
      await tab.waitForTimeout(1000);

      const screenshotPath = join(
        screenshotDir,
        `${page === '/' ? 'home' : page.replace('/', '')}.png`
      );
      await tab.screenshot({ path: screenshotPath, fullPage: false });

      console.log(`  📸 ${page} → ${screenshotPath.split(/[/\\]/).pop()}`);

      // ── Analyze regions ──

      // Region 1: Hero area (top 60% of viewport)
      const heroColors = await getDominantColors(
        screenshotPath,
        { left: 0, top: 0, width: 1440, height: 540 },
        sharp
      );

      // Region 2: Mid-page (40-70% of viewport)
      const midColors = await getDominantColors(
        screenshotPath,
        { left: 0, top: 360, width: 1440, height: 270 },
        sharp
      );

      const regions = [
        { name: 'hero (top 60%)', colors: heroColors },
        { name: 'mid-page', colors: midColors },
      ];

      for (const region of regions) {
        if (region.colors.length === 0) continue;

        const dominantBg = region.colors[0];
        console.log(
          `    ${region.name}: dominant bg ${dominantBg.hex} (${dominantBg.percent}%)`
        );

        // Check each text color against dominant background
        for (const [textKey, textHex] of Object.entries(textColors)) {
          if (textKey === 'primary' || textKey === 'secondary') continue; // skip non-text
          const ratio = contrastRatio(textHex, dominantBg.hex);
          totalChecks++;

          const isLargeText = textKey === 'textHeading';
          const minRatio = isLargeText ? MIN_CONTRAST_LARGE : MIN_CONTRAST_NORMAL;
          const passed = ratio >= minRatio;

          if (passed) {
            passedChecks++;
          } else {
            const issue = {
              page,
              region: region.name,
              textColor: `${textKey}: ${textHex}`,
              bgColor: dominantBg.hex,
              ratio: ratio.toFixed(2),
              required: minRatio.toFixed(1),
              severity: ratio < 2.0 ? 'CRITICAL' : 'WARNING',
            };
            issues.push(issue);
            console.log(
              `    ⚠️  ${issue.severity}: ${textKey} (${textHex}) on ${dominantBg.hex} → ratio ${issue.ratio}:1 (need ${issue.required}:1)`
            );
          }
        }
      }

      // ── Check for text-on-image specifically ──
      // Look for elements with background-image and text on top
      const overlayIssues = await tab.evaluate(() => {
        const problems = [];
        const elements = document.querySelectorAll(
          '[style*="backgroundImage"], [style*="background-image"]'
        );
        elements.forEach((el) => {
          const text = el.textContent?.trim();
          if (text && text.length > 5) {
            const style = window.getComputedStyle(el);
            const color = style.color;
            const bgImage = style.backgroundImage;
            if (bgImage && bgImage !== 'none') {
              // Check if there's an overlay
              const hasOverlay = el.querySelector(
                '[class*="overlay"], [class*="bg-black"], [class*="bg-white"]'
              );
              if (!hasOverlay) {
                problems.push({
                  tag: el.tagName,
                  text: text.substring(0, 60),
                  textColor: color,
                  hasBgImage: true,
                  hasOverlay: false,
                });
              }
            }
          }
        });
        return problems;
      });

      if (overlayIssues.length > 0) {
        for (const oi of overlayIssues) {
          console.log(
            `    ⚠️  TEXT-ON-IMAGE: "${oi.text}..." has no overlay (text color: ${oi.textColor})`
          );
          issues.push({
            page,
            region: 'text-on-image',
            textColor: oi.textColor,
            bgColor: 'background-image',
            ratio: 'N/A',
            required: 'overlay needed',
            severity: 'WARNING',
            detail: `"${oi.text}" — add semi-transparent overlay for readability`,
          });
        }
      }
    } catch (e) {
      console.log(`    ❌ Error on ${page}: ${e.message}`);
    }

    await ctx.close();
  }

  await browser.close();

  // Kill the server
  try {
    server.kill('SIGTERM');
    // On Windows, also kill the process tree
    if (process.platform === 'win32') {
      execSync(`taskkill /PID ${server.pid} /T /F 2>nul`, { stdio: 'pipe' });
    }
  } catch {}

  // ── Summary ──
  console.log('\n  ════════════════════════════════════════════════');
  console.log(`  RESULTS: ${passedChecks}/${totalChecks} contrast checks passed`);

  const critical = issues.filter((i) => i.severity === 'CRITICAL');
  const warnings = issues.filter((i) => i.severity === 'WARNING');

  if (critical.length > 0) {
    console.log(`\n  🔴 CRITICAL (${critical.length}):`);
    for (const c of critical) {
      console.log(`     ${c.page} ${c.region}: ${c.textColor} on ${c.bgColor} (${c.ratio}:1)`);
    }
  }

  if (warnings.length > 0) {
    console.log(`\n  🟡 WARNINGS (${warnings.length}):`);
    for (const w of warnings) {
      if (w.detail) {
        console.log(`     ${w.page}: ${w.detail}`);
      } else {
        console.log(`     ${w.page} ${w.region}: ${w.textColor} on ${w.bgColor} (${w.ratio}:1)`);
      }
    }
  }

  if (issues.length === 0) {
    console.log('  ✅ All contrast checks passed — no visibility issues detected');
  }

  console.log(`\n  Screenshots saved to: brand-bible/contrast-check/`);
  console.log('  ════════════════════════════════════════════════\n');

  // Exit code: 1 if critical issues, 0 otherwise
  process.exit(critical.length > 0 ? 1 : 0);
}

main().catch((e) => {
  console.error('Fatal:', e);
  process.exit(1);
});
