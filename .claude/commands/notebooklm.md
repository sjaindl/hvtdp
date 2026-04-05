# NotebookLM Automation - Complete Documentation

This is the full technical documentation for the NotebookLM Python CLI, a programmatic interface to Google NotebookLM that provides capabilities beyond the web UI.

## Installation & Setup

The tool installs via PyPI (`pip install notebooklm-py`) or from GitHub releases. Users must authenticate with `notebooklm login` before executing any commands—this requirement cannot be bypassed.

## Key Capabilities

The CLI enables:
- Notebook creation and management
- Multi-format source additions (URLs, YouTube, PDFs, audio, video, images)
- Content generation across 10+ artifact types (podcasts, videos, quizzes, flashcards, infographics, reports, mind maps)
- Downloads in multiple formats (MP3, MP4, PDF, PPTX, JSON, CSV, Markdown)
- Conversational chat with source references
- Chat history management and export

## Parallel & CI/CD Support

For automated environments, the documentation provides three isolation strategies:

1. **Explicit notebook IDs** (recommended for parallel agents)—pass `-n <id>` instead of relying on context state
2. **Named profiles**—each agent uses `NOTEBOOKLM_PROFILE=agent-$ID`
3. **Isolated home directories**—set unique `NOTEBOOKLM_HOME` per agent

The CLI stores context in `~/.notebooklm/context.json`, which concurrent agents can overwrite without the above isolation.

## Error Handling & Timeouts

The tool uses standard exit codes: 0 (success), 1 (error), 2 (timeout on wait operations). Generation operations are prone to Google rate limiting; the documentation recommends waiting 5–10 minutes before retrying.

Processing times vary: source processing takes 30 seconds to 10 minutes; audio generation 10–20 minutes; video generation 15–45 minutes.

## Subagent Pattern for Long Operations

For non-blocking workflows, users spawn background agents to monitor long-running tasks:

```
notebooklm artifact wait <artifact_id> -n <notebook_id> --timeout 600
notebooklm download audio ./output.mp3 -a <artifact_id>
```

This allows the main conversation to continue while generation and download occur asynchronously.

## Language & Profiles

Language is a global account setting (80+ supported languages). Users can override per command with `--language`. Profile management enables multi-account workflows through `notebooklm profile` commands.

## Activation Triggers

The skill activates on explicit mention ("use notebooklm") or intent recognition (e.g., "create a podcast about X").
