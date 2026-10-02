"use client";

import { useState } from "react";
import { Moon, Sun } from "lucide-react";
import styles from "./Header.module.css";
import Pokedex from "./Pokedex";
import { FEATURED, NAV } from "@/lib/data";
import type { PokeSkin, Theme } from "@/lib/data";
import { tileSpriteFor } from "@/lib/pokeTheme";

/** Floating pill navbar: the current Pokémon as the "app icon", plain text
 *  links, a theme toggle, and one solid button that opens the Pokédex —
 *  the site's signature feature gets the primary action. */
export default function Header({
  name,
  theme,
  toggleTheme,
  poke,
  setPoke,
}: {
  name: string;
  theme: Theme;
  toggleTheme: () => void;
  poke: PokeSkin | null;
  setPoke: (skin: PokeSkin) => void;
}) {
  const [pokedexOpen, setPokedexOpen] = useState(false);

  const activeDex = poke?.dex ?? FEATURED[0].dex;
  const currentLabel = poke?.display ?? FEATURED[0].display;
  const nextMode = theme === "dark" ? "Regular" : "Shiny";

  return (
    <header className={styles.header}>
      <div className={styles.bar}>
        <a href="#main" className={styles.brand}>
          <span className={styles.icon} aria-hidden="true">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={tileSpriteFor(activeDex, theme)} alt="" className={styles.iconSprite} />
          </span>
          <span className={styles.name}>{name}</span>
        </a>

        <nav className={styles.nav} aria-label="Primary">
          {NAV.map((l) => (
            <a key={l.href} href={l.href} className={styles.navLink}>
              {l.label}
            </a>
          ))}
        </nav>

        <div className={styles.actions}>
          <button
            type="button"
            className={styles.modeBtn}
            onClick={toggleTheme}
            aria-label={`Switch to ${nextMode} mode`}
            title={`Switch to ${nextMode} mode`}
          >
            {theme === "dark" ? <Sun size={16} strokeWidth={2} /> : <Moon size={16} strokeWidth={2} />}
          </button>
          <button
            type="button"
            className={styles.dexBtn}
            onClick={() => setPokedexOpen(true)}
            title={`Current: ${currentLabel}`}
          >
            <span className={styles.dexGem} aria-hidden="true" />
            Open Pokédex
          </button>
        </div>
      </div>

      <Pokedex
        open={pokedexOpen}
        onClose={() => setPokedexOpen(false)}
        activeDex={activeDex}
        theme={theme}
        onSelect={setPoke}
      />
    </header>
  );
}
