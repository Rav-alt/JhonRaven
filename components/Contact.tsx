"use client";

import { useRef, useState } from "react";
import styles from "./Contact.module.css";
import { EMAIL, RESUME_PATH, SOCIALS } from "@/lib/data";

export default function Contact() {
  const [note, setNote] = useState("");
  const mailRef = useRef<HTMLAnchorElement>(null);

  // Copy the address; if the clipboard is blocked, select it so Ctrl+C works.
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(EMAIL);
      setNote("Email copied");
    } catch {
      const el = mailRef.current;
      if (!el) return;
      const range = document.createRange();
      range.selectNodeContents(el);
      const sel = window.getSelection();
      sel?.removeAllRanges();
      sel?.addRange(range);
      setNote("Selected. Press Ctrl+C to copy.");
    }
  };

  return (
    <section id="contact" aria-labelledby="contact-title">
      <div className="secHead">
        <h2 id="contact-title">Contact</h2>
        <p>I reply within a day or two</p>
      </div>
      <a ref={mailRef} href={`mailto:${EMAIL}`} className={styles.mail}>
        {EMAIL}
      </a>
      <div className={styles.row}>
        <button type="button" className={styles.copy} onClick={copy}>
          Copy email
        </button>
        {SOCIALS.map((s) => (
          <a key={s.label} href={s.href} target="_blank" rel="noopener noreferrer">
            {s.label}
          </a>
        ))}
        <a href={RESUME_PATH} target="_blank" rel="noopener noreferrer">
          Résumé (PDF)
        </a>
        <span className={styles.note} aria-live="polite">
          {note}
        </span>
      </div>
    </section>
  );
}
