"use client";

import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip } from "recharts";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

const data = [
  { name: "Storage", aws: 0, gcp: 0, azure: 0 },
  { name: "Bandwidth", aws: 0, gcp: 0, azure: 0 },
  { name: "Database", aws: 0, gcp: 0, azure: 0 },
  { name: "Compute", aws: 0, gcp: 0, azure: 0 },
];

export function CostChart() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  if (!mounted) return <div className="h-[350px] w-full animate-pulse bg-muted/20 rounded-xl" />;

  return (
    <ResponsiveContainer width="100%" height={350}>
      <BarChart data={data}>
        <XAxis
          dataKey="name"
          stroke="#888888"
          fontSize={12}
          tickLine={false}
          axisLine={false}
        />
        <YAxis
          stroke="#888888"
          fontSize={12}
          tickLine={false}
          axisLine={false}
          tickFormatter={(value) => `$${value}`}
        />
        <Tooltip
          cursor={{ fill: "rgba(255,255,255,0.05)" }}
          contentStyle={{ backgroundColor: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: "8px" }}
        />
        <Bar dataKey="aws" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
        <Bar dataKey="gcp" fill="hsl(var(--chart-2))" radius={[4, 4, 0, 0]} />
        <Bar dataKey="azure" fill="hsl(var(--chart-3))" radius={[4, 4, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );
}
