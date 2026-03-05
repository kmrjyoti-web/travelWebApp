# CLAUDE.md — TravelOS-Web
# v4.0 FRESH — March 2, 2026 — Complete Reset
# Claude Code reads this AUTOMATICALLY.

## Project
- **Product:** TravelOS-Web — AI Travel Super-App
- **Platform:** SharedCore (TravelOS, FoodOS, CRM-OS, ClinicOS, RetailOS)
- **Backend:** COMPLETE | **Frontend:** FRESH START

## Stack
- Next.js 14 (App Router) + TypeScript strict + pnpm
- @coreui/react + @coreui/react-pro (via shared/components/ wrappers ONLY)
- lucide-react (via shared/components/Icon ONLY)
- Zustand | recharts | axios | zod
- CSS: CoreUI + --tos-* tokens (NO Tailwind)

---

## ⛔ 13 GOLDEN RULES

### 1. SHARED FOLDER
All reusable code in `src/shared/`. Sub-folders:
- components/ (CoreUI wrappers + forms/ + layout/ + Icon)
- services/ (API client + per-module services)
- hooks/ (useAuth, useApi, usePagination, useDebounce...)
- types/ (API types matching backend DTOs)
- stores/ (Zustand: auth, ui)
- utils/ (format, validation, cn, storage)
- constants/ (api, app, roles)

### 2. DIRECT DEVELOPMENT
Build directly in target folders. No staging. No temp. Code where it lives.

### 3. COMPONENT WRAPPERS (shared/components/)
Thin: forwardRef + spread. Features: `import from '@/shared/components'`.
NEVER `@coreui/*` in features. ESLint blocks it.

### 4. ICON WRAPPER
`<Icon name="..." />` from `@/shared/components`. NEVER lucide-react in features.

### 5. SHARED SERVICES (shared/services/)
One service file per backend module. Uses shared api.ts client.
NEVER duplicate API logic in features.

### 6. ESLINT ENFORCED
no-restricted-imports: @coreui/*, lucide-react, cross-feature imports.

### 7. FEATURE FOLDERS
`src/features/{name}/` → components/, hooks/, types/, index.ts
Feature-only code. If reused → move to shared/.

### 8. DRAWER CRUD
COffcanvas drawers. NEVER /create /edit pages.

### 9. CSS TOKENS
--tos-* custom properties. globals.css order: tokens → coreui → overrides.
NEVER hardcode colors. Dark mode: [data-coreui-theme='dark'].

### 10. SESSION LOGGING
docs/sessions/YYYY-MM-DD_HH-MM_{agent}_{topic}.md. NEVER delete.

### 11. GEMINI = UI ONLY ⛔
Gemini: shared/components/**, features/*/components/**, styles/** ONLY.
NEVER: services, stores, hooks(API), providers, config.

### 12. CODEX = PLAN FIRST ⛔
Show change plan (files, impact, scope). Wait for Kumar's GO.

### 13. CLAUDE = FULL TEST ⛔
5-level validation every session:
- L1 Unit: npx vitest run
- L2 Architecture: tsc --noEmit + eslint + grep forbidden imports
- L3 Smoke: next build + pages load
- L4 Integration: API CRUD + auth flow
- L5 API Contract: DTOs match + error handling

---

## Folder Structure (Key Paths)
```
src/
  app/(auth)/          ← Auth pages (no sidebar)
  app/(dashboard)/     ← Dashboard pages (sidebar+header)
  shared/
    components/        ← Wrappers + forms/ + layout/ + Icon
    services/          ← api.ts + *.service.ts
    hooks/             ← Global hooks
    types/             ← API types
    stores/            ← Zustand
    utils/             ← Helpers
    constants/         ← App constants
  features/            ← Feature modules
  providers/           ← Auth, Theme, Toast, AppProviders
  config/              ← navigation.ts, routes.ts, theme.ts
  styles/              ← globals.css, theme-tokens.css, overrides.css
  __tests__/           ← unit/, integration/, contracts/
docs/sessions/         ← Session logs
```

## Path Aliases
@/* → src/*, @/shared/* → src/shared/*, @/features/* → src/features/*

## Build: P0 → S1-S3 → L1 → F1-F9

## Pre-Flight
□ Read LAST session log
□ Create NEW session log
□ Ready for 5-level test at end