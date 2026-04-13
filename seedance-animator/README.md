# Seedance Animator

Interactive anime video pipeline — Nano Banana 2 for stills, Seedance 2 / 2 Lite for animation, all via Replicate.

## Setup

```bash
cp seedance-animator/.env.example seedance-animator/.env
# paste your REPLICATE_API_TOKEN inside .env
pip install replicate python-dotenv requests pillow
```

## Run

From the folder where you want the outputs saved:

```bash
python /path/to/seedance-animator/scripts/orchestrator.py
```

Or invoke the skill inside Claude Code:

```
/seedance-animator
```

## What happens

1. Claude chats with you: boceto, idea, art style, Seedance model, references.
2. Agent 1 (character-designer) — Nano Banana 2 → character sheet(s).
3. Agent 2 (style-environment) — Nano Banana 2 → art-style lock + background.
4. Agent 3 (storyboard-composer) — Nano Banana 2 → 3x3 storyboard + 9-shot list.
5. Agent 4 (final-prompt-composer) — assembles Seedance prompt with strict ref priority.
6. Agent 5 (seedance-runner) — Seedance 2 or 2 Lite → final MP4.

All outputs land in `./seedance_run_<timestamp>/` in your current working directory.

## Continuous improvement

- `/arise` keeps a wiki of every run.
- `/karpathy` proposes one tuning experiment per run, measured by your 1–10 rating.
- `/ralphinho-rfc-pipeline` gates any non-trivial agent change behind an RFC + smoke test.
