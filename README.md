# ZincWise

Climate-smart agriculture dashboard for Punjab, Pakistan, built for the NASA Space Apps Challenge ("Field Shift"). It shows how climate, soil and crop rotation relate to the **zinc quality of wheat**, using the team's NASA-derived datasets. All data is bundled with the site; there are no API calls to NASA or any other service.

## Features

- **District selector** (top right): 34 Punjab districts, all with data in the supplied files. Picking one updates the whole page and zooms the map to it.
- **Environmental Conditions**: monthly rainfall (GPM), air temperature (GLDAS) and surface + root-zone soil moisture (SMAP) charts per year (Nov 2023 – Oct 2026), plus yearly totals/averages including evapotranspiration (MERRA-2).
- **Crop Rotation Options** and **Key Insights**: rotations, suitability, predicted zinc and agronomic notes for the selected district, taken directly from the crop-zinc workbook.
- **District Map**: OpenStreetMap context only (no risk layers). Click a dot to switch district.
- **Soil & Zinc Assessment**: independent of the district. Enter lab values (pH, organic carbon, clay, DTPA zinc; any subset), press **Get Deeper Analysis**, and get a Low / Moderate / High rating per value with reference ranges and findings that depend only on what was entered. Zinc is never estimated; without a zinc result the tool says so.

## Run it

```bash
npm install
npm run dev      # http://localhost:3000
npm run build && npm start
npm run lint
```

Requires Node 18.18+ (Node 20+ recommended).

## Data

| File | Purpose |
|---|---|
| `data/districts.json` | The only data file the site reads. Generated from the two workbooks. |
| `scripts/build-data.py` | Converts the workbooks into `data/districts.json` (optional; needs `pandas` and `openpyxl`). |

Regenerate after the team updates the workbooks:

```bash
python scripts/build-data.py All_Punjab_Clean_Master_3Yr_final_.xlsx All_Punjab_Website_Crop_Zinc_Insights_final_.xlsx
```

Source columns used:

- `All_Punjab_Clean_Master_3Yr` (one row per district per month): `GPM_Monthly_Rainfall_mm`, `GLDAS_Air_Temp_C`, `SMAP_Surface_Moisture_pct`, `SMAP_RootZone_Moisture_pct`, `MERRA2_Evapotranspiration_mm_day`, `MERRA2_Soil_Temp_C`.
- `All_Punjab_Website_Crop_Zinc_Insights` (five rotations per district): agro-zone, post-wheat temperature/rainfall/root-zone moisture, `Zn_Bioavailability_Index`, rotation name, predicted zinc, suitability and agronomic insight.

Structure of each entry in `districts.json`:

```jsonc
{
  "id": "attock", "name": "Attock",
  "zone": "North Potohar", "zoneType": "Rainfed / Barani",
  "lat": 33.77, "lng": 72.36,                 // map centre (approximate district HQ)
  "postWheat": { "temp_c": 32.9, "rain_mm": 112.9, "root_zone_moisture_pct": 19.1, "zn_bioavailability_index": 79.6 },
  "monthly": [{ "year": 2023, "month": 11, "rain_mm": 49.34, "temp_c": 19.76,
                "surface_moisture_pct": 16.45, "root_zone_moisture_pct": 20.98,
                "evapotranspiration_mm_day": 1.32, "soil_temp_c": 16.19 }],
  "rotations": [{ "name": "Wheat – Mung Bean (NARC Mung-2016)", "status": "Highly Recommended (...)",
                  "suitability": "high", "insight": "...",
                  "rotationCropZnMgKg": 38.6, "nextWheatZnMgKg": 36.97 }]
}
```

District coordinates live in `scripts/build-data.py` and are approximate (used only to centre the map).

## Soil reference ranges

The supplied files contain no soil reference ranges, so `lib/zinc.ts` uses common screening ranges for wheat soils, kept as named constants with their basis in comments: pH (low < 6.5, high > 7.5), organic carbon (low < 0.50 %, high > 0.75 %), clay (low < 20 %, high > 40 %) and DTPA zinc (low < 0.5 mg/kg, high > 1.0 mg/kg). **The research team should confirm or replace these.**

## Project layout

```
app/          Next.js App Router (page, layout, styles)
components/   Dashboard sections (Header, EnvironmentalConditions, SoilZincAssessment, ...)
lib/          types, data loader, zinc assessment logic
data/         districts.json
scripts/      build-data.py
```

Stack: Next.js 15, React 19, Tailwind CSS 3 (config + base setup), Recharts, Leaflet / react-leaflet, TypeScript (as in the existing project).

## Notes

Results are indicative screening information, not a substitute for laboratory advice or a local agronomist.
