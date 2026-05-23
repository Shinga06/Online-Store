import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, ShieldCheck, Truck, Award, Headphones } from "lucide-react";
import { useDb } from "@/hooks/use-db";
import { ProductCard } from "@/components/ProductCard";
import { PremiumCategories } from "@/components/PremiumCategories";

export const Route = createFileRoute("/")({
  component: Home,
  head: () => ({
    meta: [
      { title: "CBALCOOL — CBALCOOL PPE & Workwear South Africa" },
      { name: "description", content: "Shop SABS-approved PPE, safety footwear, hi-vis and corporate workwear in South Africa. Bulk orders welcome." },
    ],
  }),
});

function Home() {
  const { products, categories } = useDb();
  const featured = products.filter((p) => p.featured).slice(0, 8);
  const featuredCats = categories.slice(0, 8);

  return (
    <div>
      {/* Hero */}
      <section className="relative bg-surface text-surface-foreground overflow-hidden">
        <div
          className="absolute inset-0 opacity-[0.06]"
          style={{ backgroundImage: "repeating-linear-gradient(135deg, white 0 2px, transparent 2px 22px)" }}
        />
        <div className="relative max-w-7xl mx-auto px-4 py-20 md:py-28 grid md:grid-cols-2 gap-10 items-center">
          <div>
            <div className="inline-flex items-center gap-2 text-[11px] uppercase tracking-[0.2em] text-[var(--hi-vis)] font-semibold mb-5">
              <span className="h-px w-8 bg-[var(--hi-vis)]" />
              SABS Approved Safety Gear
            </div>
            <h1 className="text-4xl md:text-6xl font-bold leading-[1.05] tracking-tight">
              Built for the job.<br />
              <span className="text-[var(--hi-vis)]">Trusted on every site.</span>
            </h1>
            <p className="mt-6 text-white/75 text-base md:text-lg max-w-lg">
              Industrial PPE, hi-vis, safety footwear and corporate workwear —
              shipped fast across South Africa. Quality you can stake your team on.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                to="/shop"
                search={{ category: "", q: "" }}
                className="inline-flex items-center gap-2 bg-[var(--hi-vis)] text-black font-semibold px-6 h-12 rounded-sm hover:brightness-95 transition"
              >
                Shop all gear <ArrowRight size={18} />
              </Link>
              <Link
                to="/shop"
                search={{ category: "safety-footwear", q: "" }}
                className="inline-flex items-center gap-2 border border-white/30 text-white font-semibold px-6 h-12 rounded-sm hover:bg-white/10"
              >
                Safety footwear
              </Link>
            </div>
          </div>
          <div className="hidden md:block">
            <div className="relative aspect-[4/5] max-w-md ml-auto">
              <div className="absolute inset-0 rounded-md border border-white/15 bg-gradient-to-br from-white/5 to-transparent" />
              <div className="absolute -top-4 -left-4 h-20 w-20 rounded-sm" style={{ background: "var(--hi-vis)" }} />
              <div className="absolute inset-6 grid grid-cols-2 gap-3">
                {categories.slice(0, 4).map((c) => (
                  <Link
                    key={c.slug}
                    to="/shop"
                    search={{ category: c.slug, q: "" }}
                    className="relative bg-white/5 border border-white/10 rounded-sm p-4 flex flex-col justify-end hover:bg-white/10 transition"
                  >
                    <div className="text-[10px] uppercase tracking-[0.18em] text-white/60">Category</div>
                    <div className="font-semibold text-white">{c.name}</div>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Trust bar */}
      <section className="border-b border-border bg-secondary">
        <div className="max-w-7xl mx-auto px-4 py-6 grid grid-cols-2 md:grid-cols-4 gap-6">
          {[
            { icon: ShieldCheck, label: "SABS approved", sub: "Tested & compliant" },
            { icon: Truck, label: "Nationwide delivery", sub: "2–4 working days" },
            { icon: Award, label: "Trade pricing", sub: "Bulk discounts" },
            { icon: Headphones, label: "Expert support", sub: "Mon–Fri 8–5" },
          ].map(({ icon: Icon, label, sub }) => (
            <div key={label} className="flex items-center gap-3">
              <Icon size={26} className="text-primary shrink-0" />
              <div>
                <div className="text-sm font-semibold text-foreground">{label}</div>
                <div className="text-xs text-muted-foreground">{sub}</div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Premium Interactive Categories Showcase */}
      <PremiumCategories />

      {/* Featured products */}
      <section className="bg-secondary/40 border-y border-border">
        <div className="max-w-7xl mx-auto px-4 py-16">
          <div className="flex items-end justify-between mb-8">
            <div>
              <div className="text-xs uppercase tracking-[0.2em] text-muted-foreground mb-2">Featured</div>
              <h2 className="text-3xl font-bold">Best-selling gear</h2>
            </div>
            <Link to="/shop" search={{ category: "", q: "" }} className="hidden md:inline-flex items-center gap-1 text-sm font-semibold text-primary hover:underline">
              All products <ArrowRight size={16} />
            </Link>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {featured.map((p) => <ProductCard key={p.id} product={p} />)}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="max-w-7xl mx-auto px-4 py-16">
        <div className="relative overflow-hidden rounded-md bg-surface text-surface-foreground p-10 md:p-14 grid md:grid-cols-[1fr_auto] gap-6 items-center">
          <div>
            <h3 className="text-2xl md:text-3xl font-bold">Kitting out a team or site?</h3>
            <p className="mt-2 text-white/75 max-w-xl">
              Get trade pricing, branded uniforms and account terms. Our team will quote within one working day.
            </p>
          </div>
          <Link to="/contact" className="inline-flex items-center gap-2 bg-[var(--hi-vis)] text-black font-semibold px-6 h-12 rounded-sm hover:brightness-95">
            Request a quote <ArrowRight size={18} />
          </Link>
          <div className="absolute -right-10 -bottom-10 h-40 w-40 rotate-12" style={{ background: "var(--hi-vis)", opacity: 0.15 }} />
        </div>
      </section>
    </div>
  );
}
