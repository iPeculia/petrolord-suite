import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import PlotlyChartFactory from './charts/PlotlyChartFactory';
import { Sliders, GitCompare } from 'lucide-react';

const SensitivityAnalysis = () => {
    const [activeTab, setActiveTab] = useState('tornado');

    // Tornado Diagram Data
    const tornadoData = [
        { param: 'Pore Pressure', low: 11.5, high: 13.2, base: 12.4 },
        { param: 'UCS', low: 12.0, high: 12.8, base: 12.4 },
        { param: 'Friction Angle', low: 12.2, high: 12.6, base: 12.4 },
        { param: 'Max Horiz Stress', low: 11.8, high: 13.0, base: 12.4 },
    ];

    const tornadoTraces = [
        {
            type: 'bar',
            y: tornadoData.map(d => d.param),
            x: tornadoData.map(d => d.low - d.base),
            base: tornadoData.map(d => d.base),
            orientation: 'h',
            name: 'Low Case (-20%)',
            marker: { color: '#3b82f6' }
        },
        {
            type: 'bar',
            y: tornadoData.map(d => d.param),
            x: tornadoData.map(d => d.high - d.base),
            base: tornadoData.map(d => d.base), // This logic is slightly simplified for Plotly bar base
            orientation: 'h',
            name: 'High Case (+20%)',
            marker: { color: '#ef4444' }
        }
    ];
    // Correct Tornado logic for Plotly: Base is effectively 0 in relative mode, 
    // but to show centered on base value we need a different approach or just show delta.
    // Let's show Delta for clarity.
    const tornadoDeltaTraces = [
        {
            type: 'bar',
            y: tornadoData.map(d => d.param),
            x: tornadoData.map(d => d.low - d.base),
            orientation: 'h',
            name: 'Negative Impact',
            marker: { color: '#3b82f6' }
        },
        {
            type: 'bar',
            y: tornadoData.map(d => d.param),
            x: tornadoData.map(d => d.high - d.base),
            orientation: 'h',
            name: 'Positive Impact',
            marker: { color: '#ef4444' }
        }
    ];


    // Spider Plot Data
    const spiderTraces = [
        {
            type: 'scatterpolar',
            r: [0.8, 0.9, 0.95, 1.0, 1.1, 1.2],
            theta: ['Pp', 'Sv', 'SHmax', 'Shmin', 'UCS', 'FA'],
            fill: 'toself',
            name: 'Safe Case'
        },
        {
            type: 'scatterpolar',
            r: [1.1, 1.0, 1.05, 1.0, 0.9, 0.8],
            theta: ['Pp', 'Sv', 'SHmax', 'Shmin', 'UCS', 'FA'],
            fill: 'toself',
            name: 'Critical Case'
        }
    ];

    return (
        <div className="h-full p-4 bg-slate-950 space-y-4 overflow-y-auto">
            <h2 className="text-lg font-bold text-slate-200 flex items-center">
                <Sliders className="w-5 h-5 mr-2 text-purple-400" /> Sensitivity Analysis
            </h2>
            
            <Tabs value={activeTab} onValueChange={setActiveTab}>
                <TabsList className="bg-slate-900 border border-slate-800">
                    <TabsTrigger value="tornado">Tornado Diagram</TabsTrigger>
                    <TabsTrigger value="spider">Spider Plot</TabsTrigger>
                </TabsList>

                <TabsContent value="tornado" className="mt-4">
                    <Card className="bg-slate-900 border-slate-800">
                        <CardHeader><CardTitle className="text-sm text-slate-300">Parameter Impact on MW Window (ppg)</CardTitle></CardHeader>
                        <CardContent className="h-96">
                            <PlotlyChartFactory 
                                data={tornadoDeltaTraces} 
                                layout={{
                                    barmode: 'relative',
                                    xaxis: { title: 'Change in Critical Mud Weight (ppg)' },
                                    yaxis: { title: '' },
                                    margin: { l: 120 }
                                }} 
                            />
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="spider" className="mt-4">
                    <Card className="bg-slate-900 border-slate-800">
                        <CardHeader><CardTitle className="text-sm text-slate-300">Multi-Parametric Risk Envelope</CardTitle></CardHeader>
                        <CardContent className="h-96">
                            <PlotlyChartFactory 
                                data={spiderTraces} 
                                layout={{
                                    polar: {
                                        radialaxis: { visible: true, range: [0, 1.5] },
                                        bgcolor: 'rgba(0,0,0,0)'
                                    }
                                }} 
                            />
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    );
};

export default SensitivityAnalysis;