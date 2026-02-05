import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Map, Layers, ArrowRightLeft, Eye } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const MapPlaceholder = ({ type, color }) => (
    <div className={`w-full h-full rounded bg-${color}-950/30 border border-${color}-900 flex items-center justify-center relative overflow-hidden group`}>
        <div className={`absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-${color}-900/20 to-transparent opacity-50`}></div>
        {/* Simulated Grid Lines */}
        <div className="absolute inset-0" style={{ backgroundImage: `linear-gradient(#334155 1px, transparent 1px), linear-gradient(90deg, #334155 1px, transparent 1px)`, backgroundSize: '40px 40px', opacity: 0.2 }}></div>
        
        <div className="text-center z-10">
            <Map className={`w-12 h-12 text-${color}-500 mx-auto mb-2 opacity-50`} />
            <div className={`text-${color}-400 font-bold text-sm`}>{type}</div>
            <div className="text-slate-600 text-xs">1250x1250 Grid</div>
        </div>
    </div>
);

const MapViewComparison = () => {
  const [viewMode, setViewMode] = useState('side-by-side'); // side-by-side, difference

  return (
    <Card className="bg-slate-900 border-slate-800 h-full flex flex-col">
      <CardHeader className="pb-2 border-b border-slate-800 flex flex-row items-center justify-between">
         <CardTitle className="text-sm font-medium text-white flex items-center gap-2">
            <Layers className="w-4 h-4 text-purple-400" /> Map QC & Comparison
         </CardTitle>
         <div className="flex items-center gap-2">
            <Select defaultValue="top_reservoir">
                <SelectTrigger className="w-[180px] h-7 text-xs bg-slate-950 border-slate-700"><SelectValue /></SelectTrigger>
                <SelectContent className="bg-slate-900 border-slate-700">
                    <SelectItem value="top_reservoir">Top Reservoir</SelectItem>
                    <SelectItem value="base_cretaceous">Base Cretaceous</SelectItem>
                    <SelectItem value="seabed">Seabed</SelectItem>
                </SelectContent>
            </Select>
            <Tabs value={viewMode} onValueChange={setViewMode} className="w-auto">
                <TabsList className="h-7 bg-slate-950 border border-slate-700">
                    <TabsTrigger value="side-by-side" className="text-xs px-2 h-5">Side-by-Side</TabsTrigger>
                    <TabsTrigger value="difference" className="text-xs px-2 h-5">Difference</TabsTrigger>
                </TabsList>
            </Tabs>
         </div>
      </CardHeader>
      <CardContent className="p-4 flex-1 min-h-0">
        {viewMode === 'side-by-side' ? (
            <div className="grid grid-cols-2 gap-4 h-full">
                <div className="flex flex-col gap-2 h-full">
                    <div className="flex justify-between items-center">
                        <span className="text-xs font-semibold text-blue-400">Time Domain (TWT)</span>
                        <Eye className="w-3 h-3 text-slate-500 cursor-pointer hover:text-white" />
                    </div>
                    <MapPlaceholder type="Time Structure Map" color="blue" />
                </div>
                <div className="flex flex-col gap-2 h-full">
                    <div className="flex justify-between items-center">
                        <span className="text-xs font-semibold text-emerald-400">Depth Domain (TVDss)</span>
                        <Eye className="w-3 h-3 text-slate-500 cursor-pointer hover:text-white" />
                    </div>
                    <MapPlaceholder type="Depth Structure Map" color="emerald" />
                </div>
            </div>
        ) : (
            <div className="flex flex-col h-full">
                 <div className="flex justify-between items-center mb-2">
                    <span className="text-xs font-semibold text-amber-400">Scenario Difference (Base - High)</span>
                    <div className="text-[10px] text-slate-500 flex items-center gap-2">
                         <div className="flex items-center gap-1"><div className="w-2 h-2 bg-red-500 rounded-full"></div> +100m</div>
                         <div className="flex items-center gap-1"><div className="w-2 h-2 bg-slate-500 rounded-full"></div> 0m</div>
                         <div className="flex items-center gap-1"><div className="w-2 h-2 bg-blue-500 rounded-full"></div> -100m</div>
                    </div>
                </div>
                <MapPlaceholder type="Depth Difference Map" color="amber" />
            </div>
        )}
      </CardContent>
    </Card>
  );
};

export default MapViewComparison;