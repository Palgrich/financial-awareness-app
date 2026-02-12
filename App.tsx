import React, { useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import { RootNavigator } from './src/navigation';
import { useStore } from './src/state/store';
import { mockFetch } from './src/data/api';

export default function App() {
  const hydrate = useStore((s) => s.hydrate);
  const setAppLoaded = useStore((s) => s.setAppLoaded);
  const dark = useStore((s) => s.preferences.darkMode);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      await hydrate();
      await mockFetch(null, 700);
      if (!cancelled) setAppLoaded(true);
    })();
    return () => { cancelled = true; };
  }, [hydrate, setAppLoaded]);

  return (
    <>
      <StatusBar style={dark ? 'light' : 'dark'} />
      <RootNavigator />
    </>
  );
}
