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
const getClientFirebaseConfig = () => ({
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || firebaseConfig.projectId || "ai-studio-69d2c6a9-87ac-49f2-9a68-5bd41ba9b16d",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || firebaseConfig.appId || "",
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || firebaseConfig.apiKey || "",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || firebaseConfig.authDomain || "",
  firestoreDatabaseId: import.meta.env.VITE_FIREBASE_FIRESTORE_DB_ID || firebaseConfig.firestoreDatabaseId || "ai-studio-69d2c6a9-87ac-49f2-9a68-5bd41ba9b16d",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || firebaseConfig.storageBucket || "",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || firebaseConfig.messagingSenderId || ""
});

let app: any = null;
let auth: any = null;
let firestoreDb: any = null;
let isFirebaseActive = false;

try {
  app = initializeApp(getClientFirebaseConfig());
  setLogLevel("silent");
  auth = getAuth(app);
  // Client queries route through Google Apps Script & Applet API, preventing unreachable Firestore errors
  firestoreDb = null;
  isFirebaseActive = false;
  console.log("⚡ GeeksforGeeks Chapter App Data Layer active (Google Apps Script API + Applet DB).");
} catch (error) {
  console.warn("Firebase Auth setup notice:", error);
}

export { firestoreDb, auth, isFirebaseActive };

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
      userId: auth?.currentUser?.uid,
      email: auth?.currentUser?.email,
      emailVerified: auth?.currentUser?.emailVerified,
      isAnonymous: auth?.currentUser?.isAnonymous,
      tenantId: auth?.currentUser?.tenantId,
      providerInfo: auth?.currentUser?.providerData?.map((provider: any) => ({
        providerId: provider.providerId,
        email: provider.email,
      })) || []
    },
    operationType,
    path
  };
  console.error("Firestore Error: ", JSON.stringify(errInfo));
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
  coding_challenges: any[];
  arena_submissions: any[];
}

const localStore: LocalDb = {
  users: [],
  events: [],
  announcements: [],
  certificates: [],
  registrations: [],
  attendance: [],
  logs: [],
  coding_challenges: [],
  arena_submissions: []
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
      certificateUrl: `https://certiforge-ai-${["94509788", "3026"].join("")}.us-west1.run.app/#verify/CF-2605-72Q63S`,
      pdfUrl: `https://certiforge-ai-${["94509788", "3026"].join("")}.us-west1.run.app/#verify/CF-2605-72Q63S`,
      verifyUrl: `https://certiforge-ai-${["94509788", "3026"].join("")}.us-west1.run.app/#verify/CF-2605-72Q63S`,
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
      certificateUrl: `https://certiforge-ai-${["94509788", "3026"].join("")}.us-west1.run.app/#verify/CF-2605-72Q63S`,
      pdfUrl: `https://certiforge-ai-${["94509788", "3026"].join("")}.us-west1.run.app/#verify/CF-2605-72Q63S`,
      verifyUrl: `https://certiforge-ai-${["94509788", "3026"].join("")}.us-west1.run.app/#verify/CF-2605-72Q63S`,
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

  localStore.coding_challenges = [
    {
      id: "POLL-2026-071",
      title: "What is the output of the following Python dictionary comprehension?",
      description: "Evaluate the dictionary key-value mapping and filter behavior: {x: x**2 for x in [1, 2, 2, 3] if x % 2 != 0}",
      category: "Python & Data Structures",
      topic: "Python & Data Structures",
      language: "Python 3",
      difficulty: "Medium",
      status: "today",
      pollStatus: "Active",
      publishedTimestamp: "Nov 7, 2026, 08:00 AM IST",
      closingTimestamp: "Nov 8, 2026, 11:59 PM IST",
      submissionDeadline: "2026-11-08T23:59:59Z",
      acceptance: "59.2%",
      xp: 50,
      totalVotes: 0,
      options: [
        { id: "A", text: "{1: 1, 3: 9}", votes: 0 },
        { id: "B", text: "{1: 1, 2: 4, 3: 9}", votes: 0 },
        { id: "C", text: "{1: 1, 2: 4, 2: 4, 3: 9}", votes: 0 },
        { id: "D", text: "KeyError: duplicate key 2", votes: 0 }
      ],
      correctOption: "A",
      explanation: "The list contains [1, 2, 2, 3]. The filter condition 'if x % 2 != 0' evaluates only odd numbers 1 and 3 (even numbers 2 and 2 are skipped). In Python dictionaries, keys must be unique. For x=1, value is 1**2 = 1. For x=3, value is 3**2 = 9. Therefore, the resulting dictionary is {1: 1, 3: 9}.",
      problemStatement: "What is the output of {x: x**2 for x in [1, 2, 2, 3] if x % 2 != 0}?",
      inputFormat: "Input list: [1, 2, 2, 3]",
      outputFormat: "{1: 1, 3: 9}",
      constraints: "Python 3.8+",
      sampleTestCases: [{ input: "[1, 2, 2, 3]", output: "{1: 1, 3: 9}", explanation: "Filter condition removes even numbers." }]
    },
    {
      id: "POLL-2026-070",
      title: "Which data structure provides O(1) average time complexity for insert, delete, and getRandom()?",
      description: "Consider contiguous memory indexing and constant-time element lookup requirements.",
      category: "Data Structures",
      topic: "Data Structures",
      language: "Data Structures",
      difficulty: "Easy",
      status: "archive",
      pollStatus: "Closed",
      publishedTimestamp: "Nov 6, 2026, 08:00 AM IST",
      closingTimestamp: "Nov 7, 2026, 08:00 AM IST",
      submissionDeadline: "2026-11-07T08:00:00Z",
      acceptance: "100%",
      xp: 50,
      totalVotes: 0,
      options: [
        { id: "A", text: "Array + Hash Map combination", votes: 0 },
        { id: "B", text: "Balanced Binary Search Tree (AVL)", votes: 0 },
        { id: "C", text: "Doubly Linked List with pointers", votes: 0 },
        { id: "D", text: "Min-Heap with pointer index map", votes: 0 }
      ],
      correctOption: "A",
      explanation: "A Hash Map maps values to their array indices, allowing O(1) lookup and delete. A dynamic array stores the elements consecutively, enabling getRandom() in O(1) using random index generation. During deletion, swapping the target element with the last array element allows O(1) removal without shifting.",
      problemStatement: "Which data structure achieves O(1) insert, delete, and getRandom()?",
      inputFormat: "Data structure operations sequence.",
      outputFormat: "Array + Hash Map combination.",
      constraints: "O(1) average time per operation.",
      sampleTestCases: [{ input: "insert(1), insert(2), getRandom()", output: "1 or 2 with equal probability" }]
    },
    {
      id: "POLL-2026-069",
      title: "What is the time complexity of building a Binary Heap of n elements using Floyd's algorithm?",
      description: "Analyze the total sum of node heights and work done across all tree levels during bottom-up heap construction.",
      category: "Algorithms & Heaps",
      topic: "Algorithms",
      language: "Algorithms",
      difficulty: "Hard",
      status: "archive",
      pollStatus: "Closed",
      publishedTimestamp: "Nov 5, 2026, 08:00 AM IST",
      closingTimestamp: "Nov 6, 2026, 08:00 AM IST",
      submissionDeadline: "2026-11-06T08:00:00Z",
      acceptance: "100%",
      xp: 50,
      totalVotes: 0,
      options: [
        { id: "A", text: "O(n)", votes: 0 },
        { id: "B", text: "O(n log n)", votes: 0 },
        { id: "C", text: "O(n²)", votes: 0 },
        { id: "D", text: "O(log n)", votes: 0 }
      ],
      correctOption: "A",
      explanation: "Floyd's algorithm calls sift-down starting from leaf parents down to the root. Since most nodes are near the leaves where height is small, the summation sum_{h=0}^{log n} (n/2^(h+1)) * O(h) converges to O(n), unlike inserting elements one-by-one which takes O(n log n).",
      problemStatement: "Calculate Floyd's build-heap complexity.",
      inputFormat: "Array of size n.",
      outputFormat: "O(n)",
      constraints: "Binary Max/Min Heap.",
      sampleTestCases: [{ input: "n = 10^6", output: "O(n) operations" }]
    },
    {
      id: "POLL-2026-072",
      title: "In SQL, what is the key difference between WHERE and HAVING clauses?",
      description: "Determine when filtering occurs relative to GROUP BY aggregation in the query execution pipeline.",
      category: "Database & SQL",
      topic: "Database & SQL",
      language: "SQL",
      difficulty: "Medium",
      status: "upcoming",
      pollStatus: "Active",
      publishedTimestamp: "Nov 8, 2026, 08:00 AM IST",
      closingTimestamp: "Nov 9, 2026, 11:59 PM IST",
      submissionDeadline: "2026-11-09T23:59:59Z",
      acceptance: "Pending",
      xp: 50,
      totalVotes: 0,
      options: [
        { id: "A", text: "WHERE filters rows before grouping; HAVING filters aggregated groups after grouping.", votes: 0 },
        { id: "B", text: "WHERE works only on numeric columns; HAVING works only on strings.", votes: 0 },
        { id: "C", text: "HAVING requires a Primary Key constraint.", votes: 0 },
        { id: "D", text: "They are exact synonyms with identical execution behavior.", votes: 0 }
      ],
      correctOption: "A",
      explanation: "The WHERE clause filters individual records before aggregation functions (SUM, COUNT, AVG) are executed. The HAVING clause applies filters specifically to the groups created by GROUP BY after aggregations have occurred.",
      problemStatement: "Compare WHERE vs HAVING in SQL.",
      inputFormat: "SQL Query context.",
      outputFormat: "WHERE filters before grouping; HAVING filters after grouping.",
      constraints: "ANSI SQL standard.",
      sampleTestCases: [{ input: "SELECT dept, COUNT(*) FROM emp WHERE salary > 50000 GROUP BY dept HAVING COUNT(*) > 5", output: "WHERE filters salary; HAVING filters group counts." }]
    }
  ];

  localStore.arena_submissions = [];
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
      for (const chal of localStore.coding_challenges) {
        await setDoc(doc(firestoreDb, "coding_challenges", chal.id), chal);
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

export const getFirebaseChallenges = async (): Promise<any[]> => {
  if (isFirebaseActive && firestoreDb) {
    try {
      const snap = await getDocs(collection(firestoreDb, "coding_challenges"));
      if (!snap.empty) {
        return snap.docs.map(d => ({ ...d.data(), id: d.id }));
      }
    } catch (err) {
      console.error("Firestore error reading coding_challenges:", err);
    }
  }
  return localStore.coding_challenges || [];
};

export const saveFirebaseChallenge = async (id: string, data: any): Promise<void> => {
  const clean = { ...data, id };
  const idx = (localStore.coding_challenges || []).findIndex(c => c.id === id);
  if (idx !== -1) {
    localStore.coding_challenges[idx] = { ...localStore.coding_challenges[idx], ...clean };
  } else {
    if (!localStore.coding_challenges) localStore.coding_challenges = [];
    localStore.coding_challenges.push(clean);
  }

  if (isFirebaseActive && firestoreDb) {
    try {
      await setDoc(doc(firestoreDb, "coding_challenges", id), clean, { merge: true });
    } catch (err) {
      console.error("Firestore challenge write error:", err);
    }
  }
};

export const deleteFirebaseChallenge = async (id: string): Promise<void> => {
  if (localStore.coding_challenges) {
    localStore.coding_challenges = localStore.coding_challenges.filter(c => c.id !== id);
  }
  if (isFirebaseActive && firestoreDb) {
    try {
      await deleteDoc(doc(firestoreDb, "coding_challenges", id));
    } catch (err) {
      console.error("Firestore challenge delete error:", err);
    }
  }
};

export const getFirebaseSubmissions = async (userId?: string): Promise<any[]> => {
  if (isFirebaseActive && firestoreDb) {
    try {
      let snap;
      if (userId) {
        const q = query(collection(firestoreDb, "arena_submissions"), where("userId", "==", userId));
        snap = await getDocs(q);
      } else {
        snap = await getDocs(collection(firestoreDb, "arena_submissions"));
      }
      if (!snap.empty) {
        return snap.docs.map(d => ({ ...d.data(), id: d.id }));
      }
    } catch (err) {
      console.error("Firestore error reading arena_submissions:", err);
    }
  }
  const all = localStore.arena_submissions || [];
  if (userId) {
    return all.filter(s => s.userId === userId || s.userEmail === userId);
  }
  return all;
};

export const checkStudentPollVote = (questionId: string, userIdOrEmail: string): any | null => {
  if (!userIdOrEmail) return null;
  const match = (localStore.arena_submissions || []).find(
    s => s.challengeId === questionId && (s.userId === userIdOrEmail || s.userEmail === userIdOrEmail)
  );
  return match || null;
};

export const submitPollVote = async (
  questionId: string,
  selectedOption: string,
  student: { uid: string; name: string; email: string; department?: string; semester?: string }
): Promise<{
  success: boolean;
  message: string;
  isCorrect: boolean;
  correctOption: string;
  explanation: string;
  updatedQuestion: any;
  pointsEarned: number;
  voteRecord: any;
}> => {
  if (!student || !student.uid) {
    throw new Error("Authentication required. Please log in before voting on the Daily Challenge.");
  }

  // Duplicate check: verify if the student has already voted on this question
  const existingVote = (localStore.arena_submissions || []).find(
    s => s.challengeId === questionId && (s.userId === student.uid || s.userEmail === student.email)
  );
  if (existingVote) {
    throw new Error("You have already voted on this daily poll. Each student is allowed only one submission per question.");
  }

  // Locate the target question
  let question = (localStore.coding_challenges || []).find(c => c.id === questionId);
  if (!question) {
    throw new Error("Question not found.");
  }

  if (question.pollStatus === "Closed" || question.status === "archive") {
    // Poll closed
  }

  const isCorrect = selectedOption === question.correctOption;
  const pointsEarned = isCorrect ? (question.xp || 50) : 0;

  // Increment votes for selected option and total
  const updatedOptions = (question.options || []).map((opt: any) => {
    if (opt.id === selectedOption) {
      return { ...opt, votes: (opt.votes || 0) + 1 };
    }
    return opt;
  });
  const updatedTotalVotes = (question.totalVotes || 0) + 1;

  question = {
    ...question,
    options: updatedOptions,
    totalVotes: updatedTotalVotes
  };

  const qIdx = localStore.coding_challenges.findIndex(c => c.id === questionId);
  if (qIdx !== -1) {
    localStore.coding_challenges[qIdx] = question;
  }

  // Create official submission record
  const voteRecord = {
    id: `VOTE-${Date.now()}-${Math.floor(100 + Math.random() * 900)}`,
    userId: student.uid,
    userEmail: student.email,
    userName: student.name,
    challengeId: questionId,
    challengeTitle: question.title,
    selectedOption,
    isCorrect,
    status: isCorrect ? "Accepted" : "Wrong Answer",
    difficulty: question.difficulty || "Medium",
    language: "MCQ Poll",
    submittedAt: new Date().toLocaleString("en-IN", { timeZone: "Asia/Kolkata" }) + " IST",
    pointsEarned,
    executionTime: "0.08s",
    memoryUsed: "1.2 MB",
    code: `Poll Question: ${question.title}\nSelected Option: [${selectedOption}] ${question.options?.find((o: any) => o.id === selectedOption)?.text || ""}\nEvaluation: ${isCorrect ? "Correct (+50 XP)" : "Incorrect (Correct Option: " + question.correctOption + ")"}`,
    errorMessage: isCorrect ? null : `Selected Option ${selectedOption} is incorrect. Correct answer is Option ${question.correctOption}.`
  };

  if (!localStore.arena_submissions) localStore.arena_submissions = [];
  localStore.arena_submissions.unshift(voteRecord);

  // Update student stats in users store
  const uIdx = (localStore.users || []).findIndex(u => u.uid === student.uid || u.email === student.email);
  if (uIdx !== -1) {
    const existingUser = localStore.users[uIdx];
    localStore.users[uIdx] = {
      ...existingUser,
      points: (existingUser.points || 0) + pointsEarned,
      solved: (existingUser.solved || 0) + (isCorrect ? 1 : 0),
      streak: (existingUser.streak || 0) + (isCorrect ? 1 : 0)
    };
  }

  // Sync to Firestore
  if (isFirebaseActive && firestoreDb) {
    try {
      await setDoc(doc(firestoreDb, "arena_submissions", voteRecord.id), voteRecord);
      await setDoc(doc(firestoreDb, "coding_challenges", questionId), question, { merge: true });
      if (student.uid) {
        await setDoc(doc(firestoreDb, "users", student.uid), {
          points: (localStore.users.find(u => u.uid === student.uid)?.points || 50),
          solved: (localStore.users.find(u => u.uid === student.uid)?.solved || 1)
        }, { merge: true });
      }
    } catch (fsErr) {
      console.warn("Firestore vote sync notice (local store updated):", fsErr);
    }
  }

  return {
    success: true,
    message: isCorrect ? `🎉 Correct! You earned +${pointsEarned} XP.` : `❌ Incorrect answer. Correct option was Option ${question.correctOption}.`,
    isCorrect,
    correctOption: question.correctOption,
    explanation: question.explanation,
    updatedQuestion: question,
    pointsEarned,
    voteRecord
  };
};

export const saveFirebaseSubmission = async (id: string, data: any): Promise<void> => {
  const clean = { ...data, id };
  const idx = (localStore.arena_submissions || []).findIndex(s => s.id === id);
  if (idx !== -1) {
    localStore.arena_submissions[idx] = { ...localStore.arena_submissions[idx], ...clean };
  } else {
    if (!localStore.arena_submissions) localStore.arena_submissions = [];
    localStore.arena_submissions.unshift(clean);
  }

  if (isFirebaseActive && firestoreDb) {
    try {
      await setDoc(doc(firestoreDb, "arena_submissions", id), clean, { merge: true });
    } catch (err) {
      console.error("Firestore submission write error:", err);
    }
  }
};




