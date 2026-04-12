// app/morning/step2.tsx
// -----------------------------------------------------------
// MORNING STEP 2 — Physical Readiness
//
// Asks the user how physically ready they feel for the day.
// Same 1–5 score pattern as step1 (mood). The only differences
// are: the question text, the Zustand field (physical instead
// of mood), the step indicator (2/6), and the next route (step3).
//
// DATA FLOW:
//   User taps "4" → setField("physical", 4) → store updates
//   → ChoiceButton "4" highlights gold → NextButton enables
//   → user taps Next → push to step3
//
// LAYOUT: identical to step1 (indicator → question → subtitle
//         → 5 ChoiceButtons → NextButton)
// -----------------------------------------------------------

import AnimatedStep from "@/components/AnimatedStep";
import ChoiceButton from "@/components/ChoiceButton";
import NextButton from "@/components/NextButton";
import ScreenWrapper from "@/components/ScreenWrapper";
import { COLORS, FONT_SIZES, SPACING } from "@/constants/theme";
import useReflectionStore from "@/store/useReflectionStore";
import { useRouter } from "expo-router";
import { StyleSheet, Text, View } from "react-native";

export default function MorningStep2() {
  const router = useRouter();

  // Read physical readiness from Zustand — null means nothing selected
  const physical = useReflectionStore((state) => state.physical);
  const setField = useReflectionStore((state) => state.setField);

  const scores = [1, 2, 3, 4, 5];

  return (
    <ScreenWrapper>
      <AnimatedStep>
        {/* ---- Step Indicator ---- */}
        <Text style={styles.stepIndicator}>2 / 6</Text>

        {/* ---- Question ---- */}
        <Text style={styles.question}>
          How physically ready do you feel for the day ahead?
        </Text>

        {/* ---- Subtitle / Scale Hint ---- */}
        <Text style={styles.subtitle}>1 = not ready · 5 = very ready</Text>

        {/* ---- Score Buttons ---- */}
        {/* Same controlled-component pattern as step1:
            the store holds the truth, buttons just reflect it. */}
        <View style={styles.buttonRow}>
          {scores.map((value) => (
            <ChoiceButton
              key={value}
              label={String(value)}
              selected={physical === value}
              onPress={() => setField("physical", value)}
            />
          ))}
        </View>

        {/* ---- Next Button ---- */}
        {/* Disabled until user picks a score. NextButton handles haptics. */}
        <NextButton
          onPress={() => router.push("/morning/step3")}
          disabled={physical === null}
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
