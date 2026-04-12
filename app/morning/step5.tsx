// app/morning/step5.tsx
// -----------------------------------------------------------
// MORNING STEP 5 — Chosen Quality
//
// This step is different from 1–3 (number scores). Instead of
// picking a number, the user picks one of five Stoic virtues
// to focus on today. We reuse ChoiceButton with the `pill` prop
// to render wider, text-friendly buttons.
//
// WHY THESE FIVE QUALITIES?
// They're inspired by Marcus Aurelius' Meditations:
//   Temperance — self-control, moderation
//   Focus      — attention on what matters
//   Courage    — facing difficulty bravely
//   Justice    — fairness and doing right
//   Kindness   — compassion toward others
//
// DATA FLOW:
//   User taps "Courage" → setField("chosen_quality", "Courage")
//   → store updates → ChoiceButton "Courage" highlights gold
//   → NextButton enables → push to step6 (summary)
// -----------------------------------------------------------

import AnimatedStep from "@/components/AnimatedStep";
import ChoiceButton from "@/components/ChoiceButton";
import NextButton from "@/components/NextButton";
import ScreenWrapper from "@/components/ScreenWrapper";
import { COLORS, FONT_SIZES, SPACING } from "@/constants/theme";
import useReflectionStore from "@/store/useReflectionStore";
import { useRouter } from "expo-router";
import { StyleSheet, Text, View } from "react-native";

// The five Stoic qualities — defined outside the component so
// they're not re-created on every render (minor optimization).
const QUALITIES = ["Temperance", "Focus", "Courage", "Justice", "Kindness"];

export default function MorningStep5() {
  const router = useRouter();

  // Read chosen_quality from Zustand — "" means nothing selected yet
  const chosenQuality = useReflectionStore((state) => state.chosen_quality);
  const setField = useReflectionStore((state) => state.setField);

  return (
    <ScreenWrapper>
      <AnimatedStep>
        {/* ---- Step Indicator ---- */}
        <Text style={styles.stepIndicator}>5 / 6</Text>

        {/* ---- Question ---- */}
        <Text style={styles.question}>
          Which quality do you want to embody today?
        </Text>

        {/* ---- Subtitle ---- */}
        {/* Brief Stoic-flavored nudge to keep visual rhythm
            consistent with steps 1–4 which all have subtitles. */}
        <Text style={styles.subtitle}>
          Choose the virtue that calls to you.
        </Text>

        {/* ---- Quality Buttons ---- */}
        {/* flexWrap: "wrap" is key here. Unlike the score buttons
            (5 small squares that always fit in one row), pill-shaped
            text buttons are wider. On narrow screens, some may not
            fit on one line. flexWrap lets them flow onto a second
            row automatically — like words in a paragraph.
            
            justifyContent: "center" keeps each row centered. */}
        <View style={styles.buttonRow}>
          {QUALITIES.map((quality) => (
            <ChoiceButton
              key={quality}
              label={quality}
              pill // Pill shape — wider, rounded, fits text labels
              selected={chosenQuality === quality}
              onPress={() => setField("chosen_quality", quality)}
            />
          ))}
        </View>

        {/* ---- Next Button ---- */}
        {/* Disabled until a quality is chosen.
            chosen_quality starts as "" → disabled={true}.
            User taps a quality → "" becomes "Courage" → disabled={false}. */}
        <NextButton
          onPress={() => router.push("/morning/step6")}
          disabled={chosenQuality === ""}
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
    textAlign: "center",
    marginTop: SPACING.sm,
    marginBottom: SPACING.xl,
    // TODO: Switch to FONT_FAMILIES.DM_SANS_REGULAR in Phase 8
  },

  // ---- Quality Button Row ----
  buttonRow: {
    flexDirection: "row",
    flexWrap: "wrap", // Allow buttons to wrap to a second row on small screens
    justifyContent: "center",
    gap: 10,
  },
});
