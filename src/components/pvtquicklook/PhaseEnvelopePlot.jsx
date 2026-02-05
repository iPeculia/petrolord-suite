import React from 'react';
import Plotly from 'plotly.js-dist-min';
import createPlotlyComponent from 'react-plotly.js/factory';
const Plot = createPlotlyComponent(Plotly);

const PhaseEnvelopePlot = ({ data, plotId }) => {
  if (!data) return null;

  const { bubble_point_line, dew_point_line, critical_point, cricondentherm } = data;

  const traces = [];

  if (bubble_point_line && bubble_point_line.length > 0) {
    traces.push({
      x: bubble_point_line.map(p => p.T),
      y: bubble_point_line.map(p => p.P),
      mode: 'lines',
      name: 'Bubble Point Line',
      line: { color: '#ef4444', width: 3 },
    });
  }

  if (dew_point_line && dew_point_line.length > 0) {
    traces.push({
      x: dew_point_line.map(p => p.T),
      y: dew_point_line.map(p => p.P),
      mode: 'lines',
      name: 'Dew Point Line',
      line: { color: '#3b82f6', width: 3 },
    });
  }

  if (critical_point) {
    traces.push({
      x: [critical_point.T],
      y: [critical_point.P],
      mode: 'markers',
      name: 'Critical Point',
      marker: { color: '#f59e0b', size: 12, symbol: 'star' },
    });
  }

  const layout = {
    title: {
      text: 'P-T Phase Envelope',
      font: { color: '#1f2937', size: 18, family: 'sans-serif' },
      x: 0.05,
      xanchor: 'left',
    },
    paper_bgcolor: '#ffffff',
    plot_bgcolor: '#ffffff',
    font: { color: '#374151', family: 'sans-serif' },
    xaxis: {
      title: 'Temperature (°F)',
      gridcolor: '#e5e7eb',
      zerolinecolor: '#d1d5db',
    },
    yaxis: {
      title: 'Pressure (psi)',
      gridcolor: '#e5e7eb',
      zerolinecolor: '#d1d5db',
    },
    showlegend: true,
    legend: {
      x: 1,
      xanchor: 'right',
      y: 1,
      bgcolor: 'rgba(255, 255, 255, 0.5)',
      bordercolor: '#d1d5db',
      borderwidth: 1,
    },
    shapes: cricondentherm ? [
      {
        type: 'line',
        x0: cricondentherm,
        x1: cricondentherm,
        y0: 0,
        y1: 1,
        yref: 'paper',
        line: {
          color: '#16a34a',
          width: 2,
          dash: 'dash',
        },
      },
    ] : [],
    annotations: cricondentherm ? [
      {
        x: cricondentherm,
        y: 1.05,
        yref: 'paper',
        text: `Cricondentherm: ${cricondentherm.toFixed(1)}°F`,
        showarrow: false,
        font: {
          color: '#15803d',
          size: 12,
        },
      },
    ] : [],
    margin: { l: 65, r: 20, b: 50, t: 50, pad: 4 },
    autosize: true,
  };

  return (
    <div className="bg-white p-2 rounded-lg h-96 border border-slate-200 shadow-md">
      <Plot
        divId={plotId}
        data={traces}
        layout={layout}
        useResizeHandler={true}
        style={{ width: '100%', height: '100%' }}
        config={{ responsive: true, displaylogo: false }}
      />
    </div>
  );
};

export default PhaseEnvelopePlot;