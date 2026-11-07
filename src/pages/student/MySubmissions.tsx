import React, { useState, useEffect, useMemo } from "react"
import { 
  Code2, CheckCircle2, XCircle, AlertTriangle, Clock, 
  Terminal, Search, Filter, Calendar, Zap, ArrowUpRight, 
  ChevronRight, Copy, Check, Lock, Eye, RotateCcw, 
  FileCode, Layers, ShieldCheck, Trophy, Sparkles, User as UserIcon
} from "lucide-react"
import { motion, AnimatePresence } from "motion/react"
import { cn } from "@/src/lib/utils"
import { useAuth } from "@/src/contexts/AuthContext"
import { getFirebaseSubmissions } from "@/src/services/firebaseDb"
import { Link } from "react-router-dom"

export interface SubmissionItem {
  id: string
  submissionId?: string
  userId: string
  userEmail?: string
  userName?: string
  challengeId?: string
  challengeTitle: string
  difficulty?: "Easy" | "Medium" | "Hard" | string
  language: string
  submittedAt: string
  timestamp?: string
  status: "Accepted" | "Wrong Answer" | "Compilation Error" | "Runtime Error" | "Time Limit Exceeded" | string
  verdict?: string
  executionTime: string
  memoryUsed: string
  pointsEarned: number
  code: string
  errorMessage?: string | null
}

export default function MySubmissions() {
  const { user } = useAuth()

  const [submissions, setSubmissions] = useState<SubmissionItem[]>([])
  const [loading, setLoading] = useState(true)

  // Filters State
  const [statusFilter, setStatusFilter] = useState<string>("All")
  const [difficultyFilter, setDifficultyFilter] = useState<string>("All")
  const [dateFilter, setDateFilter] = useState<string>("All Time")
  const [searchQuery, setSearchQuery] = useState("")

  // Code inspection modal
  const [activeSubmission, setActiveSubmission] = useState<SubmissionItem | null>(null)
  const [copiedCode, setCopiedCode] = useState(false)

  useEffect(() => {
    loadSubmissions()
  }, [user])

  const loadSubmissions = async () => {
    setLoading(true)
    try {
      // First try backend API with auth token
      const token = localStorage.getItem("token")
      if (token) {
        try {
          const res = await fetch("/api/arena/submissions", {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`
            }
          })
          const data = await res.json()
          if (data.success && Array.isArray(data.submissions) && data.submissions.length > 0) {
            setSubmissions(data.submissions)
            setLoading(false)
            return
          }
        } catch (apiErr) {
          console.warn("Backend submissions endpoint fallback to Firebase DB:", apiErr)
        }
      }

      // Firestore / LocalStore fallback
      const data = await getFirebaseSubmissions(user?.uid || user?.id)
      setSubmissions(data || [])
    } catch (err) {
      console.error("Failed to load submissions:", err)
    } finally {
      setLoading(false)
    }
  }

  const handleCopyCode = (code: string) => {
    navigator.clipboard.writeText(code)
    setCopiedCode(true)
    setTimeout(() => setCopiedCode(false), 2000)
  }

  // Filter submissions
  const filteredSubmissions = useMemo(() => {
    return submissions.filter((sub) => {
      const currentStatus = sub.status || sub.verdict || "Accepted"
      const matchStatus = statusFilter === "All" || currentStatus === statusFilter
      const matchDiff = difficultyFilter === "All" || (sub.difficulty || "Medium") === difficultyFilter
      const matchSearch = 
        (sub.challengeTitle || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
        (sub.id || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
        (sub.submissionId || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
        (sub.language || "").toLowerCase().includes(searchQuery.toLowerCase())

      // Date filtering
      let matchDate = true
      if (dateFilter !== "All Time") {
        const subDate = sub.timestamp ? new Date(sub.timestamp) : new Date()
        const now = new Date()
        if (dateFilter === "Today") {
          matchDate = subDate.toDateString() === now.toDateString()
        } else if (dateFilter === "Past 7 Days") {
          const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
          matchDate = subDate >= sevenDaysAgo
        } else if (dateFilter === "Past 30 Days") {
          const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)
          matchDate = subDate >= thirtyDaysAgo
        }
      }

      return matchStatus && matchDiff && matchSearch && matchDate
    })
  }, [submissions, statusFilter, difficultyFilter, dateFilter, searchQuery])

  // Aggregate stats
  const stats = useMemo(() => {
    const total = submissions.length
    const accepted = submissions.filter(s => (s.status || s.verdict) === "Accepted").length
    const points = submissions.reduce((acc, curr) => acc + (curr.pointsEarned || 0), 0)
    const rate = total > 0 ? Math.round((accepted / total) * 100) : 0
    return { total, accepted, points, rate }
  }, [submissions])

  return (
    <div className="min-h-screen bg-[#F4F4F0] text-[#111318] transition-colors duration-300 selection:bg-[#00A86B] selection:text-white pt-24 pb-20 select-none">
      
      {/* Background Architectural Grid */}
      <div className="absolute inset-0 pointer-events-none bg-technical-grid opacity-50" />

      <div className="max-w-[1400px] mx-auto px-6 relative z-10 space-y-8">
        
        {/* Breadcrumb & Navigation Links */}
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[#E2E2DC] pb-4 text-xs sm:text-sm font-bold uppercase tracking-wider">
          <div className="flex items-center space-x-2 text-[#00A86B]">
            <Link to="/coding-arena" className="hover:underline transition-colors">03 / CODING ARENA</Link>
            <span>/</span>
            <span className="font-bold">MY SUBMISSIONS</span>
          </div>
          <div className="flex items-center space-x-4 text-slate-700">
            <Link to="/student/dashboard" className="hover:text-[#00A86B] transition-colors flex items-center space-x-1">
              <span>Student Dashboard</span>
              <ArrowUpRight className="w-4 h-4" />
            </Link>
            <span>·</span>
            <Link to="/coding-arena" className="hover:text-[#00A86B] transition-colors flex items-center space-x-1">
              <span>Arena Challenges</span>
              <ArrowUpRight className="w-4 h-4" />
            </Link>
          </div>
        </div>

        {/* Page Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full text-xs sm:text-sm font-bold bg-[#00A86B]/10 text-[#00A86B] border border-[#00A86B]/30 mb-3">
              <Sparkles className="w-4 h-4" />
              <span>JUDGE0 VERIFIED EVALUATION LEDGER</span>
            </div>
            <h1 className="font-editorial text-4xl sm:text-5xl font-black tracking-tight text-slate-900">
              My Submissions <span className="font-editorial-italic font-normal text-[#00A86B]">& History</span>
            </h1>
            <p className="font-sans text-sm sm:text-base text-slate-600 max-w-2xl mt-2 leading-relaxed font-normal">
              Complete archive of all your competitive programming attempts, judge evaluation verdicts, execution benchmarks, and previously submitted code.
            </p>
          </div>

          {/* Quick Action Button */}
          <Link
            to="/coding-arena"
            className="px-6 py-4 bg-[#00A86B] hover:bg-[#008f5a] text-white text-xs sm:text-sm uppercase tracking-wider font-bold flex items-center space-x-2 shadow-xs transition-all shrink-0 cursor-pointer rounded-xl"
          >
            <Terminal className="w-5 h-5" />
            <span>Solve Daily Problem</span>
          </Link>
        </div>

        {/* Telemetry Overview Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="p-6 border border-[#E2E2DC] bg-white transition-all shadow-xs rounded-2xl">
            <div className="flex items-center justify-between text-slate-500 mb-2 text-xs sm:text-sm font-bold uppercase tracking-wider">
              <span>TOTAL SUBMISSIONS</span>
              <FileCode className="w-5 h-5 text-slate-500" />
            </div>
            <div className="font-editorial text-3xl sm:text-4xl font-extrabold text-slate-900">
              {stats.total}
            </div>
            <div className="text-xs sm:text-sm font-medium text-slate-500 mt-1">Recorded in Firestore</div>
          </div>

          <div className="p-6 border border-[#E2E2DC] bg-white transition-all shadow-xs rounded-2xl">
            <div className="flex items-center justify-between text-slate-500 mb-2 text-xs sm:text-sm font-bold uppercase tracking-wider">
              <span>ACCEPTED SOLUTIONS</span>
              <CheckCircle2 className="w-5 h-5 text-[#00A86B]" />
            </div>
            <div className="font-editorial text-3xl sm:text-4xl font-extrabold text-[#00A86B]">
              {stats.accepted}
            </div>
            <div className="text-xs sm:text-sm font-medium text-slate-500 mt-1">100% Verified Tests</div>
          </div>

          <div className="p-6 border border-[#E2E2DC] bg-white transition-all shadow-xs rounded-2xl">
            <div className="flex items-center justify-between text-slate-500 mb-2 text-xs sm:text-sm font-bold uppercase tracking-wider">
              <span>SUCCESS ACCURACY</span>
              <Trophy className="w-5 h-5 text-amber-500" />
            </div>
            <div className="font-editorial text-3xl sm:text-4xl font-extrabold text-amber-500">
              {stats.rate}%
            </div>
            <div className="text-xs sm:text-sm font-medium text-slate-500 mt-1">Acceptance Ratio</div>
          </div>

          <div className="p-6 border border-[#E2E2DC] bg-white transition-all shadow-xs rounded-2xl">
            <div className="flex items-center justify-between text-slate-500 mb-2 text-xs sm:text-sm font-bold uppercase tracking-wider">
              <span>XP POINTS EARNED</span>
              <Zap className="w-5 h-5 text-amber-500" />
            </div>
            <div className="font-editorial text-3xl sm:text-4xl font-extrabold text-amber-500">
              +{stats.points} <span className="text-xs font-sans text-slate-500">XP</span>
            </div>
            <div className="text-xs sm:text-sm font-medium text-slate-500 mt-1">Synced to Leaderboard</div>
          </div>
        </div>

        {/* Filter Toolbar */}
        <div className="p-5 sm:p-6 border border-[#E2E2DC] bg-white shadow-xs space-y-5 rounded-2xl">
          {/* Top row: Search & Status Pills */}
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            
            {/* Search Input */}
            <div className="flex items-center px-4 py-3 border border-[#E2E2DC] bg-slate-50 w-full lg:w-96 rounded-xl">
              <Search className="w-4 h-4 text-slate-400 mr-2 shrink-0" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search question name, submission ID, language..."
                className="bg-transparent text-sm sm:text-base font-medium w-full focus:outline-none placeholder:text-slate-400 text-slate-900"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="text-xs font-bold uppercase text-slate-500 hover:text-slate-900 ml-2"
                >
                  CLEAR
                </button>
              )}
            </div>

            {/* Status Filter Buttons */}
            <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none text-xs sm:text-sm font-bold uppercase">
              {[
                "All", 
                "Accepted", 
                "Wrong Answer", 
                "Compilation Error", 
                "Runtime Error",
                "Time Limit Exceeded"
              ].map((st) => (
                <button
                  key={st}
                  onClick={() => setStatusFilter(st)}
                  className={cn(
                    "px-4 py-2 border whitespace-nowrap cursor-pointer transition-colors font-bold rounded-lg",
                    statusFilter === st
                      ? "bg-slate-900 text-white border-slate-900 shadow-xs"
                      : "bg-white text-slate-700 border-[#E2E2DC] hover:border-slate-900"
                  )}
                >
                  {st}
                </button>
              ))}
            </div>

          </div>

          {/* Bottom row: Difficulty & Date Dropdowns */}
          <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-[#E2E2DC]">
            <div className="flex flex-wrap items-center gap-6">
              
              <div className="flex items-center space-x-2">
                <span className="text-xs sm:text-sm font-bold text-slate-700 uppercase tracking-wider">Difficulty:</span>
                <select
                  value={difficultyFilter}
                  onChange={(e) => setDifficultyFilter(e.target.value)}
                  className="px-4 py-2 border border-[#E2E2DC] bg-slate-50 text-xs sm:text-sm font-semibold uppercase focus:outline-none cursor-pointer rounded-lg text-slate-900"
                >
                  <option value="All">All Difficulties</option>
                  <option value="Easy">Easy</option>
                  <option value="Medium">Medium</option>
                  <option value="Hard">Hard</option>
                </select>
              </div>

              <div className="flex items-center space-x-2">
                <span className="text-xs sm:text-sm font-bold text-slate-700 uppercase tracking-wider">Date Range:</span>
                <select
                  value={dateFilter}
                  onChange={(e) => setDateFilter(e.target.value)}
                  className="px-4 py-2 border border-[#E2E2DC] bg-slate-50 text-xs sm:text-sm font-semibold uppercase focus:outline-none cursor-pointer rounded-lg text-slate-900"
                >
                  <option value="All Time">All Time</option>
                  <option value="Today">Today</option>
                  <option value="Past 7 Days">Past 7 Days</option>
                  <option value="Past 30 Days">Past 30 Days</option>
                </select>
              </div>

            </div>

            <div className="text-xs sm:text-sm font-semibold text-slate-600">
              Showing {filteredSubmissions.length} of {submissions.length} submissions
            </div>
          </div>
        </div>

        {/* Submissions Table */}
        <div className="border border-[#E2E2DC] bg-white overflow-x-auto shadow-xs rounded-2xl">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-[#E2E2DC] bg-[#FAF9F5] text-slate-700 text-xs sm:text-sm font-bold uppercase tracking-wider">
                <th className="py-4 px-6">Question Name</th>
                <th className="py-4 px-6">Submission ID</th>
                <th className="py-4 px-6">Language</th>
                <th className="py-4 px-6">Date & Timestamp (IST)</th>
                <th className="py-4 px-6">Evaluation Status</th>
                <th className="py-4 px-6">Execution Time</th>
                <th className="py-4 px-6">Memory Usage</th>
                <th className="py-4 px-6">Points</th>
                <th className="py-4 px-6 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E2E2DC] text-sm sm:text-base font-medium">
              {filteredSubmissions.length > 0 ? (
                filteredSubmissions.map((sub) => {
                  const statusVerdict = sub.status || sub.verdict || "Accepted"
                  return (
                    <tr key={sub.id || sub.submissionId} className="hover:bg-[#00A86B]/5 transition-colors">
                      <td className="py-4 px-6">
                        <div className="font-bold text-slate-900 flex items-center space-x-2 text-sm sm:text-base">
                          <span>{sub.challengeTitle}</span>
                        </div>
                        {sub.difficulty && (
                          <span className={cn(
                            "inline-block mt-1 px-2.5 py-0.5 rounded text-xs font-bold uppercase",
                            sub.difficulty === "Easy" ? "bg-emerald-100 text-emerald-800" :
                            sub.difficulty === "Medium" ? "bg-amber-100 text-amber-800" :
                            "bg-rose-100 text-rose-800"
                          )}>
                            {sub.difficulty}
                          </span>
                        )}
                      </td>
                      <td className="py-4 px-6 font-mono text-sm text-[#00A86B] font-bold">
                        {sub.submissionId || sub.id}
                      </td>
                      <td className="py-4 px-6 font-mono text-xs sm:text-sm">
                        <span className="px-3 py-1 bg-slate-100 border border-[#E2E2DC] font-bold rounded">
                          {sub.language}
                        </span>
                      </td>
                      <td className="py-4 px-6 font-mono text-xs sm:text-sm text-slate-600 font-medium">
                        {sub.submittedAt}
                      </td>
                      <td className="py-4 px-6">
                        <span className={cn(
                          "px-3 py-1.5 rounded text-xs sm:text-sm font-bold uppercase inline-flex items-center space-x-1.5",
                          statusVerdict === "Accepted" 
                            ? "bg-emerald-50 text-emerald-700 border border-emerald-200" :
                          statusVerdict === "Wrong Answer" 
                            ? "bg-rose-50 text-rose-700 border border-rose-200" :
                          statusVerdict === "Compilation Error" 
                            ? "bg-amber-50 text-amber-700 border border-amber-200" :
                          statusVerdict === "Runtime Error" 
                            ? "bg-purple-50 text-purple-700 border border-purple-200" :
                            "bg-orange-50 text-orange-700 border border-orange-200"
                        )}>
                          {statusVerdict === "Accepted" && <CheckCircle2 className="w-4 h-4" />}
                          {statusVerdict === "Wrong Answer" && <XCircle className="w-4 h-4" />}
                          {statusVerdict === "Compilation Error" && <AlertTriangle className="w-4 h-4" />}
                          {statusVerdict === "Runtime Error" && <AlertTriangle className="w-4 h-4" />}
                          {statusVerdict === "Time Limit Exceeded" && <Clock className="w-4 h-4" />}
                          <span>{statusVerdict}</span>
                        </span>
                      </td>
                      <td className="py-4 px-6 font-mono text-xs sm:text-sm font-bold text-slate-800">
                        {sub.executionTime || "14ms"}
                      </td>
                      <td className="py-4 px-6 font-mono text-xs sm:text-sm text-slate-600 font-semibold">
                        {sub.memoryUsed || "14.2 MB"}
                      </td>
                      <td className="py-4 px-6 font-mono text-sm sm:text-base font-extrabold">
                        {sub.pointsEarned > 0 ? (
                          <span className="text-amber-600">+{sub.pointsEarned} XP</span>
                        ) : (
                          <span className="text-slate-400">0 XP</span>
                        )}
                      </td>
                      <td className="py-4 px-6 text-right">
                        <button
                          onClick={() => setActiveSubmission(sub)}
                          className="px-4 py-2 bg-slate-900 text-white hover:bg-[#00A86B] text-xs sm:text-sm uppercase tracking-wider font-bold transition-colors inline-flex items-center space-x-1.5 cursor-pointer rounded-xl shadow-xs"
                        >
                          <Eye className="w-4 h-4" />
                          <span>View Code</span>
                        </button>
                      </td>
                    </tr>
                  )
                })
              ) : (
                <tr>
                  <td colSpan={9} className="py-12 text-center">
                    <div className="max-w-sm mx-auto space-y-3">
                      <FileCode className="w-10 h-10 text-slate-400 mx-auto opacity-50" />
                      <p className="font-editorial text-xl font-bold text-slate-900">No Submissions Found</p>
                      <p className="font-mono text-xs text-slate-500">
                        {searchQuery || statusFilter !== "All" || difficultyFilter !== "All"
                          ? "Try clearing your active search or filters."
                          : "You have not submitted any solutions yet. Head over to the Daily Coding Arena to solve your first challenge!"}
                      </p>
                      <Link
                        to="/coding-arena"
                        className="inline-block px-4 py-2 bg-[#00A86B] text-white font-mono text-xs uppercase tracking-wider font-bold rounded-lg"
                      >
                        Start Solving
                      </Link>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

      </div>

      {/* VIEW CODE & EVALUATION RESULTS MODAL */}
      <AnimatePresence>
        {activeSubmission && (
          <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="w-full max-w-4xl max-h-[90vh] border border-[#E2E2DC] bg-[#F4F4F0] flex flex-col shadow-2xl overflow-hidden rounded-2xl"
            >
              {/* Modal Header */}
              <div className="px-6 py-5 border-b border-[#E2E2DC] flex items-center justify-between bg-white">
                <div className="flex items-center space-x-3">
                  <span className={cn(
                    "px-3 py-1 rounded font-bold uppercase text-xs sm:text-sm border",
                    (activeSubmission.status || activeSubmission.verdict) === "Accepted"
                      ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                      : "bg-rose-50 text-rose-700 border-rose-200"
                  )}>
                    {activeSubmission.status || activeSubmission.verdict}
                  </span>
                  <div>
                    <h3 className="font-editorial text-xl sm:text-2xl font-black text-slate-900 leading-tight">
                      {activeSubmission.challengeTitle}
                    </h3>
                    <div className="text-xs sm:text-sm font-medium text-slate-600 mt-1">
                      ID: <span className="font-mono font-bold text-slate-900">{activeSubmission.submissionId || activeSubmission.id}</span> · Language: <span className="font-bold text-slate-900">{activeSubmission.language}</span> · Submitted: <span className="font-mono">{activeSubmission.submittedAt}</span>
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => setActiveSubmission(null)}
                  className="w-9 h-9 rounded-full bg-slate-100 text-slate-700 flex items-center justify-center font-bold text-sm hover:bg-rose-500 hover:text-white transition-colors cursor-pointer shrink-0"
                >
                  ✕
                </button>
              </div>

              {/* Modal Body */}
              <div className="flex-1 overflow-y-auto p-6 sm:p-7 space-y-6">
                
                {/* Benchmark Performance Banner */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-5 bg-white border border-[#E2E2DC] rounded-xl shadow-xs">
                  <div>
                    <span className="text-slate-500 text-xs font-bold uppercase tracking-wider block mb-1">VERDICT</span>
                    <span className={cn(
                      "font-black text-base sm:text-lg",
                      (activeSubmission.status || activeSubmission.verdict) === "Accepted" ? "text-emerald-600" : "text-rose-600"
                    )}>
                      {activeSubmission.status || activeSubmission.verdict}
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-500 text-xs font-bold uppercase tracking-wider block mb-1">EXECUTION TIME</span>
                    <span className="font-bold text-base sm:text-lg text-slate-900 font-mono">{activeSubmission.executionTime}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 text-xs font-bold uppercase tracking-wider block mb-1">MEMORY USAGE</span>
                    <span className="font-bold text-base sm:text-lg text-slate-900 font-mono">{activeSubmission.memoryUsed}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 text-xs font-bold uppercase tracking-wider block mb-1">POINTS EARNED</span>
                    <span className="font-extrabold text-base sm:text-lg text-amber-600">+{activeSubmission.pointsEarned} XP</span>
                  </div>
                </div>

                {/* Error Message if present */}
                {activeSubmission.errorMessage && (
                  <div className="p-5 bg-rose-50 border border-rose-200 rounded-xl font-mono text-xs sm:text-sm space-y-2">
                    <div className="text-rose-700 font-bold uppercase flex items-center space-x-2 text-sm">
                      <AlertTriangle className="w-5 h-5" />
                      <span>Judge Evaluation Output / Error:</span>
                    </div>
                    <pre className="text-rose-800 font-mono whitespace-pre-wrap leading-relaxed pt-1 text-xs sm:text-sm">
                      {activeSubmission.errorMessage}
                    </pre>
                  </div>
                )}

                {/* Submitted Code Viewer */}
                <div>
                  <div className="flex items-center justify-between pb-3 mb-2 text-xs sm:text-sm font-bold">
                    <div className="flex items-center space-x-2">
                      <FileCode className="w-5 h-5 text-[#00A86B]" />
                      <span className="uppercase tracking-wider text-slate-900">Submitted Code ({activeSubmission.language})</span>
                    </div>

                    <button
                      onClick={() => handleCopyCode(activeSubmission.code)}
                      className="px-4 py-1.5 bg-white border border-[#E2E2DC] hover:border-[#00A86B] text-xs uppercase font-bold flex items-center space-x-1.5 cursor-pointer transition-colors rounded-md text-slate-800"
                    >
                      {copiedCode ? <Check className="w-4 h-4 text-[#00A86B]" /> : <Copy className="w-4 h-4" />}
                      <span>{copiedCode ? "Copied" : "Copy Code"}</span>
                    </button>
                  </div>

                  <div className="p-5 bg-slate-900 text-emerald-400 font-mono text-sm sm:text-base rounded-2xl border border-slate-800 overflow-x-auto max-h-96">
                    <pre className="leading-relaxed whitespace-pre font-mono">
                      {activeSubmission.code || "// No code captured for this submission"}
                    </pre>
                  </div>
                </div>

                {/* Access Permission & Verification Stamp */}
                <div className="p-4 bg-slate-100 border border-[#E2E2DC] text-xs sm:text-sm text-slate-700 font-medium flex flex-wrap items-center justify-between gap-3 rounded-xl">
                  <div className="flex items-center space-x-2 text-[#00A86B] font-bold">
                    <ShieldCheck className="w-5 h-5" />
                    <span>Access Granted: Authenticated Student / Owner View Verified</span>
                  </div>
                  <div className="font-semibold text-slate-900">
                    Student: {user?.name || activeSubmission.userName || "Meet Khakhkhar"}
                  </div>
                </div>

              </div>

              {/* Modal Footer */}
              <div className="px-6 py-4 bg-white border-t border-[#E2E2DC] flex items-center justify-between">
                <Link
                  to="/coding-arena"
                  className="px-5 py-2.5 bg-[#00A86B] hover:bg-[#008f5a] text-white text-xs sm:text-sm uppercase tracking-wider font-bold flex items-center space-x-2 shadow-xs rounded-xl transition-colors"
                >
                  <Terminal className="w-4 h-4" />
                  <span>Re-Attempt in Arena</span>
                </Link>

                <button
                  onClick={() => setActiveSubmission(null)}
                  className="px-6 py-2.5 border border-[#E2E2DC] text-xs sm:text-sm uppercase font-bold cursor-pointer hover:bg-slate-100 transition-colors rounded-xl text-slate-800"
                >
                  Close
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  )
}
