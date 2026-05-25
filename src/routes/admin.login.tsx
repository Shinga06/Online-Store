import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useState } from "react";
import { ShieldAlert, ShieldCheck, Mail, Lock, Loader2, ArrowLeft } from "lucide-react";
import { toast } from "sonner";
import { Logo } from "@/components/Logo";

export const Route = createFileRoute("/admin/login")({
  component: AdminLoginPage,
});

function AdminLoginPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (loading) return;
    setLoading(true);

    // Simulate small latency for realistic security check feel
    setTimeout(() => {
      const emailTrim = email.toLowerCase().trim();
      
      let matchedUser = null;
      if (emailTrim === "admin@cbalcool.co.za" && password === "admin123") {
        matchedUser = { email: emailTrim, name: "Alexander Stone", role: "Admin" };
      } else if (emailTrim === "manager@cbalcool.co.za" && password === "admin123") {
        matchedUser = { email: emailTrim, name: "Sibongile Dube", role: "Manager" };
      }

      if (matchedUser) {
        sessionStorage.setItem("cbalcool_admin_session", JSON.stringify(matchedUser));
        toast.success(`Welcome back, ${matchedUser.name}!`, { description: `Logged in as ${matchedUser.role}.` });
        setLoading(false);
        navigate({ to: "/admin" });
      } else {
        toast.error("Invalid credentials", { description: "Please verify your email and password and try again." });
        setLoading(false);
      }
    }, 800);
  };

  const handleQuickLogin = (role: "Admin" | "Manager") => {
    if (role === "Admin") {
      setEmail("admin@cbalcool.co.za");
      setPassword("admin123");
      toast.info("Pre-filled Admin Credentials");
    } else {
      setEmail("manager@cbalcool.co.za");
      setPassword("admin123");
      toast.info("Pre-filled Manager Credentials");
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col justify-center py-12 sm:px-6 lg:px-8 relative overflow-hidden font-sans">
      {/* Background aesthetics */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-blue-900/10 via-slate-950 to-slate-950 pointer-events-none"></div>
      <div className="absolute -top-40 -right-40 h-80 w-80 bg-blue-500/5 blur-3xl rounded-full pointer-events-none"></div>
      
      {/* Front-Store Link */}
      <div className="absolute top-6 left-6 z-10">
        <a href="/" className="inline-flex items-center gap-2 text-slate-400 hover:text-white text-xs font-semibold uppercase tracking-wider transition-colors">
          <ArrowLeft size={14} /> Back to Storefront
        </a>
      </div>

      <div className="sm:mx-auto sm:w-full sm:max-w-md relative z-10 px-4">
        <div className="flex justify-center mb-1">
          <Logo variant="large" subTextType="control" />
        </div>
        <p className="mt-2 text-center text-sm text-slate-400">
          Sign in to securely manage products, orders, and stocks in real time.
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md relative z-10 px-4">
        <div className="bg-slate-900 border border-slate-800 rounded-md py-8 px-6 sm:px-10 shadow-xl shadow-black/40">
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div>
              <label htmlFor="email" className="block text-xs font-semibold uppercase tracking-wider text-slate-400">
                Email Address
              </label>
              <div className="mt-1.5 relative rounded-sm shadow-xs">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-500">
                  <Mail size={16} />
                </div>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@cbalcool.co.za"
                  className="block w-full h-11 pl-10 pr-3 border border-slate-800 rounded-sm bg-slate-950 text-slate-100 placeholder-slate-600 text-sm focus:outline-none focus:border-[var(--hi-vis)] focus:ring-1 focus:ring-[var(--hi-vis)] transition-all"
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-xs font-semibold uppercase tracking-wider text-slate-400">
                Password
              </label>
              <div className="mt-1.5 relative rounded-sm shadow-xs">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-500">
                  <Lock size={16} />
                </div>
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="block w-full h-11 pl-10 pr-3 border border-slate-800 rounded-sm bg-slate-950 text-slate-100 placeholder-slate-600 text-sm focus:outline-none focus:border-[var(--hi-vis)] focus:ring-1 focus:ring-[var(--hi-vis)] transition-all"
                />
              </div>
            </div>

            <div>
              <button
                type="submit"
                disabled={loading}
                className="w-full h-11 bg-[var(--hi-vis)] hover:brightness-95 text-black font-bold rounded-sm text-sm tracking-wider uppercase flex items-center justify-center gap-2 transition cursor-pointer shadow-md shadow-yellow-500/5 disabled:opacity-55 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <>
                    <Loader2 className="animate-spin" size={16} />
                    <span>Signing In...</span>
                  </>
                ) : (
                  <span>Access Control Panel</span>
                )}
              </button>
            </div>
          </form>

          {/* Quick login aids */}
          <div className="mt-8 border-t border-slate-800 pt-6">
            <div className="relative flex justify-center text-xs uppercase tracking-wider">
              <span className="bg-slate-900 px-3 text-slate-500 font-semibold">Quick-Access Seeding</span>
            </div>
            <div className="mt-4 grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => handleQuickLogin("Admin")}
                className="inline-flex items-center justify-center gap-1.5 px-3 py-2 border border-slate-800 rounded-sm bg-slate-950 hover:bg-slate-800/40 text-xs font-medium text-slate-300 transition cursor-pointer"
              >
                <ShieldCheck size={14} className="text-emerald-500 animate-pulse" />
                <span>Stone (Admin)</span>
              </button>
              <button
                type="button"
                onClick={() => handleQuickLogin("Manager")}
                className="inline-flex items-center justify-center gap-1.5 px-3 py-2 border border-slate-800 rounded-sm bg-slate-950 hover:bg-slate-800/40 text-xs font-medium text-slate-300 transition cursor-pointer"
              >
                <ShieldAlert size={14} className="text-amber-500 animate-pulse" />
                <span>Dube (Manager)</span>
              </button>
            </div>
            <div className="mt-3 text-[10px] text-center text-slate-500 leading-normal">
              Admin grants full write authority.<br />Manager role has operational view limitations.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
