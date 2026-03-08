# Decisions (ADR-lite)

## 2026-03-07 — Audit baseline fixed from code/docs
- **Owner:** TPM
- **Decision:** Use repository evidence as single source of truth for current stage and planning.
- **Context:** Prior narrative and current implementation diverged.
- **Evidence:** `docs/reports/sprint-audit-2026-03-07.md`
- **Impact:** Planning and beta decisions now tied to verified implementation.
- **Review date:** End of next sprint.

## 2026-03-07 — Beta gate: NO-GO for external users (conditional GO internal)
- **Owner:** TPM + Dev
- **Decision:** External early-user beta is blocked until P0 reliability/scope gaps are closed.
- **Context:** Startup/API dependency, backend parity gaps, terminology mismatch, and missing Plaid/onboarding depth.
- **Evidence:** `App.tsx`, `src/api/endpoints/accounts.ts`, `src/api/endpoints/transactions.ts`, `src/screens/ProfileScreen.tsx`
- **Impact:** Focus next sprint on reliability and clarity, not feature expansion.
- **Review date:** After P0 top-10 completion.

## 2026-03-07 — Terminology mismatch must be resolved
- **Owner:** TPM + Design
- **Decision:** Create one canonical term for main score construct; deprecate conflicting labels.
- **Context:** Both “Financial Health Score” and “Financial Weather” are active in product.
- **Evidence:** `src/screens/HealthBreakdownScreen.tsx`, `src/components/FinancialWeatherCard.tsx`, `src/utils/financialWeather.ts`
- **Impact:** Reduces UX confusion and analytics naming drift.
- **Review date:** 2026-03-11.

## 2026-03-07 — Timeline discrepancy recorded as unresolved
- **Owner:** TPM
- **Decision:** Log discrepancy and avoid asserting unsupported timeline claims.
- **Context:** Sprint framing = 2 weeks; explicit 8-week source not found in repo.
- **Evidence:** `git log` shows ~2026-02-11 to 2026-03-01 development span; no explicit 8-week claim found in docs/code.
- **Impact:** Prevents inaccurate reporting.
- **Review date:** When external planning source is provided.

## 2026-03-07 — Factual status lock for Coach/Profile/Onboarding/Plaid
- **Owner:** TPM
- **Decision:** Use the following official status until code changes:
  - Coach = Partial (rule-based assistant)
  - Profile = Partial (settings + demo bank connect)
  - Onboarding = Not started / Unknown beyond auth
  - Plaid = Not started
- **Evidence:** `src/screens/CoachScreen.tsx`, `src/utils/coachResponses.ts`, `src/screens/ProfileScreen.tsx`, `src/navigation/AuthStack.tsx`
- **Impact:** Scope alignment across product/engineering/marketing.
- **Review date:** Next weekly report.
