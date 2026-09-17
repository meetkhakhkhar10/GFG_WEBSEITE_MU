import { motion } from "motion/react";
import { Terminal, LogIn, ArrowLeft, ShieldAlert, Sparkles, LogOut, CheckCircle2 } from "lucide-react";
import { useNavigate, Link } from "react-router-dom";
import React, { useState } from "react";
import { GoogleAuthProvider, signInWithPopup, signOut } from "firebase/auth";
import { auth } from "../../services/firebaseDb";
import { apiService } from "../../services/apiService";
import { cn } from "@/src/lib/utils";

export default function Login() {
  const navigate = useNavigate();
  const [error, setError] = useState("");
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [success, setSuccess] = useState("");

  const handleGoogleAdminSignIn = async () => {
    if (isLoggingIn) return;
    setIsLoggingIn(true);
    setError("");
    setSuccess("");

    try {
      if (!auth) {
        throw new Error("Firebase Service is currently unavailable. Please verify connectivity.");
      }

      const provider = new GoogleAuthProvider();
      provider.setCustomParameters({ prompt: 'select_account' });
      
      const result = await signInWithPopup(auth, provider);
      const { user: firebaseUser } = result;

      const userEmail = firebaseUser.email ? firebaseUser.email.toLowerCase() : "";

      // ENFORCE STRICT AUTHORIZATION: ONLY meetkhakhkhar05@gmail.com CAN LOGIN
      if (userEmail !== "meetkhakhkhar05@gmail.com") {
        await signOut(auth);
        setError("You are not authorized to access the GeeksforGeeks Student Chapter Admin Panel.");
        setIsLoggingIn(false);
        return;
      }

      setSuccess("Verification successful! Initiating admin session...");

      // Call backend to fetch or elevate student/user role & generate admin JWT
      const response = await apiService.loginWithGoogle({
        uid: firebaseUser.uid,
        email: firebaseUser.email,
        name: firebaseUser.displayName,
        photoURL: firebaseUser.photoURL
      });

      if (response.success && (response.user.role === "super_admin" || response.user.role === "admin" || response.user.email === "meetkhakhkhar05@gmail.com")) {
        const adminPayload = {
          ...response.user,
          role: "super_admin" // Enforce super_admin role for Meet on the client
        };
        localStorage.setItem("admin_user", JSON.stringify(adminPayload));
        localStorage.setItem("token", response.token);
        navigate("/admin/dashboard");
      } else {
        await signOut(auth);
        setError(response.message || "Failed to establish enterprise administrator credentials.");
      }
    } catch (err: any) {
      if (err.code === "auth/popup-closed-by-user" || err.code === "auth/cancelled-popup-request") {
        console.warn("Admin google sign in sequence cancelled by user.");
        setError("Authentication popup was closed. Please try again.");
      } else {
        console.error("Admin google sign in sequence failed:", err);
        setError(err.message || "Admin authorization processing failed.");
      }
    } finally {
      setIsLoggingIn(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#070707] flex items-center justify-center p-6 relative overflow-hidden text-white">
      {/* Dynamic background lights */}
      <div className="absolute inset-0 pointer-events-none z-0">
        <div className="absolute top-[20%] left-[25%] w-[400px] h-[400px] bg-[#2F8D46]/10 rounded-full blur-[125px]" />
        <div className="absolute bottom-[20%] right-[25%] w-[400px] h-[400px] bg-red-950/10 rounded-full blur-[125px]" />
      </div>

      <Link 
        to="/" 
        className="absolute top-8 left-8 flex items-center text-gray-500 hover:text-[#2F8D46] transition-colors group z-10"
      >
        <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" />
        <span className="font-mono font-bold uppercase tracking-widest text-[9px]">Back to Home</span>
      </Link>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-xl p-8 sm:p-12 rounded-[2.5rem] bg-[#0c0c0c] border border-white/5 shadow-2xl text-center relative overflow-hidden z-10 space-y-8"
      >
        {/* Core decoration glow */}
        <div className="absolute top-0 right-0 w-40 h-40 bg-[#2F8D46]/10 blur-3xl opacity-60 rounded-full" />

        {/* Head Branding Icons */}
        <div className="flex justify-center items-center gap-4">
          {/* GFG Graphic representation */}
          <div className="w-14 h-14 rounded-2xl bg-[#2F8D46]/10 border border-[#2F8D46]/20 flex items-center justify-center text-[#2F8D46] shadow-sm">
            <Terminal className="w-6 h-6 animate-pulse" />
          </div>
          <div className="text-left">
            <h2 className="text-xs font-mono font-black tracking-widest text-[#2F8D46] uppercase">GeeksforGeeks</h2>
            <p className="text-[9px] text-white/40 uppercase font-black tracking-widest">MARWADI UNIVERSITY</p>
          </div>
        </div>

        {/* Access restrict notice */}
        <div className="space-y-3">
          <div className="inline-flex items-center space-x-1.5 px-3 py-1 bg-rose-500/10 border border-rose-500/20 rounded-full">
            <ShieldAlert className="w-3.5 h-3.5 text-rose-500" />
            <span className="text-[10px] font-mono font-black tracking-wider uppercase text-rose-400">
              ADMIN ACCESS ONLY
            </span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-black tracking-tight uppercase leading-snug">
            Authorized GeeksforGeeks Student Chapter Administration Portal
          </h1>
          
          <p className="text-white/40 font-bold text-xs max-w-md mx-auto">
            This portal is restricted to the official Chapter Administrator. Unauthorized login attempts are security-logged.
          </p>
        </div>

        {/* Status / feedback displays */}
        {error && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="p-4 bg-rose-500/10 border border-rose-500/20 rounded-2xl text-rose-400 text-xs flex items-start text-left font-bold"
          >
            <span className="mr-2 mt-0.5 shrink-0">⚠️</span>
            <span>{error}</span>
          </motion.div>
        )}

        {success && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl text-[#2F8D46] text-xs flex items-start text-left font-bold"
          >
            <span className="mr-2 mt-0.5 shrink-0">✓</span>
            <span>{success}</span>
          </motion.div>
        )}

        {/* LOGIN CTA BUTTON */}
        <div className="pt-2">
          <button
            onClick={handleGoogleAdminSignIn}
            disabled={isLoggingIn}
            className={cn(
              "group w-full py-4.5 bg-[#2F8D46] hover:bg-[#1F6B34] disabled:bg-slate-800 disabled:text-slate-600 border border-transparent text-white font-mono font-black text-xs uppercase tracking-widest rounded-2xl transition-all flex items-center justify-center cursor-pointer shadow-xl shadow-[#2F8D46]/10",
              isLoggingIn ? "cursor-not-allowed opacity-50" : "hover:scale-[1.02] active:scale-[0.98]"
            )}
          >
            {isLoggingIn ? (
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
            ) : (
              <LogIn className="mr-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
            )}
            {isLoggingIn ? "Verifying Authority..." : "Sign In with Google"}
          </button>
        </div>

        {/* Footer badges */}
        <div className="pt-4 border-t border-white/5 flex flex-wrap justify-center items-center gap-x-6 gap-y-2 text-[9px] font-mono font-bold text-white/30 uppercase tracking-widest">
          <div className="flex items-center gap-1">
            <CheckCircle2 className="w-3.5 h-3.5 text-[#2F8D46]" />
            <span>Encrypted Tunnel</span>
          </div>
          <div className="flex items-center gap-1">
            <CheckCircle2 className="w-3.5 h-3.5 text-[#2F8D46]" />
            <span>Automatic Revocation</span>
          </div>
          <div className="flex items-center gap-1">
            <CheckCircle2 className="w-3.5 h-3.5 text-[#2F8D46]" />
            <span>Audit-Logged Access</span>
          </div>
        </div>

      </motion.div>
    </div>
  );
}
