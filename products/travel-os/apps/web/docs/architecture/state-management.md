# State Management

## Split Strategy
| State Type | Tool | Examples |
|------------|------|---------|
| UI/client | Zustand | sidebar open, modal state, theme |
| Auth | Zustand | user, token, permissions |
| Server/API | React Query | fetched data, mutations |
| Form | react-hook-form | form values, validation |
| URL | Next.js router | filters, pagination |

## Stores
- `authStore` — user, token, login/logout actions
- `themeStore` — theme mode, color tokens
- `layoutStore` — layout variant, sidebar state
- `sidebarStore` — sidebar open/collapsed, active item
