import React, { useState, useEffect } from "react";
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
import { apiService } from "../services/apiService";

export default function Contact() {
  const [formUrl, setFormUrl] = useState("https://docs.google.com/forms/d/e/1FAIpQLSfQ5QSIqCn8AsRV_1CL76UXdPI3JABfhd7NC8tbGlih9ZQ8KA/viewform?embedded=true");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchFormUrl = async () => {
      try {
        setIsLoading(true);
        const res = await apiService.getSetting("contactFormUrl");
        if (res.success && res.data?.value) {
          setFormUrl(res.data.value);
        }
      } catch (err) {
        console.error("Failed to load contact form setting:", err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchFormUrl();
  }, []);

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
            className="text-4xl md:text-6xl font-black text-theme-text mb-4 uppercase tracking-tight italic leading-none"
          >
            Contact <span className="text-gfg-primary">Us</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-theme-text-muted max-w-xl mx-auto text-sm font-sans tracking-wide leading-relaxed"
          >
            Have questions, suggestions, or collaboration ideas? Reach out using the form below.
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
                  <span className="text-gfg-primary">GOOGLE FORMS IFRAME</span>
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

          {/* Right Block: Embedded Google Form */}
          <div className="lg:col-span-12 xl:col-span-7">
            <div className="p-8 md:p-10 rounded-[2.5rem] bg-theme-bg-secondary border border-theme-border shadow-sm relative overflow-hidden group hover:border-gfg-primary/20 transition-all duration-300 text-left">
              <div className="absolute top-0 left-0 w-[3px] h-[70px] bg-gradient-to-b from-gfg-primary to-transparent" />
              
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
                  Google Form Integrated
                </div>
              </div>

              {/* Form Embed Area */}
              <div className="relative w-full overflow-hidden rounded-2xl bg-theme-bg border border-theme-border/30 min-h-[1601px] h-[1601px]">
                {isLoading ? (
                  <div className="absolute inset-0 flex flex-col items-center justify-center bg-theme-bg space-y-3" style={{ minHeight: "500px" }}>
                    <RefreshCw className="w-8 h-8 animate-spin text-gfg-primary" />
                    <span className="text-xs font-mono text-theme-text-muted font-black tracking-widest">ESTABLISHING TRANSMISSION...</span>
                  </div>
                ) : (
                  <iframe
                    src={formUrl}
                    width="100%"
                    height="1601"
                    frameBorder="0"
                    marginHeight={0}
                    marginWidth={0}
                    className="rounded-2xl border-none w-full h-[1601px] min-h-[1601px]"
                    title="Contact Us Google Form"
                    referrerPolicy="no-referrer"
                  >
                    Loading…
                  </iframe>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
