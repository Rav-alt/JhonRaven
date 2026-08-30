"use client";

import Image from "next/image";
import styles from "./Hero.module.css";
import { DEFAULT_POKE } from "@/lib/data";
import type { PokeSkin, Theme } from "@/lib/data";
import type { ContributionGraph } from "@/lib/github";
import { spriteFor } from "@/lib/pokeTheme";

const STACK = ["TypeScript", "React", "Next.js", "Tailwind", "Motion"];
const LEGEND = [0, 1, 2, 3, 4];

const cap = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);

export default function Hero({
  name,
  handle,
  tagline,
  theme,
  poke,
  graph,
}: {
  name: string;
  handle: string;
  tagline: string;
  theme: Theme;
  poke: PokeSkin | null;
  graph: ContributionGraph;
}) {
  const weeks = graph.weeks;
  const skin = poke ?? DEFAULT_POKE;
  const kicker = `${skin.types.map(cap).join(" · ")} · No. ${skin.dex}`;

  return (
    <section className={styles.section}>
      <div className={styles.figureWrap}>
        <div className={styles.figureGlow} />
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={spriteFor(skin.dex, theme)} alt={`${skin.display} artwork`} className={styles.sprite} />
        <div className={styles.figureScrim} />
      </div>

      <div className={styles.copy}>
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

      <div className={styles.side}>
        <div className={`${styles.card} ${styles.profileCard}`}>
          <div className={styles.avatarWrap}>
            <div className={styles.avatarRing} />
            <div className={styles.avatar}>
              <Image src="/images/avatar.png" alt={name} width={104} height={104} />
            </div>
          </div>
          <div className={styles.profileBody}>
            <div className={styles.profileName}>{name}</div>
            <div className={styles.profileHandle}>{handle}</div>
            <div className={styles.profileBio}>We do what we do.</div>
            <div className={styles.profileStats}>
              <span>
                <strong>528</strong> followers
              </span>
              <span>
                <strong>140</strong> following
              </span>
              <a href="#contact" className={styles.followBtn}>
                Follow
              </a>
            </div>
          </div>
        </div>

        <div className={`${styles.card} ${styles.graphCard}`}>
          <div className={styles.graphHeader}>
            <div className={styles.graphCount}>
              <span className={styles.graphCountNum}>{graph.total.toLocaleString("en-US")}</span>
              <span className={styles.graphCountLabel}>contributions</span>
            </div>
            <div className={styles.graphSpan}>last {weeks.length} weeks</div>
          </div>
          <div className={styles.graphBody}>
            <div className={styles.graphDays}>
              <span>Mon</span>
              <span></span>
              <span>Wed</span>
              <span></span>
              <span>Fri</span>
              <span></span>
              <span></span>
            </div>
            <div className={styles.graphMain}>
              <div className={styles.graphMonths}>
                {graph.months.map((m, mi) => (
                  <span key={mi}>{m}</span>
                ))}
              </div>
              <div className={styles.graphWeeks}>
                {weeks.map((week, wi) => (
                  <div key={wi} className={styles.graphWeek}>
                    {week.map((level, di) => (
                      <div
                        key={di}
                        className={styles.graphCell}
                        style={{ background: `var(--ramp-${level})` }}
                      />
                    ))}
                  </div>
                ))}
              </div>
            </div>
          </div>
          <div className={styles.graphLegend}>
            <span>Less</span>
            {LEGEND.map((level) => (
              <span
                key={level}
                className={styles.legendCell}
                style={{ background: `var(--ramp-${level})` }}
              />
            ))}
            <span>More</span>
          </div>
        </div>
      </div>
    </section>
  );
}
