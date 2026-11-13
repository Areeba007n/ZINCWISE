import type { ReactNode } from "react";
export function Panel({ children, className = "", label }: { children: ReactNode; className?: string; label?: string }) { return <section className={`panel ${className}`} aria-label={label}>{children}</section>; }
export function StatusChip({ children, tone = "neutral" }: { children: ReactNode; tone?: "high" | "moderate" | "low" | "neutral" }) { return <span className={`chip chip-${tone}`}>{children}</span>; }
