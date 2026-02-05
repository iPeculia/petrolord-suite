import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Layers, ScanLine, Wand2 } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

const SmartLayerPickingEngine = () => {
  return (
    <Card className="bg-slate-900 border-slate-800 h-full">
      <CardHeader className="pb-3 border-b border-slate-800">
        <CardTitle className="text-sm font-medium text-slate-200 flex items-center gap-2">
          <ScanLine className="w-4 h-4 text-blue-400" /> Smart Layer Picker
        </CardTitle>
      </CardHeader>
      <CardContent className="p-4 space-y-4">
        <div className="flex items-center justify-between p-3 bg-slate-950 rounded border border-slate-800">
            <div className="flex flex-col">
                <span className="text-xs text-slate-400">Analysis Target</span>
                <span className="text-sm font-bold text-white">Field-Wide Seismic Trend</span>
            </div>
            <Button size="sm" className="h-8 bg-blue-600 hover:bg-blue-500 text-xs">
                <Wand2 className="w-3 h-3 mr-2" /> Auto-Pick Boundaries
            </Button>
        </div>

        <div className="relative h-40 bg-slate-950 border border-slate-800 rounded overflow-hidden">
            {/* Mock Log Visual */}
            <svg className="w-full h-full p-2" viewBox="0 0 300 100" preserveAspectRatio="none">
                {/* Velocity Curve */}
                <path d="M10,10 Q50,20 80,15 T150,40 T220,60 T290,90" fill="none" stroke="#475569" strokeWidth="2" />
                
                {/* Auto-Picked Layers */}
                <line x1="0" y1="30" x2="300" y2="30" stroke="#3b82f6" strokeWidth="1" strokeDasharray="4 2" />
                <text x="5" y="28" fill="#3b82f6" fontSize="8">AI Pick: Top Carbonate (98%)</text>
                
                <line x1="0" y1="70" x2="300" y2="70" stroke="#10b981" strokeWidth="1" strokeDasharray="4 2" />
                <text x="5" y="68" fill="#10b981" fontSize="8">AI Pick: Base Salt (92%)</text>
            </svg>
        </div>

        <div className="space-y-2">
            <h4 className="text-xs font-bold text-slate-400">Suggested Layer Types</h4>
            <div className="grid grid-cols-2 gap-2">
                <div className="p-2 bg-slate-900 border border-slate-800 rounded flex flex-col gap-1">
                    <div className="flex justify-between items-center">
                        <span className="text-[10px] text-slate-300">Layer 1</span>
                        <Badge variant="outline" className="text-[9px] border-blue-900 text-blue-400">Linear Gradient</Badge>
                    </div>
                    <div className="h-1 w-full bg-slate-800 rounded overflow-hidden">
                        <div className="h-full bg-blue-500 w-full"></div>
                    </div>
                </div>
                <div className="p-2 bg-slate-900 border border-slate-800 rounded flex flex-col gap-1">
                    <div className="flex justify-between items-center">
                        <span className="text-[10px] text-slate-300">Layer 2</span>
                        <Badge variant="outline" className="text-[9px] border-emerald-900 text-emerald-400">Constant V</Badge>
                    </div>
                    <div className="h-1 w-full bg-slate-800 rounded overflow-hidden">
                        <div className="h-full bg-emerald-500 w-3/4"></div>
                    </div>
                </div>
            </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default SmartLayerPickingEngine;