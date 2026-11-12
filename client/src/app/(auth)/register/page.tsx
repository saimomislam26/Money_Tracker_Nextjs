"use client";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button, Field } from "@/components/ui";
import { useAuth } from "@/context/AuthContext";
import { errMsg } from "@/lib/api";

const strength = (p: string) => [p.length >= 8, /[A-Z]/.test(p), /\d/.test(p), /[^A-Za-z0-9]/.test(p)].filter(Boolean).length;

export default function RegisterPage() {
  const { register } = useAuth();
  const router = useRouter();
  const [f, setF] = useState({ firstName: "", lastName: "", email: "", password: "" });
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const set = (k: keyof typeof f) => (e: React.ChangeEvent<HTMLInputElement>) => setF({ ...f, [k]: e.target.value });
  const s = strength(f.password);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true); setError("");
    try { await register(f); router.replace("/dashboard"); }
    catch (err) { setError(errMsg(err)); setBusy(false); }
  };

  return (
    <form onSubmit={submit} className="space-y-4">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Create your account</h1>
        <p className="mt-1 text-sm text-muted">Start tracking in under a minute.</p>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <Field label="First name">{(id) => <input id={id} required className="input" autoComplete="given-name" value={f.firstName} onChange={set("firstName")} />}</Field>
        <Field label="Last name">{(id) => <input id={id} required className="input" autoComplete="family-name" value={f.lastName} onChange={set("lastName")} />}</Field>
      </div>
      <Field label="Email">{(id) => <input id={id} type="email" required className="input" autoComplete="email" value={f.email} onChange={set("email")} />}</Field>
      <Field label="Password" hint="At least 8 characters. Mix in capitals, numbers or symbols for a stronger one.">
        {(id) => (
          <>
            <input id={id} type="password" required minLength={8} autoComplete="new-password" className="input" value={f.password} onChange={set("password")} />
            <div className="mt-2 flex gap-1.5">{[1, 2, 3, 4].map((i) => <span key={i} className="h-1 flex-1 rounded-full bg-surface-2" style={i <= s ? { background: ["", "rgb(var(--expense))", "rgb(var(--warn))", "rgb(var(--income))", "rgb(var(--income))"][s] } : undefined} />)}</div>
          </>
        )}
      </Field>
      {error && <p role="alert" className="rounded-lg bg-expense/10 px-3 py-2 text-sm text-expense">{error}</p>}
      <Button type="submit" loading={busy} className="w-full">Create account</Button>
      <p className="text-center text-sm text-muted">Already have an account? <Link href="/login" className="font-medium text-brand hover:underline">Sign in</Link></p>
    </form>
  );
}
