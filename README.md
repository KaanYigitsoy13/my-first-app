# Stoic Daily Reflection

A daily reflection app built with React Native and Expo. Start each morning with intention, close each evening with self-review — grounded in Stoic philosophy.

## Screenshots

_Coming soon_

## Features

- **Morning Reflection** — 6-step guided flow: rate your mood, energy, stress, set a daily goal, and choose a guiding quality (Temperance, Focus, Courage, Justice, Kindness). Seal your commitment with a hold-to-confirm pledge.
- **Daily Stoic Guidance** — After the morning reflection, the app uses the user’s daily focus and Google Gemini 2.5 Flash API to surface a relevant paragraph from Meditations by Marcus Aurelius, Discourses by Epictetus, or Letters from a Stoic by Seneca. This guidance is displayed clearly on the home screen throughout the day.
- **Evening Reflection** — 7-step review: evaluate your performance, goal accomplishment, mood, energy, stress, and growth. Close the day with a hold-to-confirm submission.
- **Daily Goal Persistence** — Your morning goal is saved locally and displayed on the home screen throughout the day.
- **Haptic Feedback** — Tactile vibrations on every interaction. The hold button buzzes rhythmically as it fills.
- **Stone & Ink Design** — A warm dark palette with gold accents, inspired by aged manuscripts and ancient texts.
- **Supabase Backend** — All reflections are stored in a PostgreSQL database for future analytics.

## Tech Stack

| Layer      | Technology                               |
| ---------- | ---------------------------------------- |
| Framework  | React Native 0.81 + Expo SDK 54          |
| Navigation | expo-router 6 (file-based)               |
| Styling    | NativeWind v4 + Tailwind CSS 3           |
| State      | Zustand with persist middleware          |
| Storage    | AsyncStorage (local) + Supabase (remote) |
| Haptics    | expo-haptics                             |
| Language   | TypeScript (strict mode)                 |

## Project Structure

```
app/
  (tabs)/index.tsx     ← Home screen with daily goal + nav buttons
  morning/step1-6.tsx  ← Morning reflection flow
  evening/step1-7.tsx  ← Evening reflection flow
components/
  ChoiceButton.tsx     ← Score (1-5) and quality pill buttons
  NextButton.tsx       ← Navigation button with haptic feedback
  HoldButton.tsx       ← Hold-to-confirm with animated progress bar
  ScreenWrapper.tsx    ← SafeArea + keyboard-aware scroll wrapper
  AnimatedStep.tsx     ← Fade-in + slide-up entrance animation
constants/
  theme.ts             ← Colors, fonts, sizes, spacing tokens
store/
  useReflectionStore.ts ← Zustand store with persist
lib/
  supabase.ts          ← Supabase client singleton
```

## Getting Started

1. **Install dependencies**

   ```bash
   npm install
   ```

2. **Set up environment variables**

   Create a `.env` file in the root:

   ```
   EXPO_PUBLIC_SUPABASE_URL=your_supabase_url
   EXPO_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   EXPO_PUBLIC_GEMINI_API_KEY=your_gemini_api_key
   ```

3. **Start the app**

   ```bash
   npx expo start
   ```

   Scan the QR code with Expo Go on your phone.

## Built With

This app was built as a learning project using vibe coding — collaboratively developed step-by-step with AI assistance.
