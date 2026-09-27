/**
 * Central API Service for Google Apps Script Web App Backend
 * 
 * Provides unified, typed access to all Google Apps Script API actions:
 * GET:
 *   - ?action=events
 *   - ?action=event&id=EVENT_ID
 *   - ?action=team
 *   - ?action=announcements
 *   - ?action=resources
 *   - ?action=stats
 *   - ?action=registration&id=REGISTRATION_ID
 * 
 * POST:
 *   - action=register
 *   - action=booking
 *   - action=attendance
 *   - action=announcement
 */

// Central API configuration constant
// Google Apps Script Web App /exec URL.
export const GAS_WEB_APP_URL = "https://script.google.com/macros/s/AKfycbwNoOZEt6heYNEFojQaHZMoRemC4OlfDNqhcGqRUXyDehfMAUm3kQXuNfoQi9pyqHNz7w/exec";
export const APPS_SCRIPT_URL = GAS_WEB_APP_URL;
export const DIRECT_GAS_URL = GAS_WEB_APP_URL;
export const API_BASE_URL = GAS_WEB_APP_URL;

export interface GasEvent {
  id: string;
  title: string;
  description: string;
  date: string;
  start_time: string;
  end_time: string;
  location: string;
  venue: string;
  poster_url?: string;
  poster_image?: string;
  registration_link?: string;
  category?: string;
  registration_deadline?: string;
  max_participants?: number;
  capacity?: string | number;
  registration_status: string;
  status: string;
  organizer?: string;
  organizer_name?: string;
  organizer_email?: string;
  contact_email?: string;
  contact_phone?: string;
  registration_count?: number;
  created_at?: string;
  published_at?: string;
  updated_at?: string;
  is_open: boolean;
  is_published: boolean;
  time?: string;
  registration_fee?: string;
  team_size?: string;
  prize_pool?: string;
  eligibility?: string;
  expected_participation?: string;
  expected_colleges?: string;
  organizer_phone?: string;
  stages?: Array<{ title: string; date: string; desc: string }>;
  is_featured?: boolean;
  raw?: any;
}

export interface GasTeamMember {
  id: string;
  name: string;
  role: string;
  position?: string;
  department?: string;
  photo_url: string;
  profilePhoto?: string;
  category?: string;
  bio?: string;
  linkedin_url?: string;
  github_url?: string;
  x_url?: string;
  email?: string;
  active: boolean;
  raw?: any;
}

export interface GasAnnouncement {
  id: string;
  title: string;
  message: string;
  category: string;
  publish_date?: string;
  priority?: "HIGH" | "NORMAL" | "LOW" | string;
  status?: string;
  created_by?: string;
  raw?: any;
}

export interface GasStats {
  total_events: number;
  published_events: number;
  total_registrations: number;
  confirmed_registrations: number;
  total_attendance: number;
  active_team_members: number;
}

export interface GasRegistration {
  registration_id: string;
  event_id: string;
  event_name?: string;
  participant_name: string;
  email: string;
  phone?: string;
  enrollment_number?: string;
  department?: string;
  program?: string;
  otherDepartment?: string;
  other_department?: string;
  branch?: string;
  year?: string;
  college?: string;
  status?: string;
  registered_at?: string;
  raw?: any;
}

export interface RegistrationPayload {
  event_id: string;
  name: string;
  email: string;
  phone: string;
  enrollment_number: string;
  program: string;
  otherDepartment?: string;
  other_department?: string;
  department: string;
  year: string;
  college: string;
}

export interface RegistrationResult {
  success: boolean;
  registration_id?: string;
  event_name?: string;
  participant_name?: string;
  message?: string;
  error?: string;
}

export interface BookingPayload {
  event_title?: string;
  venue?: string;
  booking_date?: string;
  start_time?: string;
  end_time?: string;
  organizer_name?: string;
  organizer_email?: string;
  purpose?: string;
  service?: string;
  name?: string;
  email?: string;
  phone?: string;
  date?: string;
}

export interface AttendancePayload {
  event_id: string;
  registration_id: string;
  marked_by: string;
}

export interface AnnouncementPayload {
  title: string;
  message?: string;
  content?: string;
  category?: string;
  published_by?: string;
}

export interface CertificateDataPayload {
  name: string;
  email: string;
  event_id?: string;
}

export interface CertificateDataResult {
  success: boolean;
  code?: string;
  registration_id?: string;
  attendance_id?: string;
  event_id?: string;
  name?: string;
  email?: string;
  date?: string;
  time?: string;
  message?: string;
  error?: string;
}

/**
 * Format GAS times like "1899-12-30 10:00:00" to "10:00 AM"
 */
function formatGasTime(val: any): string {
  if (!val) return "";
  const s = String(val).trim();
  if (!s) return "";
  if (/^\d{1,2}:\d{2}\s*(?:AM|PM)(?:\s*-\s*\d{1,2}:\d{2}\s*(?:AM|PM))?$/i.test(s)) {
    return s.toUpperCase();
  }
  if (s.includes(" - ")) {
    const parts = s.split(" - ");
    return parts.map(p => formatGasTime(p)).join(" - ");
  }
  if (/1899-12-3[01]/i.test(s) || /^\d{4}-\d{2}-\d{2}[ T]\d{2}:\d{2}/.test(s)) {
    const ampmMatch = s.match(/(\d{1,2}):(\d{2})(?::(\d{2}))?\s*(AM|PM)/i);
    if (ampmMatch) {
      let hour = parseInt(ampmMatch[1], 10);
      const minute = ampmMatch[2].padStart(2, "0");
      const ampm = ampmMatch[4].toUpperCase();
      return `${hour}:${minute} ${ampm}`;
    }
    const timeMatch = s.match(/[ T](\d{1,2}):(\d{2})(?::(\d{2}))?/);
    if (timeMatch) {
      let hour = parseInt(timeMatch[1], 10);
      const minute = timeMatch[2].padStart(2, "0");
      const ampm = hour >= 12 ? "PM" : "AM";
      hour = hour % 12 || 12;
      return `${hour}:${minute} ${ampm}`;
    }
  }
  if (/^\d{1,2}:\d{2}(?::\d{2})?$/.test(s)) {
    const parts = s.split(":");
    let hour = parseInt(parts[0], 10);
    const minute = parts[1].padStart(2, "0");
    const ampm = hour >= 12 ? "PM" : "AM";
    hour = hour % 12 || 12;
    return `${hour}:${minute} ${ampm}`;
  }
  const embeddedAmPm = s.match(/(\d{1,2}):(\d{2})(?::(\d{2}))?\s*(AM|PM)/i);
  if (embeddedAmPm) {
    let hour = parseInt(embeddedAmPm[1], 10);
    const minute = embeddedAmPm[2].padStart(2, "0");
    const ampm = embeddedAmPm[4].toUpperCase();
    return `${hour}:${minute} ${ampm}`;
  }
  return s;
}

/**
 * Format GAS dates like "2026-09-15T18:30:00.000Z" to just the date part if needed
 */
function formatGasDate(val: any): string {
  if (!val) return "";
  const s = String(val).trim();
  if (s.includes("T")) {
    const datePart = s.split("T")[0];
    // If it's something like 2026-09-15 we could format it, but let's just use what's given or parse it
    const d = new Date(datePart);
    if (!isNaN(d.getTime())) {
      return d.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }).replace(/ /g, ' ');
    }
  }
  return s;
}

/**
 * Normalizes an event from GAS sheet row
 */
function normalizeEvent(e: any): GasEvent {
  if (!e || typeof e !== "object") {
    return {
      id: "unknown",
      title: "Campus Event",
      description: "",
      date: "DECLARED SOON",
      start_time: "DECLARED SOON",
      end_time: "DECLARED SOON",
      time: "DECLARED SOON",
      location: "TO BE ANNOUNCED",
      venue: "TO BE ANNOUNCED",
      poster_url: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&q=80&w=800",
      poster_image: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&q=80&w=800",
      registration_link: "",
      registration_status: "CLOSED",
      status: "PUBLISHED",
      is_open: false,
      is_published: true,
    };
  }

  const id = String(e.id || e.Event_ID || e.event_id || e.ID || "").trim();
  const title = String(e.title || e.Event_Name || e.event_name || e.Title || "Campus Event").trim();
  const description = String(e.description || e.Description || e.desc || e.Desc || "").trim();

  const rawDate = e.date !== undefined ? e.date : (e.Date !== undefined ? e.Date : e.Start_Date || e.startDate);
  const dateVal = formatGasDate(rawDate);

  const startTime = String(e.start_time || e.Start_Time || e.time || e.Time || "DECLARED SOON").trim();
  const endTime = String(e.end_time || e.End_Time || "").trim();
  const timeVal = startTime && endTime && startTime !== endTime ? `${startTime} – ${endTime}` : (startTime || "DECLARED SOON");

  const venue = String(e.venue || e.Venue || e.location || e.Location || "TO BE ANNOUNCED").trim();
  const location = String(e.location || e.Location || venue || "TO BE ANNOUNCED").trim();

  let poster =
    e.poster_url ||
    e.Poster_URL ||
    e.poster_image ||
    e.Poster_Image ||
    e.banner_image ||
    e.Banner_Image ||
    "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&q=80&w=800";

  if (id === "EVT-0001" || (title.toLowerCase().includes("connect") && title.toLowerCase().includes("marwadi"))) {
    poster = "/images/gfg-connect-banner.jpg";
  }

  const regLink = String(e.registration_link || e.Registration_Link || "").trim();
  const category = String(e.category || e.Category || "Hackathon / Workshop").trim();

  const rawStatus = String(e.status || e.Status || "PUBLISHED").trim().toUpperCase();
  const status = rawStatus || "PUBLISHED";

  const rawRegStatus = String(e.registration_status || e.Registration_Status || "CLOSED").trim().toUpperCase();
  const regStatus = (rawRegStatus === "OPEN" || rawRegStatus === "LIVE" || rawRegStatus === "ACTIVE") ? "OPEN" : "CLOSED";

  const isPublished = e.is_published !== undefined ? Boolean(e.is_published) : (status === "PUBLISHED" || status === "ACTIVE");
  const isOpen = e.is_open !== undefined ? Boolean(e.is_open) : (regStatus === "OPEN" && isPublished);

  const maxParticipants = Number(e.max_participants || e.Max_Participants || e.capacity || e.Capacity || 500);
  const regDeadline = String(e.registration_deadline || e.Registration_Deadline || "TO BE ANNOUNCED").trim();
  const regCount = Number(e.registration_count || e.Registration_Count || 0);

  const organizer = String(e.organizer || e.Organizer || e.organizer_name || e.Organizer_Name || "GeeksforGeeks × Marwadi University").trim();
  const contactEmail = String(e.contact_email || e.Contact_Email || "gfg@marwadiuniversity.ac.in").trim();
  const contactPhone = String(e.contact_phone || e.Contact_Phone || "").trim();

  return {
    id: id || `evt_${Math.random().toString(36).substring(2, 9)}`,
    title,
    description,
    date: dateVal,
    start_time: startTime,
    end_time: endTime,
    time: timeVal,
    location,
    venue,
    poster_url: poster,
    poster_image: poster,
    registration_link: regLink,
    category,
    status,
    registration_status: regStatus,
    registration_deadline: regDeadline,
    registration_count: regCount,
    max_participants: maxParticipants,
    capacity: maxParticipants,
    registration_fee: e.registration_fee || e.Registration_Fee || "Free",
    team_size: e.team_size || e.Team_Size || "1–4 Members",
    prize_pool: e.prize_pool || e.Prize_Pool || "Certificates & Merch",
    eligibility: e.eligibility || e.Eligibility || "All College & University Students",
    organizer,
    organizer_name: organizer,
    organizer_email: contactEmail,
    contact_email: contactEmail,
    contact_phone: contactPhone,
    created_at: e.created_at || e.Created_At,
    published_at: e.published_at || e.Published_At,
    updated_at: e.updated_at || e.Updated_At,
    is_open: isOpen,
    is_published: isPublished,
    is_featured: e.is_featured === true || e.Is_Featured === true,
    stages: Array.isArray(e.stages) ? e.stages : undefined,
    raw: e,
  };
}

/**
 * Normalizes team member from GAS sheet row
 */
function normalizeTeamMember(m: any): GasTeamMember {
  const name = m.Name || m.name || "";
  const role = m.Role || m.role || m.Position || m.position || "Core Team Member";
  const photo =
    m.Photo_URL ||
    m.photo_url ||
    m.Photo ||
    m.photo ||
    m.Image ||
    m.image ||
    m.profilePhoto ||
    m.profile_photo ||
    "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=400";

  return {
    id: String(m.Member_ID || m.member_id || m.id || name.toLowerCase().replace(/\s+/g, "-")),
    name,
    role,
    position: role,
    department: m.Department || m.department || "Computer Engineering",
    photo_url: photo,
    profilePhoto: photo,
    category: m.Category || m.category || "Core Committee",
    bio: m.Bio || m.bio || "",
    linkedin_url: m.Linkedin_URL || m.linkedin_url || m.Linkedin || m.linkedin || "",
    github_url: m.Github_URL || m.github_url || m.Github || m.github || "",
    x_url: m.X_URL || m.x_url || m.Twitter || m.twitter || "",
    email: m.Email || m.email || "",
    active: m.Active !== false && m.active !== false,
    raw: m,
  };
}

/**
 * Normalizes an announcement from GAS sheet row
 */
function normalizeAnnouncement(a: any): GasAnnouncement {
  return {
    id: String(a.Announcement_ID || a.announcement_id || a.id || ""),
    title: a.Title || a.title || "Announcement",
    message: a.Message || a.message || a.Content || a.content || "",
    category: a.Category || a.category || "General",
    publish_date: a.Publish_Date || a.publish_date || a.Created_At || a.date || "",
    priority: a.Priority || a.priority || "NORMAL",
    status: a.Status || a.status || "PUBLISHED",
    created_by: a.Created_By || a.created_by || a.Published_By || a.published_by || "Admin",
    raw: a,
  };
}

/**
 * Normalizes a registration from GAS sheet row
 */
function normalizeRegistration(reg: any): GasRegistration {
  const prog = reg.Program || reg.program || reg.Branch || reg.branch || "";
  const otherDept = reg.Other_Department || reg.otherDepartment || reg.other_department || reg.OtherDepartment || "";
  return {
    registration_id: String(reg.Registration_ID || reg.registration_id || reg.id || ""),
    event_id: String(reg.Event_ID || reg.event_id || ""),
    event_name: reg.Event_Name || reg.event_name || reg.Event_Title || reg.event_title || "",
    participant_name: reg.Name || reg.name || reg.Participant_Name || reg.participant_name || "",
    email: reg.Email || reg.email || "",
    phone: reg.Phone || reg.phone || "",
    enrollment_number: reg.Enrollment_Number || reg.enrollment_number || reg.Enrollment || reg.enrollment || "",
    department: reg.Department || reg.department || otherDept || prog || "",
    program: prog,
    otherDepartment: otherDept,
    other_department: otherDept,
    branch: prog,
    year: reg.Year || reg.year || "",
    college: reg.College || reg.college || "Marwadi University",
    status: reg.Status || reg.status || "CONFIRMED",
    registered_at: reg.Registered_At || reg.registered_at || reg.Timestamp || reg.timestamp || "",
    raw: reg,
  };
}

// In-memory GET request cache and promise deduplication map
const gasCache = new Map<string, { data: any; timestamp: number }>();
const gasInFlight = new Map<string, Promise<any>>();
const CACHE_TTL_MS = 0; // 0 TTL ensures always live real-time sync with Google Sheets

export function invalidateGasCache(action?: string) {
  if (action) {
    for (const key of gasCache.keys()) {
      if (key.startsWith(action + ":")) {
        gasCache.delete(key);
      }
    }
  } else {
    gasCache.clear();
  }
}

/**
 * Generic GET helper for Google Apps Script Web App
 */
async function getGas(action: string, params: Record<string, string> = {}): Promise<any> {
  const cacheKey = `${action}:${JSON.stringify(params || {})}`;
  const now = Date.now();

  const cached = gasCache.get(cacheKey);
  if (CACHE_TTL_MS > 0 && cached && now - cached.timestamp < CACHE_TTL_MS) {
    return cached.data;
  }

  if (gasInFlight.has(cacheKey)) {
    return gasInFlight.get(cacheKey);
  }

  const fetchPromise = (async () => {
    try {
      const urlObj = new URL(DIRECT_GAS_URL);
      urlObj.searchParams.set("action", action);
      urlObj.searchParams.set("_t", Date.now().toString()); // Cache busting for real-time sheets sync
      for (const [k, v] of Object.entries(params)) {
        if (v !== undefined && v !== null && v !== "") {
          urlObj.searchParams.set(k, String(v));
        }
      }

      const requestedUrl = urlObj.toString();
      console.log("[GAS GET] Requested URL:", requestedUrl);

      const response = await fetch(requestedUrl, {
        method: "GET",
        redirect: "follow",
        cache: "no-store",
        headers: {
          Accept: "application/json",
        },
      });

      console.log("[GAS GET] Response Status:", response.status);
      console.log("[GAS GET] Response URL:", response.url);
      console.log("[GAS GET] Response Type:", response.type);
      console.log("[GAS GET] Response OK:", response.ok);

      if (!response.ok) {
        console.warn(`Apps Script request failed: HTTP ${response.status} for action: ${action}`);
        return { success: false, error: `Apps Script request failed: HTTP ${response.status}` };
      }

      const text = await response.text();
      console.log("[GAS GET] Response Text:", text);

      let data: any;
      try {
        data = JSON.parse(text);
      } catch (parseErr) {
        console.warn(`Failed to parse JSON response for action ${action}:`, text.slice(0, 300));
        return { success: false, error: "Invalid JSON response from Google Apps Script" };
      }

      if (data && data.success !== false) {
        gasCache.set(cacheKey, { data, timestamp: Date.now() });
      }
      return data;
    } catch (directErr: any) {
      console.warn(`gasApi fetch error for "${action}":`, directErr?.message || directErr);
      return { success: false, error: directErr?.message || "Unable to connect to the event service. Please try again." };
    } finally {
      gasInFlight.delete(cacheKey);
    }
  })();

  gasInFlight.set(cacheKey, fetchPromise);
  return fetchPromise;
}

/**
 * Generic POST helper for Google Apps Script Web App.
 * Uses URLSearchParams instead of JSON to avoid CORS preflight issues with Google Apps Script.
 */
async function postGas(payload: Record<string, any>): Promise<any> {
  try {
    invalidateGasCache();
    const response = await fetch(DIRECT_GAS_URL, {
      method: "POST",
      headers: { "Content-Type": "text/plain;charset=utf-8" },
      body: JSON.stringify(payload),
      redirect: "follow",
    });

    if (response.ok) {
      const text = await response.text();
      try {
        const data = JSON.parse(text);
        return data;
      } catch {
        return { success: true, message: "Request processed." };
      }
    }
    return { success: false, error: `HTTP Error: ${response.status}` };
  } catch (err: any) {
    console.warn(`gasApi.postGas("${payload.action}") notice:`, err?.message);
    return { success: false, error: "Network error communicating with Google Apps Script" };
  }
}

/**
 * Central Google Apps Script API Service
 */
export const gasApi = {
  // Constant URL reference
  API_BASE_URL,

  /**
   * GET ?action=events
   * Fetches all published events from Google Apps Script.
   */
  async getEvents(): Promise<{ success: boolean; count: number; events: GasEvent[]; data: GasEvent[]; error?: string }> {
    console.log("[EVENT DEBUG] FETCHING FROM URL:", DIRECT_GAS_URL);
    const res = await getGas("events");
    console.log("[EVENT DEBUG] RAW RESPONSE:", res);

    if (!res || (res.success === false && !res.events && !res.data)) {
      console.warn("[EVENT DEBUG] FAILED RESPONSE:", res);
      return { success: false, count: 0, events: [], data: [], error: res?.error || "Failed to load events" };
    }

    let rawList: any[] = [];
    if (Array.isArray(res.events)) {
      rawList = res.events;
    } else if (Array.isArray(res.data)) {
      rawList = res.data;
    } else if (Array.isArray(res.records)) {
      rawList = res.records;
    } else if (Array.isArray(res)) {
      rawList = res;
    }

    console.log("[EVENT DEBUG] PARSED RAW LIST:", rawList);

    const events = rawList
      .map(normalizeEvent)
      .filter((e) => e && e.id && e.is_published !== false);

    console.log("[EVENT DEBUG] EVENTS ARRAY:", events);
    console.log("[EVENT DEBUG] EVENTS COUNT:", events.length);

    events.forEach(evt => {
      console.log("[EVENT DEBUG] EVENT ITEM:", {
        id: evt.id,
        name: evt.title,
        registration_status: evt.registration_status,
        status: evt.status,
        date: evt.date,
        start_time: evt.time,
        venue: evt.location
      });
    });

    const evt3 = events.find(e => e.id === "EVT-0003");
    console.log("[EVENT DEBUG] EVT-0003 FOUND:", !!evt3, evt3);

    return { success: true, count: events.length, events, data: events };
  },

  /**
   * GET ?action=event&id=EVENT_ID
   * Fetches a single event by ID.
   */
  async getEvent(id: string): Promise<{ success: boolean; event?: GasEvent; error?: string }> {
    const res = await getGas("event", { id });
    if (!res.success) {
      return { success: false, error: res.error || "Event not found" };
    }
    const event = normalizeEvent(res.event || res.data);
    return { success: true, event };
  },

  /**
   * GET ?action=team
   * Fetches active team members.
   */
  async getTeam(): Promise<{ success: boolean; count: number; team: GasTeamMember[]; error?: string }> {
    const res = await getGas("team");
    if (!res.success) {
      return { success: false, count: 0, team: [], error: res.error || "Failed to load team members" };
    }
    const rawList = res.team || res.data || [];
    const team = rawList.map(normalizeTeamMember);
    return { success: true, count: team.length, team };
  },

  /**
   * GET ?action=announcements
   * Fetches published announcements.
   */
  async getAnnouncements(): Promise<{ success: boolean; count: number; announcements: GasAnnouncement[]; error?: string }> {
    const res = await getGas("announcements");
    if (!res.success) {
      return { success: false, count: 0, announcements: [], error: res.error || "Failed to load announcements" };
    }
    const rawList = res.announcements || res.data || [];
    const announcements = rawList.map(normalizeAnnouncement);
    return { success: true, count: announcements.length, announcements };
  },

  /**
   * GET ?action=stats
   * Fetches dashboard statistics.
   */
  async getStats(): Promise<{ success: boolean; stats: GasStats; error?: string }> {
    const res = await getGas("stats");
    if (!res.success) {
      return {
        success: false,
        stats: {
          total_events: 0,
          published_events: 0,
          total_registrations: 0,
          confirmed_registrations: 0,
          total_attendance: 0,
          active_team_members: 0,
        },
        error: res.error || "Failed to load stats",
      };
    }
    const s = res.stats || {};
    return {
      success: true,
      stats: {
        total_events: Number(s.total_events || 0),
        published_events: Number(s.published_events || 0),
        total_registrations: Number(s.total_registrations || 0),
        confirmed_registrations: Number(s.confirmed_registrations || 0),
        total_attendance: Number(s.total_attendance || 0),
        active_team_members: Number(s.active_team_members || 0),
      },
    };
  },

  /**
   * GET ?action=registration&id=REGISTRATION_ID&registration_id=REGISTRATION_ID
   * Fetches a registration by its ID.
   */
  async getRegistration(id: string): Promise<{ success: boolean; registration?: GasRegistration; error?: string }> {
    const cleanId = String(id || "").replace(/\u00A0/g, " ").trim();
    const res = await getGas("registration", {
      id: cleanId,
      registration_id: cleanId,
      registrationId: cleanId,
    });
    if (!res.success) {
      return { success: false, error: res.error || "Registration not found" };
    }
    const registration = normalizeRegistration(res.registration || res.data || res.result || res);
    return { success: true, registration };
  },

  /**
   * POST action=register
   * Registers a participant for an event.
   */
  async registerForEvent(payload: RegistrationPayload): Promise<RegistrationResult> {
    const body: Record<string, any> = {
      action: "register",
      event_id: String(payload.event_id).trim(),
      name: payload.name.trim(),
      email: payload.email.trim(),
      phone: payload.phone.trim(),
      enrollment_number: payload.enrollment_number.trim(),
      program: (payload.program || "").trim(),
      branch: (payload.program || "").trim(),
      other_department: (payload.otherDepartment || payload.other_department || "").trim(),
      otherDepartment: (payload.otherDepartment || payload.other_department || "").trim(),
      department: payload.department.trim(),
      year: payload.year.trim(),
      college: payload.college.trim(),
    };

    const res = await postGas(body);
    if (!res.success) {
      return {
        success: false,
        error: res.error || res.message || "Registration failed. Please check details and try again.",
      };
    }

    return {
      success: true,
      registration_id: res.registration_id || res.id || "",
      event_name: res.event_name || res.event_title || payload.event_id,
      participant_name: res.participant_name || payload.name,
      message: res.message || "Registration confirmed successfully!",
    };
  },

  /**
   * POST action=booking
   * Submits a venue/lab booking request.
   */
  async createBooking(payload: BookingPayload): Promise<{ success: boolean; booking_id?: string; error?: string }> {
    const body = {
      action: "booking",
      ...payload,
      // Provide backwards-compatible and required aliases
      service: payload.service || payload.venue || "Campus Venue Booking",
      name: payload.name || payload.organizer_name || "Faculty / Student Lead",
      email: payload.email || payload.organizer_email || "lead@marwadiuniversity.ac.in",
      phone: payload.phone || "9876543210",
      date: payload.date || payload.booking_date || new Date().toISOString().split("T")[0],
    };

    const res = await postGas(body);
    return res;
  },

  /**
   * POST action=attendance
   * Marks participant attendance.
   */
  async markAttendance(payload: AttendancePayload): Promise<{ success: boolean; attendance_id?: string; error?: string }> {
    const body = {
      action: "attendance",
      event_id: payload.event_id,
      registration_id: payload.registration_id,
      marked_by: payload.marked_by,
    };

    const res = await postGas(body);
    return res;
  },

  /**
   * POST action=announcement
   * Publishes a new announcement.
   */
  async publishAnnouncement(payload: AnnouncementPayload): Promise<{ success: boolean; announcement_id?: string; error?: string }> {
    const body = {
      action: "announcement",
      title: payload.title,
      message: payload.message || payload.content || "",
      content: payload.content || payload.message || "",
      category: payload.category || "General",
      published_by: payload.published_by || "Team Lead",
    };

    const res = await postGas(body);
    return res;
  },

  /**
   * Action 1: certificate_data_entry
   * Appends participant certificate entry directly into Google Sheets Attendance sheet.
   */
  async submitCertificateData(payload: CertificateDataPayload): Promise<CertificateDataResult> {
    const cleanName = payload.name.trim();
    const cleanEmail = payload.email.trim();
    const cleanEventId = (payload.event_id || "").trim();

    if (!cleanEventId) {
      return { success: false, code: "SUBMISSION_FAILED", error: "Event ID is required." };
    }
    if (!cleanName) {
      return { success: false, code: "SUBMISSION_FAILED", error: "Full Name is required." };
    }
    if (!cleanEmail) {
      return { success: false, code: "SUBMISSION_FAILED", error: "A valid email address is required." };
    }

    const body = {
      action: "certificate_data_entry",
      name: cleanName,
      email: cleanEmail,
      event_id: cleanEventId,
    };

    const res = await postGas(body);

    if (res && (res.success || res.code === "CREATED")) {
      return {
        success: true,
        code: res.code || "CREATED",
        registration_id: res.registration_id,
        attendance_id: res.attendance_id,
        event_id: res.event_id || cleanEventId,
        name: res.name || cleanName,
        email: res.email || cleanEmail,
        date: res.date,
        time: res.time,
        message: res.message || "Certificate data submitted successfully.",
      };
    } else if (res && (res.code === "ALREADY_SUBMITTED" || res.status === "ALREADY_SUBMITTED")) {
      return {
        success: false,
        code: "ALREADY_SUBMITTED",
        registration_id: res.registration_id,
        attendance_id: res.attendance_id,
        error: res.message || "Certificate data already submitted for this event.",
      };
    }

    return {
      success: false,
      code: res?.code || "SUBMISSION_FAILED",
      error: res?.message || res?.error || "Network error communicating with Google Apps Script",
    };
  },

  /**
   * Action 2: scanner_login
   * Authenticates against the two designated coordinator accounts and retrieves session token.
   */
  async certificateScannerLogin(login_id: string, password: string): Promise<{
    success: boolean;
    code?: string;
    token?: string;
    scannerIdentity?: string;
    identity?: string;
    error?: string;
  }> {
    const cleanId = String(login_id || "").trim();
    const cleanPass = String(password || "").trim();

    const res = await postGas({
      action: "scanner_login",
      username: cleanId,
      login_id: cleanId,
      password: cleanPass,
    });

    if (res && (res.success || res.code === "LOGIN_SUCCESS") && res.token) {
      return {
        success: true,
        code: res.code || "LOGIN_SUCCESS",
        token: res.token,
        identity: res.identity || res.scanner_name || res.scannerIdentity,
        scannerIdentity: res.identity || res.scanner_name || res.scannerIdentity,
      };
    }

    return {
      success: false,
      code: res?.code || "INVALID_CREDENTIALS",
      error: res?.message || res?.error || "Invalid username or password.",
    };
  },

  /**
   * Action 3: certificate_qr_scan
   * Verifies participant QR Registration_ID using session token.
   */
  async scanCertificateQr(registration_id: string, token: string): Promise<{
    success: boolean;
    code?: string;
    alreadyVerified?: boolean;
    notFound?: boolean;
    invalidQr?: boolean;
    unauthorized?: boolean;
    registration_id?: string;
    name?: string;
    email?: string;
    event_id?: string;
    status?: string;
    marked_by?: string;
    error?: string;
    message?: string;
  }> {
    let cleanRegId = String(registration_id || "").trim();
    if (cleanRegId.startsWith("{") && cleanRegId.endsWith("}")) {
      try {
        const parsed = JSON.parse(cleanRegId);
        if (parsed && parsed.registration_id) {
          cleanRegId = String(parsed.registration_id).trim();
        }
      } catch {}
    }

    if (!cleanRegId || !cleanRegId.toUpperCase().startsWith("REG-")) {
      return {
        success: false,
        invalidQr: true,
        code: "INVALID_QR",
        error: cleanRegId.toUpperCase().startsWith("ATT-")
          ? "Attendance ID (ATT-) cannot be scanned. Please scan a valid Registration ID (REG-)."
          : "INVALID QR CODE. Must be a Registration ID starting with REG-.",
      };
    }

    const gasRes = await postGas({
      action: "certificate_qr_scan",
      registration_id: cleanRegId,
      token: token,
    });

    if (gasRes) {
      if (gasRes.code === "VERIFIED" || gasRes.success) {
        return {
          success: true,
          code: "VERIFIED",
          registration_id: gasRes.registration_id || cleanRegId,
          name: gasRes.name || "Participant",
          email: gasRes.email || "",
          event_id: gasRes.event_id || "",
          status: "DONE",
          marked_by: gasRes.marked_by,
          message: gasRes.message || "Certificate attendance verified successfully.",
        };
      } else if (gasRes.code === "ALREADY_VERIFIED" || gasRes.status === "ALREADY_VERIFIED") {
        return {
          success: false,
          alreadyVerified: true,
          code: "ALREADY_VERIFIED",
          registration_id: gasRes.registration_id || cleanRegId,
          name: gasRes.name || "Participant",
          email: gasRes.email || "",
          event_id: gasRes.event_id || "",
          marked_by: gasRes.marked_by || "Coordinator",
          message: gasRes.message || "This registration has already been verified.",
        };
      } else if (gasRes.code === "REGISTRATION_NOT_FOUND" || gasRes.status === "REGISTRATION_NOT_FOUND") {
        return {
          success: false,
          notFound: true,
          code: "REGISTRATION_NOT_FOUND",
          registration_id: cleanRegId,
          message: gasRes.message || "Registration ID not found.",
        };
      } else if (gasRes.code === "UNAUTHORIZED" || gasRes.status === "UNAUTHORIZED") {
        return {
          success: false,
          unauthorized: true,
          code: "UNAUTHORIZED",
          message: gasRes.message || "Invalid or expired scanner session.",
        };
      }
    }

    return {
      success: false,
      error: gasRes?.message || gasRes?.error || "Network error communicating with Google Apps Script",
    };
  }
};

export default gasApi;
