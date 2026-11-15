export type SoilInput = { ph?: number; organic_carbon_pct?: number; clay_pct?: number; zinc_mg_kg?: number };
export type SoilKey = keyof SoilInput;
export type Level = "low" | "moderate" | "high";
export type Concern = "none" | "watch" | "attention";

/*
 * Reference ranges used to label each lab value Low / Moderate / High.
 * The supplied project files contain no soil reference ranges, so these are
 * widely used screening ranges for wheat soils in South Asia. They are named
 * constants so the research team can confirm or replace them in one place.
 *   pH    : >7.5 is alkaline; zinc solubility falls as pH rises.
 *   OC    : Soil Health Card style classes (<0.50 low, 0.50-0.75 medium, >0.75 high).
 *   Clay  : <20 light, 20-40 medium, >40 heavy texture.
 *   Zinc  : DTPA-extractable Zn critical level for cereals ~0.5 mg/kg; 0.5-1.0 marginal.
 */
const RANGES: Record<SoilKey, { name: string; unit: string; lowBelow: number; highAbove: number; reference: string }> = {
  ph: { name: "Soil pH", unit: "", lowBelow: 6.5, highAbove: 7.5, reference: "Low < 6.5 · Moderate 6.5–7.5 · High > 7.5" },
  organic_carbon_pct: { name: "Organic Carbon", unit: "%", lowBelow: 0.5, highAbove: 0.75, reference: "Low < 0.50 · Moderate 0.50–0.75 · High > 0.75" },
  clay_pct: { name: "Clay Content", unit: "%", lowBelow: 20, highAbove: 40, reference: "Low < 20 · Moderate 20–40 · High > 40" },
  zinc_mg_kg: { name: "Extractable Zinc (DTPA)", unit: "mg/kg", lowBelow: 0.5, highAbove: 1, reference: "Low < 0.5 · Moderate 0.5–1.0 · High > 1.0" },
};

export const SOIL_KEYS = Object.keys(RANGES) as SoilKey[];

const MESSAGES: Record<SoilKey, Record<Level, string>> = {
  ph: {
    low: "Acidic to near-neutral pH; zinc is generally more soluble here than in alkaline soil.",
    moderate: "Near-neutral to slightly alkaline; zinc availability starts to decline as pH rises.",
    high: "Alkaline pH is associated with lower zinc solubility and availability to wheat.",
  },
  organic_carbon_pct: {
    low: "Low organic carbon; less organic matter is available to help keep zinc in plant-available forms.",
    moderate: "Moderate organic carbon; regular organic inputs help maintain nutrient availability.",
    high: "Organic carbon is relatively high, which supports nutrient cycling.",
  },
  clay_pct: {
    low: "Light-textured soil; it holds little water and nutrients, so rainfall and moisture matter more.",
    moderate: "Medium texture; interpret together with pH and zinc.",
    high: "Heavy clay can bind zinc more strongly and slow its movement to roots.",
  },
  zinc_mg_kg: {
    low: "Below the commonly used critical level for cereals; zinc deficiency in wheat is likely.",
    moderate: "Marginal range; zinc response is possible, especially under high pH.",
    high: "Above the marginal range; this laboratory value does not indicate zinc deficiency.",
  },
};

// Level -> how much it matters for zinc availability (drives the chip colour).
const CONCERN: Record<SoilKey, Record<Level, Concern>> = {
  ph: { low: "none", moderate: "watch", high: "attention" },
  organic_carbon_pct: { low: "attention", moderate: "watch", high: "none" },
  clay_pct: { low: "none", moderate: "watch", high: "watch" },
  zinc_mg_kg: { low: "attention", moderate: "watch", high: "none" },
};

export type SoilFinding = { key: SoilKey; name: string; value: number; unit: string; level: Level; label: string; concern: Concern; reference: string; message: string };
export type ZincAssessment = { title: string; tone: "warning" | "info" | "ok"; findings: SoilFinding[]; insights: string[] };

const levelOf = (key: SoilKey, value: number): Level => {
  const { lowBelow, highAbove } = RANGES[key];
  return value < lowBelow ? "low" : value > highAbove ? "high" : "moderate";
};

export function assessZinc(soil: SoilInput): ZincAssessment {
  const findings: SoilFinding[] = SOIL_KEYS.flatMap((key) => {
    const value = soil[key];
    if (value === undefined) return [];
    const level = levelOf(key, value);
    const { name, unit, reference } = RANGES[key];
    return [{ key, name, value, unit, level, label: level[0].toUpperCase() + level.slice(1), concern: CONCERN[key][level], reference, message: MESSAGES[key][level] }];
  });
  const level = (key: SoilKey) => findings.find((finding) => finding.key === key)?.level;
  const insights: string[] = [];

  if (level("zinc_mg_kg") === "low") {
    insights.push(level("ph") === "high"
      ? "Low laboratory zinc together with high pH points to limited zinc supply for wheat. Discuss zinc fertiliser options with a local agronomist."
      : "Low laboratory zinc points to limited zinc supply for wheat. Discuss zinc fertiliser options with a local agronomist.");
  } else if (level("ph") === "high" && level("zinc_mg_kg") === undefined) {
    insights.push("High pH can reduce zinc availability, but pH alone cannot show how much zinc is in the soil. Ask the laboratory for a DTPA zinc test to confirm.");
  } else if (level("ph") === "high" && level("zinc_mg_kg") !== undefined) {
    insights.push("Laboratory zinc is not low, but pH is high, so zinc availability can still become limiting. Re-test over time.");
  }
  if (level("ph") === "high" && level("organic_carbon_pct") === "low") {
    insights.push("High pH combined with low organic carbon may compound zinc limitation; adding organic matter is commonly suggested for such soils.");
  }
  if (level("ph") === "high" && level("clay_pct") === "high") {
    insights.push("Alkaline, heavy-textured soils tend to hold zinc tightly, so zinc may be less available to roots.");
  }
  if (findings.length > 0 && findings.every((finding) => finding.concern === "none")) {
    insights.push("None of the values you entered is flagged for zinc availability.");
  }
  if (level("zinc_mg_kg") === undefined) {
    insights.push("No zinc result was entered, so this analysis reflects soil conditions only. It does not measure or estimate your soil zinc.");
  }

  const attention = findings.filter((finding) => finding.concern === "attention").length;
  const watch = findings.filter((finding) => finding.concern === "watch").length;
  return {
    title: attention
      ? `${attention} of ${findings.length} entered value${findings.length === 1 ? "" : "s"} may limit zinc availability`
      : watch ? `${watch} of ${findings.length} entered value${findings.length === 1 ? "" : "s"} to keep an eye on` : "No flags among the values entered",
    tone: attention ? "warning" : watch ? "info" : "ok",
    findings,
    insights,
  };
}
