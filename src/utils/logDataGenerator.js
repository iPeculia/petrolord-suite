export const generateLogData = (inputs) => {
  const { startDepth, endDepth } = inputs;
  const depth = [];
  const gr = [];
  const resd = [];
  const rhob = [];
  const nphi = [];
  const anomalies = {
    gr: [],
    rhob: [],
  };

  const step = 0.5;
  const count = (endDepth - startDepth) / step;

  for (let i = 0; i < count; i++) {
    const currentDepth = startDepth + i * step;
    depth.push(currentDepth);

    let grVal = 40 + 20 * Math.sin(i / 50) + Math.random() * 10;
    let resdVal = 20 * Math.exp(i / (count * 0.8)) + Math.random() * 5;
    let rhobVal = 2.4 + 0.2 * Math.cos(i / 30) + (Math.random() - 0.5) * 0.05;
    let nphiVal = 0.3 - 0.15 * Math.cos(i / 30) + (Math.random() - 0.5) * 0.03;
    
    // Introduce spike
    if (i > count * 0.3 && i < count * 0.3 + 2) {
      grVal = 150;
      anomalies.gr.push({ depth: currentDepth, value: grVal });
    }

    // Introduce flatline
    if (i > count * 0.6 && i < count * 0.65) {
      rhobVal = 2.65;
      if (i === Math.floor(count * 0.6) + 1) { // Log flatline once
          anomalies.rhob.push({ depth: currentDepth, value: rhobVal, type: 'flat' });
      }
    }

    gr.push(grVal);
    resd.push(resdVal);
    rhob.push(rhobVal);
    nphi.push(nphiVal);
  }

  const logPlot = {
    data: [
      { x: gr, y: depth, name: 'GR', xaxis: 'x1', yaxis: 'y1', type: 'scatter', mode: 'lines', line: { color: 'green' } },
      { x: resd, y: depth, name: 'RESD', xaxis: 'x2', yaxis: 'y1', type: 'scatter', mode: 'lines', line: { color: 'red' } },
      { x: rhob, y: depth, name: 'RHOB', xaxis: 'x3', yaxis: 'y1', type: 'scatter', mode: 'lines', line: { color: 'blue' } },
      { x: nphi, y: depth, name: 'NPHI', xaxis: 'x3', yaxis: 'y1', type: 'scatter', mode: 'lines', line: { color: 'purple', dash: 'dot' } },
      // Anomalies
      { x: anomalies.gr.map(a => a.value), y: anomalies.gr.map(a => a.depth), mode: 'markers', name: 'GR Spike', type: 'scatter', xaxis: 'x1', yaxis: 'y1', marker: { color: 'orange', size: 10, symbol: 'x' } },
      // Highlight flatline area
      { x: [2.0, 2.9], y: [startDepth + (count*0.6)*step, startDepth + (count*0.65)*step], type: 'scatter', fill: 'tozeroy', fillcolor: 'rgba(255, 0, 0, 0.2)', line: {color: 'transparent'}, showlegend: false, xaxis: 'x3', yaxis: 'y1', name: 'RHOB Flatline' },
    ],
    layout: {
      height: 600,
      yaxis: { domain: [0, 1], autorange: 'reversed', title: 'Depth (m)' },
      xaxis1: { domain: [0, 0.25], title: 'GR (API)' },
      xaxis2: { domain: [0.3, 0.6], title: 'Resistivity (ohm.m)', type: 'log' },
      xaxis3: { domain: [0.65, 1], title: 'RHOB / NPHI' },
      legend: { orientation: 'h', y: 1.1, x: 0.5, xanchor: 'center' },
      grid: { rows: 1, columns: 3, pattern: 'independent' },
      margin: { t: 60, b: 40, l: 40, r: 20 },
    },
  };
  
  const crossPlot = {
      data: [{
          x: nphi,
          y: rhob,
          mode: 'markers',
          type: 'scatter',
          marker: { color: '#a3e635', size: 5, opacity: 0.7 }
      }],
      layout: {
          title: 'RHOB vs NPHI Cross-plot',
          xaxis: { title: 'NPHI (v/v)' },
          yaxis: { title: 'RHOB (g/cm3)', autorange: 'reversed' }
      }
  };

  const qcSummary = [
    { curve: 'GR', spikes: '1', flatLines: '0', missing: '0.0%' },
    { curve: 'RESD', spikes: '0', flatLines: '0', missing: '0.0%' },
    { curve: 'RHOB', spikes: '0', flatLines: '1', missing: '0.0%' },
    { curve: 'NPHI', spikes: '0', flatLines: '0', missing: '0.0%' },
  ];
  
  const getStats = (arr) => ({
      min: Math.min(...arr).toFixed(2),
      max: Math.max(...arr).toFixed(2),
      mean: (arr.reduce((a,b) => a+b, 0) / arr.length).toFixed(2)
  });

  const stats = [
      { curve: "GR", ...getStats(gr) },
      { curve: "RESD", ...getStats(resd) },
      { curve: "RHOB", ...getStats(rhob) },
      { curve: "NPHI", ...getStats(nphi) },
  ];

  return { inputs, logPlot, qcSummary, stats, crossPlot };
};