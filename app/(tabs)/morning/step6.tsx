// app/morning/step6.tsx
// -----------------------------------------------------------
// MORNING STEP 6 — Summary + Stoic Pledge (Final Step)
//
// This is the most complex morning screen. It has three sections:
//
// 1. SUMMARY CARD — shows all the answers from steps 1–5 so the
//    user can review what they entered before committing.
//
// 2. PLEDGE CHECKBOX — the user reads the Stoic pledge quote
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
// -----------------------------------------------------------

import AnimatedStep from "@/components/AnimatedStep";
import HoldButton from "@/components/HoldButton";
import ScreenWrapper from "@/components/ScreenWrapper";
import { COLORS, FONT_SIZES, SPACING } from "@/constants/theme";
import { fetchDailyQuote } from "@/lib/fetchDailyQuote";
import { supabase } from "@/lib/supabase";
import useReflectionStore from "@/store/useReflectionStore";
import * as Haptics from "expo-haptics";
import { useRouter } from "expo-router";
import { useState } from "react";
import { Alert, Pressable, StyleSheet, Text, View } from "react-native";

// The Stoic morning pledge — from Meditations, Book 2, Chapter 1.
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

function getReflectionDayKey(date = new Date()) {
  const shiftedDate = new Date(date);
  shiftedDate.setHours(shiftedDate.getHours() - 3, 0, 0, 0);

  const year = shiftedDate.getFullYear();
  const month = String(shiftedDate.getMonth() + 1).padStart(2, "0");
  const day = String(shiftedDate.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

export default function MorningStep6() {
  const router = useRouter();

  const mood = useReflectionStore((state) => state.mood);
  const physical = useReflectionStore((state) => state.physical);
  const stressLevel = useReflectionStore((state) => state.stress_level);
  const dailyGoal = useReflectionStore((state) => state.daily_goal);
  const chosenQuality = useReflectionStore((state) => state.chosen_quality);
  const resetMorning = useReflectionStore((state) => state.resetMorning);
  const setDailyQuote = useReflectionStore((state) => state.setDailyQuote);
  const setDailyQuoteLoading = useReflectionStore(
    (state) => state.setDailyQuoteLoading,
  );
  const setMorningCompletedDayKey = useReflectionStore(
    (state) => state.setMorningCompletedDayKey,
  );

  const [pledgeAccepted, setPledgeAccepted] = useState(false);

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

      setMorningCompletedDayKey(getReflectionDayKey());

      setDailyQuote("");
      setDailyQuoteLoading(true);

      // Fire-and-forget: fetch a Stoic quote in the background.
      fetchDailyQuote(
        state.daily_goal,
        state.chosen_quality,
        state.mood,
        state.physical,
        state.stress_level,
      )
        .then((quote) => {
          if (quote) {
            setDailyQuote(quote);
          }
        })
        .catch((quoteError) => {
          console.error("Could not fetch daily quote:", quoteError);
        })
        .finally(() => {
          setDailyQuoteLoading(false);
        });

      resetMorning();

      router.replace("/");
    } catch (e) {
      Alert.alert("Error", "Could not save your reflection. Please try again.");
      console.error(e);
    }
  };

  const togglePledge = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    setPledgeAccepted((prev) => !prev);
  };

  return (
    <ScreenWrapper>
      <AnimatedStep>
        <Text style={styles.stepIndicator}>6 / 6</Text>

        <Text style={styles.title}>Your Morning</Text>

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

        <View style={styles.divider} />

        <Pressable style={styles.pledgeRow} onPress={togglePledge}>
          <View
            style={[styles.checkbox, pledgeAccepted && styles.checkboxChecked]}
          >
            {pledgeAccepted && <Text style={styles.checkmark}>✓</Text>}
          </View>

          <Text style={styles.pledgeText}>{MARCUS_QUOTE}</Text>
        </Pressable>

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
  rowValueItalic: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.inkLight,
    fontStyle: "italic",
    textAlign: "right",
    flexShrink: 1,
    marginLeft: SPACING.md,
  },
  divider: {
    height: 1,
    backgroundColor: COLORS.border,
    marginVertical: SPACING.lg,
  },
  pledgeRow: {
    flexDirection: "row",
    alignItems: "flex-start",
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
    marginTop: 2,
  },
  checkboxChecked: {
    backgroundColor: COLORS.gold,
  },
  checkmark: {
    fontSize: 14,
    color: "#fff",
    lineHeight: 16,
    fontWeight: "700",
  },
  pledgeText: {
    flex: 1,
    marginLeft: SPACING.sm + 4,
    fontSize: FONT_SIZES.sm - 1,
    color: COLORS.inkMuted,
    fontStyle: "italic",
    lineHeight: 22,
  },
});
