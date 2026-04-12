// metro.config.js
// -----------------------------------------------------------
// Metro is the JavaScript BUNDLER for React Native.
// Think of it as the engine that takes all your .tsx/.ts files,
// your CSS, your images, etc., and packages them into a single
// bundle that runs on your phone.
//
// NativeWind hooks into Metro via `withNativeWind()` so it can:
// 1. Watch your global.css file for Tailwind directives
// 2. Run Tailwind CSS to generate styles
// 3. Inject those styles into your React Native app
//
// Without this config, NativeWind classes would do nothing.
// -----------------------------------------------------------

const { getDefaultConfig } = require("expo/metro-config");
const { withNativeWind } = require("nativewind/metro");

// Get Expo's default Metro config (handles TypeScript, assets, etc.)
const config = getDefaultConfig(__dirname);

// Wrap it with NativeWind, pointing to our global.css entry file.
// This tells Metro: "Hey, also process this CSS file through Tailwind."
module.exports = withNativeWind(config, { input: "./global.css" });
