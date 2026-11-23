"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const links = [
  { href: "/#journal", label: "Journal", match: (path: string) => path === "/" || path.startsWith("/journal") },
  { href: "/status", label: "Status", match: (path: string) => path.startsWith("/status") },
];

export function SiteNav() {
  const pathname = usePathname();

  return (
    <nav aria-label="Main navigation" className="site-nav">
      {links.map(({ href, label, match }) => {
        const current = match(pathname);
        return (
          <Link key={label} href={href} aria-current={current ? "page" : undefined}>
            {label}
          </Link>
        );
      })}
    </nav>
  );
}
