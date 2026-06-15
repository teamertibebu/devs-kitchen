import { createFileRoute, Link } from "@tanstack/react-router";
import { useStore, fmtMoney } from "@/lib/store";
import { useHydrated } from "@/lib/hydrate";
import { Plus, MoveUp, MoveDown, Copy, Trash2, EyeOff, Edit2 } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/admin/menu")({
  component: MenuManager,
});

function MenuManager() {
  const items = useStore((s) => s.items);
  const categories = useStore((s) => s.categories);
  const toggleItem = useStore((s) => s.toggleItem);
  const deleteItem = useStore((s) => s.deleteItem);
  const duplicateItem = useStore((s) => s.duplicateItem);
  const moveItem = useStore((s) => s.moveItem);
  const hydrated = useHydrated();

  if (!hydrated) return null;

  return (
    <div className="p-5 md:p-10 max-w-6xl">
      <div className="flex flex-wrap items-end justify-between gap-3 mb-8">
        <div>
          <span className="eyebrow block mb-2">Menu</span>
          <h1 className="font-display text-4xl md:text-5xl uppercase leading-none">This week's batch</h1>
        </div>
        <Link to="/admin/menu/new" className="bg-brand text-brand-ink px-5 py-3 font-bold uppercase text-xs tracking-[0.2em] inline-flex items-center gap-2">
          <Plus className="size-4" /> Add item
        </Link>
      </div>

      {categories.map((cat) => {
        const catItems = items.filter((i) => i.categoryId === cat.id);
        return (
          <section key={cat.id} className="mb-10">
            <div className="flex items-baseline justify-between mb-3 pb-2 border-b border-ink/15">
              <h2 className="font-display text-xl uppercase">{cat.name}</h2>
              <span className="eyebrow">{catItems.length} items</span>
            </div>
            <ul className="space-y-2">
              {catItems.map((item) => (
                <li key={item.id} className="bg-paper border border-rule p-3 md:p-4 flex gap-3 md:gap-4 items-center">
                  <img src={item.image} alt="" className="w-16 h-16 md:w-20 md:h-20 object-cover flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1 flex-wrap">
                      <p className="font-display uppercase text-sm md:text-base">{item.name}</p>
                      {item.featured && <Pill className="bg-brand text-brand-ink">Featured</Pill>}
                      {item.soldOut && <Pill className="bg-ink text-bg">Sold out</Pill>}
                      {!item.available && <Pill className="bg-ink-soft/20 text-ink-soft">Hidden</Pill>}
                    </div>
                    <p className="text-xs text-ink-soft truncate">{fmtMoney(item.price)} · {item.description}</p>
                  </div>
                  <div className="flex flex-col md:flex-row gap-1 md:gap-2 flex-shrink-0">
                    <div className="flex gap-1">
                      <IconBtn onClick={() => moveItem(item.id, -1)} label="Up"><MoveUp className="size-4" /></IconBtn>
                      <IconBtn onClick={() => moveItem(item.id, 1)} label="Down"><MoveDown className="size-4" /></IconBtn>
                    </div>
                    <div className="flex gap-1">
                      <IconBtn onClick={() => { toggleItem(item.id, "soldOut"); toast.success(item.soldOut ? "Back in stock" : "Marked sold out"); }} label="Toggle sold out" tone={item.soldOut ? "active" : undefined}>
                        <EyeOff className="size-4" />
                      </IconBtn>
                      <IconBtn onClick={() => { duplicateItem(item.id); toast.success("Duplicated"); }} label="Duplicate"><Copy className="size-4" /></IconBtn>
                      <Link to="/admin/menu/$id" params={{ id: item.id }} className="p-2 border border-ink/15 hover:bg-ink/5" aria-label="Edit">
                        <Edit2 className="size-4" />
                      </Link>
                      <IconBtn onClick={() => { if (confirm(`Delete ${item.name}?`)) { deleteItem(item.id); toast.success("Deleted"); } }} label="Delete"><Trash2 className="size-4" /></IconBtn>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </section>
        );
      })}
    </div>
  );
}

function Pill({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return <span className={`text-[9px] font-bold uppercase tracking-widest px-1.5 py-0.5 ${className}`}>{children}</span>;
}
function IconBtn({ children, onClick, label, tone }: { children: React.ReactNode; onClick: () => void; label: string; tone?: "active" }) {
  return (
    <button onClick={onClick} aria-label={label} className={`p-2 border ${tone === "active" ? "bg-brand text-brand-ink border-brand" : "border-ink/15 hover:bg-ink/5"}`}>
      {children}
    </button>
  );
}
