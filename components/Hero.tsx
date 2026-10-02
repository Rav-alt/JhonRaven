"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import styles from "./Hero.module.css";
import { AVAILABILITY, DEFAULT_POKE, PROJECTS, RESUME_PATH, ROLES } from "@/lib/data";
import type { PokeSkin, Theme } from "@/lib/data";
import { spriteFor } from "@/lib/pokeTheme";

const STACK = ["TypeScript", "React", "Next.js", "Tailwind", "Motion"];

const cap = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);


/** Live wall-clock time in Manila. Renders a placeholder on the server and
 *  fills in after mount, so there's no hydration mismatch. */
function useManilaTime() {
  const [time, setTime] = useState<string | null>(null);
  useEffect(() => {
    const fmt = new Intl.DateTimeFormat("en-US", {
      timeZone: "Asia/Manila",
      hour: "numeric",
      minute: "2-digit",
    });
    const tick = () => setTime(fmt.format(new Date()));
    tick();
    const id = window.setInterval(tick, 15_000);
    return () => window.clearInterval(id);
  }, []);
  return time;
}

export default function Hero({
  name,
  handle,
  tagline,
  theme,
  poke,
}: {
  name: string;
  handle: string;
  tagline: string;
  theme: Theme;
  poke: PokeSkin | null;
}) {
  const skin = poke ?? DEFAULT_POKE;
  const kicker = `${skin.types.map(cap).join(" · ")} · No. ${skin.dex}`;
  const time = useManilaTime();
  const building = PROJECTS.find((p) => !p.ended) ?? PROJECTS[0];
  const lastRole = ROLES[0];

  return (
    <section className={styles.section}>
      <div className={styles.figureWrap}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={spriteFor(skin.dex, theme)} alt={`${skin.display} artwork`} className={styles.sprite} />
      </div>

      {/* The Pokémon sits behind the copy, fully visible. */}
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
        <h1 className={styles.name}>
          {name}
        </h1>
        <div className={styles.role}>
          <div className={styles.roleBar} />
          <div className={styles.roleText}>
            Front End Developer
          </div>
        </div>
        <p className={styles.tagline}>
          {tagline}
        </p>
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
        <div className={styles.card}>
          <div className={styles.profileCard}>
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

          {/* Spec sheet: a few real, current facts in ruled rows. */}
          <dl className={styles.spec}>
            <div className={styles.specRow}>
              <dt className={styles.specKey}>Local time</dt>
              <dd className={styles.specVal}>
                <span suppressHydrationWarning>{time ?? "--:--"}</span>
                <span className={styles.specNote}>Manila · GMT+8</span>
              </dd>
            </div>
            <div className={styles.specRow}>
              <dt className={styles.specKey}>Building</dt>
              <dd className={styles.specVal}>
                <a href="#work" className={styles.specLink}>
                  {building.name}
                </a>
                <span className={styles.specNote}>{building.owner}</span>
              </dd>
            </div>
            <div className={styles.specRow}>
              <dt className={styles.specKey}>Last role</dt>
              <dd className={styles.specVal}>
                <a href="#experience" className={styles.specLink}>
                  {lastRole.title}
                </a>
                <span className={styles.specNote}>
                  {lastRole.company} · {lastRole.span}
                </span>
              </dd>
            </div>
            <div className={styles.specRow}>
              <dt className={styles.specKey}>Résumé</dt>
              <dd className={styles.specVal}>
                <a href={RESUME_PATH} className={styles.specLink} download>
                  Download PDF
                </a>
              </dd>
            </div>
          </dl>
        </div>
      </div>
    </section>
  );
}
