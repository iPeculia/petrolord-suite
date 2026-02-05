import React from 'react';
import { ResponsiveContainer, ComposedChart, Line, Area, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ReferenceLine, Scatter } from 'recharts';
import { getDepthAxisConfig, getPressureAxisConfig, getGridConfig } from '@/utils/chartConfigUtils';

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-slate-950 border border-slate-700 p-3 rounded shadow-xl text-xs text-slate-200 z-50">
        <p className="font-bold text-emerald-400 mb-2">Depth: {label} ft</p>
        {payload.map((p, i) => (
          <div key={i} className="flex items-center gap-2 mb-1">
            <div className="w-2 h-2 rounded-full" style={{ backgroundColor: p.color }}></div>
            <span className="text-slate-400 w-24">{p.name}:</span>
            <span className="font-mono font-bold">{Number(p.value).toFixed(2)} ppg</span>
          </div>
        ))}
      </div>
    );
  }
  return null;
};

const PPFGPrognosisChart = ({ data, markers, casingPoints }) => {
  return (
    <div className="w-full h-full bg-slate-950 p-4 rounded-lg border border-slate-800 flex flex-col">
      <div className="flex justify-between items-center mb-2">
        <h3 className="text-slate-100 font-bold text-sm flex items-center gap-2">
          <span className="w-2 h-6 bg-emerald-500 rounded-sm"></span>
          PP–FG Prognosis
        </h3>
        <div className="flex gap-2 text-xs text-slate-500">
           <span className="flex items-center gap-1"><div className="w-2 h-2 bg-blue-500 rounded-full"></div> Pore Pressure</span>
           <span className="flex items-center gap-1"><div className="w-2 h-2 bg-red-500 rounded-full"></div> Fracture Gradient</span>
        </div>
      </div>

      <div className="flex-1 min-h-[600px]">
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart
            layout="vertical"
            data={data}
            margin={{ top: 20, right: 30, bottom: 20, left: 20 }}
          >
            <CartesianGrid {...getGridConfig()} />
            
            <XAxis {...getPressureAxisConfig('Equivalent Mud Weight (ppg)', [8, 20])} />
            <YAxis {...getDepthAxisConfig()} />
            
            <Tooltip content={<CustomTooltip />} />
            
            <Line dataKey="obg" stroke="#475569" strokeWidth={2} name="Overburden" dot={false} />

            <Area dataKey="pp_high" dataKey1="pp_low" stroke="none" fill="#3b82f6" fillOpacity={0.15} name="PP Uncertainty" />
            <Line dataKey="pp_mid" stroke="#3b82f6" strokeWidth={2} name="Pore Pressure (P50)" dot={false} />

            <Area dataKey="fg_high" dataKey1="fg_low" stroke="none" fill="#ef4444" fillOpacity={0.15} name="FG Uncertainty" />
            <Line dataKey="fg_mid" stroke="#ef4444" strokeWidth={2} name="Fracture Gradient (P50)" dot={false} />

            <Line dataKey="shmin" stroke="#a855f7" strokeWidth={1} strokeDasharray="4 4" name="Min Stress (Shmin)" dot={false} />
            
            {markers && markers.map((m, i) => (
               <ReferenceLine 
                 key={`marker-${i}`} 
                 y={m.depth} 
                 stroke={m.type === 'LOT' ? '#f59e0b' : '#10b981'} 
                 strokeDasharray="3 3"
                 label={{ 
                   position: 'insideRight', 
                   value: `${m.type} ${m.value}`, 
                   fill: m.type === 'LOT' ? '#f59e0b' : '#10b981', 
                   fontSize: 10,
                   offset: 10
                 }} 
               />
            ))}

            <Scatter name="LOT/FIT" data={markers.filter(m => ['LOT','FIT'].includes(m.type))} fill="#f59e0b" shape="triangle" />
            <Scatter name="RFT/MDT" data={markers.filter(m => ['RFT','MDT'].includes(m.type))} fill="#10b981" shape="circle" />

            {casingPoints && casingPoints.map((c, i) => (
               <ReferenceLine 
                 key={`csg-${i}`} 
                 y={c.depth} 
                 stroke="#e2e8f0" 
                 strokeWidth={1} 
                 label={{ position: 'insideLeft', value: `${c.size}"`, fill: '#e2e8f0', fontSize: 10 }} 
               />
            ))}

          </ComposedChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default PPFGPrognosisChart;