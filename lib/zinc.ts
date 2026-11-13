import type { Risk, Soil } from "./types";

// PLACEHOLDER thresholds: confirm with the research team before scientific use.
export const HIGH_PH = 7.5;
// PLACEHOLDER threshold: confirm with the research team before scientific use.
export const LOW_ZINC_MG_KG = 0.5;
// PLACEHOLDER threshold: confirm with the research team before scientific use.
export const HIGH_CLAY_PCT = 30;
export type ZincAssessment = { risk: Risk; tone: "warning" | "ok" | "info"; message: string };
export function assessZinc(soil: Soil): ZincAssessment {
  if (soil.zinc_mg_kg < LOW_ZINC_MG_KG || (soil.ph > HIGH_PH && soil.clay_pct >= HIGH_CLAY_PCT)) return { risk: "high", tone: "warning", message: "High soil pH and clay content may reduce zinc availability for wheat." };
  if (soil.ph > HIGH_PH || soil.zinc_mg_kg < 0.7) return { risk: "moderate", tone: "info", message: "Conditions may limit zinc availability. Consider confirming with a lab test." };
  return { risk: "low", tone: "ok", message: "Current indicators suggest a lower zinc-availability concern." };
}
