"use client";

import { useMemo, useState } from "react";
import districtsJson from "@/data/districts.json";
import type { District } from "@/lib/types";
import { Header } from "@/components/Header";
import { Hero } from "@/components/Hero";
import { EnvironmentalConditions } from "@/components/EnvironmentalConditions";
import { SoilZincAssessment } from "@/components/SoilZincAssessment";
import { CropRotationOptions } from "@/components/CropRotationOptions";
import { RegionalOverview } from "@/components/RegionalOverview";
import { KeyInsights } from "@/components/KeyInsights";
import { Footer } from "@/components/Footer";

const districts = districtsJson as District[];
export default function Home() {
  const [selectedId, setSelectedId] = useState("chakwal");
  const selected = useMemo(() => districts.find((district) => district.id === selectedId) ?? districts[0], [selectedId]);
  return <main><Header districts={districts} selected={selected} onSelect={setSelectedId} /><Hero selected={selected} />
    <section className="dashboard-shell" aria-label="ZincWise dashboard">
      <p className="sample-note">SAMPLE / INDICATIVE DATA — not a substitute for laboratory soil testing.</p>
      <div className="top-grid"><EnvironmentalConditions district={selected} /><SoilZincAssessment regionalSoil={selected.soil} /><CropRotationOptions district={selected} /></div>
      <div className="bottom-grid"><RegionalOverview districts={districts} selected={selected} onSelect={setSelectedId} /><KeyInsights district={selected} /></div>
    </section><Footer />
  </main>;
}
