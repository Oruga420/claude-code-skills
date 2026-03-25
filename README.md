# Claude Code Skills

A collection of reusable skills for [Claude Code](https://docs.anthropic.com/en/docs/claude-code). Each skill is a self-contained `SKILL.md` that teaches Claude specific patterns, workflows, and domain knowledge.

## Skills

| Skill | Description |
|-------|-------------|
| [conectaesamamada](./conectaesamamada/) | Connect to GCP. No fumbling, no guessing, no 10 attempts. Just follow these exact steps in order. |
| [foundation-models-on-device](./foundation-models-on-device/) | Apple FoundationModels framework for on-device LLM — text generation, guided generation with `@Generable`, tool calling, and snapshot streaming in iOS 26+. |
| [karpathy](./karpathy/) | Autonomous research and experimentation loop inspired by Karpathy's autoresearch. Continuously optimizes any measurable metric through systematic experimentation: modify, measure, keep/discard, repeat. Deploys a 4-agent team (lead, researcher, executor, analyst). |
| [liquid-glass-design](./liquid-glass-design/) | iOS 26 Liquid Glass design system — dynamic glass material with blur, reflection, and interactive morphing for SwiftUI, UIKit, and WidgetKit. |
| [long-running-harness](./long-running-harness/) | Multi-agent harness for long-running apps: Planner->Generator->Evaluator loop with context resets, sprint contracts, file-based handoffs, and calibrated QA. Based on [Anthropic's harness design patterns](https://www.anthropic.com/engineering/harness-design-long-running-apps). |
| [plankton-code-quality](./plankton-code-quality/) | Write-time code quality enforcement using Plankton — auto-formatting, linting, and Claude-powered fixes on every file edit via hooks. |
| [psmux](./psmux/) | Toggle psmux (terminal multiplexer) for Claude Code Agent Teams. Installs psmux and enables Agent Teams automatically. |
| [refresh-google-tokens](./refresh-google-tokens/) | Refresh both Google Cloud CLI auth and Application Default Credentials (ADC) in one step. Fixes expired token errors for gcloud commands and Python code. |
| [swift-concurrency-6-2](./swift-concurrency-6-2/) | Swift 6.2 Approachable Concurrency — single-threaded by default, `@concurrent` for explicit background offloading, isolated conformances for main actor types. |
| [swiftui-patterns](./swiftui-patterns/) | SwiftUI architecture patterns, state management with `@Observable`, view composition, navigation, performance optimization, and modern iOS/macOS UI best practices. |
| [visa-doc-translate](./visa-doc-translate/) | Translate visa application documents (images) to English and create a bilingual PDF with original and translation. |

## Installation

Copy any skill folder into your Claude Code skills directory:

```bash
# Copy a single skill
cp -r long-running-harness/ ~/.claude/skills/long-running-harness/

# Or clone the whole repo and symlink what you need
git clone https://github.com/Oruga420/claude-code-skills.git
ln -s "$(pwd)/claude-code-skills/long-running-harness" ~/.claude/skills/long-running-harness
```

Once installed, Claude Code will automatically detect and load the skill when relevant to your task. You can also reference it explicitly: *"use the long-running-harness skill to build X"*.

## Contributing

PRs welcome. Each skill lives in its own folder with a `SKILL.md` file using this frontmatter format:

```yaml
---
name: skill-name
description: "One-line description of what the skill does."
---
```

## License

MIT
