import { createFileRoute, Link } from "@tanstack/react-router";
import { useStore, fmtMoney } from "@/lib/store";
import { useHydrated } from "@/lib/hydrate";
import { Plus, Calendar, Eye, MessageSquare } from "lucide-react";

export const Route = createFileRoute("/admin/")({
  component: Dashboard,
});

function Dashboard() {
  const orders = useStore((s) => s.orders);
  const items = useStore((s) => s.items);
  const schedule = useStore((s) => s.schedule);
  const business = useStore((s) => s.business);
  const hydrated = useHydrated();

  if (!hydrated) return null;

  const upcoming = orders.filter((o) => o.status === "received");
  const nextDay = schedule.pickupDays[0];
  const todaysOrders = upcoming.filter((o) => o.pickupDayId === nextDay.id);
  const totalRevenue = upcoming.reduce((s, o) => s + o.total, 0);

  const itemCounts: Record<string, number> = {};
  upcoming.forEach((o) => o.lines.forEach((l) => { itemCounts[l.itemId] = (itemCounts[l.itemId] || 0) + l.qty; }));
  const top = Object.entries(itemCounts).sort((a, b) => b[1] - a[1]).slice(0, 5);

  return (
    <div className="p-5 md:p-10 max-w-6xl">
      <span className="eyebrow block mb-2">{schedule.weekLabel}</span>
      <h1 className="font-display text-4xl md:text-5xl uppercase leading-none mb-2">Good morning, {business.ownerName.split(" ")[0]}</h1>
      <p className="text-ink-soft mb-10">Here's where things stand for {nextDay.label}.</p>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 mb-10">
        <Stat label="Orders" value={String(todaysOrders.length)} />
        <Stat label="Revenue" value={fmtMoney(totalRevenue)} />
        <Stat label="Items live" value={String(items.filter((i) => !i.soldOut && i.available).length)} />
        <Stat label="Sold out" value={String(items.filter((i) => i.soldOut).length)} />
      </div>

      <div className="grid md:grid-cols-2 gap-6 mb-10">
        <Card title="Quick actions">
          <div className="grid grid-cols-2 gap-2">
            <Action to="/admin/menu/new" icon={Plus} label="Add item" />
            <Action to="/admin/menu" icon={Eye} label="Edit menu" />
            <Action to="/admin/schedule" icon={Calendar} label="Schedule" />
            <Action to="/admin/reminders" icon={MessageSquare} label="Reminders" />
          </div>
        </Card>

        <Card title="Most pre-ordered this week">
          {top.length === 0 ? (
            <p className="text-sm text-ink-soft">No orders yet this week.</p>
          ) : (
            <ul className="space-y-2 text-sm">
              {top.map(([id, qty]) => {
                const it = items.find((i) => i.id === id);
                return (
                  <li key={id} className="flex justify-between">
                    <span>{it?.name ?? id}</span>
                    <span className="font-display">{qty}</span>
                  </li>
                );
              })}
            </ul>
          )}
        </Card>
      </div>

      <Card title="Pickup slots — next pickup day">
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2">
          {nextDay.slots.map((s) => {
            const bookedInOrders = upcoming.filter((o) => o.pickupSlotId === s.id).length + s.booked;
            const pct = Math.min(100, Math.round((bookedInOrders / s.capacity) * 100));
            return (
              <div key={s.id} className="p-3 border border-rule">
                <p className="text-xs font-bold">{s.label}</p>
                <p className="text-[10px] uppercase tracking-widest text-ink-soft mb-2">{bookedInOrders}/{s.capacity}</p>
                <div className="h-1 bg-ink/10">
                  <div className="h-full bg-brand" style={{ width: `${pct}%` }} />
                </div>
              </div>
            );
          })}
        </div>
      </Card>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="bg-paper border border-rule p-4">
      <p className="eyebrow mb-2">{label}</p>
      <p className="font-display text-3xl uppercase leading-none">{value}</p>
    </div>
  );
}
function Card({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="bg-paper border border-rule p-5">
      <p className="eyebrow mb-4">{title}</p>
      {children}
    </div>
  );
}
function Action({ to, icon: Icon, label }: { to: string; icon: React.ElementType; label: string }) {
  return (
    <Link to={to} className="flex flex-col items-start gap-2 p-3 border border-ink/15 hover:border-brand hover:text-brand">
      <Icon className="size-4" />
      <span className="text-xs font-bold uppercase tracking-widest">{label}</span>
    </Link>
  );
}
