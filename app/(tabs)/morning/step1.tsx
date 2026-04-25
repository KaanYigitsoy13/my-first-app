// app/morning/step1.tsx
// -----------------------------------------------------------
// MORNING STEP 1 — Mood Rating
//
// The very first screen the user sees when they start a morning
// reflection. It asks them to rate their current mood on a 1–5
// scale using ChoiceButton components.
//
// DATA FLOW:
//   User taps "3" → setField("mood", 3) → Zustand store updates
//   → ChoiceButton with label "3" becomes `selected` → gold highlight
//   → NextButton enables → user taps Next → push to step2
//
// LAYOUT (top to bottom):
//   1. Step indicator "1 / 6" (top-right)
//   2. Question text (centered, large)
//   3. Subtitle / scale hint (centered, small)
//   4. 5 ChoiceButtons in a horizontal row
//   5. NextButton at the bottom
// -----------------------------------------------------------

import AnimatedStep from "@/components/AnimatedStep";
import ChoiceButton from "@/components/ChoiceButton";
import NextButton from "@/components/NextButton";
import ScreenWrapper from "@/components/ScreenWrapper";
import { COLORS, FONT_SIZES, SPACING } from "@/constants/theme";
import useReflectionStore from "@/store/useReflectionStore";
import { useRouter } from "expo-router";
import { StyleSheet, Text, View } from "react-native";

export default function MorningStep1() {
  const router = useRouter();

  // Read mood from Zustand store — null means nothing selected yet
  const mood = useReflectionStore((state) => state.mood);
  const setField = useReflectionStore((state) => state.setField);

  const scores = [1, 2, 3, 4, 5];

  return (
    <ScreenWrapper>
      <AnimatedStep>
        {/* ---- Step Indicator ---- */}
        <Text style={styles.stepIndicator}>1 / 6</Text>

        {/* ---- Question ---- */}
        <Text style={styles.question}>
          Good Morning!{"\n"}How is your mood this morning?
        </Text>

        {/* ---- Subtitle / Scale Hint ---- */}
        <Text style={styles.subtitle}>1 = low mood · 5 = good mood</Text>

        {/* ---- Score Buttons ---- */}
        <View style={styles.buttonRow}>
          {scores.map((value) => (
            <ChoiceButton
              key={value}
              label={String(value)}
              selected={mood === value}
              onPress={() => setField("mood", value)}
            />
          ))}
        </View>

        {/* ---- Next Button ---- */}
        <NextButton
          onPress={() => router.push("/morning/step2")}
          disabled={mood === null}
        />
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
  buttonRow: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 10,
  },
});
