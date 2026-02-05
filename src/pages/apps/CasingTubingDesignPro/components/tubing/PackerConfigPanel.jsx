import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { useCasingTubingDesign } from '../../contexts/CasingTubingDesignContext';

const PackerConfigPanel = () => {
    const { packerConfig, setPackerConfig } = useCasingTubingDesign();

    const handleChange = (field, value) => {
        setPackerConfig(prev => ({ ...prev, [field]: value }));
    };

    return (
        <Card className="bg-slate-900 border-slate-800">
            <CardHeader className="py-2 px-4 border-b border-slate-800 bg-slate-950/50">
                <CardTitle className="text-xs font-bold text-slate-300 uppercase">Completion Equipment</CardTitle>
            </CardHeader>
            <CardContent className="p-4 space-y-4">
                
                {/* Packer Section */}
                <div className="space-y-3">
                    <div className="flex items-center justify-between">
                        <Label className="text-xs text-lime-400 font-bold">Production Packer</Label>
                        <Switch 
                            checked={packerConfig.hasPacker} 
                            onCheckedChange={(c) => handleChange('hasPacker', c)} 
                            className="scale-75"
                        />
                    </div>
                    
                    {packerConfig.hasPacker && (
                        <div className="grid grid-cols-2 gap-2 pl-2 border-l-2 border-slate-800">
                            <div className="space-y-1">
                                <Label className="text-[10px] text-slate-500">Depth (m)</Label>
                                <Input 
                                    type="number" 
                                    value={packerConfig.depth} 
                                    onChange={(e) => handleChange('depth', e.target.value)}
                                    className="h-7 text-xs bg-slate-950 border-slate-700" 
                                />
                            </div>
                            <div className="space-y-1">
                                <Label className="text-[10px] text-slate-500">Type</Label>
                                <Select value={packerConfig.type} onValueChange={(v) => handleChange('type', v)}>
                                    <SelectTrigger className="h-7 text-xs bg-slate-950 border-slate-700"><SelectValue /></SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="Permanent">Permanent</SelectItem>
                                        <SelectItem value="Retrievable">Retrievable</SelectItem>
                                        <SelectItem value="Inflatable">Inflatable</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="space-y-1">
                                <Label className="text-[10px] text-slate-500">Rating (kN)</Label>
                                <Input 
                                    type="number" 
                                    value={packerConfig.rating} 
                                    onChange={(e) => handleChange('rating', e.target.value)}
                                    className="h-7 text-xs bg-slate-950 border-slate-700" 
                                />
                            </div>
                            <div className="space-y-1">
                                <Label className="text-[10px] text-slate-500">PBR Stroke (m)</Label>
                                <Input 
                                    type="number" 
                                    value={packerConfig.stroke} 
                                    onChange={(e) => handleChange('stroke', e.target.value)}
                                    className="h-7 text-xs bg-slate-950 border-slate-700" 
                                />
                            </div>
                        </div>
                    )}
                </div>

                {/* SSSV Section */}
                <div className="space-y-3 pt-3 border-t border-slate-800">
                    <div className="flex items-center justify-between">
                        <Label className="text-xs text-orange-400 font-bold">Safety Valve (SSSV)</Label>
                        <Switch 
                            checked={packerConfig.hasSSSV} 
                            onCheckedChange={(c) => handleChange('hasSSSV', c)} 
                            className="scale-75"
                        />
                    </div>
                    
                    {packerConfig.hasSSSV && (
                        <div className="grid grid-cols-2 gap-2 pl-2 border-l-2 border-slate-800">
                            <div className="space-y-1">
                                <Label className="text-[10px] text-slate-500">Depth (m)</Label>
                                <Input 
                                    type="number" 
                                    value={packerConfig.sssvDepth} 
                                    onChange={(e) => handleChange('sssvDepth', e.target.value)}
                                    className="h-7 text-xs bg-slate-950 border-slate-700" 
                                />
                            </div>
                            <div className="space-y-1">
                                <Label className="text-[10px] text-slate-500">Crack P (bar)</Label>
                                <Input 
                                    type="number" 
                                    value={packerConfig.sssvPressure} 
                                    onChange={(e) => handleChange('sssvPressure', e.target.value)}
                                    className="h-7 text-xs bg-slate-950 border-slate-700" 
                                />
                            </div>
                        </div>
                    )}
                </div>

            </CardContent>
        </Card>
    );
};

export default PackerConfigPanel;