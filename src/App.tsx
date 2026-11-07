import { useEffect, lazy, Suspense } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from "react-router-dom";
import Layout from "@/src/components/Layout";
import Home from "@/src/pages/Home";
import About from "@/src/pages/About";
import Events from "@/src/pages/Events";
import Contact from "@/src/pages/Contact";
import Courses from "@/src/pages/Courses";
import Team from "@/src/pages/Team";
import CodingArena from "@/src/pages/CodingArena";
import StudentDashboard from "@/src/pages/student/StudentDashboard";
import MySubmissions from "@/src/pages/student/MySubmissions";
import StudentDirectory from "@/src/pages/StudentDirectory";
import StudentLogin from "@/src/pages/StudentLogin";

// Route-level code splitting for heavy admin and utility pages
const NetlifyDeploy = lazy(() => import("@/src/pages/NetlifyDeploy"));
const CertificateDataEntry = lazy(() => import("@/src/pages/CertificateDataEntry"));
const CertificateAttendanceScanner = lazy(() => import("@/src/pages/CertificateAttendanceScanner"));
const Login = lazy(() => import("@/src/pages/admin/Login"));
const Dashboard = lazy(() => import("@/src/pages/admin/Dashboard"));
const AtgfgLogin = lazy(() => import("@/src/pages/atgfg/AtgfgLogin"));
const AtgfgDashboard = lazy(() => import("@/src/pages/atgfg/AtgfgDashboard"));
const AtgfgProtectedRoute = lazy(() => import("@/src/components/atgfg/AtgfgProtectedRoute"));

import { AuthProvider } from "@/src/contexts/AuthContext";
import { ThemeProvider } from "@/src/contexts/ThemeContext";

import AdminProtectedRoute from "@/src/components/admin/AdminProtectedRoute";

// Loading Fallback
function RouteLoader() {
  return (
    <div className="min-h-screen bg-[#F4F4F0] flex items-center justify-center font-mono text-xs text-[#8B9198] animate-pulse select-none">
      SYNCING CHAPTER RESOURCE...
    </div>
  );
}

// ScrollToTop component that resets standard window scroll posture on layout changes
function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "instant" as ScrollBehavior });
  }, [pathname]);

  return null;
}

export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <Router>
          <ScrollToTop />
          <Suspense fallback={<RouteLoader />}>
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<Layout />}>
                <Route index element={<Home />} />
                <Route path="about" element={<About />} />
                <Route path="events" element={<Events />} />
                <Route path="contact" element={<Contact />} />
                <Route path="courses" element={<Courses />} />
                <Route path="coding-arena" element={<CodingArena />} />
                <Route path="leaderboard" element={<Navigate to="/coding-arena?tab=leaderboard" replace />} />
                <Route path="submissions" element={<Navigate to="/student/submissions" replace />} />
                <Route path="announcements" element={<Navigate to="/events" replace />} />
                <Route path="students" element={<StudentDirectory />} />
                <Route path="team" element={<Team />} />
                <Route path="deploy" element={<NetlifyDeploy />} />
                <Route path="certificate-data-entry" element={<CertificateDataEntry />} />
              </Route>

              {/* Dedicated Certificate Attendance Scanner Route */}
              <Route path="/certificate-attendance-scanner" element={<CertificateAttendanceScanner />} />

              {/* Student Authentication Page */}
              <Route path="/login" element={<StudentLogin />} />
              <Route path="/register" element={<StudentLogin />} />
              <Route path="/auth" element={<StudentLogin />} />
              <Route path="/student-login" element={<StudentLogin />} />
              <Route path="/student/portal" element={<Navigate to="/student/dashboard" replace />} />
              <Route path="/student/dashboard" element={<StudentDashboard />} />
              <Route path="/student/submissions" element={<MySubmissions />} />
              <Route path="/arena/submissions" element={<Navigate to="/student/submissions" replace />} />

              {/* Admin Login Route */}
              <Route path="/admin-login" element={<Login />} />

              {/* Secure Protected Admin Routes */}
              <Route path="/admin">
                <Route index element={<Navigate to="/admin/questions" replace />} />
                <Route path="login" element={<Navigate to="/admin-login" replace />} />
                <Route
                  path="dashboard"
                  element={
                    <AdminProtectedRoute>
                      <Dashboard />
                    </AdminProtectedRoute>
                  }
                />
                <Route
                  path="questions"
                  element={
                    <AdminProtectedRoute>
                      <Dashboard />
                    </AdminProtectedRoute>
                  }
                />
                <Route
                  path="students"
                  element={
                    <AdminProtectedRoute>
                      <Dashboard />
                    </AdminProtectedRoute>
                  }
                />
                <Route
                  path="submissions"
                  element={
                    <AdminProtectedRoute>
                      <Dashboard />
                    </AdminProtectedRoute>
                  }
                />
                <Route
                  path="leaderboard"
                  element={
                    <AdminProtectedRoute>
                      <Dashboard />
                    </AdminProtectedRoute>
                  }
                />
                <Route path="events" element={<Navigate to="/admin/questions?tab=events" replace />} />
              </Route>

              {/* Attendance Admin Portal Routes */}
              <Route path="/atgfg" element={<AtgfgLogin />} />
              <Route
                path="/atgfg/dashboard"
                element={
                  <AtgfgProtectedRoute>
                    <AtgfgDashboard />
                  </AtgfgProtectedRoute>
                }
              />

              {/* Fallback */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </Suspense>
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
}
