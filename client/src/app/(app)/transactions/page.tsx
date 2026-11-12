"use client";
import { useEffect, useMemo, useState } from "react";
import { ChevronLeft, ChevronRight, Download, Plus, Receipt, Search, X } from "lucide-react";
import { toast } from "sonner";
import { Button, ConfirmDialog, EmptyState, PageHeader, Segmented, Skeleton } from "@/components/ui";
import { useMoney } from "@/components/ui/Amount";
import { TransactionRow } from "@/components/transactions/TransactionRow";
import { useTxModal } from "@/components/transactions/TransactionModal";
import { refreshAll, useApi } from "@/hooks/useApi";
import { api, errMsg } from "@/lib/api";
import { isoDay, relativeDay } from "@/lib/format";
import type { Category, Transaction, TransactionPage } from "@/lib/types";

const PAGE = 20;

export default function TransactionsPage() {
  const fmt = useMoney();
  const { open } = useTxModal();
  const [q, setQ] = useState("");
  const [dq, setDq] = useState("");
  const [type, setType] = useState<"all" | "expense" | "income">("all");
  const [category, setCategory] = useState("");
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [sort, setSort] = useState("date_desc");
  const [page, setPage] = useState(1);
  const [del, setDel] = useState<Transaction | null>(null);
  const [busy, setBusy] = useState(false);

  useEffect(() => { const t = setTimeout(() => setDq(q), 300); return () => clearTimeout(t); }, [q]);
  useEffect(() => setPage(1), [dq, type, category, from, to, sort]);

  const params = useMemo(() => {
    const p = new URLSearchParams();
    if (dq) p.set("q", dq);
    if (type !== "all") p.set("type", type);
    if (category) p.set("category", category);
    if (from) p.set("from", from);
    if (to) p.set("to", to);
    return p;
  }, [dq, type, category, from, to]);

  const query = new URLSearchParams(params); query.set("sort", sort); query.set("page", String(page)); query.set("limit", String(PAGE));
  const { data, isLoading } = useApi<TransactionPage>(`/transactions?${query}`);
  const { data: cats } = useApi<{ categories: Category[] }>("/categories");

  const groups = useMemo(() => {
    const m = new Map<string, Transaction[]>();
    (data?.items || []).forEach((t) => { const k = isoDay(t.date); m.set(k, [...(m.get(k) || []), t]); });
    return Array.from(m.entries());
  }, [data]);

  const filtered = Boolean(dq || type !== "all" || category || from || to);
  const reset = () => { setQ(""); setType("all"); setCategory(""); setFrom(""); setTo(""); };

  const remove = async () => {
    if (!del) return;
    setBusy(true);
    try { await api.delete(`/transactions/${del._id}`); toast.success("Transaction deleted"); await refreshAll(); setDel(null); }
    catch (e) { toast.error(errMsg(e)); } finally { setBusy(false); }
  };

  const exportCsv = async () => {
    try {
      const { data: csv } = await api.get(`/transactions/export?${params}`, { responseType: "blob" });
      const a = document.createElement("a");
      a.href = URL.createObjectURL(csv);
      a.download = `transactions-${isoDay(new Date())}.csv`;
      a.click();
      URL.revokeObjectURL(a.href);
    } catch (e) { toast.error(errMsg(e)); }
  };

  return (
    <>
      <PageHeader title="Transactions" subtitle={data ? `${data.total} ${data.total === 1 ? "entry" : "entries"}${filtered ? " match your filters" : ""}` : " "}>
        <Button variant="outline" onClick={exportCsv}><Download size={16} /> Export CSV</Button>
        <Button onClick={() => open()}><Plus size={16} /> Add</Button>
      </PageHeader>

      <div className="card mb-4 space-y-3 p-4">
        <div className="flex flex-wrap items-center gap-3">
          <div className="relative min-w-52 flex-1">
            <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted" />
            <input className="input pl-10" placeholder="Search notes…" value={q} onChange={(e) => setQ(e.target.value)} aria-label="Search" />
          </div>
          <Segmented value={type} onChange={setType} options={[{ value: "all", label: "All" }, { value: "expense", label: "Expenses" }, { value: "income", label: "Income" }]} />
        </div>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <select className="input" value={category} onChange={(e) => setCategory(e.target.value)} aria-label="Category">
            <option value="">All categories</option>
            {(cats?.categories || []).filter((c) => type === "all" || c.type === type).map((c) => <option key={c._id} value={c._id}>{c.name}</option>)}
          </select>
          <input type="date" className="input" value={from} max={to || undefined} onChange={(e) => setFrom(e.target.value)} aria-label="From date" />
          <input type="date" className="input" value={to} min={from || undefined} onChange={(e) => setTo(e.target.value)} aria-label="To date" />
          <select className="input" value={sort} onChange={(e) => setSort(e.target.value)} aria-label="Sort">
            <option value="date_desc">Newest first</option><option value="date_asc">Oldest first</option>
            <option value="amount_desc">Highest amount</option><option value="amount_asc">Lowest amount</option>
          </select>
        </div>
        {filtered && <button onClick={reset} className="inline-flex items-center gap-1 text-sm font-medium text-brand hover:underline"><X size={14} /> Clear filters</button>}
      </div>

      {data && data.total > 0 && (
        <div className="mb-4 grid grid-cols-3 gap-3">
          {[["Income", data.totals.income, "text-income"], ["Expenses", data.totals.expense, ""], ["Net", data.totals.income - data.totals.expense, data.totals.income - data.totals.expense >= 0 ? "text-income" : "text-expense"]].map(([l, v, c]) => (
            <div key={l as string} className="card px-4 py-3"><p className="text-xs text-muted">{l as string}{filtered ? " (filtered)" : ""}</p><p className={`text-lg font-bold tabular-nums ${c}`}>{fmt(v as number, { compact: true })}</p></div>
          ))}
        </div>
      )}

      <div className="card p-3 sm:p-4">
        {isLoading && !data ? (
          <div className="space-y-3 p-2">{[0, 1, 2, 3, 4].map((i) => <Skeleton key={i} className="h-12" />)}</div>
        ) : !groups.length ? (
          <EmptyState icon={<Receipt size={26} />} title={filtered ? "No matching transactions" : "No transactions yet"} text={filtered ? "Try adjusting or clearing your filters." : "Record your first expense or income to get started."}
            action={filtered ? <Button variant="outline" onClick={reset}>Clear filters</Button> : <Button onClick={() => open()}><Plus size={16} /> Add transaction</Button>} />
        ) : (
          groups.map(([day, items]) => (
            <section key={day} className="mb-2">
              <div className="flex items-center justify-between px-2 pb-1 pt-3 text-xs font-medium uppercase tracking-wide text-muted">
                <span>{relativeDay(day)}</span>
                <span className="tabular-nums normal-case">{fmt(items.reduce((s, t) => s + (t.type === "income" ? t.amount : -t.amount), 0), { sign: true })}</span>
              </div>
              {items.map((t) => <TransactionRow key={t._id} tx={t} onEdit={(x) => open(x)} onDelete={setDel} />)}
            </section>
          ))
        )}
      </div>

      {data && data.pages > 1 && (
        <div className="mt-4 flex items-center justify-center gap-3">
          <Button variant="outline" disabled={page <= 1} onClick={() => setPage(page - 1)} aria-label="Previous page"><ChevronLeft size={16} /></Button>
          <span className="text-sm text-muted">Page {page} of {data.pages}</span>
          <Button variant="outline" disabled={page >= data.pages} onClick={() => setPage(page + 1)} aria-label="Next page"><ChevronRight size={16} /></Button>
        </div>
      )}

      <ConfirmDialog open={!!del} title="Delete transaction?" text={del ? `${del.note || del.category.name} (${fmt(del.amount)}) will be permanently removed.` : ""} loading={busy} onConfirm={remove} onClose={() => setDel(null)} />
    </>
  );
}
