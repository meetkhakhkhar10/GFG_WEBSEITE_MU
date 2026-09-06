import { Link } from "react-router-dom";
import { 
  Github, Linkedin, Twitter, Mail, ExternalLink, ArrowRight 
} from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-theme-bg-secondary border-t border-theme-border py-16 sm:py-24 pb-28 sm:pb-24 relative overflow-hidden theme-transition">
      <div className="absolute top-0 right-0 w-64 h-64 bg-gfg-primary/5 rounded-full blur-[120px] pointer-events-none" />
      
      <div className="max-w-7xl mx-auto px-6 relative z-10 w-full">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12 sm:gap-16 lg:gap-12 text-left">
          
          {/* COLUMN 1: BRANDING & SOCIALS */}
          <div className="flex flex-col space-y-6 items-start">
            <Link to="/" className="inline-block group w-fit">
              <div className="flex items-center space-x-3 bg-black/[0.02] dark:bg-black/35 border border-black/10 dark:border-white/[0.08] py-2.5 px-5 rounded-2xl backdrop-blur-md hover:border-gfg-primary transition-all duration-300 shadow-sm">
                <img 
                  src="https://raw.githubusercontent.com/GeeksforGeeks-Student-Chapter-MU/assets/main/gfg_logo.png" 
                  alt="GeeksforGeeks Logo" 
                  className="h-8 w-auto object-contain brightness-110 drop-shadow-[0_0_12px_rgba(0,255,136,0.25)]" 
                  referrerPolicy="no-referrer"
                  onError={(e) => {
                    e.currentTarget.src = "https://media.geeksforgeeks.org/wp-content/cdn-uploads/20210420155809/gfg-new-logo.png";
                  }}
                />
                <div className="flex flex-col items-start leading-none text-left border-l border-black/10 dark:border-white/10 pl-3">
                  <span className="text-[8px] font-mono tracking-widest text-[#00aa55] dark:text-[#00ff88] font-black uppercase leading-none">STUDENT CHAPTER</span>
                </div>
              </div>
            </Link>
            <p className="text-white font-semibold leading-relaxed text-xs max-w-xs text-left">
              Empowering students at Marwadi University to learn, code, and grow together. 
              Built for innovators, builders, and future leaders.
            </p>
            
            {/* Social icons row */}
            <div className="flex items-center space-x-3 pt-2">
              <a 
                href="https://www.linkedin.com/company/geeksforgeeks-marwadi-university/" 
                target="_blank" 
                rel="noopener noreferrer"
                className="group/icon relative w-10 h-10 rounded-xl bg-black/[0.02] dark:bg-white/[0.03] border border-black/10 dark:border-white/10 text-black/50 dark:text-white/50 hover:text-gfg-primary dark:hover:text-[#00ff88] hover:border-gfg-primary/30 hover:shadow-[0_0_15px_rgba(0,255,136,0.25)] hover:scale-105 transition-all duration-300 flex items-center justify-center backdrop-blur-md"
                title="Follow on LinkedIn"
              >
                <Linkedin className="w-4.5 h-4.5" />
                <span className="absolute bottom-full mb-2 scale-0 transition-all duration-200 rounded-md bg-black/95 px-2.5 py-1 text-[8px] font-black tracking-wider text-white border border-[#00ff88]/20 group-hover/icon:scale-100 whitespace-nowrap z-50">
                  Follow on LinkedIn
                </span>
              </a>
              <a 
                href="https://github.com/GeeksforGeeks-Student-Chapter-MU" 
                target="_blank" 
                rel="noopener noreferrer"
                className="group/icon relative w-10 h-10 rounded-xl bg-black/[0.02] dark:bg-white/[0.03] border border-black/10 dark:border-white/10 text-black/50 dark:text-white/50 hover:text-gfg-primary dark:hover:text-[#00ff88] hover:border-gfg-primary/30 hover:shadow-[0_0_15px_rgba(0,255,136,0.20)] hover:scale-105 transition-all duration-300 flex items-center justify-center backdrop-blur-md"
                title="GitHub Repository"
              >
                <Github className="w-4 h-4" />
              </a>
              <a 
                href="https://x.com/MeetKhakhkhar05" 
                target="_blank" 
                rel="noopener noreferrer"
                className="group/icon relative w-10 h-10 rounded-xl bg-black/[0.02] dark:bg-white/[0.03] border border-black/10 dark:border-white/10 text-black/50 dark:text-white/50 hover:text-gfg-primary dark:hover:text-[#00ff88] hover:border-gfg-primary/30 hover:shadow-[0_0_15px_rgba(0,255,136,0.20)] hover:scale-105 transition-all duration-300 flex items-center justify-center backdrop-blur-md"
                title="Follow X Feed"
              >
                <Twitter className="w-4 h-4" />
              </a>
              <a 
                href="mailto:meetkhakhkhar05@gmail.com" 
                className="group/icon relative w-10 h-10 rounded-xl bg-black/[0.02] dark:bg-white/[0.03] border border-black/10 dark:border-white/10 text-black/50 dark:text-white/50 hover:text-gfg-primary dark:hover:text-[#00ff88] hover:border-gfg-primary/30 hover:shadow-[0_0_15px_rgba(0,255,136,0.20)] hover:scale-105 transition-all duration-300 flex items-center justify-center backdrop-blur-md"
                title="Inquiry Email"
              >
                <Mail className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* COLUMN 2: QUICK NAVIGATION */}
          <div className="flex flex-col space-y-6 items-start">
            <h3 className="text-white font-black tracking-widest uppercase text-xs text-left w-full">Quick Links</h3>
            <ul className="space-y-4 font-bold uppercase text-[10px] tracking-widest text-left w-full">
              <li>
                <Link to="/" className="text-white hover:text-gfg-primary dark:hover:text-[#00ff88] transition-colors block">Home</Link>
              </li>
              <li>
                <Link to="/courses" className="text-white hover:text-gfg-primary dark:hover:text-[#00ff88] transition-colors block">Courses</Link>
              </li>
              <li>
                <Link to="/resources" className="text-white hover:text-gfg-primary dark:hover:text-[#00ff88] transition-colors block">Resources</Link>
              </li>
              <li>
                <Link to="/events" className="text-white hover:text-gfg-primary dark:hover:text-[#00ff88] transition-colors block">Events</Link>
              </li>
              <li>
                <Link to="/team" className="text-white hover:text-gfg-primary dark:hover:text-[#00ff88] transition-colors block">Team</Link>
              </li>
              <li>
                <Link to="/about" className="text-white hover:text-gfg-primary dark:hover:text-[#00ff88] transition-colors block">About</Link>
              </li>
              <li>
                <Link to="/contact" className="text-white hover:text-gfg-primary dark:hover:text-[#00ff88] transition-colors block">Contact</Link>
              </li>
              <li>
                <Link to="/deploy" className="text-white hover:text-gfg-primary dark:hover:text-[#00ff88] transition-colors block">Netlify Deploy</Link>
              </li>
            </ul>
          </div>

          {/* COLUMN 3: COMMUNITY LINKS */}
          <div className="flex flex-col space-y-6 items-start">
            <h3 className="text-white font-black tracking-widest uppercase text-xs text-left w-full">Community Links</h3>
            <ul className="space-y-4 font-bold uppercase text-[10px] tracking-widest text-left w-full">
              <li>
                <a 
                  href="https://www.linkedin.com/company/geeksforgeeks-marwadi-university/" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="text-white hover:text-gfg-primary dark:hover:text-[#00ff88] transition-colors flex items-center space-x-1.5"
                >
                  <span>LinkedIn Community</span>
                  <ExternalLink className="w-3 h-3 opacity-60" />
                </a>
              </li>
              <li>
                <a 
                  href="https://www.geeksforgeeks.org/" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="text-white hover:text-gfg-primary dark:hover:text-[#00ff88] transition-colors flex items-center space-x-1.5"
                >
                  <span>GeeksforGeeks</span>
                  <ExternalLink className="w-3 h-3 opacity-60" />
                </a>
              </li>
              <li>
                <a 
                  href="https://www.marwadiuniversity.ac.in/" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="text-white hover:text-gfg-primary dark:hover:text-[#00ff88] transition-colors flex items-center space-x-1.5"
                >
                  <span>Marwadi University</span>
                  <ExternalLink className="w-3 h-3 opacity-60" />
                </a>
              </li>
            </ul>
          </div>

          {/* COLUMN 4: STAY CONNECTED */}
          <div className="flex flex-col space-y-5 items-start">
            <h3 className="text-white font-black tracking-widest uppercase text-xs text-left w-full">Stay Connected</h3>
            <div className="space-y-4 max-w-sm text-left w-full">
              <div className="text-[10px] font-black uppercase tracking-wider text-gfg-primary dark:text-[#00ff88] font-mono leading-tight">
                Stay Connected With GeeksforGeeks × Marwadi University
              </div>
              <p className="text-white text-[11px] leading-relaxed font-semibold">
                Follow our official community channels for updates on workshops, hackathons, coding competitions, technical events, chapter achievements, student opportunities, and community activities.
              </p>
              <div className="pt-1 flex w-full justify-center sm:justify-start">
                <a 
                  href="https://www.linkedin.com/company/geeksforgeeks-marwadi-university/" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="w-full sm:w-auto inline-flex items-center justify-center px-6 py-3.5 bg-gfg-primary dark:bg-[#00ff88] hover:bg-gfg-primary-neon dark:hover:bg-white text-white dark:text-black font-black uppercase text-[10px] tracking-widest rounded-xl transition-all duration-300 hover:shadow-[0_0_20px_rgba(0,255,136,0.40)] hover:scale-103 cursor-pointer text-center"
                >
                  <span>Follow on LinkedIn</span>
                  <ArrowRight className="w-3.5 h-3.5 ml-2 text-white dark:text-black" />
                </a>
              </div>
            </div>
          </div>

        </div>

        {/* SECTION BOTTOM: SECONDARY WHATSAPP COMMUNITY CARD */}
        <div className="mt-16 pt-12 border-t border-theme-border">
          <div className="relative p-7 sm:p-12 rounded-[2.5rem] bg-theme-bg border border-theme-border dark:bg-gradient-to-r dark:from-[#0c0c0c] dark:to-[#0e0e0e] dark:border-white/5 hover:border-gfg-primary/20 transition-all shadow-2xl overflow-hidden group">
            <div className="absolute top-0 right-0 w-80 h-80 bg-emerald-500/[0.02] blur-3xl rounded-full pointer-events-none" />
            
            <div className="flex flex-col lg:flex-row items-center justify-between gap-10 relative z-10 w-full">
              <div className="flex-1 space-y-4 max-w-2xl text-center lg:text-left w-full flex flex-col items-center lg:items-start pb-4 lg:pb-0">
                <div className="inline-flex items-center space-x-2 px-3 py-1 bg-gfg-primary/10 border border-gfg-primary/20 rounded-md">
                  <span className="w-1.5 h-1.5 bg-gfg-primary dark:bg-[#00ff88] rounded-full animate-pulse" />
                  <span className="text-[9px] font-black uppercase tracking-wider text-gfg-primary dark:text-[#00ff88] font-mono">Join Our WhatsApp Community</span>
                </div>
                <h3 className="text-xl sm:text-3xl font-black text-white tracking-tight uppercase italic leading-none max-w-full">
                  Join Our WhatsApp Community
                </h3>
                <p className="text-white text-xs sm:text-sm font-semibold leading-relaxed max-w-[90%] lg:max-w-none">
                  Get instant updates about events, registrations, workshops, hackathons, coding contests, and chapter announcements directly on WhatsApp.
                </p>
                <div className="pt-2 w-full sm:w-auto">
                  <a 
                    href="https://chat.whatsapp.com/F7RcXCTLYJ4Ije5NiL6sDM"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full sm:w-auto inline-flex items-center justify-center px-6 py-3.5 bg-black/[0.03] dark:bg-white/[0.02] hover:bg-gfg-primary dark:hover:bg-[#00ff88] border border-black/10 dark:border-white/10 hover:border-transparent text-gfg-primary dark:text-[#00ff88] hover:text-white dark:hover:text-black text-[10px] font-black uppercase tracking-widest rounded-xl transition-all duration-300 hover:shadow-[0_0_15px_rgba(0,255,136,0.30)] cursor-pointer max-w-[280px]"
                  >
                    Connect On WhatsApp
                  </a>
                </div>
              </div>

              {/* Styled Interactive QR code segment */}
              <div className="shrink-0 p-5 bg-black/[0.01] dark:bg-white/[0.02] border border-black/10 dark:border-white/10 rounded-[2rem] flex flex-col items-center space-y-3 backdrop-blur-md select-none w-fit mx-auto lg:mx-0">
                <div className="relative w-36 h-36 bg-white p-3.5 rounded-2xl flex items-center justify-center">
                  {/* Neon laser scan bar indicator */}
                  <div className="absolute left-0 right-0 top-1/4 h-0.5 bg-gfg-primary dark:bg-[#00ff88] opacity-80 shadow-[0_0_8px_#00ff88] animate-bounce pointer-events-none" style={{ animationDuration: '3.5s' }} />
                  
                  {/* SVG representation of QR and WhatsApp Brand */}
                  <svg viewBox="0 0 100 100" className="w-full h-full text-black">
                    {/* QR Finder patterns */}
                    <rect x="0" y="0" width="24" height="24" fill="currentColor" />
                    <rect x="4" y="4" width="16" height="16" fill="white" />
                    <rect x="8" y="8" width="8" height="8" fill="currentColor" />

                    <rect x="76" y="0" width="24" height="24" fill="currentColor" />
                    <rect x="80" y="4" width="16" height="16" fill="white" />
                    <rect x="84" y="8" width="8" height="8" fill="currentColor" />

                    <rect x="0" y="76" width="24" height="24" fill="currentColor" />
                    <rect x="4" y="80" width="16" height="16" fill="white" />
                    <rect x="8" y="84" width="8" height="8" fill="currentColor" />

                    {/* QR matrix patterns */}
                    <rect x="32" y="4" width="8" height="8" fill="currentColor" /><rect x="48" y="0" width="8" height="12" fill="currentColor" /><rect x="64" y="8" width="6" height="6" fill="currentColor" />
                    <rect x="32" y="16" width="12" height="6" fill="currentColor" /><rect x="60" y="18" width="8" height="6" fill="currentColor" />
                    <rect x="4" y="32" width="12" height="8" fill="currentColor" /><rect x="22" y="32" width="6" height="6" fill="currentColor" /><rect x="36" y="28" width="16" height="8" fill="currentColor" /><rect x="60" y="32" width="12" height="6" fill="currentColor" /><rect x="80" y="32" width="8" height="8" fill="currentColor" />
                    <rect x="0" y="48" width="8" height="12" fill="currentColor" /><rect x="16" y="44" width="12" height="6" fill="currentColor" /><rect x="72" y="48" width="14" height="8" fill="currentColor" />
                    <rect x="32" y="60" width="8" height="12" fill="currentColor" /><rect x="48" y="52" width="6" height="16" fill="currentColor" /><rect x="60" y="60" width="12" height="6" fill="currentColor" />
                    <rect x="36" y="76" width="12" height="6" fill="currentColor" /><rect x="56" y="72" width="10" height="8" fill="currentColor" /><rect x="72" y="68" width="12" height="12" fill="currentColor" />
                    <rect x="36" y="88" width="8" height="8" fill="currentColor" /><rect x="52" y="84" width="14" height="8" fill="currentColor" /><rect x="76" y="88" width="16" height="8" fill="currentColor" />

                    {/* WhatsApp Icon embedded in the center */}
                    <rect x="38" y="38" width="24" height="24" fill="white" rx="12" />
                    <path 
                      d="M 50 41 C 45.03 41 41 45.03 41 50 C 41 51.58 41.41 53.07 42.13 54.37 L 41.1 58.14 L 44.97 57.13 C 46.21 57.81 47.65 59 50 59 C 54.97 59 59 54.97 59 50 C 59 45.03 54.97 41 50 41 Z" 
                      fill="#25D366" 
                    />
                    <path 
                      d="M 46.5 46.5 C 46 46 45.5 46 45 46.5 C 44.5 47 44.2 47.5 44.2 48 C 44.2 48.8 44.5 49.8 45.2 50.8 C 46.2 52.2 47.5 53.5 49 54.2 C 49.8 54.5 50.5 54.5 51 54.2 C 51.5 53.8 52 52.8 52.2 52.2 C 52.2 51.8 52 51.5 51.8 51.2 C 51.5 51 50.5 50.5 50.2 50.2 C 50 50 49.8 50 49.5 50.2 C 49.2 50.5 48.8 51 48.5 51.2 C 48.2 51.5 48 51.5 47.5 51.2 C 47 51 46.2 50.5 45.5 49.5 C 44.8 48.5 44.5 47.8 44.5 47.5 C 44.5 47 45 46.8 45.2 46.5 Z" 
                      fill="white" 
                    />
                  </svg>
                </div>
                <div className="text-[8px] font-mono font-black tracking-widest text-gfg-primary dark:text-[#00ff88] bg-gfg-primary/10 dark:bg-emerald-500/10 px-3 py-1.5 rounded-full border border-gfg-primary/20 dark:border-emerald-500/20 uppercase text-center">
                  SCAN TO JOIN COMMUNITY
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* BOTTOM COPYRIGHT */}
        <div className="mt-16 pt-10 border-t border-theme-border flex flex-col items-center justify-center text-center">
          
          <a 
            href="https://www.marwadiuniversity.ac.in/" 
            target="_blank" 
            rel="noopener noreferrer" 
            className="flex items-center space-x-3 mb-6 bg-black/[0.02] dark:bg-white/[0.04] border border-black/10 dark:border-white/[0.08] py-2.5 px-5 rounded-2xl backdrop-blur-md hover:border-blue-500/30 transition-all duration-300 shadow-sm"
          >
            <img 
              src="https://www.marwadiuniversity.ac.in/wp-content/uploads/2021/04/Logo-1.png" 
              alt="Marwadi University Logo" 
              className="h-10 w-auto object-contain brightness-110 drop-shadow-[0_0_12px_rgba(59,130,246,0.15)]" 
              referrerPolicy="no-referrer"
              onError={(e) => {
                e.currentTarget.src = "https://www.marwadiuniversity.ac.in/wp-content/themes/marwadi-university/assets/img/logomain.svg";
              }}
            />
            <div className="flex flex-col items-start leading-none text-left border-l border-black/10 dark:border-white/10 pl-3">
              <span className="text-[8px] font-mono tracking-widest text-blue-500 dark:text-blue-400 font-extrabold uppercase">GUJARAT, INDIA</span>
            </div>
          </a>

          <p className="text-white text-[9px] font-black uppercase tracking-[0.3em] mb-2 leading-relaxed">
            © {new Date().getFullYear()} GFG Student Chapter @ Marwadi University. Built by the community.
          </p>
          <p className="text-gfg-primary text-[8px] font-black uppercase tracking-[0.3em] opacity-80">
            Powered by GeeksforGeeks
          </p>
        </div>
      </div>
    </footer>
  );
}
