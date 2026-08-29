export type Theme = "dark" | "light";

export const SPRITES: Record<Theme, string> = {
  dark: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/shiny/483.png",
  light: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/483.png",
};

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
    span: "Jun 2026 — Present",
    title: "Web Developer",
    company: "Grid Property Ventures",
    kind: "Startup",
    current: true,
    bullets: [
      "Develop and maintain the web front end for grid.com.ph, from listing pages through to the inquiry flow.",
      "Work directly with the founders: scope a change in the morning, ship it the same week.",
      "Keep the interface consistent as the product grows — shared components, one type ramp, one set of tokens.",
      "Own performance and responsiveness across desktop and mobile, where most of the traffic lands.",
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
  { k: "Status", v: "Current work" },
  { k: "Product", v: "Property listing platform" },
  { k: "Scope", v: "UI components, fixes, features" },
];

export const GRID_STACK = ["React", "Next.js", "TypeScript", "Git"];

export const SOCIALS = [
  { label: "GitHub", handle: "@rav-alt", href: "#contact" },
  { label: "LinkedIn", handle: "Jhon Raven Cadiz", href: "#contact" },
  { label: "Read.cv", handle: "ravcadiz", href: "#contact" },
];

export const MONTHS = ["Aug", "Sep", "Oct", "Nov", "Dec", "Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul"];

/** Deterministic pseudo-random 30-week x 7-day contribution grid, each cell
 * a ramp step 0-4 (0 = empty). Density rises left-to-right, same seed every
 * render so server and client markup match. */
export function contributionGrid(): number[][] {
  let seed = 483;
  const rnd = () => (seed = (seed * 1103515245 + 12345) % 2147483648) / 2147483648;
  return Array.from({ length: 30 }, (_, w) =>
    Array.from({ length: 7 }, () => {
      const r = rnd();
      const p = 0.18 + 0.42 * (w / 29);
      return r < p ? Math.min(4, 1 + Math.floor((r / p) * 4)) : 0;
    })
  );
}
