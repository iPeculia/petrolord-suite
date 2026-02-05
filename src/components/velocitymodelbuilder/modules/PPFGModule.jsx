import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Download, Save, Activity } from 'lucide-react';
import { DataExchange } from '@/services/DataExchange';

const PPFGModule = () => {
  const [inputs, setInputs] = useState({
    waterDepth: 100,
    airGap: 25,
    porePressureGradient: 0.465, // psi/ft normal
    fractureGradientLimit: 0.8 // psi/ft
  });

  const [data, setData] = useState([]);

  useEffect(() => {
    calculateProfile();
  }, [inputs]);

  const calculateProfile = () => {
    // Mock calculation logic for Pore Pressure and Fracture Gradient
    const newData = [];
    let currentDepth = 0;
    const maxDepth = 10000;
    const step = 100;

    for (let d = 0; d <= maxDepth; d += step) {
      // Hydrostatic
      const hydro = d * 0.433; // psi
      
      // Overburden (Lithostatic) - simplified
      // 0.433 in water, approx 1.0 in rock
      let overburden = 0;
      if (d <= inputs.waterDepth) {
        overburden = d * 0.44;
      } else {
        const rockColumn = d - inputs.waterDepth;
        overburden = (inputs.waterDepth * 0.44) + (rockColumn * 1.0); 
      }

      // Pore Pressure (Normal + simple ramp for overpressure scenario)
      let pp = d * inputs.porePressureGradient;
      if (d > 5000) {
        pp += (d - 5000) * 0.15; // Ramp up overpressure
      }

      // Fracture Gradient (Hubbert & Willis approx)
      const fg = (overburden - pp) / 3 + pp; // Simplified 1/3 relationship

      newData.push({
        depth: d,
        hydrostatic: hydro,
        overburden: overburden,
        porePressure: pp,
        fractureGradient: fg
      });
    }
    setData(newData);
  };

  const handleExport = () => {
    DataExchange.exportToPetroLordJSON(data, 'ppfg_profile');
  };

  return (
    <div className="h-full flex flex-col gap-4 p-4 bg-slate-950 text-white">
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-bold flex items-center gap-2">
          <Activity className="w-5 h-5 text-blue-400" /> Pore Pressure & Fracture Gradient
        </h2>
        <Button size="sm" onClick={handleExport} className="bg-blue-600 hover:bg-blue-700">
          <Download className="w-4 h-4 mr-2" /> Export Profile
        </Button>
      </div>

      <div className="grid grid-cols-12 gap-4 flex-1 min-h-0">
        {/* Inputs */}
        <Card className="col-span-3 bg-slate-900 border-slate-800">
          <CardHeader>
            <CardTitle className="text-sm">Parameters</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label className="text-xs">Water Depth (ft)</Label>
              <Input 
                type="number" 
                value={inputs.waterDepth} 
                onChange={(e) => setInputs({...inputs, waterDepth: parseFloat(e.target.value)})}
                className="bg-slate-950 border-slate-700"
              />
            </div>
            <div className="space-y-2">
              <Label className="text-xs">Normal PP Grad (psi/ft)</Label>
              <Input 
                type="number" 
                value={inputs.porePressureGradient} 
                onChange={(e) => setInputs({...inputs, porePressureGradient: parseFloat(e.target.value)})}
                className="bg-slate-950 border-slate-700"
              />
            </div>
            <Button className="w-full mt-4" onClick={calculateProfile}>Recalculate</Button>
          </CardContent>
        </Card>

        {/* Visualization */}
        <Card className="col-span-9 bg-slate-900 border-slate-800 flex flex-col">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">Pressure Profile</CardTitle>
          </CardHeader>
          <CardContent className="flex-1 min-h-0">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={data} layout="vertical" margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                <XAxis type="number" domain={['auto', 'auto']} label={{ value: 'Pressure (psi)', position: 'top', fill: '#94a3b8' }} stroke="#94a3b8" />
                <YAxis dataKey="depth" type="number" reversed label={{ value: 'Depth (ft)', angle: -90, position: 'left', fill: '#94a3b8' }} stroke="#94a3b8" />
                <Tooltip contentStyle={{ backgroundColor: '#1e293b', borderColor: '#334155' }} />
                <Legend />
                <Line type="monotone" dataKey="hydrostatic" stroke="#3b82f6" name="Hydrostatic" dot={false} />
                <Line type="monotone" dataKey="porePressure" stroke="#eab308" name="Pore Pressure" dot={false} strokeWidth={2} />
                <Line type="monotone" dataKey="fractureGradient" stroke="#ef4444" name="Fracture Gradient" dot={false} strokeWidth={2} />
                <Line type="monotone" dataKey="overburden" stroke="#64748b" name="Overburden" dot={false} strokeDasharray="5 5" />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default PPFGModule;