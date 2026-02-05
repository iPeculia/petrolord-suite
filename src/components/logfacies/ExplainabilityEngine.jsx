import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const importanceData = [
    { name: 'Gamma Ray', value: 0.35 },
    { name: 'Density', value: 0.25 },
    { name: 'Neutron', value: 0.20 },
    { name: 'Resistivity', value: 0.15 },
    { name: 'Sonic', value: 0.05 },
];

const ExplainabilityEngine = () => {
    return (
        <Card className="bg-slate-900 border-slate-800 h-full">
            <CardHeader><CardTitle>Feature Importance (SHAP Values)</CardTitle></CardHeader>
            <CardContent className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart layout="vertical" data={importanceData} margin={{ left: 40 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#334155" horizontal={true} vertical={false} />
                        <XAxis type="number" stroke="#94a3b8" />
                        <YAxis dataKey="name" type="category" stroke="#94a3b8" width={80} />
                        <Tooltip cursor={{fill: 'transparent'}} contentStyle={{ backgroundColor: '#0f172a', borderColor: '#1e293b', color: '#f1f5f9' }} />
                        <Bar dataKey="value" fill="#8b5cf6" radius={[0, 4, 4, 0]} barSize={20} />
                    </BarChart>
                </ResponsiveContainer>
            </CardContent>
        </Card>
    );
};

export default ExplainabilityEngine;