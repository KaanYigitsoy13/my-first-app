// app/evening/step2.tsx
// -----------------------------------------------------------
// EVENING STEP 2 — Goal Accomplished (Yes / No)
//
// Unlike the 1–5 score screens, this step has only two options:
// "Yes" or "No." Because there are only two choices, we skip
// the NextButton entirely — tapping Yes or No immediately saves
// the answer and advances to step3.
//
// WHY AUTO-ADVANCE?
// With 5 options (mood scores), the user might change their mind
// and tap a different number, so we wait for explicit "Next."
// With 2 options, the choice is decisive — adding a "Next" button
// just creates an extra useless tap.
//
// DATA FLOW:
//   User taps "Yes" → setField("goal_accomplished", true)
//   → haptic feedback → router.push("/evening/step3")
//   (all in one gesture — no intermediate state to show)
//
// CUSTOM BUTTONS:
// We don't use ChoiceButton here because we need flex: 1 wide
// buttons (each takes half the row). ChoiceButton has fixed
// widths. Instead we build custom Pressables with the same
// gold-selected / inkFaint-unselected visual style.
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

  // -----------------------------------------------------------
  // HANDLE SELECTION
  //
  // This function does three things in one tap:
  // 1. Save the boolean to the store
  // 2. Fire a light haptic for tactile confirmation
  // 3. Navigate to the next step
  //
  // No "selected" highlight is needed because the user never
  // sees the button in its selected state — they're already
  // on the next screen by the time the state updates.
  // -----------------------------------------------------------
  const handleSelect = (value: boolean) => {
    setField("goal_accomplished", value);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    router.push("/evening/step3");
  };

  return (
    <ScreenWrapper>
      <AnimatedStep>
        {/* ---- Step Indicator ---- */}
        <Text style={styles.stepIndicator}>2 / 7</Text>

        {/* ---- Question ---- */}
        <Text style={styles.question}>Did you accomplish your daily goal?</Text>

        {/* ---- Inspirational Subtitle ---- */}
        {/* A Jim Rohn quote that reframes "No" as still valuable —
            the user shouldn't feel bad if they didn't hit their goal. */}
        <Text style={styles.subtitle}>
          The greatest value in life is not what you get, the greatest value in
          life is what you become.
        </Text>

        {/* ---- Yes / No Buttons ---- */}
        {/* Two wide buttons side by side. Each takes half the row
            width via flex: 1. Tapping either one auto-advances. */}
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

  // ---- Yes / No Buttons ----
  buttonRow: {
    flexDirection: "row",
    gap: SPACING.md, // 16px gap between buttons
  },
  choiceButton: {
    flex: 1, // Each button takes half the available width
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
