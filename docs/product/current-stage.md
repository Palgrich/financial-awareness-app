# Current Stage

## Stage
**Stage 1 (Build-in-progress, not beta-ready).**

## Audit Date
2026-03-07

## Sprint #1 Execution Status
**Status:** Started (First wave in progress)
**Source of truth:**
- `docs/reports/sprint-audit-2026-03-07.md`
- `docs/product/backlog.md`

## Executive snapshot
- Frontend is feature-rich and runnable, but still mock-first for core finance domain data.
- Backend exists (Express + Prisma + JWT auth), but only partial API coverage.
- Auth (register/login/token) is implemented end-to-end.
- App startup currently depends on API `/health` even when mock mode is enabled.
- Coach and Profile are implemented with demo/heuristic behavior (not full production behavior).
- Onboarding flow beyond auth is not found in repo (**Unknown/Not started**).
- Plaid integration is not found in repo (**Not started**).
- Terminology drift exists: “Financial Health Score” and “Financial Weather” both used.
- Timeline mismatch needs alignment: sprint target is 2 weeks, repository commit span is ~3 weeks; 8-week baseline source is **Unknown**.

## Main blockers to beta
1. Startup hard dependency on API health check (`App.tsx`).
2. Missing backend parity for transactions/accounts/subscriptions.
3. No real bank connection (Plaid not implemented).
4. Scope/terminology inconsistency in UX and docs.

## First Wave Assignment (started now)

### Dev (Top-2 P0 from backlog)

1) **P0-1 Startup resilience: skip hard `/health` block in mock mode** — **Done**
- Owner: Dev
- Source: `docs/product/backlog.md` (Top-10 P0 #1)
- Dependencies: None
- Acceptance criteria:
  - App launches in mock mode with API down.
  - Offline screen shown only when `EXPO_PUBLIC_USE_MOCK_API=false` and API unavailable.
  - Verified on simulator + physical device.

2) **P0-2 Backend read API for accounts (MVP parity)** — **Done**
- Owner: Dev
- Source: `docs/product/backlog.md` (Top-10 P0 #2)
- Dependencies: None (parallel with P0-1)
- Acceptance criteria:
  - `GET /accounts` endpoint implemented and documented.
  - Returns account contract suitable for FE consumption.
  - Auth behavior + error behavior defined.

### Design (terminology/profile copy tasks)

3) **P0-5 Terminology ADR + UI/documentation rename plan (Health Score vs Weather)** — **In Progress**
- Owner: Design
- Source: `docs/product/backlog.md` (Top-10 P0 #5)
- Dependencies: None
- Acceptance criteria:
  - One canonical term approved and documented.
  - Rename map old → new labels prepared for UI/docs.

4) **P0-7 Profile bank-connect clarity (demo-only wording)** — **In Progress**
- Owner: Design
- Source: `docs/product/backlog.md` (Top-10 P0 #7)
- Dependencies: P0-5 terminology decision
- Acceptance criteria:
  - Profile copy removes ambiguity about real bank connection.
  - Explicit “demo/sample data only” wording in flow.

### Marketing (beta narrative constraints)

5) **Beta narrative constraints (scope-safe messaging packet)** — **In Progress**
- Owner: Marketing
- Source alignment: audit GO/NO-GO + backlog P0 constraints
- Dependencies: P0-5 terminology decision
- Acceptance criteria:
  - Draft beta narrative constraints published, including:
    - No claim of real bank integration/Plaid.
    - Clear statement of mock-first scope.
    - Coach positioning as rule-based assistance.
    - External beta remains NO-GO until P0 completion.

## Next checkpoint (TPM)
- Validate first-wave outputs and unblock Week 2 API parity tasks (`transactions` + FE wiring).

## Current Go/No-Go
- **NO-GO external beta** until Top-10 P0 execution is complete.
- **Conditional internal dogfooding** after startup resilience fix and copy/narrative constraints are accepted.

## Full audit artifact
See: `docs/reports/sprint-audit-2026-03-07.md`
