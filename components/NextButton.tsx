// components/NextButton.tsx
// -----------------------------------------------------------
// A simple "Next" button used at the bottom of each step in
// the Morning and Evening reflection flows.
//
// On press: triggers a short haptic vibration (tactile feedback)
// then calls the onPress callback to advance to the next step.
//
// WHY HAPTICS?
// Haptic feedback makes the app feel physical and intentional.
// When the user taps "Next," the tiny vibration confirms their
// action without needing a visual animation. It's subtle but
// it makes the app feel premium. Think of it like the "click"
// feel of a well-made mechanical button.
// -----------------------------------------------------------

import { COLORS, FONT_SIZES, SPACING } from "@/constants/theme";
import * as Haptics from "expo-haptics";
import React from "react";
import { Pressable, StyleSheet, Text } from "react-native";

interface NextButtonProps {
  onPress: () => void; // Function to call after haptic fires
  label?: string; // Button text (defaults to "Next")
  disabled?: boolean; // When true: dims the button and ignores taps
}

export default function NextButton({
  onPress,
  label = "Next",
  disabled = false,
}: NextButtonProps) {
  // This function runs when the user taps the button.
  // It fires the haptic FIRST, then calls your onPress callback.
  // ImpactFeedbackStyle.Light = a gentle tap sensation.
  const handlePress = () => {
    // Don't do anything if the button is disabled
    if (disabled) return;

    // Fire a light haptic "tap" — the user feels a brief vibration
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);

    // Now run whatever the parent screen wants to do (usually: go to next step)
    onPress();
  };

  return (
    <Pressable
      onPress={handlePress}
      // Disable the Pressable entirely when disabled is true.
      // This prevents the press event AND removes accessibility
      // focus so screen readers skip it.
      disabled={disabled}
      style={[styles.button, disabled && styles.disabled]}
    >
      <Text style={[styles.label, disabled && styles.disabledLabel]}>
        {label}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: SPACING.sm + 4, // 12px — slightly more than sm for a comfortable tap target
    paddingHorizontal: SPACING.lg,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 10,
    backgroundColor: COLORS.surface,
    marginTop: SPACING.lg,
  },

  // When disabled, remove the border to make it look "inactive"
  disabled: {
    borderColor: "transparent",
    backgroundColor: "transparent",
  },

  label: {
    fontSize: FONT_SIZES.lg,
    fontWeight: "600",
    color: COLORS.gold, // Gold text to signal "this is the action to take"
  },

  // Dim text when disabled
  disabledLabel: {
    color: COLORS.inkFaint,
  },
});
