import React, { useState } from 'react';
import { ResizablePanelGroup, ResizablePanel, ResizableHandle } from '@/components/ui/resizable';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { 
  ChevronLeft, Save, Download, Settings, Layers, 
  ZoomIn, ZoomOut, Maximize2, Undo2, Redo2, 
  Scissors, Activity, ArrowLeftRight, Check
} from 'lucide-react';

// Placeholder components for layout visualization
const WellLogPanel = () => <div className="h-full bg-slate-950 flex items-center justify-center border-r border-slate-800"><span className="text-slate-500">Well Logs (GR, DT, RHOB)</span></div>;
const SeismicDisplayPanel = () => <div className="h-full bg-slate-950 flex items-center justify-center relative overflow-hidden">
  <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1518133910546-b6c2fb7d79e3?q=80&w=2835&auto=format&fit=crop')] opacity-20 bg-cover bg-center mix-blend-screen"></div>
  <div className="z-10 flex flex-col items-center gap-2">
    <Activity className="w-12 h-12 text-blue-500/50" />
    <span className="text-slate-400">Seismic & Synthetic Overlay</span>
  </div>
</div>;
const CrossCorrelationAnalyzer = () => <div className="h-full bg-slate-900 p-4">
  <div className="text-xs text-slate-400 mb-2 font-mono">CROSS CORRELATION</div>
  <div className="h-24 bg-slate-950 rounded border border-slate-800 relative overflow-hidden">
    <div className="absolute top-1/2 left-0 right-0 h-px bg-slate-800"></div>
    <svg className="w-full h-full" viewBox="0 0 100 40" preserveAspectRatio="none">
      <path d="M0,20 Q25,5 50,20 T100,20" fill="none" stroke="#3b82f6" strokeWidth="2" />
      <path d="M0,20 Q25,10 52,20 T100,20" fill="none" stroke="#10b981" strokeWidth="2" strokeDasharray="4 2" />
    </svg>
  </div>
  <div className="flex justify-between text-xs text-slate-500 mt-1 font-mono">
    <span>-100ms</span>
    <span className="text-emerald-400 font-bold">Max: 0.84 @ +2ms</span>
    <span>+100ms</span>
  </div>
</div>;
const WaveletManager = () => <div className="h-full bg-slate-900 p-4 border-l border-slate-800">
  <div className="text-xs text-slate-400 mb-2 font-mono">WAVELET</div>
  <div className="h-32 bg-slate-950 rounded border border-slate-800 flex items-center justify-center">
    <Activity className="text-purple-500" />
  </div>
  <div className="mt-2 space-y-2">
    <div className="flex justify-between text-xs text-slate-400">
      <span>Phase</span>
      <span>0°</span>
    </div>
    <div className="flex justify-between text-xs text-slate-400">
      <span>Freq</span>
      <span>35Hz</span>
    </div>
  </div>
</div>;

const AdvancedTieLabWorkspace = ({ wellId, onClose }) => {
  return (
    <div className="flex flex-col h-full bg-slate-950">
      {/* Toolbar */}
      <div className="h-12 border-b border-slate-800 bg-slate-900 px-4 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="sm" onClick={onClose} className="text-slate-400 hover:text-white">
            <ChevronLeft className="w-4 h-4 mr-1" /> Back
          </Button>
          <div className="h-6 w-px bg-slate-800"></div>
          <div className="flex items-center gap-2">
            <span className="font-medium text-white">15/9-F-12</span>
            <span className="text-xs px-2 py-0.5 bg-emerald-500/10 text-emerald-400 rounded border border-emerald-500/20">Tied</span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="icon" className="text-slate-400 hover:text-white h-8 w-8">
                  <Undo2 className="w-4 h-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Undo</TooltipContent>
            </Tooltip>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="icon" className="text-slate-400 hover:text-white h-8 w-8">
                  <Redo2 className="w-4 h-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Redo</TooltipContent>
            </Tooltip>
          </TooltipProvider>
          <div className="h-6 w-px bg-slate-800 mx-2"></div>
          <Button variant="outline" size="sm" className="border-slate-700 text-slate-300 h-8">
            <Settings className="w-3 h-3 mr-2" /> Parameters
          </Button>
          <Button size="sm" className="bg-blue-600 hover:bg-blue-500 h-8">
            <Save className="w-3 h-3 mr-2" /> Save Tie
          </Button>
        </div>
      </div>

      {/* Main Workspace */}
      <div className="flex-1 overflow-hidden">
        <ResizablePanelGroup direction="horizontal">
          
          {/* Left Panel: Logs & TD Curve */}
          <ResizablePanel defaultSize={25} minSize={15} maxSize={40}>
            <div className="h-full flex flex-col">
              <div className="h-8 bg-slate-900 border-b border-slate-800 px-2 flex items-center text-xs font-medium text-slate-400">
                Well Data
              </div>
              <div className="flex-1 overflow-hidden relative">
                <WellLogPanel />
                {/* Interactive TD curve overlay handles would go here */}
              </div>
            </div>
          </ResizablePanel>
          
          <ResizableHandle withHandle className="bg-slate-800 hover:bg-blue-500 transition-colors" />

          {/* Center Panel: Seismic & Synthetic */}
          <ResizablePanel defaultSize={50}>
            <div className="h-full flex flex-col">
               {/* Visualization Toolbar */}
               <div className="h-10 bg-slate-900 border-b border-slate-800 px-2 flex items-center justify-between">
                  <div className="flex items-center gap-1">
                    <Button variant="ghost" size="icon" className="h-7 w-7 text-slate-400"><ZoomIn className="w-3 h-3"/></Button>
                    <Button variant="ghost" size="icon" className="h-7 w-7 text-slate-400"><ZoomOut className="w-3 h-3"/></Button>
                    <Button variant="ghost" size="icon" className="h-7 w-7 text-slate-400"><Maximize2 className="w-3 h-3"/></Button>
                  </div>
                  <div className="flex items-center gap-2">
                     <span className="text-xs text-slate-500">Display:</span>
                     <Tabs defaultValue="comp" className="h-7">
                        <TabsList className="h-7 bg-slate-950">
                          <TabsTrigger value="comp" className="text-[10px] px-2 h-5">Composite</TabsTrigger>
                          <TabsTrigger value="synth" className="text-[10px] px-2 h-5">Synthetic Only</TabsTrigger>
                          <TabsTrigger value="seis" className="text-[10px] px-2 h-5">Seismic Only</TabsTrigger>
                        </TabsList>
                     </Tabs>
                  </div>
               </div>
               
               <div className="flex-1 overflow-hidden">
                 <SeismicDisplayPanel />
               </div>

               {/* Bottom Analysis Panel */}
               <div className="h-48 border-t border-slate-800 bg-slate-900 shrink-0">
                 <CrossCorrelationAnalyzer />
               </div>
            </div>
          </ResizablePanel>

          <ResizableHandle withHandle className="bg-slate-800 hover:bg-blue-500 transition-colors" />

          {/* Right Panel: Wavelets & Tools */}
          <ResizablePanel defaultSize={25} minSize={20} maxSize={30}>
            <div className="h-full flex flex-col bg-slate-900">
              <Tabs defaultValue="wavelet" className="h-full flex flex-col">
                <div className="border-b border-slate-800 px-2">
                  <TabsList className="w-full justify-start h-10 bg-transparent p-0">
                    <TabsTrigger value="wavelet" className="data-[state=active]:border-b-2 data-[state=active]:border-blue-500 rounded-none px-4 h-10 bg-transparent">Wavelet</TabsTrigger>
                    <TabsTrigger value="horizons" className="data-[state=active]:border-b-2 data-[state=active]:border-blue-500 rounded-none px-4 h-10 bg-transparent">Horizons</TabsTrigger>
                    <TabsTrigger value="stretch" className="data-[state=active]:border-b-2 data-[state=active]:border-blue-500 rounded-none px-4 h-10 bg-transparent">Stretch</TabsTrigger>
                  </TabsList>
                </div>
                
                <div className="flex-1 overflow-y-auto">
                  <TabsContent value="wavelet" className="m-0 h-full">
                    <WaveletManager />
                  </TabsContent>
                  <TabsContent value="horizons" className="m-0 p-4 text-slate-400 text-sm">
                    <div className="space-y-2">
                      <div className="flex items-center justify-between p-2 bg-slate-950 rounded border border-slate-800">
                        <span>Top Reservoir</span>
                        <span className="text-mono text-xs text-blue-400">2450ms</span>
                      </div>
                      <div className="flex items-center justify-between p-2 bg-slate-950 rounded border border-slate-800">
                        <span>Base Reservoir</span>
                        <span className="text-mono text-xs text-blue-400">2580ms</span>
                      </div>
                    </div>
                  </TabsContent>
                  <TabsContent value="stretch" className="m-0 p-4 text-slate-400 text-sm">
                    <div className="flex flex-col gap-4 items-center justify-center h-48 border border-dashed border-slate-800 rounded bg-slate-950/50">
                      <ArrowLeftRight className="w-8 h-8 text-slate-600" />
                      <span className="text-xs text-center">Select interval on track<br/>to apply stretch/squeeze</span>
                    </div>
                  </TabsContent>
                </div>
              </Tabs>
            </div>
          </ResizablePanel>

        </ResizablePanelGroup>
      </div>
    </div>
  );
};

export default AdvancedTieLabWorkspace;