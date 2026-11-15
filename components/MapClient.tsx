"use client";

import { useEffect } from "react";
import { CircleMarker, MapContainer, Marker, Popup, TileLayer, Tooltip, useMap } from "react-leaflet";
import L from "leaflet";
import type { District } from "@/lib/types";
import { getUrduDistrictName } from "@/lib/district-names";

const markerIcon = L.divIcon({ className: "map-pin", html: '<span aria-hidden="true"></span>', iconSize: [28, 32], iconAnchor: [14, 30] });
const ZOOM = 9;

function FlyTo({ district }: { district: District }) {
  const map = useMap();
  useEffect(() => {
    map.flyTo([district.lat, district.lng], ZOOM, { duration: 0.75 });
  }, [district.id, district.lat, district.lng, map]);
  return null;
}

export default function MapClient({ districts, selected, onSelect }: { districts: District[]; selected: District; onSelect: (id: string) => void }) {
  return <MapContainer center={[selected.lat, selected.lng]} zoom={ZOOM} scrollWheelZoom className="leaflet-map" aria-label="District locator map">
    <TileLayer attribution="&copy; OpenStreetMap contributors" url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
    <FlyTo district={selected} />
    {districts.filter((district) => district.id !== selected.id).map((district) => <CircleMarker
      key={district.id}
      center={[district.lat, district.lng]}
      radius={5}
      pathOptions={{ color: "#ffffff", weight: 1.5, fillColor: "#267556", fillOpacity: 0.85 }}
      eventHandlers={{ click: () => onSelect(district.id) }}
    ><Tooltip><span>{district.name} <span className="district-name-urdu" lang="ur" dir="rtl">{getUrduDistrictName(district.id)}</span></span></Tooltip></CircleMarker>)}
    <Marker position={[selected.lat, selected.lng]} icon={markerIcon}>
      <Popup><b>{selected.name}</b> <span className="district-name-urdu" lang="ur" dir="rtl">{getUrduDistrictName(selected.id)}</span><br />{selected.zone}</Popup>
    </Marker>
  </MapContainer>;
}
