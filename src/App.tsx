import { useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from "react-router-dom";
import Layout from "@/src/components/Layout";
import Home from "@/src/pages/Home";
import About from "@/src/pages/About";
import Events from "@/src/pages/Events";
import Contact from "@/src/pages/Contact";
import Courses from "@/src/pages/Courses";
import Team from "@/src/pages/Team";
import StudentPortal from "@/src/pages/student/StudentPortal";
import StudentDashboard from "@/src/pages/student/StudentDashboard";
import StudentLogin from "@/src/pages/StudentLogin";
import Login from "@/src/pages/admin/Login";
import Dashboard from "@/src/pages/admin/Dashboard";
import EventManagement from "@/src/pages/admin/EventManagement";

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
            <Route path="team" element={<Team />} />
          </Route>

          {/* Student Portal */}
          <Route path="/student/portal" element={<StudentPortal />} />
          <Route path="/student/dashboard" element={<StudentDashboard />} />
          <Route path="/student-login" element={<Navigate to="/login" replace />} />
          <Route path="/login" element={<StudentLogin />} />

          {/* Admin Login */}
          <Route path="/admin-login" element={<Login />} />

          {/* Internal Routes */}
          <Route path="/admin">
            <Route index element={<Navigate to="/admin-login" replace />} />
            <Route path="login" element={<Navigate to="/admin-login" replace />} />
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="events" element={<EventManagement />} />
          </Route>

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
      </AuthProvider>
    </ThemeProvider>
  );
}
