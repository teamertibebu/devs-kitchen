import { createFileRoute, Link } from "@tanstack/react-router";
import { toast } from "sonner";
import { useStore, fmtMoney } from "@/lib/store";
import { useHydrated } from "@/lib/hydrate";
import ownerImg from "@/assets/owner.jpg";

if (import.meta.hot) {
  import.meta.hot.accept(() => {
    import.meta.hot!.invalidate();
  });
}

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Dev's Kitchen — This Week's Menu" },
      {
        name: "description",
        content:
          "Home-kitchen pasta & bread, made one weekend at a time. Order this week's batch for Saturday pickup in San Francisco.",
      },
      { property: "og:title", content: "Dev's Kitchen" },
      { property: "og:description", content: "This week's menu, made by hand. Pickup Saturdays." },
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

  const handleAdd = (id: string, name: string) => {
    addToCart(id, 1);
    toast.success(`${name} added to bag!`);
  };

  return (
    <div className="pb-8">
      {/* TODAY'S MENU — above the fold */}
      <section className="px-3 md:px-8 pt-3 md:pt-5">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-end justify-between mb-2 md:mb-4 px-1">
            <h1 className="font-script text-3xl md:text-5xl text-brand leading-none">today's menu</h1>
            <span className="font-display text-[10px] md:text-xs text-navy uppercase tracking-widest hidden sm:inline">
              {hydrated ? sat?.label : "Saturday"} pickup
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-5">
            {weekMeals.map((item, i) => (
              <article
                key={item.id}
                className="ticket relative p-2 md:p-3 animate-[slide-up_0.5s_var(--ease-out-expo)_both]"
                style={{
                  transform: `rotate(${i === 0 ? "-0.6" : "0.5"}deg)`,
                  animationDelay: `${i * 0.08}s`,
                }}
              >
                <div className="flex gap-3 md:gap-4 items-stretch">
                  <Link
                    to="/menu/$itemId"
                    params={{ itemId: item.id }}
                    className="relative block w-[38%] md:w-[42%] flex-shrink-0 overflow-hidden border-2 border-navy"
                  >
                    <div className="aspect-square">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                      />
                    </div>
                    <span className="sticker-price absolute -top-2 -right-2 text-sm md:text-base z-10">
                      {fmtMoney(item.price).replace(".00", "")}
                    </span>
                  </Link>

                  <div className="flex-1 min-w-0 flex flex-col py-1">
                    <h2 className="font-display text-base md:text-2xl leading-tight text-navy mb-1 md:mb-2 uppercase">
                      {item.name}
                    </h2>
                    <p className="text-[11px] md:text-sm text-ink-soft leading-snug line-clamp-3 md:line-clamp-4 mb-2 md:mb-3 flex-1">
                      {item.description}
                    </p>
                    <button
                      onClick={() => handleAdd(item.id, item.name)}
                      className="btn-diner w-full py-2 md:py-2.5 text-[11px] md:text-sm"
                    >
                      + Add to bag
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </div>

          <p className="text-center font-script text-xl md:text-2xl text-navy mt-3 md:mt-5">
            see the full menu →{" "}
            <Link to="/menu" className="text-brand underline decoration-wavy underline-offset-4">
              this way
            </Link>
          </p>
        </div>
      </section>

      {/* BELOW THE FOLD */}

      {/* Owner story — paper card */}
      <section className="px-5 md:px-8 mt-12 md:mt-20">
        <div className="max-w-5xl mx-auto ticket p-6 md:p-10" style={{ transform: "rotate(-0.4deg)" }}>
          <div className="grid grid-cols-1 md:grid-cols-[180px,1fr] gap-6 md:gap-10 items-center">
            <div className="border-2 border-navy w-40 h-40 md:w-44 md:h-44 mx-auto" style={{ transform: "rotate(2deg)" }}>
              <img src={ownerImg} alt={business.ownerName} className="w-full h-full object-cover" loading="lazy" />
            </div>
            <div>
              <p className="font-script text-3xl md:text-4xl text-brand mb-2">hey, I'm {business.ownerName}!</p>
              <p className="text-sm md:text-base leading-relaxed text-ink mb-3">{business.story}</p>
              <p className="font-display text-xs uppercase tracking-widest text-navy">
                ★ Cooked in my home kitchen ★
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="px-5 md:px-8 mt-12 md:mt-16">
        <div className="max-w-5xl mx-auto">
          <h2 className="font-script text-4xl md:text-5xl text-brand text-center mb-6 md:mb-10">
            how it works
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 md:gap-6">
            {[
              { n: "1", t: "Order by Thu", d: "Pick your meals & check out before 8pm Thursday." },
              { n: "2", t: "We cook Sat", d: "Everything's made fresh that morning in small batches." },
              { n: "3", t: "Pick up & eat", d: `Swing by ${business.neighborhood} during your window.` },
            ].map((s, i) => (
              <div
                key={s.n}
                className="ticket p-5 text-center"
                style={{ transform: `rotate(${i === 1 ? "0.4" : i === 0 ? "-0.5" : "0.6"}deg)` }}
              >
                <div className="font-display text-5xl md:text-6xl text-brand leading-none mb-2">{s.n}</div>
                <h3 className="font-display text-base md:text-lg uppercase text-navy mb-1.5">{s.t}</h3>
                <p className="text-sm text-ink-soft">{s.d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="px-5 md:px-8 mt-12 md:mt-16 text-center">
        <p className="font-script text-3xl md:text-4xl text-brand mb-3">hungry?</p>
        <Link to="/menu" className="btn-diner inline-block px-8 py-3 md:px-10 md:py-4 text-sm md:text-base">
          See the full menu →
        </Link>
      </section>
    </div>
  );
}
