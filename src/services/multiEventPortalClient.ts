/**
 * Client-side API wrapper for the Multi-Event Login & Isolated Apps Script Integration Portal
 * Strictly communicates with server-side /api/portal/* endpoints using Bearer session tokens.
 * Handles non-JSON / HTML response fallbacks safely without crashing.
 */

import { safeFetchJson } from "../utils/fetchUtils";

const EVENT_TOKEN_KEY = "gfg_mu_event_operator_token";
const EVENT_SESSION_KEY = "gfg_mu_event_operator_session";
const MASTER_TOKEN_KEY = "gfg_mu_master_admin_token";

export interface EventOperatorSessionInfo {
  eventId: string;
  eventName: string;
  operatorLabel: string;
  allowOperatorSettingsEdit: boolean;
  expiresAt: string;
}

export const multiEventPortalClient = {
  // --- Session Token Management ---
  getEventToken(): string | null {
    try {
      return sessionStorage.getItem(EVENT_TOKEN_KEY) || localStorage.getItem(EVENT_TOKEN_KEY);
    } catch {
      return null;
    }
  },

  getEventSessionInfo(): EventOperatorSessionInfo | null {
    try {
      const raw = sessionStorage.getItem(EVENT_SESSION_KEY) || localStorage.getItem(EVENT_SESSION_KEY);
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  },

  setEventSession(token: string, session: EventOperatorSessionInfo) {
    try {
      sessionStorage.setItem(EVENT_TOKEN_KEY, token);
      sessionStorage.setItem(EVENT_SESSION_KEY, JSON.stringify(session));
      localStorage.setItem(EVENT_TOKEN_KEY, token);
      localStorage.setItem(EVENT_SESSION_KEY, JSON.stringify(session));
    } catch {}
  },

  clearEventSession() {
    try {
      sessionStorage.removeItem(EVENT_TOKEN_KEY);
      sessionStorage.removeItem(EVENT_SESSION_KEY);
      localStorage.removeItem(EVENT_TOKEN_KEY);
      localStorage.removeItem(EVENT_SESSION_KEY);
    } catch {}
  },

  getMasterToken(): string | null {
    try {
      return (
        sessionStorage.getItem(MASTER_TOKEN_KEY) ||
        localStorage.getItem(MASTER_TOKEN_KEY) ||
        localStorage.getItem("token")
      );
    } catch {
      return null;
    }
  },

  setMasterToken(token: string) {
    try {
      sessionStorage.setItem(MASTER_TOKEN_KEY, token);
      localStorage.setItem(MASTER_TOKEN_KEY, token);
    } catch {}
  },

  clearMasterSession() {
    try {
      sessionStorage.removeItem(MASTER_TOKEN_KEY);
      localStorage.removeItem(MASTER_TOKEN_KEY);
    } catch {}
  },

  // --- 1. Event Operator Auth & Endpoints ---
  async loginEventOperator(eventId: string, password: string) {
    const res = await safeFetchJson("/api/portal/event/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ eventId: eventId.trim().toUpperCase(), password })
    });
    const data = res.data || { success: false, message: res.error || "Event login failed" };
    if (res.ok && data.success && data.token && data.session) {
      this.setEventSession(data.token, data.session);
    }
    return { status: res.status, ...data };
  },

  async logoutEventOperator() {
    const token = this.getEventToken();
    try {
      if (token) {
        await safeFetchJson("/api/portal/event/logout", {
          method: "POST",
          headers: { Authorization: `Bearer ${token}` }
        });
      }
    } finally {
      this.clearEventSession();
    }
  },

  async fetchIsolatedDashboard() {
    const token = this.getEventToken();
    const res = await safeFetchJson("/api/portal/event/dashboard", {
      headers: { Authorization: `Bearer ${token || ""}` }
    });
    if (res.status === 401) {
      this.clearEventSession();
    }
    const data = res.data || { success: false, message: res.error || "Failed to fetch event dashboard" };
    return { status: res.status, ...data };
  },

  async addParticipant(payload: {
    name: string;
    email: string;
    phone?: string;
    enrollmentNumber?: string;
    department?: string;
    year?: string;
    college?: string;
  }) {
    const token = this.getEventToken();
    const res = await safeFetchJson("/api/portal/event/participants", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token || ""}`
      },
      body: JSON.stringify(payload)
    });
    return res.data || { success: false, message: res.error };
  },

  async addJuryMember(payload: {
    name: string;
    email: string;
    phone?: string;
    organization?: string;
    designation?: string;
    panelName?: string;
    trackAssigned?: string;
    status?: "CONFIRMED" | "INVITED" | "CHECKED_IN";
  }) {
    const token = this.getEventToken();
    const res = await safeFetchJson("/api/portal/event/jury", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token || ""}`
      },
      body: JSON.stringify(payload)
    });
    return res.data || { success: false, message: res.error };
  },

  async updateJuryStatus(juryId: string, status: "CONFIRMED" | "INVITED" | "CHECKED_IN") {
    const token = this.getEventToken();
    const res = await safeFetchJson(`/api/portal/event/jury/${encodeURIComponent(juryId)}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token || ""}`
      },
      body: JSON.stringify({ status })
    });
    return res.data || { success: false, message: res.error };
  },

  async markAttendance(registrationId: string, attendanceStatus: "PRESENT" | "NOT_MARKED") {
    const token = this.getEventToken();
    const res = await safeFetchJson("/api/portal/event/attendance", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token || ""}`
      },
      body: JSON.stringify({ registrationId, attendanceStatus })
    });
    return res.data || { success: false, message: res.error };
  },

  async generateCertificates(registrationIds?: string[]) {
    const token = this.getEventToken();
    const res = await safeFetchJson("/api/portal/event/certificates/generate", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token || ""}`
      },
      body: JSON.stringify({ registrationIds })
    });
    return res.data || { success: false, message: res.error };
  },

  async previewCertificateEmail(targetId: string) {
    const token = this.getEventToken();
    const res = await safeFetchJson(`/api/portal/event/certificates/preview/${encodeURIComponent(targetId)}`, {
      headers: { Authorization: `Bearer ${token || ""}` }
    });
    return res.data || { success: false, message: res.error };
  },

  async sendCertificateEmails(payload: {
    certificateIds?: string[];
    retryFailedOnly?: boolean;
    testRecipientEmail?: string;
  }) {
    const token = this.getEventToken();
    const res = await safeFetchJson("/api/portal/event/certificates/send-email", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token || ""}`
      },
      body: JSON.stringify(payload)
    });
    return res.data || { success: false, message: res.error };
  },

  async testConnection() {
    const token = this.getEventToken();
    const res = await safeFetchJson("/api/portal/event/test-connection", {
      method: "POST",
      headers: { Authorization: `Bearer ${token || ""}` }
    });
    return res.data || { success: false, message: res.error };
  },

  async syncEventData() {
    const token = this.getEventToken();
    const res = await safeFetchJson("/api/portal/event/sync", {
      method: "POST",
      headers: { Authorization: `Bearer ${token || ""}` }
    });
    return res.data || { success: false, message: res.error };
  },

  async updateOperatorIntegrationSettings(payload: {
    appsScriptUrl?: string;
    spreadsheetConfig?: any;
  }) {
    const token = this.getEventToken();
    const res = await safeFetchJson("/api/portal/event/settings", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token || ""}`
      },
      body: JSON.stringify(payload)
    });
    return res.data || { success: false, message: res.error };
  },

  async downloadParticipantsCsv(eventId: string) {
    const token = this.getEventToken();
    const apiBase = (import.meta.env.VITE_API_BASE_URL || "").replace(/\/$/, "");
    const res = await fetch(`${apiBase}/api/portal/event/export`, {
      headers: { Authorization: `Bearer ${token || ""}` }
    });
    if (!res.ok) throw new Error("Failed to export CSV");
    const blob = await res.blob();
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${eventId}_participants.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  },

  // --- 2. Master Administrator Endpoints ---
  async loginMasterAdmin(username: string, password: string) {
    const res = await safeFetchJson("/api/portal/master/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password })
    });
    const data = res.data || { success: false, message: res.error || "Master login failed" };
    if (res.ok && data.success && data.token) {
      this.setMasterToken(data.token);
    }
    return { status: res.status, ...data };
  },

  async logoutMasterAdmin() {
    const token = this.getMasterToken();
    try {
      if (token) {
        await safeFetchJson("/api/portal/master/logout", {
          method: "POST",
          headers: { Authorization: `Bearer ${token}` }
        });
      }
    } finally {
      this.clearMasterSession();
    }
  },

  async fetchMasterEvents() {
    const token = this.getMasterToken();
    const res = await safeFetchJson("/api/portal/master/events", {
      headers: { Authorization: `Bearer ${token || ""}` }
    });
    const data = res.data || { success: false, events: [], message: res.error };
    return { status: res.status, ...data };
  },

  async createMasterEvent(payload: any) {
    const token = this.getMasterToken();
    const res = await safeFetchJson("/api/portal/master/events", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token || ""}`
      },
      body: JSON.stringify(payload)
    });
    return res.data || { success: false, message: res.error };
  },

  async updateMasterEvent(eventId: string, payload: any) {
    const token = this.getMasterToken();
    const res = await safeFetchJson(`/api/portal/master/events/${encodeURIComponent(eventId)}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token || ""}`
      },
      body: JSON.stringify(payload)
    });
    return res.data || { success: false, message: res.error };
  },

  async resetMasterEventCredentials(eventId: string, password?: string) {
    const token = this.getMasterToken();
    const res = await safeFetchJson(`/api/portal/master/events/${encodeURIComponent(eventId)}/reset-credentials`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token || ""}`
      },
      body: JSON.stringify({ password })
    });
    return res.data || { success: false, message: res.error };
  },

  async revokeMasterEventSessions(eventId: string) {
    const token = this.getMasterToken();
    const res = await safeFetchJson(`/api/portal/master/events/${encodeURIComponent(eventId)}/revoke-sessions`, {
      method: "POST",
      headers: { Authorization: `Bearer ${token || ""}` }
    });
    return res.data || { success: false, message: res.error };
  },

  async testMasterEventConnection(eventId: string, appsScriptUrl?: string) {
    const token = this.getMasterToken();
    const res = await safeFetchJson(`/api/portal/master/events/${encodeURIComponent(eventId)}/test-connection`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token || ""}`
      },
      body: JSON.stringify({ appsScriptUrl })
    });
    return res.data || { success: false, message: res.error };
  },

  async syncMasterEvent(eventId: string) {
    const token = this.getMasterToken();
    const res = await safeFetchJson(`/api/portal/master/events/${encodeURIComponent(eventId)}/sync`, {
      method: "POST",
      headers: { Authorization: `Bearer ${token || ""}` }
    });
    return res.data || { success: false, message: res.error };
  },

  async fetchMasterAuditLogs(eventIdFilter?: string) {
    const token = this.getMasterToken();
    const url = eventIdFilter && eventIdFilter !== "ALL"
      ? `/api/portal/master/audit-logs?eventId=${encodeURIComponent(eventIdFilter)}`
      : "/api/portal/master/audit-logs";
    const res = await safeFetchJson(url, {
      headers: { Authorization: `Bearer ${token || ""}` }
    });
    return res.data || { success: false, logs: [], message: res.error };
  }
};

export default multiEventPortalClient;
