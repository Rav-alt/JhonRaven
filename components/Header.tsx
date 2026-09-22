"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import styles from "./Header.module.css";
import Pokedex from "./Pokedex";
import { FEATURED, NAV } from "@/lib/data";
import { letterSpreadOffsets } from "@/lib/letterSpread";
import { useIndexHover } from "@/hooks/useIndexHover";
import type { PokeSkin, Theme } from "@/lib/data";

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
  const { hovered, onEnter, onLeave } = useIndexHover();
  const thumbRefs = useRef<(HTMLDivElement | null)[]>([]);
  const [pokedexOpen, setPokedexOpen] = useState(false);

  const activeDex = poke?.dex ?? FEATURED[0].dex;
  const currentLabel = poke?.display ?? FEATURED[0].display;

  const onMove = (i: number) => (e: React.MouseEvent<HTMLAnchorElement>) => {
    const el = thumbRefs.current[i];
    if (!el) return;
    const r = e.currentTarget.getBoundingClientRect();
    const xPct = (e.clientX - r.left) / r.width - 0.5;
    const yPct = (e.clientY - r.top) / r.height - 0.5;
    el.style.left = `${r.width * (0.5 + xPct * 0.7)}px`;
    el.style.top = `${40 + yPct * 10}px`;
  };

  return (
    <header className={styles.header}>
      <div className={styles.brand}>
        <div className={styles.name}>{name}</div>
      </div>
      <div className={styles.right}>
        <nav className={styles.nav}>
          {NAV.map((l, i) => {
            const on = hovered === i;
            const offsets = letterSpreadOffsets(l.label);
            return (
              <a
                key={l.href}
                href={l.href}
                className={styles.navLink}
                onMouseEnter={() => onEnter(i)}
                onMouseLeave={() => onLeave(i)}
                onMouseMove={onMove(i)}
              >
                <span className={styles.navLetters}>
                  {l.label.split("").map((c, j) => (
                    <span
                      key={j}
                      className={styles.navLetter}
                      style={{
                        transitionDelay: `${j * 22}ms`,
                        transform: on ? `translateX(${offsets[j].toFixed(2)}px)` : "none",
                        color: on ? "var(--ink-strong)" : "inherit",
                      }}
                    >
                      {c}
                    </span>
                  ))}
                </span>
                {l.img && (
                  <div
                    ref={(el) => {
                      thumbRefs.current[i] = el;
                    }}
                    className={`${styles.navThumbWrap} ${on ? styles.on : ""}`}
                  >
                    <Image src={l.img} alt="" fill sizes="104px" />
                  </div>
                )}
              </a>
            );
          })}
        </nav>

        <button
          type="button"
          className={styles.themeBtn}
          onClick={() => setPokedexOpen(true)}
          title="Open the Pokédex"
        >
          <span className={styles.themeGem} />
          {currentLabel}
        </button>

        <button className={styles.themeBtn} onClick={toggleTheme} title="Switch theme">
          <span className={styles.themeGem} />
          {theme === "dark" ? "Shiny" : "Regular"}
        </button>
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
