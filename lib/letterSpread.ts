/** Per-letter horizontal offsets (px) that fan a label out from its center
 * when hovered — the nav-link and side-rail label animation. */
export function letterSpreadOffsets(label: string, spread = 1.8): number[] {
  const n = label.length;
  return label.split("").map((_, j) => (j - (n - 1) / 2) * spread);
}
