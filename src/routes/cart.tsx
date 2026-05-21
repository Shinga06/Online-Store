import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { Minus, Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { useCart, itemKey } from "@/lib/cart";
import { formatZAR } from "@/lib/catalog";
import { ProductImage } from "@/components/ProductImage";

export const Route = createFileRoute("/cart")({
  component: CartPage,
  head: () => ({
    meta: [
      { title: "Cart — SafeGear" },
      { name: "description", content: "Review your PPE & workwear order." },
    ],
  }),
});

function CartPage() {
  const { items, setQty, remove, subtotal, clear, count } = useCart();
  const [stage, setStage] = useState<"cart" | "checkout" | "done">("cart");
  const shipping = subtotal > 1500 || subtotal === 0 ? 0 : 120;
  const total = subtotal + shipping;

  if (stage === "done") {
    return (
      <div className="max-w-2xl mx-auto px-4 py-24 text-center">
        <div className="inline-flex h-14 w-14 rounded-full items-center justify-center mb-6" style={{ background: "var(--hi-vis)" }}>
          <span className="text-2xl">✓</span>
        </div>
        <h1 className="text-3xl font-bold">Order received</h1>
        <p className="text-muted-foreground mt-2">Thanks for your order. We'll email a confirmation and tracking shortly.</p>
        <Link to="/shop" search={{ category: "", q: "" }} className="inline-block mt-8 bg-primary text-primary-foreground font-semibold px-6 h-12 rounded-sm leading-[3rem]">
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
                return (
                  <div key={k} className="p-4 flex gap-4">
                    <div className="h-24 w-24 shrink-0 rounded-sm overflow-hidden border border-border">
                      <ProductImage name={item.name} category="cart" />
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
              onSubmit={() => {
                clear();
                setStage("done");
                toast.success("Order placed successfully");
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
            <button
              onClick={() => setStage("checkout")}
              className="mt-6 w-full h-12 bg-primary text-primary-foreground font-semibold rounded-sm hover:bg-primary/90"
            >
              Proceed to checkout
            </button>
          ) : (
            <button
              form="checkout-form"
              type="submit"
              className="mt-6 w-full h-12 bg-[var(--hi-vis)] text-black font-semibold rounded-sm hover:brightness-95"
            >
              Place order
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

function CheckoutForm({ onSubmit }: { onSubmit: () => void }) {
  return (
    <form
      id="checkout-form"
      className="space-y-6"
      onSubmit={(e) => { e.preventDefault(); onSubmit(); }}
    >
      <Section title="Contact">
        <Field label="Email" name="email" type="email" required />
        <Field label="Phone" name="phone" type="tel" required />
      </Section>
      <Section title="Shipping address">
        <div className="grid sm:grid-cols-2 gap-3">
          <Field label="First name" name="firstName" required />
          <Field label="Last name" name="lastName" required />
        </div>
        <Field label="Company (optional)" name="company" />
        <Field label="Street address" name="street" required />
        <div className="grid sm:grid-cols-3 gap-3">
          <Field label="Suburb" name="suburb" required />
          <Field label="City" name="city" required />
          <Field label="Postal code" name="zip" required />
        </div>
        <Field label="Province" name="province" required />
      </Section>
      <Section title="Payment">
        <p className="text-sm text-muted-foreground">
          Payment is collected on order confirmation. Our team will contact you with EFT details
          or to confirm card payment.
        </p>
      </Section>
    </form>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="border border-border rounded-md p-5">
      <div className="text-xs uppercase tracking-[0.18em] text-muted-foreground mb-4">{title}</div>
      <div className="space-y-3">{children}</div>
    </div>
  );
}

function Field({ label, ...props }: React.InputHTMLAttributes<HTMLInputElement> & { label: string }) {
  return (
    <label className="block">
      <span className="text-xs font-medium text-foreground/80">{label}</span>
      <input
        {...props}
        className="mt-1 w-full h-10 px-3 border border-input rounded-sm bg-background text-sm focus:outline-none focus:border-primary"
      />
    </label>
  );
}
