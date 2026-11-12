"use client";
import { useState } from "react";
import { Lock, Pencil, Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { Button, ConfirmDialog, Field, Modal, PageHeader, Segmented, Skeleton, cn } from "@/components/ui";
import { CategoryIcon, ICONS } from "@/components/ui/CategoryIcon";
import { refreshAll, useApi } from "@/hooks/useApi";
import { api, errMsg } from "@/lib/api";
import type { Category, TxType } from "@/lib/types";

const COLORS = ["#f97316", "#84cc16", "#0ea5e9", "#8b5cf6", "#14b8a6", "#ec4899", "#f43f5e", "#ef4444", "#6366f1", "#06b6d4", "#eab308", "#10b981", "#d946ef", "#64748b"];
type Form = { id?: string; name: string; type: TxType; color: string; icon: string };

export default function CategoriesPage() {
  const { data, isLoading } = useApi<{ categories: Category[] }>("/categories");
  const [tab, setTab] = useState<TxType>("expense");
  const [form, setForm] = useState<Form | null>(null);
  const [del, setDel] = useState<Category | null>(null);
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState("");

  const list = (data?.categories || []).filter((c) => c.type === tab);

  const save = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form) return;
    setBusy(true); setErr("");
    try {
      const body = { name: form.name, type: form.type, color: form.color, icon: form.icon };
      if (form.id) await api.put(`/categories/${form.id}`, body); else await api.post("/categories", body);
      toast.success(form.id ? "Category updated" : "Category created");
      await refreshAll(); setForm(null);
    } catch (e2) { setErr(errMsg(e2)); } finally { setBusy(false); }
  };
  const remove = async () => {
    if (!del) return;
    setBusy(true);
    try { await api.delete(`/categories/${del._id}`); toast.success("Category deleted"); await refreshAll(); }
    catch (e) { toast.error(errMsg(e)); } finally { setBusy(false); setDel(null); }
  };

  return (
    <>
      <PageHeader title="Categories" subtitle="Organise your income and spending the way you think about it.">
        <Segmented value={tab} onChange={setTab} options={[{ value: "expense", label: "Expense" }, { value: "income", label: "Income" }]} />
        <Button onClick={() => { setErr(""); setForm({ name: "", type: tab, color: COLORS[8], icon: "tag" }); }}><Plus size={16} /> New</Button>
      </PageHeader>

      {isLoading && !data ? <Skeleton className="h-64" /> : (
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {list.map((c) => (
            <div key={c._id} className="card group flex items-center gap-3 p-4">
              <CategoryIcon icon={c.icon} color={c.color} />
              <p className="min-w-0 flex-1 truncate font-medium">{c.name}</p>
              <button className="btn-ghost !p-1.5" aria-label="Edit" onClick={() => { setErr(""); setForm({ id: c._id, name: c.name, type: c.type, color: c.color, icon: c.icon }); }}><Pencil size={15} /></button>
              <button className="btn-ghost !p-1.5 hover:!text-expense" aria-label="Delete" onClick={() => setDel(c)}><Trash2 size={15} /></button>
            </div>
          ))}
        </div>
      )}
      <p className="mt-4 flex items-center gap-1.5 text-xs text-muted"><Lock size={12} /> A category can only be deleted once it has no transactions.</p>

      <Modal open={!!form} onClose={() => setForm(null)} title={form?.id ? "Edit category" : "New category"}>
        {form && (
          <form onSubmit={save} className="space-y-4">
            <div className="flex items-center gap-3 rounded-xl bg-surface-2/70 p-3"><CategoryIcon icon={form.icon} color={form.color} size={44} /><span className="font-semibold">{form.name || "Category name"}</span></div>
            <Field label="Name" error={err}>{(id) => <input id={id} className="input" required autoFocus maxLength={40} value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />}</Field>
            <Field label="Color">{() => <div className="flex flex-wrap gap-2">{COLORS.map((c) => <button type="button" key={c} aria-label={c} onClick={() => setForm({ ...form, color: c })} className={cn("h-8 w-8 rounded-full ring-offset-2 ring-offset-surface transition", form.color === c && "ring-2 ring-fg")} style={{ background: c }} />)}</div>}</Field>
            <Field label="Icon">{() => (
              <div className="grid grid-cols-7 gap-1.5">
                {Object.entries(ICONS).map(([k, I]) => <button type="button" key={k} aria-label={k} onClick={() => setForm({ ...form, icon: k })} className={cn("grid h-10 place-items-center rounded-lg transition", form.icon === k ? "text-white" : "bg-surface-2 text-muted hover:text-fg")} style={form.icon === k ? { background: form.color } : undefined}><I size={18} /></button>)}
              </div>
            )}</Field>
            <div className="flex justify-end gap-2"><Button type="button" variant="ghost" onClick={() => setForm(null)}>Cancel</Button><Button type="submit" loading={busy}>Save</Button></div>
          </form>
        )}
      </Modal>
      <ConfirmDialog open={!!del} title="Delete category?" text={`"${del?.name}" and any budgets or recurring entries that use it will be removed.`} loading={busy} onConfirm={remove} onClose={() => setDel(null)} />
    </>
  );
}
