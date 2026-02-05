import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Settings2, RefreshCw, Save, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Badge } from '@/components/ui/badge';

const ParameterSlider = ({ label, value, baseValue, onChange, min, max, step, unit }) => {
    const percentChange = ((value - baseValue) / baseValue) * 100;
    
    return (
        <div className="space-y-3 py-2">
            <div className="flex justify-between items-end">
                <Label className="text-xs font-medium text-slate-300">{label}</Label>
                <div className="text-right">
                    <span className="text-sm font-bold text-white mr-1">{value}</span>
                    <span className="text-xs text-slate-500">{unit}</span>
                    {Math.abs(percentChange) > 0.1 && (
                        <span className={`ml-2 text-[10px] ${percentChange > 0 ? 'text-green-400' : 'text-red-400'}`}>
                            {percentChange > 0 ? '+' : ''}{percentChange.toFixed(1)}%
                        </span>
                    )}
                </div>
            </div>
            <Slider 
                value={[value]} 
                min={min} 
                max={max} 
                step={step} 
                onValueChange={(v) => onChange(v[0])}
                className="cursor-pointer"
            />
        </div>
    );
};

const WhatIfAnalysis = ({ baseInputs, onSaveScenario }) => {
    // Initialize local state based on base inputs (simplified extraction of P50/Mode)
    const getVal = (param) => parseFloat(param?.p50 || param?.mode || param?.value || 0);

    const [params, setParams] = useState({
        area: getVal(baseInputs.area) || 1000,
        h: getVal(baseInputs.thickness) || 50,
        phi: getVal(baseInputs.porosity_pct) || 20,
        sw: getVal(baseInputs.sw_pct) || 30,
        rf: getVal(baseInputs.recovery_pct) || 30
    });

    const [result, setResult] = useState(0);
    const [baseResult, setBaseResult] = useState(0);

    // Simple calculation engine for immediate feedback
    useEffect(() => {
        // STOOIP = 7758 * Area * h * phi * (1-sw) / Boi (assume 1.2)
        const calc = (p) => {
            return (7758 * p.area * p.h * (p.phi/100) * (1 - p.sw/100)) / 1.2;
        };

        const currentVal = calc(params);
        setResult(currentVal);
        
        // Calculate base only once or when baseInputs change upstream (in real app)
        // For this component, we re-calc base based on props for comparison
        const baseParams = {
            area: getVal(baseInputs.area) || 1000,
            h: getVal(baseInputs.thickness) || 50,
            phi: getVal(baseInputs.porosity_pct) || 20,
            sw: getVal(baseInputs.sw_pct) || 30,
        };
        setBaseResult(calc(baseParams));

    }, [params, baseInputs]);

    const updateParam = (key, val) => {
        setParams(prev => ({ ...prev, [key]: val }));
    };

    const resetToBSase = () => {
        setParams({
            area: getVal(baseInputs.area) || 1000,
            h: getVal(baseInputs.thickness) || 50,
            phi: getVal(baseInputs.porosity_pct) || 20,
            sw: getVal(baseInputs.sw_pct) || 30,
            rf: getVal(baseInputs.recovery_pct) || 30
        });
    };

    const diff = result - baseResult;
    const diffPct = (diff / baseResult) * 100;

    return (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 h-full">
            {/* Control Panel */}
            <div className="lg:col-span-4 space-y-6 bg-slate-900/30 p-4 rounded-lg border border-slate-800 h-fit">
                <div className="flex justify-between items-center">
                    <h3 className="font-bold text-white flex items-center gap-2">
                        <Settings2 className="w-4 h-4 text-cyan-400" />
                        Parameters
                    </h3>
                    <Button variant="ghost" size="sm" onClick={resetToBSase} className="h-6 text-xs text-slate-400 hover:text-white">
                        <RefreshCw className="w-3 h-3 mr-1" /> Reset
                    </Button>
                </div>

                <div className="space-y-4">
                    <ParameterSlider 
                        label="Area" value={params.area} baseValue={getVal(baseInputs.area)}
                        onChange={(v) => updateParam('area', v)} min={500} max={5000} step={10} unit="ac"
                    />
                    <ParameterSlider 
                        label="Net Pay" value={params.h} baseValue={getVal(baseInputs.thickness)}
                        onChange={(v) => updateParam('h', v)} min={10} max={200} step={1} unit="ft"
                    />
                    <ParameterSlider 
                        label="Porosity" value={params.phi} baseValue={getVal(baseInputs.porosity_pct)}
                        onChange={(v) => updateParam('phi', v)} min={5} max={40} step={0.1} unit="%"
                    />
                    <ParameterSlider 
                        label="Water Sat." value={params.sw} baseValue={getVal(baseInputs.sw_pct)}
                        onChange={(v) => updateParam('sw', v)} min={10} max={80} step={1} unit="%"
                    />
                </div>

                <div className="pt-4 mt-4 border-t border-slate-800">
                    <Button className="w-full bg-cyan-600 hover:bg-cyan-700" onClick={() => onSaveScenario(params)}>
                        <Save className="w-4 h-4 mr-2" />
                        Save as Scenario
                    </Button>
                </div>
            </div>

            {/* Interactive Result */}
            <div className="lg:col-span-8 flex flex-col gap-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Card className="bg-slate-900 border-slate-800">
                        <CardContent className="p-6">
                            <p className="text-sm text-slate-400 mb-1">Base Case STOOIP</p>
                            <p className="text-3xl font-bold text-slate-500">{(baseResult / 1e6).toFixed(1)} <span className="text-sm font-normal">MMbbl</span></p>
                        </CardContent>
                    </Card>
                    <Card className={`bg-slate-900 border-slate-800 ${Math.abs(diffPct) > 0 ? 'border-cyan-500/50' : ''}`}>
                        <CardContent className="p-6 relative overflow-hidden">
                            {Math.abs(diffPct) > 0 && (
                                <div className={`absolute top-0 right-0 p-2 px-3 text-xs font-bold ${diff > 0 ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}>
                                    {diff > 0 ? '+' : ''}{diffPct.toFixed(1)}%
                                </div>
                            )}
                            <p className="text-sm text-slate-400 mb-1">What-If Scenario</p>
                            <p className="text-3xl font-bold text-white">{(result / 1e6).toFixed(1)} <span className="text-sm font-normal">MMbbl</span></p>
                            <p className="text-xs text-slate-500 mt-2">Instant deterministic calculation</p>
                        </CardContent>
                    </Card>
                </div>

                {/* Visual Diff - Simplified Waterfall logic */}
                <Card className="bg-slate-900/50 border-slate-800 flex-1">
                    <CardContent className="p-6 h-[300px] flex items-center justify-center text-slate-500">
                        {/* In a real app, render a Waterfall Chart showing delta contribution of each param */}
                        <div className="text-center">
                            <ArrowRight className="w-10 h-10 mx-auto mb-2 opacity-20" />
                            <p>Parameter Sensitivity</p>
                            <p className="text-xs mt-1 text-slate-600">Visualize impact of {(result/1e6).toFixed(1)} MMbbl result</p>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
};

export default WhatIfAnalysis;