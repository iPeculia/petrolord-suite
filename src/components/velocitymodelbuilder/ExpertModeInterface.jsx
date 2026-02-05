import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Activity, GitCompare, Layers, Microscope, BarChart2 } from 'lucide-react';

import MisfitAnalysisDashboard from './MisfitAnalysisDashboard';
import ResidualVsDepthPlot from './ResidualVsDepthPlot';
import ResidualVsOffsetPlot from './ResidualVsOffsetPlot';
import LayerGroupingManager from './LayerGroupingManager';
import AdvancedRockPhysicsHooks from './AdvancedRockPhysicsHooks';
import VelocityTrendAnalyzer from './VelocityTrendAnalyzer';
import WellComparisonMatrix from './WellComparisonMatrix';
import ParameterSensitivityAnalysis from './ParameterSensitivityAnalysis';
import LayerTypeBuilder from './LayerTypeBuilder'; // Import existing component for reuse

const ExpertModeInterface = ({ layers }) => {
  return (
    <div className="flex flex-col h-full bg-slate-950">
      <div className="flex-shrink-0 border-b border-slate-800 bg-slate-900/50 p-1">
        <Tabs defaultValue="qc" className="w-full h-full flex flex-col">
          <div className="px-2 mb-2">
            <TabsList className="w-full justify-start h-9 bg-transparent p-0 gap-1">
              <TabsTrigger value="model" className="text-xs data-[state=active]:bg-slate-800 data-[state=active]:text-emerald-400 border border-transparent data-[state=active]:border-slate-700">
                <Layers className="w-3 h-3 mr-2" /> Model Editor
              </TabsTrigger>
              <TabsTrigger value="qc" className="text-xs data-[state=active]:bg-slate-800 data-[state=active]:text-emerald-400 border border-transparent data-[state=active]:border-slate-700">
                <Activity className="w-3 h-3 mr-2" /> QC & Misfits
              </TabsTrigger>
              <TabsTrigger value="wells" className="text-xs data-[state=active]:bg-slate-800 data-[state=active]:text-emerald-400 border border-transparent data-[state=active]:border-slate-700">
                <GitCompare className="w-3 h-3 mr-2" /> Cross-Well
              </TabsTrigger>
              <TabsTrigger value="physics" className="text-xs data-[state=active]:bg-slate-800 data-[state=active]:text-emerald-400 border border-transparent data-[state=active]:border-slate-700">
                <Microscope className="w-3 h-3 mr-2" /> Rock Physics
              </TabsTrigger>
              <TabsTrigger value="sensitivity" className="text-xs data-[state=active]:bg-slate-800 data-[state=active]:text-emerald-400 border border-transparent data-[state=active]:border-slate-700">
                <BarChart2 className="w-3 h-3 mr-2" /> Sensitivity
              </TabsTrigger>
            </TabsList>
          </div>

          <div className="flex-1 overflow-hidden bg-slate-950 relative">
             {/* MODEL EDITOR TAB */}
             <TabsContent value="model" className="h-full m-0 p-4 space-y-4 overflow-y-auto">
                <div className="grid grid-cols-3 gap-4">
                   <div className="col-span-2 space-y-4">
                      <h3 className="text-sm font-bold text-white mb-2">Layer Configuration</h3>
                      {layers.map((layer, index) => (
                        <div key={layer.id} className="p-4 rounded border border-slate-800 bg-slate-900/30">
                            <div className="flex justify-between mb-2">
                                <span className="font-bold text-sm text-emerald-400">{layer.name}</span>
                                <span className="text-xs text-slate-500">ID: {layer.id}</span>
                            </div>
                            <LayerTypeBuilder layer={layer} />
                        </div>
                      ))}
                   </div>
                   <div className="col-span-1">
                      <LayerGroupingManager />
                   </div>
                </div>
             </TabsContent>

             {/* QC TAB */}
             <TabsContent value="qc" className="h-full m-0 p-4 flex flex-col gap-4 overflow-y-auto">
                <div className="flex-shrink-0">
                   <MisfitAnalysisDashboard />
                </div>
                <div className="flex-1 grid grid-cols-2 gap-4 min-h-[400px]">
                   <ResidualVsDepthPlot />
                   <ResidualVsOffsetPlot />
                </div>
             </TabsContent>

             {/* CROSS-WELL TAB */}
             <TabsContent value="wells" className="h-full m-0 p-4 flex flex-col gap-4 overflow-y-auto">
                <div className="h-1/2 min-h-[300px]">
                   <VelocityTrendAnalyzer />
                </div>
                <div className="h-1/2 min-h-[300px]">
                   <h3 className="text-sm font-bold text-white mb-2">Well Parameter Comparison</h3>
                   <WellComparisonMatrix />
                </div>
             </TabsContent>

             {/* ROCK PHYSICS TAB */}
             <TabsContent value="physics" className="h-full m-0 p-4 flex items-start justify-center overflow-y-auto">
                <div className="w-full max-w-2xl">
                    <AdvancedRockPhysicsHooks />
                </div>
             </TabsContent>

             {/* SENSITIVITY TAB */}
             <TabsContent value="sensitivity" className="h-full m-0 p-4 flex flex-col items-center justify-center overflow-y-auto">
                <div className="w-full h-full max-w-4xl max-h-[600px]">
                   <ParameterSensitivityAnalysis />
                </div>
             </TabsContent>
          </div>
        </Tabs>
      </div>
    </div>
  );
};

export default ExpertModeInterface;