import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Database, Download } from 'lucide-react';

const KingdomExporter = () => {
  return (
    <Card className="bg-slate-900 border-slate-800 h-full">
      <CardHeader className="pb-3 border-b border-slate-800">
        <CardTitle className="text-sm font-medium text-slate-200 flex items-center gap-2">
          <Database className="w-4 h-4 text-amber-400" /> Kingdom Suite Export
        </CardTitle>
      </CardHeader>
      <CardContent className="p-4 space-y-6">
         <div className="space-y-4">
            <div className="space-y-2">
              <Label className="text-xs text-slate-400">Export Format</Label>
              <Select defaultValue="tdchart">
                <SelectTrigger className="h-8 bg-slate-950 border-slate-700 text-xs">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="tdchart">T-D Charts (.txt)</SelectItem>
                  <SelectItem value="grid">Velocity Grid (.grd)</SelectItem>
                  <SelectItem value="model">Dynamic Depth Model</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="bg-slate-950 p-3 rounded border border-slate-800 space-y-2">
                <Label className="text-xs font-bold text-slate-300">Kingdom Specifics</Label>
                <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                        <Checkbox id="k-1" defaultChecked />
                        <label htmlFor="k-1" className="text-xs text-slate-400">Use Shared T-D Chart Format</label>
                    </div>
                    <div className="flex items-center space-x-2">
                        <Checkbox id="k-2" defaultChecked />
                        <label htmlFor="k-2" className="text-xs text-slate-400">Include Datum Information</label>
                    </div>
                </div>
            </div>
         </div>

         <div className="space-y-2">
            <Label className="text-xs text-slate-400">Coordinate System</Label>
            <div className="p-2 bg-slate-950 border border-slate-800 rounded text-xs text-slate-300 flex justify-between">
                <span>Project CRS</span>
                <span className="font-mono text-amber-400">EPSG: 32631 (UTM 31N)</span>
            </div>
         </div>

         <div className="pt-2 border-t border-slate-800">
            <Button className="w-full bg-amber-600 hover:bg-amber-500 h-9 text-xs">
                <Download className="w-3 h-3 mr-2" /> Generate Kingdom Files
            </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default KingdomExporter;