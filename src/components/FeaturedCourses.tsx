import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  Brain, 
  Code, 
  Cloud, 
  BarChart3, 
  ArrowUpRight, 
  Sparkles, 
  Check, 
  GraduationCap, 
  Briefcase, 
  Users, 
  Award, 
  GitBranch, 
  Clock,
  Terminal,
  ChevronRight,
  BookOpen
} from "lucide-react";

// Courses dataset matching the required schemas
const COURSES = [
  {
    id: "gen-ai",
    title: "Generative AI Training Program",
    icon: Brain,
    description: "Learn Prompt Engineering, LLMs, AI Agents, RAG Systems, and real-world AI application development.",
    tags: ["Live Course", "AI", "Projects"],
    link: "https://www.geeksforgeeks.org/courses/generative-ai-program",
    color: "#2F8D46",
    glowColor: "rgba(47, 141, 70, 0.4)",
    complexity: "All Levels",
    duration: "10 Weeks"
  },
  {
    id: "sde-interview",
    title: "Complete SDE Interview Program",
    icon: Code,
    description: "Master DSA, Problem Solving, System Design, CS Fundamentals, and Interview Preparation.",
    tags: ["DSA", "Placement Prep", "Mentorship"],
    link: "https://www.geeksforgeeks.org/courses/complete-interview-preparation-course",
    color: "#2F8D46",
    glowColor: "rgba(47, 141, 70, 0.4)",
    complexity: "Intermediate",
    duration: "12 Weeks"
  },
  {
    id: "devops",
    title: "DevOps Engineering with Certification",
    icon: Cloud,
    description: "Learn Docker, Kubernetes, CI/CD, AWS, Linux, Monitoring, and modern DevOps practices.",
    tags: ["DevOps", "Cloud", "Certification"],
    link: "https://www.geeksforgeeks.org/courses/devops-live",
    color: "#2F8D46",
    glowColor: "rgba(47, 141, 70, 0.4)",
    complexity: "Intermediate",
    duration: "8 Weeks"
  },
  {
    id: "data-analytics",
    title: "Data Analytics with AI",
    icon: BarChart3,
    description: "Learn Python, SQL, Power BI, Data Visualization, Machine Learning, and AI-powered analytics.",
    tags: ["Analytics", "AI", "Dashboard"],
    link: "https://www.geeksforgeeks.org/courses/data-analytics-live",
    color: "#2F8D46",
    glowColor: "rgba(47, 141, 70, 0.4)",
    complexity: "Beginner friendly",
    duration: "6 Weeks"
  }
];

// Six features badges with bespoke icons
const FEATURES = [
  { text: "Beginner to Advanced", icon: GraduationCap },
  { text: "Placement Preparation", icon: Briefcase },
  { text: "Live Mentorship", icon: Users },
  { text: "Industry Certification", icon: Award },
  { text: "Hands-on Projects", icon: GitBranch },
  { text: "Interview Ready", icon: Sparkles }
];

export default function FeaturedCourses() {
  const [particles, setParticles] = useState<Array<{ id: number; left: string; top: string; size: number; delay: number; duration: number }>>([]);

  // Generate floating background particles locally inside this section
  useEffect(() => {
    const generated = Array.from({ length: 18 }).map((_, i) => ({
      id: i,
      left: `${5 + Math.random() * 90}%`,
      top: `${5 + Math.random() * 90}%`,
      size: 1.5 + Math.random() * 3,
      delay: Math.random() * 5,
      duration: 8 + Math.random() * 12
    }));
    setParticles(generated);
  }, []);

  return (
    <section className="relative py-24 sm:py-32 overflow-hidden bg-theme-bg border-b border-theme-border text-theme-text theme-transition">
      {/* Cinematic grid & visual highlights */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        {/* Subtle grid layout */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(47,141,70,0.015)_1px,transparent_1px),linear-gradient(90deg,rgba(47,141,70,0.015)_1px,transparent_1px)] bg-[size:40px_40px] opacity-20 dark:opacity-60" />
        {/* Radial gradients to isolate depth */}
        <div className="absolute top-1/2 left-1/4 -translate-y-1/2 w-[550px] h-[550px] bg-gfg-primary/5 rounded-full blur-[140px] opacity-40 dark:opacity-60" />
        <div className="absolute bottom-0 right-10 w-[400px] h-[400px] bg-gfg-primary/5 rounded-full blur-[160px] opacity-30 dark:opacity-40" />
      </div>

      {/* Floating Particles Arena */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
        {particles.map((p) => (
          <motion.div
            key={p.id}
            className="absolute bg-gfg-primary/10 dark:bg-[#2F8D46]/20 rounded-full"
            style={{
              left: p.left,
              top: p.top,
              width: p.size,
              height: p.size,
            }}
            animate={{
              y: [0, -40, 0],
              x: [0, 15, 0],
              opacity: [0.1, 0.4, 0.1],
            }}
            transition={{
              duration: p.duration,
              repeat: Infinity,
              ease: "easeInOut",
              delay: p.delay,
            }}
          />
        ))}
      </div>

      <div className="max-w-7xl mx-auto px-6 relative z-10 w-full">
        {/* Section Header */}
        <div className="text-center mb-16 md:mb-20">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="inline-flex items-center space-x-2 px-4 py-1.5 bg-gfg-primary/10 border border-gfg-primary/25 rounded-full mb-5 shadow-[0_0_15px_rgba(47,141,70,0.08)] bg-opacity-40"
          >
            <Sparkles className="w-3.5 h-3.5 text-gfg-primary animate-pulse" />
            <span className="text-[10px] font-mono font-black uppercase tracking-[0.25em] text-gfg-primary">
              GEEKSFORGEEKS INTEGRATED ACADEMY
            </span>
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 25 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black tracking-tight uppercase leading-none italic text-theme-text"
          >
            FEATURED <span className="text-gfg-primary drop-shadow-[0_0_15px_rgba(47,141,70,0.25)]">GEEKSFORGEEKS</span> COURSES
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-theme-text-muted max-w-2xl mx-auto text-xs sm:text-sm md:text-base mt-4 leading-relaxed font-semibold uppercase tracking-wide"
          >
            Learn industry-ready skills through curated GeeksforGeeks programs and accelerate your placement journey.
          </motion.p>
        </div>

        {/* 4 Course Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-20">
          {COURSES.map((course, i) => {
            const IconComponent = course.icon;
            return (
              <motion.div
                key={course.id}
                initial={{ opacity: 0, y: 35 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                whileHover={{ y: -8, transition: { duration: 0.2 } }}
                className="group relative rounded-3xl bg-theme-bg-secondary border border-theme-border hover:border-gfg-primary/45 transition-all duration-300 shadow-sm hover:shadow-lg overflow-hidden flex flex-col h-full backdrop-blur-md theme-transition"
              >
                {/* Neon top highlighting strip */}
                <div className="absolute top-0 left-0 w-full h-[3px] bg-gradient-to-r from-transparent via-gfg-primary/45 to-transparent group-hover:via-gfg-primary transition-all duration-300" />
                
                {/* Dynamic course decorative particle aura */}
                <div className="absolute -right-16 -top-16 w-32 h-32 bg-gfg-primary/5 rounded-full blur-2xl group-hover:bg-gfg-primary/10 transition-colors" />

                {/* Upper body */}
                <div className="p-7 sm:p-8 flex-grow flex flex-col">
                  {/* Icon Frame */}
                  <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-gfg-primary/15 to-gfg-primary/5 border border-gfg-primary/20 flex items-center justify-center text-gfg-primary mb-6 shadow-[0_0_10px_rgba(47,141,70,0.1)] group-hover:shadow-[0_0_20px_rgba(47,141,70,0.25)] transition-all">
                    <IconComponent className="w-6 h-6 group-hover:scale-110 transition-transform" />
                  </div>

                  {/* Program Metadata badges */}
                  <div className="flex items-center space-x-2.5 mb-4 font-mono text-[9px] text-gfg-primary font-bold uppercase tracking-wider">
                    <span className="flex items-center">
                      <Clock className="w-3 h-3 mr-1" /> {course.duration}
                    </span>
                    <span className="w-1.5 h-1.5 rounded-full bg-theme-border" />
                    <span>{course.complexity}</span>
                  </div>

                  {/* Title */}
                  <h3 className="text-lg sm:text-xl font-bold tracking-tight text-theme-text mb-3 group-hover:text-gfg-primary transition-colors leading-tight uppercase font-sans">
                    {course.title}
                  </h3>

                  {/* Description */}
                  <p className="text-theme-text-secondary text-[11.5px] leading-relaxed mb-6 font-medium">
                    {course.description}
                  </p>

                  {/* Pills row */}
                  <div className="mt-auto flex flex-wrap gap-1.5">
                    {course.tags.map((tag) => (
                      <span
                        key={tag}
                        className="px-2.5 py-1 bg-gfg-primary/5 border border-gfg-primary/15 rounded-lg text-[8.5px] font-mono font-extrabold text-gfg-primary/95 uppercase tracking-widest"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Footer section interaction block */}
                <div className="px-7 py-5 bg-theme-bg-tertiary border-t border-theme-border mt-auto flex items-center justify-between theme-transition">
                  <a
                    href={course.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full flex items-center justify-between text-[10px] font-mono font-black uppercase text-theme-text-secondary group-hover:text-gfg-primary tracking-widest cursor-pointer select-none"
                  >
                    <span>Explore Course</span>
                    <span className="w-8 h-8 rounded-xl bg-theme-bg border border-theme-border flex items-center justify-center text-theme-text-muted group-hover:text-white group-hover:bg-gfg-primary group-hover:border-transparent transition-all z-10 shadow-inner">
                      <ArrowUpRight className="w-4 h-4" />
                    </span>
                  </a>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Six Features Row */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="p-8 sm:p-10 rounded-[2.5rem] bg-theme-bg-secondary border border-theme-border shadow-sm mb-20 relative overflow-hidden theme-transition"
        >
          {/* Subtle line background layout */}
          <div className="absolute top-0 left-0 w-[4px] h-full bg-gfg-primary" />
          
          <div className="relative z-10 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6 md:gap-8 justify-items-center">
            {FEATURES.map((feat, index) => {
              const FeatIcon = feat.icon;
              return (
                <div
                  key={feat.text}
                  className="flex flex-col items-center text-center space-y-3 group/feat"
                >
                  <div className="w-10 h-10 rounded-xl bg-gfg-primary/10 border border-gfg-primary/20 flex items-center justify-center text-gfg-primary group-hover/feat:bg-gfg-primary group-hover/feat:text-white transition-all shadow-[0_0_15px_rgba(47,141,70,0.06)]">
                    <FeatIcon className="w-4.5 h-4.5" />
                  </div>
                  <div className="flex items-center space-x-1.5 justify-center">
                    <div className="w-3.5 h-3.5 rounded-full bg-gfg-primary/15 flex items-center justify-center text-gfg-primary shrink-0">
                      <Check className="w-2.5 h-2.5 stroke-[4.5]" />
                    </div>
                    <span className="text-[10px] sm:text-[11px] font-sans font-black uppercase tracking-wider text-theme-text-secondary">
                      {feat.text}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </motion.div>

        {/* CTA Banner Section */}
        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, ease: "easeOut" }}
          className="relative p-10 md:p-14 rounded-[2.5rem] bg-theme-bg-secondary border border-theme-border shadow-md overflow-hidden flex flex-col lg:flex-row items-center justify-between gap-10 text-left theme-transition"
        >
          {/* Ambient lighting inside CTA area */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[350px] bg-gfg-primary/5 rounded-full blur-[120px] pointer-events-none" />

          {/* Texts metadata */}
          <div className="flex-grow max-w-2xl relative z-10 space-y-4">
            <div className="inline-flex items-center space-x-2 px-3 py-1 bg-gfg-primary/10 border border-gfg-primary/20 rounded-full">
              <span className="w-1.5 h-1.5 rounded-full bg-gfg-primary animate-pulse" />
              <span className="text-[9px] font-mono font-black uppercase text-theme-text-secondary tracking-wider">
                JOIN OVER 100K+ ENROLLED STUDENTS
              </span>
            </div>

            <h3 className="text-2xl sm:text-3xl md:text-4xl font-extrabold uppercase italic tracking-tight text-theme-text leading-none">
              Enroll Today & <span className="text-gfg-primary">Accelerate</span> Your Tech Career
            </h3>
            
            <p className="text-theme-text-muted text-xs sm:text-sm font-semibold max-w-xl">
              Learn from Experts • Live Classes • Industry Projects • Certifications
            </p>
          </div>

          {/* Target link CTA Button */}
          <div className="relative z-10 shrink-0 w-full lg:w-auto">
            <a
              href="https://www.geeksforgeeks.org/courses/"
              target="_blank"
              rel="noopener noreferrer"
              className="group/cta px-10 py-5 bg-gfg-primary text-white dark:text-black font-mono font-black rounded-xl hover:bg-theme-text hover:text-[#2F8D46] transition-all duration-300 flex items-center justify-center text-xs uppercase tracking-[0.2em] relative overflow-hidden shadow-sm"
            >
              <span>View All Courses</span>
              <ArrowUpRight className="ml-2 w-4.5 h-4.5 group-hover/cta:translate-x-1 group-hover/cta:-translate-y-1 transition-transform" />
            </a>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
