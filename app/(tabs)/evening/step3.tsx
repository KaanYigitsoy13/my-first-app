// app/evening/step3.tsx
// -----------------------------------------------------------
// EVENING STEP 3 — Evening Mood
//
// Same 1–5 score pattern as the morning mood step, but with
// a warmer, more relaxed tone.
//
// NOTE: Morning and evening SHARE the `mood` field in the store.
// This is fine because resetEvening() clears it before the
// evening flow starts, and resetMorning() clears it before morning.
//
// DATA FLOW:
//   User taps "4" → setField("mood", 4) → store updates
//   → ChoiceButton "4" highlights gold → NextButton enables
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

export default function EveningStep3() {
  const router = useRouter();

  const mood = useReflectionStore((state) => state.mood);
  const setField = useReflectionStore((state) => state.setField);

  const scores = [1, 2, 3, 4, 5];

  return (
    <ScreenWrapper>
      <AnimatedStep>
        <Text style={styles.stepIndicator}>3 / 7</Text>

        <Text style={styles.question}>
          Good job on the day!{"\n"}Now let's chill — how is your mood this
          evening?
        </Text>

        <Text style={styles.subtitle}>1 = low mood · 5 = good mood</Text>

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

        <NextButton
          onPress={() => router.push("/evening/step4")}
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
