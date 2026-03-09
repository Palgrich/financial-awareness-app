# Ready Cards

## P0-6 — Coach scope hardening (rule-based beta scope)

- **Priority:** P0
- **Status:** At-Risk (In Progress >24h evidence gap as of 2026-03-09 09:52 PT)
- **Owner role:** Design (primary)
- **Support role:** Dev
- **Target ETA:** 2026-03-13
- **Dependencies:** P0-5 terminology decision (**Finance Pulse** canonical)

### Scope
1. Update Coach screen copy to clearly state current beta scope is rule-based guidance.
2. Remove/replace any wording that implies autonomous AI decisions or personalized financial advice.
3. Align terminology to **Finance Pulse** where score/health concepts are referenced.
4. Ensure empty/error states retain same scope-safe language.

### Acceptance Criteria (AC)
- AC1: Coach entry, headers, helper text, and CTA copy explicitly describe rule-based assistance.
- AC2: No “AI advisor”, “real-time bank-connected intelligence”, or similar claims remain in Coach surface.
- AC3: Any score references in Coach surface use **Finance Pulse** naming.
- AC4: Copy reviewed for consistency with Profile demo-only messaging and beta narrative constraints.

### Test Plan
- **Manual UI pass (Design + Dev):**
  - Open Coach screen in mock mode.
  - Verify all visible user-facing strings comply with AC1–AC3.
  - Trigger at least one fallback/error path and verify scope-safe wording.
- **Code-level checks (Dev):**
  - Grep for banned phrases in Coach-related files.
  - Confirm updated strings are centralized where applicable (`src/utils/coachResponses.ts`).
- **Regression sanity:**
  - Ensure no navigation or rendering regressions on Coach route.

### Evidence to attach on completion
- Commit hash(es) touching:
  - `src/screens/CoachScreen.tsx`
  - `src/utils/coachResponses.ts`
- Short before/after copy diff in PR description.
- Screenshot(s) of updated Coach states.

### Risks / Recovery trigger
- If no evidence update is posted for >24h while In Progress, mark **At-Risk** and recover by:
  1) narrowing copy pass to critical user-visible strings first,
  2) pairing Design+Dev for a 30-minute async review,
  3) shipping incremental PR with remaining polish in follow-up.

---

## P0-8 — Auth hardening v1 (rate limit + JWT env guard)

- **Priority:** P0
- **Status:** In Progress
- **Execution start:** 2026-03-09 13:08 PT
- **Owner role:** Dev
- **Target ETA:** 2026-03-16
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
- If implementation stalls >24h after start without evidence, split delivery into two PRs:
  1) rate limiting middleware,
  2) JWT env guard + docs.

---

## P0-5 closure note (completed)
- **Completed evidence:** `47534ab` + decision log update in `docs/product/decisions.md`.
- **Rollout map:** Legacy terms (“Financial Health Score”, “Financial Weather”) are deprecated in planning/docs; implementation replacement in UI code proceeds under active tasks.
