import React from 'react';
import { Globe, RotateCw } from 'lucide-react';
import { Slider } from '@/components/ui/slider';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';

const AnisotropyParameterEditor = () => {
    return (
        <Card className="bg-slate-900 border-slate-800">
            <CardHeader className="pb-2 border-b border-slate-800">
                <CardTitle className="text-sm font-medium flex items-center justify-between">
                    <div className="flex items-center gap-2 text-pink-400">
                        <Globe className="w-4 h-4"/> Anisotropy (VTI/TTI)
                    </div>
                    <Switch />
                </CardTitle>
            </CardHeader>
            <CardContent className="p-4 space-y-4">
                <div>
                    <div className="flex justify-between text-xs mb-1">
                        <Label className="text-slate-300">Epsilon (ε)</Label>
                        <span className="text-slate-500">0.12</span>
                    </div>
                    <Slider defaultValue={[0.12]} max={0.5} step={0.01} className="py-1" />
                    <p className="text-[10px] text-slate-500 mt-1">Horizontal vs Vertical P-wave difference</p>
                </div>

                <div>
                    <div className="flex justify-between text-xs mb-1">
                        <Label className="text-slate-300">Delta (δ)</Label>
                        <span className="text-slate-500">0.05</span>
                    </div>
                    <Slider defaultValue={[0.05]} max={0.3} step={0.01} className="py-1" />
                    <p className="text-[10px] text-slate-500 mt-1">Near-vertical NMO velocity control</p>
                </div>

                <div className="pt-2 border-t border-slate-800">
                    <div className="flex items-center gap-2 mb-2">
                        <RotateCw className="w-3 h-3 text-slate-400" />
                        <span className="text-xs font-semibold text-slate-300">TTI Symmetry Axis</span>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <Label className="text-[10px] text-slate-500">Dip Angle (°)</Label>
                            <input type="number" className="w-full bg-slate-950 border border-slate-700 rounded px-2 py-1 text-xs text-white" placeholder="0" />
                        </div>
                        <div>
                            <Label className="text-[10px] text-slate-500">Azimuth (°)</Label>
                            <input type="number" className="w-full bg-slate-950 border border-slate-700 rounded px-2 py-1 text-xs text-white" placeholder="0" />
                        </div>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
};

export default AnisotropyParameterEditor;