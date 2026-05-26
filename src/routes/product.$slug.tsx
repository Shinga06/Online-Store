import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useState } from "react";
import { Check, ChevronRight, Minus, Plus, ShieldCheck, Truck } from "lucide-react";
import { toast } from "sonner";
import { formatZAR } from "@/lib/catalog";
import { ProductImage } from "@/components/ProductImage";
import { ProductCard } from "@/components/ProductCard";
import { useCart } from "@/lib/cart";
import { db, type DBProduct } from "@/lib/db";
import { useDb } from "@/hooks/use-db";

export const Route = createFileRoute("/product/$slug")({
  loader: async ({ params }) => {
    const product = await db.getProduct(params.slug);
    if (!product) throw notFound();
    return { product };
  },
  component: ProductPage,
  notFoundComponent: () => (
    <div className="max-w-3xl mx-auto px-4 py-24 text-center">
      <h1 className="text-3xl font-bold">Product not found</h1>
      <p className="text-muted-foreground mt-2">It may have been discontinued.</p>
      <Link to="/shop" search={{ category: "", q: "" }} className="inline-block mt-6 text-primary font-semibold hover:underline">
        Browse the catalogue
      </Link>
    </div>
  ),
  head: ({ loaderData }) => ({
    meta: loaderData ? [
      { title: `${loaderData.product.name} — CBALCOOL` },
      { name: "description", content: loaderData.product.description },
    ] : [],
  }),
});

function ProductPage() {
  const { product: loadedProduct } = Route.useLoaderData() as { product: DBProduct };
  const { products, categories } = useDb();

  // Load from reactively-synchronized DB state to reflect real-time updates
  const product = products.find((p) => p.id === loadedProduct.id) || loadedProduct;
  const cat = categories.find((c) => c.slug === product.category);
  const related = products.filter((p) => p.category === product.category && p.id !== product.id).slice(0, 4);

  const [size, setSize] = useState(product.sizes[0] || "One Size");
  const [color, setColor] = useState(product.colors[0] || "Default");
  const [qty, setQty] = useState(1);
  const { add } = useCart();

  const handleAdd = () => {
    if (product.stock < qty) {
      toast.error("Insufficient stock available", { description: `Only ${product.stock} items left in inventory.` });
      return;
    }
    add({
      productId: product.id,
      slug: product.slug,
      name: product.name,
      price: product.price,
      size,
      color,
      qty,
    });
    toast.success("Added to cart", { description: `${product.name} · ${size} · ${color}` });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-6 md:py-10">
      {/* Breadcrumb */}
      <nav className="text-xs text-muted-foreground flex items-center gap-1 mb-6">
        <Link to="/" className="hover:text-foreground">Home</Link>
        <ChevronRight size={12} />
        <Link to="/shop" search={{ category: "", q: "" }} className="hover:text-foreground">Shop</Link>
        {cat && (
          <>
            <ChevronRight size={12} />
            <Link to="/shop" search={{ category: cat.slug, q: "" }} className="hover:text-foreground">{cat.name}</Link>
          </>
        )}
        <ChevronRight size={12} />
        <span className="text-foreground truncate">{product.name}</span>
      </nav>

      <div className="grid md:grid-cols-2 gap-8 lg:gap-12">
        {/* Image */}
        <div>
          <div className="aspect-square rounded-md overflow-hidden border border-border bg-white p-2">
            <ProductImage name={product.name} category={product.category} src={product.images?.[0]} />
          </div>
          <div className="grid grid-cols-4 gap-2 mt-2">
            {[0, 1, 2, 3].map((i) => (
              <div key={i} className="aspect-square rounded-sm overflow-hidden border border-border opacity-80 bg-white p-1">
                <ProductImage name={product.name} category={product.category} src={product.images?.[i] || product.images?.[0]} />
              </div>
            ))}
          </div>
        </div>

        {/* Info */}
        <div>
          {cat && (
            <div className="text-xs uppercase tracking-[0.2em] text-muted-foreground mb-2">{cat.name}</div>
          )}
          <h1 className="text-3xl md:text-4xl font-bold leading-tight">{product.name}</h1>
          <div className="mt-4 flex flex-wrap items-baseline gap-3">
            <span className="text-3xl font-bold">{formatZAR(product.price)}</span>
            {product.discountPrice && (
              <span className="text-lg text-muted-foreground line-through">{formatZAR(product.discountPrice)}</span>
            )}
            <span className="text-xs text-muted-foreground">VAT incl.</span>

            {/* Live Stock Indicator */}
            {product.stock === 0 ? (
              <span className="ml-2 bg-destructive/10 text-destructive text-[11px] font-bold px-2 py-0.5 rounded-sm uppercase tracking-wider">
                Out of Stock
              </span>
            ) : product.stock <= 5 ? (
              <span className="ml-2 bg-amber-500/10 text-amber-600 dark:text-amber-500 text-[11px] font-bold px-2 py-0.5 rounded-sm uppercase tracking-wider animate-pulse">
                Low Stock ({product.stock} left)
              </span>
            ) : (
              <span className="ml-2 bg-green-500/10 text-green-600 text-[11px] font-bold px-2 py-0.5 rounded-sm uppercase tracking-wider">
                In Stock ({product.stock})
              </span>
            )}
          </div>

          <p className="mt-6 text-foreground/80 leading-relaxed">{product.description}</p>

          {/* Size */}
          {product.sizes.length > 0 && product.sizes[0] !== "" && (
            <div className="mt-8">
              <div className="text-xs uppercase tracking-[0.18em] text-muted-foreground mb-2">Size</div>
              <div className="flex flex-wrap gap-2">
                {product.sizes.map((s) => (
                  <button
                    key={s}
                    onClick={() => setSize(s)}
                    className={`min-w-12 h-10 px-3 border rounded-sm text-sm font-medium ${
                      size === s ? "border-primary bg-primary text-primary-foreground" : "border-input hover:border-primary"
                    }`}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Color */}
          {product.colors.length > 0 && product.colors[0] !== "" && (
            <div className="mt-6">
              <div className="text-xs uppercase tracking-[0.18em] text-muted-foreground mb-2">Colour</div>
              <div className="flex flex-wrap gap-2">
                {product.colors.map((c) => (
                  <button
                    key={c}
                    onClick={() => setColor(c)}
                    className={`h-10 px-3 border rounded-sm text-sm font-medium ${
                      color === c ? "border-primary bg-primary text-primary-foreground" : "border-input hover:border-primary"
                    }`}
                  >
                    {c}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Qty + add */}
          <div className="mt-8 flex items-stretch gap-3">
            {product.stock > 0 ? (
              <>
                <div className="flex items-center border border-input rounded-sm">
                  <button className="h-12 w-10 grid place-items-center hover:bg-accent" onClick={() => setQty((q) => Math.max(1, q - 1))} aria-label="Decrease">
                    <Minus size={16} />
                  </button>
                  <span className="w-10 text-center font-semibold">{qty}</span>
                  <button className="h-12 w-10 grid place-items-center hover:bg-accent" onClick={() => setQty((q) => Math.min(product.stock, q + 1))} aria-label="Increase">
                    <Plus size={16} />
                  </button>
                </div>
                <button
                  onClick={handleAdd}
                  className="flex-1 h-12 px-6 bg-primary text-primary-foreground font-semibold rounded-sm hover:bg-primary/90 transition animate-fade-in"
                >
                  Add to cart
                </button>
              </>
            ) : (
              <button
                disabled
                className="flex-1 h-12 px-6 bg-secondary text-muted-foreground font-semibold rounded-sm cursor-not-allowed border border-border"
              >
                Out of Stock
              </button>
            )}
          </div>

          {/* Features */}
          <div className="mt-8 border-t border-border pt-6">
            <div className="text-xs uppercase tracking-[0.18em] text-muted-foreground mb-3">Features</div>
            <ul className="space-y-2 text-sm">
              {product.features.map((f) => (
                <li key={f} className="flex items-start gap-2">
                  <Check size={16} className="text-primary mt-0.5 shrink-0" /> {f}
                </li>
              ))}
            </ul>
          </div>

          <div className="mt-6 grid grid-cols-2 gap-3 text-xs">
            <div className="flex items-center gap-2 bg-secondary/60 rounded-sm p-3">
              <Truck size={18} className="text-primary" />
              <div>Nationwide delivery 2–4 days</div>
            </div>
            <div className="flex items-center gap-2 bg-secondary/60 rounded-sm p-3">
              <ShieldCheck size={18} className="text-primary" />
              <div>SABS / EN certified</div>
            </div>
          </div>
        </div>
      </div>

      {related.length > 0 && (
        <section className="mt-20">
          <h2 className="text-2xl font-bold mb-6">You may also like</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {related.map((p) => <ProductCard key={p.id} product={p} />)}
          </div>
        </section>
      )}
    </div>
  );
}
