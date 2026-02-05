import React from 'react';
import { Card } from '@/components/ui/card';
import { Slider } from '@/components/ui/slider';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RotateCcw, Lock, Unlock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

const ParamRow = ({ label, value, min, max, step, onChange, description, locked, toggleLock }) => (
    <div className="space-y-2 mb-4">
        <div className="flex justify-between items-center">
            <div className="flex items-center gap-2">
                <Label className="text-xs text-slate-400 font-medium">{label}</Label>
                <TooltipProvider>
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <div className="w-3 h-3 rounded-full bg-slate-800 text-[10px] flex items-center justify-center text-slate-500 cursor-help">?</div>
                        </TooltipTrigger>
                        <TooltipContent className="bg-slate-900 border-slate-700">
                            <p className="text-xs">{description}</p>
                        </TooltipContent>
                    </Tooltip>
                </TooltipProvider>
            </div>
            <div className="flex items-center gap-2">
                <Button variant="ghost" size="icon" className="h-4 w-4 text-slate-600 hover:text-slate-300" onClick={toggleLock}>
                    {locked ? <Lock className="h-3 w-3" /> : <Unlock className="h-3 w-3" />}
                </Button>
                <span className="font-mono text-xs text-emerald-400">{typeof value === 'number' ? value.toFixed(3) : value}</span>
            </div>
        </div>
        <div className="flex items-center gap-3">
            <Slider 
                value={[value]} 
                min={min} 
                max={max} 
                step={step} 
                onValueChange={(v) => !locked && onChange(v[0])} 
                className={`flex-1 ${locked ? 'opacity-50 cursor-not-allowed' : ''}`}
            />
            <Input 
                type="number" 
                value={value} 
                onChange={(e) => !locked && onChange(parseFloat(e.target.value))}
                className="w-16 h-6 text-xs bg-slate-900 border-slate-800" 
                disabled={locked}
            />
        </div>
    </div>
);

const ParameterSliderPanel = ({ params, updateParam }) => {
    // In a real implementation, locking state would be managed locally or passed down
    const [locks, setLocks] = React.useState({});

    const toggleLock = (key) => {
        setLocks(prev => ({ ...prev, [key]: !prev[key] }));
    };

    return (
        <div className="space-y-6 p-1">
            <div>
                <h4 className="text-sm font-bold text-slate-300 mb-4 border-b border-slate-800 pb-2">Eaton Method</h4>
                <ParamRow 
                    label="Eaton Exponent" 
                    value={params.eatonExponent} 
                    min={0.5} max={6.0} step={0.1} 
                    onChange={(v) => updateParam('eatonExponent', v)}
                    description="Controls sensitivity of pore pressure to velocity/resistivity anomalies."
                    locked={locks.eatonExponent}
                    toggleLock={() => toggleLock('eatonExponent')}
                />
            </div>
            
            <div>
                <h4 className="text-sm font-bold text-slate-300 mb-4 border-b border-slate-800 pb-2">Fracture Gradient</h4>
                <ParamRow 
                    label="Poisson Ratio" 
                    value={params.poissonRatio} 
                    min={0.2} max={0.5} step={0.01} 
                    onChange={(v) => updateParam('poissonRatio', v)}
                    description="Relates horizontal stress to vertical stress (elastic deformation)."
                    locked={locks.poissonRatio}
                    toggleLock={() => toggleLock('poissonRatio')}
                />
            </div>

            <div>
                <h4 className="text-sm font-bold text-slate-300 mb-4 border-b border-slate-800 pb-2">Normal Trend</h4>
                <ParamRow 
                    label="NCT Intercept" 
                    value={params.nctIntercept} 
                    min={100} max={250} step={1} 
                    onChange={(v) => updateParam('nctIntercept', v)}
                    description="Transit time at mudline/surface."
                    locked={locks.nctIntercept}
                    toggleLock={() => toggleLock('nctIntercept')}
                />
                <ParamRow 
                    label="NCT Slope" 
                    value={params.nctSlope} 
                    min={0.00001} max={0.0005} step={0.00001} 
                    onChange={(v) => updateParam('nctSlope', v)}
                    description="Rate of compaction with depth."
                    locked={locks.nctSlope}
                    toggleLock={() => toggleLock('nctSlope')}
                />
            </div>
        </div>
    );
};

export default ParameterSliderPanel;