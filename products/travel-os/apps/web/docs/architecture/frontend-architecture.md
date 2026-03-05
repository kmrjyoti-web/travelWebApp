# Frontend Architecture — TravelOS Web

## Overview

TravelOS Web is a Next.js 14 App Router application using TypeScript strict mode.
The architecture is layered: route groups → layouts → providers → features → shared components.

## Layering

```
Browser
  └── Next.js App Router
        ├── Route groups: (auth), (main), (admin), (public)
        │     └── Group layouts (LayoutProvider + layout shell)
        ├── AppProviders (ThemeProvider → KeyboardShortcutProvider → QueryProvider → AuthProvider)
        └── Features (self-contained; import shared/ only)
```

## State Architecture

| Domain | Store | Pattern |
|--------|-------|---------|
| UI / sidebar / theme | Zustand | `src/stores/` |
| Auth session | Zustand (persist) | `src/stores/authStore.ts` |
| Server data (API) | React Query | `src/shared/hooks/useApiQuery.ts` |
| Form state | react-hook-form | per-form |
| Layout context | React Context | `src/layouts/LayoutProvider.tsx` |

**Rule:** Zustand for synchronous client/UI state. React Query for all async server data.
Never call API endpoints from Zustand stores directly — use React Query mutations.

## Data Flow

```
User action
  → Feature component
  → useApiMutation (React Query)
  → axios client (src/lib/api/client.ts)
  → Backend /api/v1/*
  → Response → React Query cache invalidation
  → UI update via useApiQuery
```

## Error Handling

Three layers:
1. **Axios interceptor** — maps HTTP errors to `AppError` (`src/lib/errors/AppError.ts`)
2. **useErrorHandler** hook — captures thrown values in async handlers
3. **ErrorBoundary** class component — catches render-time errors (`src/components/common/ErrorBoundary/`)
4. **app/error.tsx** — Next.js global error boundary for uncaught page errors

## Code Organisation Rules

- **No direct `@coreui/*` imports** outside `src/components/*` wrappers
- **No direct `lucide-react` imports** outside `src/components/icons/icons.ts`
- **No `/create` or `/edit` routes** — use COffcanvas drawer pattern
- **No hardcoded colors** — use `--tos-*` CSS custom properties
- **Max ~300 lines/file** — split into sub-components or utility files when exceeded
- **Dynamic imports** for heavy dependencies (recharts, heavy panels)

## Bundle Optimisation

- `recharts` is lazy-loaded via `next/dynamic({ ssr: false })` in DashboardPage
- `lucide-react` uses named exports for tree-shaking via `src/components/icons/icons.ts`
- `framer-motion` removed — unused (CSS transitions used instead)
- Route group layouts marked `'use client'` to prevent SSR of layout context

## Security

- JWT stored in httpOnly cookie (set by `/api/v1/auth`)
- Axios interceptor adds `Authorization: Bearer` header from Zustand authStore
- `x-tenant-id` and `x-product-id` headers on all API requests
- XSS: no `dangerouslySetInnerHTML` in production components
