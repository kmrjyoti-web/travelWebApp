# UI-KIT-main Audit Inventory

**Auditor**: Claude (Frontend Architecture Agent)
**Date**: 2026-03-03
**Source**: Live file audit — all 27 source files read directly
**Location**: `travelOS-web/UI-KIT-main/`
**Status**: AUDIT ONLY — no files modified or deleted

---

## File Tree (source files, excluding node_modules / .next)

```
UI-KIT-main/
├── app/
│   ├── globals.css                        [ASSET/CSS]
│   ├── layout.tsx                         [LAYOUT]
│   ├── login/
│   │   └── page.tsx                       [PAGE]
│   └── page.tsx                           [PAGE]
├── components/
│   ├── Footer.tsx                         [LAYOUT]
│   ├── Header.tsx                         [LAYOUT]
│   ├── HorizontalMenu.tsx                 [LAYOUT]
│   ├── ItineraryDashboard.tsx             [COMPONENT]
│   ├── Sidebar.tsx                        [LAYOUT]
│   ├── TextFieldShowcase.tsx              [COMPONENT]
│   ├── ThemeProvider.tsx                  [THEME]
│   ├── ThemeSettings.tsx                  [THEME]
│   ├── login/
│   │   ├── BackgroundSystem.tsx           [COMPONENT]
│   │   ├── ThemeContext.tsx               [THEME]
│   │   └── UIComponents.tsx              [COMPONENT]
│   └── ui/
│       └── TextField.tsx                  [COMPONENT]
├── hooks/
│   └── use-mobile.ts                      [UTILITY]
├── lib/
│   └── utils.ts                           [UTILITY]
├── eslint.config.mjs                      [CONFIG]
├── metadata.json                          [CONFIG]
├── next-env.d.ts                          [CONFIG]
├── next.config.ts                         [CONFIG]
├── package.json                           [CONFIG]
├── package-lock.json                      [CONFIG]
├── postcss.config.mjs                     [CONFIG]
├── README.md                              [DOCS]
└── tsconfig.json                          [CONFIG]
```

**Total source files**: 27 (16 component/logic + 7 config + 1 docs + 3 CSS/assets)

---

## Complete File Inventory

### LAYOUT (6 files)

| File | Lines | Key Exports | Dependencies | Consumers | Quality |
|------|-------|-------------|--------------|-----------|---------|
| `app/layout.tsx` | 26 | `RootLayout` | ThemeProvider, ThemeSettings, globals.css | Next.js root | 2/5 |
| `components/Header.tsx` | 317 | `Header` (default) | lucide-react (18 icons), ThemeProvider, motion/react | app/page.tsx | 3/5 |
| `components/Sidebar.tsx` | 401 | `Sidebar`, `MENU_DATA`, `MenuNode` (type) | lucide-react (13 icons), ThemeProvider, motion/react | app/page.tsx, HorizontalMenu.tsx | 4/5 |
| `components/HorizontalMenu.tsx` | 113 | `HorizontalMenu` (default) | motion/react, lucide-react (2 icons), ThemeProvider, Sidebar (MENU_DATA) | app/page.tsx | 3/5 |
| `components/Footer.tsx` | 15 | `Footer` (default) | none | app/page.tsx | 2/5 |
| `app/page.tsx` | 41 | `Home` (default) | Header, Sidebar, HorizontalMenu, Footer, ThemeProvider, ItineraryDashboard | Next.js root | 3/5 |

**Layout Architecture Notes:**
- `Sidebar.tsx` is the richest file — includes `MENU_DATA`, `filterMenu`, `HighlightText`, `MenuItem`, `MenuSection`, `SubMenuItem` (all in one file)
- `Header.tsx` includes inline modals for company info and user profile (AnimatePresence dropdowns)
- Layout switching (vertical/horizontal, fluid/boxed, sidebar position) is driven by ThemeProvider context
- Mobile menu is a custom `AnimatePresence` dropdown in `Header.tsx` (not responsive — desktop-only hamburger)
- `app/layout.tsx` title is "My Google AI Studio App" — not yet branded as TravelOS

---

### THEME (3 files)

| File | Lines | Key Exports | Dependencies | Consumers | Quality |
|------|-------|-------------|--------------|-----------|---------|
| `components/ThemeProvider.tsx` | 188 | `ThemeProvider`, `useTheme`, `ThemeState` (type) | React Context, localStorage | All components | 4/5 |
| `components/ThemeSettings.tsx` | 334 | `ThemeSettings` (default) | ThemeProvider, lucide-react (3 icons), motion/react | app/layout.tsx | 4/5 |
| `components/login/ThemeContext.tsx` | 76 | `ThemeProvider` (login), `useLoginTheme`, `THEME_CONFIG`, `ThemeMode` (type) | React Context | login/page.tsx, BackgroundSystem.tsx, UIComponents.tsx | 4/5 |

**Theme Architecture Notes:**
- App-level theme: React Context + localStorage (not Zustand). State = `ThemeState` (13 properties)
- Default theme: `headerBg: '#1b6563'`, `sidebarBg: '#222d32'` — confirmed same as TravelOS defaults
- CSS variable names used: `--header-bg`, `--sidebar-bg`, `--accent-color`, `--icon-color`, `--app-bg-image`, etc. (NOT `--tos-*` prefix)
- Dark mode: uses `document.documentElement.classList.add('dark')` (Tailwind dark mode), NOT `data-coreui-theme`
- Login theme: separate React Context for login page only — 5 modes (morning/work/evening/night/holi)
- `THEME_CONFIG` contains `greeting`, Unsplash image URL, overlay class per mode
- `ThemeSettings.tsx` — 14 color presets, 11 backgrounds (picsum.photos), font size/zoom sliders, menu orientation, layout width, sidebar position
- `ThemeSettings.tsx` has a 🌴 emoji decoration in Reset button

---

### COMPONENT (5 files)

| File | Lines | Key Exports | Dependencies | Consumers | Quality |
|------|-------|-------------|--------------|-----------|---------|
| `components/ItineraryDashboard.tsx` | 393 | `ItineraryDashboard` (default), `KpiCard` | lucide-react (13 icons), recharts (6 components), motion/react | app/page.tsx | 4/5 |
| `components/TextFieldShowcase.tsx` | 111 | `TextFieldShowcase` (default) | lucide-react (5 icons), components/ui/TextField | nowhere (demo only) | 2/5 |
| `components/ui/TextField.tsx` | 203 | `TextField`, `TextFieldProps` (type) | clsx, tailwind-merge | TextFieldShowcase.tsx | 5/5 |
| `components/login/BackgroundSystem.tsx` | 131 | `BackgroundStage` | motion/react, lucide-react (Bird), ThemeContext | login/page.tsx | 4/5 |
| `components/login/UIComponents.tsx` | 212 | `GlassCard`, `LoginForm`, `OnboardingCarousel`, `ThemeSwitcher` | motion/react, lucide-react (9 icons), ThemeContext | login/page.tsx | 3/5 |

**Component Architecture Notes:**
- `ItineraryDashboard.tsx` — full dashboard with 8 KPI cards + 6 recharts (BarChart×2, AreaChart×2, conversion lists×2) + AI prompt card. Inline mock data. All Tailwind. High value.
- `TextField.tsx` — the best-written file in the kit. Material UI-style floating labels (3 variants: outlined/filled/standard), full TypeScript, forwardRef, adornments, sizes, error state. Uses Tailwind peer classes for floating label animation.
- `BackgroundSystem.tsx` — 5 animated overlays: Stars (50), DataLines (20), Particles (40 colored), Birds (8, 2 directions). Uses `motion/react` (Framer Motion v12).
- `UIComponents.tsx` — LoginForm (no validation, no OTP), OnboardingCarousel (4-step), ThemeSwitcher (5 modes + sound toggle). No react-hook-form, no zod.
- `TextFieldShowcase.tsx` — demo/docs page only. Not used in production routes.

---

### PAGE (2 files)

| File | Lines | Key Exports | Dependencies | Quality |
|------|-------|-------------|--------------|---------|
| `app/login/page.tsx` | 56 | `LoginPage` (default) | ThemeContext, BackgroundSystem, UIComponents, motion/react | 3/5 |
| `app/page.tsx` | 41 | `Home` (default) | Header, Sidebar, HorizontalMenu, Footer, ThemeProvider, ItineraryDashboard | 3/5 |

**Page Architecture Notes:**
- `app/page.tsx` — orchestrates full layout. Sidebar open/close state is local `useState` (not global store).
- `app/login/page.tsx` — login page has its OWN `ThemeProvider` wrapper (separate context from app-level). Clean separation.
- No routing guards. No authentication check.
- No other pages (no dashboard, no 404, no settings page).

---

### UTILITY (2 files)

| File | Lines | Key Exports | Dependencies | Consumers | Quality |
|------|-------|-------------|--------------|-----------|---------|
| `hooks/use-mobile.ts` | 19 | `useIsMobile` | React | none (unused in components) | 3/5 |
| `lib/utils.ts` | 6 | `cn` | clsx, tailwind-merge | TextField.tsx | 3/5 |

**Utility Notes:**
- `use-mobile.ts` — standard shadcn/ui hook for mobile detection at 768px breakpoint
- `lib/utils.ts` — standard `cn()` utility (clsx + tailwind-merge). Also duplicated in `components/ui/TextField.tsx` (lines 1-7)
- Neither utility is used outside of their direct consumers

---

### ASSET / CSS (1 file)

| File | Description | Quality |
|------|-------------|---------|
| `app/globals.css` | 3 lines: `@import "tailwindcss"` + dark variant. All styling is Tailwind classes inline | 1/5 |

---

### CONFIG (7 files)

| File | Notes |
|------|-------|
| `package.json` | Next.js 15.4.9, React 19.2.1, Tailwind 4.1.11, motion 12.23.24, lucide-react 0.553.0, recharts 3.7.0, @google/genai 1.17.0 |
| `next.config.ts` | Minimal config. `.ts` extension — incompatible with Next.js 14 |
| `tsconfig.json` | Standard Next.js TS config with `@/*` alias |
| `eslint.config.mjs` | ESLint 9 flat config, next plugin |
| `postcss.config.mjs` | `@tailwindcss/postcss` (Tailwind v4 PostCSS) |
| `metadata.json` | `{ "name": "Applet", "version": "1" }` |
| `README.md` | Auto-generated "This is a Next.js project" |

---

## Dependency Summary

| Package | Version | Purpose | Migration Action |
|---------|---------|---------|-----------------|
| `next` | ^15.4.9 | Framework | → Already using Next.js 14 |
| `react` | ^19.2.1 | UI library | → Already using React 18 |
| `motion` | ^12.23.24 | Animations | → Already installed as `framer-motion` |
| `lucide-react` | ^0.553.0 | Icons | → Already installed; use Icon wrapper |
| `recharts` | ^3.7.0 | Charts | → Already installed (v2) |
| `tailwindcss` | 4.1.11 | CSS | → NOT migrating; use --tos-* tokens |
| `clsx` + `tailwind-merge` | latest | Class util | → Use shared/utils/cn.ts |
| `@hookform/resolvers` | ^5.2.1 | Form validation | → Already have react-hook-form + zod |
| `@google/genai` | ^1.17.0 | Google AI | → Not yet needed; F7 AI module |
| `firebase-tools` | ^15.0.0 | Dev only | → Not migrating |
| `class-variance-authority` | ^0.7.1 | CVA | → Not migrating (no Tailwind) |

---

## Architecture Analysis

### Strengths (what to preserve)
1. **Header.tsx** — Full UI design: logo, hamburger, "View Login UI" button, company modal with GSTIN/FY info, WiFi/version indicator, all 7 toolbar icon+labels, mobile menu, user profile modal
2. **Sidebar.tsx** — Complete menu system: `MENU_DATA` structure, `filterMenu()`, `HighlightText`, recursive render, expand/collapse, hover-expand, search input. Well-structured.
3. **ThemeSettings.tsx** — All 7 theme sections: mode buttons, 14 color presets, individual color pickers, font/zoom controls, app background, sidebar background, layout controls, reset button
4. **ItineraryDashboard.tsx** — Rich dashboard: KPI cards, 6 charts, AI prompt card, trending selects. Direct reference for F2 feature build.
5. **TextField.tsx** — Excellent Material UI-style component with floating labels. 3 variants × 3 states × 2 sizes. Full adornment support. Best TS quality in the kit.
6. **BackgroundSystem.tsx** — Birds animation (morning/evening) is unique — NOT in current travelOS-web (only Stars/DataLines/Particles migrated)
7. **login/ThemeContext.tsx** — `THEME_CONFIG` with 5 Unsplash image URLs + greetings. Well-separated from app theme.

### Weaknesses (what NOT to port)
1. **No tests** — Zero test files across entire kit
2. **Tailwind CSS** — All styling via Tailwind classes; incompatible with CoreUI + `--tos-*` token system
3. **React Context for theme** — Not persistent (no localStorage persist for login theme), not scalable vs Zustand
4. **No form validation** — `LoginForm.tsx` has no react-hook-form/zod; no OTP form at all
5. **No auth** — No token handling, no 401 redirect, no protected routes
6. **Monolithic files** — Sidebar.tsx (401 lines, 5 components in one file), Header.tsx (317 lines, 3 sub-components)
7. **CSS variable naming** — Uses `--header-bg` not `--tos-header-bg`; would conflict with existing CSS token system
8. **next.config.ts** — `.ts` extension breaks Next.js 14 build
9. **`ItineraryDashboard` uses `any`** — `KpiCard` prop `icon: Icon` typed as `any`
10. **`GlassCard` applies `backdropFilter` via Framer Motion** — not needed; CSS handles this better

---

## Migration Gap Analysis

| Feature | UI-KIT State | travelOS-web State | Gap |
|---------|-------------|-------------------|-----|
| Header toolbar labels | ✓ Full (7 labels) | ✓ Migrated | None |
| Company modal (GSTIN/FY details) | ✓ | ✗ (only dropdown) | **Missing: Company detail modal** |
| User profile modal | ✓ | ✗ (only dropdown) | **Missing: User detail modal** |
| Mobile header menu | ✓ | ✗ | **Missing: Mobile menu** |
| Sidebar search + filter | ✓ | ✓ Migrated | None |
| Birds animation (login) | ✓ | ✗ | **Missing: Birds for morning/evening** |
| OnboardingCarousel (login) | ✓ | ✗ | **Missing: Onboarding step** |
| TextField (Material UI style) | ✓ 5/5 quality | ✗ (basic CoreUI Input) | **Missing: Advanced TextField** |
| ItineraryDashboard (F2) | ✓ Reference | ✗ (placeholder) | **Pending: F2 feature** |
| ThemeSettings panel | ✓ | ✓ Migrated | None |
| Login background + themes | ✓ | ✓ Migrated | None |
| Auth (OTP, forgot, validation) | ✗ | ✓ Added (not in kit) | N/A |
| React Query | ✗ | ✓ Added | N/A |
| Zustand | ✗ | ✓ Added | N/A |
| TypeScript strict | ✗ | ✓ Added | N/A |

---

## Recommendations for Next Migration Phases

### HIGH PRIORITY
1. **Company Detail Modal** — Port the animated `isCompanyModalOpen` panel from Header.tsx (lines 64–128): shows Financial Year, Books From date, GSTIN, Branch, Switch Company + Edit Details buttons
2. **User Profile Modal** — Port animated user dropdown panel (lines 167–231): shows Role, Status (Active), Last Login, Log Out button
3. **Mobile Header Menu** — Port `isMobileMenuOpen` + `MoreVertical` button + mobile dropdown (lines 234–296)
4. **Birds Animation** — Add `Birds` component to `BackgroundStage.tsx` for morning/evening login modes (was in original kit but not migrated)

### MEDIUM PRIORITY
5. **Advanced TextField** — `components/ui/TextField.tsx` is 5/5 quality. Port to `shared/components/forms/TextField.tsx` replacing simple Input wrapper. Adapt Tailwind classes to `--tos-*` tokens + CoreUI inputs.
6. **Onboarding Carousel** — Port `OnboardingCarousel` to auth feature (post-login step)

### LOW PRIORITY / REFERENCE
7. **ItineraryDashboard** — Use as design reference for F2 feature build. Do NOT port directly; rebuild with real API data + React Query.
8. **TextFieldShowcase** — Demo page only; no migration needed. Reference for TextField documentation.
