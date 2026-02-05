import React from 'react';
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ReferenceLine } from 'recharts';

const TemperaturePrognosis = ({ data, gradient = 1.5 }) => {
  // data: [{ depth: 0, temp: 60 }, { depth: 10000, temp: 210 }]

  return (
    <div className="flex flex-col h-full bg-white p-4 rounded-lg shadow-sm">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-bold text-slate-800">Temperature Prognosis</h3>
        <div className="text-sm text-slate-500 bg-slate-100 px-3 py-1 rounded">
            Gradient: <span className="font-bold text-slate-700">{gradient} °F/100ft</span>
        </div>
      </div>

      <div className="flex-1 min-h-[500px]">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            layout="vertical"
            data={data}
            margin={{ top: 20, right: 30, bottom: 20, left: 30 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
            <XAxis 
              type="number" 
              domain={['dataMin - 20', 'dataMax + 20']} 
              orientation="top" 
              label={{ value: 'Temperature (°F)', position: 'top', offset: 10, fill: '#ef4444' }} 
              stroke="#ef4444"
            />
            <YAxis 
              type="number" 
              dataKey="depth" 
              reversed={true} 
              label={{ value: 'Depth (ft)', angle: -90, position: 'insideLeft', fill: '#475569' }}
              stroke="#475569"
            />
            <Tooltip 
               contentStyle={{ backgroundColor: 'rgba(255, 255, 255, 0.95)', borderRadius: '6px', border: '1px solid #e2e8f0' }}
               labelStyle={{ fontWeight: 'bold', color: '#1e293b' }}
            />
            <Legend />

            <Line dataKey="temp" stroke="#ef4444" strokeWidth={2} name="Formation Temp" dot={false} />
            <Line dataKey="temp_mud" stroke="#3b82f6" strokeWidth={1.5} strokeDasharray="5 5" name="Mudline Temp (Circulating)" dot={false} />

            {/* Critical Isotherms */}
            <ReferenceLine x={212} stroke="#f59e0b" label={{ value: 'Boiling Point (Water)', angle: -90, position: 'insideBottom' }} />
            <ReferenceLine x={300} stroke="#ef4444" strokeDasharray="3 3" label={{ value: 'HPHT Threshold', angle: -90, position: 'insideBottom' }} />

          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default TemperaturePrognosis;