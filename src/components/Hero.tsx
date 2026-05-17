import { motion } from "motion/react";
import { Link } from "react-router-dom";
import { ArrowRight, Calendar } from "lucide-react";

export default function Hero() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden py-20 bg-[#050505]">
      {/* Background YouTube Video */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none bg-black">
        <iframe
          src="https://www.youtube.com/embed/IVqOajz5Hw0?autoplay=1&mute=1&loop=1&controls=0&modestbranding=1&rel=0&playlist=IVqOajz5Hw0&playsinline=1&enablejsapi=1&iv_load_policy=3"
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 min-w-full min-h-full w-[177.77777778vh] h-[56.25vw] opacity-80 pointer-events-none scale-105"
          allow="autoplay; encrypted-media"
          title="Hero Background"
          style={{ 
            filter: "brightness(1.1) contrast(1.1)",
            border: "none"
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[#050505]/40 via-transparent to-[#050505]/80 z-1" />
      </div>

      {/* Background Decorative Rings */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full flex items-center justify-center pointer-events-none opacity-10">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
          className="absolute w-[300px] h-[300px] md:w-[600px] md:h-[600px] border border-[#00ff88]/20 rounded-full border-t-transparent border-l-transparent"
        />
        <motion.div
          animate={{ rotate: -360 }}
          transition={{ duration: 45, repeat: Infinity, ease: "linear" }}
          className="absolute w-[350px] h-[350px] md:w-[700px] md:h-[700px] border border-dashed border-[#00ff88]/10 rounded-full"
        />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: "easeOut" }}
          className="flex flex-col items-center"
        >
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="text-6xl md:text-8xl lg:text-9xl font-black tracking-tighter mb-8 leading-none"
          >
            <span className="text-white">STUDENT </span>
            <span className="text-[#00ff88]">CHAPTER</span>
          </motion.h1>
          
          {/* Tagline Container */}
          <motion.div
            initial={{ opacity: 0, width: 0 }}
            animate={{ opacity: 1, width: "auto" }}
            transition={{ delay: 0.6, duration: 0.8 }}
            className="inline-flex items-center px-8 py-4 mb-12 bg-white/5 border border-white/10 backdrop-blur-xl rounded-full overflow-hidden whitespace-nowrap"
          >
            <p className="text-sm md:text-lg font-medium text-white/60 tracking-wide">
              Think Smart, <span className="text-[#00ff88] font-bold uppercase">Code Smarter.</span> GeeksforGeeks @ Marwadi University
            </p>
          </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-6"
        >
          <Link
            to="/about"
            className="group relative px-12 py-5 bg-[#00ff88] text-black font-black rounded-2xl overflow-hidden transition-all hover:scale-105 active:scale-95 shadow-[0_0_40px_rgba(0,255,136,0.2)]"
          >
            <span className="relative flex items-center text-sm uppercase tracking-widest">
              Join Movement <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </span>
          </Link>
          <Link
            to="/events"
            className="px-12 py-5 bg-white/5 border border-white/10 text-white font-black rounded-2xl hover:bg-white hover:text-black transition-all active:scale-95 flex items-center text-sm uppercase tracking-widest shadow-sm"
          >
            Explore Events <Calendar className="ml-2 w-5 h-5 opacity-50" />
          </Link>
        </motion.div>
        </motion.div>
      </div>

      {/* Decorative Elements */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-1/4 right-[5%] w-64 h-64 bg-[#00ff88]/5 rounded-full blur-3xl opacity-20" />
        <div className="absolute bottom-1/4 left-[5%] w-96 h-96 bg-[#00ff88]/5 rounded-full blur-3xl opacity-20" />
      </div>
    </section>
  );
}
