import { createFileRoute, Link } from "@tanstack/react-router";
import { toast } from "sonner";
import { ShoppingBag } from "lucide-react";
import { useStore, fmtMoney } from "@/lib/store";
import ownerImg from "@/assets/owner.png.asset.json";

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
  const addToCart = useStore((s) => s.addToCart);

  const weekMeals = items.filter((i) => i.featured && !i.soldOut).slice(0, 4);

  const handleAdd = (id: string, name: string) => {
    addToCart(id, 1);
    toast.success(`${name} added to your order`);
  };

  return (
    <div>
      {/* HERO — split cobalt/navy backdrop with two black meal cards */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-cobalt to-navy" />

        <div className="relative max-w-6xl mx-auto px-4 md:px-8 py-5 md:py-12">
          <div className="text-center mb-4 md:mb-8 text-white">
            <h1 className="font-display text-3xl md:text-5xl uppercase tracking-tight leading-none">
              This week's Menu
            </h1>
            <div className="mt-1 md:mt-2 text-sm leading-tight text-white">
              <p className="font-semibold">Pickup Sat 11AM – 2PM</p>
              <p className="text-ink-soft-on-dark text-xs">Orders close Thu 8PM</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
            {weekMeals.map((item, i) => (
              <article
                key={item.id}
                className="bg-jet text-white rounded-2xl overflow-hidden shadow-2xl flex flex-row animate-[slide-up_0.6s_var(--ease-out-expo)_both]"
                style={{ animationDelay: `${i * 0.1}s` }}
              >
                <div className="relative w-[42%] flex-shrink-0">
                  <img src={item.image} alt={item.name} className="absolute inset-0 w-full h-full object-cover" />
                  <span className="absolute top-2 right-2 md:top-3 md:right-3 bg-cobalt text-white font-display text-sm md:text-base px-3 py-1 rounded-full">
                    {fmtMoney(item.price).replace(".00", "")}
                  </span>
                </div>

                <div className="flex-1 min-w-0 flex flex-col p-3 md:p-5">
                  <h2 className="font-display text-base md:text-2xl uppercase leading-tight mb-1 md:mb-2 line-clamp-2">
                    {item.name}
                  </h2>
                  <p className="text-[12px] md:text-sm text-ink-soft-on-dark leading-snug line-clamp-2 md:line-clamp-3 mb-2 md:mb-4 flex-1">
                    {item.description}
                  </p>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleAdd(item.id, item.name)}
                      className="btn-pill-cobalt flex-1 py-2 md:py-2.5 text-xs md:text-sm"
                    >
                      <ShoppingBag className="size-4" /> Add to bag
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </div>

        </div>
      </section>

      {/* OWNER / STORY */}
      <section className="bg-paper">
        <div className="max-w-6xl mx-auto px-5 md:px-10 py-10 md:py-14 grid grid-cols-[0.6fr_1fr] gap-5 md:gap-10 items-center">
          <div className="w-full aspect-[3/4] overflow-hidden rounded-2xl border-4 border-navy">
            <img src={ownerImg.url} alt={business.ownerName} className="w-full h-full object-cover" loading="lazy" />
          </div>

          <div>
            <p className="eyebrow text-cobalt mb-1 md:mb-2 text-xs md:text-sm">About {business.ownerName}</p>
            <h2 className="font-display text-2xl md:text-4xl uppercase text-navy leading-[0.95] tracking-tight mb-2 md:mb-3">
              One kitchen, one weekend at a time.
            </h2>
            <p className="text-sm md:text-base text-ink-soft leading-snug">{business.story}</p>
          </div>
        </div>
      </section>

    </div>
  );
}

