// babel.config.js
// -----------------------------------------------------------
// Babel is a "translator" that converts modern JavaScript/TypeScript
// into code that can run on all devices.
//
// This config tells Babel to use two presets (bundles of plugins):
//
// 1. babel-preset-expo: Handles all the Expo-specific transforms
//    (JSX, TypeScript, etc.). The `jsxImportSource: "nativewind"`
//    option tells React to use NativeWind's JSX factory, which is
//    what makes the `className` prop work on React Native components.
//
// 2. nativewind/babel: Adds NativeWind-specific transforms that
//    process Tailwind class names at compile time.
// -----------------------------------------------------------

module.exports = function (api) {
  // `api.cache(true)` tells Babel to cache the config.
  // This speeds up rebuilds because Babel won't re-evaluate
  // this file every time it compiles a module.
  api.cache(true);

  return {
    presets: [
      // The array syntax [preset, options] lets us pass config to a preset.
      // jsxImportSource tells React's JSX transform to use NativeWind's
      // version, which understands `className` on native components.
      ["babel-preset-expo", { jsxImportSource: "nativewind" }],

      // NativeWind's own Babel preset — handles class name processing.
      "nativewind/babel",
    ],
  };
};
