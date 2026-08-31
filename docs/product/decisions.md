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

## 2026-03-09 — Founder hard release gate for external beta
- **Owner:** Founder + TPM
- **Decision:** **External beta launch is allowed ONLY after BOTH P0-8 and P0-10 are completed and verified.**
- **Gate tasks:**
  - P0-8: Auth hardening v1 (rate limit + JWT env guard)
  - P0-10: Beta readiness checklist + smoke CI
- **Verification rule:** Task status must be `Done` in backlog and board, with code/doc evidence linked.
- **Enforcement:** All future executive summaries and go/no-go updates must explicitly report this gate.
- **Impact:** Creates a strict, testable launch condition and prevents premature external release.
- **Review date:** At beta launch decision.

## 2026-03-07 — Terminology mismatch must be resolved
- **Owner:** TPM + Design
- **Decision:** Create one canonical term for main score construct; deprecate conflicting labels.
- **Context:** Both “Financial Health Score” and “Financial Weather” are active in product.
- **Evidence:** `src/screens/HealthBreakdownScreen.tsx`, `src/components/FinancialWeatherCard.tsx`, `src/utils/financialWeather.ts`
- **Impact:** Reduces UX confusion and analytics naming drift.
- **Review date:** 2026-03-11.

## 2026-03-08 — Founder terminology decision: use ONLY “Finance Pulse”
- **Owner:** Founder + TPM + Design
- **Decision:** Canonical term across product UI, docs, board items, and messaging is **Finance Pulse** only.
- **Context:** Founder confirmation received on 2026-03-08; previous terms must be deprecated.
- **Replaced terms:** “Financial Health Score”, “Financial Weather”, and variants in delivery/messaging surfaces.
- **Impact:** Single product language in UX, planning, and GTM communication; removes terminology ambiguity.
- **Implementation note:** Existing code labels may still contain legacy terms until refactor PRs land; docs/board are updated immediately.
- **Review date:** 2026-03-10.

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

## 2026-08-09 — Concept alignment: remove composite score, add Achievements, extend lesson flow
- **Owner:** Founder + TPM + Design + Dev
- **Decision:** Align the app with the marketed concept and simplify the metric model:
  1. **Remove the composite metric** entirely (both "Financial Health" and "Financial Pulse" surfaces). This **supersedes** the 2026-03-08 "Finance Pulse" canonical-metric decision (that decision was about the composite score construct; the app name is now MoneyGator).
  2. **Add an Achievements system** as the primary gamified progress signal (learning, consistency, action, mastery categories), computed from real user progress.
  3. **Extend the daily lesson flow** to the full concept: theory → quiz → **practice (a real financial action)** → **periodic knowledge checks** (spaced repetition).
  4. **Personalize the daily lesson** from user data signals (credit due, subscription load, spending, savings).
- **Context:** The public site describes one personalized lesson/day (theory→quiz→practice→periodic checks) plus paths, financial metrics and goal progress. The app previously showed two duplicative composite scores and had no practice/knowledge-check steps; "today's lesson" was hardcoded and its Start button was broken (navigated to a non-existent lesson id).
- **Practice definition:** A concrete in-app financial action tied to data (e.g. cancel a subscription, set a budget, set a savings goal, review transactions), which also unlocks achievements.
- **Evidence (implementation):**
  - `src/domain/achievements.ts`, `src/state/achievementsStore.ts`, `src/state/useAchievements.ts`
  - `src/components/AchievementsCard.tsx`, `src/components/AchievementBadge.tsx`, `src/screens/AchievementsScreen.tsx`
  - `src/domain/learn.ts` (selectDailyLesson, practiceRouteFor, knowledge-check helpers), `src/data/mock/lessons.ts` (topics + practice)
  - `src/screens/LessonDetailScreen.tsx` (practice step + knowledge checks), `src/screens/LearnScreen.tsx` (personalized daily lesson + due checks)
  - `src/screens/ProgressScreen.tsx` (Financial Pulse card → Achievements card)
- **Kept:** Concrete metrics (spending, subscriptions, cash), learning paths, XP/streak, and goal progress.
- **Impact:** Single, honest progress model aligned with the site; removes duplicative composite scoring; delivers the promised practice + knowledge-check loop.
- **Follow-ups:** Wire `subscriptionsCancelled` achievement to the real cancel flow if deeper tracking is needed; retire dead `DashboardScreen`/`HealthBreakdownScreen`/pulse components in a cleanup pass; make paths/quick-wins data-driven.
- **Review date:** Next weekly report.
