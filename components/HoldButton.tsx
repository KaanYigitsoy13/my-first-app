// components/HoldButton.tsx
// -----------------------------------------------------------
// A "hold to confirm" button used at the END of each reflection
// flow (Morning: "Let's Start", Evening: "Close the Day").
//
// The user holds the button for 3 seconds. A gold progress bar
// fills from left to right. On completion, onComplete() is called.
// Releasing early resets the progress bar.
// -----------------------------------------------------------

import { COLORS, FONT_SIZES, SPACING } from "@/constants/theme";
import * as Haptics from "expo-haptics";
import React, { useRef } from "react";
import { Animated, Pressable, StyleSheet, Text } from "react-native";

interface HoldButtonProps {
  onComplete: () => void;
  label: string;
  durationMs?: number;
  disabled?: boolean;
}

export default function HoldButton({
  onComplete,
  label,
  durationMs = 3000,
  disabled = false,
}: HoldButtonProps) {
  const progress = useRef(new Animated.Value(0)).current;
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const animationRef = useRef<Animated.CompositeAnimation | null>(null);

  const handlePressIn = () => {
    if (disabled) return;

    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);

    const animation = Animated.timing(progress, {
      toValue: 1,
      duration: durationMs,
      useNativeDriver: false,
    });

    animationRef.current = animation;

    intervalRef.current = setInterval(() => {
      Haptics.selectionAsync();
    }, 500);

    animation.start(({ finished }) => {
      if (finished) {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        cleanup();
        onComplete();
      }
    });
  };

  const handlePressOut = () => {
    if (disabled) return;

    if (animationRef.current) {
      animationRef.current.stop();
      animationRef.current = null;
    }

    progress.setValue(0);
    cleanup();
  };

  const cleanup = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  };

  const fillWidth = progress.interpolate({
    inputRange: [0, 1],
    outputRange: ["0%", "100%"],
  });

  return (
    <Pressable
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      disabled={disabled}
      style={[styles.button, disabled && styles.disabled]}
    >
      <Animated.View
        style={[
          styles.fill,
          { width: fillWidth },
        ]}
      />
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
    overflow: "hidden",
    position: "relative",
  },
  disabled: {
    borderColor: COLORS.inkFaint,
  },
  fill: {
    position: "absolute",
    left: 0,
    top: 0,
    bottom: 0,
    backgroundColor: COLORS.goldMuted,
    opacity: 0.3,
    borderRadius: 10,
  },
  label: {
    fontSize: FONT_SIZES.lg,
    fontWeight: "700",
    color: COLORS.gold,
    zIndex: 1,
  },
  disabledLabel: {
    color: COLORS.inkFaint,
  },
});
