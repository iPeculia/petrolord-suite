import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Box, Play, Calculator } from 'lucide-react';
import { Progress } from '@/components/ui/progress';

const VolumetricCalculationPanel = ({ onCalculate }) => {
    const [params, setParams] = useState({
        fluidType: 'Oil',
        contactDepth: 2500,
        avgPorosity: 0.18,
        avgSaturation: 0.35,
        boi: 1.2
    });
    const [isCalculating, setIsCalculating] = useState(false);
    const [result, setResult] = useState(null);

    const handleCalculate = () => {
        setIsCalculating(true);
        setResult(null);
        
        setTimeout(() => {
            // Mock Calculation
            const grv = 15000000; // m3
            const ntg = 0.75;
            const nrv = grv * ntg;
            const pv = nrv * params.avgPorosity;
            const hcpv = pv * (1 - params.avgSaturation);
            const stoip = hcpv / params.boi;

            setResult({
                grv: grv,
                nrv: nrv,
                poreVolume: pv,
                stoip: stoip,
                unit: 'm³'
            });
            setIsCalculating(false);
            if(onCalculate) onCalculate(stoip);
        }, 1500);
    };

    return (
        <Card className="bg-slate-900 border-slate-800">
            <CardHeader className="pb-2">
                <CardTitle className="text-sm font-bold flex items-center text-emerald-400">
                    <Calculator className="w-4 h-4 mr-2" /> Volumetrics
                </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-2">
                    <div className="space-y-1">
                        <Label className="text-xs text-slate-400">Fluid Type</Label>
                        <Select value={params.fluidType} onValueChange={(v) => setParams(p => ({...p, fluidType: v}))}>
                            <SelectTrigger className="h-8 bg-slate-800 border-slate-700 text-xs"><SelectValue /></SelectTrigger>
                            <SelectContent>
                                <SelectItem value="Oil">Oil</SelectItem>
                                <SelectItem value="Gas">Gas</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="space-y-1">
                        <Label className="text-xs text-slate-400">Contact Depth (m)</Label>
                        <Input 
                            type="number" 
                            value={params.contactDepth} 
                            onChange={(e) => setParams(p => ({...p, contactDepth: parseFloat(e.target.value)}))}
                            className="h-8 bg-slate-800 border-slate-700 text-xs" 
                        />
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-2">
                    <div className="space-y-1">
                        <Label className="text-xs text-slate-400">Avg. Porosity</Label>
                        <Input 
                            type="number" step="0.01"
                            value={params.avgPorosity} 
                            onChange={(e) => setParams(p => ({...p, avgPorosity: parseFloat(e.target.value)}))}
                            className="h-8 bg-slate-800 border-slate-700 text-xs" 
                        />
                    </div>
                    <div className="space-y-1">
                        <Label className="text-xs text-slate-400">Avg. Sw</Label>
                        <Input 
                            type="number" step="0.01"
                            value={params.avgSaturation} 
                            onChange={(e) => setParams(p => ({...p, avgSaturation: parseFloat(e.target.value)}))}
                            className="h-8 bg-slate-800 border-slate-700 text-xs" 
                        />
                    </div>
                </div>
                
                 <div className="space-y-1">
                    <Label className="text-xs text-slate-400">Formation Vol. Factor (Bo)</Label>
                    <Input 
                        type="number" step="0.01"
                        value={params.boi} 
                        onChange={(e) => setParams(p => ({...p, boi: parseFloat(e.target.value)}))}
                        className="h-8 bg-slate-800 border-slate-700 text-xs" 
                    />
                </div>

                <Button 
                    className="w-full bg-emerald-600 hover:bg-emerald-700 text-xs mt-2" 
                    size="sm" 
                    onClick={handleCalculate}
                    disabled={isCalculating}
                >
                    {isCalculating ? "Calculating..." : <><Play className="w-3 h-3 mr-2" /> Calculate STOIP</>}
                </Button>

                {result && (
                    <div className="mt-4 p-3 bg-slate-950 rounded border border-slate-800 space-y-2 text-xs">
                        <div className="flex justify-between"><span>GRV:</span> <span className="text-slate-200 font-mono">{(result.grv/1e6).toFixed(2)} Mm³</span></div>
                        <div className="flex justify-between"><span>Net Rock Vol:</span> <span className="text-slate-200 font-mono">{(result.nrv/1e6).toFixed(2)} Mm³</span></div>
                        <div className="flex justify-between"><span>Pore Vol:</span> <span className="text-slate-200 font-mono">{(result.poreVolume/1e6).toFixed(2)} Mm³</span></div>
                        <div className="border-t border-slate-800 pt-1 flex justify-between font-bold text-emerald-400">
                            <span>STOIP:</span> 
                            <span>{(result.stoip/1e6).toFixed(2)} Mm³</span>
                        </div>
                    </div>
                )}
            </CardContent>
        </Card>
    );
};

export default VolumetricCalculationPanel;