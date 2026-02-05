import React, { useState } from 'react';
import { CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dices, Play, RefreshCw } from 'lucide-react';

const DistributionInput = ({ label, paramKey, config, onChange }) => {
    return (
        <div className="space-y-2 bg-slate-900/50 p-3 rounded border border-slate-800">
            <div className="flex items-center justify-between">
                <Label className="text-xs font-semibold text-slate-300">{label}</Label>
                <Select 
                    value={config.type} 
                    onValueChange={(v) => onChange(paramKey, { ...config, type: v })}
                >
                    <SelectTrigger className="h-6 w-24 text-[10px] bg-slate-950 border-slate-700">
                        <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="constant">Constant</SelectItem>
                        <SelectItem value="triangular">Triangular</SelectItem>
                        <SelectItem value="normal">Normal</SelectItem>
                        <SelectItem value="uniform">Uniform</SelectItem>
                    </SelectContent>
                </Select>
            </div>
            
            <div className="grid grid-cols-3 gap-2">
                {config.type === 'constant' && (
                    <div className="col-span-3">
                         <Input type="number" placeholder="Value" className="h-7 text-xs bg-slate-950 border-slate-700" value={config.value} onChange={(e) => onChange(paramKey, { ...config, value: parseFloat(e.target.value) })} />
                    </div>
                )}
                {config.type === 'triangular' && (
                    <>
                        <Input type="number" placeholder="Min" className="h-7 text-xs bg-slate-950 border-slate-700" value={config.min} onChange={(e) => onChange(paramKey, { ...config, min: parseFloat(e.target.value) })} />
                        <Input type="number" placeholder="Mode" className="h-7 text-xs bg-slate-950 border-slate-700" value={config.mode} onChange={(e) => onChange(paramKey, { ...config, mode: parseFloat(e.target.value) })} />
                        <Input type="number" placeholder="Max" className="h-7 text-xs bg-slate-950 border-slate-700" value={config.max} onChange={(e) => onChange(paramKey, { ...config, max: parseFloat(e.target.value) })} />
                    </>
                )}
                {config.type === 'normal' && (
                    <>
                        <div className="col-span-1"><Input type="number" placeholder="Mean" className="h-7 text-xs bg-slate-950 border-slate-700" value={config.mean} onChange={(e) => onChange(paramKey, { ...config, mean: parseFloat(e.target.value) })} /></div>
                        <div className="col-span-2"><Input type="number" placeholder="StdDev" className="h-7 text-xs bg-slate-950 border-slate-700" value={config.stdDev} onChange={(e) => onChange(paramKey, { ...config, stdDev: parseFloat(e.target.value) })} /></div>
                    </>
                )}
                {config.type === 'uniform' && (
                    <>
                        <Input type="number" placeholder="Min" className="h-7 text-xs bg-slate-950 border-slate-700" value={config.min} onChange={(e) => onChange(paramKey, { ...config, min: parseFloat(e.target.value) })} />
                        <div className="col-span-2"><Input type="number" placeholder="Max" className="h-7 text-xs bg-slate-950 border-slate-700" value={config.max} onChange={(e) => onChange(paramKey, { ...config, max: parseFloat(e.target.value) })} /></div>
                    </>
                )}
            </div>
        </div>
    );
};

const ProbabilisticPanel = ({ onRun, loading }) => {
    const [iterations, setIterations] = useState(2000);
    const [fluidType, setFluidType] = useState('oil');
    const [inputs, setInputs] = useState({
        area: { type: 'triangular', min: 100, mode: 150, max: 250 },
        thickness: { type: 'normal', mean: 50, stdDev: 10 },
        ntg: { type: 'uniform', min: 0.6, max: 0.85 },
        phi: { type: 'normal', mean: 0.18, stdDev: 0.02 },
        sw: { type: 'triangular', min: 0.2, mode: 0.3, max: 0.45 },
        fvf: { type: 'constant', value: 1.2 },
        rf: { type: 'triangular', min: 0.25, mode: 0.35, max: 0.45 },
    });

    const updateInput = (key, newVal) => {
        setInputs(prev => ({ ...prev, [key]: newVal }));
    };

    const handleRun = () => {
        onRun({ ...inputs, fluidType }, iterations);
    };

    return (
        <div className="h-full flex flex-col bg-slate-950 border-r border-slate-800 w-full max-w-md">
            <CardHeader className="pb-2 border-b border-slate-800 bg-slate-900/50">
                <CardTitle className="text-sm font-bold text-white flex items-center gap-2">
                    <Dices className="w-4 h-4 text-purple-400" />
                    Monte Carlo Simulation
                </CardTitle>
            </CardHeader>

            <ScrollArea className="flex-1 p-4 space-y-4">
                <div className="space-y-3">
                     <Label className="text-xs text-slate-400 uppercase tracking-wider">Settings</Label>
                     <div className="grid grid-cols-2 gap-2">
                        <div>
                            <Label className="text-[10px] text-slate-500">Fluid Type</Label>
                            <Select value={fluidType} onValueChange={setFluidType}>
                                <SelectTrigger className="h-8 bg-slate-900 border-slate-700 text-xs"><SelectValue /></SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="oil">Oil</SelectItem>
                                    <SelectItem value="gas">Gas</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div>
                            <Label className="text-[10px] text-slate-500">Iterations</Label>
                            <Input type="number" value={iterations} onChange={e => setIterations(parseInt(e.target.value))} className="h-8 bg-slate-900 border-slate-700 text-xs" />
                        </div>
                     </div>
                </div>

                <Separator className="bg-slate-800" />

                <div className="space-y-3">
                    <Label className="text-xs text-slate-400 uppercase tracking-wider">Input Distributions</Label>
                    <DistributionInput label="Area (Acres)" paramKey="area" config={inputs.area} onChange={updateInput} />
                    <DistributionInput label="Gross Thickness (ft)" paramKey="thickness" config={inputs.thickness} onChange={updateInput} />
                    <DistributionInput label="Net-to-Gross (frac)" paramKey="ntg" config={inputs.ntg} onChange={updateInput} />
                    <DistributionInput label="Porosity (frac)" paramKey="phi" config={inputs.phi} onChange={updateInput} />
                    <DistributionInput label="Water Saturation (frac)" paramKey="sw" config={inputs.sw} onChange={updateInput} />
                    <DistributionInput label={`FVF (${fluidType === 'oil' ? 'Bo' : 'Bg'})`} paramKey="fvf" config={inputs.fvf} onChange={updateInput} />
                    <DistributionInput label="Recovery Factor (frac)" paramKey="rf" config={inputs.rf} onChange={updateInput} />
                </div>
            </ScrollArea>

            <div className="p-4 border-t border-slate-800 bg-slate-900/50">
                <Button 
                    className="w-full bg-purple-600 hover:bg-purple-500 text-white"
                    onClick={handleRun}
                    disabled={loading}
                >
                    {loading ? <RefreshCw className="w-4 h-4 mr-2 animate-spin" /> : <Play className="w-4 h-4 mr-2" />}
                    Run Simulation
                </Button>
            </div>
        </div>
    );
};

export default ProbabilisticPanel;