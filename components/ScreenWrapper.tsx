// components/ScreenWrapper.tsx
// -----------------------------------------------------------
// A wrapper component that every screen in the app uses.
// It handles three annoying phone problems so you don't have
// to think about them on every screen:
//
// PROBLEM 1: THE KEYBOARD COVERS YOUR INPUT
//   When the user taps a text field, the phone keyboard slides
//   up from the bottom and covers part of the screen. If the
//   text field is near the bottom, the user can't see what
//   they're typing. KeyboardAvoidingView pushes content up
//   to keep the input visible.
//
// PROBLEM 2: THE NOTCH / DYNAMIC ISLAND
//   Modern phones have cutouts (notch, camera hole, Dynamic
//   Island) at the top, and a home indicator bar at the bottom.
//   Without SafeAreaView, your content renders BEHIND these
//   areas and gets clipped. SafeAreaView adds automatic padding
//   to stay within the "safe" visible area.
//
// PROBLEM 3: CONTENT TALLER THAN THE SCREEN
//   If a step has lots of content (like the summary screen),
//   it might not fit on one screen. ScrollView makes it
//   scrollable so nothing gets cut off.
//
// USAGE:
//   <ScreenWrapper>
//     <Text>Your content here — safe from keyboard, notch, and overflow</Text>
//   </ScreenWrapper>
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
  children: React.ReactNode; // Whatever content you put between <ScreenWrapper>...</ScreenWrapper>
}

export default function ScreenWrapper({ children }: ScreenWrapperProps) {
  return (
    // SafeAreaView: adds padding to avoid the notch/home indicator.
    // `edges` specifies which sides to protect. We protect top and
    // bottom — left/right aren't needed since phones don't have
    // side cutouts.
    <SafeAreaView style={styles.safe} edges={["top", "bottom"]}>
      {/* KeyboardAvoidingView: pushes content up when keyboard appears.
          - iOS uses 'padding' behavior (adds padding at the bottom)
          - Android uses 'height' behavior (shrinks the view)
          These different behaviors account for how each OS handles
          the keyboard differently. */}
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        {/* ScrollView: makes content scrollable if it overflows.
            `contentContainerStyle` applies to the INNER content,
            `style` applies to the ScrollView container itself.
            `keyboardShouldPersistTaps="handled"` means tapping
            outside a text input dismisses the keyboard — a standard
            mobile UX pattern. */}
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
  // The outermost container — fills the screen with our background color
  safe: {
    flex: 1,
    backgroundColor: COLORS.background,
  },

  // flex: 1 tells a view to expand and fill all available space.
  // Without this, KeyboardAvoidingView and ScrollView would
  // collapse to zero height (since they have no fixed height set).
  flex: {
    flex: 1,
  },

  // Padding for the scrollable content area
  content: {
    paddingHorizontal: SPACING.md, // 16px left and right
    paddingTop: SPACING.lg, // 24px from the top
    paddingBottom: SPACING.xxl, // 48px at the bottom — extra space so
    // content isn't jammed against the bottom edge
  },
});
