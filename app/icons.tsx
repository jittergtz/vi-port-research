import type { ReactNode } from "react";

const shapes = {
  arrow: <path d="M4 12h15m-6-6 6 6-6 6" />,
  back: <path d="M20 12H5m6-6-6 6 6 6" />,
  diagonal: <path d="M6 18 18 6M8 6h10v10" />,
  sun: <><circle cx="12" cy="12" r="4" /><path d="M12 2v2m0 16v2M2 12h2m16 0h2M5 5l1.5 1.5m11 11L19 19m0-14-1.5 1.5m-11 11L5 19" /></>,
  moon: <path d="M20.8 14.1A9 9 0 0 1 9.9 3.2 9 9 0 1 0 20.8 14.1Z" />,
  xbox: <><rect x="3" y="5" width="18" height="14" rx="3" /><path d="M7 12h4m-2-2v4m6-2h.01m3-2h.01" /></>,
  monitor: <><rect x="3" y="4" width="18" height="13" rx="2" /><path d="M12 17v4m-4 0h8" /></>,
  branch: <><circle cx="6" cy="6" r="2" /><circle cx="6" cy="18" r="2" /><circle cx="18" cy="6" r="2" /><path d="M6 8v8m12-8a6 6 0 0 1-6 6H6" /></>,
  pulse: <path d="M3 12h4l3-6 4 12 3-6h4" />,
} satisfies Record<string, ReactNode>;

export function Icon({ name, className }: { name: keyof typeof shapes; className?: string }) {
  return (
    <svg aria-hidden="true" className={className} width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
      {shapes[name]}
    </svg>
  );
}
