import styles from "./Stack.module.css";
import { STACK } from "@/lib/data";

export default function Stack() {
  return (
    <section id="stack" aria-labelledby="stack-title">
      <div className="secHead">
        <h2 id="stack-title">Stack</h2>
        <p>What I reach for, grouped by job</p>
      </div>
      <dl className={styles.stack}>
        {STACK.map((g) => (
          <div key={g.group}>
            <dt>{g.group}</dt>
            <dd>{g.items.join(", ")}</dd>
          </div>
        ))}
      </dl>
    </section>
  );
}
