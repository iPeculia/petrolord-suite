import React from 'react';
import { useReservoirCalc } from '../../contexts/ReservoirCalcContext';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Wand2 } from 'lucide-react';
import DistributionEditor from './DistributionEditor';

const ProbabilisticInputPanel = () => {
    const { state, updateProbInput } = useReservoirCalc();
    const { probInputs } = state;

    const handleChange = (key, distribution) => {
        updateProbInput(key, distribution);
    };

    const applyTemplate = () => {
        // Example template: North Sea Clastic
        // This acts as a quick "Auto-Fill" demonstration
        // In a real app, this would open a preset dialog.
    };

    return (
        <div className="h-full flex flex-col bg-slate-950">
            <div className="p-4 border-b border-slate-800 flex justify-between items-center">
                <div>
                    <h3 className="text-sm font-bold text-slate-200">Probabilistic Parameters</h3>
                    <p className="text-[10px] text-slate-500">Define uncertainty distributions for Monte Carlo simulation.</p>
                </div>
                <Button variant="ghost" size="sm" className="h-8 text-xs text-blue-400" onClick={applyTemplate}>
                    <Wand2 className="w-3 h-3 mr-1" /> Auto-Fill
                </Button>
            </div>

            <ScrollArea className="flex-1 p-4">
                <div className="space-y-6">
                    <div>
                        <Label className="text-xs font-bold text-emerald-500 uppercase mb-2 block">Geometry</Label>
                        <div className="space-y-2">
                            <DistributionEditor 
                                label="Area" 
                                parameterKey="area" 
                                distribution={probInputs.area} 
                                onChange={handleChange} 
                                unit={state.unitSystem === 'field' ? 'acres' : 'km²'}
                            />
                            <DistributionEditor 
                                label="Net Pay / Thickness" 
                                parameterKey="thickness" 
                                distribution={probInputs.thickness} 
                                onChange={handleChange} 
                                unit={state.unitSystem === 'field' ? 'ft' : 'm'}
                            />
                        </div>
                    </div>

                    <div>
                        <Label className="text-xs font-bold text-blue-500 uppercase mb-2 block">Petrophysics</Label>
                        <div className="space-y-2">
                            <DistributionEditor 
                                label="Net-to-Gross" 
                                parameterKey="ntg" 
                                distribution={probInputs.ntg} 
                                onChange={handleChange} 
                                unit="dec"
                            />
                            <DistributionEditor 
                                label="Porosity" 
                                parameterKey="porosity" 
                                distribution={probInputs.porosity} 
                                onChange={handleChange} 
                                unit="dec"
                            />
                            <DistributionEditor 
                                label="Water Saturation" 
                                parameterKey="sw" 
                                distribution={probInputs.sw} 
                                onChange={handleChange} 
                                unit="dec"
                            />
                        </div>
                    </div>

                    <div>
                        <Label className="text-xs font-bold text-amber-500 uppercase mb-2 block">Fluid</Label>
                        <div className="space-y-2">
                            <DistributionEditor 
                                label="Oil FVF (Bo)" 
                                parameterKey="fvf" 
                                distribution={probInputs.fvf} 
                                onChange={handleChange} 
                                unit="rb/stb"
                            />
                             <DistributionEditor 
                                label="Gas FVF (Bg)" 
                                parameterKey="bg" 
                                distribution={probInputs.bg} 
                                onChange={handleChange} 
                                unit="rcf/scf"
                            />
                            <DistributionEditor 
                                label="Recovery Factor (Oil)" 
                                parameterKey="recovery" 
                                distribution={probInputs.recovery} 
                                onChange={handleChange} 
                                unit="dec"
                            />
                             <DistributionEditor 
                                label="Recovery Factor (Gas)" 
                                parameterKey="recoveryGas" 
                                distribution={probInputs.recoveryGas} 
                                onChange={handleChange} 
                                unit="dec"
                            />
                        </div>
                    </div>
                </div>
            </ScrollArea>
        </div>
    );
};

export default ProbabilisticInputPanel;