import styles from "./Experience.module.css";
import { ROLES } from "@/lib/data";

/** Roles, newest first, on a line that draws itself down as you read
 * (useScrollMotion sets --drawn and data-reached). */
export default function Experience() {
  return (
    <section id="experience" aria-labelledby="experience-title">
      <div className="secHead">
        <h2 id="experience-title">Experience</h2>
      </div>
      <ol className={styles.timeline} data-timeline>
        {ROLES.map((r) => (
          <li key={r.span} className={styles.step} data-step>
            <span className={styles.date}>{r.span}</span>
            <div className={styles.main}>
              <h3>{r.title}</h3>
              <p className={styles.org}>
                {r.company}, {r.kind.toLowerCase()}
              </p>
              <ul>
                {r.bullets.map((b) => (
                  <li key={b}>{b}</li>
                ))}
              </ul>
            </div>
          </li>
        ))}
      </ol>
    </section>
  );
}
