# Migration Log

## Phase 1 — UI-KIT Audit (2026-03-03)
- Audited all 27 UI-KIT-main source files
- Created: `ui-kit-inventory.md`, `dependency-map.mermaid`
- Status: ✅ Complete

## Phase 2 — Folder Structure (2026-03-03)
- Created complete monorepo-ready folder structure
- Location: `products/travel-os/apps/web/`
- Status: ✅ Complete

## Phase 3 — Component Migration (2026-03-03)

### Hooks

| Source | Destination | Changes |
|--------|-------------|---------|
| `UI-KIT-main/hooks/use-mobile.ts` | `src/hooks/useIsMobile.ts` | Refactored to wrap new `useMediaQuery` hook; renamed camelCase; SSR-safe |
| _(new)_ | `src/hooks/useMediaQuery.ts` | Generic SSR-safe matchMedia hook; `useIsMobile` is a thin wrapper; 5 vitest tests |

### Styles

| Source | Destination | Changes |
|--------|-------------|---------|
| Tailwind classes in UI-KIT components | `src/styles/components/overrides.css` | All `tos-*` BEM class definitions for layout shells, header, sidebar, footer, search overlay, help panel, notification panel, user dropdown, TextField, KPI card, chart card, dashboard AI prompt, theme settings panel, conversion list items; uses `--tos-*` custom properties; NO hardcoded colours |
| `src/styles/globals.css` | same | Added `@import './components/overrides.css'` at end of cascade |

### UI Primitives

| Source | Destination | Changes |
|--------|-------------|---------|
| `UI-KIT-main/components/ui/TextField.tsx` | `src/components/forms/TextField/TextField.tsx` | Tailwind → `tos-text-field` BEM classes; removed `cn()`/`clsx`/`tailwind-merge`; strict TypeScript (no `any`); floating label via CSS `:not(:placeholder-shown)` trick; accessible `htmlFor` + `useId`; 14 vitest tests |

### Features — Settings

| Source | Destination | Changes |
|--------|-------------|---------|
| `UI-KIT-main/components/ThemeSettings.tsx` | `src/features/settings/ThemeSettingsPanel.tsx` | Tailwind → `tos-theme-settings__*` classes; Framer Motion → CSS transitions; custom ThemeContext → `useThemeContext`; lucide-react direct → `Icon` wrapper; supports light/dark/system modes + product theme switching (travel-os/food-os/crm-os); color presets visual only (tokens drive theme); fully typed |

### Features — Dashboard

| Source | Destination | Changes |
|--------|-------------|---------|
| `UI-KIT-main/components/ItineraryDashboard.tsx` | `src/features/dashboard/DashboardPage.tsx` | Tailwind → `tos-*` BEM classes + inline `--tos-*` vars; Framer Motion removed; lucide-react direct → `Icon` wrapper; recharts kept (same lib); `any` props removed; typed `Region` discriminated union; AI prompt section retained; KPIs: 8 cards; charts: top-10 bar charts × 2, area charts × 2, conversion lists × 2 |

### Layouts

| Source | Destination | Changes |
|--------|-------------|---------|
| `UI-KIT-main/components/Header.tsx` | `src/layouts/default/DefaultHeader.tsx` (update) | **Removed** local `useEffect` keydown handlers for Ctrl+K / Ctrl+/; replaced with `useKeyboardShortcut` registrations that delegate side-effects through `TOS_SEARCH_OPEN` / `TOS_HELP_OPEN` DOM events; added `global:close` shortcut (Escape closes all overlays); imports `TOS_SEARCH_OPEN`, `TOS_HELP_OPEN` from `@/config/keyboard-shortcuts` |

### Post-migration integration
- `src/styles/globals.css` now imports `components/overrides.css` as last layer
- DefaultHeader keyboard shortcuts are registered via `KeyboardShortcutProvider` (Phase 7)
- Status: ✅ Complete
