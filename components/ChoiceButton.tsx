// components/ChoiceButton.tsx
// -----------------------------------------------------------
// A reusable selection button used in BOTH score questions
// (values "1" through "5") and quality questions (values like
// "Courage", "Temperance").
//
// WHY ONE COMPONENT FOR BOTH?
// Score buttons and quality buttons look identical — the only
// difference is what text they display. Instead of building two
// nearly-identical components, we use one with a `label` prop.
//
// IMPORTANT DATA NOTE:
// The `label` prop is always a STRING (since it's displayed as
// text). For score questions, the label will be "1", "2", etc.
// When saving to Supabase, you'll need to convert it to a
// number: parseInt(label, 10). This conversion happens in the
// flow screen when writing to the store, NOT in this component.
// This component only cares about display and selection.
//
// USAGE EXAMPLES:
//   <ChoiceButton label="3" selected={mood === 3} onPress={() => setField("mood", 3)} />
//   <ChoiceButton label="Courage" selected={quality === "Courage"} onPress={() => setField("chosen_quality", "Courage")} pill />
// -----------------------------------------------------------

import { COLORS, FONT_SIZES, SPACING } from "@/constants/theme";
import React from "react";
import { Pressable, StyleSheet, Text } from "react-native";

// -----------------------------------------------------------
// PROPS INTERFACE
//
// This defines what data you can pass to <ChoiceButton />.
// TypeScript will error if you forget a required prop or pass
// the wrong type (e.g., label={5} instead of label="5").
// -----------------------------------------------------------
interface ChoiceButtonProps {
  label: string; // The text shown inside the button ("3", "Courage", etc.)
  selected: boolean; // Whether this button is the currently chosen option
  onPress: () => void; // Function to call when the button is tapped
  pill?: boolean; // Optional: if true, renders as a wider pill shape (for text labels)
}

export default function ChoiceButton({
  label,
  selected,
  onPress,
  pill = false, // Default to square shape (for number scores)
}: ChoiceButtonProps) {
  return (
    // Pressable is React Native's modern touchable component.
    // Unlike TouchableOpacity, it gives you access to press states
    // via the `style` prop as a function: ({ pressed }) => style.
    <Pressable
      onPress={onPress}
      style={[
        styles.base,
        // Apply pill or square shape depending on the prop
        pill ? styles.pill : styles.square,
        // Apply gold highlight styles when this button is selected
        selected ? styles.selected : styles.unselected,
      ]}
    >
      <Text
        style={[
          styles.label,
          // Gold text when selected, faint text when not
          { color: selected ? COLORS.gold : COLORS.inkFaint },
        ]}
      >
        {label}
      </Text>
    </Pressable>
  );
}

// -----------------------------------------------------------
// STYLES
//
// We use StyleSheet.create() here instead of NativeWind because
// the conditional styling (selected vs unselected) involves
// multiple properties changing together, which is cleaner with
// style objects than chaining many ternary classNames.
// -----------------------------------------------------------
const styles = StyleSheet.create({
  // Shared base styles for all states
  base: {
    alignItems: "center", // Center text horizontally
    justifyContent: "center", // Center text vertically
    borderWidth: 1.5, // Border thickness
    borderRadius: 10, // Rounded corners
  },

  // Square shape for score buttons (1-5)
  square: {
    width: 52,
    height: 52,
  },

  // Pill shape for quality buttons ("Courage", "Temperance")
  pill: {
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    minWidth: 90,
  },

  // Gold highlight when this option is chosen
  selected: {
    borderColor: COLORS.gold,
    backgroundColor: COLORS.surfaceAlt, // Slightly lighter background
  },

  // Dim appearance when this option is NOT chosen
  unselected: {
    borderColor: COLORS.inkFaint,
    backgroundColor: "transparent",
  },

  // The text inside the button
  label: {
    fontSize: FONT_SIZES.lg,
    fontWeight: "600", // Semi-bold
    // Note: We'll switch to FONT_FAMILIES.PLAYFAIR_BOLD for
    // scores and FONT_FAMILIES.DM_SANS_MEDIUM for qualities
    // once we install the custom fonts in Phase 8.
  },
});
