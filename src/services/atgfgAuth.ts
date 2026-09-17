/**
 * Dedicated Authentication Service for Attendance Admin Portal (/atgfg)
 * Independent from the main site authentication system.
 */

const AUTH_KEY = "atgfg_attendance_admin_token";
const AUTH_USER_KEY = "atgfg_attendance_admin_user";

// Configurable admin credentials - easily updated in future or wired to an API
const ADMIN_CREDENTIALS = {
  username: "admin",
  password: "admin",
  role: "Attendance Administrator",
  name: "System Admin",
};

export interface AtgfgUser {
  username: string;
  name: string;
  role: string;
  loginTime: string;
}

export const atgfgAuth = {
  /**
   * Validate admin credentials and initialize session
   */
  login(username: string, password: string): { success: boolean; user?: AtgfgUser; error?: string } {
    const cleanUser = username.trim();
    const cleanPass = password.trim();

    if (cleanUser === ADMIN_CREDENTIALS.username && cleanPass === ADMIN_CREDENTIALS.password) {
      const user: AtgfgUser = {
        username: ADMIN_CREDENTIALS.username,
        name: ADMIN_CREDENTIALS.name,
        role: ADMIN_CREDENTIALS.role,
        loginTime: new Date().toISOString(),
      };

      try {
        sessionStorage.setItem(AUTH_KEY, `token-${Date.now()}`);
        sessionStorage.setItem(AUTH_USER_KEY, JSON.stringify(user));
        localStorage.setItem(AUTH_KEY, `token-${Date.now()}`); // Persist for convenience
      } catch (e) {
        console.warn("Storage write notice:", e);
      }

      return { success: true, user };
    }

    return { success: false, error: "Invalid username or password" };
  },

  /**
   * Check if user is currently authenticated for /atgfg
   */
  isAuthenticated(): boolean {
    try {
      const tokenSession = sessionStorage.getItem(AUTH_KEY);
      const tokenLocal = localStorage.getItem(AUTH_KEY);
      return Boolean(tokenSession || tokenLocal);
    } catch {
      return false;
    }
  },

  /**
   * Get current authenticated admin user details
   */
  getUser(): AtgfgUser | null {
    try {
      const raw = sessionStorage.getItem(AUTH_USER_KEY);
      if (raw) return JSON.parse(raw);
    } catch (e) {
      console.warn("User parse notice:", e);
    }
    if (this.isAuthenticated()) {
      return {
        username: ADMIN_CREDENTIALS.username,
        name: ADMIN_CREDENTIALS.name,
        role: ADMIN_CREDENTIALS.role,
        loginTime: new Date().toISOString(),
      };
    }
    return null;
  },

  /**
   * Terminate active session
   */
  logout(): void {
    try {
      sessionStorage.removeItem(AUTH_KEY);
      sessionStorage.removeItem(AUTH_USER_KEY);
      localStorage.removeItem(AUTH_KEY);
    } catch (e) {
      console.warn("Storage clear notice:", e);
    }
  },
};

export default atgfgAuth;
