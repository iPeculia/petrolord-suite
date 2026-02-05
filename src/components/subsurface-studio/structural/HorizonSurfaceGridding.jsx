import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Grid, Play, Loader2 } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

const HorizonSurfaceGridding = ({ horizons, onGridGenerated }) => {
    const [selectedHorizon, setSelectedHorizon] = useState(null);
    const [algorithm, setAlgorithm] = useState('kriging');
    const [gridSize, setGridSize] = useState(50);
    const [isProcessing, setIsProcessing] = useState(false);
    const { toast } = useToast();

    const handleRun = () => {
        if (!selectedHorizon) {
            toast({ variant: 'destructive', title: "Select Horizon", description: "Please select a horizon to grid." });
            return;
        }
        setIsProcessing(true);
        
        // Simulate async processing
        setTimeout(() => {
            setIsProcessing(false);
            onGridGenerated({
                horizonId: selectedHorizon,
                algorithm,
                resolution: gridSize,
                timestamp: new Date().toISOString()
            });
            toast({ title: "Surface Generated", description: `Gridded ${selectedHorizon} using ${algorithm}.` });
        }, 1500);
    };

    return (
        <Card className="bg-slate-900 border-slate-800 shadow-none">
            <CardHeader className="pb-2 p-3">
                <CardTitle className="text-xs font-bold text-emerald-400 flex items-center uppercase">
                    <Grid className="w-3 h-3 mr-2" /> Surface Gridding
                </CardTitle>
            </CardHeader>
            <CardContent className="p-3 space-y-4">
                <div className="space-y-2">
                    <Label className="text-xs text-slate-400">Input Horizon (Picks)</Label>
                    <Select value={selectedHorizon} onValueChange={setSelectedHorizon}>
                        <SelectTrigger className="h-8 bg-slate-800 border-slate-700 text-xs"><SelectValue placeholder="Select..." /></SelectTrigger>
                        <SelectContent className="bg-slate-800 border-slate-700 text-white">
                            {horizons.map(h => <SelectItem key={h.id} value={h.id}>{h.name}</SelectItem>)}
                        </SelectContent>
                    </Select>
                </div>

                <div className="space-y-2">
                    <Label className="text-xs text-slate-400">Algorithm</Label>
                    <Select value={algorithm} onValueChange={setAlgorithm}>
                        <SelectTrigger className="h-8 bg-slate-800 border-slate-700 text-xs"><SelectValue /></SelectTrigger>
                        <SelectContent className="bg-slate-800 border-slate-700 text-white">
                            <SelectItem value="kriging">Simple Kriging</SelectItem>
                            <SelectItem value="min_curvature">Minimum Curvature</SelectItem>
                            <SelectItem value="idw">Inverse Distance Weighting</SelectItem>
                            <SelectItem value="triangulation">Linear Triangulation</SelectItem>
                        </SelectContent>
                    </Select>
                </div>

                <div className="space-y-3">
                    <div className="flex justify-between text-xs text-slate-400">
                        <span>Grid Resolution</span>
                        <span className="text-white">{gridSize}x{gridSize}</span>
                    </div>
                    <Slider value={[gridSize]} min={20} max={200} step={10} onValueChange={([v]) => setGridSize(v)} />
                </div>

                <Button 
                    className="w-full bg-emerald-600 hover:bg-emerald-700 text-white text-xs h-8 mt-2" 
                    onClick={handleRun} 
                    disabled={isProcessing}
                >
                    {isProcessing ? <Loader2 className="w-3 h-3 animate-spin mr-2" /> : <Play className="w-3 h-3 mr-2" />}
                    Generate Surface
                </Button>
            </CardContent>
        </Card>
    );
};

export default HorizonSurfaceGridding;