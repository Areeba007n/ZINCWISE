import { Lightbulb, Leaf, Orbit, RefreshCw } from "lucide-react";
import type { District } from "@/lib/types";
import { Panel } from "./ui";
const iconFor = (title: string) => title.includes("Climate") ? <Leaf/> : title.includes("Rotation") ? <RefreshCw/> : <Orbit/>;
export function KeyInsights({ district }: { district: District }) { return <Panel className="insights-panel" label="Key insights"><div className="panel-heading"><span className="heading-icon bulb"><Lightbulb /></span><h2>Key Insights</h2></div><div className="insight-list">{district.insights.map((insight) => <article key={insight.title}><span>{iconFor(insight.title)}</span><h3>{insight.title}</h3><p>{insight.text}</p></article>)}</div></Panel>; }
