import React from 'react';
import { ResponsiveContainer, ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const ResidualVsOffsetPlot = () => {
  // Mock data - Res vs Offset
  const data = Array.from({ length: 50 }, (_, i) => ({
    offset: i * 100 + Math.random() * 50,
    residual: (Math.random() - 0.5) * 15 + (i * 0.2), // Slight drift with offset
  }));

  return (
    <Card className="bg-slate-900 border-slate-800 h-full flex flex-col">
      <CardHeader className="py-3 border-b border-slate-800">
        <CardTitle className="text-sm font-medium text-slate-200">Residuals vs. Offset (VSP/Checkshot)</CardTitle>
      </CardHeader>
      <CardContent className="flex-1 p-4 min-h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
            <XAxis 
              type="number" 
              dataKey="offset" 
              name="Offset" 
              unit="m" 
              stroke="#94a3b8" 
              tick={{fontSize: 11}}
              label={{ value: 'Offset (m)', position: 'bottom', fill: '#94a3b8', fontSize: 12 }} 
            />
            <YAxis 
              type="number" 
              dataKey="residual" 
              name="Residual" 
              unit="ms" 
              stroke="#94a3b8" 
              tick={{fontSize: 11}}
              label={{ value: 'Time Residual (ms)', angle: -90, position: 'insideLeft', fill: '#94a3b8', fontSize: 12 }}
            />
            <Tooltip 
              cursor={{ strokeDasharray: '3 3' }} 
              contentStyle={{ backgroundColor: '#1e293b', borderColor: '#334155', color: '#f8fafc' }}
            />
            <Scatter name="VSP Shots" data={data} fill="#8b5cf6" />
          </ScatterChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};

export default ResidualVsOffsetPlot;