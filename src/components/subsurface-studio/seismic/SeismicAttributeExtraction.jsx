import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Loader2, Zap, Layers } from 'lucide-react';
import { calculateEnvelope, calculateRMSAmplitude, calculateInstantaneousFrequency } from '@/utils/seismicAnalysisUtils';
import { useToast } from '@/components/ui/use-toast';

const SeismicAttributeExtraction = ({ seismicData, onAttributeGenerated }) => {
    const [attributeType, setAttributeType] = useState('rms');
    const [windowSize, setWindowSize] = useState(20);
    const [isProcessing, setIsProcessing] = useState(false);
    const { toast } = useToast();

    const handleExtract = async () => {
        if (!seismicData || !seismicData.traces) {
            toast({ title: "No Data", description: "Load seismic data first.", variant: "destructive" });
            return;
        }

        setIsProcessing(true);
        
        // Simulate async processing for UI responsiveness
        setTimeout(() => {
            try {
                let newTraces = [];
                if (attributeType === 'rms') {
                    newTraces = calculateRMSAmplitude(seismicData.traces, windowSize);
                } else if (attributeType === 'envelope') {
                    newTraces = calculateEnvelope(seismicData.traces);
                } else if (attributeType === 'instant_freq') {
                    newTraces = calculateInstantaneousFrequency(seismicData.traces);
                }

                // Calculate new stats
                let min = Infinity, max = -Infinity;
                newTraces.forEach(t => {
                    for(let v of t) {
                        if (v < min) min = v;
                        if (v > max) max = v;
                    }
                });

                const resultData = {
                    ...seismicData,
                    traces: newTraces,
                    stats: { ...seismicData.stats, min, max },
                    attribute: attributeType
                };

                onAttributeGenerated(resultData, attributeType);
                toast({ title: "Extraction Complete", description: `${attributeType.toUpperCase()} attribute generated.` });
            } catch (e) {
                console.error(e);
                toast({ title: "Error", description: "Attribute extraction failed.", variant: "destructive" });
            } finally {
                setIsProcessing(false);
            }
        }, 100);
    };

    return (
        <Card className="bg-slate-900 border-slate-800 shadow-none">
            <CardHeader className="pb-2 p-3">
                <CardTitle className="text-xs font-bold flex items-center text-orange-400 uppercase">
                    <Zap className="w-3 h-3 mr-2" /> Attribute Engine
                </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 p-3">
                <div className="space-y-2">
                    <Label className="text-xs text-slate-400">Attribute Type</Label>
                    <Select value={attributeType} onValueChange={setAttributeType}>
                        <SelectTrigger className="h-8 bg-slate-800 border-slate-700 text-xs">
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent className="bg-slate-800 border-slate-700 text-white">
                            <SelectItem value="rms">RMS Amplitude</SelectItem>
                            <SelectItem value="envelope">Instantaneous Envelope (Strength)</SelectItem>
                            <SelectItem value="instant_freq">Instantaneous Frequency</SelectItem>
                            <SelectItem value="sweetness">Sweetness</SelectItem>
                        </SelectContent>
                    </Select>
                </div>

                {attributeType === 'rms' && (
                    <div className="space-y-2">
                        <div className="flex justify-between text-xs text-slate-400">
                            <span>Window Size</span>
                            <span>{windowSize} samples</span>
                        </div>
                        <Slider 
                            value={[windowSize]} 
                            min={5} max={100} step={5} 
                            onValueChange={([v]) => setWindowSize(v)}
                            className="py-2"
                        />
                    </div>
                )}

                <Button 
                    onClick={handleExtract} 
                    disabled={isProcessing || !seismicData} 
                    className="w-full h-8 text-xs bg-orange-600 hover:bg-orange-700 text-white"
                >
                    {isProcessing ? <Loader2 className="w-3 h-3 mr-2 animate-spin" /> : <Layers className="w-3 h-3 mr-2" />}
                    Generate Attribute
                </Button>
            </CardContent>
        </Card>
    );
};

export default SeismicAttributeExtraction;