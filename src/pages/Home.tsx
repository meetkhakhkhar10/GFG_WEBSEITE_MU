import { motion } from "motion/react";
import { ArrowRight, ArrowUpRight, Sparkles, Building2, Layers, Code, Terminal, Brain, Check } from "lucide-react";
import { Link } from "react-router-dom";
import Hero from "../components/Hero";
import UpcomingEventSpotlight from "../components/UpcomingEventSpotlight";
import FeaturedCourses from "../components/FeaturedCourses";
import EditorialImage from "../components/EditorialImage";

export default function Home() {
  return (
    <div className="bg-[#F4F4F0] text-[#111318] overflow-hidden min-h-screen select-none">
      
      {/* 01. EDITORIAL ASYMMETRIC HERO */}
      <Hero />

      {/* 02. DYNAMIC GOOGLE APPS SCRIPT LIVE EVENT SPOTLIGHT */}
      <UpcomingEventSpotlight />

      {/* 03. CURATED GEEKSFORGEEKS ACADEMY PATHWAYS */}
      <FeaturedCourses />

      {/* 04. INSTITUTIONAL CONTEXT: MARWADI UNIVERSITY & CHAPTER */}
      <section className="py-20 md:py-28 border-b border-[#E2E2DC] bg-[#FAF9F5] relative overflow-hidden">
        <div className="max-w-[1400px] mx-auto px-6 relative z-10 w-full">
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
            
            {/* Left 6 Cols: Architectural Image with Editorial Photo System */}
            <div className="lg:col-span-6 space-y-4">
              <div className="relative">
                <EditorialImage
                  src="https://img-cdn.publive.online/fit-in/1280x960/filters:format(webp)/smstreet/media/media_files/2025/11/19/marwadi-university-2025-11-19-15-33-18.jpg"
                  alt="Marwadi University Campus, Rajkot"
                  variant="photo"
                  headerLeft="FIG 02. / CAMPUS INFRASTRUCTURE"
                  headerRight="NAAC A+ ACCREDITED"
                  figLabel="ACADEMIC HUB"
                  figNumber="FIG.4-P"
                  caption="MARWADI UNIVERSITY CAMPUS · 52+ ACRE TECH PARK"
                  aspectClassName="aspect-[16/10]"
                />

                <div className="absolute -bottom-4 -right-4 bg-[#FFFFFF] border border-[#E2E2DC] p-4 shadow-sm hidden sm:block">
                  <div className="font-editorial text-2xl font-black text-[#111318]">NAAC A+</div>
                  <div className="font-mono text-[9px] uppercase tracking-widest text-[#00A86B]">
                    Highest Institutional Grade
                  </div>
                </div>
              </div>
            </div>

            {/* Right 6 Cols: Editorial Narrative */}
            <div className="lg:col-span-6 space-y-6">
              
              <div className="inline-flex items-center space-x-2 font-mono text-[10px] uppercase tracking-[0.25em] text-[#00A86B] font-bold">
                <span className="w-1.5 h-1.5 rounded-full bg-[#00A86B] animate-pulse" />
                <span>04 / INSTITUTIONAL COLLABORATION</span>
              </div>

              <h2 className="font-editorial text-3xl sm:text-5xl font-black text-[#111318] tracking-tight leading-[1.05]">
                Engineering Excellence at Marwadi University
              </h2>

              <p className="font-sans text-sm sm:text-base text-[#555B63] leading-relaxed border-l-2 border-[#111318] pl-5">
                Marwadi University provides a 52-acre state-of-the-art technical ecosystem in Rajkot, Gujarat. 
                Our GeeksforGeeks Chapter acts as an active bridge between foundational academics and modern industry requirements—training 
                students in algorithmic rigor, cloud architectures, and open-source craftsmanship.
              </p>

              {/* Technical Campus Pillars */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-2 font-mono text-[11px]">
                <div className="p-3 bg-[#FFFFFF] border border-[#E2E2DC]">
                  <span className="text-[9px] text-[#8B9198] block uppercase">COMMUNITY</span>
                  <span className="font-semibold text-[#111318]">600+ Members</span>
                </div>
                <div className="p-3 bg-[#FFFFFF] border border-[#E2E2DC]">
                  <span className="text-[9px] text-[#8B9198] block uppercase">ACCREDITATION</span>
                  <span className="font-semibold text-[#00A86B]">NAAC A+ Grade</span>
                </div>
                <div className="p-3 bg-[#FFFFFF] border border-[#E2E2DC] col-span-2 sm:col-span-1">
                  <span className="text-[9px] text-[#8B9198] block uppercase">COLLABORATION</span>
                  <span className="font-semibold text-[#111318]">Official Chapter</span>
                </div>
              </div>

              <div className="flex items-center gap-4 pt-2">
                <a
                  href="https://www.marwadiuniversity.ac.in/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-6 py-3.5 bg-[#111318] hover:bg-[#00A86B] text-[#F4F4F0] font-mono text-xs uppercase tracking-widest transition-colors inline-flex items-center space-x-2"
                >
                  <span>University Portal</span>
                  <ArrowUpRight className="w-4 h-4" />
                </a>

                <Link
                  to="/about"
                  className="px-6 py-3.5 bg-transparent hover:bg-[#FFFFFF] border border-[#111318] text-[#111318] font-mono text-xs uppercase tracking-widest transition-colors inline-flex items-center space-x-2"
                >
                  <span>Chapter History</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>

            </div>

          </div>

        </div>
      </section>

      {/* 05. CORE ENGINEERING DOMAINS */}
      <section className="py-20 md:py-28 border-b border-[#E2E2DC] bg-[#F4F4F0] relative overflow-hidden">
        <div className="max-w-[1400px] mx-auto px-6 relative z-10 w-full">
          
          <div className="flex flex-col sm:flex-row sm:items-end justify-between pb-6 mb-12 border-b border-[#E2E2DC] gap-4">
            <div>
              <div className="font-mono text-[10px] uppercase tracking-[0.25em] text-[#00A86B] font-bold mb-2">
                05 / LABORATORY DOMAINS
              </div>
              <h2 className="font-editorial text-4xl sm:text-5xl font-black text-[#111318] tracking-tight">
                Focus Areas
              </h2>
            </div>
            <p className="font-mono text-xs text-[#8B9198] max-w-sm">
              Continuous peer-led masterclasses, code sprints, and hackathons hosted inside Marwadi University campus labs.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                num: "01",
                title: "Software Engineering",
                desc: "Clean architecture, distributed systems, domain-driven design, and performant backend APIs.",
                icon: Layers,
                url: "https://www.geeksforgeeks.org/software-engineering/software-engineering/"
              },
              {
                num: "02",
                title: "Full-Stack Web",
                desc: "Modern reactive interfaces, Node/TypeScript microservices, relational databases, and edge runtimes.",
                icon: Code,
                url: "https://www.geeksforgeeks.org/web-tech/web-technology/"
              },
              {
                num: "03",
                title: "Competitive Coding",
                desc: "Data structures, graph theory, dynamic programming, and high-cadence ICPC/CodeJam preparation.",
                icon: Terminal,
                url: "https://www.geeksforgeeks.org/dsa/competitive-programming-a-complete-guide/"
              },
              {
                num: "04",
                title: "Machine Intelligence",
                desc: "LLMs, vector indexing, fine-tuning open weights, predictive analytics, and computer vision models.",
                icon: Brain,
                url: "https://www.geeksforgeeks.org/machine-learning/ai-ml-and-data-science-tutorial-learn-ai-ml-and-data-science/"
              }
            ].map((domain, i) => {
              const Icon = domain.icon;
              return (
                <a
                  key={domain.num}
                  href={domain.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-[#FFFFFF] border border-[#E2E2DC] p-6 hover:border-[#111318] transition-colors flex flex-col justify-between group shadow-[0_4px_20px_rgba(17,19,24,0.03)]"
                >
                  <div>
                    <div className="flex items-center justify-between pb-4 mb-4 border-b border-[#E2E2DC] font-mono text-[10px] text-[#8B9198]">
                      <span className="font-bold text-[#111318]">{domain.num}</span>
                      <Icon className="w-4 h-4 text-[#00A86B]" />
                    </div>

                    <h3 className="font-editorial text-xl font-bold text-[#111318] tracking-tight mb-3 group-hover:text-[#00A86B] transition-colors">
                      {domain.title}
                    </h3>

                    <p className="font-sans text-xs text-[#555B63] leading-relaxed mb-6">
                      {domain.desc}
                    </p>
                  </div>

                  <div className="flex items-center justify-between pt-4 border-t border-[#E2E2DC] font-mono text-[10px] uppercase tracking-wider text-[#111318] group-hover:text-[#00A86B]">
                    <span>Curriculum Docs</span>
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  </div>
                </a>
              );
            })}
          </div>

        </div>
      </section>

      {/* 06. COMMUNITY DISPATCH & MEMBERSHIP */}
      <section className="py-20 md:py-28 bg-[#111318] text-[#F4F4F0] relative overflow-hidden select-none">
        
        {/* Subtle grid on dark */}
        <div className="absolute inset-0 bg-technical-grid opacity-10 pointer-events-none" />

        <div className="max-w-[1400px] mx-auto px-6 relative z-10 w-full">
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            <div className="lg:col-span-8 space-y-6">
              
              <div className="inline-flex items-center space-x-2 font-mono text-[10px] uppercase tracking-[0.25em] text-[#00A86B]">
                <span className="w-1.5 h-1.5 rounded-full bg-[#00A86B] animate-ping" />
                <span>06 / CHAPTER ADMISSIONS</span>
              </div>

              <h2 className="font-editorial text-4xl sm:text-6xl font-black tracking-tight leading-[1]">
                Join the Marwadi University <br />
                <span className="font-editorial-italic font-normal text-[#00A86B]">
                  GeeksforGeeks Circle
                </span>
              </h2>

              <p className="font-sans text-sm sm:text-base text-[#8B9198] max-w-2xl leading-relaxed">
                Connect with 600+ developers, participate in university hackathons, access curated interview preparation roadmaps, and build projects alongside senior campus mentors.
              </p>

            </div>

            <div className="lg:col-span-4 flex flex-col sm:flex-row lg:flex-col gap-4">
              <a
                href="https://chat.whatsapp.com/F7RcXCTLYJ4Ije5NiL6sDM"
                target="_blank"
                rel="noopener noreferrer"
                className="px-8 py-4.5 bg-[#00A86B] hover:bg-[#FFFFFF] text-[#111318] font-mono text-xs uppercase tracking-widest transition-colors flex items-center justify-center space-x-2 text-center"
              >
                <span>[ JOIN WHATSAPP CIRCLE ]</span>
                <ArrowUpRight className="w-4 h-4" />
              </a>

              <Link
                to="/team"
                className="px-8 py-4.5 bg-transparent hover:bg-white/5 border border-white/20 text-[#F4F4F0] font-mono text-xs uppercase tracking-widest transition-colors flex items-center justify-center space-x-2 text-center"
              >
                <span>Meet Campus Leadership</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

          </div>

        </div>
      </section>

    </div>
  );
}
