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

import BackgroundImage from "@/components/BackgroundImage";
import { COLORS, FONT_SIZES, SPACING } from "@/constants/theme";
import useReflectionStore from "@/store/useReflectionStore";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { router } from "expo-router";
import { useEffect, useState } from "react";
import {
  LayoutAnimation,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  UIManager,
  View,
} from "react-native";

// Pre-require all three background images so Metro bundles them.
// Selecting the right source at runtime is done in HomeScreen below.
const BG_DEFAULT = require("@/assets/images/background.png");
const BG_REFLECTED = require("@/assets/images/background reflected.png");
const BG_END_OF_DAY = require("@/assets/images/background end of day.png");

// LayoutAnimation requires an explicit opt-in on Android.
if (
  Platform.OS === "android" &&
  UIManager.setLayoutAnimationEnabledExperimental
) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

// Loading messages shown while Gemini is generating the quote.
// Displayed one at a time, advancing every 2 s. The last message
// is never replaced — it stays until the real quote arrives.
const LOADING_MESSAGES = [
  "Reaching out to the Stoics",
  "Reflecting on your goal",
  "Gathering their wisdom",
  "Almost there",
];

function getReflectionDayKey(date = new Date()) {
  const shiftedDate = new Date(date);
  shiftedDate.setHours(shiftedDate.getHours() - 3, 0, 0, 0);

  const year = shiftedDate.getFullYear();
  const month = String(shiftedDate.getMonth() + 1).padStart(2, "0");
  const day = String(shiftedDate.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

function StatusIndicator({
  label,
  icon,
  completed,
  onPress,
}: {
  label: string;
  icon: React.ComponentProps<typeof MaterialIcons>["name"];
  completed: boolean;
  onPress: () => void;
}) {
  return (
    <Pressable style={styles.statusItem} onPress={onPress}>
      <View style={styles.statusCircle}>
        <MaterialIcons
          name={completed ? "check" : icon}
          size={24}
          color={COLORS.gold}
        />
      </View>
      <Text style={styles.statusLabel}>{label}</Text>
    </Pressable>
  );
}

export default function HomeScreen() {
  // Read state from the Zustand store
  const dailyGoal = useReflectionStore((state) => state.daily_goal);
  const dailyQuote = useReflectionStore((state) => state.daily_quote);
  const isDailyQuoteLoading = useReflectionStore(
    (state) => state.is_daily_quote_loading,
  );
  const morningCompletedDayKey = useReflectionStore(
    (state) => state.morning_completed_day_key,
  );
  const eveningCompletedDayKey = useReflectionStore(
    (state) => state.evening_completed_day_key,
  );

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
  // Guidance for Today is expanded by default; tapping collapses it to 3 lines.
  const [quoteExpanded, setQuoteExpanded] = useState(true);

  // -- Loading message rotation --
  // Advances to the next message every 2 s; stops at the last one.
  const [loadingMsgIndex, setLoadingMsgIndex] = useState(0);
  useEffect(() => {
    if (!isDailyQuoteLoading) {
      setLoadingMsgIndex(0);
      return;
    }
    const id = setInterval(() => {
      setLoadingMsgIndex((prev) =>
        prev < LOADING_MESSAGES.length - 1 ? prev + 1 : prev,
      );
    }, 4000);
    return () => clearInterval(id);
  }, [isDailyQuoteLoading]);

  // -- Animated dots: "" → "." → ".." → "..." → "" … --
  // Continues cycling at 500 ms regardless of which message is showing.
  const [dotCount, setDotCount] = useState(0);
  useEffect(() => {
    if (!isDailyQuoteLoading) {
      setDotCount(0);
      return;
    }
    const id = setInterval(() => {
      setDotCount((prev) => (prev + 1) % 4);
    }, 500);
    return () => clearInterval(id);
  }, [isDailyQuoteLoading]);

  const toggleQuote = () => {
    LayoutAnimation.configureNext({
      duration: 250,
      create: {
        type: LayoutAnimation.Types.easeInEaseOut,
        property: LayoutAnimation.Properties.opacity,
      },
      update: { type: LayoutAnimation.Types.easeInEaseOut },
      delete: {
        type: LayoutAnimation.Types.easeInEaseOut,
        property: LayoutAnimation.Properties.opacity,
      },
    });
    setQuoteExpanded((prev) => !prev);
  };

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
    month: "long",  // "April"
    day: "numeric", // "12"
  });
  const currentReflectionDayKey = getReflectionDayKey();
  const isMorningCompletedToday =
    morningCompletedDayKey === currentReflectionDayKey;
  const isEveningCompletedToday =
    eveningCompletedDayKey === currentReflectionDayKey;

  // Pick background image based on completion state:
  //  - Both done        → end of day
  //  - Morning only done → reflected
  //  - Morning not done  → default (covers: neither done, evening-only done)
  const backgroundSource =
    isMorningCompletedToday && isEveningCompletedToday
      ? BG_END_OF_DAY
      : isMorningCompletedToday
        ? BG_REFLECTED
        : BG_DEFAULT;

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
          Complete your morning reflection to set today&apos;s focus.
        </Text>
      );
    }

    return <Text style={styles.goalText}>{dailyGoal}</Text>;
  };

  const shouldShowQuoteSection = isDailyQuoteLoading || dailyQuote !== "";

  // ---- Debug: simulate day rollover ----
  const resetDayState = useReflectionStore(
    (state) => state.setMorningCompletedDayKey,
  );
  const resetEveningDayState = useReflectionStore(
    (state) => state.setEveningCompletedDayKey,
  );
  const setDailyGoal = useReflectionStore((state) => state.setField);
  const setDailyQuoteFn = useReflectionStore((state) => state.setDailyQuote);

  const handleDebugReset = () => {
    // Shift back 2 days to guarantee we land on a different 3 a.m.-shifted key
    // regardless of what time of day the tester runs this.
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 2);
    const shifted = new Date(yesterday);
    shifted.setHours(shifted.getHours() - 3, 0, 0, 0);
    const y = shifted.getFullYear();
    const m = String(shifted.getMonth() + 1).padStart(2, "0");
    const d = String(shifted.getDate()).padStart(2, "0");
    const oldKey = `${y}-${m}-${d}`;

    resetDayState(oldKey);
    resetEveningDayState(oldKey);
    setDailyGoal("daily_goal", "");
    setDailyQuoteFn("");
  };

  const renderQuoteContent = () => {
    if (isDailyQuoteLoading) {
      const dots = ["", ".", "..", "..."][dotCount];
      return (
        <Text style={styles.quotationPlaceholder}>
          {LOADING_MESSAGES[loadingMsgIndex]}
          {dots}
        </Text>
      );
    }

    return (
      <Text
        style={styles.quotationText}
        numberOfLines={quoteExpanded ? undefined : 3}
      >
        {dailyQuote}
      </Text>
    );
  };

  return (
    <View style={styles.root}>
      <BackgroundImage source={backgroundSource} />
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.container}
      >
        {/* ---- Header Date ---- */}
        <Text style={styles.headerDate}>{today}</Text>

        <View style={styles.statusRow}>
          <StatusIndicator
            label="Morning"
            icon="wb-sunny"
            completed={isMorningCompletedToday}
            onPress={() => {
              useReflectionStore.getState().resetMorning();
              router.push("/morning/step1");
            }}
          />
          <StatusIndicator
            label="Evening"
            icon="brightness-2"
            completed={isEveningCompletedToday}
            onPress={() => {
              useReflectionStore.getState().resetEvening();
              router.push("/evening/step1");
            }}
          />
        </View>

        {/* Spacer */}
        <View style={{ height: SPACING.xl }} />

        {/* ---- Today's Focus Section ---- */}
        <Text style={styles.focusLabel}>Today&apos;s Focus</Text>
        <View style={styles.goalBox}>{renderGoalContent()}</View>

        {/* ---- Quotation of the Day Section ---- */}
        {shouldShowQuoteSection && (
          <>
            <View style={{ height: SPACING.xl }} />
            <Pressable style={styles.quotationLabelRow} onPress={toggleQuote}>
              <Text style={styles.quotationLabel}>Guidance for Today</Text>
              {!isDailyQuoteLoading && (
                <MaterialIcons
                  name={quoteExpanded ? "expand-less" : "expand-more"}
                  size={16}
                  color={COLORS.inkFaint}
                />
              )}
            </Pressable>
            <Pressable style={styles.quotationBox} onPress={toggleQuote}>
              {renderQuoteContent()}
            </Pressable>
          </>
        )}

        {/* ---- DEBUG: Reset Day State ---- */}
        <View style={{ height: SPACING.xxl }} />
        <Pressable style={styles.debugButton} onPress={handleDebugReset}>
          <Text style={styles.debugButtonText}>⚙ Reset Day State</Text>
        </Pressable>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: "#000",
  },
  scroll: {
    flex: 1,
    backgroundColor: "transparent",
  },
  container: {
    alignItems: "center",
    paddingTop: 80,
    paddingBottom: SPACING.xxl,
    paddingHorizontal: SPACING.lg,
  },

  // ---- Header ----
  headerDate: {
    fontSize: FONT_SIZES.xl,
    color: COLORS.gold,
    textAlign: "center",
    fontWeight: "600",
    // TODO: Switch to FONT_FAMILIES.PLAYFAIR_REGULAR in Phase 8
  },
  statusRow: {
    width: "100%",
    flexDirection: "row",
    justifyContent: "center",
    gap: SPACING.xl,
    marginTop: SPACING.md,
  },
  statusItem: {
    alignItems: "center",
  },
  statusCircle: {
    width: 52,
    height: 52,
    borderRadius: 26,
    borderWidth: 1,
    borderColor: COLORS.gold,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: COLORS.surface,
  },
  statusLabel: {
    marginTop: SPACING.sm,
    fontSize: FONT_SIZES.sm,
    color: COLORS.inkMuted,
    textAlign: "center",
  },

  // ---- Today's Focus ----
  focusLabel: {
    fontSize: FONT_SIZES.md,
    color: COLORS.inkMuted,
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

  // ---- Quotation of the Day ----
  quotationLabelRow: {
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: SPACING.sm,
  },
  quotationLabel: {
    flex: 1,
    fontSize: FONT_SIZES.md,
    color: COLORS.inkMuted,
    letterSpacing: 1.5,
    textAlign: "center",
  },
  quotationBox: {
    width: "100%",
    backgroundColor: COLORS.surface,
    borderWidth: 0.5,
    borderColor: COLORS.gold,
    borderRadius: 8,
    padding: 14,
    overflow: "hidden",
  },
  quotationText: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.inkLight,
    fontStyle: "italic",
    textAlign: "center",
    lineHeight: 24,
  },
  quotationPlaceholder: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.inkMuted,
    fontStyle: "italic",
    textAlign: "center",
    lineHeight: 24,
  },

  // ---- Debug only ----
  debugButton: {
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 6,
    paddingVertical: 8,
    paddingHorizontal: 20,
    opacity: 0.5,
  },
  debugButtonText: {
    fontSize: FONT_SIZES.xs,
    color: COLORS.inkMuted,
    letterSpacing: 0.5,
  },
});
