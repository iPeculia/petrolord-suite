import React from 'react';
import { Outlet, NavLink, useLocation } from 'react-router-dom';
import { LayoutDashboard, FolderKanban, CheckSquare, User, Bell } from 'lucide-react';

const MobileLayout = () => {
  const location = useLocation();

  const navItems = [
    { path: '/mobile/dashboard', icon: LayoutDashboard, label: 'Home' },
    { path: '/mobile/projects', icon: FolderKanban, label: 'Projects' },
    { path: '/mobile/tasks', icon: CheckSquare, label: 'Tasks' },
    { path: '/mobile/notifications', icon: Bell, label: 'Alerts' },
    { path: '/mobile/profile', icon: User, label: 'Profile' },
  ];

  return (
    <div className="flex flex-col h-screen bg-slate-950 text-white overflow-hidden">
      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto pb-20">
        <Outlet />
      </main>

      {/* Bottom Navigation Bar */}
      <nav className="fixed bottom-0 left-0 right-0 bg-slate-900 border-t border-slate-800 pb-safe pt-2 px-2 z-50 h-16">
        <div className="flex justify-around items-center h-full">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname.startsWith(item.path);
            
            return (
              <NavLink 
                key={item.path} 
                to={item.path}
                className={`flex flex-col items-center gap-1 w-16 transition-colors ${isActive ? 'text-blue-500' : 'text-slate-500 hover:text-slate-300'}`}
              >
                <Icon className={`w-6 h-6 ${isActive ? 'fill-blue-500/20' : ''}`} />
                <span className="text-[10px] font-medium">{item.label}</span>
              </NavLink>
            );
          })}
        </div>
      </nav>
    </div>
  );
};

export default MobileLayout;