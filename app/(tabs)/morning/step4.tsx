// app/morning/step4.tsx
// -----------------------------------------------------------
// MORNING STEP 4 — Daily Goal (Free Text)
//
// Unlike steps 1–3 (score buttons), this step has a TextInput
// where the user types their daily goal in their own words.
//
// LOCAL STATE PATTERN: We do NOT bind the TextInput directly to
// the Zustand store. Instead, local React state (useState) is
// used for the input, and we only write to the store when the
// user taps "Next." This prevents a half-typed goal from
// overwriting yesterday's goal on the main screen if the user
// abandons the flow.
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

  const [text, setText] = useState("");

  const handleNext = () => {
    setField("daily_goal", text.trim());
    router.push("/morning/step5");
  };

  const isDisabled = text.trim() === "";

  return (
    <ScreenWrapper>
      <AnimatedStep>
        <Text style={styles.stepIndicator}>4 / 6</Text>

        <Text style={styles.question}>
          What do you want to accomplish today?
        </Text>

        <Text style={styles.subtitle}>
          Be specific. One thing that matters.
        </Text>

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
            autoFocus
          />
        </View>

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
  },
  question: {
    fontSize: FONT_SIZES.lg + 2,
    color: COLORS.inkLight,
    textAlign: "center",
    lineHeight: 30,
    marginTop: SPACING.xxl * 2,
  },
  subtitle: {
    fontSize: FONT_SIZES.sm - 1,
    color: COLORS.inkMuted,
    textAlign: "center",
    marginTop: SPACING.sm,
    marginBottom: SPACING.xl,
  },
  inputContainer: {
    width: "100%",
  },
  input: {
    width: "100%",
    minHeight: 100,
    backgroundColor: COLORS.surface,
    borderWidth: 0.5,
    borderColor: COLORS.gold,
    borderRadius: 8,
    padding: 14,
    fontSize: FONT_SIZES.md,
    color: COLORS.inkLight,
    lineHeight: 22,
  },
});
