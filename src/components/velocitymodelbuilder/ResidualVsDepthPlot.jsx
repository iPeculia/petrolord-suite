import React from 'react';
import { ResponsiveContainer, ScatterChart, Scatter, XAxis, YAxis, ZAxis, CartesianGrid, Tooltip, Legend, ReferenceLine } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const ResidualVsDepthPlot = () => {
  // Mock data - Res vs Depth
  const data = Array.from({ length: 100 }, (_, i) => ({
    depth: 500 + i * 30 + Math.random() * 50,
    residual: (Math.random() - 0.5) * 20 + (i > 50 ? 10 : 0), // Introduce a bias deeper
    layer: i < 30 ? 'Overburden' : i < 70 ? 'Target' : 'Basement'
  }));

  return (
    <Card className="bg-slate-900 border-slate-800 h-full flex flex-col">
      <CardHeader className="py-3 border-b border-slate-800">
        <CardTitle className="text-sm font-medium text-slate-200">Residuals vs. Depth Analysis</CardTitle>
      </CardHeader>
      <CardContent className="flex-1 p-4 min-h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
            <XAxis 
              type="number" 
              dataKey="residual" 
              name="Residual" 
              unit="m" 
              stroke="#94a3b8" 
              tick={{fontSize: 11}}
              label={{ value: 'Residual (m)', position: 'bottom', fill: '#94a3b8', fontSize: 12 }} 
            />
            <YAxis 
              type="number" 
              dataKey="depth" 
              name="Depth" 
              unit="m" 
              stroke="#94a3b8" 
              reversed={true} 
              tick={{fontSize: 11}}
              label={{ value: 'Depth (TVDss)', angle: -90, position: 'insideLeft', fill: '#94a3b8', fontSize: 12 }}
            />
            <ZAxis type="category" dataKey="layer" name="Layer" />
            <Tooltip 
              cursor={{ strokeDasharray: '3 3' }} 
              contentStyle={{ backgroundColor: '#1e293b', borderColor: '#334155', color: '#f8fafc' }}
            />
            <ReferenceLine x={0} stroke="#ef4444" strokeWidth={2} />
            <Legend verticalAlign="top" height={36} />
            <Scatter name="Overburden" data={data.filter(d => d.layer === 'Overburden')} fill="#3b82f6" shape="circle" />
            <Scatter name="Target Reservoir" data={data.filter(d => d.layer === 'Target')} fill="#10b981" shape="triangle" />
            <Scatter name="Basement" data={data.filter(d => d.layer === 'Basement')} fill="#f59e0b" shape="square" />
          </ScatterChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};

export default ResidualVsDepthPlot;