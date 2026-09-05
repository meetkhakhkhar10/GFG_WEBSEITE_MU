import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { LogIn, Terminal, Loader2, AlertCircle, Check, ShieldCheck, Mail, ArrowLeft, Heart, Lock } from "lucide-react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { useTheme } from "../contexts/ThemeContext";

const GFG_LOGO = "https://media.geeksforgeeks.org/wp-content/cdn-uploads/20210420155809/gfg-new-logo.png";
const MU_LOGO = "https://www.marwadiuniversity.ac.in/wp-content/themes/marwadi-university/assets/img/logomain.svg";

export default function StudentLogin() {
  const { signInWithGoogle } = useAuth();
  const { theme } = useTheme();
  const [loginLoading, setLoginLoading] = useState(false);
  const [loginError, setLoginError] = useState("");
  const [loginSuccess, setLoginSuccess] = useState(false);
  const [showRestrictionModal, setShowRestrictionModal] = useState(false);
  const [triedEmail, setTriedEmail] = useState("");
  const navigate = useNavigate();

  // Image states
  const [gfgLogoSrc, setGfgLogoSrc] = useState(GFG_LOGO);
  const [muLogoSrc, setMuLogoSrc] = useState(MU_LOGO);
  const [gfgLogoLoading, setGfgLogoLoading] = useState(true);
  const [muLogoLoading, setMuLogoLoading] = useState(true);

  useEffect(() => {
    document.title = "GFG| GeeksforGeeks Marwadi University";
  }, []);

  const handleGoogleSignIn = async () => {
    setLoginLoading(true);
    setLoginError("");
    setShowRestrictionModal(false);
    
    try {
      const result = await signInWithGoogle();
      
      if (result.success) {
        setLoginSuccess(true);
        setTimeout(() => {
          navigate("/student/dashboard");
        }, 1500);
      } else {
        const errorMsg = result.message || "Only Marwadi University students are allowed to access this portal.";
        if (errorMsg.includes("Only Marwadi University students") || errorMsg.includes("Access Restricted")) {
          setLoginError("Only Marwadi University students are allowed to access this portal.");
          setShowRestrictionModal(true);
        } else {
          setLoginError(errorMsg);
        }
      }
    } catch (err: any) {
      setLoginError(err.message || "Only Marwadi University students are allowed to access this portal.");
    } finally {
      setLoginLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-theme-bg flex items-center justify-center p-4 relative overflow-hidden font-sans theme-transition">
      {/* Decorative meshes */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none opacity-40">
        <div className="absolute top-[-20%] left-[-20%] w-[60%] h-[60%] bg-gfg-primary/5 blur-[160px] rounded-full" />
        <div className="absolute bottom-[-20%] right-[-20%] w-[60%] h-[60%] bg-gfg-primary/3 blur-[160px] rounded-full" />
      </div>

      {/* Grid Overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#00000003_1px,transparent_1px),linear-gradient(to_bottom,#00000003_1px,transparent_1px)] dark:bg-[linear-gradient(to_right,#ffffff03_1px,transparent_1px),linear-gradient(to_bottom,#ffffff03_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none opacity-40" />

      {/* Back link */}
      <Link 
        to="/" 
        className="absolute top-8 left-8 flex items-center gap-2 text-theme-text-muted hover:text-gfg-primary transition-colors group z-20"
      >
        <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
        <span className="font-extrabold uppercase tracking-widest text-[10px]">Back to Portal</span>
      </Link>

      <motion.div
        initial={{ opacity: 0, scale: 0.96, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        className="relative w-full max-w-lg bg-theme-bg-secondary border border-theme-border rounded-[2.5rem] p-8 md:p-12 shadow-sm overflow-hidden z-10 text-center"
      >
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-48 h-[1px] bg-gradient-to-r from-transparent via-gfg-primary/30 to-transparent" />

        {/* Branding header */}
        <div className="relative mb-8">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-theme-bg border border-theme-border rounded-full mb-6">
            <span className="w-2 h-2 rounded-full bg-gfg-primary animate-pulse" />
            <span className="text-[10px] uppercase font-bold text-theme-text-muted tracking-widest">GFG MU Chapter</span>
          </div>

          {/* Logo container row */}
          <div className="flex items-center justify-center gap-6 mb-6">
            <div 
              className="logo-card relative w-[100px] h-[100px] bg-white rounded-2xl p-3 flex items-center justify-center hover:-translate-y-1 transition-all group overflow-hidden border border-gray-100 shadow-sm"
              style={{
                boxShadow: "0 10px 25px rgba(0,0,0,0.06), 0 0 20px rgba(0,255,128,0.05)"
              }}
            >
              {gfgLogoLoading && (
                <div className="absolute inset-1 bg-gray-50 animate-pulse rounded-lg flex items-center justify-center">
                  <span className="text-[8px] text-gray-400 font-mono">LOADING...</span>
                </div>
              )}
              <img 
                src={gfgLogoSrc} 
                alt="GeeksforGeeks Logo" 
                className="w-[90%] h-[90%] object-contain block transition-transform group-hover:scale-105" 
                referrerPolicy="no-referrer"
                onLoad={() => setGfgLogoLoading(false)}
                onError={() => {
                  setGfgLogoSrc("https://media.geeksforgeeks.org/wp-content/cdn-uploads/20210420155809/gfg-new-logo.png");
                  setGfgLogoLoading(false);
                }}
              />
            </div>

            <div className="text-theme-text-muted opacity-30 font-light text-xl font-mono select-none">✕</div>

            <div 
              className="logo-card relative w-[100px] h-[100px] bg-white rounded-2xl p-3 flex items-center justify-center hover:-translate-y-1 transition-all group overflow-hidden border border-gray-100 shadow-sm"
              style={{
                boxShadow: "0 10px 25px rgba(0,0,0,0.06), 0 0 20px rgba(0,255,128,0.05)"
              }}
            >
              {muLogoLoading && (
                <div className="absolute inset-1 bg-gray-50 animate-pulse rounded-lg flex items-center justify-center">
                  <span className="text-[8px] text-gray-400 font-mono">LOADING...</span>
                </div>
              )}
              <img 
                src={muLogoSrc} 
                alt="Marwadi University Logo" 
                className="w-[90%] h-[90%] object-contain block transition-transform group-hover:scale-105" 
                referrerPolicy="no-referrer"
                onLoad={() => setMuLogoLoading(false)}
                onError={() => {
                  setMuLogoSrc("https://media.geeksforgeeks.org/wp-content/cdn-uploads/20210420155809/gfg-new-logo.png");
                  setMuLogoLoading(false);
                }}
              />
            </div>
          </div>

          <h1 className="text-2xl md:text-3xl font-black text-theme-text tracking-tight uppercase leading-none mb-1">
            GFG Student Login
          </h1>
          <div className="text-gfg-primary text-xs font-black tracking-widest uppercase mt-1.5 mb-4">
            GeeksforGeeks on Campus Marwadi University
          </div>
          <p className="text-theme-text-secondary text-sm max-w-sm mx-auto font-semibold">
            Connect using your official institutional email to access student dashboards, event history, and learning rewards.
          </p>
        </div>

        <AnimatePresence mode="wait">
          {loginLoading ? (
            <motion.div
              key="loading"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              className="py-6 text-center flex flex-col items-center justify-center"
            >
              <div className="w-16 h-16 bg-theme-bg border border-theme-border rounded-xl p-2.5 flex items-center justify-center shadow-sm mb-4 animate-pulse">
                <img 
                  src={gfgLogoSrc} 
                  alt="GFG Student Login" 
                  className="w-full h-full object-contain" 
                  referrerPolicy="no-referrer"
                />
              </div>
              <h3 className="text-lg font-black text-theme-text uppercase tracking-wider mb-2">GFG Student Login</h3>
              <p className="text-gfg-primary font-mono text-[9px] font-bold uppercase tracking-widest animate-pulse flex items-center gap-1">
                <Loader2 className="w-3.5 h-3.5 animate-spin text-gfg-primary" />
                Verifying University Domain...
              </p>
            </motion.div>
          ) : loginSuccess ? (
            <motion.div
              key="success"
              initial={{ opacity: 0, scale: 0.92 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              className="py-6 text-center"
            >
              <div className="w-16 h-16 bg-gfg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4 border border-gfg-primary/20 animate-bounce">
                <Check className="w-8 h-8 text-gfg-primary" />
              </div>
              <h3 className="text-xl font-black text-theme-text mb-1 tracking-tight uppercase">Successfully Verified</h3>
              <p className="text-gfg-primary text-xs font-bold tracking-wider animate-pulse uppercase">
                Synchronizing live academic session...
              </p>
            </motion.div>
          ) : (
            <motion.div
              key="auth-button"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="space-y-6"
            >
              {/* Google login Core trigger */}
              <button
                type="button"
                onClick={handleGoogleSignIn}
                disabled={loginLoading}
                className="group w-full h-14 bg-theme-text text-theme-bg hover:bg-gfg-primary hover:text-black font-extrabold rounded-2xl transition-all flex items-center justify-center gap-3 disabled:opacity-50 shadow-sm text-xs uppercase tracking-widest relative"
              >
                <Mail className="w-4 h-4 shrink-0 transition-transform group-hover:rotate-12" />
                <span>Continue with Google Account</span>
              </button>

              {/* Informative restricted policy alert */}
              <div className="p-5 bg-theme-bg border border-theme-border rounded-2xl text-left">
                <div className="flex items-start gap-3">
                  <ShieldCheck className="w-5 h-5 text-gfg-primary shrink-0 mt-0.5" />
                  <div>
                    <h4 className="text-xs font-bold text-theme-text uppercase tracking-wider">Restricted Domain Policy</h4>
                    <p className="text-theme-text-secondary text-xs mt-1 leading-relaxed font-semibold">
                      Only institutional accounts belonging to <strong className="text-theme-text font-extrabold">@marwadiuniversity.ac.in</strong> are accepted. Personal accounts will be automatically filtered and denied.
                    </p>
                  </div>
                </div>
              </div>

              {loginError && (
                <motion.div
                  initial={{ opacity: 0, y: -8 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex items-center gap-2.5 p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-500 text-xs font-bold text-left"
                >
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{loginError}</span>
                </motion.div>
              )}

              {/* Secure Token badge footer */}
              <div className="flex items-center justify-center gap-2 text-theme-text-muted text-[9px] font-bold uppercase tracking-widest pt-2">
                <Lock className="w-3.5 h-3.5" />
                <span>SSL Encrypted Token Swap</span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* High-Fidelity Domain Restriction Alert Modal */}
      <AnimatePresence>
        {showRestrictionModal && (
          <div className="fixed inset-0 bg-black/80 flex items-center justify-center p-4 z-50">
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="w-full max-w-lg bg-theme-bg border border-red-500/20 rounded-[2.5rem] p-8 md:p-10 text-center shadow-lg relative overflow-hidden"
            >
              <div className="absolute top-0 left-0 w-full h-[3px] bg-red-500" />
              <div className="absolute -top-10 -right-10 w-40 h-40 bg-red-500/5 blur-3xl pointer-events-none" />

              <div className="w-14 h-14 bg-red-500/10 border border-red-500/20 rounded-xl flex items-center justify-center mx-auto mb-6">
                <AlertCircle className="w-7 h-7 text-red-500 animate-pulse" />
              </div>

              <h2 className="text-xl font-black text-theme-text tracking-tight uppercase mb-2 text-red-500">
                Access Restricted
              </h2>
              <p className="text-theme-text-secondary text-sm leading-relaxed mb-6 max-w-sm mx-auto font-semibold">
                Only Marwadi University students are allowed to access this portal.
              </p>

              {/* Visual domain comparator */}
              <div className="bg-theme-bg-secondary border border-theme-border rounded-2xl p-4 mb-6 space-y-2 text-left text-xs font-mono">
                <div className="flex items-center justify-between text-red-500 font-bold">
                  <span className="font-sans text-theme-text-muted font-black uppercase tracking-wider">Personal Email</span>
                  <span>✕ Reject</span>
                </div>
                <div className="text-theme-text-muted truncate pl-1.5">*@gmail.com, *@yahoo.com, etc.</div>
                
                <div className="h-[1px] bg-theme-border my-2" />

                <div className="flex items-center justify-between text-gfg-primary font-bold">
                  <span className="font-sans text-theme-text-muted font-black uppercase tracking-wider">Official Target</span>
                  <span>✓ Allowed</span>
                </div>
                <div className="text-theme-text font-black pl-1.5">*@marwadiuniversity.ac.in</div>
              </div>

              <div className="flex flex-col gap-3">
                <button
                  type="button"
                  onClick={handleGoogleSignIn}
                  className="w-full h-11 bg-gfg-primary text-black font-extrabold rounded-lg hover:bg-gfg-primary/80 transition-all text-xs uppercase tracking-widest cursor-pointer select-none"
                >
                  Continue with Institutional Email
                </button>
                <button
                  type="button"
                  onClick={() => setShowRestrictionModal(false)}
                  className="w-full h-11 bg-theme-bg-secondary border border-theme-border text-theme-text-secondary font-bold rounded-lg hover:bg-theme-text hover:text-theme-bg transition-all text-xs cursor-pointer select-none"
                >
                  Close Message
                </button>
              </div>

              <p className="mt-6 text-[9px] text-theme-text-muted font-bold uppercase tracking-widest flex items-center justify-center gap-1">
                <span>GFG Student Login Security Enforcement</span>
              </p>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
