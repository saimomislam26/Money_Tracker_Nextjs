"use client";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, Sparkles } from "lucide-react";
import { Button, Field } from "@/components/ui";
import { useAuth } from "@/context/AuthContext";
import { errMsg } from "@/lib/api";

// Public demo account (created automatically by the API). Override via env for your own deployment.
const DEMO_EMAIL = process.env.NEXT_PUBLIC_DEMO_EMAIL ?? "demo@example.com";
const DEMO_PASSWORD = process.env.NEXT_PUBLIC_DEMO_PASSWORD ?? "Demo@12345";

export default function LoginPage() {
  const { login } = useAuth();
  const router = useRouter();
  const [email, setEmail] = useState(DEMO_EMAIL);
  const [password, setPassword] = useState(DEMO_PASSWORD);
  const [show, setShow] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  const submit = async (e?: React.FormEvent, creds = { email, password }) => {
    e?.preventDefault();
    setBusy(true); setError("");
    try { await login(creds.email, creds.password); router.replace("/dashboard"); }
    catch (err) { setError(errMsg(err)); setBusy(false); }
  };

  return (
    <form onSubmit={submit} className="space-y-5">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Welcome back</h1>
        <p className="mt-1 text-sm text-muted">Sign in to continue to your dashboard.</p>
      </div>
      <Field label="Email">{(id) => <input id={id} type="email" autoComplete="email" required className="input" placeholder="you@example.com" value={email} onChange={(e) => setEmail(e.target.value)} />}</Field>
      <Field label="Password">
        {(id) => (
          <div className="relative">
            <input id={id} type={show ? "text" : "password"} autoComplete="current-password" required className="input pr-11" placeholder="••••••••" value={password} onChange={(e) => setPassword(e.target.value)} />
            <button type="button" onClick={() => setShow(!show)} className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 text-muted hover:text-fg" aria-label={show ? "Hide password" : "Show password"}>{show ? <EyeOff size={17} /> : <Eye size={17} />}</button>
          </div>
        )}
      </Field>
      {error && <p role="alert" className="rounded-lg bg-expense/10 px-3 py-2 text-sm text-expense">{error}</p>}
      <Button type="submit" loading={busy} className="w-full">Sign in</Button>
      <div className="flex items-center gap-3 text-xs text-muted"><span className="h-px flex-1 bg-line" />or<span className="h-px flex-1 bg-line" /></div>
      <Button type="button" variant="outline" disabled={busy} className="w-full" onClick={() => { setEmail(DEMO_EMAIL); setPassword(DEMO_PASSWORD); submit(undefined, { email: DEMO_EMAIL, password: DEMO_PASSWORD }); }}>
        <Sparkles size={16} className="text-brand" /> Try the demo account
      </Button>
      <p className="rounded-lg bg-brand-soft px-3 py-2 text-center text-xs text-muted">Demo login is prefilled: <b className="text-fg">{DEMO_EMAIL}</b> / <b className="text-fg">{DEMO_PASSWORD}</b></p>
      <p className="text-center text-sm text-muted">New here? <Link href="/register" className="font-medium text-brand hover:underline">Create an account</Link></p>
    </form>
  );
}
