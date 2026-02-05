import React from 'react';
import { Card } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Slider } from '@/components/ui/slider';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { Download, Image, FileText, Settings2, Eye, Palette } from 'lucide-react';

const VisualizationControls = ({ settings, onUpdate, onExport, fluidContacts }) => {
    const handleChange = (key, value) => {
        onUpdate({ ...settings, [key]: value });
    };

    return (
        <div className="absolute top-2 right-2 z-20 w-64 flex flex-col gap-2">
            <Card className="bg-slate-900/90 border-slate-800 backdrop-blur-sm p-3 shadow-xl">
                <div className="flex items-center justify-between mb-3">
                    <h4 className="text-xs font-bold text-white flex items-center gap-2">
                        <Settings2 className="w-3 h-3 text-blue-400" /> Display Settings
                    </h4>
                </div>

                <div className="space-y-4">
                    {/* Appearance Section */}
                    <div className="space-y-2">
                        <Label className="text-[10px] text-slate-500 uppercase font-bold">Contour Style</Label>
                        
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <Palette className="w-3 h-3 text-slate-400" />
                                <Label className="text-xs text-slate-300">Color Scale</Label>
                            </div>
                            <Select value={settings.colorScale} onValueChange={(v) => handleChange('colorScale', v)}>
                                <SelectTrigger className="h-6 w-24 text-[10px] bg-slate-950 border-slate-700">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="Earth">Earth</SelectItem>
                                    <SelectItem value="Jet">Jet</SelectItem>
                                    <SelectItem value="Hot">Hot</SelectItem>
                                    <SelectItem value="Viridis">Viridis</SelectItem>
                                    <SelectItem value="Portland">Portland</SelectItem>
                                    <SelectItem value="Picnic">Picnic</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="grid grid-cols-2 gap-2">
                            <div>
                                <Label className="text-[10px] text-slate-400 mb-1 block">Interval</Label>
                                <Input 
                                    type="number" 
                                    className="h-6 text-xs bg-slate-950 border-slate-700" 
                                    value={settings.contourInterval || ''} 
                                    onChange={(e) => handleChange('contourInterval', parseFloat(e.target.value))}
                                    placeholder="Auto"
                                />
                            </div>
                            <div>
                                <Label className="text-[10px] text-slate-400 mb-1 block">Smoothing</Label>
                                <Select value={settings.smoothing?.toString()} onValueChange={(v) => handleChange('smoothing', parseFloat(v))}>
                                    <SelectTrigger className="h-6 text-[10px] bg-slate-950 border-slate-700">
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="0">None</SelectItem>
                                        <SelectItem value="0.5">Low</SelectItem>
                                        <SelectItem value="1">High</SelectItem>
                                        <SelectItem value="1.3">Max</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                    </div>

                    <Separator className="bg-slate-800" />

                    {/* Layers Section */}
                    <div className="space-y-2">
                        <Label className="text-[10px] text-slate-500 uppercase font-bold">Layers</Label>
                        
                        <div className="flex items-center justify-between">
                            <Label className="text-xs text-slate-300">Show Labels</Label>
                            <Switch 
                                checked={settings.showLabels} 
                                onCheckedChange={(c) => handleChange('showLabels', c)} 
                                className="scale-75"
                            />
                        </div>

                        <div className="flex items-center justify-between">
                            <Label className="text-xs text-slate-300">Fluid Contacts</Label>
                            <Switch 
                                checked={settings.showContacts} 
                                onCheckedChange={(c) => handleChange('showContacts', c)} 
                                className="scale-75"
                            />
                        </div>

                        <div className="flex items-center justify-between">
                            <Label className="text-xs text-slate-300">Faults/Overlay</Label>
                            <Switch 
                                checked={settings.showFaults} 
                                onCheckedChange={(c) => handleChange('showFaults', c)} 
                                className="scale-75"
                            />
                        </div>
                        
                        {/* Opacity Slider */}
                        <div className="pt-1">
                            <div className="flex justify-between text-[10px] text-slate-400 mb-1">
                                <span>Opacity</span>
                                <span>{(settings.opacity * 100).toFixed(0)}%</span>
                            </div>
                            <Slider 
                                value={[settings.opacity]} 
                                max={1} 
                                step={0.1} 
                                onValueChange={([v]) => handleChange('opacity', v)}
                                className="py-1"
                            />
                        </div>
                    </div>

                    <Separator className="bg-slate-800" />

                    {/* Export Section */}
                    <div className="grid grid-cols-2 gap-2">
                        <Button variant="outline" size="sm" className="h-7 text-[10px] gap-1" onClick={() => onExport('image')}>
                            <Image className="w-3 h-3" /> Export Map
                        </Button>
                        <Button variant="outline" size="sm" className="h-7 text-[10px] gap-1" onClick={() => onExport('csv')}>
                            <FileText className="w-3 h-3" /> Export Data
                        </Button>
                    </div>
                </div>
            </Card>

            {settings.showContacts && (fluidContacts.owc || fluidContacts.goc) && (
                <Card className="bg-slate-900/90 border-slate-800 backdrop-blur-sm p-2 shadow-xl">
                    <div className="text-[10px] text-slate-500 uppercase font-bold mb-1">Active Contacts</div>
                    <div className="space-y-1 text-xs">
                        {fluidContacts.goc !== null && fluidContacts.goc !== undefined && (
                            <div className="flex items-center gap-2">
                                <div className="w-3 h-0.5 bg-red-500"></div>
                                <span className="text-slate-300">GOC: {fluidContacts.goc}</span>
                            </div>
                        )}
                        {fluidContacts.owc !== null && fluidContacts.owc !== undefined && (
                            <div className="flex items-center gap-2">
                                <div className="w-3 h-0.5 bg-blue-500"></div>
                                <span className="text-slate-300">OWC: {fluidContacts.owc}</span>
                            </div>
                        )}
                    </div>
                </Card>
            )}
        </div>
    );
};

export default VisualizationControls;