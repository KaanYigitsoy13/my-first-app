// app/evening/step4.tsx
// -----------------------------------------------------------
// EVENING STEP 4 — Physical Feeling
//
// Same 1–5 score pattern as morning step2. Shares the `physical`
// field in the store (reset between flows via resetEvening).
//
// The subtitle uses "tired / energized" instead of morning's
// "not ready / very ready" — different framing for the end of
// the day when readiness doesn't apply.
//
// DATA FLOW:
//   User taps "3" → setField("physical", 3) → store updates
//   → ChoiceButton "3" highlights gold → NextButton enables
//   → user taps Next → push to step5
// -----------------------------------------------------------

import AnimatedStep from "@/components/AnimatedStep";
import ChoiceButton from "@/components/ChoiceButton";
import NextButton from "@/components/NextButton";
import ScreenWrapper from "@/components/ScreenWrapper";
import { COLORS, FONT_SIZES, SPACING } from "@/constants/theme";
import useReflectionStore from "@/store/useReflectionStore";
import { useRouter } from "expo-router";
import { StyleSheet, Text, View } from "react-native";

export default function EveningStep4() {
  const router = useRouter();

  const physical = useReflectionStore((state) => state.physical);
  const setField = useReflectionStore((state) => state.setField);

  const scores = [1, 2, 3, 4, 5];

  return (
    <ScreenWrapper>
      <AnimatedStep>
        {/* ---- Step Indicator ---- */}
        <Text style={styles.stepIndicator}>4 / 7</Text>

        {/* ---- Question ---- */}
        <Text style={styles.question}>How do you physically feel?</Text>

        {/* ---- Subtitle / Scale Hint ---- */}
        <Text style={styles.subtitle}>1 = tired · 5 = energized</Text>

        {/* ---- Score Buttons ---- */}
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
        <NextButton
          onPress={() => router.push("/evening/step5")}
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
