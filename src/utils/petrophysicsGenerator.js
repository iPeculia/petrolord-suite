export const generatePetrophysicsData = (inputs) => {
  const { grMatrix, grShale, matrixDensity, fluidDensity, rw, a, m, n } = inputs;
  const startDepth = 2000;
  const endDepth = 2200;
  const step = 0.5;
  const count = (endDepth - startDepth) / step;

  const depth = [];
  const gr = [];
  const resd = [];
  const rhob = [];
  const nphi = [];
  const vsh = [];
  const phi = [];
  const sw = [];
  const sh = [];

  for (let i = 0; i < count; i++) {
    const currentDepth = startDepth + i * step;
    depth.push(currentDepth);

    const baseGr = 30 + 60 * (Math.sin(i / 40) + 1) / 2;
    const grVal = baseGr + (Math.random() - 0.5) * 5;
    gr.push(grVal);

    const vshVal = Math.max(0, Math.min(1, (grVal - grMatrix) / (grShale - grMatrix)));
    vsh.push(vshVal);

    const baseRhob = 2.65 - vshVal * 0.3 - 0.4 * (1 - vshVal) * (Math.sin(i / 30) + 1) / 2;
    const rhobVal = baseRhob + (Math.random() - 0.5) * 0.02;
    rhob.push(rhobVal);

    const baseNphi = 0.45 * vshVal + 0.25 * (1 - vshVal) * (Math.sin(i / 30) + 1) / 2;
    const nphiVal = baseNphi + (Math.random() - 0.5) * 0.02;
    nphi.push(nphiVal);

    const phiD = (matrixDensity - rhobVal) / (matrixDensity - fluidDensity);
    const phiN = nphiVal;
    const phiVal = Math.sqrt((phiD*phiD + phiN*phiN) / 2);
    phi.push(phiVal);

    const baseResd = 0.5 / (phiVal**m) + vshVal * 5;
    const resdVal = baseResd * (1 + (Math.random() - 0.2) * 0.5);
    resd.push(resdVal);

    const swVal = Math.min(1, Math.pow((a * rw) / (Math.pow(phiVal, m) * resdVal), 1 / n));
    sw.push(swVal);
    sh.push(1 - swVal);
  }

  const logPlot = {
    data: [
      { x: gr, y: depth, name: 'GR', xaxis: 'x1', yaxis: 'y1', type: 'scatter', mode: 'lines', line: { color: '#4ade80' } },
      { x: resd, y: depth, name: 'RESD', xaxis: 'x2', yaxis: 'y1', type: 'scatter', mode: 'lines', line: { color: '#f87171' } },
      { x: rhob, y: depth, name: 'RHOB', xaxis: 'x3', yaxis: 'y1', type: 'scatter', mode: 'lines', line: { color: '#60a5fa' } },
      { x: nphi, y: depth, name: 'NPHI', xaxis: 'x3', yaxis: 'y1', type: 'scatter', mode: 'lines', line: { color: '#c084fc', dash: 'dot' } },
      { x: vsh, y: depth, name: 'Vsh', xaxis: 'x4', yaxis: 'y1', type: 'scatter', mode: 'lines', line: { color: '#facc15' }, fill: 'tozeroy', fillcolor: 'rgba(250, 204, 21, 0.2)' },
      { x: phi, y: depth, name: 'Phi', xaxis: 'x5', yaxis: 'y1', type: 'scatter', mode: 'lines', line: { color: '#38bdf8' } },
      { x: sw, y: depth, name: 'Sw', xaxis: 'x6', yaxis: 'y1', type: 'scatter', mode: 'lines', line: { color: '#2dd4bf' }, fill: 'tozeroy', fillcolor: 'rgba(45, 212, 191, 0.2)' },
      { x: sh.map(() => 1), y: depth, name: 'Sh', xaxis: 'x6', yaxis: 'y1', type: 'scatter', mode: 'lines', line: { color: 'transparent' }, fill: 'tozeroy', fillcolor: 'rgba(248, 113, 113, 0.2)', hoverinfo: 'none' },
    ],
    layout: {
      height: 600,
      yaxis: { domain: [0, 1], autorange: 'reversed', title: 'Depth (m)' },
      xaxis1: { domain: [0, 0.15], title: 'GR' },
      xaxis2: { domain: [0.16, 0.31], title: 'Resistivity', type: 'log' },
      xaxis3: { domain: [0.32, 0.47], title: 'D-N' },
      xaxis4: { domain: [0.48, 0.63], title: 'Vsh' },
      xaxis5: { domain: [0.64, 0.79], title: 'Porosity' },
      xaxis6: { domain: [0.80, 1], title: 'Saturation' },
      legend: { orientation: 'h', y: 1.1, x: 0.5, xanchor: 'center' },
      grid: { rows: 1, columns: 6, pattern: 'independent' },
      margin: { t: 60, b: 40, l: 40, r: 20 },
    },
  };
  
  const crossPlot = {
      data: [{
          x: nphi,
          y: rhob,
          mode: 'markers',
          type: 'scattergl',
          marker: { color: gr, colorscale: 'Viridis', showscale: true, colorbar: { title: 'GR' }, size: 8, opacity: 0.8 }
      }],
      layout: {
          title: 'Neutron-Density Cross-plot',
          xaxis: { title: 'NPHI (v/v)' },
          yaxis: { title: 'RHOB (g/cm3)', autorange: 'reversed' }
      }
  };

  const kpis = {
    avgPorosity: (phi.reduce((a, b) => a + b, 0) / phi.length * 100).toFixed(1),
    avgSw: (sw.reduce((a, b) => a + b, 0) / sw.length * 100).toFixed(1),
    avgVsh: (vsh.reduce((a, b) => a + b, 0) / vsh.length * 100).toFixed(1),
    netPay: (phi.filter((p, i) => p > 0.1 && sw[i] < 0.5 && vsh[i] < 0.4).length * step).toFixed(1),
  };

  return { inputs, logPlot, crossPlot, kpis };
};