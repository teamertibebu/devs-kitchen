import { createFileRoute, Outlet, Link, useRouterState } from "@tanstack/react-router";
import { LayoutDashboard, ListOrdered, CalendarClock, Receipt, MessageSquare, Settings, Home, Plus } from "lucide-react";
import { useStore } from "@/lib/store";

export const Route = createFileRoute("/admin")({
  head: () => ({ meta: [{ title: "Admin — Coastal Kitchen" }] }),
  component: AdminLayout,
});

const nav = [
  { to: "/admin", label: "Today", icon: LayoutDashboard, exact: true },
  { to: "/admin/menu", label: "Menu", icon: ListOrdered },
  { to: "/admin/schedule", label: "Schedule", icon: CalendarClock },
  { to: "/admin/orders", label: "Orders", icon: Receipt },
  { to: "/admin/reminders", label: "Reminders", icon: MessageSquare },
  { to: "/admin/business", label: "Business", icon: Settings },
];

function AdminLayout() {
  const business = useStore((s) => s.business);
  const path = useRouterState({ select: (r) => r.location.pathname });

  return (
    <div className="min-h-screen bg-bg flex flex-col md:flex-row">
      {/* Sidebar (desktop) */}
      <aside className="hidden md:flex md:flex-col w-56 border-r border-rule bg-paper p-6 sticky top-0 h-screen">
        <Link to="/admin" className="font-display text-lg uppercase tracking-tight mb-1">{business.name}</Link>
        <p className="eyebrow mb-8">Owner</p>
        <nav className="flex flex-col gap-1 flex-1">
          {nav.map(({ to, label, icon: Icon, exact }) => {
            const active = exact ? path === to : path.startsWith(to);
            return (
              <Link key={to} to={to} className={`flex items-center gap-3 px-3 py-2.5 text-sm font-medium ${active ? "bg-ink text-bg" : "hover:bg-ink/5"}`}>
                <Icon className="size-4" />
                {label}
              </Link>
            );
          })}
        </nav>
        <Link to="/" className="flex items-center gap-2 text-xs uppercase tracking-widest font-bold text-ink-soft hover:text-ink mt-6">
          <Home className="size-3" /> View site
        </Link>
      </aside>

      {/* Mobile top bar */}
      <header className="md:hidden border-b border-rule bg-paper sticky top-0 z-30">
        <div className="px-4 py-3 flex items-center justify-between">
          <Link to="/admin" className="font-display text-base uppercase">{business.name} <span className="text-ink-soft text-xs ml-1">Admin</span></Link>
          <Link to="/" className="text-[10px] uppercase tracking-widest font-bold text-ink-soft">View site →</Link>
        </div>
        <nav className="flex overflow-x-auto px-2 py-1 gap-1">
          {nav.map(({ to, label, icon: Icon, exact }) => {
            const active = exact ? path === to : path.startsWith(to);
            return (
              <Link key={to} to={to} className={`flex items-center gap-2 px-3 py-2 text-xs font-medium whitespace-nowrap ${active ? "bg-ink text-bg" : "text-ink-soft"}`}>
                <Icon className="size-3.5" />
                {label}
              </Link>
            );
          })}
        </nav>
      </header>

      <main className="flex-1 min-w-0">
        <Outlet />
      </main>
    </div>
  );
}
