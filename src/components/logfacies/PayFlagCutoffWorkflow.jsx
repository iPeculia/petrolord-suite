import React, { useState } from 'react';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Gauge, Calculator, RefreshCw, Filter } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

const PayFlagCutoffWorkflow = () => {
    const [vshCutoff, setVshCutoff] = useState([0.4]);
    const [phiCutoff, setPhiCutoff] = useState([0.08]);
    const [swCutoff, setSwCutoff] = useState([0.5]);
    
    // Mock calculation results
    const [results, setResults] = useState({ netSand: 45.2, netPay: 38.5, ntg: 0.62, hcpv: 12.4 });

    const recompute = () => {
        // Simulate recalculation delay
        setResults(prev => ({
            netSand: (prev.netSand * (0.9 + Math.random()*0.2)),
            netPay: (prev.netPay * (0.9 + Math.random()*0.2)),
            ntg: 0.62,
            hcpv: (prev.hcpv * (0.95 + Math.random()*0.1))
        }));
    };

    return (
        <Card className="bg-slate-900 border-slate-800 h-full flex flex-col">
            <CardHeader className="pb-2 flex flex-row items-center justify-between border-b border-slate-800">
                <CardTitle className="text-base flex items-center gap-2">
                    <Gauge className="w-4 h-4 text-emerald-400" /> Net Pay Determination
                </CardTitle>
                <Button size="sm" variant="ghost" onClick={recompute}><RefreshCw className="w-4 h-4" /></Button>
            </CardHeader>
            <CardContent className="space-y-6 flex-1 overflow-y-auto pt-4">
                <div className="p-4 bg-emerald-950/20 border border-emerald-900/50 rounded-lg space-y-3">
                    <h4 className="text-xs font-semibold text-emerald-400 uppercase tracking-wider mb-2">Reservoir Summations</h4>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <div className="text-xs text-slate-500">Net Sand</div>
                            <div className="text-lg font-mono text-white">{results.netSand.toFixed(1)} m</div>
                        </div>
                        <div>
                            <div className="text-xs text-slate-500">Net Pay</div>
                            <div className="text-lg font-mono text-emerald-400">{results.netPay.toFixed(1)} m</div>
                        </div>
                        <div>
                            <div className="text-xs text-slate-500">Net-to-Gross</div>
                            <div className="text-lg font-mono text-white">{results.ntg.toFixed(3)}</div>
                        </div>
                        <div>
                            <div className="text-xs text-slate-500">HCPV (MMbbl)</div>
                            <div className="text-lg font-mono text-blue-400">{results.hcpv.toFixed(2)}</div>
                        </div>
                    </div>
                </div>

                <div className="space-y-6 px-2">
                    <div className="space-y-3">
                        <div className="flex items-center justify-between">
                            <Label className="text-slate-300 flex items-center gap-2"><Filter className="w-3 h-3"/> Vshale Cutoff (Max)</Label>
                            <Badge variant="outline" className="font-mono">{vshCutoff[0]}</Badge>
                        </div>
                        <Slider value={vshCutoff} onValueChange={setVshCutoff} max={1} step={0.05} />
                    </div>
                    
                    <div className="space-y-3">
                        <div className="flex items-center justify-between">
                            <Label className="text-slate-300 flex items-center gap-2"><Filter className="w-3 h-3"/> Porosity Cutoff (Min)</Label>
                            <Badge variant="outline" className="font-mono">{phiCutoff[0]}</Badge>
                        </div>
                        <Slider value={phiCutoff} onValueChange={setPhiCutoff} max={0.3} step={0.01} />
                    </div>

                    <div className="space-y-3">
                        <div className="flex items-center justify-between">
                            <Label className="text-slate-300 flex items-center gap-2"><Filter className="w-3 h-3"/> Water Saturation Cutoff (Max)</Label>
                            <Badge variant="outline" className="font-mono">{swCutoff[0]}</Badge>
                        </div>
                        <Slider value={swCutoff} onValueChange={setSwCutoff} max={1} step={0.05} />
                    </div>
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-slate-800">
                    <div className="space-y-0.5">
                        <Label>Lithology Filter</Label>
                        <p className="text-xs text-slate-500">Only include Sandstone facies in Net Pay</p>
                    </div>
                    <Switch defaultChecked />
                </div>
                
                <Button className="w-full bg-emerald-700 hover:bg-emerald-800" onClick={recompute}>
                    <Calculator className="w-4 h-4 mr-2" /> Recalculate
                </Button>
            </CardContent>
        </Card>
    );
};

export default PayFlagCutoffWorkflow;