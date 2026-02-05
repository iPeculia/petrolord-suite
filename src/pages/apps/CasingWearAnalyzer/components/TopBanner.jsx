import React, { useState } from 'react';
import { useCasingWearAnalyzer } from '../contexts/CasingWearAnalyzerContext';
import { Button } from '@/components/ui/button';
import { Save, Undo, Redo, Share2 } from 'lucide-react';
import ExportModal from './ExportModal';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

const TopBanner = () => {
  const { activeProject, activeWearCase, updateCurrentVersion, undo, redo, canUndo, canRedo } = useCasingWearAnalyzer();
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);

  return (
    <>
      <div className="bg-slate-900 border-b border-slate-800 p-2 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-4">
          <div className="flex flex-col">
            <div className="text-xs text-slate-500 uppercase font-bold tracking-wider">Project</div>
            <div className="text-sm font-bold text-slate-200">
              {activeProject ? activeProject.name : 'Casing Wear Analyzer'}
            </div>
          </div>
          
          <div className="h-8 w-px bg-slate-800 mx-2"></div>

          {activeWearCase && (
            <div className="flex flex-col">
               <div className="text-xs text-slate-500 uppercase font-bold tracking-wider">Active Version</div>
               <div className="text-xs text-amber-400 font-mono bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20">
                 {activeWearCase.name}
               </div>
            </div>
          )}
        </div>

        <div className="flex items-center gap-2">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="icon" disabled={!canUndo} onClick={undo} className="h-8 w-8 text-slate-400 hover:text-white disabled:opacity-30">
                  <Undo className="w-4 h-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent><p>Undo (Ctrl+Z)</p></TooltipContent>
            </Tooltip>
          </TooltipProvider>

          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="icon" disabled={!canRedo} onClick={redo} className="h-8 w-8 text-slate-400 hover:text-white disabled:opacity-30">
                  <Redo className="w-4 h-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent><p>Redo (Ctrl+Y)</p></TooltipContent>
            </Tooltip>
          </TooltipProvider>

          <div className="h-6 w-px bg-slate-800 mx-1"></div>

          <Button size="sm" variant="default" className="text-xs h-8 bg-blue-600 hover:bg-blue-500" onClick={updateCurrentVersion}>
            <Save className="w-3 h-3 mr-2" />
            Save Version
          </Button>

          <Button size="sm" variant="outline" className="text-xs border-slate-700 hover:bg-slate-800 h-8" onClick={() => setIsExportModalOpen(true)}>
            <Share2 className="w-3 h-3 mr-2" />
            Export
          </Button>
        </div>
      </div>
      <ExportModal open={isExportModalOpen} onOpenChange={setIsExportModalOpen} />
    </>
  );
};

export default TopBanner;