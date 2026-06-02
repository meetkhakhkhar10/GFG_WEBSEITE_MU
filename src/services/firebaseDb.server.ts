import admin from "firebase-admin";
import { getFirestore } from "firebase-admin/firestore";
import firebaseConfig from "../../firebase-applet-config.json";

// Initialize Firebase Admin SDK
let db: any = null;
let isFirebaseActive = false;

try {
  let appInstance: any;
  if (admin.apps.length === 0) {
    appInstance = admin.initializeApp({
      projectId: firebaseConfig.projectId
    });
  } else {
    appInstance = admin.apps[0];
  }
  
  if (firebaseConfig.firestoreDatabaseId) {
    db = getFirestore(appInstance, firebaseConfig.firestoreDatabaseId);
  } else {
    db = getFirestore(appInstance);
  }
  isFirebaseActive = true;
  console.log("🔥 Firebase Admin SDK initialized successfully in firebaseDb.server.ts");
} catch (error) {
  console.error("⚠️ Failed to initialize Firebase Admin SDK, falling back to local database:", error);
}

export { db as firestoreDb, isFirebaseActive };

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

export const initializeFirestoreStore = async () => {
  if (!isFirebaseActive || !db) return;
  try {
    const userSnap = await db.collection("users").limit(1).get();
    if (userSnap.empty) {
      console.log("🌱 Database on firestore is empty, seeding starter collections via Firebase Admin...");
      for (const user of localStore.users) {
        await db.collection("users").doc(user.uid).set(user);
      }
      for (const event of localStore.events) {
        await db.collection("events").doc(event.id).set(event);
      }
      for (const announce of localStore.announcements) {
        await db.collection("announcements").doc(announce.id).set(announce);
      }
      for (const cert of localStore.certificates) {
        await db.collection("certificates").doc(cert.id).set(cert);
      }
      for (const reg of localStore.registrations) {
        await db.collection("registrations").doc(reg.id).set(reg);
      }
      for (const att of localStore.attendance) {
        await db.collection("attendance").doc(att.id).set(att);
      }
      for (const log of localStore.logs) {
        await db.collection("logs").doc(log.id).set(log);
      }
      console.log("🚀 Firestore Admin Seeding Finished Successfully!");
    } else {
      console.log("📦 Firestore database verified: contained records on startup via Admin SDK.");
    }
  } catch (err) {
    console.warn("⚠️ Failed to seeding Firestore database via Admin SDK:", err);
  }
};

export const getFirebaseUsers = async (): Promise<any[]> => {
  if (isFirebaseActive && db) {
    try {
      const snap = await db.collection("users").get();
      return snap.docs.map((d: any) => ({ ...d.data(), id: d.id }));
    } catch (err) {
      console.error("Firestore Admin error while getting users:", err);
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

  if (isFirebaseActive && db) {
    try {
      await db.collection("users").doc(userId).set(cleanData, { merge: true });
    } catch (err) {
      console.error("Firestore Admin user write error:", err);
    }
  }
};

export const deleteFirebaseUser = async (userId: string): Promise<void> => {
  localStore.users = localStore.users.filter(u => u.uid !== userId && u.id !== userId);
  if (isFirebaseActive && db) {
    try {
      await db.collection("users").doc(userId).delete();
    } catch (err) {
      console.error("Firestore Admin user delete error:", err);
    }
  }
};

export const getFirebaseEvents = async (): Promise<any[]> => {
  if (isFirebaseActive && db) {
    try {
      const snap = await db.collection("events").get();
      return snap.docs.map((d: any) => ({ ...d.data(), id: d.id }));
    } catch (err) {
      console.error("Firestore Admin error in fetching events:", err);
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

  if (isFirebaseActive && db) {
    try {
      await db.collection("events").doc(eventId).set(clean, { merge: true });
    } catch (err) {
      console.error("Firestore Admin event write error:", err);
    }
  }
};

export const deleteFirebaseEvent = async (eventId: string): Promise<void> => {
  localStore.events = localStore.events.filter(e => e.id !== eventId);
  if (isFirebaseActive && db) {
    try {
      await db.collection("events").doc(eventId).delete();
    } catch (err) {
      console.error("Firestore Admin event delete error:", err);
    }
  }
};

export const getFirebaseAnnouncements = async (): Promise<any[]> => {
  if (isFirebaseActive && db) {
    try {
      const snap = await db.collection("announcements").get();
      return snap.docs.map((d: any) => ({ ...d.data(), id: d.id }));
    } catch (err) {
      console.error("Firestore Admin error reading announcements:", err);
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

  if (isFirebaseActive && db) {
    try {
      await db.collection("announcements").doc(id).set(clean, { merge: true });
    } catch (err) {
      console.error("Firestore Admin announcement write error:", err);
    }
  }
};

export const deleteFirebaseAnnouncement = async (id: string): Promise<void> => {
  localStore.announcements = localStore.announcements.filter(a => a.id !== id);
  if (isFirebaseActive && db) {
    try {
      await db.collection("announcements").doc(id).delete();
    } catch (err) {
      console.error("Firestore Admin announcement delete error:", err);
    }
  }
};

export const getFirebaseCertificates = async (): Promise<any[]> => {
  if (isFirebaseActive && db) {
    try {
      const snap = await db.collection("certificates").get();
      return snap.docs.map((d: any) => ({ ...d.data(), id: d.id }));
    } catch (err) {
      console.error("Firestore Admin error reading certificates:", err);
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

  if (isFirebaseActive && db) {
    try {
      await db.collection("certificates").doc(id).set(clean, { merge: true });
    } catch (err) {
      console.error("Firestore Admin certificate write error:", err);
    }
  }
};

export const deleteFirebaseCertificate = async (id: string): Promise<void> => {
  localStore.certificates = localStore.certificates.filter(c => c.id !== id);
  if (isFirebaseActive && db) {
    try {
      await db.collection("certificates").doc(id).delete();
    } catch (err) {
      console.error("Firestore Admin certificate delete error:", err);
    }
  }
};

export const getFirebaseRegistrations = async (): Promise<any[]> => {
  if (isFirebaseActive && db) {
    try {
      const snap = await db.collection("registrations").get();
      return snap.docs.map((d: any) => ({ ...d.data(), id: d.id }));
    } catch (err) {
      console.error("Firestore Admin error reading registrations:", err);
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

  if (isFirebaseActive && db) {
    try {
      await db.collection("registrations").doc(id).set(clean, { merge: true });
    } catch (err) {
      console.error("Firestore Admin registration write error:", err);
    }
  }
};

export const getFirebaseAttendance = async (): Promise<any[]> => {
  if (isFirebaseActive && db) {
    try {
      const snap = await db.collection("attendance").get();
      return snap.docs.map((d: any) => ({ ...d.data(), id: d.id }));
    } catch (err) {
      console.error("Firestore Admin error reading attendance:", err);
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

  if (isFirebaseActive && db) {
    try {
      await db.collection("attendance").doc(id).set(clean, { merge: true });
    } catch (err) {
      console.error("Firestore Admin attendance write error:", err);
    }
  }
};

export const getFirebaseLogs = async (): Promise<any[]> => {
  if (isFirebaseActive && db) {
    try {
      const snap = await db.collection("logs").get();
      return snap.docs.map((d: any) => ({ ...d.data(), id: d.id }));
    } catch (err) {
      console.error("Firestore Admin error reading logs:", err);
    }
  }
  return localStore.logs;
};

export const saveFirebaseLog = async (id: string, data: any): Promise<void> => {
  const clean = { ...data, id };
  localStore.logs.push(clean);
  if (isFirebaseActive && db) {
    try {
      await db.collection("logs").doc(id).set(clean);
    } catch (err) {
      console.error("Firestore Admin log write error:", err);
    }
  }
};
