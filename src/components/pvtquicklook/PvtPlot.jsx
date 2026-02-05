import React from 'react';
import Plotly from 'plotly.js-dist-min';
import createPlotlyComponent from 'react-plotly.js/factory';
const Plot = createPlotlyComponent(Plotly);

const PvtPlot = ({ plotId, title, pressureData, yData, yAxisTitle, bubblePoint }) => {
  const plotData = [
    {
      x: pressureData,
      y: yData,
      type: 'scatter',
      mode: 'lines',
      line: {
        color: '#8b5cf6',
        width: 2.5,
      },
      fill: 'tozeroy',
      fillcolor: 'rgba(139, 92, 246, 0.1)',
    },
  ];

  const layout = {
    title: {
      text: title,
      font: { color: '#e2e8f0', size: 16, family: 'sans-serif' },
      x: 0.05,
      xanchor: 'left',
    },
    paper_bgcolor: 'rgba(0,0,0,0)',
    plot_bgcolor: 'rgba(0,0,0,0)',
    font: { color: '#94a3b8', family: 'sans-serif' },
    xaxis: {
      title: 'Pressure (psi)',
      gridcolor: 'rgba(255, 255, 255, 0.1)',
      zerolinecolor: 'rgba(255, 255, 255, 0.2)',
    },
    yaxis: {
      title: yAxisTitle,
      gridcolor: 'rgba(255, 255, 255, 0.1)',
      zerolinecolor: 'rgba(255, 255, 255, 0.2)',
    },
    shapes: bubblePoint ? [
      {
        type: 'line',
        x0: bubblePoint,
        x1: bubblePoint,
        y0: 0,
        y1: 1,
        yref: 'paper',
        line: {
          color: '#f59e0b',
          width: 2,
          dash: 'dash',
        },
      },
    ] : [],
    annotations: bubblePoint ? [
      {
        x: bubblePoint,
        y: 1.05,
        yref: 'paper',
        text: `Pb: ${bubblePoint.toFixed(0)} psi`,
        showarrow: false,
        font: {
          color: '#f59e0b',
          size: 12,
        },
      },
    ] : [],
    margin: { l: 65, r: 20, b: 50, t: 50, pad: 4 },
    autosize: true,
  };

  return (
    <div className="bg-white/5 p-2 rounded-lg h-80 border border-white/10 shadow-md">
      <Plot
        divId={plotId}
        data={plotData}
        layout={layout}
        useResizeHandler={true}
        style={{ width: '100%', height: '100%' }}
        config={{ responsive: true, displaylogo: false }}
      />
    </div>
  );
};

export default PvtPlot;