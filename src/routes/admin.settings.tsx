import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import {
  Sliders,
  Shield,
  FileText,
  Sun,
  Moon,
  Building,
  Mail,
  Phone,
  CheckCircle,
  HelpCircle,
  Lock,
} from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/admin/settings")({
  component: AdminSettings,
});

function AdminSettings() {
  const [activeTab, setActiveTab] = useState<"general" | "security" | "tax">("general");

  // Auth User Role Check
  const [user, setUser] = useState<{ email: string; name: string; role: string } | null>(null);
  const [theme, setTheme] = useState<"light" | "dark">("dark");

  useEffect(() => {
    // Session load
    const sessionStr = sessionStorage.getItem("cbalcool_admin_session");
    if (sessionStr) {
      try {
        setUser(JSON.parse(sessionStr));
      } catch {
        // ignore
      }
    }

    // Theme load
    const storedTheme = localStorage.getItem("cbalcool_admin_theme") as "light" | "dark";
    setTheme(storedTheme || "dark");
  }, []);

  const toggleTheme = (selectedTheme: "light" | "dark") => {
    setTheme(selectedTheme);
    localStorage.setItem("cbalcool_admin_theme", selectedTheme);
    if (selectedTheme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
    toast.success(`${selectedTheme.charAt(0).toUpperCase() + selectedTheme.slice(1)} theme enabled`);
  };

  return (
    <div className="space-y-6 max-w-4xl animate-fade-in font-sans">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">System Settings</h1>
        <p className="text-muted-foreground mt-1">
          Configure PPE corporate defaults, review SABS role authorization, and adjust dashboard settings.
        </p>
      </div>

      {/* Tabs Bar */}
      <div className="flex border-b border-border bg-card/40 p-1 rounded-sm gap-1">
        {[
          { id: "general", label: "General Preferences", icon: Sliders },
          { id: "security", label: "Security & Roles", icon: Shield },
          { id: "tax", label: "Taxation & Corporate", icon: FileText },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-2 px-4 py-2.5 text-xs font-bold rounded-xs transition-all cursor-pointer ${
                isActive
                  ? "bg-primary text-primary-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground hover:bg-secondary/40"
              }`}
            >
              <Icon size={14} />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Tab Panels */}
      <div className="bg-card border border-border rounded-md shadow-xs p-6">
        
        {/* Panel 1: General Preferences */}
        {activeTab === "general" && (
          <div className="space-y-6">
            <div>
              <h3 className="text-base font-bold text-foreground">Aesthetic Appearance</h3>
              <p className="text-xs text-muted-foreground mt-0.5">
                Toggle the executive dashboard visual layout style. Highly recommended to use Dark Mode for high-contrast visibility.
              </p>
              
              <div className="grid grid-cols-2 gap-4 mt-4">
                <button
                  onClick={() => toggleTheme("dark")}
                  className={`p-4 border rounded-sm flex flex-col items-center justify-center gap-3 transition cursor-pointer hover:border-primary/50 bg-secondary/10 ${
                    theme === "dark" ? "border-primary bg-primary/5 text-primary dark:text-[var(--hi-vis)]" : "border-border text-muted-foreground"
                  }`}
                >
                  <Moon size={24} />
                  <div className="text-center">
                    <span className="text-xs font-bold block">Professional Industrial (Dark)</span>
                    <span className="text-[10px] text-muted-foreground">Tailored for warehouses & depot lights</span>
                  </div>
                </button>

                <button
                  onClick={() => toggleTheme("light")}
                  className={`p-4 border rounded-sm flex flex-col items-center justify-center gap-3 transition cursor-pointer hover:border-primary/50 bg-secondary/10 ${
                    theme === "light" ? "border-primary bg-primary/5 text-primary" : "border-border text-muted-foreground"
                  }`}
                >
                  <Sun size={24} />
                  <div className="text-center">
                    <span className="text-xs font-bold block">Daylight Office (Light)</span>
                    <span className="text-[10px] text-muted-foreground">Optimized for high-glare setups</span>
                  </div>
                </button>
              </div>
            </div>

            <div className="border-t border-border pt-6">
              <h3 className="text-base font-bold text-foreground">Operational Status</h3>
              <p className="text-xs text-muted-foreground mt-0.5">
                Your currently active session credentials.
              </p>
              
              <div className="bg-secondary/20 p-4 border border-border/80 rounded-sm mt-4 grid sm:grid-cols-2 gap-4">
                <div>
                  <span className="text-[10px] uppercase font-bold tracking-wider text-muted-foreground">Authorized Officer</span>
                  <div className="text-sm font-bold text-foreground mt-0.5">{user?.name || "Alexander Stone"}</div>
                  <div className="text-xs text-muted-foreground">{user?.email || "admin@cbalcool.co.za"}</div>
                </div>
                <div>
                  <span className="text-[10px] uppercase font-bold tracking-wider text-muted-foreground">Security Clearance</span>
                  <div className="inline-flex items-center gap-1 bg-primary/10 text-primary dark:text-[var(--hi-vis)] text-xs font-bold px-2.5 py-0.5 rounded-sm mt-1">
                    <Shield size={12} />
                    <span>{user?.role || "Admin"} Mode</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Panel 2: Security & Roles */}
        {activeTab === "security" && (
          <div className="space-y-6">
            <div>
              <div className="flex items-center gap-2">
                <Lock className="text-primary dark:text-[var(--hi-vis)]" size={18} />
                <h3 className="text-base font-bold text-foreground">Role-Based Access Control (RBAC)</h3>
              </div>
              <p className="text-xs text-muted-foreground mt-0.5">
                We enforce dual role restrictions to safeguard our central SABS-compliant catalog database from unverified overwrites.
              </p>
            </div>

            <div className="space-y-4 mt-6">
              {/* Role 1: Admin */}
              <div className="border border-border/80 bg-secondary/15 p-4 rounded-sm">
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="text-sm font-bold text-foreground">1. System Administrator (Admin)</h4>
                    <p className="text-xs text-muted-foreground mt-1">
                      Full read and write capabilities. Designed for procurement managers and catalogue coordinators.
                    </p>
                  </div>
                  <span className="bg-green-500/10 text-green-600 dark:text-green-500 text-[10px] font-bold px-2 py-0.5 rounded-sm uppercase tracking-wider">
                    Full Access
                  </span>
                </div>
                <div className="mt-3 grid grid-cols-2 sm:grid-cols-3 gap-2 text-xs font-semibold text-slate-500 dark:text-slate-400">
                  <div className="flex items-center gap-1.5"><CheckCircle size={12} className="text-green-600" /> Create/Modify Products</div>
                  <div className="flex items-center gap-1.5"><CheckCircle size={12} className="text-green-600" /> Replenish Stock Levels</div>
                  <div className="flex items-center gap-1.5"><CheckCircle size={12} className="text-green-600" /> Add/Edit Categories</div>
                  <div className="flex items-center gap-1.5"><CheckCircle size={12} className="text-green-600" /> Discontinue Products</div>
                  <div className="flex items-center gap-1.5"><CheckCircle size={12} className="text-green-600" /> Dispatch Orders</div>
                  <div className="flex items-center gap-1.5"><CheckCircle size={12} className="text-green-600" /> Print Tax Invoices</div>
                </div>
              </div>

              {/* Role 2: Manager */}
              <div className="border border-border/80 bg-secondary/15 p-4 rounded-sm">
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="text-sm font-bold text-foreground">2. Store / Depot Manager (Manager)</h4>
                    <p className="text-xs text-muted-foreground mt-1">
                      Read-only audit capabilities. Tailored for warehouse floor supervisors, sales clerks, and logistics officers.
                    </p>
                  </div>
                  <span className="bg-amber-500/10 text-amber-600 dark:text-amber-500 text-[10px] font-bold px-2 py-0.5 rounded-sm uppercase tracking-wider">
                    Read-Only
                  </span>
                </div>
                <div className="mt-3 grid grid-cols-2 sm:grid-cols-3 gap-2 text-xs font-semibold text-slate-500 dark:text-slate-400">
                  <div className="flex items-center gap-1.5"><CheckCircle size={12} className="text-green-600" /> View Order Pipelines</div>
                  <div className="flex items-center gap-1.5"><CheckCircle size={12} className="text-green-600" /> Review Customer Records</div>
                  <div className="flex items-center gap-1.5"><CheckCircle size={12} className="text-green-600" /> Read Catalog Specs</div>
                  <div className="flex items-center gap-1.5"><HelpCircle size={12} className="text-amber-500" /> Blocked from edits</div>
                  <div className="flex items-center gap-1.5"><HelpCircle size={12} className="text-amber-500" /> Blocked from deletion</div>
                  <div className="flex items-center gap-1.5"><HelpCircle size={12} className="text-amber-500" /> Blocked from replenishing</div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Panel 3: Taxation & Corporate Info */}
        {activeTab === "tax" && (
          <div className="space-y-6">
            <div>
              <h3 className="text-base font-bold text-foreground">SARS Corporate Declarations</h3>
              <p className="text-xs text-muted-foreground mt-0.5">
                Standard corporate profiles used in compiling legal VAT tax invoice printouts generated in order dispatch workflows.
              </p>
            </div>

            <div className="grid sm:grid-cols-2 gap-6 mt-6">
              {/* Left Column */}
              <div className="space-y-4">
                <div>
                  <label className="text-[10px] uppercase font-bold tracking-wider text-muted-foreground block">Corporate Trading Entity</label>
                  <div className="text-sm font-bold text-foreground mt-1 flex items-center gap-2">
                    <Building size={14} className="text-muted-foreground" />
                    <span>CBALCOOL PPE (Pty) Ltd</span>
                  </div>
                </div>

                <div>
                  <label className="text-[10px] uppercase font-bold tracking-wider text-muted-foreground block">SARS VAT Registration Number</label>
                  <div className="text-sm font-bold text-foreground mt-1">
                    <span>VAT 4010293847</span>
                  </div>
                  <p className="text-[10px] text-muted-foreground">Standard 15% South African VAT rate applies automatically to catalog prices.</p>
                </div>

                <div>
                  <label className="text-[10px] uppercase font-bold tracking-wider text-muted-foreground block">Registered Depot Address</label>
                  <div className="text-sm font-bold text-foreground mt-1 leading-relaxed">
                    <span>42 Witkoppen Road, Fourways<br />Johannesburg, Gauteng, 2055</span>
                  </div>
                </div>
              </div>

              {/* Right Column */}
              <div className="space-y-4 bg-secondary/10 p-5 border border-border/60 rounded-sm">
                <h4 className="text-xs font-bold uppercase tracking-wider text-foreground">Procurement Support Desk</h4>
                <p className="text-[11px] text-muted-foreground leading-normal">
                  If there are disputes regarding catalog entries, order returns, or billing audits, contact the logistics command post:
                </p>
                
                <div className="space-y-2 mt-4 text-xs font-semibold text-foreground">
                  <div className="flex items-center gap-2">
                    <Mail size={13} className="text-primary" />
                    <span>logistics@cbalcool.co.za</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Phone size={13} className="text-primary" />
                    <span>+27 11 555 0199 (JHB Depot)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Phone size={13} className="text-primary" />
                    <span>+27 21 444 9800 (CT Branch)</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
