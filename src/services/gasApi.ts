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
export const APPS_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbwXI6rB6TB2dGPvAUEN8OPNeISND5fmWbsnQu4TtI0bz5UsbKrh4X8zfm6pIMozXSVpDw/exec";
export const DIRECT_GAS_URL = APPS_SCRIPT_URL;
export const API_BASE_URL = APPS_SCRIPT_URL;

export interface GasEvent {
  id: string;
  title: string;
  description: string;
  date: string;
  time?: string;
  location: string;
  poster_url: string;
  poster_image?: string;
  registration_link: string;
  category?: string;
  status?: string;
  registration_status?: string;
  registration_deadline?: string;
  registration_count?: number;
  capacity?: string | number;
  registration_fee?: string;
  team_size?: string;
  prize_pool?: string;
  eligibility?: string;
  expected_participation?: string;
  expected_colleges?: string;
  organizer_name?: string;
  organizer_email?: string;
  organizer_phone?: string;
  contact_phone?: string;
  contact_email?: string;
  stages?: Array<{ title: string; date: string; desc: string }>;
  is_published?: boolean;
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
      date: "Upcoming",
      time: "",
      location: "Marwadi University, Rajkot",
      poster_url: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&q=80&w=800",
      poster_image: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&q=80&w=800",
      registration_link: "",
      is_published: true,
    };
  }

  const id = String(e.Event_ID || e.event_id || e.id || e.ID || "").trim();
  const title = String(e.Event_Name || e.event_name || e.Title || e.title || e.Event_Title || e.event_title || "Campus Event").trim();
  const description = String(e.Description || e.description || e.Desc || e.desc || "").trim();

  let dateVal = e.Date || e.date || e.Start_Date || e.startDate || "Upcoming";
  dateVal = formatGasDate(dateVal);

  let timeVal = e.Start_Time || e.startTime || e.Time || e.time || "";
  let endTimeVal = e.End_Time || e.endTime || "";
  
  if (timeVal) {
    timeVal = formatGasTime(timeVal);
    if (endTimeVal) {
      endTimeVal = formatGasTime(endTimeVal);
      timeVal = `${timeVal} - ${endTimeVal}`;
    }
  }

  const venue = String(e.Venue || e.venue || e.Location || e.location || "Marwadi University Auditorium").trim();

  const poster =
    e.Poster_URL ||
    e.poster_url ||
    e.Banner_Image ||
    e.banner_image ||
    e.bannerImage ||
    e.Poster_Image ||
    e.poster_image ||
    "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&q=80&w=800";

  const regLink = String(e.Registration_Link || e.registration_link || e.registrationLink || "").trim();
  const category = String(e.Category || e.category || "Hackathon / Competition").trim();
  
  const statusRaw = String(e.Status || e.status || "PUBLISHED").trim();
  const statusUpper = statusRaw.toUpperCase();
  const isPublished = statusUpper === "PUBLISHED" || (statusUpper !== "DRAFT" && statusUpper !== "CANCELLED" && e.Is_Published !== false && e.is_published !== false);

  const regStatusRaw = String(e.Registration_Status || e.registration_status || "OPEN").trim();
  
  const capacityVal = e.Max_Participants !== undefined && e.Max_Participants !== null && e.Max_Participants !== ""
    ? String(e.Max_Participants)
    : (e.Capacity || e.capacity || "Open");

  const organizerName = String(e.Organizer || e.organizer || e.Organizer_Name || e.organizer_name || "GeeksforGeeks × Marwadi University").trim();
  const organizerEmail = String(e.Contact_Email || e.contact_email || e.Organizer_Email || e.organizer_email || "gfg.events@example.com").trim();
  
  const contactPhone = e.Contact_Phone !== undefined && e.Contact_Phone !== null
    ? String(e.Contact_Phone).trim()
    : (e.contact_phone !== undefined && e.contact_phone !== null ? String(e.contact_phone).trim() : "");

  const regDeadline = String(e.Registration_Deadline || e.registration_deadline || "").trim();
  const regCount = Number(e.Registration_Count || e.registration_count || 0);

  return {
    id: id || `evt_${Math.random().toString(36).substring(2, 9)}`,
    title,
    description,
    date: dateVal,
    time: timeVal,
    location: venue,
    poster_url: poster,
    poster_image: poster,
    registration_link: regLink,
    category,
    status: statusRaw,
    registration_status: regStatusRaw,
    registration_deadline: regDeadline,
    registration_count: regCount,
    capacity: capacityVal,
    registration_fee: e.Registration_Fee || e.registration_fee || e.fee || "Free",
    team_size: e.Team_Size || e.team_size || "1–4 Members",
    prize_pool: e.Prize_Pool || e.prize_pool || "Exciting Rewards",
    eligibility: e.Eligibility || e.eligibility || "All College & University Students",
    expected_participation: e.Expected_Participation || e.expected_participation || "500+ Students",
    expected_colleges: e.Expected_Colleges || e.expected_colleges || "100+ Colleges",
    organizer_name: organizerName,
    organizer_email: organizerEmail,
    organizer_phone: contactPhone,
    contact_phone: contactPhone,
    contact_email: organizerEmail,
    is_published: isPublished,
    is_featured: e.Is_Featured === true || e.is_featured === true || e.featured === true,
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
  return {
    registration_id: String(reg.Registration_ID || reg.registration_id || reg.id || ""),
    event_id: String(reg.Event_ID || reg.event_id || ""),
    event_name: reg.Event_Name || reg.event_name || reg.Event_Title || reg.event_title || "",
    participant_name: reg.Name || reg.name || reg.Participant_Name || reg.participant_name || "",
    email: reg.Email || reg.email || "",
    phone: reg.Phone || reg.phone || "",
    enrollment_number: reg.Enrollment_Number || reg.enrollment_number || reg.Enrollment || reg.enrollment || "",
    department: reg.Department || reg.department || "",
    year: reg.Year || reg.year || "",
    college: reg.College || reg.college || "Marwadi University",
    status: reg.Status || reg.status || "CONFIRMED",
    registered_at: reg.Registered_At || reg.registered_at || reg.Timestamp || reg.timestamp || "",
    raw: reg,
  };
}

/**
 * Generic GET helper for Google Apps Script Web App
 */
async function getGas(action: string, params: Record<string, string> = {}): Promise<any> {
  try {
    const direct = new URL(DIRECT_GAS_URL);
    direct.searchParams.set("action", action);
    for (const [k, v] of Object.entries(params)) {
      if (v !== undefined && v !== null && v !== "") {
        direct.searchParams.set(k, String(v));
      }
    }

    const response = await fetch(direct.toString(), {
      method: "GET",
      redirect: "follow",
    });

    if (response.ok) {
      const data = await response.json();
      return data;
    } else {
      console.warn(`gasApi HTTP error for "${action}": ${response.status}`);
      return { success: false, error: `HTTP Error ${response.status}` };
    }
  } catch (directErr: any) {
    console.warn(`gasApi fetch error for "${action}":`, directErr?.message || directErr);
    return { success: false, error: directErr?.message || "Network error communicating with Google Apps Script" };
  }
}

/**
 * Generic POST helper for Google Apps Script Web App.
 * Uses URLSearchParams instead of JSON to avoid CORS preflight issues with Google Apps Script.
 */
async function postGas(payload: Record<string, any>): Promise<any> {
  try {
    const params = new URLSearchParams();
    for (const [key, value] of Object.entries(payload)) {
      if (value !== undefined && value !== null) {
        params.append(key, String(value));
      }
    }

    const response = await fetch(DIRECT_GAS_URL, {
      method: "POST",
      body: params,
      redirect: "follow",
    });

    if (response.ok) {
      const data = await response.json();
      return data;
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
    console.log("gasApi.getEvents fetching from URL:", DIRECT_GAS_URL);
    const res = await getGas("events");
    console.log("gasApi.getEvents raw result:", res);

    if (!res || (res.success === false && !res.events && !res.data)) {
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

    const events = rawList
      .map(normalizeEvent)
      .filter((e) => e && e.id && e.is_published !== false);

    console.log("gasApi.getEvents normalized events count:", events.length, events);

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
    const body = {
      action: "register",
      event_id: String(payload.event_id).trim(),
      name: payload.name.trim(),
      email: payload.email.trim(),
      phone: payload.phone.trim(),
      enrollment_number: payload.enrollment_number.trim(),
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
      registration_id: res.registration_id || res.id || `REG-${Date.now()}`,
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
};

export default gasApi;
