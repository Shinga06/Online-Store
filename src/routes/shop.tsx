import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { z } from "zod";
import { zodValidator, fallback } from "@tanstack/zod-adapter";
import { useDb } from "@/hooks/use-db";
import { ProductCard } from "@/components/ProductCard";
import { SlidersHorizontal, X } from "lucide-react";

const shopSearchSchema = z.object({
  category: fallback(z.string(), "").default(""),
  q: fallback(z.string(), "").default(""),
});

export const Route = createFileRoute("/shop")({
  validateSearch: zodValidator(shopSearchSchema),
  component: ShopPage,
  head: () => ({
    meta: [
      { title: "Shop PPE & Workwear — CBALCOOL" },
      { name: "description", content: "Browse the full CBALCOOL catalogue: safety footwear, hi-vis, gloves, coveralls, corporate uniforms and more." },
    ],
  }),
});

type Sort = "featured" | "price-asc" | "price-desc" | "name";

function ShopPage() {
  const { category, q } = Route.useSearch();
  const [sort, setSort] = useState<Sort>("featured");
  const [filtersOpen, setFiltersOpen] = useState(false);
  const { products, categories } = useDb();

  const searchProductsLocal = (itemsList: typeof products, queryStr: string) => {
    const s = queryStr.toLowerCase().trim();
    if (!s) return itemsList;
    return itemsList.filter(
      (p) =>
        p.name.toLowerCase().includes(s) ||
        p.description.toLowerCase().includes(s) ||
        p.category.toLowerCase().includes(s),
    );
  };

  const list = useMemo(() => {
    let items = q ? searchProductsLocal(products, q) : products;
    if (category) items = items.filter((p) => p.category === category);
    switch (sort) {
      case "price-asc": items = [...items].sort((a, b) => a.price - b.price); break;
      case "price-desc": items = [...items].sort((a, b) => b.price - a.price); break;
      case "name": items = [...items].sort((a, b) => a.name.localeCompare(b.name)); break;
      default:
        items = [...items].sort((a, b) => Number(!!b.featured) - Number(!!a.featured));
    }
    return items;
  }, [products, category, q, sort]);

  const activeCat = categories.find((c) => c.slug === category);

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 md:py-12">
      <div className="mb-6">
        <div className="text-xs uppercase tracking-[0.2em] text-muted-foreground mb-2">
          {q ? `Search results` : activeCat ? "Category" : "Catalogue"}
        </div>
        <h1 className="text-3xl md:text-4xl font-bold">
          {q ? `Results for "${q}"` : activeCat ? activeCat.name : "All products"}
        </h1>
        {activeCat && <p className="text-muted-foreground mt-2 max-w-2xl">{activeCat.blurb}</p>}
      </div>

      <div className="flex items-center justify-between gap-3 mb-6 border-y border-border py-3">
        <button
          className="md:hidden inline-flex items-center gap-2 text-sm font-medium"
          onClick={() => setFiltersOpen(true)}
        >
          <SlidersHorizontal size={16} /> Filters
        </button>
        <div className="text-sm text-muted-foreground hidden md:block">
          {list.length} product{list.length === 1 ? "" : "s"}
        </div>
        <div className="flex items-center gap-2 ml-auto">
          <label className="text-xs uppercase tracking-wider text-muted-foreground">Sort</label>
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value as Sort)}
            className="h-9 text-sm border border-input rounded-sm bg-background px-2"
          >
            <option value="featured">Featured</option>
            <option value="price-asc">Price · Low to High</option>
            <option value="price-desc">Price · High to Low</option>
            <option value="name">Name (A–Z)</option>
          </select>
        </div>
      </div>

      <div className="grid md:grid-cols-[240px_1fr] gap-8">
        {/* Sidebar */}
        <aside className="hidden md:block">
          <FilterList currentCategory={category} currentQ={q} />
        </aside>

        {/* Mobile drawer */}
        {filtersOpen && (
          <div className="fixed inset-0 z-50 md:hidden">
            <div className="absolute inset-0 bg-black/50" onClick={() => setFiltersOpen(false)} />
            <div className="absolute right-0 top-0 bottom-0 w-[85%] max-w-sm bg-background p-5 overflow-y-auto">
              <div className="flex items-center justify-between mb-4">
                <div className="font-semibold">Filters</div>
                <button onClick={() => setFiltersOpen(false)}><X size={20} /></button>
              </div>
              <FilterList currentCategory={category} currentQ={q} onPick={() => setFiltersOpen(false)} />
            </div>
          </div>
        )}

        {/* Results */}
        <div>
          {list.length === 0 ? (
            <div className="border border-dashed border-border rounded-md p-12 text-center">
              <div className="text-lg font-semibold">No products found</div>
              <p className="text-muted-foreground text-sm mt-1">Try clearing filters or searching another term.</p>
              <Link to="/shop" search={{ category: "", q: "" }} className="inline-block mt-4 text-sm font-semibold text-primary hover:underline">
                Reset filters
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
              {list.map((p) => <ProductCard key={p.id} product={p} />)}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

const DEPARTMENTS = [
  {
    name: "Workwear",
    items: [
      { name: "Corporate Wear", slug: "corporate-wear" },
      { name: "Chef Wear", slug: "chef-wear" },
      { name: "Hi-Visibility", slug: "hi-vis" },
      { name: "Rain Suits", slug: "rain-suits" },
      { name: "Aprons", slug: "aprons" },
      { name: "Conti Suits", slug: "conti-suits" },
      { name: "Security Wear", slug: "security-wear" },
      { name: "Service & Beauty", slug: "service-beauty" },
    ]
  },
  {
    name: "Apparel",
    items: [
      { name: "Shirts", slug: "shirts" },
      { name: "Golfers", slug: "golfers" },
      { name: "Jackets", slug: "jackets" },
      { name: "Shorts", slug: "shorts" },
      { name: "Trousers", slug: "trousers" },
      { name: "Fleece Jackets", slug: "fleece-jackets" },
      { name: "Body Warmers", slug: "body-warmers" },
    ]
  },
  {
    name: "PPE & Safety",
    items: [
      { name: "Safety Footwear", slug: "safety-footwear" },
      { name: "Hi-Visibility", slug: "hi-vis" },
      { name: "Protective Gloves", slug: "gloves" },
      { name: "Face Protection", slug: "face-protection" },
      { name: "Coveralls", slug: "coveralls" },
      { name: "Gumboots", slug: "gumboots" },
      { name: "Sneakers", slug: "sneakers" },
    ]
  },
  {
    name: "Accessories",
    items: [
      { name: "Headwear", slug: "headwear" },
      { name: "Men's Footwear", slug: "mens-footwear" },
      { name: "Ladies Footwear", slug: "ladies-footwear" },
    ]
  }
];

function FilterList({
  currentCategory,
  currentQ,
  onPick,
}: {
  currentCategory: string;
  currentQ: string;
  onPick?: () => void;
}) {
  const { categories } = useDb();

  // Find any category that might not be mapped in DEPARTMENTS to ensure 100% coverage
  const mappedSlugs = new Set(DEPARTMENTS.flatMap(d => d.items.map(i => i.slug)));
  const unmappedCategories = categories.filter(c => !mappedSlugs.has(c.slug));

  return (
    <div className="space-y-6">
      <div>
        <ul className="text-sm">
          <li>
            <Link
              to="/shop"
              search={{ category: "", q: currentQ }}
              onClick={onPick}
              className={`block py-2 px-3 rounded-sm font-semibold tracking-wide border transition-all ${
                currentCategory === "" 
                  ? "bg-primary text-primary-foreground border-primary" 
                  : "border-border hover:bg-accent text-foreground"
              }`}
            >
              All products
            </Link>
          </li>
        </ul>
      </div>

      {DEPARTMENTS.map((dept) => {
        // Only render the department if it has categories present in the database
        const deptCategories = dept.items.filter(item => 
          categories.some(cat => cat.slug === item.slug)
        );

        if (deptCategories.length === 0) return null;

        return (
          <div key={dept.name} className="space-y-2 border-b border-border/60 pb-4 last:border-0 last:pb-0">
            <h3 className="text-xs uppercase tracking-wider font-bold text-muted-foreground">
              {dept.name}
            </h3>
            <ul className="space-y-1 pl-1">
              {deptCategories.map((c) => {
                // Find matching DB name just in case the admin edited it
                const dbCat = categories.find(cat => cat.slug === c.slug);
                const displayName = dbCat ? dbCat.name : c.name;

                return (
                  <li key={c.slug}>
                    <Link
                      to="/shop"
                      search={{ category: c.slug, q: currentQ }}
                      onClick={onPick}
                      className={`block py-1.5 px-2 rounded-sm text-sm transition-all ${
                        currentCategory === c.slug 
                          ? "font-semibold text-primary pl-3 border-l-2 border-primary bg-primary/5" 
                          : "text-muted-foreground hover:text-foreground hover:bg-accent/40"
                      }`}
                    >
                      {displayName}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        );
      })}

      {/* Render unmapped categories at the bottom as a safeguard */}
      {unmappedCategories.length > 0 && (
        <div className="space-y-2 pt-2">
          <h3 className="text-xs uppercase tracking-wider font-bold text-muted-foreground">
            Other Equipment
          </h3>
          <ul className="space-y-1 pl-1">
            {unmappedCategories.map((c) => (
              <li key={c.slug}>
                <Link
                  to="/shop"
                  search={{ category: c.slug, q: currentQ }}
                  onClick={onPick}
                  className={`block py-1.5 px-2 rounded-sm text-sm transition-all ${
                    currentCategory === c.slug 
                      ? "font-semibold text-primary pl-3 border-l-2 border-primary bg-primary/5" 
                      : "text-muted-foreground hover:text-foreground hover:bg-accent/40"
                  }`}
                >
                  {c.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
