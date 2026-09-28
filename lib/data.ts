export type Theme = "dark" | "light";

/** A chosen Pokémon skin. `null` elsewhere means "the base Dialga palette". */
export type PokeSkin = { dex: number; display: string; types: string[] };

/** The built-in default — its palette lives in globals.css, not derived. */
export const DEFAULT_POKE: PokeSkin = {
  dex: 483,
  display: "Dialga",
  types: ["steel", "dragon"],
};

/** Quick-pick chips in the Header. Any other Pokémon is resolved via PokeAPI. */
export const FEATURED: PokeSkin[] = [
  DEFAULT_POKE,
  { dex: 484, display: "Palkia", types: ["water", "dragon"] },
  { dex: 487, display: "Giratina", types: ["ghost", "dragon"] },
];

const simpleIcon = (slug: string) => `https://cdn.simpleicons.org/${slug}`;
const phosphorIcon = (name: string) =>
  `https://cdn.jsdelivr.net/npm/@phosphor-icons/core@2.1.1/assets/regular/${name}.svg`;

export type Tool = { name: string; kind: string; icon: string };

export const TOOLS: Tool[] = [
  { name: "React", kind: "UI", icon: simpleIcon("react") },
  { name: "Next.js", kind: "Framework", icon: simpleIcon("nextdotjs") },
  { name: "TypeScript", kind: "Language", icon: simpleIcon("typescript") },
  { name: "Claude Code", kind: "Pairing", icon: simpleIcon("claude") },
  { name: "Git", kind: "Version control", icon: simpleIcon("git") },
  { name: "GitHub", kind: "Collaboration", icon: simpleIcon("github") },
];

export type Role = {
  span: string;
  title: string;
  company: string;
  kind: string;
  current: boolean;
  bullets: string[];
  stack: string[];
};

export const ROLES: Role[] = [
  {
    span: "Jun — Sep 2026",
    title: "Web Developer",
    company: "Grid Property Ventures",
    kind: "Startup",
    current: false,
    bullets: [
      "Developed and maintained the web front end for grid.com.ph, from listing pages through to the inquiry flow.",
      "Worked directly with the founders: scoped a change in the morning, shipped it the same week.",
      "Kept the interface consistent as the product grew — shared components, one type ramp, one set of tokens.",
      "Owned performance and responsiveness across desktop and mobile, where most of the traffic lands.",
    ],
    stack: ["Next.js", "React", "shadcn/ui", "MongoDB", "DigitalOcean"],
  },
  {
    span: "Feb — Apr 2026",
    title: "Web / Mobile Developer Intern",
    company: "Grid Property Ventures",
    kind: "Internship",
    current: false,
    bullets: [
      "Built and shipped front-end features alongside the web team on a live property platform.",
      "Turned designs into responsive components, then followed them through review and release.",
      "Learned the codebase well enough to be brought back onto the team full-time.",
    ],
    stack: ["React", "React Native", "Next.js", "Node.js", "Git"],
  },
];

export type NavItem = { label: string; href: string; slot: string; img: string };

export const NAV: NavItem[] = [
  { label: "About", href: "#about", slot: "nav-about", img: "/images/avatar.png" },
  { label: "Work", href: "#work", slot: "nav-work", img: "/images/grid-screenshot.png" },
  { label: "Experience", href: "#experience", slot: "nav-experience", img: "/images/grid-screenshot.png" },
  { label: "Contact", href: "#contact", slot: "nav-contact", img: "" },
];

export type SideItem = { id: string; label: string; icon: string; slot: string; img: string };

export const SIDE: SideItem[] = [
  { id: "about", label: "About", icon: phosphorIcon("user"), slot: "side-about", img: "/images/avatar.png" },
  { id: "stack", label: "Stack", icon: phosphorIcon("stack-simple"), slot: "side-stack", img: "/images/stack-preview.png" },
  { id: "work", label: "Projects", icon: phosphorIcon("browser"), slot: "side-work", img: "/images/grid-screenshot.png" },
  { id: "experience", label: "Experience", icon: phosphorIcon("clock-counter-clockwise"), slot: "side-experience", img: "/images/grid-screenshot.png" },
  { id: "contact", label: "Contact", icon: phosphorIcon("envelope-simple"), slot: "side-contact", img: "" },
];

export const GRID_FACTS = [
  { k: "Role", v: "Front End Developer" },
  { k: "Status", v: "Ended · Sep 2026" },
  { k: "Product", v: "Property listing platform" },
  { k: "Scope", v: "UI components, fixes, features" },
];

export const GRID_STACK = ["React", "Next.js", "TypeScript", "Git"];

/** One silent screen recording. Files live in /public/videos — keep names
 * lowercase: Windows ignores case, the production server doesn't. */
/** `src` is the H.264 MP4 every major browser plays; `webm` is a VP9 fallback
 * for the few that ship without H.264. */
export type ProjectClip = { label: string; caption: string; src: string; webm: string; poster: string };

export type ProjectMedia =
  | { kind: "image"; src: string; alt: string }
  | { kind: "video"; clips: ProjectClip[] };

export type Project = {
  id: string;
  name: string;
  /** Company, or what kind of thing it is for personal work. */
  owner: string;
  status: string;
  /** Ended work gets the neutral badge; live/personal work gets the accent one. */
  ended: boolean;
  role: string;
  /** Text in the modal's window bar: a URL for sites, a file name for apps. */
  chrome: string;
  thumb: { src: string; alt: string };
  media: ProjectMedia;
  description: string[];
  stack: string[];
  facts: { k: string; v: string }[];
};

export const PROJECTS: Project[] = [
  {
    id: "snap",
    name: "Snap",
    owner: "Windows desktop utility",
    status: "Personal tool · 2026",
    ended: false,
    role: "Designed & built solo",
    chrome: "snap.exe",
    thumb: { src: "/images/snap-screenshot.png", alt: "Snap's main window showing the Work workspace and its four apps" },
    media: {
      kind: "video",
      clips: [
        {
          label: "Launch button",
          caption: "Pick a workspace, press Launch — Chrome, VS Code, Claude and a terminal open together.",
          src: "/videos/snap-launch-button.mp4",
          webm: "/videos/snap-launch-button.webm",
          poster: "/videos/snap-launch-button-poster.jpg",
        },
        {
          label: "Global shortcut",
          caption: "Window closed to the tray, then Ctrl + Alt + 2 — the same workspace opens with no window in sight.",
          src: "/videos/snap-launch-shortcut.mp4",
          webm: "/videos/snap-launch-shortcut.webm",
          poster: "/videos/snap-launch-shortcut-poster.jpg",
        },
      ],
    },
    description: [
      "I built Snap for my own use case: I was tired of opening applications and tabs one by one every time I sat down to work. Snap lets me pick which apps belong together, group them into a workspace, and open that whole workspace with one shortcut.",
      "It lives in the Windows system tray, so the shortcuts keep working with the window closed. React handles the interface; Rust does the native work — launching processes, registering global shortcuts, pulling real icons out of each .exe and detecting installed apps.",
    ],
    stack: ["Tauri 2", "Rust", "React", "TypeScript", "Tailwind CSS"],
    facts: [
      { k: "Role", v: "Solo — design & build" },
      { k: "Platform", v: "Windows, system tray" },
      { k: "Shortcut", v: "Ctrl + Alt + number" },
      { k: "Storage", v: "Local JSON, no account" },
    ],
  },
  {
    id: "grid",
    name: "Grid",
    owner: "Grid Property Ventures",
    status: "Ended · Sep 2026",
    ended: true,
    role: "Front end developer",
    chrome: "grid.com.ph",
    thumb: { src: "/images/grid-screenshot.png", alt: "Grid platform screenshot" },
    media: { kind: "image", src: "/images/grid-screenshot.png", alt: "Grid platform screenshot" },
    description: [
      "A real estate property listing platform where I worked as a Front End Developer from June to September 2026, maintaining and improving the platform while building new features. My work covered developing UI components, fixing bugs, improving existing functionality, and contributing to backend development.",
    ],
    stack: GRID_STACK,
    facts: GRID_FACTS,
  },
];

/** Hero availability banner. Set `open: false` to hide it once hired. */
export const AVAILABILITY = {
  open: true,
  label: "Open to work",
  detail: "Front-end · Manila or remote",
};

export const RESUME_PATH = "/Resume-Jhon_Raven_Cadiz.pdf";

export const SOCIALS = [
  { label: "GitHub", handle: "@rav-alt", href: "https://github.com/Rav-alt" },
  { label: "LinkedIn", handle: "Jhon Raven Cadiz", href: "https://www.linkedin.com/in/jhon-raven-cadiz-63a002352/" },
  { label: "Resume", handle: "PDF", href: RESUME_PATH },
];

/** Deterministic pseudo-random `weeks` x 7-day contribution grid, each cell a
 * ramp step 0-4 (0 = empty). Density rises left-to-right, same seed every
 * render so server and client markup match. Used as the Hero graph fallback
 * when there is no GitHub token. */
export function contributionGrid(weeks = 30): number[][] {
  let seed = 483;
  const rnd = () => (seed = (seed * 1103515245 + 12345) % 2147483648) / 2147483648;
  const span = Math.max(1, weeks - 1);
  return Array.from({ length: weeks }, (_, w) =>
    Array.from({ length: 7 }, () => {
      const r = rnd();
      const p = 0.18 + 0.42 * (w / span);
      return r < p ? Math.min(4, 1 + Math.floor((r / p) * 4)) : 0;
    })
  );
}
