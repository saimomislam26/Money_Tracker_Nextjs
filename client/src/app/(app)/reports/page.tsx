"use client";
import { useState } from "react";
import { ChevronLeft, ChevronRight, TrendingDown, TrendingUp } from "lucide-react";
import { BarChart3 } from "lucide-react";
import { EmptyState, Item, PageHeader, Skeleton, Stagger, cn } from "@/components/ui";
import { CategoryIcon } from "@/components/ui/CategoryIcon";
import { useMoney } from "@/components/ui/Amount";
import { TrendChart } from "@/components/charts";
import { useApi } from "@/hooks/useApi";
import { monthLabel } from "@/lib/format";
import type { CategoryTotal, Yearly } from "@/lib/types";

function Breakdown({ title, rows, total, tone }: { title: string; rows: CategoryTotal[]; total: number; tone: "income" | "expense" }) {
  const fmt = useMoney();
  return (
    <div className="card p-5">
      <h2 className="mb-4 font-semibold">{title}</h2>
      {!rows.length ? <p className="py-8 text-center text-sm text-muted">No data</p> : (
        <ul className="space-y-4">
          {rows.map((r) => (
            <li key={r.categoryId}>
              <div className="flex items-center gap-3">
                <CategoryIcon icon={r.icon} color={r.color} size={34} />
                <div className="min-w-0 flex-1"><p className="truncate text-sm font-medium">{r.name}</p><p className="text-xs text-muted">{r.count} transaction{r.count > 1 ? "s" : ""}</p></div>
                <div className="text-right"><p className={cn("text-sm font-semibold tabular-nums", tone === "income" && "text-income")}>{fmt(r.total)}</p><p className="text-xs text-muted">{Math.round((r.total / total) * 100)}%</p></div>
              </div>
              <div className="ml-[46px] mt-1.5 h-1.5 overflow-hidden rounded-full bg-surface-2"><div className="h-full rounded-full" style={{ width: `${(r.total / rows[0].total) * 100}%`, background: r.color }} /></div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default function ReportsPage() {
  const fmt = useMoney();
  const [year, setYear] = useState(new Date().getFullYear());
  const { data, isLoading } = useApi<Yearly>(`/analytics/yearly?year=${year}`);

  const active = data?.months.filter((m) => m.income || m.expense) || [];
  const best = active.length ? active.reduce((a, b) => (b.net > a.net ? b : a)) : null;
  const worst = active.length ? active.reduce((a, b) => (b.expense > a.expense ? b : a)) : null;
  const avg = active.length ? data!.totals.expense / active.length : 0;

  return (
    <>
      <PageHeader title="Reports" subtitle="Your year at a glance.">
        <div className="inline-flex items-center rounded-xl border border-line bg-surface">
          <button className="btn-ghost !rounded-r-none !p-2.5" onClick={() => setYear(year - 1)} aria-label="Previous year"><ChevronLeft size={18} /></button>
          <span className="min-w-20 text-center text-sm font-medium">{year}</span>
          <button className="btn-ghost !rounded-l-none !p-2.5" disabled={year >= new Date().getFullYear()} onClick={() => setYear(year + 1)} aria-label="Next year"><ChevronRight size={18} /></button>
        </div>
      </PageHeader>

      {!data ? <div className="space-y-4"><Skeleton className="h-28" /><Skeleton className="h-80" /></div> : data.totals.count === 0 ? (
        <div className="card"><EmptyState icon={<BarChart3 size={26} />} title={`No data for ${year}`} text="Add some transactions or try another year." /></div>
      ) : (
        <Stagger className="space-y-6">
          <Item className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {[
              ["Total income", fmt(data.totals.income), "text-income"],
              ["Total expenses", fmt(data.totals.expense), ""],
              ["Net savings", fmt(data.totals.balance, { sign: true }), data.totals.balance >= 0 ? "text-income" : "text-expense"],
              ["Avg. monthly spend", fmt(avg), ""],
            ].map(([l, v, c]) => <div key={l} className="card p-5"><p className="text-sm text-muted">{l}</p><p className={cn("mt-2 text-2xl font-bold tabular-nums", c)}>{v}</p></div>)}
          </Item>

          <Item className="card p-5">
            <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
              <h2 className="font-semibold">Income vs expenses</h2>
              <div className="flex gap-4 text-xs text-muted"><span className="flex items-center gap-1.5"><span className="h-2 w-2 rounded-full bg-income" />Income</span><span className="flex items-center gap-1.5"><span className="h-2 w-2 rounded-full bg-expense" />Expenses</span></div>
            </div>
            <TrendChart data={data.months} height={300} />
            {best && worst && (
              <div className="mt-4 grid gap-3 sm:grid-cols-2">
                <div className="flex items-center gap-3 rounded-xl bg-income/10 p-3.5"><TrendingUp className="text-income" size={20} /><p className="text-sm"><b>Best month:</b> {monthLabel(best.month)} <span className="text-muted">({fmt(best.net, { sign: true })} net)</span></p></div>
                <div className="flex items-center gap-3 rounded-xl bg-expense/10 p-3.5"><TrendingDown className="text-expense" size={20} /><p className="text-sm"><b>Highest spend:</b> {monthLabel(worst.month)} <span className="text-muted">({fmt(worst.expense)})</span></p></div>
              </div>
            )}
          </Item>

          <Item className="overflow-x-auto card">
            <table className="w-full min-w-[480px] text-sm">
              <thead><tr className="border-b border-line text-left text-xs uppercase tracking-wide text-muted"><th className="px-5 py-3 font-medium">Month</th><th className="px-3 py-3 text-right font-medium">Income</th><th className="px-3 py-3 text-right font-medium">Expenses</th><th className="px-5 py-3 text-right font-medium">Net</th></tr></thead>
              <tbody>
                {data.months.map((m) => (
                  <tr key={m.month} className="border-b border-line/60 last:border-0">
                    <td className="px-5 py-2.5 font-medium">{monthLabel(m.month)}</td>
                    <td className="px-3 py-2.5 text-right tabular-nums text-income">{m.income ? fmt(m.income) : "—"}</td>
                    <td className="px-3 py-2.5 text-right tabular-nums">{m.expense ? fmt(m.expense) : "—"}</td>
                    <td className={cn("px-5 py-2.5 text-right font-medium tabular-nums", m.net > 0 ? "text-income" : m.net < 0 ? "text-expense" : "text-muted")}>{m.income || m.expense ? fmt(m.net, { sign: true }) : "—"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </Item>

          <Item className="grid gap-6 lg:grid-cols-2">
            <Breakdown title="Where your money went" rows={data.expenseCategories} total={data.totals.expense} tone="expense" />
            <Breakdown title="Where it came from" rows={data.incomeCategories} total={data.totals.income} tone="income" />
          </Item>
        </Stagger>
      )}
    </>
  );
}
