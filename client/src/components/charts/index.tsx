"use client";
import { Bar, BarChart, CartesianGrid, Cell, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { useMoney } from "@/components/ui/Amount";
import { monthLabel } from "@/lib/format";
import type { CategoryTotal } from "@/lib/types";

export const INCOME = "#10b981";
export const EXPENSE = "#f43f5e";
const axis = { fill: "currentColor", fontSize: 12 };

function TooltipCard({ active, payload, label, labelFmt }: { active?: boolean; payload?: { name: string; value: number; color: string }[]; label?: string | number; labelFmt?: (l: string | number) => string }) {
  const fmt = useMoney();
  if (!active || !payload?.length) return null;
  return (
    <div className="card min-w-36 !rounded-xl p-3 text-xs shadow-lg">
      <p className="mb-1.5 font-semibold">{labelFmt && label !== undefined ? labelFmt(label) : label}</p>
      {payload.map((p) => (
        <p key={p.name} className="flex items-center justify-between gap-4 py-0.5">
          <span className="flex items-center gap-1.5 capitalize text-muted"><span className="h-2 w-2 rounded-full" style={{ background: p.color }} />{p.name}</span>
          <span className="font-medium tabular-nums">{fmt(p.value)}</span>
        </p>
      ))}
    </div>
  );
}

export function DailyChart({ data }: { data: { day: number; income: number; expense: number }[] }) {
  const fmt = useMoney();
  return (
    <div className="h-64 text-muted">
      <ResponsiveContainer>
        <BarChart data={data} margin={{ left: 0, right: 8, top: 8 }}>
          <CartesianGrid strokeDasharray="3 6" vertical={false} stroke="currentColor" strokeOpacity={0.15} />
          <XAxis dataKey="day" tick={axis} tickLine={false} axisLine={false} interval="preserveStartEnd" />
          <YAxis tick={axis} tickLine={false} axisLine={false} width={60} tickFormatter={(v) => fmt(v, { compact: true }).replace(/\.00$/, "")} />
          <Tooltip content={<TooltipCard labelFmt={(l) => `Day ${l}`} />} cursor={{ fill: "currentColor", fillOpacity: 0.06 }} />
          <Bar dataKey="expense" name="spent" fill="#6366f1" radius={[5, 5, 0, 0]} maxBarSize={18} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

export function TrendChart({ data, height = 256 }: { data: { month: string; income: number; expense: number }[]; height?: number }) {
  const fmt = useMoney();
  return (
    <div className="text-muted" style={{ height }}>
      <ResponsiveContainer>
        <BarChart data={data} margin={{ left: 0, right: 8, top: 8 }} barGap={4}>
          <CartesianGrid strokeDasharray="3 6" vertical={false} stroke="currentColor" strokeOpacity={0.15} />
          <XAxis dataKey="month" tick={axis} tickLine={false} axisLine={false} tickFormatter={(m) => monthLabel(m, true)} />
          <YAxis tick={axis} tickLine={false} axisLine={false} width={60} tickFormatter={(v) => fmt(v, { compact: true }).replace(/\.00$/, "")} />
          <Tooltip content={<TooltipCard labelFmt={(l) => monthLabel(String(l))} />} cursor={{ fill: "currentColor", fillOpacity: 0.06 }} />
          <Bar dataKey="income" fill={INCOME} radius={[6, 6, 0, 0]} maxBarSize={26} />
          <Bar dataKey="expense" fill={EXPENSE} radius={[6, 6, 0, 0]} maxBarSize={26} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

export function CategoryDonut({ data, total }: { data: CategoryTotal[]; total: number }) {
  const fmt = useMoney();
  return (
    <div className="relative mx-auto h-52 w-52 shrink-0">
      <ResponsiveContainer>
        <PieChart>
          <Pie data={data} dataKey="total" nameKey="name" innerRadius="68%" outerRadius="100%" paddingAngle={data.length > 1 ? 3 : 0} cornerRadius={6} stroke="none">
            {data.map((d) => <Cell key={d.categoryId} fill={d.color} />)}
          </Pie>
          <Tooltip content={<TooltipCard />} />
        </PieChart>
      </ResponsiveContainer>
      <div className="pointer-events-none absolute inset-0 grid place-items-center text-center">
        <div><p className="text-xs text-muted">Spent</p><p className="text-lg font-bold tabular-nums">{fmt(total, { compact: true })}</p></div>
      </div>
    </div>
  );
}
