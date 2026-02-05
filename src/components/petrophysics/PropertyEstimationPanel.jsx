import React, { useState } from 'react';
import { CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Beaker, Play, Save, BarChart2 } from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Checkbox } from '@/components/ui/checkbox';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';

const PropertyEstimationPanel = ({ petroState, onRunEstimation, onSaveResults }) => {
  const [permModel, setPermModel] = useState('timur');
  const [params, setParams] = useState({
      swIrr: 0.1, // Irreducible water saturation guess
      useCalculatedSw: true, // Use Sw as Sw_irr?
      timurA: 0.136,
      timurB: 4.4,
      timurC: 2,
      coatesC: 100,
      wyllieP: 250,
      wyllieQ: 3,
      wyllieR: 1
  });
  const [showCrossplots, setShowCrossplots] = useState(false);

  const handleChange = (key, value) => {
      setParams(prev => ({ ...prev, [key]: value }));
  };

  return (
    <div className="h-full flex flex-col bg-slate-950 border-r border-slate-800 w-full max-w-md">
        <CardHeader className="pb-2 border-b border-slate-800 bg-slate-900/50">
            <CardTitle className="text-sm font-bold text-white flex items-center gap-2">
                <Beaker className="w-4 h-4 text-emerald-400" />
                Property Estimation
            </CardTitle>
        </CardHeader>

        <ScrollArea className="flex-1 p-4 space-y-6">
            {/* Permeability Model */}
            <div className="space-y-3">
                <div className="flex items-center justify-between">
                    <Label className="text-xs text-slate-400 uppercase tracking-wider">Permeability Model</Label>
                    <Dialog open={showCrossplots} onOpenChange={setShowCrossplots}>
                        <DialogTrigger asChild>
                            <Button variant="ghost" size="xs" className="h-6 text-[10px] text-blue-400 hover:text-white">
                                <BarChart2 className="w-3 h-3 mr-1" /> QC Plots
                            </Button>
                        </DialogTrigger>
                        <DialogContent className="bg-slate-900 border-slate-800 max-w-4xl h-[80vh]">
                            <DialogHeader>
                                <DialogTitle>Estimation QC Crossplots</DialogTitle>
                            </DialogHeader>
                            <div className="grid grid-cols-2 gap-4 h-full p-4">
                                <div className="bg-slate-950 rounded border border-slate-800 flex items-center justify-center text-slate-500">
                                    Phi-K Plot (Coming Soon)
                                </div>
                                <div className="bg-slate-950 rounded border border-slate-800 flex items-center justify-center text-slate-500">
                                    NPHI-RHOB Lithology Plot (Coming Soon)
                                </div>
                                <div className="bg-slate-950 rounded border border-slate-800 flex items-center justify-center text-slate-500">
                                    Pickett Plot
                                </div>
                                <div className="bg-slate-950 rounded border border-slate-800 flex items-center justify-center text-slate-500">
                                    Buckles Plot
                                </div>
                            </div>
                        </DialogContent>
                    </Dialog>
                </div>
                
                <Select value={permModel} onValueChange={setPermModel}>
                    <SelectTrigger className="h-9 bg-slate-900 border-slate-700">
                        <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="timur">Timur (General)</SelectItem>
                        <SelectItem value="coates">Coates-Dumanoir (Free Fluid)</SelectItem>
                        <SelectItem value="wyllie">Wyllie-Rose (Generalized)</SelectItem>
                        <SelectItem value="tixier">Tixier (Sandstones)</SelectItem>
                    </SelectContent>
                </Select>
                
                <div className="flex items-center gap-2 mt-2">
                     <Checkbox 
                        id="use-calc-sw" 
                        checked={params.useCalculatedSw}
                        onCheckedChange={(v) => handleChange('useCalculatedSw', v)}
                     />
                     <Label htmlFor="use-calc-sw" className="text-xs text-slate-300">Use Calculated Sw as Sw_irr</Label>
                </div>
                
                {!params.useCalculatedSw && (
                    <div className="space-y-1 animate-in fade-in">
                        <Label className="text-xs text-slate-400">Constant Sw_irr (v/v)</Label>
                        <Input 
                            type="number" step="0.01" 
                            value={params.swIrr}
                            onChange={(e) => handleChange('swIrr', parseFloat(e.target.value))}
                            className="h-8 bg-slate-900 border-slate-700"
                        />
                    </div>
                )}
            </div>

            <Separator className="bg-slate-800" />

            {/* Model Coefficients */}
            <div className="space-y-4">
                <h4 className="text-xs font-semibold text-slate-300 uppercase">Coefficients</h4>
                
                {permModel === 'timur' && (
                     <div className="grid grid-cols-3 gap-2">
                         <div className="space-y-1">
                             <Label className="text-[10px] text-slate-500">a (Scale)</Label>
                             <Input type="number" value={params.timurA} onChange={e => handleChange('timurA', parseFloat(e.target.value))} className="h-7 text-xs bg-slate-900 border-slate-700"/>
                         </div>
                         <div className="space-y-1">
                             <Label className="text-[10px] text-slate-500">b (Phi Exp)</Label>
                             <Input type="number" value={params.timurB} onChange={e => handleChange('timurB', parseFloat(e.target.value))} className="h-7 text-xs bg-slate-900 border-slate-700"/>
                         </div>
                         <div className="space-y-1">
                             <Label className="text-[10px] text-slate-500">c (Sw Exp)</Label>
                             <Input type="number" value={params.timurC} onChange={e => handleChange('timurC', parseFloat(e.target.value))} className="h-7 text-xs bg-slate-900 border-slate-700"/>
                         </div>
                     </div>
                )}

                {permModel === 'coates' && (
                    <div className="space-y-1">
                        <Label className="text-[10px] text-slate-500">C (Scale)</Label>
                        <Input type="number" value={params.coatesC} onChange={e => handleChange('coatesC', parseFloat(e.target.value))} className="h-7 text-xs bg-slate-900 border-slate-700"/>
                    </div>
                )}

                {permModel === 'wyllie' && (
                     <div className="grid grid-cols-3 gap-2">
                         <div className="space-y-1">
                             <Label className="text-[10px] text-slate-500">p (Scale)</Label>
                             <Input type="number" value={params.wyllieP} onChange={e => handleChange('wyllieP', parseFloat(e.target.value))} className="h-7 text-xs bg-slate-900 border-slate-700"/>
                         </div>
                         <div className="space-y-1">
                             <Label className="text-[10px] text-slate-500">q (Phi Exp)</Label>
                             <Input type="number" value={params.wyllieQ} onChange={e => handleChange('wyllieQ', parseFloat(e.target.value))} className="h-7 text-xs bg-slate-900 border-slate-700"/>
                         </div>
                         <div className="space-y-1">
                             <Label className="text-[10px] text-slate-500">r (Sw Exp)</Label>
                             <Input type="number" value={params.wyllieR} onChange={e => handleChange('wyllieR', parseFloat(e.target.value))} className="h-7 text-xs bg-slate-900 border-slate-700"/>
                         </div>
                     </div>
                )}
            </div>

            <Separator className="bg-slate-800" />
            
            <div className="space-y-2">
                 <h4 className="text-xs font-semibold text-slate-300 uppercase">Pipeline Info</h4>
                 <div className="text-[10px] text-slate-400 space-y-1 border-l-2 border-slate-700 pl-2">
                     <p>1. <strong>Lithology:</strong> Derived from RHOB/NPHI matrix identification.</p>
                     <p>2. <strong>Fluid Type:</strong> Classified using Vsh, Sw, and RHOB-NPHI crossover.</p>
                     <p>3. <strong>Permeability:</strong> Calculated using effective porosity and water saturation.</p>
                 </div>
            </div>

        </ScrollArea>

        <div className="p-4 border-t border-slate-800 bg-slate-900/50 space-y-2">
            <Button 
                className="w-full bg-emerald-600 hover:bg-emerald-500" 
                onClick={() => onRunEstimation(permModel, params)}
                disabled={petroState.loading}
            >
                <Play className="w-4 h-4 mr-2" /> Estimate Properties
            </Button>
             <Button 
                variant="outline"
                className="w-full border-slate-700 text-slate-300 hover:bg-slate-800" 
                onClick={onSaveResults}
                disabled={!petroState.results || petroState.loading}
            >
                <Save className="w-4 h-4 mr-2" /> Save Properties to DB
            </Button>
        </div>
    </div>
  );
};

export default PropertyEstimationPanel;