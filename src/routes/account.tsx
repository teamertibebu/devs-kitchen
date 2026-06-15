import { createFileRoute, Link } from "@tanstack/react-router";
import { useStore, fmtMoney } from "@/lib/store";
import { useHydrated } from "@/lib/hydrate";

export const Route = createFileRoute("/account")({
  head: () => ({ meta: [{ title: "Your Account — Coastal Kitchen" }] }),
  component: Account,
});

function Account() {
  const account = useStore((s) => s.account);
  const setAccount = useStore((s) => s.setAccount);
  const orders = useStore((s) => s.orders);
  const items = useStore((s) => s.items);
  const schedule = useStore((s) => s.schedule);
  const addToCart = useStore((s) => s.addToCart);
  const hydrated = useHydrated();

  if (!hydrated) return null;

  if (!account) {
    return (
      <div className="px-5 md:px-12 max-w-2xl mx-auto py-16 text-center">
        <span className="eyebrow block mb-3">Account</span>
        <h1 className="font-display text-4xl md:text-5xl uppercase mb-4 leading-tight">Save time next week</h1>
        <p className="text-ink-soft mb-8">Sign in or create an account to see order history, reorder in a tap, and skip filling out contact info.</p>
        <div className="flex gap-3 justify-center">
          <Link to="/auth" className="bg-brand text-brand-ink px-6 py-3 font-bold uppercase text-xs tracking-[0.2em]">Sign in / Sign up</Link>
          <Link to="/menu" className="border border-ink/20 px-6 py-3 font-bold uppercase text-xs tracking-[0.2em]">Continue as guest</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="px-5 md:px-12 max-w-5xl mx-auto py-10 md:py-14">
      <div className="flex flex-wrap items-end justify-between mb-10 gap-4">
        <div>
          <span className="eyebrow block mb-2">Welcome back</span>
          <h1 className="font-display text-4xl md:text-5xl uppercase leading-none">{account.name}</h1>
          <p className="text-ink-soft text-sm mt-2">{account.email} · {account.phone}</p>
        </div>
        <button onClick={() => setAccount(null)} className="text-xs uppercase tracking-[0.2em] font-bold border border-ink/20 px-4 py-2 hover:bg-ink/5">Sign out</button>
      </div>

      <div className="grid md:grid-cols-3 gap-10">
        <div className="md:col-span-2">
          <h2 className="font-display text-2xl uppercase mb-5 border-b border-ink/15 pb-3">Order history</h2>
          {orders.length === 0 ? (
            <p className="text-ink-soft">No orders yet. <Link to="/menu" className="text-brand underline">Start your first pre-order →</Link></p>
          ) : (
            <ul className="space-y-5">
              {orders.map((o) => {
                const day = schedule.pickupDays.find((d) => d.id === o.pickupDayId);
                return (
                  <li key={o.id} className="border border-rule bg-paper p-5">
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <p className="font-display uppercase text-lg">#{o.id.slice(-6).toUpperCase()}</p>
                        <p className="text-xs text-ink-soft">{new Date(o.createdAt).toLocaleDateString()} · Pickup {day?.label}</p>
                      </div>
                      <span className="text-xs font-bold uppercase tracking-widest bg-brand/10 text-brand px-2 py-1">{o.status}</span>
                    </div>
                    <ul className="text-sm mb-3 space-y-1">
                      {o.lines.map((l) => {
                        const it = items.find((i) => i.id === l.itemId);
                        return it ? <li key={l.itemId} className="text-ink-soft">{l.qty}× {it.name}</li> : null;
                      })}
                    </ul>
                    <div className="flex items-center justify-between pt-3 border-t border-ink/10">
                      <span className="font-medium">{fmtMoney(o.total)}</span>
                      <button
                        onClick={() => o.lines.forEach((l) => addToCart(l.itemId, l.qty))}
                        className="text-xs font-bold uppercase tracking-[0.2em] text-brand hover:underline"
                      >
                        Reorder →
                      </button>
                    </div>
                  </li>
                );
              })}
            </ul>
          )}
        </div>

        <div>
          <h2 className="font-display text-xl uppercase mb-5 border-b border-ink/15 pb-3">Profile</h2>
          <div className="space-y-3 text-sm">
            <div>
              <p className="eyebrow mb-1">Name</p>
              <p>{account.name}</p>
            </div>
            <div>
              <p className="eyebrow mb-1">Email</p>
              <p>{account.email}</p>
            </div>
            <div>
              <p className="eyebrow mb-1">Phone</p>
              <p>{account.phone}</p>
            </div>
            <div>
              <p className="eyebrow mb-1">Saved payment</p>
              <p className="text-ink-soft">Handled by payment provider · no card data stored here.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
