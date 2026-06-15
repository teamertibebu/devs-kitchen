import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useState } from "react";
import { useStore, type Item, fmtMoney } from "@/lib/store";
import { toast } from "sonner";

export const Route = createFileRoute("/admin/menu/new")({
  component: NewItem,
});

function NewItem() {
  const categories = useStore((s) => s.categories);
  const saveItem = useStore((s) => s.saveItem);
  const navigate = useNavigate();
  const [item, setItem] = useState<Item>({
    id: `item_${Date.now()}`,
    name: "",
    description: "",
    price: 0,
    categoryId: categories[0]?.id ?? "mains",
    image: "https://images.unsplash.com/photo-1495521821757-a1efb6729352?w=800&h=600&fit=crop",
    available: true,
    soldOut: false,
    featured: false,
    popular: false,
  });
  return <ItemForm item={item} onChange={setItem} onSave={() => { saveItem(item); toast.success("Added"); navigate({ to: "/admin/menu" }); }} title="New item" />;
}

export function ItemForm({ item, onChange, onSave, title }: { item: Item; onChange: (i: Item) => void; onSave: () => void; title: string }) {
  function fileChosen(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const url = URL.createObjectURL(file);
    onChange({ ...item, image: url });
  }

  return (
    <div className="p-5 md:p-10 max-w-3xl">
      <Link to="/admin/menu" className="eyebrow hover:text-brand mb-5 inline-block">← Back to menu</Link>
      <h1 className="font-display text-4xl md:text-5xl uppercase leading-none mb-8">{title}</h1>

      <div className="space-y-6">
        <Field label="Item name" value={item.name} onChange={(v) => onChange({ ...item, name: v })} placeholder="e.g. Lemon Polenta Cake" />
        <Field label="Short description" value={item.description} onChange={(v) => onChange({ ...item, description: v })} placeholder="One sentence — what makes this special?" textarea />
        <div className="grid grid-cols-2 gap-4">
          <Field label="Price ($)" type="number" value={String(item.price)} onChange={(v) => onChange({ ...item, price: Number(v) || 0 })} />
          <div>
            <Label>Category</Label>
            <select value={item.categoryId} onChange={(e) => onChange({ ...item, categoryId: e.target.value })} className="w-full border border-ink/20 bg-paper p-3 text-base font-body">
              {useStore.getState().categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
          </div>
        </div>

        <div>
          <Label>Photo</Label>
          <div className="flex items-center gap-4">
            <img src={item.image} alt="" className="w-24 h-24 object-cover border border-rule" />
            <label className="cursor-pointer border border-ink/20 px-4 py-2 text-xs font-bold uppercase tracking-widest hover:bg-ink/5">
              Upload photo
              <input type="file" accept="image/*" onChange={fileChosen} className="hidden" />
            </label>
          </div>
          <p className="text-xs text-ink-soft mt-2">Square works best. Phone shots are fine.</p>
        </div>

        <div className="space-y-3">
          <Toggle label="Available this week" checked={item.available} onChange={(v) => onChange({ ...item, available: v })} />
          <Toggle label="Mark as sold out" checked={item.soldOut} onChange={(v) => onChange({ ...item, soldOut: v })} />
          <Toggle label="Featured on home page" checked={item.featured} onChange={(v) => onChange({ ...item, featured: v })} />
          <Toggle label="Popular" checked={item.popular} onChange={(v) => onChange({ ...item, popular: v })} />
        </div>

        <Field label="Notes (kitchen only)" value={item.notes ?? ""} onChange={(v) => onChange({ ...item, notes: v })} placeholder="Allergens, prep notes…" textarea />

        <div className="flex gap-3 pt-4 border-t border-rule">
          <button onClick={onSave} className="bg-brand text-brand-ink px-7 py-3 font-bold uppercase text-xs tracking-[0.2em]">Save item</button>
          <Link to="/admin/menu" className="border border-ink/20 px-7 py-3 font-bold uppercase text-xs tracking-[0.2em] hover:bg-ink/5">Cancel</Link>
        </div>
      </div>

      <div className="mt-10 bg-paper border border-rule p-5">
        <p className="eyebrow mb-3">Preview</p>
        <div className="flex gap-4">
          <img src={item.image} alt="" className="w-20 h-20 object-cover" />
          <div>
            <p className="font-display uppercase">{item.name || "Untitled"} <span className="text-brand">· {fmtMoney(item.price)}</span></p>
            <p className="text-sm text-ink-soft">{item.description || "Add a description…"}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

function Label({ children }: { children: React.ReactNode }) {
  return <span className="eyebrow block mb-1.5">{children}</span>;
}
function Field({ label, value, onChange, type = "text", placeholder, textarea }: { label: string; value: string; onChange: (v: string) => void; type?: string; placeholder?: string; textarea?: boolean }) {
  return (
    <label className="block">
      <Label>{label}</Label>
      {textarea ? (
        <textarea value={value} onChange={(e) => onChange(e.target.value)} rows={3} placeholder={placeholder} className="w-full border border-ink/20 bg-paper p-3 text-base font-body focus:outline-none focus:border-brand" />
      ) : (
        <input type={type} value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder} className="w-full border border-ink/20 bg-paper p-3 text-base font-body focus:outline-none focus:border-brand" />
      )}
    </label>
  );
}
function Toggle({ label, checked, onChange }: { label: string; checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <label className="flex items-center justify-between gap-4 cursor-pointer p-3 bg-paper border border-rule">
      <span className="text-sm font-medium">{label}</span>
      <span className={`relative inline-block w-10 h-6 rounded-full transition-colors ${checked ? "bg-brand" : "bg-ink/15"}`}>
        <input type="checkbox" checked={checked} onChange={(e) => onChange(e.target.checked)} className="sr-only" />
        <span className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full transition-transform ${checked ? "translate-x-4" : ""}`} />
      </span>
    </label>
  );
}
