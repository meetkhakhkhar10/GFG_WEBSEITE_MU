import { motion, AnimatePresence } from "motion/react";
import { Users, User, LogIn, FileText, Settings, LogOut, Plus, Search, Filter, Download, Trash2, Edit2, Check, X, Calendar, CheckCircle2, Loader2, BarChart3 } from "lucide-react";
import { useState, useEffect, FormEvent } from "react";
import { cn } from "@/src/lib/utils";
import { useNavigate } from "react-router-dom";
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";

import AdminAnalytics from "../../components/AdminAnalytics";

export default function Dashboard() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [students, setStudents] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState<"login" | "students" | "analytics" | "settings" | "attendance" | "users">("analytics");

  useEffect(() => {
    const adminUser = localStorage.getItem("admin_user");
    if (!adminUser) {
      navigate("/admin/login");
    } else {
      setLoading(false);
      fetchStudents();
    }
  }, [navigate]);

  useEffect(() => {
    if (activeTab === "students" || activeTab === "users") {
      fetchStudents();
    }
  }, [activeTab]);

  const fetchStudents = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const response = await fetch("/api/users", {
        headers: {
          "Authorization": `Bearer ${token}`
        }
      });
      const result = await response.json();
      
      if (result.success) {
        const mappedData = result.data.map((s: any) => ({
          id: s.id,
          name: s.name,
          roll: s.enrollment_no,
          batch: s.department,
          status: s.role === 'admin' ? 'Admin' : 'Student',
          ...s
        }));
        setStudents(mappedData);
      }
    } catch (err) {
      console.error("Failed to fetch students from server", err);
    } finally {
      setLoading(false);
    }
  };

  const addStudent = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch("/api/users", {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({
          name: newStudent.name,
          email: newStudent.email,
          enrollment_no: newStudent.roll,
          department: newStudent.batch,
          role: "student",
          password: "student123",
          year: "1st Year"
        }),
      });
      const result = await response.json();
      
      if (result.success) {
        setIsStudentModalOpen(false);
        setNewStudent({ name: "", email: "", roll: "", batch: "Lab A" });
        fetchStudents();
      }
    } catch (err) {
      console.error(err);
      alert("Failed to add student");
    }
  };

  const deleteStudent = async (id: string) => {
    if (window.confirm("Are you sure you want to delete this user?")) {
      try {
        const token = localStorage.getItem("token");
        const response = await fetch(`/api/users/${id}`, {
          method: "DELETE",
          headers: {
            "Authorization": `Bearer ${token}`
          }
        });
        const result = await response.json();
        if (result.success) {
          fetchStudents();
        } else {
          throw new Error(result.message);
        }
      } catch (err: any) {
        console.error(err);
        alert(`Failed to delete student: ${err.message}`);
      }
    }
  };

  const updateStudent = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`/api/users/${editingStudent.id}`, {
        method: "PUT",
        headers: { 
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({
          name: editingStudent.name,
          enrollment_no: editingStudent.roll,
          department: editingStudent.batch,
        }),
      });
      const result = await response.json();
      if (result.success) {
        setIsEditModalOpen(false);
        fetchStudents();
      } else {
        throw new Error(result.message);
      }
    } catch (err: any) {
      console.error(err);
      alert(`Failed to update student: ${err.message}`);
    }
  };

  const toggleStatus = async (id: string) => {
    const student = students.find(s => s.id === id);
    if (!student) return;

    const newStatus = student.status === "Present" ? "Absent" : "Present";
    
    try {
      const token = localStorage.getItem("token");
      const response = await fetch("/api/attendance", {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({
          email: student.email,
          enrollment: student.roll,
          eventId: 0, // General attendance if no specific event
          status: newStatus
        }),
      });
      const result = await response.json();
      if (result.success) {
        fetchStudents();
      } else {
        throw new Error(result.message);
      }
    } catch (err: any) {
      console.error(err);
      alert(`Failed to toggle status: ${err.message}`);
    }
  };

  const exportPDF = () => {
    const doc = new jsPDF();
    doc.text(`Attendance Report - ${sessionData.subject} (${sessionData.batch})`, 14, 15);
    doc.text(`Lecturer: ${sessionData.lecturer}`, 14, 25);
    
    const tableData = filteredStudents.map(s => [s.name, s.roll, s.batch, s.status]);
    autoTable(doc, {
      head: [['Name', 'Roll Number', 'Batch', 'Status']],
      body: tableData,
      startY: 35,
    });
    
    doc.save(`attendance_${sessionData.subject}_${new Date().toLocaleDateString()}.pdf`);
  };

  const exportCSV = () => {
    const headers = ["Name", "Roll Number", "Batch", "Status"];
    const rows = filteredStudents.map(s => [s.name, s.roll, s.batch, s.status]);
    const csvContent = [headers, ...rows].map(e => e.join(",")).join("\n");
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", `attendance_${sessionData.subject}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };
  const [attendanceForm, setAttendanceForm] = useState({
    email: "",
    enrollment: "",
    eventId: "evt_001",
    status: "Present" as "Present" | "Absent"
  });
  const [markingAttendance, setMarkingAttendance] = useState(false);

  const [newUser, setNewUser] = useState({
    name: "",
    email: "",
    enrollment: "",
    department: "Computer Engineering",
    year: "1st Year"
  });
  const [addingUser, setAddingUser] = useState(false);

  const handleAddUser = async (e: FormEvent) => {
    e.preventDefault();
    setAddingUser(true);
    try {
      const token = localStorage.getItem("token");
      const response = await fetch("/api/users", {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({
          ...newUser,
          enrollment_no: newUser.enrollment,
          password: "student123"
        }),
      });
      const result = await response.json();
      
      if (result.success) {
        alert("Student Login created successfully!");
        setNewUser({
          name: "",
          email: "",
          enrollment: "",
          department: "Computer Engineering",
          year: "1st Year"
        });
        fetchStudents();
      } else {
        throw new Error(result.message);
      }
    } catch (error: any) {
      console.error("Failed to add user", error);
      alert(`Failed to create student login: ${error.message || "Unknown error"}`);
    } finally {
      setAddingUser(false);
    }
  };

  const handleMarkAttendance = async (e: FormEvent) => {
    e.preventDefault();
    setMarkingAttendance(true);
    try {
      const token = localStorage.getItem("token");
      const response = await fetch("/api/attendance", {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify(attendanceForm),
      });
      const result = await response.json();

      if (result.success) {
        alert("Attendance marked successfully!");
        setAttendanceForm({ ...attendanceForm, email: "", enrollment: "" });
      } else {
        throw new Error(result.message);
      }
    } catch (error: any) {
      console.error("Failed to mark attendance", error);
      alert(`Failed to mark attendance: ${error.message}`);
    } finally {
      setMarkingAttendance(false);
    }
  };

  const renderReports = () => {
    const presentCount = students.filter(s => s.status === "Present").length;
    const absentCount = students.filter(s => s.status === "Absent").length;
    const totalCount = students.length;
    const attendanceRate = totalCount > 0 ? ((presentCount / totalCount) * 100).toFixed(1) : 0;

    return (
      <div className="space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-8 rounded-3xl bg-white/5 border border-white/10 backdrop-blur-xl">
            <div className="text-gray-400 text-sm mb-2 uppercase tracking-widest">Total Students</div>
            <div className="text-4xl font-bold text-white">{totalCount}</div>
          </div>
          <div className="p-8 rounded-3xl bg-white/5 border border-white/10 backdrop-blur-xl">
            <div className="text-gray-400 text-sm mb-2 uppercase tracking-widest">Present Today</div>
            <div className="text-4xl font-bold text-[#00ff88]">{presentCount}</div>
          </div>
          <div className="p-8 rounded-3xl bg-white/5 border border-white/10 backdrop-blur-xl">
            <div className="text-gray-400 text-sm mb-2 uppercase tracking-widest">Attendance Rate</div>
            <div className="text-4xl font-bold text-blue-400">{attendanceRate}%</div>
          </div>
        </div>

        <div className="p-8 rounded-3xl bg-white/5 border border-white/10 backdrop-blur-xl">
          <h3 className="text-xl font-bold mb-6">Batch-wise Distribution</h3>
          <div className="space-y-4">
            {["Lab A", "Lab B"].map(batch => {
              const batchStudents = students.filter(s => s.batch === batch);
              const batchPresent = batchStudents.filter(s => s.status === "Present").length;
              const percentage = batchStudents.length > 0 ? (batchPresent / batchStudents.length) * 100 : 0;
              return (
                <div key={batch} className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>{batch}</span>
                    <span className="text-gray-400">{batchPresent} / {batchStudents.length} Present</span>
                  </div>
                  <div className="h-2 bg-white/5 rounded-full overflow-hidden">
                    <motion.div 
                      initial={{ width: 0 }}
                      animate={{ width: `${percentage}%` }}
                      className="h-full bg-[#00ff88]"
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    );
  };

  const renderSettings = () => {
    return (
      <div className="max-w-2xl space-y-8">
        <div className="p-8 rounded-3xl bg-white/5 border border-white/10 backdrop-blur-xl">
          <h3 className="text-xl font-bold mb-6">Chapter Settings</h3>
          <div className="space-y-6">
            <div>
              <label className="block text-sm text-gray-400 mb-2">Chapter Name</label>
              <input 
                type="text" 
                defaultValue="GFG Student Chapter Marwadi University"
                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl outline-none focus:border-[#00ff88]/50"
              />
            </div>
            <div>
              <label className="block text-sm text-gray-400 mb-2">Admin Email</label>
              <input 
                type="email" 
                defaultValue="meetkhakhkhar05@gmail.com"
                disabled
                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl outline-none opacity-50 cursor-not-allowed"
              />
            </div>
            <button className="px-6 py-3 bg-[#00ff88] text-black font-bold rounded-xl hover:scale-105 transition-all">
              Save Changes
            </button>
          </div>
        </div>

        <div className="p-8 rounded-3xl bg-red-500/5 border border-red-500/10 backdrop-blur-xl">
          <h3 className="text-xl font-bold text-red-500 mb-4">Danger Zone</h3>
          <p className="text-gray-400 text-sm mb-6">Deleting the chapter data is permanent and cannot be undone.</p>
          <button className="px-6 py-3 bg-red-500/10 text-red-500 border border-red-500/20 font-bold rounded-xl hover:bg-red-500 hover:text-white transition-all">
            Reset Database
          </button>
        </div>
      </div>
    );
  };

  const [searchTerm, setSearchTerm] = useState("");
  const [filterBatch, setFilterBatch] = useState("All");
  const [filterStatus, setFilterStatus] = useState("All");

  const filteredStudents = students.filter(s => 
    (s.name.toLowerCase().includes(searchTerm.toLowerCase()) || s.roll.toLowerCase().includes(searchTerm.toLowerCase())) &&
    (filterBatch === "All" || s.batch === filterBatch) &&
    (filterStatus === "All" || s.status === filterStatus)
  );

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [sessionData, setSessionData] = useState({
    lecturer: "",
    subject: "DSA",
    batch: "Lab A",
  });

  const startSession = () => {
    setIsModalOpen(false);
    setFilterBatch(sessionData.batch === "Both" ? "All" : sessionData.batch);
    // Reset attendance for new session (this would need a batch update in Firestore if we want it real-time)
    // For now, we'll just reset the local state if needed, but Firestore is the source of truth.
  };

  const [isStudentModalOpen, setIsStudentModalOpen] = useState(false);
  const [newStudent, setNewStudent] = useState({
    name: "",
    email: "",
    roll: "",
    batch: "Lab A",
  });

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingStudent, setEditingStudent] = useState({
    id: "",
    name: "",
    roll: "",
    batch: "Lab A",
  });

  const openEditModal = (student: any) => {
    setEditingStudent(student);
    setIsEditModalOpen(true);
  };

  const handleLogout = () => {
    localStorage.removeItem("admin_user");
    navigate("/admin/login");
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center">
        <div className="flex flex-col items-center space-y-4">
          <Loader2 className="w-12 h-12 text-[#00ff88] animate-spin" />
          <p className="text-gray-400 animate-pulse">Syncing with Google Sheets...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white flex">
      {/* New Session Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="w-full max-w-md bg-[#1a1a1a] border border-white/10 rounded-3xl p-8 shadow-2xl"
            >
              <h2 className="text-2xl font-bold mb-6">Start New Session</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm text-gray-400 mb-2">Lecturer Name</label>
                  <input
                    type="text"
                    value={sessionData.lecturer}
                    onChange={(e) => setSessionData({ ...sessionData, lecturer: e.target.value })}
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl outline-none focus:border-[#00ff88]/50"
                    placeholder="Enter name"
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-400 mb-2">Subject</label>
                  <select
                    value={sessionData.subject}
                    onChange={(e) => setSessionData({ ...sessionData, subject: e.target.value })}
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl outline-none focus:border-[#00ff88]/50"
                  >
                    <option value="DSA">DSA</option>
                    <option value="Web Dev">Web Dev</option>
                    <option value="AI">AI</option>
                    <option value="Cloud">Cloud</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm text-gray-400 mb-2">Lab Batch</label>
                  <select
                    value={sessionData.batch}
                    onChange={(e) => setSessionData({ ...sessionData, batch: e.target.value })}
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl outline-none focus:border-[#00ff88]/50"
                  >
                    <option value="Lab A">Lab A</option>
                    <option value="Lab B">Lab B</option>
                    <option value="Both">Both (A & B)</option>
                  </select>
                </div>
              </div>
              <div className="flex space-x-4 mt-8">
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="flex-grow py-3 bg-white/5 border border-white/10 rounded-xl hover:bg-white/10 transition-all"
                >
                  Cancel
                </button>
                <button
                  onClick={startSession}
                  className="flex-grow py-3 bg-[#00ff88] text-black font-bold rounded-xl hover:scale-105 transition-all"
                >
                  Start Session
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Add Student Modal */}
      <AnimatePresence>
        {isStudentModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="w-full max-w-md bg-[#1a1a1a] border border-white/10 rounded-3xl p-8 shadow-2xl"
            >
              <h2 className="text-2xl font-bold mb-6">Add New Student</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm text-gray-400 mb-2">Student Name</label>
                  <input
                    type="text"
                    value={newStudent.name}
                    onChange={(e) => setNewStudent({ ...newStudent, name: e.target.value })}
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl outline-none focus:border-[#00ff88]/50"
                    placeholder="Enter name"
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-400 mb-2">Email Address</label>
                  <input
                    type="email"
                    value={newStudent.email}
                    onChange={(e) => setNewStudent({ ...newStudent, email: e.target.value })}
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl outline-none focus:border-[#00ff88]/50"
                    placeholder="Enter email"
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-400 mb-2">Roll Number</label>
                  <input
                    type="text"
                    value={newStudent.roll}
                    onChange={(e) => setNewStudent({ ...newStudent, roll: e.target.value })}
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl outline-none focus:border-[#00ff88]/50"
                    placeholder="Enter roll number"
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-400 mb-2">Lab Batch</label>
                  <select
                    value={newStudent.batch}
                    onChange={(e) => setNewStudent({ ...newStudent, batch: e.target.value })}
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl outline-none focus:border-[#00ff88]/50"
                  >
                    <option value="Lab A">Lab A</option>
                    <option value="Lab B">Lab B</option>
                  </select>
                </div>
              </div>
              <div className="flex space-x-4 mt-8">
                <button
                  onClick={() => setIsStudentModalOpen(false)}
                  className="flex-grow py-3 bg-white/5 border border-white/10 rounded-xl hover:bg-white/10 transition-all"
                >
                  Cancel
                </button>
                <button
                  onClick={addStudent}
                  className="flex-grow py-3 bg-[#00ff88] text-black font-bold rounded-xl hover:scale-105 transition-all"
                >
                  Add Student
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Edit Student Modal */}
      <AnimatePresence>
        {isEditModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="w-full max-w-md bg-[#1a1a1a] border border-white/10 rounded-3xl p-8 shadow-2xl"
            >
              <h2 className="text-2xl font-bold mb-6">Edit Student</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm text-gray-400 mb-2">Student Name</label>
                  <input
                    type="text"
                    value={editingStudent.name}
                    onChange={(e) => setEditingStudent({ ...editingStudent, name: e.target.value })}
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl outline-none focus:border-[#00ff88]/50"
                    placeholder="Enter name"
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-400 mb-2">Roll Number</label>
                  <input
                    type="text"
                    value={editingStudent.roll}
                    onChange={(e) => setEditingStudent({ ...editingStudent, roll: e.target.value })}
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl outline-none focus:border-[#00ff88]/50"
                    placeholder="Enter roll number"
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-400 mb-2">Lab Batch</label>
                  <select
                    value={editingStudent.batch}
                    onChange={(e) => setEditingStudent({ ...editingStudent, batch: e.target.value })}
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl outline-none focus:border-[#00ff88]/50"
                  >
                    <option value="Lab A">Lab A</option>
                    <option value="Lab B">Lab B</option>
                  </select>
                </div>
              </div>
              <div className="flex space-x-4 mt-8">
                <button
                  onClick={() => setIsEditModalOpen(false)}
                  className="flex-grow py-3 bg-white/5 border border-white/10 rounded-xl hover:bg-white/10 transition-all"
                >
                  Cancel
                </button>
                <button
                  onClick={updateStudent}
                  className="flex-grow py-3 bg-[#00ff88] text-black font-bold rounded-xl hover:scale-105 transition-all"
                >
                  Update Student
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <aside className="w-64 bg-black/50 border-r border-white/10 p-6 hidden lg:flex flex-col">
        <div className="flex items-center space-x-2 mb-12">
          <div className="w-10 h-10 rounded-xl bg-[#00ff88]/10 text-[#00ff88] flex items-center justify-center">
            <Calendar className="w-6 h-6" />
          </div>
          <span className="text-xl font-bold">GFG <span className="text-[#00ff88]">Admin</span></span>
        </div>

        <nav className="space-y-2 flex-grow">
          <button
            onClick={() => setActiveTab("login")}
            className={cn(
              "w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-all",
              activeTab === "login" ? "bg-[#00ff88] text-black font-bold" : "text-gray-400 hover:bg-white/5"
            )}
          >
            <LogIn className="w-5 h-5" /> <span>Login</span>
          </button>
          <button
            onClick={() => setActiveTab("students")}
            className={cn(
              "w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-all",
              activeTab === "students" ? "bg-[#00ff88] text-black font-bold" : "text-gray-400 hover:bg-white/5"
            )}
          >
            <Users className="w-5 h-5" /> <span>Students</span>
          </button>
          <button
            onClick={() => setActiveTab("attendance")}
            className={cn(
              "w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-all",
              activeTab === "attendance" ? "bg-[#00ff88] text-black font-bold" : "text-gray-400 hover:bg-white/5"
            )}
          >
            <CheckCircle2 className="w-5 h-5" /> <span>Mark Attendance</span>
          </button>
          <button
            onClick={() => setActiveTab("users")}
            className={cn(
              "w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-all",
              activeTab === "users" ? "bg-[#00ff88] text-black font-bold" : "text-gray-400 hover:bg-white/5"
            )}
          >
            <User className="w-5 h-5" /> <span>User Management</span>
          </button>
          <button
            onClick={() => navigate("/admin/events")}
            className="w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-all text-gray-400 hover:bg-white/5"
          >
            <Calendar className="w-5 h-5" /> <span>Manage Events</span>
          </button>
          <button 
            onClick={() => setActiveTab("analytics")}
            className={cn(
              "w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-all",
              activeTab === "analytics" ? "bg-[#00ff88] text-black font-bold" : "text-gray-400 hover:bg-white/5"
            )}
          >
            <BarChart3 className="w-5 h-5" /> <span>Analytics</span>
          </button>
          <button 
            onClick={() => setActiveTab("settings")}
            className={cn(
              "w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-all",
              activeTab === "settings" ? "bg-[#00ff88] text-black font-bold" : "text-gray-400 hover:bg-white/5"
            )}
          >
            <Settings className="w-5 h-5" /> <span>Settings</span>
          </button>
        </nav>

        <button 
          onClick={handleLogout}
          className="mt-auto flex items-center space-x-3 px-4 py-3 rounded-xl text-red-400 hover:bg-red-500/10 transition-all"
        >
          <LogOut className="w-5 h-5" /> <span>Logout</span>
        </button>
      </aside>

      {/* Main Content */}
      <main className="flex-grow p-6 md:p-10 overflow-y-auto">
        <header className="flex flex-col md:flex-row md:items-center justify-between mb-10 gap-4">
          <div>
            <h1 className="text-3xl font-bold mb-2">
              {activeTab === "login" && "Login Management"}
              {activeTab === "students" && "Student Management"}
              {activeTab === "attendance" && "Mark Attendance"}
              {activeTab === "users" && "User Management"}
              {activeTab === "analytics" && "Analytics Overview"}
              {activeTab === "settings" && "System Settings"}
            </h1>
            <p className="text-gray-400">Welcome back, Admin</p>
          </div>
          
          <div className="flex items-center space-x-4">
            {(activeTab === "login" || activeTab === "students" || activeTab === "users") && (
              <button 
                onClick={() => {
                  if (activeTab === "login") setIsModalOpen(true);
                  else if (activeTab === "students") setIsStudentModalOpen(true);
                }}
                className={cn(
                  "px-6 py-3 bg-[#00ff88] text-black font-bold rounded-xl flex items-center hover:scale-105 transition-all active:scale-95",
                  activeTab === "users" && "hidden"
                )}
              >
                <Plus className="w-5 h-5 mr-2" /> {activeTab === "login" ? "New Session" : "Add Student"}
              </button>
            )}
          </div>
        </header>

        {activeTab === "analytics" ? (
          <AdminAnalytics stats={null} />
        ) : activeTab === "settings" ? (
          renderSettings()
        ) : activeTab === "attendance" ? (
          <div className="max-w-2xl">
            <div className="p-8 rounded-[32px] bg-white/5 border border-white/10">
              <h2 className="text-2xl font-bold text-white mb-8">Mark Attendance</h2>
              <form onSubmit={handleMarkAttendance} className="space-y-6">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-gray-500 uppercase tracking-widest ml-2">Event</label>
                  <select 
                    value={attendanceForm.eventId}
                    onChange={(e) => setAttendanceForm({...attendanceForm, eventId: e.target.value})}
                    className="w-full px-6 py-4 bg-white/5 border border-white/10 rounded-2xl outline-none focus:border-[#00ff88]/50 transition-all appearance-none"
                  >
                    <option value="evt_001" className="bg-[#111]">Code-A-Thon 2024</option>
                    <option value="evt_002" className="bg-[#111]">AI Workshop</option>
                    <option value="evt_003" className="bg-[#111]">Cloud Summit</option>
                  </select>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-gray-500 uppercase tracking-widest ml-2">Email</label>
                    <input 
                      required
                      type="email" 
                      placeholder="john@example.com"
                      value={attendanceForm.email}
                      onChange={(e) => setAttendanceForm({...attendanceForm, email: e.target.value})}
                      className="w-full px-6 py-4 bg-white/5 border border-white/10 rounded-2xl outline-none focus:border-[#00ff88]/50 transition-all"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-gray-500 uppercase tracking-widest ml-2">Enrollment</label>
                    <input 
                      required
                      type="text" 
                      placeholder="2100000000"
                      value={attendanceForm.enrollment}
                      onChange={(e) => setAttendanceForm({...attendanceForm, enrollment: e.target.value})}
                      className="w-full px-6 py-4 bg-white/5 border border-white/10 rounded-2xl outline-none focus:border-[#00ff88]/50 transition-all"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-gray-500 uppercase tracking-widest ml-2">Status</label>
                  <div className="flex items-center space-x-4">
                    <button 
                      type="button"
                      onClick={() => setAttendanceForm({...attendanceForm, status: 'Present'})}
                      className={cn(
                        "flex-1 py-4 rounded-2xl font-bold transition-all border",
                        attendanceForm.status === 'Present' ? "bg-green-500/20 text-green-500 border-green-500/50" : "bg-white/5 text-gray-400 border-white/10"
                      )}
                    >
                      Present
                    </button>
                    <button 
                      type="button"
                      onClick={() => setAttendanceForm({...attendanceForm, status: 'Absent'})}
                      className={cn(
                        "flex-1 py-4 rounded-2xl font-bold transition-all border",
                        attendanceForm.status === 'Absent' ? "bg-red-500/20 text-red-500 border-red-500/50" : "bg-white/5 text-gray-400 border-white/10"
                      )}
                    >
                      Absent
                    </button>
                  </div>
                </div>
                <button 
                  disabled={markingAttendance}
                  className="w-full py-5 bg-[#00ff88] text-black font-black rounded-2xl hover:scale-[1.02] transition-all flex items-center justify-center disabled:opacity-50"
                >
                  {markingAttendance ? <Loader2 className="w-6 h-6 animate-spin" /> : "Mark Attendance"}
                </button>
              </form>
            </div>
          </div>
        ) : activeTab === "users" ? (
          <div className="max-w-4xl space-y-8">
            <div className="p-8 rounded-[32px] bg-white/5 border border-white/10">
              <h2 className="text-2xl font-bold text-white mb-8">Create Student Login</h2>
              <form onSubmit={handleAddUser} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-gray-500 uppercase tracking-widest ml-2">Full Name</label>
                    <input 
                      required
                      type="text" 
                      placeholder="John Doe"
                      value={newUser.name}
                      onChange={(e) => setNewUser({...newUser, name: e.target.value})}
                      className="w-full px-6 py-4 bg-white/5 border border-white/10 rounded-2xl outline-none focus:border-[#00ff88]/50 transition-all"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-gray-500 uppercase tracking-widest ml-2">Email Address</label>
                    <input 
                      required
                      type="email" 
                      placeholder="john@example.com"
                      value={newUser.email}
                      onChange={(e) => setNewUser({...newUser, email: e.target.value})}
                      className="w-full px-6 py-4 bg-white/5 border border-white/10 rounded-2xl outline-none focus:border-[#00ff88]/50 transition-all"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-gray-500 uppercase tracking-widest ml-2">Enrollment Number (Password)</label>
                    <input 
                      required
                      type="text" 
                      placeholder="2100000000"
                      value={newUser.enrollment}
                      onChange={(e) => setNewUser({...newUser, enrollment: e.target.value})}
                      className="w-full px-6 py-4 bg-white/5 border border-white/10 rounded-2xl outline-none focus:border-[#00ff88]/50 transition-all"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-gray-500 uppercase tracking-widest ml-2">Department</label>
                    <select 
                      value={newUser.department}
                      onChange={(e) => setNewUser({...newUser, department: e.target.value})}
                      className="w-full px-6 py-4 bg-white/5 border border-white/10 rounded-2xl outline-none focus:border-[#00ff88]/50 transition-all appearance-none"
                    >
                      <option value="Computer Engineering" className="bg-[#111]">Computer Engineering</option>
                      <option value="Information Technology" className="bg-[#111]">Information Technology</option>
                      <option value="ICT" className="bg-[#111]">ICT</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-gray-500 uppercase tracking-widest ml-2">Year</label>
                    <select 
                      value={newUser.year}
                      onChange={(e) => setNewUser({...newUser, year: e.target.value})}
                      className="w-full px-6 py-4 bg-white/5 border border-white/10 rounded-2xl outline-none focus:border-[#00ff88]/50 transition-all appearance-none"
                    >
                      <option value="1st Year" className="bg-[#111]">1st Year</option>
                      <option value="2nd Year" className="bg-[#111]">2nd Year</option>
                      <option value="3rd Year" className="bg-[#111]">3rd Year</option>
                      <option value="4th Year" className="bg-[#111]">4th Year</option>
                    </select>
                  </div>
                </div>
                <button 
                  disabled={addingUser}
                  className="w-full py-5 bg-[#00ff88] text-black font-black rounded-2xl hover:scale-[1.02] transition-all flex items-center justify-center disabled:opacity-50"
                >
                  {addingUser ? <Loader2 className="w-6 h-6 animate-spin" /> : "Create Student Login"}
                </button>
              </form>
            </div>
          </div>
        ) : (
          <>
            {/* Filters & Search */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <div className="relative lg:col-span-1">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                <input
                  type="text"
                  placeholder="Search by name or roll..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-12 pr-4 py-4 bg-white/5 border border-white/10 rounded-2xl outline-none focus:border-[#00ff88]/50 transition-all"
                />
              </div>
              
              <div className="relative">
                <Filter className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                <select
                  value={filterBatch}
                  onChange={(e) => setFilterBatch(e.target.value)}
                  className="w-full pl-12 pr-4 py-4 bg-white/5 border border-white/10 rounded-2xl outline-none focus:border-[#00ff88]/50 transition-all appearance-none"
                >
                  <option value="All">All Batches</option>
                  <option value="Lab A">Lab A</option>
                  <option value="Lab B">Lab B</option>
                </select>
              </div>

              <div className="relative">
                <Check className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="w-full pl-12 pr-4 py-4 bg-white/5 border border-white/10 rounded-2xl outline-none focus:border-[#00ff88]/50 transition-all appearance-none"
                >
                  <option value="All">All Status</option>
                  <option value="Present">Present</option>
                  <option value="Absent">Absent</option>
                </select>
              </div>

              <div className="flex space-x-4 md:col-span-2 lg:col-span-1">
                <button 
                  onClick={exportPDF}
                  className="flex-grow py-4 bg-white/5 border border-white/10 rounded-2xl flex items-center justify-center hover:bg-white/10 transition-all"
                >
                  <Download className="w-5 h-5 mr-2" /> Export PDF
                </button>
                <button 
                  onClick={exportCSV}
                  className="flex-grow py-4 bg-white/5 border border-white/10 rounded-2xl flex items-center justify-center hover:bg-white/10 transition-all"
                >
                  <Download className="w-5 h-5 mr-2" /> Export CSV
                </button>
              </div>
            </div>

            {/* Table */}
            <div className="bg-white/5 border border-white/10 rounded-3xl overflow-hidden backdrop-blur-xl">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-white/10 bg-white/5">
                      <th className="px-6 py-4 text-sm font-semibold text-gray-400">Student Name</th>
                      <th className="px-6 py-4 text-sm font-semibold text-gray-400">Roll Number</th>
                      <th className="px-6 py-4 text-sm font-semibold text-gray-400">Batch</th>
                      <th className="px-6 py-4 text-sm font-semibold text-gray-400">Status</th>
                      <th className="px-6 py-4 text-sm font-semibold text-gray-400 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {filteredStudents.map((student) => (
                      <tr key={student.id} className="hover:bg-white/5 transition-colors group">
                        <td className="px-6 py-4 font-medium">{student.name}</td>
                        <td className="px-6 py-4 text-gray-400">{student.roll}</td>
                        <td className="px-6 py-4">
                          <span className="px-3 py-1 bg-white/5 border border-white/10 rounded-full text-xs">
                            {student.batch}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <button
                            onClick={() => toggleStatus(student.id)}
                            className={cn(
                              "px-4 py-1.5 rounded-full text-xs font-bold transition-all flex items-center",
                              student.status === "Present" 
                                ? "bg-green-500/20 text-green-500 border border-green-500/30" 
                                : "bg-red-500/20 text-red-500 border border-red-500/30"
                            )}
                          >
                            {student.status === "Present" ? <Check className="w-3 h-3 mr-1" /> : <X className="w-3 h-3 mr-1" />}
                            {student.status}
                          </button>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <div className="flex items-center justify-end space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button 
                              onClick={() => openEditModal(student)}
                              className="p-2 hover:bg-[#00ff88]/10 text-[#00ff88] rounded-lg transition-colors"
                            >
                              <Edit2 className="w-4 h-4" />
                            </button>
                            <button 
                              onClick={() => deleteStudent(student.id)}
                              className="p-2 hover:bg-red-500/10 text-red-500 rounded-lg transition-colors"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              
              {filteredStudents.length === 0 && (
                <div className="p-20 text-center text-gray-500">
                  No students found matching your criteria.
                </div>
              )}
            </div>
          </>
        )}
      </main>
    </div>
  );
}
