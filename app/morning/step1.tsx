// app/morning/step1.tsx
// -----------------------------------------------------------
// MORNING STEP 1 — Mood Rating
//
// The very first screen the user sees when they start a morning
// reflection. It asks them to rate their current mood on a 1–5
// scale using ChoiceButton components.
//
// DATA FLOW:
//   User taps "3" → setField("mood", 3) → Zustand store updates
//   → ChoiceButton with label "3" becomes `selected` → gold highlight
//   → NextButton enables → user taps Next → push to step2
//
// LAYOUT (top to bottom):
//   1. Step indicator "1 / 6" (top-right)
//   2. Question text (centered, large)
//   3. Subtitle / scale hint (centered, small)
//   4. 5 ChoiceButtons in a horizontal row
//   5. NextButton at the bottom
// -----------------------------------------------------------

import AnimatedStep from "@/components/AnimatedStep";
import ChoiceButton from "@/components/ChoiceButton";
import NextButton from "@/components/NextButton";
import ScreenWrapper from "@/components/ScreenWrapper";
import { COLORS, FONT_SIZES, SPACING } from "@/constants/theme";
import useReflectionStore from "@/store/useReflectionStore";
import { useRouter } from "expo-router";
import { StyleSheet, Text, View } from "react-native";

export default function MorningStep1() {
  const router = useRouter();

  // Read mood from Zustand store — null means nothing selected yet
  const mood = useReflectionStore((state) => state.mood);
  const setField = useReflectionStore((state) => state.setField);

  // -----------------------------------------------------------
  // SCORE OPTIONS
  //
  // We define the options as an array and .map() over them to
  // render 5 ChoiceButtons. This is cleaner than writing 5
  // separate <ChoiceButton /> tags — less code, easier to modify.
  //
  // Why numbers in the array but string labels on the button?
  // The store expects mood as number | null (for math/sorting),
  // but ChoiceButton displays a string label. So we store the
  // number and convert to string for display: String(value).
  // -----------------------------------------------------------
  const scores = [1, 2, 3, 4, 5];

  return (
    <ScreenWrapper>
      <AnimatedStep>
        {/* ---- Step Indicator ---- */}
        {/* Shows the user where they are in the 6-step morning flow.
            Positioned at the top-right so it's visible but not
            distracting — the question text is the star of the show. */}
        <Text style={styles.stepIndicator}>1 / 6</Text>

        {/* ---- Question ---- */}
        {/* Large, centered question text. The generous top margin
            (SPACING.xxl * 2 = 96px) pushes it toward the vertical
            center of the screen, which feels balanced and calm. */}
        <Text style={styles.question}>
          Good Morning!{"\n"}How is your mood this morning?
        </Text>

        {/* ---- Subtitle / Scale Hint ---- */}
        {/* Explains what the numbers mean. Without this, "1" and "5"
            are ambiguous — does 1 mean good or bad? The subtitle
            removes that confusion. */}
        <Text style={styles.subtitle}>1 = low mood · 5 = good mood</Text>

        {/* ---- Score Buttons ---- */}
        {/* A horizontal row of 5 buttons. When one is tapped:
            1. setField("mood", value) saves the number to the store
            2. mood === value makes that button `selected` (gold highlight)
            3. All other buttons become unselected (gray)
            This is the "controlled component" pattern — the store
            is the single source of truth, and the UI just reflects it. */}
        <View style={styles.buttonRow}>
          {scores.map((value) => (
            <ChoiceButton
              key={value}
              label={String(value)} // ChoiceButton expects a string label
              selected={mood === value} // Gold highlight when this is the chosen mood
              onPress={() => setField("mood", value)} // Save number to store
            />
          ))}
        </View>

        {/* ---- Next Button ---- */}
        {/* Disabled (dimmed + untappable) until the user picks a mood.
            mood is null by default → disabled={true}.
            User taps a score → mood becomes a number → disabled={false}.
            NextButton already handles haptics internally — we just
            navigate in the onPress callback. */}
        <NextButton
          onPress={() => router.push("/morning/step2")}
          disabled={mood === null}
        />
      </AnimatedStep>
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  // ---- Step Indicator ----
  stepIndicator: {
    alignSelf: "flex-end", // Pushes to the right side of the container
    fontSize: FONT_SIZES.xs, // 11px — small and unobtrusive
    color: COLORS.inkFaint,
    // TODO: Switch to FONT_FAMILIES.DM_SANS_REGULAR in Phase 8
  },

  // ---- Question Text ----
  question: {
    fontSize: FONT_SIZES.lg + 2, // 22px — large enough to feel important
    color: COLORS.inkLight,
    textAlign: "center",
    lineHeight: 30, // Extra line height for the two-line question
    marginTop: SPACING.xxl * 2, // 96px — generous top space for visual balance
    // TODO: Switch to FONT_FAMILIES.PLAYFAIR_REGULAR in Phase 8
  },

  // ---- Subtitle ----
  subtitle: {
    fontSize: FONT_SIZES.sm - 1, // 13px
    color: COLORS.inkMuted,
    textAlign: "center",
    marginTop: SPACING.sm, // 8px gap below question
    marginBottom: SPACING.xl, // 32px gap before buttons
    // TODO: Switch to FONT_FAMILIES.DM_SANS_REGULAR in Phase 8
  },

  // ---- Score Button Row ----
  buttonRow: {
    flexDirection: "row", // Lay out children horizontally (side by side)
    justifyContent: "center", // Center the row within the screen width
    gap: 10, // 10px gap between each button
  },
});
