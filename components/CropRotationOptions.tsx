import { RefreshCw, Sprout } from "lucide-react";
import type { District } from "@/lib/types";
import { Panel, StatusChip } from "./ui";

const suitabilityLabel = { high: "Highly Recommended", moderate: "Moderately Suitable", low: "Not Recommended" } as const;
const suitabilityOrder = { high: 0, moderate: 1, low: 2 } as const;
const suitabilityTone = { high: "low", moderate: "moderate", low: "high" } as const;

export function CropRotationOptions({ district }: { district: District }) {
  const rotations = [...district.rotations].sort((a, b) => suitabilityOrder[a.suitability] - suitabilityOrder[b.suitability]);
  return <Panel className="rotation-panel" label="Crop rotation options">
    <div className="panel-heading"><span className="heading-icon rotate"><RefreshCw /></span><h2>Crop Rotation Options</h2></div>
    <p className="rotation-intro">Dataset-based options for {district.name}, ordered from most to least suitable.</p>
    <div className="rotation-list">{rotations.map((rotation) => {
      const statusDetail = rotation.status.match(/\((.+)\)/)?.[1];
      return <article className={`rotation ${rotation.suitability === "high" ? "recommended" : ""}`} key={rotation.name}>
        <span className="rotation-icon"><Sprout size={26} /></span>
        <div className="rotation-copy">
          <h3>{rotation.name}</h3>
          <p>{rotation.insight}</p>
          {statusDetail && <small>{statusDetail}</small>}
        </div>
        <StatusChip tone={suitabilityTone[rotation.suitability]}>{suitabilityLabel[rotation.suitability]}</StatusChip>
      </article>;
    })}</div>
  </Panel>;
}