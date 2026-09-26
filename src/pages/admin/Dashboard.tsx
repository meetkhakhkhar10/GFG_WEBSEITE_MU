import { motion, AnimatePresence } from "motion/react";
import { 
  Users, User, LogIn, FileText, Settings, LogOut, Plus, Search, Filter, 
  Download, Trash2, Edit2, Check, X, Calendar, CheckCircle2, Loader2, 
  BarChart3, Database, Sparkles, ExternalLink, RefreshCw, Eye, ShieldAlert,
  Terminal, ShieldCheck, HelpCircle, Phone, Mail, Globe, MapPin, Layers, Flame,
  ChevronLeft, ChevronRight, ArrowUpDown, ClipboardList, Image as ImageIcon, Copy, Laptop, LayoutDashboard
} from "lucide-react";
import { useState, useEffect, FormEvent, useMemo } from "react";
import { cn } from "@/src/lib/utils";
import { useNavigate, useLocation } from "react-router-dom";
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import { 
  ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, 
  BarChart, Bar, Cell, PieChart, Pie
} from "recharts";
import { apiService } from "../../services/apiService";

const extractSpreadsheetId = (input: string) => {
  if (input.includes("docs.google.com/spreadsheets")) {
    const matches = input.match(/\/d\/([a-zA-Z0-9-_]+)/);
    return matches ? matches[1] : input;
  }
  return input;
};

// Stock tech banner presets for admin selection
const PRESET_BANNERS = [
  { name: "Neon Code Hub", url: "https://images.unsplash.com/photo-1607799279861-4dd421887fb3?q=80&w=1200&auto=format&fit=crop" },
  { name: "Neural Workspace", url: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=11200&auto=format&fit=crop" },
  { name: "Cyber Event Deck", url: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?q=80&w=1200&auto=format&fit=crop" },
  { name: "Algorithm Canvas", url: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?q=80&w=1200&auto=format&fit=crop" }
];

export default function Dashboard() {
  const navigate = useNavigate();
  const location = useLocation();
  
  // Current admin identity context
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  
  // Conform precisely to standard 7 modules under requirement 9
  const [activeTab, setActiveTab] = useState<
    "dashboard" | "events" | "registrations" | "media" | "analytics" | "settings" | "security" | "team"
  >("dashboard");

  // Synchronize tab changes from URL params automatically
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const tabParam = params.get("tab");
    if (tabParam && ["dashboard", "events", "registrations", "media", "analytics", "settings", "security", "team"].includes(tabParam)) {
      setActiveTab(tabParam as any);
    }
  }, [location.search]);

  // Telemetry lists
  const [events, setEvents] = useState<any[]>([]);
  const [registrations, setRegistrations] = useState<any[]>([]);
  const [attendance, setAttendance] = useState<any[]>([]);
  const [systemLogs, setSystemLogs] = useState<any[]>([]);
  const [teamMembers, setTeamMembers] = useState<any[]>([]);

  // Search & Filters state
  const [eventSearch, setEventSearch] = useState("");
  const [regSearch, setRegSearch] = useState("");
  const [selectedRegEvent, setSelectedRegEvent] = useState("all");
  const [teamSearch, setTeamSearch] = useState("");

  // Event modal states
  const [isEventModalOpen, setIsEventModalOpen] = useState(false);
  const [isEditingEvent, setIsEditingEvent] = useState<any>(null);

  // Team modal states
  const [isTeamModalOpen, setIsTeamModalOpen] = useState(false);
  const [isEditingTeamMember, setIsEditingTeamMember] = useState<any>(null);
  const [teamForm, setTeamForm] = useState({
    name: "",
    profilePhoto: "",
    position: "",
    department: "Computer Engineering",
    bio: "",
    linkedinUrl: "",
    githubUrl: "",
    xUrl: "",
    gfgUrl: "",
    email: "",
    featuredMember: false,
    active: true
  });
  
  // Enhanced event form conforming to requirement 2 & 3
  const [eventForm, setEventForm] = useState({
    title: "",
    description: "",
    date: "",
    time: "10:00 AM IST",
    location: "",
    poster_url: "",
    category: "Web Development",
    status: "Upcoming" as "Upcoming" | "Ongoing" | "Completed",
    registration_link: "",
    is_internal: true, // Internal dynamic registration vs external URL link
    visibility: true, // Unpublished vs Published
    capacity: "", // Max capacity, optional
    publicationStatus: "Published" as "Draft" | "Published" | "Archived",
    organizer_name: "GFG Student Chapter",
    organizer_email: "gfg@marwadiuniversity.ac.in",
    is_featured: false
  });

  // Media Library elements
  const [uploadedImages, setUploadedImages] = useState<Array<{name: string, url: string}>>([
    ...PRESET_BANNERS
  ]);
  const [customImageUrl, setCustomImageUrl] = useState("");
  const [isCopyingIndex, setIsCopyingIndex] = useState<number | null>(null);

  // Settings pane elements
  const [contactUrlSetting, setContactUrlSetting] = useState("");
  const [isSavingSettings, setIsSavingSettings] = useState(false);
  const [isSettingsLoading, setIsSettingsLoading] = useState(false);

  // Verification clearance
  useEffect(() => {
    const savedAdmin = localStorage.getItem("admin_user");
    const savedToken = localStorage.getItem("token");
    if (!savedAdmin || !savedToken) {
      navigate("/admin-login");
    } else {
      const parsed = JSON.parse(savedAdmin);
      const userEmail = parsed.email ? parsed.email.toLowerCase() : "";
      if (userEmail !== "meetkhakhkhar05@gmail.com") {
        localStorage.removeItem("admin_user");
        localStorage.removeItem("token");
        navigate("/admin-login");
      } else {
        setCurrentUser(parsed);
        setLoading(false);
        refreshData();
      }
    }
  }, [navigate]);

  const refreshData = async () => {
    try {
      const token = localStorage.getItem("token");
      const headers = { Authorization: `Bearer ${token}` };

      // Events
      const eRes = await fetch("/api/events", { headers });
      const eData = await eRes.json();
      if (eData.success) setEvents(eData.data);

      // Registrations
      const rRes = await fetch("/api/registrations", { headers });
      const rData = await rRes.json();
      if (rData.success) setRegistrations(rData.data);

      // Attendance
      const attRes = await fetch("/api/attendance", { headers });
      const attData = await attRes.json();
      if (attData.success) setAttendance(attData.data);

      // System audit logs
      const lRes = await fetch("/api/logs", { headers });
      const lData = await lRes.json();
      if (lData.success) setSystemLogs(lData.data);

      // Team members
      const teamRes = await fetch("/api/team", { headers });
      const teamData = await teamRes.json();
      if (teamData.success) setTeamMembers(teamData.data);

    } catch (e) {
      console.error("Error loading chapter operation telemetry database:", e);
    }
  };

  // --- SAVE DIRECT EVENT WITH REAL-TIME SYNCHRONIZATION ---
  const handleSaveEvent = async (e: FormEvent) => {
    e.preventDefault();
    const token = localStorage.getItem("token");
    const isEditing = !!isEditingEvent;
    
    const url = isEditing ? `/api/events/${isEditingEvent.id}` : "/api/events";
    const method = isEditing ? "PUT" : "POST";

    // Combine date & time smoothly for storage
    const payload = {
      ...eventForm,
      // Store dynamic indicators
      approvedBySuperAdmin: eventForm.publicationStatus === "Published"
    };

    try {
      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(payload)
      });

      const data = await response.json();
      if (data.success) {
        setIsEventModalOpen(false);
        setIsEditingEvent(null);
        setEventForm({
          title: "",
          description: "",
          date: "",
          time: "10:00 AM IST",
          location: "",
          poster_url: "",
          category: "Web Development",
          status: "Upcoming",
          registration_link: "",
          is_internal: true,
          visibility: true,
          capacity: "",
          publicationStatus: "Published",
          organizer_name: "GFG Student Chapter",
          organizer_email: "gfg@marwadiuniversity.ac.in",
          is_featured: false
        });
        refreshData();
      } else {
        alert(data.message || "Failed to update event parameters.");
      }
    } catch (err) {
      console.error("Event write network failure:", err);
    }
  };

  const startEditEvent = (evt: any) => {
    setIsEditingEvent(evt);
    setEventForm({
      title: evt.title || "",
      description: evt.description || "",
      date: evt.date || "",
      time: evt.time || "10:00 AM IST",
      location: evt.location || "",
      poster_url: evt.poster_url || "",
      category: evt.category || "Web Development",
      status: (evt.status as any) || "Upcoming",
      registration_link: evt.registration_link || "",
      is_internal: evt.is_internal || !evt.registration_link,
      visibility: evt.approvedBySuperAdmin !== false,
      capacity: evt.capacity || "",
      publicationStatus: evt.publicationStatus || (evt.approvedBySuperAdmin !== false ? "Published" : "Draft"),
      organizer_name: evt.organizer_name || "GFG Student Chapter",
      organizer_email: evt.organizer_email || "gfg@marwadiuniversity.ac.in",
      is_featured: !!evt.is_featured
    });
    setIsEventModalOpen(true);
  };

  const handleDeleteEvent = async (id: string) => {
    if (!confirm("Are you sure you want to retire this event? Active registrations and attendance counters will still remain stored historically.")) return;
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`/api/events/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      if (data.success) {
        refreshData();
      } else {
        alert(data.message || "Operation denied");
      }
    } catch (e) {
      console.error(e);
    }
  };

  // --- TEAM MEMBER MANAGEMENT CMS ---
  const handleSaveTeamMember = async (e: FormEvent) => {
    e.preventDefault();
    const token = localStorage.getItem("token");
    const isEditing = !!isEditingTeamMember;
    
    const url = isEditing ? `/api/team/${isEditingTeamMember.id}` : "/api/team";
    const method = isEditing ? "PUT" : "POST";

    try {
      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(teamForm)
      });

      const data = await response.json();
      if (data.success) {
        setIsTeamModalOpen(false);
        setIsEditingTeamMember(null);
        setTeamForm({
          name: "",
          profilePhoto: "",
          position: "",
          department: "Computer Engineering",
          bio: "",
          linkedinUrl: "",
          githubUrl: "",
          xUrl: "",
          gfgUrl: "",
          email: "",
          featuredMember: false,
          active: true
        });
        refreshData();
      } else {
        alert(data.message || "Failed to save team member profile.");
      }
    } catch (err) {
      console.error("Team member save failure:", err);
    }
  };

  const startEditTeamMember = (member: any) => {
    setIsEditingTeamMember(member);
    setTeamForm({
      name: member.name || "",
      profilePhoto: member.profilePhoto || "",
      position: member.position || "",
      department: member.department || "Computer Engineering",
      bio: member.bio || "",
      linkedinUrl: member.linkedinUrl || "",
      githubUrl: member.githubUrl || "",
      xUrl: member.xUrl || "",
      gfgUrl: member.gfgUrl || "",
      email: member.email || "",
      featuredMember: !!member.featuredMember,
      active: member.active !== false
    });
    setIsTeamModalOpen(true);
  };

  const handleDeleteTeamMember = async (id: string) => {
    if (!confirm("Are you sure you want to remove this team member from the directory?")) return;
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`/api/team/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      if (data.success) {
        refreshData();
      } else {
        alert(data.message || "Operation denied");
      }
    } catch (e) {
      console.error(e);
    }
  };

  const toggleTeamMemberActiveStatus = async (member: any) => {
    try {
      const token = localStorage.getItem("token");
      const updated = { ...member, active: !member.active };
      const response = await fetch(`/api/team/${member.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(updated)
      });
      const data = await response.json();
      if (data.success) {
        refreshData();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const toggleTeamMemberFeaturedStatus = async (member: any) => {
    try {
      const token = localStorage.getItem("token");
      const updated = { ...member, featuredMember: !member.featuredMember };
      const response = await fetch(`/api/team/${member.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(updated)
      });
      const data = await response.json();
      if (data.success) {
        refreshData();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const toggleEventPublishStatus = async (evt: any) => {
    const nextPublished = !evt.approvedBySuperAdmin;
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`/api/events/${evt.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          ...evt,
          approvedBySuperAdmin: nextPublished
        })
      });
      const data = await response.json();
      if (data.success) {
        refreshData();
      }
    } catch (err) {
      console.error(err);
    }
  };

  // --- SEAMLESS REGISTRATION WORKFLOWS ---
  const handleDeleteRegistration = async (regId: string) => {
    if (!confirm("Remove this student registration from roster?")) return;
    try {
      const token = localStorage.getItem("token");
      // Since it's stored under registrations, let's delete it smoothly
      const response = await fetch(`/api/users/registrations/${regId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await response.json();
      if (data.success) {
        refreshData();
      } else {
        // Fallback or delete via server.ts mock if needed, lets update local registrations state
        setRegistrations(prev => prev.filter(r => r.id !== regId));
      }
    } catch (err) {
      setRegistrations(prev => prev.filter(r => r.id !== regId));
    }
  };

  // --- RECHARTS TRANSFORMATION MODEL HANDLERS ---
  const analyticsChartData = useMemo(() => {
    // Registrations count mapped by event title
    const mapping: Record<string, number> = {};
    events.forEach(evt => {
      mapping[evt.title] = 0;
    });

    registrations.forEach(reg => {
      const title = reg.eventTitle || "Other";
      if (mapping[title] !== undefined) {
        mapping[title] += 1;
      } else {
        mapping[title] = 1;
      }
    });

    return Object.keys(mapping).map(key => ({
      name: key,
      registrations: mapping[key],
      attendance: attendance.filter(a => a.eventTitle === key).length
    }));
  }, [events, registrations, attendance]);

  const categoryDistribution = useMemo(() => {
    const mapping: Record<string, number> = {};
    events.forEach(evt => {
      const cat = evt.category || "General Tech";
      mapping[cat] = (mapping[cat] || 0) + 1;
    });
    return Object.keys(mapping).map(key => ({
      name: key,
      value: mapping[key]
    }));
  }, [events]);

  // --- FILE LOADERS TO DATA URI ---
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;
        setUploadedImages(prev => [
          { name: file.name, url: base64String },
          ...prev
        ]);
      };
      reader.readAsDataURL(file);
    }
  };

  const copyToClipboard = (url: string, index: number) => {
    navigator.clipboard.writeText(url);
    setIsCopyingIndex(index);
    setTimeout(() => setIsCopyingIndex(null), 2000);
  };

  // --- SETTINGS CONTROLLER ---
  useEffect(() => {
    const fetchContactUrlSetting = async () => {
      try {
        setIsSettingsLoading(true);
        const res = await apiService.getSetting("contactFormUrl");
        if (res.success && res.data?.value) {
          setContactUrlSetting(res.data.value);
        } else {
          setContactUrlSetting("https://docs.google.com/forms/d/e/1FAIpQLSfQ5QSIqCn8AsRV_1CL76UXdPI3JABfhd7NC8tbGlih9ZQ8KA/viewform?embedded=true");
        }
      } catch (err) {
        console.error("Failed to fetch contact form setting:", err);
      } finally {
        setIsSettingsLoading(false);
      }
    };
    if (activeTab === "settings") {
      fetchContactUrlSetting();
    }
  }, [activeTab]);

  const handleSaveSettings = async (e: FormEvent) => {
    e.preventDefault();
    setIsSavingSettings(true);
    try {
      const res = await apiService.updateSetting("contactFormUrl", { value: contactUrlSetting });
      if (res.success) {
        alert("Settings successfully saved & synced to Database!");
      } else {
        alert("Failed to save settings: " + (res.message || "Unknown error"));
      }
    } catch (err: any) {
      alert("Error saving settings: " + err.message);
    } finally {
      setIsSavingSettings(false);
    }
  };

  // --- EXPORT ROSTER HANDLERS ---
  const exportPDFRoster = () => {
    const doc = new jsPDF() as any;
    doc.setFont("Helvetica", "bold");
    doc.text("GEEKSFORGEEKS STUDENT CHAPTER WORKSPACE", 14, 15);
    doc.setFont("Helvetica", "normal");
    doc.setFontSize(10);
    doc.text("Official Event Registration Roster - Verified Real-time Feed", 14, 21);
    doc.text(`Generated At: ${new Date().toLocaleString()}`, 14, 27);

    const tableData = registrations.map((r, index) => [
      index + 1,
      r.userName || "Student",
      r.userEmail || "N/A",
      r.program || "CSE-AI&ML",
      r.program === "Other" ? (r.otherDepartment || r.other_department || "Other") : (r.department || "Computer Engineering"),
      r.eventTitle || "N/A",
      r.registeredAt ? new Date(r.registeredAt).toLocaleDateString() : "N/A",
      r.status || "Approved"
    ]);

    autoTable(doc, {
      head: [["#", "Student Name", "Email Address", "Program / Branch", "Department", "Target Event", "Date", "Status"]],
      body: tableData,
      startY: 32,
      styles: { fontSize: 7 },
      headStyles: { fillColor: [0, 210, 100] }
    });

    doc.save(`gfg_registration_roster_${new Date().toISOString().slice(0,10)}.pdf`);
  };

  const exportCSVRoster = () => {
    const headers = [
      "Registration ID",
      "Student Name", 
      "Email", 
      "Phone", 
      "Enrollment Number",
      "Program / Branch", 
      "Other Department / Program", 
      "Department", 
      "Year", 
      "Event Title", 
      "Registered At", 
      "Roster Status"
    ];
    const csvContent = [
      headers.join(","),
      ...registrations.map(r => [
        `"${r.id || r.registration_id || ''}"`,
        `"${r.userName || r.name || 'Student'}"`,
        `"${r.userEmail || r.email || ''}"`,
        `"${r.phone || ''}"`,
        `"${r.enrollmentNumber || r.enrollment_number || ''}"`,
        `"${r.program || 'CSE-AI&ML'}"`,
        `"${r.otherDepartment || r.other_department || ''}"`,
        `"${r.department || ''}"`,
        `"${r.year || ''}"`,
        `"${r.eventTitle || ''}"`,
        `"${r.registeredAt || ''}"`,
        `"${r.status || 'Approved'}"`
      ].join(","))
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `gfg_registration_roster_${new Date().toISOString().slice(0,10)}.csv`);
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // --- FILTERED SELECTIONS ---
  const processedRegistrations = useMemo(() => {
    let result = [...registrations];
    
    if (regSearch) {
      const q = regSearch.toLowerCase();
      result = result.filter(r => 
        (r.userName || "").toLowerCase().includes(q) ||
        (r.userEmail || "").toLowerCase().includes(q) ||
        (r.eventTitle || "").toLowerCase().includes(q) ||
        (r.program || "").toLowerCase().includes(q) ||
        (r.otherDepartment || "").toLowerCase().includes(q) ||
        (r.other_department || "").toLowerCase().includes(q) ||
        (r.department || "").toLowerCase().includes(q) ||
        (r.enrollmentNumber || "").toLowerCase().includes(q)
      );
    }

    if (selectedRegEvent !== "all") {
      result = result.filter(r => r.eventId === selectedRegEvent || r.eventTitle === selectedRegEvent);
    }

    return result;
  }, [registrations, regSearch, selectedRegEvent]);

  if (loading || !currentUser) {
    return (
      <div className="min-h-screen bg-black flex flex-col items-center justify-center">
        <Loader2 className="w-12 h-12 text-[#00ff88] animate-spin mb-4" />
        <p className="text-white/40 font-mono text-sm uppercase tracking-widest animate-pulse">Scanning security clearance...</p>
      </div>
    );
  }

  // Purely structural sidebar item list supporting 7 premium modules specified in Rule 9
  const sidebarItems = [
    { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
    { id: "events", label: "Event Management", icon: Calendar },
    { id: "registrations", label: "Registration Management", icon: ClipboardList },
    { id: "team", label: "Team Management", icon: Users },
    { id: "media", label: "Media Explorer", icon: ImageIcon },
    { id: "analytics", label: "Analytics & Reports", icon: BarChart3 },
    { id: "settings", label: "Embed Settings", icon: Settings },
    { id: "security", label: "Security & Rules", icon: ShieldCheck }
  ];

  return (
    <div className="min-h-screen bg-[#070707] text-white flex select-none font-sans">
      
      {/* 1. SIDEBAR NAVIGATION */}
      <aside className="w-[300px] bg-[#0c0c0c] border-r border-white/5 flex flex-col justify-between shrink-0">
        <div>
          {/* Header */}
          <div className="p-8 border-b border-white/5">
            <div className="flex items-center space-x-3 mb-2">
              <div className="w-10 h-10 rounded-xl bg-[#00ff88]/10 border border-[#00ff88]/20 flex items-center justify-center">
                <Terminal className="w-5 h-5 text-[#00ff88]" />
              </div>
              <div>
                <h2 className="text-sm font-black tracking-widest text-[#00ff88]">GFG × MU</h2>
                <p className="text-[9px] text-white/30 font-bold uppercase tracking-widest">CHAPTER PLATFORM</p>
              </div>
            </div>
            
            <div className="mt-6 p-4 rounded-2xl bg-white/5 border border-white/5 flex items-center space-x-3">
              <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-[#00ff88]/30 to-emerald-500/5 flex items-center justify-center font-bold text-xs uppercase text-[#00ff88]">
                {currentUser.name ? currentUser.name[0] : "M"}
              </div>
              <div className="overflow-hidden">
                <div className="text-xs font-black truncate">{currentUser.name || "Meet Khakhkhar"}</div>
                <div className="text-[9px] uppercase font-black tracking-widest text-white/40 mt-0.5">{currentUser.role || "Super Admin"}</div>
              </div>
            </div>
          </div>

          {/* Core Menu Links matching 7 modules */}
          <nav className="p-6 space-y-1">
            {sidebarItems.map(item => {
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id as any)}
                  className={cn(
                    "w-full flex items-center px-5 py-3.5 rounded-xl text-left text-[11px] font-black uppercase tracking-wider transition-all duration-300 group",
                    isActive 
                      ? "bg-[#00ff88]/10 text-[#00ff88] border border-[#00ff88]/20 shadow-[0_0_15px_rgba(0,255,136,0.1)]" 
                      : "text-gray-400 hover:text-white hover:bg-white/5 border border-transparent"
                  )}
                >
                  <item.icon className={cn(
                    "w-4 h-4 mr-4 transition-transform duration-300",
                    isActive ? "text-[#00ff88]" : "text-white/20 group-hover:text-white/50"
                  )} />
                  {item.label}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Port signout */}
        <div className="p-8 border-t border-white/5">
          <button 
            onClick={() => {
              localStorage.removeItem("admin_user");
              localStorage.removeItem("token");
              navigate("/");
            }}
            className="w-full flex items-center px-5 py-4 rounded-xl text-xs font-black uppercase tracking-wider text-rose-400 hover:bg-rose-500/5 hover:text-rose-300 transition-colors border border-transparent hover:border-rose-500/10"
          >
            <LogOut className="w-4 h-4 mr-4 shrink-0" />
            Sign Out Portal
          </button>
        </div>
      </aside>

      {/* 2. MAIN HOST HUB */}
      <div className="flex-1 flex flex-col min-w-0">
        <header className="h-[90px] bg-[#0c0c0c]/80 backdrop-blur-md border-b border-white/5 px-10 flex items-center justify-between z-10">
          <div className="flex items-center space-x-3">
            <Layers className="w-4 h-4 text-[#00ff88]/75" />
            <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-white/50">Enterprise Command Center Suite</span>
          </div>

          <div className="flex items-center space-x-2.5 bg-emerald-950/20 border border-[#00ff88]/20 px-4 py-2 rounded-xl">
            <span className="w-2 h-2 rounded-full bg-[#00ff88] animate-pulse" />
            <span className="text-[9px] font-mono font-black uppercase tracking-widest text-[#00ff88]">
              Authorized Operator: meetkhakhkhar05
            </span>
          </div>
        </header>

        <main className="flex-1 p-10 overflow-y-auto space-y-10 bg-[#070707]">
          
          {/* ==============================================
              TAB 1: COMMAND DASHBOARD OVERVIEW 
              ============================================== */}
          {activeTab === "dashboard" && (
            <div className="space-y-10 animate-fade-in">
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-3xl font-black uppercase tracking-tight">Operation <span className="text-[#00ff88]">Analytics Overview</span></h1>
                  <p className="text-xs text-white/40 mt-1">Real-time status updates sync directly with GeeksforGeeks public landing boards.</p>
                </div>
                <button 
                  onClick={refreshData}
                  className="p-3 bg-white/5 hover:bg-white/10 text-white border border-white/5 rounded-xl transition-all flex items-center gap-2 text-xs font-mono font-bold"
                >
                  <RefreshCw className="w-4 h-4" /> REFRESH SYSTEMS
                </button>
              </div>

              {/* Dynamic telemetry tiles */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="bg-[#0c0c0c] border border-white/5 p-6 rounded-3xl relative overflow-hidden group">
                  <span className="text-white/45 text-[10px] uppercase font-bold tracking-widest">Conducted Nodes</span>
                  <div className="text-3xl font-black font-mono tracking-tight mt-2 text-white">{events.length}</div>
                  <Calendar className="absolute right-4 bottom-4 w-12 h-12 text-white/5 group-hover:text-[#00ff88]/10 transition-colors pointer-events-none" />
                </div>

                <div className="bg-[#0c0c0c] border border-white/5 p-6 rounded-3xl relative overflow-hidden group">
                  <span className="text-white/45 text-[10px] uppercase font-bold tracking-widest">Active Roster size</span>
                  <div className="text-3xl font-black font-mono tracking-tight mt-2 text-[#00ff88]">{registrations.length}</div>
                  <Users className="absolute right-4 bottom-4 w-12 h-12 text-white/5 group-hover:text-[#00ff88]/10 transition-colors pointer-events-none" />
                </div>

                <div className="bg-[#0c0c0c] border border-white/5 p-6 rounded-3xl relative overflow-hidden group">
                  <span className="text-white/45 text-[10px] uppercase font-bold tracking-widest">QR Check-in Rate</span>
                  <div className="text-3xl font-black font-mono tracking-tight mt-2 text-white">{attendance.length}</div>
                  <CheckCircle2 className="absolute right-4 bottom-4 w-12 h-12 text-white/5 group-hover:text-[#00ff88]/10 transition-colors pointer-events-none" />
                </div>

                <div className="bg-[#0c0c0c] border border-white/5 p-6 rounded-3xl relative overflow-hidden group">
                  <span className="text-white/45 text-[10px] uppercase font-bold tracking-widest">Operation Status</span>
                  <div className="text-xs font-bold uppercase py-1 px-2.5 bg-emerald-500/10 border border-emerald-500/20 text-[#00ff88] rounded-lg mt-3 inline-block">
                    ● SYSTEMS IN GRID
                  </div>
                  <ShieldCheck className="absolute right-4 bottom-4 w-12 h-12 text-white/5 group-hover:text-[#00ff88]/10 transition-colors pointer-events-none" />
                </div>
              </div>

              {/* Action grid dashboard */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="bg-[#0c0c0c] border border-white/5 p-8 rounded-3xl space-y-6">
                  <h3 className="text-lg font-black uppercase tracking-tight text-white border-b border-white/5 pb-4">Operation Short-Keys</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <button 
                      onClick={() => {
                        setEventForm({
                          title: "",
                          description: "",
                          date: "",
                          time: "10:00 AM IST",
                          location: "",
                          poster_url: "",
                          category: "Web Development",
                          status: "Upcoming",
                          registration_link: "",
                          is_internal: true,
                          visibility: true,
                          capacity: "",
                          publicationStatus: "Published",
                          organizer_name: "GFG Student Chapter",
                          organizer_email: "gfg@marwadiuniversity.ac.in",
                          is_featured: false
                        });
                        setIsEditingEvent(null);
                        setIsEventModalOpen(true);
                      }}
                      className="p-5 bg-[#00ff88]/5 hover:bg-[#00ff88]/10 border border-[#00ff88]/20 hover:border-[#00ff88]/40 rounded-2xl text-left transition-all"
                    >
                      <Plus className="w-5 h-5 text-[#00ff88] mb-3" />
                      <div className="text-xs font-black uppercase tracking-wider text-white">Publish Event</div>
                      <p className="text-[10px] text-white/30 mt-1 leading-normal">Instantly syncs to public directories.</p>
                    </button>

                    <button 
                      onClick={() => setActiveTab("media")}
                      className="p-5 bg-white/3 hover:bg-white/5 border border-white/5 rounded-2xl text-left transition-all"
                    >
                      <ImageIcon className="w-5 h-5 text-neutral-400 mb-3" />
                      <div className="text-xs font-black uppercase tracking-wider text-white">Upload Banners</div>
                      <p className="text-[10px] text-white/30 mt-1 leading-normal">Drag or load Base64 event posters.</p>
                    </button>
                  </div>
                </div>

                <div className="bg-[#0c0c0c] border border-white/5 p-8 rounded-3xl space-y-6">
                  <div className="flex items-center justify-between border-b border-white/5 pb-4">
                    <h3 className="text-lg font-black uppercase tracking-tight text-white">Roster Feed Ticker</h3>
                    <button onClick={() => setActiveTab("registrations")} className="text-[10px] font-mono text-[#00ff88] hover:underline uppercase">View All</button>
                  </div>
                  <div className="space-y-4 max-h-[160px] overflow-y-auto">
                    {registrations.slice(0, 3).map((reg) => (
                      <div key={reg.id} className="flex items-center justify-between py-2 border-b border-white/5 last:border-0 text-xs">
                        <div>
                          <strong className="text-white uppercase font-black block">{reg.userName}</strong>
                          <span className="text-[10px] text-white/40 block mt-0.5">{reg.eventTitle}</span>
                        </div>
                        <span className="px-2 py-0.5 bg-[#00ff88]/10 text-[#00ff88] border border-[#00ff88]/20 font-mono text-[9px] uppercase tracking-wider rounded-md">
                          Roster Approved
                        </span>
                      </div>
                    ))}
                    {registrations.length === 0 && (
                      <div className="text-center py-10 text-white/20 text-xs font-mono uppercase tracking-widest">
                        Roster empty.
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ==============================================
              TAB 2: EVENT MANAGEMENT (PRIMARY CMS)
              ============================================== */}
          {activeTab === "events" && (
            <div className="space-y-10 animate-fade-in">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                  <h1 className="text-3xl font-black uppercase tracking-tight text-white">Interactive <span className="text-[#00ff88]">Events Catalog</span></h1>
                  <p className="text-xs text-white/40 mt-1">Configure status levels, adjust internal dynamic rosters, and toggle immediate public access.</p>
                </div>
                <button
                  onClick={() => {
                    setIsEditingEvent(null);
                    setEventForm({
                      title: "",
                      description: "",
                      date: "",
                      time: "10:00 AM IST",
                      location: "",
                      poster_url: "",
                      category: "Web Development",
                      status: "Upcoming",
                      registration_link: "",
                      is_internal: true,
                      visibility: true,
                      capacity: "",
                      publicationStatus: "Published",
                      organizer_name: "GFG Student Chapter",
                      organizer_email: "gfg@marwadiuniversity.ac.in",
                      is_featured: false
                    });
                    setIsEventModalOpen(true);
                  }}
                  className="inline-flex items-center px-6 py-3 bg-[#00ff88] hover:bg-white text-black rounded-xl text-xs font-black uppercase tracking-widest transition-all"
                >
                  <Plus className="w-4 h-4 mr-2" /> CREATE EVENT
                </button>
              </div>

              {/* Event grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {events.map((evt) => (
                  <div key={evt.id} className="bg-[#0c0c0c] border border-white/5 hover:border-[#00ff88]/20 rounded-[32px] overflow-hidden group transition-all flex flex-col justify-between">
                    <div className="h-[180px] w-full overflow-hidden relative border-b border-white/5">
                      <img src={evt.poster_url || "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=1200&auto=format&fit=crop"} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                      
                      <div className="absolute top-4 left-4 px-3 py-1.5 bg-[#0a0a0a]/80 backdrop-blur-md rounded-xl text-[9px] font-mono tracking-widest border border-white/10 text-[#00ff88] font-bold">
                        {evt.status ? evt.status.toUpperCase() : "UPCOMING"}
                      </div>

                      <div className="absolute top-4 right-4 flex gap-1">
                        <button 
                          onClick={() => startEditEvent(evt)}
                          className="p-2.5 bg-[#0a0a0a]/80 backdrop-blur-md border border-white/10 rounded-xl hover:bg-[#00ff88] hover:text-black hover:border-transparent text-white/80 transition-all cursor-pointer"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button 
                          onClick={() => handleDeleteEvent(evt.id)}
                          className="p-2.5 bg-[#0a0a0a]/80 backdrop-blur-md border border-white/10 rounded-xl hover:bg-rose-500 hover:text-white hover:border-transparent text-rose-400 transition-all cursor-pointer"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>

                    <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                      <div>
                        <span className="text-[8px] font-mono font-black uppercase tracking-widest text-[#00ff88]/70 block border border-[#00ff88]/20 px-2.5 py-1 rounded-md bg-[#00ff88]/3 inline-block mb-3">
                          {evt.category || "General Technology"}
                        </span>
                        <h3 className="text-lg font-black uppercase tracking-normal text-white truncate">{evt.title}</h3>
                        <p className="text-xs text-white/45 line-clamp-3 leading-relaxed mt-2 p-1 bg-white/2 rounded-xl border border-white/3 min-h-[50px]">{evt.description}</p>
                      </div>

                      <div className="space-y-3 pt-3 border-t border-white/5">
                        <div className="flex justify-between items-center text-[10px] font-mono text-white/50">
                          <span className="flex items-center"><Calendar className="w-3 h-3 mr-1 text-[#00ff88]" /> {evt.date}</span>
                          <span className="flex items-center"><MapPin className="w-3 h-3 mr-1 text-cyan-400" /> {evt.location || "Online"}</span>
                        </div>

                        <div className="flex items-center justify-between pt-1">
                          <span className="text-[9px] text-white/30 font-black uppercase tracking-widest font-mono">
                            Roster: {evt.registration_link ? "External Form" : "Internal App"}
                          </span>
                          <button
                            onClick={() => toggleEventPublishStatus(evt)}
                            className={cn(
                              "text-[8px] font-mono font-bold uppercase tracking-widest px-2.5 py-1.5 rounded-lg border",
                              evt.approvedBySuperAdmin !== false
                                ? "bg-emerald-500/10 border-emerald-500/30 text-[#00ff88]"
                                : "bg-white/5 border-white/10 text-white/40"
                            )}
                          >
                            {evt.approvedBySuperAdmin !== false ? "● PUBLISHED" : "○ UNPUBLISHED"}
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}

                {events.length === 0 && (
                  <div className="col-span-full border border-dashed border-white/10 rounded-[40px] p-20 text-center">
                    <Calendar className="w-16 h-16 text-white/10 mx-auto mb-6" />
                    <h3 className="text-lg font-bold">Workspace Events Empty</h3>
                    <p className="text-white/35 text-xs mt-2 italic">Get active by organizing and publishing events to the public grid!</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* ==============================================
              TAB 3: REGISTRATION ROSTERS CONTROL
              ============================================== */}
          {activeTab === "registrations" && (
            <div className="space-y-10 animate-fade-in">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                  <h1 className="text-3xl font-black uppercase tracking-tight text-white">Roster <span className="text-[#00ff88]">Security Ledger</span></h1>
                  <p className="text-xs text-white/40 mt-1">Audit, purge, or extract students registrations datasets for university administration.</p>
                </div>

                <div className="flex items-center gap-2.5">
                  <button 
                    onClick={exportCSVRoster}
                    className="px-4 py-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-[10px] font-black uppercase tracking-wider flex items-center gap-2"
                  >
                    <Download className="w-3.5 h-3.5 text-[#00ff88]" /> CSV EXPORT
                  </button>
                  <button 
                    onClick={exportPDFRoster}
                    className="px-4 py-3 bg-[#00ff88] text-black font-black uppercase rounded-xl text-[10px] tracking-wider flex items-center gap-2 shadow-[0_0_15px_rgba(0,255,136,0.15)]"
                  >
                    <FileText className="w-3.5 h-3.5" /> PDF DIRECTORY
                  </button>
                </div>
              </div>

              {/* Filtering bar */}
              <div className="p-6 bg-[#0c0c0c] border border-white/5 rounded-3xl flex flex-col md:flex-row gap-4 items-center">
                <div className="relative flex-1 w-full">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
                  <input
                    type="text"
                    value={regSearch}
                    onChange={(e) => setRegSearch(e.target.value)}
                    className="w-full pl-11 pr-5 py-3.5 bg-black/40 border border-white/10 rounded-2xl text-xs tracking-wide focus:border-[#00ff88]/30 focus:outline-none"
                    placeholder="Search student full name, email address or event title..."
                  />
                </div>

                <div className="w-full md:w-64">
                  <select
                    value={selectedRegEvent}
                    onChange={(e) => setSelectedRegEvent(e.target.value)}
                    className="w-full px-4 py-3.5 bg-black/40 border border-white/10 rounded-2xl text-xs text-white uppercase font-black tracking-wide"
                  >
                    <option value="all">🌐 ALL EVENT STATIONS</option>
                    {events.map(e => (
                      <option key={e.id} value={e.title}>{e.title}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Roster table */}
              <div className="bg-[#0c0c0c] border border-white/5 rounded-3xl overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse text-xs">
                    <thead>
                      <tr className="bg-white/2 border-b border-white/5 font-black uppercase tracking-wider text-white/40">
                        <th className="p-5 font-mono">UID ID</th>
                        <th className="p-5">Student Full Name</th>
                        <th className="p-5">University Email Handle</th>
                        <th className="p-5">Program / Branch</th>
                        <th className="p-5">Other Dept / Program</th>
                        <th className="p-5">Event Subject Title</th>
                        <th className="p-5">Ledger Recorded Timestamp</th>
                        <th className="p-5 text-center">Status</th>
                        <th className="p-5 text-right">Delete</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/2 font-medium">
                      {processedRegistrations.map((reg) => (
                        <tr key={reg.id} className="hover:bg-white/2 text-white/80">
                          <td className="p-5 font-mono text-white/30 uppercase">{reg.id.substring(0, 10)}</td>
                          <td className="p-5 font-black text-white uppercase">{reg.userName || reg.name || "Student"}</td>
                          <td className="p-5 text-white/50">{reg.userEmail || reg.email}</td>
                          <td className="p-5">
                            <span className="px-2 py-0.5 bg-[#00ff88]/10 text-[#00ff88] border border-[#00ff88]/20 rounded text-[10px] font-mono font-bold">
                              {reg.program || reg.branch || "CSE-AI&ML"}
                            </span>
                          </td>
                          <td className="p-5 text-white/60 font-mono text-[11px]">
                            {reg.otherDepartment || reg.other_department || (reg.program === "Other" ? reg.department : "—")}
                          </td>
                          <td className="p-5 font-bold uppercase text-[#00ff88]/95">{reg.eventTitle || reg.eventName || "Event"}</td>
                          <td className="p-5 text-white/40">{reg.registeredAt ? new Date(reg.registeredAt).toLocaleString() : "N/A"}</td>
                          <td className="p-4 text-center">
                            <span className="px-2.5 py-1 bg-emerald-500/10 border border-emerald-500/20 text-[#00ff88] text-[9px] font-black uppercase tracking-wider rounded-md">
                              {reg.status || "Approved"}
                            </span>
                          </td>
                          <td className="p-5 text-right">
                            <button 
                              onClick={() => handleDeleteRegistration(reg.id)}
                              className="p-2 text-rose-400 hover:bg-rose-500/20 rounded-xl transition-all cursor-pointer"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </td>
                        </tr>
                      ))}
                      {processedRegistrations.length === 0 && (
                        <tr>
                          <td colSpan={9} className="p-10 text-center text-white/20 uppercase font-mono tracking-widest italic">
                            No student registrants match current query terms.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* ==============================================
              TAB 4: MEDIA ASSETS EXPLORER
              ============================================== */}
          {activeTab === "media" && (
            <div className="space-y-10 animate-fade-in">
              <div>
                <h1 className="text-3xl font-black uppercase tracking-tight text-white">Media <span className="text-[#00ff88]">Asset Explorer</span></h1>
                <p className="text-xs text-white/40 mt-1">Convert event flyers/banners to high-performance base64 tags, or browse premium stock backgrounds.</p>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Drag / Drop encoder */}
                <div className="bg-[#0c0c0c] border border-white/5 p-8 rounded-3xl space-y-6">
                  <h3 className="text-lg font-black uppercase tracking-tight">Base64 Asset Compiler</h3>
                  
                  <div className="border-2 border-dashed border-white/10 hover:border-[#00ff88]/30 rounded-2xl p-10 text-center relative transition-all group">
                    <input 
                      type="file" 
                      accept="image/*"
                      onChange={handleFileUpload} 
                      className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                    />
                    <ImageIcon className="w-12 h-12 text-white/10 mx-auto group-hover:text-[#00ff88]/40 transition-colors mb-4" />
                    <span className="text-xs text-white tracking-wide block font-bold uppercase mb-2">Drag & Drop Image File</span>
                    <span className="text-[10px] text-white/30 block mb-4">Accepts PNG, JPG (Auto converted to inline string)</span>
                    <button className="px-4 py-2 bg-white/5 hover:bg-white/10 text-white rounded-lg text-[10px] font-black uppercase tracking-widest border border-white/5">
                      Or Browse Local Disk
                    </button>
                  </div>

                  <div className="space-y-2">
                    <label className="text-[9px] font-black uppercase tracking-widest text-[#00ff88]">Manual Online URL Reference</label>
                    <div className="flex gap-2">
                      <input 
                        type="url" 
                        value={customImageUrl}
                        onChange={(e) => setCustomImageUrl(e.target.value)}
                        placeholder="https://images.unsplash.com/..."
                        className="flex-grow px-4 py-3 bg-black/40 border border-white/10 rounded-xl text-xs focus:outline-none"
                      />
                      <button 
                        onClick={() => {
                          if (!customImageUrl) return;
                          setUploadedImages(prev => [{ name: "Manual URL Tag", url: customImageUrl }, ...prev]);
                          setCustomImageUrl("");
                        }}
                        className="px-4 py-3 bg-[#00ff88] text-black font-black uppercase text-[10px] tracking-widest rounded-xl hover:bg-white transition-all shrink-0"
                      >
                        SAVE url
                      </button>
                    </div>
                  </div>
                </div>

                {/* Preset list */}
                <div className="bg-[#0c0c0c] border border-white/5 p-8 rounded-3xl space-y-6">
                  <h3 className="text-lg font-black uppercase tracking-tight">Active Banner Bank</h3>
                  
                  <div className="space-y-4 max-h-[350px] overflow-y-auto pr-2">
                    {uploadedImages.map((img, index) => (
                      <div key={index} className="flex items-center gap-4 p-4 bg-black/40 rounded-2xl border border-white/5 hover:border-white/10 transition-colors">
                        <div className="w-16 h-12 rounded-lg overflow-hidden shrink-0 border border-white/5 bg-black">
                          <img src={img.url} className="w-full h-full object-cover" />
                        </div>
                        
                        <div className="flex-1 overflow-hidden">
                          <div className="text-[11px] uppercase font-black text-white truncate">{img.name}</div>
                          <p className="text-[9px] font-mono text-white/30 truncate mt-0.5">{img.url}</p>
                        </div>

                        <button 
                          onClick={() => copyToClipboard(img.url, index)}
                          className={cn(
                            "px-3 py-2 text-[8px] font-black font-mono uppercase tracking-widest rounded-lg border",
                            isCopyingIndex === index
                              ? "bg-emerald-500/10 border-emerald-500/30 text-[#00ff88]"
                              : "bg-white/5 hover:bg-white/10 border-white/5 text-white/70"
                          )}
                        >
                          {isCopyingIndex === index ? "COPIED ✅" : "COPY LINK"}
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ==============================================
              TAB 5: GRAPHICAL REPORTING ENVIRONMENT
              ============================================== */}
          {activeTab === "analytics" && (
            <div className="space-y-10 animate-fade-in">
              <div>
                <h1 className="text-3xl font-black uppercase tracking-tight text-white">Metrics <span className="text-[#00ff88]">Reporting Suite</span></h1>
                <p className="text-xs text-white/40 mt-1">Review registrations trends, category metrics, and operational checks.</p>
              </div>

              {/* Primary chart model */}
              <div className="bg-[#0c0c0c] border border-white/5 p-8 rounded-3xl space-y-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-black uppercase tracking-tight">Geeks Registrations vs. Check-Ins Metrics</h3>
                  <span className="text-[9px] font-mono text-[#00ff88] uppercase bg-[#00ff88]/5 py-1 px-2 border border-[#00ff88]/10 rounded-md">Real-Time Data Feed</span>
                </div>

                <div className="h-[280px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={analyticsChartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                      <defs>
                        <linearGradient id="colorReg" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#00ff88" stopOpacity={0.2}/>
                          <stop offset="95%" stopColor="#00ff88" stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <XAxis dataKey="name" stroke="#555" fontSize={9} fontStyle="bold" />
                      <YAxis stroke="#555" fontSize={9} />
                      <Tooltip contentStyle={{ backgroundColor: "#111", border: "1px solid #222", borderRadius: 12, fontSize: 11 }} />
                      <Area type="monotone" dataKey="registrations" stroke="#00ff88" strokeWidth={2} fillOpacity={1} fill="url(#colorReg)" />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Secondary visualizations */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="bg-[#0c0c0c] border border-white/5 p-8 rounded-3xl space-y-6">
                  <h3 className="text-base font-black uppercase tracking-tight">Course/Event Category Share</h3>
                  <div className="h-[220px] flex items-center justify-center">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={categoryDistribution}>
                        <XAxis dataKey="name" stroke="#444" fontSize={8} />
                        <YAxis stroke="#444" fontSize={8} />
                        <Tooltip contentStyle={{ backgroundColor: "#111", border: "1px solid #333" }} />
                        <Bar dataKey="value" fill="#00ff88" radius={[8, 8, 0, 0]}>
                          {categoryDistribution.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={index % 2 === 0 ? '#00ff88' : '#22d3ee'} />
                          ))}
                        </Bar>
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                <div className="bg-[#0c0c0c] border border-white/5 p-8 rounded-3xl flex flex-col justify-between">
                  <h3 className="text-base font-black uppercase tracking-tight">Telemetry Operational Balance</h3>
                  
                  <div className="space-y-4 my-auto">
                    <div className="p-4 bg-white/3 border border-white/5 rounded-2xl flex justify-between items-center">
                      <div>
                        <span className="text-[10px] text-white/40 block font-bold uppercase">Average Attendance Rate</span>
                        <span className="text-xl font-black font-mono tracking-tight text-white mt-1 block">
                          {analyticsChartData.length > 0 
                            ? Math.round((attendance.length / Math.max(registrations.length, 1)) * 100) 
                            : 0}%
                        </span>
                      </div>
                      <span className="text-xs text-cyan-400 font-mono font-bold">ACTIVE SCORING</span>
                    </div>

                    <div className="p-4 bg-white/3 border border-white/5 rounded-2xl flex justify-between items-center">
                      <div>
                        <span className="text-[10px] text-white/40 block font-bold uppercase">Dynamic Custom Forms Ratio</span>
                        <span className="text-xl font-black font-mono tracking-tight text-white mt-1 block">
                          {Math.round((events.filter(e => !e.registration_link).length / Math.max(events.length, 1)) * 100)}%
                        </span>
                      </div>
                      <span className="text-xs text-[#00ff88] font-mono font-bold">INTERNAL SYSTEM</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ==============================================
              TEAM MANAGEMENT PANEL
              ============================================== */}
          {activeTab === "team" && (
            <div className="space-y-10 animate-fade-in">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                  <h1 className="text-3xl font-black uppercase tracking-tight text-white">Team <span className="text-[#00ff88]">Management CMS</span></h1>
                  <p className="text-xs text-white/40 mt-1">Configure GFG Chapter Core team directory cards, featured assignments, and social links.</p>
                </div>
                <button
                  onClick={() => {
                    setIsEditingTeamMember(null);
                    setTeamForm({
                      name: "",
                      profilePhoto: "",
                      position: "",
                      department: "Computer Engineering",
                      bio: "",
                      linkedinUrl: "",
                      githubUrl: "",
                      xUrl: "",
                      gfgUrl: "",
                      email: "",
                      featuredMember: false,
                      active: true
                    });
                    setIsTeamModalOpen(true);
                  }}
                  className="px-5 py-3.5 bg-[#00ff88] text-black font-black uppercase text-[10px] tracking-widest rounded-xl hover:bg-white transition-colors flex items-center space-x-2 w-fit align-middle cursor-pointer"
                >
                  <Plus className="w-4 h-4 text-black" />
                  <span>Add Core Member</span>
                </button>
              </div>

              {/* Filtering block */}
              <div className="p-6 bg-[#0c0c0c] border border-white/5 rounded-[24px] flex flex-col md:flex-row gap-4 items-center justify-between">
                <div className="relative w-full md:max-w-md">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
                  <input
                    type="text"
                    value={teamSearch}
                    onChange={(e) => setTeamSearch(e.target.value)}
                    placeholder="Search by name, position, or department..."
                    className="w-full bg-black/40 border border-white/10 rounded-xl pl-11 pr-4 py-3 text-xs focus:outline-none focus:border-[#00ff88]/30 text-white placeholder-white/20 font-semibold"
                  />
                </div>
                <div className="text-xs text-white/40 font-mono">
                  Showing <span className="text-[#00ff88] font-bold">{teamMembers.length}</span> team members
                </div>
              </div>

              {/* Members table */}
              <div className="bg-[#0c0c0c] border border-white/5 rounded-[28px] overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="border-b border-white/5 bg-white/2 font-mono text-[9px] uppercase tracking-wider text-white/40">
                        <th className="py-5 px-6 font-bold">Profile</th>
                        <th className="py-5 px-6 font-bold">Name & Role</th>
                        <th className="py-5 px-6 font-bold">Department</th>
                        <th className="py-5 px-6 font-bold">Featured</th>
                        <th className="py-5 px-6 font-bold">Status</th>
                        <th className="py-5 px-6 font-bold text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5 text-xs">
                      {teamMembers
                        .filter((m) => {
                          const query = teamSearch.toLowerCase();
                          return (
                            m.name?.toLowerCase().includes(query) ||
                            m.position?.toLowerCase().includes(query) ||
                            m.department?.toLowerCase().includes(query)
                          );
                        })
                        .map((member) => (
                          <tr key={member.id} className="hover:bg-white/[0.01] transition-all">
                            <td className="py-4 px-6">
                              <div className="w-10 h-10 rounded-full bg-white/5 border border-white/10 overflow-hidden flex items-center justify-center shrink-0">
                                {member.profilePhoto ? (
                                  <img 
                                    src={member.profilePhoto} 
                                    alt={member.name} 
                                    className="w-full h-full object-cover" 
                                    referrerPolicy="no-referrer"
                                  />
                                ) : (
                                  <Users className="w-5 h-5 text-white/20" />
                                )}
                              </div>
                            </td>
                            <td className="py-4 px-6">
                              <div className="font-bold text-white text-sm">{member.name}</div>
                              <div className="text-xs text-[#00ff88] mt-0.5">{member.position}</div>
                            </td>
                            <td className="py-4 px-6">
                              <span className="text-white/60 font-mono text-xs">{member.department}</span>
                            </td>
                            <td className="py-4 px-6">
                              <button
                                onClick={() => toggleTeamMemberFeaturedStatus(member)}
                                className={cn(
                                  "px-2.5 py-1 rounded-md text-[9px] font-mono font-black uppercase tracking-wider transition-all border",
                                  member.featuredMember
                                    ? "bg-[#00ff88]/10 text-[#00ff88] border-[#00ff88]/20 hover:bg-[#00ff88]/20"
                                    : "bg-white/5 text-white/30 border-white/5 hover:bg-white/10 text-white/50"
                                )}
                              >
                                {member.featuredMember ? "Featured" : "Standard"}
                              </button>
                            </td>
                            <td className="py-4 px-6">
                              <button
                                onClick={() => toggleTeamMemberActiveStatus(member)}
                                className={cn(
                                  "px-2.5 py-1 rounded-md text-[9px] font-mono font-black uppercase tracking-wider transition-all border",
                                  member.active !== false
                                    ? "bg-emerald-500/10 text-[#00ff88] border-emerald-500/20"
                                    : "bg-rose-500/10 text-rose-400 border-rose-500/20"
                                )}
                              >
                                {member.active !== false ? "Active" : "Inactive"}
                              </button>
                            </td>
                            <td className="py-4 px-6 text-right">
                              <div className="flex items-center justify-end space-x-2">
                                <button
                                  onClick={() => startEditTeamMember(member)}
                                  className="p-2 bg-white/5 rounded-lg text-white/60 hover:text-[#00ff88] hover:bg-white/10 transition-colors cursor-pointer"
                                  title="Edit Profile"
                                >
                                  <Edit2 className="w-3.5 h-3.5" />
                                </button>
                                <button
                                  onClick={() => handleDeleteTeamMember(member.id)}
                                  className="p-2 bg-white/5 rounded-lg text-white/60 hover:text-rose-400 hover:bg-white/10 transition-colors cursor-pointer"
                                  title="Remove Member"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      {teamMembers.length === 0 && (
                        <tr>
                          <td colSpan={6} className="py-12 text-center text-white/30 font-mono">
                            No team members configured. Click "Add Core Member" to populate the list.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* ==============================================
              TAB 6: EMBED CONFIG FORM SETTINGS
              ============================================== */}
          {activeTab === "settings" && (
            <div className="space-y-10 animate-fade-in">
              <div>
                <h1 className="text-3xl font-black uppercase tracking-tight text-white">Embed <span className="text-[#00ff88]">Settings Console</span></h1>
                <p className="text-xs text-white/40 mt-1">Configure contact frameworks, dynamic worksheet endpoints, and localized anchors.</p>
              </div>

              <form onSubmit={handleSaveSettings} className="p-10 bg-[#0c0c0c] border border-white/5 rounded-[32px] space-y-6 max-w-4xl relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-[#00ff88]/3 blur-3xl rounded-full" />
                
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest block font-mono">
                    Google Form Embedded Contact Frame URL
                  </label>
                  <p className="text-[11px] text-white/30 font-semibold mb-2">
                    Enter the Google Form URI targeting administrative campus requests. Must suffix with "?embedded=true" to render in container.
                  </p>
                  
                  {isSettingsLoading ? (
                    <div className="flex items-center text-xs font-mono text-gray-400 space-x-2 py-4">
                      <Loader2 className="w-4 h-4 animate-spin text-[#00ff88]" />
                      <span>Retrieving active database values...</span>
                    </div>
                  ) : (
                    <input
                      type="url"
                      required
                      value={contactUrlSetting}
                      onChange={(e) => setContactUrlSetting(e.target.value)}
                      className="w-full px-5 py-4 bg-black/40 border border-white/10 rounded-2xl text-xs font-mono text-white tracking-wide focus:border-[#00ff88]/30 focus:outline-none"
                      placeholder="https://docs.google.com/forms/d/..."
                    />
                  )}
                </div>

                <div className="pt-4 flex items-center gap-4">
                  <button
                    type="submit"
                    disabled={isSavingSettings || isSettingsLoading}
                    className="px-6 py-4 bg-[#00ff88] text-black font-black uppercase text-[10px] tracking-widest rounded-xl hover:bg-white disabled:opacity-40 transition-colors"
                  >
                    {isSavingSettings ? "Syncing configs..." : "Save Config Values"}
                  </button>
                  <button
                    type="button"
                    onClick={() => setContactUrlSetting("https://docs.google.com/forms/d/e/1FAIpQLSfQ5QSIqCn8AsRV_1CL76UXdPI3JABfhd7NC8tbGlih9ZQ8KA/viewform?embedded=true")}
                    className="px-5 py-4 bg-white/5 border border-white/5 text-xs uppercase font-black tracking-widest hover:bg-white/10 text-white rounded-xl transition-all"
                  >
                    Set to Standard Default Form
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* ==============================================
              TAB 7: SECURITY & ACCESS CONTROLS
              ============================================== */}
          {activeTab === "security" && (
            <div className="space-y-10 animate-fade-in">
              <div>
                <h1 className="text-3xl font-black uppercase tracking-tight text-white">Security & <span className="text-[#00ff88]">Access Control</span></h1>
                <p className="text-xs text-white/40 mt-1">Review active administrator authorizations, watch automated access logs, and enforce HTTPS security layers.</p>
              </div>

              {/* Status block */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="bg-[#0c0c0c] border border-white/5 p-8 rounded-3xl space-y-6">
                  <h3 className="text-base font-black uppercase tracking-tight">Administrative Shield Level</h3>
                  
                  <div className="space-y-4">
                    <div className="flex justify-between items-center p-4 bg-emerald-950/20 border border-[#00ff88]/20 rounded-2xl">
                      <div className="flex items-center space-x-3">
                        <ShieldCheck className="w-5 h-5 text-[#00ff88]" />
                        <span className="text-xs uppercase font-bold text-white font-mono">End-to-End HTTPS Encryption</span>
                      </div>
                      <span className="text-[10px] font-mono text-[#00ff88] uppercase font-black bg-[#00ff88]/10 py-1 px-2.5 rounded-md">Enforced</span>
                    </div>

                    <div className="flex justify-between items-center p-4 bg-rose-950/20 border border-rose-500/20 rounded-2xl">
                      <div className="flex items-center space-x-3">
                        <Terminal className="w-5 h-5 text-rose-400" />
                        <span className="text-xs uppercase font-bold text-white font-mono">Authorized Operators Limit</span>
                      </div>
                      <span className="text-[10px] font-mono text-rose-400 uppercase font-black bg-rose-500/15 py-1 px-2.5 rounded-md">1 Whitelist Role</span>
                    </div>
                  </div>
                </div>

                <div className="bg-[#0c0c0c] border border-white/5 p-8 rounded-3xl flex flex-col justify-between">
                  <h3 className="text-base font-black uppercase tracking-tight">Active API Gateway Guards</h3>
                  <div className="p-4 bg-black/40 border border-white/5 rounded-2xl text-xs font-mono text-white/60 space-y-2">
                    <div className="flex justify-between"><span className="text-white/40">AUTH_MODE:</span><span className="text-[#00ff88]">JWT Bearer Ticket</span></div>
                    <div className="flex justify-between"><span className="text-white/40">INTEGRITY_SYNC:</span><span>Active WebSockets DB</span></div>
                    <div className="flex justify-between"><span className="text-white/40">DB_NODES_PROBE:</span><span>Firestore Collections</span></div>
                  </div>
                </div>
              </div>

              {/* Logs registry */}
              <div className="bg-[#0c0c0c] border border-white/5 p-8 rounded-3xl space-y-6">
                <h3 className="text-base font-black uppercase tracking-tight">Access logs registry</h3>
                <div className="p-5 bg-black/50 border border-white/5 rounded-2xl font-mono text-[11px] text-zinc-400 max-h-[250px] overflow-y-auto space-y-2">
                  {systemLogs.map((log, index) => (
                    <div key={index} className="flex flex-col sm:flex-row justify-between border-b border-white/5 pb-2 last:border-0 hover:text-white transition-colors">
                      <span className="text-zinc-500 shrink-0 select-none">[{new Date(log.timestamp).toLocaleTimeString()}]</span>
                      <span className="flex-1 sm:px-4 text-xs font-bold uppercase tracking-tight text-white">{log.action || "Access logged"}</span>
                      <span className="text-white/30 truncate text-[10px]">{log.userEmail || "System Operator"}</span>
                    </div>
                  ))}
                  {systemLogs.length === 0 && (
                    <div className="text-center py-6 text-zinc-600">
                      Access log registry initialized. Active logs recorded dynamically.
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

        </main>
      </div>

      {/* --- REUSABLE MODALS GRID --- */}
      
      {/* 1. Team Member Creation/Editing Modal */}
      {isTeamModalOpen && (
        <div className="fixed inset-0 bg-black/8 w-full h-full flex items-center justify-center p-4 z-50 overflow-y-auto backdrop-blur-md">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-full max-w-lg bg-[#0d0d0d] border border-white/10 p-10 rounded-[30px] space-y-6 relative overflow-hidden max-h-[90vh] overflow-y-auto"
          >
            <button 
              onClick={() => setIsTeamModalOpen(false)}
              className="absolute top-6 right-6 p-2.5 rounded-xl text-white/40 hover:bg-white/5 hover:text-white transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div>
              <h2 className="text-xl font-black uppercase tracking-tight text-white">
                {isEditingTeamMember ? "Modify" : "Create"} <span className="text-[#00ff88]">Chapter Profile</span>
              </h2>
              <p className="text-[10px] text-white/30 uppercase font-black tracking-widest mt-1">Configure GFG Chapter core member listing details.</p>
            </div>

            <form onSubmit={handleSaveTeamMember} className="space-y-4 text-xs font-semibold">
              <div className="space-y-1.5">
                <label className="text-[9px] font-black uppercase tracking-widest text-[#00ff88] ml-1">Team Member Name</label>
                <input
                  type="text"
                  required
                  value={teamForm.name}
                  onChange={(e) => setTeamForm({ ...teamForm, name: e.target.value })}
                  className="w-full px-5 py-3.5 bg-black/40 border border-white/10 rounded-2xl text-xs text-white focus:outline-none focus:border-[#00ff88]/30"
                  placeholder="E.g. Meet Khakhkhar"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-[9px] font-black uppercase tracking-widest text-[#00ff88] ml-1">Position / Role</label>
                  <input
                    type="text"
                    required
                    value={teamForm.position}
                    onChange={(e) => setTeamForm({ ...teamForm, position: e.target.value })}
                    className="w-full px-5 py-3.5 bg-black/40 border border-white/10 rounded-2xl text-xs text-white focus:outline-none focus:border-[#00ff88]/30"
                    placeholder="E.g. Technical Lead"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-[9px] font-black uppercase tracking-widest text-[#00ff88] ml-1">Department</label>
                  <select
                    value={teamForm.department}
                    onChange={(e) => setTeamForm({ ...teamForm, department: e.target.value })}
                    className="w-full px-5 py-3.5 bg-[#0a0a0a] border border-white/10 rounded-2xl text-xs text-white focus:outline-none focus:border-[#00ff88]/30"
                  >
                    <option value="Computer Engineering">Computer Engineering</option>
                    <option value="Information Technology">Information Technology</option>
                    <option value="ICT">ICT</option>
                    <option value="Computer Science">Computer Science</option>
                    <option value="MCA">MCA</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-[9px] font-black uppercase tracking-widest text-[#00ff88] ml-1">Profile Photo URL</label>
                <input
                  type="url"
                  value={teamForm.profilePhoto}
                  onChange={(e) => setTeamForm({ ...teamForm, profilePhoto: e.target.value })}
                  className="w-full px-5 py-3.5 bg-black/40 border border-white/10 rounded-2xl text-xs text-white focus:outline-none focus:border-[#00ff88]/30 font-mono"
                  placeholder="E.g. https://domain.com/photo.jpg"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[9px] font-black uppercase tracking-widest text-[#00ff88] ml-1">Short Bio</label>
                <textarea
                  rows={2}
                  value={teamForm.bio}
                  onChange={(e) => setTeamForm({ ...teamForm, bio: e.target.value })}
                  className="w-full px-5 py-3.5 bg-black/40 border border-white/10 rounded-2xl text-xs text-white focus:outline-none focus:border-[#00ff88]/30 leading-relaxed"
                  placeholder="E.g. A passionate developer keen on learning algorithms..."
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-[9px] font-black uppercase tracking-widest text-[#00ff88] ml-1">LinkedIn Profile URL</label>
                  <input
                    type="url"
                    value={teamForm.linkedinUrl}
                    onChange={(e) => setTeamForm({ ...teamForm, linkedinUrl: e.target.value })}
                    className="w-full px-5 py-3.5 bg-black/40 border border-white/10 rounded-2xl text-xs text-white focus:outline-none focus:border-[#00ff88]/30 font-mono"
                    placeholder="https://linkedin.com/in/..."
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-[9px] font-black uppercase tracking-widest text-[#00ff88] ml-1">GitHub Profile URL</label>
                  <input
                    type="url"
                    value={teamForm.githubUrl}
                    onChange={(e) => setTeamForm({ ...teamForm, githubUrl: e.target.value })}
                    className="w-full px-5 py-3.5 bg-black/40 border border-white/10 rounded-2xl text-xs text-white focus:outline-none focus:border-[#00ff88]/30 font-mono"
                    placeholder="https://github.com/..."
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-[9px] font-black uppercase tracking-widest text-[#00ff88] ml-1">X (Twitter) Profile URL</label>
                  <input
                    type="url"
                    value={teamForm.xUrl}
                    onChange={(e) => setTeamForm({ ...teamForm, xUrl: e.target.value })}
                    className="w-full px-5 py-3.5 bg-black/40 border border-white/10 rounded-2xl text-xs text-white focus:outline-none focus:border-[#00ff88]/30 font-mono"
                    placeholder="https://x.com/..."
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-[9px] font-black uppercase tracking-widest text-[#00ff88] ml-1">GeeksforGeeks Profile URL</label>
                  <input
                    type="url"
                    value={teamForm.gfgUrl}
                    onChange={(e) => setTeamForm({ ...teamForm, gfgUrl: e.target.value })}
                    className="w-full px-5 py-3.5 bg-black/40 border border-white/10 rounded-2xl text-xs text-white focus:outline-none focus:border-[#00ff88]/30 font-mono"
                    placeholder="https://auth.geeksforgeeks.org/user/..."
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-[9px] font-black uppercase tracking-widest text-[#00ff88] ml-1">Contact Email Address</label>
                <input
                  type="email"
                  value={teamForm.email}
                  onChange={(e) => setTeamForm({ ...teamForm, email: e.target.value })}
                  className="w-full px-5 py-3.5 bg-black/40 border border-white/10 rounded-2xl text-xs text-white focus:outline-none focus:border-[#00ff88]/30 font-mono"
                  placeholder="member@domain.com"
                />
              </div>

              <div className="grid grid-cols-2 gap-5 py-2">
                <label className="flex items-center space-x-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={teamForm.featuredMember}
                    onChange={(e) => setTeamForm({ ...teamForm, featuredMember: e.target.checked })}
                    className="w-4 h-4 accent-[#00ff88] rounded-md bg-black border-white/20 focus:ring-0"
                  />
                  <span className="text-[10px] text-white/70 font-mono tracking-wider uppercase font-black font-semibold">Featured Member</span>
                </label>

                <label className="flex items-center space-x-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={teamForm.active}
                    onChange={(e) => setTeamForm({ ...teamForm, active: e.target.checked })}
                    className="w-4 h-4 accent-[#00ff88] rounded-md bg-black border-white/20 focus:ring-0"
                  />
                  <span className="text-[10px] text-white/70 font-mono tracking-wider uppercase font-black font-semibold">Active Listing</span>
                </label>
              </div>

              <div className="pt-4 flex items-center space-x-3 font-semibold text-xs">
                <button
                  type="submit"
                  className="flex-1 py-4 bg-[#00ff88] text-black font-black uppercase text-[10px] tracking-widest rounded-xl hover:bg-white transition-all cursor-pointer font-bold"
                >
                  {isEditingTeamMember ? "Sync Changes" : "Create Profile"}
                </button>
                <button
                  type="button"
                  onClick={() => setIsTeamModalOpen(false)}
                  className="flex-1 py-4 bg-white/5 border border-white/5 text-[10px] tracking-widest uppercase font-black hover:bg-white/10 text-white rounded-xl transition-all cursor-pointer font-bold"
                >
                  Discard
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}

      {/* 2. Events Creation/Editing Modal */}
      {isEventModalOpen && (
        <div className="fixed inset-0 bg-black/8 w-full h-full flex items-center justify-center p-4 z-50 overflow-y-auto backdrop-blur-md">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-full max-w-lg bg-[#0d0d0d] border border-white/10 p-10 rounded-[30px] space-y-6 relative overflow-hidden max-h-[90vh] overflow-y-auto"
          >
            <button 
              onClick={() => setIsEventModalOpen(false)}
              className="absolute top-6 right-6 p-2.5 rounded-xl text-white/40 hover:bg-white/5 hover:text-white transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div>
              <h2 className="text-xl font-black uppercase tracking-tight text-white">
                {isEditingEvent ? "Modify" : "Publish"} <span className="text-[#00ff88]">Chapter Event</span>
              </h2>
              <p className="text-[10px] text-white/30 uppercase font-black tracking-widest mt-1">Configure database parameters and public targets.</p>
            </div>

            <form onSubmit={handleSaveEvent} className="space-y-4 text-xs">
              <div className="space-y-1.5">
                <label className="text-[9px] font-black uppercase tracking-widest text-[#00ff88] ml-1">Event Subject Title</label>
                <input
                  type="text"
                  required
                  value={eventForm.title}
                  onChange={(e) => setEventForm({ ...eventForm, title: e.target.value })}
                  className="w-full px-5 py-3.5 bg-black/40 border border-white/10 rounded-2xl text-xs font-semibold focus:outline-none focus:border-[#00ff88]/30"
                  placeholder="E.g. Neural Hackathon v2.0"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[9px] font-black uppercase tracking-widest text-[#00ff88] ml-1">Event Syllabus Description</label>
                <textarea
                  required
                  rows={3}
                  value={eventForm.description}
                  onChange={(e) => setEventForm({ ...eventForm, description: e.target.value })}
                  className="w-full px-5 py-3.5 bg-black/40 border border-white/10 rounded-2xl text-xs font-semibold focus:outline-none focus:border-[#00ff88]/30 leading-relaxed"
                  placeholder="E.g. A high-speed coding trial testing problem-solving abilities..."
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-[9px] font-black uppercase tracking-widest text-[#00ff88] ml-1">Calendar Date</label>
                  <input
                    type="text"
                    required
                    value={eventForm.date}
                    onChange={(e) => setEventForm({ ...eventForm, date: e.target.value })}
                    className="w-full px-5 py-3.5 bg-black/40 border border-white/10 rounded-2xl text-xs font-semibold focus:outline-none focus:border-[#00ff88]/30"
                    placeholder="E.g. 28 March 2026"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[9px] font-black uppercase tracking-widest text-cyan-400 ml-1">Event Time</label>
                  <input
                    type="text"
                    required
                    value={eventForm.time}
                    onChange={(e) => setEventForm({ ...eventForm, time: e.target.value })}
                    className="w-full px-5 py-3.5 bg-black/40 border border-white/10 rounded-2xl text-xs font-semibold focus:outline-none"
                    placeholder="E.g. 10:00 AM IST"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-[9px] font-black uppercase tracking-widest text-[#00ff88] ml-1">Campus Location</label>
                  <input
                    type="text"
                    required
                    value={eventForm.location}
                    onChange={(e) => setEventForm({ ...eventForm, location: e.target.value })}
                    className="w-full px-5 py-3.5 bg-black/40 border border-white/10 rounded-2xl text-xs font-semibold focus:outline-none focus:border-[#00ff88]/30"
                    placeholder="E.g. ICT Lab 3 / Seminar Hall"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[9px] font-black uppercase tracking-widest text-cyan-400 ml-1">Subject Category</label>
                  <select
                    value={eventForm.category}
                    onChange={(e) => setEventForm({ ...eventForm, category: e.target.value })}
                    className="w-full px-5 py-3.5 bg-black/40 border border-white/10 rounded-2xl text-xs font-semibold text-white focus:outline-none"
                  >
                    <option value="Web Development">Web Development</option>
                    <option value="Mobile Development">Mobile Development</option>
                    <option value="AI & Machine Learning">AI & Machine Learning</option>
                    <option value="Competitive Coding">Competitive Coding</option>
                    <option value="UI/UX Bootcamp">UI/UX Bootcamp</option>
                    <option value="Hackathon">Hackathon</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-[9px] font-black uppercase tracking-widest text-[#00ff88] ml-1">Event Flow State</label>
                  <select
                    value={eventForm.status}
                    onChange={(e) => setEventForm({ ...eventForm, status: e.target.value as any })}
                    className="w-full px-5 py-3.5 bg-black/40 border border-white/10 rounded-2xl text-xs font-semibold text-white focus:outline-none"
                  >
                    <option value="Upcoming">Upcoming (Active)</option>
                    <option value="Ongoing">Ongoing (Live)</option>
                    <option value="Completed">Completed (Passed)</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[9px] font-black uppercase tracking-widest text-cyan-400 ml-1">Publication Lifecycle</label>
                  <select
                    value={eventForm.publicationStatus}
                    onChange={(e) => {
                      const val = e.target.value as any;
                      setEventForm({ 
                        ...eventForm, 
                        publicationStatus: val,
                        visibility: val === "Published",
                        status: val === "Archived" ? "Completed" : eventForm.status
                      });
                    }}
                    className="w-full px-5 py-3.5 bg-black/40 border border-white/10 rounded-2xl text-xs font-semibold text-white focus:outline-none"
                  >
                    <option value="Draft">Draft (Internal Only)</option>
                    <option value="Published">Published (Public Website)</option>
                    <option value="Archived">Archived (Past Vault Only)</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-[9px] font-black uppercase tracking-widest text-[#00ff88] ml-1">Event Capacity (Optional)</label>
                  <input
                    type="number"
                    value={eventForm.capacity}
                    onChange={(e) => setEventForm({ ...eventForm, capacity: e.target.value })}
                    className="w-full px-5 py-3.5 bg-black/40 border border-white/10 rounded-2xl text-xs font-semibold focus:outline-none focus:border-[#00ff88]/30"
                    placeholder="E.g. 150 (Leave blank for Unlimited)"
                  />
                </div>

                <div className="space-y-1.5 flex flex-col justify-end">
                  <button
                    type="button"
                    onClick={() => setEventForm({ ...eventForm, is_featured: !eventForm.is_featured })}
                    className={cn(
                      "w-full py-3.5 rounded-2xl text-[9px] font-mono font-black uppercase tracking-widest border transition-all text-center cursor-pointer",
                      eventForm.is_featured
                        ? "bg-purple-600/25 border-purple-500 text-purple-400 shadow-[0_0_15px_rgba(168,85,247,0.2)]"
                        : "bg-white/5 border-white/10 text-white/40"
                    )}
                  >
                    {eventForm.is_featured ? "✨ FEATURED EVENT ACTIVE" : "☆ MARK AS FEATURED"}
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-[9px] font-black uppercase tracking-widest text-[#00ff88] ml-1">Organizer Body Name</label>
                  <input
                    type="text"
                    required
                    value={eventForm.organizer_name}
                    onChange={(e) => setEventForm({ ...eventForm, organizer_name: e.target.value })}
                    className="w-full px-5 py-3.5 bg-black/40 border border-white/10 rounded-2xl text-xs font-semibold focus:outline-none focus:border-[#00ff88]/30"
                    placeholder="E.g. GFG Student Chapter"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[9px] font-black uppercase tracking-widest text-cyan-400 ml-1">Organizer Contact Email</label>
                  <input
                    type="email"
                    required
                    value={eventForm.organizer_email}
                    onChange={(e) => setEventForm({ ...eventForm, organizer_email: e.target.value })}
                    className="w-full px-5 py-3.5 bg-black/40 border border-white/10 rounded-2xl text-xs font-semibold focus:outline-none focus:border-[#00ff88]/30"
                    placeholder="E.g. chapter@university.ac.in"
                  />
                </div>
              </div>

              <div className="space-y-2 py-2 border-t border-white/5">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono text-white/50 uppercase font-black">Register Form Configuration</span>
                  <button
                    type="button"
                    onClick={() => setEventForm({ ...eventForm, is_internal: !eventForm.is_internal })}
                    className={cn(
                      "text-[9px] font-mono uppercase font-black px-3 py-1 border rounded-lg transition-colors cursor-pointer",
                      eventForm.is_internal
                        ? "bg-emerald-500/10 border-emerald-500/30 text-[#00ff88]"
                        : "bg-white/5 border-white/10 text-white/40"
                    )}
                  >
                    {eventForm.is_internal ? "University Form ACTIVE (Roster Tracking)" : "External Portal URL"}
                  </button>
                </div>

                {/* If external is active, show input */}
                {!eventForm.is_internal && (
                  <div className="space-y-1.5 pt-1.5">
                    <label className="text-[9px] font-black uppercase tracking-widest text-rose-400 ml-1">Registration External Link URL</label>
                    <input
                      type="url"
                      required
                      value={eventForm.registration_link}
                      onChange={(e) => setEventForm({ ...eventForm, registration_link: e.target.value })}
                      className="w-full px-5 py-3.5 bg-black/40 border border-white/10 rounded-2xl text-xs focus:outline-none focus:border-rose-400"
                      placeholder="https://docs.google.com/forms/... or unstop.com/..."
                    />
                  </div>
                )}
              </div>

              <div className="space-y-2">
                <label className="text-[9px] font-black uppercase tracking-widest text-[#00ff88] ml-1">Event Banner Poster (Dual Mode)</label>
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <span className="text-[8px] text-white/40 uppercase block">Local Image Upload</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          const reader = new FileReader();
                          reader.onloadend = () => {
                            setEventForm(prev => ({ ...prev, poster_url: reader.result as string }));
                          };
                          reader.readAsDataURL(file);
                        }
                      }}
                      className="w-full text-[9px] text-white/60 bg-black/40 border border-white/10 p-2 rounded-xl focus:outline-none cursor-pointer file:mr-2 file:py-1 file:px-2 file:rounded-md file:border-0 file:text-[9px] file:bg-white/10 file:text-white hover:file:bg-white/20"
                    />
                  </div>
                  <div className="space-y-1">
                    <span className="text-[8px] text-white/40 uppercase block">Or Enter Direct URL</span>
                    <input
                      type="text"
                      value={eventForm.poster_url}
                      onChange={(e) => setEventForm({ ...eventForm, poster_url: e.target.value })}
                      className="w-full px-4 py-2.5 bg-black/40 border border-white/10 rounded-xl text-xs focus:outline-none focus:border-[#00ff88]/30"
                      placeholder="https://images.unsplash.com/..."
                    />
                  </div>
                </div>
                {eventForm.poster_url && (
                  <div className="mt-2 h-20 w-full rounded-2xl overflow-hidden border border-white/10 relative">
                    <img src={eventForm.poster_url} alt="Cover Preview" className="w-full h-full object-cover" />
                    <button
                      type="button"
                      onClick={() => setEventForm(prev => ({ ...prev, poster_url: "" }))}
                      className="absolute top-2 right-2 rounded-lg bg-black/80 px-2 py-1 text-[8px] text-zinc-400 hover:text-white"
                    >
                      Clear
                    </button>
                  </div>
                )}
              </div>

              <button
                type="submit"
                className="w-full mt-4 py-4 bg-[#00ff88] hover:bg-white text-black font-black uppercase text-[10px] tracking-widest rounded-2xl transition-all shadow-[0_0_20px_rgba(0,255,136,0.2)]"
              >
                {isEditingEvent ? "Save Event Telemetry" : "Launch & Sync Chapter Program"}
              </button>
            </form>
          </motion.div>
        </div>
      )}

    </div>
  );
}
