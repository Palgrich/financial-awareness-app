import React, { useEffect, useState } from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { RootNavigator } from './src/navigation';
import { useStore } from './src/state/store';
import { useAuthStore } from './src/state/authStore';
import { checkHealth } from './src/api/endpoints/health';
import { QueryClientProvider } from '@tanstack/react-query';
import { colors } from './src/theme/tokens';
import { queryClient } from './src/api/queryClient';

async function runHealthCheck(setApiOk: (ok: boolean) => void) {
  try {
    const res = await checkHealth();
    console.log('[api] health', res?.status);
    setApiOk(true);
  } catch (e) {
    console.log('[api] health failed');
    setApiOk(false);
  }
}

export default function App() {
  const hydrate = useStore((s) => s.hydrate);
  const setAppLoaded = useStore((s) => s.setAppLoaded);
  const dark = useStore((s) => s.preferences.darkMode);
  const [apiOk, setApiOkState] = useState<boolean | null>(null);
  const [retryInProgress, setRetryInProgress] = useState(false);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      await hydrate();
      await useAuthStore.getState().hydrateAuth();
      await runHealthCheck((ok) => {
        if (!cancelled) setApiOkState(ok);
      });
      if (!cancelled) setAppLoaded(true);
    })();
    return () => {
      cancelled = true;
    };
  }, [hydrate, setAppLoaded]);

  // Auto re-check every 3s while offline; single timer, cleared on cleanup or when apiOk changes
  useEffect(() => {
    if (apiOk !== false) return;
    const id = setInterval(async () => {
      try {
        await checkHealth();
        setApiOkState(true);
      } catch {
        // stay offline
      }
    }, 3000);
    return () => clearInterval(id);
  }, [apiOk]);

  const handleRetry = () => {
    setRetryInProgress(true);
    runHealthCheck((ok) => {
      setApiOkState(ok);
      setRetryInProgress(false);
    });
  };

  if (apiOk === false) {
    return (
      <>
        <StatusBar style="dark" />
        <View style={styles.offlineRoot}>
          <Text style={styles.offlineTitle}>Server unavailable</Text>
          <Text style={styles.offlineSubtitle}>
            The API is not reachable. Start the server and tap Retry.
          </Text>
          <Pressable
            style={({ pressed }) => [styles.retryButton, pressed && styles.retryButtonPressed]}
            onPress={handleRetry}
          >
            <Text style={styles.retryButtonText}>Retry</Text>
          </Pressable>
          <Text style={styles.offlineStatus}>
            {retryInProgress ? 'Checking...' : 'Still offline.'}
          </Text>
        </View>
      </>
    );
  }

  return (
    <QueryClientProvider client={queryClient}>
      <StatusBar style={dark ? 'light' : 'dark'} />
      <RootNavigator />
    </QueryClientProvider>
  );
}

const styles = StyleSheet.create({
  offlineRoot: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.background.primaryStart,
    padding: 24,
  },
  offlineTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: colors.text.primary,
    marginBottom: 8,
    textAlign: 'center',
  },
  offlineSubtitle: {
    fontSize: 16,
    color: colors.text.muted,
    marginBottom: 24,
    textAlign: 'center',
  },
  retryButton: {
    backgroundColor: colors.accent.primary,
    paddingHorizontal: 24,
    paddingVertical: 14,
    borderRadius: 12,
  },
  retryButtonPressed: {
    opacity: 0.8,
  },
  retryButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text.white,
  },
  offlineStatus: {
    fontSize: 14,
    color: colors.text.muted,
    marginTop: 16,
  },
});
