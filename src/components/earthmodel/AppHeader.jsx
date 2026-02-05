import React from 'react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { 
  Settings, 
  HelpCircle, 
  ChevronRight, 
  Menu,
  Box,
  GraduationCap
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useHelp } from '@/context/HelpContext';
import { useTraining } from '@/context/TrainingContext';
import { useSettings } from '@/context/SettingsContext';
import NotificationCenter from '@/components/earthmodel/notifications/NotificationCenter';

const AppHeader = ({ activeModule, moduleName, activeProject, toggleSidebar }) => {
  const { toggleHelp } = useHelp();
  const { toggleTraining } = useTraining();
  const { toggleSettings } = useSettings();

  return (
    <header className="h-14 bg-slate-900 border-b border-slate-800 flex items-center justify-between px-4 shrink-0 z-20">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" className="lg:hidden" onClick={toggleSidebar}>
          <Menu className="w-5 h-5 text-slate-400" />
        </Button>
        
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center shadow-lg shadow-blue-900/20">
            <Box className="w-5 h-5 text-white" />
          </div>
          <div className="hidden md:block">
            <h1 className="font-bold text-slate-100 leading-none">EarthModel Pro</h1>
            <span className="text-[10px] text-blue-400 font-mono">v4.0.0</span>
          </div>
        </div>

        <div className="h-6 w-px bg-slate-800 mx-2 hidden md:block" />

        <nav className="hidden md:flex items-center text-sm text-slate-400">
          <span className="hover:text-slate-200 cursor-pointer transition-colors">
            {activeProject ? activeProject.name : 'No Project'}
          </span>
          <ChevronRight className="w-4 h-4 mx-2 text-slate-600" />
          <span className={cn(
            "px-2 py-0.5 rounded-md text-xs font-medium bg-slate-800 border border-slate-700 text-slate-200"
          )}>
            {moduleName || activeModule}
          </span>
        </nav>
      </div>

      <div className="flex items-center gap-2">
        <div className="flex items-center gap-1 mr-2 border-r border-slate-800 pr-2">
          <Button variant="ghost" size="icon" className="text-slate-400 hover:text-white w-8 h-8" onClick={toggleTraining} title="Training">
            <GraduationCap className="w-4 h-4" />
          </Button>
          <Button variant="ghost" size="icon" className="text-slate-400 hover:text-white w-8 h-8" onClick={toggleHelp} title="Help">
            <HelpCircle className="w-4 h-4" />
          </Button>
          <Button variant="ghost" size="icon" className="text-slate-400 hover:text-white w-8 h-8" onClick={toggleSettings} title="Settings">
            <Settings className="w-4 h-4" />
          </Button>
          <NotificationCenter />
        </div>
        
        <div className="flex items-center gap-2 pl-2">
          <div className="text-right hidden sm:block">
            <div className="text-xs font-medium text-slate-200">Jane Doe</div>
            <div className="text-[10px] text-slate-500">Senior Geoscientist</div>
          </div>
          <Avatar className="w-8 h-8 border border-slate-700">
            <AvatarImage src="https://github.com/shadcn.png" />
            <AvatarFallback>JD</AvatarFallback>
          </Avatar>
        </div>
      </div>
    </header>
  );
};

export default AppHeader;