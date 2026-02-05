import React from 'react';
import BackToGeoscienceAnalyticsHub from './BackToGeoscienceAnalyticsHub';
import ProjectActions from './ProjectActions';
import { useProjectManager, usePanelVisibility } from '@/hooks/useWellCorrelation';
import { useTrackConfigurationContext } from '@/contexts/TrackConfigurationContext';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { PanelLeftOpen, PanelLeftClose, PanelRightOpen, PanelRightClose, Activity, PanelRight, PanelLeft } from 'lucide-react';
import { cn } from '@/lib/utils';

const WellCorrelationHeader = () => {
  const { currentProject } = useProjectManager();
  const { 
    leftPanelVisible, 
    rightPanelVisible, 
    toggleLeftPanel, 
    toggleRightPanel 
  } = usePanelVisibility();
  
  const { showAssistant, setShowAssistant, showQC, setShowQC } = useTrackConfigurationContext();

  return (
    <div className="h-14 bg-slate-950 border-b border-slate-800 flex items-center justify-between px-4 shrink-0 select-none shadow-sm z-50 relative">
      <div className="flex items-center gap-4">
        <BackToGeoscienceAnalyticsHub />
        
        <TooltipProvider delayDuration={300}>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={toggleLeftPanel}
                className={cn(
                  "h-8 w-8 transition-all duration-200",
                  leftPanelVisible 
                    ? "text-slate-400 hover:text-white hover:bg-slate-800" 
                    : "text-slate-500 bg-slate-900/50 hover:bg-slate-800 hover:text-slate-300"
                )}
              >
                {leftPanelVisible ? <PanelLeftClose className="h-4 w-4" /> : <PanelLeftOpen className="h-4 w-4" />}
              </Button>
            </TooltipTrigger>
            <TooltipContent side="bottom" className="bg-slate-900 border-slate-700 text-slate-300 text-xs">
              <p>{leftPanelVisible ? 'Hide Well List (Ctrl+[)' : 'Show Well List (Ctrl+[)'}</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>

        <Separator orientation="vertical" className="h-6 bg-slate-800" />
        
        <div className="flex flex-col">
          <h1 className="text-sm font-bold text-white flex items-center gap-2">
            <Activity className="w-4 h-4 text-blue-500" />
            Well Correlation Pro
            {currentProject && (
              <Badge variant="outline" className="ml-2 border-blue-800 bg-blue-950/50 text-blue-400 font-normal text-[10px] px-1.5 py-0 h-4">
                {currentProject.name}
              </Badge>
            )}
          </h1>
          <div className="text-[10px] text-slate-500 flex items-center gap-1.5">
            <span>Geoscience Analytics Hub</span>
            <span className="text-slate-700">/</span>
            <span>Pro Suite</span>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-2">
        {/* New Buttons for AI and QC */}
        <div className="flex items-center gap-1 mr-2">
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => setShowAssistant(!showAssistant)}
            className={cn(
              "h-8 px-3 text-xs border transition-colors",
              showAssistant 
                ? "bg-blue-900/30 text-blue-400 border-blue-800" 
                : "text-slate-400 border-transparent hover:text-white hover:bg-slate-800"
            )}
          >
            <PanelRight className="w-3.5 h-3.5 mr-2" />
            Correlation AI
          </Button>
          
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => setShowQC(!showQC)}
            className={cn(
              "h-8 px-3 text-xs border transition-colors",
              showQC
                ? "bg-purple-900/30 text-purple-400 border-purple-800" 
                : "text-slate-400 border-transparent hover:text-white hover:bg-slate-800"
            )}
          >
            <PanelLeft className="w-3.5 h-3.5 mr-2" />
            QC Panel
          </Button>
        </div>

        <Separator orientation="vertical" className="h-6 bg-slate-800 mx-2" />

        <ProjectActions />
        
        <Separator orientation="vertical" className="h-6 bg-slate-800 mx-2" />

        <div className="flex items-center bg-slate-900/50 rounded-md p-0.5 border border-slate-800/50">
          <TooltipProvider delayDuration={300}>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  onClick={toggleRightPanel}
                  className={cn(
                    "h-7 w-7 transition-all duration-200",
                    rightPanelVisible 
                      ? "text-slate-400 hover:text-white hover:bg-slate-800" 
                      : "text-slate-500 hover:text-slate-300"
                  )}
                >
                  {rightPanelVisible ? <PanelRightClose className="h-4 w-4" /> : <PanelRightOpen className="h-4 w-4" />}
                </Button>
              </TooltipTrigger>
              <TooltipContent side="bottom" align="end" className="bg-slate-900 border-slate-700 text-slate-300 text-xs">
                <p>{rightPanelVisible ? 'Hide Settings (Ctrl+])' : 'Show Settings (Ctrl+])'}</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </div>
    </div>
  );
};

export default WellCorrelationHeader;