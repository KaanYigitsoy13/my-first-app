// components/AnimatedStep.tsx
// -----------------------------------------------------------
// Wraps any content in a fade-in + slide-up animation that
// plays automatically when the component first appears on screen.
//
// Every step in the Morning/Evening flow wraps its content in
// this component so navigation between steps feels smooth.
// -----------------------------------------------------------

import React, { useEffect, useRef } from "react";
import { Animated, Easing } from "react-native";

interface AnimatedStepProps {
  children: React.ReactNode;
}

export default function AnimatedStep({ children }: AnimatedStepProps) {
  const opacity = useRef(new Animated.Value(0)).current;
  const translateY = useRef(new Animated.Value(30)).current;

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
    <Animated.View
      style={{
        opacity,
        transform: [{ translateY }],
      }}
    >
      {children}
    </Animated.View>
  );
}
