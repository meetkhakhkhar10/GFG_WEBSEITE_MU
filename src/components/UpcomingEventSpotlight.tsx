import React, { useState, useEffect, useMemo, useCallback } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  Sparkles, 
  Calendar, 
  Clock, 
  MapPin, 
  Users, 
  RotateCw, 
  ArrowRight, 
  Tag, 
  AlertCircle, 
  ExternalLink,
  ShieldCheck,
  CheckCircle2,
  Hourglass,
  Layers,
  Flame,
  Award
} from "lucide-react";
import { Link } from "react-router-dom";
import { cn } from "../lib/utils";

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
  registration_status: "OPEN" | "CLOSED" | "FULL" | string;
  status: "PUBLISHED" | "DRAFT" | "CANCELLED" | string;
  organizer: string;
  contact_email: string;
  contact_phone: string;
  registration_count: number;
  poster_url: string;
  registration_link: string;
  category: string;
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

  // Strip ordinal suffixes e.g. 15th, 16th, 1st, 2nd, 3rd
  const deOrdinal = cleanStr.replace(/(\d+)(st|nd|rd|th)/gi, "$1");

  // Handle date ranges e.g. "15–16 August 2026" or "15-16 Aug 2026" -> pick start "15 August 2026"
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

/**
 * Auto-generate category based on Event_Name
 */
function deriveCategory(title: string, rawCat?: string): string {
  const t = (title || "").toUpperCase();
  if (t.includes("HACKATHON") || t.includes("COMPETITION") || t.includes("CODING CONTEST") || t.includes("INTELLIFY")) {
    return "HACKATHON / COMPETITION";
  }
  if (t.includes("WORKSHOP") || t.includes("HANDS-ON") || t.includes("LAB") || t.includes("SESSION")) {
    return "WORKSHOP";
  }
  if (t.includes("BOOTCAMP") || t.includes("TRAINING") || t.includes("MASTERCLASS")) {
    return "BOOTCAMP";
  }
  if (t.includes("CONNECT") || t.includes("MEETUP") || t.includes("ORIENTATION") || t.includes("COMMUNITY")) {
    return "COMMUNITY EVENT";
  }
  if (rawCat && rawCat.trim().length > 2) {
    return rawCat.trim().toUpperCase();
  }
  return "TECH EVENT";
}

/**
 * Normalizes raw Google Sheets event object
 */
function normalizeSheetEvent(e: any): GasEventNormalized {
  if (!e || typeof e !== "object") {
    return {
      id: "unknown",
      title: "Campus Tech Event",
      description: "",
      date: "Upcoming",
      start_time: "10:00 AM",
      end_time: "01:00 PM",
      time_display: "10:00 AM – 01:00 PM",
      venue: "Marwadi University Auditorium",
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
      raw: e,
    };
  }

  const id = String(e.Event_ID || e.event_id || e.id || e.ID || "").trim() || `EVT-${Math.random().toString(36).substring(2, 7).toUpperCase()}`;
  const title = String(e.Event_Name || e.event_name || e.Title || e.title || "Campus Event").trim();
  const description = String(e.Description || e.description || e.Desc || e.desc || "").trim();
  const date = String(e.Date || e.date || e.Start_Date || e.startDate || "Upcoming").trim();

  const startTime = String(e.Start_Time || e.start_time || e.time || "").trim();
  const endTime = String(e.End_Time || e.end_time || "").trim();
  let timeDisplay = startTime ? (endTime ? `${startTime} – ${endTime}` : startTime) : "10:00 AM – 01:00 PM";

  const venue = String(e.Venue || e.venue || e.Location || e.location || "Marwadi University Auditorium").trim();
  const regDeadline = String(e.Registration_Deadline || e.registration_deadline || "").trim();

  const maxParticipants = Number(e.Max_Participants || e.max_participants || e.Capacity || e.capacity || 500) || 500;
  const regCount = Number(e.Registration_Count || e.registration_count || 0) || 0;

  const regStatusRaw = String(e.Registration_Status || e.registration_status || "OPEN").trim().toUpperCase();
  const statusRaw = String(e.Status || e.status || "PUBLISHED").trim().toUpperCase();

  const poster =
    e.Image_URL ||
    e.image_url ||
    e.Poster_URL ||
    e.poster_url ||
    e.Poster_Image ||
    e.poster_image ||
    e.Banner_Image ||
    e.banner_image ||
    "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&q=80&w=800";

  const regLink = String(e.Registration_Link || e.registration_link || e.registrationLink || "").trim();
  const category = deriveCategory(title, e.Category || e.category);

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
    category,
    raw: e,
  };
}

export default function UpcomingEventSpotlight() {
  const [loading, setLoading] = useState<boolean>(true);
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedEvent, setSelectedEvent] = useState<GasEventNormalized | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date());
  
  // Countdown timer state
  const [countdownText, setCountdownText] = useState<string>("");
  const [isExpired, setIsExpired] = useState<boolean>(false);

  /**
   * Main Live Fetch function targeting Google Apps Script
   */
  const fetchLiveEvents = useCallback(async (isManualRefresh = false) => {
    if (isManualRefresh) setIsRefreshing(true);
    setError(null);

    try {
      const fetchUrl = `${GAS_EVENTS_URL}?action=events&t=${Date.now()}`;
      const response = await fetch(fetchUrl, { redirect: "follow" });
      
      if (!response.ok) {
        throw new Error(`HTTP Error ${response.status}`);
      }

      const resJson = await response.json();

      // DEBUG LOGS as required by prompt
      console.log("EVENT API RESPONSE:", resJson);

      let rawList: any[] = [];
      if (Array.isArray(resJson.events)) {
        rawList = resJson.events;
      } else if (Array.isArray(resJson.data)) {
        rawList = resJson.data;
      } else if (Array.isArray(resJson.records)) {
        rawList = resJson.records;
      } else if (Array.isArray(resJson)) {
        rawList = resJson;
      }

      console.log("EVENT COUNT:", rawList.length);

      const normalizedList = rawList.map(normalizeSheetEvent);

      // LIVE FILTERING LOGIC
      // 1. Status === "PUBLISHED"
      // 2. Registration_Status === "OPEN"
      // 3. Today <= Registration_Deadline
      // 4. Event Date is today or future
      const now = new Date();
      const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0, 0, 0);

      const validEvents = normalizedList.filter((e) => {
        // Condition 1: Status live
        const isStatusPublished = e.status === "PUBLISHED" || e.status === "ACTIVE";
        if (!isStatusPublished) return false;

        // Condition 2: Registration open
        const isRegOpen = e.registration_status === "OPEN";
        if (!isRegOpen) return false;

        // Condition 3: Registration deadline has not passed
        if (e.registration_deadline) {
          const deadlineObj = parseDateString(e.registration_deadline);
          if (deadlineObj) {
            // set to end of deadline day
            deadlineObj.setHours(23, 59, 59, 999);
            if (now > deadlineObj) return false; // expired
          }
        }

        // Condition 4: Event date must be today or future
        const eventDateObj = parseDateString(e.date);
        if (eventDateObj) {
          eventDateObj.setHours(23, 59, 59, 999);
          if (eventDateObj < todayStart) return false; // past event
        }

        return true;
      });

      console.log("FILTERED EVENTS:", validEvents);

      // Sort by nearest upcoming event Date ascending
      validEvents.sort((a, b) => {
        const dateA = parseDateString(a.date)?.getTime() ?? Infinity;
        const dateB = parseDateString(b.date)?.getTime() ?? Infinity;
        return dateA - dateB;
      });

      const picked = validEvents.length > 0 ? validEvents[0] : null;

      // DEBUG LOGS
      console.log("UPCOMING EVENT:", picked);
      console.log("REGISTRATION STATUS:", picked ? picked.registration_status : "N/A");
      console.log("SELECTED EVENT ID:", picked ? picked.id : "NONE");

      setSelectedEvent(picked);
      setLastUpdated(new Date());
    } catch (err: any) {
      console.error("Live Event Spotlight API Error:", err);
      setError(err?.message || "Failed to fetch live events from Google Apps Script.");
    } finally {
      setLoading(false);
      setIsRefreshing(false);
    }
  }, []);

  // Initial load and 60-second auto-refresh interval
  useEffect(() => {
    fetchLiveEvents();

    const interval = setInterval(() => {
      fetchLiveEvents();
    }, 60000);

    return () => clearInterval(interval);
  }, [fetchLiveEvents]);

  // Dynamic countdown timer calculation
  useEffect(() => {
    if (!selectedEvent) return;

    const calculateTimeLeft = () => {
      const now = new Date();
      // Target deadline or event date
      let targetDate = parseDateString(selectedEvent.registration_deadline);
      if (!targetDate) {
        targetDate = parseDateString(selectedEvent.date);
      }

      if (!targetDate) {
        setCountdownText("Registration Open");
        setIsExpired(false);
        return;
      }

      // End of target day
      targetDate.setHours(23, 59, 59, 999);
      const diff = targetDate.getTime() - now.getTime();

      if (diff <= 0) {
        setCountdownText("Registration Closed");
        setIsExpired(true);
        return;
      }

      setIsExpired(false);
      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
      const mins = Math.floor((diff / (1000 * 60)) % 60);

      if (days > 0) {
        setCountdownText(`${days} Day${days > 1 ? "s" : ""} ${hours} Hr${hours !== 1 ? "s" : ""} Left`);
      } else if (hours > 0) {
        setCountdownText(`${hours} Hour${hours > 1 ? "s" : ""} ${mins} Min${mins !== 1 ? "s" : ""} Left`);
      } else {
        setCountdownText(`${mins} Minute${mins !== 1 ? "s" : ""} Left`);
      }
    };

    calculateTimeLeft();
    const timer = setInterval(calculateTimeLeft, 1000);
    return () => clearInterval(timer);
  }, [selectedEvent]);

  // Percentage for progress bar
  const progressPercent = useMemo(() => {
    if (!selectedEvent || selectedEvent.max_participants <= 0) return 0;
    const pct = Math.round((selectedEvent.registration_count / selectedEvent.max_participants) * 100);
    return Math.min(100, Math.max(0, pct));
  }, [selectedEvent]);

  // Is event full check
  const isFull = useMemo(() => {
    if (!selectedEvent) return false;
    return selectedEvent.registration_count >= selectedEvent.max_participants;
  }, [selectedEvent]);

  return (
    <section className="py-20 sm:py-28 bg-[#02050b] relative overflow-hidden border-b border-white/10 text-white">
      {/* Dynamic Background Glow & Grid */}
      <div className="absolute inset-0 z-0 opacity-40 pointer-events-none">
        <div className="absolute top-0 left-0 w-full h-full bg-[linear-gradient(rgba(0,255,136,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(0,255,136,0.02)_1px,transparent_1px)] bg-[size:80px_80px]" />
        <div className="absolute top-1/4 -left-32 w-[600px] h-[600px] bg-[#00ff88]/10 rounded-full blur-[160px] pointer-events-none" />
        <div className="absolute bottom-10 -right-32 w-[500px] h-[500px] bg-blue-500/10 rounded-full blur-[160px] pointer-events-none" />
      </div>

      <div className="max-w-7xl mx-auto px-6 relative z-10 w-full">
        {/* Section Heading */}
        <div className="flex flex-col items-center text-center mb-12 sm:mb-16">
          <div className="flex items-center gap-3 mb-4 flex-wrap justify-center">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="inline-flex items-center space-x-2 px-4 py-1.5 bg-[#00ff88]/10 border border-[#00ff88]/30 rounded-full shadow-[0_0_15px_rgba(0,255,136,0.15)]"
            >
              <span className="w-2 h-2 rounded-full bg-[#00ff88] shadow-[0_0_10px_#00ff88] animate-pulse" />
              <span className="text-[10px] sm:text-xs font-black uppercase tracking-[0.25em] text-[#00ff88]">
                FEATURED EVENT • UPCOMING
              </span>
            </motion.div>

            {/* Manual Refresh Button */}
            <button
              onClick={() => fetchLiveEvents(true)}
              disabled={isRefreshing}
              title="Refresh live event from Google Sheets"
              className="p-2 rounded-full bg-white/5 border border-white/10 hover:border-[#00ff88]/50 hover:bg-[#00ff88]/10 text-white/70 hover:text-[#00ff88] transition-all duration-300 disabled:opacity-50"
            >
              <RotateCw className={cn("w-3.5 h-3.5", isRefreshing && "animate-spin text-[#00ff88]")} />
            </button>
          </div>

          <h2 className="text-4xl sm:text-5xl md:text-6xl font-black italic tracking-tighter uppercase mb-4 text-white">
            EVENT <span className="text-[#00ff88] drop-shadow-[0_0_20px_rgba(0,255,136,0.3)]">SPOTLIGHT</span>
          </h2>

          <p className="text-white/60 text-sm sm:text-base font-medium max-w-2xl leading-relaxed">
            Live from our Google Sheets backend. Explore our flagship chapter activation at Marwadi University—compete, innovate, and register instantly.
          </p>
        </div>

        {/* 1. SKELETON LOADER STATE */}
        {loading && (
          <div className="max-w-5xl mx-auto bg-white/5 backdrop-blur-2xl border border-white/10 rounded-[32px] overflow-hidden p-8 sm:p-12 animate-pulse shadow-2xl">
            <div className="flex flex-col lg:flex-row gap-8 items-center h-[480px]">
              <div className="w-full lg:w-1/2 h-full bg-white/10 rounded-2xl" />
              <div className="w-full lg:w-1/2 space-y-6 flex flex-col justify-between h-full py-4">
                <div className="space-y-4">
                  <div className="h-6 w-32 bg-white/10 rounded-full" />
                  <div className="h-10 w-3/4 bg-white/10 rounded-xl" />
                  <div className="h-16 w-full bg-white/10 rounded-xl" />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="h-16 bg-white/10 rounded-xl" />
                  <div className="h-16 bg-white/10 rounded-xl" />
                  <div className="h-16 bg-white/10 rounded-xl" />
                  <div className="h-16 bg-white/10 rounded-xl" />
                </div>
                <div className="h-12 w-full bg-white/10 rounded-xl" />
              </div>
            </div>
          </div>
        )}

        {/* 2. ERROR STATE */}
        {!loading && error && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-3xl mx-auto bg-red-950/20 backdrop-blur-2xl border border-red-500/30 rounded-[28px] p-8 text-center text-white shadow-2xl"
          >
            <AlertCircle className="w-12 h-12 text-red-400 mx-auto mb-4 animate-bounce" />
            <h3 className="text-xl font-bold uppercase tracking-wide text-red-200 mb-2">Unable to load upcoming events</h3>
            <p className="text-xs text-white/60 mb-6">{error}</p>
            <button
              onClick={() => fetchLiveEvents(true)}
              className="px-6 py-3 bg-red-500/20 border border-red-500/40 hover:bg-red-500 hover:text-black font-black uppercase text-xs tracking-widest rounded-xl transition-all inline-flex items-center space-x-2"
            >
              <RotateCw className="w-4 h-4" />
              <span>Retry Fetching</span>
            </button>
          </motion.div>
        )}

        {/* 3. EMPTY STATE (No Live / Published / Open Events) */}
        {!loading && !error && !selectedEvent && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-3xl mx-auto bg-white/5 backdrop-blur-2xl border border-white/10 rounded-[32px] p-12 text-center text-white shadow-2xl"
          >
            <Calendar className="w-16 h-16 text-[#00ff88]/60 mx-auto mb-6" />
            <h3 className="text-2xl font-black uppercase tracking-tight italic mb-3 text-white">No Live Events Right Now</h3>
            <p className="text-white/60 text-sm max-w-md mx-auto mb-8 font-medium leading-relaxed">
              We'll announce upcoming chapter events soon. Stay tuned for hackathons, workshops, and coding challenges!
            </p>
            <Link
              to="/events"
              className="inline-flex items-center px-8 py-4 bg-[#00ff88] text-black font-black uppercase text-xs tracking-[0.2em] rounded-xl hover:bg-white transition-all shadow-[0_0_20px_rgba(0,255,136,0.3)]"
            >
              <span>Explore Event Archive</span>
              <ArrowRight className="w-4 h-4 ml-2" />
            </Link>
          </motion.div>
        )}

        {/* 4. MAIN LIVE SPOTLIGHT CARD */}
        {!loading && !error && selectedEvent && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="max-w-5xl mx-auto bg-[#070d18]/80 backdrop-blur-3xl border border-white/10 hover:border-[#00ff88]/40 transition-all duration-500 rounded-[32px] overflow-hidden shadow-[0_20px_80px_rgba(0,0,0,0.8)] relative group"
          >
            {/* Top Accent Neon Gradient Strip */}
            <div className="absolute top-0 left-0 right-0 h-[3px] bg-gradient-to-r from-transparent via-[#00ff88] to-transparent z-20 shadow-[0_0_15px_#00ff88]" />

            <div className="flex flex-col lg:flex-row items-stretch min-h-[520px]">
              
              {/* LEFT COLUMN: HERO ANIMATED TILE-PAPER ARTWORK */}
              <div className="w-full lg:w-[50%] relative overflow-hidden shrink-0 min-h-[340px] lg:min-h-[520px] bg-[#02050b] flex items-center justify-center select-none">
                
                {/* Background Base Image */}
                <img
                  src={selectedEvent.poster_url}
                  alt={selectedEvent.title}
                  className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700 ease-out"
                  referrerPolicy="no-referrer"
                  loading="lazy"
                />

                {/* Dark Vignette & Gradient Overlays */}
                <div className="absolute inset-0 bg-gradient-to-t via-black/20 from-[#070d18] lg:bg-gradient-to-r lg:from-transparent lg:to-[#070d18] pointer-events-none" />
                <div className="absolute inset-0 bg-black/30 backdrop-blur-[1px] pointer-events-none" />

                {/* TILE PAPER / FLOATING STRIPS ANIMATION */}
                <div className="absolute inset-0 overflow-hidden pointer-events-none z-10">
                  {/* Strip 1 - Diagonal Top Left */}
                  <motion.div
                    animate={{
                      x: [-20, 20, -20],
                      y: [-15, 15, -15],
                      rotate: [-8, -4, -8],
                    }}
                    transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
                    className="absolute top-8 left-4 w-44 h-12 bg-white/10 dark:bg-[#00ff88]/15 backdrop-blur-md border border-white/20 rounded-xl shadow-lg transform -rotate-6"
                  />

                  {/* Strip 2 - Diagonal Mid Right */}
                  <motion.div
                    animate={{
                      x: [15, -15, 15],
                      y: [20, -20, 20],
                      rotate: [12, 6, 12],
                    }}
                    transition={{ duration: 8.5, repeat: Infinity, ease: "easeInOut" }}
                    className="absolute top-1/3 -right-6 w-52 h-16 bg-[#00ff88]/10 backdrop-blur-lg border border-[#00ff88]/30 rounded-2xl shadow-xl transform rotate-12"
                  />

                  {/* Strip 3 - Bottom Floating Glass Card */}
                  <motion.div
                    animate={{
                      x: [-10, 10, -10],
                      y: [10, -10, 10],
                      rotate: [3, -3, 3],
                    }}
                    transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
                    className="absolute bottom-12 left-10 w-48 h-14 bg-black/50 backdrop-blur-xl border border-white/15 rounded-xl shadow-2xl p-3 flex items-center space-x-3"
                  >
                    <div className="w-8 h-8 rounded-lg bg-[#00ff88]/20 flex items-center justify-center shrink-0">
                      <Flame className="w-4 h-4 text-[#00ff88]" />
                    </div>
                    <div className="text-[10px] font-mono text-white/90 font-bold leading-tight">
                      <div>NATIONAL LEVEL</div>
                      <div className="text-[#00ff88] text-[9px] uppercase">{selectedEvent.category.split(" / ")[0]}</div>
                    </div>
                  </motion.div>

                  {/* Strip 4 - Center Accent Tile */}
                  <motion.div
                    animate={{
                      scale: [0.95, 1.05, 0.95],
                      rotate: [0, 5, 0],
                    }}
                    transition={{ duration: 9, repeat: Infinity, ease: "easeInOut" }}
                    className="absolute top-1/2 left-1/4 w-32 h-32 border border-[#00ff88]/20 rounded-3xl bg-gradient-to-tr from-[#00ff88]/5 to-transparent backdrop-blur-sm -z-0"
                  />

                  {/* Floating particles */}
                  {Array.from({ length: 6 }).map((_, idx) => (
                    <motion.div
                      key={idx}
                      animate={{
                        y: [0, -80, 0],
                        opacity: [0.2, 0.8, 0.2],
                      }}
                      transition={{
                        duration: 4 + idx * 1.5,
                        repeat: Infinity,
                        ease: "easeInOut",
                        delay: idx * 0.7,
                      }}
                      style={{
                        left: `${15 + idx * 14}%`,
                        bottom: `${10 + (idx % 3) * 20}%`,
                      }}
                      className="absolute w-2 h-2 rounded-full bg-[#00ff88] shadow-[0_0_10px_#00ff88]"
                    />
                  ))}
                </div>

                {/* Event Badge Overlay - Top-Left Corner */}
                <div className="absolute top-6 left-6 z-20 flex items-center space-x-2 px-3.5 py-1.5 bg-black/80 backdrop-blur-md rounded-full border border-[#00ff88]/40 shadow-xl">
                  <span className="w-2 h-2 rounded-full bg-[#00ff88] shadow-[0_0_10px_#00ff88] animate-pulse" />
                  <span className="text-[10px] font-black uppercase tracking-widest text-[#00ff88]">
                    UPCOMING EVENT
                  </span>
                </div>

                {/* Monospace Event ID Badge - Top Right */}
                <div className="absolute top-6 right-6 z-20 px-3 py-1 bg-black/80 backdrop-blur-md rounded-lg border border-white/20 font-mono text-[10px] text-white/80 font-bold tracking-wider">
                  {selectedEvent.id}
                </div>
              </div>

              {/* RIGHT COLUMN: DYNAMIC EVENT INFORMATION */}
              <div className="w-full lg:w-[50%] p-6 sm:p-8 lg:p-10 flex flex-col justify-between relative z-20">
                
                <div className="space-y-5">
                  
                  {/* Category Pill + Registration Status Chip */}
                  <div className="flex items-center justify-between gap-2 flex-wrap">
                    <span className="inline-flex items-center px-3 py-1 rounded-md bg-[#00ff88]/10 border border-[#00ff88]/20 text-[10px] font-black uppercase tracking-widest text-[#00ff88]">
                      {selectedEvent.category}
                    </span>

                    {/* Registration Status Chip */}
                    <div className="flex items-center space-x-2">
                      {isExpired ? (
                        <span className="px-3 py-1 bg-red-950/80 border border-red-500/40 text-red-400 text-[10px] font-black uppercase tracking-wider rounded-md">
                          Registration Closed
                        </span>
                      ) : isFull ? (
                        <span className="px-3 py-1 bg-amber-950/80 border border-amber-500/40 text-amber-400 text-[10px] font-black uppercase tracking-wider rounded-md">
                          Event Full
                        </span>
                      ) : (
                        <span className="inline-flex items-center space-x-1.5 px-3 py-1 bg-emerald-950/80 border border-[#00ff88]/50 text-[#00ff88] text-[10px] font-black uppercase tracking-wider rounded-md">
                          <span className="w-1.5 h-1.5 rounded-full bg-[#00ff88] animate-ping" />
                          <span>Registration Open</span>
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Title */}
                  <h3 className="text-2xl sm:text-3xl lg:text-4xl font-black uppercase italic tracking-tight text-white leading-tight">
                    {selectedEvent.title}
                  </h3>

                  {/* Description - truncated to 3 lines */}
                  <p className="text-white/70 text-xs sm:text-sm font-medium leading-relaxed line-clamp-3">
                    {selectedEvent.description || "Join us at Marwadi University for an unforgettable experience filled with innovation, hands-on learning, and networking."}
                  </p>

                  {/* 6 DYNAMIC EVENT META CARDS GRID */}
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 pt-2">
                    
                    {/* Card 1: DATE */}
                    <div className="bg-black/40 border border-white/10 p-2.5 rounded-xl flex flex-col justify-between">
                      <div className="flex items-center space-x-1.5 text-[9px] font-mono text-[#00ff88] uppercase tracking-wider">
                        <Calendar className="w-3 h-3 shrink-0" />
                        <span>DATE</span>
                      </div>
                      <div className="text-xs font-bold text-white mt-1 truncate">{selectedEvent.date}</div>
                    </div>

                    {/* Card 2: TIME */}
                    <div className="bg-black/40 border border-white/10 p-2.5 rounded-xl flex flex-col justify-between">
                      <div className="flex items-center space-x-1.5 text-[9px] font-mono text-[#00ff88] uppercase tracking-wider">
                        <Clock className="w-3 h-3 shrink-0" />
                        <span>TIME</span>
                      </div>
                      <div className="text-xs font-bold text-white mt-1 truncate">{selectedEvent.time_display}</div>
                    </div>

                    {/* Card 3: VENUE */}
                    <div className="bg-black/40 border border-white/10 p-2.5 rounded-xl flex flex-col justify-between">
                      <div className="flex items-center space-x-1.5 text-[9px] font-mono text-[#00ff88] uppercase tracking-wider">
                        <MapPin className="w-3 h-3 shrink-0" />
                        <span>VENUE</span>
                      </div>
                      <div className="text-xs font-bold text-white mt-1 truncate" title={selectedEvent.venue}>
                        {selectedEvent.venue.split(",")[0]}
                      </div>
                    </div>

                    {/* Card 4: SEATS */}
                    <div className="bg-black/40 border border-white/10 p-2.5 rounded-xl flex flex-col justify-between">
                      <div className="flex items-center space-x-1.5 text-[9px] font-mono text-[#00ff88] uppercase tracking-wider">
                        <Users className="w-3 h-3 shrink-0" />
                        <span>SEATS</span>
                      </div>
                      <div className="text-xs font-bold text-white mt-1 truncate">
                        {selectedEvent.max_participants} Seats
                      </div>
                    </div>

                    {/* Card 5: REGISTRATIONS */}
                    <div className="bg-black/40 border border-white/10 p-2.5 rounded-xl flex flex-col justify-between">
                      <div className="flex items-center space-x-1.5 text-[9px] font-mono text-[#00ff88] uppercase tracking-wider">
                        <CheckCircle2 className="w-3 h-3 shrink-0" />
                        <span>REGISTERED</span>
                      </div>
                      <div className="text-xs font-bold text-white mt-1 truncate">
                        {selectedEvent.registration_count} / {selectedEvent.max_participants}
                      </div>
                    </div>

                    {/* Card 6: DEADLINE / COUNTDOWN */}
                    <div className="bg-black/40 border border-[#00ff88]/30 p-2.5 rounded-xl flex flex-col justify-between bg-[#00ff88]/5">
                      <div className="flex items-center space-x-1.5 text-[9px] font-mono text-[#00ff88] uppercase tracking-wider">
                        <Hourglass className="w-3 h-3 shrink-0 animate-spin" style={{ animationDuration: "8s" }} />
                        <span>DEADLINE</span>
                      </div>
                      <div className="text-xs font-bold text-[#00ff88] mt-1 truncate font-mono">
                        {countdownText || "Closing Soon"}
                      </div>
                    </div>

                  </div>

                  {/* LIVE REGISTRATION PROGRESS BAR */}
                  <div className="space-y-1.5 pt-2">
                    <div className="flex items-center justify-between text-[10px] font-mono uppercase tracking-wider text-white/70">
                      <span>Registration Progress</span>
                      <span className="text-[#00ff88] font-bold">
                        {selectedEvent.registration_count} / {selectedEvent.max_participants} ({progressPercent}%)
                      </span>
                    </div>
                    <div className="w-full h-2.5 bg-black/60 rounded-full overflow-hidden border border-white/10 p-0.5">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${progressPercent}%` }}
                        transition={{ duration: 1.2, ease: "easeOut" }}
                        className="h-full bg-gradient-to-r from-[#00ff88]/80 to-[#00ff88] rounded-full shadow-[0_0_12px_#00ff88]"
                      />
                    </div>
                  </div>

                </div>

                {/* CTA BUTTONS */}
                <div className="flex flex-col sm:flex-row items-center gap-3 mt-8 pt-4 border-t border-white/10">
                  
                  {/* Button 1: REGISTER NOW */}
                  {selectedEvent.registration_link ? (
                    <a
                      href={selectedEvent.registration_link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={cn(
                        "w-full sm:flex-1 inline-flex items-center justify-center px-6 py-3.5 bg-[#00ff88] hover:bg-white text-black font-black text-xs uppercase tracking-[0.2em] rounded-xl transition-all shadow-[0_0_20px_rgba(0,255,136,0.25)] hover:shadow-[0_0_30px_rgba(0,255,136,0.5)] duration-300",
                        (isExpired || isFull) && "pointer-events-none opacity-50 bg-white/20 text-white shadow-none"
                      )}
                    >
                      <span>{isExpired ? "Registration Closed" : isFull ? "Event Full" : "Register Now"}</span>
                      <ExternalLink className="w-4 h-4 ml-2" />
                    </a>
                  ) : (
                    <Link
                      to={`/events?id=${selectedEvent.id}&register=true`}
                      className={cn(
                        "w-full sm:flex-1 inline-flex items-center justify-center px-6 py-3.5 bg-[#00ff88] hover:bg-white text-black font-black text-xs uppercase tracking-[0.2em] rounded-xl transition-all shadow-[0_0_20px_rgba(0,255,136,0.25)] hover:shadow-[0_0_30px_rgba(0,255,136,0.5)] duration-300",
                        (isExpired || isFull) && "pointer-events-none opacity-50 bg-white/20 text-white shadow-none"
                      )}
                    >
                      <span>{isExpired ? "Registration Closed" : isFull ? "Event Full" : "Register Now"}</span>
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Link>
                  )}

                  {/* Button 2: VIEW DETAILS */}
                  <Link
                    to={`/events?id=${selectedEvent.id}`}
                    className="w-full sm:w-auto inline-flex items-center justify-center px-6 py-3.5 bg-white/5 hover:bg-white/10 border border-white/15 hover:border-[#00ff88]/40 text-white text-xs font-black uppercase tracking-[0.15em] rounded-xl transition-all duration-300"
                  >
                    <span>View Details</span>
                  </Link>
                </div>

              </div>
            </div>
          </motion.div>
        )}
      </div>
    </section>
  );
}
