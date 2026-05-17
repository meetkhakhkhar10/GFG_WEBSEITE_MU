import { motion } from "motion/react";
import { Github, Linkedin, Twitter, Globe, ArrowRight, Users } from "lucide-react";

const team = [
  {
    name: "Meet Khakhkhar",
    role: "Developer / Organizer",
    description: "Passionate about building technical communities and fostering innovation. Leading the GFG Student Chapter at Marwadi University.",
    image: "https://media.licdn.com/dms/image/v2/D5603AQHZ1_NcFRFxsA/profile-displayphoto-scale_100_100/B56ZraxYpMHAAg-/0/1764606972214?e=1780531200&v=beta&t=WGwXotw3XPsJ5YIMdmPARmCQy44Wj6B-iBLuX0EjRfc",
    socials: {
      github: "https://github.com/meetkhakhkhar",
      linkedin: "https://www.linkedin.com/in/meet-khakhkhar23/",
      twitter: "#"
    }
  },
  {
    name: "Technical Lead",
    role: "System Architect",
    description: "Expert in full-stack development and system architecture. Driving technical excellence in our projects.",
    image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=400&h=400&auto=format&fit=crop",
    socials: {
      github: "#",
      linkedin: "#",
      twitter: "#"
    }
  },
  {
    name: "Event Coordinator",
    role: "Strategy & Ops",
    description: "Specializes in organizing high-impact technical events and workshops for the student community.",
    image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=400&h=400&auto=format&fit=crop",
    socials: {
      github: "#",
      linkedin: "#",
      twitter: "#"
    }
  },
  {
    name: "Content Strategist",
    role: "Creative Lead",
    description: "Dedicated to creating engaging technical content and managing our community outreach.",
    image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=400&h=400&auto=format&fit=crop",
    socials: {
      github: "#",
      linkedin: "#",
      twitter: "#"
    }
  }
];

export default function Team() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="py-20 bg-[#050505]"
    >
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-24">
          <div className="inline-flex items-center space-x-2 px-4 py-1.5 mb-6 text-[10px] font-black tracking-widest text-[#00ff88] uppercase bg-[#00ff88]/10 border border-[#00ff88]/20 rounded-full">
            <span className="w-1.5 h-1.5 bg-[#00ff88] rounded-full" />
            <span>Community Leaders</span>
          </div>
          <h1 className="text-5xl md:text-7xl font-black text-white mb-8 tracking-tighter uppercase">
            Meet the <span className="text-[#00ff88]">Team</span>
          </h1>
          <p className="text-white/40 max-w-2xl mx-auto text-lg leading-relaxed mb-12 font-medium">
            The dedicated individuals behind the GFG Student Chapter at Marwadi University, working together to build a vibrant technical community.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-32">
          {team.map((member, i) => (
            <motion.div
              key={member.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="group relative p-8 rounded-[40px] glass-premium border-white/5 hover:border-[#00ff88]/30 transition-all text-center"
            >
              <div className="w-32 h-32 mx-auto mb-8 rounded-[38px] overflow-hidden border-4 border-white/5 group-hover:border-[#00ff88]/20 transition-all duration-700 shadow-xl">
                <img 
                  src={member.image} 
                  alt={member.name} 
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000"
                  referrerPolicy="no-referrer"
                />
              </div>
              <h3 className="text-2xl font-black text-white mb-2 group-hover:text-[#00ff88] transition-colors leading-tight uppercase tracking-tighter">
                {member.name}
              </h3>
              <p className="text-[#00ff88] text-[10px] font-black tracking-widest uppercase mb-6">{member.role}</p>
              <p className="text-white/40 text-sm leading-relaxed mb-8 font-medium">{member.description}</p>
              
              <div className="flex flex-col items-center space-y-4">
                <div className="flex items-center justify-center space-x-4">
                  <a href={member.socials.github} className="p-3 rounded-xl bg-white/5 border border-white/10 text-white/40 hover:text-[#00ff88] transition-all">
                    <Github className="w-5 h-5" />
                  </a>
                  <a href={member.socials.linkedin} target="_blank" rel="noopener noreferrer" className="p-3 rounded-xl bg-white/5 border border-white/10 text-white/40 hover:text-[#0077b5] transition-all">
                    <Linkedin className="w-5 h-5" />
                  </a>
                  <a href={member.socials.twitter} className="p-3 rounded-xl bg-white/5 border border-white/10 text-white/40 hover:text-[#1da1f2] transition-all">
                    <Twitter className="w-5 h-5" />
                  </a>
                </div>
                
                <a 
                  href={member.socials.linkedin} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="w-full py-3 bg-white/5 border border-white/10 text-white text-[10px] font-black uppercase tracking-widest rounded-xl hover:bg-[#00ff88] hover:text-black hover:border-transparent transition-all"
                >
                  View LinkedIn Profile →
                </a>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Join the Team CTA */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="p-16 rounded-[60px] glass-premium border-white/10 flex flex-col md:flex-row items-center justify-between gap-8 relative overflow-hidden"
        >
          <div className="absolute top-0 left-0 w-64 h-64 bg-[#00ff88]/5 rounded-full blur-[120px] pointer-events-none" />
          <div className="flex items-center space-x-8 text-left relative z-10">
            <div className="w-20 h-20 rounded-3xl bg-[#00ff88]/10 border border-[#00ff88]/20 flex items-center justify-center text-[#00ff88]">
              <Users className="w-10 h-10" />
            </div>
            <div>
              <h3 className="text-3xl font-black text-white mb-2 tracking-tighter uppercase">Want to join us?</h3>
              <p className="text-white/40 font-medium">We are always looking for passionate individuals to join our core team.</p>
            </div>
          </div>
          <button className="relative z-10 px-12 py-5 bg-[#00ff88] text-black font-black rounded-2xl hover:scale-105 transition-all whitespace-nowrap shadow-[0_0_30px_rgba(0,255,136,0.3)] uppercase tracking-widest text-sm">
            Apply Now <ArrowRight className="ml-2 w-6 h-6" />
          </button>
        </motion.div>
      </div>
    </motion.div>
  );
}
