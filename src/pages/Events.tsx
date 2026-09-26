import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { useSearchParams } from "react-router-dom";
import { 
  ArrowRight, Trophy, Terminal, Award, Cpu, 
  Calendar, MapPin, Users, Building2, 
  CheckCircle, Clock, X, 
  Loader2, Copy, Check, AlertTriangle, RefreshCw, Send, CheckCircle2,
  Sparkles, ExternalLink
} from "lucide-react";
import { gasApi, GasEvent, RegistrationPayload, RegistrationResult } from "../services/gasApi";
import PaperTiles from "../components/PaperTiles";
import EditorialImage from "../components/EditorialImage";
import ChapterArchive from "../components/ChapterArchive";
import EventRegistrationModal from "../components/EventRegistrationModal";

const GFG_CONNECT_BANNER_IMAGE = "/images/gfg-connect-banner.jpg";

function getEventCardImage(evt?: { id?: string; title?: string; poster_url?: string; poster_image?: string } | null): string {
  if (!evt) return "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&q=80&w=800";
  const idStr = String(evt.id || "").toLowerCase();
  const titleStr = String(evt.title || "").toLowerCase();
  if (
    idStr === "evt-0001" ||
    titleStr.includes("marwadi university connect") ||
    (titleStr.includes("connect") && titleStr.includes("marwadi")) ||
    (titleStr.includes("connect") && titleStr.includes("gfg"))
  ) {
    return GFG_CONNECT_BANNER_IMAGE;
  }
  return evt.poster_url || evt.poster_image || "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&q=80&w=800";
}

interface EventItem {
  id: string;
  title: string;
  description: string;
  date: string;
  time?: string;
  location: string;
  poster_url: string;
  poster_image?: string;
  registration_link: string;
  registration_status?: string;
  registration_deadline?: string;
  is_published: boolean;
  category?: string;
  status?: string;
  capacity?: string | number;
  registration_fee?: string;
  team_size?: string;
  prize_pool?: string;
  eligibility?: string;
  organizer_name?: string;
  organizer_email?: string;
  stages?: Array<{ title: string; date: string; desc: string }>;
}

function parseDateString(dateStr?: string): Date | null {
  if (!dateStr || typeof dateStr !== "string") return null;
  const cleanStr = dateStr.trim();
  if (!cleanStr) return null;

  const directDate = new Date(cleanStr);
  if (!isNaN(directDate.getTime())) return directDate;

  const deOrdinal = cleanStr.replace(/(\d+)(st|nd|rd|th)/gi, "$1");
  const rangeMatch = deOrdinal.match(/(\d{1,2})\s*[\u2013\u2014-]\s*\d{1,2}\s+([A-Za-z]+)\s+(\d{4})/);
  if (rangeMatch) {
    const parsedRange = new Date(`${rangeMatch[1]} ${rangeMatch[2]} ${rangeMatch[3]}`);
    if (!isNaN(parsedRange.getTime())) return parsedRange;
  }

  const parsedDeOrdinal = new Date(deOrdinal);
  if (!isNaN(parsedDeOrdinal.getTime())) return parsedDeOrdinal;

  const dmyMatch = cleanStr.match(/^(\d{1,2})[/-](\d{1,2})[/-](\d{4})$/);
  if (dmyMatch) {
    const d = parseInt(dmyMatch[1], 10);
    const m = parseInt(dmyMatch[2], 10) - 1;
    const y = parseInt(dmyMatch[3], 10);
    const dmyDate = new Date(y, m, d);
    if (!isNaN(dmyDate.getTime())) return dmyDate;
  }

  return null;
}

export default function Events() {
  const [searchParams] = useSearchParams();
  const [eventsList, setEventsList] = useState<EventItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [apiError, setApiError] = useState<string | null>(null);
  
  // Detail Modal State
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [selectedDetailEvent, setSelectedDetailEvent] = useState<EventItem | null>(null);
  const [detailLoading, setDetailLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<"about" | "timeline" | "eligibility">("about");

  // Registration Modal State
  const [isRegModalOpen, setIsRegModalOpen] = useState(false);
  const [regEvent, setRegEvent] = useState<EventItem | null>(null);

  // Fetch events from Google Apps Script Web App
  const fetchGasEvents = async () => {
    setLoading(true);
    setApiError(null);
    try {
      const res = await gasApi.getEvents();
      console.log("Events.tsx fetchGasEvents response:", res);
      const rawEvents = res.events || res.data || [];
      if (res.success && Array.isArray(rawEvents) && rawEvents.length > 0) {
        const mapped: EventItem[] = rawEvents.map((e: GasEvent) => ({
          id: e.id,
          title: e.title,
          description: e.description,
          date: e.date,
          time: e.time,
          location: e.location || "Marwadi University, Rajkot",
          poster_url: e.poster_url,
          poster_image: e.poster_image || e.poster_url,
          registration_link: e.registration_link || "",
          registration_status: e.registration_status || "OPEN",
          registration_deadline: e.registration_deadline || "",
          is_published: e.is_published !== false,
          category: e.category || "Hackathon / Tech Workshop",
          status: e.status || "PUBLISHED",
          capacity: e.capacity,
          registration_fee: e.registration_fee || "Free Entry",
          team_size: e.team_size || "1–4 Members",
          prize_pool: e.prize_pool || "Certificates & Merch",
          eligibility: e.eligibility || "All MU & University Students",
          organizer_name: e.organizer_name || "GeeksforGeeks × Marwadi University Chapter",
          organizer_email: e.organizer_email || "gfg@marwadiuniversity.ac.in",
          stages: e.stages || [
            {
              title: "Online Registration",
              date: e.date,
              desc: "Register team details on the chapter portal."
            },
            {
              title: "Campus Activation",
              date: e.date,
              desc: "On-site coding and project evaluation at Marwadi University labs."
            }
          ]
        }));
        setEventsList(mapped);
      } else if (!res.success && res.error) {
        setApiError(res.error);
      }
    } catch (err: any) {
      setApiError(err.message || "Unable to reach Google Apps Script API");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGasEvents();

    const eventIdFromUrl = searchParams.get("id");
    const openRegister = searchParams.get("register") === "true";

    if (eventIdFromUrl) {
      handleOpenEventDetail(eventIdFromUrl);
    }
  }, [searchParams]);

  // Open Event Details Modal
  const handleOpenEventDetail = async (eventId: string, fallback?: EventItem) => {
    if (fallback) {
      setSelectedDetailEvent(fallback);
    } else {
      const match = eventsList.find(e => e.id === eventId);
      if (match) setSelectedDetailEvent(match);
    }
    setIsDetailModalOpen(true);
    setDetailLoading(true);

    try {
      const res = await gasApi.getEvent(eventId);
      if (res.success && res.event) {
        const full = res.event;
        setSelectedDetailEvent(prev => ({
          ...(prev || {}),
          id: full.id,
          title: full.title,
          description: full.description || prev?.description || "",
          date: full.date || prev?.date || "",
          time: full.time || prev?.time,
          location: full.location || prev?.location || "Marwadi University",
          poster_url: full.poster_url || prev?.poster_url || "",
          poster_image: full.poster_image || full.poster_url || prev?.poster_image,
          registration_link: full.registration_link || prev?.registration_link || "",
          registration_status: full.registration_status || prev?.registration_status || "OPEN",
          registration_deadline: full.registration_deadline || prev?.registration_deadline || "",
          is_published: full.is_published !== false,
          category: full.category || prev?.category,
          status: full.status || prev?.status || "PUBLISHED",
          capacity: full.capacity || prev?.capacity,
          registration_fee: full.registration_fee || prev?.registration_fee || "Free",
          team_size: full.team_size || prev?.team_size || "1–4 Members",
          prize_pool: full.prize_pool || prev?.prize_pool || "Exciting Swag & Certificate",
          eligibility: full.eligibility || prev?.eligibility,
          organizer_name: full.organizer_name || prev?.organizer_name || "GFG × MU Chapter",
          organizer_email: full.organizer_email || prev?.organizer_email,
          stages: full.stages || prev?.stages
        }));
      }
    } catch (err) {
      console.warn("Failed to fetch detailed event metadata:", err);
    } finally {
      setDetailLoading(false);
    }
  };

  // Open Quick Registration Modal
  const handleOpenRegistration = (event: EventItem) => {
    setRegEvent(event);
    setIsRegModalOpen(true);
  };

  // Filter valid events
  const validEvents = eventsList
    .filter((e) => {
      const statusUpper = (e.status || "").toUpperCase();
      if (statusUpper !== "PUBLISHED" && statusUpper !== "ACTIVE") return false;

      const regStatusUpper = (e.registration_status || "").toUpperCase();
      if (regStatusUpper !== "OPEN") return false;

      const now = new Date();
      const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0, 0, 0);

      if (e.registration_deadline) {
        const deadlineDate = parseDateString(e.registration_deadline);
        if (deadlineDate) {
          deadlineDate.setHours(23, 59, 59, 999);
          if (now > deadlineDate) return false;
        }
      }

      if (e.date) {
        const eventDate = parseDateString(e.date);
        if (eventDate) {
          eventDate.setHours(23, 59, 59, 999);
          if (eventDate < todayStart) return false;
        }
      }

      return true;
    })
    .sort((a, b) => {
      const timeA = parseDateString(a.date)?.getTime() ?? Infinity;
      const timeB = parseDateString(b.date)?.getTime() ?? Infinity;
      return timeA - timeB;
    });

  return (
    <div className="bg-[#F4F4F0] min-h-screen text-[#111318] select-none">
      
      {/* Background Architectural Grid */}
      <div className="absolute inset-0 bg-technical-grid opacity-50 pointer-events-none" />

      {/* TOP HERO SPECIFICATION */}
      <section className="relative py-16 md:py-24 border-b border-[#E2E2DC] bg-[#F4F4F0]">
        <div className="max-w-[1400px] mx-auto px-6 relative z-10 w-full">
          
          <div className="flex flex-wrap items-center justify-between border-b border-[#E2E2DC] pb-4 mb-10 font-mono text-[10px] uppercase tracking-[0.25em] text-[#8B9198]">
            <div className="flex items-center space-x-2">
              <span className="text-[#00A86B] font-bold">02 / EVENTS REPOSITORY</span>
              <span>·</span>
              <span className="text-[#111318]">LIVE GOOGLE SHEETS API</span>
            </div>

            <div className="flex items-center space-x-3">
              <span className="w-1.5 h-1.5 rounded-full bg-[#00A86B] animate-pulse" />
              <span>SYNCHRONIZED FEED</span>
              <button
                onClick={fetchGasEvents}
                disabled={loading}
                className="px-2.5 py-1 bg-[#FFFFFF] border border-[#E2E2DC] hover:border-[#111318] text-[#111318] transition-colors cursor-pointer flex items-center space-x-1"
              >
                <RefreshCw className={`w-3 h-3 ${loading ? "animate-spin text-[#00A86B]" : ""}`} />
                <span>SYNC</span>
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-end">
            <div className="lg:col-span-8 space-y-4">
              <h1 className="font-editorial text-4xl sm:text-6xl lg:text-7xl font-black text-[#111318] tracking-tight leading-[0.98]">
                Chapter Events & <br />
                <span className="font-editorial-italic font-normal text-[#00A86B]">
                  Technical Sprints
                </span>
              </h1>
              <p className="font-sans text-sm sm:text-base text-[#555B63] max-w-2xl leading-relaxed border-l-2 border-[#111318] pl-4">
                Explore official GeeksforGeeks hackathons, algorithm marathons, masterclasses, and coding competitions 
                hosted live across Marwadi University campus venues.
              </p>
            </div>

            <div className="lg:col-span-4 font-mono text-[11px] space-y-2 bg-[#FFFFFF] border border-[#E2E2DC] p-5 shadow-sm">
              <div className="flex justify-between border-b border-[#E2E2DC] pb-2 text-[#8B9198]">
                <span>DATABASE STATUS</span>
                <span className="text-[#00A86B] font-bold">LIVE ONLINE</span>
              </div>
              <div className="flex justify-between border-b border-[#E2E2DC] pb-2 text-[#8B9198]">
                <span>ACTIVE CALENDAR</span>
                <span className="text-[#111318] font-bold">{validEvents.length} Events Listed</span>
              </div>
              <div className="flex justify-between text-[#8B9198]">
                <span>LOCATION</span>
                <span className="text-[#111318]">Rajkot, Gujarat</span>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* CHAPTER EVENTS FEED */}
      <section className="py-16 md:py-24 border-b border-[#E2E2DC] bg-[#FAF9F5]">
        <div className="max-w-[1400px] mx-auto px-6 relative z-10 w-full">
          
          <div className="flex items-center justify-between pb-4 mb-10 border-b border-[#E2E2DC]">
            <div className="font-mono text-xs uppercase tracking-widest text-[#111318] font-bold">
              OPEN REGISTRATIONS
            </div>
            <div className="font-mono text-xs text-[#8B9198]">
              SORTED BY NEAREST UPCOMING DATE
            </div>
          </div>

          {/* LOADING STATE */}
          {loading && (
            <div className="p-16 bg-[#FFFFFF] border border-[#E2E2DC] text-center space-y-4">
              <div className="font-mono text-xs uppercase tracking-widest text-[#8B9198] animate-pulse">
                PARSING APPS SCRIPT RECORDS...
              </div>
            </div>
          )}

          {/* ERROR STATE */}
          {!loading && apiError && (
            <div className="p-8 bg-[#FFFFFF] border border-[#E2E2DC] text-center space-y-3 max-w-lg mx-auto">
              <AlertTriangle className="w-8 h-8 text-amber-600 mx-auto" />
              <div className="font-editorial text-lg text-[#111318]">Backend Synchronizing</div>
              <p className="font-mono text-xs text-[#555B63]">{apiError}</p>
              <button
                onClick={fetchGasEvents}
                className="px-5 py-2.5 bg-[#111318] text-[#F4F4F0] font-mono text-xs uppercase tracking-widest hover:bg-[#00A86B] transition-colors"
              >
                Retry
              </button>
            </div>
          )}

          {/* EVENTS GRID */}
          {!loading && !apiError && validEvents.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {validEvents.map((evt, idx) => (
                <div
                  key={evt.id}
                  className="bg-[#FFFFFF] border border-[#E2E2DC] flex flex-col justify-between hover:border-[#111318] transition-colors group shadow-[0_4px_20px_rgba(17,19,24,0.03)]"
                >
                  <div>
                    {/* Visual Area */}
                    <div className="relative border-b border-[#E2E2DC] bg-[#FAF9F5]">
                      <EditorialImage
                        src={getEventCardImage(evt)}
                        alt={evt.title}
                        variant="poster"
                        figLabel={evt.category || "TECH EVENT"}
                        figNumber={`FIG.${evt.id || "EVT"}`}
                        caption={`${evt.location?.split(",")[0] || "MARWADI UNIVERSITY"}`}
                        aspectClassName="aspect-[4/3]"
                      />
                    </div>

                    {/* Metadata Header */}
                    <div className="p-6 pb-2 space-y-4">
                      <div className="flex items-center justify-between font-mono text-[10px] text-[#8B9198] border-b border-[#E2E2DC] pb-3">
                        <span className="flex items-center gap-1.5 text-[#111318] font-bold">
                          <Calendar className="w-3.5 h-3.5 text-[#00A86B]" />
                          {evt.date}
                        </span>
                        <span>{evt.id}</span>
                      </div>

                      <h3 className="font-editorial text-2xl font-bold text-[#111318] tracking-tight group-hover:text-[#00A86B] transition-colors leading-snug">
                        {evt.title}
                      </h3>

                      <p className="font-sans text-xs text-[#555B63] leading-relaxed line-clamp-3">
                        {evt.description || "Join fellow developers at Marwadi University for hands-on problem solving and project building."}
                      </p>

                      <div className="pt-2 flex items-center gap-2 font-mono text-[10px] text-[#8B9198] truncate">
                        <MapPin className="w-3.5 h-3.5 text-[#00A86B] shrink-0" />
                        <span className="truncate">{evt.location}</span>
                      </div>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="p-6 pt-4 border-t border-[#E2E2DC] flex items-center gap-3">
                    <button
                      onClick={() => handleOpenEventDetail(evt.id, evt)}
                      className="flex-1 py-3 px-4 bg-transparent hover:bg-[#F4F4F0] border border-[#E2E2DC] hover:border-[#111318] text-[#111318] font-mono text-xs uppercase tracking-widest transition-colors text-center cursor-pointer"
                    >
                      Specifications
                    </button>

                    <button
                      onClick={() => handleOpenRegistration(evt)}
                      className="flex-1 py-3 px-4 bg-[#111318] hover:bg-[#00A86B] text-[#F4F4F0] font-mono text-xs uppercase tracking-widest transition-colors text-center flex items-center justify-center gap-1 cursor-pointer"
                    >
                      <span>Register</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>

                </div>
              ))}
            </div>
          )}

          {/* EMPTY STATE */}
          {!loading && !apiError && validEvents.length === 0 && (
            <div className="p-16 bg-[#FFFFFF] border border-[#E2E2DC] text-center space-y-3 max-w-xl mx-auto">
              <Sparkles className="w-8 h-8 text-[#00A86B] mx-auto opacity-75" />
              <h3 className="font-editorial text-2xl text-[#111318]">No Active Upcoming Events</h3>
              <p className="font-sans text-xs text-[#555B63]">
                There are currently no open event registrations published on Google Sheets. Please check back shortly or click the Sync button above.
              </p>
            </div>
          )}

        </div>
      </section>

      {/* 03 / CHAPTER ARCHIVE: WHAT WE'VE BUILT */}
      <ChapterArchive />

      {/* DETAIL MODAL (EDITORIAL DESIGN) */}
      <AnimatePresence>
        {isDetailModalOpen && selectedDetailEvent && (
          <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4 sm:p-6 select-none">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsDetailModalOpen(false)}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm"
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.98, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.98, y: 15 }}
              className="relative w-full max-w-4xl bg-[#FFFFFF] border border-[#111318] shadow-2xl z-10 overflow-hidden my-8"
            >
              {/* Header Bar */}
              <div className="flex items-center justify-between px-6 py-4 border-b border-[#E2E2DC] bg-[#FAF9F5] font-mono text-[10px] uppercase tracking-widest">
                <span className="font-bold text-[#111318]">EVENT SPECIFICATION SHEET</span>
                <button
                  onClick={() => setIsDetailModalOpen(false)}
                  className="p-1 hover:bg-[#E2E2DC] transition-colors cursor-pointer"
                >
                  <X className="w-4 h-4 text-[#111318]" />
                </button>
              </div>

              {/* Body */}
              <div className="p-6 sm:p-10 max-h-[80vh] overflow-y-auto space-y-8">
                
                <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
                  {/* Visual */}
                  <div className="md:col-span-5 space-y-4">
                    <EditorialImage
                      src={getEventCardImage(selectedDetailEvent)}
                      alt={selectedDetailEvent.title}
                      variant="poster"
                      figLabel={selectedDetailEvent.category || "TECH EVENT"}
                      figNumber={`FIG.${selectedDetailEvent.id || "EVT"}`}
                      caption={`${selectedDetailEvent.location?.split(",")[0] || "MARWADI UNIVERSITY"}`}
                      aspectClassName="aspect-[4/3]"
                    />

                    <div className="p-4 bg-[#FAF9F5] border border-[#E2E2DC] font-mono text-[10px] space-y-2">
                      <div className="flex justify-between border-b border-[#E2E2DC] pb-1 text-[#8B9198]">
                        <span>EVENT REF</span>
                        <span className="text-[#111318] font-bold">{selectedDetailEvent.id}</span>
                      </div>
                      <div className="flex justify-between border-b border-[#E2E2DC] pb-1 text-[#8B9198]">
                        <span>ORGANIZER</span>
                        <span className="text-[#111318]">{selectedDetailEvent.organizer_name}</span>
                      </div>
                      <div className="flex justify-between text-[#8B9198]">
                        <span>FEE</span>
                        <span className="text-[#00A86B] font-bold">{selectedDetailEvent.registration_fee}</span>
                      </div>
                    </div>
                  </div>

                  {/* Info */}
                  <div className="md:col-span-7 space-y-6">
                    <div>
                      <div className="font-mono text-[10px] uppercase tracking-widest text-[#00A86B] mb-2 font-bold">
                        ● {selectedDetailEvent.category}
                      </div>
                      <h2 className="font-editorial text-3xl font-black text-[#111318] tracking-tight leading-tight">
                        {selectedDetailEvent.title}
                      </h2>
                      <div className="flex flex-wrap gap-4 font-mono text-xs text-[#8B9198] mt-3">
                        <span className="flex items-center gap-1 text-[#111318]">
                          <Calendar className="w-3.5 h-3.5 text-[#00A86B]" /> {selectedDetailEvent.date}
                        </span>
                        {selectedDetailEvent.time && (
                          <span className="flex items-center gap-1">
                            <Clock className="w-3.5 h-3.5 text-[#00A86B]" /> {selectedDetailEvent.time}
                          </span>
                        )}
                        <span className="flex items-center gap-1">
                          <MapPin className="w-3.5 h-3.5 text-[#00A86B]" /> {selectedDetailEvent.location}
                        </span>
                      </div>
                    </div>

                    {/* Tabs */}
                    <div className="flex border-b border-[#E2E2DC] font-mono text-xs uppercase tracking-wider">
                      {["about", "timeline", "eligibility"].map((tab) => (
                        <button
                          key={tab}
                          onClick={() => setActiveTab(tab as any)}
                          className={`py-2 px-4 border-b-2 transition-colors cursor-pointer ${
                            activeTab === tab
                              ? "border-[#111318] text-[#111318] font-bold"
                              : "border-transparent text-[#8B9198] hover:text-[#111318]"
                          }`}
                        >
                          {tab}
                        </button>
                      ))}
                    </div>

                    {/* Tab Content */}
                    <div className="min-h-[160px]">
                      {activeTab === "about" && (
                        <div className="space-y-4">
                          <p className="font-sans text-xs sm:text-sm text-[#555B63] leading-relaxed whitespace-pre-line">
                            {selectedDetailEvent.description}
                          </p>
                          <div className="grid grid-cols-2 gap-3 pt-2 font-mono text-xs">
                            <div className="p-3 bg-[#FAF9F5] border border-[#E2E2DC]">
                              <span className="text-[9px] text-[#8B9198] block uppercase">PRIZE POOL</span>
                              <span className="font-bold text-[#00A86B]">{selectedDetailEvent.prize_pool || "Official Certificates"}</span>
                            </div>
                            <div className="p-3 bg-[#FAF9F5] border border-[#E2E2DC]">
                              <span className="text-[9px] text-[#8B9198] block uppercase">TEAM SIZE</span>
                              <span className="font-bold text-[#111318]">{selectedDetailEvent.team_size || "1–4 Members"}</span>
                            </div>
                          </div>
                        </div>
                      )}

                      {activeTab === "timeline" && (
                        <div className="space-y-4 border-l border-[#E2E2DC] pl-4">
                          {(selectedDetailEvent.stages || []).map((stage, idx) => (
                            <div key={idx} className="space-y-1">
                              <div className="font-mono text-[10px] text-[#00A86B] font-bold">
                                PHASE {idx + 1} // {stage.title} · {stage.date}
                              </div>
                              <p className="font-sans text-xs text-[#555B63]">{stage.desc}</p>
                            </div>
                          ))}
                        </div>
                      )}

                      {activeTab === "eligibility" && (
                        <div className="space-y-3 font-sans text-xs text-[#555B63]">
                          <p>{selectedDetailEvent.eligibility || "Open to all students enrolled across universities."}</p>
                          <div className="grid grid-cols-2 gap-2 font-mono text-[10px]">
                            {["Undergraduate Students", "Engineering Disciplines", "Postgraduate Students", "All Colleges Across India"].map(item => (
                              <div key={item} className="p-2.5 bg-[#FAF9F5] border border-[#E2E2DC] flex items-center gap-1.5">
                                <CheckCircle className="w-3.5 h-3.5 text-[#00A86B]" />
                                <span>{item}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Actions */}
                    <div className="pt-4 border-t border-[#E2E2DC] flex items-center gap-3">
                      <button
                        onClick={() => {
                          setIsDetailModalOpen(false);
                          handleOpenRegistration(selectedDetailEvent);
                        }}
                        className="flex-1 py-4 bg-[#111318] hover:bg-[#00A86B] text-[#F4F4F0] font-mono text-xs uppercase tracking-widest transition-colors cursor-pointer"
                      >
                        [ REGISTER FOR EVENT → ]
                      </button>

                      {selectedDetailEvent.registration_link && (
                        <a
                          href={selectedDetailEvent.registration_link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="py-4 px-6 bg-transparent hover:bg-[#FAF9F5] border border-[#111318] text-[#111318] font-mono text-xs uppercase tracking-widest transition-colors flex items-center gap-1"
                        >
                          <span>External Portal</span>
                          <ExternalLink className="w-3.5 h-3.5" />
                        </a>
                      )}
                    </div>

                  </div>
                </div>

              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* QUICK REGISTRATION MODAL (EDITORIAL DESIGN) */}
      <EventRegistrationModal
        isOpen={isRegModalOpen}
        onClose={() => setIsRegModalOpen(false)}
        event={regEvent}
      />

    </div>
  );
}
