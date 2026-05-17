import { motion } from "motion/react";
import { Terminal, LogIn, ArrowLeft } from "lucide-react";
import { useNavigate, Link } from "react-router-dom";
import React, { useState, FormEvent } from "react";
import { cn } from "@/src/lib/utils";

export default function Login() {
  const navigate = useNavigate();
  const [error, setError] = useState("");
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isLoggingIn) return;
    
    setIsLoggingIn(true);
    setError("");
    
    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        localStorage.setItem("admin_user", JSON.stringify(data.user));
        localStorage.setItem("token", data.token);
        navigate("/admin/dashboard");
      } else {
        setError(data.message || "Unauthorized access.");
      }
    } catch (err: any) {
      setError("Failed to sign in. Please check your connection.");
    } finally {
      setIsLoggingIn(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#000] flex items-center justify-center p-4 relative">
      <Link 
        to="/" 
        className="absolute top-8 left-8 flex items-center text-gray-500 hover:text-[#00ff88] transition-colors group"
      >
        <ArrowLeft className="w-5 h-5 mr-2 group-hover:-translate-x-1 transition-transform" />
        <span className="font-bold uppercase tracking-widest text-[10px]">Back to Home</span>
      </Link>

      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-md p-10 rounded-[40px] bg-[#111] border border-white/5 shadow-2xl text-center relative overflow-hidden"
      >
        <div className="absolute top-0 right-0 w-32 h-32 bg-[#00ff88]/5 blur-3xl opacity-50" />
        
        <div className="inline-flex items-center justify-center w-16 h-16 mb-8 rounded-2xl bg-[#00ff88]/5 text-[#00ff88] border border-[#00ff88]/10 shadow-sm">
          <Terminal className="w-8 h-8" />
        </div>
        <h1 className="text-3xl font-black text-white mb-2 tracking-tight uppercase">Admin <span className="text-[#00ff88]">Portal</span></h1>
        <p className="text-white/40 mb-10 font-medium font-black uppercase text-[10px] tracking-widest leading-relaxed">
          Exclusive access for GFG Student Chapter Administrators.
        </p>

        {error && (
          <div className="mb-8 p-5 bg-red-500/10 border border-red-500/20 rounded-2xl text-red-500 text-sm flex items-start text-left font-bold shadow-sm">
            <span className="mr-3 mt-0.5 text-red-500">⚠️</span>
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4">
          <div className="text-left mb-6 space-y-4">
            <div>
              <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-3 ml-1">Identity Access</label>
              <input
                type="email"
                placeholder="Admin Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-6 py-5 bg-white/5 border border-white/10 rounded-2xl text-white focus:outline-none focus:border-[#00ff88]/30 transition-all font-medium shadow-sm"
              />
            </div>
            <div>
              <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-3 ml-1">Password</label>
              <input
                type="password"
                placeholder="Access Key"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full px-6 py-5 bg-white/5 border border-white/10 rounded-2xl text-white focus:outline-none focus:border-[#00ff88]/30 transition-all font-medium shadow-sm"
              />
            </div>
          </div>
          <button
            type="submit"
            disabled={isLoggingIn}
            className={cn(
              "group w-full py-5 bg-[#00ff88] text-black font-black rounded-2xl transition-all flex items-center justify-center uppercase tracking-widest shadow-xl shadow-[#00ff88]/20",
              isLoggingIn ? "opacity-50 cursor-not-allowed" : "hover:scale-[1.02] active:scale-[0.98]"
            )}
          >
            {isLoggingIn ? (
              <div className="w-6 h-6 border-4 border-black border-t-transparent rounded-full animate-spin mr-3" />
            ) : (
              <LogIn className="mr-3 w-6 h-6 group-hover:translate-x-1 transition-transform" />
            )}
            {isLoggingIn ? "Authorizing..." : "Access Portal"}
          </button>
        </form>

        <p className="mt-10 text-[10px] text-white/20 font-bold uppercase tracking-widest">
          Secure Administrative Gateway
        </p>
      </motion.div>
    </div>
  );
}
