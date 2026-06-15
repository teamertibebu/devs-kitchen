import { createFileRoute, Link } from "@tanstack/react-router";
import { useStore, fmtMoney, useCartTotal } from "@/lib/store";
import { Minus, Plus, X } from "lucide-react";
import { useHydrated } from "@/lib/hydrate";

export const Route = createFileRoute("/cart")({
  head: () => ({ meta: [{ title: "Your Bag — Coastal Kitchen" }, { name: "description", content: "Review your pre-order before checkout." }] }),
  component: CartPage,
});

function CartPage() {
  const cart = useStore((s) => s.cart);
  const items = useStore((s) => s.items);
  const updateQty = useStore((s) => s.updateQty);
  const removeFromCart = useStore((s) => s.removeFromCart);
  const schedule = useStore((s) => s.schedule);
  const total = useCartTotal();
  const hydrated = useHydrated();
  const sat = schedule.pickupDays[0];

  if (!hydrated) return null;

  if (cart.length === 0) {
    return (
      <div className="px-5 md:px-12 max-w-3xl mx-auto py-20 text-center">
        <span className="eyebrow block mb-4">Your bag</span>
        <h1 className="font-display text-4xl md:text-6xl uppercase mb-6">Nothing here yet</h1>
        <p className="text-ink-soft mb-8">Browse this week's menu to start your pre-order.</p>
        <Link to="/menu" className="bg-brand text-brand-ink px-7 py-4 font-bold uppercase text-xs tracking-[0.2em] inline-block">
          See the menu →
        </Link>
      </div>
    );
  }

  return (
    <div className="px-5 md:px-12 max-w-5xl mx-auto py-10 md:py-14 pb-32">
      <span className="eyebrow block mb-3">{schedule.weekLabel}</span>
      <h1 className="font-display text-4xl md:text-6xl uppercase leading-[0.9] mb-2">Your bag</h1>
      <p className="text-ink-soft mb-10">Pre-ordering for pickup <strong className="text-ink">{sat?.label}</strong>. You'll pick your time at checkout.</p>

      <div className="grid md:grid-cols-[1fr_320px] gap-10">
        <div className="divide-y divide-ink/10">
          {cart.map((line) => {
            const item = items.find((i) => i.id === line.itemId);
            if (!item) return null;
            return (
              <div key={line.itemId} className="py-5 flex gap-4">
                <img src={item.image} alt={item.name} className="w-24 h-24 object-cover flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-start gap-3 mb-1">
                    <h3 className="font-display text-base md:text-lg uppercase tracking-tight leading-tight">{item.name}</h3>
                    <button onClick={() => removeFromCart(line.itemId)} aria-label="Remove" className="text-ink-soft hover:text-ink"><X className="size-4" /></button>
                  </div>
                  <p className="text-xs text-ink-soft mb-3">{fmtMoney(item.price)} each</p>
                  <div className="flex items-center justify-between">
                    <div className="inline-flex items-center border border-ink/20">
                      <button onClick={() => updateQty(line.itemId, line.qty - 1)} className="p-2 hover:bg-ink/5"><Minus className="size-3" /></button>
                      <span className="px-4 font-medium text-sm">{line.qty}</span>
                      <button onClick={() => updateQty(line.itemId, line.qty + 1)} className="p-2 hover:bg-ink/5"><Plus className="size-3" /></button>
                    </div>
                    <span className="font-medium">{fmtMoney(item.price * line.qty)}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <aside className="bg-paper border border-rule p-6 h-fit md:sticky md:top-20">
          <p className="eyebrow mb-4">Order summary</p>
          <div className="flex justify-between mb-2 text-sm">
            <span className="text-ink-soft">Subtotal</span>
            <span>{fmtMoney(total)}</span>
          </div>
          <div className="flex justify-between mb-4 text-sm">
            <span className="text-ink-soft">Pickup</span>
            <span>Free</span>
          </div>
          <div className="flex justify-between mb-6 pt-4 border-t border-ink/10">
            <span className="font-display uppercase text-lg">Total</span>
            <span className="font-display text-lg">{fmtMoney(total)}</span>
          </div>
          <Link to="/checkout" className="block w-full bg-brand text-brand-ink text-center py-4 font-bold uppercase text-xs tracking-[0.2em] hover:brightness-110">
            Checkout →
          </Link>
          <p className="text-xs text-ink-soft mt-4">
            Pickup <strong className="text-ink">{sat?.label}</strong>. Orders close Thu 8pm.
          </p>
        </aside>
      </div>
    </div>
  );
}
