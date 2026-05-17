import { motion, AnimatePresence } from "motion/react";
import { 
  User, 
  Calendar, 
  Award, 
  LogOut, 
  BarChart3, 
  CheckCircle2, 
  XCircle, 
  PieChart, 
  Download, 
  ExternalLink, 
  Loader2, 
  Search,
  LayoutDashboard,
  FileText,
  Image as ImageIcon,
  Trophy,
  Camera
} from "lucide-react";
import { useState, useEffect } from "react";
import { useAuth } from "@/src/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { cn } from "@/src/lib/utils";

import Leaderboard from "../../components/Leaderboard";
import AttendanceScanner from "../../components/AttendanceScanner";
import { apiService } from "../../services/apiService";

export default function StudentPortal() {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<"dashboard" | "attendance" | "certificates" | "posters" | "leaderboard" | "checkin">("dashboard");
  
  const [attendanceData, setAttendanceData] = useState<any[]>([]);
  const [certificates, setCertificates] = useState<any[]>([]);
  const [events, setEvents] = useState<any[]>([]);
  const [registrations, setRegistrations] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!localStorage.getItem('token')) {
      navigate("/");
      return;
    }

    const fetchData = async () => {
      setLoading(true);
      try {
        const [eventsRes, attendanceRes, registrationsRes] = await Promise.all([
          apiService.getEvents(),
          apiService.getMyAttendance(),
          apiService.getMyRegistrations()
        ]);

        if (eventsRes.success) setEvents(eventsRes.data);
        if (attendanceRes.success) setAttendanceData(attendanceRes.data);
        if (registrationsRes.success) setRegistrations(registrationsRes.data);
        
      } catch (error) {
        console.error("Failed to fetch student data", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [navigate]);

  // Filter events based on attendance or registration
  const registeredEvents = events.filter(event => {
    const isRegistered = registrations.some(r => String(r.event_id) === String(event.id));
    const isAttended = attendanceData.some(a => String(a.event_id) === String(event.id));
    return isRegistered || isAttended;
  });

  const stats = {
    total: attendanceData.length,
    present: attendanceData.length, // In this mockup every record in attendanceData is a presence
    absent: 0,
    percentage: 100,
    certs: certificates.length,
    registrations: registrations.length
  };

  if (!isAuthenticated) return null;

  // Enrich attendance data with event titles
  const enrichedAttendance = attendanceData.map(record => {
    const event = events.find(e => String(e.id) === String(record.event_id));
    return {
      ...record,
      eventName: event ? event.title : record.event_title || `Event #${record.event_id}`,
      eventDate: event ? event.date : record.marked_at
    };
  });

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white flex flex-col lg:flex-row">
      {/* Sidebar */}
      <aside className="w-full lg:w-64 bg-black/50 border-r border-white/10 p-6 flex flex-col">
        <div className="flex items-center space-x-3 mb-12">
          <div className="w-10 h-10 rounded-xl bg-[#00ff88]/10 text-[#00ff88] flex items-center justify-center">
            <User className="w-6 h-6" />
          </div>
          <div className="overflow-hidden">
            <h2 className="font-bold truncate">{user?.name}</h2>
            <p className="text-xs text-gray-500 truncate">{user?.email}</p>
          </div>
        </div>

        <nav className="space-y-2 flex-grow">
          <button
            onClick={() => setActiveTab("dashboard")}
            className={cn(
              "w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-all",
              activeTab === "dashboard" ? "bg-[#00ff88] text-black font-bold" : "text-gray-400 hover:bg-white/5"
            )}
          >
            <LayoutDashboard className="w-5 h-5" /> <span>Dashboard</span>
          </button>
          <button
            onClick={() => setActiveTab("attendance")}
            className={cn(
              "w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-all",
              activeTab === "attendance" ? "bg-[#00ff88] text-black font-bold" : "text-gray-400 hover:bg-white/5"
            )}
          >
            <Calendar className="w-5 h-5" /> <span>Attendance</span>
          </button>
          <button
            onClick={() => setActiveTab("certificates")}
            className={cn(
              "w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-all",
              activeTab === "certificates" ? "bg-[#00ff88] text-black font-bold" : "text-gray-400 hover:bg-white/5"
            )}
          >
            <Award className="w-5 h-5" /> <span>Certificates</span>
          </button>
          <button
            onClick={() => setActiveTab("posters")}
            className={cn(
              "w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-all",
              activeTab === "posters" ? "bg-[#00ff88] text-black font-bold" : "text-gray-400 hover:bg-white/5"
            )}
          >
            <ImageIcon className="w-5 h-5" /> <span>Event Posters</span>
          </button>
          <button
            onClick={() => setActiveTab("leaderboard")}
            className={cn(
              "w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-all",
              activeTab === "leaderboard" ? "bg-[#00ff88] text-black font-bold" : "text-gray-400 hover:bg-white/5"
            )}
          >
            <Trophy className="w-5 h-5" /> <span>Leaderboard</span>
          </button>
          <button
            onClick={() => setActiveTab("checkin")}
            className={cn(
              "w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-all",
              activeTab === "checkin" ? "bg-[#00ff88] text-black font-bold" : "text-gray-400 hover:bg-white/5"
            )}
          >
            <Camera className="w-5 h-5" /> <span>Check-in</span>
          </button>
        </nav>

        <button 
          onClick={() => {
            logout();
            navigate("/");
          }}
          className="mt-8 flex items-center space-x-3 px-4 py-3 rounded-xl text-red-400 hover:bg-red-500/10 transition-all"
        >
          <LogOut className="w-5 h-5" /> <span>Logout</span>
        </button>
      </aside>

      {/* Main Content */}
      <main className="flex-grow p-6 lg:p-10 overflow-y-auto">
        {loading ? (
          <div className="h-full flex flex-col items-center justify-center space-y-4">
            <Loader2 className="w-12 h-12 text-[#00ff88] animate-spin" />
            <p className="text-gray-400 animate-pulse font-mono">Syncing your data...</p>
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-6xl mx-auto"
          >
            {/* Header */}
            <div className="mb-10">
              <h1 className="text-3xl font-bold mb-2">
                {activeTab === "dashboard" && "Student Dashboard"}
                {activeTab === "attendance" && "My Attendance"}
                {activeTab === "certificates" && "My Certificates"}
                {activeTab === "posters" && "Event Posters"}
              </h1>
              <p className="text-gray-400">Welcome back to your personal portal.</p>
            </div>

            {activeTab === "dashboard" && (
              <div className="space-y-8">
                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  <div className="p-6 rounded-3xl bg-white/5 border border-white/10 backdrop-blur-xl">
                    <BarChart3 className="w-6 h-6 text-[#00ff88] mb-4" />
                    <div className="text-gray-400 text-xs font-bold uppercase tracking-widest mb-1">Total Events</div>
                    <div className="text-3xl font-bold text-white">{stats.total}</div>
                  </div>
                  <div className="p-6 rounded-3xl bg-white/5 border border-white/10 backdrop-blur-xl">
                    <CheckCircle2 className="w-6 h-6 text-green-500 mb-4" />
                    <div className="text-gray-400 text-xs font-bold uppercase tracking-widest mb-1">Attended</div>
                    <div className="text-3xl font-bold text-white">{stats.present}</div>
                  </div>
                  <div className="p-6 rounded-3xl bg-white/5 border border-white/10 backdrop-blur-xl">
                    <Award className="w-6 h-6 text-blue-400 mb-4" />
                    <div className="text-gray-400 text-xs font-bold uppercase tracking-widest mb-1">Certificates</div>
                    <div className="text-3xl font-bold text-white">{stats.certs}</div>
                  </div>
                  <div className="p-6 rounded-3xl bg-[#00ff88]/10 border border-[#00ff88]/20 backdrop-blur-xl">
                    <PieChart className="w-6 h-6 text-[#00ff88] mb-4" />
                    <div className="text-gray-400 text-xs font-bold uppercase tracking-widest mb-1">Attendance Rate</div>
                    <div className="text-3xl font-bold text-[#00ff88]">{stats.percentage}%</div>
                  </div>
                </div>

                {/* Profile Card */}
                <div className="p-8 rounded-[32px] bg-white/5 border border-white/10 backdrop-blur-xl">
                  <h3 className="text-xl font-bold mb-6 flex items-center">
                    <User className="w-5 h-5 mr-2 text-[#00ff88]" /> Student Profile
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-4">
                      <div>
                        <label className="text-xs font-bold text-gray-500 uppercase tracking-widest">Full Name</label>
                        <div className="text-lg font-medium text-white">{user?.name}</div>
                      </div>
                      <div>
                        <label className="text-xs font-bold text-gray-500 uppercase tracking-widest">Email Address</label>
                        <div className="text-lg font-medium text-white">{user?.email}</div>
                      </div>
                    </div>
                    <div className="space-y-4">
                      <div>
                        <label className="text-xs font-bold text-gray-500 uppercase tracking-widest">Enrollment Number</label>
                        <div className="text-lg font-medium text-white">{user?.enrollment_no}</div>
                      </div>
                      <div>
                        <label className="text-xs font-bold text-gray-500 uppercase tracking-widest">Department & Year</label>
                        <div className="text-lg font-medium text-white">{user?.department} - {user?.year}</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === "attendance" && (
              <div className="rounded-[32px] bg-white/5 border border-white/10 overflow-hidden backdrop-blur-xl">
                <div className="overflow-x-auto">
                  <table className="w-full text-left">
                    <thead>
                      <tr className="bg-white/5">
                        <th className="px-8 py-6 text-xs font-bold text-gray-500 uppercase tracking-widest">Event Name</th>
                        <th className="px-8 py-6 text-xs font-bold text-gray-500 uppercase tracking-widest">Date</th>
                        <th className="px-8 py-6 text-xs font-bold text-gray-500 uppercase tracking-widest">Status</th>
                        <th className="px-8 py-6 text-xs font-bold text-gray-500 uppercase tracking-widest text-right">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                      {enrichedAttendance.map((record, i) => (
                        <tr key={i} className="hover:bg-white/5 transition-colors">
                          <td className="px-8 py-6 text-white font-medium">{record.eventName}</td>
                          <td className="px-8 py-6 text-gray-400 text-sm">
                            {record.eventDate}
                          </td>
                          <td className="px-8 py-6">
                            <span className={cn(
                              "px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest border",
                              (record.status || 'Present') === 'Present' 
                                ? 'bg-green-500/10 text-green-500 border-green-500/20' 
                                : 'bg-red-500/10 text-red-500 border-red-500/20'
                            )}>
                              {record.status || 'Present'}
                            </span>
                          </td>
                          <td className="px-8 py-6 text-right">
                            {(record.status || 'Present') === 'Present' ? (
                              <button 
                                onClick={() => setActiveTab("certificates")}
                                className="inline-flex items-center text-[#00ff88] text-sm font-bold hover:underline"
                              >
                                View Certificate <Award className="ml-2 w-4 h-4" />
                              </button>
                            ) : (
                              <span className="text-gray-600 text-xs italic">Not Available</span>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                {attendanceData.length === 0 && (
                  <div className="p-20 text-center text-gray-500">
                    No attendance records found.
                  </div>
                )}
              </div>
            )}

            {activeTab === "certificates" && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {certificates.map((cert, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: i * 0.05 }}
                    className="group p-6 rounded-[32px] bg-white/5 border border-white/10 hover:border-[#00ff88]/30 transition-all relative overflow-hidden"
                  >
                    <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                      <Award className="w-20 h-20 text-[#00ff88]" />
                    </div>
                    
                    <div className="relative z-10">
                      <div className="w-12 h-12 mb-6 rounded-2xl bg-[#00ff88]/10 text-[#00ff88] flex items-center justify-center group-hover:scale-110 transition-transform">
                        <Award className="w-6 h-6" />
                      </div>
                      <h3 className="text-xl font-bold text-white mb-1">{cert.event_title}</h3>
                      <p className="text-gray-500 text-[10px] font-bold uppercase tracking-widest mb-6">Event: {cert.event_title}</p>
                      
                      <div className="flex items-center space-x-3">
                        <a 
                          href={cert.url} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="flex-1 py-3 bg-[#00ff88] text-black font-bold rounded-xl hover:scale-105 transition-all flex items-center justify-center text-sm"
                        >
                          Download <Download className="ml-2 w-4 h-4" />
                        </a>
                        <button className="p-3 bg-white/5 border border-white/10 text-white rounded-xl hover:bg-white/10 transition-all">
                          <ExternalLink className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </motion.div>
                ))}

                {certificates.length === 0 && (
                  <div className="col-span-full p-20 text-center rounded-[40px] bg-white/5 border border-white/10">
                    <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-6">
                      <XCircle className="w-8 h-8 text-gray-600" />
                    </div>
                    <h3 className="text-xl font-bold text-white mb-2">No Certificates Found</h3>
                    <p className="text-gray-500 text-sm">Attend events to earn certificates!</p>
                  </div>
                )}
              </div>
            )}

            {activeTab === "leaderboard" && (
              <Leaderboard />
            )}

            {activeTab === "checkin" && (
              <AttendanceScanner />
            )}

            {activeTab === "posters" && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {registeredEvents.map((event, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.1 }}
                    className="group bg-white/5 border border-white/10 rounded-[32px] overflow-hidden hover:border-[#00ff88]/30 transition-all flex flex-col h-full"
                  >
                    <div className="aspect-[4/5] relative overflow-hidden bg-black/20">
                      {event.poster_url ? (
                        <img 
                          src={event.poster_url} 
                          alt={event.title} 
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                          referrerPolicy="no-referrer"
                        />
                      ) : (
                        <div className="w-full h-full flex flex-col items-center justify-center text-gray-600 bg-white/5">
                          <ImageIcon className="w-12 h-12 mb-2" />
                          <span className="text-xs uppercase font-bold tracking-widest">No Poster Available</span>
                        </div>
                      )}
                      <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-60" />
                    </div>
                    
                    <div className="p-6 flex flex-col flex-grow">
                      <div className="flex-grow">
                        <div className="text-[#00ff88] text-[10px] font-bold uppercase tracking-widest mb-2 flex items-center">
                          <Calendar className="w-3 h-3 mr-1" /> {event.date}
                        </div>
                        <h3 className="text-xl font-bold text-white mb-2 line-clamp-1">{event.title}</h3>
                        <p className="text-gray-400 text-sm line-clamp-2 mb-6">{event.description}</p>
                      </div>

                      {event.poster_url && (
                        <a 
                          href={event.poster_url} 
                          download={`${event.title}_Poster`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="w-full py-4 bg-white/5 border border-white/10 hover:bg-[#00ff88] hover:text-black hover:border-transparent rounded-2xl font-bold text-sm transition-all flex items-center justify-center group/btn"
                        >
                          Download Poster <Download className="ml-2 w-4 h-4 group-hover/btn:translate-y-0.5 transition-transform" />
                        </a>
                      )}
                    </div>
                  </motion.div>
                ))}

                {registeredEvents.length === 0 && (
                  <div className="col-span-full p-20 text-center rounded-[40px] bg-white/5 border border-white/10">
                    <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-6">
                      <ImageIcon className="w-8 h-8 text-gray-600" />
                    </div>
                    <h3 className="text-xl font-bold text-white mb-2">No Posters Found</h3>
                    <p className="text-gray-500 text-sm">Register for upcoming events to see posters here!</p>
                  </div>
                )}
              </div>
            )}
          </motion.div>
        )}
      </main>
    </div>
  );
}
