"use client";

import styles from "./page.module.css";
import { useTheme } from "@/hooks/useTheme";
import { useScrollSpy } from "@/hooks/useScrollSpy";
import SideNav from "@/components/SideNav";
import Header from "@/components/Header";
import Hero from "@/components/Hero";
import About from "@/components/About";
import TechStack from "@/components/TechStack";
import Projects from "@/components/Projects";
import Experience from "@/components/Experience";
import Contact from "@/components/Contact";

const NAME = "Jhon Raven Cadiz";
const HANDLE = "@rav-alt";
const TAGLINE =
  "I build fast, careful interfaces for the web — and the systems that keep them consistent.";

export default function Home() {
  const { theme, toggleTheme } = useTheme();
  const { sideOn, activeSec } = useScrollSpy();

  return (
    <div className={styles.root}>
      <div className={styles.bgGrid} />
      <SideNav sideOn={sideOn} activeSec={activeSec} />

      <div className={styles.container}>
        <Header name={NAME} theme={theme} toggleTheme={toggleTheme} />
        <Hero name={NAME} handle={HANDLE} tagline={TAGLINE} theme={theme} />
        <About />
        <TechStack />
        <Projects />
        <Experience />
        <Contact name={NAME} theme={theme} />
      </div>
    </div>
  );
}
