import React from 'react';
import { ResponsiveContainer, ComposedChart, Line, Area, XAxis, YAxis, CartesianGrid, Tooltip, ReferenceLine, Legend, ReferenceArea } from 'recharts';
import { Card } from '@/components/ui/card';

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-slate-900/95 border border-slate-700 p-2 rounded shadow-xl text-xs z-50">
        <p className="font-bold text-slate-300 mb-1">Depth: {label} ft</p>
        {payload.map((p, i) => (
          <div key={i} className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full" style={{ backgroundColor: p.color }}></div>
            <span className="text-slate-400">{p.name}:</span>
            <span className="font-mono text-slate-200">{Number(p.value).toFixed(2)}</span>
          </div>
        ))}
      </div>
    );
  }
  return null;
};

const PPFGVisualization = ({ data, markers, casingPoints }) => {
  // data array of objects: { depth, gr, res, dt, obg, pp, fg, mw_rec }
  
  return (
    <div className="h-full flex gap-1 overflow-x-auto bg-slate-950 p-2">
      
      {/* Track 1: Lithology (GR) */}
      <div className="flex-1 min-w-[150px] flex flex-col">
        <div className="text-center text-xs font-bold text-slate-400 bg-slate-900 p-1 border border-slate-800">Gamma Ray</div>
        <div className="flex-1 bg-slate-900 border border-slate-800 relative">
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart layout="vertical" data={data} syncId="ppfgSync" margin={{ top: 10, right: 10, left: 10, bottom: 10 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" horizontal={true} vertical={false} />
              <XAxis type="number" domain={[0, 150]} orientation="top" stroke="#22c55e" tick={{fontSize: 10}} label={{ value: 'GR (API)', position: 'top', fill: '#22c55e', fontSize: 10 }} />
              <YAxis type="number" dataKey="depth" reversed={true} hide={false} tick={{fontSize: 10, fill: '#94a3b8'}} domain={['dataMin', 'dataMax']} />
              <Tooltip content={<CustomTooltip />} />
              <Area type="monotone" dataKey="gr" stroke="#22c55e" fill="#22c55e" fillOpacity={0.3} />
            </ComposedChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Track 2: Porosity/Resistivity (Log Scale) */}
      <div className="flex-1 min-w-[200px] flex flex-col">
        <div className="text-center text-xs font-bold text-slate-400 bg-slate-900 p-1 border border-slate-800">Resistivity / Sonic</div>
        <div className="flex-1 bg-slate-900 border border-slate-800 relative">
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart layout="vertical" data={data} syncId="ppfgSync" margin={{ top: 10, right: 10, left: 10, bottom: 10 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
              {/* Resistivity (Log Scale Mocked via domain usually, but using linear for simplicity in this snippet or dual axis) */}
              <XAxis type="number" xAxisId="res" domain={[0.2, 200]} scale="log" orientation="top" stroke="#ef4444" tick={{fontSize: 10}} allowDataOverflow />
              <XAxis type="number" xAxisId="dt" domain={[140, 40]} orientation="bottom" stroke="#3b82f6" tick={{fontSize: 10}} />
              
              <YAxis type="number" dataKey="depth" reversed={true} hide={true} domain={['dataMin', 'dataMax']} />
              <Tooltip content={<CustomTooltip />} />
              
              <Line xAxisId="res" type="monotone" dataKey="res" stroke="#ef4444" dot={false} strokeWidth={1} />
              <Line xAxisId="dt" type="monotone" dataKey="dt" stroke="#3b82f6" dot={false} strokeWidth={1} />
              
              {/* NCT Lines could go here */}
              <Line xAxisId="dt" type="monotone" dataKey="dt_nct" stroke="#3b82f6" strokeDasharray="5 5" dot={false} strokeWidth={1} />
            </ComposedChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Track 3: Pressure Gradients (PP, FG, OBG) */}
      <div className="flex-[2] min-w-[300px] flex flex-col">
        <div className="text-center text-xs font-bold text-slate-400 bg-slate-900 p-1 border border-slate-800">Pressure Gradient (ppg)</div>
        <div className="flex-1 bg-slate-900 border border-slate-800 relative">
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart layout="vertical" data={data} syncId="ppfgSync" margin={{ top: 10, right: 10, left: 10, bottom: 10 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
              <XAxis type="number" domain={[8, 20]} orientation="top" stroke="#cbd5e1" tick={{fontSize: 10}} ticks={[8, 10, 12, 14, 16, 18, 20]} />
              <YAxis type="number" dataKey="depth" reversed={true} hide={true} domain={['dataMin', 'dataMax']} />
              <Tooltip content={<CustomTooltip />} />
              <Legend verticalAlign="top" height={36} iconSize={8} wrapperStyle={{ fontSize: '10px' }} />

              {/* Overburden */}
              <Line dataKey="obg" stroke="#64748b" strokeWidth={2} dot={false} name="Overburden" />
              
              {/* Pore Pressure */}
              <Area dataKey="pp" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.1} name="Pore Pressure" />
              
              {/* Fracture Gradient */}
              <Line dataKey="fg" stroke="#ef4444" strokeWidth={2} dot={false} name="Frac Gradient" />
              
              {/* Mud Weight Window (Shaded Area) */}
              {/* Requires processing data to have [pp, fg] range or similar */}
              
              {/* Calibration Points (LOT/MDT) */}
              {markers && markers.map((m, i) => (
                 <ReferenceLine key={i} y={m.depth} stroke="white" strokeDasharray="3 3" label={{ position: 'insideRight', value: m.type, fill: 'white', fontSize: 10 }} />
              ))}
              
              {/* Casing Shoes */}
              {casingPoints && casingPoints.map((c, i) => (
                 <ReferenceLine key={`csg-${i}`} y={c.depth} stroke="#f59e0b" strokeWidth={2} label={{ position: 'insideLeft', value: `${c.size}"`, fill: '#f59e0b', fontSize: 10 }} />
              ))}

            </ComposedChart>
          </ResponsiveContainer>
        </div>
      </div>

    </div>
  );
};

export default PPFGVisualization;