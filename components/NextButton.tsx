// components/NextButton.tsx
// -----------------------------------------------------------
// A simple "Next" button used at the bottom of each step in
// the Morning and Evening reflection flows.
//
// On press: triggers a short haptic vibration then calls onPress.
// -----------------------------------------------------------

import { COLORS, FONT_SIZES, SPACING } from "@/constants/theme";
import * as Haptics from "expo-haptics";
import React from "react";
import { Pressable, StyleSheet, Text } from "react-native";

interface NextButtonProps {
  onPress: () => void;
  label?: string;
  disabled?: boolean;
}

export default function NextButton({
  onPress,
  label = "Next",
  disabled = false,
}: NextButtonProps) {
  const handlePress = () => {
    if (disabled) return;
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    onPress();
  };

  return (
    <Pressable
      onPress={handlePress}
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
    paddingVertical: SPACING.sm + 4,
    paddingHorizontal: SPACING.lg,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 10,
    backgroundColor: COLORS.surface,
    marginTop: SPACING.lg,
  },
  disabled: {
    borderColor: "transparent",
    backgroundColor: "transparent",
  },
  label: {
    fontSize: FONT_SIZES.lg,
    fontWeight: "600",
    color: COLORS.gold,
  },
  disabledLabel: {
    color: COLORS.inkFaint,
  },
});
