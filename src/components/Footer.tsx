import { Link } from "react-router-dom";
import { 
  Github, Linkedin, Twitter, Mail, ArrowUpRight, ArrowRight 
} from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-[#EAEAE5] border-t border-[#E2E2DC] py-16 sm:py-20 relative select-none">
      <div className="max-w-[1400px] mx-auto px-6 relative z-10 w-full">
        
        {/* TOP EDITORIAL BRAND & SPECS */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 pb-14 border-b border-[#E2E2DC]">
          
          {/* Brand & Manifesto */}
          <div className="md:col-span-5 space-y-6">
            <div className="flex items-center space-x-3">
              <img 
                src="https://media.geeksforgeeks.org/wp-content/cdn-uploads/20210420155809/gfg-new-logo.png" 
                alt="GeeksforGeeks" 
                className="h-7 w-auto object-contain"
                referrerPolicy="no-referrer"
              />
              <span className="font-mono text-sm text-[#8B9198]">×</span>
              <span className="font-editorial text-lg font-semibold tracking-tight text-[#111318]">
                Marwadi University
              </span>
            </div>

            <p className="font-editorial italic text-2xl text-[#111318] leading-snug max-w-md">
              "We build communities that build software, foster curiosity, and push technical frontiers."
            </p>

            <div className="flex items-center space-x-3 pt-2">
              <a 
                href="https://www.linkedin.com/company/geeksforgeeks-marwadi-university/" 
                target="_blank" 
                rel="noopener noreferrer"
                className="w-9 h-9 border border-[#D4D4CC] bg-[#F4F4F0] hover:border-[#111318] text-[#555B63] hover:text-[#111318] flex items-center justify-center transition-colors"
                title="LinkedIn"
              >
                <Linkedin className="w-4 h-4" />
              </a>
              <a 
                href="https://github.com/GeeksforGeeks-Student-Chapter-MU" 
                target="_blank" 
                rel="noopener noreferrer"
                className="w-9 h-9 border border-[#D4D4CC] bg-[#F4F4F0] hover:border-[#111318] text-[#555B63] hover:text-[#111318] flex items-center justify-center transition-colors"
                title="GitHub"
              >
                <Github className="w-4 h-4" />
              </a>
              <a 
                href="https://x.com/MeetKhakhkhar05" 
                target="_blank" 
                rel="noopener noreferrer"
                className="w-9 h-9 border border-[#D4D4CC] bg-[#F4F4F0] hover:border-[#111318] text-[#555B63] hover:text-[#111318] flex items-center justify-center transition-colors"
                title="Twitter"
              >
                <Twitter className="w-4 h-4" />
              </a>
              <a 
                href="mailto:geeksforgeeks.marwadi.university@gmail.com" 
                className="w-9 h-9 border border-[#D4D4CC] bg-[#F4F4F0] hover:border-[#111318] text-[#555B63] hover:text-[#111318] flex items-center justify-center transition-colors"
                title="Email"
              >
                <Mail className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Directory Navigation */}
          <div className="md:col-span-3 space-y-4">
            <span className="font-mono text-[10px] uppercase tracking-[0.25em] text-[#8B9198] block">
              01 / DIRECTORY
            </span>
            <ul className="space-y-2.5 font-mono text-xs uppercase tracking-wider">
              <li>
                <Link to="/" className="text-[#555B63] hover:text-[#00A86B] transition-colors flex items-center justify-between group">
                  <span>Home</span>
                  <span className="text-[10px] text-[#8B9198] opacity-0 group-hover:opacity-100 transition-opacity">01</span>
                </Link>
              </li>
              <li>
                <Link to="/courses" className="text-[#555B63] hover:text-[#00A86B] transition-colors flex items-center justify-between group">
                  <span>Courses</span>
                  <span className="text-[10px] text-[#8B9198] opacity-0 group-hover:opacity-100 transition-opacity">02</span>
                </Link>
              </li>
              <li>
                <Link to="/events" className="text-[#555B63] hover:text-[#00A86B] transition-colors flex items-center justify-between group">
                  <span>Events</span>
                  <span className="text-[10px] text-[#8B9198] opacity-0 group-hover:opacity-100 transition-opacity">03</span>
                </Link>
              </li>
              <li>
                <Link to="/team" className="text-[#555B63] hover:text-[#00A86B] transition-colors flex items-center justify-between group">
                  <span>Team</span>
                  <span className="text-[10px] text-[#8B9198] opacity-0 group-hover:opacity-100 transition-opacity">04</span>
                </Link>
              </li>
              <li>
                <Link to="/about" className="text-[#555B63] hover:text-[#00A86B] transition-colors flex items-center justify-between group">
                  <span>About</span>
                  <span className="text-[10px] text-[#8B9198] opacity-0 group-hover:opacity-100 transition-opacity">05</span>
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-[#555B63] hover:text-[#00A86B] transition-colors flex items-center justify-between group">
                  <span>Contact</span>
                  <span className="text-[10px] text-[#8B9198] opacity-0 group-hover:opacity-100 transition-opacity">06</span>
                </Link>
              </li>
            </ul>
          </div>

          {/* Chapters & Affiliations */}
          <div className="md:col-span-4 space-y-4">
            <span className="font-mono text-[10px] uppercase tracking-[0.25em] text-[#8B9198] block">
              02 / AFFILIATION & METADATA
            </span>
            <div className="space-y-3 font-mono text-xs text-[#555B63]">
              <div className="p-4 bg-[#F4F4F0] border border-[#E2E2DC] space-y-2">
                <div className="flex justify-between items-center text-[10px] text-[#8B9198]">
                  <span>CAMPUS CHAPTER</span>
                  <span className="text-[#00A86B]">ACTIVE</span>
                </div>
                <div className="font-semibold text-[#111318]">Marwadi University</div>
                <div className="text-[11px] text-[#8B9198]">
                  Rajkot-Morbi Highway, Gauridad, Rajkot, Gujarat 360003
                </div>
              </div>

              <div className="flex items-center justify-between pt-1">
                <span className="text-[10px] text-[#8B9198]">STATUS FEED</span>
                <a
                  href="https://chat.whatsapp.com/F7RcXCTLYJ4Ije5NiL6sDM"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center space-x-1 text-[11px] text-[#00A86B] font-semibold hover:underline"
                >
                  <span>WhatsApp Circle</span>
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>
          </div>

        </div>

        {/* BOTTOM ARCHIVAL BAR */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 font-mono text-[11px] text-[#8B9198]">
          <div className="flex items-center space-x-2">
            <span>© {new Date().getFullYear()} GFG × MARWADI UNIVERSITY</span>
            <span>·</span>
            <span>ED. 2026</span>
          </div>

          <div className="flex items-center space-x-6 text-[10px] uppercase tracking-wider">
            <span>PRINT & DIGITAL ARCHIVE</span>
            <span className="text-[#00A86B]">SYSTEM STABLE</span>
          </div>
        </div>

      </div>
    </footer>
  );
}
