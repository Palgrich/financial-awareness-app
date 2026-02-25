# Dev API: Running the app against the local server on a physical iPhone

On a physical iPhone (Expo Go), **localhost** refers to the phone itself, not your Mac. So the app cannot reach a server running on your Mac using `http://localhost:3000`.

**Use your Mac’s LAN IP** instead, e.g. `http://10.0.0.19:3000`.

## Commands

**Get your Mac’s LAN IP (Wi‑Fi):**

```bash
ipconfig getifaddr en0
```

**Start the API server (from repo root):**

```bash
npm run api
```

The server listens on port 3000. Ensure your iPhone and Mac are on the same Wi‑Fi network.

## When your Mac’s IP changes

If your router assigns a new IP to your Mac (e.g. after reboot), update the app so it points to the new address:

1. Run `ipconfig getifaddr en0` to get the new IP.
2. Set it in the app, either:
   - In a **.env** file at the project root:
     ```bash
     EXPO_PUBLIC_API_BASE_URL=http://YOUR_MAC_IP:3000
     ```
   - Or when starting Expo:
     ```bash
     EXPO_PUBLIC_API_BASE_URL=http://10.0.0.19:3000 npx expo start
     ```
3. Restart the Expo bundler (and reload the app in Expo Go) so the new value is picked up.

If you don’t set `EXPO_PUBLIC_API_BASE_URL`, the app uses the default dev URL configured in `src/api/config.ts` (e.g. `http://10.0.0.19:3000`). When the IP changes, either update that default in code or set the env var as above.
