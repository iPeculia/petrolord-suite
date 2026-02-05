import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { HelpCircle } from 'lucide-react';
import MBHelpPanel from './MBHelpPanel';

const MBHelpButton = () => {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e) => {
        if ((e.ctrlKey || e.metaKey) && e.key === 'h') {
            e.preventDefault();
            setIsOpen(true);
        }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <>
      <Button 
        variant="ghost" 
        size="icon" 
        className="h-9 w-9 text-slate-400 hover:text-white hover:bg-slate-800"
        onClick={() => setIsOpen(true)}
      >
        <HelpCircle className="w-5 h-5" />
      </Button>
      
      <MBHelpPanel isOpen={isOpen} onClose={() => setIsOpen(false)} />
    </>
  );
};

export default MBHelpButton;