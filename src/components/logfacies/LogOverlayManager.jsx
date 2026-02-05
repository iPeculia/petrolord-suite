import React from 'react';
import { Eye, EyeOff, Layers } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Slider } from '@/components/ui/slider';
import { Label } from '@/components/ui/label';

const overlays = [
    { id: 'core', name: 'Core Images', color: 'bg-amber-500' },
    { id: 'seismic', name: 'Seismic Trace', color: 'bg-blue-500' },
    { id: 'mudlog', name: 'Mud Log Lithology', color: 'bg-green-500' },
    { id: 'offset', name: 'Offset Well (Ghost)', color: 'bg-slate-400' },
];

const LogOverlayManager = () => {
    return (
        <Card className="bg-slate-900 border-slate-800">
            <CardHeader className="py-3">
                <CardTitle className="text-sm flex items-center gap-2">
                    <Layers className="w-4 h-4 text-purple-400" />
                    Track Overlays
                </CardTitle>
            </CardHeader>
            <CardContent className="grid gap-4 p-4">
                {overlays.map(overlay => (
                    <div key={overlay.id} className="space-y-2">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <div className={`w-2 h-2 rounded-full ${overlay.color}`}></div>
                                <Label className="text-xs font-medium text-slate-300 cursor-pointer">{overlay.name}</Label>
                            </div>
                            <Switch className="h-4 w-8" />
                        </div>
                        <div className="pl-4">
                            <Slider defaultValue={[50]} max={100} step={1} className="h-1" />
                        </div>
                    </div>
                ))}
            </CardContent>
        </Card>
    );
};

export default LogOverlayManager;