import { useState, useEffect } from "react";
import { motion } from "motion/react";
import { 
  Github, Linkedin, Twitter, Users, ArrowRight, Mail, Globe, 
  Terminal, Sparkles, Loader2, Compass
} from "lucide-react";

export default function Team() {
  const [members, setMembers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadTeam() {
      try {
        const response = await fetch("/api/team");
        const data = await response.json();
        if (data.success) {
          // Sort or filter: keep active
          setMembers(data.data || []);
        }
      } catch (err) {
        console.error("Failed to fetch dynamic core team directory:", err);
      } finally {
        setLoading(false);
      }
    }
    loadTeam();
  }, []);

  // Filter out Meet Khakhkhar from dynamic list to avoid duplication of top spotlight
  const coreCommittee = members.filter(
    (m) => 
      m.active !== false && 
      m.name?.toLowerCase().trim() !== "meet khakhkhar"
  );

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="py-32 bg-[#070707] min-h-screen text-white relative overflow-hidden font-sans"
    >
      {/* Background cyber glows */}
      <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-[#00ff88]/3 blur-[140px] rounded-full pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-emerald-500/1 blur-[120px] rounded-full pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 relative z-10 w-full">
        
        {/* SECTION 1: HERO SECTION */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center space-x-2 px-4 py-1.5 mb-6 text-[10px] font-black tracking-widest text-[#00ff88] uppercase bg-[#00ff88]/10 border border-[#00ff88]/20 rounded-full shadow-sm font-mono">
            <span className="w-1.5 h-1.5 bg-[#00ff88] rounded-full animate-pulse" />
            <span>GFG Chapter Directors</span>
          </div>
          <h1 className="text-4xl md:text-7xl font-black text-white mb-6 tracking-tighter uppercase leading-none italic">
            Meet the <span className="text-[#00ff88]">Team</span>
          </h1>
          <p className="text-white/40 max-w-2xl mx-auto text-sm md:text-base mb-8 font-semibold leading-relaxed">
            The passionate students, leaders, innovators, and community builders driving the GeeksforGeeks Student Chapter at Marwadi University.
          </p>
        </div>

        {/* SECTION 2: MAIN LEADER SPOTLIGHT */}
        <div className="max-w-4xl mx-auto mb-24">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="relative p-8 md:p-12 rounded-[2.5rem] bg-gradient-to-br from-[#0c0c0c] via-black to-[#0e0e0e] border border-white/5 hover:border-[#00ff88]/20 transition-all shadow-2xl overflow-hidden group"
          >
            {/* Background green glow effect */}
            <div className="absolute top-0 right-0 w-80 h-80 bg-[#00ff88]/4 blur-3xl rounded-full" />
            <div className="absolute -bottom-10 -left-10 w-64 h-64 bg-emerald-500/2 blur-2xl rounded-full" />

            <div className="flex flex-col md:flex-row items-center gap-8 md:gap-12 relative z-10">
              
              {/* Circle Photo Frame */}
              <div className="relative shrink-0 w-44 h-44 rounded-full p-1 bg-gradient-to-tr from-[#00ff88]/30 via-transparent to-white/10 group-hover:from-[#00ff88] transition-all duration-700">
                <div className="w-full h-full rounded-full overflow-hidden bg-black/40 border border-white/15">
                  <img 
                    src="https://media.licdn.com/dms/image/v2/D5603AQHZ1_NcFRFxsA/profile-displayphoto-crop_800_800/B56ZraxYpMHAAM-/0/1764606972119?e=1782345600&v=beta&t=44vxxQGGtdRXmjeiBEPbxo10tRkoVWPaV2-pNbatj0A"
                    alt="Meet Khakhkhar"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                    referrerPolicy="no-referrer"
                  />
                </div>
                {/* Glow indicator */}
                <span className="absolute bottom-2 right-2 w-4.5 h-4.5 bg-[#00ff88] rounded-full border-4 border-[#070707] animate-pulse" />
              </div>

              {/* Content details */}
              <div className="flex-1 text-center md:text-left space-y-4">
                <div className="inline-flex items-center space-x-2 px-3 py-1 bg-[#00ff88]/10 border border-[#00ff88]/20 rounded-md">
                  <Sparkles className="w-3.5 h-3.5 text-[#00ff88]" />
                  <span className="text-[9px] font-black uppercase tracking-wider text-[#00ff88] font-mono">Campus Mantri • Main Leader</span>
                </div>

                <div>
                  <h2 className="text-3xl md:text-4xl font-extrabold text-white tracking-tight uppercase">
                    Meet Khakhkhar
                  </h2>
                  <p className="text-[#00ff88] font-semibold text-xs md:text-sm mt-1 uppercase tracking-widest font-mono">
                    Campus Mantri | GeeksforGeeks Student Chapter | Marwadi University
                  </p>
                </div>

                <p className="text-white/70 text-sm md:text-base leading-relaxed italic font-medium max-w-xl">
                  "Building a stronger tech community through innovation, leadership, collaboration, and student empowerment."
                </p>

                {/* Core Mission Sub-Block */}
                <div className="grid grid-cols-2 gap-4 pt-2 border-t border-white/5 text-xs text-white/50">
                  <div>
                    <span className="text-[9px] uppercase font-black text-gray-400 block font-mono">Core Department</span>
                    <span className="text-white font-semibold mt-0.5 block">Computer Science Engineering</span>
                  </div>
                  <div>
                    <span className="text-[9px] uppercase font-black text-gray-400 block font-mono">Email Clearance</span>
                    <span className="text-[#00ff88] font-semibold font-mono mt-0.5 break-all block">meetkhakhkhar05@gmail.com</span>
                  </div>
                </div>

                {/* Social connections toolbar */}
                <div className="flex flex-wrap items-center justify-center md:justify-start gap-3 pt-3">
                  <a
                    href="https://www.linkedin.com/in/meet-khakhkhar23/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-3 bg-white/5 border border-white/5 text-gray-400 hover:text-[#00ff88] hover:bg-[#00ff88]/10 hover:border-[#00ff88]/20 rounded-xl transition-all shadow-sm"
                    title="LinkedIn profile"
                  >
                    <Linkedin className="w-4.5 h-4.5" />
                  </a>
                  <a
                    href="https://github.com/meetkhakhkhar"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-3 bg-white/5 border border-white/5 text-gray-400 hover:text-[#00ff88] hover:bg-[#00ff88]/10 hover:border-[#00ff88]/20 rounded-xl transition-all shadow-sm"
                    title="GitHub profile"
                  >
                    <Github className="w-4.5 h-4.5" />
                  </a>
                  <a
                    href="https://write.geeksforgeeks.org/user/meetkhakhkhar05/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-3 bg-white/5 border border-white/5 text-gray-400 hover:text-[#00ff88] hover:bg-[#00ff88]/10 hover:border-[#00ff88]/20 rounded-xl transition-all shadow-sm flex items-center gap-1.5 font-mono text-[10px] font-black uppercase tracking-wider"
                    title="GeeksforGeeks Hub"
                  >
                    <Globe className="w-4.5 h-4.5" />
                    <span>GFG</span>
                  </a>
                  <a
                    href="mailto:meetkhakhkhar05@gmail.com"
                    className="p-3 bg-white/5 border border-white/5 text-gray-400 hover:text-[#00ff88] hover:bg-[#00ff88]/10 hover:border-[#00ff88]/20 rounded-xl transition-all shadow-sm"
                    title="Direct Mail"
                  >
                    <Mail className="w-4.5 h-4.5" />
                  </a>
                </div>

              </div>
            </div>
          </motion.div>
        </div>

        {/* SECTION 3 & TEAM LISTING AREA */}
        <div className="mb-20">
          <div className="text-center mb-12">
            <h2 className="text-2xl md:text-3xl font-extrabold uppercase text-white tracking-widest font-mono">
              Core <span className="text-[#00ff88]">Committee</span>
            </h2>
            <div className="w-24 h-1 bg-[#00ff88] mx-auto mt-3 rounded-full opacity-60" />
          </div>

          {loading ? (
            <div className="flex flex-col items-center justify-center py-20 space-y-4">
              <Loader2 className="w-10 h-10 text-[#00ff88] animate-spin" />
              <p className="text-white/40 font-mono text-xs uppercase tracking-widest animate-pulse">Syncing core indexes...</p>
            </div>
          ) : coreCommittee.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 max-w-7xl mx-auto">
              {coreCommittee.map((member, i) => (
                <motion.div
                  key={member.id || i}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.05 }}
                  className="group relative p-6 rounded-[2rem] bg-[#0c0c0c] border border-white/5 hover:border-[#00ff88]/20 transition-all text-center flex flex-col justify-between h-full"
                >
                  <div>
                    {/* Circle Photo */}
                    <div className="w-24 h-24 mx-auto mb-5 rounded-full overflow-hidden border-2 border-white/5 group-hover:border-[#00ff88]/30 transition-all shrink-0">
                      {member.profilePhoto ? (
                        <img 
                          src={member.profilePhoto} 
                          alt={member.name} 
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          referrerPolicy="no-referrer"
                        />
                      ) : (
                        <div className="w-full h-full bg-white/5 flex items-center justify-center text-white/20">
                          <Users className="w-8 h-8" />
                        </div>
                      )}
                    </div>

                    <h3 className="text-lg font-black text-white mb-1 group-hover:text-[#00ff88] transition-colors leading-tight uppercase tracking-tight">
                      {member.name}
                    </h3>
                    <p className="text-[#00ff88]/90 text-[9px] font-mono font-bold tracking-widest uppercase mb-2">{member.position}</p>
                    <p className="text-white/40 text-[10px] font-mono mb-3 uppercase">{member.department}</p>
                    
                    {member.bio && (
                      <p className="text-white/60 text-xs leading-relaxed mb-6 font-semibold line-clamp-3">
                        {member.bio}
                      </p>
                    )}
                  </div>

                  {/* Social icons block */}
                  <div className="flex items-center justify-center gap-2 pt-4 border-t border-white/5">
                    {member.linkedinUrl && (
                      <a 
                        href={member.linkedinUrl} 
                        target="_blank" 
                        rel="noopener noreferrer" 
                        className="p-2.5 rounded-lg bg-white/3 border border-white/5 text-gray-400 hover:text-[#00ff88] hover:bg-[#00ff88]/10 hover:border-[#00ff88]/20 transition-all"
                        title="LinkedIn Profile"
                      >
                        <Linkedin className="w-4 h-4" />
                      </a>
                    )}
                    {member.githubUrl && (
                      <a 
                        href={member.githubUrl} 
                        target="_blank" 
                        rel="noopener noreferrer" 
                        className="p-2.5 rounded-lg bg-white/3 border border-white/5 text-gray-400 hover:text-[#00ff88] hover:bg-[#00ff88]/10 hover:border-[#00ff88]/20 transition-all"
                        title="GitHub Profile"
                      >
                        <Github className="w-4 h-4" />
                      </a>
                    )}
                    {member.xUrl && (
                      <a 
                        href={member.xUrl} 
                        target="_blank" 
                        rel="noopener noreferrer" 
                        className="p-2.5 rounded-lg bg-white/3 border border-white/5 text-gray-400 hover:text-[#00ff88] hover:bg-[#00ff88]/10 hover:border-[#00ff88]/20 transition-all"
                        title="X Profile"
                      >
                        <Twitter className="w-4 h-4" />
                      </a>
                    )}
                    {member.gfgUrl && (
                      <a 
                        href={member.gfgUrl} 
                        target="_blank" 
                        rel="noopener noreferrer" 
                        className="p-2.5 rounded-lg bg-white/3 border border-white/5 text-[9px] font-black uppercase tracking-wider font-mono text-gray-400 hover:text-[#00ff88] hover:bg-[#00ff88]/10 hover:border-[#00ff88]/20 transition-all px-3"
                        title="GFG Profile"
                      >
                        GFG
                      </a>
                    )}
                    {member.email && (
                      <a 
                        href={`mailto:${member.email}`}
                        className="p-2.5 rounded-lg bg-white/3 border border-white/5 text-gray-400 hover:text-[#00ff88] hover:bg-[#00ff88]/10 hover:border-[#00ff88]/20 transition-all"
                        title="Send Mail"
                      >
                        <Mail className="w-4 h-4" />
                      </a>
                    )}
                  </div>

                </motion.div>
              ))}
            </div>
          ) : (
            <div className="p-12 text-center bg-[#0c0c0c] border border-white/5 rounded-[2rem] max-w-2xl mx-auto text-white/30 font-mono text-xs">
              Chapters dynamic cores are currently offline. Check back shortly as our administrators configure live listings.
            </div>
          )}
        </div>

        {/* SECTION 4: CALL TO ACTION */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="p-10 md:p-12 rounded-[2.5rem] bg-[#0c0c0c] border border-white/5 flex flex-col md:flex-row items-center justify-between gap-8 relative overflow-hidden shadow-2xl"
        >
          <div className="absolute top-0 left-0 w-64 h-64 bg-[#00ff88]/2 rounded-full blur-[120px] pointer-events-none" />
          <div className="flex flex-col md:flex-row items-center space-y-4 md:space-y-0 md:space-x-8 text-left relative z-10">
            <div className="w-16 h-16 rounded-2xl bg-[#00ff88]/10 border border-[#00ff88]/20 flex items-center justify-center text-[#00ff88] shrink-0 shadow-sm">
              <Users className="w-8 h-8 animate-pulse" />
            </div>
            <div>
              <h3 className="text-2xl font-black text-white mb-1 tracking-tighter uppercase leading-tight">Want to join us?</h3>
              <p className="text-white/40 text-sm font-semibold">We are always looking for passionate individuals to join our core team.</p>
            </div>
          </div>
          <a
            href="https://docs.google.com/forms/d/e/1FAIpQLSdRFDcPsYn5rVtF3kIB3CAJ4rKPTsYHCY6YbQNkihsb3rvXDg/viewform?usp=publish-editor"
            target="_blank"
            rel="noopener noreferrer"
            className="relative z-10 px-8 py-4.5 bg-[#00ff88] text-black font-black rounded-xl hover:scale-105 active:scale-95 transition-all shadow-sm uppercase tracking-widest text-[10px] flex items-center justify-center gap-1.5 font-bold"
          >
            Apply Now <ArrowRight className="w-4.5 h-4.5 text-black" />
          </a>
        </motion.div>

      </div>
    </motion.div>
  );
}
