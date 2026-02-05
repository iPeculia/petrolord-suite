import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Grid3X3, FileCode } from 'lucide-react';

const EclipseSimulationExporter = () => {
  return (
    <Card className="bg-slate-900 border-slate-800 h-full">
      <CardHeader className="pb-3 border-b border-slate-800">
        <CardTitle className="text-sm font-medium text-slate-200 flex items-center gap-2">
          <Grid3X3 className="w-4 h-4 text-purple-400" /> Eclipse Reservoir Simulation
        </CardTitle>
      </CardHeader>
      <CardContent className="p-4 space-y-6">
        <div className="space-y-3">
            <Label className="text-xs text-slate-400">Export Targets</Label>
            <div className="grid grid-cols-1 gap-2 bg-slate-950 p-3 rounded border border-slate-800">
                <div className="flex items-center space-x-2">
                    <Checkbox id="ecl-1" defaultChecked />
                    <label htmlFor="ecl-1" className="text-xs text-slate-300">Corner Point Grid (.GRDECL)</label>
                </div>
                <div className="flex items-center space-x-2">
                    <Checkbox id="ecl-2" defaultChecked />
                    <label htmlFor="ecl-2" className="text-xs text-slate-300">Formation Tops (TOPS)</label>
                </div>
                <div className="flex items-center space-x-2">
                    <Checkbox id="ecl-3" />
                    <label htmlFor="ecl-3" className="text-xs text-slate-300">Property Trends (PORO/PERM)</label>
                </div>
                <div className="flex items-center space-x-2">
                    <Checkbox id="ecl-4" />
                    <label htmlFor="ecl-4" className="text-xs text-slate-300">Fault Polygons (FAULTS)</label>
                </div>
            </div>
        </div>

        <div className="space-y-2">
            <Label className="text-xs text-slate-400">Grid Compatibility</Label>
            <div className="flex gap-2 text-xs">
                <Button variant="outline" size="sm" className="flex-1 bg-slate-950 border-slate-700 text-slate-300 hover:text-white hover:bg-slate-800">E100</Button>
                <Button variant="outline" size="sm" className="flex-1 bg-slate-950 border-slate-700 text-slate-300 hover:text-white hover:bg-slate-800">E300</Button>
                <Button variant="outline" size="sm" className="flex-1 bg-slate-950 border-slate-700 text-slate-300 hover:text-white hover:bg-slate-800">FrontSim</Button>
            </div>
        </div>

        <div className="pt-4 border-t border-slate-800">
            <Button className="w-full bg-purple-600 hover:bg-purple-500 h-9 text-xs">
                <FileCode className="w-3 h-3 mr-2" /> Export Data Deck
            </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default EclipseSimulationExporter;