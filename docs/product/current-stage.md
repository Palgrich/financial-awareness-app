# Current Stage

## Stage
**Stage 1 (Build-in-progress, not beta-ready).**

## Audit Date
2026-03-07

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

## Sprint Execution Plan (Top-10 P0)
**Sprint window:** 2 weeks

### Week 1 (stabilize + align)

1) **Startup resilience: skip hard `/health` block in mock mode**
- Owner: **Dev**
- Depends on: None
- Acceptance criteria:
  - App launches in mock mode with API down.
  - Offline screen shown only when `EXPO_PUBLIC_USE_MOCK_API=false` and API unavailable.
  - Verified on simulator + physical device.

2) **Terminology ADR + rename plan (Health Score vs Weather)**
- Owner: **Design**
- Depends on: None
- Acceptance criteria:
  - Single canonical term approved and documented.
  - Mapping list of old → new labels for UI/docs created.
  - Affected surfaces enumerated (Progress, Health breakdown, cards, docs).

3) **Profile bank-connect clarity (demo-only wording)**
- Owner: **Design**
- Depends on: Task #2 terminology decision
- Acceptance criteria:
  - Button/alert/copy remove ambiguity about real bank connection.
  - Explicit “demo/sample data” language present in Profile flow.

4) **Coach scope hardening (rule-based beta scope in copy/UX)**
- Owner: **Design**
- Depends on: Task #2 terminology decision
- Acceptance criteria:
  - Coach intro and helper copy clearly state rule-based behavior.
  - No misleading “AI autonomy” framing in coach surface.

5) **README and product-doc sync with actual architecture**
- Owner: **Marketing**
- Depends on: Task #2 terminology decision
- Acceptance criteria:
  - README and product-facing docs describe hybrid architecture correctly.
  - Messaging consistent with current scope (no Plaid, mock-first constraints stated).

### Week 2 (backend parity + release gate)

6) **Backend read API for accounts (MVP parity)**
- Owner: **Dev**
- Depends on: Week 1 Task #1 complete
- Acceptance criteria:
  - `GET /accounts` endpoint implemented and documented.
  - Returns scoped account data contract for FE consumption.
  - Error handling and auth behavior defined.

7) **Backend read API for transactions (MVP parity)**
- Owner: **Dev**
- Depends on: Week 1 Task #1 complete
- Acceptance criteria:
  - `GET /transactions` endpoint implemented and documented.
  - Supports baseline filtering expected by current FE screens.
  - Error handling and auth behavior defined.

8) **Wire FE to accounts/transactions APIs with fallback handling**
- Owner: **Dev**
- Depends on: Week 2 Tasks #6 + #7
- Acceptance criteria:
  - FE reads accounts/transactions from API when mock mode is off.
  - Safe fallback path exists (controlled error/empty state, no crash).
  - Removed or justified empty endpoint stubs in FE API layer.

9) **Auth hardening v1 (rate limit + JWT env guard)**
- Owner: **Dev**
- Depends on: None
- Acceptance criteria:
  - Auth endpoints have request throttling/rate-limit guard.
  - Startup/runtime fails fast with clear error if JWT secret missing.
  - Negative-path tests/manual checks documented.

10) **Beta readiness checklist + smoke CI**
- Owner: **Marketing**
- Depends on: Week 2 Tasks #6/#7/#8/#9 and Week 1 docs alignment
- Acceptance criteria:
  - Beta checklist published (scope, known limits, go/no-go gates).
  - CI smoke checks run (at least lint/typecheck + API smoke).
  - Early-user communication draft ready and scope-accurate.

## Current Go/No-Go
- **NO-GO external beta** until Top-10 P0 execution is complete.
- **Conditional internal dogfooding** after Week 1 Task #1 and copy/doc clarity tasks.

## Full audit artifact
See: `docs/reports/sprint-audit-2026-03-07.md`
