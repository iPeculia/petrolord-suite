import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScatterChart, BarChart2, Table2, Triangle } from 'lucide-react';
import CrossplotDashboard from './CrossplotDashboard';
import MultiWellDashboard from './MultiWellDashboard';
import ZoneStatsDashboard from './ZoneStatsDashboard';
import TernaryPlot from './TernaryPlot';

const DashboardsPanel = ({ petroState }) => {
    const { activeWellId, wells, markers } = petroState;
    const activeWell = wells.find(w => w.id === activeWellId);

    return (
        <div className="h-full bg-slate-950 p-4 flex flex-col">
            <Tabs defaultValue="crossplot" className="h-full flex flex-col">
                <div className="flex items-center justify-between mb-4 shrink-0">
                    <TabsList className="bg-slate-900 border border-slate-800">
                        <TabsTrigger value="crossplot" className="flex gap-2"><ScatterChart className="w-4 h-4"/> Crossplot</TabsTrigger>
                        <TabsTrigger value="ternary" className="flex gap-2"><Triangle className="w-4 h-4"/> Ternary</TabsTrigger>
                        <TabsTrigger value="multi-well" className="flex gap-2"><BarChart2 className="w-4 h-4"/> Multi-Well</TabsTrigger>
                        <TabsTrigger value="zones" className="flex gap-2"><Table2 className="w-4 h-4"/> Zonal Stats</TabsTrigger>
                    </TabsList>
                    <div className="text-xs text-slate-500">
                        {activeWell ? `Active: ${activeWell.name}` : 'No Active Well'}
                    </div>
                </div>

                <div className="flex-1 min-h-0">
                    <TabsContent value="crossplot" className="h-full mt-0">
                        {activeWell ? (
                            <CrossplotDashboard 
                                data={activeWell.data} 
                                curveMap={activeWell.curveMap} 
                                markers={markers.filter(m => m.well_id === activeWellId)} 
                            />
                        ) : (
                            <div className="h-full flex items-center justify-center text-slate-500">Select a well to view crossplots</div>
                        )}
                    </TabsContent>

                    <TabsContent value="ternary" className="h-full mt-0">
                        {activeWell ? (
                            <TernaryPlot 
                                data={activeWell.data} 
                                curveMap={activeWell.curveMap}
                            />
                        ) : (
                            <div className="h-full flex items-center justify-center text-slate-500">Select a well to view ternary plot</div>
                        )}
                    </TabsContent>

                    <TabsContent value="multi-well" className="h-full mt-0">
                        <MultiWellDashboard wells={wells} markers={markers} />
                    </TabsContent>

                    <TabsContent value="zones" className="h-full mt-0">
                        <ZoneStatsDashboard wells={wells} markers={markers} />
                    </TabsContent>
                </div>
            </Tabs>
        </div>
    );
};

export default DashboardsPanel;