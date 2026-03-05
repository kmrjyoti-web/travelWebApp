# Micro-Frontend Migration — TravelOS Web

## Context

TravelOS Web was migrated from `UI-KIT-main` (legacy monolith) to the current
`products/travel-os/apps/web` package in Phase 8 (2026-03-03).

## Migration Phases

| Phase | Date | Description |
|-------|------|-------------|
| P0 | 2026-03-02 | Foundational setup: layouts, providers, stores, CoreUI wrappers |
| 8.1 | 2026-03-03 | UI-KIT migration: TextField, useMediaQuery, overrides.css, ThemeSettingsPanel, DashboardPage |
| 8.2 | 2026-03-03 | UI-KIT-main deleted (784 MB); build verified; ESLint fixes |
| 9-12 | 2026-03-03 | Polish: dynamic imports, error handling, E2E tests, documentation |

## What Was Migrated

| Source (UI-KIT-main) | Destination | Changes |
|----------------------|-------------|---------|
| `hooks/use-mobile.ts` | `src/hooks/useIsMobile.ts` + `useMediaQuery.ts` | Refactored to generic hook |
| `components/ui/TextField.tsx` | `src/components/forms/TextField/` | Tailwind → tos-* BEM; forwardRef; typed |
| `components/ThemeSettings.tsx` | `src/features/settings/ThemeSettingsPanel.tsx` | Tailwind → tos-* + CSS transitions |
| `components/ItineraryDashboard.tsx` | `src/features/dashboard/DashboardPage.tsx` | Dynamic recharts; split into 6 files |
| `Header.tsx` keyboard shortcuts | `src/layouts/default/DefaultHeader.tsx` | DOM event bus pattern |
| *(no equivalent)* | `src/styles/components/overrides.css` | ~500 lines tos-* BEM classes |

## Architecture Decisions Made During Migration

1. **DOM event bus for shortcuts**: `KeyboardShortcutProvider` fires `tos:search-open` /
   `tos:help-open` CustomEvents. Layouts listen to these instead of keydown directly.
   Decouples keyboard layer from UI layer; enables SSR-safe testing.

2. **CSS cascade order** in `globals.css`:
   CoreUI → default.css → product themes → dark.css → base/reset → base/typography → **overrides.css**

3. **No Tailwind in products/web**: All styles use `--tos-*` tokens and `tos-*` BEM classes
   to stay consistent across light/dark themes and tenant themes.

4. **LayoutProvider pattern**: Route group layouts are `'use client'` and wrap the layout
   shell in `<LayoutProvider initialLayout="...">` to prevent SSR prerender errors.

5. **Dynamic recharts**: Dashboard chart sections lazy-loaded via `next/dynamic({ ssr: false })`
   to keep initial JS bundle lean (~300KB recharts deferred).

## Migration Log

Full item-by-item log: `docs/migration/migration-log.md`
