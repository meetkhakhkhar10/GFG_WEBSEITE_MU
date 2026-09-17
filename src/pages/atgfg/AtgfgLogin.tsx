import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "motion/react";
import { Lock, User, ShieldCheck, Sparkles, ArrowRight, KeyRound, AlertCircle } from "lucide-react";
import atgfgAuth from "@/src/services/atgfgAuth";

export default function AtgfgLogin() {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // If already authenticated, redirect immediately
  React.useEffect(() => {
    if (atgfgAuth.isAuthenticated()) {
      navigate("/atgfg/dashboard", { replace: true });
    }
  }, [navigate]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    setTimeout(() => {
      const res = atgfgAuth.login(username, password);
      if (res.success) {
        navigate("/atgfg/dashboard", { replace: true });
      } else {
        setError(res.error || "Invalid username or password");
        setLoading(false);
      }
    }, 400);
  };

  return (
    <div className="min-h-screen bg-[#090D16] text-white flex flex-col justify-center items-center p-4 relative font-sans overflow-hidden">
      {/* Background ambient lighting */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[500px] h-[500px] bg-[#00ff88]/10 blur-[160px] rounded-full pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-80 h-80 bg-emerald-600/10 blur-[140px] rounded-full pointer-events-none" />

      <div className="w-full max-w-md relative z-10">
        {/* Brand Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 mb-4 text-[10px] font-black tracking-widest text-[#00ff88] uppercase bg-[#00ff88]/10 border border-[#00ff88]/20 rounded-full shadow-sm">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Attendance & Operations System</span>
          </div>

          <h1 className="text-3xl font-black tracking-tight text-white uppercase italic">
            GeeksforGeeks <span className="text-[#00ff88]">MU</span>
          </h1>
          <p className="text-slate-400 text-xs font-semibold mt-1">
            Attendance Admin Portal Access Control
          </p>
        </motion.div>

        {/* Login Card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3 }}
          className="bg-[#0F172A]/90 border border-slate-800 rounded-3xl p-8 shadow-2xl backdrop-blur-xl relative overflow-hidden"
        >
          {/* Decorative Corner Bar */}
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-emerald-500 via-[#00ff88] to-emerald-500" />

          {error && (
            <div className="mb-6 p-4 bg-rose-500/10 border border-rose-500/30 text-rose-400 rounded-2xl text-xs flex items-center space-x-3">
              <AlertCircle className="w-5 h-5 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-[11px] font-black uppercase tracking-wider text-slate-300 mb-2">
                Admin Username
              </label>
              <div className="relative">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                <input
                  type="text"
                  required
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Enter admin username"
                  className="w-full h-12 bg-slate-950 border border-slate-800 focus:border-[#00ff88] rounded-2xl pl-11 pr-4 text-sm font-semibold text-white placeholder:text-slate-600 outline-none transition-colors"
                />
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-black uppercase tracking-wider text-slate-300 mb-2">
                Admin Password
              </label>
              <div className="relative">
                <KeyRound className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter admin password"
                  className="w-full h-12 bg-slate-950 border border-slate-800 focus:border-[#00ff88] rounded-2xl pl-11 pr-4 text-sm font-semibold text-white placeholder:text-slate-600 outline-none transition-colors"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full h-12 mt-2 bg-[#00ff88] hover:bg-emerald-400 text-slate-950 font-black uppercase text-xs tracking-wider rounded-2xl transition-all shadow-lg shadow-[#00ff88]/15 flex items-center justify-center space-x-2 cursor-pointer disabled:opacity-50"
            >
              {loading ? (
                <>
                  <Sparkles className="w-4 h-4 animate-spin" />
                  <span>AUTHENTICATING...</span>
                </>
              ) : (
                <>
                  <span>LOGIN TO ATTENDANCE PORTAL</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Quick Notice */}
          <div className="mt-8 pt-6 border-t border-slate-800/80 text-center text-[11px] text-slate-400 font-mono">
            Protected Admin Route <span className="text-[#00ff88]">/atgfg</span>
          </div>
        </motion.div>

        {/* Footer Note */}
        <p className="text-center text-[11px] text-slate-400 mt-6 font-medium">
          Marwadi University Student Chapter • Attendance Management System
        </p>
      </div>
    </div>
  );
}
