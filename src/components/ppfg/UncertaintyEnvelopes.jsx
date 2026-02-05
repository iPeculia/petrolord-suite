import React from 'react';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import { Card } from '@/components/ui/card';

const UncertaintyEnvelopes = ({ data }) => {
  return (
    <Card className="h-full p-4 bg-white shadow-sm border-slate-200">
       <div className="mb-4">
            <h3 className="text-lg font-bold text-slate-800">Probabilistic Uncertainty (P10-P50-P90)</h3>
            <p className="text-xs text-slate-500">Shaded regions represent the statistical uncertainty range for Pore Pressure (Blue) and Fracture Gradient (Red).</p>
       </div>
       <div className="flex-1 h-[500px]">
            <ResponsiveContainer width="100%" height="100%">
                <AreaChart
                    layout="vertical"
                    data={data}
                    margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis type="number" domain={[8, 20]} orientation="top" tick={{fontSize:10}} label={{value:'Gradient (ppg)', position:'top', offset:10}} />
                    <YAxis type="number" dataKey="depth" reversed={true} tick={{fontSize:10}} />
                    <Tooltip />
                    <Legend verticalAlign="top" height={36}/>

                    {/* P10-P90 Ranges */}
                    <Area dataKey="pp_p90" stackId="pp" stroke="transparent" fill="transparent" /> 
                    <Area dataKey="pp_range" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.2} name="PP P10-P90 Range" />
                    <Area dataKey="fg_range" stroke="#ef4444" fill="#ef4444" fillOpacity={0.2} name="FG P10-P90 Range" />
                    
                    <Area dataKey="pp_p50" stroke="#2563eb" fill="none" strokeWidth={2} name="PP P50 (Base)" />
                    <Area dataKey="fg_p50" stroke="#dc2626" fill="none" strokeWidth={2} name="FG P50 (Base)" />

                </AreaChart>
            </ResponsiveContainer>
       </div>
    </Card>
  );
};

export default UncertaintyEnvelopes;