import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Edit, SlidersHorizontal, Target, Sliders, Save, Eye } from 'lucide-react';
import { Button } from '@/components/ui/button';
import PropertyEditor from './PropertyEditor';
import StressEditor from './StressEditor';
import CalibrationPanel from './CalibrationPanel';
import ScenarioBuilder from './ScenarioBuilder';
import { useMEM } from '../../contexts/MEMContext';

const ExpertModeContainer = () => {
    const { state: memState } = useMEM();
    const [activeTab, setActiveTab] = useState('properties');

    return (
        <div className="flex h-full bg-slate-950 text-slate-200">
            {/* Left: Main Editor Area */}
            <div className="flex-1 flex flex-col border-r border-slate-800">
                <div className="border-b border-slate-800 bg-slate-900 px-4 pt-2">
                    <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                        <TabsList className="bg-transparent h-10 p-0 w-full justify-start gap-6">
                            <TabsTrigger 
                                value="properties"
                                className="data-[state=active]:bg-transparent data-[state=active]:border-b-2 data-[state=active]:border-blue-500 data-[state=active]:text-blue-400 rounded-none px-0 pb-2 text-sm font-medium flex gap-2"
                            >
                                <Edit className="w-4 h-4" /> Properties
                            </TabsTrigger>
                            <TabsTrigger 
                                value="stress"
                                className="data-[state=active]:bg-transparent data-[state=active]:border-b-2 data-[state=active]:border-blue-500 data-[state=active]:text-blue-400 rounded-none px-0 pb-2 text-sm font-medium flex gap-2"
                            >
                                <SlidersHorizontal className="w-4 h-4" /> Stress
                            </TabsTrigger>
                            <TabsTrigger 
                                value="calibration"
                                className="data-[state=active]:bg-transparent data-[state=active]:border-b-2 data-[state=active]:border-blue-500 data-[state=active]:text-blue-400 rounded-none px-0 pb-2 text-sm font-medium flex gap-2"
                            >
                                <Target className="w-4 h-4" /> Calibration
                            </TabsTrigger>
                            <TabsTrigger 
                                value="scenarios"
                                className="data-[state=active]:bg-transparent data-[state=active]:border-b-2 data-[state=active]:border-blue-500 data-[state=active]:text-blue-400 rounded-none px-0 pb-2 text-sm font-medium flex gap-2"
                            >
                                <Sliders className="w-4 h-4" /> Scenarios
                            </TabsTrigger>
                        </TabsList>

                        <div className="h-[calc(100vh-180px)] mt-0">
                             <TabsContent value="properties" className="h-full m-0">
                                <PropertyEditor stratigraphy={memState?.project?.stratigraphy || []} />
                             </TabsContent>
                             <TabsContent value="stress" className="h-full m-0">
                                <StressEditor />
                             </TabsContent>
                             <TabsContent value="calibration" className="h-full m-0">
                                <CalibrationPanel />
                             </TabsContent>
                             <TabsContent value="scenarios" className="h-full m-0">
                                <ScenarioBuilder />
                             </TabsContent>
                        </div>
                    </Tabs>
                </div>
            </div>

            {/* Right: Summary / Preview Panel (Mini Dashboard) */}
            <div className="w-80 bg-slate-900 border-l border-slate-800 hidden xl:flex flex-col p-4 gap-4">
                <div className="flex items-center justify-between mb-2">
                    <h3 className="text-sm font-bold text-slate-300 flex items-center gap-2"><Eye className="w-4 h-4"/> Live Preview</h3>
                    <Button variant="ghost" size="sm" className="h-6 w-6 p-0 text-slate-500 hover:text-white"><Save className="w-3 h-3"/></Button>
                </div>
                
                {/* Mini Stress Profile */}
                <div className="flex-1 bg-slate-950 rounded border border-slate-800 relative overflow-hidden">
                    <div className="absolute inset-0 opacity-20 bg-[url('https://images.unsplash.com/photo-1581092160562-40aa08e78837?q=80&w=2070&auto=format&fit=crop')] bg-cover bg-center"></div>
                    <div className="absolute inset-0 flex items-center justify-center text-xs text-slate-500">
                        Stress Profile Viz
                    </div>
                </div>

                {/* Mini Stats */}
                <div className="grid grid-cols-2 gap-2 text-xs">
                    <div className="bg-slate-950 p-2 rounded border border-slate-800">
                        <div className="text-slate-500">Shmin Grad</div>
                        <div className="font-mono text-blue-400">0.72 psi/ft</div>
                    </div>
                    <div className="bg-slate-950 p-2 rounded border border-slate-800">
                        <div className="text-slate-500">Pp Grad</div>
                        <div className="font-mono text-red-400">0.45 psi/ft</div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ExpertModeContainer;