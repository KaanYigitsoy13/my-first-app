// constants/theme.ts
// -----------------------------------------------------------
// All design tokens for the "Stone & Ink" aesthetic live here.
// A design token is a named value (color, size, spacing) that
// you use consistently across the app. Instead of writing
// '#0D0B09' in 30 different files, you write COLORS.background
// once and import it everywhere. If you ever want to tweak the
// palette, you change ONE file and the whole app updates.
// -----------------------------------------------------------

import { Platform } from "react-native";

// -----------------------------------------------------------
// STONE & INK COLOR PALETTE
//
// The naming follows a purpose-based system:
// - background/surface/surfaceAlt: layered backgrounds (dark → lighter)
// - border: subtle dividers between sections
// - gold/goldMuted: accent colors for buttons, highlights
// - inkLight/inkMuted/inkFaint: text hierarchy (bright → dim)
// - error/success: feedback colors
//
// Why warm tones? Pure black (#000000) feels cold and digital.
// Adding a warm brown undertone (#0D0B09 instead of #000000)
// makes the app feel more like aged paper — fitting for a
// Stoic philosophy app inspired by ancient texts.
// -----------------------------------------------------------
export const COLORS = {
  background: "#0D0B09", // Near-black warm dark — the app's base layer
  surface: "#1A1714", // Card/container backgrounds — slightly lighter
  surfaceAlt: "#252018", // Elevated surfaces (modals, selected items)
  border: "#3A3428", // Subtle borders — visible but not distracting
  gold: "#C9A84C", // Primary accent — buttons, highlights, icons
  goldMuted: "#8C7240", // Muted accent — less important gold elements
  inkLight: "#F0ECE4", // Primary text — high contrast on dark backgrounds
  inkMuted: "#A09888", // Secondary text — labels, descriptions
  inkFaint: "#5C5548", // Placeholder text, disabled states
  error: "#C0523A", // Error/warning feedback
  success: "#5A8F5A", // Success/positive feedback
};

// -----------------------------------------------------------
// FONT SIZES
//
// A consistent type scale prevents the "every screen looks
// different" problem. These values are in "density-independent
// pixels" (dp) — React Native automatically scales them based
// on the phone's screen density, so text looks the same size
// on a small phone and a large tablet.
// -----------------------------------------------------------
export const FONT_SIZES = {
  xs: 11, // Fine print, labels
  sm: 13, // Captions, helper text
  md: 15, // Body text (default)
  lg: 18, // Section headers
  xl: 22, // Screen titles
  display: 28, // Hero text, main screen heading
};

// -----------------------------------------------------------
// SPACING SCALE
//
// Consistent spacing makes layouts feel "designed" rather than
// random. The values roughly double each step (4 → 8 → 16 → 32),
// which creates visual rhythm. Using SPACING.md instead of
// magic numbers like 16 means if you later decide "md" should
// be 20, you change it here and every screen adjusts.
// -----------------------------------------------------------
export const SPACING = {
  xs: 4, // Tight gaps (between icon and label)
  sm: 8, // Small gaps (between related items)
  md: 16, // Standard padding/margins
  lg: 24, // Section spacing
  xl: 32, // Large section breaks
  xxl: 48, // Screen-level padding, hero spacing
};

// -----------------------------------------------------------
// FONT FAMILY NAMES
//
// NOTE: These fonts require expo-google-fonts to be installed.
// We'll set that up later (Phase 8). For now these are just
// the string constants that expo-google-fonts will use.
//
// Playfair Display: An elegant serif font for headings.
//   Think of it as the "ancient wisdom" font.
// DM Sans: A clean, modern sans-serif for body text.
//   Think of it as the "everyday reading" font.
//
// Until Phase 8, the app will use system default fonts.
// These constants exist so we can reference them in code now
// and swap in the real fonts later without changing every file.
// -----------------------------------------------------------
export const FONT_FAMILIES = {
  PLAYFAIR_REGULAR: "PlayfairDisplay_400Regular",
  PLAYFAIR_ITALIC: "PlayfairDisplay_400Regular_Italic",
  PLAYFAIR_BOLD: "PlayfairDisplay_700Bold",
  DM_SANS_REGULAR: "DMSans_400Regular",
  DM_SANS_MEDIUM: "DMSans_500Medium",
};

// -----------------------------------------------------------
// LEGACY EXPORTS (kept so existing files don't break)
//
// The files below still import Colors and Fonts:
//   - app/(tabs)/_layout.tsx
//   - app/(tabs)/explore.tsx
//   - components/ui/collapsible.tsx
//   - hooks/use-theme-color.ts
//
// We'll remove these when we rebuild those screens to use
// the new COLORS palette and NativeWind classes.
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
