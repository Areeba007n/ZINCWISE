import { Leaf, Lightbulb, Orbit, RefreshCw } from "lucide-react";
import type { District } from "@/lib/types";
import { Panel } from "./ui";

const tierLabel = { high: "Highly recommended", moderate: "Moderately suitable", low: "Not recommended" } as const;

export function KeyInsights({ district }: { district: District }) {
  const { postWheat } = district;
  const tier = (["high", "moderate", "low"] as const).find((level) => district.rotations.some((rotation) => rotation.suitability === level))!;
  const bestFit = district.rotations.filter((rotation) => rotation.suitability === tier).map((rotation) => rotation.name).join("; ");
  const insights = [
    { title: "Best-fit rotation", text: `${tierLabel[tier]}: ${bestFit}.`, icon: <RefreshCw /> },
    { title: "Agro-ecological zone", text: `${district.name} lies in the ${district.zone} zone${district.zoneType ? ` (${district.zoneType})` : ""}.`, icon: <Leaf /> },
    { title: "Post-wheat conditions", text: `Air temperature ${postWheat.temp_c} °C, rainfall ${postWheat.rain_mm} mm and root-zone moisture ${postWheat.root_zone_moisture_pct}% after the wheat harvest.`, icon: <Orbit /> },
  ];

  return <Panel className="insights-panel" label="Crop rotation key insights">
    <div className="panel-heading"><span className="heading-icon bulb"><Lightbulb /></span><h2>Key Insights</h2></div>
    <p className="insight-intro">What the supplied dataset indicates for {district.name}.</p>
    <div className="insight-list">{insights.map((insight) => <article key={insight.title}>
      <span>{insight.icon}</span><h3>{insight.title}</h3><p>{insight.text}</p>
    </article>)}</div>
  </Panel>;
}