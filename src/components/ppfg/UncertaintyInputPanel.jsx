import React from 'react';
import { Slider } from '@/components/ui/slider';
import { Label } from '@/components/ui/label';
import { Card } from '@/components/ui/card';

const UncertaintySlider = ({ label, value, onChange, min, max, step, unit = '%' }) => (
    <div className="mb-4">
        <div className="flex justify-between mb-2">
            <Label className="text-xs text-slate-400">{label}</Label>
            <span className="text-xs font-mono text-emerald-400">{Math.round(value * 100)}{unit}</span>
        </div>
        <Slider 
            value={[value]} 
            onValueChange={([v]) => onChange(v)} 
            min={min} 
            max={max} 
            step={step} 
        />
    </div>
);

const UncertaintyInputPanel = ({ config, setConfig }) => {
    const update = (key, val) => setConfig(prev => ({ ...prev, [key]: val }));

    return (
        <div className="space-y-6 p-4 bg-slate-950/50 rounded-lg border border-slate-800">
            <h3 className="text-sm font-bold text-slate-200 mb-4">Uncertainty Quantification</h3>
            
            <UncertaintySlider 
                label="Log Data Noise (Calibration)" 
                value={config.logNoise} 
                onChange={(v) => update('logNoise', v)} 
                min={0} max={0.2} step={0.01} 
            />
            
            <UncertaintySlider 
                label="Model Method Variance (Eaton/Bowers)" 
                value={config.modelVariance} 
                onChange={(v) => update('modelVariance', v)} 
                min={0} max={0.3} step={0.01} 
            />

            <UncertaintySlider 
                label="Trend Fitting Residuals" 
                value={config.trendResiduals} 
                onChange={(v) => update('trendResiduals', v)} 
                min={0} max={0.2} step={0.01} 
            />
        </div>
    );
};

export default UncertaintyInputPanel;