import React from 'react';
import { Zap, Cpu, Database, RefreshCw } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';

const PerformanceOptimization = () => {
  return (
    <Card className="bg-slate-900 border-slate-800">
      <CardHeader className="pb-3 border-b border-slate-800">
        <CardTitle className="text-sm font-medium flex items-center gap-2 text-amber-400">
          <Zap className="w-4 h-4"/> Performance Engine
        </CardTitle>
      </CardHeader>
      <CardContent className="p-4 space-y-6">
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                    <Label className="text-sm text-slate-200 flex items-center gap-2"><Cpu className="w-3 h-3 text-blue-400"/> GPU Acceleration</Label>
                    <p className="text-xs text-slate-500">Offload heavy grid operations to WebGL/WebGPU</p>
                </div>
                <Switch checked={true} />
            </div>
            <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                    <Label className="text-sm text-slate-200 flex items-center gap-2"><Database className="w-3 h-3 text-emerald-400"/> Intelligent Caching</Label>
                    <p className="text-xs text-slate-500">Cache intermediate horizon conversions locally</p>
                </div>
                <Switch checked={true} />
            </div>
            <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                    <Label className="text-sm text-slate-200 flex items-center gap-2"><RefreshCw className="w-3 h-3 text-purple-400"/> Background Workers</Label>
                    <p className="text-xs text-slate-500">Use Web Workers for non-blocking UI during calc</p>
                </div>
                <Switch checked={true} />
            </div>
        </div>

        <div className="p-3 bg-slate-950 rounded border border-slate-800 space-y-3">
            <h4 className="text-xs font-bold text-slate-400 uppercase">System Status</h4>
            <div className="space-y-1">
                <div className="flex justify-between text-[10px] text-slate-500">
                    <span>Memory Usage</span>
                    <span>245 MB / 4096 MB</span>
                </div>
                <Progress value={6} className="h-1 bg-slate-800" indicatorClassName="bg-emerald-500" />
            </div>
            <div className="space-y-1">
                <div className="flex justify-between text-[10px] text-slate-500">
                    <span>Last Calc Time</span>
                    <span className="text-emerald-400 font-mono">42ms</span>
                </div>
            </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default PerformanceOptimization;