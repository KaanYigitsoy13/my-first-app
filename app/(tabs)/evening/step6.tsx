// app/evening/step6.tsx
// -----------------------------------------------------------
// EVENING STEP 6 — One Percent Better (Yes / No)
//
// Same auto-advance pattern as evening step2 (goal accomplished).
// Two large buttons, no NextButton — tapping either one saves
// the answer and immediately navigates to step7 (summary).
//
// DATA FLOW:
//   User taps "Yes" → setField("one_percent_better", true)
//   → haptic feedback → router.push("/evening/step7")
// -----------------------------------------------------------

import AnimatedStep from "@/components/AnimatedStep";
import ScreenWrapper from "@/components/ScreenWrapper";
import { COLORS, FONT_SIZES, SPACING } from "@/constants/theme";
import useReflectionStore from "@/store/useReflectionStore";
import * as Haptics from "expo-haptics";
import { useRouter } from "expo-router";
import { Pressable, StyleSheet, Text, View } from "react-native";

export default function EveningStep6() {
  const router = useRouter();
  const setField = useReflectionStore((state) => state.setField);

  const handleSelect = (value: boolean) => {
    setField("one_percent_better", value);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    router.push("/evening/step7");
  };

  return (
    <ScreenWrapper>
      <AnimatedStep>
        <Text style={styles.stepIndicator}>6 / 7</Text>

        <Text style={styles.question}>Are you 1% better today?</Text>

        <Text style={styles.subtitle}>
          "If you can get 1 percent better each day, you will end up
          thirty-seven times better in a year."{"\n"}— Adapted from James Clear
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
