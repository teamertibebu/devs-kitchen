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

  const featured = items.filter((i) => i.featured && !i.soldOut).slice(0, 3);
  const signature = featured[0];
  const sat = schedule.pickupDays[0];

  return (
    <div className="pb-24 md:pb-8">
      {/* HERO — split editorial cover */}
      <section className="relative flex flex-col md:flex-row md:min-h-[80vh] border-b border-rule">
        <div className="w-full md:w-1/2 px-5 md:px-12 py-8 md:py-12 flex flex-col justify-between border-b md:border-b-0 md:border-r border-rule animate-[slide-up_0.7s_var(--ease-out-expo)]">
          <div className="flex justify-between items-start">
            <span className="eyebrow">01 / This Week</span>
            <div className="text-right">
              <p className="text-[10px] font-bold uppercase tracking-widest leading-none">Pickup Window</p>
              <p className="text-sm text-brand mt-1">
                {sat?.label} · {sat?.slots[0].label.split(" — ")[0]}–
                {sat?.slots[sat.slots.length - 1].label.split(" — ")[1]}
              </p>
            </div>
          </div>

          <div className="my-10 md:my-14">
            <h1 className="font-display text-[14vw] md:text-[7vw] lg:text-[6.5rem] leading-[0.85] uppercase mb-5">
              {business.name.split(" ").map((w, i) => (
                <span key={i} className="block">
                  {w}
                </span>
              ))}
            </h1>
            <p className="max-w-[34ch] text-base md:text-lg leading-snug text-pretty">{business.tagline}</p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <Link
              to="/menu"
              className="bg-brand text-brand-ink px-7 py-4 font-bold uppercase text-xs tracking-[0.2em] hover:brightness-110 transition-all text-center"
            >
              Pre-Order for {sat?.label.split(",")[0]}
            </Link>
            <Link
              to="/contact"
              className="border border-ink/20 px-7 py-4 font-bold uppercase text-xs tracking-[0.2em] hover:bg-ink/5 transition-all text-center"
            >
              Contact
            </Link>
          </div>
        </div>

        <div className="w-full md:w-1/2 relative bg-paper aspect-[3/4] md:aspect-auto md:min-h-[80vh] animate-[fade-in_0.9s_var(--ease-out-expo)_0.15s_both]">
          {signature && (
            <>
              <img
                src={signature.image}
                alt={signature.name}
                className="absolute inset-0 w-full h-full object-cover"
                width={1200}
                height={1600}
              />
              <div className="absolute bottom-0 left-0 bg-brand text-brand-ink p-5 md:p-6 max-w-[90%]">
                <p className="text-[10px] font-bold tracking-[0.2em] uppercase mb-1 opacity-90">Signature Dish</p>
                <p className="font-display text-lg md:text-2xl uppercase tracking-tight leading-tight">
                  {signature.name} / {fmtMoney(signature.price).replace(".00", "")}
                </p>
              </div>
            </>
          )}
        </div>
      </section>

      {/* FEATURED DISHES */}
      <section className="px-5 md:px-12 max-w-7xl mx-auto pt-16 md:pt-24">
        <div className="flex items-baseline gap-4 mb-10">
          <span className="eyebrow">02 / Menu</span>
          <h2 className="font-display text-2xl md:text-3xl uppercase tracking-tight">This Week's Batch</h2>
        </div>

        <div className="grid md:grid-cols-2 gap-x-16 gap-y-10">
          {items.slice(0, 6).map((item) => (
            <Link
              key={item.id}
              to="/menu/$itemId"
              params={{ itemId: item.id }}
              className={`group border-b border-ink/10 pb-5 block ${item.soldOut ? "opacity-50" : ""}`}
            >
              <div className="flex justify-between items-end mb-2 gap-4">
                <h3 className="font-display text-lg md:text-xl uppercase tracking-tight leading-tight">
                  {item.name}
                  {item.popular && !item.soldOut && (
                    <span className="ml-2 text-[9px] font-bold tracking-[0.2em] text-brand align-middle">
                      ★ POPULAR
                    </span>
                  )}
                </h3>
                <span className="font-medium text-brand whitespace-nowrap">{fmtMoney(item.price)}</span>
              </div>
              <p className="text-sm text-ink-soft mb-4 max-w-[50ch]">{item.description}</p>
              <span className="text-[10px] font-bold uppercase tracking-[0.2em] inline-block">
                {item.soldOut ? "Sold out" : "View →"}
              </span>
            </Link>
          ))}
        </div>

        <div className="mt-12 flex justify-center">
          <Link
            to="/menu"
            className="bg-ink text-bg px-8 py-4 font-bold uppercase text-xs tracking-[0.2em] hover:bg-brand transition-colors"
          >
            View Full Menu →
          </Link>
        </div>
      </section>

      {/* STORY */}
      <section className="bg-paper border-y border-rule mt-20 py-16 md:py-24 px-5 md:px-12">
        <div className="max-w-4xl mx-auto flex flex-col md:flex-row gap-10 md:gap-14 items-start md:items-center">
          <div className="w-40 h-52 md:w-48 md:h-64 flex-shrink-0">
            <img
              src={ownerImg}
              alt={business.ownerName}
              className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-700"
              loading="lazy"
            />
          </div>
          <div>
            <span className="eyebrow block mb-4">03 / Story</span>
            <blockquote className="font-display text-xl md:text-2xl uppercase leading-tight mb-6 tracking-tight">
              "The best meals aren't rushed. They're started days in advance and shared in the afternoon sun."
            </blockquote>
            <p className="text-base md:text-lg leading-relaxed text-ink/80 mb-6">{business.story}</p>
            <div className="flex items-center gap-4">
              <div className="h-px w-12 bg-brand" />
              <p className="text-[10px] font-bold uppercase tracking-[0.2em]">{business.ownerName}, Founder</p>
            </div>
          </div>
        </div>
      </section>

      {/* TESTIMONIAL */}
      <section className="px-5 md:px-12 max-w-4xl mx-auto py-20 text-center">
        <span className="eyebrow block mb-6">04 / From the Neighborhood</span>
        <p className="font-display text-2xl md:text-3xl uppercase leading-tight tracking-tight mb-6">
          "I ordered for one — and we ate it for three meals. The ragù is unreal. Easiest thing I've added to my week."
        </p>
        <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-ink-soft">— Maya R., Bernal Heights</p>
      </section>

      {/* CONTACT CTA */}
      <section className="bg-ink text-bg px-5 md:px-12 py-20 mt-8">
        <div className="max-w-4xl mx-auto">
          <span className="eyebrow text-bg/60 block mb-4">05 / Pickup</span>
          <h2 className="font-display text-3xl md:text-5xl uppercase leading-none mb-6">{schedule.weekLabel}</h2>
          <p className="text-lg md:text-xl text-bg/80 max-w-xl mb-8">
            Orders close{" "}
            <span className="text-brand-ink underline decoration-brand decoration-2 underline-offset-4">
              Thursday at 8pm
            </span>
            . Pickup is at {business.address}, {business.neighborhood}.
          </p>
          <Link
            to="/menu"
            className="bg-brand text-brand-ink inline-block px-8 py-4 font-bold uppercase text-xs tracking-[0.2em]"
          >
            Start Pre-Order →
          </Link>
        </div>
      </section>
    </div>
  );
}
