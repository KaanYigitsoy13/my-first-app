// store/useReflectionStore.ts
// -----------------------------------------------------------
// This is the app's "brain" — a Zustand store that holds all
// the answers the user gives during Morning and Evening flows.
//
// ZUSTAND CRASH COURSE:
// Zustand is a state management library. Think of it as a
// shared notebook that any screen in your app can read from
// and write to. When one screen writes a value, every other
// screen that reads that value automatically updates.
//
// Without Zustand, you'd have to pass data between screens
// via props or navigation params, which gets messy fast.
//
// PERSISTENCE:
// We use Zustand's `persist` middleware to save `daily_goal`
// to AsyncStorage (the phone's disk). Everything else lives
// only in memory and resets when the app restarts — which is
// fine because reflection answers get sent to Supabase at the
// end of each flow.
// -----------------------------------------------------------

import AsyncStorage from "@react-native-async-storage/async-storage";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

// -----------------------------------------------------------
// TypeScript INTERFACE: defines the "shape" of our store.
// This tells TypeScript (and you) exactly what fields exist
// and what types they can hold. If you try to set mood to
// "happy" (a string), TypeScript will show an error because
// mood is defined as number | null.
// -----------------------------------------------------------
interface ReflectionState {
  // -- Common fields (used in both morning AND evening flows) --
  mood: number | null; // 1-5 score
  physical: number | null; // 1-5 score
  stress_level: number | null; // 1-5 score

  // -- Morning-only fields --
  daily_goal: string; // Free text: "What do you want to accomplish today?"
  chosen_quality: string; // One of: Temperance, Focus, Courage, Justice, Kindness

  // -- Evening-only fields --
  performance: number | null; // 1-5 score
  goal_accomplished: boolean | null; // Yes/No
  one_percent_better: boolean | null; // Yes/No

  // -- Actions (functions that modify the state) --
  // A single generic setter that can update ANY field in the store.
  setField: <K extends keyof ReflectionState>(
    key: K,
    value: ReflectionState[K],
  ) => void;

  // Reset functions clear fields back to their initial values.
  // resetMorning: clears common + morning fields, EXCEPT daily_goal
  //   (because daily_goal is persisted and shown on the main screen).
  // resetEvening: clears common + evening fields.
  resetMorning: () => void;
  resetEvening: () => void;
}

// -----------------------------------------------------------
// CREATE THE STORE
//
// `create` makes a React hook (useReflectionStore) that any
// component can call to read or update state.
//
// `persist(...)` wraps the store so that selected fields
// (just daily_goal) are automatically saved to AsyncStorage
// whenever they change, and loaded back when the app starts.
// -----------------------------------------------------------
const useReflectionStore = create<ReflectionState>()(
  persist(
    // The `set` function is how you update state in Zustand.
    // You call set({ key: value }) and Zustand merges it into
    // the current state and notifies all listeners.
    (set) => ({
      // -- Initial values for all fields --
      mood: null,
      physical: null,
      stress_level: null,

      daily_goal: "",
      chosen_quality: "",

      performance: null,
      goal_accomplished: null,
      one_percent_better: null,

      // -- Actions --

      // Generic setter: setField("mood", 4) updates mood to 4.
      // The `<K extends keyof ReflectionState>` part is TypeScript
      // generics — it ensures the key and value types match.
      // You can't do setField("mood", "hello") because mood
      // expects number | null, not string.
      setField: (key, value) =>
        set({ [key]: value } as Partial<ReflectionState>),

      // Reset morning flow fields back to initial values.
      // Notice daily_goal is NOT reset here — it persists on
      // the main screen until the user sets a new one tomorrow.
      resetMorning: () =>
        set({
          mood: null,
          physical: null,
          stress_level: null,
          chosen_quality: "",
        }),

      // Reset evening flow fields back to initial values.
      // Common fields (mood, physical, stress_level) are also
      // cleared because evening has its own set of answers.
      resetEvening: () =>
        set({
          mood: null,
          physical: null,
          stress_level: null,
          performance: null,
          goal_accomplished: null,
          one_percent_better: null,
        }),
    }),
    {
      // The key under which data is stored in AsyncStorage.
      // Think of it like a filename on the phone's disk.
      name: "marcus-reflection-storage",

      // Tell Zustand to use AsyncStorage (phone disk) instead of
      // the default (which is localStorage — a web-only API).
      storage: createJSONStorage(() => AsyncStorage),

      // CRITICAL: `partialize` controls WHAT gets saved to disk.
      // Without this, Zustand would persist EVERYTHING — meaning
      // old mood/stress scores would reappear after an app restart.
      // We only want daily_goal to survive app restarts.
      partialize: (state) => ({ daily_goal: state.daily_goal }),
    },
  ),
);

export default useReflectionStore;
