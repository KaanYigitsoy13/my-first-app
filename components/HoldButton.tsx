// components/HoldButton.tsx
// -----------------------------------------------------------
// A "hold to confirm" button used at the END of each reflection
// flow (Morning: "Let's Start", Evening: "Let's Rest").
//
// HOW IT WORKS:
// 1. User presses and holds the button
// 2. A gold progress bar fills from left to right over 3 seconds
// 3. Phone vibrates gently, getting faster as the bar fills
// 4. If user holds the full duration → success vibration → onComplete()
// 5. If user releases early → progress resets, no action taken
//
// WHY A HOLD BUTTON?
// This is a UX pattern called "intentional friction." We WANT
// the user to slow down here — they're committing to their
// reflection. A simple tap would feel too casual. The 3-second
// hold creates a moment of presence, which fits the Stoic theme.
// -----------------------------------------------------------

import { COLORS, FONT_SIZES, SPACING } from "@/constants/theme";
import * as Haptics from "expo-haptics";
import React, { useRef } from "react";
import { Animated, Pressable, StyleSheet, Text } from "react-native";

interface HoldButtonProps {
  onComplete: () => void; // Called when the user successfully holds for the full duration
  label: string; // Button text ("Let's Start" or "Let's Rest")
  durationMs?: number; // How long to hold in milliseconds (default: 3000 = 3 seconds)
  disabled?: boolean; // When true: dims the button and ignores presses
}

export default function HoldButton({
  onComplete,
  label,
  durationMs = 3000,
  disabled = false,
}: HoldButtonProps) {
  // -----------------------------------------------------------
  // useRef vs useState — WHY?
  //
  // We use useRef for the animation value and the interval ID
  // because we DON'T want React to re-render the component when
  // these change. Animation values update 60 times per second —
  // if each update caused a re-render, the animation would stutter.
  //
  // useRef gives us a mutable container that persists across
  // renders without triggering new renders. Think of it as a
  // "sticky note" attached to the component that React ignores.
  // -----------------------------------------------------------

  // Animated.Value is a special number that can smoothly transition
  // from 0 to 1. React Native's animation system interpolates it
  // on the native thread for smooth 60fps animations.
  const progress = useRef(new Animated.Value(0)).current;

  // Stores the ID of our haptic timeout so we can stop it later.
  // Without this ref, we'd have no way to cancel the vibrations
  // when the user releases the button.
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Stores the animation reference so we can cancel it on release.
  const animationRef = useRef<Animated.CompositeAnimation | null>(null);

  // -----------------------------------------------------------
  // PRESS START: User puts their finger down
  // -----------------------------------------------------------
  const handlePressIn = () => {
    if (disabled) return;

    // 1. Initial haptic — a medium "thud" to confirm the press registered
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);

    // 2. Start the progress bar animation from 0 → 1 over durationMs
    //    Animated.timing smoothly transitions the value over time.
    //    useNativeDriver: false because we're animating `width` (a layout
    //    property), which can't be animated on the native thread.
    const animation = Animated.timing(progress, {
      toValue: 1,
      duration: durationMs,
      useNativeDriver: false,
    });

    animationRef.current = animation;

    // 3. Start accelerating haptic buzzes while holding.
    //    Instead of a fixed interval, we use a recursive setTimeout
    //    that gets faster over time — starts at 500ms, ends at 80ms.
    //    This creates a "heartbeat speeding up" effect as the bar fills.
    const startTime = Date.now();
    const scheduleNextBuzz = () => {
      // How far through the hold are we? 0 = just started, 1 = done
      const elapsed = Date.now() - startTime;
      const fraction = Math.min(elapsed / durationMs, 1);

      // Lerp (linear interpolation) from 500ms down to 80ms.
      // At 0% progress → 500ms gap. At 100% progress → 80ms gap.
      const delay = 500 - fraction * (500 - 80);

      timeoutRef.current = setTimeout(() => {
        Haptics.selectionAsync();
        scheduleNextBuzz(); // Schedule the next buzz (even shorter delay)
      }, delay);
    };
    scheduleNextBuzz();

    // 4. Start the animation. When it finishes (user held long enough):
    animation.start(({ finished }) => {
      // `finished` is true ONLY if the animation completed naturally.
      // If we stopped it early (user released), finished is false.
      if (finished) {
        // Success! Fire a celebratory haptic — a distinct "done!" vibration
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);

        // Clean up the interval (stop the buzzing)
        cleanup();

        // Tell the parent screen the user completed the hold
        onComplete();
      }
    });
  };

  // -----------------------------------------------------------
  // PRESS END: User lifts their finger (possibly early)
  // -----------------------------------------------------------
  const handlePressOut = () => {
    if (disabled) return;

    // Stop the animation wherever it is
    if (animationRef.current) {
      animationRef.current.stop();
      animationRef.current = null;
    }

    // Reset the progress bar back to 0 (empty)
    progress.setValue(0);

    // Stop the repeating haptic vibrations
    cleanup();
  };

  // -----------------------------------------------------------
  // CLEANUP: Stop the haptic timeout to prevent "ghost vibrations"
  //
  // This is CRITICAL. If you forget to clear the timeout, the
  // phone will keep vibrating even after the user releases the
  // button or navigates away. This is a common bug with
  // setTimeout chains in React Native.
  // -----------------------------------------------------------
  const cleanup = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
  };

  // -----------------------------------------------------------
  // PROGRESS BAR WIDTH
  //
  // `progress.interpolate()` converts our 0→1 animation value
  // into a percentage string "0%" → "100%". This drives the
  // width of the gold fill bar inside the button.
  // -----------------------------------------------------------
  const fillWidth = progress.interpolate({
    inputRange: [0, 1],
    outputRange: ["0%", "100%"],
  });

  return (
    <Pressable
      onPressIn={handlePressIn} // Finger touches down
      onPressOut={handlePressOut} // Finger lifts up
      disabled={disabled}
      style={[styles.button, disabled && styles.disabled]}
    >
      {/* The animated gold fill bar — sits behind the text */}
      <Animated.View
        style={[
          styles.fill,
          { width: fillWidth }, // Width grows from 0% to 100% as the user holds
        ]}
      />

      {/* The button label — positioned on top of the fill bar */}
      <Text style={[styles.label, disabled && styles.disabledLabel]}>
        {label}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: SPACING.md,
    paddingHorizontal: SPACING.lg,
    borderWidth: 1.5,
    borderColor: COLORS.gold,
    borderRadius: 10,
    backgroundColor: COLORS.surface,
    marginTop: SPACING.lg,
    // `overflow: hidden` is essential — without it, the animated
    // fill bar would spill outside the button's rounded corners.
    overflow: "hidden",
    // Position relative so the fill bar (position: absolute) is
    // contained within this button.
    position: "relative",
  },

  disabled: {
    borderColor: COLORS.inkFaint,
  },

  // The animated gold fill — absolutely positioned so it fills
  // the button from the left edge without pushing the text around.
  fill: {
    position: "absolute",
    left: 0,
    top: 0,
    bottom: 0,
    backgroundColor: COLORS.goldMuted,
    opacity: 0.3, // Semi-transparent so the text remains readable
    borderRadius: 10,
  },

  label: {
    fontSize: FONT_SIZES.lg,
    fontWeight: "700",
    color: COLORS.gold,
    // Ensure text renders above the fill bar
    zIndex: 1,
  },

  disabledLabel: {
    color: COLORS.inkFaint,
  },
});
