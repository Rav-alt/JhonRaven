"use client";

import { useLayoutEffect, useRef, useState } from "react";
import Image from "next/image";
import styles from "./Projects.module.css";
import type { Project, ProjectClip } from "@/lib/data";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";

const GROW = "cubic-bezier(.2,.75,.1,1)";

/** What the frame's button says it will show. */
function openLabel(p: Project) {
  if (p.media.kind === "image") return "View screenshot";
  const { clips } = p.media;
  return clips.length > 1 ? `Watch ${clips.length} clips` : `Watch ${clips[0].label.toLowerCase()}`;
}

/** Transform that maps `to` back onto `from`, for growing the modal out of
 * the frame that opened it (and shrinking it back on close). */
function flip(from: DOMRect, to: DOMRect) {
  return `translate(${from.left - to.left}px, ${from.top - to.top}px) scale(${from.width / to.width}, ${from.height / to.height})`;
}

const reduced = () => window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/** Demo loops. Autoplays muted (required by iOS and Chrome), but never for
 * visitors who ask for reduced motion, and always has a visible pause control
 * since the loops run longer than five seconds (WCAG 2.2.2). Clips with a
 * soundtrack get a sound button; sound only ever starts on a visitor's tap. */
function ClipPlayer({ clips, title }: { clips: ProjectClip[]; title: string }) {
  const [index, setIndex] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [muted, setMuted] = useState(true);
  const videoRef = useRef<HTMLVideoElement>(null);
  const clip = clips[index];

  useLayoutEffect(() => {
    const video = videoRef.current;
    if (!video || reduced()) return;
    // play() rejects if the browser still blocks it; the poster and Play button remain.
    video.play().catch(() => setPlaying(false));
  }, [index]);

  const toggle = () => {
    const video = videoRef.current;
    if (!video) return;
    if (video.paused) video.play().catch(() => setPlaying(false));
    else video.pause();
  };

  const toggleSound = () => {
    const video = videoRef.current;
    if (!video) return;
    video.muted = !video.muted;
    setMuted(video.muted);
    // Turning sound on is a request to hear it, so start playback too.
    if (!video.muted && video.paused) video.play().catch(() => setPlaying(false));
  };

  const pick = (i: number) => {
    setIndex(i);
    setMuted(true); // the next clip mounts a fresh, muted <video>
  };

  return (
    <>
      <div className={styles.stage}>
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
      <div className={styles.controls}>
        <button type="button" className={styles.pill} onClick={toggle}>
          {playing ? "Pause" : "Play"}
        </button>
        {clip.audio && (
          <button type="button" className={styles.pill} onClick={toggleSound} aria-pressed={!muted}>
            {muted ? "Turn sound on" : "Turn sound off"}
          </button>
        )}
        {clips.length > 1 && (
          <div className={styles.clipTabs} role="group" aria-label="Clips">
            {clips.map((c, i) => (
              <button key={c.src} type="button" className={styles.pill} aria-pressed={i === index} onClick={() => pick(i)}>
                {c.label}
              </button>
            ))}
          </div>
        )}
      </div>
      <p className={styles.caption}>{clip.caption}</p>
    </>
  );
}

function ProjectEntry({ project, onOpen }: { project: Project; onOpen: (el: HTMLElement) => void }) {
  const p = project;
  return (
    <article className={styles.entry}>
      <div className={styles.entryHead}>
        <div>
          <h3>{p.name}</h3>
          <p>{p.owner}</p>
        </div>
        <span>{p.status}</span>
      </div>
      <button
        type="button"
        className={styles.frame}
        data-frame
        onClick={(e) => onOpen(e.currentTarget)}
        aria-label={`${openLabel(p)}: ${p.name}`}
      >
        <span className={styles.screen} data-frame-screen>
          <Image
            src={p.thumb.src}
            alt=""
            fill
            sizes="(min-width: 1360px) 900px, (min-width: 860px) 66vw, 92vw"
            className={p.thumb.fit === "contain" ? styles.contain : styles.cover}
          />
        </span>
        <span className={styles.open}>{openLabel(p)}</span>
      </button>
      <div className={styles.entryBody}>
        <p>{p.description[0]}</p>
        <dl>
          <div>
            <dt>Built with</dt>
            <dd>{p.stack.join(", ")}</dd>
          </div>
          <div>
            <dt>{p.href ? "Live at" : "Role"}</dt>
            <dd>
              {p.href ? (
                <a href={p.href} target="_blank" rel="noopener noreferrer">
                  {p.chrome}
                  <span className="srOnly"> (opens in a new tab)</span>
                </a>
              ) : (
                p.role
              )}
            </dd>
          </div>
        </dl>
      </div>
    </article>
  );
}

/** One titled list of projects (Work, or Personal projects) and the modal
 * its frames open. */
export default function ProjectSection({
  id,
  title,
  note,
  projects,
}: {
  id: string;
  title: string;
  note: string;
  projects: Project[];
}) {
  const [openId, setOpenId] = useState<string | null>(null);
  const [closing, setClosing] = useState(false);
  const originRef = useRef<HTMLElement | null>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const project = projects.find((p) => p.id === openId) ?? null;

  // Grow the modal out of the frame that was clicked.
  useLayoutEffect(() => {
    const el = contentRef.current;
    const from = originRef.current;
    if (!openId || !el || !from || reduced()) return;
    el.animate(
      [
        { transform: flip(from.getBoundingClientRect(), el.getBoundingClientRect()), opacity: 0.4 },
        { transform: "none", opacity: 1 },
      ],
      { duration: 460, easing: GROW },
    );
  }, [openId]);

  const open = (p: Project, el: HTMLElement) => {
    originRef.current = el;
    setClosing(false);
    setOpenId(p.id);
  };

  // Shrink back into the frame, then unmount. Escape, the backdrop and the
  // close button all come through here.
  const close = () => {
    const el = contentRef.current;
    const to = originRef.current;
    if (closing) return;
    if (!el || !to || reduced()) {
      setOpenId(null);
      return;
    }
    setClosing(true);
    const anim = el.animate(
      [
        { transform: "none", opacity: 1 },
        { transform: flip(to.getBoundingClientRect(), el.getBoundingClientRect()), opacity: 0 },
      ],
      { duration: 320, easing: "cubic-bezier(.4,0,.6,1)", fill: "forwards" },
    );
    anim.onfinish = () => {
      setOpenId(null);
      setClosing(false);
    };
  };

  return (
    <section id={id} className={styles.section} aria-labelledby={`${id}-title`}>
      <div className="secHead">
        <h2 id={`${id}-title`}>{title}</h2>
        <p>{note}</p>
      </div>
      <div className={styles.list}>
        {projects.map((p) => (
          <ProjectEntry key={p.id} project={p} onOpen={(el) => open(p, el)} />
        ))}
      </div>

      <Dialog open={project !== null} onOpenChange={(o) => !o && close()}>
        {project && (
          <DialogContent
            ref={contentRef}
            showCloseButton={false}
            overlayClassName={`${styles.backdrop} ${closing ? styles.backdropOut : ""}`}
            className={styles.modal}
            aria-describedby={undefined}
          >
            <div className={styles.bar}>
              <span className={styles.chrome}>
                {project.href ? (
                  <a href={project.href} target="_blank" rel="noopener noreferrer">
                    {project.chrome}
                    <span aria-hidden="true"> ↗</span>
                    <span className="srOnly"> (opens in a new tab)</span>
                  </a>
                ) : (
                  project.chrome
                )}
              </span>
              <button type="button" className={styles.close} onClick={close} aria-label="Close">
                ×
              </button>
            </div>

            {project.media.kind === "video" ? (
              <ClipPlayer clips={project.media.clips} title={project.name} />
            ) : (
              <div className={styles.stage}>
                <Image src={project.media.src} alt={project.media.alt} fill sizes="1000px" className={styles.contain} />
              </div>
            )}

            <div className={styles.modalBody}>
              <div className={styles.modalMain}>
                <DialogTitle className={styles.modalTitle}>{project.name}</DialogTitle>
                <p className={styles.modalMeta}>
                  {project.owner}. {project.role}.
                </p>
                {project.description.map((para) => (
                  <p key={para.slice(0, 24)}>{para}</p>
                ))}
              </div>
              <dl className={styles.facts}>
                {project.facts.map((f) => (
                  <div key={f.k}>
                    <dt>{f.k}</dt>
                    <dd>{f.v}</dd>
                  </div>
                ))}
                <div>
                  <dt>Built with</dt>
                  <dd>{project.stack.join(", ")}</dd>
                </div>
              </dl>
            </div>
          </DialogContent>
        )}
      </Dialog>
    </section>
  );
}
