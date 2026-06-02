import { collection, onSnapshot, query, orderBy } from "firebase/firestore";
import { firestoreDb, isFirebaseActive } from "../services/firebaseDb";

export interface EventDocument {
  id?: string;
  eventId: string;
  title: string;
  category: string;
  description: string;
  bannerImage: string;
  startDate: string;
  endDate: string;
  startTime: string;
  endTime: string;
  venue: string;
  registrationLink: string;
  maxParticipants: string | number;
  organizer: string;
  status: "upcoming" | "live" | "completed" | "cancelled";
  featured: boolean;
  visibility: boolean;
  createdAt: string;
  updatedAt: string;
  approvedBySuperAdmin?: boolean; // backwards compatibility
  poster_url?: string; // backwards compatibility with image selector
  location?: string; // backwards compatibility
  registration_link?: string; // backwards compatibility
  time?: string; // backwards compatibility
  date?: string; // backwards compatibility
}

/**
 * Calculates current status for an event document dynamically based on system clock.
 */
export function getEventStatus(evt: EventDocument): "upcoming" | "live" | "completed" | "cancelled" {
  if (evt.status === "cancelled") return "cancelled";
  
  try {
    const now = new Date();
    // Use startDate and startTime
    const startStr = `${evt.startDate}T${evt.startTime || "00:00"}`;
    const endStr = `${evt.endDate || evt.startDate}T${evt.endTime || "23:59"}`;
    
    const startTimeObj = new Date(startStr);
    const endTimeObj = new Date(endStr);
    
    if (isNaN(startTimeObj.getTime()) || isNaN(endTimeObj.getTime())) {
      // Fallback to legacy fields if present
      const dateVal = evt.startDate || evt.date;
      if (!dateVal) return evt.status || "upcoming";
      return evt.status || "upcoming";
    }
    
    if (now.getTime() >= endTimeObj.getTime()) {
      return "completed";
    } else if (now.getTime() >= startTimeObj.getTime()) {
      return "live";
    } else {
      return "upcoming";
    }
  } catch (error) {
    return evt.status || "upcoming";
  }
}

/**
 * Subscribes to real-time events.
 * Falls back to simple REST polling or promise resolution if Firebase is inactive.
 */
export function subscribeToEvents(callback: (events: EventDocument[]) => void): () => void {
  if (isFirebaseActive && firestoreDb) {
    try {
      const q = query(collection(firestoreDb, "events"));
      const unsubscribe = onSnapshot(q, (snapshot) => {
        const list: EventDocument[] = [];
        snapshot.forEach((docSnap) => {
          const data = docSnap.data();
          // Normalize legacy and actual formats
          const docItem: EventDocument = {
            id: docSnap.id,
            eventId: data.eventId || docSnap.id,
            title: data.title || "",
            category: data.category || "General",
            description: data.description || "",
            bannerImage: data.bannerImage || data.poster_url || "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&q=80&w=800",
            startDate: data.startDate || data.date || "2026-05-29",
            endDate: data.endDate || data.startDate || data.date || "2026-05-29",
            startTime: data.startTime || "10:00",
            endTime: data.endTime || "17:00",
            venue: data.venue || data.location || "Online",
            registrationLink: data.registrationLink || data.registration_link || "",
            maxParticipants: data.maxParticipants || 100,
            organizer: data.organizer || "GFG MU Chapter",
            status: data.status || "upcoming",
            featured: data.featured === true || data.is_featured === true,
            visibility: data.visibility !== false && data.is_published !== false,
            createdAt: data.createdAt || new Date().toISOString(),
            updatedAt: data.updatedAt || new Date().toISOString(),
            approvedBySuperAdmin: data.approvedBySuperAdmin !== false,
            poster_url: data.bannerImage || data.poster_url,
            location: data.venue || data.location,
            registration_link: data.registrationLink || data.registration_link,
            date: data.startDate || data.date,
            time: `${data.startTime || "10:00"} - ${data.endTime || "17:00"}`
          };
          
          // Apply dynamic status check logic on mount / state load
          docItem.status = getEventStatus(docItem);
          list.push(docItem);
        });
        
        callback(list);
      }, (err) => {
        console.error("Snapshot error on subscribeToEvents:", err);
      });
      return unsubscribe;
    } catch (e) {
      console.error("Failed to boot Firebase onSnapshot sync:", e);
    }
  }

  // Fallback to local memory / REST fetch
  let active = true;
  const poll = async () => {
    try {
      const res = await fetch("/api/events");
      const json = await res.json();
      if (active && json.success) {
        const normalized = (json.data || []).map((data: any) => {
          const docItem: EventDocument = {
            id: data.id,
            eventId: data.eventId || data.id,
            title: data.title || "",
            category: data.category || "General",
            description: data.description || "",
            bannerImage: data.bannerImage || data.poster_url || "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&q=80&w=800",
            startDate: data.startDate || data.date || "2026-05-29",
            endDate: data.endDate || data.startDate || data.date || "2026-05-29",
            startTime: data.startTime || "10:00",
            endTime: data.endTime || "17:00",
            venue: data.venue || data.location || "Online",
            registrationLink: data.registrationLink || data.registration_link || "",
            maxParticipants: data.maxParticipants || 100,
            organizer: data.organizer || "GFG MU Chapter",
            status: data.status || "upcoming",
            featured: data.featured === true,
            visibility: data.visibility !== false && data.is_published !== false,
            createdAt: data.createdAt || new Date().toISOString(),
            updatedAt: data.updatedAt || new Date().toISOString(),
            approvedBySuperAdmin: data.approvedBySuperAdmin !== false,
            poster_url: data.bannerImage || data.poster_url,
            location: data.venue || data.location,
            registration_link: data.registrationLink || data.registration_link,
            date: data.startDate || data.date,
            time: `${data.startTime || "10:00"} - ${data.endTime || "17:00"}`
          };
          docItem.status = getEventStatus(docItem);
          return docItem;
        });
        callback(normalized);
      }
    } catch (e) {
      console.warn("Poll fallbacks error:", e);
    }
  };

  poll();
  const interval = setInterval(poll, 15000);
  return () => {
    active = false;
    clearInterval(interval);
  };
}
