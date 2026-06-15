import { createFileRoute, Link } from "@tanstack/react-router";
import { useStore, fmtMoney } from "@/lib/store";
import { Plus, Check } from "lucide-react";
import { toast } from "sonner";
import { useHydrated } from "@/lib/hydrate";

export const Route = createFileRoute("/menu")({
  head: () => ({
    meta: [
      { title: "This Week's Menu — Coastal Kitchen" },
      { name: "description", content: "Browse this week's pre-order menu and reserve your Saturday pickup." },
      { property: "og:title", content: "This Week's Menu — Coastal Kitchen" },
      { property: "og:description", content: "Browse this week's pre-order menu and reserve your Saturday pickup." },
    ],
  }),
  component: MenuPage,
});

function MenuPage() {
  const items = useStore((s) => s.items);
  const categories = useStore((s) => s.categories);
  const schedule = useStore((s) => s.schedule);
  const addToCart = useStore((s) => s.addToCart);
  const cart = useStore((s) => s.cart);
  const hydrated = useHydrated();
  const sat = schedule.pickupDays[0];

  return (
    <div className="pb-32 md:pb-16">
      {/* Header */}
      <section className="px-5 md:px-12 max-w-7xl mx-auto pt-10 md:pt-14 pb-8">
        <div className="flex items-baseline gap-4 mb-5">
          <span className="eyebrow">{schedule.weekLabel}</span>
        </div>
        <h1 className="font-display text-5xl md:text-7xl uppercase leading-[0.9] tracking-tight max-w-3xl">
          This week's<br />batch
        </h1>
        <div className="mt-6 flex flex-wrap gap-x-8 gap-y-2 text-sm text-ink-soft">
          <span><strong className="text-ink">Pickup:</strong> {sat?.label}</span>
          <span><strong className="text-ink">Closes:</strong> Thu 8:00 PM</span>
          <span><strong className="text-ink">Where:</strong> Harbor View Dr, SF</span>
        </div>
      </section>

      {/* Menu by category */}
      <section className="px-5 md:px-12 max-w-7xl mx-auto">
        {categories.map((cat) => {
          const catItems = items.filter((i) => i.categoryId === cat.id);
          if (!catItems.length) return null;
          return (
            <div key={cat.id} className="mb-16">
              <div className="flex items-baseline justify-between mb-8 border-b border-ink/15 pb-3">
                <h2 className="font-display text-2xl md:text-3xl uppercase tracking-tight">{cat.name}</h2>
                <span className="eyebrow">{catItems.length} {catItems.length === 1 ? "item" : "items"}</span>
              </div>

              <div className="grid md:grid-cols-2 gap-x-12 gap-y-10">
                {catItems.map((item) => {
                  const inCart = hydrated ? cart.find((l) => l.itemId === item.id) : undefined;
                  return (
                    <article key={item.id} className={`group ${item.soldOut ? "opacity-60" : ""}`}>
                      <Link
                        to="/menu/$itemId"
                        params={{ itemId: item.id }}
                        className="block aspect-[4/3] overflow-hidden bg-paper mb-4 relative"
                      >
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-full h-full object-cover group-hover:scale-[1.02] transition-transform duration-700"
                          loading="lazy"
                          width={1200}
                          height={900}
                        />
                        {item.soldOut && (
                          <div className="absolute top-3 left-3 bg-ink text-bg px-2 py-1 text-[10px] font-bold tracking-[0.2em] uppercase">
                            Sold out
                          </div>
                        )}
                        {item.featured && !item.soldOut && (
                          <div className="absolute top-3 left-3 bg-brand text-brand-ink px-2 py-1 text-[10px] font-bold tracking-[0.2em] uppercase">
                            Featured
                          </div>
                        )}
                      </Link>

                      <div className="flex justify-between items-end mb-2 gap-3">
                        <Link to="/menu/$itemId" params={{ itemId: item.id }}>
                          <h3 className="font-display text-lg md:text-xl uppercase tracking-tight leading-tight">
                            {item.name}
                          </h3>
                        </Link>
                        <span className="font-medium text-brand whitespace-nowrap">{fmtMoney(item.price)}</span>
                      </div>
                      <p className="text-sm text-ink-soft mb-4">{item.description}</p>

                      {!item.soldOut && (
                        <button
                          onClick={() => {
                            addToCart(item.id);
                            toast.success(`Added — ${item.name}`);
                          }}
                          className="inline-flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.2em] px-3 py-2 border border-ink/20 hover:bg-brand hover:border-brand hover:text-brand-ink transition-colors"
                        >
                          {inCart ? <><Check className="size-3" /> In bag ({inCart.qty})</> : <><Plus className="size-3" /> Add to bag</>}
                        </button>
                      )}
                    </article>
                  );
                })}
              </div>
            </div>
          );
        })}
      </section>

      {/* Bottom CTA */}
      <section className="px-5 md:px-12 max-w-4xl mx-auto py-8">
        <Link to="/cart" className="hidden md:flex bg-ink text-bg px-8 py-4 font-bold uppercase text-xs tracking-[0.2em] hover:bg-brand transition-colors w-fit">
          Review your bag →
        </Link>
      </section>
    </div>
  );
}
