# Session Log Template — TravelOS / Notion Sync

> Copy this template for every new AI session. Fill all fields before syncing to Notion.

---

## Session Metadata

| Field | Value |
|-------|-------|
| **Date** | YYYY-MM-DD |
| **Session #** | `N` (increment per day) |
| **Agent** | Claude / Gemini / Codex |
| **Model** | `claude-sonnet-4-6` / `gemini-2.0-flash` / `gpt-4o` |
| **Phase** | P0 / S1 / S2 / … / F1–F9 |
| **Focus** | One-line description |
| **Duration** | ~N hours |
| **Notion Sync** | ☐ Pending / ✓ Synced |

---

## Objective

What was the goal of this session? (1–3 sentences)

---

## Files Created

| File | Purpose |
|------|---------|
| `src/...` | Short description |

---

## Files Modified

| File | Change Summary |
|------|---------------|
| `src/...` | What changed and why |

---

## Architecture Decisions

> Record decisions that will affect future sessions.

1. **Decision**: Brief title
   - **Context**: Why this came up
   - **Choice**: What was decided
   - **Trade-offs**: What alternatives were considered

---

## Test Results

```
Test Files  N passed | N failed | N skipped
     Tests  N passed | N failed | N todo
```

**Pre-existing failures** (not introduced this session):
- List them here

**New failures introduced** (must be fixed before next session):
- None / List them here

---

## Build Status

- [ ] `pnpm typecheck` — 0 errors
- [ ] `pnpm lint` — 0 errors
- [ ] `pnpm build` — succeeds
- [ ] `pnpm test:run` — no new failures

---

## Blockers / Known Issues

List any unresolved issues or deferred work.

---

## Next Steps

What should the next session focus on?

1. ...
2. ...

---

## Notion Sync Notes

- **Database**: TravelOS > Sessions
- **Tags**: Phase, Agent, Date
- **Status**: Draft → Review → Synced
- **Linked pages**: Sprint board item, Architecture decisions log
