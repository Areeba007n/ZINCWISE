export type MonthlyReading = {
  year: number;
  month: number;
  rain_mm: number;
  temp_c: number;
  surface_moisture_pct: number;
  root_zone_moisture_pct: number;
  evapotranspiration_mm_day: number;
  soil_temp_c: number;
};
export type RotationSuitability = "high" | "moderate" | "low";
export type Rotation = {
  name: string;
  status: string;
  suitability: RotationSuitability;
  insight: string;
  rotationCropZnMgKg: number;
  nextWheatZnMgKg: number;
};
export type PostWheatConditions = {
  temp_c: number;
  rain_mm: number;
  root_zone_moisture_pct: number;
  zn_bioavailability_index: number;
};
export type District = {
  id: string;
  name: string;
  zone: string;
  zoneType: string;
  lat: number;
  lng: number;
  postWheat: PostWheatConditions;
  monthly: MonthlyReading[];
  rotations: Rotation[];
};
