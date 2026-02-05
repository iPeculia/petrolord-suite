import React from 'react';
import { useCasingWearAnalyzer } from '../contexts/CasingWearAnalyzerContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Layers } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

const getWearColor = (wearDepth) => {
  if (wearDepth > 3) return 'fill-red-500/80';
  if (wearDepth > 1) return 'fill-amber-500/80';
  return 'fill-emerald-500/80';
};

const getDLSColor = (dls) => {
  if (dls > 5) return 'fill-red-700/60';
  if (dls > 2) return 'fill-amber-700/60';
  return 'fill-transparent';
};

const WellboreSchematic = () => {
  const { selectedWell, selectedCasingString, derivedLoads, wearProfile } = useCasingWearAnalyzer();
  
  if (!selectedWell || !wearProfile?.profile?.length) return null;
  
  const maxDepth = selectedWell.depth || 1000;
  const casingTop = selectedCasingString?.top || 0;
  const casingBottom = selectedCasingString?.bottom || maxDepth;
  const viewHeight = 600; // SVG height

  const depthToY = (depth) => (depth / maxDepth) * viewHeight;

  return (
    <Card className="bg-slate-900 border-slate-800">
      <CardHeader>
        <CardTitle className="text-sm font-bold text-slate-200 flex items-center">
          <Layers className="w-4 h-4 mr-2 text-blue-500" />
          Wellbore Schematic & Wear Profile
        </CardTitle>
      </CardHeader>
      <CardContent className="p-4 flex gap-4">
        {/* SVG Visualization */}
        <div className="flex-1 bg-slate-950 p-2 rounded-md border border-slate-800">
          <svg width="100%" height={viewHeight} viewBox={`0 0 200 ${viewHeight}`} preserveAspectRatio="xMidYMin meet">
            {/* Depth Scale */}
            <g>
              {[...Array(Math.floor(maxDepth / 500) + 1)].map((_, i) => {
                const depth = i * 500;
                const y = depthToY(depth);
                return (
                  <g key={`depth-tick-${depth}`}>
                    <line x1="25" y1={y} x2="30" y2={y} stroke="#64748b" strokeWidth="0.5" />
                    <text x="23" y={y + 2} textAnchor="end" fill="#94a3b8" fontSize="8">
                      {depth}m
                    </text>
                  </g>
                );
              })}
              <line x1="28" y1="0" x2="28" y2={viewHeight} stroke="#64748b" strokeWidth="0.5" />
            </g>

            {/* Wellbore */}
            <g transform="translate(100, 0)">
              {/* Dogleg Zones */}
              {derivedLoads.profileData.map((point, index) => {
                const prevPoint = derivedLoads.profileData[index - 1] || { depth: 0 };
                return (
                  <rect
                    key={`dls-${point.depth}`}
                    x="-50"
                    y={depthToY(prevPoint.depth)}
                    width="100"
                    height={Math.max(0, depthToY(point.depth) - depthToY(prevPoint.depth))}
                    className={getDLSColor(point.dls)}
                  />
                );
              })}
              
              {/* Casing String */}
              <rect x="-20" y={depthToY(casingTop)} width="40" height={Math.max(0, depthToY(casingBottom) - depthToY(casingTop))} fill="#475569" />
              <rect x="-18" y={depthToY(casingTop)} width="36" height={Math.max(0, depthToY(casingBottom) - depthToY(casingTop))} fill="#52525b" />

              {/* Wear Overlay */}
              <TooltipProvider>
                {wearProfile.profile.map((point, index) => {
                  const prevPoint = wearProfile.profile[index - 1] || { depth: 0 };
                   return (
                    <Tooltip key={`wear-${point.depth}`}>
                      <TooltipTrigger asChild>
                        <rect
                            x="-18"
                            y={depthToY(prevPoint.depth)}
                            width={3 * point.wearDepth_mm}
                            height={Math.max(0, depthToY(point.depth) - depthToY(prevPoint.depth))}
                            className={getWearColor(point.wearDepth_mm)}
                            opacity="0.8"
                         />
                      </TooltipTrigger>
                      <TooltipContent side="right" className="text-xs">
                          <p>Depth: {(point.depth || 0).toFixed(0)}m</p>
                          <p>Wear: {(point.wearDepth_mm || 0).toFixed(3)}mm</p>
                          <p>Rem. WT: {(point.remainingWT_mm || 0).toFixed(2)}mm</p>
                      </TooltipContent>
                    </Tooltip>
                   )
                })}
              </TooltipProvider>

              {/* BHA (simplified) */}
              <line x1="0" y1="0" x2="0" y2={depthToY(maxDepth)} stroke="#e2e8f0" strokeWidth="1" />
              <rect x="-3" y={depthToY(maxDepth) - 20} width="6" height="20" fill="#f59e0b" /> {/* Bit */}
            </g>
          </svg>
        </div>

        {/* Legend */}
        <div className="w-48 space-y-4">
            <h4 className="text-xs font-semibold text-slate-400">Legend</h4>
            <div className="space-y-2">
                <div className="text-xs text-slate-500">Wear Depth</div>
                <div className="flex items-center gap-2 text-xs text-slate-300"><div className="w-3 h-3 rounded-sm bg-red-500/80"></div> {'>'} 3mm</div>
                <div className="flex items-center gap-2 text-xs text-slate-300"><div className="w-3 h-3 rounded-sm bg-amber-500/80"></div> 1-3mm</div>
                <div className="flex items-center gap-2 text-xs text-slate-300"><div className="w-3 h-3 rounded-sm bg-emerald-500/80"></div> {'<'} 1mm</div>
            </div>
             <div className="space-y-2">
                <div className="text-xs text-slate-500">Dogleg Severity</div>
                <div className="flex items-center gap-2 text-xs text-slate-300"><div className="w-3 h-3 rounded-sm bg-red-700/60"></div> {'>'} 5°/30m</div>
                <div className="flex items-center gap-2 text-xs text-slate-300"><div className="w-3 h-3 rounded-sm bg-amber-700/60"></div> 2-5°/30m</div>
            </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default WellboreSchematic;