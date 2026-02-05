import React from 'react';
import Plot from 'react-plotly.js';
import { motion } from 'framer-motion';
import { Hand, ZoomIn } from 'lucide-react';

const InteractiveLogViewer = ({ petroState, onZonePicked, intervals, results, params }) => {
  const { logData, curveMap, depthCol } = petroState;

  const renderPlot = () => {
    if (!logData || !curveMap.gr) {
      return (
        <div className="flex flex-col items-center justify-center h-full text-center p-8 bg-gray-800/50 border border-dashed border-white/20 rounded-xl">
          <div className="bg-gradient-to-r from-teal-500 to-cyan-500 p-4 rounded-full mb-6">
            <ZoomIn className="w-12 h-12 text-white" />
          </div>
          <h2 className="text-2xl font-bold text-white mb-2">Interactive Log Viewer</h2>
          <p className="text-cyan-300 max-w-md">
            Upload a LAS file and map the 'GR' curve to display the log for interactive zone picking.
          </p>
        </div>
      );
    }

    const depthData = logData.map(row => row[depthCol]);
    const tvdssData = results?.tracks?.TVDSS;

    const traces = [];
    const layout = {
      title: { text: `Composite Log Plot: ${petroState.fileName}`, font: { color: '#e5e7eb' } },
      plot_bgcolor: '#1f2937',
      paper_bgcolor: 'transparent',
      showlegend: false,
      dragmode: 'select',
      selectdirection: 'v',
      margin: { l: 60, r: 60, t: 60, b: 60 },
      grid: { rows: 1, columns: 3, pattern: 'independent' },
      yaxis: {
        title: 'MD (m)',
        autorange: 'reversed',
        titlefont: { color: '#9ca3af' },
        tickfont: { color: '#9ca3af' },
        gridcolor: '#4b5563',
        domain: [0, 1],
      },
    };

    // Track 1: GR
    const grData = logData.map(row => row[curveMap.gr]);
    traces.push({
      x: Array(grData.length).fill(75),
      y: depthData,
      type: 'scatter', mode: 'lines', line: { width: 0 },
      hoverinfo: 'none', xaxis: 'x1', yaxis: 'y1',
    });
    traces.push({
      x: grData,
      y: depthData,
      name: 'GR', type: 'scatter', mode: 'lines',
      line: { color: '#166534', width: 1.5 },
      fill: 'tonextx', fillcolor: 'rgba(253, 224, 71, 0.4)',
      xaxis: 'x1', yaxis: 'y1',
    });
    layout.xaxis1 = {
      title: 'GR (API)', range: [0, 150], autorange: false,
      titlefont: { color: '#9ca3af' }, tickfont: { color: '#9ca3af' }, gridcolor: '#4b5563',
      domain: [0, 0.33],
    };
    layout.yaxis1 = { ...layout.yaxis };

    // Track 2: Resistivity
    if (curveMap.rt) {
      const rtData = logData.map(row => row[curveMap.rt]);
      traces.push({
        x: Array(rtData.length).fill(10),
        y: depthData,
        type: 'scatter', mode: 'lines', line: { width: 0 },
        hoverinfo: 'none', xaxis: 'x2', yaxis: 'y2',
      });
      traces.push({
        x: rtData,
        y: depthData,
        name: 'RT', type: 'scatter', mode: 'lines',
        line: { color: '#ef4444', width: 1.5 },
        fill: 'tonextx', fillcolor: 'rgba(239, 68, 68, 0.3)',
        xaxis: 'x2', yaxis: 'y2',
      });
    }
    layout.xaxis2 = {
      title: 'Resistivity (ohm.m)', type: 'log', range: [Math.log10(0.2), Math.log10(2000)], autorange: false,
      titlefont: { color: '#9ca3af' }, tickfont: { color: '#9ca3af' }, gridcolor: '#4b5563',
      domain: [0.34, 0.66],
    };
    layout.yaxis2 = { ...layout.yaxis, showticklabels: false, matches: 'y1' };

    // Track 3: Density-Neutron
    if (curveMap.rhob && curveMap.nphi) {
      const rhobData = logData.map(row => row[curveMap.rhob]);
      const nphiData = logData.map(row => row[curveMap.nphi]);
      traces.push({
        x: nphiData,
        y: depthData,
        name: 'NPHI', type: 'scatter', mode: 'lines',
        line: { color: '#3b82f6', width: 1.5, dash: 'dash' },
        xaxis: 'x3', yaxis: 'y3',
      });
      traces.push({
        x: rhobData,
        y: depthData,
        name: 'RHOB', type: 'scatter', mode: 'lines',
        line: { color: '#ef4444', width: 1.5 },
        fill: 'tonextx', fillcolor: 'rgba(34, 197, 94, 0.3)',
        xaxis: 'x3', yaxis: 'y3',
      });
    }
    layout.xaxis3 = {
      title: 'DEN(g/cc) / NEU(v/v)',
      titlefont: { color: '#9ca3af' }, tickfont: { color: '#9ca3af' }, gridcolor: '#4b5563',
      domain: [0.67, 1],
      // Density scale
      range: [1.95, 2.95], autorange: false,
      // Neutron scale (overlay)
      overlaying: 'x3', side: 'top', autorange: false, range: [0.45, -0.15],
    };
    layout.yaxis3 = { ...layout.yaxis, showticklabels: false, matches: 'y1' };

    const shapes = intervals.map((interval) => ({
      type: 'rect', xref: 'paper', yref: 'y1',
      x0: 0, y0: interval.top_md, x1: 1, y1: interval.base_md,
      fillcolor: `rgba(56, 189, 248, 0.2)`, line: { width: 0 }
    }));
    layout.shapes = shapes;

    if (tvdssData && tvdssData.length === depthData.length) {
      layout.yaxis.side = 'left';
      layout.yaxis4 = {
        title: 'TVDSS (m)', autorange: 'reversed', overlaying: 'y', side: 'right',
        titlefont: { color: '#fca5a5' }, tickfont: { color: '#fca5a5' }, showgrid: false,
        matches: 'y1',
      };
    }

    const handleSelection = (e) => {
      if (e && e.range && e.range.y) {
        const [top, base] = e.range.y.sort((a, b) => a - b);
        onZonePicked(top, base);
      }
    };

    return (
      <Plot
        data={traces}
        layout={layout}
        config={{ displaylogo: false, responsive: true }}
        className="w-full h-full"
        onSelected={handleSelection}
      />
    );
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
      className="bg-gray-800 p-4 rounded-lg shadow-lg h-full flex flex-col"
    >
      <div className="flex-grow h-[calc(100vh-200px)]">
        {renderPlot()}
      </div>
      <div className="text-center text-xs text-gray-400 pt-2 flex items-center justify-center gap-2">
        <Hand size={14} /> Drag to pan, scroll to zoom. <div className="w-px h-4 bg-gray-600"></div> <ZoomIn size={14} /> Drag vertically to select a zone.
      </div>
    </motion.div>
  );
};

export default InteractiveLogViewer;