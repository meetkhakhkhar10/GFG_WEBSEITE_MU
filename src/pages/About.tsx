import React from "react";
import { Link } from "react-router-dom";
import { 
  Building2, Award, BookOpen, Code2, Calendar, Users, 
  Sparkles, ArrowRight, ArrowUpRight, CheckCircle, Target, Lightbulb, Rocket 
} from "lucide-react";
import PaperTiles from "../components/PaperTiles";
import JourneyTrack from "../components/JourneyTrack";

export default function About() {
  const pillars = [
    {
      num: "01",
      title: "Algorithmic Rigor",
      desc: "Structured preparation in data structures, time complexity analysis, graph traversals, and dynamic programming.",
      icon: Code2,
    },
    {
      num: "02",
      title: "National Hackathons",
      desc: "Hosting and participating in flagship hackathons like Intellify with nationwide collegiate participation.",
      icon: Award,
    },
    {
      num: "03",
      title: "Open Knowledge Sharing",
      desc: "Regular coding masterclasses, technical webinars, and study circles driven by senior campus mentors.",
      icon: BookOpen,
    },
    {
      num: "04",
      title: "Industry Trajectory",
      desc: "Curated interview experiences, resume clinics, and direct guidance for top-tier software engineering roles.",
      icon: Target,
    }
  ];

  return (
    <div className="bg-[#F4F4F0] min-h-screen text-[#111318] select-none">
      
      {/* Background Architectural Grid */}
      <div className="absolute inset-0 bg-technical-grid opacity-50 pointer-events-none" />

      {/* HEADER SECTION */}
      <section className="relative py-16 md:py-24 border-b border-[#E2E2DC] bg-[#F4F4F0]">
        <div className="max-w-[1400px] mx-auto px-6 relative z-10 w-full">
          
          <div className="flex flex-wrap items-center justify-between border-b border-[#E2E2DC] pb-4 mb-10 font-mono text-[10px] uppercase tracking-[0.25em] text-[#8B9198]">
            <div className="flex items-center space-x-2">
              <span className="text-[#00A86B] font-bold">04 / INSTITUTIONAL PROSPECTUS</span>
              <span>·</span>
              <span className="text-[#111318]">CHAPTER FOUNDATION</span>
            </div>
            <div>EST. RAJKOT, GUJARAT</div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-end">
            <div className="lg:col-span-8 space-y-4">
              <h1 className="font-editorial text-4xl sm:text-6xl lg:text-7xl font-black text-[#111318] tracking-tight leading-[0.98]">
                Bridging Academia & <br />
                <span className="font-editorial-italic font-normal text-[#00A86B]">
                  Developer Culture
                </span>
              </h1>
              <p className="font-sans text-sm sm:text-base text-[#555B63] max-w-2xl leading-relaxed border-l-2 border-[#111318] pl-4">
                The official GeeksforGeeks Student Chapter at Marwadi University was established to cultivate 
                world-class software engineers through continuous peer learning, competitive coding, and open-source innovation.
              </p>
            </div>

            <div className="lg:col-span-4 font-mono text-[11px] space-y-2 bg-[#FFFFFF] border border-[#E2E2DC] p-5 shadow-sm">
              <div className="flex justify-between border-b border-[#E2E2DC] pb-2 text-[#8B9198]">
                <span>CAMPUS STATUS</span>
                <span className="text-[#00A86B] font-bold">NAAC A+ ACCREDITED</span>
              </div>
              <div className="flex justify-between border-b border-[#E2E2DC] pb-2 text-[#8B9198]">
                <span>ESTABLISHED</span>
                <span className="text-[#111318]">Marwadi University</span>
              </div>
              <div className="flex justify-between text-[#8B9198]">
                <span>NETWORK</span>
                <span className="text-[#111318]">GeeksforGeeks Student Guild</span>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* MARWADI UNIVERSITY ECOSYSTEM */}
      <section className="py-16 md:py-24 border-b border-[#E2E2DC] bg-[#FAF9F5]">
        <div className="max-w-[1400px] mx-auto px-6 relative z-10 w-full">
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            <div className="lg:col-span-6 space-y-4">
              <div className="flex items-center justify-between font-mono text-[9px] uppercase tracking-widest text-[#8B9198]">
                <span>CAMPUS ATLAS / MARWADI UNIVERSITY</span>
                <span className="text-[#00A86B]">RAJKOT, INDIA</span>
              </div>

              <PaperTiles
                src="https://img-cdn.publive.online/fit-in/1280x960/filters:format(webp)/smstreet/media/media_files/2025/11/19/marwadi-university-2025-11-19-15-33-18.jpg"
                alt="Marwadi University Campus, Rajkot"
                stripsCount={4}
                tag="CAMPUS OVERVIEW"
                overlayBadge="MARWADI UNIVERSITY · 52-ACRE TECH ENVIRONMENT"
                aspectClassName="aspect-[16/10]"
              />
            </div>

            <div className="lg:col-span-6 space-y-6">
              <div className="font-mono text-[10px] uppercase tracking-[0.25em] text-[#00A86B] font-bold">
                01 / INSTITUTIONAL CONTEXT
              </div>

              <h2 className="font-editorial text-3xl sm:text-5xl font-black text-[#111318] tracking-tight leading-tight">
                An Ecosystem for Technical Rigor
              </h2>

              <p className="font-sans text-sm sm:text-base text-[#555B63] leading-relaxed">
                Marwadi University is accredited with the highest NAAC A+ grade and recognized as a leading 
                hub for technical education in western India. Covering 52 acres, the campus houses state-of-the-art 
                computing laboratories, supercomputing facilities, and innovation centers where students transform theoretical computer science into production software.
              </p>

              <div className="grid grid-cols-2 gap-4 font-mono text-xs pt-2">
                <div className="p-4 bg-[#FFFFFF] border border-[#E2E2DC]">
                  <div className="text-2xl font-black font-editorial text-[#111318]">NAAC A+</div>
                  <div className="text-[10px] text-[#8B9198] uppercase mt-1">Institutional Accreditation</div>
                </div>
                <div className="p-4 bg-[#FFFFFF] border border-[#E2E2DC]">
                  <div className="text-2xl font-black font-editorial text-[#00A86B]">52+ Acres</div>
                  <div className="text-[10px] text-[#8B9198] uppercase mt-1">High-Tech Campus</div>
                </div>
              </div>

              <div className="pt-2">
                <a
                  href="https://www.marwadiuniversity.ac.in/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-6 py-3.5 bg-[#111318] hover:bg-[#00A86B] text-[#F4F4F0] font-mono text-xs uppercase tracking-widest transition-colors inline-flex items-center space-x-2"
                >
                  <span>Explore University Portal</span>
                  <ArrowUpRight className="w-4 h-4" />
                </a>
              </div>
            </div>

          </div>

        </div>
      </section>

      {/* CORE MISSION PILLARS */}
      <section className="py-20 md:py-28 border-b border-[#E2E2DC] bg-[#F4F4F0]">
        <div className="max-w-[1400px] mx-auto px-6 relative z-10 w-full">
          
          <div className="flex flex-col sm:flex-row sm:items-end justify-between pb-6 mb-12 border-b border-[#E2E2DC] gap-4">
            <div>
              <div className="font-mono text-[10px] uppercase tracking-[0.25em] text-[#00A86B] font-bold mb-2">
                02 / PHILOSOPHICAL TENETS
              </div>
              <h2 className="font-editorial text-4xl sm:text-5xl font-black text-[#111318] tracking-tight">
                Our Four Pillars
              </h2>
            </div>
            <p className="font-mono text-xs text-[#8B9198] max-w-sm">
              The foundational principles guiding every workshop, contest, and curriculum sprint we deliver.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {pillars.map((pillar) => {
              const Icon = pillar.icon;
              return (
                <div
                  key={pillar.num}
                  className="bg-[#FFFFFF] border border-[#E2E2DC] p-8 flex flex-col justify-between hover:border-[#111318] transition-colors shadow-[0_4px_20px_rgba(17,19,24,0.03)] group"
                >
                  <div>
                    <div className="flex items-center justify-between font-mono text-[10px] text-[#8B9198] pb-4 mb-6 border-b border-[#E2E2DC]">
                      <span className="font-bold text-[#111318]">{pillar.num}</span>
                      <Icon className="w-4 h-4 text-[#00A86B]" />
                    </div>

                    <h3 className="font-editorial text-2xl font-bold text-[#111318] tracking-tight group-hover:text-[#00A86B] transition-colors mb-3">
                      {pillar.title}
                    </h3>

                    <p className="font-sans text-xs text-[#555B63] leading-relaxed">
                      {pillar.desc}
                    </p>
                  </div>

                  <div className="pt-6 border-t border-[#E2E2DC] mt-8 font-mono text-[10px] uppercase tracking-wider text-[#8B9198]">
                    CHAPTER DIRECTIVE
                  </div>
                </div>
              );
            })}
          </div>

        </div>
      </section>

      {/* HISTORIC CHAPTER JOURNEY TRACK */}
      <section className="py-20 md:py-28 border-b border-[#E2E2DC] bg-[#FAF9F5]">
        <div className="max-w-[1400px] mx-auto px-6 relative z-10 w-full">
          
          <div className="flex items-center justify-between pb-4 mb-12 border-b border-[#E2E2DC]">
            <div className="font-mono text-xs uppercase tracking-widest text-[#111318] font-bold">
              03 / HISTORICAL MILESTONES
            </div>
            <div className="font-mono text-xs text-[#8B9198]">
              CHRONOLOGY OF GROWTH
            </div>
          </div>

          <div className="bg-[#FFFFFF] border border-[#E2E2DC] p-6 sm:p-12 shadow-[0_4px_20px_rgba(17,19,24,0.03)]">
            <JourneyTrack />
          </div>

        </div>
      </section>

      {/* DISPATCH CALLOUT */}
      <section className="py-20 bg-[#111318] text-[#F4F4F0] select-none">
        <div className="max-w-[1400px] mx-auto px-6 w-full">
          <div className="flex flex-col md:flex-row items-center justify-between gap-8 border-l-2 border-[#00A86B] pl-6">
            <div className="space-y-2">
              <span className="font-mono text-[10px] uppercase tracking-[0.25em] text-[#00A86B]">
                ENGAGE WITH US
              </span>
              <h3 className="font-editorial text-3xl sm:text-4xl font-bold">
                Connect with the Marwadi University Chapter
              </h3>
              <p className="font-sans text-xs sm:text-sm text-[#8B9198] max-w-xl">
                Whether you're looking to collaborate on a hackathon, deliver a guest workshop, or join our community circles, our doors are always open.
              </p>
            </div>

            <Link
              to="/contact"
              className="px-8 py-4 bg-[#00A86B] hover:bg-[#FFFFFF] text-[#111318] font-mono text-xs uppercase tracking-widest transition-colors inline-flex items-center space-x-2 shrink-0"
            >
              <span>Contact Bureau</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

    </div>
  );
}
