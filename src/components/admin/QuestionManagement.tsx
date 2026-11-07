import React, { useState, useEffect, useMemo, useRef } from "react";
import { 
  Plus, Search, Filter, Calendar as CalendarIcon, Clock, Trash2, Edit2, 
  CheckCircle2, XCircle, AlertCircle, Save, Sparkles, Terminal, BookOpen, 
  Layers, Shield, Eye, ArrowUpDown, ChevronLeft, ChevronRight, Check,
  BarChart3, Users, Download, HelpCircle, ArrowRight, RefreshCw,
  Send, Award, Lock, ExternalLink
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { cn } from "@/src/lib/utils";
import { 
  getFirebaseChallenges, 
  saveFirebaseChallenge, 
  deleteFirebaseChallenge, 
  getFirebaseSubmissions 
} from "@/src/services/firebaseDb";

export interface PollOptionItem {
  id: string; // "A", "B", "C", "D", "E", ...
  text: string;
  votes: number;
}

export interface AdminPollQuestion {
  id: string;
  title: string;
  description: string;
  difficulty: "Easy" | "Medium" | "Hard";
  topic: string;
  category?: string;
  language?: string;
  status: "Draft" | "Scheduled" | "Live" | "Expired" | "Archived";
  pollStatus?: "Active" | "Closed";
  publishedTimestamp: string;
  closingTimestamp: string;
  submissionDeadline?: string;
  xp: number;
  totalVotes: number;
  options: PollOptionItem[];
  correctOption: string;
  explanation: string;
  problemStatement?: string;
  acceptance?: string;
}

// Preset popular topics for fast selection
const PRESET_TOPICS = [
  "Python & Data Structures",
  "Algorithms & Complexity",
  "Database Management Systems (DBMS)",
  "Operating Systems & Linux",
  "Computer Networks",
  "Object-Oriented Programming (Java/C++)",
  "Web Architecture & JavaScript",
  "System Design & Cloud Computing",
  "Artificial Intelligence & Machine Learning"
];

// Helper: Format any date into clear Indian Standard Time (IST)
export const formatToIST = (dateInput: string | Date | undefined): string => {
  if (!dateInput) return "N/A";
  try {
    const d = new Date(dateInput);
    if (isNaN(d.getTime())) return String(dateInput);
    return d.toLocaleString("en-IN", {
      timeZone: "Asia/Kolkata",
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: true
    }) + " IST";
  } catch {
    return String(dateInput);
  }
};

// Helper: Format for datetime-local input (YYYY-MM-DDTHH:mm in IST approximation)
const formatForInput = (d: Date): string => {
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
};

export default function QuestionManagement() {
  const [challenges, setChallenges] = useState<AdminPollQuestion[]>([]);
  const [submissions, setSubmissions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("All");
  const [difficultyFilter, setDifficultyFilter] = useState<string>("All");
  const [topicFilter, setTopicFilter] = useState<string>("All");
  const [viewMode, setViewMode] = useState<"list" | "calendar">("list");
  
  // Modals
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [resultsModalQuestion, setResultsModalQuestion] = useState<AdminPollQuestion | null>(null);
  const [participationModalQuestion, setParticipationModalQuestion] = useState<AdminPollQuestion | null>(null);
  const [participationSearch, setParticipationSearch] = useState("");
  
  // Status banner / auto-scheduler ticker
  const [autoSchedulerNotice, setAutoSchedulerNotice] = useState<string | null>(null);
  const [currentCalendarDate, setCurrentCalendarDate] = useState(new Date());

  // Form State supporting 4 or more dynamic options
  const [formId, setFormId] = useState("");
  const [formTitle, setFormTitle] = useState("");
  const [formDescription, setFormDescription] = useState("");
  const [formDifficulty, setFormDifficulty] = useState<"Easy" | "Medium" | "Hard">("Medium");
  const [formTopic, setFormTopic] = useState("Python & Data Structures");
  const [formCustomTopic, setFormCustomTopic] = useState("");
  const [formXp, setFormXp] = useState(50);
  const [formPublishedTimestamp, setFormPublishedTimestamp] = useState("");
  const [formClosingTimestamp, setFormClosingTimestamp] = useState("");
  const [formStatus, setFormStatus] = useState<"Draft" | "Scheduled" | "Live" | "Expired" | "Archived">("Draft");
  const [formOptions, setFormOptions] = useState<Array<{ id: string; text: string }>>([
    { id: "A", text: "" },
    { id: "B", text: "" },
    { id: "C", text: "" },
    { id: "D", text: "" }
  ]);
  const [formCorrectOption, setFormCorrectOption] = useState("A");
  const [formExplanation, setFormExplanation] = useState("");
  const [formError, setFormError] = useState<string | null>(null);
  const [formSaving, setFormSaving] = useState(false);

  // Load challenges and submissions from Firestore
  const loadData = async () => {
    setLoading(true);
    try {
      const chalData = await getFirebaseChallenges();
      const mapped = (chalData || []).map((c: any) => ({
        ...c,
        totalVotes: c.totalVotes ?? (c.options?.reduce((acc: number, curr: any) => acc + (curr.votes || 0), 0) || 0),
        options: c.options && c.options.length > 0 ? c.options : [
          { id: "A", text: "Option A", votes: 0 },
          { id: "B", text: "Option B", votes: 0 },
          { id: "C", text: "Option C", votes: 0 },
          { id: "D", text: "Option D", votes: 0 }
        ]
      }));
      setChallenges(mapped);

      // Check and automatically publish scheduled questions whose time has arrived
      await checkAndAutoPublish(mapped);

      const subData = await getFirebaseSubmissions();
      setSubmissions(subData || []);
    } catch (err) {
      console.error("Failed to load admin poll data:", err);
    } finally {
      setLoading(false);
    }
  };

  // Automatically publish scheduled questions according to timestamp
  const checkAndAutoPublish = async (list: AdminPollQuestion[]) => {
    const now = new Date();
    let publishedCount = 0;
    let closedCount = 0;

    for (const q of list) {
      // 1. Auto-publish if scheduled time has passed
      if (q.status === "Scheduled" && q.publishedTimestamp) {
        const pubDate = new Date(q.publishedTimestamp);
        if (!isNaN(pubDate.getTime()) && pubDate <= now) {
          const updated: AdminPollQuestion = {
            ...q,
            status: "Live",
            pollStatus: "Active"
          };
          await saveFirebaseChallenge(q.id, updated);
          publishedCount++;
        }
      }

      // 2. Auto-close if closing time has passed
      if ((q.status === "Live" || q.pollStatus === "Active") && q.closingTimestamp) {
        const closeDate = new Date(q.closingTimestamp);
        if (!isNaN(closeDate.getTime()) && closeDate <= now) {
          const updated: AdminPollQuestion = {
            ...q,
            status: "Expired",
            pollStatus: "Closed"
          };
          await saveFirebaseChallenge(q.id, updated);
          closedCount++;
        }
      }
    }

    if (publishedCount > 0 || closedCount > 0) {
      setAutoSchedulerNotice(
        `Auto-scheduler triggered: ${publishedCount} question(s) went Live, ${closedCount} poll(s) closed automatically.`
      );
      // Reload updated challenges
      const refreshed = await getFirebaseChallenges();
      if (refreshed) setChallenges(refreshed);
    }
  };

  useEffect(() => {
    loadData();

    // Periodic check every 30 seconds for automatic publishing
    const interval = setInterval(() => {
      setChallenges((currentList) => {
        checkAndAutoPublish(currentList);
        return currentList;
      });
    }, 30000);

    return () => clearInterval(interval);
  }, []);

  // Open Create Modal
  const handleOpenCreateModal = () => {
    setIsEditing(false);
    setFormError(null);
    const generatedId = `POLL-${new Date().getFullYear()}-${Math.floor(100 + Math.random() * 900)}`;
    const now = new Date();
    const tomorrow = new Date(now.getTime() + 24 * 60 * 60 * 1000);

    setFormId(generatedId);
    setFormTitle("");
    setFormDescription("");
    setFormDifficulty("Medium");
    setFormTopic("Python & Data Structures");
    setFormCustomTopic("");
    setFormXp(50);
    setFormPublishedTimestamp(formatForInput(now));
    setFormClosingTimestamp(formatForInput(tomorrow));
    setFormStatus("Draft");
    setFormOptions([
      { id: "A", text: "" },
      { id: "B", text: "" },
      { id: "C", text: "" },
      { id: "D", text: "" }
    ]);
    setFormCorrectOption("A");
    setFormExplanation("");
    setIsFormModalOpen(true);
  };

  // Open Edit Modal for unpublished/draft questions
  const handleOpenEditModal = (chal: AdminPollQuestion) => {
    setIsEditing(true);
    setFormError(null);
    setFormId(chal.id);
    setFormTitle(chal.title || "");
    setFormDescription(chal.description || chal.problemStatement || "");
    setFormDifficulty(chal.difficulty || "Medium");
    
    if (PRESET_TOPICS.includes(chal.topic)) {
      setFormTopic(chal.topic);
      setFormCustomTopic("");
    } else {
      setFormTopic("Custom");
      setFormCustomTopic(chal.topic || "");
    }

    setFormXp(chal.xp || 50);

    // Parse published and closing timestamps
    try {
      setFormPublishedTimestamp(chal.publishedTimestamp ? formatForInput(new Date(chal.publishedTimestamp)) : formatForInput(new Date()));
    } catch {
      setFormPublishedTimestamp(formatForInput(new Date()));
    }

    try {
      setFormClosingTimestamp(chal.closingTimestamp ? formatForInput(new Date(chal.closingTimestamp)) : formatForInput(new Date(Date.now() + 86400000)));
    } catch {
      setFormClosingTimestamp(formatForInput(new Date(Date.now() + 86400000)));
    }

    setFormStatus(chal.status || "Draft");

    // Dynamic options
    if (chal.options && chal.options.length >= 4) {
      setFormOptions(chal.options.map(o => ({ id: o.id, text: o.text || "" })));
    } else {
      setFormOptions([
        { id: "A", text: "" },
        { id: "B", text: "" },
        { id: "C", text: "" },
        { id: "D", text: "" }
      ]);
    }

    setFormCorrectOption(chal.correctOption || "A");
    setFormExplanation(chal.explanation || "");
    setIsFormModalOpen(true);
  };

  // Add dynamic answer option (E, F, G...)
  const handleAddOption = () => {
    const nextChar = String.fromCharCode(65 + formOptions.length); // 65 = 'A'
    setFormOptions([...formOptions, { id: nextChar, text: "" }]);
  };

  // Remove an option (minimum 4 options preserved)
  const handleRemoveOption = (indexToRemove: number) => {
    if (formOptions.length <= 4) {
      alert("A daily MCQ poll must contain at least four answer options.");
      return;
    }
    const updated = formOptions.filter((_, i) => i !== indexToRemove).map((opt, idx) => ({
      ...opt,
      id: String.fromCharCode(65 + idx) // Re-index as A, B, C, D...
    }));
    setFormOptions(updated);
    // If deleted option was the correct one, reset correctOption to 'A'
    if (!updated.some(o => o.id === formCorrectOption)) {
      setFormCorrectOption("A");
    }
  };

  // Update option text
  const handleOptionTextChange = (index: number, text: string) => {
    const updated = [...formOptions];
    updated[index].text = text;
    setFormOptions(updated);
  };

  // Save / Submit Form
  const handleSaveForm = async (targetStatus?: "Draft" | "Scheduled" | "Live") => {
    setFormError(null);

    // Validation
    if (!formTitle.trim()) {
      setFormError("Question Title is required.");
      return;
    }
    if (!formDescription.trim()) {
      setFormError("Question Description / Instruction is required.");
      return;
    }
    if (formOptions.length < 4) {
      setFormError("A minimum of four answer options (A, B, C, D) is required.");
      return;
    }
    for (let i = 0; i < formOptions.length; i++) {
      if (!formOptions[i].text.trim()) {
        setFormError(`Option ${formOptions[i].id} cannot be empty.`);
        return;
      }
    }
    if (!formExplanation.trim()) {
      setFormError("Please provide a concept breakdown and explanation for the correct answer.");
      return;
    }

    const finalTopic = formTopic === "Custom" ? formCustomTopic.trim() || "Computer Science" : formTopic;
    const finalStatus = targetStatus || formStatus;

    // Check scheduling validation
    if (finalStatus === "Scheduled" && !formPublishedTimestamp) {
      setFormError("Please select a future publishing timestamp to schedule this question.");
      return;
    }

    setFormSaving(true);

    try {
      const existing = challenges.find(c => c.id === formId);

      // Preserve existing votes if editing, else initialize to 0
      const formattedOptions: PollOptionItem[] = formOptions.map((opt) => {
        const prevOpt = existing?.options?.find(o => o.id === opt.id);
        return {
          id: opt.id,
          text: opt.text.trim(),
          votes: prevOpt?.votes || 0
        };
      });

      const totalVotes = formattedOptions.reduce((acc, curr) => acc + (curr.votes || 0), 0);

      const payload: AdminPollQuestion = {
        id: formId.trim() || `POLL-${Date.now()}`,
        title: formTitle.trim(),
        description: formDescription.trim(),
        problemStatement: formDescription.trim(),
        difficulty: formDifficulty,
        topic: finalTopic,
        category: finalTopic,
        xp: formXp || 50,
        status: finalStatus,
        pollStatus: finalStatus === "Live" ? "Active" : finalStatus === "Expired" || finalStatus === "Archived" ? "Closed" : "Active",
        publishedTimestamp: formPublishedTimestamp ? new Date(formPublishedTimestamp).toISOString() : new Date().toISOString(),
        closingTimestamp: formClosingTimestamp ? new Date(formClosingTimestamp).toISOString() : new Date(Date.now() + 86400000).toISOString(),
        submissionDeadline: formClosingTimestamp ? new Date(formClosingTimestamp).toISOString() : new Date(Date.now() + 86400000).toISOString(),
        options: formattedOptions,
        correctOption: formCorrectOption,
        explanation: formExplanation.trim(),
        totalVotes,
        acceptance: "100%"
      };

      await saveFirebaseChallenge(payload.id, payload);

      setIsFormModalOpen(false);
      loadData();
    } catch (err: any) {
      setFormError(err.message || "Failed to save question to Firestore.");
    } finally {
      setFormSaving(false);
    }
  };

  // Immediate Publish Action
  const handlePublishImmediately = async (chal: AdminPollQuestion) => {
    if (confirm(`Publish "${chal.title}" immediately to the Live arena?`)) {
      const nowIso = new Date().toISOString();
      const updated: AdminPollQuestion = {
        ...chal,
        status: "Live",
        pollStatus: "Active",
        publishedTimestamp: nowIso
      };
      await saveFirebaseChallenge(chal.id, updated);
      loadData();
    }
  };

  // Delete question (restricted to Draft or Scheduled questions)
  const handleDeleteQuestion = async (chal: AdminPollQuestion) => {
    if (chal.status === "Live") {
      alert("Active Live questions cannot be deleted while voting is ongoing. Please expire or archive the question first.");
      return;
    }
    if (confirm(`Permanently delete question [${chal.id}] "${chal.title}"?`)) {
      await deleteFirebaseChallenge(chal.id);
      loadData();
    }
  };

  // Filtered Questions List
  const filteredChallenges = useMemo(() => {
    return challenges.filter(c => {
      const matchStatus = statusFilter === "All" || c.status === statusFilter;
      const matchDiff = difficultyFilter === "All" || c.difficulty === difficultyFilter;
      const matchTopic = topicFilter === "All" || c.topic === topicFilter;
      const matchSearch = 
        c.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
        c.id.toLowerCase().includes(searchQuery.toLowerCase()) || 
        c.topic.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.options.some(o => o.text.toLowerCase().includes(searchQuery.toLowerCase()));
      return matchStatus && matchDiff && matchTopic && matchSearch;
    });
  }, [challenges, statusFilter, difficultyFilter, topicFilter, searchQuery]);

  // Participation records for selected question
  const questionSubmissions = useMemo(() => {
    if (!participationModalQuestion) return [];
    const list = submissions.filter(s => s.challengeId === participationModalQuestion.id);
    if (!participationSearch) return list;
    const q = participationSearch.toLowerCase();
    return list.filter(s => 
      (s.userName || "").toLowerCase().includes(q) ||
      (s.userEmail || "").toLowerCase().includes(q) ||
      (s.selectedOption || "").toLowerCase().includes(q)
    );
  }, [participationModalQuestion, submissions, participationSearch]);

  // Export Question Participation to CSV
  const exportQuestionParticipationCSV = (question: AdminPollQuestion) => {
    const records = submissions.filter(s => s.challengeId === question.id);
    const headers = ["Submission ID", "Student Name", "Email", "Department", "Selected Option", "Verdict", "Points", "Timestamp (IST)"];
    const rows = records.map(r => [
      `"${r.id || ''}"`,
      `"${r.userName || 'Student'}"`,
      `"${r.userEmail || ''}"`,
      `"${r.department || 'CSE'}"`,
      `"Option ${r.selectedOption || ''}"`,
      `"${r.isCorrect ? 'Correct (Accepted)' : 'Incorrect'}"`,
      `"${r.pointsEarned || 0}"`,
      `"${r.submittedAt || ''}"`
    ]);

    const csvContent = [headers.join(","), ...rows.map(e => e.join(","))].join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", `participation_${question.id}_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-8 select-none font-sans">
      
      {/* Top Banner & Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 border-b border-white/10 pb-6">
        <div>
          <div className="flex items-center space-x-2 text-xs sm:text-sm font-bold uppercase tracking-wider text-emerald-400">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
            <span>DAILY MCQ POLL ADMINISTRATION · INDIAN STANDARD TIME (IST)</span>
          </div>
          <h2 className="text-2xl sm:text-4xl font-black mt-1 text-white uppercase tracking-tight">
            Daily MCQ Poll Management
          </h2>
          <p className="text-sm sm:text-base text-neutral-300 mt-1 max-w-3xl leading-relaxed">
            Create, schedule, publish, and audit daily multiple-choice poll questions. View answer-wise percentage distributions and real-time student participation records synced to Firebase Firestore.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <div className="flex bg-neutral-900 border border-white/10 p-1.5 rounded-xl">
            <button
              onClick={() => setViewMode("list")}
              className={cn(
                "px-4 py-2 rounded-lg text-xs sm:text-sm font-bold uppercase tracking-wider transition-colors cursor-pointer",
                viewMode === "list" ? "bg-[#00ff88] text-black font-extrabold shadow-sm" : "text-neutral-300 hover:text-white"
              )}
            >
              List View
            </button>
            <button
              onClick={() => setViewMode("calendar")}
              className={cn(
                "px-4 py-2 rounded-lg text-xs sm:text-sm font-bold uppercase tracking-wider transition-colors cursor-pointer",
                viewMode === "calendar" ? "bg-[#00ff88] text-black font-extrabold shadow-sm" : "text-neutral-300 hover:text-white"
              )}
            >
              Calendar Schedule
            </button>
          </div>

          <button
            onClick={handleOpenCreateModal}
            className="px-5 py-2.5 bg-[#00ff88] hover:bg-emerald-300 text-black text-xs sm:text-sm uppercase tracking-wider font-extrabold flex items-center space-x-2 shadow-lg cursor-pointer transition-colors rounded-xl"
          >
            <Plus className="w-4 h-4 stroke-[3]" />
            <span>Create Daily MCQ Poll</span>
          </button>
        </div>
      </div>

      {/* Auto-Scheduler Notice Alert */}
      {autoSchedulerNotice && (
        <div className="p-4 bg-emerald-500/10 border border-emerald-500/30 rounded-2xl flex items-center justify-between text-emerald-300 text-xs sm:text-sm font-semibold">
          <div className="flex items-center space-x-2.5">
            <Clock className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>{autoSchedulerNotice}</span>
          </div>
          <button 
            onClick={() => setAutoSchedulerNotice(null)} 
            className="text-xs uppercase hover:underline cursor-pointer"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Real-time Telemetry Tiles */}
      <div className="grid grid-cols-2 sm:grid-cols-6 gap-4">
        {[
          { label: "Total Polls", count: challenges.length, color: "text-white" },
          { label: "Active Live", count: challenges.filter(c => c.status === "Live" || c.pollStatus === "Active").length, color: "text-[#00ff88]" },
          { label: "Scheduled", count: challenges.filter(c => c.status === "Scheduled").length, color: "text-amber-400" },
          { label: "Drafts", count: challenges.filter(c => c.status === "Draft").length, color: "text-neutral-300" },
          { label: "Closed / Expired", count: challenges.filter(c => c.status === "Expired" || c.status === "Archived").length, color: "text-rose-400" },
          { label: "Total Votes Cast", count: challenges.reduce((s, c) => s + (c.totalVotes || 0), 0), color: "text-cyan-400" }
        ].map((stat, i) => (
          <div key={i} className="p-5 bg-neutral-900/80 border border-white/10 rounded-2xl shadow-sm">
            <div className="text-xs font-bold uppercase tracking-wider text-neutral-300 truncate">{stat.label}</div>
            <div className={cn("text-2xl sm:text-3xl font-extrabold font-mono mt-1.5", stat.color)}>{stat.count}</div>
          </div>
        ))}
      </div>

      {viewMode === "list" ? (
        <>
          {/* Filters & Search Bar */}
          <div className="flex flex-wrap items-center justify-between gap-4 p-4 bg-neutral-900/80 border border-white/10 rounded-2xl">
            <div className="flex flex-wrap items-center gap-3 flex-1">
              <div className="flex items-center px-4 py-2.5 border border-white/15 w-full sm:w-72 bg-black/60 rounded-xl focus-within:border-emerald-400">
                <Search className="w-4 h-4 text-neutral-400 mr-2.5 shrink-0" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search title, ID, topic, option..."
                  className="bg-transparent text-sm w-full focus:outline-none text-white placeholder:text-neutral-400"
                />
              </div>

              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-4 py-2.5 border border-white/15 bg-black/60 text-white font-bold text-xs sm:text-sm uppercase focus:outline-none cursor-pointer rounded-xl"
              >
                <option value="All">All Statuses</option>
                <option value="Live">Live / Active</option>
                <option value="Scheduled">Scheduled</option>
                <option value="Draft">Draft</option>
                <option value="Expired">Expired</option>
                <option value="Archived">Archived</option>
              </select>

              <select
                value={difficultyFilter}
                onChange={(e) => setDifficultyFilter(e.target.value)}
                className="px-4 py-2.5 border border-white/15 bg-black/60 text-white font-bold text-xs sm:text-sm uppercase focus:outline-none cursor-pointer rounded-xl"
              >
                <option value="All">All Difficulties</option>
                <option value="Easy">Easy</option>
                <option value="Medium">Medium</option>
                <option value="Hard">Hard</option>
              </select>

              <select
                value={topicFilter}
                onChange={(e) => setTopicFilter(e.target.value)}
                className="px-4 py-2.5 border border-white/15 bg-black/60 text-white font-bold text-xs sm:text-sm uppercase focus:outline-none cursor-pointer rounded-xl max-w-[220px] truncate"
              >
                <option value="All">All Topics</option>
                {PRESET_TOPICS.map((t, idx) => (
                  <option key={idx} value={t}>{t}</option>
                ))}
              </select>
            </div>

            <div className="text-xs sm:text-sm font-semibold text-neutral-300">
              Showing <span className="text-white font-bold">{filteredChallenges.length}</span> of <span className="text-white font-bold">{challenges.length}</span> polls
            </div>
          </div>

          {/* Questions Table */}
          <div className="bg-neutral-900/80 border border-white/10 rounded-2xl overflow-x-auto shadow-sm">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-white/10 text-xs sm:text-sm font-bold uppercase tracking-wider text-neutral-200 bg-black/60">
                  <th className="py-4 px-6">ID & Question Title</th>
                  <th className="py-4 px-6">Topic & Difficulty</th>
                  <th className="py-4 px-6">Status</th>
                  <th className="py-4 px-6">Total Votes</th>
                  <th className="py-4 px-6">Publish Time (IST)</th>
                  <th className="py-4 px-6">Closing Time (IST)</th>
                  <th className="py-4 px-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/10 font-sans text-sm sm:text-base">
                {filteredChallenges.map((chal) => (
                  <tr key={chal.id} className="hover:bg-white/5 transition-colors">
                    
                    {/* ID & Title */}
                    <td className="py-4 px-6">
                      <div className="font-mono text-xs font-bold text-emerald-400">{chal.id}</div>
                      <div className="font-bold text-white text-base mt-0.5 line-clamp-1">{chal.title}</div>
                      <div className="text-xs text-neutral-400 mt-1 line-clamp-1 font-normal">
                        {chal.options.length} options: {chal.options.map(o => `${o.id}: ${o.text}`).join(" · ")}
                      </div>
                    </td>

                    {/* Topic & Difficulty */}
                    <td className="py-4 px-6">
                      <span className={cn(
                        "px-2.5 py-1 rounded font-bold text-xs uppercase mr-2 inline-block",
                        chal.difficulty === "Easy" ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30" :
                        chal.difficulty === "Medium" ? "bg-amber-500/20 text-amber-300 border border-amber-500/30" :
                        "bg-rose-500/20 text-rose-300 border border-rose-500/30"
                      )}>
                        {chal.difficulty}
                      </span>
                      <span className="text-xs sm:text-sm font-medium text-neutral-300 block mt-1">{chal.topic}</span>
                    </td>

                    {/* Status */}
                    <td className="py-4 px-6">
                      <span className={cn(
                        "px-3 py-1 rounded-lg font-bold uppercase text-xs inline-flex items-center gap-1.5",
                        chal.status === "Live" || chal.pollStatus === "Active" ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/40" :
                        chal.status === "Scheduled" ? "bg-amber-500/20 text-amber-300 border border-amber-500/40" :
                        chal.status === "Draft" ? "bg-neutral-800 text-neutral-300 border border-neutral-700" :
                        "bg-rose-500/20 text-rose-300 border border-rose-500/40"
                      )}>
                        {chal.status === "Live" && <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />}
                        <span>{chal.status}</span>
                      </span>
                    </td>

                    {/* Total Votes */}
                    <td className="py-4 px-6 font-mono">
                      <span className="text-base font-extrabold text-cyan-400">{chal.totalVotes || 0}</span>
                      <span className="text-xs text-neutral-400 block font-normal">participants</span>
                    </td>

                    {/* Publish Time (IST) */}
                    <td className="py-4 px-6 font-mono text-xs sm:text-sm text-neutral-300">
                      {formatToIST(chal.publishedTimestamp)}
                    </td>

                    {/* Closing Time (IST) */}
                    <td className="py-4 px-6 font-mono text-xs sm:text-sm text-neutral-300">
                      {formatToIST(chal.closingTimestamp || chal.submissionDeadline)}
                    </td>

                    {/* Action buttons */}
                    <td className="py-4 px-6 text-right space-x-1.5 whitespace-nowrap">
                      
                      {/* View Results / Percentages */}
                      <button
                        onClick={() => setResultsModalQuestion(chal)}
                        className="p-2 text-cyan-400 hover:text-cyan-300 hover:bg-cyan-500/10 rounded-lg transition-colors cursor-pointer inline-flex items-center"
                        title="View Vote Percentages & Results"
                      >
                        <BarChart3 className="w-4 h-4" />
                      </button>

                      {/* View Student Participation */}
                      <button
                        onClick={() => {
                          setParticipationModalQuestion(chal);
                          setParticipationSearch("");
                        }}
                        className="p-2 text-emerald-400 hover:text-emerald-300 hover:bg-emerald-500/10 rounded-lg transition-colors cursor-pointer inline-flex items-center"
                        title="View Student Participation Records"
                      >
                        <Users className="w-4 h-4" />
                      </button>

                      {/* Publish Now (for Draft or Scheduled) */}
                      {(chal.status === "Draft" || chal.status === "Scheduled") && (
                        <button
                          onClick={() => handlePublishImmediately(chal)}
                          className="px-3 py-1.5 bg-[#00ff88] hover:bg-emerald-300 text-black font-extrabold text-xs uppercase tracking-wider rounded-lg cursor-pointer transition-colors inline-flex items-center space-x-1"
                          title="Publish question immediately"
                        >
                          <Send className="w-3 h-3" />
                          <span>Publish</span>
                        </button>
                      )}

                      {/* Edit Question */}
                      <button
                        onClick={() => handleOpenEditModal(chal)}
                        className="p-2 text-neutral-300 hover:text-emerald-400 transition-colors inline-flex items-center justify-center rounded-lg hover:bg-white/10 cursor-pointer"
                        title="Edit Question"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>

                      {/* Delete Question (Only for Unpublished / Draft / Scheduled) */}
                      {chal.status !== "Live" ? (
                        <button
                          onClick={() => handleDeleteQuestion(chal)}
                          className="p-2 text-rose-400 hover:text-rose-300 transition-colors inline-flex items-center justify-center rounded-lg hover:bg-rose-500/10 cursor-pointer"
                          title="Delete Question"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      ) : (
                        <span 
                          className="p-2 text-neutral-600 cursor-not-allowed inline-flex items-center justify-center"
                          title="Cannot delete Live question while active"
                        >
                          <Lock className="w-4 h-4 opacity-40" />
                        </span>
                      )}

                    </td>
                  </tr>
                ))}

                {filteredChallenges.length === 0 && (
                  <tr>
                    <td colSpan={7} className="py-12 text-center text-neutral-400">
                      <HelpCircle className="w-10 h-10 mx-auto mb-3 opacity-30" />
                      <div className="font-bold text-base text-neutral-300">No questions found matching your filter criteria.</div>
                      <div className="text-xs text-neutral-500 mt-1">Try resetting filters or create a new Daily MCQ Poll above.</div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </>
      ) : (
        /* Monthly Calendar View */
        <div className="bg-neutral-900/80 border border-white/10 rounded-2xl p-6 sm:p-8 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl sm:text-2xl font-black uppercase tracking-tight text-white flex items-center space-x-3">
              <CalendarIcon className="w-6 h-6 text-[#00ff88]" />
              <span>{currentCalendarDate.toLocaleString("en-IN", { month: "long", year: "numeric", timeZone: "Asia/Kolkata" })}</span>
            </h3>
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setCurrentCalendarDate(new Date(currentCalendarDate.getFullYear(), currentCalendarDate.getMonth() - 1, 1))}
                className="p-2.5 border border-white/15 rounded-xl hover:bg-white/10 text-white cursor-pointer"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                onClick={() => setCurrentCalendarDate(new Date())}
                className="px-4 py-2 border border-white/15 rounded-xl text-xs sm:text-sm font-bold uppercase text-white cursor-pointer hover:bg-white/10"
              >
                Today
              </button>
              <button
                onClick={() => setCurrentCalendarDate(new Date(currentCalendarDate.getFullYear(), currentCalendarDate.getMonth() + 1, 1))}
                className="p-2.5 border border-white/15 rounded-xl hover:bg-white/10 text-white cursor-pointer"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          <div className="grid grid-cols-7 gap-2 text-center text-xs sm:text-sm font-bold uppercase tracking-wider text-neutral-300 pb-3 border-b border-white/10">
            <span>SUN</span><span>MON</span><span>TUE</span><span>WED</span><span>THU</span><span>FRI</span><span>SAT</span>
          </div>

          <div className="grid grid-cols-7 gap-2 pt-4">
            {Array.from({ length: 35 }).map((_, idx) => {
              const dayNum = idx - 2;
              const isCurrentMonth = dayNum > 0 && dayNum <= 30;
              const dateMatchStr = `2026-11-${String(dayNum).padStart(2, '0')}`;
              const scheduledOnThisDay = challenges.filter(c => c.publishedTimestamp && c.publishedTimestamp.includes(dateMatchStr));

              return (
                <div
                  key={idx}
                  className={cn(
                    "min-h-[120px] p-3 border rounded-2xl flex flex-col justify-between transition-colors",
                    isCurrentMonth ? "bg-black/60 border-white/15" : "bg-black/20 border-transparent opacity-20"
                  )}
                >
                  <div className="flex items-center justify-between font-mono text-sm">
                    <span className={cn(isCurrentMonth && dayNum === 7 ? "bg-[#00ff88] text-black px-2 py-0.5 rounded-full font-black text-xs" : "font-bold text-neutral-300")}>
                      {isCurrentMonth ? dayNum : ""}
                    </span>
                    {isCurrentMonth && (
                      <button
                        onClick={handleOpenCreateModal}
                        className="text-neutral-400 hover:text-emerald-400 text-sm font-bold cursor-pointer"
                        title="Schedule question for this date"
                      >
                        +
                      </button>
                    )}
                  </div>

                  <div className="space-y-1.5 overflow-y-auto max-h-[85px] mt-2">
                    {scheduledOnThisDay.map(chal => (
                      <div
                        key={chal.id}
                        onClick={() => handleOpenEditModal(chal)}
                        className={cn(
                          "px-2.5 py-1.5 border font-mono text-xs font-semibold truncate rounded-lg cursor-pointer transition-colors",
                          chal.status === "Live" 
                            ? "bg-emerald-500/20 border-emerald-500/40 text-emerald-300 hover:bg-emerald-500/30"
                            : "bg-amber-500/20 border-amber-500/40 text-amber-300 hover:bg-amber-500/30"
                        )}
                        title={`${chal.id}: ${chal.title} (${chal.status})`}
                      >
                        {chal.id}: {chal.title}
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ========================================================
          MODAL 1: CREATE / EDIT QUESTION MODAL (4+ OPTIONS)
          ======================================================== */}
      <AnimatePresence>
        {isFormModalOpen && (
          <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="w-full max-w-4xl max-h-[92vh] overflow-y-auto border border-white/10 bg-[#0c0c0c] text-white shadow-2xl rounded-3xl p-6 sm:p-8 relative"
            >
              <button
                onClick={() => setIsFormModalOpen(false)}
                className="absolute top-6 right-6 w-8 h-8 rounded-full bg-white/10 flex items-center justify-center font-mono text-xs hover:bg-rose-500 hover:text-white transition-colors cursor-pointer"
              >
                ✕
              </button>

              <div className="mb-6">
                <div className="text-xs font-bold uppercase tracking-wider text-emerald-400">ADMIN POLL CREATOR</div>
                <h3 className="text-2xl font-black uppercase text-white mt-1">
                  {isEditing ? `Edit Poll Question: ${formId}` : "Create New Daily MCQ Poll"}
                </h3>
                <p className="text-xs sm:text-sm text-neutral-400 mt-1">
                  Configure question details, define four or more answer options, select the verified answer, and set publishing schedules in IST.
                </p>
              </div>

              {formError && (
                <div className="mb-6 p-4 rounded-xl bg-rose-500/20 border border-rose-500/40 text-rose-300 text-xs sm:text-sm font-semibold flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{formError}</span>
                </div>
              )}

              <div className="space-y-6">
                
                {/* Row 1: ID, Title, Difficulty */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                  <div>
                    <label className="block text-xs sm:text-sm font-bold uppercase tracking-wider text-neutral-200 mb-2">Question ID</label>
                    <input
                      type="text"
                      required
                      value={formId}
                      onChange={(e) => setFormId(e.target.value)}
                      className="w-full px-4 py-3 border border-white/15 bg-neutral-900/90 rounded-xl text-sm sm:text-base font-mono text-white focus:outline-none focus:border-emerald-400"
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-xs sm:text-sm font-bold uppercase tracking-wider text-neutral-200 mb-2">Question Title</label>
                    <input
                      type="text"
                      required
                      value={formTitle}
                      onChange={(e) => setFormTitle(e.target.value)}
                      placeholder="e.g. Time Complexity of Building a Binary Heap"
                      className="w-full px-4 py-3 border border-white/15 bg-neutral-900/90 rounded-xl text-sm sm:text-base font-medium text-white placeholder:text-neutral-500 focus:outline-none focus:border-emerald-400"
                    />
                  </div>
                </div>

                {/* Row 2: Topic, Difficulty, XP, Status */}
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-5">
                  <div>
                    <label className="block text-xs sm:text-sm font-bold uppercase tracking-wider text-neutral-200 mb-2">Topic</label>
                    <select
                      value={formTopic}
                      onChange={(e) => setFormTopic(e.target.value)}
                      className="w-full px-4 py-3 border border-white/15 bg-neutral-900/90 rounded-xl text-xs sm:text-sm font-bold uppercase text-white focus:outline-none focus:border-emerald-400 cursor-pointer"
                    >
                      {PRESET_TOPICS.map((t, idx) => (
                        <option key={idx} value={t} className="bg-neutral-950">{t}</option>
                      ))}
                      <option value="Custom" className="bg-neutral-950">+ Custom Topic</option>
                    </select>
                  </div>

                  {formTopic === "Custom" && (
                    <div className="sm:col-span-2 md:col-span-1">
                      <label className="block text-xs sm:text-sm font-bold uppercase tracking-wider text-neutral-200 mb-2">Custom Topic Name</label>
                      <input
                        type="text"
                        value={formCustomTopic}
                        onChange={(e) => setFormCustomTopic(e.target.value)}
                        placeholder="Enter topic..."
                        className="w-full px-4 py-3 border border-white/15 bg-neutral-900/90 rounded-xl text-sm text-white focus:outline-none focus:border-emerald-400"
                      />
                    </div>
                  )}

                  <div>
                    <label className="block text-xs sm:text-sm font-bold uppercase tracking-wider text-neutral-200 mb-2">Difficulty</label>
                    <select
                      value={formDifficulty}
                      onChange={(e) => setFormDifficulty(e.target.value as any)}
                      className="w-full px-4 py-3 border border-white/15 bg-neutral-900/90 rounded-xl text-xs sm:text-sm font-bold uppercase text-white focus:outline-none focus:border-emerald-400 cursor-pointer"
                    >
                      <option value="Easy" className="bg-neutral-950">Easy</option>
                      <option value="Medium" className="bg-neutral-950">Medium</option>
                      <option value="Hard" className="bg-neutral-950">Hard</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs sm:text-sm font-bold uppercase tracking-wider text-neutral-200 mb-2">XP Reward</label>
                    <input
                      type="number"
                      value={formXp}
                      onChange={(e) => setFormXp(Number(e.target.value))}
                      className="w-full px-4 py-3 border border-white/15 bg-neutral-900/90 rounded-xl text-sm font-mono text-white focus:outline-none focus:border-emerald-400"
                    />
                  </div>

                  <div>
                    <label className="block text-xs sm:text-sm font-bold uppercase tracking-wider text-neutral-200 mb-2">Status</label>
                    <select
                      value={formStatus}
                      onChange={(e) => setFormStatus(e.target.value as any)}
                      className="w-full px-4 py-3 border border-white/15 bg-neutral-900/90 rounded-xl text-xs sm:text-sm font-bold uppercase text-white focus:outline-none focus:border-emerald-400 cursor-pointer"
                    >
                      <option value="Draft" className="bg-neutral-950">Draft (Unpublished)</option>
                      <option value="Scheduled" className="bg-neutral-950">Scheduled</option>
                      <option value="Live" className="bg-neutral-950">Live (Active Now)</option>
                      <option value="Expired" className="bg-neutral-950">Expired / Closed</option>
                      <option value="Archived" className="bg-neutral-950">Archived</option>
                    </select>
                  </div>
                </div>

                {/* Row 3: Timestamps in IST */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5 p-4 rounded-2xl bg-black/40 border border-white/10">
                  <div>
                    <label className="block text-xs sm:text-sm font-bold uppercase tracking-wider text-emerald-400 mb-2">
                      Publishing Timestamp (Indian Standard Time · IST)
                    </label>
                    <input
                      type="datetime-local"
                      value={formPublishedTimestamp}
                      onChange={(e) => setFormPublishedTimestamp(e.target.value)}
                      className="w-full px-4 py-3 border border-white/15 bg-neutral-900/90 rounded-xl text-sm font-mono text-white focus:outline-none focus:border-emerald-400 cursor-pointer"
                    />
                    <span className="text-[11px] text-neutral-400 mt-1 block">
                      Scheduled questions automatically publish when this IST time arrives.
                    </span>
                  </div>

                  <div>
                    <label className="block text-xs sm:text-sm font-bold uppercase tracking-wider text-amber-400 mb-2">
                      Poll Closing Timestamp (Indian Standard Time · IST)
                    </label>
                    <input
                      type="datetime-local"
                      value={formClosingTimestamp}
                      onChange={(e) => setFormClosingTimestamp(e.target.value)}
                      className="w-full px-4 py-3 border border-white/15 bg-neutral-900/90 rounded-xl text-sm font-mono text-white focus:outline-none focus:border-emerald-400 cursor-pointer"
                    />
                    <span className="text-[11px] text-neutral-400 mt-1 block">
                      Poll will lock voting and automatically reveal answers after this deadline.
                    </span>
                  </div>
                </div>

                {/* Row 4: Description / Code snippet */}
                <div>
                  <label className="block text-xs sm:text-sm font-bold uppercase tracking-wider text-neutral-200 mb-2">
                    Question Description / Instruction / Code Snippet
                  </label>
                  <textarea
                    rows={3}
                    required
                    value={formDescription}
                    onChange={(e) => setFormDescription(e.target.value)}
                    placeholder="Provide context, problem statement, or code snippet for students..."
                    className="w-full p-4 border border-white/15 bg-neutral-900/90 rounded-xl text-sm sm:text-base leading-relaxed focus:outline-none focus:border-emerald-400 text-white placeholder:text-neutral-500"
                  />
                </div>

                {/* Row 5: Dynamic Answer Options (4 or more) */}
                <div className="p-5 sm:p-6 bg-neutral-900/90 border border-white/15 rounded-2xl space-y-4">
                  <div className="flex flex-wrap items-center justify-between gap-2 border-b border-white/10 pb-3">
                    <div>
                      <h4 className="text-xs sm:text-sm uppercase font-extrabold tracking-wider text-emerald-400">
                        Answer Options ({formOptions.length} Options Defined)
                      </h4>
                      <p className="text-xs text-neutral-400 mt-0.5">
                        Students see these options as horizontal selectable rows. Add 4 or more options.
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={handleAddOption}
                      className="px-3.5 py-1.5 bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold uppercase tracking-wider rounded-lg transition-colors flex items-center space-x-1.5 cursor-pointer shadow-sm"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Add Option {String.fromCharCode(65 + formOptions.length)}</span>
                    </button>
                  </div>

                  <div className="space-y-3">
                    {formOptions.map((opt, idx) => {
                      const isCorrect = formCorrectOption === opt.id;
                      return (
                        <div 
                          key={opt.id}
                          className={cn(
                            "flex items-center space-x-3 p-3 rounded-xl border transition-all",
                            isCorrect 
                              ? "bg-emerald-500/15 border-emerald-500/50" 
                              : "bg-black/50 border-white/10"
                          )}
                        >
                          {/* Option ID & Correct Selector Toggle */}
                          <button
                            type="button"
                            onClick={() => setFormCorrectOption(opt.id)}
                            className={cn(
                              "w-8 h-8 rounded-lg font-bold text-xs flex items-center justify-center shrink-0 cursor-pointer transition-colors",
                              isCorrect 
                                ? "bg-emerald-400 text-black shadow-md" 
                                : "bg-neutral-800 text-neutral-300 hover:bg-neutral-700"
                            )}
                            title={isCorrect ? "This is the correct answer" : `Click to set Option ${opt.id} as the correct answer`}
                          >
                            {opt.id}
                          </button>

                          {/* Option text input */}
                          <input
                            type="text"
                            required
                            value={opt.text}
                            onChange={(e) => handleOptionTextChange(idx, e.target.value)}
                            placeholder={`Option ${opt.id} answer text...`}
                            className="flex-1 px-4 py-2.5 bg-black/40 border border-white/10 rounded-lg text-sm text-white focus:outline-none focus:border-emerald-400 placeholder:text-neutral-600"
                          />

                          {/* Correct Badge Indicator */}
                          {isCorrect ? (
                            <span className="px-2.5 py-1 rounded bg-emerald-400/20 text-emerald-300 text-xs font-extrabold uppercase shrink-0">
                              Correct Option
                            </span>
                          ) : (
                            <button
                              type="button"
                              onClick={() => setFormCorrectOption(opt.id)}
                              className="px-2.5 py-1 rounded text-neutral-400 hover:text-emerald-400 text-xs font-semibold uppercase shrink-0 cursor-pointer"
                            >
                              Set as Correct
                            </button>
                          )}

                          {/* Delete option button (minimum 4 enforced) */}
                          {formOptions.length > 4 ? (
                            <button
                              type="button"
                              onClick={() => handleRemoveOption(idx)}
                              className="p-2 text-neutral-400 hover:text-rose-400 transition-colors rounded-lg cursor-pointer shrink-0"
                              title={`Remove Option ${opt.id}`}
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          ) : (
                            <span className="p-2 text-neutral-700 shrink-0" title="Minimum 4 options required">
                              <Lock className="w-4 h-4 opacity-30" />
                            </span>
                          )}
                        </div>
                      );
                    })}
                  </div>

                  {/* Summary of Correct Answer */}
                  <div className="pt-2 flex items-center justify-between text-xs sm:text-sm">
                    <span className="text-neutral-400 font-medium">
                      Selected Correct Answer: <strong className="text-emerald-400 font-extrabold font-mono">Option {formCorrectOption}</strong>
                    </span>
                    <span className="text-neutral-500 font-mono">
                      (Minimum 4 options enforced)
                    </span>
                  </div>
                </div>

                {/* Row 6: Detailed Concept Explanation */}
                <div>
                  <label className="block text-xs sm:text-sm font-bold uppercase tracking-wider text-neutral-200 mb-2">
                    Detailed Solution & Concept Explanation
                  </label>
                  <textarea
                    rows={3}
                    required
                    value={formExplanation}
                    onChange={(e) => setFormExplanation(e.target.value)}
                    placeholder="Provide a comprehensive technical breakdown explaining why Option ... is correct. Displayed to students after voting or when the poll closes."
                    className="w-full p-4 border border-white/15 bg-neutral-900/90 rounded-xl text-sm sm:text-base leading-relaxed focus:outline-none focus:border-emerald-400 text-white placeholder:text-neutral-500"
                  />
                </div>

                {/* Form Action Buttons */}
                <div className="flex flex-wrap items-center justify-between gap-3 pt-6 border-t border-white/10">
                  <button
                    type="button"
                    onClick={() => setIsFormModalOpen(false)}
                    className="px-6 py-3 text-xs sm:text-sm font-bold uppercase tracking-wider text-neutral-300 border border-white/15 rounded-xl hover:bg-white/10 cursor-pointer transition-colors"
                  >
                    Cancel
                  </button>

                  <div className="flex flex-wrap items-center gap-2.5">
                    <button
                      type="button"
                      disabled={formSaving}
                      onClick={() => handleSaveForm("Draft")}
                      className="px-5 py-3 bg-neutral-800 hover:bg-neutral-700 text-white text-xs sm:text-sm uppercase tracking-wider font-bold rounded-xl transition-colors cursor-pointer"
                    >
                      Save as Draft
                    </button>

                    <button
                      type="button"
                      disabled={formSaving}
                      onClick={() => handleSaveForm("Scheduled")}
                      className="px-5 py-3 bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/40 text-xs sm:text-sm uppercase tracking-wider font-bold rounded-xl transition-colors cursor-pointer"
                    >
                      Schedule Poll
                    </button>

                    <button
                      type="button"
                      disabled={formSaving}
                      onClick={() => handleSaveForm("Live")}
                      className="px-6 py-3 bg-[#00ff88] hover:bg-emerald-300 text-black text-xs sm:text-sm uppercase tracking-wider font-extrabold rounded-xl transition-all shadow-lg cursor-pointer"
                    >
                      {formSaving ? "Saving..." : "Publish Immediately"}
                    </button>
                  </div>
                </div>

              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ========================================================
          MODAL 2: VOTE PERCENTAGES & RESULTS MODAL
          ======================================================== */}
      <AnimatePresence>
        {resultsModalQuestion && (
          <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="w-full max-w-2xl border border-white/10 bg-[#0c0c0c] text-white shadow-2xl rounded-3xl p-6 sm:p-8 relative"
            >
              <button
                onClick={() => setResultsModalQuestion(null)}
                className="absolute top-6 right-6 w-8 h-8 rounded-full bg-white/10 flex items-center justify-center font-mono text-xs hover:bg-rose-500 hover:text-white transition-colors cursor-pointer"
              >
                ✕
              </button>

              <div className="mb-6">
                <div className="flex items-center space-x-2 text-xs font-bold uppercase tracking-wider text-cyan-400">
                  <BarChart3 className="w-4 h-4" />
                  <span>POLL VOTE DISTRIBUTION & REAL-TIME PERCENTAGES</span>
                </div>
                <h3 className="text-2xl font-black text-white mt-1">
                  {resultsModalQuestion.title}
                </h3>
                <div className="text-xs sm:text-sm text-neutral-400 mt-1 flex flex-wrap items-center gap-3">
                  <span>ID: <strong className="font-mono text-white">{resultsModalQuestion.id}</strong></span>
                  <span>·</span>
                  <span>Total Votes: <strong className="text-cyan-400 font-bold">{resultsModalQuestion.totalVotes || 0} students</strong></span>
                  <span>·</span>
                  <span>Status: <strong className="text-emerald-400 font-bold uppercase">{resultsModalQuestion.status}</strong></span>
                </div>
              </div>

              {/* Options with horizontal percentage bars */}
              <div className="space-y-4 my-6">
                {resultsModalQuestion.options.map((opt) => {
                  const votes = opt.votes || 0;
                  const total = resultsModalQuestion.totalVotes || 0;
                  const pct = total > 0 ? Math.round((votes / total) * 100) : 0;
                  const isCorrect = resultsModalQuestion.correctOption === opt.id;

                  return (
                    <div
                      key={opt.id}
                      className={cn(
                        "p-4 rounded-xl border relative overflow-hidden flex items-center justify-between",
                        isCorrect ? "border-emerald-500/50 bg-emerald-500/10" : "border-white/10 bg-black/40"
                      )}
                    >
                      {/* Animated percentage background */}
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${pct}%` }}
                        transition={{ duration: 0.6 }}
                        className={cn(
                          "absolute top-0 bottom-0 left-0 opacity-20 pointer-events-none rounded-xl",
                          isCorrect ? "bg-emerald-400" : "bg-cyan-500"
                        )}
                      />

                      <div className="relative z-10 flex items-center space-x-3 flex-1 pr-4">
                        <span className={cn(
                          "w-7 h-7 rounded-lg font-mono font-bold text-xs flex items-center justify-center shrink-0",
                          isCorrect ? "bg-emerald-400 text-black" : "bg-neutral-800 text-white"
                        )}>
                          {opt.id}
                        </span>

                        <div className="flex flex-wrap items-center gap-2">
                          <span className="text-sm sm:text-base font-semibold text-white">
                            {opt.text}
                          </span>
                          {isCorrect && (
                            <span className="px-2 py-0.5 rounded bg-emerald-400 text-black text-[10px] font-extrabold uppercase">
                              Verified Correct
                            </span>
                          )}
                        </div>
                      </div>

                      <div className="relative z-10 text-right font-mono shrink-0">
                        <div className="text-base sm:text-lg font-black text-white">{pct}%</div>
                        <div className="text-[11px] text-neutral-400">{votes} {votes === 1 ? 'vote' : 'votes'}</div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Explanation Card */}
              {resultsModalQuestion.explanation && (
                <div className="p-4 rounded-xl bg-white/5 border border-white/10 text-xs sm:text-sm">
                  <div className="font-bold uppercase tracking-wider text-neutral-300 mb-1 flex items-center space-x-1.5">
                    <HelpCircle className="w-3.5 h-3.5 text-blue-400" />
                    <span>Concept Breakdown & Solution</span>
                  </div>
                  <p className="text-neutral-300 leading-relaxed font-normal">
                    {resultsModalQuestion.explanation}
                  </p>
                </div>
              )}

              <div className="mt-6 pt-4 border-t border-white/10 flex justify-end">
                <button
                  onClick={() => setResultsModalQuestion(null)}
                  className="px-6 py-2.5 bg-neutral-800 hover:bg-neutral-700 text-white text-xs sm:text-sm font-bold uppercase tracking-wider rounded-xl cursor-pointer"
                >
                  Close Results
                </button>
              </div>

            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ========================================================
          MODAL 3: STUDENT PARTICIPATION RECORDS LEDGER
          ======================================================== */}
      <AnimatePresence>
        {participationModalQuestion && (
          <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="w-full max-w-4xl max-h-[92vh] overflow-y-auto border border-white/10 bg-[#0c0c0c] text-white shadow-2xl rounded-3xl p-6 sm:p-8 relative"
            >
              <button
                onClick={() => setParticipationModalQuestion(null)}
                className="absolute top-6 right-6 w-8 h-8 rounded-full bg-white/10 flex items-center justify-center font-mono text-xs hover:bg-rose-500 hover:text-white transition-colors cursor-pointer"
              >
                ✕
              </button>

              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 border-b border-white/10 pb-5">
                <div>
                  <div className="flex items-center space-x-2 text-xs font-bold uppercase tracking-wider text-emerald-400">
                    <Users className="w-4 h-4" />
                    <span>STUDENT PARTICIPATION LEDGER · VERIFIED FIRESTORE SUBMISSIONS</span>
                  </div>
                  <h3 className="text-2xl font-black text-white mt-1">
                    {participationModalQuestion.title}
                  </h3>
                  <div className="text-xs sm:text-sm text-neutral-400 mt-1">
                    Question ID: <span className="font-mono text-white">{participationModalQuestion.id}</span> · Total Responses: <span className="text-emerald-400 font-bold">{questionSubmissions.length}</span>
                  </div>
                </div>

                <button
                  onClick={() => exportQuestionParticipationCSV(participationModalQuestion)}
                  className="px-4 py-2.5 bg-neutral-800 hover:bg-neutral-700 text-white text-xs font-bold uppercase tracking-wider rounded-xl transition-colors flex items-center space-x-2 shrink-0 cursor-pointer"
                >
                  <Download className="w-4 h-4 text-emerald-400" />
                  <span>Export CSV</span>
                </button>
              </div>

              {/* Search bar inside ledger */}
              <div className="mb-4">
                <input
                  type="text"
                  value={participationSearch}
                  onChange={(e) => setParticipationSearch(e.target.value)}
                  placeholder="Filter student name, email, or option..."
                  className="w-full px-4 py-2.5 bg-black/60 border border-white/10 rounded-xl text-sm text-white focus:outline-none focus:border-emerald-400 placeholder:text-neutral-500"
                />
              </div>

              {/* Submissions Table */}
              <div className="border border-white/10 rounded-xl overflow-x-auto max-h-[380px] overflow-y-auto">
                <table className="w-full text-left border-collapse text-xs sm:text-sm">
                  <thead>
                    <tr className="border-b border-white/10 bg-black/80 text-neutral-300 uppercase tracking-wider sticky top-0">
                      <th className="py-3 px-4">Student</th>
                      <th className="py-3 px-4">Email</th>
                      <th className="py-3 px-4 text-center">Selected Option</th>
                      <th className="py-3 px-4 text-center">Verdict</th>
                      <th className="py-3 px-4 text-right">Points</th>
                      <th className="py-3 px-4 text-right">Submitted At (IST)</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {questionSubmissions.map((sub, idx) => (
                      <tr key={sub.id || idx} className="hover:bg-white/5">
                        <td className="py-3 px-4 font-bold text-white">
                          {sub.userName || "Student"}
                        </td>
                        <td className="py-3 px-4 text-neutral-400 font-mono">
                          {sub.userEmail || "N/A"}
                        </td>
                        <td className="py-3 px-4 text-center">
                          <span className={cn(
                            "px-2.5 py-1 rounded font-mono font-bold text-xs uppercase",
                            sub.selectedOption === participationModalQuestion.correctOption
                              ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/40"
                              : "bg-rose-500/20 text-rose-300 border border-rose-500/40"
                          )}>
                            Option {sub.selectedOption}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-center">
                          {sub.isCorrect ? (
                            <span className="inline-flex items-center text-emerald-400 font-bold">
                              <CheckCircle2 className="w-4 h-4 mr-1" /> Correct
                            </span>
                          ) : (
                            <span className="inline-flex items-center text-rose-400 font-bold">
                              <XCircle className="w-4 h-4 mr-1" /> Incorrect
                            </span>
                          )}
                        </td>
                        <td className="py-3 px-4 text-right font-mono font-bold text-yellow-400">
                          +{sub.pointsEarned || 0} XP
                        </td>
                        <td className="py-3 px-4 text-right font-mono text-neutral-400 text-xs">
                          {formatToIST(sub.submittedAt)}
                        </td>
                      </tr>
                    ))}

                    {questionSubmissions.length === 0 && (
                      <tr>
                        <td colSpan={6} className="py-10 text-center text-neutral-400 italic">
                          No student participation records recorded yet for this question.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>

              <div className="mt-6 pt-4 border-t border-white/10 flex items-center justify-between">
                <span className="text-xs text-neutral-400">
                  Enforces strict one-vote-per-student rule via Firestore backend validation.
                </span>
                <button
                  onClick={() => setParticipationModalQuestion(null)}
                  className="px-6 py-2 bg-neutral-800 hover:bg-neutral-700 text-white text-xs font-bold uppercase tracking-wider rounded-xl cursor-pointer"
                >
                  Close Ledger
                </button>
              </div>

            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
