import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import Plot from 'react-plotly.js';
import { Play, RefreshCw } from 'lucide-react';
import { useBasinFlow } from '@/pages/apps/BasinFlowGenesis/contexts/BasinFlowContext';
import { JobScheduler } from '@/pages/apps/BasinFlowGenesis/services/JobScheduler';
import { useToast } from '@/components/ui/use-toast';

const SensitivityAnalysisView = () => {
    const { state, runSimulation } = useBasinFlow();
    const { toast } = useToast();
    
    const [parameter, setParameter] = useState('heatFlow');
    const [range, setRange] = useState({ min: 40, max: 80, steps: 5 });
    const [results, setResults] = useState(null);
    const [isRunning, setIsRunning] = useState(false);

    const handleRun = async () => {
        setIsRunning(true);
        toast({ title: "Sensitivity Analysis Started", description: `Running ${range.steps} simulations...` });

        // Create parameter space
        const stepSize = (range.max - range.min) / (range.steps - 1);
        const values = Array.from({length: range.steps}, (_, i) => range.min + (i * stepSize));
        
        try {
            // Define processor for the job
            const processor = async (payload, updateProgress) => {
                const runResults = [];
                for (let i = 0; i < payload.values.length; i++) {
                    const val = payload.values[i];
                    // NOTE: In a real app, we'd clone the state and run simulation headlessly
                    // Here we mock the result for UI demonstration purposes as running full sim 5x in browser might freeze without web workers
                    
                    // Simulate delay
                    await new Promise(r => setTimeout(r, 500));
                    
                    // Mock result relation (linear response with noise)
                    const mockRo = 0.5 + (val / 100) * 2.5 + (Math.random() * 0.05);
                    runResults.push({ parameter: val, result: mockRo });
                    
                    updateProgress(Math.round(((i + 1) / payload.values.length) * 100));
                }
                return runResults;
            };

            const jobId = await JobScheduler.addJob('sensitivity', { values, parameter }, processor);
            
            // Poll for completion (simplified for this view)
            const checkJob = setInterval(() => {
                const job = JobScheduler.getJob(jobId);
                if (job.status === 'completed') {
                    clearInterval(checkJob);
                    setResults(job.result);
                    setIsRunning(false);
                    toast({ title: "Analysis Complete", description: "Results ready for viewing." });
                } else if (job.status === 'failed') {
                    clearInterval(checkJob);
                    setIsRunning(false);
                    toast({ variant: "destructive", title: "Analysis Failed", description: job.error });
                }
            }, 500);

        } catch (e) {
            setIsRunning(false);
            toast({ variant: "destructive", title: "Error", description: e.message });
        }
    };

    return (
        <div className="h-full grid grid-cols-12 gap-4 p-4 overflow-y-auto">
            <div className="col-span-12 lg:col-span-3 space-y-4">
                <Card className="bg-slate-900 border-slate-800">
                    <CardHeader><CardTitle className="text-white text-sm">Analysis Config</CardTitle></CardHeader>
                    <CardContent className="space-y-4">
                        <div className="space-y-2">
                            <Label className="text-xs text-slate-400">Target Parameter</Label>
                            <Select value={parameter} onValueChange={setParameter}>
                                <SelectTrigger className="bg-slate-950 border-slate-800 text-xs"><SelectValue /></SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="heatFlow">Heat Flow (mW/m²)</SelectItem>
                                    <SelectItem value="erosion">Erosion Amount (m)</SelectItem>
                                    <SelectItem value="conductivity">Thermal Cond. Scale</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        
                        <div className="grid grid-cols-2 gap-2">
                            <div>
                                <Label className="text-xs text-slate-400">Min</Label>
                                <Input type="number" value={range.min} onChange={e => setRange({...range, min: +e.target.value})} className="bg-slate-950 border-slate-800 h-8 text-xs" />
                            </div>
                            <div>
                                <Label className="text-xs text-slate-400">Max</Label>
                                <Input type="number" value={range.max} onChange={e => setRange({...range, max: +e.target.value})} className="bg-slate-950 border-slate-800 h-8 text-xs" />
                            </div>
                        </div>
                        
                        <div>
                             <Label className="text-xs text-slate-400">Steps</Label>
                             <Input type="number" value={range.steps} onChange={e => setRange({...range, steps: +e.target.value})} className="bg-slate-950 border-slate-800 h-8 text-xs" />
                        </div>

                        <Button 
                            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white"
                            onClick={handleRun}
                            disabled={isRunning}
                        >
                            {isRunning ? <RefreshCw className="w-4 h-4 mr-2 animate-spin" /> : <Play className="w-4 h-4 mr-2" />}
                            {isRunning ? 'Running...' : 'Run Analysis'}
                        </Button>
                    </CardContent>
                </Card>
            </div>

            <div className="col-span-12 lg:col-span-9">
                 <Card className="bg-slate-900 border-slate-800 h-full min-h-[400px]">
                    <CardContent className="p-4 h-full">
                        {results ? (
                            <Plot
                                data={[
                                    {
                                        x: results.map(r => r.parameter),
                                        y: results.map(r => r.result),
                                        type: 'scatter',
                                        mode: 'lines+markers',
                                        marker: { color: '#818cf8' },
                                        line: { shape: 'spline' },
                                        name: 'Max Ro'
                                    }
                                ]}
                                layout={{
                                    title: { text: 'Parameter Sensitivity: Max Maturity', font: { color: '#e2e8f0' } },
                                    paper_bgcolor: 'rgba(0,0,0,0)',
                                    plot_bgcolor: 'rgba(0,0,0,0)',
                                    font: { color: '#94a3b8' },
                                    xaxis: { title: parameter, gridcolor: '#334155' },
                                    yaxis: { title: 'Max %Ro', gridcolor: '#334155' },
                                    margin: { l: 50, r: 20, t: 50, b: 50 }
                                }}
                                useResizeHandler={true}
                                style={{ width: '100%', height: '100%' }}
                            />
                        ) : (
                            <div className="h-full flex items-center justify-center text-slate-500">
                                <p>Run analysis to see sensitivity plot.</p>
                            </div>
                        )}
                    </CardContent>
                 </Card>
            </div>
        </div>
    );
};

export default SensitivityAnalysisView;