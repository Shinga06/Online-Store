import { Link } from "@tanstack/react-router";
import { categories } from "@/lib/catalog";
import { Logo } from "./Logo";

export function SiteFooter() {
  return (
    <footer className="bg-surface text-surface-foreground mt-24">
      <div className="max-w-7xl mx-auto px-4 py-14 grid grid-cols-2 md:grid-cols-4 gap-8">
        <div className="col-span-2 md:col-span-1">
          <Link to="/" className="inline-block hover:opacity-95 transition-opacity">
            <Logo variant="horizontal" subTextType="solutions" />
          </Link>
          <p className="mt-4 text-sm text-white/70 leading-relaxed">
            South Africa's trusted source for SABS-approved PPE and durable
            workwear. Outfitting industry, security, hospitality and corporate
            teams since 2008.
          </p>
        </div>
        <div>
          <div className="text-xs uppercase tracking-[0.18em] text-white/50 mb-3">Shop</div>
          <ul className="space-y-2 text-sm text-white/80">
            {categories.slice(0, 8).map((c) => (
              <li key={c.slug}>
                <Link to="/shop" search={{ category: c.slug, q: "" }} className="hover:text-[var(--hi-vis)]">
                  {c.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <div className="text-xs uppercase tracking-[0.18em] text-white/50 mb-3">Company & Support</div>
          <ul className="space-y-2 text-sm text-white/80">
            <li><Link to="/about" className="hover:text-[var(--hi-vis)]">About us</Link></li>
            <li><Link to="/contact" className="hover:text-[var(--hi-vis)]">Contact</Link></li>
            <li><Link to="/shop" className="hover:text-[var(--hi-vis)]">All products</Link></li>
            <li><Link to="/track" className="hover:text-[var(--hi-vis)]">Track Order</Link></li>
            <li><Link to="/account" className="hover:text-[var(--hi-vis)]">My Account</Link></li>
            <li><Link to="/admin" className="hover:text-[var(--hi-vis)] font-semibold flex items-center gap-1.5"><span className="w-1.5 h-1.5 rounded-full bg-[var(--hi-vis)] animate-pulse"></span>Admin Portal</Link></li>
          </ul>
        </div>
        <div>
          <div className="text-xs uppercase tracking-[0.18em] text-white/50 mb-3">Get in touch</div>
          <ul className="space-y-2 text-sm text-white/80">
            <li>Mon–Fri, 08:00–17:00</li>
            <li>sales@cbalcool.co.za</li>
            <li>+27 (0)11 555 0100</li>
            <li>Johannesburg, South Africa</li>
          </ul>
        </div>
      </div>
      <div className="border-t border-white/10">
        <div className="max-w-7xl mx-auto px-4 py-4 text-xs text-white/60 flex flex-col md:flex-row justify-between gap-2">
          <span>© {new Date().getFullYear()} CBALCOOL PPE & Workwear. All rights reserved.</span>
          <div className="flex items-center gap-3">
            <Link to="/admin" className="hover:text-white transition">Admin Dashboard</Link>
            <span>·</span>
            <span>Prices in ZAR · VAT incl.</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
