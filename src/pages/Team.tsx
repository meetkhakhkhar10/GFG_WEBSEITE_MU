import React, { useState, useEffect } from "react";
import { motion } from "motion/react";
import { 
  Github, Linkedin, Twitter, Users, ArrowRight, Mail, Globe, 
  Terminal, Sparkles, Loader2, Compass, ArrowUpRight
} from "lucide-react";
import { gasApi } from "../services/gasApi";
import PaperTiles from "../components/PaperTiles";
import EditorialImage from "../components/EditorialImage";

export default function Team() {
  const [members, setMembers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadTeam() {
      try {
        const res = await gasApi.getTeam();
        if (res.success && Array.isArray(res.team) && res.team.length > 0) {
          setMembers(res.team);
        } else {
          const response = await fetch("/api/team");
          const data = await response.json();
          if (data.success) {
            setMembers(data.data || []);
          }
        }
      } catch (err) {
        console.warn("Dynamic core team directory notice:", err);
      } finally {
        setLoading(false);
      }
    }
    loadTeam();
  }, []);

  const coreCommittee = members.filter((m) => {
    if (m.active === false) return false;
    const name = (m.name || "").toLowerCase().trim();
    return (
      name !== "meet khakhkhar" &&
      name !== "ravi gohel" &&
      name !== "sri vyshnavi y" &&
      name !== "sri vyshnavi"
    );
  });

  return (
    <div className="bg-[#F4F4F0] min-h-screen text-[#111318] select-none">
      
      {/* Background Architectural Grid */}
      <div className="absolute inset-0 bg-technical-grid opacity-50 pointer-events-none" />

      {/* TOP HEADER */}
      <section className="relative py-16 md:py-24 border-b border-[#E2E2DC] bg-[#F4F4F0]">
        <div className="max-w-[1400px] mx-auto px-6 relative z-10 w-full">
          
          <div className="flex flex-wrap items-center justify-between border-b border-[#E2E2DC] pb-4 mb-10 font-mono text-[10px] uppercase tracking-[0.25em] text-[#8B9198]">
            <div className="flex items-center space-x-2">
              <span className="text-[#00A86B] font-bold">03 / CHAPTER DIRECTORY</span>
              <span>·</span>
              <span className="text-[#111318]">CAMPUS LEADERSHIP</span>
            </div>
            <div>TENURE 2025–2026</div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-end">
            <div className="lg:col-span-8 space-y-4">
              <h1 className="font-editorial text-4xl sm:text-6xl lg:text-7xl font-black text-[#111318] tracking-tight leading-[0.98]">
                Meet the <br />
                <span className="font-editorial-italic font-normal text-[#00A86B]">
                  Organizing Circle
                </span>
              </h1>
              <p className="font-sans text-sm sm:text-base text-[#555B63] max-w-2xl leading-relaxed border-l-2 border-[#111318] pl-4">
                The student leaders, community builders, competitive programmers, and laboratory mentors powering 
                the GeeksforGeeks Chapter at Marwadi University.
              </p>
            </div>

            <div className="lg:col-span-4 font-mono text-[11px] space-y-2 bg-[#FFFFFF] border border-[#E2E2DC] p-5 shadow-sm">
              <div className="flex justify-between border-b border-[#E2E2DC] pb-2 text-[#8B9198]">
                <span>CHAPTER STATUS</span>
                <span className="text-[#00A86B] font-bold">ACTIVE OFFICIAL</span>
              </div>
              <div className="flex justify-between border-b border-[#E2E2DC] pb-2 text-[#8B9198]">
                <span>INSTITUTION</span>
                <span className="text-[#111318]">Marwadi University</span>
              </div>
              <div className="flex justify-between text-[#8B9198]">
                <span>COMMITTEE</span>
                <span className="text-[#111318] font-bold">Student Council</span>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* MAIN LEADER SPOTLIGHT: MEET KHAKHKHAR */}
      <section className="py-16 md:py-24 border-b border-[#E2E2DC] bg-[#FAF9F5]">
        <div className="max-w-[1400px] mx-auto px-6 relative z-10 w-full">
          
          <div className="flex items-center justify-between pb-4 mb-10 border-b border-[#E2E2DC]">
            <div className="font-mono text-xs uppercase tracking-widest text-[#111318] font-bold">
              CAMPUS MANTRI · EXECUTIVE SPOTLIGHT
            </div>
            <div className="font-mono text-xs text-[#8B9198]">
              STUDENT CHAPTER FOUNDATION
            </div>
          </div>

          <div className="bg-[#FFFFFF] border border-[#E2E2DC] p-8 md:p-12 shadow-[0_4px_20px_rgba(17,19,24,0.04)]">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
              
              {/* Leader Photo Container */}
              <div className="lg:col-span-4">
                <div className="w-full bg-[#FAF9F5] border border-[#E2E2DC] p-2 flex items-center justify-center overflow-hidden aspect-[3/4] sm:aspect-[4/5] lg:aspect-[3/4]">
                  <img
                    src="https://gfgmarwadiuniversity.wordpress.com/wp-content/uploads/2026/09/meet_khakhkhar_photo.png"
                    alt="Meet Khakhkhar"
                    className="team-profile-image"
                  />
                </div>
              </div>

              {/* Leader Bio & Metadata */}
              <div className="lg:col-span-8 space-y-6">
                
                <div className="inline-flex items-center space-x-2 font-mono text-[10px] uppercase tracking-[0.25em] text-[#00A86B] font-bold">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#00A86B] animate-pulse" />
                  <span>CAMPUS MANTRI · MAIN CHAPTER LEADER</span>
                </div>

                <div>
                  <h2 className="font-editorial text-4xl sm:text-5xl font-black text-[#111318] tracking-tight">
                    Meet Khakhkhar
                  </h2>
                  <p className="font-mono text-xs text-[#00A86B] uppercase tracking-widest mt-1">
                    GeeksforGeeks Student Chapter · Marwadi University
                  </p>
                </div>

                <blockquote className="font-editorial-italic text-lg sm:text-xl text-[#111318] leading-relaxed border-l-2 border-[#111318] pl-5">
                  "Building an enduring developer culture at Marwadi University through algorithmic discipline, national hackathon collaborations, and hands-on peer mentorship."
                </blockquote>

                {/* Detailed Clearance Blocks */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 font-mono text-xs pt-2">
                  <div className="p-3.5 bg-[#FAF9F5] border border-[#E2E2DC]">
                    <span className="text-[9px] text-[#8B9198] uppercase block">DEPARTMENT</span>
                    <span className="font-bold text-[#111318] mt-0.5 block">Computer Science Engineering</span>
                  </div>
                  <div className="p-3.5 bg-[#FAF9F5] border border-[#E2E2DC]">
                    <span className="text-[9px] text-[#8B9198] uppercase block">CONTACT CLEARANCE</span>
                    <span className="font-bold text-[#00A86B] mt-0.5 block">meetkhakhkhar05@gmail.com</span>
                  </div>
                </div>

                {/* Social links */}
                <div className="flex flex-wrap items-center gap-3 pt-4 border-t border-[#E2E2DC]">
                  <a
                    href="https://www.linkedin.com/in/meet-khakhkhar23/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-4 py-2 bg-[#FAF9F5] hover:bg-[#111318] text-[#111318] hover:text-[#F4F4F0] border border-[#E2E2DC] font-mono text-[10px] uppercase tracking-wider transition-colors inline-flex items-center gap-1.5"
                  >
                    <Linkedin className="w-3.5 h-3.5" />
                    <span>LinkedIn</span>
                  </a>

                  <a
                    href="https://github.com/meetkhakhkhar"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-4 py-2 bg-[#FAF9F5] hover:bg-[#111318] text-[#111318] hover:text-[#F4F4F0] border border-[#E2E2DC] font-mono text-[10px] uppercase tracking-wider transition-colors inline-flex items-center gap-1.5"
                  >
                    <Github className="w-3.5 h-3.5" />
                    <span>GitHub</span>
                  </a>

                  <a
                    href="https://write.geeksforgeeks.org/user/meetkhakhkhar05/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-4 py-2 bg-[#FAF9F5] hover:bg-[#111318] text-[#111318] hover:text-[#F4F4F0] border border-[#E2E2DC] font-mono text-[10px] uppercase tracking-wider transition-colors inline-flex items-center gap-1.5"
                  >
                    <Globe className="w-3.5 h-3.5" />
                    <span>GFG Profile</span>
                  </a>

                  <a
                    href="mailto:meetkhakhkhar05@gmail.com"
                    className="px-4 py-2 bg-[#FAF9F5] hover:bg-[#111318] text-[#111318] hover:text-[#F4F4F0] border border-[#E2E2DC] font-mono text-[10px] uppercase tracking-wider transition-colors inline-flex items-center gap-1.5"
                  >
                    <Mail className="w-3.5 h-3.5" />
                    <span>Email</span>
                  </a>
                </div>

              </div>

            </div>
          </div>

        </div>
      </section>

      {/* CAMPUS MANTRI 2026 TENURE */}
      <section className="py-16 md:py-24 border-b border-[#E2E2DC] bg-[#F4F4F0]">
        <div className="max-w-[1400px] mx-auto px-6 relative z-10 w-full">
          
          <div className="flex items-center justify-between pb-4 mb-10 border-b border-[#E2E2DC]">
            <div className="font-mono text-xs uppercase tracking-widest text-[#111318] font-bold">
              CAMPUS MANTRI 2026
            </div>
            <div className="font-mono text-xs text-[#8B9198]">
              SELECTED STUDENT DIRECTORS
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Ravi Gohel */}
            <div className="bg-[#FFFFFF] border border-[#E2E2DC] p-8 flex flex-col justify-between hover:border-[#111318] transition-colors shadow-[0_4px_20px_rgba(17,19,24,0.03)]">
              <div className="space-y-6">
                <div className="flex items-center gap-6">
                  <div className="w-24 shrink-0">
                    <EditorialImage 
                      src="https://gfgmarwadiuniversity.wordpress.com/wp-content/uploads/2026/09/1788464711991.png"
                      alt="Ravi Gohel"
                      variant="thumbnail"
                      figNumber="FIG. 02"
                      aspectClassName="aspect-square"
                    />
                  </div>
                  <div>
                    <span className="font-mono text-[9px] uppercase tracking-widest text-[#00A86B] font-bold block mb-1">
                      CAMPUS MANTRI 2026
                    </span>
                    <h3 className="font-editorial text-2xl font-black text-[#111318]">
                      Ravi Gohel
                    </h3>
                    <p className="font-mono text-[10px] text-[#8B9198] uppercase">
                      GFG MU Chapter
                    </p>
                  </div>
                </div>

                <p className="font-sans text-xs sm:text-sm text-[#555B63] leading-relaxed">
                  Empowering the campus community with technical skills, mentoring, competitive programming, and collaborative innovation.
                </p>
              </div>

              <div className="pt-6 border-t border-[#E2E2DC] mt-6 font-mono text-[10px] text-[#8B9198] flex items-center justify-between">
                <span>TENURE 2026</span>
                <span className="text-[#00A86B] font-bold">ACTIVE DIRECTOR</span>
              </div>
            </div>

            {/* Sri Vyshnavi Y */}
            <div className="bg-[#FFFFFF] border border-[#E2E2DC] p-8 flex flex-col justify-between hover:border-[#111318] transition-colors shadow-[0_4px_20px_rgba(17,19,24,0.03)]">
              <div className="space-y-6">
                <div className="flex items-center gap-6">
                  <div className="w-24 shrink-0">
                    <EditorialImage 
                      src="https://gfgmarwadiuniversity.wordpress.com/wp-content/uploads/2026/09/bf037374-c847-4e3a-8dd2-1cb5496da19b.png"
                      alt="Sri Vyshnavi Y"
                      variant="thumbnail"
                      figNumber="FIG. 03"
                      aspectClassName="aspect-square"
                    />
                  </div>
                  <div>
                    <span className="font-mono text-[9px] uppercase tracking-widest text-[#00A86B] font-bold block mb-1">
                      CAMPUS MANTRI 2026
                    </span>
                    <h3 className="font-editorial text-2xl font-black text-[#111318]">
                      Sri Vyshnavi Y
                    </h3>
                    <p className="font-mono text-[10px] text-[#8B9198] uppercase">
                      GFG MU Chapter
                    </p>
                  </div>
                </div>

                <p className="font-sans text-xs sm:text-sm text-[#555B63] leading-relaxed">
                  Championing student development, organizing flagship hackathons, and fostering an inclusive environment for developers.
                </p>
              </div>

              <div className="pt-6 border-t border-[#E2E2DC] mt-6 font-mono text-[10px] text-[#8B9198] flex items-center justify-between">
                <span>TENURE 2026</span>
                <span className="text-[#00A86B] font-bold">ACTIVE DIRECTOR</span>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* CORE COMMITTEE DIRECTORY (DYNAMIC) */}
      <section className="py-16 md:py-24 border-b border-[#E2E2DC] bg-[#FAF9F5]">
        <div className="max-w-[1400px] mx-auto px-6 relative z-10 w-full">
          
          <div className="flex items-center justify-between pb-4 mb-10 border-b border-[#E2E2DC]">
            <div className="font-mono text-xs uppercase tracking-widest text-[#111318] font-bold">
              CORE COMMITTEE DIRECTORY
            </div>
            <div className="font-mono text-xs text-[#8B9198]">
              STUDENT MENTORS & LEADS
            </div>
          </div>

          {loading ? (
            <div className="p-16 bg-[#FFFFFF] border border-[#E2E2DC] text-center font-mono text-xs text-[#8B9198] animate-pulse">
              SYNCING CHAPTER COMMITTEE DIRECTORY...
            </div>
          ) : coreCommittee.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {coreCommittee.map((member, i) => (
                <div
                  key={member.id || i}
                  className="bg-[#FFFFFF] border border-[#E2E2DC] p-6 flex flex-col justify-between hover:border-[#111318] transition-colors group shadow-[0_4px_20px_rgba(17,19,24,0.03)]"
                >
                  <div>
                    <div className="mb-4">
                      {member.profilePhoto ? (
                        <EditorialImage 
                          src={member.profilePhoto} 
                          alt={member.name} 
                          variant="thumbnail"
                          figNumber={`FIG. 0${(i % 9) + 1}`}
                          aspectClassName="aspect-square"
                        />
                      ) : (
                        <div className="w-20 h-20 border border-[#E2E2DC] flex items-center justify-center bg-[#FAF9F5] text-[#8B9198]">
                          <Users className="w-6 h-6" />
                        </div>
                      )}
                    </div>

                    <h3 className="font-editorial text-xl font-bold text-[#111318] group-hover:text-[#00A86B] transition-colors leading-snug">
                      {member.name}
                    </h3>

                    <p className="font-mono text-[9px] uppercase tracking-widest text-[#00A86B] mt-1 font-bold">
                      {member.position || "Core Committee"}
                    </p>

                    <p className="font-mono text-[10px] text-[#8B9198] uppercase mt-0.5">
                      {member.department || "Computer Science"}
                    </p>

                    {member.bio && (
                      <p className="font-sans text-xs text-[#555B63] mt-3 line-clamp-3 leading-relaxed">
                        {member.bio}
                      </p>
                    )}
                  </div>

                  {/* Links */}
                  <div className="pt-4 border-t border-[#E2E2DC] mt-6 flex items-center gap-2">
                    {member.linkedinUrl && (
                      <a 
                        href={member.linkedinUrl} 
                        target="_blank" 
                        rel="noopener noreferrer" 
                        className="p-2 border border-[#E2E2DC] hover:border-[#111318] text-[#111318] transition-colors"
                        title="LinkedIn"
                      >
                        <Linkedin className="w-3.5 h-3.5" />
                      </a>
                    )}
                    {member.githubUrl && (
                      <a 
                        href={member.githubUrl} 
                        target="_blank" 
                        rel="noopener noreferrer" 
                        className="p-2 border border-[#E2E2DC] hover:border-[#111318] text-[#111318] transition-colors"
                        title="GitHub"
                      >
                        <Github className="w-3.5 h-3.5" />
                      </a>
                    )}
                    {member.email && (
                      <a 
                        href={`mailto:${member.email}`}
                        className="p-2 border border-[#E2E2DC] hover:border-[#111318] text-[#111318] transition-colors"
                        title="Email"
                      >
                        <Mail className="w-3.5 h-3.5" />
                      </a>
                    )}
                  </div>

                </div>
              ))}
            </div>
          ) : (
            <div className="p-12 bg-[#FFFFFF] border border-[#E2E2DC] text-center font-mono text-xs text-[#8B9198]">
              Directory indexing is in progress. Check back shortly.
            </div>
          )}

        </div>
      </section>

      {/* JOIN COMMITTEE CTA */}
      <section className="py-20 bg-[#111318] text-[#F4F4F0] select-none">
        <div className="max-w-[1400px] mx-auto px-6 w-full">
          <div className="flex flex-col md:flex-row items-center justify-between gap-8 border-l-2 border-[#00A86B] pl-6">
            <div className="space-y-2">
              <span className="font-mono text-[10px] uppercase tracking-[0.25em] text-[#00A86B]">
                RECRUITMENT APPLICATION
              </span>
              <h3 className="font-editorial text-3xl sm:text-4xl font-bold">
                Aspiring to Join the Core Team?
              </h3>
              <p className="font-sans text-xs sm:text-sm text-[#8B9198] max-w-xl">
                We accept applications each semester for technical leads, event organizers, design leads, and contest moderators.
              </p>
            </div>

            <a
              href="https://docs.google.com/forms/d/e/1FAIpQLSdRFDcPsYn5rVtF3kIB3CAJ4rKPTsYHCY6YbQNkihsb3rvXDg/viewform?usp=publish-editor"
              target="_blank"
              rel="noopener noreferrer"
              className="px-8 py-4 bg-[#00A86B] hover:bg-[#FFFFFF] text-[#111318] font-mono text-xs uppercase tracking-widest transition-colors inline-flex items-center space-x-2 shrink-0"
            >
              <span>Submit Application</span>
              <ArrowUpRight className="w-4 h-4" />
            </a>
          </div>
        </div>
      </section>

    </div>
  );
}
