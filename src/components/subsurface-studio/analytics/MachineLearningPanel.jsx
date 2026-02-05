import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { Brain, Play, RefreshCw, Save } from 'lucide-react';
import PlotlyChartFactory from './charts/PlotlyChartFactory';

// Simple mock regression logic in JS
const simpleLinearRegression = (x, y) => {
    const n = x.length;
    const sumX = x.reduce((a, b) => a + b, 0);
    const sumY = y.reduce((a, b) => a + b, 0);
    const sumXY = x.reduce((sum, xi, i) => sum + xi * y[i], 0);
    const sumXX = x.reduce((sum, xi) => sum + xi * xi, 0);
    
    const slope = (n * sumXY - sumX * sumY) / (n * sumXX - sumX * sumX);
    const intercept = (sumY - slope * sumX) / n;
    
    return { slope, intercept };
};

const MachineLearningPanel = () => {
    const [modelType, setModelType] = useState('linear');
    const [status, setStatus] = useState('idle');
    const [progress, setProgress] = useState(0);
    const [prediction, setPrediction] = useState(null);

    const handleTrain = () => {
        setStatus('training');
        setProgress(0);
        const interval = setInterval(() => {
            setProgress(prev => {
                if (prev >= 100) {
                    clearInterval(interval);
                    setStatus('ready');
                    return 100;
                }
                return prev + 10;
            });
        }, 200);
    };

    const handlePredict = () => {
        // Generate mock prediction data
        const x = Array.from({length: 50}, (_, i) => i);
        const yActual = x.map(v => 2 * v + 5 + (Math.random() - 0.5) * 10);
        const { slope, intercept } = simpleLinearRegression(x, yActual);
        const yPred = x.map(v => slope * v + intercept);

        setPrediction({
            x, yActual, yPred, 
            metrics: {
                rmse: 2.45,
                r2: 0.89
            }
        });
    };

    return (
        <div className="h-full p-4 bg-slate-950 space-y-4 overflow-y-auto">
            <div className="flex justify-between items-center">
                <h2 className="text-lg font-bold text-slate-200 flex items-center">
                    <Brain className="w-5 h-5 mr-2 text-pink-400" /> ML Prediction Engine
                </h2>
                <div className="flex gap-2">
                    <Button variant="outline" size="sm" disabled={status !== 'ready'}>
                        <Save className="w-4 h-4 mr-2" /> Save Model
                    </Button>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card className="bg-slate-900 border-slate-800 md:col-span-1">
                    <CardHeader><CardTitle className="text-sm text-slate-300">Configuration</CardTitle></CardHeader>
                    <CardContent className="space-y-4">
                        <div className="space-y-2">
                            <Label className="text-xs text-slate-400">Algorithm</Label>
                            <Select value={modelType} onValueChange={setModelType}>
                                <SelectTrigger className="bg-slate-950 border-slate-800"><SelectValue /></SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="linear">Linear Regression</SelectItem>
                                    <SelectItem value="rf">Random Forest (Simulated)</SelectItem>
                                    <SelectItem value="nn">Neural Network (Simulated)</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-2">
                            <Label className="text-xs text-slate-400">Target Variable</Label>
                            <Select defaultValue="dt">
                                <SelectTrigger className="bg-slate-950 border-slate-800"><SelectValue /></SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="dt">DTC (Compressional Sonic)</SelectItem>
                                    <SelectItem value="dts">DTS (Shear Sonic)</SelectItem>
                                    <SelectItem value="rhob">RHOB (Density)</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        
                        {status === 'training' && (
                            <div className="space-y-1">
                                <div className="flex justify-between text-[10px] text-slate-400"><span>Training...</span><span>{progress}%</span></div>
                                <Progress value={progress} className="h-1.5" />
                            </div>
                        )}

                        <div className="flex gap-2">
                            <Button className="flex-1 bg-pink-600 hover:bg-pink-700" onClick={handleTrain} disabled={status === 'training'}>
                                <RefreshCw className="w-4 h-4 mr-2" /> Train
                            </Button>
                            <Button className="flex-1 bg-blue-600 hover:bg-blue-700" onClick={handlePredict} disabled={status !== 'ready'}>
                                <Play className="w-4 h-4 mr-2" /> Predict
                            </Button>
                        </div>
                    </CardContent>
                </Card>

                <Card className="bg-slate-900 border-slate-800 md:col-span-2">
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm text-slate-300">Model Performance</CardTitle>
                        {prediction && (
                            <div className="flex gap-4 text-xs">
                                <span className="text-green-400">R²: {prediction.metrics.r2}</span>
                                <span className="text-yellow-400">RMSE: {prediction.metrics.rmse}</span>
                            </div>
                        )}
                    </CardHeader>
                    <CardContent className="h-80">
                        {prediction ? (
                            <PlotlyChartFactory 
                                data={[
                                    { x: prediction.x, y: prediction.yActual, type: 'scatter', mode: 'markers', name: 'Actual Data', marker: { color: '#94a3b8', size: 6, opacity: 0.6 } },
                                    { x: prediction.x, y: prediction.yPred, type: 'scatter', mode: 'lines', name: 'Predicted', line: { color: '#ec4899', width: 3 } }
                                ]}
                                layout={{
                                    xaxis: { title: 'Input Feature' },
                                    yaxis: { title: 'Target Property' }
                                }}
                            />
                        ) : (
                            <div className="h-full flex items-center justify-center text-slate-500 text-sm border border-dashed border-slate-800 rounded">
                                Train and run prediction to visualize results.
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </div>
    );
};

export default MachineLearningPanel;