import { motion, useScroll, useTransform } from "motion/react";
import { useRef } from "react";

export default function AboutUniversityStory() {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"]
  });

  const scale = useTransform(scrollYProgress, [0, 1], [0.8, 1.1]);

  return (
    <section ref={ref} className="py-32 bg-theme-bg overflow-hidden text-theme-text border-b border-theme-border theme-transition">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex flex-col lg:flex-row items-center gap-20">
          <div className="lg:w-1/2">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <h2 className="text-4xl md:text-7xl font-black text-theme-text mb-8 leading-[0.9] uppercase tracking-tighter">
                Where Ambition <br />
                <span className="text-gfg-primary neon-glow">Meets Opportunity</span>
              </h2>
              <div className="w-20 h-2 bg-gfg-primary mb-12 rounded-full" />
              <p className="text-theme-text-secondary text-xl font-medium leading-relaxed mb-10">
                At Marwadi University, education goes beyond classrooms — it builds innovators, problem-solvers, and future leaders.
              </p>
              <div className="grid grid-cols-2 gap-8">
                <div>
                  <h4 className="text-gfg-primary font-black uppercase tracking-widest text-xs mb-2">Innovation</h4>
                  <p className="text-theme-text-muted text-sm font-medium">Cutting-edge labs and industry partnerships for hands-on learning.</p>
                </div>
                <div>
                  <h4 className="text-gfg-primary font-black uppercase tracking-widest text-xs mb-2">Leadership</h4>
                  <p className="text-theme-text-muted text-sm font-medium">Empowering students to take charge of their career journey.</p>
                </div>
              </div>
            </motion.div>
          </div>

          <div className="lg:w-1/2 relative">
            <motion.div
              style={{ scale }}
              className="relative rounded-[60px] overflow-hidden border border-theme-border aspect-[4/5] shadow-lg"
            >
              <img 
                src="https://images.unsplash.com/photo-1541339907198-e08759dfc3ef?q=80&w=2070&auto=format&fit=crop" 
                alt="Marwadi University Story" 
                className="w-full h-full object-cover transition-all"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-theme-bg-secondary via-transparent to-transparent" />
              <div className="absolute inset-0 bg-gfg-primary/5 mix-blend-color" />
              
              {/* Glowing Accents */}
              <div className="absolute top-10 right-10 w-32 h-32 bg-gfg-primary/10 blur-[100px] rounded-full" />
              <div className="absolute bottom-20 left-10 w-20 h-20 bg-gfg-primary/5 blur-[80px] rounded-full" />
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
