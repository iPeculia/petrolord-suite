import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card } from '@/components/ui/card';
import { PlotlyStressProfileChart, Plotly3DStressTensorChart } from './charts/StressCharts';
import { PlotlyMudWeightWindowChart, PlotlyPpVsFgChart } from './charts/PressureCharts';
import SensitivityAnalysis from './SensitivityAnalysis';
import MachineLearningPanel from './MachineLearningPanel';
import ScenarioManager from './ScenarioManager';
import { BarChart2, Zap, GitCompare, BrainCircuit, PieChart } from 'lucide-react';

const AdvancedAnalyticsDashboard = () => {
    const [activeTab, setActiveTab] = useState('charts');

    return (
        <div className="h-full flex flex-col bg-slate-950">
            <div className="flex-shrink-0 border-b border-slate-800 p-2 bg-slate-900">
                <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                    <TabsList className="bg-slate-950 border border-slate-800">
                        <TabsTrigger value="charts" className="text-xs data-[state=active]:text-blue-400"><BarChart2 className="w-3 h-3 mr-2"/> Interactive Charts</TabsTrigger>
                        <TabsTrigger value="sensitivity" className="text-xs data-[state=active]:text-orange-400"><Zap className="w-3 h-3 mr-2"/> Sensitivity</TabsTrigger>
                        <TabsTrigger value="scenarios" className="text-xs data-[state=active]:text-cyan-400"><GitCompare className="w-3 h-3 mr-2"/> Scenarios</TabsTrigger>
                        <TabsTrigger value="ml" className="text-xs data-[state=active]:text-pink-400"><BrainCircuit className="w-3 h-3 mr-2"/> ML & Prediction</TabsTrigger>
                    </TabsList>
                </Tabs>
            </div>

            <div className="flex-grow overflow-hidden p-4">
                {activeTab === 'charts' && (
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 h-full overflow-y-auto pb-20">
                        <Card className="bg-slate-900 border-slate-800 h-[400px] p-2">
                            <PlotlyStressProfileChart />
                        </Card>
                        <Card className="bg-slate-900 border-slate-800 h-[400px] p-2">
                            <PlotlyMudWeightWindowChart />
                        </Card>
                        <Card className="bg-slate-900 border-slate-800 h-[400px] p-2">
                            <Plotly3DStressTensorChart />
                        </Card>
                        <Card className="bg-slate-900 border-slate-800 h-[400px] p-2">
                            <PlotlyPpVsFgChart />
                        </Card>
                    </div>
                )}

                {activeTab === 'sensitivity' && <SensitivityAnalysis />}
                
                {activeTab === 'ml' && <MachineLearningPanel />}

                {activeTab === 'scenarios' && (
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 h-full">
                        <div className="md:col-span-1 h-full">
                            <ScenarioManager />
                        </div>
                        <div className="md:col-span-3 h-full bg-slate-900 border border-slate-800 rounded-lg p-4 flex items-center justify-center text-slate-500">
                            <div className="text-center">
                                <GitCompare className="w-12 h-12 mx-auto mb-2 opacity-20" />
                                <p>Select scenarios to compare</p>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default AdvancedAnalyticsDashboard;