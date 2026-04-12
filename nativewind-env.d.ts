// nativewind-env.d.ts
// -----------------------------------------------------------
// This file tells TypeScript about NativeWind's types.
//
// Without it, TypeScript would show red squiggly errors when
// you use `className` on React Native components like <View>
// or <Text>, because those components don't normally accept
// a `className` prop — that's a web/HTML thing.
//
// The triple-slash directive below imports NativeWind's type
// definitions, which extend React Native's built-in types to
// include `className`. It's like telling TypeScript:
// "Trust me, className works here — NativeWind handles it."
// -----------------------------------------------------------

/// <reference types="nativewind/types" />
