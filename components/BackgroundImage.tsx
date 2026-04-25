// components/BackgroundImage.tsx
// -----------------------------------------------------------
// Full-screen background image anchored to the bottom.
//
// Uses expo-image for two key features unavailable in RN's
// built-in Image:
//   - `contentFit="contain"` — scales the image to fit within
//     the screen bounds while preserving the exact aspect ratio.
//     No distortion, no cropping.
//   - `contentPosition="bottom"` — when the image is smaller
//     than its container (e.g. tall screens), it sticks to the
//     bottom edge instead of centering. The figure stays at the
//     bottom of every device.
//
// Any screen space not covered by the image shows the black
// background (#000) of the parent container.
// -----------------------------------------------------------

import { Image, ImageSource } from "expo-image";
import { StyleSheet } from "react-native";

interface BackgroundImageProps {
  source?: ImageSource;
}

export default function BackgroundImage({ source }: BackgroundImageProps) {
  return (
    <Image
      source={source ?? require("@/assets/images/background.png")}
      style={StyleSheet.absoluteFillObject}
      contentFit="contain"
      contentPosition="bottom"
    />
  );
}
