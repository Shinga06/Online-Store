import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { 
  CreditCard, 
  FileText, 
  ClipboardList, 
  CheckCircle2, 
  ArrowRight, 
  Lock, 
  ShieldCheck, 
  Award, 
  Truck, 
  Info, 
  Calendar, 
  Building2, 
  Sparkles, 
  Loader2, 
  ChevronLeft,
  DollarSign,
  AlertCircle
} from "lucide-react";
import { toast } from "sonner";
import { useCart, itemKey } from "@/lib/cart";
import { formatZAR } from "@/lib/catalog";
import { ProductImage } from "@/components/ProductImage";
import { db } from "@/lib/db";
import { useDb } from "@/hooks/use-db";

export const Route = createFileRoute("/checkout")({
  component: CheckoutPage,
  head: () => ({
    meta: [
      { title: "Secure Checkout — SafeGear" },
      { name: "description", content: "Complete your PPE & workwear purchase or submit a bulk quotation request safely." },
    ],
  }),
});

type Step = "payment-method" | "details" | "process" | "done";
type PaymentMethodType = "Pay Now" | "Pay on Invoice" | "Request Quote";

function CheckoutPage() {
  const { items, subtotal, clear, count } = useCart();
  const { products } = useDb();
  const navigate = useNavigate();

  // Wizard state
  const [step, setStep] = useState<Step>("payment-method");
  const [selectedMethod, setSelectedMethod] = useState<PaymentMethodType>("Pay Now");
  const [orderId, setOrderId] = useState("");
  const [loading, setLoading] = useState(false);

  // Form State
  const [formState, setFormState] = useState({
    email: "",
    phone: "",
    firstName: "",
    lastName: "",
    company: "",
    street: "",
    suburb: "",
    city: "",
    zip: "",
    province: "Gauteng",
    // B2B Extras
    vatNumber: "",
    poNumber: "",
    // Quote Extras
    branding: "None",
    urgencyDate: "",
    specs: "",
  });

  // Credit Card Simulation State
  const [cardState, setCardState] = useState({
    number: "",
    name: "",
    expiry: "",
    cvv: "",
    focused: "",
  });

  const shipping = subtotal > 1500 || subtotal === 0 ? 0 : 120;
  const total = subtotal + shipping;

  // Page guard: redirect if cart empty (unless already done)
  useEffect(() => {
    if (items.length === 0 && step !== "done") {
      toast.error("Your cart is empty. Please add items before checking out.");
      navigate({ to: "/shop" });
    }
  }, [items, navigate, step]);

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormState((prev) => ({ ...prev, [name]: value }));
  };

  const handleCardChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let { name, value } = e.target;
    if (name === "number") {
      value = value.replace(/\s?/g, "").replace(/(\d{4})/g, "$1 ").trim().substring(0, 19);
    } else if (name === "expiry") {
      value = value.replace(/\//g, "").replace(/(\d{2})/g, "$1/").trim().substring(0, 5);
      if (value.endsWith("/")) value = value.slice(0, -1);
    } else if (name === "cvv") {
      value = value.replace(/\D/g, "").substring(0, 3);
    }
    setCardState((prev) => ({ ...prev, [name]: value }));
  };

  const handleNextStep = (e: React.FormEvent) => {
    e.preventDefault();
    if (step === "payment-method") {
      setStep("details");
      window.scrollTo({ top: 0, behavior: "smooth" });
    } else if (step === "details") {
      // Validate step 2 fields
      if (!formState.email || !formState.phone || !formState.firstName || !formState.lastName || !formState.street || !formState.suburb || !formState.city || !formState.zip) {
        toast.error("Please fill in all required customer details.");
        return;
      }
      if (selectedMethod === "Pay on Invoice" && !formState.company) {
        toast.error("Company Name is required for Invoice payments.");
        return;
      }
      setStep("process");
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const handlePrevStep = () => {
    if (step === "details") setStep("payment-method");
    else if (step === "process") setStep("details");
  };

  const handlePlaceOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (loading) return;
    setLoading(true);

    // Verify stock availability
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
      // Structure billing/delivery metadata
      const customerName = `${formState.firstName} ${formState.lastName}`;
      const deliveryAddress = `${formState.street}, ${formState.suburb}, ${formState.city}, ${formState.province}, ${formState.zip}${formState.company ? ` (${formState.company})` : ""}`;

      const paymentMetadata = {
        customerName,
        customerEmail: formState.email,
        customerPhone: formState.phone,
        deliveryAddress,
        paymentMethod: selectedMethod,
        items: items.map((i) => ({
          productId: i.productId,
          name: i.name,
          qty: i.qty,
          price: i.price,
          size: i.size,
          color: i.color,
        })),
        status: "Pending" as const,
        isQuote: selectedMethod === "Request Quote",
        // Invoice metadata
        companyName: formState.company || undefined,
        vatNumber: formState.vatNumber || undefined,
        poNumber: formState.poNumber || undefined,
        // Quote metadata
        brandingReqs: selectedMethod === "Request Quote" ? formState.branding : undefined,
        urgencyDate: selectedMethod === "Request Quote" ? formState.urgencyDate : undefined,
        quoteNotes: selectedMethod === "Request Quote" ? formState.specs : undefined,
      };

      const newOrder = await db.placeOrder(paymentMetadata);

      setOrderId(newOrder.id);
      setLoading(false);
      clear(); // Reset items in cart

      // Cache completed reference in localStorage for Account Dashboard
      if (typeof window !== "undefined") {
        try {
          const cachedStr = localStorage.getItem("safegear_recent_checkouts") || "[]";
          const cachedList = JSON.parse(cachedStr);
          if (Array.isArray(cachedList)) {
            // Avoid duplicate additions
            if (!cachedList.some(item => item.id === newOrder.id)) {
              cachedList.unshift({ id: newOrder.id, email: formState.email });
              localStorage.setItem("safegear_recent_checkouts", JSON.stringify(cachedList));
            }
          }
        } catch (e) {
          console.warn("Failed to cache order reference in localStorage", e);
        }
      }

      setStep("done");
      
      const text = selectedMethod === "Request Quote" 
        ? "Quote request submitted successfully!" 
        : "Order placed successfully!";
      toast.success(text, { description: `Reference Code: ${newOrder.id}` });
    } catch (err) {
      console.error(err);
      toast.error("An error occurred while processing checkout. Please try again.");
      setLoading(false);
    }
  };

  // Step names
  const steps = [
    { id: "payment-method", label: "Payment Method" },
    { id: "details", label: "Delivery Info" },
    { id: "process", label: "Secure Payment" },
  ];

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 py-10 font-sans">
      <div className="max-w-7xl mx-auto px-4">
        
        {/* Progress Bar (Stepper) */}
        {step !== "done" && (
          <div className="mb-10 max-w-4xl mx-auto">
            <div className="flex items-center justify-between relative">
              <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-slate-200 dark:bg-slate-800 -translate-y-1/2 -z-10" />
              {steps.map((s, idx) => {
                const isCompleted = steps.findIndex((x) => x.id === step) > idx;
                const isActive = s.id === step;
                
                return (
                  <div key={s.id} className="flex flex-col items-center bg-slate-50 dark:bg-slate-900 px-4">
                    <div 
                      className={`h-10 w-10 rounded-full flex items-center justify-center font-bold text-sm border-2 transition-all duration-300 ${
                        isCompleted 
                          ? "bg-slate-900 border-slate-900 text-white dark:bg-white dark:border-white dark:text-black" 
                          : isActive 
                            ? "bg-[var(--hi-vis)] border-[var(--hi-vis)] text-black shadow-md ring-4 ring-yellow-500/10" 
                            : "bg-white border-slate-200 text-slate-400 dark:bg-slate-850 dark:border-slate-800"
                      }`}
                    >
                      {isCompleted ? "✓" : idx + 1}
                    </div>
                    <span 
                      className={`text-xs font-bold mt-2 uppercase tracking-wider transition-colors duration-300 ${
                        isActive 
                          ? "text-slate-900 dark:text-white" 
                          : "text-slate-400 dark:text-slate-500"
                      }`}
                    >
                      {s.label}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* DONE / SUCCESS STATE */}
        {step === "done" && (
          <div className="max-w-2xl mx-auto bg-white dark:bg-slate-850 border border-slate-200 dark:border-slate-800 rounded-md p-8 text-center shadow-lg animate-fade-in py-16">
            <div 
              className="inline-flex h-16 w-16 rounded-full items-center justify-center mb-6 font-bold text-2xl text-black shadow-inner" 
              style={{ background: "var(--hi-vis)" }}
            >
              ✓
            </div>
            
            <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
              {selectedMethod === "Request Quote" ? "Quote Request Submitted" : "Payment Authorized"}
            </h1>
            
            <p className="text-primary font-bold text-lg mt-3 dark:text-[var(--hi-vis)]">
              Reference Code: {orderId}
            </p>

            {selectedMethod === "Pay Now" && (
              <p className="text-muted-foreground mt-4 max-w-md mx-auto text-sm leading-relaxed">
                Thank you! Your secure payment has been verified. We have updated our admin fulfillment registries and allocated your SABS safety inventory. Your order is now officially marked as <strong>Processing</strong>.
              </p>
            )}

            {selectedMethod === "Pay on Invoice" && (
              <div className="mt-6 max-w-md mx-auto border border-border bg-slate-50 dark:bg-slate-900/60 p-5 rounded-md text-left text-sm space-y-3">
                <p className="font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5 border-b pb-2">
                  <Building2 size={16} className="text-primary dark:text-yellow-400" /> B2B Account Credit Billing
                </p>
                <p className="text-slate-600 dark:text-slate-400 leading-normal">
                  An official SafeGear VAT Tax Invoice has been generated for <strong>{formState.company}</strong>. 
                </p>
                <div className="text-xs text-muted-foreground bg-white dark:bg-slate-950 p-3 rounded-sm border space-y-1">
                  <p><strong>Bank:</strong> First National Bank (FNB)</p>
                  <p><strong>Branch:</strong> 250655 · <strong>Account:</strong> 62013948194</p>
                  <p><strong>PO Reference:</strong> {formState.poNumber || "Direct EFT"}</p>
                </div>
                <p className="text-xs text-slate-500 leading-normal italic">
                  Our corporate finance team will contact you within one business hour to finalize credit verification.
                </p>
              </div>
            )}

            {selectedMethod === "Request Quote" && (
              <div className="mt-6 max-w-md mx-auto border border-border bg-slate-50 dark:bg-slate-900/60 p-5 rounded-md text-left text-sm space-y-3">
                <p className="font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5 border-b pb-2">
                  <ClipboardList size={16} className="text-[var(--hi-vis)]" /> Bulk Procurement Request
                </p>
                <p className="text-slate-600 dark:text-slate-400 leading-normal">
                  Your customized quotation request has been successfully routed to the **SafeGear Bulk Tendering Desk**.
                </p>
                <p className="text-slate-500 text-xs leading-normal">
                  A certified industrial apparel consultant will formulate your bulk discount and branded clothing specs. A comprehensive PDF quotation will be sent to <strong>{formState.email}</strong> shortly.
                </p>
              </div>
            )}

            <div className="mt-8 flex flex-col sm:flex-row justify-center gap-3">
              <Link 
                to="/track" 
                search={{ orderId: orderId }}
                className="bg-[var(--hi-vis)] hover:brightness-110 text-black font-extrabold px-6 h-12 rounded-sm inline-flex items-center justify-center transition cursor-pointer gap-2 shadow-sm"
              >
                Track Your SABS Shipment
              </Link>
              <Link 
                to="/shop" 
                search={{ category: "", q: "" }} 
                className="bg-primary hover:bg-primary/90 text-primary-foreground font-semibold px-6 h-12 rounded-sm inline-flex items-center justify-center transition cursor-pointer"
              >
                Back to Shop
              </Link>
              <Link 
                to="/admin" 
                className="border border-input hover:bg-accent text-foreground font-semibold px-6 h-12 rounded-sm inline-flex items-center justify-center transition cursor-pointer"
              >
                Audit in Admin Dashboard
              </Link>
            </div>
          </div>
        )}

        {/* WIZARD LAYOUT */}
        {step !== "done" && (
          <div className="grid lg:grid-cols-[1fr_380px] gap-10 items-start">
            
            {/* WIZARD LEFT MAIN AREA */}
            <div className="bg-white dark:bg-slate-850 border border-slate-200 dark:border-slate-800 rounded-md p-6 shadow-sm">
              <h1 className="text-2xl md:text-3xl font-bold text-slate-950 dark:text-white tracking-tight border-b pb-4 mb-6">
                {step === "payment-method" && "Choose Payment Method"}
                {step === "details" && "Customer & Billing Details"}
                {step === "process" && "Confirm & Authorize Order"}
              </h1>

              {/* STEP 1: CHOOSE PAYMENT METHOD */}
              {step === "payment-method" && (
                <div className="space-y-6">
                  <p className="text-sm text-muted-foreground">
                    Select a payment option suited for your procurement. SafeGear offers secure immediate payments, dedicated corporate invoice accounts, and wholesale tender bids.
                  </p>
                  
                  <div className="grid gap-4">
                    {/* Pay Now Option */}
                    <div 
                      onClick={() => setSelectedMethod("Pay Now")}
                      className={`border-2 rounded-md p-5 flex gap-4 cursor-pointer transition-all duration-200 group relative ${
                        selectedMethod === "Pay Now" 
                          ? "border-[var(--hi-vis)] bg-slate-50/50 dark:bg-slate-900/10 shadow-xs" 
                          : "border-slate-200 dark:border-slate-800 hover:border-slate-400 hover:bg-slate-50/20"
                      }`}
                    >
                      <div className="mt-1 flex items-center justify-center shrink-0">
                        <div className={`h-5 w-5 rounded-full border-2 flex items-center justify-center ${
                          selectedMethod === "Pay Now" 
                            ? "border-primary bg-primary dark:border-white dark:bg-white" 
                            : "border-slate-350 dark:border-slate-700"
                        }`}>
                          {selectedMethod === "Pay Now" && (
                            <div className="h-1.5 w-1.5 rounded-full bg-white dark:bg-black" />
                          )}
                        </div>
                      </div>
                      
                      <div className="flex-1 space-y-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <h3 className="font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                            <CreditCard size={18} className="text-primary dark:text-yellow-400" /> Pay Now (Card / Instant EFT)
                          </h3>
                          <span className="text-[10px] font-bold bg-green-500/15 text-green-700 dark:text-green-400 px-2 py-0.5 rounded-full uppercase tracking-wider">
                            Best for Fast Shipping
                          </span>
                        </div>
                        <p className="text-xs text-muted-foreground leading-relaxed pr-4">
                          Secure instant online processing via local payment gateways. We accept Visa, Mastercard, and Instant EFT. Orders are dispatched immediately after authorization is verified.
                        </p>
                        <div className="pt-2 flex items-center gap-2 grayscale brightness-90 group-hover:grayscale-0 transition duration-300">
                          <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Accepted:</span>
                          <span className="text-xs bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded font-mono font-bold text-slate-600 dark:text-slate-300 border border-slate-250/30">Visa</span>
                          <span className="text-xs bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded font-mono font-bold text-slate-600 dark:text-slate-300 border border-slate-250/30">Mastercard</span>
                          <span className="text-xs bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded font-mono font-bold text-slate-600 dark:text-slate-300 border border-slate-250/30">Instant EFT</span>
                        </div>
                      </div>
                    </div>

                    {/* Pay on Invoice Option */}
                    <div 
                      onClick={() => setSelectedMethod("Pay on Invoice")}
                      className={`border-2 rounded-md p-5 flex gap-4 cursor-pointer transition-all duration-200 group relative ${
                        selectedMethod === "Pay on Invoice" 
                          ? "border-[var(--hi-vis)] bg-slate-50/50 dark:bg-slate-900/10 shadow-xs" 
                          : "border-slate-200 dark:border-slate-800 hover:border-slate-400 hover:bg-slate-50/20"
                      }`}
                    >
                      <div className="mt-1 flex items-center justify-center shrink-0">
                        <div className={`h-5 w-5 rounded-full border-2 flex items-center justify-center ${
                          selectedMethod === "Pay on Invoice" 
                            ? "border-primary bg-primary dark:border-white dark:bg-white" 
                            : "border-slate-350 dark:border-slate-700"
                        }`}>
                          {selectedMethod === "Pay on Invoice" && (
                            <div className="h-1.5 w-1.5 rounded-full bg-white dark:bg-black" />
                          )}
                        </div>
                      </div>
                      
                      <div className="flex-1 space-y-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <h3 className="font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                            <Building2 size={18} className="text-primary dark:text-yellow-400" /> Pay on Invoice (B2B Credit Account)
                          </h3>
                          <span className="text-[10px] font-bold bg-blue-500/15 text-blue-700 dark:text-blue-400 px-2 py-0.5 rounded-full uppercase tracking-wider">
                            Corporate Accounts
                          </span>
                        </div>
                        <p className="text-xs text-muted-foreground leading-relaxed pr-4">
                          Available for registered business buyers and trade clients. The checkout immediately files a SABS VAT invoice, and our industrial team confirms payment terms (Net-30 / direct EFT deposits) to initiate packing.
                        </p>
                        <div className="pt-2 flex items-center gap-2">
                          <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">B2B Perks:</span>
                          <span className="text-[10px] bg-slate-100 dark:bg-slate-850 px-2 py-0.5 rounded text-slate-600 dark:text-slate-450 border border-slate-250/20">Tax Invoicing</span>
                          <span className="text-[10px] bg-slate-100 dark:bg-slate-850 px-2 py-0.5 rounded text-slate-600 dark:text-slate-450 border border-slate-250/20">Net-30 Settlement</span>
                        </div>
                      </div>
                    </div>

                    {/* Request Quote Option */}
                    <div 
                      onClick={() => setSelectedMethod("Request Quote")}
                      className={`border-2 rounded-md p-5 flex gap-4 cursor-pointer transition-all duration-200 group relative ${
                        selectedMethod === "Request Quote" 
                          ? "border-[var(--hi-vis)] bg-slate-50/50 dark:bg-slate-900/10 shadow-xs" 
                          : "border-slate-200 dark:border-slate-800 hover:border-slate-400 hover:bg-slate-50/20"
                      }`}
                    >
                      <div className="mt-1 flex items-center justify-center shrink-0">
                        <div className={`h-5 w-5 rounded-full border-2 flex items-center justify-center ${
                          selectedMethod === "Request Quote" 
                            ? "border-primary bg-primary dark:border-white dark:bg-white" 
                            : "border-slate-350 dark:border-slate-700"
                        }`}>
                          {selectedMethod === "Request Quote" && (
                            <div className="h-1.5 w-1.5 rounded-full bg-white dark:bg-black" />
                          )}
                        </div>
                      </div>
                      
                      <div className="flex-1 space-y-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <h3 className="font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                            <ClipboardList size={18} className="text-primary dark:text-yellow-400" /> Request Quote (Bulk / Uniform Specs)
                          </h3>
                          <span className="text-[10px] font-bold bg-amber-500/15 text-amber-700 dark:text-amber-400 px-2 py-0.5 rounded-full uppercase tracking-wider">
                            Bulk Discounts & RFQs
                          </span>
                        </div>
                        <p className="text-xs text-muted-foreground leading-relaxed pr-4">
                          Best for large volume checkouts, corporate uniform programs, tenders, or custom printing/embroidery specs. Bypasses payment gateways and routes a formal RFQ request directly to our wholesale sales desk.
                        </p>
                        <div className="pt-2 flex items-center gap-2">
                          <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Options:</span>
                          <span className="text-[10px] bg-slate-100 dark:bg-slate-850 px-2 py-0.5 rounded text-slate-600 dark:text-slate-450 border border-slate-250/20">Branding Specs</span>
                          <span className="text-[10px] bg-slate-100 dark:bg-slate-850 px-2 py-0.5 rounded text-slate-600 dark:text-slate-450 border border-slate-250/20">Consolidated Pricing</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-end pt-4 border-t">
                    <button 
                      onClick={handleNextStep}
                      className="bg-primary hover:bg-primary/95 text-white font-bold px-6 h-12 rounded-sm inline-flex items-center gap-2 transition cursor-pointer"
                    >
                      Continue to Details <ArrowRight size={16} />
                    </button>
                  </div>
                </div>
              )}

              {/* STEP 2: DYNAMIC DETAILS FORM */}
              {step === "details" && (
                <form onSubmit={handleNextStep} className="space-y-6">
                  
                  {/* Basic Contact Info */}
                  <div className="border border-border rounded-md p-5 bg-slate-50/20 dark:bg-slate-900/10 space-y-4">
                    <h3 className="font-bold text-xs uppercase tracking-wider text-muted-foreground border-b pb-2 mb-3">
                      Customer Contact
                    </h3>
                    <div className="grid sm:grid-cols-2 gap-4">
                      <label className="block">
                        <span className="text-xs font-semibold text-foreground/80">Email Address <span className="text-red-500">*</span></span>
                        <input
                          type="email"
                          name="email"
                          required
                          value={formState.email}
                          onChange={handleFormChange}
                          placeholder="e.g. thabo@builders-za.com"
                          className="mt-1 w-full h-10 px-3 border border-input rounded-sm bg-background text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary"
                        />
                      </label>
                      <label className="block">
                        <span className="text-xs font-semibold text-foreground/80">Phone Number <span className="text-red-500">*</span></span>
                        <input
                          type="tel"
                          name="phone"
                          required
                          value={formState.phone}
                          onChange={handleFormChange}
                          placeholder="e.g. +27 82 555 0192"
                          className="mt-1 w-full h-10 px-3 border border-input rounded-sm bg-background text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary"
                        />
                      </label>
                    </div>
                    <div className="grid sm:grid-cols-2 gap-4">
                      <label className="block">
                        <span className="text-xs font-semibold text-foreground/80">First Name <span className="text-red-500">*</span></span>
                        <input
                          type="text"
                          name="firstName"
                          required
                          value={formState.firstName}
                          onChange={handleFormChange}
                          className="mt-1 w-full h-10 px-3 border border-input rounded-sm bg-background text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary"
                        />
                      </label>
                      <label className="block">
                        <span className="text-xs font-semibold text-foreground/80">Last Name <span className="text-red-500">*</span></span>
                        <input
                          type="text"
                          name="lastName"
                          required
                          value={formState.lastName}
                          onChange={handleFormChange}
                          className="mt-1 w-full h-10 px-3 border border-input rounded-sm bg-background text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary"
                        />
                      </label>
                    </div>
                  </div>

                  {/* Standard Delivery Address */}
                  <div className="border border-border rounded-md p-5 bg-slate-50/20 dark:bg-slate-900/10 space-y-4">
                    <h3 className="font-bold text-xs uppercase tracking-wider text-muted-foreground border-b pb-2 mb-3">
                      Shipping / Delivery Destination
                    </h3>
                    <label className="block">
                      <span className="text-xs font-semibold text-foreground/80">Street Address <span className="text-red-500">*</span></span>
                      <input
                        type="text"
                        name="street"
                        required
                        value={formState.street}
                        onChange={handleFormChange}
                        placeholder="e.g. 42 Witkoppen Road"
                        className="mt-1 w-full h-10 px-3 border border-input rounded-sm bg-background text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary"
                      />
                    </label>
                    <div className="grid sm:grid-cols-3 gap-4">
                      <label className="block">
                        <span className="text-xs font-semibold text-foreground/80">Suburb <span className="text-red-500">*</span></span>
                        <input
                          type="text"
                          name="suburb"
                          required
                          value={formState.suburb}
                          onChange={handleFormChange}
                          placeholder="e.g. Fourways"
                          className="mt-1 w-full h-10 px-3 border border-input rounded-sm bg-background text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary"
                        />
                      </label>
                      <label className="block">
                        <span className="text-xs font-semibold text-foreground/80">City <span className="text-red-500">*</span></span>
                        <input
                          type="text"
                          name="city"
                          required
                          value={formState.city}
                          onChange={handleFormChange}
                          placeholder="e.g. Johannesburg"
                          className="mt-1 w-full h-10 px-3 border border-input rounded-sm bg-background text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary"
                        />
                      </label>
                      <label className="block">
                        <span className="text-xs font-semibold text-foreground/80">Postal Code <span className="text-red-500">*</span></span>
                        <input
                          type="text"
                          name="zip"
                          required
                          value={formState.zip}
                          onChange={handleFormChange}
                          placeholder="e.g. 2055"
                          className="mt-1 w-full h-10 px-3 border border-input rounded-sm bg-background text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary"
                        />
                      </label>
                    </div>
                    <label className="block">
                      <span className="text-xs font-semibold text-foreground/80">Province <span className="text-red-500">*</span></span>
                      <select
                        name="province"
                        value={formState.province}
                        onChange={handleFormChange}
                        className="mt-1 w-full h-10 px-3 border border-input rounded-sm bg-background text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary appearance-none cursor-pointer"
                      >
                        <option value="Gauteng">Gauteng</option>
                        <option value="Western Cape">Western Cape</option>
                        <option value="KwaZulu-Natal">KwaZulu-Natal</option>
                        <option value="Eastern Cape">Eastern Cape</option>
                        <option value="Free State">Free State</option>
                        <option value="Limpopo">Limpopo</option>
                        <option value="Mpumalanga">Mpumalanga</option>
                        <option value="North West">North West</option>
                        <option value="Northern Cape">Northern Cape</option>
                      </select>
                    </label>
                  </div>

                  {/* B2B EXTRAS FORM (ONLY IF PAY ON INVOICE CHOSEN) */}
                  {selectedMethod === "Pay on Invoice" && (
                    <div className="border-2 border-indigo-500/20 rounded-md p-5 bg-indigo-50/5 dark:bg-indigo-950/5 space-y-4 animate-slide-in">
                      <h3 className="font-bold text-xs uppercase tracking-wider text-indigo-650 dark:text-indigo-400 border-b border-indigo-100 dark:border-indigo-900 pb-2 mb-3 flex items-center gap-1.5">
                        <Building2 size={14} /> Corporate Account Profile (Required)
                      </h3>
                      
                      <div className="grid sm:grid-cols-2 gap-4">
                        <label className="block">
                          <span className="text-xs font-bold text-slate-755">Company Registered Name <span className="text-red-500">*</span></span>
                          <input
                            type="text"
                            name="company"
                            required
                            value={formState.company}
                            onChange={handleFormChange}
                            placeholder="e.g. Acme Construction PTY Ltd"
                            className="mt-1 w-full h-10 px-3 border border-indigo-200 dark:border-indigo-900 rounded-sm bg-background text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary"
                          />
                        </label>
                        <label className="block">
                          <span className="text-xs font-semibold text-foreground/80">VAT Number (Optional)</span>
                          <input
                            type="text"
                            name="vatNumber"
                            value={formState.vatNumber}
                            onChange={handleFormChange}
                            placeholder="e.g. 4910394819"
                            className="mt-1 w-full h-10 px-3 border border-input rounded-sm bg-background text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary"
                          />
                        </label>
                      </div>
                      
                      <label className="block">
                        <span className="text-xs font-semibold text-foreground/80">Purchase Order (PO) / Internal Account Number (Optional)</span>
                        <input
                          type="text"
                          name="poNumber"
                          value={formState.poNumber}
                          onChange={handleFormChange}
                          placeholder="e.g. PO-8841-A"
                          className="mt-1 w-full h-10 px-3 border border-input rounded-sm bg-background text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary"
                        />
                      </label>
                      <p className="text-[10px] text-muted-foreground mt-1">
                        Choosing Invoice creates the order under a **Pending** status. A downloadable SABS VAT invoice will be generated. Our dispatch desk validates trade terms before shipment processing.
                      </p>
                    </div>
                  )}

                  {/* QUOTE EXTRAS FORM (ONLY IF REQUEST QUOTE CHOSEN) */}
                  {selectedMethod === "Request Quote" && (
                    <div className="border-2 border-amber-500/20 rounded-md p-5 bg-amber-50/5 dark:bg-amber-950/5 space-y-4 animate-slide-in">
                      <h3 className="font-bold text-xs uppercase tracking-wider text-amber-650 dark:text-amber-450 border-b border-amber-100 dark:border-amber-900 pb-2 mb-3 flex items-center gap-1.5">
                        <ClipboardList size={14} /> Wholesale Tenders & Custom Embroidery specs
                      </h3>
                      
                      <div className="grid sm:grid-cols-2 gap-4">
                        <label className="block">
                          <span className="text-xs font-semibold text-foreground/80">Company / Organization</span>
                          <input
                            type="text"
                            name="company"
                            value={formState.company}
                            onChange={handleFormChange}
                            placeholder="e.g. Apex Security PTY"
                            className="mt-1 w-full h-10 px-3 border border-input rounded-sm bg-background text-sm focus:outline-none focus:border-primary"
                          />
                        </label>
                        
                        <label className="block">
                          <span className="text-xs font-semibold text-foreground/80 font-bold flex items-center gap-1">
                            <Calendar size={13} /> Required By Date
                          </span>
                          <input
                            type="date"
                            name="urgencyDate"
                            value={formState.urgencyDate}
                            onChange={handleFormChange}
                            className="mt-1 w-full h-10 px-3 border border-input rounded-sm bg-background text-sm focus:outline-none focus:border-primary text-slate-500 cursor-pointer"
                          />
                        </label>
                      </div>

                      <div className="space-y-2">
                        <span className="text-xs font-semibold text-foreground/80 block">Custom Branded Garments (Uniform branding)</span>
                        <div className="flex gap-4">
                          {["None", "Embroidery", "Printing", "Both Embroidery & Printing"].map((opt) => (
                            <label key={opt} className="inline-flex items-center gap-1.5 text-xs text-slate-700 dark:text-slate-300 cursor-pointer">
                              <input
                                type="radio"
                                name="branding"
                                value={opt}
                                checked={formState.branding === opt}
                                onChange={handleFormChange}
                                className="h-4 w-4 accent-amber-500 cursor-pointer"
                              />
                              {opt}
                            </label>
                          ))}
                        </div>
                      </div>

                      <label className="block">
                        <span className="text-xs font-semibold text-foreground/80">Bulk Bid Scope / Custom Sizes / Uniform Printing details</span>
                        <textarea
                          name="specs"
                          rows={3}
                          value={formState.specs}
                          onChange={handleFormChange}
                          placeholder="Please provide details about uniform specifications, sizes, chest logo branding positions, or tenders."
                          className="mt-1 w-full p-3 border border-input rounded-sm bg-background text-sm focus:outline-none focus:border-primary"
                        />
                      </label>
                    </div>
                  )}

                  {/* Actions buttons */}
                  <div className="flex justify-between items-center pt-4 border-t">
                    <button 
                      type="button"
                      onClick={handlePrevStep}
                      className="inline-flex items-center gap-1 text-sm font-bold text-slate-500 hover:text-slate-800 transition cursor-pointer"
                    >
                      <ChevronLeft size={16} /> Choose Payment Method
                    </button>
                    <button 
                      type="submit"
                      className="bg-primary hover:bg-primary/95 text-white font-bold px-6 h-12 rounded-sm inline-flex items-center gap-2 transition cursor-pointer"
                    >
                      Proceed to Final Step <ArrowRight size={16} />
                    </button>
                  </div>

                </form>
              )}

              {/* STEP 3: CONFIRM & PLACE / SECURE GATEWAY SIMULATION */}
              {step === "process" && (
                <div className="space-y-6">
                  
                  {/* Summary of checkout */}
                  <div className="border border-border rounded-md p-4 bg-slate-50/40 dark:bg-slate-900/20 text-sm space-y-2">
                    <h3 className="font-bold text-xs uppercase tracking-wider text-slate-500 border-b pb-2 mb-2">
                      Fulfillment Summary
                    </h3>
                    <div className="grid sm:grid-cols-2 gap-x-6 gap-y-2 text-xs">
                      <div><strong className="text-slate-400 font-normal">Buyer:</strong> <span className="font-semibold text-slate-850 dark:text-slate-200">{formState.firstName} {formState.lastName} ({formState.phone})</span></div>
                      <div><strong className="text-slate-400 font-normal">Method:</strong> <span className="font-bold text-primary dark:text-[var(--hi-vis)]">{selectedMethod}</span></div>
                      <div className="sm:col-span-2"><strong className="text-slate-400 font-normal">Address:</strong> <span className="font-semibold text-slate-850 dark:text-slate-200">{formState.street}, {formState.suburb}, {formState.city}, {formState.province}</span></div>
                      {formState.company && <div className="sm:col-span-2"><strong className="text-slate-400 font-normal">Company / Entity:</strong> <span className="font-bold text-indigo-650 dark:text-indigo-400">{formState.company} {formState.vatNumber ? `(VAT: ${formState.vatNumber})` : ""}</span></div>}
                    </div>
                  </div>

                  {/* SECURE CARD GATEWAY FOR "PAY NOW" */}
                  {selectedMethod === "Pay Now" && (
                    <div className="border border-border rounded-md p-5 bg-card space-y-6">
                      <div className="flex justify-between items-center border-b pb-3">
                        <div className="flex items-center gap-1.5 text-slate-800 dark:text-slate-200 font-bold text-sm">
                          <Lock size={15} className="text-green-500" /> Secure Peach Payments Gateway
                        </div>
                        <div className="flex gap-1.5 opacity-80 text-xs">
                          <span className="font-mono bg-slate-100 dark:bg-slate-800 px-1 py-0.5 rounded font-bold border">PCI-DSS Compliant</span>
                        </div>
                      </div>

                      {/* Interactive Credit Card Widget */}
                      <div className="max-w-[340px] mx-auto h-[190px] w-full rounded-xl bg-gradient-to-br from-slate-900 via-slate-800 to-indigo-950 text-white p-5 flex flex-col justify-between shadow-lg relative overflow-hidden group select-none">
                        {/* Background mesh design */}
                        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-indigo-500/10 via-transparent to-transparent opacity-40 pointer-events-none" />
                        <div className="absolute -bottom-10 -right-10 h-32 w-32 rounded-full bg-slate-500/5 blur-xl pointer-events-none" />

                        {/* Top row */}
                        <div className="flex justify-between items-start">
                          <div className="flex flex-col">
                            <span className="text-[9px] uppercase tracking-wider text-slate-400">SafeGear Industrial Client</span>
                            <span className="font-bold text-sm tracking-wide mt-0.5">SABS Safety Card</span>
                          </div>
                          {/* Credit card chip */}
                          <div className="h-7 w-9 rounded-sm bg-gradient-to-br from-amber-200 to-yellow-500/80 border border-amber-300 opacity-90 shadow-inner" />
                        </div>

                        {/* Middle: Number */}
                        <div className="text-base sm:text-lg font-mono font-bold tracking-[0.16em] text-center text-slate-200 drop-shadow-md py-2">
                          {cardState.number || "•••• •••• •••• ••••"}
                        </div>

                        {/* Bottom row */}
                        <div className="flex justify-between items-end">
                          <div className="flex flex-col text-left">
                            <span className="text-[8px] uppercase tracking-wider text-slate-400">Cardholder</span>
                            <span className="text-xs font-bold truncate max-w-[150px] uppercase font-mono mt-0.5">
                              {cardState.name || "THABO MOKOENA"}
                            </span>
                          </div>
                          <div className="flex gap-4 font-mono text-xs">
                            <div className="flex flex-col text-right">
                              <span className="text-[7px] uppercase tracking-wider text-slate-400">Expires</span>
                              <span className="font-bold mt-0.5">{cardState.expiry || "MM/YY"}</span>
                            </div>
                            <div className="flex flex-col text-right">
                              <span className="text-[7px] uppercase tracking-wider text-slate-400">CVV</span>
                              <span className="font-bold mt-0.5">{cardState.cvv || "•••"}</span>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Card Entry Fields */}
                      <div className="grid gap-3 text-sm max-w-md mx-auto">
                        <label className="block">
                          <span className="text-xs font-semibold text-foreground/80">Cardholder Name</span>
                          <input
                            type="text"
                            name="name"
                            required
                            value={cardState.name}
                            onChange={handleCardChange}
                            placeholder="e.g. T Mokoena"
                            className="mt-1 w-full h-10 px-3 border border-input rounded-sm bg-background text-sm focus:outline-none focus:border-primary"
                          />
                        </label>
                        
                        <label className="block">
                          <span className="text-xs font-semibold text-foreground/80">Debit / Credit Card Number</span>
                          <div className="relative mt-1">
                            <input
                              type="text"
                              name="number"
                              required
                              value={cardState.number}
                              onChange={handleCardChange}
                              placeholder="4000 1234 5678 9010"
                              className="w-full h-10 pl-3 pr-10 border border-input rounded-sm bg-background text-sm focus:outline-none focus:border-primary font-mono tracking-wide"
                            />
                            <CreditCard size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400" />
                          </div>
                        </label>

                        <div className="grid grid-cols-2 gap-3">
                          <label className="block">
                            <span className="text-xs font-semibold text-foreground/80">Expiry Date</span>
                            <input
                              type="text"
                              name="expiry"
                              required
                              value={cardState.expiry}
                              onChange={handleCardChange}
                              placeholder="MM/YY"
                              className="mt-1 w-full h-10 px-3 border border-input rounded-sm bg-background text-sm focus:outline-none focus:border-primary font-mono text-center"
                            />
                          </label>
                          <label className="block">
                            <span className="text-xs font-semibold text-foreground/80 flex items-center gap-1">
                              CVV Security Code <Info size={12} className="text-slate-400" title="Three digits on the back of card" />
                            </span>
                            <input
                              type="password"
                              name="cvv"
                              required
                              value={cardState.cvv}
                              onChange={handleCardChange}
                              placeholder="•••"
                              className="mt-1 w-full h-10 px-3 border border-input rounded-sm bg-background text-sm focus:outline-none focus:border-primary font-mono text-center"
                            />
                          </label>
                        </div>
                      </div>

                      <div className="flex justify-center pt-2">
                        <span className="text-[11px] text-muted-foreground flex items-center gap-1">
                          <ShieldCheck size={13} className="text-green-500" /> Encrypted using standard bank-grade SSL and AES-256 protocols.
                        </span>
                      </div>
                    </div>
                  )}

                  {/* INVOICE SUMMARY BANK DETAILS FOR "PAY ON INVOICE" */}
                  {selectedMethod === "Pay on Invoice" && (
                    <div className="border border-indigo-500/20 rounded-md p-5 bg-indigo-50/5 dark:bg-indigo-950/5 space-y-4">
                      <h3 className="font-bold text-xs uppercase tracking-wider text-indigo-650 dark:text-indigo-400 border-b border-indigo-100 dark:border-indigo-900 pb-2 flex items-center gap-1.5">
                        <Building2 size={15} /> Direct B2B Bank Deposit Verification
                      </h3>
                      <p className="text-xs text-muted-foreground leading-relaxed">
                        Your account terms dictate immediate invoice generation. Tax invoice `INV-XXXX` will be downloadable on order confirmation. To complete, verify details below:
                      </p>

                      <div className="p-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-sm space-y-2 text-xs">
                        <div className="flex justify-between"><strong className="text-slate-450 font-normal">Account Corporate Holder:</strong> <span className="font-bold text-slate-800 dark:text-slate-200">SAFEGEAR PPE LTD</span></div>
                        <div className="flex justify-between"><strong className="text-slate-450 font-normal">Registered Trade Institution:</strong> <span className="font-bold text-slate-800 dark:text-slate-200">First National Bank (FNB)</span></div>
                        <div className="flex justify-between"><strong className="text-slate-450 font-normal">Account Number:</strong> <span className="font-bold text-slate-850 dark:text-slate-200 font-mono">62013948194</span></div>
                        <div className="flex justify-between"><strong className="text-slate-450 font-normal">Branch Transit Code:</strong> <span className="font-bold text-slate-850 dark:text-slate-200 font-mono">250655</span></div>
                        {formState.poNumber && <div className="flex justify-between"><strong className="text-slate-450 font-normal">Client Purchase Order (PO):</strong> <span className="font-bold text-indigo-600 font-mono">{formState.poNumber}</span></div>}
                      </div>

                      <div className="flex items-start gap-2 text-xs text-slate-500 mt-2 bg-indigo-500/5 p-3 rounded-sm">
                        <Info size={16} className="text-indigo-500 shrink-0 mt-0.5" />
                        <p className="leading-normal">
                          Dispatches are held temporarily pending EFT confirmation or trade department credit checks. Banking confirmations should be emailed to <strong>accounts@safegear.co.za</strong> with the reference code.
                        </p>
                      </div>
                    </div>
                  )}

                  {/* QUOTE CONFIRMATION SPECS SUMMARY FOR "REQUEST QUOTE" */}
                  {selectedMethod === "Request Quote" && (
                    <div className="border border-amber-500/20 rounded-md p-5 bg-amber-50/5 dark:bg-amber-950/5 space-y-4">
                      <h3 className="font-bold text-xs uppercase tracking-wider text-amber-650 dark:text-amber-450 border-b border-amber-100 dark:border-amber-900 pb-2 flex items-center gap-1.5">
                        <ClipboardList size={15} /> Confirm Bulk Quote Submission
                      </h3>
                      
                      <div className="p-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-sm space-y-3 text-xs">
                        <div className="flex justify-between border-b pb-1.5"><strong className="text-slate-450 font-normal">Embroidery / Printing Specs:</strong> <span className="font-bold text-amber-600">{formState.branding}</span></div>
                        {formState.urgencyDate && <div className="flex justify-between border-b pb-1.5"><strong className="text-slate-450 font-normal">Required By Date:</strong> <span className="font-bold text-slate-700 dark:text-slate-350">{new Date(formState.urgencyDate).toLocaleDateString("en-ZA")}</span></div>}
                        {formState.specs && (
                          <div className="pt-1.5">
                            <strong className="text-slate-450 font-normal block mb-1">Additional Project Specifications:</strong>
                            <p className="p-2.5 bg-slate-50 dark:bg-slate-950 rounded-sm border text-slate-650 dark:text-slate-350 leading-normal italic text-[11px]">
                              "{formState.specs}"
                            </p>
                          </div>
                        )}
                      </div>

                      <div className="flex items-start gap-2 text-xs text-slate-500 bg-amber-500/5 p-3 rounded-sm">
                        <Sparkles size={16} className="text-amber-500 shrink-0 mt-0.5" />
                        <p className="leading-normal">
                          Wholesale quotations provide massive batch savings. Submitting this form routes stock reservations directly to the industrial logistics desk. A custom contract deal will be generated.
                        </p>
                      </div>
                    </div>
                  )}

                  {/* Actions buttons */}
                  <form onSubmit={handlePlaceOrder}>
                    <div className="flex justify-between items-center pt-4 border-t">
                      <button 
                        type="button"
                        onClick={handlePrevStep}
                        className="inline-flex items-center gap-1 text-sm font-bold text-slate-500 hover:text-slate-800 transition cursor-pointer"
                      >
                        <ChevronLeft size={16} /> Edit Details
                      </button>

                      <button 
                        type="submit"
                        disabled={loading}
                        className="bg-[var(--hi-vis)] text-black hover:brightness-95 font-bold px-8 h-12 rounded-sm inline-flex items-center gap-2 transition cursor-pointer font-sans shadow-md"
                      >
                        {loading ? (
                          <>
                            <Loader2 size={16} className="animate-spin" /> Processing...
                          </>
                        ) : selectedMethod === "Request Quote" ? (
                          <>
                            Submit Quote Request <ArrowRight size={16} />
                          </>
                        ) : (
                          <>
                            Authorize & Complete Order <ArrowRight size={16} />
                          </>
                        )}
                      </button>
                    </div>
                  </form>

                </div>
              )}

            </div>

            {/* WIZARD RIGHT SIDEBAR: ORDER SUMMARY */}
            <aside className="border border-slate-200 dark:border-slate-800 rounded-md p-6 bg-white dark:bg-slate-850 h-fit sticky top-24 shadow-sm">
              <div className="text-xs uppercase tracking-[0.18em] text-muted-foreground mb-4 font-bold border-b pb-2">
                Order Summary
              </div>
              
              {/* Items in cart list */}
              <div className="max-h-[220px] overflow-y-auto divide-y divide-slate-100 dark:divide-slate-800 pr-2 mb-4">
                {items.map((item) => {
                  const k = itemKey(item);
                  const dbProd = products.find((p) => p.id === item.productId);
                  return (
                    <div key={k} className="py-3 flex gap-3 text-xs first:pt-0">
                      <div className="h-12 w-12 shrink-0 rounded-sm overflow-hidden border border-slate-200 dark:border-slate-800 bg-slate-50">
                        <ProductImage name={item.name} category="cart" src={dbProd?.images?.[0]} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <span className="font-semibold text-slate-900 dark:text-white line-clamp-1">
                          {item.name}
                        </span>
                        <div className="text-[10px] text-muted-foreground mt-0.5">
                          Size {item.size} · {item.color} · Qty {item.qty}
                        </div>
                      </div>
                      <div className="text-right font-bold text-slate-800 dark:text-slate-200">
                        {formatZAR(item.price * item.qty)}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Math breakdown */}
              <div className="space-y-2.5 text-xs border-t pt-4">
                <div className="flex justify-between text-slate-600 dark:text-slate-400">
                  <span>Subtotal (Excl. VAT)</span>
                  <span>{formatZAR(subtotal / 1.15)}</span>
                </div>
                <div className="flex justify-between text-slate-600 dark:text-slate-400">
                  <span>VAT (15% local SABS)</span>
                  <span>{formatZAR(subtotal - (subtotal / 1.15))}</span>
                </div>
                <div className="flex justify-between text-slate-600 dark:text-slate-400 border-b pb-3">
                  <span className="flex items-center gap-1">
                    <Truck size={13} /> Shipping
                  </span>
                  <span className="font-semibold">
                    {shipping === 0 ? (
                      <span className="text-green-600 dark:text-green-400 font-bold uppercase text-[10px]">Free Delivery</span>
                    ) : (
                      formatZAR(shipping)
                    )}
                  </span>
                </div>
                <div className="flex justify-between text-sm font-bold text-slate-950 dark:text-white pt-1">
                  <span>Total Amount</span>
                  <span className="text-base text-primary dark:text-[var(--hi-vis)]">{formatZAR(total)}</span>
                </div>
              </div>

              {/* Security trust badges inside sidebar */}
              <div className="mt-6 border-t pt-5 space-y-3.5">
                <div className="flex items-center gap-2 text-[10px] text-slate-500 leading-normal">
                  <Award size={15} className="text-primary shrink-0 dark:text-yellow-400" />
                  <p>Certified <strong>SABS safety standards</strong> registered PPE supplier.</p>
                </div>
                <div className="flex items-center gap-2 text-[10px] text-slate-500 leading-normal">
                  <ShieldCheck size={15} className="text-green-600 shrink-0" />
                  <p><strong>100% Encrypted checkouts</strong> via authorized networks.</p>
                </div>
              </div>
            </aside>

          </div>
        )}

      </div>
    </div>
  );
}
