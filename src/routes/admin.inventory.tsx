import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useDb } from "@/hooks/use-db";
import { db, type DBProduct } from "@/lib/db";
import { formatZAR } from "@/lib/catalog";
import {
  AlertTriangle,
  TrendingDown,
  Activity,
  DollarSign,
  Search,
  Check,
  RotateCcw,
  ShieldAlert,
  Plus,
  Minus,
  ArrowRight,
} from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/admin/inventory")({
  component: AdminInventory,
});

function AdminInventory() {
  const { products } = useDb();
  
  const [searchTerm, setSearchTerm] = useState("");
  const [stockFilter, setStockFilter] = useState<"all" | "out" | "low" | "healthy">("all");

  // Auth User Role Check
  const [userRole, setUserRole] = useState("Manager"); // Default safe role
  useEffect(() => {
    const sessionStr = sessionStorage.getItem("cbalcool_admin_session");
    if (sessionStr) {
      try {
        const u = JSON.parse(sessionStr);
        setUserRole(u.role);
      } catch {
        // ignore
      }
    }
  }, []);

  const isReadOnly = userRole === "Manager";

  // Editable stock states for quick-replenish
  const [stockEdits, setStockEdits] = useState<{ [productId: string]: number }>({});
  const [savingProducts, setSavingProducts] = useState<{ [productId: string]: boolean }>({});

  const handleStockChange = (productId: string, val: string) => {
    const num = Math.max(0, parseInt(val) || 0);
    setStockEdits((prev) => ({ ...prev, [productId]: num }));
  };

  const handleIncrement = (productId: string, currentStock: number, amt: number) => {
    const currentEdit = stockEdits[productId] !== undefined ? stockEdits[productId] : currentStock;
    setStockEdits((prev) => ({
      ...prev,
      [productId]: Math.max(0, currentEdit + amt),
    }));
  };

  const handleResetEdit = (productId: string) => {
    setStockEdits((prev) => {
      const updated = { ...prev };
      delete updated[productId];
      return updated;
    });
  };

  const handleQuickReplenish = async (product: DBProduct) => {
    if (isReadOnly) {
      toast.error("Access Denied", { description: "Managers do not have authorization to modify stock levels." });
      return;
    }

    const newStock = stockEdits[product.id];
    if (newStock === undefined) return;

    setSavingProducts((prev) => ({ ...prev, [product.id]: true }));

    try {
      await db.saveProduct({
        ...product,
        stock: newStock,
      });

      toast.success("Stock Replenished", {
        description: `"${product.name}" stock level updated from ${product.stock} to ${newStock}.`,
      });

      // Clear edit state for this product
      handleResetEdit(product.id);
    } catch (err) {
      console.error(err);
      toast.error("Failed to update stock in database.");
    } finally {
      setSavingProducts((prev) => ({ ...prev, [product.id]: false }));
    }
  };

  // 1. Calculations
  const totalSkus = products.length;
  const outOfStockCount = products.filter((p) => p.stock === 0).length;
  const lowStockCount = products.filter((p) => p.stock > 0 && p.stock <= 5).length;
  
  // Total Invested Inventory Value (ZAR)
  const totalValue = products.reduce((acc, p) => acc + p.price * p.stock, 0);

  // 2. Filters & Search
  const filteredProducts = products.filter((p) => {
    const matchesSearch =
      p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.category.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStock =
      stockFilter === "all" ||
      (stockFilter === "out" && p.stock === 0) ||
      (stockFilter === "low" && p.stock > 0 && p.stock <= 5) ||
      (stockFilter === "healthy" && p.stock > 5);

    return matchesSearch && matchesStock;
  });

  return (
    <div className="space-y-6 relative min-h-[80vh] animate-fade-in font-sans">
      {/* Header bar */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Inventory Stock Ledger</h1>
          <p className="text-muted-foreground mt-1">
            Real-time warehousing log. Conduct stock counts and replenish SABS garments immediately.
          </p>
        </div>

        {isReadOnly && (
          <div className="bg-amber-500/10 border border-amber-500/20 text-amber-600 dark:text-amber-500 text-xs font-bold px-3 py-1.5 rounded-sm flex items-center gap-1.5 select-none">
            <ShieldAlert size={14} />
            <span>Operational Mode: Read-Only for Managers</span>
          </div>
        )}
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Active SKUs */}
        <div className="bg-card border border-border p-5 rounded-md shadow-xs flex items-center justify-between">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Active SKUs</span>
            <h3 className="text-2xl font-black mt-1 text-foreground">{totalSkus}</h3>
            <p className="text-[10px] text-muted-foreground mt-1">Unique products registered</p>
          </div>
          <div className="h-10 w-10 rounded-sm bg-primary/10 flex items-center justify-center text-primary dark:text-[var(--hi-vis)]">
            <Activity size={20} />
          </div>
        </div>

        {/* Out of Stock Warning */}
        <div className="bg-card border border-border p-5 rounded-md shadow-xs flex items-center justify-between">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Out of Stock</span>
            <h3 className="text-2xl font-black mt-1 text-red-500">{outOfStockCount}</h3>
            <p className="text-[10px] text-red-500/80 font-medium mt-1">Checkouts blocked on storefront</p>
          </div>
          <div className="h-10 w-10 rounded-sm bg-red-500/10 flex items-center justify-center text-red-500">
            <TrendingDown size={20} />
          </div>
        </div>

        {/* Low Stock Watch */}
        <div className="bg-card border border-border p-5 rounded-md shadow-xs flex items-center justify-between">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Low Stock (&le; 5)</span>
            <h3 className="text-2xl font-black mt-1 text-amber-500">{lowStockCount}</h3>
            <p className="text-[10px] text-amber-500/80 font-medium mt-1">Indicator flashing active</p>
          </div>
          <div className="h-10 w-10 rounded-sm bg-amber-500/10 flex items-center justify-center text-amber-500">
            <AlertTriangle size={20} />
          </div>
        </div>

        {/* Total Stock Invested Value */}
        <div className="bg-card border border-border p-5 rounded-md shadow-xs flex items-center justify-between">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Capital Invested</span>
            <h3 className="text-2xl font-black mt-1 text-foreground">{formatZAR(totalValue)}</h3>
            <p className="text-[10px] text-muted-foreground mt-1">Cumulative stock valuation</p>
          </div>
          <div className="h-10 w-10 rounded-sm bg-blue-500/10 flex items-center justify-center text-blue-500">
            <DollarSign size={20} />
          </div>
        </div>
      </div>

      {/* Filter and Search Box */}
      <div className="bg-card border border-border p-4 rounded-md shadow-xs grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
        {/* Search */}
        <div className="relative">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search by ID, product, category..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full h-10 pl-9 pr-3 bg-background border border-input rounded-sm text-sm focus:outline-none focus:border-primary"
          />
        </div>

        {/* Filters */}
        <div className="flex bg-secondary/50 p-1 border border-border rounded-sm gap-1 self-stretch md:col-span-2">
          {[
            { id: "all", label: "All Items" },
            { id: "out", label: `Out of Stock (${outOfStockCount})` },
            { id: "low", label: `Low Stock (${lowStockCount})` },
            { id: "healthy", label: "Healthy (>5)" },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setStockFilter(tab.id as any)}
              className={`flex-1 text-center h-8 rounded-xs text-xs font-bold transition-all ${
                stockFilter === tab.id
                  ? "bg-background shadow-xs text-foreground"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Ledger Table */}
      <div className="bg-card border border-border rounded-md shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-secondary/40 text-[10px] uppercase tracking-wider text-muted-foreground border-b border-border">
                <th className="px-6 py-3.5 font-semibold">SKU ID</th>
                <th className="px-6 py-3.5 font-semibold">Garment details</th>
                <th className="px-6 py-3.5 font-semibold">Unit Price</th>
                <th className="px-6 py-3.5 font-semibold">Inventory Level</th>
                <th className="px-6 py-3.5 font-semibold">Holding Value</th>
                <th className="px-6 py-3.5 font-semibold text-right">Stock counts & Replenishment</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border text-sm">
              {filteredProducts.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-muted-foreground font-medium">
                    No products matching active stock filters found.
                  </td>
                </tr>
              ) : (
                filteredProducts.map((p) => {
                  const isEdited = stockEdits[p.id] !== undefined;
                  const draftStock = isEdited ? stockEdits[p.id] : p.stock;
                  
                  // Holding Value based on current database stock
                  const holdingValue = p.stock * p.price;

                  // Progress bar calculations
                  const maxIndicator = 30; // Scale progress bar against 30 max visual stock
                  const percent = Math.min(100, Math.max(5, (p.stock / maxIndicator) * 100));
                  
                  let barColor = "bg-green-500";
                  let textColor = "text-green-600 dark:text-green-500 bg-green-500/10";
                  let label = "Healthy";

                  if (p.stock === 0) {
                    barColor = "bg-red-500";
                    textColor = "text-red-500 bg-red-500/10";
                    label = "Out of Stock";
                  } else if (p.stock <= 5) {
                    barColor = "bg-amber-500";
                    textColor = "text-amber-600 dark:text-amber-500 bg-amber-500/10";
                    label = `Low Stock (${p.stock})`;
                  }

                  return (
                    <tr key={p.id} className="hover:bg-secondary/15 transition-colors">
                      {/* SKU ID */}
                      <td className="px-6 py-4 font-mono text-xs font-bold text-slate-500">
                        {p.id}
                      </td>

                      {/* Name & Category */}
                      <td className="px-6 py-4">
                        <div className="font-semibold text-foreground">{p.name}</div>
                        <div className="text-[10px] uppercase tracking-wider font-bold text-slate-500 mt-0.5">
                          {p.category.replace("-", " ")}
                        </div>
                      </td>

                      {/* Unit Price */}
                      <td className="px-6 py-4 font-semibold text-foreground">
                        {formatZAR(p.price)}
                      </td>

                      {/* Stock Visual Indicator */}
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-sm select-none ${textColor}`}>
                            {label}
                          </span>
                        </div>
                        {/* Custom Progress Bar */}
                        <div className="w-32 h-1.5 bg-slate-200 dark:bg-slate-800 rounded-full mt-2 overflow-hidden">
                          <div className={`h-full ${barColor} transition-all duration-300`} style={{ width: `${percent}%` }}></div>
                        </div>
                      </td>

                      {/* Capital Holding Value */}
                      <td className="px-6 py-4 font-bold text-foreground">
                        {formatZAR(holdingValue)}
                      </td>

                      {/* Quick Replenish form controls */}
                      <td className="px-6 py-4 text-right">
                        <div className="inline-flex items-center gap-2">
                          {/* Increments buttons (disabled for Manager) */}
                          <div className="hidden xl:flex items-center border border-input rounded-sm bg-background">
                            <button
                              type="button"
                              disabled={isReadOnly}
                              onClick={() => handleIncrement(p.id, p.stock, -1)}
                              className="h-8 w-7 flex items-center justify-center hover:bg-secondary border-r border-input disabled:opacity-50 disabled:cursor-not-allowed"
                              title="Decrement by 1"
                            >
                              <Minus size={11} />
                            </button>
                            <button
                              type="button"
                              disabled={isReadOnly}
                              onClick={() => handleIncrement(p.id, p.stock, 5)}
                              className="h-8 px-2 text-[10px] font-bold hover:bg-secondary border-r border-input disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                              +5
                            </button>
                            <button
                              type="button"
                              disabled={isReadOnly}
                              onClick={() => handleIncrement(p.id, p.stock, 10)}
                              className="h-8 px-2 text-[10px] font-bold hover:bg-secondary disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                              +10
                            </button>
                          </div>

                          {/* Editable quantity input */}
                          <div className="relative w-16">
                            <input
                              type="number"
                              min="0"
                              disabled={isReadOnly}
                              value={draftStock}
                              onChange={(e) => handleStockChange(p.id, e.target.value)}
                              className="w-full h-8 text-center text-xs font-bold bg-background border border-input rounded-sm focus:outline-none focus:border-primary disabled:opacity-60 disabled:cursor-not-allowed"
                              title="Quick Stock Input"
                            />
                          </div>

                          {/* Quick Save Action triggers */}
                          {!isReadOnly ? (
                            isEdited ? (
                              <div className="flex items-center gap-1.5">
                                <button
                                  type="button"
                                  onClick={() => handleQuickReplenish(p)}
                                  disabled={savingProducts[p.id]}
                                  className="h-8 w-8 rounded-sm bg-primary hover:bg-primary/95 text-primary-foreground font-semibold flex items-center justify-center shadow-xs cursor-pointer disabled:opacity-50"
                                  title="Apply Count"
                                >
                                  {savingProducts[p.id] ? (
                                    <div className="h-3 w-3 animate-spin rounded-full border-2 border-t-white border-primary/20"></div>
                                  ) : (
                                    <Check size={14} />
                                  )}
                                </button>
                                <button
                                  type="button"
                                  onClick={() => handleResetEdit(p.id)}
                                  className="h-8 w-8 rounded-sm bg-secondary hover:bg-accent text-foreground flex items-center justify-center cursor-pointer"
                                  title="Reset Changes"
                                >
                                  <RotateCcw size={13} />
                                </button>
                              </div>
                            ) : (
                              <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest px-2 select-none">
                                Synchronized
                              </span>
                            )
                          ) : (
                            <span className="text-xs text-muted-foreground italic font-semibold px-2 select-none">
                              Locked
                            </span>
                          )}
                        </div>

                        {/* Visual indicator of active edit changes */}
                        {isEdited && (
                          <div className="text-[10px] text-amber-500 font-bold mt-1 select-none flex items-center justify-end gap-1">
                            <span>Adjusting: {p.stock}</span>
                            <ArrowRight size={10} />
                            <span>{draftStock}</span>
                          </div>
                        )}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
