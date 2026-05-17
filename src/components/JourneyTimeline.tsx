import { motion } from "motion/react";
import { Book, Code, Users, Rocket } from "lucide-react";

const steps = [
  {
    title: "Learn",
    description: "Strong fundamentals and industry-relevant knowledge",
    icon: Book,
    color: "from-emerald-500 to-[#00ff88]"
  },
  {
    title: "Build",
    description: "Hands-on projects and coding practice",
    icon: Code,
    color: "from-[#00ff88] to-cyan-500"
  },
  {
    title: "Collaborate",
    description: "Community-driven learning and teamwork",
    icon: Users,
    color: "from-cyan-500 to-blue-500"
  },
  {
    title: "Grow",
    description: "Career readiness and opportunities",
    icon: Rocket,
    color: "from-blue-500 to-indigo-500"
  }
];

export default function JourneyTimeline() {
  return (
    <section className="py-32 relative overflow-hidden bg-[#050505]">
      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="text-center mb-20">
          <h2 className="text-4xl md:text-6xl font-black text-white mb-6 tracking-tighter">THE <span className="text-[#00ff88]">JOURNEY</span></h2>
          <p className="text-white/40 max-w-xl mx-auto uppercase tracking-[0.2em] font-bold text-xs">A Step-by-Step Technical Ecosystem</p>
        </div>

        <div className="relative mt-24">
          {/* Connecting Line */}
          <div className="absolute top-1/2 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-[#00ff88]/20 to-transparent hidden md:block" />
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 relative z-10">
            {steps.map((step, i) => (
              <motion.div
                key={step.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.2 }}
                className="group flex flex-col items-center text-center"
              >
                <div className="relative mb-10 w-24 h-24">
                  {/* Glow Ring */}
                  <div className="absolute inset-0 bg-gradient-to-br from-[#00ff88]/50 to-transparent blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  
                  <div className="relative w-full h-full glass-premium rounded-full flex items-center justify-center border-white/10 group-hover:border-[#00ff88]/30 group-hover:scale-110 transition-all duration-500">
                    <step.icon className="w-8 h-8 text-[#00ff88]" />
                  </div>
                  
                  {/* Numbering */}
                  <div className="absolute -top-2 -right-2 w-8 h-8 rounded-full bg-[#00ff88] text-black text-[10px] font-black flex items-center justify-center border-4 border-[#050505]">
                    {i + 1}
                  </div>
                </div>

                <h3 className="text-2xl font-black text-white mb-4 group-hover:text-[#00ff88] transition-colors tracking-tight uppercase">{step.title}</h3>
                <p className="text-white/40 leading-relaxed font-medium group-hover:text-white/60 transition-colors uppercase tracking-widest text-[10px]">{step.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
