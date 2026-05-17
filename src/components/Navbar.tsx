import { Link, useLocation } from "react-router-dom";
import { cn } from "@/src/lib/utils";
import { Menu, X } from "lucide-react";
import { useState } from "react";

const navLinks = [
  { name: "Home", path: "/" },
  { name: "About", path: "/about" },
  { name: "Events", path: "/events" },
  { name: "Resources", path: "/resources" },
  { name: "Blogs", path: "/blogs" },
  { name: "Team", path: "/team" },
  { name: "Contact", path: "/contact" },
];

const GFG_LOGO = "https://raw.githubusercontent.com/GeeksforGeeks-Student-Chapter-MU/assets/main/gfg_logo.png";
const MU_LOGO = "https://kommodo.ai/i/b01m9GwXS6S59LK3mHYJ";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-50 h-20 flex items-center px-6 bg-black/60 backdrop-blur-xl border-b border-white/5 shadow-2xl">
        <div className="max-w-7xl mx-auto w-full flex items-center justify-between">
          {/* Left: GFG Logo */}
          <Link to="/" className="flex-shrink-0 flex items-center group transition-transform duration-300 hover:scale-105">
            <img 
              src={GFG_LOGO} 
              alt="GeeksforGeeks" 
              className="h-9 md:h-10 w-auto"
              referrerPolicy="no-referrer"
              onError={(e) => {
                e.currentTarget.src = "https://media.geeksforgeeks.org/wp-content/cdn-uploads/20210420155809/gfg-new-logo.png";
              }}
            />
          </Link>

          {/* Center/Right: Navigation Links & MU Logo */}
          <div className="hidden lg:flex items-center">
            <nav className="flex items-center space-x-10 pr-10 border-r border-white/10">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  className={cn(
                    "text-[10px] font-black uppercase tracking-[0.25em] transition-all duration-300 relative py-2 group",
                    location.pathname === link.path 
                      ? "text-[#00ff88]" 
                      : "text-white/50 hover:text-white"
                  )}
                >
                  {link.name}
                  <span className={cn(
                    "absolute bottom-0 left-0 w-full h-[1px] bg-[#00ff88] transition-transform duration-300 origin-left",
                    location.pathname === link.path ? "scale-x-100" : "scale-x-0 group-hover:scale-x-100"
                  )} />
                </Link>
              ))}
            </nav>

            <div className="pl-10">
              <a 
                href="https://www.marwadiuniversity.ac.in/" 
                target="_blank" 
                rel="noopener noreferrer"
                className="block transition-all duration-300 hover:scale-105 hover:brightness-125"
              >
                <img 
                  src={MU_LOGO} 
                  alt="Marwadi University" 
                  className="h-9 w-auto object-contain brightness-0 invert opacity-80 hover:opacity-100"
                  referrerPolicy="no-referrer"
                  onError={(e) => {
                    e.currentTarget.src = "https://www.marwadiuniversity.ac.in/wp-content/uploads/2021/04/Logo-1.png";
                  }}
                />
              </a>
            </div>
          </div>

          {/* Right: Mobile Trigger Only (MU logo handled above for desktop) */}
          <div className="lg:hidden flex items-center">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 text-white/70 hover:text-[#00ff88] transition-colors"
              aria-label="Toggle menu"
            >
              {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Drawer */}
      {isOpen && (
        <>
          <div
            onClick={() => setIsOpen(false)}
            className="fixed inset-0 bg-black/90 z-[55] lg:hidden"
          />
          <div
            className="fixed top-0 right-0 h-full w-full max-w-sm bg-[#0a0a0a] z-[60] lg:hidden p-8 flex flex-col border-l border-white/5"
          >
            {/* Logo & Close Button Section */}
            <div className="flex items-center justify-between mb-12">
              <div className="flex-shrink-0">
                <img 
                  src={GFG_LOGO} 
                  alt="GFG" 
                  className="h-10 w-auto object-contain"
                />
              </div>
              <button 
                onClick={() => setIsOpen(false)} 
                className="p-2 text-white/70"
                aria-label="Close menu"
              >
                <X className="w-8 h-8" />
              </button>
            </div>

            {/* Menu Links */}
            <nav className="flex-grow flex flex-col space-y-4">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  onClick={() => setIsOpen(false)}
                  className={cn(
                    "text-2xl font-bold uppercase tracking-tight",
                    location.pathname === link.path 
                      ? "text-[#00ff88]" 
                      : "text-white/40 hover:text-white"
                  )}
                >
                  {link.name}
                </Link>
              ))}
            </nav>

            {/* Footer Section */}
            <div className="mt-12 pt-8 border-t border-white/5 flex flex-col items-center">
              <a 
                href="https://www.marwadiuniversity.ac.in/" 
                target="_blank" 
                rel="noopener noreferrer"
                className="mb-6 block"
              >
                <img 
                  src={MU_LOGO} 
                  alt="MU" 
                  className="h-12 w-auto object-contain opacity-100" 
                  onError={(e) => {
                    e.currentTarget.src = "https://www.marwadiuniversity.ac.in/wp-content/uploads/2021/04/Logo-1.png";
                  }}
                />
              </a>
              <p className="text-[10px] text-white/20 font-bold uppercase tracking-widest text-center">
                Empowering Geeks @ Marwadi University
              </p>
            </div>
          </div>
        </>
      )}
    </>
  );
}
