import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Wand2, Layers, Activity } from 'lucide-react';
import { Progress } from '@/components/ui/progress';

const AutomatedInterpretation = () => {
    const [isRunning, setIsRunning] = useState(false);
    const [progress, setProgress] = useState(0);

    const runAutoPick = () => {
        setIsRunning(true);
        setProgress(0);
        const interval = setInterval(() => {
            setProgress(p => {
                if (p >= 100) {
                    clearInterval(interval);
                    setIsRunning(false);
                    return 100;
                }
                return p + 5;
            });
        }, 100);
    };

    return (
        <div className="space-y-4 h-full p-1">
            <div className="grid grid-cols-2 gap-4">
                <Card className="bg-slate-950 border-slate-800">
                    <CardHeader>
                        <CardTitle className="text-sm flex items-center text-slate-200"><Layers className="w-4 h-4 mr-2 text-cyan-400"/> Seismic Auto-Tracking</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <Select>
                            <SelectTrigger className="bg-slate-900 border-slate-800"><SelectValue placeholder="Select Volume" /></SelectTrigger>
                            <SelectContent><SelectItem value="v1">Full Stack_Final_Mig</SelectItem></SelectContent>
                        </Select>
                        <Select>
                            <SelectTrigger className="bg-slate-900 border-slate-800"><SelectValue placeholder="Target Horizon" /></SelectTrigger>
                            <SelectContent><SelectItem value="h1">Top Reservoir A</SelectItem></SelectContent>
                        </Select>
                        <Button className="w-full bg-cyan-600 hover:bg-cyan-700" onClick={runAutoPick} disabled={isRunning}>
                            <Wand2 className="w-4 h-4 mr-2" /> {isRunning ? 'Tracking...' : 'Auto-Track Horizon'}
                        </Button>
                        {isRunning && <Progress value={progress} className="h-2" />}
                    </CardContent>
                </Card>

                <Card className="bg-slate-950 border-slate-800">
                    <CardHeader>
                        <CardTitle className="text-sm flex items-center text-slate-200"><Activity className="w-4 h-4 mr-2 text-green-400"/> Log Pattern Picking</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                         <Select>
                            <SelectTrigger className="bg-slate-900 border-slate-800"><SelectValue placeholder="Select Wells" /></SelectTrigger>
                            <SelectContent><SelectItem value="w1">All Wells (14)</SelectItem></SelectContent>
                        </Select>
                         <Select>
                            <SelectTrigger className="bg-slate-900 border-slate-800"><SelectValue placeholder="Feature Type" /></SelectTrigger>
                            <SelectContent><SelectItem value="f1">Sand/Shale boundaries</SelectItem></SelectContent>
                        </Select>
                        <Button variant="outline" className="w-full border-slate-700 hover:bg-slate-900">
                            <Wand2 className="w-4 h-4 mr-2" /> Detect Patterns
                        </Button>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
};

export default AutomatedInterpretation;