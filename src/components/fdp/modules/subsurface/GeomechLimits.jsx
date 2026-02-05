import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { AlertTriangle } from 'lucide-react';

const GeomechLimits = ({ data, onChange }) => {
    const update = (key, value) => {
        onChange({ ...data, [key]: value });
    };
    
    const updateMudWindow = (field, value) => {
        const currentWindow = data.mudWindow || { min: 0, max: 0 };
        update('mudWindow', { ...currentWindow, [field]: parseFloat(value) });
    };

    return (
        <Card className="bg-slate-900 border-slate-800 h-full">
            <CardHeader className="pb-2">
                <CardTitle className="text-lg font-medium text-white flex items-center">
                    <AlertTriangle className="w-5 h-5 mr-2 text-yellow-500" />
                    Geomechanics & Limits
                </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <Label className="text-xs text-slate-400">Pore Pressure Grad. (ppg)</Label>
                        <Input 
                            type="number" step="0.1"
                            value={data.porePressureGradient || ''} 
                            onChange={(e) => update('porePressureGradient', parseFloat(e.target.value))}
                            className="bg-slate-800 border-slate-700"
                        />
                    </div>
                    <div className="space-y-2">
                        <Label className="text-xs text-slate-400">Fracture Gradient (ppg)</Label>
                        <Input 
                            type="number" step="0.1"
                            value={data.fractureGradient || ''} 
                            onChange={(e) => update('fractureGradient', parseFloat(e.target.value))}
                            className="bg-slate-800 border-slate-700"
                        />
                    </div>
                </div>

                <div className="pt-2 border-t border-slate-800">
                    <Label className="text-xs text-slate-400 font-bold mb-2 block">Safe Mud Weight Window (ppg)</Label>
                    <div className="flex items-center gap-2">
                        <div className="flex-1">
                             <span className="text-[10px] text-slate-500 uppercase">Min</span>
                             <Input 
                                type="number" step="0.1"
                                value={data.mudWindow?.min || ''} 
                                onChange={(e) => updateMudWindow('min', e.target.value)}
                                className="bg-slate-800 border-slate-700"
                            />
                        </div>
                        <div className="w-2 h-[1px] bg-slate-600 mt-4"></div>
                        <div className="flex-1">
                            <span className="text-[10px] text-slate-500 uppercase">Max</span>
                            <Input 
                                type="number" step="0.1"
                                value={data.mudWindow?.max || ''} 
                                onChange={(e) => updateMudWindow('max', e.target.value)}
                                className="bg-slate-800 border-slate-700"
                            />
                        </div>
                    </div>
                </div>

                <div className="mt-2 p-2 bg-slate-800 rounded text-xs text-slate-400 border border-slate-700">
                    <strong>Risk Note:</strong> Ensure mud weight stays within limits to prevent kicks or formation damage.
                </div>
            </CardContent>
        </Card>
    );
};

export default GeomechLimits;