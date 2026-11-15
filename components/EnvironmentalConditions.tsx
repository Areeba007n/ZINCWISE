"use client";

import { useMemo, useState } from "react";
import { CloudRain, Droplets, Sun, Thermometer } from "lucide-react";
import { Bar, BarChart, CartesianGrid, Legend, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { monthNames } from "@/lib/data";
import type { District, MonthlyReading } from "@/lib/types";
import { Panel } from "./ui";

type ChartReading = MonthlyReading & { monthLabel: string };
type Series = { key: keyof MonthlyReading; name: string; color: string };

const axisStyle = { fontSize: 11, fill: "#44564c" };

function MiniChart({ title, data, series, unit, bar }: { title: string; data: ChartReading[]; series: Series[]; unit: string; bar?: boolean }) {
  const Chart = bar ? BarChart : LineChart;
  return <div className="mini-chart">
    <h3>{title}</h3>
    <div className="chart-box">
      <ResponsiveContainer width="100%" height="100%">
        <Chart data={data} margin={{ top: 8, right: 8, bottom: 0, left: 0 }}>
          <CartesianGrid vertical={false} stroke="#d9dfd8" />
          <XAxis dataKey="monthLabel" tickLine={false} axisLine={{ stroke: "#b9c1bb" }} tick={axisStyle} interval="preserveStartEnd" minTickGap={4} />
          <YAxis width={40} tickLine={false} axisLine={{ stroke: "#b9c1bb" }} tick={axisStyle} tickCount={5} tickFormatter={(value: number) => String(Math.round(value))} />
          <Tooltip formatter={(value) => [`${Number(value).toFixed(1)} ${unit}`]} labelStyle={{ fontWeight: 700 }} contentStyle={{ fontSize: 11, borderRadius: 6 }} />
          {series.length > 1 && <Legend iconSize={8} wrapperStyle={{ fontSize: 10 }} />}
          {series.map(({ key, name, color }) => bar
            ? <Bar key={key} dataKey={key} name={name} fill={color} radius={[3, 3, 0, 0]} />
            : <Line key={key} type="monotone" dataKey={key} name={name} stroke={color} strokeWidth={2.5} dot={{ r: 3, fill: color }} activeDot={{ r: 5 }} />)}
        </Chart>
      </ResponsiveContainer>
    </div>
  </div>;
}

const average = (values: number[]) => values.reduce((sum, value) => sum + value, 0) / values.length;

export function EnvironmentalConditions({ district }: { district: District }) {
  const years = useMemo(() => [...new Set(district.monthly.map((reading) => reading.year))], [district.monthly]);
  const [selectedYear, setSelectedYear] = useState(years[years.length - 1]);
  const year = years.includes(selectedYear) ? selectedYear : years[years.length - 1];
  const data = useMemo<ChartReading[]>(() => district.monthly
    .filter((reading) => reading.year === year)
    .map((reading) => ({ ...reading, monthLabel: monthNames[reading.month - 1] })), [district.monthly, year]);
  const summary = [
    { label: "Total rainfall", value: `${data.reduce((sum, reading) => sum + reading.rain_mm, 0).toFixed(0)} mm`, icon: <CloudRain aria-hidden="true" /> },
    { label: "Avg air temp", value: `${average(data.map((reading) => reading.temp_c)).toFixed(1)} °C`, icon: <Thermometer aria-hidden="true" /> },
    { label: "Avg root-zone moisture", value: `${average(data.map((reading) => reading.root_zone_moisture_pct)).toFixed(1)} %`, icon: <Droplets aria-hidden="true" /> },
    { label: "Avg evapotranspiration", value: `${average(data.map((reading) => reading.evapotranspiration_mm_day)).toFixed(2)} mm/day`, icon: <Sun aria-hidden="true" /> },
  ];
  const first = data[0];
  const last = data[data.length - 1];

  return <Panel className="environment-panel" label="Environmental conditions">
    <div className="panel-heading"><span className="heading-icon cloudy"><CloudRain /></span><h2>Environmental Conditions</h2></div>
    <div className="control-row">
      <div className="year-tabs" aria-label="Select data year">
        {years.map((value) => <button key={value} onClick={() => setSelectedYear(value)} className={year === value ? "selected" : ""}>{value}</button>)}
      </div>
      <span className="period-note">{district.name} · {monthNames[first.month - 1]}–{monthNames[last.month - 1]} {year}</span>
    </div>
    <div className="charts">
      <MiniChart title="Rainfall (mm)" data={data} series={[{ key: "rain_mm", name: "Rainfall", color: "#2684c7" }]} unit="mm" bar />
      <MiniChart title="Temperature (°C)" data={data} series={[{ key: "temp_c", name: "Air temperature", color: "#e98b27" }]} unit="°C" />
      <MiniChart title="Soil Moisture (%)" data={data} series={[
        { key: "surface_moisture_pct", name: "Surface", color: "#4b9b3b" },
        { key: "root_zone_moisture_pct", name: "Root zone", color: "#0c6b57" },
      ]} unit="%" />
    </div>
    <dl className="env-summary">{summary.map(({ label, value, icon }) => <div key={label}><dt>{icon}{label}</dt><dd>{value}</dd></div>)}</dl>
    <p className="climate-attribution">Data: GPM rainfall · GLDAS air temperature · SMAP surface and root-zone soil moisture · MERRA-2 evapotranspiration (supplied dataset, Nov 2023–Oct 2026).</p>
  </Panel>;
}
