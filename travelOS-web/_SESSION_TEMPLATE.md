# Session Log
# Copy → rename: YYYY-MM-DD_HH-MM_{agent}_{topic}.md

## Meta
- **Date:** YYYY-MM-DD
- **Time:** HH:MM - HH:MM
- **Agent:** [Claude Code / Cursor / Gemini / Copilot / Codex]
- **Topic:** [what this session does]
- **Build Step:** [P0 / S1 / S2 / S3 / L1 / F1-F9]

## Pre-Flight
- [ ] Read LAST session log (file: _______________)
- [ ] Created this new session log
- [ ] If Gemini: task is UI ONLY? (Rule 11 — check ALLOWED folders)
- [ ] If Codex: change plan approved? (Rule 12)
- [ ] If Claude: ready for 5-level test? (Rule 13)
- [ ] File placement matches folder structure rules?

## Objective
[Goal of this session]

## Files Created
| File Path | Folder Rule | Description |
|-----------|------------|-------------|

## Files Modified
| File Path | What Changed |
|-----------|-------------|

## Decisions
| Decision | Reason |
|----------|--------|

## Issues
| Issue | Severity | Status |
|-------|----------|--------|

## Test Results
Claude Code: ALL 5 levels | Cursor: L2 min | Others: L2 min

- [ ] L1 Unit: `npx vitest run` → ___
- [ ] L2 Architecture:
  - [ ] `tsc --noEmit` → ___
  - [ ] `eslint .` → ___
  - [ ] `grep -r "@coreui/" src/features/` → ___ (must be 0)
  - [ ] `grep -r "from 'lucide-react'" src/features/` → ___ (must be 0)
  - [ ] Barrel exports complete? ___
- [ ] L3 Smoke: `next build` → ___
- [ ] L4 Integration: API CRUD → ___ | Auth flow → ___
- [ ] L5 API Contract: DTOs match → ___ | Errors handled → ___

## Next Steps
[What the next agent should do — include exact file paths]