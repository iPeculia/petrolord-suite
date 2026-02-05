import React, { useState } from 'react';
import { useExpertMode } from '../../contexts/ExpertModeContext';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Play, Loader2, BarChart2 } from 'lucide-react';
import Plot from 'react-plotly.js';

const SensitivityAnalysis = () => {
    const { state, runSensitivityAnalysis } = useExpertMode();
    const [isRunning, setIsRunning] = useState(false);
    const [results, setResults] = useState(null);

    const handleRun = async () => {
        setIsRunning(true);
        const data = await runSensitivityAnalysis();
        setResults(data);
        setIsRunning(false);
    };

    return (
        <div className="h-full flex flex-col bg-slate-950">
            <div className="p-4 border-b border-slate-800 bg-slate-900/50">
                <h3 className="text-sm font-bold text-slate-200 mb-4">Sensitivity Analysis</h3>
                
                <div className="flex items-end gap-4 p-3 bg-slate-900 border border-slate-800 rounded-lg">
                    <div className="flex-1 space-y-2">
                         <Label className="text-xs text-slate-400">Parameter to Vary</Label>
                         <Select defaultValue="heatFlow">
                            <SelectTrigger className="h-8 bg-slate-950 border-slate-800 text-xs">
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="heatFlow">Basal Heat Flow</SelectItem>
                                <SelectItem value="erosion">Erosion Amount</SelectItem>
                                <SelectItem value="conductivity">Thermal Conductivity</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="w-24 space-y-2">
                         <Label className="text-xs text-slate-400">Min Value</Label>
                         <Input className="h-8 bg-slate-950 border-slate-800 text-xs font-mono" defaultValue="40" />
                    </div>
                    <div className="w-24 space-y-2">
                         <Label className="text-xs text-slate-400">Max Value</Label>
                         <Input className="h-8 bg-slate-950 border-slate-800 text-xs font-mono" defaultValue="80" />
                    </div>
                    <Button 
                        onClick={handleRun} 
                        disabled={isRunning}
                        className="bg-indigo-600 hover:bg-indigo-700 text-white h-8 text-xs w-32"
                    >
                        {isRunning ? <Loader2 className="w-3 h-3 animate-spin mr-2"/> : <Play className="w-3 h-3 mr-2"/>}
                        Run Analysis
                    </Button>
                </div>
            </div>

            <div className="flex-1 p-4 overflow-y-auto">
                {!results ? (
                    <div className="h-full flex flex-col items-center justify-center text-slate-500 opacity-50">
                        <BarChart2 className="w-16 h-16 mb-4 text-slate-700"/>
                        <p className="text-sm">Configure parameters and run analysis to view results.</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 gap-6">
                        {/* Tornado Chart */}
                        <div className="bg-slate-900 border border-slate-800 rounded-lg p-2 h-[300px] relative overflow-hidden">
                            <div className="absolute top-2 left-2 z-10 bg-slate-950/80 px-2 py-1 rounded text-xs font-bold text-slate-400">Parameter Impact (Tornado)</div>
                            <Plot
                                data={[{
                                    type: 'bar',
                                    x: results.tornado.map(i => i.impact),
                                    y: results.tornado.map(i => i.parameter),
                                    orientation: 'h',
                                    marker: {
                                        color: results.tornado.map(i => i.impact > 0.5 ? '#ef4444' : '#3b82f6')
                                    }
                                }]}
                                layout={{
                                    autosize: true,
                                    margin: { l: 100, r: 20, t: 40, b: 40 },
                                    paper_bgcolor: 'rgba(0,0,0,0)',
                                    plot_bgcolor: 'rgba(0,0,0,0)',
                                    font: { color: '#94a3b8', size: 10 },
                                    xaxis: { title: 'Impact on Ro (%)', gridcolor: '#1e293b' },
                                    yaxis: { gridcolor: '#1e293b' }
                                }}
                                useResizeHandler={true}
                                className="w-full h-full"
                            />
                        </div>
                        
                        {/* Variation Plot */}
                        <div className="bg-slate-900 border border-slate-800 rounded-lg p-2 h-[300px] relative overflow-hidden">
                            <div className="absolute top-2 left-2 z-10 bg-slate-950/80 px-2 py-1 rounded text-xs font-bold text-slate-400">Sensitivity Results</div>
                             <Plot
                                data={[{
                                    x: [40, 50, 60, 70, 80],
                                    y: [0.5, 0.65, 0.85, 1.05, 1.2],
                                    type: 'scatter',
                                    mode: 'lines+markers',
                                    line: { color: '#10b981', width: 3 }
                                }]}
                                layout={{
                                    autosize: true,
                                    margin: { l: 50, r: 20, t: 40, b: 40 },
                                    paper_bgcolor: 'rgba(0,0,0,0)',
                                    plot_bgcolor: 'rgba(0,0,0,0)',
                                    font: { color: '#94a3b8', size: 10 },
                                    xaxis: { title: 'Heat Flow (mW/m²)', gridcolor: '#1e293b' },
                                    yaxis: { title: 'Vitrinite Reflectance (%)', gridcolor: '#1e293b' }
                                }}
                                useResizeHandler={true}
                                className="w-full h-full"
                            />
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default SensitivityAnalysis;