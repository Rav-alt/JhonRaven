"use client";

import { useState } from "react";
import Image from "next/image";
import styles from "./Projects.module.css";
import { GRID_FACTS, GRID_STACK } from "@/lib/data";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";

export default function Projects() {
  const [open, setOpen] = useState(false);

  return (
    <section id="work" className={styles.section}>
      <div className={styles.sectionHead}>
        <h2 className={styles.kicker}>Projects</h2>
        <div className={styles.rule} />
        <span className={styles.tail}>One, in production</span>
      </div>

      <div className={styles.grid}>
        <button className={styles.tile} onClick={() => setOpen(true)}>
          <span className={styles.thumb}>
            <Image src="/images/grid-screenshot.png" alt="Grid platform screenshot" fill sizes="280px" />
            <span className={styles.thumbScrim} />
            <span className={`${styles.badge} ${styles.thumbBadge}`}>
              <span className={styles.badgeDot} />
              Current work
            </span>
          </span>
          <span className={styles.tileBody}>
            <span className={styles.tileNames}>
              <span className={styles.tileName}>Grid</span>
              <span className={styles.tileCompany}>Grid Property Ventures</span>
            </span>
            <span className={styles.tileOpen}>Open →</span>
          </span>
        </button>
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent
          showCloseButton={false}
          overlayClassName={styles.backdrop}
          className={styles.modal}
        >
          <figure style={{ margin: 0 }}>
            <div className={styles.modalBar}>
              <div className={styles.modalDots}>
                <span className={styles.modalDot} />
                <span className={styles.modalDot} />
                <span className={styles.modalDot} />
              </div>
              <span className={styles.modalUrl}>grid.com.ph</span>
              <button className={styles.closeBtn} onClick={() => setOpen(false)} aria-label="Close">
                ×
              </button>
            </div>
            <div className={styles.modalShot}>
              <Image src="/images/grid-screenshot.png" alt="Grid platform screenshot" fill sizes="1020px" />
              <div className={styles.modalShotScrim} />
            </div>
          </figure>

          <div className={styles.modalBody}>
            <div className={styles.modalMain}>
              <div className={styles.modalTags}>
                <span className={styles.badge}>
                  <span className={styles.badgeDot} />
                  Current work
                </span>
                <span className={styles.modalRole}>Front end developer</span>
              </div>
              <div className={styles.modalTitleRow}>
                <DialogTitle className={styles.modalTitle}>Grid</DialogTitle>
                <div className={styles.modalCompany}>Grid Property Ventures</div>
              </div>
              <p className={styles.modalDesc}>
                A real estate property listing platform where I work as a Front End Developer,
                maintaining and improving the platform while building new features. My work
                includes developing UI components, fixing bugs, improving existing
                functionality, and occasionally contributing to backend development.
              </p>
              <div className={styles.modalChips}>
                {GRID_STACK.map((t) => (
                  <span key={t} className={styles.chip}>
                    {t}
                  </span>
                ))}
              </div>
            </div>
            <div className={styles.facts}>
              {GRID_FACTS.map((f) => (
                <div key={f.k} className={styles.fact}>
                  <span className={styles.factLabel}>{f.k}</span>
                  <span className={styles.factValue}>{f.v}</span>
                </div>
              ))}
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </section>
  );
}
