import React from 'react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Cell } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const ParameterSensitivityAnalysis = () => {
  // Tornado chart data
  const data = [
    { name: 'V0 (Overburden)', value: 45, type: 'pos' },
    { name: 'k (Target)', value: 32, type: 'pos' },
    { name: 'Anisotropy (Delta)', value: 15, type: 'pos' },
    { name: 'Datum Shift', value: 8, type: 'pos' },
    { name: 'Vw (Water)', value: -5, type: 'neg' },
    { name: 'k (Overburden)', value: -12, type: 'neg' },
    { name: 'V0 (Target)', value: -28, type: 'neg' },
  ];

  // Sort by absolute value impact
  data.sort((a, b) => Math.abs(b.value) - Math.abs(a.value));

  return (
    <Card className="bg-slate-900 border-slate-800 h-full flex flex-col">
      <CardHeader className="py-3 border-b border-slate-800">
        <CardTitle className="text-sm font-medium text-slate-200">Parameter Sensitivity (Tornado Chart)</CardTitle>
      </CardHeader>
      <CardContent className="flex-1 p-4 min-h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart layout="vertical" data={data} margin={{ top: 5, right: 30, left: 100, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#334155" horizontal={true} vertical={true} />
            <XAxis type="number" stroke="#94a3b8" tick={{fontSize: 11}} />
            <YAxis type="category" dataKey="name" stroke="#94a3b8" width={120} tick={{fontSize: 11}} />
            <Tooltip 
               cursor={{fill: 'transparent'}}
               contentStyle={{ backgroundColor: '#1e293b', borderColor: '#334155', color: '#f8fafc' }} 
            />
            <Bar dataKey="value" barSize={20}>
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.value > 0 ? '#3b82f6' : '#f43f5e'} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
        <div className="text-center text-xs text-slate-500 mt-2">
           Impact on Target Depth (m) per 10% parameter change
        </div>
      </CardContent>
    </Card>
  );
};

export default ParameterSensitivityAnalysis;