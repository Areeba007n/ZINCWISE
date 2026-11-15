# ZINCWISE: Beyond Yield

ZINCWISE is a farmer-focused decision-support dashboard for Punjab, Pakistan. A successful wheat harvest does not necessarily mean nutritionally adequate grain: yield measures how much is produced, not how much zinc reaches edible grain. ZINCWISE brings environmental context, farmer-entered soil-test results, and crop-rotation information together to help users explore conditions associated with zinc availability.

The platform provides two independent levels of assessment. Users can explore district-level environmental conditions without a soil test, or enter laboratory soil results without selecting a district. It is an exploratory tool, not a substitute for laboratory analysis or advice from a local agronomist.

## How it works

### 1. Explore environmental conditions

Select one of 34 Punjab districts to view the supplied monthly rainfall, air temperature, surface and root-zone soil moisture, evapotranspiration, and soil-temperature data. The available time series covers November 2023 through October 2026. A district map provides geographic context and lets users change the selected district.

These indicators provide environmental context for wheat cultivation. They do not directly measure soil zinc, plant uptake, or grain zinc.

### 2. Explore potential crop rotations

The dashboard presents wheat-based rotations, suitability labels, and agronomic notes supplied in the crop-zinc workbook. Examples include wheat–mungbean and wheat–chickpea. These are potential options to consider, not guaranteed ways to increase grain zinc.

The source workbook also contains a zinc bioavailability index and modeled zinc values for rotation crops and following wheat. The dashboard displays these supplied dataset estimates; it does not independently calculate or validate them. They are not laboratory measurements or guaranteed grain-zinc outcomes.

### 3. Assess independent soil-test results

The soil assessment does not depend on the selected district. Enter any available results from a soil laboratory report:

- pH
- Organic carbon (%)
- Clay content (%)
- DTPA-extractable zinc (mg/kg)

The assessment gives each entered value a low, moderate, or high screening label, with reference ranges and explanatory findings. If no zinc test result is entered, the tool discusses the other entered soil conditions but does not estimate the soil's zinc concentration.

## Features

- District selector and map for the 34 districts represented in the supplied data.
- Monthly environmental charts and yearly summaries, including evapotranspiration.
- Crop-rotation options, workbook-provided suitability and agronomic notes, and source-provided modeled zinc values.
- Independent soil-test screening that accepts any subset of the four supported lab values.
- Bundled data: the website makes no live requests to NASA or other data services.

## Data and processing

The website reads the generated `data/districts.json` file. The project workflow uses Google Earth Engine to access and process NASA Earth-observation data, and Python to handle and transform the supplied data into the website's JSON format. The web app itself uses the bundled JSON; it does not query Earth Engine or NASA at runtime.

| Dataset or file | Information used |
|---|---|
| GPM-derived rainfall | Monthly rainfall (mm) |
| GLDAS-derived data | Air temperature (°C) |
| SMAP-derived data | Surface and root-zone soil moisture (%) |
| MERRA-2-derived data | Evapotranspiration (mm/day) and soil temperature (°C) |
| `data/districts.json` | District environmental series, map coordinates, crop rotations, and related workbook fields consumed by the site |
| `scripts/build-data.py` | Optional converter for the two source Excel workbooks; requires `pandas` and `openpyxl` |

The source climate workbook (`All_Punjab_Clean_Master_3Yr`) supplies one row per district per month. The crop-zinc workbook (`All_Punjab_Website_Crop_Zinc_Insights`) supplies district agro-zone and post-wheat context, a zinc bioavailability index, rotation names, modeled zinc values, suitability, and agronomic notes. The Excel workbooks are inputs to the optional converter; the running site only needs the generated JSON.

To regenerate the JSON when the source workbooks are available:

```bash
python scripts/build-data.py All_Punjab_Clean_Master_3Yr_final_.xlsx All_Punjab_Website_Crop_Zinc_Insights_final_.xlsx
```

District coordinates are approximate district-headquarters locations used to centre the map.

## Interpretation and limitations

- Satellite-derived environmental indicators provide regional context; they do not directly measure field-level soil zinc or grain zinc.
- Soil screening labels are based on general reference ranges, not ranges included in the supplied project data. The research team should confirm or replace them with locally appropriate laboratory guidance.
- Rotation suitability and modeled zinc values come from the supplied crop-zinc workbook. They are not guarantees, and the modeled values should not be read as laboratory-confirmed grain concentrations.
- ZINCWISE does not determine or validate grain zinc concentration. Appropriate laboratory testing is required to establish grain zinc.
- Results are indicative screening information, not a substitute for laboratory interpretation or advice from a local agronomist.

The current soil screening ranges in `lib/zinc.ts` are:

| Soil measure | Low | Moderate | High |
|---|---:|---:|---:|
| pH | < 6.5 | 6.5–7.5 | > 7.5 |
| Organic carbon (%) | < 0.50 | 0.50–0.75 | > 0.75 |
| Clay content (%) | < 20 | 20–40 | > 40 |
| DTPA-extractable zinc (mg/kg) | < 0.5 | 0.5–1.0 | > 1.0 |

## Run locally

```bash
npm install
npm run dev      # http://localhost:3000
npm run build && npm start
npm run lint
```

Requires Node 18.18+ (Node 20+ recommended).

## Project tools and layout

The project uses Google Earth Engine for satellite-data access and processing, Python for data handling and analysis, and GitHub for version control and team collaboration. The web dashboard is built with Next.js, React, TypeScript, Tailwind CSS, Recharts, and Leaflet.

```text
app/          Next.js App Router (page, layout, styles)
components/   Dashboard sections
lib/          Types, data loading, and soil assessment logic
data/         districts.json used by the website
scripts/      Python data-conversion script
```
