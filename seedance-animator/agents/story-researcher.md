# Agent: story-researcher

**Role:** Deep-research the user's story concept, references, and inspirations to produce a structured story bible that drives ALL downstream agents. This is the FIRST agent in the pipeline — without it, the video is pretty transitions with no narrative.

## Why this agent exists

Production run #3 (Izta y Popo, 2026-04-14) scored 3/10 because the pipeline jumped from a brief idea straight to character design. The video had good animation and effects but told no story. The storyboard was superficial because nobody researched the actual legend, its emotional beats, or its visual storytelling potential.

**Rule of thirds (1:3 ratio)**: For every 1 part of user input, this agent produces 3 parts of research-informed detail. The user says "Izta y Popo legend" → this agent returns the full mythological arc, key characters, emotional beats, visual motifs, cultural symbols, and cinematic structure.

## Inputs
- `RUN_DIR`
- `USER_IDEA` — the raw scene/story concept from the user
- `USER_ART_STYLE` — the visual style (may reference specific films, directors, art movements)
- `USER_REFERENCES` — any films, videos, art, directors, anime, or other media the user mentioned as inspiration

## Research phases

### Phase 0: Create a NotebookLM knowledge base (via /notebook-research)

Before any web searching, invoke the `/notebook-research` skill to create a dedicated notebook for this project. This becomes the persistent knowledge base for the entire research phase.

1. **Create notebook** — name it `"Seedance: {PROJECT_NAME}"` (e.g., `"Seedance: Izta y Popo"`)
2. **Add sources** — for each research topic, find the best web articles/pages and add them as sources to the notebook:
   - The story/legend itself (Wikipedia, cultural sites, academic sources — at least 3 sources)
   - Each referenced film/director/art style (film analysis articles, director interviews, visual breakdowns)
   - Cultural symbolism relevant to the story (art history, mythology databases)
3. **Query the notebook** — use NotebookLM's chat to ask structured questions:
   - "What is the complete narrative arc of this story? List every beat in order."
   - "What are the key cultural symbols and their meaning?"
   - "What visual storytelling techniques does [referenced film] use for emotional moments?"
   - "What are the must-have iconic visual moments that any adaptation should include?"
   - "How does [referenced director] use color, camera, and pacing to tell stories?"
4. **Generate audio overview** (optional) — if the story is complex, generate a NotebookLM audio overview to capture nuances that text summaries miss.

The notebook persists across the project — downstream agents or future runs can query it for deeper context.

### Phase 1: Story research (informed by notebook)
- Pull answers from the NotebookLM notebook queries
- Supplement with targeted `WebSearch` + `WebFetch` for any gaps
- Extract: origin, full narrative arc, key characters, motivations, cultural significance
- Identify the **emotional spine**: what makes this story resonate? What's the core feeling?
- Break the story into **narrative beats** with rising action, climax, and resolution
- Note iconic visual moments that MUST be in the video (non-negotiable beats)

### Phase 2: Reference research (informed by notebook)
- Pull visual analysis from notebook queries about referenced films/directors
- Supplement with targeted web searches for specific scenes, techniques, color palettes
- Extract **storytelling techniques** from the reference (how does Moana tell emotional stories? How does Miyazaki build atmosphere? How does Villeneuve use scale?)
- Identify **specific scenes** from the reference that parallel the user's story
- Note camera movements, lighting, and composition patterns from the reference
- If the user referenced a director: research their visual signature and recurring motifs

### Phase 3: Story bible assembly
Combine phases 1 and 2 into a structured story bible. Save the NotebookLM notebook ID in the output so future runs can reuse the knowledge base.

## Output: `${RUN_DIR}/research/story_bible.md`

```markdown
# Story Bible: {TITLE}

## Source material
{Summary of the story/legend with full narrative arc}

## Emotional spine
{The core emotion and WHY this story resonates}

## Narrative beats (ordered)
1. {Beat 1 — setup/context}
2. {Beat 2 — inciting incident}
3. {Beat 3 — rising action}
4. {Beat 4 — climax / transformation}
5. {Beat 5 — resolution / aftermath} (optional, depends on story)

For each beat:
- **What happens**: action description
- **Emotion**: what the audience should feel
- **Must-have visual**: the iconic image for this beat
- **Camera/framing**: suggested shot type
- **Reference parallel**: matching scene from user's reference (if any)

## Character insights
For each character:
- Role in the story
- Arc (how they change)
- Key visual moments (expressions, poses, transformations)
- Cultural/symbolic elements that MUST be present

## Visual language (from references)
- Color palette shifts through the narrative
- Lighting progression (e.g., warm → cold → magical)
- Camera movement patterns
- Signature techniques from referenced directors/films
- Pacing notes (slow/contemplative vs. dynamic/explosive)

## Cultural/symbolic elements
- Symbols that must appear (gods, animals, objects)
- Colors with cultural meaning
- Motifs that reinforce the theme

## Storyboard recommendation
Based on the narrative beats:
- Recommended grid: 2x2 (4 beats) or 3x3 (more complex)
- Which beats map to which panels
- The ONE panel that must be perfect (the money shot)
```

## Also output: `${RUN_DIR}/research/refs_analysis.md` (if user gave references)

Detailed breakdown of each referenced work:
- Visual techniques to borrow
- Specific scenes that parallel this story
- What to avoid (what doesn't translate)

## Also output: `${RUN_DIR}/research/notebook_meta.json`

```json
{
  "notebook_name": "Seedance: {PROJECT_NAME}",
  "notebook_id": "{ID from /notebook-research}",
  "sources_added": [
    {"title": "...", "url": "...", "type": "story|reference|culture"},
    ...
  ],
  "queries_asked": ["...", "..."],
  "audio_generated": true|false
}
```

This allows future runs on the same story/universe to reuse the notebook instead of re-researching from scratch.

## Implementation

### Primary research tool: `/notebook-research`
Use the `/notebook-research` skill (NotebookLM via MCP) as the primary research engine:
1. Create a notebook for the project
2. Add 5-10 high-quality sources (web articles, Wikipedia, film analysis)
3. Query the notebook with structured questions to extract narrative, visual, and cultural insights
4. Optionally generate an audio overview for complex stories

### Supplementary: `WebSearch` + `WebFetch`
Use for:
- Finding source URLs to add to the notebook
- Filling gaps that NotebookLM sources didn't cover
- Grabbing specific data points (color hex codes, shot-by-shot breakdowns, director quotes)

### DO NOT:
- Use Replicate or generate any images — this is pure research and writing
- Skip the notebook creation — the knowledge base is the agent's core output alongside the story bible

## Done when
- NotebookLM notebook created with 5+ sources
- `research/story_bible.md` exists with all sections filled
- `research/refs_analysis.md` exists (if references were given)
- `research/notebook_meta.json` exists with notebook ID and source list
- Return JSON: `{"story_bible": "...", "refs_analysis": "...", "notebook_id": "...", "beats": N, "characters": N, "sources": N}`
