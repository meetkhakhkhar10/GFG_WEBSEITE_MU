import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  Users, BookOpen, Calendar, Code2, 
  ChevronLeft, ChevronRight, Play, Pause, 
  Sparkles, Award, Boxes, MessageSquare, 
  TrendingUp, Award as AwardIcon, Briefcase, Zap, 
  Compass, ArrowRight, ShieldCheck, Milestone
} from "lucide-react";
import { cn } from "@/src/lib/utils";

interface StepDetail {
  title: string;
  short: string;
  desc: string;
  stat: string;
  statLabel: string;
  metric: string;
  metricLabel: string;
  accent: string;
  icon: any;
  colorName: string;
}

const journeySteps: StepDetail[] = [
  {
    title: "Join The Community",
    short: "Become part of GFG MU.",
    desc: "Step into an incredible ecosystem of tech enthusiasts. Attend our orientation, receive your introductory developer kit, and forge friendships with peer coders.",
    stat: "1,500+",
    statLabel: "Active Chapter Members",
    metric: "300+",
    metricLabel: "Daily Workspace Messages",
    accent: "from-emerald-500 to-green-400",
    icon: Users,
    colorName: "#00ff88"
  },
  {
    title: "Learn New Skills",
    short: "Master professional topics.",
    desc: "Participate in guided peer-learning circles, deep-dive coding hours, and DSA study tracks tailored for both beginners and aspiring tech leads.",
    stat: "45+",
    statLabel: "Guided Study Circles",
    metric: "120+",
    metricLabel: "Weekly Hours of Practice",
    accent: "from-green-400 to-teal-500",
    icon: BookOpen,
    colorName: "#10b981"
  },
  {
    title: "Participate In Events",
    short: "Test your boundaries.",
    desc: "Enter coding contests, competitive hackathons, industry webinars, and tech festivals where you apply your knowledge live under a standard timer.",
    stat: "12+",
    statLabel: "Major Annual hackathons",
    metric: "₹3L+",
    metricLabel: "Cash Prizes Distributed",
    accent: "from-teal-500 to-cyan-400",
    icon: Calendar,
    colorName: "#06b6d4"
  },
  {
    title: "Build Amazing Projects",
    short: "Transform code into solutions.",
    desc: "Collaborate in team sprints to develop open-source systems, mobile apps, and full-stack solutions that solve real community and university challenges.",
    stat: "30+",
    statLabel: "Active Repositories",
    metric: "8+",
    metricLabel: "Production Deployments",
    accent: "from-cyan-400 to-blue-500",
    icon: Code2,
    colorName: "#3b82f6"
  },
  {
    title: "Connect With Mentors",
    short: "Receive elite coaching.",
    desc: "Get industry guidance from GeeksforGeeks alumni, senior technical leaders, and partner developers who review your code and offer career pathways.",
    stat: "25+",
    statLabel: "Elite Industry Coaches",
    metric: "500+",
    metricLabel: "Resume Audits Completed",
    accent: "from-blue-500 to-indigo-500",
    icon: ShieldCheck,
    colorName: "#6366f1"
  },
  {
    title: "Become A Leader",
    short: "Guide the next wave.",
    desc: "Gain administrative and organizational powers. Run technical chapters, host mega events, mentor freshers, and manage global club initiatives.",
    stat: "40+",
    statLabel: "Core Organizer Roles",
    metric: "20+",
    metricLabel: "Successfully Hosted Events",
    accent: "from-indigo-500 to-purple-500",
    icon: Zap,
    colorName: "#8b5cf6"
  },
  {
    title: "Launch Your Career",
    short: "Step onto the big stage.",
    desc: "Leverage resume-building clinics, interview mockups, exclusive referral networks, and placement partnerships to land your dream technical job.",
    stat: "98%",
    statLabel: "Chapter Referral Offer Rate",
    metric: "24",
    metricLabel: "Highest Package (LPA)",
    accent: "from-purple-500 to-emerald-500",
    icon: Briefcase,
    colorName: "#10b981"
  }
];

export default function JourneyTrack() {
  const [activeStep, setActiveStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const [particleSeed] = useState(() => 
    Array.from({ length: 28 }).map((_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 3 + 1,
      delay: Math.random() * 8,
      duration: Math.random() * 10 + 10,
    }))
  );

  // Auto cyclic transition
  useEffect(() => {
    if (!isPlaying) return;
    const interval = setInterval(() => {
      setActiveStep((prev) => (prev + 1) % journeySteps.length);
    }, 6000);
    return () => clearInterval(interval);
  }, [isPlaying]);

  // Touch swipe support for mobile
  const touchStartX = useRef<number | null>(null);
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };
  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null) return;
    const diffX = touchStartX.current - e.changedTouches[0].clientX;
    touchStartX.current = null;
    if (Math.abs(diffX) > 50) {
      if (diffX > 0) {
        // swipe left -> next
        setActiveStep((prev) => (prev + 1) % journeySteps.length);
      } else {
        // swipe right -> prev
        setActiveStep((prev) => (prev - 1 + journeySteps.length) % journeySteps.length);
      }
    }
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    setMousePos({ x, y });
  };

  const currentStepData = journeySteps[activeStep];
  const StepIcon = currentStepData.icon;

  return (
    <div 
      id="journey-experience-matrix"
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => { setIsHovered(true); setIsPlaying(false); }}
      onMouseLeave={() => { setIsHovered(false); setIsPlaying(true); }}
      className="relative w-full overflow-hidden rounded-[3.5rem] bg-[#050505] border border-white/5 shadow-[0_24px_80px_rgba(0,0,0,0.8)] p-6 md:p-12 lg:p-16 select-none transition-all duration-500"
    >
      {/* Dynamic Cinematic Laser Light reflection following the mouse */}
      {isHovered && (
        <div 
          className="absolute pointer-events-none rounded-full blur-[140px] opacity-40 transition-opacity duration-500"
          style={{
            left: `${mousePos.x}px`,
            top: `${mousePos.y}px`,
            width: "350px",
            height: "350px",
            transform: "translate(-50%, -50%)",
            background: `radial-gradient(circle, ${currentStepData.colorName} 0%, rgba(0,0,30,0) 70%)`
          }}
        />
      )}

      {/* Cyberpunk Grid Background Grid lines */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#111111_1px,transparent_1px),linear-gradient(to_bottom,#111111_1px,transparent_1px)] bg-[size:32px_32px] opacity-25 pointer-events-none" />
      <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-black/80 pointer-events-none" />

      {/* Floating Sparkles and Stars */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {particleSeed.map((p) => (
          <motion.div
            key={p.id}
            className="absolute rounded-full bg-white opacity-25"
            style={{
              left: `${p.x}%`,
              top: `${p.y}%`,
              width: `${p.size}px`,
              height: `${p.size}px`,
              backgroundColor: p.id % 2 === 0 ? "#00ff88" : "#ffffff",
              boxShadow: p.id % 3 === 0 ? "0 0 10px #00ff88" : "none",
            }}
            animate={{
              y: ["0px", "-40px", "0px"],
              opacity: [0.1, 0.7, 0.1],
              scale: [1, 1.4, 1],
            }}
            transition={{
              duration: p.duration,
              repeat: Infinity,
              delay: p.delay,
              ease: "easeInOut"
            }}
          />
        ))}
      </div>

      {/* HEADER CONTROLS (SYSTEM STATUS - TECH CHAPTER PROTOCOLS) */}
      <div className="relative z-10 flex flex-wrap items-center justify-between gap-6 pb-6 border-b border-white/5 mb-10">
        <div className="flex items-center space-x-3.5">
          <div className="relative">
            <span className="absolute inset-0 rounded-full bg-[#00ff88]/30 animate-ping" />
            <span className="relative block w-2.5 h-2.5 rounded-full bg-[#00ff88]" />
          </div>
          <span className="text-[10px] sm:text-xs font-mono tracking-[0.25em] font-black text-white/50 uppercase">
            GEEKSFORGEEKS MU CHAPTER PROTOCOLS
          </span>
        </div>

        {/* Auto Loop / Navigation Assist Indicator */}
        <div className="flex items-center space-x-4 shrink-0">
          <button
            type="button"
            onClick={() => setIsPlaying(!isPlaying)}
            className="group/btn flex items-center justify-center space-x-2 px-3 py-1.5 rounded-full bg-white/5 hover:bg-white/10 text-white/60 hover:text-white transition-all text-[9px] font-mono tracking-widest uppercase cursor-pointer border border-white/5"
          >
            {isPlaying ? (
              <>
                <Pause className="w-3 h-3 text-[#00ff88] animate-pulse" />
                <span>CYCLING ACTIVE</span>
              </>
            ) : (
              <>
                <Play className="w-3 h-3 text-white/40" />
                <span>CYCLES PAUSED</span>
              </>
            )}
          </button>

          {/* Quick Manual Navigation Headers */}
          <div className="flex items-center space-x-1">
            <button
              onClick={() => setActiveStep((prev) => (prev - 1 + journeySteps.length) % journeySteps.length)}
              className="p-1.5 rounded-lg bg-white/5 hover:bg-white/15 border border-white/5 text-white/80 active:scale-90 transition-transform cursor-pointer"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={() => setActiveStep((prev) => (prev + 1) % journeySteps.length)}
              className="p-1.5 rounded-lg bg-white/5 hover:bg-white/15 border border-white/5 text-white/80 active:scale-90 transition-transform cursor-pointer"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* CENTRAL EXPERIENCE GRID */}
      <div 
        id="timeline-roadset-carousel"
        onTouchStart={handleTouchStart} 
        onTouchEnd={handleTouchEnd} 
        className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12"
      >
        
        {/* LEFT COLUMN: ACTIVE STEP GLOWING OVERVIEW WITH SPRING ROLL ENGINE */}
        <div className="lg:col-span-4 flex flex-col justify-between space-y-8 pr-0 lg:pr-6 border-r border-transparent lg:border-white/5 text-left">
          <div className="space-y-6 relative">
            <div className="flex items-baseline space-x-2 relative">
              
              {/* rolling number system container */}
              <div className="overflow-hidden h-[120px] md:h-[160px] flex items-center relative">
                <AnimatePresence mode="popLayout" initial={false}>
                  <motion.div
                    key={activeStep}
                    initial={{ y: "70%", opacity: 0, filter: "blur(10px)" }}
                    animate={{ y: "0%", opacity: 1, filter: "blur(0px)" }}
                    exit={{ y: "-70%", opacity: 0, filter: "blur(10px)" }}
                    transition={{ type: "spring", stiffness: 180, damping: 20 }}
                    className="font-mono font-black italic tracking-tighter text-transparent bg-clip-text bg-gradient-to-b from-[#00ff88] via-green-400 to-transparent flex items-center select-none"
                    style={{
                      fontSize: "clamp(5rem, 12vw, 9rem)",
                      textShadow: "0 0 40px rgba(0, 255, 136, 0.15)"
                    }}
                  >
                    0{activeStep + 1}
                  </motion.div>
                </AnimatePresence>
                
                {/* Micro Ambient Floating Orbs around active counter */}
                <span className="absolute right-0 top-1/3 w-3 h-3 rounded-full bg-[#00ff88]/30 animate-ping pointer-events-none" />
              </div>
            </div>

            {/* Dynamic Step Accent Pill Indicator */}
            <div className="space-y-3">
              <span className="inline-flex items-center space-x-2 px-3.5 py-1 rounded-full bg-white/5 border border-white/10 text-[9px] font-mono tracking-[0.2em] font-black text-[#00ff88]">
                <Milestone className="w-3 h-3 animate-spin" style={{ animationDuration: "8s" }} />
                <span>MILESTONE GATEWAY</span>
              </span>
              
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeStep}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 10 }}
                  transition={{ duration: 0.3 }}
                >
                  <h3 className="text-3xl md:text-4xl font-black text-white italic tracking-tighter uppercase leading-none">
                    {currentStepData.title}
                  </h3>
                </motion.div>
              </AnimatePresence>
            </div>
          </div>

          {/* Quick Stats Grid with Count Up effect inside Left column */}
          <div className="grid grid-cols-2 gap-4 pt-6 border-t border-white/5">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeStep}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3 }}
                className="p-4 rounded-2xl bg-white/[0.02] border border-white/5 text-left select-none relative group overflow-hidden"
              >
                <div className="absolute top-0 right-0 w-12 h-12 bg-[#00ff88]/5 rounded-bl-full pointer-events-none" />
                <span className="font-mono font-black text-2xl text-white tracking-widest block group-hover:text-[#00ff88] transition-colors leading-none mb-1">
                  {currentStepData.stat}
                </span>
                <span className="text-[9px] font-mono tracking-wider font-extrabold text-white/40 uppercase block">
                  {currentStepData.statLabel}
                </span>
              </motion.div>
            </AnimatePresence>

            <AnimatePresence mode="wait">
              <motion.div
                key={activeStep + "_metric"}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3, delay: 0.05 }}
                className="p-4 rounded-2xl bg-white/[0.02] border border-white/5 text-left select-none relative group overflow-hidden"
              >
                <div className="absolute top-0 right-0 w-12 h-12 bg-green-500/[0.03] rounded-bl-full pointer-events-none" />
                <span className="font-mono font-black text-2xl text-white tracking-widest block group-hover:text-[#00ff88] transition-colors leading-none mb-1">
                  {currentStepData.metric}
                </span>
                <span className="text-[9px] font-mono tracking-wider font-extrabold text-white/40 uppercase block">
                  {currentStepData.metricLabel}
                </span>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>

        {/* RIGHT COLUMN: DETAILED INSIGHTS & INTERACTIVE STEPS TRACK */}
        <div className="lg:col-span-8 flex flex-col justify-between space-y-10 text-left">
          
          {/* STEPPER STEP NAVIGATION (Connecting Line + Animated Active Indicator Node) */}
          <div className="relative pt-6">
            
            {/* The Green Laser Energy Line */}
            <div className="absolute top-[48px] left-0 right-0 h-[2px] bg-white/5 pointer-events-none">
              <motion.div 
                className="h-full bg-gradient-to-r from-[#00ff88] via-green-400 to-green-600 rounded-full"
                animate={{
                  width: `${(activeStep / (journeySteps.length - 1)) * 100}%`
                }}
                transition={{ type: "spring", stiffness: 80, damping: 15 }}
              />
            </div>

            {/* Steps interactive list container */}
            <div className="relative flex justify-between items-center z-10 w-full overflow-x-auto no-scrollbar pb-4 -mx-2 px-2">
              {journeySteps.map((step, idx) => {
                const isCompleted = idx < activeStep;
                const isActive = idx === activeStep;
                const StepNodeIcon = step.icon;

                return (
                  <button
                    key={step.title}
                    type="button"
                    data-gfg-milestone="true"
                    onClick={() => setActiveStep(idx)}
                    className="relative group flex flex-col items-center shrink-0 min-w-[70px] select-none cursor-pointer focus:outline-none"
                  >
                    {/* Node Circle Outer Pulse */}
                    <div className="relative flex items-center justify-center w-11 h-11 mb-2.5">
                      
                      {/* Active green breathing glowing background */}
                      {isActive && (
                        <motion.div
                          layoutId="node-pulse-ring"
                          className="absolute inset-0 rounded-full bg-[#00ff88]/20 border border-[#00ff88]/50 blur-[4px]"
                          animate={{ scale: [1, 1.25, 1] }}
                          transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
                        />
                      )}

                      {/* Internal Circle Node shape */}
                      <div
                        className={cn(
                          "relative w-8 h-8 rounded-full border flex items-center justify-center transition-all duration-300",
                          isActive 
                            ? "bg-[#050505] border-[#00ff88] text-[#00ff88] shadow-[0_0_15px_rgba(0,255,136,0.3)] scale-110"
                            : isCompleted
                              ? "bg-[#00ff88] border-[#00ff88] text-black"
                              : "bg-[#0f0f11] border-white/10 text-white/30 group-hover:border-white/30 group-hover:text-white/70"
                        )}
                      >
                        {isCompleted ? (
                          <span className="text-[10px] font-black">✓</span>
                        ) : (
                          <span className="text-[10px] font-mono font-black">0{idx + 1}</span>
                        )}
                      </div>
                    </div>

                    {/* Step Micro Label */}
                    <span 
                      className={cn(
                        "text-[8px] sm:text-[9px] font-mono tracking-widest uppercase font-black transition-colors block text-center max-w-[64px] truncate",
                        isActive 
                          ? "text-[#00ff88]" 
                          : "text-white/40 group-hover:text-white/70"
                      )}
                    >
                      {step.title.split(" ")[0]}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* ACTIVE CONTENT CARD WITH GLASSMORPHISM AND BLUR ENTRY */}
          <div className="relative flex-1">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeStep}
                initial={{ opacity: 0, y: 20, filter: "blur(6px)", scale: 0.98 }}
                animate={{ opacity: 1, y: 0, filter: "blur(0px)", scale: 1 }}
                exit={{ opacity: 0, y: -20, filter: "blur(6px)", scale: 0.98 }}
                transition={{ duration: 0.35, ease: "easeOut" }}
                className="relative rounded-3xl p-6 md:p-8 bg-white/[0.02] border border-white/5 shadow-2xl overflow-hidden min-h-[220px] flex flex-col justify-between"
              >
                {/* Soft backdrop blur decoration */}
                <div className="absolute inset-0 bg-[#0c0c11]/40 backdrop-blur-3xl -z-10" />

                <div className="space-y-4">
                  {/* High Quality Quote Label */}
                  <div className="flex items-center space-x-2.5 text-[#00ff88] shrink-0">
                    <Sparkles className="w-4.5 h-4.5 animate-pulse" />
                    <span className="text-xs font-mono font-bold tracking-[0.15em] uppercase">
                      "{currentStepData.short}"
                    </span>
                  </div>

                  {/* Description text block with staggered presentation */}
                  <p className="text-white/70 text-sm md:text-base leading-relaxed font-semibold">
                    {currentStepData.desc}
                  </p>
                </div>

                {/* Bottom decorative bar displaying progress ratio */}
                <div className="mt-8 pt-6 border-t border-white/5 flex flex-wrap items-center justify-between gap-4">
                  <div className="flex items-center space-x-2.5">
                    <div className="w-5 h-5 rounded-lg bg-white/5 flex items-center justify-center border border-white/10 shrink-0">
                      <StepIcon className="w-3 h-3 text-[#00ff88]" />
                    </div>
                    <span className="text-[10px] font-mono tracking-widest text-white/40 font-black uppercase">
                      COGNITIVE LEVEL {activeStep + 1} OF 7
                    </span>
                  </div>

                  {/* Mini Progress Loop Track Indicator bar */}
                  <div className="flex items-center space-x-1">
                    {journeySteps.map((_, i) => (
                      <div
                        key={i}
                        className={cn(
                          "h-1 rounded-full transition-all duration-300",
                          i === activeStep 
                            ? "w-8 bg-[#00ff88] shadow-[0_0_8px_#00ff88]" 
                            : i < activeStep 
                              ? "w-2 bg-[#00ff88]/40" 
                              : "w-2 bg-white/10"
                        )}
                      />
                    ))}
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

        </div>
      </div>

    </div>
  );
}
