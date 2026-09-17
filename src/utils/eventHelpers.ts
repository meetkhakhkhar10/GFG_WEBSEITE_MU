import { collection, onSnapshot, query, orderBy } from "firebase/firestore";
import { firestoreDb, isFirebaseActive } from "../services/firebaseDb";
import { gasApi } from "../services/gasApi";

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
  contact_phone?: string;
  organizer_phone?: string;
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
 * Prioritizes real Google Apps Script API events, falling back to local/Firestore if needed.
 */
export function subscribeToEvents(callback: (events: EventDocument[]) => void): () => void {
  let active = true;

  const poll = async () => {
    try {
      // 1. Always fetch from Google Apps Script Web App FIRST
      const gasRes = await gasApi.getEvents();
      const eventsData = gasRes.events || gasRes.data || [];
      if (active && gasRes.success && Array.isArray(eventsData) && eventsData.length > 0) {
        const normalized: EventDocument[] = eventsData.map((e) => {
          const phoneStr = String(e.contact_phone || e.organizer_phone || "");
          const docItem: EventDocument = {
            id: e.id,
            eventId: e.id,
            title: e.title,
            category: e.category || "General",
            description: e.description,
            bannerImage: e.poster_url || e.poster_image || "",
            startDate: e.date,
            endDate: e.date,
            startTime: e.time || "10:00 AM",
            endTime: "01:00 PM",
            venue: e.location,
            registrationLink: e.registration_link,
            maxParticipants: e.capacity || 100,
            organizer: e.organizer_name || "GFG MU Chapter",
            status: (e.status?.toLowerCase() as any) || "upcoming",
            featured: e.is_featured === true,
            visibility: e.is_published !== false,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            approvedBySuperAdmin: true,
            poster_url: e.poster_url,
            location: e.location,
            registration_link: e.registration_link,
            date: e.date,
            time: e.time || "10:00 AM - 01:00 PM",
            contact_phone: phoneStr,
          };
          docItem.status = getEventStatus(docItem);
          return docItem;
        });
        callback(normalized);
        return;
      }
    } catch (gasErr) {
      console.warn("GAS Events fetch note in subscribeToEvents:", gasErr);
    }

    // 2. Fallback to Firestore / local server if GAS returns no events
    if (isFirebaseActive && firestoreDb) {
      try {
        const q = query(collection(firestoreDb, "events"));
        const unsubscribe = onSnapshot(q, (snapshot) => {
          if (!active) return;
          const list: EventDocument[] = [];
          snapshot.forEach((docSnap) => {
            const data = docSnap.data();
            const phoneStr = String(data.contact_phone || data.Organizer_Phone || data.Contact_Phone || "");
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
              time: `${data.startTime || "10:00"} - ${data.endTime || "17:00"}`,
              contact_phone: phoneStr,
            };
            docItem.status = getEventStatus(docItem);
            list.push(docItem);
          });
          if (list.length > 0) callback(list);
        }, (err) => {
          console.error("Snapshot error on subscribeToEvents:", err);
        });
        return unsubscribe;
      } catch (e) {
        console.error("Failed to sync Firestore events:", e);
      }
    }

    try {
      // 3. Fallback to local server /api/events
      const res = await fetch("/api/events");
      const json = await res.json();
      if (active && json.success) {
        const normalized = (json.data || []).map((data: any) => {
          const phoneStr = String(data.contact_phone || data.Contact_Phone || "");
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
            time: `${data.startTime || "10:00"} - ${data.endTime || "17:00"}`,
            contact_phone: phoneStr,
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
