import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import LoginPage from './pages/LoginPage';
import AdminLayout from './pages/admin/AdminLayout';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminLecturers from './pages/admin/AdminLecturers';
import AdminCourses from './pages/admin/AdminCourses';
import AdminAllocations from './pages/admin/AdminAllocations';
import LecturerLayout from './pages/lecturer/LecturerLayout';
import LecturerDashboard from './pages/lecturer/LecturerDashboard';

const RequireAuth = ({ children, role }) => {
  const { user } = useAuth();
  if (!user) return <Navigate to="/" replace />;
  if (role && user.role !== role) return <Navigate to="/" replace />;
  return children;
};

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<LoginPage />} />

      <Route path="/admin" element={<RequireAuth role="admin"><AdminLayout /></RequireAuth>}>
        <Route index element={<AdminDashboard />} />
        <Route path="lecturers" element={<AdminLecturers />} />
        <Route path="courses" element={<AdminCourses />} />
        <Route path="allocations" element={<AdminAllocations />} />
      </Route>

      <Route path="/lecturer" element={<RequireAuth role="lecturer"><LecturerLayout /></RequireAuth>}>
        <Route index element={<LecturerDashboard />} />
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
