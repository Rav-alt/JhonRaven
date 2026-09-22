"use client";

import { useState } from "react";
import Image from "next/image";
import { FileDown } from "lucide-react";
import styles from "./Contact.module.css";
import { RESUME_PATH, SOCIALS } from "@/lib/data";
import { useIndexHover } from "@/hooks/useIndexHover";
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogTitle } from "@/components/ui/dialog";
import type { Theme } from "@/lib/data";

export default function Contact({ name, theme }: { name: string; theme: Theme }) {
  const { hovered, onEnter, onLeave } = useIndexHover();
  const [resumeOpen, setResumeOpen] = useState(false);
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
          <h2 className={styles.kicker}>
            <span className={styles.kickerLine} />
            Contact
          </h2>

          <div className={styles.headline}>
            <div className={styles.headlineText}>Open to front-end work and collaborations.</div>
            <a href="mailto:jhonravencadiz02@gmail.com" className={styles.email}>
              jhonravencadiz02@gmail.com
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
              const row = {
                className: styles.social,
                onMouseEnter: () => onEnter(i),
                onMouseLeave: () => onLeave(i),
              };
              const inner = (
                <>
                  <span className={`${styles.socialMark} ${on ? styles.on : ""}`} />
                  <span className={styles.socialLabel}>{s.label}</span>
                  <span className={styles.socialHandle}>{s.handle}</span>
                  <span className={`${styles.socialArrow} ${on ? styles.on : ""}`}>→</span>
                </>
              );
              return s.href === RESUME_PATH ? (
                <button key={s.label} type="button" {...row} onClick={() => setResumeOpen(true)}>
                  {inner}
                </button>
              ) : (
                <a key={s.label} href={s.href} target="_blank" rel="noopener noreferrer" {...row}>
                  {inner}
                </a>
              );
            })}
          </div>

          <Dialog open={resumeOpen} onOpenChange={setResumeOpen}>
            <DialogContent showCloseButton={false} overlayClassName={styles.backdrop} className={styles.modal}>
              <span className={styles.modalKicker}>
                <FileDown size={14} aria-hidden />
                Resume · PDF
              </span>
              <DialogTitle className={styles.modalTitle}>Download my resume?</DialogTitle>
              <DialogDescription className={styles.modalDesc}>
                A two-page PDF covering my work at GRID, projects, and stack.
              </DialogDescription>
              <div className={styles.modalActions}>
                <DialogClose className={styles.modalCancel}>Not now</DialogClose>
                <a
                  href={RESUME_PATH}
                  download
                  className={styles.modalConfirm}
                  onClick={() => setResumeOpen(false)}
                >
                  Yes, download
                </a>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <div className={styles.footer}>
        <span>© 2026 {name}</span>
        <span>Manila, Philippines</span>
      </div>
    </section>
  );
}
