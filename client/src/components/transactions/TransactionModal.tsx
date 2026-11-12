"use client";
import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import { Button, Field, Modal, Segmented, cn } from "@/components/ui";
import { CategoryIcon } from "@/components/ui/CategoryIcon";
import { api, errMsg } from "@/lib/api";
import { isoDay, today } from "@/lib/format";
import { refreshAll, useApi } from "@/hooks/useApi";
import { useAuth } from "@/context/AuthContext";
import type { Category, Transaction, TxType } from "@/lib/types";

interface Ctx { open: (tx?: Transaction | null, type?: TxType) => void }
const TxCtx = createContext<Ctx>({ open: () => {} });
export const useTxModal = () => useContext(TxCtx);

export function TransactionModalProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<{ tx: Transaction | null; type: TxType } | null>(null);
  const open = useCallback((tx: Transaction | null = null, type: TxType = "expense") => setState({ tx, type }), []);
  const close = useCallback(() => setState(null), []);

  // "n" = quick add, like most keyboard-driven finance tools
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const el = e.target as HTMLElement;
      if (e.key === "n" && !e.metaKey && !e.ctrlKey && !["INPUT", "TEXTAREA", "SELECT"].includes(el.tagName)) { e.preventDefault(); open(); }
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open]);

  const value = useMemo(() => ({ open }), [open]);
  return (
    <TxCtx.Provider value={value}>
      {children}
      <TransactionForm state={state} onClose={close} />
    </TxCtx.Provider>
  );
}

function TransactionForm({ state, onClose }: { state: { tx: Transaction | null; type: TxType } | null; onClose: () => void }) {
  const { user } = useAuth();
  const { data } = useApi<{ categories: Category[] }>(state ? "/categories" : null);
  const [type, setType] = useState<TxType>("expense");
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState("");
  const [date, setDate] = useState(today());
  const [note, setNote] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!state) return;
    const t = state.tx;
    setType(t?.type || state.type);
    setAmount(t ? String(t.amount) : "");
    setCategory(t?.category._id || "");
    setDate(t ? isoDay(t.date) : today());
    setNote(t?.note || "");
    setError("");
  }, [state]);

  const cats = useMemo(() => (data?.categories || []).filter((c) => c.type === type), [data, type]);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!(Number(amount) > 0)) return setError("Enter an amount greater than 0");
    if (!category) return setError("Pick a category");
    setBusy(true);
    try {
      const body = { type, amount: Number(amount), category, date, note };
      if (state?.tx) await api.put(`/transactions/${state.tx._id}`, body);
      else await api.post("/transactions", body);
      toast.success(state?.tx ? "Transaction updated" : type === "income" ? "Income added" : "Expense added");
      await refreshAll();
      onClose();
    } catch (err) { setError(errMsg(err)); } finally { setBusy(false); }
  };

  return (
    <Modal open={!!state} onClose={onClose} title={state?.tx ? "Edit transaction" : "New transaction"} wide>
      <form onSubmit={submit} className="space-y-5">
        <div className="flex justify-center">
          <Segmented value={type} onChange={(v) => { setType(v); setCategory(""); }} options={[{ value: "expense", label: "Expense" }, { value: "income", label: "Income" }]} />
        </div>
        <div className="text-center">
          <div className="inline-flex items-baseline gap-1">
            <span className="text-2xl font-medium text-muted">{new Intl.NumberFormat("en-US", { style: "currency", currency: user?.currency || "USD" }).formatToParts(0).find((p) => p.type === "currency")?.value}</span>
            <input autoFocus inputMode="decimal" type="number" step="0.01" min="0" placeholder="0.00" value={amount} onChange={(e) => setAmount(e.target.value)}
              className={cn("w-44 bg-transparent text-center text-5xl font-bold tabular-nums outline-none placeholder:text-muted/40", type === "income" ? "text-income" : "text-fg")} aria-label="Amount" />
          </div>
        </div>
        <Field label="Category">
          {() => (
            <div className="grid max-h-60 grid-cols-3 gap-2 overflow-y-auto pr-1 scrollbar-thin sm:grid-cols-4">
              {cats.map((c) => (
                <button type="button" key={c._id} onClick={() => setCategory(c._id)}
                  className={cn("flex flex-col items-center gap-1.5 rounded-xl border p-2.5 text-xs transition", category === c._id ? "border-brand bg-brand-soft" : "border-transparent bg-surface-2/70 hover:bg-surface-2")}>
                  <CategoryIcon icon={c.icon} color={c.color} size={34} />
                  <span className="line-clamp-1 w-full text-center font-medium">{c.name}</span>
                </button>
              ))}
              {!cats.length && <p className="col-span-full py-4 text-center text-sm text-muted">Loading categories…</p>}
            </div>
          )}
        </Field>
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Date">{(id) => <input id={id} type="date" className="input" value={date} onChange={(e) => setDate(e.target.value)} required />}</Field>
          <Field label="Note (optional)">{(id) => <input id={id} className="input" maxLength={200} placeholder="e.g. Lunch with Sam" value={note} onChange={(e) => setNote(e.target.value)} />}</Field>
        </div>
        {error && <p className="rounded-lg bg-expense/10 px-3 py-2 text-sm text-expense">{error}</p>}
        <div className="flex justify-end gap-2">
          <Button type="button" variant="ghost" onClick={onClose}>Cancel</Button>
          <Button type="submit" loading={busy}>{state?.tx ? "Save changes" : "Add transaction"}</Button>
        </div>
      </form>
    </Modal>
  );
}
