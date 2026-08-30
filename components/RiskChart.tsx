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
    <div className="clay-surface h-full p-6">
      <h2 className="mb-4 text-sm font-medium text-clay-ink2">Value at risk, next 6 months</h2>
      <div className="h-56 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 4, right: 8, left: -16, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#DCC9AC" />
            <XAxis
              dataKey="label"
              tick={{ fontSize: 12, fill: "#8A7A67" }}
              axisLine={{ stroke: "#DCC9AC" }}
              tickLine={false}
            />
            <YAxis
              tick={{ fontSize: 12, fill: "#8A7A67" }}
              axisLine={false}
              tickLine={false}
              tickFormatter={formatCompactBDT}
              width={40}
            />
            <Tooltip
              formatter={(value) => [formatBDT(Number(value)), "Value at risk"]}
              contentStyle={{
                borderRadius: 12,
                border: "none",
                fontSize: 12,
                background: "#F5EBDC",
                boxShadow: "5px 5px 11px rgba(120,94,68,0.2), -4px -4px 9px rgba(255,255,255,0.7)",
              }}
              cursor={{ fill: "#EEE0CB" }}
            />
            <Bar dataKey="value" radius={[8, 8, 0, 0]}>
              {data.map((entry, index) => (
                // Current month reads solid terracotta; the further-out
                // months fade to a lighter clay tone — a soft echo of the
                // "which stage is selected" treatment, signaling "now."
                <Cell key={entry.label} fill={index === 0 ? "#C1544A" : "#E2A39C"} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
