// lib/supabase.ts
// -----------------------------------------------------------
// This file creates a SINGLE Supabase client instance that the
// entire app shares. This is called the "singleton pattern" —
// instead of creating a new connection every time you need to
// talk to the database, you create ONE and reuse it everywhere.
//
// Why? Each client holds an open connection. If you created a
// new one on every screen, you'd waste memory and potentially
// hit connection limits on the server.
// -----------------------------------------------------------

// `createClient` is the factory function from Supabase's SDK.
// You give it your project URL + API key, and it returns an
// object with methods like .from("table").select() etc.
import { createClient } from "@supabase/supabase-js";

// AsyncStorage is React Native's key-value storage on DISK.
// Think of it like localStorage in a web browser, but for phones.
// Supabase needs a storage adapter to persist things like auth
// tokens between app restarts. Even though we're not using auth
// right now, Supabase expects a storage option on React Native.
import AsyncStorage from "@react-native-async-storage/async-storage";

// Read our Supabase credentials from environment variables.
// Remember: Expo reads .env at BUILD TIME and replaces these
// process.env references with the actual string values.
// The "!" at the end is TypeScript's "non-null assertion" —
// it tells TypeScript "trust me, this value exists." Without it,
// TypeScript would complain that the value might be undefined.
const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY!;

// Create and export the Supabase client.
// The second argument is an options object where we tell Supabase
// to use AsyncStorage for any data it needs to persist on the device.
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    // Use phone's disk storage instead of in-memory storage.
    // This way, if Supabase stores any session data, it survives app restarts.
    storage: AsyncStorage,

    // We're not using URL-based auth redirects (that's a web thing).
    // In React Native, there's no browser URL bar, so we disable this.
    detectSessionInUrl: false,
  },
});
