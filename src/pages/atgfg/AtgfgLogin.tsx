import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import {
  Lock,
  ShieldCheck,
  ArrowRight,
  KeyRound,
  AlertCircle,
  ArrowLeft,
  Calendar,
  UserCheck
} from "lucide-react";
import multiEventPortalClient from "@/src/services/multiEventPortalClient";

export default function AtgfgLogin() {
  const navigate = useNavigate();
  const [loginMode, setLoginMode] = useState<"operator" | "master">("operator");

  // Event Operator Login state
  const [eventId, setEventId] = useState("");
  const [password, setPassword] = useState("");

  // Master Administrator Login state
  const [masterUsername, setMasterUsername] = useState("");
  const [masterPassword, setMasterPassword] = useState("");

  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (loginMode === "operator" && multiEventPortalClient.getEventToken()) {
      navigate("/event-portal/dashboard", { replace: true });
    }
  }, [loginMode, navigate]);

  const handleOperatorSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const res = await multiEventPortalClient.loginEventOperator(eventId, password);
      if (res.success && res.token) {
        navigate("/event-portal/dashboard", { replace: true });
      } else {
        setError(res.error || "Invalid event credentials");
      }
    } catch {
      setError("Unable to reach authentication server. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleMasterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const res = await multiEventPortalClient.loginMasterAdmin(masterUsername, masterPassword);
      if (res.success && res.token) {
        navigate("/event-portal/master", { replace: true });
      } else {
        setError(res.error || "Invalid master administrator credentials");
      }
    } catch {
      setError("Unable to reach authentication server. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0F172A] text-slate-100 flex flex-col justify-between p-6 font-sans">
      {/* Top Bar */}
      <header className="max-w-6xl w-full mx-auto flex items-center justify-between gap-8 py-2 border-b border-slate-800/80">
        <Link
          to="/"
          className="text-base font-bold tracking-tight text-white whitespace-nowrap shrink-0"
        >
          GeeksforGeeks × Marwadi University
        </Link>
        <nav className="hidden md:flex items-center gap-6 text-xs font-medium text-slate-400">
          <Link to="/events" className="hover:text-white transition-colors whitespace-nowrap shrink-0">
            Public Events
          </Link>
          <Link to="/certificate-data-entry" className="hover:text-white transition-colors whitespace-nowrap shrink-0">
            Certificate Entry
          </Link>
          <Link to="/admin-login" className="hover:text-white transition-colors whitespace-nowrap shrink-0">
            Chapter Admin
          </Link>
        </nav>
        <Link
          to="/"
          className="inline-flex items-center gap-2 px-3.5 py-1.5 text-xs font-medium text-slate-300 bg-slate-800/80 hover:bg-slate-800 rounded-lg transition-colors whitespace-nowrap shrink-0"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Website</span>
        </Link>
      </header>

      {/* Main Content */}
      <main className="w-full max-w-md mx-auto my-12">
        <div className="mb-8">
          <div className="text-xs text-slate-400 mb-2">
            <span>Multi-Event Operations Portal</span>
            <span className="mx-2" aria-hidden="true">·</span>
            <span>Isolated Apps Script Integration</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
            {loginMode === "operator" ? "Event Operator Sign In" : "Master Registry Sign In"}
          </h1>
          <p className="text-sm text-slate-400 mt-2 leading-relaxed">
            {loginMode === "operator"
              ? "Sign in with your assigned Event ID and event-specific operator secret to access your isolated event workspace."
              : "Authorized Master Administrators can provision events, configure Apps Script endpoints, manage credentials, and audit access logs."}
          </p>
        </div>

        {/* Mode Selector (Interactive Segmented Control) */}
        <div className="grid grid-cols-2 gap-1 p-1 bg-slate-900 border border-slate-800 rounded-lg mb-6">
          <button
            type="button"
            onClick={() => {
              setLoginMode("operator");
              setError(null);
            }}
            className={`px-3 py-2 text-xs font-semibold rounded-md transition-colors whitespace-nowrap shrink-0 flex items-center justify-center gap-2 cursor-pointer ${
              loginMode === "operator"
                ? "bg-slate-800 text-white shadow-sm"
                : "text-slate-400 hover:text-slate-200"
            }`}
          >
            <Calendar className="w-3.5 h-3.5" />
            <span>Event Operator</span>
          </button>
          <button
            type="button"
            onClick={() => {
              setLoginMode("master");
              setError(null);
            }}
            className={`px-3 py-2 text-xs font-semibold rounded-md transition-colors whitespace-nowrap shrink-0 flex items-center justify-center gap-2 cursor-pointer ${
              loginMode === "master"
                ? "bg-slate-800 text-white shadow-sm"
                : "text-slate-400 hover:text-slate-200"
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Master Administrator</span>
          </button>
        </div>

        {/* Form Container */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-6 sm:p-8">
          {error && (
            <div
              role="alert"
              className="mb-6 p-3.5 bg-red-950/50 border border-red-800/60 text-red-200 rounded-lg text-xs flex items-start gap-2.5"
            >
              <AlertCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          {loginMode === "operator" ? (
            <form onSubmit={handleOperatorSubmit} className="space-y-5">
              <div>
                <label
                  htmlFor="event-id-input"
                  className="block text-xs font-medium text-slate-300 mb-1.5"
                >
                  Assigned Event ID
                </label>
                <div className="relative">
                  <Calendar className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                  <input
                    id="event-id-input"
                    type="text"
                    required
                    autoComplete="username"
                    value={eventId}
                    onChange={(e) => setEventId(e.target.value.toUpperCase())}
                    placeholder="e.g. EVT-0001"
                    className="w-full h-11 bg-slate-950 border border-slate-800 focus:border-emerald-500 rounded-lg pl-10 pr-4 text-sm font-mono text-white placeholder:text-slate-600 outline-none transition-colors"
                  />
                </div>
                <p className="text-[11px] text-slate-400 mt-1.5">
                  Format: <span className="font-mono text-slate-300">EVT-0001</span>, <span className="font-mono text-slate-300">EVT-0002</span>, <span className="font-mono text-slate-300">EVT-0003</span>
                </p>
              </div>

              <div>
                <label
                  htmlFor="event-password-input"
                  className="block text-xs font-medium text-slate-300 mb-1.5"
                >
                  Event Operator Password
                </label>
                <div className="relative">
                  <KeyRound className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                  <input
                    id="event-password-input"
                    type="password"
                    required
                    autoComplete="current-password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter event secret assigned by Master Admin"
                    className="w-full h-11 bg-slate-950 border border-slate-800 focus:border-emerald-500 rounded-lg pl-10 pr-4 text-sm text-white placeholder:text-slate-600 outline-none transition-colors"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full h-11 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs rounded-lg transition-colors flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 whitespace-nowrap shrink-0"
              >
                <span>{loading ? "Verifying Event Credentials..." : "Sign In to Event Dashboard"}</span>
                {!loading && <ArrowRight className="w-4 h-4" />}
              </button>

              <div className="pt-4 border-t border-slate-800 text-xs text-slate-400 space-y-1">
                <div className="font-medium text-slate-300">Strict Session Isolation</div>
                <p>
                  Your session is cryptographically bound on the server to your authenticated Event ID. Cross-event queries and parameter modifications are blocked automatically.
                </p>
              </div>
            </form>
          ) : (
            <form onSubmit={handleMasterSubmit} className="space-y-5">
              <div>
                <label
                  htmlFor="master-username-input"
                  className="block text-xs font-medium text-slate-300 mb-1.5"
                >
                  Master Administrator Username
                </label>
                <div className="relative">
                  <UserCheck className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                  <input
                    id="master-username-input"
                    type="text"
                    required
                    autoComplete="username"
                    value={masterUsername}
                    onChange={(e) => setMasterUsername(e.target.value)}
                    placeholder="master_admin"
                    className="w-full h-11 bg-slate-950 border border-slate-800 focus:border-emerald-500 rounded-lg pl-10 pr-4 text-sm font-mono text-white placeholder:text-slate-600 outline-none transition-colors"
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor="master-password-input"
                  className="block text-xs font-medium text-slate-300 mb-1.5"
                >
                  Master Administrator Secret
                </label>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                  <input
                    id="master-password-input"
                    type="password"
                    required
                    autoComplete="current-password"
                    value={masterPassword}
                    onChange={(e) => setMasterPassword(e.target.value)}
                    placeholder="Enter master registry secret"
                    className="w-full h-11 bg-slate-950 border border-slate-800 focus:border-emerald-500 rounded-lg pl-10 pr-4 text-sm text-white placeholder:text-slate-600 outline-none transition-colors"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full h-11 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs rounded-lg transition-colors flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 whitespace-nowrap shrink-0"
              >
                <span>{loading ? "Authenticating Master Admin..." : "Open Master Registry Console"}</span>
                {!loading && <ArrowRight className="w-4 h-4" />}
              </button>

              <div className="pt-4 border-t border-slate-800 text-xs text-slate-400">
                Already signed in via Chapter Super Admin Google OAuth?{" "}
                <Link to="/event-portal/master" className="text-emerald-400 hover:underline font-medium">
                  Proceed directly to Master Console
                </Link>
              </div>
            </form>
          )}
        </div>
      </main>

      {/* Quiet Footer */}
      <footer className="max-w-6xl w-full mx-auto py-4 border-t border-slate-800/80 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-2">
        <span>GeeksforGeeks × Marwadi University Student Chapter</span>
        <span>Multi-Event Portal &amp; Isolated Apps Script Architecture</span>
      </footer>
    </div>
  );
}
