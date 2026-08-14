import React, { useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { Menu } from 'lucide-react';
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
      case '/dashboard/chat': return 'Career Coach';
      case '/dashboard/resume': return 'Resume';
      case '/dashboard/jd-match': return 'Job Match';
      case '/dashboard/roadmaps': return 'Learning Paths';
      case '/dashboard/projects': return 'Projects';
      case '/dashboard/interviews': return 'Interviews';
      default: return 'PathPilot';
    }
  };

  return (
    <div className="relative min-h-screen text-[#F4F1EA] flex overflow-hidden bg-[#07080C]">
      {/* Background Container */}
      <div className="aurora-container">
        <div className="cyber-grid-2d" />
      </div>

      {/* Navigation Sidebar */}
      <Sidebar isOpen={sidebarOpen} setIsOpen={setSidebarOpen} />

      {/* Main Page Area */}
      <div className="flex-1 flex flex-col lg:pl-64 min-w-0">
        
        {/* Top Navigation Bar (Point 28) */}
        <header className="h-16 flex items-center justify-between px-6 border-b border-slate-900 bg-[#0D1016]/40 backdrop-blur-md sticky top-0 z-30">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setSidebarOpen(true)}
              className="p-2 -ml-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800/40 lg:hidden cursor-pointer"
            >
              <Menu className="w-5 h-5" />
            </button>
            <h1 className="text-base font-bold text-[#F4F1EA] tracking-tight">
              {getPageTitle()}
            </h1>
          </div>

          <div className="flex items-center gap-4 text-xs font-semibold text-[#9299A8]">
            {/* Subtle Study Streak (Point 28) */}
            <div className="flex items-center gap-1.5 px-3 py-1 bg-[#11151D] border border-slate-800/60 rounded text-[#F4F1EA] shadow-sm">
              <span>🔥 {stats?.streakCount || 1} day</span>
            </div>

            {/* Muted Path Indicator */}
            <div className="hidden sm:block text-[11px] font-medium text-[#606979]">
              Software Engineer path
            </div>
          </div>
        </header>

        {/* Content Viewport */}
        <main ref={mainRef} className="flex-1 overflow-y-auto p-4 sm:p-8 relative z-10">
          <div className="max-w-5xl mx-auto space-y-8">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};
