import { createFileRoute, Link } from "@tanstack/react-router";
import { useStore, fmtMoney } from "@/lib/store";
import ownerImg from "@/assets/owner.jpg";
import { Clock, MapPin, CalendarDays, Plus, Check } from "lucide-react";
import { toast } from "sonner";
import { useHydrated } from "@/lib/hydrate";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Coastal Kitchen — This Week's Plates, Saturday Pickup" },
      { name: "description", content: "A tiny home kitchen cooking two plates a week. Order by Thursday, pick up Saturday." },
      { property: "og:title", content: "Coastal Kitchen" },
      { property: "og:description", content: "Two plates a week. Order by Thursday, pick up Saturday." },
    ],
  }),
  component: Home,
});

function Squiggle() {
  return (
    <svg viewBox="0 0 200 12" className="block w-full h-2.5 -mt-1 text-brand" preserveAspectRatio="none" aria-hidden>
      <path
        d="M2 7 Q 20 1, 40 6 T 80 6 T 120 6 T 160 6 T 198 6"
        fill="none"
        stroke="currentColor"
        strokeWidth="3"
        strokeLinecap="round"
      />
    </svg>
  );
}

function Home() {
  const items = useStore((s) => s.items);
  const business = useStore((s) => s.business);
  const schedule = useStore((s) => s.schedule);
  const addToCart = useStore((s) => s.addToCart);
  const cart = useStore((s) => s.cart);
  const hydrated = useHydrated();

  const featured = items.filter((i) => !i.soldOut).slice(0, 2);
  const sat = schedule.pickupDays[0];
  const firstSlot = sat?.slots[0].label.split(" — ")[0];
  const lastSlot = sat?.slots[sat.slots.length - 1].label.split(" — ")[1];

  return (
    <div className="pb-28 md:pb-12">
      {/* Top strip — week + close time */}
      <section className="px-5 md:px-10 max-w-6xl mx-auto pt-6 md:pt-8 pb-4">
        <div className="flex flex-wrap items-baseline gap-x-4 gap-y-1">
          <span className="eyebrow text-olive">{schedule.weekLabel}</span>
          <span className="text-[11px] font-semibold uppercase tracking-[0.18em] text-brand">
            Orders close Thu 8pm
          </span>
        </div>
        <h1 className="font-display text-3xl md:text-5xl leading-[1] tracking-tight mt-3 max-w-2xl">
          This week, I'm{" "}
          <span className="inline-block">
            <span className="text-brand">cooking</span>
            <Squiggle />
          </span>{" "}
          two plates.
        </h1>
      </section>

      {/* TWO MEAL CARDS */}
      <section className="px-5 md:px-10 max-w-6xl mx-auto">
        <div className="grid md:grid-cols-2 gap-6 md:gap-8">
          {featured.map((item, idx) => {
            const inCart = hydrated ? cart.find((l) => l.itemId === item.id) : undefined;
            const rot = idx === 0 ? "-rotate-3" : "rotate-2";
            return (
              <article
                key={item.id}
                className="bg-paper border border-rule flex flex-col"
              >
                <Link
                  to="/menu/$itemId"
                  params={{ itemId: item.id }}
                  className="relative block aspect-[4/3] overflow-hidden group"
                >
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-700"
                    loading={idx === 0 ? "eager" : "lazy"}
                  />
                  {/* Price sticker */}
                  <span
                    className={`absolute top-4 right-4 bg-brand text-brand-ink font-display text-xl px-3 py-2 leading-none shadow-md ${rot}`}
                  >
                    {fmtMoney(item.price)}
                  </span>
                  {item.popular && (
                    <span className="absolute top-4 left-4 bg-olive text-brand-ink text-[10px] font-bold uppercase tracking-[0.2em] px-2 py-1">
                      A fave
                    </span>
                  )}
                </Link>

                <div className="p-5 md:p-6 flex flex-col flex-1">
                  <span className="eyebrow text-olive mb-2">Plate {String(idx + 1).padStart(2, "0")}</span>
                  <h2 className="font-display text-2xl md:text-3xl tracking-tight leading-[1.05] mb-3">
                    {item.name}
                  </h2>
                  <p className="text-[15px] text-ink-soft leading-relaxed mb-5 flex-1">
                    {item.description}
                  </p>
                  <div className="flex flex-wrap gap-2">
                    <button
                      onClick={() => {
                        addToCart(item.id);
                        toast.success(`Added — ${item.name}`);
                      }}
                      className="inline-flex items-center gap-2 bg-brand text-brand-ink px-5 py-3 font-bold uppercase text-[11px] tracking-[0.18em] hover:brightness-110 transition-all"
                    >
                      {inCart ? <><Check className="size-3.5" /> In bag ({inCart.qty})</> : <><Plus className="size-3.5" /> Add to bag</>}
                    </button>
                    <Link
                      to="/menu/$itemId"
                      params={{ itemId: item.id }}
                      className="inline-flex items-center px-5 py-3 font-bold uppercase text-[11px] tracking-[0.18em] border-2 border-olive text-olive hover:bg-olive hover:text-brand-ink transition-colors"
                    >
                      See more →
                    </Link>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      </section>

      {/* Quick info strip */}
      <section className="px-5 md:px-10 max-w-6xl mx-auto mt-10 md:mt-14">
        <div className="bg-paper border border-rule grid grid-cols-1 sm:grid-cols-3 divide-y sm:divide-y-0 sm:divide-x divide-rule">
          <InfoCell icon={CalendarDays} label="Pickup">{sat?.label}</InfoCell>
          <InfoCell icon={Clock} label="Window">{firstSlot} – {lastSlot}</InfoCell>
          <InfoCell icon={MapPin} label="Where">
            {business.address}<br />
            <span className="text-ink-soft">{business.neighborhood}</span>
          </InfoCell>
        </div>
      </section>

      {/* Owner note */}
      <section className="px-5 md:px-10 max-w-6xl mx-auto mt-14 md:mt-20">
        <div className="bg-paper border border-rule p-6 md:p-10 flex flex-col sm:flex-row gap-6 sm:gap-8 items-start">
          <img
            src={ownerImg}
            alt={business.ownerName}
            className="w-24 h-24 md:w-32 md:h-32 rounded-full object-cover flex-shrink-0 border-4 border-olive"
            loading="lazy"
          />
          <div>
            <span className="eyebrow text-olive mb-2 block">A note from me</span>
            <p className="text-base md:text-lg leading-relaxed text-ink mb-3">
              {business.story}
            </p>
            <p className="text-sm text-ink-soft">
              — {business.ownerName}, cooking out of my home in {business.neighborhood}
            </p>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="px-5 md:px-10 max-w-6xl mx-auto mt-14 md:mt-20">
        <span className="eyebrow text-olive block mb-5">How this works</span>
        <ol className="grid sm:grid-cols-3 gap-6 md:gap-8">
          {[
            ["Pick a plate", "Browse what I'm cooking and add it to your bag."],
            ["Order by Thursday", "Choose a 30-min Saturday pickup window."],
            ["Come get it", "Stop by, grab your bag, eat well. That's it."],
          ].map(([t, d], i) => (
            <li key={t} className="border-t-2 border-ink pt-4">
              <p className="font-display text-5xl md:text-6xl text-olive leading-none mb-3">
                {String(i + 1).padStart(2, "0")}
              </p>
              <p className="font-bold text-[16px] mb-1">{t}</p>
              <p className="text-sm text-ink-soft leading-relaxed">{d}</p>
            </li>
          ))}
        </ol>
      </section>
    </div>
  );
}

function InfoCell({
  icon: Icon,
  label,
  children,
}: {
  icon: React.ElementType;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="px-5 md:px-7 py-5">
      <div className="flex items-center gap-2 mb-2">
        <Icon className="size-4 text-brand" />
        <span className="eyebrow text-olive">{label}</span>
      </div>
      <p className="text-[15px] leading-snug">{children}</p>
    </div>
  );
}
