import { Link, useRouterState } from "@tanstack/react-router";
import { type ReactNode } from "react";
import { ShoppingBag } from "lucide-react";
import { Toaster } from "sonner";
import { useCartCount, useStore } from "@/lib/store";
import { useHydrated } from "@/lib/hydrate";

function PinnedStrip() {
  const schedule = useStore((s) => s.schedule);
  const business = useStore((s) => s.business);
  const hydrated = useHydrated();
  const next = schedule.pickupDays[0];
  const day = hydrated ? next?.label.split(",")[0] : "Saturday";
  return (
    <div className="sticky top-0 z-50 bg-mustard text-navy py-1.5 px-4 text-center text-[11px] md:text-xs font-bold uppercase tracking-[0.18em] border-b-2 border-navy font-display">
      <span className="mx-2">★</span>
      Pickup {day} 11–2
      <span className="mx-2">★</span>
      <span className="hidden sm:inline">{business.neighborhood}<span className="mx-2">★</span></span>
      Orders close Thu 8pm
      <span className="mx-2">★</span>
    </div>
  );
}

function Header() {
  const business = useStore((s) => s.business);
  const cartCount = useCartCount();
  const hydrated = useHydrated();
  const path = useRouterState({ select: (r) => r.location.pathname });
  const isAdmin = path.startsWith("/admin");

  if (isAdmin) return null;

  return (
    <header className="bg-bg border-b-2 border-navy">
      <div className="max-w-6xl mx-auto px-4 md:px-8 h-12 md:h-14 flex items-center justify-between">
        <Link to="/" className="font-display text-lg md:text-2xl text-navy leading-none">
          {business.name}
        </Link>
        <Link
          to="/cart"
          className="relative flex items-center gap-2 text-navy hover:text-brand transition-colors"
          aria-label="Cart"
        >
          <ShoppingBag className="size-5" />
          {hydrated && cartCount > 0 && (
            <span className="absolute -top-1 -right-2 bg-brand text-brand-ink text-[10px] font-bold rounded-full w-4 h-4 flex items-center justify-center border border-navy">
              {cartCount}
            </span>
          )}
        </Link>
      </div>
    </header>
  );
}

function Footer() {
  const business = useStore((s) => s.business);
  const path = useRouterState({ select: (r) => r.location.pathname });
  if (path.startsWith("/admin")) return null;

  return (
    <footer className="bg-navy text-ink-on-dark border-t-4 border-mustard mt-16">
      <div className="max-w-6xl mx-auto px-5 md:px-10 py-12 grid grid-cols-1 md:grid-cols-3 gap-8">
        <div>
          <p className="font-display text-2xl text-mustard mb-2">{business.name}</p>
          <p className="text-sm text-ink-soft-on-dark max-w-sm">{business.tagline}</p>
        </div>
        <div>
          <p className="font-script text-2xl text-mustard mb-1">find us</p>
          <p className="text-sm leading-relaxed">
            {business.address}<br />
            {business.neighborhood}<br />
            <span className="text-ink-soft-on-dark">{business.hours}</span>
          </p>
        </div>
        <div>
          <p className="font-script text-2xl text-mustard mb-1">say hi</p>
          <a href={`https://instagram.com/${business.instagram.replace("@", "")}`} className="text-sm block hover:text-mustard">{business.instagram}</a>
          <a href={`mailto:${business.email}`} className="text-sm block hover:text-mustard">{business.email}</a>
          <p className="text-[10px] uppercase tracking-widest text-ink-soft-on-dark mt-6">© {new Date().getFullYear()} · <Link to="/admin" className="hover:text-mustard">Owner</Link></p>
        </div>
      </div>
    </footer>
  );
}

export function SiteChrome({ children }: { children: ReactNode }) {
  const path = useRouterState({ select: (r) => r.location.pathname });
  const isAdmin = path.startsWith("/admin");

  return (
    <div className="min-h-screen flex flex-col font-body bg-bg text-ink selection:bg-mustard selection:text-navy">
      {!isAdmin && <PinnedStrip />}
      <Header />
      <main className="flex-1">{children}</main>
      <Footer />
      <Toaster position="top-center" toastOptions={{ style: { borderRadius: 0, border: "2px solid #1a3c5a", fontFamily: "Bitter, serif" } }} />
    </div>
  );
}
