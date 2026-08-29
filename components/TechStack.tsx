"use client";

import styles from "./TechStack.module.css";
import { TOOLS } from "@/lib/data";
import { useIndexHover } from "@/hooks/useIndexHover";

export default function TechStack() {
  const { hovered, onEnter, onLeave } = useIndexHover();

  return (
    <section id="stack" className={styles.section}>
      <div className={styles.sectionHead}>
        <h2 className={styles.kicker}>Tech stack</h2>
        <div className={styles.rule} />
        <span className={styles.tail}>Six tools, daily</span>
      </div>
      <div className={styles.grid}>
        {TOOLS.map((t, i) => {
          const on = hovered === i;
          const mask = `url(${t.icon}) center / contain no-repeat`;
          return (
            <div
              key={t.name}
              className={styles.tile}
              style={{ animationDelay: `${i * 70}ms` }}
              onMouseEnter={() => onEnter(i)}
              onMouseLeave={() => onLeave(i)}
            >
              <div className={`${styles.sweep} ${on ? styles.on : ""}`} />
              <div
                className={`${styles.ghost} ${on ? styles.on : ""}`}
                style={{ WebkitMask: mask, mask }}
              />
              <div
                className={`${styles.icon} ${on ? styles.on : ""}`}
                style={{ WebkitMask: mask, mask }}
              />
              <h3 className={`${styles.title} ${on ? styles.on : ""}`}>{t.name}</h3>
              <p className={`${styles.sub} ${on ? styles.on : ""}`}>{t.kind}</p>
            </div>
          );
        })}
      </div>
    </section>
  );
}
