import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Calculator, Play, Save } from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Checkbox } from '@/components/ui/checkbox';

const CalculationsPanel = ({ petroState, onRunCalculations, onSaveResults }) => {
  const [params, setParams] = useState({
      // Vshale Params
      vshMethod: 'linear',
      grClean: 30,
      grShale: 120,
      
      // Porosity Params
      phiMethod: 'density', // density, sonic, nd-rms
      rhoMatrix: 2.65, // Sandstone
      rhoFluid: 1.0,   // Water
      dtMatrix: 55.5,  // Sandstone
      dtFluid: 189,    // Water
      
      // Flags
      calculateVsh: true,
      calculatePhi: true
  });

  const handleChange = (key, value) => {
      setParams(prev => ({ ...prev, [key]: value }));
  };

  // Preset handlers
  const applyLithology = (litho) => {
      if (litho === 'sandstone') {
          setParams(prev => ({ ...prev, rhoMatrix: 2.65, dtMatrix: 55.5 }));
      } else if (litho === 'limestone') {
          setParams(prev => ({ ...prev, rhoMatrix: 2.71, dtMatrix: 47.6 }));
      } else if (litho === 'dolomite') {
          setParams(prev => ({ ...prev, rhoMatrix: 2.87, dtMatrix: 43.5 }));
      }
  };

  return (
    <div className="h-full flex flex-col bg-slate-950 border-r border-slate-800 w-full max-w-md">
        <CardHeader className="pb-2 border-b border-slate-800 bg-slate-900/50">
            <CardTitle className="text-sm font-bold text-white flex items-center gap-2">
                <Calculator className="w-4 h-4 text-purple-400" />
                Deterministic Calculator
            </CardTitle>
        </CardHeader>

        <ScrollArea className="flex-1 p-4 space-y-6">
            {/* Matrix Preset */}
            <div className="space-y-2">
                <Label className="text-xs text-slate-400 uppercase tracking-wider">Matrix Presets</Label>
                <div className="flex gap-2">
                    <Button variant="outline" size="sm" className="flex-1 text-xs border-slate-700" onClick={() => applyLithology('sandstone')}>Sandstone</Button>
                    <Button variant="outline" size="sm" className="flex-1 text-xs border-slate-700" onClick={() => applyLithology('limestone')}>Limestone</Button>
                    <Button variant="outline" size="sm" className="flex-1 text-xs border-slate-700" onClick={() => applyLithology('dolomite')}>Dolomite</Button>
                </div>
            </div>

            <Separator className="bg-slate-800" />

            {/* Vshale Section */}
            <div className="space-y-4">
                <div className="flex items-center space-x-2">
                    <Checkbox 
                        id="calc-vsh" 
                        checked={params.calculateVsh}
                        onCheckedChange={(v) => handleChange('calculateVsh', v)}
                    />
                    <Label htmlFor="calc-vsh" className="font-semibold text-slate-200">Vshale Calculation</Label>
                </div>
                
                {params.calculateVsh && (
                    <div className="pl-6 space-y-3 animate-in fade-in slide-in-from-top-2">
                        <div className="space-y-1">
                            <Label className="text-xs text-slate-400">Method</Label>
                            <Select value={params.vshMethod} onValueChange={(v) => handleChange('vshMethod', v)}>
                                <SelectTrigger className="h-8 bg-slate-900 border-slate-700">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="linear">Linear (Gamma Ray)</SelectItem>
                                    <SelectItem value="steiber">Steiber (Tertiary)</SelectItem>
                                    <SelectItem value="clavier">Clavier (Older)</SelectItem>
                                    <SelectItem value="larionov-older">Larionov (Older)</SelectItem>
                                    <SelectItem value="larionov-tertiary">Larionov (Tertiary)</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                            <div className="space-y-1">
                                <Label className="text-xs text-slate-400">GR Clean (API)</Label>
                                <Input 
                                    type="number" 
                                    value={params.grClean}
                                    onChange={(e) => handleChange('grClean', parseFloat(e.target.value))}
                                    className="h-8 bg-slate-900 border-slate-700"
                                />
                            </div>
                            <div className="space-y-1">
                                <Label className="text-xs text-slate-400">GR Shale (API)</Label>
                                <Input 
                                    type="number" 
                                    value={params.grShale}
                                    onChange={(e) => handleChange('grShale', parseFloat(e.target.value))}
                                    className="h-8 bg-slate-900 border-slate-700"
                                />
                            </div>
                        </div>
                    </div>
                )}
            </div>

            <Separator className="bg-slate-800" />

            {/* Porosity Section */}
            <div className="space-y-4">
                <div className="flex items-center space-x-2">
                    <Checkbox 
                        id="calc-phi" 
                        checked={params.calculatePhi}
                        onCheckedChange={(v) => handleChange('calculatePhi', v)}
                    />
                    <Label htmlFor="calc-phi" className="font-semibold text-slate-200">Porosity Calculation</Label>
                </div>

                {params.calculatePhi && (
                    <div className="pl-6 space-y-3 animate-in fade-in slide-in-from-top-2">
                        <div className="space-y-1">
                            <Label className="text-xs text-slate-400">Method</Label>
                            <Select value={params.phiMethod} onValueChange={(v) => handleChange('phiMethod', v)}>
                                <SelectTrigger className="h-8 bg-slate-900 border-slate-700">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="density">Density Only</SelectItem>
                                    <SelectItem value="sonic">Sonic (Wyllie)</SelectItem>
                                    <SelectItem value="nd-rms">Neutron-Density (RMS)</SelectItem>
                                    <SelectItem value="nd-avg">Neutron-Density (Avg)</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="grid grid-cols-2 gap-3">
                            <div className="space-y-1">
                                <Label className="text-xs text-slate-400">Matrix Density (g/cc)</Label>
                                <Input 
                                    type="number" 
                                    step="0.01"
                                    value={params.rhoMatrix}
                                    onChange={(e) => handleChange('rhoMatrix', parseFloat(e.target.value))}
                                    className="h-8 bg-slate-900 border-slate-700"
                                />
                            </div>
                            <div className="space-y-1">
                                <Label className="text-xs text-slate-400">Fluid Density (g/cc)</Label>
                                <Input 
                                    type="number" 
                                    step="0.01"
                                    value={params.rhoFluid}
                                    onChange={(e) => handleChange('rhoFluid', parseFloat(e.target.value))}
                                    className="h-8 bg-slate-900 border-slate-700"
                                />
                            </div>
                        </div>

                        {(params.phiMethod === 'sonic') && (
                             <div className="grid grid-cols-2 gap-3">
                                <div className="space-y-1">
                                    <Label className="text-xs text-slate-400">DT Matrix (us/ft)</Label>
                                    <Input 
                                        type="number" 
                                        value={params.dtMatrix}
                                        onChange={(e) => handleChange('dtMatrix', parseFloat(e.target.value))}
                                        className="h-8 bg-slate-900 border-slate-700"
                                    />
                                </div>
                                <div className="space-y-1">
                                    <Label className="text-xs text-slate-400">DT Fluid (us/ft)</Label>
                                    <Input 
                                        type="number" 
                                        value={params.dtFluid}
                                        onChange={(e) => handleChange('dtFluid', parseFloat(e.target.value))}
                                        className="h-8 bg-slate-900 border-slate-700"
                                    />
                                </div>
                            </div>
                        )}
                    </div>
                )}
            </div>

        </ScrollArea>

        <div className="p-4 border-t border-slate-800 bg-slate-900/50 space-y-2">
            <Button 
                className="w-full bg-blue-600 hover:bg-blue-500" 
                onClick={() => onRunCalculations(params)}
                disabled={petroState.loading}
            >
                <Play className="w-4 h-4 mr-2" /> Run Calculations
            </Button>
             <Button 
                variant="outline"
                className="w-full border-slate-700 text-slate-300 hover:bg-slate-800" 
                onClick={onSaveResults}
                disabled={!petroState.results || petroState.loading}
            >
                <Save className="w-4 h-4 mr-2" /> Save Results to Database
            </Button>
        </div>
    </div>
  );
};

export default CalculationsPanel;