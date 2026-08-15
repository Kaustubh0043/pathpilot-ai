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
import logoImg from '../assets/logo.png';

interface SidebarProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ isOpen, setIsOpen }) => {
  const { logout, user } = useAuth();
  const navigate = useNavigate();

  // Reorganized navigation groups (Points 27, 35)
  const navSections = [
    {
      title: 'OVERVIEW',
      items: [
        { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard }
      ]
    },
    {
      title: 'YOUR PATH',
      items: [
        { name: 'Resume', path: '/dashboard/resume', icon: FileText },
        { name: 'Learning', path: '/dashboard/roadmaps', icon: Map },
        { name: 'Projects', path: '/dashboard/projects', icon: Terminal }
      ]
    },
    {
      title: 'PREPARE',
      items: [
        { name: 'Job Match', path: '/dashboard/jd-match', icon: FileCheck },
        { name: 'Interviews', path: '/dashboard/interviews', icon: UserCheck }
      ]
    },
    {
      title: 'COACH',
      items: [
        { name: 'Career Coach', path: '/dashboard/chat', icon: MessageSquare }
      ]
    }
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
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm lg:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      <aside className={`
        fixed top-0 bottom-0 left-0 z-50 flex flex-col w-64 bg-[#0D1016] border-r border-slate-900 transition-transform duration-300 ease-in-out
        lg:translate-x-0 ${isOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        {/* Logo Section */}
        <div className="flex items-center gap-3 px-6 h-16 border-b border-slate-900">
          <img src={logoImg} alt="VertexPath Logo" className="w-10 h-10 object-contain" style={{ mixBlendMode: 'screen' }} />
          <span className="text-base font-bold tracking-tight text-[#F4F1EA] font-display">
            VERTEXPATH
          </span>
        </div>

        {/* User Card */}
        <div className="px-6 py-4 border-b border-slate-900 bg-slate-950/20 flex flex-col gap-1.5">
          <div>
            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Signed In As</p>
            <p className="font-semibold text-[#F4F1EA] truncate text-sm mt-0.5">{user?.fullName || 'Developer'}</p>
            <p className="text-[11px] text-[#606979] truncate">{user?.email}</p>
          </div>
          <NavLink 
            to="/dashboard/profile"
            className={({ isActive }) => 
              `text-[10px] font-bold tracking-wider uppercase text-left transition-colors cursor-pointer ${
                isActive ? 'text-[#9B5CFF]' : 'text-slate-500 hover:text-white'
              }`
            }
          >
            Edit Career Profile →
          </NavLink>
        </div>

        {/* Reorganized grouped Nav Links (Point 27) */}
        <nav className="flex-1 px-4 py-6 space-y-6 overflow-y-auto custom-scrollbar">
          {navSections.map((section) => (
            <div key={section.title} className="space-y-2">
              <h4 className="px-3 text-[10px] font-bold text-[#606979] uppercase tracking-[0.2em]">
                {section.title}
              </h4>
              <div className="space-y-1">
                {section.items.map((item) => (
                  <NavLink
                    key={item.name}
                    to={item.path}
                    onClick={() => setIsOpen(false)}
                    className={({ isActive }) => `
                      flex items-center gap-3 py-2.5 rounded text-sm font-medium transition-all duration-200 group
                      ${isActive 
                        ? 'text-[#F4F1EA] border-l-2 border-[#9B5CFF] pl-3 bg-[#11151D]/60' 
                        : 'text-[#9299A8] hover:text-[#F4F1EA] pl-3 border-l-2 border-transparent hover:bg-[#11151D]/20'}
                    `}
                  >
                    <item.icon className="w-4 h-4 transition-transform duration-200 group-hover:scale-105" />
                    <span>{item.name}</span>
                  </NavLink>
                ))}
              </div>
            </div>
          ))}
        </nav>

        {/* Footer / Logout */}
        <div className="p-4 border-t border-slate-900 bg-slate-950/20">
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 w-full px-4 py-2.5 rounded text-xs font-semibold text-[#FF6577] hover:bg-[#FF6577]/10 transition-all duration-200 cursor-pointer"
          >
            <LogOut className="w-4 h-4" />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>
    </>
  );
};
