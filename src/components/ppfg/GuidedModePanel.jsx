import React from 'react';
import { BASIN_PRESETS } from '@/utils/parameterPresets';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Globe, TrendingDown, TrendingUp, Activity } from 'lucide-react';

const GuidedModePanel = ({ currentParams, applyPreset }) => {
  return (
    <div className="space-y-6 p-4">
        <div className="space-y-2">
            <h3 className="text-sm font-medium text-slate-400">1. Select Basin / Environment</h3>
            <div className="grid grid-cols-1 gap-3">
                {Object.entries(BASIN_PRESETS).map(([key, preset]) => (
                    <Card 
                        key={key} 
                        className="p-3 bg-slate-900 border-slate-800 hover:border-emerald-500 cursor-pointer transition-all group"
                        onClick={() => applyPreset(key)}
                    >
                        <div className="flex items-start gap-3">
                            <div className="p-2 bg-slate-950 rounded-lg group-hover:bg-emerald-500/10 transition-colors">
                                <Globe className="w-5 h-5 text-slate-400 group-hover:text-emerald-500" />
                            </div>
                            <div>
                                <h4 className="text-sm font-bold text-slate-200">{preset.name}</h4>
                                <p className="text-xs text-slate-500 leading-tight mt-1">{preset.description}</p>
                            </div>
                        </div>
                    </Card>
                ))}
            </div>
        </div>

        <div className="space-y-2">
            <h3 className="text-sm font-medium text-slate-400">2. Adjust Risk Profile</h3>
            <div className="grid grid-cols-3 gap-2">
                <Button 
                    variant="outline" 
                    className="border-blue-900/50 bg-blue-950/20 text-blue-400 hover:bg-blue-900/40 hover:text-blue-300 h-20 flex flex-col gap-1"
                    onClick={() => applyPreset('NIGER_DELTA', 'LOW')} // Example using current basin
                >
                    <TrendingDown className="w-5 h-5" />
                    <span className="text-xs">Low Case</span>
                </Button>
                <Button 
                    variant="outline" 
                    className="border-emerald-900/50 bg-emerald-950/20 text-emerald-400 hover:bg-emerald-900/40 hover:text-emerald-300 h-20 flex flex-col gap-1"
                    onClick={() => applyPreset('NIGER_DELTA', 'BASE')}
                >
                    <Activity className="w-5 h-5" />
                    <span className="text-xs">Base Case</span>
                </Button>
                <Button 
                    variant="outline" 
                    className="border-red-900/50 bg-red-950/20 text-red-400 hover:bg-red-900/40 hover:text-red-300 h-20 flex flex-col gap-1"
                    onClick={() => applyPreset('NIGER_DELTA', 'HIGH')}
                >
                    <TrendingUp className="w-5 h-5" />
                    <span className="text-xs">High Case</span>
                </Button>
            </div>
        </div>

        <div className="p-4 bg-slate-900/50 rounded-lg border border-dashed border-slate-700">
            <div className="text-xs text-slate-500 mb-2">Current Settings Summary</div>
            <div className="flex flex-wrap gap-2">
                <Badge variant="secondary" className="bg-slate-800 text-slate-300">Eaton: {currentParams.eatonExponent?.toFixed(2)}</Badge>
                <Badge variant="secondary" className="bg-slate-800 text-slate-300">Poisson: {currentParams.poissonRatio?.toFixed(2)}</Badge>
            </div>
        </div>
    </div>
  );
};

export default GuidedModePanel;