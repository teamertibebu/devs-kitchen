import { createFileRoute } from "@tanstack/react-router";
import { useStore } from "@/lib/store";
import { Phone, Mail, Instagram, MapPin, Clock } from "lucide-react";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "Contact — Dev's Kitchen" },
      { name: "description", content: "Get in touch about pickups, allergies, or catering." },
      { property: "og:title", content: "Contact Dev's Kitchen" },
      { property: "og:description", content: "Get in touch about pickups, allergies, or catering." },
    ],
  }),
  component: Contact,
});

function Contact() {
  const b = useStore((s) => s.business);
  return (
    <div className="px-5 md:px-12 max-w-4xl mx-auto py-12 md:py-20">
      <span className="eyebrow block mb-3">Contact</span>
      <h1 className="font-display text-5xl md:text-7xl uppercase leading-[0.9] mb-10">Get in touch</h1>
      <p className="text-lg text-ink-soft mb-12 max-w-2xl">
        Questions about your order, an allergy, or a special week? Text is fastest. For pre-orders, please use the menu.
      </p>

      <ul className="space-y-6 text-base">
        <Row icon={MapPin} label="Pickup address">
          {b.address}
          <br />
          <span className="text-ink-soft">{b.neighborhood}</span>
        </Row>
        <Row icon={Clock} label="Hours">
          {b.hours}
        </Row>
        <Row icon={Phone} label="Text">
          <a href={`tel:${b.phone.replace(/\D/g, "")}`} className="text-brand underline underline-offset-4">
            {b.phone}
          </a>
        </Row>
        <Row icon={Mail} label="Email">
          <a href={`mailto:${b.email}`} className="text-brand underline underline-offset-4">
            {b.email}
          </a>
        </Row>
        <Row icon={Instagram} label="Instagram">
          <a
            href={`https://instagram.com/${b.instagram.replace("@", "")}`}
            className="text-brand underline underline-offset-4"
          >
            {b.instagram}
          </a>
        </Row>
      </ul>
    </div>
  );
}

function Row({ icon: Icon, label, children }: { icon: React.ElementType; label: string; children: React.ReactNode }) {
  return (
    <li className="flex gap-5 items-start border-b border-rule pb-6">
      <Icon className="size-5 text-brand mt-1 flex-shrink-0" />
      <div className="flex-1">
        <p className="eyebrow mb-1">{label}</p>
        <div>{children}</div>
      </div>
    </li>
  );
}
