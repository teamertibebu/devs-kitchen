import { createFileRoute } from "@tanstack/react-router";
import { useStore } from "@/lib/store";
import ownerImg from "@/assets/owner.png.asset.json";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About — Dev's Kitchen" },
      { name: "description", content: "Meet Elena, the home cook behind Dev's Kitchen." },
      { property: "og:title", content: "About Dev's Kitchen" },
      { property: "og:description", content: "Meet Elena, the home cook behind Dev's Kitchen." },
    ],
  }),
  component: About,
});

function About() {
  const business = useStore((s) => s.business);
  return (
    <div className="px-5 md:px-12 max-w-4xl mx-auto py-12 md:py-20">
      <span className="eyebrow block mb-3">About</span>
      <h1 className="font-display text-5xl md:text-7xl uppercase leading-[0.9] mb-10">{business.ownerName}</h1>

      <div className="grid grid-cols-[0.6fr_1fr] gap-6 md:gap-10">
        <img src={ownerImg} alt={business.ownerName} className="w-full aspect-[3/4] object-cover" />


        <div className="space-y-4 md:space-y-6 text-sm md:text-lg leading-relaxed">
          <p>{business.story}</p>
          <p>
            Every Saturday we cook a small, considered menu. Pasta is rolled by hand. Bread is fermented for two days.
            Vegetables come from the Alemany farmers market on Saturday mornings before service.
          </p>
          <p>
            We never make more than we can pack with care. Pre-ordering lets us cook just enough — no waste, no
            compromise.
          </p>
          <p className="font-display uppercase text-sm md:text-base">— {business.ownerName}</p>
        </div>
      </div>
    </div>

  );
}
