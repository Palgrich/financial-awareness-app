# Finance MVP

## Cursor Cloud specific instructions

This is a **frontend-only** React Native + Expo personal finance app. There is no backend, no database, and no external services. All data is mock data in `src/data/mock/`.

### Running the app

- **Web (recommended on Linux):** `npx expo start --web --port 8081` — opens in browser at `http://localhost:8081`
- Standard scripts are in `package.json`: `npm run web`, `npm run start`, etc.
- Web dependencies (`react-dom`, `react-native-web`, `@expo/metro-runtime`) must be installed for web mode; they are added via `npx expo install react-dom react-native-web @expo/metro-runtime`.

### Type checking

- `npx tsc --noEmit` — there is no separate lint script; TypeScript strict mode is the primary static check.

### Testing

- No automated test framework is configured. Manual testing via the web browser is the primary verification method.

### Gotchas

- NativeWind (TailwindCSS for RN) uses `babel-preset-expo` with `jsxImportSource: 'nativewind'` and `nativewind/babel` preset — see `babel.config.js`.
- The `react-native-reanimated/plugin` Babel plugin must be listed last in the plugins array.
- No `.env` files or secrets are required.
