import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import fs from "fs";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import cors from "cors";
import { GoogleGenAI } from "@google/genai";

let aiClient: GoogleGenAI | null = null;
function getGeminiClient(): GoogleGenAI {
  if (!aiClient) {
    const key = process.env.GEMINI_API_KEY;
    if (!key) {
      throw new Error("GEMINI_API_KEY environment variable is required");
    }
    aiClient = new GoogleGenAI({
      apiKey: key,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        }
      }
    });
  }
  return aiClient;
}

// Import our beautiful Firestore Database wrappers
import {
  initializeFirestoreStore,
  getFirebaseUsers,
  saveFirebaseUser,
  deleteFirebaseUser,
  getFirebaseEvents,
  saveFirebaseEvent,
  deleteFirebaseEvent,
  getFirebaseAnnouncements,
  saveFirebaseAnnouncement,
  deleteFirebaseAnnouncement,
  getFirebaseCertificates,
  saveFirebaseCertificate,
  deleteFirebaseCertificate,
  getFirebaseRegistrations,
  saveFirebaseRegistration,
  getFirebaseAttendance,
  saveFirebaseAttendance,
  getFirebaseLogs,
  saveFirebaseLog,
  getFirebaseSetting,
  saveFirebaseSetting,
  getFirebaseTeam,
  saveFirebaseTeamMember,
  deleteFirebaseTeamMember
} from "./src/services/firebaseDb.server.js";

const app = express();
const PORT = 3000;
const SECRET_KEY = "mu_super_secret_key";
app.use(express.json());
app.use(cors());

// Initialize Firestore on startup (Seeds default records if database is empty)
initializeFirestoreStore();

// --- Auth Middleware with Role System ---
const authenticate = async (req: any, res: any, next: any) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return res.status(401).json({ message: "No token provided" });

  try {
    const decoded = jwt.verify(token, SECRET_KEY) as any;
    req.userId = decoded.userId;
    req.userRole = decoded.role;
    next();
  } catch (err) {
    return res.status(401).json({ message: "Invalid or expired token" });
  }
};

// Check for minimum Admin permission level
const adminOnly = (req: any, res: any, next: any) => {
  const superRoles = ["super_admin", "admin"];
  if (!superRoles.includes(req.userRole)) {
    return res.status(403).json({ message: "Admin permission required" });
  }
  next();
};

// Check for minimum Sub-Admin permission level
const subAdminOnly = (req: any, res: any, next: any) => {
  const staffRoles = ["super_admin", "admin", "sub_admin"];
  if (!staffRoles.includes(req.userRole)) {
    return res.status(403).json({ message: "Sub-Admin/Staff authorization required" });
  }
  next();
};

// Check for minimum Committee/Staff level
const staffOnly = (req: any, res: any, next: any) => {
  const staffRoles = ["super_admin", "admin", "sub_admin", "committee"];
  if (!staffRoles.includes(req.userRole)) {
    return res.status(403).json({ message: "Staff authorization required" });
  }
  next();
};

// --- API TOKENS & ROUTES ---

// 1. Authentication
app.post("/api/auth/register", async (req, res) => {
  const { name, email, password, role, enrollment_no, department, year, mobile, profilePhoto, permissions } = req.body;
  
  try {
    const users = await getFirebaseUsers();
    if (users.find(u => u.email === email || (enrollment_no && u.enrollmentNumber === enrollment_no))) {
      return res.status(400).json({ success: false, message: "User account already exists" });
    }

    const userId = "usr_" + Math.random().toString(36).substring(7);
    const passwordHash = password ? await bcrypt.hash(password, 10) : await bcrypt.hash("student123", 10);
    
    const newUser = {
      uid: userId,
      id: userId,
      name,
      email,
      mobile: mobile || "",
      role: role || "student",
      department: department || "",
      enrollmentNumber: enrollment_no || "",
      profilePhoto: profilePhoto || "",
      permissions: permissions || [],
      createdAt: new Date().toISOString(),
      password_hash: passwordHash,
      points: 1500 // Start with some default chapter points
    };

    await saveFirebaseUser(userId, newUser);

    // Save activity log
    await saveFirebaseLog("log_" + Math.random().toString(36).substring(7), {
      userId,
      userName: name,
      userEmail: email,
      action: "REGISTERED",
      details: `Signed up as a new ${role || "student"}.`,
      timestamp: new Date().toISOString()
    });

    res.json({ success: true, userId, user: { name: newUser.name, email: newUser.email, role: newUser.role } });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
});

app.post("/api/auth/google", async (req, res) => {
  const { uid, email, name, photoURL } = req.body;
  const cleanEmail = email ? email.toLowerCase() : "";
  const isSuperAdminEmail = cleanEmail === "meetkhakhkhar05@gmail.com";

  if (!isSuperAdminEmail && (!cleanEmail || !cleanEmail.endsWith("@marwadiuniversity.ac.in"))) {
    return res.status(401).json({ success: false, message: "Access Restricted: Only Marwadi University accounts are allowed." });
  }

  try {
    const users = await getFirebaseUsers();
    let user = users.find(u => u.uid === uid || u.email?.toLowerCase() === cleanEmail);

    if (user && user.status === "Disabled") {
      return res.status(403).json({ success: false, message: "Disabled Account: This student account has been deactivated by Chapter Administration." });
    }

    if (!user) {
      // Auto-create profile on first login
      let enrollment = "";
      const emailLocalPart = cleanEmail.split("@")[0];
      if (/^[a-zA-Z]{0,2}\d+/.test(emailLocalPart)) {
        enrollment = emailLocalPart.toUpperCase();
      }

      user = {
        uid,
        id: uid,
        name: name || (isSuperAdminEmail ? `Super Admin (${cleanEmail.split("@")[0]})` : "MU Student"),
        email: cleanEmail,
        mobile: isSuperAdminEmail ? "+91 88661 23456" : "",
        role: isSuperAdminEmail ? "super_admin" : "student",
        department: isSuperAdminEmail ? "Technical Lead Division" : "Computer Engineering",
        enrollmentNumber: isSuperAdminEmail ? "MU-CREATOR-01" : enrollment,
        profilePhoto: photoURL || "",
        permissions: isSuperAdminEmail ? ["all"] : [],
        createdAt: new Date().toISOString(),
        points: isSuperAdminEmail ? 999999 : 500 // Welcome points
      };
      await saveFirebaseUser(uid, user);

      // Save user creation log
      await saveFirebaseLog("log_" + Math.random().toString(36).substring(7), {
        userId: uid,
        userName: user.name,
        userEmail: user.email,
        action: "GOOGLE_REGISTERED",
        details: isSuperAdminEmail ? "Auto-created Super Admin via Creator Bypass." : "Auto-created student account via Google Sign-In with Marwadi University ID.",
        timestamp: new Date().toISOString()
      });
    } else {
      // If user exists, make sure they are promoted to super_admin
      if (isSuperAdminEmail && user.role !== "super_admin") {
        user.role = "super_admin";
        await saveFirebaseUser(user.uid || user.id, user);
      }
      // If user exists, update their profile photo if not present
      if (!user.profilePhoto && photoURL) {
        user.profilePhoto = photoURL;
        await saveFirebaseUser(user.uid || user.id, user);
      }
    }

    // Generate secure token
    const token = jwt.sign({ userId: user.uid || user.id, role: user.role }, SECRET_KEY, { expiresIn: "7d" });

    // Save live login tracking log
    await saveFirebaseLog("log_" + Math.random().toString(36).substring(7), {
      userId: user.uid || user.id,
      userName: user.name,
      userEmail: user.email,
      action: "GOOGLE_LOGIN",
      details: "Successful Google Sign-In with university account.",
      timestamp: new Date().toISOString()
    });

    res.json({
      success: true,
      token,
      user: {
        id: user.uid || user.id,
        uid: user.uid || user.id,
        name: user.name,
        role: user.role,
        email: user.email,
        enrollment_no: user.enrollmentNumber || user.enrollment_no || "",
        mobile: user.mobile || "",
        department: user.department || "",
        year: user.year || "3rd Year",
        points: user.points || 500,
        profilePhoto: user.profilePhoto || ""
      }
    });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
});

app.post("/api/auth/login", async (req, res) => {
  const { email, password, enrollment_no } = req.body;
  
  try {
    const users = await getFirebaseUsers();
    let user;

    if (enrollment_no) {
      user = users.find(u => u.email?.toLowerCase() === email?.toLowerCase() && u.enrollmentNumber === enrollment_no);
      if (!user) return res.status(401).json({ success: false, message: "Invalid Email or Enrollment Number" });
    } else {
      user = users.find(u => u.email?.toLowerCase() === email?.toLowerCase());
      if (!user) return res.status(401).json({ success: false, message: "User credentials not found" });

      if (user.status === "Disabled") {
        return res.status(403).json({ success: false, message: "Disabled Account: This student account has been deactivated by Chapter Administration." });
      }

      // Prevent password-based login for administrative roles to enforce Google OAuth
      if (user.role === "super_admin" || user.role === "admin" || user.email?.toLowerCase() === "meetkhakhkhar05@gmail.com") {
        return res.status(403).json({ success: false, message: "Access Denied: Enterprise Administrators must authenticate strictly via Google Sign-In." });
      }

      if (user.password_hash) {
        const match = await bcrypt.compare(password, user.password_hash);
        if (!match) return res.status(401).json({ success: false, message: "Invalid credentials" });
      } else {
        // Disallow standard bypass and old fallback logins
        return res.status(401).json({ success: false, message: "Credentials mismatch or login type unsupported. Please use Google Sign-In." });
      }
    }

    const token = jwt.sign({ userId: user.uid || user.id, role: user.role }, SECRET_KEY, { expiresIn: "7d" });
    
    // Save live login tracking
    await saveFirebaseLog("log_" + Math.random().toString(36).substring(7), {
      userId: user.uid || user.id,
      userName: user.name,
      userEmail: user.email,
      action: "LOGIN",
      details: `Successful sign in to ${user.role} portal.`,
      timestamp: new Date().toISOString()
    });

    res.json({ 
      success: true, 
      token, 
      user: { 
        id: user.uid || user.id, 
        uid: user.uid || user.id, 
        name: user.name, 
        role: user.role, 
        email: user.email, 
        enrollment_no: user.enrollmentNumber || user.enrollment_no,
        mobile: user.mobile || "",
        department: user.department || "",
        year: user.year || "3rd Year",
        points: user.points || 1500
      } 
    });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// Helper to check if optional token yields admin/super_admin role
const isUserSuperAdminOrAdmin = (req: any) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return false;
  try {
    const decoded = jwt.verify(token, SECRET_KEY) as any;
    return decoded.role === "super_admin" || decoded.role === "admin";
  } catch (err) {
    return false;
  }
};

// 2. Events Endpoints
app.get("/api/events", async (req, res) => {
  try {
    let gasEvents: any[] = [];
    try {
      const gasUrl = "https://script.google.com/macros/s/AKfycbwXI6rB6TB2dGPvAUEN8OPNeISND5fmWbsnQu4TtI0bz5UsbKrh4X8zfm6pIMozXSVpDw/exec?action=events";
      const gRes = await fetch(gasUrl, { redirect: "follow" });
      if (gRes.ok) {
        const gJson = await gRes.json();
        const rawList = gJson.events || gJson.data || [];
        if (Array.isArray(rawList)) {
          gasEvents = rawList.map((e: any) => ({
            id: String(e.Event_ID || e.event_id || e.id || ""),
            title: String(e.Event_Name || e.event_name || e.Title || e.title || "Campus Event"),
            description: String(e.Description || e.description || ""),
            date: String(e.Date || e.date || "Upcoming"),
            time: String(e.Start_Time || e.time || ""),
            venue: String(e.Venue || e.venue || e.Location || e.location || "Marwadi University"),
            poster_url: (String(e.Event_ID || e.event_id || "") === "EVT-0001" || String(e.Event_Name || e.Title || "").toLowerCase().includes("connect"))
              ? "/images/gfg-connect-banner.jpg"
              : (e.Poster_URL || e.poster_url || "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&q=80&w=800"),
            registration_link: e.Registration_Link || e.registration_link || "",
            status: e.Status || e.status || "PUBLISHED",
            registration_status: e.Registration_Status || e.registration_status || "OPEN",
            approvedBySuperAdmin: true,
            is_published: true,
            organizer: e.Organizer || e.organizer || "GFG MU Chapter",
            contact_phone: String(e.Contact_Phone || e.contact_phone || "")
          })).filter(e => e.id);
        }
      }
    } catch (e) {
      console.warn("Server fetch GAS events warning:", e);
    }

    const firebaseEvents = await getFirebaseEvents();
    
    // Dynamically query registration counts from Firebase
    let registrations: any[] = [];
    try {
      registrations = await getFirebaseRegistrations();
    } catch (e) {
      // In-memory or fallback
    }

    // Merge GAS events and Firebase events, prioritizing GAS events for matching IDs
    const mergedMap = new Map<string, any>();
    gasEvents.forEach(e => mergedMap.set(e.id, e));
    firebaseEvents.forEach(e => {
      if (!mergedMap.has(e.id)) {
        mergedMap.set(e.id, e);
      }
    });

    const allEvents = Array.from(mergedMap.values());

    const eventsWithCounts = allEvents.map(e => {
      const count = registrations.filter(r => r.eventId === e.id || r.eventId === e.eventId).length;
      return {
        ...e,
        registrationCount: count
      };
    });

    const isAdmin = isUserSuperAdminOrAdmin(req);
    if (isAdmin) {
      res.json({ success: true, count: eventsWithCounts.length, data: eventsWithCounts, events: eventsWithCounts });
    } else {
      // Filter out unapproved events for public/student view
      const publicEvents = eventsWithCounts.filter(e => e.approvedBySuperAdmin === true || e.approvedBySuperAdmin === undefined);
      res.json({ success: true, count: publicEvents.length, data: publicEvents, events: publicEvents });
    }
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
});

app.post("/api/events", authenticate, subAdminOnly, async (req: any, res) => {
  const { title, description, date, location, poster_url, registration_link } = req.body;
  const eventId = "evt_" + Math.random().toString(36).substring(7);
  const qrData = "qr_" + Math.random().toString(36).substring(7);
  
  const isSuperAdmin = req.userRole === "super_admin";

  const newEvent = {
    id: eventId,
    title,
    description,
    date,
    location,
    poster_url: poster_url || "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&q=80&w=800",
    registration_link: registration_link || "",
    qr_code_data: qrData,
    is_published: isSuperAdmin,
    approvedBySuperAdmin: isSuperAdmin, // auto-approved if created by Super Admin
    ...req.body
  };

  try {
    await saveFirebaseEvent(eventId, newEvent);
    res.json({ success: true, data: newEvent });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
});

app.put("/api/events/:id", authenticate, subAdminOnly, async (req: any, res) => {
  const id = req.params.id;
  try {
    const events = await getFirebaseEvents();
    const event = events.find(e => e.id === id);
    if (!event) return res.status(404).json({ success: false, message: "Event not found" });

    let approvedBySuperAdmin = event.approvedBySuperAdmin;
    if (req.userRole === "super_admin") {
      if (req.body.approvedBySuperAdmin !== undefined) {
        approvedBySuperAdmin = req.body.approvedBySuperAdmin;
      }
    } else {
      approvedBySuperAdmin = false; // require re-verification when edited by lower role
    }

    const updated = { 
      ...event, 
      ...req.body,
      approvedBySuperAdmin,
      is_published: approvedBySuperAdmin
    };
    await saveFirebaseEvent(id, updated);
    res.json({ success: true, data: updated });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
});

app.post("/api/events/:id/approve", authenticate, adminOnly, async (req: any, res) => {
  if (req.userRole !== "super_admin") {
    return res.status(403).json({ success: false, message: "Only Super Admin can approve/verify community updates." });
  }
  const id = req.params.id;
  try {
    const events = await getFirebaseEvents();
    const event = events.find(e => e.id === id);
    if (!event) return res.status(404).json({ success: false, message: "Event not found" });

    event.approvedBySuperAdmin = true;
    event.is_published = true;
    await saveFirebaseEvent(id, event);
    res.json({ success: true });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
});

app.delete("/api/events/:id", authenticate, adminOnly, async (req, res) => {
  const id = req.params.id;
  try {
    await deleteFirebaseEvent(id);
    res.json({ success: true });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// 3. Announcements CMS
app.get("/api/announcements", async (req, res) => {
  try {
    const data = await getFirebaseAnnouncements();
    const isAdmin = isUserSuperAdminOrAdmin(req);
    if (isAdmin) {
      res.json({ success: true, data });
    } else {
      // Filter out unapproved announcements for public view
      const publicAnn = data.filter(a => a.approvedBySuperAdmin === true || a.approvedBySuperAdmin === undefined);
      res.json({ success: true, data: publicAnn });
    }
  } catch (err: any) {
    res.json({ success: false, data: [] });
  }
});

app.post("/api/announcements", authenticate, subAdminOnly, async (req: any, res) => {
  const id = "ann_" + Math.random().toString(36).substring(7);
  const { title, content, category } = req.body;
  const isSuperAdmin = req.userRole === "super_admin";

  const newAnn = {
    id,
    title,
    content,
    category: category || "Notice",
    approvedBySuperAdmin: isSuperAdmin, // auto-approved if created by Super Admin
    date: new Date().toISOString().split("T")[0]
  };
  try {
    await saveFirebaseAnnouncement(id, newAnn);
    res.json({ success: true, data: newAnn });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
});

app.post("/api/announcements/:id/approve", authenticate, adminOnly, async (req: any, res) => {
  if (req.userRole !== "super_admin") {
    return res.status(403).json({ success: false, message: "Only Super Admin can verify community updates." });
  }
  const id = req.params.id;
  try {
    const announcements = await getFirebaseAnnouncements();
    const ann = announcements.find(a => a.id === id);
    if (!ann) return res.status(404).json({ success: false, message: "Announcement not found" });

    ann.approvedBySuperAdmin = true;
    await saveFirebaseAnnouncement(id, ann);
    res.json({ success: true });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
});

app.delete("/api/announcements/:id", authenticate, subAdminOnly, async (req, res) => {
  try {
    await deleteFirebaseAnnouncement(req.params.id);
    res.json({ success: true });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// 4. Certificates Management
app.get("/api/certificates", authenticate, async (req: any, res: any) => {
  try {
    const all = await getFirebaseCertificates();
    if (req.userRole === "super_admin" || req.userRole === "admin") {
      res.json({ success: true, data: all });
    } else {
      const cleanEmail = req.userEmail ? req.userEmail.toLowerCase() : "";
      res.json({ 
        success: true, 
        data: all.filter(c => 
          c.userId === req.userId || 
          (c.studentEmail && c.studentEmail.toLowerCase() === cleanEmail)
        ) 
      });
    }
  } catch (err: any) {
    res.json({ success: false, data: [] });
  }
});

app.post("/api/certificates", authenticate, adminOnly, async (req, res) => {
  const { userId, studentName, studentEmail, eventName, certificateUrl, pdfUrl, hash, issueDate, qrCode, status, skills } = req.body;
  const certificateId = hash || "CF-2605-" + Math.random().toString(36).substring(2, 8).toUpperCase();
  
  const newCert = {
    id: certificateId,
    certificateId,
    userId,
    studentName: studentName || "Chapter Student",
    studentEmail: studentEmail || "",
    eventName: eventName || "GFG Chapter Event",
    issueDate: issueDate || new Date().toISOString().split("T")[0],
    certificateUrl: certificateUrl || pdfUrl || "#",
    pdfUrl: certificateUrl || pdfUrl || "#",
    verifyUrl: `https://certiforge-ai-945097883026.us-west1.run.app/#verify/${certificateId}`,
    hash: certificateId,
    qrCode: qrCode || `qr_${certificateId}`,
    status: status || "Verified",
    skills: skills || ["Problem Solving", "Computer Science"],
    createdAt: new Date().toISOString(),
    downloadCount: 0,
    verificationCount: 0
  };
  try {
    await saveFirebaseCertificate(certificateId, newCert);
    res.json({ success: true, data: newCert });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
});

app.put("/api/certificates/:id", authenticate, adminOnly, async (req, res) => {
  const id = req.params.id;
  try {
    const certs = await getFirebaseCertificates();
    const cert = certs.find(c => c.id === id);
    if (!cert) return res.status(404).json({ success: false, message: "Certificate not found" });

    const updated = { 
      ...cert, 
      ...req.body,
      verifyUrl: `https://certiforge-ai-945097883026.us-west1.run.app/#verify/${req.body.certificateId || cert.certificateId || id}`
    };
    await saveFirebaseCertificate(id, updated);
    res.json({ success: true, data: updated });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
});

app.post("/api/certificates/:id/download", authenticate, async (req, res) => {
  const id = req.params.id;
  try {
    const certs = await getFirebaseCertificates();
    const cert = certs.find(c => c.id === id);
    if (cert) {
      cert.downloadCount = (cert.downloadCount || 0) + 1;
      await saveFirebaseCertificate(id, cert);
      res.json({ success: true, data: cert });
    } else {
      res.status(404).json({ success: false, message: "Certificate not found" });
    }
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
});

app.post("/api/certificates/:id/verify", authenticate, async (req, res) => {
  const id = req.params.id;
  try {
    const certs = await getFirebaseCertificates();
    const cert = certs.find(c => c.id === id);
    if (cert) {
      cert.verificationCount = (cert.verificationCount || 0) + 1;
      await saveFirebaseCertificate(id, cert);
      res.json({ success: true, data: cert });
    } else {
      res.status(404).json({ success: false, message: "Certificate not found" });
    }
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
});

app.delete("/api/certificates/:id", authenticate, adminOnly, async (req, res) => {
  try {
    await deleteFirebaseCertificate(req.params.id);
    res.json({ success: true });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// 5. Event Registrations
app.get("/api/registrations", authenticate, async (req, res) => {
  try {
    const recs = await getFirebaseRegistrations();
    res.json({ success: true, data: recs });
  } catch (e: any) {
    res.json({ success: false, data: [] });
  }
});

app.post("/api/events/register", authenticate, async (req: any, res) => {
  const { event_id } = req.body;
  try {
    const list = await getFirebaseRegistrations();
    const existing = list.find(r => r.userId === req.userId && r.eventId === event_id);
    if (existing) return res.status(400).json({ success: false, message: "Already registered" });

    const users = await getFirebaseUsers();
    const user = users.find(u => u.uid === req.userId || u.id === req.userId);
    const events = await getFirebaseEvents();
    const event = events.find(e => e.id === event_id);

    const regId = "reg_" + Math.random().toString(36).substring(7);
    const newReg = {
      id: regId,
      userId: req.userId,
      userName: user?.name || "Student Name",
      userEmail: user?.email || "",
      eventId: event_id,
      eventTitle: event?.title || "Chapter Event",
      registeredAt: new Date().toISOString(),
      status: "Approved"
    };

    await saveFirebaseRegistration(regId, newReg);
    res.json({ success: true });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// 6. QR Check-in Attendance
app.get("/api/attendance", authenticate, staffOnly, async (req, res) => {
  try {
    const recs = await getFirebaseAttendance();
    res.json({ success: true, data: recs });
  } catch (e: any) {
    res.json({ success: false, data: [] });
  }
});

app.post("/api/attendance/checkin", authenticate, async (req: any, res) => {
  const { qr_data } = req.body;
  try {
    const events = await getFirebaseEvents();
    const event = events.find(e => e.qr_code_data === qr_data || e.id === qr_data);
    if (!event) return res.status(404).json({ success: false, message: "Invalid Event Check-In QR" });

    const atts = await getFirebaseAttendance();
    const existing = atts.find(a => a.userId === req.userId && a.eventId === event.id);
    if (existing) return res.status(400).json({ success: false, message: "Attendance already logged" });

    const users = await getFirebaseUsers();
    const user = users.find(u => u.uid === req.userId || u.id === req.userId);

    const checkId = "att_" + Math.random().toString(36).substring(7);
    const newAtt = {
      id: checkId,
      userId: req.userId,
      userName: user?.name || "Student",
      userEnrollment: user?.enrollmentNumber || user?.enrollment_no || "N/A",
      eventId: event.id,
      eventTitle: event.title,
      markedAt: new Date().toISOString(),
      status: "Present"
    };

    await saveFirebaseAttendance(checkId, newAtt);

    // Award Chapter XP Points inside user account
    if (user) {
      user.points = (user.points || 0) + 150;
      await saveFirebaseUser(user.uid || user.id, user);
    }

    res.json({ success: true, message: `Check-in complete for ${event.title}! +150 Points` });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
});

app.post("/api/attendance", authenticate, staffOnly, async (req, res) => {
  const { enrollment, eventId, status } = req.body;
  try {
    const users = await getFirebaseUsers();
    const user = users.find(u => u.enrollmentNumber === enrollment || u.enrollment_no === enrollment);
    if (!user) return res.status(404).json({ success: false, message: "Student record not found" });

    const events = await getFirebaseEvents();
    const event = events.find(e => e.id === eventId || e.id === "evt_codejam");

    const checkId = "att_" + Math.random().toString(36).substring(7);
    const newAtt = {
      id: checkId,
      userId: user.uid || user.id,
      userName: user.name,
      userEnrollment: enrollment,
      eventId: event?.id || "evt_codejam",
      eventTitle: event?.title || "Campus Workshop",
      markedAt: new Date().toISOString(),
      status: status || "Present"
    };

    await saveFirebaseAttendance(checkId, newAtt);
    res.json({ success: true });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// 7. Leaderboard Ranking
app.get("/api/leaderboard", async (req, res) => {
  try {
    const users = await getFirebaseUsers();
    const topUsers = users
      .filter(u => u.role === "student")
      .sort((a, b) => (b.points || 0) - (a.points || 0))
      .slice(0, 15)
      .map(u => ({
        name: u.name,
        points: u.points || 1200,
        department: u.department || "Computer Engineering"
      }));
    res.json({ success: true, data: topUsers });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// User Specific Routes
app.get("/api/me/attendance", authenticate, async (req: any, res) => {
  try {
    const all = await getFirebaseAttendance();
    const data = all.filter(a => a.userId === req.userId);
    res.json({ success: true, data });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
});

app.get("/api/me/registrations", authenticate, async (req: any, res) => {
  try {
    const all = await getFirebaseRegistrations();
    const data = all.filter(r => r.userId === req.userId);
    res.json({ success: true, data });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// 8. User Management CRUD (Super Admins)
app.get("/api/users", authenticate, staffOnly, async (req, res) => {
  try {
    const users = await getFirebaseUsers();
    res.json({ success: true, data: users });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
});

app.post("/api/users", authenticate, adminOnly, async (req: any, res: any) => {
  const { name, email, password, role, enrollment_no, department, year, mobile, permissions } = req.body;
  try {
    const users = await getFirebaseUsers();
    if (users.find(u => u.email === email)) {
      return res.status(400).json({ success: false, message: "Email is already taken" });
    }

    const userId = "usr_" + Math.random().toString(36).substring(7);
    const hash = await bcrypt.hash(password || "student123", 10);
    const newUser = {
      uid: userId,
      id: userId,
      name,
      email,
      password_hash: hash,
      role: role || "student",
      enrollmentNumber: enrollment_no || "",
      department: department || "",
      year: year || "1st Year",
      mobile: mobile || "",
      permissions: permissions || [],
      createdAt: new Date().toISOString(),
      points: 1540
    };

    await saveFirebaseUser(userId, newUser);

    // Save activity audit
    await saveFirebaseLog("log_" + Math.random().toString(36).substring(7), {
      userId: req.userId,
      userName: "Staff User",
      action: "CREATED_USER",
      details: `Added new ${role} user: ${name} (${email})`,
      timestamp: new Date().toISOString()
    });

    res.json({ success: true, data: newUser });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
});

app.put("/api/users/:id", authenticate, async (req: any, res: any) => {
  const id = req.params.id;
  try {
    // Only Super Admin or the User themselves can edit details
    if (req.userRole !== "super_admin" && req.userId !== id) {
      return res.status(403).json({ success: false, message: "Permission Denied to modify profile." });
    }

    const users = await getFirebaseUsers();
    const user = users.find(u => u.uid === id || u.id === id);
    if (!user) return res.status(404).json({ success: false, message: "User profile not found" });

    // Preserve fields
    const updated = { 
      ...user, 
      ...req.body,
      // Ensure Enrollment Maps correctly
      enrollmentNumber: req.body.enrollmentNumber || req.body.enrollment_no || user.enrollmentNumber
    };
    await saveFirebaseUser(id, updated);

    // Save persistent security audit log for admin operations
    await saveFirebaseLog("log_" + Math.random().toString(36).substring(7), {
      userId: req.userId || "admin",
      userName: "Administrator",
      userEmail: "meetkhakhkhar05@gmail.com",
      action: "STUDENT_REGISTRY_UPDATE",
      details: `Modified student account fields for ${updated.name || updated.email}. Attributes modified: ${Object.keys(req.body).join(", ")}.`,
      timestamp: new Date().toISOString()
    });

    res.json({ success: true, data: updated });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
});

app.delete("/api/users/:id", authenticate, adminOnly, async (req, res) => {
  const id = req.params.id;
  try {
    await deleteFirebaseUser(id);
    res.json({ success: true });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// Logs Endpoint for Super Admins
app.get("/api/logs", authenticate, adminOnly, async (req, res) => {
  try {
    const data = await getFirebaseLogs();
    res.json({ success: true, data });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// --- Dynamic CMS & Home Layout Edit Endpoints ---
let cachedHomeCMS: any = null;
app.get("/api/cms/home", (req, res) => {
  res.json({
    success: true,
    data: cachedHomeCMS || {
      headline: "SOLVING CHALLENGES ● FOSTERING INNOVATION",
      tagline: "GeeksforGeeks x Marwadi University",
      subtext: "Empowering developers through rigorous data structures, competitive challenges, algorithm engineering, and enterprise hackathons.",
      whatsappGroup: "https://chat.whatsapp.com/F7RcXCTLYJ4Ije5NiL6sDM"
    }
  });
});

app.post("/api/cms/home", authenticate, adminOnly, (req, res) => {
  cachedHomeCMS = req.body;
  res.json({ success: true, data: cachedHomeCMS });
});

// --- Settings Operations Endpoints ---
const defaultSettings: Record<string, any> = {
  contactFormUrl: {
    value: "https://docs.google.com/forms/d/e/1FAIpQLSfQ5QSIqCn8AsRV_1CL76UXdPI3JABfhd7NC8tbGlih9ZQ8KA/viewform?embedded=true"
  }
};

app.get("/api/settings/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const setting = await getFirebaseSetting(id);
    if (setting) {
      return res.json({ success: true, data: setting });
    }
    const fallback = defaultSettings[id] || { value: "" };
    res.json({ success: true, data: fallback });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
});

app.put("/api/settings/:id", authenticate, adminOnly, async (req, res) => {
  const { id } = req.params;
  const { value } = req.body;
  try {
    const newSetting = { id, value, updatedAt: new Date().toISOString() };
    await saveFirebaseSetting(id, newSetting);
    res.json({ success: true, data: newSetting });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// --- Team Member Endpoints ---
app.get("/api/team", async (req, res) => {
  try {
    const data = await getFirebaseTeam();
    res.json({ success: true, data });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
});

app.post("/api/team", authenticate, adminOnly, async (req, res) => {
  try {
    const id = "tm_" + Math.random().toString(36).substring(7);
    const member = { ...req.body, id, createdAt: new Date().toISOString() };
    await saveFirebaseTeamMember(id, member);
    
    // Save audit log
    await saveFirebaseLog("log_" + Math.random().toString(36).substring(7), {
      userId: (req as any).userId || "admin",
      userName: "Administrator",
      userEmail: "meetkhakhkhar05@gmail.com",
      action: "TEAM_MEMBER_CREATED",
      details: `Added new team member: ${member.name} (${member.position}).`,
      timestamp: new Date().toISOString()
    });

    res.json({ success: true, data: member });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
});

app.put("/api/team/:id", authenticate, adminOnly, async (req, res) => {
  const id = req.params.id;
  try {
    const data = req.body;
    await saveFirebaseTeamMember(id, data);

    // Save audit log
    await saveFirebaseLog("log_" + Math.random().toString(36).substring(7), {
      userId: (req as any).userId || "admin",
      userName: "Administrator",
      userEmail: "meetkhakhkhar05@gmail.com",
      action: "TEAM_MEMBER_UPDATED",
      details: `Updated team member profile for: ${data.name}.`,
      timestamp: new Date().toISOString()
    });

    res.json({ success: true, data });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
});

app.delete("/api/team/:id", authenticate, adminOnly, async (req, res) => {
  const id = req.params.id;
  try {
    await deleteFirebaseTeamMember(id);

    // Save audit log
    await saveFirebaseLog("log_" + Math.random().toString(36).substring(7), {
      userId: (req as any).userId || "admin",
      userName: "Administrator",
      userEmail: "meetkhakhkhar05@gmail.com",
      action: "TEAM_MEMBER_DELETED",
      details: `Deleted team member with ID: ${id}.`,
      timestamp: new Date().toISOString()
    });

    res.json({ success: true });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// --- Google Sheets Sync & Contact Portal API ---
let contactSubmissions: any[] = [];
app.post("/api/contact", async (req, res) => {
  const { name, email, message } = req.body;

  if (!name || !email || !message) {
    return res.status(400).json({ success: false, message: "Full Name, Email, and Message are required fields." });
  }

  const timestamp = new Date().toISOString();
  const submission = {
    id: contactSubmissions.length + 1,
    name,
    email,
    message,
    timestamp
  };

  contactSubmissions.push(submission);

  res.json({
    success: true,
    message: "Contact logs synced successfully onto server dashboard cache.",
    data: submission
  });
});

app.get("/api/admin/contact-submissions", authenticate, adminOnly, (req, res) => {
  res.json({ success: true, data: contactSubmissions });
});

// --- Google Apps Script Web App Proxy (/api/gas) ---
// Proxies client requests to bypass browser cross-origin redirect restrictions
const WORKING_GAS_URL =
  "https://script.google.com/macros/s/AKfycbzcos4IsuAjv0UCIhntK88L7U4y7TBGu-QR4xlkCrOievNvVto_pRuHeKFlpVrML_wcpg/exec";

const getGasUrl = () => {
  const envUrl = process.env.VITE_GOOGLE_APPS_SCRIPT_URL || process.env.GOOGLE_APPS_SCRIPT_URL;
  if (envUrl && !envUrl.includes("AKfycbzKJhx3STkrl") && envUrl.includes("/exec")) {
    return envUrl;
  }
  return WORKING_GAS_URL;
};

app.get("/api/gas", async (req, res) => {
  try {
    const gasBase = getGasUrl();
    const targetUrl = new URL(gasBase);
    for (const [key, value] of Object.entries(req.query)) {
      if (value !== undefined && value !== null && value !== "") {
        targetUrl.searchParams.set(key, String(value));
      }
    }

    let gasRes = await fetch(targetUrl.toString(), {
      method: "GET",
      redirect: "follow",
    });

    let text = await gasRes.text();

    // If returned an HTML page (such as Google login or unexpected redirect), fallback to verified public deployment
    if (text.trim().startsWith("<") && gasBase !== WORKING_GAS_URL) {
      const fbUrl = new URL(WORKING_GAS_URL);
      for (const [key, value] of Object.entries(req.query)) {
        if (value !== undefined && value !== null && value !== "") {
          fbUrl.searchParams.set(key, String(value));
        }
      }
      const fbRes = await fetch(fbUrl.toString(), { method: "GET", redirect: "follow" });
      text = await fbRes.text();
    }

    try {
      const data = JSON.parse(text);
      return res.json(data);
    } catch {
      return res.json({ success: true, count: 0, events: [], team: [], announcements: [] });
    }
  } catch (err: any) {
    console.warn("GAS Proxy GET error:", err.message);
    return res.json({
      success: true,
      count: 0,
      events: [],
      team: [],
      announcements: [],
      error: err.message
    });
  }
});

app.post("/api/gas", async (req, res) => {
  try {
    const gasBase = getGasUrl();
    let gasRes = await fetch(gasBase, {
      method: "POST",
      headers: {
        "Content-Type": "text/plain;charset=utf-8",
      },
      body: JSON.stringify(req.body),
      redirect: "follow",
    });

    let text = await gasRes.text();

    if (text.trim().startsWith("<") && gasBase !== WORKING_GAS_URL) {
      const fbRes = await fetch(WORKING_GAS_URL, {
        method: "POST",
        headers: { "Content-Type": "text/plain;charset=utf-8" },
        body: JSON.stringify(req.body),
        redirect: "follow",
      });
      text = await fbRes.text();
    }

    try {
      const data = JSON.parse(text);
      return res.json(data);
    } catch {
      return res.json({ success: false, error: "Invalid response from registration backend" });
    }
  } catch (err: any) {
    console.warn("GAS Proxy POST error:", err.message);
    return res.status(500).json({
      success: false,
      error: err.message || "Failed to communicate with Google Apps Script backend",
    });
  }
});

// --- Server & Vite Setup ---
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  if (process.env.NODE_ENV !== "production" || !process.env.VERCEL) {
    app.listen(PORT, "0.0.0.0", () => {
      console.log(`Server running on http://localhost:${PORT}`);
    });
  }
}

startServer();

export { app };
export default app;
