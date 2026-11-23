import type { Metadata } from "next";
import Link from "next/link";
import { SiteNav } from "./site-nav";
import { ThemeToggle } from "./theme-toggle";
import "./globals.css";

export const metadata: Metadata = {
  title: { default: "VI Port Journal", template: "%s | VI Port Journal" },
  description: "An independent developer journal tracking Leonida’s effort to run GTA VI’s Xbox Series build on PC.",
};

const themeScript = `try {
  const theme = localStorage.getItem("vi-theme");
  if (theme === "light" || theme === "dark") document.documentElement.dataset.theme = theme;
} catch {}`;

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head><script dangerouslySetInnerHTML={{ __html: themeScript }} /></head>
      <body className="min-h-screen flex flex-col antialiased">
        <a className="skip-link" href="#main-content">Skip to content</a>
        <header className="site-header">
          <div className="shell header-row">
            <Link className="brand" href="/">VI Port Journal</Link>
            <div className="header-actions">
              <SiteNav />
              <ThemeToggle />
            </div>
          </div>
        </header>
        {children}
        <footer className="site-footer">
          <div className="shell flex flex-wrap items-center justify-between gap-3">
            <Link className="footer-brand" href="/">VI Port Journal</Link>
            <p>Independent research journal · Unofficial coverage of Leonida</p>
          </div>
        </footer>
      </body>
    </html>
  );
}
