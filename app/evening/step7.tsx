// app/evening/step7.tsx
// -----------------------------------------------------------
// EVENING STEP 7 — Summary + Submit (Final Step)
//
// The evening counterpart to morning/step6. Shows all evening
// answers in a summary card, then a HoldButton ("Close the Day")
// to submit to Supabase.
//
// KEY DIFFERENCES FROM MORNING SUMMARY:
// - No pledge/checkbox — the evening is about winding down,
//   not gearing up. Adding a mandatory checkbox would feel
//   heavy at the end of a long day.
// - HoldButton is always enabled (no gate) — same wind-down
//   reasoning. The user has already answered everything.
// - Includes boolean fields (goal_accomplished, one_percent_better)
//   displayed as "Yes" / "No" text.
//
// DATA FLOW:
//   User reviews summary → holds "Close the Day" for 3s
//   → submitEvening() → Supabase insert → resetEvening()
//   → router.replace("/") (no going back)
// -----------------------------------------------------------

import AnimatedStep from "@/components/AnimatedStep";
import HoldButton from "@/components/HoldButton";
import ScreenWrapper from "@/components/ScreenWrapper";
import { COLORS, FONT_SIZES, SPACING } from "@/constants/theme";
import { supabase } from "@/lib/supabase";
import useReflectionStore from "@/store/useReflectionStore";
import { useRouter } from "expo-router";
import { Alert, StyleSheet, Text, View } from "react-native";

export default function EveningStep7() {
  const router = useRouter();

  // Read all evening answers from the store for the summary card
  const performance = useReflectionStore((state) => state.performance);
  const goalAccomplished = useReflectionStore(
    (state) => state.goal_accomplished,
  );
  const mood = useReflectionStore((state) => state.mood);
  const physical = useReflectionStore((state) => state.physical);
  const stressLevel = useReflectionStore((state) => state.stress_level);
  const onePercentBetter = useReflectionStore(
    (state) => state.one_percent_better,
  );
  const resetEvening = useReflectionStore((state) => state.resetEvening);

  // -----------------------------------------------------------
  // SUBMIT TO SUPABASE
  //
  // Same defensive pattern as morning: insert first, reset only
  // on success, Alert on failure so the user can retry.
  //
  // ALL 6 evening fields are included in the insert:
  //   performance, goal_accomplished, mood, physical,
  //   stress_level, one_percent_better
  //
  // The morning-only fields (daily_goal, chosen_quality) are
  // omitted — they'll be null in the Supabase row, which is
  // correct since this is an evening reflection.
  // -----------------------------------------------------------
  const submitEvening = async () => {
    try {
      const state = useReflectionStore.getState();

      const { error } = await supabase.from("reflections").insert({
        type: "evening",
        performance: state.performance,
        goal_accomplished: state.goal_accomplished,
        mood: state.mood,
        physical: state.physical,
        stress_level: state.stress_level,
        one_percent_better: state.one_percent_better,
      });

      if (error) throw error;

      // Only reset AFTER successful insert — if the insert fails,
      // the user's answers stay in the store for retry.
      resetEvening();

      // replace() removes the evening stack from navigation history
      router.replace("/");
    } catch (e) {
      Alert.alert("Error", "Could not save your reflection. Please try again.");
      console.error(e);
    }
  };

  return (
    <ScreenWrapper>
      <AnimatedStep>
        {/* ---- Step Indicator ---- */}
        <Text style={styles.stepIndicator}>7 / 7</Text>

        {/* ---- Title ---- */}
        <Text style={styles.title}>Your Evening</Text>

        {/* ============================================= */}
        {/* SUMMARY CARD                                  */}
        {/* Same label-value row pattern as morning step6. */}
        {/* Boolean fields are displayed as "Yes" / "No". */}
        {/* ============================================= */}
        <View style={styles.card}>
          <View style={styles.row}>
            <Text style={styles.rowLabel}>Performance</Text>
            <Text style={styles.rowValue}>{performance} / 5</Text>
          </View>

          <View style={styles.row}>
            <Text style={styles.rowLabel}>Goal Accomplished</Text>
            <Text style={styles.rowValue}>
              {goalAccomplished ? "Yes" : "No"}
            </Text>
          </View>

          <View style={styles.row}>
            <Text style={styles.rowLabel}>Evening Mood</Text>
            <Text style={styles.rowValue}>{mood} / 5</Text>
          </View>

          <View style={styles.row}>
            <Text style={styles.rowLabel}>Physical Feeling</Text>
            <Text style={styles.rowValue}>{physical} / 5</Text>
          </View>

          <View style={styles.row}>
            <Text style={styles.rowLabel}>Stress Level</Text>
            <Text style={styles.rowValue}>{stressLevel} / 5</Text>
          </View>

          <View style={styles.row}>
            <Text style={styles.rowLabel}>One Percent Better</Text>
            <Text style={styles.rowValue}>
              {onePercentBetter ? "Yes" : "No"}
            </Text>
          </View>
        </View>

        {/* ---- Hold Button ---- */}
        {/* Always enabled — no pledge gate on the evening summary.
            The evening is about winding down, not adding friction. */}
        <HoldButton
          label="Close the Day"
          durationMs={3000}
          disabled={false}
          onComplete={submitEvening}
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
    padding: SPACING.md,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    paddingVertical: SPACING.xs + 2, // 6px
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
    flexShrink: 1,
    marginLeft: SPACING.md,
    // TODO: Switch to FONT_FAMILIES.DM_SANS_REGULAR in Phase 8
  },
});
