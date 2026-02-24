# Implementing the Figma Design in React Native

Your Figma export lives in `src/app/` (components) and `src/styles/` (CSS). The **app is Expo/React Native**, while the Figma code uses **web** (div, Tailwind `className`, CSS gradients, `lucide-react`). So we don’t run the Figma app as-is; we **reimplement the same design** in RN using your existing screens and navigation.

---

## 1. Design tokens (Figma → RN)

- **Source:** `src/app/constants/designTokens.ts`
- **Target:** `src/theme/tokens.ts` (already RN-friendly)

**Actions:**

- Add Figma-specific values to `src/theme/tokens.ts`:
  - **Card gradients:** use start/end hex colors (e.g. hero: `#5B7CFA` → `#8B5CF6`; awareness: `#ECFDF5` → `#D1FAE5`; spending: `#FFF7ED` → `#FFEDD5`; subscription: `#FEF2F2` → `#FEE2E2`; cash: `#ECFDF5` → `#DCFCE7`; credit: `#EFF6FF` → `#DBEAFE`).
  - **Status colors:** good/strong `#22C55E`, moderate `#F59E0B`, high `#EF4444`.
  - **Badge backgrounds:** rgba variants for good/moderate/high/strong.
  - **Nav:** background colors (or gradient stops), border, active tab colors, blur not directly in RN (use opacity/solid colors or `expo-blur`).
- Keep values as **numbers** (e.g. `28` for radius) or **hex/rgba strings** so StyleSheet and `LinearGradient` can use them.

---

## 2. React Native versions of Figma components

Build these under `src/components/` (or `src/components/progress/`) using **View, Text, TouchableOpacity, StyleSheet**. Use **expo-linear-gradient** for card and nav gradients.

| Figma component (`src/app/components/`) | RN equivalent | Purpose |
|----------------------------------------|----------------|---------|
| `FinancialHealthHeroCard`               | e.g. `FinancialHealthHeroCard.tsx` (RN) | Purple hero card: score (82/100), status “Good”, 5-segment bar, description |
| `MetricCard`                            | e.g. `ProgressMetricCard.tsx` (RN)      | Colored cards: title, status pill, context, value, comment, 5-segment bar, “See all →” |
| `GlassCardContainer`                    | Use `LinearGradient` + `View` in each card | Rounded card with gradient background and overlay |
| `StatusBadge`                           | e.g. `StatusBadge.tsx` (RN)            | Pill with status text (Good / Moderate / High / Strong) |
| `ProgressBar`                           | e.g. `SegmentProgressBar.tsx` (RN)     | 5 horizontal segments, filled by count, hero vs default colors |
| `IllustrationBackgroundLayer`            | Optional: blurred/opacity image or emoji in corner | Decorative asset in card corner |
| `LiquidGlassNavigation`                 | e.g. `LiquidGlassNav.tsx` (RN)        | Bottom bar: Progress (home), Learn (book), active pill |

- **Icons:** use `lucide-react-native` (or your existing icon set) for Bell, Menu, Home, BookOpen so they match the Figma app.
- **Gradients:** add `expo-linear-gradient` and use `<LinearGradient colors={[start, end]} style={...} />` for hero card, metric cards, and nav bar.

---

## 3. Dashboard / Progress screen layout

- **Header:** title “Progress”, subtitle “Your money clarity”, right: bell + menu (same as Figma `App.tsx`).
- **Content (scrollable):**
  1. **Financial Health** (hero): score from your clarity/health logic (e.g. 82/100), label “Good”, 4/5 segments, description “Your finances are stable with room to improve”.
  2. **Financial awareness:** “6 / 23 lessons completed”, progress segments, “Learn more →”.
  3. **Spending control:** “Expenses this month”, value (e.g. $870.39), “This month $25 less.”, “All transactions →”, status Moderate.
  4. **Subscription load:** “16 active”, “$286.85 / month”, “See all →”, status High.
  5. **Cash stability:** “4 accounts”, “$27,520.50”, “This month net + $5,529.61”, “Accounts →”, status Strong.
  6. **Credit health:** “Last statement”, “$0”, “Details →”, status Strong.

- **Data:** keep using your existing store (e.g. `useStore` for accounts, transactions, subscriptions, clarity score) and map them into the props for the new RN hero and metric cards.
- **Bottom nav:** use the new liquid-glass-style bar; “Progress” = current dashboard, “Learn” = navigate to your Learn screen.

---

## 4. `src/styles/` (CSS)

- **theme.css / tailwind.css** are for **web** (e.g. `expo start --web`). They are **not** used by React Native.
- **Options:**
  - **Mobile-only:** ignore these files for now; implement the same design via `src/theme/tokens.ts` and StyleSheet.
  - **Web later:** when you add a web entry, import the appropriate CSS and optionally reuse the same token values in CSS variables.

---

## 5. Suggested order of work

1. Add **Figma token values** (card gradient colors, status, badge, nav) to `src/theme/tokens.ts`.
2. Install **expo-linear-gradient** (and **lucide-react-native** if you want matching icons).
3. Implement **StatusBadge** and **SegmentProgressBar** in RN.
4. Implement **FinancialHealthHeroCard** (RN) using `LinearGradient` and the new progress bar.
5. Implement **ProgressMetricCard** (RN) for awareness, spending, subscription, cash, credit.
6. Implement **LiquidGlassNav** (RN) and hook it to Progress / Learn.
7. **Update DashboardScreen** (or rename to “Progress”): new header, new card list with real data, new bottom nav.
8. Optionally add **IllustrationBackgroundLayer** (blurred image or emoji) to cards for polish.

---

## 6. What to do with `src/app/` and `src/styles/`

- **Keep** them as **design reference** (and for a possible future web version). Do **not** import Figma’s web components or CSS into the RN app.
- Implement the UI in **React Native** only; the Figma export is the spec, not the runtime code for mobile.

Once tokens and one hero + one metric card are in place, the rest is repetition and wiring data and navigation.
