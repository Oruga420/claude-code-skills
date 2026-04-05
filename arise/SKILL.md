---
name: arise
description: Bootstrap or sync a persistent LLM wiki inside any project. Detects if the project is new or existing, gathers required context through Q&A or codebase scanning, then builds a .claude/wiki/ knowledge structure with agent harness support (OpenClaw, NanoClaw, NemoClaw). Wires /compact to auto-update the wiki on every context save.
---

# /arise — Persistent Project Wiki Bootstrap

Inspired by Karpathy's LLM Wiki pattern. Instead of rediscovering knowledge from scratch on every session, ARISE builds a **persistent, compounding wiki** inside `.claude/wiki/` that grows richer with every session, ingest, and `/compact`.

Primary use case: projects running agent harnesses (OpenClaw, NanoClaw, NemoClaw) for **onboarding**, **Q&A**, and **task tracking** across teams and communication channels.

---

## Phase 0 — Detect Project State

Before doing anything else, check the following:

1. Does `.claude/wiki/index.md` exist?
2. Does `.claude/wiki/overview.md` exist?
3. Does `.claude/CLAUDE.md` (project-level) exist?

**Decision:**
- If `wiki/index.md` AND `wiki/overview.md` both exist → **EXISTING PROJECT** mode (Phase 2)
- Otherwise → **NEW PROJECT** mode (Phase 1)

---

## Phase 1 — New Project: Interactive Bootstrap

The wiki doesn't exist yet. Gather everything needed to seed it. Use `AskUserQuestion` for structured choices, then follow up with open-ended questions for detail.

### Step 1.1 — Agent Harness

Ask the user which agent harness powers (or will power) this project:

```
AskUserQuestion:
  question: "Which agent harness is this project built on?"
  header: "Harness"
  options:
    - label: "OpenClaw"
      description: "Open-source agent framework by Peter Steinberger. Runs via WhatsApp, Telegram, Discord, Slack. 250k+ GitHub stars."
    - label: "NanoClaw"
      description: "Lightweight containerized alternative to OpenClaw. Claude Agent SDK-based. Runs in Docker sandboxes for security isolation."
    - label: "NemoClaw (NVIDIA)"
      description: "Enterprise OpenClaw built on NVIDIA NeMo + NIM. Adds policy-based guardrails and on-prem GPU deployment."
    - label: "Custom / Other"
      description: "Custom harness, LangGraph, CrewAI, or not decided yet."
```

### Step 1.2 — Communication Channels

```
AskUserQuestion:
  question: "Which channels will your agent operate through?"
  header: "Channels"
  multiSelect: true
  options:
    - label: "WhatsApp"
    - label: "Telegram"
    - label: "Discord"
    - label: "Slack"
```

### Step 1.3 — Primary Use Cases

```
AskUserQuestion:
  question: "What are the primary use cases for this agent?"
  header: "Use Cases"
  multiSelect: true
  options:
    - label: "Onboarding"
      description: "Guide new team members through processes, tools, and culture."
    - label: "Q&A"
      description: "Answer questions from team using accumulated wiki knowledge."
    - label: "Task Tracking"
      description: "Assign, track, and follow up on tasks for team members."
    - label: "All Three"
      description: "Full suite: onboarding + Q&A + task follow-up."
```

### Step 1.4 — Open-Ended Context Collection

After structured questions, ask these sequentially (do NOT batch — wait for each answer before proceeding):

1. **Project name**: "What is the name of this project?"
2. **Description**: "In 2–3 sentences, what does this project do and who is it for?"
3. **Goals**: "What does success look like in 3 months? List 2–4 concrete goals."
4. **Team / Stakeholders**: "List the people or roles involved (name + role, e.g. 'Ana — HR Lead'). Include everyone who will interact with the agent."
5. **Key Concepts**: "Are there domain-specific terms, processes, or systems this agent must know? List them with brief explanations."
6. **Existing Sources**: "Are there any documents, READMEs, links, or files I should ingest now to seed the wiki? List them or type 'none'."
7. **Risks / Constraints**: "Any known risks, limitations, or constraints I should note in the wiki? (e.g., 'all data must stay on-prem', 'no PII in wiki')"

**Rule: Do not proceed to Phase 3 until all 7 questions are answered.** If the user says a field is intentionally blank, log that explicitly in the wiki and explain the risk in `overview.md`.

---

## Phase 2 — Existing Project: Scan and Sync

The wiki exists but may be stale, or a new session just started. Perform a full project scan to refresh.

### Step 2.1 — Read Everything

Scan the following in order:
1. `.claude/wiki/overview.md` — load current project state
2. `.claude/wiki/index.md` — catalog of existing pages
3. `.claude/wiki/log.md` — last 10 entries (recent history)
4. `.claude/wiki/entities/team.md` — current team roster
5. `.claude/wiki/entities/systems.md` — integrations and harnesses
6. `.claude/wiki/schema.md` — wiki conventions
7. Root `README.md`, `package.json`, `pyproject.toml` (if they exist)
8. Any `.env.example` or config files (read keys only, never values)
9. `CLAUDE.md` (project-level) if it exists outside `.claude/`

### Step 2.2 — Gap Detection

After scanning, identify every field in the Required Wiki Fields list (see below) that is:
- Missing entirely
- Marked `TBD`, `TODO`, or `unknown`
- Contradicted by newer data found in the scan

For each gap, ask the user. Do NOT proceed to Phase 3 until every gap is resolved or the user explicitly confirms it will remain incomplete AND acknowledges the documented risk.

**Required Wiki Fields:**
- [ ] Project name and 2–3 sentence description
- [ ] Goals (min 2 concrete goals)
- [ ] Agent harness (OpenClaw / NanoClaw / NemoClaw / custom)
- [ ] Communication channels
- [ ] Primary use cases (onboarding / Q&A / task tracking)
- [ ] Team roster with roles
- [ ] Key domain concepts (min 3)
- [ ] At least 1 ingested source
- [ ] Known risks and constraints

If a field is confirmed-incomplete, write a `> ⚠️ INCOMPLETE:` block in the relevant wiki page explaining what is missing and why the user chose to continue without it.

---

## Phase 3 — Build the Wiki Structure

Create the following directory and file structure inside the current project. Never overwrite existing files — append or merge instead.

```
.claude/
├── CLAUDE.md                     ← create if missing; append arise section if exists
├── rules/
│   └── arise.md                  ← wiki conventions + compact rule
├── agents/
│   └── arise-agent.md            ← agent persona and capabilities
└── wiki/
    ├── index.md                   ← catalog: every page, one-line summary, link
    ├── log.md                     ← append-only chronological log
    ├── schema.md                  ← conventions for THIS project's wiki
    ├── overview.md                ← project overview, goals, vision, harness
    ├── sources/                   ← one file per ingested source
    │   └── _README.md
    ├── entities/
    │   ├── team.md                ← roster: name, role, channel handle, joined date
    │   └── systems.md             ← external systems, integrations, APIs
    ├── concepts/
    │   ├── onboarding.md          ← onboarding process and steps
    │   ├── qa-process.md          ← how Q&A works, common questions
    │   └── task-tracking.md       ← task lifecycle, statuses, escalation
    └── queries/
        └── _README.md             ← filed answers to important one-off questions
```

### File Templates

#### `.claude/wiki/overview.md`
```markdown
# [Project Name] — Overview

**Description:** [2–3 sentences]

**Agent Harness:** [OpenClaw / NanoClaw / NemoClaw / Custom]
**Channels:** [WhatsApp, Telegram, Discord, Slack, ...]
**Use Cases:** [Onboarding, Q&A, Task Tracking]

## Goals
1. [Goal 1]
2. [Goal 2]
...

## Risks & Constraints
- [Risk 1]
- [Risk 2]

## Status
**Last updated:** [YYYY-MM-DD]
**Wiki health:** [number] pages | [number] sources | [number] open queries
```

#### `.claude/wiki/schema.md`
```markdown
# Wiki Schema — [Project Name]

## Directory Conventions
- `sources/` — one .md file per ingested source. Filename = kebab-case title.
- `entities/` — persistent pages for people, systems, integrations.
- `concepts/` — domain knowledge pages. Update when understanding deepens.
- `queries/` — file important Q&A sessions here. Format: YYYY-MM-DD-topic.md

## Page Header Format
Every wiki page MUST start with:
```
# [Title]
**Last updated:** YYYY-MM-DD
**Tags:** [comma, separated]
**Related:** [[page1]], [[page2]]
```

## Cross-Reference Rules
- Always link related pages using `[[page-name]]` syntax.
- When a source contradicts an existing claim, add `> ⚠️ CONFLICT:` block.
- When a claim is superseded, mark old claim `> ~~outdated~~` and add new claim.

## Ingest Workflow
1. Add source file to `sources/`
2. Update `entities/` and `concepts/` pages affected
3. Update `index.md` with new pages
4. Append entry to `log.md`

## Compact Workflow (runs on every /compact)
See `rules/arise.md` for the mandatory compact checklist.
```

#### `.claude/wiki/entities/team.md`
```markdown
# Team Roster

**Last updated:** [YYYY-MM-DD]
**Tags:** team, people, stakeholders
**Related:** [[concepts/onboarding]], [[concepts/task-tracking]]

| Name | Role | Channel Handle | Joined | Notes |
|------|------|---------------|--------|-------|
| [Name] | [Role] | [@handle] | [YYYY-MM-DD] | |
```

#### `.claude/wiki/entities/systems.md`
```markdown
# Systems & Integrations

**Last updated:** [YYYY-MM-DD]
**Tags:** systems, integrations, infrastructure
**Related:** [[overview]]

## Agent Harness
**Type:** [OpenClaw / NanoClaw / NemoClaw / Custom]
**Version:** [version]
**Deployment:** [local / cloud / container / on-prem GPU]
**Channels connected:** [list]

## External Systems
| System | Purpose | Status | Notes |
|--------|---------|--------|-------|
| | | | |
```

#### `.claude/wiki/log.md`
```markdown
# Wiki Log

Append-only. Most recent entries at the top.
Format: `## [YYYY-MM-DD HH:MM] <type> | <title>`
Types: ingest | query | update | lint | session | compact

---

## [YYYY-MM-DD] session | /arise bootstrap
Initial wiki created via /arise skill.
Pages created: [list]
```

#### `.claude/wiki/index.md`
```markdown
# Wiki Index — [Project Name]

Updated on every /compact. One entry per page.

## Overview & Schema
- [overview.md](overview.md) — Project goals, harness, channels, use cases
- [schema.md](schema.md) — Wiki conventions and workflows

## Entities
- [entities/team.md](entities/team.md) — Team roster with roles and handles
- [entities/systems.md](entities/systems.md) — Agent harness and integrations

## Concepts
- [concepts/onboarding.md](concepts/onboarding.md) — Onboarding process and steps
- [concepts/qa-process.md](concepts/qa-process.md) — Q&A workflow and common questions
- [concepts/task-tracking.md](concepts/task-tracking.md) — Task lifecycle and escalation

## Sources
[files will appear here as sources are ingested]

## Queries
[filed Q&A sessions will appear here]
```

---

## Phase 4 — Wire CLAUDE.md, rules/arise.md, agents/arise-agent.md

### `.claude/CLAUDE.md` — Append this section (create file if missing):

```markdown
## ARISE Wiki System

This project uses the ARISE persistent wiki pattern (inspired by Karpathy's LLM Wiki).

### Wiki Location
`.claude/wiki/` — DO NOT delete or reorganize without running `/arise` first.

### How to Use the Wiki
- **Answer questions** by reading `wiki/index.md` first, then drilling into relevant pages.
- **Ingest a new source** by reading it, summarizing to `wiki/sources/`, updating relevant entity/concept pages, and appending to `wiki/log.md`.
- **File a good answer** by saving it to `wiki/queries/YYYY-MM-DD-topic.md` and linking from `wiki/index.md`.
- **Run a lint pass** periodically: check for contradictions, orphan pages, missing cross-references.

### On Every /compact — MANDATORY
Before Claude compacts the context, it MUST execute the compact wiki checklist defined in `.claude/rules/arise.md`.
```

### `.claude/rules/arise.md`

```markdown
# ARISE Wiki Rules

## Core Principle
The wiki is a persistent, compounding artifact. Every session makes it richer. Never let knowledge evaporate into chat history.

## Mandatory Compact Checklist
When `/compact` is triggered, BEFORE compacting Claude MUST:

1. **Log the session** — Append an entry to `wiki/log.md`:
   ```
   ## [YYYY-MM-DD HH:MM] compact | [session topic]
   [2–4 bullet summary of what was done/learned this session]
   ```

2. **Update entity pages** — Did we learn anything new about team members, systems, or integrations? Update `wiki/entities/*.md`.

3. **Update concept pages** — Did any domain knowledge deepen or change? Update `wiki/concepts/*.md`.

4. **File answered queries** — If a significant question was answered this session, save it to `wiki/queries/YYYY-MM-DD-topic.md` and link from `wiki/index.md`.

5. **Update index** — If any new pages were created, add them to `wiki/index.md` with a one-line summary.

6. **Flag conflicts** — If new info contradicts existing wiki content, add `> ⚠️ CONFLICT:` blocks to the relevant pages.

## Wiki Integrity Rules
- NEVER delete wiki pages — deprecate with `> ~~outdated~~` if superseded.
- ALWAYS update `wiki/log.md` — it's the source of truth for what happened.
- ALWAYS cross-link related pages — isolated pages are half-useless.
- NEVER leave `TBD` or `TODO` without a linked issue or owner.

## Ingest Rules
- One source = one summary file in `wiki/sources/`.
- A single source may touch 5–15 wiki pages. Touch all of them.
- Mark every claim with its source: `[Source: filename]`.

## Gap Policy
If a Required Wiki Field is missing:
1. Ask the user for it.
2. If user confirms it stays incomplete, write `> ⚠️ INCOMPLETE: [reason]` in the relevant page.
3. Document the risk of proceeding without it.
```

### `.claude/agents/arise-agent.md`

```markdown
# ARISE Agent

## Identity
ARISE is the persistent knowledge agent for this project. It maintains the wiki, answers questions from accumulated knowledge, and keeps team context alive across sessions.

## Capabilities
- **Onboarding**: Guide new team members using `wiki/concepts/onboarding.md`. Personalize by role using `wiki/entities/team.md`.
- **Q&A**: Answer questions by reading `wiki/index.md` first, drilling into pages, synthesizing an answer, and filing it in `wiki/queries/`.
- **Task Tracking**: Log task assignments in `wiki/entities/team.md`. Track status updates. Flag overdue tasks.

## Harness Integration
This agent is designed to work with: **[OpenClaw / NanoClaw / NemoClaw / Custom]**

### OpenClaw / NanoClaw
- Users interact via messaging channels (WhatsApp, Telegram, Discord, Slack).
- ARISE reads channel messages, retrieves relevant wiki pages, responds in-channel.
- Long answers → file to `wiki/queries/` and send link.
- New info from conversation → update relevant wiki pages immediately.

### NemoClaw (NVIDIA Enterprise)
- Same flow as OpenClaw + policy guardrails from NVIDIA Agent Toolkit.
- PII handling: strip before writing to wiki if compliance rules require.
- On-prem deployment: wiki lives on company infrastructure.

## Response Format
- Short answers (<3 paragraphs): reply inline with citations `[wiki/page.md]`.
- Complex answers: write to `wiki/queries/YYYY-MM-DD-topic.md`, reply with summary + link.
- Task updates: acknowledge, update `wiki/entities/team.md`, confirm to user.

## Session Start Behavior
At the start of every session, ARISE MUST:
1. Read `wiki/index.md` and `wiki/log.md` (last 5 entries).
2. Check for any `> ⚠️ INCOMPLETE:` blocks across all pages.
3. Report: "Wiki loaded. [N] pages. Last updated [date]. [N] open gaps."

## Unknown Knowledge Policy
If a question can't be answered from the wiki:
1. Say so explicitly: "I don't have this in the wiki yet."
2. If the user provides the answer, ingest it into the wiki immediately.
3. Never hallucinate facts not in the wiki.
```

---

## Phase 5 — Ingest Existing Sources (if any)

If the user provided sources in Phase 1 (or if sources exist in the project), ingest them now:

For each source:
1. Read it fully.
2. Write a summary to `wiki/sources/[kebab-name].md`.
3. Update all relevant entity and concept pages.
4. Append an ingest entry to `wiki/log.md`.
5. Update `wiki/index.md`.

---

## Phase 6 — Final Report

After all phases complete, output a clean summary:

```
ARISE Wiki bootstrapped successfully.

Project: [name]
Harness: [OpenClaw / NanoClaw / NemoClaw / Custom]
Channels: [list]
Use Cases: [list]

Wiki structure:
  .claude/wiki/        — [N] pages created
  .claude/rules/       — arise.md added
  .claude/agents/      — arise-agent.md added
  .claude/CLAUDE.md    — arise section appended

Team: [N members]
Concepts: [N pages]
Sources ingested: [N]
Open gaps: [N] (listed below if any)

[If gaps exist:]
⚠️ Incomplete fields:
  - [field]: [reason user gave for skipping]
  - Risk: [documented risk]

Next steps:
  1. Run /arise again after adding new sources to ingest them.
  2. /compact will auto-update the wiki at the end of every session.
  3. Ask the agent anything — if it doesn't know, it will add it to the wiki.
```

---

## Ongoing Operations

### Ingest a New Source
User says: "ingest [source]" or "add [doc] to the wiki"
→ Follow Phase 5 for that source only.

### Answer a Question
User asks anything about the project:
1. Read `wiki/index.md` to find relevant pages.
2. Read those pages.
3. Synthesize answer with citations.
4. If answer is significant, file it in `wiki/queries/`.

### Lint Pass
User says: "lint the wiki" or "health check"
→ Check for: contradictions, orphan pages, missing cross-references, stale claims, `TBD`/`TODO` without owners.
→ Report findings and fix what you can. Ask user about the rest.

### Re-Bootstrap
User says: "/arise" on an existing project:
→ Run Phase 2 (scan + gap detection) then skip to Phase 6 report.
→ Do NOT overwrite existing wiki pages — only append and update.
