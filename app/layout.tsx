import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Jhon Raven Cadiz — Front End Developer",
  description:
    "Portfolio of Jhon Raven Cadiz, a front end developer based in Manila, Philippines.",
};

const THEME_INIT = `
(function () {
  try {
    var saved = localStorage.getItem("dialga-portfolio-theme");
    var theme = saved === "light" || saved === "dark" ? saved : "dark";
    document.documentElement.setAttribute("data-theme", theme);
  } catch (e) {
    document.documentElement.setAttribute("data-theme", "dark");
  }
})();
`;

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" data-theme="dark">
      <head>
        <script dangerouslySetInnerHTML={{ __html: THEME_INIT }} />
      </head>
      <body>{children}</body>
    </html>
  );
}
