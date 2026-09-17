import { motion } from "motion/react";
import { Link } from "react-router-dom";
import { ArrowUpRight, ArrowRight, Terminal, Sparkles, MapPin, Calendar, Users } from "lucide-react";
import PaperTiles from "./PaperTiles";

export default function Hero() {
  return (
    <section className="relative py-12 md:py-20 border-b border-[#E2E2DC] bg-[#F4F4F0] overflow-hidden select-none">
      
      {/* Background Architectural Grid Lines */}
      <div className="absolute inset-0 bg-technical-grid opacity-60 pointer-events-none" />

      <div className="max-w-[1400px] mx-auto px-6 relative z-10 w-full">
        
        {/* TOP TECHNICAL INDEX BAR */}
        <div className="flex flex-wrap items-center justify-between border-b border-[#E2E2DC] pb-4 mb-10 sm:mb-14 font-mono text-[10px] sm:text-[11px] uppercase tracking-[0.25em] text-[#8B9198]">
          <div className="flex items-center space-x-3">
            <span className="text-[#00A86B] font-bold">01 / ARCHIVE</span>
            <span>·</span>
            <span className="text-[#111318] font-semibold">GFG × MARWADI UNIVERSITY</span>
          </div>

          <div className="hidden md:flex items-center space-x-6">
            <span>RAJKOT, GUJARAT, IN</span>
            <span>·</span>
            <span>LAT 22.3039° N · LON 70.8022° E</span>
            <span>·</span>
            <span className="text-[#00A86B]">COMMUNITY ACTIVE</span>
          </div>

          <div className="font-semibold text-[#111318]">
            VOL. 2026 // ED. 04
          </div>
        </div>

        {/* ASYMMETRIC EDITORIAL POSTER GRID */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
          
          {/* LEFT 7 COLS: EDITORIAL TYPOGRAPHY & CALLS TO ACTION */}
          <div className="lg:col-span-7 space-y-8">
            
            {/* Supertag label */}
            <div className="inline-flex items-center space-x-2.5 px-3 py-1 bg-[#FFFFFF] border border-[#E2E2DC] text-[10px] font-mono uppercase tracking-widest text-[#555B63]">
              <span className="w-1.5 h-1.5 rounded-full bg-[#00A86B] animate-pulse" />
              <span>DEVELOPER CULTURE & TECHNICAL LABORATORY</span>
            </div>

            {/* Main Headline: BUILD. LEARN. COMPETE. CONNECT. */}
            <h1 className="font-editorial text-5xl sm:text-7xl lg:text-[5.4rem] font-black text-[#111318] tracking-tight leading-[0.95]">
              BUILD. LEARN. <br />
              <span className="font-editorial-italic font-normal text-[#00A86B]">
                COMPETE.
              </span>{" "}
              CONNECT.
            </h1>

            {/* Editorial manifesto paragraph */}
            <p className="font-sans text-base sm:text-lg text-[#555B63] max-w-xl leading-relaxed border-l-2 border-[#111318] pl-5">
              The official GeeksforGeeks Chapter on campus at Marwadi University. 
              We operate an engineering-first space for competitive programmers, open-source builders, 
              and student researchers pushing the envelope in software architecture.
            </p>

            {/* Technical Specification Bar */}
            <div className="grid grid-cols-3 gap-4 pt-4 border-t border-[#E2E2DC] max-w-xl">
              <div className="space-y-1">
                <div className="font-mono text-[9px] text-[#8B9198] uppercase tracking-wider">01. INITIATIVE</div>
                <div className="font-sans text-xs font-semibold text-[#111318]">Student Chapter</div>
              </div>
              <div className="space-y-1">
                <div className="font-mono text-[9px] text-[#8B9198] uppercase tracking-wider">02. NETWORK</div>
                <div className="font-sans text-xs font-semibold text-[#111318]">600+ Builders</div>
              </div>
              <div className="space-y-1">
                <div className="font-mono text-[9px] text-[#8B9198] uppercase tracking-wider">03. STANDARDS</div>
                <div className="font-sans text-xs font-semibold text-[#00A86B]">NAAC A+ Accredited</div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center gap-4 pt-2">
              <a
                href="https://chat.whatsapp.com/F7RcXCTLYJ4Ije5NiL6sDM"
                target="_blank"
                rel="noopener noreferrer"
                className="px-7 py-4 bg-[#111318] hover:bg-[#00A86B] text-[#F4F4F0] font-mono text-xs uppercase tracking-widest transition-colors duration-200 inline-flex items-center space-x-2"
              >
                <span>Join Community Circle</span>
                <ArrowUpRight className="w-4 h-4" />
              </a>

              <Link
                to="/events"
                className="px-7 py-4 bg-transparent hover:bg-[#FFFFFF] border border-[#111318] text-[#111318] font-mono text-xs uppercase tracking-widest transition-colors duration-200 inline-flex items-center space-x-2"
              >
                <span>Explore Events</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

          </div>

          {/* RIGHT 5 COLS: MOVING TILE PAPER POSTER SYSTEM */}
          <div className="lg:col-span-5 space-y-6">
            
            {/* Top metadata tag */}
            <div className="flex items-center justify-between font-mono text-[10px] text-[#8B9198] uppercase tracking-widest px-1">
              <span>FIG 01. / CAMPUS CODE BASE</span>
              <span className="text-[#00A86B]">22°18'N 70°48'E</span>
            </div>

            {/* The Moving Paper Tile Slices */}
            <div className="relative">
              <PaperTiles
                src="https://images.unsplash.com/photo-1531482615713-2afd69097998?q=80&w=1200&auto=format&fit=crop"
                alt="Marwadi University Tech Builders"
                stripsCount={4}
                tag="CAMPUS LABS"
                overlayBadge="MARWADI UNIVERSITY CAMPUS · RAJKOT"
                aspectClassName="aspect-[4/3]"
              />

              {/* Floated architectural metadata tag */}
              <motion.div 
                animate={{ y: [0, -4, 0] }}
                transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
                className="absolute -bottom-5 -left-4 sm:-left-6 bg-[#FFFFFF] border border-[#E2E2DC] p-4 shadow-[0_8px_30px_rgba(17,19,24,0.06)] max-w-xs z-30"
              >
                <div className="font-mono text-[9px] uppercase tracking-widest text-[#8B9198] mb-1">
                  CURRENT ACTIVATION
                </div>
                <div className="font-editorial italic text-base text-[#111318] leading-tight">
                  National Hackathon, Coding Marathons & Tech Sprints
                </div>
                <div className="mt-2 flex items-center space-x-2 font-mono text-[10px] text-[#00A86B]">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#00A86B] animate-ping" />
                  <span>REGISTRATION ACTIVE</span>
                </div>
              </motion.div>
            </div>

            {/* Bottom mini specs grid */}
            <div className="pt-4 grid grid-cols-2 gap-3 font-mono text-[11px] text-[#555B63]">
              <div className="p-3 bg-[#FFFFFF] border border-[#E2E2DC]">
                <span className="text-[9px] text-[#8B9198] block uppercase">FOCUS DOMAINS</span>
                <span className="font-semibold text-[#111318]">DSA · AI · Full-Stack</span>
              </div>
              <div className="p-3 bg-[#FFFFFF] border border-[#E2E2DC]">
                <span className="text-[9px] text-[#8B9198] block uppercase">HOST INSTITUTION</span>
                <span className="font-semibold text-[#111318]">Marwadi University</span>
              </div>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
}
