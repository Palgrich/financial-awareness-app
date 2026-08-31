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
   - Status: Done (commit `ad2e717`)
   - Owner: Design (primary) + Dev (support)
   - ETA: 2026-03-13
   - Evidence: `src/screens/CoachScreen.tsx`, `src/utils/coachResponses.ts`

7. [x] **Profile bank-connect clarity (remove ambiguity; demo-only wording)**
   - Status: Done (commit `ad2e717`)
   - Owner: Design + Dev
   - ETA: 2026-03-12
   - Evidence: `src/screens/ProfileScreen.tsx`

8. [ ] **Auth hardening v1 (rate limit + env guard for JWT secret)**
   - Status: **At-Risk** (In Progress started 2026-03-09; >24h with no new implementation evidence)
   - Owner: Dev
   - ETA: **2026-03-19** (re-baselined after 2026-03-15 13:00 PT checkpoint miss)
   - Evidence target: `server/routes/auth.js`, `server/middleware/auth.js`, `server/README.md`
   - Recovery action (2026-03-22 21:52 PT refresh): still no implementation commits beyond `d5901eb`; P0-8 remains >24h without evidence and stays **At-Risk**. Revalidated no new repo evidence after the 2026-03-16 10:00 PT Review-handoff miss and since the 2026-03-22 10:52 PT sync, so recovery remains re-baselined to an explicit founder decision gate. Founder slip gate remains **triggered** (+3 days vs 2026-03-16). Active recovery sequence now: (1) Founder selects recovery path (timebox rescue vs de-scope/re-sequence), (2) first implementation proof commit required within 4 hours of decision, (3) move P0-8 to Review within 24 hours of first proof commit or trigger re-plan escalation.
   - Ready Card: `docs/product/ready-cards.md#p0-8--auth-hardening-v1-rate-limit--jwt-env-guard`

9. [ ] **README and product-doc synchronization with actual architecture**
   - Owner: TPM
   - ETA: 2026-03-10
   - Evidence mismatch: `README.md` says frontend-only, repo includes backend/auth

10. [ ] **Beta readiness checklist + smoke CI (typecheck/lint/basic API smoke)**
   - Status: Ready
   - Owner: TPM + Dev
   - ETA: 2026-03-17
   - Ready Card: `docs/product/ready-cards.md#p0-10--beta-readiness-checklist--smoke-ci`

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

## Hard release gate (Founder)
**External beta launch is blocked until BOTH items are Done + verified:**
- P0-8 — Auth hardening v1
- P0-10 — Beta readiness checklist + smoke CI

## Board status snapshot (Sprint #1)
- **Done:** P0-1, P0-2, P0-3, P0-4, P0-5, P0-6, P0-7
- **In Progress:** None
- **At-Risk:** P0-8
- **Ready:** P0-9, P0-10
- **Blocked:** External beta (hard gate: P0-8 + P0-10)

## Status flow
Ready → In Progress → Review → Done
