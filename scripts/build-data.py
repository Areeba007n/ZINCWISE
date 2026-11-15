"""Convert the two supplied Excel workbooks into data/districts.json.

Usage (from the project root):
    python scripts/build-data.py <climate.xlsx> <crop_zinc_insights.xlsx>

Requires: pandas, openpyxl. The website itself never needs Python or Excel;
it only reads the generated JSON file.
"""
import json
import re
import sys
from pathlib import Path

import pandas as pd

# Approximate district-headquarters coordinates, used only to centre the map.
COORDINATES = {
    "Attock": (33.77, 72.36), "Bahawalnagar": (29.99, 73.25), "Bahawalpur": (29.40, 71.68),
    "Bhakkar": (31.63, 71.07), "Chakwal": (32.93, 72.85), "Dera Ghazi Khan": (30.05, 70.64),
    "Faisalabad": (31.42, 73.08), "Gujranwala": (32.16, 74.19), "Gujrat": (32.57, 74.08),
    "Hafizabad": (32.07, 73.69), "Jhang": (31.27, 72.32), "Jhelum": (32.93, 73.73),
    "Kasur": (31.12, 74.45), "Khanewal": (30.30, 71.93), "Khushab": (32.30, 72.35),
    "Lahore": (31.55, 74.34), "Layyah": (30.96, 70.94), "Lodhran": (29.54, 71.63),
    "Mandi Bahauddin": (32.59, 73.49), "Mianwali": (32.58, 71.54), "Multan": (30.20, 71.47),
    "Muzaffargarh": (30.07, 71.19), "Narowal": (32.10, 74.87), "Okara": (30.81, 73.45),
    "Pakpattan": (30.34, 73.39), "Rahim Yar Khan": (28.42, 70.30), "Rajanpur": (29.10, 70.33),
    "Rawalpindi": (33.60, 73.05), "Sahiwal": (30.67, 73.11), "Sargodha": (32.08, 72.67),
    "Sheikhupura": (31.71, 73.98), "Sialkot": (32.49, 74.53), "Toba Tek Singh": (30.97, 72.48),
    "Vehari": (30.04, 72.35),
}

CLIMATE_COLUMNS = {
    "GPM_Monthly_Rainfall_mm": "rain_mm",
    "GLDAS_Air_Temp_C": "temp_c",
    "SMAP_Surface_Moisture_pct": "surface_moisture_pct",
    "SMAP_RootZone_Moisture_pct": "root_zone_moisture_pct",
    "MERRA2_Evapotranspiration_mm_day": "evapotranspiration_mm_day",
    "MERRA2_Soil_Temp_C": "soil_temp_c",
}


def slug(name: str) -> str:
    return re.sub(r"[^a-z0-9]+", "-", name.lower()).strip("-")


def suitability(status: str) -> str:
    if status.startswith("Highly Recommended"):
        return "high"
    if status.startswith("Not Recommended"):
        return "low"
    return "moderate"


def main(climate_path: str, crop_path: str) -> None:
    climate = pd.read_excel(climate_path)
    crops = pd.read_excel(crop_path)
    missing = (set(climate.District) | set(crops.District)) - set(COORDINATES)
    if missing:
        raise SystemExit(f"No coordinates configured for: {sorted(missing)}")
    if set(climate.District) != set(crops.District):
        raise SystemExit("The two workbooks do not cover the same districts.")

    districts = []
    for name in sorted(climate.District.unique()):
        monthly = []
        for row in climate[climate.District == name].sort_values("Date").itertuples(index=False):
            year, month = (int(part) for part in row.Date.split("-"))
            reading = {"year": year, "month": month}
            for source, target in CLIMATE_COLUMNS.items():
                reading[target] = round(float(getattr(row, source)), 2)
            monthly.append(reading)

        rows = crops[crops.District == name]
        for column in ["Agro_Zone", "PostWheat_Air_Temp_C", "PostWheat_Rainfall_mm",
                       "RootZone_Moisture_pct", "Zn_Bioavailability_Index"]:
            if rows[column].nunique() != 1:
                raise SystemExit(f"{name}: {column} differs between crop-rotation rows.")
        first = rows.iloc[0]
        zone_match = re.match(r"^(.*?)\s*\((.*)\)\s*$", first.Agro_Zone)
        lat, lng = COORDINATES[name]
        districts.append({
            "id": slug(name),
            "name": name,
            "zone": zone_match.group(1) if zone_match else first.Agro_Zone,
            "zoneType": zone_match.group(2) if zone_match else "",
            "lat": lat,
            "lng": lng,
            "postWheat": {
                "temp_c": float(first.PostWheat_Air_Temp_C),
                "rain_mm": float(first.PostWheat_Rainfall_mm),
                "root_zone_moisture_pct": float(first.RootZone_Moisture_pct),
                "zn_bioavailability_index": float(first.Zn_Bioavailability_Index),
            },
            "monthly": monthly,
            "rotations": [{
                "name": r.Crop_Rotation,
                "status": r.Suitability_Status,
                "suitability": suitability(r.Suitability_Status),
                "insight": r.Agronomic_Insight,
                "rotationCropZnMgKg": float(r.Predicted_Rotation_Crop_Zn_mg_kg),
                "nextWheatZnMgKg": float(r.Predicted_Next_Wheat_Zn_mg_kg),
            } for r in rows.itertuples(index=False)],
        })

    out = Path(__file__).resolve().parent.parent / "data" / "districts.json"
    out.write_text(json.dumps(districts, indent=1, ensure_ascii=False) + "\n", encoding="utf-8")
    print(f"Wrote {len(districts)} districts to {out}")


if __name__ == "__main__":
    if len(sys.argv) != 3:
        raise SystemExit(__doc__)
    main(sys.argv[1], sys.argv[2])
