import { Link } from "react-router-dom";
import { Terminal, Github, Linkedin, Twitter, Mail } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-theme-bg-secondary border-t border-theme-border py-24 relative overflow-hidden theme-transition">
      <div className="absolute top-0 right-0 w-64 h-64 bg-gfg-primary/5 rounded-full blur-[120px] pointer-events-none" />
      
      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-16 lg:gap-24">
          <div className="col-span-1 md:col-span-2">
            <Link to="/" className="flex items-center space-x-3 mb-8">
              <div className="w-12 h-12 bg-gfg-primary/10 border border-gfg-primary/20 rounded-2xl flex items-center justify-center shadow-[0_0_20px_rgba(47,141,70,0.1)]">
                <Terminal className="w-6 h-6 text-gfg-primary" />
              </div>
              <span className="text-2xl font-black tracking-tighter text-theme-text uppercase">
                STUDENT <span className="text-gfg-primary">CHAPTER</span>
              </span>
            </Link>
            <p className="text-theme-text-secondary max-w-sm font-medium leading-relaxed text-base">
              Empowering students at Marwadi University to learn, code, and grow together. 
              Built for innovators, builders, and future leaders.
            </p>
          </div>

          <div>
            <h3 className="text-theme-text font-black mb-8 tracking-widest uppercase text-xs">Navigation</h3>
            <ul className="space-y-4 font-bold uppercase text-[10px] tracking-widest">
              <li>
                <Link to="/" className="text-theme-text-muted hover:text-gfg-primary transition-colors">Home</Link>
              </li>
              <li>
                <Link to="/about" className="text-theme-text-muted hover:text-gfg-primary transition-colors">About</Link>
              </li>
              <li>
                <Link to="/courses" className="text-theme-text-muted hover:text-gfg-primary transition-colors">Courses</Link>
              </li>
              <li>
                <Link to="/events" className="text-theme-text-muted hover:text-gfg-primary transition-colors">Events</Link>
              </li>
              <li>
                <Link to="/team" className="text-theme-text-muted hover:text-gfg-primary transition-colors">Core Team</Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-theme-text font-black mb-8 tracking-widest uppercase text-xs">Connect With Us</h3>
            <div className="space-y-6">
              <a 
                href="https://www.linkedin.com/in/meet-khakhkhar23/" 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center space-x-4 group"
              >
                <div className="w-12 h-12 rounded-2xl bg-theme-bg border border-theme-border text-theme-text-muted group-hover:text-[#0077b5] group-hover:border-[#0077b5]/30 group-hover:bg-[#0077b5]/5 transition-all flex items-center justify-center shadow-sm">
                  <Linkedin className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-[10px] font-black uppercase tracking-widest text-gfg-primary">LinkedIn</div>
                  <div className="text-sm font-bold text-theme-text-secondary group-hover:text-theme-text transition-colors">Meet Khakhkhar</div>
                </div>
              </a>
              
              <div className="flex space-x-4 pt-4 border-t border-theme-border">
                <a href="#" className="w-10 h-10 rounded-xl bg-theme-bg border border-theme-border text-theme-text-muted hover:text-gfg-primary hover:border-gfg-primary/30 transition-all flex items-center justify-center">
                  <Github className="w-4 h-4" />
                </a>
                <a href="#" className="w-10 h-10 rounded-xl bg-theme-bg border border-theme-border text-theme-text-muted hover:text-gfg-primary hover:border-gfg-primary/30 transition-all flex items-center justify-center">
                  <Twitter className="w-4 h-4" />
                </a>
                <a href="mailto:meetkhakhkhar05@gmail.com" className="w-10 h-10 rounded-xl bg-theme-bg border border-theme-border text-theme-text-muted hover:text-gfg-primary hover:border-gfg-primary/30 transition-all flex items-center justify-center">
                  <Mail className="w-4 h-4" />
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Unlock Premium Learning Resources CTA Banner */}
        <div className="mt-20 pt-16 border-t border-theme-border text-center flex flex-col items-center">
          <div className="max-w-2xl px-4 space-y-4">
            <h2 className="text-2xl sm:text-3.5xl font-black text-theme-text uppercase tracking-tight italic">
              Unlock Premium Learning Resources
            </h2>
            <p className="text-theme-text-secondary text-xs sm:text-sm font-semibold uppercase tracking-wide leading-relaxed">
              Access exclusive GeeksforGeeks learning materials,<br className="hidden sm:block" />
              practice platforms, interview preparation resources,<br className="hidden sm:block" />
              coding roadmaps and career opportunities.
            </p>
            <div className="pt-6">
              <Link 
                to="/student-login" 
                className="group inline-flex items-center justify-center h-14 px-8 rounded-2xl bg-gradient-to-br from-[#2F8D46] via-[#1F6B34] to-[#0E491F] text-white font-mono font-black text-xs uppercase tracking-[0.15em] transition-all duration-300 hover:scale-[1.03] shadow-md hover:shadow-[0_0_25px_rgba(47,141,70,0.25)] gap-2 hover:brightness-110 cursor-pointer"
              >
                <span>Student Login Portal</span>
                <span className="text-sm font-bold group-hover:translate-x-1 transition-transform">→</span>
              </Link>
            </div>
          </div>
        </div>

        <div className="mt-20 pt-10 border-t border-theme-border text-center">
          <p className="text-theme-text-muted text-[10px] font-black uppercase tracking-[0.3em] mb-2">
            © {new Date().getFullYear()} GFG Student Chapter @ Marwadi University. Built by the community.
          </p>
          <p className="text-gfg-primary text-[8px] font-black uppercase tracking-[0.5em] opacity-80">
            Powered by GeeksforGeeks
          </p>
        </div>
      </div>
    </footer>
  );
}
