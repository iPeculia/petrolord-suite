import React from 'react';
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';

// Mock data generator for vertical log look
const generateLogData = (depths) => {
    return depths.map(d => ({
        depth: d,
        gr: 20 + Math.random() * 100 + Math.sin(d/10) * 20,
        res: Math.exp(Math.random() * 2),
        nphi: 0.45 - Math.random() * 0.3,
        rhob: 2.0 + Math.random() * 0.7
    }));
};

const data = generateLogData(Array.from({length: 100}, (_, i) => i * 0.5 + 1000));

const FullWellLogViewer = () => {
    return (
        <div className="grid grid-cols-3 gap-1 h-full bg-white p-1">
            {/* Track 1: Gamma Ray (Linear) */}
            <div className="bg-slate-50 border border-slate-300 h-full relative">
                 <div className="absolute top-0 left-0 w-full h-6 bg-slate-100 border-b border-slate-300 text-[10px] text-center font-bold">GR (0-150)</div>
                 <ResponsiveContainer width="100%" height="100%">
                    <LineChart layout="vertical" data={data} margin={{top: 25, bottom: 5, left: 0, right: 0}}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                        <XAxis type="number" domain={[0, 150]} tick={false} hide />
                        <YAxis dataKey="depth" type="number" domain={['dataMin', 'dataMax']} reversed tick={{fontSize: 10}} width={40} />
                        <Line type="monotone" dataKey="gr" stroke="#16a34a" dot={false} strokeWidth={1} />
                    </LineChart>
                 </ResponsiveContainer>
            </div>
            
            {/* Track 2: Resistivity (Logarithmic - Mocked visually) */}
            <div className="bg-slate-50 border border-slate-300 h-full relative">
                 <div className="absolute top-0 left-0 w-full h-6 bg-slate-100 border-b border-slate-300 text-[10px] text-center font-bold">RES (0.2-2000)</div>
                 <ResponsiveContainer width="100%" height="100%">
                    <LineChart layout="vertical" data={data} margin={{top: 25, bottom: 5, left: 0, right: 0}}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                        <XAxis type="number" domain={[0, 10]} tick={false} hide />
                        <YAxis dataKey="depth" type="number" domain={['dataMin', 'dataMax']} reversed hide />
                        <Line type="monotone" dataKey="res" stroke="#dc2626" dot={false} strokeWidth={1} />
                    </LineChart>
                 </ResponsiveContainer>
            </div>

             {/* Track 3: Neutron/Density */}
            <div className="bg-slate-50 border border-slate-300 h-full relative">
                 <div className="absolute top-0 left-0 w-full h-6 bg-slate-100 border-b border-slate-300 text-[10px] text-center font-bold">NPHI / RHOB</div>
                 <ResponsiveContainer width="100%" height="100%">
                    <LineChart layout="vertical" data={data} margin={{top: 25, bottom: 5, left: 0, right: 0}}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                        <XAxis type="number" domain={[ -0.15, 0.45]} tick={false} hide />
                        <YAxis dataKey="depth" type="number" domain={['dataMin', 'dataMax']} reversed hide />
                        <Line type="monotone" dataKey="nphi" stroke="#2563eb" dot={false} strokeWidth={1} strokeDasharray="5 5" />
                        <Line type="monotone" dataKey="rhob" stroke="#ca8a04" dot={false} strokeWidth={1} />
                    </LineChart>
                 </ResponsiveContainer>
            </div>
        </div>
    );
};

export default FullWellLogViewer;