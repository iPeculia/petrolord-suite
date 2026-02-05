import React from 'react';
import { MEMProvider, useMEM } from './contexts/MEMContext';
import { ExpertModeProvider } from './contexts/ExpertModeContext';
import { GuidedModeProvider } from './contexts/GuidedModeContext';
import OverviewTab from './components/OverviewTab';
import InputPanel from './components/InputPanel';
import VisualizationPanel from './components/VisualizationPanel';
import ReportsPanel from './components/ReportsPanel';
import ExpertModeContainer from './components/expert/ExpertModeContainer';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Activity, Database, FileText, Home, LineChart, Settings, Wrench } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';

const MEMAppContent = () => {
    const { state, dispatch } = useMEM();
    const { activeTab, mode } = state;

    const toggleMode = (checked) => {
        dispatch({ type: 'SET_MODE', payload: checked ? 'expert' : 'guided' });
    };

    return (
        <div className="h-full flex flex-col bg-slate-950 text-slate-200">
            {/* Header */}
            <header className="h-14 border-b border-slate-800 bg-slate-900 flex items-center justify-between px-4 shrink-0">
                <div className="flex items-center gap-2">
                    <div className="bg-blue-600 p-1.5 rounded-md">
                        <Activity className="w-5 h-5 text-white" />
                    </div>
                    <h1 className="font-bold text-lg">Mechanical Earth Model</h1>
                </div>
                
                <div className="flex items-center gap-4">
                    <div className="flex items-center space-x-2 bg-slate-800 px-3 py-1.5 rounded-full border border-slate-700">
                        <Switch id="expert-mode" checked={mode === 'expert'} onCheckedChange={toggleMode} />
                        <Label htmlFor="expert-mode" className="text-xs cursor-pointer font-medium flex items-center gap-1.5">
                            <Wrench className="w-3 h-3" /> Expert Mode
                        </Label>
                    </div>
                    <Button variant="outline" size="sm" className="text-xs border-slate-700">Save Project</Button>
                </div>
            </header>

            {/* Main Content */}
            {mode === 'expert' ? (
                <ExpertModeContainer />
            ) : (
                <div className="flex-1 overflow-hidden">
                    <Tabs value={activeTab} onValueChange={(val) => dispatch({ type: 'SET_ACTIVE_TAB', payload: val })} className="h-full flex flex-col">
                        <div className="px-4 border-b border-slate-800 bg-slate-900/50">
                            <TabsList className="bg-transparent h-12 p-0 gap-6">
                                <TabsTrigger value="overview" className="data-[state=active]:bg-transparent data-[state=active]:border-b-2 data-[state=active]:border-blue-500 data-[state=active]:text-blue-400 rounded-none px-0 h-full">
                                    <Home className="w-4 h-4 mr-2" /> Overview
                                </TabsTrigger>
                                <TabsTrigger value="data" className="data-[state=active]:bg-transparent data-[state=active]:border-b-2 data-[state=active]:border-blue-500 data-[state=active]:text-blue-400 rounded-none px-0 h-full">
                                    <Database className="w-4 h-4 mr-2" /> Data & Inputs
                                </TabsTrigger>
                                <TabsTrigger value="analysis" className="data-[state=active]:bg-transparent data-[state=active]:border-b-2 data-[state=active]:border-blue-500 data-[state=active]:text-blue-400 rounded-none px-0 h-full">
                                    <LineChart className="w-4 h-4 mr-2" /> Analysis & Viz
                                </TabsTrigger>
                                <TabsTrigger value="reports" className="data-[state=active]:bg-transparent data-[state=active]:border-b-2 data-[state=active]:border-blue-500 data-[state=active]:text-blue-400 rounded-none px-0 h-full">
                                    <FileText className="w-4 h-4 mr-2" /> Reports
                                </TabsTrigger>
                            </TabsList>
                        </div>

                        <div className="flex-1 overflow-hidden">
                            <TabsContent value="overview" className="h-full m-0"><OverviewTab /></TabsContent>
                            <TabsContent value="data" className="h-full m-0"><InputPanel onCalculate={() => dispatch({ type: 'SET_ACTIVE_TAB', payload: 'analysis' })} /></TabsContent>
                            <TabsContent value="analysis" className="h-full m-0"><VisualizationPanel /></TabsContent>
                            <TabsContent value="reports" className="h-full m-0"><ReportsPanel /></TabsContent>
                        </div>
                    </Tabs>
                </div>
            )}
        </div>
    );
};

const MechanicalEarthModel = () => {
    return (
        <MEMProvider>
            <GuidedModeProvider>
                <ExpertModeProvider>
                    <MEMAppContent />
                </ExpertModeProvider>
            </GuidedModeProvider>
        </MEMProvider>
    );
};

export default MechanicalEarthModel;