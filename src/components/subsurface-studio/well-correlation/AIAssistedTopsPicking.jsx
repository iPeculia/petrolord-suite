import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Card, CardContent } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { BrainCircuit, Check, X, AlertCircle, Loader2 } from 'lucide-react';
import { predictTops } from '@/utils/wellCorrelationUtils'; // Moved import to top of file

const AIAssistedTopsPicking = ({ selectedWells, onAcceptPrediction }) => {
    const [isProcessing, setIsProcessing] = useState(false);
    const [predictions, setPredictions] = useState([]);
    const [progress, setProgress] = useState(0);

    const runPrediction = async () => {
        setIsProcessing(true);
        setProgress(0);
        setPredictions([]);

        // Simulate batch processing progress
        const totalSteps = 10;
        let currentStep = 0;
        
        const interval = setInterval(() => {
            currentStep++;
            setProgress((currentStep / totalSteps) * 100);
            
            if (currentStep >= totalSteps) {
                clearInterval(interval);
                // Finish
                setTimeout(() => {
                    const allPreds = [];
                    selectedWells.forEach(well => {
                        const wellPreds = predictTops(well.log_data || {}, well.meta?.tops || []);
                        wellPreds.forEach(p => allPreds.push({...p, wellName: well.name, wellId: well.id}));
                    });
                    setPredictions(allPreds);
                    setIsProcessing(false);
                }, 500);
            }
        }, 200);
    };

    const handleAccept = (pred, index) => {
        onAcceptPrediction(pred);
        setPredictions(prev => prev.filter((_, i) => i !== index));
    };

    const handleReject = (index) => {
        setPredictions(prev => prev.filter((_, i) => i !== index));
    };

    const getConfidenceColor = (conf) => {
        if (conf > 0.85) return "bg-green-500/20 text-green-400 border-green-500/50";
        if (conf > 0.6) return "bg-yellow-500/20 text-yellow-400 border-yellow-500/50";
        return "bg-red-500/20 text-red-400 border-red-500/50";
    };

    return (
        <div className="p-4 space-y-4 border-t border-slate-800">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-green-400 font-semibold">
                    <BrainCircuit className="w-4 h-4"/>
                    <h3>AI Auto-Picker</h3>
                </div>
                {predictions.length > 0 && <Badge variant="secondary" className="text-[10px]">{predictions.length} found</Badge>}
            </div>

            {!isProcessing && predictions.length === 0 && (
                <div className="space-y-2">
                    <p className="text-[10px] text-slate-500">
                        Detect formation tops automatically using pattern recognition across selected wells.
                    </p>
                    <Button 
                        onClick={runPrediction} 
                        className="w-full bg-green-600 hover:bg-green-700 text-white text-xs h-8"
                        disabled={selectedWells.length === 0}
                    >
                        {selectedWells.length === 0 ? "Select Wells First" : "Run Detection"}
                    </Button>
                </div>
            )}

            {isProcessing && (
                <div className="space-y-2 py-4">
                    <div className="flex justify-between text-xs text-slate-400">
                        <span className="flex items-center gap-2"><Loader2 className="w-3 h-3 animate-spin"/> Processing logs...</span>
                        <span>{Math.round(progress)}%</span>
                    </div>
                    <Progress value={progress} className="h-1.5" />
                </div>
            )}

            {predictions.length > 0 && (
                <ScrollArea className="h-64 pr-2">
                    <div className="space-y-2">
                        {predictions.map((pred, idx) => (
                            <Card key={idx} className="bg-slate-800/50 border-slate-700">
                                <CardContent className="p-2">
                                    <div className="flex justify-between items-start mb-2">
                                        <div>
                                            <div className="text-xs font-bold text-white">{pred.name}</div>
                                            <div className="text-[10px] text-slate-400">{pred.wellName}</div>
                                        </div>
                                        <Badge variant="outline" className={`text-[10px] h-5 ${getConfidenceColor(pred.confidence)}`}>
                                            {(pred.confidence * 100).toFixed(0)}% Conf.
                                        </Badge>
                                    </div>
                                    <div className="flex items-center justify-between bg-slate-900/50 p-1.5 rounded mb-2">
                                        <span className="text-[10px] text-slate-500">MD</span>
                                        <span className="text-xs font-mono text-slate-200">{pred.md.toFixed(1)} m</span>
                                    </div>
                                    <div className="flex gap-2">
                                        <Button size="sm" className="flex-1 h-7 bg-green-600/20 text-green-400 hover:bg-green-600/40 hover:text-green-300 border border-green-600/20" onClick={() => handleAccept(pred, idx)}>
                                            <Check className="w-3 h-3 mr-1" /> Accept
                                        </Button>
                                        <Button size="sm" variant="outline" className="h-7 px-3 border-red-500/20 text-red-400 hover:bg-red-900/20" onClick={() => handleReject(idx)}>
                                            <X className="w-3 h-3" />
                                        </Button>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </ScrollArea>
            )}
        </div>
    );
};

export default AIAssistedTopsPicking;