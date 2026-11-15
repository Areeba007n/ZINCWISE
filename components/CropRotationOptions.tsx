import { RefreshCw, Sprout } from "lucide-react";
import type { District } from "@/lib/types";
import { getUrduDistrictName } from "@/lib/district-names";
import { Panel, StatusChip } from "./ui";

const suitabilityLabel = { high: "Highly Recommended", moderate: "Moderately Suitable", low: "Not Recommended" } as const;
const suitabilityTone = { high: "low", moderate: "moderate", low: "high" } as const;

export function CropRotationOptions({ district }: { district: District }) {
  const rotations = [...district.rotations].sort((a, b) => b.nextWheatZnMgKg - a.nextWheatZnMgKg);
  return <Panel className="rotation-panel" label="Crop rotation options">
    <div className="panel-heading"><span className="heading-icon rotate"><RefreshCw /></span><h2>Crop Rotation Options</h2></div>
    <p className="rotation-intro">Dataset-based options for {district.name} <span className="district-name-urdu" lang="ur" dir="rtl">{getUrduDistrictName(district.id)}</span>, ordered by predicted zinc in the next wheat crop.</p>
    <div className="rotation-list">{rotations.map((rotation) => {
      const statusDetail = rotation.status.match(/\((.+)\)/)?.[1];
      return <article className={`rotation ${rotation.suitability === "high" ? "recommended" : ""}`} key={rotation.name}>
        <span className="rotation-icon"><Sprout size={26} /></span>
        <div className="rotation-copy">
          <h3>{rotation.name}</h3>
          <p>{rotation.insight}</p>
          {statusDetail && <small>{statusDetail}</small>}
          <small>Predicted crop Zn: {rotation.rotationCropZnMgKg.toFixed(2)} mg/kg · next wheat: {rotation.nextWheatZnMgKg.toFixed(2)} mg/kg</small>
        </div>
        <StatusChip tone={suitabilityTone[rotation.suitability]}>{suitabilityLabel[rotation.suitability]}</StatusChip>
      </article>;
    })}</div>
  </Panel>;
}
