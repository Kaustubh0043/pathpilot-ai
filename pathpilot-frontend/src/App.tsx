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
import { Onboarding } from './pages/Onboarding';
import { Profile } from './pages/Profile';

// Private Route Guard Component (Redirects to Onboarding if incomplete)
const PrivateRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-[#07080d] flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-purple-500/20 border-t-purple-500 rounded-full animate-spin" />
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/auth" replace />;
  }

  if (user.onboardingCompleted === false) {
    return <Navigate to="/onboarding" replace />;
  }

  return <>{children}</>;
};

// Onboarding Route Guard Component (Only accessible if onboarding is incomplete)
const OnboardingRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-[#07080d] flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-purple-500/20 border-t-purple-500 rounded-full animate-spin" />
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/auth" replace />;
  }

  if (user.onboardingCompleted === true) {
    return <Navigate to="/dashboard" replace />;
  }

  return <>{children}</>;
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

          {/* Onboarding Flow Page */}
          <Route 
            path="/onboarding" 
            element={
              <OnboardingRoute>
                <Onboarding />
              </OnboardingRoute>
            } 
          />

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
            <Route path="profile" element={<Profile />} />
          </Route>

          {/* Fallback Catch-all Route */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
