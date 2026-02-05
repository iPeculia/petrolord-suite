import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Cell, Tooltip, ReferenceLine } from 'recharts';

const shapValues = [
    { feature: 'GR', value: 0.45, type: 'positive' },
    { feature: 'NPHI', value: 0.25, type: 'positive' },
    { feature: 'DT', value: 0.10, type: 'positive' },
    { feature: 'DEPTH', value: 0.02, type: 'positive' },
    { feature: 'CALI', value: -0.05, type: 'negative' },
    { feature: 'RHOB', value: -0.30, type: 'negative' },
    { feature: 'RES_DEEP', value: -0.15, type: 'negative' },
];

const FeatureContributionAnalyzer = () => {
    return (
        <Card className="bg-slate-900 border-slate-800 h-full flex flex-col">
            <CardHeader className="py-3 border-b border-slate-800 flex flex-row justify-between items-center">
                <CardTitle className="text-sm font-medium">Local Explainability (SHAP)</CardTitle>
                <div className="flex items-center gap-2">
                    <span className="text-xs text-slate-500">Depth:</span>
                    <Select defaultValue="1250.5">
                        <SelectTrigger className="h-7 w-28 bg-slate-950 border-slate-700 text-xs"><SelectValue /></SelectTrigger>
                        <SelectContent>
                            <SelectItem value="1250.5">1250.5 m</SelectItem>
                            <SelectItem value="1251.0">1251.0 m</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
            </CardHeader>
            <CardContent className="flex-1 p-4">
                <div className="mb-4 p-3 bg-slate-950 rounded border border-slate-800">
                    <div className="flex justify-between text-sm">
                        <span className="text-slate-400">Prediction:</span>
                        <span className="font-bold text-yellow-400">Sandstone (88% Conf)</span>
                    </div>
                    <div className="mt-2 text-xs text-slate-500">
                        High Gamma Ray and Neutron porosity strongly pushed prediction towards Shale, 
                        but extremely low Density (Gas effect) shifted classification to Sandstone.
                    </div>
                </div>
                
                <div className="h-[250px]">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={shapValues} layout="vertical" margin={{ left: 40 }}>
                            <ReferenceLine x={0} stroke="#475569" />
                            <XAxis type="number" hide />
                            <YAxis dataKey="feature" type="category" width={70} tick={{fill: '#94a3b8', fontSize: 10}} />
                            <Tooltip cursor={{fill: 'transparent'}} contentStyle={{ backgroundColor: '#0f172a', borderColor: '#1e293b', color: '#f1f5f9' }} />
                            <Bar dataKey="value" radius={[2, 2, 2, 2]}>
                                {shapValues.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={entry.type === 'positive' ? '#ef4444' : '#3b82f6'} />
                                ))}
                            </Bar>
                        </BarChart>
                    </ResponsiveContainer>
                </div>
                <div className="flex justify-center gap-6 mt-2 text-xs font-medium">
                    <div className="flex items-center gap-1"><div className="w-2 h-2 bg-red-500 rounded-full"></div> Pushes to Sandstone</div>
                    <div className="flex items-center gap-1"><div className="w-2 h-2 bg-blue-500 rounded-full"></div> Pushes to Other</div>
                </div>
            </CardContent>
        </Card>
    );
};

export default FeatureContributionAnalyzer;