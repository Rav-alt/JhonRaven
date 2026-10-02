"use client";

import styles from "./Hero.module.css";
import { AVAILABILITY, DEFAULT_POKE } from "@/lib/data";
import type { PokeSkin, Theme } from "@/lib/data";
import { spriteFor } from "@/lib/pokeTheme";

const STACK = ["TypeScript", "React", "Next.js", "Tailwind", "Motion"];

const cap = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);

/** Two columns: the intro on plain background on the left, the active
 *  Pokémon on the right with a small caption. Nothing overlaps the text. */
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
  const kicker = `${skin.types.map(cap).join(" · ")} · No. ${skin.dex}`;

  return (
    <section className={styles.section}>
      <div className={styles.copy}>
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
        <div className={styles.kicker}>
          <span className={styles.kickerLine} />
          {kicker}
        </div>
        <h1 className={styles.name}>{name}</h1>
        <div className={styles.role}>
          <div className={styles.roleBar} />
          <div className={styles.roleText}>Front End Developer</div>
        </div>
        <p className={styles.tagline}>{tagline}</p>
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

      <figure className={styles.figure}>
        <div className={styles.figureArt}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={spriteFor(skin.dex, theme)} alt={`${skin.display} artwork`} className={styles.sprite} />
        </div>
        <figcaption className={styles.figCaption}>
          <span className={styles.figName}>{skin.display}</span>
          <span className={styles.figHint}>Pick another in the Pokédex and the whole site repaints.</span>
        </figcaption>
      </figure>
    </section>
  );
}
