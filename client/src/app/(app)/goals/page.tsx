"use client";
import { useState } from "react";
import { MinusCircle, Pencil, PlusCircle, Plus, Target, Trash2, PartyPopper } from "lucide-react";
import { toast } from "sonner";
import { Button, ConfirmDialog, EmptyState, Field, Item, Modal, PageHeader, Progress, Segmented, Skeleton, Stagger, cn } from "@/components/ui";
import { useMoney } from "@/components/ui/Amount";
import { refreshAll, useApi } from "@/hooks/useApi";
import { api, errMsg } from "@/lib/api";
import { fmtDate, isoDay } from "@/lib/format";
import dayjs from "dayjs";
import type { Goal } from "@/lib/types";

const COLORS = ["#10b981", "#6366f1", "#f43f5e", "#f59e0b", "#0ea5e9", "#d946ef", "#14b8a6", "#f97316"];

function Ring({ pct, color }: { pct: number; color: string }) {
  const r = 34, c = 2 * Math.PI * r;
  return (
    <svg width="84" height="84" viewBox="0 0 84 84" className="shrink-0 -rotate-90">
      <circle cx="42" cy="42" r={r} fill="none" strokeWidth="8" className="stroke-surface-2" />
      <circle cx="42" cy="42" r={r} fill="none" strokeWidth="8" strokeLinecap="round" stroke={color} strokeDasharray={c} strokeDashoffset={c - (Math.min(pct, 100) / 100) * c} style={{ transition: "stroke-dashoffset .8s ease" }} />
      <text x="42" y="42" textAnchor="middle" dominantBaseline="central" className="rotate-90 origin-center fill-fg text-sm font-bold" style={{ transformBox: "fill-box" }}>{Math.round(pct)}%</text>
    </svg>
  );
}

export default function GoalsPage() {
  const fmt = useMoney();
  const { data, isLoading } = useApi<{ goals: Goal[] }>("/goals");
  const [form, setForm] = useState<{ id?: string; name: string; targetAmount: string; deadline: string; color: string } | null>(null);
  const [contrib, setContrib] = useState<{ goal: Goal; mode: "add" | "withdraw"; amount: string; note: string } | null>(null);
  const [del, setDel] = useState<Goal | null>(null);
  const [busy, setBusy] = useState(false);

  const run = async (fn: () => Promise<unknown>, ok: string, done: () => void) => {
    setBusy(true);
    try { await fn(); toast.success(ok); await refreshAll(); done(); } catch (e) { toast.error(errMsg(e)); } finally { setBusy(false); }
  };

  const saveGoal = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form) return;
    const body = { name: form.name, targetAmount: Number(form.targetAmount), deadline: form.deadline || null, color: form.color };
    run(() => (form.id ? api.put(`/goals/${form.id}`, body) : api.post("/goals", body)), form.id ? "Goal updated" : "Goal created", () => setForm(null));
  };
  const saveContrib = (e: React.FormEvent) => {
    e.preventDefault();
    if (!contrib) return;
    const n = Number(contrib.amount) * (contrib.mode === "add" ? 1 : -1);
    run(() => api.post(`/goals/${contrib.goal._id}/contribute`, { amount: n, note: contrib.note }), contrib.mode === "add" ? "Savings added" : "Withdrawal recorded", () => setContrib(null));
  };

  const goals = data?.goals || [];
  const blank = { name: "", targetAmount: "", deadline: "", color: COLORS[0] };

  return (
    <>
      <PageHeader title="Savings goals" subtitle="Save towards the things that matter.">
        <Button onClick={() => setForm(blank)}><Plus size={16} /> New goal</Button>
      </PageHeader>

      {isLoading && !data ? <div className="grid gap-4 sm:grid-cols-2">{[0, 1].map((i) => <Skeleton key={i} className="h-52" />)}</div> : !goals.length ? (
        <div className="card"><EmptyState icon={<Target size={26} />} title="No goals yet" text="Create a goal like an emergency fund or a trip, then track every contribution." action={<Button onClick={() => setForm(blank)}><Plus size={16} /> Create a goal</Button>} /></div>
      ) : (
        <Stagger className="grid gap-4 sm:grid-cols-2">
          {goals.map((g) => {
            const pct = (g.savedAmount / g.targetAmount) * 100;
            const done = pct >= 100;
            const left = Math.max(0, g.targetAmount - g.savedAmount);
            const months = g.deadline ? Math.max(1, dayjs(g.deadline).diff(dayjs(), "month", true)) : 0;
            const overdue = g.deadline && !done && dayjs(g.deadline).isBefore(dayjs());
            return (
              <Item key={g._id}>
                <div className="card p-5">
                  <div className="flex items-start gap-4">
                    <Ring pct={pct} color={g.color} />
                    <div className="min-w-0 flex-1">
                      <div className="flex items-start justify-between gap-2">
                        <h3 className="truncate text-lg font-semibold">{g.name}</h3>
                        <div className="flex shrink-0">
                          <button className="btn-ghost !p-1.5" aria-label="Edit goal" onClick={() => setForm({ id: g._id, name: g.name, targetAmount: String(g.targetAmount), deadline: g.deadline ? isoDay(g.deadline) : "", color: g.color })}><Pencil size={15} /></button>
                          <button className="btn-ghost !p-1.5 hover:!text-expense" aria-label="Delete goal" onClick={() => setDel(g)}><Trash2 size={15} /></button>
                        </div>
                      </div>
                      <p className="text-2xl font-bold tabular-nums">{fmt(g.savedAmount)} <span className="text-sm font-medium text-muted">/ {fmt(g.targetAmount)}</span></p>
                      {done ? <p className="mt-1 flex items-center gap-1.5 text-sm font-medium text-income"><PartyPopper size={15} /> Goal reached!</p>
                        : <p className={cn("mt-1 text-sm", overdue ? "text-expense" : "text-muted")}>{fmt(left)} to go{g.deadline ? ` · ${overdue ? "was due" : "by"} ${fmtDate(g.deadline, "MMM D, YYYY")}` : ""}</p>}
                    </div>
                  </div>
                  <Progress value={pct} color={g.color} className="mt-4" />
                  {!done && g.deadline && !overdue && <p className="mt-2 text-xs text-muted">Save about <b className="text-fg">{fmt(left / months)}</b> per month to stay on track.</p>}
                  <div className="mt-4 flex gap-2">
                    <Button variant="outline" className="flex-1" onClick={() => setContrib({ goal: g, mode: "add", amount: "", note: "" })}><PlusCircle size={16} /> Add money</Button>
                    <Button variant="ghost" disabled={g.savedAmount <= 0} onClick={() => setContrib({ goal: g, mode: "withdraw", amount: "", note: "" })}><MinusCircle size={16} /> Withdraw</Button>
                  </div>
                </div>
              </Item>
            );
          })}
        </Stagger>
      )}

      <Modal open={!!form} onClose={() => setForm(null)} title={form?.id ? "Edit goal" : "New goal"}>
        {form && (
          <form onSubmit={saveGoal} className="space-y-4">
            <Field label="Goal name">{(id) => <input id={id} className="input" required autoFocus maxLength={60} placeholder="e.g. Emergency fund" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />}</Field>
            <div className="grid grid-cols-2 gap-3">
              <Field label="Target amount">{(id) => <input id={id} className="input" type="number" min="1" step="0.01" required value={form.targetAmount} onChange={(e) => setForm({ ...form, targetAmount: e.target.value })} />}</Field>
              <Field label="Deadline (optional)">{(id) => <input id={id} className="input" type="date" value={form.deadline} onChange={(e) => setForm({ ...form, deadline: e.target.value })} />}</Field>
            </div>
            <Field label="Color">{() => <div className="flex flex-wrap gap-2">{COLORS.map((c) => <button type="button" key={c} aria-label={c} onClick={() => setForm({ ...form, color: c })} className={cn("h-8 w-8 rounded-full ring-offset-2 ring-offset-surface transition", form.color === c && "ring-2 ring-fg")} style={{ background: c }} />)}</div>}</Field>
            <div className="flex justify-end gap-2"><Button type="button" variant="ghost" onClick={() => setForm(null)}>Cancel</Button><Button type="submit" loading={busy}>{form.id ? "Save changes" : "Create goal"}</Button></div>
          </form>
        )}
      </Modal>

      <Modal open={!!contrib} onClose={() => setContrib(null)} title={contrib ? contrib.goal.name : ""}>
        {contrib && (
          <form onSubmit={saveContrib} className="space-y-4">
            <Segmented value={contrib.mode} onChange={(m) => setContrib({ ...contrib, mode: m })} options={[{ value: "add", label: "Add money" }, { value: "withdraw", label: "Withdraw" }]} />
            <Field label="Amount" hint={contrib.mode === "withdraw" ? `Up to ${fmt(contrib.goal.savedAmount)}` : undefined}>{(id) => <input id={id} className="input" type="number" min="0.01" step="0.01" max={contrib.mode === "withdraw" ? contrib.goal.savedAmount : undefined} required autoFocus value={contrib.amount} onChange={(e) => setContrib({ ...contrib, amount: e.target.value })} />}</Field>
            <Field label="Note (optional)">{(id) => <input id={id} className="input" maxLength={120} value={contrib.note} onChange={(e) => setContrib({ ...contrib, note: e.target.value })} />}</Field>
            {contrib.goal.contributions.length > 0 && (
              <div><p className="mb-1.5 text-xs font-medium text-muted">Recent activity</p>
                <ul className="max-h-32 space-y-1 overflow-y-auto text-sm scrollbar-thin">
                  {[...contrib.goal.contributions].reverse().slice(0, 5).map((c, i) => <li key={i} className="flex justify-between"><span className="text-muted">{fmtDate(c.date, "MMM D")}{c.note ? ` · ${c.note}` : ""}</span><span className={cn("tabular-nums", c.amount > 0 ? "text-income" : "text-expense")}>{fmt(c.amount, { sign: true })}</span></li>)}
                </ul>
              </div>
            )}
            <div className="flex justify-end gap-2"><Button type="button" variant="ghost" onClick={() => setContrib(null)}>Cancel</Button><Button type="submit" loading={busy}>{contrib.mode === "add" ? "Add" : "Withdraw"}</Button></div>
          </form>
        )}
      </Modal>
      <ConfirmDialog open={!!del} title="Delete goal?" text={`"${del?.name}" and its contribution history will be removed.`} loading={busy} onConfirm={() => del && run(() => api.delete(`/goals/${del._id}`), "Goal deleted", () => setDel(null))} onClose={() => setDel(null)} />
    </>
  );
}
