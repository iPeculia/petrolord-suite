import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Hammer, FileText } from 'lucide-react';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';

const GeomechanicsModule = () => {
  // Mock stress data
  const data = Array.from({ length: 50 }, (_, i) => {
    const depth = i * 200;
    const sv = depth * 1.0; // approx 1 psi/ft
    const pp = depth * 0.45;
    // Simple poro-elastic model for Sh
    const sh_min = pp + (0.4 / (1 - 0.4)) * (sv - pp);
    const sh_max = sh_min * 1.2;
    return { depth, sv, sh_min, sh_max, pp };
  });

  return (
    <div className="h-full p-4 bg-slate-950 text-white flex flex-col gap-4">
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-bold flex items-center gap-2">
          <Hammer className="w-5 h-5 text-orange-400" /> 1D Geomechanics
        </h2>
        <Button variant="outline" className="border-slate-700 text-slate-300">
          <FileText className="w-4 h-4 mr-2" /> Generate Report
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 flex-1">
        <Card className="bg-slate-900 border-slate-800">
          <CardHeader><CardTitle className="text-sm">Stress Profile</CardTitle></CardHeader>
          <CardContent className="h-[400px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data} layout="vertical" margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                <XAxis type="number" stroke="#94a3b8" />
                <YAxis dataKey="depth" type="number" reversed stroke="#94a3b8" />
                <Tooltip contentStyle={{ backgroundColor: '#1e293b', borderColor: '#334155' }} />
                <Area type="monotone" dataKey="sv" stackId="1" stroke="#64748b" fill="none" strokeWidth={2} name="Sv (Vertical)" />
                <Area type="monotone" dataKey="sh_max" stackId="2" stroke="#ef4444" fill="none" strokeWidth={2} name="Sh_max" />
                <Area type="monotone" dataKey="sh_min" stackId="3" stroke="#f97316" fill="none" strokeWidth={2} name="Sh_min" />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="bg-slate-900 border-slate-800">
          <CardHeader><CardTitle className="text-sm">Wellbore Stability</CardTitle></CardHeader>
          <CardContent className="flex flex-col items-center justify-center h-[400px] text-slate-500 space-y-4">
            <div className="w-48 h-48 rounded-full border-4 border-slate-700 flex items-center justify-center relative">
                {/* Mock Stereonet */}
                <div className="absolute inset-0 rounded-full bg-gradient-to-br from-green-900/20 to-red-900/20"></div>
                <span className="z-10 font-bold text-slate-400">Stereonet</span>
            </div>
            <p className="text-xs">Safe Mud Weight Window Visualization</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default GeomechanicsModule;