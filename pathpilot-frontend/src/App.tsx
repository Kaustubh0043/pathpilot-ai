import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { DashboardLayout } from './components/DashboardLayout';
import { Auth } from './pages/Auth';
import { Landing } from './pages/Landing';
import { Dashboard } from './pages/Dashboard';
import { Chat } from './pages/Chat';
import { Resume } from './pages/Resume';
import { JdMatch } from './pages/JdMatch';
import { Roadmaps } from './pages/Roadmaps';
import { Projects } from './pages/Projects';
import { Interviews } from './pages/Interviews';

// Private Route Guard Component
const PrivateRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-[#07080d] flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-purple-500/20 border-t-purple-500 rounded-full animate-spin" />
      </div>
    );
  }

  return user ? <>{children}</> : <Navigate to="/auth" replace />;
};

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          {/* Public Home Landing Page */}
          <Route path="/" element={<Landing />} />

          {/* Public Auth Routes */}
          <Route path="/auth" element={<Auth />} />

          {/* Secure Dashboard Shell */}
          <Route 
            path="/dashboard" 
            element={
              <PrivateRoute>
                <DashboardLayout />
              </PrivateRoute>
            }
          >
            <Route index element={<Dashboard />} />
            <Route path="chat" element={<Chat />} />
            <Route path="resume" element={<Resume />} />
            <Route path="jd-match" element={<JdMatch />} />
            <Route path="roadmaps" element={<Roadmaps />} />
            <Route path="projects" element={<Projects />} />
            <Route path="interviews" element={<Interviews />} />
          </Route>

          {/* Fallback Catch-all Route */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
