# JhonRaven Portfolio — Project Context

## What this is

A personal portfolio site for **Jhon Raven Cadiz**, a front-end developer based in Manila, Philippines. It's a single-page site that presents who he is, the tools he uses, his one production project, and his work history, with a contact section at the end.

The site's signature feature is a **Pokémon-themed color engine**: visitors can open an in-page Pokédex, pick any Pokémon, and the entire site repaints its palette from that Pokémon's type colors. The default skin is Dialga (a Steel/Dragon legendary), which is why theme storage keys and the base palette are named "dialga." "Shiny" and "Regular" are the site's playful names for dark and light mode.

## Tech stack

- **Next.js 16.3.3** (App Router) with **React 19.2.8** and **TypeScript**
- **Tailwind CSS v4** (via `@tailwindcss/postcss`) plus CSS Modules per component
- **Radix UI Dialog** (`@radix-ui/react-dialog`) for the Pokédex and project modals
- **lucide-react** for icons; `clsx` / `tailwind-merge` / `class-variance-authority` as styling utilities
- Node 20, ESLint 9 (`eslint-config-next`)

Standard scripts: `npm run dev`, `npm run build`, `npm run start`, `npm run lint`.

> Note: `AGENTS.md` warns that this is a newer Next.js than most training data assumes — APIs and conventions may differ. It points to `node_modules/next/dist/docs/` for the authoritative guides before writing code. `CLAUDE.md` simply re-exports `AGENTS.md`.

## Structure

The app is one page composed of section components.

- `app/page.tsx` — Server Component. Fetches the real GitHub contribution graph on the server (token never reaches the browser) and passes it to the client tree.
- `app/HomeClient.tsx` — Client root. Wires up the theme hook and scroll-spy, then renders the sections in order: `SideNav`, `Header`, `Hero`, `About`, `TechStack`, `Projects`, `Experience`, `Contact`.
- `app/layout.tsx` — Sets metadata and runs an inline pre-hydration script (`THEME_INIT`) that applies the saved light/dark mode and replays the last-picked Pokémon palette from `localStorage` before first paint, avoiding a flash of the wrong theme.

**Components** (`components/`): `Header` (nav + theme/Pokédex buttons), `Hero` (sprite, intro, GitHub graph, profile card), `About`, `TechStack`, `Projects`, `Experience`, `Contact`, `SideNav`, `Pokedex`, and `ui/dialog.tsx` (Radix wrapper). Each has a matching `.module.css`.

**Content/data** (`lib/data.ts`): All site copy and structured content live here as typed constants — `ROLES` (work history), `TOOLS` (tech stack), `NAV` / `SIDE` (navigation), `SOCIALS`, `FEATURED` Pokémon, `DEFAULT_POKE` (Dialga), and `GRID_*` facts for the Grid project. **This is the file to edit for content changes.**

**Hooks** (`hooks/`): `useTheme` (mode toggle + Pokémon palette state, persistence), `useScrollSpy` (active-section highlighting), `useIndexHover` (shared hover index for nav/list effects).

## The Pokémon theme engine (the interesting part)

1. **`lib/pokeApi.ts`** — a thin PokeAPI client. Resolves a name or dex number to its types (`fetchPokemon`), pulls the full stat card + flavor text for the Pokédex modal (`fetchPokedexEntry`), and loads the whole national-dex name list once for browsing/filtering (`fetchPokedexIndex`).
2. **`lib/pokeTheme.ts`** — turns a Pokémon's type(s) into a full CSS-variable palette (`derivePalette`). It maps each type to a canonical brand color, then does real color math (HSL conversion + WCAG contrast-fitting) so text always stays legible no matter how garish the type color is. Only hue-carrying tokens are derived; ink/card/shadow tokens stay on the base palette in `globals.css` so contrast never drifts. Sprite URLs come from the PokeAPI GitHub CDN (shiny variants used in dark mode).
3. **`hooks/useTheme.ts`** — orchestrates it. Picking a Pokémon derives both light and dark palettes, caches them whole in `localStorage` (keys `dialga-portfolio-theme` and `dialga-portfolio-poke`), and applies the CSS variables to `<html>`. Picking Dialga clears the override back to the base palette.
4. **`components/Pokedex.tsx`** — the UI: a Pokédex-styled modal to search, filter, and browse, showing each Pokémon's sprite, types, height/weight, abilities, base stats, and flavor text. Selecting one repaints the whole site.

If PokeAPI is unreachable, searches error gracefully and the site keeps its current palette.

## GitHub contribution graph

The Hero's contribution grid shows Jhon Raven's **real** GitHub activity (last ~30 weeks). `lib/github.ts` calls GitHub's GraphQL API from the server, revalidated hourly. It needs a token: copy `.env.example` to `.env.local` and set `GITHUB_TOKEN` (a classic PAT with no scopes is enough for public contributions) and optionally `GITHUB_LOGIN` (defaults to `rav-alt`). Without a token — or if the request fails — it falls back to a deterministic seeded placeholder grid (`contributionGrid` in `lib/data.ts`), so local dev and tokenless builds still render. `scripts/gh-check.mjs` is a helper to verify the token/login.

## Key facts about the subject

- **Name / handle:** Jhon Raven Cadiz — `@rav-alt` on GitHub
- **Role:** Front End Developer at **Grid Property Ventures** (a property listing platform, grid.com.ph). Joined as a Web/Mobile intern (Feb–Apr 2026), returned full-time (Jun 2026–present).
- **Location:** Manila, Philippines (GMT+8)
- **Background:** Computer Science graduate
- **Contact email in site:** hello@ravcadiz.dev
- **Core tools:** React, Next.js, TypeScript, Claude Code, Git, GitHub

## Conventions & gotchas

- **Content is centralized** in `lib/data.ts` — edit there, not in component JSX.
- **Theme storage shape** is shared between `app/layout.tsx`'s inline boot script and `hooks/useTheme.ts` — keep the `localStorage` keys and cache shape in sync if either changes.
- **Contrast is derived, not hardcoded** — `pokeTheme.ts` fits text colors to meet WCAG AA per mode; don't replace the math with fixed values.
- Follow `AGENTS.md`: check `node_modules/next/dist/docs/` for this Next.js version's conventions before assuming older APIs.
- `next dev` re-adds the `AGENTS.md` rules block automatically; commit it with your work to keep the tree clean.
