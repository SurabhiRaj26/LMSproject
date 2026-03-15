import axios from 'axios';

const api = axios.create({
  baseURL: '/api',
  headers: { 'Content-Type': 'application/json' },
});

// Attach JWT token to every request
api.interceptors.request.use((config) => {
  const user = JSON.parse(localStorage.getItem('lmsUser') || 'null');
  if (user?.token) {
    config.headers.Authorization = `Bearer ${user.token}`;
  }
  return config;
});

// Handle 401 globally
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('lmsUser');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// ── Auth ──────────────────────────────────────────────────────────────────
export const signupAPI    = (data) => api.post('/auth/signup', data);
export const loginAPI     = (data) => api.post('/auth/login', data);
export const getMeAPI     = ()     => api.get('/auth/me');

// ── Courses ───────────────────────────────────────────────────────────────
export const getCoursesAPI    = (params) => api.get('/courses', { params });
export const getCourseAPI     = (id)     => api.get(`/courses/${id}`);
export const createCourseAPI  = (data)   => api.post('/courses', data);
export const updateCourseAPI  = (id, d)  => api.put(`/courses/${id}`, d);
export const deleteCourseAPI  = (id)     => api.delete(`/courses/${id}`);
export const enrollCourseAPI  = (id)     => api.post(`/courses/${id}/enroll`);
export const myCoursesAPI     = ()       => api.get('/courses/my-courses');

// ── Lessons ───────────────────────────────────────────────────────────────
export const getLessonsAPI   = (courseId) => api.get(`/lessons/${courseId}`);
export const getLessonAPI    = (id)       => api.get(`/lessons/single/${id}`);
export const createLessonAPI = (data)     => api.post('/lessons', data);
export const updateLessonAPI = (id, d)    => api.put(`/lessons/${id}`, d);
export const deleteLessonAPI = (id)       => api.delete(`/lessons/${id}`);

// ── Progress ──────────────────────────────────────────────────────────────
export const updateProgressAPI    = (data)   => api.post('/progress/update', data);
export const getUserProgressAPI   = (userId) => api.get(`/progress/${userId}`);
export const getCourseProgressAPI = (cId)    => api.get(`/progress/course/${cId}`);

export default api;
