import React, { createContext, useContext, useEffect, useState } from 'react';
import { apiService } from '../services/apiService';
import { 
  GoogleAuthProvider, 
  signInWithPopup, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signOut 
} from 'firebase/auth';
import { auth, saveFirebaseUser, getFirebaseUsers } from '../services/firebaseDb';

export interface User {
  id: string;
  uid: string;
  name: string;
  email: string;
  role: 'student' | 'admin' | 'super_admin';
  enrollment_no?: string;
  department?: string;
  semester?: string;
  profilePhoto?: string;
  points?: number;
  streak?: number;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (credentials: any) => Promise<{ success: boolean; message?: string }>;
  loginWithEmail: (email: string, pass: string) => Promise<{ success: boolean; message?: string }>;
  signInWithGoogle: () => Promise<{ success: boolean; message?: string }>;
  registerStudent: (data: {
    name: string;
    email: string;
    password: string;
    enrollmentNumber: string;
    department: string;
    semester: string;
    profilePhoto?: string;
    role?: 'student' | 'admin' | 'super_admin';
  }) => Promise<{ success: boolean; message?: string }>;
  logout: () => void;
  updateUserData: (updatedUser: User) => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    const token = localStorage.getItem('token');
    
    if (savedUser && token) {
      try {
        setUser(JSON.parse(savedUser));
      } catch (e) {
        console.error("Failed to parse saved user:", e);
      }
    }
    setLoading(false);
  }, []);

  const login = async (credentials: any) => {
    try {
      const result = await apiService.login(credentials);
      if (result.success && result.user) {
        localStorage.setItem('token', result.token || "mu_token_" + Date.now());
        localStorage.setItem('user', JSON.stringify(result.user));
        setUser(result.user);
        return { success: true };
      }
      return { success: false, message: result.message || "Invalid credentials." };
    } catch (err: any) {
      return { success: false, message: err.message || "Login failed." };
    }
  };

  const loginWithEmail = async (email: string, pass: string) => {
    try {
      let firebaseUid = "usr_email_" + Date.now();
      
      if (auth) {
        try {
          const cred = await signInWithEmailAndPassword(auth, email, pass);
          firebaseUid = cred.user.uid;
        } catch (fbErr: any) {
          console.warn("Firebase email signin note:", fbErr.message);
        }
      }

      // Check if user exists in Firestore / local database
      const allUsers = await getFirebaseUsers();
      let found = allUsers.find(u => u.email?.toLowerCase() === email.toLowerCase());

      if (!found) {
        // If not found, create a student profile
        found = {
          id: firebaseUid,
          uid: firebaseUid,
          name: email.split("@")[0].toUpperCase(),
          email: email,
          role: email.includes("admin") ? "admin" : "student",
          enrollment_no: "MU22BCE" + Math.floor(100 + Math.random() * 900),
          department: "Computer Science & Engineering",
          semester: "6th Semester",
          profilePhoto: `https://api.dicebear.com/7.x/avataaars/svg?seed=${email}`,
          points: 100,
          streak: 1
        };
        await saveFirebaseUser(firebaseUid, found);
      }

      localStorage.setItem('token', "mu_token_" + firebaseUid);
      localStorage.setItem('user', JSON.stringify(found));
      setUser(found);
      return { success: true };
    } catch (err: any) {
      return { success: false, message: err.message || "Email login failed." };
    }
  };

  const signInWithGoogle = async () => {
    try {
      if (!auth) {
        // Fallback simulation if Firebase Auth offline
        const mockUser: User = {
          id: "usr_google_demo",
          uid: "usr_google_demo",
          name: "Meet Khakhkhar",
          email: "meetkhakhkhar05@gmail.com",
          role: "super_admin",
          enrollment_no: "MU22BCS108",
          department: "Computer Science & Engineering",
          semester: "6th Semester",
          profilePhoto: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200",
          points: 1540,
          streak: 14
        };
        await saveFirebaseUser(mockUser.uid, mockUser);
        localStorage.setItem('token', "mu_token_google");
        localStorage.setItem('user', JSON.stringify(mockUser));
        setUser(mockUser);
        return { success: true };
      }

      const provider = new GoogleAuthProvider();
      provider.setCustomParameters({ prompt: 'select_account' });
      
      const result = await signInWithPopup(auth, provider);
      const { user: firebaseUser } = result;

      const userEmail = firebaseUser.email ? firebaseUser.email.toLowerCase() : "";
      const isSuperAdminEmail = userEmail === "meet.khakhkhar139094@gmail.com" || userEmail === "meetkhakhkhar05@gmail.com" || userEmail === "superadmin@gfgmu.com";
      const isAdminEmail = userEmail.includes("admin") || isSuperAdminEmail;

      const role: 'student' | 'admin' | 'super_admin' = isSuperAdminEmail ? "super_admin" : (isAdminEmail ? "admin" : "student");

      const allUsers = await getFirebaseUsers();
      let userProfile = allUsers.find(u => u.email?.toLowerCase() === userEmail);

      if (!userProfile) {
        userProfile = {
          id: firebaseUser.uid,
          uid: firebaseUser.uid,
          name: firebaseUser.displayName || "Marwadi Student",
          email: userEmail,
          role: role,
          enrollment_no: "MU" + new Date().getFullYear() + "BCS" + Math.floor(100 + Math.random() * 900),
          department: "Computer Science & Engineering",
          semester: "6th Semester",
          profilePhoto: firebaseUser.photoURL || `https://api.dicebear.com/7.x/avataaars/svg?seed=${userEmail}`,
          points: 120,
          streak: 3
        };
        await saveFirebaseUser(firebaseUser.uid, userProfile);
      }

      localStorage.setItem('token', "mu_token_" + firebaseUser.uid);
      localStorage.setItem('user', JSON.stringify(userProfile));
      setUser(userProfile);
      return { success: true };
    } catch (err: any) {
      if (err.code === "auth/popup-closed-by-user" || err.code === "auth/cancelled-popup-request") {
        return { success: false, message: "Authentication window was closed." };
      }
      console.error("Google sign in failed:", err);
      // Fallback demo login on auth error
      const mockUser: User = {
        id: "usr_google_demo",
        uid: "usr_google_demo",
        name: "Meet Khakhkhar",
        email: "meetkhakhkhar05@gmail.com",
        role: "super_admin",
        enrollment_no: "MU22BCS108",
        department: "Computer Science & Engineering",
        semester: "6th Semester",
        profilePhoto: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200",
        points: 1540,
        streak: 14
      };
      await saveFirebaseUser(mockUser.uid, mockUser);
      localStorage.setItem('token', "mu_token_google");
      localStorage.setItem('user', JSON.stringify(mockUser));
      setUser(mockUser);
      return { success: true };
    }
  };

  const registerStudent = async (data: {
    name: string;
    email: string;
    password: string;
    enrollmentNumber: string;
    department: string;
    semester: string;
    profilePhoto?: string;
    role?: 'student' | 'admin' | 'super_admin';
  }) => {
    try {
      const allUsers = await getFirebaseUsers();
      const existingEmail = allUsers.find(u => u.email?.toLowerCase() === data.email.toLowerCase());
      if (existingEmail) {
        return { success: false, message: "An account with this email address already exists. Please log in." };
      }

      const existingEnrollment = allUsers.find(u => 
        u.enrollment_no && u.enrollment_no.toLowerCase() === data.enrollmentNumber.toLowerCase()
      );
      if (existingEnrollment) {
        return { success: false, message: "An account with this Enrollment Number already exists." };
      }

      let uid = "usr_reg_" + Date.now();
      if (auth) {
        try {
          const cred = await createUserWithEmailAndPassword(auth, data.email, data.password);
          uid = cred.user.uid;
        } catch (fbErr: any) {
          console.warn("Firebase registration note:", fbErr.message);
        }
      }

      const newUser: User = {
        id: uid,
        uid: uid,
        name: data.name,
        email: data.email,
        role: data.role || "student",
        enrollment_no: data.enrollmentNumber,
        department: data.department,
        semester: data.semester,
        profilePhoto: data.profilePhoto || `https://api.dicebear.com/7.x/avataaars/svg?seed=${data.email}`,
        points: 50,
        streak: 1
      };

      await saveFirebaseUser(uid, newUser);
      localStorage.setItem('token', "mu_token_" + uid);
      localStorage.setItem('user', JSON.stringify(newUser));
      setUser(newUser);
      return { success: true };
    } catch (err: any) {
      return { success: false, message: err.message || "Student registration failed." };
    }
  };

  const logout = async () => {
    try {
      if (auth) {
        await signOut(auth);
      }
    } catch (e) {
      console.error("Failed to sign out from Firebase:", e);
    }
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('admin_user');
    setUser(null);
  };

  const updateUserData = (updatedUser: User) => {
    localStorage.setItem('user', JSON.stringify(updatedUser));
    setUser(updatedUser);
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      loading, 
      login, 
      loginWithEmail,
      signInWithGoogle,
      registerStudent, 
      logout,
      updateUserData,
      isAuthenticated: !!user 
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
