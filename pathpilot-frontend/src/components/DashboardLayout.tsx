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
      case '/dashboard': return 'Dashboard';
      case '/dashboard/chat': return 'AI Career Coaching';
      case '/dashboard/resume': return 'ATS Resume Analyzer';
      case '/dashboard/jd-match': return 'Job Description Gap Matcher';
      case '/dashboard/roadmaps': return 'Personalized Learning Roadmaps';
      case '/dashboard/projects': return 'Developer Project Sandbox';
      case '/dashboard/interviews': return 'AI Interview Simulator';
      default: return 'PathPilot AI';
    }
  };

  return (
    <div className="relative min-h-screen text-slate-100 flex overflow-hidden">
      {/* Animated Glowing Orbs & Cyber Grid Backdrop */}
      <div className="aurora-container">
        <div className="cyber-grid-2d" />
        <div className="aurora-orb aurora-1" />
        <div className="aurora-orb aurora-2" />
        <div className="aurora-orb aurora-3" />
        <div className="aurora-orb aurora-4" />
        {/* Scanning Cyber Beams */}
        <div className="grid-beam beam-1" />
        <div className="grid-beam-v beam-2" />
        <div className="grid-beam-v beam-3" />
        {/* Glow Particles */}
        <div className="glow-particle animate-pulse-slow top-[20%] left-[30%] w-1.5 h-1.5 bg-purple-500/35" />
        <div className="glow-particle animate-pulse-fast top-[60%] left-[85%] w-1.5 h-1.5 bg-indigo-400/30" />
        <div className="glow-particle animate-pulse-slow top-[80%] left-[25%] w-2 h-2 bg-cyan-400/20" />
        <div className="glow-particle animate-pulse-fast top-[40%] left-[70%] w-1 h-1 bg-pink-500/25" />
      </div>

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
        <main ref={mainRef} className="flex-1 overflow-y-auto p-3 sm:p-6 relative z-10">
          <div className="max-w-6xl mx-auto space-y-4 sm:space-y-6">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};
