import { GAS_WEB_APP_URL } from "./gasApi";

/**
 * Dedicated Google Apps Script API Service for Attendance Admin Portal (/atgfg)
 * Target Google Apps Script Web App Endpoint:
 * Uses centralized GAS_WEB_APP_URL from gasApi.ts
 */

export const APPS_SCRIPT_URL = GAS_WEB_APP_URL;
export const ATGFG_GAS_URL = APPS_SCRIPT_URL;

export interface AtgfgRegistration {
  registration_id: string; // Unique key e.g. REG-1788698620536-209
  event_id: string;        // e.g. EVT-0002
  name: string;            // Student name
  email: string;
  phone: string;
  enrollment_number: string;
  department: string;
  year: string;
  college: string;
  timestamp: string;       // Registration time
  status: string;          // CONFIRMED, CANCELLED, PENDING
  attendance_status: string; // NOT_MARKED, PRESENT
  certificate_status: string; // NOT_ISSUED, ISSUED
  certificate_url: string;  // URL or blank
  marked_at?: string;      // Optional attendance timestamp
  raw?: any;
}

export interface AtgfgStats {
  totalRegistrations: number;
  confirmedRegistrations: number;
  attendanceMarked: number;
  attendancePending: number;
  certificatesIssued: number;
  certificatesPending: number;
}

// In-memory cache for fast responsive offline-tolerant searching & local fallback updates
let cachedRegistrations: AtgfgRegistration[] = [];
let lastSyncTimestamp: string | null = null;

/**
 * Normalizes a row object from Google Sheets JSON response into standard AtgfgRegistration shape
 */
export function normalizeAtgfgRegistration(row: any): AtgfgRegistration {
  if (!row) {
    return {
      registration_id: "",
      event_id: "",
      name: "",
      email: "",
      phone: "",
      enrollment_number: "",
      department: "",
      year: "",
      college: "",
      timestamp: "",
      status: "CONFIRMED",
      attendance_status: "NOT_MARKED",
      certificate_status: "NOT_ISSUED",
      certificate_url: "",
    };
  }

  const regId = String(
    row.Registration_ID ||
    row.registration_id ||
    row.RegistrationId ||
    row.id ||
    row.ID ||
    ""
  ).trim();

  const evtId = String(
    row.Event_ID ||
    row.event_id ||
    row.EventId ||
    ""
  ).trim();

  const name = String(
    row.Name ||
    row.name ||
    row.Participant_Name ||
    row.participant_name ||
    row.Student_Name ||
    ""
  ).trim();

  const email = String(row.Email || row.email || "").trim();
  const phone = String(row.Phone || row.phone || "").trim();
  const enrollment = String(
    row.Enrollment_Number ||
    row.enrollment_number ||
    row.Enrollment ||
    row.enrollment ||
    ""
  ).trim();

  const department = String(row.Department || row.department || "").trim();
  const year = String(row.Year || row.year || "").trim();
  const college = String(row.College || row.college || "Marwadi University").trim();
  const timestamp = String(
    row.Timestamp ||
    row.timestamp ||
    row.Registered_At ||
    row.registered_at ||
    new Date().toLocaleDateString()
  ).trim();

  const rawStatus = String(row.Status || row.status || "CONFIRMED").trim().toUpperCase();
  const status = rawStatus || "CONFIRMED";

  const rawAtt = String(
    row.Attendance_Status ||
    row.attendance_status ||
    row.Attendance ||
    row.attendance ||
    "NOT_MARKED"
  ).trim().toUpperCase();

  const attendance_status = (rawAtt === "PRESENT" || rawAtt === "MARKED" || rawAtt === "YES")
    ? "PRESENT"
    : "NOT_MARKED";

  const rawCert = String(
    row.Certificate_Status ||
    row.certificate_status ||
    row.Certificate ||
    row.certificate ||
    "NOT_ISSUED"
  ).trim().toUpperCase();

  const certificate_status = (rawCert === "ISSUED" || rawCert === "YES" || rawCert === "SENT")
    ? "ISSUED"
    : "NOT_ISSUED";

  const certificate_url = String(
    row.Certificate_URL ||
    row.certificate_url ||
    row.CertificateUrl ||
    row.certificateUrl ||
    ""
  ).trim();

  const marked_at = row.Marked_At || row.marked_at || undefined;

  return {
    registration_id: regId,
    event_id: evtId,
    name,
    email,
    phone,
    enrollment_number: enrollment,
    department,
    year,
    college,
    timestamp,
    status,
    attendance_status,
    certificate_status,
    certificate_url: certificate_url === "blank" ? "" : certificate_url,
    marked_at,
    raw: row,
  };
}

export const atgfgApi = {
  /**
   * Fetch all registration records from Google Apps Script Web App
   */
  async getRegistrations(eventIdFilter?: string): Promise<{
    success: boolean;
    registrations: AtgfgRegistration[];
    lastSynced: string;
    error?: string;
  }> {
    try {
      const url = new URL(APPS_SCRIPT_URL);
      url.searchParams.set("action", "getRegistrations");
      url.searchParams.set("_t", Date.now().toString());
      if (eventIdFilter && eventIdFilter !== "ALL") {
        url.searchParams.set("eventId", eventIdFilter);
      }

      const response = await fetch(url.toString(), {
        method: "GET",
        redirect: "follow",
        cache: "no-store",
        headers: {
          Accept: "application/json",
        },
      });

      if (response.ok) {
        const data = await response.json();
        const rawList = data.registrations || data.data || data.records || (Array.isArray(data) ? data : []);
        if (Array.isArray(rawList)) {
          const list = rawList.map(normalizeAtgfgRegistration).filter((r) => r.registration_id);
          cachedRegistrations = list;
          lastSyncTimestamp = new Date().toLocaleString("en-GB", {
            day: "2-digit",
            month: "short",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
            second: "2-digit",
          });
          return {
            success: true,
            registrations: list,
            lastSynced: lastSyncTimestamp,
          };
        }
      }
    } catch (err: any) {
      console.warn("atgfgApi.getRegistrations notice:", err?.message || err);
    }

    const fallbackSynced = lastSyncTimestamp || new Date().toLocaleString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });

    return {
      success: true,
      registrations: cachedRegistrations,
      lastSynced: fallbackSynced,
    };
  },

  /**
   * Search registration by Registration ID, Event ID, Name, Email, Enrollment Number, Phone
   */
  async searchRegistration(query: string, eventIdFilter?: string): Promise<AtgfgRegistration[]> {
    const q = query.trim().toLowerCase();
    if (!q) {
      if (eventIdFilter && eventIdFilter !== "ALL") {
        return cachedRegistrations.filter((r) => r.event_id === eventIdFilter);
      }
      return cachedRegistrations;
    }

    let results = cachedRegistrations.filter((r) => {
      return (
        r.registration_id.toLowerCase().includes(q) ||
        r.event_id.toLowerCase().includes(q) ||
        r.name.toLowerCase().includes(q) ||
        r.email.toLowerCase().includes(q) ||
        r.enrollment_number.toLowerCase().includes(q) ||
        r.phone.toLowerCase().includes(q)
      );
    });

    if (eventIdFilter && eventIdFilter !== "ALL") {
      results = results.filter((r) => r.event_id === eventIdFilter);
    }

    return results;
  },

  /**
   * Fetch single registration by Registration_ID
   * GET ${APPS_SCRIPT_URL}?action=registration&registration_id=REGISTRATION_ID&id=REGISTRATION_ID
   */
  async getRegistrationById(registrationId: string): Promise<{
    success: boolean;
    registration?: AtgfgRegistration;
    error?: string;
  }> {
    const cleanId = String(registrationId || "").replace(/\u00A0/g, " ").trim();
    if (!cleanId) {
      return { success: false, error: "Registration ID is required" };
    }

    const reqUrl = `${APPS_SCRIPT_URL}?action=registration&registration_id=${encodeURIComponent(cleanId)}&id=${encodeURIComponent(cleanId)}&registrationId=${encodeURIComponent(cleanId)}&_t=${Date.now()}`;
    console.log("SCANNED QR:", registrationId);
    console.log("NORMALIZED REGISTRATION ID:", cleanId);
    console.log("REGISTRATION API URL:", reqUrl);

    try {
      const response = await fetch(reqUrl, {
        method: "GET",
        redirect: "follow",
        cache: "no-store",
        headers: {
          Accept: "application/json",
        },
      });

      if (response.ok) {
        const data = await response.json();
        console.log("REGISTRATION API RESPONSE:", data);

        const targetData = data.data || data.registration || data.result || (data.Registration_ID || data.registration_id ? data : null);

        if (data.success !== false && targetData) {
          const reg = normalizeAtgfgRegistration(targetData);
          console.log("MATCHED REGISTRATION:", reg);

          // Update in-memory cache
          const idx = cachedRegistrations.findIndex(
            (r) => r.registration_id.toLowerCase() === cleanId.toLowerCase()
          );
          if (idx >= 0) {
            cachedRegistrations[idx] = reg;
          } else if (reg.registration_id) {
            cachedRegistrations.unshift(reg);
          }

          return { success: true, registration: reg };
        } else {
          // Check local cache if server returned not found
          const foundLocal = cachedRegistrations.find(
            (r) => r.registration_id.toLowerCase() === cleanId.toLowerCase()
          );
          if (foundLocal) {
            console.log("MATCHED REGISTRATION (FROM CACHE):", foundLocal);
            return { success: true, registration: foundLocal };
          }
          return { success: false, error: data.message || data.error || "Registration not found" };
        }
      } else {
        console.warn("ATGFG REGISTRATION RESPONSE HTTP ERROR:", response.status);
      }
    } catch (err: any) {
      console.error("ATGFG REGISTRATION REQUEST FAILED:", err?.message || err);
    }

    // Secondary fallback: check local cache
    const foundLocal = cachedRegistrations.find(
      (r) => r.registration_id.toLowerCase() === cleanId.toLowerCase()
    );
    if (foundLocal) {
      console.log("MATCHED REGISTRATION (FROM CACHE):", foundLocal);
      return { success: true, registration: foundLocal };
    }

    return { success: false, error: `Registration ID "${cleanId}" not found` };
  },

  /**
   * Mark student attendance using Registration_ID as unique identifier
   * POST to APPS_SCRIPT_URL with body: { action: "attendance", registration_id: "REGISTRATION_ID" }
   */
  async markAttendance(registrationId: string): Promise<{
    success: boolean;
    registration?: AtgfgRegistration;
    duplicate?: boolean;
    message?: string;
    error?: string;
  }> {
    const cleanId = String(registrationId || "").replace(/\u00A0/g, " ").trim();
    if (!cleanId) {
      return { success: false, error: "Invalid Registration ID" };
    }

    const payload = {
      action: "attendance",
      registration_id: cleanId,
      registrationId: cleanId,
      id: cleanId,
    };

    console.log("ATGFG ATTENDANCE REQUEST:", payload);

    let responseData: any = null;
    try {
      const response = await fetch(APPS_SCRIPT_URL, {
        method: "POST",
        headers: {
          "Content-Type": "text/plain;charset=utf-8",
        },
        body: JSON.stringify(payload),
        redirect: "follow",
      });

      if (response.ok) {
        try {
          responseData = await response.json();
        } catch {
          responseData = { success: true, message: "Attendance marked successfully" };
        }
      } else {
        responseData = { success: false, error: "HTTP error " + response.status };
      }
      console.log("ATGFG ATTENDANCE RESPONSE:", responseData);
    } catch (err: any) {
      console.warn("ATGFG ATTENDANCE POST NOTICE:", err?.message || err);
      try {
        const params = new URLSearchParams();
        params.append("action", "attendance");
        params.append("registration_id", cleanId);
        params.append("registrationId", cleanId);
        params.append("id", cleanId);
        const res2 = await fetch(APPS_SCRIPT_URL, {
          method: "POST",
          body: params,
          redirect: "follow",
        });
        responseData = await res2.json();
        console.log("ATGFG ATTENDANCE RESPONSE (Fallback):", responseData);
      } catch (err2) {
        console.error("ATGFG ATTENDANCE POST ERROR:", err2);
      }
    }

    // Update local cached object
    const targetIdx = cachedRegistrations.findIndex(
      (r) => r.registration_id.toLowerCase() === cleanId.toLowerCase()
    );
    let reg = targetIdx >= 0 ? cachedRegistrations[targetIdx] : undefined;

    if (responseData && (responseData.data || responseData.registration)) {
      reg = normalizeAtgfgRegistration(responseData.data || responseData.registration);
      if (targetIdx >= 0) {
        cachedRegistrations[targetIdx] = reg;
      } else {
        cachedRegistrations.unshift(reg);
      }
    } else if (reg) {
      reg.attendance_status = "PRESENT";
      reg.marked_at = new Date().toLocaleString("en-GB");
    }

    if (responseData && responseData.success === false) {
      const msg = responseData.message || responseData.error || "";
      if (responseData.duplicate || msg.toLowerCase().includes("already")) {
        return {
          success: false,
          duplicate: true,
          registration: reg,
          message: "Attendance Already Marked",
        };
      }
      return {
        success: false,
        error: msg || "Failed to mark attendance",
        registration: reg,
      };
    }

    return {
      success: true,
      registration: reg,
      message: responseData?.message || "Attendance marked successfully",
    };
  },

  /**
   * Calculate dynamic statistics from registration list
   */
  calculateStats(registrations: AtgfgRegistration[]): AtgfgStats {
    const totalRegistrations = registrations.length;
    const confirmedRegistrations = registrations.filter((r) => r.status === "CONFIRMED").length;
    const attendanceMarked = registrations.filter((r) => r.attendance_status === "PRESENT").length;
    const attendancePending = Math.max(0, totalRegistrations - attendanceMarked);
    const certificatesIssued = registrations.filter((r) => r.certificate_status === "ISSUED").length;
    const certificatesPending = Math.max(0, totalRegistrations - certificatesIssued);

    return {
      totalRegistrations,
      confirmedRegistrations,
      attendanceMarked,
      attendancePending,
      certificatesIssued,
      certificatesPending,
    };
  },
};

export default atgfgApi;

