import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowRight, Database, Layers, Box, CheckSquare } from 'lucide-react';

const WorkflowCard = ({ title, description, icon: Icon, steps, color }) => (
  <Card className="bg-slate-900 border-slate-800 hover:border-slate-700 transition-colors cursor-pointer group">
    <CardContent className="p-4 space-y-3">
      <div className="flex justify-between items-start">
        <div className={`p-2 rounded-lg ${color} bg-opacity-10`}>
          <Icon className={`w-5 h-5 ${color.replace('bg-', 'text-')}`} />
        </div>
        <Button variant="ghost" size="icon" className="h-6 w-6 text-slate-500 group-hover:text-white">
          <ArrowRight className="w-4 h-4" />
        </Button>
      </div>
      <div>
        <h4 className="font-bold text-sm text-slate-200 group-hover:text-white">{title}</h4>
        <p className="text-xs text-slate-500 mt-1">{description}</p>
      </div>
      <div className="pt-2 border-t border-slate-800/50">
         <div className="flex items-center gap-1 text-[10px] text-slate-500">
            <span className="font-medium text-slate-400">{steps} Steps</span>
            <span>• Automated</span>
         </div>
      </div>
    </CardContent>
  </Card>
);

const IntegrationWorkflows = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <WorkflowCard 
        title="Facies-to-Velocity" 
        description="Auto-generate velocity trends from log facies interpretation."
        icon={Database}
        steps={4}
        color="bg-purple-500"
      />
      <WorkflowCard 
        title="Depth-to-Structure" 
        description="Push depth-converted horizons directly to EarthModel Studio."
        icon={Layers}
        steps={3}
        color="bg-blue-500"
      />
      <WorkflowCard 
        title="Uncertainty-to-Volume" 
        description="Export P10/P50/P90 depth maps to Volumetrics calculator."
        icon={Box}
        steps={5}
        color="bg-emerald-500"
      />
      <WorkflowCard 
        title="QC-to-Tasks" 
        description="Automatically create QC tickets for outliers in Project Mgmt."
        icon={CheckSquare}
        steps={2}
        color="bg-orange-500"
      />
    </div>
  );
};

export default IntegrationWorkflows;