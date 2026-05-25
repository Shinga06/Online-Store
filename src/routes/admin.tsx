import { createFileRoute, Outlet, Link, useLocation, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import {
  LayoutDashboard,
  Boxes,
  ClipboardList,
  Users,
  Tags,
  AlertTriangle,
  Settings,
  LogOut,
  Sun,
  Moon,
  Plus,
  Shield,
  Menu,
  X,
  User,
  ScrollText,
} from "lucide-react";
import { useDb } from "@/hooks/use-db";
import { toast } from "sonner";
import { Logo } from "@/components/Logo";

export const Route = createFileRoute("/admin")({
  component: AdminLayout,
});

function AdminLayout() {
  const location = useLocation();
  const navigate = useNavigate();
  const { products, orders } = useDb();

  const isLoginPage = location.pathname === "/admin/login";

  // Authentication State
  const [user, setUser] = useState<{ email: string; name: string; role: string } | null>(null);
  const [checkingAuth, setCheckingAuth] = useState(true);

  // Layout Theme State
  const [theme, setTheme] = useState<"light" | "dark">("dark");

  // Mobile Sidebar State
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    // 1. Session and Auth Check
    const sessionStr = sessionStorage.getItem("cbalcool_admin_session");
    if (sessionStr) {
      try {
        setUser(JSON.parse(sessionStr));
      } catch {
        sessionStorage.removeItem("cbalcool_admin_session");
      }
    }
    setCheckingAuth(false);

    // 2. Load Theme from LocalStorage or Default to Dark (professional industrial dark theme fits PPE best)
    const storedTheme = localStorage.getItem("cbalcool_admin_theme") as "light" | "dark";
    const selectedTheme = storedTheme || "dark";
    setTheme(selectedTheme);
    
    if (selectedTheme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [location.pathname]);

  // Auth Protection Redirect
  useEffect(() => {
    if (!checkingAuth && !user && !isLoginPage) {
      toast.error("Authentication required", { description: "Please log in to access the administrator panel." });
      navigate({ to: "/admin/login" });
    }
  }, [user, checkingAuth, isLoginPage]);

  // Reroute back to index if already logged in and visiting login page
  useEffect(() => {
    if (!checkingAuth && user && isLoginPage) {
      navigate({ to: "/admin" });
    }
  }, [user, checkingAuth, isLoginPage]);

  const toggleTheme = () => {
    const newTheme = theme === "light" ? "dark" : "light";
    setTheme(newTheme);
    localStorage.setItem("cbalcool_admin_theme", newTheme);
    if (newTheme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
    toast.success(`${newTheme.charAt(0).toUpperCase() + newTheme.slice(1)} theme enabled`);
  };

  const handleLogout = () => {
    sessionStorage.removeItem("cbalcool_admin_session");
    setUser(null);
    toast.success("Logged out successfully");
    navigate({ to: "/admin/login" });
  };

  if (checkingAuth) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center text-white font-sans">
        <div className="flex flex-col items-center gap-3">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-t-[var(--hi-vis)] border-slate-700"></div>
          <span className="text-xs uppercase tracking-wider text-muted-foreground">Checking Session...</span>
        </div>
      </div>
    );
  }

  // Login page should not render sidebar layout
  if (isLoginPage) {
    return (
      <div className="min-h-screen bg-slate-950 text-white font-sans">
        <Outlet />
      </div>
    );
  }

  // Count active badges for Sidebar
  const lowStockCount = products.filter((p) => p.stock <= 5).length;
  const pendingOrdersCount = orders.filter((o) => o.status === "Pending").length;

  const sidebarLinks = [
    { label: "Dashboard", to: "/admin", icon: LayoutDashboard },
    { label: "Products", to: "/admin/products", icon: Boxes },
    {
      label: "Orders",
      to: "/admin/orders",
      icon: ClipboardList,
      badge: pendingOrdersCount > 0 ? pendingOrdersCount : undefined,
      badgeColor: "bg-[var(--hi-vis)] text-black",
    },
    { label: "Customers", to: "/admin/customers", icon: Users },
    { label: "Categories", to: "/admin/categories", icon: Tags },
    {
      label: "Inventory",
      to: "/admin/inventory",
      icon: AlertTriangle,
      badge: lowStockCount > 0 ? lowStockCount : undefined,
      badgeColor: "bg-destructive text-white",
    },
    { label: "Audit Logs", to: "/admin/logs", icon: ScrollText },
    { label: "Settings", to: "/admin/settings", icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-background text-foreground font-sans flex flex-col md:flex-row">
      {/* 1. Sidebar Left (Desktop) */}
      <aside className="hidden md:flex md:w-64 bg-slate-900 border-r border-border dark:bg-slate-950 flex-col shrink-0 text-slate-300">
        <div className="h-16 px-6 border-b border-border flex items-center justify-between">
          <Link to="/" className="flex items-center hover:opacity-95 transition-opacity">
            <Logo variant="sidebar" subTextType="control" />
          </Link>
          <div className="bg-slate-800 text-[10px] text-slate-400 font-bold px-2 py-0.5 rounded-sm flex items-center gap-1">
            <Shield size={10} className="text-[var(--hi-vis)]" />
            {user?.role}
          </div>
        </div>

        {/* Sidebar Nav Links */}
        <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto">
          {sidebarLinks.map((link) => {
            const Icon = link.icon;
            const isActive = location.pathname === link.to;
            return (
              <Link
                key={link.to}
                to={link.to}
                className={`flex items-center gap-3 px-3 h-11 rounded-sm text-sm font-medium transition-colors ${
                  isActive
                    ? "bg-[var(--hi-vis)] text-black font-semibold"
                    : "text-slate-400 hover:text-white hover:bg-slate-800/50"
                }`}
              >
                <Icon size={18} className="shrink-0" />
                <span className="flex-1">{link.label}</span>
                {link.badge !== undefined && (
                  <span className={`h-5 min-w-5 px-1.5 rounded-full text-[10px] font-bold grid place-items-center ${link.badgeColor}`}>
                    {link.badge}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>

        {/* Sidebar Footer */}
        <div className="p-4 border-t border-border bg-slate-900/60 dark:bg-slate-950/60 flex flex-col gap-2">
          <div className="flex items-center gap-3 px-2 py-1">
            <div className="h-8 w-8 rounded-full bg-slate-800 flex items-center justify-center text-slate-300">
              <User size={16} />
            </div>
            <div className="min-w-0">
              <div className="text-xs font-semibold text-white truncate">{user?.name}</div>
              <div className="text-[10px] text-slate-500 truncate">{user?.email}</div>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 px-3 h-10 w-full rounded-sm text-sm font-medium text-slate-400 hover:text-white hover:bg-slate-800/80 transition-colors cursor-pointer"
          >
            <LogOut size={16} />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* 2. Mobile Nav Header */}
      <header className="md:hidden bg-slate-900 dark:bg-slate-950 text-slate-100 border-b border-border h-16 px-4 flex items-center justify-between shrink-0">
        <button onClick={() => setSidebarOpen(true)} aria-label="Open navigation menu">
          <Menu size={22} />
        </button>

        <Link to="/admin" className="flex items-center hover:opacity-95 transition-opacity">
          <Logo variant="sidebar" subTextType="control" />
        </Link>

        <button onClick={toggleTheme} className="p-2 bg-slate-800 rounded-sm hover:bg-slate-700" aria-label="Toggle theme">
          {theme === "light" ? <Moon size={16} /> : <Sun size={16} />}
        </button>
      </header>

      {/* 3. Mobile Sidebar Drawer */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-50 md:hidden flex animate-fade-in">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-xs" onClick={() => setSidebarOpen(false)} />
          <aside className="relative w-64 bg-slate-900 border-r border-border flex flex-col text-slate-300 p-5 overflow-y-auto">
            <div className="flex items-center justify-between mb-8">
              <div className="font-bold text-sm text-white">CONTROL MENU</div>
              <button onClick={() => setSidebarOpen(false)} aria-label="Close menu"><X size={20} /></button>
            </div>
            
            <nav className="flex-1 space-y-1">
              {sidebarLinks.map((link) => {
                const Icon = link.icon;
                const isActive = location.pathname === link.to;
                return (
                  <Link
                    key={link.to}
                    to={link.to}
                    onClick={() => setSidebarOpen(false)}
                    className={`flex items-center gap-3 px-3 h-11 rounded-sm text-sm font-medium transition-colors ${
                      isActive
                        ? "bg-[var(--hi-vis)] text-black font-semibold"
                        : "text-slate-400 hover:text-white hover:bg-slate-800"
                    }`}
                  >
                    <Icon size={18} />
                    <span className="flex-1">{link.label}</span>
                    {link.badge !== undefined && (
                      <span className={`h-5 min-w-5 px-1.5 rounded-full text-[10px] font-bold grid place-items-center ${link.badgeColor}`}>
                        {link.badge}
                      </span>
                    )}
                  </Link>
                );
              })}
            </nav>

            <div className="border-t border-border mt-6 pt-6 space-y-4">
              <div className="flex items-center gap-3">
                <div className="h-8 w-8 rounded-full bg-slate-850 flex items-center justify-center">
                  <User size={16} />
                </div>
                <div>
                  <div className="text-xs font-semibold text-white">{user?.name}</div>
                  <div className="text-[10px] text-slate-500">{user?.role}</div>
                </div>
              </div>
              <button
                onClick={handleLogout}
                className="flex items-center gap-3 px-3 h-10 w-full rounded-sm text-sm font-medium text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
              >
                <LogOut size={16} />
                <span>Sign Out</span>
              </button>
            </div>
          </aside>
        </div>
      )}

      {/* 4. Main Admin Content Area */}
      <div className="flex-1 flex flex-col min-w-0 bg-slate-50 dark:bg-slate-900">
        {/* Desktop Top Header Bar */}
        <header className="hidden md:flex h-16 border-b border-border bg-card dark:bg-slate-950 shrink-0 px-8 items-center justify-between">
          <div className="flex items-center gap-4">
            <h2 className="text-sm uppercase tracking-wider text-muted-foreground font-semibold">
              PPE Executive Management Desk
            </h2>
            <div className="h-4 w-px bg-border"></div>
            <div className="text-xs text-muted-foreground">
              {new Date().toLocaleDateString("en-ZA", {
                weekday: "long",
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Quick action buttons */}
            <Link
              to="/admin/products"
              className="inline-flex items-center gap-1.5 text-xs bg-primary hover:bg-primary/95 text-primary-foreground font-semibold h-9 px-3 rounded-sm transition cursor-pointer"
            >
              <Plus size={14} /> Add Product
            </Link>

            <button
              onClick={toggleTheme}
              className="p-2 border border-input rounded-sm bg-background hover:bg-accent cursor-pointer transition text-foreground"
              title="Toggle theme"
            >
              {theme === "light" ? <Moon size={16} /> : <Sun size={16} />}
            </button>

            <div className="h-6 w-px bg-border"></div>

            <div className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-full bg-secondary flex items-center justify-center font-bold text-xs text-foreground uppercase border border-border">
                {user?.name.slice(0, 2)}
              </div>
              <div className="text-left leading-tight hidden lg:block">
                <div className="text-xs font-bold text-foreground">{user?.name}</div>
                <div className="text-[10px] text-muted-foreground">{user?.role}</div>
              </div>
            </div>
          </div>
        </header>

        {/* Viewport for Child Route Contents */}
        <main className="flex-1 p-6 md:p-8 overflow-y-auto min-h-0">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
