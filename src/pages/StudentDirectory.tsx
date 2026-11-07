import React, { useState, useEffect, useMemo } from "react"
import { 
  Users, Search, Filter, GraduationCap, Award, Flame, Trophy, 
  Code2, Eye, Shield, CheckCircle2, ArrowUpDown, ChevronRight, Lock, Calendar
} from "lucide-react"
import { motion, AnimatePresence } from "motion/react"
import { cn } from "@/src/lib/utils"
import { useAuth } from "@/src/contexts/AuthContext"
import { getFirebaseUsers, getFirebaseSubmissions } from "@/src/services/firebaseDb"

export interface StudentProfile {
  id: string
  uid: string
  name: string
  email: string
  department: string
  semester: string
  enrollment_no?: string
  enrollmentNumber?: string
  profilePhoto?: string
  solved?: number
  points?: number
  streak?: number
  createdAt?: string
  role?: string
}

export default function StudentDirectory() {
  const { user } = useAuth()
  
  const [students, setStudents] = useState<StudentProfile[]>([])
  const [submissions, setSubmissions] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  // Filters & Sorting state
  const [searchQuery, setSearchQuery] = useState("")
  const [deptFilter, setDeptFilter] = useState("All")
  const [semesterFilter, setSemesterFilter] = useState("All")
  const [sortBy, setSortBy] = useState<"points" | "solved" | "streak" | "name">("points")

  // Selected Student Profile Modal
  const [selectedStudent, setSelectedStudent] = useState<StudentProfile | null>(null)

  // Is current user authorized as Admin / Super Admin
  const isAdmin = user?.role === "admin" || user?.role === "super_admin"

  useEffect(() => {
    loadStudentData()
  }, [])

  const loadStudentData = async () => {
    setLoading(true)
    try {
      const usersData = await getFirebaseUsers()
      const subsData = await getFirebaseSubmissions()
      setSubmissions(subsData || [])

      if (usersData && usersData.length > 0) {
        // Filter strictly for genuine registered student accounts
        const genuineStudents = usersData.filter((u: any) => u.role === "student" || u.role === "sub_admin" || u.enrollmentNumber || u.enrollment_no)
        
        // Calculate solved count & points from actual submissions if available
        const processed: StudentProfile[] = genuineStudents.map((u: any) => {
          const userSubs = (subsData || []).filter((s: any) => s.userId === u.uid || s.userEmail === u.email)
          const acceptedSubs = userSubs.filter((s: any) => s.status === "Accepted" || s.isCorrect === true)
          const solvedCount = u.solved !== undefined ? u.solved : acceptedSubs.length
          const pointsEarned = u.points !== undefined ? u.points : userSubs.reduce((acc: number, curr: any) => acc + (curr.pointsEarned || 0), 0)

          return {
            id: u.id || u.uid,
            uid: u.uid || u.id,
            name: u.name || "Student",
            email: u.email || "",
            department: u.department || "Computer Science & Engineering",
            semester: u.semester || "6th Semester",
            enrollment_no: u.enrollmentNumber || u.enrollment_no || "MU22BCS000",
            profilePhoto: u.profilePhoto || u.profile_photo || `https://api.dicebear.com/7.x/avataaars/svg?seed=${u.email || u.id}`,
            solved: solvedCount,
            points: pointsEarned,
            streak: u.streak || 0,
            createdAt: u.createdAt || new Date().toISOString(),
            role: u.role || "student"
          }
        })

        setStudents(processed)
      } else {
        setStudents([])
      }
    } catch (err) {
      console.error("Failed to load student directory:", err)
      setStudents([])
    } finally {
      setLoading(false)
    }
  }

  // Filtered & Sorted Student Directory
  const filteredStudents = useMemo(() => {
    let list = [...students]

    // Search by student name or email
    if (searchQuery) {
      const q = searchQuery.toLowerCase()
      list = list.filter(s => 
        s.name.toLowerCase().includes(q) || 
        s.email.toLowerCase().includes(q) ||
        (isAdmin && (s.enrollment_no || "").toLowerCase().includes(q))
      )
    }

    // Department Filter
    if (deptFilter !== "All") {
      list = list.filter(s => s.department.toLowerCase().includes(deptFilter.toLowerCase()))
    }

    // Semester Filter
    if (semesterFilter !== "All") {
      list = list.filter(s => s.semester.toLowerCase() === semesterFilter.toLowerCase())
    }

    // Sorting
    list.sort((a, b) => {
      if (sortBy === "points") return (b.points || 0) - (a.points || 0)
      if (sortBy === "solved") return (b.solved || 0) - (a.solved || 0)
      if (sortBy === "streak") return (b.streak || 0) - (a.streak || 0)
      return a.name.localeCompare(b.name)
    })

    return list
  }, [students, searchQuery, deptFilter, semesterFilter, sortBy, isAdmin])

  const departments = [
    "All",
    "Computer Science & Engineering",
    "Information Technology",
    "Artificial Intelligence & ML",
    "BCA & Computer Applications",
    "Electrical Engineering",
    "Mechanical Engineering"
  ]

  const semesters = [
    "All",
    "1st Semester",
    "2nd Semester",
    "3rd Semester",
    "4th Semester",
    "5th Semester",
    "6th Semester",
    "7th Semester",
    "8th Semester"
  ]

  return (
    <div className="min-h-screen bg-[#F4F4F0] text-[#111318] transition-colors duration-300 selection:bg-[#00A86B] selection:text-white pt-24 pb-20 select-none">
      
      {/* Background Architectural Grid */}
      <div className="absolute inset-0 pointer-events-none bg-technical-grid opacity-50" />

      <div className="max-w-[1400px] mx-auto px-6 relative z-10 space-y-8">
        
        {/* Top Header Banner */}
        <div className="p-8 border border-[#E2E2DC] bg-white flex flex-col md:flex-row md:items-center justify-between gap-6 shadow-xs rounded-2xl">
          <div>
            <div className="text-xs sm:text-sm font-bold uppercase tracking-wider text-[#00A86B] flex items-center space-x-2">
              <GraduationCap className="w-4 h-4" />
              <span>MARWADI UNIVERSITY STUDENT REGISTRY</span>
            </div>
            <h1 className="font-editorial text-3xl sm:text-5xl font-black mt-1 text-slate-900">
              Student Directory
            </h1>
            <p className="text-xs sm:text-sm font-medium text-slate-600 mt-1 max-w-2xl">
              Directory of verified registered student members in GeeksforGeeks Student Chapter. All metrics and solve statistics are fetched directly from authenticated Firebase records.
            </p>
          </div>

          <div className="flex items-center space-x-4 shrink-0">
            <div className="text-right">
              <div className="text-xs font-bold uppercase tracking-wider text-slate-500">TOTAL REGISTERED</div>
              <div className="font-mono text-3xl font-black text-[#00A86B]">{students.length}</div>
            </div>
          </div>
        </div>

        {/* Filters, Search & Sorting Bar */}
        <div className="p-6 border border-[#E2E2DC] bg-white shadow-xs space-y-4 rounded-2xl">
          <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4">
            
            {/* Search Input */}
            <div className="flex items-center space-x-3 px-4 py-2.5 border border-[#E2E2DC] bg-slate-50 rounded-xl flex-1">
              <Search className="w-4 h-4 text-slate-400 shrink-0" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search student name, email, or enrollment..."
                className="w-full bg-transparent text-xs sm:text-sm font-medium focus:outline-none placeholder:text-slate-400 text-slate-900"
              />
            </div>

            {/* Department Filter */}
            <div className="flex items-center space-x-2">
              <span className="text-xs font-bold uppercase text-slate-500 shrink-0">Dept:</span>
              <select
                value={deptFilter}
                onChange={(e) => setDeptFilter(e.target.value)}
                className="px-3.5 py-2.5 border border-[#E2E2DC] bg-slate-50 text-xs font-bold uppercase rounded-xl cursor-pointer text-slate-900 max-w-[200px] truncate"
              >
                {departments.map((d, i) => (
                  <option key={i} value={d}>{d}</option>
                ))}
              </select>
            </div>

            {/* Semester Filter */}
            <div className="flex items-center space-x-2">
              <span className="text-xs font-bold uppercase text-slate-500 shrink-0">Semester:</span>
              <select
                value={semesterFilter}
                onChange={(e) => setSemesterFilter(e.target.value)}
                className="px-3.5 py-2.5 border border-[#E2E2DC] bg-slate-50 text-xs font-bold uppercase rounded-xl cursor-pointer text-slate-900"
              >
                {semesters.map((s, i) => (
                  <option key={i} value={s}>{s}</option>
                ))}
              </select>
            </div>

            {/* Sort Selector */}
            <div className="flex items-center space-x-2">
              <span className="text-xs font-bold uppercase text-slate-500 shrink-0">Sort By:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="px-3.5 py-2.5 border border-[#E2E2DC] bg-slate-50 text-xs font-bold uppercase rounded-xl cursor-pointer text-slate-900"
              >
                <option value="points">Total Points (XP)</option>
                <option value="solved">Questions Solved</option>
                <option value="streak">Active Streak</option>
                <option value="name">Name (A-Z)</option>
              </select>
            </div>

          </div>

          <div className="text-xs font-semibold text-slate-500 pt-2 border-t border-[#E2E2DC] flex items-center justify-between">
            <span>Displaying <strong className="text-slate-900">{filteredStudents.length}</strong> of {students.length} registered students</span>
            {!isAdmin && (
              <span className="text-slate-400 text-[11px] flex items-center space-x-1">
                <Lock className="w-3 h-3 text-slate-400 inline" />
                <span>Student enrollment numbers are restricted to authorized chapter admins.</span>
              </span>
            )}
          </div>
        </div>

        {/* Student Cards Grid */}
        {loading ? (
          <div className="py-24 text-center text-slate-400 font-mono text-xs uppercase tracking-widest animate-pulse">
            LOADING STUDENT DIRECTORY FROM FIRESTORE...
          </div>
        ) : filteredStudents.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredStudents.map((student) => (
              <motion.div
                key={student.id}
                whileHover={{ y: -4 }}
                onClick={() => setSelectedStudent(student)}
                className="p-6 border border-[#E2E2DC] bg-white hover:border-[#00A86B] shadow-xs rounded-2xl transition-all cursor-pointer flex flex-col justify-between group relative overflow-hidden"
              >
                <div>
                  <div className="flex items-start justify-between gap-4 mb-4">
                    <div className="flex items-center space-x-4">
                      <img 
                        src={student.profilePhoto} 
                        alt={student.name} 
                        className="w-16 h-16 rounded-full object-cover border-2 border-[#00A86B]/40 group-hover:border-[#00A86B] shadow-xs"
                      />
                      <div>
                        <h3 className="font-editorial text-xl font-bold text-slate-900 group-hover:text-[#00A86B] transition-colors">
                          {student.name}
                        </h3>
                        <div className="text-xs font-semibold text-slate-600 mt-0.5">
                          {student.department}
                        </div>
                        <div className="text-xs text-slate-500 mt-0.5">
                          {student.semester}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Enrollment Number (Visible ONLY to Authorized Admins) */}
                  <div className="my-3 p-3 bg-slate-50 border border-[#E2E2DC] rounded-xl flex items-center justify-between text-xs">
                    <span className="font-bold uppercase tracking-wider text-slate-500">ENROLLMENT:</span>
                    {isAdmin ? (
                      <span className="font-mono font-bold text-[#00A86B]">{student.enrollment_no || "N/A"}</span>
                    ) : (
                      <span className="text-slate-400 font-medium flex items-center space-x-1 text-[11px]">
                        <Lock className="w-3 h-3 text-slate-400" />
                        <span>Protected (Admin Only)</span>
                      </span>
                    )}
                  </div>
                </div>

                <div className="pt-4 border-t border-[#E2E2DC] grid grid-cols-3 gap-2 text-center text-xs">
                  <div className="p-2 bg-slate-50 rounded-lg">
                    <span className="text-slate-500 block text-[10px] font-bold uppercase">SOLVED</span>
                    <span className="font-mono font-bold text-slate-900 text-base">{student.solved || 0}</span>
                  </div>

                  <div className="p-2 bg-slate-50 rounded-lg">
                    <span className="text-slate-500 block text-[10px] font-bold uppercase">POINTS</span>
                    <span className="font-mono font-bold text-[#00A86B] text-base">{student.points || 0} XP</span>
                  </div>

                  <div className="p-2 bg-slate-50 rounded-lg">
                    <span className="text-slate-500 block text-[10px] font-bold uppercase">STREAK</span>
                    <span className="font-mono font-bold text-orange-500 text-base">🔥 {student.streak || 0}d</span>
                  </div>
                </div>

              </motion.div>
            ))}
          </div>
        ) : (
          /* EMPTY STATE FOR NO REGISTERED STUDENTS */
          <div className="p-16 border border-[#E2E2DC] bg-white text-center shadow-xs rounded-2xl my-10 max-w-2xl mx-auto">
            <GraduationCap className="w-16 h-16 mx-auto mb-4 text-[#00A86B]/40" />
            <h3 className="font-editorial text-2xl font-black text-slate-900">
              No Registered Students Found
            </h3>
            <p className="text-sm text-slate-600 max-w-md mx-auto mt-2 leading-relaxed font-normal">
              No student accounts match the current filter criteria or have registered yet. Authenticated students will automatically appear in this directory upon registration.
            </p>
          </div>
        )}

      </div>

      {/* STUDENT PROFILE DETAILS MODAL */}
      <AnimatePresence>
        {selectedStudent && (
          <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="w-full max-w-xl border border-[#E2E2DC] bg-white shadow-2xl overflow-hidden rounded-2xl p-6 sm:p-8 relative text-slate-900"
            >
              <button
                onClick={() => setSelectedStudent(null)}
                className="absolute top-4 right-4 w-8 h-8 rounded-full bg-slate-100 text-slate-700 flex items-center justify-center font-mono text-xs hover:bg-rose-500 hover:text-white transition-colors cursor-pointer"
              >
                ✕
              </button>

              <div className="flex items-center space-x-5 mb-6 pb-6 border-b border-[#E2E2DC]">
                <img 
                  src={selectedStudent.profilePhoto} 
                  alt={selectedStudent.name} 
                  className="w-20 h-20 rounded-full object-cover border-2 border-[#00A86B] shadow-sm"
                />
                <div>
                  <span className="px-2.5 py-1 rounded bg-[#00A86B]/10 text-[#00A86B] text-[10px] font-extrabold uppercase tracking-wider border border-[#00A86B]/30">
                    Verified Student Member
                  </span>
                  <h3 className="font-editorial text-2xl font-black text-slate-900 mt-1">
                    {selectedStudent.name}
                  </h3>
                  <div className="text-xs text-slate-500 mt-1">
                    {selectedStudent.department} · {selectedStudent.semester}
                  </div>
                </div>
              </div>

              <div className="space-y-4 text-xs sm:text-sm">
                
                {/* Enrollment Number (Admin Access Control) */}
                <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl flex items-center justify-between">
                  <span className="font-bold uppercase tracking-wider text-slate-500">Enrollment Number</span>
                  {isAdmin ? (
                    <span className="font-mono font-bold text-[#00A86B]">{selectedStudent.enrollment_no || "N/A"}</span>
                  ) : (
                    <span className="text-slate-400 font-semibold flex items-center space-x-1">
                      <Lock className="w-3.5 h-3.5" />
                      <span>Restricted to Chapter Admins</span>
                    </span>
                  )}
                </div>

                <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl flex items-center justify-between">
                  <span className="font-bold uppercase tracking-wider text-slate-500">Email Address</span>
                  <span className="font-mono text-slate-900 font-medium">{selectedStudent.email}</span>
                </div>

                <div className="grid grid-cols-3 gap-3">
                  <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl text-center">
                    <span className="text-slate-500 text-[10px] font-bold uppercase block mb-1">QUESTIONS SOLVED</span>
                    <span className="font-mono text-xl font-bold text-slate-900">{selectedStudent.solved || 0}</span>
                  </div>

                  <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl text-center">
                    <span className="text-slate-500 text-[10px] font-bold uppercase block mb-1">TOTAL POINTS</span>
                    <span className="font-mono text-xl font-bold text-[#00A86B]">{selectedStudent.points || 0} XP</span>
                  </div>

                  <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl text-center">
                    <span className="text-slate-500 text-[10px] font-bold uppercase block mb-1">CURRENT STREAK</span>
                    <span className="font-mono text-xl font-bold text-orange-500">🔥 {selectedStudent.streak || 0}d</span>
                  </div>
                </div>

              </div>

              <div className="mt-8 pt-4 border-t border-[#E2E2DC] flex justify-end">
                <button
                  onClick={() => setSelectedStudent(null)}
                  className="px-6 py-2.5 bg-slate-900 hover:bg-black text-white text-xs font-bold uppercase tracking-wider rounded-xl cursor-pointer"
                >
                  Close Profile
                </button>
              </div>

            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  )
}
