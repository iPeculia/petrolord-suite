import React, { useState, useMemo } from 'react';
import Plot from 'react-plotly.js';
import { Card } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { AlignCenter, Layers, ArrowLeftRight, Lock, MoveVertical, RefreshCcw, Wand2 } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/components/ui/use-toast';

const CorrelationView = ({ wells, selectedWellIds, markers, onToggleWell, flattenMarker, onSetFlattenMarker, onAddMarker }) => {
  const { toast } = useToast();
  const [displayCurve, setDisplayCurve] = useState('GR');
  const [datumDepth, setDatumDepth] = useState(0);
  const [pickMode, setPickMode] = useState(false); // 'pick' or null
  const [activePick, setActivePick] = useState(null); // { wellId, depth }

  // Filter wells
  const activeWells = useMemo(() => {
    return selectedWellIds
        .map(id => wells.find(w => w.id === id))
        .filter(Boolean);
  }, [wells, selectedWellIds]);

  // Calculate Depth Shifts for Flattening
  const wellShifts = useMemo(() => {
      const shifts = {};
      if (!flattenMarker) {
          activeWells.forEach(w => shifts[w.id] = 0);
          return shifts;
      }

      // Find marker depth in each well
      activeWells.forEach(w => {
          const m = markers.find(m => m.well_id === w.id && m.name === flattenMarker);
          if (m) {
              // Shift so marker is at 0 (or datum)
              shifts[w.id] = -m.depth; 
          } else {
              shifts[w.id] = 0; // No marker, no shift
          }
      });
      return shifts;
  }, [activeWells, markers, flattenMarker]);

  // Prepare Plot Data
  const { traces, layoutShapes, layoutAnnotations } = useMemo(() => {
    if (activeWells.length === 0) return { traces: [], layoutShapes: [], layoutAnnotations: [] };

    const t = [];
    const s = [];
    const a = [];
    const wellCount = activeWells.length;
    const domainWidth = 1 / wellCount;
    const gap = 0.05; // gap between tracks

    // Helper to get X domain for a track index
    const getDomain = (i) => {
        const start = i * domainWidth + (gap/2);
        const end = (i + 1) * domainWidth - (gap/2);
        return [start, end];
    };

    // Helper to convert well X to Paper X (approximate center of track)
    const getTrackCenterPaperX = (i) => {
        const [start, end] = getDomain(i);
        return (start + end) / 2;
    };

    // 1. Generate Traces (Curves)
    activeWells.forEach((well, index) => {
      const curveKey = well.curveMap[displayCurve];
      const depthKey = well.curveMap['DEPTH'];
      if (!curveKey) return;

      const shift = wellShifts[well.id] || 0;
      
      const depthData = well.data.map(row => row[depthKey] + shift);
      const curveData = well.data.map(row => row[curveKey]);

      t.push({
        x: curveData,
        y: depthData,
        name: well.name,
        xaxis: `x${index + 1}`,
        yaxis: 'y',
        type: 'scatter',
        mode: 'lines',
        line: { width: 1, color: '#22c55e' }, // GR standard green
        fill: 'tozerox',
        fillcolor: 'rgba(34, 197, 94, 0.1)'
      });

      // Add Markers for this well
      const wellMarkers = markers.filter(m => m.well_id === well.id);
      wellMarkers.forEach(m => {
          const yPos = m.depth + shift;
          
          // Horizontal line across track
          s.push({
              type: 'line',
              xref: `x${index + 1} domain`, x0: 0, x1: 1,
              yref: 'y', y0: yPos, y1: yPos,
              line: { color: m.color, width: 2, dash: 'solid' }
          });

          // Label
          a.push({
              xref: `x${index + 1} domain`, x: 0.05,
              yref: 'y', y: yPos,
              text: m.name,
              showarrow: false,
              xanchor: 'left', yanchor: 'bottom',
              font: { color: m.color, size: 10 },
              bgcolor: 'rgba(0,0,0,0.6)'
          });
      });
    });

    // 2. Generate Correlation Lines (Shapes between tracks)
    // Identify markers with same name in adjacent wells
    for (let i = 0; i < wellCount - 1; i++) {
        const wellA = activeWells[i];
        const wellB = activeWells[i+1];
        
        const markersA = markers.filter(m => m.well_id === wellA.id);
        const markersB = markers.filter(m => m.well_id === wellB.id);

        markersA.forEach(mA => {
            const mB = markersB.find(m => m.name === mA.name);
            if (mB) {
                const yA = mA.depth + (wellShifts[wellA.id] || 0);
                const yB = mB.depth + (wellShifts[wellB.id] || 0);
                
                // Draw line from end of Track A to start of Track B
                // Using 'paper' coordinates for X is easier if we know domains
                const [startA, endA] = getDomain(i);
                const [startB, endB] = getDomain(i+1);
                
                // We want the line to go from right edge of A to left edge of B
                // Using xref='paper'
                s.push({
                    type: 'line',
                    xref: 'paper', x0: endA, x1: startB,
                    yref: 'y', y0: yA, y1: yB,
                    line: { color: mA.color, width: 1, dash: 'dot' }
                });
            }
        });
    }

    return { traces: t, layoutShapes: s, layoutAnnotations: a };
  }, [activeWells, displayCurve, markers, wellShifts]);

  const layout = useMemo(() => {
      const wellCount = activeWells.length;
      if (wellCount === 0) return {};

      const baseLayout = {
        grid: { rows: 1, columns: wellCount, pattern: 'independent' },
        showlegend: false,
        margin: { l: 50, r: 20, t: 80, b: 40 },
        plot_bgcolor: '#1e293b',
        paper_bgcolor: 'transparent',
        height: 700,
        dragmode: 'pan', // Default
        hovermode: 'y unified',
        yaxis: {
            title: flattenMarker ? `Stratigraphic Depth (Relative to ${flattenMarker})` : 'Depth (MD)',
            autorange: 'reversed',
            gridcolor: '#334155',
            zerolinecolor: '#475569',
            tickfont: { color: '#94a3b8' },
            titlefont: { color: '#e2e8f0' }
        },
        shapes: layoutShapes,
        annotations: layoutAnnotations
      };

      const gap = 0.05;
      const domainWidth = 1 / wellCount;

      // Generate X-axes dynamically
      for (let i = 0; i < wellCount; i++) {
          const start = i * domainWidth + (gap/2);
          const end = (i + 1) * domainWidth - (gap/2);

          baseLayout[`xaxis${i + 1}`] = {
              title: {
                  text: `<b>${activeWells[i].name}</b>`,
                  font: { size: 12, color: '#e2e8f0' }
              },
              domain: [start, end],
              gridcolor: '#334155',
              tickfont: { color: '#22c55e', size: 10 }, // GR color
              range: [0, 150], 
              side: 'top'
          };
      }

      return baseLayout;
  }, [activeWells, layoutShapes, layoutAnnotations, flattenMarker]);

  const handlePlotClick = (event) => {
      if (!pickMode || !event.points || !event.points[0]) return;
      
      const point = event.points[0];
      // Identify which well was clicked based on xaxis
      // xaxis name is usually "x", "x2", "x3"...
      const axisId = point.xaxis._id; // e.g. "x" or "x2"
      const wellIndex = axisId === 'x' ? 0 : parseInt(axisId.replace('x', '')) - 1;
      const well = activeWells[wellIndex];
      
      if (!well) return;

      // Adjust depth back to MD if flattened
      const clickedRelativeDepth = point.y;
      const actualDepth = clickedRelativeDepth - (wellShifts[well.id] || 0);

      if (activePick) {
          // Second click - complete correlation
          onAddMarker({
             well_id: well.id,
             name: 'New Pick',
             depth: actualDepth,
             type: 'Formation',
             color: '#facc15' 
          });
          setPickMode(false);
          setActivePick(null);
          toast({ title: "Correlation Point Added", description: `Marked on ${well.name}` });
      } else {
          // First click - start correlation
          setActivePick({ wellId: well.id, depth: actualDepth });
          toast({ title: "Pick Started", description: `Select point on another well to correlate.` });
      }
  };

  return (
    <div className="h-full flex gap-4">
       {/* Sidebar Controls */}
       <Card className="w-72 bg-slate-900 border-slate-800 flex flex-col shrink-0">
           <div className="p-4 border-b border-slate-800 bg-slate-900/50 space-y-4">
               <div>
                   <Label className="text-xs mb-1.5 block text-slate-400">Display Curve</Label>
                   <Select value={displayCurve} onValueChange={setDisplayCurve}>
                       <SelectTrigger className="h-8 bg-slate-950 border-slate-800">
                           <SelectValue />
                       </SelectTrigger>
                       <SelectContent>
                           <SelectItem value="GR">Gamma Ray (GR)</SelectItem>
                           <SelectItem value="RES_DEEP">Resistivity (Deep)</SelectItem>
                           <SelectItem value="NPHI">Neutron (NPHI)</SelectItem>
                           <SelectItem value="RHOB">Density (RHOB)</SelectItem>
                       </SelectContent>
                   </Select>
               </div>

               <div className="p-3 rounded-lg bg-slate-950 border border-slate-800 space-y-3">
                   <h4 className="text-xs font-semibold text-blue-400 flex items-center gap-2">
                       <AlignCenter className="w-3 h-3" /> Flattening (Datum)
                   </h4>
                   <Select value={flattenMarker || "none"} onValueChange={(v) => onSetFlattenMarker(v === "none" ? null : v)}>
                       <SelectTrigger className="h-8 text-xs">
                           <SelectValue placeholder="Select Marker..." />
                       </SelectTrigger>
                       <SelectContent>
                           <SelectItem value="none">None (Measured Depth)</SelectItem>
                           {/* Unique marker names */}
                           {[...new Set(markers.map(m => m.name))].map(name => (
                               <SelectItem key={name} value={name}>{name}</SelectItem>
                           ))}
                       </SelectContent>
                   </Select>
                   {flattenMarker && (
                       <div className="text-[10px] text-slate-500 flex items-center gap-1">
                           <Lock className="w-3 h-3" /> Locked on {flattenMarker}
                       </div>
                   )}
               </div>

               <Button 
                    variant={pickMode ? "default" : "outline"} 
                    className={`w-full justify-start ${pickMode ? 'bg-blue-600 hover:bg-blue-500' : 'border-slate-700'}`}
                    onClick={() => { setPickMode(!pickMode); setActivePick(null); }}
               >
                   <Wand2 className="w-4 h-4 mr-2" />
                   {pickMode ? (activePick ? "Click Target Well..." : "Cancel Pick") : "Pick Boundaries"}
               </Button>
           </div>

           <ScrollArea className="flex-1 p-4">
               <h4 className="text-xs font-semibold text-slate-500 uppercase mb-3 flex justify-between">
                   <span>Active Wells</span>
                   <span className="text-[10px]">{selectedWellIds.length}/4</span>
               </h4>
               <div className="space-y-2">
                   {wells.map(well => (
                       <div key={well.id} className="flex items-center space-x-2 p-2 rounded hover:bg-slate-800/50 transition-colors">
                           <Checkbox 
                                id={`chk-${well.id}`}
                                checked={selectedWellIds.includes(well.id)}
                                onCheckedChange={() => onToggleWell(well.id)}
                                disabled={!selectedWellIds.includes(well.id) && selectedWellIds.length >= 4}
                                className="border-slate-600 data-[state=checked]:bg-blue-600"
                           />
                           <label 
                                htmlFor={`chk-${well.id}`}
                                className="text-sm text-slate-300 cursor-pointer select-none truncate flex-1"
                           >
                               {well.name}
                           </label>
                           {selectedWellIds.includes(well.id) && (
                               <Badge variant="outline" className="text-[10px] border-slate-700 text-slate-500 h-5">
                                   Track {selectedWellIds.indexOf(well.id) + 1}
                               </Badge>
                           )}
                       </div>
                   ))}
               </div>

               {/* Stats / QA */}
               {activeWells.length > 1 && (
                   <div className="mt-6 pt-4 border-t border-slate-800">
                       <h4 className="text-xs font-semibold text-slate-500 uppercase mb-2">Stats</h4>
                       <div className="space-y-2 text-xs text-slate-400">
                           <div className="flex justify-between">
                               <span>Range Span:</span>
                               <span className="text-slate-200">{(activeWells.length * 0.25 * 1000).toFixed(0)} ft (est)</span>
                           </div>
                           <div className="flex justify-between">
                               <span>Markers Visible:</span>
                               <span className="text-slate-200">{markers.filter(m => selectedWellIds.includes(m.well_id)).length}</span>
                           </div>
                       </div>
                   </div>
               )}
           </ScrollArea>
       </Card>

       {/* Viewport */}
       <div className="flex-1 bg-slate-950 rounded-xl border border-slate-800 overflow-hidden relative min-h-[600px]">
            {activeWells.length > 0 ? (
                <Plot
                    data={traces}
                    layout={layout}
                    useResizeHandler={true}
                    style={{ width: '100%', height: '100%' }}
                    config={{
                        displayModeBar: true,
                        modeBarButtonsToRemove: ['lasso2d', 'select2d', 'autoScale2d'],
                        displaylogo: false,
                        scrollZoom: true,
                        responsive: true
                    }}
                    onClick={handlePlotClick}
                />
            ) : (
                <div className="flex flex-col items-center justify-center h-full text-slate-500">
                    <ArrowLeftRight className="w-16 h-16 mb-4 opacity-20" />
                    <p>Select at least one well to visualize.</p>
                    <p className="text-xs mt-2 opacity-50">Use the sidebar to add tracks.</p>
                </div>
            )}
       </div>
    </div>
  );
};

export default CorrelationView;