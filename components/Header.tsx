"use client";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { ChevronDown, MapPin, Search } from "lucide-react";
import type { District } from "@/lib/types";
import { getUrduDistrictName } from "@/lib/district-names";

export function Header({ districts, selected, onSelect }: { districts: District[]; selected: District; onSelect: (id: string) => void }) {
  const [open, setOpen] = useState(false), [query, setQuery] = useState(""), [active, setActive] = useState(0);
  const root = useRef<HTMLDivElement>(null);
  const results = districts.filter((d) => `${d.name} ${getUrduDistrictName(d.id)} ${d.zone}`.toLowerCase().includes(query.toLowerCase()));
  useEffect(() => { const close = (e: MouseEvent) => { if (!root.current?.contains(e.target as Node)) setOpen(false); }; document.addEventListener("mousedown", close); return () => document.removeEventListener("mousedown", close); }, []);
  const choose = (id: string) => { onSelect(id); setQuery(""); setOpen(false); };
  return <header className="site-header"><a className="brand" href="#top" aria-label="ZincWise home"><Image className="brand-logo" src="/zincwise-logo.jpg" alt="" width={55} height={55} priority /><span>ZINCWISE</span></a><span className="brand-subtitle">Climate-Smart Agriculture <i /> Pakistan</span>
    <div className="location-picker" ref={root}><button className="location-button" onClick={() => setOpen((value) => !value)} aria-expanded={open} aria-controls="location-menu"><MapPin size={19} fill="currentColor" /> <span className="location-name"><span>{selected.name}, Punjab</span><span className="district-name-urdu" lang="ur" dir="rtl">{getUrduDistrictName(selected.id)}، پنجاب</span></span><ChevronDown size={17} /></button>
      {open && <div className="location-menu" id="location-menu"><label><Search size={16} /><input autoFocus value={query} onChange={(e) => { setQuery(e.target.value); setActive(0); }} placeholder="Search a district" onKeyDown={(e) => { if (e.key === "ArrowDown") { e.preventDefault(); setActive((v) => Math.min(v + 1, results.length - 1)); } if (e.key === "ArrowUp") { e.preventDefault(); setActive((v) => Math.max(v - 1, 0)); } if (e.key === "Enter" && results[active]) choose(results[active].id); if (e.key === "Escape") setOpen(false); }} /></label>{results.length ? <ul role="listbox">{results.map((d, index) => <li key={d.id}><button className={index === active ? "active" : ""} onMouseEnter={() => setActive(index)} onClick={() => choose(d.id)} role="option" aria-selected={d.id === selected.id}><span className="location-option-name"><span>{d.name}</span><span className="district-name-urdu" lang="ur" dir="rtl">{getUrduDistrictName(d.id)}</span></span><small>{d.zone}</small></button></li>)}</ul> : <p className="no-results">No locations found.</p>}</div>}
    </div></header>;
}
