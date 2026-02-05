import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowRightLeft, ArrowRight } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const VersionComparisonViewer = () => {
  return (
    <Card className="bg-slate-900 border-slate-800 h-full">
      <CardHeader className="pb-3 border-b border-slate-800">
        <CardTitle className="text-sm font-medium text-slate-200 flex items-center gap-2">
          <ArrowRightLeft className="w-4 h-4 text-blue-400" /> Diff Viewer
        </CardTitle>
      </CardHeader>
      <CardContent className="p-4 space-y-4">
        <div className="flex items-center gap-2">
            <Select defaultValue="v2.1">
                <SelectTrigger className="h-7 text-xs bg-slate-950 border-slate-700 w-24"><SelectValue/></SelectTrigger>
                <SelectContent><SelectItem value="v2.1">v2.1</SelectItem></SelectContent>
            </Select>
            <ArrowRight className="w-3 h-3 text-slate-500" />
            <Select defaultValue="v2.0">
                <SelectTrigger className="h-7 text-xs bg-slate-950 border-slate-700 w-24"><SelectValue/></SelectTrigger>
                <SelectContent><SelectItem value="v2.0">v2.0</SelectItem></SelectContent>
            </Select>
        </div>

        <div className="space-y-2">
            <div className="p-2 bg-slate-950 border border-slate-800 rounded text-xs">
                <div className="flex justify-between font-bold text-slate-300 mb-1">
                    <span>Layer 3 V0 Parameter</span>
                </div>
                <div className="flex items-center justify-between">
                    <span className="text-red-400 line-through">2400 m/s</span>
                    <ArrowRight className="w-3 h-3 text-slate-600" />
                    <span className="text-emerald-400 font-bold">2450 m/s</span>
                </div>
            </div>
            <div className="p-2 bg-slate-950 border border-slate-800 rounded text-xs">
                <div className="flex justify-between font-bold text-slate-300 mb-1">
                    <span>Well Count</span>
                </div>
                <div className="flex items-center justify-between">
                    <span className="text-red-400 line-through">15</span>
                    <ArrowRight className="w-3 h-3 text-slate-600" />
                    <span className="text-emerald-400 font-bold">18 (+3)</span>
                </div>
            </div>
        </div>
        
        <div className="text-[10px] text-slate-500 text-center pt-2">
            Showing 2 changes between selected versions.
        </div>
      </CardContent>
    </Card>
  );
};

export default VersionComparisonViewer;