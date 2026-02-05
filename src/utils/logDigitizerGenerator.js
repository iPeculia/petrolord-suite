export const generateLogDigitizerData = (inputs) => {
  const startDepth = 5000;
  const endDepth = 5500;
  const step = inputs.outputSampleInterval || 0.5;
  const numSamples = (endDepth - startDepth) / step;

  const depth = Array.from({ length: numSamples }, (_, i) => startDepth + i * step);
  
  const gr = depth.map(d => 45 + 30 * Math.sin((d - 5000) / 50) + (d > 5200 && d < 5350 ? 50 : 0) + (Math.random() - 0.5) * 5);
  const res = depth.map(d => 20 * Math.exp((d - 5000) / 500) + (d > 5200 && d < 5350 ? -15 : 0) + (Math.random() - 0.5) * 2);
  const den = depth.map(d => 2.45 - 0.2 * Math.sin((d - 5000) / 50) - (d > 5200 && d < 5350 ? 0.2 : 0) + (Math.random() - 0.5) * 0.05);
  const neu = depth.map(d => 0.2 + 0.15 * Math.sin((d - 5000) / 50) + (d > 5200 && d < 5350 ? 0.1 : 0) + (Math.random() - 0.5) * 0.03);

  const logPlot = {
    data: [
      {
        x: gr,
        y: depth,
        xaxis: 'x1',
        yaxis: 'y1',
        type: 'scatter',
        mode: 'lines',
        name: 'GR',
        line: { color: '#16a34a' }
      },
      {
        x: res,
        y: depth,
        xaxis: 'x2',
        yaxis: 'y1',
        type: 'scatter',
        mode: 'lines',
        name: 'RES',
        line: { color: '#ef4444' }
      },
      {
        x: den,
        y: depth,
        xaxis: 'x3',
        yaxis: 'y1',
        type: 'scatter',
        mode: 'lines',
        name: 'DEN',
        line: { color: '#3b82f6' }
      },
      {
        x: neu,
        y: depth,
        xaxis: 'x3',
        yaxis: 'y1',
        type: 'scatter',
        mode: 'lines',
        name: 'NEU',
        line: { color: '#f97316', dash: 'dash' }
      }
    ],
    layout: {
      title: 'Digitized Well Log',
      height: 800,
      grid: {
        rows: 1,
        columns: 3,
        pattern: 'independent',
      },
      yaxis: { autorange: 'reversed', title: 'Depth (ft)', domain: [0, 1] },
      xaxis1: { title: 'GR (API)', domain: [0, 0.3] },
      xaxis2: { title: 'Resistivity (ohm.m)', type: 'log', domain: [0.35, 0.65] },
      xaxis3: { title: 'Porosity Logs', domain: [0.7, 1] },
      legend: { orientation: 'h', y: 1.05, x: 0.5, xanchor: 'center' }
    }
  };

  return { inputs, logPlot };
};