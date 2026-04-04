# Skill 04 — Inbox Scanner

## Objective
Scan Gmail for replies to Sesh ACID outreach emails. Classify responses, invite positive leads to book a meeting, and track everything in a nurturing CSV.

## Execution Context
This skill runs independently from the main pipeline, triggered by its own scheduled tasks (2x daily). It does NOT depend on the pipeline phases.

## Step 1 — Search for Replies
Search Gmail for replies to outreach emails:

```bash
gws gmail +search \
  --query "subject:(We redesigned) is:inbox newer_than:7d" \
  --format json
```

Also search for:
```bash
gws gmail +search \
  --query "subject:(website) subject:(redesign) is:inbox newer_than:7d" \
  --format json
```

Filter results to only include messages that are REPLIES to emails sent from our account (check `In-Reply-To` or thread IDs).

## Step 2 — Read and Classify Each Reply
For each reply found:

1. Read the full message:
```bash
gws gmail +read --id {message_id} --format json
```

2. Classify the response:

| Classification | Signals | Action |
|---------------|---------|--------|
| **POSITIVE** | Interested, wants to talk, asks about pricing, says yes, asks questions about the service | Invite to meeting |
| **MAYBE** | Asks for more info, noncommittal but not negative, "let me think about it" | Add to nurturing, flag for follow-up |
| **NEGATIVE** | Not interested, already has a developer, "remove me", rude | Add to nurturing as cold, do NOT follow up |
| **UNSUBSCRIBE** | Explicitly asks to stop emails, "stop emailing me" | Add to nurturing as unsubscribed, NEVER email again |
| **AUTO-REPLY** | Out of office, automated response | Ignore, do not classify |

## Step 3 — Handle POSITIVE Responses
For each POSITIVE reply:

### 3a — Create Calendar Event Invite
```bash
gws calendar +insert \
  --summary "Sesh ACID x {Business Name} — Website Redesign Chat" \
  --description "Quick 15-minute call to discuss the website redesign preview we built for {Business Name}.\n\nPreview: {VERCEL_URL}\n\nLooking forward to chatting!" \
  --start "{next_available_slot}" \
  --end "{15_min_later}" \
  --attendees "{contact_email}" \
  --format json
```

**Finding the next available slot:**
```bash
# Check calendar for free slots in the next 3 business days
gws calendar +events \
  --start "{tomorrow_9am}" \
  --end "{3_days_from_now_5pm}" \
  --format json
```

Pick the first available 15-minute slot between 10am-4pm EST on a weekday.

### 3b — Reply to Their Email
Draft a reply (NOT auto-send):
```bash
gws gmail +draft \
  --to "{contact_email}" \
  --subject "Re: We redesigned {Business Name}'s website — take a look 👀" \
  --in-reply-to "{original_message_id}" \
  --body "Hey {contact_name}! Great to hear you're interested. I just sent over a calendar invite for a quick 15-min chat. If the time doesn't work, just let me know and we'll find something that does. Talk soon! — Sesh ACID"
```

### 3c — Notify Owner via Dispatch
Write a notification file that the status monitor will pick up:
```json
// status/new-meetings.json (append to array)
{
  "meetings": [
    {
      "business_name": "Mario's Pizza & Pasta",
      "contact_email": "mario@mariospizza.ca",
      "response_sentiment": "positive",
      "calendar_event_time": "2026-03-31T10:00:00-04:00",
      "vercel_url": "https://sesh-acid-marios-pizza-pasta.vercel.app",
      "detected_at": "ISO-8601"
    }
  ]
}
```

## Step 4 — Update Nurturing CSV
Append ALL responses (positive, maybe, negative, unsubscribe) to `nurturing/responses.csv`:

```csv
date,business_name,contact_email,contact_name,response_type,response_summary,vercel_url,original_email_date,thread_id,follow_up_date,notes
```

- **POSITIVE**: follow_up_date = meeting date
- **MAYBE**: follow_up_date = 5 business days from now
- **NEGATIVE**: follow_up_date = empty
- **UNSUBSCRIBE**: follow_up_date = "NEVER", notes = "DO NOT CONTACT"

Create the CSV with headers if it doesn't exist. Always append, never overwrite.

## Step 5 — Write Status
Write to `status/inbox-scan.json`:
```json
{
  "status": "complete",
  "timestamp": "ISO-8601",
  "scan_type": "scheduled",
  "emails_found": 5,
  "classifications": {
    "positive": 1,
    "maybe": 2,
    "negative": 1,
    "unsubscribe": 0,
    "auto_reply": 1
  },
  "new_meetings_scheduled": 1,
  "nurturing_csv_rows_added": 4
}
```

## Important
- NEVER auto-send replies. ALWAYS use `gws gmail +draft`
- NEVER email someone classified as UNSUBSCRIBE
- Calendar invites ARE auto-sent (this is expected behavior for calendar)
- If calendar insert fails, still draft the reply and note the calendar failure
- Check `nurturing/responses.csv` before processing — skip emails already classified (check thread_id)
- Respect Canadian Anti-Spam Legislation (CASL) — stop all contact if unsubscribe is requested
