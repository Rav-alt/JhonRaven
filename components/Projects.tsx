"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import styles from "./Projects.module.css";
import { PROJECTS, type Project, type ProjectClip } from "@/lib/data";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";

function StatusBadge({ project, className }: { project: Project; className?: string }) {
  return (
    <span className={[styles.badge, project.ended ? styles.badgeEnded : "", className ?? ""].join(" ")}>
      {!project.ended && <span className={styles.badgeDot} />}
      {project.status}
    </span>
  );
}

/** Silent demo loops. Autoplays muted (required by iOS/Chrome), but never for
 * visitors who ask for reduced motion, and always has a visible pause control
 * since the loops run longer than five seconds (WCAG 2.2.2). */
function ClipPlayer({ clips, title }: { clips: ProjectClip[]; title: string }) {
  const [index, setIndex] = useState(0);
  const [playing, setPlaying] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const clip = clips[index];

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) return;
    // play() rejects if the browser still blocks it; the poster + Play button remain.
    video.play().catch(() => setPlaying(false));
  }, [index]);

  const toggle = () => {
    const video = videoRef.current;
    if (!video) return;
    if (video.paused) video.play().catch(() => setPlaying(false));
    else video.pause();
  };

  return (
    <div className={styles.player}>
      <div className={styles.playerFrame}>
        <video
          key={clip.src}
          ref={videoRef}
          className={styles.video}
          poster={clip.poster}
          muted
          loop
          playsInline
          preload="metadata"
          aria-label={`${title} demo: ${clip.caption}`}
          onPlay={() => setPlaying(true)}
          onPause={() => setPlaying(false)}
        >
          <source src={clip.src} type="video/mp4" />
          <source src={clip.webm} type="video/webm" />
          Your browser can&apos;t play this video.
        </video>
      </div>

      <div className={styles.playerBar}>
        <button type="button" className={styles.playBtn} onClick={toggle} aria-label={playing ? "Pause demo" : "Play demo"}>
          {playing ? (
            <svg viewBox="0 0 12 12" aria-hidden="true"><path d="M3 2h2v8H3zM7 2h2v8H7z" /></svg>
          ) : (
            <svg viewBox="0 0 12 12" aria-hidden="true"><path d="M3 1.5v9l7.5-4.5z" /></svg>
          )}
        </button>

        <div className={styles.clipTabs} role="group" aria-label="Demo clips">
          {clips.map((c, i) => (
            <button
              key={c.src}
              type="button"
              className={styles.clipTab}
              aria-pressed={i === index}
              onClick={() => setIndex(i)}
            >
              <span className={styles.clipNum}>{String(i + 1).padStart(2, "0")}</span>
              {c.label}
            </button>
          ))}
        </div>

        <p className={styles.clipCaption}>{clip.caption}</p>
      </div>
    </div>
  );
}

export default function Projects() {
  const [openId, setOpenId] = useState<string | null>(null);
  const project = PROJECTS.find((p) => p.id === openId) ?? null;

  return (
    <section id="work" className={styles.section}>
      <div className={styles.sectionHead}>
        <h2 className={styles.kicker}>Projects</h2>
        <div className={styles.rule} />
        <span className={styles.tail}>Shipped &amp; self-built</span>
      </div>

      <div className={styles.grid}>
        {PROJECTS.map((p) => (
          <button key={p.id} className={styles.tile} onClick={() => setOpenId(p.id)}>
            <span className={styles.thumb}>
              <Image src={p.thumb.src} alt={p.thumb.alt} fill sizes="280px" />
              <span className={styles.thumbScrim} />
              <StatusBadge project={p} className={styles.thumbBadge} />
              {p.media.kind === "video" && <span className={styles.thumbVideo}>Video</span>}
            </span>
            <span className={styles.tileBody}>
              <span className={styles.tileNames}>
                <span className={styles.tileName}>{p.name}</span>
                <span className={styles.tileCompany}>{p.owner}</span>
              </span>
              <span className={styles.tileOpen}>Open →</span>
            </span>
          </button>
        ))}
      </div>

      <Dialog open={project !== null} onOpenChange={(o) => !o && setOpenId(null)}>
        {project && (
          <DialogContent
            showCloseButton={false}
            overlayClassName={styles.backdrop}
            className={styles.modal}
            aria-describedby={undefined}
          >
            <figure style={{ margin: 0 }}>
              <div className={styles.modalBar}>
                <div className={styles.modalDots}>
                  <span className={styles.modalDot} />
                  <span className={styles.modalDot} />
                  <span className={styles.modalDot} />
                </div>
                <span className={styles.modalUrl}>{project.chrome}</span>
                <button className={styles.closeBtn} onClick={() => setOpenId(null)} aria-label="Close">
                  ×
                </button>
              </div>
              {project.media.kind === "video" ? (
                <ClipPlayer clips={project.media.clips} title={project.name} />
              ) : (
                <div className={styles.modalShot}>
                  <Image src={project.media.src} alt={project.media.alt} fill sizes="1020px" />
                  <div className={styles.modalShotScrim} />
                </div>
              )}
            </figure>

            <div className={styles.modalBody}>
              <div className={styles.modalMain}>
                <div className={styles.modalTags}>
                  <StatusBadge project={project} />
                  <span className={styles.modalRole}>{project.role}</span>
                </div>
                <div className={styles.modalTitleRow}>
                  <DialogTitle className={styles.modalTitle}>{project.name}</DialogTitle>
                  <div className={styles.modalCompany}>{project.owner}</div>
                </div>
                {project.description.map((para) => (
                  <p key={para.slice(0, 24)} className={styles.modalDesc}>
                    {para}
                  </p>
                ))}
                <div className={styles.modalChips}>
                  {project.stack.map((t) => (
                    <span key={t} className={styles.chip}>
                      {t}
                    </span>
                  ))}
                </div>
              </div>
              <div className={styles.facts}>
                {project.facts.map((f) => (
                  <div key={f.k} className={styles.fact}>
                    <span className={styles.factLabel}>{f.k}</span>
                    <span className={styles.factValue}>{f.v}</span>
                  </div>
                ))}
              </div>
            </div>
          </DialogContent>
        )}
      </Dialog>
    </section>
  );
}
