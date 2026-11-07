import React, { useState, useEffect, useMemo } from "react";
import { 
  CheckCircle2, XCircle, Clock, Users, Calendar, 
  Sparkles, Lock, ArrowRight, ShieldCheck, HelpCircle, Check, Award
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { cn } from "@/src/lib/utils";
import { submitPollVote, checkStudentPollVote, getFirebaseSubmissions } from "@/src/services/firebaseDb";

export interface PollOption {
  id: string;
  text: string;
  votes: number;
}

export interface PollQuestion {
  id: string;
  title: string;
  description: string;
  category?: string;
  topic?: string;
  difficulty: "Easy" | "Medium" | "Hard";
  status: "today" | "archive" | "upcoming";
  pollStatus?: "Active" | "Closed";
  publishedTimestamp: string;
  closingTimestamp?: string;
  submissionDeadline?: string;
  xp?: number;
  totalVotes: number;
  options: PollOption[];
  correctOption: string;
  explanation: string;
}

interface DailyPollCardProps {
  question: PollQuestion;
  currentUser: any | null;
  isAuthenticated: boolean;
  onOpenAuth: () => void;
  onVoteSuccess?: (updatedQuestion: PollQuestion, voteRecord: any) => void;
}

export default function DailyPollCard({
  question: initialQuestion,
  currentUser,
  isAuthenticated,
  onOpenAuth,
  onVoteSuccess
}: DailyPollCardProps) {
  const [question, setQuestion] = useState<PollQuestion>(initialQuestion);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [studentVote, setStudentVote] = useState<any | null>(null);
  const [hasVoted, setHasVoted] = useState(false);

  // Sync state if initialQuestion changes
  useEffect(() => {
    setQuestion(initialQuestion);
  }, [initialQuestion]);

  // Check if current user has already voted on this question
  useEffect(() => {
    if (currentUser?.uid || currentUser?.email) {
      const existing = checkStudentPollVote(question.id, currentUser.uid || currentUser.email);
      if (existing) {
        setStudentVote(existing);
        setHasVoted(true);
        setSelectedOption(existing.selectedOption);
      } else {
        setStudentVote(null);
        setHasVoted(false);
        setSelectedOption(null);
      }
    } else {
      setStudentVote(null);
      setHasVoted(false);
      setSelectedOption(null);
    }
  }, [question.id, currentUser]);

  const [questionSubmissions, setQuestionSubmissions] = useState<any[]>([]);

  useEffect(() => {
    const fetchParticipants = async () => {
      try {
        const allSubs = await getFirebaseSubmissions();
        const relevant = (allSubs || []).filter((s: any) => s.challengeId === question.id);
        setQuestionSubmissions(relevant);
      } catch (e) {
        console.error("Failed to load question participants:", e);
      }
    };
    fetchParticipants();
  }, [question.id, hasVoted]);

  const isAdmin = currentUser?.role === "admin" || currentUser?.role === "super_admin";

  const uniqueParticipantsList = useMemo(() => {
    const map = new Map<string, any>();
    questionSubmissions.forEach((s: any) => {
      const key = s.userId || s.userEmail || s.userName;
      if (key && !map.has(key)) {
        map.set(key, s);
      }
    });
    return Array.from(map.values());
  }, [questionSubmissions]);

  const uniqueCount = uniqueParticipantsList.length;
  const correctCount = uniqueParticipantsList.filter(s => s.isCorrect === true || s.status === "Accepted").length;
  const incorrectCount = uniqueParticipantsList.filter(s => s.isCorrect === false || s.status === "Wrong Answer").length;
  const accuracyPct = uniqueCount > 0 ? Math.round((correctCount / uniqueCount) * 100) : 0;

  const isPollClosed = question.pollStatus === "Closed" || question.status === "archive";

  // Calculate total votes
  const totalVotes = Math.max(question.totalVotes || 0, uniqueCount, question.options.reduce((acc, curr) => acc + (curr.votes || 0), 0));

  const handleOptionClick = (optionId: string) => {
    if (hasVoted || isPollClosed) return;
    setErrorMessage(null);
    setSelectedOption(optionId);
  };

  const handleVoteSubmit = async () => {
    if (!isAuthenticated || !currentUser) {
      onOpenAuth();
      return;
    }

    if (!selectedOption) {
      setErrorMessage("Please select one of the answer options above before submitting.");
      return;
    }

    if (hasVoted) {
      setErrorMessage("You have already voted on this question.");
      return;
    }

    setIsSubmitting(true);
    setErrorMessage(null);

    try {
      const res = await submitPollVote(
        question.id,
        selectedOption,
        {
          uid: currentUser.uid || currentUser.id,
          name: currentUser.name || "Marwadi Student",
          email: currentUser.email,
          department: currentUser.department,
          semester: currentUser.semester
        }
      );

      setQuestion(res.updatedQuestion);
      setStudentVote(res.voteRecord);
      setHasVoted(true);
      if (onVoteSuccess) {
        onVoteSuccess(res.updatedQuestion, res.voteRecord);
      }
    } catch (err: any) {
      setErrorMessage(err.message || "Failed to submit answer. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Real-time Countdown Timer for Closes At
  const [countdownText, setCountdownText] = useState("");

  useEffect(() => {
    const calculateCountdown = () => {
      let targetDate = question.closingTimestamp || question.submissionDeadline;
      let target = targetDate ? new Date(targetDate).getTime() : 0;
      if (isNaN(target) || target <= 0) {
        const endOfToday = new Date();
        endOfToday.setHours(23, 59, 59, 999);
        target = endOfToday.getTime();
      }

      const diff = target - Date.now();
      if (diff <= 0) {
        setCountdownText("Poll Closed");
        return;
      }

      const hours = Math.floor(diff / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diff % (1000 * 60)) / 1000);

      const pad = (n: number) => String(n).padStart(2, "0");
      setCountdownText(`${pad(hours)}h ${pad(minutes)}m ${pad(seconds)}s remaining`);
    };

    calculateCountdown();
    const timer = setInterval(calculateCountdown, 1000);
    return () => clearInterval(timer);
  }, [question.closingTimestamp, question.submissionDeadline]);

  return (
    <div className="w-full max-w-3xl mx-auto">
      {/* White Poll Card */}
      <div className="bg-white border border-neutral-200/90 rounded-2xl sm:rounded-3xl p-6 sm:p-10 shadow-sm transition-all relative overflow-hidden">
        
        {/* Top Header Metadata Row */}
        <div className="flex flex-wrap items-center justify-between gap-3 pb-5 mb-6 border-b border-neutral-100 text-xs sm:text-sm">
          <div className="flex flex-wrap items-center gap-2 sm:gap-2.5">
            {/* Poll Status: Active / Closed */}
            {!isPollClosed ? (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full font-bold uppercase tracking-wider bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span>Active Poll</span>
              </span>
            ) : (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full font-bold uppercase tracking-wider bg-neutral-100 text-neutral-600 border border-neutral-200 text-xs">
                <span className="w-2 h-2 rounded-full bg-neutral-400" />
                <span>Closed Poll</span>
              </span>
            )}

            {/* Category / Topic */}
            <span className="px-3 py-1 rounded-full font-bold uppercase tracking-wider bg-blue-50 text-blue-700 border border-blue-200 text-xs">
              {question.category || question.topic || "Computer Science"}
            </span>

            {/* Difficulty */}
            <span className={cn(
              "px-3 py-1 rounded-full font-bold uppercase tracking-wider text-xs border",
              question.difficulty === "Easy" ? "bg-emerald-50 text-emerald-700 border-emerald-200" :
              question.difficulty === "Medium" ? "bg-amber-50 text-amber-700 border-amber-200" :
              "bg-rose-50 text-rose-700 border-rose-200"
            )}>
              {question.difficulty}
            </span>
          </div>

          <div className="flex items-center gap-2 font-bold text-xs sm:text-sm text-amber-700 bg-amber-50 px-3 py-1 rounded-full border border-amber-200">
            <Award className="w-4 h-4 text-amber-500 shrink-0" />
            <span>+{question.xp || 50} XP</span>
          </div>
        </div>

        {/* 1. Question Title */}
        <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-neutral-900 leading-snug tracking-tight mb-2.5">
          {question.title}
        </h2>

        {/* 2. Small description or instruction below the question */}
        {question.description && (
          <p className="text-sm sm:text-base text-neutral-600 leading-relaxed font-normal mb-7">
            {question.description}
          </p>
        )}

        {/* Error message if validation fails */}
        {errorMessage && (
          <div className="mb-6 p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs sm:text-sm font-semibold flex items-center gap-2">
            <XCircle className="w-4 h-4 shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* 3. Multiple-Choice Answer Options (A, B, C, D) */}
        <div className="space-y-3.5 my-6">
          {question.options.map((option) => {
            const votes = option.votes || 0;
            const percentage = totalVotes > 0 ? Math.round((votes / totalVotes) * 100) : 0;
            const isSelected = selectedOption === option.id;
            const isCorrect = question.correctOption === option.id;
            const isStudentSelection = studentVote?.selectedOption === option.id;

            // STATE 1: REVEAL RESULTS (Student has voted OR poll is closed)
            if (hasVoted || isPollClosed) {
              return (
                <div
                  key={option.id}
                  className={cn(
                    "w-full rounded-xl border relative overflow-hidden p-4 sm:p-4.5 flex items-center justify-between transition-all duration-300",
                    isCorrect
                      ? "border-emerald-500 bg-emerald-50/50"
                      : isStudentSelection
                      ? "border-rose-500 bg-rose-50/50"
                      : "border-slate-200 bg-slate-50"
                  )}
                >
                  {/* Horizontal percentage bar */}
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${percentage}%` }}
                    transition={{ duration: 0.6, ease: "easeOut" }}
                    className={cn(
                      "absolute top-0 bottom-0 left-0 opacity-25 pointer-events-none rounded-xl",
                      isCorrect
                        ? "bg-emerald-400"
                        : isStudentSelection
                        ? "bg-rose-400"
                        : "bg-blue-300"
                    )}
                  />

                  {/* Option Content overlay */}
                  <div className="relative z-10 flex items-center space-x-3.5 pr-4 flex-1">
                    {/* Status Icon */}
                    {isCorrect ? (
                      <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                    ) : isStudentSelection ? (
                      <XCircle className="w-5 h-5 text-rose-600 shrink-0" />
                    ) : (
                      <div className="w-5 h-5 rounded-full bg-slate-200 text-slate-700 font-bold text-xs flex items-center justify-center shrink-0">
                        {option.id}
                      </div>
                    )}

                    <div className="flex flex-wrap items-center gap-2">
                      <span className={cn(
                        "text-sm sm:text-base font-semibold leading-snug",
                        isCorrect ? "text-emerald-950" :
                        isStudentSelection ? "text-rose-950" :
                        "text-slate-800"
                      )}>
                        {option.text}
                      </span>

                      {/* Badges for Correct Answer and Student's Choice */}
                      {isCorrect && (
                        <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-extrabold uppercase bg-emerald-600 text-white shadow-xs">
                          Correct Answer
                        </span>
                      )}
                      {isStudentSelection && !isCorrect && (
                        <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-extrabold uppercase bg-rose-600 text-white shadow-xs">
                          Your Answer
                        </span>
                      )}
                      {isStudentSelection && isCorrect && (
                        <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-extrabold uppercase bg-blue-600 text-white shadow-xs">
                          Your Answer
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Percentage and Vote Count */}
                  <div className="relative z-10 font-bold text-sm sm:text-base text-slate-900 shrink-0 ml-4">
                    <span>{percentage}%</span>
                    {uniqueCount > 0 && (
                      <span className="hidden sm:inline text-xs text-slate-500 font-medium ml-1.5">
                        ({votes} {votes === 1 ? "vote" : "votes"})
                      </span>
                    )}
                  </div>
                </div>
              );
            }

            // STATE 2: INTERACTIVE VOTING (Before submission)
            return (
              <div
                key={option.id}
                onClick={() => handleOptionClick(option.id)}
                className={cn(
                  "w-full p-4 sm:p-4.5 rounded-xl border text-left transition-all duration-200 flex items-center justify-between cursor-pointer select-none group",
                  isSelected
                    ? "border-2 border-blue-600 bg-blue-50/80 text-blue-950 shadow-xs"
                    : "bg-slate-50 hover:bg-slate-100 border-slate-200/90 text-slate-900"
                )}
              >
                <div className="flex items-center space-x-3.5 flex-1 pr-3">
                  {/* Radio Selection for Students */}
                  <div
                    className={cn(
                      "w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 transition-colors",
                      isSelected
                        ? "border-blue-600 bg-blue-600 text-white"
                        : "border-slate-400 group-hover:border-slate-600"
                    )}
                  >
                    {isSelected && <div className="w-2 h-2 rounded-full bg-white" />}
                  </div>

                  <span className={cn(
                    "font-bold text-xs sm:text-sm mr-1 shrink-0",
                    isSelected ? "text-blue-700" : "text-slate-500"
                  )}>
                    {option.id}.
                  </span>

                  <span className={cn(
                    "text-sm sm:text-base font-medium leading-snug",
                    isSelected ? "font-semibold text-blue-950" : "text-slate-800"
                  )}>
                    {option.text}
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        {/* 6. Clearly Visible Submit Answer Button & Feedback */}
        {!hasVoted && !isPollClosed && (
          <div className="pt-2">
            {isAuthenticated ? (
              <button
                onClick={handleVoteSubmit}
                disabled={!selectedOption || isSubmitting}
                className={cn(
                  "w-full sm:w-auto px-8 py-3.5 bg-blue-600 hover:bg-blue-700 active:scale-[0.99] text-white font-bold text-sm sm:text-base rounded-xl transition-all shadow-md cursor-pointer flex items-center justify-center space-x-2",
                  (!selectedOption || isSubmitting) && "opacity-50 cursor-not-allowed hover:bg-blue-600"
                )}
              >
                <span>{isSubmitting ? "Evaluating & Submitting..." : "Submit Answer"}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            ) : (
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-xl bg-slate-50 border border-slate-200">
                <div className="text-xs sm:text-sm text-slate-600 font-medium">
                  🔒 Students must log in to submit responses and earn points.
                </div>
                <button
                  onClick={onOpenAuth}
                  className="px-6 py-2.5 bg-slate-900 hover:bg-black text-white text-xs sm:text-sm font-bold uppercase tracking-wider rounded-xl transition-all shadow-sm cursor-pointer flex items-center justify-center space-x-2 shrink-0"
                >
                  <Lock className="w-3.5 h-3.5" />
                  <span>Log in to Vote</span>
                </button>
              </div>
            )}
          </div>
        )}

        {/* AFTER SUBMISSION: Feedback Banner & Explanation */}
        {hasVoted && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="pt-2"
          >
            {/* Feedback: Correct or Incorrect */}
            {studentVote?.isCorrect ? (
              <div className="p-4 sm:p-5 bg-emerald-50 border border-emerald-200 text-emerald-950 rounded-xl flex items-start gap-3.5">
                <CheckCircle2 className="w-6 h-6 text-emerald-600 shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-bold text-base sm:text-lg">Correct Answer!</h4>
                  <p className="text-xs sm:text-sm text-emerald-800 mt-0.5 leading-relaxed">
                    Well done! You correctly chose Option {studentVote.selectedOption} and earned <strong className="font-extrabold text-emerald-900">+{question.xp || 50} XP</strong> on the real-time student leaderboard.
                  </p>
                </div>
              </div>
            ) : (
              <div className="p-4 sm:p-5 bg-rose-50 border border-rose-200 text-rose-950 rounded-xl flex items-start gap-3.5">
                <XCircle className="w-6 h-6 text-rose-600 shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-bold text-base sm:text-lg">Incorrect Answer</h4>
                  <p className="text-xs sm:text-sm text-rose-800 mt-0.5 leading-relaxed">
                    You selected Option {studentVote?.selectedOption || selectedOption}. The correct answer is <strong className="font-extrabold text-rose-900">Option {question.correctOption}</strong>. Review the explanation below to understand why.
                  </p>
                </div>
              </div>
            )}

            {/* Explanation Breakdown Card */}
            {question.explanation && (
              <div className="mt-4 p-5 bg-slate-50 border border-slate-200 rounded-xl">
                <div className="flex items-center space-x-2 text-xs sm:text-sm font-bold uppercase tracking-wider text-slate-800 mb-2">
                  <HelpCircle className="w-4 h-4 text-blue-600" />
                  <span>Detailed Explanation & Concept Breakdown</span>
                </div>
                <p className="text-sm sm:text-base text-slate-700 leading-relaxed font-normal">
                  {question.explanation}
                </p>
              </div>
            )}
          </motion.div>
        )}

        {/* Poll Closing Date, Time & Countdown Timer ONLY */}
        <div className="mt-8 pt-5 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3 text-xs sm:text-sm text-slate-600 font-medium">
          <div className="flex items-center space-x-2">
            <Clock className="w-4 h-4 text-rose-500 shrink-0" />
            <span>
              <strong className="text-slate-900 font-bold uppercase tracking-wider mr-1">Closes At:</strong>
              <span className="font-semibold text-slate-800">
                {question.closingTimestamp || question.submissionDeadline || "Tomorrow, 11:59 PM IST"}
              </span>
            </span>
          </div>

          <div className="flex items-center space-x-2 font-mono text-xs font-bold text-rose-600 bg-rose-50 px-3.5 py-1.5 rounded-full border border-rose-200">
            <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse" />
            <span>{countdownText}</span>
          </div>
        </div>

      </div>
    </div>
  );
}
