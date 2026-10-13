import { db, initDb, seedDb } from "@/src/data/database";
import { SplashScreen, Stack } from "expo-router";
import { useEffect, useState } from "react";

import { GluestackUIProvider } from '@/components/ui/gluestack-ui-provider';
import '@/global.css';
import { PlantDraftProvider } from "@/src/logic/plants/plant-draft-context";
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaListener } from 'react-native-safe-area-context';
import { Uniwind } from 'uniwind';

SplashScreen.preventAutoHideAsync()

export default function RootLayout() {
  const [ready, setReady] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  useEffect(() => {
    async function setup() {
      await initDb(db)
      await seedDb(db)
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
        {/* must be outside GluestackUIProvider: gluestack modals render at its overlay layer, so they only see providers above it */}
        <PlantDraftProvider>
          <GluestackUIProvider mode="dark">
            <Stack>
              <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
              <Stack.Screen name="camera" options={{ presentation: 'fullScreenModal', headerShown: false }} />
            </Stack>
          </GluestackUIProvider>
        </PlantDraftProvider>
      </GestureHandlerRootView>
    </SafeAreaListener>
  
  );
}
