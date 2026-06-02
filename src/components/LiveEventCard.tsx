import { motion } from "motion/react";
import { useState, useEffect } from "react";
import { Calendar, Clock, Trophy, Users, FileText, MessageSquare, ArrowUpRight, ArrowRight, Info, CheckCircle2, Presentation, Layers } from "lucide-react";
import { cn } from "../lib/utils";
import { useTheme } from "../contexts/ThemeContext";

interface AnimatedCounterProps {
  target: number;
  duration?: number;
}

function AnimatedCounter({ target, duration = 1500 }: AnimatedCounterProps) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let start = 0;
    const end = target;
    if (start === end) return;

    const step = Math.max(1, Math.ceil(end / (duration / 25)));

    const timer = setInterval(() => {
      start += step;
      if (start >= end) {
        setCount(end);
        clearInterval(timer);
      } else {
        setCount(start);
      }
    }, 25);

    return () => clearInterval(timer);
  }, [target, duration]);

  return <span>{count}</span>;
}

function LiveEventCountdown() {
  const { theme } = useTheme();
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });

  useEffect(() => {
    const targetDate = new Date("2026-06-05T10:00:00+05:30"); // 10:00 AM IST on June 5, 2026
    
    const updateCountdown = () => {
      const now = new Date();
      const difference = targetDate.getTime() - now.getTime();
      
      if (difference <= 0) {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
        return;
      }
      
      const days = Math.floor(difference / (1000 * 60 * 60 * 24));
      const hours = Math.floor((difference / (1000 * 60 * 60)) % 24);
      const minutes = Math.floor((difference / 1000 / 60) % 60);
      const seconds = Math.floor((difference / 1000) % 60);
      
      setTimeLeft({ days, hours, minutes, seconds });
    };

    updateCountdown();
    const interval = setInterval(updateCountdown, 1000);
    return () => clearInterval(interval);
  }, []);

  const bgStyle = "bg-theme-bg border border-theme-border rounded-xl p-2 min-w-[50px] md:min-w-[65px] theme-transition shadow-sm";

  return (
    <div className="grid grid-cols-4 gap-2 text-center font-mono">
      <div className={bgStyle} id="countdown-days">
        <div className="text-sm md:text-lg font-black text-gfg-primary">{timeLeft.days}</div>
        <div className="text-[7px] uppercase text-theme-text-muted font-bold tracking-wide">Days</div>
      </div>
      <div className={bgStyle} id="countdown-hours">
        <div className="text-sm md:text-lg font-black text-gfg-primary">{timeLeft.hours}</div>
        <div className="text-[7px] uppercase text-theme-text-muted font-bold tracking-wide">Hours</div>
      </div>
      <div className={bgStyle} id="countdown-mins">
        <div className="text-sm md:text-lg font-black text-gfg-primary">{timeLeft.minutes}</div>
        <div className="text-[7px] uppercase text-theme-text-muted font-bold tracking-wide">Mins</div>
      </div>
      <div className={bgStyle} id="countdown-secs">
        <div className="text-sm md:text-lg font-black text-gfg-primary">{timeLeft.seconds}</div>
        <div className="text-[7px] uppercase text-theme-text-muted font-bold tracking-wide">Secs</div>
      </div>
    </div>
  );
}

export interface LiveEventCardProps {
  event?: {
    id?: number | string;
    eventId?: number | string;
    title?: string;
    description?: string;
    startDate?: string;
    startTime?: string;
    registrationLink?: string;
    category?: string;
  };
}

export default function LiveEventCard({ event }: LiveEventCardProps) {
  const { theme } = useTheme();
  const isFlagship = !event || event.title?.toLowerCase().includes("trivia") || event.title?.toLowerCase().includes("gfg");
  
  const title = event?.title || "Tech Trivia Clash X GFG on Campus MU";
  const description = event?.description || "An exciting technology quiz battle designed to test participants' knowledge of programming, AI, emerging technologies, computer science fundamentals, and problem-solving skills. Participants compete in multiple rounds for recognition, certificates, and exciting rewards.";
  
  const defaultUnstopUrl = "https://unstop.com/p/tech-trivia-clash-ultimate-quiz-battle-marwadi-university-mu-gujarat-1681437";
  const defaultPPTTemplateUrl = "https://docs.google.com/presentation/d/1xe_TL6V5OkvPmwcCVy5mGSCh1zjq7lQL/edit?usp=sharing&ouid=117999268989234840183&rtpof=true&sd=true";
  const defaultWhatsAppUrl = "https://chat.whatsapp.com/F7RcXCTLYJ4Ije5NiL6sDM";

  const registrationUrl = event?.registrationLink || defaultUnstopUrl;

  const scrollToTimeline = () => {
    const detailsEl = document.getElementById("featured-live-timeline-section");
    if (detailsEl) {
      detailsEl.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="p-6 md:p-10 rounded-[2.5rem] bg-theme-bg-secondary border-2 border-gfg-primary/30 relative overflow-hidden group hover:border-gfg-primary/50 transition-all duration-300 shadow-sm hover:shadow-md mb-12 text-left"
    >
      {/* Laser Top Highlight */}
      <div className="absolute top-0 left-0 w-full h-[3px] bg-gradient-to-r from-emerald-500 via-gfg-primary to-cyan-500" />
      <div className="absolute top-[-10%] right-[-10%] w-[400px] h-[400px] bg-gfg-primary/5 blur-[120px] rounded-full pointer-events-none animate-pulse" />

      {/* Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-start relative z-10">
        
        {/* LEFT COLUMN: Metadata, Titles, Stats, Actions */}
        <div className="lg:col-span-7 flex flex-col space-y-6">
          <div className="space-y-4">
            
            {/* Live Badges */}
            <div className="flex flex-wrap items-center gap-2.5">
              <span className="inline-flex items-center space-x-2 bg-red-500/10 px-3 py-1.5 rounded-full border border-red-500/20">
                <span className="flex h-2 w-2 relative">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
                </span>
                <span className="text-[9px] font-black tracking-widest text-red-500 uppercase font-mono">
                  🔴 LIVE NOW
                </span>
              </span>

              <span className="px-3 py-1.5 bg-gfg-primary/10 text-gfg-primary border border-gfg-primary/25 text-[8.5px] font-mono tracking-widest font-black rounded-full uppercase">
                🏆 Flagship Event
              </span>

              <span className="px-3 py-1.5 bg-theme-bg border border-theme-border text-theme-text-secondary text-[8.5px] font-mono tracking-widest font-semibold rounded-full uppercase shadow-sm">
                Round 2 PPT Submission Live
              </span>
            </div>

            {/* Title */}
            <h3 className="text-3xl md:text-5xl lg:text-5xl font-black text-theme-text uppercase tracking-tight leading-none italic group-hover:text-gfg-primary transition-colors">
              {title}
            </h3>

            {/* Categories */}
            <div className="flex items-center space-x-2 text-xs font-mono text-gfg-primary font-black uppercase tracking-wider">
              <span>Quiz Competition • Innovation • Technology</span>
            </div>

            {/* Unified Action Buttons */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              <button
                id="live-event-view-details"
                onClick={scrollToTimeline}
                className="h-12 w-full px-5 bg-theme-bg border border-theme-border hover:bg-theme-text hover:text-theme-bg text-theme-text font-black uppercase text-[9px] tracking-widest rounded-xl transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer shadow-sm"
              >
                <Layers className="w-4 h-4 shrink-0" />
                View Details
              </button>

              <a
                id="live-event-register-now"
                href={registrationUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="h-12 w-full px-5 bg-gfg-primary border border-gfg-primary text-black hover:bg-theme-text hover:text-theme-bg font-black uppercase text-[9px] tracking-widest rounded-xl transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer shadow-sm"
              >
                <ArrowRight className="w-4 h-4 shrink-0" />
                Register Now
              </a>

              <a
                id="live-event-submit-ppt"
                href={defaultUnstopUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="h-12 w-full px-5 bg-emerald-500/10 border border-emerald-500/30 text-gfg-primary hover:bg-gfg-primary hover:text-black hover:border-transparent font-black uppercase text-[9px] tracking-widest rounded-xl transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer shadow-sm"
              >
                <ArrowUpRight className="w-4 h-4 shrink-0" />
                Submit PPT
              </a>

              <a
                id="live-event-whatsapp-group"
                href={defaultWhatsAppUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="h-12 w-full px-5 bg-emerald-600/10 border border-emerald-500/30 text-gfg-primary hover:bg-[#25D366] hover:text-white hover:border-[#25D366] font-black uppercase text-[9px] tracking-widest rounded-xl transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer shadow-sm"
              >
                <MessageSquare className="w-4 h-4 shrink-0 text-[#25D366] group-hover:text-white animate-pulse" />
                Join WhatsApp Group
              </a>
            </div>
          </div>

          {/* Description */}
          <div className="space-y-4 pt-2">
            <p className="text-theme-text-secondary text-sm md:text-base leading-relaxed font-semibold">
              {description}
            </p>

            {/* Engagement Metrics */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 py-4 border-y border-theme-border">
              <div className="flex items-center space-x-3 shrink-0">
                <div className="p-3 bg-gfg-primary/10 rounded-xl border border-gfg-primary/20 text-gfg-primary shrink-0">
                  <Users className="w-4.5 h-4.5" />
                </div>
                <div>
                  <span className="text-theme-text-muted block text-[8px] uppercase font-mono font-black tracking-wider">ACTIVE ENGAGEMENT</span>
                  <strong className="text-theme-text font-mono text-sm font-black tracking-tight">
                    <AnimatedCounter target={164} duration={1200} /> REGISTERED GEEKS
                  </strong>
                </div>
              </div>

              <div className="flex items-center space-x-3 shrink-0">
                <div className="p-3 bg-cyan-500/10 rounded-xl border border-cyan-500/20 text-cyan-500 shrink-0">
                  <Trophy className="w-4.5 h-4.5" />
                </div>
                <div>
                  <span className="text-theme-text-muted block text-[8px] uppercase font-mono font-black tracking-wider">CONTEST ITERATION</span>
                  <strong className="text-gfg-primary font-mono text-xs font-black uppercase">
                    ROUND 2 OF 3 ACTIVE
                  </strong>
                </div>
              </div>
            </div>

            {/* Custom Interactive Progress Bar */}
            <div className="space-y-2 pt-1">
              <div className="flex justify-between items-center font-mono text-[9px] text-theme-text-muted font-bold uppercase tracking-widest">
                <span>CONTEST WORKFLOW COMPLETIBILITY:</span>
                <span className="text-gfg-primary">55% PROGRESS</span>
              </div>
              <div className="w-full h-2 bg-theme-bg border border-theme-border rounded-full overflow-hidden relative">
                <div className="absolute top-0 left-0 h-full w-[55%] bg-gfg-primary rounded-full shadow-[0_0_10px_rgba(0,199,83,0.3)]" />
              </div>
              <div className="grid grid-cols-3 text-[8.5px] font-mono text-theme-text-muted leading-tight pt-1">
                <div className="text-left font-bold">Round 1 Quiz (Done)</div>
                <div className="text-center font-extrabold text-gfg-primary animate-pulse">Round 2 PPT Upload (Live)</div>
                <div className="text-right font-medium">Round 3 Presentation (Jun 07)</div>
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: Submission Countdown Dial & Timeline flow */}
        <div className="lg:col-span-5 flex flex-col space-y-6 self-stretch">
          
          {/* Submission Info & Countdown */}
          <div className="p-6 bg-theme-bg border border-theme-border rounded-[2rem] relative overflow-hidden space-y-5 shadow-sm">
            <div className="absolute top-0 right-0 w-32 h-32 bg-gfg-primary/3 blur-2xl rounded-full" />
            
            <div className="text-left space-y-1 border-b border-theme-border pb-3">
              <span className="text-gfg-primary font-mono text-[9px] uppercase tracking-widest font-black block">SUBMISSION COUNTDOWN DIAL</span>
              <span className="text-theme-text-secondary font-sans text-xs font-semibold block leading-snug">Time remaining for Round 2 PPT uploading:</span>
            </div>

            <div className="py-1">
              <LiveEventCountdown />
            </div>

            <div className="p-4 bg-theme-bg-secondary border border-theme-border rounded-2xl flex items-start gap-3 text-left shadow-sm">
              <Info className="w-4 h-4 text-gfg-primary shrink-0 mt-0.5" />
              <div className="space-y-1 font-mono text-[9px]">
                <span className="text-theme-text font-black uppercase tracking-wider block">Round 2 Instructions</span>
                <span className="text-theme-text-secondary leading-relaxed block">Use original slides with the official GfG MU deck format. Only shortlisted competitors from Round 1 qualify.</span>
              </div>
            </div>
          </div>

          {/* Timeline Nodes */}
          <div className="p-6 bg-theme-bg border border-theme-border rounded-[2rem] text-left flex-1 flex flex-col justify-between shadow-sm" id="featured-live-timeline-section">
            <div className="space-y-4">
              <span className="text-[10px] font-mono tracking-widest text-gfg-primary uppercase block font-black mb-1">
                [ CONTEST ELIMINATION FLOW TIMELINE ]
              </span>

              <div className="relative pl-6 border-l border-theme-border space-y-6 py-1">
                <div className="absolute top-0 left-[-1.5px] w-[2.5px] h-[95%] bg-gfg-primary/20 pointer-events-none" />

                <div className="relative group/node text-xs">
                  <span className="absolute -left-[30.5px] top-1 w-3.5 h-3.5 bg-theme-bg border-[3px] border-gfg-primary/50 rounded-full z-10" />
                  <div className="space-y-0.5">
                    <div className="flex justify-between items-center flex-wrap gap-2">
                      <strong className="text-theme-text font-black uppercase text-[10px]">Round 1: Quiz Round</strong>
                      <span className="text-[8.5px] font-mono text-theme-text-muted">21 May - 23 May</span>
                    </div>
                    <p className="text-[11px] text-theme-text-secondary font-medium">Online logical reasoning coding contest. (Completed)</p>
                  </div>
                </div>

                <div className="relative group/node text-xs">
                  <span className="absolute -left-[30.5px] top-1 w-3.5 h-3.5 bg-theme-bg border-[3px] border-gfg-primary rounded-full z-10 animate-pulse shadow-[0_0_10px_var(--gfg-primary)]" />
                  <div className="space-y-0.5">
                    <div className="flex justify-between items-center flex-wrap gap-2">
                      <strong className="text-gfg-primary font-black uppercase text-[10px]">Round 2: PPT Submission</strong>
                      <span className="text-[8.5px] font-mono text-gfg-primary font-bold">25 May - 05 June</span>
                    </div>
                    <p className="text-[10.5px] text-theme-text-secondary leading-relaxed font-semibold">
                      Upload approach slides. Direct template deck is available via download actions.
                    </p>
                    <div className="pt-2">
                      <a
                        href={defaultPPTTemplateUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-gfg-primary/10 border border-gfg-primary/20 rounded-xl text-[9px] font-mono text-gfg-primary uppercase hover:bg-gfg-primary hover:text-black transition-all cursor-pointer font-bold shadow-sm"
                      >
                        <Presentation className="w-3 h-3" /> Get Slide Template
                      </a>
                    </div>
                  </div>
                </div>

                <div className="relative group/node text-xs">
                  <span className="absolute -left-[30.5px] top-1 w-3.5 h-3.5 bg-theme-bg border-[3px] border-theme-border rounded-full z-10" />
                  <div className="space-y-0.5">
                    <div className="flex justify-between items-center flex-wrap gap-2">
                      <strong className="text-theme-text-muted font-bold uppercase text-[10px]">Round 3: Video Presentation</strong>
                      <span className="text-[8.5px] font-mono text-theme-text-muted">07 June - 15 June</span>
                    </div>
                    <p className="text-[11px] text-theme-text-secondary">Submit a 3-5min video presentation demonstrating core prototype feasibility. (Upcoming)</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-theme-border flex justify-between items-center text-[9px] font-mono text-theme-text-muted">
              <span className="uppercase">IMPORTANT STATUS:</span>
              <span className="text-theme-text font-bold">REGISTRATIONS FILLED & CLOSED</span>
            </div>
          </div>

        </div>

      </div>
    </motion.div>
  );
}
