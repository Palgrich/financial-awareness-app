# Ready Cards

## P0-8 — Auth hardening v1 (rate limit + JWT env guard)

- **Priority:** P0
- **Status:** At-Risk (execution active)
- **Execution start:** 2026-03-09 13:08 PT
- **At-Risk flagged:** 2026-03-10 05:52 PT (no new implementation evidence >24h)
- **Owner role:** Dev
- **Target ETA:** 2026-03-19
- **Dependencies:** None

### Scope
1. Add rate limiting on auth routes (`/auth/register`, `/auth/login`, and token refresh path if present).
2. Enforce explicit JWT secret environment guard behavior with clear startup/runtime failure messaging.
3. Document secure local/dev defaults and production expectation in server docs.
4. Keep behavior backward-compatible for existing valid auth flows.

### Acceptance Criteria (AC)
- AC1: Repeated auth attempts beyond threshold return deterministic 429 with safe error body.
- AC2: Missing/weak JWT secret configuration is detected and surfaced explicitly (no silent fallback).
- AC3: Auth happy-path (register/login/protected route) still works with valid env configuration.
- AC4: README/server docs include rate-limit policy and JWT env requirements.

### Test Plan
- **API validation (Dev):**
  - Exercise register/login under normal traffic and confirm success behavior unchanged.
  - Burst requests to auth endpoints to verify 429 behavior and reset window.
- **Config guard checks (Dev):**
  - Start server without JWT secret and verify explicit guard behavior.
  - Start server with valid JWT secret and verify protected route token validation.
- **Regression sanity:**
  - Confirm existing frontend auth flow still authenticates and persists session.

### Evidence to attach on completion
- Commit hash(es) touching:
  - `server/routes/auth.js`
  - `server/middleware/auth.js`
  - relevant config/bootstrap docs (`server/README.md` and/or root `README.md`)
- Brief test evidence (command output or notes) covering AC1–AC3.

### Risks / Recovery trigger
- Recovery plan active (refreshed 2026-03-21 13:52 PT):
  1) Revalidated no implementation evidence landed (latest commit remains `d5901eb`) after the missed 2026-03-16 10:00 PT Review handoff and since the 2026-03-21 11:52 PT sync,
  2) ETA remains re-baselined to 2026-03-19 (+3 days vs 2026-03-16), keeping founder slip gate triggered (>2-day condition),
  3) recovery is now held at a founder decision gate between two paths: **timebox rescue** vs **de-scope/re-sequence**,
  4) once founder selects a path, first implementation proof commit is due within 4 hours,
  5) P0-8 must move to Review within 24 hours of first proof commit or trigger re-plan escalation.

---

## P0-9 — README and product-doc synchronization with actual architecture

- **Priority:** P0
- **Status:** Ready
- **Owner role:** TPM
- **Target ETA:** 2026-03-10
- **Dependencies:** None (can run in parallel with P0-8)

### Scope
1. Align root `README.md` with actual stack: React Native app + Express backend + Prisma + JWT auth.
2. Remove outdated “frontend-only” claims and replace with current architecture and setup flow.
3. Ensure product docs (`docs/product/current-stage.md`, `docs/reports/weekly.md`, backlog references) use consistent status language.
4. Add explicit beta gate note in README linking to P0-8/P0-10 dependency for external beta.

### Acceptance Criteria (AC)
- AC1: `README.md` accurately reflects backend presence and auth capabilities.
- AC2: Setup/run instructions do not conflict with existing repo scripts/services.
- AC3: Product docs use consistent terms for stage/go-no-go and architecture scope.
- AC4: External beta gate condition (P0-8 + P0-10) is clearly stated.

### Test Plan
- **Doc consistency pass (TPM):**
  - Cross-check README statements against repo paths (`server/`, auth routes, Prisma usage).
  - Validate referenced commands exist in package scripts/docs.
- **Terminology pass:**
  - Ensure canonical naming remains **Finance Pulse** where relevant.
- **Reviewer spot-check:**
  - Quick read by Dev for technical accuracy.

### Evidence to attach on completion
- Commit hash(es) touching:
  - `README.md`
  - any updated product/report docs
- Checklist note mapping each AC to changed sections.

### ETA and handoff
- Planned start: immediately after P0-8 reaches Done (or earlier if TPM bandwidth allows in parallel).
- Handoff target after completion: P0-10 kickoff readiness packet.

---

## P0-10 — Beta readiness checklist + smoke CI

- **Priority:** P0
- **Status:** Ready
- **Owner role:** TPM + Dev
- **Target ETA:** 2026-03-17
- **Dependencies:** P0-8 completion required for external beta gate closure

### Scope
1. Publish a beta readiness checklist covering product scope guardrails, auth hardening verification, and launch blockers.
2. Add smoke CI checks for typecheck, lint, and basic API auth/health path validation.
3. Define pass/fail release criteria tied to founder hard gate (P0-8 + P0-10).
4. Link checklist + CI status locations in README/docs for launch decision visibility.

### Acceptance Criteria (AC)
- AC1: Checklist artifact exists in repo and explicitly tracks gate-critical items with owners.
- AC2: CI pipeline runs typecheck + lint + API smoke on PRs/main and reports clear pass/fail.
- AC3: Failure in any smoke check blocks beta-go recommendation in stage/report docs.
- AC4: Docs reference where to view checklist and latest CI status.

### Test Plan
- **Checklist validation (TPM):**
  - Verify each gate item has owner, status, and evidence link field.
- **CI validation (Dev):**
  - Trigger one passing run (baseline) and one intentional failing run (lint or smoke) to confirm blocking behavior.
- **Release-readiness dry run (TPM + Dev):**
  - Simulate go/no-go review using only checklist + CI outputs.

### Evidence to attach on completion
- Commit hash(es) touching:
  - checklist doc artifact (path to be finalized during implementation)
  - CI workflow file(s)
  - README/docs links to checklist/CI visibility points
- CI run URLs or logs demonstrating one pass and one controlled fail scenario.

### ETA and handoff
- Planned start: can begin scaffold work now; final gate verification immediately after P0-8 is Done.
- Handoff target: founder-facing go/no-go packet once P0-8 and P0-10 are both verified Done.

---

## Closure notes
- **P0-5 completed:** commit `47534ab` (terminology decision + rollout plan).
- **P0-6 completed:** commit `ad2e717` (coach scope hardening copy updates).
- **P0-7 completed:** commit `ad2e717` (profile demo-only bank-connect clarity).
