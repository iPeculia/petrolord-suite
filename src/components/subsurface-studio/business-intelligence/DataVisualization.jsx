import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { AreaChart, PieChart, BarChart, Map } from 'lucide-react';

const DataVisualization = () => (
    <div className="h-full p-1 space-y-4">
        <h3 className="text-lg font-bold text-slate-200 flex items-center">
            <AreaChart className="w-5 h-5 mr-2 text-yellow-400" /> Visualization Library
        </h3>
        <div className="grid grid-cols-4 gap-4">
            {[
                { icon: AreaChart, label: 'Time Series' },
                { icon: BarChart, label: 'Categorical' },
                { icon: PieChart, label: 'Part-to-Whole' },
                { icon: Map, label: 'Geospatial' }
            ].map((item, i) => (
                <Card key={i} className="bg-slate-950 border-slate-800 hover:bg-slate-900 cursor-pointer">
                    <CardContent className="p-4 flex flex-col items-center justify-center h-24">
                        <item.icon className="w-6 h-6 text-slate-400 mb-2" />
                        <span className="text-xs text-slate-300">{item.label}</span>
                    </CardContent>
                </Card>
            ))}
        </div>
    </div>
);

export default DataVisualization;