# ZincWise

A responsive climate-smart agriculture dashboard for the NASA Space Apps Challenge theme, **Field Shift: Adapting Farms with NASA Data**. It visualizes indicative climate, soil, zinc-risk and crop-rotation insights for rainfed wheat in Punjab, Pakistan.

## Run locally

```bash
npm install
npm run dev
```

Run `npm run lint` and `npm run build` before deploying to Vercel.

## Sample data

Everything shown is **SAMPLE / INDICATIVE DATA** and is not a substitute for a laboratory soil test. Replace `data/districts.json` and `data/punjab-districts.geojson` when validated data becomes available. The UI updates from the selected district object, so no component changes should be needed.

`districts.json` is an array of:

```ts
{
  id: "chakwal", name: "Chakwal", region: "Potohar Plateau",
  lat: 32.93, lng: 72.85,
  monthly: [{ year: 2025, month: 1, rain_mm: 40, temp_c: 11, soil_moisture_pct: 45 }],
  soil: { ph: 7.8, organic_carbon_pct: 0.7, clay_pct: 32, zinc_mg_kg: 0.6 },
  zinc_risk: "high",
  rotations: [{ name: "Wheat → Mungbean", tag: "Recommended", description: "…" }],
  insights: [{ title: "Climate Resilience", text: "…" }]
}
```

The included fixture has eight districts and monthly readings for 2023–2025. GeoJSON features must expose `properties.id` matching a district `id`. The assessment thresholds live at the top of `lib/zinc.ts`; they are intentionally named placeholders for research-team validation.
