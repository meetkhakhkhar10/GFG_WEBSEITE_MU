import { gasApi, API_BASE_URL, RegistrationPayload, BookingPayload, AttendancePayload, AnnouncementPayload } from "./gasApi";
import { safeFetchJson } from "../utils/fetchUtils";

export { gasApi, API_BASE_URL };
export type { RegistrationPayload, BookingPayload, AttendancePayload, AnnouncementPayload };

const getHeaders = () => {
  const token = localStorage.getItem('token');
  return {
    'Content-Type': 'application/json',
    ...(token ? { 'Authorization': `Bearer ${token}` } : {})
  };
};

export const apiService = {
  // Auth
  async login(credentials: any) {
    const res = await safeFetchJson('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(credentials)
    });
    return res.data || { success: false, message: res.error || "Login failed" };
  },

  async loginWithGoogle(data: { uid: string; email: string; name: string | null; photoURL: string | null }) {
    const res = await safeFetchJson('/api/auth/google', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    return res.data || { success: false, message: res.error || "Google login failed" };
  },

  async register(data: any) {
    const res = await safeFetchJson('/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    return res.data || { success: false, message: res.error || "Registration failed" };
  },

  // Events
  async getEvents() {
    try {
      const gasRes = await gasApi.getEvents();
      if (gasRes && gasRes.success && ((gasRes.events && gasRes.events.length > 0) || (gasRes.data && gasRes.data.length > 0))) {
        return gasRes;
      }
    } catch (err) {
      console.warn("apiService.getEvents GAS fetch note:", err);
    }
    const res = await safeFetchJson('/api/events', { headers: getHeaders() });
    return res.data || { success: false, data: [] };
  },

  async createEvent(data: any) {
    const res = await safeFetchJson('/api/events', {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(data)
    });
    return res.data || { success: false, message: res.error };
  },

  async updateEvent(id: any, data: any) {
    const res = await safeFetchJson(`/api/events/${id}`, {
      method: "PUT",
      headers: getHeaders(),
      body: JSON.stringify(data),
    });
    return res.data || { success: false, message: res.error };
  },

  async deleteEvent(id: any) {
    const res = await safeFetchJson(`/api/events/${id}`, {
      method: 'DELETE',
      headers: getHeaders()
    });
    return res.data || { success: false, message: res.error };
  },

  async registerForEvent(eventId: number) {
    const res = await safeFetchJson('/api/events/register', {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify({ event_id: eventId })
    });
    return res.data || { success: false, message: res.error };
  },

  // Attendance
  async checkIn(qrData: string) {
    const res = await safeFetchJson('/api/attendance/checkin', {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify({ qr_data: qrData })
    });
    return res.data || { success: false, message: res.error };
  },

  // Leaderboard
  async getLeaderboard() {
    const res = await safeFetchJson('/api/leaderboard', { headers: getHeaders() });
    return res.data || { success: false, data: [] };
  },

  // Me
  async getMyAttendance() {
    const res = await safeFetchJson('/api/me/attendance', { headers: getHeaders() });
    return res.data || { success: false, data: [] };
  },

  async getMyRegistrations() {
    const res = await safeFetchJson('/api/me/registrations', { headers: getHeaders() });
    return res.data || { success: false, data: [] };
  },

  async updateUser(id: any, data: any) {
    const res = await safeFetchJson(`/api/users/${id}`, {
      method: 'PUT',
      headers: getHeaders(),
      body: JSON.stringify(data)
    });
    return res.data || { success: false, message: res.error };
  },

  async getSetting(id: string) {
    const res = await safeFetchJson(`/api/settings/${id}`, { headers: getHeaders() });
    return res.data || { success: false, value: null };
  },

  async updateSetting(id: string, data: { value: string }) {
    const res = await safeFetchJson(`/api/settings/${id}`, {
      method: 'PUT',
      headers: getHeaders(),
      body: JSON.stringify(data)
    });
    return res.data || { success: false, message: res.error };
  },

  // Team Members
  async getTeam() {
    const res = await safeFetchJson('/api/team', { headers: getHeaders() });
    return res.data || { success: false, data: [] };
  },

  async createTeamMember(data: any) {
    const res = await safeFetchJson('/api/team', {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(data)
    });
    return res.data || { success: false, message: res.error };
  },

  async updateTeamMember(id: any, data: any) {
    const res = await safeFetchJson(`/api/team/${id}`, {
      method: 'PUT',
      headers: getHeaders(),
      body: JSON.stringify(data)
    });
    return res.data || { success: false, message: res.error };
  },

  async deleteTeamMember(id: any) {
    const res = await safeFetchJson(`/api/team/${id}`, {
      method: 'DELETE',
      headers: getHeaders()
    });
    return res.data || { success: false, message: res.error };
  }
};
