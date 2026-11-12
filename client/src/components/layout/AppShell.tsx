"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowLeftRight, BarChart3, LayoutDashboard, LogOut, Menu, Monitor, Moon, PiggyBank, Plus, Repeat, Settings, Sun, Tags, Target, X } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { useTheme } from "@/context/ThemeContext";
import { TransactionModalProvider, useTxModal } from "@/components/transactions/TransactionModal";
import { Logo } from "./Logo";
import { cn } from "@/components/ui";
import { initials } from "@/lib/format";

const NAV = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/transactions", label: "Transactions", icon: ArrowLeftRight },
  { href: "/budgets", label: "Budgets", icon: PiggyBank },
  { href: "/goals", label: "Goals", icon: Target },
  { href: "/recurring", label: "Recurring", icon: Repeat },
  { href: "/reports", label: "Reports", icon: BarChart3 },
  { href: "/categories", label: "Categories", icon: Tags },
  { href: "/settings", label: "Settings", icon: Settings },
];

function Avatar({ size = 36 }: { size?: number }) {
  const { user } = useAuth();
  if (user?.profileImageUrl) return <img src={user.profileImageUrl} alt="" className="shrink-0 rounded-full object-cover" style={{ width: size, height: size }} />;
  return <span className="grid shrink-0 place-items-center rounded-full bg-gradient-to-br from-brand to-fuchsia-500 text-xs font-semibold text-white" style={{ width: size, height: size }}>{initials(user?.firstName, user?.lastName)}</span>;
}

function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const opts = [{ v: "light", i: Sun }, { v: "system", i: Monitor }, { v: "dark", i: Moon }] as const;
  return (
    <div className="flex rounded-xl bg-surface-2 p-1">
      {opts.map(({ v, i: I }) => (
        <button key={v} onClick={() => setTheme(v)} aria-label={`${v} theme`} className={cn("flex-1 rounded-lg p-1.5 transition", theme === v ? "bg-surface text-fg shadow-sm" : "text-muted hover:text-fg")}><I size={15} className="mx-auto" /></button>
      ))}
    </div>
  );
}

function SidebarContent({ onNavigate }: { onNavigate?: () => void }) {
  const path = usePathname();
  const { user, logout } = useAuth();
  const { open } = useTxModal();
  return (
    <div className="flex h-full flex-col gap-6 p-4">
      <Link href="/dashboard" className="flex items-center gap-3 px-2 pt-1" onClick={onNavigate}>
        <Logo />
        <span className="text-lg font-bold tracking-tight">Money<span className="gradient-text">wise</span></span>
      </Link>
      <button className="btn-primary w-full" onClick={() => { open(); onNavigate?.(); }}><Plus size={18} /> Add transaction <kbd className="ml-auto rounded bg-white/20 px-1.5 text-[10px] dark:bg-black/10">N</kbd></button>
      <nav className="flex-1 space-y-1">
        {NAV.map(({ href, label, icon: Icon }) => {
          const active = path === href || path.startsWith(href + "/");
          return (
            <Link key={href} href={href} onClick={onNavigate} className={cn("relative flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition", active ? "text-brand" : "text-muted hover:bg-surface-2 hover:text-fg")}>
              {active && <motion.span layoutId="nav-active" className="absolute inset-0 rounded-xl bg-brand-soft" transition={{ type: "spring", damping: 30, stiffness: 400 }} />}
              <Icon size={18} className="relative" /><span className="relative">{label}</span>
            </Link>
          );
        })}
      </nav>
      <div className="space-y-3">
        <ThemeToggle />
        <div className="flex items-center gap-3 rounded-xl bg-surface-2/70 p-2.5">
          <Avatar />
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-semibold">{user?.firstName} {user?.lastName}</p>
            <p className="truncate text-xs text-muted">{user?.email}</p>
          </div>
          <button onClick={logout} className="btn-ghost !p-2" aria-label="Sign out" title="Sign out"><LogOut size={16} /></button>
        </div>
      </div>
    </div>
  );
}

function Shell({ children }: { children: React.ReactNode }) {
  const path = usePathname();
  const [drawer, setDrawer] = useState(false);
  const { open } = useTxModal();
  useEffect(() => setDrawer(false), [path]);

  return (
    <div className="min-h-dvh lg:pl-64">
      <aside className="fixed inset-y-0 left-0 z-30 hidden w-64 border-r border-line bg-surface lg:block"><SidebarContent /></aside>

      <header className="sticky top-0 z-30 flex items-center justify-between border-b border-line bg-surface/80 px-4 py-3 backdrop-blur lg:hidden">
        <button className="btn-ghost !p-2" onClick={() => setDrawer(true)} aria-label="Open menu"><Menu size={20} /></button>
        <div className="flex items-center gap-2"><Logo size={28} /><span className="font-bold">Moneywise</span></div>
        <button className="btn-primary !rounded-full !p-2" onClick={() => open()} aria-label="Add transaction"><Plus size={18} /></button>
      </header>

      <AnimatePresence>
        {drawer && (
          <div className="fixed inset-0 z-40 lg:hidden">
            <motion.div className="absolute inset-0 bg-slate-950/50 backdrop-blur-sm" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setDrawer(false)} />
            <motion.aside className="absolute inset-y-0 left-0 w-72 border-r border-line bg-surface" initial={{ x: -300 }} animate={{ x: 0 }} exit={{ x: -300 }} transition={{ type: "spring", damping: 32, stiffness: 320 }}>
              <button className="btn-ghost absolute right-3 top-3 !p-2" onClick={() => setDrawer(false)} aria-label="Close menu"><X size={18} /></button>
              <SidebarContent onNavigate={() => setDrawer(false)} />
            </motion.aside>
          </div>
        )}
      </AnimatePresence>

      <main className="mx-auto max-w-6xl px-4 py-6 sm:px-6 lg:py-8">
        <motion.div key={path} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.25 }}>{children}</motion.div>
      </main>
    </div>
  );
}

export function AppShell({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  const router = useRouter();
  useEffect(() => { if (!loading && !user) router.replace("/login"); }, [loading, user, router]);

  if (loading || !user) {
    return <div className="grid min-h-dvh place-items-center"><div className="animate-pulse"><Logo size={48} /></div></div>;
  }
  return <TransactionModalProvider><Shell>{children}</Shell></TransactionModalProvider>;
}
