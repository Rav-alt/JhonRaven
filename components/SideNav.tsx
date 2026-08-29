"use client";

import { useRef } from "react";
import Image from "next/image";
import styles from "./SideNav.module.css";
import { SIDE } from "@/lib/data";
import { letterSpreadOffsets } from "@/lib/letterSpread";
import { useIndexHover } from "@/hooks/useIndexHover";

export default function SideNav({ sideOn, activeSec }: { sideOn: boolean; activeSec: string }) {
  const { hovered, onEnter, onLeave } = useIndexHover();
  const thumbRefs = useRef<(HTMLDivElement | null)[]>([]);

  const onMove = (i: number) => (e: React.MouseEvent<HTMLAnchorElement>) => {
    const el = thumbRefs.current[i];
    if (!el) return;
    const r = e.currentTarget.getBoundingClientRect();
    const yPct = (e.clientY - r.top) / r.height - 0.5;
    const xPct = (e.clientX - r.left) / r.width - 0.5;
    el.style.top = `${r.height + 16 + yPct * 10}px`;
    el.style.left = `${56 + xPct * 10}px`;
  };

  return (
    <nav className={`${styles.rail} ${sideOn ? styles.on : ""}`} aria-label="Section navigation">
      {SIDE.map((s, i) => {
        const on = activeSec === s.id;
        const hov = hovered === i;
        const offsets = letterSpreadOffsets(s.label);
        const mask = `url(${s.icon}) center / contain no-repeat`;
        return (
          <a
            key={s.id}
            href={`#${s.id}`}
            title={s.label}
            className={styles.item}
            onMouseEnter={() => onEnter(i)}
            onMouseLeave={() => onLeave(i)}
            onMouseMove={onMove(i)}
          >
            <span className={`${styles.pill} ${on ? styles.on : ""}`} />
            <span
              className={`${styles.icon} ${on || hov ? styles.on : ""}`}
              style={{ WebkitMask: mask, mask }}
            />
            <span className={`${styles.label} ${hov ? styles.on : ""}`}>
              {s.label.split("").map((c, j) => (
                <span
                  key={j}
                  className={styles.labelLetter}
                  style={{
                    transitionDelay: `${j * 22}ms`,
                    transform: hov ? `translateX(${offsets[j].toFixed(2)}px)` : "none",
                  }}
                >
                  {c}
                </span>
              ))}
            </span>
            {s.img && (
              <div
                ref={(el) => {
                  thumbRefs.current[i] = el;
                }}
                className={`${styles.thumbWrap} ${hov ? styles.on : ""}`}
              >
                <Image src={s.img} alt="" fill sizes="104px" />
              </div>
            )}
          </a>
        );
      })}
    </nav>
  );
}
