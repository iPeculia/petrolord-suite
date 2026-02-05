import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';

const SensitivityAnalysis = () => {
    // Mock Sensitivity Data (Tornado Chart Format)
    // Base NPV = 245
    const data = [
        { name: 'Oil Price (+/- 20%)', low: 180, high: 310, base: 245 },
        { name: 'CAPEX (+/- 20%)', low: 280, high: 210, base: 245 }, // Inverse relationship
        { name: 'Production (+/- 10%)', low: 200, high: 290, base: 245 },
        { name: 'OPEX (+/- 20%)', low: 260, high: 230, base: 245 },
    ];

    // Transform for Tornado: We need delta from base
    const tornadoData = data.map(d => ({
        name: d.name,
        min: d.low - d.base,
        max: d.high - d.base
    })).sort((a,b) => (b.max - b.min) - (a.max - a.min));

    return (
        <Card className="bg-slate-900 border-slate-800">
            <CardHeader>
                <CardTitle className="text-white text-sm">NPV Sensitivity (Tornado Chart)</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="h-[300px] w-full flex items-center justify-center">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart
                            layout="vertical"
                            data={tornadoData}
                            margin={{ top: 20, right: 30, left: 100, bottom: 5 }}
                            stackOffset="sign"
                        >
                            <CartesianGrid strokeDasharray="3 3" stroke="#334155" horizontal={false} />
                            <XAxis type="number" stroke="#94a3b8" />
                            <YAxis dataKey="name" type="category" stroke="#94a3b8" width={120} />
                            <Tooltip 
                                cursor={{fill: 'transparent'}}
                                contentStyle={{ backgroundColor: '#1e293b', borderColor: '#334155', color: '#f8fafc' }}
                            />
                            <Bar dataKey="min" fill="#ef4444" name="Downside Impact" stackId="a">
                                {tornadoData.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill="#ef4444" />
                                ))}
                            </Bar>
                            <Bar dataKey="max" fill="#22c55e" name="Upside Impact" stackId="a">
                                {tornadoData.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill="#22c55e" />
                                ))}
                            </Bar>
                        </BarChart>
                    </ResponsiveContainer>
                </div>
                <p className="text-xs text-slate-500 text-center mt-4">
                    Chart shows change in NPV ($MM) relative to Base Case ($245MM)
                </p>
            </CardContent>
        </Card>
    );
};

export default SensitivityAnalysis;