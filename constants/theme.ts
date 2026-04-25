// constants/theme.ts
// -----------------------------------------------------------
// All design tokens for the "Stone & Ink" aesthetic live here.
// Import COLORS, FONT_SIZES, or SPACING in any file instead of
// hard-coding values.
// -----------------------------------------------------------

import { Platform } from "react-native";

export const COLORS = {
  background: "#0D0B09",  // Near-black warm dark — the app's base layer
  surface: "#1A1714",     // Card/container backgrounds
  surfaceAlt: "#252018",  // Elevated surfaces (selected items)
  border: "#3A3428",      // Subtle borders
  gold: "#C9A84C",        // Primary accent
  goldMuted: "#8C7240",   // Muted accent
  inkLight: "#F0ECE4",    // Primary text
  inkMuted: "#A09888",    // Secondary text
  inkFaint: "#5C5548",    // Placeholder / disabled
  error: "#C0523A",
  success: "#5A8F5A",
};

export const FONT_SIZES = {
  xs: 11,
  sm: 13,
  md: 15,
  lg: 18,
  xl: 22,
  display: 28,
};

export const SPACING = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
};

export const FONT_FAMILIES = {
  PLAYFAIR_REGULAR: "PlayfairDisplay_400Regular",
  PLAYFAIR_ITALIC: "PlayfairDisplay_400Regular_Italic",
  PLAYFAIR_BOLD: "PlayfairDisplay_700Bold",
  DM_SANS_REGULAR: "DMSans_400Regular",
  DM_SANS_MEDIUM: "DMSans_500Medium",
};

// -----------------------------------------------------------
// LEGACY EXPORTS (kept so existing files don't break)
// -----------------------------------------------------------
const tintColorLight = "#0a7ea4";
const tintColorDark = "#fff";

export const Colors = {
  light: {
    text: "#11181C",
    background: "#fff",
    tint: tintColorLight,
    icon: "#687076",
    tabIconDefault: "#687076",
    tabIconSelected: tintColorLight,
  },
  dark: {
    text: "#ECEDEE",
    background: "#151718",
    tint: tintColorDark,
    icon: "#9BA1A6",
    tabIconDefault: "#9BA1A6",
    tabIconSelected: tintColorDark,
  },
};

export const Fonts = Platform.select({
  ios: {
    sans: "system-ui",
    serif: "ui-serif",
    rounded: "ui-rounded",
    mono: "ui-monospace",
  },
  default: {
    sans: "normal",
    serif: "serif",
    rounded: "normal",
    mono: "monospace",
  },
  web: {
    sans: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
    serif: "Georgia, 'Times New Roman', serif",
    rounded:
      "'SF Pro Rounded', 'Hiragino Maru Gothic ProN', Meiryo, 'MS PGothic', sans-serif",
    mono: "SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace",
  },
});
