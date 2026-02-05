import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Play, Download, Trash2 } from 'lucide-react';
import TornadoChart from '../plots/TornadoChart';

const RealizationManager = () => {
  return (
    <div className="h-full grid grid-cols-1 lg:grid-cols-3 gap-4">
      <div className="lg:col-span-1 flex flex-col h-full gap-4">
        <Card className="bg-slate-900 border-slate-800">
          <CardHeader>
            <CardTitle className="text-white flex justify-between items-center">
              <span>Realizations</span>
              <Badge variant="outline" className="bg-blue-500/10 text-blue-400">50 Runs</Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Button className="w-full bg-emerald-600 hover:bg-emerald-500 mb-4">
              <Play className="w-4 h-4 mr-2" /> Run New Batch
            </Button>
            <ScrollArea className="h-[400px] pr-4">
              <div className="space-y-2">
                {Array.from({ length: 10 }).map((_, i) => (
                  <div key={i} className="p-3 bg-slate-950 rounded border border-slate-800 flex justify-between items-center group hover:border-blue-500/50 cursor-pointer transition-all">
                    <div>
                      <div className="text-sm font-medium text-slate-200">Realization_{i + 1}</div>
                      <div className="text-xs text-slate-500">STOIIP: {(120 + Math.random() * 20).toFixed(1)} MMbo</div>
                    </div>
                    <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Button size="icon" variant="ghost" className="h-6 w-6"><Download className="w-3 h-3" /></Button>
                      <Button size="icon" variant="ghost" className="h-6 w-6 hover:text-red-400"><Trash2 className="w-3 h-3" /></Button>
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </CardContent>
        </Card>
      </div>

      <div className="lg:col-span-2 flex flex-col gap-4">
        <Card className="bg-slate-900 border-slate-800 flex-1">
          <CardHeader>
            <CardTitle className="text-white">Sensitivity Analysis</CardTitle>
          </CardHeader>
          <CardContent className="h-[400px]">
            <TornadoChart />
          </CardContent>
        </Card>
        
        <div className="grid grid-cols-3 gap-4">
          <Card className="bg-slate-900 border-slate-800 p-4">
            <div className="text-xs text-slate-500 uppercase">P90 STOIIP</div>
            <div className="text-2xl font-bold text-white mt-1">105.2 <span className="text-xs font-normal text-slate-400">MMbo</span></div>
          </Card>
          <Card className="bg-slate-900 border-slate-800 p-4">
            <div className="text-xs text-slate-500 uppercase">P50 STOIIP</div>
            <div className="text-2xl font-bold text-emerald-400 mt-1">128.5 <span className="text-xs font-normal text-slate-400">MMbo</span></div>
          </Card>
          <Card className="bg-slate-900 border-slate-800 p-4">
            <div className="text-xs text-slate-500 uppercase">P10 STOIIP</div>
            <div className="text-2xl font-bold text-white mt-1">145.8 <span className="text-xs font-normal text-slate-400">MMbo</span></div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default RealizationManager;