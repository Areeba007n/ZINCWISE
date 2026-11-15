"use client";
import dynamic from "next/dynamic";
import { MapPin } from "lucide-react";
import type { District } from "@/lib/types";
import { Panel } from "./ui";
const MapClient = dynamic(() => import("./MapClient"), { ssr: false, loading: () => <div className="map-loading">Loading district map…</div> });
export function RegionalOverview({ districts, selected, onSelect }: { districts: District[]; selected: District; onSelect: (id: string) => void }) {
  return <Panel className="regional-panel" label="District map">
    <div className="panel-heading"><span className="heading-icon pin"><MapPin /></span><h2>District Map</h2></div>
    <div className="map-wrap">
      <MapClient districts={districts} selected={selected} onSelect={onSelect} />
      <div className="map-label"><MapPin size={15} fill="currentColor" />{selected.name}</div>
    </div>
  </Panel>;
}
