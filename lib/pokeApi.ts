// Thin PokeAPI client. Three shapes are exposed:
//   • fetchPokemon      — resolve a name/number to its dex id + ordered type
//     list, which is all the palette derivation in pokeTheme needs.
//   • fetchPokedexEntry — the same, plus the stat block, physical stats and
//     flavour text the Pokédex modal reads out.
//   • fetchPokedexIndex — the full national-dex name list, for the modal's
//     browse-and-filter list. One request, memoised for the session.
// Sprites are pulled straight from the PokeAPI GitHub CDN (pokeTheme.spriteFor),
// so no sprite URLs are resolved here.

export type PokeMeta = {
  dex: number;
  name: string;
  display: string;
  types: string[];
};

export type PokeStat = { label: string; value: number };

export type PokedexEntry = PokeMeta & {
  heightM: number;
  weightKg: number;
  abilities: string[];
  stats: PokeStat[];
  total: number;
  genus: string;
  flavor: string;
};

const ENDPOINT = "https://pokeapi.co/api/v2/pokemon/";
const SPECIES = "https://pokeapi.co/api/v2/pokemon-species/";

const titleCase = (s: string) =>
  s
    .split(/[-\s]/)
    .filter(Boolean)
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");

const normalize = (query: string) => query.trim().toLowerCase().replace(/[^a-z0-9-]/g, "");

const STAT_LABELS: Record<string, string> = {
  hp: "HP",
  attack: "ATK",
  defense: "DEF",
  "special-attack": "SP. ATK",
  "special-defense": "SP. DEF",
  speed: "SPD",
};

type PokemonResponse = {
  id: number;
  name: string;
  height: number; // decimetres
  weight: number; // hectograms
  types: { slot: number; type: { name: string } }[];
  abilities: { is_hidden: boolean; slot: number; ability: { name: string } }[];
  stats: { base_stat: number; stat: { name: string } }[];
};

type SpeciesResponse = {
  genera: { genus: string; language: { name: string } }[];
  flavor_text_entries: { flavor_text: string; language: { name: string } }[];
};

async function getPokemon(q: string, label: string): Promise<PokemonResponse> {
  let res: Response;
  try {
    res = await fetch(`${ENDPOINT}${q}`);
  } catch {
    throw new Error("Couldn't reach PokeAPI — check your connection.");
  }
  if (!res.ok) {
    throw new Error(
      res.status === 404 ? `No Pokémon matches "${label}".` : `PokeAPI error (${res.status}).`,
    );
  }
  return (await res.json()) as PokemonResponse;
}

function toMeta(data: PokemonResponse): PokeMeta {
  return {
    dex: data.id,
    name: data.name,
    display: titleCase(data.name),
    types: [...data.types].sort((a, b) => a.slot - b.slot).map((t) => t.type.name),
  };
}

export async function fetchPokemon(query: string): Promise<PokeMeta> {
  const q = normalize(query);
  if (!q) throw new Error("Type a Pokémon name or number.");
  return toMeta(await getPokemon(q, query.trim()));
}

/** PokeAPI flavour text ships with hard line breaks, form feeds and soft hyphens. */
const cleanFlavor = (text: string) =>
  text
    .replace(/­/g, "")
    .replace(/\s+/g, " ")
    .trim();

export async function fetchPokedexEntry(query: string): Promise<PokedexEntry> {
  const q = normalize(query);
  if (!q) throw new Error("Type a Pokémon name or number.");

  const data = await getPokemon(q, query.trim());
  const meta = toMeta(data);

  // The species resource carries the flavour text + genus; keep it optional so
  // a hiccup there still yields a usable stat card.
  let species: SpeciesResponse | null = null;
  try {
    const res = await fetch(`${SPECIES}${data.id}`);
    if (res.ok) species = (await res.json()) as SpeciesResponse;
  } catch {
    species = null;
  }

  const englishFlavors = species?.flavor_text_entries.filter((f) => f.language.name === "en") ?? [];
  const stats: PokeStat[] = data.stats.map((s) => ({
    label: STAT_LABELS[s.stat.name] ?? titleCase(s.stat.name),
    value: s.base_stat,
  }));

  return {
    ...meta,
    heightM: data.height / 10,
    weightKg: data.weight / 10,
    abilities: [...data.abilities]
      .sort((a, b) => a.slot - b.slot)
      .map((a) => titleCase(a.ability.name) + (a.is_hidden ? " (hidden)" : "")),
    stats,
    total: stats.reduce((sum, s) => sum + s.value, 0),
    genus: species?.genera.find((g) => g.language.name === "en")?.genus ?? "Unknown Pokémon",
    flavor: englishFlavors.length
      ? cleanFlavor(englishFlavors[englishFlavors.length - 1].flavor_text)
      : "No Pokédex data on record.",
  };
}

export type PokeIndexItem = { dex: number; name: string; display: string };

type IndexResponse = { results: { name: string; url: string }[] };

let indexCache: PokeIndexItem[] | null = null;

/**
 * The whole national dex as `{ dex, name, display }`, dex-ordered. PokeAPI
 * returns this in one call; alternate forms (ids in the 10000+ range) are
 * dropped so the browse list stays a clean numbered run.
 */
export async function fetchPokedexIndex(): Promise<PokeIndexItem[]> {
  if (indexCache) return indexCache;

  let res: Response;
  try {
    res = await fetch(`${ENDPOINT}?limit=100000&offset=0`);
  } catch {
    throw new Error("Couldn't reach PokeAPI — check your connection.");
  }
  if (!res.ok) throw new Error(`PokeAPI error (${res.status}).`);

  const data = (await res.json()) as IndexResponse;
  indexCache = data.results
    .map((r) => {
      const id = Number(r.url.match(/\/pokemon\/(\d+)\/?$/)?.[1] ?? 0);
      return { dex: id, name: r.name, display: titleCase(r.name) };
    })
    .filter((p) => p.dex > 0 && p.dex < 10000)
    .sort((a, b) => a.dex - b.dex);
  return indexCache;
}
