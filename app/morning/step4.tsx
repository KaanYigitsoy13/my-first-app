// app/morning/step4.tsx
// -----------------------------------------------------------
// MORNING STEP 4 — Daily Goal (Free Text)
//
// Unlike steps 1–3 (score buttons), this step has a TextInput
// where the user types their daily goal in their own words.
//
// ⚠️ IMPORTANT — LOCAL STATE PATTERN:
// We do NOT bind the TextInput directly to the Zustand store.
// Instead, we use local React state (useState) for the input,
// and only write to the store when the user taps "Next."
//
// WHY? daily_goal is the one field persisted to AsyncStorage.
// If we wrote to the store on every keystroke AND the user
// abandoned the flow, the half-typed text would overwrite
// yesterday's goal on the main screen. By using local state,
// the old goal stays safe in the store until committed.
//
// DATA FLOW:
//   User types "Run 5k" → local `text` state updates (store untouched)
//   → user taps Next → setField("daily_goal", "Run 5k") → store + disk
//   → navigate to step5
// -----------------------------------------------------------

import AnimatedStep from "@/components/AnimatedStep";
import NextButton from "@/components/NextButton";
import ScreenWrapper from "@/components/ScreenWrapper";
import { COLORS, FONT_SIZES, SPACING } from "@/constants/theme";
import useReflectionStore from "@/store/useReflectionStore";
import { useRouter } from "expo-router";
import { useState } from "react";
import { StyleSheet, Text, TextInput, View } from "react-native";

export default function MorningStep4() {
  const router = useRouter();
  const setField = useReflectionStore((state) => state.setField);

  // -----------------------------------------------------------
  // LOCAL STATE for the text input.
  //
  // Starts as "" (blank) — the user always types a fresh goal.
  // This is NOT connected to the Zustand store yet. The store
  // only gets updated when the user taps "Next" (see handler).
  //
  // Why not start with yesterday's goal pre-filled?
  // The spec says "be specific, one thing that matters" — we want
  // the user to actively think about TODAY, not rubber-stamp
  // yesterday's goal by tapping Next without thinking.
  // -----------------------------------------------------------
  const [text, setText] = useState("");

  // -----------------------------------------------------------
  // NEXT HANDLER
  //
  // 1. Trim whitespace (so "  Run 5k  " becomes "Run 5k")
  // 2. Write the trimmed goal to the Zustand store
  //    → persist middleware auto-saves it to AsyncStorage
  //    → main screen's goal box will show this value
  // 3. Navigate to step5
  // -----------------------------------------------------------
  const handleNext = () => {
    setField("daily_goal", text.trim());
    router.push("/morning/step5");
  };

  // Disable Next if the input is empty or whitespace-only.
  // .trim() removes spaces, so "   " becomes "" → disabled.
  const isDisabled = text.trim() === "";

  return (
    <ScreenWrapper>
      <AnimatedStep>
        {/* ---- Step Indicator ---- */}
        <Text style={styles.stepIndicator}>4 / 6</Text>

        {/* ---- Question ---- */}
        <Text style={styles.question}>
          What do you want to accomplish today?
        </Text>

        {/* ---- Subtitle ---- */}
        <Text style={styles.subtitle}>
          Be specific. One thing that matters.
        </Text>

        {/* ---- Text Input ---- */}
        {/* TextInput is React Native's text field component.
            Key props explained:
            - multiline: allows multiple lines (like a <textarea> in web)
            - numberOfLines={4}: hint to Android for initial height (iOS ignores this)
            - value + onChangeText: the "controlled input" pattern — React
              state is the source of truth, TextInput just displays it
            - placeholderTextColor: the gray hint text color
            - keyboardAppearance="dark": on iOS, makes the keyboard dark
              to match our app theme (Android ignores this)
            - textAlignVertical="top": on Android, multiline text starts
              at the top-left instead of vertically centered */}
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            value={text}
            onChangeText={setText}
            placeholder="Write your singular focus for today..."
            placeholderTextColor={COLORS.inkFaint}
            multiline
            numberOfLines={4}
            keyboardAppearance="dark"
            textAlignVertical="top"
            autoFocus // Open keyboard immediately — the user knows why they're here
          />
        </View>

        {/* ---- Next Button ---- */}
        {/* Disabled until user types something meaningful (not just spaces) */}
        <NextButton onPress={handleNext} disabled={isDisabled} />
      </AnimatedStep>
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  stepIndicator: {
    alignSelf: "flex-end",
    fontSize: FONT_SIZES.xs,
    color: COLORS.inkFaint,
    // TODO: Switch to FONT_FAMILIES.DM_SANS_REGULAR in Phase 8
  },
  question: {
    fontSize: FONT_SIZES.lg + 2, // 22px
    color: COLORS.inkLight,
    textAlign: "center",
    lineHeight: 30,
    marginTop: SPACING.xxl * 2,
    // TODO: Switch to FONT_FAMILIES.PLAYFAIR_REGULAR in Phase 8
  },
  subtitle: {
    fontSize: FONT_SIZES.sm - 1, // 13px
    color: COLORS.inkMuted,
    textAlign: "center",
    marginTop: SPACING.sm,
    marginBottom: SPACING.xl,
    // TODO: Switch to FONT_FAMILIES.DM_SANS_REGULAR in Phase 8
  },

  // ---- Text Input ----
  inputContainer: {
    width: "100%",
  },
  input: {
    width: "100%",
    minHeight: 100, // ~4 lines of text — gives the input breathing room
    backgroundColor: COLORS.surface,
    borderWidth: 0.5,
    borderColor: COLORS.gold,
    borderRadius: 8,
    padding: 14,
    fontSize: FONT_SIZES.md, // 15px
    color: COLORS.inkLight,
    lineHeight: 22, // Comfortable reading line height
    // TODO: Switch to FONT_FAMILIES.DM_SANS_REGULAR in Phase 8
  },
});
