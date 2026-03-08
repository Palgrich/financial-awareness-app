# Weekly Report (TPM)

## Week
- Period: 2026-03-02 → 2026-03-07
- Sprint: Sprint Execution Kickoff (2-week cadence)
- Prepared by: TPM

## 1) Executive Summary
- Audit is complete; execution now starts from Top-10 P0.
- Sprint plan split into Week 1 (stability + scope clarity) and Week 2 (backend parity + beta gate).
- Owners assigned to **Dev/Design/Marketing** for every P0 item.
- Dependencies and acceptance criteria defined for all 10 tasks.
- External beta remains **NO-GO** until P0 completion.

## 2) What is ready
- Auth flow (register/login/JWT/session persistence).
- Core frontend product surfaces (Progress/Dashboard, Learn, Subscriptions, Coach UI, Profile, Budget, Debts).
- Local persistence of user/demo state.
- Basic backend foundation (health/auth/metrics/learn endpoints).

## 3) What blocks beta
- App startup blocked if API unavailable (even in mock mode): `App.tsx`.
- Missing backend domain parity for accounts/transactions (`src/api/endpoints/accounts.ts`, `src/api/endpoints/transactions.ts`).
- Plaid not implemented; profile bank connect is demo alert only.
- Terminology inconsistency (“Financial Health Score” vs “Financial Weather”).

## 4) Sprint Execution (Top-10 P0)

### Week 1

1. Startup resilience: skip hard `/health` block in mock mode
- Owner: Dev
- Dependencies: None
- AC: mock mode launches without API; offline gate only for real API mode.

2. Terminology ADR + rename plan
- Owner: Design
- Dependencies: None
- AC: canonical term approved; affected surfaces and rename map documented.

3. Profile bank-connect clarity
- Owner: Design
- Dependencies: #2
- AC: Profile copy explicitly states demo/sample-data-only behavior.

4. Coach scope hardening
- Owner: Design
- Dependencies: #2
- AC: Coach copy clearly states rule-based scope; no misleading AI claims.

5. README/product-doc synchronization
- Owner: Marketing
- Dependencies: #2
- AC: public/internal docs aligned with actual architecture and scope.

### Week 2

6. Backend read API for accounts
- Owner: Dev
- Dependencies: Week 1 #1
- AC: authenticated `GET /accounts` implemented and documented.

7. Backend read API for transactions
- Owner: Dev
- Dependencies: Week 1 #1
- AC: authenticated `GET /transactions` implemented and documented.

8. FE wiring to accounts/transactions APIs with fallback
- Owner: Dev
- Dependencies: #6, #7
- AC: FE uses API in non-mock mode; graceful fallback in failure states.

9. Auth hardening v1
- Owner: Dev
- Dependencies: None
- AC: rate-limit on auth routes + clear JWT env guard behavior.

10. Beta readiness checklist + smoke CI
- Owner: Marketing
- Dependencies: #5, #6, #7, #8, #9
- AC: checklist published, CI smoke checks active, launch comms draft ready.

## 5) Mandatory discrepancy log
- **Timeline (2 weeks vs 8 weeks):**
  - Repo-confirmed development span: ~2026-02-11 to 2026-03-01 (~3 weeks).
  - Explicit 8-week source in repository: **Unknown**.
- **Terminology:** both “Financial Health Score” and “Financial Weather” exist in active code.
- **Coach/Profile/Onboarding/Plaid:**
  - Coach: Partial
  - Profile: Partial
  - Onboarding: Not started / Unknown beyond auth
  - Plaid: Not started

## 6) Go/No-Go for early users
- **Decision:** **NO-GO** for external early users.
- **Conditional:** internal dogfooding allowed after Week 1 completion of startup/copy/doc clarity tasks.

## 7) Artifacts updated
- `docs/product/current-stage.md`
- `docs/reports/weekly.md`
