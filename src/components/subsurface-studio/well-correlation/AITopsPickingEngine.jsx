import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { BrainCircuit, CheckCircle2, Play, Settings2, AlertTriangle } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { predictTopsAI } from '@/utils/wellCorrelationAI';

const AITopsPickingEngine = ({ selectedWells, availableCurves, onTopsFound }) => {
    const { toast } = useToast();
    const [targetCurve, setTargetCurve] = useState('GR');
    const [patternType, setPatternType] = useState('peak');
    const [confidenceThreshold, setConfidenceThreshold] = useState(0.7);
    const [isProcessing, setIsProcessing] = useState(false);
    const [progress, setProgress] = useState(0);
    const [results, setResults] = useState([]);

    const handleRunAI = async () => {
        if (selectedWells.length === 0) {
            toast({ variant: 'destructive', title: 'No Wells Selected', description: 'Please select wells in the main view first.' });
            return;
        }

        setIsProcessing(true);
        setProgress(0);
        setResults([]);

        // Simulate processing delay for realism
        const totalSteps = selectedWells.length;
        const newSuggestions = [];

        for (let i = 0; i < totalSteps; i++) {
            const well = selectedWells[i];
            
            // Simulate async worker
            await new Promise(resolve => setTimeout(resolve, 500)); 
            
            // Find curve data
            // Assuming well.log_data structure from WellCorrelationView
            const curveData = well.log_data?.[targetCurve];
            
            if (curveData) {
                const picks = predictTopsAI(curveData, patternType);
                const filteredPicks = picks.filter(p => p.confidence >= confidenceThreshold);
                
                if (filteredPicks.length > 0) {
                    newSuggestions.push({
                        wellId: well.id,
                        wellName: well.name,
                        picks: filteredPicks
                    });
                }
            }
            
            setProgress(((i + 1) / totalSteps) * 100);
        }

        setResults(newSuggestions);
        setIsProcessing(false);
        
        if (newSuggestions.length > 0) {
            toast({ 
                title: 'AI Analysis Complete', 
                description: `Found ${newSuggestions.reduce((acc, w) => acc + w.picks.length, 0)} potential tops across ${newSuggestions.length} wells.`,
                variant: 'default'
            });
        } else {
            toast({ title: 'No Tops Found', description: 'Try adjusting the confidence threshold or curve type.', variant: 'warning' });
        }
    };

    const handleApplyPicks = () => {
        onTopsFound(results);
        setResults([]);
        toast({ title: 'Picks Applied', description: 'AI suggestions have been added to your session as pending interpretations.' });
    };

    return (
        <Card className="bg-slate-900 border-slate-700 h-full flex flex-col">
            <CardHeader className="pb-2">
                <CardTitle className="text-sm font-bold flex items-center text-purple-400">
                    <BrainCircuit className="w-4 h-4 mr-2" /> AI Tops Picking
                </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 flex-grow overflow-y-auto">
                <div className="space-y-2">
                    <Label className="text-xs text-slate-400">Target Curve</Label>
                    <Select value={targetCurve} onValueChange={setTargetCurve}>
                        <SelectTrigger className="h-8 bg-slate-800 border-slate-600"><SelectValue /></SelectTrigger>
                        <SelectContent>
                            {availableCurves.map(c => (
                                <SelectItem key={c.name} value={c.name}>{c.name}</SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>

                <div className="space-y-2">
                    <Label className="text-xs text-slate-400">Pattern Recognition</Label>
                    <Select value={patternType} onValueChange={setPatternType}>
                        <SelectTrigger className="h-8 bg-slate-800 border-slate-600"><SelectValue /></SelectTrigger>
                        <SelectContent>
                            <SelectItem value="peak">Peaks (Maximal)</SelectItem>
                            <SelectItem value="trough">Troughs (Minimal)</SelectItem>
                            <SelectItem value="inflection">Inflection Points</SelectItem>
                        </SelectContent>
                    </Select>
                </div>

                <div className="space-y-2">
                    <div className="flex justify-between">
                        <Label className="text-xs text-slate-400">Confidence Threshold</Label>
                        <span className="text-xs font-mono text-purple-300">{(confidenceThreshold * 100).toFixed(0)}%</span>
                    </div>
                    <Slider 
                        value={[confidenceThreshold]} 
                        min={0.1} max={0.99} step={0.01} 
                        onValueChange={([v]) => setConfidenceThreshold(v)} 
                    />
                </div>

                {isProcessing ? (
                    <div className="space-y-2 py-4">
                        <div className="flex justify-between text-xs text-slate-400">
                            <span>Analyzing logs...</span>
                            <span>{Math.round(progress)}%</span>
                        </div>
                        <Progress value={progress} className="h-2" />
                    </div>
                ) : results.length > 0 ? (
                    <div className="space-y-3 animate-in fade-in">
                        <div className="bg-purple-500/10 border border-purple-500/30 rounded p-3">
                            <div className="flex items-center gap-2 text-purple-300 mb-2">
                                <CheckCircle2 className="w-4 h-4" />
                                <span className="text-sm font-bold">Results Ready</span>
                            </div>
                            <ul className="text-xs text-slate-400 space-y-1 max-h-32 overflow-y-auto">
                                {results.map(r => (
                                    <li key={r.wellId} className="flex justify-between">
                                        <span>{r.wellName}</span>
                                        <span className="text-purple-200">{r.picks.length} picks</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                        <Button onClick={handleApplyPicks} className="w-full bg-purple-600 hover:bg-purple-700 text-white">
                            Apply Suggestions
                        </Button>
                        <Button variant="ghost" onClick={() => setResults([])} className="w-full text-xs text-slate-500">
                            Discard Results
                        </Button>
                    </div>
                ) : (
                    <Button onClick={handleRunAI} className="w-full bg-slate-100 text-slate-900 hover:bg-slate-200 mt-2">
                        <Play className="w-4 h-4 mr-2" /> Run Analysis
                    </Button>
                )}
            </CardContent>
        </Card>
    );
};

export default AITopsPickingEngine;