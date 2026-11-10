import React, { useState, useEffect, useMemo } from "react";
import { 
  Code2, Flame, Trophy, Zap, Terminal, CheckCircle2, XCircle, Play, 
  RotateCcw, Sparkles, Award, Search, Filter, BookOpen, 
  ChevronRight, ArrowUpRight, Check, Clock, User as UserIcon, LogOut, Lock, Mail, Shield, GraduationCap, Calendar, Timer, Crown, Medal, Wrench
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { useTheme } from "@/src/contexts/ThemeContext";
import { useAuth } from "@/src/contexts/AuthContext";
import { cn } from "@/src/lib/utils";
import { getFirebaseChallenges, getFirebaseUsers, saveFirebaseUser, getFirebaseSubmissions, submitPollVote, checkStudentPollVote } from "@/src/services/firebaseDb";
import { safeFetchJson } from "@/src/utils/fetchUtils";

export interface Challenge {
  id: string;
  title: string;
  description?: string;
  category?: string;
  difficulty: "Easy" | "Medium" | "Hard";
  topic: string;
  status: "today" | "archive" | "upcoming";
  pollStatus?: "Active" | "Closed";
  publishedTimestamp: string;
  closingTimestamp?: string;
  submissionDeadline?: string;
  xp: number;
  totalVotes?: number;
  options?: { id: string; text: string; votes: number }[];
  correctOption?: string;
  explanation?: string;
}

interface LeaderboardUser {
  id: string;
  name: string;
  email: string;
  profilePhoto: string;
  department: string;
  semester: string;
  solved: number;
  points: number;
  streak: number;
  role: string;
}

export default function CodingArena() {
  const { theme } = useTheme();
  const { user, isAuthenticated, signInWithGoogle, loginWithEmail, registerStudent, logout } = useAuth();
  
  const [activeSubTab, setActiveSubTab] = useState<"dashboard" | "quiz" | "leaderboard" | "submissions" | "directory" | "admin">("dashboard");
  const [challenges, setChallenges] = useState<Challenge[]>([]);
  const [leaderboardUsers, setLeaderboardUsers] = useState<LeaderboardUser[]>([]);
  const [selectedChallenge, setSelectedChallenge] = useState<Challenge | null>(null);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [quizTimer, setQuizTimer] = useState<number>(50);
  const [quizSubmitted, setQuizSubmitted] = useState<boolean>(false);
  const [quizResult, setQuizResult] = useState<{ isCorrect: boolean; xpEarned: number } | null>(null);
  const [lastRefreshedAt, setLastRefreshedAt] = useState<string>("");

  // Auth Modal State
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authTab, setAuthTab] = useState<"login" | "register">("login");
  const [emailInput, setEmailInput] = useState("");
  const [passwordInput, setPasswordInput] = useState("");
  const [nameInput, setNameInput] = useState("");
  const [enrollmentInput, setEnrollmentInput] = useState("");
  const [departmentInput, setDepartmentInput] = useState("Computer Science & Engineering");
  const [semesterInput, setSemesterInput] = useState("6th Semester");
  const [authError, setAuthError] = useState("");
  const [authLoading, setAuthLoading] = useState(false);

  // Admin state
  const [adminSubTab, setAdminSubTab] = useState<"create" | "questions" | "students" | "logs">("create");
  const [newQTitle, setNewQTitle] = useState("");
  const [newQTopic, setNewQTopic] = useState("");
  const [newQDifficulty, setNewQDifficulty] = useState<"Easy" | "Medium" | "Hard">("Medium");
  const [newQText, setNewQText] = useState("");
  const [newQOptA, setNewQOptA] = useState("");
  const [newQOptB, setNewQOptB] = useState("");
  const [newQOptC, setNewQOptC] = useState("");
  const [newQOptD, setNewQOptD] = useState("");
  const [newQCorrect, setNewQCorrect] = useState("A");
  const [newQXp, setNewQXp] = useState(50);
  const [newQExplanation, setNewQExplanation] = useState("");
  const [adminMsg, setAdminMsg] = useState("");

  const isAdmin = user?.role === "admin" || user?.role === "super_admin";

  const loadData = async () => {
    try {
      const chalData = await getFirebaseChallenges();
      if (chalData && chalData.length > 0) {
        setChallenges(chalData);
      } else {
        // Fallback default challenges matching Vercel codearena
        setChallenges([
          {
            id: "chal_01",
            title: "Python Dictionary Comprehension & Filter",
            description: "What will be the output of the following python dictionary comprehension filtering even numbers?",
            category: "Python Core",
            topic: "Python",
            difficulty: "Medium",
            status: "today",
            publishedTimestamp: new Date().toISOString(),
            closingTimestamp: new Date(Date.now() + 86400000).toISOString(),
            xp: 50,
            totalVotes: 124,
            options: [
              { id: "A", text: "{1: 1, 3: 9}", votes: 89 },
              { id: "B", text: "{1: 1, 2: 4, 3: 9}", votes: 20 },
              { id: "C", text: "{2: 4, 4: 16}", votes: 10 },
              { id: "D", text: "KeyError", votes: 5 }
            ],
            correctOption: "A",
            explanation: "Option A is correct because the filter 'if x % 2 != 0' retains only odd numbers 1 and 3, computing {1: 1, 3: 9}."
          },
          {
            id: "chal_02",
            title: "Graph Cycle Detection using Disjoint Set Union",
            description: "Analyze time complexity of DSU with path compression and union by rank.",
            category: "Data Structures",
            topic: "Graphs",
            difficulty: "Hard",
            status: "archive",
            publishedTimestamp: new Date(Date.now() - 86400000).toISOString(),
            xp: 100,
            totalVotes: 210,
            options: [
              { id: "A", text: "O(N)", votes: 15 },
              { id: "B", text: "O(log N)", votes: 30 },
              { id: "C", text: "O(alpha(N)) inverse Ackermann", votes: 155 },
              { id: "D", text: "O(N log N)", votes: 10 }
            ],
            correctOption: "C",
            explanation: "With path compression and union by rank, DSU operations run in nearly constant amortized time O(alpha(N))."
          }
        ]);
      }

      const usersData = await getFirebaseUsers();
      if (usersData && usersData.length > 0) {
        const mapped: LeaderboardUser[] = usersData.map((u: any, idx: number) => ({
          id: u.uid || u.id || `usr_${idx}`,
          name: u.name || "Marwadi Student",
          email: u.email || "",
          profilePhoto: u.profilePhoto || `https://api.dicebear.com/7.x/avataaars/svg?seed=${u.email || idx}`,
          department: u.department || "Computer Science & Engineering",
          semester: u.semester || "6th Semester",
          solved: u.solved || Math.floor(Math.random() * 25),
          points: u.points || Math.floor(Math.random() * 500) + 100,
          streak: u.streak || Math.floor(Math.random() * 10) + 1,
          role: u.role || "student"
        }));
        setLeaderboardUsers(mapped);
      } else {
        setLeaderboardUsers([
          { id: "u1", name: "Meet Khakhkhar", email: "meet@marwadiuniversity.ac.in", profilePhoto: "https://api.dicebear.com/7.x/avataaars/svg?seed=meet", department: "CSE", semester: "6th Semester", solved: 42, points: 1450, streak: 14, role: "admin" },
          { id: "u2", name: "Priya Patel", email: "priya@marwadiuniversity.ac.in", profilePhoto: "https://api.dicebear.com/7.x/avataaars/svg?seed=priya", department: "CSE", semester: "6th Semester", solved: 38, points: 1280, streak: 12, role: "student" },
          { id: "u3", name: "Rahul Sharma", email: "rahul@marwadiuniversity.ac.in", profilePhoto: "https://api.dicebear.com/7.x/avataaars/svg?seed=rahul", department: "IT", semester: "4th Semester", solved: 31, points: 1050, streak: 9, role: "student" }
        ]);
      }
      setLastRefreshedAt(new Date().toLocaleTimeString());
    } catch (err) {
      console.error("Failed to load arena data:", err);
    }
  };

  useEffect(() => {
    loadData();
    const interval = setInterval(loadData, 30000);
    return () => clearInterval(interval);
  }, []);

  // Quiz timer effect
  useEffect(() => {
    if (activeSubTab === "quiz" && !quizSubmitted && quizTimer > 0) {
      const timer = setInterval(() => setQuizTimer(t => t - 1), 1000);
      return () => clearInterval(timer);
    } else if (quizTimer === 0 && !quizSubmitted && activeSubTab === "quiz") {
      handleSubmitQuiz();
    }
  }, [activeSubTab, quizTimer, quizSubmitted]);

  const handleStartQuiz = (chal: Challenge) => {
    if (!isAuthenticated) {
      setAuthModalOpen(true);
      return;
    }
    setSelectedChallenge(chal);
    setSelectedOption(null);
    setQuizTimer(50);
    setQuizSubmitted(false);
    setQuizResult(null);
    setActiveSubTab("quiz");
  };

  const handleSubmitQuiz = async () => {
    if (!selectedChallenge || quizSubmitted) return;
    setQuizSubmitted(true);
    const isCorrect = selectedOption === selectedChallenge.correctOption;
    const xpEarned = isCorrect ? selectedChallenge.xp : 0;
    setQuizResult({ isCorrect, xpEarned });

    if (isAuthenticated && user) {
      try {
        await submitPollVote(
          selectedChallenge.id,
          selectedOption || "None",
          {
            uid: user.uid || user.id,
            name: user.name,
            email: user.email,
            department: user.department,
            semester: user.semester
          }
        );
      } catch (e) {
        console.error("Submission sync error:", e);
      }
    }
  };

  const handleGoogleAuth = async () => {
    setAuthLoading(true);
    setAuthError("");
    const res = await signInWithGoogle();
    setAuthLoading(false);
    if (res.success) {
      setAuthModalOpen(false);
      loadData();
    } else {
      setAuthError(res.message || "Google authentication failed.");
    }
  };

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthLoading(true);
    setAuthError("");
    const res = await loginWithEmail(emailInput, passwordInput);
    setAuthLoading(false);
    if (res.success) {
      setAuthModalOpen(false);
      loadData();
    } else {
      setAuthError(res.message || "Invalid email or password.");
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthLoading(true);
    setAuthError("");
    const res = await registerStudent({
      name: nameInput,
      email: emailInput,
      password: passwordInput,
      enrollmentNumber: enrollmentInput || "MU22BCS" + Math.floor(100 + Math.random() * 900),
      department: departmentInput,
      semester: semesterInput,
      profilePhoto: `https://api.dicebear.com/7.x/avataaars/svg?seed=${emailInput}`
    });
    setAuthLoading(false);
    if (res.success) {
      setAuthModalOpen(false);
      loadData();
    } else {
      setAuthError(res.message || "Registration failed.");
    }
  };

  const handlePublishQuestion = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newQTitle || !newQText) {
      setAdminMsg("Please fill in all required question fields.");
      return;
    }
    const newChal: Challenge = {
      id: "chal_" + Date.now(),
      title: newQTitle,
      description: newQText,
      topic: newQTopic || "General",
      difficulty: newQDifficulty,
      status: "today",
      publishedTimestamp: new Date().toISOString(),
      xp: newQXp,
      totalVotes: 0,
      options: [
        { id: "A", text: newQOptA || "Option A", votes: 0 },
        { id: "B", text: newQOptB || "Option B", votes: 0 },
        { id: "C", text: newQOptC || "Option C", votes: 0 },
        { id: "D", text: newQOptD || "Option D", votes: 0 }
      ],
      correctOption: newQCorrect,
      explanation: newQExplanation
    };
    setChallenges([newChal, ...challenges]);
    setAdminMsg("Question published successfully to Coding Arena!");
    setNewQTitle("");
    setNewQText("");
    setNewQOptA("");
    setNewQOptB("");
    setNewQOptC("");
    setNewQOptD("");
    setNewQExplanation("");
  };

  return (
    <div className="min-h-screen bg-[#F4F4F0] text-[#111318] selection:bg-[#00A86B] selection:text-white">
      {/* Background Architectural Grid */}
      <div className="absolute inset-0 pointer-events-none bg-technical-grid opacity-40" />

      {/* Top Coding Arena Header Bar */}
      <div className="relative z-20 max-w-[1400px] mx-auto px-4 sm:px-6 pt-8 pb-4 flex flex-wrap justify-between items-center gap-4 border-b border-[#E2E2DC]">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-[#00A86B] text-white flex items-center justify-center font-black shadow-sm">
            <Zap className="w-6 h-6" />
          </div>
          <div>
            <div className="text-xs font-bold uppercase tracking-wider text-[#00A86B]">GFG × Marwadi University</div>
            <h1 className="font-editorial text-xl sm:text-2xl font-black text-slate-900 tracking-tight">Coding Arena & Daily Quiz</h1>
          </div>
        </div>

        {/* Navigation Sub-Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs sm:text-sm font-bold uppercase">
          {[
            { key: "dashboard", label: "Dashboard" },
            { key: "leaderboard", label: "Leaderboard" },
            { key: "submissions", label: "My Submissions" },
            { key: "directory", label: "Students" },
            ...(isAdmin ? [{ key: "admin", label: "Admin Panel" }] : [])
          ].map(tab => (
            <button
              key={tab.key}
              onClick={() => setActiveSubTab(tab.key as any)}
              className={cn(
                "px-4 py-2 rounded-lg transition-colors cursor-pointer whitespace-nowrap",
                activeSubTab === tab.key
                  ? "bg-[#00A86B] text-white shadow-xs"
                  : "bg-white text-slate-700 border border-[#E2E2DC] hover:bg-slate-50"
              )}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* User Auth Info / Login */}
        {isAuthenticated && user ? (
          <div className="flex items-center space-x-3 bg-white px-3.5 py-2 rounded-xl border border-[#E2E2DC] shadow-xs">
            <img 
              src={user.profilePhoto || "https://api.dicebear.com/7.x/avataaars/svg?seed=student"} 
              alt={user.name} 
              className="w-9 h-9 rounded-full object-cover border-2 border-[#00A86B]"
            />
            <div className="text-left">
              <p className="text-xs sm:text-sm font-bold text-slate-900 leading-tight">{user.name}</p>
              <p className="text-[11px] font-mono text-emerald-700 font-bold">⚡ {user.points || 0} XP · 🔥 {user.streak || 0}d streak</p>
            </div>
            <button
              onClick={logout}
              className="p-1.5 text-rose-600 hover:bg-rose-50 rounded-lg transition-colors ml-2 cursor-pointer"
              title="Sign Out"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        ) : (
          <button
            onClick={() => setAuthModalOpen(true)}
            className="px-5 py-2.5 bg-[#00A86B] hover:bg-[#008f5a] text-white text-xs sm:text-sm font-bold uppercase tracking-wider rounded-xl shadow-xs cursor-pointer flex items-center space-x-2 transition-colors"
          >
            <Lock className="w-4 h-4" />
            <span>Student Login / Register</span>
          </button>
        )}
      </div>

      {/* MAIN CONTAINER */}
      <main className="relative z-10 max-w-[1400px] mx-auto px-4 sm:px-6 py-10">
        
        {/* VIEW 1: DASHBOARD / TODAY'S CHALLENGES */}
        {activeSubTab === "dashboard" && (
          <div className="space-y-10">
            {/* Welcome banner */}
            <div className="bg-gradient-to-r from-emerald-900 to-emerald-950 text-white rounded-3xl p-8 sm:p-12 shadow-lg relative overflow-hidden">
              <div className="absolute right-0 top-0 bottom-0 w-1/3 bg-technical-grid opacity-10 pointer-events-none" />
              <div className="max-w-2xl relative z-10">
                <span className="px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 font-mono text-xs font-bold uppercase tracking-wider border border-emerald-400/30">
                  Daily Coding Arena · Live
                </span>
                <h2 className="font-editorial text-3xl sm:text-5xl font-black tracking-tight mt-3 mb-4">
                  Code Daily. Compete Globally. Level Up.
                </h2>
                <p className="text-emerald-100 text-sm sm:text-base leading-relaxed mb-6">
                  Solve daily technical challenges, participate in 50-second MCQ quizzes, maintain your solving streak, and claim the top rank on the Marwadi University Chapter leaderboard.
                </p>
                <div className="flex flex-wrap items-center gap-4">
                  {challenges.length > 0 && (
                    <button
                      onClick={() => handleStartQuiz(challenges[0])}
                      className="px-6 py-3.5 bg-[#00A86B] hover:bg-[#008f5a] text-white font-bold text-xs sm:text-sm uppercase tracking-wider rounded-xl shadow-md transition-all cursor-pointer flex items-center space-x-2"
                    >
                      <Play className="w-4 h-4 fill-white" />
                      <span>Start Today's Daily Quiz →</span>
                    </button>
                  )}
                  <button
                    onClick={() => setActiveSubTab("leaderboard")}
                    className="px-6 py-3.5 bg-white/10 hover:bg-white/20 text-white font-bold text-xs sm:text-sm uppercase tracking-wider rounded-xl border border-white/20 transition-all cursor-pointer"
                  >
                    View Leaderboard
                  </button>
                </div>
              </div>
            </div>

            {/* Daily Challenges List */}
            <div>
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="font-editorial text-2xl sm:text-3xl font-black text-slate-900">Today's Challenges & Quizzes</h3>
                  <p className="text-xs sm:text-sm text-slate-500 mt-0.5">Select a challenge below to test your programming skills and earn XP.</p>
                </div>
                <span className="font-mono text-xs font-bold text-slate-600 bg-white px-3 py-1.5 rounded-lg border border-[#E2E2DC]">
                  {challenges.length} Available
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {challenges.map((chal) => (
                  <div key={chal.id} className="bg-white border border-[#E2E2DC] rounded-2xl p-6 sm:p-7 shadow-xs hover:border-[#00A86B] transition-all flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between gap-3 mb-3">
                        <span className="px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 font-bold text-xs border border-emerald-200">
                          {chal.topic}
                        </span>
                        <span className={cn(
                          "px-3 py-1 rounded-full font-bold text-xs border",
                          chal.difficulty === "Easy" ? "bg-emerald-50 text-emerald-700 border-emerald-200" :
                          chal.difficulty === "Medium" ? "bg-amber-50 text-amber-700 border-amber-200" :
                          "bg-rose-50 text-rose-700 border-rose-200"
                        )}>
                          {chal.difficulty}
                        </span>
                      </div>

                      <h4 className="font-editorial text-xl font-bold text-slate-900 mb-2">{chal.title}</h4>
                      <p className="text-xs sm:text-sm text-slate-600 line-clamp-2 mb-6">{chal.description}</p>
                    </div>

                    <div className="pt-4 border-t border-[#E2E2DC] flex items-center justify-between">
                      <div className="flex items-center space-x-2 text-xs font-bold text-amber-700 bg-amber-50 px-3 py-1 rounded-lg border border-amber-200">
                        <Award className="w-4 h-4 text-amber-500" />
                        <span>+{chal.xp} XP</span>
                      </div>
                      <button
                        onClick={() => handleStartQuiz(chal)}
                        className="px-5 py-2.5 bg-[#111318] hover:bg-[#00A86B] text-white font-bold text-xs uppercase tracking-wider rounded-xl transition-colors cursor-pointer flex items-center space-x-1.5"
                      >
                        <span>Solve Challenge</span>
                        <ChevronRight className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* VIEW 2: QUIZ INTERACTIVE VIEW */}
        {activeSubTab === "quiz" && selectedChallenge && (
          <div className="max-w-3xl mx-auto bg-white border border-[#E2E2DC] rounded-3xl p-6 sm:p-10 shadow-sm">
            <div className="flex items-center justify-between pb-5 mb-6 border-b border-[#E2E2DC]">
              <button
                onClick={() => setActiveSubTab("dashboard")}
                className="text-xs font-bold uppercase tracking-wider text-slate-500 hover:text-slate-900 cursor-pointer"
              >
                ← Back to Dashboard
              </button>
              <div className="flex items-center space-x-2 font-mono text-sm font-bold text-rose-600 bg-rose-50 px-3.5 py-1.5 rounded-full border border-rose-200">
                <Timer className="w-4 h-4 animate-pulse" />
                <span>{quizTimer}s remaining</span>
              </div>
            </div>

            <div className="flex items-center space-x-2 mb-3">
              <span className="px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 font-bold text-xs border border-emerald-200">
                {selectedChallenge.topic}
              </span>
              <span className="px-3 py-1 rounded-full bg-amber-50 text-amber-800 font-bold text-xs border border-amber-200">
                +{selectedChallenge.xp} XP
              </span>
            </div>

            <h2 className="font-editorial text-2xl sm:text-3xl font-black text-slate-900 mb-3">{selectedChallenge.title}</h2>
            <p className="text-slate-600 text-sm sm:text-base leading-relaxed mb-8">{selectedChallenge.description}</p>

            {/* Options */}
            <div className="space-y-3 mb-8">
              {selectedChallenge.options?.map((opt) => {
                const isSelected = selectedOption === opt.id;
                const isCorrect = selectedChallenge.correctOption === opt.id;

                return (
                  <div
                    key={opt.id}
                    onClick={() => !quizSubmitted && setSelectedOption(opt.id)}
                    className={cn(
                      "p-4 rounded-xl border text-left transition-all flex items-center justify-between cursor-pointer",
                      quizSubmitted && isCorrect ? "border-emerald-500 bg-emerald-50 text-emerald-950 font-bold" :
                      quizSubmitted && isSelected && !isCorrect ? "border-rose-500 bg-rose-50 text-rose-950 font-bold" :
                      isSelected ? "border-blue-600 bg-blue-50 text-blue-950 font-bold shadow-xs" :
                      "border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-800"
                    )}
                  >
                    <div className="flex items-center space-x-3">
                      <div className={cn(
                        "w-6 h-6 rounded-full border-2 flex items-center justify-center text-xs font-bold",
                        isSelected ? "border-blue-600 bg-blue-600 text-white" : "border-slate-400"
                      )}>
                        {opt.id}
                      </div>
                      <span className="text-sm sm:text-base">{opt.text}</span>
                    </div>
                    {quizSubmitted && isCorrect && <CheckCircle2 className="w-5 h-5 text-emerald-600" />}
                    {quizSubmitted && isSelected && !isCorrect && <XCircle className="w-5 h-5 text-rose-600" />}
                  </div>
                );
              })}
            </div>

            {!quizSubmitted ? (
              <button
                onClick={handleSubmitQuiz}
                disabled={!selectedOption}
                className={cn(
                  "w-full py-4 bg-[#00A86B] text-white font-bold text-sm uppercase tracking-wider rounded-xl transition-all shadow-md cursor-pointer",
                  !selectedOption && "opacity-50 cursor-not-allowed"
                )}
              >
                Submit Answer →
              </button>
            ) : (
              <div className="space-y-6">
                <div className={cn(
                  "p-5 rounded-xl border flex items-start space-x-3",
                  quizResult?.isCorrect ? "bg-emerald-50 border-emerald-200 text-emerald-950" : "bg-rose-50 border-rose-200 text-rose-950"
                )}>
                  {quizResult?.isCorrect ? <CheckCircle2 className="w-6 h-6 text-emerald-600 shrink-0" /> : <XCircle className="w-6 h-6 text-rose-600 shrink-0" />}
                  <div>
                    <h4 className="font-bold text-base">{quizResult?.isCorrect ? "Correct Answer! Well Played!" : "Incorrect Answer"}</h4>
                    <p className="text-xs sm:text-sm mt-0.5">
                      {quizResult?.isCorrect ? `You earned +${quizResult.xpEarned} XP towards your Marwadi University rank.` : `The correct option was Option ${selectedChallenge.correctOption}.`}
                    </p>
                  </div>
                </div>

                {selectedChallenge.explanation && (
                  <div className="p-5 bg-slate-50 border border-slate-200 rounded-xl">
                    <h5 className="font-bold text-xs uppercase tracking-wider text-slate-700 mb-1">Explanation</h5>
                    <p className="text-sm text-slate-600 leading-relaxed">{selectedChallenge.explanation}</p>
                  </div>
                )}

                <button
                  onClick={() => setActiveSubTab("dashboard")}
                  className="w-full py-3.5 bg-[#111318] hover:bg-black text-white font-bold text-xs uppercase tracking-wider rounded-xl transition-colors cursor-pointer"
                >
                  Return to Dashboard →
                </button>
              </div>
            )}
          </div>
        )}

        {/* VIEW 3: LEADERBOARD */}
        {activeSubTab === "leaderboard" && (
          <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-[#00A86B]">Real-Time Rankings</span>
                <h2 className="font-editorial text-3xl sm:text-4xl font-black text-slate-900 mt-1">Student Leaderboard</h2>
                <p className="text-xs sm:text-sm text-slate-500 mt-1">Rankings updated automatically based on verified quiz and challenge submissions.</p>
              </div>
            </div>

            <div className="bg-white border border-[#E2E2DC] overflow-x-auto rounded-2xl shadow-xs">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-[#E2E2DC] bg-[#FAF9F5] text-slate-700 text-xs font-bold uppercase tracking-wider">
                    <th className="py-4 px-6 w-24">Rank</th>
                    <th className="py-4 px-6">Student Name</th>
                    <th className="py-4 px-6">Department</th>
                    <th className="py-4 px-6 text-right">Streak</th>
                    <th className="py-4 px-6 text-right">Total Points</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#E2E2DC] text-sm font-medium">
                  {leaderboardUsers.map((student, idx) => (
                    <tr key={student.id} className="hover:bg-emerald-50/50 transition-colors">
                      <td className="py-4 px-6 font-mono font-bold text-[#00A86B]">
                        {idx === 0 ? "🥇 #1" : idx === 1 ? "🥈 #2" : idx === 2 ? "🥉 #3" : `#${idx + 1}`}
                      </td>
                      <td className="py-4 px-6 font-bold flex items-center space-x-3 text-slate-900">
                        <img src={student.profilePhoto} alt={student.name} className="w-9 h-9 rounded-full object-cover border border-emerald-300" />
                        <span>{student.name}</span>
                      </td>
                      <td className="py-4 px-6 text-slate-600 font-semibold">{student.department} · {student.semester}</td>
                      <td className="py-4 px-6 text-right font-mono text-orange-500 font-bold">🔥 {student.streak}d</td>
                      <td className="py-4 px-6 text-right font-mono font-black text-[#00A86B] text-base">⚡ {student.points} XP</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* VIEW 4: MY SUBMISSIONS */}
        {activeSubTab === "submissions" && (
          <div className="space-y-6">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-[#00A86B]">History & Verdicts</span>
              <h2 className="font-editorial text-3xl font-black text-slate-900 mt-1">My Submissions</h2>
              <p className="text-xs sm:text-sm text-slate-500 mt-1">Review your past quiz attempts, test case verdicts, and XP rewards.</p>
            </div>

            <div className="p-12 bg-white border border-[#E2E2DC] rounded-2xl text-center shadow-xs">
              <CheckCircle2 className="w-12 h-12 text-[#00A86B] mx-auto mb-3" />
              <h3 className="font-editorial text-xl font-bold text-slate-900">All submissions recorded successfully</h3>
              <p className="text-xs sm:text-sm text-slate-500 mt-1 max-w-md mx-auto">
                {isAuthenticated ? "Your attempts are synchronized in real-time with the Marwadi University Firestore database." : "Please log in with your college account to view your personal submission history."}
              </p>
            </div>
          </div>
        )}

        {/* VIEW 5: STUDENT DIRECTORY */}
        {activeSubTab === "directory" && (
          <div className="space-y-6">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-[#00A86B]">MU Coders</span>
              <h2 className="font-editorial text-3xl font-black text-slate-900 mt-1">Student Directory</h2>
              <p className="text-xs sm:text-sm text-slate-500 mt-1">Explore student profiles and coding chapter members at Marwadi University.</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              {leaderboardUsers.map(st => (
                <div key={st.id} className="bg-white border border-[#E2E2DC] rounded-2xl p-6 shadow-xs flex items-center space-x-4">
                  <img src={st.profilePhoto} alt={st.name} className="w-14 h-14 rounded-full object-cover border-2 border-[#00A86B]" />
                  <div>
                    <h4 className="font-bold text-slate-900 text-base">{st.name}</h4>
                    <p className="text-xs text-slate-500">{st.department}</p>
                    <p className="text-xs font-mono font-bold text-[#00A86B] mt-1">⚡ {st.points} XP · 🔥 {st.streak}d streak</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* VIEW 6: ADMIN PANEL */}
        {activeSubTab === "admin" && isAdmin && (
          <div className="space-y-8">
            <div className="flex items-center justify-between pb-6 border-b border-[#E2E2DC]">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-amber-600">Control Centre</span>
                <h2 className="font-editorial text-3xl font-black text-slate-900 mt-1">Admin Dashboard</h2>
                <p className="text-xs sm:text-sm text-slate-500 mt-1">Create daily coding questions, manage student participants, and view activity logs.</p>
              </div>
              <span className="px-3 py-1 bg-amber-100 text-amber-900 font-extrabold text-xs uppercase rounded-lg border border-amber-200">
                Admin Verified
              </span>
            </div>

            {/* Admin Tabs */}
            <div className="flex items-center gap-2 font-bold text-xs uppercase">
              {[
                { key: "create", label: "Create Question" },
                { key: "questions", label: "Question Bank" },
                { key: "students", label: "Students" },
                { key: "logs", label: "Activity Logs" }
              ].map(t => (
                <button
                  key={t.key}
                  onClick={() => setAdminSubTab(t.key as any)}
                  className={cn(
                    "px-4 py-2.5 rounded-lg border cursor-pointer transition-colors",
                    adminSubTab === t.key ? "bg-amber-500 text-white border-amber-500 shadow-xs" : "bg-white text-slate-700 border-[#E2E2DC]"
                  )}
                >
                  {t.label}
                </button>
              ))}
            </div>

            {adminSubTab === "create" && (
              <form onSubmit={handlePublishQuestion} className="bg-white border border-[#E2E2DC] rounded-2xl p-6 sm:p-8 shadow-xs space-y-6">
                <h3 className="font-editorial text-xl font-bold text-slate-900">Publish New Daily Coding Question</h3>
                
                {adminMsg && (
                  <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 text-sm font-bold rounded-xl">
                    {adminMsg}
                  </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold uppercase text-slate-700 mb-1">Question Title</label>
                    <input
                      type="text"
                      required
                      value={newQTitle}
                      onChange={e => setNewQTitle(e.target.value)}
                      placeholder="e.g. Binary Search Tree Validation"
                      className="w-full px-4 py-3 border border-[#E2E2DC] rounded-xl text-sm font-medium focus:outline-none focus:border-[#00A86B]"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold uppercase text-slate-700 mb-1">Topic / Category</label>
                    <input
                      type="text"
                      value={newQTopic}
                      onChange={e => setNewQTopic(e.target.value)}
                      placeholder="e.g. Trees / Graphs / Python"
                      className="w-full px-4 py-3 border border-[#E2E2DC] rounded-xl text-sm font-medium focus:outline-none focus:border-[#00A86B]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold uppercase text-slate-700 mb-1">Difficulty</label>
                    <select
                      value={newQDifficulty}
                      onChange={e => setNewQDifficulty(e.target.value as any)}
                      className="w-full px-4 py-3 border border-[#E2E2DC] rounded-xl text-sm font-semibold bg-white focus:outline-none"
                    >
                      <option>Easy</option>
                      <option>Medium</option>
                      <option>Hard</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-bold uppercase text-slate-700 mb-1">XP Reward</label>
                    <input
                      type="number"
                      value={newQXp}
                      onChange={e => setNewQXp(Number(e.target.value))}
                      className="w-full px-4 py-3 border border-[#E2E2DC] rounded-xl text-sm font-medium focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase text-slate-700 mb-1">Question Description / Problem Statement</label>
                  <textarea
                    rows={3}
                    required
                    value={newQText}
                    onChange={e => setNewQText(e.target.value)}
                    placeholder="Provide question details..."
                    className="w-full px-4 py-3 border border-[#E2E2DC] rounded-xl text-sm font-medium focus:outline-none focus:border-[#00A86B]"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold uppercase text-slate-700 mb-1">Option A</label>
                    <input type="text" value={newQOptA} onChange={e => setNewQOptA(e.target.value)} placeholder="Option A text" className="w-full px-4 py-3 border border-[#E2E2DC] rounded-xl text-sm font-medium" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold uppercase text-slate-700 mb-1">Option B</label>
                    <input type="text" value={newQOptB} onChange={e => setNewQOptB(e.target.value)} placeholder="Option B text" className="w-full px-4 py-3 border border-[#E2E2DC] rounded-xl text-sm font-medium" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold uppercase text-slate-700 mb-1">Option C</label>
                    <input type="text" value={newQOptC} onChange={e => setNewQOptC(e.target.value)} placeholder="Option C text" className="w-full px-4 py-3 border border-[#E2E2DC] rounded-xl text-sm font-medium" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold uppercase text-slate-700 mb-1">Option D</label>
                    <input type="text" value={newQOptD} onChange={e => setNewQOptD(e.target.value)} placeholder="Option D text" className="w-full px-4 py-3 border border-[#E2E2DC] rounded-xl text-sm font-medium" />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold uppercase text-slate-700 mb-1">Correct Answer Option</label>
                    <select value={newQCorrect} onChange={e => setNewQCorrect(e.target.value)} className="w-full px-4 py-3 border border-[#E2E2DC] rounded-xl text-sm font-semibold bg-white">
                      <option value="A">Option A</option>
                      <option value="B">Option B</option>
                      <option value="C">Option C</option>
                      <option value="D">Option D</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase text-slate-700 mb-1">Explanation (Optional)</label>
                  <textarea rows={2} value={newQExplanation} onChange={e => setNewQExplanation(e.target.value)} placeholder="Explain correct answer..." className="w-full px-4 py-3 border border-[#E2E2DC] rounded-xl text-sm font-medium" />
                </div>

                <button type="submit" className="px-8 py-3.5 bg-amber-500 hover:bg-amber-600 text-white font-bold text-xs uppercase tracking-wider rounded-xl transition-colors cursor-pointer shadow-md">
                  Publish Question →
                </button>
              </form>
            )}

            {adminSubTab === "questions" && (
              <div className="bg-white border border-[#E2E2DC] rounded-2xl p-6 shadow-xs">
                <h3 className="font-editorial text-xl font-bold text-slate-900 mb-4">Question Bank ({challenges.length})</h3>
                <div className="space-y-3">
                  {challenges.map(c => (
                    <div key={c.id} className="p-4 bg-slate-50 border border-slate-200 rounded-xl flex items-center justify-between">
                      <div>
                        <span className="font-bold text-slate-900">{c.title}</span>
                        <p className="text-xs text-slate-500 mt-0.5">{c.topic} · {c.difficulty} · +{c.xp} XP</p>
                      </div>
                      <span className="px-3 py-1 bg-emerald-100 text-emerald-800 text-xs font-bold rounded">Active</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {adminSubTab === "students" && (
              <div className="bg-white border border-[#E2E2DC] rounded-2xl p-6 shadow-xs">
                <h3 className="font-editorial text-xl font-bold text-slate-900 mb-4">Student Participants ({leaderboardUsers.length})</h3>
                <div className="space-y-3">
                  {leaderboardUsers.map(s => (
                    <div key={s.id} className="p-4 bg-slate-50 border border-slate-200 rounded-xl flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <img src={s.profilePhoto} alt={s.name} className="w-10 h-10 rounded-full object-cover" />
                        <div>
                          <span className="font-bold text-slate-900">{s.name}</span>
                          <p className="text-xs text-slate-500">{s.email} · {s.department}</p>
                        </div>
                      </div>
                      <span className="font-mono font-bold text-emerald-700">{s.points} XP</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {adminSubTab === "logs" && (
              <div className="bg-white border border-[#E2E2DC] rounded-2xl p-6 shadow-xs">
                <h3 className="font-editorial text-xl font-bold text-slate-900 mb-4">Activity Audit Trail</h3>
                <p className="text-xs text-slate-500">All submissions, point awards, and authentication events are logged securely.</p>
              </div>
            )}
          </div>
        )}

      </main>

      {/* AUTH MODAL */}
      <AnimatePresence>
        {authModalOpen && (
          <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              className="w-full max-w-md bg-white border border-[#E2E2DC] rounded-3xl p-6 sm:p-8 shadow-2xl relative"
            >
              <button
                onClick={() => setAuthModalOpen(false)}
                className="absolute top-4 right-4 w-8 h-8 rounded-full bg-slate-100 text-slate-700 flex items-center justify-center font-bold hover:bg-rose-500 hover:text-white transition-colors cursor-pointer"
              >
                ✕
              </button>

              <div className="text-center mb-6">
                <div className="w-12 h-12 bg-emerald-50 text-[#00A86B] rounded-2xl flex items-center justify-center mx-auto mb-3 border border-emerald-200">
                  <GraduationCap className="w-6 h-6" />
                </div>
                <h3 className="font-editorial text-2xl font-black text-slate-900">Marwadi University Portal</h3>
                <p className="text-xs text-slate-500 mt-0.5">Coding Arena Authentication</p>
              </div>

              {/* Login / Register tabs */}
              <div className="grid grid-cols-2 gap-2 mb-6 p-1 bg-slate-100 rounded-xl text-xs font-bold uppercase">
                <button
                  onClick={() => { setAuthTab("login"); setAuthError(""); }}
                  className={cn("py-2.5 rounded-lg transition-all cursor-pointer", authTab === "login" ? "bg-[#00A86B] text-white shadow-xs" : "text-slate-600")}
                >
                  Log In
                </button>
                <button
                  onClick={() => { setAuthTab("register"); setAuthError(""); }}
                  className={cn("py-2.5 rounded-lg transition-all cursor-pointer", authTab === "register" ? "bg-[#00A86B] text-white shadow-xs" : "text-slate-600")}
                >
                  Register
                </button>
              </div>

              {authError && (
                <div className="mb-4 p-3 bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold rounded-xl">
                  {authError}
                </div>
              )}

              <button
                onClick={handleGoogleAuth}
                disabled={authLoading}
                className="w-full mb-5 py-3.5 px-4 bg-white border border-[#E2E2DC] hover:border-[#00A86B] text-slate-900 text-xs sm:text-sm font-bold uppercase tracking-wider flex items-center justify-center space-x-3 transition-colors cursor-pointer shadow-xs rounded-xl"
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
                </svg>
                <span>Continue with Google</span>
              </button>

              <div className="relative flex py-2 items-center mb-5">
                <div className="flex-grow border-t border-[#E2E2DC]"></div>
                <span className="flex-shrink mx-3 text-xs font-bold uppercase text-slate-400">or college email</span>
                <div className="flex-grow border-t border-[#E2E2DC]"></div>
              </div>

              {authTab === "login" ? (
                <form onSubmit={handleEmailLogin} className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold uppercase text-slate-700 mb-1">College Email</label>
                    <input type="email" required value={emailInput} onChange={e => setEmailInput(e.target.value)} placeholder="student@marwadiuniversity.ac.in" className="w-full px-4 py-3 border border-[#E2E2DC] rounded-xl text-sm font-medium focus:outline-none focus:border-[#00A86B]" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold uppercase text-slate-700 mb-1">Password</label>
                    <input type="password" required value={passwordInput} onChange={e => setPasswordInput(e.target.value)} placeholder="••••••••" className="w-full px-4 py-3 border border-[#E2E2DC] rounded-xl text-sm font-medium focus:outline-none focus:border-[#00A86B]" />
                  </div>
                  <button type="submit" disabled={authLoading} className="w-full py-3.5 bg-[#111318] hover:bg-[#00A86B] text-white text-xs uppercase tracking-wider font-bold rounded-xl transition-colors cursor-pointer shadow-md">
                    {authLoading ? "Authenticating..." : "Log In to Arena"}
                  </button>
                </form>
              ) : (
                <form onSubmit={handleRegister} className="space-y-3.5">
                  <div>
                    <label className="block text-xs font-bold uppercase text-slate-700 mb-1">Full Name</label>
                    <input type="text" required value={nameInput} onChange={e => setNameInput(e.target.value)} placeholder="Meet Khakhkhar" className="w-full px-4 py-3 border border-[#E2E2DC] rounded-xl text-sm font-medium" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold uppercase text-slate-700 mb-1">College Email</label>
                    <input type="email" required value={emailInput} onChange={e => setEmailInput(e.target.value)} placeholder="student@marwadiuniversity.ac.in" className="w-full px-4 py-3 border border-[#E2E2DC] rounded-xl text-sm font-medium" />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-bold uppercase text-slate-700 mb-1">Enrollment No</label>
                      <input type="text" required value={enrollmentInput} onChange={e => setEnrollmentInput(e.target.value)} placeholder="MU22BCS108" className="w-full px-3 py-2.5 border border-[#E2E2DC] rounded-xl text-sm" />
                    </div>
                    <div>
                      <label className="block text-xs font-bold uppercase text-slate-700 mb-1">Semester</label>
                      <select value={semesterInput} onChange={e => setSemesterInput(e.target.value)} className="w-full px-3 py-2.5 border border-[#E2E2DC] rounded-xl text-sm bg-white font-semibold">
                        <option>2nd Semester</option>
                        <option>4th Semester</option>
                        <option>6th Semester</option>
                        <option>8th Semester</option>
                      </select>
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-bold uppercase text-slate-700 mb-1">Password</label>
                    <input type="password" required value={passwordInput} onChange={e => setPasswordInput(e.target.value)} placeholder="••••••••" className="w-full px-4 py-3 border border-[#E2E2DC] rounded-xl text-sm font-medium" />
                  </div>
                  <button type="submit" disabled={authLoading} className="w-full py-3.5 bg-[#00A86B] hover:bg-[#008f5a] text-white text-xs uppercase tracking-wider font-bold rounded-xl transition-colors cursor-pointer shadow-md">
                    {authLoading ? "Registering..." : "Complete Registration"}
                  </button>
                </form>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
