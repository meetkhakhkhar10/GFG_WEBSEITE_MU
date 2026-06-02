import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Mail,
  Phone,
  MapPin,
  Send,
  AlertCircle,
  Database,
  Sparkles,
  RefreshCw,
  Terminal,
  Activity,
  ShieldCheck,
  Cpu,
  Fingerprint
} from "lucide-react";
import { cn } from "../lib/utils";

export default function Contact() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });

  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [toastType, setToastType] = useState<"success" | "error" | "info">("info");

  const triggerToast = (msg: string, type: "success" | "error" | "info") => {
    setToastMessage(msg);
    setToastType(type);
    setShowToast(true);
    setTimeout(() => {
      setShowToast(false);
    }, 4000);
  };

  const validateEmail = (email: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (status === "loading") return;

    if (!formData.name.trim()) {
      triggerToast("Name is required to initialize telemetry upload.", "error");
      return;
    }

    if (!formData.email.trim() || !validateEmail(formData.email)) {
      triggerToast("A valid secure SMTP electronic mail coordinate is required.", "error");
      return;
    }

    if (!formData.message.trim() || formData.message.length < 10) {
      triggerToast("Message transmission payload must exceed 10 characters.", "error");
      return;
    }

    try {
      setStatus("loading");
      setErrorMsg("");

      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const result = await response.json();

      if (response.ok && result.success) {
        setStatus("success");
        triggerToast(result.sync ? "Payload successfully synced to Google Sheets!" : "Secure database log successfully cached!", "success");
        setFormData({ name: "", email: "", message: "" });
        
        setTimeout(() => {
          setStatus("idle");
        }, 5000);
      } else {
        throw new Error(result.message || "Failed dispatching telemetry packet.");
      }
    } catch (err: any) {
      console.error(err);
      setStatus("error");
      const errClean = err.message || "Unknown proxy sync failure.";
      setErrorMsg(errClean);
      triggerToast(`Transmission Failed: ${errClean}`, "error");
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="bg-theme-bg min-h-screen text-theme-text relative overflow-hidden theme-transition"
    >
      {/* Cybernetic Grid & Ambient Neon Radial Glows */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-0 left-0 w-full h-full bg-[linear-gradient(rgba(0,255,136,0.01)_1px,transparent_1px),linear-gradient(90deg,rgba(0,255,136,0.01)_1px,transparent_1px)] bg-[size:40px_40px] pointer-events-none opacity-20" />
        <div className="absolute top-1/4 -left-60 w-[700px] h-[700px] bg-gfg-primary/3 rounded-full blur-[220px] pointer-events-none" />
      </div>

      <div className="max-w-7xl mx-auto px-6 pt-32 pb-24 relative z-10 w-full">
        {/* Dynamic Header Section */}
        <div className="text-center mb-16">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="inline-flex items-center space-x-2 px-5 py-2 bg-gfg-primary/10 border border-gfg-primary/20 rounded-full mb-6 shadow-sm"
          >
            <Sparkles className="w-4 h-4 text-gfg-primary animate-pulse" />
            <span className="text-[9px] font-mono font-black uppercase tracking-[0.35em] text-gfg-primary">
              INTEGRATED SECURE TRANSMISSION CHANNEL
            </span>
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-7xl font-black text-theme-text mb-6 uppercase tracking-tighter italic leading-none"
          >
            CONTACT <span className="text-gfg-primary">PORTAL</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-theme-text-muted max-w-xl mx-auto text-xs font-mono tracking-widest uppercase leading-relaxed"
          >
            A high-speed university contact portal. All submitted packets automatically synchronize in the background with our central Google Sheets records.
          </motion.p>
        </div>

        {/* Core Layout Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 max-w-6xl mx-auto">
          {/* Left Block: Communication Node Stats */}
          <div className="lg:col-span-12 xl:col-span-5 space-y-6 text-left">
            <div className="p-8 rounded-[2.5rem] bg-theme-bg-secondary border border-theme-border shadow-sm relative overflow-hidden group hover:border-gfg-primary/15 transition-all duration-300">
              <div className="absolute top-0 right-0 p-8 opacity-5 pointer-events-none">
                <Terminal className="w-36 h-36 text-gfg-primary" />
              </div>
              <h3 className="text-xs font-mono font-black uppercase tracking-[0.25em] text-gfg-primary mb-6 flex items-center gap-2">
                <Cpu className="w-4 h-4" /> Node Telemetry Signals
              </h3>

              <div className="space-y-6">
                <div className="flex items-center space-x-4">
                  <div className="w-10 h-10 rounded-xl bg-theme-bg border border-theme-border text-gfg-primary flex items-center justify-center shadow-sm shrink-0">
                    <Mail className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-[10px] font-mono text-theme-text-muted uppercase tracking-wider">SMTP Coordinate</div>
                    <div className="text-xs font-mono font-bold text-theme-text select-all">meetkhakhkhar05@gmail.com</div>
                  </div>
                </div>

                <div className="flex items-center space-x-4">
                  <div className="w-10 h-10 rounded-xl bg-theme-bg border border-theme-border text-gfg-primary flex items-center justify-center shadow-sm shrink-0">
                    <Phone className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-[10px] font-mono text-theme-text-muted uppercase tracking-wider">SECURE SIGNAL LINE</div>
                    <a href="tel:+918849607999" className="text-xs font-mono font-bold text-theme-text hover:text-gfg-primary transition-colors block">+91 88496 07999</a>
                  </div>
                </div>

                <div className="flex items-center space-x-4">
                  <div className="w-10 h-10 rounded-xl bg-theme-bg border border-theme-border text-gfg-primary flex items-center justify-center shadow-sm shrink-0">
                    <MapPin className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-[10px] font-mono text-theme-text-muted uppercase tracking-wider">Geographic Anchor</div>
                    <div className="text-xs font-mono font-bold text-theme-text">Marwadi University, Rajkot, Gujarat</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Subsystem Health Dashboard style block */}
            <div className="p-8 rounded-[2.5rem] bg-theme-bg-secondary border border-theme-border shadow-sm relative overflow-hidden group hover:border-gfg-primary/15 transition-all duration-300">
              <h3 className="text-xs font-mono font-black uppercase tracking-[0.25em] text-theme-text-muted mb-6 flex items-center gap-2">
                <Activity className="w-4 h-4 text-gfg-primary animate-pulse" /> Network Security Matrix
              </h3>

              <div className="space-y-4 font-mono text-[10px]">
                <div className="flex justify-between border-b border-theme-border pb-2.5">
                  <span className="text-theme-text-muted">SYSTEM STATUS:</span>
                  <span className="text-gfg-primary font-bold flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 bg-gfg-primary rounded-full animate-pulse" /> ACTIVE SYNC
                  </span>
                </div>
                <div className="flex justify-between border-b border-theme-border pb-2.5">
                  <span className="text-theme-text-muted">BACKGROUND COURIER:</span>
                  <span className="text-gfg-primary">GOOGLE APIS LINK</span>
                </div>
                <div className="flex justify-between border-b border-theme-border pb-2.5">
                  <span className="text-theme-text-muted">ENCRYPTION TYPE:</span>
                  <span className="text-theme-text flex items-center gap-1"><ShieldCheck className="w-3.5 h-3.5 text-gfg-primary" /> TLS v1.3 Secure</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-theme-text-muted">INTEGRITY HASH:</span>
                  <span className="text-theme-text-secondary select-all font-mono font-bold">SHA-256#GFG-MU</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Block: Input Form */}
          <div className="lg:col-span-12 xl:col-span-7">
            <div className="p-8 md:p-10 rounded-[2.5rem] bg-theme-bg-secondary border border-theme-border shadow-sm relative overflow-hidden group hover:border-gfg-primary/20 transition-all duration-300 text-left">
              <div className="absolute top-0 left-0 w-[3px] h-full bg-gradient-to-b from-gfg-primary value-transparent" />
              
              {/* Status Header Block */}
              <div className="flex justify-between items-center border-b border-theme-border pb-6 mb-8 gap-3">
                <div className="flex items-center space-x-2.5">
                  <Fingerprint className="w-5 h-5 text-gfg-primary animate-pulse" />
                  <div>
                    <div className="text-[9px] font-mono text-theme-text-muted uppercase tracking-widest">TRANSMISSION ID</div>
                    <div className="text-xs font-mono text-gfg-primary font-black uppercase tracking-wider">MATRIX SECURED</div>
                  </div>
                </div>
                <div className="px-3 py-1 bg-theme-bg border border-theme-border text-theme-text-muted rounded-full text-[9px] font-mono tracking-widest uppercase shadow-sm">
                  No Sign-in Required
                </div>
              </div>

              {/* Form State Machine */}
              <AnimatePresence mode="wait">
                {status === "success" ? (
                  <motion.div
                    key="success"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0 }}
                    className="py-12 text-center"
                  >
                    <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gfg-primary/10 border-2 border-gfg-primary text-gfg-primary mb-6 shadow-sm">
                      <motion.svg
                        className="w-10 h-10"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={3}
                        initial={{ pathLength: 0 }}
                        animate={{ pathLength: 1 }}
                        transition={{ duration: 0.6, ease: "easeOut" }}
                      >
                        <motion.path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M5 13l4 4L19 7"
                        />
                      </motion.svg>
                    </div>

                    <h3 className="text-2xl font-mono font-black text-theme-text italic uppercase tracking-wider mb-2">
                      TRANSMISSION SUCCESS
                    </h3>
                    <p className="text-xs font-mono text-theme-text-muted max-w-sm mx-auto leading-relaxed">
                      Quantum protocol dispatched secure packet safely. Background threads are logging details directly inside the associated Google Sheets archive now.
                    </p>

                    <button
                      type="button"
                      onClick={() => setStatus("idle")}
                      className="mt-8 px-6 py-2.5 bg-theme-bg border border-theme-border hover:border-gfg-primary/40 text-gfg-primary rounded-xl text-xs font-mono uppercase tracking-widest font-black transition-all shadow-sm"
                    >
                      SEND NEW MESSAGE
                    </button>
                  </motion.div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Name Input */}
                    <div className="relative group/input">
                      <input
                        type="text"
                        id="form-name"
                        required
                        disabled={status === "loading"}
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className="w-full px-6 py-4 bg-theme-bg border border-theme-border group-hover/input:border-theme-text/20 rounded-2xl text-theme-text outline-none focus:border-gfg-primary focus:shadow-sm disabled:opacity-50 transition-all peer placeholder-transparent text-sm font-medium"
                        placeholder="Name"
                      />
                      <label
                        htmlFor="form-name"
                        className="absolute left-6 top-[11px] text-theme-text-muted text-[9px] tracking-widest font-mono font-black uppercase transition-all peer-placeholder-shown:text-xs peer-placeholder-shown:top-[15px] peer-focus:top-[-9px] peer-focus:left-4 peer-focus:text-[9px] peer-focus:text-gfg-primary peer-focus:bg-theme-bg-secondary peer-focus:px-2"
                      >
                        FULL TRANSMITTER NAME
                      </label>
                    </div>

                    {/* Email Input */}
                    <div className="relative group/input2">
                      <input
                        type="email"
                        id="form-email"
                        required
                        disabled={status === "loading"}
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        className="w-full px-6 py-4 bg-theme-bg border border-theme-border group-hover/input2:border-theme-text/20 rounded-2xl text-theme-text outline-none focus:border-gfg-primary focus:shadow-sm disabled:opacity-50 transition-all peer placeholder-transparent text-sm font-medium"
                        placeholder="Email"
                      />
                      <label
                        htmlFor="form-email"
                        className="absolute left-6 top-[11px] text-theme-text-muted text-[9px] tracking-widest font-mono font-black uppercase transition-all peer-placeholder-shown:text-xs peer-placeholder-shown:top-[15px] peer-focus:top-[-9px] peer-focus:left-4 peer-focus:text-[9px] peer-focus:text-gfg-primary peer-focus:bg-theme-bg-secondary peer-focus:px-2"
                      >
                        SMTP SECURE COORDINATE
                      </label>
                    </div>

                    {/* Message Area */}
                    <div className="relative group/textarea">
                      <textarea
                        id="form-message"
                        required
                        rows={5}
                        disabled={status === "loading"}
                        value={formData.message}
                        onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                        className="w-full px-6 py-4.5 bg-theme-bg border border-theme-border group-hover/textarea:border-theme-text/20 rounded-2xl text-theme-text outline-none focus:border-gfg-primary focus:shadow-sm disabled:opacity-50 transition-all peer placeholder-transparent resize-none text-sm font-medium leading-relaxed"
                        placeholder="Message"
                      />
                      <label
                        htmlFor="form-message"
                        className="absolute left-6 top-4 text-theme-text-muted text-[9px] tracking-widest font-mono font-black uppercase transition-all peer-placeholder-shown:text-xs peer-placeholder-shown:top-5 peer-focus:top-[-9px] peer-focus:left-4 peer-focus:text-[9px] peer-focus:text-gfg-primary peer-focus:bg-theme-bg-secondary peer-focus:px-2"
                      >
                        TRANSMISSION PAYLOAD MESSAGE
                      </label>
                    </div>

                    {/* Submit Button */}
                    <button
                      type="submit"
                      disabled={status === "loading"}
                      className={cn(
                        "w-full py-4.5 bg-gfg-primary text-black font-mono font-black rounded-2xl transition-all duration-300 flex items-center justify-center disabled:opacity-50 uppercase tracking-[0.2em] text-[11px] select-none cursor-pointer shadow-sm",
                        status === "loading" && "bg-theme-bg border border-theme-border text-theme-text hover:shadow-none cursor-not-allowed"
                      )}
                    >
                      {status === "idle" && (
                        <>
                          LAUNCH TRANSMISSION PROTOCOL <Send className="ml-2 w-4 h-4" />
                        </>
                      )}
                      {status === "loading" && (
                        <div className="flex items-center space-x-2">
                          <RefreshCw className="w-4 h-4 animate-spin text-gfg-primary" />
                          <span className="text-theme-text-muted font-bold">SYNCHRONIZING TELEMETRY STACK...</span>
                        </div>
                      )}
                      {status === "error" && (
                        <>
                          RE-TRANSMIT INTERFACE PAYLOAD <AlertCircle className="ml-2 w-4 h-4" />
                        </>
                      )}
                    </button>
                  </form>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>

      {/* Floating glass toast alerts */}
      <AnimatePresence>
        {showToast && (
          <motion.div
            initial={{ opacity: 0, y: 50, x: "-50%" }}
            animate={{ opacity: 1, y: 0, x: "-50%" }}
            exit={{ opacity: 0, y: 30, x: "-50%" }}
            className="fixed bottom-10 left-1/2 -translate-x-1/2 z-50 flex items-center space-x-3 px-5 py-4 bg-theme-bg-secondary border border-theme-border rounded-2xl shadow-lg max-w-sm w-full"
          >
            {toastType === "success" ? (
              <ShieldCheck className="w-5 h-5 text-gfg-primary shrink-0" />
            ) : toastType === "error" ? (
              <AlertCircle className="w-5 h-5 text-red-500 shrink-0" />
            ) : (
              <Database className="w-5 h-5 text-cyan-500 shrink-0 animate-pulse" />
            )}
            <div className="text-left font-mono text-[10px] leading-relaxed">
              <div className="text-theme-text font-black uppercase tracking-wider">
                {toastType === "success" ? "TRANSMISSION SECURE" : toastType === "error" ? "TRANSCEIVER FAULT ALERT" : "PORTAL MESSAGE"}
              </div>
              <p className="text-theme-text-muted mt-0.5">{toastMessage}</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
