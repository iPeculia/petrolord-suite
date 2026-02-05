import React from 'react';
import { ResponsiveContainer, ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ReferenceLine } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Download } from 'lucide-react';
import { useMaterialBalance } from '@/hooks/useMaterialBalance';

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div className="bg-slate-900 border border-slate-700 p-2 rounded shadow-xl text-xs">
        <p className="font-bold text-slate-300 mb-1">{data.date}</p>
        {payload.map((entry, index) => (
          <p key={index} style={{ color: entry.color }}>
            {entry.name}: {Number(entry.value).toFixed(4)}
          </p>
        ))}
        <p className="text-slate-500 mt-1">P: {data.P} psia</p>
      </div>
    );
  }
  return null;
};

const MBDiagnosticPlots = () => {
  const { diagnosticData, selectedDriveType, regressionResults } = useMaterialBalance();

  if (!diagnosticData || diagnosticData.length === 0) {
    return (
      <div className="h-full flex items-center justify-center bg-slate-900 border border-slate-800 rounded-lg text-slate-500 text-sm">
        Calculations pending... Check Data inputs.
      </div>
    );
  }

  // Determine active tab based on drive type logic or user selection
  // We will show all relevant tabs but default to the one matching drive type
  
  const renderScatter = (xKey, yKey, xLabel, yLabel, regression) => {
    // Generate regression line points
    const lineData = [
        { [xKey]: Math.min(...diagnosticData.map(d => d[xKey])), [yKey]: regression.intercept + regression.slope * Math.min(...diagnosticData.map(d => d[xKey])) },
        { [xKey]: Math.max(...diagnosticData.map(d => d[xKey])), [yKey]: regression.intercept + regression.slope * Math.max(...diagnosticData.map(d => d[xKey])) }
    ];

    return (
      <div className="h-full w-full relative">
        <div className="absolute top-2 right-10 bg-slate-900/80 p-2 rounded border border-slate-700 text-[10px] z-10">
            <div className="text-slate-400">Regression Fit</div>
            <div className="font-mono text-green-400">R² = {regression.r2.toFixed(4)}</div>
            <div className="font-mono text-blue-400">y = {regression.slope.toFixed(4)}x + {regression.intercept.toFixed(2)}</div>
        </div>
        <ResponsiveContainer width="100%" height="100%">
          <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
            <XAxis type="number" dataKey={xKey} name={xLabel} unit="" stroke="#94a3b8" fontSize={10} tickFormatter={(val) => val.toFixed(2)} label={{ value: xLabel, position: 'bottom', offset: 0, fill: '#94a3b8', fontSize: 10 }} />
            <YAxis type="number" dataKey={yKey} name={yLabel} unit="" stroke="#94a3b8" fontSize={10} label={{ value: yLabel, angle: -90, position: 'insideLeft', fill: '#94a3b8', fontSize: 10 }} />
            <Tooltip content={<CustomTooltip />} cursor={{ strokeDasharray: '3 3' }} />
            <Legend verticalAlign="top" height={36} />
            <Scatter name="Data Points" data={diagnosticData} fill="#3b82f6" shape="circle" />
            <Scatter name="Trend" data={lineData} line={{ stroke: '#22c55e', strokeWidth: 2 }} shape={() => null} legendType="line" />
          </ScatterChart>
        </ResponsiveContainer>
      </div>
    );
  };

  return (
    <Card className="bg-slate-900 border-slate-800 h-full flex flex-col">
      <CardHeader className="p-3 border-b border-slate-800 bg-slate-900/50 flex flex-row justify-between items-center">
        <CardTitle className="text-xs font-bold text-slate-300 uppercase">Havlena-Odeh Diagnostics</CardTitle>
        <Button variant="ghost" size="icon" className="h-6 w-6 text-slate-400">
            <Download className="w-3.5 h-3.5" />
        </Button>
      </CardHeader>
      <CardContent className="flex-1 p-2 overflow-hidden">
        <Tabs defaultValue={selectedDriveType === 'gas' ? 'gas' : 'volumetric'} className="h-full flex flex-col">
          <TabsList className="h-8 mb-2 bg-slate-950 border border-slate-800 self-start max-w-full flex-wrap">
            <TabsTrigger value="volumetric" className="text-[10px] h-6">F vs Eo (Volumetric)</TabsTrigger>
            <TabsTrigger value="gascap" className="text-[10px] h-6">Gas Cap (F/Eo vs Eg/Eo)</TabsTrigger>
            <TabsTrigger value="water" className="text-[10px] h-6">Water Drive (F vs Ew)</TabsTrigger>
            <TabsTrigger value="solution" className="text-[10px] h-6">Solution Gas (F vs Eo+Eg)</TabsTrigger>
            <TabsTrigger value="gas" className="text-[10px] h-6">Gas (p/z)</TabsTrigger>
          </TabsList>

          <TabsContent value="volumetric" className="flex-1 min-h-0">
            {renderScatter('Eo', 'F', 'Expansion (Eo) [RB/STB]', 'Withdrawal (F) [RB]', regressionResults.volumetric || {slope:0, intercept:0, r2:0})}
          </TabsContent>
          
          <TabsContent value="gascap" className="flex-1 min-h-0">
            {renderScatter('Eg_over_Eo', 'F_over_Eo', 'Eg / Eo', 'F / Eo', regressionResults.gascap || {slope:0, intercept:0, r2:0})}
          </TabsContent>

          <TabsContent value="water" className="flex-1 min-h-0">
             {renderScatter('Efw', 'F', 'Formation Exp (Efw)', 'Withdrawal (F)', regressionResults.water || {slope:0, intercept:0, r2:0})}
          </TabsContent>

          <TabsContent value="solution" className="flex-1 min-h-0">
             {renderScatter('Et', 'F', 'Total Exp (Eo + Eg + Efw)', 'Withdrawal (F)', regressionResults.solution || {slope:0, intercept:0, r2:0})}
          </TabsContent>

          <TabsContent value="gas" className="flex-1 min-h-0">
             {renderScatter('Gp', 'P_over_Z', 'Cumulative Gas (Gp)', 'p/z', regressionResults.gas || {slope:0, intercept:0, r2:0})}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default MBDiagnosticPlots;