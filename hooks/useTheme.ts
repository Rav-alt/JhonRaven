"use client";

import { useCallback, useEffect, useState } from "react";
import type { Theme } from "@/lib/data";

const STORAGE_KEY = "dialga-portfolio-theme";

export function useTheme() {
  const [theme, setTheme] = useState<Theme>("dark");

  useEffect(() => {
    let saved: string | null = null;
    try {
      saved = localStorage.getItem(STORAGE_KEY);
    } catch {
      // localStorage unavailable (private mode, etc.) — fall back to dark.
    }
    const initial: Theme = saved === "light" || saved === "dark" ? saved : "dark";
    document.documentElement.setAttribute("data-theme", initial);
    // Reconciling with the pre-hydration inline script in layout.tsx (see
    // THEME_INIT) — this one-time sync avoids a themed flash on load.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setTheme(initial);
  }, []);

  const toggleTheme = useCallback(() => {
    setTheme((current) => {
      const next: Theme = current === "dark" ? "light" : "dark";
      document.documentElement.setAttribute("data-theme", next);
      try {
        localStorage.setItem(STORAGE_KEY, next);
      } catch {
        // ignore write failures
      }
      return next;
    });
  }, []);

  return { theme, toggleTheme };
}
