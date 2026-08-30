"use client";

import { Bar, BarChart, CartesianGrid, Cell, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { MonthlyBucket } from "@/lib/classify";

function formatBDT(value: number): string {
  return new Intl.NumberFormat("en-BD", {
    style: "currency",
    currency: "BDT",
    maximumFractionDigits: 0,
  }).format(value);
}

function formatCompactBDT(value: number): string {
  if (value >= 100000) return `${(value / 100000).toFixed(1)}L`;
  if (value >= 1000) return `${(value / 1000).toFixed(0)}k`;
  return `${value}`;
}

export default function RiskChart({ data }: { data: MonthlyBucket[] }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <h2 className="mb-4 text-sm font-medium text-slate-500">Value at risk, next 6 months</h2>
      <div className="h-56 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 4, right: 8, left: -16, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#eef2f7" />
            <XAxis
              dataKey="label"
              tick={{ fontSize: 12, fill: "#94a3b8" }}
              axisLine={{ stroke: "#eef2f7" }}
              tickLine={false}
            />
            <YAxis
              tick={{ fontSize: 12, fill: "#94a3b8" }}
              axisLine={false}
              tickLine={false}
              tickFormatter={formatCompactBDT}
              width={40}
            />
            <Tooltip
              formatter={(value) => [formatBDT(Number(value)), "Value at risk"]}
              contentStyle={{ borderRadius: 10, border: "1px solid #eef2f7", fontSize: 12 }}
              cursor={{ fill: "#f8fafc" }}
            />
            <Bar dataKey="value" radius={[6, 6, 0, 0]}>
              {data.map((entry, index) => (
                // Current month reads darker/solid; the further-out months
                // fade — a lighter echo of the "which stage is selected"
                // treatment, but here it signals "this month is now."
                <Cell key={entry.label} fill={index === 0 ? "#4f46e5" : "#c7d2fe"} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
