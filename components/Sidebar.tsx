"use client";

import { useEffect, useRef } from "react";
import styles from "./Sidebar.module.css";
import { AVAILABILITY, RESUME_PATH, SECTIONS, SOCIALS } from "@/lib/data";
import { useScrollSpy } from "@/hooks/useScrollSpy";
import { useTheme } from "@/hooks/useTheme";

const IDS = SECTIONS.map((s) => s.id);

/** Sticky profile column. On wide screens it sits beside the work; under
 * 860px it becomes a slim top bar with the name, theme toggle and a row of
 * section links. The name here is the dock target: it stays invisible while
 * the hero name is flying in to cover it. */
export default function Sidebar({ name }: { name: string }) {
  const active = useScrollSpy(IDS);
  const { theme, toggleTheme } = useTheme();
  const words = name.split(" ");
  const next = theme === "dark" ? "light" : "dark";
  const navRef = useRef<HTMLElement>(null);

  // In the phone top bar the links scroll sideways; keep the current one in view.
  useEffect(() => {
    const nav = navRef.current;
    const link = nav?.querySelector<HTMLElement>('[aria-current="true"]');
    if (!nav || !link || nav.scrollWidth <= nav.clientWidth) return;
    nav.scrollTo({ left: link.offsetLeft - nav.offsetLeft - 16, behavior: "smooth" });
  }, [active]);

  return (
    <aside className={styles.side} data-dock-side aria-label="Profile">
      <a href="#top" className={styles.slotLink} aria-label={`${name}, back to top`}>
        <span className={styles.slotName} data-dock-slot aria-hidden="true">
          {words.slice(0, -1).join(" ")}
          <br />
          {words[words.length - 1]}
        </span>
      </a>
      <p className={styles.role}>
        Front-end developer
        <br />
        Manila, Philippines
      </p>
      {AVAILABILITY.open && (
        <p className={styles.status}>
          <span className={styles.dot} aria-hidden="true" />
          {AVAILABILITY.label}
        </p>
      )}
      <nav ref={navRef} className={styles.nav} aria-label="Sections">
        {SECTIONS.map((s) => (
          <a key={s.id} href={`#${s.id}`} aria-current={active === s.id ? "true" : undefined}>
            {s.label}
          </a>
        ))}
      </nav>
      <div className={styles.links}>
        {SOCIALS.map((s) => (
          <a key={s.label} href={s.href} target="_blank" rel="noopener noreferrer">
            {s.label}
          </a>
        ))}
        <a href={RESUME_PATH} target="_blank" rel="noopener noreferrer">
          Résumé
        </a>
      </div>
      <button
        type="button"
        className={styles.theme}
        onClick={toggleTheme}
        aria-label={theme ? `Switch to ${next} mode` : "Switch theme"}
      >
        <span className={styles.themeIcon} aria-hidden="true" />
        <span className={styles.themeLabel}>{theme ? `${next[0].toUpperCase()}${next.slice(1)} mode` : "Theme"}</span>
      </button>
    </aside>
  );
}
