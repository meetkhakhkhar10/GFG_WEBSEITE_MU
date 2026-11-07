import React, { useState, useEffect, useMemo } from "react"
import { 
  Code2, Flame, Trophy, Zap, Terminal, CheckCircle2, Play, 
  RotateCcw, Sparkles, Award, Search, Filter, BookOpen, 
  ChevronRight, ArrowUpRight, Check, Clock, User as UserIcon, LogOut, Lock, Mail, Shield, GraduationCap, Calendar, Timer, Crown, Medal, TrendingUp, Activity
} from "lucide-react"
import { motion, AnimatePresence } from "motion/react"
import { cn } from "@/src/lib/utils"
import { useAuth } from "@/src/contexts/AuthContext"
import { getFirebaseChallenges, getFirebaseUsers } from "@/src/services/firebaseDb"
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip } from "recharts"

const weeklyData = [
  { day: "Mon", solved: 4 },
  { day: "Tue", solved: 6 },
  { day: "Wed", solved: 3 },
  { day: "Thu", solved: 8 },
  { day: "Fri", solved: 5 },
  { day: "Sat", solved: 9 },
  { day: "Sun", solved: 7 },
]

const badgesList = [
  { id: "b1", title: "Streak Master", desc: "Maintained a 30-day solving streak", icon: Flame, unlocked: true, color: "text-orange-600 bg-orange-100" },
  { id: "b2", title: "DP Grandmaster", desc: "Solved 50+ Dynamic Programming problems", icon: Zap, unlocked: true, color: "text-amber-600 bg-amber-100" },
  { id: "b3", title: "Top 1% Coder", desc: "Ranked in the top 1% of Marwadi University Chapter", icon: Crown, unlocked: true, color: "text-amber-700 bg-amber-100" },
  { id: "b4", title: "Graph Wizard", desc: "Mastered BFS, DFS & shortest path algorithms", icon: Trophy, unlocked: false, color: "text-slate-500 bg-slate-100" },
]

export default function StudentDashboard() {
  const { user, logout } = useAuth()
  
  const [challenges, setChallenges] = useState<any[]>([])
  const [allUsers, setAllUsers] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const chalRes = await getFirebaseChallenges()
        setChallenges(chalRes || [])
        const usersRes = await getFirebaseUsers()
        setAllUsers(usersRes || [])
      } catch (err) {
        console.error("Failed to load student dashboard data:", err)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  const todayChallenge = useMemo(() => {
    return challenges.find(c => c.status === "today") || challenges[0]
  }, [challenges])

  const upcomingChallenges = useMemo(() => {
    return challenges.filter(c => c.status === "upcoming")
  }, [challenges])

  // Compute personal rank from actual Firestore users sorted by points
  const personalRank = useMemo(() => {
    if (!user) return "#1"
    const sorted = [...allUsers].sort((a, b) => (b.points || 0) - (a.points || 0))
    const idx = sorted.findIndex(u => u.uid === user.uid || u.email === user.email)
    return idx !== -1 ? `#${idx + 1}` : "#2"
  }, [user, allUsers])

  const currentUserData = useMemo(() => {
    if (!user) return { solved: 249, points: 12450, streak: 14, longestStreak: 45, accuracy: "84.6%" }
    const found = allUsers.find(u => u.uid === user.uid || u.email === user.email)
    return {
      solved: found?.solved || 249,
      points: found?.points || user.points || 12450,
      streak: found?.streak || user.streak || 14,
      longestStreak: 45,
      accuracy: "84.6%"
    }
  }, [user, allUsers])

  return (
    <div className="min-h-screen bg-[#F4F4F0] text-[#111318] transition-colors duration-300 selection:bg-[#00A86B] selection:text-white pt-24 pb-20 select-none">
      
      {/* Background Architectural Grid */}
      <div className="absolute inset-0 pointer-events-none bg-technical-grid opacity-50" />

      <div className="max-w-[1400px] mx-auto px-6 relative z-10 space-y-8">
        
        {/* Top Header & Profile Banner */}
        <div className="p-8 border border-[#E2E2DC] bg-white flex flex-col md:flex-row md:items-center justify-between gap-6 shadow-xs rounded-2xl">
          <div className="flex items-center space-x-5">
            <img 
              src={user?.profilePhoto || "https://api.dicebear.com/7.x/avataaars/svg?seed=student"} 
              alt={user?.name || "Student"} 
              className="w-20 h-20 rounded-full object-cover border-2 border-[#00A86B] shadow-sm"
            />
            <div>
              <div className="text-xs sm:text-sm font-bold uppercase tracking-wider text-[#00A86B]">MARWADI UNIVERSITY STUDENT PORTAL</div>
              <h1 className="font-editorial text-3xl sm:text-4xl font-extrabold mt-1 text-slate-900">
                Welcome back, {user?.name || "Meet Khakhkhar"}!
              </h1>
              <div className="text-xs sm:text-sm font-medium text-slate-600 mt-1 flex flex-wrap items-center gap-3">
                <span>Enrollment: <strong className="text-slate-900 font-mono">{user?.enrollment_no || "MU22BCS108"}</strong></span>
                <span>·</span>
                <span>{user?.department || "Computer Science & Engineering"}</span>
                <span>·</span>
                <span className="text-[#00A86B] font-extrabold text-sm sm:text-base">Rank: {personalRank}</span>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <a
              href="/student/submissions"
              className="px-5 py-3 border border-slate-900 text-slate-900 hover:bg-slate-900 hover:text-white text-xs sm:text-sm uppercase tracking-wider font-bold flex items-center space-x-2 transition-colors rounded-xl"
            >
              <CheckCircle2 className="w-4 h-4 text-[#00A86B]" />
              <span>My Submissions</span>
            </a>
            <a
              href="/coding-arena"
              className="px-6 py-3 bg-[#00A86B] text-white text-xs sm:text-sm uppercase tracking-wider font-bold flex items-center space-x-2 shadow-xs hover:bg-[#008f5a] transition-colors rounded-xl"
            >
              <Terminal className="w-4 h-4" />
              <span>Enter Coding Arena</span>
            </a>
          </div>
        </div>

        {/* 6 Key Metric Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
          {[
            { label: "Questions Solved", value: currentUserData.solved, icon: Code2, color: "text-[#00A86B]" },
            { label: "Total Points", value: `${currentUserData.points} XP`, icon: Zap, color: "text-amber-500" },
            { label: "Current Streak", value: `${currentUserData.streak} Days`, icon: Flame, color: "text-orange-500" },
            { label: "Longest Streak", value: `${currentUserData.longestStreak} Days`, icon: Trophy, color: "text-amber-600" },
            { label: "Accuracy", value: currentUserData.accuracy, icon: TrendingUp, color: "text-emerald-600" },
            { label: "Chapter Rank", value: personalRank, icon: Crown, color: "text-purple-600" }
          ].map((stat, i) => {
            const Icon = stat.icon
            return (
              <div key={i} className="p-5 border border-[#E2E2DC] bg-white transition-all shadow-xs rounded-2xl">
                <div className="flex items-center justify-between text-slate-500 mb-2 text-xs sm:text-sm font-bold uppercase tracking-wider">
                  <span>{stat.label}</span>
                  <Icon className={cn("w-4 h-4", stat.color)} />
                </div>
                <div className="font-editorial text-2xl sm:text-3xl font-extrabold text-slate-900">
                  {stat.value}
                </div>
              </div>
            )
          })}
        </div>

        {/* Main Grid: Today's Active Challenge & Weekly Chart */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Today's Active Challenge */}
          <div className="lg:col-span-7 space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="font-editorial text-2xl sm:text-3xl font-black text-slate-900">Today's Active Challenge</h2>
              <span className="text-xs sm:text-sm font-bold text-[#00A86B] uppercase tracking-wider">Daily POTD</span>
            </div>

            {todayChallenge && (
              <div className="border border-[#E2E2DC] bg-white p-6 sm:p-8 relative overflow-hidden shadow-xs flex flex-col justify-between rounded-2xl">
                <div>
                  <div className="flex items-center justify-between text-xs sm:text-sm mb-4 pb-3 border-b border-[#E2E2DC]">
                    <span className="px-3 py-1 bg-blue-50 text-blue-700 font-bold uppercase rounded-md text-xs border border-blue-200">
                      {todayChallenge.difficulty} · Daily Poll
                    </span>
                    <span className="text-[#00A86B] font-bold text-xs sm:text-sm">{todayChallenge.topic}</span>
                  </div>

                  <h3 className="font-editorial text-2xl sm:text-3xl font-black mb-3 text-slate-900">{todayChallenge.title}</h3>
                  <p className="font-sans text-sm sm:text-base text-slate-700 leading-relaxed mb-6 font-normal">
                    {todayChallenge.description || todayChallenge.problemStatement || "Select the most accurate option and submit your response before the poll closes."}
                  </p>
                </div>

                <div className="pt-6 border-t border-[#E2E2DC] flex items-center justify-between">
                  <div className="text-sm font-extrabold text-amber-600">
                    +{todayChallenge.xp || 50} XP Reward
                  </div>
                  <a
                    href="/coding-arena"
                    className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-xs sm:text-sm uppercase tracking-wider font-bold transition-colors flex items-center space-x-1.5 rounded-xl shadow-xs"
                  >
                    <span>Vote in Daily Poll</span>
                    <ChevronRight className="w-4 h-4" />
                  </a>
                </div>
              </div>
            )}

            {/* Achievement & Badge System */}
            <div className="space-y-4 pt-4">
              <h2 className="font-editorial text-2xl sm:text-3xl font-black text-slate-900">Achievements & Badges</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {badgesList.map(badge => {
                  const BIcon = badge.icon
                  return (
                    <div key={badge.id} className={cn(
                      "p-5 border border-[#E2E2DC] bg-white flex items-center space-x-4 rounded-2xl shadow-xs",
                      !badge.unlocked && "opacity-50 grayscale"
                    )}>
                      <div className={cn("w-14 h-14 rounded-2xl flex items-center justify-center shrink-0", badge.color)}>
                        <BIcon className="w-7 h-7" />
                      </div>
                      <div>
                        <div className="text-base sm:text-lg font-bold flex items-center space-x-2 text-slate-900">
                          <span>{badge.title}</span>
                          {badge.unlocked && <Check className="w-4 h-4 text-[#00A86B]" />}
                        </div>
                        <p className="font-sans text-xs sm:text-sm text-slate-600 mt-1">{badge.desc}</p>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          </div>

          {/* Right Column: Weekly Activity Chart & Upcoming Challenges */}
          <div className="lg:col-span-5 space-y-8">
            
            {/* Weekly Activity Chart */}
            <div className="p-6 border border-[#E2E2DC] bg-white shadow-xs rounded-2xl">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-editorial text-xl sm:text-2xl font-bold text-slate-900">Weekly Activity</h3>
                <span className="text-xs sm:text-sm font-bold text-[#00A86B]">33 Solved This Week</span>
              </div>
              <div className="h-48 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={weeklyData}>
                    <defs>
                      <linearGradient id="colorSolved" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#00A86B" stopOpacity={0.4}/>
                        <stop offset="95%" stopColor="#00A86B" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <XAxis dataKey="day" stroke="#64748B" fontSize={12} tickLine={false} />
                    <YAxis stroke="#64748B" fontSize={12} tickLine={false} />
                    <Tooltip contentStyle={{ background: "#0F172A", border: "none", borderRadius: "12px", fontSize: "13px", color: "#fff" }} />
                    <Area type="monotone" dataKey="solved" stroke="#00A86B" strokeWidth={2.5} fillOpacity={1} fill="url(#colorSolved)" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* GitHub-style Contribution Calendar */}
            <div className="p-6 border border-[#E2E2DC] bg-white shadow-xs rounded-2xl">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-editorial text-xl sm:text-2xl font-bold text-slate-900">Solving Contribution Map</h3>
                <span className="text-xs sm:text-sm font-semibold text-slate-500">Last 28 Days</span>
              </div>
              <div className="grid grid-cols-7 gap-2">
                {Array.from({ length: 28 }).map((_, i) => {
                  const intensity = (i % 5 === 0) ? 3 : (i % 3 === 0) ? 2 : (i % 2 === 0) ? 1 : 0
                  return (
                    <div 
                      key={i} 
                      className={cn(
                        "h-9 rounded-md flex items-center justify-center font-mono text-xs",
                        intensity === 3 ? "bg-[#00A86B] text-white font-bold" :
                        intensity === 2 ? "bg-[#00A86B]/70 text-white font-medium" :
                        intensity === 1 ? "bg-[#00A86B]/30 text-slate-900 font-medium" :
                        "bg-slate-100 text-slate-600"
                      )}
                      title={`Day ${i+1}: ${intensity * 3} problems solved`}
                    >
                      {i+1}
                    </div>
                  )
                })}
              </div>
            </div>

            {/* Upcoming Challenges */}
            <div className="p-6 border border-[#E2E2DC] bg-white shadow-xs space-y-4 rounded-2xl">
              <h3 className="font-editorial text-xl sm:text-2xl font-bold text-slate-900">Upcoming Scheduled Challenges</h3>
              <div className="space-y-3">
                {upcomingChallenges.slice(0, 2).map((uc) => (
                  <div key={uc.id} className="p-4 bg-slate-50 border border-[#E2E2DC] text-xs sm:text-sm flex items-center justify-between rounded-xl">
                    <div>
                      <div className="font-bold text-sm sm:text-base text-slate-900 mb-1">{uc.title}</div>
                      <div className="text-xs sm:text-sm font-medium text-slate-600">Published: <span className="font-mono">{uc.publishedTimestamp}</span></div>
                    </div>
                    <span className="px-3 py-1 rounded bg-[#00A86B]/10 text-[#00A86B] text-xs sm:text-sm font-bold border border-[#00A86B]/20">
                      {uc.difficulty}
                    </span>
                  </div>
                ))}
              </div>
            </div>

          </div>

        </div>

      </div>

    </div>
  )
}
