---
name: seedance-animator
description: Interactive anime/animation video pipeline. Talks with the user about the boceto, idea, and art style; asks which Seedance model (seedance-2 or seedance-2-lite) to use; generates character sheets, environment/art-style refs, and a 3x3 storyboard via Nano Banana 2; then animates with Seedance 2 via Replicate. Orchestrates one agent per reference bundle. Saves all outputs to the CWD where Claude was launched. Applies /ralphinho-rfc-pipeline, /arise, /karpathy to evolve better agents each run.
---

# Seedance Animator

Interactive pipeline that turns a verbal concept into a fully animated Japanese-anime style scene using **Replicate** (Nano Banana 2 for stills, Seedance 2 / Seedance 2 Lite for video).

## Hard rules

- **Always** use Nano Banana 2 (`google/nano-banana-2`) for every image generation step.
- **Always** use Seedance (`bytedance/seedance-2` or `bytedance/seedance-2-lite`) for animation — ask the user which one per run.
- **Save everything to the current working directory** where Claude was launched (use `$PWD` / `process.cwd()`), inside a new subfolder `./seedance_run_<timestamp>/`.
- Never invent model IDs. If the Replicate API returns 404 for a model, prompt the user for the exact slug they saw in the Replicate playground.
- `.env` holds `REPLICATE_API_TOKEN`. Never commit it. `.env.example` is the template.

## Conversation flow (MANDATORY — do this BEFORE any API call)

1. **Boceto** — "¿Cómo quieres que se vea el boceto? (sketch 3x3, rough color, clean lineart, full-color keyframes…)"
2. **Idea** — "¿Cuál es la idea/escena? (personajes, acción, duración, mood)"
3. **Art style** — "¿Qué estilo? (shonen 90s cel, modern sakuga, Ghibli, dark fantasy ink…)"
4. **Seedance model** — "¿Seedance 2 o Seedance 2 Lite? (Lite = más rápido/barato, 2 = mejor calidad)"
5. **References** — "¿Tienes imágenes de referencia? (sube paths o dime que genere todo from scratch)"

Only after the user answers all five, proceed.

## Pipeline (multi-agent, one-at-a-time)

Each stage is a **separate agent invocation** via the `Agent` tool with `subagent_type: general-purpose`. The agents run **sequentially**, each one receiving the previous agent's outputs as inputs. The orchestrator is this skill itself.

| # | Agent | Source bundle | Role | Output |
|---|-------|--------------|------|--------|
| 1 | `character-designer` | zip1 pattern | Build character sheets (frontal/side/back + expressions) per character via Nano Banana 2 | `characters/<name>_sheet.png` |
| 2 | `style-environment` | zip2 pattern | Lock art style + generate environment/background reference via Nano Banana 2 | `style/style_ref.png`, `style/background.png` |
| 3 | `storyboard-composer` | zip3 pattern | Build 3x3 sketch storyboard with 9-shot list via Nano Banana 2 | `storyboard/storyboard_3x3.png`, `storyboard/shotlist.md` |
| 4 | `final-prompt-composer` | loose images pattern | Assemble final Seedance prompt using `[REF_STORYBOARD]`, `[REF_GIRL_MODEL]`, `[REF_PHOENIX_MODEL]`, `[REF_BACKGROUND]` tokens with strict priority rules | `prompt/seedance_prompt.md` |
| 5 | `seedance-runner` | — | Call Seedance 2 / Seedance 2 Lite on Replicate with all refs + final prompt | `video/scene_<timestamp>.mp4` |

Each agent prompt lives in `agents/*.md`. The orchestrator loads the prompt, fills in the shared context (run folder, model slugs, user answers, previous outputs), and spawns the agent. After the agent returns, its outputs are registered in `run_state.json` before the next stage starts.

## Continuous improvement (/arise + /karpathy + /ralphinho-rfc-pipeline)

After every successful run:

1. **`/arise`** — sync the project wiki: append this run's concept, style, model choice, and which shots scored best to `wiki/runs.md`. Carry over unresolved quality issues as next-run TODOs.
2. **`/karpathy`** — measurable metric = user's 1–10 rating of final video. Each run proposes ONE small experiment (e.g., "use longer prompt for close-ups", "split storyboard into two passes", "bias style-env agent toward ink-line-heavy refs"). Experiments that improve the rating are promoted into the agent prompts; regressions are discarded.
3. **`/ralphinho-rfc-pipeline`** — for non-trivial agent changes (new agent, schema change, new Replicate model), write an RFC in `rfcs/`, run the quality gate (lint + dry-run + smoke test of Replicate auth), merge via the skill's internal merge queue (see `scripts/rfc_gate.py`).

Each run's instincts land in `INSTINCTS.md` and feed the next run's agent prompts.

## Files

```
seedance-animator/
├── SKILL.md                  # this file
├── .env.example              # REPLICATE_API_TOKEN=
├── README.md                 # quick start for the user
├── agents/
│   ├── character-designer.md
│   ├── style-environment.md
│   ├── storyboard-composer.md
│   ├── final-prompt-composer.md
│   └── seedance-runner.md
├── scripts/
│   ├── replicate_client.py   # shared Replicate wrapper
│   ├── nano_banana.py        # Nano Banana 2 helper
│   ├── seedance.py           # Seedance 2 / Lite helper
│   ├── orchestrator.py       # sequential agent runner + run_state.json
│   └── rfc_gate.py           # /ralphinho-rfc-pipeline quality gate
├── rfcs/                     # RFCs written per run (created on first run)
├── wiki/                     # /arise wiki (created on first run)
└── INSTINCTS.md              # /karpathy learnings accumulated across runs
```

## How the orchestrator runs

```bash
# From the folder where the user wants outputs:
python <skill_path>/scripts/orchestrator.py
```

The orchestrator:
1. Loads `.env` from the skill folder (falls back to CWD `.env`).
2. Walks the 5-step conversation (prints questions, reads stdin).
3. Creates `./seedance_run_<timestamp>/` in `$PWD`.
4. Spawns each agent via the Claude Code `Agent` tool in order, waiting for each to complete before the next.
5. Writes `run_state.json` after every stage so a crash can resume.
6. On completion, runs `/arise` sync + logs a `/karpathy` experiment stub.

## Replicate model slugs (confirmed present 2026-04)

- Image: `google/nano-banana-2` — text-to-image + image-edit
- Video hi-quality: `bytedance/seedance-2`
- Video lite: `bytedance/seedance-2-lite`

If a slug returns 404 at runtime, ask the user for the exact slug from their Replicate playground URL.

## One-liner behavior inside Claude Code

When the user invokes this skill:

1. Read this SKILL.md.
2. Run the 5 conversation questions inline (don't spawn an agent for the chat — do it directly with AskUserQuestion or plain text prompts).
3. Verify `REPLICATE_API_TOKEN` is set. If not, stop and tell the user to paste it into `.env`.
4. Create `./seedance_run_<timestamp>/` in `$PWD`.
5. Spawn the 5 agents sequentially via the Agent tool, passing each agent its prompt from `agents/*.md` plus the shared run context.
6. After the last agent returns a video path, show it to the user and ask for a 1–10 rating.
7. Append the rating + what worked/didn't to `INSTINCTS.md` and propose one `/karpathy` experiment for the next run.
