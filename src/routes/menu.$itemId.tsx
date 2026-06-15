import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { useStore, fmtMoney } from "@/lib/store";
import { toast } from "sonner";
import { Minus, Plus } from "lucide-react";

export const Route = createFileRoute("/menu/$itemId")({
  component: ItemDetail,
});

function ItemDetail() {
  const { itemId } = Route.useParams();
  const item = useStore((s) => s.items.find((i) => i.id === itemId));
  const addToCart = useStore((s) => s.addToCart);
  const navigate = useNavigate();
  const [qty, setQty] = useState(1);
  const [notes, setNotes] = useState("");

  if (!item) {
    return (
      <div className="px-5 md:px-12 max-w-3xl mx-auto py-20 text-center">
        <p className="eyebrow mb-4">Not found</p>
        <h1 className="font-display text-3xl uppercase mb-4">That dish isn't on the menu this week</h1>
        <Link to="/menu" className="text-brand underline">Back to menu</Link>
      </div>
    );
  }

  return (
    <div className="pb-32 md:pb-16">
      <div className="grid md:grid-cols-2 min-h-[60vh] border-b border-rule">
        <div className="bg-paper">
          <img src={item.image} alt={item.name} className="w-full h-full object-cover aspect-square md:aspect-auto" />
        </div>
        <div className="px-5 md:px-12 py-10 md:py-14 flex flex-col">
          <Link to="/menu" className="eyebrow mb-6 hover:text-brand">← Back to menu</Link>
          <div className="flex gap-2 mb-3">
            {item.featured && <span className="text-[10px] font-bold uppercase tracking-[0.2em] bg-brand text-brand-ink px-2 py-1">Featured</span>}
            {item.popular && <span className="text-[10px] font-bold uppercase tracking-[0.2em] border border-ink/20 px-2 py-1">Popular</span>}
            {item.soldOut && <span className="text-[10px] font-bold uppercase tracking-[0.2em] bg-ink text-bg px-2 py-1">Sold out</span>}
          </div>
          <h1 className="font-display text-4xl md:text-6xl uppercase leading-[0.9] tracking-tight mb-4">{item.name}</h1>
          <p className="text-2xl text-brand font-medium mb-6">{fmtMoney(item.price)}</p>
          <p className="text-base md:text-lg text-ink/80 leading-relaxed mb-8 max-w-md">{item.description}</p>

          {!item.soldOut && (
            <>
              <div className="mb-6">
                <label className="eyebrow block mb-2">Quantity</label>
                <div className="inline-flex items-center border border-ink/20">
                  <button onClick={() => setQty(Math.max(1, qty - 1))} className="p-3 hover:bg-ink/5"><Minus className="size-4" /></button>
                  <span className="px-6 font-display text-xl">{qty}</span>
                  <button onClick={() => setQty(qty + 1)} className="p-3 hover:bg-ink/5"><Plus className="size-4" /></button>
                </div>
              </div>

              <div className="mb-8">
                <label className="eyebrow block mb-2" htmlFor="notes">Notes (optional)</label>
                <textarea
                  id="notes"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  rows={2}
                  placeholder="Any allergies or prep notes?"
                  className="w-full max-w-md border border-ink/20 bg-paper p-3 text-sm font-body focus:outline-none focus:border-brand"
                />
              </div>

              <div className="flex flex-col sm:flex-row gap-3">
                <button
                  onClick={() => {
                    addToCart(item.id, qty);
                    toast.success(`Added ${qty} × ${item.name}`);
                  }}
                  className="bg-brand text-brand-ink px-7 py-4 font-bold uppercase text-xs tracking-[0.2em] hover:brightness-110"
                >
                  Add {qty} to bag — {fmtMoney(item.price * qty)}
                </button>
                <button
                  onClick={() => {
                    addToCart(item.id, qty);
                    navigate({ to: "/cart" });
                  }}
                  className="border border-ink/20 px-7 py-4 font-bold uppercase text-xs tracking-[0.2em] hover:bg-ink/5"
                >
                  Add & checkout →
                </button>
              </div>
            </>
          )}

          {item.soldOut && (
            <p className="text-sm text-ink-soft">This dish is sold out for this week's batch. <Link to="/menu" className="text-brand underline">See what's still available →</Link></p>
          )}
        </div>
      </div>
    </div>
  );
}
