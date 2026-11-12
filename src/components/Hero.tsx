import { motion } from "motion/react";
import { Link } from "react-router-dom";
import { ArrowUpRight, ArrowRight, Terminal, Sparkles, MapPin, Calendar, Users } from "lucide-react";
import EditorialImage from "./EditorialImage";

export default function Hero() {
  return (
    <section className="relative py-12 md:py-20 border-b border-[#E2E2DC] bg-[#F4F4F0] overflow-hidden select-none">
      
      {/* Background Architectural Grid Lines */}
      <div className="absolute inset-0 bg-technical-grid opacity-60 pointer-events-none" />

      <div className="main-container relative z-10 w-full">
        
        {/* TOP TECHNICAL INDEX BAR */}
        <div className="flex flex-wrap items-center justify-between border-b border-[#E2E2DC] pb-4 mb-8 sm:mb-12 font-mono text-[10px] sm:text-xs uppercase tracking-[0.2em] text-[#555B63]">
          <div className="flex items-center space-x-3">
            <span className="text-[#00A86B] font-bold">01 / ARCHIVE</span>
            <span className="opacity-40">·</span>
            <span className="text-[#111318] font-bold">GFG × MARWADI UNIVERSITY</span>
          </div>

          <div className="hidden lg:flex items-center space-x-6">
            <span className="font-semibold">RAJKOT, GUJARAT, IN</span>
            <span className="opacity-40">·</span>
            <span className="font-semibold">LAT 22.3039° N · LON 70.8022° E</span>
            <span className="opacity-40">·</span>
            <span className="text-[#00A86B] font-bold">COMMUNITY ACTIVE</span>
          </div>

          <div className="font-bold text-[#111318] hidden sm:block">
            VOL. 2026 // ED. 04
          </div>
        </div>

        {/* ASYMMETRIC EDITORIAL POSTER GRID */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-y-12 lg:gap-x-16 items-center">
          
          {/* LEFT 7 COLS: EDITORIAL TYPOGRAPHY & CALLS TO ACTION */}
          <div className="lg:col-span-7 space-y-6 sm:space-y-8">
            
            {/* Supertag label */}
            <div className="inline-flex items-center space-x-2.5 px-3 py-1 bg-[#FFFFFF] border border-[#E2E2DC] text-[10px] sm:text-[11px] font-mono font-bold uppercase tracking-widest text-[#333840] shadow-2xs">
              <span className="w-1.5 h-1.5 rounded-full bg-[#00A86B] animate-pulse" />
              <span>DEVELOPER CULTURE & TECHNICAL LABORATORY</span>
            </div>

            {/* Main Headline: BUILD. LEARN. COMPETE. CONNECT. */}
            <h1 className="font-editorial text-5xl sm:text-7xl xl:text-[5.5rem] font-black text-[#111318] tracking-tight leading-[0.9] text-wrap-balance">
              BUILD. LEARN. <br />
              <span className="font-editorial-italic font-normal text-[#00A86B]">
                COMPETE.
              </span>{" "}
              CONNECT.
            </h1>

            {/* Editorial manifesto paragraph */}
            <p className="font-sans text-base sm:text-lg text-[#333840] max-w-xl leading-[1.6] border-l-2 border-[#111318] pl-5 font-normal">
              The official GeeksforGeeks Chapter on campus at Marwadi University. 
              We operate an engineering-first space for competitive programmers, open-source builders, 
              and student researchers pushing the envelope in software architecture.
            </p>

            {/* Technical Specification Bar */}
            <div className="grid grid-cols-3 gap-4 pt-4 border-t border-[#E2E2DC] max-w-md">
              <div className="space-y-1">
                <div className="font-mono text-[10px] text-[#555B63] font-bold uppercase tracking-wider opacity-60">01. INITIATIVE</div>
                <div className="font-sans text-xs sm:text-sm font-bold text-[#111318]">Student Chapter</div>
              </div>
              <div className="space-y-1">
                <div className="font-mono text-[10px] text-[#555B63] font-bold uppercase tracking-wider opacity-60">02. NETWORK</div>
                <div className="font-sans text-xs sm:text-sm font-bold text-[#111318]">600+ Builders</div>
              </div>
              <div className="space-y-1">
                <div className="font-mono text-[10px] text-[#555B63] font-bold uppercase tracking-wider opacity-60">03. STANDARDS</div>
                <div className="font-sans text-xs sm:text-sm font-bold text-[#00A86B]">NAAC A+</div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center gap-3 sm:gap-4 pt-2">
              <a
                href="https://chat.whatsapp.com/F7RcXCTLYJ4Ije5NiL6sDM"
                target="_blank"
                rel="noopener noreferrer"
                className="px-6 sm:px-8 py-3.5 sm:py-4 bg-[#111318] hover:bg-[#00A86B] text-[#F4F4F0] font-mono text-[11px] sm:text-xs font-bold uppercase tracking-widest transition-colors duration-200 inline-flex items-center space-x-2.5 shadow-sm"
              >
                <span>Join Community Circle</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </a>

              <Link
                to="/events"
                className="px-6 sm:px-8 py-3.5 sm:py-4 bg-transparent hover:bg-[#FFFFFF] border border-[#111318] text-[#111318] font-mono text-[11px] sm:text-xs font-bold uppercase tracking-widest transition-colors duration-200 inline-flex items-center space-x-2.5"
              >
                <span>Explore Events</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

          </div>

          {/* RIGHT 5 COLS: MOVING TILE PAPER POSTER SYSTEM */}
          <div className="lg:col-span-5 space-y-6 lg:pl-4">
            
            {/* The Moving Paper Tile Slices */}
            <div className="relative">
              <EditorialImage
                src="https://images.unsplash.com/photo-1531482615713-2afd69097998?q=80&w=1200&auto=format&fit=crop"
                alt="Marwadi University Tech Builders"
                variant="hero"
                headerLeft="FIG 01. / CAMPUS CODE BASE"
                headerRight="22°18'N 70°48'E"
                figLabel="CAMPUS LABS"
                figNumber="FIG.4-P"
                caption="MARWADI UNIVERSITY CAMPUS · RAJKOT"
                aspectClassName="aspect-[4/3]"
              />

              {/* Floated architectural metadata tag */}
              <motion.div 
                animate={{ y: [0, -4, 0] }}
                transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
                className="absolute -bottom-4 -left-3 sm:-bottom-5 sm:-left-6 bg-[#FFFFFF] border border-[#E2E2DC] p-4 sm:p-5 shadow-[0_8px_30px_rgba(17,19,24,0.06)] max-w-[240px] sm:max-w-xs z-30"
              >
                <div className="font-mono text-[10px] sm:text-[11px] font-bold uppercase tracking-widest text-[#555B63] mb-1">
                  CURRENT ACTIVATION
                </div>
                <div className="font-editorial italic text-base sm:text-lg text-[#111318] font-bold leading-tight">
                  National Hackathon, Coding Marathons & Tech Sprints
                </div>
                <div className="mt-2.5 flex items-center space-x-2 font-mono text-[10px] sm:text-xs font-bold text-[#00A86B]">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#00A86B] animate-ping" />
                  <span>REGISTRATION ACTIVE</span>
                </div>
              </motion.div>
            </div>

            {/* Bottom mini specs grid */}
            <div className="pt-2 sm:pt-4 grid grid-cols-2 gap-3 font-mono text-[10px] sm:text-xs text-[#555B63]">
              <div className="p-3 sm:p-3.5 bg-[#FFFFFF] border border-[#E2E2DC]">
                <span className="text-[9px] sm:text-[10px] font-bold text-[#555B63] block uppercase tracking-wider mb-0.5">FOCUS DOMAINS</span>
                <span className="font-bold text-xs sm:text-sm text-[#111318]">DSA · AI · Full-Stack</span>
              </div>
              <div className="p-3 sm:p-3.5 bg-[#FFFFFF] border border-[#E2E2DC]">
                <span className="text-[9px] sm:text-[10px] font-bold text-[#555B63] block uppercase tracking-wider mb-0.5">HOST INSTITUTION</span>
                <span className="font-bold text-xs sm:text-sm text-[#111318]">Marwadi University</span>
              </div>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
}
