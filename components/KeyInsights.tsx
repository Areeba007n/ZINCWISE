import { Atom, CloudSun, Lightbulb, RefreshCw } from "lucide-react";
import type { District } from "@/lib/types";
import { getUrduDistrictName } from "@/lib/district-names";
import { Panel } from "./ui";

export function KeyInsights({ district }: { district: District }) {
  const { postWheat } = district;
  const best = [...district.rotations].sort((a, b) => b.nextWheatZnMgKg - a.nextWheatZnMgKg)[0];
  const insights = [
    { title: "Best-fit rotation", text: `${best.name}: predicted next-wheat zinc ${best.nextWheatZnMgKg.toFixed(2)} mg/kg (${best.status}).`, icon: <RefreshCw /> },
    { title: "Zinc bioavailability index", text: `${postWheat.zn_bioavailability_index} for ${district.name} (${getUrduDistrictName(district.id)}; ${district.zone}${district.zoneType ? `, ${district.zoneType}` : ""}).`, icon: <Atom aria-hidden="true" /> },
    { title: "Post-wheat conditions", text: `Air temperature ${postWheat.temp_c} °C, rainfall ${postWheat.rain_mm} mm and root-zone moisture ${postWheat.root_zone_moisture_pct}% after the wheat harvest.`, icon: <CloudSun aria-hidden="true" /> },
  ];

  return <Panel className="insights-panel" label="Crop rotation key insights">
    <div className="panel-heading"><span className="heading-icon bulb"><Lightbulb aria-hidden="true" /></span><h2>Key Insights</h2></div>
    <p className="insight-intro">What the supplied dataset indicates for {district.name} <span className="district-name-urdu" lang="ur" dir="rtl">{getUrduDistrictName(district.id)}</span>.</p>
    <div className="insight-list">{insights.map((insight) => <article key={insight.title}>
      <span>{insight.icon}</span><h3>{insight.title}</h3><p>{insight.text}</p>
    </article>)}</div>
  </Panel>;
}
