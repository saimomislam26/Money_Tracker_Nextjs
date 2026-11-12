"use client";
import { motion } from "framer-motion";
import { PiggyBank, ShieldCheck, TrendingUp } from "lucide-react";
import { Logo } from "@/components/layout/Logo";

const points = [
  { icon: TrendingUp, t: "See where your money goes", d: "Beautiful charts and monthly insights at a glance." },
  { icon: PiggyBank, t: "Budgets that keep you on track", d: "Set limits per category and get early warnings." },
  { icon: ShieldCheck, t: "Goals, recurring bills, reports", d: "Everything you need, in one calm place." },
];

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="grid min-h-dvh lg:grid-cols-2">
      <div className="relative hidden overflow-hidden bg-gradient-to-br from-indigo-600 via-violet-600 to-fuchsia-600 p-12 text-white lg:flex lg:flex-col lg:justify-between">
        <div className="absolute -right-24 -top-24 h-96 w-96 rounded-full bg-white/10 blur-3xl" />
        <div className="absolute -bottom-32 -left-16 h-96 w-96 rounded-full bg-fuchsia-300/20 blur-3xl" />
        <div className="relative flex items-center gap-3"><Logo /><span className="text-xl font-bold">Moneywise</span></div>
        <div className="relative space-y-8">
          <h2 className="max-w-md text-4xl font-bold leading-tight">Take control of your money, one day at a time.</h2>
          <ul className="space-y-5">
            {points.map(({ icon: I, t, d }, i) => (
              <motion.li key={t} initial={{ opacity: 0, x: -16 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.15 * i + 0.2 }} className="flex gap-4">
                <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-white/15 backdrop-blur"><I size={20} /></span>
                <span><span className="block font-semibold">{t}</span><span className="text-sm text-white/75">{d}</span></span>
              </motion.li>
            ))}
          </ul>
        </div>
        <p className="relative text-sm text-white/60">Private by design. Your data stays yours.</p>
      </div>
      <div className="flex items-center justify-center p-6 sm:p-10">
        <div className="w-full max-w-sm">
          <div className="mb-8 flex items-center gap-3 lg:hidden"><Logo /><span className="text-xl font-bold">Moneywise</span></div>
          {children}
        </div>
      </div>
    </div>
  );
}
