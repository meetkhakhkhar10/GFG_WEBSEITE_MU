import { motion } from "motion/react";
import { GraduationCap, Award, Globe, Users, ArrowRight } from "lucide-react";

const features = [
  {
    title: "NAAC A+ Accredited",
    description: "Marwadi University is NAAC A+ accredited, ensuring the highest standards of education and infrastructure in Gujarat.",
    icon: Award,
  },
  {
    title: "Technical Excellence",
    description: "We are committed to fostering a culture of technical excellence and innovation among MU students.",
    icon: GraduationCap,
  },
  {
    title: "Global Network",
    description: "Part of the global GeeksforGeeks network, connecting MU students with industry experts and global peers.",
    icon: Globe,
  },
  {
    title: "Student-Led Growth",
    description: "A vibrant community driven by students, for students, focusing on peer learning and professional growth.",
    icon: Users,
  },
];

export default function About() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="py-32 bg-[#000] min-h-screen text-white"
    >
      <div className="max-w-7xl mx-auto px-6">
        {/* Hero Section */}
        <div className="relative rounded-[60px] overflow-hidden bg-[#0a0a0a] border border-white/5 mb-24 min-h-[600px] flex items-center shadow-2xl">
          <div className="absolute inset-0 z-0">
              <img 
                src="https://images.unsplash.com/photo-1562774053-701939374585?q=80&w=1986&auto=format&fit=crop" 
                alt="Marwadi University Campus" 
                className="w-full h-full object-cover opacity-30 contrast-110"
                referrerPolicy="no-referrer"
              />
            <div className="absolute inset-0 bg-gradient-to-r from-[#0a0a0a] via-[#0a0a0a]/90 to-transparent" />
          </div>
          
          <div className="relative z-10 p-12 md:p-20 max-w-2xl">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
            >
              <div className="inline-flex items-center space-x-2 px-4 py-1.5 mb-8 text-[10px] font-black tracking-widest text-[#00ff88] uppercase bg-[#00ff88]/10 border border-[#00ff88]/20 rounded-full">
                <span className="w-1.5 h-1.5 bg-[#00ff88] rounded-full animate-pulse" />
                <span>Excellence Unfolded</span>
              </div>
              <h1 className="text-5xl md:text-8xl font-black text-white mb-8 leading-[0.85] tracking-tighter uppercase">
                About <br />
                <span className="text-[#00ff88] neon-glow">Marwadi</span> University
              </h1>
              <p className="text-white/40 text-lg mb-12 leading-relaxed font-medium uppercase tracking-widest text-[10px]">
                Marwadi University is a NAAC A+ accredited institution committed to excellence in education, innovation, and holistic development. We nurture future-ready professionals and responsible citizens.
              </p>
              <button className="px-10 py-5 bg-[#00ff88] text-black font-black rounded-2xl hover:bg-white transition-all flex items-center shadow-[0_0_20px_rgba(0,255,136,0.3)] border border-[#00ff88]/20 uppercase tracking-widest text-xs">
                Discover More <ArrowRight className="ml-2 w-5 h-5 leading-none" />
              </button>
            </motion.div>
          </div>
        </div>

        {/* Highlights Section */}
        <div className="text-center mb-24">
          <span className="text-[#00ff88] text-[10px] font-black uppercase tracking-[0.3em] mb-4 block">Core Values</span>
          <h2 className="text-4xl md:text-7xl font-black text-white mb-8 tracking-tighter uppercase">Our Key <span className="text-[#00ff88]">Highlights</span></h2>
          <div className="w-24 h-1 bg-[#00ff88] mx-auto rounded-full shadow-[0_0_10px_#00ff88]" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-32">
          {[
            {
              title: "Campus",
              description: "A modern, eco-friendly campus with state-of-the-art infrastructure and a vibrant learning environment.",
              icon: Globe,
              link: "Explore Campus"
            },
            {
              title: "Programs",
              description: "Diverse programs across engineering, management, law, design, and more, designed for global careers.",
              icon: GraduationCap,
              link: "View Degrees"
            },
            {
              title: "Achievements",
              description: "Recognized for academic excellence, innovation, and global collaborations that inspire student success.",
              icon: Award,
              link: "Read More"
            }
          ].map((item, i) => (
            <motion.div
              key={item.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="p-12 rounded-[40px] bg-[#0a0a0a] border border-white/5 hover:border-[#00ff88]/30 hover:bg-[#111] transition-all group relative overflow-hidden h-full flex flex-col"
            >
              <div className="w-16 h-16 mb-10 rounded-2xl bg-[#00ff88]/5 border border-[#00ff88]/20 text-[#00ff88] flex items-center justify-center group-hover:scale-110 group-hover:bg-[#00ff88] group-hover:text-black transition-all">
                <item.icon className="w-8 h-8" />
              </div>
              <h3 className="text-2xl font-black text-white mb-6 uppercase tracking-tighter group-hover:text-[#00ff88] transition-colors">{item.title}</h3>
              <p className="text-white/40 font-medium leading-relaxed mb-10 uppercase tracking-widest text-[10px] flex-grow">{item.description}</p>
              <button className="flex items-center text-[#00ff88] font-black text-[10px] uppercase tracking-widest hover:text-white transition-colors">
                {item.link} <ArrowRight className="ml-2 w-4 h-4" />
              </button>
            </motion.div>
          ))}
        </div>

        {/* CTA Section */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="p-16 rounded-[60px] bg-[#0a0a0a] border border-white/5 flex flex-col lg:flex-row items-center justify-between gap-12 relative overflow-hidden shadow-2xl"
        >
          <div className="absolute top-0 right-0 w-96 h-96 bg-[#00ff88]/5 rounded-full blur-[150px] pointer-events-none" />
          <div className="flex items-center space-x-10 text-left relative z-10">
            <div className="w-24 h-24 rounded-[32px] bg-white/5 border border-white/10 flex items-center justify-center text-[#00ff88]">
              <GraduationCap className="w-12 h-12" />
            </div>
            <div>
              <h3 className="text-4xl font-black text-white mb-4 tracking-tighter uppercase leading-tight">Empowering Minds. <br /><span className="text-[#00ff88]">Shaping Futures.</span></h3>
              <p className="text-white/40 font-medium uppercase tracking-widest text-[10px]">At Marwadi University, we believe in education that transforms lives.</p>
            </div>
          </div>
          <button className="relative z-10 px-12 py-5 bg-[#00ff88] text-black font-black rounded-2xl hover:bg-white transition-all whitespace-nowrap flex items-center shadow-[0_0_30px_rgba(0,255,136,0.2)] uppercase tracking-widest text-xs">
            Learn More <ArrowRight className="ml-2 w-6 h-6" />
          </button>
        </motion.div>
      </div>
    </motion.div>
  );
}
