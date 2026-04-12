// tailwind.config.js
// -----------------------------------------------------------
// This file tells Tailwind CSS WHERE to look for class names
// and HOW to generate styles.
//
// NativeWind uses Tailwind CSS under the hood to convert
// utility classes (like "bg-red-500", "p-4", "text-lg")
// into React Native StyleSheet objects at build time.
// -----------------------------------------------------------

/** @type {import('tailwindcss').Config} */
module.exports = {
  // `content` tells Tailwind which files to scan for class names.
  // If a file isn't listed here, Tailwind won't generate styles for
  // any classes used in that file — they'll just be silently ignored.
  content: [
    "./app/**/*.{js,jsx,ts,tsx}", // All screens inside the app/ folder
    "./components/**/*.{js,jsx,ts,tsx}", // All reusable components
  ],

  // `presets` are like "starter kits" for Tailwind config.
  // The nativewind/preset adapts Tailwind's web-focused defaults
  // to work with React Native (e.g., no "hover:" since phones
  // don't have mouse hover).
  presets: [require("nativewind/preset")],

  theme: {
    extend: {
      // We'll add our custom "Stone & Ink" colors here later
    },
  },
  plugins: [],
};
