import { Stack } from "expo-router";

// keeps the collections list as the first screen of this stack, so back from a collection always returns to it
export const unstable_settings = {
  anchor: "index",
};

export default function CollectionsLayout() {
  return (
    <Stack
      screenOptions={{
        headerStyle: {
          backgroundColor: '#1ea11c',
        },
        headerShadowVisible: false,
        headerTintColor: '#e3e6e3',
      }}
    >
      <Stack.Screen name="index" options={{ title: 'Plants' }} />
      <Stack.Screen name="[id]" options={{ title: 'Collection' }} />
    </Stack>
  );
}
