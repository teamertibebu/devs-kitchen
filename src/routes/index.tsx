import { createFileRoute, Link } from "@tanstack/react-router";
import { useStore, fmtMoney } from "@/lib/store";
import ownerImg from "@/assets/owner.jpg";
import { Clock, MapPin, CalendarDays, ArrowRight } from "lucide-react";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Coastal Kitchen — Weekly Pre-Order for Saturday Pickup" },
      { name: "description", content: "A small home kitchen in San Francisco. Pre-order this week's plates by Thursday for Saturday pickup." },
      { property: "og:title", content: "Coastal Kitchen" },
      { property: "og:description", content: "Pre-order this week's plates for Saturday pickup." },
    ],
  }),
  component: Home,
});

function Home() {
  const items = useStore((s) => s.items);
  const business = useStore((s) => s.business);
  const schedule = useStore((s) => s.schedule);

  const available = items.filter((i) => !i.soldOut);
  const sat = schedule.pickupDays[0];
  const firstSlot = sat?.slots[0].label.split(" — ")[0];
  const lastSlot = sat?.slots[sat.slots.length - 1].label.split(" — ")[1];

  return (
    <div className="pb-24 md:pb-8">
      {/* INTRO — simple, personal */}
      <section className="px-5 md:px-12 max-w-5xl mx-auto pt-10 md:pt-16 pb-10">
        <span className="eyebrow block mb-4">Hi, I'm {business.ownerName.split(" ")[0]}</span>
        <h1 className="font-display text-4xl md:text-6xl uppercase leading-[0.95] tracking-tight max-w-3xl mb-5">
          A small kitchen,<br />cooking one menu a week.
        </h1>
        <p className="text-base md:text-lg text-ink-soft max-w-2xl leading-relaxed">
          {business.tagline} Order by Thursday — pick up Saturday in {business.neighborhood}.
        </p>
      </section>

      {/* THIS WEEK — the practical card, front and center */}
      <section className="px-5 md:px-12 max-w-5xl mx-auto">
        <div className="bg-paper border border-rule">
          <div className="px-5 md:px-7 py-4 border-b border-rule flex items-center justify-between">
            <span className="eyebrow">This Week</span>
            <span className="text-[10px] font-bold uppercase tracking-[0.18em] text-brand">
              Orders close Thu 8:00 PM
            </span>
          </div>

          <div className="grid md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-rule">
            <InfoCell icon={CalendarDays} label="Pickup day">
              {sat?.label}
            </InfoCell>
            <InfoCell icon={Clock} label="Pickup window">
              {firstSlot} – {lastSlot}
            </InfoCell>
            <InfoCell icon={MapPin} label="Where">
              {business.address}
              <br />
              <span className="text-ink-soft">{business.neighborhood}</span>
            </InfoCell>
          </div>

          <div className="px-5 md:px-7 py-5 border-t border-rule flex flex-col sm:flex-row gap-3 sm:items-center sm:justify-between">
            <p className="text-sm text-ink-soft">
              {available.length} {available.length === 1 ? "plate" : "plates"} on the menu this week.
            </p>
            <Link
              to="/menu"
              className="bg-brand text-brand-ink inline-flex items-center justify-center gap-2 px-6 py-3 font-bold uppercase text-[11px] tracking-[0.2em] hover:brightness-110 transition-all"
            >
              See this week's menu <ArrowRight className="size-3.5" />
            </Link>
          </div>
        </div>
      </section>

      {/* MENU LIST — plain, scannable, not a campaign */}
      <section className="px-5 md:px-12 max-w-5xl mx-auto pt-16 md:pt-20">
        <div className="flex items-baseline justify-between mb-6 border-b border-ink/15 pb-3">
          <h2 className="font-display text-xl md:text-2xl uppercase tracking-tight">On the menu</h2>
          <Link to="/menu" className="text-[11px] font-semibold uppercase tracking-[0.18em] text-brand hover:underline">
            View all →
          </Link>
        </div>

        <ul className="divide-y divide-rule">
          {items.slice(0, 5).map((item) => (
            <li key={item.id}>
              <Link
                to="/menu/$itemId"
                params={{ itemId: item.id }}
                className={`flex items-center gap-4 py-4 group ${item.soldOut ? "opacity-50" : ""}`}
              >
                <img
                  src={item.image}
                  alt={item.name}
                  className="size-16 md:size-20 object-cover flex-shrink-0"
                  loading="lazy"
                />
                <div className="flex-1 min-w-0">
                  <div className="flex items-baseline justify-between gap-3 mb-1">
                    <p className="font-semibold text-[15px] md:text-base truncate">
                      {item.name}
                      {item.popular && !item.soldOut && (
                        <span className="ml-2 text-[9px] font-bold tracking-[0.15em] text-brand align-middle uppercase">Popular</span>
                      )}
                      {item.soldOut && (
                        <span className="ml-2 text-[9px] font-bold tracking-[0.15em] text-ink-soft align-middle uppercase">Sold out</span>
                      )}
                    </p>
                    <span className="text-sm font-medium text-ink whitespace-nowrap">{fmtMoney(item.price)}</span>
                  </div>
                  <p className="text-[13px] md:text-sm text-ink-soft line-clamp-2">{item.description}</p>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      </section>

      {/* OWNER NOTE — personal, not glossy */}
      <section className="bg-paper border-y border-rule mt-16 md:mt-20 py-12 md:py-16 px-5 md:px-12">
        <div className="max-w-3xl mx-auto flex flex-col sm:flex-row gap-6 sm:gap-8 items-start">
          <img
            src={ownerImg}
            alt={business.ownerName}
            className="w-24 h-24 md:w-28 md:h-28 rounded-full object-cover flex-shrink-0"
            loading="lazy"
          />
          <div>
            <span className="eyebrow block mb-2">A note from the kitchen</span>
            <p className="text-base md:text-lg leading-relaxed text-ink mb-4">
              {business.story}
            </p>
            <p className="text-sm text-ink-soft">
              — {business.ownerName} · cooking out of my home in {business.neighborhood}
            </p>
          </div>
        </div>
      </section>

      {/* HOW IT WORKS — reassurance, organized */}
      <section className="px-5 md:px-12 max-w-5xl mx-auto pt-14 md:pt-20">
        <span className="eyebrow block mb-5">How it works</span>
        <ol className="grid sm:grid-cols-3 gap-6 md:gap-8 mb-8">
          {[
            ["1", "Order by Thursday", "Browse this week's plates and reserve what you'd like."],
            ["2", "Pick a pickup time", "Choose a 30-minute Saturday window that works for you."],
            ["3", "Pick up & enjoy", "Stop by my place, grab your bag, eat well."],
          ].map(([n, t, d]) => (
            <li key={n} className="border-t border-ink/15 pt-4">
              <p className="font-display text-2xl text-brand leading-none mb-2">{n}</p>
              <p className="font-semibold text-[15px] mb-1">{t}</p>
              <p className="text-sm text-ink-soft leading-relaxed">{d}</p>
            </li>
          ))}
        </ol>

        <div className="bg-ink text-bg p-6 md:p-8 mt-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <p className="font-display text-lg md:text-xl uppercase leading-tight mb-1">Ready for {sat?.label.split(",")[0]}?</p>
            <p className="text-sm text-bg/70">Takes about a minute. I'll text you a reminder before pickup.</p>
          </div>
          <Link
            to="/menu"
            className="bg-brand text-brand-ink inline-flex items-center justify-center gap-2 px-6 py-3 font-bold uppercase text-[11px] tracking-[0.2em] whitespace-nowrap"
          >
            Start pre-order <ArrowRight className="size-3.5" />
          </Link>
        </div>
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
        <span className="eyebrow">{label}</span>
      </div>
      <p className="text-[15px] leading-snug">{children}</p>
    </div>
  );
}
