"use client";

import { useCallback, useSyncExternalStore } from "react";
import { flushSync } from "react-dom";

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

  /** Flip the theme. Pass the element that was clicked and the new theme
   * spreads out from its center in a circle until it covers the page. */
  const toggleTheme = useCallback((from?: HTMLElement) => {
    const root = document.documentElement;
    const next: Theme = current() === "dark" ? "light" : "dark";

    const apply = () => {
      root.setAttribute("data-theme", next);
      try {
        localStorage.setItem(KEY, next);
      } catch {
        // Storage blocked (private mode): the pick still holds for this visit.
      }
      // Re-render the toggle label inside the snapshot, not after it.
      flushSync(notify);
    };

    // Browsers without View Transitions, and visitors who prefer reduced
    // motion, get an instant switch.
    if (!document.startViewTransition || window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      apply();
      return;
    }

    // The browser snapshots the page, runs `apply`, then shows the new page
    // over the old one. We clip the new one to a circle that grows from the
    // toggle to the farthest corner of the viewport.
    const r = from?.getBoundingClientRect();
    const x = r ? r.left + r.width / 2 : window.innerWidth / 2;
    const y = r ? r.top + r.height / 2 : window.innerHeight / 2;
    const radius = Math.hypot(Math.max(x, window.innerWidth - x), Math.max(y, window.innerHeight - y));

    const transition = document.startViewTransition(apply);
    transition.ready
      .then(() => {
        root.animate(
          { clipPath: [`circle(0px at ${x}px ${y}px)`, `circle(${radius}px at ${x}px ${y}px)`] },
          { duration: 650, easing: "cubic-bezier(.65,0,.35,1)", pseudoElement: "::view-transition-new(root)" },
        );
      })
      .catch(() => {
        // Transition skipped (e.g. tab hidden); the theme has still changed.
      });
  }, []);

  return { theme, toggleTheme };
}
