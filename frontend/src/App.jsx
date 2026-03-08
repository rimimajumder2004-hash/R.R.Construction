import { Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./components/layout/ProtectedRoute";
import { useUIStyles } from "./components/ui";

// Public
import PublicSite from "./pages/public/PublicSite";

// Admin
import LoginPage    from "./pages/admin/LoginPage";
import DashboardPage from "./pages/admin/DashboardPage";
import ProjectsPage  from "./pages/admin/ProjectsPage";
import WorkersPage   from "./pages/admin/WorkersPage";
import AttendancePage from "./pages/admin/AttendancePage";
import SalaryPage    from "./pages/admin/SalaryPage";
import { GalleryPage, InquiriesPage } from "./pages/admin/GalleryAndInquiries";

function AppRoutes() {
  useUIStyles();

  return (
    <Routes>
      {/* Public */}
      <Route path="/"  element={<PublicSite />} />

      {/* Auth */}
      <Route path="/admin/login" element={<LoginPage />} />

      {/* Admin (protected) */}
      <Route path="/admin" element={<ProtectedRoute><DashboardPage /></ProtectedRoute>} />
      <Route path="/admin/projects"   element={<ProtectedRoute><ProjectsPage /></ProtectedRoute>} />
      <Route path="/admin/workers"    element={<ProtectedRoute><WorkersPage /></ProtectedRoute>} />
      <Route path="/admin/attendance" element={<ProtectedRoute><AttendancePage /></ProtectedRoute>} />
      <Route path="/admin/salary"     element={<ProtectedRoute><SalaryPage /></ProtectedRoute>} />
      <Route path="/admin/gallery"    element={<ProtectedRoute><GalleryPage /></ProtectedRoute>} />
      <Route path="/admin/inquiries"  element={<ProtectedRoute><InquiriesPage /></ProtectedRoute>} />

      {/* Fallback */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AppRoutes />
    </AuthProvider>
  );
}
