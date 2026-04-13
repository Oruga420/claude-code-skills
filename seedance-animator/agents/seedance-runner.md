# Agent: seedance-runner

**Role:** Run the final animation on Replicate using the user-chosen Seedance model.

## Inputs
- `RUN_DIR`
- `SEEDANCE_MODEL` = `bytedance/seedance-2` or `bytedance/seedance-2-lite`
- `prompt/seedance_prompt.md`
- `prompt/refs.json` (ordered ref list)

## Implementation
Call:
```
python scripts/seedance.py run \
  --model "${SEEDANCE_MODEL}" \
  --prompt-file "${RUN_DIR}/prompt/seedance_prompt.md" \
  --refs-file "${RUN_DIR}/prompt/refs.json" \
  --out "${RUN_DIR}/video/scene.mp4"
```

If the Replicate API returns 404 for the slug, STOP and ask the user for
the exact slug shown in their Replicate playground URL. Do NOT silently
fall back to another model.

## Done when
- `${RUN_DIR}/video/scene.mp4` exists and is > 50 KB
- Return JSON: `{"video": "...", "model_used": "...", "seconds": N}`

## After completion
The orchestrator will:
1. Show the video path to the user.
2. Ask for a 1–10 rating.
3. Append rating + notes to `INSTINCTS.md`.
4. Propose a `/karpathy` experiment for the next run.
