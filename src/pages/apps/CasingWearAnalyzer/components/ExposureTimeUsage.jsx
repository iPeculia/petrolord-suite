import React from 'react';
import { useCasingWearAnalyzer } from '../contexts/CasingWearAnalyzerContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Clock, RefreshCcw } from 'lucide-react';

const ExposureTimeUsage = () => {
  const { exposureParams, setExposureParams, derivedLoads } = useCasingWearAnalyzer();

  const handleChange = (field, value) => {
    setExposureParams(prev => ({ ...prev, [field]: parseFloat(value) || 0 }));
  };

  return (
    <Card className="bg-slate-900 border-slate-800">
      <CardHeader className="py-3 px-4 border-b border-slate-800">
        <CardTitle className="text-sm font-bold text-slate-200 flex items-center">
          <Clock className="w-4 h-4 mr-2 text-purple-500" />
          Exposure & Usage
        </CardTitle>
      </CardHeader>
      <CardContent className="p-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Inputs */}
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <Label className="text-xs text-slate-400">Rotating Hours</Label>
                <Input 
                  type="number" 
                  value={exposureParams.rotatingHours} 
                  onChange={(e) => handleChange('rotatingHours', e.target.value)}
                  className="h-8 text-xs bg-slate-950 border-slate-700" 
                />
              </div>
              <div className="space-y-1">
                <Label className="text-xs text-slate-400">Avg RPM</Label>
                <Input 
                  type="number" 
                  value={exposureParams.rpm} 
                  onChange={(e) => handleChange('rpm', e.target.value)}
                  className="h-8 text-xs bg-slate-950 border-slate-700" 
                />
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <Label className="text-xs text-slate-400">Sliding Hours</Label>
                <Input 
                  type="number" 
                  value={exposureParams.slidingHours} 
                  onChange={(e) => handleChange('slidingHours', e.target.value)}
                  className="h-8 text-xs bg-slate-950 border-slate-700" 
                />
              </div>
              <div className="space-y-1">
                <Label className="text-xs text-slate-400">Avg ROP (ft/hr)</Label>
                <Input 
                  type="number" 
                  value={exposureParams.ropSliding} 
                  onChange={(e) => handleChange('ropSliding', e.target.value)}
                  className="h-8 text-xs bg-slate-950 border-slate-700" 
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <Label className="text-xs text-slate-400">Trips</Label>
                <Input 
                  type="number" 
                  value={exposureParams.trips} 
                  onChange={(e) => handleChange('trips', e.target.value)}
                  className="h-8 text-xs bg-slate-950 border-slate-700" 
                />
              </div>
              <div className="space-y-1">
                <Label className="text-xs text-slate-400">Backreaming (passes)</Label>
                <Input 
                  type="number" 
                  value={exposureParams.backreamingPasses} 
                  onChange={(e) => handleChange('backreamingPasses', e.target.value)}
                  className="h-8 text-xs bg-slate-950 border-slate-700" 
                />
              </div>
            </div>
          </div>

          {/* Derived Totals */}
          <div className="bg-slate-950 rounded border border-slate-800 p-4 space-y-4">
            <h4 className="text-xs font-semibold text-slate-500 uppercase flex items-center">
              <RefreshCcw className="w-3 h-3 mr-2" /> Calculated Usage
            </h4>
            
            <div className="space-y-2">
              <div className="flex justify-between items-center text-sm">
                <span className="text-slate-400">Rotary Distance</span>
                <span className="font-mono text-white">{(derivedLoads.rotaryDistance / 1000).toFixed(2)} km</span>
              </div>
              <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                <div className="bg-purple-500 h-full" style={{ width: '85%' }}></div>
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between items-center text-sm">
                <span className="text-slate-400">Sliding Distance</span>
                <span className="font-mono text-white">{(derivedLoads.slidingDistance / 1000).toFixed(2)} km</span>
              </div>
              <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                <div className="bg-blue-500 h-full" style={{ width: '15%' }}></div>
              </div>
            </div>

            <div className="pt-2 mt-2 border-t border-slate-800">
              <div className="flex justify-between items-center">
                <span className="text-xs text-slate-500">Total Exposure Time</span>
                <span className="text-sm font-bold text-emerald-400">{exposureParams.rotatingHours + exposureParams.slidingHours} hrs</span>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ExposureTimeUsage;