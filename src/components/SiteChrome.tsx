import { Link, useRouterState } from "@tanstack/react-router";
import { useState, type ReactNode } from "react";
import { ShoppingBag, Menu as MenuIcon, X } from "lucide-react";
import { Toaster } from "sonner";
import { useCartCount, useStore } from "@/lib/store";
import { useHydrated } from "@/lib/hydrate";

function StatusStrip() {
  const schedule = useStore((s) => s.schedule);
  const next = schedule.pickupDays[0];
  return (
    <div className="sticky top-0 z-50 bg-brand text-brand-ink py-2.5 px-4 text-center text-[11px] font-semibold uppercase tracking-[0.2em] animate-[fade-in_0.6s_var(--ease-out-expo)]">
      Orders close Thu 8pm · Pickup {next?.label.split(",")[0]}
    </div>
  );
}

function Header() {
  const [open, setOpen] = useState(false);
  const business = useStore((s) => s.business);
  const cartCount = useCartCount();
  const hydrated = useHydrated();
  const path = useRouterState({ select: (r) => r.location.pathname });
  const isAdmin = path.startsWith("/admin");

  if (isAdmin) return null;

  return (
    <header className="border-b border-rule bg-bg">
      <div className="max-w-7xl mx-auto px-5 md:px-10 py-4 flex items-center justify-between">
        <Link to="/" className="font-display text-lg md:text-xl uppercase tracking-tight">
          {business.name}
        </Link>
        <nav className="hidden md:flex items-center gap-8 text-sm font-medium">
          <Link to="/about" className="hover:text-brand transition-colors">About</Link>
          <Link to="/contact" className="hover:text-brand transition-colors">Contact</Link>
          <Link to="/account" className="hover:text-brand transition-colors">Account</Link>
          <Link to="/cart" className="flex items-center gap-2 bg-ink text-bg px-4 py-2 hover:bg-brand transition-colors">
            <ShoppingBag className="size-4" /> <span>Bag</span>
            {hydrated && cartCount > 0 && <span className="text-xs">({cartCount})</span>}
          </Link>
        </nav>
        <button className="md:hidden p-2 -mr-2" onClick={() => setOpen((v) => !v)} aria-label="Menu">
          {open ? <X className="size-5" /> : <MenuIcon className="size-5" />}
        </button>
      </div>
      {open && (
        <div className="md:hidden border-t border-rule bg-paper">
          <nav className="px-5 py-4 flex flex-col gap-1 text-base">
            {[
              ["/about", "About"],
              ["/contact", "Contact"],
              ["/account", "Account"],
              ["/cart", `Bag${hydrated && cartCount > 0 ? ` (${cartCount})` : ""}`],
            ].map(([to, label]) => (
              <Link
                key={to}
                to={to}
                onClick={() => setOpen(false)}
                className="py-3 border-b border-rule font-medium"
              >
                {label}
              </Link>
            ))}
          </nav>
        </div>
      )}
    </header>
  );
}

function Footer() {
  const business = useStore((s) => s.business);
  const path = useRouterState({ select: (r) => r.location.pathname });
  if (path.startsWith("/admin")) return null;

  return (
    <footer className="bg-bg border-t border-rule mt-20">
      <div className="max-w-7xl mx-auto px-5 md:px-10 py-16 grid grid-cols-1 md:grid-cols-4 gap-10">
        <div className="md:col-span-2">
          <p className="font-display text-2xl uppercase mb-3">{business.name}</p>
          <p className="text-sm text-ink-soft max-w-sm">{business.tagline}</p>
        </div>
        <div>
          <p className="eyebrow mb-3">Pickup</p>
          <p className="text-sm leading-relaxed">
            {business.address}
            <br />
            {business.neighborhood}
            <br />
            <span className="text-ink-soft">{business.hours}</span>
          </p>
        </div>
        <div>
          <p className="eyebrow mb-3">Find us</p>
          <a href={`https://instagram.com/${business.instagram.replace("@", "")}`} className="text-sm block underline underline-offset-4 decoration-brand/40 hover:text-brand mb-1">
            {business.instagram}
          </a>
          <a href={`mailto:${business.email}`} className="text-sm block hover:text-brand">{business.email}</a>
          <p className="text-[10px] uppercase tracking-widest text-ink-soft mt-6">© {new Date().getFullYear()} {business.name} · <Link to="/admin" className="hover:text-brand">Owner</Link></p>
        </div>
      </div>
    </footer>
  );
}

function MobileStickyCTA() {
  const path = useRouterState({ select: (r) => r.location.pathname });
  const cartCount = useCartCount();
  const hydrated = useHydrated();
  // Hide on admin, checkout, cart, and auth flows
  if (
    path.startsWith("/admin") ||
    path.startsWith("/checkout") ||
    path.startsWith("/cart") ||
    path.startsWith("/auth")
  ) return null;

  const hasCart = hydrated && cartCount > 0;
  const to = hasCart ? "/cart" : "/";
  const label = hasCart ? `Review Bag (${cartCount})` : "Pre-Order Now";

  return (
    <div className="fixed bottom-4 left-1/2 -translate-x-1/2 w-[calc(100%-1.5rem)] max-w-md z-40 md:hidden animate-[slide-up_0.5s_var(--ease-out-expo)_0.4s_both]">
      <Link
        to={to}
        className="w-full bg-brand text-brand-ink py-4 px-5 font-bold uppercase text-[11px] tracking-[0.2em] shadow-2xl flex justify-between items-center"
      >
        <span>{label}</span>
        <span className="text-[9px] opacity-70 font-medium normal-case tracking-wide">Pickup Sat →</span>
      </Link>
    </div>
  );
}

export function SiteChrome({ children }: { children: ReactNode }) {
  const path = useRouterState({ select: (r) => r.location.pathname });
  const isAdmin = path.startsWith("/admin");

  return (
    <div className="min-h-screen flex flex-col font-body bg-bg text-ink selection:bg-brand selection:text-brand-ink">
      {!isAdmin && <StatusStrip />}
      <Header />
      <main className="flex-1">{children}</main>
      <Footer />
      <MobileStickyCTA />
      <Toaster position="top-center" toastOptions={{ style: { borderRadius: 0, fontFamily: "Hind, sans-serif" } }} />
    </div>
  );
}
