import React from 'react';
import { useCasingWearAnalyzer } from '../contexts/CasingWearAnalyzerContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Activity } from 'lucide-react';

const ContactForceEstimation = () => {
  const { derivedLoads } = useCasingWearAnalyzer();
  const data = derivedLoads.profileData || [];

  return (
    <Card className="bg-slate-900 border-slate-800">
      <CardHeader className="py-3 px-4 border-b border-slate-800">
        <CardTitle className="text-sm font-bold text-slate-200 flex items-center">
          <Activity className="w-4 h-4 mr-2 text-rose-500" />
          Contact Force & Dogleg Severity
        </CardTitle>
      </CardHeader>
      <CardContent className="p-4">
        <div className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={data}
              margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
              <XAxis 
                dataKey="depth" 
                type="number" 
                domain={['auto', 'auto']} 
                label={{ value: 'Depth (m)', position: 'insideBottomRight', offset: -10, fill: '#94a3b8' }}
                stroke="#94a3b8" 
                fontSize={10}
              />
              <YAxis 
                yAxisId="left" 
                orientation="left" 
                stroke="#f43f5e" 
                label={{ value: 'Contact Force (kN)', angle: -90, position: 'insideLeft', fill: '#f43f5e' }}
                fontSize={10}
              />
              <YAxis 
                yAxisId="right" 
                orientation="right" 
                stroke="#fbbf24" 
                label={{ value: 'DLS (°/30m)', angle: 90, position: 'insideRight', fill: '#fbbf24' }}
                fontSize={10}
              />
              <Tooltip 
                contentStyle={{ backgroundColor: '#1e293b', borderColor: '#334155', fontSize: '12px' }}
                itemStyle={{ color: '#e2e8f0' }}
                labelStyle={{ color: '#94a3b8' }}
              />
              <Legend verticalAlign="top" height={36} />
              <Line 
                yAxisId="left"
                type="monotone" 
                dataKey="contactForce" 
                stroke="#f43f5e" 
                dot={false} 
                name="Contact Force (kN)" 
                strokeWidth={2}
              />
              <Line 
                yAxisId="right"
                type="monotone" 
                dataKey="dls" 
                stroke="#fbbf24" 
                dot={false} 
                name="Dogleg Severity" 
                strokeWidth={1.5}
                strokeDasharray="5 5"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};

export default ContactForceEstimation;