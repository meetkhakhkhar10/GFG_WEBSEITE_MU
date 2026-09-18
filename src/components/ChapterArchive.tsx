import React, { useState } from "react";
import { motion } from "motion/react";
import {
  ArrowUpRight,
  Calendar,
  MapPin
} from "lucide-react";

export interface ArchiveContributor {
  name: string;
  role?: string;
  profileUrl?: string;
  isOrganization?: boolean;
}

export interface ArchiveEntry {
  id: string;
  edition: string;
  tag: string;
  title: string;
  organization: string;
  collaboration: string;
  location: string;
  date?: string;
  description: string;
  linkedinUrl: string;
  contributors: ArchiveContributor[];
  ecosystemLinks?: Array<{ label: string; url: string }>;
}

export interface LinkedInHighlightItem {
  id: string;
  index: string;
  badge: string;
  category: string;
  title: string;
  organization: string;
  description: string;
  label: string;
  url: string;
}

export const LINKEDIN_HIGHLIGHTS: LinkedInHighlightItem[] = [
  {
    id: "coding-contest-2026",
    index: "LINKEDIN / 01",
    badge: "OFFICIAL UPDATE",
    category: "CODING CONTEST 2026",
    title: "Celebrating Excellence in Competitive Programming",
    organization: "GeeksforGeeks Marwadi University × Department of AI, ML & DS",
    description:
      "Official chapter update recognizing student problem-solvers, algorithmic competence, and competitive programming achievements at Marwadi University.",
    label: "GFG × AI, ML & DS",
    url: "https://www.linkedin.com/feed/update/urn:li:activity:7490949775224250368",
  },
  
  {
    id: "ict-codejam-post-2026",
    index: "LINKEDIN / 02",
    badge: "ICT DEPARTMENT",
    category: "CODEJAM 2026",
    title: "CodeJam Coding Competition 2026",
    organization: "ICT Department × Marwadi University × GeeksforGeeks",
    description:
      "“We congratulate the top performers of the CodeJam Coding Competition 2026, organized by the ICT Department (NBA Accredited), Marwadi University in association with GeeksforGeeks.”",
    label: "ICT DEPARTMENT",
    url: "https://lnkd.in/p/dgW-sGnw",
  },
];

export const CHAPTER_ARCHIVE_DATA: ArchiveEntry[] = [
  {
    id: "coding-contest-2026",
    edition: "01",
    tag: "03 / PAST EVENT",
    title: "CODING CONTEST 2026",
    organization: "GeeksforGeeks Marwadi University",
    collaboration: "Department of AI, ML & DS, Marwadi University",
    location: "Marwadi University",
    date: "2026",
    description:
      "GeeksforGeeks Marwadi University, in collaboration with the Department of AI, ML & DS, Marwadi University, conducted Coding Contest 2026 as a competitive programming event for students.",
    linkedinUrl: "https://www.linkedin.com/feed/update/urn:li:activity:7490949775224250368",
    contributors: [
      {
        name: "Department of AI, ML & DS, Marwadi University",
        role: "Collaborating Department",
        profileUrl: "https://www.linkedin.com/company/ce-ai-marwadi-university/",
        isOrganization: true,
      },
      {
        name: "Dr. Madhu Shukla",
        role: "Dean, Faculty of Engineering & Technology (FoET)",
        profileUrl: "https://www.linkedin.com/in/madhushukla7/",
      },
      {
        name: "Marwadi University",
        role: "Host Institution",
        profileUrl: "https://www.linkedin.com/company/marwadiuniversity/",
        isOrganization: true,
      },
    
      {
        name: "Akshay Ranpariya",
        role: "Faculty Coordinator",
        profileUrl: "https://www.linkedin.com/in/akshay-r-86885b192/",
      },
   
      {
        name: "Meet Khakhkhar",
        role: "Student Coordinator",
        profileUrl: "https://www.linkedin.com/in/meet-khakhkhar23/",
      },
  
    ],
    ecosystemLinks: [
      {
        label: "GeeksforGeeks Marwadi University",
        url: "https://www.linkedin.com/company/geeksforgeeks-marwadi-university/",
      },
      {
        label: "GeeksforGeeks",
        url: "https://www.linkedin.com/company/geeksforgeeks-learn-to-code/",
      },
      {
        label: "Sandeep Jain",
        url: "https://www.linkedin.com/in/sandeep-jain-/",
      },
    ],
  },
];

export default function ChapterArchive() {
  const [activeStoryIndex] = useState(0);
  const featured = CHAPTER_ARCHIVE_DATA[activeStoryIndex] || CHAPTER_ARCHIVE_DATA[0];

  return (
    <section className="py-20 md:py-28 border-b border-[#E2E2DC] bg-[#FAF9F5] text-[#111318]">
      <div className="max-w-[1400px] mx-auto px-6 relative z-10 w-full">
        
        {/* ============================================================
            1. MAIN SECTION HEADER
            ============================================================ */}
        <div className="flex flex-col md:flex-row md:items-end justify-between pb-8 mb-16 border-b border-[#E2E2DC] gap-6">
          <div>
            <div className="font-mono text-[10px] uppercase tracking-[0.25em] text-[#00A86B] font-bold mb-3 flex items-center space-x-2">
              <span className="w-1.5 h-1.5 bg-[#00A86B] inline-block"></span>
              <span>03 / CHAPTER ARCHIVE</span>
            </div>
            <h2 className="font-editorial text-4xl sm:text-6xl font-black text-[#111318] tracking-tight leading-[1.05]">
              WHAT WE'VE<br className="hidden sm:inline" /> BUILT.
            </h2>
          </div>
          <p className="font-sans text-sm sm:text-base text-[#555B63] max-w-md leading-relaxed border-l-2 border-[#E2E2DC] pl-4">
            A record of competitions, workshops, community sessions and milestones from the GFG × Marwadi University Chapter.
          </p>
        </div>

        {/* ============================================================
            2. FEATURED PAST EVENT & TYPOGRAPHIC ARTIFACT
            ============================================================ */}
        <div className="mb-20">
          <div className="grid grid-cols-1 lg:grid-cols-12 border border-[#E2E2DC] bg-[#FFFFFF] shadow-[0_4px_24px_rgba(17,19,24,0.04)]">
            
            {/* Left: Typographic Visual Poster */}
            <div className="lg:col-span-5 bg-[#111318] text-[#F4F4F0] p-8 sm:p-12 flex flex-col justify-between relative overflow-hidden border-b lg:border-b-0 lg:border-r border-[#111318]">
              {/* Subtle background grid accent */}
              <div 
                className="absolute inset-0 opacity-10 pointer-events-none"
                style={{
                  backgroundImage: "radial-gradient(#FFFFFF 1px, transparent 1px)",
                  backgroundSize: "20px 20px"
                }}
              />

              <div className="relative z-10 space-y-6">
                <div className="flex items-center justify-between font-mono text-[10px] tracking-widest text-[#00A86B] border-b border-[#2A2E37] pb-4">
                  <span>{featured.tag}</span>
                  <span>MARWADI UNIVERSITY</span>
                </div>

                <div className="space-y-2 pt-4">
                  <div className="font-mono text-xs text-[#8B9198] tracking-wider uppercase">
                    COMPETITIVE PROGRAMMING INITIATIVE
                  </div>
                  <h3 className="font-editorial text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight text-[#FAF9F5] leading-none">
                    CODING<br />
                    CONTEST<br />
                    <span className="text-[#00A86B]">2026</span>
                  </h3>
                </div>
              </div>

              <div className="relative z-10 pt-12 space-y-4">
                <div className="p-4 bg-[#1B1F27] border border-[#2A2E37] font-mono text-[11px] text-[#A0A6AD] space-y-1.5">
                  <div className="text-[#FAF9F5] font-bold tracking-wider">
                    GFG × MARWADI UNIVERSITY
                  </div>
                  <div className="text-xs text-[#8B9198]">
                    In collaboration with Department of AI, ML & DS
                  </div>
                </div>

                <a
                  href={featured.linkedinUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-3.5 px-5 bg-[#00A86B] hover:bg-[#00875A] text-[#FFFFFF] font-mono text-xs uppercase tracking-widest transition-colors flex items-center justify-between group cursor-pointer"
                >
                  <span className="font-bold">VIEW LINKEDIN POST</span>
                  <ArrowUpRight className="w-4 h-4 transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                </a>
              </div>
            </div>

            {/* Right: Editorial Story & Event Details */}
            <div className="lg:col-span-7 p-8 sm:p-12 flex flex-col justify-between bg-[#FFFFFF]">
              <div className="space-y-8">
                <div className="flex flex-wrap items-center gap-3 font-mono text-[10px] uppercase tracking-wider text-[#8B9198] pb-4 border-b border-[#E2E2DC]">
                  <span className="px-2.5 py-1 bg-[#F4F4F0] text-[#111318] font-bold border border-[#E2E2DC]">
                    ARCHIVE ENTRY #01
                  </span>
                  <span className="flex items-center text-[#555B63]">
                    <MapPin className="w-3 h-3 mr-1 text-[#00A86B]" />
                    Marwadi University
                  </span>
                  <span className="flex items-center text-[#555B63]">
                    <Calendar className="w-3 h-3 mr-1 text-[#00A86B]" />
                    Official Chapter Contest
                  </span>
                </div>

                <div className="space-y-4">
                  <div className="font-mono text-xs text-[#00A86B] uppercase tracking-widest font-bold">
                    Official Chapter Record
                  </div>
                  <h4 className="font-editorial text-2xl sm:text-3xl font-bold text-[#111318] tracking-tight leading-snug">
                    GeeksforGeeks Marwadi University × Department of AI, ML & DS
                  </h4>
                  <p className="font-sans text-sm sm:text-base text-[#555B63] leading-relaxed">
                    {featured.description}
                  </p>
                </div>

                {/* Technical Metadata Spec Box */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4">
                  <div className="p-4 bg-[#FAF9F5] border border-[#E2E2DC] space-y-1">
                    <span className="font-mono text-[10px] text-[#8B9198] uppercase tracking-wider block">
                      Organized By
                    </span>
                    <span className="font-sans text-xs font-bold text-[#111318]">
                      {featured.organization}
                    </span>
                  </div>
                  <div className="p-4 bg-[#FAF9F5] border border-[#E2E2DC] space-y-1">
                    <span className="font-mono text-[10px] text-[#8B9198] uppercase tracking-wider block">
                      In Collaboration With
                    </span>
                    <span className="font-sans text-xs font-bold text-[#111318]">
                      {featured.collaboration}
                    </span>
                  </div>
                </div>
              </div>

              {/* Action Bar */}
              <div className="pt-8 mt-8 border-t border-[#E2E2DC] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="font-mono text-xs text-[#8B9198]">
                  Verified official chapter documentation
                </div>
                <div className="flex items-center gap-3">
                  <a
                    href={featured.linkedinUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center space-x-2 text-xs font-mono font-bold text-[#111318] hover:text-[#00A86B] underline underline-offset-4 transition-colors"
                  >
                    <span>READ THE FULL POST</span>
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>
            </div>

          </div>
        </div>

        {/* ============================================================
            3. LINKEDIN HIGHLIGHTS SECTION
            ============================================================ */}
        <div className="mb-20">
          <div className="flex flex-col md:flex-row md:items-end justify-between pb-6 mb-10 border-b border-[#E2E2DC] gap-6">
            <div>
              <div className="font-mono text-[10px] uppercase tracking-[0.25em] text-[#00A86B] font-bold mb-2 flex items-center space-x-2">
                <span className="w-1.5 h-1.5 bg-[#00A86B] inline-block" />
                <span>CHAPTER ACTIVITY / MARWADI UNIVERSITY</span>
              </div>
              <h3 className="font-editorial text-3xl sm:text-5xl font-black text-[#111318] tracking-tight">
                LINKEDIN HIGHLIGHTS
              </h3>
            </div>
            <p className="font-sans text-xs sm:text-sm text-[#555B63] max-w-lg border-l-2 border-[#00A86B] pl-4 leading-relaxed">
              From coding competitions to AI workshops and community meetups, GFG × Marwadi University continues to conduct technical events and build an active student developer community on campus.
            </p>
          </div>

          {/* Equal Responsive Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {LINKEDIN_HIGHLIGHTS.map((item, idx) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.08 }}
                className="bg-[#FFFFFF] border border-[#E2E2DC] p-8 flex flex-col justify-between hover:border-[#111318] transition-all duration-300 shadow-[0_4px_20px_rgba(17,19,24,0.025)] h-full group"
              >
                <div className="space-y-5">
                  <div className="flex items-center justify-between font-mono text-[10px] text-[#8B9198] pb-4 border-b border-[#E2E2DC]">
                    <span className="font-bold text-[#111318] tracking-widest">{item.index}</span>
                    <span className="text-[#00A86B] font-bold px-2.5 py-0.5 bg-[#FAF9F5] border border-[#E2E2DC]">
                      {item.label}
                    </span>
                  </div>

                  <div className="space-y-2.5">
                    <div className="font-mono text-[10px] uppercase tracking-wider text-[#00A86B] font-bold">
                      {item.category}
                    </div>
                    <h4 className="font-editorial text-xl sm:text-2xl font-bold text-[#111318] tracking-tight leading-snug group-hover:text-[#00A86B] transition-colors">
                      {item.title}
                    </h4>
                    <div className="font-mono text-[10px] text-[#8B9198] uppercase tracking-wider">
                      {item.organization}
                    </div>
                  </div>

                  <p className="font-sans text-xs text-[#555B63] leading-relaxed">
                    {item.description}
                  </p>
                </div>

                <div className="pt-6 border-t border-[#E2E2DC] mt-8 flex items-center justify-between">
                  <span className="font-mono text-[10px] text-[#8B9198]">
                    Official Publication
                  </span>
                  <a
                    href={item.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center space-x-2 py-2.5 px-4 bg-[#111318] hover:bg-[#00A86B] text-[#FFFFFF] font-mono text-xs uppercase tracking-widest transition-colors cursor-pointer"
                  >
                    <span>VIEW POST</span>
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  </a>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* ============================================================
            4. EVENT CONTRIBUTORS / WITH SUPPORT FROM
            ============================================================ */}
        <div className="mb-20">
          <div className="p-8 sm:p-10 bg-[#FFFFFF] border border-[#E2E2DC] space-y-8">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-[#E2E2DC] gap-2">
              <div>
                <div className="font-mono text-[10px] uppercase tracking-[0.2em] text-[#00A86B] font-bold">
                  04 / CHAPTER ACKNOWLEDGEMENT
                </div>
                <h4 className="font-editorial text-2xl font-bold text-[#111318] tracking-tight">
                  EVENT CONTRIBUTORS
                </h4>
              </div>
              <span className="font-mono text-xs text-[#8B9198]">
                With Support From Leadership & Coordinators
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {featured.contributors.map((contrib) => {
                const ContentWrapper = contrib.profileUrl ? "a" : "div";
                const wrapperProps = contrib.profileUrl
                  ? {
                      href: contrib.profileUrl,
                      target: "_blank",
                      rel: "noopener noreferrer",
                      className:
                        "p-4 bg-[#FAF9F5] border border-[#E2E2DC] hover:border-[#111318] hover:bg-[#FFFFFF] transition-colors flex flex-col justify-between group cursor-pointer",
                    }
                  : {
                      className: "p-4 bg-[#FAF9F5] border border-[#E2E2DC] flex flex-col justify-between",
                    };

                return (
                  <ContentWrapper key={contrib.name} {...(wrapperProps as any)}>
                    <div className="space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="font-mono text-[10px] text-[#00A86B] font-bold uppercase tracking-wider">
                          {contrib.role || "Contributor"}
                        </span>
                        {contrib.profileUrl && (
                          <ArrowUpRight className="w-3.5 h-3.5 text-[#8B9198] group-hover:text-[#111318] transition-colors" />
                        )}
                      </div>
                      <h5 className="font-sans text-xs sm:text-sm font-bold text-[#111318] leading-snug pt-1">
                        {contrib.name}
                      </h5>
                    </div>
                  </ContentWrapper>
                );
              })}
            </div>

            {/* Ecosystem References */}
            {featured.ecosystemLinks && (
              <div className="pt-4 border-t border-[#E2E2DC] flex flex-wrap items-center gap-3">
                <span className="font-mono text-[10px] uppercase tracking-wider text-[#8B9198]">
                  Ecosystem Links:
                </span>
                {featured.ecosystemLinks.map((item) => (
                  <a
                    key={item.label}
                    href={item.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center space-x-1 px-3 py-1 bg-[#FAF9F5] hover:bg-[#111318] hover:text-[#FFFFFF] text-[#111318] border border-[#E2E2DC] font-mono text-[10px] uppercase tracking-wider transition-colors"
                  >
                    <span>{item.label}</span>
                    <ArrowUpRight className="w-3 h-3" />
                  </a>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* ============================================================
            6. BUILT AT MARWADI EDITORIAL STATEMENT
            ============================================================ */}
        <div className="p-8 sm:p-12 bg-[#111318] text-[#F4F4F0] border border-[#111318] flex flex-col md:flex-row md:items-center justify-between gap-8">
          <div className="space-y-2">
            <div className="font-mono text-[10px] uppercase tracking-[0.25em] text-[#00A86B] font-bold">
              CHAPTER DNA
            </div>
            <h4 className="font-editorial text-3xl sm:text-4xl font-black tracking-tight text-[#FFFFFF]">
              BUILT AT MARWADI.
            </h4>
            <p className="font-sans text-xs sm:text-sm text-[#A0A6AD] max-w-lg leading-relaxed">
              Competitions. Workshops. Coding sessions. Developer communities. Student projects. Hackathons.
            </p>
          </div>

          <div className="font-mono text-xs text-[#8B9198] border-l-2 border-[#00A86B] pl-4 space-y-1">
            <div className="text-[#FFFFFF] font-bold">GEEKSFORGEEKS STUDENT CHAPTER</div>
            <div>Marwadi University, Rajkot</div>
          </div>
        </div>

      </div>
    </section>
  );
}
