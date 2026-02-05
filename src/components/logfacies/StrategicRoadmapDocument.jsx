import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import EnterpriseRoadmapPlan from './roadmap/EnterpriseRoadmapPlan';
import PhaseExecutionGuide from './roadmap/PhaseExecutionGuide';
import TechStackDocumentation from './roadmap/TechStackDocumentation';
import ImplementationChecklist from './roadmap/ImplementationChecklist';
import SuccessMetricsFramework from './roadmap/SuccessMetricsFramework';
import RiskMitigationPlan from './roadmap/RiskMitigationPlan';
import ResourceAllocationMatrix from './roadmap/ResourceAllocationMatrix';
import DependencyGraph from './roadmap/DependencyGraph';
import { Map, List, FileText, Activity, AlertTriangle, BarChart3, Network, CheckSquare } from 'lucide-react';

const StrategicRoadmapDocument = () => {
  return (
    <div className="h-full flex flex-col bg-slate-950 text-slate-100">
        <div className="p-4 border-b border-slate-800 shrink-0">
            <h2 className="text-2xl font-bold text-white flex items-center gap-3 mb-1">
                <Map className="w-8 h-8 text-indigo-400" /> 
                Enterprise Development Plan
            </h2>
            <p className="text-slate-400 text-sm">Strategic execution framework for the Log Facies Analysis Suite (2024-2025)</p>
        </div>

        <Tabs defaultValue="overview" className="flex-1 flex flex-col min-h-0">
            <div className="px-4 pt-2 bg-slate-900 border-b border-slate-800">
                <TabsList className="bg-slate-800 h-9 mb-2">
                    <TabsTrigger value="overview" className="text-xs px-3"><LayoutIcon className="w-3 h-3 mr-2"/> Overview</TabsTrigger>
                    <TabsTrigger value="guide" className="text-xs px-3"><List className="w-3 h-3 mr-2"/> Execution Guide</TabsTrigger>
                    <TabsTrigger value="graph" className="text-xs px-3"><Network className="w-3 h-3 mr-2"/> Dependencies</TabsTrigger>
                    <TabsTrigger value="resources" className="text-xs px-3"><BarChart3 className="w-3 h-3 mr-2"/> Resources</TabsTrigger>
                    <TabsTrigger value="metrics" className="text-xs px-3"><Activity className="w-3 h-3 mr-2"/> Metrics</TabsTrigger>
                    <TabsTrigger value="risks" className="text-xs px-3"><AlertTriangle className="w-3 h-3 mr-2"/> Risks</TabsTrigger>
                    <TabsTrigger value="checklist" className="text-xs px-3"><CheckSquare className="w-3 h-3 mr-2"/> Checklist</TabsTrigger>
                    <TabsTrigger value="tech" className="text-xs px-3"><FileText className="w-3 h-3 mr-2"/> Tech Stack</TabsTrigger>
                </TabsList>
            </div>

            <div className="flex-1 overflow-hidden p-4 bg-slate-950/50">
                <TabsContent value="overview" className="h-full mt-0">
                    <EnterpriseRoadmapPlan />
                </TabsContent>
                
                <TabsContent value="guide" className="h-full mt-0">
                    <PhaseExecutionGuide />
                </TabsContent>

                <TabsContent value="graph" className="h-full mt-0">
                    <DependencyGraph />
                </TabsContent>

                <TabsContent value="resources" className="h-full mt-0">
                    <ResourceAllocationMatrix />
                </TabsContent>

                <TabsContent value="metrics" className="h-full mt-0">
                    <SuccessMetricsFramework />
                </TabsContent>

                <TabsContent value="risks" className="h-full mt-0">
                    <RiskMitigationPlan />
                </TabsContent>

                <TabsContent value="checklist" className="h-full mt-0">
                    <ImplementationChecklist />
                </TabsContent>

                <TabsContent value="tech" className="h-full mt-0">
                    <TechStackDocumentation />
                </TabsContent>
            </div>
        </Tabs>
    </div>
  );
};

// Helper icon for Overview
const LayoutIcon = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><rect width="18" height="18" x="3" y="3" rx="2" ry="2"/><line x1="3" x2="21" y1="9" y2="9"/><line x1="9" x2="9" y1="21" y2="9"/></svg>
);

export default StrategicRoadmapDocument;