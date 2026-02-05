import React from 'react';
import { ComposedChart, Bar, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const StackedCashflowChart = ({ data }) => {
    return (
        <ResponsiveContainer width="100%" height="100%">
            <ComposedChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
                <XAxis dataKey="year" stroke="#94a3b8" fontSize={10} />
                <YAxis yAxisId="left" stroke="#94a3b8" fontSize={10} tickFormatter={(v)=>`$${v/1e6}M`} />
                <YAxis yAxisId="right" orientation="right" stroke="#facc15" fontSize={10} tickFormatter={(v)=>`$${v/1e6}M`} />
                <Tooltip contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #334155', color: '#fff' }} />
                <Legend wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }} />
                
                <Bar yAxisId="left" dataKey="grossRevenue" stackId="in" fill="#10b981" name="Revenue" />
                
                {/* Outflows stacked separately below zero? Or just positive bars for magnitude? 
                    Typically Revenue is positive, Costs are negative bars. 
                    Recharts handles negative values well. Let's pass costs as negatives. */}
                
                <Bar yAxisId="left" dataKey={(d) => -d.royalty} stackId="out" fill="#a855f7" name="Royalty" />
                <Bar yAxisId="left" dataKey={(d) => -d.tax} stackId="out" fill="#f43f5e" name="Tax" />
                <Bar yAxisId="left" dataKey={(d) => -d.opex} stackId="out" fill="#f97316" name="OPEX" />
                <Bar yAxisId="left" dataKey={(d) => -d.capex} stackId="out" fill="#3b82f6" name="CAPEX" />

                <Line yAxisId="right" type="monotone" dataKey="cumulativeNCF" stroke="#facc15" strokeWidth={3} dot={false} name="Cum. Cashflow" />
            </ComposedChart>
        </ResponsiveContainer>
    );
};

export default StackedCashflowChart;