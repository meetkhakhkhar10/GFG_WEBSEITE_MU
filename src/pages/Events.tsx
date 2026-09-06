import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { useSearchParams } from "react-router-dom";
import { 
  ArrowRight, Flame, Trophy, Terminal, Award, Cpu, 
  Calendar, MapPin, Users, Coins, Users2, Building2, 
  Layers, CheckCircle, Clock, Info, X, MapPinned, Play,
  Loader2, Copy, Check, AlertTriangle, RefreshCw, Send, CheckCircle2,
  Sparkles, ShieldCheck
} from "lucide-react";
import { subscribeToEvents } from "../utils/eventHelpers";
import { gasApi, GasEvent, RegistrationPayload, RegistrationResult } from "../services/gasApi";

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
  qr_code_data?: string;
  is_published: boolean;
  approvedBySuperAdmin?: boolean;
  is_featured?: boolean;
  category?: string;
  status?: string;
  capacity?: string | number;
  registration_fee?: string;
  team_size?: string;
  prize_pool?: string;
  eligibility?: string;
  expected_participation?: string;
  expected_colleges?: string;
  organizer_name?: string;
  organizer_email?: string;
  stages?: Array<{ title: string; date: string; desc: string }>;
}

const INTELLIFY_REGISTRATION_URL = "https://unstop.com/hackathons/intellify-40-marwadi-university-mu-gujarat-1684922";

export default function Events() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [eventsList, setEventsList] = useState<EventItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [apiError, setApiError] = useState<string | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [selectedDetailEvent, setSelectedDetailEvent] = useState<EventItem | null>(null);
  const [detailLoading, setDetailLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<"about" | "timeline" | "eligibility">("about");

  // Registration Modal State
  const [isRegModalOpen, setIsRegModalOpen] = useState(false);
  const [regEvent, setRegEvent] = useState<EventItem | null>(null);
  const [regSubmitting, setRegSubmitting] = useState(false);
  const [regError, setRegError] = useState<string | null>(null);
  const [regSuccessData, setRegSuccessData] = useState<RegistrationResult | null>(null);
  const [copiedRegId, setCopiedRegId] = useState(false);
  const [regForm, setRegForm] = useState<Omit<RegistrationPayload, "event_id">>({
    name: "",
    email: "",
    phone: "",
    enrollment_number: "",
    department: "Computer Science & Engineering",
    year: "3",
    college: "Marwadi University",
  });

  // Local fallback events exactly matching design requirement in case Firestore is not active
  const codejamEvents = [
    {
      sem: "Semester 2",
      tag: "Beginner Friendly",
      round: "Round 1",
      desc: "Kickstart your competitive coding journey. Built for first-year programmers ready to make their mark.",
      link: "https://practice.geeksforgeeks.org/contest/ict-codejam-semester-2-round-1",
      icon: Terminal,
      color: "from-emerald-500/10 via-emerald-500/5 to-transparent",
      accent: "text-emerald-400 border-emerald-500/20 bg-emerald-500/5",
    },
    {
      sem: "Semester 4",
      tag: "Intermediate",
      round: "Round 1",
      desc: "Level up with advanced data structures and algorithms. Challenge yourself against the best in your batch.",
      link: "https://practice.geeksforgeeks.org/contest/ict-codejam-semester-4-round-1-4819",
      icon: Cpu,
      color: "from-gfg-primary/10 via-gfg-primary/5 to-transparent",
      accent: "text-[#00ff88] border-[#00ff88]/20 bg-[#00ff88]/5",
      hot: true,
    },
    {
      sem: "Semester 6",
      tag: "Advanced",
      round: "Round 1",
      desc: "The elite arena. Solve complex challenges and compete for the top position among senior coders.",
      link: "https://practice.geeksforgeeks.org/contest/ict-codejam-semester-6-round-1",
      icon: Trophy,
      color: "from-cyan-500/10 via-cyan-500/5 to-transparent",
      accent: "text-cyan-400 border-cyan-500/20 bg-cyan-500/5",
    },
  ];

  // Fetch events from Google Apps Script Web App
  const fetchGasEvents = async () => {
    setLoading(true);
    setApiError(null);
    try {
      const res = await gasApi.getEvents();
      if (res.success && res.events) {
        const mapped: EventItem[] = res.events.map((e: GasEvent) => ({
          id: e.id,
          title: e.title,
          description: e.description,
          date: e.date,
          time: e.time,
          location: e.location,
          poster_url: e.poster_url,
          poster_image: e.poster_image || e.poster_url,
          registration_link: e.registration_link || INTELLIFY_REGISTRATION_URL,
          is_published: e.is_published !== false,
          approvedBySuperAdmin: true,
          is_featured: e.is_featured,
          category: e.category || "Hackathon / Workshop",
          status: e.status || "Upcoming",
          capacity: e.capacity,
          registration_fee: e.registration_fee || "Free",
          team_size: e.team_size || "1–4 Members",
          prize_pool: e.prize_pool || "Exciting Certificates & Swag",
          eligibility: e.eligibility || "All MU & External College Students",
          expected_participation: e.expected_participation,
          expected_colleges: e.expected_colleges,
          organizer_name: e.organizer_name || "GFG × Marwadi University Chapter",
          organizer_email: e.organizer_email || "gfg@marwadiuniversity.ac.in",
          stages: e.stages || [
            {
              title: "Registration & Abstract",
              date: e.date,
              desc: "Register team details and participate in the official chapter events."
            }
          ]
        }));
        if (mapped.length > 0) {
          setEventsList(mapped);
        }
      } else if (!res.success && res.error) {
        console.warn("GAS sync notice:", res.error);
      }
    } catch (err: any) {
      console.warn("GAS Events load failed, checking fallback:", err);
      setApiError(err.message || "Unable to reach Google Apps Script API");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGasEvents();

    // Check if URL specifies an event ID: ?id=... or ?action=event&id=...
    const eventIdFromUrl = searchParams.get("id");
    if (eventIdFromUrl) {
      handleOpenEventDetail(eventIdFromUrl);
    }

    // Dynamic database subscription for realtime fallback/compatibility
    const unsub = subscribeToEvents((list) => {
      if (list && list.length > 0) {
        setEventsList(prev => {
          if (prev.length === 0) {
            return list.map((e: any) => ({
              id: e.id,
              title: e.title,
              description: e.description,
              date: e.date || e.startDate,
              location: e.location || e.venue,
              poster_url: e.poster_url || e.bannerImage,
              poster_image: e.poster_image || e.poster_url || e.bannerImage,
              registration_link: (e.id === "evt_intellify" || e.title?.includes("Intellify")) ? INTELLIFY_REGISTRATION_URL : (e.registration_link || e.registrationLink || ""),
              is_published: e.is_published !== false,
              approvedBySuperAdmin: e.approvedBySuperAdmin !== false,
              is_featured: e.is_featured || e.featured || false,
              category: e.category,
              status: e.status,
              capacity: e.capacity,
              registration_fee: e.registration_fee || "₹250",
              team_size: e.team_size || "2–4 Members",
              prize_pool: e.prize_pool || "₹3,40,000+",
              eligibility: e.eligibility || "Engineering Students, Undergraduate Students, Postgraduate Students, Management Students, Medical Students, Law Students, Arts, Commerce, Science & Other Streams",
              expected_participation: e.expected_participation || "600+ Students",
              expected_colleges: e.expected_colleges || "150+ Colleges Across India",
              organizer_name: e.organizer_name || e.organizer || "MU × GFG Student Chapter",
              stages: e.stages
            }));
          }
          return prev;
        });
      }
    });
    return () => unsub();
  }, [searchParams]);

  // Fetch single event by ID (GET ?action=event&id=EVENT_ID)
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
        const e = res.event;
        setSelectedDetailEvent({
          id: e.id,
          title: e.title,
          description: e.description,
          date: e.date,
          time: e.time,
          location: e.location,
          poster_url: e.poster_url,
          poster_image: e.poster_image || e.poster_url,
          registration_link: e.registration_link || INTELLIFY_REGISTRATION_URL,
          is_published: e.is_published !== false,
          approvedBySuperAdmin: true,
          is_featured: e.is_featured,
          category: e.category || "Hackathon / Workshop",
          status: e.status || "Upcoming",
          capacity: e.capacity,
          registration_fee: e.registration_fee || "Free",
          team_size: e.team_size || "1–4 Members",
          prize_pool: e.prize_pool || "Exciting Swag & Certificate",
          eligibility: e.eligibility || "All College Students",
          expected_participation: e.expected_participation,
          expected_colleges: e.expected_colleges,
          organizer_name: e.organizer_name || "GFG × Marwadi University Chapter",
          organizer_email: e.organizer_email,
          stages: e.stages
        });
      }
    } catch (err) {
      console.warn("Error fetching single event:", err);
    } finally {
      setDetailLoading(false);
    }
  };

  // Open Registration Modal
  const handleOpenRegistration = (event: EventItem) => {
    setRegEvent(event);
    setRegError(null);
    setRegSuccessData(null);
    setCopiedRegId(false);
    setIsRegModalOpen(true);
  };

  // Submit Registration via POST action=register
  const handleRegistrationSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!regEvent) return;

    setRegSubmitting(true);
    setRegError(null);
    setRegSuccessData(null);

    const payload: RegistrationPayload = {
      event_id: regEvent.id,
      name: regForm.name.trim(),
      email: regForm.email.trim(),
      phone: regForm.phone.trim(),
      enrollment_number: regForm.enrollment_number.trim(),
      department: regForm.department.trim(),
      year: regForm.year.trim(),
      college: regForm.college.trim(),
    };

    try {
      const res = await gasApi.registerForEvent(payload);
      if (res.success) {
        setRegSuccessData(res);
      } else {
        setRegError(res.error || "Registration request rejected by backend.");
      }
    } catch (err: any) {
      setRegError(err.message || "Failed to send registration payload to Google Apps Script.");
    } finally {
      setRegSubmitting(false);
    }
  };

  // Find Intellify Event or Fallback to pre-populated schema
  const intellifyEvent: EventItem = eventsList.find(e => e.id === "evt_intellify" || e.title.includes("Intellify")) || {
    id: "evt_intellify",
    title: "Intellify 4.0",
    description: "Intellify 4.0 is the flagship national-level hackathon organized at Marwadi University on 15th–16th August 2026. Building upon the success of previous editions, Intellify has evolved into a platform that promotes innovation, collaboration, creativity, and technical excellence among students across India.\n\nThe hackathon provides participants with an opportunity to solve real-world challenges through technology in a highly competitive environment. With participation expected from 600+ students representing 150+ colleges nationwide, Intellify 4.0 aims to create impactful solutions while fostering networking, learning, and innovation.",
    date: "15th–16th August 2026",
    location: "Marwadi University, Rajkot, Gujarat, India",
    poster_url: "https://d8it4huxumps7.cloudfront.net/uploads/images/opportunity/banner/6a1ebf444ee51_intellify-40.jpg?d=1920x557",
    poster_image: "https://media.licdn.com/dms/image/v2/D5622AQGX5GCF2vVchg/feedshare-shrink_480/B56Z6MtjFwI8Ag-/0/1780477211277?e=1782345600&v=beta&t=3KyigAHwI12hZAxOfpnKapHcCJl4Gi4kYyR5L0UIqeM",
    registration_link: INTELLIFY_REGISTRATION_URL,
    is_published: true,
    is_featured: true,
    category: "Hackathon / Software Development",
    status: "Upcoming",
    capacity: "600",
    registration_fee: "₹250",
    team_size: "2–4 Members",
    prize_pool: "₹3,40,000+",
    eligibility: "Engineering Students, Undergraduate Students, Postgraduate Students, Management Students, Medical Students, Law Students, Arts, Commerce, Science & Other Streams",
    expected_participation: "600+ Students",
    expected_colleges: "150+ Colleges Across India",
    organizer_name: "Marwadi University × GeeksforGeeks Student Chapter",
    stages: [
      {
        title: "Abstract Submission",
        date: "16 June 2026 – 30 June 2026",
        desc: "Teams must submit an abstract describing: Problem Statement, Proposed Solution, Innovation & Uniqueness, Expected Impact, Feasibility, Technologies Used"
      },
      {
        title: "Concept Demonstration",
        date: "05 July 2026 – 25 July 2026",
        desc: "Shortlisted teams must submit a video presentation covering: Problem Understanding, Solution Approach, Algorithm Flow, System Architecture, Technical Workflow, Team Introduction"
      },
      {
        title: "Grand Finale",
        date: "15 August 2026 – 16 August 2026",
        desc: "Finalists will develop and present a working prototype, project demonstration, and presentation before the evaluation panel at Marwadi University."
      }
    ]
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="py-24 bg-theme-bg min-h-screen text-theme-text theme-transition overflow-hidden relative"
    >
      {/* Absolute Ambient Cyberpunk Glow */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-gfg-primary/5 via-[#0c141d]/0 to-transparent pointer-events-none" />
      <div className="absolute top-20 left-1/4 w-[400px] h-[400px] bg-gfg-primary/2 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-40 right-1/4 w-[500px] h-[500px] bg-[#00ff88]/2 rounded-full blur-[160px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 relative z-10 space-y-24">

        {/* 1. FEATURED HACKATHON ZONE - INTELLIFY 4.0 */}
        <section className="relative w-full max-w-6xl mx-auto">
          {/* Header Tagline & Official Badges */}
          <div className="flex flex-wrap items-center gap-2.5 mb-6">
            <span className="inline-flex items-center space-x-1.5 px-3 py-1 bg-emerald-500/10 border border-emerald-500/20 rounded-full text-[10px] font-bold text-[#00ff88]">
              <span className="w-1.5 h-1.5 bg-[#00ff88] rounded-full animate-ping" />
              <span>Registration Open</span>
            </span>
            <span className="inline-flex items-center space-x-1.5 px-3 py-1 bg-cyan-500/10 border border-cyan-500/20 rounded-full text-[10px] font-bold text-cyan-400">
              <Award className="w-3.5 h-3.5 text-cyan-400" />
              <span>National Level Hackathon</span>
            </span>
            <span className="inline-flex items-center space-x-1.5 px-3 py-1 bg-purple-500/10 border border-purple-500/20 rounded-full text-[10px] font-bold text-purple-400">
              <Building2 className="w-3.5 h-3.5 text-purple-400" />
              <span>Powered by Marwadi University</span>
            </span>
            <span className="inline-flex items-center space-x-1.5 px-3 py-1 bg-[#00ff88]/10 border border-[#00ff88]/20 rounded-full text-[10px] font-bold text-[#00ff88]">
              <Flame className="w-3.5 h-3.5 text-[#00ff88] animate-pulse" />
              <span>GeeksforGeeks Collaboration</span>
            </span>
          </div>

          <div className="group relative rounded-[2.5rem] bg-theme-bg-secondary/40 backdrop-blur-2xl border border-theme-border/80 overflow-hidden shadow-2xl transition-all duration-500 hover:border-[#00ff88]/30">
            {/* Ambient Line */}
            <div className="absolute top-0 left-0 w-full h-[4px] bg-gradient-to-r from-[#00ff88] via-[#00E676] to-transparent" />
            
            {/* Diagonal Grid Accents */}
            <div className="absolute inset-0 bg-[linear-gradient(rgba(0,255,136,0.015)_1px,transparent_1px)] bg-[size:30px_30px] pointer-events-none opacity-60" />

            {/* Split Banner & Content */}
            <div className="flex flex-col lg:flex-row items-stretch">
              {/* Left Side: Visual Banner Banner (Clickable to view stages) */}
              <div 
                onClick={() => {
                  setIsDetailModalOpen(true);
                  setActiveTab("timeline");
                }}
                className="lg:w-[45%] relative min-h-[260px] lg:min-h-auto overflow-hidden cursor-pointer group/poster"
                title="Click to view local timeline & stages"
              >
                <img 
                  src={intellifyEvent.poster_url} 
                  alt="Intellify Header" 
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 group-hover/poster:brightness-[0.85]"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t lg:bg-gradient-to-r from-black/80 via-black/40 to-transparent" />
                
                {/* Floating Meta */}
                <div className="absolute top-6 left-6 z-10 px-4 py-2 bg-black/70 backdrop-blur-md rounded-2xl border border-white/10 flex items-center space-x-2">
                  <span className="w-2 h-2 rounded-full bg-[#00ff88] animate-ping" />
                  <span className="text-[10px] font-mono font-black text-white uppercase tracking-widest">9 Days Left</span>
                </div>

                <div className="absolute bottom-8 left-8 z-10 space-y-1.5 max-w-sm hidden sm:block">
                  <p className="text-[10px] font-mono font-bold tracking-widest text-[#00ff88]/80 uppercase">Joint Collaboration</p>
                  <p className="text-xl font-black text-white uppercase italic tracking-tight">Marwadi University × GeeksforGeeks</p>
                  <p className="text-[9px] font-mono font-bold text-zinc-400 mt-2 uppercase tracking-wider group-hover/poster:text-[#00ff88] transition-colors">
                    ⚡ Click picture to view stages & timeline modal
                  </p>
                </div>
              </div>

              {/* Right Side: Detailed Stats Description */}
              <div className="lg:w-[55%] p-8 sm:p-12 flex flex-col justify-between relative z-10 bg-theme-bg-secondary/20">
                <div className="space-y-6">
                  {/* Title Info */}
                  <div>
                    <div className="flex items-center space-x-3 mb-2 text-xs font-mono font-bold tracking-wider text-theme-text-secondary">
                      <span className="text-[#00ff88]">{intellifyEvent.category}</span>
                      <span>•</span>
                      <span className="flex items-center"><MapPin className="w-3.5 h-3.5 mr-1" /> Rajkot, Gujarat</span>
                    </div>

                    <h2 className="text-4xl sm:text-5xl font-black italic uppercase tracking-tighter text-theme-text leading-none mb-4 group-hover:text-[#00ff88] transition-colors">
                      {intellifyEvent.title}
                    </h2>

                    <p className="text-theme-text-secondary text-sm leading-relaxed font-semibold line-clamp-3">
                      {intellifyEvent.description}
                    </p>
                  </div>

                  {/* Core Highlights Blocks GRID featuring all required details */}
                  <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-5 gap-3 pt-4 border-t border-theme-border/40 text-left">
                    <div className="bg-black/30 border border-theme-border/50 p-3 rounded-2xl">
                      <div className="text-[8px] font-mono font-black text-[#00ff88]/60 uppercase tracking-wider mb-1">Registration Fee</div>
                      <div className="text-sm font-black text-white">₹250</div>
                    </div>
                    <div className="bg-black/30 border border-theme-border/50 p-3 rounded-2xl">
                      <div className="text-[8px] font-mono font-black text-[#00ff88]/60 uppercase tracking-wider mb-1">Team Size</div>
                      <div className="text-sm font-black text-white">2–4 Members</div>
                    </div>
                    <div className="bg-black/30 border border-theme-border/50 p-3 rounded-2xl">
                      <div className="text-[8px] font-mono font-black text-[#00ff88]/60 uppercase tracking-wider mb-1">Prize Pool</div>
                      <div className="text-sm font-black text-white">₹3,40,000+</div>
                    </div>
                    <div className="bg-black/30 border border-theme-border/50 p-3 rounded-2xl">
                      <div className="text-[8px] font-mono font-black text-[#00ff88]/60 uppercase tracking-wider mb-1">Participation</div>
                      <div className="text-sm font-black text-white">600+ Students</div>
                    </div>
                    <div className="bg-black/30 border border-theme-border/50 p-3 rounded-2xl col-span-2 md:col-span-1">
                      <div className="text-[8px] font-mono font-black text-[#00ff88]/60 uppercase tracking-wider mb-1">Colleges</div>
                      <div className="text-sm font-black text-white">150+ Nationwide</div>
                    </div>
                  </div>
                </div>

                {/* Event CTAs */}
                <div className="flex flex-col sm:flex-row items-center gap-3 mt-8 pt-6 border-t border-theme-border/40">
                  <button
                    onClick={() => handleOpenRegistration(intellifyEvent)}
                    className="w-full sm:w-auto inline-flex items-center justify-center px-8 py-4 bg-[#00ff88] text-black font-black uppercase text-xs tracking-widest rounded-2xl hover:bg-white hover:shadow-[0_0_25px_rgba(0,255,136,0.25)] transition-all duration-300"
                    id="intellify-quick-register-btn"
                  >
                    <Sparkles className="w-4 h-4 mr-2" />
                    <span>Quick Register</span>
                  </button>

                  <a
                    href={INTELLIFY_REGISTRATION_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full sm:w-auto inline-flex items-center justify-center px-8 py-4 bg-white/5 border border-theme-border hover:bg-white/10 hover:border-white/25 text-theme-text font-black uppercase text-xs tracking-widest rounded-2xl transition-all"
                  >
                    <span>Unstop Portal</span>
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </a>

                  <button
                    onClick={() => handleOpenEventDetail(intellifyEvent.id, intellifyEvent)}
                    className="w-full sm:w-auto inline-flex items-center justify-center px-8 py-4 bg-white/5 border border-theme-border hover:bg-white/10 hover:border-white/25 text-theme-text font-black uppercase text-xs tracking-widest rounded-2xl transition-all"
                    id="intellify-details-btn"
                  >
                    <Info className="w-4 h-4 mr-2" />
                    <span>View Event Details</span>
                  </button>
                </div>

              </div>
            </div>
          </div>
        </section>

        {/* 1.5 PUBLISHED CHAPTER EVENTS (LIVE FROM GOOGLE APPS SCRIPT) */}
        <section className="relative w-full max-w-6xl mx-auto" id="chapter-events-feed">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8 border-b border-theme-border/60 pb-6">
            <div>
              <div className="inline-flex items-center space-x-2 px-3 py-1 bg-[#00ff88]/10 border border-[#00ff88]/25 rounded-full text-[10px] font-mono font-bold text-[#00ff88] uppercase tracking-wider mb-2">
                <span className="w-1.5 h-1.5 bg-[#00ff88] rounded-full animate-ping" />
                <span>Google Apps Script Sync</span>
              </div>
              <h2 className="text-3xl sm:text-4xl font-black uppercase tracking-tight text-white italic">
                Chapter <span className="text-[#00ff88]">Events</span>
              </h2>
              <p className="text-theme-text-secondary text-xs sm:text-sm font-semibold mt-1">
                Active events published and synchronized directly from the chapter Google Sheet database.
              </p>
            </div>
            
            <button
              onClick={fetchGasEvents}
              disabled={loading}
              className="inline-flex items-center space-x-2 px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/10 text-white rounded-xl text-xs font-mono font-bold transition-all disabled:opacity-50"
              title="Sync with Google Apps Script"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${loading ? "animate-spin text-[#00ff88]" : ""}`} />
              <span>{loading ? "Syncing..." : "Refresh Feed"}</span>
            </button>
          </div>

          {/* Loading State */}
          {loading && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 py-6">
              {[1, 2, 3].map((n) => (
                <div key={n} className="p-6 rounded-[2rem] bg-theme-bg-secondary/40 border border-theme-border animate-pulse space-y-4">
                  <div className="h-44 bg-white/5 rounded-2xl" />
                  <div className="h-4 bg-white/10 rounded w-1/3" />
                  <div className="h-6 bg-white/15 rounded w-3/4" />
                  <div className="h-3 bg-white/5 rounded w-full" />
                  <div className="h-10 bg-white/10 rounded-xl mt-4" />
                </div>
              ))}
            </div>
          )}

          {/* Error State */}
          {!loading && apiError && (
            <div className="p-6 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-300 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center space-x-3">
                <AlertTriangle className="w-6 h-6 text-rose-400 shrink-0" />
                <div>
                  <p className="text-xs font-bold uppercase tracking-wider font-mono">Backend Synchronization Notice</p>
                  <p className="text-xs text-rose-200/80 font-medium">{apiError}</p>
                </div>
              </div>
              <button
                onClick={fetchGasEvents}
                className="px-4 py-2 bg-rose-500/20 hover:bg-rose-500/30 border border-rose-500/30 rounded-xl text-xs font-bold text-white transition-all shrink-0"
              >
                Retry Connection
              </button>
            </div>
          )}

          {/* Live Events Grid */}
          {!loading && !apiError && eventsList.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {eventsList.map((evt) => (
                <motion.div
                  key={evt.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="group relative flex flex-col h-full bg-theme-bg-secondary/50 backdrop-blur-xl border border-theme-border rounded-[2rem] overflow-hidden hover:border-[#00ff88]/40 transition-all duration-300 shadow-xl"
                >
                  {/* Poster Image */}
                  <div className="h-48 w-full relative bg-black/40 overflow-hidden">
                    <img
                      src={evt.poster_url || evt.poster_image}
                      alt={evt.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent" />
                    
                    <div className="absolute top-3 left-3 right-3 flex items-center justify-between">
                      <span className="px-2.5 py-1 bg-black/70 backdrop-blur-md border border-white/10 rounded-full text-[9px] font-mono font-black uppercase text-[#00ff88] tracking-wider">
                        {evt.category || "Event"}
                      </span>
                      {evt.status && (
                        <span className="px-2.5 py-1 bg-emerald-500/20 border border-emerald-500/40 rounded-full text-[9px] font-mono font-bold uppercase text-emerald-300">
                          {evt.status}
                        </span>
                      )}
                    </div>

                    <div className="absolute bottom-3 left-4 right-4 flex items-center justify-between text-[11px] font-mono text-zinc-300">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5 text-[#00ff88]" />
                        {evt.date}
                      </span>
                      {evt.location && (
                        <span className="flex items-center gap-1 truncate max-w-[150px]">
                          <MapPin className="w-3.5 h-3.5 text-[#00ff88]" />
                          {evt.location}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Body Content */}
                  <div className="p-6 flex-grow flex flex-col justify-between space-y-4">
                    <div>
                      <h3 className="text-xl font-black uppercase text-white tracking-tight leading-tight group-hover:text-[#00ff88] transition-colors">
                        {evt.title}
                      </h3>
                      <p className="text-theme-text-secondary text-xs font-medium leading-relaxed mt-2 line-clamp-3">
                        {evt.description}
                      </p>
                    </div>

                    <div className="pt-4 border-t border-theme-border/60 flex items-center justify-between gap-3">
                      <button
                        onClick={() => handleOpenEventDetail(evt.id, evt)}
                        className="flex-1 py-2.5 px-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-xs font-bold text-white transition-all text-center"
                      >
                        Details
                      </button>
                      <button
                        onClick={() => handleOpenRegistration(evt)}
                        className="flex-1 py-2.5 px-3 bg-[#00ff88] hover:bg-white text-black font-black uppercase text-xs tracking-wider rounded-xl transition-all text-center flex items-center justify-center gap-1"
                      >
                        <span>Register</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}

          {/* Empty State */}
          {!loading && !apiError && eventsList.length === 0 && (
            <div className="p-8 rounded-[2rem] bg-theme-bg-secondary/40 border border-theme-border text-center max-w-xl mx-auto space-y-3">
              <Sparkles className="w-8 h-8 text-[#00ff88] mx-auto opacity-75" />
              <h3 className="text-lg font-bold text-white uppercase">Backend Connected & Active</h3>
              <p className="text-xs text-zinc-400 font-medium">
                No extra events are currently published in the Google Sheet. Use our flagship registration buttons above or add rows to the Google Sheet backend!
              </p>
            </div>
          )}
        </section>

        {/* 2. ICT CODEJAM SECTION */}
        <section className="relative w-full max-w-6xl mx-auto">
          {/* Header */}
          <div className="text-center mb-16 relative">
            <div className="absolute -top-10 left-1/2 -translate-x-1/2 w-48 h-48 bg-gfg-primary/5 rounded-full blur-3xl pointer-events-none" />
            
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="inline-flex items-center space-x-2.5 px-5 py-2 mb-6 text-xs font-black tracking-[0.25em] text-[#00ff88] uppercase bg-[#00ff88]/10 border border-[#00ff88]/25 rounded-full shadow-lg shadow-[#00ff88]/5 select-none"
            >
              <span className="w-1.5 h-1.5 bg-[#00ff88] rounded-full animate-ping" />
              <span>COMPETE • SOLVE • INNOVATE</span>
            </motion.div>
            
            <motion.h1 
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="text-5xl sm:text-7xl font-black mb-8 tracking-tighter uppercase leading-[0.9] italic"
            >
              ICT <span className="text-transparent bg-clip-text bg-gradient-to-r from-gfg-primary via-emerald-400 to-[#00ff88]">CODEJAM</span>
            </motion.h1>

            <motion.p 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="text-theme-text-secondary max-w-3xl mx-auto text-sm sm:text-base font-semibold leading-relaxed text-center px-4"
            >
              A university-wide competitive programming initiative powered by GeeksforGeeks to help students sharpen problem-solving skills, improve coding efficiency, and compete with the best minds across semesters.
            </motion.p>
          </div>

          {/* 3-Column Responsive Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 items-stretch mt-12">
            {codejamEvents.map((card, idx) => {
              const Icon = card.icon;
              return (
                <motion.div
                  key={card.sem}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.1, duration: 0.5 }}
                  className="group relative flex flex-col h-full bg-theme-bg-secondary/40 backdrop-blur-xl border border-theme-border rounded-[2.25rem] overflow-hidden hover:border-[#00ff88]/40 transition-all duration-300 shadow-xl"
                >
                  {/* Neon top highlights */}
                  <div className="absolute top-0 left-0 w-full h-[3px] bg-gradient-to-r from-transparent via-[#00ff88] to-transparent opacity-30 group-hover:opacity-100 transition-opacity" />
                  
                  {/* Soft Background Gradient */}
                  <div className={`absolute inset-0 bg-gradient-to-br ${card.color} opacity-30 pointer-events-none`} />

                  <div className="p-8 sm:p-10 flex-grow flex flex-col justify-between relative z-10 w-full h-full">
                    <div className="space-y-6">
                      {/* Brand Label and Icon Header */}
                      <div className="flex justify-between items-start w-full">
                        <div className="p-3 bg-white/5 border border-white/10 rounded-2xl">
                          <Icon className="w-6 h-6 text-[#00ff88]" />
                        </div>
                        
                        {card.hot && (
                          <div className="px-3 py-1 bg-red-500/10 border border-red-500/20 rounded-full flex items-center space-x-1.5 shadow-[0_0_12px_rgba(239,68,68,0.15)] animate-pulse">
                            <Flame className="w-3.5 h-3.5 text-red-500" />
                            <span className="text-[9px] font-black text-red-500 uppercase tracking-widest font-mono">HOT 🔥</span>
                          </div>
                        )}
                      </div>

                      <div className="space-y-2">
                        <div className="flex items-center space-x-2 text-[10px] font-mono tracking-widest text-[#00ff88] uppercase font-bold">
                          <span className={`px-2 py-0.5 rounded border ${card.accent}`}>{card.tag}</span>
                          <span className="opacity-60">•</span>
                          <span className="opacity-85">{card.round}</span>
                        </div>
                        
                        <h3 className="text-2xl md:text-3xl font-black uppercase text-theme-text italic tracking-tight leading-none pt-1">
                          {card.sem}
                        </h3>
                      </div>

                      <p className="text-theme-text-secondary text-xs sm:text-sm font-semibold leading-relaxed">
                        {card.desc}
                      </p>
                    </div>

                    {/* Button CTA */}
                    <div className="pt-8 mt-8 border-t border-theme-border/60">
                      <a
                        href={card.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-full inline-flex items-center justify-center px-6 py-3.5 bg-[#17222f]/80 border border-[#00ff88]/30 group-hover:bg-[#00ff88] group-hover:text-black group-hover:border-transparent text-[#00ff88] font-black uppercase text-xs tracking-widest rounded-2xl transition-all duration-300 shadow-sm group-hover:shadow-[0_0_20px_rgba(0,255,136,0.25)]"
                      >
                        <span>Register Now</span>
                        <ArrowRight className="w-4 h-4 ml-2 transition-transform duration-300 group-hover:translate-x-1" />
                      </a>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </section>

      </div>

      {/* 3. PREMIUM SLIDE-OUT PANEL FOR INTELLIFY 4.0 DETAILS */}
      <AnimatePresence>
        {isDetailModalOpen && (
          <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4">
            {/* Backdrop slide blur */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsDetailModalOpen(false)}
              className="fixed inset-0 bg-black/80 backdrop-blur-lg"
            />

            {/* Modal Body Card */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 30 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 30 }}
              className="relative w-full max-w-5xl bg-[#0c141d]/95 border border-theme-border/80 rounded-[2.5rem] overflow-hidden shadow-2xl z-10 max-h-[90vh] flex flex-col"
            >
              {/* Cover Top Accent */}
              <div className="absolute top-0 left-0 w-full h-[5px] bg-gradient-to-r from-[#00ff88] via-[#00E676] to-transparent z-20" />

              {/* Close Button Button */}
              <button
                onClick={() => setIsDetailModalOpen(false)}
                className="absolute top-6 right-6 z-30 p-3 bg-black/60 hover:bg-white text-zinc-400 hover:text-black rounded-full border border-white/10 transition-colors"
                id="close-modal-btn"
              >
                <X className="w-5 h-5" />
              </button>

              {/* Dynamic Event Detail Content */}
              {(() => {
                const currentDetail = selectedDetailEvent || intellifyEvent;
                return (
                  <div className="flex-grow overflow-y-auto w-full p-6 sm:p-10 md:p-12">
                    {detailLoading && (
                      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm z-30 flex items-center justify-center space-x-3">
                        <Loader2 className="w-8 h-8 text-[#00ff88] animate-spin" />
                        <span className="text-white text-xs font-mono font-bold uppercase tracking-wider">Syncing Event Details...</span>
                      </div>
                    )}

                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
                      
                      {/* Left Column: Visual Poster & Direct Details */}
                      <div className="lg:col-span-5 space-y-6">
                        <div className="aspect-[3/4] relative rounded-3xl overflow-hidden border border-theme-border shadow-xl bg-black">
                          <img 
                            src={currentDetail.poster_image || currentDetail.poster_url} 
                            alt={currentDetail.title} 
                            className="w-full h-full object-cover"
                            referrerPolicy="no-referrer"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                        </div>

                        {/* Collaboration Zone */}
                        <div className="bg-white/5 border border-white/10 rounded-3xl p-6 space-y-4">
                          <p className="text-[10px] font-mono font-black text-[#00ff88] uppercase tracking-widest">Event Coordination</p>
                          
                          <div className="flex flex-col space-y-3">
                            <div className="flex items-center space-x-3">
                              <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center border border-white/10">
                                <Building2 className="w-5 h-5 text-emerald-400" />
                              </div>
                              <div>
                                <p className="text-[11px] font-mono text-zinc-400 leading-tight">Organizer</p>
                                <p className="text-xs font-black text-white uppercase">{currentDetail.organizer_name || "Marwadi University"}</p>
                              </div>
                            </div>

                            <div className="flex items-center space-x-3">
                              <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center border border-white/10">
                                <Trophy className="w-5 h-5 text-gfg-primary" />
                              </div>
                              <div>
                                <p className="text-[11px] font-mono text-zinc-400 leading-tight">Host Chapter</p>
                                <p className="text-xs font-black text-white uppercase">GeeksforGeeks MU Chapter</p>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Right Column: Tabbed Content & Timelines */}
                      <div className="lg:col-span-7 flex flex-col justify-between space-y-8">
                        <div className="space-y-6">
                          
                          {/* Meta header */}
                          <div>
                            <span className="px-3.5 py-1.5 bg-[#00ff88]/10 border border-[#00ff88]/20 rounded-full text-[9px] font-mono font-black uppercase text-[#00ff88] tracking-widest">
                              {currentDetail.category || "Hackathon / Competition"}
                            </span>
                            
                            <h2 className="text-3xl sm:text-4xl font-extrabold uppercase italic tracking-tighter text-white mt-4 leading-none">
                              {currentDetail.title}
                            </h2>
                            
                            <div className="flex flex-wrap items-center gap-4 text-xs font-mono text-zinc-400 mt-3">
                              <span className="flex items-center text-[#00ff88]">
                                <Calendar className="w-3.5 h-3.5 mr-1" /> {currentDetail.date}
                              </span>
                              {currentDetail.time && (
                                <span className="flex items-center">
                                  <Clock className="w-3.5 h-3.5 mr-1 text-[#00ff88]" /> {currentDetail.time}
                                </span>
                              )}
                              <span className="flex items-center">
                                <MapPin className="w-3.5 h-3.5 mr-1 text-[#00ff88]" /> {currentDetail.location}
                              </span>
                            </div>
                          </div>

                          {/* Premium Tabs Selection */}
                          <div className="flex border-b border-theme-border/60">
                            {["about", "timeline", "eligibility"].map((tab) => (
                              <button
                                key={tab}
                                onClick={() => setActiveTab(tab as any)}
                                className={`px-5 py-3 text-xs font-black uppercase tracking-widest border-b-2 transition-all cursor-pointer ${
                                  activeTab === tab 
                                    ? "border-[#00ff88] text-[#00ff88]" 
                                    : "border-transparent text-zinc-400 hover:text-white"
                                }`}
                              >
                                {tab}
                              </button>
                            ))}
                          </div>

                          {/* Tab Content Display */}
                          <div className="min-h-[220px]">
                            {activeTab === "about" && (
                              <div className="space-y-4">
                                <p className="text-theme-text-secondary text-sm leading-relaxed font-semibold whitespace-pre-line">
                                  {currentDetail.description}
                                </p>

                                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-4">
                                  <div className="p-3.5 rounded-2xl bg-white/5 border border-white/5">
                                    <p className="text-[10px] font-mono text-zinc-400">Prize Pool</p>
                                    <p className="text-xs font-black text-[#00ff88] uppercase">{currentDetail.prize_pool || "Exciting Swag"}</p>
                                  </div>

                                  <div className="p-3.5 rounded-2xl bg-white/5 border border-white/5">
                                    <p className="text-[10px] font-mono text-zinc-400">Team Size</p>
                                    <p className="text-xs font-black text-white uppercase">{currentDetail.team_size || "1–4 Members"}</p>
                                  </div>

                                  <div className="p-3.5 rounded-2xl bg-white/5 border border-white/5 col-span-2 sm:col-span-1">
                                    <p className="text-[10px] font-mono text-zinc-400">Registration Fee</p>
                                    <p className="text-xs font-black text-white uppercase">{currentDetail.registration_fee || "Free"}</p>
                                  </div>
                                </div>
                              </div>
                            )}

                            {activeTab === "timeline" && (
                              <div className="space-y-4 relative pl-4 border-l-2 border-emerald-500/10">
                                {(currentDetail.stages && currentDetail.stages.length > 0 ? currentDetail.stages : [
                                  { title: "Registration Window", date: currentDetail.date, desc: "Team registrations open on chapter portal." },
                                  { title: "Event Day", date: currentDetail.date, desc: "Reporting at Marwadi University campus." }
                                ]).map((stage, idx) => (
                                  <div key={idx} className="relative space-y-1 pb-6 last:pb-0">
                                    <div className="absolute -left-[22px] top-0.5 w-2.5 h-2.5 rounded-full bg-[#00ff88] border-2 border-black" />
                                    <div className="flex items-center space-x-2 text-[10px] font-mono text-emerald-400 font-bold">
                                      <span>Stage {idx + 1}: {stage.title}</span>
                                      <span>•</span>
                                      <span className="text-white/60">{stage.date}</span>
                                    </div>
                                    <p className="text-theme-text-secondary text-xs font-semibold leading-relaxed">
                                      {stage.desc}
                                    </p>
                                  </div>
                                ))}
                              </div>
                            )}

                            {activeTab === "eligibility" && (
                              <div className="space-y-4">
                                <p className="text-xs font-mono text-zinc-400">{currentDetail.eligibility || "Open to all university students."}</p>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                                  {[
                                    "Engineering Students",
                                    "Undergraduate Students",
                                    "Postgraduate Students",
                                    "Computer Science & IT",
                                    "Management & Sciences",
                                    "All Universities Across India"
                                  ].map((item, index) => (
                                    <div key={index} className="flex items-center space-x-2.5 text-xs text-white bg-white/5 border border-white/5 p-3.5 rounded-xl">
                                      <CheckCircle className="w-4 h-4 text-[#00ff88] shrink-0" />
                                      <span className="font-semibold">{item}</span>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            )}
                          </div>

                        </div>

                        {/* Modal Action Buttons */}
                        <div className="pt-6 border-t border-theme-border/60 flex flex-col sm:flex-row items-center gap-3">
                          <button
                            onClick={() => {
                              setIsDetailModalOpen(false);
                              handleOpenRegistration(currentDetail);
                            }}
                            className="w-full sm:w-1/2 inline-flex items-center justify-center px-8 py-4.5 bg-[#00ff88] hover:bg-white text-black font-black uppercase text-xs tracking-widest rounded-2xl hover:shadow-[0_0_20px_rgba(0,255,136,0.25)] transition-all duration-300"
                            id="detail-modal-quick-reg-btn"
                          >
                            <Sparkles className="w-4 h-4 mr-2" />
                            <span>Quick Register</span>
                          </button>

                          {currentDetail.registration_link && (
                            <a
                              href={currentDetail.registration_link}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="w-full sm:w-1/2 inline-flex items-center justify-center px-8 py-4.5 bg-white/5 border border-white/10 hover:bg-white/10 text-white font-black uppercase text-xs tracking-widest rounded-2xl transition-all duration-300"
                            >
                              <span>External Portal</span>
                              <ArrowRight className="w-4 h-4 ml-2" />
                            </a>
                          )}
                        </div>

                      </div>

                    </div>
                  </div>
                );
              })()}

            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* 4. INTERACTIVE GOOGLE APPS SCRIPT REGISTRATION MODAL */}
      <AnimatePresence>
        {isRegModalOpen && regEvent && (
          <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => {
                if (!regSubmitting) setIsRegModalOpen(false);
              }}
              className="fixed inset-0 bg-black/85 backdrop-blur-md"
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-xl bg-[#0c141d] border border-theme-border rounded-[2.5rem] overflow-hidden shadow-2xl z-10 my-8 flex flex-col"
            >
              {/* Top Accent Line */}
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[#00ff88] via-emerald-400 to-[#00ff88]" />

              {/* Close Button */}
              <button
                onClick={() => setIsRegModalOpen(false)}
                disabled={regSubmitting}
                className="absolute top-5 right-5 z-20 p-2.5 bg-white/5 hover:bg-white/10 text-zinc-400 hover:text-white rounded-full border border-white/10 transition-colors disabled:opacity-50"
                id="close-reg-modal-btn"
              >
                <X className="w-4 h-4" />
              </button>

              <div className="p-8 sm:p-10">
                {/* Header info */}
                <div className="mb-6">
                  <span className="px-3 py-1 bg-[#00ff88]/10 border border-[#00ff88]/25 rounded-full text-[9px] font-mono font-black uppercase text-[#00ff88] tracking-wider">
                    Official Registration • {regEvent.category || "Event"}
                  </span>
                  <h3 className="text-2xl font-black uppercase tracking-tight text-white mt-2">
                    {regEvent.title}
                  </h3>
                  <p className="text-xs text-zinc-400 font-mono mt-1">
                    Date: {regEvent.date} {regEvent.time ? `• ${regEvent.time}` : ""}
                  </p>
                </div>

                {/* SUCCESS STATE */}
                {regSuccessData ? (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="space-y-6 text-center py-4"
                  >
                    <div className="w-16 h-16 bg-emerald-500/10 border border-emerald-500/30 rounded-2xl mx-auto flex items-center justify-center text-[#00ff88]">
                      <CheckCircle2 className="w-10 h-10" />
                    </div>

                    <div>
                      <h4 className="text-2xl font-black uppercase tracking-tight text-white">
                        Registration Confirmed!
                      </h4>
                      <p className="text-xs text-zinc-400 mt-1 max-w-sm mx-auto">
                        Your registration has been securely synced to the Google Apps Script Web App backend.
                      </p>
                    </div>

                    {/* Registration ID Details Card */}
                    <div className="p-5 bg-white/5 border border-white/10 rounded-2xl text-left space-y-3">
                      <div>
                        <span className="text-[10px] font-mono text-zinc-400 uppercase">Registration ID</span>
                        <div className="flex items-center justify-between mt-1">
                          <span className="text-lg font-mono font-black text-[#00ff88]" id="reg-id-display">
                            {regSuccessData.registration_id || `REG-${Date.now()}`}
                          </span>
                          <button
                            onClick={() => {
                              const idToCopy = regSuccessData.registration_id || "";
                              navigator.clipboard.writeText(idToCopy);
                              setCopiedRegId(true);
                              setTimeout(() => setCopiedRegId(false), 2000);
                            }}
                            className="p-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg text-xs font-mono text-zinc-300 flex items-center gap-1.5 transition-all"
                            title="Copy Registration ID"
                          >
                            {copiedRegId ? (
                              <>
                                <Check className="w-3.5 h-3.5 text-[#00ff88]" />
                                <span className="text-[#00ff88]">Copied</span>
                              </>
                            ) : (
                              <>
                                <Copy className="w-3.5 h-3.5" />
                                <span>Copy</span>
                              </>
                            )}
                          </button>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-3 pt-3 border-t border-white/5 text-xs">
                        <div>
                          <span className="text-[10px] font-mono text-zinc-400 uppercase">Participant</span>
                          <p className="font-bold text-white mt-0.5">{regForm.name}</p>
                        </div>
                        <div>
                          <span className="text-[10px] font-mono text-zinc-400 uppercase">Event</span>
                          <p className="font-bold text-white mt-0.5 truncate">{regEvent.title}</p>
                        </div>
                      </div>
                    </div>

                    <button
                      onClick={() => {
                        setIsRegModalOpen(false);
                        setRegSuccessData(null);
                      }}
                      className="w-full py-4 bg-[#00ff88] text-black font-black uppercase text-xs tracking-widest rounded-xl hover:bg-white transition-all shadow-lg"
                    >
                      Done
                    </button>
                  </motion.div>
                ) : (
                  /* REGISTRATION FORM */
                  <form onSubmit={handleRegistrationSubmit} className="space-y-4">
                    {/* Error Notice */}
                    {regError && (
                      <div className="p-3.5 bg-rose-500/10 border border-rose-500/30 rounded-xl text-rose-300 text-xs flex items-center gap-2">
                        <AlertTriangle className="w-4 h-4 shrink-0 text-rose-400" />
                        <span>{regError}</span>
                      </div>
                    )}

                    <div>
                      <label className="block text-[10px] font-mono uppercase tracking-wider text-zinc-400 mb-1.5" htmlFor="reg-name">
                        Full Name *
                      </label>
                      <input
                        id="reg-name"
                        type="text"
                        required
                        value={regForm.name}
                        onChange={(e) => setRegForm({ ...regForm, name: e.target.value })}
                        placeholder="e.g. Meet Khakhkhar"
                        className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white text-xs placeholder:text-zinc-600 focus:outline-none focus:border-[#00ff88] transition-colors"
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-[10px] font-mono uppercase tracking-wider text-zinc-400 mb-1.5" htmlFor="reg-email">
                          Email Address *
                        </label>
                        <input
                          id="reg-email"
                          type="email"
                          required
                          value={regForm.email}
                          onChange={(e) => setRegForm({ ...regForm, email: e.target.value })}
                          placeholder="student@marwadiuniversity.ac.in"
                          className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white text-xs placeholder:text-zinc-600 focus:outline-none focus:border-[#00ff88] transition-colors"
                        />
                      </div>

                      <div>
                        <label className="block text-[10px] font-mono uppercase tracking-wider text-zinc-400 mb-1.5" htmlFor="reg-phone">
                          Phone Number *
                        </label>
                        <input
                          id="reg-phone"
                          type="tel"
                          required
                          value={regForm.phone}
                          onChange={(e) => setRegForm({ ...regForm, phone: e.target.value })}
                          placeholder="+91 98765 43210"
                          className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white text-xs placeholder:text-zinc-600 focus:outline-none focus:border-[#00ff88] transition-colors"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-[10px] font-mono uppercase tracking-wider text-zinc-400 mb-1.5" htmlFor="reg-enrollment">
                          Enrollment No. *
                        </label>
                        <input
                          id="reg-enrollment"
                          type="text"
                          required
                          value={regForm.enrollment_number}
                          onChange={(e) => setRegForm({ ...regForm, enrollment_number: e.target.value })}
                          placeholder="e.g. 92200103001"
                          className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white text-xs placeholder:text-zinc-600 focus:outline-none focus:border-[#00ff88] transition-colors"
                        />
                      </div>

                      <div>
                        <label className="block text-[10px] font-mono uppercase tracking-wider text-zinc-400 mb-1.5" htmlFor="reg-year">
                          Year of Study *
                        </label>
                        <select
                          id="reg-year"
                          value={regForm.year}
                          onChange={(e) => setRegForm({ ...regForm, year: e.target.value })}
                          className="w-full px-4 py-3 bg-[#111c27] border border-white/10 rounded-xl text-white text-xs focus:outline-none focus:border-[#00ff88] transition-colors"
                        >
                          <option value="1">1st Year (Freshman)</option>
                          <option value="2">2nd Year (Sophomore)</option>
                          <option value="3">3rd Year (Junior)</option>
                          <option value="4">4th Year (Senior)</option>
                        </select>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-[10px] font-mono uppercase tracking-wider text-zinc-400 mb-1.5" htmlFor="reg-department">
                          Department / Branch *
                        </label>
                        <input
                          id="reg-department"
                          type="text"
                          required
                          value={regForm.department}
                          onChange={(e) => setRegForm({ ...regForm, department: e.target.value })}
                          placeholder="Computer Science & Engineering"
                          className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white text-xs placeholder:text-zinc-600 focus:outline-none focus:border-[#00ff88] transition-colors"
                        />
                      </div>

                      <div>
                        <label className="block text-[10px] font-mono uppercase tracking-wider text-zinc-400 mb-1.5" htmlFor="reg-college">
                          College / University *
                        </label>
                        <input
                          id="reg-college"
                          type="text"
                          required
                          value={regForm.college}
                          onChange={(e) => setRegForm({ ...regForm, college: e.target.value })}
                          placeholder="Marwadi University"
                          className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white text-xs placeholder:text-zinc-600 focus:outline-none focus:border-[#00ff88] transition-colors"
                        />
                      </div>
                    </div>

                    <div className="pt-4">
                      <button
                        type="submit"
                        disabled={regSubmitting}
                        className="w-full py-4 bg-[#00ff88] hover:bg-white text-black font-black uppercase text-xs tracking-widest rounded-xl transition-all shadow-lg flex items-center justify-center space-x-2 disabled:opacity-50 cursor-pointer"
                        id="reg-submit-btn"
                      >
                        {regSubmitting ? (
                          <>
                            <Loader2 className="w-4 h-4 animate-spin text-black" />
                            <span>Syncing with Google Apps Script...</span>
                          </>
                        ) : (
                          <>
                            <Send className="w-4 h-4 text-black" />
                            <span>Complete Registration</span>
                          </>
                        )}
                      </button>
                    </div>
                  </form>
                )}

              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* 3. PREMIUM CALL TO ACTION SECTION */}
      <section className="relative w-full max-w-5xl mx-auto pt-16 pb-8 px-6">
        <div className="relative rounded-[2.5rem] bg-gradient-to-br from-theme-bg-secondary/80 to-theme-bg-secondary/40 border-2 border-[#00ff88]/20 p-10 md:p-14 overflow-hidden text-center shadow-2xl">
          {/* Cyber background effects */}
          <div className="absolute top-0 right-0 w-[300px] h-[300px] bg-[#00ff88]/5 rounded-full blur-[100px] pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-[250px] h-[250px] bg-emerald-500/5 rounded-full blur-[90px] pointer-events-none" />
          
          <div className="relative z-10 max-w-2xl mx-auto space-y-6">
            <span className="inline-flex items-center space-x-1.5 px-3 py-1 bg-[#00ff88]/15 border border-[#00ff88]/30 rounded-full text-[10px] font-black uppercase text-[#00ff88] tracking-widest">
              <span>LIMITED SEATS REMAINING</span>
            </span>

            <h2 className="text-3xl sm:text-5xl font-black italic uppercase tracking-tighter text-white">
              Ready to Build the Future?
            </h2>

            <p className="text-zinc-400 text-sm sm:text-base font-semibold leading-relaxed">
              Join Intellify 4.0 and compete with innovators from across India. Showcase your skills, solve real-world challenges, and win exciting prizes.
            </p>

            <div className="pt-6">
              <a
                href={INTELLIFY_REGISTRATION_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center px-10 py-5 bg-[#00ff88] text-black font-black uppercase text-xs tracking-[0.2em] rounded-2xl hover:bg-white hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 hover:shadow-[0_0_30px_rgba(0,255,136,0.35)]"
              >
                <span>Register on Unstop</span>
                <ArrowRight className="w-4.5 h-4.5 ml-2.5" />
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Sticky Bottom Floating Mobile Registration Bar */}
      <div className="fixed bottom-4 left-4 right-4 z-40 md:hidden">
        <div className="bg-theme-bg-secondary/95 backdrop-blur-lg border border-[#00ff88]/30 rounded-2xl p-4 flex items-center justify-between shadow-2xl">
          <div className="text-left">
            <div className="text-[10px] font-black uppercase tracking-widest text-[#00ff88]">Intellify 4.0</div>
            <div className="text-[9px] text-zinc-400 font-bold uppercase">National Hackathon</div>
          </div>
          <a
            href={INTELLIFY_REGISTRATION_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="px-4 py-2 bg-[#00ff88] text-black font-black uppercase text-[10px] tracking-wider rounded-xl hover:bg-white transition-all shadow-[0_0_15px_rgba(0,255,136,0.25)]"
          >
            Register on Unstop
          </a>
        </div>
      </div>

    </motion.div>
  );
}
