# JhonRaven Portfolio: Design Instructions

This is a personal portfolio for **Jhon Raven Cadiz**, a front-end developer in
Manila. Every design decision must feel intentional and human-made. Never
produce generic AI-generated design.

## The #1 rule
This is a PORTFOLIO. The design IS the work. A generic layout signals a generic
developer. Make deliberate, opinionated choices that a person would defend.

## This site's premise
**The name docks.** On load, "Jhon Raven Cadiz" is set as large as the width
allows. As you scroll, it shrinks and slides into a sticky profile column on
the left, which then stays put while the work scrolls on the right. On phones
the column becomes a slim top bar and the name docks into that instead.

That handoff is the one big moment. Everything else is quiet and disciplined
so it can land.

## Color
- **Black, white and gray only.** No hue anywhere, including links, focus
  rings and the contribution graph.
- **Flat fills only.** No gradients, glows, blurs or soft shadows.
- Every color is a token in `app/globals.css`. Light values sit on bare
  `:root`; dark values apply under `prefers-color-scheme: dark` (unless the
  visitor picked light) and under `[data-theme="dark"]`. With no saved pick the
  site follows the OS. Never hardcode a color in a component.
- Tokens: `--paper` (background), `--ink` (text, rules, buttons), `--mid`
  (secondary text), `--line` (hairlines), `--wash` (frame and stage fills),
  `--ramp-0`…`--ramp-4` (graph), `--scrim` (modal backdrop).

## Typography
- **Young Serif** for the name, section headings and project titles.
- **Hanken Grotesk** for everything else.
- Both load through `next/font` in `app/layout.tsx` with real fallback stacks.
- Keep running text under about 65 characters wide.

## Layout
- Hero: the name, then a lede, three facts and two actions, indented to start
  where the main column starts.
- Below the hero: a 248px sticky profile column and a fluid main column.
- Main sections, in order: Work, Personal projects, Experience, Stack,
  Activity, Contact. Section order and nav labels live in `SECTIONS` in
  `lib/data.ts`.
- Projects go in **Work** (`group: "work"`, made for an employer) or
  **Personal projects** (`group: "personal"`, everything else).
- Under 860px the layout is one column, and the profile is a top bar.

## Motion
Scroll-driven, and all of it lives in `hooks/useScrollMotion.ts`. Components
opt in through data attributes and never carry motion code themselves.

- **Page load:** each line of the name rises out of its mask, then the intro settles in.
- **Name dock:** described above.
- **Project frames:** they grow from 90% to full size as they enter, and the
  screenshot drifts a few percent against the frame.
- **Experience:** the timeline line draws down as you read and fills each dot it reaches.
- **Activity:** the graph fills week by week the first time it is seen.
- **Project modal:** grows out of the frame that opened it and shrinks back into it.
- **Small interactions:** the nav rule grows in, the email underline draws in.
- **Theme switch:** the new theme grows out of the toggle in a circle until it
  covers the page (View Transitions, in `hooks/useTheme.ts`). Browsers
  without View Transitions switch instantly.

Rules:
- Honor `prefers-reduced-motion`. With it on, the name stays in the hero,
  frames stay still, the timeline and graph render complete, and the theme
  switches instantly.
- The page must be complete at rest: nothing readable waits at opacity 0 for
  an observer.
- Don't add fade-and-slide-up on every section, or hover lifts on every card.

## Hard bans
- No gradients, glassmorphism, blurred orbs or soft drop shadows
- No accent hue
- No emoji as icons
- No three-column feature-card grid
- No default component-library look; Radix Dialog must be fully styled
- No hardcoded colors in components
- No numbered "01 / 02" section markers; the sections are not a sequence

## Accessibility (non-negotiable)
- WCAG AA contrast in both modes
- Visible focus on everything interactive (2px ink outline)
- Keyboard-usable throughout; keep Radix's focus trap in the modal
- Videos autoplay muted only without reduced motion and always have a Pause
  control; sound only starts on a tap
- Semantic HTML: landmarks, headings in order, real buttons and links, alt text

## Definition of done
- [ ] Young Serif and Hanken Grotesk only
- [ ] Tokens only, works in light and dark
- [ ] Deliberate phone layout at 390px, no sideways scroll
- [ ] Reduced motion leaves a complete, still page
- [ ] Focus visible, keyboard-usable
