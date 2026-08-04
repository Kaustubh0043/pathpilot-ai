import React, { useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { Menu, Flame, Sparkles } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useQuery } from '@tanstack/react-query';
import { api } from '../services/api';

export const DashboardLayout: React.FC = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();
  const mainRef = React.useRef<HTMLElement>(null);

  React.useEffect(() => {
    if (mainRef.current) {
      mainRef.current.scrollTop = 0;
    }
  }, [location.pathname]);

  // Fetch stats to render streak count in header dynamically
  const { data: stats } = useQuery({
    queryKey: ['dashboardStats'],
    queryFn: async () => {
      const res = await api.get('/api/dashboard/stats');
      return res.data;
    },
    refetchInterval: 60000, // every 1 min
  });

  const getPageTitle = () => {
    switch (location.pathname) {
      case '/': return 'Dashboard';
      case '/chat': return 'AI Career Coaching';
      case '/resume': return 'ATS Resume Analyzer';
      case '/jd-match': return 'Job Description Gap Matcher';
      case '/roadmaps': return 'Personalized Learning Roadmaps';
      case '/projects': return 'Developer Project Sandbox';
      case '/interviews': return 'AI Interview Simulator';
      default: return 'PathPilot AI';
    }
  };

  return (
    <div className="min-h-screen bg-[#07080d] text-slate-100 flex overflow-hidden">
      {/* Background Glow Orbs */}
      <div className="glow-orb w-[400px] h-[400px] bg-purple-900/20 top-[-100px] left-[-100px]" />
      <div className="glow-orb w-[500px] h-[500px] bg-indigo-950/20 bottom-[-150px] right-[-100px]" />
      <div className="glow-orb w-[300px] h-[300px] bg-cyan-900/10 top-[40%] left-[60%]" />

      {/* Navigation Sidebar */}
      <Sidebar isOpen={sidebarOpen} setIsOpen={setSidebarOpen} />

      {/* Main Page Area */}
      <div className="flex-1 flex flex-col lg:pl-64 min-w-0">
        
        {/* Top Navigation Bar */}
        <header className="h-16 flex items-center justify-between px-6 border-b border-slate-900 bg-slate-950/40 backdrop-blur-md sticky top-0 z-30">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setSidebarOpen(true)}
              className="p-2 -ml-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800/40 lg:hidden cursor-pointer"
            >
              <Menu className="w-6 h-6" />
            </button>
            <h1 className="text-lg font-bold text-white tracking-tight flex items-center gap-2">
              {getPageTitle()}
            </h1>
          </div>

          <div className="flex items-center gap-4">
            {/* Gamified Study Streak */}
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs font-semibold animate-pulse shadow-sm">
              <Flame className="w-4 h-4 fill-amber-500/10" />
              <span>{stats?.streakCount || 1} Day Streak</span>
            </div>

            {/* Platform Feature Status */}
            <div className="hidden sm:flex items-center gap-1 px-3 py-1.5 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-400 text-xs font-semibold shadow-sm">
              <Sparkles className="w-3.5 h-3.5" />
              <span>AI Engine: Active</span>
            </div>
          </div>
        </header>

        {/* Content Viewport */}
        <main ref={mainRef} className="flex-1 overflow-y-auto p-6 relative z-10">
          <div className="max-w-6xl mx-auto space-y-6">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};
