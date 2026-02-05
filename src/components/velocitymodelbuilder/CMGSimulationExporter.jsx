import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Cuboid, FileCode } from 'lucide-react';

const CMGSimulationExporter = () => {
  return (
    <Card className="bg-slate-900 border-slate-800 h-full">
      <CardHeader className="pb-3 border-b border-slate-800">
        <CardTitle className="text-sm font-medium text-slate-200 flex items-center gap-2">
          <Cuboid className="w-4 h-4 text-pink-400" /> CMG GEM/STARS Export
        </CardTitle>
      </CardHeader>
      <CardContent className="p-4 space-y-6">
        <div className="space-y-3">
            <Label className="text-xs text-slate-400">Surface & Grid Options</Label>
            <div className="grid grid-cols-1 gap-2 bg-slate-950 p-3 rounded border border-slate-800">
                <div className="flex items-center space-x-2">
                    <Checkbox id="cmg-1" defaultChecked />
                    <label htmlFor="cmg-1" className="text-xs text-slate-300">Top Structure Map</label>
                </div>
                <div className="flex items-center space-x-2">
                    <Checkbox id="cmg-2" defaultChecked />
                    <label htmlFor="cmg-2" className="text-xs text-slate-300">Base Structure Map</label>
                </div>
                <div className="flex items-center space-x-2">
                    <Checkbox id="cmg-3" />
                    <label htmlFor="cmg-3" className="text-xs text-slate-300">Thickness (Isopach) Grid</label>
                </div>
            </div>
        </div>

        <div className="space-y-3">
            <Label className="text-xs text-slate-400">Property Derivation</Label>
            <div className="p-3 bg-slate-950 rounded border border-slate-800 text-xs text-slate-400">
                <p className="mb-2">Use Velocity to estimate porosity?</p>
                <div className="flex gap-2 items-center">
                    <Button size="sm" variant="outline" className="h-6 text-[10px] border-slate-700">Configure Transform</Button>
                    <span className="text-[10px] italic">Wyllaie time-average eq.</span>
                </div>
            </div>
        </div>

        <div className="pt-4 border-t border-slate-800">
            <Button className="w-full bg-pink-600 hover:bg-pink-500 h-9 text-xs">
                <FileCode className="w-3 h-3 mr-2" /> Generate .DAT Files
            </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default CMGSimulationExporter;