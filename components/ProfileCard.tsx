"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import styles from "./ProfileCard.module.css";
import { PROJECTS, RESUME_PATH, ROLES } from "@/lib/data";

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

/** GitHub-style profile with spec-sheet rows: live Manila time, what he's
 *  building, last role, résumé. Facts come from lib/data.ts. */
export default function ProfileCard({ name, handle }: { name: string; handle: string }) {
  const time = useManilaTime();
  const building = PROJECTS.find((p) => !p.ended) ?? PROJECTS[0];
  const lastRole = ROLES[0];

  return (
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
  );
}
