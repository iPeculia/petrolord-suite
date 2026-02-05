import React from 'react';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Gauge } from 'lucide-react';

const PayFlagEngine = () => {
    return (
        <Card className="bg-slate-900 border-slate-800">
            <CardHeader className="pb-2">
                <CardTitle className="text-base flex items-center gap-2">
                    <Gauge className="w-4 h-4 text-emerald-400" /> Net Pay Criteria
                </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
                <div className="space-y-4">
                    <div className="flex items-center justify-between">
                        <Label className="text-slate-300">Vshale Cutoff</Label>
                        <span className="text-xs font-mono text-emerald-400">{'<'} 0.40 v/v</span>
                    </div>
                    <Slider defaultValue={[0.4]} max={1} step={0.05} />
                </div>
                
                <div className="space-y-4">
                    <div className="flex items-center justify-between">
                        <Label className="text-slate-300">Porosity Cutoff</Label>
                        <span className="text-xs font-mono text-emerald-400">{'>'} 0.08 v/v</span>
                    </div>
                    <Slider defaultValue={[0.08]} max={0.3} step={0.01} />
                </div>

                <div className="space-y-4">
                    <div className="flex items-center justify-between">
                        <Label className="text-slate-300">Water Saturation Cutoff</Label>
                        <span className="text-xs font-mono text-emerald-400">{'<'} 0.50 v/v</span>
                    </div>
                    <Slider defaultValue={[0.5]} max={1} step={0.05} />
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-slate-800">
                    <div className="space-y-0.5">
                        <Label>Exclude Coal/Bad Hole</Label>
                        <p className="text-xs text-slate-500">Remove intervals with density {'<'} 1.5 g/cc</p>
                    </div>
                    <Switch defaultChecked />
                </div>
            </CardContent>
        </Card>
    );
};

export default PayFlagEngine;