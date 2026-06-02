import { motion } from "motion/react";
import { GraduationCap, Award, Globe, Users, ArrowRight } from "lucide-react";

export default function About() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="bg-theme-bg min-h-screen text-theme-text overflow-hidden relative theme-transition"
    >
      {/* Background Decor */}
      <div className="absolute inset-0 z-0 opacity-40">
        <div className="absolute top-0 left-0 w-full h-full bg-[linear-gradient(rgba(0,255,136,0.01)_1px,transparent_1px),linear-gradient(90deg,rgba(0,255,136,0.01)_1px,transparent_1px)] bg-[size:100px_100px] pointer-events-none" />
        <div className="absolute top-1/4 -left-20 w-[600px] h-[600px] bg-gfg-primary/5 rounded-full blur-[150px] pointer-events-none" />
      </div>

      <div className="max-w-7xl mx-auto px-6 pt-32 pb-24 relative z-10">
        {/* Futuristic Split Hero Section */}
        <div className="relative mb-24">
          <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-20">
            {/* Left Side: Premium Image Container */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
              className="w-full lg:w-[50%] relative"
            >
              <div className="relative rounded-[32px] overflow-hidden border border-theme-border shadow-sm aspect-[16/10]">
                <motion.img 
                  initial={{ scale: 1.1 }}
                  animate={{ scale: 1 }}
                  transition={{ duration: 15, repeat: Infinity, repeatType: "reverse", ease: "linear" }}
                  src="https://img-cdn.publive.online/fit-in/1280x960/filters:format(webp)/smstreet/media/media_files/2025/11/19/marwadi-university-2025-11-19-15-33-18.jpg" 
                  alt="Marwadi University Campus" 
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-theme-bg/10 backdrop-blur-[1px]" />
                <div className="absolute inset-0 bg-gradient-to-tr from-cyan-500/10 via-transparent to-gfg-primary/10" />
              </div>
              
              {/* Floating Tech Ornaments */}
              <motion.div 
                animate={{ y: [0, -12, 0] }}
                transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
                className="absolute -top-6 -right-6 w-20 h-20 bg-theme-bg-secondary border border-theme-border rounded-2xl flex items-center justify-center p-3 shadow-md hidden md:flex"
              >
                <div className="w-full h-full border border-gfg-primary/20 rounded-xl flex items-center justify-center">
                  <Globe className="w-6 h-6 text-gfg-primary" />
                </div>
              </motion.div>
            </motion.div>

            {/* Right Side: Content */}
            <motion.div 
              initial={{ opacity: 0, x: 60 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
              className="w-full lg:w-[50%] space-y-8 text-left"
            >
              <div className="space-y-4">
                <div className="inline-flex items-center space-x-2.5 px-4 py-1.5 bg-theme-bg-secondary border border-theme-border rounded-full shadow-sm">
                  <span className="w-1.5 h-1.5 rounded-full bg-cyan-500 shadow-[0_0_10px_var(--gfg-primary)] animate-pulse" />
                  <span className="text-[9px] font-black uppercase tracking-[0.3em] text-theme-text-muted">Innovation Hub • NAAC A+</span>
                </div>
                <h1 className="text-4xl sm:text-5xl md:text-6xl font-black text-theme-text leading-[1.05] tracking-tighter uppercase italic">
                  ABOUT <br />
                  <span className="text-gfg-primary">MARWADI</span> <br />
                  UNIVERSITY
                </h1>
              </div>

              <p className="text-theme-text-secondary text-base font-semibold leading-relaxed border-l-4 border-gfg-primary pl-6">
                Marwadi University is a NAAC A+ accredited institution focused on innovation, entrepreneurship, global exposure, and future-ready education. With advanced infrastructure, industry-driven learning, and a thriving innovation ecosystem, the university empowers the next generation of leaders.
              </p>

              <div className="flex flex-wrap gap-4 pt-2">
                <a 
                  href="https://www.marwadiuniversity.ac.in/campus/" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="group relative px-8 py-4 bg-gfg-primary text-black font-black uppercase text-[10px] tracking-widest rounded-xl hover:bg-theme-text hover:text-theme-bg transition-all duration-300 shadow-sm flex items-center"
                >
                  EXPLORE CAMPUS <ArrowRight className="ml-2 w-4 h-4 transition-transform group-hover:translate-x-1" />
                </a>
                <a 
                  href="https://www.marwadiuniversity.ac.in/programs/" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="px-8 py-4 bg-theme-bg-secondary border border-theme-border text-theme-text font-black uppercase text-[10px] tracking-widest rounded-xl hover:bg-theme-text hover:text-theme-bg transition-all duration-300 flex items-center shadow-sm"
                >
                  VIEW PROGRAMS <ArrowRight className="ml-2 w-4 h-4 transition-transform group-hover:translate-x-1" />
                </a>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Highlights Section */}
        <div className="text-center mb-16">
          <span className="text-gfg-primary text-[10px] font-black uppercase tracking-[0.3em] mb-3 block">Core Values</span>
          <h2 className="text-3xl md:text-5xl font-black text-theme-text mb-6 tracking-tighter uppercase">Our Key <span className="text-gfg-primary">Highlights</span></h2>
          <div className="w-20 h-1 bg-gfg-primary mx-auto rounded-full" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-24">
          {[
            {
              title: "Campus",
              description: "A modern, eco-friendly campus with state-of-the-art infrastructure and a vibrant learning environment.",
              icon: Globe,
              link: "Explore Campus",
              href: "https://www.marwadiuniversity.ac.in/campus/"
            },
            {
              title: "Programs",
              description: "Diverse programs across engineering, management, law, design, and more, designed for global careers.",
              icon: GraduationCap,
              link: "View Degrees",
              href: "https://www.marwadiuniversity.ac.in/programs/"
            },
            {
              title: "Achievements",
              description: "Recognized for academic excellence, innovation, and global collaborations that inspire student success.",
              icon: Award,
              link: "Read Achievements",
              href: "https://www.marwadiuniversity.ac.in/campus/"
            }
          ].map((item, i) => (
            <motion.div
              key={item.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="p-8 rounded-[2rem] bg-theme-bg-secondary border border-theme-border hover:border-gfg-primary/30 transition-all duration-300 flex flex-col shadow-sm"
            >
              <div className="w-12 h-12 mb-6 rounded-xl bg-gfg-primary/10 border border-gfg-primary/20 text-gfg-primary flex items-center justify-center">
                <item.icon className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-black text-theme-text mb-4 uppercase tracking-tighter group-hover:text-gfg-primary transition-colors">{item.title}</h3>
              <p className="text-theme-text-secondary font-semibold leading-relaxed mb-6 flex-grow text-sm">{item.description}</p>
              <a 
                href={item.href}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center text-gfg-primary font-black text-[10px] uppercase tracking-widest hover:text-theme-text transition-colors"
              >
                {item.link} <ArrowRight className="ml-1.5 w-3.5 h-3.5" />
              </a>
            </motion.div>
          ))}
        </div>

        {/* CTA Section */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="p-10 md:p-12 rounded-[2.5rem] bg-theme-bg-secondary border border-theme-border flex flex-col lg:flex-row items-center justify-between gap-10 relative overflow-hidden shadow-sm"
        >
          <div className="absolute top-0 right-0 w-96 h-96 bg-gfg-primary/5 rounded-full blur-[150px] pointer-events-none" />
          <div className="flex flex-col sm:flex-row items-center space-y-6 sm:space-y-0 sm:space-x-8 text-left relative z-10">
            <div className="w-16 h-16 rounded-[2rem] bg-gfg-primary/10 border border-gfg-primary/20 flex items-center justify-center text-gfg-primary shrink-0 shadow-sm">
              <GraduationCap className="w-8 h-8" />
            </div>
            <div>
              <h3 className="text-2xl font-black text-theme-text mb-2 tracking-tighter uppercase leading-tight">Empowering Minds. <span className="text-gfg-primary">Shaping Futures.</span></h3>
              <p className="text-theme-text-muted font-bold tracking-wider text-[10px] uppercase">At Marwadi University, we believe in peer education that transforms lives.</p>
            </div>
          </div>
          <a 
            href="https://www.marwadiuniversity.ac.in/"
            target="_blank"
            rel="noopener noreferrer"
            className="relative z-10 px-8 py-4 bg-gfg-primary text-black font-black rounded-xl hover:bg-theme-text hover:text-theme-bg transition-all whitespace-nowrap flex items-center uppercase tracking-widest text-[10px] shadow-sm"
          >
            Learn More <ArrowRight className="ml-1.5 w-4.5 h-4.5" />
          </a>
        </motion.div>
      </div>
    </motion.div>
  );
}
