# Local API server (stub)

Minimal Express server for local dev. Serves metrics and learn data so the app can call a real API instead of mocks.

## Run the server

```bash
cd server && npm install && npm run dev
```

Or from repo root:

```bash
npm run api
```

You should see: `API server running on http://localhost:3000`

## Use the app with the real API

1. In the app root, set env (e.g. in `.env`):
   - `EXPO_PUBLIC_USE_MOCK_API=false`
   - `EXPO_PUBLIC_API_BASE_URL=http://localhost:3000`
2. Restart the Expo bundler so it picks up env changes.
3. Start the server (see above).
4. Run the app: `npm start` then open on device/simulator. Progress and Learn tabs will load metrics/learn from the server.

## Endpoints

- `GET /metrics` — returns MetricSnapshot JSON
- `GET /learn` — returns `{ lessons, paths, challenges }` JSON
- `POST /learn/lessons/:id/complete` — marks lesson as done (204, no body)
