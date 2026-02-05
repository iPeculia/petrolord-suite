import React, { useState } from 'react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Card } from '@/components/ui/card';
import { LayoutDashboard, Activity, Hammer, Target, Database, ArrowRightLeft } from 'lucide-react';

// Components
import PetroLordDashboard from './PetroLordDashboard';
import PPFGModule from './modules/PPFGModule';
import GeomechanicsModule from './modules/GeomechanicsModule';
import ProspectFDPModule from './modules/ProspectFDPModule';
import DataSyncManager from './DataSyncManager';
import PetrolordAPIConnector from './PetrolordAPIConnector';

const PetrolordIntegrationHub = () => {
  const [activeTab, setActiveTab] = useState('dashboard');

  return (
    <div className="h-full flex flex-col bg-slate-950 overflow-hidden">
        <div className="flex-shrink-0 border-b border-slate-800 bg-slate-900 px-4 py-2">
            <div className="flex items-center justify-between mb-2">
                <h2 className="text-sm font-bold text-white uppercase tracking-wider">PetroLord Suite Integration</h2>
                <div className="flex items-center gap-2 text-[10px] text-emerald-400">
                    <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
                    Live Connection
                </div>
            </div>
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                <TabsList className="bg-slate-950 border border-slate-800 h-8 p-0 w-full justify-start">
                    <TabsTrigger value="dashboard" className="text-xs px-3 h-full data-[state=active]:bg-slate-800 data-[state=active]:text-white rounded-none border-r border-slate-800">
                        <LayoutDashboard className="w-3 h-3 mr-2" /> Dashboard
                    </TabsTrigger>
                    <TabsTrigger value="ppfg" className="text-xs px-3 h-full data-[state=active]:bg-slate-800 data-[state=active]:text-blue-400 rounded-none border-r border-slate-800">
                        <Activity className="w-3 h-3 mr-2" /> PPFG
                    </TabsTrigger>
                    <TabsTrigger value="geomech" className="text-xs px-3 h-full data-[state=active]:bg-slate-800 data-[state=active]:text-orange-400 rounded-none border-r border-slate-800">
                        <Hammer className="w-3 h-3 mr-2" /> Geomech
                    </TabsTrigger>
                    <TabsTrigger value="fdp" className="text-xs px-3 h-full data-[state=active]:bg-slate-800 data-[state=active]:text-emerald-400 rounded-none border-r border-slate-800">
                        <Target className="w-3 h-3 mr-2" /> Prospect/FDP
                    </TabsTrigger>
                    <TabsTrigger value="data" className="text-xs px-3 h-full data-[state=active]:bg-slate-800 data-[state=active]:text-slate-300 rounded-none">
                        <Database className="w-3 h-3 mr-2" /> Data Exchange
                    </TabsTrigger>
                </TabsList>
            </Tabs>
        </div>
        
        <div className="flex-1 overflow-hidden bg-slate-950 relative">
            {activeTab === 'dashboard' && (
                <div className="h-full p-4 overflow-y-auto">
                    <PetroLordDashboard />
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4 p-4">
                        <PetrolordAPIConnector />
                        <DataSyncManager />
                    </div>
                </div>
            )}
            {activeTab === 'ppfg' && <PPFGModule />}
            {activeTab === 'geomech' && <GeomechanicsModule />}
            {activeTab === 'fdp' && <ProspectFDPModule />}
            {activeTab === 'data' && (
                <div className="h-full p-4 flex items-center justify-center text-slate-500">
                    <Card className="w-full max-w-md bg-slate-900 border-slate-800 p-8 text-center">
                        <ArrowRightLeft className="w-12 h-12 mx-auto mb-4 text-slate-600" />
                        <h3 className="text-lg font-bold text-white mb-2">Data Exchange Center</h3>
                        <p className="text-sm text-slate-400 mb-6">Import/Export Well Data, Horizons, and Grids between PetroLord modules.</p>
                        <DataSyncManager />
                    </Card>
                </div>
            )}
        </div>
    </div>
  );
};

export default PetrolordIntegrationHub;