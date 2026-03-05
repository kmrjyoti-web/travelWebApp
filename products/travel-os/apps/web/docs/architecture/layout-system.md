# Layout System — TravelOS Web

## Overview

TravelOS has 5 layout shells, each in `src/layouts/{name}/`. A layout shell provides
the header, sidebar, footer, and main content area for a group of routes.

## Layout Shells

| Layout | Route Group | Description |
|--------|------------|-------------|
| `DefaultLayout` | `(main)` | Deep Blue header + collapsible sidebar + footer |
| `AdminLayout` | `(admin)` | Dark header with admin toolbar + icon-only sidebar |
| `AuthLayout` | `(auth)` | Centered card, animated background, no navigation |
| `PublicLayout` | `(public)` | Marketing header + footer, no sidebar |
| `MinimalLayout` | *(embedded)* | Bare shell for modals/overlays |

## LayoutProvider

`src/layouts/LayoutProvider.tsx` provides layout state via React Context:

```tsx
const { sidebarOpen, toggleSidebar, setSidebarOpen, theme, setTheme } = useLayout();
```

Route group layouts MUST wrap their shell in `<LayoutProvider initialLayout="...">`:

```tsx
// app/(admin)/layout.tsx
'use client';
import { LayoutProvider } from '@/layouts/LayoutProvider';
import { AdminLayout } from '@/layouts/admin';

export default function AdminGroupLayout({ children }) {
  return (
    <LayoutProvider initialLayout="admin">
      <AdminLayout>{children}</AdminLayout>
    </LayoutProvider>
  );
}
```

## CSS Architecture

Layouts use `--tos-*` CSS custom properties for theming. Each shell applies
its theme tokens on mount via a `useEffect` calling `applyTheme()`.

```css
/* tos-* BEM class anatomy */
.tos-default-layout          /* root wrapper */
.tos-default-header          /* sticky top header */
.tos-default-body            /* flex row: sidebar + main */
.tos-default-sidebar         /* collapsible left nav */
.tos-default-content         /* scrollable main area */
.tos-default-footer          /* bottom footer */
```

## Responsive Behaviour

Sidebar state is controlled by `sidebarOpen` from LayoutProvider.
CSS responds to `data-sidebar-open` on the layout root div:

```css
.tos-default-layout[data-sidebar-open="true"] .tos-default-sidebar { width: 256px; }
.tos-default-layout[data-sidebar-open="false"] .tos-default-sidebar { width: 64px; }
@media (max-width: 767px) {
  /* Sidebar becomes an overlay on mobile */
}
```

## Keyboard Shortcuts

Each layout registers its own keyboard shortcuts:
- `DefaultLayout`: Ctrl+K (search), Ctrl+/ (help), Ctrl+B (toggle sidebar)
- `AdminLayout`: Ctrl+U (/users), Ctrl+S (/settings), Ctrl+L (/admin/logs)

Shortcuts are fired as DOM events (`tos:search-open`, `tos:help-open`) by
`KeyboardShortcutProvider`, not handled directly in layouts.
