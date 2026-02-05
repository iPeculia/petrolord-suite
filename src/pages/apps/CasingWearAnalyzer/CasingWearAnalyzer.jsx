import React, { useState } from 'react';
import { CasingWearAnalyzerProvider } from './contexts/CasingWearAnalyzerContext';
import LeftPanel from './components/LeftPanel';
import CenterPanel from './components/CenterPanel';
import RightPanel from './components/RightPanel';
import TopBanner from './components/TopBanner';
import UXControls from './components/UXControls';
import HelpPanel from './components/HelpPanel';
import KeyboardShortcutsHelp from './components/KeyboardShortcutsHelp';
import Breadcrumb from './components/Breadcrumb';
import AppHeader from './components/AppHeader';
import QuickStats from './components/QuickStats';
import { useToast } from '@/components/ui/use-toast';

const CasingWearAnalyzerContent = () => {
  const [helpOpen, setHelpOpen] = useState(false);
  const [shortcutsOpen, setShortcutsOpen] = useState(false);
  
  return (
    <div className="flex flex-col h-screen bg-slate-950 text-slate-100 overflow-hidden font-sans">
      {/* Navigation & Header Section */}
      <div className="flex-none flex flex-col w-full z-10 relative">
        <Breadcrumb />
        <AppHeader />
        <QuickStats />
        <TopBanner />
      </div>

      {/* Main Workspace */}
      <div className="flex flex-1 overflow-hidden relative z-0">
        <LeftPanel />
        <CenterPanel />
        <RightPanel />
      </div>
      
      {/* Overlays */}
      <UXControls 
        onToggleHelp={() => setHelpOpen(!helpOpen)} 
        onToggleShortcuts={() => setShortcutsOpen(!shortcutsOpen)}
      />
      
      <HelpPanel isOpen={helpOpen} onClose={() => setHelpOpen(false)} />
      <KeyboardShortcutsHelp open={shortcutsOpen} onOpenChange={setShortcutsOpen} />
    </div>
  );
};

const CasingWearAnalyzer = () => {
  return (
    <CasingWearAnalyzerProvider>
      <CasingWearAnalyzerContent />
    </CasingWearAnalyzerProvider>
  );
};

export default CasingWearAnalyzer;