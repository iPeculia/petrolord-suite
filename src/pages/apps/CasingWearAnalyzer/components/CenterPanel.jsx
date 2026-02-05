import React, { useState } from 'react';
import { useCasingWearAnalyzer } from '../contexts/CasingWearAnalyzerContext';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Layers, Activity, AlertTriangle, GitCompare } from 'lucide-react';
import InputsLoadsTab from './InputsLoadsTab';
import WearProfileTab from './WearProfileTab';
import RiskZonesTab from './RiskZonesTab';
import ScenariosTab from './ScenariosTab';

const CenterPanel = () => {
  const { activeWearCase } = useCasingWearAnalyzer();
  const [activeTab, setActiveTab] = useState('inputs');

  if (!activeWearCase) {
    return (
      <div className="flex-1 bg-slate-950 flex flex-col items-center justify-center text-slate-500 p-8 border-r border-slate-800">
        <Layers className="w-16 h-16 mb-4 opacity-20" />
        <h3 className="text-lg font-medium text-slate-400">No Case Selected</h3>
        <p className="text-sm mt-2">Create a new wear case or select one from the left panel to begin analysis.</p>
      </div>
    );
  }

  const tabs = [
    { value: 'inputs', label: 'Inputs & Loads', Icon: Activity },
    { value: 'profile', label: 'Wear Profile', Icon: Layers },
    { value: 'risks', label: 'Risk Zones', Icon: AlertTriangle },
    { value: 'scenarios', label: 'Scenarios', Icon: GitCompare },
  ];

  return (
    <div className="flex-1 bg-slate-950 border-r border-slate-800 flex flex-col min-w-0 overflow-hidden">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="h-full flex flex-col">
        <div className="px-6 pt-4 border-b border-slate-800 shrink-0 bg-slate-900/30">
          <TabsList className="bg-transparent border-b border-transparent w-full justify-start rounded-none h-10 p-0 space-x-6">
            {tabs.map(tab => (
              <TabsTrigger 
                key={tab.value}
                value={tab.value} 
                disabled={tab.disabled}
                className="bg-transparent border-b-2 border-transparent data-[state=active]:border-amber-500 data-[state=active]:bg-transparent rounded-none px-1 pb-2 text-slate-400 data-[state=active]:text-amber-500 hover:text-white transition-colors flex items-center gap-2 text-sm disabled:opacity-40 disabled:cursor-not-allowed"
              >
                <tab.Icon className="w-4 h-4" />
                {tab.label}
              </TabsTrigger>
            ))}
          </TabsList>
        </div>

        <div className="flex-1 overflow-y-auto bg-slate-950 p-6">
          <TabsContent value="inputs" className="space-y-6 mt-0 h-full">
            <InputsLoadsTab />
          </TabsContent>
          <TabsContent value="profile" className="space-y-6 mt-0 h-full">
            <WearProfileTab />
          </TabsContent>
          <TabsContent value="risks" className="space-y-6 mt-0 h-full">
            <RiskZonesTab />
          </TabsContent>
          <TabsContent value="scenarios" className="space-y-6 mt-0 h-full">
            <ScenariosTab />
          </TabsContent>
        </div>
      </Tabs>
    </div>
  );
};

export default CenterPanel;