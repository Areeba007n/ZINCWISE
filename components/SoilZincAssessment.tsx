"use client";

import { useState } from "react";
import { AlertTriangle, FlaskConical, Microscope, RotateCcw } from "lucide-react";
import { assessZinc, SOIL_KEYS, type SoilInput, type SoilKey } from "@/lib/zinc";
import { Panel, StatusChip } from "./ui";

const fields: Record<SoilKey, { name: string; unit: string; max: number; step: string }> = {
  ph: { name: "Soil pH", unit: "pH", max: 14, step: "0.1" },
  organic_carbon_pct: { name: "Organic Carbon", unit: "%", max: 20, step: "0.01" },
  clay_pct: { name: "Clay Content", unit: "%", max: 100, step: "0.1" },
  zinc_mg_kg: { name: "Extractable Zinc (DTPA)", unit: "mg/kg", max: 50, step: "0.01" },
};
const chipTone = { none: "low", watch: "moderate", attention: "high" } as const;

type Draft = Record<SoilKey, string>;
const emptyDraft: Draft = { ph: "", organic_carbon_pct: "", clay_pct: "", zinc_mg_kg: "" };

export function SoilZincAssessment() {
  const [draft, setDraft] = useState<Draft>(emptyDraft);
  const [soil, setSoil] = useState<SoilInput | null>(null);
  const [error, setError] = useState("");

  const submit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const entered = SOIL_KEYS.filter((key) => draft[key].trim() !== "");
    const values: SoilInput = Object.fromEntries(entered.map((key) => [key, Number(draft[key])]));
    const valid = entered.length > 0 && entered.every((key) => Number.isFinite(values[key]) && values[key]! >= 0 && values[key]! <= fields[key].max);
    if (!valid) {
      setError(entered.length ? "Enter each value within its allowed range." : "Enter at least one laboratory value.");
      setSoil(null);
      return;
    }
    setError("");
    setSoil(values);
  };
  const reset = () => {
    setDraft(emptyDraft);
    setSoil(null);
    setError("");
  };
  const assessment = soil ? assessZinc(soil) : null;

  return <Panel className="soil-panel" label="Independent lab soil assessment">
    <div className="panel-heading"><span className="heading-icon sprout"><FlaskConical /></span><h2>Soil &amp; Zinc Assessment</h2></div>
    <p className="soil-intro">Enter values from your soil laboratory report (leave blank anything you don’t have). This analysis is independent of the selected district.</p>
    <form onSubmit={submit} className="soil-form">
      {SOIL_KEYS.map((key) => <label key={key}>
        {fields[key].name}<span><input
          type="number"
          inputMode="decimal"
          min="0"
          max={fields[key].max}
          step={fields[key].step}
          value={draft[key]}
          onChange={(event) => setDraft((current) => ({ ...current, [key]: event.target.value }))}
        /><em>{fields[key].unit}</em></span>
      </label>)}
      {error && <p className="form-error" role="alert">{error}</p>}
      <button className="submit-lab" type="submit"><Microscope size={15} aria-hidden="true" />Get Deeper Analysis</button>
      {(assessment || SOIL_KEYS.some((key) => draft[key])) && <button className="reset-button" type="button" onClick={reset}><RotateCcw size={13} aria-hidden="true" />Clear lab results</button>}
    </form>
    {assessment && <div className={`soil-analysis concern concern-${assessment.tone}`} aria-live="polite">
      <AlertTriangle size={22} />
      <div className="soil-analysis-content">
        <strong>{assessment.title}</strong>
        <div className="soil-findings">{assessment.findings.map((finding) => <article key={finding.key}>
          <div><b>{finding.name}</b><span>{finding.value} {finding.unit}</span><StatusChip tone={chipTone[finding.concern]}>{finding.label}</StatusChip></div>
          <p>{finding.message}</p>
          <small>Reference: {finding.reference}</small>
        </article>)}</div>
        {assessment.insights.length > 0 && <ul className="key-findings">{assessment.insights.map((text) => <li key={text}>{text}</li>)}</ul>}
        <small>Screening guidance based on general reference ranges; confirm with your laboratory’s interpretation and a local agronomist.</small>
      </div>
    </div>}
  </Panel>;
}
