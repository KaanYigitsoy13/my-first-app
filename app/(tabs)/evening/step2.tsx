// app/evening/step2.tsx
// -----------------------------------------------------------
// EVENING STEP 2 — Goal Accomplished (Yes / No)
//
// Two options: "Yes" or "No." Tapping either one saves the
// answer and immediately advances to step3 (auto-advance).
//
// DATA FLOW:
//   User taps "Yes" → setField("goal_accomplished", true)
//   → haptic feedback → router.push("/evening/step3")
// -----------------------------------------------------------

import AnimatedStep from "@/components/AnimatedStep";
import ScreenWrapper from "@/components/ScreenWrapper";
import { COLORS, FONT_SIZES, SPACING } from "@/constants/theme";
import useReflectionStore from "@/store/useReflectionStore";
import * as Haptics from "expo-haptics";
import { useRouter } from "expo-router";
import { Pressable, StyleSheet, Text, View } from "react-native";

export default function EveningStep2() {
  const router = useRouter();
  const setField = useReflectionStore((state) => state.setField);

  const handleSelect = (value: boolean) => {
    setField("goal_accomplished", value);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    router.push("/evening/step3");
  };

  return (
    <ScreenWrapper>
      <AnimatedStep>
        <Text style={styles.stepIndicator}>2 / 7</Text>

        <Text style={styles.question}>Did you accomplish your daily goal?</Text>

        <Text style={styles.subtitle}>
          The greatest value in life is not what you get, the greatest value in
          life is what you become.
        </Text>

        <View style={styles.buttonRow}>
          <Pressable
            style={styles.choiceButton}
            onPress={() => handleSelect(true)}
          >
            <Text style={styles.choiceLabel}>Yes</Text>
          </Pressable>

          <Pressable
            style={styles.choiceButton}
            onPress={() => handleSelect(false)}
          >
            <Text style={styles.choiceLabel}>No</Text>
          </Pressable>
        </View>
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
    fontStyle: "italic",
    textAlign: "center",
    marginTop: SPACING.sm,
    marginBottom: SPACING.xl,
    lineHeight: 20,
  },
  buttonRow: {
    flexDirection: "row",
    gap: SPACING.md,
  },
  choiceButton: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: SPACING.md,
    borderWidth: 1.5,
    borderColor: COLORS.inkFaint,
    borderRadius: 10,
    backgroundColor: "transparent",
  },
  choiceLabel: {
    fontSize: FONT_SIZES.lg,
    fontWeight: "600",
    color: COLORS.inkFaint,
  },
});
