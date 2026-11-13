"use client";
import { useEffect } from "react";
import { GeoJSON, MapContainer, Marker, Popup, TileLayer, useMap } from "react-leaflet";
import L, { type PathOptions } from "leaflet";
import type { FeatureCollection } from "geojson";
import geojson from "@/data/punjab-districts.geojson";
import type { District, Risk } from "@/lib/types";
const colors: Record<Risk, string> = { high: "#e85a55", moderate: "#f5cd55", low: "#9dd231" };
const markerIcon = L.divIcon({ className: "map-pin", html: "<span>●</span>", iconSize: [18,18], iconAnchor: [9,9] });
function FlyTo({ district }: { district: District }) { const map = useMap(); useEffect(() => { map.flyTo([district.lat, district.lng], 8, { duration: 0.75 }); }, [district, map]); return null; }
export default function MapClient({ districts, selected, onSelect }: { districts: District[]; selected: District; onSelect: (id: string) => void }) {
  const riskById = Object.fromEntries(districts.map((d) => [d.id, d.zinc_risk]));
  return <MapContainer center={[selected.lat, selected.lng]} zoom={8} scrollWheelZoom className="leaflet-map" aria-label="Punjab zinc deficiency risk map"><TileLayer attribution="&copy; OpenStreetMap contributors" url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" /><FlyTo district={selected}/><GeoJSON data={geojson as FeatureCollection} style={(feature): PathOptions => ({ color: "#f8fbf4", weight: feature?.properties?.id === selected.id ? 3 : 1.3, fillColor: colors[riskById[feature?.properties?.id] as Risk] ?? "#9dd231", fillOpacity: 0.54 })} onEachFeature={(feature, layer) => { const d = districts.find((district) => district.id === feature.properties?.id); if (!d) return; layer.bindTooltip(`<b>${d.name}</b><br/>${d.zinc_risk} estimated risk`, { sticky: true }); layer.on("click", () => onSelect(d.id)); }}/><Marker position={[selected.lat, selected.lng]} icon={markerIcon}><Popup><b>{selected.name}</b><br />{selected.region}</Popup></Marker></MapContainer>;
}
