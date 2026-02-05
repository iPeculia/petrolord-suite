import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { FileText } from 'lucide-react';

const StructuralAnalysisPanel = ({ stats }) => {
    // Mock stats if not provided
    const data = stats || [
        { name: 'Fault Blocks', value: 4 },
        { name: 'Horizons', value: 6 },
        { name: 'Contacts', value: 2 }
    ];
    const COLORS = ['#0088FE', '#00C49F', '#FFBB28'];

    return (
        <Card className="bg-slate-900 border-slate-800">
            <CardHeader className="pb-2">
                <CardTitle className="text-sm font-bold flex items-center text-slate-200">
                    <FileText className="w-4 h-4 mr-2" /> Structural Analysis
                </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="h-40 w-full">
                    <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                            <Pie
                                data={data}
                                cx="50%"
                                cy="50%"
                                innerRadius={40}
                                outerRadius={60}
                                paddingAngle={5}
                                dataKey="value"
                            >
                                {data.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                ))}
                            </Pie>
                            <Tooltip contentStyle={{backgroundColor: '#1e293b', borderColor: '#334155', fontSize: '12px'}} />
                        </PieChart>
                    </ResponsiveContainer>
                </div>
                <div className="text-xs text-slate-400 space-y-1">
                    <div className="flex justify-between"><span>Mean Dip:</span> <span className="text-slate-200">12.4°</span></div>
                    <div className="flex justify-between"><span>Major Fault Trend:</span> <span className="text-slate-200">NE-SW</span></div>
                    <div className="flex justify-between"><span>Seal Capacity:</span> <span className="text-green-400">High</span></div>
                </div>
            </CardContent>
        </Card>
    );
};

export default StructuralAnalysisPanel;