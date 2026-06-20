import { Link, useRouterState } from "@tanstack/react-router";
import { useState, type ReactNode } from "react";
import { ShoppingBag, Menu as MenuIcon, X, Instagram, Mail } from "lucide-react";
import { Toaster } from "sonner";
import { useCartCount, useCartTotal, useStore, fmtMoney } from "@/lib/store";
import { useHydrated } from "@/lib/hydrate";


function Header() {
  const [open, setOpen] = useState(false);
  const business = useStore((s) => s.business);
  const path = useRouterState({ select: (r) => r.location.pathname });
  const isAdmin = path.startsWith("/admin");
  const isCart = path.startsWith("/cart");

  if (isAdmin) return null;

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-rule">
      <div className="max-w-7xl mx-auto px-5 md:px-8 py-3 flex items-center justify-between gap-4">
        <Link to="/" className="flex items-center gap-3 min-w-0">
          <span className="font-display text-lg md:text-xl text-navy truncate uppercase tracking-tight">
            {business.name}
          </span>
        </Link>

        {isCart && (
          <nav className="hidden md:flex items-center gap-2">
            <Link to="/" className="px-4 py-2 text-sm font-semibold text-navy hover:text-cobalt">Home</Link>
          </nav>
        )}

        <div className="flex md:hidden items-center gap-2">
          <button className="w-10 h-10 rounded-full bg-paper grid place-items-center text-navy" onClick={() => setOpen((v) => !v)} aria-label="Menu">
            {open ? <X className="size-5" /> : <MenuIcon className="size-5" />}
          </button>
        </div>
      </div>
      {open && (
        <div className="md:hidden border-t border-rule bg-white">
          <nav className="px-5 py-3 flex flex-col">
            {[
              ...(isCart ? [["/", "Home"]] : []),
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
  );
}


function FloatingCartBar() {
  const cartCount = useCartCount();
  const cartTotal = useCartTotal();
  const hydrated = useHydrated();
  const path = useRouterState({ select: (r) => r.location.pathname });

  if (!hydrated || cartCount === 0) return null;
  if (path.startsWith("/admin") || path.startsWith("/cart") || path.startsWith("/checkout")) return null;

  return (
    <div
      className="fixed left-0 right-0 bottom-0 z-50 px-3 md:px-6 pb-3 md:pb-5 pointer-events-none"
      style={{ paddingBottom: "max(0.75rem, env(safe-area-inset-bottom))" }}
    >
      <div className="max-w-2xl mx-auto pointer-events-auto animate-[slide-up_0.3s_var(--ease-out-expo)_both]">
        <Link
          to="/cart"
          className="flex items-center justify-between gap-3 bg-navy text-white rounded-full shadow-2xl pl-5 pr-2 py-2 hover:bg-jet transition-colors"
        >
          <div className="flex items-center gap-3 min-w-0">
            <span className="relative">
              <ShoppingBag className="size-5" />
              <span className="absolute -top-2 -right-2 bg-cobalt text-white text-[10px] font-bold rounded-full w-4 h-4 grid place-items-center">
                {cartCount}
              </span>
            </span>
            <span className="font-semibold text-sm">
              {cartCount} {cartCount === 1 ? "item" : "items"} · {fmtMoney(cartTotal)}
            </span>
          </div>
          <span className="btn-pill-cobalt px-5 py-2 text-sm">Order Now</span>
        </Link>
      </div>
    </div>
  );
}

function Footer() {
  const business = useStore((s) => s.business);
  const path = useRouterState({ select: (r) => r.location.pathname });
  if (path.startsWith("/admin")) return null;

  return (
    <footer className="section-navy">
      <div className="max-w-7xl mx-auto px-5 md:px-10 py-5 md:py-6">
        <div className="grid grid-cols-2 gap-4 md:gap-6">
          <div className="min-w-0">
            <p className="font-display text-lg md:text-xl uppercase mb-1">{business.name}</p>
            <p className="text-[10px] uppercase tracking-widest text-ink-soft-on-dark">© {new Date().getFullYear()} {business.name} · <Link to="/admin" className="hover:text-cobalt">Owner</Link></p>
          </div>
          <div className="min-w-0">
            <p className="eyebrow text-cobalt mb-2">Connect</p>
            <div className="flex flex-wrap items-center gap-x-4 gap-y-1">
              <a href={`https://instagram.com/${business.instagram.replace("@", "")}`} className="text-sm inline-flex items-center gap-2 hover:text-cobalt"><Instagram className="size-4 shrink-0" />{business.instagram}</a>
              <a href={`mailto:${business.email}`} className="text-sm inline-flex items-center gap-2 hover:text-cobalt"><Mail className="size-4 shrink-0" />{business.email}</a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

export function SiteChrome({ children }: { children: ReactNode }) {
  const path = useRouterState({ select: (r) => r.location.pathname });
  const isAdmin = path.startsWith("/admin");
  const cartCount = useCartCount();
  const hydrated = useHydrated();
  const showCartBar = hydrated && cartCount > 0 && !isAdmin && !path.startsWith("/cart") && !path.startsWith("/checkout");

  return (
    <div className="min-h-screen flex flex-col font-body bg-bg text-ink selection:bg-cobalt selection:text-white">
      <Header />
      <main className="flex-1">{children}</main>
      {!isAdmin && <Footer />}
      {showCartBar && <div aria-hidden className="h-24 md:h-20" style={{ paddingBottom: "env(safe-area-inset-bottom)" }} />}
      <FloatingCartBar />
      <Toaster position="top-center" />
    </div>
  );
}
