import React, { useState, useEffect } from "react"
import { motion, AnimatePresence } from "motion/react"
import { 
  LogIn, UserPlus, Lock, Mail, User, GraduationCap, 
  BookOpen, CheckCircle2, AlertCircle, ArrowLeft, KeyRound, 
  ShieldCheck, Loader2
} from "lucide-react"
import { useNavigate, Link, useSearchParams } from "react-router-dom"
import { useAuth } from "../contexts/AuthContext"

const GFG_LOGO_PRIMARY = "/gfg-logo.png"
const GFG_LOGO_FALLBACK = "https://media.geeksforgeeks.org/wp-content/cdn-uploads/20210420155809/gfg-new-logo.png"

const MU_LOGO_PRIMARY = "/marwadi-university-logo.svg"
const MU_LOGO_FALLBACK = "https://www.marwadiuniversity.ac.in/wp-content/themes/marwadi-university/assets/img/logomain.svg"

export default function StudentLogin() {
  const { user, isAuthenticated, loginWithEmail, registerStudent, signInWithGoogle } = useAuth()
  const navigate = useNavigate()
  const [searchParams, setSearchParams] = useSearchParams()

  // Tab State: "login" or "register"
  const initialMode = searchParams.get("mode") === "register" ? "register" : "login"
  const [mode, setMode] = useState<"login" | "register">(initialMode)

  // Login Form Inputs
  const [loginEmail, setLoginEmail] = useState("")
  const [loginPassword, setLoginPassword] = useState("")

  // Registration Form Inputs
  const [regName, setRegName] = useState("")
  const [regEmail, setRegEmail] = useState("")
  const [regEnrollment, setRegEnrollment] = useState("")
  const [regSemester, setRegSemester] = useState("6th Semester")
  const [regDepartment, setRegDepartment] = useState("Computer Science & Engineering")
  const [regPassword, setRegPassword] = useState("")
  const [regConfirmPassword, setRegConfirmPassword] = useState("")

  // Feedback & Loading States
  const [loading, setLoading] = useState(false)
  const [errorMsg, setErrorMsg] = useState("")
  const [successMsg, setSuccessMsg] = useState("")
  const [forgotPasswordModal, setForgotPasswordModal] = useState(false)
  const [resetEmail, setResetEmail] = useState("")
  const [resetSent, setResetSent] = useState(false)

  // Logos
  const [gfgLogo, setGfgLogo] = useState(GFG_LOGO_PRIMARY)
  const [muLogo, setMuLogo] = useState(MU_LOGO_PRIMARY)

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated && user) {
      if (user.role === "admin" || user.role === "super_admin") {
        navigate("/admin/dashboard", { replace: true })
      } else {
        navigate("/student/dashboard", { replace: true })
      }
    }
  }, [isAuthenticated, user, navigate])

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setErrorMsg("")
    setSuccessMsg("")

    if (!loginEmail.trim() || !loginPassword.trim()) {
      setErrorMsg("Please enter both your college email and password.")
      return
    }

    setLoading(true)
    try {
      const result = await loginWithEmail(loginEmail.trim(), loginPassword)
      setLoading(false)

      if (result.success) {
        setSuccessMsg("Authentication successful! Redirecting to dashboard...")
        setTimeout(() => {
          const savedUser = JSON.parse(localStorage.getItem("user") || "{}")
          if (savedUser.role === "admin" || savedUser.role === "super_admin") {
            navigate("/admin/dashboard", { replace: true })
          } else {
            navigate("/student/dashboard", { replace: true })
          }
        }, 800)
      } else {
        setErrorMsg(result.message || "Invalid credentials. Please check your email and password.")
      }
    } catch (err: any) {
      setLoading(false)
      setErrorMsg(err.message || "Login failed. Please try again.")
    }
  }

  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setErrorMsg("")
    setSuccessMsg("")

    // Validation
    if (!regName.trim()) {
      setErrorMsg("Full Name is required.")
      return
    }
    if (!regEmail.trim()) {
      setErrorMsg("College Email is required.")
      return
    }
    if (!regEnrollment.trim()) {
      setErrorMsg("Enrollment Number is required.")
      return
    }
    if (!regPassword) {
      setErrorMsg("Password is required.")
      return
    }
    if (regPassword.length < 6) {
      setErrorMsg("Password must be at least 6 characters long.")
      return
    }
    if (regPassword !== regConfirmPassword) {
      setErrorMsg("Passwords do not match. Please re-enter your password.")
      return
    }

    setLoading(true)
    try {
      const result = await registerStudent({
        name: regName.trim(),
        email: regEmail.trim(),
        password: regPassword,
        enrollmentNumber: regEnrollment.trim().toUpperCase(),
        department: regDepartment,
        semester: regSemester,
        profilePhoto: `https://api.dicebear.com/7.x/avataaars/svg?seed=${regEmail.trim()}`
      })
      setLoading(false)

      if (result.success) {
        setSuccessMsg("Student account created successfully! Redirecting to your student dashboard...")
        setTimeout(() => {
          navigate("/student/dashboard", { replace: true })
        }, 1000)
      } else {
        setErrorMsg(result.message || "Registration failed. Please try again.")
      }
    } catch (err: any) {
      setLoading(false)
      setErrorMsg(err.message || "Account creation failed.")
    }
  }

  const handleGoogleAuth = async () => {
    setErrorMsg("")
    setSuccessMsg("")
    setLoading(true)

    try {
      const result = await signInWithGoogle()
      setLoading(false)

      if (result.success) {
        setSuccessMsg("Google sign in verified! Redirecting...")
        setTimeout(() => {
          const savedUser = JSON.parse(localStorage.getItem("user") || "{}")
          if (savedUser.role === "admin" || savedUser.role === "super_admin") {
            navigate("/admin/dashboard", { replace: true })
          } else {
            navigate("/student/dashboard", { replace: true })
          }
        }, 800)
      } else {
        setErrorMsg(result.message || "Google Authentication failed.")
      }
    } catch (err: any) {
      setLoading(false)
      setErrorMsg(err.message || "Google Authentication error.")
    }
  }

  const handleForgotPassword = (e: React.FormEvent) => {
    e.preventDefault()
    if (!resetEmail.trim()) {
      setErrorMsg("Please enter your registered college email address.")
      return
    }
    setResetSent(true)
    setTimeout(() => {
      setResetSent(false)
      setForgotPasswordModal(false)
      setSuccessMsg("Password reset instructions sent to " + resetEmail)
      setResetEmail("")
    }, 1500)
  }

  return (
    <div className="min-h-screen bg-[#F4F4F0] text-[#111318] flex items-center justify-center p-4 sm:p-6 relative select-none font-sans">
      
      {/* Background Architectural Grid */}
      <div className="fixed inset-0 pointer-events-none bg-technical-grid opacity-50" />

      {/* Back to Home Button */}
      <Link 
        to="/" 
        className="absolute top-6 left-6 flex items-center gap-2 text-slate-600 hover:text-[#00A86B] font-bold text-xs uppercase tracking-wider transition-colors z-20"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Back to Portal</span>
      </Link>

      <motion.div
        initial={{ opacity: 0, scale: 0.98, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        className="w-full max-w-lg bg-white border border-[#E2E2DC] shadow-xl rounded-3xl p-6 sm:p-10 relative z-10 my-10"
      >
        {/* Header Logo Lockup */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 sm:gap-4 mb-4">
            <img 
              src={gfgLogo} 
              alt="GeeksforGeeks" 
              className="h-7 sm:h-8 w-auto object-contain"
              onError={() => setGfgLogo(GFG_LOGO_FALLBACK)}
            />
            <span className="text-slate-400 font-mono text-sm font-light">×</span>
            <img 
              src={muLogo} 
              alt="Marwadi University" 
              className="h-8 sm:h-9 w-auto object-contain"
              onError={() => setMuLogo(MU_LOGO_FALLBACK)}
            />
          </div>

          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 text-[10px] font-extrabold uppercase tracking-widest border border-emerald-200">
            <span className="w-1.5 h-1.5 rounded-full bg-[#00A86B] animate-pulse" />
            <span>GeeksforGeeks Student Chapter · MU</span>
          </span>

          <h1 className="font-editorial text-2xl sm:text-3xl font-black text-slate-900 mt-3">
            {mode === "login" ? "Student Portal Sign In" : "Register Student Account"}
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 font-medium mt-1">
            {mode === "login" 
              ? "Access your personal dashboard, evaluation history & daily challenges." 
              : "Join GeeksforGeeks Student Chapter with your institutional credentials."}
          </p>
        </div>

        {/* Mode Toggle Pills (Login / Register) */}
        <div className="grid grid-cols-2 gap-2 p-1.5 bg-slate-100 rounded-2xl mb-6">
          <button
            type="button"
            onClick={() => {
              setMode("login")
              setSearchParams({ mode: "login" })
              setErrorMsg("")
              setSuccessMsg("")
            }}
            className={`py-2.5 rounded-xl font-bold text-xs uppercase tracking-wider transition-all cursor-pointer flex items-center justify-center space-x-1.5 ${
              mode === "login"
                ? "bg-white text-slate-900 shadow-xs border border-slate-200"
                : "text-slate-500 hover:text-slate-800"
            }`}
          >
            <LogIn className="w-3.5 h-3.5" />
            <span>Sign In</span>
          </button>

          <button
            type="button"
            onClick={() => {
              setMode("register")
              setSearchParams({ mode: "register" })
              setErrorMsg("")
              setSuccessMsg("")
            }}
            className={`py-2.5 rounded-xl font-bold text-xs uppercase tracking-wider transition-all cursor-pointer flex items-center justify-center space-x-1.5 ${
              mode === "register"
                ? "bg-white text-slate-900 shadow-xs border border-slate-200"
                : "text-slate-500 hover:text-slate-800"
            }`}
          >
            <UserPlus className="w-3.5 h-3.5" />
            <span>Register</span>
          </button>
        </div>

        {/* Feedback Banners */}
        {errorMsg && (
          <div className="mb-6 p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs sm:text-sm font-semibold flex items-start space-x-2">
            <AlertCircle className="w-4 h-4 shrink-0 text-rose-600 mt-0.5" />
            <span>{errorMsg}</span>
          </div>
        )}

        {successMsg && (
          <div className="mb-6 p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs sm:text-sm font-semibold flex items-start space-x-2">
            <CheckCircle2 className="w-4 h-4 shrink-0 text-[#00A86B] mt-0.5" />
            <span>{successMsg}</span>
          </div>
        )}

        {/* ================= MODE 1: LOGIN FORM ================= */}
        {mode === "login" && (
          <form onSubmit={handleLoginSubmit} className="space-y-4">
            
            {/* College Email */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                College Email Address
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                <input
                  type="email"
                  required
                  value={loginEmail}
                  onChange={(e) => setLoginEmail(e.target.value)}
                  placeholder="student@marwadiuniversity.ac.in"
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-[#E2E2DC] rounded-xl text-sm font-medium text-slate-900 focus:outline-none focus:border-[#00A86B] focus:bg-white placeholder:text-slate-400"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
                  Password
                </label>
                <button
                  type="button"
                  onClick={() => setForgotPasswordModal(true)}
                  className="text-xs font-bold text-[#00A86B] hover:underline"
                >
                  Forgot Password?
                </button>
              </div>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                <input
                  type="password"
                  required
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-[#E2E2DC] rounded-xl text-sm font-medium text-slate-900 focus:outline-none focus:border-[#00A86B] focus:bg-white placeholder:text-slate-400"
                />
              </div>
            </div>

            {/* Submit Login Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 px-4 bg-[#00A86B] hover:bg-[#008f5a] disabled:opacity-50 text-white font-bold text-sm uppercase tracking-wider rounded-xl transition-all shadow-xs cursor-pointer flex items-center justify-center space-x-2 mt-2"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Verifying Credentials...</span>
                </>
              ) : (
                <>
                  <LogIn className="w-4 h-4" />
                  <span>Sign In to Student Portal</span>
                </>
              )}
            </button>

            {/* Divider */}
            <div className="relative my-6 text-center">
              <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-[#E2E2DC]" /></div>
              <span className="relative px-3 bg-white text-[11px] font-bold text-slate-400 uppercase tracking-widest">
                OR CONTINUE WITH
              </span>
            </div>

            {/* Google Sign-In Option */}
            <button
              type="button"
              onClick={handleGoogleAuth}
              disabled={loading}
              className="w-full py-3 px-4 bg-slate-50 hover:bg-slate-100 border border-[#E2E2DC] text-slate-800 font-bold text-xs uppercase tracking-wider rounded-xl transition-all flex items-center justify-center space-x-2 cursor-pointer"
            >
              <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
              </svg>
              <span>Sign In with Google</span>
            </button>

            {/* Switch to Register Option */}
            <div className="pt-4 text-center text-xs font-semibold text-slate-600">
              Don't have a student account yet?{" "}
              <button
                type="button"
                onClick={() => {
                  setMode("register")
                  setSearchParams({ mode: "register" })
                  setErrorMsg("")
                  setSuccessMsg("")
                }}
                className="text-[#00A86B] font-extrabold hover:underline"
              >
                Create Account
              </button>
            </div>

          </form>
        )}

        {/* ================= MODE 2: REGISTRATION FORM ================= */}
        {mode === "register" && (
          <form onSubmit={handleRegisterSubmit} className="space-y-3.5">
            
            {/* Full Name */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                Full Name
              </label>
              <div className="relative">
                <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                <input
                  type="text"
                  required
                  value={regName}
                  onChange={(e) => setRegName(e.target.value)}
                  placeholder="e.g. Meet Khakhkhar"
                  className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-[#E2E2DC] rounded-xl text-sm font-medium text-slate-900 focus:outline-none focus:border-[#00A86B] focus:bg-white placeholder:text-slate-400"
                />
              </div>
            </div>

            {/* College Email */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                College Email Address
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                <input
                  type="email"
                  required
                  value={regEmail}
                  onChange={(e) => setRegEmail(e.target.value)}
                  placeholder="student@marwadiuniversity.ac.in"
                  className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-[#E2E2DC] rounded-xl text-sm font-medium text-slate-900 focus:outline-none focus:border-[#00A86B] focus:bg-white placeholder:text-slate-400"
                />
              </div>
            </div>

            {/* Enrollment Number */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                Enrollment Number
              </label>
              <div className="relative">
                <GraduationCap className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                <input
                  type="text"
                  required
                  value={regEnrollment}
                  onChange={(e) => setRegEnrollment(e.target.value)}
                  placeholder="e.g. MU22BCS108"
                  className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-[#E2E2DC] rounded-xl text-sm font-medium text-slate-900 focus:outline-none focus:border-[#00A86B] focus:bg-white placeholder:text-slate-400 uppercase"
                />
              </div>
            </div>

            {/* Department & Semester Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                  Department
                </label>
                <select
                  value={regDepartment}
                  onChange={(e) => setRegDepartment(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-[#E2E2DC] rounded-xl text-xs font-semibold text-slate-900 focus:outline-none focus:border-[#00A86B] cursor-pointer"
                >
                  <option value="Computer Science & Engineering">Computer Science & Eng</option>
                  <option value="Information Technology">Information Technology</option>
                  <option value="Artificial Intelligence & ML">AI & ML</option>
                  <option value="BCA & Computer Applications">BCA / MCA</option>
                  <option value="Electrical Engineering">Electrical Engineering</option>
                  <option value="Mechanical Engineering">Mechanical Engineering</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                  Semester
                </label>
                <select
                  value={regSemester}
                  onChange={(e) => setRegSemester(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-[#E2E2DC] rounded-xl text-xs font-semibold text-slate-900 focus:outline-none focus:border-[#00A86B] cursor-pointer"
                >
                  <option value="1st Semester">1st Semester</option>
                  <option value="2nd Semester">2nd Semester</option>
                  <option value="3rd Semester">3rd Semester</option>
                  <option value="4th Semester">4th Semester</option>
                  <option value="5th Semester">5th Semester</option>
                  <option value="6th Semester">6th Semester</option>
                  <option value="7th Semester">7th Semester</option>
                  <option value="8th Semester">8th Semester</option>
                </select>
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                Password
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                <input
                  type="password"
                  required
                  value={regPassword}
                  onChange={(e) => setRegPassword(e.target.value)}
                  placeholder="At least 6 characters"
                  className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-[#E2E2DC] rounded-xl text-sm font-medium text-slate-900 focus:outline-none focus:border-[#00A86B] focus:bg-white placeholder:text-slate-400"
                />
              </div>
            </div>

            {/* Confirm Password */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                Confirm Password
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                <input
                  type="password"
                  required
                  value={regConfirmPassword}
                  onChange={(e) => setRegConfirmPassword(e.target.value)}
                  placeholder="Re-enter password"
                  className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-[#E2E2DC] rounded-xl text-sm font-medium text-slate-900 focus:outline-none focus:border-[#00A86B] focus:bg-white placeholder:text-slate-400"
                />
              </div>
            </div>

            {/* Submit Registration Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 px-4 bg-[#00A86B] hover:bg-[#008f5a] disabled:opacity-50 text-white font-bold text-sm uppercase tracking-wider rounded-xl transition-all shadow-xs cursor-pointer flex items-center justify-center space-x-2 mt-2"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Creating Student Profile...</span>
                </>
              ) : (
                <>
                  <UserPlus className="w-4 h-4" />
                  <span>Create Student Account</span>
                </>
              )}
            </button>

            {/* Divider */}
            <div className="relative my-4 text-center">
              <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-[#E2E2DC]" /></div>
              <span className="relative px-3 bg-white text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                OR
              </span>
            </div>

            {/* Google Sign-In Option */}
            <button
              type="button"
              onClick={handleGoogleAuth}
              disabled={loading}
              className="w-full py-2.5 px-4 bg-slate-50 hover:bg-slate-100 border border-[#E2E2DC] text-slate-800 font-bold text-xs uppercase tracking-wider rounded-xl transition-all flex items-center justify-center space-x-2 cursor-pointer"
            >
              <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
              </svg>
              <span>Register with Google Account</span>
            </button>

            {/* Switch to Login Option */}
            <div className="pt-3 text-center text-xs font-semibold text-slate-600">
              Already have an account?{" "}
              <button
                type="button"
                onClick={() => {
                  setMode("login")
                  setSearchParams({ mode: "login" })
                  setErrorMsg("")
                  setSuccessMsg("")
                }}
                className="text-[#00A86B] font-extrabold hover:underline"
              >
                Sign In
              </button>
            </div>

          </form>
        )}

      </motion.div>

      {/* FORGOT PASSWORD MODAL */}
      <AnimatePresence>
        {forgotPasswordModal && (
          <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              className="w-full max-w-md bg-white border border-[#E2E2DC] shadow-2xl rounded-2xl p-6 sm:p-8 relative text-slate-900"
            >
              <button
                onClick={() => setForgotPasswordModal(false)}
                className="absolute top-4 right-4 w-8 h-8 rounded-full bg-slate-100 text-slate-700 flex items-center justify-center font-mono text-xs hover:bg-rose-500 hover:text-white transition-colors cursor-pointer"
              >
                ✕
              </button>

              <div className="text-center mb-6">
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-emerald-50 text-[#00A86B] mb-3 border border-emerald-200">
                  <KeyRound className="w-6 h-6" />
                </div>
                <h3 className="font-editorial text-2xl font-black text-slate-900">Reset Your Password</h3>
                <p className="text-xs text-slate-600 font-medium mt-1">
                  Enter your college email address to receive password reset instructions.
                </p>
              </div>

              {resetSent ? (
                <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold rounded-xl text-center space-y-2">
                  <CheckCircle2 className="w-8 h-8 text-[#00A86B] mx-auto" />
                  <p>Reset link sent! Please check your inbox.</p>
                </div>
              ) : (
                <form onSubmit={handleForgotPassword} className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                      College Email Address
                    </label>
                    <input
                      type="email"
                      required
                      value={resetEmail}
                      onChange={(e) => setResetEmail(e.target.value)}
                      placeholder="student@marwadiuniversity.ac.in"
                      className="w-full px-4 py-2.5 bg-slate-50 border border-[#E2E2DC] rounded-xl text-sm font-medium focus:outline-none focus:border-[#00A86B]"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3 bg-[#00A86B] hover:bg-[#008f5a] text-white font-bold text-xs uppercase tracking-wider rounded-xl transition-all cursor-pointer"
                  >
                    Send Reset Link
                  </button>
                </form>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  )
}
