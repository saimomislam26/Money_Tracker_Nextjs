"use client";
import { useRef, useState } from "react";
import { Camera, Monitor, Moon, Sun } from "lucide-react";
import { toast } from "sonner";
import { Button, ConfirmDialog, Field, PageHeader, cn } from "@/components/ui";
import { useAuth } from "@/context/AuthContext";
import { useTheme } from "@/context/ThemeContext";
import { api, clearToken, errMsg } from "@/lib/api";
import { initials } from "@/lib/format";
import type { User } from "@/lib/types";

const CURRENCIES = ["USD", "EUR", "GBP", "BDT", "INR", "JPY", "CAD", "AUD", "CNY", "AED", "SAR", "SGD", "CHF", "TRY", "BRL", "MXN", "ZAR", "NGN", "PKR"];

function Section({ title, desc, children }: { title: string; desc?: string; children: React.ReactNode }) {
  return (
    <section className="card p-5 sm:p-6">
      <h2 className="font-semibold">{title}</h2>
      {desc && <p className="mb-5 mt-0.5 text-sm text-muted">{desc}</p>}
      <div className={desc ? "" : "mt-5"}>{children}</div>
    </section>
  );
}

export default function SettingsPage() {
  const { user, setUser, logout } = useAuth();
  const { theme, setTheme } = useTheme();
  const file = useRef<HTMLInputElement>(null);
  const [p, setP] = useState({ firstName: user?.firstName || "", lastName: user?.lastName || "", email: user?.email || "", currency: user?.currency || "USD" });
  const [pw, setPw] = useState({ currentPassword: "", newPassword: "" });
  const [busy, setBusy] = useState("");
  const [delOpen, setDelOpen] = useState(false);
  const [delPw, setDelPw] = useState("");

  const wrap = async (key: string, fn: () => Promise<void>) => { setBusy(key); try { await fn(); } catch (e) { toast.error(errMsg(e)); } finally { setBusy(""); } };

  const saveProfile = (e: React.FormEvent) => { e.preventDefault(); wrap("profile", async () => { const { data } = await api.put<{ user: User }>("/users/me", p); setUser(data.user); toast.success("Profile updated"); }); };
  const savePw = (e: React.FormEvent) => { e.preventDefault(); wrap("pw", async () => { await api.put("/users/me/password", pw); setPw({ currentPassword: "", newPassword: "" }); toast.success("Password changed"); }); };
  const upload = (f?: File) => {
    if (!f) return;
    if (f.size > 3 * 1024 * 1024) return toast.error("Image must be under 3 MB");
    wrap("avatar", async () => { const fd = new FormData(); fd.append("avatar", f); const { data } = await api.put<{ user: User }>("/users/me/avatar", fd); setUser(data.user); toast.success("Photo updated"); });
  };
  const deleteAccount = () => wrap("del", async () => { await api.delete("/users/me", { data: { password: delPw } }); clearToken(); toast.success("Account deleted"); location.href = "/register"; });

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <PageHeader title="Settings" subtitle="Manage your profile and preferences." />

      <Section title="Profile">
        <div className="mb-6 flex items-center gap-4">
          <button onClick={() => file.current?.click()} className="group relative" aria-label="Change photo">
            {user?.profileImageUrl ? <img src={user.profileImageUrl} alt="" className="h-20 w-20 rounded-full object-cover" /> : <span className="grid h-20 w-20 place-items-center rounded-full bg-gradient-to-br from-brand to-fuchsia-500 text-2xl font-semibold text-white">{initials(user?.firstName, user?.lastName)}</span>}
            <span className="absolute inset-0 grid place-items-center rounded-full bg-black/50 text-white opacity-0 transition group-hover:opacity-100">{busy === "avatar" ? "…" : <Camera size={20} />}</span>
          </button>
          <input ref={file} type="file" accept="image/*" hidden onChange={(e) => upload(e.target.files?.[0])} />
          <div><p className="font-medium">Profile photo</p><p className="text-sm text-muted">JPG or PNG, up to 3 MB.</p></div>
        </div>
        <form onSubmit={saveProfile} className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="First name">{(id) => <input id={id} className="input" required value={p.firstName} onChange={(e) => setP({ ...p, firstName: e.target.value })} />}</Field>
            <Field label="Last name">{(id) => <input id={id} className="input" required value={p.lastName} onChange={(e) => setP({ ...p, lastName: e.target.value })} />}</Field>
          </div>
          <Field label="Email">{(id) => <input id={id} className="input" type="email" required value={p.email} onChange={(e) => setP({ ...p, email: e.target.value })} />}</Field>
          <Field label="Currency" hint="Used to display all amounts. Existing amounts are not converted.">{(id) => <select id={id} className="input" value={p.currency} onChange={(e) => setP({ ...p, currency: e.target.value })}>{CURRENCIES.map((c) => <option key={c}>{c}</option>)}</select>}</Field>
          <div className="flex justify-end"><Button type="submit" loading={busy === "profile"}>Save profile</Button></div>
        </form>
      </Section>

      <Section title="Appearance">
        <div className="grid grid-cols-3 gap-3">
          {([["light", Sun, "Light"], ["dark", Moon, "Dark"], ["system", Monitor, "System"]] as const).map(([v, I, l]) => (
            <button key={v} onClick={() => setTheme(v)} className={cn("flex flex-col items-center gap-2 rounded-xl border p-4 text-sm font-medium transition", theme === v ? "border-brand bg-brand-soft text-brand" : "border-line hover:bg-surface-2")}><I size={20} />{l}</button>
          ))}
        </div>
      </Section>

      <Section title="Password">
        <form onSubmit={savePw} className="space-y-4">
          <Field label="Current password">{(id) => <input id={id} className="input" type="password" autoComplete="current-password" required value={pw.currentPassword} onChange={(e) => setPw({ ...pw, currentPassword: e.target.value })} />}</Field>
          <Field label="New password" hint="At least 8 characters.">{(id) => <input id={id} className="input" type="password" autoComplete="new-password" minLength={8} required value={pw.newPassword} onChange={(e) => setPw({ ...pw, newPassword: e.target.value })} />}</Field>
          <div className="flex justify-end"><Button type="submit" loading={busy === "pw"}>Update password</Button></div>
        </form>
      </Section>

      <Section title="Session & data">
        <div className="flex flex-wrap gap-3">
          <Button variant="outline" onClick={logout}>Sign out</Button>
          <Button variant="danger" onClick={() => setDelOpen(true)}>Delete account…</Button>
        </div>
      </Section>

      <ConfirmDialog open={delOpen} title="Delete your account?" confirmLabel="Delete forever" loading={busy === "del"} onConfirm={deleteAccount} onClose={() => setDelOpen(false)}
        text="This permanently removes your profile, transactions, budgets and goals. Enter your password to confirm.">
        <input className="input" type="password" autoComplete="current-password" placeholder="Your password" aria-label="Password" value={delPw} onChange={(e) => setDelPw(e.target.value)} />
      </ConfirmDialog>
    </div>
  );
}
