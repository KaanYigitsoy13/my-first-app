// components/ScreenWrapper.tsx
// -----------------------------------------------------------
// A wrapper component that every screen in the app uses.
// It handles keyboard avoidance, safe area insets, and
// scrollable overflow in one reusable component.
// -----------------------------------------------------------

import { COLORS, SPACING } from "@/constants/theme";
import React from "react";
import {
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    StyleSheet,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

interface ScreenWrapperProps {
  children: React.ReactNode;
}

export default function ScreenWrapper({ children }: ScreenWrapperProps) {
  return (
    <SafeAreaView style={styles.safe} edges={["top", "bottom"]}>
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <ScrollView
          style={styles.flex}
          contentContainerStyle={styles.content}
          keyboardShouldPersistTaps="handled"
        >
          {children}
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  flex: {
    flex: 1,
  },
  content: {
    paddingHorizontal: SPACING.md,
    paddingTop: SPACING.lg,
    paddingBottom: SPACING.xxl,
  },
});
