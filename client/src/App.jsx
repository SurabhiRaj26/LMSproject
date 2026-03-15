import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider, useAuth } from './context/AuthContext';
import Navbar from './components/Navbar';

// Pages
import Home from './pages/Home';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Courses from './pages/Courses';
import CourseDetails from './pages/CourseDetails';
import LearningPage from './pages/LearningPage';
import Dashboard from './pages/Dashboard';
import InstructorCreate from './pages/InstructorCreate';

// Protected route wrapper
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? children : <Navigate to="/login" replace />;
};

// Layout with Navbar (list routes that DON'T need full-screen layout)
const WithNavbar = ({ children }) => (
  <>
    <Navbar />
    <main>{children}</main>
  </>
);

const AppRoutes = () => {
  return (
    <Routes>
      {/* Public */}
      <Route path="/" element={<WithNavbar><Home /></WithNavbar>} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/courses" element={<WithNavbar><Courses /></WithNavbar>} />
      <Route path="/courses/:id" element={<WithNavbar><CourseDetails /></WithNavbar>} />

      {/* Protected */}
      <Route path="/dashboard" element={<ProtectedRoute><WithNavbar><Dashboard /></WithNavbar></ProtectedRoute>} />
      <Route path="/my-learning" element={<ProtectedRoute><WithNavbar><Dashboard /></WithNavbar></ProtectedRoute>} />
      <Route path="/learn/:courseId" element={<ProtectedRoute><LearningPage /></ProtectedRoute>} />
      <Route path="/instructor/create" element={<ProtectedRoute><InstructorCreate /></ProtectedRoute>} />

      {/* Fallback */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

const App = () => {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppRoutes />
        <Toaster
          position="top-right"
          toastOptions={{
            style: {
              background: '#1e293b',
              color: '#f1f5f9',
              border: '1px solid rgba(100,116,139,0.3)',
              borderRadius: '12px',
              fontSize: '14px',
            },
            success: { iconTheme: { primary: '#34d399', secondary: '#1e293b' } },
            error: { iconTheme: { primary: '#f87171', secondary: '#1e293b' } },
          }}
        />
      </AuthProvider>
    </BrowserRouter>
  );
};

export default App;
