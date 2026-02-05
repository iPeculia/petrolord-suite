import React, { useMemo } from 'react';
import { useWellCorrelation } from '@/contexts/WellCorrelationContext';
import { getWellTrajectory } from '@/data/wellDepthData';
import { interpolateDepth, DEPTH_COLORS, DEPTH_TYPES, DEPTH_LABELS } from '@/utils/depthTrackUtils';
import { Settings, GripHorizontal, Ruler, ArrowRight, Waves, Ruler as RulerIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Slider } from '@/components/ui/slider';


const DepthTrackRenderer = ({ 
  track, 
  wellId,
  depthRange, 
  height,
  onResizeStart 
}) => {
  const { updateTrack } = useWellCorrelation();
  
  const trajectory = useMemo(() => getWellTrajectory(wellId), [wellId]);

  // Extract settings with defaults
  const depthType = track.type || DEPTH_TYPES.MD;
  const settings = track.settings || {};
  const tickInterval = settings.tickInterval || 500;
  const showLabels = settings.showLabels !== false;
  const showGrid = settings.showGrid !== false;
  const showDeviation = settings.showDeviation || false;
  const showSeaLevel = settings.showSeaLevel || false;
  const trackColor = settings.color || DEPTH_COLORS[depthType] || '#94a3b8';
  
  // Calculate rendering data
  const renderData = useMemo(() => {
    if (!trajectory || !trajectory.md) return null;

    const { md, tvd, tvdss, angle } = trajectory;
    const elements = [];

    // Helper for index lookup
    const getIdx = (d, arr) => {
        if (!arr || arr.length === 0) return 0;
        let idx = arr.findIndex(val => val >= d);
        return idx === -1 ? arr.length - 1 : idx;
    };
    
    // Determine mapping based on type
    let sourceArr, targetArr, minVal, maxVal;
    let fromArr, toArr; // for interpolation

    if (depthType === DEPTH_TYPES.MD) {
        fromArr = md; toArr = md;
    } else if (depthType === DEPTH_TYPES.TVD) {
        fromArr = md; toArr = tvd;
    } else if (depthType === DEPTH_TYPES.TVDSS) {
        fromArr = md; toArr = tvdss;
    } else {
        fromArr = md; toArr = md;
    }
    
    // Find min/max in the current display units
    const minMD = depthRange.min;
    const maxMD = depthRange.max;
    minVal = interpolateDepth(toArr, fromArr, minMD);
    maxVal = interpolateDepth(toArr, fromArr, maxMD);

    // 1. Deviation / Trajectory Track (Background)
    const backgroundElements = [];
    if (showDeviation && angle) {
        let pathD = '';
        let started = false;
        
        const startIndex = getIdx(minMD, md);
        const endIndex = getIdx(maxMD, md);

        const step = Math.max(1, Math.floor((endIndex - startIndex) / 200));

        for (let i = startIndex; i <= endIndex; i += step) {
            if (i >= md.length || i >= angle.length) break;
            const d = md[i];
            const ang = angle[i] || 0;
            
            const y = ((d - minMD) / (maxMD - minMD)) * height;
            const x = (ang / 90) * track.width; 
            
            if (!started) {
                pathD += `M ${x.toFixed(1)} ${y.toFixed(1)}`;
                started = true;
            } else {
                pathD += ` L ${x.toFixed(1)} ${y.toFixed(1)}`;
            }
        }
        
        if (pathD) {
            backgroundElements.push(
                <path 
                    key="deviation-path" 
                    d={pathD} 
                    fill="none" 
                    stroke={trackColor} 
                    strokeOpacity={0.4} 
                    strokeWidth={2} 
                />
            );
            backgroundElements.push(
                <path 
                    key="deviation-area" 
                    d={`${pathD} L 0 ${height} L 0 ${yScale(md[startIndex])} Z`} 
                    fill={trackColor} 
                    fillOpacity={0.1} 
                    stroke="none"
                />
            );
        }
    }

    // 2. Ticks & Labels
    const tickElements = [];
    if (isNaN(minVal) || isNaN(maxVal)) return { backgroundElements, tickElements, refElements: [] };

    const startTick = Math.ceil(minVal / tickInterval) * tickInterval;
    const endTick = Math.floor(maxVal / tickInterval) * tickInterval;

    for (let val = startTick; val <= endTick; val += tickInterval) {
        const mdPos = interpolateDepth(fromArr, toArr, val);
        const y = ((mdPos - minMD) / (maxMD - minMD)) * height;
        
        if (y < -10 || y > height + 10) continue;

        if (showGrid) {
            tickElements.push(
                <line 
                    key={`grid-${val}`} 
                    x1={0} x2={track.width} 
                    y1={y} y2={y} 
                    stroke={trackColor} 
                    strokeWidth={0.5} 
                    strokeOpacity={0.3} 
                />
            );
        }
        
        tickElements.push(
            <line 
                key={`tick-${val}`} 
                x1={track.width - 8} x2={track.width} 
                y1={y} y2={y} 
                stroke={trackColor} 
                strokeWidth={1} 
            />
        );

        if (showLabels) {
            tickElements.push(
                <text 
                    key={`label-${val}`}
                    x={track.width - 12} 
                    y={y + 3} 
                    textAnchor="end" 
                    fill={trackColor} 
                    fontSize={10} 
                    fontWeight="500"
                    className="font-mono select-none"
                    style={{ textShadow: '0 1px 2px rgba(0,0,0,0.5)' }}
                >
                    {val.toFixed(0)}
                </text>
            );
        }
    }

    // 3. Sea Level Reference (Only for TVDSS)
    const refElements = [];
    if (showSeaLevel && depthType === DEPTH_TYPES.TVDSS) {
        const seaLevelMD = interpolateDepth(md, tvdss, 0);
        const ySL = ((seaLevelMD - minMD) / (maxMD - minMD)) * height;
        
        if (ySL >= 0 && ySL <= height) {
            refElements.push(
                <g key="sea-level">
                    <line 
                        x1={0} x2={track.width} 
                        y1={ySL} y2={ySL} 
                        stroke="#3b82f6"
                        strokeWidth={1.5} 
                        strokeDasharray="4 2" 
                    />
                    <text 
                        x={2} y={ySL - 4} 
                        fill="#3b82f6" 
                        fontSize={9} 
                        fontWeight="bold"
                    >
                        MSL (0m)
                    </text>
                </g>
            );
        }
    }
    const yScale = (d) => ((d - minMD) / (maxMD - minMD)) * height;

    return { backgroundElements, tickElements, refElements };
  }, [trajectory, depthRange, height, track.width, depthType, tickInterval, showLabels, showGrid, showDeviation, trackColor, showSeaLevel]);

  const getTrackIcon = (type) => {
    if (type === DEPTH_TYPES.TVDSS) return <Waves className="w-3 h-3 opacity-60" style={{ color: trackColor }}/>;
    if (type === DEPTH_TYPES.TVD) return <ArrowRight className="w-3 h-3 opacity-60 rotate-90" style={{ color: trackColor }}/>;
    if (type === DEPTH_TYPES.MD) return <RulerIcon className="w-3 h-3 opacity-60" style={{ color: trackColor }}/>;
    return <Ruler className="w-3 h-3 opacity-60" style={{ color: trackColor }}/>;
  };

  return (
    <div 
      className="relative h-full border-r border-slate-800 bg-slate-950 group shrink-0 transition-all duration-200 ease-out flex flex-col"
      style={{ width: track.width }}
      role="region"
      aria-label={`${DEPTH_LABELS[depthType]} Depth Track`}
    >
      {/* Track Header */}
      <div className="h-8 border-b border-slate-800 bg-slate-900 flex items-center px-1 justify-between select-none group/header shrink-0 overflow-hidden relative">
        <div className="flex items-center justify-center w-full gap-1.5">
            {getTrackIcon(depthType)}
            <span 
                className="text-[10px] font-bold truncate tracking-tight"
                style={{ color: trackColor }}
            >
                {track.title || DEPTH_LABELS[depthType]}
            </span>
        </div>
        
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="ghost" size="icon" className="h-5 w-5 absolute right-0 opacity-0 group-hover/header:opacity-100 transition-opacity hover:bg-slate-800 focus:opacity-100" aria-label="Track Settings">
              <Settings className="w-3 h-3 text-slate-500" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-72 bg-slate-900 border-slate-800 p-3 shadow-xl animate-in fade-in zoom-in-95" align="start">
            <div className="space-y-4">
              <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                <h4 className="text-xs font-medium text-slate-200">Depth Track Settings</h4>
                <TooltipProvider>
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <div 
                                className="w-3 h-3 rounded-full border border-slate-600 cursor-pointer hover:scale-110 transition-transform" 
                                style={{ backgroundColor: trackColor }} 
                            />
                        </TooltipTrigger>
                        <TooltipContent side="left"><p>Track Color</p></TooltipContent>
                    </Tooltip>
                </TooltipProvider>
              </div>
              
              <div className="space-y-2">
                <Label className="text-xs text-slate-400">Display Type</Label>
                <Select 
                    value={track.type} 
                    onValueChange={(val) => updateTrack(track.id, { 
                        ...track,
                        type: val,
                        title: DEPTH_LABELS[val],
                        settings: { ...settings, color: DEPTH_COLORS[val]}
                    })}
                >
                    <SelectTrigger className="h-7 text-xs bg-slate-950 border-slate-700 focus:ring-1 focus:ring-blue-600">
                        <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-slate-900 border-slate-800">
                        <SelectItem value={DEPTH_TYPES.MD}>Measured Depth (MD)</SelectItem>
                        <SelectItem value={DEPTH_TYPES.TVD}>True Vertical Depth (TVD)</SelectItem>
                        <SelectItem value={DEPTH_TYPES.TVDSS}>Sub-Sea TVD (TVDSS)</SelectItem>
                    </SelectContent>
                </Select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                  <div>
                    <Label className="text-[10px] text-slate-400 mb-1 block">Width (px)</Label>
                    <Input 
                      type="number" 
                      value={track.width} 
                      onChange={(e) => updateTrack(track.id, { ...track, width: parseInt(e.target.value) })}
                      className="h-7 text-xs bg-slate-950 border-slate-700 focus:ring-blue-600" 
                    />
                  </div>
                   <div>
                    <Label className="text-[10px] text-slate-400 mb-1 block">Tick Interval (m)</Label>
                        <Slider 
                            min={100} 
                            max={1000} 
                            step={100}
                            value={[settings.tickInterval || 500]} 
                            onValueChange={([val]) => updateTrack(track.id, { 
                                ...track, settings: { ...settings, tickInterval: val } 
                            })}
                        />
                         <span className="text-[10px] w-6 text-slate-500">{settings.tickInterval || 500}m</span>
                  </div>
              </div>

              <div className="space-y-2 pt-2 border-t border-slate-800">
                  <Label className="text-[10px] font-bold text-slate-500">VISIBILITY</Label>
                  
                  <div className="grid grid-cols-2 gap-2">
                      <div className="flex items-center justify-between bg-slate-950 p-1.5 rounded border border-slate-800/50 hover:border-slate-700 transition-colors">
                        <Label className="text-[10px] cursor-pointer" htmlFor={`labels-${track.id}`}>Labels</Label>
                        <Switch 
                            id={`labels-${track.id}`}
                            checked={showLabels}
                            onCheckedChange={(c) => updateTrack(track.id, { ...track, settings: { ...settings, showLabels: c } })}
                            className="scale-75 data-[state=checked]:bg-blue-600"
                        />
                      </div>
                      <div className="flex items-center justify-between bg-slate-950 p-1.5 rounded border border-slate-800/50 hover:border-slate-700 transition-colors">
                        <Label className="text-[10px] cursor-pointer" htmlFor={`grid-${track.id}`}>Grid</Label>
                        <Switch 
                            id={`grid-${track.id}`}
                            checked={showGrid}
                            onCheckedChange={(c) => updateTrack(track.id, { ...track, settings: { ...settings, showGrid: c } })}
                            className="scale-75 data-[state=checked]:bg-blue-600"
                        />
                      </div>
                      <div className="flex items-center justify-between bg-slate-950 p-1.5 rounded border border-slate-800/50 hover:border-slate-700 transition-colors">
                        <Label className="text-[10px] cursor-pointer" htmlFor={`dev-${track.id}`}>Deviation</Label>
                        <Switch 
                            id={`dev-${track.id}`}
                            checked={showDeviation}
                            onCheckedChange={(c) => updateTrack(track.id, { ...track, settings: { ...settings, showDeviation: c } })}
                            className="scale-75 data-[state=checked]:bg-blue-600"
                        />
                      </div>
                      {depthType === DEPTH_TYPES.TVDSS && (
                          <div className="flex items-center justify-between bg-slate-950 p-1.5 rounded border border-slate-800/50 hover:border-slate-700 transition-colors col-span-2">
                            <Label className="text-[10px] cursor-pointer" htmlFor={`sl-${track.id}`}>Show Sea Level Reference</Label>
                            <Switch 
                                id={`sl-${track.id}`}
                                checked={showSeaLevel}
                                onCheckedChange={(c) => updateTrack(track.id, { ...track, settings: { ...settings, showSeaLevel: c } })}
                                className="scale-75 data-[state=checked]:bg-blue-600"
                            />
                          </div>
                      )}
                  </div>
              </div>
              
              <div className="pt-2 border-t border-slate-800">
                 <Label className="text-[10px] text-slate-400 mb-1 block">Track Color</Label>
                 <div className="flex gap-1.5">
                     {Object.values(DEPTH_COLORS).map(c => (
                         <button
                            key={c}
                            className={`w-5 h-5 rounded-full border transition-all ${trackColor === c ? 'border-white scale-110 ring-1 ring-white/50' : 'border-transparent hover:scale-105'}`}
                            style={{ backgroundColor: c }}
                            onClick={() => updateTrack(track.id, { ...track, settings: { ...settings, color: c } })}
                            aria-label={`Set color to ${c}`}
                         />
                     ))}
                 </div>
              </div>

            </div>
          </PopoverContent>
        </Popover>
      </div>

      {/* Canvas Area */}
      <div className="relative w-full flex-1 overflow-hidden bg-slate-950/30 hover:bg-slate-900/50 transition-colors">
        {renderData && (
            <svg width="100%" height={height} className="absolute inset-0 pointer-events-none" preserveAspectRatio="none">
                <g>{renderData.backgroundElements}</g>
                <g>{renderData.tickElements}</g>
                <g>{renderData.refElements}</g>
            </svg>
        )}
        
        <div className="absolute bottom-1 right-1 text-[9px] font-mono opacity-60 pointer-events-none bg-slate-950/80 px-1 rounded shadow-sm" style={{ color: trackColor }}>
            m
        </div>
      </div>

      {/* Resize Handle */}
      <div 
        className="absolute right-0 top-0 bottom-0 w-1 cursor-col-resize hover:bg-blue-500/50 z-20 group-hover:bg-slate-700/30 transition-colors flex items-center justify-center group/handle outline-none focus-visible:bg-blue-500"
        onMouseDown={(e) => onResizeStart(e, track.id)}
        role="separator"
        aria-label="Resize track handle"
        tabIndex={0}
      >
        <div className="h-8 w-3 bg-blue-500/80 rounded-l opacity-0 group-hover/handle:opacity-100 flex items-center justify-center transition-opacity shadow-lg">
           <GripHorizontal className="w-2 h-2 text-white rotate-90" />
        </div>
      </div>
    </div>
  );
};

export default DepthTrackRenderer;