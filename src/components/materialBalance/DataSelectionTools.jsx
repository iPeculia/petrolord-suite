import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Filter, RefreshCw, AlertTriangle } from 'lucide-react';

const DataSelectionTools = () => {
  return (
    <Card className="bg-slate-900 border-slate-800">
        <CardHeader className="p-3 border-b border-slate-800 bg-slate-900/50 flex flex-row justify-between items-center">
            <CardTitle className="text-xs font-bold text-slate-300 uppercase flex items-center gap-2">
                <Filter className="w-3 h-3 text-blue-400" /> Data Filtering
            </CardTitle>
            <Button variant="ghost" size="sm" className="h-6 text-[10px] gap-1 text-slate-400 hover:text-white">
                <RefreshCw className="w-3 h-3" /> Reset
            </Button>
        </CardHeader>
        <CardContent className="p-3 space-y-4">
            <div className="space-y-2">
                <div className="flex justify-between items-center">
                    <Label className="text-[10px] text-slate-400">Time Range</Label>
                    <span className="text-[10px] text-slate-500">All Data</span>
                </div>
                <Slider defaultValue={[0, 100]} max={100} step={1} className="py-1" />
            </div>

            <div className="flex items-center justify-between space-x-2">
                <Label htmlFor="outliers" className="text-[10px] text-slate-400">Auto-Exclude Outliers</Label>
                <Switch id="outliers" />
            </div>

            <div className="flex items-center justify-between space-x-2">
                <Label htmlFor="quality" className="text-[10px] text-slate-400 flex items-center gap-1">
                    Quality Check Filter <AlertTriangle className="w-3 h-3 text-yellow-500" />
                </Label>
                <Switch id="quality" />
            </div>
            
            <Button size="sm" className="w-full h-7 text-xs bg-slate-800 hover:bg-slate-700 border border-slate-700">
                Apply Filters & Rerun
            </Button>
        </CardContent>
    </Card>
  );
};

export default DataSelectionTools;