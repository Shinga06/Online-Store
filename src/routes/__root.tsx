import React, { useState, useEffect } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  Link,
  createRootRouteWithContext,
  useRouter,
  useLocation,
  HeadContent,
  Scripts,
} from "@tanstack/react-router";

import appCss from "../styles.css?url";
import { CartProvider } from "@/lib/cart";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { Toaster } from "@/components/ui/sonner";
import { Logo } from "@/components/Logo";

function NotFoundComponent() {
  return (
    <div className="flex min-h-[60vh] items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-7xl font-bold text-foreground">404</h1>
        <h2 className="mt-4 text-xl font-semibold text-foreground">Page not found</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <div className="mt-6">
          <Link
            to="/"
            className="inline-flex items-center justify-center rounded-sm bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Go home
          </Link>
        </div>
      </div>
    </div>
  );
}

function ErrorComponent({ error, reset }: { error: Error; reset: () => void }) {
  console.error(error);
  const router = useRouter();
  return (
    <div className="flex min-h-[60vh] items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-xl font-semibold tracking-tight text-foreground">This page didn't load</h1>
        <p className="mt-2 text-sm text-muted-foreground">Something went wrong. Try refreshing.</p>
        <div className="mt-6 flex flex-wrap justify-center gap-2">
          <button
            onClick={() => { router.invalidate(); reset(); }}
            className="inline-flex items-center justify-center rounded-sm bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
          >
            Try again
          </button>
          <a href="/" className="inline-flex items-center justify-center rounded-sm border border-input bg-background px-4 py-2 text-sm font-medium text-foreground hover:bg-accent">
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
      { title: "CBALCOOL — CBALCOOL PPE & Workwear South Africa" },
      { name: "description", content: "Shop SABS-approved PPE, safety footwear, hi-vis and corporate workwear. Trusted by industry across South Africa. Prices in ZAR." },
      { property: "og:title", content: "CBALCOOL — CBALCOOL PPE & Workwear" },
      { property: "og:description", content: "SABS-approved PPE and durable workwear for industry, security, hospitality and corporate teams." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
    links: [{ rel: "stylesheet", href: appCss }],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function RootShell({ children }: { children: React.ReactNode }) {
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
  const location = useLocation();
  const isAdminPath = location.pathname.startsWith("/admin");

  const [loading, setLoading] = useState(() => {
    if (typeof window !== "undefined" && !isAdminPath) {
      const isLoaded = sessionStorage.getItem("cbalcool_storefront_loaded");
      return !isLoaded;
    }
    return false;
  });

  useEffect(() => {
    if (loading) {
      const timer = setTimeout(() => {
        setLoading(false);
        if (typeof window !== "undefined") {
          sessionStorage.setItem("cbalcool_storefront_loaded", "true");
        }
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [loading]);

  if (loading && !isAdminPath) {
    return (
      <div className="fixed inset-0 z-50 bg-[#0a0f1d] flex flex-col items-center justify-center select-none animate-in fade-in duration-300">
        {/* Subtle radial backdrop glow */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(59,130,246,0.06),transparent_70%)] pointer-events-none"></div>
        
        {/* Logo and Spinner wrapper */}
        <div className="relative z-10 flex flex-col items-center gap-8">
          <Logo variant="large" />
          
          <div className="flex flex-col items-center gap-3">
            {/* Premium custom spinner with safety yellow styling */}
            <div className="w-9 h-9 rounded-full border-3 border-white/10 border-t-[var(--hi-vis)] animate-spin shadow-[0_0_20px_rgba(253,224,71,0.15)]"></div>
            <span className="text-[10px] text-white/50 uppercase tracking-[0.3em] font-bold mt-1">
              Loading Storefront
            </span>
          </div>
        </div>
      </div>
    );
  }

  if (isAdminPath) {
    return (
      <QueryClientProvider client={queryClient}>
        <div className="min-h-screen flex flex-col bg-background text-foreground">
          <Outlet />
          <Toaster />
        </div>
      </QueryClientProvider>
    );
  }

  return (
    <QueryClientProvider client={queryClient}>
      <CartProvider>
        <div className="min-h-screen flex flex-col">
          <SiteHeader />
          <main className="flex-1">
            <Outlet />
          </main>
          <SiteFooter />
        </div>
        <Toaster />
      </CartProvider>
    </QueryClientProvider>
  );
}
