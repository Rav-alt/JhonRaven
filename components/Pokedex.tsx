"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@/components/ui/dialog";
import styles from "./Pokedex.module.css";
import { FEATURED } from "@/lib/data";
import type { PokeSkin, Theme } from "@/lib/data";
import { spriteFor, tileSpriteFor, TYPE_COLORS } from "@/lib/pokeTheme";
import {
  fetchPokedexEntry,
  fetchPokedexIndex,
  type PokedexEntry,
  type PokeIndexItem,
} from "@/lib/pokeApi";

type Status = "idle" | "loading" | "error";

/** Base stats effectively top out around here — used only to scale the bars. */
const STAT_MAX = 200;

export default function Pokedex({
  open,
  onClose,
  activeDex,
  theme,
  onSelect,
}: {
  open: boolean;
  onClose: () => void;
  activeDex: number;
  theme: Theme;
  onSelect: (skin: PokeSkin) => void;
}) {
  const [entry, setEntry] = useState<PokedexEntry | null>(null);
  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState<string | null>(null);
  const [query, setQuery] = useState("");
  const [index, setIndex] = useState<PokeIndexItem[] | null>(null);
  const [indexError, setIndexError] = useState(false);
  const inputRef = useRef<HTMLInputElement | null>(null);
  const reqId = useRef(0);

  const load = useCallback(
    async (q: string, apply: boolean) => {
      const id = ++reqId.current;
      setStatus("loading");
      setError(null);
      try {
        const next = await fetchPokedexEntry(q);
        if (id !== reqId.current) return; // a newer request has taken over
        setEntry(next);
        setStatus("idle");
        if (apply) onSelect({ dex: next.dex, display: next.display, types: next.types });
      } catch (err) {
        if (id !== reqId.current) return;
        setStatus("error");
        setError(err instanceof Error ? err.message : "Something went wrong.");
      }
    },
    [onSelect],
  );

  // Keep the readout in step with whatever Pokémon is currently applied — both
  // when the modal opens and after a featured pick repaints the site.
  useEffect(() => {
    if (!open) return;
    if (entry?.dex === activeDex) return;
    // Fetching the readout is the effect's whole point — the "loading" flip is
    // part of that side effect, not a cascading render.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    void load(String(activeDex), false);
  }, [open, activeDex, entry?.dex, load]);

  // Pull the browse index once, the first time the modal opens.
  useEffect(() => {
    if (!open || index) return;
    let alive = true;
    fetchPokedexIndex()
      .then((list) => alive && setIndex(list))
      .catch(() => alive && setIndexError(true));
    return () => {
      alive = false;
    };
  }, [open, index]);

  const filtered = useMemo(() => {
    if (!index) return [];
    const q = query.trim().toLowerCase();
    if (!q) return index;
    if (/^\d+$/.test(q)) return index.filter((p) => String(p.dex).includes(q));
    return index.filter((p) => p.display.toLowerCase().includes(q));
  }, [index, query]);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const q = query.trim();
    if (q) void load(q, true);
  };

  const loading = status === "loading";

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent
        showCloseButton={false}
        className={styles.shell}
        overlayClassName={styles.overlay}
        onOpenAutoFocus={(e) => {
          e.preventDefault();
          inputRef.current?.focus();
        }}
      >
        <div className={styles.lid}>
          <span className={styles.lamp} aria-hidden />
          <span className={styles.leds} aria-hidden>
            <i />
            <i />
            <i />
          </span>
          <DialogTitle className={styles.wordmark}>Pokédex</DialogTitle>
          <DialogClose className={styles.close} aria-label="Close Pokédex">
            ✕
          </DialogClose>
        </div>

        <DialogDescription className={styles.srOnly}>
          Search or browse the National Pokédex; picking a Pokémon repaints the site palette from its
          type.
        </DialogDescription>

        <div className={styles.body}>
          <div className={styles.screenCol}>
            <div className={styles.bezel}>
              <div className={styles.screen} data-state={loading ? "scan" : "on"}>
                {entry && (
                  /* eslint-disable-next-line @next/next/no-img-element */
                  <img
                    key={spriteFor(entry.dex, theme)}
                    src={spriteFor(entry.dex, theme)}
                    alt={`${entry.display} artwork`}
                    className={styles.sprite}
                  />
                )}
                <div className={styles.scan} aria-hidden />
                {loading && <div className={styles.screenNote}>SCANNING…</div>}
              </div>
            </div>

            <form className={styles.search} onSubmit={submit}>
              <input
                ref={inputRef}
                className={styles.input}
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search or filter — name or №"
                spellCheck={false}
                autoComplete="off"
                aria-label="Search or filter the Pokédex"
              />
              <button type="submit" className={styles.go} disabled={loading || !query.trim()}>
                {loading ? "…" : "Scan"}
              </button>
            </form>

            <div className={styles.chips}>
              {FEATURED.map((f) => (
                <button
                  key={f.dex}
                  type="button"
                  className={`${styles.chip} ${f.dex === activeDex ? styles.chipOn : ""}`}
                  onClick={() => onSelect(f)}
                >
                  {f.display}
                </button>
              ))}
            </div>

            <div className={styles.index} role="listbox" aria-label="Pokédex index">
              {indexError ? (
                <p className={styles.indexNote}>Index unavailable — search by name above.</p>
              ) : !index ? (
                <p className={styles.indexNote}>Loading index…</p>
              ) : filtered.length === 0 ? (
                <p className={styles.indexNote}>No match for “{query.trim()}”.</p>
              ) : (
                filtered.map((p) => (
                  <button
                    key={p.dex}
                    type="button"
                    role="option"
                    aria-selected={p.dex === activeDex}
                    title={p.display}
                    className={`${styles.card} ${p.dex === activeDex ? styles.cardOn : ""}`}
                    onClick={() => void load(String(p.dex), true)}
                  >
                    <span className={styles.cardNum}>{String(p.dex).padStart(4, "0")}</span>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={tileSpriteFor(p.dex, theme)}
                      alt=""
                      loading="lazy"
                      className={styles.cardSprite}
                      onError={(e) => {
                        e.currentTarget.style.visibility = "hidden";
                      }}
                    />
                    <span className={styles.cardName}>{p.display}</span>
                  </button>
                ))
              )}
            </div>
          </div>

          <div className={styles.dataCol}>
            {status === "error" ? (
              <div className={styles.readout}>
                <p className={styles.err}>{error}</p>
                <p className={styles.hint}>Try a name like “pikachu” or a number like 149.</p>
              </div>
            ) : entry ? (
              <div className={styles.readout} data-dim={loading ? "" : undefined}>
                <div className={styles.idline}>
                  <span className={styles.dex}>No.{String(entry.dex).padStart(4, "0")}</span>
                  <span className={styles.pname}>{entry.display}</span>
                </div>
                <div className={styles.genus}>{entry.genus}</div>

                <div className={styles.types}>
                  {entry.types.map((t) => (
                    <span
                      key={t}
                      className={styles.type}
                      style={{ "--t": TYPE_COLORS[t] } as React.CSSProperties}
                    >
                      {t}
                    </span>
                  ))}
                </div>

                <div className={styles.vitals}>
                  <div>
                    <span className={styles.k}>Height</span>
                    <span className={styles.v}>{entry.heightM.toFixed(1)} m</span>
                  </div>
                  <div>
                    <span className={styles.k}>Weight</span>
                    <span className={styles.v}>{entry.weightKg.toFixed(1)} kg</span>
                  </div>
                  <div className={styles.wide}>
                    <span className={styles.k}>Abilities</span>
                    <span className={styles.v}>{entry.abilities.join(", ")}</span>
                  </div>
                </div>

                <div className={styles.stats}>
                  {entry.stats.map((s) => (
                    <div key={s.label} className={styles.stat}>
                      <span className={styles.statLabel}>{s.label}</span>
                      <span className={styles.statTrack}>
                        <span
                          className={styles.statFill}
                          style={{ width: `${Math.min(100, (s.value / STAT_MAX) * 100)}%` }}
                        />
                      </span>
                      <span className={styles.statVal}>{s.value}</span>
                    </div>
                  ))}
                  <div className={styles.stat}>
                    <span className={styles.statLabel}>Total</span>
                    <span className={styles.statTrack} />
                    <span className={styles.statVal}>{entry.total}</span>
                  </div>
                </div>

                <p className={styles.flavor}>{entry.flavor}</p>
              </div>
            ) : (
              <div className={styles.readout}>
                <p className={styles.hint}>Loading Pokédex data…</p>
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
