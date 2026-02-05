import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { RefreshCw, Zap, BarChart2 } from 'lucide-react';

const LogFaciesVelocityBridge = () => {
  return (
    <Card className="bg-slate-900 border-slate-800 h-full">
      <CardHeader className="pb-3 border-b border-slate-800">
        <div className="flex justify-between items-center">
            <CardTitle className="text-sm font-medium text-slate-200 flex items-center gap-2">
                <Zap className="w-4 h-4 text-yellow-400" /> Log Facies Bridge
            </CardTitle>
            <Button variant="ghost" size="sm" className="h-6 text-xs text-slate-400 hover:text-white">
                <RefreshCw className="w-3 h-3 mr-1" /> Sync
            </Button>
        </div>
      </CardHeader>
      <CardContent className="p-4 space-y-6">
         <div className="space-y-3">
            <h4 className="text-xs font-semibold text-slate-400 uppercase">Detected Litho-Facies</h4>
            <div className="grid grid-cols-2 gap-2">
                <div className="p-2 bg-slate-950 border border-slate-800 rounded flex justify-between items-center">
                    <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-yellow-500"></div>
                        <span className="text-xs text-slate-300">Sandstone</span>
                    </div>
                    <span className="text-[10px] font-mono text-slate-500">3200 m/s</span>
                </div>
                <div className="p-2 bg-slate-950 border border-slate-800 rounded flex justify-between items-center">
                    <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-slate-500"></div>
                        <span className="text-xs text-slate-300">Shale</span>
                    </div>
                    <span className="text-[10px] font-mono text-slate-500">2850 m/s</span>
                </div>
                <div className="p-2 bg-slate-950 border border-slate-800 rounded flex justify-between items-center">
                    <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                        <span className="text-xs text-slate-300">Limestone</span>
                    </div>
                    <span className="text-[10px] font-mono text-slate-500">4800 m/s</span>
                </div>
            </div>
         </div>

         <div className="space-y-3">
            <div className="flex justify-between items-center">
                <h4 className="text-xs font-semibold text-slate-400 uppercase">Velocity Suggestions</h4>
                <Badge variant="outline" className="text-[10px] border-slate-700 text-slate-400">AI Driven</Badge>
            </div>
            <div className="p-3 bg-emerald-900/10 border border-emerald-900/30 rounded text-xs text-emerald-200 space-y-2">
                <p>Based on facies distribution in <span className="font-bold">Target Reservoir</span>:</p>
                <ul className="list-disc list-inside space-y-1 text-emerald-400/80">
                    <li>Suggest changing V0 from 2900 to <span className="text-white font-bold">3150 m/s</span></li>
                    <li>Suggest increasing k-factor due to compaction in shale sections.</li>
                </ul>
                <Button size="sm" className="w-full mt-2 bg-emerald-600 hover:bg-emerald-500 h-7 text-xs">Apply Suggestions</Button>
            </div>
         </div>

         <div className="pt-4 border-t border-slate-800">
            <Button variant="outline" className="w-full text-xs border-slate-700 text-slate-300 hover:text-white">
                <BarChart2 className="w-3 h-3 mr-2" /> View Correlation Plot
            </Button>
         </div>
      </CardContent>
    </Card>
  );
};

export default LogFaciesVelocityBridge;