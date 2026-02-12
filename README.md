# Finance MVP – Frontend-only personal finance app

A **frontend-only** MVP for a US personal finance app with analytics, subscriptions, learning, and an AI coach. No backend or real bank connections; uses mock data and local state only.

## Features

- **Dashboard**: Net income/expenses, top spending categories, savings progress, 30-day spend chart, insights, recent transactions with filters (All / Income / Expenses).
- **Subscriptions**: Total monthly cost, list with status badges (Active / Trial / Cancelled), detail modal with “Mark as cancelled.”
- **Coach**: Chat-style UI with quick prompts and rules-based “AI” responses; CTAs to lessons and challenges.
- **Learn**: Learning paths (Avoid fees, Build savings, Understand CDs, Master subscriptions), lesson list with progress, lesson detail with sections and optional quiz, challenge detail.
- **Profile**: Currency, monthly income, savings goal, dark mode toggle, reset demo data, “Connect bank” (demo modal), disclaimer.

## Tech stack

- **React Native** with **Expo**
- **TypeScript**
- **React Navigation** (stack + bottom tabs)
- **Zustand** for state
- **AsyncStorage** for local persistence
- **NativeWind** (Tailwind for RN) – theme/spacing; components use StyleSheet for compatibility
- **react-native-chart-kit** + **react-native-svg** for charts

## Setup

1. **Prerequisites**: Node.js 18+ (Expo and React Native 0.76 require it).

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Start the app**

   ```bash
   npx expo start
   ```

   Then press `i` for iOS simulator or `a` for Android emulator, or scan the QR code with Expo Go.

4. **Optional: custom icon/splash**

   Add `assets/icon.png` and `assets/splash-icon.png` and set `icon` and `splash` in `app.json` if you want a custom icon and splash screen.

## Project structure

```
src/
  components/     # Reusable UI: AppHeader, Card, StatTile, SectionTitle, ListRow, Chip, PrimaryButton, SecondaryButton, EmptyState, LoadingSkeleton
  screens/        # Dashboard, Subscriptions, Coach, Learn, Profile + detail screens
  navigation/      # Tab navigator + stack navigators per tab
  state/          # Zustand store + AsyncStorage persistence
  data/
    mock/         # Mock transactions, accounts, subscriptions, insights, lessons, challenges
    api.ts        # Mock API layer (delay simulation)
  types/          # TypeScript interfaces
  utils/          # format, theme, coachResponses
```

## Data and behavior

- **Mock data**: 3 accounts, 40 transactions (30 days), 6 subscriptions, 6 insights, 12 lessons, 3 challenges. See `src/data/mock/`.
- **Persistence**: Preferences (currency, income, savings goal, dark mode), subscription status, lesson progress, and challenge status are stored in AsyncStorage.
- **Reset**: Profile → “Reset demo data” restores all data and progress to the initial demo state.
- **Coach**: Responses are rules-based (keywords); no real AI. Suggests lessons and challenges where relevant.

## Constraints

- No payment features.
- No real bank login; “Connect bank” shows a demo modal only.
- Copy is concise, intermediate English.

## License

MIT.
