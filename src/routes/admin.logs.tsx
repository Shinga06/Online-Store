import { createFileRoute } from "@tanstack/react-router";
import { useDb } from "@/hooks/use-db";
import { db } from "@/lib/db";
import { formatZAR } from "@/lib/catalog";
import {
  ScrollText,
  Search,
  User,
  Eye,
  ShoppingCart,
  ShoppingBag,
  TrendingDown,
  Activity,
  Filter,
  Download,
  RefreshCw,
  Clock,
  Compass,
  Laptop,
  Smartphone,
  Tablet,
  Globe,
  MapPin,
  History,
  Heart,
  ChevronRight,
  X,
  ChevronDown
} from "lucide-react";
import { useState, useEffect, useMemo } from "react";
import { toast } from "sonner";

export const Route = createFileRoute("/admin/logs")({
  component: AdminActivityLogs,
});

type FilterActionType = "All" | "Registration" | "Login" | "Product View" | "Category View" | "Search" | "Add to Cart" | "Remove from Cart" | "Cart Abandoned" | "Checkout Attempt" | "Purchase" | "Wishlist Action" | "Page View";
type FilterUserType = "All" | "Registered" | "Guest";
type DatePreset = "All" | "Today" | "Last3" | "Last7";

function AdminActivityLogs() {
  const { products } = useDb();
  const [logs, setLogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [liveMode, setLiveMode] = useState(true);
  const [selectedLog, setSelectedLog] = useState<any | null>(null);

  // Filters State
  const [actionFilter, setActionFilter] = useState<FilterActionType>("All");
  const [userTypeFilter, setUserTypeFilter] = useState<FilterUserType>("All");
  const [datePreset, setDatePreset] = useState<DatePreset>("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedProduct, setSelectedProduct] = useState("All");

  // Fetch logs
  const fetchLogs = async (silent = false) => {
    if (!silent) setLoading(true);
    try {
      const allLogs = await db.getAuditLogs();
      setLogs(allLogs);
      if (!silent) toast.success("Activity logs synchronized successfully.");
    } catch (e) {
      console.error(e);
      toast.error("Failed to load store activity ledger.");
    } finally {
      if (!silent) setLoading(false);
    }
  };

  useEffect(() => {
    fetchLogs();
  }, []);

  // Polling for live updates
  useEffect(() => {
    if (!liveMode) return;
    const timer = setInterval(() => {
      fetchLogs(true);
    }, 4500); // Poll every 4.5 seconds for immediate feedback
    return () => clearInterval(timer);
  }, [liveMode]);

  // Calculations & Analytics Summaries
  const analytics = useMemo(() => {
    if (logs.length === 0) return {
      abandonRate: 0,
      totalViews: 0,
      totalAbandons: 0,
      totalPurchases: 0,
      mostViewed: [],
      mostAbandoned: [],
      mostSearched: [],
      uniqueUsers: 0
    };

    // Calculate rates
    const abandons = logs.filter(l => l.actionType === "Cart Abandoned").length;
    const purchases = logs.filter(l => l.actionType === "Purchase").length;
    const totalViews = logs.filter(l => l.actionType === "Product View").length;
    
    // Abandon rate = abandons / (abandons + purchases)
    const abandonRate = (abandons + purchases) > 0 
      ? Math.round((abandons / (abandons + purchases)) * 100) 
      : 0;

    // Unique visitors by IP
    const uniqueIps = new Set(logs.map(l => l.ipAddress).filter(Boolean));

    // Aggregate Product Views
    const viewCounts: Record<string, { name: string; count: number }> = {};
    logs.filter(l => l.actionType === "Product View").forEach(l => {
      const slug = l.targetId;
      if (slug) {
        if (!viewCounts[slug]) {
          viewCounts[slug] = { name: l.targetName || slug.replace(/-/g, " "), count: 0 };
        }
        viewCounts[slug].count++;
      }
    });

    const mostViewed = Object.entries(viewCounts)
      .map(([slug, val]) => ({ slug, name: val.name, count: val.count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);

    // Aggregate Cart Abandons
    const abandonCounts: Record<string, { name: string; count: number }> = {};
    logs.filter(l => l.actionType === "Cart Abandoned").forEach(l => {
      const pId = l.targetId;
      if (pId) {
        if (!abandonCounts[pId]) {
          abandonCounts[pId] = { name: l.targetName || pId, count: 0 };
        }
        abandonCounts[pId].count++;
      }
    });

    const mostAbandoned = Object.entries(abandonCounts)
      .map(([id, val]) => ({ id, name: val.name, count: val.count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);

    // Aggregate Search terms
    const searchCounts: Record<string, number> = {};
    logs.filter(l => l.actionType === "Search" && l.searchQuery).forEach(l => {
      const q = l.searchQuery.toLowerCase().trim();
      searchCounts[q] = (searchCounts[q] || 0) + 1;
    });

    const mostSearched = Object.entries(searchCounts)
      .map(([query, count]) => ({ query, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);

    return {
      abandonRate,
      totalViews,
      totalAbandons: abandons,
      totalPurchases: purchases,
      mostViewed,
      mostAbandoned,
      mostSearched,
      uniqueUsers: uniqueIps.size
    };
  }, [logs]);

  // Apply filters
  const filteredLogs = useMemo(() => {
    return logs.filter(log => {
      // 1. Action Filter
      if (actionFilter !== "All" && log.actionType !== actionFilter) return false;

      // 2. User Type Filter
      if (userTypeFilter !== "All" && log.userType !== userTypeFilter) return false;

      // 3. Product Filter
      if (selectedProduct !== "All" && log.targetId !== selectedProduct) return false;

      // 4. Date Presets
      if (datePreset !== "All") {
        const logDate = new Date(log.timestamp).getTime();
        const now = Date.now();
        const diffDays = (now - logDate) / (1000 * 60 * 60 * 24);
        
        if (datePreset === "Today" && diffDays > 1) return false;
        if (datePreset === "Last3" && diffDays > 3) return false;
        if (datePreset === "Last7" && diffDays > 7) return false;
      }

      // 5. Search Text Query (Fuzzy matching on details)
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const nameMatch = log.userName?.toLowerCase().includes(q);
        const emailMatch = log.userEmail?.toLowerCase().includes(q);
        const ipMatch = log.ipAddress?.toLowerCase().includes(q);
        const locMatch = log.location?.toLowerCase().includes(q);
        const targetMatch = log.targetName?.toLowerCase().includes(q);
        const searchValMatch = log.searchQuery?.toLowerCase().includes(q);
        const actionMatch = log.actionType?.toLowerCase().includes(q);

        if (!nameMatch && !emailMatch && !ipMatch && !locMatch && !targetMatch && !searchValMatch && !actionMatch) {
          return false;
        }
      }

      return true;
    });
  }, [logs, actionFilter, userTypeFilter, datePreset, searchQuery, selectedProduct]);

  // CSV Export Action
  const exportLogsToCSV = () => {
    if (filteredLogs.length === 0) {
      toast.error("No activity logs matched your active filter range.");
      return;
    }

    try {
      const headers = ["Timestamp", "Action Type", "User Type", "Name", "Email", "IP Address", "Location", "Device", "Browser", "OS", "Target ID", "Target Name", "Search Query", "Cart Total (ZAR)", "Page Duration (s)"];
      const rows = filteredLogs.map(l => [
        new Date(l.timestamp).toLocaleString("en-ZA"),
        l.actionType,
        l.userType,
        l.userName || "Guest",
        l.userEmail || "N/A",
        l.ipAddress || "N/A",
        l.location || "N/A",
        l.deviceType,
        l.browserName,
        l.osName,
        l.targetId || "",
        l.targetName || "",
        l.searchQuery || "",
        l.cartTotal || "",
        l.durationSeconds || ""
      ]);

      const csvContent = "data:text/csv;charset=utf-8," 
        + [headers.join(","), ...rows.map(e => e.map(val => `"${val}"`).join(","))].join("\n");
      
      const encodedUri = encodeURI(csvContent);
      const link = document.createElement("a");
      link.setAttribute("href", encodedUri);
      link.setAttribute("download", `cbalcool_audit_ledger_${Date.now()}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      toast.success("CSV Ledger exported successfully!");
    } catch (e) {
      toast.error("An error occurred during ledger compiling.");
    }
  };

  const getActionBadge = (action: string) => {
    let classes = "";
    switch (action) {
      case "Purchase":
        classes = "bg-green-500/10 text-green-700 dark:text-green-400 border-green-500/20";
        break;
      case "Cart Abandoned":
        classes = "bg-red-500/10 text-red-650 dark:text-red-400 border-red-500/20 animate-pulse";
        break;
      case "Add to Cart":
        classes = "bg-amber-500/10 text-amber-700 dark:text-amber-450 border-amber-500/20";
        break;
      case "Registration":
      case "Login":
        classes = "bg-blue-500/10 text-blue-700 dark:text-blue-400 border-blue-500/20";
        break;
      case "Search":
        classes = "bg-purple-500/10 text-purple-700 dark:text-purple-400 border-purple-500/20";
        break;
      case "Wishlist Action":
        classes = "bg-pink-500/10 text-pink-700 dark:text-pink-400 border-pink-500/20";
        break;
      default:
        classes = "bg-slate-500/10 text-slate-700 dark:text-slate-400 border-slate-500/10";
    }

    return (
      <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 text-xs font-bold border rounded-sm ${classes}`}>
        {action === "Purchase" && <ShoppingBag size={12} />}
        {action === "Cart Abandoned" && <TrendingDown size={12} />}
        {action === "Add to Cart" && <ShoppingCart size={12} />}
        {action === "Wishlist Action" && <Heart size={12} />}
        <span>{action}</span>
      </span>
    );
  };

  const getDeviceIcon = (device: string) => {
    switch (device) {
      case "Mobile":
        return <Smartphone size={14} className="text-muted-foreground" title="Mobile Client" />;
      case "Tablet":
        return <Tablet size={14} className="text-muted-foreground" title="Tablet Client" />;
      default:
        return <Laptop size={14} className="text-muted-foreground" title="Desktop Client" />;
    }
  };

  return (
    <div className="space-y-8 animate-fade-in text-slate-800 dark:text-slate-100 font-sans">
      {/* 1. Header & Live Controller */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b pb-6 border-border">
        <div>
          <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
            <ScrollText className="text-primary dark:text-[var(--hi-vis)]" size={30} /> User Behavior Audit Ledger
          </h1>
          <p className="text-muted-foreground mt-1 text-sm">
            Admin secure interface for tracking storefront activities, calculating funnel leakages, and auditing customer sessions.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {/* Live tracking state indicator */}
          <button
            onClick={() => setLiveMode(!liveMode)}
            className={`inline-flex items-center gap-2 h-10 px-4 rounded-sm text-xs font-bold border transition cursor-pointer ${
              liveMode
                ? "bg-green-500/5 text-green-600 border-green-500/20 hover:bg-green-500/10"
                : "bg-slate-100 text-slate-500 dark:bg-slate-900 border-slate-200 dark:border-slate-850 hover:bg-slate-200/50"
            }`}
          >
            <span className={`h-2.5 w-2.5 rounded-full ${liveMode ? "bg-green-500 animate-ping" : "bg-slate-400"}`} />
            <span>{liveMode ? "LIVE TELEMETRY MONITORING" : "MONITOR STATS PAUSED"}</span>
          </button>

          <button
            onClick={() => fetchLogs()}
            disabled={loading}
            className="inline-flex items-center justify-center gap-1.5 h-10 w-10 border border-input bg-background hover:bg-accent rounded-sm transition cursor-pointer"
            title="Refresh Ledger Logs"
          >
            <RefreshCw size={14} className={loading ? "animate-spin" : ""} />
          </button>

          <button
            onClick={exportLogsToCSV}
            className="inline-flex items-center gap-1.5 h-10 px-4 bg-[var(--hi-vis)] hover:brightness-95 text-black font-bold text-xs rounded-sm transition cursor-pointer shadow-sm"
          >
            <Download size={14} /> Export CSV Ledger
          </button>
        </div>
      </div>

      {/* 2. Top Funnel & Audit Summaries */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Metric 1: Cart Abandonment Rate */}
        <div className="bg-card border border-border p-6 rounded-md shadow-xs relative overflow-hidden flex flex-col justify-between">
          <div>
            <span className="text-xs uppercase tracking-wider text-muted-foreground font-semibold">Cart Abandonment Rate</span>
            <div className="flex items-baseline gap-2 mt-2">
              <h3 className="text-3xl font-extrabold text-red-650 dark:text-red-400 tracking-tight">
                {analytics.abandonRate}%
              </h3>
              <span className="text-[10px] text-muted-foreground">漏 Funnel Leakage</span>
            </div>
            {/* Visual progress bar */}
            <div className="w-full bg-slate-200 dark:bg-slate-800 h-1.5 rounded-full mt-3 overflow-hidden">
              <div 
                className="bg-red-500 h-full rounded-full transition-all duration-500" 
                style={{ width: `${analytics.abandonRate}%` }} 
              />
            </div>
          </div>
          <div className="text-[10px] text-muted-foreground mt-4 border-t pt-2 flex justify-between">
            <span>Abandons: <strong>{analytics.totalAbandons}</strong></span>
            <span>Purchases: <strong>{analytics.totalPurchases}</strong></span>
          </div>
        </div>

        {/* Metric 2: Total Recorded Telemetry */}
        <div className="bg-card border border-border p-6 rounded-md shadow-xs flex items-center justify-between">
          <div>
            <span className="text-xs uppercase tracking-wider text-muted-foreground font-semibold">Logged Activity Events</span>
            <h3 className="text-3xl font-extrabold mt-2 tracking-tight">{filteredLogs.length}</h3>
            <span className="text-[10px] text-muted-foreground inline-flex items-center gap-0.5 mt-2 font-medium">
              <Activity size={10} className="text-green-500" /> {logs.length} events cumulative
            </span>
          </div>
          <div className="h-12 w-12 rounded-sm bg-primary/10 flex items-center justify-center text-primary dark:text-[var(--hi-vis)] shrink-0">
            <ScrollText size={22} />
          </div>
        </div>

        {/* Metric 3: Unique Visitors */}
        <div className="bg-card border border-border p-6 rounded-md shadow-xs flex items-center justify-between">
          <div>
            <span className="text-xs uppercase tracking-wider text-muted-foreground font-semibold">Unique Mock Visitors</span>
            <h3 className="text-3xl font-extrabold mt-2 tracking-tight">{analytics.uniqueUsers}</h3>
            <span className="text-[10px] text-muted-foreground mt-2 block">Tracked via client IP hash</span>
          </div>
          <div className="h-12 w-12 rounded-sm bg-indigo-500/10 flex items-center justify-center text-indigo-500 shrink-0">
            <Globe size={22} />
          </div>
        </div>

        {/* Metric 4: Registered vs Guest Ratio */}
        <div className="bg-card border border-border p-6 rounded-md shadow-xs flex flex-col justify-between">
          <div>
            <span className="text-xs uppercase tracking-wider text-muted-foreground font-semibold">User Group Engagement</span>
            <div className="flex justify-between items-baseline mt-2">
              <h3 className="text-xl font-bold">
                {logs.filter(l => l.userType === "Registered").length} <span className="text-xs text-muted-foreground font-normal">B2B Profiles</span>
              </h3>
              <span className="text-xs font-semibold text-muted-foreground">vs</span>
              <h3 className="text-xl font-bold">
                {logs.filter(l => l.userType === "Guest").length} <span className="text-xs text-muted-foreground font-normal">Guests</span>
              </h3>
            </div>
            {/* Visual ratio bar */}
            <div className="w-full bg-slate-200 dark:bg-slate-800 h-1.5 rounded-full mt-4 overflow-hidden flex">
              <div 
                className="bg-blue-500 h-full transition-all duration-500" 
                style={{ width: `${(logs.filter(l => l.userType === "Registered").length / (logs.length || 1)) * 100}%` }} 
              />
              <div 
                className="bg-slate-400 h-full transition-all duration-500" 
                style={{ width: `${(logs.filter(l => l.userType === "Guest").length / (logs.length || 1)) * 100}%` }} 
              />
            </div>
          </div>
        </div>
      </div>

      {/* 3. Analytics Ranking Standings */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Most Viewed Products */}
        <div className="bg-card border border-border p-5 rounded-md shadow-xs flex flex-col justify-between">
          <div>
            <h3 className="font-bold text-sm tracking-wider uppercase text-muted-foreground border-b pb-2 mb-4 flex items-center gap-1.5">
              <Eye size={16} className="text-primary dark:text-[var(--hi-vis)]" /> Most Viewed PPE Items
            </h3>
            {analytics.mostViewed.length === 0 ? (
              <p className="text-xs text-muted-foreground py-8 text-center border border-dashed border-border rounded-sm">No page view logs captured yet.</p>
            ) : (
              <div className="space-y-4">
                {analytics.mostViewed.map((item: any, idx) => (
                  <div key={item.slug} className="space-y-1.5">
                    <div className="flex justify-between text-xs font-semibold">
                      <span className="truncate max-w-[200px]">{idx + 1}. {item.name}</span>
                      <span className="text-primary dark:text-yellow-400 font-bold shrink-0">{item.count} views</span>
                    </div>
                    <div className="w-full bg-slate-100 dark:bg-slate-800 h-1.5 rounded-full overflow-hidden">
                      <div 
                        className="bg-primary dark:bg-[var(--hi-vis)] h-full rounded-full" 
                        style={{ width: `${(item.count / (analytics.mostViewed[0]?.count || 1)) * 100}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Most Abandoned Products */}
        <div className="bg-card border border-border p-5 rounded-md shadow-xs flex flex-col justify-between">
          <div>
            <h3 className="font-bold text-sm tracking-wider uppercase text-muted-foreground border-b pb-2 mb-4 flex items-center gap-1.5">
              <TrendingDown size={16} className="text-red-500" /> High-Leakage Abandoned Items
            </h3>
            {analytics.mostAbandoned.length === 0 ? (
              <p className="text-xs text-muted-foreground py-8 text-center border border-dashed border-border rounded-sm">Zero cart abandonments registered!</p>
            ) : (
              <div className="space-y-4">
                {analytics.mostAbandoned.map((item: any, idx) => (
                  <div key={item.id} className="space-y-1.5">
                    <div className="flex justify-between text-xs font-semibold">
                      <span className="truncate max-w-[200px]">{idx + 1}. {item.name}</span>
                      <span className="text-red-500 font-bold shrink-0">{item.count} abandons</span>
                    </div>
                    <div className="w-full bg-slate-100 dark:bg-slate-800 h-1.5 rounded-full overflow-hidden">
                      <div 
                        className="bg-red-500 h-full rounded-full" 
                        style={{ width: `${(item.count / (analytics.mostAbandoned[0]?.count || 1)) * 100}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Most Searched Queries */}
        <div className="bg-card border border-border p-5 rounded-md shadow-xs flex flex-col justify-between">
          <div>
            <h3 className="font-bold text-sm tracking-wider uppercase text-muted-foreground border-b pb-2 mb-4 flex items-center gap-1.5">
              <Search size={16} className="text-purple-500" /> Hot B2B Product Searches
            </h3>
            {analytics.mostSearched.length === 0 ? (
              <p className="text-xs text-muted-foreground py-8 text-center border border-dashed border-border rounded-sm">No search keywords parsed yet.</p>
            ) : (
              <div className="space-y-4">
                {analytics.mostSearched.map((item: any, idx) => (
                  <div key={item.query} className="space-y-1.5">
                    <div className="flex justify-between text-xs font-semibold">
                      <span className="truncate max-w-[200px]">"{item.query}"</span>
                      <span className="text-purple-500 font-bold shrink-0">{item.count} searches</span>
                    </div>
                    <div className="w-full bg-slate-100 dark:bg-slate-800 h-1.5 rounded-full overflow-hidden">
                      <div 
                        className="bg-purple-500 h-full rounded-full" 
                        style={{ width: `${(item.count / (analytics.mostSearched[0]?.count || 1)) * 100}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* 4. Advanced Filter Console */}
      <div className="bg-card border border-border p-5 rounded-md shadow-xs space-y-4">
        <div className="flex items-center gap-2 text-xs uppercase tracking-wider text-muted-foreground font-bold border-b pb-2.5">
          <Filter size={14} className="text-primary dark:text-[var(--hi-vis)]" /> Advanced Ledger Filters
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          {/* Action type */}
          <div>
            <label className="block text-[10px] font-bold uppercase tracking-wider text-muted-foreground mb-1.5">Action / Interaction</label>
            <select
              value={actionFilter}
              onChange={(e) => setActionFilter(e.target.value as any)}
              className="w-full h-10 px-2.5 border border-input rounded-sm bg-background text-sm focus:outline-none focus:border-primary text-slate-800 dark:text-slate-100 font-medium"
            >
              <option value="All">All Interactions</option>
              <option value="Registration">Registrations</option>
              <option value="Login">Logins</option>
              <option value="Product View">Product Views</option>
              <option value="Category View">Category Browses</option>
              <option value="Search">Search Queries</option>
              <option value="Add to Cart">Add to Cart</option>
              <option value="Remove from Cart">Remove from Cart</option>
              <option value="Cart Abandoned">Abandoned Carts</option>
              <option value="Checkout Attempt">Checkout Attempts</option>
              <option value="Purchase">Completed Purchases</option>
              <option value="Wishlist Action">Wishlist Actions</option>
              <option value="Page View">Page View Spent</option>
            </select>
          </div>

          {/* User Type */}
          <div>
            <label className="block text-[10px] font-bold uppercase tracking-wider text-muted-foreground mb-1.5">Customer Type</label>
            <select
              value={userTypeFilter}
              onChange={(e) => setUserTypeFilter(e.target.value as any)}
              className="w-full h-10 px-2.5 border border-input rounded-sm bg-background text-sm focus:outline-none focus:border-primary text-slate-800 dark:text-slate-100 font-medium"
            >
              <option value="All">All Users</option>
              <option value="Registered">Registered B2B Profiles</option>
              <option value="Guest">Guest Visitors</option>
            </select>
          </div>

          {/* Date range preset */}
          <div>
            <label className="block text-[10px] font-bold uppercase tracking-wider text-muted-foreground mb-1.5">Date Range Filter</label>
            <select
              value={datePreset}
              onChange={(e) => setDatePreset(e.target.value as any)}
              className="w-full h-10 px-2.5 border border-input rounded-sm bg-background text-sm focus:outline-none focus:border-primary text-slate-800 dark:text-slate-100 font-medium"
            >
              <option value="All">All History</option>
              <option value="Today">Today (Past 24 Hours)</option>
              <option value="Last3">Past 3 Days</option>
              <option value="Last7">Past 7 Days</option>
            </select>
          </div>

          {/* Product Filter */}
          <div>
            <label className="block text-[10px] font-bold uppercase tracking-wider text-muted-foreground mb-1.5">Focus Product ID</label>
            <select
              value={selectedProduct}
              onChange={(e) => setSelectedProduct(e.target.value)}
              className="w-full h-10 px-2.5 border border-input rounded-sm bg-background text-sm focus:outline-none focus:border-primary text-slate-800 dark:text-slate-100 font-medium"
            >
              <option value="All">All Products</option>
              {products.map(p => (
                <option key={p.id} value={p.id}>{p.id} - {p.name.substring(0, 20)}...</option>
              ))}
            </select>
          </div>

          {/* Fuzzy Text Query Search */}
          <div>
            <label className="block text-[10px] font-bold uppercase tracking-wider text-muted-foreground mb-1.5">Search Metadata</label>
            <div className="relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="e.g. Thabo, Cape Town, 197.80.x.x"
                className="w-full h-10 pl-9 pr-3 border border-input rounded-sm bg-background text-sm focus:outline-none focus:border-primary text-slate-800 dark:text-slate-100"
              />
              <Search className="absolute left-3 top-3 text-muted-foreground" size={14} />
            </div>
          </div>
        </div>
      </div>

      {/* 5. Main Logs Ledger Table & Timeline Drawer Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-6 items-start">
        {/* Main Logs Table */}
        <div className="bg-card border border-border rounded-md shadow-xs overflow-hidden lg:col-span-1">
          <div className="p-4 border-b border-border flex items-center justify-between">
            <h3 className="font-bold text-sm uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
              <History size={16} className="text-primary dark:text-[var(--hi-vis)]" /> Live Ledger Entries ({filteredLogs.length} matching)
            </h3>
            {filteredLogs.length > 0 && (
              <span className="text-[10px] bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-800 rounded px-2 py-0.5 font-bold text-muted-foreground">
                Click any row for telemetry details
              </span>
            )}
          </div>

          {filteredLogs.length === 0 ? (
            <div className="py-24 text-center text-sm text-muted-foreground border border-dashed border-border m-6 rounded-sm">
              <ScrollText size={35} className="mx-auto text-slate-350 dark:text-slate-650 mb-3" />
              No activity logs matched your filtering parameters.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-secondary/40 text-[10px] uppercase tracking-wider text-muted-foreground border-b border-border">
                    <th className="px-4 py-3 font-bold">Time (SAST)</th>
                    <th className="px-4 py-3 font-bold">Action</th>
                    <th className="px-4 py-3 font-bold">User / Profile</th>
                    <th className="px-4 py-3 font-bold">Engagement Detail</th>
                    <th className="px-4 py-3 font-bold text-center">Device</th>
                    <th className="px-4 py-3 font-bold">Location</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border text-xs">
                  {filteredLogs.map((log) => {
                    const date = new Date(log.timestamp);
                    const formattedTime = date.toLocaleTimeString("en-ZA", { hour: "2-digit", minute: "2-digit", second: "2-digit" });
                    const formattedDate = date.toLocaleDateString("en-ZA", { month: "short", day: "numeric" });
                    
                    return (
                      <tr 
                        key={log.id} 
                        onClick={() => setSelectedLog(log)}
                        className={`cursor-pointer hover:bg-secondary/35 transition-colors ${
                          selectedLog?.id === log.id ? "bg-primary/5 dark:bg-[var(--hi-vis)]/5 border-l-2 border-primary dark:border-[var(--hi-vis)]" : ""
                        }`}
                      >
                        <td className="px-4 py-3.5 whitespace-nowrap">
                          <div className="font-bold text-foreground">{formattedTime}</div>
                          <div className="text-[10px] text-slate-450 font-semibold">{formattedDate}</div>
                        </td>
                        <td className="px-4 py-3.5 whitespace-nowrap">
                          {getActionBadge(log.actionType)}
                        </td>
                        <td className="px-4 py-3.5 max-w-[150px] truncate">
                          {log.userType === "Registered" ? (
                            <div>
                              <div className="font-bold text-foreground flex items-center gap-1">
                                <User size={10} className="text-primary dark:text-[var(--hi-vis)] shrink-0" />
                                <span className="truncate">{log.userName}</span>
                              </div>
                              <div className="text-[9px] text-slate-450 truncate">{log.userEmail}</div>
                            </div>
                          ) : (
                            <span className="font-medium text-slate-400 uppercase text-[10px] tracking-wider bg-slate-100 dark:bg-slate-800 px-1.5 py-0.5 rounded-sm">
                              Guest Buyer
                            </span>
                          )}
                        </td>
                        <td className="px-4 py-3.5 max-w-[200px] truncate">
                          {log.actionType === "Search" && (
                            <span className="italic font-mono text-purple-600 bg-purple-500/5 border border-purple-500/10 px-2 py-1 rounded">
                              query: "{log.searchQuery}"
                            </span>
                          )}
                          {log.actionType === "Product View" && (
                            <span className="font-medium">
                              Viewed: <strong>{log.targetName}</strong>
                            </span>
                          )}
                          {log.actionType === "Category View" && (
                            <span className="font-medium">
                              Browsed: <strong>{log.targetName}</strong>
                            </span>
                          )}
                          {log.actionType === "Add to Cart" && (
                            <span className="font-medium">
                              Added <strong>{log.targetName}</strong> ({formatZAR(log.cartTotal)})
                            </span>
                          )}
                          {log.actionType === "Remove from Cart" && (
                            <span className="font-medium text-slate-400 line-through">
                              Removed {log.targetName}
                            </span>
                          )}
                          {log.actionType === "Cart Abandoned" && (
                            <span className="text-red-500 font-medium">
                              Exited with ZAR {log.cartTotal?.toFixed(2)} in Cart
                            </span>
                          )}
                          {log.actionType === "Page View" && (
                            <span className="text-slate-500 font-medium">
                              Spent <strong>{log.durationSeconds}s</strong> on {log.targetId}
                            </span>
                          )}
                          {log.actionType === "Purchase" && (
                            <span className="font-bold text-green-600">
                              Placed {log.targetId} ({formatZAR(log.cartTotal)})
                            </span>
                          )}
                          {log.actionType === "Wishlist Action" && (
                            <span className="font-medium text-pink-600">
                              {log.targetName}
                            </span>
                          )}
                          {log.actionType === "Checkout Attempt" && (
                            <span className="font-medium text-amber-600">
                              Checkout Step 1 (Total: {formatZAR(log.cartTotal)})
                            </span>
                          )}
                          {log.actionType === "Login" && (
                            <span className="font-medium text-slate-500">
                              Authenticated Session Established
                            </span>
                          )}
                          {log.actionType === "Registration" && (
                            <span className="font-bold text-blue-500">
                              Created Customer Profile
                            </span>
                          )}
                        </td>
                        <td className="px-4 py-3.5 text-center whitespace-nowrap">
                          <div className="flex items-center justify-center gap-1">
                            {getDeviceIcon(log.deviceType)}
                            <span className="text-[10px] text-slate-450 font-semibold">{log.browserName}</span>
                          </div>
                        </td>
                        <td className="px-4 py-3.5 whitespace-nowrap">
                          <div className="font-semibold text-foreground flex items-center gap-1">
                            <MapPin size={10} className="text-red-500 shrink-0" />
                            <span>{log.location || "SAST Location"}</span>
                          </div>
                          <div className="text-[9px] text-slate-450 font-mono">{log.ipAddress || "127.0.0.1"}</div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Right Sidebar Timeline or Detail Drawer */}
        <div className="space-y-6 lg:col-span-1">
          {/* Detailed Telemetry Drawer (Show when selectedLog exists) */}
          {selectedLog ? (
            <div className="bg-card border-2 border-primary/30 dark:border-[var(--hi-vis)]/30 rounded-md p-5 shadow-lg space-y-4 animate-fade-in relative">
              <button 
                onClick={() => setSelectedLog(null)}
                className="absolute top-4 right-4 h-6 w-6 rounded-full hover:bg-secondary flex items-center justify-center text-muted-foreground hover:text-foreground cursor-pointer z-1 z-10"
              >
                <X size={14} />
              </button>

              <div className="flex items-center gap-2 border-b pb-3 mb-2">
                <Compass size={18} className="text-primary dark:text-[var(--hi-vis)]" />
                <h3 className="font-bold text-sm uppercase tracking-wider text-foreground">Telemetry Fingerprint</h3>
              </div>

              <div className="space-y-3.5 text-xs">
                {/* ID & Time */}
                <div className="p-3 bg-secondary/30 rounded-sm space-y-1">
                  <div className="flex justify-between"><strong className="text-slate-400">Log ID:</strong> <span className="font-mono text-[10px] font-bold">{selectedLog.id}</span></div>
                  <div className="flex justify-between"><strong className="text-slate-400">Date/Time:</strong> <span className="font-semibold">{new Date(selectedLog.timestamp).toLocaleString("en-ZA")}</span></div>
                  <div className="flex justify-between"><strong className="text-slate-400">Interaction:</strong> <span className="font-bold text-primary dark:text-yellow-400">{selectedLog.actionType}</span></div>
                </div>

                {/* User Info */}
                <div className="space-y-1 border-b pb-2">
                  <div className="text-[10px] font-bold text-slate-450 uppercase tracking-wider mb-1">User Identification</div>
                  <div className="flex justify-between"><strong className="text-slate-400">User Group:</strong> <span className="font-bold">{selectedLog.userType}</span></div>
                  {selectedLog.userType === "Registered" && (
                    <>
                      <div className="flex justify-between"><strong className="text-slate-400">Name:</strong> <span className="font-semibold">{selectedLog.userName}</span></div>
                      <div className="flex justify-between"><strong className="text-slate-400">Email:</strong> <span className="font-semibold font-mono text-[11px]">{selectedLog.userEmail}</span></div>
                      <div className="flex justify-between"><strong className="text-slate-400">Profile ID:</strong> <span className="font-mono text-[11px]">{selectedLog.userId}</span></div>
                    </>
                  )}
                </div>

                {/* Device & Client Telemetry */}
                <div className="space-y-1 border-b pb-2">
                  <div className="text-[10px] font-bold text-slate-450 uppercase tracking-wider mb-1">Client Telemetry</div>
                  <div className="flex justify-between"><strong className="text-slate-400">Device Platform:</strong> <span className="font-semibold flex items-center gap-1">{getDeviceIcon(selectedLog.deviceType)} {selectedLog.deviceType}</span></div>
                  <div className="flex justify-between"><strong className="text-slate-400">Browser Client:</strong> <span className="font-semibold">{selectedLog.browserName}</span></div>
                  <div className="flex justify-between"><strong className="text-slate-400">Operating System:</strong> <span className="font-semibold">{selectedLog.osName}</span></div>
                  <div className="flex justify-between"><strong className="text-slate-400">IP Address:</strong> <span className="font-semibold font-mono">{selectedLog.ipAddress}</span></div>
                  <div className="flex justify-between"><strong className="text-slate-400">Location Origin:</strong> <span className="font-semibold font-mono">{selectedLog.location}</span></div>
                  <div className="flex justify-between"><strong className="text-slate-400">Returning Visitor:</strong> <span className={`font-bold ${selectedLog.repeatVisit ? "text-green-500" : "text-slate-400"}`}>{selectedLog.repeatVisit ? "Yes (Repeat Customer)" : "No (First Visit)"}</span></div>
                </div>

                {/* Target Details */}
                <div className="space-y-1">
                  <div className="text-[10px] font-bold text-slate-450 uppercase tracking-wider mb-1">Audit Details</div>
                  {selectedLog.targetId && <div className="flex justify-between"><strong className="text-slate-400">Target ID:</strong> <span className="font-mono">{selectedLog.targetId}</span></div>}
                  {selectedLog.targetName && <div className="flex justify-between"><strong className="text-slate-400">Target Name:</strong> <span className="font-semibold">{selectedLog.targetName}</span></div>}
                  {selectedLog.searchQuery && <div className="flex justify-between"><strong className="text-slate-400">Search Query:</strong> <span className="font-semibold italic">"{selectedLog.searchQuery}"</span></div>}
                  {selectedLog.cartTotal !== undefined && <div className="flex justify-between"><strong className="text-slate-400">Cart/Transaction Total:</strong> <span className="font-bold text-foreground">{formatZAR(selectedLog.cartTotal)}</span></div>}
                  {selectedLog.durationSeconds !== undefined && <div className="flex justify-between"><strong className="text-slate-400">Spent Duration:</strong> <span className="font-semibold">{selectedLog.durationSeconds} seconds</span></div>}
                </div>

                {/* Code Highlighter JSON block */}
                <div className="pt-2">
                  <div className="text-[10px] font-bold text-slate-450 uppercase tracking-wider mb-1">Raw JSON Telemetry</div>
                  <pre className="p-3 bg-slate-900 border border-slate-800 rounded-sm text-green-400 font-mono text-[9px] overflow-x-auto max-h-[150px] leading-relaxed">
                    {JSON.stringify(selectedLog, null, 2)}
                  </pre>
                </div>
              </div>
            </div>
          ) : (
            /* Standard Real-time Activity Timeline Panel */
            <div className="bg-card border border-border rounded-md p-5 shadow-xs space-y-4">
              <div className="flex items-center gap-2 border-b pb-3">
                <Activity size={18} className="text-primary dark:text-[var(--hi-vis)] animate-pulse" />
                <h3 className="font-bold text-sm uppercase tracking-wider text-foreground">Real-Time Interaction Feed</h3>
              </div>

              {logs.length === 0 ? (
                <div className="py-12 text-center text-xs text-muted-foreground border border-dashed border-border rounded-sm">
                  Waiting for storefront events...
                </div>
              ) : (
                <div className="space-y-4 relative pl-4 border-l border-slate-200 dark:border-slate-800 max-h-[500px] overflow-y-auto pr-1">
                  {logs.slice(0, 10).map((log) => {
                    const date = new Date(log.timestamp);
                    const formattedTime = date.toLocaleTimeString("en-ZA", { hour: "2-digit", minute: "2-digit" });
                    
                    return (
                      <div key={log.id} className="relative space-y-1">
                        {/* Bullet point indicator */}
                        <div className={`absolute -left-[21px] top-1.5 h-2.5 w-2.5 rounded-full border bg-background transition ${
                          log.actionType === "Purchase" 
                            ? "border-green-500 bg-green-500 shadow-md ring-2 ring-green-500/20" 
                            : log.actionType === "Cart Abandoned"
                              ? "border-red-500 bg-red-500 shadow-md ring-2 ring-red-500/20"
                              : "border-slate-350 dark:border-slate-650"
                        }`} />

                        <div className="flex justify-between items-baseline gap-2">
                          <span className="text-[10px] font-bold uppercase tracking-wide text-slate-900 dark:text-white truncate max-w-[170px]">
                            {log.actionType}
                          </span>
                          <span className="text-[9px] font-bold text-slate-450 inline-flex items-center gap-0.5 whitespace-nowrap shrink-0">
                            <Clock size={8} /> {formattedTime}
                          </span>
                        </div>

                        <p className="text-[10px] text-muted-foreground leading-normal line-clamp-2">
                          {log.userType === "Registered" ? (
                            <strong>{log.userName}</strong>
                          ) : (
                            <span className="italic font-medium text-slate-400">Guest ({log.ipAddress})</span>
                          )}{" "}
                          {log.actionType === "Product View" && `viewed ${log.targetName}`}
                          {log.actionType === "Category View" && `browsed category ${log.targetName}`}
                          {log.actionType === "Search" && `searched for "${log.searchQuery}"`}
                          {log.actionType === "Add to Cart" && `added ${log.targetName} to cart`}
                          {log.actionType === "Remove from Cart" && `removed ${log.targetName} from cart`}
                          {log.actionType === "Cart Abandoned" && `abandoned a cart worth ${formatZAR(log.cartTotal)}`}
                          {log.actionType === "Page View" && `spent ${log.durationSeconds}s on ${log.targetId}`}
                          {log.actionType === "Purchase" && `completed purchase ${log.targetId}`}
                          {log.actionType === "Wishlist Action" && `${log.targetName}`}
                          {log.actionType === "Checkout Attempt" && `initiated checkout`}
                          {log.actionType === "Login" && `logged into account`}
                          {log.actionType === "Registration" && `registered a new account`}
                        </p>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {/* Analytical summary tip card */}
          <div className="bg-slate-900 border border-slate-800 rounded-md p-5 text-white">
            <h4 className="font-bold text-xs tracking-wider uppercase text-slate-400 flex items-center gap-1">
              <Globe size={13} className="text-[var(--hi-vis)]" /> Procurement Insights
            </h4>
            <p className="text-[11px] text-slate-400 mt-2.5 leading-relaxed">
              Analytics metrics help the SABS safety procurement team trace funnel leakage (such as users dropping off at step 2 delivery billing addresses) or optimize B2B corporate credit configurations for specific geographic locations.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
