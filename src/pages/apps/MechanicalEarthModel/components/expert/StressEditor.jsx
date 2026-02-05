import React, { useState } from 'react';
import { useExpertMode } from '../../contexts/ExpertModeContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { SlidersHorizontal, Save, RefreshCw, Info } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { useToast } from '@/components/ui/use-toast';

const StressEditor = () => {
    const { state, setActiveLayer } = useExpertMode();
    const { toast } = useToast();
    
    // Local state
    const [regime, setRegime] = useState('NF'); // NF, SS, TF
    const [tectonicStrain, setTectonicStrain] = useState({ eh: 0.0005, eH: 0.001 });
    const [anisotropy, setAnisotropy] = useState(1.0); // For SHmax/Shmin ratio in simplified models
    const [calibration, setCalibration] = useState({
        shmin_cal: 1.0, // Multiplier
        shmax_cal: 1.0
    });

    const handleSave = () => {
        toast({ 
            title: "Stress Profile Updated", 
            description: "Applied tectonic strains and regime settings to the stress model." 
        });
    };

    return (
        <div className="h-full flex flex-col bg-slate-950 text-slate-200">
            <div className="p-4 border-b border-slate-800 flex justify-between items-center bg-slate-900/50">
                 <div className="flex items-center gap-4">
                    <div>
                        <h2 className="text-sm font-bold text-white">Stress Editor</h2>
                        <p className="text-xs text-slate-400">Adjust horizontal stress magnitude and regime</p>
                    </div>
                </div>
                <Button 
                    size="sm" 
                    onClick={handleSave}
                    className="h-8 text-xs bg-blue-600 hover:bg-blue-700 text-white"
                >
                    <Save className="w-3 h-3 mr-1" /> Recalculate Stresses
                </Button>
            </div>

            <div className="flex-1 p-6 overflow-y-auto grid grid-cols-1 lg:grid-cols-3 gap-6">
                
                {/* Left Column: Controls */}
                <div className="lg:col-span-1 space-y-6">
                    
                    {/* Regime Selector */}
                    <Card className="bg-slate-900 border-slate-800">
                        <CardHeader className="pb-3">
                            <CardTitle className="text-sm font-bold text-slate-200">Stress Regime</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <Select value={regime} onValueChange={setRegime}>
                                <SelectTrigger className="bg-slate-950 border-slate-700"><SelectValue /></SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="NF">Normal Faulting (Sv &gt; SH &gt; Sh)</SelectItem>
                                    <SelectItem value="SS">Strike-Slip (SH &gt; Sv &gt; Sh)</SelectItem>
                                    <SelectItem value="TF">Thrust Faulting (SH &gt; Sh &gt; Sv)</SelectItem>
                                </SelectContent>
                            </Select>
                            <div className="p-3 bg-slate-950 rounded border border-slate-800 text-xs text-slate-400">
                                {regime === 'NF' && "Vertical stress is the maximum principal stress. Typical in relaxed basins."}
                                {regime === 'SS' && "Vertical stress is intermediate. Typical in transpressional zones."}
                                {regime === 'TF' && "Vertical stress is the minimum principal stress. Typical in compressional zones."}
                            </div>
                        </CardContent>
                    </Card>

                    {/* Tectonic Strains */}
                    <Card className="bg-slate-900 border-slate-800">
                        <CardHeader className="pb-3">
                            <div className="flex justify-between items-center">
                                <CardTitle className="text-sm font-bold text-slate-200">Poro-Elastic Strains</CardTitle>
                                <TooltipProvider>
                                    <Tooltip>
                                        <TooltipTrigger><Info className="w-4 h-4 text-slate-500"/></TooltipTrigger>
                                        <TooltipContent><p>Added tectonic strain component to the poro-elastic model.</p></TooltipContent>
                                    </Tooltip>
                                </TooltipProvider>
                            </div>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-2">
                                <div className="flex justify-between">
                                    <Label className="text-xs text-slate-400">Min Horiz. Strain (εh)</Label>
                                    <span className="text-xs font-mono text-indigo-400">{tectonicStrain.eh.toFixed(4)}</span>
                                </div>
                                <Slider 
                                    value={[tectonicStrain.eh * 10000]} 
                                    min={0} max={50} step={1}
                                    onValueChange={([v]) => setTectonicStrain(prev => ({ ...prev, eh: v / 10000 }))}
                                />
                            </div>
                            <div className="space-y-2">
                                <div className="flex justify-between">
                                    <Label className="text-xs text-slate-400">Max Horiz. Strain (εH)</Label>
                                    <span className="text-xs font-mono text-indigo-400">{tectonicStrain.eH.toFixed(4)}</span>
                                </div>
                                <Slider 
                                    value={[tectonicStrain.eH * 10000]} 
                                    min={0} max={50} step={1}
                                    onValueChange={([v]) => setTectonicStrain(prev => ({ ...prev, eH: v / 10000 }))}
                                />
                            </div>
                        </CardContent>
                    </Card>

                    {/* Calibration Factors */}
                    <Card className="bg-slate-900 border-slate-800">
                        <CardHeader className="pb-3">
                             <CardTitle className="text-sm font-bold text-slate-200">Calibration Multipliers</CardTitle>
                        </CardHeader>
                        <CardContent className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label className="text-xs text-slate-400">Shmin Factor</Label>
                                <Input 
                                    type="number" step="0.05"
                                    value={calibration.shmin_cal}
                                    onChange={(e) => setCalibration({...calibration, shmin_cal: parseFloat(e.target.value)})}
                                    className="h-8 bg-slate-950 border-slate-700 font-mono text-xs"
                                />
                            </div>
                             <div className="space-y-2">
                                <Label className="text-xs text-slate-400">SHmax Factor</Label>
                                <Input 
                                    type="number" step="0.05"
                                    value={calibration.shmax_cal}
                                    onChange={(e) => setCalibration({...calibration, shmax_cal: parseFloat(e.target.value)})}
                                    className="h-8 bg-slate-950 border-slate-700 font-mono text-xs"
                                />
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Right Column: Visualization Placeholder */}
                <div className="lg:col-span-2 bg-slate-900 border border-slate-800 rounded-lg p-4 flex flex-col">
                    <div className="flex justify-between items-center mb-4">
                        <h3 className="text-sm font-bold text-slate-300">Stress Profile Preview</h3>
                        <div className="flex gap-4 text-xs">
                             <div className="flex items-center gap-1"><div className="w-3 h-3 bg-green-500 rounded-full"></div> Sv</div>
                             <div className="flex items-center gap-1"><div className="w-3 h-3 bg-blue-500 rounded-full"></div> SHmax</div>
                             <div className="flex items-center gap-1"><div className="w-3 h-3 bg-red-500 rounded-full"></div> Shmin</div>
                        </div>
                    </div>
                    <div className="flex-1 bg-slate-950/50 rounded flex items-center justify-center relative overflow-hidden">
                        {/* Placeholder Viz */}
                        <div className="absolute inset-0 flex items-center justify-center opacity-20">
                            <SlidersHorizontal className="w-24 h-24 text-slate-600" />
                        </div>
                        <div className="z-10 text-center p-8">
                            <p className="text-slate-500 mb-2">Visualization will update upon recalculation.</p>
                            <div className="text-xs text-slate-600 font-mono bg-slate-900 p-2 rounded inline-block">
                                Regime: {regime} | εh: {tectonicStrain.eh} | εH: {tectonicStrain.eH}
                            </div>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
};

export default StressEditor;