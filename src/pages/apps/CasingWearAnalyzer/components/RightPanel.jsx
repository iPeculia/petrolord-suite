import React from 'react';
import { useCasingWearAnalyzer } from '../contexts/CasingWearAnalyzerContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ShieldCheck, ShieldAlert, AlertTriangle, ChevronLeft, ChevronRight, Activity } from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

const RightPanel = () => {
  const { 
    activeWearCase, 
    wearProfile,
    isRightPanelOpen,
    toggleRightPanel
  } = useCasingWearAnalyzer();

  if (!isRightPanelOpen) {
    return (
      <div className="w-12 bg-slate-950 border-l border-slate-800 flex flex-col items-center py-4 shrink-0 transition-all duration-300">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="ghost" size="icon" onClick={toggleRightPanel} className="h-8 w-8 text-slate-400 hover:text-white mb-4">
                <ChevronLeft className="w-4 h-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent side="left"><p>Expand Results Panel</p></TooltipContent>
          </Tooltip>
        </TooltipProvider>
        <div className="h-px w-6 bg-slate-800 mb-4"></div>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <div className="flex flex-col items-center gap-4 text-slate-500">
                <Activity className="w-5 h-5" />
                <ShieldCheck className="w-5 h-5" />
              </div>
            </TooltipTrigger>
            <TooltipContent side="left"><p>Quick Results</p></TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
    );
  }

  // If no case or calculation
  if (!activeWearCase || !wearProfile || !wearProfile.summary) {
    return (
      <div className="w-[300px] bg-slate-950 border-l border-slate-800 flex flex-col h-full shrink-0 transition-all duration-300">
        <div className="p-3 border-b border-slate-800 flex items-center justify-between">
          <Button variant="ghost" size="icon" onClick={toggleRightPanel} className="h-6 w-6 text-slate-500 hover:text-white">
            <ChevronRight className="w-4 h-4" />
          </Button>
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Analysis Results</span>
        </div>
        <div className="flex-1 flex items-center justify-center p-6 text-center">
          <div className="text-slate-500 text-sm">Run a calculation to view key performance indicators.</div>
        </div>
      </div>
    );
  }

  const { summary, originalWallThickness_mm } = wearProfile;
  const { maxWearDepth, minRemainingWT, minBurstSF, minCollapseSF } = summary;

  // Simple Status Logic
  let status = 'Safe';
  let StatusIcon = ShieldCheck;
  let statusColor = 'text-emerald-500';
  let badgeBg = 'bg-emerald-500/10 border-emerald-500/20';

  if (minBurstSF?.sf < 1.0 || minCollapseSF?.sf < 1.0) {
    status = 'Critical';
    StatusIcon = AlertTriangle;
    statusColor = 'text-red-500';
    badgeBg = 'bg-red-500/10 border-red-500/20';
  } else if (minBurstSF?.sf < 1.5 || minCollapseSF?.sf < 1.5) {
    status = 'Caution';
    StatusIcon = ShieldAlert;
    statusColor = 'text-amber-500';
    badgeBg = 'bg-amber-500/10 border-amber-500/20';
  }

  const maxWearVal = maxWearDepth?.wear || 0;
  const maxWearPercent = originalWallThickness_mm ? (maxWearVal / originalWallThickness_mm) * 100 : 0;

  return (
    <div className="w-[300px] bg-slate-950 border-l border-slate-800 flex flex-col h-full shrink-0 transition-all duration-300">
      <div className="p-3 border-b border-slate-800 flex items-center justify-between">
        <Button variant="ghost" size="icon" onClick={toggleRightPanel} className="h-6 w-6 text-slate-500 hover:text-white">
          <ChevronRight className="w-4 h-4" />
        </Button>
        <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Analysis Results</span>
      </div>

      <div className="p-4 space-y-6 overflow-y-auto">
        
        <div className={`rounded-xl p-4 border flex flex-col items-center justify-center text-center ${badgeBg}`}>
          <StatusIcon className={`w-10 h-10 mb-2 ${statusColor}`} />
          <div className="text-xs uppercase tracking-widest text-slate-400 font-semibold">Integrity Status</div>
          <div className={`text-2xl font-bold ${statusColor}`}>{status}</div>
        </div>

        <div className="space-y-4">
          <h3 className="text-xs font-bold text-slate-500 uppercase">Key Performance Indicators</h3>
          
          <Card className="bg-slate-900 border-slate-800">
            <CardHeader className="pb-2">
              <CardTitle className="text-xs text-slate-400">Max Wear Depth</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-lg font-mono font-bold text-white">{(maxWearDepth?.wear || 0).toFixed(3)} mm</div>
              <Progress value={maxWearPercent} className="h-1.5 mt-2 bg-slate-800" indicatorClassName={maxWearPercent > 20 ? 'bg-amber-500' : 'bg-emerald-500'} />
              <div className="flex justify-between mt-1 text-[10px] text-slate-500">
                <span>@ {(maxWearDepth?.depth || 0)}m</span>
                <span>{maxWearPercent.toFixed(1)}% of Wall</span>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-slate-900 border-slate-800">
            <CardContent className="p-4">
              <div className="text-xs text-slate-400 mb-1">Min. Wall Thickness</div>
              <div className="text-lg font-mono font-bold text-white">{(minRemainingWT?.wt || 0).toFixed(3)} mm</div>
               <div className="text-[10px] text-slate-500">@ {(minRemainingWT?.depth || 0)}m</div>
            </CardContent>
          </Card>

          <Card className="bg-slate-900 border-slate-800">
             <CardContent className="p-4 grid grid-cols-2 gap-4">
                <div>
                  <div className="text-xs text-slate-400 mb-1">Min Burst SF</div>
                  <div className={`text-lg font-bold ${minBurstSF?.sf < 1.5 ? 'text-amber-500' : 'text-emerald-500'}`}>{(minBurstSF?.sf || 0).toFixed(2)}</div>
                </div>
                 <div>
                  <div className="text-xs text-slate-400 mb-1">Min Collapse SF</div>
                  <div className={`text-lg font-bold ${minCollapseSF?.sf < 1.5 ? 'text-amber-500' : 'text-emerald-500'}`}>{(minCollapseSF?.sf || 0).toFixed(2)}</div>
                </div>
             </CardContent>
          </Card>

        </div>
      </div>
    </div>
  );
};

export default RightPanel;