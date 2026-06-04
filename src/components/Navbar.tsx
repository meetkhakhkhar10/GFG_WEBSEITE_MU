import { Link, useLocation } from "react-router-dom";
import { cn } from "@/src/lib/utils";
import { Menu, X, Sun, Moon } from "lucide-react";
import { useState, useEffect } from "react";
import { useTheme } from "@/src/contexts/ThemeContext";
import ThemeSelector from "@/src/components/ThemeSelector";

const navLinks = [
  { name: "Home", path: "/" },
  { name: "Courses", path: "/courses" },
  { name: "Resources", path: "/resources" },
  { name: "Events", path: "/events" },
  { name: "Team", path: "/team" },
  { name: "About", path: "/about" },
  { name: "Contact", path: "/contact" },
];

const GFG_LOGO = "https://media.geeksforgeeks.org/wp-content/cdn-uploads/20210420155809/gfg-new-logo.png";
const MU_LOGO = "https://www.marwadiuniversity.ac.in/wp-content/uploads/2021/04/Logo-1.png";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const { theme, toggleTheme } = useTheme();
  const [isAdmin, setIsAdmin] = useState(false);

  const currentGfgLogo = theme === "dark" 
    ? "https://raw.githubusercontent.com/GeeksforGeeks-Student-Chapter-MU/assets/main/gfg_logo.png"
    : "https://media.geeksforgeeks.org/wp-content/cdn-uploads/20210420155809/gfg-new-logo.png";

  const currentMuLogo = theme === "dark"
    ? "https://www.marwadiuniversity.ac.in/wp-content/uploads/2021/04/Logo-1.png"
    : "https://www.marwadiuniversity.ac.in/wp-content/themes/marwadi-university/assets/img/logomain.svg";

  useEffect(() => {
    const checkAdmin = () => {
      const savedAdmin = localStorage.getItem("admin_user");
      if (savedAdmin) {
        try {
          const parsed = JSON.parse(savedAdmin);
          setIsAdmin(parsed?.email?.toLowerCase() === "meetkhakhkhar05@gmail.com");
        } catch {
          setIsAdmin(false);
        }
      } else {
        setIsAdmin(false);
      }
    };
    checkAdmin();
    window.addEventListener("storage", checkAdmin);
    return () => window.removeEventListener("storage", checkAdmin);
  }, [location.pathname]);

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-50 h-20 shrink-0 min-h-[5rem] flex items-center px-4 sm:px-6 bg-theme-bg border-b border-theme-border shadow-sm theme-transition select-none">
        <div className="max-w-7xl mx-auto w-full flex items-center justify-between">
          
          {/* Left Side: GFG Logo + Navigation Links */}
          <div className="flex items-center space-x-12">
            <Link to="/" className="flex-shrink-0 flex items-center justify-center bg-white border border-gray-200/80 shadow-md rounded-xl px-3 md:px-4 py-1.5 h-11 md:h-12 w-auto hover:scale-105 transition-all duration-300">
              <img 
                src="https://media.geeksforgeeks.org/wp-content/cdn-uploads/20210420155809/gfg-new-logo.png" 
                alt="GeeksforGeeks" 
                className="h-6 md:h-7 w-auto object-contain"
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

              {isAdmin && (
                <Link
                  to="/admin/dashboard"
                  className={cn(
                    "text-[10px] font-black uppercase tracking-[0.25em] transition-all duration-300 relative py-2 group text-gfg-primary",
                    location.pathname.startsWith("/admin") 
                      ? "text-[#00aa55] dark:text-[#00ff88]" 
                      : "text-gfg-primary hover:brightness-110"
                  )}
                >
                  Admin Panel
                  <span className={cn(
                    "absolute bottom-0 left-0 w-full h-[1px] bg-[#00aa55] dark:bg-[#00ff88] transition-transform duration-300 origin-left",
                    location.pathname.startsWith("/admin") ? "scale-x-100" : "scale-x-0 group-hover:scale-x-100"
                  )} />
                </Link>
              )}
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

            {/* Premium Day/Night Theme Switch Selector */}
            <div className="flex items-center justify-center shrink-0" id="desktop-theme-toggle">
              <ThemeSelector />
            </div>

            <a 
              href="https://www.marwadiuniversity.ac.in/" 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex items-center hover:scale-105 transition-transform duration-300"
            >
              <div className="flex items-center justify-center bg-white border border-gray-200/80 shadow-md rounded-xl px-3 md:px-4 py-1.5 h-11 md:h-12 w-auto">
                <img 
                  src="https://www.marwadiuniversity.ac.in/wp-content/uploads/2021/04/Logo-1.png" 
                  alt="Marwadi University" 
                  className="h-7 md:h-8 w-auto object-contain"
                  referrerPolicy="no-referrer"
                  onError={(e) => {
                    e.currentTarget.src = "https://www.marwadiuniversity.ac.in/wp-content/themes/marwadi-university/assets/img/logomain.svg";
                  }}
                />
              </div>
            </a>
          </div>

          {/* Right: Mobile Controls containing Theme Toggle & Hamburger */}
          <div className="lg:hidden flex items-center space-x-2">
            
            {/* Premium Day/Night Theme Switch Selector on Mobile */}
            <div className="flex items-center justify-center shrink-0" id="mobile-theme-toggle">
              <ThemeSelector />
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
              <div className="flex items-center justify-start h-11 w-auto">
                <div className="flex items-center justify-center bg-white border border-gray-200/80 shadow-md rounded-xl px-3 py-1.5 h-11 w-auto">
                  <img 
                    src="https://media.geeksforgeeks.org/wp-content/cdn-uploads/20210420155809/gfg-new-logo.png" 
                    alt="GeeksforGeeks" 
                    className="h-6 w-auto object-contain"
                    referrerPolicy="no-referrer"
                  />
                </div>
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

              {isAdmin && (
                <Link
                  to="/admin/dashboard"
                  onClick={() => setIsOpen(false)}
                  className={cn(
                    "text-2xl font-bold uppercase tracking-tight transition-colors duration-200 text-gfg-primary",
                    location.pathname.startsWith("/admin") 
                      ? "text-[#00aa55] dark:text-[#00ff88]" 
                      : "text-gfg-primary hover:brightness-110"
                  )}
                >
                  Admin Panel
                </Link>
              )}

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
                <div className="flex items-center justify-center bg-white border border-gray-200/80 shadow-md rounded-xl px-4 py-2 h-12 w-auto">
                  <img 
                    src="https://www.marwadiuniversity.ac.in/wp-content/uploads/2021/04/Logo-1.png" 
                    alt="MU" 
                    className="h-8 w-auto object-contain" 
                    onError={(e) => {
                      e.currentTarget.src = "https://www.marwadiuniversity.ac.in/wp-content/themes/marwadi-university/assets/img/logomain.svg";
                    }}
                  />
                </div>
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
