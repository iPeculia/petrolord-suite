import React from 'react';
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { useMaterialBalance } from '@/hooks/useMaterialBalance';

const PVTPlots = () => {
  const { pvtData } = useMaterialBalance();

  const chartData = React.useMemo(() => {
    if (!pvtData.pressure) return [];
    return pvtData.pressure.map((p, i) => ({
      pressure: p,
      Bo: pvtData.Bo[i],
      Bg: pvtData.Bg[i],
      Rs: pvtData.Rs[i],
      mu_o: pvtData.mu_o[i],
      mu_g: pvtData.mu_g[i]
    })).sort((a, b) => a.pressure - b.pressure); // Sort by pressure for PVT
  }, [pvtData]);

  if (chartData.length === 0) {
    return (
      <div className="h-full flex items-center justify-center bg-slate-900 border border-slate-800 rounded-lg text-slate-500 text-sm">
        No PVT data available.
      </div>
    );
  }

  return (
    <Card className="bg-slate-900 border-slate-800 h-full flex flex-col">
      <CardHeader className="p-3 border-b border-slate-800 bg-slate-900/50">
        <CardTitle className="text-xs font-bold text-slate-300 uppercase">PVT Plots</CardTitle>
      </CardHeader>
      <CardContent className="flex-1 p-2 overflow-hidden">
        <Tabs defaultValue="fvf" className="h-full flex flex-col">
          <TabsList className="h-8 mb-2 bg-slate-950 border border-slate-800 self-start">
            <TabsTrigger value="fvf" className="text-[10px] h-6">FVF (Bo/Bg)</TabsTrigger>
            <TabsTrigger value="rs" className="text-[10px] h-6">Solution Gas (Rs)</TabsTrigger>
            <TabsTrigger value="visc" className="text-[10px] h-6">Viscosity</TabsTrigger>
          </TabsList>

          <TabsContent value="fvf" className="flex-1 min-h-0">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                <XAxis dataKey="pressure" type="number" domain={['auto', 'auto']} tick={{fill: '#94a3b8', fontSize: 10}} stroke="#475569" label={{ value: 'Pressure (psia)', position: 'bottom', fill: '#94a3b8', fontSize: 10, offset: 0 }} />
                <YAxis yAxisId="left" tick={{fill: '#94a3b8', fontSize: 10}} stroke="#475569" label={{ value: 'Bo (RB/STB)', angle: -90, position: 'insideLeft', fill: '#94a3b8', fontSize: 10 }} />
                <YAxis yAxisId="right" orientation="right" tick={{fill: '#94a3b8', fontSize: 10}} stroke="#475569" label={{ value: 'Bg (RB/SCF)', angle: 90, position: 'insideRight', fill: '#94a3b8', fontSize: 10 }} />
                <Tooltip contentStyle={{backgroundColor: '#0f172a', borderColor: '#1e293b', color: '#f1f5f9'}} />
                <Legend verticalAlign="top" height={36} iconSize={8} />
                <Line yAxisId="left" type="monotone" dataKey="Bo" stroke="#22c55e" dot={{r: 2}} strokeWidth={2} />
                <Line yAxisId="right" type="monotone" dataKey="Bg" stroke="#ef4444" dot={{r: 2}} strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </TabsContent>

          <TabsContent value="rs" className="flex-1 min-h-0">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                <XAxis dataKey="pressure" type="number" domain={['auto', 'auto']} tick={{fill: '#94a3b8', fontSize: 10}} stroke="#475569" />
                <YAxis tick={{fill: '#94a3b8', fontSize: 10}} stroke="#475569" label={{ value: 'Rs (scf/stb)', angle: -90, position: 'insideLeft', fill: '#94a3b8', fontSize: 10 }} />
                <Tooltip contentStyle={{backgroundColor: '#0f172a', borderColor: '#1e293b', color: '#f1f5f9'}} />
                <Line type="monotone" dataKey="Rs" stroke="#3b82f6" dot={{r: 2}} strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </TabsContent>

          <TabsContent value="visc" className="flex-1 min-h-0">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                <XAxis dataKey="pressure" type="number" domain={['auto', 'auto']} tick={{fill: '#94a3b8', fontSize: 10}} stroke="#475569" />
                <YAxis tick={{fill: '#94a3b8', fontSize: 10}} stroke="#475569" label={{ value: 'Viscosity (cp)', angle: -90, position: 'insideLeft', fill: '#94a3b8', fontSize: 10 }} />
                <Tooltip contentStyle={{backgroundColor: '#0f172a', borderColor: '#1e293b', color: '#f1f5f9'}} />
                <Legend verticalAlign="top" height={36} iconSize={8} />
                <Line type="monotone" dataKey="mu_o" name="Oil Visc" stroke="#f59e0b" dot={{r: 2}} strokeWidth={2} />
                <Line type="monotone" dataKey="mu_g" name="Gas Visc" stroke="#8b5cf6" dot={{r: 2}} strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default PVTPlots;