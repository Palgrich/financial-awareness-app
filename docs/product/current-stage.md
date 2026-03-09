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
- Founder decision set canonical term to **Finance Pulse** only; rollout in UI/code in progress.
- Timeline mismatch needs alignment: sprint target is 2 weeks, repository commit span is ~3 weeks; 8-week baseline source is **Unknown**.

## Main blockers to beta
1. Missing backend parity for subscriptions and remaining domain hardening.
2. No real bank connection (Plaid not implemented).
3. Scope/terminology inconsistency in UX and docs.

## First Wave Assignment (started now)

### Dev (execution moved to next wave)

1) **P0-1 Startup resilience: skip hard `/health` block in mock mode** — **Done**
- Owner: Dev
- Completion reference: commit `b3adf14`

2) **P0-2 Backend read API for accounts (MVP parity)** — **Done**
- Owner: Dev
- Completion reference: commit `b3adf14`

3) **P0-3 Backend read API for transactions (MVP parity)** — **Done**
- Owner: Dev
- Completion reference: commit `0e9f8e9`

4) **P0-4 Wire FE to new accounts/transactions APIs with fallback handling** — **Done**
- Owner: Dev
- Completion reference: commit `0e9f8e9`

### Design (terminology/profile copy tasks)

3) **P0-5 Terminology ADR + rollout plan: use ONLY Finance Pulse** — **Done**
- Owner: TPM + Design
- Completion reference: commit `47534ab`
- Evidence: `docs/product/decisions.md`, `docs/product/ready-cards.md`

4) **P0-6 Coach scope hardening (explicit rule-based beta scope in UI/copy)** — **Done**
- Owner: Design (primary) + Dev (support)
- Source: `docs/product/backlog.md` (Top-10 P0 #6)
- Dependencies: P0-5 terminology decision
- Evidence: `src/screens/CoachScreen.tsx`, `src/utils/coachResponses.ts`

5) **P0-7 Profile bank-connect clarity (demo-only wording)** — **Done**
- Owner: Design
- Source: `docs/product/backlog.md` (Top-10 P0 #7)
- Dependencies: P0-5 terminology decision
- Evidence: `src/screens/ProfileScreen.tsx`

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
- P0-5, P0-6, and P0-7 are closed.
- Next queued starter remains P0-8 (Dev auth hardening).
- Prepare gate for P0-10 (beta checklist + smoke CI) after terminology/copy alignment.

## Current Go/No-Go
- **NO-GO external beta** until Top-10 P0 execution is complete.
- **Conditional internal dogfooding** after startup resilience fix and copy/narrative constraints are accepted.

## Full audit artifact
See: `docs/reports/sprint-audit-2026-03-07.md`
