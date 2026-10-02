"use client";

import styles from "./Hero.module.css";
import { AVAILABILITY, DEFAULT_POKE } from "@/lib/data";
import type { PokeSkin, Theme } from "@/lib/data";
import { tileSpriteFor } from "@/lib/pokeTheme";

const STACK = ["TypeScript", "React", "Next.js", "Tailwind", "Motion"];

const cap = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);

/**
 * Hero — a "Pokédex readout" frame (mono labels in the corners, after
 * kaisermann.me), a small greeting with the active Pokémon's pixel sprite
 * (after jahir.dev), then the name set big across the width with the
 * details underneath (after jakubborowy.com). Text only sits on plain fill.
 */
export default function Hero({
  name,
  tagline,
  theme,
  poke,
}: {
  name: string;
  tagline: string;
  theme: Theme;
  poke: PokeSkin | null;
}) {
  const skin = poke ?? DEFAULT_POKE;
  const types = skin.types.map(cap).join(" / ");

  return (
    <section className={styles.section} aria-labelledby="hero-name">
      <div className={styles.readout} aria-hidden="true">
        <span>Portfolio · 2026</span>
        <span>
          No. {String(skin.dex).padStart(3, "0")} · {types}
        </span>
      </div>

      <div className={styles.greeting}>
        <span className={styles.spriteTile} title={`${skin.display} — change it in the Pokédex`}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={tileSpriteFor(skin.dex, theme)} alt={`${skin.display}, pixel sprite`} className={styles.sprite} />
        </span>
        <span className={styles.greetText}>Kumusta! I&rsquo;m</span>
      </div>

      <h1 id="hero-name" className={styles.name}>
        {name}
      </h1>

      <div className={styles.lower}>
        <div className={styles.lead}>
          <div className={styles.role}>
            <span className={styles.roleBar} />
            <span className={styles.roleText}>Front End Developer</span>
          </div>
          <p className={styles.tagline}>{tagline}</p>
        </div>

        <div className={styles.side}>
          {AVAILABILITY.open && (
            <a href="#contact" className={styles.availability}>
              <span className={styles.availDot} aria-hidden="true" />
              <span className={styles.availLabel}>{AVAILABILITY.label}</span>
              <span className={styles.availSep} aria-hidden="true" />
              <span className={styles.availDetail}>{AVAILABILITY.detail}</span>
              <span className={styles.availGo} aria-hidden="true">
                →
              </span>
            </a>
          )}
          <div className={styles.chips}>
            {STACK.map((t) => (
              <span key={t} className={styles.chip}>
                {t}
              </span>
            ))}
          </div>
          <div className={styles.ctas}>
            <a href="#work" className={styles.ctaPrimary}>
              Projects
            </a>
            <a href="#contact" className={styles.ctaSecondary}>
              Get in touch
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
