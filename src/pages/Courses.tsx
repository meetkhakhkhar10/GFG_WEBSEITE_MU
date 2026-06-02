import React, { useState, useMemo } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "motion/react";
import { 
  BookOpen, 
  Sparkles, 
  Check, 
  LogIn, 
  Lock, 
  GraduationCap, 
  Briefcase, 
  Users, 
  Award, 
  Terminal, 
  Trophy, 
  MessageSquare, 
  Table, 
  Network, 
  TrendingUp, 
  Layers, 
  Cpu, 
  Code, 
  Globe, 
  Brain, 
  Zap, 
  FileText, 
  Search, 
  ArrowUpRight, 
  ChevronRight, 
  LockKeyhole,
  CheckCircle,
  HelpCircle
} from "lucide-react";
import { useAuth } from "@/src/contexts/AuthContext";
import { useTheme } from "@/src/contexts/ThemeContext";

// Detailed list of 17 curation resources from prompt
const resourcesData = [
  // Courses
  {
    category: "Courses",
    title: "Courses",
    description: "Explore GeeksforGeeks learning courses.",
    link: "https://practice.geeksforgeeks.org/courses",
    icon: BookOpen
  },
  {
    category: "Courses",
    title: "DSA Self-Paced",
    description: "Master data structures and algorithms.",
    link: "https://www.geeksforgeeks.org/courses/dsa-self-paced",
    icon: GraduationCap
  },
  // Practice
  {
    category: "Practice",
    title: "Practice Problems",
    description: "Solve coding questions and improve skills.",
    link: "https://practice.geeksforgeeks.org/explore?page=1",
    icon: Terminal
  },
  {
    category: "Practice",
    title: "Competitive Programming",
    description: "Prepare for contests and coding competitions.",
    link: "https://www.geeksforgeeks.org/competitive-programming-a-complete-guide/",
    icon: Trophy
  },
  // Interview Prep
  {
    category: "Interview Preparation",
    title: "Interview Preparation",
    description: "Complete interview preparation roadmap.",
    link: "https://www.geeksforgeeks.org/courses/interview-preparation-course",
    icon: Briefcase
  },
  {
    category: "Interview Preparation",
    title: "Interview Experiences",
    description: "Read real interview experiences from companies.",
    link: "https://www.geeksforgeeks.org/company-interview-corner/",
    icon: MessageSquare
  },
  {
    category: "Interview Preparation",
    title: "SDE Sheet",
    description: "Structured preparation sheet for software roles.",
    link: "https://www.geeksforgeeks.org/sde-sheet-a-complete-guide-for-sde-preparation/",
    icon: Table
  },
  // DSA
  {
    category: "DSA",
    title: "Data Structures",
    description: "Comprehensive data structures learning material.",
    link: "https://www.geeksforgeeks.org/data-structures/",
    icon: Network
  },
  {
    category: "DSA",
    title: "Algorithms",
    description: "Learn algorithm fundamentals and problem solving.",
    link: "https://www.geeksforgeeks.org/fundamentals-of-algorithms/",
    icon: TrendingUp
  },
  // Programming Languages
  {
    category: "Programming Languages",
    title: "Python",
    description: "Learn Python programming.",
    link: "https://www.geeksforgeeks.org/python-programming-language/",
    icon: Layers
  },
  {
    category: "Programming Languages",
    title: "Java",
    description: "Learn Java programming.",
    link: "https://www.geeksforgeeks.org/java/",
    icon: Cpu
  },
  {
    category: "Programming Languages",
    title: "C++",
    description: "Master C++ programming concepts.",
    link: "https://www.geeksforgeeks.org/c-plus-plus/",
    icon: Code
  },
  {
    category: "Programming Languages",
    title: "Web Development",
    description: "Frontend and backend web development resources.",
    link: "https://www.geeksforgeeks.org/web-development/",
    icon: Globe
  },
  {
    category: "Programming Languages",
    title: "Machine Learning",
    description: "Learn AI and machine learning concepts.",
    link: "https://www.geeksforgeeks.org/machine-learning/",
    icon: Brain
  },
  // Career & Jobs
  {
    category: "Career & Jobs",
    title: "Job-A-Thon",
    description: "Hiring challenge and placement opportunities.",
    link: "https://www.geeksforgeeks.org/job-a-thon-hiring-challenge/",
    icon: Zap
  },
  {
    category: "Career & Jobs",
    title: "Blogs",
    description: "Latest technical blogs and learning content.",
    link: "https://www.geeksforgeeks.org/blogs/",
    icon: FileText
  },
  // Student Programs
  {
    category: "Student Programs",
    title: "Campus Ambassador",
    description: "Become a GeeksforGeeks student leader.",
    link: "https://www.geeksforgeeks.org/campus-mantri/",
    icon: Award
  }
];

// Feature show list for Locked Showcase
const premiumFeatures = [
  "Personalized Learning Dashboard",
  "Course Progress Tracking",
  "Certificates & Achievements",
  "Event Participation Records",
  "Student Leaderboards",
  "Exclusive Chapter Resources",
  "Placement Preparation",
  "Premium Learning Paths"
];

// Pill categories
const categoryPills = [
  "All Resources",
  "Courses",
  "Practice",
  "DSA",
  "Programming Languages",
  "Interview Preparation",
  "Career & Jobs",
  "Student Programs"
];

export default function Courses() {
  const { isAuthenticated } = useAuth();
  const { theme } = useTheme();
  const navigate = useNavigate();

  // Search and filter states
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("All Resources");

  const handleScrollToResources = () => {
    const section = document.getElementById("search-section");
    if (section) {
      section.scrollIntoView({ behavior: "smooth" });
    }
  };

  const filteredResources = useMemo(() => {
    return resourcesData.filter((res) => {
      // Role filter
      const matchesCategory = 
        activeCategory === "All Resources" || 
        res.category.toLowerCase() === activeCategory.toLowerCase();
      
      // Search matching
      const matchesSearch = 
        res.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        res.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        res.category.toLowerCase().includes(searchQuery.toLowerCase());

      return matchesCategory && matchesSearch;
    });
  }, [searchQuery, activeCategory]);

  return (
    <div className="bg-white dark:bg-[#0F172A] min-h-screen text-[#0F172A] dark:text-slate-100 relative overflow-hidden transition-colors duration-300 py-24 sm:py-32">
      
      {/* Visual Ambient Spot Lights */}
      <div className="absolute inset-0 pointer-events-none z-0">
        <div className="absolute top-[10%] left-[-10%] w-[500px] h-[500px] bg-[#2F8D46]/5 dark:bg-[#2F8D46]/10 rounded-full blur-[120px]" />
        <div className="absolute bottom-[15%] right-[-10%] w-[600px] h-[600px] bg-emerald-700/5 dark:bg-emerald-900/10 rounded-full blur-[150px]" />
      </div>

      <div className="max-w-7xl mx-auto px-6 relative z-10 w-full space-y-24 sm:space-y-32">
        
        {/* ==================== 1. HERO SECTION ==================== */}
        <motion.section 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center max-w-4xl mx-auto space-y-6"
        >
          {/* Badge */}
          <div className="inline-flex items-center space-x-2 px-4 py-1.5 bg-[#DDF7E3] dark:bg-[#2F8D46]/10 border border-[#2F8D46]/20 rounded-full shadow-sm">
            <Sparkles className="w-4 h-4 text-[#2F8D46]" />
            <span className="text-[11px] font-mono font-bold tracking-wider uppercase text-[#1F6B34] dark:text-[#2F8D46]">
              CURATED LEARNING RESOURCES
            </span>
          </div>

          {/* Heading */}
          <h1 className="text-4xl sm:text-5xl md:text-7xl font-sans font-black tracking-tight uppercase leading-none text-slate-900 dark:text-white">
            GFG <span className="text-[#2F8D46]">RESOURCES HUB</span>
          </h1>

          {/* Subtitles */}
          <div className="space-y-4 max-w-3xl mx-auto">
            <p className="text-[#64748B] dark:text-slate-300 text-sm sm:text-base md:text-lg font-medium leading-relaxed">
              Explore curated learning resources, practice tracks, interview preparation material, and career-focused content from GeeksforGeeks.
            </p>
            <p className="text-slate-500 dark:text-slate-400 text-xs sm:text-sm font-semibold max-w-2xl mx-auto">
              Access industry-leading learning materials, coding practice, interview preparation resources, and career development content from GeeksforGeeks.
            </p>
          </div>

          {/* Locked Premium Banner Notice */}
          <div className="max-w-2xl mx-auto p-4 bg-[#DDF7E3]/60 dark:bg-[#2F8D46]/5 rounded-2xl border border-[#2F8D46]/20 text-[#1F6B34] dark:text-[#2F8D46]/90 font-semibold text-xs sm:text-sm flex items-center justify-center gap-2">
            <span>🔒</span>
            <span className="text-center">
              Full learning paths, certificates, progress tracking, exclusive resources, and advanced content are available inside the Student Portal.
            </span>
          </div>

          {/* Call To Actions */}
          <div className="flex flex-col sm:flex-row justify-center items-center gap-4 pt-4">
            <motion.button
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => navigate(isAuthenticated ? "/student/portal" : "/login")}
              className="w-full sm:w-auto px-8 py-4 bg-[#2F8D46] hover:bg-[#1F6B34] text-white font-mono font-black text-xs uppercase tracking-widest rounded-xl shadow-lg shadow-[#2F8D46]/20 flex items-center justify-center gap-2 cursor-pointer transition-colors"
            >
              <span>Login to Student Portal</span>
              <LogIn className="w-4 h-4" />
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleScrollToResources}
              className="w-full sm:w-auto px-8 py-4 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-100 font-mono font-black text-xs uppercase tracking-widest rounded-xl transition-colors cursor-pointer"
            >
              <span>Explore Resources</span>
            </motion.button>
          </div>
        </motion.section>

        {/* ==================== 2. PORTAL LOCKED FEATURE SHOWCASE ==================== */}
        <motion.section 
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="relative rounded-3xl p-8 sm:p-12 border border-slate-200 dark:border-slate-800 bg-white/70 dark:bg-[#0F172A]/80 backdrop-blur-md shadow-2xl overflow-hidden group"
          id="showcase-section"
        >
          {/* Decorative mesh inside card */}
          <div className="absolute top-0 right-0 w-80 h-80 bg-gradient-to-bl from-[#2F8D46]/10 via-transparent to-transparent opacity-60 rounded-full" />
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center relative z-10">
            {/* Left Graphics info */}
            <div className="lg:col-span-5 space-y-6">
              <div className="w-12 h-12 bg-[#2F8D46]/10 border border-[#2F8D46]/20 rounded-2xl flex items-center justify-center text-[#2F8D46] animate-bounce">
                <LockKeyhole className="w-6 h-6" />
              </div>
              <h2 className="text-3xl sm:text-4xl font-black uppercase tracking-tight text-slate-900 dark:text-white leading-tight">
                Unlock More Inside <br /><span className="text-[#2F8D46]">Student Portal</span>
              </h2>
              <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed font-semibold">
                Login required to access all premium student resources. Get tailored roadmaps, real-time tracking, and verified certifications curated for Marwadi University student developers.
              </p>
              
              <div className="pt-2">
                <button
                  onClick={() => navigate("/login")}
                  className="inline-flex items-center space-x-2 text-[#2F8D46] hover:text-[#1F6B34] font-bold text-sm group"
                >
                  <span>Log in with university email</span>
                  <ChevronRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                </button>
              </div>
            </div>

            {/* Right Pillars List */}
            <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-4">
              {premiumFeatures.map((feat, i) => (
                <motion.div
                  key={feat}
                  initial={{ opacity: 0, x: 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.05 }}
                  className="p-4 rounded-xl border border-slate-100 dark:border-slate-800 bg-white/50 dark:bg-slate-900/50 flex items-center space-x-3 shadow-sm hover:shadow-md transition-all duration-300"
                >
                  <div className="w-6 h-6 rounded-md bg-[#DDF7E3] dark:bg-[#2F8D46]/10 flex items-center justify-center text-[#2F8D46]">
                    <Check className="w-4 h-4" />
                  </div>
                  <span className="text-[12px] sm:text-[13px] font-black tracking-wide text-slate-800 dark:text-slate-200">
                    {feat}
                  </span>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.section>

        {/* ==================== 3. SEARCH & FILTERS ==================== */}
        <div className="space-y-8" id="search-section">
          {/* Search bar section */}
          <div className="max-w-2xl mx-auto space-y-4">
            <h3 className="text-center font-mono font-bold text-xs uppercase tracking-widest text-[#2F8D46]">
              Real-time Resource Search
            </h3>
            
            <div className="relative">
              <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
                <Search className="w-5 h-5 text-slate-400 dark:text-slate-500 animate-pulse" />
              </div>
              <input
                type="text"
                placeholder="Search courses, technologies, interview prep, practice problems..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-white dark:bg-[#0F172A] border border-slate-200 dark:border-slate-800 rounded-2xl pl-12 pr-4 py-4.5 text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-[#2F8D46]/40 focus:border-[#2F8D46] transition-all text-[#0F172A] dark:text-slate-100 shadow-sm"
              />
            </div>
          </div>

          {/* ==================== 4. CATEGORY FILTERS ==================== */}
          <div className="flex flex-wrap justify-center items-center gap-2 max-w-5xl mx-auto">
            {categoryPills.map((pill) => (
              <button
                key={pill}
                onClick={() => setActiveCategory(pill)}
                className={`px-4.5 py-2 rounded-full text-xs sm:text-sm font-bold uppercase tracking-wider transition-all cursor-pointer ${
                  activeCategory === pill
                    ? "bg-[#2F8D46] text-white border-transparent shadow-md transform scale-[1.03]"
                    : "bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 border border-transparent"
                }`}
              >
                {pill}
              </button>
            ))}
          </div>
        </div>

        {/* ==================== 5. RESOURCES GRID ==================== */}
        <section className="space-y-6">
          <div className="flex justify-between items-center border-b border-slate-100 dark:border-slate-800 pb-4">
            <h4 className="font-mono text-xs font-black uppercase tracking-widest text-slate-500 dark:text-slate-400">
              Recovered Materials ({filteredResources.length})
            </h4>
            <span className="text-[11px] font-bold text-slate-400 uppercase">
              Page: Courses x Campus Registry Only
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <AnimatePresence mode="popLayout">
              {filteredResources.map((res, i) => {
                const ResIcon = res.icon;
                return (
                  <motion.div
                    key={res.title}
                    layout
                    initial={{ opacity: 0, scale: 0.95, y: 15 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, y: 15 }}
                    transition={{ duration: 0.4, delay: Math.min(i * 0.04, 0.4) }}
                    className="group relative p-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white/75 dark:bg-[#0F172A]/80 backdrop-blur-md shadow-sm hover:shadow-xl hover:border-[#2F8D46]/40 transition-all duration-300 flex flex-col justify-between"
                    style={{ transformStyle: "preserve-3d" }}
                    whileHover={{ y: -8 }}
                  >
                    {/* Shadow overlay glowing on Hover */}
                    <div className="absolute inset-0 rounded-2xl bg-gradient-to-tr from-[#2F8D46]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />

                    <div className="space-y-4 relative z-10">
                      {/* Icon & Category Row */}
                      <div className="flex justify-between items-start">
                        <div className="p-3 bg-[#DDF7E3] dark:bg-[#2F8D46]/10 border border-[#2F8D46]/20 rounded-xl text-[#2F8D46] group-hover:bg-[#2F8D46] group-hover:text-white transition-colors duration-300">
                          <ResIcon className="w-5 h-5" />
                        </div>
                        <span className="px-2.5 py-1 bg-slate-100 dark:bg-slate-800 text-[9.5px] font-black uppercase tracking-[0.1em] text-slate-500 dark:text-slate-400 rounded-md">
                          {res.category}
                        </span>
                      </div>

                      {/* Info */}
                      <div className="space-y-1">
                        <h4 className="text-base font-black text-slate-900 dark:text-white group-hover:text-[#2F8D46] transition-colors leading-snug">
                          {res.title}
                        </h4>
                        <p className="text-xs text-[#64748B] dark:text-slate-400 leading-relaxed font-semibold">
                          {res.description}
                        </p>
                      </div>
                    </div>

                    {/* Open Resource button */}
                    <div className="pt-6 relative z-10">
                      <a
                        href={res.link}
                        target="_blank"
                        rel="noreferrer"
                        className="w-full h-11 bg-slate-100 hover:bg-[#2F8D46] dark:bg-slate-800 dark:hover:bg-[#2F8D46] hover:text-white text-slate-700 dark:text-slate-300 font-mono font-black text-[10px] uppercase tracking-widest rounded-lg flex items-center justify-center gap-1 transition-all"
                      >
                        <span>Open Resource</span>
                        <ArrowUpRight className="w-3.5 h-3.5" />
                      </a>
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>

          {filteredResources.length === 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="py-16 text-center text-slate-400 dark:text-slate-500 font-bold uppercase tracking-wider text-xs"
            >
              No matching GFG Resources met specified query filters currently.
            </motion.div>
          )}
        </section>

        {/* ==================== 6. STUDENT PORTAL CTA ==================== */}
        <motion.section 
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="rounded-[2rem] p-8 sm:p-14 bg-slate-50 dark:bg-slate-900/40 border border-slate-100 dark:border-slate-800/60 relative overflow-hidden text-center max-w-4xl mx-auto space-y-6"
        >
          {/* Ambient center light tag */}
          <div className="absolute top-[-50%] left-[25%] right-[25%] bottom-0 bg-[#2F8D46]/5 rounded-full blur-[100px] pointer-events-none" />

          <h2 className="text-2xl sm:text-4xl font-black uppercase tracking-tight text-slate-900 dark:text-white">
            Want Access to Everything?
          </h2>

          <div className="space-y-4 max-w-2xl mx-auto">
            <p className="text-[#64748B] dark:text-slate-300 text-xs sm:text-sm font-semibold">
              Login to the Student Portal and unlock:
            </p>
            
            {/* Checklist of locked offerings */}
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2.5 max-w-xl mx-auto text-left py-2 font-black uppercase tracking-widest text-[9px] text-[#2F8D46]">
              <div className="flex items-center gap-1.5"><CheckCircle className="w-3.5 h-3.5" /> Personalized Dashboard</div>
              <div className="flex items-center gap-1.5"><CheckCircle className="w-3.5 h-3.5" /> Event Resources</div>
              <div className="flex items-center gap-1.5"><CheckCircle className="w-3.5 h-3.5" /> Premium Learning Paths</div>
              <div className="flex items-center gap-1.5"><CheckCircle className="w-3.5 h-3.5" /> Certificates</div>
              <div className="flex items-center gap-1.5"><CheckCircle className="w-3.5 h-3.5" /> Progress Tracking</div>
              <div className="flex items-center gap-1.5"><CheckCircle className="w-3.5 h-3.5" /> Exclusive Chapter Content</div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row justify-center items-center gap-3 pt-4">
            <button
              onClick={() => navigate(isAuthenticated ? "/student/portal" : "/login")}
              className="w-full sm:w-auto px-8 py-4.5 bg-[#2F8D46] hover:bg-[#1F6B34] text-white font-mono font-black text-xs uppercase tracking-widest rounded-xl shadow-lg transition-colors cursor-pointer"
            >
              Login to Student Portal
            </button>
            <button
              onClick={() => navigate("/about")}
              className="w-full sm:w-auto px-8 py-4.5 bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-100 font-mono font-black text-xs uppercase tracking-widest rounded-xl transition-all border border-slate-200 dark:border-slate-700 cursor-pointer"
            >
              Learn More
            </button>
          </div>
        </motion.section>

      </div>
    </div>
  );
}
