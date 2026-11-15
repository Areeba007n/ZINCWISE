import type { District } from "@/lib/types";
import { MapPin } from "lucide-react";
export function Hero({ selected }: { selected: District }) { return <section id="top" className="hero"><div className="hero-copy"><h1>Grow Smarter.<br />Think Beyond Yield.</h1><p>Explore how climate conditions, soil characteristics and crop rotations may influence the nutritional quality of wheat.</p><span className="hero-location"><MapPin size={14} aria-hidden="true" />Viewing {selected.name}, {selected.zone}</span></div></section>; }
