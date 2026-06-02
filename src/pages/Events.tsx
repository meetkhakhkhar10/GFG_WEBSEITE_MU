import { motion } from "motion/react";
import { Calendar, Clock, ArrowRight, Image as ImageIcon, Loader2, Sparkles, ArrowUpRight, Trophy, Users, Layers, Award, Terminal, CheckCircle2, ShieldCheck, FileText, Presentation, ExternalLink, Youtube, Info, MessageSquare } from "lucide-react";
import { useState, useEffect } from "react";
import { cn } from "../lib/utils";
import { apiService } from "../services/apiService";
import { useAuth } from "../contexts/AuthContext";
import { useTheme } from "../contexts/ThemeContext";
import { subscribeToEvents } from "../utils/eventHelpers";
import LiveEventCard from "../components/LiveEventCard";

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

export default function Events() {
  const [events, setEvents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const { theme } = useTheme();
  const [particles, setParticles] = useState<any[]>([]);
  const [statusTab, setStatusTab] = useState<"all" | "live" | "completed">("all");
  const showFeaturedLive = true;

  useEffect(() => {
    const generated = Array.from({ length: 15 }, (_, i) => ({
      id: i,
      left: `${(i * 7) % 100}%`,
      top: `${(i * 13) % 100}%`,
      size: `${2 + (i % 4)}px`,
      duration: 10 + (i % 6) * 4,
      delay: i * 0.3,
    }));
    setParticles(generated);
  }, []);

  useEffect(() => {
    const unsub = subscribeToEvents((list) => {
      setEvents(list.filter((e) => e.visibility && e.status !== "upcoming"));
      setLoading(false);
    });
    return () => unsub();
  }, []);

  const handleRegister = async (eventId: number, externalLink?: string) => {
    if (externalLink) {
      window.open(externalLink, '_blank');
      return;
    }

    if (!user) {
      alert("Please login to register for internal university events!");
      return;
    }

    try {
      const result = await apiService.registerForEvent(eventId);
      if (result.success) {
        alert("Successfully registered for the event!");
      } else {
        alert(result.message || "Registration failed");
      }
    } catch (error) {
      alert("Error registering for event");
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="py-32 bg-theme-bg min-h-screen text-theme-text theme-transition"
    >
      <div className="max-w-7xl mx-auto px-6">
        {/* Header Section */}
        <div className="text-center mb-20">
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center space-x-2 px-4 py-1.5 mb-6 text-[10px] font-black tracking-widest text-gfg-primary uppercase bg-gfg-primary/10 border border-gfg-primary/20 rounded-full shadow-sm"
          >
            <span className="w-1.5 h-1.5 bg-gfg-primary rounded-full animate-pulse" />
            <span>Campus Innovation Hub</span>
          </motion.div>
          
          <h1 className="text-5xl md:text-7xl font-black mb-6 tracking-tighter uppercase leading-[0.9]">
            Campus <br />
            <span className="text-gfg-primary">Events</span>
          </h1>
          <p className="text-theme-text-muted max-w-2xl mx-auto text-sm md:text-base font-bold uppercase tracking-wider">
            Join our immersive hackathons, competitive coding jams, and collaborative workshops.
          </p>
        </div>

        {/* ICT CODEJAM HIGHLIGHT REDIRECT */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="relative mb-16 p-1 bg-gradient-to-r from-cyan-500 via-gfg-primary to-cyan-500 rounded-[2.5rem] overflow-hidden shadow-sm group"
        >
          <div className="bg-theme-bg-secondary rounded-[2.4rem] p-8 md:p-12 relative overflow-hidden flex flex-col lg:flex-row items-center justify-between gap-8">
            <div className="absolute top-0 left-0 w-80 h-80 bg-gfg-primary/5 rounded-full blur-[100px] pointer-events-none" />
            
            <div className="space-y-4 text-left max-w-2xl relative z-10">
              <h2 className="text-3xl md:text-5xl font-black text-theme-text italic uppercase tracking-tighter leading-none">
                ICT CODEJAM <span className="text-gfg-primary">PORTAL</span>
              </h2>
              
              <p className="text-theme-text-secondary text-sm leading-relaxed font-semibold">
                Our main coding challenge system and algorithm dashboard have migrated to the high-speed <span className="text-gfg-primary font-bold">ICT CodeJam Platform</span>. Find direct problems, real-time code execution, and international leaderboards.
              </p>
            </div>

            <div className="relative z-10 shrink-0 w-full lg:w-auto">
              <a
                href="https://ict-codejam.vercel.app/"
                target="_blank"
                rel="noopener noreferrer"
                className="w-full lg:w-auto px-10 py-5 bg-gfg-primary text-black font-black uppercase text-xs tracking-widest rounded-xl hover:bg-theme-text hover:text-theme-bg hover:border-transparent transition-all duration-300 flex items-center justify-center gap-2.5 group/btn"
              >
                Go To CodeJam Portal <ArrowUpRight className="w-4 h-4 transition-transform group-hover/btn:translate-x-1 group-hover/btn:-translate-y-1" />
              </a>
            </div>
          </div>
        </motion.div>

        {/* STATISTICS SECTION */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-16 shadow-none"
        >
          {[
            {
              title: "Conducted Nodes",
              icon: Trophy,
              text: "MAJOR",
              count: 2,
              desc: "Events conducted",
              accent: "text-gfg-primary",
              bg: "bg-gfg-primary/10 border-gfg-primary/20",
              glow: "bg-gfg-primary/3"
            },
            {
              title: "Engaged Audience",
              icon: Users,
              text: "+",
              count: 400,
              desc: "Student participants",
              accent: "text-cyan-500",
              bg: "bg-cyan-500/10 border-cyan-500/20",
              glow: "bg-cyan-500/3"
            },
            {
              title: "Technical Iterations",
              icon: Layers,
              text: "ROUNDS",
              count: 6,
              desc: "Organized rounds",
              accent: "text-purple-500",
              bg: "bg-purple-500/10 border-purple-500/20",
              glow: "bg-purple-500/3"
            },
            {
              title: "Success Rate",
              icon: ShieldCheck,
              text: "%",
              count: 100,
              desc: "Event completion",
              accent: "text-emerald-500",
              bg: "bg-emerald-500/10 border-emerald-500/20",
              glow: "bg-emerald-500/3"
            }
          ].map((stat, i) => (
            <div key={i} className="p-8 rounded-[2rem] bg-theme-bg-secondary border border-theme-border relative overflow-hidden group hover:border-gfg-primary/30 transition-all duration-300 text-left shadow-sm">
              <div className={cn("absolute top-0 right-0 w-32 h-32 blur-2xl rounded-full", stat.glow)} />
              <div className="flex items-center space-x-3 mb-4">
                <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center", stat.bg)}>
                  <stat.icon className="w-5 h-5" />
                </div>
                <span className="text-[10px] font-mono text-theme-text-muted uppercase tracking-widest font-black">{stat.title}</span>
              </div>
              <strong className="text-3xl font-black font-mono text-theme-text block">
                <AnimatedCounter target={stat.count} duration={stat.count > 10 ? 1000 : 400} /> {stat.text}
              </strong>
              <span className="text-[10px] text-theme-text-muted uppercase font-mono mt-1 block">{stat.desc}</span>
            </div>
          ))}
        </motion.div>

        {/* SECTION HEADER AND TAB FILTERS */}
        <div className="mb-12 text-left">
          <h2 className="text-3xl md:text-5xl font-black tracking-tighter uppercase text-theme-text mb-4 italic">
            PAST EVENTS AT <span className="text-gfg-primary">MARWADI UNIVERSITY</span>
          </h2>
          <p className="text-sm text-theme-text-secondary font-semibold max-w-3xl leading-relaxed mb-8">
            Building a stronger tech community through coding competitions, quizzes, innovation challenges, and skill-development initiatives.
          </p>

          <div className="flex flex-wrap gap-3">
            {(["all", "live", "completed"] as const).map((tab) => {
              const active = statusTab === tab;
              return (
                <button
                  key={tab}
                  onClick={() => setStatusTab(tab)}
                  className={cn(
                    "px-6 py-3 rounded-full text-[10px] font-mono font-black uppercase tracking-widest border transition-all duration-300 transform select-none cursor-pointer shadow-sm",
                    active
                      ? "bg-gfg-primary text-black border-gfg-primary shadow-sm scale-[1.03]"
                      : "bg-theme-bg-secondary text-theme-text-secondary border-theme-border hover:bg-theme-text hover:text-theme-bg"
                  )}
                >
                  {tab === "all" ? "🌐 ALL EVENTS" : tab === "live" ? "🔥 LIVE NOW" : "🏆 COMPLETED"}
                </button>
              );
            })}
          </div>
        </div>

        {/* EVENTS SECTION */}
        <div className="space-y-12 mb-20">
          {(statusTab === "all" || statusTab === "completed") && (
            <>
              {/* EVENT 1 — ICT CODEJAM */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="p-8 md:p-10 rounded-[2rem] bg-theme-bg-secondary border border-theme-border relative overflow-hidden group hover:border-gfg-primary/30 transition-all duration-300 shadow-sm"
              >
                <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-gfg-primary/40 via-gfg-primary/10 to-transparent" />
                <div className="absolute top-0 right-0 w-96 h-96 bg-gfg-primary/2 blur-3xl rounded-full pointer-events-none" />

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start relative z-10">
                  <div className="lg:col-span-12 xl:col-span-5 space-y-6 text-left">
                    <div className="flex flex-wrap items-center gap-3">
                      <span className="px-3 py-1 bg-gfg-primary/10 text-gfg-primary border border-gfg-primary/20 text-[8.5px] font-mono tracking-widest font-black rounded-full uppercase">
                        FLAGSHIP CODING EVENT
                      </span>
                      <span className="px-3 py-1 bg-theme-bg text-theme-text-secondary border border-theme-border text-[8.5px] font-mono tracking-widest font-semibold rounded-full uppercase shadow-sm">
                        COMPETITIVE PROGRAMMING
                      </span>
                    </div>

                    <h3 className="text-3xl md:text-4xl font-black text-theme-text uppercase tracking-tight italic group-hover:text-gfg-primary transition-colors">
                      ICT CodeJam
                    </h3>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 py-4 border-y border-theme-border font-mono text-[11px]">
                      <div className="flex items-center space-x-2.5">
                        <Calendar className="w-4 h-4 text-gfg-primary" />
                        <div>
                          <span className="text-theme-text-muted block text-[8px] uppercase">EVENT DATE</span>
                          <strong className="text-theme-text font-black">28 March 2026</strong>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2.5">
                        <Users className="w-4 h-4 text-cyan-500" />
                        <div>
                          <span className="text-theme-text-muted block text-[8px] uppercase">ORGANIZED BY</span>
                          <span className="text-theme-text font-bold">GFG On Campus MU</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center space-x-2 text-xs font-mono text-gfg-primary font-black uppercase">
                      <CheckCircle2 className="w-4 h-4 text-gfg-primary" />
                      <span>Successfully Completed Badge</span>
                    </div>

                    <p className="text-theme-text-secondary text-sm leading-relaxed font-sans font-semibold">
                      ICT CodeJam was a flagship coding competition organized by GFG On Campus Marwadi University to strengthen programming, problem-solving, and algorithmic thinking skills among students through semester-wise coding contests.
                    </p>

                    <div className="p-6 rounded-2xl bg-theme-bg border border-theme-border space-y-3 font-mono text-[11px] text-left shadow-sm">
                      <span className="text-[9px] text-gfg-primary uppercase tracking-[0.2em] font-black block border-b border-theme-border pb-2">EVENT METRICS MATRIX</span>
                      <div className="flex justify-between text-theme-text-muted font-semibold">
                        <span>Participants Enrolled:</span>
                        <span className="text-gfg-primary font-bold"><AnimatedCounter target={250} />+ Participants</span>
                      </div>
                      <div className="flex justify-between text-theme-text-muted font-semibold">
                        <span>Semester Tracks:</span>
                        <span className="text-theme-text font-bold">3 Semester Tracks</span>
                      </div>
                      <div className="flex justify-between text-theme-text-muted font-semibold">
                        <span>Challenge Category:</span>
                        <span className="text-theme-text font-bold">Competitive Challenges</span>
                      </div>
                      <div className="flex justify-between text-theme-text-muted font-semibold">
                        <span>Participation Scope:</span>
                        <span className="text-cyan-500 font-bold">Campus-Wide</span>
                      </div>
                    </div>
                  </div>

                  <div className="lg:col-span-12 xl:col-span-7 space-y-6 text-left">
                    <span className="text-[10px] font-mono tracking-widest text-gfg-primary uppercase block font-black mb-1">
                      [ VERIFIED COMPETITION SEMESTER TRACKS TIMELINE ]
                    </span>

                    <div className="relative pl-6 border-l border-theme-border space-y-8 py-2">
                      <div className="relative">
                        <span className="absolute -left-[31px] top-1.5 w-4 h-4 bg-theme-bg border-[3px] border-gfg-primary rounded-full shadow-sm" />
                        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                          <div className="space-y-1">
                            <div className="flex items-center gap-2 flex-wrap">
                              <strong className="text-gfg-primary font-mono text-xs block uppercase">Semester 2 Track</strong>
                              <span className="px-2 py-0.5 bg-gfg-primary/10 border border-gfg-primary/20 rounded text-[9px] font-mono text-gfg-primary font-bold">28 March 2026</span>
                            </div>
                            <p className="text-xs text-theme-text-secondary font-sans leading-relaxed font-semibold">
                              Focused on coding fundamentals, logical reasoning, and beginner-level problem-solving.
                            </p>
                          </div>
                          <a 
                            href="https://practice.geeksforgeeks.org/contest/ict-codejam-semester-2-round-1"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="px-4 py-2 bg-theme-bg border border-theme-border text-theme-text font-mono text-[9px] font-black uppercase tracking-widest rounded-xl hover:bg-gfg-primary hover:text-black hover:border-transparent transition-all duration-300 flex items-center gap-1.5 shrink-0 self-stretch md:self-auto text-center justify-center pointer-events-auto shadow-sm"
                          >
                            VIEW ARCHIVE <ArrowUpRight className="w-3.5 h-3.5" />
                          </a>
                        </div>
                      </div>

                      <div className="relative">
                        <span className="absolute -left-[31px] top-1.5 w-4 h-4 bg-theme-bg border-[3px] border-cyan-500 rounded-full shadow-sm" />
                        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                          <div className="space-y-1">
                            <div className="flex items-center gap-2 flex-wrap">
                              <strong className="text-cyan-500 font-mono text-xs block uppercase">Semester 4 Track</strong>
                              <span className="px-2 py-0.5 bg-cyan-500/10 border border-cyan-500/20 rounded text-[9px] font-mono text-cyan-500">28 March 2026</span>
                            </div>
                            <p className="text-xs text-theme-text-secondary font-sans leading-relaxed font-semibold">
                              Intermediate-level coding contest emphasizing Data Structures and Algorithms.
                            </p>
                          </div>
                          <a 
                            href="https://practice.geeksforgeeks.org/contest/ict-codejam-semester-4-round-1-4819"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="px-4 py-2 bg-theme-bg border border-theme-border text-theme-text font-mono text-[9px] font-black uppercase tracking-widest rounded-xl hover:bg-gfg-primary hover:text-black hover:border-transparent transition-all duration-300 flex items-center gap-1.5 shrink-0 self-stretch md:self-auto text-center justify-center pointer-events-auto shadow-sm"
                          >
                            VIEW ARCHIVE <ArrowUpRight className="w-3.5 h-3.5" />
                          </a>
                        </div>
                      </div>

                      <div className="relative">
                        <span className="absolute -left-[31px] top-1.5 w-4 h-4 bg-theme-bg border-[3px] border-purple-500 rounded-full shadow-sm" />
                        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                          <div className="space-y-1">
                            <div className="flex items-center gap-2 flex-wrap">
                              <strong className="text-purple-500 font-mono text-xs block uppercase">Semester 6 Track</strong>
                              <span className="px-2 py-0.5 bg-purple-500/10 border border-purple-500/20 rounded text-[9px] font-mono text-purple-500">28 March 2026</span>
                            </div>
                            <p className="text-xs text-theme-text-secondary font-sans leading-relaxed font-semibold">
                              Advanced programming challenge focused on optimization techniques and complex problem solving.
                            </p>
                          </div>
                          <a 
                            href="https://practice.geeksforgeeks.org/contest/ict-codejam-semester-6-round-1"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="px-4 py-2 bg-theme-bg border border-theme-border text-theme-text font-mono text-[9px] font-black uppercase tracking-widest rounded-xl hover:bg-gfg-primary hover:text-black hover:border-transparent transition-all duration-300 flex items-center gap-1.5 shrink-0 self-stretch md:self-auto text-center justify-center pointer-events-auto shadow-sm"
                          >
                            VIEW ARCHIVE <ArrowUpRight className="w-3.5 h-3.5" />
                          </a>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* EVENT 2 — TECH TRIVIA CLASH X GFG */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                id="featured-past-timeline-container"
                className="p-8 md:p-10 rounded-[2rem] bg-theme-bg-secondary border border-theme-border relative overflow-hidden group hover:border-gfg-primary/30 transition-all duration-300 shadow-sm"
              >
                <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-emerald-500 via-gfg-primary to-transparent" />
                <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-gfg-primary/3 blur-[120px] rounded-full pointer-events-none" />

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start relative z-10">
                  <div className="lg:col-span-12 xl:col-span-5 space-y-6 text-left">
                    <div className="flex flex-wrap items-center gap-2.5">
                      <span className="px-3.5 py-1 bg-gfg-primary/15 text-gfg-primary border border-gfg-primary/25 text-[8.5px] font-mono tracking-widest font-black rounded-full uppercase">
                        MULTI-STAGE TECH CHALLENGE
                      </span>
                      <span className="px-3 py-1 bg-theme-bg text-theme-text-secondary border border-theme-border text-[8.5px] font-mono tracking-widest font-semibold rounded-full uppercase shadow-sm">
                        Technical Quiz & Innovation
                      </span>
                    </div>

                    <h3 className="text-3xl md:text-4xl font-black text-theme-text uppercase tracking-tight italic group-hover:text-gfg-primary transition-colors leading-[1.1]">
                      Tech Trivia Clash <br className="hidden md:inline" />
                      <span className="text-gfg-primary">X GFG MU</span>
                    </h3>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 py-4 border-y border-theme-border font-mono text-[11px]">
                      <div className="flex items-center space-x-3">
                        <div className="p-2.5 bg-theme-bg border border-theme-border rounded-xl shadow-sm">
                          <Calendar className="w-4 h-4 text-gfg-primary" />
                        </div>
                        <div>
                          <span className="text-theme-text-muted block text-[8px] uppercase tracking-wide">EVENT DATES</span>
                          <strong className="text-theme-text font-black text-[12px]">21 May – 15 June 2026</strong>
                        </div>
                      </div>
                      <div className="flex items-center space-x-3">
                        <div className="p-2.5 bg-theme-bg border border-theme-border rounded-xl shadow-sm">
                          <Clock className="w-4 h-4 text-gfg-primary" />
                        </div>
                        <div>
                          <span className="text-theme-text-muted block text-[8px] uppercase tracking-wide">DELIVERY MODE</span>
                          <strong className="text-theme-text font-black text-[12px] uppercase">Online Platform</strong>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center space-x-2 text-xs font-mono text-gfg-primary font-bold uppercase tracking-wider">
                      <CheckCircle2 className="w-4 h-4 text-gfg-primary animate-pulse" />
                      <span>Successfully Conducted Badge</span>
                    </div>

                    <p className="text-theme-text-secondary text-sm leading-relaxed font-sans font-semibold">
                      Tech Trivia Clash X GFG On Campus MU was a multi-stage technical competition designed to evaluate participants in programming, aptitude, logical reasoning, computer science fundamentals, innovation, presentation skills, and problem-solving abilities.
                    </p>

                    <div className="space-y-3 pt-2">
                      <a 
                        href="https://unstop.com/p/tech-trivia-clash-ultimate-quiz-battle-marwadi-university-mu-gujarat-1681437"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-full px-6 py-3 bg-gfg-primary text-black font-black uppercase text-[10px] tracking-widest rounded-xl hover:bg-theme-text hover:text-theme-bg transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer shadow-sm"
                      >
                        VIEW EVENT ON UNSTOP <ExternalLink className="w-4 h-4" />
                      </a>

                      <a 
                        href="https://docs.google.com/presentation/d/1xe_TL6V5OkvPmwcCVy5mGSCh1zjq7lQL/edit?usp=sharing&ouid=117999268989234840183&rtpof=true&sd=true"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-full px-6 py-3 bg-theme-bg border border-theme-border text-theme-text font-black uppercase text-[10px] tracking-widest rounded-xl hover:bg-theme-text hover:text-theme-bg transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer shadow-sm"
                      >
                        PPT TEMPLATE <FileText className="w-4 h-4" />
                      </a>
                    </div>
                  </div>

                  <div className="lg:col-span-12 xl:col-span-7 space-y-6 text-left">
                    <span className="text-[10px] font-mono tracking-widest text-gfg-primary uppercase block font-black mb-1">
                      [ CONTEST ELIMINATION FLOW TIMELINE ]
                    </span>

                    <div className="relative pl-6 md:pl-8 border-l-2 border-theme-border space-y-6 py-2">
                      <div className="absolute top-0 left-[-1.5px] w-[2px] h-[95%] bg-gradient-to-b from-gfg-primary via-emerald-500 to-gfg-primary/10 pointer-events-none" />

                      <div className="relative group/timeline">
                        <span className="absolute -left-[30.5px] md:-left-[34px] top-1 w-3.5 h-3.5 bg-theme-bg border-[3px] border-gfg-primary rounded-full shadow-sm z-10" />
                        <div className="p-5 md:p-6 bg-theme-bg border border-theme-border rounded-[2rem] space-y-4 hover:border-gfg-primary/30 transition-all duration-300">
                          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-theme-border pb-3">
                            <div className="space-y-0.5">
                              <span className="text-[9px] font-mono text-gfg-primary uppercase tracking-widest font-black block">ROUND 1</span>
                              <h4 className="text-sm md:text-base font-black text-theme-text uppercase font-sans tracking-tight">Quiz Round</h4>
                            </div>
                            <div className="flex flex-col items-end shrink-0">
                              <span className="px-2.5 py-1 bg-gfg-primary/10 border border-gfg-primary/20 rounded text-[9px] font-mono text-gfg-primary font-bold">
                                21 May – 23 May 2026
                              </span>
                              <span className="text-[8px] font-mono text-gfg-primary mt-1 uppercase font-semibold">Online Quiz • Completed</span>
                            </div>
                          </div>

                          <div className="space-y-4 font-mono text-[11px] text-theme-text-secondary">
                            <div>
                              <span className="text-[9px] text-theme-text-muted block mb-1 font-semibold uppercase">TOPICS COVERED:</span>
                              <div className="flex flex-wrap gap-1.5">
                                {["Programming Fundamentals", "Data Structures Basics", "Aptitude", "Logical Reasoning", "Core CS Concepts"].map(tag => (
                                  <span key={tag} className="px-2 py-0.5 bg-theme-bg-secondary border border-theme-border rounded-lg text-theme-text-secondary">{tag}</span>
                                ))}
                              </div>
                            </div>

                            <div className="grid grid-cols-2 gap-y-2.5 gap-x-4 pt-1 text-[10px] sm:grid-cols-4">
                              <div>
                                <span className="text-theme-text-muted block text-[8px] uppercase">R_FORMAT</span>
                                <strong className="text-theme-text">20 MCQs</strong>
                              </div>
                              <div>
                                <span className="text-theme-text-muted block text-[8px] uppercase">R_EVALUATION</span>
                                <strong className="text-theme-text">Time-Based</strong>
                              </div>
                              <div>
                                <span className="text-theme-text-muted block text-[8px] uppercase">R_RANKING</span>
                                <strong className="text-theme-text">Accuracy-Based</strong>
                              </div>
                              <div>
                                <span className="text-theme-text-muted block text-[8px] uppercase">R_PARTICIPANTS</span>
                                <strong className="text-theme-text">Individual</strong>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="relative group/timeline">
                        <span className="absolute -left-[30.5px] md:-left-[34px] top-1 w-3.5 h-3.5 bg-theme-bg border-[3px] border-gfg-primary rounded-full shadow-sm z-10" />
                        <div className="p-5 md:p-6 bg-theme-bg border border-theme-border rounded-[2rem] space-y-4 hover:border-gfg-primary/30 transition-all duration-300">
                          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-theme-border pb-3">
                            <div className="space-y-0.5">
                              <span className="text-[9px] font-mono text-gfg-primary uppercase tracking-widest font-black block">ROUND 2</span>
                              <h4 className="text-sm md:text-base font-black text-theme-text uppercase font-sans tracking-tight">PPT Submission Round</h4>
                            </div>
                            <div className="flex flex-col items-end shrink-0">
                              <span className="px-2.5 py-1 bg-gfg-primary/10 border border-gfg-primary/20 rounded text-[9px] font-mono text-gfg-primary font-bold">
                                25 May – 05 June 2026
                              </span>
                              <span className="text-[8px] font-mono text-gfg-primary mt-1 uppercase font-semibold text-right">Presentation • Completed</span>
                            </div>
                          </div>

                          <div className="space-y-4 text-xs">
                            <p className="text-theme-text-secondary leading-relaxed font-semibold">
                              Participants submitted a PowerPoint presentation detailing approach models for problem statements. Only shortlisted participants from Round 1 qualified.
                            </p>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 font-mono text-[10px] pt-1">
                              <div className="p-3 bg-theme-bg-secondary rounded-xl border border-theme-border">
                                <span className="text-theme-text-muted block mb-1 uppercase text-[8px] tracking-wide">SUBMISSION MODEL</span>
                                <ul className="space-y-1 text-[9px] text-theme-text-secondary font-semibold">
                                  <li>• Submit via Unstop Portal</li>
                                  <li>• Official slide deck rules</li>
                                  <li>• Full original integrity</li>
                                </ul>
                              </div>
                              <div className="p-3 bg-theme-bg-secondary rounded-xl border border-theme-border">
                                <span className="text-theme-text-muted block mb-1 uppercase text-[8px] tracking-wide">EVALUATING METRICS</span>
                                <ul className="space-y-1 text-[9px] text-gfg-primary font-semibold">
                                  <li>• Problem identification clarity</li>
                                  <li>• Creativity & logic</li>
                                  <li>• Feasibility of execution</li>
                                </ul>
                              </div>
                            </div>

                            <div className="flex items-center justify-between p-3 bg-theme-bg-secondary border border-theme-border rounded-xl">
                              <span className="font-mono text-[9px] text-theme-text-muted">Slide Deck Templates:</span>
                              <a 
                                href="https://docs.google.com/presentation/d/1xe_TL6V5OkvPmwcCVy5mGSCh1zjq7lQL/edit?usp=sharing&ouid=117999268989234840183&rtpof=true&sd=true"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="px-3 py-1.5 bg-gfg-primary/10 border border-gfg-primary/20 rounded-lg text-gfg-primary font-mono text-[9px] uppercase tracking-wider font-extrabold flex items-center gap-1 hover:bg-gfg-primary hover:text-black transition-all shadow-sm"
                              >
                                Slide template <Presentation className="w-3 h-3" />
                              </a>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* STATS PANEL */}
                    <div className="mt-6 p-5 bg-theme-bg border border-theme-border rounded-2xl space-y-4 shadow-sm">
                      <div className="flex items-center gap-2 border-b border-theme-border pb-3">
                        <Terminal className="w-4 h-4 text-gfg-primary" />
                        <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-theme-text">EVENT SUMMARY EXECUTIONS SYSTEM</span>
                      </div>
                      
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 font-mono text-[11px]">
                        <div className="p-3 bg-theme-bg-secondary border border-theme-border rounded-xl text-left">
                          <span className="text-theme-text-muted block text-[8px] uppercase mb-0.5">REGISTERED</span>
                          <span className="text-gfg-primary text-base font-black tracking-tight">
                            <AnimatedCounter target={164} />
                          </span>
                          <span className="text-theme-text-secondary text-[9px] block">Students</span>
                        </div>
                        <div className="p-3 bg-theme-bg-secondary border border-theme-border rounded-xl text-left">
                          <span className="text-theme-text-muted block text-[8px] uppercase mb-0.5">COMPETITION</span>
                          <strong className="text-theme-text text-base font-black tracking-tight">3</strong>
                          <span className="text-theme-text-secondary text-[9px] block">Rounds Conducted</span>
                        </div>
                        <div className="p-3 bg-theme-bg-secondary border border-theme-border rounded-xl text-left">
                          <span className="text-theme-text-muted block text-[8px] uppercase mb-0.5">QUIZ DETAILS</span>
                          <strong className="text-theme-text text-base font-black tracking-tight">20+</strong>
                          <span className="text-theme-text-secondary text-[9px] block">Aptitude MCQs</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            </>
          )}

          {(statusTab === "all" || statusTab === "live") && (
            <>
              {showFeaturedLive && <LiveEventCard />}

              {loading ? (
                <div className="flex flex-col items-center justify-center py-20">
                  <Loader2 className="w-10 h-10 text-gfg-primary animate-spin mb-4" />
                  <p className="text-theme-text-muted font-bold uppercase tracking-widest text-xs">Syncing Live Database...</p>
                </div>
              ) : (
                <>
                  {events.filter(e => e.status === "live").map((event, i) => (
                    <LiveEventCard key={event.eventId || event.id || i} event={event} />
                  ))}

                  {statusTab === "live" && events.filter(e => e.status === "live").length === 0 && !showFeaturedLive && (
                    <div className="text-center py-16 bg-theme-bg-secondary rounded-[2rem] border border-dashed border-theme-border">
                      <ImageIcon className="w-10 h-10 text-theme-text-muted mx-auto mb-4 animate-pulse" />
                      <h4 className="text-lg font-bold mb-1 text-theme-text uppercase tracking-tight">No Active Live Events</h4>
                      <p className="text-theme-text-muted text-sm max-w-md mx-auto italic leading-relaxed">
                        Stay connected! No database sessions are currently live right now. Active events list synchronizes in the background automatically.
                      </p>
                    </div>
                  )}
                </>
              )}
            </>
          )}
        </div>
      </div>
    </motion.div>
  );
}
