import { motion } from "motion/react";
import { Sparkles } from "lucide-react";

export function DynamicExperience() {
  return (
    <section className="py-32 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="relative rounded-[60px] overflow-hidden glass-premium border-white/5 p-16 md:p-24 text-center min-h-[500px] flex flex-col items-center justify-center group"
        >
          <div className="absolute inset-0 z-0">
            <img 
              src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?q=80&w=2071&auto=format&fit=crop" 
              alt="MU Experience" 
              className="w-full h-full object-cover opacity-30 transition-all duration-1000"
              referrerPolicy="no-referrer"
            />
            <div className="absolute inset-0 bg-[#050505]/60" />
          </div>

          <div className="relative z-10 max-w-3xl">
            <motion.div
              animate={{ rotate: [0, 360] }}
              transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
              className="w-20 h-20 mx-auto mb-10 rounded-full border border-[#00ff88]/20 flex items-center justify-center"
            >
              <Sparkles className="w-8 h-8 text-[#00ff88] animate-pulse" />
            </motion.div>
            <h2 className="text-4xl md:text-6xl font-black text-white mb-8 tracking-tighter uppercase leading-tight">
              An Immersive <br />
              <span className="text-[#00ff88]">Technical</span> Experience
            </h2>
            <p className="text-white/40 text-lg md:text-xl font-medium leading-relaxed uppercase tracking-[0.2em]">
              Building the next generation of engineers through collaborative innovation
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

export function QuoteSection() {
  return (
    <section className="py-40 bg-[#050505] relative overflow-hidden">
      <div className="max-w-4xl mx-auto px-6 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <div className="text-6xl text-[#00ff88] font-serif mb-10 opacity-30">“</div>
          <h2 className="text-3xl md:text-5xl font-black text-white italic tracking-tight leading-snug mb-10 uppercase">
            This is more than a community — it’s the beginning of <span className="text-[#00ff88]">something impactful.</span>
          </h2>
          <div className="w-12 h-1 bg-[#00ff88] mx-auto rounded-full mb-6" />
          <p className="text-white/40 font-bold uppercase tracking-widest text-[10px]">GFG @ Marwadi University</p>
        </motion.div>
      </div>
      
      {/* Background Decorative Blurs */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-[#00ff88]/5 blur-[150px] rounded-[100%] -z-10" />
    </section>
  );
}
