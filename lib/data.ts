/** Content for the whole site. Copy lives here so components stay about
 * layout and behavior. */

export const NAME = "Jhon Raven Cadiz";
export const EMAIL = "jhonravencadiz02@gmail.com";
export const RESUME_PATH = "/Resume-Jhon_Raven_Cadiz.pdf";

/** Sidebar availability line. Set `open: false` once hired. */
export const AVAILABILITY = {
  open: true,
  label: "Open to front-end roles",
  detail: "Front-end roles, Manila or remote",
};

export const LEDE =
  "Kumusta! I'm a front-end developer in Manila. I build interfaces for the web and the desktop: property listings at Grid, a commute chatbot for Metro Manila, a Pokémon guessing game, and a Windows app that opens a whole workspace with one shortcut.";

export const SOCIALS = [
  { label: "GitHub", handle: "@rav-alt", href: "https://github.com/Rav-alt" },
  { label: "LinkedIn", handle: "Jhon Raven Cadiz", href: "https://www.linkedin.com/in/jhon-raven-cadiz-63a002352/" },
];

/** Sections in page order; drives the sidebar nav and the scroll-spy. */
export const SECTIONS = [
  { id: "work", label: "Work" },
  { id: "personal", label: "Personal projects" },
  { id: "experience", label: "Experience" },
  { id: "stack", label: "Stack" },
  { id: "activity", label: "Activity" },
  { id: "contact", label: "Contact" },
] as const;

export type Role = {
  span: string;
  title: string;
  company: string;
  kind: string;
  bullets: string[];
};

export const ROLES: Role[] = [
  {
    span: "Jun to Sep 2026",
    title: "Web developer",
    company: "Grid Property Ventures",
    kind: "Full-time",
    bullets: [
      "Developed and maintained the web front end for grid.com.ph, from listing pages through to the inquiry flow.",
      "Worked directly with the founders: scoped a change in the morning, shipped it the same week.",
      "Kept the interface consistent as the product grew, with shared components, one type ramp and one set of tokens.",
      "Owned performance and responsiveness across desktop and mobile, where most of the traffic lands.",
    ],
  },
  {
    span: "Feb to Apr 2026",
    title: "Web and mobile developer intern",
    company: "Grid Property Ventures",
    kind: "Internship",
    bullets: [
      "Built and shipped front-end features alongside the web team on a live property platform.",
      "Turned designs into responsive components, then followed them through review and release.",
      "Learned the codebase well enough to be brought back onto the team full-time.",
    ],
  },
];

/** The stack, grouped by the job each tool does. */
export const STACK: { group: string; items: string[] }[] = [
  { group: "Languages", items: ["TypeScript", "JavaScript", "Rust"] },
  { group: "Front end", items: ["React 19", "Next.js", "Tailwind CSS", "shadcn/ui", "Radix UI", "React Native"] },
  { group: "Desktop", items: ["Tauri 2"] },
  { group: "Back end and data", items: ["Node.js", "MongoDB", "GTFS", "PokéAPI", "GitHub GraphQL API"] },
  { group: "AI and maps", items: ["Gemini", "Leaflet"] },
  { group: "Shipping", items: ["Git", "GitHub", "Vercel", "DigitalOcean", "Claude Code"] },
];

/** One screen recording. Files live in /public/videos; keep names lowercase
 * (Windows ignores case, the production server doesn't). `src` is the H.264 MP4 every major browser plays; `webm` is a VP9 fallback
 * for the few that ship without H.264. */
export type ProjectClip = {
  label: string;
  caption: string;
  src: string;
  webm: string;
  poster: string;
  /** The file has a soundtrack. The player still starts muted (browsers block
   * autoplay with sound) and shows a speaker button to turn it on. */
  audio?: boolean;
};

export type ProjectMedia =
  | { kind: "image"; src: string; alt: string }
  | { kind: "video"; clips: ProjectClip[] };

export type Project = {
  id: string;
  name: string;
  /** Company, or what kind of thing it is for personal work. */
  owner: string;
  /** Work goes under "Work", everything else under "Personal projects". */
  group: "work" | "personal";
  /** When and in what state, e.g. "Live, 2026". */
  status: string;
  role: string;
  /** Text in the modal's window bar: a URL for sites, a file name for apps. */
  chrome: string;
  /** Live URL. When set, the window-bar text becomes a link to it. */
  href?: string;
  /** `fit: "contain"` for screenshots too square to crop into the 16:10 frame. */
  thumb: { src: string; alt: string; fit?: "contain" };
  media: ProjectMedia;
  description: string[];
  stack: string[];
  facts: { k: string; v: string }[];
};

export const PROJECTS: Project[] = [
  {
    id: "bai",
    name: "B.AI",
    owner: "Metro Manila commute chatbot",
    group: "personal",
    status: "Live, 2026",
    role: "Designed and built solo",
    chrome: "bai-wine.vercel.app",
    href: "https://bai-wine.vercel.app",
    thumb: { src: "/images/bai-screenshot.png", alt: "B.AI answer telling a commuter to flag down the bus with the signboard Baclaran – SM Fairview" },
    media: {
      kind: "video",
      clips: [
        {
          label: "Promo",
          caption: "Fifty seconds from Pedro Gil Taft to España: asked in Taglish, answered with the signboard to flag down, a map, and a yes or no on bus versus jeep.",
          src: "/videos/bai-promo.mp4",
          webm: "/videos/bai-promo.webm",
          poster: "/videos/bai-promo-poster.jpg",
        },
      ],
    },
    description: [
      "A commute buddy for Metro Manila. Google Maps draws a line on a map, but it doesn't tell you which signboard to look for. B.AI answers the way a fellow commuter would: which jeep, bus or train to board, where to flag it down, where to get off and where to transfer, with a map under every answer.",
      "Ask in English, Tagalog or Taglish, by landmark, station or street corner. The AI only reads the question and writes the reply; the routing itself is plain TypeScript over 4,887 stops and 1,721 route patterns from the DOTC GTFS feed, so it never invents a route. It also checks named options (\"bus to SM Fairview or jeep to Divisoria?\") and runs entirely on free tiers.",
    ],
    stack: ["Next.js 16", "TypeScript", "Gemini", "Leaflet", "GTFS", "Tailwind CSS"],
    facts: [
      { k: "Role", v: "Solo, design and build" },
      { k: "Modes", v: "Jeep, bus, LRT / MRT" },
      { k: "Data", v: "DOTC GTFS, 4,887 stops" },
      { k: "Hosting", v: "Vercel, free tiers only" },
    ],
  },
  {
    id: "whothatpokemon",
    name: "Who's That Pokémon?",
    owner: "Browser guessing game",
    group: "personal",
    status: "Live, 2026",
    role: "Designed and built solo",
    chrome: "whothatpokemon.vercel.app",
    href: "https://whothatpokemon.vercel.app",
    thumb: { src: "/images/whothatpokemon-screenshot.png", alt: "Who's That Pokémon home page with a face-down card and three game-mode cards" },
    media: {
      kind: "video",
      clips: [
        {
          label: "Trailer",
          caption: "Thirty seconds of all three modes: a classic round caught in four cards, a shadow named, and a Higher or Lower streak.",
          src: "/videos/whothatpokemon-trailer.mp4",
          webm: "/videos/whothatpokemon-trailer.webm",
          poster: "/videos/whothatpokemon-trailer-poster.jpg",
          audio: true,
        },
      ],
    },
    description: [
      "A Pokémon guessing game dealt like a trading-card duel. Every guess lands on the table as a card and is scored against the mystery Pokémon on type, generation, evolution stage, colour, habitat and size: green for a match, amber for close, arrows for higher or lower.",
      "It has three modes: Classic, Shadow Sprite (name the silhouette before it lights up) and Higher or Lower (call which Pokémon is heavier, taller or stronger and chase a streak). All 1,025 Pokémon load live from PokéAPI through a small cached client, and game state stays in the browser, so there's no account to make.",
    ],
    stack: ["Next.js 16", "React 19", "TypeScript", "Tailwind CSS", "shadcn/ui", "PokéAPI"],
    facts: [
      { k: "Role", v: "Solo, design and build" },
      { k: "Modes", v: "Classic, Shadow, Higher or Lower" },
      { k: "Data", v: "PokéAPI, Gen 1–9" },
      { k: "Hosting", v: "Vercel, no account" },
    ],
  },
  {
    id: "snap",
    name: "Snap",
    owner: "Windows desktop utility",
    group: "personal",
    status: "Personal tool, 2026",
    role: "Designed and built solo",
    chrome: "snap.exe",
    thumb: { src: "/images/snap-screenshot.png", alt: "Snap's main window showing the Work workspace and its four apps", fit: "contain" },
    media: {
      kind: "video",
      clips: [
        {
          label: "Launch button",
          caption: "Pick a workspace and press Launch: Chrome, VS Code, Claude and a terminal open together.",
          src: "/videos/snap-launch-button.mp4",
          webm: "/videos/snap-launch-button.webm",
          poster: "/videos/snap-launch-button-poster.jpg",
        },
        {
          label: "Global shortcut",
          caption: "Window closed to the tray, then Ctrl + Alt + 2. The same workspace opens with no window in sight.",
          src: "/videos/snap-launch-shortcut.mp4",
          webm: "/videos/snap-launch-shortcut.webm",
          poster: "/videos/snap-launch-shortcut-poster.jpg",
        },
      ],
    },
    description: [
      "I built Snap for my own use case: I was tired of opening applications and tabs one by one every time I sat down to work. Snap lets me pick which apps belong together, group them into a workspace, and open that whole workspace with one shortcut.",
      "It lives in the Windows system tray, so the shortcuts keep working with the window closed. React handles the interface and Rust does the native work: launching processes, registering global shortcuts, pulling real icons out of each .exe and detecting installed apps.",
    ],
    stack: ["Tauri 2", "Rust", "React", "TypeScript", "Tailwind CSS"],
    facts: [
      { k: "Role", v: "Solo, design and build" },
      { k: "Platform", v: "Windows, system tray" },
      { k: "Shortcut", v: "Ctrl + Alt + number" },
      { k: "Storage", v: "Local JSON, no account" },
    ],
  },
  {
    id: "grid",
    name: "Grid",
    owner: "Grid Property Ventures",
    group: "work",
    status: "Jun to Sep 2026",
    role: "Front-end developer",
    chrome: "grid.com.ph",
    href: "https://grid.com.ph",
    thumb: { src: "/images/grid-screenshot.png", alt: "Grid platform screenshot" },
    media: { kind: "image", src: "/images/grid-screenshot.png", alt: "Grid platform screenshot" },
    description: [
      "grid.com.ph is a property listing platform in the Philippines. I worked on it as a front-end developer from June to September 2026, after an internship on the same team earlier in the year.",
      "I built UI components, fixed bugs, improved existing features and shipped new ones, with some backend work along the way. Most visitors arrive on phones, so every change had to hold up on a small screen first.",
    ],
    stack: ["React", "Next.js", "TypeScript", "shadcn/ui", "Git"],
    facts: [
      { k: "Role", v: "Front-end developer" },
      { k: "Dates", v: "Jun to Sep 2026" },
      { k: "Product", v: "Property listing platform" },
      { k: "Scope", v: "UI components, fixes, features" },
    ],
  },
];

/** Deterministic pseudo-random `weeks` x 7-day contribution grid, each cell a
 * ramp step 0-4 (0 = empty). Density rises left-to-right, same seed every
 * render so server and client markup match. Used as the activity graph fallback
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
