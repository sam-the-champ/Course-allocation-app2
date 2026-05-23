import axios from 'axios';

// All API calls go through this instance — no hardcoded URLs anywhere else in the app
const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || '/api',
  headers: { 'Content-Type': 'application/json' },
});

// Attach token to every request automatically
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Handle 401 globally — token expired or invalid
api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/';
    }
    return Promise.reject(err);
  }
);

// ─── Auth ────────────────────────────────────────────────────────────────────
export const adminLogin = (data) => api.post('/auth/admin/login', data);
export const lecturerLogin = (data) => api.post('/auth/lecturer/login', data);

// ─── Admin ───────────────────────────────────────────────────────────────────
export const getDashboardStats = () => api.get('/admin/dashboard');

export const getLecturers = () => api.get('/admin/lecturers');
export const addLecturer = (data) => api.post('/admin/lecturers', data);
export const deleteLecturer = (id) => api.delete(`/admin/lecturers/${id}`);

export const getCourses = () => api.get('/admin/courses');
export const addCourse = (data) => api.post('/admin/courses', data);
export const deleteCourse = (id) => api.delete(`/admin/courses/${id}`);

export const getAllocations = () => api.get('/admin/allocations');
export const allocateCourse = (data) => api.post('/admin/allocations', data);
export const deleteAllocation = (id) => api.delete(`/admin/allocations/${id}`);

// ─── Lecturer ─────────────────────────────────────────────────────────────────
export const getMyProfile = () => api.get('/lecturer/me');
export const getMyAllocations = () => api.get('/lecturer/my-allocations');

export default api;
