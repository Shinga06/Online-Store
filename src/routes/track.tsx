import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { 
  Package, 
  Search, 
  ArrowLeft, 
  ArrowRight,
  Truck, 
  Calendar, 
  Clock, 
  MapPin, 
  ShieldCheck, 
  MessageSquare, 
  Mail, 
  Phone,
  CheckCircle2,
  DollarSign,
  AlertCircle,
  HelpCircle,
  TrendingUp,
  ExternalLink
} from "lucide-react";
import { useDb } from "@/hooks/use-db";
import { db, type DBOrder } from "@/lib/db";
import { formatZAR } from "@/lib/catalog";
import { toast } from "sonner";

export const Route = createFileRoute("/track")({
  component: OrderTracking,
  validateSearch: (search: Record<string, unknown>) => {
    return {
      orderId: (search.orderId as string) || "",
    };
  },
  head: () => ({
    meta: [
      { title: "Track Order — CBALCOOL" },
      { name: "description", content: "Audit shipment timelines and trace SABS delivery routes in real time." },
    ],
  }),
});

function OrderTracking() {
  const { orderId } = Route.useSearch();
  const navigate = useNavigate();
  const { orders } = useDb();

  // Lookup form state
  const [inputOrderId, setInputOrderId] = useState(orderId || "");
  const [inputEmail, setInputEmail] = useState("");
  const [activeOrder, setActiveOrder] = useState<DBOrder | null>(null);
  const [searching, setSearching] = useState(false);

  // Notification simulator active tab
  const [simulatorChannel, setSimulatorChannel] = useState<"WhatsApp" | "Email" | "SMS">("WhatsApp");

  // Attempt automatic search if orderId exists in URL
  useEffect(() => {
    if (orderId) {
      const match = orders.find(o => o.id.toLowerCase() === orderId.toLowerCase());
      if (match) {
        setActiveOrder(match);
        setInputOrderId(match.id);
        setInputEmail(match.customerEmail);
      }
    }
  }, [orderId, orders]);

  const handleLookup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputOrderId) {
      toast.error("Please enter a valid order reference code.");
      return;
    }
    setSearching(true);

    try {
      const allOrders = await db.getOrders();
      const match = allOrders.find(
        o => o.id.toLowerCase() === inputOrderId.trim().toLowerCase()
      );

      if (!match) {
        toast.error("Order not found", {
          description: `We couldn't locate reference "${inputOrderId}". Make sure to use ORD-XXXX or RFQ-XXXX.`
        });
        setActiveOrder(null);
      } else {
        // If email is provided, validate it. Otherwise, preload and fill
        if (inputEmail && match.customerEmail.toLowerCase() !== inputEmail.trim().toLowerCase()) {
          toast.error("Email mismatch", {
            description: "The email address provided does not match our records for this order."
          });
          setActiveOrder(null);
        } else {
          setActiveOrder(match);
          setInputEmail(match.customerEmail);
          toast.success("Order history loaded successfully!");
          // Update URL query parameters reactively
          navigate({ to: "/track", search: { orderId: match.id } });
        }
      }
    } catch (err) {
      console.error(err);
      toast.error("An error occurred while tracking the order.");
    } finally {
      setSearching(false);
    }
  };

  const clearTracker = () => {
    setActiveOrder(null);
    setInputOrderId("");
    setInputEmail("");
    navigate({ to: "/track", search: { orderId: "" } });
  };

  // Timeline Stages Setup (7 standard steps)
  const allStages = [
    { label: "Pending Payment", key: "Pending Payment" },
    { label: "Payment Confirmed", key: "Payment Confirmed" },
    { label: "Processing", key: "Processing" },
    { label: "Packed", key: "Packed" },
    { label: "Shipped", key: "Shipped" },
    { label: "Out for Delivery", key: "Out for Delivery" },
    { label: "Delivered", key: "Delivered" },
  ];

  // Helper to determine active step index in the timeline
  const getActiveStepIndex = (status: string) => {
    // Map old status strings for backward compatibility
    let norm = status;
    if (status === "Pending") norm = "Pending Payment";
    
    const idx = allStages.findIndex(s => s.key === norm);
    if (idx >= 0) return idx;
    if (status === "Cancelled") return -1;
    return 2; // Default fallback to Processing
  };

  const activeIndex = activeOrder ? getActiveStepIndex(activeOrder.status) : 0;
  const isCancelled = activeOrder?.status === "Cancelled";

  // SABS Expected Arrival Date Helper
  const getExpectedArrivalString = (order: DBOrder) => {
    if (order.expectedDelivery) {
      return new Date(order.expectedDelivery).toLocaleDateString("en-ZA", {
        year: "numeric",
        month: "long",
        day: "numeric",
      });
    }
    
    // Fallback: order date + 3 days
    const dateObj = new Date(order.date);
    dateObj.setDate(dateObj.getDate() + 3);
    return dateObj.toLocaleDateString("en-ZA", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 py-12 font-sans text-slate-850 dark:text-slate-200">
      <div className="max-w-7xl mx-auto px-4">
        
        {/* Header Section */}
        <div className="text-center max-w-2xl mx-auto mb-10">
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-slate-950 dark:text-white flex items-center justify-center gap-2.5">
            <TrendingUp size={30} className="text-[var(--hi-vis)]" />
            PPE Dispatch & Order Tracker
          </h1>
          <p className="text-sm text-muted-foreground mt-2 leading-relaxed">
            Audit SABS compliance checkouts, monitor manufacturing queue stages, and trace active courier delivery routes in real time.
          </p>
        </div>

        {/* 1. LOOKUP FORM PANEL (IF NO ORDER LOADED) */}
        {!activeOrder && (
          <div className="max-w-xl mx-auto bg-white dark:bg-slate-850 border border-slate-200 dark:border-slate-800 rounded-md p-6 sm:p-8 shadow-md">
            <h2 className="text-lg font-bold tracking-tight mb-4 text-slate-900 dark:text-white flex items-center gap-2">
              <Search className="text-primary dark:text-[var(--hi-vis)]" size={18} />
              Verify SABS Shipment
            </h2>

            <form onSubmit={handleLookup} className="space-y-4">
              <div>
                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider block">
                  Order Reference / Quotation ID <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. ORD-9481 or RFQ-1029"
                  value={inputOrderId}
                  onChange={(e) => setInputOrderId(e.target.value)}
                  className="mt-1 w-full h-11 px-3 border border-input rounded-sm bg-background text-sm focus:outline-none focus:border-primary font-mono tracking-wide"
                />
                <span className="text-[10px] text-muted-foreground mt-1 block">
                  Check your confirmation screen or print receipt for the code format.
                </span>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider block">
                  Registered Email Address <span className="text-slate-400">(Optional for instant tracking)</span>
                </label>
                <input
                  type="email"
                  placeholder="e.g. thabo@builders-za.com"
                  value={inputEmail}
                  onChange={(e) => setInputEmail(e.target.value)}
                  className="mt-1 w-full h-11 px-3 border border-input rounded-sm bg-background text-sm focus:outline-none focus:border-primary"
                />
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={searching}
                  className="w-full bg-primary hover:bg-primary/95 text-white font-bold h-12 rounded-sm flex items-center justify-center gap-1.5 transition cursor-pointer text-sm shadow-xs"
                >
                  {searching ? (
                    <>
                      <Loader2 size={16} className="animate-spin" /> Verifying Records...
                    </>
                  ) : (
                    <>
                      Trace SABS Dispatch <ArrowRight size={16} />
                    </>
                  )}
                </button>
              </div>
            </form>

            <div className="mt-6 border-t pt-5 text-center text-xs text-muted-foreground flex flex-col sm:flex-row justify-center gap-4">
              <span>Have an active session?</span>
              <Link to="/account" className="font-bold text-primary hover:underline flex items-center justify-center gap-0.5">
                Visit My Account Dashboard <ArrowRight size={12} />
              </Link>
            </div>
          </div>
        )}

        {/* 2. TRACKING VISUAL TIMELINE & LIVE SIMULATOR GRID */}
        {activeOrder && (
          <div className="grid lg:grid-cols-[1fr_400px] gap-8 items-start">
            
            {/* LEFT COLUMN: TIMELINE AND SUMMARY */}
            <div className="space-y-6">
              
              {/* Tracker controls header */}
              <div className="bg-white dark:bg-slate-850 border border-slate-200 dark:border-slate-800 p-5 rounded-md shadow-xs flex flex-wrap justify-between items-center gap-4">
                <div className="space-y-0.5">
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold text-base bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded text-slate-900 dark:text-white">
                      {activeOrder.id}
                    </span>
                    <span className="text-xs text-slate-400 font-semibold">•</span>
                    <span className="text-xs text-muted-foreground font-medium">Customer: <strong>{activeOrder.customerName}</strong></span>
                  </div>
                  <span className="text-[10px] text-muted-foreground block pt-0.5">
                    Placed: {new Date(activeOrder.date).toLocaleString("en-ZA", { year: "numeric", month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" })}
                  </span>
                </div>
                <button 
                  onClick={clearTracker}
                  className="text-xs font-semibold px-4 h-9 border border-input rounded-sm hover:bg-accent transition bg-background cursor-pointer inline-flex items-center gap-1"
                >
                  <ArrowLeft size={13} /> Back to Lookup
                </button>
              </div>

              {/* TIMELINE BLOCK */}
              <div className="bg-white dark:bg-slate-850 border border-slate-200 dark:border-slate-800 rounded-md p-6 sm:p-8 shadow-xs">
                <h3 className="font-bold text-xs uppercase tracking-wider text-slate-450 border-b pb-3 mb-6 flex items-center gap-1.5">
                  <Package size={15} className="text-primary dark:text-[var(--hi-vis)]" /> Live SABS Shipment Progression
                </h3>

                {isCancelled ? (
                  <div className="border border-destructive/20 bg-destructive/5 p-6 rounded-md text-center max-w-md mx-auto py-10 space-y-3">
                    <AlertCircle className="text-destructive mx-auto" size={36} />
                    <h4 className="font-bold text-lg text-foreground">Order Cancelled</h4>
                    <p className="text-xs text-muted-foreground leading-relaxed">
                      This order has been cancelled and warehouse item allocation has been reverted. For questions regarding payments or refunds, contact intandoyodlamini@gmail.com.
                    </p>
                  </div>
                ) : (
                  /* STEPS SCROLLABLE TIMELINE CONTAINER */
                  <div className="relative pl-6 sm:pl-8 space-y-6 before:absolute before:top-2 before:bottom-2 before:left-[11px] before:w-[2px] before:bg-slate-200 dark:before:bg-slate-800">
                    {allStages.map((stage, idx) => {
                      const isCompleted = idx < activeIndex;
                      const isActive = idx === activeIndex;
                      const isPending = idx > activeIndex;

                      return (
                        <div 
                          key={stage.key}
                          className={`relative transition-all duration-300 ${
                            isCompleted ? "opacity-85" : isActive ? "scale-101 transform" : "opacity-55"
                          }`}
                        >
                          {/* Stepper Bullet Node */}
                          <div 
                            className={`absolute -left-[23px] sm:-left-[27px] h-5 w-5 rounded-full flex items-center justify-center border-2 transition-all duration-300 ${
                              isCompleted 
                                ? "bg-slate-900 border-slate-900 text-white dark:bg-white dark:border-white dark:text-black shadow-inner" 
                                : isActive 
                                  ? "bg-[var(--hi-vis)] border-[var(--hi-vis)] text-black ring-4 ring-yellow-500/10 shadow-md animate-pulse" 
                                  : "bg-white border-slate-200 dark:bg-slate-850 dark:border-slate-800 text-slate-350"
                            }`}
                            style={{ top: "1px" }}
                          >
                            {isCompleted ? (
                              <span className="text-[10px] font-bold">✓</span>
                            ) : (
                              <span className="text-[8px] font-bold">{idx + 1}</span>
                            )}
                          </div>

                          {/* Stepper text content */}
                          <div className="pl-4">
                            <h4 
                              className={`font-bold text-sm leading-none transition-colors duration-300 ${
                                isActive 
                                  ? "text-primary dark:text-[var(--hi-vis)]" 
                                  : "text-slate-900 dark:text-white"
                              }`}
                            >
                              {stage.label}
                            </h4>
                            
                            {isActive && (
                              <div className="mt-2 text-xs text-slate-650 dark:text-slate-350 space-y-1 animate-fade-in leading-relaxed">
                                <p className="font-semibold text-slate-800 dark:text-slate-200">
                                  {stage.key === "Pending Payment" && "Awaiting trade verification or bank payment deposit clearance."}
                                  {stage.key === "Payment Confirmed" && "Funds authorized. Warehouse safety stock is currently allocated."}
                                  {stage.key === "Processing" && "Apparel fitting and industrial suite tailoring checks in progress."}
                                  {stage.key === "Packed" && "Parcel carefully sealed and SABS compliance labels checked at dispatch bay."}
                                  {stage.key === "Shipped" && `Package picked up and in transit with courier: ${activeOrder.courierName || "The Courier Guy"}.`}
                                  {stage.key === "Out for Delivery" && "Delivery driver is in transit to your shipping destination today!"}
                                  {stage.key === "Delivered" && "Successfully received and signed. CBALCOOL safety protocols complete."}
                                </p>
                                <span className="text-[10px] text-muted-foreground flex items-center gap-1 pt-1 font-medium">
                                  <Clock size={12} /> Last Updated: {activeOrder.lastUpdated ? new Date(activeOrder.lastUpdated).toLocaleTimeString("en-ZA", { hour: "2-digit", minute: "2-digit" }) : new Date(activeOrder.date).toLocaleTimeString("en-ZA")}
                                </span>
                              </div>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* LOGISTICS & ESTIMATED COURIER CARD */}
              {!isCancelled && (
                <div className="bg-white dark:bg-slate-850 border border-slate-200 dark:border-slate-800 rounded-md p-6 shadow-xs space-y-4">
                  <h3 className="font-bold text-xs uppercase tracking-wider text-slate-450 border-b pb-3 mb-2 flex items-center gap-1.5">
                    <Truck size={15} className="text-primary dark:text-[var(--hi-vis)]" /> Dispatch & Delivery Details
                  </h3>

                  <div className="grid sm:grid-cols-3 gap-4 text-xs">
                    <div className="space-y-1">
                      <span className="text-slate-400 font-semibold uppercase text-[9px] tracking-wider block">Arrival Expectation</span>
                      <p className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-1">
                        <Calendar size={13} className="text-primary dark:text-yellow-400" />
                        {getExpectedArrivalString(activeOrder)}
                      </p>
                    </div>

                    <div className="space-y-1">
                      <span className="text-slate-400 font-semibold uppercase text-[9px] tracking-wider block">Shipping Address</span>
                      <p className="font-semibold text-slate-700 dark:text-slate-350 leading-normal flex items-start gap-1">
                        <MapPin size={13} className="text-slate-400 shrink-0 mt-0.5" />
                        {activeOrder.deliveryAddress}
                      </p>
                    </div>

                    <div className="space-y-1">
                      <span className="text-slate-400 font-semibold uppercase text-[9px] tracking-wider block">Billing Specs</span>
                      <div className="space-y-0.5 leading-normal text-slate-700 dark:text-slate-350">
                        <p><strong>Total:</strong> {formatZAR(activeOrder.total)}</p>
                        <p><strong>Payment:</strong> {activeOrder.paymentMethod || "EFT Terms"}</p>
                        {activeOrder.poNumber && <p><strong>PO No:</strong> <span className="font-mono">{activeOrder.poNumber}</span></p>}
                      </div>
                    </div>
                  </div>

                  {/* Courier assignment layout */}
                  {(activeOrder.courierName || activeOrder.trackingNumber) && (
                    <div className="border-t pt-4 border-slate-100 dark:border-slate-800/80 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500 flex items-center justify-center shadow-xs">
                          <Truck size={18} />
                        </div>
                        <div>
                          <span className="text-[9px] uppercase font-bold text-slate-400 block tracking-wider">Assigned SABS Logistics Courier</span>
                          <p className="font-bold text-slate-850 dark:text-slate-200 text-sm">
                            {activeOrder.courierName || "The Courier Guy"} · Ref: <span className="font-mono text-primary dark:text-[var(--hi-vis)]">{activeOrder.trackingNumber || "Pending"}</span>
                          </p>
                        </div>
                      </div>

                      {activeOrder.trackingNumber && (
                        <a 
                          href={`https://thecourierguy.net/tracking/?t=${activeOrder.trackingNumber}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="w-full sm:w-auto bg-slate-900 hover:brightness-110 text-white dark:bg-white dark:text-slate-900 font-bold text-xs h-9 px-4 rounded-sm flex items-center justify-center gap-1.5 transition cursor-pointer"
                        >
                          Courier Live Tracking <ExternalLink size={12} />
                        </a>
                      )}
                    </div>
                  )}
                </div>
              )}

            </div>

            {/* RIGHT COLUMN: MULTICHANNEL NOTIFICATIONS SIMULATOR */}
            <aside className="space-y-6">
              
              <div className="bg-white dark:bg-slate-850 border border-slate-200 dark:border-slate-800 rounded-md p-5 shadow-xs">
                <h3 className="font-bold text-xs uppercase tracking-wider text-slate-450 border-b pb-3 mb-4 flex items-center gap-1.5">
                  <MessageSquare size={15} className="text-primary dark:text-[var(--hi-vis)]" /> Live Notifications Simulator
                </h3>

                <p className="text-[10px] text-muted-foreground mb-4 leading-relaxed">
                  Triggers alerts automatically to the buyer's channels. Select a mock communication portal below to review current live dispatches:
                </p>

                {/* Simulator tabs */}
                <div className="grid grid-cols-3 gap-1 mb-5">
                  {(["WhatsApp", "SMS", "Email"] as const).map((ch) => (
                    <button
                      key={ch}
                      onClick={() => setSimulatorChannel(ch)}
                      className={`h-9 text-xs font-bold rounded-sm border cursor-pointer flex items-center justify-center gap-1 transition ${
                        simulatorChannel === ch
                          ? "bg-slate-900 border-slate-900 text-white dark:bg-white dark:border-white dark:text-slate-950 font-extrabold"
                          : "bg-background border-slate-200 dark:border-slate-800 text-slate-400 hover:text-slate-650"
                      }`}
                    >
                      {ch === "WhatsApp" && <MessageSquare size={12} />}
                      {ch === "SMS" && <Phone size={12} />}
                      {ch === "Email" && <Mail size={12} />}
                      {ch}
                    </button>
                  ))}
                </div>

                {/* VISUAL DEVICE WRAPPER */}
                <div className="relative border-4 border-slate-800 dark:border-slate-950 rounded-xl overflow-hidden shadow-md max-w-[340px] mx-auto min-h-[380px] bg-slate-100 flex flex-col font-sans">
                  
                  {/* Phone status bar */}
                  <div className="bg-slate-900 text-slate-400 text-[8px] px-3.5 py-1 flex justify-between font-semibold">
                    <span>9:41 AM</span>
                    <div className="flex gap-1 items-center">
                      <span>LTE</span>
                      <div className="h-2 w-3.5 border border-slate-500 rounded-sm" />
                    </div>
                  </div>

                  {/* WHATSAPP PORTAL RENDER */}
                  {simulatorChannel === "WhatsApp" && (
                    <div className="flex flex-col flex-1 bg-[#efeae2] dark:bg-slate-950">
                      {/* WhatsApp Header */}
                      <div className="bg-[#075e54] text-white p-2.5 flex items-center gap-2 shadow-xs shrink-0 select-none">
                        <div className="h-7 w-7 rounded-full bg-slate-300 font-bold text-black text-xs grid place-items-center">SG</div>
                        <div>
                          <div className="text-[10px] font-bold">CBALCOOL Dispatch Desk</div>
                          <span className="text-[8px] opacity-80 block">Standard Business Profile</span>
                        </div>
                      </div>
                      
                      {/* WhatsApp Chat bubbles list */}
                      <div className="flex-1 overflow-y-auto p-3.5 space-y-3.5 flex flex-col text-[11px]">
                        <div className="bg-white/90 text-slate-600 self-center text-[9px] px-2 py-0.5 rounded shadow-2xs font-medium uppercase tracking-wider mb-1">
                          Today
                        </div>
                        
                        {activeOrder.notificationLogs?.filter(l => l.channel === "WhatsApp").length === 0 ? (
                          <p className="text-center text-slate-400 italic py-10 text-[10px]">No WhatsApp alerts dispatched for this status yet.</p>
                        ) : (
                          activeOrder.notificationLogs?.filter(l => l.channel === "WhatsApp").map((l, i) => (
                            <div key={i} className="bg-[#d9fdd3] text-slate-900 self-start p-2.5 rounded-lg max-w-[85%] shadow-2xs relative leading-relaxed whitespace-pre-wrap">
                              {l.message}
                              <span className="text-[7px] text-slate-400 block text-right mt-1 font-semibold">
                                {new Date(l.timestamp).toLocaleTimeString("en-ZA", { hour: "2-digit", minute: "2-digit" })} ✓✓
                              </span>
                            </div>
                          ))
                        )}
                      </div>
                    </div>
                  )}

                  {/* SMS PORTAL RENDER */}
                  {simulatorChannel === "SMS" && (
                    <div className="flex flex-col flex-1 bg-white dark:bg-slate-900">
                      {/* SMS Header */}
                      <div className="bg-slate-50 border-b p-2.5 text-center shrink-0 border-slate-200 select-none">
                        <div className="text-[10px] font-bold text-slate-800 dark:text-slate-350 flex items-center justify-center gap-1"><Phone size={11} /> +27 82 000 7233</div>
                        <span className="text-[7px] text-slate-400 uppercase tracking-wider block font-semibold mt-0.5">Short Message Service</span>
                      </div>

                      {/* SMS bubble text list */}
                      <div className="flex-1 overflow-y-auto p-3.5 space-y-3 flex flex-col text-[11px]">
                        {activeOrder.notificationLogs?.filter(l => l.channel === "SMS").length === 0 ? (
                          <p className="text-center text-slate-400 italic py-10 text-[10px]">No SMS alerts dispatched for this status yet.</p>
                        ) : (
                          activeOrder.notificationLogs?.filter(l => l.channel === "SMS").map((l, i) => (
                            <div key={i} className="bg-slate-100 text-slate-900 dark:bg-slate-800 dark:text-slate-200 self-start p-2.5 rounded-2xl max-w-[85%] leading-relaxed whitespace-pre-wrap">
                              {l.message}
                              <span className="text-[7px] text-slate-400 block text-right mt-1">
                                {new Date(l.timestamp).toLocaleTimeString("en-ZA", { hour: "2-digit", minute: "2-digit" })}
                              </span>
                            </div>
                          ))
                        )}
                      </div>
                    </div>
                  )}

                  {/* EMAIL PORTAL RENDER */}
                  {simulatorChannel === "Email" && (
                    <div className="flex flex-col flex-1 bg-slate-50 dark:bg-slate-900/60 overflow-y-auto">
                      {/* Email client Header */}
                      <div className="bg-slate-900 text-white p-3 shrink-0 border-b border-slate-950 select-none">
                        <div className="text-[10px] font-bold flex items-center gap-1.5"><Mail size={12} className="text-yellow-400" /> CBALCOOL Mail Client</div>
                        <div className="text-[8px] opacity-80 mt-1 leading-normal">
                          <p><strong>From:</strong> intandoyodlamini@gmail.com</p>
                          <p><strong>To:</strong> {activeOrder.customerEmail}</p>
                        </div>
                      </div>

                      {/* Email Body details */}
                      <div className="p-3.5 space-y-4 flex-1 text-[10px] leading-relaxed">
                        {activeOrder.notificationLogs?.filter(l => l.channel === "Email").length === 0 ? (
                          <p className="text-center text-slate-400 italic py-10">No Email alerts dispatched for this status yet.</p>
                        ) : (
                          activeOrder.notificationLogs?.filter(l => l.channel === "Email").map((l, i) => (
                            <div key={i} className="bg-white text-slate-900 dark:bg-slate-950 dark:text-slate-200 p-4 border border-slate-200 rounded shadow-3xs space-y-3">
                              {/* Logo header inside email mockup */}
                              <div className="flex items-center gap-1.5 border-b pb-2 select-none">
                                <div className="h-5 w-5 bg-slate-950 text-white font-bold text-[10px] grid place-items-center rounded-sm">S</div>
                                <span className="font-extrabold text-[10px] tracking-tight">CBALCOOL PPE LTD</span>
                              </div>

                              <p className="whitespace-pre-wrap font-sans text-xs leading-normal">{l.message}</p>
                              
                              {/* Automated update signature block reflecting Durban branch details */}
                              <div className="border-t pt-2 mt-2 text-[8px] text-slate-400 space-y-0.5 select-none leading-normal">
                                <p>This is an automated transaction update from CBALCOOL PPE Durban.</p>
                                <p>Tel: +27 83 966 4946 · Durban, KwaZulu-Natal</p>
                              </div>
                            </div>
                          ))
                        )}
                      </div>
                    </div>
                  )}

                </div>
              </div>

            </aside>

          </div>
        )}

      </div>
    </div>
  );
}
