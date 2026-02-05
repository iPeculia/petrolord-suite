import React from 'react';
import { Menu } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useMaterialBalance } from '@/hooks/useMaterialBalance';
import MBProjectsButton from './MBProjectsButton';
import MBSaveButton from './MBSaveButton';
import MBFavoritesButton from './MBFavoritesButton';
import MBSettingsButton from './MBSettingsButton';
import MBHelpButton from './MBHelpButton';

const MBHeader = () => {
  const { currentProject } = useMaterialBalance();

  return (
    <div className="h-14 bg-slate-950 border-b border-slate-800 flex items-center px-4 justify-between shrink-0 shadow-sm z-10">
      
      {/* LEFT: Branding & Main Actions */}
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" className="text-slate-400 hover:text-white hover:bg-slate-800 -ml-2">
          <Menu className="w-5 h-5" />
        </Button>
        
        <div className="mr-4">
          <h1 className="text-sm font-bold text-slate-100 flex items-center gap-2">
            <span className="text-blue-500">Material Balance</span> Pro
          </h1>
        </div>

        <div className="h-6 w-px bg-slate-800 mx-1" />

        {/* Project Controls */}
        <div className="flex items-center gap-2">
            <MBProjectsButton />
            <MBSaveButton />
        </div>
      </div>

      {/* RIGHT: Utilities */}
      <div className="flex items-center gap-1">
        <MBFavoritesButton />
        <MBSettingsButton />
        <MBHelpButton />
      </div>

    </div>
  );
};

export default MBHeader;