import React, { useMemo } from 'react';
import Plot from 'react-plotly.js';
import { useDeclineCurve } from '@/contexts/DeclineCurveContext';
import { calculateArpsHyperbolic } from '@/utils/declineCurve/dcaEngine';

const DCATypeCurvePlot = ({ typeCurve }) => {
  const { wells } = useDeclineCurve();

  const plotData = useMemo(() => {
    if (!typeCurve || !typeCurve.fit) return [];

    const traces = [];

    // 1. Individual Wells (Normalized)
    // Note: Ideally typeCurve object would store the normalized data to avoid re-calc
    // But for now assuming we stored minimal info, we might need to re-normalize or store normalized points in typeCurve
    // Let's assume typeCurve.data contains the normalized points for plotting.
    
    if (typeCurve.normalizedData) {
        // We can plot all points as a scatter cloud
        traces.push({
            x: typeCurve.normalizedData.map(d => d.t_normalized),
            y: typeCurve.normalizedData.map(d => d.rate_normalized),
            mode: 'markers',
            type: 'scatter',
            name: 'Well Data',
            marker: { color: 'rgba(100, 116, 139, 0.3)', size: 3 },
            hoverinfo: 'none' // too many points usually
        });
    }

    // 2. Fitted Curve
    if (typeCurve.fit) {
        const { qi, Di, b } = typeCurve.fit;
        const maxT = Math.max(...(typeCurve.normalizedData?.map(d => d.t_normalized) || [3650]));
        const steps = 100;
        const xFit = [];
        const yFit = [];
        
        // Log steps for smoother look on log plot
        for (let i = 1; i <= steps; i++) {
            const t = Math.exp(Math.log(1) + (Math.log(maxT) - Math.log(1)) * (i / steps));
            xFit.push(t);
            yFit.push(calculateArpsHyperbolic(qi, Di, b, t));
        }

        traces.push({
            x: xFit,
            y: yFit,
            mode: 'lines',
            type: 'scatter',
            name: `Type Curve (b=${b.toFixed(2)})`,
            line: { color: '#a855f7', width: 3 }
        });
    }

    return traces;
  }, [typeCurve]);

  return (
    <div className="w-full h-full min-h-[300px]">
      <Plot
        data={plotData}
        layout={{
          autosize: true,
          margin: { l: 50, r: 20, t: 20, b: 40 },
          paper_bgcolor: 'rgba(0,0,0,0)',
          plot_bgcolor: 'rgba(0,0,0,0)',
          font: { color: '#94a3b8', family: 'Inter, sans-serif' },
          xaxis: { 
            title: 'Normalized Time (Days)', 
            type: 'log', 
            gridcolor: '#1e293b',
            zerolinecolor: '#334155'
          },
          yaxis: { 
            title: 'Normalized Rate', 
            type: 'log', 
            gridcolor: '#1e293b',
            zerolinecolor: '#334155'
          },
          showlegend: true,
          legend: { x: 1, xanchor: 'right', y: 1, bgcolor: 'rgba(15,23,42,0.8)' }
        }}
        useResizeHandler={true}
        style={{ width: '100%', height: '100%' }}
        config={{ responsive: true, displayModeBar: false }}
      />
    </div>
  );
};

export default DCATypeCurvePlot;