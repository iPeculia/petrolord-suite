import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card } from '@/components/ui/card';
import { LayoutDashboard, ListTodo, Code2, CheckSquare, BarChart, AlertTriangle, Users, Network } from 'lucide-react';

import VelocityModelBuilderStrategicPlan from './roadmap/VelocityModelBuilderStrategicPlan';
import PhaseExecutionGuideVelocity from './roadmap/PhaseExecutionGuideVelocity';
import TechStackVelocity from './roadmap/TechStackVelocity';
import ImplementationChecklistVelocity from './roadmap/ImplementationChecklistVelocity';
import SuccessMetricsVelocity from './roadmap/SuccessMetricsVelocity';
import RiskMitigationVelocity from './roadmap/RiskMitigationVelocity';
import ResourceAllocationVelocity from './roadmap/ResourceAllocationVelocity';
import DependencyGraphVelocity from './roadmap/DependencyGraphVelocity';

const VelocityModelBuilderStrategicSuite = () => {
  return (
    <div className="h-full flex flex-col bg-slate-950">
      <Tabs defaultValue="plan" className="flex-1 flex flex-col h-full overflow-hidden">
        <div className="border-b border-slate-800 px-4 bg-slate-900">
            <TabsList className="h-12 bg-transparent w-full justify-start gap-2 overflow-x-auto no-scrollbar">
                <TabsTrigger value="plan" className="data-[state=active]:bg-slate-800 data-[state=active]:text-emerald-400 text-xs"><LayoutDashboard className="w-3 h-3 mr-2"/>Strategic Plan</TabsTrigger>
                <TabsTrigger value="guide" className="data-[state=active]:bg-slate-800 data-[state=active]:text-emerald-400 text-xs"><ListTodo className="w-3 h-3 mr-2"/>Execution Guide</TabsTrigger>
                <TabsTrigger value="deps" className="data-[state=active]:bg-slate-800 data-[state=active]:text-emerald-400 text-xs"><Network className="w-3 h-3 mr-2"/>Dependencies</TabsTrigger>
                <TabsTrigger value="metrics" className="data-[state=active]:bg-slate-800 data-[state=active]:text-emerald-400 text-xs"><BarChart className="w-3 h-3 mr-2"/>KPIs</TabsTrigger>
                <TabsTrigger value="risks" className="data-[state=active]:bg-slate-800 data-[state=active]:text-emerald-400 text-xs"><AlertTriangle className="w-3 h-3 mr-2"/>Risks</TabsTrigger>
                <TabsTrigger value="resources" className="data-[state=active]:bg-slate-800 data-[state=active]:text-emerald-400 text-xs"><Users className="w-3 h-3 mr-2"/>Resources</TabsTrigger>
                <TabsTrigger value="checklist" className="data-[state=active]:bg-slate-800 data-[state=active]:text-emerald-400 text-xs"><CheckSquare className="w-3 h-3 mr-2"/>Checklist</TabsTrigger>
                <TabsTrigger value="tech" className="data-[state=active]:bg-slate-800 data-[state=active]:text-emerald-400 text-xs"><Code2 className="w-3 h-3 mr-2"/>Tech Stack</TabsTrigger>
            </TabsList>
        </div>

        <div className="flex-1 overflow-hidden p-4">
            <TabsContent value="plan" className="h-full mt-0"><VelocityModelBuilderStrategicPlan /></TabsContent>
            <TabsContent value="guide" className="h-full mt-0"><PhaseExecutionGuideVelocity /></TabsContent>
            <TabsContent value="deps" className="h-full mt-0"><DependencyGraphVelocity /></TabsContent>
            <TabsContent value="metrics" className="h-full mt-0"><SuccessMetricsVelocity /></TabsContent>
            <TabsContent value="risks" className="h-full mt-0"><RiskMitigationVelocity /></TabsContent>
            <TabsContent value="resources" className="h-full mt-0"><ResourceAllocationVelocity /></TabsContent>
            <TabsContent value="checklist" className="h-full mt-0"><ImplementationChecklistVelocity /></TabsContent>
            <TabsContent value="tech" className="h-full mt-0"><TechStackVelocity /></TabsContent>
        </div>
      </Tabs>
    </div>
  );
};

export default VelocityModelBuilderStrategicSuite;