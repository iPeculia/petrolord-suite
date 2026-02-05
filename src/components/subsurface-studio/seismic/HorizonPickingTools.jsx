import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Spline, Play, Trash2, Zap, GitCommit, RefreshCw } from 'lucide-react';

const HorizonPickingTools = ({ 
    activeHorizon, setActiveHorizon, 
    onAutoTrack, onClear, horizons,
    onSmooth, onUndo, canUndo 
}) => {
    return (
        <Card className="bg-slate-900 border-slate-800 shadow-none">
            <CardHeader className="pb-2">
                <CardTitle className="text-sm font-bold flex items-center text-cyan-400">
                    <Spline className="w-4 h-4 mr-2" /> Horizon Interpretation
                </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="space-y-2">
                    <Label className="text-xs text-slate-400">Active Horizon</Label>
                    <Select value={activeHorizon} onValueChange={setActiveHorizon}>
                        <SelectTrigger className="h-8 bg-slate-800 border-slate-700 text-xs">
                            <SelectValue placeholder="Select Horizon" />
                        </SelectTrigger>
                        <SelectContent className="bg-slate-800 border-slate-700 text-white">
                            <SelectItem value="new">+ Create New Horizon</SelectItem>
                            {horizons.map(h => <SelectItem key={h.id} value={h.id}>{h.name}</SelectItem>)}
                        </SelectContent>
                    </Select>
                </div>

                <div className="space-y-2 bg-slate-950/50 p-2 rounded border border-slate-800">
                    <Label className="text-xs text-slate-400 font-bold flex items-center"><Zap className="w-3 h-3 mr-1 text-yellow-400" /> AI Auto-Tracking</Label>
                    <div className="grid grid-cols-2 gap-2">
                        <Button variant="secondary" size="sm" className="text-xs h-7" onClick={() => onAutoTrack('peak')}>
                            <Play className="w-3 h-3 mr-1" /> Snap Peak
                        </Button>
                        <Button variant="secondary" size="sm" className="text-xs h-7" onClick={() => onAutoTrack('trough')}>
                            <Play className="w-3 h-3 mr-1" /> Snap Trough
                        </Button>
                        <Button variant="secondary" size="sm" className="text-xs h-7 col-span-2" onClick={() => onAutoTrack('propagator')}>
                            <GitCommit className="w-3 h-3 mr-1" /> Propagate 2D
                        </Button>
                    </div>
                </div>

                <div className="space-y-2">
                    <div className="flex justify-between items-center">
                        <Label className="text-xs text-slate-400">Quality Control</Label>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                        <Button variant="outline" size="sm" className="text-xs h-7" onClick={onSmooth}>
                            <RefreshCw className="w-3 h-3 mr-1" /> Smooth
                        </Button>
                        <Button variant="outline" size="sm" className="text-xs h-7" onClick={onUndo} disabled={!canUndo}>
                            Undo Last
                        </Button>
                    </div>
                </div>

                <div className="pt-2 border-t border-slate-800">
                    <Button variant="ghost" size="sm" className="w-full text-xs text-red-400 hover:text-red-300 hover:bg-red-900/20" onClick={onClear}>
                        <Trash2 className="w-3 h-3 mr-2" /> Clear Current Picks
                    </Button>
                </div>
            </CardContent>
        </Card>
    );
};

export default HorizonPickingTools;