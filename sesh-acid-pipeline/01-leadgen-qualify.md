# Skill 01 — Lead Generation & Qualification

## Objective
Find 5-10 SMBs in the Greater Toronto Area with outdated websites that would benefit from a modern redesign. Qualify each lead by checking social media activity and website quality.

## Target Profile
- **Geography**: Greater Toronto Area (Toronto, Mississauga, Brampton, Markham, Vaughan, Richmond Hill, Oakville, Burlington, Scarborough, North York, Etobicoke)
- **Business size**: Small-to-medium (1-50 employees)
- **Industries**: Restaurants, dental/medical clinics, law firms, real estate agents, fitness studios, salons/barbershops, auto repair shops, accounting firms, construction/contractors, retail stores
- **Signal**: Their website looks outdated, loads slowly, is not mobile responsive, lacks SSL, uses old design patterns (Flash, tables-based layout, clip art, etc.)

## Step 1 — Search for Leads
Use web search to find businesses in the GTA. Rotate through search queries like:
- "{industry} in {city}" (e.g., "restaurants in Mississauga", "dental clinic Brampton")
- Look at Google Maps listings, Yelp, Yellow Pages, industry directories
- Target businesses that HAVE a website (no point pitching someone without one)
- Collect: business name, website URL, industry, city

Aim for 15-20 raw leads before filtering.

## Step 2 — Evaluate Website Quality
For each lead, visit their website and score on these criteria:

| Criteria | Bad Signal (qualifies) | Good Signal (disqualify) |
|----------|----------------------|-------------------------|
| Design | Looks like 2015 or older, cluttered, clip art | Clean, modern, professional |
| Mobile | Not responsive, breaks on mobile viewport | Fully responsive |
| Speed | Loads >4 seconds, heavy images | Fast, optimized |
| SSL | No HTTPS / mixed content | Valid HTTPS |
| Tech | WordPress with default theme, Wix free tier, GoDaddy builder | Custom build, recent framework |
| Content | Outdated info, broken links, lorem ipsum | Current, well-maintained |

**Score 1 point per bad signal. Keep leads with score >= 3.**

## Step 3 — Stalk Social Media
For each qualifying lead:
1. Find their social media profiles (Instagram, Facebook, X/Twitter, LinkedIn, TikTok)
2. Check the **last 10 posts** on each platform
3. Note the posting dates, tone of voice, and content themes
4. **DISQUALIFY if**: No posts within the last 2 months on ANY platform (business may be closed/inactive)
5. **KEEP if**: At least 1 platform has activity within last 2 months

Extract from social media:
- **Tone of voice**: Formal? Casual? Funny? Professional?
- **Brand personality**: What vibe do they project?
- **Key themes**: What do they talk about most?
- **Visual style**: Color preferences, photo style, aesthetic

## Step 4 — Find & Validate Contact Email (CRITICAL — v1.6)

Bounced emails = wasted pipeline runs. NEVER guess emails from domain names.

### 4a. Extract from website (highest confidence)
1. WebFetch the contact page, about page, footer, team/careers page
2. Look for `mailto:` links in HTML — these are CONFIRMED real
3. Regex scan for email patterns: `[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}`
4. Check contact form `action` URLs — sometimes reveal an email
5. Check `<meta>` tags and `schema.org` structured data for email

### 4b. Extract from social media
1. Instagram bio — often has "Email for bookings: ..." or a direct email
2. Facebook "About" section — frequently has confirmed business email
3. LinkedIn company page — sometimes shows contact email
4. Google Maps listing — check business info panel

### 4c. Web search
1. `"{business name}" "{city}" email`
2. `"{business name}" "@gmail.com" OR "@outlook.com" OR "@yahoo.com"`
3. `site:yelp.com "{business name}" email`
4. `"{owner name}" email {city}` — if owner name is known
5. Check directories: YellowPages.ca, 411.ca, CanPages

### 4d. Validate with MX check (MANDATORY)
```bash
node -e "
const dns = require('dns');
const email = '{found_email}';
const domain = email.split('@')[1];
dns.resolveMx(domain, (err, addrs) => {
  if (err || !addrs || addrs.length === 0) {
    console.log('FAIL: No MX records for ' + domain + ' — email will BOUNCE');
  } else {
    console.log('OK: MX records found — ' + addrs.map(a => a.exchange).join(', '));
  }
});
"
```
If MX check fails → email is INVALID. Do not use it.

### 4e. Classify confidence
- **confirmed** — from mailto: link or contact page text, MX valid
- **likely** — from social media bio or directory, MX valid
- **unverified** — from web search, MX valid but address not confirmed
- **none** — no email found after exhaustive search

### Rules
- **NEVER fabricate emails** from domain (team@, info@, hello@, contact@) — these bounce for 90% of small businesses
- **Gmail/Yahoo/Outlook addresses are PREFERRED** — that's what small businesses actually use
- If NO email found: keep the lead with `contact_email` empty and `email_confidence: none` in notes. The outreach agent will run its own email discovery before creating the Gmail draft.
- Leads WITHOUT email can still enter the pipeline — the outreach draft will have a blank To field for manual fill.

## Step 5 — Generate Output CSV
Write to `leads/qualified-leads-{YYYY-MM-DD}.csv` with columns:

```csv
business_name,website_url,contact_email,contact_name,industry,city,phone,instagram,notes
```
Include `email_confidence: confirmed/likely/unverified/none` in the notes column.

## Step 6 — Write Status
Write to `status/phase1.json`:
```json
{
  "status": "complete",
  "timestamp": "ISO-8601",
  "leads_searched": 20,
  "leads_qualified": 7,
  "leads_disqualified_inactive": 5,
  "leads_disqualified_modern_site": 6,
  "leads_disqualified_no_email": 2,
  "output_file": "leads/qualified-leads-2026-03-30.csv"
}
```

## Important
- Do NOT visit .gov or .ca government sites
- Do NOT target franchises (McDonald's, Subway, etc.) — only independent businesses
- Respect robots.txt — if a site blocks scraping, just view what's publicly available
- All data collected must be publicly available information
- Rotate search queries to get diverse results, not just the first page of Google
