import React, { createContext, useContext, useEffect, useState } from 'react';
import { apiService } from '../services/apiService';
import { GoogleAuthProvider, signInWithPopup, signOut } from 'firebase/auth';
import { auth } from '../services/firebaseDb';

interface User {
  id: any;
  name: string;
  email: string;
  role: string;
  enrollment_no?: string;
  department?: string;
  year?: string;
  profilePhoto?: string;
  points?: number;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (credentials: any) => Promise<boolean>;
  signInWithGoogle: () => Promise<{ success: boolean; message?: string }>;
  register: (data: any) => Promise<boolean>;
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
      setUser(JSON.parse(savedUser));
    }
    setLoading(false);
  }, []);

  const login = async (credentials: any) => {
    const result = await apiService.login(credentials);
    if (result.success) {
      localStorage.setItem('token', result.token);
      localStorage.setItem('user', JSON.stringify(result.user));
      setUser(result.user);
      return true;
    }
    return false;
  };

  const signInWithGoogle = async () => {
    try {
      if (!auth) {
        throw new Error("Firebase Service is not available currently.");
      }
      const provider = new GoogleAuthProvider();
      provider.setCustomParameters({ prompt: 'select_account' });
      
      const result = await signInWithPopup(auth, provider);
      const { user: firebaseUser } = result;

      const userEmail = firebaseUser.email ? firebaseUser.email.toLowerCase() : "";
      const isSuperAdminEmail = userEmail === "meet.khakhkhar139094@gmail.com" || userEmail === "superadmin@gfgmu.com";

      if (!isSuperAdminEmail && (!userEmail || !userEmail.endsWith("@marwadiuniversity.ac.in"))) {
        await signOut(auth);
        return { 
          success: false, 
          message: "Only Marwadi University students are allowed to access this portal." 
        };
      }

      // Sync and retrieve user session details from Node/Firebase database
      const response = await apiService.loginWithGoogle({
        uid: firebaseUser.uid,
        email: firebaseUser.email,
        name: firebaseUser.displayName,
        photoURL: firebaseUser.photoURL
      });

      if (response.success) {
        localStorage.setItem('token', response.token);
        localStorage.setItem('user', JSON.stringify(response.user));
        setUser(response.user);
        return { success: true };
      } else {
        await signOut(auth);
        return { success: false, message: response.message || "Failed to authenticate with project node." };
      }
    } catch (err: any) {
      if (err.code === "auth/popup-closed-by-user" || err.code === "auth/cancelled-popup-request") {
        console.warn("Google sign in popup closed by user.");
        return { success: false, message: "Authentication window was closed." };
      }
      console.error("Google sign in failed:", err);
      return { success: false, message: err.message || "Sign in process failed." };
    }
  };

  const register = async (data: any) => {
    const result = await apiService.register(data);
    return result.success;
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
      signInWithGoogle,
      register, 
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
