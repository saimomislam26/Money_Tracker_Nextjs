"use client";
import { money } from "@/lib/format";
import { useAuth } from "@/context/AuthContext";
import { cn } from "@/components/ui";

export function useMoney() {
  const { user } = useAuth();
  const cur = user?.currency || "USD";
  return (n: number, o?: { compact?: boolean; sign?: boolean }) => money(n, cur, o);
}

export function Amount({ value, type, className }: { value: number; type?: "income" | "expense"; className?: string }) {
  const fmt = useMoney();
  return (
    <span className={cn("tabular-nums", type === "income" && "text-income", type === "expense" && "text-fg", className)}>
      {type === "income" ? "+" : type === "expense" ? "−" : ""}{fmt(value)}
    </span>
  );
}
