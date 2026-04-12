// app/morning/step3.tsx
// -----------------------------------------------------------
// MORNING STEP 3 — Stress Level
//
// Asks the user how stressed they feel about the day ahead.
// Same 1–5 score pattern as step1 and step2.
//
// NOTE ON SCALE DIRECTION:
// Unlike mood and physical (where 5 = positive), here 5 = very
// stressed (negative). This is intentional — the subtitle makes
// the direction clear, and the raw number is stored as-is.
// Any "flip" logic (if needed) happens when displaying analytics,
// not here.
//
// DATA FLOW:
//   User taps "2" → setField("stress_level", 2) → store updates
//   → ChoiceButton "2" highlights gold → NextButton enables
//   → user taps Next → push to step4
// -----------------------------------------------------------

import AnimatedStep from "@/components/AnimatedStep";
import ChoiceButton from "@/components/ChoiceButton";
import NextButton from "@/components/NextButton";
import ScreenWrapper from "@/components/ScreenWrapper";
import { COLORS, FONT_SIZES, SPACING } from "@/constants/theme";
import useReflectionStore from "@/store/useReflectionStore";
import { useRouter } from "expo-router";
import { StyleSheet, Text, View } from "react-native";

export default function MorningStep3() {
  const router = useRouter();

  // Read stress_level from Zustand — null means nothing selected
  const stressLevel = useReflectionStore((state) => state.stress_level);
  const setField = useReflectionStore((state) => state.setField);

  const scores = [1, 2, 3, 4, 5];

  return (
    <ScreenWrapper>
      <AnimatedStep>
        {/* ---- Step Indicator ---- */}
        <Text style={styles.stepIndicator}>3 / 6</Text>

        {/* ---- Question ---- */}
        <Text style={styles.question}>
          How stressful do you feel for the day ahead?
        </Text>

        {/* ---- Subtitle / Scale Hint ---- */}
        {/* Note: 5 = stressed here (opposite direction from mood/physical).
            The subtitle is critical — without it users might assume
            5 always means "good" because of the previous two steps. */}
        <Text style={styles.subtitle}>1 = calm · 5 = very stressed</Text>

        {/* ---- Score Buttons ---- */}
        <View style={styles.buttonRow}>
          {scores.map((value) => (
            <ChoiceButton
              key={value}
              label={String(value)}
              selected={stressLevel === value}
              onPress={() => setField("stress_level", value)}
            />
          ))}
        </View>

        {/* ---- Next Button ---- */}
        <NextButton
          onPress={() => router.push("/morning/step4")}
          disabled={stressLevel === null}
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
  buttonRow: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 10,
  },
});
