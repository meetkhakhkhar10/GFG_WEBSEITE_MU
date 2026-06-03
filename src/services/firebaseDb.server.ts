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

export enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

export interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId?: string | null;
    email?: string | null;
    emailVerified?: boolean | null;
    isAnonymous?: boolean | null;
    tenantId?: string | null;
    providerInfo?: {
      providerId?: string | null;
      email?: string | null;
    }[];
  }
}

export function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null) {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: "admin_backend",
      email: "admin_backend@gfgmu.com",
      emailVerified: true,
      isAnonymous: false,
    },
    operationType,
    path
  };
  console.error("Firestore Admin Error: ", JSON.stringify(errInfo));
  throw new Error(JSON.stringify(errInfo));
}

// Local in-memory store in case Firebase connection fails
interface LocalDb {
  users: any[];
  events: any[];
  announcements: any[];
  certificates: any[];
  registrations: any[];
  attendance: any[];
  logs: any[];
  team: any[];
}

const localStore: LocalDb = {
  users: [],
  events: [],
  announcements: [],
  certificates: [],
  registrations: [],
  attendance: [],
  logs: [],
  team: []
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
      is_published: true,
      approvedBySuperAdmin: true,
      category: "Competitive Programming",
      status: "Completed",
      publicationStatus: "Published"
    },
    {
      id: "evt_intellify",
      title: "Intellify 4.0",
      description: "Intellify 4.0 is the flagship national-level hackathon organized at Marwadi University on 15th–16th August 2026. Building upon the success of previous editions, Intellify has evolved into a platform that promotes innovation, collaboration, creativity, and technical excellence among students across India.\n\nThe hackathon provides participants with an opportunity to solve real-world challenges through technology in a highly competitive environment. With participation expected from 600+ students representing 150+ colleges nationwide, Intellify 4.0 aims to create impactful solutions while fostering networking, learning, and innovation.",
      date: "15th–16th August 2026",
      location: "Marwadi University, Rajkot, Gujarat, India",
      poster_url: "https://d8it4huxumps7.cloudfront.net/uploads/images/opportunity/banner/6a1ebf444ee51_intellify-40.jpg?d=1920x557",
      poster_image: "https://media.licdn.com/dms/image/v2/D5622AQGX5GCF2vVchg/feedshare-shrink_480/B56Z6MtjFwI8Ag-/0/1780477211277?e=1782345600&v=beta&t=3KyigAHwI12hZAxOfpnKapHcCJl4Gi4kYyR5L0UIqeM",
      registration_link: "https://unstop.com/hackathons/intellify-40-marwadi-university-mu-gujarat-1684922",
      qr_code_data: "intellify_2026",
      is_published: true,
      approvedBySuperAdmin: true,
      is_featured: true,
      category: "Hackathon / Software Development",
      status: "Upcoming",
      publicationStatus: "Published",
      capacity: "600",
      registration_fee: "₹250",
      team_size: "2–4 Members",
      prize_pool: "₹3,40,000+",
      eligibility: "Engineering Students, Undergraduate Students, Postgraduate Students, Management Students, Medical Students, Law Students, Arts, Commerce, Science & Other Streams",
      expected_participation: "600+ Students",
      expected_colleges: "150+ Colleges Across India",
      organizer_name: "Marwadi University × GeeksforGeeks Student Chapter",
      organizer_email: "gfg@marwadiuniversity.ac.in",
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
      is_published: true,
      approvedBySuperAdmin: true,
      category: "Hackathon"
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
  } catch (err: any) {
    console.log("ℹ️ Server-side running on in-memory local fallback store for local development preview.");
    isFirebaseActive = false;
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

// Settings CRUD operations
export const getFirebaseSetting = async (settingId: string): Promise<any> => {
  if (isFirebaseActive && db) {
    try {
      const docRef = db.collection("settings").doc(settingId);
      const docSnap = await docRef.get();
      if (docSnap.exists) {
        return docSnap.data();
      }
    } catch (err) {
      console.error("Firestore Admin error reading setting:", err);
    }
  }
  return null;
};

export const saveFirebaseSetting = async (settingId: string, data: any): Promise<void> => {
  if (isFirebaseActive && db) {
    try {
      await db.collection("settings").doc(settingId).set(data, { merge: true });
    } catch (err) {
      console.error("Firestore Admin setting write error:", err);
    }
  }
};

// Team CRUD operations
export const getFirebaseTeam = async (): Promise<any[]> => {
  if (isFirebaseActive && db) {
    try {
      const snap = await db.collection("team").get();
      return snap.docs.map((d: any) => ({ ...d.data(), id: d.id }));
    } catch (err) {
      console.error("Firestore Admin error in fetching team:", err);
    }
  }
  return localStore.team || [];
};

export const saveFirebaseTeamMember = async (memberId: string, data: any): Promise<void> => {
  const clean = { ...data, id: memberId };
  const idx = (localStore.team || []).findIndex(m => m.id === memberId);
  if (idx !== -1) {
    localStore.team[idx] = { ...localStore.team[idx], ...clean };
  } else {
    if (!localStore.team) localStore.team = [];
    localStore.team.push(clean);
  }

  if (isFirebaseActive && db) {
    try {
      await db.collection("team").doc(memberId).set(clean, { merge: true });
    } catch (err) {
      console.error("Firestore Admin team write error:", err);
    }
  }
};

export const deleteFirebaseTeamMember = async (memberId: string): Promise<void> => {
  if (localStore.team) {
    localStore.team = localStore.team.filter(m => m.id !== memberId);
  }
  if (isFirebaseActive && db) {
    try {
      await db.collection("team").doc(memberId).delete();
    } catch (err) {
      console.error("Firestore Admin team delete error:", err);
    }
  }
};

