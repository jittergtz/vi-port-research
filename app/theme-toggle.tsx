"use client";

import { Icon } from "./icons";

export function ThemeToggle() {
  function toggleTheme() {
    const root = document.documentElement;
    const current = getComputedStyle(root).colorScheme;
    const next = current === "dark" ? "light" : "dark";
    root.dataset.theme = next;
    try {
      localStorage.setItem("vi-theme", next);
    } catch {
      // Keep the theme active for this page if storage is unavailable.
    }
  }

  return (
    <button className="theme-toggle" type="button" onClick={toggleTheme}>
      <span className="theme-light"><Icon name="moon" /><span className="sr-only">Switch to dark mode</span></span>
      <span className="theme-dark"><Icon name="sun" /><span className="sr-only">Switch to light mode</span></span>
    </button>
  );
}
