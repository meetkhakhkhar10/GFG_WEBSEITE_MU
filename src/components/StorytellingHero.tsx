import { motion, useScroll, useTransform } from "motion/react";
import { ArrowRight, Code, Brain, Rocket } from "lucide-react";
import { useRef } from "react";

export default function StorytellingHero() {
  const containerRef = useRef(null);
  const { scrollY } = useScroll();
  const y1 = useTransform(scrollY, [0, 500], [0, 200]);
  const opacity = useTransform(scrollY, [0, 300], [1, 0]);

  return (
    <section ref={containerRef} className="relative min-h-screen flex items-center justify-center pt-20 overflow-hidden">
      {/* Background Story Visuals */}
      <motion.div 
        style={{ y: y1, opacity }}
        className="absolute inset-0 z-0"
      >
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#050505]/80 to-[#050505]" />
        <img 
          src="https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?q=80&w=2070&auto=format&fit=crop" 
          alt="Collaboration Visual" 
          className="w-full h-full object-cover opacity-40"
          referrerPolicy="no-referrer"
        />
      </motion.div>

      <div className="max-w-7xl mx-auto px-6 relative z-10 text-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.2 }}
          className="mb-8"
        >
          <span className="inline-flex items-center space-x-2 px-4 py-1.5 rounded-full border border-[#00ff88]/30 bg-[#00ff88]/5 text-[#00ff88] text-[10px] font-black uppercase tracking-[0.3em] backdrop-blur-md mb-8">
            <Rocket className="w-3 h-3 mr-2" />
            <span>The Future of Code</span>
          </span>
          <h1 className="text-6xl md:text-9xl font-black tracking-tighter leading-[0.85] mb-8 text-white">
            WHERE <span className="text-[#00ff88] neon-glow">AMBITION</span> <br />
            MEETS OPPORTUNITY
          </h1>
          <p className="text-white/40 max-w-2xl mx-auto text-lg md:text-xl font-medium leading-relaxed mb-12">
            At Marwadi University, education goes beyond classrooms — it builds innovators, problem-solvers, and future leaders.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
            <button className="group relative px-12 py-5 bg-[#00ff88] text-black font-black uppercase tracking-widest text-sm rounded-full overflow-hidden transition-all hover:scale-105 active:scale-95 shadow-[0_0_30px_rgba(0,255,136,0.3)]">
              <span className="relative z-10 flex items-center">
                Start Your Journey <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </span>
            </button>
            <button className="px-12 py-5 bg-white/5 border border-white/10 text-white font-black uppercase tracking-widest text-sm rounded-full backdrop-blur-xl hover:bg-white/10 transition-all">
              Learn More
            </button>
          </div>
        </motion.div>

        {/* Micro-interactions: Floating Tech Cards */}
        <div className="hidden lg:block absolute inset-0 pointer-events-none">
          <motion.div
            animate={{ y: [0, -20, 0] }}
            transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
            className="absolute top-1/4 left-10 p-4 glass-premium rounded-2xl border-white/5"
          >
            <Code className="w-6 h-6 text-[#00ff88]" />
          </motion.div>
          <motion.div
            animate={{ y: [0, 20, 0] }}
            transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
            className="absolute bottom-1/4 right-20 p-4 glass-premium rounded-2xl border-white/5"
          >
            <Brain className="w-6 h-6 text-[#00ff88]" />
          </motion.div>
        </div>
      </div>
    </section>
  );
}
