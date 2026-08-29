import styles from "./Experience.module.css";
import { ROLES } from "@/lib/data";

export default function Experience() {
  return (
    <section id="experience" className={styles.section}>
      <div className={styles.sectionHead}>
        <h2 className={styles.kicker}>Experience</h2>
        <div className={styles.rule} />
      </div>
      <div className={styles.grid}>
        <div className={styles.intro}>
          <div className={styles.introTitle}>One company, two seats</div>
          <p className={styles.introText}>
            I joined Grid Property Ventures as an intern and stayed on to own the front end.
            Small team, real traffic, short feedback loops.
          </p>
        </div>

        <div className={styles.roles}>
          {ROLES.map((r) => (
            <div
              key={r.title}
              className={`${styles.role} ${r.current ? styles.roleCurrent : styles.roleFlat}`}
            >
              <div className={`${styles.rail} ${r.current ? styles.railCurrent : ""}`} />
              <div className={styles.roleHead}>
                <div className={styles.roleTitleCol}>
                  <div className={styles.roleTitleRow}>
                    <span className={`${styles.mark} ${r.current ? styles.markCurrent : ""}`} />
                    <span className={styles.roleTitle}>{r.title}</span>
                  </div>
                  <div className={styles.roleCompanyRow}>
                    {r.company}
                    <span className={styles.roleKind}>{r.kind}</span>
                  </div>
                </div>
                <div className={styles.roleMeta}>
                  {r.current && (
                    <span className={styles.currentBadge}>
                      <span className={styles.currentDot} />
                      Current
                    </span>
                  )}
                  <span className={styles.span}>{r.span}</span>
                </div>
              </div>

              <div className={styles.bullets}>
                {r.bullets.map((b) => (
                  <div key={b} className={styles.bullet}>
                    <span className={styles.bulletMark} />
                    <span className={styles.bulletText}>{b}</span>
                  </div>
                ))}
              </div>

              <div className={styles.stack}>
                {r.stack.map((t) => (
                  <span key={t} className={styles.chip}>
                    {t}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
