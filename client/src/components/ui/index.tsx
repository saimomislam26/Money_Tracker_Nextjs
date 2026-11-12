"use client";
import { useEffect, useId, type ComponentProps, type ReactNode } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronLeft, ChevronRight, Loader2, X } from "lucide-react";
import clsx from "clsx";
import { monthLabel, shiftMonth, ym } from "@/lib/format";

export const cn = clsx;

const VARIANTS = { primary: "btn-primary", ghost: "btn-ghost", outline: "btn-outline", danger: "btn-danger" } as const; // literal names so Tailwind keeps them

export function Button({ loading, children, className, variant = "primary", ...p }: ComponentProps<"button"> & { loading?: boolean; variant?: "primary" | "ghost" | "outline" | "danger" }) {
  return (
    <button {...p} disabled={p.disabled || loading} className={cn(VARIANTS[variant], className)}>
      {loading && <Loader2 size={16} className="animate-spin" />}
      {children}
    </button>
  );
}

export function Field({ label, hint, error, children }: { label: string; hint?: string; error?: string; children: (id: string) => ReactNode }) {
  const id = useId();
  return (
    <div className="space-y-1.5">
      <label htmlFor={id} className="text-xs font-medium text-muted">{label}</label>
      {children(id)}
      {error ? <p className="text-xs text-expense">{error}</p> : hint ? <p className="text-xs text-muted">{hint}</p> : null}
    </div>
  );
}

export function Modal({ open, onClose, title, children, wide }: { open: boolean; onClose: () => void; title: string; children: ReactNode; wide?: boolean }) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => { document.removeEventListener("keydown", onKey); document.body.style.overflow = ""; };
  }, [open, onClose]);

  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-50 flex items-end justify-center sm:items-center sm:p-4" role="dialog" aria-modal="true" aria-label={title}>
          <motion.div className="absolute inset-0 bg-slate-950/50 backdrop-blur-sm" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose} />
          <motion.div
            initial={{ opacity: 0, y: 40, scale: 0.98 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 30, scale: 0.98 }}
            transition={{ type: "spring", damping: 28, stiffness: 320 }}
            className={cn("card relative max-h-[92dvh] w-full overflow-y-auto rounded-b-none p-5 sm:rounded-b-2xl sm:p-6", wide ? "sm:max-w-xl" : "sm:max-w-md")}
          >
            <div className="mb-5 flex items-center justify-between">
              <h2 className="text-lg font-semibold">{title}</h2>
              <button onClick={onClose} className="btn-ghost !p-2" aria-label="Close"><X size={18} /></button>
            </div>
            {children}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}

export function Progress({ value, color, className }: { value: number; color?: string; className?: string }) {
  const pct = Math.max(0, Math.min(100, value));
  const auto = value >= 100 ? "rgb(var(--expense))" : value >= 80 ? "rgb(var(--warn))" : "rgb(var(--income))";
  return (
    <div className={cn("h-2 overflow-hidden rounded-full bg-surface-2", className)}>
      <motion.div className="h-full rounded-full" initial={{ width: 0 }} animate={{ width: `${pct}%` }} transition={{ duration: 0.7, ease: "easeOut" }} style={{ background: color || auto }} />
    </div>
  );
}

export function Skeleton({ className }: { className?: string }) {
  return <div className={cn("relative overflow-hidden rounded-xl bg-surface-2", className)}><div className="absolute inset-0 -translate-x-full animate-shimmer bg-gradient-to-r from-transparent via-white/10 to-transparent" /></div>;
}

export function EmptyState({ icon, title, text, action }: { icon: ReactNode; title: string; text: string; action?: ReactNode }) {
  return (
    <div className="flex flex-col items-center px-6 py-12 text-center">
      <div className="mb-4 grid h-14 w-14 place-items-center rounded-2xl bg-brand-soft text-brand">{icon}</div>
      <h3 className="font-semibold">{title}</h3>
      <p className="mt-1 max-w-xs text-sm text-muted">{text}</p>
      {action && <div className="mt-5">{action}</div>}
    </div>
  );
}

export function PageHeader({ title, subtitle, children }: { title: string; subtitle?: string; children?: ReactNode }) {
  return (
    <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">{title}</h1>
        {subtitle && <p className="mt-0.5 text-sm text-muted">{subtitle}</p>}
      </div>
      <div className="flex flex-wrap items-center gap-2">{children}</div>
    </div>
  );
}

export function Segmented<T extends string>({ value, onChange, options }: { value: T; onChange: (v: T) => void; options: { value: T; label: string }[] }) {
  return (
    <div className="inline-flex rounded-xl bg-surface-2 p-1">
      {options.map((o) => (
        <button key={o.value} type="button" onClick={() => onChange(o.value)}
          className={cn("relative rounded-lg px-3.5 py-1.5 text-sm font-medium transition", value === o.value ? "text-fg" : "text-muted hover:text-fg")}>
          {value === o.value && <motion.span layoutId={`seg-${options.map((x) => x.value).join()}`} className="absolute inset-0 rounded-lg bg-surface shadow-sm" transition={{ type: "spring", damping: 30, stiffness: 400 }} />}
          <span className="relative">{o.label}</span>
        </button>
      ))}
    </div>
  );
}

export function MonthSwitcher({ value, onChange }: { value: string; onChange: (m: string) => void }) {
  const isNow = value === ym();
  return (
    <div className="inline-flex items-center rounded-xl border border-line bg-surface">
      <button onClick={() => onChange(shiftMonth(value, -1))} className="btn-ghost !rounded-r-none !p-2.5" aria-label="Previous month"><ChevronLeft size={18} /></button>
      <button onClick={() => onChange(ym())} className="min-w-36 px-2 text-center text-sm font-medium" title="Jump to this month">{monthLabel(value)}</button>
      <button onClick={() => onChange(shiftMonth(value, 1))} disabled={isNow} className="btn-ghost !rounded-l-none !p-2.5" aria-label="Next month"><ChevronRight size={18} /></button>
    </div>
  );
}

export function Stagger({ children, className }: { children: ReactNode; className?: string }) {
  return <motion.div className={className} initial="hidden" animate="show" variants={{ show: { transition: { staggerChildren: 0.06 } } }}>{children}</motion.div>;
}
export const Item = ({ children, className }: { children: ReactNode; className?: string }) => (
  <motion.div className={className} variants={{ hidden: { opacity: 0, y: 14 }, show: { opacity: 1, y: 0, transition: { duration: 0.35 } } }}>{children}</motion.div>
);

export function ConfirmDialog({ open, title, text, confirmLabel = "Delete", loading, onConfirm, onClose, children }: { children?: ReactNode; open: boolean; title: string; text: string; confirmLabel?: string; loading?: boolean; onConfirm: () => void; onClose: () => void }) {
  return (
    <Modal open={open} onClose={onClose} title={title}>
      <p className="text-sm text-muted">{text}</p>
      {children && <div className="mt-4">{children}</div>}
      <div className="mt-6 flex justify-end gap-2">
        <Button variant="ghost" onClick={onClose}>Cancel</Button>
        <Button variant="danger" loading={loading} onClick={onConfirm}>{confirmLabel}</Button>
      </div>
    </Modal>
  );
}
