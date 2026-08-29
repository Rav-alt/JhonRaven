"use client";

import { useEffect, useRef, useState } from "react";
import { SIDE } from "@/lib/data";

/** Drives the side icon-rail: whether it's visible (scrolled past the hero,
 * and only on wide viewports) and which section is currently "active". */
export function useScrollSpy() {
  const [sideOn, setSideOn] = useState(false);
  const [activeSec, setActiveSec] = useState(SIDE[0].id);
  const raf = useRef<number | null>(null);
  const activeSecRef = useRef(activeSec);

  useEffect(() => {
    const update = () => {
      raf.current = null;
      const on = window.scrollY > window.innerHeight * 0.6 && window.innerWidth >= 1440;
      let active = activeSecRef.current;
      for (const s of SIDE) {
        const el = document.getElementById(s.id);
        if (el && el.getBoundingClientRect().top <= window.innerHeight * 0.4) {
          active = s.id;
        }
      }
      setSideOn(on);
      setActiveSec(active);
      activeSecRef.current = active;
    };

    const onScroll = () => {
      if (raf.current) return;
      raf.current = requestAnimationFrame(update);
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    update();

    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (raf.current) cancelAnimationFrame(raf.current);
    };
  }, []);

  return { sideOn, activeSec };
}
