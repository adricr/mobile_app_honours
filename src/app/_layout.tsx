import { db, initDb, seedDb } from "@/data/database";
import { SplashScreen, Stack } from "expo-router";
import { useEffect, useState } from "react";

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
    <Stack>
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
    </Stack>
  );
}
