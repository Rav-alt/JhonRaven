"use client";

import { useCallback, useState } from "react";

/** Tracks which index in a list is currently hovered (or null). */
export function useIndexHover() {
  const [hovered, setHovered] = useState<number | null>(null);

  const onEnter = useCallback((i: number) => setHovered(i), []);
  const onLeave = useCallback(
    (i: number) => setHovered((current) => (current === i ? null : current)),
    []
  );

  return { hovered, onEnter, onLeave };
}
