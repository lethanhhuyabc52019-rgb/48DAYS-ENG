---
type: project
created: 2026-05-25
updated: 2026-07-12
---

# Project Conventions

## Git Workflow
- Always create a new dedicated branch for major code changes.
- Branch name format should follow: `feature/[task-slug]` or `fix/[bug-slug]`.

## Supported AI platforms (AG Kit)
- AG Kit **only supports Gemini CLI and Google Antigravity**.
- Do not claim compatibility with Claude Code, Cursor, Copilot, Windsurf, or other assistants unless the user explicitly expands scope.
- Copy on the website, docs, FAQ, README, and marketing should describe AG Kit as a toolkit for Gemini CLI / Antigravity-style agent setups.

## Installer Publishing & Landing Page Conventions
- **All-in-One Packaging**: Bundle both `SMOB_Setup.exe` and `SMOB_Uninstall.exe` into a single `public/downloads/SMOB_Setup.zip`. Never expose a separate uninstaller download button.
- **Bilingual Synchronization**: 100% of text, guides, badges, and system requirements must sync dynamically between EN (BIM/AEC terminology) and VN.
- **Browser Trust Guide**: Always include the 3-step Apple Dark Glassmorphism guide (`InstallationGuideCard`) explaining Windows SmartScreen bypass (`Keep anyway` / `Run anyway`).
- **No Zalo Policy**: Never display "Zalo" on any UI component or form; use Phone / WhatsApp instead.
- **Skill Reference**: See `@[skills/installer-publishing]` for the full workflow.
