import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Layers, UploadCloud, History } from 'lucide-react';

const EarthModelStudioExporter = () => {
  return (
    <Card className="bg-slate-900 border-slate-800 h-full">
      <CardHeader className="pb-3 border-b border-slate-800">
        <CardTitle className="text-sm font-medium text-slate-200 flex items-center gap-2">
            <Layers className="w-4 h-4 text-blue-400" /> EarthModel Studio Export
        </CardTitle>
      </CardHeader>
      <CardContent className="p-4 space-y-6">
        <div className="space-y-3">
            <h4 className="text-xs font-semibold text-slate-400 uppercase">Select Horizons to Export</h4>
            <div className="space-y-2 bg-slate-950 p-2 rounded border border-slate-800">
                {['Top Reservoir (Depth)', 'Base Reservoir (Depth)', 'Top Basement (Depth)'].map((h, i) => (
                    <div key={i} className="flex items-center space-x-2">
                        <Checkbox id={`h-${i}`} defaultChecked={i === 0} />
                        <label htmlFor={`h-${i}`} className="text-xs text-slate-300 cursor-pointer select-none">{h}</label>
                    </div>
                ))}
            </div>
        </div>

        <div className="space-y-3">
             <h4 className="text-xs font-semibold text-slate-400 uppercase">Export Settings</h4>
             <div className="grid grid-cols-1 gap-3">
                <Select defaultValue="project-a">
                    <SelectTrigger className="h-8 text-xs bg-slate-950 border-slate-700">
                        <SelectValue placeholder="Target Project" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="project-a">Field Development A</SelectItem>
                        <SelectItem value="project-b">Exploration Block B</SelectItem>
                    </SelectContent>
                </Select>
                
                <div className="flex items-center space-x-2">
                    <Checkbox id="prop-export" />
                    <label htmlFor="prop-export" className="text-xs text-slate-400">Export Interval Velocity as Property</label>
                </div>
             </div>
        </div>

        <div className="pt-4 border-t border-slate-800 space-y-3">
            <Button className="w-full bg-blue-600 hover:bg-blue-500 h-9 text-xs">
                <UploadCloud className="w-3 h-3 mr-2" /> Push to EarthModel
            </Button>
            <div className="flex items-center justify-between text-[10px] text-slate-500">
                <span className="flex items-center gap-1"><History className="w-3 h-3" /> Last export: 2 days ago</span>
                <span className="text-blue-400 cursor-pointer hover:underline">View Log</span>
            </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default EarthModelStudioExporter;