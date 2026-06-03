// Custom API Service for Python/Node Backend
const API_URL = '/api';

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
    const res = await fetch(`${API_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(credentials)
    });
    return res.json();
  },

  async loginWithGoogle(data: { uid: string; email: string; name: string | null; photoURL: string | null }) {
    const res = await fetch(`${API_URL}/auth/google`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    return res.json();
  },

  async register(data: any) {
    const res = await fetch(`${API_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    return res.json();
  },

  // Events
  async getEvents() {
    const res = await fetch(`${API_URL}/events`, { headers: getHeaders() });
    return res.json();
  },

  async createEvent(data: any) {
    const res = await fetch(`${API_URL}/events`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(data)
    });
    return res.json();
  },

  async updateEvent(id: any, data: any) {
    const response = await fetch(`${API_URL}/events/${id}`, {
      method: "PUT",
      headers: getHeaders(),
      body: JSON.stringify(data),
    });
    return response.json();
  },

  async deleteEvent(id: any) {
    const res = await fetch(`${API_URL}/events/${id}`, {
      method: 'DELETE',
      headers: getHeaders()
    });
    return res.json();
  },

  async registerForEvent(eventId: number) {
    const res = await fetch(`${API_URL}/events/register`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify({ event_id: eventId })
    });
    return res.json();
  },

  // Attendance
  async checkIn(qrData: string) {
    const res = await fetch(`${API_URL}/attendance/checkin`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify({ qr_data: qrData })
    });
    return res.json();
  },

  // Leaderboard
  async getLeaderboard() {
    const res = await fetch(`${API_URL}/leaderboard`, { headers: getHeaders() });
    return res.json();
  },

  // Me
  async getMyAttendance() {
    const res = await fetch(`${API_URL}/me/attendance`, { headers: getHeaders() });
    return res.json();
  },

  async getMyRegistrations() {
    const res = await fetch(`${API_URL}/me/registrations`, { headers: getHeaders() });
    return res.json();
  },

  async updateUser(id: any, data: any) {
    const res = await fetch(`${API_URL}/users/${id}`, {
      method: 'PUT',
      headers: getHeaders(),
      body: JSON.stringify(data)
    });
    return res.json();
  },

  async getSetting(id: string) {
    const res = await fetch(`${API_URL}/settings/${id}`, { headers: getHeaders() });
    return res.json();
  },

  async updateSetting(id: string, data: { value: string }) {
    const res = await fetch(`${API_URL}/settings/${id}`, {
      method: 'PUT',
      headers: getHeaders(),
      body: JSON.stringify(data)
    });
    return res.json();
  },

  // Team Members
  async getTeam() {
    const res = await fetch(`${API_URL}/team`, { headers: getHeaders() });
    return res.json();
  },

  async createTeamMember(data: any) {
    const res = await fetch(`${API_URL}/team`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(data)
    });
    return res.json();
  },

  async updateTeamMember(id: any, data: any) {
    const res = await fetch(`${API_URL}/team/${id}`, {
      method: 'PUT',
      headers: getHeaders(),
      body: JSON.stringify(data)
    });
    return res.json();
  },

  async deleteTeamMember(id: any) {
    const res = await fetch(`${API_URL}/team/${id}`, {
      method: 'DELETE',
      headers: getHeaders()
    });
    return res.json();
  }
};
