import { Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { Menu, Search, ShoppingCart, X, ChevronDown, Sparkles, ArrowRight } from "lucide-react";
import { useCart } from "@/lib/cart";
import { Logo } from "./Logo";

// Hierarchical departments and category items structure
const DEPARTMENTS = [
  {
    name: "Workwear",
    sections: [
      {
        title: "Core Uniforms",
        items: [
          { name: "Corporate Wear", slug: "corporate-wear" },
          { name: "Chef Wear", slug: "chef-wear" },
          { name: "Hi-Visibility", slug: "hi-vis" },
          { name: "Rain Suits", slug: "rain-suits" },
          { name: "Aprons", slug: "aprons" },
        ],
      },
      {
        title: "Specialty Wear",
        items: [
          { name: "Conti Suits", slug: "conti-suits" },
          { name: "Security Wear", slug: "security-wear" },
          { name: "Service & Beauty", slug: "service-beauty" },
        ],
      },
    ],
  },
  {
    name: "Apparel",
    sections: [
      {
        title: "Core Apparel",
        items: [
          { name: "Shirts", slug: "shirts" },
          { name: "Golfers", slug: "golfers" },
          { name: "Jackets", slug: "jackets" },
          { name: "Shorts", slug: "shorts" },
          { name: "Trousers", slug: "trousers" },
        ],
      },
      {
        title: "Layering & Outerwear",
        items: [
          { name: "Fleece Jackets", slug: "fleece-jackets" },
          { name: "Body Warmers", slug: "body-warmers" },
        ],
      },
    ],
  },
  {
    name: "PPE & Safety",
    sections: [
      {
        title: "Core Safety",
        items: [
          { name: "Safety Footwear", slug: "safety-footwear" },
          { name: "Hi-Visibility", slug: "hi-vis" },
        ],
      },
      {
        title: "Protective Gear",
        items: [
          { name: "Protective Gloves", slug: "gloves" },
          { name: "Face Protection", slug: "face-protection" },
          { name: "Coveralls", slug: "coveralls" },
          { name: "Gumboots", slug: "gumboots" },
          { name: "Sneakers", slug: "sneakers" },
        ],
      },
    ],
  },
  {
    name: "Accessories",
    sections: [
      {
        title: "Accessories",
        items: [
          { name: "Headwear", slug: "headwear" },
        ],
      },
      {
        title: "Specialty Footwear",
        items: [
          { name: "Men's Footwear", slug: "mens-footwear" },
          { name: "Ladies Footwear", slug: "ladies-footwear" },
        ],
      },
    ],
  },
];

export function SiteHeader() {
  const { count } = useCart();
  const [open, setOpen] = useState(false);
  const [q, setQ] = useState("");
  const [isHovered, setIsHovered] = useState(false);
  const [mobileProductsOpen, setMobileProductsOpen] = useState(false);
  const [expandedDepts, setExpandedDepts] = useState<Record<string, boolean>>({
    Workwear: true, // Open Workwear by default to draw visual attention to structure
  });

  const navigate = useNavigate();

  const submitSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!q.trim()) return;
    navigate({ to: "/shop", search: { q: q.trim(), category: "" } });
    setOpen(false);
  };

  const toggleMobileDept = (deptName: string) => {
    setExpandedDepts((prev) => ({
      ...prev,
      [deptName]: !prev[deptName],
    }));
  };

  return (
    <header 
      className="sticky top-0 z-40 bg-surface text-surface-foreground border-b border-white/10"
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Top Banner */}
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

      {/* Main Header Bar */}
      <div className="max-w-7xl mx-auto px-4 h-16 flex items-center gap-4 relative">
        <button
          className="md:hidden p-2 -ml-2 text-white"
          onClick={() => setOpen((v) => !v)}
          aria-label="Menu"
        >
          {open ? <X size={22} /> : <Menu size={22} />}
        </button>

        <Link to="/" className="flex items-center gap-2 shrink-0 hover:opacity-95 transition-opacity">
          <Logo variant="horizontal" subTextType="ppe" />
        </Link>

        {/* Desktop Search Bar */}
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

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-6 text-sm h-full font-medium">
          {/* Products Dropdown Trigger */}
          <div 
            className="h-full flex items-center"
            onMouseEnter={() => setIsHovered(true)}
          >
            <button className="flex items-center gap-1.5 text-white/80 hover:text-white h-full transition-colors cursor-pointer py-2">
              Products
              <ChevronDown 
                size={14} 
                className={`transition-transform duration-200 ${isHovered ? 'rotate-180 text-[var(--hi-vis)]' : 'text-white/55'}`} 
              />
            </button>
          </div>
          <Link to="/about" className="text-white/80 hover:text-white transition-colors">About</Link>
          <Link to="/contact" className="text-white/80 hover:text-white transition-colors">Contact</Link>
          <Link to="/track" className="text-white/80 hover:text-white transition-colors">Track Order</Link>
          <Link to="/account" className="text-white/80 hover:text-white transition-colors">My Account</Link>
        </nav>

        {/* Cart Icon */}
        <Link to="/cart" className="relative ml-auto md:ml-2 p-2 text-white hover:text-[var(--hi-vis)] transition-colors animate-in duration-200" aria-label="Cart">
          <ShoppingCart size={22} />
          {count > 0 && (
            <span className="absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] px-1 rounded-full text-[10px] font-bold grid place-items-center text-black" style={{ background: "var(--hi-vis)" }}>
              {count}
            </span>
          )}
        </Link>
      </div>

      {/* Desktop Megamenu Panel */}
      {isHovered && (
        <div 
          className="absolute top-full left-0 right-0 bg-surface/98 backdrop-blur-md border-b border-white/10 shadow-2xl transition-all duration-300 animate-in fade-in slide-in-from-top-2"
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          <div className="max-w-7xl mx-auto px-8 py-8 grid grid-cols-5 gap-8">
            {DEPARTMENTS.map((dept) => (
              <div key={dept.name} className="space-y-4">
                <h3 className="text-xs uppercase tracking-[0.2em] text-[var(--hi-vis)] font-bold pb-2 border-b border-white/5">
                  {dept.name}
                </h3>
                <div className="space-y-4">
                  {dept.sections.map((section) => (
                    <div key={section.title} className="space-y-1.5">
                      <h4 className="text-[10px] uppercase tracking-wider text-white/40 font-semibold">
                        {section.title}
                      </h4>
                      <ul className="space-y-1">
                        {section.items.map((item) => (
                          <li key={item.slug}>
                            <Link 
                              to="/shop" 
                              search={{ category: item.slug, q: "" }}
                              onClick={() => setIsHovered(false)}
                              className="text-sm text-white/70 hover:text-white hover:translate-x-1 flex items-center gap-1 transition-all duration-150 py-0.5 group"
                            >
                              <span className="h-1 w-1 rounded-full bg-[var(--hi-vis)] scale-0 group-hover:scale-100 transition-all duration-150"></span>
                              {item.name}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </div>
            ))}

            {/* B2B Promo Block (Column 5) */}
            <div className="bg-gradient-to-b from-white/5 to-white/[0.02] border border-white/10 rounded-md p-5 flex flex-col justify-between h-full">
              <div>
                <div className="flex items-center gap-1.5 text-[var(--hi-vis)] text-xs font-semibold uppercase tracking-wider mb-2">
                  <Sparkles size={14} />
                  B2B Solutions
                </div>
                <h4 className="text-sm font-bold text-white mb-1.5">Custom Branding</h4>
                <p className="text-xs text-white/70 leading-relaxed">
                  Add your company logo! We offer premium custom embroidery and screen printing for all corporate workwear and uniforms.
                </p>
              </div>
              <Link
                to="/contact"
                onClick={() => setIsHovered(false)}
                className="inline-flex items-center justify-center gap-1.5 bg-[var(--hi-vis)] text-black text-xs font-semibold px-4 h-9 rounded-sm hover:brightness-95 transition mt-6"
              >
                Request a Quote
                <ArrowRight size={14} />
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* Mobile Drawer */}
      {open && (
        <div className="md:hidden border-t border-white/10 bg-surface text-white">
          <div className="px-4 py-3 space-y-4 max-h-[calc(100vh-4rem)] overflow-y-auto">
            {/* Mobile Search */}
            <form onSubmit={submitSearch}>
              <div className="relative">
                <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/60" />
                <input
                  value={q}
                  onChange={(e) => setQ(e.target.value)}
                  placeholder="Search products…"
                  className="w-full bg-white/10 border border-white/15 text-white placeholder:text-white/50 rounded-sm pl-9 pr-3 h-10 text-sm focus:outline-none focus:border-[var(--hi-vis)]"
                />
              </div>
            </form>

            {/* Navigation links */}
            <div className="flex flex-col text-sm divide-y divide-white/5">
              {/* Products Accordion */}
              <div className="py-1">
                <button 
                  onClick={() => setMobileProductsOpen(!mobileProductsOpen)}
                  className="w-full flex items-center justify-between py-2 text-white/90 font-semibold"
                >
                  <span className="flex items-center gap-1.5">
                    Products
                  </span>
                  <ChevronDown 
                    size={16} 
                    className={`transition-transform duration-200 ${mobileProductsOpen ? 'rotate-180 text-[var(--hi-vis)]' : 'text-white/50'}`} 
                  />
                </button>
                
                {mobileProductsOpen && (
                  <div className="pl-3 mt-1 border-l border-white/10 space-y-2 py-1">
                    {DEPARTMENTS.map((dept) => (
                      <div key={dept.name} className="py-1 space-y-1">
                        <button
                          onClick={() => toggleMobileDept(dept.name)}
                          className="w-full flex items-center justify-between py-1 text-xs uppercase tracking-wider font-bold text-white/50"
                        >
                          <span>{dept.name}</span>
                          <ChevronDown 
                            size={12} 
                            className={`transition-transform duration-200 ${expandedDepts[dept.name] ? 'rotate-180 text-[var(--hi-vis)]' : ''}`} 
                          />
                        </button>
                        
                        {expandedDepts[dept.name] && (
                          <div className="pl-2 space-y-2 flex flex-col pt-1">
                            {dept.sections.map((section) => (
                              <div key={section.title} className="space-y-1">
                                <div className="text-[10px] uppercase tracking-[0.08em] text-white/30 font-medium">
                                  {section.title}
                                </div>
                                <div className="grid grid-cols-1 gap-1 pl-1">
                                  {section.items.map((item) => (
                                    <Link
                                      key={item.slug}
                                      to="/shop"
                                      search={{ category: item.slug, q: "" }}
                                      onClick={() => setOpen(false)}
                                      className="block py-1 text-xs text-white/80 hover:text-[var(--hi-vis)] transition-colors"
                                    >
                                      {item.name}
                                    </Link>
                                  ))}
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <Link to="/about" onClick={() => setOpen(false)} className="py-3 text-white/90">About</Link>
              <Link to="/contact" onClick={() => setOpen(false)} className="py-3 text-white/90">Contact</Link>
              <Link to="/track" onClick={() => setOpen(false)} className="py-3 text-white/90">Track Order</Link>
              <Link to="/account" onClick={() => setOpen(false)} className="py-3 text-white/90">My Account</Link>
              <Link 
                to="/admin" 
                onClick={() => setOpen(false)} 
                className="py-3 text-[var(--hi-vis)] font-semibold flex items-center gap-1.5"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-[var(--hi-vis)] animate-pulse"></span>
                Admin Portal
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
