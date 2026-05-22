import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { 
  User, 
  Package, 
  Search, 
  FileText, 
  ArrowRight, 
  Calendar, 
  DollarSign, 
  Compass, 
  ChevronDown, 
  ChevronUp, 
  Mail, 
  Loader2,
  ShieldCheck,
  Building2,
  Phone
} from "lucide-react";
import { useDb } from "@/hooks/use-db";
import { db, type DBOrder } from "@/lib/db";
import { formatZAR } from "@/lib/catalog";
import { toast } from "sonner";

export const Route = createFileRoute("/account")({
  component: CustomerAccount,
  head: () => ({
    meta: [
      { title: "My Account — SafeGear PPE" },
      { name: "description", content: "Access your corporate B2B profile, purchase histories, and real-time tracking logs." },
    ],
  }),
});

function CustomerAccount() {
  const { orders } = useDb();
  const navigate = useNavigate();

  const [lookupEmail, setLookupEmail] = useState("");
  const [activeEmail, setActiveEmail] = useState<string | null>(null);
  const [expandedOrder, setExpandedOrder] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [userOrders, setUserOrders] = useState<DBOrder[]>([]);

  // Automatically load orders from browser cache (recent checkouts) or active session
  useEffect(() => {
    const fetchCachedOrders = async () => {
      if (typeof window === "undefined") return;
      const cached = localStorage.getItem("safegear_recent_checkouts");
      
      let discoveredOrders: DBOrder[] = [];
      
      if (cached) {
        try {
          const refs = JSON.parse(cached) as { id: string; email: string }[];
          // Match against live DB orders
          const allOrders = await db.getOrders();
          discoveredOrders = allOrders.filter(o => refs.some(r => r.id === o.id));
          
          if (refs.length > 0 && !activeEmail) {
            // Default active email to the most recent cached checkout email
            setActiveEmail(refs[0].email);
          }
        } catch (e) {
          console.error("Failed to parse cached checkouts:", e);
        }
      }

      // If active email is set, fetch all matching orders from the database
      if (activeEmail) {
        const allOrders = await db.getOrders();
        const emailOrders = allOrders.filter(
          o => o.customerEmail.toLowerCase() === activeEmail.toLowerCase()
        );
        
        // Merge without duplicates
        const combined = [...discoveredOrders];
        emailOrders.forEach(o => {
          if (!combined.some(c => c.id === o.id)) {
            combined.push(o);
          }
        });
        
        // Sort by date descending
        combined.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
        setUserOrders(combined);
      } else {
        discoveredOrders.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
        setUserOrders(discoveredOrders);
      }
    };

    fetchCachedOrders();
  }, [orders, activeEmail]);

  const handleLookup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!lookupEmail) {
      toast.error("Please enter a valid email address.");
      return;
    }
    setLoading(true);
    
    try {
      const allOrders = await db.getOrders();
      const matched = allOrders.filter(
        o => o.customerEmail.toLowerCase() === lookupEmail.trim().toLowerCase()
      );
      
      if (matched.length === 0) {
        toast.info("No orders found", {
          description: `We couldn't locate any purchases registered under "${lookupEmail}".`
        });
        setUserOrders([]);
      } else {
        setActiveEmail(lookupEmail.trim());
        toast.success(`Found ${matched.length} order(s) for ${lookupEmail}`);
        // Store in cache for next time
        const cached = localStorage.getItem("safegear_recent_checkouts");
        let refs = cached ? JSON.parse(cached) as { id: string; email: string }[] : [];
        matched.forEach(m => {
          if (!refs.some(r => r.id === m.id)) {
            refs.push({ id: m.id, email: m.customerEmail });
          }
        });
        localStorage.setItem("safegear_recent_checkouts", JSON.stringify(refs));
      }
    } catch (err) {
      console.error(err);
      toast.error("An error occurred during search.");
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    setActiveEmail(null);
    setUserOrders([]);
    if (typeof window !== "undefined") {
      localStorage.removeItem("safegear_recent_checkouts");
    }
    toast.info("Session reset. Cached order histories cleared.");
  };

  const toggleExpand = (id: string) => {
    setExpandedOrder(expandedOrder === id ? null : id);
  };

  const getStatusBadge = (status: string) => {
    let colorClasses = "";
    switch (status) {
      case "Pending Payment":
      case "Pending":
        colorClasses = "bg-yellow-500/10 text-yellow-750 dark:text-yellow-400 border-yellow-500/20";
        break;
      case "Payment Confirmed":
        colorClasses = "bg-green-500/10 text-green-750 dark:text-green-400 border-green-500/20";
        break;
      case "Processing":
        colorClasses = "bg-amber-500/10 text-amber-700 dark:text-amber-450 border-amber-500/20";
        break;
      case "Packed":
        colorClasses = "bg-indigo-500/10 text-indigo-700 dark:text-indigo-400 border-indigo-500/20";
        break;
      case "Shipped":
        colorClasses = "bg-blue-500/10 text-blue-700 dark:text-blue-400 border-blue-500/20";
        break;
      case "Out for Delivery":
        colorClasses = "bg-purple-500/10 text-purple-750 dark:text-purple-400 border-purple-500/20 animate-pulse";
        break;
      case "Delivered":
        colorClasses = "bg-green-500/15 text-green-700 dark:text-green-400 border-green-500/30";
        break;
      case "Cancelled":
        colorClasses = "bg-destructive/10 text-destructive border-destructive/20";
        break;
      default:
        colorClasses = "bg-slate-500/10 text-slate-700 border-slate-500/20";
    }

    return (
      <span className={`inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 border rounded-sm uppercase tracking-wider ${colorClasses}`}>
        {status}
      </span>
    );
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 py-12 font-sans text-slate-850 dark:text-slate-200">
      <div className="max-w-4xl mx-auto px-4">
        
        {/* Profile / Account Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8 border-b pb-6 border-slate-200 dark:border-slate-800">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-slate-950 dark:text-white flex items-center gap-2">
              <User className="text-[var(--hi-vis)] shrink-0" size={32} />
              {activeEmail ? "Enterprise Client Vault" : "My Account Profile"}
            </h1>
            <p className="text-sm text-muted-foreground mt-1.5">
              {activeEmail 
                ? `Authorized access for: ${activeEmail}` 
                : "Search and audit SABS workplace purchases, quotation tenders, and dispatch routes."}
            </p>
          </div>
          {activeEmail && (
            <button 
              onClick={handleLogout}
              className="text-xs font-semibold px-4 h-9 border border-input rounded-sm hover:bg-destructive/10 hover:text-destructive hover:border-destructive/30 transition bg-background cursor-pointer"
            >
              Sign Out / Clear History
            </button>
          )}
        </div>

        {/* MOCK LOGIN / SEARCH BAR IF NOT LOGGED IN */}
        {!activeEmail && userOrders.length === 0 && (
          <div className="bg-white dark:bg-slate-850 border border-slate-200 dark:border-slate-800 rounded-md p-8 shadow-md text-center max-w-xl mx-auto py-12">
            <div className="h-14 w-14 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-450 flex items-center justify-center mx-auto mb-5 shadow-inner">
              <Package size={28} />
            </div>
            
            <h2 className="text-xl font-bold tracking-tight text-slate-900 dark:text-white">
              Lookup Your Workplace Orders
            </h2>
            <p className="text-xs text-muted-foreground mt-2 max-w-sm mx-auto leading-relaxed">
              Enter your corporate or personal email address to pull all registered SABS safety checkouts, invoices, and RFQ quotations instantly.
            </p>

            <form onSubmit={handleLookup} className="mt-6 flex flex-col sm:flex-row gap-2.5 max-w-md mx-auto">
              <div className="relative flex-1">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                <input
                  type="email"
                  required
                  placeholder="e.g. buyer@builders-za.com"
                  value={lookupEmail}
                  onChange={(e) => setLookupEmail(e.target.value)}
                  className="w-full h-11 pl-9 pr-3 border border-input rounded-sm bg-background text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary"
                />
              </div>
              <button 
                type="submit"
                disabled={loading}
                className="bg-primary hover:bg-primary/95 text-white font-bold px-6 h-11 rounded-sm flex items-center justify-center gap-1.5 transition cursor-pointer text-sm shrink-0"
              >
                {loading ? (
                  <>
                    <Loader2 size={16} className="animate-spin" /> Querying...
                  </>
                ) : (
                  <>
                    Lookup History <ArrowRight size={14} />
                  </>
                )}
              </button>
            </form>
          </div>
        )}

        {/* DYNAMIC SEARCH FILTER ON ACTIVE ACCOUNTS */}
        {activeEmail && (
          <div className="mb-6 bg-white dark:bg-slate-850 border border-slate-200 dark:border-slate-800 p-4 rounded-md shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3 text-sm">
              <Building2 className="text-primary dark:text-[var(--hi-vis)]" size={18} />
              <div>
                <span className="text-xs text-slate-400 font-semibold uppercase tracking-wider block">Registered Account</span>
                <span className="font-bold text-slate-800 dark:text-slate-200">{activeEmail}</span>
              </div>
            </div>
            <form onSubmit={handleLookup} className="flex gap-2 w-full sm:w-auto">
              <input
                type="email"
                required
                placeholder="Lookup another email..."
                value={lookupEmail}
                onChange={(e) => setLookupEmail(e.target.value)}
                className="h-9 px-3 border border-input rounded-sm bg-background text-xs focus:outline-none focus:border-primary w-full sm:w-48"
              />
              <button type="submit" className="bg-primary hover:bg-primary/90 text-white font-semibold text-xs px-3 rounded-sm transition cursor-pointer shrink-0">
                Switch
              </button>
            </form>
          </div>
        )}

        {/* LIST OF CURRENT AND HISTORICAL ORDERS */}
        {(activeEmail || userOrders.length > 0) && (
          <div className="space-y-4">
            <h2 className="text-lg font-bold tracking-tight mb-3 text-slate-900 dark:text-white flex items-center gap-2">
              <Package size={18} className="text-primary dark:text-yellow-400" />
              SABS Workplace Purchases & Quotes ({userOrders.length})
            </h2>

            {userOrders.length === 0 ? (
              <div className="bg-white dark:bg-slate-850 border rounded-md p-10 text-center shadow-xs">
                <p className="text-muted-foreground text-sm">
                  We found your session, but no orders are currently registered for <strong>{activeEmail}</strong>.
                </p>
                <div className="mt-4">
                  <Link to="/shop" className="text-sm font-bold text-primary hover:underline inline-flex items-center gap-1">
                    Start Browsing PPE Inventory <ArrowRight size={14} />
                  </Link>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                {userOrders.map((o) => {
                  const isExpanded = expandedOrder === o.id;
                  const itemQtyTotal = o.items.reduce((sum, item) => sum + item.qty, 0);
                  const isRFQ = o.isQuote || o.id.startsWith("RFQ");
                  
                  return (
                    <div 
                      key={o.id} 
                      className={`bg-white dark:bg-slate-850 border rounded-md transition-all duration-300 shadow-xs overflow-hidden ${
                        isExpanded 
                          ? "border-[var(--hi-vis)] shadow-sm ring-1 ring-yellow-500/5" 
                          : "border-slate-200 dark:border-slate-800 hover:border-slate-350"
                      }`}
                    >
                      {/* Accordion Trigger Header */}
                      <div 
                        onClick={() => toggleExpand(o.id)}
                        className="p-5 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 cursor-pointer select-none"
                      >
                        <div className="space-y-1">
                          <div className="flex items-center gap-2.5 flex-wrap">
                            <span className="font-mono font-bold text-sm tracking-wide bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded text-slate-900 dark:text-white">
                              {o.id}
                            </span>
                            {getStatusBadge(o.status)}
                            {isRFQ && (
                              <span className="text-[9px] font-bold bg-amber-500/10 text-amber-700 dark:text-amber-400 border border-amber-500/20 px-1.5 py-0.5 rounded-sm uppercase tracking-wider">
                                RFQ Bid
                              </span>
                            )}
                          </div>
                          
                          <div className="flex items-center gap-4 text-xs text-muted-foreground pt-1 flex-wrap">
                            <span className="flex items-center gap-1"><Calendar size={13} /> {new Date(o.date).toLocaleDateString("en-ZA", { year: "numeric", month: "short", day: "numeric" })}</span>
                            <span>•</span>
                            <span>{itemQtyTotal} SABS Item(s)</span>
                          </div>
                        </div>

                        <div className="flex items-center gap-4 w-full sm:w-auto justify-between sm:justify-end border-t sm:border-0 pt-3 sm:pt-0">
                          <div className="text-right">
                            <span className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider block">Billing Total</span>
                            <span className="font-bold text-sm text-slate-950 dark:text-white">{formatZAR(o.total)}</span>
                          </div>
                          <div className="flex items-center gap-1.5">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                navigate({ to: "/track", search: { orderId: o.id } });
                              }}
                              className="bg-primary hover:bg-primary/95 text-white font-bold text-xs px-3 h-8 rounded-sm inline-flex items-center gap-1 transition cursor-pointer"
                            >
                              Track <ArrowRight size={12} />
                            </button>
                            <div className="p-1 hover:bg-slate-100 dark:hover:bg-slate-800 rounded transition text-slate-400">
                              {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Accordion Expanded Detail Panel */}
                      {isExpanded && (
                        <div className="border-t border-slate-100 dark:border-slate-800/80 bg-slate-50/40 dark:bg-slate-900/10 p-5 space-y-5 animate-slide-in text-xs">
                          {/* Item details list */}
                          <div className="space-y-3">
                            <h4 className="font-bold text-[10px] uppercase tracking-wider text-slate-450 border-b pb-1.5 mb-2">
                              Procured Protective Gear
                            </h4>
                            <div className="divide-y divide-slate-100 dark:divide-slate-800/50">
                              {o.items.map((item, idx) => (
                                <div key={idx} className="py-2.5 flex justify-between gap-4 first:pt-0 last:pb-0">
                                  <div>
                                    <span className="font-bold text-slate-800 dark:text-slate-200">{item.name}</span>
                                    <div className="text-[10px] text-muted-foreground mt-0.5">
                                      Size {item.size} · Color {item.color} · Qty {item.qty} · {formatZAR(item.price)} each
                                    </div>
                                  </div>
                                  <span className="font-bold text-slate-900 dark:text-white">
                                    {formatZAR(item.price * item.qty)}
                                  </span>
                                </div>
                              ))}
                            </div>
                          </div>

                          {/* Logistics / Customer Address */}
                          <div className="grid sm:grid-cols-2 gap-5 border-t pt-4 border-slate-100 dark:border-slate-800/50">
                            <div>
                              <h4 className="font-bold text-[10px] uppercase tracking-wider text-slate-450 mb-1.5">
                                Delivery Details
                              </h4>
                              <p className="font-semibold text-slate-700 dark:text-slate-350 leading-relaxed">
                                {o.deliveryAddress}
                              </p>
                              {o.customerPhone && (
                                <p className="text-[10px] text-muted-foreground mt-1.5 flex items-center gap-1">
                                  <Phone size={12} /> Contact: {o.customerPhone}
                                </p>
                              )}
                            </div>
                            
                            <div>
                              <h4 className="font-bold text-[10px] uppercase tracking-wider text-slate-450 mb-1.5">
                                Invoice & Payment Specs
                              </h4>
                              <div className="space-y-1.5 leading-relaxed text-slate-700 dark:text-slate-350">
                                <p><strong>Method:</strong> {o.paymentMethod || "Direct EFT"}</p>
                                {o.companyName && <p><strong>Company:</strong> {o.companyName}</p>}
                                {o.vatNumber && <p><strong>VAT Number:</strong> {o.vatNumber}</p>}
                                {o.poNumber && <p><strong>Purchase Order (PO):</strong> <span className="font-mono text-[11px] font-bold text-indigo-650 dark:text-indigo-400">{o.poNumber}</span></p>}
                                {o.brandingReqs && <p><strong>Custom Branding:</strong> {o.brandingReqs}</p>}
                              </div>
                            </div>
                          </div>

                          {/* Courier tracking link shortcut if shipped */}
                          {(o.courierName || o.trackingNumber) && (
                            <div className="bg-primary/5 dark:bg-[var(--hi-vis)]/5 border border-primary/10 dark:border-[var(--hi-vis)]/10 p-3.5 rounded-sm flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                              <div className="space-y-0.5">
                                <span className="text-[9px] font-bold uppercase tracking-wider text-slate-400">Courier Shipping Active</span>
                                <p className="font-bold text-slate-800 dark:text-slate-200">
                                  {o.courierName || "The Courier Guy"} · Reference: <span className="font-mono text-primary dark:text-[var(--hi-vis)]">{o.trackingNumber || "Pending"}</span>
                                </p>
                              </div>
                              {o.trackingNumber && (
                                <a 
                                  href={`https://thecourierguy.net/tracking/?t=${o.trackingNumber}`}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-[10px] font-bold bg-slate-900 text-white dark:bg-white dark:text-slate-900 hover:scale-102 transform px-3 py-1.5 rounded-sm transition cursor-pointer"
                                >
                                  Courier Live Tracking Link
                                </a>
                              )}
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* Security & SABS Compliance Seals */}
        <div className="mt-12 bg-white dark:bg-slate-850 border border-slate-200 dark:border-slate-800 rounded-md p-6 shadow-xs flex flex-col sm:flex-row justify-around items-center gap-6 text-center text-xs text-slate-500">
          <div className="flex flex-col items-center gap-2 max-w-[220px]">
            <ShieldCheck size={28} className="text-green-600" />
            <p><strong>100% Encrypted checkouts</strong> ensuring secure South African bank-grade payments.</p>
          </div>
          <div className="h-px sm:h-12 w-full sm:w-px bg-slate-200 dark:bg-slate-850" />
          <div className="flex flex-col items-center gap-2 max-w-[220px]">
            <Compass size={28} className="text-primary dark:text-yellow-400" />
            <p><strong>SABS Approved fittings</strong> conforming to statutory workplace safety codes.</p>
          </div>
        </div>

      </div>
    </div>
  );
}
