import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Grid, Play, Check } from 'lucide-react';
import { Progress } from '@/components/ui/progress';

const GridGenerationPanel = ({ onGenerate }) => {
    const [params, setParams] = useState({
        cellSize: 50,
        dimI: 100,
        dimJ: 100,
        originX: 450000,
        originY: 6700000
    });
    const [isGenerating, setIsGenerating] = useState(false);
    const [progress, setProgress] = useState(0);

    const handleGenerate = () => {
        setIsGenerating(true);
        setProgress(0);
        let p = 0;
        const interval = setInterval(() => {
            p += 10;
            setProgress(p);
            if (p >= 100) {
                clearInterval(interval);
                setIsGenerating(false);
                onGenerate(params);
            }
        }, 200);
    };

    return (
        <Card className="bg-slate-900 border-slate-800">
            <CardHeader className="pb-2">
                <CardTitle className="text-sm font-bold flex items-center text-green-400">
                    <Grid className="w-4 h-4 mr-2" /> Grid Generation
                </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-2">
                    <div className="space-y-1">
                        <Label className="text-xs text-slate-400">Cell Size (m)</Label>
                        <Input type="number" value={params.cellSize} onChange={e => setParams({...params, cellSize: +e.target.value})} className="h-8 bg-slate-800 border-slate-700" />
                    </div>
                    <div className="space-y-1">
                        <Label className="text-xs text-slate-400">Dimensions (IxJ)</Label>
                        <div className="flex gap-1">
                            <Input type="number" value={params.dimI} onChange={e => setParams({...params, dimI: +e.target.value})} className="h-8 bg-slate-800 border-slate-700" placeholder="I" />
                            <Input type="number" value={params.dimJ} onChange={e => setParams({...params, dimJ: +e.target.value})} className="h-8 bg-slate-800 border-slate-700" placeholder="J" />
                        </div>
                    </div>
                </div>
                
                <div className="space-y-1">
                    <Label className="text-xs text-slate-400">Origin (X, Y)</Label>
                    <div className="grid grid-cols-2 gap-2">
                        <Input type="number" value={params.originX} onChange={e => setParams({...params, originX: +e.target.value})} className="h-8 bg-slate-800 border-slate-700" placeholder="X" />
                        <Input type="number" value={params.originY} onChange={e => setParams({...params, originY: +e.target.value})} className="h-8 bg-slate-800 border-slate-700" placeholder="Y" />
                    </div>
                </div>

                {isGenerating ? (
                    <div className="space-y-2">
                        <div className="flex justify-between text-xs text-slate-400">
                            <span>Generating Structural Grid...</span>
                            <span>{progress}%</span>
                        </div>
                        <Progress value={progress} className="h-1.5" />
                    </div>
                ) : (
                    <Button className="w-full bg-green-600 hover:bg-green-700 text-xs" size="sm" onClick={handleGenerate}>
                        <Play className="w-3 h-3 mr-2" /> Generate Grid
                    </Button>
                )}
            </CardContent>
        </Card>
    );
};

export default GridGenerationPanel;