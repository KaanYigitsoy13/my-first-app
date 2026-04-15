// app/(tabs)/index.tsx
// -----------------------------------------------------------
// MAIN SCREEN — the home screen the user sees when opening the app.
//
// LAYOUT (top to bottom):
// 1. Monogram "M·A" + current date
// 2. "Today's Focus" label + daily goal box
// 3. Morning Reflection button
// 4. Evening Reflection button
//
// HYDRATION:
// The daily_goal is stored in AsyncStorage via Zustand persist.
// When the app cold-starts, AsyncStorage loads asynchronously,
// meaning for a brief moment the store returns "" even if a goal
// exists on disk. We handle this with a "hydrated" flag — while
// loading, we show a skeleton placeholder instead of flashing
// empty content. Once hydration finishes, the real goal appears.
//
// NAVIGATION:
// Tapping a button resets the relevant store fields (so the flow
// starts fresh), then pushes the first step of that flow.
// -----------------------------------------------------------

import { COLORS, FONT_SIZES, SPACING } from "@/constants/theme";
import useReflectionStore from "@/store/useReflectionStore";
import * as Haptics from "expo-haptics";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";

export default function HomeScreen() {
  const router = useRouter();

  // Read state from the Zustand store
  const dailyGoal = useReflectionStore((state) => state.daily_goal);
  const dailyQuote = useReflectionStore((state) => state.daily_quote);
  const resetMorning = useReflectionStore((state) => state.resetMorning);
  const resetEvening = useReflectionStore((state) => state.resetEvening);

  // -----------------------------------------------------------
  // HYDRATION STATE
  //
  // Zustand's persist middleware loads data from AsyncStorage
  // asynchronously. `hydrated` starts as false and flips to true
  // once the stored data has been loaded into the store.
  //
  // Why does this matter?
  // - App opens → Zustand store initializes with daily_goal: ""
  // - 50-200ms later → AsyncStorage finishes loading → daily_goal
  //   updates to the real value (e.g., "Exercise 30 min")
  //
  // Without this check, the user would see "Complete your morning
  // reflection..." flash for a split second, then jump to the
  // real goal. The skeleton placeholder hides this jank.
  // -----------------------------------------------------------
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    // Listen for when hydration finishes (data is loaded from disk)
    const unsub = useReflectionStore.persist.onFinishHydration(() =>
      setHydrated(true),
    );

    // If hydration already finished before this effect ran, handle that too.
    // This can happen on fast devices or hot reloads during development.
    if (useReflectionStore.persist.hasHydrated()) setHydrated(true);

    // Cleanup: unsubscribe when the component unmounts to prevent memory leaks
    return () => unsub();
  }, []);

  // -----------------------------------------------------------
  // FORMAT TODAY'S DATE
  //
  // We want "Saturday, April 12" — a friendly, human-readable format.
  // `toLocaleDateString` converts a Date object into a formatted string
  // based on the specified locale and options.
  // -----------------------------------------------------------
  const today = new Date().toLocaleDateString("en-US", {
    weekday: "long", // "Saturday"
    month: "long", // "April"
    day: "numeric", // "12"
  });

  // -----------------------------------------------------------
  // BUTTON HANDLERS
  //
  // Each handler does three things in order:
  // 1. Fire a haptic vibration (tactile "I pressed something" feedback)
  // 2. Reset the store fields for that flow (start fresh)
  // 3. Navigate to the first step of the flow
  // -----------------------------------------------------------
  const handleMorningPress = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    resetMorning(); // Clear mood, physical, stress, quality — NOT daily_goal
    router.push("/morning/step1");
  };

  const handleEveningPress = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    resetEvening(); // Clear mood, physical, stress, performance, etc.
    router.push("/evening/step1");
  };

  // -----------------------------------------------------------
  // GOAL BOX CONTENT
  //
  // Three possible states:
  // 1. Not hydrated yet → skeleton placeholder (gray bar)
  // 2. Hydrated, no goal → prompt text ("Complete your morning...")
  // 3. Hydrated, goal exists → show the goal in gold
  // -----------------------------------------------------------
  const renderGoalContent = () => {
    if (!hydrated) {
      // Skeleton placeholder: a gray bar that mimics where text would be.
      // This is a common mobile pattern — it tells the user "content is
      // loading" without using a spinner (which feels heavy for this).
      return <View style={styles.skeleton} />;
    }

    if (dailyGoal === "") {
      return (
        <Text style={styles.goalPlaceholder}>
          Complete your morning reflection to set today's goal.
        </Text>
      );
    }

    return <Text style={styles.goalText}>{dailyGoal}</Text>;
  };

  return (
    <ScrollView style={styles.scroll} contentContainerStyle={styles.container}>
      {/* ---- Monogram + Date ---- */}
      <Text style={styles.monogram}>Welcome, Kaan!</Text>
      <Text style={styles.date}>{today}</Text>

      {/* Spacer */}
      <View style={{ height: SPACING.xl }} />

      {/* ---- Today's Focus Section ---- */}
      <Text style={styles.focusLabel}>Today's Focus</Text>
      <View style={styles.goalBox}>{renderGoalContent()}</View>

      {/* ---- Quotation of the Day Section ---- */}
      {dailyQuote !== "" && (
        <>
          <View style={{ height: SPACING.xl }} />
          <Text style={styles.quotationLabel}>Quotation of the Day</Text>
          <View style={styles.quotationBox}>
            <Text style={styles.quotationText}>{dailyQuote}</Text>
          </View>
        </>
      )}

      {/* Spacer */}
      <View style={{ height: SPACING.xl }} />

      {/* ---- Navigation Buttons ---- */}
      <View style={styles.buttonGroup}>
        <Pressable style={styles.button} onPress={handleMorningPress}>
          <Text style={styles.buttonText}>Morning Reflection</Text>
        </Pressable>

        <View style={{ height: SPACING.sm }} />

        <Pressable style={styles.button} onPress={handleEveningPress}>
          <Text style={styles.buttonText}>Evening Reflection</Text>
        </Pressable>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scroll: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  container: {
    alignItems: "center",
    paddingTop: SPACING.xxl,
    paddingBottom: SPACING.xxl,
    paddingHorizontal: SPACING.lg,
  },

  // ---- Header ----
  monogram: {
    fontSize: FONT_SIZES.xl,
    color: COLORS.gold,
    letterSpacing: 3, // Wide spacing for the monogram look
    fontWeight: "600",
    // TODO: Switch to FONT_FAMILIES.PLAYFAIR_REGULAR in Phase 8
  },
  date: {
    fontSize: FONT_SIZES.md, // 14px
    color: COLORS.inkMuted,
    marginTop: SPACING.xs,
    // TODO: Switch to FONT_FAMILIES.DM_SANS_REGULAR in Phase 8
  },

  // ---- Today's Focus ----
  focusLabel: {
    fontSize: FONT_SIZES.md,
    color: COLORS.inkMuted,
    textTransform: "uppercase",
    letterSpacing: 1.5,
    marginBottom: SPACING.sm,
    // TODO: Switch to FONT_FAMILIES.DM_SANS_REGULAR in Phase 8
  },
  goalBox: {
    width: "100%",
    backgroundColor: COLORS.surface,
    borderWidth: 0.5,
    borderColor: COLORS.gold,
    borderRadius: 8,
    padding: 14,
    alignItems: "center",
    minHeight: 50, // Prevents the box from collapsing when showing skeleton
  },
  goalText: {
    fontSize: FONT_SIZES.md,
    color: COLORS.inkLight,
    fontStyle: "italic",
    textAlign: "center",
    lineHeight: 22,
    // TODO: Switch to FONT_FAMILIES.PLAYFAIR_ITALIC in Phase 8
  },
  goalPlaceholder: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.inkMuted, // was inkFaint — too dark to read on surface bg
    fontStyle: "italic",
    textAlign: "center",
    // TODO: Switch to FONT_FAMILIES.DM_SANS_REGULAR in Phase 8
  },
  skeleton: {
    width: "60%",
    height: 14,
    backgroundColor: COLORS.surfaceAlt,
    borderRadius: 4,
  },

  // ---- Buttons ----
  buttonGroup: {
    width: "100%",
    gap: SPACING.md,
  },
  button: {
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: COLORS.surface,
    borderWidth: 0.5,
    borderColor: COLORS.gold,
    borderRadius: 8,
    paddingVertical: SPACING.md,
    paddingHorizontal: SPACING.lg,
  },
  buttonText: {
    fontSize: FONT_SIZES.lg,
    fontWeight: "500",
    color: COLORS.gold,
    // TODO: Switch to FONT_FAMILIES.DM_SANS_MEDIUM in Phase 8
  },

  // ---- Quotation of the Day ----
  quotationLabel: {
    fontSize: FONT_SIZES.md,
    color: COLORS.inkMuted,
    textTransform: "uppercase",
    letterSpacing: 1.5,
    marginBottom: SPACING.sm,
  },
  quotationBox: {
    width: "100%",
    backgroundColor: COLORS.surface,
    borderWidth: 0.5,
    borderColor: COLORS.gold,
    borderRadius: 8,
    padding: 14,
  },
  quotationText: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.inkLight,
    fontStyle: "italic",
    textAlign: "center",
    lineHeight: 24,
  },
});
