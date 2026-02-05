import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Settings } from 'lucide-react';
import MBSettingsPanel from './MBSettingsPanel';

const MBSettingsButton = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <Button 
        variant="ghost" 
        size="icon" 
        className="h-9 w-9 text-slate-400 hover:text-white hover:bg-slate-800"
        onClick={() => setIsOpen(true)}
      >
        <Settings className="w-5 h-5" />
      </Button>
      
      <MBSettingsPanel isOpen={isOpen} onClose={() => setIsOpen(false)} />
    </>
  );
};

export default MBSettingsButton;