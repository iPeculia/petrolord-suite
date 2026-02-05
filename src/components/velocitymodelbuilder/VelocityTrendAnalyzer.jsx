import React from 'react';
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import { Card, CardContent } from '@/components/ui/card';

const VelocityTrendAnalyzer = () => {
  // Mock velocity vs depth data for multiple wells
  const data = Array.from({ length: 50 }, (_, i) => {
    const depth = i * 100;
    return {
      depth,
      well1: 1500 + 0.6 * depth + Math.random() * 50,
      well2: 1520 + 0.58 * depth + Math.random() * 50,
      well3: 1480 + 0.65 * depth + Math.random() * 50, // Faster
      trend: 1500 + 0.6 * depth
    };
  });

  return (
    <div className="h-full w-full flex flex-col">
      <div className="mb-4 flex justify-between items-center">
        <h3 className="text-sm font-bold text-slate-300">Regional Velocity Trends</h3>
        <div className="text-xs text-slate-500">Vavg vs Depth (TVDss)</div>
      </div>
      <Card className="bg-slate-900 border-slate-800 flex-1 min-h-[300px]">
        <CardContent className="p-4 h-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
              <XAxis 
                type="number" 
                dataKey="depth" 
                stroke="#94a3b8" 
                tick={{fontSize: 11}}
                label={{ value: 'Depth (m)', position: 'bottom', fill: '#94a3b8', fontSize: 12 }} 
              />
              <YAxis 
                stroke="#94a3b8" 
                tick={{fontSize: 11}} 
                domain={[1500, 'auto']}
                label={{ value: 'Velocity (m/s)', angle: -90, position: 'insideLeft', fill: '#94a3b8', fontSize: 12 }}
              />
              <Tooltip contentStyle={{ backgroundColor: '#1e293b', borderColor: '#334155', color: '#f8fafc' }} />
              <Legend />
              <Line type="monotone" dataKey="well1" stroke="#3b82f6" dot={false} name="Well-04" strokeWidth={2} />
              <Line type="monotone" dataKey="well2" stroke="#10b981" dot={false} name="Well-09" strokeWidth={2} />
              <Line type="monotone" dataKey="well3" stroke="#ef4444" dot={false} name="Well-12 (Anomaly)" strokeWidth={2} />
              <Line type="monotone" dataKey="trend" stroke="#94a3b8" strokeDasharray="5 5" dot={false} name="Regional Trend" strokeWidth={1} />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
};

export default VelocityTrendAnalyzer;