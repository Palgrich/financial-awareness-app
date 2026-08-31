# Frontend Audit — MoneyGator (Phase 1, read-only)

**Date:** 2026-08-30
**Scope:** `src/screens`, `src/components`, `src/domain`, `src/insights`, `src/awareness`, `src/data`, `package.json`
**Product lens:** MoneyGator is **EdTech, not FinTech**. Two tabs — **Progress** (data as trigger) and **Learn** (education as product). Every screen must serve one of these. **Budget** as a concept was explicitly rejected (we use month-over-month comparison instead). Debt tracking is a **tracker-only** feature that serves neither tab.

**Method:** Reachability was traced from `src/navigation/` — a screen counts as reachable only if a `navigate('X')` (or tab jump) actually targets it from an already-reachable screen. Registration in a stack is **not** sufficient. Import graphs were built with `grep` across the whole tree (excluding each file's own definition and the `components/index.ts` barrel).

> **Reachability spine:** `RootNavigator → TabNavigator`. Only **Dashboard** (renders `ProgressScreen`) and **Learn** tabs have visible buttons; `Transactions/Subscriptions/Coach/Profile/Budget/Debts` tabs are mounted but hidden (`tabBarButton: () => null`). Nothing calls `navigate('Budget')` or `navigate('Debts')`, so those two stacks' home screens are unreachable.

---

## 1. Screens (`src/screens/`) — 32 total

| File | Type | Reachable | Purpose | Data source | Used by (entry) | Verdict |
|---|---|---|---|---|---|---|
| ProgressScreen.tsx (381) | tab home | ✅ Dashboard tab | DATA-TRIGGER | **live** (RQ) + mock fallback | tab | **KEEP** |
| LearnScreen.tsx (559) | tab home | ✅ Learn tab | EDUCATION | mock + hardcoded (paths/quickwins) | tab | **KEEP** |
| LessonDetailScreen.tsx (232) | detail | ✅ `LessonDetail` | EDUCATION | store | LearnScreen | **KEEP** |
| QuickWinScreen.tsx (257) | detail | ✅ `QuickWin` | EDUCATION | mock (cancellationGuides) | LearnScreen | **KEEP** |
| AchievementsScreen.tsx (121) | detail | ✅ `Achievements` | EDUCATION (gamification) | stores (derived) | Progress/Learn | **KEEP** |
| CoachScreen.tsx (223) | detail | ✅ `CoachHome` | EDUCATION | rule-based + store | FAB / nav | **KEEP** (see budget note) |
| SubscriptionsScreen.tsx (534) | detail | ✅ `SubscriptionsHome` | DATA-TRIGGER | **live** (RQ) + mock fallback | ProgressScreen | **KEEP** |
| TransactionsScreen.tsx (416) | detail | ✅ `TransactionsHome` | DATA-TRIGGER | store (mock/live via bootstrap) | ProgressScreen | **KEEP-BUT-WIRE-TO-LIVE** |
| TransactionsByCategoryScreen.tsx (86) | detail | ✅ `TransactionsByCategory` | DATA-TRIGGER | store | DashboardScreen†/Transactions | **KEEP** |
| TransactionDetailScreen.tsx (75) | detail | ✅ `TransactionDetail` | DATA-TRIGGER | store | Transactions | **KEEP-BUT-WIRE-TO-LIVE** |
| SubscriptionDetailScreen.tsx (90) | detail | ✅ `SubscriptionDetail` | DATA-TRIGGER | mock | SubscriptionsScreen | **KEEP-BUT-WIRE-TO-LIVE** |
| NotificationsScreen.tsx (163) | detail | ✅ `Notifications` | DATA-TRIGGER | mock (insightEngine + progressUserData) | many | **KEEP-BUT-WIRE-TO-LIVE** |
| MenuScreen.tsx (71) | infra | ✅ `Menu` | infra (hub) | — | headers | **KEEP** |
| SettingsScreen.tsx (155) | infra | ✅ `Settings` | infra | store | Menu/Profile | **KEEP** (strip budget/debt links) |
| ProfileScreen.tsx (153) | infra | ✅ `Profile` | infra | store | tab jump | **KEEP** (strip budget/debt links) |
| LoginScreen.tsx (182) | auth | ✅ AuthStack | infra (auth) | server | RootNavigator | **KEEP** |
| RegisterScreen.tsx (196) | auth | ✅ AuthStack | infra (auth) | server | RootNavigator | **KEEP** |
| **DashboardScreen.tsx (457)** | — | ❌ never routed | DEAD (superseded by ProgressScreen) | mock + clarity | none | **DELETE** |
| **HealthBreakdownScreen.tsx (197)** | — | ❌ never navigated | DEAD (composite score, removed) | mock | none | **DELETE** |
| **PaycheckBreakdownScreen.tsx (143)** | — | ❌ never navigated | TRACKER-ONLY / DEAD | mock | none | **DELETE** |
| **CreditCardDetailsScreen.tsx (167)** | — | ❌ never navigated | TRACKER-ONLY / DEAD | mock | none | **DELETE** |
| **ProgressSubscriptionListScreen.tsx (180)** | — | ❌ never navigated | DEAD (superseded by SubscriptionsScreen) | mock | none | **DELETE** |
| **PathDetailScreen.tsx (49)** | — | ❌ never navigated | EDUCATION but unwired / DEAD | mock | none | **DELETE** |
| **ChallengeDetailScreen.tsx (90)** | — | ❌ never navigated | DEAD | mock | none | **DELETE** |
| **QuestSubscriptionCleanseScreen.tsx (574)** | — | ❌ only from dead HealthBreakdown | DEAD (quest chain) | mock | dead only | **DELETE** |
| **QuestCelebrationScreen.tsx (104)** | — | ❌ only from dead quest/ProgressSubList | DEAD (quest chain) | params | dead only | **DELETE** |
| **BudgetScreen.tsx (63)** | — | ❌ Budget tab never jumped | REJECTED concept | mock | none | **DELETE** |
| **BudgetSetupScreen.tsx (101)** | — | ⚠️ reachable (Coach/Profile/Settings) | REJECTED concept | store | Coach/Profile/Settings | **DELETE** (+ remove entry points) |
| **DebtsScreen.tsx (62)** | — | ❌ Debts tab never jumped | TRACKER-ONLY | mock | none | **DELETE** |
| **DebtsListScreen.tsx (72)** | — | ⚠️ reachable (Profile/Settings) | TRACKER-ONLY | store | Profile/Settings | **DELETE** (+ remove entry points) |
| **AddDebtScreen.tsx (132)** | — | ⚠️ reachable (Coach/DebtsList) | TRACKER-ONLY | store | Coach/DebtsList | **DELETE** |
| **EditDebtScreen.tsx (175)** | — | ⚠️ reachable (DebtsList) | TRACKER-ONLY | store | DebtsList | **DELETE** |

† `TransactionsByCategory` is also navigated from the dead `DashboardScreen`, but it is independently reachable from the live `TransactionsScreen`, so it stays.

**Screens verdict:** 17 KEEP (4 of them KEEP-BUT-WIRE-TO-LIVE), **15 DELETE** (~2,566 lines).

---

## 2. Components (`src/components/`) — ~48 files

### KEEP (live) — 16
`AppHeader` (14), `MoneyGatorLogo` (via AppHeader), `LiquidGlassTabBar` (TabNavigator), `Card` (12+ live), `PrimaryButton` (9), `SecondaryButton` (7), `SectionTitle` (Profile/Settings), `ListRow` (TransactionsByCategory), `Chip` (Transactions), `EmptyState` (TransactionsByCategory), `FloatingAIButton` (Subscriptions), `AchievementsCard` (Progress), `AchievementBadge` (Achievements), `PulseTiles` (Progress), `TodaysActionCard` (Progress).

### DELETE — directly unused (0 live importers)
| Component | Lines | Why |
|---|---|---|
| **components/learn/** (9 files) | 1,143 | `ChallengesCard`, `CollapsibleSection`, `DailyGoalCard`, `LearnRow`, `LearningPathsCard`, `LessonsCard`, `QuestCard`, `QuickWinCard`, `TodaysMissionCard` — **none imported by any screen** (LearnScreen is self-contained with inline cards) |
| DashboardHeroCard | 169 | 0 importers |
| FinancialAwarenessCard | 126 | 0 importers |
| FinancialWeatherCard | 141 | 0 importers (removed from ProgressScreen) |
| ImproveAwarenessCard | 62 | 0 importers |
| PaydayStatusCard | 166 | 0 importers |
| StatTile | 79 | 0 importers |
| SubscriptionCard | 118 | 0 importers |
| UntilNextPaycheckCard | 98 | 0 importers |

### DELETE — dead only via a dead consumer (cascade)
| Component | Lines | Only consumer(s) |
|---|---|---|
| DonutChart | 295 | DashboardScreen (dead) |
| ScopeSelector | 141 | DashboardScreen (dead) |
| FinancialAwarenessOverviewCard | 210 | DashboardScreen (dead) |
| FinancialHealthHeroCard | 169 | DashboardScreen (dead) |
| FinancialAwarenessHeroCard | 129 | DashboardHeroCard (dead) |
| FinancialPulseCard | 255 | only a stale `// FinancialPulseCard props` comment in ProgressScreen |
| MetricCard | 395 | DashboardScreen (dead) + **stale import** in ProgressScreen (imported, not rendered) |
| CashControlCard | 292 | **stale import** in ProgressScreen (imported, not rendered) |
| WeeklySparkline | 70 | CashControlCard (→ dead) |
| LoadingSkeleton | 67 | DashboardScreen + BudgetScreen + DebtsScreen (all dead) |
| DebtSnapshotCard | 73 | DebtsScreen (dead) |
| BudgetWidget | 99 | BudgetScreen (dead) |
| GlassCardContainer | 102 | only dead cards (FinancialHealth/Weather, MetricCard, CashControlCard, learn/*) |
| IllustrationBackgroundLayer | 76 | only dead cards |
| StatusBadge | 62 | only dead cards (tokens.ts ref is a **comment**) |
| SegmentProgressBar | 64 | only dead cards (tokens.ts ref is a **comment**) |

> ⚠️ **Cascade caveat:** the second table is dead *after* the DELETE screens/components go. Phase 2 must delete top-down and lean on `tsc` after each layer — if any of these turns out to have a live importer, `tsc` catches it and it stays.

**Components verdict:** ~16 KEEP, **~25 DELETE** (~4,600 lines).

---

## 3. Domain / Insights / Awareness

| Module | Exports (key) | Live importers | Verdict |
|---|---|---|---|
| domain/subscriptions.ts | detectRecurring*, detectSubscriptionList, load/annual | SubscriptionsScreen, ProgressScreen, awareness/score, insightEngine, CoachScreen | **KEEP** |
| domain/learn.ts | selectDailyLesson, practiceRouteFor, knowledge checks | LearnScreen, LessonDetail, store | **KEEP** |
| domain/achievements.ts | ACHIEVEMENTS, buildAchievements | useAchievements, Achievements* | **KEEP** |
| domain/cashControl.ts | getCurrentBalance, MoM helpers | ProgressScreen (+ dead CashControlCard) | **KEEP** (prune CashControl-only exports) |
| domain/spending.ts | getExpensesForPeriod, getCategoryBreakdown | insightEngine, CoachScreen, TransactionsByCategory (+ dead Dashboard) | **KEEP** |
| awareness/score.ts | calculateFinancialClarity | CoachScreen (+ dead Dashboard) | **KEEP** (composite score; used only by Coach now — review) |
| insights/insightEngine.ts + insightTypes.ts | insight generation | NotificationsScreen | **KEEP** |
| **domain/budget.ts** (47) | computeBudget, getBudgetUsage | **CoachScreen** (live), BudgetScreen, BudgetSetupScreen (dead) | **DELETE** ⚠️ requires CoachScreen surgery (remove budget tips + `BudgetSetup` CTA) |
| **domain/debts.ts** (32) | debt helpers | DebtsScreen (dead) only | **DELETE** |

---

## 4. Data / mock (`src/data/`)

| File | Live importers | Verdict |
|---|---|---|
| data/mock/{accounts,transactions,subscriptions,institutions,challenges,insights,index} | store + api endpoints | **KEEP** (mock fallback / bootstrap) |
| data/mock/lessons.ts | store | **KEEP** |
| data/progressUserData.ts | progressStore + ProgressScreen fallback | **KEEP** (fallback only) |
| data/mocks.ts | api/endpoints/{learn,metrics} | **KEEP** |
| data/learnUserData.ts, data/learnQuestStorage.ts | Learn stores | **KEEP** |
| data/cancellationGuides.ts | QuickWinScreen | **KEEP** |
| **data/api.ts** (20) | none | **DELETE** |
| **data/learnMock.ts** (124) | none | **DELETE** |

---

## 5. Duplicated logic

1. **Cash balance (checking+savings sum)** — canonical `getCurrentBalance()` in `cashControl.ts`; duplicated inline in `DashboardScreen` (`availableCash` reduce). Dies with DashboardScreen.
2. **Subscription totals** — three parallel implementations: `getAnnualSubscriptionCost`/`getSubscriptionLoadPercent` (domain), `detectRecurringFromTransactions`/`detectSubscriptionList` (domain, live), and `progressUserData.subscriptionMonthly` (mock). Live screens now share the detector; the mock figure lingers as fallback.
3. **Composite "health/clarity" score** — `awareness/score.calculateFinancialClarity`, `progressUserData.totalHealthScore`/`awarenessScore`, and `FinancialPulseCard.healthPercent` all model the same rejected metric. After DELETE, only `calculateFinancialClarity` (used by CoachScreen) remains — **flag for product review** since the composite score was dropped.
4. **Next-billing date** — previously duplicated (`nextBillingDate` +1mo vs domain `addDays` +30d); already consolidated to the domain helper.

---

## 6. Dependencies (`package.json`)

| Package | Direct imports | Verdict |
|---|---|---|
| **ansi-escapes** | 0 (not in src or config) | **DELETE** (not an RN runtime dep) |
| **react-native-chart-kit** | 0 (charts use react-native-svg directly) | **DELETE** |
| nativewind | 0 `className=` in src; referenced in `babel.config.js` + `tailwind.config.js` | **INVESTIGATE** (configured but unused; removal needs babel/metro/tailwind cleanup) |
| expo-asset | 0 direct | **INVESTIGATE** (may be transitive Expo dep) |
| expo-font | 0 direct | **KEEP** (transitive peer of `@expo-google-fonts/inter`) |
| react-native-screens | 0 direct | **KEEP** (peer of native-stack) |
| react-native-worklets | 0 direct | **KEEP** (peer of reanimated) |

---

## Summary

- **Screens:** 32 total → **15 DELETE**, 17 KEEP (4 flagged KEEP-BUT-WIRE-TO-LIVE). ~**2,566** screen lines removed.
- **Components:** ~48 total → **~25 DELETE** (all 9 `learn/*` + 8 orphans + ~8 cascade). ~**4,600** component lines removed.
- **Domain/data:** DELETE `domain/budget.ts`, `domain/debts.ts`, `data/api.ts`, `data/learnMock.ts` (~223 lines) + prune unused exports.
- **Dependencies:** DELETE `ansi-escapes`, `react-native-chart-kit`; investigate `nativewind`, `expo-asset`.
- **Estimated total removed: ~7,000–7,500 lines** across ~40 files, plus ~10 route registrations.

### KEEP-BUT-WIRE-TO-LIVE (out of scope for cleanup; separate task)
`TransactionsScreen`, `TransactionDetailScreen`, `SubscriptionDetailScreen`, `NotificationsScreen`.

### Phase 2 order (proposed, top-down with `tsc` between layers)
1. Delete 15 DELETE screens + remove their routes from `DashboardStack`/`LearnStack` + param-list types.
2. Remove now-orphaned entry points: `BudgetSetup`/`DebtsList`/`AddDebt`/`EditDebt` links in `CoachScreen`, `ProfileScreen`, `SettingsScreen`; drop `Budget`/`Debts` tabs + their stacks.
3. `domain/budget.ts` removal → surgically strip budget coaching + `BudgetSetup` CTA from `CoachScreen`.
4. Delete dead components (top-down: learn/*, orphans, then cascade), fixing stale imports in `ProgressScreen` (`MetricCard`, `CashControlCard`, pulse comment).
5. Delete `domain/debts.ts`, `data/api.ts`, `data/learnMock.ts`; prune unused exports.
6. Remove `ansi-escapes`, `react-native-chart-kit` from `package.json`.
7. `tsc --noEmit` clean → run app → confirm Progress + Learn tabs render and navigate → commit.

### Phase 2 decisions (confirmed 2026-08-30)
- **Debts → DELETE entirely.** Remove `DebtsScreen`, `DebtsListScreen`, `AddDebtScreen`, `EditDebtScreen`, `domain/debts.ts`, `DebtSnapshotCard`, the `Debts` tab + `DebtsStack`, and every entry point (Profile/Settings/Coach).
- **nativewind → REMOVE fully.** Drop the dependency and clean `babel.config.js`, `tailwind.config.js`, `metro.config.js`, `nativewind-env.d.ts`. Plus `ansi-escapes` and `react-native-chart-kit`.
- **`calculateFinancialClarity` (composite score) → RETIRE.** Delete `awareness/score.ts` and rewire `CoachScreen` off the composite score onto concrete metrics (spending / subscriptions / cash / MoM). ⚠️ This makes CoachScreen a non-trivial edit, not a pure delete.

> **Scope note:** with the composite score retired *and* budget removed, `CoachScreen` needs a real rewrite (drop `domain/budget` + `awareness/score`, keep rule-based tips sourced from `domain/spending`, `domain/subscriptions`, `domain/cashControl`). This is the single riskiest edit in Phase 2.
