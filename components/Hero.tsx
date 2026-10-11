import styles from "./Hero.module.css";
import { AVAILABILITY, LEDE, ROLES } from "@/lib/data";

/** The first screen: the name, set as large as the width allows, over a
 * short introduction. useScrollMotion docks the name into the sidebar as the
 * visitor scrolls; the empty slot keeps the hero's height while it does. */
export default function Hero({ name }: { name: string }) {
  // "Jhon Raven" / "Cadiz": the surname gets a line of its own.
  const words = name.split(" ");
  const lines = [words.slice(0, -1).join(" "), words[words.length - 1]];
  const last = ROLES[0];

  return (
    <header id="top" className={`${styles.hero} wrap`}>
      <div data-dock-hero-slot aria-hidden="true" />
      <h1 className={styles.name} data-dock-name>
        {lines.map((l) => (
          <span key={l} className={styles.line}>
            <span data-line>{l}</span>
          </span>
        ))}
      </h1>
      <div className={styles.band} data-dock-band>
        <div className={styles.main}>
          <p className={styles.lede}>{LEDE}</p>
          <dl className={styles.facts}>
            <div>
              <dt>Based in</dt>
              <dd>Manila, Philippines (GMT+8)</dd>
            </div>
            <div>
              <dt>Last role</dt>
              <dd>
                {last.title}, {last.company}
              </dd>
            </div>
            {AVAILABILITY.open && (
              <div>
                <dt>Looking for</dt>
                <dd>{AVAILABILITY.detail}</dd>
              </div>
            )}
          </dl>
          <div className={styles.actions}>
            <a className={styles.btn} href="#work">
              See my work
            </a>
            <a href="#contact">Get in touch</a>
          </div>
        </div>
      </div>
    </header>
  );
}
