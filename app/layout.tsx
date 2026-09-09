import type { Metadata } from "next";
import { Space_Grotesk, Inter } from "next/font/google";
import "./globals.css";

// Display + body pairing. Space Grotesk carries the headings (a precise,
// slightly technical sci-fi voice that suits the steel/Dialga theme); Inter
// stays on body copy. Exposed as CSS variables and consumed in globals.css.
const display = Space_Grotesk({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-display",
  display: "swap",
});

const body = Inter({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
  variable: "--font-body",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Jhon Raven Cadiz — Front End Developer",
  description:
    "Portfolio of Jhon Raven Cadiz, a front end developer based in Manila, Philippines.",
};

// Runs before first paint: set the light/dark mode, then replay the last
// picked Pokémon's derived palette (persisted whole, so no maths or fetch
// here) as inline custom properties on <html>. Keep the storage keys and the
// cache shape in sync with hooks/useTheme.ts.
const THEME_INIT = `
(function () {
  try {
    var el = document.documentElement;
    var saved = localStorage.getItem("dialga-portfolio-theme");
    var theme = saved === "light" || saved === "dark" ? saved : "dark";
    el.setAttribute("data-theme", theme);
    var raw = localStorage.getItem("dialga-portfolio-poke");
    if (raw) {
      var vars = (JSON.parse(raw) || {})[theme];
      if (vars) for (var k in vars) el.style.setProperty(k, vars[k]);
    }
  } catch (e) {
    document.documentElement.setAttribute("data-theme", "dark");
  }
})();
`;

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      data-theme="dark"
      className={`${display.variable} ${body.variable}`}
      suppressHydrationWarning
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: THEME_INIT }} />
      </head>
      <body>{children}</body>
    </html>
  );
}
