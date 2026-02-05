import React, { useMemo, useState, useRef } from 'react';
import Plot from 'react-plotly.js';
import { useResizeDetector } from 'react-resize-detector';
import { Button } from '@/components/ui/button';
import { ZoomIn, ZoomOut, Maximize2, MousePointer2, BoxSelect } from 'lucide-react';
import { Toggle } from '@/components/ui/toggle';

const LogViewer = ({ data, curveMap, depthRange, markers = [], onIntervalSelect, onDepthClick }) => {
  const { width, height, ref } = useResizeDetector();
  const [toolMode, setToolMode] = useState('pan'); 
  const plotRef = useRef(null);

  const minDepth = depthRange?.min || 0;
  const maxDepth = depthRange?.max || 10000;

  const processCurveData = (mnemonic) => {
      const curveKey = curveMap[mnemonic];
      if (!curveKey) return { x: [], y: [] }; 
      const depthKey = curveMap['DEPTH'];
      return {
          x: data.map(row => row[curveKey]),
          y: data.map(row => row[depthKey])
      };
  };

  const traces = useMemo(() => {
    const commonYAxis = 'y'; 
    const t = [];

    // Helper to add trace
    const addTrace = (procData, name, axis, color, style = {}) => {
        if (procData.x.length > 0 && !procData.x.every(v => v === null)) {
            t.push({
                x: procData.x, y: procData.y, name: name, xaxis: axis, yaxis: commonYAxis,
                type: 'scatter', mode: 'lines', line: { color: color, width: 1, ...style },
                ...style.extra
            });
        }
    };

    // --- TRACK 1: GR / SP / CALI / VSH / Lithology ---
    const gr = processCurveData('GR');
    const vsh = processCurveData('VSH'); 
    const lith = processCurveData('LITH_CODE');

    addTrace(gr, 'GR', 'x1', 'green', { extra: { fill: 'tozerox', fillcolor: 'rgba(34, 197, 94, 0.1)' } });
    
    // Lithology Fill (Concept: Shade the track edge based on lith code?)
    // Plotly doesn't support multi-color line segments easily without splitting traces.
    // Instead, we'll just plot lith curve if exists on same track for now or separate?
    // Let's put Lithology/Fluid on Track 5 (New)
    
    if (vsh.x.length > 0) {
         t.push({
            x: vsh.x, y: vsh.y, name: 'VSH', xaxis: 'x1', yaxis: commonYAxis,
            type: 'scatter', mode: 'lines', line: { color: '#854d0e', width: 0 }, 
            fill: 'tozerox', fillcolor: 'rgba(133, 77, 14, 0.3)', 
            hoverinfo: 'x+y+name'
        });
    }

    // --- TRACK 2: Resistivity ---
    const resDeep = processCurveData('RES_DEEP');
    addTrace(resDeep, 'Res Deep', 'x2', 'red', { width: 1.5 });

    // --- TRACK 3: Porosity ---
    const nphi = processCurveData('NPHI');
    const rhob = processCurveData('RHOB');
    const phie = processCurveData('PHIE'); 
    addTrace(nphi, 'NPHI', 'x3', 'blue', { dash: 'dash' });
    addTrace(rhob, 'RHOB', 'x4', 'red', { width: 1.5 });
    
    if (phie.x.length > 0) {
        t.push({
            x: phie.x, y: phie.y, name: 'PHIE', xaxis: 'x3', yaxis: commonYAxis,
            type: 'scatter', mode: 'lines', line: { color: '#0ea5e9', width: 2 }, 
        });
    }

    // --- TRACK 4: Saturation / Fluid ---
    const sw = processCurveData('SW'); 
    if (sw.x.length > 0) {
        t.push({
            x: sw.x, y: sw.y, name: 'Sw', xaxis: 'x5', yaxis: commonYAxis,
            type: 'scatter', mode: 'lines', line: { color: '#0000ff', width: 1.5 },
            fill: 'tozerox', fillcolor: 'rgba(0, 0, 255, 0.1)'
        });
    }

    // --- TRACK 5: Permeability ---
    const perm = processCurveData('PERM');
    if (perm.x.length > 0) {
        t.push({
            x: perm.x, y: perm.y, name: 'Perm (mD)', xaxis: 'x6', yaxis: commonYAxis,
            type: 'scatter', mode: 'lines', line: { color: '#8b5cf6', width: 1.5 }
        });
    }
    
    // --- TRACK 6: Fluid Analysis (Lith/Fluid Flags) ---
    // We use bar chart trick or just simple line with discrete values
    const fluid = processCurveData('FLUID_CODE');
    if (fluid.x.length > 0) {
        t.push({
            x: fluid.x, y: fluid.y, name: 'Fluid Type', xaxis: 'x7', yaxis: commonYAxis,
            type: 'scatter', mode: 'lines', line: { color: '#f59e0b', width: 1, shape: 'hv' },
            fill: 'tozerox', fillcolor: 'rgba(245, 158, 11, 0.2)'
        });
    }
    
    if (lith.x.length > 0) {
         t.push({
            x: lith.x, y: lith.y, name: 'Lithology', xaxis: 'x7', yaxis: commonYAxis,
            type: 'scatter', mode: 'lines', line: { color: '#64748b', width: 1, shape: 'hv', dash: 'dot' }
        });
    }

    return t;
  }, [data, curveMap]);

  const { shapes, annotations } = useMemo(() => {
      const s = [];
      const a = [];
      markers.forEach(m => {
          s.push({
              type: 'line',
              xref: 'paper', x0: 0, x1: 1,
              yref: 'y', y0: m.depth, y1: m.depth,
              line: { color: m.color, width: 2, dash: m.type.includes('Contact') ? 'dot' : 'solid' }
          });
          a.push({
              xref: 'paper', x: 0.98,
              yref: 'y', y: m.depth,
              text: `<b>${m.name}</b>`,
              showarrow: false,
              xanchor: 'right', yanchor: 'bottom',
              font: { color: m.color, size: 11, family: 'Arial' },
              bgcolor: 'rgba(0,0,0,0.5)',
              borderpad: 2
          });
      });
      return { shapes: s, annotations: a };
  }, [markers]);

  const layout = useMemo(() => ({
    grid: { rows: 1, columns: 6, pattern: 'independent' },
    showlegend: true,
    legend: { orientation: 'h', y: 1.05, x: 0.5, xanchor: 'center', bgcolor: 'rgba(0,0,0,0)' },
    margin: { l: 60, r: 20, t: 80, b: 40 },
    plot_bgcolor: '#1e293b',
    paper_bgcolor: 'transparent',
    height: height || 800,
    dragmode: toolMode === 'select' ? 'select' : 'pan',
    selectdirection: 'v',
    
    yaxis: {
        title: 'Depth', autorange: 'reversed',
        gridcolor: '#334155', zerolinecolor: '#334155',
        tickfont: { color: '#94a3b8' }, titlefont: { color: '#e2e8f0' },
        range: [minDepth, maxDepth]
    },

    // Track 1
    xaxis1: {
        title: 'Gamma', range: [0, 150], domain: [0, 0.15],
        gridcolor: '#334155', tickfont: { color: '#22c55e', size: 9 }, side: 'top'
    },
    // Track 2
    xaxis2: {
        title: 'Resistivity', type: 'log', range: [Math.log10(0.2), Math.log10(2000)], domain: [0.17, 0.32],
        gridcolor: '#334155', tickfont: { color: '#ef4444', size: 9 }, side: 'top'
    },
    // Track 3
    xaxis3: {
        title: 'Porosity', range: [0.45, -0.15], domain: [0.34, 0.49],
        gridcolor: '#334155', tickfont: { color: '#3b82f6', size: 9 }, side: 'top'
    },
    xaxis4: {
        title: 'Density', range: [1.95, 2.95], domain: [0.34, 0.49], overlaying: 'x3', side: 'top', position: 1, showgrid: false, tickfont: { color: '#ef4444', size: 9 }
    },
    // Track 4
    xaxis5: {
        title: 'Sw', range: [1, 0], domain: [0.51, 0.66],
        gridcolor: '#334155', tickfont: { color: '#0000ff', size: 9 }, side: 'top'
    },
    // Track 5 (Perm)
    xaxis6: {
        title: 'Perm (mD)', type: 'log', range: [Math.log10(0.01), Math.log10(10000)], domain: [0.68, 0.83],
        gridcolor: '#334155', tickfont: { color: '#8b5cf6', size: 9 }, side: 'top'
    },
    // Track 6 (Fluid/Lith)
    xaxis7: {
        title: 'Fluid/Lith', range: [0, 5], domain: [0.85, 1.0],
        gridcolor: '#334155', tickfont: { color: '#f59e0b', size: 9 }, side: 'top',
        tickvals: [1, 2, 3, 4], ticktext: ['Sand/Oil', 'Lime/Gas', 'Dolo', 'Shale']
    },

    shapes: shapes,
    annotations: annotations,
    
  }), [height, minDepth, maxDepth, toolMode, shapes, annotations]);

  const handleSelected = (event) => {
      if (!event || !event.range || !onIntervalSelect) return;
      const yRange = event.range.y;
      if (yRange) {
          const sorted = [yRange[0], yRange[1]].sort((a,b) => a - b);
          onIntervalSelect({ top: sorted[0], base: sorted[1] });
      }
  };

  const handleClick = (event) => {
      if (toolMode === 'pan' && onDepthClick && event.points && event.points[0]) {
          onDepthClick(event.points[0].y);
      }
  };

  return (
    <div className="h-full flex flex-col bg-slate-950 rounded-xl border border-slate-800 overflow-hidden">
        <div className="h-10 border-b border-slate-800 bg-slate-900 flex items-center px-2 gap-2">
            <div className="flex items-center bg-slate-800 rounded-md p-0.5 border border-slate-700">
                 <Toggle 
                    pressed={toolMode === 'pan'} 
                    onPressedChange={() => setToolMode('pan')}
                    className="h-7 w-7 data-[state=on]:bg-slate-600 data-[state=on]:text-white"
                 >
                    <MousePointer2 className="w-4 h-4" />
                 </Toggle>
                 <Toggle 
                    pressed={toolMode === 'select'} 
                    onPressedChange={() => setToolMode('select')}
                    className="h-7 w-7 data-[state=on]:bg-blue-600 data-[state=on]:text-white"
                 >
                    <BoxSelect className="w-4 h-4" />
                 </Toggle>
            </div>
            <div className="w-px h-5 bg-slate-700 mx-1" />
            <Button variant="ghost" size="icon" className="h-7 w-7 text-slate-400 hover:text-white">
                <Maximize2 className="w-4 h-4" />
            </Button>
        </div>

        <div ref={ref} className="flex-1 relative w-full">
            {width && height ? (
                <Plot
                    ref={plotRef}
                    data={traces}
                    layout={layout}
                    config={{ responsive: true, displayModeBar: false, scrollZoom: toolMode === 'pan' }}
                    style={{ width: '100%', height: '100%' }}
                    onSelected={handleSelected}
                    onClick={handleClick}
                />
            ) : (
                <div className="flex items-center justify-center h-full text-slate-500">
                    Loading...
                </div>
            )}
        </div>
    </div>
  );
};

export default LogViewer;