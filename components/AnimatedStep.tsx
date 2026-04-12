// components/AnimatedStep.tsx
// -----------------------------------------------------------
// Wraps any content in a fade-in + slide-up animation that
// plays automatically when the component first appears on screen.
//
// WHY THIS EXISTS:
// Without animation, when the user taps "Next" in a flow, the
// old question disappears and the new one just *appears* — poof.
// It feels abrupt and cheap, like a broken slideshow.
//
// With AnimatedStep, the new content fades in (transparent → opaque)
// and slides up (30px below → final position) over 320ms.
// This tiny animation makes the flow feel smooth and intentional.
//
// HOW TO USE:
//   <AnimatedStep>
//     <Text>This content will animate in when it appears</Text>
//   </AnimatedStep>
//
// Every step in the Morning/Evening flow wraps its content in
// this component. Since each step renders a new AnimatedStep,
// the animation plays fresh for every step transition.
// -----------------------------------------------------------

import React, { useEffect, useRef } from "react";
import { Animated, Easing } from "react-native";

interface AnimatedStepProps {
  children: React.ReactNode; // The content to animate
}

export default function AnimatedStep({ children }: AnimatedStepProps) {
  // -----------------------------------------------------------
  // TWO ANIMATED VALUES = TWO SIMULTANEOUS ANIMATIONS
  //
  // opacity: controls visibility (0 = invisible, 1 = fully visible)
  // translateY: controls vertical position (30 = 30px below, 0 = normal)
  //
  // Both start at their "hidden" values and animate to their
  // "visible" values at the same time (in parallel).
  // -----------------------------------------------------------
  const opacity = useRef(new Animated.Value(0)).current;
  const translateY = useRef(new Animated.Value(30)).current;

  // -----------------------------------------------------------
  // useEffect runs ONCE when this component first renders (mounts).
  // The empty [] dependency array means "run this only on mount."
  //
  // Animated.parallel() runs multiple animations at the same time.
  // Both animations take 320ms:
  //   - opacity: 0 → 1 (fade in)
  //   - translateY: 30 → 0 (slide up 30 pixels)
  //
  // Easing.out(Easing.quad) is a "deceleration curve" — the
  // animation starts fast and slows down at the end, which feels
  // natural (like a ball rolling to a stop). Without easing, the
  // animation would be perfectly linear and feel robotic.
  //
  // useNativeDriver: true means the animation runs on the phone's
  // native thread (not JavaScript). This gives smooth 60fps
  // performance even if JavaScript is busy doing other work.
  // We CAN use native driver here because opacity and transform
  // are supported (unlike width, which we couldn't use in HoldButton).
  // -----------------------------------------------------------
  useEffect(() => {
    Animated.parallel([
      Animated.timing(opacity, {
        toValue: 1,
        duration: 320,
        easing: Easing.out(Easing.quad),
        useNativeDriver: true,
      }),
      Animated.timing(translateY, {
        toValue: 0,
        duration: 320,
        easing: Easing.out(Easing.quad),
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  return (
    // Animated.View is a special View that can accept Animated values
    // in its style prop. A regular <View> would ignore them.
    <Animated.View
      style={{
        opacity, // Animated: 0 → 1
        transform: [{ translateY }], // Animated: 30 → 0
      }}
    >
      {children}
    </Animated.View>
  );
}
