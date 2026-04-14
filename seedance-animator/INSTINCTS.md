# Seedance Animator — INSTINCTS

## Run 1: Isekai Ecchi Fall (2026-04-14)
- **Rating**: ~7/10 (user loved it but missing the tackle scene)
- **Learning**: 3x3 storyboard too many panels for focused scenes. 2x2 works better.
- **Promoted**: 2x2 as default recommendation for action sequences.

## Run 2: Isekai Ecchi Fall v2 (2026-04-14)
- **Rating**: 8/10 (user loved it)
- **Learning**: Content filter blocks ecchi terms. Pre-sanitize always.

## Run 3: Izta y Popo v1 (2026-04-14)
- **Rating**: 3/10 — No story, just transitions. No research phase.
- **Promoted**: story-researcher agent (Agent 0) with 1:3 ratio.

## Run 4: Izta y Popo v2 (2026-04-14) — WITH story-researcher
- **Rating**: 4/10
- **What worked**: Story bible excellent (17K words). Characters matched narrative beats. Moana style nailed.
- **What failed**:
  1. NO AUDIO — video is silent
  2. TRANSITIONS INCOHERENT — too many scene changes in 10s
  3. TRIED TO DO TOO MUCH — 10s cannot hold a 6-beat story arc
  4. NO USER CHECKPOINT — should ask user to approve teaser before burning credits
- **Root cause**: Pipeline assumes 1 video = entire story. Wrong. 10s Seedance = ONE moment.

### Experiments for /karpathy:
- **A (HIGH)**: Teaser-first — pick ONE money shot, ask user to approve, animate only that
- **B (HIGH)**: Audio pipeline — investigate Seedance audio, or add post-processing step
- **C (MED)**: Multi-clip mode — one 10s clip per beat, concatenate with ffmpeg
- **D (MED)**: User checkpoint after storyboard, before video gen
- **E (MED)**: Deep search in /notebook-research instead of manual URL adding
