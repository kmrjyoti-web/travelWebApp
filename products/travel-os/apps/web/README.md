# TravelOS Web — `@travel-os/web`

AI-Powered Travel Industry Super-App — Next.js 14 frontend.

## Quick Start

```bash
pnpm install
pnpm dev        # http://localhost:3000
pnpm build      # production build
pnpm test:run   # unit tests (Vitest)
pnpm test:e2e   # e2e tests (Playwright)
```

## Stack

| Layer | Library |
|-------|---------|
| Framework | Next.js 14 (App Router) + TypeScript strict |
| UI | @coreui/react + @coreui/react-pro (via wrappers only) |
| Icons | lucide-react (via `<Icon name="..." />` only) |
| CSS | --tos-* CSS custom properties, tos-* BEM classes |
| Client state | Zustand |
| Server state | @tanstack/react-query v5 |
| Forms | react-hook-form + zod |
| Charts | recharts (lazy-loaded) |
| HTTP | axios |
| Tests | Vitest + @testing-library/react + Playwright |

## 13 Golden Rules

1. **SHARED FOLDER** — all reusable code in `src/shared/` (no direct @coreui/* imports in features)
2. **DIRECT DEVELOPMENT** — no staging/temp folders, commit to working directories
3. **COMPONENT WRAPPERS** — CoreUI via `src/components/*` wrappers only
4. **ICON WRAPPER** — `<Icon name="..." />` from `src/components/icons/Icon`, never lucide-react direct
5. **SHARED SERVICES** — all API/auth/storage in `src/lib/services/` or `src/features/*/services/`
6. **ESLINT ENFORCED** — `no-restricted-imports` blocks direct @coreui/* and lucide-react in features
7. **FEATURE FOLDERS** — `src/features/{name}/` is self-contained (components, hooks, services, types)
8. **DRAWER CRUD** — use COffcanvas drawers for create/edit, NEVER `/create` or `/edit` routes
9. **CSS TOKENS** — `--tos-*` custom properties, never hardcode colors
10. **SESSION LOGGING** — every AI session logged in `docs/sessions/`
11. **GEMINI = UI ONLY** — Gemini agent handles only UI/styling tasks
12. **CODEX = PLAN FIRST** — Codex agent must produce a plan before coding
13. **CLAUDE = FULL 5-LEVEL TEST** — Claude agent runs full test pyramid

## Directory Structure

```
src/
├── app/                    Next.js App Router pages + layouts
│   ├── (admin)/            Admin route group (dark layout)
│   ├── (auth)/             Auth route group (login, register)
│   ├── (main)/             Main route group (dashboard, settings)
│   ├── (public)/           Public route group (landing)
│   ├── api/v1/             API routes (health, auth)
│   ├── error.tsx           Global error boundary UI
│   └── layout.tsx          Root layout (AppProviders)
├── components/             Shared UI components
│   ├── common/             Button, Table, Dropdown, Badge, Toast, etc.
│   ├── forms/              LoginForm, TextField, etc.
│   ├── icons/              Icon wrapper + icons registry
│   └── common/ErrorBoundary/ React error boundary
├── features/               Feature modules (self-contained)
│   ├── auth/               Auth hooks, services, types
│   ├── dashboard/          Dashboard page + sub-components
│   └── settings/           Theme settings panel
├── hooks/                  Cross-feature hooks (useErrorHandler, etc.)
├── layouts/                Layout shells (default, admin, auth, public, minimal)
├── lib/                    Libraries and utilities
│   ├── errors/             AppError class + ErrorCode enum
│   └── services/           API client setup
├── providers/              React context providers (Theme, Query, Auth, Keyboard)
├── stores/                 Zustand stores (auth, theme)
├── styles/                 Global CSS + tos-* BEM overrides
└── utils/                  Utility functions (error-handler, etc.)
```

## Testing

```bash
pnpm test:run              # Vitest unit + component tests
pnpm test:coverage         # Coverage report (80% thresholds)
pnpm test:e2e              # Playwright e2e (requires pnpm dev)
```

Coverage thresholds: 80% lines / branches / functions / statements.

## Docs

- [Frontend Architecture](docs/architecture/frontend-architecture.md)
- [Layout System](docs/architecture/layout-system.md)
- [Component API](docs/components/component-api.md)
- [Micro-Frontend Migration](docs/architecture/micro-frontend-migration.md)
- [State Management](docs/architecture/state-management.md)
