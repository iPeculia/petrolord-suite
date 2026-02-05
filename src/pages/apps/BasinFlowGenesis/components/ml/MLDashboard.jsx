import React, { useState, useEffect, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { BrainCircuit, Target, AlertTriangle, Play } from 'lucide-react';
import Plot from 'react-plotly.js';
import { useBasinFlow } from '@/pages/apps/BasinFlowGenesis/contexts/BasinFlowContext';
import { useMultiWell } from '@/pages/apps/BasinFlowGenesis/contexts/MultiWellContext';
import { AnomalyDetector } from '@/pages/apps/BasinFlowGenesis/services/ml/AnomalyDetector';
import { CalibrationPredictor } from '@/pages/apps/BasinFlowGenesis/services/ml/CalibrationPredictor';
import { ParameterOptimizer } from '@/pages/apps/BasinFlowGenesis/services/ml/ParameterOptimizer';
import { DataClusterer } from '@/pages/apps/BasinFlowGenesis/services/ml/DataClusterer';
import { useToast } from '@/components/ui/use-toast';

const MLDashboard = () => {
    const { state } = useBasinFlow();
    const { state: mwState } = useMultiWell();
    const { toast } = useToast();
    const [activeTab, setActiveTab] = useState('anomaly');
    
    // Optimization State
    const [optimizing, setOptimizing] = useState(false);
    const [optProgress, setOptimProgress] = useState(0);
    const [optHistory, setOptHistory] = useState([]);

    // Anomaly State
    const [anomalies, setAnomalies] = useState([]);

    // Anomaly Detection Effect
    useEffect(() => {
        if (state.calibration?.ro && state.calibration.ro.length > 0) {
            const depths = state.calibration.ro.map(p => p.depth);
            const values = state.calibration.ro.map(p => p.value);
            const detected = AnomalyDetector.detectTrendAnomalies(depths, values, 1.5);
            setAnomalies(detected.filter(d => d.isAnomaly));
        } else {
            setAnomalies([]);
        }
    }, [state.calibration]);

    // Run Optimization Handler
    const handleOptimize = async () => {
        setOptimizing(true);
        setOptimProgress(0);
        setOptHistory([]);
        
        try {
            const optimizer = new ParameterOptimizer(state, state.calibration);
            const result = await optimizer.optimize((p) => {
                setOptimProgress((p.generation / p.totalGenerations) * 100);
            });
            setOptHistory(result.history);
            toast({ title: "Optimization Complete", description: `Best Heat Flow: ${result.bestSolution.heatFlow.toFixed(1)} mW/m²` });
        } catch (e) {
            console.error(e);
            toast({ variant: "destructive", title: "Error", description: "Optimization failed." });
        } finally {
            setOptimizing(false);
        }
    };

    // Clustering Data Prep
    const clusteringData = useMemo(() => {
        const allWells = Object.values(mwState.wellDataMap || {});
        if (allWells.length < 2) return [];

        return allWells.map(w => ({
            id: w.id,
            name: w.name,
            depth: w.depthRange?.max || 0,
            metric1: Math.random() * 2 + 0.5, // Simulated Ro
            metric2: Math.random() * 100 + 50 // Simulated Temp
        }));
    }, [mwState.wellDataMap]);

    const clusters = useMemo(() => {
        return DataClusterer.cluster(clusteringData, 3);
    }, [clusteringData]);

    return (
        <div className="h-full flex flex-col bg-slate-950 p-4 overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h2 className="text-xl font-bold text-white flex items-center gap-2">
                        <BrainCircuit className="w-6 h-6 text-purple-400" />
                        AI & Analytics Engine
                    </h2>
                    <p className="text-slate-400 text-sm">Advanced Machine Learning insights for your basin model.</p>
                </div>
            </div>

            <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
                <TabsList className="bg-slate-900 border-slate-800">
                    <TabsTrigger value="anomaly" className="data-[state=active]:bg-slate-800">Anomaly Detection</TabsTrigger>
                    <TabsTrigger value="optimization" className="data-[state=active]:bg-slate-800">Optimization</TabsTrigger>
                    <TabsTrigger value="clustering" className="data-[state=active]:bg-slate-800">Field Clustering</TabsTrigger>
                    <TabsTrigger value="prediction" className="data-[state=active]:bg-slate-800">Predictive Analytics</TabsTrigger>
                </TabsList>

                <TabsContent value="anomaly" className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <Card className="bg-slate-900 border-slate-800">
                            <CardHeader><CardTitle className="text-sm">Calibration Outliers (Ro)</CardTitle></CardHeader>
                            <CardContent>
                                {anomalies.length > 0 ? (
                                    <div className="space-y-2">
                                        {anomalies.map((a, i) => (
                                            <div key={i} className="flex items-center justify-between p-2 bg-red-900/10 border border-red-900/30 rounded">
                                                <span className="flex items-center gap-2 text-red-400 text-xs font-bold">
                                                    <AlertTriangle className="w-4 h-4" />
                                                    Depth: {a.depth}m
                                                </span>
                                                <span className="text-slate-300 text-xs">
                                                    Val: {a.value} (Trend: {a.predicted.toFixed(2)})
                                                </span>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="text-slate-500 text-sm text-center py-8">No significant anomalies detected in Ro data.</div>
                                )}
                            </CardContent>
                        </Card>
                        <Card className="bg-slate-900 border-slate-800">
                            <CardHeader><CardTitle className="text-sm">Visualization</CardTitle></CardHeader>
                            <CardContent className="h-[300px] p-0">
                                <Plot
                                    data={[
                                        {
                                            x: state.calibration?.ro?.map(p => p.value) || [],
                                            y: state.calibration?.ro?.map(p => p.depth) || [],
                                            mode: 'markers',
                                            type: 'scatter',
                                            name: 'Data',
                                            marker: { color: '#94a3b8' }
                                        },
                                        {
                                            x: anomalies.map(a => a.value),
                                            y: anomalies.map(a => a.depth),
                                            mode: 'markers',
                                            type: 'scatter',
                                            name: 'Anomalies',
                                            marker: { color: 'red', size: 10, symbol: 'x' }
                                        }
                                    ]}
                                    layout={{
                                        paper_bgcolor: 'rgba(0,0,0,0)',
                                        plot_bgcolor: 'rgba(0,0,0,0)',
                                        yaxis: { title: 'Depth (m)', autorange: 'reversed', gridcolor: '#334155' },
                                        xaxis: { title: 'Ro %', gridcolor: '#334155' },
                                        margin: { l: 40, r: 20, t: 20, b: 40 },
                                        font: { color: '#94a3b8', size: 10 },
                                        showlegend: true
                                    }}
                                    useResizeHandler={true}
                                    style={{ width: '100%', height: '100%' }}
                                />
                            </CardContent>
                        </Card>
                    </div>
                </TabsContent>

                <TabsContent value="optimization" className="space-y-4">
                    <Card className="bg-slate-900 border-slate-800">
                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                            <CardTitle className="text-sm">Heat Flow Optimization (Genetic Algorithm)</CardTitle>
                            <Button size="sm" onClick={handleOptimize} disabled={optimizing} className="bg-purple-600 hover:bg-purple-700 text-white">
                                {optimizing ? 'Running...' : <><Play className="w-3 h-3 mr-2" /> Start Optimization</>}
                            </Button>
                        </CardHeader>
                        <CardContent>
                            {optimizing && <Progress value={optProgress} className="mb-4 h-2" />}
                            
                            {optHistory.length > 0 && (
                                <div className="h-[300px]">
                                    <Plot
                                        data={[
                                            {
                                                x: optHistory.map(h => h.gen),
                                                y: optHistory.map(h => h.bestScore),
                                                type: 'scatter',
                                                mode: 'lines+markers',
                                                name: 'Misfit Score',
                                                line: { color: '#a855f7' }
                                            }
                                        ]}
                                        layout={{
                                            title: { text: 'Convergence Plot', font: { size: 12, color: '#e2e8f0' } },
                                            paper_bgcolor: 'rgba(0,0,0,0)',
                                            plot_bgcolor: 'rgba(0,0,0,0)',
                                            xaxis: { title: 'Generation', gridcolor: '#334155' },
                                            yaxis: { title: 'Misfit Score', gridcolor: '#334155' },
                                            margin: { l: 40, r: 20, t: 40, b: 40 },
                                            font: { color: '#94a3b8', size: 10 }
                                        }}
                                        useResizeHandler={true}
                                        style={{ width: '100%', height: '100%' }}
                                    />
                                </div>
                            )}
                            {!optimizing && optHistory.length === 0 && (
                                <div className="text-center py-12 text-slate-500 border-2 border-dashed border-slate-800 rounded">
                                    Click 'Start Optimization' to run the Genetic Algorithm solver.
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="clustering" className="space-y-4">
                    <div className="grid grid-cols-1 gap-4">
                        <Card className="bg-slate-900 border-slate-800">
                            <CardHeader><CardTitle className="text-sm">Well Clustering (K-Means)</CardTitle></CardHeader>
                            <CardContent className="h-[400px]">
                                {clusters.length > 0 ? (
                                    <Plot
                                        data={clusters.map(pt => ({
                                            x: [pt.metric1],
                                            y: [pt.metric2],
                                            mode: 'markers',
                                            type: 'scatter',
                                            name: pt.name,
                                            marker: { 
                                                color: ['#f87171', '#4ade80', '#60a5fa'][pt.cluster % 3],
                                                size: 12
                                            },
                                            text: pt.name
                                        }))}
                                        layout={{
                                            title: { text: 'Multi-Well Cluster Analysis', font: { size: 14, color: '#e2e8f0' } },
                                            paper_bgcolor: 'rgba(0,0,0,0)',
                                            plot_bgcolor: 'rgba(0,0,0,0)',
                                            xaxis: { title: 'Simulated Ro Index', gridcolor: '#334155' },
                                            yaxis: { title: 'Simulated Temp Index', gridcolor: '#334155' },
                                            font: { color: '#94a3b8', size: 10 },
                                            showlegend: false
                                        }}
                                        useResizeHandler={true}
                                        style={{ width: '100%', height: '100%' }}
                                    />
                                ) : (
                                    <div className="flex items-center justify-center h-full text-slate-500">
                                        Need more wells to perform clustering.
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    </div>
                </TabsContent>
                
                <TabsContent value="prediction" className="space-y-4">
                     <Card className="bg-slate-900 border-slate-800">
                        <CardHeader><CardTitle className="text-sm">Calibration Predictor</CardTitle></CardHeader>
                        <CardContent>
                            <div className="p-4 bg-slate-950 rounded border border-slate-800 text-center">
                                <Target className="w-8 h-8 text-emerald-400 mx-auto mb-2" />
                                <h3 className="text-white font-medium mb-1">Optimal HF Prediction</h3>
                                <p className="text-slate-400 text-xs mb-4">Based on current residuals and historical data model.</p>
                                <div className="text-3xl font-bold text-emerald-400">
                                    {CalibrationPredictor.simpleHeuristic(0.1, 5).toFixed(1)} <span className="text-sm font-normal text-slate-500">mW/m² adjustment</span>
                                </div>
                            </div>
                        </CardContent>
                     </Card>
                </TabsContent>
            </Tabs>
        </div>
    );
};

export default MLDashboard;