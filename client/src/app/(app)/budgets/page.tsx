"use client";
import { useEffect, useState } from "react";
import { AlertTriangle, CheckCircle2, PiggyBank, Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { Button, ConfirmDialog, EmptyState, Field, Item, Modal, MonthSwitcher, PageHeader, Progress, Skeleton, Stagger, cn } from "@/components/ui";
import { CategoryIcon } from "@/components/ui/CategoryIcon";
import { useMoney } from "@/components/ui/Amount";
import { refreshAll, useApi } from "@/hooks/useApi";
import { api, errMsg } from "@/lib/api";
import { ym } from "@/lib/format";
import type { BudgetStatus, Category } from "@/lib/types";

export default function BudgetsPage() {
  const fmt = useMoney();
  const [month, setMonth] = useState(ym());
  const { data, isLoading } = useApi<{ budgets: BudgetStatus[] }>(`/budgets?month=${month}`);
  const { data: cats } = useApi<{ categories: Category[] }>("/categories");
  const [edit, setEdit] = useState<{ id?: string; category: string; amount: string } | null>(null);
  const [del, setDel] = useState<BudgetStatus | null>(null);
  const [busy, setBusy] = useState(false);

  const budgets = data?.budgets || [];
  const totalBudget = budgets.reduce((s, b) => s + b.amount, 0);
  const totalSpent = budgets.reduce((s, b) => s + b.spent, 0);
  const pct = totalBudget ? Math.round((totalSpent / totalBudget) * 100) : 0;
  const unbudgeted = (cats?.categories || []).filter((c) => c.type === "expense" && !budgets.some((b) => b.category._id === c._id));

  const save = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!edit) return;
    setBusy(true);
    try { await api.put("/budgets", { category: edit.category, amount: Number(edit.amount) }); toast.success("Budget saved"); await refreshAll(); setEdit(null); }
    catch (err) { toast.error(errMsg(err)); } finally { setBusy(false); }
  };
  const remove = async () => {
    if (!del) return;
    setBusy(true);
    try { await api.delete(`/budgets/${del._id}`); toast.success("Budget removed"); await refreshAll(); setDel(null); }
    catch (err) { toast.error(errMsg(err)); } finally { setBusy(false); }
  };

  return (
    <>
      <PageHeader title="Budgets" subtitle="Monthly spending limits per category. Limits repeat every month.">
        <MonthSwitcher value={month} onChange={setMonth} />
        <Button onClick={() => setEdit({ category: unbudgeted[0]?._id || "", amount: "" })} disabled={!unbudgeted.length}><Plus size={16} /> New budget</Button>
      </PageHeader>

      {isLoading && !data ? <Skeleton className="h-64" /> : !budgets.length ? (
        <div className="card"><EmptyState icon={<PiggyBank size={26} />} title="No budgets yet" text="Set a monthly limit for categories like Food or Shopping and we'll warn you before you overspend." action={<Button onClick={() => setEdit({ category: unbudgeted[0]?._id || "", amount: "" })}><Plus size={16} /> Create your first budget</Button>} /></div>
      ) : (
        <Stagger className="space-y-6">
          <Item className="card p-6">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <p className="text-sm text-muted">Total budgeted</p>
                <p className="text-3xl font-bold tabular-nums">{fmt(totalSpent)} <span className="text-lg font-medium text-muted">of {fmt(totalBudget)}</span></p>
              </div>
              <p className={cn("rounded-full px-3 py-1 text-sm font-medium", totalBudget - totalSpent >= 0 ? "bg-income/10 text-income" : "bg-expense/10 text-expense")}>
                {totalBudget - totalSpent >= 0 ? `${fmt(totalBudget - totalSpent)} left` : `${fmt(totalSpent - totalBudget)} over`}
              </p>
            </div>
            <Progress value={pct} className="mt-5 !h-3" />
          </Item>

          <div className="grid gap-4 sm:grid-cols-2">
            {budgets.map((b) => {
              const over = b.percent >= 100, warn = b.percent >= 80;
              return (
                <Item key={b._id}>
                  <div className="card group p-5">
                    <div className="flex items-center gap-3">
                      <CategoryIcon icon={b.category.icon} color={b.category.color} />
                      <div className="min-w-0 flex-1">
                        <p className="truncate font-semibold">{b.category.name}</p>
                        <p className={cn("flex items-center gap-1 text-xs", over ? "text-expense" : warn ? "text-warn" : "text-muted")}>
                          {over ? <><AlertTriangle size={12} /> Over budget</> : warn ? <><AlertTriangle size={12} /> Almost there</> : <><CheckCircle2 size={12} /> On track</>}
                        </p>
                      </div>
                      <button className="btn-ghost !px-2.5 !py-1.5 text-xs" onClick={() => setEdit({ id: b._id, category: b.category._id, amount: String(b.amount) })}>Edit</button>
                      <button className="btn-ghost !p-1.5 hover:!text-expense" onClick={() => setDel(b)} aria-label="Remove budget"><Trash2 size={15} /></button>
                    </div>
                    <div className="mt-4 flex items-baseline justify-between text-sm">
                      <span className="text-xl font-bold tabular-nums">{fmt(b.spent)}</span>
                      <span className="text-muted tabular-nums">of {fmt(b.amount)} · {b.percent}%</span>
                    </div>
                    <Progress value={b.percent} className="mt-2" />
                    <p className="mt-2 text-xs text-muted">{b.remaining >= 0 ? `${fmt(b.remaining)} remaining` : `${fmt(-b.remaining)} over the limit`}</p>
                  </div>
                </Item>
              );
            })}
          </div>
        </Stagger>
      )}

      <Modal open={!!edit} onClose={() => setEdit(null)} title={edit?.id ? "Edit budget" : "New budget"}>
        {edit && (
          <form onSubmit={save} className="space-y-4">
            <Field label="Category">
              {(id) => (
                <select id={id} className="input" value={edit.category} disabled={!!edit.id} onChange={(e) => setEdit({ ...edit, category: e.target.value })}>
                  {(edit.id ? (cats?.categories || []).filter((c) => c._id === edit.category) : unbudgeted).map((c) => <option key={c._id} value={c._id}>{c.name}</option>)}
                </select>
              )}
            </Field>
            <Field label="Monthly limit">{(id) => <input id={id} className="input" type="number" min="1" step="0.01" required autoFocus placeholder="e.g. 400" value={edit.amount} onChange={(e) => setEdit({ ...edit, amount: e.target.value })} />}</Field>
            <div className="flex justify-end gap-2"><Button type="button" variant="ghost" onClick={() => setEdit(null)}>Cancel</Button><Button type="submit" loading={busy}>Save budget</Button></div>
          </form>
        )}
      </Modal>
      <ConfirmDialog open={!!del} title="Remove budget?" confirmLabel="Remove" text={`The limit for ${del?.category.name} will be removed. Your transactions are not affected.`} loading={busy} onConfirm={remove} onClose={() => setDel(null)} />
    </>
  );
}
