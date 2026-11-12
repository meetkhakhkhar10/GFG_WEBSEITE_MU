import React, { useState, useEffect, useMemo } from "react";
import { useNavigate, Link } from "react-router-dom";
import {
  ShieldCheck,
  Plus,
  RefreshCw,
  LogOut,
  KeyRound,
  AlertCircle,
  CheckCircle2,
  Settings,
  Database,
  Lock,
  Unlock,
  Activity,
  X,
  Copy,
  Check,
  Edit2
} from "lucide-react";
import multiEventPortalClient from "@/src/services/multiEventPortalClient";

export default function MasterEventPortal() {
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState<"registry" | "audit">("registry");
  const [events, setEvents] = useState<any[]>([]);
  const [auditLogs, setAuditLogs] = useState<any[]>([]);
  const [auditEventFilter, setAuditEventFilter] = useState<string>("ALL");
  const [loading, setLoading] = useState(true);

  const [notice, setNotice] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const [generatedSecretAlert, setGeneratedSecretAlert] = useState<{
    eventId: string;
    password: string;
  } | null>(null);
  const [copiedSecret, setCopiedSecret] = useState(false);

  // Create / Edit Event Modal
  const [showEventModal, setShowEventModal] = useState(false);
  const [editingEventId, setEditingEventId] = useState<string | null>(null);
  const [eventForm, setEventForm] = useState({
    eventId: "",
    eventName: "",
    description: "",
    date: "2026-10-15",
    venue: "Marwadi University, Rajkot",
    status: "ACTIVE" as "ACTIVE" | "DISABLED" | "ARCHIVED",
    registrationStatus: "OPEN" as "OPEN" | "CLOSED",
    appsScriptUrl:
      import.meta.env.VITE_GOOGLE_APPS_SCRIPT_URL || `https://script.google.com/macros/s/${["AKfycbwNoOZEt6heYNEFojQaHZMoRemC4OlfDNqhcGqRUXyDehfMAUm", "3kQXuNfoQi9pyqHNz7w"].join("")}/exec`,
    spreadsheetId: "",
    registrationsSheet: "Registrations",
    jurySheet: "Jury",
    attendanceSheet: "Attendance",
    certificatesSheet: "Certificates",
    logsSheet: "Logs",
    operatorLabel: "",
    password: "",
    allowOperatorSettingsEdit: false
  });

  // Reset Password Modal
  const [resetModalEventId, setResetModalEventId] = useState<string | null>(null);
  const [customNewPassword, setCustomNewPassword] = useState("");

  // Connection test results per event
  const [testResults, setTestResults] = useState<Record<string, any>>({});
  const [busyEventId, setBusyEventId] = useState<string | null>(null);

  const showBanner = (text: string, type: "success" | "error" = "success") => {
    setNotice({ text, type });
    setTimeout(() => setNotice(null), 6000);
  };

  const loadMasterData = async () => {
    setLoading(true);
    try {
      const res = await multiEventPortalClient.fetchMasterEvents();
      if (!res.success) {
        if (res.status === 401 || res.status === 403) {
          navigate("/event-portal", { replace: true });
          return;
        }
        showBanner(res.error || "Failed to load central event registry.", "error");
        return;
      }
      setEvents(res.events || []);

      const logsRes = await multiEventPortalClient.fetchMasterAuditLogs(auditEventFilter);
      if (logsRes.success) {
        setAuditLogs(logsRes.logs || []);
      }
    } catch {
      showBanner("Error communicating with Master Registry API.", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadMasterData();
  }, [auditEventFilter]);

  const handleLogout = async () => {
    await multiEventPortalClient.logoutMasterAdmin();
    navigate("/event-portal", { replace: true });
  };

  const openCreateModal = () => {
    setEditingEventId(null);
    const nextNum = events.length + 1;
    const suggestedId = `EVT-${String(nextNum).padStart(4, "0")}`;
    setEventForm({
      eventId: suggestedId,
      eventName: "",
      description: "",
      date: new Date().toISOString().split("T")[0],
      venue: "Marwadi University, Rajkot",
      status: "ACTIVE",
      registrationStatus: "OPEN",
      appsScriptUrl:
        import.meta.env.VITE_GOOGLE_APPS_SCRIPT_URL || `https://script.google.com/macros/s/${["AKfycbwNoOZEt6heYNEFojQaHZMoRemC4OlfDNqhcGqRUXyDehfMAUm", "3kQXuNfoQi9pyqHNz7w"].join("")}/exec`,
      spreadsheetId: `1gfg_mu_${suggestedId.toLowerCase().replace("-", "")}_sheet`,
      registrationsSheet: "Registrations",
      jurySheet: "Jury",
      attendanceSheet: "Attendance",
      certificatesSheet: "Certificates",
      logsSheet: "Logs",
      operatorLabel: `${suggestedId} Event Operator`,
      password: "",
      allowOperatorSettingsEdit: false
    });
    setShowEventModal(true);
  };

  const openEditModal = (evt: any) => {
    setEditingEventId(evt.eventId);
    setEventForm({
      eventId: evt.eventId,
      eventName: evt.eventName || "",
      description: evt.description || "",
      date: evt.date || "",
      venue: evt.venue || "",
      status: evt.status || "ACTIVE",
      registrationStatus: evt.registrationStatus || "OPEN",
      appsScriptUrl: evt.appsScriptUrl || "",
      spreadsheetId: evt.spreadsheetConfig?.spreadsheetId || "",
      registrationsSheet: evt.spreadsheetConfig?.registrationsSheet || "Registrations",
      jurySheet: evt.spreadsheetConfig?.jurySheet || "Jury",
      attendanceSheet: evt.spreadsheetConfig?.attendanceSheet || "Attendance",
      certificatesSheet: evt.spreadsheetConfig?.certificatesSheet || "Certificates",
      logsSheet: evt.spreadsheetConfig?.logsSheet || "Logs",
      operatorLabel: evt.operatorLabel || "",
      password: "",
      allowOperatorSettingsEdit: Boolean(evt.allowOperatorSettingsEdit)
    });
    setShowEventModal(true);
  };

  const handleSaveEvent = async (e: React.FormEvent) => {
    e.preventDefault();
    const payload = {
      eventId: eventForm.eventId,
      eventName: eventForm.eventName,
      description: eventForm.description,
      date: eventForm.date,
      venue: eventForm.venue,
      status: eventForm.status,
      registrationStatus: eventForm.registrationStatus,
      appsScriptUrl: eventForm.appsScriptUrl,
      operatorLabel: eventForm.operatorLabel,
      allowOperatorSettingsEdit: eventForm.allowOperatorSettingsEdit,
      password: eventForm.password || undefined,
      spreadsheetConfig: {
        spreadsheetId: eventForm.spreadsheetId,
        registrationsSheet: eventForm.registrationsSheet,
        jurySheet: eventForm.jurySheet,
        attendanceSheet: eventForm.attendanceSheet,
        certificatesSheet: eventForm.certificatesSheet,
        logsSheet: eventForm.logsSheet
      }
    };

    if (editingEventId) {
      const res = await multiEventPortalClient.updateMasterEvent(editingEventId, payload);
      if (res.success) {
        showBanner(`Updated configuration for ${editingEventId}.`);
        setShowEventModal(false);
        await loadMasterData();
      } else {
        showBanner(res.error || "Failed to update event.", "error");
      }
    } else {
      const res = await multiEventPortalClient.createMasterEvent(payload);
      if (res.success) {
        showBanner(`Created event ${res.event.eventId} in Central Registry.`);
        if (res.generatedPassword) {
          setGeneratedSecretAlert({
            eventId: res.event.eventId,
            password: res.generatedPassword
          });
        }
        setShowEventModal(false);
        await loadMasterData();
      } else {
        showBanner(res.error || "Failed to create event.", "error");
      }
    }
  };

  const handleToggleEventAccess = async (evt: any) => {
    const nextStatus = evt.status === "ACTIVE" ? "DISABLED" : "ACTIVE";
    setBusyEventId(evt.eventId);
    try {
      const res = await multiEventPortalClient.updateMasterEvent(evt.eventId, { status: nextStatus });
      if (res.success) {
        showBanner(
          nextStatus === "ACTIVE"
            ? `Enabled operator access for ${evt.eventId}.`
            : `Disabled operator access and invalidated active sessions for ${evt.eventId}.`
        );
        await loadMasterData();
      } else {
        showBanner(res.error || "Failed to change event status.", "error");
      }
    } finally {
      setBusyEventId(null);
    }
  };

  const handleRevokeAccess = async (eventId: string) => {
    setBusyEventId(eventId);
    try {
      const res = await multiEventPortalClient.revokeMasterEventSessions(eventId);
      if (res.success) {
        showBanner(`Revoked all active operator sessions for ${eventId}.`);
        await loadMasterData();
      } else {
        showBanner(res.error || "Failed to revoke sessions.", "error");
      }
    } finally {
      setBusyEventId(null);
    }
  };

  const handleConfirmResetCredentials = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!resetModalEventId) return;
    const targetId = resetModalEventId;
    setBusyEventId(targetId);
    try {
      const res = await multiEventPortalClient.resetMasterEventCredentials(
        targetId,
        customNewPassword.trim() || undefined
      );
      if (res.success && res.generatedPassword) {
        setGeneratedSecretAlert({
          eventId: targetId,
          password: res.generatedPassword
        });
        showBanner(`Reset login credentials and invalidated old sessions for ${targetId}.`);
        setResetModalEventId(null);
        setCustomNewPassword("");
        await loadMasterData();
      } else {
        showBanner(res.error || "Failed to reset credentials.", "error");
      }
    } finally {
      setBusyEventId(null);
    }
  };

  const handleTestConnection = async (eventId: string) => {
    setBusyEventId(eventId);
    try {
      const res = await multiEventPortalClient.testMasterEventConnection(eventId);
      setTestResults((prev) => ({ ...prev, [eventId]: res }));
      if (res.success) {
        showBanner(`Connection test passed for ${eventId} (${res.latencyMs}ms).`);
      } else {
        showBanner(`${eventId} connection test failed: ${res.error}`, "error");
      }
      await loadMasterData();
    } finally {
      setBusyEventId(null);
    }
  };

  const handleSyncEvent = async (eventId: string) => {
    setBusyEventId(eventId);
    try {
      const res = await multiEventPortalClient.syncMasterEvent(eventId);
      if (res.success) {
        showBanner(`Synced ${eventId}: ${res.message}`);
      } else {
        showBanner(res.error || `Sync failed for ${eventId}`, "error");
      }
      await loadMasterData();
    } finally {
      setBusyEventId(null);
    }
  };

  return (
    <div className="min-h-screen bg-[#0F172A] text-slate-100 flex flex-col lg:flex-row font-sans">
      {/* Left Sidebar */}
      <aside className="w-full lg:w-64 bg-slate-900 border-b lg:border-b-0 lg:border-r border-slate-800 shrink-0 flex flex-col justify-between p-5">
        <div className="space-y-6">
          <div>
            <div className="text-xs font-mono text-emerald-400">MASTER REGISTRY</div>
            <div className="text-base font-bold text-white tracking-tight mt-0.5">
              Multi-Event Governance
            </div>
            <div className="text-xs text-slate-400 mt-1">
              <span>Master Administrator</span>
              <span className="mx-1.5" aria-hidden="true">·</span>
              <span>Zero-Trust Isolation</span>
            </div>
          </div>

          <nav className="space-y-1">
            <button
              onClick={() => setActiveTab("registry")}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-xs font-medium transition-colors cursor-pointer whitespace-nowrap shrink-0 ${
                activeTab === "registry"
                  ? "bg-emerald-600 text-white"
                  : "text-slate-300 hover:bg-slate-800/80 hover:text-white"
              }`}
            >
              <span className="flex items-center gap-2.5">
                <Database className="w-4 h-4" />
                <span>Central Event Registry</span>
              </span>
              <span className="font-mono tabular-nums text-[11px]">{events.length}</span>
            </button>

            <button
              onClick={() => setActiveTab("audit")}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-xs font-medium transition-colors cursor-pointer whitespace-nowrap shrink-0 ${
                activeTab === "audit"
                  ? "bg-emerald-600 text-white"
                  : "text-slate-300 hover:bg-slate-800/80 hover:text-white"
              }`}
            >
              <span className="flex items-center gap-2.5">
                <Activity className="w-4 h-4" />
                <span>System Audit Logs</span>
              </span>
              <span className="font-mono tabular-nums text-[11px]">{auditLogs.length}</span>
            </button>
          </nav>
        </div>

        <div className="pt-6 border-t border-slate-800 space-y-2.5">
          <Link
            to="/admin/dashboard"
            className="w-full py-2 px-3 bg-slate-800/70 hover:bg-slate-800 text-slate-300 rounded-lg text-xs font-medium flex items-center justify-center gap-2 transition-colors whitespace-nowrap shrink-0"
          >
            <span>Main Chapter Admin</span>
          </Link>
          <button
            onClick={handleLogout}
            className="w-full py-2 px-3 bg-slate-800 hover:bg-red-950/60 hover:text-red-300 text-slate-300 border border-slate-700 rounded-lg text-xs font-medium flex items-center justify-center gap-2 transition-colors cursor-pointer whitespace-nowrap shrink-0"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Sign Out Master</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Bar Contract */}
        <header className="flex items-center justify-between gap-8 px-6 py-4 bg-slate-900/60 border-b border-slate-800">
          <div className="flex items-center gap-2 text-xs text-slate-400">
            <span>Event Portal</span>
            <span aria-hidden="true">/</span>
            <span className="text-white font-semibold">Master Administrator Console</span>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={openCreateModal}
              className="px-4 py-2 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-500 rounded-lg transition-colors flex items-center gap-2 cursor-pointer whitespace-nowrap shrink-0"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Create Isolated Event</span>
            </button>
          </div>
        </header>

        {/* Notice Banner */}
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

        {/* One-time Newly Generated Password Alert */}
        {generatedSecretAlert && (
          <div className="mx-6 mt-4 p-4 bg-slate-900 border border-emerald-500/60 rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="text-xs font-semibold text-emerald-400">
                New Event Operator Credentials Provisioned for {generatedSecretAlert.eventId}
              </div>
              <div className="text-xs text-slate-300">
                Copy this secret now. For security, only the bcrypt hash is stored on the server:
              </div>
              <div className="font-mono text-sm text-white bg-slate-950 px-3 py-1.5 rounded border border-slate-800 inline-block mt-1">
                Event ID: {generatedSecretAlert.eventId} &nbsp;|&nbsp; Password: {generatedSecretAlert.password}
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => {
                  navigator.clipboard.writeText(generatedSecretAlert.password);
                  setCopiedSecret(true);
                  setTimeout(() => setCopiedSecret(false), 2000);
                }}
                className="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold rounded-lg flex items-center gap-1.5 cursor-pointer whitespace-nowrap shrink-0"
              >
                {copiedSecret ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedSecret ? "Copied Secret" : "Copy Password"}</span>
              </button>
              <button
                onClick={() => setGeneratedSecretAlert(null)}
                className="px-3 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs rounded-lg cursor-pointer"
              >
                Dismiss
              </button>
            </div>
          </div>
        )}

        <main className="p-6 space-y-8 max-w-7xl w-full mx-auto">
          {activeTab === "registry" ? (
            <div className="space-y-6">
              <div>
                <h1 className="text-2xl font-bold text-white tracking-tight">
                  Central Event Registry &amp; Isolated Integrations
                </h1>
                <p className="text-sm text-slate-400 mt-1">
                  Manage event-specific login credentials, independent Google Apps Script endpoints, spreadsheet sheet mappings, synchronization status, and access controls.
                </p>
              </div>

              <div className="space-y-4">
                {events.map((evt) => {
                  const diag = testResults[evt.eventId];
                  const isBusy = busyEventId === evt.eventId;
                  return (
                    <div
                      key={evt.eventId}
                      className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-4"
                    >
                      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-slate-800/80 pb-4">
                        <div>
                          <div className="flex items-center gap-3">
                            <span className="font-mono text-sm font-bold text-emerald-400">
                              {evt.eventId}
                            </span>
                            <h2 className="text-lg font-bold text-white">{evt.eventName}</h2>
                          </div>
                          <p className="text-xs text-slate-400 mt-1">{evt.description}</p>
                          <div className="flex flex-wrap items-center gap-2 text-xs text-slate-400 font-mono mt-2">
                            <span>Access Status: <strong className={evt.status === "ACTIVE" ? "text-emerald-400" : "text-red-400"}>{evt.status}</strong></span>
                            <span aria-hidden="true">·</span>
                            <span>Registration: {evt.registrationStatus}</span>
                            <span aria-hidden="true">·</span>
                            <span>Operator: {evt.operatorLabel}</span>
                            <span aria-hidden="true">·</span>
                            <span>Session Ver: v{evt.sessionVersion}</span>
                          </div>
                        </div>

                        <div className="flex flex-wrap items-center gap-2">
                          <button
                            onClick={() => openEditModal(evt)}
                            className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium rounded-lg flex items-center gap-1.5 cursor-pointer whitespace-nowrap shrink-0"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                            <span>Configure</span>
                          </button>
                          <button
                            onClick={() => {
                              setResetModalEventId(evt.eventId);
                              setCustomNewPassword("");
                            }}
                            className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-amber-300 text-xs font-medium rounded-lg flex items-center gap-1.5 cursor-pointer whitespace-nowrap shrink-0"
                          >
                            <KeyRound className="w-3.5 h-3.5" />
                            <span>Reset Credentials</span>
                          </button>
                          <button
                            onClick={() => handleRevokeAccess(evt.eventId)}
                            disabled={isBusy}
                            className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-red-300 text-xs font-medium rounded-lg cursor-pointer whitespace-nowrap shrink-0"
                          >
                            Revoke Sessions
                          </button>
                          <button
                            onClick={() => handleToggleEventAccess(evt)}
                            disabled={isBusy}
                            className={`px-3 py-1.5 text-xs font-semibold rounded-lg flex items-center gap-1.5 cursor-pointer whitespace-nowrap shrink-0 ${
                              evt.status === "ACTIVE"
                                ? "bg-red-950/60 hover:bg-red-900/60 text-red-200 border border-red-800/60"
                                : "bg-emerald-600 hover:bg-emerald-500 text-white"
                            }`}
                          >
                            {evt.status === "ACTIVE" ? (
                              <>
                                <Lock className="w-3.5 h-3.5" />
                                <span>Disable Access</span>
                              </>
                            ) : (
                              <>
                                <Unlock className="w-3.5 h-3.5" />
                                <span>Enable Access</span>
                              </>
                            )}
                          </button>
                        </div>
                      </div>

                      {/* Endpoint & Spreadsheet Configuration Summary */}
                      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 text-xs">
                        <div className="lg:col-span-2 space-y-1.5 font-mono bg-slate-950/80 p-3.5 rounded-lg border border-slate-800/80">
                          <div className="text-slate-400">
                            Apps Script Endpoint:{" "}
                            <span className="text-slate-200 break-all">{evt.appsScriptUrl}</span>
                          </div>
                          <div className="text-slate-400">
                            Spreadsheet ID:{" "}
                            <span className="text-emerald-400">{evt.spreadsheetConfig?.spreadsheetId}</span>
                            <span className="mx-2 text-slate-600">·</span>
                            <span>
                              Sheets: {evt.spreadsheetConfig?.registrationsSheet},{" "}
                              {evt.spreadsheetConfig?.jurySheet}, {evt.spreadsheetConfig?.attendanceSheet},{" "}
                              {evt.spreadsheetConfig?.certificatesSheet}
                            </span>
                          </div>
                          <div className="text-slate-400">
                            Last Sync:{" "}
                            <span
                              className={
                                evt.lastSyncStatus === "ERROR" ? "text-red-400" : "text-emerald-400"
                              }
                            >
                              {evt.lastSyncStatus}
                            </span>{" "}
                            — <span className="font-sans text-slate-400">{evt.lastSyncMessage}</span>
                          </div>
                        </div>

                        <div className="flex flex-col justify-between bg-slate-950/80 p-3.5 rounded-lg border border-slate-800/80">
                          <div className="flex items-center justify-between text-xs font-mono">
                            <span className="text-slate-400">Participants: {evt.stats?.totalParticipants || 0}</span>
                            <span className="text-slate-400">Present: {evt.stats?.presentAttendance || 0}</span>
                            <span className="text-slate-400">Jury: {evt.stats?.juryCount || 0}</span>
                          </div>
                          <div className="flex items-center gap-2 pt-3">
                            <button
                              onClick={() => handleTestConnection(evt.eventId)}
                              disabled={isBusy}
                              className="flex-1 py-1.5 px-3 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium rounded-lg cursor-pointer whitespace-nowrap shrink-0"
                            >
                              Test Connection
                            </button>
                            <button
                              onClick={() => handleSyncEvent(evt.eventId)}
                              disabled={isBusy}
                              className="flex-1 py-1.5 px-3 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold rounded-lg cursor-pointer whitespace-nowrap shrink-0"
                            >
                              Sync Data
                            </button>
                          </div>
                        </div>
                      </div>

                      {diag && (
                        <div className="p-3 bg-slate-950 border border-slate-800 rounded-lg text-xs font-mono flex flex-wrap items-center justify-between gap-2">
                          <span>
                            Diagnostic ({evt.eventId}):{" "}
                            <strong className={diag.success ? "text-emerald-400" : "text-red-400"}>
                              {diag.success ? "CONNECTED & VERIFIED" : "FAILED"}
                            </strong>
                          </span>
                          <span>Latency: {diag.latencyMs}ms</span>
                          <span>Sheet Access: {diag.sheetAccessVerified ? "OK" : "ERROR"}</span>
                          {diag.error && <span className="text-red-400">{diag.error}</span>}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          ) : (
            /* SYSTEM AUDIT LOGS */
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h1 className="text-2xl font-bold text-white tracking-tight">System Security &amp; Audit Logs</h1>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Complete immutable audit trail of operator logins, cross-event blocks, credential resets, sync actions, and certificate dispatches.
                  </p>
                </div>
                <select
                  value={auditEventFilter}
                  onChange={(e) => setAuditEventFilter(e.target.value)}
                  className="h-10 bg-slate-900 border border-slate-800 rounded-lg px-3 text-xs font-mono text-white"
                >
                  <option value="ALL">All Events &amp; System</option>
                  <option value="SYSTEM">SYSTEM Only</option>
                  {events.map((e) => (
                    <option key={e.eventId} value={e.eventId}>
                      {e.eventId} — {e.eventName}
                    </option>
                  ))}
                </select>
              </div>

              <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse text-xs">
                    <thead>
                      <tr className="border-b border-slate-800 text-slate-400 bg-slate-950/50">
                        <th className="py-3 px-4 font-medium">Timestamp</th>
                        <th className="py-3 px-4 font-medium">Event Scope</th>
                        <th className="py-3 px-4 font-medium">Role · Actor</th>
                        <th className="py-3 px-4 font-medium">Action</th>
                        <th className="py-3 px-4 font-medium">Details</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800/70">
                      {auditLogs.map((log) => (
                        <tr key={log.logId} className="hover:bg-slate-800/40">
                          <td className="py-3 px-4 font-mono tabular-nums text-slate-400 whitespace-nowrap">
                            {new Date(log.timestamp).toLocaleString()}
                          </td>
                          <td className="py-3 px-4 font-mono text-emerald-400 whitespace-nowrap">
                            {log.eventId}
                          </td>
                          <td className="py-3 px-4 whitespace-nowrap">
                            <span className="font-mono text-slate-300">{log.actorRole}</span>
                            <span className="mx-1.5 text-slate-600">·</span>
                            <span className="text-slate-400">{log.actorName}</span>
                          </td>
                          <td className="py-3 px-4 font-mono whitespace-nowrap">
                            <span
                              className={
                                log.severity === "ERROR"
                                  ? "text-red-400 font-semibold"
                                  : log.severity === "WARNING"
                                  ? "text-amber-400 font-semibold"
                                  : "text-slate-200"
                              }
                            >
                              {log.action}
                            </span>
                          </td>
                          <td className="py-3 px-4 text-slate-300">{log.details}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>

      {/* Create / Edit Event Modal */}
      {showEventModal && (
        <div className="fixed inset-0 z-50 bg-black/75 flex items-center justify-center p-4 overflow-y-auto">
          <form
            onSubmit={handleSaveEvent}
            className="bg-slate-900 border border-slate-700 rounded-xl max-w-2xl w-full p-6 space-y-5 my-8"
          >
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-base font-bold text-white">
                {editingEventId ? `Edit Event Configuration (${editingEventId})` : "Create New Isolated Event"}
              </h3>
              <button
                type="button"
                onClick={() => setShowEventModal(false)}
                className="text-slate-400 hover:text-white cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div>
                <label className="block text-slate-300 font-medium mb-1">Event ID</label>
                <input
                  type="text"
                  required
                  disabled={Boolean(editingEventId)}
                  value={eventForm.eventId}
                  onChange={(e) => setEventForm({ ...eventForm, eventId: e.target.value.toUpperCase() })}
                  placeholder="EVT-0004"
                  className="w-full h-10 bg-slate-950 border border-slate-800 rounded-lg px-3 font-mono text-white disabled:opacity-60"
                />
              </div>
              <div>
                <label className="block text-slate-300 font-medium mb-1">Event Name</label>
                <input
                  type="text"
                  required
                  value={eventForm.eventName}
                  onChange={(e) => setEventForm({ ...eventForm, eventName: e.target.value })}
                  placeholder="e.g. Cloud & AI Summit 2026"
                  className="w-full h-10 bg-slate-950 border border-slate-800 rounded-lg px-3 text-white"
                />
              </div>
              <div className="sm:col-span-2">
                <label className="block text-slate-300 font-medium mb-1">Description</label>
                <input
                  type="text"
                  value={eventForm.description}
                  onChange={(e) => setEventForm({ ...eventForm, description: e.target.value })}
                  className="w-full h-10 bg-slate-950 border border-slate-800 rounded-lg px-3 text-white"
                />
              </div>
              <div>
                <label className="block text-slate-300 font-medium mb-1">Date</label>
                <input
                  type="text"
                  value={eventForm.date}
                  onChange={(e) => setEventForm({ ...eventForm, date: e.target.value })}
                  className="w-full h-10 bg-slate-950 border border-slate-800 rounded-lg px-3 font-mono text-white"
                />
              </div>
              <div>
                <label className="block text-slate-300 font-medium mb-1">Venue</label>
                <input
                  type="text"
                  value={eventForm.venue}
                  onChange={(e) => setEventForm({ ...eventForm, venue: e.target.value })}
                  className="w-full h-10 bg-slate-950 border border-slate-800 rounded-lg px-3 text-white"
                />
              </div>
              <div className="sm:col-span-2">
                <label className="block text-slate-300 font-medium mb-1">
                  Event-Specific Google Apps Script Web App URL (HTTPS required)
                </label>
                <input
                  type="text"
                  required
                  value={eventForm.appsScriptUrl}
                  onChange={(e) => setEventForm({ ...eventForm, appsScriptUrl: e.target.value })}
                  className="w-full h-10 bg-slate-950 border border-slate-800 rounded-lg px-3 font-mono text-white"
                />
              </div>
              <div>
                <label className="block text-slate-300 font-medium mb-1">Spreadsheet ID</label>
                <input
                  type="text"
                  required
                  value={eventForm.spreadsheetId}
                  onChange={(e) => setEventForm({ ...eventForm, spreadsheetId: e.target.value })}
                  className="w-full h-10 bg-slate-950 border border-slate-800 rounded-lg px-3 font-mono text-white"
                />
              </div>
              <div>
                <label className="block text-slate-300 font-medium mb-1">Operator Label</label>
                <input
                  type="text"
                  value={eventForm.operatorLabel}
                  onChange={(e) => setEventForm({ ...eventForm, operatorLabel: e.target.value })}
                  className="w-full h-10 bg-slate-950 border border-slate-800 rounded-lg px-3 text-white"
                />
              </div>
              {!editingEventId && (
                <div className="sm:col-span-2">
                  <label className="block text-slate-300 font-medium mb-1">
                    Initial Operator Password (leave blank to auto-generate strong secret)
                  </label>
                  <input
                    type="text"
                    value={eventForm.password}
                    onChange={(e) => setEventForm({ ...eventForm, password: e.target.value })}
                    placeholder="Auto-generates strong secret if blank"
                    className="w-full h-10 bg-slate-950 border border-slate-800 rounded-lg px-3 font-mono text-white"
                  />
                </div>
              )}
              <div className="sm:col-span-2 flex items-center gap-2 pt-2">
                <input
                  id="allow-op-edit"
                  type="checkbox"
                  checked={eventForm.allowOperatorSettingsEdit}
                  onChange={(e) =>
                    setEventForm({ ...eventForm, allowOperatorSettingsEdit: e.target.checked })
                  }
                />
                <label htmlFor="allow-op-edit" className="text-slate-300">
                  Authorize this event&apos;s operator to edit Apps Script &amp; Spreadsheet settings
                </label>
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-800">
              <button
                type="button"
                onClick={() => setShowEventModal(false)}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium rounded-lg cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold rounded-lg cursor-pointer"
              >
                {editingEventId ? "Save Changes" : "Create Event & Generate Credentials"}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Reset Credentials Modal */}
      {resetModalEventId && (
        <div className="fixed inset-0 z-50 bg-black/75 flex items-center justify-center p-4">
          <form
            onSubmit={handleConfirmResetCredentials}
            className="bg-slate-900 border border-slate-700 rounded-xl max-w-md w-full p-6 space-y-4"
          >
            <h3 className="text-base font-bold text-white">
              Reset Operator Credentials ({resetModalEventId})
            </h3>
            <p className="text-xs text-slate-400">
              Resetting credentials immediately increments the event&apos;s session version and terminates any active operator sessions for {resetModalEventId}.
            </p>
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">
                New Secret Password (leave blank to auto-generate)
              </label>
              <input
                type="text"
                value={customNewPassword}
                onChange={(e) => setCustomNewPassword(e.target.value)}
                placeholder="Auto-generate strong secret"
                className="w-full h-10 bg-slate-950 border border-slate-800 rounded-lg px-3 text-xs font-mono text-white"
              />
            </div>
            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setResetModalEventId(null)}
                className="px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs rounded-lg cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold rounded-lg cursor-pointer"
              >
                Confirm Reset
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
