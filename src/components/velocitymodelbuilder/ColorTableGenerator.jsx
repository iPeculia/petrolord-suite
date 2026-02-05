import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Palette, Download } from 'lucide-react';

const ColorTableGenerator = () => {
  return (
    <Card className="bg-slate-900 border-slate-800 h-full">
      <CardHeader className="pb-3 border-b border-slate-800">
        <CardTitle className="text-sm font-medium text-slate-200 flex items-center gap-2">
          <Palette className="w-4 h-4 text-orange-400" /> Color Table Generator
        </CardTitle>
      </CardHeader>
      <CardContent className="p-4 space-y-6">
         <div className="space-y-4">
            {/* Gradient Preview */}
            <div className="space-y-2">
                <Label className="text-xs text-slate-400">Preview</Label>
                <div className="h-8 w-full rounded border border-slate-700 bg-gradient-to-r from-blue-600 via-green-500 via-yellow-400 to-red-500"></div>
                <div className="flex justify-between text-[10px] text-slate-500 font-mono">
                    <span>-2500m</span>
                    <span>-1000m</span>
                </div>
            </div>

            <div className="space-y-2">
                <Label className="text-xs text-slate-400">Preset Schemes</Label>
                <div className="grid grid-cols-3 gap-2">
                    <div className="h-6 rounded cursor-pointer border border-slate-700 bg-gradient-to-r from-blue-500 to-red-500"></div>
                    <div className="h-6 rounded cursor-pointer border border-slate-700 bg-gradient-to-r from-purple-500 to-orange-500"></div>
                    <div className="h-6 rounded cursor-pointer border border-slate-700 bg-gradient-to-r from-cyan-500 to-blue-900"></div>
                </div>
            </div>

            <div className="space-y-2">
                <Label className="text-xs text-slate-400">Contrast Adjustment</Label>
                <Slider defaultValue={[50]} max={100} step={1} className="py-2" />
            </div>
         </div>

         <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-800">
            <Button variant="outline" className="w-full h-8 text-[10px] border-slate-700">Export .CPT</Button>
            <Button variant="outline" className="w-full h-8 text-[10px] border-slate-700">Export .LUT</Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default ColorTableGenerator;