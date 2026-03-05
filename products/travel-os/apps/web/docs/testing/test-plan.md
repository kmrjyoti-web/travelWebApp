# Test Plan

## Levels
1. **Unit** — component logic, hooks, utilities (vitest + @testing-library/react)
2. **Integration** — feature flows, API mock (vitest + MSW)
3. **E2E** — critical paths: login, navigation, CRUD (Playwright)

## Coverage Targets
- Unit: 80% line coverage
- Integration: key user flows
- E2E: login, dashboard, settings

## Critical Paths
- [ ] Login → Dashboard redirect
- [ ] Sidebar toggle
- [ ] Theme switching
- [ ] Layout variant switching
