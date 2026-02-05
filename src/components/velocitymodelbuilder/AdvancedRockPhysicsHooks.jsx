import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Button } from '@/components/ui/button';
import { Activity, Droplets, Gauge, Microscope } from 'lucide-react';

const AdvancedRockPhysicsHooks = () => {
  return (
    <div className="h-full flex flex-col gap-4 p-1">
      <Card className="bg-slate-900 border-slate-800">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-medium text-slate-200 flex items-center gap-2">
            <Microscope className="w-4 h-4 text-purple-400" /> Rock Physics Templates
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label className="text-xs text-slate-400">Lithology Model</Label>
            <Select defaultValue="gardner">
              <SelectTrigger className="h-8 bg-slate-950 border-slate-700">
                <SelectValue placeholder="Select model" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="gardner">Gardner's Relation (Density-Velocity)</SelectItem>
                <SelectItem value="castagna">Castagna's Mudrock Line (Vp-Vs)</SelectItem>
                <SelectItem value="han">Han's Relation (Clay Content)</SelectItem>
                <SelectItem value="greenberg">Greenberg-Castagna</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between">
              <Label className="text-xs text-slate-400">Clay Volume (Vsh)</Label>
              <span className="text-xs text-slate-300">25%</span>
            </div>
            <Slider defaultValue={[25]} max={100} step={1} className="py-2" />
          </div>

          <div className="space-y-2">
            <div className="flex justify-between">
              <Label className="text-xs text-slate-400">Porosity (Phi)</Label>
              <span className="text-xs text-slate-300">18%</span>
            </div>
            <Slider defaultValue={[18]} max={40} step={0.5} className="py-2" />
          </div>
        </CardContent>
      </Card>

      <Card className="bg-slate-900 border-slate-800">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-medium text-slate-200 flex items-center gap-2">
            <Droplets className="w-4 h-4 text-blue-400" /> Fluid Substitution (Gassmann)
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-2">
              <Label className="text-xs text-slate-400">In-Situ Fluid</Label>
              <Select defaultValue="brine">
                <SelectTrigger className="h-8 bg-slate-950 border-slate-700">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="brine">Brine</SelectItem>
                  <SelectItem value="oil">Oil</SelectItem>
                  <SelectItem value="gas">Gas</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label className="text-xs text-slate-400">Target Fluid</Label>
              <Select defaultValue="oil">
                <SelectTrigger className="h-8 bg-slate-950 border-slate-700">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="brine">Brine</SelectItem>
                  <SelectItem value="oil">Oil</SelectItem>
                  <SelectItem value="gas">Gas</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <Button className="w-full bg-blue-600/20 hover:bg-blue-600/30 text-blue-400 border border-blue-500/30 h-8 text-xs">
            Calculate Vp Change
          </Button>
        </CardContent>
      </Card>

      <Card className="bg-slate-900 border-slate-800">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-medium text-slate-200 flex items-center gap-2">
            <Gauge className="w-4 h-4 text-orange-400" /> Pressure Corrections
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex items-center gap-2 text-xs text-slate-400">
             <input type="checkbox" className="rounded bg-slate-800 border-slate-600" defaultChecked />
             <span>Apply Overpressure Correction (Eaton)</span>
          </div>
          <div className="space-y-1">
             <Label className="text-[10px] text-slate-500">NCT Slope</Label>
             <div className="flex gap-2">
                <Button variant="outline" size="sm" className="h-6 w-6 p-0 text-xs border-slate-700">-</Button>
                <div className="flex-1 h-6 bg-slate-950 border border-slate-800 rounded flex items-center justify-center text-xs">0.0003 1/ft</div>
                <Button variant="outline" size="sm" className="h-6 w-6 p-0 text-xs border-slate-700">+</Button>
             </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdvancedRockPhysicsHooks;