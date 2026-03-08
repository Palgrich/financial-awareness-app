# Sprint Audit — Finance MVP

**Date:** 2026-03-07
**Scope:** Full project audit (frontend/backend/data/auth) based only on repository code/docs.

## 1) Architecture Audit

### Frontend (React Native + Expo)
**Status:** Partial (functional app shell + many feature screens, but beta-readiness gaps)

**Confirmed by code:**
- Expo RN app with typed navigation and tab/stack architecture: `App.tsx`, `src/navigation/TabNavigator.tsx`, `src/navigation/types.ts`.
- Feature-rich UI screens exist (Dashboard/Progress, Learn, Subscriptions, Coach, Profile, Budget, Debts, Transactions): `src/screens/*`.
- Local persistence for preferences/progress/subscriptions/debts via AsyncStorage + Zustand: `src/state/store.ts`.
- Authentication gate in root navigator: `src/navigation/RootNavigator.tsx` + `src/state/authStore.ts`.

**Gap:** App hard-blocks on `/health` API availability even when mock API is enabled (`USE_MOCK_API` defaults true), because startup always executes `checkHealth()` in `App.tsx`.

### Backend (Express API)
**Status:** Partial (auth + minimal endpoints; not full domain backend)

**Confirmed by code:**
- Express server with CORS/json middleware and routes: `server/index.js`.
- Implemented endpoints: `/health`, `/auth/register`, `/auth/login`, `/metrics`, `/learn`, `/learn/lessons/:id/complete` (`server/index.js`, `server/routes/auth.js`).
- Protected routes via JWT middleware: `server/middleware/auth.js`.

**Gap:** Domain endpoints for accounts/transactions/subscriptions are missing on backend; frontend endpoint files for accounts/transactions are empty (`src/api/endpoints/accounts.ts`, `src/api/endpoints/transactions.ts`).

### Data layer
**Status:** Partial

**Confirmed by code:**
- Frontend relies on mock datasets for most product behavior: `src/data/mock/*`, `src/state/store.ts`, `README.md`.
- API toggle exists (`EXPO_PUBLIC_USE_MOCK_API`), defaulting to mock mode: `src/api/config.ts`.
- Backend metrics/learn currently in-memory stubs, not persisted: `server/index.js`.
- Prisma schema exists for `User` + `MetricSnapshot`: `server/prisma/schema.prisma`.

**Gap:** No end-to-end persisted domain model for core finance entities (transactions, subscriptions, accounts) in backend Prisma schema.

### Auth
**Status:** Partial to Done (for MVP login/register)

**Confirmed by code:**
- Register/login with bcrypt + JWT and DB-backed users: `server/routes/auth.js`.
- Frontend auth UI + token persistence + auth-gated navigation: `src/screens/LoginScreen.tsx`, `src/screens/RegisterScreen.tsx`, `src/state/authStore.ts`, `src/navigation/RootNavigator.tsx`.

**Gaps/Risks:**
- No evidence of refresh tokens, password reset, email verification, rate limiting, brute-force protection.
- JWT secret handling depends on env only; no runtime guard for missing secret found in auth middleware/routes.

---

## 2) Feature Readiness Matrix

| Feature | Status | Evidence |
|---|---|---|
| Auth (register/login + session) | **Done** | `server/routes/auth.js`, `src/screens/LoginScreen.tsx`, `src/screens/RegisterScreen.tsx`, `src/state/authStore.ts` |
| Dashboard/Progress UI | **Done** | `src/screens/ProgressScreen.tsx`, `src/screens/DashboardScreen.tsx`, multiple card components in `src/components/` |
| Learn (paths/lessons/challenges) | **Done (mock-first)** | `src/screens/LearnScreen.tsx`, `src/api/endpoints/learn.ts`, `src/data/mock/lessons.ts` |
| Subscriptions management UI | **Done (mock/local state)** | `src/screens/SubscriptionsScreen.tsx`, `src/state/store.ts` |
| Budget + Debts workflows | **Done (local state)** | `src/screens/BudgetSetupScreen.tsx`, `src/screens/DebtsListScreen.tsx`, `src/state/store.ts` |
| Coach (chat assistant) | **Partial** | UI + rule-based responses only (`src/screens/CoachScreen.tsx`, `src/utils/coachResponses.ts`) |
| Profile/settings | **Partial** | Preferences/local controls done, bank connect is demo alert (`src/screens/ProfileScreen.tsx`) |
| Onboarding flow | **Not started / Unknown** | No dedicated onboarding screens/route found; only auth stack (`src/navigation/AuthStack.tsx`) |
| Plaid integration | **Not started** | No Plaid code/config; “Connect bank” is demo-only (`src/screens/ProfileScreen.tsx`) |
| Backend domain API parity | **Not started/Partial** | Only health/auth/metrics/learn implemented (`server/index.js`); accounts/transactions endpoints absent |

---

## 3) Technical Debt & Risk Register

| ID | Risk | Severity | Impact | Mitigation |
|---|---|---|---|---|
| R1 | App startup requires `/health` even in mock mode | High | App unusable when local API unavailable; blocks QA/beta installs | Gate health check behind `USE_MOCK_API === false` or degrade gracefully (`App.tsx`, `src/api/config.ts`) |
| R2 | README claims “frontend-only”, repo includes backend/auth | Medium | Misaligned onboarding and wrong expectations for team/investors | Update README/docs to reflect current hybrid state (`README.md`, `server/*`) |
| R3 | Inconsistent terminology: Health Score vs Weather | Medium | Product confusion, design/content drift, inconsistent analytics naming | Decide canonical term + glossary + refactor labels (`src/screens/HealthBreakdownScreen.tsx`, `src/components/FinancialWeatherCard.tsx`, `src/utils/financialWeather.ts`) |
| R4 | Backend data mostly stubbed/in-memory for metrics/learn | High | No reliable user-state persistence/server truth | Move metrics/learn state to DB models + repository layer (`server/index.js`, `server/prisma/schema.prisma`) |
| R5 | Core entities not modeled in backend DB (transactions/accounts/subscriptions) | High | Cannot support real bank sync, server analytics, multi-device consistency | Extend Prisma schema + API contracts |
| R6 | Missing security hardening (rate limit, lockout, password reset, verify email) | High | Abuse and account security risk in beta | Add auth hardening middleware + flows |
| R7 | Empty API client files (accounts/transactions) | Medium | Signals unfinished API integration path | Implement or remove placeholders (`src/api/endpoints/accounts.ts`, `src/api/endpoints/transactions.ts`) |
| R8 | Hardcoded dev IP fallback in API config | Medium | Breaks frequently on network changes; device testing friction | Enforce env-based API URL, fail fast with clear diagnostics (`src/api/config.ts`, `docs/DEV_API.md`) |
| R9 | No tests/CI evidence in repo | Medium | Regression risk as velocity increases | Add smoke tests + lint/typecheck CI |
| R10 | Coach positioned as AI but rule-based deterministic logic | Medium | Early user trust/reliability mismatch | Explicitly label as rule-based beta coach and scope expectations (`src/screens/CoachScreen.tsx`, `src/utils/coachResponses.ts`) |

---

## 4) Plan for Next 2 Sprints

Assumption: sprint length = 2 weeks.

### Sprint N+1 (Weeks 1–2)

**P0**
1. Remove startup hard dependency on API in mock mode — **Owner:** Dev — **ETA:** Day 2
2. Beta-critical docs alignment (README + product docs + terminology ADR) — **Owner:** TPM — **ETA:** Day 3
3. Define/implement canonical terminology across UI copy (Health Score vs Weather) — **Owner:** Design + Dev — **ETA:** Day 5
4. Implement backend endpoints for accounts/transactions (read-only MVP) + FE wiring — **Owner:** Dev — **ETA:** Day 10
5. Add basic API smoke test + CI checks (typecheck/lint/test) — **Owner:** Dev — **ETA:** Day 10

**P1**
6. Introduce auth hardening v1 (rate limiting + JWT env guard) — **Owner:** Dev — **ETA:** Day 8
7. Onboarding decision: explicit scope (auth-only vs full onboarding flow) in ADR — **Owner:** TPM + Design — **ETA:** Day 4

**P2**
8. Refactor placeholder endpoint files and API layer cleanup — **Owner:** Dev — **ETA:** Day 9

### Sprint N+2 (Weeks 3–4)

**P0**
1. Backend persistence for metrics/learn progression (replace in-memory) — **Owner:** Dev — **ETA:** Week 3 end
2. Formal beta readiness checklist + QA pass on physical device flow — **Owner:** TPM + Dev — **ETA:** Week 4 mid
3. Coach scope stabilization: deterministic intents + guardrails + content quality pass — **Owner:** Dev + Design — **ETA:** Week 4 end

**P1**
4. Add forgot-password/reset (or explicitly mark out-of-scope before beta) — **Owner:** Dev — **ETA:** Week 4 end
5. Add basic analytics event map for key beta flows — **Owner:** Dev + TPM — **ETA:** Week 4 end

**P2**
6. Plaid discovery spike (API contract + compliance/risk checklist) — **Owner:** Dev + TPM — **ETA:** Week 4 end

---

## Mandatory discrepancy log

1. **Timeline (2 weeks vs 8 weeks)**
   - **Confirmed evidence in repo:** development commit history spans roughly 2026-02-11 → 2026-03-01 (~3 weeks), not 2 weeks (`git log`).
   - **8 weeks claim:** **Unknown** (no explicit 8-week source found in repository docs/code).

2. **Terminology (Financial Health Score vs Financial Weather)**
   - Both terms actively used in product code:
     - Health Score: `src/screens/HealthBreakdownScreen.tsx`, `src/data/progressUserData.ts`
     - Financial Weather: `src/components/FinancialWeatherCard.tsx`, `src/utils/financialWeather.ts`, `src/screens/ProgressScreen.tsx`
   - Status: **Confirmed inconsistency**.

3. **Coach/Profile/Onboarding/Plaid factual status**
   - **Coach:** Implemented UI + rule-based response engine; not LLM-backed (`src/screens/CoachScreen.tsx`, `src/utils/coachResponses.ts`) → **Partial**.
   - **Profile:** Settings + local preferences + demo connect button; no real bank link (`src/screens/ProfileScreen.tsx`) → **Partial**.
   - **Onboarding:** No dedicated onboarding flow beyond auth stack (`src/navigation/AuthStack.tsx`) → **Not started / Unknown**.
   - **Plaid:** No integration code or config found; demo-only connect action (`src/screens/ProfileScreen.tsx`) → **Not started**.

---

## Go/No-Go for early users

**Recommendation:** **NO-GO (for external beta), conditional GO for internal dogfooding.**

**Why:**
- Startup/API coupling and backend domain incompleteness are high-risk for user experience.
- Terminology/product expectation mismatch remains unresolved.
- Critical “real finance” expectations (onboarding depth, Plaid) are not implemented.

**Conditional GO criteria (internal):**
- Accept mock-first scope explicitly.
- Fix startup health-check blocker.
- Publish scope-limited beta script and known limitations.
