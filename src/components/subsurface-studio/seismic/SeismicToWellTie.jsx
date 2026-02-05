import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Link2, RefreshCw, AlignVerticalJustifyCenter as AlignVerticalJustify } from 'lucide-react';

const SeismicToWellTie = ({ wells, selectedWellId, onWellSelect, onGenerateSynthetic, timeShift, setTimeShift, active, onToggle }) => {
    const [frequency, setFrequency] = useState(25);
    const [phase, setPhase] = useState(0);
    const [showSynthetic, setShowSynthetic] = useState(true);

    return (
        <Card className="bg-slate-900 border-slate-800 shadow-none">
            <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                    <CardTitle className="text-sm font-bold flex items-center text-green-400">
                        <Link2 className="w-4 h-4 mr-2" /> Seismic-Well Tie
                    </CardTitle>
                    <Switch checked={active} onCheckedChange={onToggle} className="scale-75" />
                </div>
            </CardHeader>
            {active && (
                <CardContent className="space-y-4">
                    <div className="space-y-2">
                        <Label className="text-xs text-slate-400">Target Well</Label>
                        <Select value={selectedWellId} onValueChange={onWellSelect}>
                            <SelectTrigger className="h-8 bg-slate-800 border-slate-700 text-xs"><SelectValue placeholder="Select Well" /></SelectTrigger>
                            <SelectContent className="bg-slate-800 border-slate-700 text-white">
                                {wells.map(w => <SelectItem key={w.id} value={w.id}>{w.name}</SelectItem>)}
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="space-y-3 pt-2 border-t border-slate-800">
                        <Label className="text-xs text-slate-400 font-semibold">Wavelet Parameters</Label>
                        <div>
                            <div className="flex justify-between text-[10px] text-slate-500 mb-1"><span>Freq</span><span>{frequency} Hz</span></div>
                            <Slider value={[frequency]} min={5} max={60} step={1} onValueChange={([v]) => setFrequency(v)} />
                        </div>
                        <div>
                            <div className="flex justify-between text-[10px] text-slate-500 mb-1"><span>Phase</span><span>{phase}°</span></div>
                            <Slider value={[phase]} min={-180} max={180} step={5} onValueChange={([v]) => setPhase(v)} />
                        </div>
                    </div>

                    <div className="space-y-3 pt-2 border-t border-slate-800">
                        <Label className="text-xs text-slate-400 font-semibold">Alignment</Label>
                        <div>
                            <div className="flex justify-between text-[10px] text-slate-500 mb-1"><span>Bulk Shift</span><span>{timeShift} ms</span></div>
                            <Slider value={[timeShift]} min={-100} max={100} step={1} onValueChange={([v]) => setTimeShift(v)} />
                        </div>
                    </div>

                    <div className="flex gap-2 mt-2">
                        <Button className="flex-1 bg-green-600 hover:bg-green-700 h-8 text-xs" onClick={() => onGenerateSynthetic({ frequency, phase })}>
                            <RefreshCw className="w-3 h-3 mr-2" /> Update Synth
                        </Button>
                        <Button variant="outline" size="icon" className="h-8 w-8" title="Auto-align">
                            <AlignVerticalJustify className="w-4 h-4" />
                        </Button>
                    </div>
                </CardContent>
            )}
        </Card>
    );
};

export default SeismicToWellTie;