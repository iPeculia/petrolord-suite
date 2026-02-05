import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Layers, Target, Copy, Activity } from 'lucide-react';
import PropertyEditor from './PropertyEditor';
import CalibrationPanel from './CalibrationPanel';
import SensitivityAnalysis from './SensitivityAnalysis';
import ScenarioComparison from './ScenarioComparison';

const AdvancedControlsPanel = ({ stratigraphy, onUpdateLayer }) => {
    return (
        <div className="h-full flex flex-col bg-slate-950 border-l border-slate-800">
            <Tabs defaultValue="properties" className="flex-1 flex flex-col">
                <div className="bg-slate-950 border-b border-slate-800 shrink-0">
                    <TabsList className="w-full justify-start h-12 bg-transparent p-0 px-2 gap-1 overflow-x-auto no-scrollbar">
                        <TabsTrigger 
                            value="properties" 
                            className="data-[state=active]:bg-slate-900 data-[state=active]:border-b-2 data-[state=active]:border-indigo-500 h-full rounded-none px-3 text-xs gap-2 flex-1 min-w-[80px]"
                        >
                            <Layers className="w-3.5 h-3.5" /> Props
                        </TabsTrigger>
                        <TabsTrigger 
                            value="calibration" 
                            className="data-[state=active]:bg-slate-900 data-[state=active]:border-b-2 data-[state=active]:border-indigo-500 h-full rounded-none px-3 text-xs gap-2 flex-1 min-w-[80px]"
                        >
                            <Target className="w-3.5 h-3.5" /> Calib
                        </TabsTrigger>
                        <TabsTrigger 
                            value="scenarios" 
                            className="data-[state=active]:bg-slate-900 data-[state=active]:border-b-2 data-[state=active]:border-indigo-500 h-full rounded-none px-3 text-xs gap-2 flex-1 min-w-[80px]"
                        >
                            <Copy className="w-3.5 h-3.5" /> Scenarios
                        </TabsTrigger>
                        <TabsTrigger 
                            value="sensitivity" 
                            className="data-[state=active]:bg-slate-900 data-[state=active]:border-b-2 data-[state=active]:border-indigo-500 h-full rounded-none px-3 text-xs gap-2 flex-1 min-w-[80px]"
                        >
                            <Activity className="w-3.5 h-3.5" /> Sens
                        </TabsTrigger>
                    </TabsList>
                </div>

                <div className="flex-1 overflow-hidden relative">
                    <TabsContent value="properties" className="h-full m-0 absolute inset-0">
                        <PropertyEditor stratigraphy={stratigraphy} onUpdateLayer={onUpdateLayer} />
                    </TabsContent>
                    <TabsContent value="calibration" className="h-full m-0 absolute inset-0">
                        <CalibrationPanel />
                    </TabsContent>
                    <TabsContent value="scenarios" className="h-full m-0 absolute inset-0">
                        <ScenarioComparison />
                    </TabsContent>
                    <TabsContent value="sensitivity" className="h-full m-0 absolute inset-0">
                        <SensitivityAnalysis />
                    </TabsContent>
                </div>
            </Tabs>
        </div>
    );
};

export default AdvancedControlsPanel;