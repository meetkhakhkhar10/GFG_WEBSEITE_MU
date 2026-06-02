import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { 
  initializeFirestore, 
  collection, 
  doc, 
  getDocs, 
  getDoc, 
  setDoc, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  query, 
  where,
  setLogLevel
} from "firebase/firestore";
import firebaseConfig from "../../firebase-applet-config.json";

// Initialize Firebase JS Client SDK
let app: any = null;
let firestoreDb: any = null;
let auth: any = null;
let isFirebaseActive = false;

try {
  app = initializeApp(firebaseConfig);
  setLogLevel("error");
  firestoreDb = initializeFirestore(app, {
    experimentalForceLongPolling: true
  }, firebaseConfig.firestoreDatabaseId);
  auth = getAuth(app);
  isFirebaseActive = true;
  console.log("🔥 Firebase Client SDK initialized successfully with standard HTTP long polling in firebaseDb.ts");
} catch (error) {
  console.error("⚠️ Failed to initialize Firebase SDK, falling back to local database:", error);
}

export { firestoreDb, auth, isFirebaseActive };

// Local in-memory store in case Firebase connection fails
interface LocalDb {
  users: any[];
  events: any[];
  announcements: any[];
  certificates: any[];
  registrations: any[];
  attendance: any[];
  logs: any[];
}

const localStore: LocalDb = {
  users: [],
  events: [],
  announcements: [],
  certificates: [],
  registrations: [],
  attendance: [],
  logs: []
};

// Seed Local Data
const seedLocalData = () => {
  localStore.users = [
    {
      id: "usr_super_admin",
      uid: "usr_super_admin",
      name: "Main Super Admin",
      email: "superadmin@gfgmu.com",
      mobile: "+91 88496 07999",
      role: "super_admin",
      department: "Administration",
      enrollmentNumber: "MU-SUPER-01",
      profilePhoto: "",
      permissions: ["all"],
      createdAt: new Date().toISOString()
    },
    {
      id: "usr_admin",
      uid: "usr_admin",
      name: "Committee Admin (Dr. Anil)",
      email: "admin@gfgmu.com",
      mobile: "+91 98250 11223",
      role: "admin",
      department: "ICT Department",
      enrollmentNumber: "MU-FACULTY-05",
      profilePhoto: "",
      permissions: ["events", "announcements", "students"],
      createdAt: new Date().toISOString()
    },
    {
      id: "usr_subadmin",
      uid: "usr_subadmin",
      name: "Rishi Verma",
      email: "subadmin@gfgmu.com",
      mobile: "+91 99123 44556",
      role: "sub_admin",
      department: "Computer Engineering",
      enrollmentNumber: "MU22BCS501",
      profilePhoto: "",
      permissions: ["registrations", "announcements"],
      createdAt: new Date().toISOString()
    },
    {
      id: "usr_committee",
      uid: "usr_committee",
      name: "Dev Patel",
      email: "committee@gfgmu.com",
      mobile: "+91 97230 55667",
      role: "committee",
      department: "Technical Team",
      enrollmentNumber: "MU22BCS150",
      profilePhoto: "",
      permissions: ["technical"],
      createdAt: new Date().toISOString()
    },
    {
      id: "usr_student_meet",
      uid: "usr_student_meet",
      name: "Meet Khakhkhar",
      email: "meetkhakhkhar05@gmail.com",
      mobile: "+91 88661 23456",
      role: "student",
      department: "Computer Science & Engineering",
      enrollmentNumber: "MU22BCS108",
      profilePhoto: "",
      permissions: [],
      createdAt: new Date().toISOString(),
      points: 1540
    }
  ];

  localStore.events = [
    {
      id: "evt_codejam",
      title: "ICT × GFG CodeJam",
      description: "A fast-paced algorithmic competition designed to solve national tech challenges.",
      date: "28th May",
      location: "MU ICT Computer Lab 3",
      poster_url: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&q=80&w=800",
      registration_link: "https://ict-gfg-codejam.netlify.app/",
      qr_code_data: "codejam2026",
      is_published: true
    },
    {
      id: "evt_neural",
      title: "Neural Hackathon v2.0",
      description: "A 24-hour hackathon focused on building agentic systems with Gemini 1.5 flash SDKs.",
      date: "14th June",
      location: "Main Seminar Hall, MU Campus",
      poster_url: "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&q=80&w=800",
      registration_link: "#",
      qr_code_data: "neural2026",
      is_published: true
    }
  ];

  localStore.announcements = [
    {
      id: "ann_one",
      title: "Core Team Applications Open!",
      content: "GFG Student Chapter recruitment is officially open for the Web DeV, Social Media, and Graphics leads.",
      date: "2026-05-25",
      category: "Event"
    },
    {
      id: "ann_two",
      title: "Smart India Hackathon registrations live",
      content: "Connect with the technical team division to coordinate campus-level proposals.",
      date: "2026-05-24",
      category: "Notice"
    }
  ];

  localStore.certificates = [
    {
      id: "CF-2605-72Q63S",
      certificateId: "CF-2605-72Q63S",
      userId: "usr_student_meet",
      studentName: "Meet Khakhkhar",
      studentEmail: "meetkhakhkhar05@gmail.com",
      eventName: "ICT x GFG CodeJam 2026",
      issueDate: "2026-03-29",
      certificateUrl: "https://certiforge-ai-945097883026.us-west1.run.app/#verify/CF-2605-72Q63S",
      pdfUrl: "https://certiforge-ai-945097883026.us-west1.run.app/#verify/CF-2605-72Q63S",
      verifyUrl: "https://certiforge-ai-945097883026.us-west1.run.app/#verify/CF-2605-72Q63S",
      hash: "CF-2605-72Q63S",
      qrCode: "qr_CF-2605-72Q63S",
      status: "Verified",
      skills: ["Data Structures", "Algorithms", "Competitive Programming"],
      createdAt: "2026-03-29T10:00:00Z",
      downloadCount: 15,
      verificationCount: 24
    },
    {
      id: "CF-2605-88A92D",
      certificateId: "CF-2605-88A92D",
      userId: "usr_student_meet_admin",
      studentName: "Meet Khakhkhar",
      studentEmail: "meet.khakhkhar139094@gmail.com",
      eventName: "Decentralized Hackathon 2026",
      issueDate: "2026-05-15",
      certificateUrl: "https://certiforge-ai-945097883026.us-west1.run.app/#verify/CF-2605-72Q63S",
      pdfUrl: "https://certiforge-ai-945097883026.us-west1.run.app/#verify/CF-2605-72Q63S",
      verifyUrl: "https://certiforge-ai-945097883026.us-west1.run.app/#verify/CF-2605-72Q63S",
      hash: "CF-2605-88A92D",
      qrCode: "qr_CF-2605-88A92D",
      status: "Verified",
      skills: ["React Development", "Firebase Integration", "Cloud Architecture"],
      createdAt: "2026-05-15T12:00:00Z",
      downloadCount: 6,
      verificationCount: 8
    }
  ];

  localStore.registrations = [
    {
      id: "reg_01",
      userId: "usr_student_meet",
      userName: "Meet Khakhkhar",
      userEmail: "meetkhakhkhar05@gmail.com",
      eventId: "evt_codejam",
      eventTitle: "ICT × GFG CodeJam",
      registeredAt: new Date().toISOString(),
      status: "Approved"
    }
  ];

  localStore.attendance = [
    {
      id: "att_01",
      userId: "usr_student_meet",
      userName: "Meet Khakhkhar",
      userEnrollment: "MU22BCS108",
      eventId: "evt_codejam",
      eventTitle: "ICT × GFG CodeJam",
      markedAt: new Date().toISOString(),
      status: "Present"
    }
  ];

  localStore.logs = [
    {
      id: "log_01",
      userId: "usr_super_admin",
      userName: "Main Super Admin",
      userEmail: "superadmin@gfgmu.com",
      action: "PROMOTED_ROLE",
      details: "Promoted Meet Khakhkhar (MU22BCS108) to Student Leader",
      timestamp: new Date().toISOString()
    }
  ];
};

seedLocalData();

// Synchronize all templates database schemas onto Firestore on startup
export const initializeFirestoreStore = async () => {
  if (!isFirebaseActive || !firestoreDb) return;
  try {
    const userSnap = await getDocs(collection(firestoreDb, "users"));
    if (userSnap.empty) {
      console.log("🌱 Database on firestore is empty, seeding starter collections...");
      for (const user of localStore.users) {
        await setDoc(doc(firestoreDb, "users", user.uid), user);
      }
      for (const event of localStore.events) {
        await setDoc(doc(firestoreDb, "events", event.id), event);
      }
      for (const announce of localStore.announcements) {
        await setDoc(doc(firestoreDb, "announcements", announce.id), announce);
      }
      for (const cert of localStore.certificates) {
        await setDoc(doc(firestoreDb, "certificates", cert.id), cert);
      }
      for (const reg of localStore.registrations) {
        await setDoc(doc(firestoreDb, "registrations", reg.id), reg);
      }
      for (const att of localStore.attendance) {
        await setDoc(doc(firestoreDb, "attendance", att.id), att);
      }
      for (const log of localStore.logs) {
        await setDoc(doc(firestoreDb, "logs", log.id), log);
      }
      console.log("🚀 Firestore Seeding Finished Successfully!");
    } else {
      console.log("📦 Firestore database verified: contained records on startup.");
    }
  } catch (err) {
    console.warn("⚠️ Failed to seeding Firestore database:", err);
  }
};

// --- DATA ACCESS LAYER WRAPPERS ---

export const getFirebaseUsers = async (): Promise<any[]> => {
  if (isFirebaseActive && firestoreDb) {
    try {
      const snap = await getDocs(collection(firestoreDb, "users"));
      return snap.docs.map(d => ({ ...d.data(), id: d.id }));
    } catch (err) {
      console.error("Firestore error while getting users, using local cache:", err);
    }
  }
  return localStore.users;
};

export const saveFirebaseUser = async (userId: string, data: any): Promise<void> => {
  const existingUserIdx = localStore.users.findIndex(u => u.uid === userId || u.id === userId);
  const cleanData = { ...data, uid: userId, id: userId };
  if (existingUserIdx !== -1) {
    localStore.users[existingUserIdx] = { ...localStore.users[existingUserIdx], ...cleanData };
  } else {
    localStore.users.push(cleanData);
  }

  if (isFirebaseActive && firestoreDb) {
    try {
      await setDoc(doc(firestoreDb, "users", userId), cleanData, { merge: true });
    } catch (err) {
      console.error("Firestore user write error:", err);
    }
  }
};

export const deleteFirebaseUser = async (userId: string): Promise<void> => {
  localStore.users = localStore.users.filter(u => u.uid !== userId && u.id !== userId);
  if (isFirebaseActive && firestoreDb) {
    try {
      await deleteDoc(doc(firestoreDb, "users", userId));
    } catch (err) {
      console.error("Firestore user delete error:", err);
    }
  }
};

export const getFirebaseEvents = async (): Promise<any[]> => {
  if (isFirebaseActive && firestoreDb) {
    try {
      const snap = await getDocs(collection(firestoreDb, "events"));
      return snap.docs.map(d => ({ ...d.data(), id: d.id }));
    } catch (err) {
      console.error("Firestore error in fetching events:", err);
    }
  }
  return localStore.events;
};

export const saveFirebaseEvent = async (eventId: string, data: any): Promise<void> => {
  const clean = { ...data, id: eventId };
  const idx = localStore.events.findIndex(e => e.id === eventId);
  if (idx !== -1) {
    localStore.events[idx] = { ...localStore.events[idx], ...clean };
  } else {
    localStore.events.push(clean);
  }

  if (isFirebaseActive && firestoreDb) {
    try {
      await setDoc(doc(firestoreDb, "events", eventId), clean, { merge: true });
    } catch (err) {
      console.error("Firestore event write error:", err);
    }
  }
};

export const deleteFirebaseEvent = async (eventId: string): Promise<void> => {
  localStore.events = localStore.events.filter(e => e.id !== eventId);
  if (isFirebaseActive && firestoreDb) {
    try {
      await deleteDoc(doc(firestoreDb, "events", eventId));
    } catch (err) {
      console.error("Firestore event delete error:", err);
    }
  }
};

export const getFirebaseAnnouncements = async (): Promise<any[]> => {
  if (isFirebaseActive && firestoreDb) {
    try {
      const snap = await getDocs(collection(firestoreDb, "announcements"));
      return snap.docs.map(d => ({ ...d.data(), id: d.id }));
    } catch (err) {
      console.error("Firestore error reading announcements:", err);
    }
  }
  return localStore.announcements;
};

export const saveFirebaseAnnouncement = async (id: string, data: any): Promise<void> => {
  const clean = { ...data, id };
  const idx = localStore.announcements.findIndex(a => a.id === id);
  if (idx !== -1) {
    localStore.announcements[idx] = { ...localStore.announcements[idx], ...clean };
  } else {
    localStore.announcements.push(clean);
  }

  if (isFirebaseActive && firestoreDb) {
    try {
      await setDoc(doc(firestoreDb, "announcements", id), clean, { merge: true });
    } catch (err) {
      console.error("Firestore announcement write error:", err);
    }
  }
};

export const deleteFirebaseAnnouncement = async (id: string): Promise<void> => {
  localStore.announcements = localStore.announcements.filter(a => a.id !== id);
  if (isFirebaseActive && firestoreDb) {
    try {
      await deleteDoc(doc(firestoreDb, "announcements", id));
    } catch (err) {
      console.error("Firestore announcement delete error:", err);
    }
  }
};

export const getFirebaseCertificates = async (): Promise<any[]> => {
  if (isFirebaseActive && firestoreDb) {
    try {
      const snap = await getDocs(collection(firestoreDb, "certificates"));
      return snap.docs.map(d => ({ ...d.data(), id: d.id }));
    } catch (err) {
      console.error("Firestore error reading certificates:", err);
    }
  }
  return localStore.certificates;
};

export const saveFirebaseCertificate = async (id: string, data: any): Promise<void> => {
  const clean = { ...data, id };
  const idx = localStore.certificates.findIndex(c => c.id === id);
  if (idx !== -1) {
    localStore.certificates[idx] = { ...localStore.certificates[idx], ...clean };
  } else {
    localStore.certificates.push(clean);
  }

  if (isFirebaseActive && firestoreDb) {
    try {
      await setDoc(doc(firestoreDb, "certificates", id), clean, { merge: true });
    } catch (err) {
      console.error("Firestore certificate write error:", err);
    }
  }
};

export const deleteFirebaseCertificate = async (id: string): Promise<void> => {
  localStore.certificates = localStore.certificates.filter(c => c.id !== id);
  if (isFirebaseActive && firestoreDb) {
    try {
      await deleteDoc(doc(firestoreDb, "certificates", id));
    } catch (err) {
      console.error("Firestore certificate delete error:", err);
    }
  }
};

export const getFirebaseRegistrations = async (): Promise<any[]> => {
  if (isFirebaseActive && firestoreDb) {
    try {
      const snap = await getDocs(collection(firestoreDb, "registrations"));
      return snap.docs.map(d => ({ ...d.data(), id: d.id }));
    } catch (err) {
      console.error("Firestore error reading registrations:", err);
    }
  }
  return localStore.registrations;
};

export const saveFirebaseRegistration = async (id: string, data: any): Promise<void> => {
  const clean = { ...data, id };
  const idx = localStore.registrations.findIndex(r => r.id === id);
  if (idx !== -1) {
    localStore.registrations[idx] = { ...localStore.registrations[idx], ...clean };
  } else {
    localStore.registrations.push(clean);
  }

  if (isFirebaseActive && firestoreDb) {
    try {
      await setDoc(doc(firestoreDb, "registrations", id), clean, { merge: true });
    } catch (err) {
      console.error("Firestore registration write error:", err);
    }
  }
};

export const getFirebaseAttendance = async (): Promise<any[]> => {
  if (isFirebaseActive && firestoreDb) {
    try {
      const snap = await getDocs(collection(firestoreDb, "attendance"));
      return snap.docs.map(d => ({ ...d.data(), id: d.id }));
    } catch (err) {
      console.error("Firestore error reading attendance:", err);
    }
  }
  return localStore.attendance;
};

export const saveFirebaseAttendance = async (id: string, data: any): Promise<void> => {
  const clean = { ...data, id };
  const idx = localStore.attendance.findIndex(a => a.id === id);
  if (idx !== -1) {
    localStore.attendance[idx] = { ...localStore.attendance[idx], ...clean };
  } else {
    localStore.attendance.push(clean);
  }

  if (isFirebaseActive && firestoreDb) {
    try {
      await setDoc(doc(firestoreDb, "attendance", id), clean, { merge: true });
    } catch (err) {
      console.error("Firestore attendance write error:", err);
    }
  }
};

export const getFirebaseLogs = async (): Promise<any[]> => {
  if (isFirebaseActive && firestoreDb) {
    try {
      const snap = await getDocs(collection(firestoreDb, "logs"));
      return snap.docs.map(d => ({ ...d.data(), id: d.id }));
    } catch (err) {
      console.error("Firestore error reading logs:", err);
    }
  }
  return localStore.logs;
};

export const saveFirebaseLog = async (id: string, data: any): Promise<void> => {
  const clean = { ...data, id };
  localStore.logs.push(clean);
  if (isFirebaseActive && firestoreDb) {
    try {
      await setDoc(doc(firestoreDb, "logs", id), clean);
    } catch (err) {
      console.error("Firestore log write error:", err);
    }
  }
};
