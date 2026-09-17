import React, { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "motion/react";
import {
  QrCode,
  RefreshCw,
  LogOut,
  Users,
  CheckCircle2,
  Clock,
  Award,
  Filter,
  Search,
  Eye,
  UserCheck,
  Calendar,
  AlertCircle,
  Sparkles,
  ChevronLeft,
  ChevronRight,
  ShieldCheck,
  ExternalLink,
  ChevronDown
} from "lucide-react";
import atgfgAuth from "@/src/services/atgfgAuth";
import atgfgApi, { AtgfgRegistration, AtgfgStats } from "@/src/services/atgfgApi";
import QRScannerModal from "@/src/components/atgfg/QRScannerModal";
import StudentVerificationModal from "@/src/components/atgfg/StudentVerificationModal";

export default function AtgfgDashboard() {
  const navigate = useNavigate();
  const user = atgfgAuth.getUser();

  // Primary Data State
  const [registrations, setRegistrations] = useState<AtgfgRegistration[]>([]);
  const [loading, setLoading] = useState(true);
  const [syncing, setSyncing] = useState(false);
  const [lastSynced, setLastSynced] = useState<string>("");
  const [toastMessage, setToastMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  // Filters & Search
  const [selectedEventId, setSelectedEventId] = useState<string>("ALL");
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<"ALL" | "CONFIRMED" | "OTHER">("ALL");
  const [attendanceFilter, setAttendanceFilter] = useState<"ALL" | "NOT_MARKED" | "PRESENT">("ALL");
  const [certificateFilter, setCertificateFilter] = useState<"ALL" | "NOT_ISSUED" | "ISSUED">("ALL");

  // Pagination & Sorting
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [sortField, setSortField] = useState<keyof AtgfgRegistration>("timestamp");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");

  // Modals
  const [scannerOpen, setScannerOpen] = useState(false);
  const [verificationOpen, setVerificationOpen] = useState(false);
  const [activeVerification, setActiveVerification] = useState<AtgfgRegistration | null>(null);
  const [notFoundId, setNotFoundId] = useState<string | null>(null);
  const [verificationLoading, setVerificationLoading] = useState(false);

  // Show Toast
  const showToast = (text: string, type: "success" | "error" = "success") => {
    setToastMessage({ text, type });
    setTimeout(() => {
      setToastMessage(null);
    }, 4000);
  };

  // Fetch Data from Google Apps Script Web App
  const fetchData = async (isManualSync = false) => {
    if (isManualSync) setSyncing(true);
    else setLoading(true);

    try {
      const res = await atgfgApi.getRegistrations(selectedEventId);
      if (res.success) {
        setRegistrations(res.registrations);
        setLastSynced(res.lastSynced);
        if (isManualSync) {
          showToast("Data synced successfully with Google Sheets!");
        }
      } else {
        if (isManualSync) {
          showToast(res.error || "Unable to sync with Google Sheets.", "error");
        }
      }
    } catch (err: any) {
      console.error("Dashboard fetch error:", err);
      showToast("Unable to communicate with Google Apps Script Web App.", "error");
    } finally {
      setLoading(false);
      setSyncing(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [selectedEventId]);

  // Unique Event IDs for Dropdown
  const uniqueEventIds = useMemo(() => {
    const set = new Set<string>();
    registrations.forEach((r) => {
      if (r.event_id) set.add(r.event_id);
    });
    return Array.from(set).sort();
  }, [registrations]);

  // Filtered List based on Event, Search, Status, Attendance, Certificate
  const filteredRegistrations = useMemo(() => {
    return registrations.filter((r) => {
      // Event filter
      if (selectedEventId !== "ALL" && r.event_id !== selectedEventId) {
        return false;
      }
      // Status filter
      if (statusFilter === "CONFIRMED" && r.status !== "CONFIRMED") return false;
      if (statusFilter === "OTHER" && r.status === "CONFIRMED") return false;

      // Attendance filter
      if (attendanceFilter === "PRESENT" && r.attendance_status !== "PRESENT") return false;
      if (attendanceFilter === "NOT_MARKED" && r.attendance_status === "PRESENT") return false;

      // Certificate filter
      if (certificateFilter === "ISSUED" && r.certificate_status !== "ISSUED") return false;
      if (certificateFilter === "NOT_ISSUED" && r.certificate_status === "ISSUED") return false;

      // Search query
      if (searchQuery.trim()) {
        const q = searchQuery.trim().toLowerCase();
        const matches =
          r.registration_id.toLowerCase().includes(q) ||
          r.event_id.toLowerCase().includes(q) ||
          r.name.toLowerCase().includes(q) ||
          r.email.toLowerCase().includes(q) ||
          r.enrollment_number.toLowerCase().includes(q) ||
          r.phone.toLowerCase().includes(q) ||
          r.department.toLowerCase().includes(q);
        if (!matches) return false;
      }

      return true;
    });
  }, [registrations, selectedEventId, searchQuery, statusFilter, attendanceFilter, certificateFilter]);

  // Dynamic Statistics
  const stats: AtgfgStats = useMemo(() => {
    const listToCalculate = selectedEventId === "ALL"
      ? registrations
      : registrations.filter((r) => r.event_id === selectedEventId);
    return atgfgApi.calculateStats(listToCalculate);
  }, [registrations, selectedEventId]);

  // Sorted and Paginated Table Items
  const sortedRegistrations = useMemo(() => {
    return [...filteredRegistrations].sort((a, b) => {
      let valA = a[sortField] || "";
      let valB = b[sortField] || "";
      if (typeof valA === "string") valA = valA.toLowerCase();
      if (typeof valB === "string") valB = valB.toLowerCase();

      if (valA < valB) return sortOrder === "asc" ? -1 : 1;
      if (valA > valB) return sortOrder === "asc" ? 1 : -1;
      return 0;
    });
  }, [filteredRegistrations, sortField, sortOrder]);

  const totalPages = Math.ceil(sortedRegistrations.length / pageSize) || 1;
  const paginatedRegistrations = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return sortedRegistrations.slice(start, start + pageSize);
  }, [sortedRegistrations, currentPage, pageSize]);

  // Handle QR Scan Result or Manual Selection
  const handleOpenVerification = async (registrationId: string) => {
    setNotFoundId(null);
    setActiveVerification(null);
    setVerificationLoading(true);
    setVerificationOpen(true);

    try {
      const res = await atgfgApi.getRegistrationById(registrationId);
      if (res.success && res.registration) {
        setActiveVerification(res.registration);
      } else {
        setNotFoundId(registrationId);
      }
    } catch (err) {
      setNotFoundId(registrationId);
    } finally {
      setVerificationLoading(false);
    }
  };

  // Mark Attendance Handler passed to Verification Modal
  const handleMarkAttendance = async (regId: string) => {
    const res = await atgfgApi.markAttendance(regId);
    if (res.success && res.registration) {
      setActiveVerification({ ...res.registration });
      // Update local array
      setRegistrations((prev) =>
        prev.map((r) =>
          r.registration_id === res.registration!.registration_id ? { ...res.registration! } : r
        )
      );
      showToast(`✓ Attendance marked for ${res.registration.name}`);
    }
    return res;
  };

  // Logout Handler
  const handleLogout = () => {
    atgfgAuth.logout();
    navigate("/atgfg", { replace: true });
  };

  return (
    <div className="min-h-screen bg-[#090D16] text-white font-sans pb-20 selection:bg-[#00ff88] selection:text-black">
      {/* Background Glow */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        <div className="absolute top-0 right-1/4 w-[600px] h-[600px] bg-[#00ff88]/5 blur-[180px] rounded-full" />
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-emerald-700/5 blur-[200px] rounded-full" />
      </div>

      {/* Toast Notification */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            className={`fixed top-6 right-6 z-50 p-4 rounded-2xl border shadow-2xl flex items-center space-x-3 text-xs font-bold ${
              toastMessage.type === "success"
                ? "bg-[#0F172A] border-emerald-500/40 text-emerald-300"
                : "bg-[#0F172A] border-rose-500/40 text-rose-300"
            }`}
          >
            {toastMessage.type === "success" ? (
              <CheckCircle2 className="w-5 h-5 text-[#00ff88] shrink-0" />
            ) : (
              <AlertCircle className="w-5 h-5 text-rose-400 shrink-0" />
            )}
            <span>{toastMessage.text}</span>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 space-y-8">
        {/* HEADER BAR */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 bg-[#0F172A]/90 border border-slate-800 rounded-3xl shadow-xl backdrop-blur-md">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#00ff88]/20 to-emerald-600/10 border border-[#00ff88]/30 flex items-center justify-center text-[#00ff88] shadow-inner shrink-0">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h1 className="text-xl sm:text-2xl font-black uppercase tracking-tight text-white italic">
                  Attendance <span className="text-[#00ff88]">Admin Portal</span>
                </h1>
                <span className="px-2.5 py-0.5 bg-[#00ff88]/10 border border-[#00ff88]/20 text-[#00ff88] text-[9px] font-black uppercase tracking-widest rounded-full">
                  ADMIN ACTIVE
                </span>
              </div>
              <p className="text-xs text-slate-400 font-medium mt-0.5">
                Marwadi University Student Chapter • Google Sheets Live Sync
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {lastSynced && (
              <span className="text-[11px] font-mono text-slate-400 bg-slate-900/80 px-3 py-1.5 rounded-xl border border-slate-800 hidden sm:inline-block">
                Last synced: <span className="text-emerald-400">{lastSynced}</span>
              </span>
            )}

            <button
              onClick={() => fetchData(true)}
              disabled={syncing}
              className="px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-bold uppercase tracking-wider rounded-xl transition-all flex items-center space-x-2 cursor-pointer disabled:opacity-50"
            >
              <RefreshCw className={`w-3.5 h-3.5 text-[#00ff88] ${syncing ? "animate-spin" : ""}`} />
              <span>{syncing ? "Syncing..." : "REFRESH DATA"}</span>
            </button>

            <button
              onClick={handleLogout}
              className="px-4 py-2.5 bg-rose-500/10 border border-rose-500/30 text-rose-400 hover:bg-rose-500/20 text-xs font-bold uppercase tracking-wider rounded-xl transition-all flex items-center space-x-2 cursor-pointer"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>LOGOUT</span>
            </button>
          </div>
        </div>

        {/* TOP CONTROLS: EVENT FILTER & SCANNER CTA */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* SCAN QR HERO CARD */}
          <motion.div
            whileHover={{ scale: 1.01 }}
            className="lg:col-span-2 p-6 sm:p-8 bg-gradient-to-r from-emerald-950/40 via-[#0F172A] to-[#0F172A] border border-[#00ff88]/30 rounded-3xl shadow-xl flex flex-col sm:flex-row items-center justify-between gap-6 relative overflow-hidden group"
          >
            <div className="absolute top-0 right-0 w-64 h-64 bg-[#00ff88]/10 rounded-full blur-[100px] pointer-events-none group-hover:bg-[#00ff88]/20 transition-colors" />

            <div className="flex items-center space-x-5 text-center sm:text-left relative z-10">
              <div className="w-16 h-16 rounded-2xl bg-[#00ff88] text-slate-950 flex items-center justify-center shrink-0 shadow-lg shadow-[#00ff88]/20">
                <QrCode className="w-8 h-8" />
              </div>
              <div>
                <span className="text-[10px] font-black uppercase tracking-widest text-[#00ff88] bg-[#00ff88]/10 border border-[#00ff88]/20 px-3 py-1 rounded-full">
                  PRIMARY ACTION
                </span>
                <h2 className="text-xl sm:text-2xl font-black uppercase text-white tracking-tight mt-2">
                  Scan Student QR Pass
                </h2>
                <p className="text-xs text-slate-400 font-medium mt-1">
                  Launch webcam or mobile camera to verify Registration_ID & mark attendance.
                </p>
              </div>
            </div>

            <button
              onClick={() => setScannerOpen(true)}
              className="w-full sm:w-auto px-8 py-4 bg-[#00ff88] hover:bg-emerald-400 text-slate-950 font-black text-xs uppercase tracking-wider rounded-2xl transition-all shadow-lg shadow-[#00ff88]/20 flex items-center justify-center space-x-2 shrink-0 cursor-pointer relative z-10"
            >
              <QrCode className="w-4 h-4" />
              <span>SCAN QR NOW</span>
            </button>
          </motion.div>

          {/* EVENT FILTER CARD */}
          <div className="p-6 bg-[#0F172A] border border-slate-800 rounded-3xl shadow-xl flex flex-col justify-between space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-black uppercase tracking-wider text-slate-300 flex items-center gap-2">
                <Filter className="w-4 h-4 text-[#00ff88]" /> Event Filter
              </span>
              <span className="text-[10px] font-mono text-slate-400">
                {selectedEventId === "ALL" ? "All Events Selected" : `Filtered: ${selectedEventId}`}
              </span>
            </div>

            <div>
              <label className="block text-[10px] font-bold uppercase text-slate-400 mb-1.5">Select Event ID</label>
              <div className="relative">
                <select
                  value={selectedEventId}
                  onChange={(e) => {
                    setSelectedEventId(e.target.value);
                    setCurrentPage(1);
                  }}
                  className="w-full bg-slate-950 border border-slate-700 focus:border-[#00ff88] text-white text-xs font-bold rounded-xl px-4 py-3 outline-none appearance-none cursor-pointer"
                >
                  <option value="ALL">ALL EVENTS ({registrations.length} total registrations)</option>
                  {uniqueEventIds.map((evt) => (
                    <option key={evt} value={evt}>
                      {evt} ({registrations.filter((r) => r.event_id === evt).length} registrations)
                    </option>
                  ))}
                </select>
                <ChevronDown className="absolute right-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
              </div>
            </div>

            <p className="text-[11px] text-slate-400 leading-relaxed font-medium">
              Stats and student lists dynamically scope to the selected Event_ID.
            </p>
          </div>
        </div>

        {/* STATISTICS CARDS (6 CARDS) */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          <div className="p-5 bg-[#0F172A] border border-slate-800 rounded-2xl space-y-2">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">Total</span>
            <div className="text-2xl font-black font-mono text-white">{stats.totalRegistrations}</div>
            <span className="text-[9px] text-slate-500 font-mono block">All Registrations</span>
          </div>

          <div className="p-5 bg-[#0F172A] border border-slate-800 rounded-2xl space-y-2">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">Confirmed</span>
            <div className="text-2xl font-black font-mono text-emerald-400">{stats.confirmedRegistrations}</div>
            <span className="text-[9px] text-slate-500 font-mono block">Status: CONFIRMED</span>
          </div>

          <div className="p-5 bg-[#0F172A] border border-slate-800 rounded-2xl space-y-2">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">Present</span>
            <div className="text-2xl font-black font-mono text-[#00ff88]">{stats.attendanceMarked}</div>
            <span className="text-[9px] text-slate-500 font-mono block">Attendance Marked</span>
          </div>

          <div className="p-5 bg-[#0F172A] border border-slate-800 rounded-2xl space-y-2">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">Pending Att.</span>
            <div className="text-2xl font-black font-mono text-amber-400">{stats.attendancePending}</div>
            <span className="text-[9px] text-slate-500 font-mono block">Not Marked Yet</span>
          </div>

          <div className="p-5 bg-[#0F172A] border border-slate-800 rounded-2xl space-y-2">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">Cert. Issued</span>
            <div className="text-2xl font-black font-mono text-sky-400">{stats.certificatesIssued}</div>
            <span className="text-[9px] text-slate-500 font-mono block">Certificates Issued</span>
          </div>

          <div className="p-5 bg-[#0F172A] border border-slate-800 rounded-2xl space-y-2">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">Cert. Pending</span>
            <div className="text-2xl font-black font-mono text-slate-400">{stats.certificatesPending}</div>
            <span className="text-[9px] text-slate-500 font-mono block">Certificates Pending</span>
          </div>
        </div>

        {/* SEARCH BAR & SEARCH RESULTS SECTION */}
        <div className="p-6 bg-[#0F172A] border border-slate-800 rounded-3xl shadow-xl space-y-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <h3 className="text-base font-black uppercase tracking-wide text-white">
                Quick Student <span className="text-[#00ff88]">Lookup</span>
              </h3>
              <p className="text-xs text-slate-400">Search by Registration ID, Event ID, Name, Email, or Enrollment Number</p>
            </div>
          </div>

          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setCurrentPage(1);
              }}
              placeholder="Search e.g. REG-1788698620536-209, Meet Khakhkhar, sfV..."
              className="w-full h-12 bg-slate-950 border border-slate-800 focus:border-[#00ff88] rounded-2xl pl-11 pr-4 text-xs font-semibold text-white placeholder:text-slate-600 outline-none transition-colors"
            />
          </div>

          {searchQuery.trim() && (
            <div className="pt-2">
              <p className="text-[11px] font-mono text-slate-400 mb-3">
                Found {filteredRegistrations.length} result(s) matching "{searchQuery}"
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 max-h-72 overflow-y-auto pr-1">
                {filteredRegistrations.slice(0, 6).map((r) => (
                  <div
                    key={r.registration_id}
                    onClick={() => handleOpenVerification(r.registration_id)}
                    className="p-4 bg-slate-950 border border-slate-800 hover:border-[#00ff88]/50 rounded-2xl cursor-pointer transition-all hover:scale-[1.01] space-y-2 group"
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <div className="font-bold text-xs text-white group-hover:text-[#00ff88] transition-colors">{r.name}</div>
                        <div className="text-[10px] font-mono text-emerald-400 mt-0.5">{r.registration_id}</div>
                      </div>
                      <span className="px-2 py-0.5 text-[9px] font-mono font-bold bg-slate-800 text-slate-300 rounded-md">
                        {r.event_id}
                      </span>
                    </div>

                    <div className="flex items-center justify-between pt-2 border-t border-slate-900 text-[10px]">
                      <span className="text-slate-400 font-mono">{r.email}</span>
                      <span
                        className={`font-black uppercase tracking-wider ${
                          r.attendance_status === "PRESENT" ? "text-[#00ff88]" : "text-amber-400"
                        }`}
                      >
                        {r.attendance_status === "PRESENT" ? "PRESENT" : "NOT MARKED"}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* REGISTERED STUDENTS TABLE SECTION */}
        <div className="p-6 bg-[#0F172A] border border-slate-800 rounded-3xl shadow-xl space-y-6">
          {/* Table Toolbar */}
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-slate-800/80 pb-5">
            <div>
              <h3 className="text-lg font-black uppercase tracking-wide text-white">
                Registered <span className="text-[#00ff88]">Students Database</span>
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Showing {filteredRegistrations.length} record(s) from Google Sheet
              </p>
            </div>

            {/* Filter Pills */}
            <div className="flex flex-wrap items-center gap-2 text-xs">
              {/* Status Filter */}
              <div className="flex bg-slate-950 p-1 rounded-xl border border-slate-800">
                <span className="px-2.5 py-1 text-[10px] font-bold text-slate-500 uppercase flex items-center">Status:</span>
                {(["ALL", "CONFIRMED", "OTHER"] as const).map((f) => (
                  <button
                    key={f}
                    onClick={() => {
                      setStatusFilter(f);
                      setCurrentPage(1);
                    }}
                    className={`px-2.5 py-1 rounded-lg text-[10px] font-black uppercase tracking-wider transition-all cursor-pointer ${
                      statusFilter === f ? "bg-emerald-500 text-slate-950" : "text-slate-400 hover:text-white"
                    }`}
                  >
                    {f}
                  </button>
                ))}
              </div>

              {/* Attendance Filter */}
              <div className="flex bg-slate-950 p-1 rounded-xl border border-slate-800">
                <span className="px-2.5 py-1 text-[10px] font-bold text-slate-500 uppercase flex items-center">Att:</span>
                {(["ALL", "NOT_MARKED", "PRESENT"] as const).map((f) => (
                  <button
                    key={f}
                    onClick={() => {
                      setAttendanceFilter(f);
                      setCurrentPage(1);
                    }}
                    className={`px-2.5 py-1 rounded-lg text-[10px] font-black uppercase tracking-wider transition-all cursor-pointer ${
                      attendanceFilter === f ? "bg-emerald-500 text-slate-950" : "text-slate-400 hover:text-white"
                    }`}
                  >
                    {f === "NOT_MARKED" ? "PENDING" : f}
                  </button>
                ))}
              </div>

              {/* Certificate Filter */}
              <div className="flex bg-slate-950 p-1 rounded-xl border border-slate-800">
                <span className="px-2.5 py-1 text-[10px] font-bold text-slate-500 uppercase flex items-center">Cert:</span>
                {(["ALL", "NOT_ISSUED", "ISSUED"] as const).map((f) => (
                  <button
                    key={f}
                    onClick={() => {
                      setCertificateFilter(f);
                      setCurrentPage(1);
                    }}
                    className={`px-2.5 py-1 rounded-lg text-[10px] font-black uppercase tracking-wider transition-all cursor-pointer ${
                      certificateFilter === f ? "bg-emerald-500 text-slate-950" : "text-slate-400 hover:text-white"
                    }`}
                  >
                    {f}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Table Element */}
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-slate-800 text-[10px] font-black uppercase tracking-wider text-slate-400 bg-slate-950/50">
                  <th className="p-3.5">Registration ID</th>
                  <th className="p-3.5">Event ID</th>
                  <th className="p-3.5">Name</th>
                  <th className="p-3.5">Email / Phone</th>
                  <th className="p-3.5">Enrollment</th>
                  <th className="p-3.5">Dept / Year</th>
                  <th className="p-3.5">Status</th>
                  <th className="p-3.5">Attendance</th>
                  <th className="p-3.5">Certificate</th>
                  <th className="p-3.5 text-right">Actions</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-800/60 font-medium">
                {loading ? (
                  <tr>
                    <td colSpan={10} className="p-12 text-center text-slate-400">
                      <Sparkles className="w-6 h-6 text-[#00ff88] animate-spin mx-auto mb-2" />
                      Loading registrations database...
                    </td>
                  </tr>
                ) : paginatedRegistrations.length === 0 ? (
                  <tr>
                    <td colSpan={10} className="p-12 text-center text-slate-500">
                      No registrations matched current filters.
                    </td>
                  </tr>
                ) : (
                  paginatedRegistrations.map((r) => (
                    <tr key={r.registration_id} className="hover:bg-slate-900/60 transition-colors">
                      <td className="p-3.5 font-mono text-emerald-400 font-bold select-all whitespace-nowrap">
                        {r.registration_id}
                      </td>
                      <td className="p-3.5 font-mono text-white font-bold whitespace-nowrap">{r.event_id}</td>
                      <td className="p-3.5 text-white font-bold whitespace-nowrap">{r.name}</td>
                      <td className="p-3.5 text-slate-300 whitespace-nowrap">
                        <div>{r.email}</div>
                        <div className="text-[10px] text-slate-500">{r.phone}</div>
                      </td>
                      <td className="p-3.5 font-mono text-slate-300 whitespace-nowrap">{r.enrollment_number || "-"}</td>
                      <td className="p-3.5 text-slate-300 whitespace-nowrap">
                        {r.department} {r.year ? `(Yr ${r.year})` : ""}
                      </td>
                      <td className="p-3.5 whitespace-nowrap">
                        <span
                          className={`px-2.5 py-0.5 text-[9px] font-black uppercase tracking-wider rounded-full border ${
                            r.status === "CONFIRMED"
                              ? "bg-emerald-500/10 border-emerald-500/30 text-[#00ff88]"
                              : "bg-amber-500/10 border-amber-500/30 text-amber-400"
                          }`}
                        >
                          {r.status}
                        </span>
                      </td>
                      <td className="p-3.5 whitespace-nowrap">
                        <span
                          className={`px-2.5 py-0.5 text-[9px] font-black uppercase tracking-wider rounded-full border ${
                            r.attendance_status === "PRESENT"
                              ? "bg-emerald-500/10 border-emerald-500/30 text-[#00ff88]"
                              : "bg-slate-800 border-slate-700 text-slate-400"
                          }`}
                        >
                          {r.attendance_status === "PRESENT" ? "PRESENT ✓" : "NOT MARKED"}
                        </span>
                      </td>
                      <td className="p-3.5 whitespace-nowrap">
                        <span
                          className={`px-2.5 py-0.5 text-[9px] font-black uppercase tracking-wider rounded-full border ${
                            r.certificate_status === "ISSUED"
                              ? "bg-sky-500/10 border-sky-500/30 text-sky-400"
                              : "bg-slate-800 border-slate-700 text-slate-400"
                          }`}
                        >
                          {r.certificate_status}
                        </span>
                      </td>
                      <td className="p-3.5 text-right whitespace-nowrap space-x-2">
                        <button
                          onClick={() => handleOpenVerification(r.registration_id)}
                          className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-[10px] font-bold uppercase rounded-lg transition-colors cursor-pointer"
                        >
                          Verify
                        </button>

                        {r.status === "CONFIRMED" && r.attendance_status !== "PRESENT" && (
                          <button
                            onClick={() => handleOpenVerification(r.registration_id)}
                            className="px-3 py-1.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-[10px] font-black uppercase rounded-lg transition-colors cursor-pointer"
                          >
                            Mark
                          </button>
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination Bar */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2 border-t border-slate-800/80 text-xs text-slate-400 font-medium">
            <div className="flex items-center space-x-2">
              <span>Show</span>
              <select
                value={pageSize}
                onChange={(e) => {
                  setPageSize(Number(e.target.value));
                  setCurrentPage(1);
                }}
                className="bg-slate-950 border border-slate-800 rounded-lg px-2 py-1 text-white text-xs outline-none"
              >
                {[10, 25, 50, 100].map((size) => (
                  <option key={size} value={size}>
                    {size} per page
                  </option>
                ))}
              </select>
              <span>
                (Showing {sortedRegistrations.length === 0 ? 0 : (currentPage - 1) * pageSize + 1} to{" "}
                {Math.min(currentPage * pageSize, sortedRegistrations.length)} of {sortedRegistrations.length})
              </span>
            </div>

            <div className="flex items-center space-x-2">
              <button
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="p-2 bg-slate-950 border border-slate-800 rounded-lg disabled:opacity-40 hover:bg-slate-800 text-white transition-colors cursor-pointer"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <span className="font-mono text-white px-2">
                Page {currentPage} of {totalPages}
              </span>
              <button
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
                className="p-2 bg-slate-950 border border-slate-800 rounded-lg disabled:opacity-40 hover:bg-slate-800 text-white transition-colors cursor-pointer"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* QR Scanner Modal */}
      <QRScannerModal
        isOpen={scannerOpen}
        onClose={() => setScannerOpen(false)}
        onScanResult={(id) => {
          setScannerOpen(false);
          handleOpenVerification(id);
        }}
      />

      {/* Student Verification Modal */}
      <StudentVerificationModal
        isOpen={verificationOpen}
        registration={activeVerification}
        notFoundId={notFoundId}
        loading={verificationLoading}
        onClose={() => {
          setVerificationOpen(false);
          setActiveVerification(null);
          setNotFoundId(null);
        }}
        onMarkAttendance={handleMarkAttendance}
      />
    </div>
  );
}
