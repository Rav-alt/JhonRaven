"use client";

import styles from "./page.module.css";
import { useScrollMotion } from "@/hooks/useScrollMotion";
import Hero from "@/components/Hero";
import Sidebar from "@/components/Sidebar";
import ProjectSection from "@/components/Projects";
import Experience from "@/components/Experience";
import Stack from "@/components/Stack";
import ContributionGraphCard from "@/components/ContributionGraph";
import Contact from "@/components/Contact";
import { NAME, PROJECTS } from "@/lib/data";
import type { ContributionGraph } from "@/lib/github";

const WORK = PROJECTS.filter((p) => p.group === "work");
const PERSONAL = PROJECTS.filter((p) => p.group === "personal");

export default function HomeClient({ graph }: { graph: ContributionGraph }) {
  useScrollMotion();

  return (
    <>
      <a className="skipLink" href="#main">
        Skip to content
      </a>
      <Hero name={NAME} />

      <div className={`${styles.layout} wrap`} data-dock-layout>
        <Sidebar name={NAME} />
        <main id="main" className={styles.main}>
          <ProjectSection
            id="work"
            title="Work"
            note="Shipped for an employer"
            projects={WORK}
          />
          <ProjectSection
            id="personal"
            title="Personal projects"
            note="Designed and built on my own"
            projects={PERSONAL}
          />
          <Experience />
          <Stack />
          <section id="activity" aria-labelledby="activity-title">
            <div className="secHead">
              <h2 id="activity-title">Activity</h2>
              <p>
                {graph.total.toLocaleString("en-US")} GitHub contributions in the last {graph.weeks.length} weeks
              </p>
            </div>
            <ContributionGraphCard graph={graph} />
          </section>
          <Contact />
        </main>
      </div>

      <footer className={`${styles.footer} wrap`}>
        <span>© 2026 {NAME}</span>
        <span>Manila, Philippines</span>
      </footer>
    </>
  );
}
