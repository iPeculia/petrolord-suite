import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Box, FileOutput, TrendingUp } from 'lucide-react';

const VolumetricsDataProvider = () => {
  return (
    <Card className="bg-slate-900 border-slate-800 h-full">
      <CardHeader className="pb-3 border-b border-slate-800">
        <CardTitle className="text-sm font-medium text-slate-200 flex items-center gap-2">
            <Box className="w-4 h-4 text-emerald-400" /> Volumetrics Data Provider
        </CardTitle>
      </CardHeader>
      <CardContent className="p-4 space-y-6">
         <div className="space-y-3">
            <h4 className="text-xs font-semibold text-slate-400 uppercase">Depth Surfaces</h4>
            <div className="grid grid-cols-3 gap-2 text-center">
                <div className="p-2 bg-slate-950 border border-slate-800 rounded">
                    <div className="text-[10px] text-slate-500 mb-1">P90 (Low)</div>
                    <div className="text-xs font-bold text-slate-300">Ready</div>
                </div>
                <div className="p-2 bg-slate-950 border border-slate-800 rounded border-emerald-500/30 bg-emerald-500/5">
                    <div className="text-[10px] text-emerald-500 mb-1">P50 (Base)</div>
                    <div className="text-xs font-bold text-white">Ready</div>
                </div>
                <div className="p-2 bg-slate-950 border border-slate-800 rounded">
                    <div className="text-[10px] text-slate-500 mb-1">P10 (High)</div>
                    <div className="text-xs font-bold text-slate-300">Ready</div>
                </div>
            </div>
         </div>

         <div className="space-y-3">
            <div className="flex items-center justify-between">
                <Label className="text-xs text-slate-300">Include Uncertainty Maps</Label>
                <Switch className="scale-75" />
            </div>
            <div className="flex items-center justify-between">
                <Label className="text-xs text-slate-300">Export Thickness Grids</Label>
                <Switch defaultChecked className="scale-75" />
            </div>
         </div>

         <div className="pt-4 border-t border-slate-800 grid grid-cols-2 gap-3">
            <Button variant="outline" className="w-full h-8 text-xs border-slate-700 text-slate-300">
                <FileOutput className="w-3 h-3 mr-2" /> Export Grids
            </Button>
            <Button className="w-full bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-400 border border-emerald-500/30 h-8 text-xs">
                <TrendingUp className="w-3 h-3 mr-2" /> Send to FDP
            </Button>
         </div>
      </CardContent>
    </Card>
  );
};

export default VolumetricsDataProvider;