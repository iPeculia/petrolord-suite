import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const data = [
    { phase: 'P1: Foundation', Dev: 2, QA: 1, Domain: 1, DevOps: 0.5 },
    { phase: 'P2: ML Models', Dev: 2, QA: 1, Domain: 2, DevOps: 0.5 },
    { phase: 'P3: Viz & UX', Dev: 3, QA: 1, Domain: 0.5, DevOps: 0 },
    { phase: 'P4: Interpretation', Dev: 2, QA: 2, Domain: 2, DevOps: 0 },
    { phase: 'P5: Validation', Dev: 1.5, QA: 2, Domain: 1, DevOps: 0.5 },
    { phase: 'P6: Enterprise', Dev: 2, QA: 1, Domain: 0.5, DevOps: 1 },
    { phase: 'P7: Integration', Dev: 2, QA: 1, Domain: 0, DevOps: 1 },
    { phase: 'P8: Scale', Dev: 1, QA: 1, Domain: 0, DevOps: 2 },
];

const ResourceAllocationMatrix = () => {
    return (
        <Card className="bg-slate-900 border-slate-800 h-full flex flex-col">
            <CardHeader className="pb-2">
                <CardTitle className="text-white text-sm">Resource Allocation (FTEs per Phase)</CardTitle>
            </CardHeader>
            <CardContent className="flex-1 min-h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={data} layout="vertical" margin={{ left: 40 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#334155" horizontal={false} />
                        <XAxis type="number" stroke="#94a3b8" fontSize={10} label={{ value: 'Full-Time Equivalents (FTE)', position: 'bottom', fill: '#94a3b8', fontSize: 10 }} />
                        <YAxis dataKey="phase" type="category" stroke="#94a3b8" width={100} fontSize={10} />
                        <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#1e293b', color: '#f1f5f9' }} />
                        <Legend />
                        <Bar dataKey="Dev" stackId="a" fill="#3b82f6" name="Developers" />
                        <Bar dataKey="QA" stackId="a" fill="#a855f7" name="QA/Test" />
                        <Bar dataKey="Domain" stackId="a" fill="#eab308" name="Petrophysicists" />
                        <Bar dataKey="DevOps" stackId="a" fill="#ef4444" name="DevOps" />
                    </BarChart>
                </ResponsiveContainer>
            </CardContent>
        </Card>
    );
};

export default ResourceAllocationMatrix;