"use client";

import { useCallback, useEffect, useState } from "react";
import type { PokeSkin, Theme } from "@/lib/data";
import { DEFAULT_POKE } from "@/lib/data";
import { buildCache, THEME_VARS, type PokeCache } from "@/lib/pokeTheme";
import { fetchPokemon } from "@/lib/pokeApi";

const MODE_KEY = "dialga-portfolio-theme";
const POKE_KEY = "dialga-portfolio-poke";

export type PokeStatus = "idle" | "loading" | "error";

function applyVars(vars: Record<string, string> | null) {
  const el = document.documentElement;
  for (const key of THEME_VARS) el.style.removeProperty(key);
  if (vars) for (const [key, value] of Object.entries(vars)) el.style.setProperty(key, value);
}

function readCache(): PokeCache | null {
  try {
    const raw = localStorage.getItem(POKE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as PokeCache;
    if (parsed && typeof parsed.dex === "number" && parsed.dark && parsed.light) return parsed;
  } catch {
    // corrupt / unavailable — fall back to the base palette
  }
  return null;
}

export function useTheme() {
  const [theme, setThemeState] = useState<Theme>("dark");
  const [poke, setPokeState] = useState<PokeSkin | null>(null);
  const [pokeStatus, setPokeStatus] = useState<PokeStatus>("idle");
  const [pokeError, setPokeError] = useState<string | null>(null);

  useEffect(() => {
    let mode: Theme = "dark";
    try {
      const saved = localStorage.getItem(MODE_KEY);
      if (saved === "light" || saved === "dark") mode = saved;
    } catch {
      // localStorage unavailable (private mode, etc.) — fall back to dark.
    }
    const cache = readCache();
    // Reconciling with the pre-hydration inline script in layout.tsx (see
    // THEME_INIT); this one-time sync keeps React state in step with the DOM
    // the script already set, and avoids a themed flash on load.
    document.documentElement.setAttribute("data-theme", mode);
    applyVars(cache ? cache[mode] : null);
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setThemeState(mode);
    if (cache) {
      setPokeState({ dex: cache.dex, display: cache.display, types: cache.types });
    }
  }, []);

  const toggleTheme = useCallback(() => {
    setThemeState((current) => {
      const next: Theme = current === "dark" ? "light" : "dark";
      document.documentElement.setAttribute("data-theme", next);
      try {
        localStorage.setItem(MODE_KEY, next);
      } catch {
        // ignore write failures
      }
      const cache = readCache();
      applyVars(cache ? cache[next] : null);
      return next;
    });
  }, []);

  const commitSkin = useCallback((meta: PokeSkin) => {
    if (meta.dex === DEFAULT_POKE.dex) {
      // Dialga is the built-in palette — clear any override instead of deriving.
      try {
        localStorage.removeItem(POKE_KEY);
      } catch {
        // ignore
      }
      applyVars(null);
      setPokeState(null);
      return;
    }
    const cache = buildCache(meta);
    try {
      localStorage.setItem(POKE_KEY, JSON.stringify(cache));
    } catch {
      // ignore write failures — the override still applies for this session
    }
    const mode = (document.documentElement.getAttribute("data-theme") as Theme) || "dark";
    applyVars(cache[mode]);
    setPokeState(meta);
  }, []);

  const setPoke = useCallback(
    (skin: PokeSkin) => {
      setPokeError(null);
      setPokeStatus("idle");
      commitSkin(skin);
    },
    [commitSkin],
  );

  const searchPoke = useCallback(
    async (query: string) => {
      setPokeError(null);
      setPokeStatus("loading");
      try {
        const meta = await fetchPokemon(query);
        commitSkin({ dex: meta.dex, display: meta.display, types: meta.types });
        setPokeStatus("idle");
      } catch (err) {
        setPokeStatus("error");
        setPokeError(err instanceof Error ? err.message : "Something went wrong.");
      }
    },
    [commitSkin],
  );

  const resetPoke = useCallback(() => {
    setPokeError(null);
    setPokeStatus("idle");
    commitSkin(DEFAULT_POKE);
  }, [commitSkin]);

  return {
    theme,
    toggleTheme,
    poke,
    pokeStatus,
    pokeError,
    setPoke,
    searchPoke,
    resetPoke,
  };
}
