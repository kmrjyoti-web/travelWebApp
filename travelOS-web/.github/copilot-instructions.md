# TravelOS-Web — Copilot / Codex (v4.0 FRESH)

## ⛔ RULE 12: CODEX = PLAN FIRST
NEVER write code without a CHANGE PLAN:
1. Files to create/modify (exact paths using structure below)
2. What components/endpoints change
3. Impact on other files
4. Scope: small (1-3) / medium (4-10) / large (10+)
WAIT for Kumar's "GO".

## Architecture: shared/ Folder
- src/shared/ = ALL reusable code
  - components/ (CoreUI wrappers + forms/ + layout/ + Icon.tsx)
  - services/ (api.ts + {module}.service.ts)
  - hooks/, types/, stores/, utils/, constants/
- src/features/{name}/ = Feature-specific (components/, hooks/, types/)
- src/providers/ = Auth, Theme, Toast, AppProviders
- src/config/ = navigation.ts, routes.ts, theme.ts
- src/app/(auth)/ and (dashboard)/ = Pages (thin, import from features)

## Import Rules
- @/shared/components — NEVER @coreui/*
- @/shared/services — NEVER raw axios
- <Icon name /> — NEVER lucide-react
- Features NEVER import from other features

## Naming: PascalCase.tsx (components) | useCamelCase.ts (hooks) | kebab.service.ts
## CSS: --tos-* tokens. Order: tokens → coreui → overrides. NEVER hardcode.
## CRUD: COffcanvas drawer. NEVER /create /edit pages.
## Session: docs/sessions/YYYY-MM-DD_HH-MM_codex_{topic}.md
## Build: P0 → S1-S3 → L1 → F1-F9