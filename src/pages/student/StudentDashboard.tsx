import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  BookOpen, 
  Search, 
  ExternalLink, 
  GraduationCap, 
  LogOut, 
  Sun, 
  Moon, 
  Sparkles, 
  Award, 
  Users, 
  ArrowRight,
  TrendingUp,
  LayoutGrid,
  CheckCircle,
  HelpCircle,
  ChevronRight,
  ArrowUpRight
} from "lucide-react";
import { useAuth } from "@/src/contexts/AuthContext";
import { useTheme } from "@/src/contexts/ThemeContext";
import { useNavigate } from "react-router-dom";
import { cn } from "@/src/lib/utils";
import ThemeCube from "@/src/components/ThemeCube";

// Fully populated Resource Data matching requirements
interface Resource {
  title: string;
  description: string;
  link: string;
  category: "Courses" | "Practice" | "Interview Prep" | "DSA" | "Programming" | "Career" | "Student Programs";
}

const RESOURCES: Resource[] = [
  // CATEGORY: COURSES
  {
    title: "Courses",
    description: "Explore GeeksforGeeks learning courses.",
    link: "https://practice.geeksforgeeks.org/courses",
    category: "Courses"
  },
  {
    title: "DSA Self-Paced",
    description: "Master data structures and algorithms.",
    link: "https://www.geeksforgeeks.org/courses/dsa-self-paced",
    category: "Courses"
  },
  // CATEGORY: PRACTICE
  {
    title: "Practice Problems",
    description: "Solve coding questions and improve skills.",
    link: "https://practice.geeksforgeeks.org/explore?page=1",
    category: "Practice"
  },
  {
    title: "Competitive Programming",
    description: "Prepare for contests and coding competitions.",
    link: "https://www.geeksforgeeks.org/competitive-programming-a-complete-guide/",
    category: "Practice"
  },
  // CATEGORY: INTERVIEW PREPARATION
  {
    title: "Interview Preparation",
    description: "Complete interview preparation roadmap.",
    link: "https://www.geeksforgeeks.org/courses/interview-preparation-course",
    category: "Interview Prep"
  },
  {
    title: "Interview Experiences",
    description: "Read real interview experiences from companies.",
    link: "https://www.geeksforgeeks.org/company-interview-corner/",
    category: "Interview Prep"
  },
  {
    title: "SDE Sheet",
    description: "Structured preparation sheet for software roles.",
    link: "https://www.geeksforgeeks.org/sde-sheet-a-complete-guide-for-sde-preparation/",
    category: "Interview Prep"
  },
  // CATEGORY: DSA
  {
    title: "Data Structures",
    description: "Comprehensive data structures learning material.",
    link: "https://www.geeksforgeeks.org/data-structures/",
    category: "DSA"
  },
  {
    title: "Algorithms",
    description: "Learn algorithm fundamentals and problem solving.",
    link: "https://www.geeksforgeeks.org/fundamentals-of-algorithms/",
    category: "DSA"
  },
  // CATEGORY: PROGRAMMING LANGUAGES
  {
    title: "Python",
    description: "Learn Python programming.",
    link: "https://www.geeksforgeeks.org/python-programming-language/",
    category: "Programming"
  },
  {
    title: "Java",
    description: "Learn Java programming.",
    link: "https://www.geeksforgeeks.org/java/",
    category: "Programming"
  },
  {
    title: "C++",
    description: "Master C++ programming concepts.",
    link: "https://www.geeksforgeeks.org/c-plus-plus/",
    category: "Programming"
  },
  {
    title: "Web Development",
    description: "Frontend and backend web development resources.",
    link: "https://www.geeksforgeeks.org/web-development/",
    category: "Programming"
  },
  {
    title: "Machine Learning",
    description: "Learn AI and machine learning concepts.",
    link: "https://www.geeksforgeeks.org/machine-learning/",
    category: "Programming"
  },
  // CATEGORY: CAREER & JOBS
  {
    title: "Job-A-Thon",
    description: "Hiring challenge and placement opportunities.",
    link: "https://www.geeksforgeeks.org/job-a-thon-hiring-challenge/",
    category: "Career"
  },
  {
    title: "Blogs",
    description: "Latest technical blogs and learning content.",
    link: "https://www.geeksforgeeks.org/blogs/",
    category: "Career"
  },
  // CATEGORY: STUDENT PROGRAMS
  {
    title: "Campus Ambassador",
    description: "Become a GeeksforGeeks student leader.",
    link: "https://www.geeksforgeeks.org/campus-mantri/",
    category: "Student Programs"
  }
];

const CATEGORIES = [
  "All Resources",
  "Courses",
  "Practice",
  "Interview Prep",
  "DSA",
  "Programming",
  "Career",
  "Student Programs"
];

export default function StudentDashboard() {
  const { user, isAuthenticated, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All Resources");

  useEffect(() => {
    document.title = "Student Learning Hub | GeeksforGeeks MU";
    if (!localStorage.getItem("token")) {
      navigate("/login");
    }
  }, [navigate]);

  // Live filtering method
  const filteredResources = RESOURCES.filter(res => {
    const matchesSearch = 
      res.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      res.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      res.category.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesCategory = 
      selectedCategory === "All Resources" || 
      res.category === selectedCategory;

    return matchesSearch && matchesCategory;
  });

  const isDark = theme === "dark";

  // Handles dynamic scroll to resources
  const scrollToResources = () => {
    const el = document.getElementById("resources-vault-grid");
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div 
      className={cn(
        "min-h-screen font-sans transition-all duration-300 relative",
        isDark 
          ? "bg-[#030B1A] text-white" 
          : "bg-[#FFFFFF] text-[#111827]"
      )}
    >
      {/* BACKGROUND DECORATIVE GLOW PATTERNS (ONLY IN DARK MODE FOR HIGH FIDELITY DEPTH) */}
      {isDark && (
        <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
          <div className="absolute top-0 right-1/4 w-[600px] h-[600px] bg-[#2F8D46]/5 rounded-full blur-[150px] opacity-70" />
          <div className="absolute top-1/3 left-10 w-[450px] h-[440px] bg-[#1F6B34]/3 rounded-full blur-[130px] opacity-40" />
          <div className="absolute bottom-10 right-10 w-[500px] h-[500px] bg-[#2F8D46]/3 rounded-full blur-[160px] opacity-40" />
        </div>
      )}

      {/* TOP HEADER MENU NAVIGATION BAR */}
      <nav 
        className={cn(
          "relative z-30 border-b transition-all duration-300 sticky top-0 backdrop-blur-md bg-opacity-95",
          isDark 
            ? "border-[#0F2B46] bg-[#030B1A]/95" 
            : "border-[#E5E7EB] bg-white/95"
        )}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between">
          
          {/* GFG MU Student Chapter Logo branding */}
          <div 
            className="flex items-center space-x-3 cursor-pointer" 
            onClick={() => navigate("/")}
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#2F8D46] to-[#1F6B34] flex items-center justify-center text-white shadow-sm font-black">
              G
            </div>
            <div>
              <h1 className="font-extrabold text-[#2F8D46] text-xs uppercase tracking-wider leading-none">
                GEEKSFORGEEKS
              </h1>
              <p className={cn(
                "text-[8px] font-black uppercase tracking-widest mt-1",
                isDark ? "text-gray-400" : "text-gray-500"
              )}>Marwadi University Chapter</p>
            </div>
          </div>

          {/* Quick Info & Controls */}
          <div className="flex items-center space-x-4">
            
            {/* Student mini profile summary */}
            <div className="hidden md:flex items-center space-x-2.5 px-3 py-1 bg-opacity-40 rounded-xl">
              <div className="w-8 h-8 rounded-full bg-[#2F8D46]/10 border border-[#2F8D46]/20 flex items-center justify-center font-bold text-[#2F8D46] text-xs uppercase">
                {user?.name ? user.name.slice(0, 2).toUpperCase() : "MU"}
              </div>
              <div className="text-left">
                <div className={cn("text-[10px] font-black uppercase tracking-wide", isDark ? "text-white" : "text-gray-900")}>
                  {user?.name || "Student Member"}
                </div>
                <div className={cn("text-[8px] font-mono", isDark ? "text-gray-400" : "text-gray-500")}>
                  {user?.email || "student@marwadiuniversity.ac.in"}
                </div>
              </div>
            </div>

            {/* Portal Sync Button */}
            <button
              onClick={() => navigate("/student/portal")}
              className={cn(
                "px-3.5 py-1.5 rounded-lg text-[9px] font-mono font-black uppercase tracking-widest border transition-all hover:scale-105 shadow-sm",
                isDark 
                  ? "bg-[#071629] border-[#0F2B46] text-[#2F8D46] hover:bg-[#2F8D46]/10" 
                  : "bg-[#FFFFFF] border-[#E5E7EB] text-[#2F8D46] hover:bg-gray-50"
              )}
            >
              Portal Home
            </button>

            {/* Modern Uiverse 3D Cube Theme Switch Toggle */}
            <div className="flex items-center justify-center shrink-0 scale-90">
              <ThemeCube />
            </div>

            {/* Sign Out Button */}
            <button
              onClick={() => {
                logout();
                navigate("/");
              }}
              className={cn(
                "p-2 rounded-xl transition-all border",
                isDark 
                  ? "bg-[#071629] border-[#0F2B46] text-red-400 hover:bg-red-950/10 hover:border-red-900" 
                  : "bg-white border-[#E5E7EB] text-red-500 hover:bg-red-50 hover:border-red-200"
              )}
              title="Sign Out"
            >
              <LogOut className="w-4 h-4" />
            </button>

          </div>
        </div>
      </nav>

      {/* DYNAMIC JUMBOTRON HERO ZONE */}
      <header 
        className={cn(
          "relative py-16 sm:py-24 border-b overflow-hidden transition-all duration-300",
          isDark 
            ? "bg-[#030B1A] border-[#0F2B46]" 
            : "bg-gradient-to-b from-[#F9FAFB] to-[#FFFFFF] border-[#E5E7EB]"
        )}
      >
        <div className="absolute inset-0 pointer-events-none z-0">
          <div className="absolute inset-0 bg-[linear-gradient(rgba(47,141,70,0.012)_1px,transparent_1px),linear-gradient(90deg,rgba(47,141,70,0.012)_1px,transparent_1px)] bg-[size:32px_32px] opacity-70" />
        </div>

        <div className="max-w-4xl mx-auto text-center px-4 relative z-10 space-y-6">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className={cn(
              "inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full border mb-2",
              isDark 
                ? "bg-[#2F8D46]/10 border-[#2F8D46]/25" 
                : "bg-[#2F8D46]/5 border-[#2F8D46]/15"
            )}
          >
            <Sparkles className="w-3.5 h-3.5 text-[#2F8D46] animate-pulse" />
            <span className="text-[9px] font-mono font-black uppercase tracking-[0.2em] text-[#2F8D46]">
              GEEKSFORGEEKS INTEGRATED COLLEGE LEARNING
            </span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className={cn(
              "text-4xl sm:text-5xl md:text-6xl font-black tracking-tight leading-none italic uppercase",
              isDark ? "text-white" : "text-[#111827]"
            )}
          >
            GFG FREE <span className="text-[#2F8D46] drop-shadow-[0_0_15px_rgba(47,141,70,0.15)]">COURSES HUB</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className={cn(
              "text-xs sm:text-sm md:text-base font-semibold max-w-2xl mx-auto uppercase tracking-wide leading-relaxed",
              isDark ? "text-gray-400" : "text-[#4B5563]"
            )}
          >
            Access curated learning resources, practice platforms, interview preparation, coding roadmaps and career opportunities.
          </motion.p>

          {/* REAL TIME INPUT SEARCH BAR */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="pt-6 max-w-xl mx-auto relative z-10"
          >
            <div className="relative">
              <Search className="absolute left-4.5 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
              <input
                type="text"
                placeholder="Search Resources..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className={cn(
                  "w-full h-14 pl-12 pr-6 rounded-2xl border text-sm font-semibold transition-all focus:outline-none focus:ring-2 focus:ring-[#2F8D46]/45 shadow-sm uppercase tracking-wide",
                  isDark 
                    ? "bg-[#071629] border-[#0F2B46] text-white placeholder-gray-500" 
                    : "bg-white border-[#E5E7EB] text-[#111827] placeholder-gray-400"
                )}
                id="gfg-courses-search-bar"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-mono font-black text-[#2F8D46] uppercase hover:underline"
                >
                  Clear
                </button>
              )}
            </div>
          </motion.div>
        </div>
      </header>

      {/* FILTER CHIPS CONTAINER */}
      <section 
        className={cn(
          "sticky top-18 z-20 py-4 border-b transition-all duration-300 backdrop-blur-md",
          isDark 
            ? "bg-[#030B1A]/95 border-[#0F2B46]" 
            : "bg-[#FFFFFF]/95 border-[#E5E7EB]"
        )}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center space-x-2 overflow-x-auto pb-1 scrollbar-thin scrollbar-thumb-gray-200 scrollbar-track-transparent">
            {CATEGORIES.map((cat) => {
              const isActive = selectedCategory === cat;
              return (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={cn(
                    "px-4.5 py-2 rounded-xl text-[10px] font-mono font-black uppercase tracking-wider transition-all duration-200 cursor-pointer shrink-0 border",
                    isActive
                      ? "bg-[#2F8D46] border-transparent text-white shadow-sm"
                      : isDark
                        ? "bg-[#071629] border-[#0F2B46] text-gray-300 hover:text-[#2F8D46] hover:border-[#2F8D46]/40"
                        : "bg-white border-[#E5E7EB] text-gray-600 hover:text-[#2F8D46]"
                  )}
                >
                  {cat}
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* MAIN VAULT GRID SPACE */}
      <section id="resources-vault-grid" className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-xs font-mono font-black uppercase tracking-widest text-[#2F8D46] flex items-center gap-1.5">
              <span>EXPLORING</span>
              <span className="px-2 py-0.5 rounded-md bg-[#2F8D46]/10 text-[#2F8D46] font-bold text-[9px]">{selectedCategory}</span>
            </h2>
            <p className={cn("text-xs font-semibold uppercase mt-1", isDark ? "text-gray-400" : "text-gray-500")}>
              Showing {filteredResources.length} premium matching materials
            </p>
          </div>
        </div>

        <AnimatePresence mode="popLayout">
          {filteredResources.length === 0 ? (
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className={cn(
                "p-12 rounded-[2rem] border text-center max-w-lg mx-auto mb-10",
                isDark ? "bg-[#071629] border-[#0F2B46]" : "bg-gray-50 border-[#E5E7EB]"
              )}
            >
              <GraduationCap className="w-12 h-12 text-[#2F8D46] mx-auto mb-4 animate-bounce" />
              <h3 className={cn("text-base font-black uppercase tracking-wider", isDark ? "text-white" : "text-gray-900")}>
                No Resources Found
              </h3>
              <p className={cn("text-xs font-semibold leading-relaxed mt-2 uppercase", isDark ? "text-gray-400" : "text-gray-500")}>
                We couldn't find matches for "{searchQuery}" under "{selectedCategory}". Try updating your spelling or search parameters.
              </p>
              <button
                onClick={() => { setSearchQuery(""); setSelectedCategory("All Resources"); }}
                className="mt-6 px-5 py-2.5 bg-[#2F8D46] text-white font-mono text-[10px] font-black uppercase tracking-widest rounded-xl transition-all hover:bg-[#1F6B34]"
              >
                Reset Search Vault
              </button>
            </motion.div>
          ) : (
            <motion.div 
              layout
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
            >
              {filteredResources.map((res, idx) => (
                <motion.div
                  layout
                  key={res.title}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.04 }}
                  whileHover={{ y: -8, transition: { duration: 0.2 } }}
                  className={cn(
                    "group relative rounded-[2rem] p-7 transition-all duration-300 flex flex-col justify-between border shadow-sm hover:shadow-md",
                    isDark 
                      ? "bg-[#071629] border-[#0F2B46] hover:border-[#2F8D46]/80" 
                      : "bg-[#FFFFFF] border-[#E5E7EB] hover:border-[#2F8D46]/80"
                  )}
                  style={{ contentVisibility: "auto" }}
                >
                  {/* Subtle top horizontal green bar that glows on hover */}
                  <div className="absolute top-0 left-0 w-full h-[3px] bg-gradient-to-r from-transparent via-[#2F8D46]/30 to-transparent group-hover:via-[#2F8D46] transition-all duration-300 rounded-t-[2rem]" />

                  <div>
                    {/* Category Badge */}
                    <span className={cn(
                      "inline-block px-2.5 py-1 rounded-lg text-[8.5px] font-mono font-black uppercase tracking-widest border mb-5 select-none",
                      isDark 
                        ? "bg-[#030B1A] border-[#0F2B46] text-[#2F8D46]" 
                        : "bg-[#2F8D46]/5 border-[#2F8D46]/10 text-[#2F8D46]"
                    )}>
                      {res.category}
                    </span>

                    {/* Title */}
                    <h3 className={cn(
                      "text-base sm:text-lg font-black tracking-tight leading-snug uppercase group-hover:text-[#2F8D46] transition-colors font-sans mb-3",
                      isDark ? "text-white" : "text-[#111827]"
                    )}>
                      {res.title}
                    </h3>

                    {/* Short Description */}
                    <p className={cn(
                      "text-[11.5px] leading-relaxed font-semibold mb-6",
                      isDark ? "text-gray-400" : "text-[#4B5563]"
                    )}>
                      {res.description}
                    </p>
                  </div>

                  {/* Open Resource Anchor */}
                  <div className="pt-4 border-t border-dashed border-opacity-10 dark:border-opacity-10 border-gray-400">
                    <a
                      href={res.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center text-[10px] font-mono font-black uppercase text-[#2F8D46] tracking-widest group/link"
                    >
                      <span>Open Resource</span>
                      <ArrowUpRight className="ml-1.5 w-3.5 h-3.5 group-hover/link:translate-x-0.5 group-hover/link:-translate-y-0.5 transition-transform" />
                    </a>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </section>

      {/* LEARNING STATISTICS AREA */}
      <section 
        className={cn(
          "py-20 border-t transition-all duration-300 relative",
          isDark 
            ? "bg-[#051226] border-[#0F2B46]" 
            : "bg-[#F9FAFB] border-[#E5E7EB]"
        )}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 z-10 relative">
          
          <div className="text-center mb-12">
            <h2 className="text-xs font-mono font-black text-[#2F8D46] uppercase tracking-widest">
              ACADEMIC ECOSYSTEM STATISTICS
            </h2>
            <h3 className={cn("text-2xl font-black uppercase tracking-tight mt-1 italic", isDark ? "text-white" : "text-[#111827]")}>
              GFG STUDENT CHAPTER BY THE NUMBERS
            </h3>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            
            {/* Stat Item 1 */}
            <div className={cn(
              "p-6 rounded-[2rem] text-center border relative overflow-hidden",
              isDark ? "bg-[#071629] border-[#0F2B46]" : "bg-[#FFFFFF] border-[#E5E7EB]"
            )}>
              <span className={cn("text-xs font-mono uppercase font-black block tracking-wider", isDark ? "text-gray-400" : "text-gray-500")}>
                Resources Available
              </span>
              <strong className="text-4xl sm:text-5xl font-black italic text-[#2F8D46] tracking-tight block mt-2">
                17+
              </strong>
            </div>

            {/* Stat Item 2 */}
            <div className={cn(
              "p-6 rounded-[2rem] text-center border relative overflow-hidden",
              isDark ? "bg-[#071629] border-[#0F2B46]" : "bg-[#FFFFFF] border-[#E5E7EB]"
            )}>
              <span className={cn("text-xs font-mono uppercase font-black block tracking-wider", isDark ? "text-gray-400" : "text-gray-500")}>
                Categories
              </span>
              <strong className="text-4xl sm:text-5xl font-black italic text-[#2F8D46] tracking-tight block mt-2">
                7
              </strong>
            </div>

            {/* Stat Item 3 */}
            <div className={cn(
              "p-6 rounded-[2rem] text-center border relative overflow-hidden",
              isDark ? "bg-[#071629] border-[#0F2B46]" : "bg-[#FFFFFF] border-[#E5E7EB]"
            )}>
              <span className={cn("text-xs font-mono uppercase font-black block tracking-wider", isDark ? "text-gray-400" : "text-gray-500")}>
                Learning Partners
              </span>
              <strong className="text-2xl sm:text-3xl font-black uppercase text-[#2F8D46] tracking-tight block mt-4 leading-tight">
                GeeksforGeeks
              </strong>
            </div>

            {/* Stat Item 4 */}
            <div className={cn(
              "p-6 rounded-[2rem] text-center border relative overflow-hidden",
              isDark ? "bg-[#071629] border-[#0F2B46]" : "bg-[#FFFFFF] border-[#E5E7EB]"
            )}>
              <span className={cn("text-xs font-mono uppercase font-black block tracking-wider", isDark ? "text-gray-400" : "text-gray-500")}>
                Student Chapter
              </span>
              <strong className="text-xl sm:text-2xl font-black uppercase text-[#2F8D46] tracking-tight block mt-4 leading-tight">
                Marwadi University
              </strong>
            </div>

          </div>
        </div>
      </section>

      {/* QUICK ACCESS BANNER CTA ELEMENT */}
      <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 z-10 relative">
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="relative p-10 md:p-14 rounded-[2.5rem] bg-gradient-to-br from-[#2F8D46] via-[#1F6B34] to-[#0A3D18] text-white overflow-hidden shadow-xl flex flex-col md:flex-row items-center justify-between gap-8 text-center md:text-left"
        >
          {/* Subtle logo vector layer in background */}
          <div className="absolute right-[-40px] bottom-[-40px] opacity-10 pointer-events-none">
            <GraduationCap className="w-80 h-80" />
          </div>

          <div className="space-y-4 max-w-2xl relative z-10">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold uppercase italic tracking-tight leading-tight">
              Ready to Start Learning?
            </h2>
            <p className="text-gray-100 text-xs sm:text-sm font-semibold leading-relaxed">
              Access coding courses, interview prep, practice questions and placement resources.
            </p>
          </div>

          <button
            onClick={scrollToResources}
            className="group/cta shrink-0 px-8 py-4.5 bg-white text-[#2F8D46] font-mono font-black rounded-2xl hover:bg-opacity-95 hover:shadow-lg transition-all duration-300 flex items-center justify-center text-xs uppercase tracking-[0.15em] relative overflow-hidden"
          >
            <span>Explore All Resources</span>
            <ArrowRight className="ml-2 w-4 h-4 group-hover/cta:translate-x-1 transition-transform" />
          </button>
        </motion.div>
      </section>

      {/* COMPACT DASHBOARD FOOTER */}
      <footer 
        className={cn(
          "py-10 border-t text-center transition-all duration-300 relative z-10",
          isDark 
            ? "bg-[#030B1A] border-[#0F2B46]" 
            : "bg-white border-[#E5E7EB]"
        )}
      >
        <p className={cn("text-[9px] font-black uppercase tracking-[0.3em] mb-2", isDark ? "text-gray-500" : "text-gray-400")}>
          © {new Date().getFullYear()} GFG Student Chapter @ Marwadi University. Redesigned Courses Hub.
        </p>
        <p className="text-[#2F8D46] text-[8px] font-black uppercase tracking-[0.5em] opacity-85">
          Powered by GeeksforGeeks
        </p>
      </footer>

    </div>
  );
}
