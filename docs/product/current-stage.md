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

## Confirmed by (key files)
- Frontend app/nav/state: `App.tsx`, `src/navigation/*`, `src/state/store.ts`
- Backend/auth: `server/index.js`, `server/routes/auth.js`, `server/prisma/schema.prisma`
- Coach/Profile scope: `src/screens/CoachScreen.tsx`, `src/screens/ProfileScreen.tsx`
- Terminology mismatch: `src/screens/HealthBreakdownScreen.tsx`, `src/components/FinancialWeatherCard.tsx`

## Main blockers to beta
1. Startup hard dependency on API health check (`App.tsx`).
2. Missing backend parity for transactions/accounts/subscriptions.
3. No real bank connection (Plaid not implemented).
4. Scope/terminology inconsistency in UX and docs.

## Next 3 actions (P0)
1. Decouple startup from API health check when mock mode is on.
2. Finalize canonical terminology ADR and update UI copy/docs.
3. Implement minimum backend parity for accounts/transactions read APIs.

## Full audit artifact
See: `docs/reports/sprint-audit-2026-03-07.md`
