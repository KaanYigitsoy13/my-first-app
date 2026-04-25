// app/evening/step5.tsx
// -----------------------------------------------------------
// EVENING STEP 5 — Stress Level
//
// Same pattern as morning step3 (stress). Shares the
// `stress_level` field (reset between flows via resetEvening).
// Note: 5 = very stressed (negative direction).
//
// DATA FLOW:
//   User taps "2" → setField("stress_level", 2) → store updates
//   → ChoiceButton "2" highlights gold → NextButton enables
//   → user taps Next → push to step6
// -----------------------------------------------------------

import AnimatedStep from "@/components/AnimatedStep";
import ChoiceButton from "@/components/ChoiceButton";
import NextButton from "@/components/NextButton";
import ScreenWrapper from "@/components/ScreenWrapper";
import { COLORS, FONT_SIZES, SPACING } from "@/constants/theme";
import useReflectionStore from "@/store/useReflectionStore";
import { useRouter } from "expo-router";
import { StyleSheet, Text, View } from "react-native";

export default function EveningStep5() {
  const router = useRouter();

  const stressLevel = useReflectionStore((state) => state.stress_level);
  const setField = useReflectionStore((state) => state.setField);

  const scores = [1, 2, 3, 4, 5];

  return (
    <ScreenWrapper>
      <AnimatedStep>
        <Text style={styles.stepIndicator}>5 / 7</Text>

        <Text style={styles.question}>
          How stressful do you feel when the day is about to end?
        </Text>

        <Text style={styles.subtitle}>1 = calm · 5 = very stressed</Text>

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

        <NextButton
          onPress={() => router.push("/evening/step6")}
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
