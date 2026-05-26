import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, ShieldCheck, Truck, Award, Headphones, Sparkles } from "lucide-react";
import { useState, useEffect } from "react";
import { useDb } from "@/hooks/use-db";
import { ProductCard } from "@/components/ProductCard";

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
    <div className="overflow-hidden">
      {/* Hero Section */}
      <section className="relative bg-surface text-surface-foreground overflow-hidden border-b border-white/5">
        <div
          className="absolute inset-0 opacity-[0.04]"
          style={{ backgroundImage: "repeating-linear-gradient(135deg, white 0 2px, transparent 2px 22px)" }}
        />
        <div className="relative max-w-7xl mx-auto px-4 py-20 md:py-28 grid md:grid-cols-2 gap-10 items-center">
          {/* Hero Left Content */}
          <div className="flex flex-col items-start">
            <div 
              className="inline-flex items-center gap-2 text-[11px] uppercase tracking-[0.2em] text-[var(--hi-vis)] font-bold mb-5"
              style={{
                animation: "fadeInLeft 0.5s cubic-bezier(0.16, 1, 0.3, 1) forwards",
                animationDelay: "100ms",
                opacity: 0,
              }}
            >
              <span className="h-px w-8 bg-[var(--hi-vis)] animate-pulse" />
              SABS Approved Safety Gear
            </div>
            
            <h1 
              className="text-4xl md:text-6xl font-extrabold leading-[1.05] tracking-tight text-white"
              style={{
                animation: "fadeInLeft 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards",
                animationDelay: "200ms",
                opacity: 0,
              }}
            >
              Built for the job.<br />
              <span className="text-[var(--hi-vis)] relative">
                Trusted on every site.
              </span>
            </h1>
            
            <p 
              className="mt-6 text-white/75 text-base md:text-lg max-w-lg leading-relaxed"
              style={{
                animation: "fadeInLeft 0.7s cubic-bezier(0.16, 1, 0.3, 1) forwards",
                animationDelay: "300ms",
                opacity: 0,
              }}
            >
              Industrial PPE, hi-vis, safety footwear and corporate workwear —
              shipped fast across South Africa. Quality you can stake your team on.
            </p>
            
            <div 
              className="mt-8 flex flex-wrap gap-3"
              style={{
                animation: "fadeInLeft 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards",
                animationDelay: "400ms",
                opacity: 0,
              }}
            >
              <Link
                to="/shop"
                search={{ category: "", q: "" }}
                className="inline-flex items-center gap-2 bg-[var(--hi-vis)] text-black font-bold px-6 h-12 rounded-sm hover:brightness-95 hover:shadow-[0_0_15px_rgba(224,188,38,0.25)] transition duration-300 group"
              >
                Shop all gear 
                <ArrowRight size={18} className="transition-transform group-hover:translate-x-1" />
              </Link>
              <Link
                to="/shop"
                search={{ category: "safety-footwear", q: "" }}
                className="inline-flex items-center gap-2 border border-white/20 text-white font-bold px-6 h-12 rounded-sm hover:bg-white/5 hover:border-[var(--hi-vis)]/40 transition duration-300"
              >
                Safety footwear
              </Link>
            </div>
          </div>

          {/* Hero Right Visual Category Grid */}
          <div 
            className="hidden md:block"
            style={{
              animation: "fadeInUp 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards",
              animationDelay: "450ms",
              opacity: 0,
            }}
          >
            <div className="relative aspect-[4/5] max-w-md ml-auto">
              <div className="absolute inset-0 rounded-md border border-white/10 bg-gradient-to-br from-white/5 to-transparent backdrop-blur-[1px]" />
              <div className="absolute -top-4 -left-4 h-16 w-16 rounded-sm bg-[var(--hi-vis)] animate-pulse" style={{ opacity: 0.8 }} />
              <div className="absolute inset-6 grid grid-cols-2 gap-4">
                {categories.slice(0, 4).map((c, idx) => (
                  <HeroCategoryCard key={c.slug} c={c} idx={idx} />
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Trust & Features bar */}
      <section className="border-b border-border bg-secondary/80">
        <div className="max-w-7xl mx-auto px-4 py-6 grid grid-cols-2 md:grid-cols-4 gap-6">
          {[
            { icon: ShieldCheck, label: "SABS approved", sub: "Tested & compliant", iconClass: "group-hover:rotate-6 group-hover:-translate-y-0.5 text-primary" },
            { icon: Truck, label: "Nationwide delivery", sub: "2–4 working days", iconClass: "group-hover:translate-x-1 text-primary" },
            { icon: Award, label: "Trade pricing", sub: "Bulk discounts", iconClass: "group-hover:scale-110 group-hover:-rotate-3 text-primary" },
            { icon: Headphones, label: "Expert support", sub: "Mon–Fri 8–5", iconClass: "group-hover:animate-pulse text-primary" },
          ].map(({ icon: Icon, label, sub, iconClass }, idx) => (
            <div 
              key={label} 
              className="flex items-center gap-3 group cursor-pointer"
              style={{
                animation: "fadeInUp 0.5s cubic-bezier(0.16, 1, 0.3, 1) forwards",
                animationDelay: `${idx * 80}ms`,
                opacity: 0,
              }}
            >
              <div className="p-2 rounded-sm bg-primary/5 group-hover:bg-primary/10 transition-colors duration-300">
                <Icon size={26} className={`shrink-0 transition-all duration-300 ease-out ${iconClass}`} />
              </div>
              <div>
                <div className="text-sm font-semibold text-foreground group-hover:text-primary transition-colors duration-300">{label}</div>
                <div className="text-xs text-muted-foreground">{sub}</div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Categories Grid Section */}
      <section className="max-w-7xl mx-auto px-4 py-16">
        <div className="flex items-end justify-between mb-8">
          <div>
            <div className="text-xs uppercase tracking-[0.2em] text-muted-foreground mb-2">Shop by category</div>
            <h2 className="text-3xl font-bold">Outfit your whole team</h2>
          </div>
          <Link to="/shop" search={{ category: "", q: "" }} className="hidden md:inline-flex items-center gap-1.5 text-sm font-bold text-primary hover:underline group">
            View all categories 
            <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
          </Link>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {featuredCats.map((c, idx) => (
            <Link
              key={c.slug}
              to="/shop"
              search={{ category: c.slug, q: "" }}
              className="group relative aspect-[5/4] bg-surface text-surface-foreground rounded-md overflow-hidden border border-white/10 hover:border-[var(--hi-vis)]/40 hover:-translate-y-1.5 hover:scale-[1.02] hover:shadow-[0_0_30px_-5px_rgba(224,188,38,0.15)] transition-all duration-300 ease-out"
              style={{
                animation: "fadeInUp 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards",
                animationDelay: `${idx * 80}ms`,
                opacity: 0,
              }}
            >
              {/* Background Cover Image */}
              {c.image && (
                <img 
                  src={c.image} 
                  alt={c.name} 
                  className="absolute inset-0 w-full h-full object-cover opacity-45 group-hover:opacity-65 group-hover:scale-110 transition-all duration-700 ease-out z-0 pointer-events-none"
                />
              )}

              {/* Premium Dark Gradient Overlay for Maximum Readability */}
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/40 to-transparent group-hover:from-slate-950 group-hover:via-slate-950/30 transition-all duration-500 z-0 pointer-events-none" />

              {/* Top Accent Strip */}
              <div className="absolute top-0 left-0 h-[3px] w-full bg-[var(--hi-vis)] transition-transform duration-300 origin-left" />
              
              {/* Background gradient glow that fades in on hover */}
              <div className="absolute inset-0 bg-gradient-to-br from-transparent via-transparent to-[var(--hi-vis)]/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none z-0" />
              
              {/* Subtle shimmer sweep effect on hover */}
              <div className="absolute inset-0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000 ease-out bg-gradient-to-r from-transparent via-white/5 to-transparent pointer-events-none z-0" />
              
              <div className="absolute inset-0 p-6 flex flex-col justify-between z-10">
                <div className="text-[10px] uppercase tracking-[0.2em] text-white/50 group-hover:text-[var(--hi-vis)] transition-colors duration-300">
                  Category
                </div>
                <div>
                  <div className="text-xl font-extrabold tracking-tight text-white group-hover:text-white transition-colors">
                    {c.name}
                  </div>
                  <div className="text-xs text-white/60 mt-2 line-clamp-2 leading-relaxed">
                    {c.blurb}
                  </div>
                  <div className="mt-4 inline-flex items-center gap-1.5 text-[var(--hi-vis)] text-xs font-bold uppercase tracking-wider group-hover:translate-x-1 transition-transform duration-300">
                    Shop now 
                    <ArrowRight size={14} className="transition-transform duration-300 group-hover:translate-x-0.5" />
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Featured products */}
      <section className="bg-secondary/40 border-y border-border">
        <div className="max-w-7xl mx-auto px-4 py-16">
          <div className="flex items-end justify-between mb-8">
            <div>
              <div className="text-xs uppercase tracking-[0.2em] text-muted-foreground mb-2">Featured</div>
              <h2 className="text-3xl font-bold">Best-selling gear</h2>
            </div>
            <Link to="/shop" search={{ category: "", q: "" }} className="hidden md:inline-flex items-center gap-1.5 text-sm font-bold text-primary hover:underline group">
              All products 
              <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
            </Link>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {featured.map((p, idx) => (
              <div 
                key={p.id}
                style={{
                  animation: "fadeInUp 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards",
                  animationDelay: `${idx * 80}ms`,
                  opacity: 0,
                }}
              >
                <ProductCard product={p} />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* B2B Call To Action Section */}
      <section className="max-w-7xl mx-auto px-4 py-16">
        <div 
          className="relative overflow-hidden rounded-md bg-surface text-surface-foreground p-10 md:p-14 grid md:grid-cols-[1fr_auto] gap-6 items-center border border-white/5 hover:border-[var(--hi-vis)]/20 transition-all duration-500 group shadow-lg"
          style={{
            animation: "fadeInUp 0.7s cubic-bezier(0.16, 1, 0.3, 1) forwards",
            opacity: 0,
          }}
        >
          <div className="z-10 relative">
            <div className="flex items-center gap-1.5 text-[var(--hi-vis)] text-xs font-semibold uppercase tracking-widest mb-3">
              <Sparkles size={14} className="animate-pulse" />
              Corporate Accounts Welcome
            </div>
            <h3 className="text-2xl md:text-3xl font-extrabold tracking-tight text-white">Kitting out a team or site?</h3>
            <p className="mt-2 text-white/70 max-w-xl leading-relaxed text-sm">
              Get corporate trade pricing, custom branded uniforms, and flexible account payment terms. Our safety coordinators will compile a customized quote for your enterprise within one working day.
            </p>
          </div>
          
          <div className="z-10 relative">
            <Link 
              to="/contact" 
              className="inline-flex items-center gap-2 bg-[var(--hi-vis)] text-black font-bold px-8 h-12 rounded-sm hover:brightness-95 hover:shadow-[0_0_20px_rgba(224,188,38,0.3)] transition duration-300 group-button"
            >
              Request a trade quote 
              <ArrowRight size={18} className="transition-transform group-hover:translate-x-1" />
            </Link>
          </div>
          
          {/* Animated Gold Breathing Glow shape */}
          <div 
            className="absolute -right-10 -bottom-10 h-56 w-56 rounded-full blur-3xl pointer-events-none"
            style={{ 
              background: "var(--hi-vis)", 
              animation: "pulseGlow 6s ease-in-out infinite"
            }} 
          />
        </div>
      </section>
    </div>
  );
}

const HERO_CATEGORY_IMAGES: Record<string, string[]> = {
  aprons: [
    "https://images.unsplash.com/photo-1577900232427-18219b9166a0?auto=format&fit=crop&w=600&q=80",
    "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&w=600&q=80",
    "https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?auto=format&fit=crop&w=600&q=80"
  ],
  "chef-wear": [
    "https://images.unsplash.com/photo-1577219491135-ce391730fb2c?auto=format&fit=crop&w=600&q=80",
    "https://images.unsplash.com/photo-1581084324492-c8076f130f86?auto=format&fit=crop&w=600&q=80",
    "https://images.unsplash.com/photo-1605270864945-8ed8b90be886?auto=format&fit=crop&w=600&q=80"
  ],
  golfers: [
    "https://images.unsplash.com/photo-1581655353564-df123a1eb820?auto=format&fit=crop&w=600&q=80",
    "https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?auto=format&fit=crop&w=600&q=80",
    "https://images.unsplash.com/photo-1598033129183-c4f50c736f10?auto=format&fit=crop&w=600&q=80"
  ],
  jackets: [
    "https://images.unsplash.com/photo-1544923246-77307dd654cb?auto=format&fit=crop&w=600&q=80",
    "https://images.unsplash.com/photo-1551028719-00167b16eac5?auto=format&fit=crop&w=600&q=80",
    "https://images.unsplash.com/photo-1508445861827-7711f397115a?auto=format&fit=crop&w=600&q=80"
  ]
};

function HeroCategoryCard({ c, idx }: { c: any; idx: number }) {
  const images = HERO_CATEGORY_IMAGES[c.slug] || [c.image || ""];
  const [activeIdx, setActiveIdx] = useState(0);

  useEffect(() => {
    if (images.length <= 1) return;
    
    // Staggered delay of 1200ms per index to cycle them separately
    const initialDelay = idx * 1200;
    
    const timeout = setTimeout(() => {
      const interval = setInterval(() => {
        setActiveIdx((prev) => (prev + 1) % images.length);
      }, 5000); // Transitions slide every 5 seconds
      
      return () => clearInterval(interval);
    }, initialDelay);

    return () => clearTimeout(timeout);
  }, [images, idx]);

  return (
    <Link
      to="/shop"
      search={{ category: c.slug, q: "" }}
      className="relative bg-white/5 border border-white/10 rounded-sm p-5 flex flex-col justify-end hover:bg-white/10 hover:border-[var(--hi-vis)]/30 hover:scale-[1.03] hover:shadow-[0_0_20px_rgba(224,188,38,0.15)] transition-all duration-300 group overflow-hidden"
      style={{
        animation: `fadeInUp 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards, float ${6 + idx * 1.5}s ease-in-out infinite`,
        animationDelay: `${500 + idx * 100}ms, ${idx * 1.2}s`,
        opacity: 0,
      }}
    >
      {/* Background Cover Sliding Image Panel */}
      <div 
        className="absolute inset-0 flex transition-transform duration-1000 ease-in-out z-0 pointer-events-none"
        style={{ 
          width: `${images.length * 100}%`,
          transform: `translateX(-${(activeIdx * 100) / images.length}%)` 
        }}
      >
        {images.map((imgUrl, i) => (
          <img 
            key={i}
            src={imgUrl} 
            alt={`${c.name} preview ${i}`} 
            className="h-full object-cover opacity-40 group-hover:opacity-60 group-hover:scale-105 transition-all duration-700 ease-out pointer-events-none"
            style={{ width: `${100 / images.length}%` }}
          />
        ))}
      </div>

      {/* Premium Dark overlay gradient */}
      <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/40 to-transparent group-hover:from-slate-950/90 group-hover:via-slate-950/30 transition-all duration-500 z-0 pointer-events-none" />

      <div className="relative z-10">
        <div className="text-[9px] uppercase tracking-[0.2em] text-white/50 group-hover:text-[var(--hi-vis)] transition-colors duration-300">Category</div>
        <div className="font-bold text-white text-base mt-1 group-hover:translate-x-0.5 transition-transform duration-300">{c.name}</div>
      </div>
    </Link>
  );
}
