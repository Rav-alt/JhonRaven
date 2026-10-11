import type { Metadata } from "next";
import { Young_Serif, Hanken_Grotesk } from "next/font/google";
import "./globals.css";

// Young Serif sets the name and headings; Hanken Grotesk carries everything
// else. Exposed as CSS variables and consumed through --serif / --sans in
// globals.css.
const serif = Young_Serif({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-serif",
  display: "swap",
});

const sans = Hanken_Grotesk({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-sans",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Jhon Raven Cadiz, front-end developer",
  description:
    "Portfolio of Jhon Raven Cadiz, a front-end developer in Manila, Philippines.",
};

// Runs before first paint. With no saved choice the page follows the OS
// (no data-theme attribute); a saved choice pins light or dark. Keep the
// storage key in sync with hooks/useTheme.ts.
const THEME_INIT = `
(function () {
  try {
    var saved = localStorage.getItem("jr-theme");
    if (saved === "light" || saved === "dark") document.documentElement.setAttribute("data-theme", saved);
  } catch (e) {}
})();
`;

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${serif.variable} ${sans.variable}`} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: THEME_INIT }} />
      </head>
      <body>{children}</body>
    </html>
  );
}
