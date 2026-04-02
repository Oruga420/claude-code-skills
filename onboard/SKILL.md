---
name: onboard
description: Onboard a new Promise Studios employee. Creates Google Workspace account, provisions Slack via SCIM, and sends welcome email. User provides data directly (no Google Sheet).
---

# Onboard Employee

Provision a new Promise Studios employee without touching Google Sheets. The user provides employee data directly, and the skill creates accounts and sends credentials.

Uses `onboard_manual.py` which pulls the SCIM token from GCP Secret Manager (same as Phase A Cloud Function).

## When to Activate

- When the user runs `/onboard`
- When the user asks to onboard a new employee manually

## Important Paths

```
PHASE_A = c:\Users\chuck\Desktop\Promise - Operations - Onboarding\Promise_onboarding_automation\automations\aop_onboarding\PhaseA
SCRIPT  = {PHASE_A}\onboard_manual.py
```

## Workflow

### Step 1: Collect Employee Data

Use the **AskUserQuestion** tool to gather the following. If the user already provided some or all of this data (e.g., as arguments or in conversation), parse it directly instead of asking.

Required fields:
1. **Full name** (e.g., "Maria Lopez Garcia")
2. **Role** (e.g., "VFX Compositor", "AI Engineer", "Production Coordinator")
3. **Personal email** (where to send credentials, e.g., "maria.lopez@gmail.com")
4. **Long-term contract?** (yes/no)

Optional fields:
5. **Specific email override** (if user wants a specific `@promise.ai` address instead of auto-generated)

### Step 2: Confirm Before Proceeding

Display a summary and ask the user to confirm before creating real accounts.

### Step 3: Run onboard_manual.py

Run the script from the PhaseA directory using the Bash tool. Use system Python.

**Basic usage (short-term):**
```bash
cd "/c/Users/chuck/Desktop/Promise - Operations - Onboarding/Promise_onboarding_automation/automations/aop_onboarding/PhaseA" && python onboard_manual.py "Full Name" "Role" "personal@email.com"
```

**Long-term contract:**
```bash
cd "/c/Users/chuck/Desktop/Promise - Operations - Onboarding/Promise_onboarding_automation/automations/aop_onboarding/PhaseA" && python onboard_manual.py "Full Name" "Role" "personal@email.com" --long-term
```

**With email override:**
```bash
cd "/c/Users/chuck/Desktop/Promise - Operations - Onboarding/Promise_onboarding_automation/automations/aop_onboarding/PhaseA" && python onboard_manual.py "Full Name" "Role" "personal@email.com" --long-term --email-override royce@promise.ai
```

### Step 4: Report Results

After the script finishes, show the user a clean summary:

1. **Promise email** created
2. **Temporary password** (display clearly, only time it's shown)
3. **Google Workspace**: created / already existed / failed
4. **Slack**: created / already existed / skipped
5. **Welcome email**: sent / failed

If any step failed, explain what happened and suggest manual steps.

### Step 5: Ask About Sheet Update (Optional)

After reporting, ask if the user wants to update the Google Sheet manually. Do NOT update it automatically.

## Email Format Reference

### Short-term contracts (role-based prefix)

| Role Keywords | Prefix | Example |
|---------------|--------|---------|
| VFX, CG, Compositor, Animator, Lighter, etc. | `gfx` | gfx42@promise.ai |
| AI, ML | `ai` | ai05@promise.ai |
| Producer, PM, VP, Supervisor, Manager | `prod` | prod12@promise.ai |
| Coordinator | `coord` | coord03@promise.ai |
| Editor, Colorist, Post | `post` | post08@promise.ai |
| Developer, Engineer, Pipeline, TD | `dev` | dev15@promise.ai |
| Unrecognized | `gfx` | gfx43@promise.ai |

### Long-term contracts

Uses `firstname@promise.ai`. If taken, appends number: `firstname2@promise.ai`.

## Error Handling

| Error | Cause | Fix |
|-------|-------|-----|
| Secret Manager 403 | SA needs secretAccessor role | Ask Mark to grant the role to `onboarding-auto@valid-hall-485823-k9.iam.gserviceaccount.com` |
| Google 409 | User already exists | Account is there. Script continues with Slack + email |
| Email invalid_grant | DWD not configured for sender | Check service account DWD for `gmail.send` scope |

## Security Notes

- SCIM token pulled from GCP Secret Manager at runtime, never stored locally
- Temporary passwords are 16-char high-entropy, forced change on first login
- Credentials read from `secrets/service-account.json`, never hardcoded
