import { createFileRoute } from "@tanstack/react-router";
import { useStore } from "@/lib/store";
import { toast } from "sonner";

export const Route = createFileRoute("/admin/business")({
  component: BusinessInfo,
});

function BusinessInfo() {
  const b = useStore((s) => s.business);
  const update = useStore((s) => s.updateBusiness);

  return (
    <div className="p-5 md:p-10 max-w-3xl">
      <span className="eyebrow block mb-2">Business info</span>
      <h1 className="font-display text-4xl md:text-5xl uppercase leading-none mb-8">Your details</h1>

      <div className="space-y-5 bg-paper border border-rule p-5 md:p-6">
        <Field label="Business name" value={b.name} onChange={(v) => update({ name: v })} />
        <Field label="Tagline" value={b.tagline} onChange={(v) => update({ tagline: v })} textarea />
        <Field label="Owner name" value={b.ownerName} onChange={(v) => update({ ownerName: v })} />
        <Field label="Story" value={b.story} onChange={(v) => update({ story: v })} textarea />
        <Field label="Address" value={b.address} onChange={(v) => update({ address: v })} />
        <Field label="City / neighborhood" value={b.neighborhood} onChange={(v) => update({ neighborhood: v })} />
        <Field label="Phone" value={b.phone} onChange={(v) => update({ phone: v })} />
        <Field label="Email" value={b.email} onChange={(v) => update({ email: v })} />
        <Field label="Instagram" value={b.instagram} onChange={(v) => update({ instagram: v })} />
        <Field label="Hours" value={b.hours} onChange={(v) => update({ hours: v })} />
      </div>

      <button onClick={() => toast.success("Saved")} className="mt-6 bg-brand text-brand-ink px-7 py-3 font-bold uppercase text-xs tracking-[0.2em]">
        Save business info
      </button>
    </div>
  );
}

function Field({ label, value, onChange, textarea }: { label: string; value: string; onChange: (v: string) => void; textarea?: boolean }) {
  return (
    <label className="block">
      <span className="eyebrow block mb-1.5">{label}</span>
      {textarea ? (
        <textarea value={value} onChange={(e) => onChange(e.target.value)} rows={3} className="w-full border border-ink/20 bg-paper p-3 font-body" />
      ) : (
        <input value={value} onChange={(e) => onChange(e.target.value)} className="w-full border border-ink/20 bg-paper p-3 font-body" />
      )}
    </label>
  );
}
