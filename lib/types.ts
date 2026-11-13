export type Risk = "high" | "moderate" | "low";
export type MonthlyReading = { year: number; month: number; rain_mm: number; temp_c: number; soil_moisture_pct: number };
export type Soil = { ph: number; organic_carbon_pct: number; clay_pct: number; zinc_mg_kg: number };
export type Rotation = { name: string; tag: "Baseline" | "Recommended" | "Alternative"; description: string };
export type Insight = { title: string; text: string };
export type District = { id: string; name: string; region: string; lat: number; lng: number; monthly: MonthlyReading[]; soil: Soil; zinc_risk: Risk; rotations: Rotation[]; insights: Insight[] };
