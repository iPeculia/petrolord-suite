import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Slider } from '@/components/ui/slider';
import { Label } from '@/components/ui/label';
import { Sliders, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';

const SensitivitySliderPanel = ({ parameters, onChange, onReset }) => {
  // Mock params if not provided
  const params = parameters || { v0: 1800, k: 0.5, epsilon: 0.1, delta: 0.05 };

  const handleSliderChange = (key, value) => {
    if(onChange) onChange({ ...params, [key]: value[0] });
  };

  return (
    <Card className="bg-slate-900 border-slate-800">
      <CardHeader className="pb-2 border-b border-slate-800 flex flex-row items-center justify-between">
        <CardTitle className="text-xs font-medium text-white flex items-center gap-2">
           <Sliders className="w-3 h-3 text-pink-400" /> Sensitivity Analysis
        </CardTitle>
        <Button variant="ghost" size="icon" onClick={onReset} className="h-5 w-5 text-slate-500 hover:text-white">
            <RefreshCw className="w-3 h-3" />
        </Button>
      </CardHeader>
      <CardContent className="p-4 space-y-4">
         {/* V0 Slider */}
         <div className="space-y-1">
            <div className="flex justify-between text-[10px] text-slate-400">
                <span>V0 (m/s)</span>
                <span className="text-pink-300 font-mono">{params.v0}</span>
            </div>
            <Slider 
                defaultValue={[params.v0]} 
                max={3000} min={1500} step={10}
                onValueChange={(val) => handleSliderChange('v0', val)}
                className="py-1"
            />
         </div>

         {/* Gradient (k) Slider */}
         <div className="space-y-1">
            <div className="flex justify-between text-[10px] text-slate-400">
                <span>Gradient k (1/s)</span>
                <span className="text-pink-300 font-mono">{params.k}</span>
            </div>
            <Slider 
                defaultValue={[params.k]} 
                max={1.5} min={0} step={0.05}
                onValueChange={(val) => handleSliderChange('k', val)}
                className="py-1"
            />
         </div>

         {/* Anisotropy Epsilon */}
         <div className="space-y-1">
            <div className="flex justify-between text-[10px] text-slate-400">
                <span>Epsilon (ε)</span>
                <span className="text-pink-300 font-mono">{params.epsilon}</span>
            </div>
            <Slider 
                defaultValue={[params.epsilon]} 
                max={0.4} min={0} step={0.01}
                onValueChange={(val) => handleSliderChange('epsilon', val)}
                className="py-1"
            />
         </div>
      </CardContent>
    </Card>
  );
};

export default SensitivitySliderPanel;