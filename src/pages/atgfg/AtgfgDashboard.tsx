import React, { useState, useEffect, useMemo } from "react";
import { useNavigate, useLocation, Navigate } from "react-router-dom";
import {
  RefreshCw,
  LogOut,
  Users,
  CheckCircle2,
  Award,
  Search,
  UserCheck,
  AlertCircle,
  Download,
  Mail,
  Settings,
  Plus,
  Send,
  FileText,
  Activity,
  ExternalLink,
  Check,
  X,
  Eye
} from "lucide-react";
import { jsPDF } from "jspdf";
import multiEventPortalClient from "@/src/services/multiEventPortalClient";

type DashboardTab =
  | "overview"
  | "participants"
  | "jury"
  | "attendance"
  | "certificates"
  | "certificate-generator"
  | "settings";

const FORGECERT_EMBED_URL = "https://forgecert-a.netlify.app/";

export default function AtgfgDashboard() {
  const navigate = useNavigate();
  const location = useLocation();

  const [activeTab, setActiveTab] = useState<DashboardTab>(() => {
    if (location.pathname.endsWith("/certificate-generator")) {
      return "certificate-generator";
    }
    const params = new URLSearchParams(location.search);
    const tabParam = params.get("tab");
    if (
      tabParam === "overview" ||
      tabParam === "participants" ||
      tabParam === "jury" ||
      tabParam === "attendance" ||
      tabParam === "certificates" ||
      tabParam === "certificate-generator" ||
      tabParam === "settings"
    ) {
      return tabParam;
    }
    return "overview";
  });
  const [loading, setLoading] = useState(true);
  const [syncing, setSyncing] = useState(false);
  const [testingConnection, setTestingConnection] = useState(false);

  // Embedded External Certificate Generator (ForgeCert) state
  const [forgeCertLoading, setForgeCertLoading] = useState(true);
  const [forgeCertBlocked, setForgeCertBlocked] = useState(false);
  const [forgeCertReloadKey, setForgeCertReloadKey] = useState(0);

  // Isolated Event State from Server
  const [eventInfo, setEventInfo] = useState<any>(null);
  const [summary, setSummary] = useState<any>({
    totalParticipants: 0,
    confirmedParticipants: 0,
    presentAttendance: 0,
    pendingAttendance: 0,
    totalJury: 0,
    checkedInJury: 0,
    eligibleForCertificate: 0,
    certificatesGenerated: 0,
    emailsSent: 0,
    emailsFailed: 0
  });
  const [participants, setParticipants] = useState<any[]>([]);
  const [jury, setJury] = useState<any[]>([]);
  const [certificates, setCertificates] = useState<any[]>([]);
  const [emailLogs, setEmailLogs] = useState<any[]>([]);
  const [recentActivity, setRecentActivity] = useState<any[]>([]);

  // Feedback banner
  const [notice, setNotice] = useState<{ type: "success" | "error"; text: string } | null>(null);

  // Filters & Search
  const [participantSearch, setParticipantSearch] = useState("");
  const [attendanceFilter, setAttendanceFilter] = useState<"ALL" | "PRESENT" | "NOT_MARKED">("ALL");
  const [jurySearch, setJurySearch] = useState("");
  const [attendanceLookupQuery, setAttendanceLookupQuery] = useState("");

  // Add Participant Modal
  const [showAddParticipant, setShowAddParticipant] = useState(false);
  const [newParticipant, setNewParticipant] = useState({
    name: "",
    email: "",
    phone: "",
    enrollmentNumber: "",
    department: "Computer Engineering",
    year: "3rd Year",
    college: "Marwadi University"
  });

  // Add Jury Modal
  const [showAddJury, setShowAddJury] = useState(false);
  const [newJury, setNewJury] = useState({
    name: "",
    email: "",
    phone: "",
    organization: "Marwadi University",
    designation: "Jury Evaluator",
    panelName: "Evaluation Panel A",
    trackAssigned: "Software & AI Innovation",
    status: "CONFIRMED" as "CONFIRMED" | "INVITED" | "CHECKED_IN"
  });

  // Certificates & Email state
  const [selectedCertIds, setSelectedCertIds] = useState<string[]>([]);
  const [testEmailAddress, setTestEmailAddress] = useState("");
  const [previewModalData, setPreviewModalData] = useState<{
    certificate: any;
    emailPreview: { subject: string; html: string; text: string };
  } | null>(null);
  const [processingCerts, setProcessingCerts] = useState(false);

  // Connection Test Result & Settings state
  const [connectionDiagnostic, setConnectionDiagnostic] = useState<any>(null);
  const [settingsForm, setSettingsForm] = useState({
    appsScriptUrl: "",
    spreadsheetId: "",
    registrationsSheet: "Registrations",
    jurySheet: "Jury",
    attendanceSheet: "Attendance",
    certificatesSheet: "Certificates",
    logsSheet: "Logs"
  });

  const showBanner = (text: string, type: "success" | "error" = "success") => {
    setNotice({ text, type });
    setTimeout(() => setNotice(null), 5000);
  };

  const loadDashboard = async () => {
    setLoading(true);
    try {
      const res = await multiEventPortalClient.fetchIsolatedDashboard();
      if (!res.success) {
        if (res.status === 401 || res.status === 403) {
          multiEventPortalClient.clearEventSession();
          navigate("/event-portal", { replace: true });
          return;
        }
        showBanner(res.error || "Failed to load event dashboard", "error");
        return;
      }

      setEventInfo(res.event);
      setSummary(res.summary || {});
      setParticipants(res.participants || []);
      setJury(res.jury || []);
      setCertificates(res.certificates || []);
      setEmailLogs(res.emailLogs || []);
      setRecentActivity(res.recentActivity || []);

      if (res.event) {
        setSettingsForm({
          appsScriptUrl: res.event.appsScriptUrl || "",
          spreadsheetId: res.event.spreadsheetConfig?.spreadsheetId || "",
          registrationsSheet: res.event.spreadsheetConfig?.registrationsSheet || "Registrations",
          jurySheet: res.event.spreadsheetConfig?.jurySheet || "Jury",
          attendanceSheet: res.event.spreadsheetConfig?.attendanceSheet || "Attendance",
          certificatesSheet: res.event.spreadsheetConfig?.certificatesSheet || "Certificates",
          logsSheet: res.event.spreadsheetConfig?.logsSheet || "Logs"
        });
      }
    } catch {
      showBanner("Network error while communicating with event server.", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDashboard();
  }, []);

  const handleLogout = async () => {
    await multiEventPortalClient.logoutEventOperator();
    navigate("/event-portal", { replace: true });
  };

  const handleSyncData = async () => {
    setSyncing(true);
    try {
      const res = await multiEventPortalClient.syncEventData();
      if (res.success) {
        showBanner(res.message || `Synced ${res.syncedParticipantsCount} records from ${res.spreadsheetId}.`);
        await loadDashboard();
      } else {
        showBanner(res.error || "Apps Script synchronization failed.", "error");
        await loadDashboard();
      }
    } catch {
      showBanner("Sync request failed.", "error");
    } finally {
      setSyncing(false);
    }
  };

  const handleTestConnection = async () => {
    setTestingConnection(true);
    setConnectionDiagnostic(null);
    try {
      const res = await multiEventPortalClient.testConnection();
      setConnectionDiagnostic(res);
      if (res.success) {
        showBanner(`Connection verified (${res.latencyMs}ms) — Sheet access OK.`);
      } else {
        showBanner(res.error || "Connection test failed.", "error");
      }
    } catch {
      showBanner("Connection test network failure.", "error");
    } finally {
      setTestingConnection(false);
    }
  };

  const handleCreateParticipant = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await multiEventPortalClient.addParticipant(newParticipant);
    if (res.success) {
      showBanner(`Added participant ${newParticipant.name} to ${eventInfo?.eventId}.`);
      setShowAddParticipant(false);
      setNewParticipant({
        name: "",
        email: "",
        phone: "",
        enrollmentNumber: "",
        department: "Computer Engineering",
        year: "3rd Year",
        college: "Marwadi University"
      });
      await loadDashboard();
    } else {
      showBanner(res.error || "Unable to add participant.", "error");
    }
  };

  const handleCreateJury = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await multiEventPortalClient.addJuryMember(newJury);
    if (res.success) {
      showBanner(`Registered jury member ${newJury.name} for ${eventInfo?.eventId}.`);
      setShowAddJury(false);
      setNewJury({
        name: "",
        email: "",
        phone: "",
        organization: "Marwadi University",
        designation: "Jury Evaluator",
        panelName: "Evaluation Panel A",
        trackAssigned: "Software & AI Innovation",
        status: "CONFIRMED"
      });
      await loadDashboard();
    } else {
      showBanner(res.error || "Unable to add jury member.", "error");
    }
  };

  const handleJuryStatusChange = async (juryId: string, status: "CONFIRMED" | "INVITED" | "CHECKED_IN") => {
    const res = await multiEventPortalClient.updateJuryStatus(juryId, status);
    if (res.success) {
      showBanner(`Updated jury status to ${status}.`);
      await loadDashboard();
    } else {
      showBanner(res.error || "Failed to update jury status.", "error");
    }
  };

  const handleToggleAttendance = async (registrationId: string, nextStatus: "PRESENT" | "NOT_MARKED") => {
    const res = await multiEventPortalClient.markAttendance(registrationId, nextStatus);
    if (res.success) {
      showBanner(`Updated attendance for ${registrationId} → ${nextStatus}.`);
      await loadDashboard();
    } else {
      showBanner(res.error || "Failed to update attendance.", "error");
    }
  };

  const handleGenerateCertificates = async (registrationIds?: string[]) => {
    setProcessingCerts(true);
    try {
      const res = await multiEventPortalClient.generateCertificates(registrationIds);
      if (res.success) {
        showBanner(`Generated ${res.generatedCount} new certificate(s) for eligible participants.`);
        await loadDashboard();
      } else {
        showBanner(res.error || "Certificate generation failed.", "error");
      }
    } finally {
      setProcessingCerts(false);
    }
  };

  const handlePreviewCertAndEmail = async (targetId: string) => {
    const res = await multiEventPortalClient.previewCertificateEmail(targetId);
    if (res.success && res.certificate && res.emailPreview) {
      setPreviewModalData({
        certificate: res.certificate,
        emailPreview: res.emailPreview
      });
    } else {
      showBanner(res.error || "Unable to load certificate preview.", "error");
    }
  };

  const handleDownloadCertificatePdf = (cert: any) => {
    const doc = new jsPDF({ orientation: "landscape", unit: "mm", format: "a4" });

    // Background & Border
    doc.setFillColor(15, 23, 42);
    doc.rect(0, 0, 297, 210, "F");
    doc.setDrawColor(22, 163, 74);
    doc.setLineWidth(1.5);
    doc.rect(12, 12, 273, 186);

    // Header
    doc.setTextColor(74, 222, 128);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(12);
    doc.text("GEEKSFORGEEKS × MARWADI UNIVERSITY STUDENT CHAPTER", 148.5, 36, { align: "center" });

    doc.setTextColor(255, 255, 255);
    doc.setFontSize(28);
    doc.text("CERTIFICATE OF PARTICIPATION", 148.5, 56, { align: "center" });

    doc.setFont("helvetica", "normal");
    doc.setFontSize(13);
    doc.setTextColor(203, 213, 225);
    doc.text("This official credential is proudly presented to", 148.5, 76, { align: "center" });

    // Participant Name
    doc.setFont("helvetica", "bold");
    doc.setFontSize(26);
    doc.setTextColor(74, 222, 128);
    doc.text(String(cert.participantName || "Participant"), 148.5, 96, { align: "center" });

    // Event Details
    doc.setFont("helvetica", "normal");
    doc.setFontSize(13);
    doc.setTextColor(226, 232, 240);
    doc.text(
      `for verified active participation in "${cert.eventName}" (${cert.eventId})`,
      148.5,
      116,
      { align: "center" }
    );
    doc.text(`organized at ${eventInfo?.venue || "Marwadi University, Rajkot"} on ${cert.issueDate}.`, 148.5, 126, {
      align: "center"
    });

    // Metadata Footer
    doc.setFont("courier", "normal");
    doc.setFontSize(10);
    doc.setTextColor(148, 163, 184);
    doc.text(`Certificate ID: ${cert.certificateId}`, 24, 174);
    doc.text(`Registration ID: ${cert.registrationId}`, 24, 182);
    doc.text(`Verify URL: ${cert.verifyUrl}`, 273, 182, { align: "right" });

    doc.save(`${cert.certificateId}_${cert.participantName.replace(/\s+/g, "_")}.pdf`);
  };

  const handleSendSelectedEmails = async (retryFailedOnly = false) => {
    setProcessingCerts(true);
    try {
      const res = await multiEventPortalClient.sendCertificateEmails({
        certificateIds: retryFailedOnly ? undefined : selectedCertIds.length > 0 ? selectedCertIds : undefined,
        retryFailedOnly
      });
      if (res.success) {
        showBanner(
          `Dispatched ${res.sentCount} email(s). ${
            res.skippedDuplicatesCount > 0 ? `(${res.skippedDuplicatesCount} duplicate sends prevented)` : ""
          }`
        );
        setSelectedCertIds([]);
        await loadDashboard();
      } else {
        showBanner(res.error || "Email dispatch failed.", "error");
      }
    } finally {
      setProcessingCerts(false);
    }
  };

  const handleSendTestEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!testEmailAddress.trim()) return;
    setProcessingCerts(true);
    try {
      const res = await multiEventPortalClient.sendCertificateEmails({
        testRecipientEmail: testEmailAddress.trim()
      });
      if (res.success) {
        showBanner(`Test certificate email dispatched to ${testEmailAddress.trim()}.`);
        setTestEmailAddress("");
        await loadDashboard();
      } else {
        showBanner(res.error || "Failed to send test email.", "error");
      }
    } finally {
      setProcessingCerts(false);
    }
  };

  const handleSaveIntegrationSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await multiEventPortalClient.updateOperatorIntegrationSettings({
      appsScriptUrl: settingsForm.appsScriptUrl,
      spreadsheetConfig: {
        spreadsheetId: settingsForm.spreadsheetId,
        registrationsSheet: settingsForm.registrationsSheet,
        jurySheet: settingsForm.jurySheet,
        attendanceSheet: settingsForm.attendanceSheet,
        certificatesSheet: settingsForm.certificatesSheet,
        logsSheet: settingsForm.logsSheet
      }
    });
    if (res.success) {
      showBanner("Updated event integration settings.");
      await loadDashboard();
    } else {
      showBanner(res.error || "Unable to update settings.", "error");
    }
  };

  // Filtered Lists
  const filteredParticipants = useMemo(() => {
    return participants.filter((p) => {
      if (attendanceFilter !== "ALL" && p.attendanceStatus !== attendanceFilter) return false;
      if (participantSearch.trim()) {
        const q = participantSearch.trim().toLowerCase();
        return (
          p.registrationId.toLowerCase().includes(q) ||
          p.name.toLowerCase().includes(q) ||
          p.email.toLowerCase().includes(q) ||
          p.enrollmentNumber.toLowerCase().includes(q) ||
          p.department.toLowerCase().includes(q)
        );
      }
      return true;
    });
  }, [participants, attendanceFilter, participantSearch]);

  const filteredJury = useMemo(() => {
    return jury.filter((j) => {
      if (jurySearch.trim()) {
        const q = jurySearch.trim().toLowerCase();
        return (
          j.name.toLowerCase().includes(q) ||
          j.email.toLowerCase().includes(q) ||
          j.organization.toLowerCase().includes(q) ||
          j.panelName.toLowerCase().includes(q) ||
          j.trackAssigned.toLowerCase().includes(q)
        );
      }
      return true;
    });
  }, [jury, jurySearch]);

  const attendanceMatches = useMemo(() => {
    const q = attendanceLookupQuery.trim().toLowerCase();
    if (!q) return participants;
    return participants.filter(
      (p) =>
        p.registrationId.toLowerCase().includes(q) ||
        p.name.toLowerCase().includes(q) ||
        p.enrollmentNumber.toLowerCase().includes(q) ||
        p.email.toLowerCase().includes(q)
    );
  }, [participants, attendanceLookupQuery]);

  if (loading && !eventInfo) {
    return (
      <div className="min-h-screen bg-[#0F172A] text-slate-200 flex items-center justify-center font-mono text-xs">
        Loading Isolated Event Workspace...
      </div>
    );
  }

  if (!eventInfo || !eventInfo.eventId) {
    multiEventPortalClient.clearEventSession();
    return <Navigate to="/event-portal" replace />;
  }

  return (
    <div className="min-h-screen bg-[#0F172A] text-slate-100 flex flex-col lg:flex-row font-sans">
      {/* Left Workspace Sidebar (260px) */}
      <aside className="w-full lg:w-64 bg-slate-900 border-b lg:border-b-0 lg:border-r border-slate-800 shrink-0 flex flex-col justify-between p-5">
        <div className="space-y-6">
          <div>
            <div className="text-xs font-mono text-emerald-400">{eventInfo?.eventId}</div>
            <div className="text-base font-bold text-white tracking-tight mt-0.5 truncate">
              {eventInfo?.eventName}
            </div>
            <div className="text-xs text-slate-400 mt-1">
              <span>{eventInfo?.operatorLabel}</span>
              <span className="mx-1.5" aria-hidden="true">·</span>
              <span>Isolated Scope</span>
            </div>
          </div>

          <nav className="space-y-1">
            {[
              { id: "overview", label: "Event Overview", icon: Activity },
              { id: "participants", label: "Participants", icon: Users, count: summary.totalParticipants },
              { id: "jury", label: "Jury Registrations", icon: UserCheck, count: summary.totalJury },
              { id: "attendance", label: "Attendance Verify", icon: CheckCircle2, count: summary.presentAttendance },
              { id: "certificates", label: "Certificates & Email", icon: Award, count: summary.certificatesGenerated },
              { id: "certificate-generator", label: "Certificate Generator", icon: FileText },
              { id: "settings", label: "Sync & Settings", icon: Settings }
            ].map((item) => {
              const Icon = item.icon;
              const active = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    setActiveTab(item.id as DashboardTab);
                    if (item.id === "certificate-generator") {
                      setForgeCertBlocked(false);
                    }
                  }}
                  className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-xs font-medium transition-colors cursor-pointer whitespace-nowrap shrink-0 ${
                    active
                      ? "bg-emerald-600 text-white"
                      : "text-slate-300 hover:bg-slate-800/80 hover:text-white"
                  }`}
                >
                  <span className="flex items-center gap-2.5">
                    <Icon className="w-4 h-4 shrink-0" />
                    <span>{item.label}</span>
                  </span>
                  {item.count !== undefined && (
                    <span className="font-mono tabular-nums text-[11px] opacity-80">{item.count}</span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        <div className="pt-6 border-t border-slate-800 space-y-3">
          <div className="text-[11px] text-slate-400">
            <div>Last Sync Status: <span className="font-mono text-slate-200">{eventInfo?.lastSyncStatus}</span></div>
            {eventInfo?.lastSyncAt && (
              <div className="font-mono text-[10px] text-slate-500 mt-0.5">
                {new Date(eventInfo.lastSyncAt).toLocaleString()}
              </div>
            )}
          </div>
          <button
            onClick={handleLogout}
            className="w-full py-2 px-3 bg-slate-800 hover:bg-red-950/60 hover:text-red-300 text-slate-300 border border-slate-700 rounded-lg text-xs font-medium flex items-center justify-center gap-2 transition-colors cursor-pointer whitespace-nowrap shrink-0"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Sign Out ({eventInfo?.eventId})</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Bar Contract: Breadcrumb trail on left, 1-2 primary actions on right */}
        <header className="flex items-center justify-between gap-8 px-6 py-4 bg-slate-900/60 border-b border-slate-800">
          <div className="flex items-center gap-2 text-xs text-slate-400 truncate">
            <span>Event Portal</span>
            <span aria-hidden="true">/</span>
            <span className="font-mono text-white font-semibold">{eventInfo?.eventId}</span>
            <span aria-hidden="true">/</span>
            <span className="text-slate-200 truncate">{eventInfo?.eventName}</span>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={handleSyncData}
              disabled={syncing}
              className="px-4 py-2 text-xs font-medium text-white bg-emerald-600 hover:bg-emerald-500 rounded-lg transition-colors flex items-center gap-2 cursor-pointer disabled:opacity-50 whitespace-nowrap shrink-0"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${syncing ? "animate-spin" : ""}`} />
              <span>{syncing ? "Syncing Sheet..." : "Sync Data"}</span>
            </button>
          </div>
        </header>

        {/* Notification Banner */}
        {notice && (
          <div
            className={`mx-6 mt-4 p-3.5 rounded-lg border text-xs flex items-center justify-between ${
              notice.type === "success"
                ? "bg-emerald-950/60 border-emerald-700/60 text-emerald-200"
                : "bg-red-950/60 border-red-700/60 text-red-200"
            }`}
          >
            <div className="flex items-center gap-2">
              {notice.type === "success" ? (
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              ) : (
                <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
              )}
              <span>{notice.text}</span>
            </div>
            <button onClick={() => setNotice(null)} className="text-slate-400 hover:text-white cursor-pointer">
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Viewport Workspace */}
        <main className="p-6 space-y-8 max-w-7xl w-full mx-auto">
          {/* TAB 1: OVERVIEW */}
          {activeTab === "overview" && (
            <div className="space-y-8">
              <div>
                <h1 className="text-2xl font-bold text-white tracking-tight">{eventInfo?.eventName}</h1>
                <p className="text-sm text-slate-400 mt-1 max-w-3xl">{eventInfo?.description}</p>
                <div className="flex flex-wrap items-center gap-2 text-xs text-slate-400 mt-3 font-mono">
                  <span>Event ID: {eventInfo?.eventId}</span>
                  <span aria-hidden="true">·</span>
                  <span>Date: {eventInfo?.date}</span>
                  <span aria-hidden="true">·</span>
                  <span>Venue: {eventInfo?.venue}</span>
                  <span aria-hidden="true">·</span>
                  <span>Public Registration: {eventInfo?.registrationStatus}</span>
                </div>
              </div>

              {/* Summary Counts Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
                {[
                  { label: "Participants", value: summary.totalParticipants, sub: `${summary.confirmedParticipants} confirmed` },
                  { label: "Attendance Present", value: summary.presentAttendance, sub: `${summary.pendingAttendance} pending` },
                  { label: "Jury Members", value: summary.totalJury, sub: `${summary.checkedInJury} checked in` },
                  { label: "Eligible for Cert", value: summary.eligibleForCertificate, sub: "Verified present" },
                  { label: "Certs Generated", value: summary.certificatesGenerated, sub: "Event-bound PDF" },
                  { label: "Emails Dispatched", value: summary.emailsSent, sub: `${summary.emailsFailed} failed` }
                ].map((stat, idx) => (
                  <div key={idx} className="bg-slate-900 border border-slate-800 rounded-xl p-4">
                    <div className="text-xs text-slate-400">{stat.label}</div>
                    <div className="text-2xl font-bold text-white font-mono tabular-nums mt-1">
                      {stat.value}
                    </div>
                    <div className="text-[11px] text-slate-500 mt-1">{stat.sub}</div>
                  </div>
                ))}
              </div>

              {/* Isolated Sync & Recent Event Activity */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-4">
                  <h2 className="text-base font-semibold text-white">Apps Script Sync Status</h2>
                  <div className="space-y-2 text-xs">
                    <div className="flex justify-between py-1.5 border-b border-slate-800/80">
                      <span className="text-slate-400">Assigned Event ID</span>
                      <span className="font-mono text-white">{eventInfo?.eventId}</span>
                    </div>
                    <div className="flex justify-between py-1.5 border-b border-slate-800/80">
                      <span className="text-slate-400">Spreadsheet ID</span>
                      <span className="font-mono text-slate-200">{eventInfo?.spreadsheetConfig?.spreadsheetId}</span>
                    </div>
                    <div className="flex justify-between py-1.5 border-b border-slate-800/80">
                      <span className="text-slate-400">Last Sync Result</span>
                      <span
                        className={`font-mono font-semibold ${
                          eventInfo?.lastSyncStatus === "ERROR" ? "text-red-400" : "text-emerald-400"
                        }`}
                      >
                        {eventInfo?.lastSyncStatus}
                      </span>
                    </div>
                    <p className="text-slate-400 pt-1 leading-relaxed">{eventInfo?.lastSyncMessage}</p>
                  </div>
                  <div className="flex items-center gap-2 pt-2">
                    <button
                      onClick={handleSyncData}
                      disabled={syncing}
                      className="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-medium rounded-lg transition-colors cursor-pointer whitespace-nowrap shrink-0"
                    >
                      {syncing ? "Syncing..." : "Sync Event Sheet"}
                    </button>
                    <button
                      onClick={handleTestConnection}
                      disabled={testingConnection}
                      className="px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium rounded-lg transition-colors cursor-pointer whitespace-nowrap shrink-0"
                    >
                      {testingConnection ? "Testing..." : "Test Connection"}
                    </button>
                  </div>
                </div>

                {/* Recent Activity & Errors for this Event */}
                <div className="lg:col-span-2 bg-slate-900 border border-slate-800 rounded-xl p-5">
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-base font-semibold text-white">
                      Recent Event Activity &amp; Audit Trail ({eventInfo?.eventId})
                    </h2>
                    <span className="text-xs text-slate-400 font-mono tabular-nums">
                      {recentActivity.length} entries
                    </span>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse text-xs">
                      <thead>
                        <tr className="border-b border-slate-800 text-slate-400">
                          <th className="py-2.5 pr-4 font-medium">Timestamp</th>
                          <th className="py-2.5 px-3 font-medium">Action</th>
                          <th className="py-2.5 px-3 font-medium">Actor</th>
                          <th className="py-2.5 pl-3 font-medium">Details</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-800/60">
                        {recentActivity.slice(0, 8).map((log) => (
                          <tr key={log.logId} className="hover:bg-slate-800/40">
                            <td className="py-2.5 pr-4 font-mono tabular-nums text-slate-400 whitespace-nowrap">
                              {new Date(log.timestamp).toLocaleTimeString()}
                            </td>
                            <td className="py-2.5 px-3 font-mono text-slate-200 whitespace-nowrap">
                              {log.action}
                            </td>
                            <td className="py-2.5 px-3 text-slate-300 whitespace-nowrap">
                              {log.actorName}
                            </td>
                            <td className="py-2.5 pl-3 text-slate-400">{log.details}</td>
                          </tr>
                        ))}
                        {recentActivity.length === 0 && (
                          <tr>
                            <td colSpan={4} className="py-6 text-center text-slate-500">
                              No activity recorded yet for {eventInfo?.eventId}.
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: PARTICIPANT REGISTRATIONS */}
          {activeTab === "participants" && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h1 className="text-xl font-bold text-white">
                    Participant Registrations ({eventInfo?.eventId})
                  </h1>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Showing isolated participant records exclusively for {eventInfo?.eventName}.
                  </p>
                </div>
                <div className="flex items-center gap-2.5">
                  <button
                    onClick={() => multiEventPortalClient.downloadParticipantsCsv(eventInfo?.eventId)}
                    className="px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium rounded-lg flex items-center gap-2 cursor-pointer whitespace-nowrap shrink-0"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Export CSV</span>
                  </button>
                  <button
                    onClick={() => setShowAddParticipant(true)}
                    className="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-medium rounded-lg flex items-center gap-2 cursor-pointer whitespace-nowrap shrink-0"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add Participant</span>
                  </button>
                </div>
              </div>

              {/* Search & Segmented Filter Controls */}
              <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between bg-slate-900 border border-slate-800 p-4 rounded-xl">
                <div className="relative flex-1">
                  <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={participantSearch}
                    onChange={(e) => setParticipantSearch(e.target.value)}
                    placeholder="Search by Registration ID, name, email, enrollment number, or department..."
                    className="w-full h-10 bg-slate-950 border border-slate-800 rounded-lg pl-10 pr-4 text-xs text-white placeholder:text-slate-500 outline-none focus:border-emerald-500"
                  />
                </div>
                <div className="flex items-center gap-1 p-1 bg-slate-950 border border-slate-800 rounded-lg">
                  {(["ALL", "PRESENT", "NOT_MARKED"] as const).map((status) => (
                    <button
                      key={status}
                      onClick={() => setAttendanceFilter(status)}
                      className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors cursor-pointer whitespace-nowrap shrink-0 ${
                        attendanceFilter === status
                          ? "bg-slate-800 text-white"
                          : "text-slate-400 hover:text-slate-200"
                      }`}
                    >
                      {status === "ALL" ? "All Participants" : status === "PRESENT" ? "Present" : "Not Marked"}
                    </button>
                  ))}
                </div>
              </div>

              {/* Add Participant Form Modal */}
              {showAddParticipant && (
                <form
                  onSubmit={handleCreateParticipant}
                  className="bg-slate-900 border border-slate-700 rounded-xl p-5 space-y-4"
                >
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-semibold text-white">
                      Register New Participant in {eventInfo?.eventId}
                    </h3>
                    <button
                      type="button"
                      onClick={() => setShowAddParticipant(false)}
                      className="text-slate-400 hover:text-white cursor-pointer"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <input
                      type="text"
                      required
                      placeholder="Full Name"
                      value={newParticipant.name}
                      onChange={(e) => setNewParticipant({ ...newParticipant, name: e.target.value })}
                      className="h-10 bg-slate-950 border border-slate-800 rounded-lg px-3 text-xs text-white"
                    />
                    <input
                      type="email"
                      required
                      placeholder="Email Address"
                      value={newParticipant.email}
                      onChange={(e) => setNewParticipant({ ...newParticipant, email: e.target.value })}
                      className="h-10 bg-slate-950 border border-slate-800 rounded-lg px-3 text-xs text-white"
                    />
                    <input
                      type="text"
                      placeholder="Enrollment No (e.g. MU23BCS105)"
                      value={newParticipant.enrollmentNumber}
                      onChange={(e) => setNewParticipant({ ...newParticipant, enrollmentNumber: e.target.value })}
                      className="h-10 bg-slate-950 border border-slate-800 rounded-lg px-3 text-xs font-mono text-white"
                    />
                    <input
                      type="text"
                      placeholder="Phone Number"
                      value={newParticipant.phone}
                      onChange={(e) => setNewParticipant({ ...newParticipant, phone: e.target.value })}
                      className="h-10 bg-slate-950 border border-slate-800 rounded-lg px-3 text-xs font-mono text-white"
                    />
                    <input
                      type="text"
                      placeholder="Department"
                      value={newParticipant.department}
                      onChange={(e) => setNewParticipant({ ...newParticipant, department: e.target.value })}
                      className="h-10 bg-slate-950 border border-slate-800 rounded-lg px-3 text-xs text-white"
                    />
                    <button
                      type="submit"
                      className="h-10 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold rounded-lg cursor-pointer"
                    >
                      Save Participant Record
                    </button>
                  </div>
                </form>
              )}

              {/* Participants Table */}
              <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse text-xs">
                    <thead>
                      <tr className="border-b border-slate-800 text-slate-400 bg-slate-950/50">
                        <th className="py-3 px-4 font-medium">Registration ID</th>
                        <th className="py-3 px-4 font-medium">Participant</th>
                        <th className="py-3 px-4 font-medium">Enrollment · Dept</th>
                        <th className="py-3 px-4 font-medium">Attendance</th>
                        <th className="py-3 px-4 font-medium">Certificate · Email</th>
                        <th className="py-3 px-4 font-medium text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800/70">
                      {filteredParticipants.map((p) => (
                        <tr key={p.registrationId} className="hover:bg-slate-800/40">
                          <td className="py-3 px-4 font-mono tabular-nums text-emerald-400 whitespace-nowrap">
                            {p.registrationId}
                          </td>
                          <td className="py-3 px-4">
                            <div className="font-medium text-white">{p.name}</div>
                            <div className="text-slate-400 font-mono text-[11px]">{p.email}</div>
                          </td>
                          <td className="py-3 px-4 text-slate-300">
                            <span className="font-mono">{p.enrollmentNumber || "N/A"}</span>
                            <span className="mx-1.5 text-slate-600">·</span>
                            <span>{p.department}</span>
                          </td>
                          <td className="py-3 px-4 font-mono">
                            <span
                              className={
                                p.attendanceStatus === "PRESENT" ? "text-emerald-400 font-semibold" : "text-slate-400"
                              }
                            >
                              {p.attendanceStatus}
                            </span>
                          </td>
                          <td className="py-3 px-4 font-mono text-[11px] text-slate-300">
                            <span>{p.certificateStatus}</span>
                            <span className="mx-1.5 text-slate-600">·</span>
                            <span
                              className={
                                p.emailStatus === "SENT"
                                  ? "text-emerald-400"
                                  : p.emailStatus === "FAILED"
                                  ? "text-red-400"
                                  : "text-slate-400"
                              }
                            >
                              Email: {p.emailStatus}
                            </span>
                          </td>
                          <td className="py-3 px-4 text-right whitespace-nowrap space-x-2">
                            <button
                              onClick={() =>
                                handleToggleAttendance(
                                  p.registrationId,
                                  p.attendanceStatus === "PRESENT" ? "NOT_MARKED" : "PRESENT"
                                )
                              }
                              className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded text-[11px] font-medium cursor-pointer"
                            >
                              {p.attendanceStatus === "PRESENT" ? "Unmark" : "Mark Present"}
                            </button>
                            <button
                              onClick={() => handlePreviewCertAndEmail(p.registrationId)}
                              className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-emerald-400 rounded text-[11px] font-medium cursor-pointer"
                            >
                              Preview Cert
                            </button>
                          </td>
                        </tr>
                      ))}
                      {filteredParticipants.length === 0 && (
                        <tr>
                          <td colSpan={6} className="py-8 text-center text-slate-500">
                            No matching participant registrations found for {eventInfo?.eventId}.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: JURY REGISTRATIONS */}
          {activeTab === "jury" && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h1 className="text-xl font-bold text-white">Jury &amp; Evaluator Registrations ({eventInfo?.eventId})</h1>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Dedicated evaluation panels and invited jury members assigned strictly to {eventInfo?.eventName}.
                  </p>
                </div>
                <button
                  onClick={() => setShowAddJury(true)}
                  className="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-medium rounded-lg flex items-center gap-2 cursor-pointer whitespace-nowrap shrink-0"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add Jury Member</span>
                </button>
              </div>

              {showAddJury && (
                <form
                  onSubmit={handleCreateJury}
                  className="bg-slate-900 border border-slate-700 rounded-xl p-5 space-y-4"
                >
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-semibold text-white">Register Jury Member for {eventInfo?.eventId}</h3>
                    <button
                      type="button"
                      onClick={() => setShowAddJury(false)}
                      className="text-slate-400 hover:text-white cursor-pointer"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <input
                      type="text"
                      required
                      placeholder="Jury Full Name"
                      value={newJury.name}
                      onChange={(e) => setNewJury({ ...newJury, name: e.target.value })}
                      className="h-10 bg-slate-950 border border-slate-800 rounded-lg px-3 text-xs text-white"
                    />
                    <input
                      type="email"
                      required
                      placeholder="Official Email"
                      value={newJury.email}
                      onChange={(e) => setNewJury({ ...newJury, email: e.target.value })}
                      className="h-10 bg-slate-950 border border-slate-800 rounded-lg px-3 text-xs text-white"
                    />
                    <input
                      type="text"
                      placeholder="Organization / Institution"
                      value={newJury.organization}
                      onChange={(e) => setNewJury({ ...newJury, organization: e.target.value })}
                      className="h-10 bg-slate-950 border border-slate-800 rounded-lg px-3 text-xs text-white"
                    />
                    <input
                      type="text"
                      placeholder="Designation"
                      value={newJury.designation}
                      onChange={(e) => setNewJury({ ...newJury, designation: e.target.value })}
                      className="h-10 bg-slate-950 border border-slate-800 rounded-lg px-3 text-xs text-white"
                    />
                    <input
                      type="text"
                      placeholder="Panel Name"
                      value={newJury.panelName}
                      onChange={(e) => setNewJury({ ...newJury, panelName: e.target.value })}
                      className="h-10 bg-slate-950 border border-slate-800 rounded-lg px-3 text-xs text-white"
                    />
                    <button
                      type="submit"
                      className="h-10 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold rounded-lg cursor-pointer"
                    >
                      Save Jury Registration
                    </button>
                  </div>
                </form>
              )}

              <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl">
                <div className="relative">
                  <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={jurySearch}
                    onChange={(e) => setJurySearch(e.target.value)}
                    placeholder="Filter jury by name, organization, panel, or track..."
                    className="w-full h-10 bg-slate-950 border border-slate-800 rounded-lg pl-10 pr-4 text-xs text-white placeholder:text-slate-500 outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse text-xs">
                    <thead>
                      <tr className="border-b border-slate-800 text-slate-400 bg-slate-950/50">
                        <th className="py-3 px-4 font-medium">Jury ID</th>
                        <th className="py-3 px-4 font-medium">Evaluator</th>
                        <th className="py-3 px-4 font-medium">Organization · Designation</th>
                        <th className="py-3 px-4 font-medium">Assigned Panel · Track</th>
                        <th className="py-3 px-4 font-medium">Status</th>
                        <th className="py-3 px-4 font-medium text-right">Check-In Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800/70">
                      {filteredJury.map((j) => (
                        <tr key={j.juryId} className="hover:bg-slate-800/40">
                          <td className="py-3 px-4 font-mono tabular-nums text-emerald-400 whitespace-nowrap">
                            {j.juryId}
                          </td>
                          <td className="py-3 px-4">
                            <div className="font-medium text-white">{j.name}</div>
                            <div className="text-slate-400 font-mono text-[11px]">{j.email}</div>
                          </td>
                          <td className="py-3 px-4 text-slate-300">
                            <span>{j.organization}</span>
                            <span className="mx-1.5 text-slate-600">·</span>
                            <span className="text-slate-400">{j.designation}</span>
                          </td>
                          <td className="py-3 px-4 text-slate-300">
                            <span>{j.panelName}</span>
                            <span className="mx-1.5 text-slate-600">·</span>
                            <span className="text-slate-400">{j.trackAssigned}</span>
                          </td>
                          <td className="py-3 px-4 font-mono">
                            <span
                              className={
                                j.status === "CHECKED_IN" ? "text-emerald-400 font-semibold" : "text-amber-400"
                              }
                            >
                              {j.status}
                            </span>
                          </td>
                          <td className="py-3 px-4 text-right whitespace-nowrap">
                            <button
                              onClick={() =>
                                handleJuryStatusChange(
                                  j.juryId,
                                  j.status === "CHECKED_IN" ? "CONFIRMED" : "CHECKED_IN"
                                )
                              }
                              className="px-3 py-1 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded text-[11px] font-medium cursor-pointer"
                            >
                              {j.status === "CHECKED_IN" ? "Reset to Confirmed" : "Check In Jury"}
                            </button>
                          </td>
                        </tr>
                      ))}
                      {filteredJury.length === 0 && (
                        <tr>
                          <td colSpan={6} className="py-8 text-center text-slate-500">
                            No jury registrations found for {eventInfo?.eventId}.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: ATTENDANCE VERIFICATION */}
          {activeTab === "attendance" && (
            <div className="space-y-6">
              <div>
                <h1 className="text-xl font-bold text-white">Attendance Verification ({eventInfo?.eventId})</h1>
                <p className="text-xs text-slate-400 mt-0.5">
                  Verify participant Registration IDs or QR codes and record live event attendance. Cross-event registration IDs are rejected automatically.
                </p>
              </div>

              <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-4">
                <label className="block text-xs font-medium text-slate-300">
                  Scan or Enter Registration ID / Enrollment Number / Participant Name
                </label>
                <div className="flex gap-3">
                  <div className="relative flex-1">
                    <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      value={attendanceLookupQuery}
                      onChange={(e) => setAttendanceLookupQuery(e.target.value)}
                      placeholder="e.g. REG-1001-102 or MU23BCS114"
                      className="w-full h-11 bg-slate-950 border border-slate-800 rounded-lg pl-10 pr-4 text-sm font-mono text-white placeholder:text-slate-500 outline-none focus:border-emerald-500"
                    />
                  </div>
                </div>
              </div>

              <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse text-xs">
                    <thead>
                      <tr className="border-b border-slate-800 text-slate-400 bg-slate-950/50">
                        <th className="py-3 px-4 font-medium">Registration ID</th>
                        <th className="py-3 px-4 font-medium">Participant</th>
                        <th className="py-3 px-4 font-medium">Enrollment</th>
                        <th className="py-3 px-4 font-medium">Status</th>
                        <th className="py-3 px-4 font-medium">Verified At · By</th>
                        <th className="py-3 px-4 font-medium text-right">Verify Attendance</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800/70">
                      {attendanceMatches.map((p) => (
                        <tr key={p.registrationId} className="hover:bg-slate-800/40">
                          <td className="py-3 px-4 font-mono tabular-nums text-emerald-400">
                            {p.registrationId}
                          </td>
                          <td className="py-3 px-4">
                            <div className="font-medium text-white">{p.name}</div>
                            <div className="text-slate-400 font-mono text-[11px]">{p.email}</div>
                          </td>
                          <td className="py-3 px-4 font-mono text-slate-300">
                            {p.enrollmentNumber || "N/A"}
                          </td>
                          <td className="py-3 px-4 font-mono">
                            <span
                              className={
                                p.attendanceStatus === "PRESENT"
                                  ? "text-emerald-400 font-semibold"
                                  : "text-amber-400"
                              }
                            >
                              {p.attendanceStatus}
                            </span>
                          </td>
                          <td className="py-3 px-4 font-mono text-[11px] text-slate-400">
                            {p.attendanceMarkedAt ? (
                              <>
                                <span>{p.attendanceMarkedAt}</span>
                                <span className="mx-1.5">·</span>
                                <span>{p.attendanceMarkedBy}</span>
                              </>
                            ) : (
                              <span>—</span>
                            )}
                          </td>
                          <td className="py-3 px-4 text-right whitespace-nowrap">
                            {p.attendanceStatus === "PRESENT" ? (
                              <button
                                onClick={() => handleToggleAttendance(p.registrationId, "NOT_MARKED")}
                                className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-xs font-medium cursor-pointer"
                              >
                                Revoke Present
                              </button>
                            ) : (
                              <button
                                onClick={() => handleToggleAttendance(p.registrationId, "PRESENT")}
                                className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-semibold cursor-pointer"
                              >
                                Mark Present
                              </button>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* TAB 5: CERTIFICATES & EMAIL DISPATCH */}
          {activeTab === "certificates" && (
            <div className="space-y-8">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h1 className="text-xl font-bold text-white">
                    Certificate Management &amp; Email Dispatch ({eventInfo?.eventId})
                  </h1>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Generate event-bound certificates for eligible (Present) participants, preview PDFs and formatted emails, send test emails, and retry failed dispatches.
                  </p>
                </div>
                <div className="flex flex-wrap items-center gap-2.5">
                  <button
                    onClick={() => handleGenerateCertificates()}
                    disabled={processingCerts}
                    className="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold rounded-lg flex items-center gap-2 cursor-pointer disabled:opacity-50 whitespace-nowrap shrink-0"
                  >
                    <Award className="w-3.5 h-3.5" />
                    <span>Generate All Eligible Certificates</span>
                  </button>
                  <button
                    onClick={() => handleSendSelectedEmails(false)}
                    disabled={processingCerts}
                    className="px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-white border border-slate-700 text-xs font-medium rounded-lg flex items-center gap-2 cursor-pointer disabled:opacity-50 whitespace-nowrap shrink-0"
                  >
                    <Send className="w-3.5 h-3.5 text-emerald-400" />
                    <span>
                      {selectedCertIds.length > 0
                        ? `Send Selected (${selectedCertIds.length})`
                        : "Send All Unsent Certificates"}
                    </span>
                  </button>
                  <button
                    onClick={() => handleSendSelectedEmails(true)}
                    disabled={processingCerts}
                    className="px-3.5 py-2 bg-amber-950/60 hover:bg-amber-900/60 text-amber-200 border border-amber-800/60 text-xs font-medium rounded-lg flex items-center gap-2 cursor-pointer disabled:opacity-50 whitespace-nowrap shrink-0"
                  >
                    <RefreshCw className="w-3.5 h-3.5" />
                    <span>Retry Failed Emails ({summary.emailsFailed})</span>
                  </button>
                </div>
              </div>

              {/* Send Test Email Bar */}
              <form
                onSubmit={handleSendTestEmail}
                className="bg-slate-900 border border-slate-800 rounded-xl p-4 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4"
              >
                <div className="text-xs">
                  <div className="font-semibold text-white">Send Formatted Test Certificate Email</div>
                  <div className="text-slate-400">
                    Verify the HTML email template and event branding for {eventInfo?.eventId} before batch dispatch.
                  </div>
                </div>
                <div className="flex items-center gap-2.5">
                  <input
                    type="email"
                    required
                    value={testEmailAddress}
                    onChange={(e) => setTestEmailAddress(e.target.value)}
                    placeholder="Enter test recipient email..."
                    className="h-10 w-64 bg-slate-950 border border-slate-800 rounded-lg px-3 text-xs text-white placeholder:text-slate-500 outline-none focus:border-emerald-500"
                  />
                  <button
                    type="submit"
                    disabled={processingCerts}
                    className="h-10 px-4 bg-slate-800 hover:bg-slate-700 text-emerald-400 text-xs font-semibold rounded-lg cursor-pointer whitespace-nowrap shrink-0"
                  >
                    Send Test Email
                  </button>
                </div>
              </form>

              {/* Certificates Table */}
              <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden">
                <div className="px-5 py-3.5 border-b border-slate-800 flex items-center justify-between">
                  <h2 className="text-sm font-semibold text-white">
                    Event Certificates ({certificates.length})
                  </h2>
                  <span className="text-xs text-slate-400">
                    Duplicate sends are automatically prevented
                  </span>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse text-xs">
                    <thead>
                      <tr className="border-b border-slate-800 text-slate-400 bg-slate-950/50">
                        <th className="py-3 px-4 w-8">
                          <input
                            type="checkbox"
                            checked={
                              certificates.length > 0 && selectedCertIds.length === certificates.length
                            }
                            onChange={(e) => {
                              if (e.target.checked) {
                                setSelectedCertIds(certificates.map((c) => c.certificateId));
                              } else {
                                setSelectedCertIds([]);
                              }
                            }}
                          />
                        </th>
                        <th className="py-3 px-4 font-medium">Certificate ID</th>
                        <th className="py-3 px-4 font-medium">Recipient</th>
                        <th className="py-3 px-4 font-medium">Event ID</th>
                        <th className="py-3 px-4 font-medium">Email Status · Attempts</th>
                        <th className="py-3 px-4 font-medium text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800/70">
                      {certificates.map((c) => (
                        <tr key={c.certificateId} className="hover:bg-slate-800/40">
                          <td className="py-3 px-4">
                            <input
                              type="checkbox"
                              checked={selectedCertIds.includes(c.certificateId)}
                              onChange={(e) => {
                                if (e.target.checked) {
                                  setSelectedCertIds([...selectedCertIds, c.certificateId]);
                                } else {
                                  setSelectedCertIds(selectedCertIds.filter((id) => id !== c.certificateId));
                                }
                              }}
                            />
                          </td>
                          <td className="py-3 px-4 font-mono tabular-nums text-emerald-400 whitespace-nowrap">
                            {c.certificateId}
                          </td>
                          <td className="py-3 px-4">
                            <div className="font-medium text-white">{c.participantName}</div>
                            <div className="text-slate-400 font-mono text-[11px]">{c.participantEmail}</div>
                          </td>
                          <td className="py-3 px-4 font-mono text-slate-300">{c.eventId}</td>
                          <td className="py-3 px-4 font-mono">
                            <span
                              className={
                                c.emailStatus === "SENT"
                                  ? "text-emerald-400 font-semibold"
                                  : c.emailStatus === "FAILED"
                                  ? "text-red-400 font-semibold"
                                  : "text-amber-400"
                              }
                            >
                              {c.emailStatus}
                            </span>
                            <span className="mx-1.5 text-slate-600">·</span>
                            <span className="text-slate-400">{c.sendAttempts} attempt(s)</span>
                            {c.emailError && (
                              <div className="text-[11px] text-red-400 mt-0.5 font-sans">{c.emailError}</div>
                            )}
                          </td>
                          <td className="py-3 px-4 text-right whitespace-nowrap space-x-2">
                            <button
                              onClick={() => handlePreviewCertAndEmail(c.certificateId)}
                              className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded text-[11px] font-medium cursor-pointer"
                            >
                              Preview Email &amp; PDF
                            </button>
                            <button
                              onClick={() => handleDownloadCertificatePdf(c)}
                              className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-emerald-400 rounded text-[11px] font-medium cursor-pointer"
                            >
                              Download PDF
                            </button>
                          </td>
                        </tr>
                      ))}
                      {certificates.length === 0 && (
                        <tr>
                          <td colSpan={6} className="py-8 text-center text-slate-500">
                            No certificates generated yet. Click &ldquo;Generate All Eligible Certificates&rdquo; above.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Email Audit History */}
              <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden">
                <div className="px-5 py-3.5 border-b border-slate-800 flex items-center justify-between">
                  <h2 className="text-sm font-semibold text-white">
                    Certificate Email Audit History ({emailLogs.length})
                  </h2>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse text-xs">
                    <thead>
                      <tr className="border-b border-slate-800 text-slate-400 bg-slate-950/50">
                        <th className="py-2.5 px-4 font-medium">Timestamp</th>
                        <th className="py-2.5 px-4 font-medium">Certificate ID</th>
                        <th className="py-2.5 px-4 font-medium">Recipient</th>
                        <th className="py-2.5 px-4 font-medium">Status</th>
                        <th className="py-2.5 px-4 font-medium">Triggered By</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800/70">
                      {emailLogs.map((log) => (
                        <tr key={log.logId} className="hover:bg-slate-800/40">
                          <td className="py-2.5 px-4 font-mono tabular-nums text-slate-400">
                            {new Date(log.timestamp).toLocaleString()}
                          </td>
                          <td className="py-2.5 px-4 font-mono text-slate-200">{log.certificateId}</td>
                          <td className="py-2.5 px-4">
                            <span className="text-white">{log.recipientName}</span>
                            <span className="mx-1.5 text-slate-600">·</span>
                            <span className="font-mono text-slate-400">{log.recipientEmail}</span>
                          </td>
                          <td className="py-2.5 px-4 font-mono">
                            <span className={log.status === "SENT" ? "text-emerald-400" : "text-red-400"}>
                              {log.status} {log.isTest ? "(TEST)" : ""}
                            </span>
                          </td>
                          <td className="py-2.5 px-4 text-slate-400">{log.triggeredBy}</td>
                        </tr>
                      ))}
                      {emailLogs.length === 0 && (
                        <tr>
                          <td colSpan={5} className="py-6 text-center text-slate-500">
                            No email attempts recorded yet for {eventInfo?.eventId}.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* TAB 5B: CERTIFICATE GENERATION PORTAL (EMBEDDED FORGECERT) */}
          {activeTab === "certificate-generator" && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h1 className="text-xl font-bold text-white">
                    Certificate Generation Portal ({eventInfo.eventId})
                  </h1>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Authorized workspace for <span className="text-slate-200 font-medium">{eventInfo.eventName}</span> ({eventInfo.eventId}) — External ForgeCert Certificate Studio.
                  </p>
                </div>
                <div className="flex flex-wrap items-center gap-2.5">
                  <button
                    type="button"
                    onClick={() => {
                      setForgeCertBlocked(false);
                      setForgeCertLoading(true);
                      setForgeCertReloadKey((prev) => prev + 1);
                    }}
                    className="px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-medium rounded-lg flex items-center gap-2 cursor-pointer whitespace-nowrap shrink-0"
                  >
                    <RefreshCw className={`w-3.5 h-3.5 ${forgeCertLoading ? "animate-spin" : ""}`} />
                    <span>Reload Application</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setForgeCertBlocked((prev) => !prev)}
                    className="px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 text-xs font-medium rounded-lg flex items-center gap-2 cursor-pointer whitespace-nowrap shrink-0"
                  >
                    <AlertCircle className="w-3.5 h-3.5 text-amber-400" />
                    <span>{forgeCertBlocked ? "Show Embedded Frame" : "Display Fallback View"}</span>
                  </button>
                  <a
                    href={FORGECERT_EMBED_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold rounded-lg flex items-center gap-2 transition-colors whitespace-nowrap shrink-0"
                  >
                    <span>Open ForgeCert in New Tab</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>

              {/* Clean Bordered White Container (Mirrors Contact Page Embedded Google Form Design) */}
              <div className="bg-[#FFFFFF] border border-[#E2E2DC] p-6 sm:p-8 shadow-[0_4px_20px_rgba(17,19,24,0.03)] space-y-4 text-[#111318] rounded-xl">
                {/* Top Header Strip inside Bordered White Container */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#E2E2DC] pb-4">
                  <div className="space-y-1">
                    <div className="font-mono text-xs font-bold uppercase tracking-widest text-[#111318]">
                      CERTIFICATE GENERATION PORTAL
                    </div>
                    <div className="text-xs text-[#555B63] font-sans">
                      Authenticated Event: <span className="font-semibold text-[#111318]">{eventInfo.eventName}</span>{" "}
                      <span className="font-mono text-[#00A86B] font-bold">({eventInfo.eventId})</span>
                      <span className="mx-1.5" aria-hidden="true">·</span>
                      <span>Operator: {eventInfo.operatorLabel}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 self-start sm:self-center">
                    <span className="font-mono text-[10px] uppercase tracking-widest text-[#00A86B] font-bold">
                      EXTERNAL CERTIFICATE APPLICATION
                    </span>
                  </div>
                </div>

                {/* Isolated Session & Security Notice */}
                <div className="bg-[#FAF9F5] border border-[#E2E2DC] p-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-[#555B63]">
                  <div>
                    <span className="font-semibold text-[#111318]">Session-Locked Event Scope:</span>{" "}
                    <span>
                      Identity verified on server as <strong className="text-[#111318]">{eventInfo.eventName} ({eventInfo.eventId})</strong>.
                      ForgeCert operates as a standalone external web application; no Apps Script secrets, spreadsheet IDs, session tokens, or participant PII are transmitted in the iframe URL.
                    </span>
                  </div>
                  <a
                    href={FORGECERT_EMBED_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-mono text-[11px] text-[#00A86B] hover:underline font-bold flex items-center gap-1 whitespace-nowrap shrink-0"
                  >
                    <span>Open ForgeCert in New Tab</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>

                {/* Responsive Embedded Application Frame / Fallback Panel */}
                {!forgeCertBlocked ? (
                  <div className="w-full overflow-hidden border border-[#E2E2DC] bg-[#FAF9F5] min-h-[760px] relative">
                    {forgeCertLoading && (
                      <div
                        role="status"
                        aria-live="polite"
                        className="absolute inset-0 z-10 bg-[#FAF9F5]/95 flex flex-col items-center justify-center p-6 text-center space-y-3"
                      >
                        <RefreshCw className="w-6 h-6 text-[#00A86B] animate-spin" />
                        <div className="font-mono text-xs uppercase tracking-widest text-[#111318] font-bold">
                          Loading Certificate Generation Portal…
                        </div>
                        <p className="text-xs text-[#555B63] max-w-md">
                          Connecting to external ForgeCert application for {eventInfo.eventName} ({eventInfo.eventId}).
                          If the application does not appear due to browser Content Security Policy or X-Frame-Options restrictions, use the fallback controls below.
                        </p>
                        <div className="pt-2 flex items-center gap-3">
                          <a
                            href={FORGECERT_EMBED_URL}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="px-4 py-2 bg-[#111318] hover:bg-[#00A86B] text-[#FFFFFF] font-mono text-xs uppercase tracking-wider transition-colors inline-flex items-center gap-2"
                          >
                            <span>Open ForgeCert in New Tab</span>
                            <ExternalLink className="w-3.5 h-3.5" />
                          </a>
                          <button
                            type="button"
                            onClick={() => {
                              setForgeCertLoading(false);
                              setForgeCertBlocked(true);
                            }}
                            className="px-3.5 py-2 border border-[#E2E2DC] bg-[#FFFFFF] hover:bg-[#F4F4F0] text-[#111318] font-mono text-xs uppercase tracking-wider transition-colors cursor-pointer"
                          >
                            Show Fallback Panel
                          </button>
                        </div>
                      </div>
                    )}

                    <iframe
                      key={forgeCertReloadKey}
                      src={FORGECERT_EMBED_URL}
                      width="100%"
                      height="780"
                      frameBorder="0"
                      marginHeight={0}
                      marginWidth={0}
                      referrerPolicy="no-referrer"
                      onLoad={() => setForgeCertLoading(false)}
                      onError={() => {
                        setForgeCertLoading(false);
                        setForgeCertBlocked(true);
                      }}
                      className="w-full min-h-[780px] bg-[#FFFFFF] block"
                      title={`Certificate Generation Portal — ForgeCert (${eventInfo.eventName} · ${eventInfo.eventId})`}
                    >
                      Loading External Certificate Application…
                    </iframe>
                  </div>
                ) : null}

                {/* Fallback Panel (Always rendered when embedding fails/is blocked, and accessible via fallback bar) */}
                {forgeCertBlocked ? (
                  <div
                    role="region"
                    aria-label="Certificate Generator Fallback Panel"
                    className="w-full border border-[#E2E2DC] bg-[#FAF9F5] p-8 sm:p-12 text-center space-y-5 min-h-[420px] flex flex-col items-center justify-center"
                  >
                    <div className="w-12 h-12 border border-[#E2E2DC] bg-[#FFFFFF] flex items-center justify-center text-[#00A86B]">
                      <AlertCircle className="w-6 h-6" />
                    </div>
                    <div className="space-y-2 max-w-xl">
                      <h2 className="text-base font-bold text-[#111318] font-mono uppercase tracking-wider">
                        External Certificate Application Embedding Unavailable
                      </h2>
                      <p className="text-xs sm:text-sm text-[#555B63] leading-relaxed">
                        The external certificate generator (<span className="font-mono text-[#111318]">https://forgecert-a.netlify.app/</span>) could not be displayed inside the embedded frame, or its Content Security Policy / X-Frame-Options headers restricted inline framing in your browser.
                      </p>
                      <p className="text-xs text-[#555B63]">
                        Current Verified Event Context:{" "}
                        <span className="font-semibold text-[#111318]">
                          {eventInfo.eventName} ({eventInfo.eventId})
                        </span>
                      </p>
                    </div>
                    <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
                      <a
                        href={FORGECERT_EMBED_URL}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="py-3 px-5 bg-[#111318] hover:bg-[#00A86B] text-[#F4F4F0] font-mono text-xs uppercase tracking-widest transition-colors inline-flex items-center gap-2"
                      >
                        <span>Open ForgeCert in New Tab</span>
                        <ExternalLink className="w-3.5 h-3.5" />
                      </a>
                      <button
                        type="button"
                        onClick={() => {
                          setForgeCertBlocked(false);
                          setForgeCertLoading(true);
                          setForgeCertReloadKey((prev) => prev + 1);
                        }}
                        className="py-3 px-4 bg-[#FFFFFF] hover:bg-[#F4F4F0] text-[#111318] border border-[#E2E2DC] font-mono text-xs uppercase tracking-widest transition-colors cursor-pointer inline-flex items-center gap-2"
                      >
                        <RefreshCw className="w-3.5 h-3.5" />
                        <span>Retry Embedded View</span>
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2 border-t border-[#E2E2DC] text-xs text-[#555B63]">
                    <div>
                      If the embedded panel above appears blank due to browser framing restrictions, open the external application directly or switch to the fallback panel.
                    </div>
                    <div className="flex items-center gap-4 shrink-0">
                      <button
                        type="button"
                        onClick={() => setForgeCertBlocked(true)}
                        className="font-mono text-[11px] text-[#555B63] hover:text-[#111318] underline cursor-pointer whitespace-nowrap"
                      >
                        Embedding Blocked? View Fallback
                      </button>
                      <a
                        href={FORGECERT_EMBED_URL}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="font-mono text-[11px] text-[#00A86B] hover:underline font-bold inline-flex items-center gap-1 whitespace-nowrap"
                      >
                        <span>Open ForgeCert in New Tab</span>
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TAB 6: SYNC & CONNECTION SETTINGS */}
          {activeTab === "settings" && (
            <div className="space-y-8">
              <div>
                <h1 className="text-xl font-bold text-white">
                  Independent Apps Script Integration &amp; Connection Settings ({eventInfo?.eventId})
                </h1>
                <p className="text-xs text-slate-400 mt-0.5">
                  Verify your event&apos;s Google Apps Script Web App connection and view or update spreadsheet sheet mappings.
                </p>
              </div>

              {/* Test Connection Diagnostic Panel */}
              <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <h2 className="text-base font-semibold text-white">Non-Destructive Connection Verification</h2>
                    <p className="text-xs text-slate-400">
                      Verifies endpoint URL safety, HTTPS protocol, JSON response structure, and spreadsheet access without modifying any records.
                    </p>
                  </div>
                  <button
                    onClick={handleTestConnection}
                    disabled={testingConnection}
                    className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold rounded-lg cursor-pointer disabled:opacity-50 whitespace-nowrap shrink-0"
                  >
                    {testingConnection ? "Running Probe..." : "Run Test Connection"}
                  </button>
                </div>

                {connectionDiagnostic && (
                  <div className="p-4 bg-slate-950 border border-slate-800 rounded-lg space-y-2 text-xs font-mono">
                    <div className="flex items-center justify-between">
                      <span className="text-slate-400">Overall Status:</span>
                      <span className={connectionDiagnostic.success ? "text-emerald-400 font-bold" : "text-red-400 font-bold"}>
                        {connectionDiagnostic.success ? "VERIFIED HEALTHY" : "CONNECTION FAILED"}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-slate-400">Endpoint URL Validation:</span>
                      <span>{connectionDiagnostic.endpointValid ? "PASS (HTTPS Google Script)" : "FAIL"}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-slate-400">JSON Format &amp; Sheet Access:</span>
                      <span>{connectionDiagnostic.sheetAccessVerified ? "VERIFIED" : "FAILED"}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-slate-400">Round-Trip Latency:</span>
                      <span className="tabular-nums">{connectionDiagnostic.latencyMs} ms</span>
                    </div>
                    {connectionDiagnostic.error && (
                      <div className="text-red-400 pt-1">Error: {connectionDiagnostic.error}</div>
                    )}
                  </div>
                )}
              </div>

              {/* Integration Configuration Form */}
              <form
                onSubmit={handleSaveIntegrationSettings}
                className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-5"
              >
                <div className="flex items-center justify-between border-b border-slate-800 pb-4">
                  <div>
                    <h2 className="text-base font-semibold text-white">
                      Event Endpoint &amp; Spreadsheet Mapping
                    </h2>
                    <p className="text-xs text-slate-400 mt-0.5">
                      {eventInfo?.allowOperatorSettingsEdit
                        ? "Master Administrator has authorized operator edits for this event."
                        : "Read-only mode: Integration settings are locked by the Master Administrator."}
                    </p>
                  </div>
                  <span className="text-xs font-mono text-slate-400">
                    {eventInfo?.allowOperatorSettingsEdit ? "EDITABLE" : "LOCKED BY MASTER ADMIN"}
                  </span>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-medium text-slate-300 mb-1.5">
                      Event-Specific Google Apps Script Web App URL
                    </label>
                    <input
                      type="text"
                      disabled={!eventInfo?.allowOperatorSettingsEdit}
                      value={settingsForm.appsScriptUrl}
                      onChange={(e) => setSettingsForm({ ...settingsForm, appsScriptUrl: e.target.value })}
                      className="w-full h-10 bg-slate-950 border border-slate-800 rounded-lg px-3 text-xs font-mono text-slate-200 disabled:opacity-60"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-xs font-medium text-slate-300 mb-1.5">
                        Spreadsheet ID
                      </label>
                      <input
                        type="text"
                        disabled={!eventInfo?.allowOperatorSettingsEdit}
                        value={settingsForm.spreadsheetId}
                        onChange={(e) => setSettingsForm({ ...settingsForm, spreadsheetId: e.target.value })}
                        className="w-full h-10 bg-slate-950 border border-slate-800 rounded-lg px-3 text-xs font-mono text-slate-200 disabled:opacity-60"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-slate-300 mb-1.5">
                        Participants Sheet Tab
                      </label>
                      <input
                        type="text"
                        disabled={!eventInfo?.allowOperatorSettingsEdit}
                        value={settingsForm.registrationsSheet}
                        onChange={(e) => setSettingsForm({ ...settingsForm, registrationsSheet: e.target.value })}
                        className="w-full h-10 bg-slate-950 border border-slate-800 rounded-lg px-3 text-xs font-mono text-slate-200 disabled:opacity-60"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-slate-300 mb-1.5">
                        Jury Sheet Tab
                      </label>
                      <input
                        type="text"
                        disabled={!eventInfo?.allowOperatorSettingsEdit}
                        value={settingsForm.jurySheet}
                        onChange={(e) => setSettingsForm({ ...settingsForm, jurySheet: e.target.value })}
                        className="w-full h-10 bg-slate-950 border border-slate-800 rounded-lg px-3 text-xs font-mono text-slate-200 disabled:opacity-60"
                      />
                    </div>
                  </div>
                </div>

                {eventInfo?.allowOperatorSettingsEdit && (
                  <div className="pt-2">
                    <button
                      type="submit"
                      className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold rounded-lg cursor-pointer"
                    >
                      Save Integration Settings
                    </button>
                  </div>
                )}
              </form>
            </div>
          )}
        </main>
      </div>

      {/* Certificate & Email Preview Modal */}
      {previewModalData && (
        <div className="fixed inset-0 z-50 bg-black/75 flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-slate-900 border border-slate-700 rounded-xl max-w-3xl w-full p-6 space-y-5">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div>
                <h3 className="text-base font-bold text-white">
                  Certificate &amp; Email Preview — {previewModalData.certificate.certificateId}
                </h3>
                <p className="text-xs text-slate-400 font-mono">
                  Recipient: {previewModalData.certificate.participantName} &lt;{previewModalData.certificate.participantEmail}&gt; · Event: {previewModalData.certificate.eventId}
                </p>
              </div>
              <button
                onClick={() => setPreviewModalData(null)}
                className="text-slate-400 hover:text-white cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-2 text-xs">
              <div className="text-slate-400">
                Subject: <span className="text-white font-medium">{previewModalData.emailPreview.subject}</span>
              </div>
              <div
                className="border border-slate-800 rounded-lg overflow-hidden max-h-96 overflow-y-auto bg-white text-slate-900 p-2"
                dangerouslySetInnerHTML={{ __html: previewModalData.emailPreview.html }}
              />
            </div>

            <div className="flex items-center justify-end gap-3 pt-2 border-t border-slate-800">
              <button
                onClick={() => handleDownloadCertificatePdf(previewModalData.certificate)}
                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold rounded-lg cursor-pointer"
              >
                Download Certificate PDF
              </button>
              <button
                onClick={() => setPreviewModalData(null)}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium rounded-lg cursor-pointer"
              >
                Close Preview
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
