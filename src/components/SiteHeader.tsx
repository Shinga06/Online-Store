import { Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { Menu, Search, ShoppingCart, X } from "lucide-react";
import { categories } from "@/lib/catalog";
import { useCart } from "@/lib/cart";

export function SiteHeader() {
  const { count } = useCart();
  const [open, setOpen] = useState(false);
  const [q, setQ] = useState("");
  const navigate = useNavigate();

  const submitSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!q.trim()) return;
    navigate({ to: "/shop", search: { q: q.trim(), category: "" } });
    setOpen(false);
  };

  return (
    <header className="sticky top-0 z-40 bg-surface text-surface-foreground border-b border-white/10">
      <div className="bg-black/40 text-xs">
        <div className="max-w-7xl mx-auto px-4 py-1.5 flex items-center justify-between text-white/70">
          <div className="flex items-center gap-4">
            <span>Nationwide delivery across South Africa</span>
            <span className="hidden sm:inline text-white/20">|</span>
            <span className="hidden sm:inline">SABS-approved PPE · Bulk orders welcome</span>
          </div>
          <Link to="/admin" className="text-[var(--hi-vis)] hover:underline font-semibold tracking-wide flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-[var(--hi-vis)] animate-pulse"></span>
            Admin Portal
          </Link>
        </div>
      </div>
      <div className="max-w-7xl mx-auto px-4 h-16 flex items-center gap-4">
        <button
          className="md:hidden p-2 -ml-2"
          onClick={() => setOpen((v) => !v)}
          aria-label="Menu"
        >
          {open ? <X size={22} /> : <Menu size={22} />}
        </button>

        <Link to="/" className="flex items-center gap-2 shrink-0">
          <div className="h-8 w-8 rounded-sm grid place-items-center font-bold text-black" style={{ background: "var(--hi-vis)" }}>
            S
          </div>
          <div className="leading-tight">
            <div className="font-display font-bold tracking-tight text-base">SAFEGEAR</div>
            <div className="text-[10px] uppercase tracking-[0.18em] text-white/60">PPE & Workwear</div>
          </div>
        </Link>

        <form onSubmit={submitSearch} className="hidden md:flex flex-1 max-w-xl mx-6">
          <div className="relative w-full">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/60" />
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search boots, hi-vis, gloves…"
              className="w-full bg-white/10 border border-white/15 text-white placeholder:text-white/50 rounded-sm pl-9 pr-3 h-10 text-sm focus:outline-none focus:border-[var(--hi-vis)]"
            />
          </div>
        </form>

        <nav className="hidden md:flex items-center gap-6 text-sm">
          <Link to="/shop" className="text-white/80 hover:text-white">Shop</Link>
          <Link to="/about" className="text-white/80 hover:text-white">About</Link>
          <Link to="/contact" className="text-white/80 hover:text-white">Contact</Link>
        </nav>

        <Link to="/cart" className="relative ml-auto md:ml-2 p-2" aria-label="Cart">
          <ShoppingCart size={22} />
          {count > 0 && (
            <span className="absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] px-1 rounded-full text-[10px] font-bold grid place-items-center text-black" style={{ background: "var(--hi-vis)" }}>
              {count}
            </span>
          )}
        </Link>
      </div>

      {/* Category bar */}
      <div className="hidden md:block border-t border-white/10 bg-black/20">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex gap-5 overflow-x-auto py-2 text-xs uppercase tracking-[0.14em] text-white/70 scrollbar-none">
            {categories.slice(0, 12).map((c) => (
              <Link
                key={c.slug}
                to="/shop"
                search={{ category: c.slug, q: "" }}
                className="whitespace-nowrap hover:text-[var(--hi-vis)]"
              >
                {c.name}
              </Link>
            ))}
            <Link to="/shop" search={{ category: "", q: "" }} className="whitespace-nowrap text-[var(--hi-vis)]">
              All categories →
            </Link>
          </div>
        </div>
      </div>

      {/* Mobile drawer */}
      {open && (
        <div className="md:hidden border-t border-white/10 bg-surface">
          <div className="px-4 py-3 space-y-3">
            <form onSubmit={submitSearch}>
              <div className="relative">
                <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/60" />
                <input
                  value={q}
                  onChange={(e) => setQ(e.target.value)}
                  placeholder="Search…"
                  className="w-full bg-white/10 border border-white/15 text-white placeholder:text-white/50 rounded-sm pl-9 pr-3 h-10 text-sm"
                />
              </div>
            </form>
            <div className="flex flex-col text-sm">
              <Link to="/shop" onClick={() => setOpen(false)} className="py-2 border-b border-white/10">Shop</Link>
              <Link to="/about" onClick={() => setOpen(false)} className="py-2 border-b border-white/10">About</Link>
              <Link to="/contact" onClick={() => setOpen(false)} className="py-2 border-b border-white/10">Contact</Link>
              <Link to="/admin" onClick={() => setOpen(false)} className="py-2 border-b border-white/10 text-[var(--hi-vis)] font-semibold flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-[var(--hi-vis)] animate-pulse"></span>
                Admin Portal
              </Link>
            </div>
            <div>
              <div className="text-[10px] uppercase tracking-[0.18em] text-white/50 mt-3 mb-2">Categories</div>
              <div className="grid grid-cols-2 gap-y-1.5 text-sm">
                {categories.map((c) => (
                  <Link
                    key={c.slug}
                    to="/shop"
                    search={{ category: c.slug, q: "" }}
                    onClick={() => setOpen(false)}
                    className="text-white/80"
                  >
                    {c.name}
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
