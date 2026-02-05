import React from 'react';
import { useDeclineCurve } from '@/contexts/DeclineCurveContext';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Loader2, TrendingUp } from 'lucide-react';

const DCAForecastEngine = () => {
  const { 
    selectedStream, 
    streamState, 
    updateForecastConfig, 
    runForecast, 
    isForecasting 
  } = useDeclineCurve();

  const config = streamState[selectedStream].forecastConfig;
  const hasFit = !!streamState[selectedStream].fitResults;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-medium text-slate-200">Forecast Settings</h3>
        {!hasFit && <span className="text-[10px] text-amber-500">Fit Model First</span>}
      </div>

      <div className="space-y-4">
        
        {/* Economic Limit */}
        <div className="space-y-2">
          <Label className="text-xs">Economic Limit Rate ({selectedStream === 'gas' ? 'Mcf/d' : 'bbl/d'})</Label>
          <div className="flex items-center gap-2">
            <Input 
              type="number" 
              value={config.economicLimit}
              onChange={(e) => updateForecastConfig('economicLimit', parseFloat(e.target.value))}
              className="bg-slate-800 border-slate-700 h-8 text-xs"
            />
            <div className="flex items-center gap-2 text-xs text-slate-400 whitespace-nowrap">
              <Switch 
                checked={config.stopAtLimit} 
                onCheckedChange={(c) => updateForecastConfig('stopAtLimit', c)} 
                className="scale-75"
              />
              <span>Stop at limit</span>
            </div>
          </div>
        </div>

        {/* Duration */}
        <div className="space-y-2">
          <Label className="text-xs">Max Duration (Days)</Label>
          <Input 
            type="number" 
            value={config.durationDays}
            onChange={(e) => updateForecastConfig('durationDays', parseInt(e.target.value))}
            className="bg-slate-800 border-slate-700 h-8 text-xs"
          />
        </div>

        {/* Facility Limit */}
        <div className="space-y-2">
          <Label className="text-xs">Facility Limit (Max Rate)</Label>
          <Input 
            type="number" 
            value={config.facilityLimit}
            onChange={(e) => updateForecastConfig('facilityLimit', parseFloat(e.target.value))}
            className="bg-slate-800 border-slate-700 h-8 text-xs"
            placeholder="No Limit"
          />
        </div>

      </div>

      <Button 
        onClick={runForecast} 
        disabled={isForecasting || !hasFit}
        className="w-full bg-emerald-600 hover:bg-emerald-500 text-white"
        size="sm"
      >
        {isForecasting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <TrendingUp className="mr-2 h-4 w-4" />}
        Generate Forecast
      </Button>
    </div>
  );
};

export default DCAForecastEngine;