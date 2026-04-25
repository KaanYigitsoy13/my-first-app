// app/morning/step2.tsx
// -----------------------------------------------------------
// MORNING STEP 2 — Physical Readiness
//
// Asks the user how physically ready they feel for the day.
// Same 1–5 score pattern as step1 (mood).
//
// DATA FLOW:
//   User taps "4" → setField("physical", 4) → store updates
//   → ChoiceButton "4" highlights gold → NextButton enables
//   → user taps Next → push to step3
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

  const physical = useReflectionStore((state) => state.physical);
  const setField = useReflectionStore((state) => state.setField);

  const scores = [1, 2, 3, 4, 5];

  return (
    <ScreenWrapper>
      <AnimatedStep>
        <Text style={styles.stepIndicator}>2 / 6</Text>

        <Text style={styles.question}>
          How physically ready do you feel for the day ahead?
        </Text>

        <Text style={styles.subtitle}>1 = not ready · 5 = very ready</Text>

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
