# Sub-Skill: People Research

Run this BEFORE building any team, artist, or staff section. Do not write a team section using initials, placeholder avatars, or generic Unsplash portraits. Real photos or nothing.

## Purpose
Find public photos for every real person named on the business's website or Instagram. The goal is to use THEIR actual face — not a stock model — in the redesign preview. This makes the demo personal and unconvertable.

---

## Step 1 — Extract People from the Website

Read the following sources to build a list of named individuals:
- Homepage copy (e.g., "Meet Dave", "Our artists include...")
- About/Team page
- Services page (barbers listed by name, artists by specialty)
- Footer (owner name, signed messages)
- Instagram bio and caption tags (e.g., "@dave_cuts", "work by Grim", "booked by Jericho")

For EACH person, record:
```
name: "Dave"
role: "Owner & Head Barber"
mentioned_on: ["homepage hero", "about page", "squire profile"]
possible_handle: "@davefades" (if mentioned on any social)
```

---

## Step 2 — Find Their Instagram Handle

For each person, try the following in order:

### 2a. Direct mention on business website
- Check the business website for `@username` mentions or direct `instagram.com/username` links
- Look in footer social links, team bios, and image captions

### 2b. Tagged on business Instagram
- Fetch the business Instagram profile: `https://www.instagram.com/{business_handle}/`
- Look in post captions for `@username` tags mentioning the person
- Look in `og:image` alt text, post text for "work by @username" patterns

### 2c. WebSearch
Search: `"{name}" "{business name}" instagram site:instagram.com`
Also try: `"{name}" "{business name}" {city} instagram`
Extract the Instagram URL from search results.

---

## Step 3 — Fetch Their Public Profile Photo

Once you have a handle, fetch the Instagram profile:
```
WebFetch: https://www.instagram.com/{handle}/
```

Extract the `og:image` meta tag value — this is their profile photo CDN URL:
```html
<meta property="og:image" content="https://instagram.f{city}X-X.fna.fbcdn.net/v/...jpg">
```

Store this URL as `profilePhotoUrl`.

**Fallback if Instagram is unavailable:**
- WebSearch: `"{name}" "{business name}" photo` — look for Google Knowledge Panel, Yelp, Facebook, or LinkedIn photos
- Use the business website itself — look for `<img>` tags near the person's name, extract the `src`

---

## Step 4 — Find Portfolio/Work Photos (for creatives)

For tattoo artists, hair stylists, nail techs, makeup artists:

### Via Business Instagram
Fetch `https://www.instagram.com/{business_handle}/` and look for:
- Posts captioned "by {name}" or "work by @username"
- The 3 most recent relevant posts for each artist

### Via Personal Instagram
Fetch `https://www.instagram.com/{personal_handle}/` and extract:
- From `og:image` (profile photo)
- From HTML, look for `window._sharedData` or `<script type="application/ld+json">` for post images
- WebSearch: `site:instagram.com/p {name} {business name}` to find tagged posts

Store up to 3 portfolio photo URLs per person as `portfolioPhotos`.

---

## Step 5 — Output Format

Add to `brand-bible.json`:

```json
"people": [
  {
    "name": "Dave",
    "role": "Owner & Head Barber",
    "instagram": "davefades",
    "instagramUrl": "https://www.instagram.com/davefades/",
    "profilePhotoUrl": "https://instagram.fooo1-1.fna.fbcdn.net/v/...jpg",
    "portfolioPhotos": [
      "https://instagram.fooo1-1.fna.fbcdn.net/v/...jpg",
      "https://instagram.fooo1-1.fna.fbcdn.net/v/...jpg"
    ],
    "bio": "Short bio from website or Instagram. Verbatim if available.",
    "featured": true,
    "photoVerified": true
  },
  {
    "name": "Grim",
    "role": "Classic Cuts",
    "instagram": null,
    "instagramUrl": null,
    "profilePhotoUrl": null,
    "portfolioPhotos": [],
    "bio": null,
    "featured": false,
    "photoVerified": false
  }
]
```

`featured: true` = person appears prominently on website (owner, lead artist)
`photoVerified: true` = URL was confirmed reachable (HTTP 200)

---

## Step 6 — URL Verification

For every photo URL collected, verify it returns HTTP 200:
```
WebFetch: {photo_url}
```
If 404 or blocked, set to `null` and mark `photoVerified: false`.

**Common hotlink issues:**
- Instagram CDN URLs (`fbcdn.net`) — work as `<img src>` without auth in most browsers
- Wix Media (`wixstatic.com`) — generally hotlinkable
- Squarespace Media (`squarespace-cdn.com`, `sqspcdn.com`) — usually blocked. Fall back to WebSearch for cached versions.
- WordPress uploads (`/wp-content/uploads/`) — usually hotlinkable

---

## Step 7 — Build Usage Instructions

When building the team/artist section:

1. **Always prefer `profilePhotoUrl` from brand bible** over any generated placeholder
2. Use `object-cover` + a fixed aspect ratio (e.g., `aspect-square` for headshots, `aspect-[3/4]` for full-body portraits)
3. CSS fallback for broken photo: `style={{ backgroundColor: '{brand.bgAlt}' }}`
4. If `profilePhotoUrl` is null, use a solid color block with the person's initials — NOT a stock Unsplash photo of a random person
5. If `portfolioPhotos` exist, use them in the gallery grid for that artist

---

## Quality Bar

Before marking people research complete:
- [ ] Every named person on the website has an entry in `brand-bible.json people[]`
- [ ] Owner/featured artist has a verified `profilePhotoUrl`
- [ ] At least the top 2 people have real photos (not null)
- [ ] Portfolio photos found for service-type businesses where work samples matter
- [ ] All photo URLs verified (HTTP 200 or documented as unverified)
- [ ] `photoVerified` flag is accurate — never mark true without a real check
