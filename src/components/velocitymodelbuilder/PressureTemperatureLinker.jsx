import React from 'react';
import { Thermometer, Gauge } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';

const PressureTemperatureLinker = () => {
    return (
        <Card className="bg-slate-900 border-slate-800">
            <CardHeader className="pb-2 border-b border-slate-800">
                <CardTitle className="text-sm font-medium flex items-center gap-2 text-orange-400">
                    <Gauge className="w-4 h-4"/> Pressure & Temp Link
                </CardTitle>
            </CardHeader>
            <CardContent className="p-4 space-y-4">
                <div className="flex items-start space-x-2">
                    <Checkbox id="overpressure" />
                    <div className="grid gap-1.5 leading-none">
                        <Label htmlFor="overpressure" className="text-sm font-medium text-slate-200">
                            Check for Overpressure
                        </Label>
                        <p className="text-xs text-slate-500">
                            Flag intervals where velocity inversion occurs (Velocity Drop).
                        </p>
                    </div>
                </div>

                <div className="p-3 bg-slate-950 rounded border border-slate-800 space-y-3">
                    <h4 className="text-xs font-semibold text-slate-400 flex items-center gap-2">
                        <Thermometer className="w-3 h-3" /> Temperature Gradient
                    </h4>
                    <div className="flex items-center justify-between text-xs">
                        <span className="text-slate-500">Seabed Temp:</span>
                        <div className="flex items-center gap-1">
                            <input className="w-16 bg-slate-900 border border-slate-700 px-1 rounded text-right text-white" defaultValue="4" />
                            <span className="text-slate-600">°C</span>
                        </div>
                    </div>
                    <div className="flex items-center justify-between text-xs">
                        <span className="text-slate-500">Gradient:</span>
                        <div className="flex items-center gap-1">
                            <input className="w-16 bg-slate-900 border border-slate-700 px-1 rounded text-right text-white" defaultValue="3.0" />
                            <span className="text-slate-600">°C/100m</span>
                        </div>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
};

export default PressureTemperatureLinker;