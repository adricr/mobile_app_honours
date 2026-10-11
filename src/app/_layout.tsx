import { db, initDb, seedDb } from "@/src/data/database";
import { SplashScreen, Stack } from "expo-router";
import { useEffect, useState } from "react";

import { GluestackUIProvider } from '@/components/ui/gluestack-ui-provider';
import '@/global.css';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaListener } from 'react-native-safe-area-context';
import { Uniwind } from 'uniwind';

SplashScreen.preventAutoHideAsync()

export default function RootLayout() {
  const [ready, setReady] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    async function setup() {
      try {
        await seedDb(db)
      } catch {
        // tables don't exist yet; if init or the retry fails, the error goes to .catch below
        await initDb(db)
        await seedDb(db)
      }
    }
    setup()
      .then(() => setReady(true))
      .catch((e) => setError(e))
  }, []);

  useEffect(() => {
    if (ready || error) {
      SplashScreen.hide();
    }
  }, [ready, error]);

  if (error) {
    // rethrow during render so a React error boundary can catch it
    throw error;
  }

  if (!ready) {
    return null;
  }

  return (
    
    <SafeAreaListener
      onChange={({ insets }) => {
        Uniwind.updateInsets(insets);
      }}
    >
      <GestureHandlerRootView style={{ flex: 1 }}>
        <GluestackUIProvider mode="dark">
          <Stack>
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
    </Stack>
        </GluestackUIProvider>
      </GestureHandlerRootView>
    </SafeAreaListener>
  
  );
}
