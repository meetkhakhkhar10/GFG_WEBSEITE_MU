import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Layout from "@/src/components/Layout";
import Home from "@/src/pages/Home";
import About from "@/src/pages/About";
import Events from "@/src/pages/Events";
import Contact from "@/src/pages/Contact";
import Resources from "@/src/pages/Resources";
import Blogs from "@/src/pages/Blogs";
import Team from "@/src/pages/Team";
import StudentPortal from "@/src/pages/student/StudentPortal";
import StudentLogin from "@/src/pages/StudentLogin";
import Login from "@/src/pages/admin/Login";
import Dashboard from "@/src/pages/admin/Dashboard";
import EventManagement from "@/src/pages/admin/EventManagement";

import { AuthProvider } from "@/src/contexts/AuthContext";

export default function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="about" element={<About />} />
          <Route path="events" element={<Events />} />
          <Route path="contact" element={<Contact />} />
          <Route path="resources" element={<Resources />} />
          <Route path="blogs" element={<Blogs />} />
          <Route path="team" element={<Team />} />
        </Route>

        {/* Student Portal */}
        <Route path="/student/portal" element={<StudentPortal />} />
        <Route path="/login" element={<StudentLogin />} />

        {/* Internal Routes */}
        <Route path="/admin">
          <Route path="login" element={<Login />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="events" element={<EventManagement />} />
        </Route>

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
    </AuthProvider>
  );
}
