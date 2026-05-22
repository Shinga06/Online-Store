import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { Minus, Plus, Trash2, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { useCart, itemKey } from "@/lib/cart";
import { formatZAR } from "@/lib/catalog";
import { ProductImage } from "@/components/ProductImage";
import { db } from "@/lib/db";
import { useDb } from "@/hooks/use-db";

export const Route = createFileRoute("/cart")({
  component: CartPage,
  head: () => ({
    meta: [
      { title: "Cart — CBALCOOL" },
      { name: "description", content: "Review your PPE & workwear order." },
    ],
  }),
});

function CartPage() {
  const { items, setQty, remove, subtotal, clear, count } = useCart();
  const { products } = useDb();
  const [stage, setStage] = useState<"cart" | "checkout" | "done">("cart");
  const [orderId, setOrderId] = useState("");
  const shipping = subtotal > 1500 || subtotal === 0 ? 0 : 120;
  const total = subtotal + shipping;

  if (stage === "done") {
    return (
      <div className="max-w-2xl mx-auto px-4 py-24 text-center animate-fade-in">
        <div className="inline-flex h-14 w-14 rounded-full items-center justify-center mb-6 font-bold" style={{ background: "var(--hi-vis)", color: "black" }}>
          ✓
        </div>
        <h1 className="text-3xl font-bold">Order received</h1>
        <p className="text-primary font-bold text-lg mt-3">Invoice Number: {orderId}</p>
        <p className="text-muted-foreground mt-2 max-w-md mx-auto">
          Thanks for your order! Your request has been sent to our sales desk. We've updated the admin registry and reduced inventory counts. We'll email your VAT invoice shortly.
        </p>
        <Link to="/shop" search={{ category: "", q: "" }} className="inline-block mt-8 bg-primary text-primary-foreground font-semibold px-6 h-12 rounded-sm leading-[3rem] hover:bg-primary/90">
          Continue shopping
        </Link>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-24 text-center">
        <h1 className="text-3xl font-bold">Your cart is empty</h1>
        <p className="text-muted-foreground mt-2">Add some gear to get started.</p>
        <Link to="/shop" search={{ category: "", q: "" }} className="inline-block mt-8 bg-primary text-primary-foreground font-semibold px-6 h-12 rounded-sm leading-[3rem]">
          Browse products
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-10">
      <h1 className="text-3xl md:text-4xl font-bold mb-8">
        {stage === "cart" ? `Cart (${count})` : "Checkout"}
      </h1>

      <div className="grid lg:grid-cols-[1fr_380px] gap-10">
        {/* LEFT */}
        <div>
          {stage === "cart" ? (
            <div className="border border-border rounded-md divide-y divide-border">
              {items.map((item) => {
                const k = itemKey(item);
                const dbProd = products.find((p) => p.id === item.productId);
                return (
                  <div key={k} className="p-4 flex gap-4">
                    <div className="h-24 w-24 shrink-0 rounded-sm overflow-hidden border border-border">
                      <ProductImage name={item.name} category="cart" src={dbProd?.images?.[0]} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <Link to="/product/$slug" params={{ slug: item.slug }} className="font-semibold hover:text-primary line-clamp-2">
                        {item.name}
                      </Link>
                      <div className="text-xs text-muted-foreground mt-1">
                        Size {item.size} · {item.color}
                      </div>
                      <div className="mt-3 flex items-center gap-3">
                        <div className="flex items-center border border-input rounded-sm">
                          <button className="h-9 w-9 grid place-items-center hover:bg-accent" onClick={() => setQty(k, item.qty - 1)}>
                            <Minus size={14} />
                          </button>
                          <span className="w-8 text-center text-sm font-semibold">{item.qty}</span>
                          <button className="h-9 w-9 grid place-items-center hover:bg-accent" onClick={() => setQty(k, item.qty + 1)}>
                            <Plus size={14} />
                          </button>
                        </div>
                        <button onClick={() => remove(k)} className="text-muted-foreground hover:text-destructive inline-flex items-center gap-1 text-sm">
                          <Trash2 size={14} /> Remove
                        </button>
                      </div>
                    </div>
                    <div className="text-right font-semibold">{formatZAR(item.price * item.qty)}</div>
                  </div>
                );
              })}
            </div>
          ) : (
            <CheckoutForm
              onSubmit={(generatedId) => {
                setOrderId(generatedId);
                clear();
                setStage("done");
                toast.success("Order placed successfully!", { description: `Invoice reference: ${generatedId}` });
              }}
            />
          )}
        </div>

        {/* RIGHT — summary */}
        <aside className="border border-border rounded-md p-6 h-fit bg-secondary/40 sticky top-24">
          <div className="text-xs uppercase tracking-[0.18em] text-muted-foreground mb-3">Order summary</div>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between"><span>Subtotal</span><span>{formatZAR(subtotal)}</span></div>
            <div className="flex justify-between"><span>Shipping</span><span>{shipping === 0 ? "Free" : formatZAR(shipping)}</span></div>
          </div>
          <div className="border-t border-border my-4" />
          <div className="flex justify-between text-base font-bold">
            <span>Total</span><span>{formatZAR(total)}</span>
          </div>
          <div className="text-xs text-muted-foreground mt-1">VAT included · ZAR</div>
          {stage === "cart" ? (
            <Link
              to="/checkout"
              className="mt-6 w-full h-12 bg-primary text-primary-foreground font-semibold rounded-sm hover:bg-primary/90 transition cursor-pointer flex items-center justify-center"
            >
              Proceed to checkout
            </Link>
          ) : (
            <button
              form="checkout-form"
              type="submit"
              className="mt-6 w-full h-12 bg-[var(--hi-vis)] text-black font-semibold rounded-sm hover:brightness-95 transition cursor-pointer flex items-center justify-center gap-2"
            >
              Confirm & Place Order
            </button>
          )}
          <p className="text-[11px] text-muted-foreground mt-3">
            Free delivery on orders over R1,500.
          </p>
        </aside>
      </div>
    </div>
  );
}

function CheckoutForm({ onSubmit }: { onSubmit: (orderId: string) => void }) {
  const { items } = useCart();
  const { products } = useDb();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (loading) return;
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    const email = formData.get("email") as string;
    const phone = formData.get("phone") as string;
    const firstName = formData.get("firstName") as string;
    const lastName = formData.get("lastName") as string;
    const company = formData.get("company") as string;
    const street = formData.get("street") as string;
    const suburb = formData.get("suburb") as string;
    const city = formData.get("city") as string;
    const zip = formData.get("zip") as string;
    const province = formData.get("province") as string;

    const customerName = `${firstName} ${lastName}`;
    const deliveryAddress = `${street}, ${suburb}, ${city}, ${province}, ${zip}${company ? ` (${company})` : ""}`;

    // Verify stock availability on place order
    for (const item of items) {
      const dbProd = products.find((p) => p.id === item.productId);
      if (!dbProd) {
        toast.error(`Product "${item.name}" is no longer available.`);
        setLoading(false);
        return;
      }
      if (dbProd.stock < item.qty) {
        toast.error(`Insufficient stock for "${item.name}"`, {
          description: `Only ${dbProd.stock} items remaining. Please decrease your quantity in the cart.`,
        });
        setLoading(false);
        return;
      }
    }

    try {
      const newOrder = await db.placeOrder({
        customerName,
        customerEmail: email,
        customerPhone: phone,
        deliveryAddress,
        items: items.map((i) => ({
          productId: i.productId,
          name: i.name,
          qty: i.qty,
          price: i.price,
          size: i.size,
          color: i.color,
        })),
        status: "Pending",
      });

      setLoading(false);
      onSubmit(newOrder.id);
    } catch (err) {
      console.error(err);
      toast.error("An error occurred while placing your order. Please try again.");
      setLoading(false);
    }
  };

  return (
    <form
      id="checkout-form"
      className="space-y-6"
      onSubmit={handleSubmit}
    >
      {loading && (
        <div className="fixed inset-0 z-50 bg-background/50 flex items-center justify-center backdrop-blur-xs">
          <div className="bg-card border border-border p-5 rounded-md flex flex-col items-center gap-3">
            <Loader2 className="animate-spin text-primary" size={32} />
            <span className="text-sm font-semibold">Processing your order...</span>
          </div>
        </div>
      )}

      <Section title="Contact Info">
        <div className="grid sm:grid-cols-2 gap-3">
          <Field label="Email" name="email" type="email" placeholder="e.g. thabo@builders-za.com" required />
          <Field label="Phone" name="phone" type="tel" placeholder="e.g. +27 82 555 0192" required />
        </div>
      </Section>
      <Section title="Shipping address">
        <div className="grid sm:grid-cols-2 gap-3">
          <Field label="First name" name="firstName" required />
          <Field label="Last name" name="lastName" required />
        </div>
        <Field label="Company (optional)" name="company" placeholder="e.g. Acme Construction" />
        <Field label="Street address" name="street" placeholder="e.g. 12 Witkoppen Road" required />
        <div className="grid sm:grid-cols-3 gap-3">
          <Field label="Suburb" name="suburb" placeholder="e.g. Fourways" required />
          <Field label="City" name="city" placeholder="e.g. Johannesburg" required />
          <Field label="Postal code" name="zip" placeholder="e.g. 2055" required />
        </div>
        <Field label="Province" name="province" placeholder="e.g. Gauteng" required />
      </Section>
      <Section title="Payment Details">
        <p className="text-sm text-muted-foreground leading-relaxed">
          <strong>Direct Account Transfer / COD:</strong> Your booking is secured immediately on submission. We will generate your official tax invoice, and our industrial sales desk will get in touch with you shortly to confirm credit/EFT accounts or card payment processing.
        </p>
      </Section>
    </form>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="border border-border rounded-md p-5 bg-card">
      <div className="text-xs uppercase tracking-[0.18em] text-muted-foreground mb-4 font-semibold">{title}</div>
      <div className="space-y-3">{children}</div>
    </div>
  );
}

function Field({ label, ...props }: React.InputHTMLAttributes<HTMLInputElement> & { label: string }) {
  return (
    <label className="block">
      <span className="text-xs font-semibold text-foreground/80">{label}</span>
      <input
        {...props}
        className="mt-1 w-full h-10 px-3 border border-input rounded-sm bg-background text-sm focus:outline-none focus:border-primary placeholder:text-muted-foreground/60 focus:ring-1 focus:ring-primary"
      />
    </label>
  );
}
