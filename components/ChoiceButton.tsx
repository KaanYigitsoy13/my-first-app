// components/ChoiceButton.tsx
// -----------------------------------------------------------
// A reusable selection button used in BOTH score questions
// (values "1" through "5") and quality questions (values like
// "Courage", "Temperance").
//
// USAGE EXAMPLES:
//   <ChoiceButton label="3" selected={mood === 3} onPress={() => setField("mood", 3)} />
//   <ChoiceButton label="Courage" selected={quality === "Courage"} onPress={() => setField("chosen_quality", "Courage")} pill />
// -----------------------------------------------------------

import { COLORS, FONT_SIZES, SPACING } from "@/constants/theme";
import React from "react";
import { Pressable, StyleSheet, Text } from "react-native";

interface ChoiceButtonProps {
  label: string;
  selected: boolean;
  onPress: () => void;
  pill?: boolean;
}

export default function ChoiceButton({
  label,
  selected,
  onPress,
  pill = false,
}: ChoiceButtonProps) {
  return (
    <Pressable
      onPress={onPress}
      style={[
        styles.base,
        pill ? styles.pill : styles.square,
        selected ? styles.selected : styles.unselected,
      ]}
    >
      <Text
        style={[
          styles.label,
          { color: selected ? COLORS.gold : COLORS.inkFaint },
        ]}
      >
        {label}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1.5,
    borderRadius: 10,
  },
  square: {
    width: 52,
    height: 52,
  },
  pill: {
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    minWidth: 90,
  },
  selected: {
    borderColor: COLORS.gold,
    backgroundColor: COLORS.surfaceAlt,
  },
  unselected: {
    borderColor: COLORS.inkFaint,
    backgroundColor: "transparent",
  },
  label: {
    fontSize: FONT_SIZES.lg,
    fontWeight: "600",
  },
});
