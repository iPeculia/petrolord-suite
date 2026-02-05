import React from 'react';
import { usePrognosisData } from '@/hooks/usePrognosisData';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Activity, Thermometer, FileDown, AlertTriangle, Info, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';

import PPPrognosisChart from './PPPrognosisChart';
import TemperaturePrognosisChart from './TemperaturePrognosisChart';
import ExportPrognosisTab from './ExportPrognosisTab';
import RisksPrognosisTab from './RisksPrognosisTab';

const PrognosisTab = ({ phase1Data, phase4Data, onNavigate }) => {
    const { data, formations, casing, hardData } = usePrognosisData(phase1Data, phase4Data, null);

    // Specific, actionable empty state
    if (!data) return (
        <div className="flex flex-col h-full items-center justify-center text-slate-400 p-8 text-center">
            <div className="bg-slate-900 p-8 rounded-xl border border-slate-800 max-w-md shadow-2xl animate-in fade-in zoom-in-95 duration-300">
                <div className="mx-auto w-16 h-16 bg-slate-800 rounded-full flex items-center justify-center mb-4 shadow-inner">
                    <Info className="w-8 h-8 text-blue-500" />
                </div>
                <h3 className="text-xl font-bold text-slate-200 mb-2">Prognosis Data Not Ready</h3>
                <p className="text-sm text-slate-400 mb-6 leading-relaxed">
                    To generate the final prognosis chart, you need to complete the analysis workflow steps.
                </p>
                <div className="text-left text-sm space-y-3 mb-8 bg-slate-950 p-5 rounded-lg border border-slate-800/50">
                    <div className="flex items-center gap-3 text-slate-300">
                        <span className="w-6 h-6 rounded-full bg-emerald-900/50 text-emerald-400 border border-emerald-800 flex items-center justify-center text-xs font-bold">1</span>
                        Load Well Data
                    </div>
                    <div className="flex items-center gap-3 text-slate-300">
                        <span className="w-6 h-6 rounded-full bg-blue-900/50 text-blue-400 border border-blue-800 flex items-center justify-center text-xs font-bold">2</span>
                        Analyze Pressure Trends
                    </div>
                    <div className="flex items-center gap-3 text-slate-300">
                        <span className="w-6 h-6 rounded-full bg-purple-900/50 text-purple-400 border border-purple-800 flex items-center justify-center text-xs font-bold">3</span>
                        Calculate Gradients
                    </div>
                </div>
                <Button 
                    className="w-full bg-blue-600 hover:bg-blue-500 text-white h-12 font-semibold shadow-lg shadow-blue-900/20"
                    onClick={() => onNavigate && onNavigate('input')}
                >
                    <ArrowLeft className="w-4 h-4 mr-2" /> Start with 'Load Well Data'
                </Button>
            </div>
        </div>
    );

    return (
        <div className="flex flex-col h-full bg-slate-950 border-t border-slate-900">
            <Tabs defaultValue="pp" className="flex flex-col h-full">
                
                {/* Sub-navigation Bar */}
                <div className="px-4 py-2 bg-slate-900/50 border-b border-slate-800 backdrop-blur-sm sticky top-0 z-30">
                    <TabsList className="bg-slate-800 border border-slate-700/50 p-1 h-10">
                        <TabsTrigger value="pp" className="data-[state=active]:bg-blue-600 data-[state=active]:text-white text-slate-400">
                            <Activity className="w-4 h-4 mr-2" />
                            Pore Pressure
                        </TabsTrigger>
                        <TabsTrigger value="temp" className="data-[state=active]:bg-orange-600 data-[state=active]:text-white text-slate-400">
                            <Thermometer className="w-4 h-4 mr-2" />
                            Temperature
                        </TabsTrigger>
                        <TabsTrigger value="risks" className="data-[state=active]:bg-red-600 data-[state=active]:text-white text-slate-400">
                            <AlertTriangle className="w-4 h-4 mr-2" />
                            Risk Assessment
                        </TabsTrigger>
                        <TabsTrigger value="export" className="data-[state=active]:bg-emerald-600 data-[state=active]:text-white text-slate-400">
                            <FileDown className="w-4 h-4 mr-2" />
                            Export Reports
                        </TabsTrigger>
                    </TabsList>
                </div>

                {/* Content Area */}
                <div className="flex-1 overflow-hidden bg-slate-950 p-0 relative">
                    <TabsContent value="pp" className="h-full m-0 data-[state=active]:flex flex-col">
                        <div className="flex-1 bg-white rounded-b-lg shadow-inner m-4 mt-0 rounded-t-lg overflow-hidden">
                            <PPPrognosisChart 
                                data={data} 
                                formations={formations} 
                                casing={casing} 
                                hardData={hardData}
                            />
                        </div>
                    </TabsContent>

                    <TabsContent value="temp" className="h-full m-0 data-[state=active]:flex flex-col">
                        <div className="flex-1 bg-white rounded-b-lg shadow-inner m-4 mt-0 rounded-t-lg overflow-hidden">
                            <TemperaturePrognosisChart 
                                data={data} 
                                formations={formations} 
                                casing={casing} 
                                hardData={hardData}
                            />
                        </div>
                    </TabsContent>

                    <TabsContent value="risks" className="h-full m-0 overflow-hidden">
                        <RisksPrognosisTab 
                            data={data}
                            risks={[]} // Placeholder risks
                        />
                    </TabsContent>

                    <TabsContent value="export" className="h-full m-0 overflow-hidden">
                        <ExportPrognosisTab 
                            data={data}
                        />
                    </TabsContent>
                </div>
            </Tabs>
        </div>
    );
};

export default PrognosisTab;