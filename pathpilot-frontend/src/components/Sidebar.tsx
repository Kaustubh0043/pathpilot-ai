import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { 
  LayoutDashboard, 
  MessageSquare, 
  FileText, 
  FileCheck, 
  Map, 
  Terminal, 
  UserCheck, 
  LogOut,
  Compass
} from 'lucide-react';

interface SidebarProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ isOpen, setIsOpen }) => {
  const { logout, user } = useAuth();
  const navigate = useNavigate();

  const menuItems = [
    { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { name: 'AI Coaching Chat', path: '/dashboard/chat', icon: MessageSquare },
    { name: 'Resume Analyzer', path: '/dashboard/resume', icon: FileText },
    { name: 'Job Match (JD)', path: '/dashboard/jd-match', icon: FileCheck },
    { name: 'Learning Paths', path: '/dashboard/roadmaps', icon: Map },
    { name: 'Project Generator', path: '/dashboard/projects', icon: Terminal },
    { name: 'Interview Coach', path: '/dashboard/interviews', icon: UserCheck },
  ];

  const handleLogout = () => {
    logout();
    navigate('/auth');
  };

  return (
    <>
      {/* Mobile Sidebar Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm lg:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      <aside className={`
        fixed top-0 bottom-0 left-0 z-50 flex flex-col w-64 glass-panel border-r border-slate-800/80 transition-transform duration-300 ease-in-out
        lg:translate-x-0 ${isOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        {/* Logo Section */}
        <div className="flex items-center gap-2 px-6 h-16 border-b border-slate-800/65">
          <Compass className="w-8 h-8 text-purple-500 animate-pulse" />
          <span className="text-xl font-bold tracking-tight text-white">
            PathPilot<span className="text-purple-500">.AI</span>
          </span>
        </div>

        {/* User Card */}
        <div className="px-6 py-4 border-b border-slate-800/65 bg-slate-900/20">
          <p className="text-xs text-slate-400">Signed in as</p>
          <p className="font-semibold text-white truncate">{user?.fullName || 'Developer'}</p>
          <p className="text-xs text-slate-500 truncate">{user?.email}</p>
        </div>

        {/* Nav Links */}
        <nav className="flex-1 px-4 py-6 space-y-1.5 overflow-y-auto">
          {menuItems.map((item) => (
            <NavLink
              key={item.name}
              to={item.path}
              onClick={() => setIsOpen(false)}
              className={({ isActive }) => `
                flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200 group
                ${isActive 
                  ? 'bg-purple-600/20 text-purple-400 border border-purple-500/30' 
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/40 border border-transparent'}
              `}
            >
              <item.icon className="w-5 h-5 transition-transform duration-200 group-hover:scale-110" />
              <span>{item.name}</span>
            </NavLink>
          ))}
        </nav>

        {/* Footer / Logout */}
        <div className="p-4 border-t border-slate-800/65 bg-slate-950/40">
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 w-full px-4 py-3 rounded-lg text-sm font-medium text-rose-400 hover:bg-rose-500/10 hover:text-rose-300 border border-transparent hover:border-rose-500/20 transition-all duration-200 cursor-pointer"
          >
            <LogOut className="w-5 h-5" />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>
    </>
  );
};
