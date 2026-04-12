// app/_layout.tsx
// -----------------------------------------------------------
// ROOT LAYOUT — the top-level navigation structure of the app.
//
// This uses a Stack navigator with three route groups:
// 1. (tabs)    — the tab bar shell (Home screen with daily goal + buttons)
// 2. morning/  — the Morning Reflection multi-step flow
// 3. evening/  — the Evening Reflection multi-step flow
//
// When the user taps "Morning Reflection" on the Home screen,
// the morning stack slides in ON TOP of the tabs (the tab bar
// disappears). When the flow completes, the user is sent back
// to the tabs and the tab bar reappears.
//
// ThemeProvider wraps everything so React Navigation uses dark
// colors for any built-in UI elements (like the back gesture).
// -----------------------------------------------------------

import { DarkTheme, ThemeProvider } from "@react-navigation/native";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import "react-native-reanimated";

// CRITICAL: Load NativeWind styles into the app
import "../global.css";

import { COLORS } from "@/constants/theme";

export const unstable_settings = {
  // `anchor` tells Expo Router which route is the "home" route.
  // If the app is deep-linked to an unknown route, it falls back here.
  anchor: "(tabs)",
};

export default function RootLayout() {
  return (
    // We always use DarkTheme since our app has a dark "Stone & Ink" aesthetic.
    // No need for light/dark toggle — the app is always dark.
    <ThemeProvider value={DarkTheme}>
      <Stack
        screenOptions={{
          // Hide the header bar on ALL screens by default.
          // Each screen can override this if needed.
          headerShown: false,

          // Set the background color for the navigation container.
          // This prevents white flashes during screen transitions.
          contentStyle: { backgroundColor: COLORS.background },
        }}
      >
        {/* The tab bar shell — contains the Home screen */}
        <Stack.Screen name="(tabs)" />

        {/* Morning flow — slides in over the tabs when started */}
        <Stack.Screen name="morning" />

        {/* Evening flow — slides in over the tabs when started */}
        <Stack.Screen name="evening" />
      </Stack>

      {/* StatusBar "light" = white text/icons in the status bar.
          Essential on dark backgrounds — otherwise the status bar
          text would be black-on-black and invisible. */}
      <StatusBar style="light" />
    </ThemeProvider>
  );
}
