import { Link, useLocation } from "react-router-dom";
import { cn } from "@/src/lib/utils";
import { Menu, X, Sun, Moon } from "lucide-react";
import { useState } from "react";
import { useAuth } from "@/src/contexts/AuthContext";
import { useTheme } from "@/src/contexts/ThemeContext";
import ThemeCube from "@/src/components/ThemeCube";

const navLinks = [
  { name: "Home", path: "/" },
  { name: "About", path: "/about" },
  { name: "Events", path: "/events" },
  { name: "Courses", path: "/courses" },
  { name: "Team", path: "/team" },
  { name: "Contact", path: "/contact" },
];

const GFG_LOGO = "https://raw.githubusercontent.com/GeeksforGeeks-Student-Chapter-MU/assets/main/gfg_logo.png";
const MU_LOGO = "https://www.marwadiuniversity.ac.in/wp-content/themes/marwadi-university/assets/img/logomain.svg";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const { isAuthenticated } = useAuth();
  const { theme, toggleTheme } = useTheme();

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-50 h-20 flex items-center px-4 sm:px-6 bg-theme-bg border-b border-theme-border shadow-sm theme-transition">
        <div className="max-w-7xl mx-auto w-full flex items-center justify-between">
          
          {/* Left Side: GFG Logo + Navigation Links */}
          <div className="flex items-center space-x-12">
            <Link to="/" className="flex-shrink-0 flex items-center group transition-transform duration-300 hover:scale-105">
              <img 
                src={GFG_LOGO} 
                alt="GeeksforGeeks" 
                className={cn(
                  "h-9 md:h-10 w-auto transition-all",
                  theme === "dark" ? "brightness-100" : "brightness-95 contrast-105"
                )}
                referrerPolicy="no-referrer"
                onError={(e) => {
                  e.currentTarget.src = "https://media.geeksforgeeks.org/wp-content/cdn-uploads/20210420155809/gfg-new-logo.png";
                }}
              />
            </Link>

            <nav className="hidden lg:flex items-center space-x-8">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  className={cn(
                    "text-[10px] font-black uppercase tracking-[0.25em] transition-all duration-300 relative py-2 group",
                    location.pathname === link.path 
                      ? "text-[#00aa55] dark:text-[#00ff88]" 
                      : "text-theme-text-muted hover:text-theme-text"
                  )}
                >
                  {link.name}
                  <span className={cn(
                    "absolute bottom-0 left-0 w-full h-[1px] bg-[#00aa55] dark:bg-[#00ff88] transition-transform duration-300 origin-left",
                    location.pathname === link.path ? "scale-x-100" : "scale-x-0 group-hover:scale-x-100"
                  )} />
                </Link>
              ))}
            </nav>
          </div>

          {/* Right Side: Theme Toggle, Student Login, WhatsApp Community, & MU Logo */}
          <div className="hidden lg:flex items-center space-x-4">
            
            <a
              href="https://chat.whatsapp.com/F7RcXCTLYJ4Ije5NiL6sDM"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center px-4 py-2.5 bg-[#25D366] hover:bg-[#20ba5a] text-white text-[10px] font-black uppercase tracking-widest rounded-xl transition-all hover:shadow-[0_0_15px_rgba(37,211,102,0.4)] cursor-pointer"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-white mr-2 animate-pulse" />
              COMMUNITY
            </a>

            {/* Modern Uiverse 3D Cube Theme Switch Toggle */}
            <div className="flex items-center justify-center shrink-0" id="desktop-theme-toggle">
              <ThemeCube />
            </div>

            <Link
              to={isAuthenticated ? "/student/dashboard" : "/login"}
              className="inline-flex items-center px-4 py-2.5 bg-black hover:bg-black/80 text-[#00ff88] text-[10px] font-black uppercase tracking-widest rounded-xl transition-all hover:shadow-[0_0_15px_rgba(0,255,136,0.4)] cursor-pointer border border-[#00ff88]/30"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-[#00ff88] mr-2 animate-pulse" />
              {isAuthenticated ? "PORTAL" : "LOGIN"}
            </Link>

            <a 
              href="https://www.marwadiuniversity.ac.in/" 
              target="_blank" 
              rel="noopener noreferrer"
              className="block transition-all duration-300 hover:scale-105"
            >
              <img 
                src={MU_LOGO} 
                alt="Marwadi University" 
                className="h-10 w-auto object-contain opacity-100"
                referrerPolicy="no-referrer"
                onError={(e) => {
                  e.currentTarget.src = "https://www.marwadiuniversity.ac.in/wp-content/uploads/2021/04/Logo-1.png";
                }}
              />
            </a>
          </div>

          {/* Right: Mobile Controls containing Theme Toggle & Hamburger */}
          <div className="lg:hidden flex items-center space-x-2">
            
            {/* Modern 3D Cube Theme Switch Toggle on Mobile */}
            <div className="flex items-center justify-center shrink-0 scale-90" id="mobile-theme-toggle">
              <ThemeCube />
            </div>

            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 text-theme-text hover:text-gfg-primary transition-colors cursor-pointer"
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
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[55] lg:hidden"
          />
          <div
            className="fixed top-0 right-0 h-full w-full max-w-sm bg-theme-bg z-[60] lg:hidden p-8 flex flex-col border-l border-theme-border overflow-y-auto theme-transition"
          >
            {/* Logo & Close Button Section */}
            <div className="flex items-center justify-between mb-12 w-full gap-4 shrink-0">
              <div className="flex items-center justify-start h-12 w-48 relative">
                <img 
                  src={GFG_LOGO} 
                  alt="GeeksforGeeks" 
                  className={cn(
                    "max-h-full max-w-full h-auto w-auto object-contain block",
                    theme === "dark" ? "brightness-100" : "brightness-95 contrast-105"
                  )}
                  referrerPolicy="no-referrer"
                  onError={(e) => {
                    e.currentTarget.src = "https://media.geeksforgeeks.org/wp-content/cdn-uploads/20210420155809/gfg-new-logo.png";
                  }}
                />
              </div>
              <button 
                onClick={() => setIsOpen(false)} 
                className="p-2 text-theme-text-muted hover:text-theme-text transition-colors cursor-pointer shrink-0 flex items-center justify-center"
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
                    "text-2xl font-bold uppercase tracking-tight transition-colors duration-200",
                    location.pathname === link.path 
                      ? "text-gfg-primary" 
                      : "text-theme-text-muted hover:text-theme-text"
                  )}
                >
                  {link.name}
                </Link>
              ))}

              <div className="pt-6 flex flex-col gap-3">
                <a
                  href="https://chat.whatsapp.com/F7RcXCTLYJ4Ije5NiL6sDM"
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => setIsOpen(false)}
                  className="w-full inline-flex items-center justify-center px-6 py-4 bg-[#25D366] text-white font-black uppercase text-xs tracking-widest rounded-2xl transition-all shadow-[0_0_20px_rgba(37,211,102,0.2)] cursor-pointer"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-white mr-2.5 animate-pulse" />
                  JOIN COMMUNITY
                </a>

                <Link
                  to={isAuthenticated ? "/student/dashboard" : "/login"}
                  onClick={() => setIsOpen(false)}
                  className="w-full inline-flex items-center justify-center px-6 py-4 bg-black border border-[#00ff88]/30 hover:bg-[#00ff88] hover:text-black hover:border-transparent text-[#00ff88] font-black uppercase text-xs tracking-widest rounded-2xl transition-all shadow-[0_0_20px_rgba(0,255,136,0.1)] cursor-pointer"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-[#00ff88] mr-2.5 animate-pulse" />
                  {isAuthenticated ? "STUDENT PORTAL" : "STUDENT LOGIN"}
                </Link>
              </div>
            </nav>

            {/* Footer Section */}
            <div className="mt-12 pt-8 border-t border-theme-border flex flex-col items-center">
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
              <p className="text-[10px] text-theme-text-muted font-bold uppercase tracking-widest text-center">
                Empowering Geeks @ Marwadi University
              </p>
            </div>
          </div>
        </>
      )}
    </>
  );
}
