import React from 'react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { 
  Settings, 
  HelpCircle, 
  Menu,
  Box,
  GraduationCap,
  Bell
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useHelp } from '@/context/HelpContext';
import { useTraining } from '@/context/TrainingContext';
import { useSettings } from '@/context/SettingsContext';
import NotificationCenter from '@/components/earthmodel/notifications/NotificationCenter';
import BackToGeoscienceDashboard from '@/components/earthmodel/navigation/BackToGeoscienceDashboard';

const EarthModelProHeader = ({ activeModule, activeProject, toggleSidebar }) => {
  const { toggleHelp } = useHelp();
  const { toggleTraining } = useTraining();
  const { toggleSettings } = useSettings();

  return (
    <header className="h-14 bg-slate-950 border-b border-slate-800 flex items-center justify-between px-4 shrink-0 z-20 relative">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" className="lg:hidden" onClick={toggleSidebar}>
          <Menu className="w-5 h-5 text-slate-400" />
        </Button>
        
        <BackToGeoscienceDashboard />

        <div className="h-6 w-px bg-slate-800 mx-2 hidden md:block" />
        
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-blue-800 rounded-lg flex items-center justify-center shadow-lg shadow-blue-900/20">
            <Box className="w-5 h-5 text-white" />
          </div>
          <div className="hidden md:block">
            <h1 className="font-bold text-slate-100 leading-none tracking-tight">EarthModel Pro</h1>
            <div className="flex items-center gap-2 mt-0.5">
              <span className="text-[10px] text-blue-400 font-mono">v4.0.0</span>
              {activeProject && (
                <span className="text-[10px] text-slate-500">• {activeProject.name}</span>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-1">
        <div className="flex items-center gap-1 mr-2 border-r border-slate-800 pr-2">
          <Button variant="ghost" size="icon" className="text-slate-400 hover:text-white w-8 h-8 hover:bg-slate-800" onClick={toggleTraining} title="Training (F2)">
            <GraduationCap className="w-4 h-4" />
          </Button>
          <Button variant="ghost" size="icon" className="text-slate-400 hover:text-white w-8 h-8 hover:bg-slate-800" onClick={toggleHelp} title="Help (F1)">
            <HelpCircle className="w-4 h-4" />
          </Button>
          <Button variant="ghost" size="icon" className="text-slate-400 hover:text-white w-8 h-8 hover:bg-slate-800" onClick={toggleSettings} title="Settings">
            <Settings className="w-4 h-4" />
          </Button>
          <NotificationCenter />
        </div>
        
        <div className="flex items-center gap-2 pl-2">
          <Avatar className="w-8 h-8 border border-slate-700 ring-2 ring-slate-900">
            <AvatarImage src="https://github.com/shadcn.png" />
            <AvatarFallback className="bg-slate-800 text-slate-300">JD</AvatarFallback>
          </Avatar>
        </div>
      </div>
    </header>
  );
};

export default EarthModelProHeader;