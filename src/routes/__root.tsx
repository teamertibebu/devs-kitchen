import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Outlet, Link, createRootRouteWithContext, useRouter, HeadContent, Scripts } from "@tanstack/react-router";
import { useEffect, type ReactNode } from "react";

import appCss from "../styles.css?url";
import { reportLovableError } from "../lib/lovable-error-reporting";
import { SiteChrome } from "../components/SiteChrome";

function NotFoundComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-bg px-6">
      <div className="max-w-md text-center">
        <p className="eyebrow mb-3">404</p>
        <h1 className="font-display text-5xl uppercase leading-none mb-4">Lost in the kitchen</h1>
        <p className="text-sm text-ink-soft mb-6">That page doesn't exist. Head back to this week's menu.</p>
        <Link
          to="/"
          className="inline-flex items-center justify-center bg-brand text-brand-ink px-6 py-3 font-bold uppercase text-xs tracking-widest"
        >
          Back home
        </Link>
      </div>
    </div>
  );
}

function ErrorComponent({ error, reset }: { error: Error; reset: () => void }) {
  console.error(error);
  const router = useRouter();
  useEffect(() => {
    reportLovableError(error, { boundary: "tanstack_root_error_component" });
  }, [error]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-bg px-6">
      <div className="max-w-md text-center">
        <p className="eyebrow mb-3">Something went wrong</p>
        <h1 className="font-display text-3xl uppercase leading-tight mb-3">This page didn't load</h1>
        <p className="text-sm text-ink-soft mb-6">Try refreshing or head back home.</p>
        <div className="flex justify-center gap-3">
          <button
            onClick={() => {
              router.invalidate();
              reset();
            }}
            className="bg-brand text-brand-ink px-6 py-3 font-bold uppercase text-xs tracking-widest"
          >
            Try again
          </button>
          <a
            href="/"
            className="border border-ink/20 px-6 py-3 font-bold uppercase text-xs tracking-widest hover:bg-ink/5"
          >
            Go home
          </a>
        </div>
      </div>
    </div>
  );
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "Dev's Kitchen — Weekly Pre-Order" },
      {
        name: "description",
        content:
          "Hand-rolled pasta and slow-fermented bread, made one weekend at a time. Pre-order for Saturday pickup.",
      },
      { name: "author", content: "Dev's Kitchen" },
      { property: "og:title", content: "Dev's Kitchen — Weekly Pre-Order" },
      { property: "og:description", content: "Pre-order this week's batch for Saturday pickup in San Francisco." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [
      { rel: "stylesheet", href: appCss },
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Archivo+Black&family=Hind:wght@400;500;600;700&display=swap",
      },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function RootShell({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <head>
        <HeadContent />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function RootComponent() {
  const { queryClient } = Route.useRouteContext();

  return (
    <QueryClientProvider client={queryClient}>
      <SiteChrome>
        <Outlet />
      </SiteChrome>
    </QueryClientProvider>
  );
}
