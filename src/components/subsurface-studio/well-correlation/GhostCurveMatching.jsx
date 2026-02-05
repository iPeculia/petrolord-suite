import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Ghost, Wand2, RotateCcw, Check, X } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

const GhostCurveMatching = ({ 
    wells, 
    ghostSettings, 
    setGhostSettings, 
    onAutoMatch,
    correlationScore,
    onApplyShift,
    onResetShift
}) => {
    const { sourceWellId, targetWellId, shift } = ghostSettings;

    const sourceWellName = wells.find(w => w.id === sourceWellId)?.name || "Select Well";
    const targetWellName = wells.find(w => w.id === targetWellId)?.name || "Select Well";

    return (
        <div className="space-y-4 p-4 border-t border-slate-800">
            <div className="flex items-center justify-between text-purple-400 font-semibold mb-2">
                <div className="flex items-center gap-2">
                    <Ghost className="w-4 h-4"/>
                    <h3>Ghost Matching</h3>
                </div>
                {correlationScore > 0 && (
                    <Badge variant="outline" className="bg-purple-900/20 text-purple-300 border-purple-700">
                        R²: {correlationScore.toFixed(2)}
                    </Badge>
                )}
            </div>

            <div className="space-y-3">
                <div className="grid grid-cols-2 gap-2">
                    <div>
                        <Label className="text-[10px] text-slate-400 uppercase">Ghost Source</Label>
                        <Select value={sourceWellId} onValueChange={(v) => setGhostSettings(p => ({...p, sourceWellId: v}))}>
                            <SelectTrigger className="h-7 text-xs"><SelectValue placeholder="Source"/></SelectTrigger>
                            <SelectContent>
                                {wells.map(w => <SelectItem key={w.id} value={w.id}>{w.name}</SelectItem>)}
                            </SelectContent>
                        </Select>
                    </div>
                    <div>
                        <Label className="text-[10px] text-slate-400 uppercase">Target Well</Label>
                        <Select value={targetWellId} onValueChange={(v) => setGhostSettings(p => ({...p, targetWellId: v}))}>
                            <SelectTrigger className="h-7 text-xs"><SelectValue placeholder="Target"/></SelectTrigger>
                            <SelectContent>
                                {wells.map(w => <SelectItem key={w.id} value={w.id}>{w.name}</SelectItem>)}
                            </SelectContent>
                        </Select>
                    </div>
                </div>

                <div className="pt-2 bg-slate-900/50 p-3 rounded-lg border border-slate-700">
                    <div className="flex justify-between text-xs text-slate-300 mb-2">
                        <span>Vertical Shift</span>
                        <span className="font-mono text-purple-300 font-bold">{shift.toFixed(1)} m</span>
                    </div>
                    <Slider 
                        value={[shift]} 
                        min={-200} max={200} step={0.5} 
                        onValueChange={([val]) => setGhostSettings(p => ({...p, shift: val}))}
                        className="py-2"
                    />
                    <div className="flex justify-between text-[10px] text-slate-500 mt-1">
                        <span>-200m</span>
                        <span>0m</span>
                        <span>+200m</span>
                    </div>
                </div>

                <div className="grid grid-cols-3 gap-2 pt-1">
                    <Button variant="outline" size="sm" onClick={onAutoMatch} className="text-xs h-8 border-purple-500/30 hover:bg-purple-900/20 text-purple-300" disabled={!sourceWellId || !targetWellId}>
                        <Wand2 className="w-3 h-3 mr-1"/> Auto
                    </Button>
                    <Button size="sm" onClick={onApplyShift} className="bg-purple-600 hover:bg-purple-700 text-xs h-8 col-span-2" disabled={!sourceWellId || !targetWellId}>
                        <Check className="w-3 h-3 mr-1"/> Apply Shift
                    </Button>
                </div>
                {shift !== 0 && (
                    <Button variant="ghost" size="sm" onClick={onResetShift} className="w-full h-6 text-[10px] text-slate-400">
                        <RotateCcw className="w-3 h-3 mr-1"/> Reset Shift
                    </Button>
                )}
            </div>
        </div>
    );
};

export default GhostCurveMatching;