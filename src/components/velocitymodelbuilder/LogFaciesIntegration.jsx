import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Palette } from 'lucide-react';

const LogFaciesIntegration = () => {
  const facies = [
      { name: 'Sandstone', color: 'bg-yellow-500', velocity: 'High (3500-4500 m/s)' },
      { name: 'Shale', color: 'bg-gray-500', velocity: 'Medium (2500-3200 m/s)' },
      { name: 'Carbonate', color: 'bg-blue-500', velocity: 'Very High (5000+ m/s)' },
      { name: 'Coal', color: 'bg-black', velocity: 'Low (2000-2400 m/s)' }
  ];

  return (
    <Card className="bg-slate-900 border-slate-800">
      <CardHeader className="pb-2 border-b border-slate-800">
        <CardTitle className="text-sm font-medium flex items-center gap-2 text-violet-400">
            <Palette className="w-4 h-4" /> Log Facies Integration
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <div className="divide-y divide-slate-800">
            {facies.map((f, i) => (
                <div key={i} className="flex items-center justify-between p-3 hover:bg-slate-800/50">
                    <div className="flex items-center gap-3">
                        <div className={`w-3 h-3 rounded-sm ${f.color}`}></div>
                        <span className="text-xs font-medium text-slate-200">{f.name}</span>
                    </div>
                    <span className="text-[10px] text-slate-500">{f.velocity}</span>
                </div>
            ))}
        </div>
        <div className="p-3 text-center">
            <Badge variant="outline" className="cursor-pointer hover:bg-slate-800 border-dashed border-slate-600 text-slate-400">
                + Import from Facies Analysis
            </Badge>
        </div>
      </CardContent>
    </Card>
  );
};

export default LogFaciesIntegration;