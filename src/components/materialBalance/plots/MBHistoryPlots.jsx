import React from 'react';
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ComposedChart, Bar } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { useMaterialBalance } from '@/hooks/useMaterialBalance';

const MBHistoryPlots = () => {
  const { productionHistory, pressureData } = useMaterialBalance();

  // Transform parallel arrays into array of objects for Recharts
  const historyData = React.useMemo(() => {
    if (!productionHistory.dates) return [];
    return productionHistory.dates.map((date, i) => ({
      date,
      Np: productionHistory.Np[i],
      Gp: productionHistory.Gp[i],
      Wp: productionHistory.Wp[i],
      Wc: productionHistory.Wc[i],
      Rp: productionHistory.Rp[i],
    })).sort((a, b) => new Date(a.date) - new Date(b.date));
  }, [productionHistory]);

  const pressureChartData = React.useMemo(() => {
    if (!pressureData.dates) return [];
    return pressureData.dates.map((date, i) => ({
      date,
      Pr: pressureData.Pr[i],
      Pwf: pressureData.Pwf[i]
    })).sort((a, b) => new Date(a.date) - new Date(b.date));
  }, [pressureData]);

  // Check if we have data
  if (historyData.length === 0 && pressureChartData.length === 0) {
    return (
      <div className="h-full flex items-center justify-center bg-slate-900 border border-slate-800 rounded-lg text-slate-500 text-sm">
        No production or pressure data available.
      </div>
    );
  }

  return (
    <Card className="bg-slate-900 border-slate-800 h-full flex flex-col">
      <CardHeader className="p-3 border-b border-slate-800 bg-slate-900/50">
        <CardTitle className="text-xs font-bold text-slate-300 uppercase">History Plots</CardTitle>
      </CardHeader>
      <CardContent className="flex-1 p-2 overflow-hidden">
        <Tabs defaultValue="production" className="h-full flex flex-col">
          <TabsList className="h-8 mb-2 bg-slate-950 border border-slate-800 self-start">
            <TabsTrigger value="production" className="text-[10px] h-6">Production</TabsTrigger>
            <TabsTrigger value="pressure" className="text-[10px] h-6">Pressure</TabsTrigger>
            <TabsTrigger value="ratios" className="text-[10px] h-6">Ratios (GOR/WC)</TabsTrigger>
          </TabsList>

          <TabsContent value="production" className="flex-1 min-h-0">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={historyData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                <XAxis dataKey="date" tick={{fill: '#94a3b8', fontSize: 10}} stroke="#475569" />
                <YAxis yAxisId="left" tick={{fill: '#94a3b8', fontSize: 10}} stroke="#475569" label={{ value: 'Np/Wp (STB)', angle: -90, position: 'insideLeft', fill: '#94a3b8', fontSize: 10 }} />
                <YAxis yAxisId="right" orientation="right" tick={{fill: '#94a3b8', fontSize: 10}} stroke="#475569" label={{ value: 'Gp (SCF)', angle: 90, position: 'insideRight', fill: '#94a3b8', fontSize: 10 }} />
                <Tooltip contentStyle={{backgroundColor: '#0f172a', borderColor: '#1e293b', color: '#f1f5f9'}} />
                <Legend verticalAlign="top" height={36} iconSize={8} />
                <Line yAxisId="left" type="monotone" dataKey="Np" stroke="#22c55e" dot={false} strokeWidth={2} />
                <Line yAxisId="left" type="monotone" dataKey="Wp" stroke="#3b82f6" dot={false} strokeWidth={2} />
                <Line yAxisId="right" type="monotone" dataKey="Gp" stroke="#ef4444" dot={false} strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </TabsContent>

          <TabsContent value="pressure" className="flex-1 min-h-0">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={pressureChartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                <XAxis dataKey="date" tick={{fill: '#94a3b8', fontSize: 10}} stroke="#475569" />
                <YAxis tick={{fill: '#94a3b8', fontSize: 10}} stroke="#475569" label={{ value: 'Pressure (psia)', angle: -90, position: 'insideLeft', fill: '#94a3b8', fontSize: 10 }} domain={['auto', 'auto']} />
                <Tooltip contentStyle={{backgroundColor: '#0f172a', borderColor: '#1e293b', color: '#f1f5f9'}} />
                <Legend verticalAlign="top" height={36} iconSize={8} />
                <Line type="monotone" dataKey="Pr" name="Reservoir Pres." stroke="#f59e0b" strokeWidth={2} dot={{r: 3}} />
                <Line type="monotone" dataKey="Pwf" name="Flowing Pres." stroke="#8b5cf6" strokeWidth={2} dot={{r: 3}} />
              </LineChart>
            </ResponsiveContainer>
          </TabsContent>

          <TabsContent value="ratios" className="flex-1 min-h-0">
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart data={historyData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                <XAxis dataKey="date" tick={{fill: '#94a3b8', fontSize: 10}} stroke="#475569" />
                <YAxis yAxisId="left" tick={{fill: '#94a3b8', fontSize: 10}} stroke="#475569" label={{ value: 'GOR (scf/stb)', angle: -90, position: 'insideLeft', fill: '#94a3b8', fontSize: 10 }} />
                <YAxis yAxisId="right" orientation="right" tick={{fill: '#94a3b8', fontSize: 10}} stroke="#475569" unit="%" />
                <Tooltip contentStyle={{backgroundColor: '#0f172a', borderColor: '#1e293b', color: '#f1f5f9'}} />
                <Legend verticalAlign="top" height={36} iconSize={8} />
                <Line yAxisId="left" type="monotone" dataKey="Rp" name="GOR" stroke="#ef4444" dot={false} strokeWidth={2} />
                <Bar yAxisId="right" dataKey="Wc" name="Water Cut" fill="#3b82f6" opacity={0.5} />
              </ComposedChart>
            </ResponsiveContainer>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default MBHistoryPlots;