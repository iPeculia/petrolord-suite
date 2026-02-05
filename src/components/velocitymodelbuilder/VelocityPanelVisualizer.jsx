import React from 'react';
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ReferenceLine } from 'recharts';
import { Card, CardContent } from '@/components/ui/card';

const VelocityPanelVisualizer = ({ data, layers }) => {
  // Mock data generation if not provided
  const plotData = data || Array.from({ length: 50 }, (_, i) => {
      const depth = i * 50;
      const vInt = 1500 + i * 15 + Math.random() * 50;
      const vAvg = 1500 + i * 10;
      const vRms = 1500 + i * 12;
      return { depth, intervalVelocity: vInt, avgVelocity: vAvg, rmsVelocity: vRms };
  });

  return (
    <Card className="bg-slate-900 border-slate-800 h-full flex flex-col">
      <CardContent className="p-0 flex-1 min-h-0">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart 
            data={plotData} 
            layout="vertical"
            margin={{ top: 20, right: 20, bottom: 20, left: 30 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
            <XAxis 
                type="number" 
                stroke="#94a3b8" 
                orientation="top"
                domain={['auto', 'auto']}
                label={{ value: 'Velocity (m/s)', position: 'insideTop', offset: -20, fill: '#94a3b8', fontSize: 10 }} 
            />
            <YAxis 
                type="number" 
                dataKey="depth" 
                reversed 
                stroke="#94a3b8"
                label={{ value: 'Depth (TVD m)', angle: -90, position: 'insideLeft', fill: '#94a3b8', fontSize: 10 }}
            />
            <Tooltip 
                contentStyle={{ backgroundColor: '#0f172a', borderColor: '#1e293b', fontSize: '12px' }}
                itemStyle={{ color: '#e2e8f0' }}
                labelStyle={{ color: '#94a3b8' }}
            />
            <Legend verticalAlign="bottom" wrapperStyle={{ fontSize: '11px' }}/>

            {/* Layer Boundaries */}
            {layers && layers.map((layer, i) => (
                <ReferenceLine 
                    key={i} 
                    y={layer.bottomDepth} 
                    stroke="#64748b" 
                    strokeDasharray="5 5" 
                    label={{ value: layer.name, position: 'insideRight', fill: '#64748b', fontSize: 9 }} 
                />
            ))}

            {/* Interval Velocity */}
            <Line 
                type="stepAfter" 
                dataKey="intervalVelocity" 
                stroke="#10b981" 
                strokeWidth={2} 
                dot={false} 
                name="Vint (Interval)" 
            />

            {/* Average Velocity */}
            <Line 
                type="monotone" 
                dataKey="avgVelocity" 
                stroke="#f59e0b" 
                strokeWidth={2} 
                dot={false} 
                name="Vavg (Average)" 
                strokeDasharray="5 5"
            />
            
            {/* RMS Velocity */}
             <Line 
                type="monotone" 
                dataKey="rmsVelocity" 
                stroke="#8b5cf6" 
                strokeWidth={1.5} 
                dot={false} 
                name="Vrms" 
            />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};

export default VelocityPanelVisualizer;