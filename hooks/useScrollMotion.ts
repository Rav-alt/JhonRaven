"use client";

import { useLayoutEffect } from "react";

/**
 * Every scroll-linked effect on the page, driven from one rAF-throttled
 * scroll handler so they never fight each other:
 *
 * 1. The name docks. The hero <h1> is pinned with position: fixed and, as you
 *    scroll from the top to the start of the main layout, it translates and
 *    scales from its hero spot into the sidebar slot. The hero keeps a spacer
 *    of the same height so nothing jumps.
 * 2. Project frames grow from 90% to full size as they enter, and the
 *    screenshot inside drifts a few percent against the frame.
 * 3. The experience timeline draws its line down as you read and fills each
 *    dot it reaches.
 *
 * Elements opt in through data attributes, so components stay free of
 * motion code. With reduced motion on, the name stays in the hero, frames
 * stay still and the timeline is drawn in full.
 *
 * Also plays the one page-load moment: the two lines of the name rise in.
 */
export function useScrollMotion() {
  useLayoutEffect(() => {
    const root = document.documentElement;
    const rm = window.matchMedia("(prefers-reduced-motion: reduce)");
    const q = <T extends HTMLElement>(sel: string) => document.querySelector<T>(sel);

    const name = q("[data-dock-name]");
    const heroSlot = q("[data-dock-hero-slot]");
    const slot = q("[data-dock-slot]");
    const side = q("[data-dock-side]");
    const layout = q("[data-dock-layout]");
    const band = q("[data-dock-band]");
    const frames = Array.from(document.querySelectorAll<HTMLElement>("[data-frame]"));
    const timeline = q("[data-timeline]");
    const steps = timeline ? Array.from(timeline.querySelectorAll<HTMLElement>("[data-step]")) : [];

    const clamp = (v: number, a = 0, b = 1) => Math.min(b, Math.max(a, v));
    const ease = (t: number) => 1 - Math.pow(1 - t, 3);

    let docking = false;
    let heroFont = 1;
    let slotFont = 1;
    let dockAt = 1;

    function measure() {
      if (!name || !heroSlot || !slot || !side || !layout) return;
      docking = !rm.matches;
      root.classList.toggle("docking", docking);
      if (!docking) {
        name.style.transform = "";
        heroSlot.style.height = "";
        if (band) band.style.opacity = "";
        return;
      }
      heroSlot.style.height = `${name.offsetHeight}px`;
      heroFont = parseFloat(getComputedStyle(name).fontSize);
      slotFont = parseFloat(getComputedStyle(slot).fontSize);
      const stickyTop = parseFloat(getComputedStyle(side).top) || 0;
      dockAt = Math.max(1, layout.getBoundingClientRect().top + window.scrollY - stickyTop);
    }

    function dock() {
      if (!docking || !name || !heroSlot || !slot) return;
      const e = ease(clamp(window.scrollY / dockAt));
      const a = heroSlot.getBoundingClientRect();
      const b = slot.getBoundingClientRect();
      const s = 1 + (slotFont / heroFont - 1) * e;
      const x = a.left + (b.left - a.left) * e;
      const y = a.top + (b.top - a.top) * e;
      name.style.transform = `translate(${x}px, ${y}px) scale(${s})`;
      if (band) band.style.opacity = String(1 - clamp((e - 0.2) / 0.55) * 0.9);
    }

    function frameFx() {
      const vh = window.innerHeight;
      for (const f of frames) {
        const r = f.getBoundingClientRect();
        if (r.bottom < -100 || r.top > vh + 100) continue;
        const p = clamp((vh - r.top) / (vh + r.height));
        f.style.transform = `scale(${0.9 + 0.1 * ease(clamp(p * 2.1))})`;
        const screen = f.querySelector<HTMLElement>("[data-frame-screen]");
        if (screen) screen.style.transform = `translateY(${(0.5 - p) * 7}%)`;
      }
    }

    function timelineFx() {
      if (!timeline) return;
      const r = timeline.getBoundingClientRect();
      const t = rm.matches ? 1 : clamp((window.innerHeight * 0.65 - r.top) / r.height);
      timeline.style.setProperty("--drawn", String(t));
      for (const step of steps) {
        step.toggleAttribute("data-reached", (step.offsetTop + 8) / r.height <= t + 0.001);
      }
    }

    let ticking = false;
    function frame() {
      ticking = false;
      dock();
      if (!rm.matches) frameFx();
      timelineFx();
    }
    function onScroll() {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(frame);
    }
    function reset() {
      for (const f of frames) {
        f.style.transform = "";
        const screen = f.querySelector<HTMLElement>("[data-frame-screen]");
        if (screen) screen.style.transform = "";
      }
      measure();
      frame();
    }

    reset();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", reset);
    rm.addEventListener("change", reset);
    // Web fonts change the name's size; re-measure once they land.
    let alive = true;
    document.fonts?.ready.then(() => alive && reset());

    // Page-load moment: each line of the name rises out of its own mask,
    // then the intro text settles in under it.
    if (!rm.matches && name) {
      name.querySelectorAll<HTMLElement>("[data-line]").forEach((line, i) =>
        line.animate([{ transform: "translateY(105%)" }, { transform: "translateY(0)" }], {
          duration: 950,
          delay: 120 + i * 110,
          easing: "cubic-bezier(.2,.75,.1,1)",
          fill: "backwards",
        }),
      );
      band?.animate(
        [
          { opacity: 0, transform: "translateY(14px)" },
          { opacity: 1, transform: "none" },
        ],
        { duration: 700, delay: 520, easing: "ease-out", fill: "backwards" },
      );
    }

    return () => {
      alive = false;
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", reset);
      rm.removeEventListener("change", reset);
      root.classList.remove("docking");
    };
  }, []);
}
