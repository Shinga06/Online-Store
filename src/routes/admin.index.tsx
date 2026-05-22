import { createFileRoute, Link } from "@tanstack/react-router";
import { useDb } from "@/hooks/use-db";
import { formatZAR } from "@/lib/catalog";
import {
  TrendingUp,
  ShoppingBag,
  Package,
  AlertTriangle,
  ArrowUpRight,
  Plus,
  Eye,
  CheckCircle2,
  Clock,
  Truck,
  XCircle,
} from "lucide-react";

export const Route = createFileRoute("/admin/")({
  component: AdminDashboardIndex,
});

function AdminDashboardIndex() {
  const { products, orders } = useDb();

  // 1. Calculations
  const activeOrders = orders.filter((o) => o.status !== "Cancelled");
  const totalSales = activeOrders.reduce((sum, o) => sum + o.total, 0);
  const totalOrders = orders.length;
  const totalProducts = products.length;

  const lowStockThreshold = 5;
  const lowStockItems = products.filter((p) => p.stock <= lowStockThreshold);
  const lowStockCount = lowStockItems.length;

  const recentOrders = orders.slice(0, 5);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "Delivered":
        return <CheckCircle2 size={14} className="text-green-500" />;
      case "Shipped":
        return <Truck size={14} className="text-blue-500" />;
      case "Processing":
        return <Clock size={14} className="text-amber-500 animate-pulse" />;
      case "Cancelled":
        return <XCircle size={14} className="text-destructive" />;
      default:
        return <Clock size={14} className="text-yellow-500" />;
    }
  };

  const getStatusBadge = (status: string) => {
    let classes = "";
    switch (status) {
      case "Delivered":
        classes = "bg-green-500/10 text-green-700 dark:text-green-400 border-green-500/20";
        break;
      case "Shipped":
        classes = "bg-blue-500/10 text-blue-700 dark:text-blue-400 border-blue-500/20";
        break;
      case "Processing":
        classes = "bg-amber-500/10 text-amber-700 dark:text-amber-450 border-amber-500/20";
        break;
      case "Cancelled":
        classes = "bg-destructive/10 text-destructive border-destructive/20";
        break;
      default:
        classes = "bg-yellow-500/10 text-yellow-700 dark:text-yellow-450 border-yellow-500/20";
    }

    return (
      <span className={`inline-flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 border rounded-sm ${classes}`}>
        {getStatusIcon(status)}
        <span>{status}</span>
      </span>
    );
  };

  return (
    <div className="space-y-8 animate-fade-in">
      {/* 1. Header & Quick Actions */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dashboard Overview</h1>
          <p className="text-muted-foreground mt-1">Real-time trading analytics and business metrics.</p>
        </div>
        
        <div className="flex gap-2">
          <Link
            to="/admin/products"
            className="inline-flex items-center gap-1.5 text-xs bg-slate-900 dark:bg-slate-800 text-white font-semibold h-10 px-4 rounded-sm hover:brightness-110 transition cursor-pointer"
          >
            <Plus size={14} /> Add Product
          </Link>
          <Link
            to="/admin/orders"
            className="inline-flex items-center gap-1.5 text-xs bg-[var(--hi-vis)] text-black font-semibold h-10 px-4 rounded-sm hover:brightness-95 transition cursor-pointer"
          >
            <ShoppingBag size={14} /> View Orders
          </Link>
        </div>
      </div>

      {/* 2. Key Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Metric 1 */}
        <div className="bg-card border border-border p-6 rounded-md shadow-xs flex items-center justify-between">
          <div>
            <span className="text-xs uppercase tracking-wider text-muted-foreground font-semibold">Total Revenue</span>
            <h3 className="text-2xl md:text-3xl font-bold mt-1 tracking-tight">{formatZAR(totalSales)}</h3>
            <span className="text-[10px] text-green-500 font-semibold inline-flex items-center gap-0.5 mt-1">
              <TrendingUp size={10} /> Active operations
            </span>
          </div>
          <div className="h-12 w-12 rounded-sm bg-green-500/10 flex items-center justify-center text-green-500 shrink-0">
            <TrendingUp size={22} />
          </div>
        </div>

        {/* Metric 2 */}
        <div className="bg-card border border-border p-6 rounded-md shadow-xs flex items-center justify-between">
          <div>
            <span className="text-xs uppercase tracking-wider text-muted-foreground font-semibold">Total Orders</span>
            <h3 className="text-2xl md:text-3xl font-bold mt-1 tracking-tight">{totalOrders}</h3>
            <span className="text-[10px] text-muted-foreground mt-1 block">Lifetime checkouts</span>
          </div>
          <div className="h-12 w-12 rounded-sm bg-primary/10 flex items-center justify-center text-primary dark:text-[var(--hi-vis)] shrink-0">
            <ShoppingBag size={22} />
          </div>
        </div>

        {/* Metric 3 */}
        <div className="bg-card border border-border p-6 rounded-md shadow-xs flex items-center justify-between">
          <div>
            <span className="text-xs uppercase tracking-wider text-muted-foreground font-semibold">Active Products</span>
            <h3 className="text-2xl md:text-3xl font-bold mt-1 tracking-tight">{totalProducts}</h3>
            <span className="text-[10px] text-muted-foreground mt-1 block">Live catalog lines</span>
          </div>
          <div className="h-12 w-12 rounded-sm bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-foreground shrink-0">
            <Package size={22} />
          </div>
        </div>

        {/* Metric 4 */}
        <div className="bg-card border border-border p-6 rounded-md shadow-xs flex items-center justify-between">
          <div>
            <span className="text-xs uppercase tracking-wider text-muted-foreground font-semibold">Low Stock Warnings</span>
            <h3 className="text-2xl md:text-3xl font-bold mt-1 tracking-tight text-destructive">{lowStockCount}</h3>
            <span className="text-[10px] text-destructive font-semibold inline-flex items-center gap-0.5 mt-1 animate-pulse">
              <AlertTriangle size={10} /> Needs replenishment
            </span>
          </div>
          <div className="h-12 w-12 rounded-sm bg-destructive/10 flex items-center justify-center text-destructive shrink-0">
            <AlertTriangle size={22} />
          </div>
        </div>
      </div>

      {/* 3. Alerts Panel for Low Stock */}
      {lowStockCount > 0 && (
        <div className="bg-amber-500/10 border border-amber-500/20 text-amber-900 dark:text-amber-200 rounded-md p-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="flex items-start gap-3">
            <AlertTriangle className="text-amber-600 dark:text-amber-500 shrink-0 mt-0.5" size={20} />
            <div>
              <h4 className="font-bold text-sm">Critical Inventory Alert</h4>
              <p className="text-xs text-amber-800/80 dark:text-amber-200/70 mt-0.5">
                There are {lowStockCount} product lines running below safety stock limits (stock &le; 5).
              </p>
            </div>
          </div>
          <Link
            to="/admin/inventory"
            className="inline-flex items-center gap-1 text-xs bg-amber-600 dark:bg-amber-500 hover:brightness-95 text-white font-semibold h-8 px-3 rounded-sm transition shrink-0"
          >
            Manage Stock <ArrowUpRight size={14} />
          </Link>
        </div>
      )}

      {/* 4. Bottom Grid: Recent Orders & Quick actions list */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Recent Orders List (Span 2) */}
        <div className="lg:col-span-2 bg-card border border-border rounded-md shadow-xs overflow-hidden">
          <div className="p-5 border-b border-border flex items-center justify-between">
            <h3 className="font-bold text-base">Recent Customer Orders</h3>
            <Link to="/admin/orders" className="text-xs font-semibold text-primary dark:text-[var(--hi-vis)] hover:underline inline-flex items-center gap-0.5">
              View all <ArrowUpRight size={12} />
            </Link>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-secondary/40 text-[10px] uppercase tracking-wider text-muted-foreground border-b border-border">
                  <th className="px-5 py-3 font-semibold">Order ID</th>
                  <th className="px-5 py-3 font-semibold">Customer</th>
                  <th className="px-5 py-3 font-semibold text-center">Items</th>
                  <th className="px-5 py-3 font-semibold">Total (ZAR)</th>
                  <th className="px-5 py-3 font-semibold">Status</th>
                  <th className="px-5 py-3 font-semibold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border text-sm">
                {recentOrders.map((order) => (
                  <tr key={order.id} className="hover:bg-secondary/20 transition-colors">
                    <td className="px-5 py-4 font-bold text-foreground">{order.id}</td>
                    <td className="px-5 py-4">
                      <div className="font-semibold text-foreground">{order.customerName}</div>
                      <div className="text-[10px] text-muted-foreground font-medium">{order.customerEmail}</div>
                    </td>
                    <td className="px-5 py-4 text-center font-medium">
                      {order.items.reduce((sum, i) => sum + i.qty, 0)}
                    </td>
                    <td className="px-5 py-4 font-bold text-foreground">
                      {formatZAR(order.total)}
                    </td>
                    <td className="px-5 py-4">{getStatusBadge(order.status)}</td>
                    <td className="px-5 py-4 text-right">
                      <Link
                        to="/admin/orders"
                        className="inline-flex items-center justify-center h-8 w-8 rounded-sm bg-secondary hover:bg-accent text-foreground transition cursor-pointer"
                        title="View details"
                      >
                        <Eye size={14} />
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Right Column: Dynamic Inventory Replenishment & Shortcuts */}
        <div className="space-y-6">
          {/* Quick stock shortcuts */}
          <div className="bg-card border border-border rounded-md shadow-xs p-5">
            <h3 className="font-bold text-base mb-4">Stock Shortcuts</h3>
            {lowStockItems.length === 0 ? (
              <div className="py-6 text-center text-sm text-muted-foreground border border-dashed border-border rounded-sm">
                Inventory levels are optimal!
              </div>
            ) : (
              <div className="space-y-3">
                {lowStockItems.slice(0, 4).map((p) => (
                  <div key={p.id} className="flex justify-between items-center gap-3 text-sm border-b border-border/40 pb-2 last:border-0 last:pb-0">
                    <div className="min-w-0">
                      <div className="font-semibold text-foreground truncate">{p.name}</div>
                      <div className="text-[10px] text-muted-foreground capitalize">Category: {p.category.replace("-", " ")}</div>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <span className={`text-xs font-bold px-1.5 py-0.5 rounded-sm ${p.stock === 0 ? "bg-red-500/10 text-red-500" : "bg-amber-500/10 text-amber-600"}`}>
                        {p.stock} left
                      </span>
                    </div>
                  </div>
                ))}
                
                {lowStockCount > 4 && (
                  <Link to="/admin/inventory" className="block text-center text-xs font-bold text-primary dark:text-[var(--hi-vis)] hover:underline mt-4">
                    Replenish other {lowStockCount - 4} items →
                  </Link>
                )}
              </div>
            )}
          </div>

          {/* Quick Reference guides */}
          <div className="bg-slate-900 border border-slate-800 rounded-md p-5 text-white">
            <h3 className="font-bold text-sm tracking-wide uppercase text-slate-400">Security Credentials</h3>
            <p className="text-xs text-slate-400 mt-2 leading-relaxed">
              Role permissions dictate control capacity. Adding or deleting products and editing categories is restricted to <strong className="text-[var(--hi-vis)]">Admins</strong> only. Managers possess operational logistics permissions (processing order workflows, viewing ledger metrics, settings customization).
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
