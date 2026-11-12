"use client";
import { useState } from "react";
import { Pencil, Plus, Repeat, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { Button, ConfirmDialog, EmptyState, Field, Item, Modal, PageHeader, Segmented, Skeleton, Stagger, cn } from "@/components/ui";
import { CategoryIcon } from "@/components/ui/CategoryIcon";
import { useMoney } from "@/components/ui/Amount";
import { refreshAll, useApi } from "@/hooks/useApi";
import { api, errMsg } from "@/lib/api";
import { fmtDate, isoDay, today } from "@/lib/format";
import type { Category, Recurring, TxType } from "@/lib/types";

type Form = { id?: string; type: TxType; amount: string; category: string; note: string; frequency: Recurring["frequency"]; startDate: string; active: boolean };

export default function RecurringPage() {
  const fmt = useMoney();
  const { data, isLoading } = useApi<{ recurring: Recurring[] }>("/recurring");
  const { data: cats } = useApi<{ categories: Category[] }>("/categories");
  const [form, setForm] = useState<Form | null>(null);
  const [del, setDel] = useState<Recurring | null>(null);
  const [busy, setBusy] = useState(false);

  const blank: Form = { type: "expense", amount: "", category: "", note: "", frequency: "monthly", startDate: today(), active: true };
  const run = async (fn: () => Promise<unknown>, ok: string, done?: () => void) => {
    setBusy(true);
    try { await fn(); toast.success(ok); await refreshAll(); done?.(); } catch (e) { toast.error(errMsg(e)); } finally { setBusy(false); }
  };

  const save = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form) return;
    if (!form.category) return toast.error("Pick a category");
    const body = { type: form.type, amount: Number(form.amount), category: form.category, note: form.note, frequency: form.frequency, startDate: form.startDate, active: form.active };
    run(() => (form.id ? api.put(`/recurring/${form.id}`, body) : api.post("/recurring", body)), form.id ? "Updated" : "Recurring entry created", () => setForm(null));
  };

  const list = data?.recurring || [];
  const monthlyCost = list.filter((r) => r.active && r.type === "expense").reduce((s, r) => s + r.amount * (r.frequency === "weekly" ? 52 / 12 : r.frequency === "yearly" ? 1 / 12 : 1), 0);
  const formCats = (cats?.categories || []).filter((c) => c.type === form?.type);

  return (
    <>
      <PageHeader title="Recurring" subtitle="Bills, subscriptions and paychecks that post automatically.">
        <Button onClick={() => setForm(blank)}><Plus size={16} /> Add recurring</Button>
      </PageHeader>

      {list.length > 0 && <div className="card mb-4 flex items-center justify-between p-5"><div><p className="text-sm text-muted">Estimated recurring expenses</p><p className="text-2xl font-bold tabular-nums">{fmt(monthlyCost)}<span className="text-sm font-medium text-muted"> / month</span></p></div><Repeat className="text-brand" /></div>}

      {isLoading && !data ? <Skeleton className="h-40" /> : !list.length ? (
        <div className="card"><EmptyState icon={<Repeat size={26} />} title="Nothing recurring yet" text="Add rent, subscriptions or your salary once and they'll be recorded on schedule." action={<Button onClick={() => setForm(blank)}><Plus size={16} /> Add recurring</Button>} /></div>
      ) : (
        <Stagger className="space-y-3">
          {list.map((r) => (
            <Item key={r._id}>
              <div className={cn("card flex items-center gap-4 p-4 transition", !r.active && "opacity-60")}>
                <CategoryIcon icon={r.category.icon} color={r.category.color} />
                <div className="min-w-0 flex-1">
                  <p className="truncate font-medium">{r.note || r.category.name}</p>
                  <p className="text-xs text-muted">{r.category.name} · {r.frequency} · {r.active ? `next ${fmtDate(r.nextDate, "MMM D, YYYY")}` : "paused"}</p>
                </div>
                <p className={cn("font-semibold tabular-nums", r.type === "income" && "text-income")}>{r.type === "income" ? "+" : "−"}{fmt(r.amount)}</p>
                <button role="switch" aria-checked={r.active} aria-label={r.active ? "Pause" : "Resume"} onClick={() => run(() => api.put(`/recurring/${r._id}`, { type: r.type, amount: r.amount, category: r.category._id, note: r.note, frequency: r.frequency, startDate: r.startDate, active: !r.active }), r.active ? "Paused" : "Resumed")}
                  className={cn("relative h-6 w-11 shrink-0 rounded-full transition", r.active ? "bg-brand" : "bg-surface-2")}><span className={cn("absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-all", r.active ? "left-[22px]" : "left-0.5")} /></button>
                <div className="flex">
                  <button className="btn-ghost !p-1.5" aria-label="Edit" onClick={() => setForm({ id: r._id, type: r.type, amount: String(r.amount), category: r.category._id, note: r.note, frequency: r.frequency, startDate: isoDay(r.startDate), active: r.active })}><Pencil size={15} /></button>
                  <button className="btn-ghost !p-1.5 hover:!text-expense" aria-label="Delete" onClick={() => setDel(r)}><Trash2 size={15} /></button>
                </div>
              </div>
            </Item>
          ))}
        </Stagger>
      )}

      <Modal open={!!form} onClose={() => setForm(null)} title={form?.id ? "Edit recurring" : "New recurring entry"}>
        {form && (
          <form onSubmit={save} className="space-y-4">
            <div className="flex justify-center"><Segmented value={form.type} onChange={(t) => setForm({ ...form, type: t, category: "" })} options={[{ value: "expense", label: "Expense" }, { value: "income", label: "Income" }]} /></div>
            <div className="grid grid-cols-2 gap-3">
              <Field label="Amount">{(id) => <input id={id} className="input" type="number" min="0.01" step="0.01" required value={form.amount} onChange={(e) => setForm({ ...form, amount: e.target.value })} />}</Field>
              <Field label="Repeats">{(id) => <select id={id} className="input" value={form.frequency} onChange={(e) => setForm({ ...form, frequency: e.target.value as Form["frequency"] })}><option value="weekly">Weekly</option><option value="monthly">Monthly</option><option value="yearly">Yearly</option></select>}</Field>
            </div>
            <Field label="Category">{(id) => <select id={id} className="input" required value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })}><option value="">Select…</option>{formCats.map((c) => <option key={c._id} value={c._id}>{c.name}</option>)}</select>}</Field>
            <div className="grid grid-cols-2 gap-3">
              <Field label="Description">{(id) => <input id={id} className="input" maxLength={200} placeholder="e.g. Netflix" value={form.note} onChange={(e) => setForm({ ...form, note: e.target.value })} />}</Field>
              <Field label={form.id ? "Started on" : "First date"} hint={form.id ? undefined : "Past dates are back-filled."}>{(id) => <input id={id} className="input" type="date" required disabled={!!form.id} value={form.startDate} onChange={(e) => setForm({ ...form, startDate: e.target.value })} />}</Field>
            </div>
            <div className="flex justify-end gap-2"><Button type="button" variant="ghost" onClick={() => setForm(null)}>Cancel</Button><Button type="submit" loading={busy}>Save</Button></div>
          </form>
        )}
      </Modal>
      <ConfirmDialog open={!!del} title="Delete recurring entry?" text="Future occurrences will stop. Transactions already recorded are kept." loading={busy} onConfirm={() => del && run(() => api.delete(`/recurring/${del._id}`), "Deleted", () => setDel(null))} onClose={() => setDel(null)} />
    </>
  );
}
