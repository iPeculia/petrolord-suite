import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { SlidersHorizontal, Edit, Target, Sliders, Columns, BarChart3, Palette, HelpCircle, FileDown, BrainCircuit, Users } from 'lucide-react';
import PropertyEditor from './PropertyEditor';
import StressEditor from './StressEditor';
import CalibrationPanel from './CalibrationPanel';
import ScenarioBuilder from './ScenarioBuilder';
import ComparisonPanel from './ComparisonPanel';
import SensitivityAnalysis from './SensitivityAnalysis';
import AdvancedVisualizationPanel from './AdvancedVisualizationPanel';
import ExpertHelpPanel from './ExpertHelpPanel';
import AdvancedExportPanel from './AdvancedExportPanel';
import ExpertToolsPanel from './ExpertToolsPanel';
import AdvancedAnalyticsWorkflow from './analytics/AdvancedAnalyticsWorkflow';
import CollaborationWorkflow from './collaboration/CollaborationWorkflow';


const ExpertModeWorkflow = () => {
    return (
        <div className="flex gap-6 h-[calc(100vh-200px)]">
            <div className="w-1/4">
                <ExpertToolsPanel />
            </div>
            <div className="w-3/4">
                <Tabs defaultValue="properties" className="w-full h-full flex flex-col">
                    <TabsList className="bg-slate-800 text-slate-300 grid grid-cols-5 md:grid-cols-11 h-auto">
                        <TabsTrigger value="properties"><Edit className="w-4 h-4 mr-2" />Properties</TabsTrigger>
                        <TabsTrigger value="stresses"><SlidersHorizontal className="w-4 h-4 mr-2" />Stresses</TabsTrigger>
                        <TabsTrigger value="calibration"><Target className="w-4 h-4 mr-2" />Calibration</TabsTrigger>
                        <TabsTrigger value="scenarios"><Sliders className="w-4 h-4 mr-2" />Scenarios</TabsTrigger>
                        <TabsTrigger value="comparison"><Columns className="w-4 h-4 mr-2" />Comparison</TabsTrigger>
                        <TabsTrigger value="sensitivity"><BarChart3 className="w-4 h-4 mr-2" />Sensitivity</TabsTrigger>
                        <TabsTrigger value="analytics"><BrainCircuit className="w-4 h-4 mr-2" />Analytics</TabsTrigger>
                        <TabsTrigger value="collaboration"><Users className="w-4 h-4 mr-2" />Collaborate</TabsTrigger>
                        <TabsTrigger value="visualization"><Palette className="w-4 h-4 mr-2" />Visualize</TabsTrigger>
                         <TabsTrigger value="export"><FileDown className="w-4 h-4 mr-2" />Export</TabsTrigger>
                        <TabsTrigger value="help"><HelpCircle className="w-4 h-4 mr-2" />Help</TabsTrigger>
                    </TabsList>
                    <TabsContent value="properties" className="flex-grow mt-4 bg-slate-800/50 rounded-lg p-4"><PropertyEditor /></TabsContent>
                    <TabsContent value="stresses" className="flex-grow mt-4 bg-slate-800/50 rounded-lg p-4"><StressEditor /></TabsContent>
                    <TabsContent value="calibration" className="flex-grow mt-4 bg-slate-800/50 rounded-lg p-4"><CalibrationPanel /></TabsContent>
                    <TabsContent value="scenarios" className="flex-grow mt-4 bg-slate-800/50 rounded-lg p-4"><ScenarioBuilder /></TabsContent>
                    <TabsContent value="comparison" className="flex-grow mt-4 bg-slate-800/50 rounded-lg p-4"><ComparisonPanel /></TabsContent>
                    <TabsContent value="sensitivity" className="flex-grow mt-4 bg-slate-800/50 rounded-lg p-4"><SensitivityAnalysis /></TabsContent>
                    <TabsContent value="analytics" className="flex-grow mt-4 bg-slate-800/50 rounded-lg p-4"><AdvancedAnalyticsWorkflow /></TabsContent>
                    <TabsContent value="collaboration" className="flex-grow mt-4 bg-slate-800/50 rounded-lg p-4"><CollaborationWorkflow /></TabsContent>
                    <TabsContent value="visualization" className="flex-grow mt-4 bg-slate-800/50 rounded-lg p-4"><AdvancedVisualizationPanel /></TabsContent>
                    <TabsContent value="export" className="flex-grow mt-4 bg-slate-800/50 rounded-lg p-4"><AdvancedExportPanel /></TabsContent>
                    <TabsContent value="help" className="flex-grow mt-4 bg-slate-800/50 rounded-lg p-4"><ExpertHelpPanel /></TabsContent>
                </Tabs>
            </div>
        </div>
    );
};

export default ExpertModeWorkflow;