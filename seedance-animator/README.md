# Seedance Animator

Interactive anime video pipeline — Nano Banana 2 for stills, Seedance 2.0 for animation, all via Replicate.

## Setup

```bash
# Create .env in your home directory with your Replicate token
echo "REPLICATE_API_TOKEN=r8_your_token_here" > ~/.env

# Install dependencies
pip install replicate python-dotenv requests pillow
```

## Run

Invoke the skill inside Claude Code:

```
/seedance-animator
```

## What happens

1. Claude chats with you: boceto (2x2 or 3x3), idea, art style, references.
2. Agent 1 (character-designer) — Nano Banana 2 → character sheet(s).
3. Agent 2 (style-environment) — Nano Banana 2 → art-style lock + background.
4. Agent 3 (storyboard-composer) — Nano Banana 2 → 2x2 or 3x3 storyboard + shot list.
5. Agent 4 (final-prompt-composer) — assembles Seedance prompt with strict ref priority + content filter sanitization.
6. Agent 5 (seedance-runner) — Seedance 2.0 → final MP4.

All outputs land in `~/Desktop/Story Teller/<project_name>/` organized by asset type.

## Output structure

```
Desktop/Story Teller/<project_name>/
├── characters/    # Character sheets + manifest.json
├── style/         # Style ref + background + manifest.json
├── storyboard/    # Storyboard grid + shotlist.md
├── prompt/        # Seedance prompt + refs.json
└── video/         # Final scene.mp4 + generation script
```

## Confirmed model slugs (2026-04-14)

- Image: `google/nano-banana-2`
- Video: `bytedance/seedance-2.0`
- **DEAD**: `bytedance/seedance-2` and `bytedance/seedance-2-lite` (404)

## Continuous improvement

- `/arise` keeps a wiki of every run.
- `/karpathy` proposes one tuning experiment per run, measured by your 1-10 rating.
- `/ralphinho-rfc-pipeline` gates any non-trivial agent change behind an RFC + smoke test.
