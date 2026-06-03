import { motion, useScroll, useTransform } from "motion/react";
import { Link } from "react-router-dom";
import { ArrowRight, Sparkles, Users, Calendar, Award, ShieldCheck } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { cn } from "../lib/utils";

export default function Hero() {
  const [videoError, setVideoError] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);
  const [isHeadingHovered, setIsHeadingHovered] = useState(false);
  const headingRef = useRef<HTMLHeadingElement>(null);

  const { scrollY } = useScroll();
  const heroBgY = useTransform(scrollY, [0, 500], ["0%", "15%"]);

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.muted = true;
      videoRef.current.play().catch((err) => {
        console.warn("⚠️ Autoplay block registered. Browser restricted video playback:", err);
      });
    }
  }, [videoError]);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    setPrefersReducedMotion(mediaQuery.matches);
    const listener = (event: MediaQueryListEvent) => {
      setPrefersReducedMotion(event.matches);
    };
    mediaQuery.addEventListener("change", listener);
    return () => mediaQuery.removeEventListener("change", listener);
  }, []);

  // GPU-accelerated cursor position handler (avoids re-rendering the Virtual DOM on mouse move)
  const handleHeadingMouseMove = (e: React.MouseEvent<HTMLHeadingElement>) => {
    const el = headingRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    el.style.setProperty("--m-x", `${x}px`);
    el.style.setProperty("--m-y", `${y}px`);
  };

  return (
    <section className="relative min-h-[calc(100vh-80px)] py-12 md:py-20 w-full flex items-center justify-center overflow-hidden border-b border-theme-border/20 bg-[#02050b]">
      
      {/* 1. Cinematic Background Video Layer */}
      <motion.div 
        style={{ y: prefersReducedMotion ? "0%" : heroBgY }}
        className="absolute inset-0 z-0 bg-[#02050b] pointer-events-none overflow-hidden"
      >
        {!prefersReducedMotion && !videoError ? (
          <video
            ref={videoRef}
            autoPlay
            loop
            muted
            playsInline
            preload="metadata"
            src="https://firebasestorage.googleapis.com/v0/b/gen-lang-client-0746407212.firebasestorage.app/o/vidssave.com%20Abstract%20Tunnel%20VJ%20Motion%20Background%20__%20Neon%20Light%20Tunnel%20Free%20VJ%20Loops%20__%204K%20VJ%20Loops%20720P.mp4?alt=media&token=54bede56-ce97-45e7-b224-585c56917b2b"
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 min-w-full min-h-full w-full h-full object-cover"
            style={{ 
              filter: "brightness(0.35) contrast(1.25) saturate(1) hue-rotate(5deg)",
              width: "100%",
              height: "100%",
              objectFit: "cover",
            }}
            onError={() => setVideoError(true)}
            poster="https://images.unsplash.com/photo-1550745165-9bc0b252726f?q=80&w=1920&auto=format&fit=crop"
          />
        ) : (
          <div 
            className="absolute inset-0 bg-cover bg-center bg-no-repeat transition-opacity duration-300 opacity-20"
            style={{ 
              backgroundImage: "url('https://images.unsplash.com/photo-1550745165-9bc0b252726f?q=80&w=1920&auto=format&fit=crop')" 
            }}
          />
        )}
      </motion.div>

      {/* 2. Premium Light Gradients & Overlay Filters */}
      <div className="absolute inset-0 z-10 pointer-events-none select-none">
        <div className="absolute inset-0 bg-black/75" />
        <div className="absolute inset-0 bg-gradient-to-tr from-emerald-950/20 via-transparent to-blue-950/30 opacity-80" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_15%,#02050b_100%)] opacity-95" />
      </div>

      {/* 3. Outer Aura / Accent Glows */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden select-none z-1">
        <div className="absolute top-[15%] left-[8%] w-80 h-80 bg-[#2FCE72]/5 rounded-full blur-[130px] opacity-40 animate-pulse" />
        <div className="absolute bottom-[20%] right-[8%] w-[450px] h-[450px] bg-blue-500/5 rounded-full blur-[150px] opacity-35" />
      </div>

      {/* 4. Active Interactive Content View Container */}
      <div className="relative z-25 w-full max-w-7xl mx-auto px-4 sm:px-8 py-6 sm:py-14 flex flex-col items-center justify-center text-center">
        
        {/* Glow directly behind heading card */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 sm:w-[600px] h-80 sm:h-[600px] bg-gfg-primary/10 rounded-full blur-[160px] -z-10 pointer-events-none" />

        {/* Top-Label / Badge */}
        <motion.div
          initial={{ opacity: 0, y: -25 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, type: "spring", stiffness: 100 }}
          className="inline-flex items-center space-x-2.5 px-4 sm:px-6 py-2.5 sm:py-3 mb-6 sm:mb-9 text-[8px] sm:text-[10px] md:text-[11px] font-black tracking-[0.16em] sm:tracking-[0.22em] text-[#2FCE72] uppercase bg-[#2FCE72]/10 border border-[#2FCE72]/25 rounded-full shadow-[0_0_20px_rgba(47,206,114,0.12)] backdrop-blur-md max-w-[95%]"
        >
          <Award className="w-3.5 h-3.5 sm:w-4.5 sm:h-4.5 text-[#2FCE72] shrink-0 animate-pulse" />
          <span className="truncate">OFFICIAL GEEKSFORGEEKS × MARWADI UNIVERSITY STUDENT CHAPTER</span>
        </motion.div>

        {/* Brand Integration Redesigned Glassmorphism Card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.1 }}
          className="relative overflow-hidden mb-6 sm:mb-10 w-full max-w-3xl px-1"
        >
          {/* Loopable floating spring shadow */}
          <motion.div
            animate={{ 
              y: [0, -6, 0],
              boxShadow: [
                "0 20px 40px rgba(0,0,0,0.6), 0 0 0px rgba(47,206,114,0)",
                "0 25px 45px rgba(0,0,0,0.7), 0 0 25px rgba(47,206,114,0.12)",
                "0 20px 40px rgba(0,0,0,0.6), 0 0 0px rgba(47,206,114,0)"
              ]
            }}
            transition={{
              duration: 5,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6 md:gap-9 py-3 sm:py-6 px-4 sm:px-10 rounded-[1.8rem] sm:rounded-[2.2rem] bg-gradient-to-b from-white/[0.06] to-white/[0.01] border border-white/[0.09] backdrop-blur-xl relative hover:border-[#2FCE72]/30 transition-colors duration-500 w-full"
          >
            {/* Subtle internal gradient spotlight glare */}
            <div className="absolute top-0 left-1/4 w-32 h-32 bg-[#2FCE72]/8 rounded-full blur-[45px] pointer-events-none" />
            <div className="absolute bottom-0 right-1/4 w-32 h-32 bg-blue-500/8 rounded-full blur-[45px] pointer-events-none" />

            {/* GeeksforGeeks Element */}
            <div className="flex flex-col items-center justify-center bg-white rounded-xl py-2 sm:py-3 px-3 sm:px-5 shadow-lg shadow-black/20 border border-gray-100 transition-transform duration-300 hover:scale-105 h-[58px] sm:h-20 w-[160px] sm:w-[240px] shrink-0 select-none">
              <img 
                src="https://media.geeksforgeeks.org/wp-content/cdn-uploads/20210420155809/gfg-new-logo.png" 
                alt="GeeksforGeeks" 
                className="h-[20px] sm:h-8 w-auto object-contain" 
                referrerPolicy="no-referrer"
              />
              <span className="text-[7.5px] sm:text-[9px] font-black tracking-[0.25em] text-[#00aa55] font-sans mt-1 sm:mt-1.5 leading-none text-center">
                STUDENT CHAPTER
              </span>
            </div>

            {/* Premium Glass Divider */}
            <div className="hidden sm:block h-9 w-[1px] bg-white/10 shrink-0" />

            {/* Marwadi University Element */}
            <div className="flex items-center justify-center bg-white rounded-xl py-2 sm:py-3 px-3 sm:px-5 shadow-lg shadow-black/20 border border-gray-100 transition-transform duration-300 hover:scale-105 h-[58px] sm:h-20 w-[160px] sm:w-[240px] shrink-0 select-none">
              <img 
                src="https://www.marwadiuniversity.ac.in/wp-content/uploads/2021/04/Logo-1.png" 
                alt="Marwadi University" 
                className="h-8 sm:h-12 w-auto object-contain" 
                referrerPolicy="no-referrer"
                onError={(e) => {
                  e.currentTarget.src = "https://www.marwadiuniversity.ac.in/wp-content/themes/marwadi-university/assets/img/logomain.svg";
                }}
              />
            </div>

            {/* Premium Glass Divider */}
            <div className="h-[1.5px] w-12 bg-white/10 sm:h-9 sm:w-[1px] shrink-0" />
            
            {/* High-Contrast gold NAAC-Accredited Badge */}
            <div className="flex items-center space-x-2 px-3 py-1.5 bg-amber-500/10 border border-amber-500/25 text-amber-400 rounded-xl sm:rounded-2xl font-mono font-black text-[7.5px] sm:text-[9px] tracking-wider shadow-[0_0_15px_rgba(245,158,11,0.12)] hover:border-amber-400 transition-colors duration-300">
              <Award className="w-3.5 h-3.5 sm:w-4.5 sm:h-4.5 text-amber-400 shrink-0 animate-pulse" />
              <div className="flex flex-col items-start leading-none text-left">
                <span className="font-sans font-black text-[8px] sm:text-[10px] tracking-tight">NAAC GRADE A+</span>
                <span className="text-[6.5px] sm:text-[7.5px] text-amber-400/70 font-medium">ACCREDITED UNIVERSITY</span>
              </div>
            </div>

          </motion.div>
        </motion.div>

        {/* Dynamic Equal-Prominence Subheading */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.25 }}
          className="mb-4 sm:mb-6"
        >
          <h2 className="text-sm sm:text-base md:text-xl font-extrabold uppercase tracking-[0.05em] sm:tracking-[0.2em] text-white leading-tight text-center block max-w-full px-2">
            <span className="text-[#2FCE72] drop-shadow-[0_0_8px_rgba(47,206,114,0.2)]">GeeksforGeeks</span>
            <span className="mx-2 text-white/40">×</span>
            <span className="text-[#3B82F6] dark:text-[#38BDF8] drop-shadow-[0_0_8px_rgba(59,130,246,0.2)]">Marwadi University</span>
          </h2>
          <div className="h-[2px] w-24 sm:w-36 bg-gradient-to-r from-transparent via-[#2FCE72] to-transparent mx-auto mt-2" />
        </motion.div>

        {/* Main Heading H1: Interactive Mouse-Reactive Spotlight Text Reveal */}
        <motion.h1
          ref={headingRef}
          onMouseMove={handleHeadingMouseMove}
          onMouseEnter={() => setIsHeadingHovered(true)}
          onMouseLeave={() => setIsHeadingHovered(false)}
          initial={{ opacity: 0, y: 35 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.35, type: "spring", stiffness: 60 }}
          className="font-black mb-5 sm:mb-7 tracking-tighter uppercase w-full select-none transition-all cursor-default text-center"
          style={{ 
            fontSize: "clamp(2.4rem, 8vw, 5.5rem)",
            lineHeight: "0.95",
            letterSpacing: "-0.03em",
            ...(isHeadingHovered
              ? {
                  backgroundImage: "radial-gradient(circle 220px at var(--m-x, 50%) var(--m-y, 50%), #2FCE72 0%, #22d3ee 35%, #3B82F6 70%, #ffffff 100%)",
                  WebkitBackgroundClip: "text",
                  backgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  color: "transparent",
                  filter: "drop-shadow(0 0 30px rgba(47,206,114,0.25))",
                }
              : {
                  backgroundImage: "none",
                  WebkitBackgroundClip: "unset",
                  WebkitTextFillColor: "unset",
                  backgroundClip: "unset",
                  color: "#ffffff",
                  filter: "none",
                }
            )
          }}
        >
          SHAPING THE <br />
          NEXT GENERATION <br />
          OF TECH LEADERS
        </motion.h1>

        {/* Concise, Centered Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.45 }}
          className="text-white/85 text-xs sm:text-sm md:text-base font-bold max-w-[90%] sm:max-w-md md:max-w-lg mx-auto mb-7 sm:mb-11 leading-relaxed text-center px-5 sm:px-0"
        >
          Empowering students to learn, innovate, and lead through technology.
        </motion.p>

        {/* Spring Loaded CTA Button Block with Magnetic scale interaction */}
        <motion.div 
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.55 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-5 w-full sm:w-auto px-4"
        >
          {/* Primary CTA: JOIN COMMUNITY */}
          <motion.a 
            href="https://chat.whatsapp.com/F7RcXCTLYJ4Ije5NiL6sDM"
            target="_blank"
            rel="noopener noreferrer"
            whileHover={{ 
              scale: 1.05, 
              y: -3,
              boxShadow: "0 0 35px rgba(47,206,114,0.4)"
            }}
            whileTap={{ scale: 0.97 }}
            transition={{ type: "spring", stiffness: 450, damping: 14 }}
            className="w-full sm:w-auto px-9 py-4.5 bg-[#2FCE72] text-[#02050b] hover:bg-white hover:text-black font-black uppercase text-[10px] tracking-[0.22em] rounded-2xl flex items-center justify-center group shrink-0 shadow-[0_0_25px_rgba(47,206,114,0.25)] transition-colors duration-300 max-w-[280px]"
          >
            JOIN COMMUNITY <Users className="ml-2.5 w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </motion.a>
          
          {/* Secondary CTA: EXPLORE EVENTS */}
          <motion.div className="w-full sm:w-auto max-w-[280px] shrink-0">
            <Link to="/events" className="block w-full">
              <motion.div
                whileHover={{ 
                  scale: 1.05, 
                  y: -3,
                  boxShadow: "0 0 30px rgba(59,130,246,0.2)"
                }}
                whileTap={{ scale: 0.97 }}
                transition={{ type: "spring", stiffness: 450, damping: 14 }}
                className="w-full sm:w-auto px-9 py-4.5 bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 text-white font-black uppercase text-[10px] tracking-[0.22em] rounded-2xl flex items-center justify-center group shadow-sm backdrop-blur-sm transition-colors duration-300"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-[#2FCE72] mr-2.5 animate-pulse group-hover:bg-white" />
                EXPLORE EVENTS <Calendar className="ml-2.5 w-4 h-4" />
              </motion.div>
            </Link>
          </motion.div>
        </motion.div>

      </div>

    </section>
  );
}
