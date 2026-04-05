# Skill 03 — Outreach

## Objective
Take the deployed Vercel preview and compose a high-converting cold outreach email that introduces Alejandro (the human behind the work), shows the redesign, and closes with a clear offer. Save as Gmail draft for human approval.

## Inputs
- `status/phase2.json` — contains Vercel URL, lead info, design tokens
- Vercel deployment URL from the build step
- Lead info from CSV (business name, contact name, email, phone, city)

## Step 1 — Compose Email HTML

Build an HTML email with inline styles. The email MUST follow the exact structure and design system below.

### Sender Identity (HARDCODED — use in every email)
```
Name: Alejandro de la Mora
Title: AI Solutions Architect · Web Designer
Brand: Sesh
LinkedIn: https://www.linkedin.com/in/amorac/
Website: https://www.eloruga.com
Instagram: @oruga_d_karmik
```

### Email Design System — Color Palette
The email uses a **military/tactical aesthetic** with warm earth tones:
```
--olive-dark:    #3d4a2f   (headers, dark sections)
--olive-mid:     #5a6b3c   (buttons, accents)
--olive-light:   #7a8c5e   (hover states, borders)
--khaki:         #c4b590   (secondary backgrounds, dividers)
--sand:          #e8dcc8   (light section backgrounds)
--cream:         #f5f0e6   (body background)
--bark:          #4a3728   (text on light backgrounds)
--espresso:      #2d1f14   (headings)
--amber:         #d4a024   (highlights, badges, star ratings)
--amber-light:   #f0d060   (accent borders, warning)
--white:         #ffffff   (card backgrounds, text on dark)
--smoke:         #6b6b6b   (secondary text)
```

### Email Structure (follow this EXACTLY):

```
1. HEADER STRIP — olive-dark (#3d4a2f) background, white text
   - "SESH" bold left-aligned
   - "Web Design That Hits Different" tagline right-aligned

2. PERSONAL INTRO — cream background
   - "Hey {contact_name|there}," casual greeting
   - 2-3 sentences: I saw your spot, your [specific thing about their business] caught my eye, your online presence doesn't match how good your [food/products/service] actually is
   - MUST reference something SPECIFIC about their business (a dish, their heritage, years open, a review, their neighborhood)

3. THE REVEAL — sand background with olive border
   - "So I went ahead and built you a new website."
   - "No invoice. No catch. Just wanted to show you what's possible."
   - Big CTA button (olive-mid bg, white text, rounded): "See Your New Website →"
   - Links to {VERCEL_URL}

4. SOCIAL PROOF STRIP — olive-dark background
   - "I've redesigned 20+ local Toronto businesses this month alone."
   - Small amber stars ★★★★★

5. THE OFFER — white card on cream background, olive-light border
   - Header: "Ready to make it yours?"
   - Price: "$1,000 CAD" large, amber colored
   - Subtitle: "One-time. No subscriptions. No BS."
   - Checklist (olive checkmarks ✓):
     ✓ The exact redesign you see — fully yours
     ✓ Mobile-perfect on every device
     ✓ Connected to your domain
     ✓ SEO + Google Analytics setup
     ✓ Working contact form & online ordering links
     ✓ 3 rounds of revisions
     ✓ 30 days of support
     ✓ Delivered in 48 hours
   - CTA button (amber bg #d4a024, espresso text): "Let's Do This →"

6. WHO AM I SECTION — sand background
   - Left: small circular avatar placeholder (olive border, initials "AM" if no photo)
   - Right:
     - "Alejandro de la Mora"
     - "AI Solutions Architect · Web Designer @ Sesh"
     - "I build systems where AI meets real business needs. 30+ certifications including Anthropic Claude, AWS, Google AI. Based in Toronto."
     - LinkedIn button (olive-mid, white text): "Connect on LinkedIn →" → https://www.linkedin.com/in/amorac/

7. FOOTER — olive-dark background, small text
   - "Sesh · Toronto, Canada"
   - "This preview stays live for you to share with your team."
   - Unsubscribe placeholder link
   - Social icons row: LinkedIn | Instagram (@oruga_d_karmik) | Web (eloruga.com)
```

### Tone Rules:
- Direct, confident, slightly bold. Like a friend who's really good at their job.
- NOT corporate. NOT desperate. NOT "Dear Sir/Madam."
- Short paragraphs. Max 2 sentences each.
- Use "I" not "we" — this is personal from Alejandro
- Reference their SPECIFIC business (food, products, heritage, neighborhood) — never generic
- Bilingual touch OK if the business is Latin (e.g., "Tu sitio no le hace justicia a tu sazón")
- Subject line MUST be personal and specific to the business, never templated

### Subject Line Examples (adapt per business):
- "{Contact}, I redesigned {Business Name}'s website — check it out"
- "Your empanadas deserve a better website, {Business Name}"
- "I built {Business Name} a new site — on the house"
- "{Contact} — quick question about {Business Name}'s online presence"

### Full HTML Template:
```html
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="margin: 0; padding: 0; background-color: #f5f0e6; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; color: #4a3728; line-height: 1.6;">

  <!-- HEADER STRIP -->
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #3d4a2f;">
    <tr>
      <td style="padding: 16px 32px;">
        <table width="100%" cellpadding="0" cellspacing="0">
          <tr>
            <td style="color: #ffffff; font-size: 22px; font-weight: 800; letter-spacing: 2px;">SESH</td>
            <td style="color: #c4b590; font-size: 12px; text-align: right; letter-spacing: 1px; text-transform: uppercase;">Web Design That Hits Different</td>
          </tr>
        </table>
      </td>
    </tr>
  </table>

  <!-- MAIN CONTENT -->
  <table width="100%" cellpadding="0" cellspacing="0" style="max-width: 600px; margin: 0 auto;">

    <!-- PERSONAL INTRO -->
    <tr>
      <td style="padding: 32px 32px 16px; background-color: #f5f0e6;">
        <p style="font-size: 17px; margin: 0 0 16px; color: #2d1f14;">Hey {contact_name|there},</p>
        <p style="font-size: 16px; margin: 0 0 12px;">{PERSONALIZED_OPENER — 2-3 sentences referencing something specific about their business, neighborhood, food, heritage, or reputation. Never generic.}</p>
        <p style="font-size: 16px; margin: 0;">But real talk — your website doesn't do your {food|products|craft} justice. And that's costing you customers every day.</p>
      </td>
    </tr>

    <!-- THE REVEAL -->
    <tr>
      <td style="padding: 24px 32px; background-color: #e8dcc8; border-left: 4px solid #5a6b3c;">
        <p style="font-size: 18px; font-weight: 700; color: #2d1f14; margin: 0 0 8px;">So I went ahead and built you a new one.</p>
        <p style="font-size: 15px; color: #6b6b6b; margin: 0 0 20px;">No invoice. No catch. I just wanted to show you what's possible.</p>
        <table cellpadding="0" cellspacing="0">
          <tr>
            <td style="background-color: #5a6b3c; border-radius: 6px; padding: 14px 32px;">
              <a href="{VERCEL_URL}" style="color: #ffffff; text-decoration: none; font-size: 16px; font-weight: 700; letter-spacing: 0.5px;">See Your New Website &rarr;</a>
            </td>
          </tr>
        </table>
      </td>
    </tr>

    <!-- SOCIAL PROOF STRIP -->
    <tr>
      <td style="padding: 16px 32px; background-color: #3d4a2f; text-align: center;">
        <p style="font-size: 14px; color: #c4b590; margin: 0;">I've redesigned <strong style="color: #ffffff;">20+ local Toronto businesses</strong> this month alone.</p>
        <p style="font-size: 16px; color: #d4a024; margin: 4px 0 0; letter-spacing: 2px;">&#9733;&#9733;&#9733;&#9733;&#9733;</p>
      </td>
    </tr>

    <!-- THE OFFER -->
    <tr>
      <td style="padding: 32px;">
        <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border: 2px solid #7a8c5e; border-radius: 10px; overflow: hidden;">
          <tr>
            <td style="padding: 28px 24px; text-align: center;">
              <p style="font-size: 13px; color: #5a6b3c; text-transform: uppercase; letter-spacing: 2px; font-weight: 700; margin: 0;">Ready to make it yours?</p>
              <p style="font-size: 42px; font-weight: 800; color: #d4a024; margin: 8px 0 4px;">$1,000</p>
              <p style="font-size: 14px; color: #6b6b6b; margin: 0 0 16px;">CAD · One-time · No subscriptions · No BS</p>
              <hr style="border: none; border-top: 1px solid #e8dcc8; margin: 0 0 16px;">
              <table width="100%" cellpadding="0" cellspacing="0" style="text-align: left;">
                <tr><td style="padding: 4px 0; font-size: 14px; color: #4a3728;"><span style="color: #5a6b3c; font-weight: 700;">&#10003;</span> &nbsp;The exact redesign you see — fully yours</td></tr>
                <tr><td style="padding: 4px 0; font-size: 14px; color: #4a3728;"><span style="color: #5a6b3c; font-weight: 700;">&#10003;</span> &nbsp;Mobile-perfect on every device</td></tr>
                <tr><td style="padding: 4px 0; font-size: 14px; color: #4a3728;"><span style="color: #5a6b3c; font-weight: 700;">&#10003;</span> &nbsp;Connected to your domain</td></tr>
                <tr><td style="padding: 4px 0; font-size: 14px; color: #4a3728;"><span style="color: #5a6b3c; font-weight: 700;">&#10003;</span> &nbsp;SEO + Google Analytics setup</td></tr>
                <tr><td style="padding: 4px 0; font-size: 14px; color: #4a3728;"><span style="color: #5a6b3c; font-weight: 700;">&#10003;</span> &nbsp;Working contact form &amp; online ordering links</td></tr>
                <tr><td style="padding: 4px 0; font-size: 14px; color: #4a3728;"><span style="color: #5a6b3c; font-weight: 700;">&#10003;</span> &nbsp;3 rounds of revisions</td></tr>
                <tr><td style="padding: 4px 0; font-size: 14px; color: #4a3728;"><span style="color: #5a6b3c; font-weight: 700;">&#10003;</span> &nbsp;30 days of support</td></tr>
                <tr><td style="padding: 4px 0; font-size: 14px; color: #4a3728;"><span style="color: #5a6b3c; font-weight: 700;">&#10003;</span> &nbsp;Delivered in 48 hours</td></tr>
              </table>
              <br>
              <table cellpadding="0" cellspacing="0" style="margin: 0 auto;">
                <tr>
                  <td style="background-color: #d4a024; border-radius: 6px; padding: 14px 40px;">
                    <a href="mailto:alex@eloruga.com?subject=Interested in the redesign" style="color: #2d1f14; text-decoration: none; font-size: 16px; font-weight: 800;">Let's Do This &rarr;</a>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
        </table>
      </td>
    </tr>

    <!-- WHO AM I -->
    <tr>
      <td style="padding: 24px 32px; background-color: #e8dcc8;">
        <table width="100%" cellpadding="0" cellspacing="0">
          <tr>
            <td width="70" valign="top" style="padding-right: 16px;">
              <div style="width: 60px; height: 60px; border-radius: 50%; background-color: #3d4a2f; border: 3px solid #7a8c5e; color: #ffffff; font-size: 22px; font-weight: 700; text-align: center; line-height: 60px;">A</div>
            </td>
            <td valign="top">
              <p style="font-size: 17px; font-weight: 700; color: #2d1f14; margin: 0;">Alejandro de la Mora</p>
              <p style="font-size: 13px; color: #5a6b3c; margin: 2px 0 8px; font-weight: 600;">AI Solutions Architect · Web Designer @ Sesh</p>
              <p style="font-size: 14px; color: #4a3728; margin: 0 0 12px;">I build websites where AI meets real business needs. 30+ certifications. Based in Toronto. I put a face to every project I touch.</p>
              <table cellpadding="0" cellspacing="0">
                <tr>
                  <td style="background-color: #5a6b3c; border-radius: 4px; padding: 8px 16px;">
                    <a href="https://www.linkedin.com/in/amorac/" style="color: #ffffff; text-decoration: none; font-size: 13px; font-weight: 600;">Connect on LinkedIn &rarr;</a>
                  </td>
                  <td width="8"></td>
                  <td style="background-color: transparent; border: 1px solid #5a6b3c; border-radius: 4px; padding: 8px 16px;">
                    <a href="https://www.eloruga.com" style="color: #5a6b3c; text-decoration: none; font-size: 13px; font-weight: 600;">eloruga.com</a>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
        </table>
      </td>
    </tr>

    <!-- FOOTER -->
    <tr>
      <td style="padding: 20px 32px; background-color: #3d4a2f; text-align: center;">
        <p style="font-size: 13px; color: #c4b590; margin: 0 0 4px;"><strong style="color: #ffffff;">Sesh</strong> · Toronto, Canada</p>
        <p style="font-size: 12px; color: #7a8c5e; margin: 0 0 12px;">This preview stays live for you to share with your team.</p>
        <!-- Social Icons (SVG inline for email compatibility) -->
        <table cellpadding="0" cellspacing="0" style="margin: 0 auto;">
          <tr>
            <!-- LinkedIn -->
            <td style="padding: 0 8px;">
              <a href="https://www.linkedin.com/in/amorac/" style="color: #c4b590; text-decoration: none;">
                <img src="https://img.icons8.com/ios-filled/24/c4b590/linkedin.png" alt="LinkedIn" width="24" height="24" style="display: block;" />
              </a>
            </td>
            <!-- Instagram -->
            <td style="padding: 0 8px;">
              <a href="https://instagram.com/oruga_d_karmik" style="color: #c4b590; text-decoration: none;">
                <img src="https://img.icons8.com/ios-filled/24/c4b590/instagram-new.png" alt="Instagram" width="24" height="24" style="display: block;" />
              </a>
            </td>
            <!-- Portfolio/Web -->
            <td style="padding: 0 8px;">
              <a href="https://www.eloruga.com" style="color: #c4b590; text-decoration: none;">
                <img src="https://img.icons8.com/ios-filled/24/c4b590/domain.png" alt="Portfolio" width="24" height="24" style="display: block;" />
              </a>
            </td>
          </tr>
        </table>
      </td>
    </tr>

  </table>

</body>
</html>
```

### Personalization Rules (CRITICAL):
The `{PERSONALIZED_OPENER}` MUST be unique per business. Examples:

**For a Colombian restaurant:**
> "I was looking at what's around Eglinton and Jane, and Rincón Paisa popped up. The bandeja paisa photos on your Instagram look incredible — your customers clearly love the spot."

**For a Latin grocery:**
> "60 years in Kensington Market — that's legendary. Perola's is basically a Toronto institution at this point. But your website looks like it's from 2010."

**For a Halal Mexican spot:**
> "Halal Mexican food? That's one of the most interesting concepts I've seen in Toronto. Chef Yemin, what you're doing at Comal Y Canela is genuinely unique."

NEVER use a generic opener. Read the brand bible, Google reviews, Instagram, and CSV notes to find something specific.

## Step 2 — Save Email HTML
Save to `outreach/{lead-slug}/email.html`

## Step 3 — Create Gmail Draft via GWS CLI

Use the `gws` CLI to create a Gmail draft. **NOT Gmail MCP.**

```bash
# 1. Encode email as RFC 2822 base64url
node -e "
const fs = require('fs');
const html = fs.readFileSync('outreach/{slug}/email.html', 'utf8');
const email = [
  'Content-Type: text/html; charset=utf-8',
  'MIME-Version: 1.0',
  'To: {contact_email}',
  'Subject: {personalized_subject}',
  '',
  html
].join('\r\n');
const raw = Buffer.from(email).toString('base64url');
fs.writeFileSync('draft-body.json', JSON.stringify({ message: { raw } }));
"

# 2. Push draft
gws gmail users drafts create --params '{"userId":"me"}' --json "$(node -e "process.stdout.write(require('fs').readFileSync('draft-body.json','utf8'))")"
```

- **NEVER use a placeholder email** (`team@`, `info@`, `hello@`, `contact@`) — these bounce for small businesses.
- **If no contact email exists in the lead CSV**, you MUST run email discovery yourself BEFORE creating the draft:
  1. WebFetch the business website contact/about pages — look for `mailto:` links
  2. Check Instagram bio and Facebook About for email
  3. WebSearch: `"{business name}" "{city}" email`
  4. WebSearch: `"{business name}" "@gmail.com" OR "@outlook.com" OR "@yahoo.com"`
  5. Prefer Gmail/Yahoo/Outlook addresses — that's what small businesses actually use
  6. Validate MX on the **email provider domain** (e.g., `gmail.com`), NOT the business domain
- **MX validation**: `node -e "const dns=require('dns'); dns.resolveMx('{email}'.split('@')[1], (e,a) => console.log(e ? 'FAIL' : 'OK'))"`
- **Extended validation** (for emails NOT found via mailto: link): `node validate-email.mjs {email}`
  - Exit code 0 → proceed
  - Exit code 1 → INVALID, find another email
  - Exit code 2 → UNCERTAIN, do NOT use — find a real one or leave To: blank
  - This catches fabricated patterns like `firstname@corporate-domain.com` that pass MX but bounce
- **NEVER fabricate `firstname@company.com` emails** — corporate mail servers almost never use this pattern. Real estate agents use personal Gmail, not `rselzer@sutton.com`.
- If MX fails → do NOT create draft. Save HTML only, note `"email_status": "no_valid_email"` in status.
- If email discovery exhausted and no email found → still create the draft with `To:` left blank so Alejandro can fill it manually. Note `"email_status": "needs_manual_email"` in status.
- **NEVER skip the draft and suggest "reach out via Instagram DM"** — the pipeline delivers EMAIL drafts, period.
- Capture the draft `id` from the response for status tracking
- **NEVER send. ONLY draft.** Alejandro reviews and sends manually.
- If `gws` auth fails (401), tell the user to run `! gws auth login` to re-authenticate

## Step 4 — Write Status
Write to `status/phase3.json`:
```json
{
  "status": "draft_ready",
  "timestamp": "ISO-8601",
  "lead": {
    "business_name": "{Business Name}",
    "slug": "{slug}",
    "contact_email": "{email or null}"
  },
  "email_subject": "{personalized subject}",
  "email_html_path": "outreach/{slug}/email.html",
  "gmail_draft_id": "{draft-id}",
  "vercel_url": "{VERCEL_URL}",
  "pricing": {
    "model": "single_tier",
    "price": 1000,
    "currency": "CAD",
    "package_name": "Full Website Package"
  }
}
```

## Important
- Email subject MUST feel personal and specific — never templated
- The "Who Am I" section with LinkedIn link is MANDATORY in every email
- Military/olive/amber color scheme is MANDATORY — no blue (#2563eb) buttons
- All styles MUST be inline (email clients strip `<style>` tags)
- Use HTML tables for layout (email clients don't support flexbox/grid)
- If Gmail MCP fails, save the HTML and report — do NOT attempt to send
- Bilingual Spanish touch is encouraged for Latin businesses but keep it subtle (one phrase max)
