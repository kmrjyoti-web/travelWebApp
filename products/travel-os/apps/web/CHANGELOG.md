# Changelog

All notable changes to **TravelOS Web** (`@travel-os/web`) are documented here.

Format: [Keep a Changelog](https://keepachangelog.com/en/1.0.0/)
Versioning: [Semantic Versioning](https://semver.org/spec/v2.0.0.html)

---

## [Unreleased]

### In progress
- S2 Feature Work: F2 (Itinerary Management), F3 (Booking Management), F4 (DMC/Supplier Management)
- Fix 18 pre-existing test failures
- Implement 28 todo test stubs

---

## [0.9.0] – 2026-03-03 · Phase 12 — Documentation + Session Logging

### Added
- `docs/sessions/NOTION-TEMPLATE.md` — reusable Notion session log template (metadata, objectives, files, architecture decisions, test results, build status, blockers, next steps)
- `docs/sessions/2026-03-03_04_claude_phases9-12.md` — session log for Phases 9–12

### Changed
- `README.md` — full rewrite: tech stack table, 13 golden rules reference, directory structure tree, testing commands, links to architecture docs
- `docs/architecture/frontend-architecture.md` — complete guide: layering diagram, state architecture table, data flow, error handling layers, bundle optimisation, security considerations
- `docs/architecture/layout-system.md` — 5 layout shells table, LayoutProvider pattern with code examples, CSS class anatomy, responsive behaviour, keyboard shortcuts per layout
- `docs/architecture/micro-frontend-migration.md` — migration phase history, what was migrated table, architecture decisions made during P0–S1
- `docs/components/component-api.md` — full API reference: ErrorBoundary (props table + usage), TextField, Icon, AppError, useErrorHandler

---

## [0.8.0] – 2026-03-03 · Phase 11 — Testing Infrastructure

### Added
- `playwright.config.ts` — Playwright E2E configuration: chromium + mobile-safari projects, `webServer` auto-start on port 3000, HTML reporter + list reporter, CI retries, trace/screenshot/video on failure
- `__tests__/e2e/themes.test.ts` — E2E: html element exists, dark/light `prefers-color-scheme` no JS errors, `--tos-color-primary` CSS custom property is set
- `__tests__/e2e/shortcuts.test.ts` — E2E: Escape on login page, Tab key moves focus, Ctrl+/ no keyboard JS errors, Ctrl+B on dashboard no JS errors

### Changed
- `vitest.config.ts` — added 80% coverage thresholds (lines/branches/functions/statements); extended exclude list to cover stub pages (`app/**/page.tsx`), layouts (`app/**/layout.tsx`), loading/not-found files
- `src/test-setup.ts` — added global `vi.mock('next/navigation', …)` with `useRouter`, `usePathname`, `useSearchParams`, `useParams`, `redirect`, `notFound` mocks; JSX-free (file stays `.ts` to avoid esbuild transform error)
- `__tests__/e2e/auth.test.ts` — implemented: login page loads + title check, validation on empty submit, error on invalid credentials, unauthenticated /dashboard redirects to /login, register/forgot-password pages load
- `__tests__/e2e/navigation.test.ts` — implemented: login page title, landing page, 404 not-found, sidebar toggle (authenticated), Ctrl+K search shortcut (authenticated)
- `__tests__/e2e/layout-switching.test.ts` — implemented: auth layout has no header, register has no header, dashboard/users/settings/health return non-500 HTTP status

---

## [0.7.0] – 2026-03-03 · Phase 10 — Error Handling System

### Added

#### AppError
- `src/lib/errors/AppError.ts` — typed error class
  - `ErrorCode` enum: `NETWORK_ERROR | TIMEOUT | RATE_LIMIT | UNAUTHORIZED | FORBIDDEN | SESSION_EXPIRED | NOT_FOUND | VALIDATION_ERROR | CONFLICT | SERVER_ERROR | SERVICE_UNAVAILABLE | UNKNOWN`
  - `AppError extends Error`: `code`, `status`, `context`, `isOperational` fields
  - `AppError.fromHttpStatus(status, message?)` — maps HTTP status codes to `ErrorCode`
  - `toJSON()` — serialisable representation for logging
- `src/lib/errors/AppError.test.ts` — 18 tests: defaults, explicit options, `instanceof`, `fromHttpStatus` for 9 status codes, `toJSON` with/without context

#### ErrorBoundary
- `src/components/common/ErrorBoundary/ErrorBoundary.tsx` — React class component error boundary
  - `getDerivedStateFromError` + `componentDidCatch` lifecycle methods
  - Render-prop fallback API: `fallback?: ReactNode | ((error: AppError, reset: () => void) => ReactNode)`
  - `onError` callback receives typed `AppError` (not raw `Error`)
  - Default fallback UI: `tos-error-boundary` BEM block, `role=alert`, "Try again" reset button
- `src/components/common/ErrorBoundary/ErrorBoundary.test.tsx` — 8 tests: renders children, default fallback, static fallback element, render-prop fallback, reset after rerender, `onError` callback, `AppError` code preservation

#### useErrorHandler
- `src/hooks/useErrorHandler.ts` — `useState`-based error capture hook
  - Returns `{ error, hasError, captureError, clearError }`
  - `captureError(unknown)` — coerces any thrown value via `normalizeError()` to `AppError`
  - Optional `onError` callback parameter
- `src/hooks/useErrorHandler.test.ts` — 6 tests: initial null state, captures plain Error, preserves AppError code, captures string, clears error, `onError` callback

#### error-handler utilities
- `src/utils/error-handler.ts` — implemented from empty stub
  - `normalizeError(unknown): AppError` — coerces any value to `AppError`
  - `isOperationalError(unknown): boolean` — checks `AppError.isOperational` flag
  - `handleApiError(unknown): AppError` — maps Axios-like error shapes (response, request, code) to `AppError`
- `src/utils/error-handler.test.ts` — 9 tests: `normalizeError` (AppError passthrough, plain Error, string, null, unknown object), `isOperationalError` (3 cases), `handleApiError` (401, 404, network, `ECONNABORTED`, fallthrough)

### Changed
- `src/app/error.tsx` — replaced inline `style={{}}` attributes with `tos-*` BEM classes; added `error.digest` display (`Error ID: ...`); role/aria-live compliance

---

## [0.6.0] – 2026-03-03 · Phase 9 — Performance Optimisation + Phase 8 — UI-KIT Migration Completion

### Added
- `src/features/dashboard/data/dashboard-data.ts` — all dashboard mock data and types extracted from `DashboardPage`: `Region`, `REGION_OPTIONS`, `chartTooltipStyle`, `searchMarketplaceData`, `searchWebsiteData`, `conversionMarketplaceData`, `conversionWebsiteData`, `trendingSearchData`, `trendingVisitData`
- `src/features/dashboard/components/DashboardAiPrompt.tsx` — AI prompt section with local `aiPrompt` state; imports `Icon` from shared wrapper
- `src/features/dashboard/components/DashboardKpiSection.tsx` — KPI cards grid; `KpiCard` sub-component wrapped with `React.memo`
- `src/features/dashboard/components/DashboardSearchCharts.tsx` — recharts `BarChart` for top-10 searches; lazy-loaded via `next/dynamic({ ssr: false })`
- `src/features/dashboard/components/DashboardConversionSection.tsx` — conversion items list; `ConversionItem` sub-component wrapped with `React.memo`
- `src/features/dashboard/components/DashboardTrendCharts.tsx` — recharts `AreaChart` with region selector state; lazy-loaded via `next/dynamic({ ssr: false })`

### Changed
- `src/features/dashboard/DashboardPage.tsx` — 489 → 33 lines; thin orchestrator only; recharts sections loaded via `next/dynamic({ ssr: false })` (defers ~300 KB from initial bundle)
- `tsconfig.json` — removed `"UI-KIT-main"` from `exclude` array (folder deleted)
- `.eslintrc.js` — added `overrides` block exempting `src/components/icons/icons.ts` from `no-restricted-imports` (it IS the lucide-react registry)

### Removed
- `framer-motion` — removed from `package.json` (installed but never imported in any source file)
- `UI-KIT-main/` folder — deleted (migration to `src/shared/` + `src/components/common/` complete); referenced only in JSDoc provenance comments

---

## [0.5.0] – 2026-03-03 · Phase 4.3 — Batch 2 (Data & Navigation components)

### Added

#### Badge
- `src/components/common/Badge/Badge.tsx` — status/count badge
  - 3 variants: `solid | outline | soft`
  - 3 sizes: `sm | md | lg`
  - 5 intents: `default | success | warning | error | info`
  - `dot` mode: renders a coloured indicator dot (suppresses label)
  - `count` + `maxCount` (default 99): renders `99+` overflow format
  - `removable` + `onRemove`: ×-button dismiss (aria-labelled)
- `src/components/common/Badge/types.ts` — `BadgeProps`, `BadgeVariant`
- `src/components/common/Badge/Badge.test.tsx` — 46 tests

#### Avatar + AvatarGroup
- `src/components/common/Avatar/Avatar.tsx` — user avatar with fallback chain
  - Fallback order: `src` image → `initials` text → `icon` → `DefaultSilhouette` SVG
  - Image load error tracked via `useState` — falls through to next fallback
  - `status` indicator dot: `online | away | busy | offline`
  - `shape`: `circle` (default) | `square`
  - `AvatarGroup`: overlapping stack, `max` cap with `+N` overflow bubble
- `src/components/common/Avatar/types.ts` — `AvatarProps`, `AvatarGroupProps`, `AvatarStatus`, `AvatarShape`
- `src/components/common/Avatar/Avatar.test.tsx` — ~70 tests

#### Pagination
- `src/components/common/Pagination/Pagination.tsx` — page navigator
  - Ellipsis algorithm: always shows first/last page, inserts `…` when gap > 1
  - `siblingCount` prop controls visible pages around current
  - First / Prev / Next / Last navigation buttons with disabled states
  - `perPage` + `perPageOptions` + `onPerPageChange`: per-page `<select>`
  - `total` prop: optional "X results" summary text
  - ARIA: `role=navigation`, `aria-current=page`, `aria-label` on nav
- `src/components/common/Pagination/types.ts` — `PaginationProps`
- `src/components/common/Pagination/Pagination.test.tsx` — ~40 tests

#### Tabs
- `src/components/common/Tabs/Tabs.tsx` — tabbed panel switcher
  - Controlled (`activeTab`) and uncontrolled (`defaultTab`) modes
  - `orientation`: `horizontal` (default) | `vertical`
  - Keyboard navigation: Arrow keys (direction-aware), Home/End, skips disabled tabs
  - `lazy` mode: panels render on first activation then stay mounted (hidden)
  - `disabled` per-tab item
  - ARIA: `role=tablist`, `role=tab` (`aria-selected`, `aria-controls`, `aria-disabled`), `role=tabpanel` (`aria-labelledby`, `hidden`)
- `src/components/common/Tabs/types.ts` — `TabsProps`, `TabItem`, `TabsOrientation`
- `src/components/common/Tabs/Tabs.test.tsx` — ~50 tests

#### Toast
- `src/components/common/Toast/Toast.tsx` — notification system
  - `useToast()` hook: returns `{ show, dismiss, dismissAll, toasts, position }`
  - `Toast` single item: auto-dismiss via `setTimeout` (`duration=0` = persistent), `role=alert` / `aria-live=assertive`
  - `ToastContainer`: portal to `document.body`
  - `ToastProvider`: `maxToasts` limit (oldest dropped), `position` (6 positions), incremental IDs
  - `action` prop: labelled CTA button that also dismisses
- `src/components/common/Toast/types.ts` — `ToastItemData`, `ToastProps`, `ToastProviderProps`, `ToastContextValue`, `ToastAction`, `ToastPosition`
- `src/components/common/Toast/Toast.test.tsx` — ~40 tests

#### Dropdown
- `src/components/common/Dropdown/Dropdown.tsx` — compound-component dropdown menu
  - Sub-components: `Dropdown`, `DropdownTrigger`, `DropdownMenu`, `DropdownItem`, `DropdownSeparator`, `DropdownLabel`
  - Controlled (`open`) and uncontrolled (`defaultOpen`) modes
  - `placement` (6 positions): auto-flip CSS class
  - Close on outside click (pointer-down listener), close on Escape
  - `closeOnSelect` (default `true`): close menu on item activation
  - Keyboard navigation in menu: ArrowUp/Down/Home/End, Enter/Space to select
  - `DropdownItem`: supports `icon`, `shortcut`, `destructive`, `disabled`, `href` (renders `<a>`)
  - ARIA: `role=menu`, `role=menuitem`, `aria-haspopup`, `aria-expanded`, `aria-disabled`
  - Context throws on sub-component misuse outside `Dropdown`
- `src/components/common/Dropdown/types.ts` — full type definitions
- `src/components/common/Dropdown/Dropdown.test.tsx` — ~50 tests

#### Table
- `src/components/common/Table/Table.tsx` — data table
  - Column sort (controlled): click header cycles `none → asc → desc → none`, Enter/Space keyboard support
  - Row selection: checkbox per row + select-all with indeterminate state
  - `getRowKey` for stable identity
  - Sticky header via `--sticky-header` wrapper class
  - Loading skeleton rows (`loadingRowCount`, `aria-hidden`)
  - Empty state: default message, custom `emptyMessage`, custom `emptyContent` slot
  - `onRowClick` row handler
  - ARIA: `aria-sort`, `aria-selected`, `aria-label` on checkboxes, `<caption>`
  - Responsive horizontal scroll via wrapper div
- `src/components/common/Table/types.ts` — `TableProps`, `TableColumn`, `TableSelectionProps`, `SortState`, `SortDirection`
- `src/components/common/Table/Table.test.tsx` — ~55 tests

---

## [0.4.0] – 2026-03-03 · Phase 4.2 — Button component

### Added
- `src/components/common/Button/Button.tsx` — full Button implementation
  - 6 variants: `primary | secondary | outline | ghost | destructive | link`
  - 3 sizes: `sm | md | lg`
  - `disabled` state: native `disabled` attr + `aria-disabled` + `tos-btn--disabled` + tabIndex=-1
  - `loading` state: `aria-busy` + `tos-btn__spinner` element + `tos-btn--loading` (implies disabled)
  - `leftIcon` / `rightIcon` slots: aria-hidden wrapper spans
  - Polymorphic `as="a"`: renders `<a>` with `href`/`target`/`rel`; no native `disabled` on anchor
  - Children wrapped in `tos-btn__label` span for flex layout
  - Class composition order: `tos-btn → size → variant → disabled → loading → extra`
- `src/components/common/Button/types.ts` — `ButtonProps` extending `InteractiveProps`
  - Adds: `variant`, `size`, `leftIcon`, `rightIcon`, `as`, `type`, `href`, `target`, `rel`, `form`, `name`, `value`, `style`
- `src/components/common/Button/Button.test.tsx` — 55 tests

---

## [0.3.0] – 2026-03-03 · Phase 4.1 — Shared Component Standards

### Added
- `src/components/common/types.ts` — canonical type system for all UI components
  - `Size` (`sm | md | lg`) + `SIZES` array + `SIZE_CONFIG` metadata
  - `Variant` (6 variants) + `VARIANTS` array + `VARIANT_CONFIG` (isDestructive flag)
  - `Intent` (5 intents) + `INTENTS` array + `INTENT_CONFIG` (ariaLive / ariaRole)
  - `ComponentState` (7 states) + `COMPONENT_STATES` array
  - `ColorScheme` type
  - `BaseProps`, `InteractiveProps`, `FormFieldProps` — base prop interfaces
  - `PolymorphicProps<E, P>` — `as`-prop pattern for polymorphic components
  - Type guards: `isSize()`, `isVariant()`, `isIntent()`, `isComponentState()`
- `src/components/common/utils.ts` — class-building utilities
  - `cls(...parts)` — conditional class string builder (falsy-safe, array-flattening)
  - `bem(block, modifiers)` — BEM block + modifier composer
  - `el(block, element)` — BEM element class builder
  - `sizeClass(block, size)` — size modifier suffix helper
  - `variantClass(block, variant)` — variant modifier suffix helper
  - `intentClass(block, intent)` — intent modifier (no-op for 'default')
  - `componentCls(block, opts)` — primary class builder: composes all modifiers in order
  - `isDarkMode()` — reads `data-theme="dark"` from document root (SSR-safe)
  - `setDarkMode(dark)` — sets/removes `data-theme` attribute on document root
  - `getSystemColorScheme()` — reads `prefers-color-scheme` media query
- `src/components/common/types.test.ts` — 65 tests
- `src/components/common/utils.test.ts` — 75 tests (including full round-trip integration tests)
- Updated `src/components/common/index.ts` — exports `types` and `utils` before individual components

### Standards established (applies to all Phase 4 components)
- **Folder structure**: `ComponentName/ComponentName.tsx`, `types.ts`, `index.ts`, `ComponentName.test.tsx`
- **TypeScript**: strict mode, no `any`, `ComponentProps<'native-el'>` for native prop spreading
- **Sizes**: every interactive component supports `sm | md | lg`
- **Variants**: every button-like component supports ≥ 3 variants from the standard set
- **States**: `disabled`, `loading`, `error` expressed as CSS BEM modifiers via `componentCls()`
- **Dark mode**: CSS-only via `--tos-*` custom properties + `[data-theme="dark"]` selectors
- **ARIA**: every component carries `data-testid`, `aria-label` on root; interactive components carry the full `InteractiveProps` ARIA set
- **Test coverage**: ≥ 80% per component; test files co-located in component folder
- **No Tailwind in component code**: use `componentCls()` + `--tos-*` CSS variables only

---

## [0.2.0] – 2026-03-03 · Phase 3 — Multi-Layout System

### Added
- `src/layouts/types.ts` — `LayoutName`, `ThemeConfig`, `KeyboardShortcutDef`, `LayoutConfig`, `LayoutRegistry`, `LayoutContextValue`, `RouteLayoutEntry`, `assertNever()`
- `src/layouts/registry.ts` — `LAYOUT_REGISTRY` (5 entries) + `ROUTE_LAYOUT_MAP`
- `src/layouts/LayoutProvider.tsx` — route-based layout detection, lazy loading, keyboard shortcut registration, `useLayout()` hook
- **Default Layout** (`src/layouts/default/`) — sidebar + header + footer; `NAV_ITEMS`; Ctrl+K search, Ctrl+B sidebar, Ctrl+/ help; localStorage persistence
- **Auth Layout** (`src/layouts/auth/`) — split-screen card; illustration panel; `tos:auth-escape` custom event; 1rem base font
- **Admin Layout** (`src/layouts/admin/`) — dark scheme; 280px sidebar; system status panel; admin toolbar; `ADMIN_NAV_ITEMS`; Ctrl+U/S/L shortcuts
- **Public Layout** (`src/layouts/public/`) — transparent → solid header on scroll; 5-item marketing nav; sign-in/get-started CTAs; mobile hamburger; rich footer (4-column sitemap + 5 social links + newsletter form with success state)
- **Minimal Layout** (`src/layouts/minimal/`) — back button + centred title only; `MinimalProgress` segmented bar (role=progressbar, clamping, labels); Esc + Alt+← → back; no sidebar
- All layouts: `applyXxxTheme()` on mount, keyboard shortcut cleanup on unmount, full ARIA compliance, skip links

### Test coverage
- 53 layout files × avg 25 tests = ~1 300 tests across Phases 3.1 – 3.6

---

## [0.1.0] – 2026-03-02 · Phase 0 + Phase 2.1

### Added
- P0 Migration: Next.js 14 + TypeScript strict baseline
  - 0 TypeScript errors, 22/22 tests passing, 0 ESLint errors, build passes
  - Removed UI-KIT-main staging folder
- Phase 2.1 Folder structure scaffolding: 103 directories, 286 files
- `src/layouts/` directory with 5 layout stub entries
- `src/components/common/` directory with 12 component stubs
  (Avatar, Badge, Button, Card, Dropdown, Input, Modal, Pagination, Select, Table, Tabs, Toast)
- React Query provider (`src/providers/QueryProvider.tsx`), typed hooks, query key factory
- `src/components/icons/` — Icon wrapper + lucide-react registry (`icons.ts`)
- `src/config/constants.ts` — APP_NAME, APP_VERSION, PRODUCT_ID, API_BASE

---

## Versioning policy

| Bump | When |
|---|---|
| **patch** `0.x.y` | Bug fixes, test fixes, doc updates — no new exports |
| **minor** `0.x.0` | New component, new layout, new hook, new exported type |
| **major** `x.0.0` | Breaking API change (rename/remove export, change prop contract) |

> Pre-1.0 (`0.x.y`): minor bumps may include breaking changes between phases.
> After 1.0.0 (production launch): strict semver applies.
