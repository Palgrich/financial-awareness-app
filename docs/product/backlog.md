# Backlog (Post-audit)

Source audit: `docs/reports/sprint-audit-2026-03-07.md`

## Prioritization
- **P0:** Blocks beta/user trust/core reliability
- **P1:** Important for quality and scale
- **P2:** Nice-to-have / prep

---

## Top-10 P0 tasks

1. [x] **Startup resilience: skip hard `/health` block in mock mode**
   - Status: Done (commit `b3adf14`)
   - Owner: Dev
   - ETA: 2026-03-10
   - Evidence: `App.tsx`, `src/api/config.ts`

2. [x] **Backend read API for accounts (MVP parity)**
   - Status: Done (commit `b3adf14`)
   - Owner: Dev
   - ETA: 2026-03-14
   - Evidence: `server/index.js`, `src/api/endpoints/accounts.ts`, `server/README.md`

3. [x] **Backend read API for transactions (MVP parity)**
   - Status: Done (commit `0e9f8e9`)
   - Owner: Dev
   - ETA: 2026-03-14
   - Evidence: `server/index.js`, `src/api/endpoints/transactions.ts`, `server/README.md`

4. [x] **Wire FE to new accounts/transactions APIs with fallback handling**
   - Status: Done (commit `0e9f8e9`)
   - Owner: Dev
   - ETA: 2026-03-16
   - Evidence: `App.tsx`, `src/state/store.ts`, `src/api/endpoints/accounts.ts`, `src/api/endpoints/transactions.ts`

5. [x] **Terminology ADR + rollout plan: use ONLY Finance Pulse**
   - Status: Done (commit `47534ab`)
   - Owner: TPM + Design
   - ETA: 2026-03-11
   - Evidence: `docs/product/decisions.md`, `docs/product/ready-cards.md` (rollout map)

6. [x] **Coach scope hardening (explicit rule-based beta scope in UI/copy)**
   - Status: Done (2026-03-09)
   - Owner: Design (primary) + Dev (support)
   - ETA: 2026-03-13
   - Evidence: `src/screens/CoachScreen.tsx`, `src/utils/coachResponses.ts`

7. [x] **Profile bank-connect clarity (remove ambiguity; demo-only wording)**
   - Status: Done (2026-03-09)
   - Owner: Design + Dev
   - ETA: 2026-03-12
   - Evidence: `src/screens/ProfileScreen.tsx`

8. [ ] **Auth hardening v1 (rate limit + env guard for JWT secret)**
   - Owner: Dev
   - ETA: 2026-03-16
   - Evidence: `server/routes/auth.js`, `server/middleware/auth.js`

9. [ ] **README and product-doc synchronization with actual architecture**
   - Owner: TPM
   - ETA: 2026-03-10
   - Evidence mismatch: `README.md` says frontend-only, repo includes backend/auth

10. [ ] **Beta readiness checklist + smoke CI (typecheck/lint/basic API smoke)**
   - Owner: TPM + Dev
   - ETA: 2026-03-17

---

## P1
- [ ] Persist learn/metrics backend data in DB (replace in-memory stubs)
  - Owner: Dev
  - ETA: Sprint +2
  - Evidence: `server/index.js` in-memory learn/metrics
- [ ] Onboarding scope decision (auth-only vs full onboarding)
  - Owner: TPM + Design
  - ETA: Sprint +1
  - Status: **Unknown** current product decision
- [ ] Event instrumentation for beta funnel
  - Owner: Dev + TPM
  - ETA: Sprint +2

## P2
- [ ] Plaid discovery spike (technical/legal scope only)
  - Owner: Dev + TPM
  - ETA: Sprint +2
- [ ] API layer cleanup and dead-file removal
  - Owner: Dev
  - ETA: Sprint +2

---

## Board status snapshot (Sprint #1)
- **Done:** P0-1, P0-2, P0-3, P0-4, P0-5
- **In Progress:** None (Top-10 P0)
- **At-Risk:** None
- **Ready:** P0-8, P0-9, P0-10
- **Blocked:** None (current)

## Status flow
Ready → In Progress → Review → Done
