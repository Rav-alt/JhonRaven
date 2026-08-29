"use client";

import Image from "next/image";
import styles from "./Contact.module.css";
import { SOCIALS } from "@/lib/data";
import { useIndexHover } from "@/hooks/useIndexHover";
import type { Theme } from "@/lib/data";

export default function Contact({ name, theme }: { name: string; theme: Theme }) {
  const { hovered, onEnter, onLeave } = useIndexHover();
  const dark = theme === "dark";

  return (
    <section id="contact" className={styles.section}>
      <div className={styles.topRule} />

      <div className={styles.grid}>
        <div className={styles.portraitCol}>
          <div className={styles.portraitGlow} />
          <div className={`${styles.portraitFrame} ${dark ? "" : styles.portraitFrameLight}`}>
            <Image
              src="/images/portrait.jpg"
              alt={name}
              fill
              sizes="(min-width: 900px) 40vw, 90vw"
              className={dark ? styles.portraitImgDark : styles.portraitImgLight}
            />
          </div>
        </div>

        <div className={styles.right}>
          <div className={styles.kicker}>
            <span className={styles.kickerLine} />
            Contact
          </div>

          <div className={styles.headline}>
            <div className={styles.headlineText}>Open to front-end work and collaborations.</div>
            <a href="mailto:hello@ravcadiz.dev" className={styles.email}>
              hello@ravcadiz.dev
            </a>
          </div>

          <div className={styles.chips}>
            <span className={styles.availableChip}>
              <span className={styles.availableDot} />
              Available for projects
            </span>
            <span className={styles.chip}>Manila · GMT+8</span>
            <span className={styles.chip}>Replies within a day</span>
          </div>

          <div className={styles.socials}>
            {SOCIALS.map((s, i) => {
              const on = hovered === i;
              return (
                <a
                  key={s.label}
                  href={s.href}
                  className={styles.social}
                  onMouseEnter={() => onEnter(i)}
                  onMouseLeave={() => onLeave(i)}
                >
                  <span className={`${styles.socialMark} ${on ? styles.on : ""}`} />
                  <span className={styles.socialLabel}>{s.label}</span>
                  <span className={styles.socialHandle}>{s.handle}</span>
                  <span className={`${styles.socialArrow} ${on ? styles.on : ""}`}>→</span>
                </a>
              );
            })}
          </div>
        </div>
      </div>

      <div className={styles.footer}>
        <span>© 2026 {name}</span>
        <span>Manila, Philippines</span>
      </div>
    </section>
  );
}
