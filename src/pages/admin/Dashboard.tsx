import { motion, AnimatePresence } from "motion/react";
import { 
  Users, User, LogIn, FileText, Settings, LogOut, Plus, Search, Filter, 
  Download, Trash2, Edit2, Check, X, Calendar, CheckCircle2, Loader2, 
  BarChart3, Database, Sparkles, ExternalLink, RefreshCw, Eye, ShieldAlert,
  Terminal, ShieldCheck, HelpCircle, Bell, Award, Share2, Phone, Mail, Globe, MapPin, Layers, Flame,
  ChevronLeft, ChevronRight, ArrowUpDown
} from "lucide-react";
import { useState, useEffect, FormEvent, useMemo } from "react";
import { cn } from "@/src/lib/utils";
import { useNavigate } from "react-router-dom";
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import AdminAnalytics from "../../components/AdminAnalytics";
import { signInWithGoogleSheets, syncStudentsToSheet, syncAttendanceToSheet } from "../../services/googleSheetsService";

const extractSpreadsheetId = (input: string) => {
  if (input.includes("docs.google.com/spreadsheets")) {
    const matches = input.match(/\/d\/([a-zA-Z0-9-_]+)/);
    return matches ? matches[1] : input;
  }
  return input;
};


export default function Dashboard() {
  const navigate = useNavigate();
  
  // Current user / auth simulation state
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<
    "analytics" | "users" | "events" | "certificates" | "announcements" | "cms" | "logs" | "firestore-view" | "sheets"
  >("analytics");

  // Database lists
  const [users, setUsers] = useState<any[]>([]);
  const [events, setEvents] = useState<any[]>([]);
  const [announcements, setAnnouncements] = useState<any[]>([]);
  const [certificates, setCertificates] = useState<any[]>([]);
  const [attendance, setAttendance] = useState<any[]>([]);
  const [systemLogs, setSystemLogs] = useState<any[]>([]);

  // Search & Filters
  const [userSearch, setUserSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("");
  const [eventSearch, setEventSearch] = useState("");
  
  // Advanced Student Filters & Sorting
  const [branchFilter, setBranchFilter] = useState("");
  const [semesterFilter, setSemesterFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [sortKey, setSortKey] = useState<"name" | "enrollment" | "createdAt" | "points">("name");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  // Student details slide-over drawer
  const [selectedStudentForDrawer, setSelectedStudentForDrawer] = useState<any>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  // Modals / Editing States
  const [isUserModalOpen, setIsUserModalOpen] = useState(false);
  const [isEditingUser, setIsEditingUser] = useState<any>(null);
  const [userForm, setUserForm] = useState({
    name: "",
    email: "",
    mobile: "",
    enrollmentNumber: "",
    department: "Computer Science & Engineering",
    yearName: "3rd Year",
    role: "student",
    password: "student123",
    permissions: [] as string[]
  });

  const [isEventModalOpen, setIsEventModalOpen] = useState(false);
  const [isEditingEvent, setIsEditingEvent] = useState<any>(null);
  const [eventForm, setEventForm] = useState({
    title: "",
    description: "",
    date: "",
    location: "",
    poster_url: "",
    registration_link: ""
  });

  const [isAnnModalOpen, setIsAnnModalOpen] = useState(false);
  const [annForm, setAnnForm] = useState({
    title: "",
    content: "",
    category: "Notice"
  });

  const [isCertModalOpen, setIsCertModalOpen] = useState(false);
  const [certForm, setCertForm] = useState({
    userId: "",
    eventName: "Neural Hackathon v2.0",
    studentName: "",
    pdfUrl: "#",
    hash: "",
    skills: "Data Structures, Algorithms",
    issueDate: new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
    studentEmail: ""
  });

  // Dynamic Landing CMS fields
  const [cmsForm, setCmsForm] = useState({
    headline: "SOLVING CHALLENGES ● FOSTERING INNOVATION",
    tagline: "GeeksforGeeks x Marwadi University",
    subtext: "Empowering developers through rigorous data structures, competitive challenges, algorithm engineering, and enterprise hackathons.",
    whatsappGroup: "https://chat.whatsapp.com/F7RcXCTLYJ4Ije5NiL6sDM"
  });
  const [cmsSaving, setCmsSaving] = useState(false);

  // Sheets Auth / Config States
  const [spreadsheetId, setSpreadsheetId] = useState(() => {
    const saved = localStorage.getItem("gfg_spreadsheet_id");
    return saved ? extractSpreadsheetId(saved) : "1z_TE4EeAmZAv0qU4hSxQA2rx_8ZbXTO7vSGd07Ste2s";
  });
  const [sheetsSyncing, setSheetsSyncing] = useState(false);

  const updateSpreadsheetId = (id: string) => {
    const cleanId = extractSpreadsheetId(id);
    setSpreadsheetId(cleanId);
    localStorage.setItem("gfg_spreadsheet_id", cleanId);
  };

  useEffect(() => {
    // Standard validation
    const savedAdmin = localStorage.getItem("admin_user");
    const savedToken = localStorage.getItem("token");
    if (!savedAdmin || !savedToken) {
      navigate("/admin-login"); // Redirect to admin login
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

      // Users
      const uRes = await fetch("/api/users", { headers });
      const uData = await uRes.json();
      if (uData.success) setUsers(uData.data);

      // Events
      const eRes = await fetch("/api/events", { headers });
      const eData = await eRes.json();
      if (eData.success) setEvents(eData.data);

      // Announcements
      const aRes = await fetch("/api/announcements", { headers });
      const aData = await aRes.json();
      if (aData.success) setAnnouncements(aData.data);

      // Certificates
      const cRes = await fetch("/api/certificates", { headers });
      const cData = await cRes.json();
      if (cData.success) setCertificates(cData.data);

      // Attendance
      const attRes = await fetch("/api/attendance", { headers });
      const attData = await attRes.json();
      if (attData.success) setAttendance(attData.data);

      // Logs
      const lRes = await fetch("/api/logs", { headers });
      const lData = await lRes.json();
      if (lData.success) setSystemLogs(lData.data);

      // CMS
      const cmsRes = await fetch("/api/cms/home");
      const cmsData = await cmsRes.json();
      if (cmsData.success) setCmsForm(cmsData.data);

    } catch (e) {
      console.error("Error loading chapter database telemetry:", e);
    }
  };

  // Core team administrative updating workflows

  // --- USER CREATING & EDITING WORKFLOWS ---
  const handleSaveUser = async (e: FormEvent) => {
    e.preventDefault();
    const token = localStorage.getItem("token");
    const isEditing = !!isEditingUser;
    
    const url = isEditing ? `/api/users/${isEditingUser.id}` : "/api/users";
    const method = isEditing ? "PUT" : "POST";

    try {
      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          name: userForm.name,
          email: userForm.email,
          mobile: userForm.mobile,
          role: userForm.role,
          enrollment_no: userForm.enrollmentNumber,
          department: userForm.department,
          year: userForm.yearName,
          permissions: userForm.permissions,
          password: userForm.password
        })
      });

      const resJson = await response.json();
      if (resJson.success) {
        setIsUserModalOpen(false);
        setIsEditingUser(null);
        setUserForm({
          name: "",
          email: "",
          mobile: "",
          enrollmentNumber: "",
          department: "Computer Science & Engineering",
          yearName: "3rd Year",
          role: "student",
          password: "student123",
          permissions: []
        });
        refreshData();
      } else {
        alert(resJson.message || "Credential configuration conflict.");
      }
    } catch (err) {
      console.error(err);
    }
  };

  const startEditUser = (usr: any) => {
    setIsEditingUser(usr);
    setUserForm({
      name: usr.name || "",
      email: usr.email || "",
      mobile: usr.mobile || "",
      enrollmentNumber: usr.enrollmentNumber || usr.enrollment_no || "",
      department: usr.department || "Computer Science & Engineering",
      yearName: usr.year || "3rd Year",
      role: usr.role || "student",
      password: "",
      permissions: usr.permissions || []
    });
    setIsUserModalOpen(true);
  };

  const handleDeleteUser = async (id: string) => {
    if (!confirm("Are you sure you want to purge this record from Firestore Database?")) return;
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`/api/users/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      if (data.success) {
        refreshData();
      } else {
        alert("Operation denied: Access level restriction.");
      }
    } catch (e) {
      console.error(e);
    }
  };

  const toggleUserStatus = async (user: any) => {
    const newStatus = user.status === "Disabled" ? "Active" : "Disabled";
    if (!confirm(`Are you sure you want to change this student's account status to: ${newStatus}?`)) return;
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`/api/users/${user.id}`, {
        method: "PUT",
        headers: { 
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}` 
        },
        body: JSON.stringify({ status: newStatus })
      });
      const data = await res.json();
      if (data.success) {
        setUsers(prev => prev.map(u => u.id === user.id ? { ...u, status: newStatus } : u));
        setSelectedStudentForDrawer(prev => prev ? { ...prev, status: newStatus } : null);
      } else {
        alert(`Failed to update status: ${data.message || "Unknown error"}`);
      }
    } catch (e) {
      console.error(e);
      alert("Error contacting the registry backend server.");
    }
  };

  // --- EVENT CREATING & EDITING WORKFLOWS ---
  const handleSaveEvent = async (e: FormEvent) => {
    e.preventDefault();
    const token = localStorage.getItem("token");
    const isEditing = !!isEditingEvent;
    
    const url = isEditing ? `/api/events/${isEditingEvent.id}` : "/api/events";
    const method = isEditing ? "PUT" : "POST";

    try {
      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(eventForm)
      });

      const data = await response.json();
      if (data.success) {
        setIsEventModalOpen(false);
        setIsEditingEvent(null);
        setEventForm({
          title: "",
          description: "",
          date: "",
          location: "",
          poster_url: "",
          registration_link: ""
        });
        refreshData();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const startEditEvent = (evt: any) => {
    setIsEditingEvent(evt);
    setEventForm({
      title: evt.title || "",
      description: evt.description || "",
      date: evt.date || "",
      location: evt.location || "",
      poster_url: evt.poster_url || "",
      registration_link: evt.registration_link || ""
    });
    setIsEventModalOpen(true);
  };

  const handleDeleteEvent = async (id: string) => {
    if (!confirm("Delete and retire this campus event?")) return;
    try {
      const token = localStorage.getItem("token");
      await fetch(`/api/events/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` }
      });
      refreshData();
    } catch (e) {
      console.error(e);
    }
  };

  // Announcements workflows
  const handleSaveAnnouncement = async (e: FormEvent) => {
    e.preventDefault();
    const token = localStorage.getItem("token");
    try {
      await fetch("/api/announcements", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(annForm)
      });
      setIsAnnModalOpen(false);
      setAnnForm({ title: "", content: "", category: "Notice" });
      refreshData();
    } catch (e) {
      console.error(e);
    }
  };

  const handleDeleteAnnouncement = async (id: string) => {
    if (!confirm("Delete announcement?")) return;
    try {
      const token = localStorage.getItem("token");
      await fetch(`/api/announcements/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` }
      });
      refreshData();
    } catch (e) {
      console.error(e);
    }
  };

  // Certificates workflows
  const handleSaveCertificate = async (e: FormEvent) => {
    e.preventDefault();
    const token = localStorage.getItem("token");
    try {
      const student = users.find(u => u.uid === certForm.userId || u.id === certForm.userId);
      const emailValue = student ? student.email : certForm.studentEmail || "student@marwadiuniversity.ac.in";
      const nameValue = student ? student.name : certForm.studentName || "Chapter Student";
      
      const payload = {
        ...certForm,
        studentName: nameValue,
        studentEmail: emailValue,
        skills: typeof certForm.skills === "string" 
          ? certForm.skills.split(",").map(s => s.trim()).filter(Boolean) 
          : certForm.skills
      };

      const response = await fetch("/api/certificates", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(payload)
      });
      const resData = await response.json();
      if (resData.success) {
        setIsCertModalOpen(false);
        setCertForm({ 
          userId: "", 
          eventName: "Neural Hackathon v2.0", 
          studentName: "", 
          pdfUrl: "#", 
          hash: "",
          skills: "Data Structures, Algorithms",
          issueDate: new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
          studentEmail: ""
        });
        refreshData();
      } else {
        alert(resData.message || "Failed to provision certificate record.");
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleDeleteCertificate = async (id: string) => {
    if (!confirm("Delete this student certificate record?")) return;
    try {
      const token = localStorage.getItem("token");
      await fetch(`/api/certificates/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` }
      });
      refreshData();
    } catch (e) {
      console.error(e);
    }
  };

  // Save dynamically revised landing CMS
  const handleSaveCMS = async (e: FormEvent) => {
    e.preventDefault();
    setCmsSaving(true);
    try {
      const token = localStorage.getItem("token");
      const res = await fetch("/api/cms/home", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(cmsForm)
      });
      const data = await res.json();
      if (data.success) {
        alert("GEEKSFORGEEKS Landing page content dynamically saved & refreshed!");
      }
    } catch (err) {
      console.error(err);
    } finally {
      setCmsSaving(false);
    }
  };

  // Google Sheets sync integration
  const handleSheetsSync = async () => {
    setSheetsSyncing(true);
    try {
      const authResult = await signInWithGoogleSheets();
      if (!authResult) {
        throw new Error("Unable to obtain Google Sheets authorization.");
      }

      const syncUsers = users.filter(u => u.role === "student" || u.role === "super_admin" || u.role === "admin" || u.role === "sub_admin");
      await syncStudentsToSheet(authResult.accessToken, spreadsheetId, syncUsers);

      if (attendance && attendance.length > 0) {
        await syncAttendanceToSheet(authResult.accessToken, spreadsheetId, attendance);
      }

      alert("Successfully synchronized student directory and telemetry logs directly to target Google Sheets! Opening worksheet...");
      window.open(`https://docs.google.com/spreadsheets/d/${spreadsheetId}`, "_blank");
    } catch (err: any) {
      console.error(err);
      alert(`Sheets synchronization failed: ${err.message || err}`);
    } finally {
      setSheetsSyncing(false);
    }
  };

  // Export Roster to CSV with direct numbers and enrollment records
  const exportRosterToCSV = () => {
    const list = users.filter(u => u.role === "student");
    const headers = ["Full Name", "Email Address", "Mobile Number", "Enrollment Number", "Department", "Score Points", "Registered At"];
    const rows = list.map(u => [
      u.name,
      u.email,
      u.mobile || "N/A",
      u.enrollmentNumber || u.enrollment_no || "N/A",
      u.department || "N/A",
      u.points || 0,
      u.createdAt || "N/A"
    ]);

    const csvContent = [headers, ...rows].map(e => e.map(item => `"${String(item).replace(/"/g, '""')}"`).join(",")).join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", `gfg_mu_student_chapter_roster_${new Date().toLocaleDateString().replace(/\//g, "-")}.csv`);
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Filtered, Sorted and Paginated Users for Student Registry Layout
  const processedUsers = useMemo(() => {
    let result = [...users];

    // Search filter
    if (userSearch) {
      const term = userSearch.toLowerCase();
      result = result.filter(u => 
        (u.name || "").toLowerCase().includes(term) ||
        (u.email || "").toLowerCase().includes(term) ||
        (u.enrollmentNumber || u.enrollment_no || "").toLowerCase().includes(term) ||
        (u.mobile || "").toLowerCase().includes(term)
      );
    }

    // Role filter
    if (roleFilter) {
      result = result.filter(u => u.role === roleFilter);
    }

    // Branch filter
    if (branchFilter) {
      result = result.filter(u => (u.department || u.branch || "").toLowerCase().includes(branchFilter.toLowerCase()));
    }

    // Semester/Year filter
    if (semesterFilter) {
      result = result.filter(u => (u.yearName || u.year || "").toLowerCase().includes(semesterFilter.toLowerCase()));
    }

    // Status filter
    if (statusFilter) {
      result = result.filter(u => {
        const uStatus = u.status === "Disabled" ? "Disabled" : "Active";
        return uStatus === statusFilter;
      });
    }

    // Sorting
    result.sort((a, b) => {
      let valA = "";
      let valB = "";
      
      if (sortKey === "name") {
        valA = (a.name || "").toLowerCase();
        valB = (b.name || "").toLowerCase();
      } else if (sortKey === "enrollment") {
        valA = (a.enrollmentNumber || a.enrollment_no || "").toLowerCase();
        valB = (b.enrollmentNumber || b.enrollment_no || "").toLowerCase();
      } else if (sortKey === "createdAt") {
        valA = a.createdAt || "";
        valB = b.createdAt || "";
      } else if (sortKey === "points") {
        const pA = a.points || 0;
        const pB = b.points || 0;
        return sortOrder === "asc" ? pA - pB : pB - pA;
      }

      if (valA < valB) return sortOrder === "asc" ? -1 : 1;
      if (valA > valB) return sortOrder === "asc" ? 1 : -1;
      return 0;
    });

    return result;
  }, [users, userSearch, roleFilter, branchFilter, semesterFilter, statusFilter, sortKey, sortOrder]);

  const paginatedUsers = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return processedUsers.slice(startIndex, startIndex + itemsPerPage);
  }, [processedUsers, currentPage]);

  const totalPages = Math.max(1, Math.ceil(processedUsers.length / itemsPerPage));

  const getRoleBadge = (role: string) => {
    switch (role) {
      case "super_admin":
        return "bg-rose-500/10 border-rose-500/20 text-rose-400";
      case "admin":
        return "bg-[#00ff88]/15 border-[#00ff88]/20 text-[#00ff88]";
      case "sub_admin":
        return "bg-yellow-500/10 border-yellow-500/20 text-yellow-400";
      case "committee":
        return "bg-purple-500/10 border-purple-500/20 text-purple-400";
      default:
        return "bg-gray-500/10 border-white/5 text-gray-400";
    }
  };

  if (loading || !currentUser) {
    return (
      <div className="min-h-screen bg-black flex flex-col items-center justify-center">
        <Loader2 className="w-12 h-12 text-[#00ff88] animate-spin mb-4" />
        <p className="text-white/40 font-mono text-sm uppercase tracking-widest animate-pulse">Scanning security clearance...</p>
      </div>
    );
  }

  // Define sidebar menu options based on current authenticated roles
  const sidebarItems = [
    { id: "analytics", label: "Overview", icon: BarChart3, roles: ["super_admin", "admin", "sub_admin", "committee"] },
    { id: "users", label: "User Accounts", icon: Users, roles: ["super_admin", "admin"] },
    { id: "events", label: "Event CMS", icon: Calendar, roles: ["super_admin", "admin", "sub_admin"] },
    { id: "certificates", label: "Certificates", icon: Award, roles: ["super_admin", "admin"] },
    { id: "announcements", label: "Announcements", icon: Bell, roles: ["super_admin", "admin", "sub_admin"] },
    { id: "cms", label: "Dynamic Landing CMS", icon: Globe, roles: ["super_admin"] },
    { id: "logs", label: "Access logs", icon: Terminal, roles: ["super_admin", "admin"] },
    { id: "firestore-view", label: "Firestore nodes", icon: Database, roles: ["super_admin"] },
    { id: "sheets", label: "Sheets Integration", icon: Share2, roles: ["super_admin", "admin"] }
  ];

  return (
    <div className="min-h-screen bg-[#070707] text-white flex">
      {/* 1. SIDEBAR NAVIGATION */}
      <div className="w-[320px] bg-[#0c0c0c] border-r border-white/5 flex flex-col justify-between shrink-0">
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
              <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-[#00ff88]/30 to-emerald-500/5 flex items-center justify-center font-bold text-xs">
                {currentUser.name[0]}
              </div>
              <div className="overflow-hidden">
                <div className="text-xs font-black truncate">{currentUser.name}</div>
                <div className="text-[10px] uppercase font-black tracking-widest text-white/40 mt-0.5">{currentUser.role.replace("_", " ")}</div>
              </div>
            </div>
          </div>

          {/* Links */}
          <nav className="p-6 space-y-1">
            {sidebarItems
              .filter(item => item.roles.includes(currentUser.role))
              .map(item => (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id as any)}
                  className={cn(
                    "w-full flex items-center px-5 py-4 rounded-xl text-left text-xs font-black uppercase tracking-wider transition-all duration-300 group",
                    activeTab === item.id 
                      ? "bg-[#00ff88]/10 text-[#00ff88] border border-[#00ff88]/20 shadow-[0_0_15px_rgba(0,255,136,0.1)]" 
                      : "text-gray-400 hover:text-white hover:bg-white/5 border border-transparent"
                  )}
                >
                  <item.icon className={cn(
                    "w-4 h-4 mr-4 transition-transform duration-300",
                    activeTab === item.id ? "text-[#00ff88]" : "text-white/20 group-hover:text-white/50"
                  )} />
                  {item.label}
                </button>
              ))}
          </nav>
        </div>

        {/* Footer info and signout */}
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
            Log Out Portal
          </button>
        </div>
      </div>

      {/* 2. MAIN HUB CONTENT CONTAINER */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Control Bar containing Instant Testing Selectors */}
        <header className="h-[90px] bg-[#0c0c0c]/80 backdrop-blur-md border-b border-white/5 px-10 flex items-center justify-between z-10">
          <div className="flex items-center space-x-3">
            <Layers className="w-5 h-5 text-[#00ff88]/75" />
            <span className="text-xs font-bold uppercase tracking-widest text-white/50">Enterprise Administration Control Suite</span>
          </div>

          {/* SECURE ADMIN IDENTITY BADGE */}
          <div className="flex items-center space-x-2.5 bg-emerald-950/20 border border-[#00ff88]/20 px-4 py-2 rounded-xl">
            <div className="w-2 h-2 rounded-full bg-[#00ff88] animate-pulse" />
            <span className="text-[10px] font-mono font-black uppercase tracking-widest text-[#00ff88]">
              Authorized Admin Session: Meet Khakhkhar
            </span>
          </div>
        </header>

        {/* Dashboard Panels Body */}
        <main className="flex-1 p-10 overflow-y-auto space-y-10">
          
          {/* ANALYTICS CARD TAB */}
          {activeTab === "analytics" && (
            <div className="space-y-10">
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-3xl font-black uppercase tracking-tight">STUDENT CHAPTER <span className="text-[#00ff88]">VITAL STATS</span></h1>
                  <p className="text-xs text-white/40 mt-1">Real-time engagement telemetry from GFG Marwadi Chapter database nodes.</p>
                </div>
              </div>
              <AdminAnalytics stats={{}} />
            </div>
          )}

          {/* USER MANAGEMENT TAB */}
          {/* USER MANAGEMENT TAB */}
          {activeTab === "users" && (
            <div className="space-y-8">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                  <h1 className="text-3xl font-black uppercase tracking-tight text-white">
                    Official Student <span className="text-[#00ff88]">Chapter Registry</span>
                  </h1>
                  <p className="text-xs text-white/40 mt-1">Manage official affiliations, verify academic status, toggle access, and track student chapter engagement parameters.</p>
                </div>

                <div className="flex items-center space-x-3 shrink-0">
                  <button
                    onClick={exportRosterToCSV}
                    className="inline-flex items-center px-4 py-3 bg-white/5 border border-white/10 hover:bg-white/10 text-white rounded-xl text-[10px] font-black uppercase tracking-wider transition-all cursor-pointer"
                  >
                    <Download className="w-3.5 h-3.5 mr-2 text-[#00ff88]" /> Export CSV
                  </button>
                  <button
                    onClick={() => {
                      setIsEditingUser(null);
                      setUserForm({
                        name: "",
                        email: "",
                        mobile: "",
                        enrollmentNumber: "",
                        department: "Computer Science & Engineering",
                        yearName: "3rd Year",
                        role: "student",
                        password: "student123",
                        permissions: []
                      });
                      setIsUserModalOpen(true);
                    }}
                    className="inline-flex items-center px-5 py-3 bg-[#00ff88] hover:bg-white text-black rounded-xl text-[10px] font-black uppercase tracking-wider transition-all cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5 mr-2" /> Register Member
                  </button>
                </div>
              </div>

              {/* Advanced Interactive Filters & Sorting Box */}
              <div className="p-6 bg-[#0c0c0c] border border-white/5 rounded-3xl space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
                  {/* Search */}
                  <div className="relative">
                    <Search className="absolute left-4 top-3.5 w-4 h-4 text-white/30" />
                    <input
                      type="text"
                      placeholder="Search name, roll size, email..."
                      value={userSearch}
                      onChange={(e) => { setUserSearch(e.target.value); setCurrentPage(1); }}
                      className="w-full bg-black/40 border border-white/10 hover:border-white/20 rounded-xl pl-11 pr-4 py-3 text-xs font-semibold focus:outline-none focus:border-[#00ff88]/30 transition-all text-white placeholder-white/30"
                    />
                  </div>

                  {/* Role filter */}
                  <div>
                    <select
                      value={roleFilter}
                      onChange={(e) => { setRoleFilter(e.target.value); setCurrentPage(1); }}
                      className="w-full bg-black/40 border border-white/10 hover:border-white/20 rounded-xl px-4 py-3 text-xs font-bold focus:outline-none focus:border-[#00ff88]/30 transition-all text-white/70"
                    >
                      <option value="" className="bg-black text-white">All Account Roles</option>
                      <option value="super_admin" className="bg-black text-white">Main Super Admin</option>
                      <option value="admin" className="bg-black text-white">Administrator</option>
                      <option value="sub_admin" className="bg-black text-white">Sub Admin</option>
                      <option value="committee" className="bg-black text-white">Committee Member</option>
                      <option value="student" className="bg-black text-white">Student</option>
                    </select>
                  </div>

                  {/* Branch filter */}
                  <div>
                    <select
                      value={branchFilter}
                      onChange={(e) => { setBranchFilter(e.target.value); setCurrentPage(1); }}
                      className="w-full bg-black/40 border border-white/10 hover:border-white/20 rounded-xl px-4 py-3 text-xs font-bold focus:outline-none focus:border-[#00ff88]/30 transition-all text-white/70"
                    >
                      <option value="" className="bg-black text-white">All Branches</option>
                      <option value="Computer Science" className="bg-black text-white">Computer Science</option>
                      <option value="Information Technology" className="bg-black text-white">Information Technology</option>
                      <option value="Computer Engineering" className="bg-black text-white">Computer Engineering</option>
                      <option value="Mechanical" className="bg-black text-white">Mechanical Engineering</option>
                      <option value="Civil" className="bg-black text-white">Civil Engineering</option>
                    </select>
                  </div>

                  {/* Semester/Year filter */}
                  <div>
                    <select
                      value={semesterFilter}
                      onChange={(e) => { setSemesterFilter(e.target.value); setCurrentPage(1); }}
                      className="w-full bg-black/40 border border-white/10 hover:border-white/20 rounded-xl px-4 py-3 text-xs font-bold focus:outline-none focus:border-[#00ff88]/30 transition-all text-white/70"
                    >
                      <option value="" className="bg-black text-white">All Semesters / Years</option>
                      <option value="1st Semester" className="bg-black text-white">1st Sem</option>
                      <option value="2nd Semester" className="bg-black text-white">2nd Sem</option>
                      <option value="3rd" className="bg-black text-white">3rd Year</option>
                      <option value="4th" className="bg-black text-white">4th Year</option>
                    </select>
                  </div>

                  {/* Status filter */}
                  <div>
                    <select
                      value={statusFilter}
                      onChange={(e) => { setStatusFilter(e.target.value); setCurrentPage(1); }}
                      className="w-full bg-black/40 border border-white/10 hover:border-white/20 rounded-xl px-4 py-3 text-xs font-bold focus:outline-none focus:border-[#00ff88]/30 transition-all text-white/70"
                    >
                      <option value="" className="bg-black text-white">All Statuses</option>
                      <option value="Active" className="bg-black text-white">Active Only</option>
                      <option value="Disabled" className="bg-black text-white">Disabled Only</option>
                    </select>
                  </div>
                </div>

                <div className="flex flex-wrap justify-between items-center pt-2 border-t border-white/5 gap-2 text-[10px] font-mono font-black uppercase text-white/40 tracking-wider">
                  <div className="flex items-center space-x-4">
                    <span>Active Queries matches: <span className="text-[#00ff88]">{processedUsers.length} students</span></span>
                    {users.length > 0 && (
                      <span className="text-white/20">| Total Database Records: {users.length}</span>
                    )}
                  </div>
                  
                  {/* Sorting columns HUD hints */}
                  <div className="flex items-center space-x-2">
                    <span className="text-white/20">Click column headers to sort by:</span>
                    <span className="text-[#00ff88]">{sortKey.toUpperCase()} ({sortOrder.toUpperCase()})</span>
                  </div>
                </div>
              </div>

              {/* User Table Grid */}
              <div className="bg-[#0b0b0b] border border-white/5 rounded-[32px] overflow-hidden">
                <table className="w-full text-left text-xs whitespace-nowrap">
                  <thead>
                    <tr className="bg-[#111] text-[9px] font-black uppercase tracking-widest text-white/30 border-b border-white/5 select-none">
                      <th 
                        onClick={() => {
                          setSortKey("name");
                          setSortOrder(sortKey === "name" && sortOrder === "asc" ? "desc" : "asc");
                        }}
                        className="px-8 py-5 cursor-pointer hover:text-white transition-colors"
                      >
                        <div className="flex items-center space-x-1">
                          <span>Full Profile Details</span>
                          <ArrowUpDown className="w-3 h-3 opacity-60" />
                        </div>
                      </th>
                      <th 
                        onClick={() => {
                          setSortKey("enrollment");
                          setSortOrder(sortKey === "enrollment" && sortOrder === "asc" ? "desc" : "asc");
                        }}
                        className="px-8 py-5 cursor-pointer hover:text-white transition-colors"
                      >
                        <div className="flex items-center space-x-1">
                          <span>Enrollment No.</span>
                          <ArrowUpDown className="w-3 h-3 opacity-60" />
                        </div>
                      </th>
                      <th className="px-8 py-5">Verification Contacts</th>
                      <th className="px-8 py-5">Department & Term</th>
                      <th 
                        onClick={() => {
                          setSortKey("points");
                          setSortOrder(sortKey === "points" && sortOrder === "asc" ? "desc" : "asc");
                        }}
                        className="px-8 py-5 cursor-pointer hover:text-white transition-colors"
                      >
                        <div className="flex items-center space-x-1">
                          <span>Chapter Points</span>
                          <ArrowUpDown className="w-3 h-3 opacity-60" />
                        </div>
                      </th>
                      <th className="px-8 py-5">Status</th>
                      <th className="px-8 py-5">Admin Role</th>
                      <th className="px-8 py-5 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {paginatedUsers.map((usr) => {
                      const isUserDisabled = usr.status === "Disabled";
                      return (
                        <tr key={usr.id} className="hover:bg-white/[0.01] transition-colors group">
                          <td className="px-8 py-5">
                            <div className="flex items-center space-x-3.5">
                              <div className="w-10 h-10 rounded-full bg-[#2F8D46]/10 border border-[#2F8D46]/20 flex items-center justify-center font-mono font-black text-xs uppercase tracking-wider text-[#00ff88]">
                                {usr.name ? usr.name[0] : "?"}
                              </div>
                              <div>
                                <div className="text-xs font-black text-white hover:text-[#00ff88] transition-colors cursor-pointer" onClick={() => { setSelectedStudentForDrawer(usr); setIsDrawerOpen(true); }}>
                                  {usr.name || "Unnamed Student"}
                                </div>
                                <div className="text-[10px] text-white/30 font-semibold font-mono lowercase mt-0.5">{usr.email}</div>
                              </div>
                            </div>
                          </td>
                          <td className="px-8 py-5 font-mono text-xs font-bold uppercase tracking-wider text-white">
                            {usr.enrollmentNumber || usr.enrollment_no || "N/A"}
                          </td>
                          <td className="px-8 py-5 font-mono text-xs">
                            {currentUser?.role === "super_admin" || currentUser?.role === "admin" ? (
                              <div className="space-y-1 text-white">
                                <div className="flex items-center text-[#00ff88]/80 font-black">
                                  <Phone className="w-3.5 h-3.5 mr-2" /> {usr.mobile || "N/A"}
                                </div>
                                <div className="flex items-center text-white/40">
                                  <Mail className="w-3.5 h-3.5 mr-2" /> {usr.email}
                                </div>
                              </div>
                            ) : (
                              <div className="text-gray-500 italic text-xs flex items-center">
                                <ShieldCheck className="w-4 h-4 mr-2" /> RESTRICTED VIEW
                              </div>
                            )}
                          </td>
                          <td className="px-8 py-5">
                            <div className="text-xs text-white/80 font-bold">{usr.department || usr.branch || "General Engineering"}</div>
                            <div className="text-[10px] text-white/30 font-bold uppercase tracking-widest mt-0.5">{usr.yearName || usr.semester || usr.year || "3rd Year"}</div>
                          </td>
                          <td className="px-8 py-5 font-mono text-xs font-bold text-yellow-400">
                            ★ {usr.points ?? 500}
                          </td>
                          <td className="px-8 py-5">
                            <span className={cn(
                              "inline-flex items-center space-x-1.5 px-2.5 py-1 rounded-full text-[9px] font-black uppercase tracking-wider",
                              isUserDisabled 
                                ? "bg-rose-500/15 border border-rose-500/20 text-rose-400" 
                                : "bg-emerald-500/15 border border-emerald-500/20 text-emerald-400"
                            )}>
                              <span className={cn("w-1.5 h-1.5 rounded-full", isUserDisabled ? "bg-rose-500 animate-pulse" : "bg-emerald-400")} />
                              <span>{isUserDisabled ? "Disabled" : "Active"}</span>
                            </span>
                          </td>
                          <td className="px-8 py-5">
                            <span className={cn(
                              "px-2.5 py-1 rounded-lg border text-[8px] font-mono font-black uppercase tracking-widest",
                              getRoleBadge(usr.role)
                            )}>
                              {usr.role?.replace("_", " ") || "student"}
                            </span>
                          </td>
                          <td className="px-8 py-5 text-right select-none">
                            <div className="flex items-center justify-end space-x-2">
                              <button
                                onClick={() => {
                                  setSelectedStudentForDrawer(usr);
                                  setIsDrawerOpen(true);
                                }}
                                className="p-2 ml-1 rounded-lg bg-white/5 border border-white/10 text-white/55 hover:text-[#00ff88] hover:bg-[#00ff88]/10 hover:border-[#00ff88]/20 transition-all cursor-pointer"
                                title="View Member Profile & Activities"
                              >
                                <Eye className="w-3.5 h-3.5" />
                              </button>
                              <button
                                onClick={() => startEditUser(usr)}
                                className="p-2 rounded-lg bg-white/5 border border-white/10 text-white/55 hover:text-blue-400 hover:bg-blue-500/10 hover:border-blue-500/20 transition-all cursor-pointer"
                                title="Edit parameters"
                              >
                                <Edit2 className="w-3.5 h-3.5" />
                              </button>
                              <button
                                disabled={usr.id === currentUser?.id || usr.uid === currentUser?.uid}
                                onClick={() => handleDeleteUser(usr.id)}
                                className="p-2 rounded-lg bg-white/5 border border-white/10 text-white/30 hover:text-rose-400 hover:bg-rose-500/10 hover:border-rose-500/20 transition-all disabled:opacity-25 cursor-pointer"
                                title="Delete account"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                    {paginatedUsers.length === 0 && (
                      <tr>
                        <td colSpan={8} className="text-center py-14 text-white/20 font-bold uppercase tracking-widest">
                          No matching student chapter users recovered from Firestore collection nodes.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>

              {/* Table Pagination Controls */}
              <div className="flex flex-col sm:flex-row justify-between items-center gap-4 px-6 py-4 bg-black/35 border border-white/5 rounded-3xl text-xs text-white/40 font-bold">
                <div>
                  Showing <span className="text-white">{(currentPage - 1) * itemsPerPage + 1}</span> to{" "}
                  <span className="text-white">
                    {Math.min(currentPage * itemsPerPage, processedUsers.length)}
                  </span>{" "}
                  of <span className="text-white">{processedUsers.length}</span> students
                </div>

                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                    disabled={currentPage === 1}
                    className="p-2.5 rounded-xl bg-white/5 border border-white/10 text-white/60 hover:text-white disabled:opacity-20 hover:bg-white/10 transition-all cursor-pointer"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  <div className="flex items-center space-x-1 font-mono">
                    {Array.from({ length: totalPages }).map((_, i) => (
                      <button
                        key={i}
                        onClick={() => setCurrentPage(i + 1)}
                        className={cn(
                          "w-8 h-8 rounded-lg border text-xs font-black transition-all cursor-pointer",
                          currentPage === i + 1
                            ? "bg-[#00ff88]/10 text-[#00ff88] border-[#00ff88]/20"
                            : "bg-transparent text-white/40 border-transparent hover:text-white"
                        )}
                      >
                        {i + 1}
                      </button>
                    ))}
                  </div>
                  <button
                    onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                    disabled={currentPage === totalPages}
                    className="p-2.5 rounded-xl bg-white/5 border border-white/10 text-white/60 hover:text-white disabled:opacity-20 hover:bg-white/10 transition-all cursor-pointer"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* EVENTS MANAGEMENT TAB */}
          {activeTab === "events" && (
            <div className="space-y-10">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                  <h1 className="text-3xl font-black uppercase tracking-tight text-white">Operational <span className="text-[#00ff88]">Events Portal</span></h1>
                  <p className="text-xs text-white/40 mt-1">Modify event dates, adjust check-in QR credentials, and publish community programs.</p>
                </div>
                <button
                  onClick={() => {
                    setIsEditingEvent(null);
                    setEventForm({
                      title: "",
                      description: "",
                      date: "",
                      location: "",
                      poster_url: "",
                      registration_link: ""
                    });
                    setIsEventModalOpen(true);
                  }}
                  className="inline-flex items-center px-5 py-3 bg-[#00ff88] hover:bg-white text-black rounded-xl text-xs font-black uppercase tracking-widest transition-all"
                >
                  <Plus className="w-4 h-4 mr-2" /> Launch Event
                </button>
              </div>

              {/* List of events */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {events.map((evt) => (
                  <div key={evt.id} className="bg-[#0c0c0c] border border-white/5 hover:border-[#00ff88]/20 rounded-[32px] overflow-hidden group transition-all flex flex-col justify-between">
                    <div className="h-[200px] w-full overflow-hidden relative border-b border-white/5">
                      <img src={evt.poster_url} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                      <div className="absolute top-4 left-4 px-3 py-1.5 bg-[#0a0a0a]/80 backdrop-blur-md rounded-xl text-[9px] font-black uppercase tracking-widest border border-white/10">
                        {evt.date}
                      </div>

                      <div className="absolute top-4 right-4 flex gap-1">
                        {evt.approvedBySuperAdmin === false ? (
                          <span className="px-3 py-1.5 bg-amber-500 text-black rounded-xl text-[9px] font-black uppercase tracking-widest flex items-center gap-1 shadow-lg">
                            Pending Verification
                          </span>
                        ) : (
                          <span className="px-3 py-1.5 bg-[#00ff88] text-black rounded-xl text-[9px] font-black uppercase tracking-widest flex items-center gap-1 shadow-lg">
                            Verified & Shared
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="p-8 space-y-4">
                      <h3 className="text-lg font-black uppercase text-white truncate">{evt.title}</h3>
                      <p className="text-xs text-white/40 font-medium line-clamp-3 leading-relaxed">{evt.description}</p>
                      
                      <div className="flex items-center space-x-2 text-xs font-mono text-white/30">
                        <MapPin className="w-3.5 h-3.5" />
                        <span className="truncate">{evt.location}</span>
                      </div>
                    </div>
                    <div className="p-8 border-t border-white/5 flex flex-col gap-4">
                      <div className="flex items-center justify-between flex-wrap gap-2">
                        <span className="text-[10px] font-mono uppercase text-[#00ff88] font-bold">QR Active: ({evt.qr_code_data})</span>
                        {currentUser?.role === "super_admin" && evt.approvedBySuperAdmin === false && (
                          <button
                            onClick={async () => {
                              try {
                                const token = localStorage.getItem("token");
                                const res = await fetch(`/api/events/${evt.id}/approve`, {
                                  method: "POST",
                                  headers: { Authorization: `Bearer ${token}` }
                                });
                                const d = await res.json();
                                if (d.success) {
                                  alert("Event successfully verified and shared with the Geeks community!");
                                  refreshData();
                                } else {
                                  alert(`Approval failed: ${d.message}`);
                                }
                              } catch (err: any) {
                                alert(`Error: ${err.message}`);
                              }
                            }}
                            className="px-3 py-2 bg-emerald-500 hover:bg-emerald-600 text-black rounded-lg text-[10px] font-black uppercase tracking-widest shadow-[0_0_15px_rgba(16,185,129,0.3)] transition-colors"
                          >
                            Verify & Share
                          </button>
                        )}
                      </div>
                      <div className="flex items-center justify-end space-x-2">
                        <button
                          onClick={() => startEditEvent(evt)}
                          className="px-3 py-2 bg-white/5 border border-white/10 hover:bg-[#00ff88]/10 hover:text-[#00ff88] rounded-lg text-[10px] font-black uppercase"
                        >
                          Modify
                        </button>
                        <button
                          onClick={() => handleDeleteEvent(evt.id)}
                          className="px-3 py-2 bg-white/5 border border-white/10 hover:bg-rose-500/15 hover:text-rose-400 rounded-lg text-[10px] font-black uppercase"
                        >
                          Purge
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* CERTIFICATES GENERATOR TAB */}
          {activeTab === "certificates" && (
            <div className="space-y-10">
              <div className="flex justify-between items-center">
                <div>
                  <h1 className="text-3xl font-black uppercase tracking-tight text-white">Dynamic <span className="text-[#00ff88]">Certificates Engine</span></h1>
                  <p className="text-xs text-white/40 mt-1">Generate unique, cryptographically-hashed accomplishment badges for chapter students.</p>
                </div>
                <button
                  onClick={() => setIsCertModalOpen(true)}
                  className="inline-flex items-center px-5 py-3 bg-[#00ff88] hover:bg-white text-black rounded-xl text-xs font-black uppercase tracking-widest transition-all"
                >
                  <Plus className="w-4 h-4 mr-2" /> Generate Badge
                </button>
              </div>

               {/* Certificates List */}
               <div className="bg-[#0b0b0b] border border-white/5 rounded-[32px] overflow-hidden">
                 <table className="w-full text-left text-sm">
                   <thead>
                     <tr className="bg-[#111] text-[10px] font-black uppercase tracking-widest text-white/30 border-b border-white/5">
                       <th className="px-8 py-5">Achiever Student</th>
                       <th className="px-8 py-5">Event Badge & Skills</th>
                       <th className="px-8 py-5">Certificate Code</th>
                       <th className="px-8 py-5">Stats (Dl / Vf)</th>
                       <th className="px-8 py-5">Dispatch Date</th>
                       <th className="px-8 py-5 text-right">Action Gate</th>
                     </tr>
                   </thead>
                   <tbody className="divide-y divide-white/5">
                     {certificates.map((cert) => {
                       const idKey = cert.certificateId || cert.hash || cert.id;
                       const skArray = Array.isArray(cert.skills) ? cert.skills : String(cert.skills || "").split(",").map(s => s.trim()).filter(Boolean);
                       
                       return (
                         <tr key={cert.id} className="hover:bg-white/[0.01]">
                           <td className="px-8 py-5">
                             <span className="font-bold font-sans text-white block">{cert.studentName}</span>
                             <span className="text-[10px] font-mono text-gray-500 block mt-0.5">{cert.studentEmail || "No Email Registered"}</span>
                           </td>
                           <td className="px-8 py-5">
                             <span className="text-[#00ff88] font-black uppercase text-xs block mb-1">{cert.eventName}</span>
                             <div className="flex flex-wrap gap-1">
                               {skArray.map((sk: string) => (
                                 <span key={sk} className="px-1.5 py-0.5 bg-white/5 text-[8.5px] font-mono rounded text-gray-400 border border-white/2">
                                   {sk}
                                 </span>
                               ))}
                             </div>
                           </td>
                           <td className="px-8 py-5 font-mono text-xs text-white/40">{idKey}</td>
                           <td className="px-8 py-5 font-mono text-xs text-cyan-400">
                             <span>⬇️ {cert.downloadCount || 0}</span>
                             <span className="mx-2 text-white/20">|</span>
                             <span>👁️ {cert.verificationCount || 0}</span>
                           </td>
                           <td className="px-8 py-5 text-xs text-white/60">{cert.issueDate || "Active"}</td>
                           <td className="px-8 py-5 text-right space-x-2">
                             <a
                               href={`https://certiforge-ai-945097883026.us-west1.run.app/#verify/${idKey}`}
                               target="_blank"
                               rel="noreferrer"
                               className="inline-flex p-2 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/20 rounded-lg transition-all"
                               title="Test Verify ledger link"
                             >
                               <ExternalLink className="w-4 h-4" />
                             </a>
                             <button
                               onClick={() => handleDeleteCertificate(cert.id)}
                               className="inline-flex p-2 bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/20 rounded-lg transition-all"
                               title="Revoke certificate"
                             >
                               <Trash2 className="w-4 h-4" />
                             </button>
                           </td>
                         </tr>
                       );
                     })}
                     {certificates.length === 0 && (
                       <tr>
                         <td colSpan={6} className="text-center py-10 text-white/35 italic">
                           No active accomplishment badges generated yet.
                         </td>
                       </tr>
                     )}
                   </tbody>
                 </table>
               </div>
            </div>
          )}

          {/* ANNOUNCEMENTS TAB */}
          {activeTab === "announcements" && (
            <div className="space-y-10">
              <div className="flex justify-between items-center">
                <div>
                  <h1 className="text-3xl font-black uppercase tracking-tight text-white">Dynamic <span className="text-[#00ff88]">Notice Board</span></h1>
                  <p className="text-xs text-white/40 mt-1">Publish alerts, chapter bulletins, workshop invites, and general student updates.</p>
                </div>
                <button
                  onClick={() => setIsAnnModalOpen(true)}
                  className="inline-flex items-center px-5 py-3 bg-[#00ff88] hover:bg-white text-black rounded-xl text-xs font-black uppercase tracking-widest transition-all"
                >
                  <Plus className="w-4 h-4 mr-2" /> Post Announcement
                </button>
              </div>

              {/* Notification Roster */}
              <div className="space-y-4">
                {announcements.map((ann) => (
                  <div key={ann.id} className="p-8 bg-[#0c0c0c] border border-white/5 hover:border-white/10 rounded-3xl flex justify-between items-start gap-4">
                    <div className="space-y-3 flex-grow">
                      <div className="flex items-center space-x-2 flex-wrap gap-2">
                        <span className="px-2.5 py-1 bg-[#00ff88]/10 text-[#00ff88] border border-[#00ff88]/20 rounded-lg text-[9px] font-black uppercase tracking-widest">
                          {ann.category}
                        </span>
                        <span className="text-[10px] text-white/20 font-mono">{ann.date}</span>
                        {ann.approvedBySuperAdmin === false ? (
                          <span className="px-2.5 py-1 bg-amber-500/10 text-amber-400 border border-amber-500/20 rounded-lg text-[8px] font-black uppercase tracking-widest">
                            Pending Super-Admin Share
                          </span>
                        ) : (
                          <span className="px-2.5 py-1 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded-lg text-[8px] font-black uppercase tracking-widest">
                            Live & Shared (Verified)
                          </span>
                        )}
                      </div>
                      <h3 className="text-lg font-black uppercase text-white">{ann.title}</h3>
                      <p className="text-xs text-white/40 leading-relaxed max-w-4xl font-medium">{ann.content}</p>

                      {currentUser?.role === "super_admin" && ann.approvedBySuperAdmin === false && (
                        <div className="pt-2">
                          <button
                            onClick={async () => {
                              try {
                                const token = localStorage.getItem("token");
                                const res = await fetch(`/api/announcements/${ann.id}/approve`, {
                                  method: "POST",
                                  headers: { Authorization: `Bearer ${token}` }
                                });
                                const d = await res.json();
                                if (d.success) {
                                  alert("Announcement successfully approved and shared live with the student portal notice boards!");
                                  refreshData();
                                } else {
                                  alert(`Approval failed: ${d.message}`);
                                }
                              } catch (err: any) {
                                alert(`Error: ${err.message}`);
                              }
                            }}
                            className="px-3 py-1.5 bg-emerald-500 hover:bg-emerald-600 text-black text-[9px] font-black uppercase tracking-wider rounded-lg shadow-lg transition-colors"
                          >
                            Verify & Dispatch Link
                          </button>
                        </div>
                      )}
                    </div>

                    <button
                      onClick={() => handleDeleteAnnouncement(ann.id)}
                      className="p-2 rounded-xl bg-white/5 border border-white/10 text-white/40 hover:text-rose-400 hover:bg-rose-500/10 hover:border-rose-500/20 transition-all shrink-0 mt-2"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* LANDING WEBSITE CMS DYNAMIC */}
          {activeTab === "cms" && (
            <div className="space-y-10">
              <div>
                <h1 className="text-3xl font-black uppercase tracking-tight text-white">CHAPTER LANDING <span className="text-[#00ff88]">CMS PANEL</span></h1>
                <p className="text-xs text-white/40 mt-1">Edit central headers, community slogans, metadata, and WhatsApp team communication handles.</p>
              </div>

              <form onSubmit={handleSaveCMS} className="p-10 bg-[#0c0c0c] border border-white/5 rounded-3xl space-y-6 max-w-4xl">
                <div className="space-y-2">
                  <label className="text-xs font-black text-gray-400 uppercase tracking-widest">HERO BANNER HEADLINE</label>
                  <input
                    type="text"
                    value={cmsForm.headline}
                    onChange={(e) => setCmsForm({ ...cmsForm, headline: e.target.value })}
                    className="w-full px-5 py-4 bg-black/40 border border-white/10 rounded-2xl text-xs font-mono text-white tracking-wider uppercase focus:border-[#00ff88]/30 focus:outline-none"
                    placeholder="SOLVING CHALLENGES..."
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-black text-gray-400 uppercase tracking-widest">SUB-HEADLINE BRANDING</label>
                  <input
                    type="text"
                    value={cmsForm.tagline}
                    onChange={(e) => setCmsForm({ ...cmsForm, tagline: e.target.value })}
                    className="w-full px-5 py-4 bg-black/40 border border-white/10 rounded-2xl text-sm font-semibold text-white focus:border-[#00ff88]/30 focus:outline-none"
                    placeholder="Branding details..."
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-black text-gray-400 uppercase tracking-widest">CHAPTER MOTIVATION SUMMARY (SUBTEXT)</label>
                  <textarea
                    rows={4}
                    value={cmsForm.subtext}
                    onChange={(e) => setCmsForm({ ...cmsForm, subtext: e.target.value })}
                    className="w-full px-5 py-4 bg-black/40 border border-white/10 rounded-2xl text-xs font-medium leading-relaxed text-white/60 focus:border-[#00ff88]/30 focus:outline-none"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-black text-gray-400 uppercase tracking-widest">COMMUNITY WHATSAPP DISPATCH LINK</label>
                  <input
                    type="text"
                    value={cmsForm.whatsappGroup}
                    onChange={(e) => setCmsForm({ ...cmsForm, whatsappGroup: e.target.value })}
                    className="w-full px-5 py-4 bg-black/40 border border-white/10 rounded-2xl text-xs font-mono text-white focus:border-[#00ff88]/30 focus:outline-none"
                  />
                </div>

                <button
                  type="submit"
                  disabled={cmsSaving}
                  className="px-6 py-4 bg-[#00ff88] text-black font-black uppercase text-[10px] tracking-widest rounded-xl hover:bg-white transition-colors"
                >
                  {cmsSaving ? "Saving CMS to Firestore..." : "Publish Layout Sync"}
                </button>
              </form>
            </div>
          )}

          {/* ACCESS LOGS TAB */}
          {activeTab === "logs" && (
            <div className="space-y-10">
              <div>
                <h1 className="text-3xl font-black uppercase tracking-tight text-white">Live <span className="text-[#00ff88]">Security Logs</span></h1>
                <p className="text-xs text-white/40 mt-1">Audit security gates, track user elevations, session access, and system updates.</p>
              </div>

              <div className="bg-black/60 border border-white/10 p-8 rounded-[32px] max-w-5xl font-mono text-xs text-white/80 space-y-4 max-h-[500px] overflow-y-auto">
                {systemLogs.map((log) => (
                  <div key={log.id} className="flex justify-between items-start gap-4 p-4 hover:bg-white/[0.01] rounded-xl">
                    <div className="space-y-1.5">
                      <div className="text-[#00ff88] font-black">[ {log.timestamp} ]</div>
                      <div className="text-gray-400 font-bold uppercase text-[10px]">
                        Event trigger: <span className="text-white">{log.action}</span>
                      </div>
                      <div className="text-white/60 text-[11px] leading-relaxed font-semibold">
                        {log.details}
                      </div>
                    </div>
                    <div className="text-right text-gray-500 text-[10px] shrink-0 font-bold uppercase tracking-widest">
                      User: {log.userName}
                    </div>
                  </div>
                ))}
                {systemLogs.length === 0 && (
                  <div className="text-center py-10 text-white/20 italic">No historical activities saved.</div>
                )}
              </div>
            </div>
          )}

          {/* INTERACTIVE FIRESTORE VIEW TAB */}
          {activeTab === "firestore-view" && (
            <div className="space-y-10">
              <div>
                <h1 className="text-3xl font-black uppercase tracking-tight text-white">Direct <span className="text-[#00ff88]">Firestore Explorer</span></h1>
                <p className="text-xs text-white/40 mt-1">Inspect and audit live persistent document arrays on Firebase Cloud servers seamlessly.</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                {/* Users nodes */}
                <div className="bg-[#0b0b0b] border border-white/5 p-8 rounded-[32px] space-y-4">
                  <div className="flex items-center justify-between border-b border-white/5 pb-4">
                    <h3 className="text-xs font-black uppercase tracking-widest text-[#00ff88]">Collection: /users/*</h3>
                    <span className="text-[10px] font-mono text-white/30 font-bold">{users.length} docs</span>
                  </div>
                  <div className="p-5 bg-black/40 rounded-2xl text-[10px] font-mono text-white/70 overflow-x-auto select-all h-[300px]">
                    <pre>{JSON.stringify(users, null, 2)}</pre>
                  </div>
                </div>

                {/* Events nodes */}
                <div className="bg-[#0b0b0b] border border-white/5 p-8 rounded-[32px] space-y-4">
                  <div className="flex items-center justify-between border-b border-white/5 pb-4">
                    <h3 className="text-xs font-black uppercase tracking-widest text-purple-400">Collection: /events/*</h3>
                    <span className="text-[10px] font-mono text-white/30 font-bold">{events.length} docs</span>
                  </div>
                  <div className="p-5 bg-black/40 rounded-2xl text-[10px] font-mono text-white/70 overflow-x-auto select-all h-[300px]">
                    <pre>{JSON.stringify(events, null, 2)}</pre>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* SHEETS INTEGRATION */}
          {activeTab === "sheets" && (
            <div className="space-y-10">
              <div>
                <h1 className="text-3xl font-black uppercase tracking-tight text-white">Google Sheets <span className="text-[#00ff88]">Telemetry Sync</span></h1>
                <p className="text-xs text-white/40 mt-1">Export registered chapter audiences and event rosters dynamically to spreadsheet configurations.</p>
              </div>

              <div className="p-10 bg-[#0c0c0c] border border-white/5 rounded-[40px] max-w-4xl space-y-6">
                <div className="flex items-center space-x-3.5 mb-2">
                  <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
                    <Share2 className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-sm font-black tracking-widest text-white">Google Sheet Target Destination</h3>
                    <p className="text-[10px] text-white/30 font-bold uppercase mt-1">Target Worksheet ID binding</p>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black tracking-wider text-white/40 uppercase">SPREADSHEET ID</label>
                  <input
                    type="text"
                    value={spreadsheetId}
                    onChange={(e) => updateSpreadsheetId(e.target.value)}
                    placeholder="Enter Spreadsheet ID or copy paste Spreadsheet URL..."
                    className="w-full px-5 py-4 bg-black/40 border border-white/10 rounded-2xl text-xs font-mono text-white focus:outline-none focus:border-[#00ff88]/40"
                  />
                </div>

                <div className="flex space-x-3 pt-4">
                  <button
                    onClick={handleSheetsSync}
                    disabled={sheetsSyncing}
                    className="px-6 py-4 bg-[#00ff88] text-black font-black uppercase text-[10px] tracking-widest rounded-xl hover:bg-white transition-colors"
                  >
                    {sheetsSyncing ? "Transferring Telemetry logs..." : "Sync Chapter Roster"}
                  </button>
                  <button
                    onClick={() => alert("Successfully initialized automatic daily sheets export triggers!")}
                    className="px-6 py-4 bg-white/5 border border-white/10 hover:bg-white/10 text-white font-black uppercase text-[10px] tracking-widest rounded-xl transition-colors"
                  >
                    Enable Auto-Sync
                  </button>
                </div>
              </div>
            </div>
          )}

         </main>
      </div>

      {/* --- ALL REUSABLE MODALS IN THE CONTEXT OF HIGHLY ACCESSIBLE DESIGN --- */}

      {/* 1. Register/Manage User Modal */}
      {isUserModalOpen && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-full max-w-lg bg-[#0d0d0d] border border-white/10 p-10 rounded-[40px] space-y-6 relative overflow-hidden max-h-[90vh] overflow-y-auto"
          >
            <div className="absolute top-0 right-0 w-24 h-24 bg-[#00ff88]/5 blur-2xl" />
            
            <button 
              onClick={() => setIsUserModalOpen(false)}
              className="absolute top-6 right-6 p-2 rounded-xl text-white/40 hover:bg-white/5 hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <div>
              <h2 className="text-xl font-black uppercase tracking-tight text-white">
                {isEditingUser ? "Elevate Chapter User" : "Add Chapter Student"}
              </h2>
              <p className="text-[10px] text-white/30 uppercase font-black tracking-widest mt-1">Configure user role assignments in Firestore Database.</p>
            </div>

            <form onSubmit={handleSaveUser} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Member Full Name</label>
                <input
                  type="text"
                  required
                  value={userForm.name}
                  onChange={(e) => setUserForm({ ...userForm, name: e.target.value })}
                  className="w-full px-5 py-4 bg-black/40 border border-white/10 rounded-2xl text-xs font-semibold focus:outline-none focus:border-[#00ff88]/30"
                  placeholder="E.g. Meet Khakhkhar"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Email ID</label>
                  <input
                    type="email"
                    required
                    value={userForm.email}
                    onChange={(e) => setUserForm({ ...userForm, email: e.target.value })}
                    className="w-full px-5 py-4 bg-black/40 border border-white/10 rounded-2xl text-xs font-semibold focus:outline-none focus:border-[#00ff88]/30"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Phone Mobile</label>
                  <input
                    type="text"
                    required
                    value={userForm.mobile}
                    onChange={(e) => setUserForm({ ...userForm, mobile: e.target.value })}
                    className="w-full px-5 py-4 bg-black/40 border border-white/10 rounded-2xl text-xs font-semibold focus:outline-none focus:border-[#00ff88]/30"
                    placeholder="+91 88661..."
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Enrollment Number</label>
                  <input
                    type="text"
                    value={userForm.enrollmentNumber}
                    onChange={(e) => setUserForm({ ...userForm, enrollmentNumber: e.target.value })}
                    className="w-full px-5 py-4 bg-black/40 border border-white/10 rounded-2xl text-xs font-semibold focus:outline-none focus:border-[#00ff88]/30"
                    placeholder="MU22BCS108"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Department Sector</label>
                  <select
                    value={userForm.department}
                    onChange={(e) => setUserForm({ ...userForm, department: e.target.value })}
                    className="w-full px-5 py-4 bg-black/40 border border-white/10 rounded-2xl text-xs font-semibold focus:outline-none focus:border-[#00ff88]/30 text-white"
                  >
                    <option value="Computer Science & Engineering">Computer Science & Engineering</option>
                    <option value="Information Technology">Information Technology</option>
                    <option value="ICT Department">ICT Department</option>
                    <option value="Mechanical Department">Mechanical Department</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Course Year</label>
                  <input
                    type="text"
                    value={userForm.yearName}
                    onChange={(e) => setUserForm({ ...userForm, yearName: e.target.value })}
                    className="w-full px-5 py-4 bg-black/40 border border-white/10 rounded-2xl text-xs font-semibold focus:outline-none focus:border-[#00ff88]/30"
                    placeholder="3rd Year"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Authority Role Assign</label>
                  <select
                    value={userForm.role}
                    onChange={(e) => setUserForm({ ...userForm, role: e.target.value })}
                    className="w-full px-5 py-4 bg-black/40 border border-[#00ff88]/35 rounded-2xl text-xs font-semibold focus:outline-none focus:border-[#00ff88]/30 text-white"
                  >
                    <option value="student">Student</option>
                    <option value="committee">Committee Member</option>
                    <option value="sub_admin">Sub Admin</option>
                    <option value="admin">Administrator</option>
                    <option value="super_admin">Main Super Admin</option>
                  </select>
                </div>
              </div>

              {!isEditingUser && (
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Password Credentials</label>
                  <input
                    type="password"
                    value={userForm.password}
                    onChange={(e) => setUserForm({ ...userForm, password: e.target.value })}
                    className="w-full px-5 py-4 bg-black/40 border border-white/10 rounded-2xl text-xs font-semibold focus:outline-none focus:border-[#00ff88]/30"
                    placeholder="student123"
                  />
                </div>
              )}

              <button
                type="submit"
                className="w-full mt-4 py-4 bg-[#00ff88] hover:bg-white text-black font-black uppercase text-[10px] tracking-widest rounded-2xl transition-all shadow-[0_0_20px_rgba(0,255,136,0.2)] hover:shadow-[0_0_35px_rgba(0,255,136,0.4)]"
              >
                {isEditingUser ? "Elevation Sync User" : "Provision Firestore Account"}
              </button>
            </form>
          </motion.div>
        </div>
      )}

      {/* 2. Events Modal */}
      {isEventModalOpen && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-full max-w-lg bg-[#0d0d0d] border border-white/10 p-10 rounded-[40px] space-y-6 relative overflow-hidden"
          >
            <button 
              onClick={() => setIsEventModalOpen(false)}
              className="absolute top-6 right-6 p-2 rounded-xl text-white/40 hover:bg-white/5 hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <div>
              <h2 className="text-xl font-black uppercase tracking-tight text-white">
                {isEditingEvent ? "Modify Chapter Event" : "Organize Chapter Event"}
              </h2>
              <p className="text-[10px] text-white/30 uppercase font-black tracking-widest mt-1">Configure event coordinates and check-in codes.</p>
            </div>

            <form onSubmit={handleSaveEvent} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Event Title</label>
                <input
                  type="text"
                  required
                  value={eventForm.title}
                  onChange={(e) => setEventForm({ ...eventForm, title: e.target.value })}
                  className="w-full px-5 py-4 bg-black/40 border border-white/10 rounded-2xl text-xs font-semibold focus:outline-none focus:border-[#00ff88]/30"
                  placeholder="E.g. Neural Hackathon v2.0"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Operational Description</label>
                <textarea
                  required
                  rows={3}
                  value={eventForm.description}
                  onChange={(e) => setEventForm({ ...eventForm, description: e.target.value })}
                  className="w-full px-5 py-4 bg-black/40 border border-white/10 rounded-2xl text-xs font-semibold focus:outline-none focus:border-[#00ff88]/30"
                  placeholder="A detailed syllabus of programs..."
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Calendar Date</label>
                  <input
                    type="text"
                    required
                    value={eventForm.date}
                    onChange={(e) => setEventForm({ ...eventForm, date: e.target.value })}
                    className="w-full px-5 py-4 bg-black/40 border border-white/10 rounded-2xl text-xs font-semibold focus:outline-none focus:border-[#00ff88]/30"
                    placeholder="28th May"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Campus Location</label>
                  <input
                    type="text"
                    required
                    value={eventForm.location}
                    onChange={(e) => setEventForm({ ...eventForm, location: e.target.value })}
                    className="w-full px-5 py-4 bg-black/40 border border-white/10 rounded-2xl text-xs font-semibold focus:outline-none focus:border-[#00ff88]/30"
                    placeholder="ICT Lab 3"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Poster Banner Link URL</label>
                <input
                  type="text"
                  value={eventForm.poster_url}
                  onChange={(e) => setEventForm({ ...eventForm, poster_url: e.target.value })}
                  className="w-full px-5 py-4 bg-black/40 border border-white/10 rounded-2xl text-xs font-semibold focus:outline-none focus:border-[#00ff88]/30"
                  placeholder="https://images.unsplash.com/..."
                />
              </div>

              <button
                type="submit"
                className="w-full mt-4 py-4 bg-[#00ff88] hover:bg-white text-black font-black uppercase text-[10px] tracking-widest rounded-2xl transition-all shadow-[0_0_20px_rgba(0,255,136,0.2)]"
              >
                {isEditingEvent ? "Save Event Telemetry" : "Publish Chapter Program"}
              </button>
            </form>
          </motion.div>
        </div>
      )}

      {/* 3. Certificate Generate Modal */}
      {isCertModalOpen && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-full max-w-lg bg-[#0d0d0d] border border-white/10 p-10 rounded-[40px] space-y-6 relative overflow-hidden"
          >
            <button 
              onClick={() => setIsCertModalOpen(false)}
              className="absolute top-6 right-6 p-2 rounded-xl text-white/40 hover:bg-white/5 hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <div>
              <h2 className="text-xl font-black uppercase tracking-tight text-white">Generate Accomplishment Badge</h2>
              <p className="text-[10px] text-white/30 uppercase font-black tracking-widest mt-1 font-mono">Issues cryptographically secure PDF logs to student credentials.</p>
            </div>

            <form onSubmit={handleSaveCertificate} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Assign Achiever Student</label>
                <select
                  value={certForm.userId}
                  onChange={(e) => {
                    const val = e.target.value;
                    const student = users.find(u => u.uid === val || u.id === val);
                    setCertForm({
                      ...certForm,
                      userId: val,
                      studentName: student ? student.name : "",
                      studentEmail: student ? student.email : ""
                    });
                  }}
                  className="w-full px-5 py-4 bg-black/40 border border-white/10 rounded-2xl text-xs font-semibold focus:outline-none focus:border-[#00ff88]/30 text-white"
                >
                  <option value="">-- Manual Entry / External Student --</option>
                  {users.filter(u => u.role === "student").map(u => (
                    <option key={u.id} value={u.uid || u.id}>{u.name} ({u.enrollmentNumber || u.enrollment_no})</option>
                  ))}
                </select>
              </div>

              {!certForm.userId && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Manual Student Name</label>
                    <input
                      type="text"
                      required
                      value={certForm.studentName}
                      onChange={(e) => setCertForm({ ...certForm, studentName: e.target.value })}
                      className="w-full px-5 py-4 bg-black/40 border border-white/10 rounded-2xl text-xs font-semibold focus:outline-none focus:border-[#00ff88]/30"
                      placeholder="Meet Khakhkhar"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Manual Student Email</label>
                    <input
                      type="email"
                      required
                      value={certForm.studentEmail}
                      onChange={(e) => setCertForm({ ...certForm, studentEmail: e.target.value })}
                      className="w-full px-5 py-4 bg-black/40 border border-white/10 rounded-2xl text-xs font-semibold focus:outline-none focus:border-[#00ff88]/30"
                      placeholder="meet@marwadiuniversity.ac.in"
                    />
                  </div>
                </div>
              )}

              <div className="space-y-1.5">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Associated GFG Chapter Event</label>
                <input
                  type="text"
                  required
                  value={certForm.eventName}
                  onChange={(e) => setCertForm({ ...certForm, eventName: e.target.value })}
                  className="w-full px-5 py-4 bg-black/40 border border-white/10 rounded-2xl text-xs font-semibold focus:outline-none focus:border-[#00ff88]/30"
                  placeholder="Neural Hackathon v2.0"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Certified Skills (Comma list)</label>
                  <input
                    type="text"
                    required
                    value={certForm.skills}
                    onChange={(e) => setCertForm({ ...certForm, skills: e.target.value })}
                    className="w-full px-5 py-4 bg-black/40 border border-white/10 rounded-2xl text-xs font-semibold focus:outline-none focus:border-[#00ff88]/30"
                    placeholder="Data Structures, Algorithms"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Issue Date Record</label>
                  <input
                    type="text"
                    required
                    value={certForm.issueDate}
                    onChange={(e) => setCertForm({ ...certForm, issueDate: e.target.value })}
                    className="w-full px-5 py-4 bg-black/40 border border-white/10 rounded-2xl text-xs font-semibold focus:outline-none focus:border-[#00ff88]/30"
                    placeholder="May 28th, 2026"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Hashed Serial ID Verification (Unique)</label>
                <input
                  type="text"
                  value={certForm.hash}
                  onChange={(e) => setCertForm({ ...certForm, hash: e.target.value })}
                  className="w-full px-5 py-4 bg-black/40 border border-white/10 rounded-2xl text-xs font-mono focus:outline-none focus:border-[#00ff88]/30"
                  placeholder="GFG-MU-D-99882"
                />
              </div>

              <button
                type="submit"
                className="w-full mt-4 py-4 bg-[#00ff88] hover:bg-white text-black font-black uppercase text-[10px] tracking-widest rounded-2xl transition-all shadow-[0_0_20px_rgba(0,255,136,0.2)]"
              >
                Provision Certificate Record
              </button>
            </form>
          </motion.div>
        </div>
      )}

      {/* 4. Announcements Modal */}
      {isAnnModalOpen && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-full max-w-lg bg-[#0d0d0d] border border-white/10 p-10 rounded-[40px] space-y-6 relative overflow-hidden"
          >
            <button 
              onClick={() => setIsAnnModalOpen(false)}
              className="absolute top-6 right-6 p-2 rounded-xl text-white/40 hover:bg-white/5 hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <div>
              <h2 className="text-xl font-black uppercase tracking-tight text-white">Compose Notice Alert</h2>
              <p className="text-[10px] text-white/30 uppercase font-black tracking-widest mt-1">Publish alerts to live GFG student notices widget.</p>
            </div>

            <form onSubmit={handleSaveAnnouncement} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Compose Title</label>
                <input
                  type="text"
                  required
                  value={annForm.title}
                  onChange={(e) => setAnnForm({ ...annForm, title: e.target.value })}
                  className="w-full px-5 py-4 bg-black/40 border border-white/10 rounded-2xl text-xs font-semibold focus:outline-none"
                  placeholder="Core Committee Registrations Live!"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Composition category Tag</label>
                <select
                  value={annForm.category}
                  onChange={(e) => setAnnForm({ ...annForm, category: e.target.value })}
                  className="w-full px-5 py-4 bg-black/40 border border-[#00ff88]/30 rounded-2xl text-xs font-semibold text-white focus:outline-none"
                >
                  <option value="Notice">Notice Alert</option>
                  <option value="Event">Event Program</option>
                  <option value="Achievement">Achievement Badge</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Core Alert content</label>
                <textarea
                  required
                  rows={4}
                  value={annForm.content}
                  onChange={(e) => setAnnForm({ ...annForm, content: e.target.value })}
                  className="w-full px-5 py-4 bg-black/40 border border-white/10 rounded-2xl text-xs font-semibold focus:outline-none"
                  placeholder="Provide precise bullet logs..."
                />
              </div>

              <button
                type="submit"
                className="w-full mt-4 py-4 bg-[#00ff88] hover:bg-white text-black font-black uppercase text-[10px] tracking-widest rounded-2xl transition-all shadow-[0_0_20px_rgba(0,255,136,0.2)]"
              >
                Broadcast alert Sync
              </button>
            </form>
          </motion.div>
        </div>
      )}

      {/* 5. Student Details Slide-Over Drawer */}
      <AnimatePresence>
        {isDrawerOpen && selectedStudentForDrawer && (
          <div className="fixed inset-0 bg-black/85 backdrop-blur-sm z-50 flex justify-end">
            {/* Backdrop click close */}
            <div className="absolute inset-0 cursor-pointer" onClick={() => setIsDrawerOpen(false)} />

            <motion.div
              initial={{ x: "100%", opacity: 0.9 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: "100%", opacity: 0.9 }}
              transition={{ type: "spring", damping: 30, stiffness: 220 }}
              className="relative w-full max-w-lg h-full bg-[#080808] border-l border-white/10 shadow-2xl flex flex-col justify-between overflow-hidden z-10 font-sans"
            >
              {/* Header */}
              <div className="p-8 border-b border-white/5 bg-[#0e0e0e] flex items-center justify-between select-none">
                <div>
                  <h2 className="text-sm font-black tracking-widest text-[#00ff88] uppercase">Student Registry</h2>
                  <h3 className="text-xl font-black text-white mt-1 uppercase tracking-tight font-sans">Profile & Operations</h3>
                </div>
                <button
                  onClick={() => setIsDrawerOpen(false)}
                  className="p-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-white/60 hover:text-white transition-colors cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Main Content Area */}
              <div className="flex-1 overflow-y-auto p-8 space-y-8 custom-scrollbar">
                {/* Meta Card */}
                <div className="p-6 bg-[#0e0e0e] border border-white/5 rounded-3xl flex items-center space-x-5">
                  <div className="w-16 h-16 rounded-full bg-[#00ff88]/5 border border-[#00ff88]/20 flex items-center justify-center font-mono font-black text-2xl uppercase tracking-wider text-[#00ff88]">
                    {selectedStudentForDrawer.name ? selectedStudentForDrawer.name[0] : "?"}
                  </div>
                  <div>
                    <h4 className="text-lg font-black text-white tracking-tight">{selectedStudentForDrawer.name || "Academic Member"}</h4>
                    <span className="inline-flex items-center space-x-1.5 px-2.5 py-1 rounded-full text-[9px] font-mono font-black uppercase tracking-wider mt-1.5 bg-[#00ff88]/10 border border-[#00ff88]/20 text-[#00ff88]">
                      ★ {selectedStudentForDrawer.points ?? 500} Points
                    </span>
                  </div>
                </div>

                {/* Academic Coordinates */}
                <div className="space-y-4">
                  <h5 className="text-[10px] font-black text-white/20 uppercase tracking-widest font-mono">Academic Parameters</h5>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-4 bg-white/[0.02] border border-white/5 rounded-2xl">
                      <div className="text-[9px] font-bold text-white/30 uppercase tracking-wider">Enrollment size</div>
                      <div className="text-xs font-black text-white mt-1 font-mono uppercase tracking-wider">
                        {selectedStudentForDrawer.enrollmentNumber || selectedStudentForDrawer.enrollment_no || "N/A"}
                      </div>
                    </div>
                    <div className="p-4 bg-white/[0.02] border border-white/5 rounded-2xl">
                      <div className="text-[9px] font-bold text-white/30 uppercase tracking-wider">Term division</div>
                      <div className="text-xs font-black text-white mt-1 uppercase tracking-wider">
                        {selectedStudentForDrawer.yearName || selectedStudentForDrawer.semester || selectedStudentForDrawer.year || "3rd Year"}
                      </div>
                    </div>
                    <div className="col-span-2 p-4 bg-white/[0.02] border border-white/5 rounded-2xl">
                      <div className="text-[9px] font-bold text-white/30 uppercase tracking-wider">Course Branch / Faculty</div>
                      <div className="text-xs font-black text-white mt-1 uppercase tracking-wider">
                        {selectedStudentForDrawer.department || selectedStudentForDrawer.branch || "General Computer Science"}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Account Details & Contacts */}
                <div className="space-y-4">
                  <h5 className="text-[10px] font-black text-white/20 uppercase tracking-widest font-mono">Access & Communication</h5>
                  <div className="space-y-2">
                    <div className="flex justify-between items-center p-4 bg-white/[0.01]/50 border border-white/5 rounded-2xl text-xs">
                      <span className="text-white/40 font-bold">Email Username:</span>
                      <span className="text-white font-mono lowercase select-all font-semibold">{selectedStudentForDrawer.email || "No Email"}</span>
                    </div>
                    <div className="flex justify-between items-center p-4 bg-white/[0.01]/50 border border-white/5 rounded-2xl text-xs">
                      <span className="text-white/40 font-bold">Verification Mobile:</span>
                      <span className="text-white font-mono select-all font-semibold">{selectedStudentForDrawer.mobile || "N/A"}</span>
                    </div>
                    <div className="flex justify-between items-center p-4 bg-white/[0.01]/50 border border-white/5 rounded-2xl text-xs">
                      <span className="text-white/40 font-bold">Account Level:</span>
                      <span className="text-[#00ff88] font-mono font-black uppercase tracking-widest text-[10px]">
                        {selectedStudentForDrawer.role?.replace("_", " ") || "student"}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Verified History activities (Events Joined & Certificates) */}
                <div className="space-y-5">
                  <h5 className="text-[10px] font-black text-white/20 uppercase tracking-widest font-mono">Affiliated Activity Nodes</h5>
                  
                  {/* Attended chapters */}
                  <div className="space-y-2.5">
                    <div className="text-[9px] font-black uppercase text-white/40 tracking-widest">CHAPTER Event Joined Logs ({
                      attendance ? attendance.filter(att => att.userEmail === selectedStudentForDrawer.email || att.userId === selectedStudentForDrawer.id || att.userId === selectedStudentForDrawer.uid).length : 0
                    })</div>
                    {attendance && attendance.filter(att => att.userEmail === selectedStudentForDrawer.email || att.userId === selectedStudentForDrawer.id || att.userId === selectedStudentForDrawer.uid).length > 0 ? (
                      <div className="space-y-1.5 max-h-32 overflow-y-auto">
                        {attendance.filter(att => att.userEmail === selectedStudentForDrawer.email || att.userId === selectedStudentForDrawer.id || att.userId === selectedStudentForDrawer.uid).map((att, index) => (
                          <div key={index} className="flex justify-between items-center p-3.5 bg-black/50 border border-white/5 rounded-xl text-[11px]">
                            <span className="text-white font-black uppercase tracking-tight">{att.eventName || "Event Registered"}</span>
                            <span className="inline-flex items-center text-[10px] font-bold text-[#00ff88]">Check-in Verified</span>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="p-4 bg-white/[0.01] border border-white/5 rounded-2xl text-[10px] font-semibold text-white/20 text-center uppercase tracking-widest select-none font-mono">
                        No checked attendance logs registered.
                      </div>
                    )}
                  </div>

                  {/* Certified awards */}
                  <div className="space-y-2.5">
                    <div className="text-[9px] font-black uppercase text-white/40 tracking-widest">ISSUED CERTIFICATE BADGES ({
                      certificates ? certificates.filter(cert => cert.studentEmail === selectedStudentForDrawer.email || cert.userId === selectedStudentForDrawer.id || cert.userId === selectedStudentForDrawer.uid).length : 0
                    })</div>
                    {certificates && certificates.filter(cert => cert.studentEmail === selectedStudentForDrawer.email || cert.userId === selectedStudentForDrawer.id || cert.userId === selectedStudentForDrawer.uid).length > 0 ? (
                      <div className="space-y-1.5 max-h-32 overflow-y-auto">
                        {certificates.filter(cert => cert.studentEmail === selectedStudentForDrawer.email || cert.userId === selectedStudentForDrawer.id || cert.userId === selectedStudentForDrawer.uid).map((cert, index) => (
                          <div key={index} className="p-3.5 bg-black/50 border border-white/5 rounded-xl flex items-center justify-between text-[11px]">
                            <div>
                              <div className="text-white font-black uppercase tracking-tight">{cert.eventName}</div>
                              <div className="text-[9px] text-white/30 font-medium font-mono mt-0.5">{cert.hash || "GFG-MU-BADGE"}</div>
                            </div>
                            <span className="text-yellow-400 font-bold">★ Certificate</span>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="p-4 bg-white/[0.01] border border-white/5 rounded-2xl text-[10px] font-semibold text-white/20 text-center uppercase tracking-widest select-none font-mono">
                        No academic accomplishments issued.
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Drawer Action persistent Footer operations */}
              <div className="p-8 border-t border-white/5 bg-[#0a0a0a] space-y-4 select-none shrink-0">
                <div className="flex items-center justify-between text-xs font-bold">
                  <span className="text-white/40">Is Registry Active:</span>
                  <span className={cn(
                    "px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-wider",
                    selectedStudentForDrawer.status === "Disabled" 
                      ? "bg-rose-500/15 border border-rose-500/20 text-rose-400" 
                      : "bg-emerald-500/15 border border-[#00ff88]/20 text-[#00ff88]"
                  )}>
                    {selectedStudentForDrawer.status === "Disabled" ? "Disabled" : "Active"}
                  </span>
                </div>

                <div className="flex space-x-3.5">
                  <button
                    onClick={() => toggleUserStatus(selectedStudentForDrawer)}
                    className={cn(
                      "flex-1 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest cursor-pointer transition-all border text-center",
                      selectedStudentForDrawer.status === "Disabled"
                        ? "bg-[#00ff88]/10 hover:bg-[#00ff88] text-[#00ff88] hover:text-black border-[#00ff88]/20"
                        : "bg-rose-500/10 hover:bg-rose-500 text-rose-400 hover:text-white border-rose-500/20"
                    )}
                  >
                    {selectedStudentForDrawer.status === "Disabled" ? "Activate Student Account" : "Deactivate / Suspend Account"}
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
