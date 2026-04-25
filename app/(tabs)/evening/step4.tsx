// app/evening/step4.tsx
// -----------------------------------------------------------
// EVENING STEP 4 — Physical Feeling
//
// Same 1–5 score pattern as morning step2. Shares the `physical`
// field in the store (reset between flows via resetEvening).
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
        <Text style={styles.stepIndicator}>4 / 7</Text>

        <Text style={styles.question}>How do you physically feel?</Text>

        <Text style={styles.subtitle}>1 = tired · 5 = energized</Text>

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
