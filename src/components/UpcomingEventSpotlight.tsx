import React, { useState, useEffect, useMemo, useCallback } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  Calendar, 
  Clock, 
  MapPin, 
  Users, 
  RotateCw, 
  ArrowRight, 
  ArrowUpRight,
  AlertCircle, 
  ExternalLink,
  ShieldCheck,
  Award,
  Sparkles
} from "lucide-react";
import { Link } from "react-router-dom";
import EditorialImage from "./EditorialImage";

// Exact hardcoded Google Apps Script URL as instructed
const GAS_EVENTS_URL = "https://script.google.com/macros/s/AKfycbwXI6rB6TB2dGPvAUEN8OPNeISND5fmWbsnQu4TtI0bz5UsbKrh4X8zfm6pIMozXSVpDw/exec";

export interface GasEventNormalized {
  id: string;
  title: string;
  description: string;
  date: string;
  start_time: string;
  end_time: string;
  time_display: string;
  venue: string;
  registration_deadline: string;
  max_participants: number;
  registration_status: string;
  status: string;
  organizer: string;
  contact_email: string;
  contact_phone: string;
  registration_count: number;
  poster_url: string;
  registration_link: string;
  category: string;
  registration_fee: string;
  team_size: string;
  prize_pool: string;
  raw: any;
}

/**
 * Utility to robustly parse various date formats from Google Sheets
 */
function parseDateString(dateStr: string): Date | null {
  if (!dateStr || typeof dateStr !== "string") return null;
  const cleanStr = dateStr.trim();
  if (!cleanStr) return null;

  // Try standard ISO or JavaScript Date parse
  const directDate = new Date(cleanStr);
  if (!isNaN(directDate.getTime())) return directDate;

  // Strip ordinal suffixes (15th, 16th, 1st, 2nd, 3rd)
  const deOrdinal = cleanStr.replace(/(\d+)(st|nd|rd|th)/gi, "$1");

  // Handle date ranges e.g. "15–16 August 2026"
  const rangeMatch = deOrdinal.match(/(\d{1,2})\s*[\u2013\u2014-]\s*\d{1,2}\s+([A-Za-z]+)\s+(\d{4})/);
  if (rangeMatch) {
    const parsedRange = new Date(`${rangeMatch[1]} ${rangeMatch[2]} ${rangeMatch[3]}`);
    if (!isNaN(parsedRange.getTime())) return parsedRange;
  }

  // Try parsing de-ordinalized string
  const parsedDeOrdinal = new Date(deOrdinal);
  if (!isNaN(parsedDeOrdinal.getTime())) return parsedDeOrdinal;

  // DD/MM/YYYY or DD-MM-YYYY
  const dmyMatch = cleanStr.match(/^(\d{1,2})[/-](\d{1,2})[/-](\d{4})$/);
  if (dmyMatch) {
    const day = parseInt(dmyMatch[1], 10);
    const month = parseInt(dmyMatch[2], 10) - 1;
    const year = parseInt(dmyMatch[3], 10);
    const dmyDate = new Date(year, month, day);
    if (!isNaN(dmyDate.getTime())) return dmyDate;
  }

  return null;
}

function normalizeSheetEvent(e: any): GasEventNormalized {
  if (!e || typeof e !== "object") {
    return {
      id: "EVT-001",
      title: "Campus Tech Event",
      description: "",
      date: "Upcoming",
      start_time: "10:00 AM",
      end_time: "01:00 PM",
      time_display: "10:00 AM – 01:00 PM",
      venue: "Marwadi University",
      registration_deadline: "",
      max_participants: 500,
      registration_status: "OPEN",
      status: "PUBLISHED",
      organizer: "GeeksforGeeks × Marwadi University",
      contact_email: "gfg@marwadiuniversity.ac.in",
      contact_phone: "",
      registration_count: 0,
      poster_url: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&q=80&w=800",
      registration_link: "",
      category: "TECH EVENT",
      registration_fee: "Free",
      team_size: "1–4",
      prize_pool: "Certificate & Swag",
      raw: e,
    };
  }

  const id = String(e.Event_ID || e.event_id || e.id || e.ID || "").trim() || `EVT-${Math.random().toString(36).substring(2, 6).toUpperCase()}`;
  const title = String(e.Event_Name || e.event_name || e.Title || e.title || "Campus Tech Event").trim();
  const description = String(e.Description || e.description || e.Desc || e.desc || "").trim();
  const date = String(e.Date || e.date || e.Start_Date || e.startDate || "Upcoming").trim();

  const startTime = String(e.Start_Time || e.start_time || e.time || "").trim();
  const endTime = String(e.End_Time || e.end_time || "").trim();
  const timeDisplay = startTime ? (endTime ? `${startTime} – ${endTime}` : startTime) : "10:00 AM – 01:00 PM";

  const venue = String(e.Venue || e.venue || e.Location || e.location || "Marwadi University, Rajkot").trim();
  const regDeadline = String(e.Registration_Deadline || e.registration_deadline || "").trim();

  const maxParticipants = Number(e.Max_Participants || e.max_participants || e.Capacity || e.capacity || 500) || 500;
  const regCount = Number(e.Registration_Count || e.registration_count || 0) || 0;

  const regStatusRaw = String(e.Registration_Status || e.registration_status || "OPEN").trim().toUpperCase();
  const statusRaw = String(e.Status || e.status || "PUBLISHED").trim().toUpperCase();

  let poster =
    e.Image_URL ||
    e.image_url ||
    e.Poster_URL ||
    e.poster_url ||
    e.Poster_Image ||
    e.poster_image ||
    e.Banner_Image ||
    e.banner_image ||
    "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&q=80&w=800";

  // Specific event image mapping for GFG × Marwadi University Connect
  const isGfgConnect = 
    id === "EVT-0001" || 
    title.toLowerCase().includes("marwadi university connect") ||
    (title.toLowerCase().includes("connect") && title.toLowerCase().includes("marwadi"));

  if (isGfgConnect) {
    poster = "/images/gfg-connect-banner.jpg";
  }

  const regLink = String(e.Registration_Link || e.registration_link || e.registrationLink || "").trim();
  const fee = String(e.Registration_Fee || e.registration_fee || e.Fee || "Free Entry").trim();
  const teamSize = String(e.Team_Size || e.team_size || "1–4 Members").trim();
  const prizes = String(e.Prize_Pool || e.prize_pool || "Official Certificates & Goodies").trim();
  const cat = String(e.Category || e.category || "HACKATHON / TECH WORKSHOP").trim();

  return {
    id,
    title,
    description,
    date,
    start_time: startTime,
    end_time: endTime,
    time_display: timeDisplay,
    venue,
    registration_deadline: regDeadline,
    max_participants: maxParticipants,
    registration_status: regStatusRaw,
    status: statusRaw,
    organizer: String(e.Organizer || e.organizer || "GeeksforGeeks × Marwadi University").trim(),
    contact_email: String(e.Contact_Email || e.contact_email || "").trim(),
    contact_phone: String(e.Contact_Phone || e.contact_phone || "").trim(),
    registration_count: regCount,
    poster_url: poster,
    registration_link: regLink,
    category: cat,
    registration_fee: fee,
    team_size: teamSize,
    prize_pool: prizes,
    raw: e,
  };
}

export default function UpcomingEventSpotlight() {
  const [loading, setLoading] = useState<boolean>(true);
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedEvent, setSelectedEvent] = useState<GasEventNormalized | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date());
  
  // Countdown breakdown state
  const [countdown, setCountdown] = useState<{
    days: string;
    hours: string;
    mins: string;
    secs: string;
    isExpired: boolean;
  }>({
    days: "00",
    hours: "00",
    mins: "00",
    secs: "00",
    isExpired: false,
  });

  const fetchLiveEvents = useCallback(async (isManual = false) => {
    if (isManual) setIsRefreshing(true);
    setError(null);

    try {
      let rawList: any[] = [];
      let fetchSuccess = false;

      // 1. Try direct Google Apps Script endpoint
      try {
        const fetchUrl = `${GAS_EVENTS_URL}?action=events&t=${Date.now()}`;
        const res = await fetch(fetchUrl, { redirect: "follow" });
        if (res.ok) {
          const resJson = await res.json();
          console.log("GAS EVENTS API RESPONSE:", resJson);
          if (Array.isArray(resJson.events)) rawList = resJson.events;
          else if (Array.isArray(resJson.data)) rawList = resJson.data;
          else if (Array.isArray(resJson.records)) rawList = resJson.records;
          else if (Array.isArray(resJson)) rawList = resJson;
          if (rawList.length > 0) fetchSuccess = true;
        }
      } catch (gasErr) {
        console.warn("Direct GAS fetch notice, attempting /api/events fallback:", gasErr);
      }

      // 2. Fallback to server proxy /api/events if direct fetch did not succeed
      if (!fetchSuccess) {
        try {
          const localRes = await fetch("/api/events");
          if (localRes.ok) {
            const localJson = await localRes.json();
            const list = Array.isArray(localJson) ? localJson : (localJson.data || localJson.events || []);
            if (Array.isArray(list) && list.length > 0) {
              rawList = list;
              fetchSuccess = true;
            }
          }
        } catch (localErr) {
          console.warn("/api/events fallback notice:", localErr);
        }
      }

      const normalized = rawList.map(normalizeSheetEvent);

      // Filtering criteria:
      // 1. Status === "PUBLISHED"
      // 2. Registration_Status === "OPEN"
      // 3. Today <= Registration_Deadline
      // 4. Event Date is today or in the future
      const now = new Date();
      const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0, 0, 0);

      const validEvents = normalized.filter((e) => {
        if (e.status !== "PUBLISHED" && e.status !== "ACTIVE") return false;
        if (e.registration_status !== "OPEN") return false;

        if (e.registration_deadline) {
          const deadline = parseDateString(e.registration_deadline);
          if (deadline) {
            deadline.setHours(23, 59, 59, 999);
            if (now > deadline) return false;
          }
        }

        if (e.date) {
          const evDate = parseDateString(e.date);
          if (evDate) {
            evDate.setHours(23, 59, 59, 999);
            if (evDate < todayStart) return false;
          }
        }

        return true;
      });

      // Sort by earliest event date ascending
      validEvents.sort((a, b) => {
        const dateA = parseDateString(a.date)?.getTime() ?? Infinity;
        const dateB = parseDateString(b.date)?.getTime() ?? Infinity;
        return dateA - dateB;
      });

      setSelectedEvent(validEvents[0] || null);
      setLastUpdated(new Date());
    } catch (err: any) {
      console.error("Failed to fetch live events:", err);
      setError(err?.message || "Failed to connect to Google Sheets backend.");
    } finally {
      setLoading(false);
      setIsRefreshing(false);
    }
  }, []);

  // Initial fetch and 60-second auto-refresh
  useEffect(() => {
    fetchLiveEvents();
    const timer = setInterval(() => fetchLiveEvents(), 60000);
    return () => clearInterval(timer);
  }, [fetchLiveEvents]);

  // Live countdown timer
  useEffect(() => {
    if (!selectedEvent) return;

    const tick = () => {
      const now = new Date();
      let target = parseDateString(selectedEvent.registration_deadline) || parseDateString(selectedEvent.date);
      if (!target) {
        setCountdown({ days: "--", hours: "--", mins: "--", secs: "--", isExpired: false });
        return;
      }
      target.setHours(23, 59, 59, 999);
      const diff = target.getTime() - now.getTime();

      if (diff <= 0) {
        setCountdown({ days: "00", hours: "00", mins: "00", secs: "00", isExpired: true });
        return;
      }

      const d = Math.floor(diff / (1000 * 60 * 60 * 24));
      const h = Math.floor((diff / (1000 * 60 * 60)) % 24);
      const m = Math.floor((diff / (1000 * 60)) % 60);
      const s = Math.floor((diff / 1000) % 60);

      setCountdown({
        days: String(d).padStart(2, "0"),
        hours: String(h).padStart(2, "0"),
        mins: String(m).padStart(2, "0"),
        secs: String(s).padStart(2, "0"),
        isExpired: false,
      });
    };

    tick();
    const interval = setInterval(tick, 1000);
    return () => clearInterval(interval);
  }, [selectedEvent]);

  return (
    <section className="py-20 md:py-28 border-b border-[#E2E2DC] bg-[#F4F4F0] relative overflow-hidden select-none">
      
      {/* Background Architectural Grid */}
      <div className="absolute inset-0 bg-technical-grid opacity-50 pointer-events-none" />

      <div className="max-w-[1400px] mx-auto px-6 relative z-10 w-full">
        
        {/* SECTION HEADER & CONTROL BAR */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between pb-6 mb-12 border-b border-[#E2E2DC] gap-4">
          <div>
            <div className="flex items-center space-x-3 mb-2">
              <span className="font-mono text-[10px] uppercase tracking-[0.25em] text-[#00A86B] font-bold">
                02 / LIVE TRANSMISSION
              </span>
              <span className="text-[#8B9198]">·</span>
              <span className="font-mono text-[10px] uppercase tracking-widest text-[#8B9198]">
                GOOGLE SHEETS BACKEND
              </span>
            </div>
            <h2 className="font-editorial text-4xl sm:text-5xl font-black text-[#111318] tracking-tight">
              Event Spotlight
            </h2>
          </div>

          <div className="flex items-center space-x-3">
            <span className="font-mono text-[10px] uppercase tracking-wider text-[#8B9198]">
              AUTO-SYNC 60S
            </span>
            <button
              onClick={() => fetchLiveEvents(true)}
              disabled={isRefreshing}
              title="Refresh live event from Google Sheets"
              className="px-3 py-1.5 bg-[#FFFFFF] border border-[#E2E2DC] hover:border-[#111318] text-[#111318] font-mono text-[10px] uppercase tracking-widest transition-colors flex items-center space-x-1.5 cursor-pointer disabled:opacity-50"
            >
              <RotateCw className={`w-3 h-3 ${isRefreshing ? "animate-spin text-[#00A86B]" : ""}`} />
              <span>SYNC</span>
            </button>
          </div>
        </div>

        {/* LOADING STATE */}
        {loading && (
          <div className="p-12 bg-[#FFFFFF] border border-[#E2E2DC] flex flex-col items-center justify-center space-y-4">
            <div className="font-mono text-xs uppercase tracking-widest text-[#8B9198]">
              QUERYING GOOGLE APPS SCRIPT ENGINE...
            </div>
            <div className="w-48 h-[2px] bg-[#E2E2DC] relative overflow-hidden">
              <div className="w-1/2 h-full bg-[#00A86B] animate-pulse" />
            </div>
          </div>
        )}

        {/* ERROR STATE */}
        {!loading && error && (
          <div className="p-8 bg-[#FFFFFF] border border-[#E2E2DC] text-center space-y-4 max-w-xl mx-auto">
            <AlertCircle className="w-8 h-8 text-amber-600 mx-auto" />
            <div className="font-editorial italic text-xl text-[#111318]">Live Feed Synchronizing</div>
            <p className="font-mono text-xs text-[#555B63]">{error}</p>
            <button
              onClick={() => fetchLiveEvents(true)}
              className="px-5 py-2.5 bg-[#111318] text-[#F4F4F0] font-mono text-xs uppercase tracking-widest hover:bg-[#00A86B] transition-colors"
            >
              Retry Connection
            </button>
          </div>
        )}

        {/* NO EVENTS ACTIVE STATE */}
        {!loading && !error && !selectedEvent && (
          <div className="p-16 bg-[#FFFFFF] border border-[#E2E2DC] text-center space-y-4 max-w-2xl mx-auto">
            <span className="font-mono text-[10px] uppercase tracking-widest text-[#8B9198]">CHAPTER ARCHIVE</span>
            <h3 className="font-editorial text-3xl text-[#111318]">No Current Live Registrations</h3>
            <p className="font-sans text-sm text-[#555B63] max-w-md mx-auto">
              Our upcoming hackathons and masterclasses are currently being scheduled with Marwadi University faculties.
            </p>
            <Link
              to="/events"
              className="inline-flex items-center space-x-2 px-6 py-3 bg-[#111318] text-[#F4F4F0] font-mono text-xs uppercase tracking-widest hover:bg-[#00A86B] transition-colors"
            >
              <span>View All Chapter Events</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        )}

        {/* MAIN EDITORIAL POSTER COMPOSITION */}
        {!loading && !error && selectedEvent && (
          <div className="bg-[#FFFFFF] border border-[#E2E2DC] shadow-[0_8px_30px_rgba(17,19,24,0.04)] overflow-hidden">
            
            {/* Top Index Header Strip */}
            <div className="px-6 py-3.5 border-b border-[#E2E2DC] bg-[#FAF9F5] flex flex-wrap items-center justify-between font-mono text-[10px] uppercase tracking-widest text-[#555B63] gap-2">
              <div className="flex items-center space-x-2">
                <span className="w-2 h-2 rounded-full bg-[#00A86B] animate-pulse" />
                <span className="font-bold text-[#111318]">FEATURED EVENT · LIVE</span>
              </div>
              <div className="flex items-center space-x-3">
                <span className="text-[#8B9198]">{selectedEvent.id}</span>
                <span>·</span>
                <span>{selectedEvent.date}</span>
                <span>·</span>
                <span>GFG × MU</span>
              </div>
            </div>

            {/* Asymmetric 2-Column Poster */}
            <div className="grid grid-cols-1 lg:grid-cols-12 divide-y lg:divide-y-0 lg:divide-x divide-[#E2E2DC]">
              
              {/* LEFT 5 COLS: EDITORIAL POSTER SYSTEM */}
              <div className="lg:col-span-5 p-6 sm:p-8 flex flex-col justify-between space-y-6 bg-[#FAF9F5]">
                <EditorialImage
                  src={selectedEvent.poster_url}
                  alt={selectedEvent.title}
                  variant="poster"
                  figLabel="VISUAL SPECIFICATION"
                  figNumber="FIG. EVT-01"
                  badge={selectedEvent.category}
                  caption={`${selectedEvent.venue.split(",")[0]} · MARWADI UNIVERSITY`}
                  aspectClassName="aspect-[4/3]"
                />

                {/* COUNTDOWN BANNER (EDITORIAL LARGE NUMERALS) */}
                <div className="border border-[#E2E2DC] bg-[#FFFFFF] p-4 space-y-3">
                  <div className="flex items-center justify-between font-mono text-[9px] uppercase tracking-widest text-[#8B9198]">
                    <span>REGISTRATION CLOSES IN</span>
                    <span className="text-[#00A86B]">COUNTDOWN</span>
                  </div>

                  <div className="grid grid-cols-4 divide-x divide-[#E2E2DC] text-center font-mono">
                    <div className="px-2">
                      <div className="font-editorial text-2xl sm:text-3xl text-[#111318] font-bold">
                        {countdown.days}
                      </div>
                      <div className="text-[8px] uppercase tracking-wider text-[#8B9198]">DAYS</div>
                    </div>
                    <div className="px-2">
                      <div className="font-editorial text-2xl sm:text-3xl text-[#111318] font-bold">
                        {countdown.hours}
                      </div>
                      <div className="text-[8px] uppercase tracking-wider text-[#8B9198]">HOURS</div>
                    </div>
                    <div className="px-2">
                      <div className="font-editorial text-2xl sm:text-3xl text-[#111318] font-bold">
                        {countdown.mins}
                      </div>
                      <div className="text-[8px] uppercase tracking-wider text-[#8B9198]">MINS</div>
                    </div>
                    <div className="px-2">
                      <div className="font-editorial text-2xl sm:text-3xl text-[#111318] font-bold">
                        {countdown.secs}
                      </div>
                      <div className="text-[8px] uppercase tracking-wider text-[#8B9198]">SECS</div>
                    </div>
                  </div>
                </div>

              </div>

              {/* RIGHT 7 COLS: EDITORIAL CONTENT & SPECS */}
              <div className="lg:col-span-7 p-6 sm:p-10 flex flex-col justify-between space-y-8">
                
                <div className="space-y-6">
                  
                  {/* Status badge + Category */}
                  <div className="flex items-center justify-between flex-wrap gap-2">
                    <span className="font-mono text-[10px] uppercase tracking-[0.2em] px-2.5 py-1 bg-[#F4F4F0] border border-[#E2E2DC] text-[#555B63]">
                      {selectedEvent.category}
                    </span>

                    <div className="inline-flex items-center space-x-2 font-mono text-[10px] uppercase tracking-widest text-[#00A86B] font-bold">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#00A86B] animate-ping" />
                      <span>● REGISTRATION OPEN</span>
                    </div>
                  </div>

                  {/* Oversized Fraunces Title */}
                  <h3 className="font-editorial text-3xl sm:text-5xl font-black text-[#111318] tracking-tight leading-[1.05]">
                    {selectedEvent.title}
                  </h3>

                  {/* Description */}
                  <p className="font-sans text-sm sm:text-base text-[#555B63] leading-relaxed max-w-2xl border-l-2 border-[#E2E2DC] pl-4">
                    {selectedEvent.description || 
                      "Join students and developers at Marwadi University for an intensive collaborative session exploring modern technology stacks, algorithmic challenges, and hands-on production engineering."}
                  </p>

                  {/* TECHNICAL EVENT PARAMETERS GRID */}
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-2">
                    
                    <div className="p-3 bg-[#FAF9F5] border border-[#E2E2DC] space-y-1">
                      <div className="font-mono text-[9px] uppercase tracking-widest text-[#8B9198] flex items-center gap-1">
                        <Calendar className="w-3 h-3 text-[#00A86B]" />
                        <span>DATE</span>
                      </div>
                      <div className="font-mono text-xs font-semibold text-[#111318] truncate">
                        {selectedEvent.date}
                      </div>
                    </div>

                    <div className="p-3 bg-[#FAF9F5] border border-[#E2E2DC] space-y-1">
                      <div className="font-mono text-[9px] uppercase tracking-widest text-[#8B9198] flex items-center gap-1">
                        <Clock className="w-3 h-3 text-[#00A86B]" />
                        <span>TIME</span>
                      </div>
                      <div className="font-mono text-xs font-semibold text-[#111318] truncate">
                        {selectedEvent.time_display}
                      </div>
                    </div>

                    <div className="p-3 bg-[#FAF9F5] border border-[#E2E2DC] space-y-1">
                      <div className="font-mono text-[9px] uppercase tracking-widest text-[#8B9198] flex items-center gap-1">
                        <MapPin className="w-3 h-3 text-[#00A86B]" />
                        <span>VENUE</span>
                      </div>
                      <div className="font-mono text-xs font-semibold text-[#111318] truncate" title={selectedEvent.venue}>
                        {selectedEvent.venue.split(",")[0]}
                      </div>
                    </div>

                    <div className="p-3 bg-[#FAF9F5] border border-[#E2E2DC] space-y-1">
                      <div className="font-mono text-[9px] uppercase tracking-widest text-[#8B9198] flex items-center gap-1">
                        <Users className="w-3 h-3 text-[#00A86B]" />
                        <span>CAPACITY</span>
                      </div>
                      <div className="font-mono text-xs font-semibold text-[#111318]">
                        {selectedEvent.max_participants} Seats
                      </div>
                    </div>

                    <div className="p-3 bg-[#FAF9F5] border border-[#E2E2DC] space-y-1">
                      <div className="font-mono text-[9px] uppercase tracking-widest text-[#8B9198]">
                        REGISTRATION FEE
                      </div>
                      <div className="font-mono text-xs font-semibold text-[#00A86B]">
                        {selectedEvent.registration_fee}
                      </div>
                    </div>

                    <div className="p-3 bg-[#FAF9F5] border border-[#E2E2DC] space-y-1">
                      <div className="font-mono text-[9px] uppercase tracking-widest text-[#8B9198]">
                        TEAM SIZE
                      </div>
                      <div className="font-mono text-xs font-semibold text-[#111318]">
                        {selectedEvent.team_size}
                      </div>
                    </div>

                  </div>

                </div>

                {/* PRIMARY ACTIONS BAR */}
                <div className="pt-6 border-t border-[#E2E2DC] flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
                  {selectedEvent.registration_link ? (
                    <a
                      href={selectedEvent.registration_link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-8 py-4 bg-[#111318] hover:bg-[#00A86B] text-[#F4F4F0] font-mono text-xs uppercase tracking-widest transition-colors inline-flex items-center justify-center space-x-2"
                    >
                      <span>[ REGISTER NOW → ]</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  ) : (
                    <Link
                      to={`/events?id=${selectedEvent.id}&register=true`}
                      className="px-8 py-4 bg-[#111318] hover:bg-[#00A86B] text-[#F4F4F0] font-mono text-xs uppercase tracking-widest transition-colors inline-flex items-center justify-center space-x-2"
                    >
                      <span>[ REGISTER NOW → ]</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  )}

                  <Link
                    to={`/events?id=${selectedEvent.id}`}
                    className="px-6 py-4 bg-transparent hover:bg-[#F4F4F0] border border-[#E2E2DC] hover:border-[#111318] text-[#111318] font-mono text-xs uppercase tracking-widest transition-colors inline-flex items-center justify-center space-x-2"
                  >
                    <span>View Specifications</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>

                  <div className="sm:ml-auto font-mono text-[10px] text-[#8B9198] text-center sm:text-right">
                    REF: {selectedEvent.id}
                  </div>
                </div>

              </div>

            </div>

          </div>
        )}

      </div>
    </section>
  );
}
