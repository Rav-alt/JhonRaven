"use client";

import { useLayoutEffect, useRef, useState } from "react";
import styles from "./ContributionGraph.module.css";
import type { ContributionDay, ContributionGraph } from "@/lib/github";

// Jhon Raven's real GitHub activity (see lib/github.ts). Lives in the About
// section as "Fig. 1"; moved out of the Hero so the Hero stays about the
// person and the Pokémon.

const LEGEND = [0, 1, 2, 3, 4];

// GitHub's columns run Sun→Sat, so the Mon/Wed/Fri labels sit on rows 1/3/5.
const DAY_LABELS = ["", "Mon", "", "Wed", "", "Fri", ""];

const MONTHS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

function ordinal(n: number) {
  const v = n % 100;
  if (v >= 11 && v <= 13) return `${n}th`;
  return `${n}${["th", "st", "nd", "rd"][n % 10] ?? "th"}`;
}

/** "5 contributions on September 12th." — GitHub's own tooltip wording.
 *  Parsed from the YYYY-MM-DD string so no time zone can shift the day. */
function describeDay(day: ContributionDay) {
  const month = MONTHS[Number(day.date.slice(5, 7)) - 1];
  const date = `${month} ${ordinal(Number(day.date.slice(8, 10)))}`;
  const what =
    day.count === 0 ? "No contributions" : `${day.count} contribution${day.count === 1 ? "" : "s"}`;
  return `${what} on ${date}.`;
}

type Active = { wi: number; di: number };

export default function ContributionGraphCard({ graph }: { graph: ContributionGraph }) {
  const { weeks } = graph;
  const cardRef = useRef<HTMLDivElement>(null);
  const tipRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState<Active | null>(null);
  const [pos, setPos] = useState({ x: 0, y: 0, arrow: 0 });

  const activeDay = active ? weeks[active.wi]?.[active.di] : undefined;

  // Place the tip above the active cell, then clamp it inside the card so it
  // never spills off-screen at the grid's edges; the arrow stays on the cell.
  useLayoutEffect(() => {
    if (!active) return;
    const card = cardRef.current;
    const tip = tipRef.current;
    const cell = card?.querySelector<HTMLElement>(`[data-cell="${active.wi}-${active.di}"]`);
    if (!card || !tip || !cell) return;
    const c = card.getBoundingClientRect();
    const r = cell.getBoundingClientRect();
    const center = r.left - c.left + r.width / 2;
    const half = tip.offsetWidth / 2;
    const x = Math.min(Math.max(center, half + 6), c.width - half - 6);
    setPos({ x, y: r.top - c.top, arrow: center - x });
  }, [active]);

  const move = (e: React.KeyboardEvent) => {
    const cur = active ?? lastCell(weeks);
    let { wi, di } = cur;
    switch (e.key) {
      case "ArrowLeft": wi -= 1; break;
      case "ArrowRight": wi += 1; break;
      case "ArrowUp": di -= 1; break;
      case "ArrowDown": di += 1; break;
      case "Home": wi = 0; break;
      case "End": ({ wi, di } = lastCell(weeks)); break;
      case "Escape": setActive(null); return;
      default: return;
    }
    e.preventDefault();
    wi = Math.min(Math.max(wi, 0), weeks.length - 1);
    di = Math.min(Math.max(di, 0), weeks[wi].length - 1); // last week may be partial
    setActive({ wi, di });
  };

  return (
    <div ref={cardRef} className={styles.graphCard}>
      <div className={styles.graphHeader}>
        <div className={styles.graphCount}>
          <span className={styles.graphCountNum}>{graph.total.toLocaleString("en-US")}</span>
          <span className={styles.graphCountLabel}>contributions</span>
        </div>
        <div className={styles.graphSpan}>last {weeks.length} weeks</div>
      </div>
      <div className={styles.graphBody}>
        <div className={styles.graphDays} aria-hidden="true">
          {DAY_LABELS.map((d, i) => (
            <span key={i}>{d}</span>
          ))}
        </div>
        <div className={styles.graphMain}>
          <div className={styles.graphMonths} aria-hidden="true">
            {graph.months.map((m, mi) => (
              <span key={mi}>{m}</span>
            ))}
          </div>
          <div
            className={styles.graphWeeks}
            role="group"
            tabIndex={0}
            aria-label="Contribution calendar. Use the arrow keys to read each day."
            onFocus={() => setActive((a) => a ?? lastCell(weeks))}
            onBlur={() => setActive(null)}
            onKeyDown={move}
            onMouseLeave={() => setActive(null)}
          >
            {weeks.map((week, wi) => (
              <div key={wi} className={styles.graphWeek}>
                {week.map((day, di) => (
                  <div
                    key={day.date}
                    data-cell={`${wi}-${di}`}
                    data-active={active?.wi === wi && active?.di === di ? "" : undefined}
                    className={styles.graphCell}
                    style={{ background: `var(--ramp-${day.level})` }}
                    onMouseEnter={() => setActive({ wi, di })}
                  />
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className={styles.graphLegend} aria-hidden="true">
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

      <div
        ref={tipRef}
        className={styles.graphTip}
        data-show={activeDay ? "" : undefined}
        aria-hidden="true"
        style={
          {
            left: pos.x,
            top: pos.y,
            "--arrow-x": `${pos.arrow}px`,
          } as React.CSSProperties
        }
      >
        {activeDay ? describeDay(activeDay) : ""}
      </div>
      <span className={styles.srOnly} aria-live="polite">
        {activeDay ? describeDay(activeDay) : ""}
      </span>
    </div>
  );
}

function lastCell(weeks: ContributionDay[][]): Active {
  const wi = weeks.length - 1;
  return { wi, di: Math.max(0, weeks[wi].length - 1) };
}
