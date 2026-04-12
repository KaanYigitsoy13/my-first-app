// app/(tabs)/_layout.tsx
// -----------------------------------------------------------
// TAB BAR LAYOUT — defines the bottom tab bar and its tabs.
//
// Currently we have a single "Home" tab. The Morning and Evening
// Reflection flows are NOT tabs — they're separate stack routes
// that slide in on top of the tabs when the user taps a button
// on the Home screen. This keeps the tab bar simple.
//
// We style the tab bar to match our "Stone & Ink" dark aesthetic.
// -----------------------------------------------------------

import { Tabs } from "expo-router";
import React from "react";

import { HapticTab } from "@/components/haptic-tab";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { COLORS } from "@/constants/theme";

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        // Hide the header on all tab screens — we handle our own headers
        headerShown: false,

        // Use our HapticTab component for tab buttons (adds vibration on tap)
        tabBarButton: HapticTab,

        // Style the tab bar to match Stone & Ink palette
        tabBarActiveTintColor: COLORS.gold, // Gold for the active tab
        tabBarInactiveTintColor: COLORS.inkFaint, // Dim for inactive tabs
        tabBarStyle: {
          backgroundColor: COLORS.surface, // Dark surface background
          borderTopColor: COLORS.border, // Subtle top border
        },
      }}
    >
      {/* Home tab — the Main Screen with daily goal + reflection buttons */}
      <Tabs.Screen
        name="index"
        options={{
          title: "Home",
          tabBarIcon: ({ color }) => (
            <IconSymbol size={28} name="house.fill" color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
