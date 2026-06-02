import { motion } from "motion/react";
import { Github, Linkedin, Twitter, Users, ArrowRight } from "lucide-react";

const team = [
  {
    name: "Meet Khakhkhar",
    role: "Team Lead",
    description: "Passionate about building technical communities and fostering innovation. Leading the GFG Student Chapter at Marwadi University.",
    image: "https://media.licdn.com/dms/image/v2/D5603AQHZ1_NcFRFxsA/profile-displayphoto-scale_100_100/B56ZraxYpMHAAg-/0/1764606972214?e=1780531200&v=beta&t=WGwXotw3XPsJ5YIMdmPARmCQy44Wj6B-iBLuX0EjRfc",
    socials: {
      github: "https://github.com/meetkhakhkhar",
      linkedin: "https://www.linkedin.com/in/meet-khakhkhar23/",
      twitter: "#"
    }
  },
  {
    name: "Campus Mantri",
    role: "Campus Mantri at Marwadi University",
    description: "Fostering community engagement and connecting our student activities with campus-wide tech initiatives at Marwadi University.",
    image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=400&h=400&auto=format&fit=crop",
    socials: {
      github: "#",
      linkedin: "https://www.linkedin.com/in/meet-khakhkhar23/",
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
      className="py-32 bg-theme-bg min-h-screen text-theme-text relative overflow-hidden theme-transition"
    >
      <div className="absolute top-0 left-1/4 w-[400px] h-[400px] bg-gfg-primary/3 blur-[120px] rounded-full pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 relative z-10 w-full">
        <div className="text-center mb-16">
          <div className="inline-flex items-center space-x-2 px-4 py-1.5 mb-6 text-[10px] font-black tracking-widest text-gfg-primary uppercase bg-gfg-primary/10 border border-gfg-primary/20 rounded-full shadow-sm">
            <span className="w-1.5 h-1.5 bg-gfg-primary rounded-full" />
            <span>Community Leaders</span>
          </div>
          <h1 className="text-4xl md:text-7xl font-black text-theme-text mb-6 tracking-tighter uppercase leading-none italic">
            Meet the <span className="text-gfg-primary">Team</span>
          </h1>
          <p className="text-theme-text-secondary max-w-2xl mx-auto text-sm md:text-base mb-8 font-semibold leading-relaxed">
            The dedicated individuals behind the GFG Student Chapter at Marwadi University, working together to build a vibrant technical community.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto mb-20">
          {team.map((member, i) => (
            <motion.div
              key={member.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="group relative p-8 rounded-[2.5rem] bg-theme-bg-secondary border border-theme-border hover:border-gfg-primary/35 transition-all text-center shadow-sm"
            >
              <div className="w-28 h-28 mx-auto mb-6 rounded-[2rem] overflow-hidden border-2 border-theme-border group-hover:border-gfg-primary/30 transition-all shadow-md">
                <img 
                  src={member.image} 
                  alt={member.name} 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  referrerPolicy="no-referrer"
                />
              </div>
              <h3 className="text-2xl font-black text-theme-text mb-1.5 group-hover:text-gfg-primary transition-colors leading-tight uppercase tracking-tight">
                {member.name}
              </h3>
              <p className="text-gfg-primary text-[10px] font-black tracking-widest uppercase mb-4">{member.role}</p>
              <p className="text-theme-text-secondary text-sm leading-relaxed mb-6 font-semibold">{member.description}</p>
              
              <div className="flex flex-col items-center space-y-4">
                <div className="flex items-center justify-center space-x-3">
                  <a href={member.socials.github} className="p-3 rounded-lg bg-theme-bg border border-theme-border text-theme-text-muted hover:text-gfg-primary transition-all shadow-sm">
                    <Github className="w-4 h-4" />
                  </a>
                  <a href={member.socials.linkedin} target="_blank" rel="noopener noreferrer" className="p-3 rounded-lg bg-theme-bg border border-theme-border text-theme-text-muted hover:text-[#0077b5] transition-all shadow-sm">
                    <Linkedin className="w-4 h-4" />
                  </a>
                </div>
                
                <a 
                  href={member.socials.linkedin} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="w-full h-11 flex items-center justify-center bg-theme-bg border border-theme-border text-theme-text text-[10px] font-black uppercase tracking-widest rounded-xl hover:bg-gfg-primary hover:text-black hover:border-transparent transition-all shadow-sm"
                >
                  View LinkedIn Profile &nbsp;&rarr;
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
          className="p-10 md:p-12 rounded-[2.5rem] bg-theme-bg-secondary border border-theme-border flex flex-col md:flex-row items-center justify-between gap-8 relative overflow-hidden shadow-sm"
        >
          <div className="absolute top-0 left-0 w-64 h-64 bg-gfg-primary/5 rounded-full blur-[120px] pointer-events-none" />
          <div className="flex flex-col md:flex-row items-center space-y-4 md:space-y-0 md:space-x-8 text-left relative z-10">
            <div className="w-16 h-16 rounded-2xl bg-gfg-primary/10 border border-gfg-primary/25 flex items-center justify-center text-gfg-primary shrink-0 shadow-sm">
              <Users className="w-8 h-8" />
            </div>
            <div>
              <h3 className="text-2xl font-black text-theme-text mb-1 tracking-tighter uppercase leading-tight">Want to join us?</h3>
              <p className="text-theme-text-secondary text-sm font-semibold">We are always looking for passionate individuals to join our core team.</p>
            </div>
          </div>
          <a
            href="https://docs.google.com/forms/d/e/1FAIpQLSdRFDcPsYn5rVtF3kIB3CAJ4rKPTsYHCY6YbQNkihsb3rvXDg/viewform?usp=publish-editor"
            target="_blank"
            rel="noopener noreferrer"
            className="relative z-10 px-8 py-4.5 bg-gfg-primary text-black font-black rounded-xl hover:scale-105 transition-all shadow-sm uppercase tracking-widest text-[10px] flex items-center justify-center gap-1.5"
          >
            Apply Now <ArrowRight className="w-4.5 h-4.5" />
          </a>
        </motion.div>
      </div>
    </motion.div>
  );
}
