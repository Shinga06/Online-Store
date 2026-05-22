import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { useDb } from "@/hooks/use-db";
import { formatZAR } from "@/lib/catalog";
import {
  Search,
  Users,
  Eye,
  ShoppingBag,
  CreditCard,
  Calendar,
  X,
  ChevronRight,
} from "lucide-react";

export const Route = createFileRoute("/admin/customers")({
  component: AdminCustomers,
});

function AdminCustomers() {
  const { customers, orders } = useDb();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCustomer, setSelectedCustomer] = useState<(typeof customers)[0] | null>(null);

  // Search filter
  const filteredCustomers = customers.filter((c) => {
    return (
      c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.phone.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  // Get customer specific orders
  const getCustomerOrders = (email: string) => {
    return orders.filter((o) => o.customerEmail.toLowerCase() === email.toLowerCase());
  };

  return (
    <div className="space-y-6 relative min-h-[80vh] animate-fade-in">
      {/* 1. Header Bar */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Customer Database</h1>
          <p className="text-muted-foreground mt-1">Audit customer records, contact profiles, and lifetime procurement metrics.</p>
        </div>
      </div>

      {/* 2. Filters & Searches */}
      <div className="bg-card border border-border p-4 rounded-md shadow-xs flex flex-col sm:flex-row gap-4 items-center justify-between">
        {/* Search */}
        <div className="relative w-full sm:max-w-md">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search by name, email or phone number..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full h-10 pl-9 pr-3 bg-background border border-input rounded-sm text-sm focus:outline-none focus:border-primary"
          />
        </div>

        {/* Total Metric counters */}
        <div className="text-xs font-semibold text-muted-foreground select-none shrink-0">
          Showing {filteredCustomers.length} registered trade partners
        </div>
      </div>

      {/* 3. Customer Data Grid Table */}
      <div className="bg-card border border-border rounded-md shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-secondary/40 text-[10px] uppercase tracking-wider text-muted-foreground border-b border-border">
                <th className="px-6 py-3.5 font-semibold">Customer ID</th>
                <th className="px-6 py-3.5 font-semibold">Registered Partner</th>
                <th className="px-6 py-3.5 font-semibold">Phone Contact</th>
                <th className="px-6 py-3.5 font-semibold">Date Created</th>
                <th className="px-6 py-3.5 font-semibold text-center">Orders Count</th>
                <th className="px-6 py-3.5 font-semibold">Lifetime Spend (LTV)</th>
                <th className="px-6 py-3.5 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border text-sm">
              {filteredCustomers.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-muted-foreground">
                    No customers registered under search query.
                  </td>
                </tr>
              ) : (
                filteredCustomers.map((c) => (
                  <tr key={c.id} className="hover:bg-secondary/15 transition-colors">
                    <td className="px-6 py-4 font-mono text-xs font-bold text-slate-500">{c.id}</td>
                    <td className="px-6 py-4">
                      <div className="font-semibold text-foreground">{c.name}</div>
                      <div className="text-[10px] text-muted-foreground font-medium mt-0.5">{c.email}</div>
                    </td>
                    <td className="px-6 py-4 font-medium text-slate-650">{c.phone}</td>
                    <td className="px-6 py-4 text-xs text-slate-500 font-semibold">
                      {new Date(c.dateRegistered).toLocaleDateString("en-ZA", {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                      })}
                    </td>
                    <td className="px-6 py-4 text-center font-bold text-foreground">{c.ordersCount}</td>
                    <td className="px-6 py-4 font-bold text-foreground">{formatZAR(c.totalSpent)}</td>
                    <td className="px-6 py-4 text-right">
                      <button
                        onClick={() => setSelectedCustomer(c)}
                        className="inline-flex items-center justify-center h-8 w-8 rounded-sm bg-secondary hover:bg-accent text-foreground transition cursor-pointer"
                        title="Audit Order History"
                      >
                        <Eye size={13} />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* 4. Customer History Details Drawer */}
      {selectedCustomer && (
        <div className="fixed inset-0 z-50 flex justify-end animate-fade-in font-sans">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-xs" onClick={() => setSelectedCustomer(null)} />
          <div className="relative w-full max-w-2xl bg-card border-l border-border h-full flex flex-col shadow-2xl p-6 animate-slide-in">
            {/* Header */}
            <div className="flex items-center justify-between border-b border-border pb-4 mb-6">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 bg-primary/10 rounded-full flex items-center justify-center text-primary">
                  <Users size={18} />
                </div>
                <div>
                  <h3 className="text-xl font-bold">{selectedCustomer.name}</h3>
                  <p className="text-xs text-muted-foreground mt-0.5">Reference ID: <strong className="text-foreground">{selectedCustomer.id}</strong></p>
                </div>
              </div>
              <button onClick={() => setSelectedCustomer(null)} className="p-1 hover:bg-secondary rounded-sm transition">
                <X size={20} />
              </button>
            </div>

            {/* Scroll view */}
            <div className="flex-1 overflow-y-auto space-y-6 pr-2 text-sm">
              {/* Financial snapshot widgets */}
              <div className="grid grid-cols-2 gap-4">
                <div className="border border-border p-4 bg-secondary/15 rounded-md flex items-center justify-between">
                  <div>
                    <span className="text-[10px] uppercase font-bold text-muted-foreground">Order Volume</span>
                    <div className="text-xl font-bold mt-1 text-foreground">{selectedCustomer.ordersCount} checkouts</div>
                  </div>
                  <ShoppingBag className="text-muted-foreground/60 shrink-0" size={20} />
                </div>
                <div className="border border-border p-4 bg-secondary/15 rounded-md flex items-center justify-between">
                  <div>
                    <span className="text-[10px] uppercase font-bold text-muted-foreground">Lifetime procurement</span>
                    <div className="text-xl font-bold mt-1 text-primary">{formatZAR(selectedCustomer.totalSpent)}</div>
                  </div>
                  <CreditCard className="text-muted-foreground/60 shrink-0" size={20} />
                </div>
              </div>

              {/* Basic Details Profile Cards */}
              <div className="border border-border rounded-md p-4 space-y-2 bg-card">
                <h4 className="font-bold text-xs uppercase tracking-wider text-muted-foreground border-b border-border pb-2 mb-2">
                  Partner Contact Details
                </h4>
                <div className="space-y-1.5 text-xs text-slate-700">
                  <p><strong>Registered Email:</strong> {selectedCustomer.email}</p>
                  <p><strong>Primary Phone:</strong> {selectedCustomer.phone}</p>
                  <p className="flex items-center gap-1">
                    <Calendar size={12} className="text-muted-foreground" />
                    <span>Member since {new Date(selectedCustomer.dateRegistered).toLocaleDateString("en-ZA", { year: "numeric", month: "long", day: "numeric" })}</span>
                  </p>
                </div>
              </div>

              {/* Order History Timeline */}
              <div className="space-y-3">
                <h4 className="font-bold text-xs uppercase tracking-wider text-muted-foreground border-b border-border pb-2">
                  Fulfillment History Log
                </h4>
                {getCustomerOrders(selectedCustomer.email).length === 0 ? (
                  <div className="py-8 text-center text-muted-foreground border border-dashed border-border rounded-md">
                    No orders registered under this client email.
                  </div>
                ) : (
                  <div className="space-y-3">
                    {getCustomerOrders(selectedCustomer.email).map((order) => (
                      <div key={order.id} className="border border-border p-4 bg-card rounded-md flex justify-between items-center gap-4 hover:border-slate-400 transition">
                        <div>
                          <div className="font-bold text-foreground text-sm">{order.id}</div>
                          <div className="text-[10px] text-muted-foreground mt-0.5 font-medium">
                            {new Date(order.date).toLocaleDateString("en-ZA")} · {order.items.reduce((sum, i) => sum + i.qty, 0)} items
                          </div>
                          
                          <div className="mt-2.5 flex flex-wrap gap-1">
                            {order.items.slice(0, 3).map((item, idx) => (
                              <span key={idx} className="bg-secondary text-[9px] px-1.5 py-0.5 rounded-xs text-muted-foreground font-semibold">
                                {item.name} ({item.qty})
                              </span>
                            ))}
                            {order.items.length > 3 && (
                              <span className="bg-secondary text-[9px] px-1.5 py-0.5 rounded-xs text-muted-foreground font-semibold">
                                +{order.items.length - 3} items
                              </span>
                            )}
                          </div>
                        </div>

                        <div className="text-right">
                          <div className="font-bold text-foreground">{formatZAR(order.total)}</div>
                          <span className={`inline-block text-[9px] font-bold px-1.5 py-0.5 border rounded-xs uppercase tracking-wider mt-1.5 ${
                            order.status === "Delivered" ? "bg-green-500/10 text-green-600 border-green-500/20" :
                            order.status === "Cancelled" ? "bg-red-500/10 text-red-500 border-red-500/20" :
                            "bg-amber-500/10 text-amber-600 border-amber-500/20"
                          }`}>
                            {order.status}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Footer */}
            <div className="border-t border-border pt-4 mt-6 flex justify-end shrink-0">
              <button
                onClick={() => setSelectedCustomer(null)}
                className="bg-secondary px-5 h-11 text-xs font-bold border border-input rounded-sm hover:bg-accent cursor-pointer"
              >
                Close Logs
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
