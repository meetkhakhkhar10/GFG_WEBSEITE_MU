import { useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from "react-router-dom";
import Layout from "@/src/components/Layout";
import Home from "@/src/pages/Home";
import About from "@/src/pages/About";
import Events from "@/src/pages/Events";
import Contact from "@/src/pages/Contact";
import Courses from "@/src/pages/Courses";
import Team from "@/src/pages/Team";
import NetlifyDeploy from "@/src/pages/NetlifyDeploy";
import StudentDashboard from "@/src/pages/student/StudentDashboard";
import Login from "@/src/pages/admin/Login";
import Dashboard from "@/src/pages/admin/Dashboard";

import { AuthProvider } from "@/src/contexts/AuthContext";
import { ThemeProvider } from "@/src/contexts/ThemeContext";

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
          <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Layout />}>
            <Route index element={<Home />} />
            <Route path="about" element={<About />} />
            <Route path="events" element={<Events />} />
            <Route path="contact" element={<Contact />} />
            <Route path="courses" element={<Courses />} />
            <Route path="resources" element={<StudentDashboard />} />
            <Route path="team" element={<Team />} />
            <Route path="deploy" element={<NetlifyDeploy />} />
          </Route>

          {/* Student Portal redirects to public resources */}
          <Route path="/student/portal" element={<Navigate to="/resources" replace />} />
          <Route path="/student/dashboard" element={<Navigate to="/resources" replace />} />
          <Route path="/student-login" element={<Navigate to="/resources" replace />} />
          <Route path="/login" element={<Navigate to="/resources" replace />} />

          {/* Admin Login */}
          <Route path="/admin-login" element={<Login />} />

          {/* Internal Routes */}
          <Route path="/admin">
            <Route index element={<Navigate to="/admin-login" replace />} />
            <Route path="login" element={<Navigate to="/admin-login" replace />} />
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="events" element={<Navigate to="/admin/dashboard?tab=events" replace />} />
          </Route>

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
      </AuthProvider>
    </ThemeProvider>
  );
}
