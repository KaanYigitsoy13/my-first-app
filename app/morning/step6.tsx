// app/morning/step6.tsx
// -----------------------------------------------------------
// MORNING STEP 6 — Summary + Stoic Pledge (Final Step)
//
// This is the most complex morning screen. It has three sections:
//
// 1. SUMMARY CARD — shows all the answers from steps 1–5 so the
//    user can review what they entered before committing.
//
// 2. PLEDGE CHECKBOX — the user reads the Marcus Aurelius quote
//    and taps the checkbox to acknowledge it. This is a mindful
//    gate — the HoldButton stays disabled until they've read and
//    accepted the pledge.
//
// 3. HOLD BUTTON ("Let's Start") — the user holds for 3 seconds
//    to submit. On completion, data is sent to Supabase, the
//    morning store fields are reset, and the app navigates back
//    to the home screen.
//
// DATA FLOW:
//   User reads summary → taps pledge checkbox → holds "Let's Start"
//   → submitMorning() runs → Supabase insert → resetMorning()
//   → router.replace("/") (replace, not push — no going back)
//
// WHY router.replace("/")?
//   After completing a reflection, the morning flow should be
//   "done." If we used router.push("/"), the user could swipe
//   back to the summary — confusing and potentially causing
//   a double-submit. replace() clears the morning stack entirely.
// -----------------------------------------------------------

import AnimatedStep from "@/components/AnimatedStep";
import HoldButton from "@/components/HoldButton";
import ScreenWrapper from "@/components/ScreenWrapper";
import { COLORS, FONT_SIZES, SPACING } from "@/constants/theme";
import { supabase } from "@/lib/supabase";
import useReflectionStore from "@/store/useReflectionStore";
import * as Haptics from "expo-haptics";
import { useRouter } from "expo-router";
import { useState } from "react";
import { Alert, Pressable, StyleSheet, Text, View } from "react-native";

// -----------------------------------------------------------
// THE MARCUS AURELIUS QUOTE
//
// From Meditations, Book 2, Chapter 1. This passage is about
// preparing for difficult people and choosing not to be harmed
// by their behavior. It's the Stoic "morning armor."
//
// Defined outside the component so it's not re-created on every
// render (it's a constant string, no need to be inside the function).
// -----------------------------------------------------------
const MARCUS_QUOTE =
  "The people I deal with today will be meddling, ungrateful, arrogant, " +
  "dishonest, jealous, and surly. They are like this because they can't " +
  "tell good from evil. But I have seen the beauty of good, and the ugliness " +
  "of evil, and have recognized that the wrongdoer has a nature related to " +
  "my own\u2014not of the same blood or birth, but the same mind, and possessing " +
  "a share of the divine. And so none of them can hurt me. No one can " +
  "implicate me in ugliness. Nor can I feel angry at my relative, or hate " +
  "him. We were born to work together like feet, hands, and eyes, like the " +
  "two rows of teeth, upper and lower. To obstruct each other is unnatural. " +
  "To feel anger at someone, to turn your back on him: these are obstructions.";

export default function MorningStep6() {
  const router = useRouter();

  // Read all morning answers from the store for the summary card
  const mood = useReflectionStore((state) => state.mood);
  const physical = useReflectionStore((state) => state.physical);
  const stressLevel = useReflectionStore((state) => state.stress_level);
  const dailyGoal = useReflectionStore((state) => state.daily_goal);
  const chosenQuality = useReflectionStore((state) => state.chosen_quality);
  const resetMorning = useReflectionStore((state) => state.resetMorning);

  // -----------------------------------------------------------
  // LOCAL STATE — Pledge Checkbox
  //
  // This is NOT in the Zustand store because:
  // - It's not saved to Supabase (it's a UI-only interaction)
  // - It's not needed after this screen closes
  // - It shouldn't persist across app restarts
  //
  // Rule of thumb: if a piece of state only matters on ONE
  // screen and doesn't need to survive navigation, use local
  // useState. The Zustand store is for shared / persisted state.
  // -----------------------------------------------------------
  const [pledgeAccepted, setPledgeAccepted] = useState(false);

  // -----------------------------------------------------------
  // SUBMIT TO SUPABASE
  //
  // This function runs ONLY when the HoldButton completes (3s hold).
  // It reads the current store state and inserts a row into the
  // `reflections` table.
  //
  // WHY getState() INSTEAD OF THE VARIABLES ABOVE?
  // The variables above (mood, physical, etc.) are captured at
  // render time. getState() reads the LATEST store values at the
  // moment of submission. In practice they're the same here, but
  // getState() is the safer pattern for async operations — it
  // guarantees you're reading the freshest data.
  //
  // ERROR HANDLING:
  // If the insert fails (no internet, Supabase down, etc.), we
  // show an Alert and do NOT reset the store. This lets the user
  // try again without losing their answers.
  // -----------------------------------------------------------
  const submitMorning = async () => {
    try {
      const state = useReflectionStore.getState();

      const { error } = await supabase.from("reflections").insert({
        type: "morning",
        mood: state.mood,
        physical: state.physical,
        stress_level: state.stress_level,
        daily_goal: state.daily_goal,
        chosen_quality: state.chosen_quality,
      });

      if (error) throw error;

      // Only reset AFTER a successful insert. If we reset before
      // and the insert fails, the user's answers are gone forever.
      resetMorning();

      // replace() instead of push() — removes the morning stack
      // from navigation history so the user can't swipe back.
      router.replace("/");
    } catch (e) {
      Alert.alert("Error", "Could not save your reflection. Please try again.");
      console.error(e);
    }
  };

  // -----------------------------------------------------------
  // TOGGLE PLEDGE CHECKBOX
  //
  // Fires a Medium haptic (slightly stronger than Light) because
  // accepting a pledge feels more intentional than a normal tap.
  // -----------------------------------------------------------
  const togglePledge = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    setPledgeAccepted((prev) => !prev);
  };

  return (
    <ScreenWrapper>
      <AnimatedStep>
        {/* ---- Step Indicator ---- */}
        <Text style={styles.stepIndicator}>6 / 6</Text>

        {/* ---- Title ---- */}
        <Text style={styles.title}>Your Morning</Text>

        {/* ============================================= */}
        {/* SUMMARY CARD                                  */}
        {/* Shows all answers in a label: value layout.   */}
        {/* Each row is a horizontal flex container with   */}
        {/* the label on the left and value on the right.  */}
        {/* ============================================= */}
        <View style={styles.card}>
          <View style={styles.row}>
            <Text style={styles.rowLabel}>Mood</Text>
            <Text style={styles.rowValue}>{mood} / 5</Text>
          </View>

          <View style={styles.row}>
            <Text style={styles.rowLabel}>Physical Readiness</Text>
            <Text style={styles.rowValue}>{physical} / 5</Text>
          </View>

          <View style={styles.row}>
            <Text style={styles.rowLabel}>Stress Level</Text>
            <Text style={styles.rowValue}>{stressLevel} / 5</Text>
          </View>

          <View style={styles.row}>
            <Text style={styles.rowLabel}>Daily Goal</Text>
            <Text style={styles.rowValueItalic}>{dailyGoal}</Text>
          </View>

          <View style={styles.row}>
            <Text style={styles.rowLabel}>Quality</Text>
            <Text style={styles.rowValue}>{chosenQuality}</Text>
          </View>
        </View>

        {/* ---- Divider ---- */}
        <View style={styles.divider} />

        {/* ============================================= */}
        {/* PLEDGE CHECKBOX + QUOTE                       */}
        {/*                                               */}
        {/* This is a custom checkbox — React Native       */}
        {/* doesn't have a built-in Checkbox component.    */}
        {/* We build one with a Pressable (the tap target) */}
        {/* + a View (the box) + conditional Text (the ✓). */}
        {/* ============================================= */}
        <Pressable style={styles.pledgeRow} onPress={togglePledge}>
          {/* The checkbox: a 20x20 square with gold border.
              When checked, the background fills with gold and
              a white checkmark appears inside. */}
          <View
            style={[styles.checkbox, pledgeAccepted && styles.checkboxChecked]}
          >
            {pledgeAccepted && <Text style={styles.checkmark}>✓</Text>}
          </View>

          {/* The quote text sits next to the checkbox.
              flex: 1 makes it take up all remaining horizontal
              space (so long text wraps properly instead of
              overflowing off-screen). */}
          <Text style={styles.pledgeText}>{MARCUS_QUOTE}</Text>
        </Pressable>

        {/* ---- Hold Button ---- */}
        {/* Disabled until the pledge is accepted.
            The user must read the quote and tap the checkbox
            before they can hold to submit. This creates a
            mindful pause — the whole point of the app. */}
        <HoldButton
          label="Let's Start"
          durationMs={3000}
          disabled={!pledgeAccepted}
          onComplete={submitMorning}
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

  // ---- Title ----
  title: {
    fontSize: FONT_SIZES.lg + 2, // 22px
    color: COLORS.gold,
    textAlign: "center",
    marginTop: SPACING.xl,
    marginBottom: SPACING.lg,
    // TODO: Switch to FONT_FAMILIES.PLAYFAIR_REGULAR in Phase 8
  },

  // ---- Summary Card ----
  card: {
    width: "100%",
    backgroundColor: COLORS.surface,
    borderWidth: 0.5,
    borderColor: COLORS.gold,
    borderRadius: 8,
    padding: SPACING.md, // 16px
  },
  row: {
    flexDirection: "row", // Label on left, value on right
    justifyContent: "space-between",
    alignItems: "flex-start", // Align to top (for multi-line goal text)
    paddingVertical: SPACING.xs + 2, // 6px vertical padding per row
  },
  rowLabel: {
    fontSize: FONT_SIZES.sm - 1, // 13px
    color: COLORS.inkMuted,
    // TODO: Switch to FONT_FAMILIES.DM_SANS_REGULAR in Phase 8
  },
  rowValue: {
    fontSize: FONT_SIZES.sm, // 14px
    color: COLORS.inkLight,
    textAlign: "right",
    flexShrink: 1, // Allow text to shrink/wrap if the label is long
    marginLeft: SPACING.md, // Gap between label and value
    // TODO: Switch to FONT_FAMILIES.DM_SANS_REGULAR in Phase 8
  },
  rowValueItalic: {
    fontSize: FONT_SIZES.sm, // 14px
    color: COLORS.inkLight,
    fontStyle: "italic",
    textAlign: "right",
    flexShrink: 1,
    marginLeft: SPACING.md,
    // TODO: Switch to FONT_FAMILIES.PLAYFAIR_ITALIC in Phase 8
  },

  // ---- Divider ----
  divider: {
    height: 1,
    backgroundColor: COLORS.border,
    marginVertical: SPACING.lg, // 20px above and below
  },

  // ---- Pledge Section ----
  pledgeRow: {
    flexDirection: "row", // Checkbox on left, quote on right
    alignItems: "flex-start", // Align checkbox to top of quote
    marginBottom: SPACING.lg,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderWidth: 1,
    borderColor: COLORS.gold,
    borderRadius: 3,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 2, // Nudge down slightly to align with first line of text
  },
  checkboxChecked: {
    backgroundColor: COLORS.gold, // Fill with gold when checked
  },
  checkmark: {
    fontSize: 14,
    color: "#fff", // White checkmark on gold background
    lineHeight: 16,
    fontWeight: "700",
  },
  pledgeText: {
    flex: 1, // Take all remaining space so text wraps properly
    marginLeft: SPACING.sm + 4, // 12px gap between checkbox and text
    fontSize: FONT_SIZES.sm - 1, // 13px
    color: COLORS.inkMuted,
    fontStyle: "italic",
    lineHeight: 22, // 1.7× line height for comfortable reading
    // TODO: Switch to FONT_FAMILIES.DM_SANS_REGULAR in Phase 8
  },
});
