import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Sliders, Play, Pause, RefreshCcw } from 'lucide-react';
import { Slider } from '@/components/ui/slider';
import { Label } from '@/components/ui/label';

const ParameterOptimizationEngine = () => {
  return (
    <Card className="bg-slate-900 border-slate-800 h-full">
      <CardHeader className="pb-3 border-b border-slate-800">
        <CardTitle className="text-sm font-medium text-slate-200 flex items-center gap-2">
          <Sliders className="w-4 h-4 text-purple-400" /> Auto-Optimization
        </CardTitle>
      </CardHeader>
      <CardContent className="p-4 space-y-6">
        <div className="space-y-4">
            <div className="space-y-2">
                <Label className="text-xs text-slate-400">Max Iterations</Label>
                <Slider defaultValue={[500]} max={1000} step={10} className="py-1" />
                <div className="flex justify-between text-[10px] text-slate-500">
                    <span>100</span>
                    <span>1000</span>
                </div>
            </div>
            <div className="space-y-2">
                <Label className="text-xs text-slate-400">Convergence Tolerance</Label>
                <Slider defaultValue={[0.01]} max={0.1} step={0.001} className="py-1" />
                <div className="flex justify-between text-[10px] text-slate-500">
                    <span>Tight (0.001)</span>
                    <span>Loose (0.1)</span>
                </div>
            </div>
        </div>

        <div className="bg-slate-950 p-3 rounded border border-slate-800">
            <div className="flex justify-between items-center mb-2">
                <span className="text-xs text-slate-400">Current Misfit</span>
                <span className="text-sm font-mono text-red-400">45.2m</span>
            </div>
            <div className="flex justify-between items-center">
                <span className="text-xs text-slate-400">Target Misfit</span>
                <span className="text-sm font-mono text-emerald-400">&lt; 10.0m</span>
            </div>
        </div>

        <div className="grid grid-cols-2 gap-2">
            <Button className="bg-purple-600 hover:bg-purple-500 h-8 text-xs">
                <Play className="w-3 h-3 mr-2" /> Start Optimize
            </Button>
            <Button variant="outline" className="border-slate-700 h-8 text-xs text-slate-300">
                <RefreshCcw className="w-3 h-3 mr-2" /> Reset
            </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default ParameterOptimizationEngine;