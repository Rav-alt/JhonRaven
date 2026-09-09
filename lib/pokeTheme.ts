// Turn a Pokémon's type(s) into a page palette.
//
// Only the hue-carrying tokens are derived here — ink, muted, card and shadow
// tokens stay on the base Dialga palette in globals.css so text contrast never
// drifts as the accent changes. Lightness values are pinned to known-good spots
// per mode, so a garish type colour can shift the hue but not the legibility.

export type Mode = "dark" | "light";

/** Canonical brand colour per Pokémon type. */
export const TYPE_COLORS: Record<string, string> = {
  normal: "#9fa19f",
  fire: "#e62829",
  water: "#2980ef",
  electric: "#f7b800",
  grass: "#3fa129",
  ice: "#3dcef3",
  fighting: "#ce4066",
  poison: "#9141cb",
  ground: "#a6763f",
  flying: "#8fa8dd",
  psychic: "#ef4179",
  bug: "#91a119",
  rock: "#afa981",
  ghost: "#704170",
  dragon: "#5060e1",
  dark: "#5a5366",
  steel: "#5a8ea2",
  fairy: "#ef70ef",
};

/** Every custom property `derivePalette` writes — used to clear an override. */
export const THEME_VARS = [
  "--pg",
  "--pg-flat",
  "--kicker",
  "--accent",
  "--accent-hi",
  "--accent-text",
  "--accent-wash",
  "--icon-ink",
  "--line",
  "--line-soft",
  "--gem-hi",
  "--gem-lo",
  "--glow",
  "--scrim-a",
  "--scrim-b",
  "--scrim-c",
  "--halo",
  "--sweep",
  "--on-sweep",
  "--ramp-0",
  "--ramp-1",
  "--ramp-2",
  "--ramp-3",
  "--ramp-4",
] as const;

const SPRITES = "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon";
const ARTWORK = `${SPRITES}/other/official-artwork`;

/** Official-artwork URL for a dex number; shiny in dark ("Shiny") mode. */
export function spriteFor(dex: number, mode: Mode): string {
  return `${ARTWORK}/${mode === "dark" ? "shiny/" : ""}${dex}.png`;
}

/** Small pixel front-sprite URL — for dense grids; shiny in dark ("Shiny") mode. */
export function tileSpriteFor(dex: number, mode: Mode): string {
  return `${SPRITES}/${mode === "dark" ? "shiny/" : ""}${dex}.png`;
}

// --- colour maths ----------------------------------------------------------

type Hsl = { h: number; s: number; l: number };

const clamp = (v: number, lo: number, hi: number) => Math.min(hi, Math.max(lo, v));

function hexToHsl(hex: string): Hsl {
  let m = hex.replace("#", "");
  if (m.length === 3) m = m[0] + m[0] + m[1] + m[1] + m[2] + m[2];
  const r = parseInt(m.slice(0, 2), 16) / 255;
  const g = parseInt(m.slice(2, 4), 16) / 255;
  const b = parseInt(m.slice(4, 6), 16) / 255;
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const d = max - min;
  let h = 0;
  if (d !== 0) {
    if (max === r) h = ((g - b) / d) % 6;
    else if (max === g) h = (b - r) / d + 2;
    else h = (r - g) / d + 4;
    h *= 60;
    if (h < 0) h += 360;
  }
  const l = (max + min) / 2;
  const s = d === 0 ? 0 : d / (1 - Math.abs(2 * l - 1));
  return { h, s: s * 100, l: l * 100 };
}

function hslToHex(h: number, s: number, l: number): string {
  s = clamp(s, 0, 100) / 100;
  l = clamp(l, 0, 100) / 100;
  const c = (1 - Math.abs(2 * l - 1)) * s;
  const x = c * (1 - Math.abs(((h / 60) % 2) - 1));
  const mm = l - c / 2;
  let r = 0;
  let g = 0;
  let b = 0;
  if (h < 60) [r, g, b] = [c, x, 0];
  else if (h < 120) [r, g, b] = [x, c, 0];
  else if (h < 180) [r, g, b] = [0, c, x];
  else if (h < 240) [r, g, b] = [0, x, c];
  else if (h < 300) [r, g, b] = [x, 0, c];
  else [r, g, b] = [c, 0, x];
  const to = (v: number) =>
    Math.round((v + mm) * 255)
      .toString(16)
      .padStart(2, "0");
  return `#${to(r)}${to(g)}${to(b)}`;
}

function relLuminance(hex: string): number {
  let m = hex.replace("#", "");
  if (m.length > 6) m = m.slice(0, 6);
  const chan = [0, 2, 4].map((i) => {
    const v = parseInt(m.slice(i, i + 2), 16) / 255;
    return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
  });
  return 0.2126 * chan[0] + 0.7152 * chan[1] + 0.0722 * chan[2];
}

function contrast(a: string, b: string): number {
  const l1 = relLuminance(a);
  const l2 = relLuminance(b);
  return (Math.max(l1, l2) + 0.05) / (Math.min(l1, l2) + 0.05);
}

/**
 * Walk lightness in `dir` (lighter for dark mode, darker for light mode) until
 * an `h/s/l` colour clears `target` contrast against `bg`. A no-op when the
 * starting colour already passes — bright hues like electric/grass get pushed,
 * blues stay put.
 */
function fit(h: number, s: number, l: number, bg: string, target: number, dir: 1 | -1): string {
  let hex = hslToHex(h, s, l);
  for (let i = 0; i < 48 && contrast(hex, bg) < target; i++) {
    l = clamp(l + dir * 2, 6, 94);
    hex = hslToHex(h, s, l);
  }
  return hex;
}

/**
 * Darken a colour (drop its lightness) until its relative luminance sits at or
 * below `cap`. Used to keep the hover "sweep" gradient dark enough that the
 * light `--on-sweep` ink always clears WCAG AA, whatever the type hue — bright
 * hues (electric, grass, bug) get pulled down; blues are already under the cap.
 */
function capLum(h: number, s: number, l: number, cap: number): string {
  let hex = hslToHex(h, s, l);
  for (let i = 0; i < 60 && relLuminance(hex) > cap; i++) {
    l = clamp(l - 1.5, 3, l);
    hex = hslToHex(h, s, l);
  }
  return hex;
}

/** Luminance ceiling for the two sweep stops — see `capLum`. */
const SWEEP_MAX_LUM = 0.14;

/**
 * Build the chromatic half of the token set from a Pokémon's ordered type list.
 * Returns a map of CSS custom properties to set on `<html>`; both modes return
 * the same keys (see `THEME_VARS`). Text-bearing tokens are contrast-fitted to
 * the derived background so every type meets WCAG AA.
 */
export function derivePalette(types: string[], mode: Mode): Record<string, string> {
  const primary = hexToHsl(TYPE_COLORS[types[0]] ?? TYPE_COLORS.dragon);
  const secondary = hexToHsl(TYPE_COLORS[types[1]] ?? TYPE_COLORS[types[0]] ?? TYPE_COLORS.dragon);
  const h = primary.h;
  const h2 = secondary.h;
  const s = clamp(primary.s, 35, 92);
  const s2 = clamp(secondary.s, 35, 92);

  if (mode === "dark") {
    const bg = hslToHex(h, 50, 11);
    const accent = fit(h, s, 66, bg, 3, 1);
    const accentText = fit(h, s - 20, 85, bg, 4.5, 1);
    const kicker = fit(h2, clamp(s2 - 8, 26, 84), 62, bg, 4.5, 1);
    const gemLo = hslToHex(h, s - 5, 53);
    const scrim = hslToHex(h, 42, 8);
    // Hover "sweep": two stops both pulled under the luminance cap so the light
    // ink below always clears AA. --on-sweep is a near-white hue tint.
    const sweepLo = capLum(h, 50, 20, SWEEP_MAX_LUM);
    const sweepHi = capLum(h2, clamp(s2 - 6, 28, 86), 33, SWEEP_MAX_LUM);
    const onSweep = hslToHex(h, clamp(s - 45, 0, 18), 95);
    return {
      "--pg": `radial-gradient(1200px 700px at 78% -6%, ${hslToHex(h, 52, 31)} 0%, ${hslToHex(h, 54, 19)} 38%, ${bg} 76%)`,
      "--pg-flat": bg,
      "--kicker": kicker,
      "--accent": accent,
      "--accent-hi": fit(h, s - 18, 84, bg, 4.5, 1),
      "--accent-text": accentText,
      "--accent-wash": `${accent}14`,
      "--icon-ink": accentText,
      "--line": hslToHex(h, 40, 25),
      "--line-soft": hslToHex(h, 38, 31),
      "--gem-hi": hslToHex(h, s - 14, 87),
      "--gem-lo": gemLo,
      "--glow": `${gemLo}66`,
      "--scrim-a": `${scrim}f2`,
      "--scrim-b": `${scrim}d9`,
      "--scrim-c": `${scrim}00`,
      "--halo": `0 2px 22px ${scrim}, 0 0 8px ${scrim}cc`,
      "--sweep": `linear-gradient(120deg, ${sweepLo}, ${sweepHi})`,
      "--on-sweep": onSweep,
      "--ramp-0": hslToHex(h, 38, 18),
      "--ramp-1": hslToHex(h, 52, 30),
      "--ramp-2": hslToHex(h, s, 45),
      "--ramp-3": hslToHex(h, s, 64),
      "--ramp-4": hslToHex(h, s - 10, 83),
    };
  }

  const bg = hslToHex(h, 34, 98);
  const accent = fit(h, s, 40, bg, 3, -1);
  const accentText = fit(h, s, 36, bg, 4.5, -1);
  const kicker = fit(h2, s2, 38, bg, 4.5, -1);
  const gemHi = hslToHex(h, s - 10, 70);
  const scrim = hslToHex(h, 40, 98);
  // Hover "sweep": a dark colored reveal (same treatment as dark mode) so the
  // light ink stays legible on any type. Both stops pulled under the cap.
  const accentHsl = hexToHsl(accent);
  const sweepLo = capLum(h, s, 34, SWEEP_MAX_LUM);
  const sweepHi = capLum(accentHsl.h, accentHsl.s, accentHsl.l, SWEEP_MAX_LUM);
  const onSweep = hslToHex(h, clamp(s - 45, 0, 18), 95);
  return {
    "--pg": `radial-gradient(1200px 700px at 78% -6%, ${hslToHex(h, 52, 90)} 0%, ${hslToHex(h, 44, 95)} 40%, ${bg} 78%)`,
    "--pg-flat": bg,
    "--kicker": kicker,
    "--accent": accent,
    "--accent-hi": fit(h, s, 32, bg, 4.5, -1),
    "--accent-text": accentText,
    "--accent-wash": `${accent}10`,
    "--icon-ink": accentText,
    "--line": hslToHex(h, 32, 87),
    "--line-soft": hslToHex(h, 28, 91),
    "--gem-hi": gemHi,
    "--gem-lo": accent,
    "--glow": `${gemHi}55`,
    "--scrim-a": `${scrim}e6`,
    "--scrim-b": `${scrim}b3`,
    "--scrim-c": `${scrim}00`,
    "--halo": `0 1px 14px ${scrim}, 0 0 6px #ffffffcc`,
    "--sweep": `linear-gradient(120deg, ${sweepLo}, ${sweepHi})`,
    "--on-sweep": onSweep,
    "--ramp-0": hslToHex(h, 36, 92),
    "--ramp-1": hslToHex(h, 46, 81),
    "--ramp-2": hslToHex(h, s, 64),
    "--ramp-3": hslToHex(h, s, 46),
    "--ramp-4": hslToHex(h, s, 32),
  };
}

/** Compact form persisted to `localStorage` and replayed by the boot script. */
export type PokeCache = {
  dex: number;
  display: string;
  types: string[];
  dark: Record<string, string>;
  light: Record<string, string>;
};

export function buildCache(meta: { dex: number; display: string; types: string[] }): PokeCache {
  return {
    dex: meta.dex,
    display: meta.display,
    types: meta.types,
    dark: derivePalette(meta.types, "dark"),
    light: derivePalette(meta.types, "light"),
  };
}
