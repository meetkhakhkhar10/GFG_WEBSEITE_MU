import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import fs from "fs";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import cors from "cors";

const app = express();
const PORT = 3000;
const SECRET_KEY = "mu_super_secret_key";
app.use(express.json());
app.use(cors());

// --- In-Memory Database (No File Persistence) ---
interface DbSchema {
  users: any[];
  events: any[];
  registrations: any[];
  attendance: any[];
}

const db: DbSchema = {
  users: [],
  events: [],
  registrations: [],
  attendance: []
};

// Seed Database (In-Memory)
(async () => {
  const adminHash = await bcrypt.hash("admin123", 10);
  db.users.push({
    id: 1,
    name: "System Admin",
    email: "admin@gfgmu.com",
    password_hash: adminHash,
    role: "admin",
    points: 0
  });

  // Seed ICT x GFG CodeJam
  db.events.push({
    id: 1,
    title: "ICT × GFG CodeJam",
    description: "A coding competition organized in collaboration with the ICT Department at Marwadi University to enhance problem-solving skills and coding culture among students.",
    date: "28th March",
    location: "Marwadi University, ICT Department",
    poster_url: "https://i.ibb.co/pjkQyGnW/Whats-App-Image-2026-03-28-at-21-58-52.jpg",
    registration_link: "https://ict-gfg-codejam.netlify.app/",
    qr_code_data: "codejam2026",
    is_published: 1
  });
})();

// --- Auth Middleware ---
const authenticate = (req: any, res: any, next: any) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return res.status(401).json({ message: "No token provided" });

  jwt.verify(token, SECRET_KEY, (err: any, decoded: any) => {
    if (err) return res.status(401).json({ message: "Invalid token" });
    req.userId = (decoded as any).userId;
    req.userRole = (decoded as any).role;
    next();
  });
};

const adminOnly = (req: any, res: any, next: any) => {
  if (req.userRole !== 'admin') return res.status(403).json({ message: "Admin access required" });
  next();
};

// --- API Routes ---

// 1. Auth
app.post("/api/auth/register", async (req, res) => {
  const { name, email, password, role, enrollment_no, department, year } = req.body;
  
  if (db.users.find(u => u.email === email || (enrollment_no && u.enrollment_no === enrollment_no))) {
    return res.status(400).json({ success: false, message: "User already exists" });
  }

  const hash = await bcrypt.hash(password, 10);
  const newUser = {
    id: db.users.length + 1,
    name,
    email,
    password_hash: hash,
    role: role || 'student',
    enrollment_no,
    department,
    year,
    points: 0
  };

  db.users.push(newUser);
  res.json({ success: true, userId: newUser.id });
});

app.post("/api/auth/login", async (req, res) => {
  const { email, password, enrollment_no } = req.body;
  
  let user;
  if (enrollment_no) {
    user = db.users.find(u => u.email === email && u.enrollment_no === enrollment_no);
    if (!user) return res.status(401).json({ success: false, message: "Invalid Email or Enrollment Number" });
  } else {
    user = db.users.find(u => u.email === email);
    if (!user) return res.status(401).json({ success: false, message: "Invalid credentials" });
    const match = await bcrypt.compare(password, user.password_hash);
    if (!match) return res.status(401).json({ success: false, message: "Invalid credentials" });
  }

  const token = jwt.sign({ userId: user.id, role: user.role }, SECRET_KEY, { expiresIn: '7d' });
  res.json({ 
    success: true, 
    token, 
    user: { id: user.id, name: user.name, role: user.role, email: user.email, enrollment_no: user.enrollment_no } 
  });
});

// 2. Events
app.get("/api/events", (req, res) => {
  res.json({ success: true, data: db.events.filter(e => e.is_published !== 0) });
});

app.post("/api/events", authenticate, adminOnly, (req, res) => {
  const { title, description, date, location, poster_url, registration_link } = req.body;
  const qrData = Math.random().toString(36).substring(7);

  const newEvent = {
    id: db.events.length + 1,
    title,
    description,
    date,
    location,
    poster_url,
    registration_link,
    qr_code_data: qrData,
    is_published: 1
  };

  db.events.push(newEvent);
  res.json({ success: true, data: { id: newEvent.id } });
});

app.put("/api/events/:id", authenticate, adminOnly, (req, res) => {
  const id = parseInt(req.params.id);
  const { title, description, date, location, poster_url, registration_link } = req.body;
  
  const index = db.events.findIndex(e => e.id === id);
  if (index === -1) return res.status(404).json({ success: false, message: "Event not found" });

  db.events[index] = {
    ...db.events[index],
    title: title || db.events[index].title,
    description: description || db.events[index].description,
    date: date || db.events[index].date,
    location: location || db.events[index].location,
    poster_url: poster_url || db.events[index].poster_url,
    registration_link: registration_link || db.events[index].registration_link
  };

  res.json({ success: true, data: db.events[index] });
});

app.delete("/api/events/:id", authenticate, adminOnly, (req, res) => {
  const id = parseInt(req.params.id);
  db.events = db.events.filter(e => e.id !== id);
  res.json({ success: true });
});

// 3. Registrations & Attendance
app.post("/api/events/register", authenticate, (req: any, res) => {
  const { event_id } = req.body;
  
  const existing = db.registrations.find(r => r.user_id === req.userId && r.event_id === event_id);
  if (existing) return res.status(400).json({ success: false, message: "Already registered" });

  db.registrations.push({
    id: db.registrations.length + 1,
    user_id: req.userId,
    event_id,
    registered_at: new Date().toISOString()
  });
  res.json({ success: true });
});

app.post("/api/attendance/checkin", authenticate, (req: any, res) => {
  const { qr_data } = req.body;
  
  const event = db.events.find(e => e.qr_code_data === qr_data);
  if (!event) return res.status(404).json({ message: "Invalid QR Code" });

  const existing = db.attendance.find(a => a.user_id === req.userId && a.event_id === event.id);
  if (existing) return res.status(400).json({ success: false, message: "Attendance already marked" });

  db.attendance.push({
    id: db.attendance.length + 1,
    user_id: req.userId,
    event_id: event.id,
    marked_at: new Date().toISOString()
  });

  const userIndex = db.users.findIndex(u => u.id === req.userId);
  if (userIndex !== -1) {
    db.users[userIndex].points = (db.users[userIndex].points || 0) + 10;
  }

  res.json({ success: true, message: "Attendance marked! +10 Points" });
});

// 4. Leaderboard
app.get("/api/leaderboard", (req, res) => {
  const topUsers = db.users
    .filter(u => u.role === 'student')
    .sort((a, b) => (b.points || 0) - (a.points || 0))
    .slice(0, 10)
    .map(u => ({ name: u.name, points: u.points || 0, department: u.department }));
  
  res.json({ success: true, data: topUsers });
});

// User Specific Routes
app.get("/api/me/attendance", authenticate, (req: any, res) => {
  const data = db.attendance
    .filter(a => a.user_id === req.userId)
    .map(a => {
      const event = db.events.find(e => e.id === a.event_id);
      return {
        ...a,
        event_title: event?.title,
        date: event?.date
      };
    });
  res.json({ success: true, data });
});

app.get("/api/me/registrations", authenticate, (req: any, res) => {
  const data = db.registrations
    .filter(r => r.user_id === req.userId)
    .map(r => {
      const event = db.events.find(e => e.id === r.event_id);
      return {
        ...r,
        event_title: event?.title,
        date: event?.date
      };
    });
  res.json({ success: true, data });
});

// 5. Admin Panel Routes
app.get("/api/users", authenticate, adminOnly, (req, res) => {
  res.json({ success: true, data: db.users });
});

app.post("/api/users", authenticate, adminOnly, async (req, res) => {
  const { name, email, password, role, enrollment_no, department, year } = req.body;
  if (db.users.find(u => u.email === email)) {
    return res.status(400).json({ success: false, message: "User already exists" });
  }
  const hash = await bcrypt.hash(password || "student123", 10);
  const newUser = {
    id: db.users.length + 1,
    name,
    email,
    password_hash: hash,
    role: role || 'student',
    enrollment_no,
    department,
    year,
    points: 0
  };
  db.users.push(newUser);
  res.json({ success: true, data: newUser });
});

app.put("/api/users/:id", authenticate, adminOnly, async (req, res) => {
  const id = parseInt(req.params.id);
  const updateData = req.body;
  const index = db.users.findIndex(u => u.id === id);
  if (index === -1) return res.status(404).json({ success: false, message: "User not found" });

  db.users[index] = { ...db.users[index], ...updateData };
  res.json({ success: true, data: db.users[index] });
});

app.delete("/api/users/:id", authenticate, adminOnly, (req, res) => {
  const id = parseInt(req.params.id);
  db.users = db.users.filter(u => u.id !== id);
  res.json({ success: true });
});

app.get("/api/attendance", authenticate, adminOnly, (req, res) => {
  const data = db.attendance.map(a => {
    const user = db.users.find(u => u.id === a.user_id);
    const event = db.events.find(e => e.id === a.event_id);
    return {
      ...a,
      student_name: user?.name,
      enrollment: user?.enrollment_no,
      event_title: event?.title
    };
  });
  res.json({ success: true, data });
});

app.post("/api/attendance", authenticate, adminOnly, (req, res) => {
  const { enrollment, eventId } = req.body;
  const user = db.users.find(u => u.enrollment_no === enrollment);
  if (!user) return res.status(404).json({ success: false, message: "Student not found" });

  const event = db.events.find(e => e.id === eventId || e.id === parseInt(eventId));
  // If eventId is missing or invalid, we might just mark a general attendance or return error
  
  const existing = db.attendance.find(a => a.user_id === user.id && a.event_id === (event?.id || 0));
  if (existing) return res.status(400).json({ success: false, message: "Attendance already marked" });

  db.attendance.push({
    id: db.attendance.length + 1,
    user_id: user.id,
    event_id: event?.id || 0,
    marked_at: new Date().toISOString()
  });
  res.json({ success: true });
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

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
