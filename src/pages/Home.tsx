import { motion, useScroll, useTransform } from "motion/react";
import { ArrowRight, Calendar, Users, ArrowUpRight, Code, Sparkles, Flame, Zap, Atom, LogIn, ChevronRight, Terminal, BookOpen, Layers, Brain } from "lucide-react";
import { Link } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import { cn } from "../lib/utils";
import { useTheme } from "@/src/contexts/ThemeContext";
import { subscribeToEvents } from "../utils/eventHelpers";
import FeaturedCourses from "../components/FeaturedCourses";
import Hero from "../components/Hero";

export default function Home() {
  const { theme } = useTheme();
  const [allEvents, setAllEvents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [particles, setParticles] = useState<any[]>([]);

  useEffect(() => {
    const generated = Array.from({ length: 30 }).map((_, i) => ({
      id: i,
      left: `${Math.random() * 100}%`,
      top: `${Math.random() * 105}%`,
      size: Math.random() * 3 + 1.5,
      duration: Math.random() * 10 + 6,
      delay: Math.random() * 5,
    }));
    setParticles(generated);
  }, []);

  const aboutRef = useRef<HTMLElement>(null);
  const { scrollYProgress: aboutScroll } = useScroll({
    target: aboutRef,
    offset: ["start end", "end start"]
  });

  const aboutBgY = useTransform(aboutScroll, [0, 1], ["0%", "15%"]);
  const aboutBgScale = useTransform(aboutScroll, [0, 1], [1.1, 1]);

  useEffect(() => {
    const unsub = subscribeToEvents((list) => {
      const visible = list.filter((e) => e.visibility !== false && e.approvedBySuperAdmin !== false);
      setAllEvents(visible);
      setLoading(false);
    });
    return () => unsub();
  }, []);

  return (
    <div className="bg-theme-bg text-theme-text overflow-hidden min-h-screen theme-transition">
      {/* Hero Section */}
      <Hero />

      {/* Featured GeeksforGeeks Courses Segment */}
      <FeaturedCourses />

      {/* About Marwadi University Section */}
      <section ref={aboutRef} className="relative py-24 sm:py-32 flex flex-col items-center justify-center overflow-hidden bg-theme-bg border-b border-theme-border">
        <div className="max-w-7xl mx-auto px-6 relative z-10 w-full">
          <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-20">
            
            {/* Left Side: Campus Image */}
            <motion.div 
              initial={{ opacity: 0, x: -60 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
              className="w-full lg:w-[50%] relative group"
            >
              <div className="relative aspect-[16/10] rounded-[32px] overflow-hidden border border-theme-border shadow-md">
                <motion.div 
                  style={{ scale: aboutBgScale, y: aboutBgY }}
                  className="absolute inset-0 z-0"
                >
                  <img 
                    src="https://img-cdn.publive.online/fit-in/1280x960/filters:format(webp)/smstreet/media/media_files/2025/11/19/marwadi-university-2025-11-19-15-33-18.jpg" 
                    alt="Marwadi University Campus" 
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-theme-bg/10 backdrop-blur-[1px]" />
                </motion.div>
                <div className="absolute inset-0 bg-gradient-to-tr from-cyan-500/10 via-transparent to-gfg-primary/10" />
              </div>

              {/* Accreditations badge */}
              <motion.div
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
                className="absolute -bottom-4 -left-4 bg-theme-card border border-theme-border p-5 rounded-2xl shadow-md hidden md:block"
              >
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 rounded-xl bg-gfg-primary/10 flex items-center justify-center">
                    <Sparkles className="text-gfg-primary w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-theme-text font-black text-lg leading-tight">NAAC A+</div>
                    <div className="text-theme-text-muted text-[8px] font-black uppercase tracking-widest leading-tight">Accreditation</div>
                  </div>
                </div>
              </motion.div>
            </motion.div>

            {/* Right Side: Description */}
            <motion.div 
              initial={{ opacity: 0, x: 60 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 1, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
              className="w-full lg:w-[50%] space-y-8 text-left"
            >
              <div className="space-y-4">
                <div className="inline-flex items-center space-x-2 px-4 py-1.5 bg-theme-bg-secondary border border-theme-border rounded-full shadow-sm">
                  <span className="w-1.5 h-1.5 rounded-full bg-gfg-primary shadow-[0_0_10px_var(--gfg-primary)] animate-pulse" />
                  <span className="text-[9px] font-black uppercase tracking-[0.3em] text-gfg-primary">Marwadi University Hub</span>
                </div>

                <h2 className="text-theme-text font-black leading-[1.05] tracking-tighter uppercase italic text-4xl sm:text-5xl md:text-6xl">
                  ABOUT <span className="text-gfg-primary">MARWADI</span> UNIVERSITY
                </h2>
              </div>

              <p className="text-theme-text-secondary text-base font-medium leading-relaxed border-l-4 border-gfg-primary pl-6">
                Marwadi University is a NAAC A+ accredited institution committed to innovation, research, entrepreneurship, and future-ready education. Our collaboration fosters highly-trained software developers and problem solvers across semesters.
              </p>

              <div className="flex flex-wrap gap-4 pt-2">
                <a 
                  href="https://www.marwadiuniversity.ac.in/campus/" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="group/btn px-8 py-4 bg-gfg-primary text-black font-black uppercase text-[10px] tracking-[0.25em] rounded-xl hover:bg-theme-text hover:text-theme-bg transition-all duration-300 shadow-sm flex items-center"
                >
                  EXPLORE <ArrowRight className="ml-2 w-4 h-4 transition-transform group-hover/btn:translate-x-1.5" />
                </a>
                <a 
                  href="https://www.marwadiuniversity.ac.in/programs/" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="px-8 py-4 bg-theme-bg-secondary border border-theme-border text-theme-text font-black uppercase text-[10px] tracking-[0.25em] rounded-xl hover:bg-theme-text hover:text-theme-bg transition-all duration-300 flex items-center shadow-sm"
                >
                  PROGRAMS <ArrowRight className="ml-2 w-4 h-4 transition-transform group-hover:translate-x-1" />
                </a>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* GeeksforGeeks Core Domain Offerings */}
      <section className="py-24 sm:py-32 bg-theme-bg border-b border-theme-border relative">
        <div className="max-w-7xl mx-auto px-6 relative z-10 w-full">
          <div className="text-center mb-16">
            <span className="text-gfg-primary text-[10px] font-black uppercase tracking-[0.3em] mb-3 block">SKILLSETS MATTERS</span>
            <h2 className="text-4xl md:text-5xl font-extrabold text-theme-text uppercase italic tracking-tighter">
              DOMAINS & <span className="text-gfg-primary">OFFERINGS</span>
            </h2>
            <div className="h-1.5 w-24 bg-gfg-primary mx-auto mt-4 rounded-full" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto items-stretch">
            {[
              {
                title: "Software Engineering",
                desc: "Dive deep into modern design principles, object orientation, systems architectures, and high-performance algorithms built cleanly.",
                icon: Layers,
                color: "text-blue-500",
                bg: "bg-blue-500/10",
                url: "https://www.geeksforgeeks.org/software-engineering/software-engineering/"
              },
              {
                title: "Web Development",
                desc: "Master modern frameworks like React, Next.js, and Node. Let's engineer scalable databases, seamless real-time web applications, and immersive user experiences.",
                icon: Code,
                color: "text-cyan-500",
                bg: "bg-cyan-500/10",
                url: "https://www.geeksforgeeks.org/web-tech/web-technology/"
              },
              {
                title: "Competitive Programming",
                desc: "Sharpen algorithmic logic and data structural mastery. Participate in regular speedcoding contests, logical challenges, and GeeksforGeeks-powered CodeJams.",
                icon: Terminal,
                color: "text-emerald-500",
                bg: "bg-emerald-500/10",
                url: "https://www.geeksforgeeks.org/dsa/competitive-programming-a-complete-guide/"
              },
              {
                title: "AI, ML & DATA SCIENCE",
                desc: "Learn Artificial Intelligence, Machine Learning, Deep Learning, Data Science, Neural Networks, Computer Vision, NLP, and modern AI technologies used in industry. Build intelligent systems and gain practical knowledge through structured learning paths and real-world applications.",
                icon: Brain,
                color: "text-purple-500",
                bg: "bg-purple-500/10",
                url: "https://www.geeksforgeeks.org/machine-learning/ai-ml-and-data-science-tutorial-learn-ai-ml-and-data-science/"
              }
            ].map((domain, idx) => (
              <motion.a
                href={domain.url}
                target="_blank"
                rel="noopener noreferrer"
                key={domain.title}
                aria-label={`Explore domain: ${domain.title}`}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
                className="group relative p-8 rounded-[20px] bg-theme-bg-secondary border border-theme-border hover:border-[#2F8D46] hover:bg-white/5 dark:hover:bg-[#2F8D46]/5 hover:backdrop-blur-sm hover:shadow-[0_15px_30px_rgba(47,141,70,0.15)] hover:-translate-y-[10px] transition-all duration-400 ease-in-out cursor-pointer flex flex-col justify-between h-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2F8D46] focus-visible:ring-offset-2 select-none overflow-hidden"
              >
                {/* Top Green Progress Line */}
                <div className="absolute top-0 left-0 h-[3px] bg-[#2F8D46] w-0 group-hover:w-full transition-all duration-400 ease-in-out origin-left rounded-t-[20px]" />

                <div>
                  <div className={cn("w-12 h-12 rounded-xl flex items-center justify-center mb-6 transition-all duration-400 group-hover:scale-110 group-hover:rotate-6", domain.bg)}>
                    <domain.icon className={cn("w-6 h-6 transition-transform duration-400", domain.color)} />
                  </div>
                  <h3 className="text-xl font-bold text-theme-text mb-4 uppercase tracking-tight group-hover:text-[#2F8D46] transition-colors duration-400">{domain.title}</h3>
                  <p className="text-theme-text-secondary text-sm leading-relaxed font-semibold">
                    {domain.desc}
                  </p>
                </div>

                <div className="mt-8 flex items-center text-xs font-bold uppercase tracking-widest text-theme-text-muted group-hover:text-[#2F8D46] transition-colors duration-400 gap-2">
                  <span>Explore Domain</span>
                  <ArrowRight className="w-4 h-4 transition-transform duration-400 group-hover:translate-x-1.5 text-theme-text-muted group-hover:text-[#2F8D46]" />
                </div>
              </motion.a>
            ))}
          </div>
        </div>
      </section>

      {/* ICT CODEJAM SECTION - REDESIGNED */}
      <section className="py-24 sm:py-32 bg-theme-bg relative overflow-hidden border-b border-theme-border">
        {/* Subtle dynamic background overlays */}
        <div className="absolute inset-0 z-0 pointer-events-none opacity-40">
          <div className="absolute top-0 left-0 w-full h-full bg-[linear-gradient(rgba(0,255,136,0.01)_1px,transparent_1px)] bg-[size:100px_100px]" />
          <div className="absolute top-1/4 -left-20 w-[600px] h-[600px] bg-gfg-primary/5 rounded-full blur-[150px]" />
        </div>

        <div className="max-w-7xl mx-auto px-6 relative z-10 w-full">
          <div className="text-center mb-16">
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              className="inline-flex items-center space-x-2 px-4 py-1.5 bg-gfg-primary/10 border border-gfg-primary/20 rounded-full mb-4 shadow-sm"
            >
              <Zap className="w-3.5 h-3.5 text-gfg-primary animate-pulse" />
              <span className="text-[10px] font-black uppercase tracking-[0.3em] text-gfg-primary">Compete • Solve • Innovate</span>
            </motion.div>
            
            <h2 className="text-4xl md:text-6xl font-black text-theme-text italic tracking-tighter uppercase mb-6">
              ICT <span className="text-gfg-primary">CODEJAM</span>
            </h2>
            
            <p className="text-theme-text-secondary text-base font-medium max-w-2xl mx-auto leading-relaxed">
              A university-wide competitive programming initiative powered by GeeksforGeeks to help students sharpen problem-solving skills, improve coding efficiency, and compete with the best minds across semesters.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto items-stretch">
            {[
              {
                sem: "Semester 2",
                desc: "Kickstart your competitive coding journey. Built for first-year programmers ready to make their mark.",
                link: "https://practice.geeksforgeeks.org/contest/ict-codejam-semester-2-round-1",
                tags: ["Beginner Friendly", "Round 1"],
                hot: false
              },
              {
                sem: "Semester 4",
                desc: "Level up with advanced data structures and algorithms. Challenge yourself against the best in your batch.",
                link: "https://practice.geeksforgeeks.org/contest/ict-codejam-semester-4-round-1-4819",
                tags: ["Intermediate", "Round 1"],
                hot: true
              },
              {
                sem: "Semester 6",
                desc: "The elite arena. Solve complex challenges and compete for the top position among senior coders.",
                link: "https://practice.geeksforgeeks.org/contest/ict-codejam-semester-6-round-1",
                tags: ["Advanced", "Round 1"],
                hot: false
              }
            ].map((card, i) => (
              <motion.div
                key={card.sem}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, duration: 0.6 }}
                whileHover={{ y: -6 }}
                className="group relative flex flex-col h-full p-8 md:p-10 rounded-[2rem] bg-theme-bg-secondary border border-theme-border hover:border-gfg-primary/40 transition-all duration-300 shadow-sm hover:shadow-md overflow-hidden"
              >
                {/* Visual Top Highlight Accent */}
                <div className="absolute top-0 left-0 w-full h-[3px] bg-gradient-to-r from-transparent via-gfg-primary to-transparent opacity-40 group-hover:opacity-100 transition-opacity" />
                
                {/* Header Group with Title at the very top */}
                <div className="space-y-5 flex-grow flex flex-col">
                  <div className="flex justify-between items-start">
                    <div>
                      <span className="text-[10px] font-black text-gfg-primary uppercase tracking-[0.3em] mb-1.5 block">ICT CodeJam</span>
                      <h3 className="text-2xl md:text-3xl font-extrabold text-theme-text italic uppercase tracking-tighter group-hover:text-gfg-primary transition-colors leading-none">
                        {card.sem}
                      </h3>
                    </div>
                    {card.hot && (
                      <span className="px-2.5 py-1 bg-red-500/10 border border-red-500/20 rounded-full flex items-center space-x-1 shrink-0">
                        <Flame className="w-3 h-3 text-red-500 animate-pulse" />
                        <span className="text-[8px] font-black text-red-500 uppercase tracking-wider font-mono">HOT 🔥</span>
                      </span>
                    )}
                  </div>

                  {/* Tags */}
                  <div className="flex flex-wrap gap-1.5">
                    {card.tags.map(tag => (
                      <span 
                        key={tag} 
                        className="px-2.5 py-1 bg-gfg-primary/5 border border-gfg-primary/15 rounded-lg text-[9px] font-black text-gfg-primary uppercase tracking-wider"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>

                  {/* Description */}
                  <p className="text-theme-text-secondary text-sm leading-relaxed font-semibold">
                    {card.desc}
                  </p>
                </div>

                {/* Bottom CTA Element */}
                <div className="mt-8 pt-5 border-t border-theme-border space-y-3">
                  <a 
                    href={card.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="relative z-10 group/btn w-full h-12 px-5 bg-theme-bg border border-theme-border rounded-xl flex items-center justify-between hover:bg-gfg-primary hover:text-black hover:border-transparent transition-all duration-300"
                  >
                    <span className="text-[9px] font-black uppercase tracking-[0.2em] text-theme-text group-hover:text-black">Register Now</span>
                    <ArrowRight className="w-4 h-4 text-theme-text group-hover/btn:translate-x-1 group-hover:text-black" />
                  </a>

                  <p className="text-theme-text-muted text-[8px] font-mono font-bold uppercase tracking-wider text-center block">
                    Registration handled securely via GeeksforGeeks.
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* DYNAMIC FEATURED EVENT SPOTLIGHT (CMS-DRIVEN) */}
      {allEvents.filter(e => e.featured || e.is_featured).slice(0, 1).map((evt) => (
        <section key={evt.id} className="py-24 sm:py-32 bg-theme-bg relative overflow-hidden border-b border-theme-border">
          {/* Neon background grids */}
          <div className="absolute inset-0 bg-[#00ff88]/1 animate-pulse" />
          <div className="absolute top-1/2 left-1/4 w-[500px] h-[500px] bg-emerald-500/5 rounded-full blur-[140px] pointer-events-none" />

          <div className="max-w-7xl mx-auto px-6 relative z-10 w-full">
            <div className="text-center mb-16">
              <span className="inline-flex items-center space-x-2 px-3 py-1 bg-purple-500/10 border border-purple-500/20 rounded-full text-[9px] font-mono font-black uppercase tracking-widest text-[#9d4edd] mb-3">
                <Sparkles className="w-3.5 h-3.5 text-[#9d4edd] animate-pulse" />
                <span>DYNAMIC CMS FEATURED PROGRAM</span>
              </span>
              <h2 className="text-4xl md:text-5xl font-black italic uppercase tracking-tighter text-theme-text">
                SPOTLIGHT <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-[#00ff88] to-cyan-400">ACTIVATIONS</span>
              </h2>
            </div>

            <div className="relative max-w-5xl mx-auto bg-theme-bg-secondary/50 backdrop-blur-3xl border border-theme-border/80 hover:border-[#00ff88]/30 transition-all duration-300 rounded-[2.5rem] overflow-hidden shadow-2xl">
              <div className="absolute top-0 left-0 w-full h-[4px] bg-gradient-to-r from-purple-500 via-[#00ff88] to-transparent" />
              
              <div className="flex flex-col md:flex-row items-stretch">
                {/* Left Side: Thumbnail cover */}
                <div className="md:w-[40%] relative min-h-[220px] md:min-h-auto overflow-hidden bg-black">
                  <img 
                    src={evt.poster_url || evt.bannerImage} 
                    alt={evt.title} 
                    className="absolute inset-0 w-full h-full object-cover opacity-85 hover:scale-105 transition-transform duration-700"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t md:bg-gradient-to-r from-[#0c141d]/100 via-transparent to-transparent" />
                  
                  {/* Floating Date Tag */}
                  <div className="absolute top-6 left-6 z-10 px-4 py-2 bg-[#0c141d]/75 backdrop-blur-md rounded-xl border border-white/10 text-center font-mono">
                    <p className="text-[10px] font-black text-[#00ff88] uppercase tracking-widest">ACTIVATION</p>
                    <p className="text-[9px] text-zinc-400 font-bold">{evt.startDate || evt.date}</p>
                  </div>
                </div>

                {/* Right Side: Description Stats */}
                <div className="md:w-[60%] p-8 sm:p-10 flex flex-col justify-between relative z-10">
                  <div className="space-y-4">
                    <div className="flex items-center space-x-2 text-[10px] font-mono tracking-wider font-extrabold uppercase">
                      <span className="text-emerald-400">{evt.category || "Hackathon"}</span>
                      <span className="text-zinc-500">•</span>
                      <span className="text-[#00ff88]/80">{evt.location || "Marwadi University"}</span>
                    </div>

                    <h3 className="text-3xl font-black uppercase text-theme-text leading-tight">{evt.title}</h3>
                    <p className="text-theme-text-secondary text-xs sm:text-sm font-semibold leading-relaxed line-clamp-3">
                      {evt.description}
                    </p>

                    {/* Metadata boxes */}
                    <div className="grid grid-cols-3 gap-1.5 sm:gap-3 pt-3">
                      <div className="bg-slate-100 dark:bg-black/30 border border-slate-200/50 dark:border-white/5 p-2 sm:p-3 rounded-xl text-center">
                        <p className="text-[8px] font-mono font-black text-zinc-500 dark:text-zinc-400 uppercase">Prize Pool</p>
                        <p className="text-xs font-black text-theme-text">{evt.prize_pool || "₹3,40,000+"}</p>
                      </div>
                      <div className="bg-slate-100 dark:bg-black/30 border border-slate-200/50 dark:border-white/5 p-2 sm:p-3 rounded-xl text-center">
                        <p className="text-[8px] font-mono font-black text-zinc-500 dark:text-zinc-400 uppercase">Team size</p>
                        <p className="text-xs font-black text-theme-text">{evt.team_size || "2–4 Members"}</p>
                      </div>
                      <div className="bg-slate-100 dark:bg-black/30 border border-slate-200/50 dark:border-white/5 p-2 sm:p-3 rounded-xl text-center">
                        <p className="text-[8px] font-mono font-black text-zinc-500 dark:text-zinc-400 uppercase">Registration</p>
                        <p className="text-xs font-black text-gfg-primary dark:text-[#00ff88] uppercase">OPEN</p>
                      </div>
                    </div>
                  </div>

                  {/* Actions CTAs */}
                  <div className="flex flex-col sm:flex-row items-center gap-3 mt-8 pt-4 border-t border-theme-border/40">
                    <a
                      href={evt.registration_link || evt.registrationLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full sm:w-auto inline-flex items-center justify-center px-6 py-3.5 bg-[#00ff88] hover:bg-white text-black text-xs font-black uppercase tracking-widest rounded-xl transition-all"
                    >
                      {(evt.id === "evt_intellify" || evt.title?.toLowerCase().includes("intellify")) ? "Register on Unstop" : "Register Now"} 
                      <ArrowRight className="w-3.5 h-3.5 ml-2" />
                    </a>

                    {(evt.id === "evt_intellify" || evt.title?.toLowerCase().includes("intellify")) ? (
                      <a
                        href={evt.registration_link || evt.registrationLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-full sm:w-auto inline-flex items-center justify-center px-6 py-3.5 bg-white/5 hover:bg-white/10 border border-theme-border text-xs font-black uppercase tracking-widest text-theme-text rounded-xl transition-all"
                      >
                        View Event Details
                      </a>
                    ) : (
                      <Link
                        to="/events"
                        className="w-full sm:w-auto inline-flex items-center justify-center px-6 py-3.5 bg-white/5 hover:bg-white/10 border border-theme-border text-xs font-black uppercase tracking-widest text-theme-text rounded-xl transition-all"
                      >
                        Learn More details
                      </Link>
                    )}
                  </div>
                </div>

              </div>
            </div>
          </div>
        </section>
      ))}

      {/* Featured Courses Section */}
      <section className="py-24 sm:py-32 bg-theme-bg border-b border-theme-border relative">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col md:flex-row items-start md:items-end justify-between mb-16 gap-6">
            <div>
              <span className="text-gfg-primary text-[10px] font-black uppercase tracking-[0.3em] mb-2 block">Free Education</span>
              <h2 className="font-black tracking-tighter uppercase text-4xl md:text-5xl text-theme-text">Master <span className="text-gfg-primary">MongoDB</span></h2>
            </div>
            <Link 
              to="/courses"
              className="px-8 py-4 bg-theme-bg-secondary border border-theme-border text-theme-text font-black uppercase text-[10px] tracking-widest rounded-xl hover:bg-gfg-primary hover:text-black hover:border-transparent transition-all duration-300 shadow-sm"
            >
              All Courses
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                title: "MongoDB Overview",
                geeks: "18k+",
                link: "https://www.geeksforgeeks.org/courses/mongodb-overview",
                image: "https://media.geeksforgeeks.org/img-practice/prod/courses/1028/Web/Content/mongodb_overview_webp_1760440738.webp"
              },
              {
                title: "CRUD Operations",
                geeks: "5k+",
                link: "https://www.geeksforgeeks.org/courses/crud-operations-in-mongodb",
                image: "https://media.geeksforgeeks.org/img-practice/prod/courses/994/Web/Content/crud_operations_in_mongodb_1758600430.webp"
              },
              {
                title: "RAG with MongoDB",
                geeks: "5k+",
                link: "https://www.geeksforgeeks.org/courses/rag-with-mongodb",
                image: "https://media.geeksforgeeks.org/img-practice/prod/courses/997/Web/Content/rag_with_mongodb_1758600921.webp"
              },
              {
                title: "Schema Design",
                geeks: "5k+",
                link: "https://www.geeksforgeeks.org/courses/schema-design-patterns-and-antipatterns",
                image: "https://media.geeksforgeeks.org/img-practice/prod/courses/990/Web/Content/schema_design_patterns_webp_1758600211.webp"
              }
            ].map((course, i) => (
              <motion.div
                key={course.title}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="group bg-theme-bg-secondary border border-theme-border rounded-[2rem] overflow-hidden hover:border-gfg-primary/45 transition-all flex flex-col shadow-sm"
              >
                <div className="aspect-video relative overflow-hidden shrink-0 border-b border-theme-border">
                  <img src={course.image} alt={course.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" referrerPolicy="no-referrer" />
                </div>
                <div className="p-6 flex flex-col flex-grow bg-theme-bg-secondary">
                  <div className="flex items-center space-x-2 text-[9px] font-black uppercase tracking-widest text-[#00E676] mb-3">
                    <Users className="w-3.5 h-3.5" />
                    <span>{course.geeks} Geeks</span>
                  </div>
                  <h3 className="text-base font-black uppercase mb-6 tracking-tight text-theme-text group-hover:text-gfg-primary transition-colors">{course.title}</h3>
                  <a 
                    href={course.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-auto flex items-center text-[10px] font-black uppercase tracking-widest text-theme-text-muted hover:text-theme-text transition-colors"
                  >
                    Start Learning <ArrowUpRight className="ml-1.5 w-3.5 h-3.5" />
                  </a>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* JOIN THE COMMUNITY CTA SECTION */}
      <section id="join-section" className="py-24 sm:py-32 relative overflow-hidden bg-theme-bg border-b border-theme-border">
        {/* Subtle dynamic graphics for the call to action */}
        <div className="absolute inset-0 bg-gfg-primary/5 pointer-events-none" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-[radial-gradient(circle_at_center,var(--gfg-primary-neon)_0%,transparent_70%)] opacity-10 pointer-events-none" />
        
        <div className="max-w-5xl mx-auto px-6 relative z-10 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="flex flex-col items-center"
          >
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
              className="w-20 h-20 rounded-full border-2 border-dashed border-gfg-primary/30 flex items-center justify-center mb-8 shadow-sm"
            >
              <Atom className="w-10 h-10 text-gfg-primary animate-pulse" />
            </motion.div>

            <h2 className="font-black tracking-tighter uppercase mb-6 leading-[1.05] text-4xl sm:text-5xl md:text-6xl text-theme-text">
              JOIN THE FUTURE <br />
              <span className="text-gfg-primary">OF INNOVATION</span>
            </h2>

            <p className="text-theme-text-secondary text-base font-semibold max-w-xl mx-auto mb-10 leading-relaxed">
              Step into the leading student tech circle at Marwadi University. Build real-world projects, collaborate on revolutionary products, and gain exclusive access to premium seminars.
            </p>

            <a 
              href="https://chat.whatsapp.com/F7RcXCTLYJ4Ije5NiL6sDM"
              target="_blank"
              rel="noopener noreferrer"
              className="px-12 py-5 bg-gfg-primary-neon text-black font-black uppercase text-[11px] tracking-[0.2em] rounded-xl hover:scale-105 transition-all duration-300 shadow-md hover:bg-theme-text hover:text-theme-bg inline-flex items-center transform"
            >
              Join Our Community <ArrowRight className="ml-2 w-4.5 h-4.5" />
            </a>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
