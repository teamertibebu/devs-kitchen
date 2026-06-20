import { createFileRoute, Link } from "@tanstack/react-router";
import { useStore, fmtMoney } from "@/lib/store";
import { useHydrated } from "@/lib/hydrate";
import ownerImg from "@/assets/owner.jpg";

// Force a full page reload on HMR updates to this module so layout
// changes never get masked by a stale Vite error overlay or cached
// transform during development.
if (import.meta.hot) {
  import.meta.hot.accept(() => {
    import.meta.hot!.invalidate();
  });
}

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Dev's Kitchen — Weekly Pre-Order for Saturday Pickup" },
      {
        name: "description",
        content:
          "Hand-rolled pasta and slow-fermented bread from a home kitchen. Pre-order this week's batch for Saturday pickup in San Francisco.",
      },
      { property: "og:title", content: "Dev's Kitchen" },
      { property: "og:description", content: "Pre-order this week's batch for Saturday pickup." },
    ],
  }),
  component: Home,
});

function Home() {
  const items = useStore((s) => s.items);
  const business = useStore((s) => s.business);
  const schedule = useStore((s) => s.schedule);
  const addToCart = useStore((s) => s.addToCart);
  const hydrated = useHydrated();

  const weekMeals = items.filter((i) => i.featured && !i.soldOut).slice(0, 2);
  const sat = schedule.pickupDays[0];

  return (
    <div className="pb-24 md:pb-8">
      {/* TWO MEAL CARDS — above the fold, cream background */}
      <section className="px-5 md:px-10 pt-6 md:pt-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 md:gap-8">
          {weekMeals.map((item) => (
            <article
              key={item.id}
              className="group bg-paper border border-rule overflow-hidden flex flex-col animate-[slide-up_0.6s_var(--ease-out-expo)_both] hover:border-brand transition-colors"
            >
              <div className="relative aspect-square overflow-hidden">
                <img
                  src={item.image}
                  alt={item.name}
                  className="absolute inset-0 w-full h-full object-cover group-hover:scale-[1.04] transition-transform duration-700"
                />
                <span
                  className="absolute top-3 right-3 bg-brand text-brand-ink font-display text-base md:text-lg px-3 py-1 shadow-md"
                  style={{ transform: "rotate(-4deg)" }}
                >
                  {fmtMoney(item.price).replace(".00", "")}
                </span>
              </div>

              <div className="p-5 md:p-6 flex flex-col flex-1">
                <h2 className="font-display text-2xl md:text-4xl uppercase tracking-tight leading-[0.95] mb-3">
                  {item.name}
                </h2>
                <p className="text-sm md:text-base text-ink-soft leading-snug mb-5 flex-1">
                  {item.description}
                </p>
                <div className="flex gap-3">
                  <button
                    onClick={() => addToCart(item.id, 1)}
                    className="flex-1 bg-brand text-brand-ink px-5 py-3 font-bold uppercase text-xs tracking-[0.18em] hover:brightness-110 transition-all"
                  >
                    Add to bag
                  </button>
                  <Link
                    to="/menu/$itemId"
                    params={{ itemId: item.id }}
                    className="px-4 py-3 font-bold uppercase text-xs tracking-[0.18em] text-ink-soft hover:text-brand transition-colors self-center"
                  >
                    See more →
                  </Link>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* QUICK INFO STRIP */}
      <section className="px-5 md:px-12 mt-12 md:mt-16">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 border-y border-rule py-8">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-brand mb-2">Pickup</p>
            <p className="font-display text-xl uppercase tracking-tight" suppressHydrationWarning>
              {hydrated ? sat?.label : "Saturday"}
            </p>
          </div>
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-brand mb-2">Window</p>
            <p className="font-display text-xl uppercase tracking-tight">
              {sat?.slots[0].label.split(" — ")[0]}–{sat?.slots[sat.slots.length - 1].label.split(" — ")[1]}
            </p>
          </div>
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-brand mb-2">Where</p>
            <p className="font-display text-xl uppercase tracking-tight">{business.neighborhood}</p>
          </div>
        </div>
      </section>

      {/* PAPRIKA TRANSITION BAND */}
      <div className="mt-16 bg-brand text-brand-ink py-5 px-5 md:px-12">
        <p className="font-display text-lg md:text-2xl uppercase tracking-tight text-center">
          One kitchen · One weekend · Made by hand
        </p>
      </div>

      {/* OWNER STORY — DARK */}
      <section className="section-dark py-16 md:py-24 px-5 md:px-12">
        <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-[auto,1fr] gap-10 md:gap-14 items-center">
          <div className="w-48 h-48 md:w-64 md:h-64 flex-shrink-0">
            <img
              src={ownerImg}
              alt={business.ownerName}
              className="w-full h-full object-cover"
              loading="lazy"
            />
          </div>
          <div>
            <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-brand block mb-4">
              From the kitchen
            </span>
            <blockquote className="font-display text-2xl md:text-4xl uppercase leading-[1.05] mb-6 tracking-tight">
              "Made by hand,<br />one weekend at a time."
            </blockquote>
            <p className="text-base md:text-lg leading-relaxed text-ink-soft-on-dark mb-5 max-w-2xl">
              {business.story}
            </p>
            <p className="text-[11px] font-bold uppercase tracking-[0.25em] text-brand">— {business.ownerName}</p>
          </div>
        </div>
      </section>

      {/* HOW IT WORKS — DARK */}
      <section className="section-dark px-5 md:px-12 py-16 md:py-20 border-t border-rule-on-dark">
        <div className="max-w-5xl mx-auto">
          <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-brand block mb-10">
            How it works
          </span>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10 md:gap-12">
            {[
              { n: "1", t: "Order by Thursday", d: "Pick your meals and check out before 8pm Thursday." },
              { n: "2", t: "We cook Saturday", d: "Everything's made fresh that morning in small batches." },
              { n: "3", t: "Pick up & eat", d: `Swing by ${business.neighborhood} during your window.` },
            ].map((s) => (
              <div key={s.n}>
                <p
                  className="font-display text-7xl md:text-8xl leading-none mb-3"
                  style={{ color: "var(--color-olive)" }}
                >
                  {s.n}
                </p>
                <h3 className="font-display text-lg md:text-xl uppercase tracking-tight mb-2">{s.t}</h3>
                <p className="text-sm md:text-base text-ink-soft-on-dark">{s.d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA BAND — DARK */}
      <section className="section-dark px-5 md:px-12 py-16 md:py-20 border-t border-rule-on-dark text-center">
        <p className="font-display text-3xl md:text-5xl uppercase tracking-tight mb-6 leading-[1]">
          This week's batch<br />is open.
        </p>
        <Link
          to="/cart"
          className="inline-block bg-brand text-brand-ink px-8 py-4 font-bold uppercase text-xs tracking-[0.2em] hover:brightness-110 transition-all"
        >
          Pre-order now →
        </Link>
      </section>

      {/* FLOATING PRE-ORDER CTA */}
      <Link
        to="/cart"
        className="fixed bottom-5 right-5 z-40 bg-brand text-brand-ink px-6 py-4 font-bold uppercase text-xs tracking-[0.18em] shadow-lg hover:brightness-110 transition-all hidden md:inline-block"
      >
        Pre-order →
      </Link>
    </div>
  );
}
