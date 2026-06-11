import { createFileRoute } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { useDb } from "@/hooks/use-db";
import { db, type DBOrder } from "@/lib/db";
import { formatZAR } from "@/lib/catalog";
import {
  Search,
  Filter,
  Eye,
  FileText,
  Printer,
  X,
  CheckCircle,
  Truck,
  Clock,
  ChevronRight,
} from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/admin/orders")({
  component: AdminOrders,
});

function AdminOrders() {
  const { orders } = useDb();
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState("all");

  // Selected Order for detail view
  const [selectedOrder, setSelectedOrder] = useState<DBOrder | null>(null);
  
  // Selected Order for Invoice view
  const [invoiceOrder, setInvoiceOrder] = useState<DBOrder | null>(null);

  // Logistics Dispatch Setup Form States
  const [courierName, setCourierName] = useState("");
  const [trackingNumber, setTrackingNumber] = useState("");
  const [expectedDelivery, setExpectedDelivery] = useState("");

  useEffect(() => {
    if (selectedOrder) {
      setCourierName(selectedOrder.courierName || "");
      setTrackingNumber(selectedOrder.trackingNumber || "");
      setExpectedDelivery(selectedOrder.expectedDelivery ? selectedOrder.expectedDelivery.split("T")[0] : "");
    } else {
      setCourierName("");
      setTrackingNumber("");
      setExpectedDelivery("");
    }
  }, [selectedOrder]);

  const handleLogisticsSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedOrder) return;

    try {
      const updated = await db.updateOrderStatus(
        selectedOrder.id,
        selectedOrder.status,
        courierName.trim() || undefined,
        trackingNumber.trim() || undefined,
        expectedDelivery ? new Date(expectedDelivery).toISOString() : undefined
      );

      if (updated) {
        toast.success("Logistics dispatch settings updated!", {
          description: `Courier: ${courierName || "None"} · Tracking: ${trackingNumber || "None"}`
        });
        setSelectedOrder({
          ...selectedOrder,
          courierName: courierName.trim() || undefined,
          trackingNumber: trackingNumber.trim() || undefined,
          expectedDelivery: expectedDelivery ? new Date(expectedDelivery).toISOString() : undefined
        });
      }
    } catch (err) {
      console.error(err);
      toast.error("Failed to update logistics dispatch settings.");
    }
  };

  const handleStatusChange = async (id: string, newStatus: DBOrder["status"]) => {
    try {
      const updated = await db.updateOrderStatus(id, newStatus);
      if (updated) {
        toast.success(`Order ${id} updated to ${newStatus}`);
        // Synchronize selected view state if it is currently open
        if (selectedOrder && selectedOrder.id === id) {
          setSelectedOrder({ ...selectedOrder, status: newStatus });
        }
      }
    } catch (err) {
      console.error(err);
      toast.error("Failed to update order status.");
    }
  };

  const getStatusBadge = (status: string) => {
    let classes = "";
    switch (status) {
      case "Delivered":
        classes = "bg-green-500/10 text-green-700 dark:text-green-400 border-green-500/20";
        break;
      case "Out for Delivery":
        classes = "bg-cyan-500/10 text-cyan-700 dark:text-cyan-400 border-cyan-500/20";
        break;
      case "Shipped":
        classes = "bg-blue-500/10 text-blue-700 dark:text-blue-400 border-blue-500/20";
        break;
      case "Packed":
        classes = "bg-indigo-500/10 text-indigo-700 dark:text-indigo-400 border-indigo-500/20";
        break;
      case "Processing":
        classes = "bg-amber-500/10 text-amber-700 dark:text-amber-450 border-amber-500/20";
        break;
      case "Payment Confirmed":
        classes = "bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border-emerald-500/20";
        break;
      case "Pending Payment":
      case "Pending":
        classes = "bg-yellow-500/10 text-yellow-700 dark:text-yellow-450 border-yellow-500/20";
        break;
      case "Cancelled":
        classes = "bg-destructive/10 text-destructive border-destructive/20";
        break;
      default:
        classes = "bg-slate-500/10 text-slate-700 dark:text-slate-400 border-slate-500/20";
    }

    return (
      <span className={`inline-flex items-center gap-1 text-xs font-bold px-2 py-0.5 border rounded-sm ${classes}`}>
        <span>{status}</span>
      </span>
    );
  };

  const handlePrintInvoice = () => {
    window.print();
  };

  // Filters & Searches
  const filteredOrders = orders.filter((o) => {
    const matchesSearch =
      o.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      o.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      o.customerEmail.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all" || o.status === statusFilter;
    
    const isRFQ = o.isQuote || o.id.startsWith("RFQ");
    const matchesType = 
      typeFilter === "all" ||
      (typeFilter === "quotes" && isRFQ) ||
      (typeFilter === "b2b" && !isRFQ && o.paymentMethod === "Pay on Invoice") ||
      (typeFilter === "paynow" && !isRFQ && o.paymentMethod === "Pay Now");
      
    return matchesSearch && matchesStatus && matchesType;
  });

  return (
    <div className="space-y-6 relative min-h-[80vh] animate-fade-in print:p-0">
      {/* 1. Header Bar */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 print:hidden">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Order Fulfilment Panel</h1>
          <p className="text-muted-foreground mt-1">Audit customer checkouts, dispatch shipments, and generate VAT tax invoices.</p>
        </div>
      </div>

      {/* 2. Filters & Searches */}
      <div className="bg-card border border-border p-4 rounded-md shadow-xs grid grid-cols-1 sm:grid-cols-4 gap-4 print:hidden">
        {/* Search */}
        <div className="relative">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search by Invoice ID, customer name..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full h-10 pl-9 pr-3 bg-background border border-input rounded-sm text-sm focus:outline-none focus:border-primary"
          />
        </div>

        {/* Status */}
        <div className="relative">
          <Filter size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="w-full h-10 pl-9 pr-3 bg-background border border-input rounded-sm text-sm focus:outline-none focus:border-primary appearance-none"
          >
            <option value="all">All Dispatch Statuses</option>
            <option value="Pending">Pending Review</option>
            <option value="Processing">Processing / Packaged</option>
            <option value="Shipped">Shipped / Dispatched</option>
            <option value="Delivered">Delivered</option>
            <option value="Cancelled">Cancelled</option>
          </select>
        </div>

        {/* Order Type / Payment Method Filter */}
        <div className="relative">
          <Filter size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="w-full h-10 pl-9 pr-3 bg-background border border-input rounded-sm text-sm focus:outline-none focus:border-primary appearance-none cursor-pointer"
          >
            <option value="all">All Order Types</option>
            <option value="paynow">Pay Now (Card/EFT)</option>
            <option value="b2b">B2B Invoice Accounts</option>
            <option value="quotes">Wholesale Quotes (RFQ)</option>
          </select>
        </div>

        {/* Dynamic statistics */}
        <div className="flex items-center justify-end text-xs text-muted-foreground font-semibold px-2">
          Tracking {filteredOrders.length} customer purchases
        </div>
      </div>

      {/* 3. Orders Grid Table */}
      <div className="bg-card border border-border rounded-md shadow-xs overflow-hidden print:hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-secondary/40 text-[10px] uppercase tracking-wider text-muted-foreground border-b border-border">
                <th className="px-6 py-3.5 font-semibold">Invoice Ref</th>
                <th className="px-6 py-3.5 font-semibold">Customer Contact</th>
                <th className="px-6 py-3.5 font-semibold">Date Registered</th>
                <th className="px-6 py-3.5 font-semibold text-center">Items</th>
                <th className="px-6 py-3.5 font-semibold">Amount (ZAR)</th>
                <th className="px-6 py-3.5 font-semibold">Method / Type</th>
                <th className="px-6 py-3.5 font-semibold">Status</th>
                <th className="px-6 py-3.5 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border text-sm">
              {filteredOrders.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-muted-foreground">
                    No orders registered matching filters.
                  </td>
                </tr>
              ) : (
                filteredOrders.map((o) => (
                  <tr key={o.id} className="hover:bg-secondary/15 transition-colors">
                    <td className="px-6 py-4 font-bold text-foreground">{o.id}</td>
                    <td className="px-6 py-4">
                      <div className="font-semibold text-foreground">{o.customerName}</div>
                      <div className="text-[10px] text-muted-foreground font-medium">{o.customerEmail}</div>
                    </td>
                    <td className="px-6 py-4 text-xs text-slate-500 font-medium">
                      {new Date(o.date).toLocaleDateString("en-ZA", {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </td>
                    <td className="px-6 py-4 text-center font-medium">
                      {o.items.reduce((sum, i) => sum + i.qty, 0)}
                    </td>
                    <td className="px-6 py-4 font-bold text-foreground">{formatZAR(o.total)}</td>
                    <td className="px-6 py-4">
                      {o.isQuote || o.id.startsWith("RFQ") ? (
                        <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 border bg-amber-500/10 text-amber-700 dark:text-amber-400 border-amber-500/20 rounded-sm uppercase tracking-wider">
                          Quote RFQ
                        </span>
                      ) : o.paymentMethod === "Pay on Invoice" ? (
                        <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 border bg-slate-550/10 text-slate-650 dark:text-slate-400 border-slate-500/20 rounded-sm uppercase tracking-wider">
                          B2B Invoice
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 border bg-indigo-500/10 text-indigo-700 dark:text-indigo-400 border-indigo-500/20 rounded-sm uppercase tracking-wider">
                          Pay Now Card
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <select
                        value={o.status}
                        onChange={(e) => handleStatusChange(o.id, e.target.value as DBOrder["status"])}
                        className="h-8 text-xs border border-input rounded-sm bg-background px-1.5 focus:outline-none focus:ring-1 focus:ring-primary font-semibold text-foreground cursor-pointer"
                      >
                        <option value="Pending Payment">Pending Payment</option>
                        <option value="Payment Confirmed">Payment Confirmed</option>
                        <option value="Processing">Processing</option>
                        <option value="Packed">Packed</option>
                        <option value="Shipped">Shipped</option>
                        <option value="Out for Delivery">Out for Delivery</option>
                        <option value="Delivered">Delivered</option>
                        <option value="Cancelled">Cancelled</option>
                        <option value="Pending">Pending (Legacy)</option>
                      </select>
                    </td>
                    <td className="px-6 py-4 text-right space-x-1.5 whitespace-nowrap">
                      <button
                        onClick={() => setSelectedOrder(o)}
                        className="inline-flex items-center justify-center h-8 w-8 rounded-sm bg-secondary hover:bg-accent text-foreground transition cursor-pointer"
                        title="Audit Order Details"
                      >
                        <Eye size={13} />
                      </button>
                      <button
                        onClick={() => setInvoiceOrder(o)}
                        className="inline-flex items-center justify-center h-8 w-8 rounded-sm bg-primary/10 hover:bg-primary hover:text-white text-primary transition cursor-pointer"
                        title="Tax Invoice"
                      >
                        <FileText size={13} />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* 4. Order Details Drawer */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 flex justify-end animate-fade-in font-sans print:hidden">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-xs" onClick={() => setSelectedOrder(null)} />
          <div className="relative w-full max-w-2xl bg-card border-l border-border h-full flex flex-col shadow-2xl p-6 animate-slide-in">
            {/* Header */}
            <div className="flex items-center justify-between border-b border-border pb-4 mb-5">
              <div>
                <h3 className="text-xl font-bold">Logistics Audit Registry</h3>
                <p className="text-xs text-muted-foreground mt-1">Reference: <strong className="text-foreground">{selectedOrder.id}</strong></p>
              </div>
              <button onClick={() => setSelectedOrder(null)} className="p-1 hover:bg-secondary rounded-sm transition">
                <X size={20} />
              </button>
            </div>

            {/* Content Scroll */}
            <div className="flex-1 overflow-y-auto space-y-6 pr-2 text-sm">
              {/* Grid 1: Status control */}
              <div className="bg-secondary/40 border border-border p-4 rounded-md flex justify-between items-center gap-3">
                <div>
                  <span className="text-[10px] uppercase font-bold text-muted-foreground">Fulfillment Stage</span>
                  <div className="mt-1 font-semibold text-foreground">Status updates alert client immediately.</div>
                </div>
                <select
                  value={selectedOrder.status}
                  onChange={(e) => handleStatusChange(selectedOrder.id, e.target.value as DBOrder["status"])}
                  className="h-10 border border-input rounded-sm bg-background px-3 font-bold text-foreground cursor-pointer focus:ring-1 focus:ring-primary"
                >
                  <option value="Pending Payment">Pending Payment</option>
                  <option value="Payment Confirmed">Payment Confirmed</option>
                  <option value="Processing">Processing</option>
                  <option value="Packed">Packed</option>
                  <option value="Shipped">Shipped</option>
                  <option value="Out for Delivery">Out for Delivery</option>
                  <option value="Delivered">Delivered</option>
                  <option value="Cancelled">Cancelled</option>
                  <option value="Pending">Pending (Legacy)</option>
                </select>
              </div>

              {/* Grid 2: Client Contacts */}
              <div className="border border-border rounded-md p-4 space-y-3 bg-card">
                <h4 className="font-bold text-xs uppercase tracking-wider text-muted-foreground border-b border-border pb-2">
                  Customer Profile
                </h4>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <span className="text-xs text-muted-foreground">Buyer Name</span>
                    <div className="font-semibold text-foreground mt-0.5">{selectedOrder.customerName}</div>
                  </div>
                  <div>
                    <span className="text-xs text-muted-foreground">Registered Date</span>
                    <div className="font-semibold text-foreground mt-0.5">
                      {new Date(selectedOrder.date).toLocaleDateString("en-ZA")}
                    </div>
                  </div>
                  <div>
                    <span className="text-xs text-muted-foreground">Email Address</span>
                    <div className="font-semibold text-foreground mt-0.5 truncate">{selectedOrder.customerEmail}</div>
                  </div>
                  <div>
                    <span className="text-xs text-muted-foreground">Phone Number</span>
                    <div className="font-semibold text-foreground mt-0.5">{selectedOrder.customerPhone}</div>
                  </div>
                </div>
              </div>

              {/* Grid 3: Shipping */}
              <div className="border border-border rounded-md p-4 bg-card">
                <h4 className="font-bold text-xs uppercase tracking-wider text-muted-foreground border-b border-border pb-2 mb-2">
                  Delivery Destination
                </h4>
                <p className="font-semibold text-foreground leading-relaxed">{selectedOrder.deliveryAddress}</p>
              </div>

              {/* Logistics Dispatch Setup Form Card */}
              <div className="border border-border rounded-md p-4 bg-card space-y-4">
                <h4 className="font-bold text-xs uppercase tracking-wider text-muted-foreground border-b border-border pb-2 flex items-center gap-1.5">
                  <Truck size={14} className="text-primary dark:text-[var(--hi-vis)]" /> Logistics Dispatch Setup
                </h4>
                
                <form onSubmit={handleLogisticsSubmit} className="space-y-3">
                  <div className="grid grid-cols-2 gap-3 text-xs">
                    <div>
                      <label className="text-[10px] uppercase font-bold text-muted-foreground block mb-1">
                        Courier Partner
                      </label>
                      <select
                        value={courierName}
                        onChange={(e) => setCourierName(e.target.value)}
                        className="w-full h-9 border border-input rounded-sm bg-background px-2 text-slate-800 dark:text-slate-100 font-semibold cursor-pointer focus:outline-none focus:border-primary"
                      >
                        <option value="">Select Courier...</option>
                        <option value="The Courier Guy">The Courier Guy (Recommended)</option>
                        <option value="Courier IT">Courier IT</option>
                        <option value="RAM Hand-to-Hand">RAM Hand-to-Hand</option>
                        <option value="Dawn Wing">Dawn Wing</option>
                        <option value="DHL South Africa">DHL South Africa</option>
                      </select>
                    </div>

                    <div>
                      <label className="text-[10px] uppercase font-bold text-muted-foreground block mb-1">
                        Tracking / Reference No.
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. TCG-9481-205"
                        value={trackingNumber}
                        onChange={(e) => setTrackingNumber(e.target.value)}
                        className="w-full h-9 border border-input rounded-sm bg-background px-2.5 text-slate-850 dark:text-slate-100 font-mono focus:outline-none focus:border-primary"
                      />
                    </div>

                    <div className="col-span-2">
                      <label className="text-[10px] uppercase font-bold text-muted-foreground block mb-1">
                        Expected Delivery Date
                      </label>
                      <input
                        type="date"
                        value={expectedDelivery}
                        onChange={(e) => setExpectedDelivery(e.target.value)}
                        className="w-full h-9 border border-input rounded-sm bg-background px-2.5 text-slate-800 dark:text-slate-100 focus:outline-none focus:border-primary"
                      />
                    </div>
                  </div>

                  <div className="pt-1">
                    <button
                      type="submit"
                      className="w-full bg-slate-900 hover:brightness-110 text-white dark:bg-white dark:text-slate-950 font-bold text-xs h-9 rounded-sm transition cursor-pointer flex items-center justify-center gap-1.5"
                    >
                      Update Logistics & Dispatch Alerts
                    </button>
                  </div>
                </form>
              </div>

              {/* Grid B2B or Quote Info */}
              {(selectedOrder.companyName || selectedOrder.vatNumber || selectedOrder.poNumber) && (
                <div className="border border-indigo-500/20 rounded-md p-4 space-y-3 bg-indigo-50/5 dark:bg-indigo-950/5 animate-slide-in">
                  <h4 className="font-bold text-xs uppercase tracking-wider text-indigo-650 dark:text-indigo-400 border-b border-indigo-100 dark:border-indigo-900 pb-2">
                    B2B Profile & PO Billing
                  </h4>
                  <div className="grid grid-cols-2 gap-4">
                    {selectedOrder.companyName && (
                      <div className="col-span-2">
                        <span className="text-xs text-indigo-400 font-semibold">Company Registered Name</span>
                        <div className="font-bold text-slate-800 dark:text-slate-200 mt-0.5">{selectedOrder.companyName}</div>
                      </div>
                    )}
                    {selectedOrder.vatNumber && (
                      <div>
                        <span className="text-xs text-slate-400 font-semibold">VAT Registration No.</span>
                        <div className="font-semibold text-foreground mt-0.5">{selectedOrder.vatNumber}</div>
                      </div>
                    )}
                    {selectedOrder.poNumber && (
                      <div>
                        <span className="text-xs text-slate-400 font-semibold">Purchase Order (PO)</span>
                        <div className="font-bold text-indigo-650 dark:text-indigo-400 font-mono mt-0.5">{selectedOrder.poNumber}</div>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {(selectedOrder.isQuote || selectedOrder.brandingReqs || selectedOrder.urgencyDate || selectedOrder.quoteNotes) && (
                <div className="border border-amber-500/20 rounded-md p-4 space-y-3 bg-amber-50/5 dark:bg-amber-950/5 animate-slide-in">
                  <h4 className="font-bold text-xs uppercase tracking-wider text-amber-655 dark:text-amber-450 border-b border-amber-100 dark:border-amber-900 pb-2">
                    Bulk PPE Specs & Branding
                  </h4>
                  <div className="grid grid-cols-2 gap-4">
                    {selectedOrder.brandingReqs && (
                      <div>
                        <span className="text-xs text-slate-400 font-semibold">Uniform Branding specs</span>
                        <div className="font-bold text-amber-650 mt-0.5">{selectedOrder.brandingReqs}</div>
                      </div>
                    )}
                    {selectedOrder.urgencyDate && (
                      <div>
                        <span className="text-xs text-slate-400 font-semibold">Delivery Deadline</span>
                        <div className="font-semibold text-foreground mt-0.5">
                          {new Date(selectedOrder.urgencyDate).toLocaleDateString("en-ZA")}
                        </div>
                      </div>
                    )}
                    {selectedOrder.quoteNotes && (
                      <div className="col-span-2">
                        <span className="text-xs text-slate-400 font-semibold">Scope and Wholesale notes</span>
                        <div className="p-2.5 bg-background border border-slate-200 rounded-sm mt-1 text-xs text-slate-650 leading-relaxed italic">
                          "{selectedOrder.quoteNotes}"
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Grid 4: Items purchases */}
              <div className="border border-border rounded-md p-4 bg-card">
                <h4 className="font-bold text-xs uppercase tracking-wider text-muted-foreground border-b border-border pb-2 mb-3">
                  Cart Purchases
                </h4>
                <div className="divide-y divide-border/60">
                  {selectedOrder.items.map((item, index) => (
                    <div key={index} className="py-2.5 flex justify-between gap-4 first:pt-0 last:pb-0">
                      <div>
                        <div className="font-semibold text-foreground">{item.name}</div>
                        <div className="text-[10px] text-muted-foreground mt-0.5 font-medium">
                          Size {item.size} · {item.color} · Qty {item.qty}
                        </div>
                      </div>
                      <div className="text-right font-bold text-foreground">
                        {formatZAR(item.price * item.qty)}
                      </div>
                    </div>
                  ))}
                </div>
                <div className="border-t border-border mt-3 pt-3 flex justify-between items-baseline">
                  <span className="font-bold text-xs uppercase tracking-wider">Order Total</span>
                  <span className="font-bold text-lg text-primary">{formatZAR(selectedOrder.total)}</span>
                </div>
              </div>
            </div>

            {/* Footer actions */}
            <div className="border-t border-border pt-4 mt-6 flex justify-end gap-2 shrink-0">
              <button
                onClick={() => setInvoiceOrder(selectedOrder)}
                className="bg-primary hover:bg-primary/95 text-primary-foreground px-5 h-11 text-xs font-bold rounded-sm inline-flex items-center gap-1.5 cursor-pointer"
              >
                <FileText size={14} /> Tax Invoice
              </button>
              <button
                onClick={() => setSelectedOrder(null)}
                className="bg-secondary px-5 h-11 text-xs font-bold border border-input rounded-sm hover:bg-accent cursor-pointer"
              >
                Close Audit
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 5. Printable Invoice Modal Overlay */}
      {invoiceOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 overflow-y-auto animate-fade-in font-sans print:absolute print:inset-0 print:bg-white print:p-0">
          <div className="relative w-full max-w-4xl bg-white text-slate-900 border rounded-md shadow-2xl p-8 md:p-12 flex flex-col gap-6 print:border-none print:shadow-none print:rounded-none">
            {/* Top Navigation Panel (Hidden on Print) */}
            <div className="flex justify-between items-center border-b pb-4 print:hidden">
              <span className="font-bold text-xs uppercase tracking-wider text-slate-500">
                {invoiceOrder.isQuote || invoiceOrder.id.startsWith("RFQ") ? "VAT Quotation Draft" : "VAT Registered Tax Invoice"}
              </span>
              <div className="flex gap-2">
                <button
                  onClick={handlePrintInvoice}
                  className="bg-slate-900 hover:brightness-110 text-white font-bold text-xs h-9 px-4 rounded-sm flex items-center gap-1.5 cursor-pointer"
                >
                  <Printer size={14} /> Print / Save PDF
                </button>
                <button
                  onClick={() => setInvoiceOrder(null)}
                  className="bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs h-9 px-3 rounded-sm cursor-pointer"
                >
                  Close
                </button>
              </div>
            </div>

            {/* VAT Invoice printable page layout */}
            <div className="space-y-8 print:p-0">
              {/* Header Info */}
              <div className="flex justify-between items-start gap-4">
                <div>
                  <div className="flex items-center gap-2">
                    <div className="h-8 w-8 rounded-sm bg-slate-950 font-bold text-white text-base grid place-items-center">S</div>
                    <span className="font-bold text-lg tracking-tight">CBALCOOL PPE LTD</span>
                  </div>
                  <div className="text-xs text-slate-500 mt-2 space-y-0.5 leading-normal">
                    <p>55 Gillespie Street, The Wheel Shopping Centre</p>
                    <p>1st Floor Shop 115a, Durban, KwaZulu-Natal, 4001</p>
                    <p>VAT Reg No: 4910394819</p>
                    <p>Email: intandoyodlamini@gmail.com · Tel: +27 83 966 4946</p>
                  </div>
                </div>

                <div className="text-right">
                  <h2 className="text-2xl font-bold tracking-tight text-slate-800 uppercase">
                    {invoiceOrder.isQuote || invoiceOrder.id.startsWith("RFQ") ? "PRO-FORMA QUOTE" : "TAX INVOICE"}
                  </h2>
                  <div className="text-xs text-slate-500 mt-2 space-y-0.5 leading-normal">
                    <p><strong>{invoiceOrder.isQuote || invoiceOrder.id.startsWith("RFQ") ? "Quotation Reference" : "Invoice No"}:</strong> {invoiceOrder.id}</p>
                    <p><strong>Date Issued:</strong> {new Date(invoiceOrder.date).toLocaleDateString("en-ZA")}</p>
                    <p><strong>Fulfillment:</strong> {invoiceOrder.status}</p>
                    <p><strong>Currency:</strong> ZAR (Rand)</p>
                  </div>
                </div>
              </div>

              {/* Bill To Block */}
              <div className="grid grid-cols-2 gap-8 border-t border-b py-6">
                <div>
                  <span className="text-[10px] uppercase font-bold text-slate-400">Billed Recipient</span>
                  <div className="font-bold text-sm text-slate-800 mt-1">{invoiceOrder.customerName}</div>
                  {invoiceOrder.companyName && (
                    <div className="font-bold text-xs text-indigo-750 mt-0.5">{invoiceOrder.companyName}</div>
                  )}
                  {invoiceOrder.vatNumber && (
                    <div className="text-[10px] text-slate-500 mt-0.5">VAT Reg: {invoiceOrder.vatNumber}</div>
                  )}
                  <div className="text-xs text-slate-500 mt-1.5 space-y-0.5 leading-normal">
                    <p>Email: {invoiceOrder.customerEmail}</p>
                    <p>Phone: {invoiceOrder.customerPhone}</p>
                  </div>
                </div>

                <div>
                  <span className="text-[10px] uppercase font-bold text-slate-400">Delivery Address</span>
                  <p className="text-xs text-slate-700 mt-1 leading-relaxed">{invoiceOrder.deliveryAddress}</p>
                  {invoiceOrder.poNumber && (
                    <p className="text-xs text-indigo-700 font-mono mt-3"><strong>PO Number:</strong> {invoiceOrder.poNumber}</p>
                  )}
                </div>
              </div>

              {/* Items details table */}
              <div>
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b-2 text-[10px] uppercase tracking-wider text-slate-500">
                      <th className="py-2.5 font-bold">Line Items</th>
                      <th className="py-2.5 font-bold text-center">Unit Price</th>
                      <th className="py-2.5 font-bold text-center">Qty</th>
                      <th className="py-2.5 font-bold text-right">Subtotal</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y text-xs text-slate-750">
                    {invoiceOrder.items.map((item, idx) => (
                      <tr key={idx} className="py-3">
                        <td className="py-3">
                          <div className="font-bold text-slate-800">{item.name}</div>
                          <div className="text-[10px] text-slate-500 mt-0.5 font-medium">Size {item.size} · Colour {item.color}</div>
                        </td>
                        <td className="py-3 text-center">{formatZAR(item.price)}</td>
                        <td className="py-3 text-center font-semibold">{item.qty}</td>
                        <td className="py-3 text-right font-bold text-slate-800">{formatZAR(item.price * item.qty)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Quote branding notes */}
              {(invoiceOrder.brandingReqs || invoiceOrder.quoteNotes) && (
                <div className="border border-dashed p-4 rounded bg-slate-50 text-xs text-slate-700 space-y-2 mt-4">
                  <h4 className="font-bold uppercase tracking-wider text-[10px] text-slate-500">Quotation Specifications</h4>
                  {invoiceOrder.brandingReqs && <p><strong>Branding Option:</strong> {invoiceOrder.brandingReqs}</p>}
                  {invoiceOrder.quoteNotes && <p><strong>Custom Requirements:</strong> "{invoiceOrder.quoteNotes}"</p>}
                </div>
              )}

              {/* Totals math breakdowns */}
              <div className="border-t pt-6 flex justify-end">
                <div className="w-80 space-y-2 text-xs">
                  <div className="flex justify-between text-slate-500">
                    <span>Subtotal (Excl. VAT)</span>
                    <span>{formatZAR(invoiceOrder.total / 1.15)}</span>
                  </div>
                  <div className="flex justify-between text-slate-500">
                    <span>VAT (15%)</span>
                    <span>{formatZAR(invoiceOrder.total - (invoiceOrder.total / 1.15))}</span>
                  </div>
                  <div className="border-t pt-2 flex justify-between text-sm font-bold text-slate-800">
                    <span>
                      {invoiceOrder.isQuote || invoiceOrder.id.startsWith("RFQ") ? "Quotation Total (Incl. VAT)" : "Invoice Total (Incl. VAT)"}
                    </span>
                    <span className="text-base text-slate-900">{formatZAR(invoiceOrder.total)}</span>
                  </div>
                </div>
              </div>

              {/* Invoice footer remarks */}
              <div className="border-t pt-6 text-[10px] text-slate-400 leading-normal text-center">
                <p className="font-semibold text-slate-500">
                  {invoiceOrder.isQuote || invoiceOrder.id.startsWith("RFQ") ? "Thank you for requesting a wholesale quote!" : "Thank you for your business!"}
                </p>
                <p className="mt-1">All items conform to South African SABS PPE requirements. Goods remain property of CBALCOOL until fully settled.</p>
                <p className="mt-0.5">
                  {invoiceOrder.isQuote || invoiceOrder.id.startsWith("RFQ") 
                    ? "Remarks: This quotation draft reserves stock for 5 business days. Contact bulk desks to finalise pricing discounts." 
                    : "Payment Terms: Direct EFT within 7 days of invoice issue date. Bank: FNB, Branch Code: 250655, Account: 62013948194"}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
