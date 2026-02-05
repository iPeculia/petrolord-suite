import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Microscope } from 'lucide-react';

const RockPhysicsHooks = () => {
  return (
    <Card className="bg-slate-900 border-slate-800">
      <CardHeader className="pb-2 border-b border-slate-800">
        <CardTitle className="text-sm font-medium flex items-center gap-2 text-cyan-400">
            <Microscope className="w-4 h-4" /> Rock Physics Templates
        </CardTitle>
      </CardHeader>
      <CardContent className="p-4 space-y-4">
        <div className="space-y-2">
            <Label className="text-xs text-slate-400">Lithology Model</Label>
            <Select defaultValue="gardner">
                <SelectTrigger className="h-8 text-xs bg-slate-950 border-slate-700"><SelectValue /></SelectTrigger>
                <SelectContent className="bg-slate-900 border-slate-700">
                    <SelectItem value="gardner">Gardner (Density-Velocity)</SelectItem>
                    <SelectItem value="castagna">Castagna (Vs-Vp)</SelectItem>
                    <SelectItem value="han">Han (Clay Content)</SelectItem>
                </SelectContent>
            </Select>
        </div>
        
        <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
                <Label className="text-[10px] text-slate-500">Matrix Vp (m/s)</Label>
                <input className="w-full bg-slate-950 border border-slate-700 rounded px-2 py-1 text-xs text-white" defaultValue="4200" />
            </div>
            <div className="space-y-1">
                <Label className="text-[10px] text-slate-500">Fluid Vp (m/s)</Label>
                <input className="w-full bg-slate-950 border border-slate-700 rounded px-2 py-1 text-xs text-white" defaultValue="1500" />
            </div>
        </div>

        <div className="p-2 bg-slate-950/50 rounded border border-slate-800 text-[10px] text-slate-500 italic">
            Links interval velocity limits based on expected porosity range (0-30%).
        </div>
      </CardContent>
    </Card>
  );
};

export default RockPhysicsHooks;