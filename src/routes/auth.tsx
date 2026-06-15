import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { useStore } from "@/lib/store";

export const Route = createFileRoute("/auth")({
  head: () => ({ meta: [{ title: "Sign in — Coastal Kitchen" }] }),
  component: Auth,
});

function Auth() {
  const setAccount = useStore((s) => s.setAccount);
  const navigate = useNavigate();
  const [mode, setMode] = useState<"in" | "up">("in");
  const [form, setForm] = useState({ name: "", email: "", phone: "" });

  function submit(e: React.FormEvent) {
    e.preventDefault();
    const name = form.name || form.email.split("@")[0];
    setAccount({ name, email: form.email, phone: form.phone || "(415) 555-0000" });
    navigate({ to: "/account" });
  }

  return (
    <div className="px-5 md:px-12 max-w-md mx-auto py-12 md:py-20">
      <span className="eyebrow block mb-3">{mode === "in" ? "Sign in" : "Create account"}</span>
      <h1 className="font-display text-4xl md:text-5xl uppercase leading-tight mb-3">{mode === "in" ? "Welcome back" : "Save your info"}</h1>
      <p className="text-ink-soft mb-8 text-sm">
        {mode === "in" ? "Sign in to see your past orders." : "Optional — guest checkout works too."}
      </p>

      <form onSubmit={submit} className="space-y-4">
        {mode === "up" && (
          <Field label="Name" value={form.name} onChange={(v) => setForm({ ...form, name: v })} />
        )}
        <Field label="Email" type="email" value={form.email} onChange={(v) => setForm({ ...form, email: v })} required />
        {mode === "up" && (
          <Field label="Phone" type="tel" value={form.phone} onChange={(v) => setForm({ ...form, phone: v })} />
        )}
        {mode === "in" && (
          <Field label="Password" type="password" value="" onChange={() => {}} placeholder="••••••••" />
        )}

        <button type="submit" className="w-full bg-brand text-brand-ink py-4 font-bold uppercase text-xs tracking-[0.2em]">
          {mode === "in" ? "Sign in" : "Create account"}
        </button>
      </form>

      <p className="mt-6 text-sm text-ink-soft text-center">
        {mode === "in" ? "No account?" : "Already have one?"}{" "}
        <button onClick={() => setMode(mode === "in" ? "up" : "in")} className="text-brand underline">
          {mode === "in" ? "Create one" : "Sign in"}
        </button>
      </p>
      <p className="mt-2 text-[10px] uppercase tracking-widest text-ink-soft text-center">Prototype · no real auth</p>
    </div>
  );
}

function Field({ label, value, onChange, type = "text", required, placeholder }: { label: string; value: string; onChange: (v: string) => void; type?: string; required?: boolean; placeholder?: string }) {
  return (
    <label className="block">
      <span className="eyebrow block mb-1.5">{label}</span>
      <input type={type} value={value} required={required} placeholder={placeholder} onChange={(e) => onChange(e.target.value)} className="w-full border border-ink/20 bg-paper p-3 text-base font-body focus:outline-none focus:border-brand" />
    </label>
  );
}
