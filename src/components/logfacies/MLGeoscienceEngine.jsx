import React, { useState } from 'react';
import { Brain, Settings2, AlertTriangle, Layers, Activity, Zap } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

const MLGeoscienceEngine = () => {
    const [modelType, setModelType] = useState('xgb');
    const [confidenceThreshold, setConfidenceThreshold] = useState([0.7]);
    const [smoothing, setSmoothing] = useState([3]);

    return (
        <Card className="bg-slate-900 border-slate-800 h-full">
            <CardHeader>
                <CardTitle className="flex items-center gap-2 text-purple-400">
                    <Brain className="w-5 h-5" />
                    ML Engine Configuration
                </CardTitle>
                <CardDescription>Configure the probabilistic classification core</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
                <div className="space-y-4">
                    <div className="space-y-2">
                        <Label className="text-slate-200">Model Architecture</Label>
                        <Select value={modelType} onValueChange={setModelType}>
                            <SelectTrigger className="bg-slate-950 border-slate-700">
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent className="bg-slate-900 border-slate-700">
                                <SelectItem value="xgb">XGBoost (Gradient Boosting)</SelectItem>
                                <SelectItem value="rf">Random Forest Ensemble</SelectItem>
                                <SelectItem value="cnn">1D CNN (Sequence Aware)</SelectItem>
                                <SelectItem value="transformer">Litho-Transformer (Attention)</SelectItem>
                            </SelectContent>
                        </Select>
                        {modelType === 'transformer' && (
                            <div className="p-2 bg-purple-900/20 border border-purple-800 rounded text-xs text-purple-300 flex items-center gap-2">
                                <Zap className="w-3 h-3" /> High GPU usage expected
                            </div>
                        )}
                    </div>

                    <div className="space-y-4 pt-2">
                        <div className="flex justify-between items-center">
                            <Label className="text-slate-200">Confidence Threshold</Label>
                            <Badge variant="outline">{confidenceThreshold[0]}</Badge>
                        </div>
                        <Slider 
                            value={confidenceThreshold} 
                            onValueChange={setConfidenceThreshold} 
                            min={0} max={1} step={0.05} 
                            className="py-2"
                        />
                        <p className="text-xs text-slate-500">Predictions below this score are marked 'Uncertain'</p>
                    </div>

                    <div className="space-y-4 pt-2">
                        <div className="flex justify-between items-center">
                            <Label className="text-slate-200">Vertical Smoothing (Window)</Label>
                            <Badge variant="outline">{smoothing[0]} ft</Badge>
                        </div>
                        <Slider 
                            value={smoothing} 
                            onValueChange={setSmoothing} 
                            min={0} max={10} step={0.5} 
                            className="py-2"
                        />
                    </div>
                </div>

                <div className="space-y-4 pt-4 border-t border-slate-800">
                    <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                            <Label className="text-slate-200">Markov Chain Constraints</Label>
                            <p className="text-xs text-slate-500">Enforce logical vertical transitions</p>
                        </div>
                        <Switch defaultChecked />
                    </div>
                    <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                            <Label className="text-slate-200">Probabilistic Output</Label>
                            <p className="text-xs text-slate-500">Generate P10/P50/P90 facies vectors</p>
                        </div>
                        <Switch defaultChecked />
                    </div>
                    <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                            <Label className="text-slate-200">Class Balancing (SMOTE)</Label>
                            <p className="text-xs text-slate-500">Handle rare facies (e.g. Coal, Ash)</p>
                        </div>
                        <Switch defaultChecked />
                    </div>
                </div>

                <Button className="w-full mt-4 bg-purple-600 hover:bg-purple-700">
                    <Activity className="w-4 h-4 mr-2" /> Update Engine
                </Button>
            </CardContent>
        </Card>
    );
};

export default MLGeoscienceEngine;