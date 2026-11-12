"use client";
import { useState } from "react";
import Link from "next/link";
import { ArrowDownRight, ArrowUpRight, CalendarClock, Flame, Lightbulb, Plus, Receipt, Sparkles, TrendingDown, TrendingUp, Wallet } from "lucide-react";
import { Button, EmptyState, Item, MonthSwitcher, Progress, Skeleton, Stagger, cn } from "@/components/ui";
import { CategoryIcon } from "@/components/ui/CategoryIcon";
import { useMoney } from "@/components/ui/Amount";
import { CategoryDonut, DailyChart, TrendChart } from "@/components/charts";
import { TransactionRow } from "@/components/transactions/TransactionRow";
import { useTxModal } from "@/components/transactions/TransactionModal";
import { useApi } from "@/hooks/useApi";
import { useAuth } from "@/context/AuthContext";
import { fmtDate, monthLabel, pctChange, relativeDay, ym } from "@/lib/format";
import type { Dashboard } from "@/lib/types";

function Delta({ cur, prev, inverse }: { cur: number; prev: number; inverse?: boolean }) {
  const p = pctChange(cur, prev);
  if (p === null || p === 0) return <span className="text-xs text-muted">vs last month: —</span>;
  const good = inverse ? p < 0 : p > 0;
  const Icon = p > 0 ? ArrowUpRight : ArrowDownRight;
  return (
    <span className={cn("inline-flex items-center gap-0.5 text-xs font-medium", good ? "text-income" : "text-expense")}>
      <Icon size={14} />{Math.abs(p)}% <span className="font-normal text-muted">vs last month</span>
    </span>
  );
}

function Stat({ label, value, icon: Icon, tone, children }: { label: string; value: string; icon: typeof Wallet; tone: string; children?: React.ReactNode }) {
  return (
    <div className="card p-4 sm:p-5">
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted">{label}</p>
        <span className="grid h-9 w-9 place-items-center rounded-xl" style={{ background: `${tone}20`, color: tone }}><Icon size={18} /></span>
      </div>
      <p className="mt-3 text-xl font-bold tabular-nums tracking-tight sm:text-2xl">{value}</p>
      <div className="mt-1 h-4">{children}</div>
    </div>
  );
}

export default function DashboardPage() {
  const { user } = useAuth();
  const fmt = useMoney();
  const { open } = useTxModal();
  const [month, setMonth] = useState(ym());
  const { data, isLoading } = useApi<Dashboard>(`/analytics/dashboard?month=${month}`);

  const hour = new Date().getHours();
  const greeting = hour < 12 ? "Good morning" : hour < 18 ? "Good afternoon" : "Good evening";

  if (!data || (isLoading && !data)) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-12 w-72" />
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">{[0, 1, 2, 3].map((i) => <Skeleton key={i} className="h-32" />)}</div>
        <Skeleton className="h-80" />
      </div>
    );
  }

  const { totals, previous, insights, categories, budgets, recent, upcoming } = data;
  const empty = totals.count === 0 && recent.length === 0;
  const alerts = budgets.filter((b) => b.percent >= 80);
  const hasActivity = data.daily.some((d) => d.expense);

  return (
    <Stagger className="space-y-6">
      <Item className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">{greeting}, {user?.firstName} 👋</h1>
          <p className="mt-0.5 text-sm text-muted">Here&apos;s how {month === ym() ? "this month is going" : monthLabel(month) + " looked"}.</p>
        </div>
        <MonthSwitcher value={month} onChange={setMonth} />
      </Item>

      {alerts.length > 0 && month === ym() && (
        <Item>
          <div className="flex items-start gap-3 rounded-2xl border border-warn/30 bg-warn/10 p-4">
            <Flame className="mt-0.5 shrink-0 text-warn" size={20} />
            <div className="text-sm">
              <p className="font-semibold">Budget alert</p>
              <p className="text-muted">{alerts.map((a) => `${a.category.name} (${a.percent}%)`).join(", ")} — {alerts.some((a) => a.percent >= 100) ? "over or at the limit." : "approaching the limit."} <Link href="/budgets" className="font-medium text-brand hover:underline">Review budgets</Link></p>
            </div>
          </div>
        </Item>
      )}

      <Item className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
        <Stat label="Net balance" value={fmt(totals.balance, { sign: true })} icon={Wallet} tone="#6366f1"><Delta cur={totals.balance} prev={previous.balance} /></Stat>
        <Stat label="Income" value={fmt(totals.income)} icon={TrendingUp} tone="#10b981"><Delta cur={totals.income} prev={previous.income} /></Stat>
        <Stat label="Expenses" value={fmt(totals.expense)} icon={TrendingDown} tone="#f43f5e"><Delta cur={totals.expense} prev={previous.expense} inverse /></Stat>
        <Stat label="Savings rate" value={totals.savingsRate == null ? "—" : `${totals.savingsRate}%`} icon={Sparkles} tone="#f59e0b">
          <span className="text-xs text-muted">{totals.savingsRate == null ? "Add income to see this" : totals.savingsRate >= 20 ? "Great — above the 20% rule of thumb" : "Aim for 20% or more"}</span>
        </Stat>
      </Item>

      {empty ? (
        <Item className="card">
          <EmptyState icon={<Receipt size={26} />} title="No activity in this month" text="Add your first income or expense to light up the dashboard." action={<Button onClick={() => open()}><Plus size={16} /> Add transaction</Button>} />
        </Item>
      ) : (
        <>
          <Item className="grid gap-6 lg:grid-cols-3">
            <div className="card p-5 lg:col-span-2">
              <div className="mb-4 flex items-center justify-between">
                <h2 className="font-semibold">Daily spending</h2>
                <span className="text-xs text-muted">{monthLabel(month)}</span>
              </div>
              {hasActivity ? <DailyChart data={data.daily} /> : <p className="py-20 text-center text-sm text-muted">No spending yet</p>}
            </div>

            <div className="card p-5">
              <h2 className="mb-4 font-semibold">Spending by category</h2>
              {categories.length ? (
                <>
                  <CategoryDonut data={categories} total={totals.expense} />
                  <ul className="mt-4 space-y-2">
                    {categories.slice(0, 5).map((c) => (
                      <li key={c.categoryId} className="flex items-center gap-2 text-sm">
                        <span className="h-2.5 w-2.5 rounded-full" style={{ background: c.color }} />
                        <span className="flex-1 truncate">{c.name}</span>
                        <span className="tabular-nums text-muted">{Math.round((c.total / totals.expense) * 100)}%</span>
                        <span className="w-20 text-right font-medium tabular-nums">{fmt(c.total)}</span>
                      </li>
                    ))}
                  </ul>
                </>
              ) : <p className="py-16 text-center text-sm text-muted">No expenses this month</p>}
            </div>
          </Item>

          <Item className="grid gap-6 lg:grid-cols-3">
            <div className="card p-5 lg:col-span-2">
              <h2 className="mb-4 font-semibold">Last 6 months</h2>
              <TrendChart data={data.trend} />
            </div>
            <div className="card space-y-4 p-5">
              <h2 className="flex items-center gap-2 font-semibold"><Lightbulb size={18} className="text-warn" />Insights</h2>
              <div className="rounded-xl bg-surface-2/70 p-3.5">
                <p className="text-xs text-muted">Average daily spend</p>
                <p className="text-lg font-bold tabular-nums">{fmt(insights.avgDailySpend)}</p>
              </div>
              {insights.isCurrentMonth && (
                <div className="rounded-xl bg-surface-2/70 p-3.5">
                  <p className="text-xs text-muted">Projected month-end spending</p>
                  <p className="text-lg font-bold tabular-nums">{fmt(insights.projectedExpense)}</p>
                  {totals.income > 0 && <p className={cn("mt-0.5 text-xs", insights.projectedExpense > totals.income ? "text-expense" : "text-income")}>{insights.projectedExpense > totals.income ? "On pace to exceed your income" : `On pace to keep ${fmt(totals.income - insights.projectedExpense)}`}</p>}
                </div>
              )}
              {insights.topCategory && (
                <div className="flex items-center gap-3 rounded-xl bg-surface-2/70 p-3.5">
                  <CategoryIcon icon={insights.topCategory.icon} color={insights.topCategory.color} />
                  <div className="min-w-0"><p className="text-xs text-muted">Top category</p><p className="truncate font-semibold">{insights.topCategory.name}</p></div>
                  <p className="ml-auto font-bold tabular-nums">{fmt(insights.topCategory.total)}</p>
                </div>
              )}
            </div>
          </Item>
        </>
      )}

      <Item className="grid gap-6 lg:grid-cols-3">
        <div className="card p-5 lg:col-span-2">
          <div className="mb-3 flex items-center justify-between">
            <h2 className="font-semibold">Recent transactions</h2>
            <Link href="/transactions" className="text-sm font-medium text-brand hover:underline">View all</Link>
          </div>
          {recent.length ? recent.map((t) => <TransactionRow key={t._id} tx={t} showDate={relativeDay(t.date)} />) : <p className="py-10 text-center text-sm text-muted">Nothing here yet</p>}
        </div>

        <div className="space-y-6">
          <div className="card p-5">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="font-semibold">Budgets</h2>
              <Link href="/budgets" className="text-sm font-medium text-brand hover:underline">Manage</Link>
            </div>
            {budgets.length ? (
              <ul className="space-y-4">
                {budgets.slice(0, 4).map((b) => (
                  <li key={b._id}>
                    <div className="mb-1.5 flex items-center justify-between text-sm"><span className="font-medium">{b.category.name}</span><span className="text-muted tabular-nums">{fmt(b.spent)} / {fmt(b.amount)}</span></div>
                    <Progress value={b.percent} />
                  </li>
                ))}
              </ul>
            ) : <p className="py-4 text-center text-sm text-muted">No budgets yet. <Link href="/budgets" className="text-brand hover:underline">Create one</Link></p>}
          </div>

          {upcoming.length > 0 && (
            <div className="card p-5">
              <h2 className="mb-3 flex items-center gap-2 font-semibold"><CalendarClock size={18} className="text-brand" />Upcoming</h2>
              <ul className="space-y-1">
                {upcoming.map((u) => (
                  <li key={u._id} className="flex items-center gap-3 py-1.5 text-sm">
                    <CategoryIcon icon={u.category.icon} color={u.category.color} size={32} />
                    <div className="min-w-0 flex-1"><p className="truncate font-medium">{u.note || u.category.name}</p><p className="text-xs text-muted">{fmtDate(u.nextDate, "MMM D")} · {u.frequency}</p></div>
                    <span className={cn("font-semibold tabular-nums", u.type === "income" && "text-income")}>{u.type === "income" ? "+" : "−"}{fmt(u.amount)}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </Item>
    </Stagger>
  );
}
