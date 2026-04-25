// app/evening/step1.tsx
// -----------------------------------------------------------
// EVENING STEP 1 — Performance Rating
//
// First screen of the evening reflection. Asks the user to
// rate how they performed today on a 1–5 scale.
//
// DATA FLOW:
//   User taps "4" → setField("performance", 4) → store updates
//   → ChoiceButton "4" highlights gold → NextButton enables
//   → user taps Next → push to step2
// -----------------------------------------------------------

import AnimatedStep from "@/components/AnimatedStep";
import ChoiceButton from "@/components/ChoiceButton";
import NextButton from "@/components/NextButton";
import ScreenWrapper from "@/components/ScreenWrapper";
import { COLORS, FONT_SIZES, SPACING } from "@/constants/theme";
import useReflectionStore from "@/store/useReflectionStore";
import { useRouter } from "expo-router";
import { StyleSheet, Text, View } from "react-native";

export default function EveningStep1() {
  const router = useRouter();

  const performance = useReflectionStore((state) => state.performance);
  const setField = useReflectionStore((state) => state.setField);

  const scores = [1, 2, 3, 4, 5];

  return (
    <ScreenWrapper>
      <AnimatedStep>
        <Text style={styles.stepIndicator}>1 / 7</Text>

        <Text style={styles.question}>How was your performance today?</Text>

        <Text style={styles.subtitle}>1 = low · 5 = excellent</Text>

        <View style={styles.buttonRow}>
          {scores.map((value) => (
            <ChoiceButton
              key={value}
              label={String(value)}
              selected={performance === value}
              onPress={() => setField("performance", value)}
            />
          ))}
        </View>

        <NextButton
          onPress={() => router.push("/evening/step2")}
          disabled={performance === null}
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
