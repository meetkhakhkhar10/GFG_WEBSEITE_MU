import React, { useState, useMemo } from "react";
import { 
  BookOpen, GraduationCap, Terminal, Trophy, Briefcase, 
  MessageSquare, Table, Network, TrendingUp, Layers, 
  Cpu, Code, Globe, Brain, Zap, FileText, Award, 
  Search, ArrowUpRight, CheckCircle, Sparkles
} from "lucide-react";

// Curated 17 resources
const resourcesData = [
  // Courses
  {
    category: "Courses",
    title: "All GeeksforGeeks Courses",
    description: "Explore the comprehensive GeeksforGeeks technical library across domains.",
    link: "https://practice.geeksforgeeks.org/courses",
    icon: BookOpen
  },
  {
    category: "Courses",
    title: "DSA Self-Paced Course",
    description: "Master foundational data structures and algorithms with curated video lectures and problems.",
    link: "https://www.geeksforgeeks.org/courses/dsa-self-paced",
    icon: GraduationCap
  },
  // Practice
  {
    category: "Practice",
    title: "Interactive Practice Problems",
    description: "Solve thousands of handpicked coding problems graded from basic to advanced difficulty.",
    link: "https://practice.geeksforgeeks.org/explore?page=1",
    icon: Terminal
  },
  {
    category: "Practice",
    title: "Competitive Programming Guide",
    description: "Prepare for high-level programming contests, ICPC, and regional coding challenges.",
    link: "https://www.geeksforgeeks.org/competitive-programming-a-complete-guide/",
    icon: Trophy
  },
  // Interview Prep
  {
    category: "Interview Preparation",
    title: "Interview Preparation Course",
    description: "Structured roadmaps designed for cracking top tier software development interviews.",
    link: "https://www.geeksforgeeks.org/courses/interview-preparation-course",
    icon: Briefcase
  },
  {
    category: "Interview Preparation",
    title: "Real Interview Experiences",
    description: "Read first-hand interview experiences shared by candidates across global tech companies.",
    link: "https://www.geeksforgeeks.org/company-interview-corner/",
    icon: MessageSquare
  },
  {
    category: "Interview Preparation",
    title: "Curated SDE Sheet",
    description: "High-frequency problem sheet targeted for software engineering campus and lateral placements.",
    link: "https://www.geeksforgeeks.org/sde-sheet-a-complete-guide-for-sde-preparation/",
    icon: Table
  },
  // DSA
  {
    category: "DSA",
    title: "Data Structures Encyclopedia",
    description: "Deep-dive tutorials covering linear and non-linear memory representations.",
    link: "https://www.geeksforgeeks.org/data-structures/",
    icon: Network
  },
  {
    category: "DSA",
    title: "Algorithms Handbook",
    description: "Learn sorting, searching, dynamic programming, backtracking, and greedy algorithms.",
    link: "https://www.geeksforgeeks.org/fundamentals-of-algorithms/",
    icon: TrendingUp
  },
  // Programming Languages
  {
    category: "Programming Languages",
    title: "Python Master Track",
    description: "From syntax essentials to asynchronous pipelines and web scripting in Python.",
    link: "https://www.geeksforgeeks.org/python-programming-language/",
    icon: Layers
  },
  {
    category: "Programming Languages",
    title: "Java Core & Enterprise",
    description: "Object-oriented architectures, JVM internals, concurrency, and Spring fundamentals.",
    link: "https://www.geeksforgeeks.org/java/",
    icon: Cpu
  },
  {
    category: "Programming Languages",
    title: "Modern C++ Programming",
    description: "STL memory management, pointers, templates, and high-performance competitive coding.",
    link: "https://www.geeksforgeeks.org/c-plus-plus/",
    icon: Code
  },
  {
    category: "Programming Languages",
    title: "Full-Stack Web Development",
    description: "Frontend HTML/CSS/JavaScript, React frameworks, RESTful APIs, and relational databases.",
    link: "https://www.geeksforgeeks.org/web-development/",
    icon: Globe
  },
  {
    category: "Programming Languages",
    title: "Machine Learning & AI",
    description: "Mathematical foundations of machine learning, neural networks, and model deployment.",
    link: "https://www.geeksforgeeks.org/machine-learning/",
    icon: Brain
  },
  // Career & Jobs
  {
    category: "Career & Jobs",
    title: "Job-A-Thon Hiring Challenges",
    description: "Monthly hiring challenges for college students and recent graduates looking for roles.",
    link: "https://www.geeksforgeeks.org/job-a-thon-hiring-challenge/",
    icon: Zap
  },
  {
    category: "Career & Jobs",
    title: "Technical Engineering Blogs",
    description: "Industry trends, architectural deep-dives, and peer-authored technical essays.",
    link: "https://www.geeksforgeeks.org/blogs/",
    icon: FileText
  },
  // Student Programs
  {
    category: "Student Programs",
    title: "Campus Mantri Program",
    description: "Lead your university's student tech circle with GeeksforGeeks institutional support.",
    link: "https://www.geeksforgeeks.org/campus-mantri/",
    icon: Award
  }
];

const categoryTabs = [
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
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("All Resources");

  const filteredResources = useMemo(() => {
    return resourcesData.filter((item) => {
      const matchCategory =
        activeCategory === "All Resources" || item.category === activeCategory;
      const matchSearch =
        item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.category.toLowerCase().includes(searchQuery.toLowerCase());
      return matchCategory && matchSearch;
    });
  }, [activeCategory, searchQuery]);

  return (
    <div className="bg-[#F4F4F0] min-h-screen text-[#111318] select-none">
      
      {/* Background Architectural Grid */}
      <div className="absolute inset-0 bg-technical-grid opacity-50 pointer-events-none" />

      {/* HEADER SECTION */}
      <section className="relative py-16 md:py-24 border-b border-[#E2E2DC] bg-[#F4F4F0]">
        <div className="max-w-[1400px] mx-auto px-6 relative z-10 w-full">
          
          <div className="flex flex-wrap items-center justify-between border-b border-[#E2E2DC] pb-4 mb-10 font-mono text-[10px] uppercase tracking-[0.25em] text-[#8B9198]">
            <div className="flex items-center space-x-2">
              <span className="text-[#00A86B] font-bold">06 / CURRICULUM CATALOG</span>
              <span>·</span>
              <span className="text-[#111318]">LEARNING PATHWAYS</span>
            </div>
            <div>POWERED BY GEEKSFORGEEKS</div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-end">
            <div className="lg:col-span-8 space-y-4">
              <h1 className="font-editorial text-4xl sm:text-6xl lg:text-7xl font-black text-[#111318] tracking-tight leading-[0.98]">
                Courses & Technical <br />
                <span className="font-editorial-italic font-normal text-[#00A86B]">
                  Learning Roadmaps
                </span>
              </h1>
              <p className="font-sans text-sm sm:text-base text-[#555B63] max-w-2xl leading-relaxed border-l-2 border-[#111318] pl-4">
                Structured GeeksforGeeks roadmaps, algorithmic problem archives, interview prep sheets, 
                and programming languages curated specifically for Marwadi University students.
              </p>
            </div>

            <div className="lg:col-span-4 font-mono text-[11px] space-y-2 bg-[#FFFFFF] border border-[#E2E2DC] p-5 shadow-sm">
              <div className="flex justify-between border-b border-[#E2E2DC] pb-2 text-[#8B9198]">
                <span>CURATED TRACKS</span>
                <span className="text-[#00A86B] font-bold">17 Core Modules</span>
              </div>
              <div className="flex justify-between border-b border-[#E2E2DC] pb-2 text-[#8B9198]">
                <span>ACADEMIC AFFILIATION</span>
                <span className="text-[#111318]">Marwadi University</span>
              </div>
              <div className="flex justify-between text-[#8B9198]">
                <span>ACCESS</span>
                <span className="text-[#111318]">Free & Direct Links</span>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* SEARCH AND CATEGORY FILTER TOOLBAR */}
      <section className="py-8 border-b border-[#E2E2DC] bg-[#FAF9F5] sticky top-16 z-20 backdrop-blur-md bg-[#FAF9F5]/90">
        <div className="max-w-[1400px] mx-auto px-6 w-full space-y-4">
          
          {/* Search bar */}
          <div className="flex items-center border border-[#E2E2DC] bg-[#FFFFFF] px-4 py-3 focus-within:border-[#111318] transition-colors">
            <Search className="w-4 h-4 text-[#8B9198] mr-3 shrink-0" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search curriculum, data structures, languages, SDE sheets..."
              className="w-full bg-transparent text-[#111318] font-sans text-xs sm:text-sm focus:outline-none placeholder:text-[#8B9198]"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="font-mono text-[10px] uppercase text-[#8B9198] hover:text-[#111318]"
              >
                CLEAR
              </button>
            )}
          </div>

          {/* Category Tabs */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none font-mono text-[10px] uppercase tracking-wider">
            {categoryTabs.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-3.5 py-1.5 transition-colors whitespace-nowrap cursor-pointer border ${
                  activeCategory === cat
                    ? "bg-[#111318] text-[#F4F4F0] border-[#111318]"
                    : "bg-[#FFFFFF] text-[#555B63] border-[#E2E2DC] hover:border-[#111318] hover:text-[#111318]"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

        </div>
      </section>

      {/* CATALOG GRID */}
      <section className="py-16 md:py-24 bg-[#F4F4F0]">
        <div className="max-w-[1400px] mx-auto px-6 w-full">
          
          <div className="flex items-center justify-between pb-4 mb-10 border-b border-[#E2E2DC]">
            <div className="font-mono text-xs uppercase tracking-widest text-[#111318] font-bold">
              SHOWING {filteredResources.length} MODULES
            </div>
            <div className="font-mono text-xs text-[#8B9198]">
              OFFICIAL GFG PLATFORM
            </div>
          </div>

          {filteredResources.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredResources.map((item, idx) => {
                const Icon = item.icon;
                return (
                  <a
                    key={item.title + idx}
                    href={item.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-[#FFFFFF] border border-[#E2E2DC] p-7 flex flex-col justify-between hover:border-[#111318] transition-colors shadow-[0_4px_20px_rgba(17,19,24,0.03)] group"
                  >
                    <div>
                      <div className="flex items-center justify-between font-mono text-[10px] text-[#8B9198] pb-4 mb-4 border-b border-[#E2E2DC]">
                        <span className="text-[#00A86B] font-bold">{item.category}</span>
                        <Icon className="w-4 h-4 text-[#111318] group-hover:text-[#00A86B] transition-colors" />
                      </div>

                      <h3 className="font-editorial text-xl font-bold text-[#111318] tracking-tight group-hover:text-[#00A86B] transition-colors mb-2 leading-snug">
                        {item.title}
                      </h3>

                      <p className="font-sans text-xs text-[#555B63] leading-relaxed">
                        {item.description}
                      </p>
                    </div>

                    <div className="pt-6 border-t border-[#E2E2DC] mt-6 flex items-center justify-between font-mono text-[10px] uppercase tracking-wider text-[#111318] group-hover:text-[#00A86B]">
                      <span>Open GeeksforGeeks Portal</span>
                      <ArrowUpRight className="w-3.5 h-3.5" />
                    </div>
                  </a>
                );
              })}
            </div>
          ) : (
            <div className="p-16 bg-[#FFFFFF] border border-[#E2E2DC] text-center space-y-3 max-w-md mx-auto">
              <p className="font-editorial text-xl text-[#111318]">No Matching Modules</p>
              <p className="font-mono text-xs text-[#8B9198]">Try selecting "All Resources" or clearing the search term.</p>
              <button
                onClick={() => {
                  setSearchQuery("");
                  setActiveCategory("All Resources");
                }}
                className="px-4 py-2 bg-[#111318] text-[#F4F4F0] font-mono text-xs uppercase"
              >
                Reset Filter
              </button>
            </div>
          )}

        </div>
      </section>

    </div>
  );
}
