import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Link } from "react-router-dom";
import JourneyTrack from "@/src/components/JourneyTrack";
import {
  BookOpen,
  Code2,
  Calendar,
  Users,
  Briefcase,
  Sparkles,
  ArrowRight,
  ChevronRight,
  Rocket,
  Award,
  Lightbulb,
  Heart,
  Target,
  Milestone,
  Hourglass,
  Zap,
  Terminal,
  HeartHandshake,
  Cpu,
  Compass,
  MessageSquare
} from "lucide-react";

// Hook/Helper for active counters
function AnimatedCounter({ value, duration = 1500 }: { value: string; duration?: number }) {
  const [count, setCount] = useState(0);
  const numericValue = parseInt(value.replace(/\D/g, ""), 10) || 0;
  const suffix = value.replace(/[\d]/g, "");

  useEffect(() => {
    let startTimestamp: number | null = null;
    const step = (timestamp: number) => {
      if (!startTimestamp) startTimestamp = timestamp;
      const progress = Math.min((timestamp - startTimestamp) / duration, 1);
      setCount(Math.floor(progress * numericValue));
      if (progress < 1) {
        window.requestAnimationFrame(step);
      }
    };
    window.requestAnimationFrame(step);
  }, [numericValue, duration]);

  return (
    <span>
      {count}
      {suffix}
    </span>
  );
}

export default function About() {
  const [hoveredValue, setHoveredValue] = useState<number | null>(null);

  const specialtyCards = [
    {
      title: "Learn Together",
      desc: "Join coding sessions, DSA practice groups, technical discussions, and peer-learning activities where students help each other grow.",
      icon: BookOpen,
      actionText: "Start Learning",
      link: "/courses",
      color: "border-emerald-500/10 text-emerald-500 hover:border-emerald-500/30"
    },
    {
      title: "Build Real Projects",
      desc: "Work with fellow members on innovative projects, open-source contributions, and hands-on development experiences.",
      icon: Code2,
      actionText: "Explore Projects",
      link: "/courses",
      color: "border-green-500/10 text-green-500 hover:border-green-500/30"
    },
    {
      title: "Participate in Events",
      desc: "Take part in hackathons, coding competitions, workshops, webinars, and technical festivals throughout the year.",
      icon: Calendar,
      actionText: "View Events",
      link: "/events",
      color: "border-teal-500/10 text-teal-400 hover:border-teal-400/30"
    },
    {
      title: "Meet Like-Minded People",
      desc: "Connect with passionate developers, creative thinkers, and aspiring engineers who share your interests.",
      icon: Users,
      actionText: "Join Community",
      external: "https://chat.whatsapp.com/F7RcXCTLYJ4Ije5NiL6sDM",
      color: "border-cyan-500/10 text-cyan-400 hover:border-cyan-400/30"
    },
    {
      title: "Grow Your Career",
      desc: "Access mentorship, interview preparation, resume guidance, internship opportunities, and industry-focused learning sessions.",
      icon: Briefcase,
      actionText: "Explore Opportunities",
      link: "/blogs",
      color: "border-blue-500/10 text-blue-400 hover:border-blue-400/30"
    },
    {
      title: "Become a Leader",
      desc: "Lead events, manage teams, organize initiatives, and develop leadership skills while making a meaningful impact on the student community.",
      icon: Sparkles,
      actionText: "Lead With Us",
      link: "/contact",
      color: "border-purple-500/10 text-purple-400 hover:border-purple-400/30"
    }
  ];

  const valuesList = [
    {
      title: "Learning",
      desc: "Continuous improvement through curiosity and knowledge sharing.",
      icon: Lightbulb,
      glow: "rgba(16, 185, 129, 0.15)"
    },
    {
      title: "Innovation",
      desc: "Building creative solutions to real-world challenges.",
      icon: Rocket,
      glow: "rgba(52, 211, 153, 0.15)"
    },
    {
      title: "Collaboration",
      desc: "Growing together through teamwork and community support.",
      icon: HeartHandshake,
      glow: "rgba(20, 184, 166, 0.15)"
    },
    {
      title: "Leadership",
      desc: "Empowering students to take initiative and inspire others.",
      icon: Target,
      glow: "rgba(59, 130, 246, 0.15)"
    },
    {
      title: "Excellence",
      desc: "Striving for the highest standards in everything we do.",
      icon: Award,
      glow: "rgba(139, 92, 246, 0.15)"
    }
  ];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="bg-theme-bg min-h-screen text-theme-text overflow-hidden relative theme-transition"
    >
      {/* Dynamic Cosmic Background Decor */}
      <div className="absolute inset-0 z-0 opacity-45 pointer-events-none">
        <div className="absolute top-0 left-0 w-full h-full bg-[linear-gradient(rgba(0,255,136,0.015)_1px,transparent_1px),linear-gradient(90deg,rgba(0,255,136,0.015)_1px,transparent_1px)] bg-[size:60px_60px]" />
        <div className="absolute top-1/4 -left-40 w-[700px] h-[700px] bg-emerald-500/5 rounded-full blur-[140px]" />
        <div className="absolute bottom-1/3 -right-40 w-[600px] h-[600px] bg-teal-500/5 rounded-full blur-[130px]" />
      </div>

      <div className="max-w-7xl mx-auto px-6 pt-36 pb-32 relative z-10">
        {/* HERO HEADER SECTION */}
        <div className="text-center max-w-4xl mx-auto mb-24">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center space-x-2.5 px-4 py-2 rounded-full border border-gfg-primary/20 bg-theme-bg-secondary text-gfg-primary text-[10px] font-mono tracking-[0.25em] uppercase font-black mb-6 shadow-sm"
          >
            <span className="w-2 h-2 rounded-full bg-gfg-primary shadow-[0_0_10px_#00ff88] animate-ping" />
            <span>GEEKSFORGEEKS STUDENT CHAPTER • MARWADI UNIVERSITY</span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="text-4xl sm:text-5xl md:text-7xl font-black text-theme-text leading-tight tracking-tight uppercase"
          >
            SHAPING THE NEXT GENERATION <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-gfg-primary via-emerald-400 to-teal-400">
              OF TECH LEADERS
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="text-theme-text-muted mt-8 text-base md:text-lg max-w-2xl mx-auto leading-relaxed border-t border-b border-theme-border/50 py-4.5 font-medium italic"
          >
            "More than a technical club — a community where students transform their passion for technology into skills, innovation, leadership, and lifelong connections."
          </motion.p>
        </div>

        {/* WHO WE ARE SECTION */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20 items-center mb-32">
          {/* Left Block: Creative Visual */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="lg:col-span-6 relative"
          >
            <div className="relative rounded-[2.5rem] overflow-hidden border border-theme-border bg-theme-bg-secondary p-4 shadow-xl">
              <div className="relative overflow-hidden rounded-[2rem] aspect-[4/3] group">
                <img
                  src="https://img-cdn.publive.online/fit-in/1280x960/filters:format(webp)/smstreet/media/media_files/2025/11/19/marwadi-university-2025-11-19-15-33-18.jpg"
                  alt="Marwadi University Tech Ecosystem"
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                <div className="absolute bottom-6 left-6 right-6">
                  <div className="px-3.5 py-1 bg-gfg-primary/15 border border-gfg-primary/30 backdrop-blur-md rounded-full text-[9px] font-mono tracking-widest text-gfg-primary uppercase inline-block mb-2 font-black">
                    Official Student Chapter
                  </div>
                  <h4 className="text-white text-lg font-black uppercase tracking-wide">Marwadi University Innovation Hub</h4>
                </div>
              </div>
            </div>

            {/* Glowing Tech Ornaments */}
            <div className="absolute -top-6 -right-6 w-24 h-24 bg-theme-bg border border-theme-border rounded-2xl flex items-center justify-center p-3 shadow-lg hidden md:flex">
              <div className="w-full h-full border border-gfg-primary/20 rounded-xl flex flex-col items-center justify-center bg-theme-bg-secondary">
                <Cpu className="w-6 h-6 text-gfg-primary animate-pulse" />
                <span className="text-[7px] font-mono font-bold tracking-widest text-theme-text-muted mt-1 uppercase">ESTD 2024</span>
              </div>
            </div>
          </motion.div>

          {/* Right Block: Pitch Description */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="lg:col-span-6 text-left"
          >
            <div className="space-y-6">
              <span className="text-gfg-primary text-xs font-mono font-black tracking-widest uppercase block">ABOUT THE CLUB</span>
              <h2 className="text-3xl md:text-5xl font-black text-theme-text uppercase tracking-tight italic">
                WHO <span className="text-gfg-primary">WE ARE</span>
              </h2>
              <div className="w-16 h-1 bg-gfg-primary rounded-full mb-4" />
              
              <p className="text-theme-text-secondary text-sm md:text-base leading-relaxed font-semibold">
                The GeeksforGeeks Student Chapter at Marwadi University is a student-led technical club dedicated to creating an engaging environment where students can explore technology beyond the classroom. Our chapter brings together passionate learners, developers, innovators, and future leaders who share a common goal: continuous growth through collaboration, practical learning, and real-world experiences.
              </p>
              
              <p className="text-theme-text-muted text-sm leading-relaxed font-medium">
                Whether you're taking your first steps into programming or building advanced systems with complex architectures, GFG MU provides a supportive community where every student can learn, contribute, code, and succeed. Our doors are wide open for creators who dare to dream big.
              </p>
            </div>
          </motion.div>
        </div>

        {/* SPECIAL FEATURES SECTION */}
        <div className="mb-32">
          <div className="text-center mb-16 max-w-2xl mx-auto">
            <span className="text-gfg-primary text-xs font-mono font-black tracking-widest uppercase mb-3 block">DYNAMIC VALUE</span>
            <h2 className="text-3xl md:text-5xl font-black text-theme-text uppercase tracking-tight">
              WHAT MAKES <br />
              <span className="text-gfg-primary">OUR CLUB SPECIAL</span>
            </h2>
            <p className="text-theme-text-muted font-sans text-xs tracking-wider uppercase mt-4">
              Explore the core avenues through which we grow, create, and lead together.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {specialtyCards.map((card, idx) => {
              const IconComp = card.icon;
              return (
                <motion.div
                  key={card.title}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: idx * 0.1 }}
                  whileHover={{ y: -6, scale: 1.01 }}
                  className={`p-8 md:p-10 rounded-[2.5rem] bg-theme-bg-secondary border border-theme-border/60 hover:border-gfg-primary/30 flex flex-col justify-between shadow-sm group hover:shadow-lg transition-all duration-300 text-left relative overflow-hidden`}
                >
                  {/* Subtle top indicator line */}
                  <div className="absolute top-0 left-0 right-0 h-[3px] bg-gradient-to-r from-transparent via-gfg-primary/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                  
                  <div>
                    {/* Circle Icon Container */}
                    <div className="w-14 h-14 mb-8 rounded-2xl bg-gfg-primary/5 border border-gfg-primary/10 text-gfg-primary flex items-center justify-center group-hover:bg-gfg-primary/10 group-hover:border-gfg-primary/30 transition-all duration-300 shadow-sm relative">
                      <IconComp className="w-6 h-6" />
                      <span className="absolute inset-0 rounded-2xl bg-gfg-primary/10 blur-md opacity-0 group-hover:opacity-100 transition-opacity" />
                    </div>

                    <h3 className="text-xl font-black text-theme-text mb-4 uppercase tracking-tight group-hover:text-gfg-primary transition-colors">
                      {card.title}
                    </h3>
                    <p className="text-theme-text-secondary font-semibold leading-relaxed text-xs md:text-sm mb-8">
                      {card.desc}
                    </p>
                  </div>

                  {card.external ? (
                    <a
                      href={card.external}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center text-gfg-primary text-xs font-mono font-black tracking-widest uppercase hover:brightness-110 transition-all bg-gfg-primary/5 hover:bg-gfg-primary/10 border border-gfg-primary/10 px-5 py-3 rounded-xl max-w-fit"
                    >
                      {card.actionText} <ArrowRight className="ml-2 w-4 h-4 transition-transform group-hover:translate-x-1" />
                    </a>
                  ) : (
                    <Link
                      to={card.link || "#"}
                      className="inline-flex items-center text-gfg-primary text-xs font-mono font-black tracking-widest uppercase hover:brightness-110 transition-all bg-gfg-primary/5 hover:bg-gfg-primary/10 border border-gfg-primary/10 px-5 py-3 rounded-xl max-w-fit"
                    >
                      {card.actionText} <ArrowRight className="ml-2 w-4 h-4 transition-transform group-hover:translate-x-1" />
                    </Link>
                  )}
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* CLUB JOURNEY SECTION */}
        <div className="mb-32">
          <div className="text-center mb-10 max-w-2xl mx-auto">
            <span className="text-gfg-primary text-xs font-mono font-black tracking-widest uppercase mb-3 block">ROADMAP MATRIX</span>
            <img src="/gfg-logo.svg" className="hidden" alt="hidden-trigger" />
            <h2 className="text-3xl md:text-5xl font-black text-theme-text uppercase tracking-tight mb-3">
              YOUR JOURNEY WITH <span className="text-gfg-primary">GFG MU</span>
            </h2>
            <p className="text-theme-text-muted text-xs uppercase font-mono tracking-widest">
              An epic 7-step formula where raw curiosity converts into high-impact leadership.
            </p>
          </div>

          <JourneyTrack />
        </div>

        {/* CLUB CULTURE SECTION */}
        <div className="mb-32">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20 items-center">
            {/* Left Block: Words Grid */}
            <div className="lg:col-span-6 relative text-left lg:order-2">
              <span className="text-gfg-primary text-xs font-mono font-black tracking-widest uppercase block mb-3">ATMOSPHERE MATRIX</span>
              <h2 className="text-3xl md:text-5xl font-black text-theme-text uppercase tracking-tight mb-8">
                LIFE AT <span className="text-gfg-primary">GFG MU</span>
              </h2>
              
              <p className="text-theme-text-secondary text-base leading-relaxed font-semibold mb-8">
                Our student chapter beats with creativity, active banter, late-night code sprints, and energetic project reviews. We break down standard academic structures and promote peer education, where everyone can be both a student and a teacher.
              </p>

              {/* Dynamic Interactive Word Selector Grid */}
              <div className="flex flex-wrap gap-3">
                {[
                  "Collaborative Learning",
                  "Friendly Coding Challenges",
                  "Team Projects",
                  "Technical Workshops",
                  "Innovation Sessions",
                  "Networking Events",
                  "Leadership Opportunities",
                  "Peer Mentorship"
                ].map((item, idx) => {
                  const colors = [
                    "hover:bg-emerald-500/10 hover:border-emerald-500/40 hover:text-emerald-400",
                    "hover:bg-green-500/10 hover:border-green-500/40 hover:text-green-400",
                    "hover:bg-teal-500/10 hover:border-teal-500/40 hover:text-teal-400",
                    "hover:bg-cyan-500/10 hover:border-cyan-500/40 hover:text-cyan-400"
                  ];
                  const pickColor = colors[idx % colors.length];
                  return (
                    <motion.div
                      key={item}
                      whileHover={{ scale: 1.05 }}
                      onHoverStart={() => setHoveredValue(idx)}
                      onHoverEnd={() => setHoveredValue(null)}
                      className={`px-5 py-3.5 bg-theme-bg-secondary border border-theme-border rounded-2xl text-xs font-mono uppercase tracking-widest font-black text-theme-text-muted cursor-default transition-all duration-300 ${pickColor}`}
                    >
                      {item}
                    </motion.div>
                  );
                })}
              </div>
            </div>

            {/* Right Block: Dynamic Culture Animation Canvas */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="lg:col-span-6 relative lg:order-1"
            >
              <div className="relative rounded-[3rem] p-8 md:p-12 bg-theme-bg-secondary border border-theme-border shadow-md overflow-hidden aspect-square flex flex-col justify-between">
                <div className="absolute top-0 left-0 w-full h-full bg-[linear-gradient(rgba(0,255,136,0.01)_1px,transparent_1px),linear-gradient(90deg,rgba(0,255,136,0.01)_1px,transparent_1px)] bg-[size:40px_40px] pointer-events-none opacity-40" />
                
                {/* Top Corner Decor */}
                <div className="flex justify-between items-start border-b border-theme-border pb-6 relative z-10">
                  <div>
                    <span className="text-[10px] font-mono font-black text-[#00ff88]/60 uppercase tracking-widest block">ENVIRONMENT TELEMETRY</span>
                    <h4 className="text-xl font-bold uppercase tracking-tight text-white mt-1">GFG MU CORE RADAR</h4>
                  </div>
                  <MessageSquare className="w-5 h-5 text-gfg-primary shrink-0 animate-pulse" />
                </div>

                {/* Animated Central Graphics */}
                <div className="relative flex-grow flex items-center justify-center my-8">
                  {/* Cosmic central orb */}
                  <motion.div
                    animate={{
                      scale: [1, 1.15, 0.95, 1],
                      rotate: 360
                    }}
                    transition={{
                      duration: 12,
                      repeat: Infinity,
                      ease: "linear"
                    }}
                    className="w-48 h-48 rounded-full border border-dashed border-gfg-primary/30 flex items-center justify-center relative bg-gradient-to-tr from-gfg-primary/5 via-transparent to-cyan-500/5"
                  >
                    <div className="w-32 h-32 rounded-full border border-dotted border-teal-500/30 flex items-center justify-center">
                      <div className="w-16 h-16 rounded-full bg-gfg-primary/10 border border-gfg-primary/30 flex items-center justify-center shadow-lg">
                        <Terminal className="w-6 h-6 text-gfg-primary" />
                      </div>
                    </div>

                    {/* Orbiting particles */}
                    <div className="absolute w-3 h-3 rounded-full bg-[#00ff88] top-2 left-10 shadow-[0_0_10px_#00ff88]" />
                    <div className="absolute w-2 h-2 rounded-full bg-cyan-400 bottom-4 right-12 shadow-[0_0_8px_#22d3ee]" />
                  </motion.div>
                  
                  {/* Floating culture prompt details based on selected values or default */}
                  <div className="absolute bottom-0 bg-theme-bg/95 border border-theme-border/80 rounded-2xl px-5 py-3 text-[10px] font-mono tracking-widest uppercase shadow-lg text-theme-text text-center">
                    {hoveredValue !== null ? (
                      <span className="text-gfg-primary font-black animate-pulse">ACTIVE ATMOSPHERE LOGGED</span>
                    ) : (
                      <span>HOVER CULTURE TAGS TO INTERACT</span>
                    )}
                  </div>
                </div>

                {/* Bottom Stats */}
                <div className="border-t border-theme-border pt-6 flex justify-between text-left relative z-10 text-[9px] font-mono text-theme-text-muted uppercase tracking-widest">
                  <div>
                    <span>CHAPTER VIBE:</span>
                    <span className="text-[#00ff88] block font-black">HIGH ENERGY, COMMUNITY FIRST</span>
                  </div>
                  <div className="text-right">
                    <span>HOST NODE:</span>
                    <span className="text-cyan-400 block font-black">MARWADI UNIVERSITY CAMPUS</span>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>

        {/* COMMUNITY IMPACT SECTION */}
        <div className="mb-32">
          <div className="text-center mb-16 max-w-2xl mx-auto">
            <span className="text-gfg-primary text-xs font-mono font-black tracking-widest uppercase mb-3 block">OUR IMPACT</span>
            <h2 className="text-3xl md:text-5xl font-black text-theme-text uppercase tracking-tight">
              OUR GROWING <span className="text-gfg-primary">COMMUNITY</span>
            </h2>
            <div className="w-16 h-1 bg-gfg-primary mx-auto rounded-full mt-4" />
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {[
              { val: "500+", tag: "COMMUNITY MEMBERS", sub: "Collaborative learners & tech enthusiasts" },
              { val: "50+", tag: "TECHNICAL EVENTS", sub: "Hackathons, sprints & interactive code streams" },
              { val: "25+", tag: "WORKSHOPS & SESSIONS", sub: "Deep-dives into expert technologies" },
              { val: "100+", tag: "COLLABORATIVE PROJECTS", sub: "Open-source tools & web utilities" },
              { val: "10000+", tag: "LEARNING HOURS", sub: "Hands-on coding, mentoring & study cycles" },
              { val: "Active", tag: "FUTURE ENGINEERS NETWORK", sub: "Continuous career pathways & mentorship" }
            ].map((stat, i) => (
              <motion.div
                key={stat.tag}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="p-8 rounded-[2.5rem] bg-theme-bg-secondary border border-theme-border/60 hover:border-gfg-primary/30 transition-all duration-300 shadow-sm text-left group"
              >
                <div className="text-3xl md:text-5xl font-black font-mono text-gfg-primary tracking-tight uppercase mb-3">
                  {stat.val.includes("+") ? (
                    <>
                      <AnimatedCounter value={stat.val} />+
                    </>
                  ) : (
                    stat.val
                  )}
                </div>
                <h4 className="text-[11px] font-mono font-black tracking-widest text-theme-text uppercase mb-2">
                  {stat.tag}
                </h4>
                <p className="text-theme-text-muted text-xs leading-relaxed font-semibold">
                  {stat.sub}
                </p>
              </motion.div>
            ))}
          </div>
        </div>

        {/* CORE VALUES SECTION */}
        <div className="mb-32">
          <div className="text-center mb-16 max-w-2xl mx-auto">
            <span className="text-gfg-primary text-xs font-mono font-black tracking-widest uppercase mb-3 block">FOUNDATION ARCHITECTURE</span>
            <h2 className="text-3xl md:text-5xl font-black text-theme-text uppercase tracking-tight">
              WHAT WE <span className="text-gfg-primary">STAND FOR</span>
            </h2>
            <div className="w-16 h-1 bg-gfg-primary mx-auto rounded-full mt-4" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
            {valuesList.map((val, idx) => {
              const ValIcon = val.icon;
              return (
                <motion.div
                  key={val.title}
                  initial={{ opacity: 0, y: 25 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: idx * 0.1 }}
                  whileHover={{ y: -5 }}
                  className="p-8 rounded-3xl bg-theme-bg-secondary border border-theme-border/60 hover:border-gfg-primary/30 transition-all text-left flex flex-col justify-between group"
                  style={{ boxShadow: `0 4px 30px rgba(0, 0, 0, 0.05)` }}
                >
                  <div className="w-11 h-11 mb-6 rounded-2xl bg-gfg-primary/5 text-gfg-primary flex items-center justify-center border border-gfg-primary/15 group-hover:bg-gfg-primary/10 transition-colors">
                    <ValIcon className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-lg font-black text-theme-text uppercase tracking-tight mb-2 group-hover:text-gfg-primary transition-colors">
                      {val.title}
                    </h4>
                    <p className="text-theme-text-secondary text-xs leading-relaxed font-semibold">
                      {val.desc}
                    </p>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* CLOSING / JOIN CTA SECTION */}
        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="p-10 md:p-14 rounded-[3.5rem] bg-theme-bg-secondary border border-theme-border flex flex-col lg:flex-row items-center justify-between gap-12 relative overflow-hidden shadow-sm text-left"
        >
          <div className="absolute top-0 right-0 w-96 h-96 bg-gfg-primary/5 rounded-full blur-[160px] pointer-events-none" />
          
          <div className="flex flex-col sm:flex-row items-center space-y-6 sm:space-y-0 sm:space-x-8 relative z-10 max-w-3xl">
            <div className="w-20 h-20 rounded-[2.2rem] bg-gfg-primary/10 border border-gfg-primary/20 flex items-center justify-center text-gfg-primary shrink-0 shadow-sm">
              <Compass className="w-10 h-10 animate-spin-slow text-gfg-primary" />
            </div>
            <div>
              <span className="text-[10px] font-mono uppercase tracking-[0.25em] font-black text-gfg-primary block mb-2">CLOSING STATEMENT</span>
              <h3 className="text-2xl md:text-3xl font-black text-theme-text mb-3 tracking-tight uppercase leading-tight">
                A COMMUNITY BUILT FOR STUDENTS, <span className="text-gfg-primary">BY STUDENTS</span>
              </h3>
              <p className="text-theme-text-muted text-xs md:text-sm font-semibold leading-relaxed">
                At GeeksforGeeks Student Chapter, Marwadi University, we believe that growth happens when passionate individuals come together to learn, create, and inspire one another. Our club is not just about coding—it's about building friendships, developing leadership, creating opportunities, and shaping the next generation of tech leaders.
              </p>
            </div>
          </div>

          <div className="flex flex-wrap gap-4 relative z-10 shrink-0 select-none">
            <a
              href="https://chat.whatsapp.com/F7RcXCTLYJ4Ije5NiL6sDM"
              target="_blank"
              rel="noopener noreferrer"
              className="px-8 py-4 bg-gfg-primary text-black font-black uppercase text-[10px] tracking-widest rounded-xl hover:brightness-110 transition-all flex items-center shadow-lg"
            >
              JOIN COMMUNITY <ChevronRight className="ml-2 w-4 h-4" />
            </a>
            <Link
              to="/contact"
              className="px-8 py-4 bg-theme-bg border border-theme-border text-theme-text font-black uppercase text-[10px] tracking-widest rounded-xl hover:bg-theme-bg-secondary transition-all flex items-center"
            >
              CONTACT CLANS <ArrowRight className="ml-2 w-4 h-4" />
            </Link>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}
