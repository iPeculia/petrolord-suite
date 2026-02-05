import React from 'react';
import { useCasingWearAnalyzer } from '../contexts/CasingWearAnalyzerContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Droplet, AlertTriangle } from 'lucide-react';

const MudContactParameters = () => {
  const { mudParams, setMudParams } = useCasingWearAnalyzer();

  const handleChange = (field, value) => {
    setMudParams(prev => ({ ...prev, [field]: parseFloat(value) || 0 }));
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {/* Mud Properties */}
      <Card className="bg-slate-900 border-slate-800">
        <CardHeader className="py-3 px-4 border-b border-slate-800">
          <CardTitle className="text-sm font-bold text-slate-200 flex items-center">
            <Droplet className="w-4 h-4 mr-2 text-cyan-500" />
            Mud Properties
          </CardTitle>
        </CardHeader>
        <CardContent className="p-4 space-y-4">
          <div className="space-y-1">
            <Label className="text-xs text-slate-400">Mud Density (ppg)</Label>
            <div className="flex items-center space-x-2">
              <Input 
                type="number" 
                step="0.1"
                value={mudParams.density} 
                onChange={(e) => handleChange('density', e.target.value)}
                className="h-8 text-xs bg-slate-950 border-slate-700" 
              />
              <span className="text-[10px] text-slate-500 w-8">ppg</span>
            </div>
          </div>
          <div className="space-y-1">
            <Label className="text-xs text-slate-400">Viscosity (cP)</Label>
            <div className="flex items-center space-x-2">
              <Input 
                type="number" 
                value={mudParams.viscosity} 
                onChange={(e) => handleChange('viscosity', e.target.value)}
                className="h-8 text-xs bg-slate-950 border-slate-700" 
              />
              <span className="text-[10px] text-slate-500 w-8">cP</span>
            </div>
          </div>
          <div className="space-y-2">
            <div className="flex justify-between">
              <Label className="text-xs text-slate-400">Friction Factor</Label>
              <span className="text-xs text-cyan-400">{mudParams.frictionFactor}</span>
            </div>
            <Slider 
              value={[mudParams.frictionFactor]} 
              min={0.1} max={0.5} step={0.01}
              onValueChange={([val]) => handleChange('frictionFactor', val)}
              className="py-1"
            />
          </div>
        </CardContent>
      </Card>

      {/* Wear Factors */}
      <Card className="bg-slate-900 border-slate-800">
        <CardHeader className="py-3 px-4 border-b border-slate-800">
          <CardTitle className="text-sm font-bold text-slate-200 flex items-center">
            <AlertTriangle className="w-4 h-4 mr-2 text-orange-500" />
            Wear Factors
          </CardTitle>
        </CardHeader>
        <CardContent className="p-4 space-y-4">
          <div className="space-y-1">
            <Label className="text-xs text-slate-400">Tool Joint vs Casing</Label>
            <Input 
              type="number" 
              step="0.1"
              value={mudParams.wearFactorTJ} 
              onChange={(e) => handleChange('wearFactorTJ', e.target.value)}
              className="h-8 text-xs bg-slate-950 border-slate-700 text-orange-400 font-medium" 
            />
            <div className="text-[10px] text-slate-500 italic">Recommended: 1.0 for hardbanding</div>
          </div>
          <div className="space-y-1">
            <Label className="text-xs text-slate-400">Pipe Body vs Casing</Label>
            <Input 
              type="number" 
              step="0.1"
              value={mudParams.wearFactorPB} 
              onChange={(e) => handleChange('wearFactorPB', e.target.value)}
              className="h-8 text-xs bg-slate-950 border-slate-700" 
            />
            <div className="text-[10px] text-slate-500 italic">Typical range: 0.3 - 0.7</div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default MudContactParameters;