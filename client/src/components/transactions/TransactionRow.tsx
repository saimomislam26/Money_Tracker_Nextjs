"use client";
import { Pencil, Repeat, Trash2 } from "lucide-react";
import { CategoryIcon } from "@/components/ui/CategoryIcon";
import { Amount } from "@/components/ui/Amount";
import type { Transaction } from "@/lib/types";

export function TransactionRow({ tx, onEdit, onDelete, showDate }: { tx: Transaction; onEdit?: (t: Transaction) => void; onDelete?: (t: Transaction) => void; showDate?: string }) {
  return (
    <div className="group flex items-center gap-3 rounded-xl px-2 py-2.5 transition hover:bg-surface-2/70">
      <CategoryIcon icon={tx.category.icon} color={tx.category.color} />
      <div className="min-w-0 flex-1">
        <p className="flex items-center gap-1.5 truncate text-sm font-medium">
          {tx.note || tx.category.name}
          {tx.recurring && <Repeat size={12} className="shrink-0 text-muted" aria-label="Recurring" />}
        </p>
        <p className="truncate text-xs text-muted">{tx.category.name}{showDate ? ` · ${showDate}` : ""}</p>
      </div>
      <Amount value={tx.amount} type={tx.type} className="text-sm font-semibold" />
      {(onEdit || onDelete) && (
        <div className="flex gap-0.5 opacity-100 transition sm:opacity-0 sm:group-hover:opacity-100 sm:group-focus-within:opacity-100">
          {onEdit && <button onClick={() => onEdit(tx)} className="btn-ghost !p-1.5" aria-label="Edit"><Pencil size={15} /></button>}
          {onDelete && <button onClick={() => onDelete(tx)} className="btn-ghost !p-1.5 hover:!text-expense" aria-label="Delete"><Trash2 size={15} /></button>}
        </div>
      )}
    </div>
  );
}
