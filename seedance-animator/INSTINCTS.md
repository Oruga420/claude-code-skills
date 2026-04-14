# Seedance Animator — INSTINCTS

## Run 1: Isekai Ecchi Fall (2026-04-14)
- **Rating**: ~7/10 (user loved it but missing the tackle scene)
- **Learning**: 3x3 storyboard too many panels for focused scenes. 2x2 works better.
- **Promoted**: 2x2 as default recommendation for action sequences.

## Run 2: Isekai Ecchi Fall v2 (2026-04-14)
- **Rating**: 8/10 (user loved it)
- **Learning**: Content filter blocks ecchi terms. Pre-sanitize always.

## Run 3: Izta y Popo (2026-04-14)
- **Rating**: 3/10
- **What worked**: Animation quality, effects, visual style (Moana look), environment
- **What failed**: NO STORY. Video was loose transitions, not a narrative. Skipped the actual important beats of the legend. Without deep understanding of the source material, the storyboard and prompt are superficial.
- **Root cause**: Pipeline has no research phase. It goes straight from user's brief to character design without understanding the story structure, key emotional beats, narrative arc, or visual references.
- **Experiment (PROMOTED)**: Add a `story-researcher` agent as Agent 0 that:
  1. Researches the topic/story deeply (web search, cultural context)
  2. Breaks it into narrative beats with emotional arc
  3. If user references films/art/directors, researches those to extract visual language, pacing, and storytelling techniques
  4. Outputs a "story bible" that feeds ALL downstream agents
  5. Ratio: 1 part user input → 3 parts research-informed detail
