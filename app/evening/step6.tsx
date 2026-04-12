// app/evening/step6.tsx
// -----------------------------------------------------------
// EVENING STEP 6 — One Percent Better (Yes / No)
//
// Same auto-advance pattern as evening step2 (goal accomplished).
// Two large buttons, no NextButton — tapping either one saves
// the answer and immediately navigates to step7 (summary).
//
// THE 1% PHILOSOPHY:
// This question comes from James Clear's "Atomic Habits" idea:
// small daily improvements compound exponentially over time.
// It reframes the day positively — even a bad day can have
// a tiny win worth acknowledging.
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

  // Auto-advance: save + haptic + navigate in one gesture
  const handleSelect = (value: boolean) => {
    setField("one_percent_better", value);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    router.push("/evening/step7");
  };

  return (
    <ScreenWrapper>
      <AnimatedStep>
        {/* ---- Step Indicator ---- */}
        <Text style={styles.stepIndicator}>6 / 7</Text>

        {/* ---- Question ---- */}
        <Text style={styles.question}>Are you 1% better today?</Text>

        {/* ---- Inspirational Subtitle ---- */}
        {/* The James Clear quote reframes even a "No" as valuable —
            awareness of not improving is itself a step forward. */}
        <Text style={styles.subtitle}>
          "If you can get 1 percent better each day, you will end up
          thirty-seven times better in a year."{"\n"}— Adapted from James Clear
        </Text>

        {/* ---- Yes / No Buttons ---- */}
        {/* Same wide-button pattern as evening/step2. Tapping either
            auto-advances to step7. */}
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
    fontStyle: "italic",
    textAlign: "center",
    marginTop: SPACING.sm,
    marginBottom: SPACING.xl,
    lineHeight: 20,
    // TODO: Switch to FONT_FAMILIES.DM_SANS_REGULAR in Phase 8
  },
  buttonRow: {
    flexDirection: "row",
    gap: SPACING.md, // 16px
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
    // TODO: Switch to FONT_FAMILIES.DM_SANS_MEDIUM in Phase 8
  },
});
