// app/(tabs)/_layout.tsx
// -----------------------------------------------------------
// TAB BAR LAYOUT — defines the persistent bottom tab bar.
//
// Three tabs (left → right):
//   1. Morning Reflection — sun icon, navigates to /morning/step1
//   2. Home              — house icon, the main daily overview screen
//   3. Evening Reflection — moon icon, navigates to /evening/step1
//
// The Morning and Evening tabs use a `tabPress` listener to
// intercept navigation and redirect into the actual reflection
// flow stacks, resetting the store first so each flow starts fresh.
// Their stub screen files (morning.tsx / evening.tsx) satisfy Expo
// Router's file-based routing requirement but are never rendered.
//
// We style the tab bar to match our "Stone & Ink" dark aesthetic.
// -----------------------------------------------------------

import { HapticTab } from "@/components/haptic-tab";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { COLORS } from "@/constants/theme";
import useReflectionStore from "@/store/useReflectionStore";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { router, Tabs, usePathname } from "expo-router";
import React from "react";
import { Dimensions, Easing } from "react-native";

// Capture width once — used to compute the off-screen translateX for each tab scene.
// Morning (index 0) sits to the LEFT of Home (index 1).
// Evening (index 2) sits to the RIGHT of Home (index 1).
// React Navigation v7 animates `progress` as a continuous value:
//   -1 → this screen's index is lower than active (off-screen LEFT = −SCREEN_WIDTH)
//    0 → this screen IS the active tab          (on-screen   CENTER = 0)
//   +1 → this screen's index is higher than active (off-screen RIGHT = +SCREEN_WIDTH)
const SCREEN_WIDTH = Dimensions.get("window").width;

function getReflectionDayKey(date = new Date()) {
  const shiftedDate = new Date(date);
  shiftedDate.setHours(shiftedDate.getHours() - 3, 0, 0, 0);
  const year = shiftedDate.getFullYear();
  const month = String(shiftedDate.getMonth() + 1).padStart(2, "0");
  const day = String(shiftedDate.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

export default function TabLayout() {
  const morningCompletedDayKey = useReflectionStore(
    (state) => state.morning_completed_day_key,
  );
  const eveningCompletedDayKey = useReflectionStore(
    (state) => state.evening_completed_day_key,
  );

  const today = getReflectionDayKey();
  const isMorningDone = morningCompletedDayKey === today;
  const isEveningDone = eveningCompletedDayKey === today;

  const morningLabel = isMorningDone ? "Good Morning Sunshine" : "Reflection";
  const eveningLabel = isEveningDone ? "A man needs his rest" : "Reflection";

  // usePathname() returns the full current URL path (e.g. "/morning/step3", "/", "/evening/step2").
  // This is reliable across all navigator depths, unlike useNavigationState which only
  // sees the nearest navigator's state (which would be the root Stack, not the tab names).
  const pathname = usePathname();

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarButton: HapticTab,
        tabBarActiveTintColor: COLORS.gold,
        tabBarInactiveTintColor: COLORS.inkFaint,
        tabBarStyle: {
          backgroundColor: COLORS.surface,
          borderTopColor: COLORS.border,
        },
        // Horizontal slide transition: each tab scene is translated based on its
        // position relative to the currently active tab.
        sceneStyleInterpolator: ({ current: { progress } }) => ({
          sceneStyle: {
            transform: [
              {
                translateX: progress.interpolate({
                  inputRange: [-1, 0, 1],
                  outputRange: [-SCREEN_WIDTH, 0, SCREEN_WIDTH],
                  extrapolate: "clamp",
                }),
              },
            ],
          },
        }),
        // Smooth 300 ms ease-in-out — no bounce, no overshoot.
        transitionSpec: {
          animation: "timing",
          config: {
            duration: 300,
            easing: Easing.inOut(Easing.ease),
          },
        },
      }}
    >
      {/* Morning Reflection tab */}
      <Tabs.Screen
        name="morning"
        options={{
          tabBarLabel: morningLabel,
          tabBarIcon: ({ color }) => (
            <MaterialIcons
              name={isMorningDone ? "check-circle" : "wb-sunny"}
              size={26}
              color={color}
            />
          ),
        }}
        listeners={{
          tabPress: (e) => {
            e.preventDefault();
            // Already in the morning flow — do nothing, preserve progress.
            if (pathname.startsWith("/morning")) return;
            useReflectionStore.getState().resetMorning();
            router.push("/morning/step1");
          },
        }}
      />

      {/* Home tab */}
      <Tabs.Screen
        name="index"
        options={{
          title: "Home",
          tabBarIcon: ({ color }) => (
            <IconSymbol size={26} name="house.fill" color={color} />
          ),
        }}
        listeners={{
          tabPress: (e) => {
            // Already on Home — do nothing.
            if (pathname === "/") e.preventDefault();
          },
        }}
      />

      {/* Evening Reflection tab */}
      <Tabs.Screen
        name="evening"
        options={{
          tabBarLabel: eveningLabel,
          tabBarIcon: ({ color }) => (
            <MaterialIcons
              name={isEveningDone ? "check-circle" : "brightness-2"}
              size={26}
              color={color}
            />
          ),
        }}
        listeners={{
          tabPress: (e) => {
            e.preventDefault();
            // Already in the evening flow — do nothing, preserve progress.
            if (pathname.startsWith("/evening")) return;
            useReflectionStore.getState().resetEvening();
            router.push("/evening/step1");
          },
        }}
      />
    </Tabs>
  );
}
