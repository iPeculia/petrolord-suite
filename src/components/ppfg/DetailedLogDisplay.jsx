import React from 'react';
import { ResponsiveContainer, ComposedChart, Line, Area, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';

const TrackHeader = ({ title, color = "text-slate-600" }) => (
    <div className={`text-center text-[10px] font-bold uppercase border-b border-slate-200 bg-slate-50 p-1 ${color} truncate`}>
        {title}
    </div>
);

const DetailedLogDisplay = ({ data }) => {
  // data should be synchronized by depth
  
  return (
    <div className="h-full flex flex-col bg-white rounded-lg shadow-sm overflow-hidden border border-slate-200">
       <div className="flex h-full overflow-x-auto divide-x divide-slate-200">
           
           {/* Track 1: Gamma Ray */}
           <div className="w-40 flex flex-col min-w-[160px]">
               <TrackHeader title="Gamma Ray (API)" color="text-green-600" />
               <div className="flex-1 relative">
                   <ResponsiveContainer width="100%" height="100%">
                       <ComposedChart layout="vertical" data={data} margin={{ top: 10, bottom: 10 }}>
                           <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} />
                           <XAxis type="number" domain={[0, 150]} orientation="top" tick={{fontSize: 9}} stroke="#16a34a" />
                           <YAxis type="number" dataKey="depth" reversed={true} domain={['dataMin', 'dataMax']} tick={{fontSize: 9}} width={40} />
                           <Area dataKey="gr" stroke="#16a34a" fill="#16a34a" fillOpacity={0.3} isAnimationActive={false} />
                       </ComposedChart>
                   </ResponsiveContainer>
               </div>
           </div>

           {/* Track 2: Resistivity / Sonic */}
           <div className="w-48 flex flex-col min-w-[180px]">
               <TrackHeader title="Res (Red) / DT (Blue)" color="text-slate-700" />
               <div className="flex-1 relative">
                   <ResponsiveContainer width="100%" height="100%">
                       <ComposedChart layout="vertical" data={data} margin={{ top: 10, bottom: 10 }}>
                           <CartesianGrid strokeDasharray="3 3" />
                           <XAxis xAxisId="res" type="number" domain={[0.2, 200]} scale="log" orientation="top" tick={{fontSize: 9}} stroke="#dc2626" allowDataOverflow />
                           <XAxis xAxisId="dt" type="number" domain={[140, 40]} orientation="bottom" tick={{fontSize: 9}} stroke="#2563eb" />
                           <YAxis type="number" dataKey="depth" reversed={true} hide={true} domain={['dataMin', 'dataMax']} />
                           <Line xAxisId="res" dataKey="res" stroke="#dc2626" dot={false} strokeWidth={1} isAnimationActive={false} />
                           <Line xAxisId="dt" dataKey="dt" stroke="#2563eb" dot={false} strokeWidth={1} isAnimationActive={false} />
                       </ComposedChart>
                   </ResponsiveContainer>
               </div>
           </div>

           {/* Track 3: Drilling Parameters */}
           <div className="w-32 flex flex-col min-w-[120px]">
               <TrackHeader title="ROP (ft/hr)" color="text-purple-600" />
               <div className="flex-1 relative">
                   <ResponsiveContainer width="100%" height="100%">
                       <ComposedChart layout="vertical" data={data} margin={{ top: 10, bottom: 10 }}>
                           <CartesianGrid strokeDasharray="3 3" />
                           <XAxis type="number" domain={[0, 200]} orientation="top" tick={{fontSize: 9}} stroke="#9333ea" />
                           <YAxis type="number" dataKey="depth" reversed={true} hide={true} domain={['dataMin', 'dataMax']} />
                           <Line dataKey="rop" stroke="#9333ea" dot={false} strokeWidth={1} isAnimationActive={false} />
                       </ComposedChart>
                   </ResponsiveContainer>
               </div>
           </div>

           {/* Track 4: Pressures (The main event) */}
           <div className="flex-1 flex flex-col min-w-[400px]">
               <TrackHeader title="Pressure Gradient (ppg)" color="text-slate-800" />
               <div className="flex-1 relative">
                   <ResponsiveContainer width="100%" height="100%">
                       <ComposedChart layout="vertical" data={data} margin={{ top: 10, bottom: 10, right: 20 }}>
                           <CartesianGrid strokeDasharray="3 3" />
                           <XAxis type="number" domain={[8, 20]} orientation="top" tick={{fontSize: 9}} ticks={[8,10,12,14,16,18,20]} />
                           <YAxis type="number" dataKey="depth" reversed={true} hide={true} domain={['dataMin', 'dataMax']} />
                           <Legend verticalAlign="top" height={20} iconSize={8} wrapperStyle={{fontSize:'10px'}} />
                           <Tooltip contentStyle={{fontSize:'11px'}} />
                           
                           {/* Overburden */}
                           <Line dataKey="obg" stroke="#cbd5e1" strokeWidth={2} dot={false} name="OBG" isAnimationActive={false} />
                           
                           {/* Pore Pressure */}
                           <Line dataKey="pp" stroke="#3b82f6" strokeWidth={2} dot={false} name="Pore Pressure" isAnimationActive={false} />
                           
                           {/* Frac Gradient */}
                           <Line dataKey="fg" stroke="#ef4444" strokeWidth={2} dot={false} name="Frac Gradient" isAnimationActive={false} />

                           {/* Mud Weight */}
                           <Line dataKey="mw" stroke="#000000" strokeWidth={1.5} strokeDasharray="5 3" dot={false} name="Mud Weight" isAnimationActive={false} />
                       </ComposedChart>
                   </ResponsiveContainer>
               </div>
           </div>

       </div>
    </div>
  );
};

export default DetailedLogDisplay;