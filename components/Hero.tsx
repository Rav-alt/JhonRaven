"use client";

import Image from "next/image";
import styles from "./Hero.module.css";
import { MONTHS, SPRITES, contributionGrid } from "@/lib/data";
import type { Theme } from "@/lib/data";

const STACK = ["TypeScript", "React", "Next.js", "Tailwind", "Motion"];
const LEGEND = [0, 1, 2, 3, 4];

export default function Hero({
  name,
  handle,
  tagline,
  theme,
}: {
  name: string;
  handle: string;
  tagline: string;
  theme: Theme;
}) {
  const weeks = contributionGrid();

  return (
    <section className={styles.section}>
      <div className={styles.figureWrap}>
        <div className={styles.figureGlow} />
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={SPRITES[theme]} alt="Dialga artwork" className={styles.sprite} />
        <div className={styles.figureScrim} />
      </div>

      <div className={styles.copy}>
        <div className={styles.kicker}>
          <span className={styles.kickerLine} />
          Temporal · Steel · No. 483
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
              <span className={styles.graphCountNum}>1,204</span>
              <span className={styles.graphCountLabel}>contributions</span>
            </div>
            <div className={styles.graphSpan}>last 30 weeks</div>
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
                {MONTHS.map((m) => (
                  <span key={m}>{m}</span>
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
