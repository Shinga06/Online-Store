import { Link } from "@tanstack/react-router";
import { ProductImage } from "./ProductImage";
import { formatZAR, type Product } from "@/lib/catalog";
import { Heart } from "lucide-react";
import { useState, useEffect } from "react";
import { tracker } from "@/lib/tracker";
import { toast } from "sonner";

export function ProductCard({ product }: { product: Product }) {
  const [isWishlisted, setIsWishlisted] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const wishlistStr = localStorage.getItem("cbalcool_wishlist");
      if (wishlistStr) {
        try {
          const list = JSON.parse(wishlistStr) as string[];
          setIsWishlisted(list.includes(product.id));
        } catch {}
      }
    }
  }, [product.id]);

  const toggleWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    const wishlistStr = localStorage.getItem("cbalcool_wishlist");
    let list: string[] = [];
    if (wishlistStr) {
      try {
        list = JSON.parse(wishlistStr);
      } catch {}
    }

    const exists = list.includes(product.id);
    if (exists) {
      list = list.filter((id) => id !== product.id);
      setIsWishlisted(false);
      toast.info("Removed from Wishlist", { description: `${product.name} removed.` });
      tracker.track("Wishlist Action", {
        targetId: product.id,
        targetName: `Removed ${product.name} from Wishlist`
      });
    } else {
      list.push(product.id);
      setIsWishlisted(true);
      toast.success("Saved to Wishlist", { description: `${product.name} saved successfully.` });
      tracker.track("Wishlist Action", {
        targetId: product.id,
        targetName: `Saved ${product.name} to Wishlist`
      });
    }

    localStorage.setItem("cbalcool_wishlist", JSON.stringify(list));
    // Trigger custom event to notify other wishlist indicators if they exist
    window.dispatchEvent(new Event("cbalcool_wishlist_changed"));
  };

  return (
    <Link
      to="/product/$slug"
      params={{ slug: product.slug }}
      className="group block bg-card border border-border rounded-md overflow-hidden hover:border-primary/60 hover:shadow-lg transition-all relative"
    >
      <div className="aspect-square relative">
        <ProductImage name={product.name} category={product.category} src={(product as any).images?.[0]} />
        
        {product.badge && (
          <span className="absolute top-3 left-3 bg-[var(--hi-vis)] text-black text-[10px] uppercase tracking-wider font-bold px-2 py-1 rounded-sm z-10 shadow-xs">
            {product.badge}
          </span>
        )}

        {/* Floating Heart Button */}
        <button
          type="button"
          onClick={toggleWishlist}
          className="absolute top-3 right-3 h-8 w-8 bg-black/60 hover:bg-black/80 text-white rounded-full flex items-center justify-center transition backdrop-blur-xs border border-white/10 shadow-sm hover:scale-105 z-10 cursor-pointer"
          title={isWishlisted ? "Remove from wishlist" : "Add to wishlist"}
          aria-label={isWishlisted ? "Remove from wishlist" : "Add to wishlist"}
        >
          <Heart
            size={14}
            className={`transition-all duration-300 ${isWishlisted ? "fill-red-500 text-red-500 scale-110 animate-heart-beat" : "text-slate-200 group-hover:text-white"}`}
          />
        </button>
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
