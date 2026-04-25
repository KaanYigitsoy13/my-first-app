// app/evening/step7.tsx
// -----------------------------------------------------------
// EVENING STEP 7 — Summary + Submit (Final Step)
//
// Shows all evening answers in a summary card, then a
// HoldButton ("Close the Day") to submit to Supabase.
//
// KEY DIFFERENCES FROM MORNING SUMMARY:
// - No pledge/checkbox — the evening is about winding down.
// - HoldButton is always enabled (no gate).
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

function getReflectionDayKey(date = new Date()) {
  const shiftedDate = new Date(date);
  shiftedDate.setHours(shiftedDate.getHours() - 3, 0, 0, 0);

  const year = shiftedDate.getFullYear();
  const month = String(shiftedDate.getMonth() + 1).padStart(2, "0");
  const day = String(shiftedDate.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

export default function EveningStep7() {
  const router = useRouter();

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
  const setEveningCompletedDayKey = useReflectionStore(
    (state) => state.setEveningCompletedDayKey,
  );

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

      setEveningCompletedDayKey(getReflectionDayKey());

      resetEvening();

      router.replace("/");
    } catch (e) {
      Alert.alert("Error", "Could not save your reflection. Please try again.");
      console.error(e);
    }
  };

  return (
    <ScreenWrapper>
      <AnimatedStep>
        <Text style={styles.stepIndicator}>7 / 7</Text>

        <Text style={styles.title}>Your Evening</Text>

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
  },
  title: {
    fontSize: FONT_SIZES.lg + 2,
    color: COLORS.gold,
    textAlign: "center",
    marginTop: SPACING.xl,
    marginBottom: SPACING.lg,
  },
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
    paddingVertical: SPACING.xs + 2,
  },
  rowLabel: {
    fontSize: FONT_SIZES.sm - 1,
    color: COLORS.inkMuted,
  },
  rowValue: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.inkLight,
    textAlign: "right",
    flexShrink: 1,
    marginLeft: SPACING.md,
  },
});
