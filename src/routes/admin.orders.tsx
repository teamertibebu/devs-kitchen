import { createFileRoute } from "@tanstack/react-router";
import { useStore, fmtMoney } from "@/lib/store";
import { useHydrated } from "@/lib/hydrate";

export const Route = createFileRoute("/admin/orders")({
  component: Orders,
});

function Orders() {
  const orders = useStore((s) => s.orders);
  const schedule = useStore((s) => s.schedule);
  const items = useStore((s) => s.items);
  const hydrated = useHydrated();

  if (!hydrated) return null;

  return (
    <div className="p-5 md:p-10 max-w-5xl">
      <span className="eyebrow block mb-2">Orders</span>
      <h1 className="font-display text-4xl md:text-5xl uppercase leading-none mb-8">Upcoming pickups</h1>

      {orders.length === 0 && (
        <div className="bg-paper border border-rule p-10 text-center">
          <p className="text-ink-soft mb-3">No orders yet for this week.</p>
          <p className="text-xs text-ink-soft">Place a test order from the customer site to see it appear here.</p>
        </div>
      )}

      {schedule.pickupDays.map((day) => {
        const dayOrders = orders.filter((o) => o.pickupDayId === day.id);
        if (dayOrders.length === 0) return null;
        return (
          <section key={day.id} className="mb-10">
            <div className="flex items-baseline justify-between border-b border-ink/15 pb-3 mb-5">
              <h2 className="font-display text-xl uppercase">{day.label}</h2>
              <span className="eyebrow">{dayOrders.length} orders · {fmtMoney(dayOrders.reduce((s, o) => s + o.total, 0))}</span>
            </div>
            <div className="space-y-3">
              {day.slots.map((slot) => {
                const slotOrders = dayOrders.filter((o) => o.pickupSlotId === slot.id);
                if (slotOrders.length === 0) return null;
                return (
                  <div key={slot.id} className="bg-paper border border-rule p-4">
                    <div className="flex items-center justify-between mb-3">
                      <p className="font-bold">{slot.label}</p>
                      <span className="text-xs text-ink-soft">{slotOrders.length} {slotOrders.length === 1 ? "order" : "orders"}</span>
                    </div>
                    <ul className="space-y-3">
                      {slotOrders.map((o) => (
                        <li key={o.id} className="border-t border-ink/10 pt-3 grid sm:grid-cols-[1fr_auto] gap-3">
                          <div>
                            <p className="font-medium">{o.customer.name}</p>
                            <p className="text-xs text-ink-soft">{o.customer.phone}</p>
                            <ul className="text-sm mt-2 text-ink/80">
                              {o.lines.map((l) => {
                                const it = items.find((i) => i.id === l.itemId);
                                return it ? <li key={l.itemId}>{l.qty}× {it.name}</li> : null;
                              })}
                            </ul>
                          </div>
                          <div className="text-right">
                            <p className="font-medium">{fmtMoney(o.total)}</p>
                            <p className="text-[10px] uppercase tracking-widest text-ink-soft">{o.payment === "cash" ? "Cash at pickup" : o.payment === "applepay" ? "Apple Pay" : "Card"}</p>
                          </div>
                        </li>
                      ))}
                    </ul>
                  </div>
                );
              })}
            </div>
          </section>
        );
      })}
    </div>
  );
}
