import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { FileText, Download, Copy } from 'lucide-react';

const PetrelExporter = () => {
  const [wellCount, setWellCount] = useState(12);

  return (
    <Card className="bg-slate-900 border-slate-800 h-full">
      <CardHeader className="pb-3 border-b border-slate-800">
        <CardTitle className="text-sm font-medium text-slate-200 flex items-center gap-2">
          <FileText className="w-4 h-4 text-blue-400" /> Petrel Velocity Function Export
        </CardTitle>
      </CardHeader>
      <CardContent className="p-4 space-y-6">
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="text-xs text-slate-400">Velocity Type</Label>
              <Select defaultValue="avg">
                <SelectTrigger className="h-8 bg-slate-950 border-slate-700 text-xs">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="avg">Average Velocity (Vavg)</SelectItem>
                  <SelectItem value="int">Interval Velocity (Vint)</SelectItem>
                  <SelectItem value="rms">RMS Velocity (Vrms)</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label className="text-xs text-slate-400">Function Format</Label>
              <Select defaultValue="linear">
                <SelectTrigger className="h-8 bg-slate-950 border-slate-700 text-xs">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="linear">Linear (V0 + kZ)</SelectItem>
                  <SelectItem value="poly">Polynomial</SelectItem>
                  <SelectItem value="point">Time-Depth Pairs</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="bg-slate-950 p-3 rounded border border-slate-800 space-y-2">
             <Label className="text-xs font-bold text-slate-300">Header Options</Label>
             <div className="grid grid-cols-2 gap-2">
                <div className="flex items-center gap-2">
                    <Checkbox id="ph-1" defaultChecked />
                    <label htmlFor="ph-1" className="text-xs text-slate-400">Include Well Headers</label>
                </div>
                <div className="flex items-center gap-2">
                    <Checkbox id="ph-2" defaultChecked />
                    <label htmlFor="ph-2" className="text-xs text-slate-400">Include KB Elevation</label>
                </div>
                <div className="flex items-center gap-2">
                    <Checkbox id="ph-3" />
                    <label htmlFor="ph-3" className="text-xs text-slate-400">CRS Metadata</label>
                </div>
                <div className="flex items-center gap-2">
                    <Checkbox id="ph-4" defaultChecked />
                    <label htmlFor="ph-4" className="text-xs text-slate-400">Petrel Header Lines</label>
                </div>
             </div>
          </div>
        </div>

        <div className="space-y-2">
            <div className="flex justify-between items-center">
                <Label className="text-xs text-slate-400">Preview Output</Label>
                <Button variant="ghost" size="sm" className="h-6 text-[10px] text-blue-400"><Copy className="w-3 h-3 mr-1" /> Copy</Button>
            </div>
            <div className="bg-slate-950 p-3 rounded border border-slate-800 font-mono text-[10px] text-slate-400 h-32 overflow-y-auto">
                # Petrel Velocity Export<br/>
                # Date: 2025-11-25<br/>
                # Type: V0+kZ<br/>
                BEGIN HEADER<br/>
                Well Name, X, Y, KB, V0, k, Top_Depth<br/>
                END HEADER<br/>
                Well-01, 452100.23, 678900.11, 25.0, 1650, 0.45, 1200.0<br/>
                Well-02, 452450.11, 679100.45, 25.0, 1680, 0.42, 1250.0<br/>
                ...
            </div>
        </div>

        <div className="pt-2 border-t border-slate-800">
            <Button className="w-full bg-blue-600 hover:bg-blue-500 h-9 text-xs">
                <Download className="w-3 h-3 mr-2" /> Export {wellCount} Wells to .ASCII
            </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default PetrelExporter;