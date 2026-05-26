import { Link } from "@tanstack/react-router";
import { ProductImage } from "./ProductImage";
import { formatZAR, type Product } from "@/lib/catalog";

export function ProductCard({ product }: { product: Product }) {
  return (
    <Link
      to="/product/$slug"
      params={{ slug: product.slug }}
      className="group block bg-card border border-border rounded-md overflow-hidden hover:border-primary/60 hover:shadow-lg transition-all"
    >
      <div className="aspect-square relative">
        <ProductImage name={product.name} category={product.category} src={(product as any).images?.[0]} />
        {product.badge && (
          <span className="absolute top-3 right-3 bg-[var(--hi-vis)] text-black text-[10px] uppercase tracking-wider font-bold px-2 py-1 rounded-sm">
            {product.badge}
          </span>
        )}
      </div>
      <div className="p-4">
        <div className="text-[10px] uppercase tracking-[0.18em] text-muted-foreground mb-1">
          {product.category.replace(/-/g, " ")}
        </div>
        <h3 className="text-sm font-semibold text-foreground line-clamp-2 group-hover:text-primary">
          {product.name}
        </h3>
        <div className="mt-2 flex items-baseline justify-between">
          <span className="text-base font-bold text-foreground">{formatZAR(product.price)}</span>
          <span className="text-xs text-muted-foreground">{product.sizes.length} sizes</span>
        </div>
      </div>
    </Link>
  );
}
