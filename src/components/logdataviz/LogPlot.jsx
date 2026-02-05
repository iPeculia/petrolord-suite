import React from 'react';
import Plot from 'react-plotly.js';

const LogPlot = ({ logData, anomalies, curves }) => {
  const depth = logData.DEPT;

  const curveConfigs = {
    GR: { domain: [0, 0.15], range: [0, 200], color: 'green', name: 'Gamma Ray' },
    ILD: { domain: [0.2, 0.5], range: [0.2, 2000], type: 'log', color: 'red', name: 'Resistivity (Deep)' },
    ILM: { domain: [0.2, 0.5], range: [0.2, 2000], type: 'log', color: 'blue', name: 'Resistivity (Medium)' },
    NPHI: { domain: [0.55, 0.8], range: [0.45, -0.15], color: 'blue', name: 'Neutron Porosity' },
    RHOB: { domain: [0.55, 0.8], range: [1.95, 2.95], color: 'red', name: 'Bulk Density' },
    DT: { domain: [0.85, 1], range: [140, 40], color: 'purple', name: 'Sonic' },
  };

  const activeCurves = curves.filter(c => logData[c] && curveConfigs[c]);

  const plotData = activeCurves.map((curve, i) => ({
    x: logData[curve],
    y: depth,
    name: curve,
    xaxis: `x${i + 1}`,
    yaxis: 'y1',
    type: 'scatter',
    mode: 'lines',
    line: { color: curveConfigs[curve].color },
  }));

  if (curves.includes('GR')) {
    plotData.push({
      x: anomalies.filter(a => a.curve === 'GR').map(a => a.value),
      y: anomalies.filter(a => a.curve === 'GR').map(a => a.depth),
      xaxis: 'x1',
      yaxis: 'y1',
      name: 'Anomalies',
      mode: 'markers',
      type: 'scatter',
      marker: { color: 'red', size: 8, symbol: 'x' },
    });
  }


  const layout = {
    height: 600,
    showlegend: false,
    grid: {
      rows: 1,
      columns: activeCurves.length,
      pattern: 'independent',
    },
    yaxis: {
      autorange: 'reversed',
      title: { text: 'Depth (m)', font: { color: '#333' } },
      tickfont: { color: '#555' },
      gridcolor: '#eee',
    },
    paper_bgcolor: '#fff',
    plot_bgcolor: '#fff',
    font: { color: '#333' },
    margin: { l: 50, r: 20, t: 50, b: 50 },
  };

  activeCurves.forEach((curve, i) => {
    layout[`xaxis${i + 1}`] = {
      title: { text: curveConfigs[curve].name, font: { color: '#333' } },
      domain: curveConfigs[curve].domain,
      range: curveConfigs[curve].range,
      type: curveConfigs[curve].type || 'linear',
      linecolor: '#555',
      tickcolor: '#555',
      gridcolor: '#eee',
    };
  });

  return (
    <Plot
      data={plotData}
      layout={layout}
      useResizeHandler={true}
      className="w-full h-full"
    />
  );
};

export default LogPlot;