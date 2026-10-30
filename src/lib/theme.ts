import * as stylex from "@stylexjs/stylex";
import { useSyncExternalStore } from "react";

import { softDarkTheme, systemSoftDarkTheme } from "@/src/styles/themes";

export const themePreferences = ["light", "dark", "system"] as const;
export type ThemePreference = (typeof themePreferences)[number];

const storageKey = "lumiscia-theme";

const themeClasses: Record<ThemePreference, string> = {
  light: "",
  dark: stylex.props(softDarkTheme).className ?? "",
  system: stylex.props(systemSoftDarkTheme).className ?? "",
};

const colorSchemes: Record<ThemePreference, string> = {
  light: "light",
  dark: "dark",
  system: "light dark",
};

// The site is prerendered, so this runs in <head> before first paint to apply the stored theme.
export const themeScript = `(() => {
  const classes = ${JSON.stringify(themeClasses)};
  const schemes = ${JSON.stringify(colorSchemes)};
  let preference = "system";
  try {
    const stored = localStorage.getItem(${JSON.stringify(storageKey)});
    if (stored in classes) preference = stored;
  } catch {}
  const root = document.documentElement;
  if (classes[preference]) root.classList.add(...classes[preference].split(" "));
  root.style.colorScheme = schemes[preference];
})()`;

function parseThemePreference(value: string | null): ThemePreference {
  return themePreferences.find((preference) => preference === value) ?? "system";
}

let current: ThemePreference | null = null;
const listeners = new Set<() => void>();

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

function readStoredPreference() {
  try {
    return parseThemePreference(localStorage.getItem(storageKey));
  } catch {
    return "system";
  }
}

function getSnapshot() {
  current ??= readStoredPreference();
  return current;
}

export function setThemePreference(preference: ThemePreference) {
  try {
    localStorage.setItem(storageKey, preference);
  } catch {}
  const root = document.documentElement;
  for (const className of Object.values(themeClasses)) {
    if (className) root.classList.remove(...className.split(" "));
  }
  if (themeClasses[preference]) root.classList.add(...themeClasses[preference].split(" "));
  root.style.colorScheme = colorSchemes[preference];
  current = preference;
  for (const listener of listeners) listener();
}

export function useThemePreference() {
  return useSyncExternalStore(subscribe, getSnapshot, () => "system" as const);
}
