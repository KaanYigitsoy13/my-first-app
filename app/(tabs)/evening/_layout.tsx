// app/evening/_layout.tsx
// -----------------------------------------------------------
// EVENING FLOW LAYOUT — a Stack navigator for the 7-step
// Evening Reflection flow.
//
// Same setup as the morning layout: hidden headers, dark
// background, back gesture disabled to keep the flow linear.
// -----------------------------------------------------------

import { COLORS } from "@/constants/theme";
import { Stack } from "expo-router";

export default function EveningLayout() {
  return (
    <Stack
      initialRouteName="step1"
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: COLORS.background },
        gestureEnabled: false,
      }}
    />
  );
}
