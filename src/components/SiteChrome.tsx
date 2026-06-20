import { Link, useRouterState } from "@tanstack/react-router";
import { useState, type ReactNode } from "react";
import { ShoppingBag, Menu as MenuIcon, X, Mail, Clock } from "lucide-react";
import { Toaster } from "sonner";
import { useCartCount, useStore } from "@/lib/store";
import { useHydrated } from "@/lib/hydrate";


function TopContactBar() {
  const business = useStore((s) => s.business);
  return (
    <div className="hidden md:block bg-white border-b border-rule">
      <div className="max-w-7xl mx-auto px-8 py-3 grid grid-cols-2 gap-6 text-sm">
        <div className="flex items-center gap-3">
          <span className="w-9 h-9 rounded-full bg-paper grid place-items-center text-cobalt">
            <Clock className="size-4" />
          </span>
          <div className="leading-tight">
            <p className="font-semibold text-navy">Pickup Sat 11AM – 2PM</p>
            <p className="text-ink-soft text-xs">Orders close Thu 8PM</p>
          </div>
        </div>
        <div className="flex items-center gap-3 justify-end">
          <span className="w-9 h-9 rounded-full bg-paper grid place-items-center text-cobalt">
            <Mail className="size-4" />
          </span>
          <div className="leading-tight">
            <p className="font-semibold text-navy">{business.email}</p>
            <p className="text-ink-soft text-xs">Email</p>
          </div>
        </div>
      </div>
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
    <>
      <TopContactBar />
      <header className="sticky top-0 z-50 bg-white border-b border-rule">
        <div className="max-w-7xl mx-auto px-5 md:px-8 py-3 flex items-center justify-between gap-4">
          <Link to="/" className="flex items-center gap-3 min-w-0">
            <span className="font-display text-lg md:text-xl text-navy truncate uppercase tracking-tight">
              {business.name}
            </span>
          </Link>

          <nav className="hidden md:flex items-center gap-2">
            <Link to="/" className="px-4 py-2 text-sm font-semibold text-navy hover:text-cobalt">Home</Link>
            <Link to="/about" className="px-4 py-2 text-sm font-semibold text-navy hover:text-cobalt">About</Link>
            <Link to="/contact" className="px-4 py-2 text-sm font-semibold text-navy hover:text-cobalt">Connect</Link>
            <Link to="/cart" className="btn-pill ml-2 relative">
              <ShoppingBag className="size-4" />
              <span>Order Now</span>
              {hydrated && cartCount > 0 && (
                <span className="ml-1 bg-cobalt rounded-full text-xs px-2 py-0.5 leading-none">{cartCount}</span>
              )}
            </Link>
          </nav>

          <div className="flex md:hidden items-center gap-2">
            <Link to="/cart" className="relative w-10 h-10 rounded-full bg-paper grid place-items-center text-navy" aria-label="Cart">
              <ShoppingBag className="size-4" />
              {hydrated && cartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-cobalt text-white text-[10px] font-bold rounded-full w-4 h-4 grid place-items-center">{cartCount}</span>
              )}
            </Link>
            <button className="w-10 h-10 rounded-full bg-paper grid place-items-center text-navy" onClick={() => setOpen((v) => !v)} aria-label="Menu">
              {open ? <X className="size-5" /> : <MenuIcon className="size-5" />}
            </button>
          </div>
        </div>
        {open && (
          <div className="md:hidden border-t border-rule bg-white">
            <nav className="px-5 py-3 flex flex-col">
              {[
                ["/", "Home"],
                ["/about", "About"],
                ["/contact", "Connect"],
                ["/account", "Account"],
              ].map(([to, label]) => (
                <Link key={to} to={to} onClick={() => setOpen(false)} className="py-3 border-b border-rule font-semibold text-navy">
                  {label}
                </Link>
              ))}
            </nav>
          </div>
        )}
      </header>
    </>
  );
}

function Footer() {
  const business = useStore((s) => s.business);
  const path = useRouterState({ select: (r) => r.location.pathname });
  if (path.startsWith("/admin")) return null;

  return (
    <footer className="section-navy mt-16">
      <div className="max-w-7xl mx-auto px-5 md:px-10 py-14 grid grid-cols-1 md:grid-cols-3 gap-10">
        <div className="md:col-span-2 flex items-start gap-4">
          <span className="w-14 h-14 rounded-full bg-jet text-cobalt grid place-items-center font-display text-lg shrink-0">DK</span>
          <div>
            <p className="font-display text-2xl uppercase mb-2">{business.name}</p>
            <p className="text-sm text-ink-soft-on-dark max-w-sm">{business.tagline}</p>
          </div>
        </div>
        <div>
          <p className="eyebrow text-cobalt mb-3">Connect</p>
          <a href={`https://instagram.com/${business.instagram.replace("@", "")}`} className="text-sm block hover:text-cobalt mb-1">{business.instagram}</a>
          <a href={`mailto:${business.email}`} className="text-sm block hover:text-cobalt">{business.email}</a>
          <p className="text-[10px] uppercase tracking-widest text-ink-soft-on-dark mt-6">© {new Date().getFullYear()} {business.name} · <Link to="/admin" className="hover:text-cobalt">Owner</Link></p>
        </div>
      </div>
    </footer>
  );
}

export function SiteChrome({ children }: { children: ReactNode }) {
  const path = useRouterState({ select: (r) => r.location.pathname });
  const isAdmin = path.startsWith("/admin");

  return (
    <div className="min-h-screen flex flex-col font-body bg-bg text-ink selection:bg-cobalt selection:text-white">
      <Header />
      <main className="flex-1">{children}</main>
      {!isAdmin && <Footer />}
      <Toaster position="top-center" />
    </div>
  );
}
