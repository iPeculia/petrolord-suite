import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { BarChart3, PieChart, LineChart, ScatterChart } from 'lucide-react';
import { LineChart as LC, ScatterChart as SC } from 'lucide-react'; // Moved import to top

const CustomVisualizationBuilder = () => {
    return (
        <div className="h-full p-1 flex flex-col">
            <div className="mb-4">
                <h3 className="text-lg font-bold text-slate-200 flex items-center">
                    <BarChart3 className="w-5 h-5 mr-2 text-blue-400" /> Viz Studio
                </h3>
                <p className="text-xs text-slate-400">Design custom charts using D3.js and Plotly templates.</p>
            </div>
            
            <div className="grid grid-cols-4 gap-4 mb-6">
                 {[
                    { icon: BarChart3, label: 'Bar Chart' },
                    { icon: LineChart, label: 'Time Series' },
                    { icon: PieChart, label: 'Donut/Pie' },
                    { icon: ScatterChart, label: 'Crossplot' }
                 ].map((type, i) => (
                     <Card key={i} className="bg-slate-900 border-slate-800 hover:bg-slate-800 cursor-pointer transition-colors text-center py-4">
                         <div className="flex justify-center mb-2 text-slate-400"><type.icon className="w-6 h-6"/></div>
                         <div className="text-xs font-medium text-slate-300">{type.label}</div>
                     </Card>
                 ))}
            </div>

            <Card className="flex-grow bg-slate-950 border-slate-800 flex items-center justify-center">
                <div className="text-slate-500 text-sm">Select a visualization type to begin configuration</div>
            </Card>
        </div>
    );
};

export default CustomVisualizationBuilder;