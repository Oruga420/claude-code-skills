---
name: argos-dm-user
description: Send a DM to any Slack user as Argos (the Promise Assistant bot). Asks for the user name and message, then delivers it via the Slack API.
---

# Argos DM User

Send a direct message to any Promise Studios Slack user as the Promise Assistant bot (Argos).

## When to Activate

- When the user runs `/argos-dm-user`
- When the user wants to send a Slack DM as the bot

## Workflow

### Step 1: Ask the user two questions

Use the AskUserQuestion tool to ask:

1. **"Who should Argos send the DM to?"** - The user's full name as it appears in Slack (e.g. "Mariana Acuna Acosta", "George Strompolos"). Allow free text input.
2. **"What message should Argos send?"** - The message content. Allow free text input.

If the user provided these as arguments (e.g. `/argos-dm-user George Strompolos "Hey George!"`), parse them directly instead of asking.

### Step 2: Read the bot token

Read the bot token from:
```
{workspace}/Promise_onboarding_automation/secrets/slackbot token.md
```
Where `{workspace}` is `c:\Users\chuck\Desktop\Promise - Operations - Onboarding`.

The file contains a single line with the `xoxb-` token. Trim any whitespace.

### Step 3: Find the user in Slack

Use Python with `urllib.request` to call the Slack API (do NOT use curl):

```python
import urllib.request, json

token = "<token from step 2>"
req = urllib.request.Request(
    "https://slack.com/api/users.list?limit=500",
    headers={"Authorization": "Bearer " + token}
)
resp = urllib.request.urlopen(req)
data = json.loads(resp.read())
```

Search `data["members"]` for a member whose `profile.real_name` matches the target name (case-insensitive partial match). If multiple matches, show them to the user and ask which one.

If no match found, show the user the full list of active (non-deleted, non-bot) members and ask them to pick.

### Step 4: Send the DM

Open a DM channel and send the message:

```python
# Open DM channel
data = json.dumps({"users": user_id}).encode()
req = urllib.request.Request(
    "https://slack.com/api/conversations.open",
    data=data,
    headers={
        "Authorization": "Bearer " + token,
        "Content-Type": "application/json; charset=utf-8"
    }
)
resp = urllib.request.urlopen(req)
result = json.loads(resp.read())
channel = result["channel"]["id"]

# Send message
data = json.dumps({"channel": channel, "text": message}).encode()
req = urllib.request.Request(
    "https://slack.com/api/chat.postMessage",
    data=data,
    headers={
        "Authorization": "Bearer " + token,
        "Content-Type": "application/json; charset=utf-8"
    }
)
resp = urllib.request.urlopen(req)
result = json.loads(resp.read())
```

### Step 5: Confirm

Tell the user:
- Who the message was sent to (full name + Slack user ID)
- The message that was sent
- Success or failure status

## Error Handling

- If the token file is missing, tell the user to add it at `Promise_onboarding_automation/secrets/slackbot token.md`
- If the Slack API returns an error, show the error and suggest fixes
- If the user is not found, show the full member list for the user to pick from

## Security Notes

- The bot token is read from a local secrets file, never hardcoded
- Messages are sent as the Promise Assistant bot, not as any user
- This skill only sends DMs, it does not read or delete messages
