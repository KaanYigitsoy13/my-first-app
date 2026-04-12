// app/morning/_layout.tsx
// -----------------------------------------------------------
// MORNING FLOW LAYOUT — a Stack navigator for the 6-step
// Morning Reflection flow.
//
// This layout wraps all files in app/morning/ into a stack.
// Each step pushes onto the stack, so the hardware back button
// goes to the previous step. All headers are hidden because
// our custom UI has its own navigation (the Next button).
//
// The background is set to our dark theme color to prevent
// white flashes between step transitions.
// -----------------------------------------------------------

import { COLORS } from "@/constants/theme";
import { Stack } from "expo-router";

export default function MorningLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: COLORS.background },
        // Disable the swipe-back gesture during the flow.
        // We want the user to go forward through the steps,
        // not accidentally swipe back and lose their answers.
        gestureEnabled: false,
      }}
    />
  );
}
