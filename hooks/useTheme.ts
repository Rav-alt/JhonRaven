"use client";

import { useCallback, useSyncExternalStore } from "react";

export type Theme = "light" | "dark";

const KEY = "jr-theme"; // keep in sync with THEME_INIT in app/layout.tsx
const DARK_QUERY = "(prefers-color-scheme: dark)";

/** The theme the visitor actually sees: their saved pick if they made one,
 * otherwise whatever their OS asks for. */
function current(): Theme {
  const set = document.documentElement.getAttribute("data-theme");
  if (set === "light" || set === "dark") return set;
  return window.matchMedia(DARK_QUERY).matches ? "dark" : "light";
}

const listeners = new Set<() => void>();
const notify = () => listeners.forEach((l) => l());

function subscribe(cb: () => void) {
  listeners.add(cb);
  const mq = window.matchMedia(DARK_QUERY);
  mq.addEventListener("change", cb);
  return () => {
    listeners.delete(cb);
    mq.removeEventListener("change", cb);
  };
}

export function useTheme() {
  // Server render has no OS preference, so it reports null and the toggle
  // label fills in after hydration.
  const theme = useSyncExternalStore<Theme | null>(subscribe, current, () => null);

  const toggleTheme = useCallback(() => {
    const next: Theme = current() === "dark" ? "light" : "dark";
    document.documentElement.setAttribute("data-theme", next);
    try {
      localStorage.setItem(KEY, next);
    } catch {
      // Storage blocked (private mode): the pick still holds for this visit.
    }
    notify();
  }, []);

  return { theme, toggleTheme };
}
