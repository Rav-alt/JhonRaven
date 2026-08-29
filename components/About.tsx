import styles from "./About.module.css";

const FACTS = [
  { label: "Based in", value: "Manila, Philippines", accent: true },
  { label: "Education", value: "ComSci Graduate", accent: false },
  { label: "Motto", value: "money no me", accent: false },
];

export default function About() {
  return (
    <section id="about" className={styles.section}>
      <div className={styles.sectionHead}>
        <h2 className={styles.kicker}>About Me</h2>
        <div className={styles.rule} />
      </div>

      <div className={styles.grid}>
        <div className={styles.facts}>
          {FACTS.map((f) => (
            <div key={f.label} className={styles.fact}>
              <span className={`${styles.factMark} ${f.accent ? styles.accent : ""}`} />
              <div className={styles.factBody}>
                <span className={styles.factLabel}>{f.label}</span>
                <span className={styles.factValue}>{f.value}</span>
              </div>
            </div>
          ))}
        </div>

        <div className={styles.cards}>
          <div className={`${styles.card} ${styles.cardRaised}`}>
            <div className={styles.cardKickerRaised}>Off the clock</div>
            <p className={styles.cardTextRaised}>
              I enjoy making weird little projects and turning random ideas into something real.
            </p>
          </div>
          <div className={`${styles.card} ${styles.cardFlat}`}>
            <div className={styles.cardKickerFlat}>On the clock</div>
            <p className={styles.cardTextFlat}>
              I might not know everything, but I&rsquo;ll learn what I need, solve the problem, and ship it.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
