import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Thermometer } from 'lucide-react';

const PressureTemperature = ({ data, onChange }) => {
    const update = (key, value) => {
        onChange({ ...data, [key]: value });
    };

    return (
        <Card className="bg-slate-900 border-slate-800 h-full">
            <CardHeader className="pb-2">
                <CardTitle className="text-lg font-medium text-white flex items-center">
                    <Thermometer className="w-5 h-5 mr-2 text-red-400" />
                    Pressure & Temperature
                </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <Label className="text-xs text-slate-400">Datum Depth (ft/m)</Label>
                        <Input 
                            type="number"
                            value={data.datumDepth || ''} 
                            onChange={(e) => update('datumDepth', parseFloat(e.target.value))}
                            className="bg-slate-800 border-slate-700"
                        />
                    </div>
                    <div className="space-y-2">
                        <Label className="text-xs text-slate-400">Datum Pressure (psi)</Label>
                        <Input 
                            type="number"
                            value={data.datumPressure || ''} 
                            onChange={(e) => update('datumPressure', parseFloat(e.target.value))}
                            className="bg-slate-800 border-slate-700"
                        />
                    </div>
                    <div className="space-y-2">
                        <Label className="text-xs text-slate-400">Pressure Gradient (psi/ft)</Label>
                        <Input 
                            type="number" step="0.01"
                            value={data.gradient || ''} 
                            onChange={(e) => update('gradient', parseFloat(e.target.value))}
                            className="bg-slate-800 border-slate-700"
                        />
                    </div>
                    <div className="space-y-2">
                        <Label className="text-xs text-slate-400">Temp. Gradient (°/100ft)</Label>
                        <Input 
                            type="number" step="0.01"
                            value={data.temperatureGradient || ''} 
                            onChange={(e) => update('temperatureGradient', parseFloat(e.target.value))}
                            className="bg-slate-800 border-slate-700"
                        />
                    </div>
                </div>
                
                {/* Simple visualizer placeholder */}
                <div className="mt-4 h-32 bg-slate-800/50 rounded border border-slate-700/50 flex items-center justify-center text-xs text-slate-500">
                    Pressure Plot Preview
                </div>
            </CardContent>
        </Card>
    );
};

export default PressureTemperature;