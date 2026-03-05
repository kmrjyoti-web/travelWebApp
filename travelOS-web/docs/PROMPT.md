# TravelOS-Web — Master Prompt
# v4.0 FRESH — March 2, 2026 — Complete Reset, Zero Base
# Master source. All config files derive from this.

## 1. PROJECT

**TravelOS-Web** — AI Travel Industry Super-App on SharedCore Platform.
Backend: COMPLETE (10 phases). Frontend: FRESH START.

### Stack
| Layer | Tech |
|-------|------|
| Framework | Next.js 14 (App Router) + TypeScript strict |
| UI | @coreui/react + @coreui/react-pro (via shared/components/) |
| Icons | lucide-react (via shared/components/Icon) |
| State | Zustand |
| Charts | recharts |
| HTTP | axios (shared/services/api.ts) |
| CSS | CoreUI + --tos-* tokens (NO Tailwind) |
| Validation | zod |
| PM | pnpm |

---

## 2. THE 13 GOLDEN RULES

### Rule 1: SHARED FOLDER
- All reusable code in `src/shared/`
- Sub-folders: components/, services/, hooks/, types/, stores/, utils/, constants/
- Features import from `@/shared/`
- If used by 2+ features → shared/. If 1 feature → features/{name}/

### Rule 2: DIRECT DEVELOPMENT
- Build directly in target folders. No staging, no temp, no promotion.

### Rule 3: COMPONENT WRAPPERS (shared/components/)
```typescript
'use client'
import React from 'react'
import { CButton as CoreButton } from '@coreui/react'
import type { CButtonProps } from '@coreui/react'

export const CButton = React.forwardRef<HTMLButtonElement, CButtonProps>(
  (props, ref) => <CoreButton ref={ref} {...props} />
)
CButton.displayName = 'CButton'
export type { CButtonProps }
```
- Features: `import { CButton } from '@/shared/components'`
- NEVER: `import { CButton } from '@coreui/react'` in features

### Rule 4: ICON WRAPPER
```typescript
import { Icon } from '@/shared/components'
<Icon name="map" size={16} />
```

### Rule 5: SHARED SERVICES
- `shared/services/api.ts` — axios instance + interceptors
- `shared/services/{module}.service.ts` — one per backend module
- Features: `import { authService } from '@/shared/services'`

### Rule 6: ESLINT
- no-restricted-imports: @coreui/*, lucide-react, cross-feature imports

### Rule 7: FEATURE FOLDERS
```
src/features/{name}/
  components/   ← Feature-only UI
  hooks/        ← Feature-only hooks
  types/        ← Feature-only types
  index.ts      ← Barrel export
```

### Rule 8: DRAWER CRUD
- COffcanvas drawers. NEVER /create /edit routes.

### Rule 9: CSS TOKENS
- `--tos-*` custom properties in `src/styles/theme-tokens.css`
- globals.css order: theme-tokens → coreui.min.css → overrides.css
- Dark mode: `[data-coreui-theme='dark']`

### Rule 10: SESSION LOGGING
- `docs/sessions/YYYY-MM-DD_HH-MM_{agent}_{topic}.md`
- NEVER delete. Log files, decisions, issues, tests, next steps.

### Rule 11: GEMINI = UI ONLY ⛔
- ALLOWED: shared/components/**, features/*/components/**, styles/**
- FORBIDDEN: shared/services/**, shared/stores/**, providers/**, config/**
- Flag API needs for Claude Code.

### Rule 12: CODEX = PLAN FIRST ⛔
- Change plan before coding: files, impact, scope. Wait for GO.

### Rule 13: CLAUDE CODE = FULL TEST ⛔
| Level | Type | Command |
|-------|------|---------|
| 1 | Unit | `npx vitest run` |
| 2 | Architecture | `tsc --noEmit && eslint . && grep` |
| 3 | Smoke | `next build` |
| 4 | Integration | API CRUD + auth flow |
| 5 | API Contract | DTOs + error handling |

---

## 3. FOLDER STRUCTURE

```
travelOS-web/
  .github/
    workflows/ci.yml, cd.yml, tests.yml
    copilot-instructions.md
    PULL_REQUEST_TEMPLATE.md
  .gemini/settings.json
  .husky/pre-commit, commit-msg
  public/
    assets/fonts/, images/, svgs/
    favicon.ico, robots.txt, manifest.json
  docs/
    PROMPT.md
    sessions/_SESSION_TEMPLATE.md
  src/
    app/
      layout.tsx                    # Root (providers + globals.css)
      loading.tsx, error.tsx, not-found.tsx
      (auth)/
        layout.tsx                  # Centered, no sidebar
        login/, register/, forgot-password/, otp-verify/
      (dashboard)/
        layout.tsx                  # DefaultLayout (sidebar+header)
        dashboard/, itinerary/, bookings/, marketplace/
        customers/, agents/, ai-tools/, analytics/
        influencer/, settings/
    shared/
      components/
        Button.tsx, Card.tsx, Modal.tsx, Offcanvas.tsx
        Table.tsx, Badge.tsx, Spinner.tsx, Toast.tsx
        Tooltip.tsx, Dropdown.tsx, Pagination.tsx
        Tabs.tsx, Avatar.tsx, Alert.tsx, Progress.tsx
        Icon.tsx
        forms/ (Input, Select, Textarea, Checkbox, Switch, DatePicker, MultiSelect)
        layout/ (DefaultLayout, Sidebar, Header, Footer, ThemeToggle)
        index.ts
      services/
        api.ts, auth.service.ts, itinerary.service.ts
        booking.service.ts, dmc.service.ts, agent.service.ts
        marketplace.service.ts, ai.service.ts
        analytics.service.ts, influencer.service.ts
        services.service.ts, index.ts
      hooks/
        useAuth.ts, useApi.ts, usePagination.ts
        useDebounce.ts, useLocalStorage.ts, useMediaQuery.ts
        useToast.ts, index.ts
      types/
        api.types.ts, auth.types.ts, itinerary.types.ts
        booking.types.ts, common.types.ts, index.ts
      stores/ (auth.store.ts, ui.store.ts, index.ts)
      utils/ (format.ts, validation.ts, cn.ts, storage.ts, index.ts)
      constants/ (api.constants.ts, app.constants.ts, roles.constants.ts, index.ts)
    features/
      dashboard/ { components/, hooks/, types/, index.ts }
      itinerary/ { components/, hooks/, types/, index.ts }
      bookings/, marketplace/, customers/, agents/
      ai-tools/, analytics/, influencer/, settings/
    providers/
      AppProviders.tsx, AuthProvider.tsx, ThemeProvider.tsx, ToastProvider.tsx
    config/
      navigation.ts, routes.ts, theme.ts
    styles/
      globals.css, theme-tokens.css, overrides.css
    __tests__/
      unit/, integration/, contracts/, setup.ts
  CLAUDE.md, .cursorrules, .eslintrc.js, .prettierrc
  .env.local, .env.example, .gitignore, .dockerignore
  Dockerfile, docker-compose.yml
  jest.config.ts, next.config.ts, tsconfig.json, package.json
```

## 4. PATH ALIASES
```json
"@/*": ["./src/*"]
"@/shared/*": ["./src/shared/*"]
"@/features/*": ["./src/features/*"]
"@/config/*": ["./src/config/*"]
"@/providers/*": ["./src/providers/*"]
```

## 5. FILE NAMING
| Type | Convention | Example |
|------|-----------|---------|
| Component | PascalCase.tsx | Button.tsx, ItineraryList.tsx |
| Page | page.tsx | (dashboard)/itinerary/page.tsx |
| Hook | useCamelCase.ts | useAuth.ts, usePagination.ts |
| Service | kebab.service.ts | auth.service.ts |
| Type | kebab.types.ts | auth.types.ts |
| Store | kebab.store.ts | auth.store.ts |
| Constant | kebab.constants.ts | api.constants.ts |
| Utility | camelCase.ts | format.ts, validation.ts |
| Test | {file}.test.tsx | Button.test.tsx |
| Barrel | index.ts | Every folder |
| Session | YYYY-MM-DD_HH-MM_agent_topic.md | 2026-03-02_14-30_claude_p0.md |

---

## 6. BUILD PLAN
| # | ID | Build | Status |
|---|----|-------|--------|
| 1 | P0 | Project init + shared/ scaffold + theme + ESLint + Husky | 🔴 |
| 2 | S1 | shared/components/ — all wrappers + forms + layout + Icon | 🔴 |
| 3 | S2 | shared/services/ — API client + all module services | 🔴 |
| 4 | S3 | shared/hooks + types + stores + utils + constants | 🔴 |
| 5 | L1 | Layout: DefaultLayout + Sidebar + Header + Footer + ThemeToggle | 🔴 |
| 6 | F1 | Login: email/pass + OTP + Google OAuth | 🔴 |
| 7 | F2 | Dashboard: KPIs + charts + recent table | 🔴 |
| 8 | F3 | Itinerary CRUD: list + drawer + detail + day builder | 🔴 |
| 9 | F4 | Itinerary HUB: analytics dashboard | 🔴 |
| 10 | F5-F9 | Remaining features | 🔴 |

---

## 7. MULTI-AGENT

| Agent | Config | Boundary |
|-------|--------|----------|
| Claude Code | CLAUDE.md | 5-level test |
| Cursor | .cursorrules | Full access |
| Gemini | .gemini/settings.json | UI ONLY |
| Copilot | copilot-instructions.md | No boundary |
| Codex | copilot-instructions.md | Plan first |

### Handoff: Finish log → Next Steps → Kumar assigns → New agent reads last log → New log → Code

---

## 8. API REFERENCE
Base: `/api/v1` | Headers: x-tenant-id, x-product-id, Bearer token
Response: `{ success, data, error?, meta?: { page, limit, total } }`

| Module | Endpoints |
|--------|----------|
| Auth | /login, /register, /otp/send, /otp/verify, /google, /me, /refresh, /logout |
| Itinerary | CRUD + /search, /publish, /clone |
| Booking | CRUD + /confirm, /cancel, /payment |
| DMC | /profile, /itineraries, /analytics |
| Agent | CRUD + /network, /commissions |
| Marketplace | /b2b, /b2c, /search, /featured |
| AI | /generate-itinerary, /suggest, /enrich, /social-content |
| Analytics | /dashboard, /kpis, /top-viewed, /top-converted |
| Influencer | /campaigns, /commissions, /reach |
| Services | CRUD hotels, flights, transport, activities |