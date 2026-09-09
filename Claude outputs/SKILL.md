---
name: portfolio-design
description: Design rules for the JhonRaven portfolio. Use for any UI, styling, layout, color, typography, or visual work on this site — anything a visitor sees. Enforces the Pokémon-color-engine constraints (hue is derived, never hardcoded), accessibility, and a definition-of-done checklist.
---

# JhonRaven Portfolio — Design Instructions

This is a personal portfolio for **Jhon Raven Cadiz**, a front-end developer in
Manila. Every design decision must feel intentional and human-made. Never
produce generic AI-generated design.

## The #1 rule
This is a PORTFOLIO. The design IS the work. A generic layout signals a generic
developer. Make deliberate, opinionated choices that a person would defend.

## This site's premise (read before touching color)
The signature feature is a **Pokémon color engine**: the whole palette repaints
at runtime from the active Pokémon's type colors (`lib/pokeTheme.ts`), across
1000+ Pokémon, in both **Shiny** (dark) and **Regular** (light) mode, with text
contrast fitted to WCAG AA. This changes how you design:

- **Hue is not yours to pick.** Structure, hierarchy, type, spacing, and
  neutrals are the design. Hue-carrying color is *derived* — never hardcode it.
- Every layout must survive being repainted by a garish palette (think
  Charizard, Muk, a shiny legendary) without becoming unreadable or ugly.
- Contrast is *derived, not fixed* — don't replace the color math in
  `pokeTheme.ts` with hardcoded values.

## Hard bans (never do these)
- No purple/violet gradient hero sections or gradient blob backgrounds
- No blurry background orbs or glassmorphism everywhere
- No default component-library look left unstyled (Radix primitives must be
  fully styled — the Pokédex and modals are Radix Dialog)
- No emoji as section/feature icons (🚀 ✨ 💡) — use `lucide-react`, sized and colored deliberately
- No three-column "Features"-style card grid with icon-on-top
- No centered hero = big headline + two buttons as the default
- No default Tailwind palette (`bg-gray-50`, `text-gray-600`, `bg-slate-*`)
- **No hardcoded hex/rgb in components** — read the CSS variables from
  `globals.css`; let hue tokens flow from the engine
- Don't default to Inter for everything
- Don't center everything — use asymmetry with intent

## Before writing any code
1. State the design direction in 1-2 sentences (mood, era, references)
2. Work in the existing token system FIRST: confirm which CSS variables carry
   hue (derived) vs. ink/card/shadow (base palette), then design against them.
   Define any new type-pairing or spacing tokens before building.
3. Then build sections against those tokens

## Typography
- One distinctive typeface pairing (display + body), not one generic sans.
  Load fonts via `next/font` with a real fallback stack.
- Real type scale with bold contrast between headings and body
- Set line-height, letter-spacing, and a readable measure (~65ch for text)

## Color
- Commit to opinionated **structure and neutrals** — the hue comes from the
  Pokémon engine, so your job is the palette's *skeleton*: ink, card, surface,
  border, shadow, and how much the derived hue is allowed to shout.
- Only hue-carrying tokens are derived; ink/card/shadow stay on the base
  palette so contrast never drifts. Derive from mood, never framework defaults.

## Layout
- Vary section layouts — don't repeat the same block pattern down the page
- Intentional whitespace and rhythm; let some sections breathe, others be dense
- Use a real grid; break it on purpose where it adds interest
- **Every asymmetric/broken-grid layout needs a deliberate mobile form** — a
  designed reflow, not a squished desktop. Design the small screen on purpose.

## Motion
- Subtle and purposeful only — no fade-in-on-scroll on every element
- Honor `prefers-reduced-motion`: motion is an enhancement, never required to
  read or use the page

## Accessibility (non-negotiable, not optional polish)
- Contrast holds at WCAG AA across **every** palette in both modes — the whole
  point of the color engine is that it never breaks legibility
- Visible, styled focus states on everything interactive; never remove outlines
  without replacing them
- Keyboard-navigable throughout — don't break Radix's built-in focus trapping
  and keyboard handling in the Pokédex or modals
- Semantic HTML (landmarks, headings in order, real buttons/links, alt text)

## Definition of done (run this on every section before calling it finished)
- [ ] Distinctive type pairing in use — no default sans
- [ ] Layout differs from the section directly above and below it
- [ ] Readable and attractive under a garish Pokémon palette, both modes
- [ ] No hardcoded color — tokens only
- [ ] Deliberate mobile layout, not a squish
- [ ] Focus states visible; keyboard-usable; reduced-motion honored

## When direction is unclear
Ask for a reference site or mood BEFORE defaulting to a safe generic layout.
Never fill unknowns with placeholder patterns.
