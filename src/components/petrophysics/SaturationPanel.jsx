import React, { useState } from 'react';
import { CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Droplets, Play, Save, Info } from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from '@/components/ui/accordion';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

const SaturationPanel = ({ petroState, onRunSaturation, onSaveResults }) => {
  const [model, setModel] = useState('archie');
  const [params, setParams] = useState({
      a: 1,
      m: 2,
      n: 2,
      rw: 0.05, // Formation Water Resistivity
      rsh: 2.0, // Shale Resistivity (for Simandoux/Indonesian)
      temp: 150, // Formation Temp (F) for corrections
      qv: 0.2 // Cation Exchange Capacity (for Waxman-Smits)
  });

  const handleChange = (key, value) => {
      setParams(prev => ({ ...prev, [key]: value }));
  };

  const renderParamInput = (label, key, tooltip, step = 0.01) => (
      <div className="space-y-1">
          <div className="flex items-center gap-2">
             <Label className="text-xs text-slate-400">{label}</Label>
             {tooltip && (
                 <TooltipProvider>
                     <Tooltip>
                         <TooltipTrigger><Info className="w-3 h-3 text-slate-600 hover:text-slate-400" /></TooltipTrigger>
                         <TooltipContent className="bg-slate-800 border-slate-700 text-slate-300 text-xs max-w-[200px]">
                             {tooltip}
                         </TooltipContent>
                     </Tooltip>
                 </TooltipProvider>
             )}
          </div>
          <Input 
            type="number" 
            step={step}
            value={params[key]}
            onChange={(e) => handleChange(key, parseFloat(e.target.value))}
            className="h-8 bg-slate-900 border-slate-700 text-white"
          />
      </div>
  );

  return (
    <div className="h-full flex flex-col bg-slate-950 border-r border-slate-800 w-full max-w-md">
        <CardHeader className="pb-2 border-b border-slate-800 bg-slate-900/50">
            <CardTitle className="text-sm font-bold text-white flex items-center gap-2">
                <Droplets className="w-4 h-4 text-blue-400" />
                Saturation Models
            </CardTitle>
        </CardHeader>

        <ScrollArea className="flex-1 p-4 space-y-6">
            {/* Model Selection */}
            <div className="space-y-2">
                <Label className="text-xs text-slate-400 uppercase tracking-wider">Select Model</Label>
                <Select value={model} onValueChange={setModel}>
                    <SelectTrigger className="h-9 bg-slate-900 border-slate-700">
                        <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="archie">Archie (Clean Sand)</SelectItem>
                        <SelectItem value="simandoux">Simandoux (Shaly Sand)</SelectItem>
                        <SelectItem value="indonesian">Indonesian (Complex Lith)</SelectItem>
                        <SelectItem value="waxman">Waxman-Smits (Dispersed Clay)</SelectItem>
                    </SelectContent>
                </Select>
                <p className="text-[10px] text-slate-500 leading-tight pt-1">
                    {model === 'archie' && "Best for clean, non-shaly formations (Vsh < 10%)."}
                    {model === 'simandoux' && "Corrects for shale conductivity. Requires Vsh and Rsh."}
                    {model === 'indonesian' && "Developed for shaly sands in Indonesia. Handles high shale volumes well."}
                    {model === 'waxman' && "Physics-based model accounting for clay cation exchange (Qv)."}
                </p>
            </div>

            <Separator className="bg-slate-800" />

            {/* Parameters */}
            <div className="space-y-4">
                <h4 className="text-xs font-semibold text-slate-300 uppercase">Model Parameters</h4>
                
                <div className="grid grid-cols-2 gap-3">
                    {renderParamInput("Rw (ohm.m)", "rw", "Formation water resistivity at formation temperature.")}
                    {renderParamInput("a (Tortuosity)", "a", "Tortuosity factor (usually 1 for sands, 0.81 for carbonates).")}
                    {renderParamInput("m (Cementation)", "m", "Cementation exponent (usually 2).")}
                    {renderParamInput("n (Saturation)", "n", "Saturation exponent (usually 2).")}
                </div>

                {(model === 'simandoux' || model === 'indonesian') && (
                    <div className="pt-2 animate-in fade-in slide-in-from-top-2">
                        <Label className="text-xs font-semibold text-yellow-500 block mb-2">Shale Parameters</Label>
                        <div className="grid grid-cols-2 gap-3">
                            {renderParamInput("Rsh (ohm.m)", "rsh", "Resistivity of 100% shale interval.")}
                        </div>
                    </div>
                )}

                {model === 'waxman' && (
                    <div className="pt-2 animate-in fade-in slide-in-from-top-2">
                         <Label className="text-xs font-semibold text-purple-500 block mb-2">Advanced Parameters</Label>
                         <div className="grid grid-cols-2 gap-3">
                            {renderParamInput("Qv (meq/ml)", "qv", "Cation Exchange Capacity per unit pore volume.")}
                            {renderParamInput("Temp (°F)", "temp", "Formation Temperature (for B factor calculation).")}
                        </div>
                    </div>
                )}
            </div>

            <Separator className="bg-slate-800" />

            {/* Quick Guide Accordion */}
            <Accordion type="single" collapsible className="w-full">
                <AccordionItem value="guide" className="border-slate-800">
                    <AccordionTrigger className="text-xs text-slate-400 py-2">Parameter Estimation Guide</AccordionTrigger>
                    <AccordionContent className="text-[10px] text-slate-500 space-y-1">
                        <p><strong>Sandstones:</strong> a=0.81, m=2, n=2 (Humble)</p>
                        <p><strong>Carbonates:</strong> a=1, m=2, n=2 (Archie)</p>
                        <p><strong>Rsh:</strong> Pick from shale baseline on Deep Resistivity.</p>
                        <p><strong>Rw:</strong> Derive from SP, Pickett Plot, or water catalog.</p>
                    </AccordionContent>
                </AccordionItem>
            </Accordion>

        </ScrollArea>

        <div className="p-4 border-t border-slate-800 bg-slate-900/50 space-y-2">
            <Button 
                className="w-full bg-blue-600 hover:bg-blue-500" 
                onClick={() => onRunSaturation(model, params)}
                disabled={petroState.loading}
            >
                <Play className="w-4 h-4 mr-2" /> Calculate Saturation (Sw)
            </Button>
             <Button 
                variant="outline"
                className="w-full border-slate-700 text-slate-300 hover:bg-slate-800" 
                onClick={onSaveResults}
                disabled={!petroState.results || petroState.loading}
            >
                <Save className="w-4 h-4 mr-2" /> Save Sw to Database
            </Button>
        </div>
    </div>
  );
};

export default SaturationPanel;