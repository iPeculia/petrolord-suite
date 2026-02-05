import React from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { PlayCircle, Loader2 } from 'lucide-react';
import { Progress } from '@/components/ui/progress';

const MonteCarloSettings = ({ settings, setSettings, onRun, isRunning, progress }) => {
    const update = (key, val) => setSettings(prev => ({ ...prev, [key]: val }));

    return (
        <div className="space-y-4 p-4 bg-slate-900 border border-slate-800 rounded-lg">
            <h3 className="text-sm font-bold text-slate-200">Simulation Settings</h3>
            
            <div className="space-y-2">
                <Label className="text-xs text-slate-400">Iterations</Label>
                <Select 
                    value={settings.iterations.toString()} 
                    onValueChange={(v) => update('iterations', parseInt(v))}
                >
                    <SelectTrigger className="bg-slate-950 border-slate-700 h-8 text-xs">
                        <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-slate-900 border-slate-700">
                        <SelectItem value="100">100 (Fast)</SelectItem>
                        <SelectItem value="1000">1,000 (Standard)</SelectItem>
                        <SelectItem value="5000">5,000 (High Res)</SelectItem>
                        <SelectItem value="10000">10,000 (Ultra)</SelectItem>
                    </SelectContent>
                </Select>
            </div>

            <div className="space-y-2">
                <Label className="text-xs text-slate-400">Distribution Type</Label>
                <Select 
                    value={settings.distribution} 
                    onValueChange={(v) => update('distribution', v)}
                >
                    <SelectTrigger className="bg-slate-950 border-slate-700 h-8 text-xs">
                        <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-slate-900 border-slate-700">
                        <SelectItem value="normal">Normal (Gaussian)</SelectItem>
                        <SelectItem value="lognormal">Lognormal</SelectItem>
                        <SelectItem value="uniform">Uniform</SelectItem>
                        <SelectItem value="triangular">Triangular</SelectItem>
                    </SelectContent>
                </Select>
            </div>

            <div className="pt-2">
                {isRunning ? (
                    <div className="space-y-2">
                        <div className="flex justify-between text-[10px] text-slate-400">
                            <span>Calculating...</span>
                            <span>{Math.round(progress)}%</span>
                        </div>
                        <Progress value={progress} className="h-2" />
                    </div>
                ) : (
                    <Button 
                        className="w-full bg-purple-600 hover:bg-purple-500 text-white" 
                        size="sm"
                        onClick={onRun}
                    >
                        <PlayCircle className="w-4 h-4 mr-2" /> Run Monte Carlo
                    </Button>
                )}
            </div>
        </div>
    );
};

export default MonteCarloSettings;