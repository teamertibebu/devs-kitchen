import { createFileRoute, Link } from "@tanstack/react-router";
import { z } from "zod";
import { useStore, fmtMoney } from "@/lib/store";
import { useHydrated } from "@/lib/hydrate";
import { CheckCircle2, MessageSquare } from "lucide-react";
import { useState } from "react";

const search = z.object({ id: z.string().optional() });

export const Route = createFileRoute("/checkout/success")({
  validateSearch: search,
  head: () => ({ meta: [{ title: "Order received — Coastal Kitchen" }] }),
  component: Success,
});

function Success() {
  const { id } = Route.useSearch();
  const order = useStore((s) => s.orders.find((o) => o.id === id));
  const items = useStore((s) => s.items);
  const schedule = useStore((s) => s.schedule);
  const account = useStore((s) => s.account);
  const setAccount = useStore((s) => s.setAccount);
  const hydrated = useHydrated();
  const [accepted, setAccepted] = useState(false);

  if (!hydrated) return null;
  if (!order) {
    return (
      <div className="px-5 max-w-3xl mx-auto py-20 text-center">
        <h1 className="font-display text-3xl uppercase">No order found</h1>
        <Link to="/" className="text-brand underline mt-4 inline-block">Back to menu →</Link>
      </div>
    );
  }

  const day = schedule.pickupDays.find((d) => d.id === order.pickupDayId);
  const slot = day?.slots.find((s) => s.id === order.pickupSlotId);

  return (
    <div className="px-5 md:px-12 max-w-3xl mx-auto py-12 md:py-20">
      <CheckCircle2 className="size-12 text-brand mb-5" />
      <span className="eyebrow block mb-3">Order #{order.id.slice(-6).toUpperCase()}</span>
      <h1 className="font-display text-4xl md:text-6xl uppercase leading-[0.9] mb-4">Pre-order received</h1>
      <p className="text-base md:text-lg text-ink-soft mb-10 max-w-xl">
        Thanks, {order.customer.name.split(" ")[0]}. We'll have everything packed and ready for you on <strong className="text-ink">{day?.label}</strong> at <strong className="text-ink">{slot?.label}</strong>.
      </p>

      <div className="bg-paper border border-rule p-5 md:p-6 mb-6">
        <p className="eyebrow mb-4">Pickup details</p>
        <p className="text-sm leading-relaxed">
          <strong>Where:</strong> 1244 Harbor View Dr, Apt 4B<br />
          San Francisco, CA<br />
          <span className="text-ink-soft">Gate code 2241 · ring the bell.</span>
        </p>
        <p className="text-sm leading-relaxed mt-3">
          <strong>When:</strong> {day?.label}, {slot?.label}
        </p>
        <p className="text-sm leading-relaxed mt-3">
          <strong>Payment:</strong> {order.payment === "cash" ? "Cash — due at pickup. Exact change appreciated." : order.payment === "applepay" ? "Apple Pay — paid." : "Card — paid."}
        </p>
      </div>

      <div className="bg-paper border border-rule p-5 md:p-6 mb-6 flex gap-4">
        <MessageSquare className="size-5 text-brand flex-shrink-0 mt-0.5" />
        <div>
          <p className="font-bold mb-1">We'll text you a reminder</p>
          <p className="text-sm text-ink-soft">The day before pickup, plus a heads-up 2 hours before your slot. Sent to {order.customer.phone}.</p>
        </div>
      </div>

      <div className="border border-rule p-5 md:p-6 mb-10">
        <p className="eyebrow mb-4">Your order</p>
        <ul className="space-y-2 text-sm mb-4">
          {order.lines.map((l) => {
            const it = items.find((i) => i.id === l.itemId);
            return it ? <li key={l.itemId} className="flex justify-between"><span>{l.qty}× {it.name}</span><span>{fmtMoney(it.price * l.qty)}</span></li> : null;
          })}
        </ul>
        <div className="flex justify-between pt-3 border-t border-ink/15 font-display uppercase">
          <span>Total</span>
          <span>{fmtMoney(order.total)}</span>
        </div>
      </div>

      {!account && !accepted && (
        <div className="bg-ink text-bg p-6 md:p-8">
          <p className="eyebrow text-bg/60 mb-3">One more thing</p>
          <h2 className="font-display text-2xl md:text-3xl uppercase mb-3">Save your info for next week?</h2>
          <p className="text-sm text-bg/80 mb-5">Create an account to reorder in one tap. We'll keep your contact details on file — nothing more.</p>
          <div className="flex gap-3">
            <button
              onClick={() => { setAccount({ name: order.customer.name, email: order.customer.email, phone: order.customer.phone }); setAccepted(true); }}
              className="bg-brand text-brand-ink px-6 py-3 font-bold uppercase text-xs tracking-[0.2em]"
            >
              Create account
            </button>
            <button onClick={() => setAccepted(true)} className="text-xs uppercase tracking-[0.2em] font-bold text-bg/60 hover:text-bg">No thanks</button>
          </div>
        </div>
      )}

      <div className="mt-10">
        <Link to="/" className="text-brand underline text-sm">← Back to home</Link>
      </div>
    </div>
  );
}
