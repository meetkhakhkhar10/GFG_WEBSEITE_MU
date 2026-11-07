import { Link, useLocation, useNavigate } from "react-router-dom"
import React, { useState, useEffect, useRef } from "react"
import { cn } from "@/src/lib/utils"
import { 
  Home, 
  BookOpen, 
  Zap, 
  Calendar, 
  Users, 
  Info, 
  Mail, 
  Menu, 
  X, 
  ChevronDown, 
  LayoutDashboard, 
  User, 
  LogOut, 
  ShieldCheck, 
  LogIn,
  FileText,
  Trophy,
  Megaphone,
  Sparkles
} from "lucide-react"
import { motion, AnimatePresence } from "motion/react"
import { useAuth } from "@/src/contexts/AuthContext"

const GFG_LOGO_PRIMARY = "/gfg-logo.png"
const GFG_LOGO_FALLBACK = "https://media.geeksforgeeks.org/wp-content/cdn-uploads/20210420155809/gfg-new-logo.png"

const MU_LOGO_PRIMARY = "/marwadi-university-logo.svg"
const MU_LOGO_FALLBACK = "https://www.marwadiuniversity.ac.in/wp-content/themes/marwadi-university/assets/img/logomain.svg"

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false)
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)
  
  const location = useLocation()
  const navigate = useNavigate()
  const { user, isAuthenticated, logout } = useAuth()
  
  const [gfgLogo, setGfgLogo] = useState(GFG_LOGO_PRIMARY)
  const [muLogo, setMuLogo] = useState(MU_LOGO_PRIMARY)

  // Strict backend-verified admin check (students must never see admin panel option)
  const isAdmin = user?.role === "admin" || user?.role === "super_admin"

  // Exact 7 Main Navigation Items
  const navLinks = [
    { name: "Home", path: "/", icon: Home },
    { name: "Courses", path: "/courses", icon: BookOpen },
    { name: "Daily Coding Arena", path: "/coding-arena", icon: Zap },
    { name: "Events", path: "/events", icon: Calendar },
    { name: "Team", path: "/team", icon: Users },
    { name: "About", path: "/about", icon: Info },
    { name: "Contact", path: "/contact", icon: Mail },
  ]

  // Close dropdown on click outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownOpen(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  // Lock scroll when mobile menu is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden"
    } else {
      document.body.style.overflow = ""
    }
    return () => {
      document.body.style.overflow = ""
    }
  }, [isOpen])

  // Close mobile menu on route change
  useEffect(() => {
    setIsOpen(false)
    setDropdownOpen(false)
  }, [location.pathname, location.search])

  const handleLogout = () => {
    logout()
    setDropdownOpen(false)
    setIsOpen(false)
    navigate("/")
  }

  return (
    <>
      <header className="sticky top-0 z-50 h-20 bg-white/95 backdrop-blur-md border-b border-slate-200/90 shadow-xs transition-colors select-none">
        <div className="max-w-[1440px] mx-auto h-full px-4 sm:px-6 lg:px-8 flex items-center justify-between gap-4">
          
          {/* Left: GFG × Marwadi University Brand Lockup */}
          <div className="flex items-center space-x-3 sm:space-x-4 flex-shrink-0">
            <Link 
              to="/" 
              className="flex items-center gap-2 sm:gap-3 group py-1 flex-shrink-0"
              aria-label="GeeksforGeeks Marwadi University Student Chapter"
            >
              {/* GFG Logo Container */}
              <div className="flex-shrink-0 flex items-center justify-center h-[28px] sm:h-[32px] w-auto">
                <img 
                  src={gfgLogo} 
                  alt="GeeksforGeeks" 
                  className="h-full w-auto max-h-[32px] object-contain block select-none"
                  referrerPolicy="no-referrer"
                  onError={() => setGfgLogo(GFG_LOGO_FALLBACK)}
                />
              </div>

              {/* Separator */}
              <span className="flex-shrink-0 text-slate-400 font-mono text-sm font-semibold select-none leading-none">
                ×
              </span>

              {/* Marwadi University Logo Container */}
              <div className="flex-shrink-0 flex items-center justify-center h-[30px] sm:h-[36px] w-auto">
                <img 
                  src={muLogo} 
                  alt="Marwadi University" 
                  className="h-full w-auto max-h-[36px] object-contain block select-none"
                  referrerPolicy="no-referrer"
                  onError={() => setMuLogo(MU_LOGO_FALLBACK)}
                />
              </div>
            </Link>

            <span className="hidden xl:inline-block h-5 w-[1px] bg-slate-200 flex-shrink-0" />
            <span className="hidden xl:inline-flex items-center px-2 py-0.5 rounded bg-emerald-50 text-emerald-800 text-[10px] font-extrabold uppercase tracking-wider border border-emerald-200/60 flex-shrink-0">
              Student Chapter
            </span>
          </div>

          {/* Center: Desktop 7 Navigation Links */}
          <nav className="hidden lg:flex items-center space-x-1 xl:space-x-1.5">
            {navLinks.map((link) => {
              const Icon = link.icon
              const isActive = location.pathname === link.path

              return (
                <Link
                  key={link.path}
                  to={link.path}
                  className={cn(
                    "relative px-3 py-2 text-xs xl:text-sm font-bold tracking-tight rounded-xl transition-all duration-150 flex items-center gap-1.5",
                    isActive 
                      ? "text-[#00A86B] bg-emerald-50/80 border border-emerald-200/80 shadow-2xs" 
                      : "text-slate-700 hover:text-slate-900 hover:bg-slate-100/80 border border-transparent"
                  )}
                >
                  <Icon className={cn("w-4 h-4 shrink-0 transition-colors", isActive ? "text-[#00A86B]" : "text-slate-500")} />
                  <span>{link.name}</span>
                  {isActive && (
                    <motion.span
                      layoutId="navActiveIndicator"
                      className="absolute bottom-0 left-3 right-3 h-[2px] bg-[#00A86B] rounded-full"
                      transition={{ type: "spring", stiffness: 380, damping: 30 }}
                    />
                  )}
                </Link>
              )
            })}
          </nav>

          {/* Right: Authenticated User Dropdown or Guest Login / Register CTA */}
          <div className="hidden lg:flex items-center space-x-3 flex-shrink-0">
            {isAuthenticated && user ? (
              <div className="relative" ref={dropdownRef}>
                <button
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  className="flex items-center space-x-2.5 p-1.5 pl-2 pr-3 rounded-full bg-slate-100 hover:bg-slate-200/70 border border-slate-200 transition-all cursor-pointer focus:outline-none"
                >
                  <img
                    src={user.profilePhoto || "https://api.dicebear.com/7.x/avataaars/svg?seed=student"}
                    alt={user.name}
                    className="w-8 h-8 rounded-full object-cover border-2 border-[#00A86B] shadow-xs"
                  />
                  <span className="text-xs font-bold text-slate-800 max-w-[110px] truncate">
                    {user.name.split(" ")[0]}
                  </span>
                  <ChevronDown className={cn("w-4 h-4 text-slate-500 transition-transform duration-200", dropdownOpen && "rotate-180")} />
                </button>

                {/* Profile Dropdown Menu */}
                <AnimatePresence>
                  {dropdownOpen && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.95, y: 6 }}
                      animate={{ opacity: 1, scale: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.95, y: 6 }}
                      transition={{ duration: 0.15, ease: "easeOut" }}
                      className="absolute right-0 mt-2 w-72 bg-white rounded-2xl shadow-xl border border-slate-200/90 py-2 z-50 text-left divide-y divide-slate-100"
                    >
                      {/* Dropdown Header */}
                      <div className="px-4 py-3 bg-slate-50/70 rounded-t-2xl">
                        <div className="flex items-center space-x-3">
                          <img
                            src={user.profilePhoto || "https://api.dicebear.com/7.x/avataaars/svg?seed=student"}
                            alt={user.name}
                            className="w-11 h-11 rounded-full object-cover border-2 border-[#00A86B] shadow-sm"
                          />
                          <div className="min-w-0 flex-1">
                            <p className="text-sm font-extrabold text-slate-900 truncate">{user.name}</p>
                            <p className="text-xs text-slate-500 truncate">{user.email}</p>
                            <div className="flex items-center space-x-2 mt-1">
                              <span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 text-[10px] font-bold uppercase">
                                {user.enrollment_no || "MU Student"}
                              </span>
                              {user.points !== undefined && (
                                <span className="text-[10px] font-extrabold text-emerald-700 flex items-center gap-0.5">
                                  <Sparkles className="w-3 h-3" /> {user.points} XP
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Dropdown Student Links */}
                      <div className="py-1.5 px-1.5 space-y-0.5">
                        <Link
                          to="/student/dashboard"
                          onClick={() => setDropdownOpen(false)}
                          className="flex items-center space-x-2.5 px-3 py-2 text-xs font-bold text-slate-700 hover:text-[#00A86B] hover:bg-emerald-50/70 rounded-xl transition-colors"
                        >
                          <LayoutDashboard className="w-4 h-4 text-slate-500" />
                          <span>My Dashboard</span>
                        </Link>
                        
                        <Link
                          to="/student/submissions"
                          onClick={() => setDropdownOpen(false)}
                          className="flex items-center space-x-2.5 px-3 py-2 text-xs font-bold text-slate-700 hover:text-[#00A86B] hover:bg-emerald-50/70 rounded-xl transition-colors"
                        >
                          <FileText className="w-4 h-4 text-slate-500" />
                          <span>My Submissions</span>
                        </Link>

                        <Link
                          to="/students"
                          onClick={() => setDropdownOpen(false)}
                          className="flex items-center space-x-2.5 px-3 py-2 text-xs font-bold text-slate-700 hover:text-[#00A86B] hover:bg-emerald-50/70 rounded-xl transition-colors"
                        >
                          <Users className="w-4 h-4 text-slate-500" />
                          <span>Students Directory</span>
                        </Link>

                        <Link
                          to="/leaderboard"
                          onClick={() => setDropdownOpen(false)}
                          className="flex items-center space-x-2.5 px-3 py-2 text-xs font-bold text-slate-700 hover:text-[#00A86B] hover:bg-emerald-50/70 rounded-xl transition-colors"
                        >
                          <Trophy className="w-4 h-4 text-slate-500" />
                          <span>Leaderboard</span>
                        </Link>
                      </div>

                      {/* Admin Panel Link (ONLY displayed to verified authorized administrators) */}
                      {isAdmin && (
                        <div className="py-1.5 px-1.5 bg-amber-50/50">
                          <Link
                            to="/admin/questions"
                            onClick={() => setDropdownOpen(false)}
                            className="flex items-center space-x-2.5 px-3 py-2 text-xs font-extrabold text-amber-900 bg-amber-100/80 hover:bg-amber-200/80 border border-amber-200/80 rounded-xl transition-colors"
                          >
                            <ShieldCheck className="w-4 h-4 text-amber-700 shrink-0" />
                            <span>Admin Panel</span>
                          </Link>
                        </div>
                      )}

                      {/* Logout Action */}
                      <div className="pt-1.5 px-1.5 pb-1">
                        <button
                          onClick={handleLogout}
                          className="w-full flex items-center space-x-2.5 px-3 py-2 text-xs font-bold text-rose-600 hover:bg-rose-50 rounded-xl transition-colors cursor-pointer"
                        >
                          <LogOut className="w-4 h-4" />
                          <span>Sign Out</span>
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <Link
                  to="/login"
                  className="inline-flex items-center space-x-2 px-4 py-2 text-xs font-bold text-slate-700 hover:text-[#00A86B] hover:bg-slate-100 rounded-xl transition-all cursor-pointer"
                >
                  <LogIn className="w-4 h-4" />
                  <span>Login</span>
                </Link>
                <Link
                  to="/login?mode=register"
                  className="inline-flex items-center space-x-2 px-4 py-2 text-xs font-bold text-white bg-[#00A86B] hover:bg-[#008f5a] rounded-xl shadow-xs transition-all cursor-pointer"
                >
                  <span>Register</span>
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Hamburger Button */}
          <div className="lg:hidden flex items-center space-x-2">
            {isAuthenticated && user && (
              <img
                src={user.profilePhoto || "https://api.dicebear.com/7.x/avataaars/svg?seed=student"}
                alt={user.name}
                className="w-8 h-8 rounded-full object-cover border-2 border-[#00A86B]"
              />
            )}
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-2.5 rounded-xl bg-slate-100 text-slate-800 hover:text-[#00A86B] hover:bg-emerald-50 transition-colors focus:outline-none cursor-pointer"
              aria-label="Toggle Navigation Menu"
            >
              {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

        </div>
      </header>

      {/* MOBILE SLIDE-IN NAVIGATION DRAWER */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs lg:hidden"
            />

            {/* Slide-in Drawer */}
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", stiffness: 350, damping: 32 }}
              className="fixed top-0 right-0 bottom-0 z-50 w-full max-w-sm bg-white shadow-2xl flex flex-col justify-between overflow-y-auto lg:hidden"
            >
              <div className="p-6">
                {/* Mobile Header Top */}
                <div className="flex items-center justify-between pb-5 border-b border-slate-200">
                  <div className="flex items-center space-x-2">
                    <img 
                      src={gfgLogo} 
                      alt="GeeksforGeeks" 
                      className="h-6 w-auto object-contain"
                      onError={() => setGfgLogo(GFG_LOGO_FALLBACK)}
                    />
                    <span className="text-slate-400 font-mono text-xs">×</span>
                    <img 
                      src={muLogo} 
                      alt="Marwadi University" 
                      className="h-7 w-auto object-contain"
                      onError={() => setMuLogo(MU_LOGO_FALLBACK)}
                    />
                  </div>

                  <button
                    onClick={() => setIsOpen(false)}
                    className="p-2 rounded-lg bg-slate-100 text-slate-600 hover:text-slate-900 focus:outline-none"
                    aria-label="Close Menu"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                {/* Mobile User Profile Section */}
                <div className="py-5">
                  {isAuthenticated && user ? (
                    <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
                      <div className="flex items-center space-x-3">
                        <img
                          src={user.profilePhoto || "https://api.dicebear.com/7.x/avataaars/svg?seed=student"}
                          alt={user.name}
                          className="w-12 h-12 rounded-full object-cover border-2 border-[#00A86B] shadow-xs shrink-0"
                        />
                        <div className="min-w-0 flex-1">
                          <p className="font-extrabold text-slate-900 text-base truncate">{user.name}</p>
                          <p className="text-xs text-slate-500 truncate">{user.email}</p>
                          <p className="text-[11px] font-semibold text-emerald-700 mt-0.5">{user.department || "CSE"}</p>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-200/80 text-center font-mono text-xs">
                        <div className="p-2 bg-white rounded-xl border border-slate-200">
                          <span className="text-slate-500 text-[10px] block">TOTAL POINTS</span>
                          <span className="font-extrabold text-[#00A86B] text-sm">⚡ {user.points || 0} XP</span>
                        </div>
                        <div className="p-2 bg-white rounded-xl border border-slate-200">
                          <span className="text-slate-500 text-[10px] block">SOLVING STREAK</span>
                          <span className="font-extrabold text-orange-500 text-sm">🔥 {user.streak || 0}d</span>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="grid grid-cols-2 gap-2">
                      <Link
                        to="/login"
                        onClick={() => setIsOpen(false)}
                        className="py-3 px-3 bg-slate-100 text-slate-800 font-bold text-xs rounded-xl flex items-center justify-center space-x-1.5 hover:bg-slate-200"
                      >
                        <LogIn className="w-4 h-4" />
                        <span>Sign In</span>
                      </Link>
                      <Link
                        to="/login?mode=register"
                        onClick={() => setIsOpen(false)}
                        className="py-3 px-3 bg-[#00A86B] text-white font-bold text-xs rounded-xl flex items-center justify-center space-x-1.5 hover:bg-[#008f5a]"
                      >
                        <span>Register</span>
                      </Link>
                    </div>
                  )}
                </div>

                {/* Mobile Navigation Links (Exact 7 Main Items) */}
                <nav className="space-y-1.5 pt-2">
                  <p className="text-[11px] font-extrabold uppercase tracking-wider text-slate-400 px-3 pb-1">
                    Main Navigation
                  </p>
                  {navLinks.map((link) => {
                    const Icon = link.icon
                    const isActive = location.pathname === link.path

                    return (
                      <Link
                        key={link.path}
                        to={link.path}
                        onClick={() => setIsOpen(false)}
                        className={cn(
                          "flex items-center space-x-3 px-3.5 py-3 rounded-xl font-bold text-sm transition-all",
                          isActive
                            ? "bg-emerald-50 text-[#00A86B] border border-emerald-200/80"
                            : "text-slate-700 hover:bg-slate-100"
                        )}
                      >
                        <Icon className={cn("w-5 h-5 shrink-0", isActive ? "text-[#00A86B]" : "text-slate-400")} />
                        <span>{link.name}</span>
                      </Link>
                    )
                  })}

                  {/* Student Dedicated Links */}
                  {isAuthenticated && (
                    <>
                      <div className="pt-3 pb-1">
                        <p className="text-[11px] font-extrabold uppercase tracking-wider text-slate-400 px-3">
                          Student Portal
                        </p>
                      </div>
                      <Link
                        to="/student/dashboard"
                        onClick={() => setIsOpen(false)}
                        className="flex items-center space-x-3 px-3.5 py-3 rounded-xl font-bold text-sm text-slate-700 hover:bg-slate-100"
                      >
                        <LayoutDashboard className="w-5 h-5 text-slate-400" />
                        <span>My Dashboard</span>
                      </Link>
                      <Link
                        to="/student/submissions"
                        onClick={() => setIsOpen(false)}
                        className="flex items-center space-x-3 px-3.5 py-3 rounded-xl font-bold text-sm text-slate-700 hover:bg-slate-100"
                      >
                        <FileText className="w-5 h-5 text-slate-400" />
                        <span>My Submissions</span>
                      </Link>
                      <Link
                        to="/students"
                        onClick={() => setIsOpen(false)}
                        className="flex items-center space-x-3 px-3.5 py-3 rounded-xl font-bold text-sm text-slate-700 hover:bg-slate-100"
                      >
                        <Users className="w-5 h-5 text-slate-400" />
                        <span>Students Directory</span>
                      </Link>
                      <Link
                        to="/leaderboard"
                        onClick={() => setIsOpen(false)}
                        className="flex items-center space-x-3 px-3.5 py-3 rounded-xl font-bold text-sm text-slate-700 hover:bg-slate-100"
                      >
                        <Trophy className="w-5 h-5 text-slate-400" />
                        <span>Leaderboard</span>
                      </Link>
                    </>
                  )}

                  {/* Admin Links (ONLY displayed to verified authorized administrators) */}
                  {isAdmin && (
                    <>
                      <div className="pt-3 pb-1">
                        <p className="text-[11px] font-extrabold uppercase tracking-wider text-amber-600 px-3">
                          Admin Management
                        </p>
                      </div>
                      <Link
                        to="/admin/questions"
                        onClick={() => setIsOpen(false)}
                        className="flex items-center space-x-3 px-3.5 py-3 rounded-xl font-bold text-sm bg-amber-50 text-amber-900 border border-amber-200"
                      >
                        <ShieldCheck className="w-5 h-5 text-amber-600" />
                        <span>Admin Panel</span>
                      </Link>
                    </>
                  )}
                </nav>
              </div>

              {/* Drawer Bottom Actions */}
              <div className="p-6 border-t border-slate-200 bg-slate-50">
                {isAuthenticated ? (
                  <button
                    onClick={handleLogout}
                    className="w-full py-3 px-4 bg-rose-50 text-rose-700 font-bold text-sm rounded-xl flex items-center justify-center space-x-2 border border-rose-200 cursor-pointer"
                  >
                    <LogOut className="w-4 h-4" />
                    <span>Sign Out</span>
                  </button>
                ) : (
                  <div className="text-center font-mono text-xs text-slate-500">
                    GeeksforGeeks Student Chapter · MU
                  </div>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  )
}
