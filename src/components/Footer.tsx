import { Link } from "react-router-dom";
import { Terminal, Github, Linkedin, Twitter, Mail } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-[#050505] border-t border-white/5 py-24 relative overflow-hidden">
      <div className="absolute top-0 right-0 w-64 h-64 bg-[#00ff88]/5 rounded-full blur-[120px] pointer-events-none" />
      
      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-16 lg:gap-24">
          <div className="col-span-1 md:col-span-2">
            <Link to="/" className="flex items-center space-x-3 mb-8">
              <div className="w-12 h-12 bg-[#00ff88]/10 border border-[#00ff88]/20 rounded-2xl flex items-center justify-center shadow-[0_0_20px_rgba(0,255,136,0.1)]">
                <Terminal className="w-6 h-6 text-[#00ff88]" />
              </div>
              <span className="text-2xl font-black tracking-tighter text-white uppercase">
                STUDENT <span className="text-[#00ff88]">CHAPTER</span>
              </span>
            </Link>
            <p className="text-white/40 max-w-sm font-medium leading-relaxed text-lg">
              Empowering students at Marwadi University to learn, code, and grow together. 
              Built for innovators, builders, and future leaders.
            </p>
          </div>

          <div>
            <h3 className="text-white font-black mb-8 tracking-widest uppercase text-xs">Navigation</h3>
            <ul className="space-y-4 font-bold uppercase text-[10px] tracking-widest">
              <li>
                <Link to="/" className="text-white/40 hover:text-[#00ff88] transition-colors">Home</Link>
              </li>
              <li>
                <Link to="/about" className="text-white/40 hover:text-[#00ff88] transition-colors">About</Link>
              </li>
              <li>
                <Link to="/resources" className="text-white/40 hover:text-[#00ff88] transition-colors">Courses Hub</Link>
              </li>
              <li>
                <Link to="/events" className="text-white/40 hover:text-[#00ff88] transition-colors">Events</Link>
              </li>
              <li>
                <Link to="/team" className="text-white/40 hover:text-[#00ff88] transition-colors">Core Team</Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-white font-black mb-8 tracking-widest uppercase text-xs">Connect With Us</h3>
            <div className="space-y-6">
              <a 
                href="https://www.linkedin.com/in/meet-khakhkhar23/" 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center space-x-4 group"
              >
                <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 text-white/40 group-hover:text-[#0077b5] group-hover:border-[#0077b5]/30 group-hover:bg-[#0077b5]/5 transition-all flex items-center justify-center shadow-sm">
                  <Linkedin className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-[10px] font-black uppercase tracking-widest text-[#00ff88]">LinkedIn</div>
                  <div className="text-sm font-bold text-white/60 group-hover:text-white transition-colors">Meet Khakhkhar</div>
                </div>
              </a>
              
              <div className="flex space-x-4 pt-4 border-t border-white/5">
                <a href="#" className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 text-white/40 hover:text-[#00ff88] hover:border-[#00ff88]/30 transition-all flex items-center justify-center">
                  <Github className="w-4 h-4" />
                </a>
                <a href="#" className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 text-white/40 hover:text-[#00ff88] hover:border-[#00ff88]/30 transition-all flex items-center justify-center">
                  <Twitter className="w-4 h-4" />
                </a>
                <a href="mailto:meetkhakhkhar05@gmail.com" className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 text-white/40 hover:text-[#00ff88] hover:border-[#00ff88]/30 transition-all flex items-center justify-center">
                  <Mail className="w-4 h-4" />
                </a>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-24 pt-10 border-t border-white/5 text-center">
          <p className="text-white/20 text-[10px] font-black uppercase tracking-[0.3em] mb-2">
            © {new Date().getFullYear()} GFG Student Chapter @ Marwadi University. Built by the community.
          </p>
          <p className="text-[#00ff88] text-[8px] font-black uppercase tracking-[0.5em] opacity-50">
            Powered by GeeksforGeeks
          </p>
        </div>
      </div>
    </footer>
  );
}
