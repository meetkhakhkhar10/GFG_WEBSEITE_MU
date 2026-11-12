import { Link, useLocation } from "react-router-dom";
import { cn } from "@/src/lib/utils";
import { Menu, X, ArrowUpRight, Code2 } from "lucide-react";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";

const navLinks = [
  { name: "Home", path: "/", num: "01" },
  { name: "Courses", path: "/courses", num: "02" },
  { name: "Coding Arena", href: "https://gfg-code-arena.netlify.app/", num: "03", external: true, icon: Code2 },
  { name: "Events", path: "/events", num: "04" },
  { name: "Team", path: "/team", num: "05" },
  { name: "About", path: "/about", num: "06" },
  { name: "Contact", path: "/contact", num: "07" },
];

const GFG_LOGO_PRIMARY = "/gfg-logo.png";
const GFG_LOGO_FALLBACK = "https://media.geeksforgeeks.org/wp-content/cdn-uploads/20210420155809/gfg-new-logo.png";

const MU_LOGO_PRIMARY = "/marwadi-university-logo.svg";
const MU_LOGO_FALLBACK = "https://www.marwadiuniversity.ac.in/wp-content/themes/marwadi-university/assets/img/logomain.svg";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const [isAdmin, setIsAdmin] = useState(false);
  const [gfgLogo, setGfgLogo] = useState(GFG_LOGO_PRIMARY);
  const [muLogo, setMuLogo] = useState(MU_LOGO_PRIMARY);

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

  // Lock scroll when mobile menu is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-50 h-18 bg-[#F4F4F0]/90 backdrop-blur-md border-b border-[#E2E2DC] transition-colors select-none">
        <div className="main-container h-full flex items-center justify-between gap-4">
          
          {/* Left: GFG × Marwadi University Institutional Brand Lockup */}
          <div className="flex items-center space-x-3 sm:space-x-4 flex-shrink-0">
            <Link 
              to="/" 
              className="flex items-center gap-2 sm:gap-2.5 md:gap-3 group py-1 flex-shrink-0"
              aria-label="GeeksforGeeks Marwadi University Student Chapter Home"
            >
              {/* GFG Logo Container */}
              <div className="flex-shrink-0 flex items-center justify-center h-[22px] sm:h-[28px] w-auto">
                <img 
                  src={gfgLogo} 
                  alt="GeeksforGeeks" 
                  className="h-full w-auto object-contain block select-none"
                  referrerPolicy="no-referrer"
                  onError={() => setGfgLogo(GFG_LOGO_FALLBACK)}
                />
              </div>

              {/* Separator */}
              <span className="flex-shrink-0 text-[#8B9198] font-mono text-[10px] font-light select-none leading-none">
                ×
              </span>

              {/* Marwadi University Logo Container */}
              <div className="flex-shrink-0 flex items-center justify-center h-[24px] sm:h-[32px] w-auto">
                <img 
                  src={muLogo} 
                  alt="Marwadi University" 
                  className="h-full w-auto object-contain block select-none"
                  referrerPolicy="no-referrer"
                  onError={() => setMuLogo(MU_LOGO_FALLBACK)}
                />
              </div>
            </Link>

            <span className="hidden xl:inline-block h-4 w-[1px] bg-[#E2E2DC] flex-shrink-0" />
            <span className="hidden xl:inline-block font-mono text-[9px] uppercase tracking-widest text-[#8B9198] flex-shrink-0">
              CH. 2026
            </span>
          </div>

          {/* Center: Editorial Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-x-4 xl:gap-x-6 2xl:gap-x-8 flex-1 justify-center">
            {navLinks.map((link) => {
              if (link.external) {
                const Icon = link.icon;
                return (
                  <a
                    key={link.href}
                    href={link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="relative py-1 font-mono text-[13px] xl:text-[14px] 2xl:text-[15px] font-bold uppercase tracking-[0.12em] transition-colors duration-200 flex items-center gap-1.5 text-[#555B63] hover:text-[#00A86B] group whitespace-nowrap"
                  >
                    <span className="text-[9px] opacity-40 font-normal hidden xl:inline">{link.num}</span>
                    {Icon && <Icon className="w-3.5 h-3.5 text-[#00A86B]" />}
                    <span>{link.name}</span>
                    <ArrowUpRight className="w-3 h-3 opacity-60 group-hover:opacity-100 transition-opacity hidden sm:inline" />
                    <span className="absolute -bottom-2.5 left-0 right-0 h-[2px] bg-[#00A86B] scale-x-0 group-hover:scale-x-100 transition-transform duration-200 origin-left" />
                  </a>
                );
              }
              const isActive = location.pathname === link.path;
              const Icon = link.icon;
              return (
                <Link
                  key={link.path}
                  to={link.path}
                  className={cn(
                    "relative py-1 font-mono text-[13px] xl:text-[14px] 2xl:text-[15px] font-bold uppercase tracking-[0.12em] transition-colors duration-200 flex items-center gap-1.5 group whitespace-nowrap",
                    isActive ? "text-[#00A86B]" : "text-[#555B63] hover:text-[#00A86B]"
                  )}
                >
                  <span className="text-[9px] opacity-40 font-normal hidden xl:inline">{link.num}</span>
                  {Icon && <Icon className="w-3.5 h-3.5 text-[#00A86B]" />}
                  <span>{link.name}</span>
                  {isActive && (
                    <motion.div
                      layoutId="navIndicator"
                      className="absolute -bottom-2.5 left-0 right-0 h-[2px] bg-[#00A86B]"
                      transition={{ type: "spring", stiffness: 400, damping: 30 }}
                    />
                  )}
                  <span className="absolute -bottom-2.5 left-0 right-0 h-[2px] bg-[#00A86B] scale-x-0 group-hover:scale-x-100 transition-transform duration-200 origin-left pointer-events-none" />
                </Link>
              );
            })}

            {isAdmin && (
              <Link
                to="/admin/dashboard"
                className={cn(
                  "relative py-1 font-mono text-[13px] xl:text-[14px] 2xl:text-[15px] font-bold uppercase tracking-[0.12em] transition-colors duration-200 text-[#00A86B] whitespace-nowrap",
                  location.pathname.startsWith("/admin") ? "font-bold" : "opacity-90 hover:opacity-100"
                )}
              >
                [Admin]
              </Link>
            )}
          </nav>

          {/* Right: Technical CTA / Coordinates */}
          <div className="hidden lg:flex items-center space-x-4 xl:space-x-6 flex-shrink-0">
            <div className="hidden xl:flex items-center space-x-2 font-mono text-[9px] text-[#8B9198]">
              <span className="inline-block w-1 h-1 rounded-full bg-[#00A86B] animate-pulse" />
              <span>RAJKOT, IN</span>
            </div>

            <a
              href="https://chat.whatsapp.com/F7RcXCTLYJ4Ije5NiL6sDM"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center space-x-2 px-3.5 py-1.5 xl:px-4 xl:py-2 text-[11px] xl:text-xs font-mono uppercase tracking-widest text-[#111318] bg-transparent hover:bg-[#111318] hover:text-[#F4F4F0] border border-[#111318] transition-colors duration-200 font-bold whitespace-nowrap"
            >
              <span>Join Circle</span>
              <ArrowUpRight className="w-3 h-3" />
            </a>
          </div>

          {/* Mobile Hamburger Button */}
          <div className="lg:hidden flex items-center space-x-3">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 text-[#111318] hover:text-[#00A86B] transition-colors focus:outline-none"
              aria-label="Toggle Navigation"
            >
              {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

        </div>
      </header>

      {/* Full-Screen Mobile Editorial Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
            className="fixed inset-0 z-50 bg-[#F4F4F0] flex flex-col justify-between overflow-y-auto lg:hidden"
          >
            {/* Background architectural grid */}
            <div className="absolute inset-0 bg-technical-grid opacity-60 pointer-events-none" />

            <div className="relative z-10">
              {/* Mobile Menu Header - Single Top Branding Row */}
              <header className="mobile-menu-header h-18 px-6 border-b border-[#E2E2DC] bg-[#F4F4F0]/95 backdrop-blur-md">
                <div className="mobile-branding">
                  <img 
                    src={gfgLogo} 
                    alt="GeeksforGeeks" 
                    className="gfg-logo"
                    referrerPolicy="no-referrer"
                    onError={() => setGfgLogo(GFG_LOGO_FALLBACK)}
                  />
                  <span className="brand-separator">×</span>
                  <img 
                    src={muLogo} 
                    alt="Marwadi University" 
                    className="marwadi-logo"
                    referrerPolicy="no-referrer"
                    onError={() => setMuLogo(MU_LOGO_FALLBACK)}
                  />
                </div>

                <button
                  onClick={() => setIsOpen(false)}
                  className="mobile-menu-close p-2 text-[#111318] hover:text-[#00A86B] transition-colors focus:outline-none"
                  aria-label="Close Navigation"
                >
                  <X className="w-6 h-6" />
                </button>
              </header>

              {/* Navigation links directly below the single header */}
              <div className="px-8 py-6 space-y-6">
                <nav className="flex flex-col space-y-3">
                  {navLinks.map((link) => {
                    if (link.external) {
                      const Icon = link.icon;
                      return (
                        <a
                          key={link.href}
                          href={link.href}
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={() => setIsOpen(false)}
                          className="group flex items-baseline justify-between py-2 border-b border-[#E2E2DC]/60"
                        >
                          <div className="flex items-center gap-3">
                            <span className="font-editorial text-3xl sm:text-4xl transition-colors tracking-tight text-[#111318] group-hover:text-[#00A86B]">
                              {link.name}
                            </span>
                            {Icon && <Icon className="w-6 h-6 text-[#00A86B]" />}
                          </div>
                          <div className="flex items-center gap-2">
                            <ArrowUpRight className="w-4 h-4 text-[#8B9198] group-hover:text-[#00A86B]" />
                            <span className="font-mono text-xs text-[#8B9198] tracking-widest">
                              {link.num}
                            </span>
                          </div>
                        </a>
                      );
                    }
                    const isActive = location.pathname === link.path;
                    const Icon = link.icon;
                    return (
                      <Link
                        key={link.path}
                        to={link.path}
                        onClick={() => setIsOpen(false)}
                        className="group flex items-baseline justify-between py-2 border-b border-[#E2E2DC]/60"
                      >
                        <div className="flex items-center gap-3">
                          <span
                            className={cn(
                              "font-editorial text-3xl sm:text-4xl transition-colors tracking-tight",
                              isActive ? "text-[#00A86B] italic" : "text-[#111318] group-hover:text-[#00A86B]"
                            )}
                          >
                            {link.name}
                          </span>
                          {Icon && <Icon className="w-5 h-5 text-[#00A86B]" />}
                        </div>
                        <span className="font-mono text-xs text-[#8B9198] tracking-widest">
                          {link.num}
                        </span>
                      </Link>
                    );
                  })}

                  {isAdmin && (
                    <Link
                      to="/admin/dashboard"
                      onClick={() => setIsOpen(false)}
                      className="flex items-baseline justify-between py-2 text-[#00A86B] border-b border-[#E2E2DC]/60"
                    >
                      <span className="font-editorial text-2xl">Admin Dashboard</span>
                      <span className="font-mono text-xs">ROOT</span>
                    </Link>
                  )}
                </nav>
              </div>
            </div>

            {/* Bottom CTA & Coordinates */}
            <div className="relative z-10 px-8 pb-10 pt-4 border-t border-[#E2E2DC] space-y-4">
              <a
                href="https://chat.whatsapp.com/F7RcXCTLYJ4Ije5NiL6sDM"
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => setIsOpen(false)}
                className="w-full py-3.5 bg-[#111318] text-[#F4F4F0] font-mono text-xs uppercase tracking-widest flex items-center justify-center space-x-2"
              >
                <span>Connect with Chapter</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </a>

              <div className="flex items-center justify-between font-mono text-[10px] text-[#8B9198]">
                <span>MARWADI UNIVERSITY, RAJKOT</span>
                <span>LAT 22.3039° N</span>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
