import { createFileRoute, Link } from "@tanstack/react-router";
import { useStore, fmtMoney } from "@/lib/store";
import ownerImg from "@/assets/owner.jpg";

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

  const weekMeals = items.filter((i) => i.featured && !i.soldOut).slice(0, 2);
  const sat = schedule.pickupDays[0];

  return (
    <div className="pb-24 md:pb-8">
      {/* TOP STRIP */}
      <div className="px-5 md:px-12 py-3 flex items-center justify-between border-b border-rule text-[11px] font-bold uppercase tracking-[0.18em]">
        <span>
          {schedule.weekLabel} · Pickup {sat?.label.split(",")[0]}
        </span>
        <span className="text-brand hidden sm:inline">Orders close Thu 8pm</span>
      </div>

      {/* TWO MEAL CARDS — above the fold */}
      <section className="px-5 md:px-10 pt-5 md:pt-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 md:gap-8">
          {weekMeals.map((item) => (
            <article
              key={item.id}
              className="group bg-paper border border-rule overflow-hidden flex flex-col animate-[slide-up_0.6s_var(--ease-out-expo)_both]"
            >
              <div className="relative aspect-[4/3] md:aspect-[5/4] overflow-hidden">
                <img
                  src={item.image}
                  alt={item.name}
                  className="absolute inset-0 w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-700"
                />
                <span
                  className="absolute top-3 right-3 bg-brand text-brand-ink font-display text-base md:text-lg px-3 py-1 shadow-md"
                  style={{ transform: "rotate(-4deg)" }}
                >
                  {fmtMoney(item.price).replace(".00", "")}
                </span>
              </div>

              <div className="p-5 md:p-6 flex flex-col flex-1">
                <h2 className="font-display text-2xl md:text-3xl uppercase tracking-tight leading-[0.95] mb-2">
                  {item.name}
                </h2>
                <p className="text-sm md:text-base text-ink-soft leading-snug mb-5 flex-1">
                  {item.description}
                </p>
                <div className="flex gap-3">
                  <button
                    onClick={() => addToCart(item.id, 1)}
                    className="flex-1 border-2 border-[var(--color-olive,theme(colors.accent.DEFAULT))] text-ink px-5 py-3 font-bold uppercase text-xs tracking-[0.18em] hover:bg-[var(--color-olive,theme(colors.accent.DEFAULT))] hover:text-bg transition-colors"
                    style={{ borderColor: "var(--color-olive)" }}
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
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 border-y border-rule py-6">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-brand mb-1">Pickup</p>
            <p className="text-sm">{sat?.label}</p>
          </div>
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-brand mb-1">Window</p>
            <p className="text-sm">
              {sat?.slots[0].label.split(" — ")[0]}–{sat?.slots[sat.slots.length - 1].label.split(" — ")[1]}
            </p>
          </div>
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-brand mb-1">Where</p>
            <p className="text-sm">
              {business.address}, {business.neighborhood}
            </p>
          </div>
        </div>
      </section>

      {/* OWNER STORY */}
      <section className="bg-paper border-y border-rule mt-16 py-16 md:py-20 px-5 md:px-12">
        <div className="max-w-4xl mx-auto flex flex-col md:flex-row gap-10 md:gap-14 items-start md:items-center">
          <div className="w-40 h-52 md:w-48 md:h-64 flex-shrink-0">
            <img
              src={ownerImg}
              alt={business.ownerName}
              className="w-full h-full object-cover"
              loading="lazy"
            />
          </div>
          <div>
            <span className="eyebrow block mb-4">From the kitchen</span>
            <blockquote className="font-display text-xl md:text-2xl uppercase leading-tight mb-5 tracking-tight">
              "Made by hand, one weekend at a time."
            </blockquote>
            <p className="text-base leading-relaxed text-ink/80 mb-5">{business.story}</p>
            <p className="text-[10px] font-bold uppercase tracking-[0.2em]">— {business.ownerName}</p>
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="px-5 md:px-12 max-w-5xl mx-auto py-16 md:py-20">
        <span className="eyebrow block mb-8">How it works</span>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          {[
            { n: "1", t: "Order by Thursday", d: "Pick your meals and check out before 8pm Thursday." },
            { n: "2", t: "We cook Saturday", d: "Everything's made fresh that morning in small batches." },
            { n: "3", t: "Pick up & eat", d: `Swing by ${business.neighborhood} during your window.` },
          ].map((s) => (
            <div key={s.n}>
              <p
                className="font-display text-6xl md:text-7xl leading-none mb-3"
                style={{ color: "var(--color-olive)" }}
              >
                {s.n}
              </p>
              <h3 className="font-display text-lg uppercase tracking-tight mb-2">{s.t}</h3>
              <p className="text-sm text-ink-soft">{s.d}</p>
            </div>
          ))}
        </div>
      </section>

      {/* FLOATING PRE-ORDER CTA */}
      <Link
        to="/cart"
        className="fixed bottom-5 right-5 z-40 bg-brand text-brand-ink px-6 py-4 font-bold uppercase text-xs tracking-[0.18em] shadow-lg hover:brightness-110 transition-all"
      >
        Pre-order →
      </Link>
    </div>
  );
}
